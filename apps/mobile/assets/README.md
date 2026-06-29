# Assets nativos (som / Rive / Lottie)

## Áudio (`assets/audio/`) — ✅ presente

- `win.wav` — som de vitória/streak (arpejo C–E–G–C sintetizado). Tocado na tela
  de recompensa via `expo-audio` (`features/reward/RewardScreen.tsx`).

## Animações — hoje em CÓDIGO (Skia), sem asset binário

Os placeholders de Rive/Lottie foram substituídos por implementações em **Skia**
(GPU, UI thread), então não há mais asset binário faltando:

- **Confete** → `features/reward/components/Confetti.tsx` (partículas em Skia,
  desmonta ao fim). Antes era `confetti.json` (Lottie).

> O mascote (antigo `Mascot.tsx`, Skia) foi **removido** — fora do tom da marca
> Sportsbook Brutal. A celebração da recompensa é o badge + confete + "deu green".

Quando entrar arte de verdade (um `.riv` de mascote ~10–15× menor que Lottie, ou
um `confetti.json` autoral), basta trocar o interior desses dois componentes por
`<Rive/>` / `<LottieView/>` mantendo a mesma API — as deps `rive-react-native` e
`lottie-react-native` seguem instaladas para isso.

Regra de feel (§3): Rive = interativo · Lottie = decorativo discreto · Skia =
contínuo/partícula. Nada disso na tela de captura (sobriedade).
