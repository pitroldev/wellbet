import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { IssueChallengeUseCase } from "@/modules/challenge/application/issue-challenge.use-case.js";
import { ChallengeResponseDto, IssueChallengeDto } from "./challenge.dto.js";

/**
 * Controller do desafio dinâmico.
 *
 * POST /challenges — emite um código dinâmico (palavra + número + gesto +
 * nonce) para a sessão de captura atual do usuário autenticado.
 */
@ApiTags("challenge")
@Controller("challenges")
@UseGuards(AuthGuard)
export class ChallengeController {
  constructor(private readonly issueChallenge: IssueChallengeUseCase) {}

  @Post()
  @ApiOperation({ summary: "Emite um código dinâmico para a captura." })
  @ApiOkResponse({ type: ChallengeResponseDto })
  async issue(
    @Req() req: AuthenticatedRequest,
    @Body() _dto: IssueChallengeDto,
  ): Promise<ChallengeResponseDto> {
    const result = await this.issueChallenge.execute({ userId: req.user!.id });
    return {
      challengeId: result.challengeId,
      word: result.word,
      number: result.number,
      gesture: result.gesture,
      nonce: result.nonce,
      expiresAt: result.expiresAt.toISOString(),
    };
  }
}
