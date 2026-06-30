import { Module } from "@nestjs/common";
import { APP_GUARD, APP_PIPE } from "@nestjs/core";
import { ThrottlerGuard, ThrottlerModule } from "@nestjs/throttler";
import { ZodValidationPipe } from "nestjs-zod";

import { ConfigModule } from "./config/config.module.js";
import { InfraModule } from "./infra/infra.module.js";
import { BetModule } from "./modules/bet/bet.module.js";
import { ChallengeModule } from "./modules/challenge/challenge.module.js";
import { CriteriaModule } from "./modules/criteria/criteria.module.js";
import { HealthModule } from "./modules/health/health.module.js";
import { IdentityModule } from "./modules/identity/identity.module.js";
import { PaymentWebhookModule } from "./modules/payment-webhook/payment-webhook.module.js";
import { ReviewModule } from "./modules/review/review.module.js";
import { WeighInModule } from "./modules/weighin/weighin.module.js";
import { ObservabilityModule } from "./observability/observability.module.js";
import { AuthGuard } from "./shared/guards/auth.guard.js";
import { SharedModule } from "./shared/shared.module.js";

/**
 * Módulo raiz da aplicação.
 *
 * Ordem de composição:
 *  - ConfigModule        → env tipada (validada por @charya/env)
 *  - ObservabilityModule → Pino correlacionado a trace (OTel sobe em main.ts)
 *  - ThrottlerModule     → rate limit global (DoS/brute-force)
 *  - SharedModule        → filtro de exceções global, guards, interceptors
 *  - InfraModule         → adapters de borda (db, storage, queue, auth)
 *  - modules/*           → features (modular por feature + ports & adapters)
 *
 * O `ZodValidationPipe` global (nestjs-zod) valida todo DTO via Zod e alimenta
 * o OpenAPI a partir do mesmo schema.
 *
 * GUARDS GLOBAIS (APP_GUARD, rodam em ordem de registro):
 *  1. ThrottlerGuard → rate limit (antes de qualquer trabalho caro).
 *  2. AuthGuard      → exige sessão por padrão (fail-closed); rotas abertas
 *     optam por sair com `@Public()`. `req.user` é populado pelo middleware de
 *     sessão do AuthModule (infra/auth), que sempre roda antes dos guards.
 */
@Module({
  imports: [
    ConfigModule,
    ObservabilityModule,
    // Rate limit global: 100 requisições por minuto por IP/cliente.
    // `ttl` em MILISSEGUNDOS (throttler v6). Rotas sensíveis podem apertar via
    // `@Throttle(...)`; `/health` sai via `@SkipThrottle()`.
    ThrottlerModule.forRoot([
      {
        name: "default",
        ttl: 60_000, // 1 min
        limit: 100,
      },
    ]),
    SharedModule,
    HealthModule,
    InfraModule,
    // Features
    IdentityModule,
    ChallengeModule,
    WeighInModule,
    ReviewModule,
    CriteriaModule,
    BetModule,
    PaymentWebhookModule,
  ],
  providers: [
    {
      provide: APP_PIPE,
      useClass: ZodValidationPipe,
    },
    // Ordem importa: throttler primeiro (barato), depois auth.
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
