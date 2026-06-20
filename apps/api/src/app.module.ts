import { Module } from "@nestjs/common";
import { APP_PIPE } from "@nestjs/core";
import { ZodValidationPipe } from "nestjs-zod";

import { ConfigModule } from "./config/config.module.js";
import { InfraModule } from "./infra/infra.module.js";
import { BetModule } from "./modules/bet/bet.module.js";
import { ChallengeModule } from "./modules/challenge/challenge.module.js";
import { IdentityModule } from "./modules/identity/identity.module.js";
import { ReviewModule } from "./modules/review/review.module.js";
import { WeighInModule } from "./modules/weighin/weighin.module.js";
import { ObservabilityModule } from "./observability/observability.module.js";
import { SharedModule } from "./shared/shared.module.js";

/**
 * Módulo raiz da aplicação.
 *
 * Ordem de composição:
 *  - ConfigModule        → env tipada (validada por @charya/env)
 *  - ObservabilityModule → Pino correlacionado a trace (OTel sobe em main.ts)
 *  - SharedModule        → filtro de exceções global, guards, interceptors
 *  - InfraModule         → adapters de borda (db, storage, queue, auth)
 *  - modules/*           → features (modular por feature + ports & adapters)
 *
 * O `ZodValidationPipe` global (nestjs-zod) valida todo DTO via Zod e alimenta
 * o OpenAPI a partir do mesmo schema.
 */
@Module({
  imports: [
    ConfigModule,
    ObservabilityModule,
    SharedModule,
    InfraModule,
    // Features
    IdentityModule,
    ChallengeModule,
    WeighInModule,
    ReviewModule,
    BetModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
  ],
})
export class AppModule {}
