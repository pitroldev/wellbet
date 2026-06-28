import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Cassino Neon — wellbet & Co.",
  description:
    "Cassino Neon: mesa de jogo à noite sob neon. Roleta, fichas, cartas, dados e jackpot — feltro green, letreiro magenta, glow azul. A melhor aposta é na sua mudança.",
};

export default function CassinoLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#0B1226]")}>{children}</div>;
}
