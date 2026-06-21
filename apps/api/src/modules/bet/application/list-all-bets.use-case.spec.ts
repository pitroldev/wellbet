import { describe, expect, it, vi } from "vitest";

import type { AdminBetItem } from "./admin-bet-query.port.js";
import { ListAllBetsUseCase } from "./list-all-bets.use-case.js";

function item(over: Partial<AdminBetItem> = {}): AdminBetItem {
  return {
    betId: "bet-1",
    userId: "u-1",
    userName: "Fulano",
    status: "open",
    targetWeightKg: 80,
    startWeightKg: 90,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    createdAt: new Date("2026-06-21T10:00:00.000Z"),
    ...over,
  };
}

function makeDeps() {
  const query = { listAll: vi.fn() };
  const uc = new ListAllBetsUseCase(query);
  return { query, uc };
}

describe("ListAllBetsUseCase", () => {
  it("mapeia as apostas (createdAt ISO) e repassa status/paginação", async () => {
    const { query, uc } = makeDeps();
    query.listAll.mockResolvedValue([item(), item({ betId: "bet-2", status: "won" })]);

    const result = await uc.execute({ status: "open", limit: 10, offset: 5 });

    expect(query.listAll).toHaveBeenCalledWith({ status: "open", limit: 10, offset: 5 });
    expect(result[0]).toMatchObject({
      betId: "bet-1",
      userName: "Fulano",
      status: "open",
      createdAt: "2026-06-21T10:00:00.000Z",
    });
    expect(result).toHaveLength(2);
  });

  it("limita o page size a 200 (default 50) e offset 0", async () => {
    const { query, uc } = makeDeps();
    query.listAll.mockResolvedValue([]);

    await uc.execute({ limit: 999 });

    expect(query.listAll).toHaveBeenCalledWith({ status: undefined, limit: 200, offset: 0 });
  });
});
