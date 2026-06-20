import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { ENV, type Env } from "../../../config/config.module.js";
import { WeightImplausibleError } from "../../../shared/errors.js";
import { QUEUE, QueueName, type QueuePort } from "../../../infra/queue/queue.port.js";
import { checkSanity } from "../domain/sanity.js";
import { WeighIn, type WeighInKind } from "../domain/weighin.entity.js";
import { WEIGHIN_REPOSITORY, type WeighInRepositoryPort } from "./weighin.repository.port.js";

export interface SubmitWeighInCommand {
  readonly userId: string;
  readonly betId?: string | null;
  readonly challengeId?: string | null;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  /** Chave do vídeo já enviado ao R2 via URL pré-assinada. */
  readonly videoObjectKey: string;
  readonly capturedAt?: Date;
}

export interface SubmitWeighInResult {
  readonly weighinId: string;
  readonly status: WeighIn["status"];
  readonly lossPerWeekKg: number | null;
}

/**
 * SubmitWeighInUseCase — registra uma pesagem capturada.
 *
 * Fluxo (doc de Validação §5/§6):
 *  1. Calcula perda/semana contra a pesagem anterior.
 *  2. Aplica a regra DURA de sanidade:
 *       - implausível → BLOQUEIO (status `blocked`, lança WeightImplausibleError).
 *       - plausível   → entra na fila de revisão humana (`in_review`).
 *  3. Persiste e publica o job de enfileiramento na revisão.
 */
@Injectable()
export class SubmitWeighInUseCase {
  constructor(
    @Inject(WEIGHIN_REPOSITORY)
    private readonly repo: WeighInRepositoryPort,
    @Inject(QUEUE) private readonly queue: QueuePort,
    @Inject(ENV) private readonly env: Env,
  ) {}

  async execute(cmd: SubmitWeighInCommand): Promise<SubmitWeighInResult> {
    const capturedAt = cmd.capturedAt ?? new Date();

    const weighin = WeighIn.create({
      id: randomUUID(),
      userId: cmd.userId,
      betId: cmd.betId ?? null,
      challengeId: cmd.challengeId ?? null,
      kind: cmd.kind,
      weightKg: cmd.weightKg,
      videoObjectKey: cmd.videoObjectKey,
      status: "pending",
      capturedAt,
    });

    // Regra dura só faz sentido se houver pesagem anterior para comparar.
    const previous = await this.repo.findPrevious({
      userId: cmd.userId,
      betId: cmd.betId,
      before: capturedAt,
    });

    let lossPerWeekKg: number | null = null;

    if (previous) {
      const weeks = weeksBetween(previousCapturedAt(previous), capturedAt);
      const sanity = checkSanity({
        previousWeightKg: previous.weightKg,
        currentWeightKg: cmd.weightKg,
        weeks,
        hardLimitKgPerWeek: this.env.WEIGHT_HARD_LIMIT_KG_PER_WEEK,
      });

      lossPerWeekKg = sanity.lossPerWeekKg;

      if (!sanity.ok) {
        // BLOQUEIO automático — não consome tempo do revisor (§6).
        weighin.block(sanity.lossPerWeekKg);
        await this.repo.save(weighin);
        throw new WeightImplausibleError({
          lossPerWeekKg: sanity.lossPerWeekKg,
          hardLimitKg: sanity.hardLimitKgPerWeek,
        });
      }
    }

    // Plausível (ou primeira pesagem) → fila de revisão humana.
    weighin.enqueueForReview(lossPerWeekKg);
    await this.repo.save(weighin);

    await this.queue.publish(QueueName.REVIEW_ENQUEUE, {
      weighinId: weighin.id,
    });

    return {
      weighinId: weighin.id,
      status: weighin.status,
      lossPerWeekKg,
    };
  }
}

/* ------------------------------- helpers ---------------------------------- */

function previousCapturedAt(previous: WeighIn): Date {
  // capturedAt está nos props da entidade.
  return previous.toJSON().capturedAt;
}

/** Diferença em semanas (mínimo de uma fração para evitar divisão por zero). */
function weeksBetween(a: Date, b: Date): number {
  const ms = Math.abs(b.getTime() - a.getTime());
  const weeks = ms / (1000 * 60 * 60 * 24 * 7);
  return weeks;
}
