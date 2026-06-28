import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Ecossistema — wellbet & Co.",
  description:
    "A visão masterbrand: indigo real, o “M” líquido e periwinkle. Um sistema operacional premium que unifica WellBet ↔ GymBet num toque. Mudanças reais acontecem quando existe algo em jogo.",
};

export default function EcossistemaLayout({ children }: { children: React.ReactNode }) {
  // Campo do masterbrand: indigo real como bg do tema.
  return <div className={cn("min-h-screen bg-[#220C82]")}>{children}</div>;
}
