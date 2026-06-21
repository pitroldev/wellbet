/**
 * Entidade de domínio Review — veredito da revisão humana.
 *
 * Doc de Validação §5/§7: o revisor aplica o checklist (V1–V11) e decide:
 * APROVADO / PENDENTE / REPROVADO. Grava motivo + quais itens falharam
 * (dataset da Fase 2, §9).
 */
export type Verdict = "approved" | "pending" | "rejected";

/** Itens do checklist do revisor (doc de Validação §5). */
export type ChecklistFlag =
  | "freshness" // frescor / anti-replay (código + gesto)
  | "continuous_video" // take único, sem corte
  | "scale_zero" // balança zerada (âncora do instrumento)
  | "floor_scene" // piso/cena plano e nivelado
  | "no_body_trick" // sobe sem apoio, mãos visíveis
  | "display_integrity" // visor íntegro, sem sobreposição
  | "same_person" // mesma pessoa entre T0/T1/T2
  | "plausibility"; // perda faz sentido fisiológico

export const CHECKLIST_FLAGS: readonly ChecklistFlag[] = [
  "freshness",
  "continuous_video",
  "scale_zero",
  "floor_scene",
  "no_body_trick",
  "display_integrity",
  "same_person",
  "plausibility",
];

/** Resultado tristate de um item do checklist (dataset granular da Fase 2). */
export type ChecklistResult = "ok" | "fail" | "na";

/** Mapa item→resultado tristate (§9): rótulos granulares por item. */
export type Checklist = Partial<Record<ChecklistFlag, ChecklistResult>>;

export interface ReviewProps {
  readonly id: string;
  readonly weighinId: string;
  readonly reviewerId?: string | null;
  readonly verdict?: Verdict | null;
  readonly reason?: string | null;
  readonly failedChecks?: ChecklistFlag[] | null;
  /** Resultado item a item (ok/fail/na) — dataset granular da Fase 2. */
  readonly checklist?: Checklist | null;
  readonly decidedAt?: Date | null;
}

export class Review {
  private constructor(private props: ReviewProps) {}

  static create(props: ReviewProps): Review {
    return new Review(props);
  }

  get id(): string {
    return this.props.id;
  }
  get weighinId(): string {
    return this.props.weighinId;
  }
  get verdict(): Verdict | null | undefined {
    return this.props.verdict;
  }

  isDecided(): boolean {
    return this.props.verdict != null && this.props.decidedAt != null;
  }

  /**
   * Aplica o veredito do revisor. Política do doc (§7): "na dúvida, PENDENTE".
   * Reprovar/aprovar exige motivo; flags registram o que falhou (Fase 2).
   */
  decide(args: {
    reviewerId: string;
    verdict: Verdict;
    reason?: string | null;
    failedChecks?: ChecklistFlag[] | null;
    checklist?: Checklist | null;
    now?: Date;
  }): void {
    this.props = {
      ...this.props,
      reviewerId: args.reviewerId,
      verdict: args.verdict,
      reason: args.reason ?? null,
      failedChecks: args.failedChecks ?? null,
      checklist: args.checklist ?? null,
      decidedAt: args.now ?? new Date(),
    };
  }

  toJSON(): ReviewProps {
    return { ...this.props };
  }
}
