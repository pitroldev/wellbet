import { WeighInStatus } from "@charya/schemas";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CHECKLIST_FLAGS } from "@/modules/review/domain/review.entity.js";

/** Flags do checklist do revisor (doc de Validação §5). */
const checklistFlag = z.enum(CHECKLIST_FLAGS);

export const ListReviewQueueSchema = z.object({
  limit: z.coerce.number().int().min(1).max(200).default(50),
  offset: z.coerce.number().int().min(0).default(0),
});
export class ListReviewQueueDto extends createZodDto(ListReviewQueueSchema) {}

export const SubmitVerdictSchema = z
  .object({
    weighinId: z.uuid(),
    verdict: z.enum(["approved", "pending", "rejected"]),
    reason: z.string().max(2000).nullish(),
    failedChecks: z.array(checklistFlag).nullish(),
    /** Resultado tristate item a item (ok/fail/na) — dataset granular (Fase 2). */
    checklist: z.record(checklistFlag, z.enum(["ok", "fail", "na"])).nullish(),
  })
  .refine(
    (v) =>
      // Política do doc (§7): reprovar/pendente exige motivo ou flags.
      v.verdict === "approved" ||
      (v.reason != null && v.reason.length > 0) ||
      (v.failedChecks != null && v.failedChecks.length > 0),
    {
      message: 'Veredito diferente de "approved" exige motivo ou flags.',
      path: ["reason"],
    },
  );
export class SubmitVerdictDto extends createZodDto(SubmitVerdictSchema) {}

export const VerdictResponseSchema = z.object({
  reviewId: z.string(),
  weighinId: z.string(),
  verdict: z.enum(["approved", "pending", "rejected"]),
});
export class VerdictResponseDto extends createZodDto(VerdictResponseSchema) {}

/** Item da fila de revisão (resposta de GET /reviews/queue). */
export const ReviewQueueEntrySchema = z.object({
  weighinId: z.string(),
  userId: z.string(),
  userName: z.string().nullable(),
  kind: z.enum(["baseline", "mid", "final"]),
  weightKg: z.number(),
  lossPerWeekKg: z.number().nullable(),
  capturedAt: z.iso.datetime(),
  reviewId: z.string().nullable(),
  /** URL pré-assinada do vídeo (o revisor reproduz). */
  videoUrl: z.string(),
});
export class ReviewQueueEntryDto extends createZodDto(ReviewQueueEntrySchema) {}

/** Detalhe de uma pesagem para a sessão de revisão (GET /reviews/:weighinId). */
export const ReviewDetailSchema = z.object({
  weighinId: z.string(),
  userId: z.string(),
  userName: z.string().nullable(),
  kind: z.enum(["baseline", "mid", "final"]),
  weightKg: z.number(),
  lossPerWeekKg: z.number().nullable(),
  status: WeighInStatus,
  capturedAt: z.iso.datetime(),
  videoUrl: z.string(),
  /** Vídeos das 3 capturas (T0/T1/T2) da aposta, p/ comparação de identidade. */
  comparison: z.object({
    baseline: z.string().nullable(),
    mid: z.string().nullable(),
    final: z.string().nullable(),
  }),
  /** Código dinâmico esperado (o revisor confere com o vídeo). */
  expectedCode: z
    .object({ word: z.string(), number: z.number().int(), gesture: z.string() })
    .nullable(),
  verdict: z.enum(["approved", "pending", "rejected"]).nullable(),
  reason: z.string().nullable(),
  failedChecks: z.array(z.string()).nullable(),
  /** Resultado tristate item a item já registrado (Fase 2). */
  checklist: z.record(z.string(), z.enum(["ok", "fail", "na"])).nullable(),
});
export class ReviewDetailDto extends createZodDto(ReviewDetailSchema) {}
