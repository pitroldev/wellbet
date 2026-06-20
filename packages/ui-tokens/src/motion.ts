/**
 * Motion tokens — durações, curvas de easing e configs de mola.
 *
 * Por que isto é um token de PRIMEIRA classe na Charya: o dossiê define a UI
 * como "deliberadamente animada, snappy e recompensadora" (gamificação:
 * streak, gacha, recompensa). A "dopamina" do produto vem do MOVIMENTO, não de
 * cor estridente — então o vocabulário de animação precisa ser compartilhado e
 * consistente entre admin e mobile.
 *
 * Dois consumidores, dois formatos — ambos derivados dos MESMOS números:
 *
 *  - ADMIN (Tailwind v4 / CSS Animations): usa `durations` (ms→s) + `easing`
 *    (cubic-bezier) via `transition-*`/`animate-*`.
 *  - MOBILE (Reanimated 4): casos imperativos usam `springs` em `withSpring`;
 *    casos declarativos usam `durations`/`easing` na CSS Animations API do RN4
 *    (off-thread, na UI thread). NÃO animar por estado React/`className`.
 *
 * Acessibilidade: SEMPRE respeitar `useReducedMotion`/`prefers-reduced-motion`
 * — quem consome estes tokens deve degradar para transição instantânea/curta.
 */

/** Durações em milissegundos (snappy: curto por padrão). */
export const durationsMs = {
  /** Toques/feedback tátil imediato (haptic + micro-realce). */
  instant: 80,
  /** Hover, press, troca de estado de botão. */
  fast: 140,
  /** Transição padrão de UI (entradas, fades). */
  base: 220,
  /** Reveals maiores (cards de resultado, sheets). */
  slow: 320,
  /** Celebração (meta batida, streak, reveal de prêmio). */
  celebration: 520,
} as const;

export type DurationsMs = typeof durationsMs;
export type DurationToken = keyof DurationsMs;

/**
 * Mesmas durações em segundos como string — formato direto p/ CSS/Tailwind
 * (`theme.transitionDuration` / `animationDuration`).
 */
export const durations = {
  instant: "80ms",
  fast: "140ms",
  base: "220ms",
  slow: "320ms",
  celebration: "520ms",
} as const satisfies Record<DurationToken, string>;

export type Durations = typeof durations;

/**
 * Curvas de easing como `cubic-bezier(...)` (consumo CSS/Tailwind).
 * `snappy` é o default da marca: saída rápida com leve "settle".
 */
export const easing = {
  /** Linear — use só para loops contínuos (spinner, partícula). */
  linear: "cubic-bezier(0, 0, 1, 1)",
  /** Padrão de entrada/saída suave. */
  standard: "cubic-bezier(0.4, 0, 0.2, 1)",
  /** Default da marca: começa rápido, assenta — sensação "snappy". */
  snappy: "cubic-bezier(0.2, 0, 0, 1)",
  /** Overshoot leve para recompensa/aparição (sem exagero de cassino). */
  bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  /** Saída acelerada (algo deixando a tela). */
  exit: "cubic-bezier(0.4, 0, 1, 1)",
} as const;

export type Easing = typeof easing;
export type EasingToken = keyof Easing;

/**
 * Configs de mola para `withSpring` do Reanimated 4 (mobile).
 *
 * Parâmetros físicos (massa/stiffness/damping) — a base do "feel" tátil. Tunados
 * para serem SNAPPY (assentam rápido, overshoot controlado), não "molengas".
 * O admin não usa molas (CSS não tem física nativa); por isso ficam separadas
 * de `easing` e o preset Tailwind expõe só as curvas cubic-bezier.
 */
export interface SpringConfig {
  readonly mass: number;
  readonly stiffness: number;
  readonly damping: number;
}

export const springs = {
  /** Micro-interação (press, toggle): assenta quase imediato, sem overshoot. */
  snappy: { mass: 1, stiffness: 320, damping: 26 },
  /** Padrão para transições de UI com leve vida. */
  default: { mass: 1, stiffness: 220, damping: 22 },
  /** Recompensa/streak: overshoot perceptível e gostoso, ainda controlado. */
  bouncy: { mass: 1, stiffness: 260, damping: 14 },
  /** Movimento amplo e calmo (sheets, transição de tela). */
  gentle: { mass: 1, stiffness: 140, damping: 24 },
} as const satisfies Record<string, SpringConfig>;

export type Springs = typeof springs;
export type SpringToken = keyof Springs;

export const motion = {
  durationsMs,
  durations,
  easing,
  springs,
} as const;

export type Motion = typeof motion;
