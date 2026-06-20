import { z } from "zod";

/**
 * Tipos base e helpers Zod compartilhados por todo o domínio Charya.
 *
 * Estas primitivas (ids, timestamps, dinheiro, peso) aparecem em vários
 * schemas — definidas uma vez aqui para garantir validação idêntica em
 * api/admin/mobile. Tudo é Zod 4 e exporta o `z.infer` correspondente.
 */

/* -------------------------------------------------------------------------- */
/* Identificadores (branded)                                                  */
/* -------------------------------------------------------------------------- */

/**
 * Id genérico do sistema. Usamos UUID v4 como formato canônico.
 *
 * O `.brand()` impede misturar ids de entidades diferentes em chamadas de
 * função (um `UserId` não é atribuível a um `BetId`), mesmo sendo ambos
 * `string` em runtime.
 */
export const uuid = z.uuid();

export const UserId = uuid.brand<"UserId">();
export type UserId = z.infer<typeof UserId>;

export const BetId = uuid.brand<"BetId">();
export type BetId = z.infer<typeof BetId>;

export const WeighInId = uuid.brand<"WeighInId">();
export type WeighInId = z.infer<typeof WeighInId>;

export const ChallengeId = uuid.brand<"ChallengeId">();
export type ChallengeId = z.infer<typeof ChallengeId>;

export const ReviewId = uuid.brand<"ReviewId">();
export type ReviewId = z.infer<typeof ReviewId>;

export const SessionId = uuid.brand<"SessionId">();
export type SessionId = z.infer<typeof SessionId>;

/* -------------------------------------------------------------------------- */
/* Timestamps (branded)                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Instante no tempo, serializado como ISO 8601 (UTC). Branded para distinguir
 * de uma `string` qualquer no fluxo de tipos.
 */
export const Timestamp = z.iso.datetime({ offset: true }).brand<"Timestamp">();
export type Timestamp = z.infer<typeof Timestamp>;

/**
 * Bloco de auditoria padrão. Toda entidade persistida carrega estes campos.
 */
export const Timestamps = z.object({
  createdAt: Timestamp,
  updatedAt: Timestamp,
});
export type Timestamps = z.infer<typeof Timestamps>;

/* -------------------------------------------------------------------------- */
/* Dinheiro                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Moeda suportada no MVP. BRL apenas — multimoeda é Fase 2.
 */
export const Currency = z.enum(["BRL"]);
export type Currency = z.infer<typeof Currency>;

/**
 * Valor monetário em centavos (inteiro), evitando aritmética de ponto
 * flutuante. `1000` = R$ 10,00.
 */
export const Money = z.object({
  /** Valor em menor unidade da moeda (centavos). Sempre >= 0. */
  amountCents: z.int().nonnegative(),
  currency: Currency,
});
export type Money = z.infer<typeof Money>;

/* -------------------------------------------------------------------------- */
/* Peso                                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Peso corporal em quilogramas. Faixa sanitária ampla apenas para barrar
 * lixo evidente (0, valores absurdos); a plausibilidade fisiológica real é
 * tratada em `plausibility.ts` e pela revisão humana.
 */
export const WeightKg = z
  .number()
  .positive()
  .min(20, "Peso abaixo do mínimo plausível (20 kg).")
  .max(400, "Peso acima do máximo plausível (400 kg).")
  // Balanças domésticas reportam, no máximo, 0,1 kg de resolução.
  .multipleOf(0.1, "Peso deve ter resolução de 0,1 kg.")
  .brand<"WeightKg">();
export type WeightKg = z.infer<typeof WeightKg>;

/* -------------------------------------------------------------------------- */
/* Helpers Zod                                                                 */
/* -------------------------------------------------------------------------- */

/**
 * URL de referência para mídia em storage (R2/S3). Apenas a referência —
 * o binário nunca trafega pelos schemas.
 */
export const MediaRef = z.url().brand<"MediaRef">();
export type MediaRef = z.infer<typeof MediaRef>;

/**
 * String não-vazia já com trim aplicado.
 */
export const NonEmptyString = z.string().trim().min(1);
export type NonEmptyString = z.infer<typeof NonEmptyString>;

/**
 * Paginação por cursor — formato compartilhado das listagens.
 */
export const PageQuery = z.object({
  cursor: z.string().optional(),
  limit: z.int().min(1).max(100).default(20),
});
export type PageQuery = z.infer<typeof PageQuery>;

/**
 * Envelope genérico de resposta paginada.
 *
 * @example
 *   const PageOfBets = paginated(Bet);
 */
export function paginated<T extends z.ZodType>(item: T) {
  return z.object({
    items: z.array(item),
    nextCursor: z.string().nullable(),
  });
}
