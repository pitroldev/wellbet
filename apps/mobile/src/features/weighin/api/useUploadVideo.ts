/**
 * Upload resiliente do vídeo de pesagem DIRETO para o R2 (URL pré-assinada).
 *
 * - O upload não passa pelo backend (§3 "Upload resiliente"): o app faz PUT na
 *   URL pré-assinada. O retry/backoff é gerenciado por TanStack Query.
 * - Usa o upload NATIVO do `expo-file-system` (não carrega o vídeo inteiro na
 *   memória JS como `fetch`+blob fazia) e reporta PROGRESSO para a UI.
 * - Em rede móvel instável, retry é regra, não exceção.
 */
import { useMutation } from "@tanstack/react-query";
import { createUploadTask, FileSystemUploadType } from "expo-file-system/legacy";

import type { RecordedVideo } from "../model/types";

export interface UploadVideoInput {
  video: RecordedVideo;
  uploadUrl: string;
  contentType?: string;
  /** Progresso 0..1 (para mostrar % na tela de envio). */
  onProgress?: (fraction: number) => void;
}

async function putToR2({
  video,
  uploadUrl,
  contentType = "video/mp4",
  onProgress,
}: UploadVideoInput): Promise<void> {
  // Upload nativo do arquivo local gravado pelo app (nunca da galeria) → R2.
  const task = createUploadTask(
    uploadUrl,
    video.uri,
    {
      httpMethod: "PUT",
      uploadType: FileSystemUploadType.BINARY_CONTENT,
      headers: { "Content-Type": contentType },
    },
    (data) => {
      const total = data.totalBytesExpectedToSend;
      if (total > 0) onProgress?.(data.totalBytesSent / total);
    },
  );

  const result = await task.uploadAsync();
  // `uploadAsync` resolve `undefined` se a task foi cancelada.
  if (result == null) {
    throw new Error("Upload para R2 cancelado.");
  }
  if (result.status < 200 || result.status >= 300) {
    throw new Error(`Upload para R2 falhou (HTTP ${result.status}).`);
  }
}

export function useUploadVideo() {
  return useMutation({
    mutationKey: ["weighin", "upload"],
    mutationFn: putToR2,
    // Rede instável: várias tentativas com backoff antes de desistir.
    retry: 4,
    retryDelay: (attempt) => Math.min(1500 * 2 ** attempt, 30_000),
  });
}
