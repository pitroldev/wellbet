/**
 * Preset Tailwind da Charya — expõe os design tokens como `theme`.
 *
 * Um único preset serve os DOIS ambientes:
 *  - ADMIN (Tailwind v4): `tailwind.config.ts` faz `presets: [charyaPreset]`
 *    (ou, no fluxo CSS-first do v4, este objeto alimenta `@config`).
 *  - MOBILE (NativeWind): `tailwind.config.js` faz `presets: [charyaPreset]`
 *    — NativeWind lê o mesmo formato de config do Tailwind.
 *
 * Mantemos o tipo propositalmente leve (sem dependência de `tailwindcss` em
 * tempo de build deste pacote): exportamos um objeto com a forma de um preset.
 * O app tipa o array de presets com o `Config` do seu próprio Tailwind.
 *
 * Identidade (dossiê): "pessoas reais, limpo, sem vibe de aposta barata" — a
 * paleta aqui é sóbria/terrosa de propósito; a recompensa vem do motion.
 */

import { colors } from "./colors.js";
import { radii, spacing } from "./spacing.js";
import { fontFamily, fontSize, fontWeight, letterSpacing } from "./typography.js";
import { durations, easing } from "./motion.js";

/**
 * Forma mínima de um preset Tailwind/NativeWind. Não importamos o tipo `Config`
 * do `tailwindcss` para não acoplar este pacote ao build do Tailwind; o app
 * combina este preset com seu próprio `Config`.
 */
export interface TailwindPreset {
  readonly theme: {
    readonly extend: Record<string, unknown>;
  };
}

/**
 * Tailwind espera `fontSize` como `[size, { lineHeight }]` (ou `[size, lh]`).
 * Nossos tokens guardam `[size, lineHeight]`; convertemos para o shape rico.
 */
const tailwindFontSize = Object.fromEntries(
  Object.entries(fontSize).map(([key, [size, lineHeight]]) => [
    key,
    [size, { lineHeight }] as const,
  ]),
);

/**
 * Preset pronto para `presets: [charyaPreset]`.
 *
 * Usamos `theme.extend` (em vez de sobrescrever `theme`) para preservar os
 * utilitários base do Tailwind/NativeWind e apenas ADICIONAR os tokens da marca
 * — assim `bg-brand-500`, `rounded-2xl`, `duration-base`, `ease-snappy` etc.
 * ficam disponíveis sem perder o resto.
 */
export const charyaPreset: TailwindPreset = {
  theme: {
    extend: {
      colors: {
        ...colors,
        // Aliases semânticos convenientes (primário/acento da marca).
        primary: colors.brand,
        accent: colors.accent,
      },
      spacing,
      borderRadius: radii,
      fontFamily,
      fontSize: tailwindFontSize,
      fontWeight,
      letterSpacing,
      transitionDuration: durations,
      animationDuration: durations,
      transitionTimingFunction: easing,
      // TODO: ao introduzir keyframes de marca (pulse de streak, reveal de
      // prêmio), adicionar `keyframes` + `animation` aqui usando estas mesmas
      // durações/curvas — mantendo motion.ts como fonte única.
    },
  },
};

export default charyaPreset;
