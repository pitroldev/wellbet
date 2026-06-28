/**
 * Configuração do cliente HTTP tipado.
 *
 * O shape da API vem de `@charya/contracts` (cliente gerado por Hey API a
 * partir do OpenAPI do backend). Aqui só configuramos o SINGLETON do cliente:
 * base URL + injeção do token de auth. Ninguém adivinha o shape da API — isso é
 * responsabilidade do contrato gerado. As funções de SDK (ex.:
 * `createWeighinSession`) consomem este singleton.
 *
 * Chamar `setupApiClient()` uma vez no boot do app (no `_layout.tsx`).
 */
import { configureCharyaClient } from "@charya/contracts";

import { env } from "./env";
import { tokenStore } from "./secure-store";

let configured = false;

/**
 * Configura o cliente de API. Idempotente (seguro chamar mais de uma vez).
 *
 * O token (Better Auth) é injetado via `fetch` wrapper: como o SecureStore é
 * assíncrono, resolvemos o header por request antes de delegar ao fetch nativo.
 */
export function setupApiClient(): void {
  if (configured) return;
  configured = true;

  configureCharyaClient({
    baseUrl: env.EXPO_PUBLIC_API_URL,
    fetch: authenticatedFetch,
  });
}

/** `fetch` que injeta o Authorization: Bearer <token> quando há sessão. */
async function authenticatedFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const token = await tokenStore.getAccessToken();
  const headers = new Headers(init?.headers);
  if (token != null) {
    headers.set("Authorization", `Bearer ${token}`);
  }
  const res = await fetch(input, { ...init, headers });

  // 401 com token enviado → o token está inválido/expirado. Limpamos a sessão
  // local para não seguir mandando um token morto em toda request (e a UI pode
  // tratar a ausência de sessão). O REFRESH de verdade (renovar a sessão Better
  // Auth) depende do fluxo de login no app, ainda não implementado — quando ele
  // existir, troque este clear por: renovar via refresh token e repetir a request.
  if (res.status === 401 && token != null) {
    await tokenStore.clear();
  }
  return res;
}

/**
 * Extrai a mensagem de erro do backend de um erro lançado pelo SDK
 * (`throwOnError`). O cliente do contrato lança o corpo de erro JÁ parseado da
 * api — `{ code, message, details }` (ver all-exceptions.filter) — então aqui só
 * pegamos `message`. Retorna null quando ausente: o chamador usa um fallback.
 */
export function apiErrorMessage(error: unknown): string | null {
  if (error != null && typeof error === "object" && "message" in error) {
    const message = (error as { message: unknown }).message;
    if (typeof message === "string" && message.length > 0) return message;
  }
  return null;
}
