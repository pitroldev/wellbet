"use client";

import {
  useMutation,
  useQuery,
  useQueryClient,
  type UseMutationResult,
  type UseQueryResult,
} from "@tanstack/react-query";
import {
  reviewControllerDetail,
  reviewControllerQueue,
  reviewControllerVerdict,
  type ReviewDetailDto,
  type ReviewQueueEntryDto,
  type SubmitVerdictDto,
} from "@charya/contracts";
import type {
  CaptureKind,
  ChecklistItemKey,
  ItemResult,
  ReviewSession,
  Verdict,
  VerdictSubmission,
} from "@/features/review/types";

/**
 * Hooks de TanStack Query da feature de revisão.
 *
 * As funções de fetch usam o SDK TIPADO de `@charya/contracts` (gerado do
 * OpenAPI da api). Um adapter fino mapeia os DTOs gerados ↔ os view-models que
 * os componentes consomem (T0/T1/T2, APROVADO, scale_zeroed). Como o adapter lê
 * os campos dos DTOs, o type-check ainda barra drift de contrato.
 */

export const reviewKeys = {
  all: ["review"] as const,
  queue: () => [...reviewKeys.all, "queue"] as const,
  session: (id: string) => [...reviewKeys.all, "session", id] as const,
};

/* ------------------------------- mapeamentos ------------------------------- */

const CAPTURE_BY_KIND: Record<ReviewDetailDto["kind"], CaptureKind> = {
  baseline: "T0",
  mid: "T1",
  final: "T2",
};

const API_VERDICT: Record<Verdict, SubmitVerdictDto["verdict"]> = {
  APROVADO: "approved",
  PENDENTE: "pending",
  REPROVADO: "rejected",
};

// Chaves do checklist do console → flags da api (único descompasso: scale_zeroed).
const API_FLAG: Partial<Record<ChecklistItemKey, string>> = { scale_zeroed: "scale_zero" };
const toFlag = (key: ChecklistItemKey): string => API_FLAG[key] ?? key;

function toReviewSession(d: ReviewDetailDto): ReviewSession {
  return {
    id: d.weighinId,
    userId: d.userId,
    userName: d.userName ?? "—",
    capture: CAPTURE_BY_KIND[d.kind],
    weightKg: d.weightKg,
    previousWeightKg: null,
    weeks: 0,
    sanityPassed: d.status !== "blocked",
    videos: { T0: d.comparison.baseline, T1: d.comparison.mid, T2: d.comparison.final },
    expectedCode: d.expectedCode
      ? `${d.expectedCode.word} ${String(d.expectedCode.number)} (${d.expectedCode.gesture})`
      : "—",
    submittedAt: d.capturedAt,
  };
}

function toSubmitVerdictDto(sub: VerdictSubmission): SubmitVerdictDto {
  const checklist: Record<string, "ok" | "fail" | "na"> = {};
  for (const [key, result] of Object.entries(sub.items) as [ChecklistItemKey, ItemResult][]) {
    checklist[toFlag(key)] = result;
  }
  return {
    weighinId: sub.sessionId,
    verdict: API_VERDICT[sub.verdict],
    reason: sub.reason,
    failedChecks: sub.failedItems.map(toFlag) as SubmitVerdictDto["failedChecks"],
    checklist,
  };
}

/* ---------------------------------- hooks ---------------------------------- */

export function useReviewQueue(): UseQueryResult<ReviewQueueEntryDto[]> {
  return useQuery({
    queryKey: reviewKeys.queue(),
    queryFn: async () => {
      const { data } = await reviewControllerQueue({ throwOnError: true });
      return data;
    },
  });
}

export function useReviewSession(id: string): UseQueryResult<ReviewSession> {
  return useQuery({
    queryKey: reviewKeys.session(id),
    enabled: Boolean(id),
    queryFn: async () => {
      const { data } = await reviewControllerDetail({
        path: { weighinId: id },
        throwOnError: true,
      });
      return toReviewSession(data);
    },
  });
}

export function useSubmitVerdict(): UseMutationResult<void, Error, VerdictSubmission> {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (submission: VerdictSubmission) => {
      await reviewControllerVerdict({ body: toSubmitVerdictDto(submission), throwOnError: true });
    },
    onSuccess: (_data, submission) => {
      // Recarrega a fila e a sessão revisada.
      void queryClient.invalidateQueries({ queryKey: reviewKeys.queue() });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.session(submission.sessionId) });
    },
  });
}
