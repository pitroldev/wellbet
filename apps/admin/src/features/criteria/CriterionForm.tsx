"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Input, Textarea } from "@/shared/ui";

/**
 * Formulário de critério (criar/editar). A `key` (slug do dataset) só é editável
 * na criação — depois é imutável (referenciada no histórico de vereditos).
 */
const criterionFormSchema = z.object({
  key: z
    .string()
    .trim()
    .regex(/^[a-z][a-z0-9_]*$/, "Slug snake_case: a-z, 0-9, _ (começa com letra).")
    .max(64),
  label: z.string().trim().min(1, "Informe um rótulo.").max(120),
  description: z.string().trim().max(2000),
  failHint: z.string().trim().max(2000),
  sortOrder: z.number().int().min(0).max(10_000),
  // Condição de aparição (substitui o N/A): o critério só aparece quando vale.
  appliesWhen: z.enum(["always", "has_code", "has_comparison", "has_previous_weight"]),
});

export type CriterionFormValues = z.infer<typeof criterionFormSchema>;

const APPLIES_OPTIONS: { value: CriterionFormValues["appliesWhen"]; label: string }[] = [
  { value: "always", label: "Sempre" },
  { value: "has_code", label: "Quando há código dinâmico (anti-replay)" },
  { value: "has_comparison", label: "Quando há 2+ capturas (comparar identidade)" },
  { value: "has_previous_weight", label: "Quando há peso anterior (plausibilidade)" },
];

export interface CriterionFormProps {
  mode: "create" | "edit";
  defaultValues?: Partial<CriterionFormValues>;
  onSubmit: (values: CriterionFormValues) => void;
  submitting?: boolean;
  errorMessage?: string | null;
  onCancel?: () => void;
}

const FIELD_LABEL = "text-xs font-medium text-[var(--color-muted-foreground)]";

export function CriterionForm({
  mode,
  defaultValues,
  onSubmit,
  submitting,
  errorMessage,
  onCancel,
}: CriterionFormProps): React.JSX.Element {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CriterionFormValues>({
    resolver: zodResolver(criterionFormSchema),
    defaultValues: {
      key: defaultValues?.key ?? "",
      label: defaultValues?.label ?? "",
      description: defaultValues?.description ?? "",
      failHint: defaultValues?.failHint ?? "",
      sortOrder: defaultValues?.sortOrder ?? 0,
      appliesWhen: defaultValues?.appliesWhen ?? "always",
    },
  });

  const submit = handleSubmit((values) => onSubmit(values));

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
      className="flex flex-col gap-3"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_2fr]">
        <div className="flex flex-col gap-1">
          <label className={FIELD_LABEL} htmlFor="crit-key">
            Key (slug)
          </label>
          <Controller
            name="key"
            control={control}
            render={({ field }) => (
              <Input
                id="crit-key"
                placeholder="scale_zero"
                className="font-mono"
                disabled={mode === "edit"}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.key ? (
            <p className="text-xs text-[var(--color-verdict-rejected)]">{errors.key.message}</p>
          ) : mode === "edit" ? (
            <p className="text-xs text-[var(--color-muted-foreground)]">Imutável após criada.</p>
          ) : null}
        </div>

        <div className="flex flex-col gap-1">
          <label className={FIELD_LABEL} htmlFor="crit-label">
            Rótulo
          </label>
          <Controller
            name="label"
            control={control}
            render={({ field }) => (
              <Input
                id="crit-label"
                placeholder="Balança zerada"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
              />
            )}
          />
          {errors.label ? (
            <p className="text-xs text-[var(--color-verdict-rejected)]">{errors.label.message}</p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL} htmlFor="crit-desc">
          O que conferir
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea
              id="crit-desc"
              placeholder="Orientação positiva do que validar."
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className={FIELD_LABEL} htmlFor="crit-fail">
          Quando reprovar
        </label>
        <Controller
          name="failHint"
          control={control}
          render={({ field }) => (
            <Textarea
              id="crit-fail"
              placeholder="Sinais que indicam reprovação."
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex flex-col gap-1">
          <label className={FIELD_LABEL} htmlFor="crit-order">
            Ordem
          </label>
          <Controller
            name="sortOrder"
            control={control}
            render={({ field }) => (
              <Input
                id="crit-order"
                type="number"
                min={0}
                className="w-24"
                value={String(field.value)}
                onChange={(e) => field.onChange(e.target.value === "" ? 0 : Number(e.target.value))}
                onBlur={field.onBlur}
              />
            )}
          />
        </div>

        <div className="flex min-w-[16rem] flex-1 flex-col gap-1">
          <label className={FIELD_LABEL} htmlFor="crit-applies">
            Aparece quando
          </label>
          <Controller
            name="appliesWhen"
            control={control}
            render={({ field }) => (
              <select
                id="crit-applies"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                className="flex h-9 w-full rounded-md border border-[var(--color-input)] bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
              >
                {APPLIES_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            )}
          />
          <p className="text-[11px] text-[var(--color-muted-foreground)]">
            Substitui o N/A: o critério só aparece no checklist quando a condição vale.
          </p>
        </div>
      </div>

      {errorMessage ? (
        <p role="alert" className="text-sm text-[var(--color-verdict-rejected)]">
          {errorMessage}
        </p>
      ) : null}

      <div className="flex gap-2">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Salvando…" : mode === "create" ? "Criar critério" : "Salvar"}
        </Button>
        {onCancel ? (
          <Button type="button" variant="outline" onClick={onCancel} disabled={submitting}>
            Cancelar
          </Button>
        ) : null}
      </div>
    </form>
  );
}
