/**
 * Barra de status da home — mecânica do DUOLINGO (lá: streak/gemas no topo; aqui:
 * R$ em jogo · dias · streak). Três pílulas de VIDRO; os números fazem count-up.
 * A pílula de destaque (R$ em jogo — o gancho emocional) ganha LIFT: wash violeta
 * + borda viva, pra puxar o olho pro dinheiro em risco. A pílula pode carregar um
 * ícone 3D da marca (ex.: streak) ao lado do número.
 */
import { View } from "react-native";
import { Image, type ImageProps } from "expo-image";

import { Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";

import { AnimatedNumber } from "./AnimatedNumber";

export interface StatStat {
  value: number;
  label: string;
  prefix?: string;
  suffix?: string;
  accent?: boolean;
  /** Ícone 3D pequeno ao lado do número (ex.: streak da marca). */
  icon?: ImageProps["source"];
}

export function StatusBar({ stats }: { stats: StatStat[] }) {
  return (
    <View className="flex-row gap-3">
      {stats.map((s) => (
        <View
          key={s.label}
          style={{
            backgroundColor: s.accent ? arenaAlpha.violetWash : arenaAlpha.glass,
            borderColor: s.accent ? arena.violet : arena.line,
          }}
          className="flex-1 items-center gap-1 rounded-2xl border py-3.5"
        >
          <View className="flex-row items-center gap-1.5">
            {s.icon != null ? (
              <Image source={s.icon} contentFit="contain" style={{ width: 20, height: 20 }} />
            ) : null}
            <AnimatedNumber
              value={s.value}
              prefix={s.prefix}
              suffix={s.suffix}
              className={`font-mono-bold text-lg tabular-nums ${
                s.accent ? "text-arena-violet-soft" : "text-foreground"
              }`}
            />
          </View>
          <Text variant="label" className="text-[10px]">
            {s.label}
          </Text>
        </View>
      ))}
    </View>
  );
}
