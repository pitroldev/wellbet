/**
 * Botão base com feedback tátil + visual na UI thread.
 *
 * - O "afundar" (scale) acontece via shared value + `useAnimatedStyle`
 *   (Reanimated 4), na UI thread — nunca por estado React.
 * - O háptico dispara DENTRO do worklet do gesto (frame-accurate), via
 *   `react-native-gesture-handler` v3 + helper de `shared/motion`.
 * - NativeWind cuida só do estilo estático (className).
 */
import { type ReactNode, useCallback } from "react";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { hapticTick } from "@/shared/motion";

export interface PressableScaleProps {
  children: ReactNode;
  onPress?: () => void;
  /** Escala mínima ao pressionar (default 0.96). */
  pressedScale?: number;
  disabled?: boolean;
  className?: string;
}

export function PressableScale({
  children,
  onPress,
  pressedScale = 0.96,
  disabled = false,
  className,
}: PressableScaleProps) {
  const scale = useSharedValue(1);

  const handlePress = useCallback(() => {
    onPress?.();
  }, [onPress]);

  const tap = Gesture.Tap()
    .enabled(!disabled)
    .maxDuration(10_000)
    .onBegin(() => {
      "worklet";
      scale.value = withTiming(pressedScale, { duration: 90 });
      // Háptico no worklet, no toque (não em handler JS).
      hapticTick();
    })
    .onFinalize((_event, success) => {
      "worklet";
      scale.value = withTiming(1, { duration: 120 });
      if (success) {
        scheduleOnRN(handlePress);
      }
    });

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: disabled ? 0.5 : 1,
  }));

  return (
    <GestureDetector gesture={tap}>
      <Animated.View
        accessibilityRole="button"
        accessibilityState={{ disabled }}
        className={className}
        style={animatedStyle}
      >
        {children}
      </Animated.View>
    </GestureDetector>
  );
}
