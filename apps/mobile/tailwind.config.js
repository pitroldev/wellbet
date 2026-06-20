/**
 * Tailwind config (TW3, exigido pelo NativeWind v4).
 *
 * - Usa o preset de design tokens de @charya/ui-tokens (cores, espaçamento,
 *   tipografia, motion) — mesma fonte da verdade que o admin consome via
 *   Tailwind v4. O preset traz as escalas (brand/neutral/accent/...) e os
 *   aliases `primary`/`accent`.
 * - Adicionamos aqui APENAS aliases semânticos de tom único usados pelos
 *   componentes base do mobile (background/foreground/surface/muted/border/
 *   on-primary), derivados das escalas do pacote — sem inventar cor nova.
 *
 * Lembrete (Orçamento de performance): NativeWind só para estilo ESTÁTICO.
 *
 * @type {import('tailwindcss').Config}
 */
const { charyaPreset } = require("@charya/ui-tokens/tailwind");
const { colors } = require("@charya/ui-tokens");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset"), charyaPreset],
  theme: {
    extend: {
      colors: {
        // Tons únicos semânticos (mobile) derivados das escalas da marca.
        background: colors.neutral[950],
        surface: colors.neutral[900],
        foreground: colors.neutral[50],
        muted: colors.neutral[400],
        border: colors.neutral[800],
        "on-primary": colors.neutral[50],
      },
    },
  },
  plugins: [],
};
