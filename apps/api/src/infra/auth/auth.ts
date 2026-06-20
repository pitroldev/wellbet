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
  /** Em produção forçamos cookies `Secure` e CSRF estrito. */
  readonly isProduction: boolean;
}

/** Constrói a instância do Better Auth amarrada ao Drizzle/Postgres. */
export function buildAuth(opts: BuildAuthOptions) {
  return betterAuth({
    secret: opts.secret,
    baseURL: opts.baseUrl,
    // `trustedOrigins` é a base da proteção CSRF do Better Auth: o header
    // Origin de qualquer requisição mutante com cookie é validado contra esta
    // lista. Por padrão o Better Auth já confia no `baseURL`; mantemos
    // explícito para deixar claro que a checagem está LIGADA (não desabilitamos
    // `advanced.disableCSRFCheck`, que fica no default `false`).
    trustedOrigins: [opts.baseUrl],
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
    user: {
      // RBAC mínimo (@charya/schemas `Role`): o papel vive na sessão do
      // Better Auth para o middleware popular `req.user.role` sem um round-trip
      // extra ao banco. `input: false` impede que o cliente escolha o próprio
      // papel no signup (escalonamento de privilégio); a promoção a
      // reviewer/admin é feita fora do fluxo público (admin console / seed).
      additionalFields: {
        role: {
          type: ["user", "reviewer", "admin"],
          required: false,
          input: false,
          defaultValue: "user",
        },
      },
    },
    session: {
      // Sessão via cookie httpOnly; compartilhada api↔admin.
      expiresIn: 60 * 60 * 24 * 7, // 7 dias
      updateAge: 60 * 60 * 24, // renova a cada 1 dia
    },
    // Rate limit do Better Auth para as rotas /api/auth/* — elas são servidas
    // pelo handler do Better Auth (middleware Express) ANTES do roteamento do
    // Nest, então o ThrottlerGuard do Nest NÃO as cobre. Aplicamos aqui o
    // limite estrito de credenciais (~10/min) para mitigar brute-force/
    // credential-stuffing no login e cadastro.
    rateLimit: {
      // Liga em qualquer ambiente (o default só liga em produção). Em memória
      // por padrão; em multi-instância migrar para secondary-storage.
      // TODO(security): com >1 réplica, configurar `storage: "secondary-storage"`
      // (Redis) para o rate limit ser global e não por-processo.
      enabled: true,
      window: 60, // segundos
      max: 100, // limite geral das rotas de auth
      customRules: {
        "/sign-in/email": { window: 60, max: 10 },
        "/sign-up/email": { window: 60, max: 10 },
        "/forget-password": { window: 60, max: 10 },
        "/reset-password": { window: 60, max: 10 },
      },
    },
    advanced: {
      // Cookies de sessão endurecidos:
      //  - `httpOnly`  → não acessível por JS (mitiga XSS roubando a sessão).
      //  - `sameSite: 'lax'` → bloqueia envio cross-site em navegação top-level
      //    perigosa (CSRF) mas permite o fluxo de login normal e GETs de mesmo
      //    site. ('strict' quebraria links externos para a app; 'none' exigiria
      //    `secure` e abriria cross-site — evitado.)
      //  - `secure`    → só sob TLS em produção (ver `useSecureCookies`).
      // Estes já são os defaults do Better Auth; tornamos explícito por ser uma
      // superfície de segurança crítica.
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "lax",
        secure: opts.isProduction,
      },
      // Força a flag `Secure` em produção (em dev http://localhost não teria
      // TLS, então deixamos o Better Auth decidir pelo ambiente).
      useSecureCookies: opts.isProduction,
      // `disableCSRFCheck` permanece no default `false` → validação de Origin +
      // Fetch Metadata ATIVA para requisições mutantes com cookie.
    },
  });
}

export type Auth = ReturnType<typeof buildAuth>;

/** Token de DI da instância de auth. */
export const AUTH = Symbol("AUTH");
