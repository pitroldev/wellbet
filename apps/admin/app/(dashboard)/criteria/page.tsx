import type { JSX } from "react";
import { CriteriaManager } from "@/features/criteria";

/**
 * Configuração global dos critérios de aprovação (checklist da revisão).
 * Criar, editar, habilitar/desabilitar — vale para todas as revisões.
 */
export default function CriteriaPage(): JSX.Element {
  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold">Critérios de aprovação</h1>
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Itens do checklist que o revisor aplica a cada pesagem. Mudanças valem globalmente para as
          próximas revisões.
        </p>
      </header>
      <CriteriaManager />
    </div>
  );
}
