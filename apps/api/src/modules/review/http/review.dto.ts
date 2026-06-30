import { WeighInStatus } from "@charya/schemas";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * Chave de um critério do checklist. Antes era um enum fixo (CHECKLIST_FLAGS);
 * agora os critérios são CONFIGURÁVEIS (tabela approval_criteria), então o
 * veredito aceita qualquer slug de critério (snake_case). A consistência é
 * garantida pela UI, que só envia keys de critérios existentes/habilitados.
 */
const checklistFlag = z
  .string()
  .regex(/^[a-z][a-z0-9_]*$/)
  .max(64);

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
    // ESCRITA binária: sem N/A. O app grava só ok/fail (critérios não-aplicáveis
    // nem aparecem). Leitura (ReviewDetailSchema) ainda tolera "na" legado.
    checklist: z.record(checklistFlag, z.enum(["ok", "fail"])).nullish(),
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
  /** Peso da baseline (T0) da aposta — base p/ tendência/plausibilidade. */
  previousWeightKg: z.number().nullable(),
  /** Semanas decorridas entre a baseline e esta captura. */
  weeks: z.number().nullable(),
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
  /** Resultado item a item já registrado (LEITURA tolera "na" legado). */
  checklist: z.record(z.string(), z.enum(["ok", "fail", "na"])).nullable(),
  /**
   * FATOS de aplicabilidade dos critérios (substitui o N/A). O client mapeia o
   * `appliesWhen` de cada critério para um destes e filtra o checklist.
   */
  context: z.object({
    hasComparison: z.boolean(),
    hasPreviousWeight: z.boolean(),
  }),
});
export class ReviewDetailDto extends createZodDto(ReviewDetailSchema) {}
