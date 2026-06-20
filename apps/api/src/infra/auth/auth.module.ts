import { Global, Inject, type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { toNodeHandler } from "better-auth/node";
import type { Request, Response } from "express";

import { ENV, type Env } from "../../config/config.module.js";
import { DATABASE, type DbHandle } from "../db/client.js";
import { AUTH, type Auth, buildAuth } from "./auth.js";

/**
 * Módulo de auth (infra).
 *
 * Provê a instância do Better Auth e monta seu handler nas rotas `/api/auth/*`
 * como middleware Express. O handler resolve a sessão; um middleware leve
 * (TODO) anexa `req.user` a partir da sessão para os guards.
 */
@Global()
@Module({
  providers: [
    {
      provide: AUTH,
      useFactory: (env: Env, handle: DbHandle): Auth =>
        buildAuth({
          db: handle.db,
          secret: env.BETTER_AUTH_SECRET,
          baseUrl: env.BETTER_AUTH_URL,
        }),
      inject: [ENV, DATABASE],
    },
  ],
  exports: [AUTH],
})
export class AuthModule implements NestModule {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  configure(consumer: MiddlewareConsumer): void {
    // Better Auth expõe seu próprio router; montado sob /api/auth/*.
    const handler = toNodeHandler(this.auth);
    consumer.apply((req: Request, res: Response) => handler(req, res)).forRoutes("/api/auth/*path");

    // TODO: middleware que lê a sessão (this.auth.api.getSession) e popula
    // req.user { id, email, role } para os guards (AuthGuard/RolesGuard).
  }
}
