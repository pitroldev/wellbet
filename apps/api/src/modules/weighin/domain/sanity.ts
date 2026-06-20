/**
 * Regra dura de sanidade (plausibilidade de peso) — domínio puro e testável.
 *
 * Doc de Validação §6: a ÚNICA checagem automática do MVP.
 *
 *   perda_por_semana = (peso_anterior − peso_atual) / semanas
 *   se perda_por_semana > LIMITE_DURO → BLOQUEIO automático
 *
 * A FUNÇÃO DE CÁLCULO vem de `@charya/schemas/plausibility` (fonte única,
 * compartilhada com o front para mostrar feedback antes do envio). Aqui só
 * envolvemos a função com o tipo de resultado do domínio, mantendo a regra
 * pura (sem Nest, sem I/O) para o teste em `sanity.spec.ts`.
 */
import {
  lossPerWeekKg as sharedLossPerWeekKg,
  type PlausibilityInput,
} from "@charya/schemas/plausibility";

export interface SanityInput {
  /** Peso da pesagem anterior (kg). */
  readonly previousWeightKg: number;
  /** Peso da pesagem atual (kg). */
  readonly currentWeightKg: number;
  /** Intervalo entre as pesagens (em semanas, > 0). */
  readonly weeks: number;
  /** LIMITE_DURO calibrado folgado (kg/semana) — vem da env. */
  readonly hardLimitKgPerWeek: number;
}

export type SanityResult =
  | { readonly ok: true; readonly lossPerWeekKg: number }
  | {
      readonly ok: false;
      readonly lossPerWeekKg: number;
      readonly hardLimitKgPerWeek: number;
      readonly reason: "implausible_loss";
    };

/**
 * Calcula a perda/semana e decide se a pesagem é fisiologicamente plausível.
 *
 * `ok: false` => BLOQUEIO automático (não vai ao revisor; vira REPROVADO
 * direto via regra dura, §6/§7). `ok: true` => segue para a fila humana.
 */
export function checkSanity(input: SanityInput): SanityResult {
  const weeks = input.weeks <= 0 ? Number.EPSILON : input.weeks;

  const plausibilityInput: PlausibilityInput = {
    // SanityInput recebe kg "crus"; a fronteira (DTO Zod) já validou a faixa,
    // então marcamos com o brand WeightKg esperado pela função compartilhada.
    previousWeightKg: input.previousWeightKg as PlausibilityInput["previousWeightKg"],
    currentWeightKg: input.currentWeightKg as PlausibilityInput["currentWeightKg"],
    // A função compartilhada trabalha em dias; convertemos as semanas do domínio.
    daysElapsed: weeks * 7,
  };

  const loss = sharedLossPerWeekKg(plausibilityInput);

  if (loss > input.hardLimitKgPerWeek) {
    return {
      ok: false,
      lossPerWeekKg: loss,
      hardLimitKgPerWeek: input.hardLimitKgPerWeek,
      reason: "implausible_loss",
    };
  }

  return { ok: true, lossPerWeekKg: loss };
}
