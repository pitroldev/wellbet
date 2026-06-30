/**
 * Port do repositório de gestão de usuários (console de suporte/admin).
 *
 * Lê a identidade canônica (`user` do Better Auth) com LEFT JOIN no perfil de
 * domínio (`users`: taxId/pixKey + FK de bets/weighins). Chave = `authUserId`.
 */
export type Role = "user" | "reviewer" | "admin";
export type BetStatus = "pending_payment" | "open" | "settling" | "won" | "lost" | "voided";
export type WeighinStatus =
  | "pending"
  | "blocked"
  | "in_review"
  | "approved"
  | "rejected"
  | "recapture";

export interface AdminUserRow {
  readonly authUserId: string;
  readonly email: string;
  readonly name: string | null;
  readonly role: Role;
  readonly emailVerified: boolean;
  readonly banned: boolean;
  readonly createdAt: Date;
  readonly domainUserId: string | null;
  readonly taxId: string | null;
  readonly pixKey: string | null;
  readonly betsCount: number;
  readonly weighinsCount: number;
}

export interface UserBet {
  readonly betId: string;
  readonly status: BetStatus;
  readonly targetWeightKg: number;
  readonly stakeAmount: string;
  readonly payoutAmount: string | null;
  readonly currency: string;
  readonly payoutTransferId: string | null;
  readonly createdAt: Date;
  readonly settledAt: Date | null;
}

export interface UserWeighin {
  readonly id: string;
  readonly kind: "baseline" | "mid" | "final";
  readonly status: WeighinStatus;
  readonly weightKg: number;
  readonly lossPerWeekKg: number | null;
  readonly capturedAt: Date;
  readonly verdict: "approved" | "pending" | "rejected" | null;
}

export interface UserDetailData {
  readonly identity: {
    readonly authUserId: string;
    readonly email: string;
    readonly name: string | null;
    readonly emailVerified: boolean;
    readonly role: Role;
    readonly image: string | null;
    readonly banned: boolean;
    readonly banReason: string | null;
    readonly bannedAt: Date | null;
    readonly createdAt: Date;
    readonly updatedAt: Date;
  };
  readonly domain: {
    readonly userId: string;
    readonly name: string | null;
    readonly taxId: string | null;
    readonly pixKey: string | null;
    readonly createdAt: Date;
  } | null;
  readonly bets: UserBet[];
  readonly weighins: UserWeighin[];
}

export interface ListUsersOpts {
  readonly q?: string;
  readonly role?: Role;
  readonly emailVerified?: boolean;
  readonly limit: number;
  readonly offset: number;
}

export interface AdminUserRepositoryPort {
  list(opts: ListUsersOpts): Promise<{ items: AdminUserRow[]; total: number }>;
  detail(authUserId: string): Promise<UserDetailData | undefined>;
  /** Identidade mínima p/ guards e reset (email vem daqui). */
  findAuthUser(authUserId: string): Promise<{ id: string; email: string; role: Role } | undefined>;
  countAdmins(): Promise<number>;
  updateAuthUser(
    authUserId: string,
    patch: { name?: string; role?: Role; emailVerified?: boolean },
  ): Promise<void>;
  /** Atualiza o perfil de domínio (se a linha existir). */
  updateDomainByAuthUserId(
    authUserId: string,
    patch: { name?: string; role?: Role; taxId?: string | null; pixKey?: string | null },
  ): Promise<void>;
  /** Liga/desliga o ban no auth `user`. */
  setBan(
    authUserId: string,
    patch: { banned: boolean; banReason: string | null; bannedAt: Date | null },
  ): Promise<void>;
  /** Revoga (deleta) todas as sessões do usuário — efeito imediato do ban. */
  revokeSessions(authUserId: string): Promise<void>;
}

export const ADMIN_USER_REPOSITORY = Symbol("ADMIN_USER_REPOSITORY");
