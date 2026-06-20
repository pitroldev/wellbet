"use client";

import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, type MotionStyle } from "framer-motion";
import { cn } from "@/lib/utils";
import { ISO, SPRING } from "./tokens";

/**
 * IsoCube — o cubo isométrico do topo do moodboard.
 * Render puro em CSS: face do topo (clara), face esquerda (média) e
 * face direita (escura), formando volume tátil sem nenhum glow.
 */
export function IsoCube({
  size = 64,
  top = ISO.purpleSoft,
  left = ISO.purple,
  right = ISO.purpleDeep,
  className,
  children,
}: {
  size?: number;
  top?: string;
  left?: string;
  right?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const h = size; // altura visual do cubo
  const w = size; // largura da base losango
  return (
    <div className={cn("relative", className)} style={{ width: w, height: h * 1.18 }} aria-hidden>
      {/* topo (losango) */}
      <div
        className="absolute left-1/2 top-0"
        style={{
          width: w * 0.72,
          height: w * 0.72,
          background: top,
          transform: "translateX(-50%) rotate(45deg) scaleY(0.577)",
          transformOrigin: "center",
          borderRadius: w * 0.09,
        }}
      />
      {/* face esquerda */}
      <div
        className="absolute left-0"
        style={{
          top: h * 0.295,
          width: w * 0.5,
          height: h * 0.62,
          background: left,
          transform: "skewY(30deg)",
          borderBottomLeftRadius: w * 0.08,
          borderTopLeftRadius: w * 0.04,
        }}
      />
      {/* face direita */}
      <div
        className="absolute right-0"
        style={{
          top: h * 0.295,
          width: w * 0.5,
          height: h * 0.62,
          background: right,
          transform: "skewY(-30deg)",
          borderBottomRightRadius: w * 0.08,
          borderTopRightRadius: w * 0.04,
        }}
      />
      {children}
    </div>
  );
}

/**
 * IsoTilt — container com perspectiva que inclina o filho em 3D conforme
 * o mouse (rotateX/rotateY com spring). É o "pegue na mão" do sistema.
 */
export function IsoTilt({
  children,
  className,
  intensity = 12,
  lift = true,
}: {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  lift?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const rx = useSpring(useTransform(py, [0, 1], [intensity, -intensity]), SPRING);
  const ry = useSpring(useTransform(px, [0, 1], [-intensity, intensity]), SPRING);
  const scale = useSpring(1, SPRING);

  function track(clientX: number, clientY: number) {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    px.set((clientX - r.left) / r.width);
    py.set((clientY - r.top) / r.height);
  }
  // Pointer events cobrem mouse E toque (mobile-first, sem hover-only).
  function onPointerMove(e: React.PointerEvent) {
    track(e.clientX, e.clientY);
  }
  function onPointerDown(e: React.PointerEvent) {
    if (lift) scale.set(1.04);
    track(e.clientX, e.clientY);
  }
  function onLeave() {
    px.set(0.5);
    py.set(0.5);
    scale.set(1);
  }
  function onEnter() {
    if (lift) scale.set(1.03);
  }

  const style: MotionStyle = {
    rotateX: rx,
    rotateY: ry,
    scale,
    transformStyle: "preserve-3d",
  };

  return (
    <div
      ref={ref}
      onPointerMove={onPointerMove}
      onPointerDown={onPointerDown}
      onPointerUp={onEnter}
      onPointerLeave={onLeave}
      onPointerCancel={onLeave}
      onMouseEnter={onEnter}
      className={cn("touch-manipulation", className)}
      style={{ perspective: 900 }}
    >
      <motion.div style={style}>{children}</motion.div>
    </div>
  );
}

/**
 * IsoCard — superfície base do sistema: cantos arredondados, borda viva
 * e sombra SÓLIDA deslocada. Aceita uma cor de sombra.
 */
export function IsoCard({
  children,
  className,
  shadow = ISO.purpleDeep,
  border = ISO.ink,
  bg = "#FFFFFF",
  offset = 10,
}: {
  children: React.ReactNode;
  className?: string;
  shadow?: string;
  border?: string;
  bg?: string;
  offset?: number;
}) {
  return (
    <div
      className={cn("rounded-[26px]", className)}
      style={{
        background: bg,
        border: `3px solid ${border}`,
        boxShadow: `${offset}px ${offset}px 0 ${shadow}`,
      }}
    >
      {children}
    </div>
  );
}

/** Pill/tag colecionável. */
export function IsoTag({
  children,
  bg = ISO.yellow,
  fg = ISO.ink,
  className,
}: {
  children: React.ReactNode;
  bg?: string;
  fg?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        className,
      )}
      style={{ background: bg, color: fg, border: `2px solid ${ISO.ink}` }}
    >
      {children}
    </span>
  );
}

/** Botão "brinquedo": face superior + sombra sólida que afunda no press. */
export function IsoButton({
  children,
  onClick,
  bg = ISO.purple,
  fg = "#FFFFFF",
  shadow = ISO.purpleDeep,
  className,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  bg?: string;
  fg?: string;
  shadow?: string;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      disabled={disabled}
      initial={false}
      whileHover={disabled ? undefined : { x: -1, y: -3, boxShadow: `7px 9px 0 ${shadow}` }}
      whileTap={disabled ? undefined : { x: 3, y: 4, boxShadow: `2px 2px 0 ${shadow}` }}
      transition={SPRING}
      className={cn(
        "relative min-h-[48px] touch-manipulation rounded-2xl px-6 py-3 text-base font-bold uppercase tracking-wide font-[family-name:var(--font-display)] disabled:opacity-50",
        className,
      )}
      style={{
        background: bg,
        color: fg,
        border: `3px solid ${ISO.ink}`,
        boxShadow: `5px 6px 0 ${shadow}`,
      }}
    >
      {children}
    </motion.button>
  );
}
