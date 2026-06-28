/**
 * RISO — "Risograph / Poster". Tokens derivados da marca oficial (lib/brand).
 * Aqui as cores da marca viram TINTAS de risografia sobre papel creme.
 * Onde duas tintas se sobrepõem -> mix-blend-mode: multiply cria a 3a cor.
 * Agentes: deriva de C, não inventa hex novo (exceto o papel quente).
 */
import { C, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const R = {
  /** ground: papel quente creme (único neutro fora da paleta — a "folha"). */
  paper: "#F3EEE3",
  paperDeep: "#E9E2D2", // sombra de papel / sticker
  paperEdge: "#DAD1BD", // borda picotada / perfuração

  ink: C.ink, // texto preto-azulado

  // TINTAS (cores da marca)
  magenta: C.magenta, // #FF00FF
  blue: C.blue, // #3945FF
  green: C.green, // #41FFCA
  pink: C.pink, // #FF80E1
  indigo: C.indigo, // #3215AD
  greenInk: C.greenInk, // texto sobre verde
} as const;

/** As 5 tintas, em ordem de "edição" — usadas no seletor de paleta e nos overprints. */
export const INKS = [
  { name: "Magenta", hex: R.magenta, note: "tinta 01 · manchete", fg: "#FFFFFF" },
  { name: "Blue", hex: R.blue, note: "tinta 02 · ação", fg: "#FFFFFF" },
  { name: "Green", hex: R.green, note: "tinta 03 · DEU GREEN", fg: R.greenInk },
  { name: "Pink", hex: R.pink, note: "tinta 04 · lúdico", fg: R.ink },
  { name: "Indigo", hex: R.indigo, note: "tinta 05 · sombra", fg: "#FFFFFF" },
  { name: "Ink", hex: R.ink, note: "tinta 06 · texto", fg: "#FFFFFF" },
] as const;

/**
 * Campo de meio-tom (halftone) como background-image: pontos de tinta em grade.
 * `c` = cor da tinta, `size` = passo da grade (px), `dot` = raio relativo (0..1).
 * Determinístico, seguro em render (sem random).
 */
export function halftone(c: string, size = 7, dot = 0.34) {
  const r = (size * dot).toFixed(2);
  return {
    backgroundImage: `radial-gradient(${c} ${r}px, transparent ${(+r + 0.5).toFixed(2)}px)`,
    backgroundSize: `${size}px ${size}px`,
  } as React.CSSProperties;
}

/**
 * Halftone com gradiente de densidade (pontos somem na direita) — barra de "tom".
 * Usa máscara linear para simular o degradê impresso.
 */
export function halftoneBar(c: string, size = 6): React.CSSProperties {
  return {
    ...halftone(c, size, 0.42),
    WebkitMaskImage: "linear-gradient(90deg,#000 0%,#000 55%,transparent 100%)",
    maskImage: "linear-gradient(90deg,#000 0%,#000 55%,transparent 100%)",
  };
}

/** Sombra "sticker/print" — offset duro de tinta, sem blur (estética serigrafia). */
export const PRINT_SHADOW = `4px 4px 0 0 ${R.ink}`;
export const PRINT_SHADOW_SOFT = `3px 3px 0 0 rgba(8,22,30,.22)`;

/** Spring orgânico de "assentar" (só entre 2 valores). */
export const STAMP_SPRING = { type: "spring", stiffness: 520, damping: 17 } as const;
export const SETTLE = { type: "spring", stiffness: 380, damping: 24 } as const;

export { brl, brl0, odd, pct, seeded };
