import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
});

const monoData = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono-data",
});

export const metadata: Metadata = {
  title: "CHARYA — Glow Comportamental",
  description:
    "Sportsbook dark premium da CHARYA. Cupom, cotação e retorno em verde-glow: monte a aposta, acenda a acumuladora, dê cash out, dê green. A única aposta em que você torce para você ganhar.",
};

export default function GlowLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        body.variable,
        monoData.variable,
        "min-h-screen bg-[#0E0B1A] text-[#EDEAF7] antialiased",
      )}
    >
      {children}
    </div>
  );
}
