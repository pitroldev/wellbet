import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Placeholder de carregamento. Usado para reservar EXATAMENTE o espaço do
 * conteúdo final, evitando layout shift (CLS) quando os dados chegam.
 */
export function Skeleton({ className }: { className?: string }): React.JSX.Element {
  return (
    <div className={cn("animate-pulse rounded-md bg-[var(--color-muted)]", className)} aria-hidden />
  );
}
