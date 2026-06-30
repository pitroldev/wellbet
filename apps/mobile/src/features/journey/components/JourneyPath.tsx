/**
 * O caminho — mecânica do DUOLINGO. 2 nós: Início → Final. O trilho ENCHE
 * (AnimatedBar arredondado) com o progresso e o nó final PULSA quando a janela
 * abre. Usado como rail secundário onde o anel não cabe.
 */
import { View } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@/shared/ui";
import { pulse, useMotionDuration } from "@/shared/motion";
import { arena, arenaAlpha, durations, gradients } from "@/theme/tokens";

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
      <View className="h-5 flex-row items-center">
        <View style={{ backgroundColor: arena.green }} className="h-3.5 w-3.5 rounded-full" />
        <View className="mx-2 flex-1">
          <AnimatedBar progress={progress} height={6} colors={gradients.gymbet} />
        </View>
        <Animated.View
          style={[
            windowOpen
              ? { backgroundColor: arena.magenta }
              : { backgroundColor: arenaAlpha.magentaWash, borderColor: arena.magenta },
            windowOpen && pulseDur > 0 ? pulse(pulseDur) : undefined,
          ]}
          className={
            windowOpen
              ? "h-4 w-4 rounded-full"
              : "h-3.5 w-3.5 rounded-full border border-arena-hairline-strong"
          }
        />
      </View>
      <View className="mt-2 flex-row justify-between">
        <View>
          <Text variant="label">{startLabel}</Text>
          <Text className="font-mono text-xs text-muted-foreground">{startSub}</Text>
        </View>
        <View className="items-end">
          <Text variant="label">{endLabel}</Text>
          <Text className="font-mono text-xs text-muted-foreground">{endSub}</Text>
        </View>
      </View>
    </View>
  );
}
