/**
 * Port de fila de jobs.
 *
 * Abstrai pg-boss atrás de interface. O MVP usa o próprio Postgres como fila
 * (zero infra extra, §2 do doc). Trocar por SQS/Rabbit = novo adapter.
 */
export interface QueueJob<T> {
  readonly id: string;
  readonly name: string;
  readonly data: T;
}

export type JobHandler<T> = (job: QueueJob<T>) => Promise<void>;

export interface PublishOptions {
  /** Atraso antes de processar (segundos). */
  readonly startAfterSeconds?: number;
  /** Chave de singleton: dedup de jobs idênticos em janela. */
  readonly singletonKey?: string;
  /** Tentativas máximas. */
  readonly retryLimit?: number;
}

export interface QueuePort {
  /** Publica um job numa fila nomeada. Retorna o id do job (ou null se deduplicado). */
  publish<T>(queue: string, data: T, options?: PublishOptions): Promise<string | null>;

  /** Registra um worker para consumir uma fila. */
  subscribe<T>(queue: string, handler: JobHandler<T>): Promise<void>;
}

/** Token de DI da fila. */
export const QUEUE = Symbol("QUEUE");

/** Nomes de fila conhecidos (evita strings soltas pelo código). */
export const QueueName = {
  /** Pesagem entrou na fila de revisão humana (§5). */
  REVIEW_ENQUEUE: "review.enqueue",
  /** Settlement de aposta após veredito APROVADO (§7). */
  BET_SETTLE: "bet.settle",
} as const;

export type QueueName = (typeof QueueName)[keyof typeof QueueName];
