/**
 * Configuração do cliente HTTP tipado.
 *
 * O shape da API não é "adivinhado" aqui: ele vem de @charya/contracts, o
 * cliente TypeScript gerado por Hey API a partir do OpenAPI emitido pela `api`
 * (Arquitetura §5). Este módulo apenas configura `baseUrl`/credenciais do
 * singleton que as funções de SDK geradas consomem.
 *
 * Better Auth usa cookies de sessão; por isso `credentials: 'include'`.
 */

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
