/**
 * Port do repositório de desafios (camada application).
 * Interface aqui; adapter Drizzle na infra.
 */
import type { Challenge } from "@/modules/challenge/domain/challenge.entity.js";

export interface ChallengeRepositoryPort {
  save(challenge: Challenge): Promise<void>;

  findById(id: string): Promise<Challenge | undefined>;

  findByNonce(nonce: string): Promise<Challenge | undefined>;

  /** Persiste o consumo (uso único) de forma atômica. */
  markConsumed(id: string, consumedAt: Date): Promise<void>;
}

export const CHALLENGE_REPOSITORY = Symbol("CHALLENGE_REPOSITORY");
