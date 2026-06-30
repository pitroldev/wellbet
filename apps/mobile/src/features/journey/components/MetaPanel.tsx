/**
 * Painel de tendência — mecânica do MYFITNESSPAL. Card frosted com a meta, a
 * série de check-ins (Sparkline descendo rumo ao alvo) e quanto falta. O headline
 * de progresso fica no anel da home; aqui o foco é a TRAJETÓRIA.
 */
import { View } from "react-native";
import { Feather } from "@expo/vector-icons";

import { Card, Text } from "@/shared/ui";
import { arena } from "@/theme/tokens";

import { Sparkline } from "./Sparkline";

export interface MetaPanelProps {
  label: string;
  goalText: string;
  startKg: string;
  targetKg: string;
  leftText: string;
  /** série de pesos [baseline, ...check-ins] — plota a tendência. */
  trend?: number[];
  /** valor numérico da meta — linha de referência do gráfico. */
  targetKgNum?: number;
}

export function MetaPanel({
  label,
  goalText,
  startKg,
  targetKg,
  leftText,
  trend,
  targetKgNum,
}: MetaPanelProps) {
  const hasTrend = trend != null && trend.length >= 2;

  return (
    <Card>
      <View className="flex-row items-start justify-between">
        <View className="flex-1 gap-1">
          <Text variant="label">{label}</Text>
          <Text variant="heading">{goalText}</Text>
        </View>
        <View className="items-end gap-0.5">
          <View className="flex-row items-center gap-1.5">
            <Text className="font-mono text-xs text-muted-foreground">{startKg}</Text>
            <Feather name="arrow-right" size={12} color={arena.fogMute} />
            <Text className="font-mono text-xs text-arena-mint">{targetKg}</Text>
          </View>
          <Text className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
            kg
          </Text>
        </View>
      </View>

      {hasTrend ? (
        <View className="mt-3">
          <Sparkline points={trend} target={targetKgNum} />
        </View>
      ) : null}

      <Text className="mt-3 font-mono-medium text-sm tabular-nums text-foreground">{leftText}</Text>
    </Card>
  );
}
