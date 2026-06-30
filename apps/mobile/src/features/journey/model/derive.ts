/**
 * Helpers puros derivados do journey state — números que a home/telas mostram
 * (MFP: progresso, pace, tendência). Sem efeitos colaterais.
 */
import type { CheckIn, JourneyBet } from "./types";

const DAY_MS = 86_400_000;

/** "90,0" — pt-BR, 1 casa, vírgula. */
export function formatKg(n: number): string {
  return n.toFixed(1).replace(".", ",");
}

/** "R$ 200" — inteiro (stake/prêmio). */
export function formatMoney(n: number): string {
  return `R$ ${Math.round(n)}`;
}

/** Dias até o prazo (arredonda pra cima; nunca negativo). */
export function daysLeft(bet: JourneyBet, now = Date.now()): number {
  return Math.max(0, Math.ceil((bet.deadlineAt - now) / DAY_MS));
}

/** Peso "atual": último check-in informal, ou o baseline se não houver. */
export function currentWeightKg(checkIns: CheckIn[], baselineKg: number): number {
  return checkIns[checkIns.length - 1]?.weightKg ?? baselineKg;
}

export interface Progress {
  lostKg: number; // quanto já perdeu (pode ser negativo)
  totalKg: number; // quanto precisa perder no total
  pct: number; // 0..1, clamped
}

/** Progresso rumo à meta a partir do peso atual. */
export function progress(bet: JourneyBet, currentKg: number): Progress {
  const totalKg = Math.max(0.1, bet.startWeightKg - bet.targetWeightKg);
  const lostKg = bet.startWeightKg - currentKg;
  const pct = Math.max(0, Math.min(1, lostKg / totalKg));
  return { lostKg, totalKg, pct };
}

/** Streak de dias com check-in, contando de hoje pra trás (com 1 dia de graça). */
export function streakDays(checkIns: CheckIn[], now = Date.now()): number {
  if (checkIns.length === 0) return 0;
  const dayOf = (ms: number) => Math.floor(ms / DAY_MS);
  const days = new Set(checkIns.map((c) => dayOf(c.at)));
  let cursor = dayOf(now);
  if (!days.has(cursor)) cursor -= 1; // graça: hoje ainda não checado conta a partir de ontem
  let streak = 0;
  while (days.has(cursor)) {
    streak += 1;
    cursor -= 1;
  }
  return streak;
}

/** Bateu a meta? (peso atual <= meta, com tolerância de 50g). */
export function hitTarget(bet: JourneyBet, currentKg: number): boolean {
  return currentKg <= bet.targetWeightKg + 0.05;
}

/** No rumo? Compara o progresso com o tempo decorrido do prazo. */
export function onPace(bet: JourneyBet, currentKg: number, now = Date.now()): boolean {
  const elapsed =
    bet.deadlineAt > bet.createdAt
      ? (now - bet.createdAt) / (bet.deadlineAt - bet.createdAt)
      : 1;
  return progress(bet, currentKg).pct >= elapsed - 0.05;
}

/** IMC (kg/m²). 0 se altura inválida. */
export function bmi(weightKg: number, heightCm: number): number {
  if (heightCm <= 0) return 0;
  const m = heightCm / 100;
  return weightKg / (m * m);
}

export interface ChallengePace {
  /** % do peso a perder por semana (intensidade do desafio). */
  weeklyPct: number;
  /** desafio agressivo? (> 1,5%/semana — possível, mas exige disciplina). */
  aggressive: boolean;
}

/**
 * Ritmo/dificuldade do desafio — quão agressiva é a meta (% do peso por semana).
 * Quanto mais alto, maior a fatia do bolo (dito EM PALAVRAS na UI, NUNCA como
 * cotação/multiplicador — Manual §5.4: sem número de payout inventado). Aqui só a
 * dificuldade; o prêmio de verdade sai do bolo de quem desiste, no acerto.
 */
export function challengePace(startKg: number, targetKg: number, weeks: number): ChallengePace {
  const lossKg = Math.max(0, startKg - targetKg);
  const weeklyPct = startKg > 0 && weeks > 0 ? ((lossKg / startKg) / weeks) * 100 : 0;
  return { weeklyPct, aggressive: weeklyPct > 1.5 };
}
