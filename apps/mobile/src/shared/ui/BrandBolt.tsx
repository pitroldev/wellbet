/**
 * O RAIO da marca (wellbet & Co.) — path vetorial oficial do deck, em Skia com
 * gradiente magenta→pink→green, GLOW em formato de raio (Skia blur — sem bola,
 * cross-platform) e flutuação suave. Anima na UI thread; respeita reduce-motion.
 */
import { useEffect } from "react";
import { Blur, Canvas, Group, LinearGradient, Path, vec } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

// Path + viewBox REAIS do brandmark (apps/landing/src/ui/brand.tsx).
const BOLT_PATH =
  "M 1203.457031 429.820312 C 1164.347656 497.035156 1022.339844 731.679688 1022.332031 731.691406 L 999.492188 597.003906 L 707.671875 688.765625 L 911.476562 431.011719 L 832.222656 350.699219 L 833.445312 348.308594 L 1151.824219 348.308594 C 1232.558594 348.308594 1212.242188 414.71875 1203.457031 429.820312";
const VB_X = 707.67;
const VB_Y = 348.31;
const VB_W = 524.89;
const VB_H = 383.38;

export function BrandBolt({ size = 150 }: { size?: number }) {
  const reduced = useReducedMotion();
  const t = useSharedValue(0.5);

  useEffect(() => {
    if (reduced) return;
    t.value = withRepeat(
      withTiming(1, { duration: 2600, easing: Easing.inOut(Easing.sin) }),
      -1,
      true,
    );
  }, [reduced, t]);

  const scale = size / VB_W;
  const h = VB_H * scale;
  const pad = size * 0.34;
  const cw = size + pad * 2;
  const ch = h + pad * 2;
  const glowBlur = 18 / scale; // ~18px de blur em pixels de canvas

  // Mapeia o viewBox pro canvas (estático).
  const mapT = [
    { translateX: pad - VB_X * scale },
    { translateY: pad - VB_Y * scale },
    { scale },
  ];
  // Flutuação vertical (bob).
  const bobT = useDerivedValue(() => [{ translateY: (t.value - 0.5) * size * 0.07 }]);

  return (
    <Canvas style={{ width: cw, height: ch }} pointerEvents="none">
      <Group transform={bobT}>
        <Group transform={mapT}>
          {/* glow em formato de raio (sem bola) */}
          <Path path={BOLT_PATH} color={arena.magenta} opacity={0.55}>
            <Blur blur={glowBlur} />
          </Path>
          {/* o raio, com gradiente da marca */}
          <Path path={BOLT_PATH}>
            <LinearGradient
              start={vec(VB_X, VB_Y)}
              end={vec(VB_X + VB_W, VB_Y + VB_H)}
              colors={[arena.magenta, arena.pink, arena.green]}
            />
          </Path>
        </Group>
      </Group>
    </Canvas>
  );
}
