/**
 * Confete de celebração — partículas em Skia (GPU, UI thread), sem asset.
 *
 * Regra de feel (§3): Skia para partícula/efeito contínuo. Antes era um Lottie
 * com asset placeholder (que nem existia e quebrava o bundle); agora é gerado em
 * código — desmonta sozinho ao terminar e respeita reduce-motion.
 */
import { useEffect, useMemo } from "react";
import { useWindowDimensions } from "react-native";
import { Canvas, Group, RoundedRect } from "@shopify/react-native-skia";
import {
  Easing,
  useDerivedValue,
  useSharedValue,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena } from "@/theme/tokens";

const DURATION_MS = 1800;
const COUNT = 22;
// Green na frente (e no fallback): o confete é festa de VITÓRIA — green domina,
// a marca (violeta/azul) acompanha.
const COLORS = [arena.green, arena.violet, arena.green, arena.blue, arena.white, arena.green];

/** PRNG determinística por índice — estável entre renders e PURA (sem Math.random). */
function rand(i: number, salt: number): number {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export interface ConfettiProps {
  /** Chamado quando a animação termina (para desmontar). */
  onFinish?: () => void;
}

interface ParticleSpec {
  x: number;
  size: number;
  color: string;
  drift: number;
  fallFactor: number;
  rot: number;
  spin: number;
}

export function Confetti({ onFinish }: ConfettiProps) {
  const reduced = useReducedMotion();
  const { width, height } = useWindowDimensions();
  const progress = useSharedValue(0);

  const particles = useMemo<ParticleSpec[]>(
    () =>
      Array.from({ length: COUNT }, (_, i) => ({
        x: rand(i, 1) * width,
        size: 8 + rand(i, 2) * 8,
        color: COLORS[i % COLORS.length] ?? arena.green,
        drift: (rand(i, 3) - 0.5) * width * 0.4,
        fallFactor: 0.7 + rand(i, 4) * 0.5,
        rot: (rand(i, 5) - 0.5) * 8,
        spin: 0.5 + rand(i, 6) * 1.5,
      })),
    [width],
  );

  useEffect(() => {
    // Acessibilidade: sem confete em reduce-motion — encerra de imediato.
    if (reduced) {
      onFinish?.();
      return;
    }
    progress.value = withTiming(1, { duration: DURATION_MS, easing: Easing.out(Easing.quad) });
    const id = setTimeout(() => onFinish?.(), DURATION_MS);
    return () => clearTimeout(id);
    // onFinish é one-shot; não re-disparar por mudança de identidade.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduced]);

  if (reduced) return null;

  return (
    <Canvas
      style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0, pointerEvents: "none" }}
    >
      {particles.map((p, i) => (
        <Particle key={i} progress={progress} spec={p} height={height} />
      ))}
    </Canvas>
  );
}

function Particle({
  progress,
  spec,
  height,
}: {
  progress: SharedValue<number>;
  spec: ParticleSpec;
  height: number;
}) {
  const fall = height * spec.fallFactor;

  // Cai, deriva lateralmente (com leve oscilação) e gira em torno do próprio
  // centro (rect desenhado centrado em 0,0 → rotate antes do translate).
  const transform = useDerivedValue(() => {
    const tp = progress.value;
    const ty = -40 + fall * tp;
    const tx = spec.x + spec.drift * tp + Math.sin(tp * spec.spin * Math.PI * 2) * 14;
    const angle = spec.rot * tp;
    return [{ translateX: tx }, { translateY: ty }, { rotate: angle }];
  });

  // Some no último terço da queda.
  const opacity = useDerivedValue(() => {
    const tp = progress.value;
    return tp < 0.7 ? 1 : Math.max(0, 1 - (tp - 0.7) / 0.3);
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <RoundedRect
        x={-spec.size / 2}
        y={-spec.size / 2}
        width={spec.size}
        height={spec.size * 0.6}
        r={1.5}
        color={spec.color}
      />
    </Group>
  );
}
