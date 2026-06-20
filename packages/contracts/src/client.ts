/**
 * @charya/contracts/client — superfície de CONFIGURAÇÃO do cliente HTTP tipado.
 *
 * Subpath estável consumido por admin/mobile (ver
 * `apps/admin/src/shared/api/http.ts`). Mantemos um entrypoint dedicado para o
 * cliente (separado do barrel `.`, que também expõe tipos placeholder) de modo
 * que o import `@charya/contracts/client` permaneça válido antes e depois de
 * `pnpm --filter @charya/contracts generate`.
 *
 * O singleton `client` é o do `@hey-api/client-fetch` — o MESMO que as funções
 * de SDK geradas em `src/generated` consomem. Configurá-lo aqui (via
 * `configureCharyaClient`) é equivalente a configurar `./generated`.
 */
export {
  configureCharyaClient,
  createCharyaClient,
  type CharyaClientOptions,
  type CharyaFetchConfig,
} from "./index.js";

// Re-export do nosso singleton (criado em ./index a partir de createClient()),
// para casar com o uso `import { client } from "@charya/contracts/client";
// client.setConfig(...)`. O client-fetch não exporta mais um singleton global.
export { client } from "./index.js";
