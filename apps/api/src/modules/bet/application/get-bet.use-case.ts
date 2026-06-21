import { Inject, Injectable } from "@nestjs/common";

import { PAYMENT, type PaymentPort } from "@/infra/payment/payment.port.js";
import { NotFoundError } from "@/shared/errors.js";
import { BET_REPOSITORY, type BetRepositoryPort } from "./bet.repository.port.js";
import { type BetSummary, toBetSummary } from "./list-bets.use-case.js";

export interface PixChargeView {
  readonly brcode: string;
  readonly status: string;
  readonly expiresAt: string;
}

export interface BetDetail extends BetSummary {
  /** Cobrança Pix viva — presente só enquanto a aposta aguarda pagamento. */
  readonly pixCharge: PixChargeView | null;
}

/**
 * GetBetUseCase — detalhe de uma aposta do usuário.
 *
 * Se ainda aguarda pagamento (`pending_payment`), re-busca a cobrança no PSP
 * para devolver o BR Code atual — permite ao usuário RETOMAR o pagamento (ex.:
 * reabriu o app e perdeu o QR original).
 */
@Injectable()
export class GetBetUseCase {
  constructor(
    @Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort,
    @Inject(PAYMENT) private readonly payment: PaymentPort,
  ) {}

  async execute(args: { betId: string; userId: string }): Promise<BetDetail> {
    const bet = await this.bets.findById(args.betId);
    // 404 (não 403) quando não é do usuário: não vaza a existência de apostas alheias.
    if (!bet || bet.userId !== args.userId) {
      throw new NotFoundError("Aposta não encontrada.", { betId: args.betId });
    }

    let pixCharge: PixChargeView | null = null;
    if (bet.status === "pending_payment" && bet.stakeChargeId) {
      const charge = await this.payment.getCharge(bet.stakeChargeId);
      pixCharge = {
        brcode: charge.brcode,
        status: charge.status,
        expiresAt: charge.expiresAt.toISOString(),
      };
    }

    return { ...toBetSummary(bet), pixCharge };
  }
}
