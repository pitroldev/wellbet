import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "GymBet Arena — wellbet & Co.",
  description:
    "GymBet Arena: arena competitiva de alta octanagem. Magenta e roxo sobre navy, caixa-alta pesada, estilhaços diagonais. Treine. Compita. Fature.",
};

export default function GymBetArenaLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#0B1226]")}>{children}</div>;
}
