/**
 * Sparkline da tendência de peso (mecânica do MyFitnessPal) — a série de
 * check-ins descendo rumo à meta. Skia (já no projeto). A linha verde é a meta.
 * Só aparece com >= 2 pontos (baseline + 1 check-in).
 */
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { Canvas, Path } from "@shopify/react-native-skia";

import { arena } from "@/theme/tokens";

export interface SparklineProps {
  /** série de pesos, do mais antigo ao mais novo (ex.: [baseline, ...check-ins]). */
  points: number[];
  /** linha de meta (referência). */
  target?: number;
  height?: number;
}

export function Sparkline({ points, target, height = 56 }: SparklineProps) {
  const [width, setWidth] = useState(0);

  if (points.length < 2) return null;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const ys = target != null ? [...points, target] : points;
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = Math.max(0.1, max - min);
  const pad = 6;
  const xAt = (i: number) => (i / (points.length - 1)) * width;
  const yAt = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

  const line = points.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`).join(" ");
  const targetY = target != null ? yAt(target) : null;

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 ? (
        <Canvas style={{ flex: 1 }}>
          {targetY != null ? (
            <Path
              path={`M 0 ${targetY} L ${width} ${targetY}`}
              style="stroke"
              strokeWidth={1}
              color={arena.greenDeep}
            />
          ) : null}
          <Path
            path={line}
            style="stroke"
            strokeWidth={2.5}
            strokeJoin="round"
            strokeCap="round"
            color={arena.magenta}
          />
        </Canvas>
      ) : null}
    </View>
  );
}
