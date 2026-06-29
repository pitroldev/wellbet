/**
 * "Deu green" — burst de confete (menta + magenta) on-demand. Import dinâmico
 * (não pesa o bundle inicial / LCP). Respeita prefers-reduced-motion.
 */
export async function fireGreen(origin?: { x: number; y: number }): Promise<void> {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const confetti = (await import("canvas-confetti")).default;
  const colors = ["#41FFCA", "#FF00FF", "#FF80E1", "#FFFFFF"];
  const at = origin ?? { x: 0.5, y: 0.62 };

  confetti({ particleCount: 90, spread: 78, startVelocity: 46, origin: at, colors, scalar: 1.05 });
  setTimeout(() => {
    confetti({
      particleCount: 55,
      spread: 110,
      decay: 0.92,
      startVelocity: 32,
      origin: at,
      colors,
    });
  }, 140);
}
