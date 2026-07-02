/**
 * Fundo VIVO — a aurora. Base em gradiente azul-noite→ink→void + blobs de glow
 * (violeta / ciano / verde) que respiram atrás do conteúdo. Mata o "ink
 * morto": dá profundidade e energia de bet sem competir com o conteúdo. Skia
 * (GPU, UI thread). Respeita reduce-motion (fica estático).
 */
import { useEffect } from "react";
import { StyleSheet, useWindowDimensions } from "react-native";
import { Canvas, Circle, Group, LinearGradient, RadialGradient, Rect, vec } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena, gradients } from "@/theme/tokens";

export function AuroraBackground() {
  const { width, height } = useWindowDimensions();
  const reduced = useReducedMotion();
  const drift = useSharedValue(0.5);

  useEffect(() => {
    if (reduced) return;
    drift.value = withRepeat(
      withTiming(1, { duration: 12000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true,
    );
  }, [reduced, drift]);

  const r = Math.max(width, height) * 0.6;
  const c1 = vec(width * 0.12, height * 0.1); // violeta — topo-esquerda
  const c2 = vec(width * 1.0, height * 0.34); // ciano — direita
  const c3 = vec(width * 0.2, height * 1.02); // verde — base-esquerda

  const t1 = useDerivedValue(() => [{ translateY: (drift.value - 0.5) * 70 }]);
  const t2 = useDerivedValue(() => [{ translateY: (0.5 - drift.value) * 58 }]);
  const t3 = useDerivedValue(() => [{ translateY: (drift.value - 0.5) * 48 }]);

  return (
    <Canvas style={StyleSheet.absoluteFill} pointerEvents="none">
      {/* Base — azul-noite no topo descendo pro void. */}
      <Rect x={0} y={0} width={width} height={height}>
        <LinearGradient start={vec(0, 0)} end={vec(width * 0.3, height)} colors={[...gradients.aurora]} />
      </Rect>

      <Group transform={t1}>
        <Circle c={c1} r={r} opacity={0.3}>
          <RadialGradient c={c1} r={r} colors={[arena.violet, "rgba(8,22,30,0)"]} />
        </Circle>
      </Group>
      <Group transform={t2}>
        <Circle c={c2} r={r} opacity={0.2}>
          <RadialGradient c={c2} r={r} colors={[arena.cyan, "rgba(8,22,30,0)"]} />
        </Circle>
      </Group>
      <Group transform={t3}>
        <Circle c={c3} r={r * 0.9} opacity={0.16}>
          <RadialGradient c={c3} r={r * 0.9} colors={[arena.green, "rgba(8,22,30,0)"]} />
        </Circle>
      </Group>
    </Canvas>
  );
}
