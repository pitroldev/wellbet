/**
 * Histórico de pesagens — FlashList v2.
 *
 * Orçamento de performance: TODA lista usa FlashList v2 (nunca FlatList longa —
 * listas são o maior matador de FPS do RN). FlashList v2 tem auto-sizing, então
 * NÃO passamos `estimatedItemSize`.
 */
import type { WeighInStatus } from "@charya/schemas";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { Text } from "@/shared/ui";

export interface WeighInHistoryItem {
  id: string;
  /** Captura — `kind` do contrato (api): baseline/mid/final. */
  kind: "baseline" | "mid" | "final";
  weightKg: number;
  // Status canônico de @charya/schemas (fonte única) — sem literais ad-hoc.
  status: WeighInStatus;
  dateLabel: string;
}

/** Rótulo de display da captura (T0/T1/T2) a partir do `kind` do contrato. */
const KIND_LABEL: Record<WeighInHistoryItem["kind"], string> = {
  baseline: "T0",
  mid: "T1",
  final: "T2",
};

const STATUS_LABEL: Record<WeighInStatus, string> = {
  pending: "Recebida",
  blocked: "Bloqueada",
  in_review: "Em revisão",
  approved: "Aprovada",
  rejected: "Reprovada",
  recapture: "Recapturar",
};

export interface WeighInHistoryListProps {
  data: readonly WeighInHistoryItem[];
}

export function WeighInHistoryList({ data }: WeighInHistoryListProps) {
  return (
    <FlashList
      data={data as WeighInHistoryItem[]}
      keyExtractor={(item) => item.id}
      // FlashList v2: sem estimatedItemSize (auto-sizing).
      renderItem={({ item }) => (
        <View className="flex-row items-center justify-between rounded-xl bg-surface px-4 py-3">
          <View>
            <Text variant="body">
              {KIND_LABEL[item.kind]} · {item.weightKg.toFixed(1)} kg
            </Text>
            <Text variant="caption" className="text-muted">
              {item.dateLabel}
            </Text>
          </View>
          <Text variant="caption">{STATUS_LABEL[item.status]}</Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
      ListEmptyComponent={
        <Text variant="caption" className="text-muted">
          Nenhuma pesagem ainda.
        </Text>
      }
    />
  );
}
