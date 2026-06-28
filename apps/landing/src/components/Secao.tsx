import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SecaoProps {
  id?: string;
  children: ReactNode;
  className?: string;
  containerClassName?: string;
  /** Superfície escura da marca. */
  surface?: "ink" | "navy";
}

const surfaceClasses: Record<NonNullable<SecaoProps["surface"]>, string> = {
  ink: "bg-ink",
  navy: "bg-navy",
};

/** Primitivo de seção — espaçamento vertical, largura máxima, fundo escuro. */
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
        "relative w-full overflow-hidden px-6 py-20 text-white sm:py-28",
        surfaceClasses[surface],
        className,
      )}
    >
      <div className={cn("mx-auto w-full max-w-6xl", containerClassName)}>{children}</div>
    </section>
  );
}
