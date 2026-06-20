import type { Metadata, Viewport } from "next";
import type { JSX, ReactNode } from "react";
import "./globals.css";

/**
 * Origem pública da landing — usada para resolver URLs absolutas de
 * OpenGraph/canonical (exigência de SEO). Lida do ambiente em build/runtime
 * com fallback para o domínio de produção.
 */
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://charya.com.br";

/**
 * Metadata global de SEO da landing pública.
 *
 * - `metadataBase` resolve todas as URLs relativas (canonical/OG) para absolutas.
 * - OpenGraph + Twitter card garantem preview rico ao compartilhar (WhatsApp,
 *   Instagram, X) — canal-chave do ICP (homens 30-50, apostas/Pix).
 * - `robots` libera indexação (oposto do admin, que é privado).
 */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Charya Bet — Aposte na sua transformação",
    template: "%s · Charya Bet",
  },
  description:
    "Você apostaria R$ 200 que consegue perder 8 kg em 4 meses? A única aposta em que você torce para você ganhar. Comprometa-se, evolua e ganhe — de verdade.",
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
  alternates: {
    canonical: "/",
  },
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
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Charya Bet — Aposte na sua transformação",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Charya Bet — Aposte na sua transformação",
    description: "A única aposta em que você torce para você ganhar. Comprometa-se. Evolua. Ganhe.",
    images: ["/og.jpg"],
  },
  category: "health",
};

export const viewport: Viewport = {
  themeColor: "#0e1f1a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }): JSX.Element {
  return (
    <html lang="pt-BR">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
