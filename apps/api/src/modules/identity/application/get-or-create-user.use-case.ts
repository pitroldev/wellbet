import { randomUUID } from "node:crypto";

import { Inject, Injectable } from "@nestjs/common";

import { User } from "../domain/user.entity.js";
import { USER_REPOSITORY, type UserRepositoryPort } from "./user.repository.port.js";

export interface GetOrCreateUserCommand {
  /** Id do usuário no Better Auth (sub da sessão). */
  readonly authUserId: string;
  readonly email: string;
  readonly name?: string | null;
}

/**
 * GetOrCreateUserUseCase — sincroniza o usuário do domínio com o Better Auth.
 *
 * Chamado no primeiro acesso autenticado: se ainda não há registro de domínio
 * para aquele `authUserId`, cria um com papel `user`. Promoção a `reviewer`/
 * `admin` é operação administrativa (fora do MVP-scaffold).
 */
@Injectable()
export class GetOrCreateUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private readonly repo: UserRepositoryPort) {}

  async execute(cmd: GetOrCreateUserCommand): Promise<User> {
    const existing = await this.repo.findByAuthUserId(cmd.authUserId);
    if (existing) return existing;

    const user = User.create({
      id: randomUUID(),
      email: cmd.email,
      name: cmd.name ?? null,
      role: "user",
      authUserId: cmd.authUserId,
    });
    await this.repo.save(user);
    return user;
  }
}
