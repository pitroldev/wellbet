/**
 * O caminho — mecânica do DUOLINGO. 2 nós: Início → Final. O trilho ENCHE
 * (AnimatedBar) com o progresso e o nó final PULSA quando a janela abre.
 */
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@/shared/ui";
import { pulse, useMotionDuration } from "@/shared/motion";
import { durations } from "@/theme/tokens";

import { AnimatedBar } from "./AnimatedBar";

export interface JourneyPathProps {
  startLabel: string;
  startSub: string;
  endLabel: string;
  endSub: string;
  /** 0..1 — fração do trajeto (progresso pra meta). */
  progress: number;
  /** janela final aberta? destaca e pulsa o nó final. */
  windowOpen?: boolean;
}

export function JourneyPath({
  startLabel,
  startSub,
  endLabel,
  endSub,
  progress,
  windowOpen = false,
}: JourneyPathProps) {
  const pulseDur = useMotionDuration(durations.slow);

  return (
    <View className="py-1">
      <View className="h-4 flex-row items-center">
        {/* nó de partida — cumprido */}
        <View className="h-3 w-3 bg-arena-green" />
        {/* trilho que enche */}
        <View className="mx-1 flex-1">
          <AnimatedBar
            progress={progress}
            trackClassName="h-1 bg-border"
            fillClassName="h-1 bg-arena-magenta"
          />
        </View>
        {/* nó final — pulsa na janela */}
        <Animated.View
          className={
            windowOpen
              ? "h-4 w-4 bg-arena-magenta"
              : "h-3 w-3 border-2 border-arena-magenta bg-background"
          }
          style={windowOpen && pulseDur > 0 ? pulse(pulseDur) : undefined}
        />
      </View>
      <View className="mt-2 flex-row justify-between">
        <View>
          <Text variant="label">{startLabel}</Text>
          <Text className="font-mono text-xs text-muted">{startSub}</Text>
        </View>
        <View className="items-end">
          <Text variant="label">{endLabel}</Text>
          <Text className="font-mono text-xs text-muted">{endSub}</Text>
        </View>
      </View>
    </View>
  );
}
