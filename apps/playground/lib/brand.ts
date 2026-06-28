/**
 * wellbet & Co. — tokens oficiais da marca (amostrados do deck da agência).
 * SSoT de cor/gradiente/helpers. Veja BRAND.md. Cada system deriva o seu tokens.ts
 * destas constantes. Agentes: READ this file, do not edit it.
 */

/** Paleta oficial. */
export const C = {
  ink: "#08161E", // preto-azulado da marca (texto/logo, ground escuro)
  inkSoft: "#3A4750", // texto secundário sobre claro
  inkMute: "#71808A",
  navy: "#0B1226", // ground escuro alternativo
  navySoft: "#151D3A",
  navyLine: "#232C50",

  indigo: "#3215AD", // indigo real — campo do masterbrand / muma
  indigoSoft: "#4B2BD6",
  indigoDeep: "#220C82",

  blue: "#3945FF", // azul elétrico — primária WellBet
  blueDeep: "#2936FF",
  blueSoft: "#656FFF",
  blueWash: "#EEF0FF",

  periwinkle: "#CCD1FF", // superfície indigo clara
  periSoft: "#E4E7FF",

  green: "#41FFCA", // verde menta — o "green"/vitória/saúde
  greenDeep: "#18B488",
  greenInk: "#0A2920", // texto sobre verde
  greenWash: "#E4FFF6",

  magenta: "#FF00FF", // primária GymBet
  magentaDeep: "#C800D6",
  magentaWash: "#FFE9FF",

  pink: "#FF80E1", // rosa "muma"/lúdico
  pinkPale: "#FDC0FF",

  paper: "#FAFBFC", // ground claro
  paperMute: "#EEF0F6",
  line: "#E2E5EE",
  white: "#FFFFFF",
} as const;

/** Gradientes oficiais. */
export const GRADIENT = {
  voltage: "linear-gradient(110deg,#41FFCA 0%,#3945FF 100%)",
  voltageSoft: "linear-gradient(110deg,#41FFCA 0%,#656FFF 100%)",
  gymbet: "linear-gradient(125deg,#FF00FF 0%,#7A1BD6 55%,#3215AD 100%)",
  iris: "linear-gradient(120deg,#3215AD 0%,#3945FF 45%,#656FFF 100%)",
  muma: "linear-gradient(120deg,#FF80E1 0%,#3215AD 100%)",
  jackpot: "linear-gradient(120deg,#FF00FF 0%,#FF80E1 50%,#41FFCA 100%)",
} as const;

/** R$ no padrão pt-BR. Seguro em render (sem Date/random). */
export const brl = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** R$ sem centavos (valores redondos). */
export const brl0 = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

/** Cotação no padrão bet (vírgula): 2.45 -> "2,45". */
export const odd = (n: number) => n.toFixed(2).replace(".", ",");

/** Percentual com sinal: 12 -> "+12%". */
export const pct = (n: number) => `${n > 0 ? "+" : ""}${n}%`;

/** Seed determinística [0,1) por inteiro — substitui Math.random() em render. */
export const seeded = (i: number) => {
  const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
  return x - Math.floor(x);
};
