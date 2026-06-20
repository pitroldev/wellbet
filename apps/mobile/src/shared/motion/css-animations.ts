/**
 * Helpers para a CSS Animations API do Reanimated 4 (off-thread, declarativa).
 *
 * Por que isso existe (§3 Animação/Feel):
 * - Anima na UI thread, sempre. A CSS API do RN4 substitui o Moti (que quebra
 *   no RN4) para o caso declarativo, sem shared values nem re-render.
 * - NUNCA animar por estado React ou troca de `className` — recomputar a cada
 *   frame trava a thread JS.
 *
 * Estes objetos de estilo são passados a um `Animated.View` (Reanimated 4),
 * que aceita `animationName`/`transition` no estilo. São presets reutilizáveis
 * para entrada de tela e micro-interações.
 */
import type { CSSAnimationKeyframes, CSSAnimationProperties } from "react-native-reanimated";

import { durations } from "@/theme/tokens";

/** Keyframes: fade + leve subida (entrada de conteúdo). */
export const fadeInUpKeyframes: CSSAnimationKeyframes = {
  from: { opacity: 0, transform: [{ translateY: 12 }] },
  to: { opacity: 1, transform: [{ translateY: 0 }] },
};

/** Keyframes: pop (escala) — usado em badges/recompensa discreta. */
export const popKeyframes: CSSAnimationKeyframes = {
  "0%": { transform: [{ scale: 0.85 }], opacity: 0 },
  "70%": { transform: [{ scale: 1.04 }], opacity: 1 },
  "100%": { transform: [{ scale: 1 }], opacity: 1 },
};

/** Keyframes: pulso infinito sutil (chama atenção sem distrair). */
export const pulseKeyframes: CSSAnimationKeyframes = {
  "0%": { transform: [{ scale: 1 }] },
  "50%": { transform: [{ scale: 1.06 }] },
  "100%": { transform: [{ scale: 1 }] },
};

/**
 * Monta as propriedades de animação CSS do Reanimated 4.
 * `durationMs` deve já vir ajustado por reduce-motion quando for decorativo
 * (ver `useMotionDuration`).
 */
export function cssAnimation(
  keyframes: CSSAnimationKeyframes,
  durationMs: number = durations.base,
  options?: Partial<CSSAnimationProperties>,
): CSSAnimationProperties {
  return {
    animationName: keyframes,
    animationDuration: durationMs,
    animationTimingFunction: "ease-out",
    animationFillMode: "both",
    ...options,
  };
}

/** Preset pronto: entrada fade-up. */
export function fadeInUp(durationMs?: number): CSSAnimationProperties {
  return cssAnimation(fadeInUpKeyframes, durationMs);
}

/** Preset pronto: pop de entrada. */
export function pop(durationMs?: number): CSSAnimationProperties {
  return cssAnimation(popKeyframes, durationMs);
}

/** Preset pronto: pulso infinito. */
export function pulse(durationMs: number = durations.slow): CSSAnimationProperties {
  return cssAnimation(pulseKeyframes, durationMs, {
    animationIterationCount: "infinite",
    animationTimingFunction: "ease-in-out",
  });
}
