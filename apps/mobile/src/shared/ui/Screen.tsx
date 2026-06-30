/**
 * Container base de tela: safe area + FUNDO VIVO (aurora de glow) + entrada
 * animada off-thread.
 *
 * A entrada usa a CSS Animations API do Reanimated 4 (declarativa, UI thread),
 * respeitando reduce-motion. Estilo estático via NativeWind (className).
 */
import { type ReactNode } from "react";
import Animated from "react-native-reanimated";
import { SafeAreaView, type Edge } from "react-native-safe-area-context";

import { fadeInUp, useMotionDuration } from "@/shared/motion";
import { durations } from "@/theme/tokens";

import { AuroraBackground } from "./AuroraBackground";

export interface ScreenProps {
  children: ReactNode;
  /** Bordas de safe area a respeitar. */
  edges?: readonly Edge[];
  /** Anima a entrada do conteúdo (default true). */
  animateIn?: boolean;
  /** Fundo vivo de glow (default true). */
  glow?: boolean;
  className?: string;
}

export function Screen({
  children,
  edges = ["top", "bottom"],
  animateIn = true,
  glow = true,
  className,
}: ScreenProps) {
  const duration = useMotionDuration(durations.base);

  return (
    <SafeAreaView edges={edges} className="flex-1 bg-background">
      {glow ? <AuroraBackground /> : null}
      <Animated.View
        className={className ?? "flex-1 px-5"}
        style={animateIn ? fadeInUp(duration) : undefined}
      >
        {children}
      </Animated.View>
    </SafeAreaView>
  );
}
