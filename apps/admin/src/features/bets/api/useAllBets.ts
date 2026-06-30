"use client";

import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import { betControllerListAll, type AdminBetRowDto } from "@charya/contracts";

export const betKeys = {
  all: ["bets"] as const,
  list: (status?: string) => [...betKeys.all, "list", status ?? "todos"] as const,
};

/** Lista admin de todas as apostas (GET /bets/all), com filtro opcional por status. */
export function useAllBets(status?: AdminBetRowDto["status"]): UseQueryResult<AdminBetRowDto[]> {
  return useQuery({
    queryKey: betKeys.list(status),
    queryFn: async () => {
      const { data } = await betControllerListAll({
        query: status ? { status } : {},
        throwOnError: true,
      });
      return data;
    },
    // Settlement é assíncrono (open→won/lost, settling→…): revalida sozinho e ao
    // voltar o foco, para o operador não monitorar dado velho.
    refetchInterval: 30_000,
    refetchOnWindowFocus: true,
  });
}
