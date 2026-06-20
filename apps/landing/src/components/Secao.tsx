import type { JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SecaoProps {
  /** `id` de âncora para navegação interna (#como-funciona etc.). */
  id?: string;
  /** Conteúdo da seção. */
  children: ReactNode;
  /** Classe extra para o `<section>` (ex.: variação de fundo). */
  className?: string;
  /** Classe extra para o container centralizado interno. */
  containerClassName?: string;
  /** Variante de superfície — controla o fundo da seção. */
  surface?: "default" | "muted" | "brand";
}

const surfaceClasses: Record<NonNullable<SecaoProps["surface"]>, string> = {
  default: "bg-[var(--color-background)]",
  muted: "bg-[var(--color-muted)]",
  brand: "bg-brand-950 text-neutral-50",
};

/**
 * Primitivo de seção da landing — padroniza espaçamento vertical, largura
 * máxima e centralização do conteúdo. Server Component puro (zero JS no cliente).
 */
export function Secao({
  id,
  children,
  className,
  containerClassName,
  surface = "default",
}: SecaoProps): JSX.Element {
  return (
    <section
      id={id}
      className={cn("w-full px-6 py-20 sm:py-28", surfaceClasses[surface], className)}
    >
      <div className={cn("mx-auto w-full max-w-5xl", containerClassName)}>{children}</div>
    </section>
  );
}
