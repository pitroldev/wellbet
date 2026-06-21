import { Inject, Injectable } from "@nestjs/common";
import { and, eq, isNull } from "drizzle-orm";

import { DATABASE, type DbHandle } from "@/infra/db/client.js";
import { challenges } from "@/infra/db/schema.js";
import { Challenge, type Gesture } from "@/modules/challenge/domain/challenge.entity.js";
import type { ChallengeRepositoryPort } from "@/modules/challenge/application/challenge.repository.port.js";

/** Adapter Drizzle/Postgres do ChallengeRepositoryPort. */
@Injectable()
export class DrizzleChallengeRepository implements ChallengeRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async save(challenge: Challenge): Promise<void> {
    const p = challenge.toJSON();
    await this.handle.db
      .insert(challenges)
      .values({
        id: p.id,
        userId: p.userId,
        word: p.word,
        number: p.number,
        gesture: p.gesture,
        nonce: p.nonce,
        issuedAt: p.issuedAt,
        expiresAt: p.expiresAt,
        consumedAt: p.consumedAt ?? null,
      })
      .onConflictDoNothing({ target: challenges.id });
  }

  async findById(id: string): Promise<Challenge | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(challenges)
      .where(eq(challenges.id, id))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async findByNonce(nonce: string): Promise<Challenge | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(challenges)
      .where(eq(challenges.nonce, nonce))
      .limit(1);
    return row ? this.toDomain(row) : undefined;
  }

  async markConsumed(id: string, consumedAt: Date): Promise<void> {
    // Uso único sob concorrência: só atualiza se ainda não consumido.
    await this.handle.db
      .update(challenges)
      .set({ consumedAt })
      .where(and(eq(challenges.id, id), isNull(challenges.consumedAt)));
  }

  private toDomain(row: typeof challenges.$inferSelect): Challenge {
    return Challenge.create({
      id: row.id,
      userId: row.userId,
      word: row.word,
      number: row.number,
      gesture: row.gesture as Gesture,
      nonce: row.nonce,
      issuedAt: row.issuedAt,
      expiresAt: row.expiresAt,
      consumedAt: row.consumedAt,
    });
  }
}
