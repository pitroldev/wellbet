/**
 * O painel de números — mecânica do MYFITNESSPAL (tendência + quanto falta).
 * Sparkline dos check-ins (quando houver) + barra que ENCHE + meta/partida→alvo.
 */
import { View } from "react-native";

import { Text } from "@/shared/ui";

import { AnimatedBar } from "./AnimatedBar";
import { Sparkline } from "./Sparkline";

export interface MetaPanelProps {
  label: string;
  goalText: string;
  startKg: string;
  targetKg: string;
  /** 0..1 */
  progress: number;
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
  progress,
  leftText,
  trend,
  targetKgNum,
}: MetaPanelProps) {
  return (
    <View className="gap-2">
      <Text variant="label">{label}</Text>
      <Text variant="heading">{goalText}</Text>
      <Text className="font-mono text-sm text-muted">
        {startKg} → {targetKg} kg
      </Text>

      {trend != null && trend.length >= 2 ? <Sparkline points={trend} target={targetKgNum} /> : null}

      <View className="mt-1">
        <AnimatedBar progress={progress} />
      </View>
      <Text className="font-mono-bold text-sm tabular-nums text-foreground">{leftText}</Text>
    </View>
  );
}
