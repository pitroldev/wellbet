import { createZodDto } from "nestjs-zod";
import { z } from "zod";

import { CHECKLIST_FLAGS } from "../domain/review.entity.js";

/** Flags do checklist do revisor (doc de Validação §5). */
const checklistFlag = z.enum(CHECKLIST_FLAGS as unknown as [string, ...string[]]);

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
