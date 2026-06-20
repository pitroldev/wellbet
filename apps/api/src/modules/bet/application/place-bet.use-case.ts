import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { Bet } from "../domain/bet.entity.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";

export interface PlaceBetCommand {
  readonly userId: string;
  readonly targetWeightKg: number;
  readonly startWeightKg?: number | null;
  readonly stakeAmount: string;
  readonly currency?: string;
}

export interface PlaceBetResult {
  readonly betId: string;
  readonly status: Bet["status"];
}

/**
 * PlaceBetUseCase — cria uma aposta aberta.
 *
 * Escrita financeira → deve ser protegida por idempotência no controller
 * (header Idempotency-Key + IdempotencyInterceptor).
 */
@Injectable()
export class PlaceBetUseCase {
  constructor(@Inject(BET_REPOSITORY) private readonly repo: BetRepositoryPort) {}

  async execute(cmd: PlaceBetCommand): Promise<PlaceBetResult> {
    const bet = Bet.create({
      id: randomUUID(),
      userId: cmd.userId,
      startWeightKg: cmd.startWeightKg ?? null,
      targetWeightKg: cmd.targetWeightKg,
      stakeAmount: cmd.stakeAmount,
      currency: cmd.currency ?? "BRL",
      status: "open",
    });

    await this.repo.save(bet);
    return { betId: bet.id, status: bet.status };
  }
}
