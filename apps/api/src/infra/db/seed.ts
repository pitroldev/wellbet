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

import { eq, inArray } from "drizzle-orm";

import { buildAuth } from "@/infra/auth/auth.js";
import { user as authUser } from "@/infra/db/auth-schema.js";
import { createDb } from "@/infra/db/client.js";
import { bets, users, weighins } from "@/infra/db/schema.js";

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
}

const DEMO: readonly DemoUser[] = [
  { email: "revisor@charya.dev", name: "Rita Revisora", role: "reviewer" },
  {
    email: "ana@charya.dev",
    name: "Ana Silva",
    role: "user",
    taxId: "39053344705",
    pixKey: "ana@charya.dev",
  },
  {
    email: "bruno@charya.dev",
    name: "Bruno Souza",
    role: "user",
    taxId: "11144477735",
    pixKey: "+5511999990000",
  },
];

async function main(): Promise<void> {
  const { db, pool } = createDb(DATABASE_URL as string);
  const auth = buildAuth({ db, secret: SECRET, baseUrl: BASE_URL, isProduction: false });

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
    // Papel (additionalField `input:false` no signup → setamos direto).
    await db.update(authUser).set({ role: u.role }).where(eq(authUser.id, authId));

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
  const userIds = Object.values(domainId);
  await db.delete(weighins).where(inArray(weighins.userId, userIds));
  await db.delete(bets).where(inArray(bets.userId, userIds));

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
      kind: "baseline",
      weightKg: 85,
      videoObjectKey: "seed/ana-baseline.webm",
      status: "approved",
    },
    {
      id: randomUUID(),
      userId: anaId,
      betId: anaBet,
      kind: "mid",
      weightKg: 80.4,
      videoObjectKey: "seed/ana-mid.webm",
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
    kind: "baseline",
    weightKg: 82,
    videoObjectKey: "seed/bruno-baseline.webm",
    status: "in_review",
    lossPerWeekKg: 0,
  });

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
