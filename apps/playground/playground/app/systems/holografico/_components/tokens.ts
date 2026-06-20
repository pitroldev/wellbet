/**
 * HOLOGRÁFICO — tokens de marca.
 * Futuro LUMINOSO (não distópico): vidro fosco translúcido sobre escuro neutro,
 * iridescência que desliza roxo↔verde↔ciano (foil), flares de luz.
 * Verde = green/ganho. Roxo + verde = marca CHARYA. Sem cassino barato.
 */

export const HOLO = {
  bg: "#0A0A12", // escuro neutro
  surface: "#12121E", // vidro fosco (translúcido por cima)
  surfaceSoft: "#1A1A2B",
  ink: "#F2F2FA", // texto principal (AA sobre vidro)
  inkSoft: "#A6A6C8", // texto de apoio
  inkFaint: "#5B5B7E",
  purple: "#A855F7", // iridescente — violeta
  indigo: "#818CF8", // iridescente — periwinkle (ponte violeta↔ciano)
  green: "#34F5A0", // iridescente — menta / GREEN
  cyan: "#22D3EE", // iridescente — ciano
  line: "rgba(168, 85, 247, 0.16)",
  red: "#FF5470", // risco — sem humilhar
} as const;

/** Gradiente foil iridescente — espectro frio coeso (violeta→periwinkle→ciano→menta). */
export const FOIL =
  "linear-gradient(115deg,#A855F7 0%,#818CF8 20%,#22D3EE 44%,#34F5A0 64%,#22D3EE 82%,#A855F7 100%)";

/** Gradiente foil cônico (para shimmer girando). */
export const FOIL_CONIC =
  "conic-gradient(from 0deg,#A855F7,#818CF8,#22D3EE,#34F5A0,#22D3EE,#818CF8,#A855F7)";

/** Spring padrão (apenas 2 valores from→to). */
export const SPRING = { type: "spring", stiffness: 420, damping: 30 } as const;
export const SPRING_POP = {
  type: "spring",
  stiffness: 600,
  damping: 18,
} as const;

/** Formata BRL: 1234.5 -> "1.234,50". */
export function brl(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

/** Formata cotação: 2.4 -> "2,40". */
export function odd(n: number): string {
  return n.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}
