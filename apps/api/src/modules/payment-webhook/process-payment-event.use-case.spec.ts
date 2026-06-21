import { describe, expect, it, vi } from "vitest";

import type { PaymentWebhookEvent } from "@/infra/payment/payment.port.js";
import { Bet, type BetProps } from "@/modules/bet/domain/bet.entity.js";
import { ProcessPaymentEventUseCase } from "./process-payment-event.use-case.js";

function makeBet(over: Partial<BetProps> = {}): Bet {
  return Bet.create({
    id: "bet-1",
    userId: "u1",
    targetWeightKg: 80,
    stakeAmount: "100.00",
    currency: "BRL",
    status: "pending_payment",
    stakeChargeId: "inv-1",
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
  const uc = new ProcessPaymentEventUseCase(bets);
  return { bets, uc };
}

function event(over: Partial<PaymentWebhookEvent>): PaymentWebhookEvent {
  return { kind: "unknown", providerId: "inv-1", raw: {}, ...over };
}

describe("ProcessPaymentEventUseCase", () => {
  it("charge.paid → ativa a aposta (pending_payment → open)", async () => {
    const { bets, uc } = makeDeps();
    const bet = makeBet();
    bets.findByStakeChargeId.mockResolvedValue(bet);

    await uc.execute(event({ kind: "charge.paid", providerId: "inv-1" }));

    expect(bet.status).toBe("open");
    expect(bets.save).toHaveBeenCalledWith(bet);
  });

  it("charge.expired → anula a aposta não paga (→ voided)", async () => {
    const { bets, uc } = makeDeps();
    const bet = makeBet();
    bets.findByStakeChargeId.mockResolvedValue(bet);

    await uc.execute(event({ kind: "charge.expired" }));

    expect(bet.status).toBe("voided");
    expect(bets.save).toHaveBeenCalledWith(bet);
  });

  it("é tolerante quando não acha a aposta (sem erro, sem save)", async () => {
    const { bets, uc } = makeDeps();
    bets.findByStakeChargeId.mockResolvedValue(undefined);

    await uc.execute(event({ kind: "charge.paid" }));

    expect(bets.save).not.toHaveBeenCalled();
  });

  it("payout.completed → auditoria (não mexe na aposta)", async () => {
    const { bets, uc } = makeDeps();

    await uc.execute(event({ kind: "payout.completed", providerId: "tr-1" }));

    expect(bets.findByStakeChargeId).not.toHaveBeenCalled();
    expect(bets.save).not.toHaveBeenCalled();
  });
});
