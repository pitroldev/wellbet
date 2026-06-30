"use client";

import * as React from "react";
import Link from "next/link";
import { ArrowRight, ClipboardCheck } from "lucide-react";
import { useReviewQueue } from "@/shared/api/review";
import { Skeleton } from "@/shared/ui";

/**
 * Cartão-CTA da home: mostra quantas pesagens estão na fila (contagem viva) e
 * leva direto à revisão — o trabalho nº 1 do revisor.
 */
export function QueueCta(): React.JSX.Element {
  const { data, isLoading } = useReviewQueue();
  const count = data?.length ?? 0;

  return (
    <Link
      href="/review"
      className="group flex items-center gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5 transition-colors hover:border-[var(--color-ring)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
    >
      <span className="grid size-12 shrink-0 place-items-center rounded-md bg-[var(--color-primary)] text-[var(--color-primary-foreground)]">
        <ClipboardCheck className="size-6" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        {isLoading ? (
          <Skeleton className="h-6 w-64" />
        ) : (
          <p className="text-lg font-semibold">
            {count > 0
              ? `${String(count)} pesage${count > 1 ? "ns" : "m"} aguardando revisão`
              : "Fila vazia — tudo revisado"}
          </p>
        )}
        <p className="text-sm text-[var(--color-muted-foreground)]">
          {count > 0 ? "Abra a fila e comece pela mais antiga." : "Nada aguardando veredito agora."}
        </p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1 text-sm font-medium text-[var(--color-muted-foreground)] transition-colors group-hover:text-[var(--color-foreground)]">
        Revisar agora
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
      </span>
    </Link>
  );
}
