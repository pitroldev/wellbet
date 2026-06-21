/**
 * Port do repositório de revisões (camada application).
 */
import type { Review } from "@/modules/review/domain/review.entity.js";
import type { WeighInKind } from "@/modules/weighin/domain/weighin.entity.js";

export interface ReviewQueueItem {
  readonly weighinId: string;
  readonly userId: string;
  /** Nome do usuário que enviou a pesagem (o revisor precisa saber QUEM). */
  readonly userName: string | null;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  readonly videoObjectKey: string;
  readonly lossPerWeekKg: number | null;
  readonly capturedAt: Date;
  /** Existe um review já aberto (id) ou ainda não. */
  readonly reviewId?: string | null;
}

export interface ReviewRepositoryPort {
  /** Lista pesagens em `in_review` aguardando veredito (fila do revisor). */
  listQueue(args: { limit: number; offset: number }): Promise<ReviewQueueItem[]>;

  save(review: Review): Promise<void>;

  findById(id: string): Promise<Review | undefined>;

  findByWeighin(weighinId: string): Promise<Review | undefined>;
}

export const REVIEW_REPOSITORY = Symbol("REVIEW_REPOSITORY");
