/**
 * Acessibilidade: respeitar a preferência de "reduzir movimento" do sistema.
 *
 * Sempre que uma animação for decorativa (entrada/recompensa/partícula), ela
 * deve ser encurtada ou desligada quando o usuário pediu reduzir movimento.
 * Reanimated 4 expõe `useReducedMotion`; aqui adicionamos um helper de duração.
 */
import { useReducedMotion } from "react-native-reanimated";

/**
 * Retorna a duração efetiva considerando reduce-motion.
 * Quando o usuário pede reduzir movimento, animações decorativas vão a 0ms
 * (corte seco) em vez de animar.
 */
export function useMotionDuration(duration: number): number {
  const reduced = useReducedMotion();
  return reduced ? 0 : duration;
}

export { useReducedMotion };
