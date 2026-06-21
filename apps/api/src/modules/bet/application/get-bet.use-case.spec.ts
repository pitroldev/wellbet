import { describe, expect, it, vi } from "vitest";

import type { PixCharge } from "@/infra/payment/payment.port.js";
import { Bet, type BetProps } from "@/modules/bet/domain/bet.entity.js";
import { NotFoundError } from "@/shared/errors.js";
import { GetBetUseCase } from "./get-bet.use-case.js";

function bet(over: Partial<BetProps> = {}): Bet {
  return Bet.create({
    id: "bet-1",
    userId: "u-1",
    targetWeightKg: 80,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "pending_payment",
    stakeChargeId: "inv-1",
    ...over,
  });
}

const charge: PixCharge = {
  providerId: "inv-1",
  brcode: "00020101...pix",
  amountCents: 10000,
  status: "created",
  expiresAt: new Date("2026-06-21T12:00:00.000Z"),
};

function makeDeps() {
  const bets = {
    save: vi.fn(),
    findById: vi.fn(),
    findByStakeChargeId: vi.fn(),
    listByUser: vi.fn(),
  };
  const payment = {
    createPixCharge: vi.fn(),
    getCharge: vi.fn(),
    createPayout: vi.fn(),
    verifyAndParseWebhook: vi.fn(),
  };
  const uc = new GetBetUseCase(bets, payment);
  return { bets, payment, uc };
}

describe("GetBetUseCase", () => {
  it("aposta pendente → re-busca o BR Code no PSP (retomar pagamento)", async () => {
    const { bets, payment, uc } = makeDeps();
    bets.findById.mockResolvedValue(bet());
    payment.getCharge.mockResolvedValue(charge);

    const result = await uc.execute({ betId: "bet-1", userId: "u-1" });

    expect(payment.getCharge).toHaveBeenCalledWith("inv-1");
    expect(result).toMatchObject({
      betId: "bet-1",
      status: "pending_payment",
      pixCharge: { brcode: charge.brcode, status: "created" },
    });
  });

  it("aposta já paga (open) → não chama o PSP, pixCharge null", async () => {
    const { bets, payment, uc } = makeDeps();
    bets.findById.mockResolvedValue(bet({ status: "open" }));

    const result = await uc.execute({ betId: "bet-1", userId: "u-1" });

    expect(payment.getCharge).not.toHaveBeenCalled();
    expect(result.pixCharge).toBeNull();
  });

  it("aposta de OUTRO usuário → NotFoundError (não vaza existência)", async () => {
    const { bets, payment, uc } = makeDeps();
    bets.findById.mockResolvedValue(bet({ userId: "outro" }));

    await expect(uc.execute({ betId: "bet-1", userId: "u-1" })).rejects.toBeInstanceOf(
      NotFoundError,
    );
    expect(payment.getCharge).not.toHaveBeenCalled();
  });

  it("aposta inexistente → NotFoundError", async () => {
    const { bets, uc } = makeDeps();
    bets.findById.mockResolvedValue(undefined);

    await expect(uc.execute({ betId: "x", userId: "u-1" })).rejects.toBeInstanceOf(NotFoundError);
  });
});
