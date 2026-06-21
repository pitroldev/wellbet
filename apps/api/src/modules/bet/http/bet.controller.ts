import { Body, Controller, Get, Post, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import {
  Idempotent,
  IdempotencyInterceptor,
} from "@/shared/idempotency/idempotency.interceptor.js";
import { ListBetsUseCase } from "@/modules/bet/application/list-bets.use-case.js";
import { PlaceBetUseCase } from "@/modules/bet/application/place-bet.use-case.js";
import { BetResponseDto, BetSummaryDto, PlaceBetDto } from "./bet.dto.js";

/**
 * Controller de apostas.
 *
 *  GET  /bets — lista as apostas do usuário autenticado.
 *  POST /bets — cria uma aposta. ESCRITA FINANCEIRA → idempotente:
 *  exige header `Idempotency-Key` (IdempotencyInterceptor + @Idempotent).
 *
 * O settlement NÃO tem endpoint: roda no worker da fila após o veredito
 * APROVADO da revisão.
 */
@ApiTags("bet")
@Controller("bets")
@UseGuards(AuthGuard)
export class BetController {
  constructor(
    private readonly placeBet: PlaceBetUseCase,
    private readonly listBets: ListBetsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Lista as apostas do usuário autenticado." })
  @ApiOkResponse({ type: [BetSummaryDto] })
  async list(@Req() req: AuthenticatedRequest): Promise<BetSummaryDto[]> {
    return this.listBets.execute(req.user!.id);
  }

  @Post()
  @UseInterceptors(IdempotencyInterceptor)
  @Idempotent()
  @ApiHeader({
    name: "Idempotency-Key",
    required: true,
    description: "Chave de idempotência (escrita financeira).",
  })
  @ApiOperation({ summary: "Cria uma aposta (idempotente)." })
  async place(@Req() req: AuthenticatedRequest, @Body() dto: PlaceBetDto): Promise<BetResponseDto> {
    return this.placeBet.execute({
      userId: req.user!.id,
      targetWeightKg: dto.targetWeightKg,
      startWeightKg: dto.startWeightKg,
      stakeAmount: dto.stakeAmount,
      currency: dto.currency,
    });
  }
}
