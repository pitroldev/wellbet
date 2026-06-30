/**
 * A barra de status da home — mecânica do DUOLINGO (lá: streak/gemas no topo;
 * aqui: R$ em jogo · dias · streak). Os números fazem count-up (AnimatedNumber).
 */
import { View } from "react-native";

import { Text } from "@/shared/ui";

import { AnimatedNumber } from "./AnimatedNumber";

export interface StatusStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
}

export function StatusBar({ stats }: { stats: StatusStat[] }) {
  return (
    <View className="flex-row border-2 border-border bg-arena-ink">
      {stats.map((s, i) => (
        <View
          key={s.label}
          className={`flex-1 items-center py-3 ${i > 0 ? "border-l-2 border-border" : ""}`}
        >
          <AnimatedNumber
            value={s.value}
            prefix={s.prefix}
            suffix={s.suffix}
            className={`font-mono-bold text-lg tabular-nums ${
              s.accent ? "text-arena-magenta" : "text-foreground"
            }`}
          />
          <Text variant="label" className="mt-0.5">
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
