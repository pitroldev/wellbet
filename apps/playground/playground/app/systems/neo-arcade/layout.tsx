import type { Metadata } from "next";
import { Press_Start_2P, Silkscreen, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const display = Press_Start_2P({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const hud = Silkscreen({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-hud",
  display: "swap",
});

const body = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CHARYA — Neo-Arcade",
  description:
    "Pixel-art como linguagem de recompensa. O game antigo a serviço do compromisso comportamental — sem virar cassino.",
};

export default function NeoArcadeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={cn(
        display.variable,
        hud.variable,
        body.variable,
        "min-h-screen bg-[#120A24] text-[#EDE9FE]",
      )}
    >
      {children}
    </div>
  );
}
