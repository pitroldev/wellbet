/**
 * Port do repositório de critérios de aprovação (camada application).
 *
 * Critérios são GLOBAIS e configuráveis pelo console (criar/editar/habilitar).
 * A `key` é o slug estável usado no checklist da revisão (dataset Fase 2).
 */
export interface Criterion {
  readonly id: string;
  readonly key: string;
  readonly label: string;
  readonly description: string | null;
  readonly failHint: string | null;
  readonly enabled: boolean;
  readonly sortOrder: number;
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
}

/** Campos editáveis. A `key` é imutável (referenciada no histórico/dataset). */
export interface UpdateCriterionInput {
  readonly label?: string;
  readonly description?: string | null;
  readonly failHint?: string | null;
  readonly enabled?: boolean;
  readonly sortOrder?: number;
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
