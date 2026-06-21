import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDb, type DbHandle } from "@/infra/db/client.js";
import { Bet } from "@/modules/bet/domain/bet.entity.js";
import { User } from "@/modules/identity/domain/user.entity.js";
import { WeighIn } from "@/modules/weighin/domain/weighin.entity.js";
import { CHECKLIST_FLAGS, Review } from "@/modules/review/domain/review.entity.js";
import { DrizzleBetRepository } from "@/modules/bet/infra/drizzle-bet.repository.js";
import { DrizzleUserRepository } from "@/modules/identity/infra/drizzle-user.repository.js";
import { DrizzleWeighInRepository } from "@/modules/weighin/infra/drizzle-weighin.repository.js";
import { DrizzleReviewRepository } from "@/modules/review/infra/drizzle-review.repository.js";
import { DrizzleIdempotencyStore } from "@/infra/db/idempotency.adapter.js";
import type { IdempotencyRecord } from "@/shared/idempotency/idempotency.port.js";

const MIGRATIONS_DIR = join(process.cwd(), "src/infra/db/migrations");

// Colunas `id`/`user_id` são `uuid` no schema → IDs precisam ser UUIDs válidos.
const USER_ID = "11111111-1111-4111-8111-111111111111";
const BET_ID = "22222222-2222-4222-8222-222222222222";
const CHARGE_ID = "charge-int-1"; // stake_charge_id é texto (id do Stark Bank)
const W0_ID = "33333333-3333-4333-8333-333333333333";
const W1_ID = "44444444-4444-4444-8444-444444444444";
const W2_ID = "55555555-5555-4555-8555-555555555555";
const REVIEW_ID = "66666666-6666-4666-8666-666666666666";

function weighinAt(
  id: string,
  kind: "baseline" | "mid",
  capturedAt: string,
  weightKg: number,
): WeighIn {
  return WeighIn.create({
    id,
    userId: USER_ID,
    betId: BET_ID,
    challengeId: null,
    kind,
    weightKg,
    videoObjectKey: "k.mp4",
    status: "approved",
    lossPerWeekKg: null,
    capturedAt: new Date(capturedAt),
  });
}

/** Aplica as migrações (drizzle-kit 1.0-rc: 1 dir por migração com migration.sql). */
async function applyMigrations(handle: DbHandle): Promise<void> {
  const dirs = readdirSync(MIGRATIONS_DIR)
    .filter((d) => statSync(join(MIGRATIONS_DIR, d)).isDirectory())
    .sort();
  for (const dir of dirs) {
    const sql = readFileSync(join(MIGRATIONS_DIR, dir, "migration.sql"), "utf8");
    await handle.pool.query(sql);
  }
}

describe("Repositórios Drizzle (integração — Postgres real via Testcontainers)", () => {
  let container: StartedPostgreSqlContainer;
  let handle: DbHandle;
  let bets: DrizzleBetRepository;
  let users: DrizzleUserRepository;
  let weighins: DrizzleWeighInRepository;
  let reviewRepo: DrizzleReviewRepository;
  let idem: DrizzleIdempotencyStore;

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    handle = createDb(container.getConnectionUri());
    await applyMigrations(handle);
    bets = new DrizzleBetRepository(handle);
    users = new DrizzleUserRepository(handle);
    weighins = new DrizzleWeighInRepository(handle);
    reviewRepo = new DrizzleReviewRepository(handle);
    idem = new DrizzleIdempotencyStore(handle);
  }, 120_000);

  afterAll(async () => {
    await handle?.pool.end();
    await container?.stop();
  });

  it("User: save → findById/findByAuthUserId round-trip (taxId/pixKey)", async () => {
    const user = User.create({
      id: USER_ID,
      email: "int@charya.app",
      name: "Integração",
      role: "user",
      taxId: "12345678909",
      pixKey: "int@charya.app",
      authUserId: USER_ID,
    });
    await users.save(user);

    const byId = await users.findById(USER_ID);
    expect(byId?.email).toBe("int@charya.app");
    expect(byId?.taxId).toBe("12345678909");

    const byAuth = await users.findByAuthUserId(USER_ID);
    expect(byAuth?.id).toBe(USER_ID);
  });

  it("Bet: save → findById round-trip (enum status, decimais, FK do usuário)", async () => {
    const bet = Bet.create({
      id: BET_ID,
      userId: USER_ID,
      startWeightKg: 90,
      targetWeightKg: 80,
      stakeAmount: "100.00",
      payoutAmount: "100.00",
      currency: "BRL",
      status: "pending_payment",
      stakeChargeId: CHARGE_ID,
      payoutTransferId: null,
      settledAt: null,
    });
    await bets.save(bet);

    const found = await bets.findById(BET_ID);
    const json = found?.toJSON();
    expect(json?.status).toBe("pending_payment");
    expect(json?.targetWeightKg).toBe(80);
    expect(Number(json?.stakeAmount)).toBe(100);
    expect(json?.stakeChargeId).toBe(CHARGE_ID);

    const byCharge = await bets.findByStakeChargeId(CHARGE_ID);
    expect(byCharge?.id).toBe(BET_ID);
  });

  it("Bet: markStakePaid persiste a transição pending_payment → open", async () => {
    const found = await bets.findById(BET_ID);
    expect(found).toBeDefined();
    found?.markStakePaid();
    if (found) await bets.save(found);

    const reloaded = await bets.findById(BET_ID);
    expect(reloaded?.toJSON().status).toBe("open");
  });

  it("Bet: listByUser retorna as apostas do usuário", async () => {
    const list = await bets.listByUser(USER_ID);
    expect(list.length).toBeGreaterThanOrEqual(1);
    expect(list.every((b) => b.toJSON().userId === USER_ID)).toBe(true);
  });

  it("AdminBetQuery: listAll junta o nome do usuário (INNER JOIN users)", async () => {
    const rows = await bets.listAll({ limit: 50, offset: 0 });
    const row = rows.find((r) => r.betId === BET_ID);
    expect(row?.userName).toBe("Integração");
    expect(row?.status).toBe("open");
  });

  it("WeighIn: save → findById + findPrevious (pesagem anterior por data)", async () => {
    await weighins.save(weighinAt(W0_ID, "baseline", "2026-06-01T08:00:00.000Z", 90));
    await weighins.save(weighinAt(W1_ID, "mid", "2026-06-08T08:00:00.000Z", 88));

    const w0 = await weighins.findById(W0_ID);
    expect(w0?.toJSON().kind).toBe("baseline");
    expect(Number(w0?.toJSON().weightKg)).toBe(90);

    // Antes de 15/06 → a mais recente é a de 08/06 (W1).
    const before15 = await weighins.findPrevious({
      userId: USER_ID,
      betId: BET_ID,
      before: new Date("2026-06-15T00:00:00.000Z"),
    });
    expect(before15?.id).toBe(W1_ID);

    // Antes de 05/06 → só a de 01/06 (W0) qualifica.
    const before05 = await weighins.findPrevious({
      userId: USER_ID,
      betId: BET_ID,
      before: new Date("2026-06-05T00:00:00.000Z"),
    });
    expect(before05?.id).toBe(W0_ID);
  });

  it("WeighIn: listByBet retorna as capturas em ordem cronológica", async () => {
    const list = await weighins.listByBet(BET_ID);
    expect(list.map((w) => w.id)).toEqual([W0_ID, W1_ID]);
  });

  it("ReviewRepository: listQueue retorna pesagens in_review com o nome do usuário (joins)", async () => {
    await weighins.save(
      WeighIn.create({
        id: W2_ID,
        userId: USER_ID,
        betId: BET_ID,
        challengeId: null,
        kind: "final",
        weightKg: 82,
        videoObjectKey: "k.mp4",
        status: "in_review",
        lossPerWeekKg: 1.2,
        capturedAt: new Date("2026-06-10T08:00:00.000Z"),
      }),
    );

    const queue = await reviewRepo.listQueue({ limit: 50, offset: 0 });
    const entry = queue.find((q) => q.weighinId === W2_ID);
    expect(entry?.userName).toBe("Integração");
    expect(entry?.kind).toBe("final");
    expect(entry?.reviewId).toBeNull(); // left join: ainda sem veredito
  });

  it("ReviewRepository: save → findByWeighin round-trip (verdict + checklist JSONB)", async () => {
    const flag = CHECKLIST_FLAGS[0];
    await reviewRepo.save(
      Review.create({
        id: REVIEW_ID,
        weighinId: W2_ID,
        reviewerId: USER_ID,
        verdict: "approved",
        reason: "Confere.",
        failedChecks: null,
        checklist: { [flag]: "ok" },
        decidedAt: new Date("2026-06-11T10:00:00.000Z"),
      }),
    );

    const found = await reviewRepo.findByWeighin(W2_ID);
    expect(found?.toJSON().verdict).toBe("approved");
    expect(found?.toJSON().checklist).toEqual({ [flag]: "ok" });
  });

  it("IdempotencyStore: save → find round-trip (responseBody em JSONB)", async () => {
    const record: IdempotencyRecord = {
      key: "idem-int-1",
      requestHash: "hash-1",
      responseBody: { betId: BET_ID, status: "pending_payment" },
      statusCode: 201,
      createdAt: new Date("2026-06-12T10:00:00.000Z"),
    };
    await idem.save(record);

    const found = await idem.find("idem-int-1");
    expect(found?.statusCode).toBe(201);
    expect(found?.requestHash).toBe("hash-1");
    expect(found?.responseBody).toEqual({ betId: BET_ID, status: "pending_payment" });
  });

  it("IdempotencyStore: chave repetida é no-op (exactly-once → anti-cobrança-dupla)", async () => {
    const key = "idem-int-2";
    await idem.save({
      key,
      requestHash: "h",
      responseBody: { v: "primeira" },
      statusCode: 201,
      createdAt: new Date("2026-06-12T11:00:00.000Z"),
    });
    // Segunda gravação com a MESMA chave (resposta diferente) → onConflictDoNothing.
    await idem.save({
      key,
      requestHash: "h",
      responseBody: { v: "segunda" },
      statusCode: 201,
      createdAt: new Date("2026-06-12T11:05:00.000Z"),
    });

    const found = await idem.find(key);
    expect(found?.responseBody).toEqual({ v: "primeira" }); // a primeira gravação vence
  });
});
