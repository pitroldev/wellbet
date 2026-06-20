import { z } from "zod";
import {
  BetId,
  ChallengeId,
  MediaRef,
  NonEmptyString,
  Timestamp,
  Timestamps,
  UserId,
  WeightKg,
  WeighInId,
} from "./common.js";

/**
 * Pesagem (WeighIn).
 *
 * Cada aposta tem exatamente 3 capturas — T0/T1/T2 — com **procedimento
 * idêntico** (não existe captura de "menor rigor"). O software do MVP faz só:
 *   1. gerar o desafio dinâmico (código + gesto) — C2;
 *   2. forçar a gravação interna do vídeo (sem upload de galeria) — C1;
 *   3. registrar a evidência para a regra dura e a revisão humana.
 *
 * Ver `docs/Charya_Validacao_Peso_MVP.md` §3–§4.
 */

/* -------------------------------------------------------------------------- */
/* Ponto de captura                                                            */
/* -------------------------------------------------------------------------- */

/**
 * As 3 capturas da aposta:
 * - `T0` baseline      — ponto de partida (inflar aqui falsifica todo o delta).
 * - `T1` intermediária — confirma evolução gradual.
 * - `T2` final         — define o prêmio (máximo incentivo de fraude).
 */
export const CapturePoint = z.enum(["T0", "T1", "T2"]);
export type CapturePoint = z.infer<typeof CapturePoint>;

/* -------------------------------------------------------------------------- */
/* Desafio dinâmico (C2)                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Gesto que o app sorteia e pede ao vivo na captura (anti-replay).
 */
export const ChallengeGesture = z.enum([
  "thumbs_up",
  "open_palm",
  "peace_sign",
  "touch_nose",
  "wave",
]);
export type ChallengeGesture = z.infer<typeof ChallengeGesture>;

/**
 * O código dinâmico exibido ao vivo: palavra + número + gesto. A pessoa
 * mostra na tela e executa o gesto dentro do vídeo contínuo.
 *
 * O `nonce` é o que o revisor confere contra o vídeo (frescor / anti-replay):
 * tem de bater exatamente com o emitido para esta sessão.
 */
export const Challenge = z
  .object({
    id: ChallengeId,
    betId: BetId,
    capturePoint: CapturePoint,
    /** Palavra aleatória exibida. */
    word: NonEmptyString,
    /** Número aleatório exibido (4 dígitos). */
    code: z.string().regex(/^\d{4}$/, "Código deve ter 4 dígitos."),
    gesture: ChallengeGesture,
    /** Nonce canônico (combinação word+code+gesture) gravado server-side. */
    nonce: NonEmptyString,
    issuedAt: Timestamp,
    /** Validade curta do código dinâmico (parâmetro calibrável, §11). */
    expiresAt: Timestamp,
  })
  .refine((c) => new Date(c.expiresAt) > new Date(c.issuedAt), {
    message: "A validade do código deve ser posterior à emissão.",
    path: ["expiresAt"],
  });
export type Challenge = z.infer<typeof Challenge>;

/* -------------------------------------------------------------------------- */
/* Metadados do dispositivo                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Metadados do aparelho que gravou. Coletados para auditoria/fase 2 — no MVP
 * são contexto para o revisor, não decisão automática.
 */
export const DeviceMeta = z.object({
  platform: z.enum(["ios", "android"]),
  osVersion: NonEmptyString,
  appVersion: NonEmptyString,
  model: NonEmptyString.optional(),
  /** Indica gravação feita pela câmera interna do app (C1). */
  capturedInApp: z.literal(true),
});
export type DeviceMeta = z.infer<typeof DeviceMeta>;

/* -------------------------------------------------------------------------- */
/* Payload de captura                                                          */
/* -------------------------------------------------------------------------- */

/**
 * O que o app envia ao concluir uma captura. O vídeo é um **take único e
 * contínuo** gravado no app — aqui vai apenas a referência ao arquivo em
 * storage, nunca o binário.
 */
export const CapturePayload = z.object({
  challengeId: ChallengeId,
  /** Referência ao vídeo contínuo em storage (R2/S3). */
  videoRef: MediaRef,
  /** Nonce que o app exibiu na tela durante a gravação. */
  displayedNonce: NonEmptyString,
  /** Peso lido pelo usuário no visor da balança. */
  declaredWeight: WeightKg,
  deviceMeta: DeviceMeta,
  /** Instante em que a gravação foi finalizada no aparelho. */
  recordedAt: Timestamp,
});
export type CapturePayload = z.infer<typeof CapturePayload>;

/* -------------------------------------------------------------------------- */
/* Status operacional da pesagem (ENUM CANÔNICO — fonte única)                 */
/* -------------------------------------------------------------------------- */

/**
 * Status operacional da pesagem no fluxo manual-first. **Fonte única da
 * verdade**: api (entidade de domínio + DTO), admin e mobile importam ESTE
 * enum em vez de redeclarar literais ad-hoc (`'pending'` / `'in_review'`).
 *
 * - `pending`    — recebida; ainda não avaliada pela regra dura (§6).
 * - `blocked`    — bloqueada pela regra dura (perda fisicamente impossível).
 * - `in_review`  — passou na sanidade; na fila do revisor humano (§5).
 * - `approved`   — revisor aprovou (§7).
 * - `rejected`   — revisor reprovou (§7).
 * - `recapture`  — revisor pediu nova captura (§7).
 */
export const WeighInStatus = z.enum([
  "pending",
  "blocked",
  "in_review",
  "approved",
  "rejected",
  "recapture",
]);
export type WeighInStatus = z.infer<typeof WeighInStatus>;

/* -------------------------------------------------------------------------- */
/* Resultado da pesagem (discriminated union por estado)                       */
/* -------------------------------------------------------------------------- */

/**
 * Estado da pesagem na fila de validação:
 * - `pending_sanity` — recebida; aguardando a regra dura (§6).
 * - `pending_review` — passou na sanidade; na fila do revisor.
 * - `blocked`        — bloqueada pela regra dura (perda fisicamente impossível).
 * - `reviewed`       — revisor emitiu veredito (ver `review.ts`).
 */
export const WeighInState = z.enum(["pending_sanity", "pending_review", "blocked", "reviewed"]);
export type WeighInState = z.infer<typeof WeighInState>;

/**
 * Campos comuns a toda pesagem, qualquer que seja o estado.
 */
const WeighInBase = z.object({
  id: WeighInId,
  betId: BetId,
  userId: UserId,
  capturePoint: CapturePoint,
  capture: CapturePayload,
});

/**
 * Pesagem como entidade persistida, discriminada por `state`.
 *
 * Usar union discriminada deixa o consumidor seguro: só há `blockReason`
 * quando `state === 'blocked'`, e só há `reviewId` quando `reviewed`.
 */
export const WeighIn = z.discriminatedUnion("state", [
  WeighInBase.extend({
    state: z.literal("pending_sanity"),
  }).extend(Timestamps.shape),

  WeighInBase.extend({
    state: z.literal("pending_review"),
  }).extend(Timestamps.shape),

  WeighInBase.extend({
    state: z.literal("blocked"),
    /** Motivo legível do bloqueio automático (regra dura). */
    blockReason: NonEmptyString,
  }).extend(Timestamps.shape),

  WeighInBase.extend({
    state: z.literal("reviewed"),
    /** Referência à decisão de revisão (ver `review.ts`). */
    reviewId: z.uuid(),
  }).extend(Timestamps.shape),
]);
export type WeighIn = z.infer<typeof WeighIn>;

/* -------------------------------------------------------------------------- */
/* Contrato de submissão (input do app)                                        */
/* -------------------------------------------------------------------------- */

/**
 * Payload que o app envia para registrar uma pesagem. O servidor valida o
 * desafio, roda a regra dura e enfileira para revisão.
 */
export const SubmitWeighInInput = z.object({
  betId: BetId,
  capturePoint: CapturePoint,
  capture: CapturePayload,
});
export type SubmitWeighInInput = z.infer<typeof SubmitWeighInInput>;
