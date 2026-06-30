import { Inject, Injectable } from "@nestjs/common";
import { asc, eq } from "drizzle-orm";

import { DATABASE, type DbHandle } from "@/infra/db/client.js";
import { approvalCriteria, type ApprovalCriterionRow } from "@/infra/db/schema.js";
import type {
  CreateCriterionInput,
  CriteriaRepositoryPort,
  Criterion,
  UpdateCriterionInput,
} from "@/modules/criteria/application/criteria.repository.port.js";

/** Adapter Drizzle/Postgres do CriteriaRepositoryPort. */
@Injectable()
export class DrizzleCriteriaRepository implements CriteriaRepositoryPort {
  constructor(@Inject(DATABASE) private readonly handle: DbHandle) {}

  async list(opts?: { enabledOnly?: boolean }): Promise<Criterion[]> {
    const base = this.handle.db.select().from(approvalCriteria);
    const rows = await (opts?.enabledOnly
      ? base.where(eq(approvalCriteria.enabled, true))
      : base
    ).orderBy(asc(approvalCriteria.sortOrder), asc(approvalCriteria.label));
    return rows.map(toDomain);
  }

  async findById(id: string): Promise<Criterion | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(approvalCriteria)
      .where(eq(approvalCriteria.id, id))
      .limit(1);
    return row ? toDomain(row) : undefined;
  }

  async findByKey(key: string): Promise<Criterion | undefined> {
    const [row] = await this.handle.db
      .select()
      .from(approvalCriteria)
      .where(eq(approvalCriteria.key, key))
      .limit(1);
    return row ? toDomain(row) : undefined;
  }

  async create(input: CreateCriterionInput): Promise<Criterion> {
    const [row] = await this.handle.db
      .insert(approvalCriteria)
      .values({
        key: input.key,
        label: input.label,
        description: input.description ?? null,
        failHint: input.failHint ?? null,
        enabled: input.enabled ?? true,
        sortOrder: input.sortOrder ?? 0,
      })
      .returning();
    return toDomain(row!);
  }

  async update(id: string, patch: UpdateCriterionInput): Promise<Criterion | undefined> {
    // Só inclui as chaves presentes no patch (evita sobrescrever com undefined).
    const set: Partial<ApprovalCriterionRow> = { updatedAt: new Date() };
    if (patch.label !== undefined) set.label = patch.label;
    if (patch.description !== undefined) set.description = patch.description;
    if (patch.failHint !== undefined) set.failHint = patch.failHint;
    if (patch.enabled !== undefined) set.enabled = patch.enabled;
    if (patch.sortOrder !== undefined) set.sortOrder = patch.sortOrder;

    const [row] = await this.handle.db
      .update(approvalCriteria)
      .set(set)
      .where(eq(approvalCriteria.id, id))
      .returning();
    return row ? toDomain(row) : undefined;
  }
}

function toDomain(row: ApprovalCriterionRow): Criterion {
  return {
    id: row.id,
    key: row.key,
    label: row.label,
    description: row.description,
    failHint: row.failHint,
    enabled: row.enabled,
    sortOrder: row.sortOrder,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}
