/**
 * Configuração do cliente HTTP tipado.
 *
 * O shape da API não é "adivinhado" aqui: ele vem de @charya/contracts, o
 * cliente TypeScript gerado por Hey API a partir do OpenAPI emitido pela `api`
 * (Arquitetura §5). Este módulo apenas configura `baseUrl`/credenciais e
 * reexporta o client para consumo pelas hooks de TanStack Query.
 *
 * Better Auth usa cookies de sessão; por isso `credentials: 'include'`.
 */

// TODO(contracts): quando @charya/contracts publicar seu entrypoint Hey API,
// importar e configurar o client gerado, por exemplo:
//
//   import { client } from "@charya/contracts/client";
//   client.setConfig({
//     baseUrl: API_URL,
//     credentials: "include",
//   });
//
// e reexportar as funções tipadas (getReviewQueue, postVerdict, ...).

import { configureCharyaClient } from "@charya/contracts";

import { env } from "@/shared/env";

export const API_URL = env.NEXT_PUBLIC_API_URL;

let clientConfigured = false;

/**
 * Configura o cliente tipado de `@charya/contracts` (o singleton que as funções
 * de SDK geradas consomem). Idempotente. `credentials: "include"` envia o cookie
 * de sessão do Better Auth. Chamar uma vez no boot (Providers).
 */
export function setupApiClient(): void {
  if (clientConfigured) return;
  clientConfigured = true;
  configureCharyaClient({
    baseUrl: API_URL,
    fetch: (input: RequestInfo | URL, init?: RequestInit) =>
      fetch(input, { ...init, credentials: "include" }),
  });
}

/**
 * Fetch fino com defaults do admin (cookies de sessão + JSON).
 * Mantido como fallback enquanto o client de @charya/contracts não está plugado;
 * as hooks devem migrar para as funções tipadas geradas assim que disponíveis.
 */
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
    ...init,
  });

  if (!res.ok) {
    // Taxonomia de erros da API: { code, message, details } (Arquitetura §2).
    let body: unknown = undefined;
    try {
      body = await res.json();
    } catch {
      // resposta sem corpo JSON
    }
    throw new ApiError(res.status, body);
  }

  // 204 No Content
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

export class ApiError extends Error {
  readonly status: number;
  readonly body: unknown;

  constructor(status: number, body: unknown) {
    super(`API error ${status}`);
    this.name = "ApiError";
    this.status = status;
    this.body = body;
  }
}
