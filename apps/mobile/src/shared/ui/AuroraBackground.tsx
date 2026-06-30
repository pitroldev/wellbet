/**
 * Fundo VIVO — blobs de glow (magenta / roxo / verde) que respiram atrás do
 * conteúdo. Mata o "navy morto": dá profundidade e energia de bet sem competir
 * com o conteúdo. Skia (GPU, UI thread). Respeita reduce-motion (fica estático).
 */
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Canvas, Circle, Group, RadialGradient, vec } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

export function AuroraBackground() {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const drift = useSharedValue(0.5);

  useEffect(() => {
    if (reduced) return;
    drift.value = withRepeat(
      withTiming(1, { duration: 11000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [reduced, drift]);

  const r = Math.max(width, height) * 0.55;
  const c1 = vec(width * 0.16, height * 0.14);
  const c2 = vec(width * 0.94, height * 0.4);
  const c3 = vec(width * 0.28, height * 0.96);

  const t1 = useDerivedValue(() => [{ translateY: (drift.value - 0.5) * 64 }]);
  const t2 = useDerivedValue(() => [{ translateY: (0.5 - drift.value) * 54 }]);
  const t3 = useDerivedValue(() => [{ translateY: (drift.value - 0.5) * 44 }]);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      <Group transform={t1}>
        <Circle c={c1} r={r} opacity={0.28}>
          <RadialGradient c={c1} r={r} colors={[arena.magenta, arena.navy]} />
        </Circle>
      </Group>
      <Group transform={t2}>
        <Circle c={c2} r={r} opacity={0.22}>
          <RadialGradient c={c2} r={r} colors={[arena.purple, arena.navy]} />
        </Circle>
      </Group>
      <Group transform={t3}>
        <Circle c={c3} r={r} opacity={0.16}>
          <RadialGradient c={c3} r={r} colors={[arena.green, arena.navy]} />
        </Circle>
      </Group>
    </Canvas>
  );
}
