/**
 * Seed de desenvolvimento — popula o banco local com dados clicáveis.
 *
 * Cria usuários REAIS do Better Auth (email/senha, hash correto) via a própria
 * API do auth, promove papéis (reviewer), liga ao `users` de domínio
 * (`authUserId`, batendo com o getOrCreate do login) e cria apostas + pesagens,
 * com algumas `in_review` para a fila do admin aparecer com conteúdo.
 *
 * Idempotente: re-rodar não duplica (reaproveita usuários e recria as apostas/
 * pesagens demo). Rodar com: `pnpm seed` (raiz) — precisa do Postgres de pé
 * (`pnpm dev:up`) e das migrações aplicadas (`pnpm db:migrate`).
 *
 * NÃO usar em produção (senhas fracas, dados fictícios).
 */
import { randomUUID } from "node:crypto";

import { CreateBucketCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { eq, inArray } from "drizzle-orm";

import { buildAuth } from "@/infra/auth/auth.js";
import { user as authUser } from "@/infra/db/auth-schema.js";
import { createDb } from "@/infra/db/client.js";
import { approvalCriteria, bets, challenges, users, weighins } from "@/infra/db/schema.js";

/** URL de um MP4 público pequeno (qualquer coisa serve — é só pra ter algo no player). */
const SAMPLE_VIDEO_URL =
  "https://test-videos.co.uk/vids/bigbuckbunny/mp4/h264/360/Big_Buck_Bunny_360_10s_1MB.mp4";

/**
 * Sobe um vídeo de exemplo pro storage (MinIO local) sob cada `videoObjectKey`,
 * pra revisão ter o que tocar em vez de um quadro preto. Best-effort: se o
 * storage não estiver configurado ou o download falhar, só avisa e segue.
 */
async function seedSampleVideos(keys: string[]): Promise<void> {
  const endpoint = process.env.STORAGE_ENDPOINT;
  const bucket = process.env.STORAGE_BUCKET;
  const accessKeyId = process.env.STORAGE_ACCESS_KEY_ID;
  const secretAccessKey = process.env.STORAGE_SECRET_ACCESS_KEY;
  if (!endpoint || !bucket || !accessKeyId || !secretAccessKey) {
    console.warn("  storage não configurado — pulei o vídeo de exemplo.");
    return;
  }

  let body: Buffer;
  try {
    const res = await fetch(SAMPLE_VIDEO_URL, { headers: { "User-Agent": "Mozilla/5.0" } });
    if (!res.ok) throw new Error(`HTTP ${String(res.status)}`);
    body = Buffer.from(await res.arrayBuffer());
  } catch (err) {
    console.warn(`  não baixei o vídeo de exemplo (${String(err)}) — pulei o upload.`);
    return;
  }

  const s3 = new S3Client({
    region: process.env.STORAGE_REGION ?? "auto",
    endpoint,
    forcePathStyle: true, // MinIO/R2
    credentials: { accessKeyId, secretAccessKey },
  });
  try {
    await s3.send(new CreateBucketCommand({ Bucket: bucket }));
  } catch {
    /* bucket já existe — ok */
  }
  for (const key of keys) {
    await s3.send(
      new PutObjectCommand({ Bucket: bucket, Key: key, Body: body, ContentType: "video/mp4" }),
    );
  }
  console.log(
    `  vídeo de exemplo enviado p/ ${String(keys.length)} capturas (${(body.length / 1_048_576).toFixed(1)} MB).`,
  );
}

const DATABASE_URL = process.env.DATABASE_URL;
const SECRET = process.env.BETTER_AUTH_SECRET ?? "dev-seed-secret-min-32-characters-aaaa";
const BASE_URL = process.env.BETTER_AUTH_URL ?? "http://localhost:3000";
const PASSWORD = "charya123";

if (DATABASE_URL == null || DATABASE_URL.length === 0) {
  console.error("✗ DATABASE_URL ausente — suba o .env (mise) antes de seedar.");
  process.exit(1);
}

interface DemoUser {
  email: string;
  name: string;
  role: "user" | "reviewer" | "admin";
  taxId?: string;
  pixKey?: string;
  emailVerified?: boolean;
  /** Conta auth SEM perfil de domínio (nunca abriu o app) — demo do estado "órfã". */
  noDomain?: boolean;
  banned?: boolean;
  banReason?: string;
}

const DEMO: readonly DemoUser[] = [
  { email: "revisor@charya.dev", name: "Rita Revisora", role: "reviewer", emailVerified: true },
  {
    email: "ana@charya.dev",
    name: "Ana Silva",
    role: "user",
    taxId: "39053344705",
    pixKey: "ana@charya.dev",
    emailVerified: true,
  },
  {
    email: "bruno@charya.dev",
    name: "Bruno Souza",
    role: "user",
    taxId: "11144477735",
    pixKey: "+5511999990000",
  },
  // Conta completa e verificada (sem apostas) — usuário "saudável".
  {
    email: "carlos@charya.dev",
    name: "Carlos Lima",
    role: "user",
    taxId: "52998224725",
    pixKey: "carlos.lima@gmail.com",
    emailVerified: true,
  },
  // Perfil incompleto + e-mail não verificado — dispara sinais no 360.
  { email: "diana@charya.dev", name: "Diana Costa", role: "user" },
  // Conta órfã: registrou mas nunca abriu o app (sem perfil de domínio).
  { email: "eduardo@charya.dev", name: "Eduardo Novato", role: "user", noDomain: true },
  // Conta BANIDA — demo do bloqueio (não consegue mais usar o app).
  {
    email: "banido@charya.dev",
    name: "Marcos Suspenso",
    role: "user",
    taxId: "29537995015",
    pixKey: "marcos.s@gmail.com",
    emailVerified: true,
    banned: true,
    banReason: "Fraude confirmada na pesagem (terceiro subindo na balança).",
  },
];

/**
 * Critérios de aprovação iniciais (antes hardcoded em CHECKLIST_FLAGS / o
 * console). Agora vivem na tabela `approval_criteria` e são editáveis pelo
 * admin. Seed idempotente: só insere os que faltam (não sobrescreve edições).
 */
const CRITERIA: readonly {
  key: string;
  label: string;
  description: string;
  failHint: string;
  appliesWhen?: "always" | "has_comparison" | "has_previous_weight";
}[] = [
  {
    // O desafio dinâmico é OBRIGATÓRIO em toda captura → freshness é SEMPRE
    // aplicável. Código ausente é ANOMALIA (o revisor reprova), não some.
    key: "freshness",
    label: "Frescor / anti-replay",
    description:
      "O código dinâmico no vídeo é o mesmo emitido para esta sessão e o gesto foi feito.",
    failHint: "Código errado/ausente, gesto não feito.",
  },
  {
    key: "continuous_video",
    label: "Vídeo contínuo",
    description: "Take único, sem corte/emenda; gravado no app (não upload).",
    failHint: "Cortes, reencode de editor, origem externa.",
  },
  {
    key: "scale_zero",
    label: "Balança zerada (âncora do instrumento)",
    description:
      "Antes de subir, balança vazia marca 0,0 limpo e estável; número sai do zero ao subir.",
    failHint: "Não mostra o zero, zero instável/deslocado, ou não está vazia.",
  },
  {
    key: "floor_scene",
    label: "Piso / cena",
    description: "Chão plano e nivelado, balança não inclinada, sem calço/tapete grosso.",
    failHint: "Piso torto, balança tombada, calço aparente.",
  },
  {
    key: "no_body_trick",
    label: "Sem truque de corpo",
    description: "Sobe sem apoio, mãos visíveis, peso estável.",
    failHint: "Apoio em parede/móvel, descarga de peso.",
  },
  {
    key: "display_integrity",
    label: "Visor íntegro",
    description: "Número se firma do zero; sem visor sobreposto (borda/reflexo/fonte estranhos).",
    failHint: "Sinais de display falso.",
  },
  {
    key: "same_person",
    label: "Mesma pessoa",
    description: "Rosto bate entre T0, T1, T2 (comparação visual dos 3 vídeos).",
    failHint: "Pessoa diferente entre capturas.",
    appliesWhen: "has_comparison",
  },
  {
    key: "plausibility",
    label: "Plausibilidade",
    description: "A perda faz sentido fisiológico para o prazo/perfil.",
    failHint: "Perda incompatível (regra dura de sanidade, §6).",
    appliesWhen: "has_previous_weight",
  },
];

async function main(): Promise<void> {
  const { db, pool } = createDb(DATABASE_URL as string);
  const auth = buildAuth({
    db,
    secret: SECRET,
    baseUrl: BASE_URL,
    adminOrigin: BASE_URL,
    isProduction: false,
  });

  // 1) Usuários do Better Auth (idempotente) + papel + usuário de domínio.
  const domainId: Record<string, string> = {};
  for (const u of DEMO) {
    // Cria no Better Auth; se já existe, recupera o id.
    let authId: string;
    try {
      const res = await auth.api.signUpEmail({
        body: { email: u.email, password: PASSWORD, name: u.name },
      });
      authId = res.user.id;
    } catch {
      const [row] = await db.select().from(authUser).where(eq(authUser.email, u.email));
      if (row == null) throw new Error(`Falha ao criar/achar usuário de auth: ${u.email}`);
      authId = row.id;
    }
    // Papel (additionalField `input:false` no signup → setamos direto) + verificação + ban.
    await db
      .update(authUser)
      .set({
        role: u.role,
        emailVerified: u.emailVerified ?? false,
        banned: u.banned ?? false,
        banReason: u.banReason ?? null,
        bannedAt: u.banned ? new Date() : null,
      })
      .where(eq(authUser.id, authId));

    // Conta órfã: não cria perfil de domínio (demo do estado "nunca abriu o app").
    if (u.noDomain) continue;

    // Usuário de DOMÍNIO ligado via authUserId (mesma chave do getOrCreate).
    const [existing] = await db.select().from(users).where(eq(users.authUserId, authId));
    if (existing == null) {
      const id = randomUUID();
      await db.insert(users).values({
        id,
        email: u.email,
        name: u.name,
        role: u.role,
        taxId: u.taxId ?? null,
        pixKey: u.pixKey ?? null,
        authUserId: authId,
      });
      domainId[u.email] = id;
    } else {
      await db
        .update(users)
        .set({ role: u.role, taxId: u.taxId ?? null, pixKey: u.pixKey ?? null })
        .where(eq(users.id, existing.id));
      domainId[u.email] = existing.id;
    }
  }

  // 2) Apostas + pesagens demo — recria (idempotente) para os usuários demo.
  // Ordem de delete respeita as FKs: weighins → challenges → bets.
  const userIds = Object.values(domainId);
  await db.delete(weighins).where(inArray(weighins.userId, userIds));
  await db.delete(challenges).where(inArray(challenges.userId, userIds));
  await db.delete(bets).where(inArray(bets.userId, userIds));

  /**
   * O desafio dinâmico (código anti-replay) é OBRIGATÓRIO em TODA captura. Aqui
   * cada pesagem nasce com um challenge consumido — assim `expectedCode` nunca é
   * null e o critério `freshness` (anti-replay) sempre aparece no checklist.
   */
  async function makeChallenge(
    userId: string,
    word: string,
    n: number,
    gesture: string,
  ): Promise<string> {
    const id = randomUUID();
    const now = new Date();
    await db.insert(challenges).values({
      id,
      userId,
      word,
      number: n,
      gesture,
      nonce: randomUUID(),
      expiresAt: new Date(now.getTime() + 3_600_000),
      consumedAt: now,
    });
    return id;
  }

  const anaId = domainId["ana@charya.dev"]!;
  const brunoId = domainId["bruno@charya.dev"]!;

  // Ana: aposta ATIVA + baseline aprovada + pesagem intermediária NA FILA.
  const anaBet = randomUUID();
  await db.insert(bets).values({
    id: anaBet,
    userId: anaId,
    startWeightKg: 85,
    targetWeightKg: 75,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "open",
  });
  await db.insert(weighins).values([
    {
      id: randomUUID(),
      userId: anaId,
      betId: anaBet,
      challengeId: await makeChallenge(anaId, "girassol", 47, "mão direita no ombro"),
      kind: "baseline",
      weightKg: 85,
      videoObjectKey: "seed/ana-baseline.mp4",
      status: "approved",
    },
    {
      id: randomUUID(),
      userId: anaId,
      betId: anaBet,
      challengeId: await makeChallenge(anaId, "cascata", 12, "polegar para cima"),
      kind: "mid",
      weightKg: 80.4,
      videoObjectKey: "seed/ana-mid.mp4",
      status: "in_review",
      lossPerWeekKg: 1.5,
    },
  ]);

  // Bruno: aposta aguardando pagamento + baseline NA FILA.
  const brunoBet = randomUUID();
  await db.insert(bets).values({
    id: brunoBet,
    userId: brunoId,
    startWeightKg: 82,
    targetWeightKg: 70,
    stakeAmount: "50.00",
    currency: "BRL",
    status: "pending_payment",
  });
  await db.insert(weighins).values({
    id: randomUUID(),
    userId: brunoId,
    betId: brunoBet,
    challengeId: await makeChallenge(brunoId, "tijolo", 83, "mão na cabeça"),
    kind: "baseline",
    weightKg: 82,
    videoObjectKey: "seed/bruno-baseline.mp4",
    status: "in_review",
    lossPerWeekKg: 0,
  });

  // Vídeo de exemplo no storage (MinIO) para a revisão ter o que tocar.
  await seedSampleVideos([
    "seed/ana-baseline.mp4",
    "seed/ana-mid.mp4",
    "seed/bruno-baseline.mp4",
  ]);

  // 3) Critérios de aprovação (idempotente: insere só os que faltam, por key).
  await db
    .insert(approvalCriteria)
    .values(
      CRITERIA.map((c, i) => ({
        ...c,
        sortOrder: i,
        enabled: true,
        appliesWhen: c.appliesWhen ?? "always",
      })),
    )
    .onConflictDoNothing({ target: approvalCriteria.key });

  await pool.end();

  console.log("✓ seed concluído.");
  console.log("  Admin (revisor):  revisor@charya.dev / charya123  → http://localhost:3001");
  console.log("  Usuários:         ana@charya.dev, bruno@charya.dev / charya123");
  console.log("  Fila de revisão:  2 pesagens in_review · Apostas: 2");
}

main().catch((err: unknown) => {
  console.error("✗ seed falhou:", err);
  process.exit(1);
});
