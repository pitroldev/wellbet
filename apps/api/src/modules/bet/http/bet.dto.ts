import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * DTOs de aposta via nestjs-zod.
 * `stakeAmount` é string decimal (precisão monetária — nunca float).
 */
export const PlaceBetSchema = z.object({
  targetWeightKg: z.number().positive().max(500),
  startWeightKg: z.number().positive().max(500).nullish(),
  // decimal como string: "100.00"
  stakeAmount: z.string().regex(/^\d+(\.\d{1,2})?$/, "Valor monetário inválido."),
  currency: z.string().length(3).default("BRL"),
});
export class PlaceBetDto extends createZodDto(PlaceBetSchema) {}

export const BetResponseSchema = z.object({
  betId: z.string(),
  status: z.enum(["open", "settling", "won", "lost", "voided"]),
});
export class BetResponseDto extends createZodDto(BetResponseSchema) {}
