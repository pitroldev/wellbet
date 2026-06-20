"use client";

import * as React from "react";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { VERDICTS, type Verdict } from "./types";

const VARIANT_BY_VERDICT: Record<Verdict, "approved" | "pending" | "rejected"> = {
  APROVADO: "approved",
  PENDENTE: "pending",
  REPROVADO: "rejected",
};

const LABEL_BY_VERDICT: Record<Verdict, string> = {
  APROVADO: "Aprovar",
  PENDENTE: "Pendente",
  REPROVADO: "Reprovar",
};

/**
 * Seletor de veredito (APROVADO/PENDENTE/REPROVADO) — Validação §7.
 * Componente controlado: o estado do veredito e o submit vivem no
 * ChecklistForm (react-hook-form). Aqui só renderizamos os 3 botões e
 * destacamos o selecionado.
 */
export interface VerdictActionsProps {
  value: Verdict | null;
  onChange: (verdict: Verdict) => void;
  onSubmit: () => void;
  submitting?: boolean;
  disabled?: boolean;
}

export function VerdictActions({
  value,
  onChange,
  onSubmit,
  submitting,
  disabled,
}: VerdictActionsProps): React.JSX.Element {
  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-3 gap-2">
        {VERDICTS.map((v) => (
          <Button
            key={v}
            type="button"
            variant={VARIANT_BY_VERDICT[v]}
            onClick={() => onChange(v)}
            disabled={disabled}
            className={cn(
              value === v ? "ring-2 ring-[var(--color-ring)] ring-offset-2" : "opacity-70",
            )}
          >
            {LABEL_BY_VERDICT[v]}
          </Button>
        ))}
      </div>
      <Button type="button" onClick={onSubmit} disabled={disabled || submitting || value === null}>
        {submitting ? "Gravando veredito…" : "Gravar veredito"}
      </Button>
      <p className="text-xs text-[var(--color-muted-foreground)]">
        Política: na dúvida, PENDENTE — nunca aprovar no susto, nunca reprovar honesto por vídeo
        ruim.
      </p>
    </div>
  );
}
