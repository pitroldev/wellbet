import { Module } from "@nestjs/common";

import { IssueChallengeUseCase } from "./application/issue-challenge.use-case.js";
import { ValidateChallengeUseCase } from "./application/validate-challenge.use-case.js";
import { CHALLENGE_REPOSITORY } from "./application/challenge.repository.port.js";
import { DrizzleChallengeRepository } from "./infra/drizzle-challenge.repository.js";
import { ChallengeController } from "./http/challenge.controller.js";

/**
 * Módulo challenge — código dinâmico server-side (nonce, uso único, TTL).
 *
 * Exporta `ValidateChallengeUseCase` para o módulo weighin consumir no submit
 * (validação anti-replay + consumo do nonce).
 */
@Module({
  controllers: [ChallengeController],
  providers: [
    IssueChallengeUseCase,
    ValidateChallengeUseCase,
    {
      provide: CHALLENGE_REPOSITORY,
      useClass: DrizzleChallengeRepository,
    },
  ],
  exports: [ValidateChallengeUseCase, IssueChallengeUseCase, CHALLENGE_REPOSITORY],
})
export class ChallengeModule {}
