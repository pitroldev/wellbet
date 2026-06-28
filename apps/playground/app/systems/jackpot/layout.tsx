import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Jackpot / Slots — wellbet & Co.",
  description:
    "Jackpot: o palácio de caça-níqueis da wellbet & Co. Slot de 3 rolos, jackpot progressivo, roda da fortuna e raspadinha. Magenta, pink e o green do prêmio. Bora? Bora!",
};

export default function JackpotLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#220C82]")}>{children}</div>;
}
