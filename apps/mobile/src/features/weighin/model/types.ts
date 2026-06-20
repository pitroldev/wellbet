/**
 * Tipos do fluxo de pesagem (captura).
 *
 * Reflete o roteiro do doc de Validação de Peso (MVP §3–§4):
 * - Pontos de captura: T0 (baseline), T1 (intermediária), T2 (final).
 * - Roteiro: um ÚNICO vídeo contínuo, sem cortes, com 6 etapas em ordem.
 *
 * Os tipos canônicos de domínio (Challenge, CapturePoint, ChallengeGesture)
 * vivem em `@charya/schemas` (fonte única Zod). Aqui ficam apenas os tipos de
 * estado de UI da captura.
 */
import type { CapturePoint, Challenge, ChallengeGesture } from "@charya/schemas";

export type { CapturePoint, Challenge, ChallengeGesture };

/**
 * Etapas do roteiro de captura (MVP §4). São guias para o usuário e marcadores
 * que o revisor confere depois — o app NÃO valida automaticamente cada uma
 * (validação é humana no MVP). Sem "objeto de peso conhecido" no MVP.
 */
export const CAPTURE_STEPS = [
  "face", // 1. Rosto de frente
  "challenge", // 2. Código dinâmico na tela + executar gesto
  "scaleZero", // 3. Balança vazia exibindo 0,0
  "floor", // 4. Piso e base da balança (4 pés, chão nivelado)
  "body", // 5. Corpo inteiro subindo, mãos à vista, sem apoio
  "display", // 6. Visor em close, número estabilizando do zero até o peso
] as const;

export type CaptureStep = (typeof CAPTURE_STEPS)[number];

/** Fase macro do fluxo de captura. */
export type CapturePhase =
  | "idle" // antes de começar
  | "instructions" // mostrando roteiro
  | "recording" // gravando (vídeo contínuo)
  | "review" // usuário confere o take
  | "uploading" // enviando para R2
  | "done" // enviado e registrado
  | "error";

export interface RecordedVideo {
  /** URI local do arquivo gravado (gravação interna, nunca galeria). */
  uri: string;
  durationMs: number;
  sizeBytes?: number;
}
