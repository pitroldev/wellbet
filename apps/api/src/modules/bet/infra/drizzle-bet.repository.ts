import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { DATABASE, type DbHandle } from "@/infra/db/client.js";
import { bets, users } from "@/infra/db/schema.js";
import type {
  AdminBetItem,
  AdminBetQueryPort,
} from "@/modules/bet/application/admin-bet-query.port.js";
import { Bet, type BetStatus } from "@/modules/bet/domain/bet.entity.js";
import type { BetRepositoryPort } from "@/modules/bet/application/bet.repository.port.js";

/** Adapter Drizzle/Postgres do BetRepositoryPort + AdminBetQueryPort. */
@Injectable()
export class DrizzleBetRepository implements BetRepositoryPort, AdminBetQueryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async save(bet: Bet): Promise<void> {
    const p = bet.toJSON();
    await this.handle.db
      .insert(bets)
      .values({
        id: p.id,
        userId: p.userId,
        startWeightKg: p.startWeightKg ?? null,
        targetWeightKg: p.targetWeightKg,
        stakeAmount: p.stakeAmount,
        payoutAmount: p.payoutAmount ?? null,
        currency: p.currency,
        status: p.status,
        stakeChargeId: p.stakeChargeId ?? null,
        payoutTransferId: p.payoutTransferId ?? null,
        settledAt: p.settledAt ?? null,
      })
      .onConflictDoUpdate({
        target: bets.id,
        set: {
          status: p.status,
          stakeChargeId: p.stakeChargeId ?? null,
          payoutTransferId: p.payoutTransferId ?? null,
          payoutAmount: p.payoutAmount ?? null,
          settledAt: p.settledAt ?? null,
        },
      });
  }

  async findById(id: string): Promise<Bet | undefined> {
    const [row] = await this.handle.db.select().from(bets).where(eq(bets.id, id)).limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findByStakeChargeId(chargeId: string): Promise<Bet | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(bets)
      .where(eq(bets.stakeChargeId, chargeId))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async listByUser(userId: string): Promise<Bet[]> {
    const rows = await this.handle.db
      .select()
      .from(bets)
      .where(eq(bets.userId, userId))
      .orderBy(desc(bets.createdAt));
    return rows.map((r) => this.toDomain(r));
  }

  /** AdminBetQueryPort: lista TODAS as apostas (ops), com nome do usuário. */
  async listAll(args: {
    status?: BetStatus;
    limit: number;
    offset: number;
  }): Promise<AdminBetItem[]> {
    return this.handle.db
      .select({
        betId: bets.id,
        userId: bets.userId,
        userName: users.name,
        status: bets.status,
        targetWeightKg: bets.targetWeightKg,
        startWeightKg: bets.startWeightKg,
        stakeAmount: bets.stakeAmount,
        payoutAmount: bets.payoutAmount,
        currency: bets.currency,
        createdAt: bets.createdAt,
      })
      .from(bets)
      .innerJoin(users, eq(users.id, bets.userId))
      .where(args.status ? eq(bets.status, args.status) : undefined)
      .orderBy(desc(bets.createdAt))
      .limit(args.limit)
      .offset(args.offset);
  }

  private toDomain(row: typeof bets.$inferSelect): Bet {
    return Bet.create({
      id: row.id,
      userId: row.userId,
      startWeightKg: row.startWeightKg,
      targetWeightKg: row.targetWeightKg,
      stakeAmount: row.stakeAmount,
      payoutAmount: row.payoutAmount,
      currency: row.currency,
      status: row.status,
      stakeChargeId: row.stakeChargeId,
      payoutTransferId: row.payoutTransferId,
      settledAt: row.settledAt,
    });
  }
}
