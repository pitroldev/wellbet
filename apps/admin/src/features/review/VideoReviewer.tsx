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
import { Badge } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { CAPTURES, type CaptureKind } from "./types";

/**
 * Player de revisão (Client).
 *
 * Usa Media Chrome sobre `<video>` puro (NÃO Vidstack — Arquitetura §4): o
 * revisor precisa de scrub frame-a-frame, controle de velocidade (conferir
 * gesto/zero da balança) e alternar entre os 3 vídeos (T0/T1/T2) para a
 * comparação de identidade da "Mesma pessoa" (Validação §5).
 *
 * `playbackRates` baixos ajudam a inspecionar cortes e o número saindo do zero.
 */
export interface VideoReviewerProps {
  /** URLs por captura; null quando aquela captura ainda não existe. */
  videos: Record<CaptureKind, string | null>;
  /** Código dinâmico esperado para conferência anti-replay. */
  expectedCode: string;
  className?: string;
}

export function VideoReviewer({
  videos,
  expectedCode,
  className,
}: VideoReviewerProps): React.JSX.Element {
  const available = CAPTURES.filter((c) => videos[c]);
  const [active, setActive] = React.useState<CaptureKind>(available[0] ?? "T2");
  const src = videos[active];

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {/* Alternância T0/T1/T2 — comparação de identidade entre capturas. */}
      <div className="flex items-center gap-2">
        {CAPTURES.map((c) => {
          const has = Boolean(videos[c]);
          return (
            <button
              key={c}
              type="button"
              disabled={!has}
              onClick={() => setActive(c)}
              className={cn(
                "rounded-md px-3 py-1 text-sm font-medium transition-colors",
                active === c
                  ? "bg-[var(--color-primary)] text-[var(--color-primary-foreground)]"
                  : "bg-[var(--color-muted)] text-[var(--color-muted-foreground)]",
                !has && "cursor-not-allowed opacity-40",
              )}
            >
              {c}
            </button>
          );
        })}
        <span className="ml-auto flex items-center gap-2 text-sm">
          Código esperado:
          <Badge variant="pending">{expectedCode}</Badge>
        </span>
      </div>

      {src ? (
        <MediaController className="aspect-video w-full overflow-hidden rounded-md bg-black">
          {/* <video> puro por baixo: sem dependência de runtime de framework. */}
          <video
            slot="media"
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
            {/* Velocidades reduzidas para inspeção frame-a-frame. */}
            <MediaPlaybackRateButton rates={[0.25, 0.5, 1, 1.5, 2]} />
            <MediaFullscreenButton />
          </MediaControlBar>
        </MediaController>
      ) : (
        <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)]">
          Sem vídeo para {active}.
        </div>
      )}
    </div>
  );
}
