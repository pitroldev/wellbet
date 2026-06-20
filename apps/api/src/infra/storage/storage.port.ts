/**
 * Port de storage de objetos.
 *
 * Fronteira de storage atrás de interface (ports & adapters, §0/§2 do doc):
 * o use-case fala com `StoragePort`; trocar R2 por B2/MinIO = novo adapter,
 * zero mudança no use-case.
 *
 * Padrão de upload do vídeo: o app sobe DIRETO para o R2 via URL pré-assinada
 * (o pico de upload não toca o backend, §3 mobile). O backend só assina.
 */
export interface PresignUploadInput {
  /** Chave do objeto no bucket (ex.: `weighins/{userId}/{weighinId}.mp4`). */
  readonly key: string;
  readonly contentType: string;
  /** Validade da URL em segundos (default vem da env). */
  readonly expiresInSeconds?: number;
  /** Tamanho máximo aceito (enforced via content-length-range, opcional). */
  readonly maxSizeBytes?: number;
}

export interface PresignDownloadInput {
  readonly key: string;
  readonly expiresInSeconds?: number;
}

export interface PresignedUrl {
  readonly url: string;
  readonly key: string;
  readonly expiresAt: Date;
  /** Headers que o cliente DEVE enviar no PUT (ex.: Content-Type). */
  readonly requiredHeaders?: Readonly<Record<string, string>>;
}

export interface StoragePort {
  /** Gera URL pré-assinada para o cliente fazer PUT direto no bucket. */
  presignUpload(input: PresignUploadInput): Promise<PresignedUrl>;

  /** Gera URL pré-assinada para leitura (ex.: revisor assistir o vídeo). */
  presignDownload(input: PresignDownloadInput): Promise<PresignedUrl>;
}

/** Token de DI do storage. */
export const STORAGE = Symbol("STORAGE");
