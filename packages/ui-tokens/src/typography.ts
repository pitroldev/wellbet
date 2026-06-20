/**
 * Tipografia.
 *
 * Famílias declaradas por PAPEL (não por nome de fonte concreta) para que admin
 * e mobile resolvam a fonte real na sua própria camada (next/font no admin,
 * expo-font no mobile). Sem/serifa humanista e legível reforça o "pessoas reais,
 * limpo" do dossiê — nada de display condensado agressivo de aposta.
 *
 * A família `numeric` existe porque a Charya mostra MUITO número (peso, delta,
 * streak, prêmio): usamos tabular/mono para os dígitos não "dançarem" ao animar.
 */

/** Stacks de fallback — a fonte primária é injetada na frente pelo app. */
export const fontFamily = {
  /** Texto de interface e leitura. */
  sans: ["Inter", "system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
  /** Dígitos/medidas (peso, prêmio) — tabular para não pular ao animar. */
  numeric: ["InterVariable", "ui-monospace", "SFMono-Regular", "Roboto Mono", "monospace"],
} as const;

export type FontFamily = typeof fontFamily;
export type FontFamilyToken = keyof FontFamily;

/**
 * Escala tipográfica: tamanho de fonte + line-height pareados.
 * `[fontSize, lineHeight]` no formato que o Tailwind aceita em `theme.fontSize`.
 */
export const fontSize = {
  xs: ["0.75rem", "1rem"],
  sm: ["0.875rem", "1.25rem"],
  base: ["1rem", "1.5rem"],
  lg: ["1.125rem", "1.75rem"],
  xl: ["1.25rem", "1.75rem"],
  "2xl": ["1.5rem", "2rem"],
  "3xl": ["1.875rem", "2.25rem"],
  "4xl": ["2.25rem", "2.5rem"],
  "5xl": ["3rem", "1"],
  "6xl": ["3.75rem", "1"],
} as const satisfies Record<string, readonly [string, string]>;

export type FontSize = typeof fontSize;
export type FontSizeToken = keyof FontSize;

export const fontWeight = {
  normal: "400",
  medium: "500",
  semibold: "600",
  bold: "700",
} as const;

export type FontWeight = typeof fontWeight;
export type FontWeightToken = keyof FontWeight;

export const letterSpacing = {
  tight: "-0.015em",
  normal: "0",
  wide: "0.025em",
} as const;

export type LetterSpacing = typeof letterSpacing;
export type LetterSpacingToken = keyof LetterSpacing;

export const typography = {
  fontFamily,
  fontSize,
  fontWeight,
  letterSpacing,
} as const;

export type Typography = typeof typography;
