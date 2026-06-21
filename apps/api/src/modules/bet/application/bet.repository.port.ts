/**
 * Port do repositório de apostas (camada application).
 */
import type { Bet } from "@/modules/bet/domain/bet.entity.js";

export interface BetRepositoryPort {
  save(bet: Bet): Promise<void>;
  findById(id: string): Promise<Bet | undefined>;
  /** Busca pela cobrança Pix do stake (usado pelo webhook de pagamento). */
  findByStakeChargeId(chargeId: string): Promise<Bet | undefined>;
  listByUser(userId: string): Promise<Bet[]>;
}

export const BET_REPOSITORY = Symbol("BET_REPOSITORY");
