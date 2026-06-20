"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ISO, SPRING } from "./tokens";

/**
 * IsoAvatar — avatar REAL (foto local de @/lib/avatars) dentro de uma
 * moldura isométrica colecionável: medalhão com borda viva + sombra SÓLIDA
 * deslocada (sem glow). É a "figurinha do squad". Substitui os antigos
 * bonecos de palito SVG.
 */
export function IsoAvatar({
  src,
  alt,
  size = 96,
  ring = ISO.purple,
  shadow = ISO.purpleDeep,
  className,
  hover = true,
}: {
  src: string;
  alt: string;
  size?: number;
  ring?: string;
  shadow?: string;
  className?: string;
  hover?: boolean;
}) {
  return (
    <motion.div
      whileHover={hover ? { y: -6, rotate: -2 } : undefined}
      transition={SPRING}
      className={cn("relative shrink-0", className)}
      style={{ width: size, height: size }}
    >
      {/* base losango (sombra tátil sob o medalhão) */}
      <div
        className="absolute left-1/2 -translate-x-1/2 rounded-[28%]"
        style={{
          bottom: -6,
          width: size * 0.82,
          height: size * 0.24,
          background: shadow,
          opacity: 0.55,
        }}
      />
      {/* moldura externa colorida */}
      <div
        className="relative grid h-full w-full place-items-center rounded-[26%]"
        style={{
          background: ring,
          border: `3px solid ${ISO.ink}`,
          boxShadow: `5px 6px 0 ${shadow}`,
          padding: Math.max(4, size * 0.07),
        }}
      >
        {/* foto recortada no medalhão */}
        <div
          className="h-full w-full overflow-hidden rounded-[22%]"
          style={{ border: `2.5px solid ${ISO.ink}` }}
        >
          <img
            src={src}
            alt={alt}
            width={size}
            height={size}
            className="h-full w-full object-cover"
            draggable={false}
          />
        </div>
      </div>
    </motion.div>
  );
}

/**
 * IsoAvatarCircle — variação em círculo (anel sólido), pra listas/rankings
 * onde o medalhão quadrado pesa demais.
 */
export function IsoAvatarCircle({
  src,
  alt,
  size = 56,
  ring = ISO.purple,
  className,
}: {
  src: string;
  alt: string;
  size?: number;
  ring?: string;
  className?: string;
}) {
  return (
    <div
      className={cn("relative shrink-0 overflow-hidden rounded-full", className)}
      style={{
        width: size,
        height: size,
        background: ring,
        border: `3px solid ${ISO.ink}`,
        padding: 3,
      }}
    >
      <img
        src={src}
        alt={alt}
        width={size}
        height={size}
        className="h-full w-full rounded-full object-cover"
        style={{ border: `2px solid ${ISO.ink}` }}
        draggable={false}
      />
    </div>
  );
}
