import {
  type CanActivate,
  type ExecutionContext,
  ForbiddenException,
  Injectable,
  SetMetadata,
  UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

import type { AuthenticatedRequest, AuthenticatedUser } from "./auth.guard.js";

export const ROLES_KEY = "charya:roles";

/** Decorator p/ exigir papéis num handler/controller. Ex.: `@Roles('reviewer')`. */
export const Roles = (...roles: AuthenticatedUser["role"][]) => SetMetadata(ROLES_KEY, roles);

/**
 * Guard de autorização por papel.
 *
 * Usado, por exemplo, no módulo de review: só `reviewer`/`admin` acessam a fila
 * de revisão e podem emitir veredito.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const required = this.reflector.getAllAndOverride<AuthenticatedUser["role"][] | undefined>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!required || required.length === 0) return true;

    const req = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const user = req.user;
    if (!user) throw new UnauthorizedException("Sessão ausente ou inválida.");

    if (!required.includes(user.role)) {
      throw new ForbiddenException("Papel insuficiente para esta ação.");
    }
    return true;
  }
}
