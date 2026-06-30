import { Module } from "@nestjs/common";

import { CreateCriterionUseCase } from "./application/create-criterion.use-case.js";
import { CRITERIA_REPOSITORY } from "./application/criteria.repository.port.js";
import { ListCriteriaUseCase } from "./application/list-criteria.use-case.js";
import { UpdateCriterionUseCase } from "./application/update-criterion.use-case.js";
import { DrizzleCriteriaRepository } from "./infra/drizzle-criteria.repository.js";
import { CriteriaController } from "./http/criteria.controller.js";

/**
 * Módulo criteria — critérios de aprovação configuráveis (checklist da revisão).
 * CRUD global gerenciado pelo console; o DB (DATABASE) vem do módulo @Global de
 * infra.
 */
@Module({
  controllers: [CriteriaController],
  providers: [
    ListCriteriaUseCase,
    CreateCriterionUseCase,
    UpdateCriterionUseCase,
    {
      provide: CRITERIA_REPOSITORY,
      useClass: DrizzleCriteriaRepository,
    },
  ],
})
export class CriteriaModule {}
