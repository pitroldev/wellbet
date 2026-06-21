/**
 * Resolve O QUE pesar agora: a aposta ativa (`open`) do usuário e o próximo
 * ponto de captura (T0/T1/T2) derivado de quantas pesagens essa aposta já tem.
 *
 * Remove o `betId` chumbado da tela de pesagem: o destino vem do contrato
 * (betControllerList + weighInControllerList), não de um placeholder.
 */
import { useQuery } from "@tanstack/react-query";
import { betControllerList, weighInControllerList } from "@charya/contracts";

import type { CapturePoint } from "../model/types";

const CAPTURE_BY_COUNT: readonly CapturePoint[] = ["T0", "T1", "T2"];

export type WeighInTarget =
  | { readonly status: "loading" }
  | { readonly status: "no-bet" }
  | { readonly status: "done"; readonly betId: string }
  | { readonly status: "ready"; readonly betId: string; readonly capturePoint: CapturePoint };

export function useActiveWeighInTarget(): WeighInTarget {
  const bets = useQuery({
    queryKey: ["bets", "list"],
    queryFn: async () => (await betControllerList({ throwOnError: true })).data,
  });
  const weighins = useQuery({
    queryKey: ["weighin", "summary"],
    queryFn: async () => (await weighInControllerList({ throwOnError: true })).data,
  });

  if (bets.isPending || weighins.isPending) return { status: "loading" };

  const open = bets.data?.find((b) => b.status === "open");
  if (!open) return { status: "no-bet" };

  const count = (weighins.data ?? []).filter((w) => w.betId === open.betId).length;
  const next = CAPTURE_BY_COUNT[count];
  if (next == null) return { status: "done", betId: open.betId };

  return { status: "ready", betId: open.betId, capturePoint: next };
}
