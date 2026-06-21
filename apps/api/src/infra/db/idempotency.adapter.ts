import { Inject, Injectable } from "@nestjs/common";
import { eq } from "drizzle-orm";

import {
  type IdempotencyRecord,
  type IdempotencyStorePort,
} from "@/shared/idempotency/idempotency.port.js";
import { DATABASE, type DbHandle } from "./client.js";
import { idempotencyKeys } from "./schema.js";

/**
 * Adapter Drizzle/Postgres do IdempotencyStorePort.
 *
 * `save` usa `onConflictDoNothing` na PK (a chave) para garantir exactly-once
 * mesmo sob concorrência: o primeiro INSERT vence, os demais viram no-op.
 */
@Injectable()
export class DrizzleIdempotencyStore implements IdempotencyStorePort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async find(key: string): Promise<IdempotencyRecord | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(idempotencyKeys)
      .where(eq(idempotencyKeys.key, key))
      .limit(1);

    if (!row) return undefined;
    return {
      key: row.key,
      requestHash: row.requestHash,
      responseBody: row.responseBody,
      statusCode: row.statusCode,
      createdAt: row.createdAt,
    };
  }

  async save(record: IdempotencyRecord): Promise<void> {
    await this.handle.db
      .insert(idempotencyKeys)
      .values({
        key: record.key,
        requestHash: record.requestHash,
        responseBody: record.responseBody,
        statusCode: record.statusCode,
        createdAt: record.createdAt,
      })
      .onConflictDoNothing({ target: idempotencyKeys.key });
  }
}
