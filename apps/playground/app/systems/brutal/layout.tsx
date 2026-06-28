import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Brutalista — wellbet & Co.",
  description:
    "Neo-brutalismo de terminal: bordas duras, sombras sólidas, mono em todo lugar e blocos chapados de cor. Sem firula. Só aposta.",
};

export default function BrutalLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#FAFBFC]")}>{children}</div>;
}
