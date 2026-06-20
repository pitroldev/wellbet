/**
 * Port do repositório de apostas (camada application).
 */
import type { Bet } from "../domain/bet.entity.js";

export interface BetRepositoryPort {
  save(bet: Bet): Promise<void>;
  findById(id: string): Promise<Bet | undefined>;
  listByUser(userId: string): Promise<Bet[]>;
}

export const BET_REPOSITORY = Symbol("BET_REPOSITORY");
