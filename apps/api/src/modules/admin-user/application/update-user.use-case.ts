import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import { GetOrCreateUserUseCase } from "@/modules/identity/application/get-or-create-user.use-case.js";
import {
  ADMIN_USER_REPOSITORY,
  type AdminUserRepositoryPort,
  type Role,
} from "./admin-user.repository.port.js";

export interface UpdateUserInput {
  /** Quem está executando (req.user.id) — para barrar auto-rebaixamento. */
  actorId: string;
  authUserId: string;
  name?: string;
  role?: Role;
  emailVerified?: boolean;
  taxId?: string | null;
  pixKey?: string | null;
}

/**
 * Edita um usuário roteando cada campo para a tabela certa:
 *  - name        → auth `user` (+ espelho domínio se houver linha)
 *  - role        → auth `user` (autoritativo) + espelho domínio
 *  - emailVerified → auth `user`
 *  - taxId/pixKey  → domínio `users` (upsert via get-or-create se a conta nunca
 *    abriu o app)
 *
 * Guardas: não rebaixar a si mesmo nem o último admin (evita lockout do console).
 */
@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY) private readonly repo: AdminUserRepositoryPort,
    private readonly getOrCreate: GetOrCreateUserUseCase,
  ) {}

  async execute(input: UpdateUserInput): Promise<void> {
    const target = await this.repo.findAuthUser(input.authUserId);
    if (!target) throw new NotFoundException("Usuário não encontrado.");

    if (input.role !== undefined && input.role !== target.role) {
      if (input.authUserId === input.actorId && input.role !== "admin") {
        throw new BadRequestException("Você não pode rebaixar o seu próprio papel.");
      }
      if (target.role === "admin" && input.role !== "admin") {
        const admins = await this.repo.countAdmins();
        if (admins <= 1) throw new BadRequestException("Não dá para rebaixar o último admin.");
      }
    }

    const authPatch: { name?: string; role?: Role; emailVerified?: boolean } = {};
    if (input.name !== undefined) authPatch.name = input.name;
    if (input.role !== undefined) authPatch.role = input.role;
    if (input.emailVerified !== undefined) authPatch.emailVerified = input.emailVerified;
    if (Object.keys(authPatch).length > 0) {
      await this.repo.updateAuthUser(input.authUserId, authPatch);
    }

    const touchesDomain =
      input.name !== undefined ||
      input.role !== undefined ||
      input.taxId !== undefined ||
      input.pixKey !== undefined;
    if (touchesDomain) {
      // Garante a linha de domínio (taxId/pixKey precisam dela mesmo sem 1º /me).
      await this.getOrCreate.execute({ authUserId: input.authUserId, email: target.email });
      const domainPatch: { name?: string; role?: Role; taxId?: string | null; pixKey?: string | null } =
        {};
      if (input.name !== undefined) domainPatch.name = input.name;
      if (input.role !== undefined) domainPatch.role = input.role;
      if (input.taxId !== undefined) domainPatch.taxId = input.taxId;
      if (input.pixKey !== undefined) domainPatch.pixKey = input.pixKey;
      await this.repo.updateDomainByAuthUserId(input.authUserId, domainPatch);
    }
  }
}
