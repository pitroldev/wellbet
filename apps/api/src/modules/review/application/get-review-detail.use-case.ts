import { Inject, Injectable } from "@nestjs/common";

import { STORAGE, type StoragePort } from "@/infra/storage/storage.port.js";
import {
  CHALLENGE_REPOSITORY,
  type ChallengeRepositoryPort,
} from "@/modules/challenge/application/challenge.repository.port.js";
import {
  USER_REPOSITORY,
  type UserRepositoryPort,
} from "@/modules/identity/application/user.repository.port.js";
import type { Checklist, Verdict } from "@/modules/review/domain/review.entity.js";
import {
  WEIGHIN_REPOSITORY,
  type WeighInRepositoryPort,
} from "@/modules/weighin/application/weighin.repository.port.js";
import type { WeighInKind, WeighInStatus } from "@/modules/weighin/domain/weighin.entity.js";
import { NotFoundError } from "@/shared/errors.js";
import { REVIEW_REPOSITORY, type ReviewRepositoryPort } from "./review.repository.port.js";

/** Código dinâmico emitido para a captura (o revisor confere com o vídeo). */
export interface ExpectedCode {
  readonly word: string;
  readonly number: number;
  readonly gesture: string;
}

export interface ReviewDetail {
  readonly weighinId: string;
  readonly userId: string;
  readonly userName: string | null;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  /** Peso da captura inicial (baseline/T0) da mesma aposta — base p/ tendência/plausibilidade. */
  readonly previousWeightKg: number | null;
  /** Semanas decorridas entre a baseline e esta captura (plausibilidade da perda). */
  readonly weeks: number | null;
  readonly lossPerWeekKg: number | null;
  readonly status: WeighInStatus;
  readonly capturedAt: string;
  readonly videoUrl: string;
  /** Vídeos das 3 capturas (T0/T1/T2) da aposta, p/ comparação de identidade. */
  readonly comparison: { baseline: string | null; mid: string | null; final: string | null };
  /** Código dinâmico esperado (anti-replay) — null se a pesagem não tem desafio. */
  readonly expectedCode: ExpectedCode | null;
  /** Veredito já registrado (null se ainda não decidida). */
  readonly verdict: Verdict | null;
  readonly reason: string | null;
  readonly failedChecks: string[] | null;
  /** Resultado tristate item a item já registrado (Fase 2). */
  readonly checklist: Checklist | null;
  /**
   * FATOS de aplicabilidade (substitui o N/A). Calculados no servidor a partir
   * das capturas REAIS (não da nulidade de URL) — o client mapeia o
   * `appliesWhen` de cada critério para um destes flags e filtra o checklist.
   */
  readonly context: {
    readonly hasComparison: boolean;
    readonly hasPreviousWeight: boolean;
  };
}

/**
 * GetReviewDetailUseCase — detalhe de UMA pesagem para o console de revisão
 * (deep-link/refresh da sessão). Junta a pesagem + URL do vídeo + o código
 * dinâmico esperado (checagem anti-replay) + o veredito existente.
 */
@Injectable()
export class GetReviewDetailUseCase {
  constructor(
    @Inject(WEIGHIN_REPOSITORY) private readonly weighins: WeighInRepositoryPort,
    @Inject(REVIEW_REPOSITORY) private readonly reviews: ReviewRepositoryPort,
    @Inject(CHALLENGE_REPOSITORY) private readonly challenges: ChallengeRepositoryPort,
    @Inject(USER_REPOSITORY) private readonly users: UserRepositoryPort,
    @Inject(STORAGE) private readonly storage: StoragePort,
  ) {}

  async execute(weighinId: string): Promise<ReviewDetail> {
    const weighin = await this.weighins.findById(weighinId);
    if (!weighin) {
      throw new NotFoundError("Pesagem não encontrada.", { weighinId });
    }
    const w = weighin.toJSON();

    const presigned = await this.storage.presignDownload({ key: w.videoObjectKey });
    const user = await this.users.findById(w.userId);

    let expectedCode: ExpectedCode | null = null;
    if (w.challengeId) {
      const challenge = await this.challenges.findById(w.challengeId);
      if (challenge) {
        const c = challenge.toJSON();
        expectedCode = { word: c.word, number: c.number, gesture: c.gesture };
      }
    }

    // Comparação de identidade: vídeos das 3 capturas (T0/T1/T2) da aposta.
    const comparison: { baseline: string | null; mid: string | null; final: string | null } = {
      baseline: null,
      mid: null,
      final: null,
    };
    // Plausibilidade: peso da baseline e semanas decorridas até esta captura.
    let previousWeightKg: number | null = null;
    let weeks: number | null = null;
    // Nº de capturas REAIS da aposta (linhas, não URLs) → base do has_comparison.
    let captureCount = 1;
    if (w.betId) {
      const captures = (await this.weighins.listByBet(w.betId)).map((c) => c.toJSON());
      captureCount = captures.length;
      const urls = await Promise.all(
        captures.map(async (cp) => ({
          kind: cp.kind,
          url: (await this.storage.presignDownload({ key: cp.videoObjectKey })).url,
        })),
      );
      // listByBet vem em ordem asc → a captura mais recente de cada tipo sobrescreve.
      for (const { kind, url } of urls) {
        comparison[kind] = url;
      }

      const baseline = captures.find((c) => c.kind === "baseline");
      if (baseline && baseline.id !== w.id) {
        previousWeightKg = baseline.weightKg;
        const ms = w.capturedAt.getTime() - baseline.capturedAt.getTime();
        weeks = ms > 0 ? Math.round((ms / (7 * 24 * 60 * 60 * 1000)) * 10) / 10 : 0;
      }
    } else {
      comparison[w.kind] = presigned.url;
    }

    const review = await this.reviews.findByWeighin(weighinId);
    const r = review?.toJSON();

    return {
      weighinId: w.id,
      userId: w.userId,
      userName: user?.name ?? null,
      kind: w.kind,
      weightKg: w.weightKg,
      previousWeightKg,
      weeks,
      lossPerWeekKg: w.lossPerWeekKg ?? null,
      status: w.status,
      capturedAt: w.capturedAt.toISOString(),
      videoUrl: presigned.url,
      comparison,
      expectedCode,
      verdict: r?.verdict ?? null,
      reason: r?.reason ?? null,
      failedChecks: r?.failedChecks ?? null,
      checklist: r?.checklist ?? null,
      context: {
        hasComparison: captureCount >= 2,
        hasPreviousWeight: previousWeightKg != null,
      },
    };
  }
}
