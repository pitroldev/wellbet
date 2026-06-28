/**
 * Tabelas do Better Auth (core, >= 1.6): `user`, `session`, `account`,
 * `verification`. Ficam SEPARADAS das tabelas de domínio (schema.ts); a `users`
 * de domínio referencia o `user` de auth via `authUserId`.
 *
 * As CHAVES JS (id, emailVerified, createdAt, …) são os nomes dos campos que o
 * Better Auth espera — o adapter Drizzle mapeia por elas. Datas em `mode: "date"`
 * (o Better Auth compara `expiresAt` como Date). drizzle-kit gera a migração
 * destas tabelas porque o `drizzle.config.ts` inclui este arquivo.
 */
import { boolean, pgTable, text, timestamp } from "drizzle-orm/pg-core";

const ts = (name: string) => timestamp(name, { withTimezone: true, mode: "date" });

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  // RBAC — additionalField `role` do auth.ts (user | reviewer | admin).
  role: text("role").notNull().default("user"),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: ts("expires_at").notNull(),
  token: text("token").notNull().unique(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: ts("access_token_expires_at"),
  refreshTokenExpiresAt: ts("refresh_token_expires_at"),
  scope: text("scope"),
  // Hash da senha (login email/senha). O Better Auth gera/valida.
  password: text("password"),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: ts("expires_at").notNull(),
  createdAt: ts("created_at").notNull().defaultNow(),
  updatedAt: ts("updated_at").notNull().defaultNow(),
});

/** Schema de auth passado ao `drizzleAdapter` (auth.ts). */
export const authSchema = { user, session, account, verification };
