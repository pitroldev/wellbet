/**
 * Port de QUERY administrativa de apostas (ops / console interno).
 *
 * Separado do BetRepositoryPort (escrita/leitura do dono da aposta) para a
 * leitura admin — listar TODAS as apostas com filtro/paginação, juntando o nome
 * do usuário. CQRS leve: o write-port do bettor não carrega esta query.
 */
import type { BetStatus } from "@/modules/bet/domain/bet.entity.js";

export interface AdminBetItem {
  readonly betId: string;
  readonly userId: string;
  readonly userName: string | null;
  readonly status: BetStatus;
  readonly targetWeightKg: number;
  readonly startWeightKg: number | null;
  readonly stakeAmount: string;
  readonly payoutAmount: string | null;
  readonly currency: string;
  readonly createdAt: Date;
}

export interface AdminBetQueryPort {
  listAll(args: { status?: BetStatus; limit: number; offset: number }): Promise<AdminBetItem[]>;
}

export const ADMIN_BET_QUERY = Symbol("ADMIN_BET_QUERY");
