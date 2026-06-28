"use client";

import { M } from "./tokens";

/** Moldura de celular Editorial / muma — proporção iPhone (~9/19.5), conteúdo rolável.
 *  `bg` define o fundo da tela (claro, pink ou indigo). `statusDark` p/ texto branco. */
export function Phone({
  children,
  label,
  bg = M.paper,
  statusDark = false,
}: {
  children: React.ReactNode;
  label?: string;
  bg?: string;
  statusDark?: boolean;
}) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div
        className="relative w-[270px] overflow-hidden rounded-[2.8rem] sm:w-[300px]"
        style={{
          aspectRatio: "9 / 19.5",
          background: bg,
          border: `9px solid ${M.ink}`,
          boxShadow: "0 30px 60px -28px rgba(50,21,173,.5)",
        }}
      >
        {/* dynamic island */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2">
          <div className="h-6 w-24 rounded-full bg-black" />
        </div>
        {/* status bar */}
        <div
          className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pt-3 text-[11px] font-bold"
          style={{ color: statusDark ? "#fff" : M.ink }}
        >
          <span className="tabular-nums">9:41</span>
          <span className="tabular-nums">5G</span>
        </div>
        <div className="absolute inset-0 overflow-y-auto pt-11">{children}</div>
      </div>
      {label && (
        <span className="font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-[0.24em]" style={{ color: M.inkMute }}>
          {label}
        </span>
      )}
    </div>
  );
}
