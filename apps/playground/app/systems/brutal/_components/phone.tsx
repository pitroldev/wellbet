"use client";

import { B, shadow } from "./tokens";

/** Moldura de celular brutalista — borda dura, sombra sólida, proporção iPhone. */
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
          background: dark ? B.ink : B.paper,
          border: `4px solid ${B.ink}`,
          boxShadow: shadow(10),
          borderRadius: 4,
        }}
      >
        {/* notch retangular brutalista */}
        <div className="pointer-events-none absolute left-1/2 top-2 z-30 -translate-x-1/2">
          <div className="h-5 w-20" style={{ background: B.ink }} />
        </div>
        {/* status bar mono */}
        <div
          className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-4 pt-2.5 font-[family-name:var(--font-mono)] text-[11px] font-bold tabular-nums"
          style={{ color: dark ? "#FFFFFF" : B.ink }}
        >
          <span>9:41</span>
          <span>5G</span>
        </div>
        <div className="absolute inset-0 overflow-y-auto pt-10">{children}</div>
      </div>
      {label && (
        <span className="font-[family-name:var(--font-mono)] text-[11px] font-bold uppercase tracking-widest" style={{ color: B.ink, opacity: 0.6 }}>
          {label}
        </span>
      )}
    </div>
  );
}
