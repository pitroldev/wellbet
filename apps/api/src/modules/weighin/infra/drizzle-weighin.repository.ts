import { Inject, Injectable } from "@nestjs/common";
import { and, desc, eq, lt } from "drizzle-orm";

import { DATABASE, type DbHandle } from "../../../infra/db/client.js";
import { weighins } from "../../../infra/db/schema.js";
import { WeighIn, type WeighInKind } from "../domain/weighin.entity.js";
import type { WeighInRepositoryPort } from "../application/weighin.repository.port.js";

/** Adapter Drizzle/Postgres do WeighInRepositoryPort. */
@Injectable()
export class DrizzleWeighInRepository implements WeighInRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async save(weighin: WeighIn): Promise<void> {
    const p = weighin.toJSON();
    await this.handle.db
      .insert(weighins)
      .values({
        id: p.id,
        userId: p.userId,
        betId: p.betId ?? null,
        challengeId: p.challengeId ?? null,
        kind: p.kind,
        weightKg: p.weightKg,
        videoObjectKey: p.videoObjectKey,
        status: p.status,
        lossPerWeekKg: p.lossPerWeekKg ?? null,
        capturedAt: p.capturedAt,
      })
      .onConflictDoUpdate({
        target: weighins.id,
        set: {
          status: p.status,
          lossPerWeekKg: p.lossPerWeekKg ?? null,
        },
      });
  }

  async findById(id: string): Promise<WeighIn | undefined> {
    const [row] = await this.handle.db.select().from(weighins).where(eq(weighins.id, id)).limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findPrevious(args: {
    userId: string;
    betId?: string | null;
    before: Date;
  }): Promise<WeighIn | undefined> {
    const conditions = [eq(weighins.userId, args.userId), lt(weighins.capturedAt, args.before)];
    if (args.betId) conditions.push(eq(weighins.betId, args.betId));

    const [row] = await this.handle.db
      .select()
      .from(weighins)
      .where(and(...conditions))
      .orderBy(desc(weighins.capturedAt))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async listByUser(args: { userId: string; kind?: WeighInKind }): Promise<WeighIn[]> {
    const conditions = [eq(weighins.userId, args.userId)];
    if (args.kind) conditions.push(eq(weighins.kind, args.kind));

    const rows = await this.handle.db
      .select()
      .from(weighins)
      .where(and(...conditions))
      .orderBy(desc(weighins.capturedAt));
    return rows.map((r) => this.toDomain(r));
  }

  private toDomain(row: typeof weighins.$inferSelect): WeighIn {
    return WeighIn.create({
      id: row.id,
      userId: row.userId,
      betId: row.betId,
      challengeId: row.challengeId,
      kind: row.kind as WeighInKind,
      weightKg: row.weightKg,
      videoObjectKey: row.videoObjectKey,
      status: row.status,
      lossPerWeekKg: row.lossPerWeekKg,
      capturedAt: row.capturedAt,
    });
  }
}
