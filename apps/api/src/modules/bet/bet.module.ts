import { Module } from "@nestjs/common";

import { IdentityModule } from "@/modules/identity/identity.module.js";
import { WeighInModule } from "@/modules/weighin/weighin.module.js";
import { ADMIN_BET_QUERY } from "./application/admin-bet-query.port.js";
import { BET_REPOSITORY } from "./application/bet.repository.port.js";
import { GetBetUseCase } from "./application/get-bet.use-case.js";
import { ListAllBetsUseCase } from "./application/list-all-bets.use-case.js";
import { ListBetsUseCase } from "./application/list-bets.use-case.js";
import { PlaceBetUseCase } from "./application/place-bet.use-case.js";
import { SettleBetUseCase } from "./application/settle-bet.use-case.js";
import { SettlementWorker } from "./application/settlement.worker.js";
import { DrizzleBetRepository } from "./infra/drizzle-bet.repository.js";
import { BetController } from "./http/bet.controller.js";

/**
 * Módulo bet — aposta + settlement (idempotência financeira, §2 do doc).
 *
 * Importa WeighInModule (settlement lê a pesagem final aprovada). O worker de
 * settlement consome a fila `bet.settle` publicada pelo módulo review.
 */
@Module({
  imports: [WeighInModule, IdentityModule],
  controllers: [BetController],
  providers: [
    PlaceBetUseCase,
    ListBetsUseCase,
    GetBetUseCase,
    ListAllBetsUseCase,
    SettleBetUseCase,
    SettlementWorker,
    {
      provide: BET_REPOSITORY,
      useClass: DrizzleBetRepository,
    },
    // Mesmo adapter Drizzle serve o port de query admin (sem nova instância).
    {
      provide: ADMIN_BET_QUERY,
      useExisting: BET_REPOSITORY,
    },
  ],
  exports: [SettleBetUseCase, BET_REPOSITORY],
})
export class BetModule {}
