import { Inject, Injectable, NotFoundException } from "@nestjs/common";

import {
  ADMIN_USER_REPOSITORY,
  type AdminUserRepositoryPort,
  type UserDetailData,
} from "./admin-user.repository.port.js";

export interface UserSignals {
  newAccount: boolean;
  rejectionsCount: number;
  payoutPending: boolean;
  noFinancialProfile: boolean;
  emailUnverified: boolean;
  orphan: boolean;
}

export type PayoutVerdict =
  | "pago"
  | "a_liquidar"
  | "bloqueado_sem_pix"
  | "bloqueado_pesagem_final"
  | "sem_payout";

export interface UserDetailResult {
  data: UserDetailData;
  signals: UserSignals;
  payout: { verdict: PayoutVerdict; payoutTransferId: string | null };
}

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * 360 do usuário (suporte) num payload — identidade + perfil + bets + weighins,
 * com SINAIS de triagem e o VEREDITO de payout computados no servidor.
 */
@Injectable()
export class GetUserDetailUseCase {
  constructor(
    @Inject(ADMIN_USER_REPOSITORY) private readonly repo: AdminUserRepositoryPort,
  ) {}

  async execute(authUserId: string): Promise<UserDetailResult> {
    const data = await this.repo.detail(authUserId);
    if (!data) throw new NotFoundException("Usuário não encontrado.");
    return { data, signals: computeSignals(data), payout: computePayout(data) };
  }
}

function computeSignals(d: UserDetailData): UserSignals {
  const rejectionsCount = d.weighins.filter(
    (w) => w.status === "rejected" || w.status === "recapture" || w.verdict === "rejected",
  ).length;
  const payoutPending = d.bets.some(
    (b) => (b.status === "won" || b.status === "settling") && !b.payoutTransferId,
  );
  return {
    newAccount: Date.now() - d.identity.createdAt.getTime() < WEEK_MS,
    rejectionsCount,
    payoutPending,
    noFinancialProfile: !d.domain || !d.domain.taxId || !d.domain.pixKey,
    emailUnverified: !d.identity.emailVerified,
    orphan: !d.domain,
  };
}

function computePayout(
  d: UserDetailData,
): { verdict: PayoutVerdict; payoutTransferId: string | null } {
  const pixKey = d.domain?.pixKey ?? null;
  // bets vêm ordenadas desc por createdAt → find devolve a mais recente.
  const relevant = d.bets.find((b) => b.status === "won" || b.status === "settling");
  if (relevant) {
    if (relevant.status === "won" && relevant.payoutTransferId) {
      return { verdict: "pago", payoutTransferId: relevant.payoutTransferId };
    }
    if (!pixKey) return { verdict: "bloqueado_sem_pix", payoutTransferId: relevant.payoutTransferId };
    return { verdict: "a_liquidar", payoutTransferId: relevant.payoutTransferId };
  }
  const final = d.weighins.find((w) => w.kind === "final");
  if (final && (final.status === "rejected" || final.verdict === "rejected")) {
    return { verdict: "bloqueado_pesagem_final", payoutTransferId: null };
  }
  return { verdict: "sem_payout", payoutTransferId: null };
}
