# Assets nativos (Rive / Lottie / som)

Placeholders dos assets referenciados em código. Substituir pelos arquivos reais
antes do build (os `require(...)`/`resourceName` apontam para cá).

## Rive (`assets/rive/`)

- `mascot.riv` — mascote reativo (state-machines `welcome`, `reward`).
  Usado em `app/(onboarding)/index.tsx` e `features/reward/RewardScreen.tsx`.
  Preferir Rive a Lottie para interação/state-machine (~10-15× menor — §3).

## Lottie (`assets/lottie/`)

- `confetti.json` — confete decorativo, **não-loop**, desmonta ao fim.
  Usado em `features/reward/components/Confetti.tsx`.

## Áudio (`assets/audio/`)

- `win.mp3` — som de vitória/streak (expo-audio). TODO de RewardScreen.

Regra de feel (§3): Rive = interativo · Lottie = decorativo discreto · Skia =
contínuo/partícula. Nada disso na tela de captura (sobriedade).
