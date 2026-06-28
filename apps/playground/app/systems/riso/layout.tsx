import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Riso — wellbet & Co.",
  description:
    "Risograph / Poster: tinta sobre papel, meio-tom, overprint e grão. Edição limitada da sua mudança. Impressa na sua mudança.",
};

export default function RisoLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#F3EEE3]")}>{children}</div>;
}
