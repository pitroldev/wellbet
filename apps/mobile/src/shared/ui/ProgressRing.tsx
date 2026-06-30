/**
 * Anel de progresso — o elemento-assinatura do Midnight Aurora (à la Oura/Whoop).
 * Trilho de vidro + arco em gradiente (sweep magenta→orquídea→verde) que ENCHE
 * animado, começando no topo, com um PONTO DE LUZ na cabeça do arco que acompanha
 * o preenchimento. Skia (GPU, UI thread) + Reanimated. Conteúdo central livre.
 * Respeita reduce-motion (preenche na hora).
 */
import { type ReactNode, useEffect, useMemo } from "react";
import { View } from "react-native";
import { Blur, Canvas, Circle, Group, Path, Skia, SweepGradient, vec } from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena, gradients } from "@/theme/tokens";

export interface ProgressRingProps {
  /** 0..1 */
  progress: number;
  size?: number;
  strokeWidth?: number;
  /** cores do sweep (default: magenta→orquídea→verde). */
  colors?: readonly string[];
  trackColor?: string;
  children?: ReactNode;
}

export function ProgressRing({
  progress,
  size = 200,
  strokeWidth = 16,
  colors = gradients.ring,
  trackColor = arena.navyLine,
  children,
}: ProgressRingProps) {
  const reduced = useReducedMotion();
  const target = Math.max(0, Math.min(1, progress));
  const sv = useSharedValue(reduced ? target : 0);

  useEffect(() => {
    sv.value = reduced ? target : withTiming(target, { duration: 1100 });
  }, [target, reduced, sv]);

  const cx = size / 2;
  const cy = size / 2;
  const r = (size - strokeWidth) / 2;

  // Path nativo memoizado: só recria quando a geometria muda (não a cada render).
  const circle = useMemo(() => {
    const p = Skia.Path.Make();
    p.addCircle(cx, cy, r);
    return p;
  }, [cx, cy, r]);

  const end = useDerivedValue(() => sv.value);

  // Fecha a costura do sweep repetindo a 1ª cor no fim (evita emenda dura a 100%).
  const first = colors[0] ?? arena.magenta;
  const sweepColors = useMemo(() => [...colors, first], [colors, first]);
  const headColor = colors[colors.length - 1] ?? arena.magenta;

  // Ponto de luz na cabeça do arco (segue o ângulo do preenchimento).
  const headTransform = useDerivedValue(() => {
    const theta = -Math.PI / 2 + 2 * Math.PI * sv.value;
    return [{ translateX: cx + r * Math.cos(theta) }, { translateY: cy + r * Math.sin(theta) }];
  });
  const headOpacity = useDerivedValue(() => Math.min(1, sv.value * 5));

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <Canvas style={{ position: "absolute", width: size, height: size }}>
        {/* trilho */}
        <Path
          path={circle}
          style="stroke"
          strokeWidth={strokeWidth}
          strokeCap="round"
          color={trackColor}
          opacity={0.5}
        />
        {/* arco de progresso — começa no topo (rotação -90°) */}
        <Group origin={vec(cx, cy)} transform={[{ rotate: -Math.PI / 2 }]}>
          <Path
            path={circle}
            style="stroke"
            strokeWidth={strokeWidth}
            strokeCap="round"
            start={0}
            end={end}
          >
            <SweepGradient c={vec(cx, cy)} colors={sweepColors} />
          </Path>
        </Group>
        {/* cabeça luminosa do arco */}
        <Group transform={headTransform} opacity={headOpacity}>
          <Circle cx={0} cy={0} r={strokeWidth * 0.85} color={headColor} opacity={0.55}>
            <Blur blur={7} />
          </Circle>
          <Circle cx={0} cy={0} r={strokeWidth * 0.32} color={arena.white} />
        </Group>
      </Canvas>
      {children}
    </View>
  );
}
