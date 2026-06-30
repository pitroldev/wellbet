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
import {
  Columns2,
  KeyRound,
  MoveHorizontal,
  Pause,
  Play,
  SkipBack,
  SkipForward,
  Square,
  SquareStack,
} from "lucide-react";
import { Button } from "@/shared/ui";
import { cn } from "@/lib/utils";
import { CAPTURES, type CaptureKind, type ExpectedCode } from "./types";

/**
 * Player de revisão (Client) — ferramentas forenses.
 *
 * Três visões, selecionadas por ABAS (segmented):
 *  - Individual: um vídeo por vez (largura limitada), abas de captura T0/T1/T2.
 *  - Lado a lado: as capturas em grade (varredura rápida).
 *  - Sobrepor: duas capturas EMPILHADAS no mesmo quadro, com uma DIVISÓRIA
 *    arrastável (estilo before/after) — ideal para "mesma pessoa": arrasta a
 *    linha e o rosto de uma captura cobre o da outra.
 *
 * Teclas (foco no player): , . frame · espaço play · [ ] troca captura (individual).
 */
export interface VideoReviewerProps {
  videos: Record<CaptureKind, string | null>;
  expectedCode: ExpectedCode | null;
  className?: string;
}

type View = "single" | "side" | "overlay";

const FRAME = 1 / 30;
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
  const canCompare = available.length >= 2;

  const [view, setView] = React.useState<View>("single");
  const [active, setActive] = React.useState<CaptureKind>(available[0] ?? "T2");
  const [aCap, setACap] = React.useState<CaptureKind>(available[0] ?? "T0");
  const [bCap, setBCap] = React.useState<CaptureKind>(available[1] ?? available[0] ?? "T2");
  const [divider, setDivider] = React.useState(50);

  const refs = React.useRef<Record<CaptureKind, HTMLVideoElement | null>>({
    T0: null,
    T1: null,
    T2: null,
  });
  const ovA = React.useRef<HTMLVideoElement | null>(null);
  const ovB = React.useRef<HTMLVideoElement | null>(null);
  const boxRef = React.useRef<HTMLDivElement | null>(null);

  function step(v: HTMLVideoElement | null, dir: 1 | -1): void {
    if (!v) return;
    v.pause();
    v.currentTime = Math.max(0, v.currentTime + dir * FRAME);
  }
  function toggle(v: HTMLVideoElement | null): void {
    if (!v) return;
    if (v.paused) void v.play();
    else v.pause();
  }
  function bothStep(dir: 1 | -1): void {
    step(ovA.current, dir);
    step(ovB.current, dir);
  }
  function bothToggle(): void {
    const playing = ovA.current && !ovA.current.paused;
    for (const v of [ovA.current, ovB.current]) {
      if (!v) continue;
      if (playing) v.pause();
      else void v.play();
    }
  }

  function switchCapture(dir: 1 | -1): void {
    if (available.length < 2) return;
    const i = available.indexOf(active);
    setActive(available[(i + dir + available.length) % available.length]!);
  }

  function onKeyDown(e: React.KeyboardEvent): void {
    if (e.key === ",") {
      e.preventDefault();
      if (view === "overlay") bothStep(-1);
      else step(refs.current[active], -1);
    } else if (e.key === ".") {
      e.preventDefault();
      if (view === "overlay") bothStep(1);
      else step(refs.current[active], 1);
    } else if (e.key === " ") {
      e.preventDefault();
      if (view === "overlay") bothToggle();
      else toggle(refs.current[active]);
    } else if ((e.key === "[" || e.key === "]") && view === "single") {
      e.preventDefault();
      switchCapture(e.key === "[" ? -1 : 1);
    }
  }

  // Arrasto da divisória (pointer events: mouse + touch).
  function startDrag(e: React.PointerEvent): void {
    e.preventDefault();
    const box = boxRef.current;
    if (!box) return;
    function move(ev: PointerEvent): void {
      const r = box!.getBoundingClientRect();
      setDivider(Math.max(0, Math.min(100, ((ev.clientX - r.left) / r.width) * 100)));
    }
    function up(): void {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    }
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
  }

  return (
    <div
      className={cn("flex flex-col gap-3", className)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      data-player-region
      aria-label="Player de evidência. Teclas: vírgula/ponto frame, espaço play, colchetes trocam captura."
    >
      {expectedCode ? (
        <div
          className="flex flex-wrap items-center gap-x-2.5 gap-y-1 rounded-md border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-2"
          title="Confira no vídeo: a pessoa diz a palavra, mostra o número e faz o gesto."
        >
          <span className="inline-flex shrink-0 items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide leading-none text-[var(--color-muted-foreground)]">
            <KeyRound className="size-3.5" aria-hidden />
            Código esperado
          </span>
          <p className="flex min-w-0 items-center gap-1.5 font-mono text-sm leading-none text-[var(--color-foreground)]">
            <span className="font-semibold">{expectedCode.word}</span>
            <span className="font-normal text-[var(--color-muted-foreground)]" aria-hidden>
              ·
            </span>
            <span className="text-lg font-bold tabular-nums text-[var(--color-primary)]">
              {expectedCode.number}
            </span>
            <span className="font-normal text-[var(--color-muted-foreground)]" aria-hidden>
              ·
            </span>
            <span className="font-semibold">{expectedCode.gesture}</span>
          </p>
        </div>
      ) : null}

      {/* Seletor de MODO (abas com ícone). Comparações só com 2+ capturas. */}
      <Segmented
        ariaLabel="Modo de visualização"
        value={view}
        onChange={(v) => setView(v)}
        options={[
          { value: "single", label: <ModeLabel icon={<Square className="size-4" />} text="Individual" /> },
          {
            value: "side",
            label: <ModeLabel icon={<Columns2 className="size-4" />} text="Lado a lado" />,
            disabled: !canCompare,
          },
          {
            value: "overlay",
            label: <ModeLabel icon={<SquareStack className="size-4" />} text="Sobrepor" />,
            disabled: !canCompare,
          },
        ]}
      />

      {available.length === 0 ? (
        <div className="flex aspect-video w-full items-center justify-center rounded-md border border-dashed border-[var(--color-border)] text-sm text-[var(--color-muted-foreground)]">
          Sem vídeo disponível.
        </div>
      ) : view === "single" ? (
        <SingleView
          videos={videos}
          available={available}
          active={active}
          onActive={setActive}
          refs={refs}
          onStep={(d) => step(refs.current[active], d)}
        />
      ) : view === "side" ? (
        <SideView videos={videos} available={available} refs={refs} onStep={step} />
      ) : (
        <OverlayView
          videos={videos}
          available={available}
          aCap={aCap}
          bCap={bCap}
          onA={setACap}
          onB={setBCap}
          divider={divider}
          setDivider={setDivider}
          boxRef={boxRef}
          ovA={ovA}
          ovB={ovB}
          startDrag={startDrag}
        />
      )}
    </div>
  );
}

/* ------------------------------- subviews -------------------------------- */

function SingleView({
  videos,
  available,
  active,
  onActive,
  refs,
  onStep,
}: {
  videos: Record<CaptureKind, string | null>;
  available: CaptureKind[];
  active: CaptureKind;
  onActive: (c: CaptureKind) => void;
  refs: React.RefObject<Record<CaptureKind, HTMLVideoElement | null>>;
  onStep: (dir: 1 | -1) => void;
}): React.JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      {/* Abas de captura (segmented). */}
      <Segmented
        ariaLabel="Captura"
        value={active}
        onChange={onActive}
        options={CAPTURES.map((c) => ({
          value: c,
          label: c,
          disabled: !videos[c],
        }))}
      />
      {/* Largura limitada quando é UM vídeo só. */}
      <div className="mx-auto w-full max-w-2xl">
        {CAPTURES.map((c) => {
          const src = videos[c];
          if (!src) return null;
          return (
            <div key={c} className={cn("flex flex-col gap-1.5", active !== c && "hidden")}>
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
            </div>
          );
        })}
        <FrameBar
          className="mt-1.5"
          onPrev={() => onStep(-1)}
          onNext={() => onStep(1)}
          hint={available.length >= 2 ? "[ / ] troca captura" : undefined}
        />
      </div>
    </div>
  );
}

function SideView({
  videos,
  available,
  refs,
  onStep,
}: {
  videos: Record<CaptureKind, string | null>;
  available: CaptureKind[];
  refs: React.RefObject<Record<CaptureKind, HTMLVideoElement | null>>;
  onStep: (v: HTMLVideoElement | null, dir: 1 | -1) => void;
}): React.JSX.Element {
  return (
    // Colunas = nº de capturas disponíveis → preenchem TODA a largura, sem
    // coluna vazia; cada vídeo expande para ocupar seu espaço.
    <div
      className="grid gap-3"
      style={{ gridTemplateColumns: `repeat(${String(available.length)}, minmax(0, 1fr))` }}
    >
      {available.map((c) => {
        const src = videos[c];
        if (!src) return null;
        return (
          <div key={c} className="flex flex-col gap-1.5">
            <p className="text-xs font-medium text-[var(--color-muted-foreground)]">
              {CAPTURE_LABEL[c]}
            </p>
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
                <MediaTimeRange />
                <MediaPlaybackRateButton rates={[0.25, 0.5, 1, 1.5, 2]} />
                <MediaFullscreenButton />
              </MediaControlBar>
            </MediaController>
            <FrameBar onPrev={() => onStep(refs.current[c], -1)} onNext={() => onStep(refs.current[c], 1)} />
          </div>
        );
      })}
    </div>
  );
}

function OverlayView({
  videos,
  available,
  aCap,
  bCap,
  onA,
  onB,
  divider,
  setDivider,
  boxRef,
  ovA,
  ovB,
  startDrag,
}: {
  videos: Record<CaptureKind, string | null>;
  available: CaptureKind[];
  aCap: CaptureKind;
  bCap: CaptureKind;
  onA: (c: CaptureKind) => void;
  onB: (c: CaptureKind) => void;
  divider: number;
  setDivider: (n: number) => void;
  boxRef: React.RefObject<HTMLDivElement | null>;
  ovA: React.RefObject<HTMLVideoElement | null>;
  ovB: React.RefObject<HTMLVideoElement | null>;
  startDrag: (e: React.PointerEvent) => void;
}): React.JSX.Element {
  const capOptions = available.map((c) => ({ value: c, label: c }));
  // Cada vídeo é controlado INDEPENDENTEMENTE (achar o frame do rosto em cada
  // captura antes de sobrepor). Progresso/play vêm dos eventos do <video>.
  const [progA, setProgA] = React.useState(0);
  const [progB, setProgB] = React.useState(0);
  const [playA, setPlayA] = React.useState(false);
  const [playB, setPlayB] = React.useState(false);
  const ctlA = videoCtl(ovA);
  const ctlB = videoCtl(ovB);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs">
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-[var(--color-muted-foreground)]">Esquerda</span>
          <Segmented ariaLabel="Captura à esquerda" value={aCap} onChange={onA} options={capOptions} size="sm" />
        </span>
        <span className="flex items-center gap-1.5">
          <span className="font-medium text-[var(--color-muted-foreground)]">Direita</span>
          <Segmented ariaLabel="Captura à direita" value={bCap} onChange={onB} options={capOptions} size="sm" />
        </span>
      </div>

      {/* Caixa de sobreposição: B por baixo (inteiro), A por cima recortado até a divisória. */}
      <div
        ref={boxRef}
        className="relative aspect-video w-full select-none overflow-hidden rounded-md bg-black"
      >
        <video
          ref={ovB}
          src={videos[bCap] ?? undefined}
          muted
          playsInline
          preload="metadata"
          crossOrigin="anonymous"
          onTimeUpdate={(e) => setProgB(progressPct(e.currentTarget))}
          onPlay={() => setPlayB(true)}
          onPause={() => setPlayB(false)}
          className="absolute inset-0 size-full object-contain"
        />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${String(100 - divider)}% 0 0)` }}>
          <video
            ref={ovA}
            src={videos[aCap] ?? undefined}
            muted
            playsInline
            preload="metadata"
            crossOrigin="anonymous"
            onTimeUpdate={(e) => setProgA(progressPct(e.currentTarget))}
            onPlay={() => setPlayA(true)}
            onPause={() => setPlayA(false)}
            className="absolute inset-0 size-full object-contain"
          />
        </div>

        <span className="absolute left-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
          {aCap}
        </span>
        <span className="absolute right-2 top-2 rounded bg-black/60 px-1.5 py-0.5 text-xs font-medium text-white">
          {bCap}
        </span>

        {/* Divisória arrastável. */}
        <div
          role="slider"
          aria-label="Divisória de comparação"
          aria-valuenow={Math.round(divider)}
          aria-valuemin={0}
          aria-valuemax={100}
          tabIndex={0}
          onPointerDown={startDrag}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setDivider(Math.max(0, divider - 2));
            else if (e.key === "ArrowRight") setDivider(Math.min(100, divider + 2));
          }}
          className="absolute inset-y-0 -ml-3 w-6 cursor-ew-resize touch-none"
          style={{ left: `${String(divider)}%` }}
        >
          <div className="mx-auto h-full w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,0.4)]" />
          <div className="absolute left-1/2 top-1/2 flex size-7 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow">
            <MoveHorizontal className="size-4" aria-hidden />
          </div>
        </div>
      </div>

      {/* Controle INDEPENDENTE de cada vídeo (alinhar o frame do rosto em cada
          captura antes de sobrepor). */}
      <div className="flex flex-col gap-2">
        <ControlRow label={`Esq · ${aCap}`} playing={playA} progress={progA} ctl={ctlA} />
        <ControlRow label={`Dir · ${bCap}`} playing={playB} progress={progB} ctl={ctlB} />
      </div>
      <p className="text-[11px] text-[var(--color-muted-foreground)]">
        Ajuste cada vídeo até o frame do rosto e arraste a linha para sobrepor.
      </p>
    </div>
  );
}

/* ------------------------------- primitives ------------------------------ */

interface VideoCtl {
  toggle: () => void;
  step: (dir: 1 | -1) => void;
  seek: (pct: number) => void;
}

function videoCtl(ref: React.RefObject<HTMLVideoElement | null>): VideoCtl {
  return {
    toggle: () => {
      const v = ref.current;
      if (!v) return;
      if (v.paused) void v.play();
      else v.pause();
    },
    step: (dir) => {
      const v = ref.current;
      if (!v) return;
      v.pause();
      v.currentTime = Math.max(0, v.currentTime + dir * FRAME);
    },
    seek: (pct) => {
      const v = ref.current;
      if (v && Number.isFinite(v.duration)) v.currentTime = (pct / 100) * v.duration;
    },
  };
}

function progressPct(v: HTMLVideoElement): number {
  return v.duration ? (v.currentTime / v.duration) * 100 : 0;
}

/** Linha de controle de UM vídeo na sobreposição (play/pause + frame + scrub). */
function ControlRow({
  label,
  playing,
  progress,
  ctl,
}: {
  label: string;
  playing: boolean;
  progress: number;
  ctl: VideoCtl;
}): React.JSX.Element {
  return (
    <div className="flex items-center gap-2">
      <span className="w-24 shrink-0 truncate text-xs font-medium text-[var(--color-muted-foreground)]">
        {label}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={ctl.toggle}
        aria-label={playing ? "Pausar" : "Reproduzir"}
      >
        {playing ? (
          <Pause className="size-4" aria-hidden />
        ) : (
          <Play className="size-4" aria-hidden />
        )}
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => ctl.step(-1)}
        aria-label="Frame anterior"
      >
        <SkipBack className="size-4" aria-hidden />
      </Button>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => ctl.step(1)}
        aria-label="Próximo frame"
      >
        <SkipForward className="size-4" aria-hidden />
      </Button>
      <input
        type="range"
        min={0}
        max={100}
        value={progress}
        onChange={(e) => ctl.seek(Number(e.target.value))}
        aria-label={`Posição · ${label}`}
        className="h-1.5 min-w-[6rem] flex-1 cursor-pointer accent-[var(--color-primary)]"
      />
    </div>
  );
}

/** Rótulo de aba de modo com ícone. */
function ModeLabel({ icon, text }: { icon: React.ReactNode; text: string }): React.JSX.Element {
  return (
    <span className="flex items-center gap-1.5">
      {icon}
      {text}
    </span>
  );
}

function Segmented<T extends string>({
  options,
  value,
  onChange,
  ariaLabel,
  size,
}: {
  options: { value: T; label: React.ReactNode; disabled?: boolean }[];
  value: T;
  onChange: (v: T) => void;
  ariaLabel: string;
  size?: "sm";
}): React.JSX.Element {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className="inline-flex w-fit gap-0.5 rounded-md bg-[var(--color-muted)] p-0.5"
    >
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          disabled={o.disabled}
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-ring)]",
            size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm",
            value === o.value
              ? "bg-[var(--color-card)] text-[var(--color-foreground)] shadow-sm"
              : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]",
            o.disabled && "cursor-not-allowed opacity-40",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function FrameBar({
  onPrev,
  onNext,
  hint,
  className,
}: {
  onPrev: () => void;
  onNext: () => void;
  hint?: string;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Button type="button" variant="outline" size="sm" onClick={onPrev} aria-label="Voltar um frame">
        <SkipBack className="size-4" aria-hidden />
        Frame
      </Button>
      <Button type="button" variant="outline" size="sm" onClick={onNext} aria-label="Avançar um frame">
        Frame
        <SkipForward className="size-4" aria-hidden />
      </Button>
      {hint ? (
        <span className="ml-auto text-xs text-[var(--color-muted-foreground)]">{hint}</span>
      ) : null}
    </div>
  );
}

