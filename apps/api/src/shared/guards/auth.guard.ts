import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import type { Request } from "express";

/** Sessão resolvida pelo Better Auth e anexada à request. */
export interface AuthenticatedUser {
  readonly id: string;
  readonly email: string;
  readonly role: "user" | "reviewer" | "admin";
}

export interface AuthenticatedRequest extends Request {
  user?: AuthenticatedUser;
}

/** Metadata key que marca um handler/controller como rota aberta. */
export const IS_PUBLIC_KEY = "charya:public";

/**
 * Marca uma rota como pública: o `AuthGuard` global a deixa passar sem sessão.
 * Use em rotas abertas (ex.: `/health`, handler do Better Auth em `/api/auth/*`).
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

/**
 * Guard base de autenticação.
 *
 * A resolução real da sessão acontece no middleware de auth (montado em
 * `infra/auth`), que popula `req.user`. Este guard apenas exige que exista uma
 * sessão válida — exceto em rotas marcadas com `@Public()`.
 *
 * Registrado como guard GLOBAL (APP_GUARD): por padrão TUDO exige auth
 * (fail-closed); rotas abertas optam por sair via `@Public()`.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean | undefined>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!req.user) {
      throw new UnauthorizedException("Sessão ausente ou inválida.");
    }
    return true;
  }
}
