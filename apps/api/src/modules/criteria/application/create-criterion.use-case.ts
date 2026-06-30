import { ConflictException, Inject, Injectable } from "@nestjs/common";

import {
  type CreateCriterionInput,
  type CriteriaRepositoryPort,
  CRITERIA_REPOSITORY,
  type Criterion,
} from "./criteria.repository.port.js";

/** Cria um critério. A `key` deve ser única (slug estável do dataset). */
@Injectable()
export class CreateCriterionUseCase {
  constructor(@Inject(CRITERIA_REPOSITORY) private readonly repo: CriteriaRepositoryPort) {}

  async execute(input: CreateCriterionInput): Promise<Criterion> {
    const existing = await this.repo.findByKey(input.key);
    if (existing) {
      throw new ConflictException(`Já existe um critério com a key "${input.key}".`);
    }
    return this.repo.create(input);
  }
}
