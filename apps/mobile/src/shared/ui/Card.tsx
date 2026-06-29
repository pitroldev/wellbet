/**
 * Card de CANTO VIVO — casca brutal compartilhada (fio duro 2px, sem rounded).
 * `surface="navy"` (padrão) = card escuro sobre o ground; `surface="paper"` =
 * bloco claro (ritmo claro/escuro). Acento opcional = barra magenta/verde no topo.
 */
import { View, type ViewProps } from "react-native";

type Surface = "navy" | "paper";
type Accent = "none" | "magenta" | "green";

export interface CardProps extends ViewProps {
  surface?: Surface;
  accent?: Accent;
  className?: string;
}

const surfaceClass: Record<Surface, string> = {
  navy: "border-2 border-border bg-arena-navy-soft",
  paper: "border-2 border-arena-navy bg-paper",
};

const accentClass: Record<Accent, string> = {
  none: "",
  magenta: "bg-arena-magenta",
  green: "bg-arena-green",
};

export function Card({
  surface = "navy",
  accent = "none",
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      {...props}
      className={`relative overflow-hidden p-5 ${surfaceClass[surface]}${className ? ` ${className}` : ""}`}
    >
      {accent !== "none" ? (
        <View className={`absolute left-0 right-0 top-0 h-1 ${accentClass[accent]}`} />
      ) : null}
      {children}
    </View>
  );
}
