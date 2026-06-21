import { Inject, Injectable, Logger } from "@nestjs/common";

import type { PaymentWebhookEvent } from "@/infra/payment/payment.port.js";
import {
  BET_REPOSITORY,
  type BetRepositoryPort,
} from "@/modules/bet/application/bet.repository.port.js";

/**
 * Processa um evento de pagamento JÁ VERIFICADO e reflete na aposta:
 *  - `charge.paid`              → stake recebido → aposta `open` (ativa).
 *  - `charge.expired/canceled`  → aposta não paga → `voided`.
 *  - `payout.completed/failed`  → auditoria (a aposta já está won/lost).
 *
 * Idempotente: as transições do domínio são no-op se o estado já avançou — o
 * Stark Bank pode reentregar o mesmo webhook mais de uma vez.
 */
@Injectable()
export class ProcessPaymentEventUseCase {
  private readonly logger = new Logger(ProcessPaymentEventUseCase.name);

  constructor(@Inject(BET_REPOSITORY) private readonly bets: BetRepositoryPort) {}

  async execute(event: PaymentWebhookEvent): Promise<void> {
    switch (event.kind) {
      case "charge.paid": {
        const bet = await this.bets.findByStakeChargeId(event.providerId);
        if (bet) {
          bet.markStakePaid();
          await this.bets.save(bet);
        }
        return;
      }
      case "charge.expired":
      case "charge.canceled": {
        const bet = await this.bets.findByStakeChargeId(event.providerId);
        if (bet) {
          bet.voidUnpaid();
          await this.bets.save(bet);
        }
        return;
      }
      case "payout.completed":
      case "payout.failed":
        this.logger.log(`payout ${event.kind} (transfer=${event.providerId})`);
        return;
      default:
        return;
    }
  }
}
