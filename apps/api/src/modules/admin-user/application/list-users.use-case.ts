import { Inject, Injectable } from "@nestjs/common";

import {
  ADMIN_USER_REPOSITORY,
  type AdminUserRepositoryPort,
  type AdminUserRow,
  type ListUsersOpts,
} from "./admin-user.repository.port.js";

/** Lista/busca usuários (suporte) — paginada, com contagens de bets/weighins. */
@Injectable()
export class ListUsersUseCase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY) private readonly repo: AdminUserRepositoryPort,
  ) {}

  execute(opts: ListUsersOpts): Promise<{ items: AdminUserRow[]; total: number }> {
    return this.repo.list(opts);
  }
}
