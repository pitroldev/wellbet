import { Inject, Injectable } from "@nestjs/common";

import { ErrorCode, UnprocessableError } from "../../../shared/errors.js";
import { CHALLENGE_REPOSITORY, type ChallengeRepositoryPort } from "./challenge.repository.port.js";

export interface ValidateChallengeCommand {
  readonly userId: string;
  readonly nonce: string;
}

export interface ValidateChallengeResult {
  readonly challengeId: string;
}

/**
 * ValidateChallengeUseCase — valida e CONSOME o desafio (uso único).
 *
 * Chamado no submit da pesagem: confere que o nonce existe, pertence ao
 * usuário, não expirou e não foi usado. Em sucesso, marca como consumido
 * atomicamente (anti-replay, doc de Validação §5 "frescor").
 */
@Injectable()
export class ValidateChallengeUseCase {
  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly repo: ChallengeRepositoryPort,
  ) {}

  async execute(cmd: ValidateChallengeCommand): Promise<ValidateChallengeResult> {
    const challenge = await this.repo.findByNonce(cmd.nonce);

    if (!challenge || challenge.userId !== cmd.userId) {
      throw new UnprocessableError(
        ErrorCode.CHALLENGE_INVALID,
        "Código dinâmico inválido para esta sessão.",
      );
    }

    const now = new Date();
    if (challenge.isExpired(now)) {
      throw new UnprocessableError(
        ErrorCode.CHALLENGE_EXPIRED,
        "Código dinâmico expirado — gere um novo e recapture.",
      );
    }

    if (challenge.isConsumed()) {
      throw new UnprocessableError(
        ErrorCode.CHALLENGE_ALREADY_USED,
        "Código dinâmico já utilizado (uso único).",
      );
    }

    // Consumo atômico: o adapter usa UPDATE ... WHERE consumed_at IS NULL para
    // garantir uso único mesmo sob concorrência.
    challenge.consume(now);
    await this.repo.markConsumed(challenge.id, now);

    return { challengeId: challenge.id };
  }
}
