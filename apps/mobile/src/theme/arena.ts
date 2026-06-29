/**
 * Sportsbook Brutal — paleta da direção visual do app, alinhada à landing
 * WellBet (Anton + Space Mono, blocos CHAPADOS de magenta, canto vivo, ritmo
 * claro/escuro). O nome do módulo segue "arena" por compatibilidade de imports.
 *
 * Por que viver AQUI e não em `@charya/ui-tokens`: aquele pacote é compartilhado
 * com o admin e codifica DELIBERADAMENTE a marca sóbria. Este override é LOCAL ao
 * app de consumidor; o admin (console interno de revisão) segue sóbrio.
 *
 * Uso: valores crus (hex) para estilo IMPERATIVO — Skia, Reanimated, props
 * nativas que não aceitam className. O estilo estático vem das classes do
 * NativeWind (ver tailwind.config.js, que deriva os aliases semânticos destas
 * cores). `gradients`/`glow` abaixo ficam SÓ para o momento de celebração
 * (reward/"deu green") — o resto da UI é flat/brutal.
 */

/** Paleta SPORTSBOOK BRUTAL (alinhada à landing WellBet). */
export const arena = {
  // Grounds escuros (família dark da landing — ink/navy)
  navy: "#0A0D16", // ground principal (background) — landing --color-ink
  navySoft: "#1C1A2C", // cartões / surface — landing --color-navy-soft
  navyLine: "#2C2548", // bordas — landing --color-navy-line
  ink: "#06070D", // poços (inputs/trilhos), mais fundo que o ground

  // Papel — superfície CLARA ocasional (ritmo claro/escuro do brutal)
  paper: "#F1EFE9",
  paperInk: "#0A0D16", // texto sobre papel
  paperMute: "#565163", // texto secundário sobre papel

  // Primária
  magenta: "#FF00FF",
  magentaDeep: "#C026D3", // magenta legível como TEXTO sobre papel (AA)

  // Roxo / indigo (só profundidade de gradiente — momento de celebração/reward)
  purple: "#7A1BD6",
  purpleDeep: "#5A12A0",
  indigo: "#3215AD",

  // Vitória / jackpot
  green: "#41FFCA",
  greenDeep: "#10B981",
  greenText: "#047857", // verde legível como TEXTO sobre papel (AA)
  greenInk: "#04231A",

  // Acentos rosa
  pink: "#FF80E1",
  pinkPale: "#FDC0FF",

  // Erro / perigo — vermelho-neon que lê bem sobre escuro e harmoniza com
  // magenta/pink (a marca não tem dourado/vermelho de aposta barata).
  danger: "#FF4D6D",
  dangerDeep: "#E23A57",

  // Texto sobre escuro
  white: "#FFFFFF",
  fog: "#AAA2C8", // secundário (landing --color-fog)
  fogMute: "#8B84A6", // terciário (landing --color-fog-mute)
} as const;

export type ArenaColor = keyof typeof arena;

/** Versões translúcidas usadas em washes/realces (rgba para sobrepor no navy). */
export const arenaAlpha = {
  magentaWash: "rgba(255,0,255,0.12)",
  magentaGlow: "rgba(255,0,255,0.55)",
  greenWash: "rgba(65,255,202,0.12)",
  greenGlow: "rgba(65,255,202,0.5)",
  whiteSoft: "rgba(255,255,255,0.08)",
  whiteLine: "rgba(255,255,255,0.14)",
} as const;

/**
 * Stops de gradiente para `expo-linear-gradient`. O RN não tem gradiente CSS;
 * a assinatura da marca (botão/realce magenta→roxo→indigo) é montada com estes
 * arrays. Use `start={{x:0,y:0}} end={{x:1,y:1}}` (≈125°) salvo indicação.
 */
export const gradients = {
  /** Assinatura GymBet: magenta → roxo → indigo. */
  gymbet: ["#FF00FF", "#7A1BD6", "#3215AD"] as readonly [string, string, string],
  /** Variante clara (texto/realce). */
  gymbetSoft: ["#FF00FF", "#FDC0FF", "#7A1BD6"] as readonly [string, string, string],
  /** Jackpot/celebração. */
  jackpot: ["#FF00FF", "#FF80E1", "#41FFCA"] as readonly [string, string, string],
  /** Vitória (green). */
  victory: ["#41FFCA", "#18B488"] as readonly [string, string],
} as const;

export type GradientName = keyof typeof gradients;

/**
 * Presets de "glow" (sombra colorida). Props de sombra do RN — iOS via
 * shadow*, Android via elevation (sombra cinza) + boxShadow colorido na New
 * Architecture quando disponível. Espalhe num `style={{ ...glow.magenta }}`.
 */
export const glow = {
  magenta: {
    shadowColor: "#FF00FF",
    shadowOpacity: 0.55,
    shadowRadius: 22,
    shadowOffset: { width: 0, height: 12 },
    elevation: 16,
  },
  green: {
    shadowColor: "#41FFCA",
    shadowOpacity: 0.5,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 14,
  },
  /** Sombra neutra de elevação (cartões sobre o navy). */
  card: {
    shadowColor: "#000000",
    shadowOpacity: 0.45,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },
} as const;
