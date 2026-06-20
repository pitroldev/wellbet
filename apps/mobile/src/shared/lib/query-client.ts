/**
 * QueryClient compartilhado (TanStack Query v5).
 *
 * Configuração pensada para rede instável (uploads de vídeo pesados): retry
 * com backoff e cache generoso. O retry/resumo do upload em si é gerenciado por
 * mutations específicas em `features/weighin/api`.
 */
import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Rede móvel instável: tenta de novo, mas sem martelar.
      retry: 2,
      retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30_000),
      staleTime: 30_000,
      // Refetch ao voltar para o app é útil no fluxo de pesagem.
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
    },
  },
});
