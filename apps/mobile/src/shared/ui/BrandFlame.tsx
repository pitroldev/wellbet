/**
 * A CHAMA da marca WellBet (punho dentro da chama) — path vetorial oficial de
 * docs/design-branding/extracted/symbol-wellbet.svg, em Skia com gradiente
 * `brand` vertical sutil, GLOW violeta no formato do símbolo (Skia blur — sem
 * bola, cross-platform) e flutuação suave. Anima na UI thread; respeita
 * reduce-motion.
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
import { arena, gradients } from "@/theme/tokens";

// Path + viewBox REAIS do símbolo (viewBox 0 0 191.4 283.95).
const FLAME_PATH =
  "M188.28,157.57l-19.58-53.86-16.47-28.93-4.01-37.39-21.37,21.81-1.34,46.29-8.01,9.79-1.34-26.26-13.35-25.82-18.25-23.59L87.24,0l-26.26,31.16-6.68,20.03,3.12,31.16-.89,28.49-15.58-25.37-15.58-19.14-1.78,21.81-8.01,32.05,2.67,19.14,4.9,26.71-4.9,15.58-3.12-21.81-6.68-14.69L0,186.06l.45,33.83,27.15,37.39,16.02,11.13,14.13-45.22,11.17-.43-3.34,55.19,7.12,4.9,21.81,1.11,7.51-56.36,13.35-19.2,25.04-17.03,4.34,5.17-.83-15.52-5.84-8.62,20.38,3.86,3.12,16.91-19.14,29.38-16.02,4.01-1.78,56.97,43.62-29.38,23.15-45.4-3.12-51.19ZM148.22,168.25l-11.47,1.81-4.67-17.25-15.69-10.52-1,2.73,11.02,13.02v17.53l-5.17,5.01-5.67-20.86-19.03-8.35,14.35,18.86.67,14.52-4.67,8.51-1.34-5.67-5.17-13.69-17.53-11.02-2.34,1.84,10.35,7.85,6.34,12.18-1,12.85-7.01,8.18-5.17-6.34.33-14.19-19.53-11.35-1.17,11.02,5.34-3.84,5.01,12.35.28,5.95-16.86,11.88-6.66-26.99,4.01-27.6,15.13-6.23,4.45-11.57,27.15-10.68,7.12-6.23,13.8,4.45,27.15,22.26-1.34,19.58Z";
const VB_W = 191.4;
const VB_H = 283.95;

/** `size` = ALTURA do símbolo (o mark é retrato; a largura sai da proporção). */
export function BrandFlame({ size = 150 }: { size?: number }) {
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

  const scale = size / VB_H;
  const w = VB_W * scale;
  // respiro ≥ ~1.7× o sigma do glow (18px) — senão o halo é cortado pela borda do canvas
  const pad = Math.max(size * 0.22, 30);
  const cw = w + pad * 2;
  const ch = size + pad * 2;
  const glowBlur = 18 / scale; // ~18px de blur em pixels de canvas

  // Mapeia o viewBox pro canvas (estático).
  const mapT = [{ translateX: pad }, { translateY: pad }, { scale }];
  // Flutuação vertical (bob).
  const bobT = useDerivedValue(() => [{ translateY: (t.value - 0.5) * size * 0.06 }]);

  return (
    <Canvas style={{ width: cw, height: ch }} pointerEvents="none">
      <Group transform={bobT}>
        <Group transform={mapT}>
          {/* glow violeta no formato da chama (sem bola) */}
          <Path path={FLAME_PATH} color={arena.violet} opacity={0.55}>
            <Blur blur={glowBlur} />
          </Path>
          {/* a chama, com gradiente da marca (vertical, sutil) */}
          <Path path={FLAME_PATH}>
            <LinearGradient
              start={vec(VB_W / 2, 0)}
              end={vec(VB_W / 2, VB_H)}
              colors={[...gradients.brand]}
            />
          </Path>
        </Group>
      </Group>
    </Canvas>
  );
}
