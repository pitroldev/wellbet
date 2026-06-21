import { Inject, Injectable, Logger, type OnModuleInit } from "@nestjs/common";

import { QUEUE, QueueName, type QueuePort } from "@/infra/queue/queue.port.js";
import { SettleBetUseCase } from "./settle-bet.use-case.js";

interface SettleJob {
  readonly betId: string;
  readonly weighinId: string;
}

/**
 * Worker de settlement — consome a fila `bet.settle` (pg-boss).
 *
 * Registrado no boot do módulo. Cada job dispara o SettleBetUseCase (idempotente
 * por estado da aposta + singletonKey na publicação).
 */
@Injectable()
export class SettlementWorker implements OnModuleInit {
  private readonly logger = new Logger(SettlementWorker.name);

  constructor(
    @Inject(QUEUE) private readonly queue: QueuePort,
    private readonly settleBet: SettleBetUseCase,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.queue.subscribe<SettleJob>(QueueName.BET_SETTLE, async (job) => {
      const result = await this.settleBet.execute({
        betId: job.data.betId,
        weighinId: job.data.weighinId,
      });
      this.logger.log({ betId: result.betId, status: result.status }, "Aposta liquidada.");
    });
  }
}
