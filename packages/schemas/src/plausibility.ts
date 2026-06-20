import { z } from "zod";
import { WeightKg } from "./common.js";

/**
 * A ÚNICA regra automática do MVP (§6 do doc de validação).
 *
 * Antes de chegar ao revisor, o sistema aplica **uma** checagem dura de
 * sanidade para barrar o absurdo sem gastar tempo humano:
 *
 *     perda_por_semana = (peso_anterior − peso_atual) / semanas
 *     se perda_por_semana > LIMITE_DURO → BLOQUEIO automático
 *
 * Não há engine, score ou estatística de curva no MVP — isso é Fase 2. O
 * `LIMITE_DURO` é calibrado folgado: só pega o claramente impossível
 * (ex.: "18 kg em 20 dias").
 */

/* -------------------------------------------------------------------------- */
/* Parâmetros calibráveis                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Limite duro de perda por semana (kg/semana). Acima disto, bloqueio
 * automático (fisiologicamente impossível). Folgado de propósito.
 */
export const HARD_LIMIT_KG_PER_WEEK = 4;

/**
 * Limite de *flag* (kg/semana). Não bloqueia — só sinaliza ao revisor que
 * a perda é agressiva e merece atenção extra no checklist.
 */
export const FLAG_LIMIT_KG_PER_WEEK = 2;

/**
 * Parâmetros da regra, agrupados e validados (permite override por ambiente
 * sem espalhar números mágicos pelo código).
 */
export const PlausibilityParams = z.object({
  hardLimitKgPerWeek: z.number().positive().default(HARD_LIMIT_KG_PER_WEEK),
  flagLimitKgPerWeek: z.number().positive().default(FLAG_LIMIT_KG_PER_WEEK),
});
export type PlausibilityParams = z.infer<typeof PlausibilityParams>;

/** Parâmetros padrão do MVP. */
export const DEFAULT_PLAUSIBILITY_PARAMS: PlausibilityParams = {
  hardLimitKgPerWeek: HARD_LIMIT_KG_PER_WEEK,
  flagLimitKgPerWeek: FLAG_LIMIT_KG_PER_WEEK,
};

/* -------------------------------------------------------------------------- */
/* Entrada / saída                                                             */
/* -------------------------------------------------------------------------- */

/**
 * Entrada da checagem: dois pesos consecutivos e o intervalo entre eles.
 */
export const PlausibilityInput = z
  .object({
    previousWeightKg: WeightKg,
    currentWeightKg: WeightKg,
    /** Dias decorridos entre as duas pesagens (> 0). */
    daysElapsed: z.number().positive(),
  })
  .refine((i) => i.daysElapsed > 0, {
    message: "O intervalo entre pesagens deve ser positivo.",
    path: ["daysElapsed"],
  });
export type PlausibilityInput = z.infer<typeof PlausibilityInput>;

/**
 * Veredito da regra dura:
 * - `ok`      — dentro do esperado, segue para revisão normalmente.
 * - `flagged` — agressivo; passa, mas sinaliza atenção ao revisor.
 * - `blocked` — acima do limite duro; bloqueio automático (REPROVADO).
 */
export const PlausibilityOutcome = z.enum(["ok", "flagged", "blocked"]);
export type PlausibilityOutcome = z.infer<typeof PlausibilityOutcome>;

export const PlausibilityResult = z.object({
  outcome: PlausibilityOutcome,
  /** Perda calculada por semana (kg/semana). Negativo = ganho de peso. */
  lossPerWeekKg: z.number(),
  /** Mensagem legível para log/revisor. */
  reason: z.string(),
});
export type PlausibilityResult = z.infer<typeof PlausibilityResult>;

/* -------------------------------------------------------------------------- */
/* Função pura de sanidade                                                      */
/* -------------------------------------------------------------------------- */

const DAYS_PER_WEEK = 7;

/**
 * Calcula a perda por semana entre duas pesagens.
 *
 *     perda_por_semana = (peso_anterior − peso_atual) / semanas
 *
 * Positivo = perda; negativo = ganho.
 */
export function lossPerWeekKg(input: PlausibilityInput): number {
  const weeks = input.daysElapsed / DAYS_PER_WEEK;
  return (input.previousWeightKg - input.currentWeightKg) / weeks;
}

/**
 * Aplica a regra dura de plausibilidade. Função **pura** e determinística —
 * mesma entrada, mesma saída; sem I/O. Compartilhável por api/admin/mobile.
 *
 * Ganho de peso ou perda dentro do limite passam (`ok`); perda agressiva
 * acima do flag mas abaixo do limite duro vira `flagged`; perda acima do
 * limite duro vira `blocked`.
 */
export function checkPlausibility(
  input: PlausibilityInput,
  params: PlausibilityParams = DEFAULT_PLAUSIBILITY_PARAMS,
): PlausibilityResult {
  const loss = lossPerWeekKg(input);

  if (loss > params.hardLimitKgPerWeek) {
    return {
      outcome: "blocked",
      lossPerWeekKg: loss,
      reason: `Perda de ${loss.toFixed(
        2,
      )} kg/semana excede o limite duro de ${params.hardLimitKgPerWeek} kg/semana (fisiologicamente impossível).`,
    };
  }

  if (loss > params.flagLimitKgPerWeek) {
    return {
      outcome: "flagged",
      lossPerWeekKg: loss,
      reason: `Perda de ${loss.toFixed(
        2,
      )} kg/semana é agressiva (acima de ${params.flagLimitKgPerWeek} kg/semana). Atenção redobrada na revisão.`,
    };
  }

  return {
    outcome: "ok",
    lossPerWeekKg: loss,
    reason: "Perda dentro da faixa plausível.",
  };
}
