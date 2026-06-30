import { Module } from "@nestjs/common";

import { IdentityModule } from "@/modules/identity/identity.module.js";
import { ADMIN_USER_REPOSITORY } from "./application/admin-user.repository.port.js";
import { BanUserUseCase } from "./application/ban-user.use-case.js";
import { GetUserDetailUseCase } from "./application/get-user-detail.use-case.js";
import { ListUsersUseCase } from "./application/list-users.use-case.js";
import { ResetUserPasswordUseCase } from "./application/reset-user-password.use-case.js";
import { UpdateUserUseCase } from "./application/update-user.use-case.js";
import { DrizzleAdminUserRepository } from "./infra/drizzle-admin-user.repository.js";
import { AdminUserController } from "./http/admin-user.controller.js";

/**
 * Módulo de gestão de usuários (console de suporte/admin). Importa o
 * IdentityModule pelo GetOrCreateUserUseCase (upsert do perfil de domínio);
 * AUTH (Better Auth) e ENV são globais.
 */
@Module({
  imports: [IdentityModule],
  controllers: [AdminUserController],
  providers: [
    ListUsersUseCase,
    GetUserDetailUseCase,
    UpdateUserUseCase,
    ResetUserPasswordUseCase,
    BanUserUseCase,
    { provide: ADMIN_USER_REPOSITORY, useClass: DrizzleAdminUserRepository },
  ],
})
export class AdminUserModule {}
