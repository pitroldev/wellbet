import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Editorial / muma — wellbet & Co.",
  description:
    "Editorial / muma: revista de moda encontra fintech. A serifa manda, o rosa e o indigo brilham. A melhor aposta é na sua mudança. Bora? Bora!",
};

export default function EditorialMumaLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#FAFBFC]")}>{children}</div>;
}
