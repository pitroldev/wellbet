"use client";

import type { ComponentProps, JSX } from "react";
import NumberFlow from "@number-flow/react";

type NumberFlowFormat = ComponentProps<typeof NumberFlow>["format"];

/**
 * Número que ROLA (odômetro tabular) ao mudar de valor — NumberFlow (Intl +
 * Web Animations API). É a assinatura de movimento da WellBet: stake/valor em
 * jogo subindo. Space Mono + tabular por padrão.
 */
export function AnimatedNumber({
  value,
  format,
  locales = "pt-BR",
  prefix,
  suffix,
  className,
}: {
  value: number;
  format?: NumberFlowFormat;
  locales?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
}): JSX.Element {
  return (
    <NumberFlow
      value={value}
      format={format}
      locales={locales}
      prefix={prefix}
      suffix={suffix}
      className={className}
      style={{ fontVariantNumeric: "tabular-nums" }}
    />
  );
}
