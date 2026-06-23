/**
 * Registry of the CHARYA design systems.
 * Shared by the playground hub. Demo routes live at /systems/<slug>.
 * Agents: READ this file, do not edit it.
 */
export type DesignSystem = {
  index: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  /** 4 representative swatches (hex) for the hub card. */
  swatches: string[];
  /** Hub card hint colors. */
  cardBg: string;
  cardFg: string;
};

export const SYSTEMS: DesignSystem[] = [
  {
    index: "01",
    slug: "neo-arcade",
    name: "Neo-Arcade",
    tagline: "A nostalgia do fliperama, a seriedade do dinheiro.",
    description:
      "Pixel-art como linguagem de recompensa — navegação limpa, conquista 8-bit. Conecta o público jovem sem virar cassino.",
    swatches: ["#6D28D9", "#22E06B", "#FFD60A", "#120A24"],
    cardBg: "#120A24",
    cardFg: "#EDE9FE",
  },
  {
    index: "02",
    slug: "iso-gacha",
    name: "Iso-Gacha",
    tagline: "Seu esforço, em 3D, na palma da mão.",
    description:
      "Profundidade isométrica tátil para roleta, drops, troféus e shields. Colecionável e fofo — a antítese do slot machine.",
    swatches: ["#6E2BE0", "#00D97E", "#FFC93C", "#FF6B6B"],
    cardBg: "#F4F1FA",
    cardFg: "#2E1065",
  },
  {
    index: "03",
    slug: "glow-comportamental",
    name: "Glow Comportamental",
    tagline: "O painel do seu compromisso.",
    description:
      "Dark mode sóbrio onde roxo e verde glow servem ao dado: Score, streak, payout. Vibe wearable premium, não festa.",
    swatches: ["#8B5CF6", "#34F5A0", "#FF5470", "#0E0B1A"],
    cardBg: "#0E0B1A",
    cardFg: "#EDEAF7",
  },
  // {
  //   index: "04",
  //   slug: "holografico",
  //   name: "Holográfico",
  //   tagline: "Aposte no seu upgrade.",
  //   description:
  //     "Futuro luminoso: foil holográfico, iridescência roxo↔verde↔ciano e vidro fosco. Cartões que brilham ao inclinar; green em flash iridescente.",
  //   swatches: ["#B026FF", "#39FF14", "#22D3EE", "#0A0A12"],
  //   cardBg: "#0A0A12",
  //   cardFg: "#F2F2FA",
  // },
];

/** Total number of design systems. */
export const SYSTEM_COUNT = SYSTEMS.length;
