import { Inject, Injectable } from "@nestjs/common";

import { STORAGE, type StoragePort } from "../../../infra/storage/storage.port.js";
import {
  REVIEW_REPOSITORY,
  type ReviewQueueItem,
  type ReviewRepositoryPort,
} from "./review.repository.port.js";

export interface ListReviewQueueCommand {
  readonly limit?: number;
  readonly offset?: number;
}

export interface ReviewQueueEntry extends ReviewQueueItem {
  /** URL pré-assinada para o revisor assistir o vídeo. */
  readonly videoUrl: string;
}

/**
 * ListReviewQueueUseCase — fila única de revisão humana (doc §5/§8).
 *
 * Lista as pesagens `in_review` e anexa a URL pré-assinada de download do
 * vídeo (StoragePort) para o console de revisão reproduzir.
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
        const presigned = await this.storage.presignDownload({
          key: item.videoObjectKey,
        });
        return { ...item, videoUrl: presigned.url };
      }),
    );
  }
}
