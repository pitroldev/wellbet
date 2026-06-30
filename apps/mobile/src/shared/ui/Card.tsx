/**
 * Card FROSTED — a casca padrão do Midnight Aurora. Vidro translúcido sobre a
 * aurora, canto generoso (rounded-3xl), sheen de luz no topo e hairline que capta
 * o brilho. Profundidade vem de vidro + sheen + aurora (NUNCA sombra RN colorida,
 * que vira cinza no Android).
 *
 *  - `surface="glass"` (padrão) = vidro translúcido; `"solid"` = navy elevado;
 *    `"paper"` = bloco claro (ritmo claro/escuro).
 *  - `accent`  = barra de gradiente no topo (magenta ou verde).
 *  - `glow`    = borda HAIRLINE em gradiente (card de herói, luminoso).
 */
import { View, type ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import { gradients, radius } from "@/theme/tokens";

type Surface = "glass" | "solid" | "paper";
type Accent = "none" | "magenta" | "green";

export interface CardProps extends ViewProps {
  surface?: Surface;
  accent?: Accent;
  /** Borda hairline em gradiente — para cards de herói. */
  glow?: boolean;
  className?: string;
}

const surfaceClass: Record<Surface, string> = {
  glass: "bg-arena-glass",
  solid: "bg-arena-navy-soft",
  paper: "bg-paper",
};

const accentColors: Record<Exclude<Accent, "none">, readonly [string, string]> = {
  magenta: [gradients.gymbet[0], gradients.gymbetSoft[1]],
  green: [gradients.victory[0], "#7BFFDC"],
};

export function Card({
  surface = "glass",
  accent = "none",
  glow = false,
  className,
  children,
  style,
  ...props
}: CardProps) {
  const inner = (
    <View
      {...props}
      style={[{ borderRadius: glow ? radius["2xl"] - 1 : radius["2xl"] }, style]}
      className={`relative overflow-hidden p-5 ${surfaceClass[surface]} ${
        glow ? "" : surface === "paper" ? "" : "border border-arena-hairline"
      }${className ? ` ${className}` : ""}`}
    >
      {/* sheen de luz no topo (profundidade premium) */}
      {surface !== "paper" ? (
        <LinearGradient
          colors={gradients.glassSheen}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          pointerEvents="none"
          style={{ position: "absolute", left: 0, right: 0, top: 0, height: 64 }}
        />
      ) : null}

      {/* barra de acento no topo */}
      {accent !== "none" ? (
        <LinearGradient
          colors={accentColors[accent]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          pointerEvents="none"
          style={{ position: "absolute", left: 0, right: 0, top: 0, height: 3 }}
        />
      ) : null}

      {children}
    </View>
  );

  if (!glow) return inner;

  // Card de herói: borda hairline em gradiente (índigo→magenta→verde).
  return (
    <LinearGradient
      colors={gradients.hairline}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ borderRadius: radius["2xl"], padding: 1.2 }}
    >
      {inner}
    </LinearGradient>
  );
}
