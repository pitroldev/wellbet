import { createZodDto } from "nestjs-zod";
import { z } from "zod";

/**
 * DTOs dos critérios de aprovação (CRUD do console).
 *
 * A `key` é um slug estável (snake_case): vira a chave do checklist da revisão e
 * do dataset da Fase 2. Por isso só é definida na criação — nunca editada.
 */
const criterionKey = z
  .string()
  .trim()
  .regex(/^[a-z][a-z0-9_]*$/, "key: slug snake_case (a-z, 0-9, _) começando por letra.")
  .max(64);

const label = z.string().trim().min(1, "Informe um rótulo.").max(120);
const helpText = z.string().trim().max(2000).nullish();
const sortOrder = z.number().int().min(0).max(10_000);

export const ListCriteriaQuerySchema = z.object({
  /** `true` → só os habilitados (usado pelo checklist da revisão). */
  enabledOnly: z.coerce.boolean().optional(),
});
export class ListCriteriaQueryDto extends createZodDto(ListCriteriaQuerySchema) {}

export const CreateCriterionSchema = z.object({
  key: criterionKey,
  label,
  description: helpText,
  failHint: helpText,
  enabled: z.boolean().optional(),
  sortOrder: sortOrder.optional(),
});
export class CreateCriterionDto extends createZodDto(CreateCriterionSchema) {}

/** Patch parcial: todos opcionais; `key` é imutável (ausente de propósito). */
export const UpdateCriterionSchema = z
  .object({
    label,
    description: helpText,
    failHint: helpText,
    enabled: z.boolean(),
    sortOrder,
  })
  .partial();
export class UpdateCriterionDto extends createZodDto(UpdateCriterionSchema) {}

export const CriterionResponseSchema = z.object({
  id: z.string(),
  key: z.string(),
  label: z.string(),
  description: z.string().nullable(),
  failHint: z.string().nullable(),
  enabled: z.boolean(),
  sortOrder: z.number().int(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
});
export class CriterionResponseDto extends createZodDto(CriterionResponseSchema) {}
