/**
 * Confete decorativo (Lottie). Regra do briefing: Lottie só para decorativo
 * discreto e DESMONTAR ao terminar (loop full-screen de Lottie é caro).
 *
 * Respeita reduce-motion: se o usuário pediu reduzir movimento, não renderiza.
 */
import { useRef } from "react";
import LottieView from "lottie-react-native";

import { useReducedMotion } from "@/shared/motion";

export interface ConfettiProps {
  /** Chamado quando a animação termina (para desmontar). */
  onFinish?: () => void;
}

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
      resizeMode="cover"
      // lottie-react-native v7 não expõe `pointerEvents` como prop própria;
      // em RN 0.85+ ele é uma propriedade de estilo válida (ViewStyle).
      style={{ position: "absolute", inset: 0, pointerEvents: "none" }}
    />
  );
}
