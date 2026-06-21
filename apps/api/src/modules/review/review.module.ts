import { Module } from "@nestjs/common";

import { WeighInModule } from "@/modules/weighin/weighin.module.js";
import { ListReviewQueueUseCase } from "./application/list-review-queue.use-case.js";
import { REVIEW_REPOSITORY } from "./application/review.repository.port.js";
import { SubmitVerdictUseCase } from "./application/submit-verdict.use-case.js";
import { DrizzleReviewRepository } from "./infra/drizzle-review.repository.js";
import { ReviewController } from "./http/review.controller.js";

/**
 * Módulo review — fila + veredito da revisão humana (doc §5/§7/§9).
 *
 * Importa WeighInModule para reusar o WEIGHIN_REPOSITORY (refletir veredito no
 * status da pesagem). Queue/Storage vêm dos módulos @Global de infra.
 */
@Module({
  imports: [WeighInModule],
  controllers: [ReviewController],
  providers: [
    ListReviewQueueUseCase,
    SubmitVerdictUseCase,
    {
      provide: REVIEW_REPOSITORY,
      useClass: DrizzleReviewRepository,
    },
  ],
  exports: [SubmitVerdictUseCase],
})
export class ReviewModule {}
