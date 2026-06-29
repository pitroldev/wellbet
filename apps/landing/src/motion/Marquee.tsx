import type { CSSProperties, JSX, ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Ticker/marquee infinito (CSS puro, GPU). Conteúdo duplicado desliza -50% em
 * loop perfeito; pausa no hover. Server Component — zero JS.
 */
export function Marquee({
  children,
  className,
  durationSec = 30,
  reverse = false,
}: {
  children: ReactNode;
  className?: string;
  durationSec?: number;
  reverse?: boolean;
}): JSX.Element {
  return (
    <div
      className={cn("flex w-full overflow-hidden", className)}
      style={
        {
          maskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
          WebkitMaskImage: "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        } as CSSProperties
      }
      aria-hidden
    >
      <div
        className="flex shrink-0 items-center hover:[animation-play-state:paused] motion-reduce:[animation:none]"
        style={{
          animation: `marquee ${durationSec}s linear infinite`,
          animationDirection: reverse ? "reverse" : "normal",
        }}
      >
        <span className="flex shrink-0 items-center">{children}</span>
        <span className="flex shrink-0 items-center">{children}</span>
      </div>
    </div>
  );
}
