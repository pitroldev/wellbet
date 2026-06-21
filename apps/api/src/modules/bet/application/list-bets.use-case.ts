import { Inject, Injectable } from "@nestjs/common";

import type { Bet, BetStatus } from "@/modules/bet/domain/bet.entity.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";

export interface BetSummary {
  readonly betId: string;
  readonly status: BetStatus;
  readonly targetWeightKg: number;
  readonly startWeightKg: number | null;
  readonly stakeAmount: string;
  readonly payoutAmount: string | null;
  readonly currency: string;
}

/**
 * Resumo de domínio de uma aposta. Ids internos do PSP (stakeChargeId/
 * payoutTransferId) NÃO vazam para o cliente.
 */
export function toBetSummary(bet: Bet): BetSummary {
  const p = bet.toJSON();
  return {
    betId: p.id,
    status: p.status,
    targetWeightKg: p.targetWeightKg,
    startWeightKg: p.startWeightKg ?? null,
    stakeAmount: p.stakeAmount,
    payoutAmount: p.payoutAmount ?? null,
    currency: p.currency,
  };
}

/** ListBetsUseCase — apostas do usuário autenticado (mais recentes primeiro). */
@Injectable()
export class ListBetsUseCase {
  constructor(@Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort) {}

  async execute(userId: string): Promise<BetSummary[]> {
    const bets = await this.bets.listByUser(userId);
    return bets.map(toBetSummary);
  }
}
