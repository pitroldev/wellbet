import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { DATABASE, type DbHandle } from "../../../infra/db/client.js";
import { bets } from "../../../infra/db/schema.js";
import { Bet } from "../domain/bet.entity.js";
import type { BetRepositoryPort } from "../application/bet.repository.port.js";

/** Adapter Drizzle/Postgres do BetRepositoryPort. */
@Injectable()
export class DrizzleBetRepository implements BetRepositoryPort {
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
        currency: p.currency,
        status: p.status,
        settledAt: p.settledAt ?? null,
      })
      .onConflictDoUpdate({
        target: bets.id,
        set: { status: p.status, settledAt: p.settledAt ?? null },
      });
  }

  async findById(id: string): Promise<Bet | undefined> {
    const [row] = await this.handle.db.select().from(bets).where(eq(bets.id, id)).limit(1);
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

  private toDomain(row: typeof bets.$inferSelect): Bet {
    return Bet.create({
      id: row.id,
      userId: row.userId,
      startWeightKg: row.startWeightKg,
      targetWeightKg: row.targetWeightKg,
      stakeAmount: row.stakeAmount,
      currency: row.currency,
      status: row.status,
      settledAt: row.settledAt,
    });
  }
}
