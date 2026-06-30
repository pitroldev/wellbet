"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, TrendingDown } from "lucide-react";
import { reviewKeys, useReviewQueue, useReviewSession } from "@/shared/api/review";
import { useCriteria } from "@/shared/api/criteria";
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
  useToast,
  type ToastVariant,
} from "@/shared/ui";
import { VideoReviewer } from "./VideoReviewer";
import { ChecklistForm } from "./ChecklistForm";
import type { DecidedVerdict, ItemResult, Verdict } from "./types";

const TOAST_VARIANT: Record<Verdict, ToastVariant> = {
  APROVADO: "approved",
  PENDENTE: "pending",
  REPROVADO: "rejected",
};
const VERDICT_BADGE: Record<Verdict, "approved" | "pending" | "rejected"> = {
  APROVADO: "approved",
  PENDENTE: "pending",
  REPROVADO: "rejected",
};

// Classes do grid e da coluna de evidência compartilhadas entre skeleton e
// conteúdo final → a estrutura é IDÊNTICA, então não há layout shift na carga.
// SEM `items-start`: as células esticam até a altura da linha, então o Card de
// evidência (sticky dentro da célula esticada) fica fixo durante TODO o scroll
// do checklist — a evidência nunca sai de vista.
const GRID = "grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]";
const EVIDENCE_STICKY = "lg:sticky lg:top-6";

/**
 * Tela de revisão de uma pesagem.
 *
 * Estrutura: EVIDÊNCIA protagonista (coluna larga, fixa no topo) | trilha
 * direita com o checklist que rola e o VEREDITO fixo no rodapé (sempre
 * alcançável sem rolar). Carrega com skeleton de mesma estrutura (zero CLS).
 */
export function ReviewSessionView({ sessionId }: { sessionId: string }): React.JSX.Element {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toast = useToast();
  const { data, isLoading, isError } = useReviewSession(sessionId);
  const { data: queue } = useReviewQueue();

  const idx = queue?.findIndex((q) => q.weighinId === sessionId) ?? -1;
  const position = idx >= 0 ? idx + 1 : null;
  const queueTotal = queue?.length ?? null;
  const next = idx >= 0 ? queue?.[idx + 1] : queue?.[0];

  function goToQueue(): void {
    router.push("/review");
    router.refresh();
  }

  function onSubmitted(verdict: Verdict): void {
    toast.show(
      `Veredito ${verdict} gravado${data ? ` · ${data.userName}` : ""}.`,
      TOAST_VARIANT[verdict],
    );
    void queryClient.invalidateQueries({ queryKey: reviewKeys.queue() });
    if (next && next.weighinId !== sessionId) {
      router.push(`/review/${next.weighinId}`);
    } else {
      goToQueue();
    }
  }

  if (isLoading) return <ReviewSkeleton />;

  if (isError || !data) {
    return (
      <div className="flex flex-col gap-3">
        <p role="alert" className="text-sm text-[var(--color-verdict-rejected)]">
          Não foi possível carregar esta pesagem.
        </p>
        <Button variant="outline" size="sm" className="w-fit" onClick={goToQueue}>
          <ArrowLeft className="size-4" aria-hidden />
          Voltar à fila
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={goToQueue}
          className="flex w-fit items-center gap-1 text-sm text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
        >
          <ArrowLeft className="size-4" aria-hidden />
          Fila de revisão
          {position != null && queueTotal != null ? (
            <span className="ml-1 rounded bg-[var(--color-muted)] px-1.5 text-xs tabular-nums">
              {position} de {queueTotal}
            </span>
          ) : null}
        </button>

        <header className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">{data.userName}</h1>
            <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-[var(--color-muted-foreground)]">
              <span>Captura {data.capture}</span>
              <span className="flex items-center gap-1.5 font-medium text-[var(--color-foreground)]">
                {data.previousWeightKg != null ? (
                  <>
                    <TrendingDown
                      className="size-4 text-[var(--color-verdict-approved)]"
                      aria-hidden
                    />
                    {data.previousWeightKg.toFixed(1)} → {data.weightKg.toFixed(1)} kg
                  </>
                ) : (
                  <>{data.weightKg.toFixed(1)} kg</>
                )}
              </span>
              {data.weeks != null ? <span>{data.weeks} sem</span> : null}
              {data.lossPerWeekKg != null ? (
                <span
                  className={
                    data.sanityPassed ? "" : "font-medium text-[var(--color-verdict-rejected)]"
                  }
                >
                  {data.lossPerWeekKg.toFixed(2)} kg/sem
                </span>
              ) : null}
            </div>
          </div>
          {data.sanityPassed ? (
            <Badge variant="approved">Sanidade OK</Badge>
          ) : (
            <Badge variant="rejected">Bloqueio de sanidade</Badge>
          )}
        </header>
      </div>

      <div className={GRID}>
        <div>
          <Card className={EVIDENCE_STICKY}>
            <CardHeader>
              <CardTitle>Evidência</CardTitle>
            </CardHeader>
            <CardContent>
              <VideoReviewer videos={data.videos} expectedCode={data.expectedCode} />
            </CardContent>
          </Card>
        </div>

        <div>
          {data.decided ? (
            <DecidedSummary decided={data.decided} onBack={goToQueue} />
          ) : (
            <ChecklistForm
              sessionId={data.id}
              sanityPassed={data.sanityPassed}
              onSubmitted={onSubmitted}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/** Skeleton de mesma estrutura do conteúdo final (evita CLS na carga). */
function ReviewSkeleton(): React.JSX.Element {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-3">
        <Skeleton className="h-4 w-40" />
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-6 w-24" />
        </div>
      </div>
      <div className={GRID}>
        <div>
          <Card className={EVIDENCE_STICKY}>
            <CardHeader>
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-8 w-44" />
              <Skeleton className="aspect-video w-full" />
            </CardContent>
          </Card>
        </div>
        <div className="flex flex-col gap-4">
          <Card>
            <CardContent className="flex flex-col gap-2.5 pt-6">
              <Skeleton className="h-5 w-40" />
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-start justify-between gap-3 py-1.5">
                  <div className="flex flex-1 flex-col gap-1.5">
                    <Skeleton className="h-3.5 w-2/5" />
                    <Skeleton className="h-2.5 w-4/5" />
                  </div>
                  <Skeleton className="h-8 w-40" />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex flex-col gap-3 pt-6">
              <Skeleton className="h-14 w-full" />
              <Skeleton className="h-9 w-full" />
              <Skeleton className="h-9 w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const RESULT_LABEL: Record<ItemResult, { label: string; className: string }> = {
  ok: { label: "OK", className: "text-[var(--color-verdict-approved)]" },
  fail: { label: "Reprova", className: "text-[var(--color-verdict-rejected)]" },
  na: { label: "N/A", className: "text-[var(--color-muted-foreground)]" },
};

/** Pesagem já decidida → resumo somente-leitura (decisão única, §7). */
function DecidedSummary({
  decided,
  onBack,
}: {
  decided: DecidedVerdict;
  onBack: () => void;
}): React.JSX.Element {
  const { data: criteria } = useCriteria();
  const labelByKey = React.useMemo(() => {
    const m: Record<string, string> = {};
    for (const c of criteria ?? []) m[c.key] = c.label;
    return m;
  }, [criteria]);

  const entries = Object.entries(decided.items) as [string, ItemResult][];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          Veredito registrado
          <Badge variant={VERDICT_BADGE[decided.verdict]}>{decided.verdict}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-sm text-[var(--color-muted-foreground)]">
          Esta pesagem já recebeu veredito (decisão única). Visualização somente leitura.
        </p>

        {decided.reason ? (
          <div>
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">Motivo</p>
            <p className="text-sm">{decided.reason}</p>
          </div>
        ) : null}

        {entries.length > 0 ? (
          <div className="flex flex-col gap-1">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">Checklist</p>
            {entries.map(([key, result]) => (
              <div key={key} className="flex items-center justify-between text-sm">
                <span>{labelByKey[key] ?? key}</span>
                <span className={RESULT_LABEL[result].className}>{RESULT_LABEL[result].label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <Button variant="outline" size="sm" className="w-fit" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden />
          Voltar à fila
        </Button>
      </CardContent>
    </Card>
  );
}
