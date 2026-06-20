/**
 * Texto base com variantes tipográficas via NativeWind (estilo estático).
 *
 * Centraliza a tipografia para não espalhar classes soltas. Variantes mapeiam
 * para classes do preset de tokens (@charya/ui-tokens).
 */
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

type Variant = "title" | "heading" | "body" | "caption" | "mono";

const variantClass: Record<Variant, string> = {
  title: "text-3xl font-bold text-foreground",
  heading: "text-xl font-semibold text-foreground",
  body: "text-base text-foreground",
  caption: "text-sm text-muted",
  mono: "text-base font-mono tracking-widest text-foreground",
};
// Aliases de cor (background/surface/foreground/muted/border/on-primary) e a
// escala `primary-*` vêm do preset @charya/ui-tokens + extends do tailwind.config.

export interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

export function Text({ variant = "body", className, ...props }: TextProps) {
  return (
    <RNText {...props} className={`${variantClass[variant]}${className ? ` ${className}` : ""}`} />
  );
}
