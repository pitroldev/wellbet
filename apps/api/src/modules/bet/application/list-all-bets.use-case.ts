import { Inject, Injectable } from "@nestjs/common";

import type { BetStatus } from "@/modules/bet/domain/bet.entity.js";
import { ADMIN_BET_QUERY, type AdminBetQueryPort } from "./admin-bet-query.port.js";

export interface AdminBetRow {
  readonly betId: string;
  readonly userId: string;
  readonly userName: string | null;
  readonly status: BetStatus;
  readonly targetWeightKg: number;
  readonly startWeightKg: number | null;
  readonly stakeAmount: string;
  readonly payoutAmount: string | null;
  readonly currency: string;
  readonly createdAt: string;
}

export interface ListAllBetsCommand {
  readonly status?: BetStatus;
  readonly limit?: number;
  readonly offset?: number;
}

/** ListAllBetsUseCase — apostas de TODA a plataforma (ops/admin), com paginação. */
@Injectable()
export class ListAllBetsUseCase {
  constructor(@Inject(ADMIN_BET_QUERY) private readonly bets: AdminBetQueryPort) {}

  async execute(cmd: ListAllBetsCommand): Promise<AdminBetRow[]> {
    const limit = Math.min(cmd.limit ?? 50, 200);
    const offset = cmd.offset ?? 0;
    const items = await this.bets.listAll({ status: cmd.status, limit, offset });
    return items.map((b) => ({
      betId: b.betId,
      userId: b.userId,
      userName: b.userName,
      status: b.status,
      targetWeightKg: b.targetWeightKg,
      startWeightKg: b.startWeightKg,
      stakeAmount: b.stakeAmount,
      payoutAmount: b.payoutAmount,
      currency: b.currency,
      createdAt: b.createdAt.toISOString(),
    }));
  }
}
