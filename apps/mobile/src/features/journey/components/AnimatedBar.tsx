/**
 * Barra de progresso que ENCHE (não salta) — o payoff visual do loop central.
 * Reanimated na UI thread; respeita reduce-motion (duração 0 = instantâneo).
 */
import { useEffect } from "react";
import { View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

import { useMotionDuration } from "@/shared/motion";
import { durations } from "@/theme/tokens";

export interface AnimatedBarProps {
  /** 0..1 */
  progress: number;
  trackClassName?: string;
  fillClassName?: string;
}

export function AnimatedBar({
  progress,
  trackClassName = "h-4 border-2 border-border bg-arena-ink",
  fillClassName = "h-full bg-arena-magenta",
}: AnimatedBarProps) {
  const p = Math.max(0, Math.min(1, progress));
  const sv = useSharedValue(0);
  const duration = useMotionDuration(durations.slow);

  useEffect(() => {
    sv.value = withTiming(p, { duration });
  }, [p, duration, sv]);

  const style = useAnimatedStyle(() => ({ width: `${sv.value * 100}%` }));

  return (
    <View className={trackClassName}>
      <Animated.View className={fillClassName} style={style} />
    </View>
  );
}
