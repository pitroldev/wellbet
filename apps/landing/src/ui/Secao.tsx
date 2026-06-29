import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SecaoProps {
  id?: string;
  children: ReactNode;
  className?: string;
  /** Superfície — ritmo CLARO/ESCURO (ink/navy escuras, papel/magenta claras). */
  surface?: "ink" | "navy" | "paper" | "magenta";
  /** Escala de respiro vertical. base = padrão; tight = compacto (painel/footer). */
  size?: "tight" | "base";
}

/** Cada superfície já carrega o fundo E a cor de texto base (claro ↔ escuro). */
const surfaceClasses: Record<NonNullable<SecaoProps["surface"]>, string> = {
  ink: "bg-ink text-white",
  navy: "bg-navy text-white",
  paper: "bg-paper text-[color:var(--color-paper-ink)]",
  magenta: "bg-magenta text-ink",
};

/** Tiers de espaçamento — fonte única (mata overrides soltos de className). */
const sizeClasses: Record<NonNullable<SecaoProps["size"]>, string> = {
  tight: "py-14 sm:py-20",
  base: "py-20 sm:py-28",
};

/** Primitivo de seção — superfície + respiro tokenizado. */
export function Secao({
  id,
  children,
  className,
  surface = "ink",
  size = "base",
}: SecaoProps): JSX.Element {
  return (
    <section
      id={id}
      className={cn(
        "relative w-full overflow-hidden px-6",
        surfaceClasses[surface],
        sizeClasses[size],
        className,
      )}
    >
      <div className="mx-auto w-full max-w-6xl">{children}</div>
    </section>
  );
}
