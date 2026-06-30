/**
 * Entidade de domínio Review — veredito da revisão humana.
 *
 * Doc de Validação §5/§7: o revisor aplica o checklist (V1–V11) e decide:
 * APROVADO / PENDENTE / REPROVADO. Grava motivo + quais itens falharam
 * (dataset da Fase 2, §9).
 */
export type Verdict = "approved" | "pending" | "rejected";

/**
 * Conjunto SEMENTE de critérios (doc de Validação §5). Antes era a fonte fixa do
 * checklist; hoje os critérios são CONFIGURÁVEIS (tabela `approval_criteria`),
 * então esta tupla serve só de referência/seed. As keys do checklist e do
 * `failedChecks` são agora `string` (slug do critério), não mais este enum.
 */
export const CHECKLIST_FLAGS = [
  "freshness", // frescor / anti-replay (código + gesto)
  "continuous_video", // take único, sem corte
  "scale_zero", // balança zerada (âncora do instrumento)
  "floor_scene", // piso/cena plano e nivelado
  "no_body_trick", // sobe sem apoio, mãos visíveis
  "display_integrity", // visor íntegro, sem sobreposição
  "same_person", // mesma pessoa entre T0/T1/T2
  "plausibility", // perda faz sentido fisiológico
] as const;

export type ChecklistFlag = (typeof CHECKLIST_FLAGS)[number];

/** Resultado tristate de um item do checklist (dataset granular da Fase 2). */
export type ChecklistResult = "ok" | "fail" | "na";

/**
 * Mapa critério→resultado tristate (§9). A chave é o slug do critério
 * (configurável), por isso `string` e não mais o enum `ChecklistFlag`.
 */
export type Checklist = Record<string, ChecklistResult>;

export interface ReviewProps {
  readonly id: string;
  readonly weighinId: string;
  readonly reviewerId?: string | null;
  readonly verdict?: Verdict | null;
  readonly reason?: string | null;
  /** Slugs dos critérios que falharam (dataset Fase 2). */
  readonly failedChecks?: string[] | null;
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
    failedChecks?: string[] | null;
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
