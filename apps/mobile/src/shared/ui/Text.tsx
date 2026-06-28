/**
 * Texto base com variantes tipográficas da Arena (estilo estático via NativeWind).
 *
 * Tipografia gymbet-arena (ver src/theme/fonts.ts):
 *  - `title`   → Archivo black, CAIXA-ALTA, manchete pesada.
 *  - `heading` → Plus Jakarta bold.
 *  - `body`    → Plus Jakarta medium.
 *  - `caption` → Plus Jakarta, secundário (fog).
 *  - `label`   → eyebrow: caixa-alta, tracking largo, terciário.
 *  - `mono`    → Geist Mono (códigos).
 *  - `numeric` → Geist Mono grande em magenta (peso/streak/prêmio).
 *
 * Cada peso é uma família própria; por isso escolhemos a família explícita
 * (`font-*`) e NÃO combinamos com `font-bold` (o RN não sintetiza peso bem).
 */
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

type Variant = "title" | "heading" | "body" | "caption" | "label" | "mono" | "numeric";

const variantClass: Record<Variant, string> = {
  title: "font-display text-4xl uppercase leading-[0.92] tracking-tight text-foreground",
  heading: "font-sans-bold text-xl text-foreground",
  body: "font-sans text-base leading-relaxed text-foreground",
  caption: "font-sans text-sm text-muted",
  label: "font-sans-bold text-xs uppercase tracking-[0.16em] text-muted-foreground",
  mono: "font-mono text-base text-foreground",
  numeric: "font-mono-bold text-3xl tabular-nums text-arena-magenta",
};
// Aliases de cor (background/surface/foreground/muted/border/on-primary), a
// escala `primary-*` e as cores `arena-*` vêm do tailwind.config (tema Arena).

export interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

export function Text({ variant = "body", className, ...props }: TextProps) {
  return (
    <RNText {...props} className={`${variantClass[variant]}${className ? ` ${className}` : ""}`} />
  );
}
