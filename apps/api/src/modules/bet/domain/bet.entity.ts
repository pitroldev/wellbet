/**
 * Entidade de domínio Bet — aposta no desafio de peso, com pagamento (Pix) e
 * settlement.
 *
 * Ciclo de vida:
 *   pending_payment (aguarda o stake) → open (stake pago) → settling → won/lost
 *   pending_payment → voided (cobrança expirou sem pagamento)
 *
 * A liquidação (settlement) é a operação financeira sensível: exige idempotência
 * (§2 do doc). As regras de transição são puras e testáveis aqui.
 */
export type BetStatus = "pending_payment" | "open" | "settling" | "won" | "lost" | "voided";

export interface BetProps {
  readonly id: string;
  readonly userId: string;
  readonly startWeightKg?: number | null;
  readonly targetWeightKg: number;
  /** numeric (decimal) como string p/ precisão. */
  readonly stakeAmount: string;
  /** Valor a pagar ao vencedor (MVP: = stake). */
  readonly payoutAmount?: string | null;
  readonly currency: string;
  readonly status: BetStatus;
  /** Pix: cobrança do stake (Invoice) e transferência de payout. */
  readonly stakeChargeId?: string | null;
  readonly payoutTransferId?: string | null;
  readonly settledAt?: Date | null;
}

export class Bet {
  private constructor(private props: BetProps) {}

  static create(props: BetProps): Bet {
    return new Bet(props);
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get status(): BetStatus {
    return this.props.status;
  }
  get stakeAmount(): string {
    return this.props.stakeAmount;
  }
  get payoutAmount(): string | null {
    return this.props.payoutAmount ?? null;
  }
  get currency(): string {
    return this.props.currency;
  }
  get stakeChargeId(): string | null {
    return this.props.stakeChargeId ?? null;
  }

  /** Vincula a cobrança Pix do stake (no place-bet). */
  attachStakeCharge(chargeId: string): void {
    this.props = { ...this.props, stakeChargeId: chargeId };
  }

  /**
   * Stake confirmado (webhook `charge.paid`): pending_payment → open.
   * No-op idempotente se a aposta já estiver ativa/liquidada.
   */
  markStakePaid(): void {
    if (this.props.status === "pending_payment") {
      this.props = { ...this.props, status: "open" };
    }
  }

  /** Cancela a aposta não paga (ex.: cobrança expirou). No-op se já ativa. */
  voidUnpaid(): void {
    if (this.props.status === "pending_payment") {
      this.props = { ...this.props, status: "voided" };
    }
  }

  /** Só liquida apostas ativas/liquidando (stake já pago). */
  isSettleable(): boolean {
    return this.props.status === "open" || this.props.status === "settling";
  }

  /** Marca início do settlement (lock lógico de estado). */
  beginSettlement(): void {
    this.props = { ...this.props, status: "settling" };
  }

  /**
   * Decide o resultado a partir do peso final APROVADO pela revisão.
   * Meta batida (peso final <= alvo) → `won`; senão `lost`.
   */
  settleWith(finalWeightKg: number, now: Date = new Date()): BetStatus {
    const won = finalWeightKg <= this.props.targetWeightKg;
    const status: BetStatus = won ? "won" : "lost";
    this.props = { ...this.props, status, settledAt: now };
    return status;
  }

  /** Registra a transferência de payout (no settle, em caso de vitória). */
  recordPayout(transferId: string): void {
    this.props = { ...this.props, payoutTransferId: transferId };
  }

  toJSON(): BetProps {
    return { ...this.props };
  }
}
