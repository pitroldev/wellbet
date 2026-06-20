import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { ENV, type Env } from "../../../config/config.module.js";
import { STORAGE, type StoragePort } from "../../../infra/storage/storage.port.js";
import { IssueChallengeUseCase as IssueChallengeCodeUseCase } from "../../challenge/application/issue-challenge.use-case.js";
import type { WeighInKind } from "../domain/weighin.entity.js";

export interface IssueWeighInChallengeCommand {
  readonly userId: string;
  readonly betId?: string | null;
  readonly kind: WeighInKind;
  readonly contentType?: string;
}

export interface IssueWeighInChallengeResult {
  /** Código dinâmico a exibir na captura. */
  readonly challenge: {
    readonly challengeId: string;
    readonly word: string;
    readonly number: number;
    readonly gesture: string;
    readonly nonce: string;
    readonly expiresAt: Date;
  };
  /** Onde o app deve subir o vídeo (PUT direto no R2). */
  readonly upload: {
    readonly url: string;
    readonly objectKey: string;
    readonly expiresAt: Date;
    readonly requiredHeaders?: Readonly<Record<string, string>>;
  };
}

/**
 * IssueChallengeUseCase (escopo weighin) — abre uma sessão de captura.
 *
 * Orquestra duas bordas:
 *  - emite o código dinâmico (delega ao use-case do módulo challenge);
 *  - pré-assina a URL de upload do vídeo no R2 (StoragePort).
 *
 * O app exibe o código, grava o vídeo contínuo e faz PUT direto no R2; só
 * depois chama o submit com a `objectKey` e o `nonce`. O pico de upload não
 * toca o backend (§3 mobile do doc).
 */
@Injectable()
export class IssueChallengeUseCase {
  constructor(
    private readonly issueCode: IssueChallengeCodeUseCase,
    @Inject(STORAGE) private readonly storage: StoragePort,
    @Inject(ENV) private readonly env: Env,
  ) {}

  async execute(cmd: IssueWeighInChallengeCommand): Promise<IssueWeighInChallengeResult> {
    const challenge = await this.issueCode.execute({ userId: cmd.userId });

    const objectKey = buildObjectKey(cmd);
    const presigned = await this.storage.presignUpload({
      key: objectKey,
      contentType: cmd.contentType ?? "video/mp4",
      expiresInSeconds: this.env.STORAGE_PRESIGN_TTL_SECONDS,
    });

    return {
      challenge: {
        challengeId: challenge.challengeId,
        word: challenge.word,
        number: challenge.number,
        gesture: challenge.gesture,
        nonce: challenge.nonce,
        expiresAt: challenge.expiresAt,
      },
      upload: {
        url: presigned.url,
        objectKey: presigned.key,
        expiresAt: presigned.expiresAt,
        requiredHeaders: presigned.requiredHeaders,
      },
    };
  }
}

/** Chave estável do objeto de vídeo no bucket. */
function buildObjectKey(cmd: IssueWeighInChallengeCommand): string {
  const segment = cmd.betId ? `bet-${cmd.betId}` : "adhoc";
  return `weighins/${cmd.userId}/${segment}/${cmd.kind}-${randomUUID()}.mp4`;
}
