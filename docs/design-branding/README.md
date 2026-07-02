# Design & Branding — WellBet / GymBet

Entrega do designer (Giovanni Tramontini, jul/2026). **Atenção: os nomes dos
arquivos originais estão embaralhados** (exportação em lote trocou extensões e
rótulos). A tabela abaixo mapeia cada arquivo ao seu conteúdo REAL. Os assets
normalizados e prontos para uso estão em [`extracted/`](./extracted/).

## O que cada arquivo original contém de verdade

| Arquivo original           | Formato real | Conteúdo real                                                 |
| -------------------------- | ------------ | ------------------------------------------------------------- |
| `WELLBET - Brandbook.pdf`  | PDF 1pág     | Símbolo punho+chama em violeta `#5032FC`                       |
| `WELLBET-Branco.svg`       | SVG vetor    | Símbolo em violeta `#5032FC`                                   |
| `WELLBET-Preto.svg`        | SVG vetor    | Símbolo sem fill (preto) — **fonte do vetor limpo**            |
| `STREAK_roxo.svg`          | PNG raster   | **Wordmark WELLBET** ink `#08161E` + símbolo violeta           |
| `WELLBET-roxo+preto.svg`   | SVG+PNG b64  | Moeda 3D azul com símbolo em relevo                            |
| `LOGO_logo.svg`            | PNG raster   | Estrela 3D azul                                                |
| `SÍMBOLO-preto_inst.svg`   | SVG+PNG b64  | "Streak" 3D (chama-raio) roxo                                  |
| `GYMBET-preto.svg`         | SVG+PNG b64  | Moeda 3D roxa com cifrão $                                     |
| `STREAK_rosa.svg`          | SVG+PNG b64  | Moeda 3D magenta com símbolo em relevo                         |
| `GYMBET-branco.svg`        | SVG vetor    | Wordmark GYMBET ink + símbolo magenta `#E734F7`                |
| `GYMBET-offwhite.svg`      | PNG raster   | Wordmark GYMBET offwhite + símbolo magenta                     |
| `GYMBET-rosa+branco.svg`   | PNG raster   | Wordmark GYMBET todo offwhite                                  |
| `STAR_rosa.svg`            | SVG vetor    | Wordmark GYMBET todo offwhite `#FAFBFC`                        |
| `COIN_roxo.svg`            | EPS (AI)     | Provável wordmark WELLBET vetorial (bbox 459×89) — sem conversor |
| `LOGO_rosa.svg`            | EPS (AI)     | Provável wordmark GYMBET vetorial (bbox 419×85)                |
| `COIN_rosa.svg`            | EPS (AI)     | Arte 3D (bbox 518×526)                                         |
| `STAR_roxo.svg`            | EPS (AI)     | Arte 3D (bbox 518×526)                                         |
| `SÍMBOLO-preto.svg`        | EPS (AI)     | Símbolo (bbox 192×284)                                         |
| `SÍMBOLO-azul.svg`         | PDF (AI)     | **Vazio** — AI salvo sem conteúdo PDF                          |
| `SÍMBOLO-offwhite_1.svg`   | PDF (AI)     | **Vazio** — AI salvo sem conteúdo PDF                          |
| `SÍMBOLO-rosa.svg`         | PDF (AI)     | **Vazio** — AI salvo sem conteúdo PDF                          |

## As duas marcas do ecossistema

- **WellBet** (este app — aposta na própria meta de peso): violeta `#5032FC`,
  ink `#08161E`, offwhite `#FAFBFC`. Assets 3D na família azul
  (`#4A96FF → #3EC0FF` com rim ciano).
- **GymBet** (produto irmão — fitness social): magenta `#E734F7`, mesma
  estrutura. Assets 3D na família magenta/roxa.
- Símbolo (punho dentro da chama) e construção do wordmark são compartilhados.

## Paleta amostrada dos assets 3D (para glows/gradientes)

| Asset                 | Cores dominantes                                    |
| --------------------- | --------------------------------------------------- |
| Moeda símbolo azul    | `#4748D5` `#5B8BF2` `#64B0F7` `#6ECCFB` sobre `#0B161D` |
| Estrela azul          | `#322AA4` `#5053FD` `#4A96FF` `#3EC0FF`              |
| Streak violeta (shift)| família `#5032FC` (hue-shift −46° do roxo original)  |

## `extracted/` — assets prontos

- `symbol-wellbet.svg` — símbolo vetorial, `fill="currentColor"` (recolorível)
- `wordmark-wellbet.svg` — vetorizado do raster (potrace); símbolo `#5032FC`,
  texto `currentColor`
- `wordmark-wellbet-{dark,light,mono-offwhite,mono-ink}.svg` — variantes prontas
- `3d-*.png` — masters aparados com transparência
- `3d-streak-violeta.png` / `3d-coin-cifrao-violeta.png` — hue-shift para a
  família WellBet (o original roxo-magenta é do território GymBet)

Distribuídos em `apps/landing/public/brand/` e `apps/mobile/assets/brand/`
(mobile inclui `icon.png`, `adaptive-icon.png`, `splash-icon.png` gerados:
símbolo offwhite sobre violeta / violeta para splash).
