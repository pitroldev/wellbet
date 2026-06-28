/**
 * Registry dos systems do playground — agora ancorados na identidade OFICIAL
 * wellbet & Co. (deck da agência). Cada slug é uma direção visual distinta da MESMA
 * marca. Demo em /systems/<slug>. Veja BRAND.md. Agentes: READ this file, do not edit it.
 */
export type DesignSystem = {
  index: string;
  slug: string;
  name: string;
  /** Produto/mundo da marca que esta direção expressa. */
  world: string;
  tagline: string;
  description: string;
  /** Tema do hub-card. */
  scheme: "light" | "dark";
  /** 4 swatches representativos (hex). */
  swatches: string[];
  /** Cor de fundo e acento do card no hub. */
  cardBg: string;
  cardFg: string;
  accent: string;
};

export const SYSTEMS: DesignSystem[] = [
  {
    index: "01",
    slug: "editorial-muma",
    name: "Editorial",
    world: "Masterbrand · muma",
    tagline: "A melhor aposta é na sua mudança.",
    description:
      "Serifa de alto contraste (muma), pontuação gigante e respiro de revista. Rosa, indigo e ink: a bet como objeto de desejo, fashion-fintech.",
    scheme: "light",
    swatches: ["#FF80E1", "#3215AD", "#41FFCA", "#08161E"],
    cardBg: "#FF80E1",
    cardFg: "#08161E",
    accent: "#3215AD",
  },
  {
    index: "02",
    slug: "wellbet-clean",
    name: "WellBet Clean",
    world: "WellBet · produto",
    tagline: "Sua disciplina agora vale mais.",
    description:
      "O app WellBet de verdade: claro, calmo, confiável. Azul elétrico como primária, menta para o “green”, anel de evolução semanal. Fintech de saúde com polimento de banco.",
    scheme: "light",
    swatches: ["#3945FF", "#41FFCA", "#08161E", "#FAFBFC"],
    cardBg: "#FAFBFC",
    cardFg: "#08161E",
    accent: "#3945FF",
  },
  {
    index: "03",
    slug: "gymbet-arena",
    name: "GymBet Arena",
    world: "GymBet · produto",
    tagline: "Treine. Compita. Fature.",
    description:
      "Arena escura, magenta e roxo, caixa-alta pesada e estilhaços diagonais. Ranking, streak e jackpot no talo — dopamina competitiva máxima.",
    scheme: "dark",
    swatches: ["#FF00FF", "#7A1BD6", "#41FFCA", "#0B1226"],
    cardBg: "#0B1226",
    cardFg: "#FFFFFF",
    accent: "#FF00FF",
  },
  {
    index: "04",
    slug: "voltage",
    name: "Voltage",
    world: "wellbet & Co. · energia",
    tagline: "Sua disciplina, carregada.",
    description:
      "O raio-seta como motivo vivo. Gradiente menta→azul, vidro e iridescência sobre quase-preto. Cinético, elétrico, cada toque solta uma faísca.",
    scheme: "dark",
    swatches: ["#41FFCA", "#3945FF", "#656FFF", "#08161E"],
    cardBg: "#08161E",
    cardFg: "#41FFCA",
    accent: "#41FFCA",
  },
  {
    index: "05",
    slug: "ecossistema",
    name: "Ecossistema",
    world: "wellbet & Co. · OS",
    tagline: "Mudanças reais acontecem quando existe algo em jogo.",
    description:
      "A visão masterbrand: indigo real, o “M” líquido e periwinkle. Um sistema operacional premium que unifica WellBet ↔ GymBet num toque. Instrumentos de dado elegantes.",
    scheme: "dark",
    swatches: ["#3215AD", "#656FFF", "#FF80E1", "#CCD1FF"],
    cardBg: "#3215AD",
    cardFg: "#FFFFFF",
    accent: "#CCD1FF",
  },
  {
    index: "06",
    slug: "brutal",
    name: "Brutalista",
    world: "wellbet & Co. · raw",
    tagline: "Sem firula. Só aposta.",
    description:
      "Neo-brutalismo tipográfico: bordas duras, sombras sólidas (sem blur), mono de terminal e blocos chapados de cor. Interações mecânicas e secas. A bet crua, honesta, com atitude — o oposto do polido.",
    scheme: "light",
    swatches: ["#08161E", "#FF00FF", "#41FFCA", "#3945FF"],
    cardBg: "#FAFBFC",
    cardFg: "#08161E",
    accent: "#FF00FF",
  },
  {
    index: "07",
    slug: "riso",
    name: "Risograph",
    world: "wellbet & Co. · print",
    tagline: "Impressa na sua mudança.",
    description:
      "Estética de risografia: sobreposição de tintas (overprint), meio-tom, grão e pôster de tipo grande. Tátil, analógica, de edição limitada — as mesmas cores agora como tintas de impressão.",
    scheme: "light",
    swatches: ["#FF80E1", "#3945FF", "#41FFCA", "#08161E"],
    cardBg: "#F3EEE3",
    cardFg: "#08161E",
    accent: "#FF00FF",
  },
  {
    index: "08",
    slug: "cassino",
    name: "Cassino Neon",
    world: "wellbet & Co. · casino",
    tagline: "A casa sempre torce por você.",
    description:
      "Cassino neon premium: roleta, cartas, fichas e dados sob luzes de neon magenta/azul sobre feltro verde escuro. Energia de cassino de verdade — mas chique, não cafona.",
    scheme: "dark",
    swatches: ["#FF00FF", "#41FFCA", "#3945FF", "#0B1226"],
    cardBg: "#0B1226",
    cardFg: "#FFFFFF",
    accent: "#41FFCA",
  },
  {
    index: "09",
    slug: "jackpot",
    name: "Jackpot",
    world: "wellbet & Co. · slots",
    tagline: "Puxa a alavanca. Dá green.",
    description:
      "Palácio de caça-níqueis: slot de 3 rolos, roda da fortuna, jackpot progressivo e chuva de moedas com luzes piscando. Dopamina de slot machine no talo — alto e brilhante.",
    scheme: "dark",
    swatches: ["#FF00FF", "#FF80E1", "#41FFCA", "#220C82"],
    cardBg: "#220C82",
    cardFg: "#FFFFFF",
    accent: "#FF00FF",
  },
];

/** Total de systems. */
export const SYSTEM_COUNT = SYSTEMS.length;
