/**
 * Sparkline da tendência de peso (mecânica do MyFitnessPal) — a série de
 * check-ins descendo rumo à meta. Linha em gradiente + área preenchida suave +
 * ponto de luz no último valor; a linha tracejada verde é a meta. Skia. Só
 * aparece com >= 2 pontos (baseline + 1 check-in).
 */
import { useState } from "react";
import { View, type LayoutChangeEvent } from "react-native";
import { Blur, Canvas, Circle, Group, LinearGradient, Path, vec } from "@shopify/react-native-skia";

import { arena, gradients } from "@/theme/tokens";

export interface SparklineProps {
  /** série de pesos, do mais antigo ao mais novo (ex.: [baseline, ...check-ins]). */
  points: number[];
  /** linha de meta (referência). */
  target?: number;
  height?: number;
}

export function Sparkline({ points, target, height = 72 }: SparklineProps) {
  const [width, setWidth] = useState(0);

  if (points.length < 2) return null;

  const onLayout = (e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width);

  const ys = target != null ? [...points, target] : points;
  const min = Math.min(...ys);
  const max = Math.max(...ys);
  const span = Math.max(0.1, max - min);
  const pad = 8;
  const xAt = (i: number) => (i / (points.length - 1)) * width;
  const yAt = (v: number) => pad + (1 - (v - min) / span) * (height - pad * 2);

  const line = points.map((v, i) => `${i === 0 ? "M" : "L"} ${xAt(i)} ${yAt(v)}`).join(" ");
  const area = `${line} L ${xAt(points.length - 1)} ${height} L 0 ${height} Z`;
  const targetY = target != null ? yAt(target) : null;
  const lastX = xAt(points.length - 1);
  const lastY = yAt(points[points.length - 1]!);

  return (
    <View onLayout={onLayout} style={{ height }}>
      {width > 0 ? (
        <Canvas style={{ flex: 1 }}>
          {/* área preenchida (wash vertical) */}
          <Path path={area}>
            <LinearGradient
              start={vec(0, 0)}
              end={vec(0, height)}
              colors={["rgba(255,43,214,0.28)", "rgba(255,43,214,0.0)"]}
            />
          </Path>
          {/* meta (tracejado verde) */}
          {targetY != null ? (
            <Path
              path={`M 0 ${targetY} L ${width} ${targetY}`}
              style="stroke"
              strokeWidth={1.5}
              color={arena.greenDeep}
              opacity={0.7}
            />
          ) : null}
          {/* linha em gradiente */}
          <Path path={line} style="stroke" strokeWidth={3} strokeJoin="round" strokeCap="round">
            <LinearGradient start={vec(0, 0)} end={vec(width, 0)} colors={[...gradients.ring]} />
          </Path>
          {/* ponto de luz no último valor */}
          <Group>
            <Circle cx={lastX} cy={lastY} r={7} color={arena.magenta} opacity={0.5}>
              <Blur blur={6} />
            </Circle>
            <Circle cx={lastX} cy={lastY} r={4} color={arena.white} />
            <Circle cx={lastX} cy={lastY} r={4} color={arena.magenta} opacity={0.6} />
          </Group>
        </Canvas>
      ) : null}
    </View>
  );
}
