import { Module } from "@nestjs/common";

import { GetOrCreateUserUseCase } from "./application/get-or-create-user.use-case.js";
import { USER_REPOSITORY } from "./application/user.repository.port.js";
import { DrizzleUserRepository } from "./infra/drizzle-user.repository.js";
import { IdentityController } from "./http/identity.controller.js";

/**
 * Módulo identity — usuário + integração com o Better Auth (infra/auth).
 */
@Module({
  controllers: [IdentityController],
  providers: [
    GetOrCreateUserUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [GetOrCreateUserUseCase, USER_REPOSITORY],
})
export class IdentityModule {}
