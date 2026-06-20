import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from "@nestjs/common";
import { PgBoss, type Job } from "pg-boss";

import { ENV, type Env } from "../../config/config.module.js";
import { type JobHandler, type PublishOptions, type QueuePort } from "./queue.port.js";

/**
 * Adapter pg-boss do QueuePort.
 *
 * pg-boss roda sobre o MESMO Postgres da aplicação (cria seu próprio schema
 * `pgboss`). Inicia/para junto do ciclo de vida do módulo Nest.
 */
@Injectable()
export class PgBossAdapter implements QueuePort, OnModuleInit, OnModuleDestroy {
  private readonly boss: PgBoss;

  constructor(@Inject(ENV) env: Env) {
    this.boss = new PgBoss({ connectionString: env.DATABASE_URL });
  }

  async onModuleInit(): Promise<void> {
    await this.boss.start();
  }

  async onModuleDestroy(): Promise<void> {
    await this.boss.stop({ graceful: true });
  }

  async publish<T>(queue: string, data: T, options?: PublishOptions): Promise<string | null> {
    return this.boss.send(queue, data as object, {
      startAfter: options?.startAfterSeconds,
      singletonKey: options?.singletonKey,
      retryLimit: options?.retryLimit ?? 3,
    });
  }

  async subscribe<T>(queue: string, handler: JobHandler<T>): Promise<void> {
    // pg-boss 12: `work` entrega lotes de jobs.
    await this.boss.work<T>(queue, async (jobs: Job<T>[]) => {
      for (const job of jobs) {
        await handler({ id: job.id, name: queue, data: job.data });
      }
    });
  }
}
