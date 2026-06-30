"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";
import { Badge, useToast } from "@/shared/ui";
import { deriveInitials } from "@/shared/lib/initials";
import { cn } from "@/lib/utils";

type Variant = "approved" | "pending" | "rejected" | undefined;

export function brl(amount: string, currency: string): string {
  const n = Number(amount);
  return Number.isFinite(n)
    ? n.toLocaleString("pt-BR", { style: "currency", currency })
    : `${currency} ${amount}`;
}

export const ROLE_LABEL: Record<string, string> = {
  user: "Usuário",
  reviewer: "Revisor",
  admin: "Admin",
};

export const BET_STATUS: Record<string, { label: string; variant: Variant }> = {
  pending_payment: { label: "Aguardando pgto", variant: "pending" },
  open: { label: "Ativa", variant: "approved" },
  settling: { label: "Liquidando", variant: "pending" },
  won: { label: "Ganhou", variant: "approved" },
  lost: { label: "Perdeu", variant: "rejected" },
  voided: { label: "Cancelada", variant: undefined },
};

export const WEIGHIN_STATUS: Record<string, { label: string; variant: Variant }> = {
  pending: { label: "Pendente", variant: undefined },
  blocked: { label: "Bloqueada", variant: "rejected" },
  in_review: { label: "Em revisão", variant: "pending" },
  approved: { label: "Aprovada", variant: "approved" },
  rejected: { label: "Reprovada", variant: "rejected" },
  recapture: { label: "Recaptura", variant: "pending" },
};

export const KIND_LABEL: Record<string, string> = {
  baseline: "Inicial (T0)",
  mid: "Meio (T1)",
  final: "Final (T2)",
};

export const PAYOUT: Record<string, { label: string; variant: Variant }> = {
  pago: { label: "Pago", variant: "approved" },
  a_liquidar: { label: "A liquidar — Pix ok", variant: "pending" },
  bloqueado_sem_pix: { label: "Bloqueado — falta chave Pix", variant: "rejected" },
  bloqueado_pesagem_final: { label: "Bloqueado — pesagem final reprovada", variant: "rejected" },
  sem_payout: { label: "Sem payout em aberto", variant: undefined },
};

/** Avatar circular com iniciais (mesmo idioma da sidebar). */
export function Avatar({ label, className }: { label: string; className?: string }): React.JSX.Element {
  return (
    <span
      aria-hidden
      title={label}
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-muted)] text-xs font-semibold text-[var(--color-foreground)] ring-1 ring-inset ring-[var(--color-border)]",
        className,
      )}
    >
      {deriveInitials(label)}
    </span>
  );
}

/** Botão de copiar PII (e-mail, id, Pix, transferId) — feedback por toast + ícone. */
export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}): React.JSX.Element {
  const toast = useToast();
  const [copied, setCopied] = React.useState(false);

  function copy(e: React.MouseEvent): void {
    e.stopPropagation();
    void navigator.clipboard.writeText(value).then(() => {
      setCopied(true);
      toast.show(`${label} copiado.`, "approved");
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={`Copiar ${label.toLowerCase()}`}
      title={`Copiar ${label.toLowerCase()}`}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded text-[var(--color-muted-foreground)] transition-colors hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
        className,
      )}
    >
      {copied ? <Check className="size-3.5" aria-hidden /> : <Copy className="size-3.5" aria-hidden />}
    </button>
  );
}

export function RoleBadge({ role }: { role: string }): React.JSX.Element {
  return <Badge title={`Papel: ${ROLE_LABEL[role] ?? role}`}>{ROLE_LABEL[role] ?? role}</Badge>;
}
