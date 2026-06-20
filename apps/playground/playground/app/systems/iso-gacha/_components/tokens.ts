/**
 * Iso-Gacha tokens — paleta "brinquedo colecionável", base clara.
 * Tudo aqui é fonte da verdade para swatches e componentes.
 */
export const ISO = {
  base: "#F4F1FA",
  baseDeep: "#E7E1F5",
  purple: "#6E2BE0",
  purpleDeep: "#4A1B96",
  purpleSoft: "#9C6BFF",
  green: "#00D97E",
  greenDeep: "#06A862",
  yellow: "#FFC93C",
  yellowDeep: "#E0A013",
  coral: "#FF6B6B",
  coralDeep: "#D94545",
  ink: "#1B1230",
  inkSoft: "#5B4E78",
} as const;

export type IsoColor = keyof typeof ISO;

/** Sombra SÓLIDA deslocada — a assinatura tátil (sem blur neon). */
export function solidShadow(hex: string, x = 8, y = 10): string {
  return `${x}px ${y}px 0 ${hex}`;
}

/** Spring "gostosa" reaproveitada em toda a demo. */
export const SPRING = { type: "spring" as const, stiffness: 320, damping: 18 };
export const SPRING_SOFT = {
  type: "spring" as const,
  stiffness: 180,
  damping: 20,
};

/** Formata Reais em pt-BR sem libs externas. Ex: 1850 -> "R$ 1.850,00". */
export function brl(value: number, cents = true): string {
  const fixed = Math.abs(value).toFixed(2);
  const [intPart, decPart] = fixed.split(".");
  const withThousands = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  const sign = value < 0 ? "-" : "";
  return cents ? `R$ ${sign}${withThousands},${decPart}` : `R$ ${sign}${withThousands}`;
}

/** Cotação no formato de odds de sportsbook: 2.40x. */
export function odd(value: number): string {
  return `${value.toFixed(2)}x`;
}
