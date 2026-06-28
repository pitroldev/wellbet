/**
 * Mascote da marca — desenhado em código (Skia), sem asset binário.
 *
 * Substitui o Rive `mascot.riv` (que era placeholder e não existia, renderizando
 * vazio). É um "blob" magenta com olhos, sorriso e glow, que flutua de leve.
 * `variant`:
 *  - "welcome" → respiro suave (onboarding).
 *  - "reward"  → quica e pulsa mais (tela de recompensa).
 *
 * Respeita reduce-motion (fica estático). Quando entrar um `.riv` de verdade,
 * basta trocar o interior por <Rive/> mantendo a mesma API.
 */
import { useEffect } from "react";
import { Blur, Canvas, Circle, Group, Path, RadialGradient, vec } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

export interface MascotProps {
  variant?: "welcome" | "reward";
  size?: number;
}

export function Mascot({ variant = "welcome", size = 180 }: MascotProps) {
  const reduced = useReducedMotion();
  const phase = useSharedValue(0);

  const amp = variant === "reward" ? 0.1 : 0.05; // amplitude do bob (fração do tamanho)
  const period = variant === "reward" ? 900 : 1600;

  useEffect(() => {
    if (reduced) return;
    phase.value = withRepeat(
      withTiming(1, { duration: period, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
    // phase é estável; só re-inicia se a velocidade mudar.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced, period]);

  const cx = size / 2;
  const cy = size / 2;
  const r = size * 0.34;

  const transform = useDerivedValue(() => {
    const ph = reduced ? 0.5 : phase.value;
    const bob = (ph - 0.5) * 2 * (size * amp);
    const scale = variant === "reward" ? 1 + (ph - 0.5) * 0.06 : 1;
    return [{ translateY: bob }, { scale }];
  });

  const eyeY = cy - r * 0.15;
  const eyeDx = r * 0.38;
  const eyeR = r * 0.16;
  const pupilR = eyeR * 0.5;

  // Sorriso (arco quadrático).
  const smile = `M ${cx - r * 0.28} ${cy + r * 0.3} Q ${cx} ${cy + r * 0.55} ${cx + r * 0.28} ${cy + r * 0.3}`;

  return (
    <Canvas style={{ width: size, height: size }}>
      <Group transform={transform} origin={vec(cx, cy)}>
        {/* Glow magenta */}
        <Circle cx={cx} cy={cy} r={r * 1.15} color={arena.magenta} opacity={0.35}>
          <Blur blur={18} />
        </Circle>
        {/* Corpo */}
        <Circle cx={cx} cy={cy} r={r}>
          <RadialGradient
            c={vec(cx, cy - r * 0.3)}
            r={r * 1.4}
            colors={[arena.magenta, arena.purpleDeep]}
          />
        </Circle>
        {/* Olhos */}
        <Circle cx={cx - eyeDx} cy={eyeY} r={eyeR} color={arena.white} />
        <Circle cx={cx + eyeDx} cy={eyeY} r={eyeR} color={arena.white} />
        <Circle cx={cx - eyeDx} cy={eyeY} r={pupilR} color={arena.ink} />
        <Circle cx={cx + eyeDx} cy={eyeY} r={pupilR} color={arena.ink} />
        {/* Sorriso */}
        <Path
          path={smile}
          style="stroke"
          strokeWidth={size * 0.018}
          strokeCap="round"
          color={arena.white}
        />
      </Group>
    </Canvas>
  );
}
