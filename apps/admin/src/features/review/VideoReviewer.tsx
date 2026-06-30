"use client";

import * as React from "react";
import {
  MediaController,
  MediaControlBar,
  MediaTimeRange,
  MediaTimeDisplay,
  MediaPlayButton,
  MediaMuteButton,
  MediaPlaybackRateButton,
  MediaFullscreenButton,
} from "media-chrome/react";
import { ChevronLeft, ChevronRight, Columns2, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { CAPTURES, type CaptureKind, type ExpectedCode } from "./types";

/**
 * Player de revisão (Client) — ferramentas forenses.
 *
 * Media Chrome sobre `<video>` puro (Arquitetura §4). Diferenciais para o
 * revisor: código esperado estruturado e legível (anti-replay), avanço
 * frame-a-frame (corte / número saindo do zero), modo COMPARAR lado a lado para
 * "mesma pessoa" (T0/T1/T2), e tempo preservado por captura — os 3 vídeos ficam
 * montados, só alternamos a visibilidade. Teclas (escopo do player): [ ] troca
 * captura, , . anda frame, espaço dá play/pause.
 */
export interface VideoReviewerProps {
  videos: Record<CaptureKind, string | null>;
  expectedCode: ExpectedCode | null;
  className?: string;
}

const FRAME = 1 / 30; // passo aproximado (~30fps)

const CAPTURE_LABEL: Record<CaptureKind, string> = {
  T0: "T0 · inicial",
  T1: "T1 · meio",
  T2: "T2 · final",
};

export function VideoReviewer({
  videos,
  expectedCode,
  className,
}: VideoReviewerProps): React.JSX.Element {
  const available = CAPTURES.filter((c) => videos[c]);
  const [active, setActive] = React.useState<CaptureKind>(available[0] ?? "T2");
  const [compare, setCompare] = React.useState(false);
  const refs = React.useRef<Record<CaptureKind, HTMLVideoElement | null>>({
    T0: null,
    T1: null,
    T2: null,
  });

  function frameStep(c: CaptureKind, dir: 1 | -1): void {
    const v = refs.current[c];
    if (!v) return;
    v.pause();
    v.currentTime = Math.max(0, v.currentTime + dir * FRAME);
  }

  function togglePlay(c: CaptureKind): void {
    const v = refs.current[c];
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }

  function switchCapture(dir: 1 | -1): void {
    if (available.length < 2) return;
    const i = available.indexOf(active);
    const next = available[(i + dir + available.length) % available.length]!;
    setActive(next);
  }

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key === ",") {
      e.preventDefault();
      frameStep(active, -1);
    } else if (e.key === ".") {
      e.preventDefault();
      frameStep(active, 1);
    } else if (e.key === "[") {
      e.preventDefault();
      switchCapture(-1);
    } else if (e.key === "]") {
      e.preventDefault();
      switchCapture(1);
    } else if (e.key === " ") {
      e.preventDefault();
      togglePlay(active);
    }
  }

  return (
    // tabIndex no container: as teclas do player só agem quando ele tem foco,
    // evitando conflito com os atalhos de veredito (que ignoram quando o foco
    // está em controles do player).
    <div
      className={cn("flex flex-col gap-3", className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-player-region
      aria-label="Player de evidência (foque e use [ ] para trocar captura, vírgula/ponto para frame, espaço para play)"
    >
      {/* Código esperado — leitura central do anti-replay, em alto contraste. */}
      {expectedCode ? (
        <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] p-3">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-[var(--color-muted-foreground)]">
            Código esperado · confira no vídeo (pessoa fala a palavra, mostra o número, faz o gesto)
          </p>
          <div className="mt-1.5 flex flex-wrap items-end gap-x-6 gap-y-2">
            <Field label="Palavra" value={expectedCode.word} />
            <Field label="Número" value={String(expectedCode.number)} big />
            <Field label="Gesto" value={expectedCode.gesture} />
          </div>
        </div>
      ) : (
        <div className="rounded-md border border-dashed border-[var(--color-border)] p-3 text-xs text-[var(--color-muted-foreground)]">
          Sem código dinâmico para esta captura.
        </div>
      )}

      {/* Abas de captura (tablist) + alternar comparação. */}
      <div className="flex items-center gap-2" role="tablist" aria-label="Capturas">
        {CAPTURES.map((c) => {
          const has = Boolean(videos[c]);
          return (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={!compare && active === c}
              aria-disabled={!has}
              disabled={!has || compare}
              onClick={() => setActive(c)}
              title={has ? CAPTURE_LABEL[c] : `${c} — sem vídeo`}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
                !compare && active === c
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
                (!has || compare) && "cursor-not-allowed opacity-40",
              )}
            >
              {c}
            </button>
          );
        })}
        {available.length >= 2 ? (
          <Button
            type="button"
            variant={compare ? "default" : "outline"}
            size="sm"
            className="ml-auto"
            aria-pressed={compare}
            onClick={() => setCompare((v) => !v)}
          >
            <Columns2 className="size-4" aria-hidden />
            {compare ? "Ver uma" : "Comparar"}
          </Button>
        ) : null}
      </div>

      {available.length === 0 ? (
        <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)]">
          Sem vídeo disponível.
        </div>
      ) : (
        <div className={cn(compare && "grid grid-cols-1 gap-3 lg:grid-cols-2")}>
          {CAPTURES.map((c) => {
            const src = videos[c];
            if (!src) return null;
            const show = compare || active === c;
            return (
              <div key={c} className={cn("flex flex-col gap-1.5", !show && "hidden")}>
                {compare ? (
                  <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
                    {CAPTURE_LABEL[c]}
                  </p>
                ) : null}
                <MediaController className="aspect-video w-full overflow-hidden rounded-md bg-black">
                  <video
                    slot="media"
                    ref={(el) => {
                      refs.current[c] = el;
                    }}
                    src={src}
                    preload="metadata"
                    playsInline
                    crossOrigin="anonymous"
                    className="size-full"
                  />
                  <MediaControlBar>
                    <MediaPlayButton />
                    <MediaMuteButton />
                    <MediaTimeRange />
                    <MediaTimeDisplay showDuration />
                    <MediaPlaybackRateButton rates={[0.25, 0.5, 1, 1.5, 2]} />
                    <MediaFullscreenButton />
                  </MediaControlBar>
                </MediaController>
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => frameStep(c, -1)}
                    aria-label={`Voltar um frame (${c})`}
                  >
                    <SkipBack className="size-4" aria-hidden />
                    Frame
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => frameStep(c, 1)}
                    aria-label={`Avançar um frame (${c})`}
                  >
                    Frame
                    <SkipForward className="size-4" aria-hidden />
                  </Button>
                  {!compare && available.length >= 2 ? (
                    <div className="ml-auto flex items-center gap-1 text-xs text-[var(--color-muted-foreground)]">
                      <ChevronLeft className="size-3" aria-hidden />[ / ]
                      <ChevronRight className="size-3" aria-hidden /> troca captura
                    </div>
                  ) : null}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Field({ label, value, big }: { label: string; value: string; big?: boolean }): React.JSX.Element {
  return (
    <div className="flex flex-col">
      <span className="text-[11px] uppercase tracking-wide text-[var(--color-muted-foreground)]">
        {label}
      </span>
      <span className={cn("font-mono font-semibold text-[var(--color-foreground)]", big ? "text-2xl leading-tight" : "text-base")}>
        {value}
      </span>
    </div>
  );
}
