import { cn } from "@/lib/utils";

/**
 * Logo oficial wellbet & Co. — o raio-seta é o path vetorial REAL extraído do deck
 * (CHARYA-IDs.pdf, prancha 4). fill: currentColor, totalmente recolorível.
 * Não distorça o raio. Veja BRAND.md §4.
 */

// Path do raio-seta no viewBox de origem do PDF (bbox exata da prancha).
const BOLT_PATH =
  "M 1203.457031 429.820312 C 1164.347656 497.035156 1022.339844 731.679688 1022.332031 731.691406 L 999.492188 597.003906 L 707.671875 688.765625 L 911.476562 431.011719 L 832.222656 350.699219 L 833.445312 348.308594 L 1151.824219 348.308594 C 1232.558594 348.308594 1212.242188 414.71875 1203.457031 429.820312";
const BOLT_VIEWBOX = "707.67 348.31 524.89 383.38"; // aspect ≈ 1.369

/** O raio-seta sozinho. Herda a cor via `currentColor` (use text-* ou style.color). */
export function BoltMark({
  className,
  style,
  title = "wellbet & Co.",
}: {
  className?: string;
  style?: React.CSSProperties;
  title?: string;
}) {
  return (
    <svg
      viewBox={BOLT_VIEWBOX}
      className={className}
      style={style}
      role="img"
      aria-label={title}
      fill="currentColor"
    >
      <path d={BOLT_PATH} />
    </svg>
  );
}

/** Raio dentro de um quadrado arredondado (app-icon). */
export function BoltTile({
  size = 44,
  bg = "#3945FF",
  fg = "#FFFFFF",
  radius,
  className,
  style,
}: {
  size?: number;
  bg?: string;
  fg?: string;
  radius?: number;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <span
      className={cn("inline-grid place-items-center", className)}
      style={{
        width: size,
        height: size,
        background: bg,
        borderRadius: radius ?? size * 0.28,
        ...style,
      }}
    >
      <BoltMark style={{ width: size * 0.56, height: "auto", color: fg }} />
    </span>
  );
}

/**
 * Assinatura institucional: app-icon + "wellbet & Co.".
 * `tone` ajusta a cor do texto/ícone para fundo claro ou escuro.
 */
export function WellbetCoLogo({
  size = 32,
  tone = "ink",
  className,
}: {
  size?: number;
  tone?: "ink" | "light" | "blue";
  className?: string;
}) {
  const text =
    tone === "light" ? "#FFFFFF" : tone === "blue" ? "#3945FF" : "#08161E";
  const tileBg = tone === "light" ? "#FFFFFF" : "#3945FF";
  const tileFg = tone === "light" ? "#3945FF" : "#FFFFFF";
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <BoltTile size={size} bg={tileBg} fg={tileFg} />
      <span
        className="font-[family-name:var(--font-jakarta)] font-semibold tracking-tight"
        style={{ color: text, fontSize: size * 0.62 }}
      >
        wellbet&nbsp;&amp;&nbsp;Co.
        <sup className="ml-0.5 text-[0.5em] opacity-60 align-super">®</sup>
      </span>
    </span>
  );
}

/**
 * Lockup de produto: "Well"/"Gym" em ink + "Bet" na cor-assinatura, com o raio
 * como flourish de energia. `brand` escolhe WellBet (azul) ou GymBet (magenta).
 */
export function ProductWordmark({
  brand = "well",
  size = 34,
  tone = "ink",
  accent,
  className,
}: {
  brand?: "well" | "gym";
  size?: number;
  tone?: "ink" | "light";
  accent?: string;
  className?: string;
}) {
  const name = brand === "gym" ? "Gym" : "Well";
  const acc = accent ?? (brand === "gym" ? "#FF00FF" : "#3945FF");
  const nameColor = tone === "light" ? "#FFFFFF" : "#08161E";
  return (
    <span
      className={cn(
        "inline-flex items-center font-[family-name:var(--font-jakarta)] font-extrabold tracking-tight",
        className,
      )}
      style={{ fontSize: size }}
    >
      <span style={{ color: nameColor }}>{name}</span>
      <BoltMark
        style={{ height: size * 0.74, width: "auto", color: acc, margin: "0 0.04em" }}
      />
      <span style={{ color: acc }}>et</span>
    </span>
  );
}
