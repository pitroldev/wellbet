# WellBet — Design System 2.0 ("Chama Violeta")

> Spec de implementação do redesign que aplica a identidade oficial entregue em
> `docs/design-branding/` (ver README de lá para o mapa dos assets). Substitui a
> direção "Sportsbook Brutal" (landing) e recolore a "Midnight Aurora" (mobile).
> **O que NÃO muda:** a voz (docs/WellBet_Manual_de_Marca_e_Voz.md), a jornada
> (docs/WellBet_Jornada_do_Usuario.md), a copy existente, os fluxos e o i18n.

---

## 1. A identidade em uma frase

Punho dentro da chama: **luta com disciplina**. Violeta elétrico sobre ink
petróleo, tipografia bold arredondada, superfícies generosamente arredondadas,
textura de grão fino, e assets 3D táteis (moedas, estrela, streak) com rim de
neon azul-ciano. Premium de esporte, não neon de cassino.

## 2. Paleta (valores canônicos)

### Núcleo da marca

| Token          | Valor     | Papel                                              |
| -------------- | --------- | -------------------------------------------------- |
| `violet`       | `#5032FC` | Primária. Blocos, CTAs, fills, símbolo             |
| `violetDeep`   | `#3D22D6` | Pressed/hover de CTA, bordas fortes                |
| `violetSoft`   | `#9D8FFF` | **Texto/ícone violeta sobre escuro** (AA 6.8)      |
| `blue`         | `#4A96FF` | Acento (família dos assets 3D), texto ok no escuro |
| `cyan`         | `#3EC0FF` | Acento brilhante, rim/glow (AA 8.9 no ink)         |
| `ink`          | `#08161E` | Ground escuro oficial                              |
| `paper`        | `#FAFBFC` | Ground claro oficial (offwhite)                    |
| `green`        | `#41FFCA` | **Só vitória** ("deu green") — regra sagrada       |

### Derivados (escuro)

`void #050D13` (fundo mais fundo/scrim) · `surface #0E202B` (card sólido) ·
`surfaceElevated #132836` · `fog #B0C4D4` (texto secundário, AA 10.2) ·
`fogMute #7D93A4` (mudo, AA 5.7) · `danger #FF4D6D` / `dangerDeep #E23A57` ·
`white #FFFFFF`.

Translúcidos (padrão glass do mobile sobrevive): `glass rgba(255,255,255,0.05)`
· `glassStrong 0.08` · `hairline rgba(255,255,255,0.10)` · `hairlineStrong 0.18`
· `violetWash rgba(80,50,252,0.20)` · `blueWash rgba(74,150,255,0.14)` ·
`cyanGlow rgba(62,192,255,0.45)` · `violetGlow rgba(80,50,252,0.55)` ·
`greenWash rgba(65,255,202,0.14)` · `scrim rgba(5,13,19,0.60)`.

### Derivados (claro)

`paperMute #53626E` (AA 6.1) · `paperLine #E2E7EB` · `greenText #047857`
(verde AA sobre paper — mantido) · `greenInk #0A2920` · texto padrão = `ink`.

### Verde e família (inalterados)

`green #41FFCA` · `greenDeep #10B981` · `mint #7BFFDC` · `greenText` · `greenInk`.
Texto sobre verde é SEMPRE `greenInk`, nunca branco.

### Gradientes

| Nome        | Stops                              | Uso                                  |
| ----------- | ---------------------------------- | ------------------------------------ |
| `brand`     | `#5032FC → #4A96FF → #3EC0FF`      | CTA primário mobile, régua, barras   |
| `brandSoft` | `#9D8FFF → #4A96FF → #6ECCFB`      | Acentos suaves, hairline gradiente   |
| `ring`      | `#5032FC → #4A96FF → #41FFCA`      | ProgressRing (termina no green)      |
| `victory`   | `#41FFCA → #10B981`                | Momentos de green real               |
| `aurora`    | `#0D1E33 → #08161E → #050D13`      | Fundo Skia mobile                    |

Morrem: `gymbet`, `jackpot`, `foil`, `muma`, `iris` e qualquer iridescente.

### Regras de contraste (calculadas, não vibes)

- Violeta como TEXTO: só sobre paper/offwhite (6.3 ✓). **NUNCA sobre ink** (2.8 ✗).
- Sobre ink, acento de texto = `violetSoft #9D8FFF`, `blue #4A96FF` ou `cyan #3EC0FF`.
- Sobre violeta, texto = branco (6.6 ✓) ou offwhite (6.3 ✓). Nunca ink.
- Landing `Slab` (bloco de ênfase em superfície clara): fundo violeta + texto
  **branco** (antes era magenta+ink — a premissa mudou).
- Landing `GradText` (ênfase em superfície escura): usar `cyan` ou `violetSoft`.

## 3. Tipografia (unificada mobile + landing)

| Papel               | Família              | Notas                                        |
| ------------------- | -------------------- | -------------------------------------------- |
| Display/manchete    | **Outfit** 700–900   | Bold arredondada, DNA do wordmark. Sem caixa-alta forçada em frases longas; caps só em eyebrow/palavra-herói |
| Corpo/UI            | **Plus Jakarta Sans** 400–800 | Inalterada (voz "de gente")          |
| Números/labels/tags | **Geist Mono** 400–700 | Tabular; "DNA de bilhete". Substitui Space Mono na landing |

- Mobile: **já usa exatamente isso** — nada muda além de remover as deps legadas
  (`@expo-google-fonts/anton`, `archivo`, `space-mono`) do package.json.
- Landing (`app/layout.tsx`): manter os NOMES de var e trocar as fontes:
  `--font-archivo` := Outfit (700,800,900) · `--font-jakarta` := Plus Jakarta Sans
  · `--font-geist-mono` := Geist Mono. Display deixa de ser condensada: revisar
  `--text-hero` para `clamp(2.2rem, 5.6vw, 4.25rem)` e tracking de `-0.02em`
  (Outfit é mais larga que Anton — manchetes podem precisar de quebra editorial).
- Manchete: peso 800/900, sentence case com **ênfase** (Slab/GradText) na
  palavra-chave. Caixa-alta vira recurso pontual (eyebrow, "DEU GREEN").
- Itálico continua proibido.

## 4. Forma, profundidade e textura

- **Radius volta**: landing restaura `--radius-xl: 0.875rem`, `--radius-2xl:
  1.25rem`, `--radius-3xl: 1.75rem`. Mobile mantém a escala atual (10→34+pill).
- CTAs = pílula (mobile já é; landing migra de bloco canto-vivo p/ pílula).
- **Morrem**: clip-paths `--stub/--ticket/--shard`, sombras-carimbo
  `--stamp-*`, halftone, bordas 3px, BoltMark/raio-seta, estilhaço.
- **Sombra**: suave e escura (estilo `PANEL_SHADOW` do ecossistema:
  `0 1px 0 rgba(255,255,255,.06) inset, 0 24px 60px -28px rgba(5,13,19,.7)`), 
  nunca sombra colorida dura. Glow violeta/ciano com parcimônia (hero, ring,
  momento de recompensa) — os assets 3D têm rim de neon, a UI ecoa levemente.
- **Grão**: GrainOverlay da landing sobrevive (casa com a textura dos 3D);
  opacity até 0.05. Mobile: AuroraBackground sobrevive recolorida (blobs
  violeta/ciano/verde em alpha baixo sobre `aurora`).
- Bilhete/cupom (BetTicket): a metáfora sobrevive — perfuração e canhoto —
  mas com cantos arredondados (2xl) e costura pontilhada, sem clip-path afiado.

## 5. Marca aplicada

- **Símbolo (punho+chama)** substitui o raio em TODOS os pontos:
  - Landing `src/ui/brand.tsx`: `FlameMark` (SVG inline, `fill="currentColor"`,
    path em `docs/design-branding/extracted/symbol-wellbet.svg`, viewBox
    `0 0 191.4 283.95`) + `Wordmark` usando os SVGs prontos de
    `public/brand/wordmark-wellbet-{light,dark}.svg` (ou inline p/ recolor).
  - Mobile `src/shared/ui/BrandBolt.tsx` → `BrandFlame.tsx`: mesmo path em Skia,
    fill violeta sólido (ou gradiente `brand` sutil) + glow blur violeta.
    Flutuação vertical atual sobrevive. Atualizar TODOS os usos (index,
    sign-in, welcome) e o barrel.
- **Wordmark**: nunca redesenhar em fonte — usar os SVG/PNG oficiais.
  No mobile, header da home usa `wordmark-wellbet-dark.png` (expo-image,
  height ~22) em vez de `<Text>WellBet</Text>`.
- **Regra de integridade** (herda a "nunca distorça o raio"): símbolo e wordmark
  não se esticam, não se recolorem fora da paleta, não ganham sombra dura.
- **Assets 3D** (`/brand/*.png`, fundo transparente) — momentos, não papel de parede:
  - `3d-coin-simbolo-azul` → dinheiro/stake (landing hero/bilhete; mobile odds e pay)
  - `3d-coin-cifrao-violeta` → prêmio/bolo
  - `3d-star-azul` → vitória/score (result won, stats da landing)
  - `3d-streak-violeta` → streak (home/status)
  - Máximo 1 asset 3D por viewport; nunca competindo com o green da vitória.

## 6. Mobile — plano de mudança (apps/mobile)

Fonte da verdade dupla que DEVE mudar junta: `src/theme/arena.ts` +
`tailwind.config.js` (espelho manual). Renomear cores da marca (sem dó — a
dívida "magenta=violeta" não entra): `magenta`→`violet`, `magentaDeep`→
`violetDeep`, `orchid`→`violetSoft`, `purple`/`purpleDeep`/`indigo` →
substituídos por `blue`/`cyan`/família ink nova; gradiente `gymbet`→`brand`.
Manter nomes SEMÂNTICOS do NativeWind (`bg-background`, `text-muted`,
`arena-*`) — só os sufixos de cor renomeada mudam (ex.: `text-arena-magenta` →
`text-arena-violet`). **Verificação obrigatória: grep de
`magenta|gymbet|orchid|FF2BD6|7A1BD6|3D1F9E|0E0B20` em `apps/mobile/{app,src}`
tem que zerar** (exceto comentários históricos, que devem ser atualizados).

Pontos além do tema (mapeados): `Card.tsx` L36 `#7BFFDC` literal → token;
`Sparkline.tsx` L51 rgba magenta → violetWash; `AuroraBackground.tsx` blobs +
navy transparente `rgba(14,11,32,0)` → base ink `rgba(8,22,30,0)`;
`RewardBadge.tsx` idem; `Confetti` COLORS → paleta nova (violet/blue/cyan/white
— confete de GREEN continua green-dominante); `Text.tsx` variant `numeric`
(hoje magenta) → `violetSoft`; `tokens.ts` palette.

Identidade nativa (assets já gerados em `assets/brand/`): `app.config.ts` ganha
`icon: "./assets/brand/icon.png"`, splash via `expo-splash-screen` plugin
(image `./assets/brand/splash-icon.png`, `backgroundColor: "#08161E"`,
imageWidth 200) e `android.adaptiveIcon` (foreground
`./assets/brand/adaptive-icon.png`, backgroundColor `#5032FC`);
`android/.../values/colors.xml`: `splashscreen_background` → `#08161E`,
`colorPrimary` → `#5032FC` (os `splashscreen_logo.png` das 5 densidades já
foram regenerados com o símbolo violeta). Permissões e `name` já dizem WellBet.

Telas: consomem tokens/primitivos — o reskin propaga. O passe por tela é para:
trocar `BrandBolt`→`BrandFlame`, wordmark texto→imagem no header, revisar
washes/acentos (o que era "wash magenta" vira `violetWash`; acentos de TEXTO
sobre escuro migram para `violetSoft`/`cyan`), e integrar os 3D nos momentos do
§5 (odds, pay, result won, streak na StatusBar/home). A régua de dopamina do
manual segue: captura sóbria, festa só no green real.

## 7. Landing — plano de mudança (apps/landing)

`app/globals.css` é 90%: reescrever `@theme` com a paleta §2 (nomes novos
honestos: `--color-violet`, `--color-violet-deep`, `--color-violet-soft`,
`--color-blue`, `--color-cyan`; `--color-magenta` e aliases mentirosos morrem —
varrer `bg-magenta/text-magenta/border-magenta` etc. nos ~15 arquivos),
restaurar radius reais, apagar stamps/clip-paths/foil/halftone, criar
`--glow-violet/--glow-cyan`, `--gradient-brand`, sombra `--panel`. `--color-paper`
vira `#FAFBFC` (offwhite oficial, sai o osso `#f1efe9`). **Grep obrigatório ao
fim: `ff00ff|c026d3|ff80e1|9d4edd|f1efe9|anton|Anton` zera em `apps/landing/`.**

Demais pontos (todos mapeados): `layout.tsx` (fontes §3, `themeColor: "#FAFBFC"`),
`brand.tsx` (FlameMark/Wordmark novos), `text.tsx` (Slab violeta+branco,
GradText cyan/violetSoft, Eyebrow com FlameMark bullet), `CTA.tsx` (pílula
violeta, hover violetDeep + glow sutil, magnetic sobrevive), `CardBrutal.tsx` →
`Card.tsx` arredondado com `--panel` (renomear arquivo + imports),
`Tag.tsx` (pílula), `StakeLever` (polegar circular), `BetTicket` (cupom
arredondado com perfuração pontilhada + moeda 3D), `GreenPreview` (carimbo
verde arredondado — a festa continua igual), `TickerBand` (Outfit, separador
FlameMark, borda violeta), `StatsBoard`/`ComoFunciona`/`Confianca`/`CTAFinal`/
`Footer`/`StickyBar` (tokens novos, régua em `--gradient-brand`),
`opengraph-image.tsx` (reescrever: paper offwhite, wordmark/símbolo violeta,
"deu green" verde; `twitter-image.tsx` re-exporta — manter exports),
`global-error.tsx` (paleta nova na mão), `fireGreen.ts` (confete
`['#41FFCA','#5032FC','#4A96FF','#FFFFFF']` — green dominante),
`app/icon.svg` NOVO (símbolo violeta), `app/not-found.tsx` NOVO (404 tematizada,
tom "vazio" do manual: convite, não vergonha).

Hero: manter a narrativa e a copy. O bilhete continua o herói interativo;
`3d-coin-simbolo-azul` entra como presença física (flutuação leve, respeitando
reduce-motion). Ritmo claro/escuro das seções sobrevive (paper ↔ ink/navy →
agora paper `#FAFBFC` ↔ `ink/surface`).

## 8. Motion

Inalterado na essência: landing `EASE [0.22,1,0.36,1]` + `DUR` atuais; mobile
durations/springs de `@charya/ui-tokens`. Springs suaves (280/26) casam com a
forma arredondada. Reduce-motion continua lei. Dopamina: confete/som/háptico
só no green real ou simulação rotulada.

## 9. Fora de escopo deste redesign

Admin (tema próprio sóbrio — fica), playground (recebe só um banner de
"superseded" no BRAND.md), e-mails, copy/i18n (exceto onde a UI exigir label
novo), fluxos e API.
