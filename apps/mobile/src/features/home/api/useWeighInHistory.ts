/**
 * Histórico de pesagens do usuário (home).
 *
 * Consome o SDK tipado de `@charya/contracts` (GET /weighins) e mapeia o
 * `WeighInSummaryDto` do contrato para o view-model de UI da lista.
 */
import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { weighInControllerList, type WeighInSummaryDto } from "@charya/contracts";

import type { WeighInHistoryItem } from "../components/WeighInHistoryList";

function toHistoryItem(w: WeighInSummaryDto): WeighInHistoryItem {
  return {
    id: w.weighinId,
    kind: w.kind,
    weightKg: w.weightKg,
    status: w.status,
    dateLabel: new Date(w.capturedAt).toLocaleDateString("pt-BR"),
  };
}

export function useWeighInHistory(): UseQueryResult<WeighInHistoryItem[]> {
  return useQuery({
    queryKey: ["weighin", "history"],
    queryFn: async () => {
      const { data } = await weighInControllerList({ throwOnError: true });
      return data.map(toHistoryItem);
    },
  });
}
