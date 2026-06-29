/**
 * Curvas e durações de movimento — fonte ÚNICA. Ease "premium" (out-expo suave)
 * padrão da Charya. `base` = reveals; `slow` = manchetes mascaradas / cupom.
 */
export const EASE = [0.22, 1, 0.36, 1] as const;

export const DUR = {
  base: 0.6,
  slow: 0.8,
} as const;
