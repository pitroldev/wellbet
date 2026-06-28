import type { Metadata } from "next";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Voltage — wellbet & Co.",
  description:
    "Voltage: energia elétrica, o raio como motivo vivo. Vidro iridescente, charge meter, multiplicadores de voltagem. Sua disciplina, carregada.",
};

export default function VoltageLayout({ children }: { children: React.ReactNode }) {
  return <div className={cn("min-h-screen bg-[#040D13]")}>{children}</div>;
}
