/**
 * "Deu green" — burst de confete one-shot, iniciado por clique (preview honesto,
 * nunca em loop nem automático). Import dinâmico (fora do bundle inicial / LCP).
 * Respeita prefers-reduced-motion.
 */
export async function fireGreen(origin?: { x: number; y: number }): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const confetti = (await import("canvas-confetti")).default;
  const at = origin ?? { x: 0.5, y: 0.45 };

  confetti({
    particleCount: 38,
    spread: 58,
    startVelocity: 38,
    scalar: 0.9,
    decay: 0.92,
    origin: at,
    colors: ["#ff00ff", "#41ffca", "#ff80e1", "#ffffff"],
    disableForReducedMotion: true,
  });
}
