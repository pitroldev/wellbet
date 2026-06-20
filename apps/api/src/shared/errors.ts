/**
 * Taxonomia de erros do domínio (union discriminada).
 *
 * Regra do doc (§2): "Nada de `throw new Error` solto." Todo erro de regra de
 * negócio carrega um `code` estável, uma `message` legível e `details`
 * opcionais. O `all-exceptions.filter` traduz isso para a resposta HTTP
 * `{ code, message, details }` consistente.
 */

/** Códigos de erro estáveis e versionáveis (contrato com o cliente). */
export const ErrorCode = {
  // Genéricos
  VALIDATION_FAILED: "VALIDATION_FAILED",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  CONFLICT: "CONFLICT",
  IDEMPOTENCY_KEY_REUSED: "IDEMPOTENCY_KEY_REUSED",
  INTERNAL: "INTERNAL",

  // Pesagem / plausibilidade (doc de Validação §6)
  WEIGHT_IMPLAUSIBLE: "WEIGHT_IMPLAUSIBLE",
  WEIGHIN_NOT_OPEN: "WEIGHIN_NOT_OPEN",

  // Desafio dinâmico (doc de Validação §4)
  CHALLENGE_EXPIRED: "CHALLENGE_EXPIRED",
  CHALLENGE_ALREADY_USED: "CHALLENGE_ALREADY_USED",
  CHALLENGE_INVALID: "CHALLENGE_INVALID",

  // Revisão (doc de Validação §5/§7)
  REVIEW_ALREADY_DECIDED: "REVIEW_ALREADY_DECIDED",

  // Aposta / settlement (§2: idempotência financeira)
  BET_NOT_SETTLEABLE: "BET_NOT_SETTLEABLE",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

/** Categoria semântica → mapeia para faixa de status HTTP no filtro. */
export type ErrorCategory =
  | "validation"
  | "not_found"
  | "unauthorized"
  | "forbidden"
  | "conflict"
  | "unprocessable"
  | "internal";

export interface DomainErrorShape {
  readonly category: ErrorCategory;
  readonly code: ErrorCode;
  readonly message: string;
  readonly details?: Readonly<Record<string, unknown>>;
}

/**
 * Erro de domínio base. Subclasses fixam `category`/`code`. Lançável de
 * qualquer camada (domain/application/infra) sem acoplar ao Nest.
 */
export class DomainError extends Error implements DomainErrorShape {
  readonly category: ErrorCategory;
  readonly code: ErrorCode;
  readonly details?: Readonly<Record<string, unknown>>;

  constructor(args: DomainErrorShape) {
    super(args.message);
    this.name = new.target.name;
    this.category = args.category;
    this.code = args.code;
    this.details = args.details;
  }

  toJSON(): { code: ErrorCode; message: string; details?: Record<string, unknown> } {
    return {
      code: this.code,
      message: this.message,
      ...(this.details ? { details: this.details } : {}),
    };
  }
}

/* ----------------------- Erros concretos por categoria ---------------------- */

export class ValidationError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({ category: "validation", code: ErrorCode.VALIDATION_FAILED, message, details });
  }
}

export class NotFoundError extends DomainError {
  constructor(message: string, details?: Record<string, unknown>) {
    super({ category: "not_found", code: ErrorCode.NOT_FOUND, message, details });
  }
}

export class ConflictError extends DomainError {
  constructor(
    code: ErrorCode = ErrorCode.CONFLICT,
    message = "Recurso em estado conflitante",
    details?: Record<string, unknown>,
  ) {
    super({ category: "conflict", code, message, details });
  }
}

export class UnprocessableError extends DomainError {
  constructor(code: ErrorCode, message: string, details?: Record<string, unknown>) {
    super({ category: "unprocessable", code, message, details });
  }
}

/** Bloqueio da regra dura de sanidade (perda fisiologicamente impossível). */
export class WeightImplausibleError extends UnprocessableError {
  constructor(details: { lossPerWeekKg: number; hardLimitKg: number }) {
    super(
      ErrorCode.WEIGHT_IMPLAUSIBLE,
      "Perda de peso por semana acima do limite fisiológico — bloqueio automático.",
      details,
    );
  }
}
