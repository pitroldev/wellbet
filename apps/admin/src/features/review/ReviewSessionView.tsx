"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useReviewSession } from "@/shared/api/review";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/shared/ui";
import { VideoReviewer } from "./VideoReviewer";
import { ChecklistForm } from "./ChecklistForm";

/**
 * Tela de revisão de uma pesagem (Client): player (esquerda) + checklist e
 * veredito (direita). É a composição player + checklist + ação descrita na
 * Arquitetura §4 e na Validação §5/§7.
 */
export function ReviewSessionView({ sessionId }: { sessionId: string }): React.JSX.Element {
  const router = useRouter();
  const { data, isLoading, isError } = useReviewSession(sessionId);

  if (isLoading) {
    return <p className="text-sm text-[var(--color-muted-foreground)]">Carregando pesagem…</p>;
  }
  if (isError || !data) {
    return (
      <p className="text-sm text-[var(--color-verdict-rejected)]">
        Não foi possível carregar esta pesagem.
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">{data.userName}</h1>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            Captura {data.capture} · {data.weightKg.toFixed(1)} kg
            {data.previousWeightKg != null
              ? ` · anterior ${data.previousWeightKg.toFixed(1)} kg em ${data.weeks} sem`
              : ""}
          </p>
        </div>
        {data.sanityPassed ? (
          <Badge variant="approved">Sanidade OK</Badge>
        ) : (
          <Badge variant="rejected">Bloqueio de sanidade</Badge>
        )}
      </header>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>Evidência</CardTitle>
          </CardHeader>
          <CardContent>
            <VideoReviewer videos={data.videos} expectedCode={data.expectedCode} />
          </CardContent>
        </Card>

        <div>
          <ChecklistForm
            sessionId={data.id}
            onSubmitted={() => {
              // Volta para a fila após gravar o veredito.
              router.push("/review");
              router.refresh();
            }}
          />
        </div>
      </div>
    </div>
  );
}
