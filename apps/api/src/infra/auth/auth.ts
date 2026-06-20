/**
 * Wiring do Better Auth (>= 1.6.14) com adapter Postgres/Drizzle.
 *
 * ⚠️ Segurança (doc §10): pinar Better Auth >= 1.6.14 — lote de 15 advisories
 * (SSO/OIDC) de jun/2026. Manter TODOS os pacotes @better-auth/* alinhados.
 *
 * Self-hosted, sessão compartilhada com o admin (mesmo backend). O handler
 * exposto aqui é montado como rota Express em `auth.module.ts` e resolve a
 * sessão que popula `req.user` (ver guards em shared/).
 */
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import type { Database } from "../db/client.js";
import { schema } from "../db/schema.js";

export interface BuildAuthOptions {
  readonly db: Database;
  readonly secret: string;
  readonly baseUrl: string;
}

/** Constrói a instância do Better Auth amarrada ao Drizzle/Postgres. */
export function buildAuth(opts: BuildAuthOptions) {
  return betterAuth({
    secret: opts.secret,
    baseURL: opts.baseUrl,
    database: drizzleAdapter(opts.db, {
      provider: "pg",
      // Reusa o schema do app; Better Auth mapeia suas próprias tabelas.
      // TODO: alinhar nomes de tabela de auth ao schema gerado pelo CLI do
      // Better Auth (`@better-auth/cli generate`) e versionar via drizzle-kit.
      schema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    session: {
      // Sessão via cookie httpOnly; compartilhada api↔admin.
      expiresIn: 60 * 60 * 24 * 7, // 7 dias
      updateAge: 60 * 60 * 24, // renova a cada 1 dia
    },
  });
}

export type Auth = ReturnType<typeof buildAuth>;

/** Token de DI da instância de auth. */
export const AUTH = Symbol("AUTH");
