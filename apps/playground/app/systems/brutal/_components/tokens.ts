/**
 * Brutalista / Terminal — tokens derivados da marca oficial (lib/brand).
 * Neo-brutalismo: blocos CHAPADOS, bordas DURAS, sombras SÓLIDAS offset (sem blur),
 * mono em todo lugar. Reutiliza a paleta oficial C. Agentes: tokens próprios da rota.
 */
import { C, brl, brl0, odd, pct, seeded } from "@/lib/brand";

export const B = {
  // ground de papel
  paper: C.paper, // #FAFBFC
  white: C.white,

  // tinta — bordas, sombras, texto
  ink: C.ink, // #08161E

  // blocos chapados (reutiliza C)
  magenta: C.magenta, // #FF00FF
  green: C.green, // #41FFCA
  blue: C.blue, // #3945FF
  pink: C.pink, // #FF80E1
  indigo: C.indigo, // #3215AD

  // texto-sobre: o ink vira o "preto" universal; usamos branco só sobre escuro
  onMagenta: "#FFFFFF",
  onGreen: C.ink,
  onBlue: "#FFFFFF",
  onPink: C.ink,
  onIndigo: "#FFFFFF",
} as const;

/** Borda dura padrão (3px solid ink). */
export const BORDER = `3px solid ${B.ink}`;
export const BORDER_THIN = `2px solid ${B.ink}`;

/** Sombra sólida offset (sem blur). N = deslocamento em px. */
export const shadow = (n = 6, color: string = B.ink) =>
  `${n}px ${n}px 0 ${color}`;

/** Sombra "afundada": deslocamento menor (o estado pressionado). */
export const SHADOW = shadow(6);
export const SHADOW_SM = shadow(4);
export const SHADOW_PRESSED = shadow(2);

/**
 * Tween MECÂNICO e SECO — nunca spring nos botões. Snappy, não bouncy.
 * O botão "afunda" no clique (translate no sentido da sombra; sombra encolhe).
 */
export const TWEEN = { duration: 0.1, ease: [0.2, 0, 0, 1] } as const;
export const TWEEN_FAST = { duration: 0.08, ease: "easeOut" } as const;

/** Stamp que BATE na tela — tween duro, multi-keyframe (NUNCA spring). */
export const STAMP_TWEEN = {
  duration: 0.42,
  ease: [0.34, 1.3, 0.64, 1] as [number, number, number, number],
  times: [0, 0.55, 0.78, 1] as number[],
};

export { brl, brl0, odd, pct, seeded };
