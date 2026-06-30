import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import { ENV, type Env } from "@/config/config.module.js";
import { AUTH, type Auth } from "@/infra/auth/auth.js";
import {
  ADMIN_USER_REPOSITORY,
  type AdminUserRepositoryPort,
} from "./admin-user.repository.port.js";

/**
 * Dispara o link de redefinição de senha (Better Auth `forgetPassword`) para o
 * e-mail da conta. Em dev o link é logado pelo authLogger; em prod só vai por
 * e-mail (o suporte NUNCA vê nem define a senha). Idempotente.
 */
@Injectable()
export class ResetUserPasswordUseCase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY) private readonly repo: AdminUserRepositoryPort,
    @Inject(AUTH) private readonly auth: Auth,
    @Inject(ENV) private readonly env: Env,
  ) {}

  async execute(authUserId: string): Promise<void> {
    const target = await this.repo.findAuthUser(authUserId);
    if (!target) throw new NotFoundException("Usuário não encontrado.");
    await this.auth.api.requestPasswordReset({
      body: {
        email: target.email,
        redirectTo: `${this.env.BETTER_AUTH_URL}/reset-password`,
      },
    });
  }
}
