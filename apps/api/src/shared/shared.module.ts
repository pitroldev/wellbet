import { Global, Module } from "@nestjs/common";
import { APP_FILTER } from "@nestjs/core";

import { AllExceptionsFilter } from "./all-exceptions.filter.js";
import { AuthGuard } from "./guards/auth.guard.js";
import { RolesGuard } from "./guards/roles.guard.js";
import { IdempotencyInterceptor } from "./idempotency/idempotency.interceptor.js";

/**
 * Módulo compartilhado (transversal).
 *
 * Registra o filtro global de exceções e exporta guards/interceptors reusados.
 * O `IdempotencyInterceptor` depende de `IDEMPOTENCY_STORE`, provido pelo
 * `InfraModule` (DbModule) — por isso é importado lá e só re-exportado aqui.
 */
@Global()
@Module({
  providers: [
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    AuthGuard,
    RolesGuard,
    IdempotencyInterceptor,
  ],
  exports: [AuthGuard, RolesGuard, IdempotencyInterceptor],
})
export class SharedModule {}
