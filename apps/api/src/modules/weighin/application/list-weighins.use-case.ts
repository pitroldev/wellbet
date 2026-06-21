import { Inject, Injectable } from "@nestjs/common";

import type { WeighInKind, WeighInStatus } from "@/modules/weighin/domain/weighin.entity.js";
import { WEIGHIN_REPOSITORY, type WeighInRepositoryPort } from "./weighin.repository.port.js";

export interface ListWeighInsCommand {
  readonly userId: string;
  readonly kind?: WeighInKind;
}

export interface WeighInSummary {
  readonly weighinId: string;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  readonly status: WeighInStatus;
  readonly lossPerWeekKg: number | null;
  readonly betId: string | null;
  readonly capturedAt: string;
}

/**
 * ListWeighInsUseCase — histórico de pesagens do usuário (mais recentes
 * primeiro). Expõe só o resumo de domínio + status; a `videoObjectKey` e o
 * `challengeId` (internos) NÃO vazam para o cliente.
 */
@Injectable()
export class ListWeighInsUseCase {
  constructor(@Inject(WEIGHIN_REPOSITORY) private readonly repo: WeighInRepositoryPort) {}

  async execute(cmd: ListWeighInsCommand): Promise<WeighInSummary[]> {
    const items = await this.repo.listByUser({ userId: cmd.userId, kind: cmd.kind });
    return items.map((weighin) => {
      const p = weighin.toJSON();
      return {
        weighinId: p.id,
        kind: p.kind,
        weightKg: p.weightKg,
        status: p.status,
        lossPerWeekKg: p.lossPerWeekKg ?? null,
        betId: p.betId ?? null,
        capturedAt: p.capturedAt.toISOString(),
      };
    });
  }
}
