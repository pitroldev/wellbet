/**
 * Tailwind config (TW3, exigido pelo NativeWind v4) — TEMA SPORTSBOOK BRUTAL.
 *
 * O app de consumidor adotou a direção da landing WellBet: ground escuro, blocos
 * CHAPADOS de magenta (sem gradiente/glow no dia a dia), CANTO VIVO (radius ~0),
 * Anton nas manchetes e Space Mono nos números. Em vez de reescrever `className`
 * em toda tela, OVERRIDAMOS aqui os aliases semânticos que as telas já usam
 * (`bg-background`, `text-foreground`, `text-muted`, `border-border`,
 * `bg-primary-600`, `text-on-primary`, …). Assim a marca propaga sozinha.
 *
 * Mantemos o `charyaPreset` por baixo (espaçamento, motion, escalas neutras) —
 * trocamos COR, TIPOGRAFIA e RAIO. O `@charya/ui-tokens` (sóbrio) segue intocado
 * e serve o admin; este tema é local a este app.
 *
 * Lembrete (Orçamento de performance): NativeWind só para estilo ESTÁTICO.
 *
 * @type {import('tailwindcss').Config}
 */
const { charyaPreset } = require("@charya/ui-tokens/tailwind");

// Paleta espelhada de src/theme/arena.ts (mantenha os dois em sincronia).
const A = {
  navy: "#0A0D16",
  navySoft: "#1C1A2C",
  navyLine: "#2C2548",
  ink: "#06070D",
  paper: "#F1EFE9",
  paperInk: "#0A0D16",
  paperMute: "#565163",
  magenta: "#FF00FF",
  magentaDeep: "#C026D3",
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3215AD",
  green: "#41FFCA",
  greenDeep: "#10B981",
  greenText: "#047857",
  greenInk: "#04231A",
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",
  white: "#FFFFFF",
  fog: "#AAA2C8",
  fogMute: "#8B84A6",
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
        // Aliases semânticos (mobile) — apontam para o tema brutal.
        background: A.navy,
        surface: A.navySoft,
        "surface-elevated": A.navyLine,
        foreground: A.white,
        muted: A.fog,
        "muted-foreground": A.fogMute,
        border: A.navyLine,
        // Texto sobre o bloco PRIMÁRIO (magenta chapado) = ink, não branco.
        "on-primary": A.ink,
        danger: A.danger,

        // Superfície CLARA ocasional (ritmo claro/escuro).
        paper: A.paper,
        "paper-ink": A.paperInk,
        "paper-mute": A.paperMute,

        // Primária/acento da marca (escalas completas para `-50…-950`).
        primary: magenta,
        accent: pink,

        // Cores nomeadas — para realces explícitos
        // (`bg-arena-magenta`, `text-arena-green`, `text-arena-green-text`, …).
        arena: {
          navy: A.navy,
          "navy-soft": A.navySoft,
          "navy-line": A.navyLine,
          ink: A.ink,
          paper: A.paper,
          "paper-ink": A.paperInk,
          "paper-mute": A.paperMute,
          magenta: A.magenta,
          "magenta-deep": A.magentaDeep,
          purple: A.purple,
          "purple-deep": A.purpleDeep,
          indigo: A.indigo,
          green: A.green,
          "green-deep": A.greenDeep,
          "green-text": A.greenText,
          "green-ink": A.greenInk,
          pink: A.pink,
          "pink-pale": A.pinkPale,
          danger: A.danger,
          "danger-deep": A.dangerDeep,
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
        display: ["Anton_400Regular"],
        mono: ["SpaceMono_400Regular"],
        "mono-bold": ["SpaceMono_700Bold"],
      },
      // CANTO VIVO — radius ~0 em tudo (mata rounded-lg/xl/2xl/3xl de uma vez).
      // `rounded-full` segue redondo (pontos de status, etc.).
      borderRadius: {
        none: "0px",
        sm: "0px",
        DEFAULT: "0px",
        md: "0px",
        lg: "0px",
        xl: "1px",
        "2xl": "2px",
        "3xl": "2px",
      },
    },
  },
  plugins: [],
};
