/**
 * Cria uma aposta (POST /bets) e devolve o BR Code do Pix para pagar o stake.
 *
 * ESCRITA FINANCEIRA → idempotente: a api exige o header `Idempotency-Key`. A
 * chave é gerada uma vez por tentativa (na tela) e reusada em retries para não
 * criar/cobrar a aposta duas vezes.
 */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { betControllerPlace, type BetResponseDto, type PlaceBetDto } from "@charya/contracts";

export interface PlaceBetVars {
  readonly idempotencyKey: string;
  readonly body: PlaceBetDto;
}

export function usePlaceBet() {
  const qc = useQueryClient();
  return useMutation({
    mutationKey: ["bets", "place"],
    mutationFn: async (vars: PlaceBetVars): Promise<BetResponseDto> => {
      const { data } = await betControllerPlace({
        body: vars.body,
        headers: { "Idempotency-Key": vars.idempotencyKey },
        throwOnError: true,
      });
      return data;
    },
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["bets"] });
    },
  });
}
