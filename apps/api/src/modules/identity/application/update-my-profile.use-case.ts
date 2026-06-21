import { Inject, Injectable } from "@nestjs/common";

import type { User } from "../domain/user.entity.js";
import { GetOrCreateUserUseCase } from "./get-or-create-user.use-case.js";
import { USER_REPOSITORY, type UserRepositoryPort } from "./user.repository.port.js";

export interface UpdateMyProfileCommand {
  readonly authUserId: string;
  readonly email: string;
  readonly taxId: string;
  readonly pixKey: string;
}

/**
 * UpdateMyProfileUseCase — grava CPF/CNPJ + chave Pix do usuário autenticado.
 *
 * Pré-requisito do fluxo de aposta: o `place-bet` exige `taxId` (cobrança) e o
 * payout exige `pixKey`. Resolve (ou cria) o registro de domínio a partir da
 * sessão do Better Auth antes de gravar.
 */
@Injectable()
export class UpdateMyProfileUseCase {
  constructor(
    private readonly getOrCreate: GetOrCreateUserUseCase,
    @Inject(USER_REPOSITORY) private readonly repo: UserRepositoryPort,
  ) {}

  async execute(cmd: UpdateMyProfileCommand): Promise<User> {
    const user = await this.getOrCreate.execute({
      authUserId: cmd.authUserId,
      email: cmd.email,
    });
    user.setPaymentProfile(cmd.taxId, cmd.pixKey);
    await this.repo.save(user);
    return user;
  }
}
