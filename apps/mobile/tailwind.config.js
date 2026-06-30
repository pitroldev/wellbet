/**
 * Tailwind config (TW3, exigido pelo NativeWind v4) — TEMA MIDNIGHT AURORA.
 *
 * Premium escuro com glow: grounds em índigo profundo, superfícies de VIDRO
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
  void: "#080612",
  ink: "#0C0A1C",
  navy: "#0E0B20",
  navySoft: "#181434",
  navyLine: "#2B2552",
  elevate: "#221C46",
  paper: "#F4F1FB",
  paperInk: "#0E0B20",
  paperMute: "#5B5476",
  magenta: "#FF2BD6",
  magentaDeep: "#C026D3",
  orchid: "#B765FF",
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3D1F9E",
  green: "#41FFCA",
  greenDeep: "#10B981",
  mint: "#7BFFDC",
  greenText: "#047857",
  greenInk: "#04231A",
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",
  white: "#FFFFFF",
  fog: "#B7B0DC",
  fogMute: "#8A83B2",
  // Translúcidos (frosted).
  glass: "rgba(255,255,255,0.045)",
  glassStrong: "rgba(255,255,255,0.07)",
  hairline: "rgba(255,255,255,0.10)",
  hairlineStrong: "rgba(255,255,255,0.18)",
};

// Escala magenta (alias `primary`) — para `bg-primary-600`, `text-primary-400`.
const magenta = {
  50: "#FFE9FF",
  100: "#FFD1FF",
  200: "#FFA8F4",
  300: "#FF7BEA",
  400: "#FF4DDF",
  500: "#FF2BD6",
  600: "#E600C0",
  700: "#C200A2",
  800: "#990081",
  900: "#6E0080",
  950: "#3D0048",
};

// Escala rosa (alias `accent`).
const pink = {
  50: "#FFF0FC",
  100: "#FFDFF8",
  200: "#FFC0F2",
  300: "#FF9FEA",
  400: "#FF80E1",
  500: "#F45CD2",
  600: "#D63BB6",
  700: "#AC2A91",
  800: "#822470",
  900: "#5E1A52",
  950: "#360B30",
};

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset"), charyaPreset],
  theme: {
    extend: {
      colors: {
        // Aliases semânticos (mobile) — apontam para o tema Midnight Aurora.
        background: A.navy,
        surface: A.navySoft,
        "surface-elevated": A.elevate,
        foreground: A.white,
        muted: A.fog,
        "muted-foreground": A.fogMute,
        border: A.navyLine,
        // Texto sobre o bloco PRIMÁRIO (magenta chapado) = void escuro.
        "on-primary": A.void,
        danger: A.danger,

        // Superfície CLARA ocasional (ritmo claro/escuro).
        paper: A.paper,
        "paper-ink": A.paperInk,
        "paper-mute": A.paperMute,

        // Primária/acento da marca (escalas completas para `-50…-950`).
        primary: magenta,
        accent: pink,

        // Cores nomeadas — para realces explícitos
        // (`bg-arena-magenta`, `text-arena-green`, `bg-arena-glass`, …).
        arena: {
          void: A.void,
          ink: A.ink,
          navy: A.navy,
          "navy-soft": A.navySoft,
          "navy-line": A.navyLine,
          elevate: A.elevate,
          paper: A.paper,
          "paper-ink": A.paperInk,
          "paper-mute": A.paperMute,
          magenta: A.magenta,
          "magenta-deep": A.magentaDeep,
          orchid: A.orchid,
          purple: A.purple,
          "purple-deep": A.purpleDeep,
          indigo: A.indigo,
          green: A.green,
          "green-deep": A.greenDeep,
          mint: A.mint,
          "green-text": A.greenText,
          "green-ink": A.greenInk,
          pink: A.pink,
          "pink-pale": A.pinkPale,
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
      // CANTOS GENEROSOS — Midnight Aurora é macio. `rounded-2xl`=28, `-3xl`=34.
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
