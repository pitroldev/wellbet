/**
 * Finaliza a pesagem: confirma ao backend que o vídeo subiu (objectKey) e envia
 * o payload de captura. O backend aplica a ÚNICA regra dura de sanidade
 * (perda_por_semana > LIMITE_DURO → bloqueio) e enfileira para revisão humana
 * de 100% (MVP §5/§6).
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { submitWeighIn, type SubmitWeighInInput, type SubmitWeighInResponse } from "./client";
import { weighInKeys } from "./keys";

export type { SubmitWeighInResponse };

/** Payload do submit (já alinhado ao contrato — ver api/client.ts). */
export type SubmitWeighInVars = SubmitWeighInInput;

export function useSubmitWeighIn() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["weighin", "submit"],
    mutationFn: (vars: SubmitWeighInVars): Promise<SubmitWeighInResponse> => submitWeighIn(vars),
    onSuccess: (data) => {
      void qc.invalidateQueries({
        queryKey: weighInKeys.session(data.weighInId),
      });
    },
  });
}
