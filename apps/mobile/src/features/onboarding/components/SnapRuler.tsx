/**
 * Régua horizontal TÁTIL — o número deixa de ser digitado e vira gesto.
 *
 * Fita de ticks que desliza sob uma agulha violeta fixa no centro (metáfora de
 * balança analógica / fita métrica). Pan do gesture-handler + Reanimated na UI
 * thread; snap por step com háptico `selectionAsync` a cada tick cruzado
 * (throttled — sem metralhadora em fling), inércia leve com clamp no range.
 *
 * Decisões de arquitetura:
 *  - SEM Skia: ticks são Views estáticas montadas uma vez (useMemo) dentro de
 *    uma fita transladada por `useAnimatedStyle`. Assim a tela guarda o
 *    orçamento de 1 Canvas para PaceGauge/BoloFlow (regra de performance).
 *  - `pos` (shared value) vive em UNIDADES DE VALOR (kg, cm...), contínuo
 *    durante o gesto; o snap acontece na emissão e no settle. Nunca setState
 *    por frame: `onChange` só dispara quando o índice snapado MUDA.
 *  - A régua NÃO renderiza o numeral gigante — a tela faz isso (AnimatedNumber).
 *
 * A11y: role "adjustable" + ações increment/decrement (1 step cada) +
 * accessibilityValue com texto "72,5 kg". Reduce-motion: sem inércia (snap
 * seco no soltar) e sync externo sem animação — o arrasto segue igual (é
 * manipulação direta, não animação decorativa).
 */
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  type AccessibilityActionEvent,
  type LayoutChangeEvent,
  type StyleProp,
  Text as RNText,
  View,
  type ViewStyle,
} from "react-native";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";

import { useReducedMotion } from "@/shared/motion";
import { arena, arenaAlpha, fontFamilies } from "@/theme/tokens";

export interface SnapRulerProps {
  min: number;
  max: number;
  step: number;
  /** Valor controlado (a tela é dona do estado). */
  value: number;
  /** Chamado a cada tick snapado NOVO (nunca por frame). */
  onChange: (value: number) => void;
  /** Ticks maiores (com rótulo numérico) a cada N steps. */
  majorEvery: number;
  /** Unidade JÁ TRADUZIDA ("kg", "cm") — usada no texto de acessibilidade. */
  unitLabel: string;
  style?: StyleProp<ViewStyle>;
}

// ——— Métricas da fita (constantes de módulo — determinístico) ———
const TICK_SPACING = 14; // px por step
const RULER_H = 88;
const BASE_Y = 12; // y da hairline de onde os ticks pendem
const MAJOR_H = 30;
const MINOR_H = 16;
const LABEL_W = 56;
const NEEDLE_W = 3;
const FADE_W = 44;

// Háptico: no máx. 1 a cada 45ms (~22/s) — fling rápido não vira metralhadora.
const HAPTIC_GAP_MS = 45;
// Inércia leve: carrega ~90ms da velocidade de soltura (clampado no range).
const INERTIA_CARRY_S = 0.09;
// Settle do snap: firme, sem passar do tick (overshoot em régua lê como erro).
const SNAP_SPRING = { damping: 28, stiffness: 260, overshootClamping: true } as const;

const A11Y_ACTIONS = [{ name: "increment" as const }, { name: "decrement" as const }];

const TRANSPARENT_INK = "rgba(8,22,30,0)"; // arena.ink com alpha 0 (mesmo truque do Aurora)

function clampW(v: number, lo: number, hi: number): number {
  "worklet";
  return Math.min(hi, Math.max(lo, v));
}

// selectionAsync na thread JS, agendado de dentro do worklet (padrão do repo).
function selectionOnJS(): void {
  void Haptics.selectionAsync();
}
function hapticSelection(): void {
  "worklet";
  scheduleOnRN(selectionOnJS);
}

/** Casas decimais do step (0.5 → 1) — para arredondar sem lixo de float. */
function stepDecimals(step: number): number {
  const s = String(step);
  const dot = s.indexOf(".");
  return dot === -1 ? 0 : s.length - dot - 1;
}

function formatTick(v: number, decimals: number): string {
  return v.toLocaleString(undefined, { maximumFractionDigits: decimals });
}

export function SnapRuler({
  min,
  max,
  step,
  value,
  onChange,
  majorEvery,
  unitLabel,
  style,
}: SnapRulerProps) {
  const reduced = useReducedMotion();
  const [width, setWidth] = useState(0);

  const decimals = stepDecimals(step);
  const pow = 10 ** decimals;
  const stepsCount = Math.max(1, Math.round((max - min) / step));

  const snapClamped = useCallback(
    (v: number) => {
      const idx = Math.min(stepsCount, Math.max(0, Math.round((v - min) / step)));
      return Math.round((min + idx * step) * pow) / pow;
    },
    [min, step, stepsCount, pow],
  );

  const initial = snapClamped(value);
  // Posição em UNIDADES DE VALOR (contínua durante o gesto; snapa no settle).
  const pos = useSharedValue(initial);
  const startPos = useSharedValue(initial);
  // true do início do arrasto até o FIM do settle — janela em que háptico/emit valem.
  const interacting = useSharedValue(false);
  const lastIdx = useSharedValue(Math.round((initial - min) / step));
  const lastHapticAt = useSharedValue(0);
  const lastNotified = useSharedValue(initial);

  // onChange pode ser inline na tela — ref pra emissão estável de dentro do worklet
  // (atualizada em efeito, nunca durante o render).
  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);
  const emit = useCallback((v: number) => {
    onChangeRef.current(v);
  }, []);

  // NOTA: dentro dos worklets usamos a API `.get()`/`.set()` (Reanimated 4) em
  // vez de `.value` — é a forma compatível com o lint do React Compiler quando
  // o MESMO shared value é capturado por mais de um hook (as duas reactions).

  // Sync externo (tela mudou `value` sem ser via régua): anima até lá, mudo.
  // Reação na UI thread (não useEffect) — shared values vivem só em worklets.
  const syncTarget = snapClamped(value);
  useAnimatedReaction(
    () => syncTarget,
    (target, prev) => {
      if (prev === null) return; // montagem: `pos` já nasce no valor
      lastNotified.set(target);
      if (interacting.get()) return; // settle em curso é a fonte da verdade
      if (Math.abs(pos.get() - target) < step / 1000) return;
      pos.set(reduced ? target : withTiming(target, { duration: 220, easing: Easing.out(Easing.cubic) }));
    },
  );

  // Cruzou um tick → háptico (throttled) + emissão do valor snapado. Cobre o
  // arrasto E o settle da inércia num lugar só. Sync externo não emite (flag).
  useAnimatedReaction(
    () => pos.get(),
    (p) => {
      const idx = Math.min(stepsCount, Math.max(0, Math.round((p - min) / step)));
      if (idx === lastIdx.get()) return;
      lastIdx.set(idx);
      if (!interacting.get()) return;
      const now = performance.now();
      if (now - lastHapticAt.get() >= HAPTIC_GAP_MS) {
        lastHapticAt.set(now);
        hapticSelection();
      }
      const v = Math.round((min + idx * step) * pow) / pow;
      if (v !== lastNotified.get()) {
        lastNotified.set(v);
        scheduleOnRN(emit, v);
      }
    },
  );

  const pan = Gesture.Pan()
    // Intenção horizontal — não rouba o scroll vertical da tela.
    .activeOffsetX([-6, 6])
    .failOffsetY([-16, 16])
    .onBegin(() => {
      "worklet";
      cancelAnimation(pos); // agarrar durante o settle: a fita para na mão
      startPos.set(pos.get());
    })
    .onStart(() => {
      "worklet";
      interacting.set(true);
    })
    .onUpdate((e) => {
      "worklet";
      // Arrastar pra ESQUERDA avança o valor (a fita anda, a agulha fica).
      pos.set(clampW(startPos.get() - (e.translationX / TICK_SPACING) * step, min, max));
    })
    .onEnd((e) => {
      "worklet";
      // Inércia leve: projeta ~90ms da velocidade, clampa e snapa no tick.
      const projected = pos.get() - ((e.velocityX * INERTIA_CARRY_S) / TICK_SPACING) * step;
      const idx = Math.min(stepsCount, Math.max(0, Math.round((clampW(projected, min, max) - min) / step)));
      const target = Math.round((min + idx * step) * pow) / pow;
      if (reduced) {
        // Reduce-motion: snap seco, sem inércia — mesma função, sem balé.
        pos.set(target);
        interacting.set(false);
      } else {
        pos.set(
          withSpring(target, SNAP_SPRING, () => {
            interacting.set(false);
          }),
        );
      }
    })
    .onFinalize((_e, success) => {
      "worklet";
      // Gesto que falhou (virou scroll): fecha a janela e re-snapa — o onBegin
      // pode ter cancelado um settle no meio, deixando a fita entre ticks.
      if (!success) {
        interacting.set(false);
        const idx = Math.min(stepsCount, Math.max(0, Math.round((pos.get() - min) / step)));
        const target = Math.round((min + idx * step) * pow) / pow;
        pos.set(reduced ? target : withSpring(target, SNAP_SPRING));
      }
    });

  // A fita: ticks estáticos montados UMA vez; só o translateX anima.
  const stripW = stepsCount * TICK_SPACING;
  const stripStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: width / 2 - ((pos.get() - min) / step) * TICK_SPACING }],
  }));

  const ticks = useMemo(() => {
    const nodes = [];
    for (let i = 0; i <= stepsCount; i++) {
      const major = i % majorEvery === 0;
      nodes.push(
        <View
          key={i}
          style={{
            position: "absolute",
            left: i * TICK_SPACING - (major ? 1.25 : 0.75),
            top: BASE_Y,
            width: major ? 2.5 : 1.5,
            height: major ? MAJOR_H : MINOR_H,
            borderRadius: 1.25,
            backgroundColor: major ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.20)",
          }}
        />,
      );
      if (major) {
        const v = Math.round((min + i * step) * pow) / pow;
        nodes.push(
          <RNText
            key={`l${i}`}
            style={{
              position: "absolute",
              left: i * TICK_SPACING - LABEL_W / 2,
              top: BASE_Y + MAJOR_H + 6,
              width: LABEL_W,
              textAlign: "center",
              fontFamily: fontFamilies.monoMedium,
              fontSize: 11,
              letterSpacing: 0.4,
              color: arena.fogMute,
              fontVariant: ["tabular-nums"],
            }}
          >
            {formatTick(v, decimals)}
          </RNText>,
        );
      }
    }
    return nodes;
  }, [stepsCount, majorEvery, min, step, pow, decimals]);

  const onLayout = useCallback((e: LayoutChangeEvent) => {
    setWidth(e.nativeEvent.layout.width);
  }, []);

  const snappedValue = snapClamped(value);
  const handleA11yAction = useCallback(
    (e: AccessibilityActionEvent) => {
      const name = e.nativeEvent.actionName;
      const dir = name === "increment" ? 1 : name === "decrement" ? -1 : 0;
      if (dir === 0) return;
      const cur = snapClamped(value);
      const next = snapClamped(cur + dir * step);
      if (next === cur) return;
      void Haptics.selectionAsync();
      onChange(next);
    },
    [value, step, snapClamped, onChange],
  );

  return (
    <GestureDetector gesture={pan}>
      <View
        accessible
        accessibilityRole="adjustable"
        accessibilityLabel={unitLabel}
        accessibilityActions={A11Y_ACTIONS}
        accessibilityValue={{
          min,
          max,
          now: snappedValue,
          text: `${formatTick(snappedValue, decimals)} ${unitLabel}`,
        }}
        onAccessibilityAction={handleA11yAction}
        onLayout={onLayout}
        style={[{ height: RULER_H, borderRadius: 18, overflow: "hidden" }, style]}
      >
        {/* hairline de onde os ticks pendem (fixa; a fita desliza por baixo) */}
        <View
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: BASE_Y - 1,
            height: 1,
            backgroundColor: arenaAlpha.hairline,
          }}
        />
        {/* a fita de ticks (some até o 1º onLayout — evita salto visual) */}
        <Animated.View
          style={[
            { position: "absolute", top: 0, bottom: 0, width: stripW, opacity: width > 0 ? 1 : 0 },
            stripStyle,
          ]}
        >
          {ticks}
        </Animated.View>
        {/* vinheta nas bordas — a fita "emerge" do escuro */}
        <LinearGradient
          colors={[arena.ink, TRANSPARENT_INK]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
          style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: FADE_W, opacity: 0.9 }}
        />
        <LinearGradient
          colors={[TRANSPARENT_INK, arena.ink]}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          pointerEvents="none"
          style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: FADE_W, opacity: 0.9 }}
        />
        {/* agulha violeta fixa no centro (halo em wash — sem sombra colorida) */}
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -5.5,
            top: 2,
            width: 11,
            height: BASE_Y + MAJOR_H + 4,
            borderRadius: 999,
            backgroundColor: arenaAlpha.violetWash,
          }}
        />
        <View
          pointerEvents="none"
          style={{
            position: "absolute",
            left: "50%",
            marginLeft: -NEEDLE_W / 2,
            top: 4,
            width: NEEDLE_W,
            height: BASE_Y + MAJOR_H,
            borderRadius: 999,
            backgroundColor: arena.violet,
          }}
        />
      </View>
    </GestureDetector>
  );
}
