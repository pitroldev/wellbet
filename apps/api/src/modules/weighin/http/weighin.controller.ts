import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { ValidateChallengeUseCase } from "@/modules/challenge/application/validate-challenge.use-case.js";
import { IssueChallengeUseCase } from "@/modules/weighin/application/issue-challenge.use-case.js";
import { SubmitWeighInUseCase } from "@/modules/weighin/application/submit-weighin.use-case.js";
import {
  StartWeighInDto,
  StartWeighInResponseDto,
  SubmitWeighInDto,
  SubmitWeighInResponseDto,
} from "./weighin.dto.js";
import { toStartResponse, toSubmitResponse } from "./weighin.mapper.js";

/**
 * Controller de pesagem.
 *
 *  POST /weighins/start   — abre sessão: código dinâmico + URL de upload R2.
 *  POST /weighins         — submete a pesagem: valida o nonce (anti-replay),
 *                            aplica a regra dura e enfileira para revisão.
 */
@ApiTags("weighin")
@Controller("weighins")
@UseGuards(AuthGuard)
export class WeighInController {
  constructor(
    private readonly issueChallenge: IssueChallengeUseCase,
    private readonly validateChallenge: ValidateChallengeUseCase,
    private readonly submitWeighIn: SubmitWeighInUseCase,
  ) {}

  @Post("start")
  @ApiOperation({
    summary: "Abre uma sessão de captura (código dinâmico + URL de upload).",
  })
  async start(
    @Req() req: AuthenticatedRequest,
    @Body() dto: StartWeighInDto,
  ): Promise<StartWeighInResponseDto> {
    const result = await this.issueChallenge.execute({
      userId: req.user!.id,
      betId: dto.betId,
      kind: dto.kind,
      contentType: dto.contentType,
    });
    return toStartResponse(result);
  }

  @Post()
  @ApiOperation({ summary: "Submete a pesagem capturada." })
  async submit(
    @Req() req: AuthenticatedRequest,
    @Body() dto: SubmitWeighInDto,
  ): Promise<SubmitWeighInResponseDto> {
    // 1. Anti-replay: valida e consome o código dinâmico (uso único).
    const { challengeId } = await this.validateChallenge.execute({
      userId: req.user!.id,
      nonce: dto.nonce,
    });

    // 2. Regra dura + enfileiramento na revisão humana.
    const result = await this.submitWeighIn.execute({
      userId: req.user!.id,
      betId: dto.betId,
      challengeId,
      kind: dto.kind,
      weightKg: dto.weightKg,
      videoObjectKey: dto.videoObjectKey,
    });

    return toSubmitResponse(result);
  }
}
