/**
 * Confete decorativo (Lottie). Regra do briefing: Lottie só para decorativo
 * discreto e DESMONTAR ao terminar (loop full-screen de Lottie é caro).
 *
 * Respeita reduce-motion: se o usuário pediu reduzir movimento, não renderiza.
 */
import { useRef } from "react";
import LottieView from "lottie-react-native";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

export interface ConfettiProps {
  /** Chamado quando a animação termina (para desmontar). */
  onFinish?: () => void;
}

/**
 * Recolore as partículas para a paleta da Arena (magenta/rosa/verde/branco/roxo)
 * em vez das cores sóbrias do asset placeholder. Os `keypath` apontam para os
 * grupos de partículas; quando o asset real de confete entrar (ver TODO abaixo),
 * basta alinhar os nomes dos keypaths aos layers dele.
 */
const ARENA_CONFETTI_COLORS: readonly { keypath: string; color: string }[] = [
  { keypath: "Particle 1", color: arena.magenta },
  { keypath: "Particle 2", color: arena.pink },
  { keypath: "Particle 3", color: arena.green },
  { keypath: "Particle 4", color: arena.white },
  { keypath: "Particle 5", color: arena.purple },
];

export function Confetti({ onFinish }: ConfettiProps) {
  const ref = useRef<LottieView>(null);
  const reduced = useReducedMotion();

  // Acessibilidade: sem confete quando reduce-motion está ligado.
  if (reduced) return null;

  return (
    <LottieView
      ref={ref}
      // TODO: substituir pelo asset real de confete em assets/lottie/.
      source={require("../../../../assets/lottie/confetti.json")}
      autoPlay
      loop={false}
      onAnimationFinish={onFinish}
      colorFilters={[...ARENA_CONFETTI_COLORS]}
      resizeMode="cover"
      // lottie-react-native v7 não expõe `pointerEvents` como prop própria;
      // em RN 0.85+ ele é uma propriedade de estilo válida (ViewStyle).
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
