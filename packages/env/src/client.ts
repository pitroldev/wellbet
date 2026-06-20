import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

/**
 * Env de CLIENTE — variáveis seguras para o bundle do browser, validadas no
 * boot via Zod 4. Importado pelo `apps/admin` (Next.js) tanto em código
 * server-side quanto client-side.
 *
 * Fronteira de env explícita:
 *   - TODA variável aqui DEVE ter o prefixo `NEXT_PUBLIC_` (enforced abaixo
 *     via `clientPrefix`). O t3-env recusa, em tempo de tipo e em runtime,
 *     qualquer chave em `client` que não comece com o prefixo.
 *   - Segredos NUNCA entram aqui — vão em `server.ts`.
 *
 * `apps/mobile` (Expo) NÃO usa este módulo: a env pública do app é resolvida
 * via `app.config.ts` (`expo.extra` / `EXPO_PUBLIC_*`). Mantemos o limite de
 * env por plataforma deliberadamente separado.
 */
export const clientEnv = createEnv({
  /**
   * Prefixo obrigatório para variáveis expostas ao cliente. No Next.js,
   * apenas variáveis `NEXT_PUBLIC_*` são inlined no bundle do browser.
   */
  clientPrefix: "NEXT_PUBLIC_",

  /**
   * Variáveis disponíveis no cliente (e no servidor). Todas precisam do
   * prefixo `NEXT_PUBLIC_`.
   */
  client: {
    // URL base da API consumida pelo admin (cliente tipado de @charya/contracts).
    // Default unificado no repo: a api roda em :3000 (ver .env.example/devcontainer).
    NEXT_PUBLIC_API_URL: z.url().default("http://localhost:3000"),

    // URL pública do próprio admin (links, callbacks de auth no browser).
    NEXT_PUBLIC_APP_URL: z.url().optional(),

    // Endpoint público do Better Auth para o front (sessão compartilhada c/ a API).
    NEXT_PUBLIC_AUTH_URL: z.url().optional(),

    // TODO: adicionar chaves públicas de telemetria/analytics conforme entrarem
    // no admin (ex.: NEXT_PUBLIC_OTEL_*), sempre sob o prefixo NEXT_PUBLIC_.
  },

  /**
   * Em bundlers (Next.js) as variáveis `NEXT_PUBLIC_*` são substituídas
   * estaticamente, então mapeamos chave a chave em vez de passar `process.env`
   * inteiro (referências dinâmicas a `process.env[key]` não são inlined).
   */
  runtimeEnv: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },

  /** `""` → `undefined`, igual ao server (ver server.ts). */
  emptyStringAsUndefined: true,

  skipValidation:
    process.env.SKIP_ENV_VALIDATION === "true" || process.env.SKIP_ENV_VALIDATION === "1",
});

export type ClientEnv = typeof clientEnv;
