import { Inject, Injectable } from "@nestjs/common";
import { desc, eq } from "drizzle-orm";

import { DATABASE, type DbHandle } from "../../../infra/db/client.js";
import { reviews, weighins } from "../../../infra/db/schema.js";
import { type ChecklistFlag, Review } from "../domain/review.entity.js";
import type {
  ReviewQueueItem,
  ReviewRepositoryPort,
} from "../application/review.repository.port.js";

/** Adapter Drizzle/Postgres do ReviewRepositoryPort. */
@Injectable()
export class DrizzleReviewRepository implements ReviewRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async listQueue(args: { limit: number; offset: number }): Promise<ReviewQueueItem[]> {
    // Pesagens em revisão, mais antigas primeiro (FIFO do revisor).
    const rows = await this.handle.db
      .select({
        weighinId: weighins.id,
        userId: weighins.userId,
        kind: weighins.kind,
        weightKg: weighins.weightKg,
        videoObjectKey: weighins.videoObjectKey,
        lossPerWeekKg: weighins.lossPerWeekKg,
        capturedAt: weighins.capturedAt,
        reviewId: reviews.id,
      })
      .from(weighins)
      .leftJoin(reviews, eq(reviews.weighinId, weighins.id))
      .where(eq(weighins.status, "in_review"))
      .orderBy(weighins.capturedAt)
      .limit(args.limit)
      .offset(args.offset);

    return rows.map((r) => ({
      weighinId: r.weighinId,
      userId: r.userId,
      kind: r.kind,
      weightKg: r.weightKg,
      videoObjectKey: r.videoObjectKey,
      lossPerWeekKg: r.lossPerWeekKg,
      capturedAt: r.capturedAt,
      reviewId: r.reviewId,
    }));
  }

  async save(review: Review): Promise<void> {
    const p = review.toJSON();
    await this.handle.db
      .insert(reviews)
      .values({
        id: p.id,
        weighinId: p.weighinId,
        reviewerId: p.reviewerId ?? null,
        verdict: p.verdict ?? null,
        reason: p.reason ?? null,
        failedChecks: p.failedChecks ?? null,
        decidedAt: p.decidedAt ?? null,
      })
      .onConflictDoUpdate({
        target: reviews.weighinId,
        set: {
          reviewerId: p.reviewerId ?? null,
          verdict: p.verdict ?? null,
          reason: p.reason ?? null,
          failedChecks: p.failedChecks ?? null,
          decidedAt: p.decidedAt ?? null,
        },
      });
  }

  async findById(id: string): Promise<Review | undefined> {
    const [row] = await this.handle.db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findByWeighin(weighinId: string): Promise<Review | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(reviews)
      .where(eq(reviews.weighinId, weighinId))
      .orderBy(desc(reviews.createdAt))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  private toDomain(row: typeof reviews.$inferSelect): Review {
    return Review.create({
      id: row.id,
      weighinId: row.weighinId,
      reviewerId: row.reviewerId,
      verdict: row.verdict ?? null,
      reason: row.reason,
      failedChecks: (row.failedChecks as ChecklistFlag[] | null) ?? null,
      decidedAt: row.decidedAt,
    });
  }
}
