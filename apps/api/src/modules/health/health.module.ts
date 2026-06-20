import { Module } from "@nestjs/common";

import { HealthController } from "./health.controller.js";

/** Módulo de health check (rota pública, sem dependências de infra). */
@Module({
  controllers: [HealthController],
})
export class HealthModule {}
