"use client";

import { R } from "./tokens";
import { Grain } from "./print-kit";

/** Moldura de celular RISO — borda dura de tinta, papel creme, proporção iPhone. */
export function Phone({
  children,
  label,
  tone = "paper",
}: {
  children: React.ReactNode;
  label?: string;
  tone?: "paper" | "ink";
}) {
  const dark = tone === "ink";
  return (
    <div className="flex shrink-0 flex-col items-center gap-3">
      <div
        className="relative w-[270px] overflow-hidden sm:w-[300px]"
        style={{
          aspectRatio: "9 / 19.5",
          background: dark ? R.ink : R.paper,
          border: `5px solid ${R.ink}`,
          borderRadius: 30,
          boxShadow: "6px 6px 0 0 " + R.ink,
        }}
      >
        {/* notch */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2">
          <div className="h-5 w-20 rounded-full" style={{ background: R.ink }} />
        </div>
        {/* status bar */}
        <div
          className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-5 pt-2.5 font-[family-name:var(--font-mono)] text-[11px] font-bold"
          style={{ color: dark ? R.paper : R.ink }}
        >
          <span className="tabular-nums">9:41</span>
          <span className="tabular-nums">5G</span>
        </div>
        <div className="absolute inset-0 overflow-y-auto pt-10">{children}</div>
        <Grain opacity={0.22} />
      </div>
      {label && (
        <span className="font-[family-name:var(--font-mono)] text-[11px] uppercase tracking-[0.18em]" style={{ color: R.ink }}>
          {label}
        </span>
      )}
    </div>
  );
}
