/**
 * Port do store de idempotência.
 *
 * Endpoints de escrita financeira/settlement (ver §2 do doc) exigem chave de
 * idempotência: a mesma chave + mesmo request => mesma resposta, exatamente uma
 * vez de efeito. O adapter concreto (Drizzle/Postgres) vive em `infra/db`.
 */
export interface IdempotencyRecord {
  readonly key: string;
  /** Hash do corpo da request, para detectar reuso de chave com payload diferente. */
  readonly requestHash: string;
  /** Resposta serializada da primeira execução (replay em hits subsequentes). */
  readonly responseBody: unknown;
  readonly statusCode: number;
  readonly createdAt: Date;
}

export interface IdempotencyStorePort {
  /** Busca um registro pela chave (ou undefined se nunca visto). */
  find(key: string): Promise<IdempotencyRecord | undefined>;

  /**
   * Persiste o resultado de uma execução de forma atômica.
   * Deve falhar/ignorar se a chave já existir (garantia exactly-once).
   */
  save(record: IdempotencyRecord): Promise<void>;
}

/** Token de DI do store de idempotência. */
export const IDEMPOTENCY_STORE = Symbol("IDEMPOTENCY_STORE");
