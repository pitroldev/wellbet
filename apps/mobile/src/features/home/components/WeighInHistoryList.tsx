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
import { useTranslation } from "react-i18next";

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

export interface WeighInHistoryListProps {
  data: readonly WeighInHistoryItem[];
}

export function WeighInHistoryList({ data }: WeighInHistoryListProps) {
  const { t } = useTranslation();

  return (
    <FlashList
      data={data as WeighInHistoryItem[]}
      keyExtractor={(item) => item.id}
      // FlashList v2: sem estimatedItemSize (auto-sizing).
      renderItem={({ item }) => (
        <View className="flex-row items-center justify-between rounded-xl bg-surface px-4 py-3">
          <View>
            <Text variant="body">
              {t(`home.history.kind.${item.kind}`)}{" "}
              <Text variant="mono">· {item.weightKg.toFixed(1)} kg</Text>
            </Text>
            <Text variant="caption" className="text-muted">
              {item.dateLabel}
            </Text>
          </View>
          <Text
            variant="caption"
            className={item.status === "approved" ? "text-arena-green" : undefined}
          >
            {t(`home.history.status.${item.status}`)}
          </Text>
        </View>
      )}
      ItemSeparatorComponent={() => <View className="h-2" />}
      ListEmptyComponent={
        <Text variant="caption" className="text-muted">
          {t("home.history.empty")}
        </Text>
      }
    />
  );
}
