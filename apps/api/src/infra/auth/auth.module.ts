import { Global, Inject, type MiddlewareConsumer, Module, type NestModule } from "@nestjs/common";
import { fromNodeHeaders, toNodeHandler } from "better-auth/node";
import type { NextFunction, Request, Response } from "express";

import { ENV, type Env } from "@/config/config.module.js";
import type { AuthenticatedRequest, AuthenticatedUser } from "@/shared/guards/auth.guard.js";
import { DATABASE, type DbHandle } from "@/infra/db/client.js";
import { AUTH, type Auth, buildAuth } from "./auth.js";

/**
 * Módulo de auth (infra).
 *
 * Provê a instância do Better Auth e monta seu handler nas rotas `/api/auth/*`
 * como middleware Express. Um middleware leve resolve a sessão (Better Auth) e
 * anexa `req.user` { id, email, role } para os guards (AuthGuard/RolesGuard).
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
          adminOrigin: env.ADMIN_ORIGIN,
          isProduction: env.NODE_ENV === "production",
        }),
      inject: [ENV, DATABASE],
    },
  ],
  exports: [AUTH],
})
export class AuthModule implements NestModule {
  constructor(@Inject(AUTH) private readonly auth: Auth) {}

  configure(consumer: MiddlewareConsumer): void {
    // Better Auth expõe seu próprio router; servido sob /api/auth/*. O caminho
    // do forRoutes é RELATIVO ao global prefix ("api") — o Nest o prepõe aos
    // middlewares. Por isso "/auth/*path" (NÃO "/api/auth/...", que viraria
    // "/api/api/auth/..." e nunca casaria → 404 em sign-in/get-session).
    const handler = toNodeHandler(this.auth);
    consumer.apply((req: Request, res: Response) => handler(req, res)).forRoutes("/auth/*path");

    // Middleware de sessão: em TODA request resolve a sessão do Better Auth e
    // popula `req.user` (ou deixa `undefined`). Não bloqueia nada — quem
    // bloqueia são os guards (AuthGuard global + RolesGuard). Falhas de
    // resolução são tratadas como "sem sessão" (fail-closed nos guards).
    consumer.apply(this.attachSession).forRoutes("*");
  }

  /**
   * Lê a sessão via Better Auth e a normaliza em `req.user`. Arrow function
   * (bound) para preservar o `this` ao ser usado como middleware Express.
   */
  private readonly attachSession = async (
    req: AuthenticatedRequest,
    _res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const session = await this.auth.api.getSession({
        headers: fromNodeHeaders(req.headers),
      });
      req.user = session ? this.toAuthenticatedUser(session.user) : undefined;
    } catch {
      // Qualquer erro ao resolver a sessão → tratamos como não autenticado.
      // Não logamos o corpo/headers de auth aqui (PII/segredo); o pino-http já
      // redige authorization/cookie.
      req.user = undefined;
    }
    next();
  };

  /** Normaliza o usuário da sessão do Better Auth no shape dos guards. */
  private toAuthenticatedUser(user: {
    id: string;
    email: string;
    role?: AuthenticatedUser["role"] | null;
  }): AuthenticatedUser {
    return {
      id: user.id,
      email: user.email,
      // `role` é um additionalField com defaultValue "user"; o `?? 'user'`
      // cobre sessões antigas emitidas antes do campo existir.
      role: user.role ?? "user",
    };
  }
}
