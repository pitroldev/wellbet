"use client";

import { N } from "./tokens";

/**
 * Moldura de celular Cassino Neon — escura, premium, proporção iPhone (~9/19.5).
 * Conteúdo em overflow-y-auto. Glow neon sutil na borda.
 */
export function Phone({
  children,
  label,
  glow = N.magenta,
}: {
  children: React.ReactNode;
  label?: string;
  glow?: string;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div
        className="relative w-[270px] overflow-hidden rounded-[2.8rem] sm:w-[300px]"
        style={{
          aspectRatio: "9 / 19.5",
          background: N.groundDeep,
          border: `9px solid #05060F`,
          boxShadow: `0 30px 70px -28px rgba(0,0,0,.9), 0 0 26px ${glow}44`,
        }}
      >
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2">
          <div className="h-6 w-24 rounded-full bg-black" />
        </div>
        {/* status bar */}
        <div className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-bold text-white">
          <span className="tabular-nums">9:41</span>
          <span className="tabular-nums">5G</span>
        </div>
        <div className="absolute inset-0 overflow-y-auto pt-11">{children}</div>
      </div>
      {label && (
        <span
          className="font-[family-name:var(--font-mono)] text-xs font-bold uppercase tracking-[0.2em]"
          style={{ color: N.mute }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
