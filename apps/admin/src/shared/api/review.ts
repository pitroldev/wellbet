"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import { apiFetch } from "./http";
import type { ReviewQueueItem, ReviewSession, VerdictSubmission } from "@/features/review/types";

/**
 * Hooks de TanStack Query da feature de revisão.
 *
 * As funções de fetch usam o cliente HTTP fino (`apiFetch`) por ora; quando o
 * client gerado de @charya/contracts estiver plugado, trocar as chamadas pelas
 * funções tipadas (ex.: `getReviewQueue()`), mantendo as mesmas query keys.
 */

export const reviewKeys = {
  all: ["review"] as const,
  queue: () => [...reviewKeys.all, "queue"] as const,
  session: (id: string) => [...reviewKeys.all, "session", id] as const,
};

export function useReviewQueue(): UseQueryResult<ReviewQueueItem[]> {
  return useQuery({
    queryKey: reviewKeys.queue(),
    // TODO(contracts): substituir por getReviewQueue() de @charya/contracts.
    queryFn: () => apiFetch<ReviewQueueItem[]>("/review/queue"),
  });
}

export function useReviewSession(id: string): UseQueryResult<ReviewSession> {
  return useQuery({
    queryKey: reviewKeys.session(id),
    queryFn: () => apiFetch<ReviewSession>(`/review/sessions/${id}`),
    enabled: Boolean(id),
  });
}

export function useSubmitVerdict(): UseMutationResult<void, Error, VerdictSubmission> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (submission: VerdictSubmission) =>
      apiFetch<void>(`/review/sessions/${submission.sessionId}/verdict`, {
        method: "POST",
        body: JSON.stringify(submission),
      }),
    onSuccess: (_data, submission) => {
      // Recarrega a fila e a sessão revisada.
      void queryClient.invalidateQueries({ queryKey: reviewKeys.queue() });
      void queryClient.invalidateQueries({
        queryKey: reviewKeys.session(submission.sessionId),
      });
    },
  });
}
