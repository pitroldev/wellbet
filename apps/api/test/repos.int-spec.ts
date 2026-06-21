import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";

import { createDb, type DbHandle } from "@/infra/db/client.js";
import { Bet } from "@/modules/bet/domain/bet.entity.js";
import { User } from "@/modules/identity/domain/user.entity.js";
import { DrizzleBetRepository } from "@/modules/bet/infra/drizzle-bet.repository.js";
import { DrizzleUserRepository } from "@/modules/identity/infra/drizzle-user.repository.js";

const MIGRATIONS_DIR = join(process.cwd(), "src/infra/db/migrations");

// Colunas `id`/`user_id` são `uuid` no schema → IDs precisam ser UUIDs válidos.
const USER_ID = "11111111-1111-4111-8111-111111111111";
const BET_ID = "22222222-2222-4222-8222-222222222222";
const CHARGE_ID = "charge-int-1"; // stake_charge_id é texto (id do Stark Bank)

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

  beforeAll(async () => {
    container = await new PostgreSqlContainer("postgres:16-alpine").start();
    handle = createDb(container.getConnectionUri());
    await applyMigrations(handle);
    bets = new DrizzleBetRepository(handle);
    users = new DrizzleUserRepository(handle);
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
});
