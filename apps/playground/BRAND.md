# wellbet & Co. — Identidade oficial (SSoT do playground)

> ⚠️ **SUPERSEDED (jul/2026):** a identidade de PRODUÇÃO mudou. A fonte de
> verdade atual é `docs/WellBet_Design_System.md` + os assets oficiais em
> `docs/design-branding/` (símbolo punho+chama, wordmark bold arredondado,
> violeta `#5032FC`, ink `#08161E`, offwhite `#FAFBFC`; o raio/BoltMark e o
> magenta primário estão aposentados no app e na landing). Este deck continua
> valendo APENAS como registro histórico e para experimentos antigos do
> playground que ainda o referenciam.
>
> Fonte: deck da agência `CHARYA-IDs.pdf` (27 pranchas). Este arquivo é a **única
> fonte de verdade** de cor/tipografia/logo/voz para TODOS os systems do playground.
> Agentes: **leiam, não editem.** Importem tokens de `@/lib/brand` e o logo de
> `@/app/components/wellbet-logo`.

---

## 1. Arquitetura de marca

**wellbet & Co.®** é o _masterbrand_ (a holding de transformação comportamental).
Tagline-mãe: **“Mudanças reais acontecem quando existe algo em jogo.”**
Voz/assinatura: **“Bora? Bora!”** · “A melhor aposta é na sua mudança.”

Dois produtos de consumo, mesma engenharia de marca (lockup `Nome` + `Bet` com raio):

| Produto      | Tema        | Cor‑assinatura      | Promessa                                   | Copy de campanha |
|--------------|-------------|---------------------|--------------------------------------------|------------------|
| **WellBet**  | Emagrecimento / saúde | **azul elétrico + verde menta** | “SAÚDE + DINHEIRO = WELLBET.” “Sua disciplina agora vale mais.” | “Quanto você apostaria em si mesmo?” “Mais consistência. Mais ganhos.” |
| **GymBet**   | Treino / streak / ranking | **magenta + roxo/navy** | “TREINE. COMPITA. FATURAR.” “Entre no ranking.” | “Qual seu maior streak?” “Quem chega primeiro?” “Conquiste o jackpot.” |

Somos uma **bet** e devemos parecer uma — premium, não cassino barato. Vocabulário
obrigatório nos componentes: **cupom, cotação/odds, stake, banca, acumuladora,
cash out, “deu green”, free bet, payout, ranking, streak, jackpot, check‑in**.

---

## 2. Paleta (valores amostrados do deck — use `C` de `@/lib/brand`)

```
ink         #08161E   preto‑azulado da marca — texto/logo, ground escuro
navy        #0B1226   ground escuro alternativo (GymBet/OS)
indigo      #3215AD   indigo real — campo do masterbrand / muma
blue        #3945FF   azul elétrico — primária WellBet / link de marca
blueDeep    #2936FF   · blueSoft #656FFF
periwinkle  #CCD1FF   superfície indigo clara
green       #41FFCA   verde menta — o “green”/vitória/saúde
greenDeep   #18B488   · greenInk #0A2920 (texto sobre verde)
magenta     #FF00FF   primária GymBet
magentaDeep #C800D6   · pinkPale #FDC0FF
pink        #FF80E1   rosa “muma”/lúdico
paper       #FAFBFC   ground claro · white #FFFFFF
```

Gradientes oficiais (de `GRADIENT`):
- **voltage** `#41FFCA → #3945FF` (menta→azul · WellBet, energia)
- **gymbet** `#FF00FF → #7A1BD6 → #3215AD` (magenta→indigo)
- **iris** `#3215AD → #3945FF → #656FFF` (indigo)
- **muma** `#FF80E1 → #3215AD` (rosa→indigo)

Contraste: texto sobre verde/menta usa `ink`/`greenInk` (nunca branco). Texto sobre
indigo/azul/navy/magenta usa branco. Alvos de toque ≥ 44px. **Mobile‑first (~390px).**

---

## 3. Tipografia (carregadas no root `layout.tsx`, expostas como CSS vars)

- `--font-fraunces` — **Fraunces** (serifa display de alto contraste, eixos SOFT/WONK/opsz).
  É o “muma”: títulos editoriais, números‑herói, aspas/pontuação gigante. Use
  `font-variation-settings:"SOFT" 60,"WONK" 1,"opsz" 144` para o ar curvy/fashion.
- `--font-jakarta` — **Plus Jakarta Sans** (grotesca geométrica arredondada). UI, corpo,
  labels, a maioria dos botões e do texto de produto. É o “sans da casa”.
- `--font-archivo` — **Archivo** (pesos 800/900). Manchetes caixa‑alta esportivas (GymBet),
  tickers fortes.
- `--font-mono` — **Geist Mono**. Odds, stake, payout, contadores, tabular‑nums.

Regra: 1 serifa + 1 sans por system como protagonistas; o mono só para números.

---

## 4. Logo (componentes em `@/app/components/wellbet-logo`)

- `BoltMark` — **o raio‑seta oficial**, path vetorial extraído do PDF. `fill: currentColor`,
  recolorível. É o brandmark. Use como ícone, bullet de energia, selo de “green”.
- `BoltTile` — raio dentro de um quadrado arredondado (app‑icon). Props `bg`/`fg`.
- `WellbetCoLogo` — `BoltTile` + “wellbet & Co.” (Jakarta, minúsculo). Assinatura institucional.
- `ProductWordmark` — “Well”/“Gym” (ink) + “Bet” (cor‑assinatura) — lockup de produto.

Nunca distorça o raio. Sobre fundo claro, raio em `ink` ou na cor‑assinatura; sobre
escuro, raio em `green`/`magenta`/branco.

---

## 5. Estrutura de cada system (igual ao padrão existente)

Rota `app/systems/<slug>/`:
- `layout.tsx` — metadata + `bg` do tema (as fontes já vêm do root).
- `page.tsx` — `"use client"`, `<MotionConfig reducedMotion="user">`, `<BackToHub/>`,
  Hero + 3 seções + Footer.
- `_components/*` — `tokens.ts` (deriva de `C`) + widgets.

Três seções (idênticas em intenção ao iso‑gacha, referência em
`app/systems/iso-gacha/`):
1. **Fundamentos** — paleta, tipografia e componentes‑base, **todos interativos**.
2. **Playground** — widgets de bet **100% clicáveis e dopaminérgicos** (cupom, cotação ao
   vivo, acumuladora, cash out, “deu green”, free bet, ranking…).
3. **Telas** — mockups de celular (proporção iPhone, ~9/19.5), conteúdo rolável.

Avatares reais de `@/lib/avatars` (`USERS`) — nunca bonecos de palito.

---

## 6. Regras de runtime (Next 16 + Tailwind v4 + Framer v12) — OBRIGATÓRIO

- `"use client"` em todo arquivo com hook/motion/handler.
- **NUNCA** `Math.random()`/`Date.now()`/`new Date()`/`window`/`document` em render — só
  em handlers/`useEffect`. Para “aleatório”, use seed determinística por índice.
- **NUNCA** `transition:{type:"spring"}` em array de 3+ keyframes — use `tween`
  (`duration`/`ease`/`times`). Spring só entre 2 valores.
- `navigator.clipboard` só em handler, com `try/catch`.
- Telas de celular: `aspectRatio:"9 / 19.5"`, conteúdo em `overflow-y-auto`.
- Tailwind v4: `bg-[#08161E]`, `font-[family-name:var(--font-jakarta)]`, `@theme` para tokens.
- Slot/reels: render condicional simples + `key` (NÃO `AnimatePresence mode="wait"` com
  elemento de repetição infinita — trava e some o resultado).
- Validar sempre com **build limpo** (`rm -rf .next && next build`), não só `next dev`.
