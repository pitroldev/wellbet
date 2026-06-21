import { describe, expect, it, vi } from "vitest";

import { Bet, type BetProps } from "@/modules/bet/domain/bet.entity.js";
import { ListBetsUseCase } from "./list-bets.use-case.js";

function bet(over: Partial<BetProps> = {}): Bet {
  return Bet.create({
    id: "bet-1",
    userId: "u-1",
    targetWeightKg: 80,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "open",
    stakeChargeId: "inv-1",
    payoutTransferId: "tr-1",
    ...over,
  });
}

function makeDeps() {
  const bets = {
    save: vi.fn(),
    findById: vi.fn(),
    findByStakeChargeId: vi.fn(),
    listByUser: vi.fn(),
  };
  const uc = new ListBetsUseCase(bets);
  return { bets, uc };
}

describe("ListBetsUseCase", () => {
  it("mapeia as apostas do usuário para o resumo (sem vazar ids do PSP)", async () => {
    const { bets, uc } = makeDeps();
    bets.listByUser.mockResolvedValue([
      bet({ id: "bet-1", status: "open" }),
      bet({ id: "bet-2", status: "won", startWeightKg: 90 }),
    ]);

    const result = await uc.execute("u-1");

    expect(bets.listByUser).toHaveBeenCalledWith("u-1");
    expect(result).toHaveLength(2);
    expect(result[0]).toEqual({
      betId: "bet-1",
      status: "open",
      targetWeightKg: 80,
      startWeightKg: null,
      stakeAmount: "100.00",
      payoutAmount: "100.00",
      currency: "BRL",
    });
    expect(result[1]).toMatchObject({ betId: "bet-2", status: "won", startWeightKg: 90 });
    // ids internos do PSP não vazam para o cliente
    expect(result[0]).not.toHaveProperty("stakeChargeId");
    expect(result[0]).not.toHaveProperty("payoutTransferId");
  });

  it("sem apostas → array vazio", async () => {
    const { bets, uc } = makeDeps();
    bets.listByUser.mockResolvedValue([]);
    expect(await uc.execute("u-1")).toEqual([]);
  });
});
