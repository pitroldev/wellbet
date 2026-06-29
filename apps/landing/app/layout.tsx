import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Sora, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Fontes da direção HOLOGRÁFICO, via next/font. Mantemos os MESMOS nomes de CSS
 * var do tema antigo (--font-archivo / --font-jakarta / --font-geist-mono) para
 * re-fontar todos os componentes sem tocá-los:
 *  - Sora → manchetes geométricas futuristas (era "archivo").
 *  - Space Grotesk → UI/corpo (era "jakarta").
 *  - JetBrains Mono → odds, stake, payout, contadores (era "geist-mono").
 */
const jakarta = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const archivo = Sora({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const geistMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://charya.com.br";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Charya Bet — Aposte na sua transformação",
    template: "%s · Charya Bet",
  },
  description:
    "A única aposta em que você torce para você ganhar. Coloque dinheiro real em jogo na sua própria meta de peso — porque você muda quando existe algo de verdade em jogo.",
  applicationName: "Charya Bet",
  keywords: [
    "Charya Bet",
    "aposta em si mesmo",
    "perder peso",
    "emagrecer com compromisso",
    "contrato de compromisso",
    "transformação",
    "fitness",
    "saúde",
  ],
  authors: [{ name: "Charya" }],
  creator: "Charya",
  publisher: "Charya Saúde e Bem-Estar",
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
    siteName: "Charya Bet",
    title: "Charya Bet — Aposte na sua transformação",
    description:
      "A única aposta em que você torce para você ganhar. Coloque dinheiro real em jogo na sua própria meta e mude quando existe algo de verdade em jogo.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Charya Bet — Aposte na sua transformação",
    description: "A única aposta em que você torce para você ganhar. Comprometa-se. Evolua. Ganhe.",
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#0A0D16",
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
