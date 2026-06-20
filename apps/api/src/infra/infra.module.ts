import { Module } from "@nestjs/common";

import { AuthModule } from "./auth/auth.module.js";
import { DbModule } from "./db/db.module.js";
import { PaymentModule } from "./payment/payment.module.js";
import { QueueModule } from "./queue/queue.module.js";
import { StorageModule } from "./storage/storage.module.js";

/**
 * Agregador da camada de infra (adapters de borda).
 *
 * Todos os submódulos são @Global, então qualquer feature injeta os ports
 * (DATABASE, STORAGE, QUEUE, AUTH, PAYMENT, IDEMPOTENCY_STORE) sem reimportar.
 */
@Module({
  imports: [DbModule, StorageModule, QueueModule, AuthModule, PaymentModule],
  exports: [DbModule, StorageModule, QueueModule, AuthModule, PaymentModule],
})
export class InfraModule {}
