/**
 * Ponte do app para os design tokens compartilhados (@charya/ui-tokens).
 *
 * A fonte da verdade dos tokens é o pacote `@charya/ui-tokens` (mesmo que o
 * admin consome via Tailwind v4 e o mobile via NativeWind/TW3). Aqui só
 * re-exportamos para uso imperativo em JS (ex.: cores passadas para Skia,
 * Reanimated ou props nativas que não aceitam className).
 *
 * NativeWind cobre o estilo estático via classes; este módulo é para os casos
 * em que precisamos do valor do token em runtime (animação/canvas).
 */
import { colors, spacing, radii, durationsMs, springs, easing, tokens } from "@charya/ui-tokens";

export { colors, spacing, radii, durationsMs, springs, easing, tokens };

/**
 * Durações de animação (ms, números) — para Reanimated 4 (`withTiming` / CSS
 * API). Derivadas de `durationsMs` do pacote de tokens (fonte única).
 */
export const durations = {
  instant: durationsMs.instant,
  fast: durationsMs.fast,
  base: durationsMs.base,
  slow: durationsMs.slow,
  celebration: durationsMs.celebration,
} as const;

/**
 * Cores semânticas cruas (hex) para uso imperativo em Skia/Reanimated/props
 * nativas. As escalas completas continuam em `colors` (ex.: `colors.brand[500]`).
 */
export const palette = {
  primary: colors.brand[500],
  primaryDeep: colors.brand[950],
  accent: colors.accent[400],
  success: colors.success[500],
  danger: colors.danger[500],
  surface: colors.neutral[900],
  background: colors.neutral[950],
  foreground: colors.neutral[50],
} as const;

export type PaletteColor = keyof typeof palette;
