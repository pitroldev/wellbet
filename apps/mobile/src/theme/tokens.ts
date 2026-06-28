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

import { arena } from "./arena";

export { colors, spacing, radii, durationsMs, springs, easing, tokens };
export { arena, arenaAlpha, gradients, glow } from "./arena";
export { fontFamilies, fontMap } from "./fonts";

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
 * nativas — agora na direção GYMBET ARENA (ver src/theme/arena.ts). Os semânticos
 * de veredito (success/danger) seguem das escalas de `@charya/ui-tokens`.
 */
export const palette = {
  primary: arena.magenta,
  primaryDeep: arena.magentaDeep,
  accent: arena.pink,
  success: arena.green,
  danger: colors.danger[500],
  surface: arena.navySoft,
  background: arena.navy,
  foreground: arena.white,
} as const;

export type PaletteColor = keyof typeof palette;
