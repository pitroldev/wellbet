import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SecaoProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Superfície — ritmo CLARO/ESCURO do placar (ink/navy escuras, papel/magenta claras). */
  surface?: "ink" | "navy" | "paper" | "magenta";
}

/** Cada superfície já carrega o fundo E a cor de texto base (claro ↔ escuro). */
const surfaceClasses: Record<NonNullable<SecaoProps["surface"]>, string> = {
  ink: "bg-ink text-white",
  navy: "bg-navy text-white",
  paper: "bg-paper text-[color:var(--color-paper-ink)]",
  magenta: "bg-magenta text-ink",
};

/** Primitivo de seção — espaçamento vertical, largura máxima, superfície do ritmo. */
export function Secao({
  id,
  children,
  className,
  containerClassName,
  surface = "ink",
}: SecaoProps): JSX.Element {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden px-6 py-20 sm:py-28",
        surfaceClasses[surface],
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-6xl", containerClassName)}>{children}</div>
    </section>
  );
}
