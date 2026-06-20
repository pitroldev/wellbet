"use client";

import { ISO } from "./tokens";

/**
 * PhoneFrame — moldura de celular tátil (estilo Iso-Gacha): borda grossa,
 * cantos arredondados, notch, sombra sólida deslocada. Conteúdo rolável dentro.
 */
export function PhoneFrame({
  children,
  label,
  shadow = ISO.purpleDeep,
}: {
  children: React.ReactNode;
  label?: string;
  shadow?: string;
}) {
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative w-full max-w-[330px] overflow-hidden rounded-[2.6rem]"
        style={{
          aspectRatio: "9 / 19.5",
          background: ISO.base,
          border: `5px solid ${ISO.ink}`,
          boxShadow: `10px 12px 0 ${shadow}`,
        }}
      >
        {/* notch */}
        <div className="pointer-events-none absolute left-1/2 top-0 z-30 -translate-x-1/2">
          <div className="mt-1.5 h-5 w-28 rounded-full" style={{ background: ISO.ink }} />
        </div>
        {/* status bar */}
        <div
          className="absolute left-0 right-0 top-0 z-20 flex items-center justify-between px-6 pt-2.5 text-[11px] font-bold"
          style={{ color: ISO.ink }}
        >
          <span className="tabular-nums">9:41</span>
          <span className="tabular-nums">5G</span>
        </div>
        {/* conteúdo rolável */}
        <div className="absolute inset-0 overflow-y-auto pt-9">{children}</div>
      </div>
      {label && (
        <span
          className="text-xs font-bold uppercase tracking-widest"
          style={{ color: ISO.inkSoft }}
        >
          {label}
        </span>
      )}
    </div>
  );
}
