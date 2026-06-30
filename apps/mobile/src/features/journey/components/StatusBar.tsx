/**
 * Barra de status da home — mecânica do DUOLINGO (lá: streak/gemas no topo; aqui:
 * R$ em jogo · dias · streak). Três pílulas de VIDRO; os números fazem count-up.
 * A pílula de destaque (R$ em jogo — o gancho emocional) ganha LIFT: wash magenta
 * + borda viva, pra puxar o olho pro dinheiro em risco.
 */
import { View } from "react-native";

import { Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";

import { AnimatedNumber } from "./AnimatedNumber";

export interface StatStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
}

export function StatusBar({ stats }: { stats: StatStat[] }) {
  return (
    <View className="flex-row gap-3">
      {stats.map((s) => (
        <View
          key={s.label}
          style={{
            backgroundColor: s.accent ? arenaAlpha.magentaWash : arenaAlpha.glass,
            borderColor: s.accent ? arena.magenta : arena.navyLine,
          }}
          className="flex-1 items-center gap-1 rounded-2xl border py-3.5"
        >
          <AnimatedNumber
            value={s.value}
            prefix={s.prefix}
            suffix={s.suffix}
            className={`font-mono-bold text-lg tabular-nums ${
              s.accent ? "text-arena-magenta" : "text-foreground"
            }`}
          />
          <Text variant="label" className="text-[10px]">
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
