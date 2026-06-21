import { describe, expect, it, vi } from "vitest";

import type { Payout } from "@/infra/payment/payment.port.js";
import { User, type UserProps } from "@/modules/identity/domain/user.entity.js";
import type { WeighInRepositoryPort } from "@/modules/weighin/application/weighin.repository.port.js";
import { Bet, type BetProps } from "@/modules/bet/domain/bet.entity.js";
import { SettleBetUseCase } from "./settle-bet.use-case.js";

type WeighInT = Awaited<ReturnType<WeighInRepositoryPort["findById"]>>;

function makeBet(over: Partial<BetProps> = {}): Bet {
  return Bet.create({
    id: "bet-1",
    userId: "u1",
    targetWeightKg: 80,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "open",
    ...over,
  });
}

function userWith(over: Partial<UserProps> = {}): User {
  return User.create({
    id: "u1",
    email: "a@b.com",
    role: "user",
    taxId: "12345678900",
    pixKey: "a@b.com",
    ...over,
  });
}

const approvedWeighin = (weightKg: number): WeighInT =>
  ({ status: "approved", weightKg }) as unknown as WeighInT;

const payout: Payout = { providerId: "tr-1", amountCents: 10000, status: "pending" };

function makeDeps() {
  const bets = {
    save: vi.fn(),
    findById: vi.fn(),
    findByStakeChargeId: vi.fn(),
    listByUser: vi.fn(),
  };
  const weighins = { findById: vi.fn(), save: vi.fn() };
  const users = {
    findById: vi.fn(),
    save: vi.fn(),
    findByEmail: vi.fn(),
    findByAuthUserId: vi.fn(),
  };
  const payment = {
    createPixCharge: vi.fn(),
    getCharge: vi.fn(),
    createPayout: vi.fn(),
    verifyAndParseWebhook: vi.fn(),
  };
  const uc = new SettleBetUseCase(
    bets,
    weighins as unknown as WeighInRepositoryPort,
    users,
    payment,
  );
  return { bets, weighins, users, payment, uc };
}

const cmd = { betId: "bet-1", weighinId: "w-1" };

describe("SettleBetUseCase", () => {
  it("vitória com chave Pix → paga o payout e registra a transferência", async () => {
    const { bets, weighins, users, payment, uc } = makeDeps();
    const bet = makeBet();
    bets.findById.mockResolvedValue(bet);
    weighins.findById.mockResolvedValue(approvedWeighin(79)); // <= alvo 80 → won
    users.findById.mockResolvedValue(userWith());
    payment.createPayout.mockResolvedValue(payout);

    const result = await uc.execute(cmd);

    expect(result.status).toBe("won");
    expect(payment.createPayout).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: 10000 }),
    );
    expect(bet.toJSON().payoutTransferId).toBe("tr-1");
  });

  it("vitória sem chave Pix → won, mas sem payout (saque pendente)", async () => {
    const { bets, weighins, users, payment, uc } = makeDeps();
    bets.findById.mockResolvedValue(makeBet());
    weighins.findById.mockResolvedValue(approvedWeighin(79));
    users.findById.mockResolvedValue(userWith({ pixKey: null }));

    const result = await uc.execute(cmd);

    expect(result.status).toBe("won");
    expect(payment.createPayout).not.toHaveBeenCalled();
  });

  it("derrota (peso > alvo) → lost, sem payout", async () => {
    const { bets, weighins, payment, uc } = makeDeps();
    bets.findById.mockResolvedValue(makeBet());
    weighins.findById.mockResolvedValue(approvedWeighin(81)); // > alvo 80 → lost

    const result = await uc.execute(cmd);

    expect(result.status).toBe("lost");
    expect(payment.createPayout).not.toHaveBeenCalled();
  });
});
