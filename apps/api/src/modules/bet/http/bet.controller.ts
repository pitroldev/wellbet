import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { Roles, RolesGuard } from "@/shared/guards/roles.guard.js";
import {
  Idempotent,
  IdempotencyInterceptor,
} from "@/shared/idempotency/idempotency.interceptor.js";
import { GetBetUseCase } from "@/modules/bet/application/get-bet.use-case.js";
import { ListAllBetsUseCase } from "@/modules/bet/application/list-all-bets.use-case.js";
import { ListBetsUseCase } from "@/modules/bet/application/list-bets.use-case.js";
import { PlaceBetUseCase } from "@/modules/bet/application/place-bet.use-case.js";
import {
  AdminBetRowDto,
  AdminBetsQueryDto,
  BetDetailDto,
  BetResponseDto,
  BetSummaryDto,
  PlaceBetDto,
} from "./bet.dto.js";

/**
 * Controller de apostas.
 *
 *  GET  /bets     — lista as apostas do usuário autenticado.
 *  GET  /bets/all — lista TODAS as apostas (ops). Restrito a admin/reviewer.
 *  GET  /bets/:id — detalhe (com BR Code se a aposta aguarda pagamento).
 *  POST /bets     — cria uma aposta. ESCRITA FINANCEIRA → idempotente:
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
    private readonly getBet: GetBetUseCase,
    private readonly listAllBets: ListAllBetsUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Lista as apostas do usuário autenticado." })
  @ApiOkResponse({ type: [BetSummaryDto] })
  async list(@Req() req: AuthenticatedRequest): Promise<BetSummaryDto[]> {
    return this.listBets.execute(req.user!.id);
  }

  // Antes de `:id` para a rota estática "all" não cair no parâmetro.
  @Get("all")
  @UseGuards(RolesGuard)
  @Roles("admin", "reviewer")
  @ApiOperation({ summary: "Lista TODAS as apostas (ops). Restrito a admin/reviewer." })
  @ApiOkResponse({ type: [AdminBetRowDto] })
  async listAll(@Query() query: AdminBetsQueryDto): Promise<AdminBetRowDto[]> {
    return this.listAllBets.execute({
      status: query.status,
      limit: query.limit,
      offset: query.offset,
    });
  }

  @Get(":id")
  @ApiOperation({ summary: "Detalhe de uma aposta (BR Code se pendente de pagamento)." })
  @ApiOkResponse({ type: BetDetailDto })
  async detail(@Req() req: AuthenticatedRequest, @Param("id") id: string): Promise<BetDetailDto> {
    return this.getBet.execute({ betId: id, userId: req.user!.id });
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
  @ApiOkResponse({ type: BetResponseDto })
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
