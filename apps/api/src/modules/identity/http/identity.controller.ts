import { Body, Controller, Get, Put, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { GetOrCreateUserUseCase } from "@/modules/identity/application/get-or-create-user.use-case.js";
import { UpdateMyProfileUseCase } from "@/modules/identity/application/update-my-profile.use-case.js";
import type { User } from "@/modules/identity/domain/user.entity.js";
import { MeResponseDto, UpdateProfileDto } from "./identity.dto.js";

/**
 * Controller de identidade.
 *
 *  GET /me          — perfil do usuário autenticado (get-or-create no 1º acesso).
 *  PUT /me/profile  — define CPF/CNPJ + chave Pix (pré-requisito de apostar/sacar).
 */
@ApiTags("identity")
@Controller()
@UseGuards(AuthGuard)
export class IdentityController {
  constructor(
    private readonly getOrCreate: GetOrCreateUserUseCase,
    private readonly updateProfile: UpdateMyProfileUseCase,
  ) {}

  @Get("me")
  @ApiOperation({ summary: "Perfil do usuário autenticado." })
  async me(@Req() req: AuthenticatedRequest): Promise<MeResponseDto> {
    const session = req.user!;
    const user = await this.getOrCreate.execute({
      authUserId: session.id,
      email: session.email,
    });
    return toMeResponse(user);
  }

  @Put("me/profile")
  @ApiOperation({
    summary: "Define CPF/CNPJ e chave Pix (necessários para apostar e sacar).",
  })
  async setProfile(
    @Req() req: AuthenticatedRequest,
    @Body() dto: UpdateProfileDto,
  ): Promise<MeResponseDto> {
    const session = req.user!;
    const user = await this.updateProfile.execute({
      authUserId: session.id,
      email: session.email,
      taxId: dto.taxId,
      pixKey: dto.pixKey,
    });
    return toMeResponse(user);
  }
}

function toMeResponse(user: User): MeResponseDto {
  const p = user.toJSON();
  return {
    id: p.id,
    email: p.email,
    name: p.name ?? null,
    role: p.role,
    taxId: p.taxId ?? null,
    pixKey: p.pixKey ?? null,
  };
}
