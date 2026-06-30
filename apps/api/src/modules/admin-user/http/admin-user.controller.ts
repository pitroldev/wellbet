import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from "@nestjs/common";
import { ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";

import { AuthGuard, type AuthenticatedRequest } from "@/shared/guards/auth.guard.js";
import { Roles, RolesGuard } from "@/shared/guards/roles.guard.js";
import { BanUserUseCase } from "@/modules/admin-user/application/ban-user.use-case.js";
import { GetUserDetailUseCase, type UserDetailResult } from "@/modules/admin-user/application/get-user-detail.use-case.js";
import { ListUsersUseCase } from "@/modules/admin-user/application/list-users.use-case.js";
import { ResetUserPasswordUseCase } from "@/modules/admin-user/application/reset-user-password.use-case.js";
import { UpdateUserUseCase } from "@/modules/admin-user/application/update-user.use-case.js";
import type { AdminUserRow } from "@/modules/admin-user/application/admin-user.repository.port.js";
import {
  AdminUserRowDto,
  BanUserDto,
  ListUsersQueryDto,
  ListUsersResponseDto,
  ResetPasswordResponseDto,
  UpdateUserDto,
  UserDetailDto,
} from "./admin-user.dto.js";

/**
 * Gestão de usuários — console de SUPORTE/admin.
 *
 *  GET   /admin/users               — busca/lista (q, role, paginação).
 *  GET   /admin/users/:authUserId   — 360 (identidade + perfil + bets + weighins + sinais + payout).
 *  PATCH /admin/users/:authUserId   — edita name/role/emailVerified/taxId/pixKey.
 *  POST  /admin/users/:authUserId/reset-password — dispara reset de senha (Better Auth).
 *
 * Chave = `authUserId` (id do Better Auth) — a linha de domínio pode não existir.
 * Restrito ao staff (RolesGuard). TODO(prod): travar mutações (PATCH/reset e
 * sobretudo promoção a admin) em `@Roles("admin")` — hoje liberado a reviewer
 * por consistência com o resto do console interno.
 */
@ApiTags("admin-users")
@Controller("admin/users")
@UseGuards(AuthGuard, RolesGuard)
@Roles("admin", "reviewer")
export class AdminUserController {
  constructor(
    private readonly listUsers: ListUsersUseCase,
    private readonly getDetail: GetUserDetailUseCase,
    private readonly updateUser: UpdateUserUseCase,
    private readonly resetPwd: ResetUserPasswordUseCase,
    private readonly banUser: BanUserUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: "Busca/lista usuários (suporte)." })
  @ApiOkResponse({ type: ListUsersResponseDto })
  async list(@Query() query: ListUsersQueryDto): Promise<ListUsersResponseDto> {
    const { items, total } = await this.listUsers.execute({
      q: query.q,
      role: query.role,
      emailVerified: query.emailVerified,
      limit: query.limit,
      offset: query.offset,
    });
    return { items: items.map(toRowDto), total };
  }

  @Get(":authUserId")
  @ApiOperation({ summary: "360 do usuário (identidade + perfil + histórico + sinais + payout)." })
  @ApiOkResponse({ type: UserDetailDto })
  async detail(@Param("authUserId") authUserId: string): Promise<UserDetailDto> {
    return toUserDetailDto(await this.getDetail.execute(authUserId));
  }

  @Patch(":authUserId")
  @ApiOperation({ summary: "Edita name/role/emailVerified/taxId/pixKey." })
  @ApiOkResponse({ type: UserDetailDto })
  async update(
    @Req() req: AuthenticatedRequest,
    @Param("authUserId") authUserId: string,
    @Body() dto: UpdateUserDto,
  ): Promise<UserDetailDto> {
    await this.updateUser.execute({
      actorId: req.user!.id,
      authUserId,
      name: dto.name,
      role: dto.role,
      emailVerified: dto.emailVerified,
      taxId: dto.taxId,
      pixKey: dto.pixKey,
    });
    return toUserDetailDto(await this.getDetail.execute(authUserId));
  }

  @Post(":authUserId/reset-password")
  @ApiOperation({ summary: "Dispara o link de redefinição de senha (Better Auth)." })
  @ApiOkResponse({ type: ResetPasswordResponseDto })
  async resetPassword(
    @Param("authUserId") authUserId: string,
  ): Promise<ResetPasswordResponseDto> {
    await this.resetPwd.execute(authUserId);
    return { sent: true };
  }

  @Post(":authUserId/ban")
  @ApiOperation({ summary: "Bane a conta (revoga sessões; bloqueia todo acesso)." })
  @ApiOkResponse({ type: UserDetailDto })
  async ban(
    @Req() req: AuthenticatedRequest,
    @Param("authUserId") authUserId: string,
    @Body() dto: BanUserDto,
  ): Promise<UserDetailDto> {
    await this.banUser.execute({
      actorId: req.user!.id,
      authUserId,
      banned: true,
      reason: dto.reason,
    });
    return toUserDetailDto(await this.getDetail.execute(authUserId));
  }

  @Post(":authUserId/unban")
  @ApiOperation({ summary: "Remove o ban da conta." })
  @ApiOkResponse({ type: UserDetailDto })
  async unban(
    @Req() req: AuthenticatedRequest,
    @Param("authUserId") authUserId: string,
  ): Promise<UserDetailDto> {
    await this.banUser.execute({ actorId: req.user!.id, authUserId, banned: false });
    return toUserDetailDto(await this.getDetail.execute(authUserId));
  }
}

function toRowDto(r: AdminUserRow): AdminUserRowDto {
  return {
    authUserId: r.authUserId,
    email: r.email,
    name: r.name,
    role: r.role,
    emailVerified: r.emailVerified,
    banned: r.banned,
    createdAt: r.createdAt.toISOString(),
    domainUserId: r.domainUserId,
    hasTaxId: r.taxId != null && r.taxId.length > 0,
    hasPixKey: r.pixKey != null && r.pixKey.length > 0,
    betsCount: r.betsCount,
    weighinsCount: r.weighinsCount,
  };
}

function toUserDetailDto(r: UserDetailResult): UserDetailDto {
  const { data, signals, payout } = r;
  return {
    identity: {
      authUserId: data.identity.authUserId,
      email: data.identity.email,
      name: data.identity.name,
      emailVerified: data.identity.emailVerified,
      role: data.identity.role,
      image: data.identity.image,
      banned: data.identity.banned,
      banReason: data.identity.banReason,
      bannedAt: data.identity.bannedAt ? data.identity.bannedAt.toISOString() : null,
      createdAt: data.identity.createdAt.toISOString(),
      updatedAt: data.identity.updatedAt.toISOString(),
    },
    domain: data.domain
      ? {
          userId: data.domain.userId,
          name: data.domain.name,
          taxId: data.domain.taxId,
          pixKey: data.domain.pixKey,
          createdAt: data.domain.createdAt.toISOString(),
        }
      : null,
    signals,
    payout,
    bets: data.bets.map((b) => ({
      betId: b.betId,
      status: b.status,
      targetWeightKg: b.targetWeightKg,
      stakeAmount: b.stakeAmount,
      payoutAmount: b.payoutAmount,
      currency: b.currency,
      payoutTransferId: b.payoutTransferId,
      createdAt: b.createdAt.toISOString(),
      settledAt: b.settledAt ? b.settledAt.toISOString() : null,
    })),
    weighins: data.weighins.map((w) => ({
      id: w.id,
      kind: w.kind,
      status: w.status,
      weightKg: w.weightKg,
      lossPerWeekKg: w.lossPerWeekKg,
      capturedAt: w.capturedAt.toISOString(),
      verdict: w.verdict,
    })),
  };
}
