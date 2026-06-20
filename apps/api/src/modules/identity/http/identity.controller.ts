import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "../../../shared/guards/auth.guard.js";
import { GetOrCreateUserUseCase } from "../application/get-or-create-user.use-case.js";
import { MeResponseDto } from "./identity.dto.js";

/**
 * Controller de identidade.
 *
 *  GET /me — perfil do usuário autenticado. Sincroniza (get-or-create) o
 *  registro de domínio com o Better Auth no primeiro acesso.
 */
@ApiTags("identity")
@Controller()
@UseGuards(AuthGuard)
export class IdentityController {
  constructor(private readonly getOrCreate: GetOrCreateUserUseCase) {}

  @Get("me")
  @ApiOperation({ summary: "Perfil do usuário autenticado." })
  async me(@Req() req: AuthenticatedRequest): Promise<MeResponseDto> {
    const session = req.user!;
    const user = await this.getOrCreate.execute({
      authUserId: session.id,
      email: session.email,
    });
    const p = user.toJSON();
    return {
      id: p.id,
      email: p.email,
      name: p.name ?? null,
      role: p.role,
    };
  }
}
