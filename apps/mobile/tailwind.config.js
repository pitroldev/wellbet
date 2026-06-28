/**
 * Tailwind config (TW3, exigido pelo NativeWind v4) — TEMA GYMBET ARENA.
 *
 * O app de consumidor adotou a direção visual `gymbet-arena`: navy escuro,
 * magenta neon, gradiente competitivo, números em mono. Em vez de reescrever
 * `className` em toda tela, OVERRIDAMOS aqui os aliases semânticos que as telas
 * já usam (`bg-background`, `text-foreground`, `text-muted`, `border-border`,
 * `bg-primary-600`, `text-on-primary`, …) para apontarem às cores da Arena.
 * Assim a mudança de marca propaga sozinha.
 *
 * Mantemos o `charyaPreset` por baixo (espaçamento, raios, motion, escalas
 * neutras) — só trocamos COR e TIPOGRAFIA. O `@charya/ui-tokens` (sóbrio) segue
 * intocado e continua servindo o admin; a Arena é local a este app.
 *
 * Lembrete (Orçamento de performance): NativeWind só para estilo ESTÁTICO.
 *
 * @type {import('tailwindcss').Config}
 */
const { charyaPreset } = require("@charya/ui-tokens/tailwind");

// Paleta da Arena espelhada de src/theme/arena.ts (mantenha os dois em sincronia).
const A = {
  navy: "#0B1226",
  navySoft: "#151D3A",
  navyLine: "#232C50",
  ink: "#08161E",
  magenta: "#FF00FF",
  magentaDeep: "#C800D6",
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3215AD",
  green: "#41FFCA",
  greenDeep: "#18B488",
  greenInk: "#0A2920",
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",
  white: "#FFFFFF",
  fog: "#B9C0E0",
  fogMute: "#7A85B5",
};

// Escala magenta (alias `primary`) — para `bg-primary-600`, `text-primary-400`.
const magenta = {
  50: "#FFE9FF",
  100: "#FFD1FF",
  200: "#FFA3FF",
  300: "#FF6BFF",
  400: "#FF3DFF",
  500: "#FF00FF",
  600: "#E600EC",
  700: "#C800D6",
  800: "#A100B0",
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
        // Aliases semânticos (mobile) — agora APONTAM PARA A ARENA.
        background: A.navy,
        surface: A.navySoft,
        "surface-elevated": A.navyLine,
        foreground: A.white,
        muted: A.fog,
        "muted-foreground": A.fogMute,
        border: A.navyLine,
        "on-primary": A.white,

        // Primária/acento da marca (escalas completas para `-50…-950`).
        primary: magenta,
        accent: pink,

        // Cores nomeadas da Arena — para realces explícitos
        // (`bg-arena-navy-soft`, `text-arena-magenta`, `text-arena-green`, …).
        arena: {
          navy: A.navy,
          "navy-soft": A.navySoft,
          "navy-line": A.navyLine,
          ink: A.ink,
          magenta: A.magenta,
          "magenta-deep": A.magentaDeep,
          purple: A.purple,
          "purple-deep": A.purpleDeep,
          indigo: A.indigo,
          green: A.green,
          "green-deep": A.greenDeep,
          "green-ink": A.greenInk,
          pink: A.pink,
          "pink-pale": A.pinkPale,
          white: A.white,
          fog: A.fog,
          "fog-mute": A.fogMute,
        },
      },
      // Famílias por papel (ver src/theme/fonts.ts). Cada peso é uma família
      // própria; escolha a família explícita em vez de `font-bold`.
      fontFamily: {
        sans: ["PlusJakartaSans_500Medium"],
        "sans-semibold": ["PlusJakartaSans_600SemiBold"],
        "sans-bold": ["PlusJakartaSans_700Bold"],
        "sans-extra": ["PlusJakartaSans_800ExtraBold"],
        display: ["Archivo_900Black"],
        "display-italic": ["Archivo_900Black_Italic"],
        archivo: ["Archivo_800ExtraBold"],
        mono: ["GeistMono_500Medium"],
        "mono-bold": ["GeistMono_600SemiBold"],
      },
    },
  },
  plugins: [],
};
