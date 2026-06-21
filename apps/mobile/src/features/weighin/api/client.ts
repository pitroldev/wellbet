/**
 * Camada fina de chamadas à API de pesagem.
 *
 * Consome o SDK TIPADO de `@charya/contracts` (gerado do OpenAPI da api — SSoT
 * do contrato). Este arquivo é o ÚNICO ponto que conhece os DTOs do fio: mapeia
 * o `capturePoint` de UI (T0/T1/T2) para o `kind` da api (baseline/mid/final) e
 * a resposta do contrato para os view-models que os hooks/telas consomem.
 */
import { weighInControllerStart, weighInControllerSubmit } from "@charya/contracts";
import type { WeighInStatus } from "@charya/schemas";

import type { CapturePoint, Challenge } from "../model/types";

const KIND_BY_POINT: Record<CapturePoint, "baseline" | "mid" | "final"> = {
  T0: "baseline",
  T1: "mid",
  T2: "final",
};

export interface StartWeighInResponse {
  /** Identifica a sessão de captura (= challengeId emitido). */
  sessionId: string;
  challenge: Challenge;
  /** Upload direto p/ R2 via URL pré-assinada. */
  upload: { url: string; objectKey: string };
}

export interface SubmitWeighInInput {
  betId: string;
  capturePoint: CapturePoint;
  /** Peso lido pelo usuário no visor da balança. */
  weightKg: number;
  /** Nonce do código dinâmico exibido na gravação (anti-replay). */
  nonce: string;
  /** Chave do vídeo já enviado ao R2 (objectKey do start). */
  videoObjectKey: string;
}

export interface SubmitWeighInResponse {
  weighInId: string;
  status: WeighInStatus;
}

/**
 * Inicia uma sessão de pesagem: o backend emite o código dinâmico (C2) e a URL
 * pré-assinada de upload (o pico de upload não toca o backend — §3).
 */
export async function startWeighIn(input: {
  betId: string;
  capturePoint: CapturePoint;
}): Promise<StartWeighInResponse> {
  const { data } = await weighInControllerStart({
    body: { kind: KIND_BY_POINT[input.capturePoint], betId: input.betId },
    throwOnError: true,
  });
  return {
    sessionId: data.challenge.challengeId,
    challenge: {
      challengeId: data.challenge.challengeId,
      word: data.challenge.word,
      code: String(data.challenge.number),
      gesture: data.challenge.gesture,
      nonce: data.challenge.nonce,
      expiresAt: data.challenge.expiresAt,
    },
    upload: { url: data.upload.url, objectKey: data.upload.objectKey },
  };
}

/**
 * Finaliza a pesagem: confirma o upload (objectKey) e envia o payload. O backend
 * aplica a regra dura de sanidade (§6) e enfileira a revisão humana (§5).
 */
export async function submitWeighIn(input: SubmitWeighInInput): Promise<SubmitWeighInResponse> {
  const { data } = await weighInControllerSubmit({
    body: {
      kind: KIND_BY_POINT[input.capturePoint],
      betId: input.betId,
      weightKg: input.weightKg,
      nonce: input.nonce,
      videoObjectKey: input.videoObjectKey,
    },
    throwOnError: true,
  });
  return { weighInId: data.weighinId, status: data.status };
}
