/**
 * @charya/contracts — ponto de entrada público do CONTRATO entre apps.
 *
 * Fluxo (ver README e docs/Charya_Arquitetura_Tecnica.md §5):
 *   apps/api → emite `apps/api/openapi.json` (DB-free: `openapi:emit`)
 *     → `pnpm --filter @charya/contracts generate` (Hey API → `src/generated`)
 *       → mobile/admin importam funções/tipos daqui, tipados de ponta a ponta.
 *
 * O código em `src/generated` é GERADO — não editar à mão. Se o spec da api
 * mudar e o cliente não for regenerado, o type-check (deste pacote e dos
 * consumidores) quebra no CI. É essa quebra que impede o drift de contrato.
 */

import { createClient, createConfig, type Config } from "./generated/client";
import { client } from "./generated/client.gen";

// SDK tipado (funções por operação) + tipos (DTOs) gerados do OpenAPI da api.
export * from "./generated";

// Singleton do client-fetch que as funções de SDK geradas consomem.
export { client };

/** Resposta de erro padronizada da api (envelope `{ code, message, details }`). */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

/** Opções de configuração do cliente Charya, expostas a mobile/admin. */
export interface CharyaClientOptions {
  /** Base URL da api (ex.: `https://api.charya.bet` ou `http://localhost:3000`). */
  baseUrl: string;
  /** Headers estáticos ou resolvidos por request (ex.: `Authorization`). */
  headers?: Config["headers"];
  /** Permite injetar um `fetch` custom (RN/retry/instrumentação). */
  fetch?: Config["fetch"];
}

/**
 * Cria uma INSTÂNCIA isolada do cliente (testes ou múltiplos hosts). A maioria
 * dos apps usa {@link configureCharyaClient} no singleton que o SDK consome.
 */
export function createCharyaClient(options: CharyaClientOptions): ReturnType<typeof createClient> {
  return createClient(toConfig(options));
}

/**
 * Configura o cliente SINGLETON usado pelas funções de SDK geradas. Chamar uma
 * vez no boot do app (mobile/admin):
 *
 * ```ts
 * configureCharyaClient({
 *   baseUrl: env.API_URL,
 *   headers: () => ({ Authorization: `Bearer ${getToken()}` }),
 * });
 * ```
 */
export function configureCharyaClient(options: CharyaClientOptions): void {
  client.setConfig(toConfig(options));
}

/** Normaliza as opções públicas para a `Config` do client-fetch. */
function toConfig(options: CharyaClientOptions): Config {
  return createConfig({
    baseUrl: options.baseUrl,
    headers: options.headers,
    fetch: options.fetch,
  });
}

export type { Config as CharyaFetchConfig } from "./generated/client";
