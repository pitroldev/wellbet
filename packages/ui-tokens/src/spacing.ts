/**
 * Espaçamento e raios de borda.
 *
 * Escala em rem-equivalentes numéricos (1 unidade = 0.25rem = 4px), no mesmo
 * espírito da escala padrão do Tailwind, para que admin (rem) e mobile (px via
 * NativeWind) compartilhem a MESMA gramática de espaço.
 *
 * Valores expostos como string com unidade para o preset Tailwind; o NativeWind
 * resolve `rem` para px no runtime do RN, então a unidade é segura nos dois.
 */

export const spacing = {
  px: "1px",
  0: "0",
  0.5: "0.125rem",
  1: "0.25rem",
  1.5: "0.375rem",
  2: "0.5rem",
  2.5: "0.625rem",
  3: "0.75rem",
  3.5: "0.875rem",
  4: "1rem",
  5: "1.25rem",
  6: "1.5rem",
  7: "1.75rem",
  8: "2rem",
  9: "2.25rem",
  10: "2.5rem",
  11: "2.75rem",
  12: "3rem",
  14: "3.5rem",
  16: "4rem",
  20: "5rem",
  24: "6rem",
  28: "7rem",
  32: "8rem",
  40: "10rem",
  48: "12rem",
  56: "14rem",
  64: "16rem",
} as const;

export type Spacing = typeof spacing;
export type SpacingToken = keyof Spacing;

/**
 * Raios de borda. Cantos suaves e generosos = sensação "limpa/premium" do
 * dossiê (nada de cantos duros de painel de aposta). `full` para pílulas/avatar.
 */
export const radii = {
  none: "0",
  sm: "0.25rem",
  md: "0.5rem",
  lg: "0.75rem",
  xl: "1rem",
  "2xl": "1.5rem",
  "3xl": "2rem",
  full: "9999px",
} as const;

export type Radii = typeof radii;
export type RadiusToken = keyof Radii;
