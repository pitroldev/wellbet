# Notas de Metro / Babel (apps/mobile)

Referência rápida das decisões de bundler/transform. Detalhes em §3 do doc de
Arquitetura Técnica (Mobile · Animação/Feel · Orçamento de performance).

## Babel (`babel.config.js`)

- Preset **`babel-preset-expo`** com `jsxImportSource: 'nativewind'` (necessário
  para o `className` do NativeWind v4 funcionar com o novo runtime de JSX).
- Preset **`nativewind/babel`** para o transform de CSS estático.
- **`react-native-worklets/plugin` PRECISA ser o ÚLTIMO plugin.**
  - No baseline jun/2026 os worklets saíram do core do Reanimated para o pacote
    separado **`react-native-worklets`**. Esse plugin substitui o antigo
    `react-native-reanimated/plugin`. Colocá-lo fora da última posição quebra a
    captura de variáveis nos worklets.

## Metro (`metro.config.js`)

- **`withNativeWind(config, { input: './global.css' })`** injeta o pipeline do
  NativeWind apontando para `global.css` (`@tailwind base/components/utilities`).
- **Monorepo pnpm + `node-linker=hoisted`:**
  - `watchFolders` inclui a raiz do workspace → hot-reload dos pacotes `@charya/*`.
  - `nodeModulesPaths` aponta para o `node_modules` do app e o da raiz.
  - `disableHierarchicalLookup = true` evita duplicar React / React Native.

## NativeWind / Tailwind

- NativeWind v4 roda sobre **Tailwind v3** (`tailwind.config.js` é TW3).
- O preset de tokens vem de **`@charya/ui-tokens/tailwind`** (mesma fonte que o
  admin). Tipografia/cores/espaçamento ficam lá, não duplicados aqui.

## New Architecture / 120Hz

- `newArchEnabled: true` no `app.config.ts` (Fabric + JSI + Hermes; única arch
  desde RN 0.82).
- `CADisableMinimumFrameDurationOnPhone: true` no Info.plist iOS para destravar
  120Hz ProMotion — sem isso o app fica preso em 60fps silenciosamente.

## Regra de ouro de performance

NativeWind para o **estático**; Reanimated 4 / Skia para **tudo que se move**.
Nunca animar por `className` ou estado React. **Não** usar Moti (quebra no RN4).
A tela de **captura é sóbria** (vídeo já consome CPU/GPU); a dopamina visual
fica nas telas de resultado/recompensa.
