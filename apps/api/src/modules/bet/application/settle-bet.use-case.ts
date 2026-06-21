import { Inject, Injectable } from "@nestjs/common";

import { PAYMENT, type PaymentPort } from "@/infra/payment/payment.port.js";
import { ConflictError, ErrorCode, NotFoundError } from "@/shared/errors.js";
import { decimalToCents } from "@/shared/money.js";
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from "@/modules/identity/application/user.repository.port.js";
import {
  WEIGHIN_REPOSITORY,
  type WeighInRepositoryPort,
} from "@/modules/weighin/application/weighin.repository.port.js";
import type { BetStatus } from "@/modules/bet/domain/bet.entity.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";

export interface SettleBetCommand {
  readonly betId: string;
  /** Pesagem final APROVADA que dispara o settlement. */
  readonly weighinId: string;
}

export interface SettleBetResult {
  readonly betId: string;
  readonly status: BetStatus;
}

/**
 * SettleBetUseCase — liquida a aposta após veredito APROVADO (doc §7).
 *
 * Consumido pelo worker da fila `bet.settle` (publicado por SubmitVerdict).
 * Idempotência:
 *  - a publicação usa singletonKey por pesagem (dedup na fila);
 *  - aqui, só liquida apostas em estado liquidável (open/settling); apostas já
 *    won/lost/voided são no-op seguro (replay do job não re-credita).
 */
@Injectable()
export class SettleBetUseCase {
  constructor(
    @Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort,
    @Inject(WEIGHIN_REPOSITORY)
    private readonly weighins: WeighInRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(PAYMENT) private readonly payment: PaymentPort,
  ) {}

  async execute(cmd: SettleBetCommand): Promise<SettleBetResult> {
    const bet = await this.bets.findById(cmd.betId);
    if (!bet) {
      throw new NotFoundError("Aposta não encontrada.", { betId: cmd.betId });
    }

    // Replay seguro: aposta já liquidada → retorna estado atual sem reprocessar.
    if (!bet.isSettleable()) {
      return { betId: bet.id, status: bet.status };
    }

    const weighin = await this.weighins.findById(cmd.weighinId);
    if (!weighin) {
      throw new NotFoundError("Pesagem final não encontrada.", {
        weighinId: cmd.weighinId,
      });
    }
    if (weighin.status !== "approved") {
      throw new ConflictError(
        ErrorCode.BET_NOT_SETTLEABLE,
        "Settlement exige pesagem final APROVADA pela revisão.",
      );
    }

    bet.beginSettlement();
    const status = bet.settleWith(weighin.weightKg);

    // Vitória → paga o prêmio via Pix (Transfer). O adapter resolve a chave no
    // DICT, valida o CPF e emite; o webhook confirma `payout.completed`.
    // Idempotência: `externalId` estável por aposta.
    if (status === "won") {
      const user = await this.users.findById(bet.userId);
      // Sem chave Pix/CPF, o resultado fica `won` mas o payout aguarda o saque.
      // TODO(payout): fila de payout pendente + notificação ao usuário.
      if (user?.pixKey && user.taxId) {
        const payout = await this.payment.createPayout({
          externalId: `bet:${bet.id}:payout`,
          amountCents: decimalToCents(bet.payoutAmount ?? bet.stakeAmount),
          recipient: {
            name: user.name ?? user.email,
            taxId: user.taxId,
            pixKey: user.pixKey,
          },
          description: "Prêmio Charya",
        });
        bet.recordPayout(payout.providerId);
      }
    }

    await this.bets.save(bet);
    return { betId: bet.id, status };
  }
}
