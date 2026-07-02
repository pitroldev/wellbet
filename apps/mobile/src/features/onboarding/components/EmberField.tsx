/**
 * Campo de BRASAS do onboarding — partículas de luz violeta/ciano subindo devagar
 * atrás do conteúdo (Skia, GPU, UI thread). É a "fogueira" da Chama Violeta em
 * código: nenhum asset, variação 100% determinística (fase por índice via razão
 * áurea + hash senoidal puro — nada de Math.random em render).
 *
 * Uso: camada decorativa ATRÁS do conteúdo (absoluta, pointerEvents none).
 * Respeita reduce-motion: vira 6 pontos estáticos discretos (alpha 0.15).
 *
 * Performance: 1 Canvas, ≤ 24 partículas, um único withRepeat compartilhado;
 * cada brasa deriva posição/opacidade via useDerivedValue (zero setState).
 */
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import { Blur, Canvas, Circle, Group, Paint } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

/** Um ciclo completo de subida (as brasas se distribuem pela fase, então o campo nunca "recomeça"). */
const CYCLE_MS = 9000;
/** Razão áurea — sequência de baixa discrepância p/ fases bem espalhadas. */
const PHI = 0.6180339887498949;
/** Tons da brasa (sem verde — apostar não é vitória). */
const COLORS = [arena.violet, arena.violetSoft, arena.cyan] as const;
/** Pontos estáticos do fallback de reduce-motion. */
const STATIC_COUNT = 6;
const STATIC_ALPHA = 0.15;

/** Hash senoidal puro por índice (padrão do repo, ver Confetti) — estável entre renders. */
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface EmberFieldProps {
  /** 0..1 — densidade do campo (0 → 16 brasas, 1 → 24). Default 0.4. */
  intensity?: number;
  style?: ViewStyle;
}

interface EmberSpec {
  /** Deslocamento de fase no ciclo (razão áurea → distribuição uniforme). */
  phase: number;
  /** Coluna de origem (x). */
  x0: number;
  /** Ponto de partida (na base) e distância de subida. */
  y0: number;
  travel: number;
  /** Deriva horizontal senoidal: amplitude e nº de ondas por subida. */
  amp: number;
  wob: number;
  r: number;
  color: string;
  alpha: number;
}

export function EmberField({ intensity = 0.4, style }: EmberFieldProps) {
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const cycle = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    cycle.value = 0;
    // Linear de propósito: a fase por índice já dá o ritmo; easing aqui causaria "respiração" global.
    cycle.value = withRepeat(withTiming(1, { duration: CYCLE_MS, easing: Easing.linear }), -1, false);
  }, [reduced, cycle]);

  const count = Math.round(16 + Math.min(1, Math.max(0, intensity)) * 8);

  const embers = useMemo<EmberSpec[]>(() => {
    const { w, h } = size;
    if (w === 0 || h === 0) return [];
    return Array.from({ length: count }, (_, i) => {
      const frac = (i + 1) * PHI;
      return {
        phase: frac - Math.floor(frac),
        x0: rand(i, 1) * w,
        y0: h * (0.92 + rand(i, 2) * 0.14),
        travel: h * (0.5 + rand(i, 3) * 0.42),
        amp: 6 + rand(i, 4) * 12,
        wob: 1 + rand(i, 5) * 1.5,
        r: 1 + rand(i, 6) * 1.5, // diâmetro 2–5px
        color: COLORS[i % COLORS.length] ?? arena.violet,
        alpha: 0.25 + rand(i, 7) * 0.25,
      };
    });
  }, [size, count]);

  // Fallback estático de reduce-motion: constelação discreta, sem loop.
  const staticDots = useMemo(() => {
    const { w, h } = size;
    if (w === 0 || h === 0) return [];
    return Array.from({ length: STATIC_COUNT }, (_, i) => ({
      x: (8 + rand(i, 8) * 84) * (w / 100),
      y: h * (0.15 + rand(i, 9) * 0.65),
      r: 1.6 + rand(i, 10) * 1,
      color: COLORS[i % COLORS.length] ?? arena.violet,
    }));
  }, [size]);

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  }

  return (
    <View pointerEvents="none" style={[StyleSheet.absoluteFill, style]} onLayout={onLayout}>
      {size.w > 0 && size.h > 0 ? (
        <Canvas style={StyleSheet.absoluteFill}>
          {/* Blur ÚNICO na camada inteira (1 saveLayer) — suaviza todas as brasas de uma vez. */}
          <Group
            layer={
              <Paint>
                <Blur blur={1.1} />
              </Paint>
            }
          >
            {reduced
              ? staticDots.map((d, i) => (
                  <Circle key={i} cx={d.x} cy={d.y} r={d.r} color={d.color} opacity={STATIC_ALPHA} />
                ))
              : embers.map((spec, i) => <Ember key={i} cycle={cycle} spec={spec} />)}
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}

function Ember({ cycle, spec }: { cycle: SharedValue<number>; spec: EmberSpec }) {
  // Posição: sobe do y0 pela distância `travel`, com deriva horizontal senoidal.
  const transform = useDerivedValue(() => {
    const p = cycle.value + spec.phase;
    const q = p - Math.floor(p); // fase local 0..1 (loop sem emenda)
    const y = spec.y0 - q * spec.travel;
    const x = spec.x0 + Math.sin(q * Math.PI * 2 * spec.wob + spec.phase * Math.PI * 2) * spec.amp;
    return [{ translateX: x }, { translateY: y }];
  });

  // Acende ao nascer (15% iniciais) e apaga ao subir (30% finais).
  const opacity = useDerivedValue(() => {
    const p = cycle.value + spec.phase;
    const q = p - Math.floor(p);
    const fadeIn = Math.min(1, q / 0.15);
    const fadeOut = Math.min(1, (1 - q) / 0.3);
    return spec.alpha * Math.min(fadeIn, fadeOut);
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Circle cx={0} cy={0} r={spec.r} color={spec.color} />
    </Group>
  );
}
