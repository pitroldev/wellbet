import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { Roles, RolesGuard } from "@/shared/guards/roles.guard.js";
import { GetReviewDetailUseCase } from "@/modules/review/application/get-review-detail.use-case.js";
import { ListReviewQueueUseCase } from "@/modules/review/application/list-review-queue.use-case.js";
import { SubmitVerdictUseCase } from "@/modules/review/application/submit-verdict.use-case.js";
import {
  ListReviewQueueDto,
  ReviewDetailDto,
  ReviewQueueEntryDto,
  SubmitVerdictDto,
  VerdictResponseDto,
} from "./review.dto.js";

/**
 * Controller de revisão (console interno).
 *
 *  GET  /reviews/queue      — fila única de pesagens aguardando veredito.
 *  GET  /reviews/:weighinId  — detalhe (vídeo + código esperado + veredito).
 *  POST /reviews/verdict     — registra APROVADO/PENDENTE/REPROVADO + motivo/flags.
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
    private readonly getReviewDetail: GetReviewDetailUseCase,
    private readonly submitVerdict: SubmitVerdictUseCase,
  ) {}

  @Get("queue")
  @ApiOperation({ summary: "Fila de revisão humana (pesagens in_review)." })
  @ApiOkResponse({ type: [ReviewQueueEntryDto] })
  async queue(@Query() dto: ListReviewQueueDto): Promise<ReviewQueueEntryDto[]> {
    return this.listQueue.execute({ limit: dto.limit, offset: dto.offset });
  }

  @Get(":weighinId")
  @ApiOperation({ summary: "Detalhe de uma pesagem para revisão." })
  @ApiOkResponse({ type: ReviewDetailDto })
  async detail(@Param("weighinId") weighinId: string): Promise<ReviewDetailDto> {
    return this.getReviewDetail.execute(weighinId);
  }

  @Post("verdict")
  @ApiOperation({ summary: "Registra o veredito da revisão humana." })
  @ApiOkResponse({ type: VerdictResponseDto })
  async verdict(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SubmitVerdictDto,
  ): Promise<VerdictResponseDto> {
    return this.submitVerdict.execute({
      reviewerId: req.user!.id,
      weighinId: dto.weighinId,
      verdict: dto.verdict,
      reason: dto.reason,
      failedChecks: dto.failedChecks ?? null,
      checklist: dto.checklist ?? null,
    });
  }
}
