/**
 * Modelo LOCAL-FIRST da jornada (a espinha).
 *
 * O cliente é a fonte de verdade da EXPERIÊNCIA; a API real (@charya/contracts)
 * entra como costura onde já existe (placeBet, weighin start/submit). Os campos
 * espelham o contrato onde possível, pra integração futura ser limpa. `deadlineAt`
 * é LOCAL (o contrato de Bet não tem prazo).
 */

/** Objetivo declarado no quiz (Noom). */
export type QuizGoal = "lose" | "health" | "confidence" | "event";

/** O que travou nas tentativas anteriores (Noom). */
export type QuizBlocker = "consistency" | "motivation" | "stress" | "alone";

export interface QuizAnswers {
  goal: QuizGoal;
  /** O "porquê" — texto curto livre. Munição pro treinador (Fase 5). */
  why: string;
  blocker: QuizBlocker;
}

/**
 * A aposta no modelo local. stake/peso em `number` (UI/cálculo); converte para o
 * contrato (string) na costura do placeBet. `deadlineAt` é local.
 */
export interface JourneyBet {
  startWeightKg: number;
  targetWeightKg: number;
  stakeAmount: number;
  createdAt: number; // epoch ms
  deadlineAt: number; // epoch ms (local — não existe no contrato)
  /** id da bet no servidor, quando criada via contrato. */
  betId?: string;
  /** brcode do Pix (copia-e-cola), quando veio do placeBet. */
  brcode?: string;
}

/** Check-in informal de peso (MFP) — não é pesagem oficial, não vai pra revisão. */
export interface CheckIn {
  at: number; // epoch ms
  weightKg: number;
}

/** Fase do dinheiro/aposta. */
export type BetPhase =
  | "none"
  | "payment" // bilhete criado, aguardando Pix
  | "active" // aposta ativa, no período
  | "final-review" // pesagem final enviada, em revisão
  | "won"
  | "lost";

/** Estágio derivado — a home decide o que mostrar a partir disto (ver §5 do doc). */
export type JourneyStage =
  | "onboarding"
  | "no-account"
  | "no-baseline"
  | "baseline-review"
  | "no-bet"
  | "payment"
  | "active"
  | "window"
  | "final-review"
  | "won"
  | "lost";
