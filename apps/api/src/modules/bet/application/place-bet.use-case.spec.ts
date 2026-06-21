import { describe, expect, it, vi } from "vitest";

import type { PixCharge } from "../../../infra/payment/payment.port.js";
import { NotFoundError, ValidationError } from "../../../shared/errors.js";
import { User, type UserProps } from "../../identity/domain/user.entity.js";
import { PlaceBetUseCase } from "./place-bet.use-case.js";

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

const charge: PixCharge = {
  providerId: "inv-1",
  brcode: "00020101...pix",
  amountCents: 10000,
  status: "created",
  expiresAt: new Date("2026-06-21T00:00:00.000Z"),
};

function makeDeps() {
  const bets = {
    save: vi.fn(),
    findById: vi.fn(),
    findByStakeChargeId: vi.fn(),
    listByUser: vi.fn(),
  };
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
  const uc = new PlaceBetUseCase(bets, users, payment);
  return { bets, users, payment, uc };
}

const cmd = {
  userId: "u1",
  targetWeightKg: 80,
  stakeAmount: "100.00",
};

describe("PlaceBetUseCase", () => {
  it("cria a cobrança Pix do stake e salva a aposta em pending_payment", async () => {
    const { bets, users, payment, uc } = makeDeps();
    users.findById.mockResolvedValue(userWith());
    payment.createPixCharge.mockResolvedValue(charge);

    const result = await uc.execute(cmd);

    // converteu R$100,00 → 10000 centavos
    expect(payment.createPixCharge).toHaveBeenCalledWith(
      expect.objectContaining({ amountCents: 10000 }),
    );
    expect(bets.save).toHaveBeenCalledTimes(1);
    const saved = bets.save.mock.calls[0]?.[0] as { toJSON(): Record<string, unknown> };
    expect(saved.toJSON()).toMatchObject({
      status: "pending_payment",
      stakeChargeId: "inv-1",
    });
    expect(result).toMatchObject({ status: "pending_payment", brcode: charge.brcode });
  });

  it("rejeita (ValidationError) se o usuário não tem CPF", async () => {
    const { users, payment, uc } = makeDeps();
    users.findById.mockResolvedValue(userWith({ taxId: null }));

    await expect(uc.execute(cmd)).rejects.toBeInstanceOf(ValidationError);
    expect(payment.createPixCharge).not.toHaveBeenCalled();
  });

  it("rejeita (NotFoundError) se o usuário não existe", async () => {
    const { users, uc } = makeDeps();
    users.findById.mockResolvedValue(undefined);

    await expect(uc.execute(cmd)).rejects.toBeInstanceOf(NotFoundError);
  });
});
