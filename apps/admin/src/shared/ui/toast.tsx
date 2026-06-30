"use client";

import * as React from "react";
import { Check, TriangleAlert, X } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Toast minimalista (sem dependência externa) com cor semântica de veredito.
 * Usado para confirmar a gravação do veredito — antes de navegar — para o
 * revisor ter feedback explícito do que registrou (em vez da tela só sumir).
 */
export type ToastVariant = "default" | "approved" | "pending" | "rejected";

interface ToastItem {
  id: number;
  message: string;
  variant: ToastVariant;
}

interface ToastApi {
  show: (message: string, variant?: ToastVariant) => void;
}

const ToastContext = React.createContext<ToastApi | null>(null);

export function useToast(): ToastApi {
  const ctx = React.useContext(ToastContext);
  if (!ctx) throw new Error("useToast precisa de <ToastProvider> acima na árvore.");
  return ctx;
}

const VARIANT_STYLE: Record<ToastVariant, string> = {
  default: "border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)]",
  approved:
    "border-[var(--color-verdict-approved)] bg-[var(--color-card)] text-[var(--color-verdict-approved)]",
  pending:
    "border-[var(--color-verdict-pending)] bg-[var(--color-card)] text-[var(--color-verdict-pending)]",
  rejected:
    "border-[var(--color-verdict-rejected)] bg-[var(--color-card)] text-[var(--color-verdict-rejected)]",
};

const VARIANT_ICON: Record<ToastVariant, React.ReactNode> = {
  default: null,
  approved: <Check className="size-4 shrink-0" aria-hidden />,
  pending: <TriangleAlert className="size-4 shrink-0" aria-hidden />,
  rejected: <X className="size-4 shrink-0" aria-hidden />,
};

export function ToastProvider({ children }: { children: React.ReactNode }): React.JSX.Element {
  const [items, setItems] = React.useState<ToastItem[]>([]);
  const idRef = React.useRef(0);

  const show = React.useCallback((message: string, variant: ToastVariant = "default") => {
    const id = (idRef.current += 1);
    setItems((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => setItems((prev) => prev.filter((t) => t.id !== id)), 4000);
  }, []);

  const api = React.useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,22rem)] flex-col gap-2"
        role="region"
        aria-live="polite"
        aria-label="Notificações"
      >
        {items.map((t) => (
          <div
            key={t.id}
            className={cn(
              "pointer-events-auto flex items-center gap-2 rounded-md border-l-4 border px-4 py-3 text-sm font-medium shadow-lg",
              VARIANT_STYLE[t.variant],
            )}
          >
            {VARIANT_ICON[t.variant]}
            <span className="text-[var(--color-foreground)]">{t.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
