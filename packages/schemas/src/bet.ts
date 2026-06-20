import { z } from "zod";
import { BetId, Money, Timestamp, Timestamps, UserId, WeightKg } from "./common.js";

/**
 * Aposta de peso ("Charya Bet").
 *
 * O usuário fixa uma meta de peso e um prazo, deposita um `stake` e, se
 * atingir a meta validada (3 pesagens T0/T1/T2 + revisão humana), recebe o
 * `payout`. A aposta é a moldura temporal das pesagens (ver `weighin.ts`).
 */

/* -------------------------------------------------------------------------- */
/* Status                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Ciclo de vida da aposta:
 * - `draft`     — criada, ainda sem stake depositado.
 * - `active`    — stake pago; janela de pesagens aberta.
 * - `settling`  — prazo encerrado; T2 enviada, aguardando revisão/regra dura.
 * - `won`       — meta atingida e validada; payout liberado.
 * - `lost`      — meta não atingida (ou reprovada na validação).
 * - `cancelled` — encerrada antes do início efetivo (refund do stake).
 */
export const BetStatus = z.enum(["draft", "active", "settling", "won", "lost", "cancelled"]);
export type BetStatus = z.infer<typeof BetStatus>;

/** Estados terminais — não admitem mais transição. */
export const TERMINAL_BET_STATUSES: readonly BetStatus[] = ["won", "lost", "cancelled"];

export function isTerminalBetStatus(status: BetStatus): boolean {
  return TERMINAL_BET_STATUSES.includes(status);
}

/* -------------------------------------------------------------------------- */
/* Meta + janela                                                               */
/* -------------------------------------------------------------------------- */

/**
 * Meta da aposta. `targetWeightKg` deve ser menor que `startWeightKg`
 * (sempre é uma aposta de *perda* de peso no MVP).
 */
export const BetGoal = z
  .object({
    startWeightKg: WeightKg,
    targetWeightKg: WeightKg,
  })
  .refine((g) => g.targetWeightKg < g.startWeightKg, {
    message: "A meta deve ser menor que o peso inicial (aposta de perda).",
    path: ["targetWeightKg"],
  });
export type BetGoal = z.infer<typeof BetGoal>;

/**
 * Janela temporal da aposta. `endsAt` deve ser depois de `startsAt`.
 *
 * A duração também alimenta a regra dura de sanidade (perda/semana) em
 * `plausibility.ts`.
 */
export const BetWindow = z
  .object({
    startsAt: Timestamp,
    endsAt: Timestamp,
  })
  .refine((w) => new Date(w.endsAt) > new Date(w.startsAt), {
    message: "O fim da aposta deve ser posterior ao início.",
    path: ["endsAt"],
  });
export type BetWindow = z.infer<typeof BetWindow>;

/* -------------------------------------------------------------------------- */
/* Aposta                                                                       */
/* -------------------------------------------------------------------------- */

export const Bet = z
  .object({
    id: BetId,
    userId: UserId,
    status: BetStatus.default("draft"),
    goal: BetGoal,
    window: BetWindow,
    /** Valor depositado pelo usuário ao iniciar a aposta. */
    stake: Money,
    /** Valor a receber se a meta for atingida e validada. */
    payout: Money,
  })
  .extend(Timestamps.shape);
export type Bet = z.infer<typeof Bet>;

/* -------------------------------------------------------------------------- */
/* Contrato de criação (input do app)                                          */
/* -------------------------------------------------------------------------- */

/**
 * Payload que o app envia para criar uma aposta. O servidor calcula
 * `payout`, atribui `id`, timestamps e status inicial.
 */
export const CreateBetInput = z.object({
  goal: BetGoal,
  window: BetWindow,
  stake: Money,
});
export type CreateBetInput = z.infer<typeof CreateBetInput>;
