/**
 * @charya/contracts — ponto de entrada público do CONTRATO entre apps.
 *
 * Fluxo (ver README e docs/Charya_Arquitetura_Tecnica.md §5):
 *   apps/api build → emite `apps/api/openapi.json`
 *     → `pnpm --filter @charya/contracts generate` (Hey API → `src/generated`)
 *       → mobile/admin importam funções/tipos daqui, tipados de ponta a ponta.
 *
 * O código em `src/generated` é GERADO — não editar à mão. Se o spec da api
 * mudar e o cliente não for regenerado, o type-check (deste pacote e dos
 * consumidores) quebra no CI. É essa quebra que impede o drift de contrato.
 */

import { createClient, createConfig } from "@hey-api/client-fetch";
import type { Config } from "@hey-api/client-fetch";

/**
 * Cliente HTTP SINGLETON do contrato. As funções de SDK geradas (`src/generated`)
 * consomem este cliente após {@link configureCharyaClient}. Substitui o antigo
 * singleton global do `@hey-api/client-fetch` (removido na lib): agora criamos o
 * nosso com `createClient()` e o configuramos no boot do app.
 */
export const client = createClient();

// -----------------------------------------------------------------------------
// Re-export do cliente gerado
// -----------------------------------------------------------------------------
// TODO: rodar `pnpm --filter @charya/contracts generate` e então descomentar.
//       Até gerar, `src/generated` só tem `.gitkeep` e o re-export abaixo
//       quebraria o type-check — por isso fica comentado de propósito.
//
// export * from './generated';
//
// O Hey API (client-fetch) gera um singleton `client` em `src/generated/client.gen.ts`
// e funções de SDK por operação (ex.: `getWeighinById`, `createWeighin`). Os
// consumidores configuram o singleton via `configureCharyaClient` (abaixo) e
// chamam as funções de SDK diretamente.

// -----------------------------------------------------------------------------
// Tipos placeholder (substituídos pelos tipos REAIS de `./generated` ao gerar)
// -----------------------------------------------------------------------------
// TODO: remover estes placeholders após `generate` — passam a vir do spec da api.
//       Mantidos só para o pacote tipar antes do primeiro build da api.

/** Qual das três capturas do MVP (T0 baseline · T1 intermediária · T2 final). */
export type WeighinCapture = "T0" | "T1" | "T2";

/** Veredito do revisor humano (§7 do doc de validação). */
export type ReviewVerdict = "PENDENTE" | "APROVADO" | "REPROVADO";

/** Resposta de erro padronizada da api. */
export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Configuração do cliente
// -----------------------------------------------------------------------------

/** Opções de configuração do cliente Charya, expostas a mobile/admin. */
export interface CharyaClientOptions {
  /** Base URL da api (ex.: `https://api.charya.bet` ou `http://localhost:3000`). */
  baseUrl: string;
  /**
   * Headers estáticos ou resolvidos por request (ex.: `Authorization`).
   * O token de auth (Better Auth) é injetado aqui pelo app consumidor.
   */
  headers?: Config["headers"];
  /** Permite injetar um `fetch` custom (RN/retry/instrumentação). */
  fetch?: Config["fetch"];
}

/**
 * Cria uma INSTÂNCIA isolada do cliente fetch (não toca no singleton global).
 * Útil para testes ou múltiplos hosts. A maioria dos apps usa
 * {@link configureCharyaClient} para configurar o singleton que as funções
 * de SDK geradas consomem.
 */
export function createCharyaClient(options: CharyaClientOptions): ReturnType<typeof createClient> {
  return createClient(toConfig(options));
}

/**
 * Configura o cliente SINGLETON usado pelas funções de SDK geradas
 * (`src/generated`). Chamar uma vez no boot do app (mobile/admin):
 *
 * ```ts
 * import { configureCharyaClient } from '@charya/contracts';
 *
 * configureCharyaClient({
 *   baseUrl: env.API_URL,
 *   headers: () => ({ Authorization: `Bearer ${getToken()}` }),
 * });
 * ```
 */
export function configureCharyaClient(options: CharyaClientOptions): void {
  // O Hey API gera funções de SDK que, por padrão, usam este `client` singleton
  // do client-fetch. Configurá-lo aqui é equivalente a configurar `./generated`.
  // TODO: após `generate`, opcionalmente re-exportar o `client` de `./generated`
  //       (é o mesmo singleton) para os apps importarem de um lugar só.
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

export type { Config as CharyaFetchConfig } from "@hey-api/client-fetch";
