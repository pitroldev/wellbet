/**
 * Texto base com variantes tipográficas MIDNIGHT AURORA (estilo via NativeWind).
 *
 * Tipografia (ver src/theme/fonts.ts):
 *  - `display` → Outfit Black, herói gigante (placar, prêmio, número-âncora).
 *  - `title`   → Outfit ExtraBold, manchete de tela. Caixa natural (não força CAPS).
 *  - `heading` → Outfit Bold, títulos de card/seção.
 *  - `body`    → Plus Jakarta medium.
 *  - `caption` → Plus Jakarta, secundário (fog).
 *  - `label`   → eyebrow: Geist Mono, CAIXA-ALTA, tracking largo, terciário.
 *  - `mono`    → Geist Mono (códigos/labels/Pix).
 *  - `numeric` → Geist Mono grande em magenta (peso/streak/prêmio/stake).
 *
 * Line-heights folgados de propósito: acento da 2ª linha (á, ç, ã) NUNCA bate na
 * linha de cima. Cada peso é uma família própria; escolhemos a família explícita
 * (`font-*`) e NÃO combinamos com `font-bold` (o RN não sintetiza peso bem).
 */
import { Text as RNText, type TextProps as RNTextProps } from "react-native";

type Variant = "display" | "title" | "heading" | "body" | "caption" | "label" | "mono" | "numeric";

const variantClass: Record<Variant, string> = {
  display: "font-display-black text-[44px] leading-[1.05] tracking-[-0.02em] text-foreground",
  title: "font-display text-[32px] leading-[1.12] tracking-[-0.01em] text-foreground",
  heading: "font-display-bold text-xl leading-[1.15] tracking-[-0.01em] text-foreground",
  body: "font-sans text-base leading-relaxed text-foreground",
  caption: "font-sans text-sm leading-relaxed text-muted",
  label: "font-mono-medium text-[11px] uppercase tracking-[0.16em] text-muted-foreground",
  mono: "font-mono text-base text-foreground",
  numeric: "font-mono-bold text-3xl tabular-nums text-arena-magenta",
};
// Aliases de cor (background/surface/foreground/muted/border/on-primary), a
// escala `primary-*` e as cores `arena-*` vêm do tailwind.config (Midnight Aurora).

export interface TextProps extends RNTextProps {
  variant?: Variant;
  className?: string;
}

export function Text({ variant = "body", className, ...props }: TextProps) {
  return (
    <RNText {...props} className={`${variantClass[variant]}${className ? ` ${className}` : ""}`} />
  );
}
