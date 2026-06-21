import { WeighInStatus } from "@charya/schemas";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * DTOs de pesagem via nestjs-zod.
 *
 * `WeighInStatus` vem de `@charya/schemas` (fonte única), mantendo contrato
 * único front↔back.
 */

const weighinKind = z.enum(["baseline", "mid", "final"]);

/** Abrir sessão de captura: emite código + URL de upload. */
export const StartWeighInSchema = z.object({
  kind: weighinKind,
  betId: z.uuid().nullish(),
  contentType: z.string().default("video/mp4"),
});
export class StartWeighInDto extends createZodDto(StartWeighInSchema) {}

export const StartWeighInResponseSchema = z.object({
  challenge: z.object({
    challengeId: z.string(),
    word: z.string(),
    number: z.number().int(),
    gesture: z.string(),
    nonce: z.string(),
    expiresAt: z.iso.datetime(),
  }),
  upload: z.object({
    url: z.string(),
    objectKey: z.string(),
    expiresAt: z.iso.datetime(),
    requiredHeaders: z.record(z.string(), z.string()).optional(),
  }),
});
export class StartWeighInResponseDto extends createZodDto(StartWeighInResponseSchema) {}

/** Submeter a pesagem após o upload do vídeo. */
export const SubmitWeighInSchema = z.object({
  kind: weighinKind,
  betId: z.uuid().nullish(),
  weightKg: z.number().positive().max(500),
  // nonce do código dinâmico (validação anti-replay + consumo).
  nonce: z.string().min(1),
  // chave do vídeo já enviado ao R2.
  videoObjectKey: z.string().min(1),
});
export class SubmitWeighInDto extends createZodDto(SubmitWeighInSchema) {}

export const SubmitWeighInResponseSchema = z.object({
  weighinId: z.string(),
  status: WeighInStatus,
  lossPerWeekKg: z.number().nullable(),
});
export class SubmitWeighInResponseDto extends createZodDto(SubmitWeighInResponseSchema) {}

/** Filtro opcional do histórico de pesagens (GET /weighins). */
export const ListWeighInsQuerySchema = z.object({
  kind: weighinKind.optional(),
});
export class ListWeighInsQueryDto extends createZodDto(ListWeighInsQuerySchema) {}

/** Resumo de uma pesagem no histórico do usuário. */
export const WeighInSummarySchema = z.object({
  weighinId: z.string(),
  kind: weighinKind,
  weightKg: z.number(),
  status: WeighInStatus,
  lossPerWeekKg: z.number().nullable(),
  betId: z.string().nullable(),
  capturedAt: z.iso.datetime(),
});
export class WeighInSummaryDto extends createZodDto(WeighInSummarySchema) {}
