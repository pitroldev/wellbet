import { Inject, Injectable } from "@nestjs/common";

import { STORAGE, type StoragePort } from "@/infra/storage/storage.port.js";
import type { WeighInKind } from "@/modules/weighin/domain/weighin.entity.js";
import { REVIEW_REPOSITORY, type ReviewRepositoryPort } from "./review.repository.port.js";

export interface ListReviewQueueCommand {
  readonly limit?: number;
  readonly offset?: number;
}

/** Item da fila como o console de revisão consome (contrato HTTP). */
export interface ReviewQueueEntry {
  readonly weighinId: string;
  readonly userId: string;
  readonly userName: string | null;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  readonly lossPerWeekKg: number | null;
  readonly capturedAt: string;
  readonly reviewId: string | null;
  /** URL pré-assinada para o revisor assistir o vídeo. */
  readonly videoUrl: string;
}

/**
 * ListReviewQueueUseCase — fila única de revisão humana (doc §5/§8).
 *
 * Lista as pesagens `in_review` e anexa a URL pré-assinada de download do vídeo
 * (StoragePort). A `videoObjectKey` interna NÃO vai para o cliente — só a URL.
 */
@Injectable()
export class ListReviewQueueUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly repo: ReviewRepositoryPort,
    @Inject(STORAGE) private readonly storage: StoragePort,
  ) {}

  async execute(cmd: ListReviewQueueCommand): Promise<ReviewQueueEntry[]> {
    const limit = Math.min(cmd.limit ?? 50, 200);
    const offset = cmd.offset ?? 0;

    const items = await this.repo.listQueue({ limit, offset });

    return Promise.all(
      items.map(async (item) => {
        const presigned = await this.storage.presignDownload({ key: item.videoObjectKey });
        return {
          weighinId: item.weighinId,
          userId: item.userId,
          userName: item.userName,
          kind: item.kind,
          weightKg: item.weightKg,
          lossPerWeekKg: item.lossPerWeekKg,
          capturedAt: item.capturedAt.toISOString(),
          reviewId: item.reviewId ?? null,
          videoUrl: presigned.url,
        };
      }),
    );
  }
}
