import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Anton, Archivo, Space_Mono } from "next/font/google";
import "./globals.css";

/**
 * Fontes da direção SPORTSBOOK BRUTAL (placar / cartaz de boxe / bilhete de
 * aposta). Mantemos os MESMOS nomes de CSS var do tema antigo
 * (--font-archivo / --font-jakarta / --font-geist-mono) para re-fontar todos os
 * componentes sem tocar cada um:
 *  - Anton → manchetes condensadas pesadíssimas em caixa-alta (era "archivo").
 *  - Archivo → corpo / UI, grotesca de trabalho (era "jakarta").
 *  - Space Mono → odds, stake, payout, labels, contadores — DNA de bilhete (era "geist-mono").
 */
const jakarta = Archivo({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const archivo = Anton({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-archivo",
  display: "swap",
});
const geistMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://wellbet.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "WellBet — Aposte na sua transformação",
    template: "%s · WellBet",
  },
  description:
    "A única aposta em que você torce para você ganhar. Coloque dinheiro real em jogo na sua própria meta de peso — porque você muda quando existe algo de verdade em jogo.",
  applicationName: "WellBet",
  keywords: [
    "WellBet",
    "aposta em si mesmo",
    "perder peso",
    "emagrecer com compromisso",
    "contrato de compromisso",
    "transformação",
    "fitness",
    "saúde",
  ],
  authors: [{ name: "WellBet" }],
  creator: "WellBet",
  publisher: "WellBet Saúde e Bem-Estar",
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: siteUrl,
    siteName: "WellBet",
    title: "WellBet — Aposte na sua transformação",
    description:
      "A única aposta em que você torce para você ganhar. Coloque dinheiro real em jogo na sua própria meta e mude quando existe algo de verdade em jogo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "WellBet — Aposte na sua transformação",
    description: "A única aposta em que você torce para você ganhar. Comprometa-se. Evolua. Ganhe.",
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#F1EFE9",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="pt-BR" className={`${jakarta.variable} ${archivo.variable} ${geistMono.variable}`}>
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
