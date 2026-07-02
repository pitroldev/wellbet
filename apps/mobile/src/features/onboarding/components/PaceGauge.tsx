/**
 * Medidor de RITMO (kg/semana) — arco semicircular Skia com agulha de spring.
 *
 * A escala vai de 0 a 2×`healthyMax` (determinística): a primeira metade é a
 * zona SAUDÁVEL em cyan (acento de "verdade boa" sobre escuro — verde é só
 * vitória), a segunda é a zona agressiva em `arena.danger`. Ritmos acima da
 * escala clampam a agulha no fim do arco. A agulha muda com spring vivo
 * (reduce-motion → posição direta, sem balé).
 *
 * O rótulo do valor NÃO é responsabilidade daqui — a tela renderiza (ex.:
 * AnimatedNumber + t("onboarding.goal.pace.perWeek")). Glow com parcimônia:
 * um sopro de cyan sob a zona saudável, e só.
 */
import { type ReactNode, useEffect, useMemo } from "react";
import { type StyleProp, type ViewStyle } from "react-native";
import {
  Blur,
  Canvas,
  Circle,
  Group,
  Line,
  Path,
  Skia,
  type SkPath,
  vec,
} from "@shopify/react-native-skia";
import { useDerivedValue, useSharedValue, withSpring } from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { arena, arenaAlpha } from "@/theme/tokens";

export interface PaceGaugeProps {
  /** Ritmo atual (kg por semana). */
  kgPerWeek: number;
  /** Teto do ritmo saudável (kg/semana). A escala do arco vai até 2×. */
  healthyMax?: number;
  style?: StyleProp<ViewStyle>;
}

// ——— Geometria fixa (constantes de módulo — determinístico) ———
const W = 140;
const H = 86;
const STROKE = 10;
const CX = W / 2;
const CY = H - 10;
const R = 60;

// Agulha viva, mas presa ao arco: clamp de posição deixa o overshoot do spring
// respirar sem a ponta mergulhar abaixo da linha do horizonte.
const NEEDLE_SPRING = { damping: 16, stiffness: 170 } as const;
const T_MIN = 0.015;
const T_MAX = 0.985;

// Açúcar local: arco em stroke com cap configurável (evita repetir paint props).
function Arc({
  path,
  color,
  opacity = 1,
  cap = "round",
  children,
}: {
  path: SkPath;
  color: string;
  opacity?: number;
  cap?: "round" | "butt";
  children?: ReactNode;
}) {
  return (
    <Path
      path={path}
      style="stroke"
      strokeWidth={STROKE}
      strokeCap={cap}
      color={color}
      opacity={opacity}
    >
      {children}
    </Path>
  );
}

/** Arco no semicírculo superior: start 180°, sweep proporcional (graus). */
function makeArc(sweepFrac: number, startFrac = 0) {
  const p = Skia.Path.Make();
  p.addArc(Skia.XYWHRect(CX - R, CY - R, R * 2, R * 2), 180 + 180 * startFrac, 180 * sweepFrac);
  return p;
}

export function PaceGauge({ kgPerWeek, healthyMax = 1, style }: PaceGaugeProps) {
  const reduced = useReducedMotion();

  // Escala 0..2×healthyMax → zona saudável = primeira metade do arco.
  const gaugeMax = healthyMax * 2;
  const healthyFrac = 0.5;
  const target = Math.min(T_MAX, Math.max(T_MIN, kgPerWeek / gaugeMax));

  const t = useSharedValue(target);
  useEffect(() => {
    t.value = reduced ? target : withSpring(target, NEEDLE_SPRING);
  }, [target, reduced, t]);

  // Paths estáticos memoizados (geometria é constante de módulo).
  const trackPath = useMemo(() => makeArc(1), []);
  const healthyPath = useMemo(() => makeArc(healthyFrac), [healthyFrac]);
  const dangerPath = useMemo(() => makeArc(1 - healthyFrac, healthyFrac), [healthyFrac]);

  // Marcador da fronteira saudável↔agressivo (tick radial estático).
  const boundary = useMemo(() => {
    const theta = Math.PI + Math.PI * healthyFrac;
    const cos = Math.cos(theta);
    const sin = Math.sin(theta);
    return {
      p1: vec(CX + cos * (R - STROKE / 2 - 4), CY + sin * (R - STROKE / 2 - 4)),
      p2: vec(CX + cos * (R + STROKE / 2 + 4), CY + sin * (R + STROKE / 2 + 4)),
    };
  }, [healthyFrac]);

  // Agulha desenhada apontando +x; o Group gira π (início do arco) + π·t.
  const needleTransform = useDerivedValue(() => [{ rotate: Math.PI + Math.PI * t.value }]);

  return (
    <Canvas pointerEvents="none" style={[{ width: W, height: H }, style]}>
      {/* trilho hairline */}
      <Arc path={trackPath} color={arenaAlpha.hairline} />
      {/* sopro de glow sob a zona saudável (parcimônia: um só) */}
      <Arc path={healthyPath} color={arena.cyan} opacity={0.3}>
        <Blur blur={5} />
      </Arc>
      {/* zonas: saudável em cyan, agressiva em danger */}
      <Arc path={healthyPath} color={arena.cyan} opacity={0.9} cap="butt" />
      <Arc path={dangerPath} color={arena.danger} opacity={0.5} cap="butt" />
      {/* fronteira do ritmo saudável */}
      <Line p1={boundary.p1} p2={boundary.p2} color="rgba(255,255,255,0.55)" strokeWidth={2} strokeCap="round" />
      {/* agulha (branca, cauda curta) + cubo */}
      <Group origin={vec(CX, CY)} transform={needleTransform}>
        <Line
          p1={vec(CX - 6, CY)}
          p2={vec(CX + R - STROKE - 4, CY)}
          color={arena.white}
          strokeWidth={3.5}
          strokeCap="round"
        />
      </Group>
      <Circle cx={CX} cy={CY} r={7} color={arena.surfaceElevated} />
      <Circle cx={CX} cy={CY} r={7} color={arenaAlpha.hairlineStrong} style="stroke" strokeWidth={1} />
      <Circle cx={CX} cy={CY} r={2.5} color={arena.white} />
    </Canvas>
  );
}
