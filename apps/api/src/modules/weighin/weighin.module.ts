import { Module } from "@nestjs/common";

import { ChallengeModule } from "../challenge/challenge.module.js";
import { IssueChallengeUseCase } from "./application/issue-challenge.use-case.js";
import { SubmitWeighInUseCase } from "./application/submit-weighin.use-case.js";
import { WEIGHIN_REPOSITORY } from "./application/weighin.repository.port.js";
import { DrizzleWeighInRepository } from "./infra/drizzle-weighin.repository.js";
import { WeighInController } from "./http/weighin.controller.js";

/**
 * Módulo weighin — pesagem (T0/T1/T2), regra dura de sanidade, fila de revisão.
 *
 * Depende de ChallengeModule (emite/valida o código dinâmico). Storage e Queue
 * vêm dos módulos @Global de infra.
 */
@Module({
  imports: [ChallengeModule],
  controllers: [WeighInController],
  providers: [
    IssueChallengeUseCase,
    SubmitWeighInUseCase,
    {
      provide: WEIGHIN_REPOSITORY,
      useClass: DrizzleWeighInRepository,
    },
  ],
  exports: [SubmitWeighInUseCase, WEIGHIN_REPOSITORY],
})
export class WeighInModule {}
