import { Global, Module } from "@nestjs/common";

import { PgBossAdapter } from "./pgboss.adapter.js";
import { QUEUE } from "./queue.port.js";

/**
 * Módulo de fila (infra). Liga o `QUEUE` port ao adapter pg-boss.
 * @Global para os módulos de feature publicarem/consumirem sem reimportar.
 */
@Global()
@Module({
  providers: [
    {
      provide: QUEUE,
      useClass: PgBossAdapter,
    },
  ],
  exports: [QUEUE],
})
export class QueueModule {}
