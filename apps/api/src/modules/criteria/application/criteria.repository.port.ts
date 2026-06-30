/**
 * Port do repositório de critérios de aprovação (camada application).
 *
 * Critérios são GLOBAIS e configuráveis pelo console (criar/editar/habilitar).
 * A `key` é o slug estável usado no checklist da revisão (dataset Fase 2).
 */
/**
 * Condição de aplicabilidade do critério (substitui o N/A). O critério só
 * aparece no checklist quando a condição vale; `always` = sempre.
 */
export type AppliesWhen = "always" | "has_comparison" | "has_previous_weight";

export interface Criterion {
  readonly id: string;
  readonly key: string;
  readonly label: string;
  readonly description: string | null;
  readonly failHint: string | null;
  readonly enabled: boolean;
  readonly sortOrder: number;
  readonly appliesWhen: AppliesWhen;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface CreateCriterionInput {
  readonly key: string;
  readonly label: string;
  readonly description?: string | null;
  readonly failHint?: string | null;
  readonly enabled?: boolean;
  readonly sortOrder?: number;
  readonly appliesWhen?: AppliesWhen;
}

/** Campos editáveis. A `key` é imutável (referenciada no histórico/dataset). */
export interface UpdateCriterionInput {
  readonly label?: string;
  readonly description?: string | null;
  readonly failHint?: string | null;
  readonly enabled?: boolean;
  readonly sortOrder?: number;
  readonly appliesWhen?: AppliesWhen;
}

export interface CriteriaRepositoryPort {
  /** Lista ordenada por `sortOrder` (depois `label`). `enabledOnly` filtra os ativos. */
  list(opts?: { enabledOnly?: boolean }): Promise<Criterion[]>;

  findById(id: string): Promise<Criterion | undefined>;

  findByKey(key: string): Promise<Criterion | undefined>;

  create(input: CreateCriterionInput): Promise<Criterion>;

  /** Atualiza parcialmente; retorna `undefined` se o id não existir. */
  update(id: string, patch: UpdateCriterionInput): Promise<Criterion | undefined>;
}

export const CRITERIA_REPOSITORY = Symbol("CRITERIA_REPOSITORY");
