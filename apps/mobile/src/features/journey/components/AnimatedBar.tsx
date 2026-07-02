/**
 * Barra de progresso que ENCHE (não salta) — payoff visual do loop. Trilho de
 * vidro arredondado + preenchimento em GRADIENTE. Reanimated na UI thread;
 * respeita reduce-motion (duração 0 = instantâneo).
 */
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";

import { useMotionDuration } from "@/shared/motion";
import { arena, durations, gradients } from "@/theme/tokens";

export interface AnimatedBarProps {
  /** 0..1 */
  progress: number;
  height?: number;
  colors?: readonly [string, string, ...string[]];
  trackColor?: string;
}

export function AnimatedBar({
  progress,
  height = 12,
  colors = gradients.brand,
  trackColor = arena.void,
}: AnimatedBarProps) {
  const p = Math.max(0, Math.min(1, progress));
  const sv = useSharedValue(0);
  const duration = useMotionDuration(durations.slow);

  useEffect(() => {
    sv.value = withTiming(p, { duration });
  }, [p, duration, sv]);

  const style = useAnimatedStyle(() => ({ width: `${sv.value * 100}%` }));

  return (
    <View style={{ height, backgroundColor: trackColor, borderRadius: height / 2, overflow: "hidden" }}>
      <Animated.View style={[{ height, borderRadius: height / 2, overflow: "hidden" }, style]}>
        <LinearGradient
          colors={colors}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, minWidth: height }}
        />
      </Animated.View>
    </View>
  );
}
