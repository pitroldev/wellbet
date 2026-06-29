/**
 * Texto base com variantes tipográficas SPORTSBOOK BRUTAL (estilo via NativeWind).
 *
 * Tipografia (ver src/theme/fonts.ts):
 *  - `title`   → Anton, CAIXA-ALTA, manchete condensada (placar/cartaz).
 *  - `heading` → Anton, caixa-alta, títulos de card/seção.
 *  - `body`    → Plus Jakarta medium.
 *  - `caption` → Plus Jakarta, secundário (fog).
 *  - `label`   → eyebrow: Space Mono, caixa-alta, tracking largo, terciário.
 *  - `mono`    → Space Mono (códigos/labels).
 *  - `numeric` → Space Mono grande em magenta (peso/streak/prêmio/stake).
 *
 * Cada peso é uma família própria; por isso escolhemos a família explícita
 * (`font-*`) e NÃO combinamos com `font-bold` (o RN não sintetiza peso bem).
 */
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

type Variant = "title" | "heading" | "body" | "caption" | "label" | "mono" | "numeric";

const variantClass: Record<Variant, string> = {
  title: "font-display text-4xl uppercase leading-[0.95] tracking-tight text-foreground",
  heading: "font-display text-xl uppercase leading-[1.05] tracking-tight text-foreground",
  body: "font-sans text-base leading-relaxed text-foreground",
  caption: "font-sans text-sm text-muted",
  label: "font-mono-bold text-[11px] uppercase tracking-[0.18em] text-muted-foreground",
  mono: "font-mono text-base text-foreground",
  numeric: "font-mono-bold text-3xl tabular-nums text-arena-magenta",
};
// Aliases de cor (background/surface/foreground/muted/border/on-primary), a
// escala `primary-*` e as cores `arena-*` vêm do tailwind.config (tema brutal).

export interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

export function Text({ variant = "body", className, ...props }: TextProps) {
  return (
    <RNText {...props} className={`${variantClass[variant]}${className ? ` ${className}` : ""}`} />
  );
}
