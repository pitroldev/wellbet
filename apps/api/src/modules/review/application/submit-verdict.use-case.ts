import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { ConflictError, ErrorCode, NotFoundError } from "@/shared/errors.js";
import { QUEUE, QueueName, type QueuePort } from "@/infra/queue/queue.port.js";
import {
  WEIGHIN_REPOSITORY,
  type WeighInRepositoryPort,
} from "@/modules/weighin/application/weighin.repository.port.js";
import { type ChecklistFlag, Review, type Verdict } from "@/modules/review/domain/review.entity.js";
import { REVIEW_REPOSITORY, type ReviewRepositoryPort } from "./review.repository.port.js";

export interface SubmitVerdictCommand {
  readonly reviewerId: string;
  readonly weighinId: string;
  readonly verdict: Verdict;
  readonly reason?: string | null;
  readonly failedChecks?: ChecklistFlag[] | null;
}

export interface SubmitVerdictResult {
  readonly reviewId: string;
  readonly weighinId: string;
  readonly verdict: Verdict;
}

/**
 * SubmitVerdictUseCase — grava o veredito da revisão humana (doc §5/§7/§9).
 *
 *  - Cria/atualiza o Review com veredito + motivo + flags (dataset Fase 2).
 *  - Reflete o veredito no status da pesagem.
 *  - Se APROVADO e a pesagem pertence a uma aposta, publica o settlement.
 *
 * Veredito é decisão única: re-decidir uma pesagem já decidida → 409.
 */
@Injectable()
export class SubmitVerdictUseCase {
  constructor(
    @Inject(REVIEW_REPOSITORY)
    private readonly reviews: ReviewRepositoryPort,
    @Inject(WEIGHIN_REPOSITORY)
    private readonly weighins: WeighInRepositoryPort,
    @Inject(QUEUE) private readonly queue: QueuePort,
  ) {}

  async execute(cmd: SubmitVerdictCommand): Promise<SubmitVerdictResult> {
    const weighin = await this.weighins.findById(cmd.weighinId);
    if (!weighin) {
      throw new NotFoundError("Pesagem não encontrada.", {
        weighinId: cmd.weighinId,
      });
    }

    const existing = await this.reviews.findByWeighin(cmd.weighinId);
    if (existing?.isDecided()) {
      throw new ConflictError(
        ErrorCode.REVIEW_ALREADY_DECIDED,
        "Esta pesagem já recebeu veredito.",
      );
    }

    const review = existing ?? Review.create({ id: randomUUID(), weighinId: cmd.weighinId });

    review.decide({
      reviewerId: cmd.reviewerId,
      verdict: cmd.verdict,
      reason: cmd.reason,
      failedChecks: cmd.failedChecks,
    });
    await this.reviews.save(review);

    // Reflete no status da pesagem.
    weighin.applyVerdict(cmd.verdict);
    await this.weighins.save(weighin);

    // Settlement só dispara na aprovação da pesagem FINAL (T2) ligada a uma
    // aposta. Aprovar baseline/mid NÃO liquida — senão a aposta seria decidida
    // contra o peso errado (doc de Validação §3/§7).
    if (cmd.verdict === "approved" && weighin.kind === "final") {
      const betId = weighin.toJSON().betId;
      if (betId) {
        await this.queue.publish(
          QueueName.BET_SETTLE,
          { betId, weighinId: cmd.weighinId },
          // Singleton p/ evitar settlement duplicado da mesma pesagem.
          { singletonKey: `settle:${cmd.weighinId}` },
        );
      }
    }

    return {
      reviewId: review.id,
      weighinId: cmd.weighinId,
      verdict: cmd.verdict,
    };
  }
}
