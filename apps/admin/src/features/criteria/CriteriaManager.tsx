"use client";

import * as React from "react";
import { Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui";
import { useCreateCriterion, useCriteria, useUpdateCriterion } from "@/shared/api/criteria";
import { cn } from "@/lib/utils";
import { CriterionForm } from "./CriterionForm";

/**
 * Gestão global dos critérios de aprovação (checklist da revisão).
 * Criar, editar, habilitar/desabilitar — reflete no checklist que o revisor usa.
 */
export function CriteriaManager(): React.JSX.Element {
  const { data: criteria, isLoading, isError } = useCriteria();
  const create = useCreateCriterion();
  const update = useUpdateCriterion();

  // Remonta o form de criação ao concluir (limpa os campos).
  const [createKey, setCreateKey] = React.useState(0);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Novo critério</CardTitle>
          <CardDescription>
            A <span className="font-mono">key</span> é o identificador estável usado no checklist e
            no dataset — escolha com cuidado (não muda depois).
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CriterionForm
            key={createKey}
            mode="create"
            submitting={create.isPending}
            errorMessage={
              create.isError ? "Falha ao criar. A key já existe ou é inválida?" : null
            }
            onSubmit={(values) => {
              create.mutate(
                {
                  key: values.key,
                  label: values.label,
                  description: values.description || undefined,
                  failHint: values.failHint || undefined,
                  sortOrder: values.sortOrder,
                },
                { onSuccess: () => setCreateKey((k) => k + 1) },
              );
            }}
          />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-muted-foreground)]">
          Critérios {criteria ? `(${String(criteria.length)})` : ""}
        </h2>

        {isLoading ? <p className="text-sm text-[var(--color-muted-foreground)]">Carregando…</p> : null}
        {isError ? (
          <p className="text-sm text-[var(--color-verdict-rejected)]">Falha ao carregar critérios.</p>
        ) : null}

        {criteria?.map((c) => {
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
                          },
                        },
                        { onSuccess: () => setEditingId(null) },
                      );
                    }}
                  />
                ) : (
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium">{c.label}</p>
                        <Badge className="font-mono text-xs">{c.key}</Badge>
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
                    <div className="flex shrink-0 gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={toggling}
                        onClick={() =>
                          update.mutate({ id: c.id, patch: { enabled: !c.enabled } })
                        }
                      >
                        {c.enabled ? "Desabilitar" : "Habilitar"}
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditingId(c.id)}
                      >
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
    </div>
  );
}
