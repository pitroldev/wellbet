"use client";

import * as React from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, type FieldPath, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckCheck } from "lucide-react";
import { reviewKeys, useSubmitVerdict, VerdictError } from "@/shared/api/review";
import { useCriteria } from "@/shared/api/criteria";
import { Button, Card, CardContent, Skeleton, Textarea, useToast } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { VerdictActions } from "./verdict-actions";
import { verdictFormSchema, type VerdictFormValues } from "./schema";
import type { ItemResult, Verdict, VerdictSubmission } from "./types";

const ITEM_RESULTS: { value: ItemResult; label: string; key: string }[] = [
  { value: "ok", label: "OK", key: "O" },
  { value: "fail", label: "Reprova", key: "F" },
  { value: "na", label: "N/A", key: "N" },
];

const VERDICT_BY_KEY: Record<string, Verdict> = { a: "APROVADO", p: "PENDENTE", r: "REPROVADO" };

const DOT: Record<"unset" | ItemResult, string> = {
  unset: "border-2 border-[var(--color-muted-foreground)]",
  ok: "bg-[var(--color-verdict-approved)]",
  fail: "bg-[var(--color-verdict-rejected)]",
  na: "bg-[var(--color-muted-foreground)]",
};

export interface ChecklistFormProps {
  sessionId: string;
  sanityPassed: boolean;
  onSubmitted?: (verdict: Verdict) => void;
}

export function ChecklistForm({
  sessionId,
  sanityPassed,
  onSubmitted,
}: ChecklistFormProps): React.JSX.Element {
  const toast = useToast();
  const queryClient = useQueryClient();
  const submit = useSubmitVerdict();
  const { data: criteria, isLoading, isError } = useCriteria({ enabledOnly: true });
  const {
    control,
    handleSubmit,
    setValue,
    setFocus,
    watch,
    formState: { errors },
  } = useForm<VerdictFormValues>({
    resolver: zodResolver(verdictFormSchema),
    defaultValues: { verdict: undefined, reason: "", items: {} },
  });

  const [confirmingReprove, setConfirmingReprove] = React.useState(false);

  /* eslint-disable react-hooks/incompatible-library */
  const verdict = watch("verdict") ?? null;
  const reason = watch("reason");
  const itemsVal = watch("items") ?? {};
  /* eslint-enable react-hooks/incompatible-library */

  const list = criteria ?? [];
  const total = list.length;
  const evaluated = list.filter((c) => itemsVal[c.key]).length;
  const failCount = list.filter((c) => itemsVal[c.key] === "fail").length;
  const allEvaluated = total > 0 && evaluated === total;

  const approveDisabled = !sanityPassed || !allEvaluated || failCount > 0;
  const approveHint = !sanityPassed
    ? "Sanidade bloqueada — só PENDENTE ou REPROVADO."
    : failCount > 0
      ? `${String(failCount)} critério(s) reprovado(s) — não dá para aprovar.`
      : !allEvaluated
        ? `Avalie todos os critérios para aprovar (${String(evaluated)}/${String(total)}).`
        : null;

  const reasonRequired = verdict != null && verdict !== "APROVADO";
  const reasonFilled = reason.trim().length >= 3;
  const canSubmit = !reasonRequired || reasonFilled;

  function markAllOk(): void {
    for (const c of list) {
      setValue(`items.${c.key}` as FieldPath<VerdictFormValues>, "ok" as never, {
        shouldDirty: true,
      });
    }
  }

  const runSubmit = React.useCallback(
    (values: VerdictFormValues) => {
      const failedItems = Object.entries(values.items)
        .filter(([, r]) => r === "fail")
        .map(([k]) => k);
      const submission: VerdictSubmission = {
        sessionId,
        verdict: values.verdict,
        reason: values.reason,
        failedItems,
        items: values.items,
      };
      submit.mutate(submission, {
        onSuccess: () => onSubmitted?.(values.verdict),
        onError: (err) => {
          setConfirmingReprove(false);
          if (err instanceof VerdictError && err.alreadyDecided) {
            toast.show(err.message, "pending");
            void queryClient.invalidateQueries({ queryKey: reviewKeys.session(sessionId) });
          } else {
            toast.show(err instanceof Error ? err.message : "Falha ao gravar o veredito.", "rejected");
          }
        },
      });
    },
    [sessionId, submit, onSubmitted, toast, queryClient],
  );

  const onValid = handleSubmit(runSubmit);

  const attemptSubmit = React.useCallback(() => {
    if (verdict == null) return;
    if (verdict === "APROVADO" && approveDisabled) return;
    if (reasonRequired && !reasonFilled) {
      setFocus("reason");
      return;
    }
    if (verdict === "REPROVADO" && !confirmingReprove) {
      setConfirmingReprove(true);
      return;
    }
    void onValid();
  }, [verdict, approveDisabled, reasonRequired, reasonFilled, confirmingReprove, onValid, setFocus]);

  React.useEffect(() => {
    function onKey(e: KeyboardEvent): void {
      const el = document.activeElement as HTMLElement | null;
      const tag = el?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || el?.isContentEditable) return;
      if (el?.closest("[data-player-region]")) return;
      if (e.metaKey || e.ctrlKey || e.altKey) {
        if (e.key === "Enter") {
          e.preventDefault();
          attemptSubmit();
        }
        return;
      }
      const v = VERDICT_BY_KEY[e.key.toLowerCase()];
      if (v) {
        if (v === "APROVADO" && approveDisabled) return;
        e.preventDefault();
        setValue("verdict", v, { shouldValidate: true, shouldDirty: true });
        setConfirmingReprove(false);
      } else if (e.key === "Enter") {
        e.preventDefault();
        attemptSubmit();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [attemptSubmit, approveDisabled, setValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        attemptSubmit();
      }}
      className="flex flex-col gap-4"
    >
      {/* CHECKLIST — rola; o veredito abaixo fica fixo. */}
      <Card>
        <CardContent className="flex flex-col gap-2.5 pt-6">
          <div className="flex items-center justify-between gap-3">
            <p
              className="text-sm font-medium"
              aria-live="polite"
              aria-label={`${String(evaluated)} de ${String(total || 0)} critérios avaliados`}
            >
              Checklist{" "}
              <span
                className={cn(
                  "ml-1 rounded-full px-2 py-0.5 text-xs tabular-nums",
                  allEvaluated
                    ? "bg-[var(--color-verdict-approved)]/15 text-[var(--color-verdict-approved)]"
                    : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
                )}
              >
                {evaluated}/{total || "—"} avaliados
              </span>
            </p>
            <Button type="button" variant="outline" size="sm" onClick={markAllOk} disabled={total === 0}>
              <CheckCheck className="size-4" aria-hidden />
              Marcar tudo OK
            </Button>
          </div>

          {isError ? (
            <p role="alert" className="text-sm text-[var(--color-verdict-rejected)]">
              Falha ao carregar os critérios.
            </p>
          ) : isLoading ? (
            // Skeleton com a MESMA estrutura das linhas — sem layout shift na chegada.
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-3 py-1.5">
                <div className="flex flex-1 flex-col gap-1.5">
                  <Skeleton className="h-3.5 w-2/5" />
                  <Skeleton className="h-2.5 w-4/5" />
                </div>
                <Skeleton className="h-8 w-40" />
              </div>
            ))
          ) : total === 0 ? (
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Nenhum critério habilitado. Configure em{" "}
              <span className="font-medium">Critérios</span>.
            </p>
          ) : (
            list.map((item) => (
              <Controller
                key={item.key}
                name={`items.${item.key}` as FieldPath<VerdictFormValues>}
                control={control}
                render={({ field }) => {
                  const current = (field.value as ItemResult | undefined) ?? undefined;
                  function setByKey(e: React.KeyboardEvent): void {
                    const opt = ITEM_RESULTS.find((o) => o.key.toLowerCase() === e.key.toLowerCase());
                    if (opt) {
                      e.preventDefault();
                      field.onChange(opt.value);
                    } else if (e.key === "ArrowRight" || e.key === "ArrowDown") {
                      e.preventDefault();
                      const i = ITEM_RESULTS.findIndex((o) => o.value === current);
                      field.onChange(ITEM_RESULTS[(i + 1 + ITEM_RESULTS.length) % ITEM_RESULTS.length]!.value);
                    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
                      e.preventDefault();
                      const i = ITEM_RESULTS.findIndex((o) => o.value === current);
                      field.onChange(ITEM_RESULTS[(i - 1 + ITEM_RESULTS.length) % ITEM_RESULTS.length]!.value);
                    }
                  }
                  return (
                    <div
                      role="radiogroup"
                      data-criterion
                      tabIndex={0}
                      aria-labelledby={`crit-${item.key}`}
                      onKeyDown={setByKey}
                      title={item.failHint ? `Reprova quando: ${item.failHint}` : undefined}
                      className="flex items-start justify-between gap-3 rounded-md border border-[var(--color-border)] p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]"
                    >
                      <div className="flex min-w-0 items-start gap-2">
                        {/* Dot de status — tamanho FIXO, só muda de cor (sem shift). */}
                        <span
                          aria-hidden
                          className={cn("mt-1 size-2 shrink-0 rounded-full", DOT[current ?? "unset"])}
                        />
                        <div className="min-w-0">
                          <p id={`crit-${item.key}`} className="text-sm font-medium">
                            {item.label}
                          </p>
                          {item.description ? (
                            <p className="text-xs text-[var(--color-muted-foreground)]">
                              {item.description}
                            </p>
                          ) : null}
                        </div>
                      </div>
                      <div className="flex shrink-0 gap-1">
                        {ITEM_RESULTS.map((opt) => (
                          <button
                            key={opt.value}
                            type="button"
                            role="radio"
                            tabIndex={-1}
                            aria-checked={current === opt.value}
                            aria-label={`${item.label}: ${opt.label}`}
                            title={opt.value === "fail" && item.failHint ? `Reprova quando: ${item.failHint}` : undefined}
                            onClick={() => field.onChange(opt.value)}
                            className={cn(
                              "min-h-[32px] rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                              current === opt.value
                                ? opt.value === "fail"
                                  ? "bg-[var(--color-verdict-rejected)] text-white"
                                  : opt.value === "ok"
                                    ? "bg-[var(--color-verdict-approved)] text-white"
                                    : "bg-[var(--color-foreground)] text-[var(--color-background)]"
                                : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
                            )}
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                }}
              />
            ))
          )}
        </CardContent>
      </Card>

      {/* VEREDITO — fixo (sticky) no rodapé: ação sempre alcançável sem rolar. */}
      <Card className="lg:sticky lg:bottom-6 lg:z-10 lg:shadow-lg">
        <CardContent className="flex flex-col gap-3 pt-6">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="reason" className="text-sm font-medium">
              Motivo / observações
              {reasonRequired ? (
                <span className="ml-1 text-[var(--color-verdict-rejected)]">*</span>
              ) : null}
            </label>
            <Controller
              name="reason"
              control={control}
              render={({ field }) => (
                <Textarea
                  id="reason"
                  rows={2}
                  placeholder={
                    reasonRequired
                      ? "Obrigatório: o que motivou PENDENTE/REPROVADO."
                      : "Opcional para APROVADO."
                  }
                  aria-required={reasonRequired}
                  aria-invalid={Boolean(errors.reason)}
                  className={cn(
                    "min-h-[56px]",
                    reasonRequired && !reasonFilled && "border-[var(--color-verdict-pending)]",
                  )}
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </div>

          <VerdictActions
            value={verdict}
            onChange={(v) => {
              setValue("verdict", v, { shouldValidate: true, shouldDirty: true });
              setConfirmingReprove(false);
            }}
            onSubmit={attemptSubmit}
            submitting={submit.isPending}
            approveDisabled={approveDisabled}
            hint={approveHint}
            canSubmit={canSubmit}
            submitLabel={verdict === "REPROVADO" ? "Reprovar…" : "Gravar veredito"}
          />
        </CardContent>
      </Card>

      {/* Confirmação de reprovação — MODAL (overlay): não empurra o layout. */}
      {confirmingReprove ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Confirmar reprovação"
          onClick={() => setConfirmingReprove(false)}
        >
          <div
            className="flex w-full max-w-sm flex-col gap-3 rounded-md border-2 border-[var(--color-verdict-rejected)] bg-[var(--color-card)] p-5 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <p className="text-base font-semibold">Confirmar reprovação?</p>
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Esta decisão é definitiva e afeta a aposta do usuário.
            </p>
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setConfirmingReprove(false)}>
                Cancelar
              </Button>
              <Button
                type="button"
                variant="rejected"
                disabled={submit.isPending}
                onClick={() => void onValid()}
              >
                {submit.isPending ? "Gravando…" : "Confirmar reprovação"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </form>
  );
}
