"use client";

import * as React from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { VERDICTS, type Verdict } from "./types";

const META: Record<
  Verdict,
  { label: string; variant: "approved" | "pending" | "rejected"; icon: React.ReactNode; key: string }
> = {
  APROVADO: { label: "Aprovar", variant: "approved", icon: <Check className="size-4" aria-hidden />, key: "A" },
  PENDENTE: { label: "Pendente", variant: "pending", icon: <TriangleAlert className="size-4" aria-hidden />, key: "P" },
  REPROVADO: { label: "Reprovar", variant: "rejected", icon: <X className="size-4" aria-hidden />, key: "R" },
};

/**
 * Seletor de veredito (radiogroup acessível) — Validação §7.
 * Estado controlado pelo ChecklistForm. Selecionado vem PREENCHIDO com a cor do
 * veredito; os demais ficam em outline (diferença não depende só de cor: há
 * ícone + preenchimento). APROVAR pode vir bloqueado (sanidade / itens
 * pendentes / reprovados) com motivo explícito.
 */
export interface VerdictActionsProps {
  value: Verdict | null;
  onChange: (verdict: Verdict) => void;
  onSubmit: () => void;
  submitting?: boolean;
  /** APROVAR indisponível (sanidade bloqueada, itens não avaliados ou reprovados). */
  approveDisabled?: boolean;
  /** Texto de contexto (por que não dá para aprovar, ou o que falta). */
  hint?: string | null;
  /** Habilita o botão "Gravar" (ex.: motivo preenchido quando exigido). */
  canSubmit?: boolean;
  submitLabel?: string;
}

export function VerdictActions({
  value,
  onChange,
  onSubmit,
  submitting,
  approveDisabled,
  hint,
  canSubmit = true,
  submitLabel = "Gravar veredito",
}: VerdictActionsProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Veredito">
        {VERDICTS.map((v) => {
          const selected = value === v;
          const disabled = v === "APROVADO" && approveDisabled;
          return (
            <Button
              key={v}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-keyshortcuts={META[v].key}
              variant={selected ? META[v].variant : "outline"}
              onClick={() => onChange(v)}
              disabled={disabled}
              className={cn("gap-1.5", selected && "ring-2 ring-[var(--color-ring)] ring-offset-1")}
              title={disabled ? (hint ?? "Indisponível") : `${META[v].label} (${META[v].key})`}
            >
              {META[v].icon}
              {META[v].label}
              <kbd className="ml-0.5 rounded bg-black/10 px-1 text-[10px] dark:bg-white/15">
                {META[v].key}
              </kbd>
            </Button>
          );
        })}
      </div>

      {/* Altura reservada: a dica aparece/some SEM empurrar o layout. */}
      <p
        className={cn(
          "min-h-[1rem] text-xs",
          approveDisabled
            ? "text-[var(--color-verdict-pending)]"
            : "text-[var(--color-muted-foreground)]",
        )}
        aria-live="polite"
      >
        {hint}
      </p>

      <Button
        type="button"
        onClick={onSubmit}
        disabled={submitting || value === null || !canSubmit}
        aria-keyshortcuts="Enter"
      >
        {submitting ? "Gravando veredito…" : submitLabel}
        {value !== null && canSubmit ? (
          <kbd className="ml-1 rounded bg-white/15 px-1 text-[10px]">↵</kbd>
        ) : null}
      </Button>

      <p className="text-xs text-[var(--color-muted-foreground)]">
        Política: na dúvida, PENDENTE — nunca aprovar no susto, nunca reprovar honesto por vídeo
        ruim.
      </p>
    </div>
  );
}
