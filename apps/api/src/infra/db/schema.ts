/**
 * Schema do banco (Drizzle ORM 1.0 RC) — fonte única das tabelas Postgres.
 *
 * `drizzle-zod` deriva validadores a partir destas tabelas (schema único do
 * banco ao input, ver §2 do doc). Os schemas de DOMÍNIO/contrato vivem em
 * `@charya/schemas` (Zod 4); aqui modelamos a persistência e mantemos os dois
 * coerentes (mesmos enums, mesmos campos).
 *
 * Migrações: geradas por `drizzle-kit generate` em ./migrations e aplicadas
 * SOMENTE em step de deploy (nunca auto-migrate em runtime).
 */
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/* --------------------------------- enums ---------------------------------- */

export const userRole = pgEnum("user_role", ["user", "reviewer", "admin"]);

/** Estado da pesagem no fluxo manual-first. */
export const weighinStatus = pgEnum("weighin_status", [
  "pending", // capturada, aguardando regra dura + fila
  "blocked", // bloqueada pela regra de sanidade (§6)
  "in_review", // na fila de revisão humana (§5)
  "approved", // veredito APROVADO
  "rejected", // veredito REPROVADO
  "recapture", // PENDENTE → pede recaptura orientada
]);

/** Qual das 3 capturas (T0/T1/T2 — doc de Validação §3). */
export const weighinKind = pgEnum("weighin_kind", ["baseline", "mid", "final"]);

/** Veredito da revisão humana (§7). */
export const reviewVerdict = pgEnum("review_verdict", [
  "approved", // APROVADO
  "pending", // PENDENTE (recaptura orientada)
  "rejected", // REPROVADO
]);

export const betStatus = pgEnum("bet_status", [
  "pending_payment", // criada, aguardando o pagamento do stake (Pix)
  "open", // stake pago → aposta ativa
  "settling", // liquidando (lock lógico)
  "won", // meta batida → payout
  "lost", // meta não batida
  "voided", // cancelada (ex.: cobrança expirou sem pagamento)
]);

/* -------------------------------- tables ---------------------------------- */

export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    name: text("name"),
    role: userRole("role").notNull().default("user"),
    // CPF/CNPJ (só dígitos) — pagador da cobrança Pix e titular do payout.
    taxId: text("tax_id"),
    // Chave Pix do beneficiário do payout (validada contra o taxId no DICT).
    pixKey: text("pix_key"),
    // Vínculo com o registro de identidade do Better Auth.
    authUserId: text("auth_user_id"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [uniqueIndex("users_email_uq").on(t.email)],
);

export const challenges = pgTable(
  "challenges",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    // Código dinâmico exibido na captura (palavra + número + gesto). Server-side.
    word: text("word").notNull(),
    number: integer("number").notNull(),
    gesture: text("gesture").notNull(),
    // Nonce server-side de uso único.
    nonce: text("nonce").notNull(),
    issuedAt: timestamp("issued_at", { withTimezone: true }).notNull().defaultNow(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    // Uso único: marcado ao ser consumido por uma pesagem.
    consumedAt: timestamp("consumed_at", { withTimezone: true }),
  },
  (t) => [
    uniqueIndex("challenges_nonce_uq").on(t.nonce),
    index("challenges_user_idx").on(t.userId),
  ],
);

export const weighins = pgTable(
  "weighins",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    betId: uuid("bet_id"),
    challengeId: uuid("challenge_id").references(() => challenges.id),
    kind: weighinKind("kind").notNull(),
    // Peso em kg (precisão de balança doméstica).
    weightKg: real("weight_kg").notNull(),
    // Chave do objeto de vídeo no R2 (upload direto via URL pré-assinada).
    videoObjectKey: text("video_object_key").notNull(),
    status: weighinStatus("status").notNull().default("pending"),
    // Resultado da regra dura de sanidade (§6) calculada no submit.
    lossPerWeekKg: real("loss_per_week_kg"),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("weighins_user_idx").on(t.userId),
    index("weighins_status_idx").on(t.status),
    index("weighins_bet_idx").on(t.betId),
  ],
);

export const reviews = pgTable(
  "reviews",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    weighinId: uuid("weighin_id")
      .notNull()
      .references(() => weighins.id),
    reviewerId: uuid("reviewer_id").references(() => users.id),
    verdict: reviewVerdict("verdict"),
    // Motivo do veredito (texto livre do revisor).
    reason: text("reason"),
    // Quais itens do checklist (§5) falharam — dataset da Fase 2 (§9).
    // ex.: ['freshness', 'continuous_video', 'scale_zero', ...]
    failedChecks: jsonb("failed_checks").$type<string[]>(),
    // Resultado tristate item a item (ok/fail/na) — dataset granular da Fase 2 (§9).
    checklist: jsonb("checklist").$type<Record<string, "ok" | "fail" | "na">>(),
    decidedAt: timestamp("decided_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    uniqueIndex("reviews_weighin_uq").on(t.weighinId),
    index("reviews_verdict_idx").on(t.verdict),
  ],
);

export const bets = pgTable(
  "bets",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id),
    // Meta de peso e janela do desafio.
    startWeightKg: real("start_weight_kg"),
    targetWeightKg: real("target_weight_kg").notNull(),
    stakeAmount: numeric("stake_amount", { precision: 12, scale: 2 }).notNull(),
    // Valor pago ao vencedor (MVP: = stake, "recupera o que apostou"; engine de
    // odds/pool é Fase 2). numeric como string p/ precisão.
    payoutAmount: numeric("payout_amount", { precision: 12, scale: 2 }),
    currency: text("currency").notNull().default("BRL"),
    status: betStatus("status").notNull().default("pending_payment"),
    // Pix: id da cobrança do stake (Invoice) e da transferência de payout.
    stakeChargeId: text("stake_charge_id"),
    payoutTransferId: text("payout_transfer_id"),
    settledAt: timestamp("settled_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => [
    index("bets_user_idx").on(t.userId),
    index("bets_status_idx").on(t.status),
    index("bets_stake_charge_idx").on(t.stakeChargeId),
  ],
);

/**
 * Store de idempotência (escrita financeira/settlement, §2 do doc).
 * Implementa o IdempotencyStorePort.
 */
export const idempotencyKeys = pgTable("idempotency_keys", {
  key: text("key").primaryKey(),
  requestHash: text("request_hash").notNull(),
  responseBody: jsonb("response_body"),
  statusCode: integer("status_code").notNull(),
  locked: boolean("locked").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

/* ------------------------------ tipos inferidos ---------------------------- */

export type UserRow = typeof users.$inferSelect;
export type NewUserRow = typeof users.$inferInsert;
export type ChallengeRow = typeof challenges.$inferSelect;
export type NewChallengeRow = typeof challenges.$inferInsert;
export type WeighInRow = typeof weighins.$inferSelect;
export type NewWeighInRow = typeof weighins.$inferInsert;
export type ReviewRow = typeof reviews.$inferSelect;
export type NewReviewRow = typeof reviews.$inferInsert;
export type BetRow = typeof bets.$inferSelect;
export type NewBetRow = typeof bets.$inferInsert;
export type IdempotencyKeyRow = typeof idempotencyKeys.$inferSelect;

/** Schema completo (passado ao drizzle() em client.ts). */
export const schema = {
  users,
  challenges,
  weighins,
  reviews,
  bets,
  idempotencyKeys,
};
