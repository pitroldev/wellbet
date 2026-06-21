"use client";

import * as React from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitVerdict } from "@/shared/api/review";
import { Card, CardContent, Textarea } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { VerdictActions } from "./verdict-actions";
import { verdictFormSchema, type VerdictFormValues } from "./schema";
import {
  CHECKLIST_ITEMS,
  type ChecklistItemKey,
  type ItemResult,
  type Verdict,
  type VerdictSubmission,
} from "./types";

/**
 * Checklist do revisor item a item (V1–V8 do MVP — Validação §5) + motivo +
 * ação de veredito. É o coração do console manual-first: cada resultado vira
 * dado rotulado para a Fase 2 (Validação §9).
 *
 * react-hook-form + Zod (@hookform/resolvers/zod). O schema reaproveita os
 * tipos de domínio; deve sincronizar com @charya/schemas (ver schema.ts).
 */
const ITEM_RESULTS: { value: ItemResult; label: string }[] = [
  { value: "ok", label: "OK" },
  { value: "fail", label: "Reprova" },
  { value: "na", label: "N/A" },
];

function defaultItems(): Record<ChecklistItemKey, ItemResult> {
  return Object.fromEntries(CHECKLIST_ITEMS.map((i) => [i.key, "na" as ItemResult])) as Record<
    ChecklistItemKey,
    ItemResult
  >;
}

export interface ChecklistFormProps {
  sessionId: string;
  onSubmitted?: (verdict: Verdict) => void;
}

export function ChecklistForm({ sessionId, onSubmitted }: ChecklistFormProps): React.JSX.Element {
  const submit = useSubmitVerdict();
  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<VerdictFormValues>({
    resolver: zodResolver(verdictFormSchema),
    defaultValues: {
      // `verdict` começa sem seleção; DefaultValues<T> permite undefined.
      verdict: undefined,
      reason: "",
      items: defaultItems(),
    },
  });

  const verdict = watch("verdict") ?? null;

  const onValid = handleSubmit((values) => {
    const failedItems = (Object.entries(values.items) as [ChecklistItemKey, ItemResult][])
      .filter(([, result]) => result === "fail")
      .map(([key]) => key);

    const submission: VerdictSubmission = {
      sessionId,
      verdict: values.verdict,
      reason: values.reason,
      failedItems,
      items: values.items,
    };

    submit.mutate(submission, {
      onSuccess: () => onSubmitted?.(values.verdict),
    });
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        void onValid();
      }}
      className="flex flex-col gap-4"
    >
      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          {CHECKLIST_ITEMS.map((item) => (
            <Controller
              key={item.key}
              name={`items.${item.key}` as const}
              control={control}
              render={({ field }) => (
                <div className="flex flex-col gap-1.5 border-b border-[var(--color-border)] pb-3 last:border-b-0 last:pb-0">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-[var(--color-muted-foreground)]">{item.confer}</p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      {ITEM_RESULTS.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => field.onChange(opt.value)}
                          className={cn(
                            "rounded-md px-2 py-1 text-xs font-medium transition-colors",
                            field.value === opt.value
                              ? opt.value === "fail"
                                ? "bg-[var(--color-verdict-rejected)] text-white"
                                : opt.value === "ok"
                                  ? "bg-[var(--color-verdict-approved)] text-white"
                                  : "bg-[var(--color-muted)] text-[var(--color-foreground)]"
                              : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
                          )}
                        >
                          {opt.label}
                        </button>
                      ))}
                    </div>
                  </div>
                  {field.value === "fail" ? (
                    <p className="text-xs text-[var(--color-verdict-rejected)]">
                      Reprova quando: {item.reprovaQuando}
                    </p>
                  ) : null}
                </div>
              )}
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="reason" className="text-sm font-medium">
          Motivo / observações
        </label>
        <Controller
          name="reason"
          control={control}
          render={({ field }) => (
            <Textarea
              id="reason"
              placeholder="Obrigatório para PENDENTE ou REPROVADO."
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
            />
          )}
        />
        {errors.reason ? (
          <p role="alert" className="text-xs text-[var(--color-verdict-rejected)]">
            {errors.reason.message}
          </p>
        ) : null}
      </div>

      {submit.isError ? (
        <p role="alert" className="text-sm text-[var(--color-verdict-rejected)]">
          Falha ao gravar o veredito. Tente novamente.
        </p>
      ) : null}

      <VerdictActions
        value={verdict}
        onChange={(v) => setValue("verdict", v, { shouldValidate: true, shouldDirty: true })}
        onSubmit={() => void onValid()}
        submitting={submit.isPending}
      />
    </form>
  );
}
