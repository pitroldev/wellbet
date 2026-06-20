import {
  type CanActivate,
  type ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
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

/**
 * Guard base de autenticação.
 *
 * A resolução real da sessão acontece no handler do Better Auth (montado em
 * `infra/auth`), que popula `req.user`. Este guard apenas exige que exista uma
 * sessão válida — guards específicos (ex.: papel de revisor) estendem a base.
 */
@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    if (!req.user) {
      throw new UnauthorizedException("Sessão ausente ou inválida.");
    }
    return true;
  }
}
