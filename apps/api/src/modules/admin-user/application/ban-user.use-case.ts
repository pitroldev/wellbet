import { BadRequestException, Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  ADMIN_USER_REPOSITORY,
  type AdminUserRepositoryPort,
} from "./admin-user.repository.port.js";

export interface BanUserInput {
  /** Quem executa (req.user.id) — não pode banir a si mesmo. */
  actorId: string;
  authUserId: string;
  banned: boolean;
  reason?: string;
}

/**
 * Bane/desbane uma conta. Banir grava o motivo + REVOGA as sessões (efeito
 * imediato; o AuthGuard já rejeita 403 toda request de conta banida, e
 * sessões novas carregam `banned=true`). Guardas: não banir a si mesmo nem o
 * último admin (evita lockout do console).
 */
@Injectable()
export class BanUserUseCase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY) private readonly repo: AdminUserRepositoryPort,
  ) {}

  async execute(input: BanUserInput): Promise<void> {
    const target = await this.repo.findAuthUser(input.authUserId);
    if (!target) throw new NotFoundException("Usuário não encontrado.");

    if (input.banned) {
      if (input.authUserId === input.actorId) {
        throw new BadRequestException("Você não pode banir a si mesmo.");
      }
      if (target.role === "admin") {
        const admins = await this.repo.countAdmins();
        if (admins <= 1) throw new BadRequestException("Não dá para banir o último admin.");
      }
      await this.repo.setBan(input.authUserId, {
        banned: true,
        banReason: input.reason?.trim() || null,
        bannedAt: new Date(),
      });
      await this.repo.revokeSessions(input.authUserId);
    } else {
      await this.repo.setBan(input.authUserId, { banned: false, banReason: null, bannedAt: null });
    }
  }
}
