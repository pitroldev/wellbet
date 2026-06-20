/**
 * @charya/env — fronteira de env tipada e validada (t3-env / Zod 4).
 *
 * Consumo recomendado (mantém a fronteira server/client explícita e evita
 * arrastar segredos para o bundle do browser):
 *
 *   - `apps/api`   → import { serverEnv } from "@charya/env/server";
 *   - `apps/admin` → import { serverEnv } from "@charya/env/server"; // só server-side
 *                    import { clientEnv } from "@charya/env/client"; // server + client
 *   - `apps/mobile`→ NÃO importa este pacote; usa Expo public env (app.config.ts).
 *
 * Este barrel re-exporta ambos por conveniência (ex.: tooling, testes). Em
 * código de aplicação, prefira os subpaths `@charya/env/server` e
 * `@charya/env/client` para garantir que `server.ts` nunca seja puxado para o
 * cliente.
 */
export { serverEnv } from "./server.js";
export type { ServerEnv } from "./server.js";

export { clientEnv } from "./client.js";
export type { ClientEnv } from "./client.js";
