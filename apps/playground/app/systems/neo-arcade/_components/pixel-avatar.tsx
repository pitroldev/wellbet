"use client";

import { cn } from "@/lib/utils";

/**
 * Real avatar inside a stepped "pixel" ring — like the character-select frame
 * of an old arcade game. Real people only (no stick figures).
 * Asset is LOCAL (/avatars/uNN.jpg) and rendered with a plain <img>.
 *
 * The pixel feel comes from:
 *  - a square (radius 0) crop,
 *  - a stepped ring built from stacked box-shadows,
 *  - a subtle saturate/contrast so the photo sits inside the arcade palette.
 */
export function PixelAvatar({
  src,
  alt,
  size = 72,
  ring = "#6D28D9",
  glow,
  className,
  dim = false,
}: {
  src: string;
  alt: string;
  size?: number;
  ring?: string;
  /** optional outer glow color (use win-verde ONLY on real victories) */
  glow?: string;
  className?: string;
  /** dim a pending / not-yet-done member without humiliating them */
  dim?: boolean;
}) {
  // stepped ring: two stacked hard shadows = a 2-tone pixel border
  const shadow = [`0 0 0 3px #120A24`, `0 0 0 6px ${ring}`, glow ? `0 0 18px 0 ${glow}` : null]
    .filter(Boolean)
    .join(", ");

  return (
    <div
      className={cn("relative inline-block shrink-0", className)}
      style={{ width: size, height: size }}
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        loading="lazy"
        className="block h-full w-full object-cover"
        style={{
          boxShadow: shadow,
          imageRendering: "auto",
          filter: dim
            ? "grayscale(0.8) brightness(0.7) saturate(0.6)"
            : "saturate(1.05) contrast(1.05)",
        }}
      />
      {/* corner pixel notches to sell the 8-bit frame (radius 0 everywhere) */}
      <span
        aria-hidden
        className="pointer-events-none absolute -left-[6px] -top-[6px] h-[6px] w-[6px]"
        style={{ background: "#120A24" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -right-[6px] -top-[6px] h-[6px] w-[6px]"
        style={{ background: "#120A24" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[6px] -left-[6px] h-[6px] w-[6px]"
        style={{ background: "#120A24" }}
      />
      <span
        aria-hidden
        className="pointer-events-none absolute -bottom-[6px] -right-[6px] h-[6px] w-[6px]"
        style={{ background: "#120A24" }}
      />
    </div>
  );
}
