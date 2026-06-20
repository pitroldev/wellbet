import type { Metadata } from "next";
import { Sora, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

// Display: Sora variable — geométrica, futurista
const display = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

// Corpo: Space Grotesk variable
const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

// Mono leve para dados/cotações
const mono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHARYA — Holográfico",
  description:
    "Futuro luminoso: foil holográfico, vidro fosco e iridescência que desliza roxo↔verde↔ciano. O cupom é um passe que brilha ao toque. A única aposta em que você torce para você ganhar.",
};

export default function HolograficoLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        display.variable,
        body.variable,
        mono.variable,
        "min-h-screen bg-[#0A0A12] text-[#F2F2FA]",
      )}
    >
      {children}
    </div>
  );
}
