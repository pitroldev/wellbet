import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { PAYMENT, type PaymentPort } from "@/infra/payment/payment.port.js";
import { NotFoundError, ValidationError } from "@/shared/errors.js";
import { decimalToCents } from "@/shared/money.js";
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from "@/modules/identity/application/user.repository.port.js";
import { Bet } from "@/modules/bet/domain/bet.entity.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";

export interface PlaceBetCommand {
  readonly userId: string;
  readonly targetWeightKg: number;
  readonly startWeightKg?: number | null;
  readonly stakeAmount: string;
  readonly currency?: string;
}

export interface PlaceBetResult {
  readonly betId: string;
  readonly status: Bet["status"];
  /** Pix copia-e-cola para o app exibir e o usuário pagar o stake. */
  readonly brcode: string;
  readonly chargeExpiresAt: string;
}

/**
 * PlaceBetUseCase — cria uma aposta e a cobrança Pix do stake.
 *
 * Fluxo: gera a aposta em `pending_payment` + uma cobrança Pix (Invoice) e
 * devolve o BR Code. A aposta só vira `open` (ativa) quando o webhook
 * `charge.paid` confirma o pagamento (ProcessPaymentEventUseCase).
 *
 * Escrita financeira → protegida por idempotência no controller (header
 * Idempotency-Key). A cobrança em si é idempotente pelo `externalId = bet:{id}`.
 */
@Injectable()
export class PlaceBetUseCase {
  constructor(
    @Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(PAYMENT) private readonly payment: PaymentPort,
  ) {}

  async execute(cmd: PlaceBetCommand): Promise<PlaceBetResult> {
    const user = await this.users.findById(cmd.userId);
    if (!user) {
      throw new NotFoundError("Usuário não encontrado.", { userId: cmd.userId });
    }
    if (!user.taxId) {
      throw new ValidationError(
        "Informe seu CPF antes de apostar (necessário para a cobrança Pix).",
      );
    }

    const betId = randomUUID();
    // MVP: o payout é igual ao stake — "recupera o que apostou" ao bater a meta.
    // TODO(payout): engine de odds/pool (ganho sobre o stake) é Fase 2.
    const payoutAmount = cmd.stakeAmount;

    const charge = await this.payment.createPixCharge({
      externalId: `bet:${betId}`,
      amountCents: decimalToCents(cmd.stakeAmount),
      payer: { name: user.name ?? user.email, taxId: user.taxId },
      description: "Stake da aposta Charya",
    });

    const bet = Bet.create({
      id: betId,
      userId: cmd.userId,
      startWeightKg: cmd.startWeightKg ?? null,
      targetWeightKg: cmd.targetWeightKg,
      stakeAmount: cmd.stakeAmount,
      payoutAmount,
      currency: cmd.currency ?? "BRL",
      status: "pending_payment",
      stakeChargeId: charge.providerId,
    });
    await this.bets.save(bet);

    return {
      betId: bet.id,
      status: bet.status,
      brcode: charge.brcode,
      chargeExpiresAt: charge.expiresAt.toISOString(),
    };
  }
}
