import { describe, expect, it } from "vitest";

import { Bet, type BetProps } from "./bet.entity.js";

function makeBet(over: Partial<BetProps> = {}): Bet {
  return Bet.create({
    id: "bet-1",
    userId: "user-1",
    targetWeightKg: 80,
    stakeAmount: "100.00",
    payoutAmount: "100.00",
    currency: "BRL",
    status: "pending_payment",
    ...over,
  });
}

describe("Bet — máquina de estados (pagamento + settlement)", () => {
  describe("markStakePaid", () => {
    it("pending_payment → open quando o stake é pago", () => {
      const bet = makeBet();
      bet.markStakePaid();
      expect(bet.status).toBe("open");
    });

    it("é idempotente: no-op se já está ativa (reentrega de webhook)", () => {
      const bet = makeBet({ status: "open" });
      bet.markStakePaid();
      expect(bet.status).toBe("open");
    });
  });

  describe("voidUnpaid", () => {
    it("pending_payment → voided quando a cobrança expira", () => {
      const bet = makeBet();
      bet.voidUnpaid();
      expect(bet.status).toBe("voided");
    });

    it("NÃO anula uma aposta já paga/ativa", () => {
      const bet = makeBet({ status: "open" });
      bet.voidUnpaid();
      expect(bet.status).toBe("open");
    });
  });

  describe("isSettleable", () => {
    it("só é liquidável com o stake pago (open/settling)", () => {
      expect(makeBet({ status: "open" }).isSettleable()).toBe(true);
      expect(makeBet({ status: "settling" }).isSettleable()).toBe(true);
      expect(makeBet({ status: "pending_payment" }).isSettleable()).toBe(false);
      expect(makeBet({ status: "won" }).isSettleable()).toBe(false);
      expect(makeBet({ status: "voided" }).isSettleable()).toBe(false);
    });
  });

  describe("settleWith", () => {
    it("meta batida (peso <= alvo) → won", () => {
      const bet = makeBet({ status: "open", targetWeightKg: 80 });
      bet.beginSettlement();
      expect(bet.settleWith(79.5)).toBe("won");
      expect(bet.status).toBe("won");
    });

    it("exatamente no alvo → won (<= é vitória)", () => {
      const bet = makeBet({ status: "open", targetWeightKg: 80 });
      expect(bet.settleWith(80)).toBe("won");
    });

    it("meta não batida (peso > alvo) → lost", () => {
      const bet = makeBet({ status: "open", targetWeightKg: 80 });
      expect(bet.settleWith(80.1)).toBe("lost");
      expect(bet.status).toBe("lost");
    });
  });

  it("attachStakeCharge e recordPayout persistem os ids do PSP", () => {
    const bet = makeBet();
    bet.attachStakeCharge("inv-1");
    bet.recordPayout("tr-1");
    const json = bet.toJSON();
    expect(json.stakeChargeId).toBe("inv-1");
    expect(json.payoutTransferId).toBe("tr-1");
  });
});
