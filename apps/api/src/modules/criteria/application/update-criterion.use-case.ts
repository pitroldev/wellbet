import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  type CriteriaRepositoryPort,
  CRITERIA_REPOSITORY,
  type Criterion,
  type UpdateCriterionInput,
} from "./criteria.repository.port.js";

/**
 * Atualiza um critério (label/ajuda/ordem) ou habilita/desabilita.
 * A `key` é imutável — não entra no patch.
 */
@Injectable()
export class UpdateCriterionUseCase {
  constructor(@Inject(CRITERIA_REPOSITORY) private readonly repo: CriteriaRepositoryPort) {}

  async execute(id: string, patch: UpdateCriterionInput): Promise<Criterion> {
    const updated = await this.repo.update(id, patch);
    if (!updated) {
      throw new NotFoundException(`Critério ${id} não encontrado.`);
    }
    return updated;
  }
}
