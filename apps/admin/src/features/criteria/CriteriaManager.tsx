"use client";

import * as React from "react";
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Plus, RotateCw } from "lucide-react";
import { type CriterionResponseDto } from "@charya/contracts";
import { Badge, Button, Card, CardContent, Skeleton, useToast } from "@/shared/ui";
import { useCreateCriterion, useCriteria, useUpdateCriterion } from "@/shared/api/criteria";
import { cn } from "@/lib/utils";
import { CriterionForm, type CriterionFormValues } from "./CriterionForm";

/** Rótulos curtos das condições de aparição (substituem o N/A). */
const APPLIES_LABEL: Record<string, string> = {
  has_comparison: "só com 2+ capturas",
  has_previous_weight: "só com peso anterior",
};

/**
 * Gestão global dos critérios de aprovação (checklist da revisão).
 * Criar, editar, reordenar (drag-and-drop), habilitar/desabilitar.
 */
export function CriteriaManager(): React.JSX.Element {
  const toast = useToast();
  const { data: criteria, isLoading, isError, isFetching, refetch } = useCriteria();
  const create = useCreateCriterion();
  const update = useUpdateCriterion();

  const [showCreate, setShowCreate] = React.useState(false);
  const [createKey, setCreateKey] = React.useState(0);
  const [editingId, setEditingId] = React.useState<string | null>(null);

  // Ordem otimista: espelha o servidor; o drag reordena na hora e persiste em bg.
  const [items, setItems] = React.useState<CriterionResponseDto[]>([]);
  React.useEffect(() => {
    if (criteria) setItems(criteria);
  }, [criteria]);

  const sensors = useSensors(
    // Distância mínima evita roubar o clique dos botões (editar/desabilitar).
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  function handleDragEnd(event: DragEndEvent): void {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((c) => c.id === active.id);
    const newIndex = items.findIndex((c) => c.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const next = arrayMove(items, oldIndex, newIndex);
    setItems(next); // otimista
    toast.show("Ordem atualizada.", "approved");
    // Persiste sortOrder = posição; só os que mudaram. O refetch reconcilia.
    next.forEach((c, idx) => {
      if (c.sortOrder !== idx) update.mutate({ id: c.id, patch: { sortOrder: idx } });
    });
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center gap-3">
        <h2 className="text-sm font-semibold text-[var(--color-muted-foreground)]" aria-live="polite">
          <span className="tabular-nums text-[var(--color-foreground)]">{items.length}</span> critério
          {items.length === 1 ? "" : "s"}
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
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center gap-2 rounded-md border border-dashed border-[var(--color-border)] p-10 text-center text-sm text-[var(--color-muted-foreground)]">
          Nenhum critério ainda.
          <Button size="sm" onClick={() => setShowCreate(true)}>
            <Plus className="size-4" aria-hidden />
            Criar o primeiro
          </Button>
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={items.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <div className="flex flex-col gap-3">
              {items.map((c) => (
                <SortableCriterion
                  key={c.id}
                  criterion={c}
                  isEditing={editingId === c.id}
                  editSubmitting={update.isPending}
                  editError={update.isError ? "Falha ao salvar." : null}
                  toggling={update.isPending && update.variables?.id === c.id}
                  onEdit={() => setEditingId(c.id)}
                  onCancelEdit={() => setEditingId(null)}
                  onSubmitEdit={(values) => {
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
                  onToggle={() =>
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
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

interface SortableCriterionProps {
  criterion: CriterionResponseDto;
  isEditing: boolean;
  editSubmitting: boolean;
  editError: string | null;
  toggling: boolean;
  onEdit: () => void;
  onCancelEdit: () => void;
  onSubmitEdit: (values: CriterionFormValues) => void;
  onToggle: () => void;
}

function SortableCriterion({
  criterion: c,
  isEditing,
  editSubmitting,
  editError,
  toggling,
  onEdit,
  onCancelEdit,
  onSubmitEdit,
  onToggle,
}: SortableCriterionProps): React.JSX.Element {
  const { attributes, listeners, setNodeRef, setActivatorNodeRef, transform, transition, isDragging } =
    useSortable({ id: c.id, disabled: isEditing });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className={cn(isDragging && "relative z-10")}>
      <Card
        className={cn(
          !c.enabled && "opacity-60",
          isDragging && "opacity-80 shadow-lg ring-1 ring-[var(--color-ring)]",
        )}
      >
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
            submitting={editSubmitting}
            errorMessage={editError}
            onCancel={onCancelEdit}
            onSubmit={onSubmitEdit}
          />
        ) : (
          <div className="flex items-start gap-3">
            <button
              ref={setActivatorNodeRef}
              type="button"
              className="mt-0.5 shrink-0 cursor-grab touch-none rounded p-0.5 text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)] active:cursor-grabbing"
              aria-label="Arrastar para reordenar"
              title="Arrastar para reordenar"
              {...attributes}
              {...listeners}
            >
              <GripVertical className="size-4" aria-hidden />
            </button>
            <div className="flex min-w-0 flex-1 items-start justify-between gap-4">
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
                  <p className="text-xs text-[var(--color-muted-foreground)]">{c.description}</p>
                ) : null}
                {c.failHint ? (
                  <p className="text-xs text-[var(--color-verdict-rejected)]">
                    Reprova quando: {c.failHint}
                  </p>
                ) : null}
              </div>
              <div className="flex shrink-0 items-center gap-1">
                <Button variant="outline" size="sm" disabled={toggling} onClick={onToggle}>
                  {c.enabled ? "Desabilitar" : "Habilitar"}
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                  Editar
                </Button>
              </div>
            </div>
          </div>
        )}
        </CardContent>
      </Card>
    </div>
  );
}
