/**
 * BoloFlow — o diagrama VIVO do aha: de onde vem o prêmio (Manual §5.4, Jornada §3).
 *
 * Três atos em loop suave (~6s), Skia + Reanimated na UI thread:
 *   ato 1 — a fileira de moedas-ponto de "quem desistiu" desliza em arco pro POTE
 *           central, que cresce levemente (com glow violeta) ao receber;
 *   ato 2 — o pote pulsa (o bolo está cheio);
 *   ato 3 — um fluxo de pontos sai do pote até "você, se bater", acendendo o
 *           rótulo do retorno em ciano.
 *
 * Honestidade visual: SEM VERDE (apostar não é vitória — violeta/ciano/branco),
 * sem número inventado; os 3 rótulos chegam JÁ TRADUZIDOS via props. O stake só
 * muda a densidade de moedas (50 → 6 … 500 → 14). Háptico é da tela, não daqui.
 *
 * Determinístico (fase por índice via razão áurea, zero Math.random) e acessível:
 * reduce-motion → diagrama estático com as setas desenhadas e tudo aceso.
 */
import { useEffect, useMemo, useState } from "react";
import { StyleSheet, View, type LayoutChangeEvent, type ViewStyle } from "react-native";
import {
  Blur,
  Canvas,
  Circle,
  DashPathEffect,
  Group,
  Path,
  RadialGradient,
  Skia,
  vec,
  type SkPath,
} from "@shopify/react-native-skia";
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming,
  type SharedValue,
} from "react-native-reanimated";

import { useReducedMotion } from "@/shared/motion";
import { Text } from "@/shared/ui";
import { arena, arenaAlpha } from "@/theme/tokens";

/* ─── Linha do tempo do ciclo (frações de 0..1 sobre ~6s) ─────────────────── */
const CYCLE_MS = 6000;
const A1_START = 0.06; // ato 1: moedas → pote
const A1_LEN = 0.36;
const A2_START = 0.42; // ato 2: o pote pulsa
const A2_LEN = 0.2;
const A3_START = 0.62; // ato 3: fluxo pote → você
const A3_LEN = 0.32;
const RESET_START = 0.94; // decantação: tudo volta ao estado inicial sem "pop"
const RESET_LEN = 0.06;
/** Fração do ato 1 que cada moeda passa voando (o resto é espera de fase). */
const COIN_FLIGHT = 0.42;
/** Fração do ato 3 que cada ponto do fluxo passa voando. */
const FLOW_FLIGHT = 0.5;
const FLOW_COUNT = 4;

const PHI = 0.6180339887498949; // razão áurea — stagger determinístico por índice
const POT_R = 30;
const COIN_R = 4.5;
const LABELS_H = 44;
/** Tons de moeda — família da marca, SEM verde. */
const COIN_COLORS = [arena.violetSoft, arena.cyan, arena.white] as const;
const COIN_ALPHAS = [0.9, 0.85, 0.7] as const;

/* ─── Helpers de worklet (rodam por frame na UI thread) ───────────────────── */
function clamp01(v: number): number {
  "worklet";
  return v < 0 ? 0 : v > 1 ? 1 : v;
}
function easeInOut(v: number): number {
  "worklet";
  return v < 0.5 ? 2 * v * v : 1 - (-2 * v + 2) ** 2 / 2;
}
/** Bézier quadrática 1D (a → b com controle c). */
function qbez(a: number, c: number, b: number, t: number): number {
  "worklet";
  const u = 1 - t;
  return u * u * a + 2 * u * t * c + t * t * b;
}
/** Quanto o rótulo/marcador do retorno está aceso neste instante do ciclo. */
function litAt(c: number): number {
  "worklet";
  const a3 = clamp01((c - A3_START) / A3_LEN);
  const reset = clamp01((c - RESET_START) / RESET_LEN);
  return clamp01((a3 - 0.35) / 0.3) * (1 - reset);
}

/* ─── Especificações determinísticas ──────────────────────────────────────── */
interface CoinSpec {
  hx: number; // origem (a fileira de quem desistiu)
  hy: number;
  ctrlX: number; // controle da Bézier (arco por cima)
  ctrlY: number;
  dep: number; // partida no ato 1 (0..1-COIN_FLIGHT), via razão áurea
  color: string;
  alpha: number;
}

interface FlowSpec {
  ctrlX: number;
  ctrlY: number;
  dep: number;
  staticT: number; // posição no arco no fallback estático
  color: string;
}

interface Geometry {
  w: number;
  h: number;
  cy: number;
  leftX: number;
  potX: number;
  rightX: number;
  coins: CoinSpec[];
  flow: FlowSpec[];
  arcs: SkPath; // setas-guia tracejadas (esq→pote, pote→você)
  heads: SkPath; // pontas de seta (chevrons)
}

/** Ponta de seta ("V") no fim de um arco, apontando na direção (dx,dy). */
function chevron(path: SkPath, ex: number, ey: number, dx: number, dy: number) {
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;
  path.moveTo(ex - ux * 8 + px * 5, ey - uy * 8 + py * 5);
  path.lineTo(ex, ey);
  path.lineTo(ex - ux * 8 - px * 5, ey - uy * 8 - py * 5);
}

function buildGeometry(w: number, h: number, coinCount: number): Geometry {
  const cy = h * 0.52;
  // Os três polos alinham com as três colunas de rótulo (1/6 · 1/2 · 5/6).
  const leftX = w / 6;
  const potX = w / 2;
  const rightX = (w * 5) / 6;

  // A fileira: até 7 moedas por linha, centrada no polo esquerdo.
  const perRow = 7;
  const rows = Math.ceil(coinCount / perRow);
  const coins: CoinSpec[] = Array.from({ length: coinCount }, (_, i) => {
    const row = Math.floor(i / perRow);
    const inRow = Math.min(perRow, coinCount - row * perRow);
    const col = i % perRow;
    const hx = leftX + (col - (inRow - 1) / 2) * 12;
    const hy = cy + (row - (rows - 1) / 2) * 12;
    const frac = (i + 1) * PHI;
    const bow = 22 + (i % 3) * 7;
    return {
      hx,
      hy,
      ctrlX: (hx + potX) / 2,
      ctrlY: (hy + cy) / 2 - bow,
      dep: (frac - Math.floor(frac)) * (1 - COIN_FLIGHT),
      color: COIN_COLORS[i % COIN_COLORS.length] ?? arena.violetSoft,
      alpha: COIN_ALPHAS[i % COIN_ALPHAS.length] ?? 0.85,
    };
  });

  const flow: FlowSpec[] = Array.from({ length: FLOW_COUNT }, (_, k) => ({
    ctrlX: (potX + rightX) / 2,
    ctrlY: cy - 30,
    dep: (k / FLOW_COUNT) * (1 - FLOW_FLIGHT),
    staticT: 0.18 + (0.64 * k) / (FLOW_COUNT - 1),
    color: k % 2 === 0 ? arena.cyan : arena.white,
  }));

  // Setas-guia (o desenho didático que segura o diagrama entre os atos).
  const arcs = Skia.Path.Make();
  const a1sx = leftX + 46;
  const a1ex = potX - POT_R - 10;
  const a1c = { x: (a1sx + a1ex) / 2, y: cy - 34 };
  arcs.moveTo(a1sx, cy - 6);
  arcs.quadTo(a1c.x, a1c.y, a1ex, cy - 6);
  const a2sx = potX + POT_R + 10;
  const a2ex = rightX - 18;
  const a2c = { x: (a2sx + a2ex) / 2, y: cy - 34 };
  arcs.moveTo(a2sx, cy - 6);
  arcs.quadTo(a2c.x, a2c.y, a2ex, cy - 6);

  const heads = Skia.Path.Make();
  chevron(heads, a1ex, cy - 6, a1ex - a1c.x, cy - 6 - a1c.y);
  chevron(heads, a2ex, cy - 6, a2ex - a2c.x, cy - 6 - a2c.y);

  return { w, h, cy, leftX, potX, rightX, coins, flow, arcs, heads };
}

/* ─── Componente ──────────────────────────────────────────────────────────── */
export interface BoloFlowProps {
  /** Valor apostado — muda só a densidade de moedas (50 → 6 … 500 → 14). */
  stake: number;
  /** Rótulos JÁ traduzidos pela tela (o componente não toca no i18n). */
  labelLeft: string;
  labelPot: string;
  labelRight: string;
  style?: ViewStyle;
}

export function BoloFlow({ stake, labelLeft, labelPot, labelRight, style }: BoloFlowProps) {
  const reduced = useReducedMotion();
  const [size, setSize] = useState({ w: 0, h: 0 });
  const cycle = useSharedValue(0);

  useEffect(() => {
    if (reduced) return;
    cycle.value = 0;
    cycle.value = withRepeat(withTiming(1, { duration: CYCLE_MS, easing: Easing.linear }), -1, false);
  }, [reduced, cycle]);

  const coinCount = Math.round(6 + clamp01((stake - 50) / 450) * 8);
  const geom = useMemo(
    () => (size.w > 0 && size.h > 0 ? buildGeometry(size.w, size.h, coinCount) : null),
    [size, coinCount],
  );

  function onLayout(e: LayoutChangeEvent) {
    const { width, height } = e.nativeEvent.layout;
    setSize((prev) => (prev.w === width && prev.h === height ? prev : { w: width, h: height }));
  }

  // O rótulo do retorno ACENDE no ato 3: crossfade mudo → ciano.
  const litStyle = useAnimatedStyle(() => ({
    opacity: reduced ? 1 : litAt(cycle.value),
  }));
  const dimStyle = useAnimatedStyle(() => ({
    opacity: reduced ? 0.25 : 1 - litAt(cycle.value) * 0.75,
  }));

  return (
    <View style={[styles.root, style]}>
      <View style={styles.canvasWrap} onLayout={onLayout}>
        {geom ? <Diagram geom={geom} cycle={cycle} reduced={reduced} /> : null}
      </View>
      <View style={styles.labels}>
        <View style={styles.labelCell}>
          <Text variant="label" className="text-center">
            {labelLeft}
          </Text>
        </View>
        <View style={styles.labelCell}>
          <Text variant="label" className="text-center text-arena-violet-soft">
            {labelPot}
          </Text>
        </View>
        <View style={styles.labelCell}>
          <Animated.View style={dimStyle}>
            <Text variant="label" className="text-center">
              {labelRight}
            </Text>
          </Animated.View>
          <Animated.View style={[StyleSheet.absoluteFill, styles.litOverlay, litStyle]}>
            <Text variant="label" className="text-center text-arena-cyan">
              {labelRight}
            </Text>
          </Animated.View>
        </View>
      </View>
    </View>
  );
}

/** Toda a parte Skia — só monta depois do layout (geometria conhecida). */
function Diagram({
  geom,
  cycle,
  reduced,
}: {
  geom: Geometry;
  cycle: SharedValue<number>;
  reduced: boolean;
}) {
  const { cy, potX, rightX, coins, flow, arcs, heads } = geom;

  // Pote: cresce ao receber (ato 1), pulsa (ato 2) e assenta ao doar (ato 3).
  // As parcelas se anulam no fim do ciclo → loop contínuo, sem emenda.
  const potTransform = useDerivedValue(() => {
    if (reduced) return [{ scale: 1.05 }];
    const c = cycle.value;
    const a1 = clamp01((c - A1_START) / A1_LEN);
    const a2 = clamp01((c - A2_START) / A2_LEN);
    const a3 = clamp01((c - A3_START) / A3_LEN);
    const s = 1 + 0.07 * a1 + 0.05 * Math.sin(Math.PI * a2) - 0.07 * a3;
    return [{ scale: s }];
  });
  const potGlow = useDerivedValue(() => {
    if (reduced) return 0.55;
    const c = cycle.value;
    const a1 = clamp01((c - A1_START) / A1_LEN);
    const a2 = clamp01((c - A2_START) / A2_LEN);
    const a3 = clamp01((c - A3_START) / A3_LEN);
    return 0.3 + 0.3 * a1 + 0.25 * Math.sin(Math.PI * a2) - 0.3 * a3;
  });

  // Marcador do retorno (acende junto do rótulo).
  const lit = useDerivedValue(() => (reduced ? 1 : litAt(cycle.value)));
  const markGlowOpacity = useDerivedValue(() => 0.55 * lit.value);
  const markFillOpacity = useDerivedValue(() => 0.15 + 0.75 * lit.value);

  const arcOpacity = reduced ? 0.35 : 0.16;

  return (
    <Canvas style={StyleSheet.absoluteFill}>
      {/* Setas-guia tracejadas: a direção do dinheiro, sempre legível. */}
      <Path
        path={arcs}
        style="stroke"
        strokeWidth={1}
        color={arena.white}
        opacity={arcOpacity}
      >
        <DashPathEffect intervals={[3, 5]} />
      </Path>
      <Path
        path={heads}
        style="stroke"
        strokeWidth={1.2}
        strokeJoin="round"
        strokeCap="round"
        color={arena.white}
        opacity={arcOpacity + 0.08}
      />

      {/* As moedas-ponto de quem desistiu (ato 1: voam pro pote). */}
      {coins.map((spec, i) => (
        <CoinDot key={i} spec={spec} cycle={cycle} reduced={reduced} potX={potX} potY={cy} />
      ))}

      {/* O POTE — o bolo. Glow violeta + corpo em gradiente radial + aro. */}
      <Group origin={vec(potX, cy)} transform={potTransform}>
        <Circle cx={potX} cy={cy} r={POT_R * 1.3} color={arena.violet} opacity={potGlow}>
          <Blur blur={20} />
        </Circle>
        <Circle cx={potX} cy={cy} r={POT_R}>
          <RadialGradient
            c={vec(potX, cy - POT_R * 0.35)}
            r={POT_R * 1.6}
            colors={["rgba(157,143,255,0.6)", "rgba(80,50,252,0.3)", "rgba(80,50,252,0.08)"]}
          />
        </Circle>
        <Circle
          cx={potX}
          cy={cy}
          r={POT_R}
          style="stroke"
          strokeWidth={1}
          color={arenaAlpha.hairlineStrong}
        />
      </Group>

      {/* O fluxo do retorno (ato 3: pote → você). */}
      {flow.map((spec, k) => (
        <FlowDot key={k} spec={spec} cycle={cycle} reduced={reduced} potX={potX} rightX={rightX} cy={cy} />
      ))}

      {/* Você, se bater — o marcador que acende em ciano. */}
      <Circle cx={rightX} cy={cy} r={15} color={arena.cyan} opacity={markGlowOpacity}>
        <Blur blur={11} />
      </Circle>
      <Circle cx={rightX} cy={cy} r={7} color={arena.cyan} opacity={markFillOpacity} />
      <Circle
        cx={rightX}
        cy={cy}
        r={7}
        style="stroke"
        strokeWidth={1}
        color={arena.white}
        opacity={0.35}
      />
    </Canvas>
  );
}

function CoinDot({
  spec,
  cycle,
  reduced,
  potX,
  potY,
}: {
  spec: CoinSpec;
  cycle: SharedValue<number>;
  reduced: boolean;
  potX: number;
  potY: number;
}) {
  const transform = useDerivedValue(() => {
    if (reduced) return [{ translateX: spec.hx }, { translateY: spec.hy }];
    const a1 = clamp01((cycle.value - A1_START) / A1_LEN);
    const t = easeInOut(clamp01((a1 - spec.dep) / COIN_FLIGHT));
    return [
      { translateX: qbez(spec.hx, spec.ctrlX, potX, t) },
      { translateY: qbez(spec.hy, spec.ctrlY, potY, t) },
    ];
  });

  const opacity = useDerivedValue(() => {
    if (reduced) return spec.alpha;
    const c = cycle.value;
    const a1 = clamp01((c - A1_START) / A1_LEN);
    const t = clamp01((a1 - spec.dep) / COIN_FLIGHT);
    const reborn = clamp01(c / 0.05); // renasce suave logo após o wrap do ciclo
    const absorbed = t > 0.82 ? 1 - (t - 0.82) / 0.18 : 1; // some ao entrar no pote
    return spec.alpha * reborn * absorbed;
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Circle cx={0} cy={0} r={COIN_R} color={spec.color} />
    </Group>
  );
}

function FlowDot({
  spec,
  cycle,
  reduced,
  potX,
  rightX,
  cy,
}: {
  spec: FlowSpec;
  cycle: SharedValue<number>;
  reduced: boolean;
  potX: number;
  rightX: number;
  cy: number;
}) {
  const transform = useDerivedValue(() => {
    const t = reduced
      ? spec.staticT
      : easeInOut(
          clamp01((clamp01((cycle.value - A3_START) / A3_LEN) - spec.dep) / FLOW_FLIGHT),
        );
    return [
      { translateX: qbez(potX, spec.ctrlX, rightX, t) },
      { translateY: qbez(cy, spec.ctrlY, cy, t) },
    ];
  });

  const opacity = useDerivedValue(() => {
    if (reduced) return 0.5;
    const a3 = clamp01((cycle.value - A3_START) / A3_LEN);
    const t = clamp01((a3 - spec.dep) / FLOW_FLIGHT);
    return Math.sin(Math.PI * t) * 0.9; // entra e sai suave nas duas pontas
  });

  return (
    <Group transform={transform} opacity={opacity}>
      <Circle cx={0} cy={0} r={3.5} color={spec.color} />
    </Group>
  );
}

const styles = StyleSheet.create({
  root: {
    height: 220,
  },
  canvasWrap: {
    flex: 1,
  },
  labels: {
    height: LABELS_H,
    flexDirection: "row",
    alignItems: "flex-start",
    paddingTop: 6,
  },
  labelCell: {
    flex: 1,
    paddingHorizontal: 4,
  },
  litOverlay: {
    paddingHorizontal: 4,
  },
});
