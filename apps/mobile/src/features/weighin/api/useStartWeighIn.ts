/**
 * Inicia uma sessão de pesagem no backend.
 *
 * O backend retorna:
 * - o código dinâmico (palavra + número + gesto) com validade (C2 do MVP);
 * - uma URL pré-assinada para upload DIRETO ao R2 (o pico de upload não toca o
 *   backend — §3 "Upload resiliente").
 *
 * Usa a camada `client.ts` (que envolve o SDK tipado de @charya/contracts).
 */
import { useMutation } from "@tanstack/react-query";

import { startWeighIn, type StartWeighInResponse } from "./client";
import type { CapturePoint } from "../model/types";

export type { StartWeighInResponse };

export function useStartWeighIn() {
  return useMutation({
    mutationKey: ["weighin", "start"],
    mutationFn: (input: {
      betId: string;
      capturePoint: CapturePoint;
    }): Promise<StartWeighInResponse> => startWeighIn(input),
  });
}
