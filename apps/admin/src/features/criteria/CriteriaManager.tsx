"use client";

import * as React from "react";
import { ChevronDown, ChevronUp, Plus, RotateCw } from "lucide-react";
import { Badge, Button, Card, CardContent, Skeleton, useToast } from "@/shared/ui";
import { useCreateCriterion, useCriteria, useUpdateCriterion } from "@/shared/api/criteria";
import { cn } from "@/lib/utils";
import { CriterionForm } from "./CriterionForm";

/** Rótulos curtos das condições de aparição (substituem o N/A). */
const APPLIES_LABEL: Record<string, string> = {
  has_code: "só com código",
  has_comparison: "só com 2+ capturas",
  has_previous_weight: "só com peso anterior",
};

/**
 * Gestão global dos critérios de aprovação (checklist da revisão).
 * Criar, editar, reordenar, habilitar/desabilitar — reflete no checklist do revisor.
 */
export function CriteriaManager(): React.JSX.Element {
  const toast = useToast();
  const { data: criteria, isLoading, isError, isFetching, refetch } = useCriteria();
  const create = useCreateCriterion();
  const update = useUpdateCriterion();

  const [showCreate, setShowCreate] = React.useState(false);
  const [createKey, setCreateKey] = React.useState(0);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  const list = criteria ?? [];

  // Reordenar: troca o sortOrder com o vizinho (a lista vem ordenada da API).
  function move(index: number, dir: -1 | 1): void {
    const j = index + dir;
    if (j < 0 || j >= list.length) return;
    const a = list[index]!;
    const b = list[j]!;
    toast.show("Ordem atualizada.", "approved");
    update.mutate({ id: a.id, patch: { sortOrder: b.sortOrder } });
    update.mutate({ id: b.id, patch: { sortOrder: a.sortOrder } });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-muted-foreground)]" aria-live="polite">
          <span className="tabular-nums text-[var(--color-foreground)]">{list.length}</span> critério
          {list.length === 1 ? "" : "s"}
        </h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
          aria-label="Recarregar"
        >
          <RotateCw className={cn("size-4", isFetching && "animate-spin")} aria-hidden />
        </Button>
        <Button
          variant={showCreate ? "outline" : "default"}
          size="sm"
          className="ml-auto"
          onClick={() => setShowCreate((v) => !v)}
        >
          <Plus className="size-4" aria-hidden />
          {showCreate ? "Fechar" : "Novo critério"}
        </Button>
      </div>

      {showCreate ? (
        <Card>
          <CardContent className="pt-6">
            <CriterionForm
              key={createKey}
              mode="create"
              submitting={create.isPending}
              errorMessage={create.isError ? "Falha ao criar. A key já existe ou é inválida?" : null}
              onCancel={() => setShowCreate(false)}
              onSubmit={(values) => {
                create.mutate(
                  {
                    key: values.key,
                    label: values.label,
                    description: values.description || undefined,
                    failHint: values.failHint || undefined,
                    sortOrder: values.sortOrder,
                    appliesWhen: values.appliesWhen,
                  },
                  {
                    onSuccess: () => {
                      setCreateKey((k) => k + 1);
                      setShowCreate(false);
                      toast.show("Critério criado.", "approved");
                    },
                    onError: () =>
                      toast.show("Falha ao criar. Key duplicada ou inválida?", "rejected"),
                  },
                );
              }}
            />
          </CardContent>
        </Card>
      ) : null}

      {isError ? (
        <div
          role="alert"
          className="flex flex-col items-center gap-2 rounded-md border border-[var(--color-border)] p-8 text-sm text-[var(--color-verdict-rejected)]"
        >
          Falha ao carregar os critérios.
          <Button variant="outline" size="sm" onClick={() => void refetch()}>
            Tentar novamente
          </Button>
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-3" role="status">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-[4.5rem] w-full rounded-md" />
          ))}
        </div>
      ) : list.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Nenhum critério ainda.
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" aria-hidden />
            Criar o primeiro
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {list.map((c, i) => {
            const toggling = update.isPending && update.variables?.id === c.id;
            const isEditing = editingId === c.id;
            return (
              <Card key={c.id} className={cn(!c.enabled && "opacity-60")}>
                <CardContent className="flex flex-col gap-3 pt-6">
                  {isEditing ? (
                    <CriterionForm
                      mode="edit"
                      defaultValues={{
                        key: c.key,
                        label: c.label,
                        description: c.description ?? "",
                        failHint: c.failHint ?? "",
                        sortOrder: c.sortOrder,
                        appliesWhen: c.appliesWhen,
                      }}
                      submitting={update.isPending}
                      errorMessage={update.isError ? "Falha ao salvar." : null}
                      onCancel={() => setEditingId(null)}
                      onSubmit={(values) => {
                        update.mutate(
                          {
                            id: c.id,
                            patch: {
                              label: values.label,
                              description: values.description || null,
                              failHint: values.failHint || null,
                              sortOrder: values.sortOrder,
                              appliesWhen: values.appliesWhen,
                            },
                          },
                          {
                            onSuccess: () => {
                              setEditingId(null);
                              toast.show("Alterações salvas.", "approved");
                            },
                            onError: () => toast.show("Falha ao salvar.", "rejected"),
                          },
                        );
                      }}
                    />
                  ) : (
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 flex-col gap-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-sm font-medium">{c.label}</p>
                          <Badge className="font-mono text-xs">{c.key}</Badge>
                          {c.appliesWhen !== "always" ? (
                            <Badge title="Condição de aparição">{APPLIES_LABEL[c.appliesWhen]}</Badge>
                          ) : null}
                          {!c.enabled ? <Badge variant="pending">desabilitado</Badge> : null}
                        </div>
                        {c.description ? (
                          <p className="text-xs text-[var(--color-muted-foreground)]">
                            {c.description}
                          </p>
                        ) : null}
                        {c.failHint ? (
                          <p className="text-xs text-[var(--color-verdict-rejected)]">
                            Reprova quando: {c.failHint}
                          </p>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={i === 0 || update.isPending}
                          onClick={() => move(i, -1)}
                          aria-label="Mover para cima"
                          title="Mover para cima"
                        >
                          <ChevronUp className="size-4" aria-hidden />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={i === list.length - 1 || update.isPending}
                          onClick={() => move(i, 1)}
                          aria-label="Mover para baixo"
                          title="Mover para baixo"
                        >
                          <ChevronDown className="size-4" aria-hidden />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={toggling}
                          onClick={() =>
                            update.mutate(
                              { id: c.id, patch: { enabled: !c.enabled } },
                              {
                                onSuccess: () =>
                                  toast.show(
                                    c.enabled ? "Critério desabilitado." : "Critério habilitado.",
                                    c.enabled ? "pending" : "approved",
                                  ),
                                onError: () => toast.show("Falha ao alterar o critério.", "rejected"),
                              },
                            )
                          }
                        >
                          {c.enabled ? "Desabilitar" : "Habilitar"}
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => setEditingId(c.id)}>
                          Editar
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
