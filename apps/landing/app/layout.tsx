import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Plus_Jakarta_Sans, Archivo, Geist_Mono } from "next/font/google";
import "./globals.css";

/**
 * Fontes da marca wellbet & Co. (BRAND.md §3), carregadas via next/font e
 * expostas como CSS vars:
 *  - Archivo (black/800/900) → manchetes caixa-alta itálicas (energia gymbet-arena).
 *  - Plus Jakarta Sans → UI/corpo (o "sans da casa").
 *  - Geist Mono → odds, stake, payout, contadores (tabular).
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});
const archivo = Archivo({ subsets: ["latin"], variable: "--font-archivo", display: "swap" });
const geistMono = Geist_Mono({
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
  themeColor: "#08161E",
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
