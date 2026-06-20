import { randomBytes, randomInt } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { ENV, type Env } from "../../../config/config.module.js";
import { Challenge } from "../domain/challenge.entity.js";
import { generateCode, type RandomSource } from "../domain/code-generator.js";
import { CHALLENGE_REPOSITORY, type ChallengeRepositoryPort } from "./challenge.repository.port.js";

export interface IssueChallengeCommand {
  readonly userId: string;
}

export interface IssueChallengeResult {
  readonly challengeId: string;
  readonly word: string;
  readonly number: number;
  readonly gesture: string;
  readonly nonce: string;
  readonly expiresAt: Date;
}

/** Fonte de aleatoriedade criptográfica (produção). */
const cryptoRng: RandomSource = {
  int: (maxExclusive) => randomInt(maxExclusive),
  nonce: () => randomBytes(16).toString("hex"),
};

/**
 * IssueChallengeUseCase — emite um código dinâmico server-side.
 *
 * Gera {palavra, número, gesto, nonce}, fixa o TTL (env) e persiste. O nonce é
 * de uso único; a validação/consumo acontece no `ValidateChallengeUseCase`
 * (chamado no submit da pesagem).
 */
@Injectable()
export class IssueChallengeUseCase {
  // Fonte de aleatoriedade NÃO é injetada via DI (Nest não resolve interfaces).
  // A geração pura é testada em `code-generator` com um RNG determinístico.
  private readonly rng: RandomSource = cryptoRng;

  constructor(
    @Inject(CHALLENGE_REPOSITORY)
    private readonly repo: ChallengeRepositoryPort,
    @Inject(ENV) private readonly env: Env,
  ) {}

  async execute(cmd: IssueChallengeCommand): Promise<IssueChallengeResult> {
    const code = generateCode(this.rng);
    const now = new Date();
    const ttl = this.env.CHALLENGE_CODE_TTL_SECONDS ?? 120;
    const expiresAt = new Date(now.getTime() + ttl * 1000);

    const challenge = Challenge.create({
      id: this.rng.nonce(), // id opaco distinto do nonce de validação
      userId: cmd.userId,
      word: code.word,
      number: code.number,
      gesture: code.gesture,
      nonce: code.nonce,
      issuedAt: now,
      expiresAt,
      consumedAt: null,
    });

    await this.repo.save(challenge);

    return {
      challengeId: challenge.id,
      word: code.word,
      number: code.number,
      gesture: code.gesture,
      nonce: code.nonce,
      expiresAt,
    };
  }
}
