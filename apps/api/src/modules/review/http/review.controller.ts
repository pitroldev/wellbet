import { Body, Controller, Get, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { Roles, RolesGuard } from "@/shared/guards/roles.guard.js";
import { ListReviewQueueUseCase } from "@/modules/review/application/list-review-queue.use-case.js";
import { SubmitVerdictUseCase } from "@/modules/review/application/submit-verdict.use-case.js";
import type { ChecklistFlag } from "@/modules/review/domain/review.entity.js";
import { ListReviewQueueDto, SubmitVerdictDto, VerdictResponseDto } from "./review.dto.js";

/**
 * Controller de revisão (console interno).
 *
 *  GET  /reviews/queue  — fila única de pesagens aguardando veredito.
 *  POST /reviews/verdict — registra APROVADO/PENDENTE/REPROVADO + motivo/flags.
 *
 * Restrito a `reviewer`/`admin` (RolesGuard).
 */
@ApiTags("review")
@Controller("reviews")
@UseGuards(AuthGuard, RolesGuard)
@Roles("reviewer", "admin")
export class ReviewController {
  constructor(
    private readonly listQueue: ListReviewQueueUseCase,
    private readonly submitVerdict: SubmitVerdictUseCase,
  ) {}

  @Get("queue")
  @ApiOperation({ summary: "Fila de revisão humana (pesagens in_review)." })
  async queue(@Query() dto: ListReviewQueueDto) {
    return this.listQueue.execute({ limit: dto.limit, offset: dto.offset });
  }

  @Post("verdict")
  @ApiOperation({ summary: "Registra o veredito da revisão humana." })
  async verdict(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SubmitVerdictDto,
  ): Promise<VerdictResponseDto> {
    return this.submitVerdict.execute({
      reviewerId: req.user!.id,
      weighinId: dto.weighinId,
      verdict: dto.verdict,
      reason: dto.reason,
      failedChecks: (dto.failedChecks as ChecklistFlag[] | null | undefined) ?? null,
    });
  }
}
