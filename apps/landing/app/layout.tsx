import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import { Geist_Mono, Outfit, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

/**
 * Fontes da identidade WELLBET "Chama Violeta". Mantemos os MESMOS nomes de
 * CSS var do tema antigo (--font-archivo / --font-jakarta / --font-geist-mono)
 * para re-fontar todos os componentes sem tocar cada um:
 *  - Outfit → manchetes bold arredondadas, DNA do wordmark (era "archivo").
 *  - Plus Jakarta Sans → corpo / UI, a voz "de gente" (era "jakarta").
 *  - Geist Mono → stake, resumo do bilhete, labels, números — DNA de bilhete.
 */
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});
const archivo = Outfit({
  subsets: ["latin"],
  weight: ["700", "800", "900"],
  variable: "--font-archivo",
  display: "swap",
});
const geistMono = Geist_Mono({
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
  themeColor: "#FAFBFC",
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
