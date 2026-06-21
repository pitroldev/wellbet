import { Global, Module, type OnModuleDestroy } from "@nestjs/common";

import { env } from "@/config/env.js";
import { IDEMPOTENCY_STORE } from "@/shared/idempotency/idempotency.port.js";
import { createDb, DATABASE, type DbHandle } from "./client.js";
import { DrizzleIdempotencyStore } from "./idempotency.adapter.js";

/**
 * Módulo de banco (infra).
 *
 * Provê o handle Drizzle (token `DATABASE`) e o store de idempotência. É
 * @Global para que repositórios de qualquer módulo injetem `DATABASE` sem
 * reimportar. Fecha o pool no shutdown.
 */
@Global()
@Module({
  providers: [
    {
      provide: DATABASE,
      useFactory: (): DbHandle => createDb(env.DATABASE_URL),
    },
    {
      provide: IDEMPOTENCY_STORE,
      useClass: DrizzleIdempotencyStore,
    },
  ],
  exports: [DATABASE, IDEMPOTENCY_STORE],
})
export class DbModule implements OnModuleDestroy {
  constructor() {}

  async onModuleDestroy(): Promise<void> {
    // O handle é resolvido pelo container; o encerramento do pool acontece via
    // SIGTERM handler do processo. TODO: injetar DATABASE aqui para `pool.end()`
    // determinístico quando o container desligar graciosamente.
  }
}
