/**
 * Upload resiliente do vídeo de pesagem DIRETO para o R2 (URL pré-assinada).
 *
 * - O upload não passa pelo backend (§3 "Upload resiliente"): o app faz PUT na
 *   URL pré-assinada. O retry/backoff é gerenciado por TanStack Query.
 * - Em rede móvel instável, retry é regra, não exceção.
 *
 * Observação: para arquivos grandes (vídeo contínuo da pesagem) o ideal é um
 * upload em background com progresso. Aqui usamos `fetch` com PUT como base; a
 * troca por `expo-file-system`/upload nativo com progresso fica como TODO.
 */
import { useMutation } from "@tanstack/react-query";

import type { RecordedVideo } from "../model/types";

export interface UploadVideoInput {
  video: RecordedVideo;
  uploadUrl: string;
  contentType?: string;
}

async function putToR2({
  video,
  uploadUrl,
  contentType = "video/mp4",
}: UploadVideoInput): Promise<void> {
  // Lê o arquivo local gravado pelo app (nunca da galeria) e envia ao R2.
  const fileResponse = await fetch(video.uri);
  const blob = await fileResponse.blob();

  const res = await fetch(uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: blob,
  });

  if (!res.ok) {
    throw new Error(`Upload para R2 falhou (HTTP ${res.status}).`);
  }
  // TODO: trocar por upload nativo com progresso (expo-file-system) e
  // resumo/multipart para vídeos longos; reportar progresso para a UI.
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
