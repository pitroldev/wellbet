import { QueryClient, defaultShouldDehydrateQuery, isServer } from "@tanstack/react-query";

/**
 * Fábrica do QueryClient. Padrões pensados para um console interno:
 * - `staleTime` curto mas > 0 para evitar refetch duplo no streaming de RSC;
 * - sem retry agressivo (operador prefere ver o erro do que esperar).
 */
function makeQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 30_000,
        retry: 1,
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        // Permite serializar queries ainda pendentes (streaming SSR).
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) || query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

/**
 * No servidor sempre criamos um client novo (isolamento por request).
 * No browser reaproveitamos um singleton para não perder cache em re-render
 * causado por Suspense durante a hidratação inicial.
 */
export function getQueryClient(): QueryClient {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}
