/**
 * Entidade de domínio Bet — aposta no desafio de peso, com settlement.
 *
 * A liquidação (settlement) é a operação financeira sensível: exige
 * idempotência (§2 do doc). A regra de ganho/perda é pura e testável aqui.
 */
export type BetStatus = "open" | "settling" | "won" | "lost" | "voided";

export interface BetProps {
  readonly id: string;
  readonly userId: string;
  readonly startWeightKg?: number | null;
  readonly targetWeightKg: number;
  readonly stakeAmount: string; // numeric (decimal) como string p/ precisão
  readonly currency: string;
  readonly status: BetStatus;
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
  get status(): BetStatus {
    return this.props.status;
  }

  isSettleable(): boolean {
    return this.props.status === "open" || this.props.status === "settling";
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

  /** Marca início do settlement (lock lógico de estado). */
  beginSettlement(): void {
    this.props = { ...this.props, status: "settling" };
  }

  toJSON(): BetProps {
    return { ...this.props };
  }
}
