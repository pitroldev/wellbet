/**
 * MIDNIGHT AURORA — direção visual do app WellBet (consumidor).
 *
 * Premium escuro com brilho neon suave: grounds em índigo profundo (não preto
 * morto), superfícies de VIDRO translúcido sobre uma aurora animada, cantos
 * generosos, e a assinatura magenta→violeta→índigo nos gradientes. Dopamina vem
 * de LUZ, GLOW e MOVIMENTO — nunca de sombra RN (que vira cinza no Android).
 *
 * Por que viver AQUI e não em `@charya/ui-tokens`: aquele pacote é compartilhado
 * com o admin e codifica DELIBERADAMENTE a marca sóbria. Este override é LOCAL ao
 * app de consumidor.
 *
 * Uso: valores crus (hex/rgba) para estilo IMPERATIVO — Skia, Reanimated, props
 * nativas que não aceitam className. O estilo estático vem das classes do
 * NativeWind (ver tailwind.config.js, espelho desta paleta — mantenha em sincronia).
 */

/** Paleta MIDNIGHT AURORA. */
export const arena = {
  // Grounds — índigo profundo, com vida (não preto chapado).
  void: "#080612", // ground mais fundo do app (atrás da aurora)
  ink: "#0C0A1C", // poços (inputs/trilhos), mais fundo que o ground
  navy: "#0E0B20", // background do app
  navySoft: "#181434", // cartões / surface
  navyLine: "#2B2552", // bordas / hairlines opacas
  elevate: "#221C46", // surface elevada / segmento pressionado

  // Papel — superfície CLARA ocasional (ritmo claro/escuro).
  paper: "#F4F1FB",
  paperInk: "#0E0B20", // texto sobre papel
  paperMute: "#5B5476", // texto secundário sobre papel

  // Primária da marca (eletricidade — usada sobretudo em gradiente/realce/glow).
  magenta: "#FF2BD6",
  magentaDeep: "#C026D3", // magenta legível como TEXTO sobre papel (AA)
  orchid: "#B765FF", // magenta-violeta suave (acentos de UI secundários)

  // Roxo / índigo — profundidade dos gradientes da assinatura.
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3D1F9E",

  // Vitória / "green" / jackpot.
  green: "#41FFCA",
  greenDeep: "#10B981",
  mint: "#7BFFDC", // verde suave para texto/realce sobre escuro
  greenText: "#047857", // verde legível como TEXTO sobre papel (AA)
  greenInk: "#04231A",

  // Acentos rosa.
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",

  // Erro / perigo — vermelho-neon que harmoniza com magenta/pink.
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",

  // Texto sobre escuro.
  white: "#FFFFFF",
  fog: "#B7B0DC", // secundário
  fogMute: "#8A83B2", // terciário
} as const;

export type ArenaColor = keyof typeof arena;

/**
 * Tokens TRANSLÚCIDOS (rgba) — a alma do "frosted". Vidro = branco a baixa opacidade
 * sobre a aurora; hairlines = bordas de 1px que captam a luz; washes = tinta de cor
 * difusa atrás de chips/realces.
 */
export const arenaAlpha = {
  glass: "rgba(255,255,255,0.045)", // preenchimento de card frosted
  glassStrong: "rgba(255,255,255,0.07)", // card de herói
  glassPressed: "rgba(255,255,255,0.10)",
  hairline: "rgba(255,255,255,0.10)", // borda de 1px padrão
  hairlineStrong: "rgba(255,255,255,0.18)",

  magentaWash: "rgba(255,43,214,0.16)",
  magentaGlow: "rgba(255,43,214,0.55)",
  orchidWash: "rgba(183,101,255,0.16)",
  violetWash: "rgba(124,58,237,0.18)",
  greenWash: "rgba(65,255,202,0.14)",
  greenGlow: "rgba(65,255,202,0.5)",
  dangerWash: "rgba(255,77,109,0.16)",

  scrim: "rgba(8,6,18,0.55)", // véu sobre mídia (legibilidade)
  whiteSoft: "rgba(255,255,255,0.08)",
} as const;

/** Escala de raio (px) — cantos generosos. Espelha o `borderRadius` do Tailwind. */
export const radius = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 22,
  xl: 28,
  "2xl": 34,
  pill: 999,
} as const;

/**
 * Stops de gradiente para `expo-linear-gradient` e Skia. A assinatura da marca
 * (magenta→violeta→índigo) é montada com estes arrays. Use `start={{x:0,y:0}}
 * end={{x:1,y:1}}` (≈125°) salvo indicação.
 */
export const gradients = {
  /** Assinatura: magenta → roxo → índigo (botão primário, realces). */
  gymbet: ["#FF2BD6", "#7A1BD6", "#3D1F9E"] as readonly [string, string, string],
  /** Variante clara (texto/realce). */
  gymbetSoft: ["#FF80E1", "#B765FF", "#7A1BD6"] as readonly [string, string, string],
  /** Base do app — índigo → void (fundo vertical da aurora). */
  aurora: ["#1A1142", "#0E0B20", "#080612"] as readonly [string, string, string],
  /** Anel de progresso (sweep magenta→orquídea→verde). */
  ring: ["#FF2BD6", "#B765FF", "#41FFCA"] as readonly [string, string, string],
  /** Brilho de topo do vidro (sheen). */
  glassSheen: ["rgba(255,255,255,0.12)", "rgba(255,255,255,0.0)"] as readonly [string, string],
  /** Hairline gradiente (borda viva de cards de herói). */
  hairline: [
    "rgba(255,43,214,0.55)",
    "rgba(124,58,237,0.35)",
    "rgba(65,255,202,0.45)",
  ] as readonly [string, string, string],
  /** Jackpot / celebração. */
  jackpot: ["#FF2BD6", "#FF80E1", "#41FFCA"] as readonly [string, string, string],
  /** Vitória (green). */
  victory: ["#41FFCA", "#10B981"] as readonly [string, string],
} as const;

export type GradientName = keyof typeof gradients;

/**
 * Elevação NEUTRA suave para cartões (sombra preta discreta — nunca sombra
 * COLORIDA, que vira cinza no Android). Espalhe num `style={{ ...glow.card }}`.
 * Use com parcimônia; a profundidade principal vem do vidro + aurora + hairline.
 */
export const glow = {
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 14 },
    elevation: 6,
  },
} as const;
