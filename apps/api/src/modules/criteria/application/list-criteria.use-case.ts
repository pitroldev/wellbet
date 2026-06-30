import { Inject, Injectable } from "@nestjs/common";

import {
  type CriteriaRepositoryPort,
  CRITERIA_REPOSITORY,
  type Criterion,
} from "./criteria.repository.port.js";

/** Lista os critérios de aprovação (todos, ou só os habilitados). */
@Injectable()
export class ListCriteriaUseCase {
  constructor(@Inject(CRITERIA_REPOSITORY) private readonly repo: CriteriaRepositoryPort) {}

  execute(opts?: { enabledOnly?: boolean }): Promise<Criterion[]> {
    return this.repo.list(opts);
  }
}
