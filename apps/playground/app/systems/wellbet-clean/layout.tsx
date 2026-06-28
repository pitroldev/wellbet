import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "WellBet Clean — wellbet & Co.",
  description:
    "WellBet Clean: o app WellBet de verdade. Azul elétrico, verde menta, anel de evolução. Sua disciplina agora vale mais.",
};

export default function WellbetCleanLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#FAFBFC]")}>{children}</div>;
}
