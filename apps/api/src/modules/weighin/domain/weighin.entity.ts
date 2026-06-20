/**
 * Entidade de domínio WeighIn — pura, sem Nest, testável isoladamente.
 *
 * Representa uma pesagem capturada (T0/T1/T2, doc de Validação §3) e o seu
 * estado no fluxo manual-first. As transições de estado refletem §5/§7 do doc.
 *
 * `WeighInStatus` vem de `@charya/schemas` (fonte única da verdade) — não
 * redeclaramos os literais aqui para não divergir do contrato compartilhado.
 */
import type { WeighInStatus } from "@charya/schemas";

export type { WeighInStatus };

export type WeighInKind = "baseline" | "mid" | "final";

export interface WeighInProps {
  readonly id: string;
  readonly userId: string;
  readonly betId?: string | null;
  readonly challengeId?: string | null;
  readonly kind: WeighInKind;
  readonly weightKg: number;
  readonly videoObjectKey: string;
  readonly status: WeighInStatus;
  readonly lossPerWeekKg?: number | null;
  readonly capturedAt: Date;
}

export class WeighIn {
  private constructor(private props: WeighInProps) {}

  static create(props: WeighInProps): WeighIn {
    return new WeighIn(props);
  }

  get id(): string {
    return this.props.id;
  }
  get userId(): string {
    return this.props.userId;
  }
  get kind(): WeighInKind {
    return this.props.kind;
  }
  get weightKg(): number {
    return this.props.weightKg;
  }
  get status(): WeighInStatus {
    return this.props.status;
  }
  get lossPerWeekKg(): number | null | undefined {
    return this.props.lossPerWeekKg;
  }

  /** Marca como bloqueada pela regra dura de sanidade (§6). */
  block(lossPerWeekKg: number): void {
    this.props = { ...this.props, status: "blocked", lossPerWeekKg };
  }

  /** Move para a fila de revisão humana (§5). */
  enqueueForReview(lossPerWeekKg: number | null): void {
    this.props = { ...this.props, status: "in_review", lossPerWeekKg };
  }

  /** Aplica o veredito do revisor (§7). */
  applyVerdict(verdict: "approved" | "pending" | "rejected"): void {
    const next: WeighInStatus =
      verdict === "approved" ? "approved" : verdict === "rejected" ? "rejected" : "recapture";
    this.props = { ...this.props, status: next };
  }

  toJSON(): WeighInProps {
    return { ...this.props };
  }
}
