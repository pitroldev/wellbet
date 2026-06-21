import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDb, type DbHandle } from "@/infra/db/client.js";
import { Bet } from "@/modules/bet/domain/bet.entity.js";
import { User } from "@/modules/identity/domain/user.entity.js";
import { WeighIn } from "@/modules/weighin/domain/weighin.entity.js";
import { DrizzleBetRepository } from "@/modules/bet/infra/drizzle-bet.repository.js";
import { DrizzleUserRepository } from "@/modules/identity/infra/drizzle-user.repository.js";
import { DrizzleWeighInRepository } from "@/modules/weighin/infra/drizzle-weighin.repository.js";

const MIGRATIONS_DIR = join(process.cwd(), "src/infra/db/migrations");

// Colunas `id`/`user_id` são `uuid` no schema → IDs precisam ser UUIDs válidos.
const USER_ID = "11111111-1111-4111-8111-111111111111";
const BET_ID = "22222222-2222-4222-8222-222222222222";
const CHARGE_ID = "charge-int-1"; // stake_charge_id é texto (id do Stark Bank)
const W0_ID = "33333333-3333-4333-8333-333333333333";
const W1_ID = "44444444-4444-4444-8444-444444444444";

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

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    handle = createDb(container.getConnectionUri());
    await applyMigrations(handle);
    bets = new DrizzleBetRepository(handle);
    users = new DrizzleUserRepository(handle);
    weighins = new DrizzleWeighInRepository(handle);
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
});
