import { Global, Module } from "@nestjs/common";

import { StarkBankPaymentAdapter } from "./starkbank-payment.adapter.js";
import { PAYMENT } from "./payment.port.js";

/**
 * Módulo de pagamentos (infra). Liga o `PAYMENT` port ao adapter Stark Bank.
 * @Global para os módulos de feature (bet) injetarem `PAYMENT` sem reimportar.
 */
@Global()
@Module({
  providers: [
    {
      provide: PAYMENT,
      useClass: StarkBankPaymentAdapter,
    },
  ],
  exports: [PAYMENT],
})
export class PaymentModule {}
