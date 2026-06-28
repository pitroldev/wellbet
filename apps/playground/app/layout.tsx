import type { Metadata } from "next";
import { Fraunces, Plus_Jakarta_Sans, Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";

/** Serifa display de alto contraste — o "muma". Eixos SOFT/WONK para o ar fashion. */
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  display: "swap",
});

/** Sans da casa — UI, corpo, labels. */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

/** Manchetes caixa-alta esportivas (GymBet) e tickers fortes. */
const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  display: "swap",
});

/** Números: odds, stake, payout, contadores. */
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "wellbet & Co. — Playground",
  description:
    "Cinco direções de design para o ecossistema wellbet & Co. (WellBet + GymBet). Mudanças reais acontecem quando existe algo em jogo.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${fraunces.variable} ${jakarta.variable} ${archivo.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
