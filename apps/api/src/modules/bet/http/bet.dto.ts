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

const betStatus = z.enum(["pending_payment", "open", "settling", "won", "lost", "voided"]);

export const BetResponseSchema = z.object({
  betId: z.string(),
  status: betStatus,
  /** Pix copia-e-cola para pagar o stake (o app exibe o QR). */
  brcode: z.string(),
  chargeExpiresAt: z.string(),
});
export class BetResponseDto extends createZodDto(BetResponseSchema) {}

/** Resumo de uma aposta na listagem do usuário (GET /bets). */
export const BetSummarySchema = z.object({
  betId: z.string(),
  status: betStatus,
  targetWeightKg: z.number(),
  startWeightKg: z.number().nullable(),
  stakeAmount: z.string(),
  payoutAmount: z.string().nullable(),
  currency: z.string(),
});
export class BetSummaryDto extends createZodDto(BetSummarySchema) {}
