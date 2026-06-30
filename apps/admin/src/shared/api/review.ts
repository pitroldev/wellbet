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

// Reverso: veredito gravado (api) → rótulo do console (modo somente-leitura).
const CONSOLE_VERDICT: Record<ReviewDetailDto["verdict"] & string, Verdict> = {
  approved: "APROVADO",
  pending: "PENDENTE",
  rejected: "REPROVADO",
};

/** Erro tipado de gravação de veredito (distingue 409 "já decidida"). */
export class VerdictError extends Error {
  constructor(
    message: string,
    readonly alreadyDecided: boolean,
  ) {
    super(message);
    this.name = "VerdictError";
  }
}

function isAlreadyDecided(err: unknown): boolean {
  if (err && typeof err === "object") {
    const e = err as Record<string, unknown>;
    if (e.code === "REVIEW_ALREADY_DECIDED") return true;
    if (e.statusCode === 409) return true;
    const details = e.details as Record<string, unknown> | undefined;
    if (details && details.statusCode === 409) return true;
  }
  return false;
}

function toReviewSession(d: ReviewDetailDto): ReviewSession {
  return {
    id: d.weighinId,
    userId: d.userId,
    userName: d.userName ?? "—",
    capture: CAPTURE_BY_KIND[d.kind],
    weightKg: d.weightKg,
    previousWeightKg: d.previousWeightKg,
    weeks: d.weeks,
    lossPerWeekKg: d.lossPerWeekKg,
    sanityPassed: d.status !== "blocked",
    videos: { T0: d.comparison.baseline, T1: d.comparison.mid, T2: d.comparison.final },
    expectedCode: d.expectedCode,
    submittedAt: d.capturedAt,
    decided:
      d.verdict != null
        ? {
            verdict: CONSOLE_VERDICT[d.verdict],
            reason: d.reason,
            failedItems: d.failedChecks ?? [],
            items: (d.checklist ?? {}) as Record<string, ItemResult>,
          }
        : null,
  };
}

function toSubmitVerdictDto(sub: VerdictSubmission): SubmitVerdictDto {
  // As keys do checklist JÁ são os slugs dos critérios (config global) — vão
  // direto para a api, sem mapeamento.
  const checklist: Record<string, ItemResult> = {};
  for (const [key, result] of Object.entries(sub.items)) {
    checklist[key] = result;
  }
  return {
    weighinId: sub.sessionId,
    verdict: API_VERDICT[sub.verdict],
    reason: sub.reason,
    failedChecks: sub.failedItems,
    checklist,
  };
}

/* ---------------------------------- hooks ---------------------------------- */

export function useReviewQueue(): UseQueryResult<ReviewQueueEntryDto[]> {
  return useQuery({
    queryKey: reviewKeys.queue(),
    queryFn: async () => {
      // limit alto: a fila do revisor é triada inteira; paginação é client-side.
      const { data } = await reviewControllerQueue({ query: { limit: 200 }, throwOnError: true });
      return data;
    },
    // Fila viva: revalida sozinha e ao voltar o foco (não decidir sobre dado velho).
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
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
      try {
        await reviewControllerVerdict({ body: toSubmitVerdictDto(submission), throwOnError: true });
      } catch (err) {
        const already = isAlreadyDecided(err);
        throw new VerdictError(
          already
            ? "Esta pesagem já recebeu veredito por outro revisor."
            : "Falha ao gravar o veredito. Tente novamente.",
          already,
        );
      }
    },
    onSuccess: (_data, submission) => {
      // Recarrega a fila e a sessão revisada.
      void queryClient.invalidateQueries({ queryKey: reviewKeys.queue() });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.session(submission.sessionId) });
    },
  });
}
