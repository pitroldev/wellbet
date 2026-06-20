/**
 * Camada fina de chamadas à API de pesagem.
 *
 * Por que esta indireção existe: as funções de SDK tipadas (ex.:
 * `createWeighinSession`, `submitWeighIn`) são GERADAS por Hey API em
 * `@charya/contracts/generated` a partir do OpenAPI da api — e ainda não
 * existem no scaffold (o pacote só expõe os placeholders e o configurador do
 * cliente). Isolamos as chamadas aqui para:
 *   1. os hooks de TanStack Query compilarem hoje;
 *   2. a troca para o SDK gerado ser local (um único arquivo) quando o contrato
 *      for gerado — sem tocar nos hooks/telas.
 *
 * O shape de request/response abaixo segue os schemas de `@charya/schemas`
 * (Challenge, CapturePoint, CapturePayload) e o contrato de upload direto p/ R2
 * (§3 "Upload resiliente").
 */
import type { CapturePayload, CapturePoint, Challenge, WeighInStatus } from "@charya/schemas";

export interface StartWeighInResponse {
  sessionId: string;
  challenge: Challenge;
  /** Upload direto p/ R2 via URL pré-assinada. */
  upload: {
    /** URL pré-assinada (PUT). */
    url: string;
    /** Chave do objeto no bucket. */
    objectKey: string;
  };
}

export interface SubmitWeighInResponse {
  weighInId: string;
  /**
   * Status inicial após submissão (regra dura roda no servidor). Usa o enum
   * canônico `WeighInStatus` de `@charya/schemas` — mesmo contrato que a api
   * retorna no `SubmitWeighInResponse` (fonte única, sem literais ad-hoc).
   */
  status: WeighInStatus;
}

/**
 * Inicia uma sessão de pesagem: o backend emite o código dinâmico (C2) e a URL
 * pré-assinada de upload.
 *
 * TODO: substituir o corpo por:
 *   `const { data, error } = await createWeighinSession({ body: { betId, capturePoint } });`
 *   de `@charya/contracts` (após `pnpm --filter @charya/contracts generate`).
 */
export async function startWeighIn(_input: {
  betId: string;
  capturePoint: CapturePoint;
}): Promise<StartWeighInResponse> {
  // TODO: chamar o SDK gerado de @charya/contracts. Até lá, falha explícita
  // para não mascarar a ausência do backend em ambiente real.
  throw new Error("[weighin] startWeighIn: aguardando geração do cliente @charya/contracts.");
}

/**
 * Finaliza a pesagem: confirma o upload (objectKey) e envia o payload de
 * captura. O backend aplica a regra dura de sanidade (§6) e enfileira a
 * revisão humana (§5).
 *
 * TODO: substituir pelo SDK gerado `submitWeighIn({ body: SubmitWeighInInput })`.
 */
export async function submitWeighIn(_input: {
  betId: string;
  capturePoint: CapturePoint;
  capture: CapturePayload;
}): Promise<SubmitWeighInResponse> {
  // TODO: chamar o SDK gerado de @charya/contracts.
  throw new Error("[weighin] submitWeighIn: aguardando geração do cliente @charya/contracts.");
}
