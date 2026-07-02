/**
 * Tailwind config (TW3, exigido pelo NativeWind v4) — TEMA CHAMA VIOLETA.
 *
 * Premium escuro com glow: grounds em ink-petróleo, superfícies de VIDRO
 * translúcido, CANTOS GENEROSOS (radius 14→34), Outfit nas manchetes e Geist Mono
 * nos números. Em vez de reescrever `className` em toda tela, OVERRIDAMOS aqui os
 * aliases semânticos que as telas já usam (`bg-background`, `text-foreground`,
 * `text-muted`, `border-border`, `bg-primary-600`, `text-on-primary`, …). Assim a
 * marca propaga sozinha.
 *
 * Mantemos o `charyaPreset` por baixo (espaçamento, motion, escalas neutras) —
 * trocamos COR, TIPOGRAFIA e RAIO. O `@charya/ui-tokens` (sóbrio) segue intocado
 * e serve o admin; este tema é local a este app.
 *
 * IMPORTANTE: esta paleta é o espelho de src/theme/arena.ts — mantenha os dois
 * em sincronia.
 *
 * Lembrete (Orçamento de performance): NativeWind só para estilo ESTÁTICO.
 *
 * @type {import('tailwindcss').Config}
 */
const { charyaPreset } = require("@charya/ui-tokens/tailwind");

// Paleta espelhada de src/theme/arena.ts (mantenha os dois em sincronia).
const A = {
  void: "#050D13",
  ink: "#08161E",
  surface: "#0E202B",
  surfaceElevated: "#132836",
  line: "#1B3A4D",
  paper: "#FAFBFC",
  paperInk: "#08161E",
  paperMute: "#53626E",
  paperLine: "#E2E7EB",
  violet: "#5032FC",
  violetDeep: "#3D22D6",
  violetSoft: "#9D8FFF",
  blue: "#4A96FF",
  cyan: "#3EC0FF",
  green: "#41FFCA",
  greenDeep: "#10B981",
  mint: "#7BFFDC",
  greenText: "#047857",
  greenInk: "#0A2920",
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",
  white: "#FFFFFF",
  fog: "#B0C4D4",
  fogMute: "#7D93A4",
  // Translúcidos (frosted).
  glass: "rgba(255,255,255,0.045)",
  glassStrong: "rgba(255,255,255,0.07)",
  hairline: "rgba(255,255,255,0.10)",
  hairlineStrong: "rgba(255,255,255,0.18)",
};

// Escala violeta (alias `primary`) — para `bg-primary-600`, `text-primary-400`.
// 300 = violetSoft · 500 = violet · 600 = violetDeep.
const violet = {
  50: "#EEEBFF",
  100: "#DFD9FF",
  200: "#C5B8FF",
  300: "#9D8FFF",
  400: "#7A62FF",
  500: "#5032FC",
  600: "#3D22D6",
  700: "#311BAE",
  800: "#271689",
  900: "#1E1166",
  950: "#120A40",
};

// Escala azul/ciano (alias `accent`) — família dos assets 3D. 400 = cyan · 500 = blue.
const blue = {
  50: "#EBF7FF",
  100: "#D6EFFF",
  200: "#ADE0FF",
  300: "#6ECCFB",
  400: "#3EC0FF",
  500: "#4A96FF",
  600: "#2F79E6",
  700: "#2560BE",
  800: "#1F4C94",
  900: "#1B3D73",
  950: "#102540",
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset"), charyaPreset],
  theme: {
    extend: {
      colors: {
        // Aliases semânticos (mobile) — apontam para o tema Chama Violeta.
        background: A.ink,
        surface: A.surface,
        "surface-elevated": A.surfaceElevated,
        foreground: A.white,
        muted: A.fog,
        "muted-foreground": A.fogMute,
        border: A.line,
        // Texto sobre o bloco PRIMÁRIO (violeta chapado) = branco (nunca ink).
        "on-primary": A.white,
        danger: A.danger,

        // Superfície CLARA ocasional (ritmo claro/escuro).
        paper: A.paper,
        "paper-ink": A.paperInk,
        "paper-mute": A.paperMute,

        // Primária/acento da marca (escalas completas para `-50…-950`).
        primary: violet,
        accent: blue,

        // Cores nomeadas — para realces explícitos
        // (`bg-arena-violet`, `text-arena-green`, `bg-arena-glass`, …).
        arena: {
          void: A.void,
          ink: A.ink,
          surface: A.surface,
          "surface-elevated": A.surfaceElevated,
          line: A.line,
          paper: A.paper,
          "paper-ink": A.paperInk,
          "paper-mute": A.paperMute,
          "paper-line": A.paperLine,
          violet: A.violet,
          "violet-deep": A.violetDeep,
          "violet-soft": A.violetSoft,
          blue: A.blue,
          cyan: A.cyan,
          green: A.green,
          "green-deep": A.greenDeep,
          mint: A.mint,
          "green-text": A.greenText,
          "green-ink": A.greenInk,
          danger: A.danger,
          "danger-deep": A.dangerDeep,
          white: A.white,
          fog: A.fog,
          "fog-mute": A.fogMute,
          glass: A.glass,
          "glass-strong": A.glassStrong,
          hairline: A.hairline,
          "hairline-strong": A.hairlineStrong,
        },
      },
      // Famílias por papel (ver src/theme/fonts.ts). Cada peso é uma família
      // própria; escolha a família explícita em vez de `font-bold`.
      fontFamily: {
        sans: ["PlusJakartaSans_500Medium"],
        "sans-semibold": ["PlusJakartaSans_600SemiBold"],
        "sans-bold": ["PlusJakartaSans_700Bold"],
        "sans-extra": ["PlusJakartaSans_800ExtraBold"],
        display: ["Outfit_800ExtraBold"],
        "display-black": ["Outfit_900Black"],
        "display-bold": ["Outfit_700Bold"],
        "display-semibold": ["Outfit_600SemiBold"],
        mono: ["GeistMono_400Regular"],
        "mono-medium": ["GeistMono_500Medium"],
        "mono-bold": ["GeistMono_700Bold"],
      },
      // CANTOS GENEROSOS — a forma é macia. `rounded-2xl`=28, `-3xl`=34.
      borderRadius: {
        none: "0px",
        sm: "10px",
        DEFAULT: "14px",
        md: "14px",
        lg: "18px",
        xl: "22px",
        "2xl": "28px",
        "3xl": "34px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
