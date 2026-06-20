/**
 * Mapeadores HTTP↔application do módulo weighin.
 *
 * Mantêm o controller fino: convertem o resultado dos use-cases (Date, etc.)
 * para o shape serializável do DTO de resposta.
 */
import type { IssueWeighInChallengeResult } from "../application/issue-challenge.use-case.js";
import type { SubmitWeighInResult } from "../application/submit-weighin.use-case.js";
import type { StartWeighInResponseDto, SubmitWeighInResponseDto } from "./weighin.dto.js";

export function toStartResponse(r: IssueWeighInChallengeResult): StartWeighInResponseDto {
  return {
    challenge: {
      challengeId: r.challenge.challengeId,
      word: r.challenge.word,
      number: r.challenge.number,
      gesture: r.challenge.gesture,
      nonce: r.challenge.nonce,
      expiresAt: r.challenge.expiresAt.toISOString(),
    },
    upload: {
      url: r.upload.url,
      objectKey: r.upload.objectKey,
      expiresAt: r.upload.expiresAt.toISOString(),
      ...(r.upload.requiredHeaders ? { requiredHeaders: r.upload.requiredHeaders } : {}),
    },
  };
}

export function toSubmitResponse(r: SubmitWeighInResult): SubmitWeighInResponseDto {
  return {
    weighinId: r.weighinId,
    status: r.status,
    lossPerWeekKg: r.lossPerWeekKg,
  };
}
