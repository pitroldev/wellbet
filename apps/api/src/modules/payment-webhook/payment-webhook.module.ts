import { Module } from "@nestjs/common";

import { BetModule } from "@/modules/bet/bet.module.js";
import { PaymentWebhookController } from "./payment-webhook.controller.js";
import { ProcessPaymentEventUseCase } from "./process-payment-event.use-case.js";

/**
 * Módulo de webhooks de pagamento. Importa BetModule (para o `BET_REPOSITORY`)
 * e usa o `PAYMENT` global (InfraModule).
 */
@Module({
  imports: [BetModule],
  controllers: [PaymentWebhookController],
  providers: [ProcessPaymentEventUseCase],
})
export class PaymentWebhookModule {}
