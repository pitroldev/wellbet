import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Env de SERVIDOR — variáveis sensíveis, validadas no boot via Zod 4
 * (Standard Schema). Importado APENAS por código que roda no servidor:
 *
 *   - `apps/api`   → importa este módulo (`@charya/env/server`).
 *   - `apps/admin` → pode importar este módulo APENAS em código server-side
 *                    (Server Components / route handlers); o client usa `./client`.
 *
 * Fronteira de env explícita: nada aqui pode vazar para o bundle do cliente.
 * Se uma variável precisa ser exposta ao browser, ela mora em `client.ts`
 * sob o prefixo `NEXT_PUBLIC_`.
 *
 * `mobile` (Expo) NÃO usa este módulo: env pública do app vai por
 * `app.config.ts` (`expo.extra` / `EXPO_PUBLIC_*`), nunca segredos de servidor.
 */
export const serverEnv = createEnv({
  /**
   * Variáveis disponíveis somente no servidor. Acesso a qualquer uma destas
   * a partir de código de cliente é proibido (o t3-env lança em runtime).
   */
  server: {
    // --- Banco de dados (Postgres — Neon / Cloud SQL) ---
    DATABASE_URL: z.url().startsWith("postgres", {
      message: "DATABASE_URL deve ser uma connection string Postgres",
    }),

    // --- Storage S3-compatível (Cloudflare R2 / MinIO; vocabulário STORAGE_*) ---
    // Vocabulário único STORAGE_* (R2 é só o provider). A api lê exatamente
    // estes nomes (ver r2-storage.adapter.ts) e o .env.example também.
    STORAGE_ENDPOINT: z.url(),
    STORAGE_REGION: z.string().min(1).default("auto"),
    STORAGE_BUCKET: z.string().min(1),
    STORAGE_ACCESS_KEY_ID: z.string().min(1),
    STORAGE_SECRET_ACCESS_KEY: z.string().min(1),
    // URLs pré-assinadas: validade padrão em segundos.
    STORAGE_PRESIGN_TTL_SECONDS: z.coerce.number().int().positive().default(900),

    // --- Better Auth (self-hosted; pinar core ≥ 1.6.14, ver §2 da Arquitetura) ---
    BETTER_AUTH_SECRET: z.string().min(32, "BETTER_AUTH_SECRET deve ter ao menos 32 caracteres"),
    BETTER_AUTH_URL: z.url(),
    // Origem do console admin (Next.js). No dev roda em :3001 (a api ocupa :3000),
    // logo é cross-origin: usada para (1) liberar CORS com credenciais na api e
    // (2) entrar nos `trustedOrigins` do Better Auth (checagem de Origin/CSRF no
    // login). Em prod, a origem pública do admin.
    ADMIN_ORIGIN: z.url().default("http://localhost:3001"),

    // --- Logging ---
    LOG_LEVEL: z
      .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
      .default("info"),

    // --- Observabilidade (OpenTelemetry → OTLP) ---
    // Liga/desliga o SDK. `false` → no-op (ver observability/otel.ts).
    // Coerção robusta de string→bool: `z.coerce.boolean()` trata QUALQUER string
    // não-vazia (inclusive "false") como `true` — armadilha conhecida do Zod.
    // Por isso parseamos "true"/"1" explicitamente.
    OTEL_ENABLED: z
      .enum(["true", "false", "1", "0"])
      .default("false")
      .transform((v) => v === "true" || v === "1"),
    OTEL_SERVICE_NAME: z.string().min(1).default("charya-api"),
    // Endpoint base do collector (ex.: http://localhost:4318). O exporter de
    // traces deriva `/v1/traces` a partir deste valor. Opcional: sem endpoint,
    // o SDK roda em modo no-op/console.
    OTEL_EXPORTER_OTLP_ENDPOINT: z.url().optional(),
    // Protocolo do exporter OTLP. Mantido na fronteira tipada (o SDK também o
    // honra nativamente). `http/protobuf` casa o pacote exporter-trace-otlp-proto.
    OTEL_EXPORTER_OTLP_PROTOCOL: z
      .enum(["http/protobuf", "grpc", "http/json"])
      .default("http/protobuf"),

    // --- Regra de sanidade (plausibilidade de peso, doc de Validação §6) ---
    // Perda/semana acima da qual o sistema BLOQUEIA automaticamente (kg/semana).
    WEIGHT_HARD_LIMIT_KG_PER_WEEK: z.coerce.number().positive().default(4),

    // --- Desafio dinâmico (código/nonce, doc de Validação §4) ---
    CHALLENGE_CODE_TTL_SECONDS: z.coerce.number().int().positive().default(120),

    // --- Pagamentos (Stark Bank — Pix in/out) ---
    // Sandbox por padrão. PROJECT_ID/PRIVATE_KEY são opcionais para a api SUBIR
    // sem pagamentos no dev; o StarkBankPaymentAdapter falha com erro claro se
    // for usado sem credencial. Em produção vêm do Secret Manager.
    STARKBANK_ENVIRONMENT: z.enum(["sandbox", "production"]).default("sandbox"),
    STARKBANK_PROJECT_ID: z.string().min(1).optional(),
    // Chave privada EC (PEM) do projeto Stark Bank — SEGREDO.
    STARKBANK_PRIVATE_KEY: z.string().min(1).optional(),
    // Validade padrão da cobrança Pix (segundos).
    STARKBANK_INVOICE_EXPIRATION_SECONDS: z.coerce.number().int().positive().default(3600),

    // --- Runtime ---
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    PORT: z.coerce.number().int().positive().default(3000),
  },

  /**
   * Fonte das variáveis em runtime. Em Node 24 (type-stripping nativo) lemos
   * direto de `process.env`. Usar o objeto completo aqui (em vez de mapear
   * chave a chave) é seguro porque este módulo só existe no servidor.
   */
  runtimeEnv: process.env,

  /**
   * Trata `""` como `undefined`. Plataformas de deploy frequentemente injetam
   * strings vazias para variáveis "não setadas"; sem isso, `.optional()` e
   * `.default()` não disparariam. Recomendado pelo t3-env.
   */
  emptyStringAsUndefined: true,

  /**
   * Pula a validação quando explicitamente pedido (ex.: lint/build de
   * artefatos que não devem exigir env real). NÃO usar em produção.
   */
  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" || process.env.SKIP_ENV_VALIDATION === "1",
});

export type ServerEnv = typeof serverEnv;
