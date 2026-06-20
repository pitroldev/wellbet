import { Controller, Get } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { SkipThrottle } from "@nestjs/throttler";

import { Public } from "../../shared/guards/auth.guard.js";

/**
 * Liveness/readiness mínimo.
 *
 * `GET /api/health` — rota ABERTA (`@Public()`): o AuthGuard global a ignora,
 * para probes de orquestrador (k8s/Cloud Run) e load balancer não precisarem de
 * sessão. Também isenta do rate limit (`@SkipThrottle`) — probes são frequentes
 * e não devem consumir a cota.
 */
@ApiTags("health")
@Controller("health")
@SkipThrottle()
export class HealthController {
  @Get()
  @Public()
  @ApiOperation({ summary: "Liveness/readiness da API." })
  check(): { status: "ok"; uptime: number } {
    return { status: "ok", uptime: process.uptime() };
  }
}
