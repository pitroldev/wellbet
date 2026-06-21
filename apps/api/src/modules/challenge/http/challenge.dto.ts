import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * DTOs do desafio via nestjs-zod.
 *
 * O mesmo schema Zod valida o request e alimenta o OpenAPI (§2 do doc).
 */

export const IssueChallengeSchema = z.object({
  // userId vem da sessão (req.user), não do corpo — schema vazio por ora.
});
export class IssueChallengeDto extends createZodDto(IssueChallengeSchema) {}

export const ChallengeResponseSchema = z.object({
  challengeId: z.string(),
  word: z.string(),
  number: z.number().int(),
  gesture: z.string(),
  nonce: z.string(),
  expiresAt: z.iso.datetime(),
});
export class ChallengeResponseDto extends createZodDto(ChallengeResponseSchema) {}
