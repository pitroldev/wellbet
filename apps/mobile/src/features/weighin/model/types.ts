/**
 * Tipos do fluxo de pesagem (captura).
 *
 * SSoT do contrato = `@charya/contracts` (cliente gerado do OpenAPI da api). Os
 * view-models abaixo ESPELHAM o contrato; o `capturePoint` (T0/T1/T2) é um
 * conceito de UI, mapeado para o `kind` da api (baseline/mid/final) na camada
 * `../api/client.ts`. O fluxo segue o doc de Validação (MVP §3–§4): um ÚNICO
 * vídeo contínuo com 6 etapas em ordem.
 */

/** Ponto de captura (UI): T0 baseline · T1 intermediária · T2 final. */
export const CAPTURE_POINTS = ["T0", "T1", "T2"] as const;
export type CapturePoint = (typeof CAPTURE_POINTS)[number];

/**
 * Código dinâmico ativo na captura — espelha `StartWeighInResponseDto.challenge`
 * do contrato. `code` é a string exibida (derivada do `number` da api).
 */
export interface Challenge {
  challengeId: string;
  word: string;
  code: string;
  gesture: string;
  nonce: string;
  expiresAt: string;
}

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
