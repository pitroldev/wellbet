# Charya Bet — Threat Model da Comprovação de Peso

> **Documento interno e confidencial.** Modelagem de ameaças **defensiva** do mecanismo de comprovação de peso do Charya Bet (WellBet). Cataloga as formas conhecidas de burlar a pesagem e as mitigações correspondentes, para endurecer o produto. Não é um manual operacional de fraude: os passos são descritos no nível necessário para projetar defesas.

- **Data:** 17/06/2026
- **Escopo:** mecânica de pesagem (baseline, intermediária e final) do Charya Bet — vídeo contínuo + token dinâmico + gesto/liveness + OCR + engine comportamental + revisão humana.
- **Cobertura:** **101 vetores** de fraude em 7 categorias (consolidados de 114 brutos levantados por 7 frentes de red-team + revisão de completude).
- **Fontes de contexto:** `docs/Ecossistema_Charya.md`, `AUDITORIA.docx`, `PRD - Ecossistema CHARYA V2.docx`.

---

## Resumo executivo

O Charya Bet enfrenta um problema de **adversário economicamente motivado**: o payout é dinheiro real e imediato, o ICP (homens 30-50, competitivos, fluentes em apostas e Pix) é exatamente o perfil disposto a "jogar o jogo" no limite das regras, e o vetor central de fraude — provar um peso falso — pode ser atacado de **101 formas mapeadas**, da gambiarra low-tech (offset de fábrica na balança, lastro no baseline, mão na pia fora de quadro, banheiro esvaziado) até o ataque sofisticado (câmera virtual com feed injetado, deepfake respondendo challenge em tempo real, vídeo 100% GenAI, spoof de balança BLE, injeção no Apple Health). A distribuição das categorias mostra que o risco **não está concentrado em uma camada**: manipulação física da balança/visor (14), truques corporais (16), identidade/proxy/conluio (15), manipulação de mídia (14), spoofing digital (14), derrota de OCR/token/liveness (15) e abuso de processo/política (13). Qualquer defesa que invista só em "biometria boa" ou só em "OCR bom" deixa flancos inteiros abertos.

O padrão econômico mais importante: **a maioria dos vetores de alta probabilidade tem baixa sofisticação**. Offset de calibração, troca de balança, lastro no baseline, roupa pesada no baseline vs. seminu no final, esvaziar bexiga/intestino, super-hidratação e carga de sal/carbo no baseline, retry farming, goal-gaming do swing fisiológico, GPS spoofing, manipulação do relógio, adesivo de dígitos no visor, "falar" o token em vez de mostrá-lo, replay de tela filmada — tudo isso é **alta probabilidade e baixíssimo custo para o fraudador**. São esses que quebram a banca em escala, não o deepfake premiado. A consequência estratégica é clara: o MVP deve **matar o "low-hanging fruit" primeiro**, porque é onde está o EV (valor esperado) negativo para a casa. Os ataques sofisticados (GenAI, máscara 3D de silicone, deepfake em tempo real, KYC farm) são caros, lentos e raros — e a Fase 2/3 os encarece ainda mais.

A filosofia de defesa do Charya — **não eliminar 100% da fraude, mas torná-la cara, trabalhosa e economicamente inviável na média** — é a correta e deve ser operacionalizada como um princípio de design: cada mitigação tem que **aumentar o custo, o tempo, a perícia ou o risco de detecção** do fraudador acima do payout esperado. Concretamente isso significa atacar a **economia do swing**: o vetor de longe mais perigoso, e que combina vários da lista (baseline inflado por super-hidratação/sal/carbo + roupa pesada + bexiga cheia no início, contra desidratação aguda + jejum + seminu no final), permite "perder" 4-8 kg de água e conteúdo intestinal **sem emagrecer um grama de gordura**, de forma fisiologicamente real e quase indetectável por vídeo. Defender isso exige underwriting comportamental (engine Charya), não computer vision. O segundo eixo crítico é o **desacoplamento do token do peso**: token dinâmico só prova que _alguém_ estava ao vivo, não que _aquela balança_ mostra _o peso daquele corpo_ — o ataque "titular canta o token, proxy se pesa fora de quadro" e o "token correto + peso de outra sessão" exigem amarração temporal e espacial rígida (token deve aparecer _no mesmo frame_ do visor e do rosto, em vídeo contínuo verificado).

A defesa, portanto, é **em profundidade e em camadas correlacionadas**: (1) regras automáticas baratas que filtram a massa de fraude trivial e impõem fricção (baseline supervisionado, janela aleatória de pesagem, protocolo de roupa/hidratação, token co-localizado com o peso); (2) IA/computer vision que encarece a falsificação de mídia (detecção de tela filmada, body estimation, análise de edição/metadata, OCR robusto a parallax/arredondamento); (3) revisão humana focada e blindada contra engenharia social, reservada a payout alto e flags — sabendo que o **insider na camada 3 e o suporte como vetor de social engineering** são eles próprios ameaças de alto impacto. O resto deste relatório prioriza essas mitigações pelo critério de impacto-por-custo, ancorando cada uma nas Fases 1/MVP, 2 e 3 já planejadas.

---

## Índice

1. [Resumo executivo](#resumo-executivo)
2. [Como ler este documento](#como-ler-este-documento)
3. [Matriz de priorização de risco](#matriz-de-priorização-de-risco)
4. [Catálogo de vetores por categoria](#catálogo-de-vetores-por-categoria)
   - [1. Manipulação física da balança e do visor](#1-manipulação-física-da-balança-e-do-visor) — 14 vetores
   - [2. Truques corporais e de peso aparente no momento da pesagem](#2-truques-corporais-e-de-peso-aparente-no-momento-da-pesagem) — 16 vetores
   - [3. Fraude de identidade, proxy e conluio (pesar outra pessoa)](#3-fraude-de-identidade-proxy-e-conluio-pesar-outra-pessoa) — 15 vetores
   - [4. Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI)](#4-manipulação-de-vídeo-e-mídia-replay-edição-deepfakegenai) — 14 vetores
   - [5. Spoofing digital: app, câmera e sensores (balança smart, wearables, API)](#5-spoofing-digital-app-câmera-e-sensores-balança-smart-wearables-api) — 14 vetores
   - [6. Derrota de OCR, token dinâmico, gesto e liveness](#6-derrota-de-ocr-token-dinâmico-gesto-e-liveness) — 15 vetores
   - [7. Abuso de processo, metas, baseline e políticas](#7-abuso-de-processo-metas-baseline-e-políticas) — 13 vetores
5. [Roadmap de defesa por fase](#roadmap-de-defesa-por-fase)
6. [Quick wins para o MVP](#quick-wins-para-o-mvp)

---

## Como ler este documento

Cada vetor segue o mesmo template:

- **Como funciona** — a lógica do ataque e por que ele engana a comprovação.
- **Como é executado** — o caminho realista do fraudador (no nível necessário para defender).
- **Métricas** — `Sofisticação · Custo p/ fraudador · Probabilidade · Impacto`.
- **Sinais de detecção** — o que delata o ataque.
- **Mitigações** — controles concretos no stack Charya (token dinâmico, liveness/biometria de terceiros, OCR, engine comportamental/plausibilidade fisiológica, wearables/balança smart, revisão humana, processo/política).

Legenda de risco: 🟢 baixo · 🟡 médio · 🔴 alto.

---

## Matriz de priorização de risco

Ordenada por **urgência de mitigação** = (Probabilidade × Impacto), ponderada para priorizar ataques de **baixa sofisticação** (fáceis de executar e danosos vêm primeiro). Top 30 de 101 vetores; as métricas de cada vetor também aparecem inline em sua seção.

| #   | Vetor                                                      | Categoria                                                     |  Prob.   | Impacto  | Sofist. | Prioridade |
| --- | ---------------------------------------------------------- | ------------------------------------------------------------- | :------: | :------: | :-----: | :--------: |
| 1   | Offset de calibração de fábrica (TARE/UNIT)                | Manipulação física da balança e do visor                      | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 2   | Troca de balança entre pesagens                            | Manipulação física da balança e do visor                      | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 3   | Lastro oculto no corpo/roupa no baseline                   | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 4   | Compartilhamento de conta familiar                         | Fraude de identidade, proxy e conluio (pesar outra pessoa)    | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 5   | Replay de tela filmada (segunda tela)                      | Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI) | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 6   | Replay attack puro (token desatualizado)                   | Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI) | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 7   | Injeção de peso falso no Apple Health / Health Connect     | Spoofing digital                                              | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 8   | Adesivo/overlay físico de dígitos no visor                 | Derrota de OCR, token dinâmico, gesto e liveness              | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 9   | Falar o token em vez de mostrar (desacoplar do peso)       | Derrota de OCR, token dinâmico, gesto e liveness              | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 10  | Timing diurnal/menstrual/intestinal das pesagens           | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 11  | Retry farming (reenvio até passar)                         | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🔴 alto  |  baixa  |     27     |
| 12  | Mostrador analógico ajustado / pré-carga do ponteiro       | Manipulação física da balança e do visor                      | 🟡 média | 🔴 alto  |  baixa  |     18     |
| 13  | Roupa/calçado pesado no baseline vs. seminu no final       | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🟡 médio |  baixa  |     18     |
| 14  | Apoio oculto em parede/móvel fora de quadro                | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 15  | Mão pressionada em bancada/pia/corrimão                    | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 16  | Esvaziamento de bexiga/intestino + jejum matinal           | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🟡 médio |  baixa  |     18     |
| 17  | Baseline inflado por super-hidratação e carga de sal/carbo | Truques corporais e de peso aparente no momento da pesagem    | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 18  | Dublê magro de aparência semelhante no final               | Fraude de identidade, proxy e conluio (pesar outra pessoa)    | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 19  | Token cantado pelo titular + peso de proxy fora de quadro  | Fraude de identidade, proxy e conluio (pesar outra pessoa)    | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 20  | Reuso/edição de dois vídeos reais com condição inflada     | Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI) | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 21  | Foto impressa / segundo display no lugar do visor          | Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI) | 🟡 média | 🔴 alto  |  baixa  |     18     |
| 22  | GPS spoofing da geolocalização                             | Spoofing digital                                              | 🔴 alta  | 🟡 médio |  baixa  |     18     |
| 23  | Manipulação do relógio do device                           | Spoofing digital                                              | 🔴 alta  | 🟡 médio |  baixa  |     18     |
| 24  | Segundo device disfarçado de visor da balança              | Derrota de OCR, token dinâmico, gesto e liveness              | 🟡 média | 🔴 alto  |  baixa  |     18     |
| 25  | Degradação proposital da imagem do visor                   | Derrota de OCR, token dinâmico, gesto e liveness              | 🔴 alta  | 🟡 médio |  baixa  |     18     |
| 26  | Goal-gaming: meta/prazo calibrados ao swing fisiológico    | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 27  | Arbitragem entre balanças descalibradas                    | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 28  | Abandono-e-recriação para re-roll do baseline              | Abuso de processo, metas, baseline e políticas                | 🟡 média | 🔴 alto  |  baixa  |     18     |
| 29  | Engenharia social no suporte humano (camada 3)             | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🔴 alto  |  média  |     18     |
| 30  | Exploração de ambiguidade de regras                        | Abuso de processo, metas, baseline e políticas                | 🔴 alta  | 🟡 médio |  baixa  |     18     |

> A prioridade combina dano e facilidade: um ataque 🔴/🔴 de sofisticação **baixa** pontua mais alto que um 🔴/🔴 de sofisticação **alta**, porque é o que mais aparece na prática e exige defesa primeiro.

---

## Catálogo de vetores por categoria

## 1. Manipulação física da balança e do visor

_14 vetores nesta categoria._

### Offset de calibração de fábrica (TARE/UNIT)

**Como funciona:** Balanças digitais baratas (sub-R$80, comuns em farmácias e marketplaces) expõem um modo de calibração ao usuário final, normalmente por sequência de toques no botão UNIT/MODE ou por menu de serviço. O fraudador aplica um offset fixo positivo na pesagem inicial (baseline inflado, ex.: +6 kg) e zera o offset na pesagem final. Como o offset é interno ao firmware, o visor exibe um número "limpo", sem rasura física, e o OCR lê normalmente. A diferença fabricada vira "perda de peso" sem que o corpo mude.

**Como é executado:** O fraudador identifica o modelo da balança e a sequência de calibração (amplamente documentada por modelo). Antes do vídeo de baseline, programa um peso de referência falso para forçar o ganho/offset; sobe na balança e grava o vídeo contínuo com token e gesto normalmente, exibindo o peso inflado. Antes do vídeo final, restaura a calibração de fábrica e grava de novo. Os dois vídeos passam liveness e token porque o ataque é na origem do número, não no vídeo.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Peso inicial fisiologicamente implausível para a estatura/biotipo aparente no vídeo (homem que parece 95 kg exibindo 112 kg).
- Salto de perda concentrado entre baseline e check-in intermediário, com platô depois (típico de offset removido cedo).
- Inconsistência entre o peso declarado e a circunferência/volume corporal estimável no vídeo.
- Mesmo modelo de balança barato com histórico de fraude na base.
- Diferença entre peso da balança e peso reportado por wearable/IMC plausível.

**Mitigações:**

- Engine de plausibilidade fisiológica: limite duro de perda semanal (ex.: >1,5% do peso corporal/semana dispara revisão) e curva de perda esperada por perfil; baseline no topo da faixa plausível recebe peso extra no score de risco.
- Exigir pesagem de baseline com objeto de referência conhecido no mesmo vídeo (ex.: subir com um galão de água lacrado de 5 kg / fardo de 6 garrafas; o app valida o delta esperado). Offset de calibração distorce o objeto de referência e o corpo de forma proporcional, denunciando o ganho.
- Body estimation (Fase 2): estimar massa por silhueta/volume e cruzar com o peso lido; divergência > tolerância vira flag.
- Cross-check obrigatório com balança smart/wearable (Fase 3) para baselines acima de um limiar de payout.
- Revisão humana obrigatória para baselines no topo do range e para qualquer caso onde o baseline define payout alto.
- Política: registrar marca/modelo da balança; correlacionar modelos com calibração aberta a um pool de risco elevado.

### Mostrador analógico ajustado / pré-carga do ponteiro

**Como funciona:** Balanças de ponteiro (mola) têm uma roda de zero que o usuário gira para calibrar. O fraudador gira para +X no baseline (ponteiro parte adiantado) e para −X ou zero no final. Não há metadata, checksum nem timestamp no visor analógico; o OCR apenas lê a posição do ponteiro, que pode ter sido pré-deslocada.

**Como é executado:** Antes do vídeo de baseline, o fraudador gira discretamente a roda de zero para que a balança vazia marque, por exemplo, +5 kg, deixando isso fora de quadro. Sobe e grava o vídeo contínuo mostrando o ponteiro inflado. No final, reposiciona o zero (ou para abaixo de zero) e grava de novo. O vídeo é contínuo e o gesto/token estão presentes; só o instrumento foi viciado.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Balança analógica em si já é sinal de risco (sem telemetria, sem reprodutibilidade).
- Ponteiro não retornando exatamente a zero quando a balança está vazia (se capturado).
- Leituras "redondas" demais ou platôs incompatíveis com balança de mola (que tem ruído/oscilação natural).
- Ausência da oscilação típica do ponteiro ao subir.

**Mitigações:**

- Política dura: rejeitar balança analógica/mola para comprovação de peso; exigir balança digital com visor numérico. UX do app educa e bloqueia submissões analógicas via classificador de imagem (Fase 2 detecta tipo de balança).
- Exigir captura obrigatória da balança vazia marcando 0,0 imediatamente antes de subir, no mesmo vídeo contínuo (o token aparece sobre o visor zerado).
- Objeto de referência de massa conhecida no mesmo vídeo para validar a escala do instrumento.
- Revisão humana para qualquer submissão classificada como analógica que escape do bloqueio automático.

### Calibração por software / multiplicador-offset em balança BLE

**Como funciona:** Balanças BLE/Wi-Fi (incluindo as "smart" da Fase 3) aceitam comandos de calibração — ganho (multiplicador) e offset — via app de fábrica ou GATT BLE. O fraudador injeta ganho/offset persistente que infla o baseline (ex.: ganho 1,06 ou offset +7 kg) e restaura 1.0/0 no final. Tanto o visor quanto a telemetria BLE reportam o número adulterado, então até o cross-check da balança smart é envenenado na origem.

**Como é executado:** Usando app do fabricante, ferramentas BLE genéricas (nRF Connect) ou app modificado, o fraudador descobre o serviço/característica de calibração e grava um multiplicador-offset. Faz baseline com valores inflados (visor e telemetria concordam, parecendo consistentes), depois reseta para a calibração honesta no final. Por o ataque persistir no dispositivo, ele engana inclusive a integração nativa Charya com a balança.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Calibração honesta deveria ser estável ao longo de meses; mudança de ganho/offset entre baseline e final é anômala se o firmware reportar parâmetros de calibração.
- Telemetria "perfeita" (visor e BLE batem exatamente) combinada com perda implausível.
- Histórico de check-ins sem ruído/variação intra-dia natural.
- Objeto de referência lendo errado proporcionalmente ao corpo.

**Mitigações:**

- Atestação de calibração: na integração Fase 3, ler e versionar os parâmetros de calibração (ganho/offset) do dispositivo a cada pesagem; qualquer alteração entre baseline e final dispara revisão e pode invalidar a sequência.
- Lacrar a calibração: na primeira pareação com a Charya, registrar o fingerprint de calibração e exigir que permaneça estável; mudança = reset do baseline.
- Exigir objeto de referência de massa conhecida no vídeo da pesagem com balança smart (ganho/offset distorce o objeto, denunciando).
- Cross-check tri-fonte: visor (OCR), telemetria BLE e wearable/IMC plausível; exigir concordância das três para payout alto.
- Plausibilidade fisiológica como rede de segurança independente do dispositivo.
- Preferir lista de balanças homologadas cujo firmware não exponha calibração ao usuário ou exija autenticação.

### Firmware adulterado / MITM em balança smart

**Como funciona:** O fraudador substitui ou modifica o firmware da balança, ou intercepta o app intermediário entre a balança e a Charya (proxy BLE, app companion modificado, emulador de periférico GATT). O dispositivo passa a reportar qualquer peso arbitrário tanto no visor quanto na telemetria. É o ataque mais perigoso da Fase 3 porque corrompe a fonte que deveria ser "confiável".

**Como é executado:** O fraudador usa um periférico BLE emulado (ex.: ESP32 anunciando o mesmo perfil GATT da balança homologada) ou um app companion patcheado que injeta valores; alternativamente faz reflash do firmware. A Charya, ao parear, recebe um stream de pesos forjados consistente com o vídeo (o fraudador exibe um visor secundário ou usa display falso, ver vetor abaixo). Sem atestação criptográfica, a Charya não distingue a balança real do emulador.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Ausência de assinatura/atestação válida do dispositivo.
- Identificadores BLE (MAC, características, firmware version) que não batem com o modelo homologado ou que se repetem entre contas distintas.
- Telemetria sem o ruído/jitter físico esperado de células de carga reais (sinal "limpo demais").
- Padrões de pacotes/timing atípicos do GATT.
- Reuso do mesmo dispositivo (fingerprint) por múltiplas contas.

**Mitigações:**

- Exigir atestação criptográfica do dispositivo na Fase 3: balanças homologadas com chave de hardware (secure element) assinando cada leitura com nonce/timestamp emitido pela Charya — impede emulador e replay de telemetria.
- Pareamento certificado: aceitar apenas device IDs/firmware versions de uma allowlist; rejeitar perfis GATT genéricos.
- Nonce dinâmico da Charya por pesagem (análogo ao token de tela): a balança deve assinar uma challenge fresca, derrubando MITM/replay.
- Tratar a telemetria da balança smart como evidência corroborante, nunca soberana: sempre exigir vídeo contínuo + token + plausibilidade fisiológica em paralelo.
- Detecção de anomalia de sinal (jitter ausente, timing) no ingestor de telemetria.
- Revisão humana e device fingerprinting para payouts altos; bloquear reuso de fingerprint entre contas.

### Display físico falso sobreposto ao visor

**Como funciona:** O fraudador cobre o visor real da balança com um display falso de 7 segmentos (LCD/e-ink/painel de segmentos adesivo) controlado por microcontrolador BLE (ESP32 + driver de segmentos). O OCR lê o número exibido pelo display falso, totalmente desacoplado do peso real. É um ataque puramente óptico contra o OCR e o revisor humano.

**Como é executado:** O fraudador monta um overlay fino sobre o visor original, com aparência convincente do mesmo tipo de display, e o controla por celular/BLE para mostrar qualquer valor. Grava o vídeo contínuo subindo na balança; o display falso mostra o peso desejado (inflado no baseline, reduzido no final). Token e gesto são executados normalmente. O corpo real sobe na balança, então peso/biotipo parecem coerentes superficialmente.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Visor com profundidade/espessura, bordas, reflexo ou paralaxe anômalos em relação ao corpo da balança.
- Fonte/segmentos do display não correspondendo ao modelo declarado.
- Latência entre subir na balança e o número "estabilizar" inconsistente com a física (display falso pode mostrar valor instantâneo ou ter dígitos que não tremem).
- Ausência da micro-oscilação do último dígito típica de células de carga reais.
- Reflexo do ambiente/token na superfície do visor incoerente.

**Mitigações:**

- Cross-check obrigatório visor (OCR) vs telemetria BLE/wearable: o display falso não move a telemetria real, então diverge.
- Exigir objeto de referência de massa conhecida no mesmo vídeo: o display falso não saberá reproduzir a leitura correta do objeto + corpo de forma consistente.
- Computer vision (Fase 2): detectar overlay/adesivo no visor, anomalia de profundidade, fonte de display divergente do modelo, ausência de jitter do dígito final.
- Pedir gesto que envolva o visor (ex.: aproximar a mão, tocar o botão de zerar e mostrar 0,0 antes de subir) capturando o visor em ângulos múltiplos no vídeo contínuo — dificulta overlay convincente.
- Liveness do peso: exigir captura contínua da subida com transição 0,0 → peso, observando a curva de estabilização física.
- Revisão humana para payouts altos com foco em integridade do visor.

### Troca de balança entre pesagens

**Como funciona:** O fraudador usa duas balanças físicas diferentes: uma que lê "pesado" (descalibrada para cima) no baseline e outra que lê "leve" no final. Sem um fingerprint do equipamento amarrando todos os momentos da jornada, a Charya não percebe que são instrumentos distintos.

**Como é executado:** O fraudador testa balanças até achar uma que marca alto e outra que marca baixo (ou descalibra duas propositalmente). Grava o baseline com a "pesada" e o final com a "leve". Ambos os vídeos são contínuos, com token/gesto válidos. A diferença é puramente instrumental.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Aparência da balança (cor, formato, visor, plataforma, marca) diferente entre baseline, intermediária e final no vídeo.
- Modelo/visor de balança trocando ao longo da jornada.
- Telemetria/device ID BLE diferente entre pesagens (Fase 3).
- Objeto de referência lendo diferente entre as duas balanças.

**Mitigações:**

- Fingerprint do equipamento ao longo da jornada: na Fase 1, capturar e comparar características visuais da balança (modelo, cor, marcas físicas, padrão do visor) entre baseline e final via computer vision; mudança dispara revisão.
- Fase 3: amarrar todas as pesagens ao mesmo device ID BLE/atestação; balança diferente entre momentos invalida a sequência ou exige reaprovação.
- Objeto de referência de massa conhecida em todas as pesagens: balanças distintas terão erros distintos no objeto, denunciando a troca.
- Política: declarar a balança no onboarding (foto, marca/modelo) e exigir a mesma balança em toda a jornada; trocas justificadas exigem novo baseline.
- Plausibilidade fisiológica como rede independente do instrumento.

### Bateria fraca para drift de leitura

**Como funciona:** Balanças digitais com bateria quase esgotada produzem leituras instáveis e enviesadas (subtensão no ADC/células). O fraudador explora esse defeito para obter baseline alto e final baixo, com deniabilidade: "minha balança estava com a pilha fraca, não foi proposital".

**Como é executado:** O fraudador descobre, por tentativa, em que estado de bateria a balança vicia para cima e captura o baseline nesse estado; troca a pilha (ou aguarda) para o final ler corretamente/baixo. O viés é real e físico, mas explorado intencionalmente. A deniabilidade é a arma principal.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Leitura instável/oscilante no vídeo de baseline (números pulando antes de "estabilizar" alto).
- Indicador de bateria fraca visível no visor.
- Reprodutibilidade ruim entre pesagens próximas.
- Objeto de referência lendo errado no baseline e certo no final.

**Mitigações:**

- UX da pesagem: exigir duas leituras consecutivas estáveis (sobe, desce, sobe de novo) no mesmo vídeo, com tolerância apertada; instabilidade reprova a captura.
- App detecta indicador de bateria fraca no visor (computer vision) e bloqueia a submissão.
- Objeto de referência de massa conhecida valida a precisão do instrumento naquele momento.
- Cross-check com wearable/balança smart elimina a deniabilidade.
- Plausibilidade fisiológica: baseline inflado + perda implausível dispara revisão independentemente da justificativa.

### Pré-carga térmica das células de carga

**Como funciona:** Células de carga (strain gauges) têm drift térmico: aquecer ou resfriar a balança desloca o zero em alguns kg. O fraudador aquece a balança antes do baseline (zero deslocado para cima) e a usa em temperatura normal/baixa no final, fabricando diferença com deniabilidade ("estava perto do aquecedor / no sol").

**Como é executado:** O fraudador aquece a plataforma/células (secador de cabelo, sol, ambiente quente) antes do baseline para deslocar o zero, sobe e grava; deixa esfriar (ou resfria) e grava o final. O drift é real, sutil (1–4 kg em balanças baratas), e fácil de negar como acidente.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** baixa · **Impacto:** médio

**Sinais de detecção:**

- Balança não marcando 0,0 exato quando vazia (zero deslocado) no início do baseline.
- Diferença sistemática que some quando a balança é re-zerada.
- Geolocalização/metadata sugerindo ambiente quente; horário de pico de calor.
- Objeto de referência lendo deslocado de forma uniforme (offset, não ganho).

**Mitigações:**

- Exigir captura do visor marcando 0,0 com a balança vazia imediatamente antes de subir, no mesmo vídeo contínuo (o token sobre o visor zerado). Pré-carga térmica deslocaria esse zero, denunciando.
- Exigir re-zeragem (tare) on-camera antes da pesagem, anulando o offset térmico.
- Objeto de referência de massa conhecida detecta offset uniforme.
- Cross-check com balança smart (compensação térmica) / wearable.
- Plausibilidade fisiológica como rede final.

### Cunha/calço sob uma célula de carga

**Como funciona:** Balanças de 4 células somam as forças dos 4 pés. Colocar uma moeda, fita, cunha ou calço sob um dos pés desbalanceia a soma, deslocando a leitura de forma estável e oculta, fora de quadro. O efeito é consistente (não ruidoso), o que o torna mais convincente que defeitos aleatórios.

**Como é executado:** O fraudador coloca um calço sob um pé para inflar (ou, com calço diferente, reduzir) a leitura, mantém o calço fora do enquadramento do vídeo, e grava normalmente. Baseline com calço "pesado", final sem calço ou com calço "leve". Token, gesto e liveness intactos.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Balança visivelmente desnivelada/inclinada no vídeo.
- Plano da plataforma não paralelo ao piso; sombra/folga sob um dos pés.
- Leitura que não fecha em 0,0 com a balança vazia, ou que muda ao reposicionar.
- Objeto de referência lendo errado de forma estável (offset/ganho).

**Mitigações:**

- Exigir enquadramento que mostre os 4 pés/base da balança apoiados no piso (gesto: filmar a balança por baixo/lateral antes de subir) — calço aparece.
- Exigir 0,0 com balança vazia on-camera; calço normalmente impede zero limpo ou aparece no objeto de referência.
- Computer vision (Fase 2): detectar inclinação da plataforma, folga sob os pés, balança não nivelada.
- Objeto de referência de massa conhecida no mesmo vídeo.
- Cross-check com balança smart/wearable e plausibilidade fisiológica.
- Revisão humana para payouts altos com checklist de nivelamento.

### Ímã / interferência em balança de mola

**Como funciona:** Em balanças mecânicas de mola ou de relutância variável, um ímã forte aproximado por baixo altera a deflexão/o sinal e, portanto, a leitura. O efeito é deniável como "defeito da balança". Afeta principalmente instrumentos analógicos e alguns digitais baratos sem blindagem.

**Como é executado:** O fraudador posiciona um ímã de neodímio sob a balança (escondido sob tapete/piso) durante o baseline para enviesar a leitura, e o remove no final. O vídeo é contínuo; o ímã fica fora de quadro. Funciona melhor com balanças de mola.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** baixa · **Impacto:** médio

**Sinais de detecção:**

- Uso de balança de mola/mecânica (já bloqueada por política).
- Leitura que não zera ou que muda quando a balança é movida de posição.
- Comportamento não-reprodutível entre pesagens próximas.
- Objeto de referência inconsistente.

**Mitigações:**

- Política: rejeitar balança de mola/mecânica (mesma mitigação do vetor analógico).
- Exigir balanças digitais com células de carga de qualidade homologadas; preferir Fase 3 com balança smart blindada.
- Objeto de referência de massa conhecida e re-zeragem on-camera.
- Exigir mover/reposicionar a balança no vídeo (parte do gesto) antes da pesagem — ímã escondido fica para trás ou a leitura muda.
- Cross-check com wearable e plausibilidade fisiológica.

### Exploração de hold/pico de carga

**Como funciona:** Muitas balanças têm função "hold" ou capturam o pico de carga. Pisar com impacto registra um pico de força inflado (baseline alto); subir muito devagar ou em apoio parcial trava uma leitura mais baixa antes de estabilizar (final baixo). Explora a dinâmica de medição, não a calibração.

**Como é executado:** No baseline, o fraudador sobe com impacto/pisão para cravar um pico alto na função hold. No final, sobe lentamente, distribuindo peso aos poucos ou apoiando parte do corpo em uma parede/móvel fora de quadro, congelando uma leitura baixa antes da estabilização. O vídeo contínuo esconde o apoio externo fora de quadro.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Subida brusca/com impacto no baseline; subida anormalmente lenta no final.
- Corpo encostando ou estabilizando-se em parede/móvel/superfície fora de quadro (mão fora de enquadramento, postura assimétrica).
- Leitura "hold" sem oscilação de estabilização.
- Postura instável ou apoio parcial visível.

**Mitigações:**

- UX da pesagem: exigir subida controlada e permanência parado por N segundos com leitura estável (sem hold/pico); reprovar capturas com leitura não-estabilizada.
- Enquadramento de corpo inteiro com mãos visíveis e sem contato com paredes/móveis durante a pesagem (parte do protocolo de gesto/postura); braços ao lado do corpo.
- Pedir gesto (ex.: levantar a mão) enquanto na balança, exigindo equilíbrio sem apoio externo e confirmando peso total sobre o instrumento.
- Computer vision (Fase 2): detectar apoio externo, postura assimétrica, e leitura sem curva de estabilização.
- Desabilitar/ignorar função hold quando possível (Fase 3, balança homologada).
- Cross-check com wearable e plausibilidade fisiológica.

### Superfície inclinada / carpete entre pesagens

**Como funciona:** Balanças exigem piso rígido e nivelado. Sobre tapete grosso, carpete ou piso inclinado, o peso se distribui mal entre as células, produzindo leitura enviesada. Trocar de superfície entre baseline e final fabrica diferença "natural" e altamente deniável.

**Como é executado:** O fraudador coloca a balança sobre carpete/tapete grosso ou piso levemente inclinado no baseline (leitura inflada por flexão/distribuição) e sobre piso rígido nivelado no final (leitura correta/baixa), ou vice-versa. Os vídeos parecem normais; só a superfície mudou.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Superfície sob a balança diferente entre baseline e final (carpete vs piso) no vídeo.
- Balança afundando/inclinando no tapete; pés não apoiados em superfície rígida.
- Ambiente/cômodo diferente entre pesagens (geolocalização, cenário).
- Objeto de referência lendo diferente entre as superfícies.

**Mitigações:**

- UX/política: instruir e exigir piso rígido e nivelado; computer vision detecta carpete/tapete/inclinação sob a balança e bloqueia.
- Exigir mesma superfície/cômodo em toda a jornada (consistência de cenário e geolocalização); mudança dispara revisão.
- Objeto de referência de massa conhecida na mesma superfície valida a leitura.
- Exigir captura dos pés da balança apoiados em superfície rígida (parte do protocolo).
- Cross-check com wearable e plausibilidade fisiológica.

### Sopro de ar / ventilador vertical

**Como funciona:** Um fluxo de ar potente direcionado verticalmente contra o corpo gera empuxo aerodinâmico ascendente que reduz marginalmente a leitura (frações a ~1 kg). Sozinho é pouco, mas combinável com outros vetores para empurrar a leitura final para baixo de forma deniável ("estava ventando / o ventilador estava ligado").

**Como é executado:** No vídeo final, o fraudador direciona um ventilador potente/soprador de baixo para cima contra o corpo enquanto na balança, reduzindo a leitura. O efeito é pequeno mas suficiente para fechar uma meta no limite. Fora de quadro, o ventilador não aparece; o vídeo é contínuo.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** baixa · **Impacto:** baixo

**Sinais de detecção:**

- Roupas/cabelo em movimento incompatível com ambiente parado; som de ventilador/soprador no áudio.
- Leitura final oscilando para baixo de forma instável.
- Cômodo/posição que esconde fonte de ar abaixo do corpo.
- Diferença marginal exatamente no limiar da meta (otimização suspeita).

**Mitigações:**

- Exigir leitura final estável por N segundos sem oscilação descendente; instabilidade reprova a captura.
- Análise de áudio/vídeo (Fase 2): detectar som de ventilador e movimento de cabelo/roupa indicando fluxo de ar forte.
- Atenção reforçada da engine a metas fechadas "no fio" (margem mínima) — revisão humana para perdas que batem exatamente no limiar.
- Objeto de referência de massa conhecida e cross-check com wearable/balança smart eliminam ganho marginal isolado.
- Plausibilidade fisiológica e consistência do conjunto de check-ins.

### Manipulação coordenada das TRÊS pesagens para fabricar curva de perda plausível

**Como funciona:** A engine valida EVOLUÇÃO COERENTE entre baseline, intermediária e final — uma perda gradual e fisiológica passa, um salto abrupto dá flag. O atacante explora isso não em uma pesagem, mas orquestrando as três como um conjunto: ajusta a pesagem intermediária para criar uma trajetória suave entre um baseline inflado e um final reduzido, derrotando justamente o detector de coerência temporal. A intermediária, frequentemente vista como menos crítica, vira a peça que 'legitima' a curva inteira.

**Como é executado:** Baseline inflado (lastro/super-hidratação) + intermediária com lastro parcial calibrado para ficar no meio do caminho + final genuíno ou levemente desidratado, produzindo três pontos que desenham uma reta plausível; uso de balança levemente descalibrada de forma CONSISTENTE nas três (offset fixo passa despercebido porque a engine olha variação, não valor absoluto); planejamento da intermediária no dia de maior/menor swing diurnal conforme convém à curva; combina com 'goal-gaming' já listado, mas o foco aqui é a fabricação ativa do ponto intermediário para enganar o detector de evolução.

**Probabilidade:** média | **Impacto:** médio | **Sofisticação:** média

**Sinais de detecção:**

- Linearidade suspeita demais da perda (perda real é ruidosa; reta perfeita é não-natural)
- Offset absoluto coerente sugerindo balança descalibrada usada de propósito (cruzar com peso esperado por body estimation)
- Variância intra-sessão de leitura incompatível entre as três pesagens (mesma balança deveria ter ruído parecido)
- Body composition do vídeo não acompanha a perda numérica reportada na intermediária
- Intervalo entre pesagens escolhido para maximizar swing favorável

**Mitigações:**

- Validar não só a tendência mas a TEXTURA da curva (ruído fisiológico esperado); penalizar linearidade perfeita
- Ancorar pelo menos uma pesagem em balança/contexto controlado quando possível (Fase 3: balança smart pareada, peso absoluto cruzado com wearable)
- Cruzar peso numérico de cada ponto com body estimation visual do mesmo vídeo — incoerência na intermediária vira flag
- Pesagens em datas/horários sorteados pelo app (reduz escolha estratégica do swing), com janela aleatória
- Tratar a intermediária com o mesmo rigor de verificação da final (token, gesto, liveness), nunca como etapa 'leve'
- Análise de consistência de assinatura da balança (ruído, tempo de estabilização) entre as três capturas

_(identificado na revisão de completude)_

---

## 2. Truques corporais e de peso aparente no momento da pesagem

_16 vetores nesta categoria._

### Lastro oculto no corpo/roupa no baseline

**Como funciona:** O fraudador adiciona massa não-corporal (peso "morto") ao corpo durante a pesagem inicial para inflar artificialmente o baseline. Como o payout é função da diferença entre peso inicial e final, cada kg de lastro adicionado no baseline e removido no final vira "perda" pura, sem qualquer esforço fisiológico. A balança lê um número real e o OCR captura corretamente — o problema é que o número não corresponde ao corpo do usuário. Colete de peso, tornozeleiras de musculação, placas de ferro, bolsas de areia/chumbo, moedas, cinto de mergulho ou pesos costurados em roupa larga ficam invisíveis sob casacos, moletons ou camisas folgadas.

**Como é executado:** O usuário veste roupa larga/em camadas no dia do baseline, distribui o lastro junto ao tronco e tornozelos (locais que não alteram visivelmente a silhueta sob tecido grosso), grava o vídeo contínuo mostrando rosto, balança zerada e visor — tudo legítimo exceto a massa extra. Cumpre o token e o gesto normalmente. No vídeo final, pesa-se sem o lastro. A diferença de 5-15kg aparenta evolução heroica. Variação sofisticada: distribuir o lastro de forma simétrica e justa ao corpo para não gerar oscilação anômala da marcha ou postura.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Roupa desproporcionalmente pesada/volumosa no baseline vs. roupa leve no final (assimetria de vestuário entre check-ins).
- Marcha rígida, passos curtos, postura "pesada", balanço de braços reduzido ao subir na balança no baseline.
- Silhueta corporal (body estimation) incompatível com o peso declarado: corpo "magro demais" para o número alto do baseline.
- Volumes localizados anômalos no tronco/tornozelos, contornos retos/angulosos sob a roupa (placas), tilintar metálico no áudio.
- Velocidade de estabilização do visor diferente entre baseline e final (massa rígida acopla diferente de gordura).
- Densidade aparente inconsistente: IMC implausível para a aparência facial/óssea.

**Mitigações:**

- **Protocolo de vestuário padronizado:** exigir roupa justa/mínima padronizada (regata + short, descalço) em TODAS as pesagens, declarada na UX antes de gravar; rejeitar vídeos com casaco/camadas.
- **Body estimation (Fase 2)** cruzando silhueta com peso lido pelo OCR: discrepância corpo-vs-número > limiar gera flag e revisão humana obrigatória.
- **Engine comportamental:** marcar baseline cujo IMC/aparência diverge do peso declarado e priorizar baselines altos para escrutínio (o ataque depende de inflar o baseline, que é o momento de menor incentivo do usuário a ser honesto).
- **Gesto de liveness anti-lastro:** incluir no token gestos como "levante o casaco/mostre a cintura", "levante as duas pernas/mostre os tornozelos", "balance os braços" — dificulta esconder placas e tornozeleiras.
- **Balança smart/BLE (Fase 3)** com leitura de bioimpedância: lastro metálico/areia altera a impedância de forma incoerente com tecido humano — sinal forte de objeto estranho.
- **Revisão humana** para todo baseline > X kg ou com payout potencial alto, com checklist específico de "vestuário e volumes".

### Roupa/calçado pesado no baseline vs. seminu no final

**Como funciona:** Variação "soft" e altamente plausível do lastro: em vez de objetos suspeitos, o fraudador usa a própria roupa e calçado como peso. Jeans (ainda mais se umedecido), casaco/jaqueta, bota/coturno, cinto e bolsos cheios (chaves, carteira, celular reserva, moedas) somam facilmente 2-4kg. No final, roupa mínima e descalço. É difícil de acusar porque "estar vestido" é socialmente normal e não há objeto ilícito — apenas uma assimetria de vestuário entre os dois momentos.

**Como é executado:** Baseline gravado com calça jeans, casaco, bota, cinto, bolsos cheios — eventualmente jeans levemente molhado para adicionar 0,5-1kg sem parecer encharcado. Final gravado de regata, short e descalço. O usuário nem precisa mentir sobre nada; só explora a falta de padronização. Frequentemente combinado com pesagem matinal e bexiga vazia no final para empilhar ganhos.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Calçado/bota no baseline vs. pés descalços no final (detectável por CV nos frames dos pés na plataforma).
- Casaco/calça pesada no baseline vs. roupa leve no final.
- Áudio/visual de bolsos cheios, tilintar de chaves/moedas, volume nos bolsos.
- Diferença de peso "instantânea" entre baseline e check-in intermediário incompatível com janela de tempo (perda rápida demais nos primeiros dias = roupa, não corpo).
- Tonalidade/saturação do jeans sugerindo umidade.

**Mitigações:**

- **Padronização de vestuário obrigatória e enforced por CV:** detectar calçado, casaco e camadas; bloquear submissão ou forçar regravação com aviso "remova calçado, casaco e esvazie os bolsos".
- **Gesto de liveness:** "mostre os pés descalços na plataforma", "vire os bolsos" — torna o vídeo autocomprovante da ausência de peso de roupa/bolso.
- **Detecção de calçado por OCR/CV nos frames dos pés** como gate automático: pés calçados no baseline = pesagem inválida.
- **Engine comportamental** sinaliza assimetria de vestuário entre check-ins (modelo simples de classificação de roupa por frame).
- **Curva de perda fisiológica:** queda de 2-4kg entre baseline e 1º check-in (poucos dias) cai em faixa implausível por composição corporal e é flagada — isso captura o efeito-roupa porque ele aparece como degrau instantâneo.
- **UX:** mostrar ao usuário o peso do check-in anterior e exigir mesma condição de vestuário declarada (checkbox "estou descalço e com roupa leve").

### Apoio oculto em parede/móvel fora de quadro

**Como funciona:** O usuário descarrega parte do peso corporal sobre uma superfície fixa (parede, batente, móvel, bancada) tocando-a com mão, antebraço, quadril ou ombro fora do enquadramento da câmera. A balança lê menos do que o peso real porque parte da força normal é transferida para a estrutura. Não há objeto suspeito no corpo nem na cena visível — apenas um ponto de contato fora de quadro. Especialmente eficaz no FINAL, para reduzir a leitura e fingir mais perda.

**Como é executado:** Posiciona a balança encostada numa parede ou ao lado de um móvel; enquadra a câmera mostrando rosto, visor e corpo mas cortando os limites laterais/posteriores. Ao subir, encosta discretamente o ombro/quadril na parede ou apoia o antebraço numa superfície fora de quadro, transferindo 3-8kg. Mantém aparência de equilíbrio natural. O token e o gesto são cumpridos com a outra mão. Variação: tocar a parede "só para equilibrar ao subir" e manter o contato durante a leitura.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Enquadramento que corta deliberadamente paredes/laterais/o entorno da balança; câmera "apertada" demais no corpo.
- Inclinação corporal persistente para um lado (centro de massa deslocado para fora da vertical da balança).
- Ombro/quadril/braço saindo de quadro ou "encostando" em algo invisível.
- Visor estabiliza num valor mais baixo do que a faixa de oscilação inicial assim que o corpo se inclina.
- Tensão muscular assimétrica, braço esticado para fora do quadro.
- Sombra/iluminação revelando superfície próxima fora de quadro.

**Mitigações:**

- **Requisito de enquadramento "ambiente completo":** o token/UX exige um giro panorâmico de 360° mostrando que a balança está em área aberta, longe de paredes/móveis, ANTES de subir — vídeo contínuo registra o entorno.
- **Gesto de liveness anti-apoio:** "estenda os dois braços para os lados", "levante as duas mãos acima da cabeça", "mantenha as mãos na cabeça durante a leitura" — impossibilita apoiar mão/antebraço.
- **Detecção de pose (Fase 2):** estimar centro de massa e ângulo do tronco; inclinação sustentada + braço fora de quadro = flag. Detectar contato corporal com bordas do frame.
- **Regra de enquadramento mínimo:** corpo inteiro com margem lateral visível; vídeos com corpo cortado nas bordas são rejeitados automaticamente.
- **Balança smart (Fase 3)** com sensor de distribuição/4 células de carga: descarga assimétrica ou centro de pressão fora do centro geométrico = sinal de apoio externo.
- **Revisão humana** com instrução explícita de checar o entorno e o ângulo do tronco em payouts altos.

### Mão pressionada em bancada/pia/corrimão

**Como funciona:** Caso particular e muito eficaz do apoio externo: a balança é posicionada junto a uma bancada, pia, corrimão ou móvel na altura conveniente, e o usuário pressiona a mão/antebraço PARA BAIXO sobre essa superfície. Diferente de só "encostar", aqui há aplicação ativa de força descendente no apoio, o que pela 3ª lei de Newton gera reação para cima no corpo e descarrega vários kg da balança. Disfarçado como "me equilibrando".

**Como é executado:** Coloca a balança ao lado da pia da cozinha ou banheiro, ou junto a um corrimão. Sobe e apoia a mão na borda da bancada "para se firmar", então empurra sutilmente para baixo, controlando a força observando o visor até estabilizar no peso desejado. A outra mão segura/mostra o token. Por ser um gesto natural de equilíbrio, passa despercebido em revisão superficial. Pode descarregar 5-10kg com pressão moderada.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Mão/antebraço apoiado em superfície horizontal próxima durante toda a leitura (não só ao subir).
- Antebraço/punho com tensão e ângulo de empurrão; ombro abaixado do lado do apoio.
- Visor estabiliza num valor abaixo da oscilação inicial exatamente quando a mão pressiona.
- Balança posicionada deliberadamente colada a uma bancada/pia/corrimão.
- Movimento de "ajuste fino": pequenas variações no visor sincronizadas com a pressão da mão.

**Mitigações:**

- **Mãos visíveis e livres durante a leitura:** o token/gesto exige as duas mãos longe de qualquer superfície (ex.: "mãos na cabeça", "braços cruzados no peito", "segure o celular com as duas mãos mostrando o visor") no momento da estabilização do peso.
- **Panorâmica obrigatória** mostrando que a balança não está adjacente a bancada/corrimão/pia.
- **Detecção de pose** que penaliza qualquer contato de mão/antebraço com superfície fora do corpo durante a janela de leitura do OCR.
- **OCR temporal:** capturar a curva de estabilização do peso (não só o frame final); quedas abruptas não-fisiológicas no momento de apoio da mão = flag.
- **Balança smart com 4 células de carga (Fase 3):** centro de pressão deslocado para fora do polígono dos pés indica força externa atuando no corpo.
- **Revisão humana** treinada para o padrão "mão na bancada" como red flag clássico.

### Pé/calcanhar parcialmente fora da plataforma

**Como funciona:** Parte do pé (calcanhar ou borda) fica fora da plataforma da balança, apoiada no chão, num degrau ou na borda elevada, descarregando parte do peso para uma superfície que a balança não mede. A leitura cai porque nem todo o peso corporal está sobre as células de carga. Como o vídeo costuma focar rosto+visor e raramente mostra os pés com clareza, o truque é difícil de flagrar visualmente.

**Como é executado:** Posiciona a balança encostada num degrau, soleira, tapete grosso ou desnível. Sobe deixando o calcanhar (ou a parte posterior dos pés) repousando fora da plataforma, no chão/degrau. Mantém os dedos/antepé na balança para parecer "em cima". Enquadra a câmera de modo que os pés não apareçam ou apareçam de ângulo que esconde o calcanhar fora. Ajusta quanto pé deixa fora observando o visor.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Vídeo nunca mostra os dois pés inteiros e claramente sobre a plataforma.
- Balança posicionada junto a degrau/desnível/tapete; entorno dos pés não enquadrado.
- Postura na ponta dos pés ou peso jogado no antepé.
- Visor mais baixo que a faixa de oscilação ao subir.
- Pés cortados pela borda do frame.

**Mitigações:**

- **Gate obrigatório "mostre os dois pés inteiros na plataforma":** o token exige um close dos pés sobre a balança no início da pesagem; CV valida que ambos os pés estão integralmente sobre a plataforma e que não há degrau/desnível ao redor.
- **Panorâmica do piso** ao redor da balança (superfície plana, sem degrau, sem tapete grosso).
- **Detecção CV de pés/plataforma (Fase 2):** segmentação dos pés e da balança; calcanhar fora ou pé na borda = flag.
- **Balança smart (Fase 3):** distribuição de carga nos 4 cantos detecta peso concentrado no antepé/borda (centro de pressão muito frontal).
- **OCR temporal + plausibilidade:** estabilização num valor incomumente baixo + ausência de visão dos pés = revisão humana.
- **UX de pesagem:** instruir "pés inteiros, centrados, descalços, em piso plano" com exemplo visual; câmera em ângulo que capte pés e visor na mesma tomada quando possível (tripé baixo).

### Apoio no próprio dispositivo que filma

**Como funciona:** Em setups handheld ou com tripé, o usuário se escora no próprio celular ou no tripé que está filmando, descarregando peso pelo braço sem introduzir qualquer terceiro objeto na cena. Como o dispositivo de captura é "legítimo" e está sempre em quadro de forma indireta, o apoio passa como simples manuseio do celular. Transfere alguns kg do corpo para o tripé/parede via o aparelho.

**Como é executado:** Com tripé fixo, o usuário apoia a mão/antebraço sobre o tripé ou sobre uma mesa onde o tripé está, transferindo peso. Em handheld, segura o celular contra uma superfície fixa e usa o braço esticado como ponto de apoio, empurrando. O movimento parece "segurar/ajustar a câmera". O token é mostrado normalmente. A leitura do visor cai conforme o braço descarrega.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Tremor/estabilidade do vídeo incompatível com handheld puro (câmera apoiada/empurrada).
- Braço esticado e tenso em direção ao dispositivo/tripé durante a leitura.
- Microvibrações na imagem sincronizadas com variações do visor.
- Ângulo de câmera fixo mas com sinais de força sendo aplicada na haste.
- Acelerômetro/giroscópio do dispositivo (metadata) indicando força/encosto durante a leitura.

**Mitigações:**

- **Telemetria de sensores do device:** capturar acelerômetro/giroscópio durante a gravação; padrão de "empurrão/apoio" no aparelho (força sustentada, não tremor natural de mão) = flag. Charya já planeja usar metadata do arquivo — estender para IMU em tempo real.
- **Gesto de liveness com mãos livres:** exigir que, no momento da leitura, ambas as mãos estejam visíveis e longe do dispositivo/tripé (ex.: tripé obrigatório + mãos na cabeça).
- **Política de setup:** recomendar tripé fixo distante e mãos livres; vídeos com a mão claramente no dispositivo durante a leitura são revisados.
- **Detecção de pose** que identifica braço apoiado no tripé/superfície.
- **Balança smart (Fase 3):** centro de pressão deslocado = força externa, independente de onde vem o apoio.
- **OCR temporal:** queda do valor coincidente com aproximação do braço ao dispositivo.

### Corrimão/barra na altura do quadril para sustentar peso

**Como funciona:** Uma barra, corrimão ou móvel na altura do quadril/coxa é usado para sustentar parte do peso de forma "natural", como se fosse segurança ao subir. Diferente do apoio de mão, aqui o usuário literalmente "senta" levemente ou apoia o quadril/coxa na barra, descarregando uma fração significativa do peso. Por parecer um gesto de cautela de pessoa com sobrepeso, ganha plausibilidade social e é difícil de acusar.

**Como é executado:** Posiciona a balança junto a um corrimão de escada, barra de banheiro adaptado, encosto de cadeira ou bancada na altura certa. Sobe e apoia o quadril/coxa/glúteo na barra, transferindo 5-15kg dependendo de quanto "senta". Justificativa pronta: "preciso me segurar para não cair". Cumpre token/gesto com as mãos livres. Ajusta o quanto descarrega observando o visor.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Barra/corrimão/móvel na altura do quadril visível ou inferido no entorno.
- Quadril/coxa em contato com superfície durante a leitura; postura semi-sentada.
- Joelhos levemente flexionados com peso jogado para trás.
- Visor estabiliza num valor desproporcionalmente baixo para a estatura/silhueta.
- Entorno enquadrado de forma a esconder a região do quadril/laterais.

**Mitigações:**

- **Panorâmica obrigatória do entorno** comprovando ausência de barra/corrimão/móvel na altura do quadril junto à balança.
- **Detecção de pose (Fase 2):** ângulo de quadril/joelho indicando postura semi-sentada + contato lateral = flag automática.
- **Gesto de liveness dinâmico:** "dê um pequeno giro de 90°", "fique reto com os braços na cabeça" — sustentar peso numa barra fica incompatível com o gesto.
- **Balança smart com células de carga (Fase 3):** parte do peso indo para fora do polígono dos pés = centro de pressão e magnitude incoerentes.
- **Plausibilidade fisiológica/antropométrica:** peso muito baixo para silhueta/altura estimada = revisão humana.
- **UX:** desencorajar pesagem perto de móveis/escadas; instrução "balança em piso plano, longe de móveis e corrimãos".

### Pés fora do centro / só dois sensores

**Como funciona:** Balanças domésticas de vidro têm 4 células de carga, uma em cada canto. Posicionar os pés na borda extrema ou sobre apenas dois sensores (em vez do centro) distorce a leitura, frequentemente PARA MENOS, porque a soma das células fica desbalanceada ou parte do peso recai fora da região calibrada. O fraudador explora a física do equipamento de forma "desajeitada" mas calculada, sem objeto nem apoio externo.

**Como é executado:** Conhecendo (por tentativa e erro com o visor) que sua balança lê menos quando os pés ficam num canto/borda específica, o usuário posiciona os pés ali no final para reduzir a leitura. No baseline, posiciona-se centralizado (leitura correta/alta). A diferença vira "perda". É reproduzível e barato, depende só de conhecer o "ponto baixo" do próprio equipamento.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Pés posicionados na borda/canto em vez do centro da plataforma.
- Postura instável, pés muito juntos ou muito afastados nas bordas.
- Mesma balança lendo valores inconsistentes entre check-ins para evolução implausível.
- Oscilação anômala do visor (leitura instável típica de carga descentralizada).

**Mitigações:**

- **Posicionamento padronizado dos pés:** UX e CV exigem pés centrados, paralelos, dentro de uma região central; close obrigatório dos pés na plataforma valida posição.
- **Balança própria da Charya / balança smart homologada (Fase 3):** controlar o equipamento elimina a exploração de geometria de balança barata; balanças calibradas com leitura consistente independente do posicionamento.
- **Cross-check com balança secundária / bioimpedância:** valor único da balança de vidro tem peso menor no score; preferir equipamentos com leitura robusta.
- **OCR temporal:** detectar leitura instável/oscilante (sintoma de carga descentralizada) e exigir re-pesagem centrada.
- **Plausibilidade entre check-ins:** mesma balança, mesmo usuário, com saltos incoerentes = flag.
- **Revisão humana** verifica posicionamento dos pés em payouts altos.

### Postura, contração e respiração para reduzir leitura

**Como funciona:** Manipulação da dinâmica de força sobre a balança sem apoio externo: subir na ponta dos pés e descer lentamente, micro-saltos amortecidos, inclinar o corpo ou controlar a respiração permite "congelar" o visor num ponto baixo da faixa de oscilação. Balanças digitais fazem média/travam num valor; o fraudador explora o momento de menor força (durante uma descida controlada do centro de massa) para que o visor trave abaixo do peso real.

**Como é executado:** O usuário sobe e, em vez de ficar parado, executa um movimento descendente sutil e controlado (flexão leve de joelhos, descida do centro de massa, ou alívio momentâneo na ponta dos pés) no instante em que a balança "trava" a leitura. Repete até o visor estabilizar num número favorável. Ganho típico de 1-3kg aparente. Combina com leitura do menor valor da oscilação natural do visor.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Movimento corporal (subida/descida, balanço, ponta dos pés) durante a janela de estabilização.
- Visor com oscilação grande antes de travar; valor final no extremo baixo da faixa.
- Flexão de joelhos, alteração de altura do corpo, ou respiração exagerada sincronizada com a leitura.
- Tempo até estabilização anormalmente curto (leitura "pega" um vale).

**Mitigações:**

- **OCR temporal robusto:** capturar a série temporal completa do visor e exigir estabilização por N segundos consecutivos (ex.: 3-5s estável) antes de aceitar; usar a MEDIANA/valor estável, não o frame mais baixo. Rejeitar leituras voláteis.
- **Liveness de imobilidade:** instruir "fique completamente parado, pés retos, em pé, olhando para frente" durante a contagem regressiva da leitura; detecção de pose penaliza movimento na janela de captura.
- **Detecção de variação de altura/centro de massa** por CV durante a leitura = flag.
- **Balança smart (Fase 3)** que reporta o peso estabilizado internamente (não dependente do frame que o usuário escolhe mostrar).
- **Múltiplas leituras:** exigir 2 subidas e usar consistência; valores divergentes entre subidas = re-pesagem.
- **Plausibilidade:** ganho de 1-3kg isolado é pequeno, mas a engine deve somar este vetor com outros (efeito cumulativo) e flagar o padrão.

### Desidratação aguda (sauna/diurético) pré-final

**Como funciona:** Cutting estilo lutador de MMA/boxe: nas 24-48h antes da pesagem final, o usuário induz desidratação aguda (sauna, roupa térmica, restrição de água e sódio, exercício em calor) para perder 3-7kg de água corporal temporária. O peso lido é REAL e o corpo é o do usuário — mas a perda é hídrica, não de gordura, e é revertida em horas com reidratação. É o ataque mais perigoso porque não há apoio, objeto nem manipulação de equipamento: o número é honesto, a fisiologia é que é enganosa.

**Como é executado:** Dias finais com depleção controlada de água/sódio; sauna ou banho quente + agasalho para suar; possível diurético. Pesa-se desidratado, idealmente de manhã, em jejum, bexiga/intestino vazios. Atinge a meta "no peso da água". Após o payout/pesagem, reidrata e recupera os kg em 1-3 dias. Replica protocolos amplamente documentados de modalidades com categorias de peso.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Taxa de perda final implausível: queda acentuada concentrada nos últimos dias (curva de perda com "degrau" no final).
- Sinais visuais de desidratação: pele/lábios secos, olhos fundos, vascularização aparente, rosto "chupado".
- Rebote pós-pesagem: se houver check-in de confirmação dias depois, o peso volta a subir bruscamente.
- Wearable/balança de bioimpedância: queda de % de água corporal sem queda proporcional de massa gorda.
- Frequência cardíaca de repouso elevada / variabilidade alterada (wearable) compatível com desidratação.

**Mitigações:**

- **Plausibilidade fisiológica da TAXA (núcleo da engine):** limitar perda fisiologicamente sustentável (ex.: ~0,5-1% do peso/semana de gordura real); quedas finais que excedem o limite biológico = flag automática e payout retido.
- **Janela de estabilização pós-meta:** exigir que o peso final seja CONFIRMADO/mantido por uma pesagem adicional 3-7 dias depois (anti-rebote). Pagar só após confirmação de peso sustentado elimina o cutting de água.
- **Bioimpedância via balança smart (Fase 3):** exigir % de água corporal e massa magra; desidratação aparece como queda de água, não de gordura — invalida a "perda".
- **Wearables (Fase 3):** integrar Garmin/Apple Health/Health Connect para FC de repouso, hidratação proxy, atividade; anomalias compatíveis com cutting = flag.
- **Check-ins frequentes** (não só 3 pontos) para reconstruir a curva e detectar o degrau final; desincentiva concentrar perda no fim.
- **Política/contrato:** definir que a meta é perda de peso SUSTENTADA (com confirmação posterior), comunicada na contratação; isso muda o jogo do incentivo.
- **Revisão humana** obrigatória para qualquer perda concentrada nos últimos dias antes do payout.

### Carb/water/sodium depletion (peak week)

**Como funciona:** Versão "fina" e mais plausível da desidratação: depleção controlada de glicogênio, sódio e água nas horas/dias finais, como na peak week de fisiculturismo. Cada grama de glicogênio retém ~3g de água; depletar carboidrato + manipular sódio e água gera 2-5kg de queda que parece gradual e fisiologicamente coerente, sem os sinais grosseiros da desidratação aguda por sauna. Mais difícil de detectar porque imita uma perda "saudável".

**Como é executado:** Última semana com redução progressiva de carboidrato (depleção de glicogênio muscular e hepático), manipulação de sódio (carga e depois corte) e ajuste de água. O corpo "esvazia" de água ligada ao glicogênio de forma suave. Pesa-se no fundo da depleção. Repõe carbo/sódio/água depois e recupera 2-5kg. Por ser gradual, foge de limiares de "queda abrupta".

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Bioimpedância: queda de água corporal e massa magra (glicogênio + água), gordura ~estável.
- Aparência "flat"/murcha dos músculos, perda de volume sem perda de definição de gordura subcutânea.
- Rebote pós-pesagem (recuperação de 2-5kg em dias).
- Wearable: queda de performance/energia, sono e FC alterados na peak week.
- Curva de perda com aceleração suave mas atípica no trecho final.

**Mitigações:**

- **Confirmação de peso sustentado (anti-rebote):** mesma mitigação central — pagar só após re-pesagem dias depois neutraliza qualquer manipulação de glicogênio/água, pois o peso volta.
- **Bioimpedância obrigatória (Fase 3):** decompor a perda em gordura vs. água/magra; "perda" que não vem majoritariamente de massa gorda não conta integralmente para a meta.
- **Score metabólico (Fase 3)** combinando peso, bioimpedância e wearables para estimar perda de gordura real.
- **Plausibilidade de composição:** engine modela que perda de gordura real é limitada; excedente atribuído a água/glicogênio é descontado.
- **Check-ins densos** para distinguir tendência real de manobra de peak week.
- **Revisão humana especializada** para perdas no limite superior do plausível com sinais de depleção.

### Diuréticos/laxantes abusivos + reposição rápida

**Como funciona:** Uso agressivo e pontual de diuréticos (inclusive de alça) e laxantes apenas no dia/véspera da pesagem para queda dramática por perda hídrica e fecal, com reposição imediata depois. Diferente do cutting controlado, é um "soco" químico de última hora: pode tirar 2-5kg em horas. Perigoso à saúde do usuário (risco real de evento adverso) e fraudulento porque a perda é 100% reversível.

**Como é executado:** Véspera/manhã da pesagem: laxante/diurético potente, restrição de água, esvaziamento de bexiga e intestino. Pesa-se no vale máximo de depleção. Atinge a meta. Reidrata e se realimenta logo após. A natureza pontual e extrema do efeito é a assinatura.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Queda extrema e isolada no último ponto (degrau agudo no dia da pesagem).
- Rebote pronunciado em qualquer pesagem subsequente.
- Bioimpedância: colapso de água corporal.
- Sinais de mal-estar/desidratação no vídeo (palidez, tremor, fala arrastada).
- Wearable: FC elevada, possíveis arritmias, atividade reduzida.

**Mitigações:**

- **Confirmação de peso sustentado (anti-rebote)** — neutraliza completamente o "soco" de última hora.
- **Limiar de queda diária fisiológica:** queda > X% em 24-48h = flag automática e bloqueio de payout até reconfirmação.
- **Bioimpedância (Fase 3):** queda de água sem queda de gordura invalida.
- **Política de saúde/segurança:** termos que vetam manipulação aguda; e do ponto de vista ético, comunicação que desencoraja práticas perigosas (a Charya deve evitar incentivar comportamento de risco — alinhar regras antifraude com proteção do usuário).
- **Check-ins frequentes** para que o último ponto não seja o único determinante.
- **Revisão humana** obrigatória para quedas agudas finais.

### Esvaziamento de bexiga/intestino + jejum matinal

**Como funciona:** Empilhamento de pequenos ganhos "naturais": urinar, evacuar (eventualmente com laxante/enema), jejum prolongado e pesagem de manhã cedo. Cada item rende pouco (0,2-1kg), mas combinados somam 0,5-2kg. Isoladamente é quase legítimo (todo mundo pesa menos de manhã em jejum), mas vira fraude quando o baseline foi feito na condição OPOSTA (cheio, pós-refeição) de propósito, criando um delta artificial.

**Como é executado:** Baseline feito à tarde/noite, pós-refeição, hidratado, bexiga/intestino cheios (peso alto). Final feito de manhã, em jejum, após urinar e evacuar (com auxílio de laxante leve/enema), desidratado da noite. O delta de condição vira "perda". Quase sempre combinado com os truques de roupa e água.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Horário do baseline (tarde/noite) vs. final (manhã cedo) sistematicamente oposto (timestamp/metadata).
- Padrão consistente de pesagens matinais só no final.
- Pequenas perdas combinadas que somam um delta suspeito vs. a curva geral.
- Cross-check com check-ins intermediários revela inconsistência de horário/condição.

**Mitigações:**

- **Padronização de condições de pesagem:** exigir mesma janela horária (ex.: sempre de manhã em jejum, OU sempre no mesmo horário) e mesma condição declarada para TODAS as pesagens — incluindo o baseline. Isso remove o delta artificial.
- **Timestamp confiável (já no stack):** usar o token com timestamp + metadata para validar horário; rejeitar baseline noturno vs. final matinal quando a política exige consistência.
- **Geolocalização + timestamp** para corroborar horário e local consistentes.
- **Plausibilidade:** engine modela variação intradiária normal (~1-2kg) e desconta/flaga quando o delta total depende dela.
- **Check-ins múltiplos no mesmo horário** estabelecem uma linha de base honesta.
- **UX:** lembrete "pese-se sempre na mesma condição que o seu baseline" e exibição do horário do baseline.

### Baseline inflado por super-hidratação e carga de sal/carbo

**Como funciona:** Espelho do cutting, aplicado ao BASELINE: o usuário infla o peso inicial bebendo litros de água e fazendo carga de sódio e carboidrato (que retém água via glicogênio) antes do baseline. Ganha 2-5kg de água/conteúdo GI temporário sem qualquer esforço, partindo de um "peso falso alto". Depois é só voltar ao normal para já ter "perdido" vários kg. Atacar o baseline é estratégico: é o momento de menor escrutínio e maior incentivo a inflar.

**Como é executado:** Nas horas antes do baseline: ingestão alta de água, refeição rica em sódio e carboidrato, possivelmente sal puro, para maximizar retenção hídrica e enchimento do trato GI. Pesa-se "inchado" no pico. Registra o baseline alto. Nos dias seguintes, normaliza a dieta e a água, e o peso cai sozinho 2-5kg — "progresso" instantâneo sem perda de gordura.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Queda rápida e grande logo APÓS o baseline (primeiro check-in), incompatível com perda de gordura — assinatura clássica de baseline inflado por água.
- Aparência "inchada" no baseline (rosto, abdômen distendido) vs. normal depois.
- Bioimpedância no baseline com % de água anormalmente alto.
- Baseline pesando muito acima do esperado para a silhueta (body estimation).
- Histórico/peso declarado no cadastro divergente do baseline.

**Mitigações:**

- **Período de estabilização do baseline:** exigir 2-3 pesagens em dias diferentes para estabelecer o baseline (média), em vez de um único ponto — anula o pico de super-hidratação.
- **Body estimation no baseline (Fase 2):** silhueta incompatível com peso alto = flag; é o mesmo controle do lastro oculto.
- **Bioimpedância (Fase 3):** % de água alto no baseline sinaliza inflação hídrica.
- **Plausibilidade da queda pós-baseline:** perda grande no primeiro intervalo (água) é descontada da meta — não conta como progresso real.
- **Cross-check com peso histórico:** wearables/balança smart pré-existentes, peso do cadastro/KYC, faixa de IMC; baseline muito acima da tendência = revisão.
- **Padronização de condição:** baseline na mesma condição (jejum/horário) exigida no final remove o delta de hidratação/GI.
- **Revisão humana** prioriza baselines altos com payout potencial elevado.

### Ilusão óptica de redução corporal (ângulo/roupa)

**Como funciona:** Ataque dirigido à camada de COMPUTER VISION / body estimation (Fase 2), não à balança. O usuário manipula a aparência do corpo no vídeo final — roupas compressivas/escuras/verticais, ângulo de cima, maior distância da câmera, lente que afina — para parecer mais magro do que está, induzindo o modelo de estimativa corporal a "confirmar" uma evolução que o número da balança (esse sim, eventualmente fraudado por outro vetor) declara. Não há artefato de mídia (não é deepfake/edição), só fotografia enganosa.

**Como é executado:** No baseline, veste roupa clara/justa, filma de baixo/frontal, perto da câmera (parece mais cheio). No final, veste preto/compressivo com listras verticais, filma de cima e mais longe, postura ereta com abdômen contraído. A silhueta aparenta redução significativa. Combinado com qualquer truque de balança, reforça a "história" de perda para a engine visual e para o revisor humano.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Mudança de ângulo de câmera, distância e altura entre baseline e final (metadata de lente/EXIF, estimativa de distância focal).
- Roupa contrastante em cor/padrão/compressão entre os dois momentos.
- Body estimation inconsistente com a perda de peso declarada (silhueta "magra demais" para o delta).
- Postura/contração abdominal acentuada no final.
- Iluminação manipulada para criar sombras afinadoras.

**Mitigações:**

- **Protocolo de captura padronizado e enforced:** mesma distância, mesma altura de câmera (tripé na altura do peito), mesmo enquadramento, roupa justa neutra padronizada em todas as pesagens — remove os graus de liberdade da ilusão.
- **Token de calibração de escala:** incluir um objeto/marcador de referência de tamanho conhecido (ou usar a própria balança de dimensão conhecida) no quadro para o CV calibrar escala e distância — desfaz o truque de lente/distância.
- **Body estimation 3D/multi-ângulo (Fase 2):** exigir gesto "vire 360°" para reconstruir o corpo de múltiplos ângulos, neutralizando ângulo único enganoso.
- **Cross-check peso (balança/bioimpedância) vs. silhueta:** a engine não confia na imagem isolada; a redução visual precisa ser coerente com o número E com a bioimpedância.
- **Detecção de ângulo/lente/EXIF** entre check-ins; mudança de setup = menor peso de evidência + flag.
- **Revisão humana** ciente de que a estimativa visual é suscetível a ângulo/roupa e a usa só como corroboração, nunca como prova isolada.

### Perda de peso real porém médica/cirúrgica não declarada (GLP-1, bariátrica, lipoaspiração)

**Como funciona:** O participante atinge a meta de forma fisicamente REAL e comprovável — passa por toda a verificação de vídeo/token/liveness honestamente — mas a perda foi obtida por meio que viola a premissa do produto e/ou cria risco de saúde e de seleção adversa: semaglutida/tirzepatida (Ozempic/Mounjaro), cirurgia bariátrica, lipoaspiração entre pesagens, balão gástrico. Isso burla a engine de PLAUSIBILIDADE FISIOLÓGICA não por fraude de imagem, mas porque a fisiologia mudou de verdade — e pode ser usado para arbitrar a aposta com risco baixíssimo (quem já vai operar aposta sabendo que ganha).

**Como é executado:** Usuário com cirurgia bariátrica já agendada faz a aposta no maior valor possível; uso de GLP-1 (acesso amplo e crescente no Brasil, inclusive manipulado) para perda rápida e quase garantida; lipoaspiração reduz massa pontualmente entre validação intermediária e final (perda localizada, não fisiológica gradual); insider de clínica vende 'pacote aposta + procedimento'. Diferente de desidratação, a perda é permanente e passa em qualquer checagem de imagem/corpo.

**Probabilidade:** alta | **Impacto:** médio | **Sofisticação:** baixa

**Sinais de detecção:**

- Curva de perda atípica para perda natural por dieta/exercício (degrau pós-cirúrgico, platô-queda-platô do GLP-1)
- Perda localizada incoerente com perda sistêmica (body composition: cintura cai sem mudança proporcional em face/membros = sugere lipo)
- Ausência de sinais de atividade compatível em wearables (perda grande sem gasto calórico correspondente — Fase 3)
- Declaração de saúde inconsistente; recusa a anexar acompanhamento
- Padrão de aposta no valor máximo logo após cadastro por perfil com IMC alto e meta agressiva

**Mitigações:**

- Termos explícitos: perda por cirurgia/medicação de emagrecimento durante a vigência invalida ou ajusta o payout; exigir declaração no onboarding (controle contratual, não técnico)
- Underwriting de meta: limitar taxa de perda elegível à faixa fisiológica saudável; perda acima da faixa exige documentação médica e revisão humana
- Health-check de produto: alinhar incentivos para não premiar perda perigosa (cap de velocidade, bônus por consistência e não por velocidade)
- Fase 3: cruzar perda com gasto energético de wearable — perda real sem déficit calórico observável vira flag
- Janela de carência entre cadastro e início da aposta para reduzir arbitragem de cirurgia já agendada
- Body composition analysis para distinguir redução sistêmica de redução localizada (lipo)

_(identificado na revisão de completude)_

---

## 3. Fraude de identidade, proxy e conluio (pesar outra pessoa)

_15 vetores nesta categoria._

### Dublê magro de aparência semelhante no final

**Como funciona:** O titular faz baseline e check-ins reais com o próprio corpo (gordo), mas na pesagem FINAL um terceiro fisicamente parecido e mais magro sobe na balança. O ataque explora a lacuna mais grave do MVP: ausência de cruzamento corpo↔corpo entre check-ins. O liveness/biometria normalmente valida ROSTO, não composição corporal. Se o sistema só confirma "é a mesma face do KYC" e "o visor marca X kg", basta que o rosto do titular apareça em algum frame enquanto o corpo magro do dublê é o que está efetivamente na balança.

**Como é executado:** O fraudador recruta um conhecido com altura e tom de pele semelhantes, porém vários quilos mais leve. No vídeo final ambos coordenam: o titular mostra o rosto, fala o token e faz o gesto no início; durante a subida na balança e leitura do visor, a câmera "perde" o rosto (enquadra de cima, contraluz, corte de continuidade disfarçado como tremor) e quem está na balança é o dublê. Roupas largas iguais e mesmo cenário do baseline reduzem suspeita. Variação: gravam em par, com o dublê fazendo o corpo inteiro e o titular só "emprestando" o rosto num relance.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Quebra de continuidade temporal entre o frame com rosto e o frame com visor (rosto e peso nunca coexistem no mesmo enquadramento contínuo).
- Mudança abrupta de proporções corporais (ombro, cintura, pescoço, mãos) entre baseline e final, incompatível com a perda de peso declarada.
- Tom de pele, pelos, tatuagens, cicatrizes, formato de joelho/pé divergentes do baseline.
- Perda de peso na fronteira do plausível fisiológico aparecendo justo quando há descontinuidade de enquadramento.
- Altura aparente (cabeça-a-pé na mesma balança/cenário) divergente entre vídeos.

**Mitigações:**

- UX da pesagem que EXIGE rosto + corpo inteiro + visor da balança no MESMO frame contínuo, com travessia obrigatória (pan único do rosto até o visor sem corte) — engine rejeita vídeos onde rosto e visor nunca coexistem.
- Fase 2: body estimation / pose+anthropometria por computer vision criando assinatura corporal (razões de proporção, comprimento de membros, biacromial/altura) e cruzando baseline↔intermediário↔final; divergência > limiar vira flag.
- Marcadores biométricos invariantes ao peso: tatuagens, cicatrizes, formato de orelha, dentição no gesto de falar, pulsos/mãos — comparação histórica entre check-ins.
- Token dinâmico com gesto que exige rosto E corpo simultâneos (ex.: "toque o pé direito olhando para a câmera" enquanto na balança), forçando coexistência de face e corpo.
- Revisão humana obrigatória para qualquer payout alto ou perda no topo da faixa plausível, com checklist de continuidade.
- Geometria do cenário: comparar altura/escala do corpo contra a balança e objetos fixos do ambiente entre baseline e final.

### Gêmeo / irmão sósia

**Como funciona:** Um gêmeo idêntico (ou irmão muito parecido) já naturalmente magro serve de corpo final. Derrota reconhecimento facial porque sistemas biométricos toleram — e às vezes confundem — semelhança genética. O score facial passa, o liveness passa (é uma pessoa real), e o corpo magro fecha a meta sem que o titular tenha emagrecido.

**Como é executado:** O titular gordo faz baseline e check-ins. Na final, o gêmeo magro grava o vídeo inteiro — mostra o token, faz o gesto, sobe na balança. Como o rosto é geneticamente quase idêntico, o matcher facial retorna similaridade alta. Variação inversa: usam o irmão GORDO para inflar o baseline e o titular (já mais magro) para a final, fabricando uma "perda" artificial.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Score facial alto porém não-idêntico (gêmeos não passam em matchers ajustados para distinguir univitelinos): micro-divergências em pintas, sobrancelha, assimetria facial.
- Marcadores invariantes (tatuagens, cicatrizes, piercings, esmalte, relógio) presentes/ausentes de forma inconsistente entre check-ins.
- Voz/biometria vocal divergente ao cantar o token (gêmeos têm timbres distinguíveis).
- Perda corporal incompatível com a curva de check-ins intermediários reais do titular.
- CPF/cadastro com parentesco detectável (mesmo sobrenome, mesmo endereço, dependentes declarados).

**Mitigações:**

- Calibrar threshold de liveness/biometria de terceiros (Unico, idwall, Onfido) em modo "anti-gêmeo": exigir similaridade muito alta E ausência de micro-divergências, escalando para humano quando o score cai na zona "parecido mas não idêntico".
- Biometria vocal no token cantado (voiceprint) como segundo fator independente do rosto, comparado entre baseline e final.
- Marcadores invariantes obrigatórios no protocolo: registrar tatuagens/cicatrizes no baseline e exigir reaparecimento no final.
- Engine comportamental cruza grafo social/cadastral: contas com mesmo endereço, sobrenome ou device compartilhado entram em revisão reforçada.
- Curva de peso obrigatória: a final precisa ser coerente com a tendência dos check-ins intermediários reais; salto fora da curva vira flag.

### Sósia/dublê profissional contratado

**Como funciona:** Versão comercial e recorrente do dublê: existe um serviço que fornece pessoas fisicamente parecidas — magras para a final, ou gordas para inflar o baseline — sob demanda. Profissionaliza a fraude e a torna repetível em várias apostas/contas.

**Como é executado:** O fraudador contrata, via grupo de Telegram/marketplace informal, alguém com biotipo-alvo e tom de pele compatível. O profissional treina o protocolo Charya (token, gesto, enquadramento), usa roupas padronizadas e o mesmo cenário, e entrega o vídeo final. O mesmo "dublê magro" pode atender vários clientes parecidos, e o mesmo "dublê gordo" pode inflar baselines em escala.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Reuso de corpo: o MESMO corpo (assinatura antropométrica, tatuagem, mão) aparecendo em contas distintas de titulares diferentes.
- Cenários, iluminação, balança ou ângulos recorrentes entre contas não relacionadas (assinatura de "estúdio" do serviço).
- Roupas/objetos idênticos reaparecendo em CPFs distintos.
- Divergência corpo↔rosto consistente com o padrão de dublê, repetida no portfólio.

**Mitigações:**

- Assinatura corporal cross-conta (Fase 2): indexar embeddings antropométricos e detectar o MESMO corpo em titulares diferentes — colusão em escala vira detectável.
- Fingerprint de cenário/dispositivo: hash perceptual do ambiente, modelo da balança via OCR/visão, metadata de câmera; reuso entre contas distintas escala para investigação.
- Token dinâmico imprevisível por sessão (gesto + palavra + código) eleva o custo de "treinar" o dublê e impede roteiro pré-ensaiado.
- Revisão humana com banco de "corpos suspeitos" e busca por similaridade reversa entre evidências.
- Política: payouts altos exigem pesagem ao vivo agendada (vídeo-chamada com agente ou ponto de aferição físico parceiro), inviabilizando o dublê profissional sob demanda.

### Conluio de troca de corpos entre participantes

**Como funciona:** Dois ou mais apostadores combinam de gravar o vídeo final um do outro no momento mais favorável de cada um, trocando o papel de "corpo" entre contas. Cada um aposta na própria conta, mas o corpo apresentado é o do parceiro que está mais magro naquele instante.

**Como é executado:** A e B têm biotipos parecidos. Quando A está no seu menor peso, A grava a final de B (corpo de A na conta de B), e vice-versa. Coordenam timing para que cada conta receba o corpo magro disponível. Em anéis maiores, um "pool" de corpos magros atende várias contas em rodízio.

**Sofisticação:** alta · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- O mesmo corpo aparecendo em contas diferentes (cross-conta) — sinal central.
- Rosto da conta ausente ou de relance na final; corpo não bate com baseline da própria conta.
- Correlação de devices, IPs, horários, geolocalização e padrões de aposta entre as contas do anel.
- Sincronia suspeita de check-ins finais entre contas "independentes".
- Curvas de peso de várias contas convergindo para o mesmo corpo.

**Mitigações:**

- Cross-conta body matching (Fase 2): o mesmo embedding corporal em contas distintas é o detector primário — disparo automático de investigação do anel.
- Grafo de colusão na engine: clusterizar contas por device fingerprint, IP, geo, rede social de referência, horários de check-in e similaridade de evidências.
- Exigência forte rosto+corpo+visor no mesmo frame contínuo destrói a "troca de corpos" porque o rosto do titular precisaria estar na balança junto.
- Voiceprint + faceprint da conta obrigatórios na final, ligados ao baseline da MESMA conta.
- Política de payout escalonada: quanto maior o prêmio, mais alta a barreira (pesagem supervisionada ao vivo), tornando o rodízio inviável para os valores que importam.

### Compartilhamento de conta familiar

**Como funciona:** Um membro mais magro da mesma casa grava a pesagem final na conta do titular. É especialmente perigoso porque metadata, IP, Wi-Fi, device e geolocalização batem PERFEITAMENTE — todos os sinais de ambiente que normalmente delatam fraude estão "limpos".

**Como é executado:** O titular gordo faz baseline. Na final, cônjuge/irmão/filho mais magro e parecido usa o mesmo celular, mesma casa, mesma balança e grava. Todo o contexto ambiental é genuíno; só o corpo (e talvez o rosto) é de outra pessoa. Quando o parente é muito parecido, aproxima-se do caso "gêmeo/sósia".

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Rosto/voz da final divergentes do baseline apesar de ambiente idêntico (o ambiente bater perfeitamente NÃO deve ser tratado como prova de identidade).
- Assinatura corporal diferente do baseline da conta.
- Marcadores invariantes ausentes/trocados.
- Dois rostos distintos aparecendo em check-ins diferentes da mesma conta ao longo do tempo.

**Mitigações:**

- Tratar identidade como independente do ambiente: liveness facial + voiceprint amarrados ao KYC, não confiar em IP/geo como prova de "mesma pessoa".
- Biometria histórica (Fase 2): toda final é comparada face+corpo contra o baseline da conta; divergência facial reprova mesmo com ambiente idêntico.
- Token dinâmico falado força amostra de voz vinculável ao titular em cada check-in.
- Revisão humana de side-by-side baseline/final para perdas relevantes.
- Educação/contrato: termos explicitando que pesagem por terceiro = fraude, com perda do valor apostado e banimento, reduzindo a fraude "inocente" familiar.

### KYC com documento/selfie de terceiro magro

**Como funciona:** O onboarding inteiro é feito com documento e selfie de uma pessoa naturalmente magra (parente, cúmplice, ou doc comprado). Como a IDENTIDADE da conta já é a do magro, ele serve de corpo legítimo em TODAS as pesagens — não há divergência facial a detectar, porque o "titular oficial" é o magro. A fraude está no descasamento entre quem aposta o dinheiro e quem aparece.

**Como é executado:** O verdadeiro apostador (gordo) registra a conta com o KYC de um magro cúmplice. O baseline é fabricado para parecer "sobrepeso" (roupas com enchimento, balança manipulada, ou o magro num período mais pesado) e a final mostra o magro no seu peso real. Toda a biometria é consistente porque é sempre a mesma pessoa — só que não é quem se beneficia.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Baseline com corpo "inflado" artificialmente: contornos de roupa, sombras de enchimento, rosto magro com "corpo gordo" incoerente (rosto e composição corporal não batem).
- IMC do rosto/pescoço incompatível com o peso declarado no baseline.
- Pix/pagamento de CPF diferente do titular KYC.
- Padrão de uso (digitação, device, horários) sugerindo operador distinto do rosto.

**Mitigações:**

- Coerência rosto↔corpo↔peso no BASELINE: engine valida se a face magra é plausível para o peso inicial declarado (IMC facial vs peso); incoerência reprova o baseline, não só a final.
- Casamento Pix↔CPF↔KYC: o pagador do Pix deve ser o titular do KYC; divergência vira flag forte (anti-laranja).
- Anti-fat-suit no baseline: detecção de enchimento, costuras tensionadas, transição de textura corpo/roupa.
- Liveness no baseline com o mesmo rigor da final (subir na balança, corpo inteiro contínuo) para impedir baseline "encenado".
- Revisão humana do baseline para apostas de valor alto — o baseline é tão crítico quanto a final.

### Conta verificada vendida/alugada

**Como funciona:** Uma conta com KYC e baseline JÁ aprovados, de alguém naturalmente magro, é comprada ou alugada por um terceiro para "fechar" a meta. O comprador não precisa burlar KYC nem baseline — herda uma conta limpa cujo corpo magro garante a final.

**Como é executado:** Em marketplaces informais, vende-se "conta Charya com baseline aprovado e meta agressiva". O magro original passou KYC, fez baseline e talvez check-ins, depois transferiu credenciais. O comprador apenas grava a final usando o magro original (ou ele mesmo, se parecido) e saca. O magro pode ser "alugado" também para gravar a final mediante pagamento.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Troca de device/IP/geo entre baseline e final (conta migrou de dono).
- Mudança de padrão comportamental (digitação, horários, idioma de teclado) pós-aprovação do baseline.
- Conta de baseline antiga "reativada" abruptamente para uma aposta de alto valor.
- Pagador Pix divergente do histórico da conta.
- Reuso do mesmo corpo magro em várias contas (caso de aluguel).

**Mitigações:**

- Re-verificação de liveness/biometria no MOMENTO da final e do saque, não confiar no KYC antigo: a final precisa casar com o rosto do KYC ao vivo.
- Continuidade de device/sessão: vincular conta a device fingerprint; troca de device antes de payout alto exige re-KYC.
- Casamento Pix de saque ↔ CPF do KYC: payout só para conta bancária do mesmo titular, eliminando o benefício da revenda.
- Detecção de mudança comportamental na engine (drift de device/uso) entre baseline e payout.
- Política: janela mínima e check-ins biométricos recorrentes ao longo do prazo impedem "conta dormente revendida na hora do saque".

### Múltiplas contas / laranjas em escala

**Como funciona:** Em vez de uma fraude perfeita, o fraudador distribui apostas por VÁRIAS contas com KYC de laranjas distintos e reaproveita evidência plausível em vários CPFs, maximizando o valor esperado AGREGADO. Mesmo que algumas contas sejam pegas, o lucro do conjunto compensa.

**Como é executado:** O operador recruta laranjas (vende-se KYC por valor baixo no Brasil), cada um com seu CPF/conta, e roda o mesmo playbook de proxy/dublê em lote. Reaproveita corpos magros, cenários e roteiros entre contas, ajustando metadata o suficiente para não ser óbvio. Espalha apostas para diluir risco e ficar abaixo de limiares de revisão.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Reuso de corpo, rosto, cenário, balança ou device entre contas formalmente independentes.
- Cluster de contas com Pix originando/destinando para poucas contas bancárias concentradoras.
- Apostas calibradas logo abaixo dos limiares de revisão humana (gaming do threshold).
- Padrões temporais e geográficos correlacionados entre "estranhos".

**Mitigações:**

- Detecção de anéis na engine: grafo cruzando device, IP, geo, Pix, biometria corporal/facial e cenário entre contas; clusters disparam investigação coletiva.
- Limites de exposição agregada e thresholds de revisão DINÂMICOS/ocultos (não fixos), para impedir calibragem abaixo da linha.
- Concentração financeira: monitorar convergência de Pix/saques para poucas contas bancárias (anti-laranja).
- Velocity rules: muitos cadastros/baselines novos com padrão similar em curto prazo elevam fricção (re-KYC, revisão).
- Reuso biométrico cross-conta como gatilho de alto peso no score antifraude.

### KYC farm / fábrica de contas verificadas

**Como funciona:** Operação organizada que passa KYC EM LOTE usando rostos magros reais (laranjas pagos, ou pessoas em situação de vulnerabilidade) e revende contas prontas com baseline aprovado. Industrializa o conluio de identidade: o produto vendido é "corpo magro verificado".

**Como é executado:** A farm recruta dezenas de pessoas magras reais, passa todos no KYC/liveness de terceiros (são pessoas reais, então liveness passa), cria baselines "encenados como sobrepeso" ou aguarda flutuação de peso, e revende as contas como ativos. Pode operar com câmera virtual/injeção para reaproveitar liveness, mas frequentemente nem precisa — usa gente real em escala.

**Sofisticação:** alta · **Custo p/ fraudador:** alto · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Onboarding em lote: muitos KYCs do mesmo device/IP/faixa de rede em janela curta.
- Mesma câmera/sensor fingerprint ou mesmo ambiente em selfies de "pessoas diferentes".
- Documentos com padrões de fabricação/template comuns; sinais de câmera virtual no liveness.
- Baselines homogêneos demais (mesma balança, cenário, iluminação) entre contas.
- Contas criadas e "dormentes" ativadas em onda quando surge promoção/payout.

**Mitigações:**

- Sinais antifraude do provedor de KYC (Sumsub/Onfido/Veriff) configurados para detectar device farm, câmera virtual e replay de liveness; consumir e ponderar esses sinais na engine.
- Device/sensor fingerprint e detecção de injeção de câmera (frame rate, metadata, ausência de ruído de sensor real).
- Correlação de onboarding em lote (mesmo device/IP/template de doc) bloqueia a fábrica na origem.
- Re-liveness no payout: a farm precisaria entregar a pessoa magra original em cada saque, elevando custo.
- Casamento Pix↔CPF e limites por device quebram a economia de revenda.
- Revisão humana de amostras do onboarding em períodos de pico para flagrar padrão de fábrica.

### Sequestro de identidade de quem emagreceu de verdade

**Como funciona:** O KYC e o baseline são feitos em nome de alguém que está REALMENTE em processo de emagrecimento (laranja ou cúmplice), para colher o payout de uma perda de peso genuína de terceiro. A comprovação é 100% real — o problema é que quem aposta o dinheiro não é quem emagrece, e a perda já estava acontecendo independentemente da aposta.

**Como é executado:** O operador identifica conhecidos em dieta/pós-bariátrica/em treino que vão perder peso de qualquer forma. Cria a conta no nome deles, aposta o próprio dinheiro, e usa os vídeos reais do emagrecimento real para sacar. Pode até envolver pacientes pós-cirúrgicos cuja perda é rápida e garantida. Tudo passa em biometria e plausibilidade porque é verdadeiro.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Pagador Pix ≠ titular KYC (o apostador real financia, o laranja aparece).
- Curva de perda compatível com pós-bariátrica/intervenção médica não declarada (perda muito linear/rápida porém "plausível").
- Saque para conta bancária de terceiro.
- Conta sem engajamento comportamental típico (não usa features de coaching/check-in voluntário; só aparece para pesar).

**Mitigações:**

- Casamento estrito Pix de entrada ↔ CPF KYC ↔ conta de saque: o mesmo titular financia, aparece e recebe — quebra o sequestro economicamente.
- Declaração e detecção de cirurgia bariátrica/medicação (GLP-1) como fator de underwriting: ajustar regras/odds ou exigir disclosure; perda "garantida" não deveria render EV de fraude.
- Engajamento comportamental como sinal: contas que só pesam e nunca interagem entram em score de risco mais alto.
- Integração wearable (Fase 3) para verificar atividade/contexto coerente com a pessoa que pesa.
- Política antifraude e KYC reforçado vinculando beneficiário financeiro = titular biométrico.

### Maquiagem/disfarce/fat suit para unificar dois corpos

**Como funciona:** Recursos de caracterização — peruca, barba postiça, enchimentos, fat suit, roupas padronizadas — fazem o dublê magro PARECER a mesma pessoa do baseline na comparação biométrica, ou (no sentido inverso) fazem o titular parecer mais gordo no baseline. O objetivo é colar duas pessoas numa só identidade visual, ou inflar/deflar artificialmente o mesmo corpo.

**Como é executado:** No baseline, o titular (ou um laranja) veste fat suit/enchimentos para registrar "sobrepeso" inflado; na final, sem o suit, aparece magro — fabricando perda. Ou: o dublê magro usa peruca/barba para imitar a aparência do titular do KYC, padronizando roupas e cenário para enganar a comparação humana e o matcher facial.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Texturas/transições não-naturais de pele-tecido (bordas de fat suit, costuras tensionadas, "gordura" que não se move como tecido adiposo real).
- Rosto magro com corpo gordo (ou vice-versa) — incoerência IMC facial vs corporal.
- Linha de peruca/barba postiça, sombra de cola, simetria artificial.
- Movimento corporal incompatível com a massa declarada (uma pessoa magra em fat suit anda/sobe na balança com biomecânica de leve).
- Balança mostrando peso incompatível com volume aparente do "corpo gordo".

**Mitigações:**

- Anti-fat-suit por computer vision (Fase 2): detectar enchimento, biomecânica de massa, coerência entre volume corporal aparente e peso do visor.
- Coerência IMC facial ↔ peso do visor ↔ volume corporal em CADA pesagem (especialmente baseline).
- Gesto dinâmico que exige movimento revelador (agachar, virar de lado, levantar os braços) — disfarces e fat suits falham na dinâmica.
- Liveness facial robusto a oclusão/maquiagem (provedores top detectam máscara/prótese); escalar para humano em score intermediário.
- Cross-check de peso contra dinâmica corporal: o visor é a âncora objetiva — peso baixo com corpo "volumoso" é flag automático.
- Revisão humana com foco em texturas e transições em payouts altos.

### Token cantado pelo titular + peso de proxy fora de quadro

**Como funciona:** Ataque cirúrgico contra a dependência do token: o rosto VERIFICADO mostra/fala o token e faz o gesto corretamente (liveness e token passam), mas QUEM SOBE NA BALANÇA é um proxy mais magro, fora do enquadramento sincronizado do visor. O token prova "presença ao vivo do titular", não "o titular está na balança".

**Como é executado:** Titular e proxy coordenam em tempo real. O titular, no quadro, fala "CHARYA 4821, EVOLUÇÃO" e faz o gesto — satisfazendo o token anti-replay. A câmera então transita para o visor enquanto o corpo na balança é o do proxy magro, em momento separado do rosto. Exploram que o token valida liveness/recência mas não amarra o token AO CORPO sobre a balança no mesmo instante.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Token e visor da balança nunca aparecem no MESMO frame com rosto e corpo do mesmo indivíduo.
- Descontinuidade temporal entre o trecho do token (rosto) e o trecho da balança.
- Corpo na balança não bate com o corpo do titular no trecho do token.
- Áudio do token (voz) de pessoa diferente da que está na balança (se houver fala na subida).

**Mitigações:**

- Amarração token↔corpo↔visor no mesmo frame contínuo: a UX deve exigir que o token (mostrado na tela/falado), o ROSTO e o VISOR estejam visíveis simultaneamente OU conectados por um pan único e contínuo rosto→corpo→visor, sem corte.
- Gesto que só faz sentido na balança: ex.: "fale o token enquanto está em pé na balança mostrando o corpo inteiro e o visor" — força sincronia.
- Detecção de continuidade/edição (Fase 2): qualquer descontinuidade entre token e leitura do peso reprova.
- Voiceprint no token + faceprint + body match: três âncoras que precisam ser a mesma pessoa no mesmo segmento.
- Timestamp e token com janela curta de validade obrigando captura única e contínua, não montada.

### Wearable/balança smart pareada ao corpo do proxy (Fase 3)

**Como funciona:** Na Fase 3, dados objetivos de wearable/balança BLE/Wi-Fi servem para CORROBORAR a comprovação. O ataque pareia o dispositivo do titular ao corpo de uma pessoa magra (proxy), ou injeta histórico clonado/sintético, fazendo o "dado objetivo" confirmar a fraude de proxy — transformando a defesa em cúmplice involuntário.

**Como é executado:** O titular pareia sua balança smart/wearable, mas quem efetivamente usa o dispositivo (pesa, caminha, dorme) é o proxy magro — então o dado objetivo reflete o corpo errado. Variações: spoofing de BLE para injetar leituras de peso forjadas; clonagem/replay de payload da balança; emulador de Health Connect/HealthKit alimentando passos, FC e peso sintéticos; rooting do device para falsificar a fonte do dado.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Dados de wearable "perfeitos demais"/lineares ou estatisticamente sintéticos (FC, passos, sono sem ruído humano realista).
- Inconsistência entre peso da balança smart e peso do vídeo OCR no mesmo momento.
- BLE com características de dispositivo emulado, ausência de atestação de hardware, payloads sem assinatura.
- Health Connect/HealthKit em device rooted/jailbroken ou com source não confiável.
- Padrão de atividade incompatível com IMC declarado (FC de repouso e VO2 de atleta num "obeso" em baseline).

**Mitigações:**

- Atestação de integridade do dispositivo: Play Integrity/App Attest, detecção de root/jailbreak e de câmera/sensor virtual; dados de device comprometido são descartados como prova.
- Dispositivos com canal seguro/assinado e pareamento auditável; preferir integrações OAuth oficiais (Garmin/Apple Health/Google Health Connect) a leitura BLE crua spoofável.
- Cross-validação multimodal: peso da balança smart DEVE bater com OCR do vídeo no mesmo evento; divergência reprova ambos.
- Detecção de séries sintéticas na engine: variância/ruído fisiológico realista de FC, passos, sono; dados "limpos demais" viram flag.
- Coerência longitudinal: a fisiologia do wearable (FC repouso, gasto calórico) deve ser plausível para o peso/curva declarados.
- Wearable como sinal CORROBORATIVO, nunca prova única; payout alto sempre exige vídeo + biometria + revisão humana além do dado objetivo.

### Conluio com revisor humano interno (insider na camada 3)

**Como funciona:** A camada 3 (revisão humana de payouts altos/suspeitos) é o ponto de decisão final e de maior alavancagem. Um analista de antifraude, terceirizado de BPO ou moderador com acesso ao painel pode aprovar manualmente um caso fraudulento, suavizar um flag, reclassificar uma sessão suspeita como legítima, ou vazar para o fraudador exatamente quais sinais a engine olha. Diferente de engenharia social no suporte, aqui o atacante já está dentro: tem credencial legítima e poder de override.

**Como é executado:** Fraudador recruta ou suborna analista (pagamento por aprovação, % do payout); insider cria fila preferencial para contas de laranjas; insider com acesso à documentação interna vaza a lista de regras automáticas e thresholds fisiológicos; ex-funcionário mantém acesso por offboarding mal feito; analista aprova em lote no fim do expediente sem revisão real (rubber-stamping). Em operação terceirizada de moderação no Brasil, salário baixo + payout alto cria assimetria de incentivo clássica.

**Probabilidade:** média | **Impacto:** alto | **Sofisticação:** média

**Sinais de detecção:**

- Taxa de aprovação manual anômala por analista (outlier vs. pares)
- Aprovações concentradas em horários/sessões curtas (tempo médio de revisão abaixo do plausível)
- Correlação entre analista específico e contas que depois dão chargeback/fraude confirmada
- Override de flags de alto risco sem nota justificativa
- Acesso ao painel fora de horário/IP esperado
- Clusters de payout aprovados pelo mesmo revisor com features semelhantes (mesma balança, GPS próximo, device parecido)

**Mitigações:**

- Dupla revisão obrigatória (4-eyes) para payout acima de threshold; revisores não se conhecem e são atribuídos aleatoriamente
- Maker-checker: quem revisa não libera o pagamento; segregação de função
- Decoy cases / mystery shopping: casos sintéticos fraudulentos injetados na fila para auditar a fidelidade do revisor
- Imutabilidade e log de auditoria de todo override, com tempo-de-tela mínimo por caso
- Rotação de analistas e atribuição aleatória de filas para quebrar relacionamento atacante-insider
- Thresholds e seed de token NUNCA documentados em material acessível à camada 3; revisores veem o flag, não a regra
- Offboarding com revogação imediata de acesso e revisão retroativa das últimas aprovações do desligado
- Modelo de detecção de anomalia sobre o comportamento dos próprios revisores (analytics de quem aprova)

_(identificado na revisão de completude)_

### Laranjas e CPFs de vazamento como serviço (fraude-as-a-service do mercado brasileiro)

**Como funciona:** Existe no Brasil um mercado maduro e barato de identidades e contas: bases de CPF/RG/selfie vazadas (megavazamentos tipo Serasa/SUS), 'contas verificadas' à venda em Telegram, recrutamento de laranjas por R$50-200 via grupos de WhatsApp, e 'consultorias de aprovação' que vendem o passo-a-passo para passar em KYC. Isso transforma vários vetores já listados (múltiplas contas, KYC farm, conta alugada) em uma operação industrial barata e específica do contexto local, mudando radicalmente a economia do ataque assumida pela filosofia 'fraude cara e trabalhosa'.

**Como é executado:** Comprador adquire kit CPF+selfie+comprovante de pessoas reais magras a partir de vazamentos; recruta laranjas reais magros que se pesam de verdade em troca de cachê; usa fila de contas para apostar em escala e sacar via Pix de terceiros; revende o 'método' que derrota a verificação atual; combina laranja magro real (passa liveness e body estimation) com titular gordo apenas no baseline. A barreira econômica desejada cai porque o insumo (identidade verificável) é commodity local barata.

**Probabilidade:** alta | **Impacto:** alto | **Sofisticação:** média

**Sinais de detecção:**

- Clustering de devices, IPs, faixas de horário, modelos de aparelho e operadoras entre contas 'sem relação'
- Chave Pix de saque divergente do titular ou reutilizada entre contas distintas
- Reuso de comprovante de endereço, mesma geolocalização de pesagem para vários CPFs
- CPFs presentes em bases de vazamento conhecidas; selfie com baixa entropia (mesma iluminação/fundo) entre contas
- Velocidade de cadastro-para-aposta-máxima padronizada (script de 'método')
- Grafo de Pix convergindo para poucas contas beneficiárias finais

**Mitigações:**

- Device fingerprinting + graph analytics para detectar redes de contas e fila de laranjas
- Exigir que a chave Pix de saque seja do mesmo CPF do titular verificado (amarração titularidade-pagamento)
- Liveness ativo + biometria histórica: o MESMO rosto deve aparecer no baseline, intermediária e final (impede troca por laranja magro só no final)
- Cruzamento com bureaus e bases de fraude; scoring de CPF com sinais de vazamento
- Limites de exposição por device/rede/grafo, não só por conta
- Velocity rules e cooling-off para padrões de cadastro automatizados ('método')
- Monitorar Telegram/marketplaces por venda do 'método' do próprio app (threat intel) e mudar challenge para invalidar tutoriais publicados

_(identificado na revisão de completude)_

---

## 4. Manipulação de vídeo e mídia (replay, edição, deepfake/GenAI)

_14 vetores nesta categoria._

### Replay de tela filmada (segunda tela)

**Como funciona:** O fraudador reproduz um vídeo de pesagem válido (gravado antes, possivelmente legítimo) num monitor, TV ou segundo celular e filma essa tela com o app Charya. O ataque derrota o OCR (que lê o número exibido normalmente) e o liveness passivo (que vê um "rosto" e "movimento" reais na tela). Não exige root nem câmera virtual, sendo o vetor low-tech mais acessível e perigoso do MVP.

**Como é executado:** O fraudador grava uma pesagem real uma vez (com token genérico ou sem token, se a Fase 1 ainda não amarrar token), salva o vídeo. Quando precisa "comprovar" o peso final, abre o app, aponta a câmera para a outra tela tocando o play. Para vencer o token dinâmico ao vivo, ele pausa, lê o código gerado agora na tela do app e refilma mostrando o token de papel/segunda tela sobre a cena reproduzida, ou usa um vídeo onde o gesto é genérico o suficiente para colar com qualquer instrução.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Moiré/aliasing e padrão de subpixel RGB da tela reproduzida; banding de refresh (rolling shutter vs. taxa de atualização do display).
- Reflexos especulares na moldura do monitor, bordas retas do bezel entrando no enquadramento, brilho/contraste fora de faixa de cena real.
- Profundidade plana: liveness 3D/parallax falha (tudo no mesmo plano focal); ausência de paralaxe quando o app pede micro-movimento de câmera.
- Token gerado AGORA não aparece na cena reproduzida, ou aparece com atraso/inconsistência de iluminação (token "flutua" sobre a imagem).
- Áudio com eco/reverb de ambiente duplo; nível de ruído ambiente incompatível com fala ao vivo.

**Mitigações:**

- Liveness ativo de terceiros (Onfido/iProov/Unico) com challenge-response 3D e flash de cor aleatória na tela do app que deve refletir no rosto real — telas reproduzidas não refletem corretamente a cor projetada.
- Token dinâmico STRICT: código + palavra + gesto gerados no momento da gravação, com janela curta (ex.: 60-90s) e validação de que apareceram NO vídeo via OCR/ASR; rejeitar se não casar exatamente.
- Detector de tela/recapture na engine (CV Fase 2): classificador de moiré, bezel, banding de refresh e reflexo especular treinado para "screen-of-screen".
- Forçar movimento de câmera prescrito ("aproxime o visor", "gire 30° à direita") e medir paralaxe/foco — cena plana de tela falha.
- Exigir captura SOMENTE in-app, sem upload de arquivo; gravação nativa com SDK que assina frames e checa sensores (giroscópio/acelerômetro coerentes com o movimento filmado).
- Revisão humana obrigatória para payouts altos com checklist anti-recapture.

### Replay attack puro (token desatualizado)

**Como funciona:** Reuso direto de um vídeo de pesagem pré-gravado, enviado como comprovação, sem o token atual exibido na cena. Só é viável se o app NÃO casar o token gerado no momento da solicitação com o que efetivamente aparece no vídeo — é a falha de design mais elementar.

**Como é executado:** O fraudador grava uma pesagem favorável (real ou manipulada) uma única vez e reenvia o mesmo arquivo a cada momento de comprovação (inicial, intermediária, final), ou compartilha o arquivo entre contas. Sem amarração de token, OCR lê o número plantado e a revisão superficial aprova.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta (se houver brecha) · **Impacto:** alto

**Sinais de detecção:**

- Token corrente ausente ou divergente do desafio emitido para aquela sessão.
- Hash/fingerprint do arquivo idêntico a submissão anterior (mesma conta ou cross-account).
- Timestamp/EXIF anterior à emissão do desafio; metadata estática entre check-ins que deveriam ser dias diferentes.
- Iluminação, roupa e cenário idênticos entre pesagens separadas por semanas.

**Mitigações:**

- Amarração obrigatória token↔vídeo: o desafio (código + palavra + gesto + timestamp) é gerado server-side por sessão, com nonce único, e a engine valida presença via OCR (código) + ASR (palavra falada) + CV (gesto). Sem match, rejeição automática.
- Banco de perceptual hashes (pHash/vídeo fingerprint) de todas as submissões; bloquear reuso intra e inter-conta.
- Captura only-in-app com nonce embutido no overlay renderizado pelo próprio app no momento (impossível de existir em vídeo pré-gravado).
- Janela temporal curta entre emissão do desafio e submissão; expirar desafio.

### Token injetado em pós-produção (overlay digital)

**Como funciona:** O fraudador captura o token correto (lendo a tela do app) e o sobrepõe digitalmente sobre um vídeo antigo, vencendo a verificação ingênua de "token presente" sem ter gravado a cena ao vivo. Derrota OCR de token que só checa existência textual, não a integração física do texto na cena.

**Como é executado:** Abre o app, anota/printa o token do desafio atual. Pega vídeo antigo da pesagem desejada, adiciona uma camada de texto (After Effects/CapCut) com o código, palavra e timestamp, eventualmente faz tracking simples para o texto "acompanhar" um plano. Para o gesto, escolhe um vídeo antigo cujo movimento case com a instrução, ou edita.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Texto do token com bordas perfeitas, sem motion blur, sem oclusão por objetos da cena, sem variação de iluminação/sombra coerente.
- Token "flutua": não respeita perspectiva, não é ocluído quando a mão/corpo passa na frente, sem grão/compressão local igual ao resto do frame.
- Gesto genérico que não corresponde exatamente à instrução randomizada (ex.: pediu "mão direita levantada e virar de lado" e só há mão levantada).
- Descontinuidade de ELA (Error Level Analysis) na região do overlay; níveis de ruído/quantização diferentes na caixa do texto.

**Mitigações:**

- Gesto físico randomizado e composto (combinação de 2-3 ações) que precisa ser executado pelo corpo na cena — overlay de texto não satisfaz; validar via pose estimation (Fase 2).
- Exigir que o usuário FALE o token (ASR) além de mostrá-lo; e mostrá-lo manuscrito em papel segurado na cena, ocluído pela mão (oclusão física difícil de forjar em overlay).
- Detecção de composição/overlay na engine: análise de consistência de ruído, ELA, fronteiras de objeto, e ausência de motion blur coerente.
- Token renderizado pelo app DENTRO do feed da câmera em tempo real (burn-in nativo no momento da captura), tornando overlay posterior detectável por divergência de profundidade/iluminação.
- Captura only-in-app sem aceitar arquivos externos.

### CGI/edição do visor da balança (número falso sobreposto)

**Como funciona:** O vídeo é real — corpo, rosto, gesto e token autênticos ao vivo — mas o display da balança é mascarado e substituído por um peso falso via composição/tracking (After Effects, mocha Pro). É o ataque "cirúrgico": tudo passa no liveness e na biometria; só o número mente.

**Como é executado:** O fraudador grava a pesagem real cumprindo todos os desafios. Em pós, faz tracking do visor (mocha), aplica máscara e renderiza dígitos sintéticos com fonte/segmento de LCD compatível, ajustando grão e blur para casar. O OCR lê o número plantado.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Inconsistência local na região do visor: ruído/compressão, temperatura de cor e blur diferentes do entorno; bordas do display "limpas demais".
- Dígitos de LCD sem o leve flicker/refresh real, sem reflexo do ambiente no vidro do visor, segmentos com antialiasing artificial.
- Tracking imperfeito: micro-jitter ou "deslize" do número quando a balança se move; oclusão por dedo/pé não respeitada.
- Peso incoerente com plausibilidade fisiológica e com histórico de check-ins/wearables.

**Mitigações:**

- Cross-check com fonte independente do número: balança smart BLE/Wi-Fi (Fase 3) que transmite o peso direto ao app; OCR do vídeo serve só como confirmação secundária.
- Plausibilidade fisiológica (Engine Charya): taxa de perda coerente (ex.: >1-1,5% do peso/semana = flag), consistência com baseline e intermediária, e com massa corporal estimada por body estimation (Fase 2).
- Detector de edição local/composição: ELA, mapas de ruído PRNU, análise de consistência de iluminação na ROI do display.
- UX da pesagem: pedir movimento da balança/zoom no visor e leitura em voz alta do número (ASR) — número falado vs. número OCR vs. número da balança smart devem coincidir.
- Revisão humana obrigatória no peso final e em qualquer payout acima de limiar.

### Loop/freeze-frame do visor

**Como funciona:** Variante de baixo esforço da edição do visor: congela ou faz loop sutil apenas do frame do display (ou cobre e descobre o visor no momento certo) para fixar um número que não corresponde à leitura real do momento. Pode até ser feito sem software, manipulando fisicamente o que a balança mostra.

**Como é executado:** Opção digital: em edição, o fraudador congela a ROI do visor enquanto o resto do corpo continua se movendo, ou faz um loop curto. Opção física: sobe e desce da balança rapidamente, ou cobre o visor e revela quando ele mostra um valor estabilizado favorável (balança com memória/última leitura), filmando só o instante conveniente.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Região do visor estática enquanto o entorno (reflexos, sombras, micro-movimento) varia — patch congelado.
- Display já mostrando número antes da subida completa na balança; ausência da sequência zerar→subir→estabilizar.
- Número que não oscila durante a estabilização (balanças reais flutuam por 1-3s antes de travar).
- Cortes/oclusão do visor exatamente no momento da leitura.

**Mitigações:**

- Exigir sequência contínua e verificável: balança zerada → corpo entra no frame → subida → estabilização com oscilação natural → leitura. Validar a transição via CV (Fase 2).
- Análise temporal por região: detectar frames congelados/looped no patch do visor (diferença de pixel ≈0 numa ROI enquanto o resto varia).
- Balança smart (Fase 3) com stream de peso em tempo real timestampado, dispensando a leitura visual como fonte primária.
- UX: o usuário precisa permanecer na balança lendo o número em voz alta por N segundos enquanto move a câmera, impossibilitando freeze coerente.

### Splicing de dois vídeos (corte disfarçado no gesto)

**Como funciona:** O fraudador costura dois clipes — por exemplo, um com corpo/balança e outro com rosto/token — num momento de movimento brusco (o gesto) para disfarçar a emenda e simular a continuidade exigida do vídeo único contínuo. Permite combinar a melhor parte de cada gravação (corpo magro de alguém + rosto do titular).

**Como é executado:** Grava dois vídeos planejando o ponto de corte no gesto (vire de lado / levante a mão), onde o motion blur esconde a transição. Em edição, alinha cortes, casa iluminação/cor, e renderiza um único arquivo "contínuo". O token e o gesto aparecem; a continuidade aparente engana revisão superficial.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Descontinuidade temporal no ponto do gesto: salto de iluminação, posição de fundo, roupa/cabelo, relógio/sombra; quebra de continuidade de movimento (velocity discontinuity).
- Quebra de cadência de frames/timestamps internos; mudança de fingerprint de compressão (GOP boundary) no ponto de emenda.
- Áudio com clique/descontinuidade de ruído de fundo no corte; troca abrupta de reverb.
- Pose/identidade corporal antes e depois do corte não batem (body estimation).

**Mitigações:**

- Captura only-in-app com gravação nativa contínua assinada frame-a-frame (timestamps monotônicos + sensores), tornando qualquer corte detectável por descontinuidade de cadência/hash.
- Gesto composto e imprevisível no MEIO e no FIM do vídeo (não só num ponto), forçando continuidade real; validar fluidez via optical flow (Fase 2).
- Detecção de cut/splice: análise de continuidade de optical flow, iluminação, fundo e cadência de GOP.
- Consistência corporal/biométrica contínua ao longo do vídeo (rosto e corpo da MESMA pessoa em todos os frames).
- Revisão humana com timeline scrubbing focada em transições.

### Reuso/edição de dois vídeos reais com condição inflada

**Como funciona:** Ambos os vídeos são autênticos, mas a "perda de peso" é artefato de diferença de condição: no baseline o fraudador infla o peso (roupas pesadas, antes de evacuar/urinar, depois de carga hídrica/salina, pesos escondidos, balança descalibrada) e no final aparece em condição normal/desidratado. Não há edição do display — é fraude de protocolo, difícil de contestar por forense de mídia.

**Como é executado:** No baseline real, o usuário se pesa vestido, com tornozeleiras/colete de peso ou bolsos cheios, após hipersalinização e supersaturação hídrica, talvez com a balança em piso macio/inclinado. No final, pesa em jejum, desidratado, sem roupa, balança calibrada — capturando uma "queda" de vários quilos que é água, roupa e timing, não gordura.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Baseline com roupas/calçado vs. final mais leve de vestimenta; objetos suspeitos no corpo.
- Variação de peso fisiologicamente rápida demais no curtíssimo prazo (água/desidratação): perda concentrada perto do fim, não progressiva.
- Composição corporal estimada (body estimation) quase inalterada apesar de grande "queda" no número — sinal clássico de manipulação de água/roupa.
- Discrepância com wearables/balança smart (bioimpedância) e com check-ins intermediários.
- Mesma balança? superfície/piso diferente entre pesagens; balança não zerada/calibrada no baseline.

**Mitigações:**

- Protocolo de pesagem padronizado e validado por CV: roupas mínimas (ex.: regata e shorts), descalço, balança em piso rígido nivelado, zeragem mostrada — rejeitar baseline fora do protocolo.
- Body estimation (Fase 2) cruzando número da balança com volume/silhueta corporal: queda de peso sem mudança de composição = flag.
- Balança smart com bioimpedância (Fase 3): % de gordura vs. água; perda dominada por água é detectável.
- Validação intermediária frequente (curva de evolução): plausibilidade fisiológica exige trajetória coerente, não salto final.
- Janela mínima entre baseline e final, e regra antifraude que penaliza baseline "gordo demais" vs. silhueta (incentivo invertido).
- Revisão humana comparando baseline×intermediária×final lado a lado.

### Deepfake/faceswap sobre corpo emprestado real

**Como funciona:** Um "laranja" magro faz a pesagem e o gesto ao vivo, enquanto um faceswap (tempo real ou pós) aplica o rosto do titular para bater com o KYC/biometria. O corpo, a balança e o gesto são reais e fisicamente plausíveis; só a identidade do rosto é sintética. Derrota biometria facial que confia no rosto exibido.

**Como é executado:** Recruta alguém com o peso-alvo. Em tempo real, usa câmera virtual + modelo de faceswap (DeepFaceLive) alimentado por fotos do titular; ou grava o laranja e aplica faceswap em pós. O rosto resultante passa no match facial com o KYC; corpo e número são autênticos.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Artefatos de faceswap: costuras na borda do rosto/cabelo, flicker temporal, descolamento em oclusões (mão na frente do rosto), olhos/dentes inconsistentes, iluminação do rosto incoerente com o corpo.
- Liveness ativo (challenge de flash de cor, movimento de cabeça extremo, oclusão) quebra o swap em tempo real.
- Incompatibilidade rosto×corpo: tom de pele/iluminação do pescoço, ausência de paralaxe 3D do rosto.
- Câmera virtual/integridade do device comprometida (root/inject) detectada por attestation.

**Mitigações:**

- Liveness ativo robusto de terceiros (iProov Flashmark, Onfido, Unico) com flash de cor aleatório e challenges que quebram faceswap em tempo real; preferir fornecedor com defesa anti-deepfake comprovada.
- Device/integrity attestation (Play Integrity / DeviceCheck/App Attest) + detecção de câmera virtual e root para bloquear injeção de feed.
- Verificação rosto↔corpo: pedir momentos em que rosto e corpo aparecem juntos no MESMO frame em movimento; checar coerência de iluminação e oclusão (mão cruzando o rosto rompe swap).
- Detector de deepfake na engine (Fase 2) sobre frames-chave; análise temporal de flicker/borda.
- Biometria histórica: comparar microtraços faciais entre check-ins; um swap consistente entre sessões é caro de manter.
- Revisão humana especializada para payouts altos.

### Vídeo 100% gerado por IA (video diffusion)

**Como funciona:** Um modelo generativo classe Sora/Veo/Kling sintetiza a cena inteira — pessoa, balança, display com peso, gesto e token — a partir do rosto de referência do titular, sem nenhuma captura real. Ataque de ponta que, se bem-feito, passa em liveness passivo e OCR.

**Como é executado:** O fraudador faz prompt com foto do titular (image-to-video) pedindo a cena de pesagem com o peso e gesto desejados, gera várias amostras, escolhe a melhor, injeta via câmera virtual ou submete como arquivo. O token corrente é o calcanhar: ou ele tenta gerar com o código (difícil de o modelo renderizar texto exato) ou faz overlay posterior do token.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa-média (crescente) · **Impacto:** alto

**Sinais de detecção:**

- Texto incoerente: modelos de difusão renderizam mal código/timestamp/dígitos do visor (caracteres deformados, instáveis frame-a-frame).
- Física implausível: subir na balança sem deslocamento de peso, mãos com dedos extras, reflexos impossíveis, fundo "respirando", morphing sutil.
- Ausência de ruído de sensor real/PRNU; fingerprint de modelo generativo; metadata sem assinatura de câmera real.
- Gesto composto randomizado mal executado; falha em challenges de liveness ativo interativos.
- Falta de paralaxe/coerência 3D sob movimento de câmera prescrito.

**Mitigações:**

- Liveness ativo INTERATIVO em tempo real (challenge-response com flash de cor e movimentos imprevisíveis) — vídeo gerado offline não responde ao desafio do momento.
- Captura only-in-app + device attestation + detecção de câmera virtual: barra a injeção do arquivo gerado.
- Token com código alfanumérico + timestamp ao vivo, exigido por OCR e ASR — difusão erra texto; overlay posterior cai no detector de composição.
- Detector de conteúdo sintético/IA na engine (Fase 2): classificadores anti-GenAI sobre frames e no domínio de frequência; verificação de PRNU do sensor.
- Cross-check com balança smart e wearables (Fase 3) — fonte de dados independente do vídeo.
- Plausibilidade fisiológica + revisão humana para casos de alto valor.

### Green screen / composição do corpo

**Como funciona:** Rosto e token reais do titular são filmados em croma (chroma key) e compostos sobre um vídeo de corpo mais magro (do próprio em outra época, de um laranja, ou stock). Passa biometria (rosto real) e exibe corpo/peso falsos.

**Como é executado:** Filma o rosto real cumprindo o gesto e mostrando o token contra fundo verde; em pós, faz keying e compõe sobre o vídeo de fundo da pesagem magra, ajustando escala, iluminação e bordas. Renderiza arquivo único.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Spill verde residual nas bordas, halo/matte line ao redor do rosto/cabelo, bordas duras.
- Iluminação/temperatura de cor do rosto incoerente com a cena de fundo; sombras do rosto não projetadas no ambiente.
- Ausência de interação física rosto↔corpo (rosto nunca ocluído por elementos do fundo); paralaxe inconsistente.
- Token integrado só na camada do rosto, não no plano da balança.

**Mitigações:**

- Exigir frames com corpo inteiro + rosto + balança simultâneos e em movimento contínuo, com oclusões cruzadas (mão passando do rosto ao visor) — impossível de manter com composição em camadas separadas.
- Liveness ativo com flash de cor que deve banhar rosto E ambiente igualmente — composição revela divergência.
- Detector de chroma/composição na engine: matte lines, spill, descontinuidade de iluminação e ruído entre camadas.
- Captura only-in-app sem upload externo; attestation de integridade.
- Consistência corporal contínua (body estimation) e revisão humana.

### Foto impressa / segundo display no lugar do visor

**Como funciona:** Uma foto impressa, painel e-paper ou segundo celular mostrando um número fixo é posicionado fisicamente sobre/na frente do visor real da balança para o OCR ler o número plantado. Ataque físico, low-tech, sem nenhuma edição de vídeo.

**Como é executado:** O fraudador imprime/exibe o peso desejado num pedaço de papel ou tela pequena com fonte de LCD parecida, cola ou segura sobre o display da balança e grava a pesagem normalmente. O OCR lê o número falso; o resto do vídeo é autêntico.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Display não muda durante zerar→subir→estabilizar (número fixo independe de quem sobe).
- Textura de papel/segundo display: ausência de retroiluminação real de LCD, reflexo de papel fosco, bordas do adesivo/tela, paralaxe entre o "visor" e a carcaça da balança.
- Número não oscila na estabilização; fonte de dígitos sutilmente diferente da balança real do modelo detectado.
- Sombra projetada do papel/tela sobreposta.

**Mitigações:**

- Exigir vídeo da sequência completa zerar→subir→estabilizar com a câmera passando em ângulo sobre o visor (paralaxe revela sobreposição não-coplanar).
- Balança smart BLE/Wi-Fi (Fase 3) como fonte primária do peso — OCR vira apenas confirmação.
- OCR robusto que valida flutuação dinâmica do display e coerência da fonte/modelo da balança; flag se o número é estático antes da subida.
- Cross-check com body estimation e histórico/wearables: número plantado destoa da silhueta e da curva.
- UX: pedir que o usuário toque/incline a balança e o número responda; revisão humana no final.

### Adulteração de metadata, GPS e timestamp do arquivo

**Como funciona:** Reescrita de EXIF/container (data, GPS, modelo de câmera, codec) com exiftool/ffmpeg para fazer um vídeo antigo, de outra origem, ou recapturado parecer gravado AGORA, no LOCAL certo, com o device esperado. Ataca a confiança em metadata como prova de frescor/origem.

**Como é executado:** O fraudador pega um vídeo qualquer e roda exiftool para setar DateTimeOriginal, GPSLatitude/Longitude e Make/Model compatíveis com o aparelho dele; reembala o container com ffmpeg para limpar inconsistências. Submete como se fosse captura legítima do momento.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta (se metadata for confiada) · **Impacto:** médio

**Sinais de detecção:**

- Metadata inconsistente: software tag de exiftool/ffmpeg/Lavf no container; ordem de atoms MP4 não-nativa do device declarado.
- GPS preciso demais/estático, ou divergente do IP/geolocalização de rede e do fuso do timestamp; coordenadas batendo no centroide de cidade.
- Timestamp do arquivo ≠ horário do servidor/desafio; mtime do filesystem vs. EXIF divergentes.
- Codec/bitrate/resolução incompatíveis com o modelo de câmera declarado.

**Mitigações:**

- NÃO confiar em metadata client-side. Frescor e origem vêm do server: nonce/desafio emitido server-side, captura only-in-app, timestamp do servidor no momento do upload.
- Geolocalização autoritativa server-side (IP + sinais do device via SDK), não GPS do EXIF; cruzar com GPS reportado e flagar divergência.
- Gravação nativa assinada pelo SDK (frames + sensores + attestation) — metadata reescrita não reproduz a assinatura.
- Engine valida coerência de container/codec com o device attestado; flag para tags de ferramentas de edição.
- Bloquear upload de arquivo externo; aceitar só stream capturado in-app.

### Recompressão/transcodificação para apagar rastros de edição

**Como funciona:** Após faceswap/composição/edição do visor, o fraudador re-renderiza, faz downscale, adiciona ruído ou regrava por screen capture para destruir artefatos de edição e fingerprints de geração por IA, escapando da forense de mídia. É a etapa de "lavagem" que potencializa todos os vetores acima.

**Como é executado:** Pega o vídeo manipulado, passa por ffmpeg com recompressão agressiva, leve downscale e adição de grão/ruído gaussiano; ou reproduz e regrava (screen-record) para introduzir uma nova geração de codec. O objetivo é apagar bordas de ELA, descontinuidades de PRNU e assinaturas de difusão, deixando um arquivo "sujo" mas homogêneo.

**Sofisticação:** alta · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio (potencializador)

**Sinais de detecção:**

- Dupla/múltipla compressão detectável (double-JPEG/duplo-GOP), bloco DCT inconsistente, qualidade global degradada vs. resolução declarada.
- Ruído adicionado uniforme/sintético em vez de PRNU de sensor; ausência total de fingerprint de sensor real.
- Banding/recapture (se regravado por tela): moiré, taxa de refresh, bezel.
- Bitrate/qualidade incompatíveis com captura direta do device declarado.

**Mitigações:**

- Captura only-in-app com upload do stream original assinado (frames + hash + sensores): qualquer recompressão posterior quebra a assinatura e é rejeitada antes da forense.
- Detector de double-compression/recapture e de "lavagem" na engine; exigir PRNU de sensor coerente com o device attestado.
- Device/integrity attestation + anti-câmera-virtual para impedir reinjeção do arquivo lavado.
- Defesa em profundidade: como a lavagem destrói pistas forenses, ancorar a decisão em controles NÃO-forenses — liveness ativo ao vivo, token dinâmico interativo, balança smart/wearables e plausibilidade fisiológica.
- Revisão humana e política: payouts altos exigem múltiplas fontes independentes (vídeo + balança smart + wearable + curva de check-ins), nunca o vídeo isolado.

### GenAI condicionada à pessoa real: avatar/vídeo do próprio usuário 'magro' respondendo o challenge em tempo real

**Como funciona:** Vetores já listados cobrem deepfake/faceswap sobre corpo emprestado, vídeo 100% gerado e deepfake em tempo real no liveness. A lacuna é a convergência emergente (2025-2026): modelos de geração de vídeo controláveis e em tempo quase-real, condicionados a fotos reais do PRÓPRIO titular, que renderizam o usuário com corpo magro plausível, executando o gesto pedido e mostrando o token — passando simultaneamente em biometria facial (é o rosto real do titular), liveness por challenge (responde ao gesto dinâmico) e body estimation (corpo coerente com a mesma pessoa). Não é corpo emprestado nem rosto trocado: é a mesma identidade, sinteticamente emagrecida.

**Como é executado:** Titular fornece fotos/vídeos reais de si mesmo (consistentes com seu KYC) para fine-tune/condicionamento de um modelo de avatar; pipeline gera em tempo real o avatar magro executando gesto+token conforme o challenge chega; câmera virtual injeta o feed (liga-se ao vetor de feed injetado, mas agora o conteúdo é fotorrealista, identity-consistent e responsivo ao desafio); body morphing aplicado a vídeo real do próprio usuário reduz medidas de forma coerente quadro a quadro. A defesa por liveness ativo e biometria histórica é parcialmente neutralizada porque a identidade é genuína.

**Probabilidade:** baixa | **Impacto:** alto | **Sofisticação:** alta

**Sinais de detecção:**

- Artefatos de síntese temporal: inconsistência de iluminação/sombra entre corpo e ambiente real, física de cabelo/roupa, oclusão da balança
- Latência de resposta ao challenge ligeiramente fora da janela humana (render em tempo real ainda custa)
- Ausência de micro-sinais físicos reais: deformação do colchão/piso ao subir na balança, reflexo do visor, vapor/respiração, PPG facial (rPPG) inconsistente com pessoa real
- Coerência impossível entre peso numérico do visor (OCR) e física da cena (não há massa real interagindo com a plataforma)
- Attestation: presença de câmera virtual/feed injetado, root, hooking
- Frame-level forensics / detector de geração (modelo anti-deepfake) sobre a stream

**Mitigações:**

- Provar INTERAÇÃO FÍSICA com o mundo, não só a imagem: exigir momentos que GenAI não modela bem — colocar objeto na balança e mostrar o delta de peso, sequência imprevisível de subir/descer com leituras coerentes, manipular a própria balança
- Fase 3 como âncora forte: peso absoluto de balança smart pareada + dados de wearable corroborando atividade/biometria tornam a cena sintética insuficiente sozinha
- Liveness com sinais difíceis de sintetizar em tempo real: rPPG (pulso facial), challenge multimodal rápido, reflexos especulares
- Attestation rígida + bloqueio de câmera virtual/feed injetado como pré-condição (defesa na origem do feed)
- Challenge que acopla peso e gesto fisicamente (ex.: segurar peso conhecido e mostrar leitura mudar) — desacoplar imagem de física fica impossível para o gerador
- Detector de mídia sintética atualizado continuamente; roteamento automático para revisão humana de qualquer payout alto com score de síntese não-trivial
- Comprovação multi-momento espaçada no tempo aumenta o custo de manter o pipeline de geração consistente em todas as sessões

_(identificado na revisão de completude)_

---

## 5. Spoofing digital: app, câmera e sensores (balança smart, wearables, API)

_14 vetores nesta categoria._

### Câmera virtual / feed injetado (root, emulador, OBS/VCam)

**Como funciona:** O app espera receber frames de uma câmera física real (CameraX / AVFoundation), mas um driver de câmera virtual se interpõe entre o hardware e o app e entrega um vídeo pré-produzido. Como o token dinâmico (código + palavra + gesto) é exibido na UI do app, o fraudador não pode pré-gravar o vídeo às cegas: ele precisa de um pipeline que leia o token em tempo real e injete um clipe que "responda" a ele. Em ataques low-tech isso é o operador filmando manualmente; em ataques sofisticados é compositing/deepfake em tempo real alimentando a câmera virtual. O OCR lê o peso do vídeo injetado, a face bate com o KYC (porque é a face real do apostador, só que em vídeo manipulado), e a engine recebe um arquivo plausível.

**Como é executado:** No Android, root + módulo Magisk/HAL falso ou um app de câmera virtual registra um dispositivo `/dev/videoX` (ou substitui o provider de Camera2) que entrega frames de um arquivo/stream. No iOS, jailbreak + tweak de AVFoundation ou uso de Mac com Continuity Camera + software tipo OBS Virtual Camera. O fraudador grava previamente várias tomadas suas (de frente, de lado, mão direita/esquerda erguida, balança zerando, subindo, visor com peso-alvo) e monta um "kit". Ao iniciar a pesagem no Charya, ele lê o token na tela, seleciona o clipe correspondente ao gesto sorteado e digita/sobrepõe o código e a palavra dinâmica via overlay (ou um operador segura um cartão com o código diante do clipe). O visor da balança exibido é uma imagem editada com o peso desejado.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Ausência de jitter/sensor noise real: frames "limpos demais", sem micro-tremor de mão, sem variação de exposição/AWB ao mover a câmera.
- Latência entre a exibição do token e a resposta gestual maior do que o humanamente esperado (tempo para o operador trocar o clipe).
- Metadados/EXIF e características do encoder inconsistentes com a câmera nativa declarada (codec, GOP, color profile, ausência de frames descartados típicos da câmera real).
- Sinais de câmera virtual no SO: presença de drivers/HAL não-padrão, `package` de OBS/ManyCam/VCam instalado, número anômalo de câmeras enumeradas.
- Acelerômetro/giroscópio parados ou descorrelacionados do movimento visível no vídeo (a "câmera" se move na imagem mas o IMU não registra).
- Reuso de fundo/iluminação idêntico entre baseline, intermediária e final (mesma cena pré-gravada).

**Mitigações:**

- Captura SOMENTE in-app com pipeline próprio (CameraX/AVCapture), proibindo seleção de fonte de câmera; bloquear `EXTERNAL`/virtual cameras e recusar quando mais de uma câmera lógica suspeita for enumerada.
- Liveness ativo de terceiros (Onfido/iProov/FaceTec) executado DENTRO do mesmo stream da pesagem, com challenge-response do próprio fornecedor (flash de cor na tela refletido no rosto / movimento randômico) que um clipe pré-gravado não consegue acompanhar.
- Correlação multissensor obrigatória: gravar IMU (acelerômetro/giroscópio) sincronizado com o vídeo e validar na engine que o movimento óptico bate com o movimento físico; câmera virtual não move o IMU.
- Token dinâmico com janela curta (ex.: gesto + palavra mudam a cada 8–12s) e ordem de gestos sorteada em tempo real pelo backend, forçando resposta ao vivo e estreitando a janela para troca manual de clipes.
- Play Integrity / App Attest + detecção de root/jailbreak; device comprometido cai para revisão humana obrigatória e payout retido.
- Engine: detector de "tela filmada/feed injetado" (moiré, banding, bordas de overlay, planaridade do visor) e comparação de fundo/iluminação entre os 3 check-ins.
- UX: flash de cor randômico emitido pela tela durante a captura (frame-locked) cuja reflexão é validada — barato e quebra a maioria dos feeds injetados.

### App repackado / patcheado

**Como funciona:** O fraudador descompila o APK/IPA, neutraliza as checagens client-side (root detection, integridade, exigência de captura contínua, validação de token, anti-emulador) e recompila. A versão modificada pode aceitar upload de um arquivo de vídeo arbitrário no lugar do feed ao vivo, ou simplesmente pular etapas e enviar ao backend o estado "pesagem aprovada". Funciona porque toda lógica e confiança que mora no cliente é, por definição, controlável pelo atacante.

**Como é executado:** Baixa o APK (da loja ou de mirror), decompila com apktool/jadx, localiza as funções de captura e validação, aplica smali patches ou força flags (`isLive=true`, `rootDetected=false`), reassina com chave própria e instala via sideload. Variante comum: trocar o `CameraProvider` por um `FilePicker`, permitindo enviar um MP4 montado offline com calma (incluindo token sobreposto, já que o app modificado pode revelar/registrar o token antes). Distribui-se o "Charya mod" em grupos de Telegram, transformando um exploit em serviço.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Assinatura do app diferente da chave oficial; package name/cert hash divergente no attestation.
- Play Integrity falha em `MEETS_STRONG_INTEGRITY`/`ctsProfileMatch`; App Attest com chave não reconhecida.
- Versão de build/checksum do binário não consta na allowlist do backend.
- Vídeo sem os sinais de captura ao vivo que o app legítimo carimba (ver token criptográfico abaixo).
- Telemetria ausente: o app legítimo emite eventos contínuos (heartbeat, sensores) que a build modificada não reproduz fielmente.

**Mitigações:**

- Server-authoritative: o backend NUNCA confia em "aprovado" vindo do cliente; toda decisão de validade do peso é tomada no servidor a partir do artefato bruto (vídeo + sensores), não de flags.
- Play Integrity API + App Attest/DeviceCheck obrigatórios, com allowlist de assinatura/cert e checksum do binário; build não-oficial → bloqueio de submissão e retenção.
- Token de captura assinado: o backend emite um nonce por sessão; o app legítimo carimba frames com HMAC(nonce, frame-derived data) usando chave protegida (Android Keystore/Secure Enclave, idealmente com attestation de hardware). Vídeo sem carimbo válido é rejeitado.
- Proibir upload de arquivo: a API de submissão só aceita stream originado da sessão de captura (sessão server-side com TTL curto), não um blob solto.
- Obfuscação (R8/ProGuard, iXGuard/DexGuard) e RASP para elevar o custo do repackaging — não é defesa única, mas encarece.
- Revisão humana para qualquer device fora da allowlist de integridade em payouts acima de limiar.

### Hooking em runtime (Frida/Xposed/Magisk)

**Como funciona:** Sem alterar o APK em disco, o atacante injeta código em tempo de execução (Frida/Objection, Xposed/LSPosed, módulos Magisk) e intercepta métodos: força o retorno do OCR para o peso desejado, faz a função de root-check retornar `false`, sobrescreve o resultado do liveness para "passou", ou substitui o valor lido do visor antes de ser empacotado. Burla verificações de ambiente "por dentro", sendo mais furtivo que o repackaging porque o binário continua íntegro no disco.

**Como é executado:** Device rooted/jailbroken com `frida-server` ou Magisk. O atacante mapeia os métodos-alvo (ex.: a função que recebe o resultado do OCR, ou `isSecureEnvironment()`), escreve um script Frida que faz hook e força os retornos, e roda a pesagem normalmente com o ambiente "mentindo" para o app. Combina com Magisk Hide/Shamiko para esconder root das próprias checagens.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Presença de `frida-server`, portas de debug (27042), bibliotecas injetadas, `gum-js-loop`/threads anômalas, `ptrace` no processo.
- Módulos Xposed/LSPosed/Magisk e hooks detectáveis em métodos sensíveis (checksum de código em memória divergente).
- Inconsistência peso OCR vs. peso re-extraído no servidor a partir do mesmo vídeo (o cliente diz 78kg, o OCR server-side lê 92kg).
- Play Integrity rebaixado e tempos de execução de funções fora do baseline.

**Mitigações:**

- OCR de peso é AUTORIDADE DO SERVIDOR: o valor exibido no app é meramente informativo; o peso oficial é re-extraído server-side do vídeo bruto. Hook no OCR client-side torna-se irrelevante.
- Liveness verdict vem do FORNECEDOR (server-to-server), não do device: Charya consulta o resultado direto na API do Onfido/iProov, não confia em "passou" reportado pelo app.
- Anti-hooking/RASP: detecção de Frida/Xposed/`ptrace`, integrity check de código em memória, certificate transparency; sinal de hooking → sessão invalidada e flag de fraude.
- Hardware attestation (Keystore/Secure Enclave) para o carimbo de captura, dificultando forjar a assinatura mesmo com hooking em camada Java/JS.
- Engine comportamental cruza o peso reivindicado com plausibilidade fisiológica e com wearables/balança smart — um valor forçado fora de curva dispara revisão humana.

### Requisições diretas ao backend (pular o app)

**Como funciona:** O fraudador faz engenharia reversa da API, extrai endpoints, esquema de payload e segredos embutidos, e envia diretamente uma requisição de "pesagem aprovada" sem rodar o fluxo real de captura. É o vetor mais fatal se a confiança estiver no cliente: nenhum vídeo, token ou liveness chega a existir — só um POST bem formatado.

**Como é executado:** Captura o tráfego do app (com pinning bypassado), mapeia a sequência de chamadas (criar sessão → enviar mídia → confirmar resultado), e reconstrói o request final com um cliente HTTP próprio, preenchendo campos de peso/aprovação. Se houver chave de API ou segredo estático no binário, extrai com jadx/strings e assina o request. Pode automatizar dezenas de contas.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Submissão de resultado SEM artefato bruto correspondente (não há vídeo+sensores na sessão, ou o vídeo não tem carimbo válido).
- Sessão sem os eventos intermediários esperados (start de captura, frames, heartbeat, telemetria de sensores).
- Cadência/sequência de chamadas atípica, headers de cliente não-oficial, ausência de attestation token válido no request.
- Mesma chave/segredo usada de múltiplos IPs/devices.

**Mitigações:**

- Zero trust no cliente: a aprovação do peso NÃO existe como campo enviável; o veredito é computado no servidor a partir do vídeo bruto + liveness do fornecedor + sensores. Não há "POST aprovado=true" a forjar.
- Toda submissão exige (a) sessão server-side válida e não expirada, (b) attestation token (Play Integrity/App Attest) por request, (c) carimbo HMAC com chave de hardware. Falta de qualquer um → rejeição.
- Sem segredos estáticos no binário; autenticação por mTLS/OAuth com tokens de curta duração ligados ao device atestado.
- Exigir que a mídia bruta tenha sido enviada pela própria sessão e validada (liveness + OCR server-side) antes de qualquer cômputo de payout.
- Rate limiting + detecção de anomalia por device/IP/conta; revisão humana para padrões automatizados.

### MITM / replay de pacote de rede

**Como funciona:** Com pinning contornado, um proxy (Burp/mitmproxy) captura o tráfego de uma pesagem legítima e o reenvia ou edita — reaproveitando um liveness aprovado de outra sessão, trocando o peso no payload, ou repetindo a confirmação de uma sessão válida em outra conta/meta. Explora ausência de binding entre o resultado de liveness/OCR e a sessão específica.

**Como é executado:** Instala CA própria, faz bypass de pinning (Frida/objection), grava uma pesagem real bem-sucedida, e então: (i) replay puro da requisição de confirmação; ou (ii) edita campos (peso, sessionId) antes de reenviar; ou (iii) "costura" o token de liveness aprovado de uma sessão A no fluxo de uma sessão B.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Nonce/sessionId reutilizado, timestamp fora da janela, ou liveness token associado a outra sessão/usuário.
- Mesmo artefato de mídia (hash idêntico) submetido mais de uma vez.
- CA não-confiável / falha de pinning logada pelo app; geo/IP do request divergente do device.

**Mitigações:**

- Binding criptográfico forte: cada sessão tem nonce único do servidor; liveness verdict, OCR e vídeo são amarrados ao mesmo `sessionId` e usuário no servidor. Token de liveness de outra sessão não cola.
- Anti-replay: nonce de uso único, timestamps assinados, idempotency keys; rejeitar hash de mídia já visto.
- Certificate pinning robusto + verificação server-side de Play Integrity por request (não só no login).
- Liveness consultado server-to-server no fornecedor por `sessionId` — o app não "carrega" o veredito, o backend o busca.
- Detecção de mídia duplicada (perceptual hash) entre check-ins e entre contas.

### Bypass de certificate pinning + attestation fraca

**Como funciona:** Frida/objection removem o pinning e Magisk Hide/Shamiko escondem root, fazendo um device comprometido se reportar como íntegro. Se a attestation for fraca (só checagem local de root, sem Play Integrity de hardware), o backend acredita que o ambiente é confiável e libera o fluxo — habilitando todos os vetores acima.

**Como é executado:** Root via Magisk + Shamiko/DenyList para esconder de detectores; objection/Frida para `unpinning` em runtime; spoof de propriedades do device. Em iOS, jailbreak + tweaks anti-detecção. O objetivo é apresentar um veredito de integridade verde sem realmente ser íntegro.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Play Integrity retorna apenas `MEETS_BASIC_INTEGRITY` (sem `STRONG`), ou veredito inconsistente com hardware backing.
- Discrepância entre checagem local (diz "limpo") e veredito server-side do Google/Apple.
- Bootloader desbloqueado, propriedades do build adulteradas, presença de DenyList/Shamiko detectável.

**Mitigações:**

- Exigir hardware-backed attestation: Play Integrity API com veredito processado SERVER-SIDE (nonce do servidor, validação da assinatura do Google) e App Attest/DeviceCheck no iOS; nunca confiar em root-check local como única barreira.
- Política de risco por tier de integridade: `STRONG` → fluxo normal; `BASIC`/falha → revisão humana obrigatória + holds de payout, especialmente em valores altos.
- Key Attestation do Android Keystore para o carimbo de captura, garantindo que a chave reside em hardware seguro.
- Pinning + monitoramento de falhas de pinning como sinal de fraude (não só erro técnico).
- Defesa em profundidade: mesmo com ambiente "verde", a validade do peso ainda depende de liveness do fornecedor + OCR server-side + plausibilidade fisiológica.

### Emulador com câmera e sensores simulados

**Como funciona:** O app roda em emulador (Genymotion, BlueStacks, AVD, corellium no iOS) onde câmera, GPS, acelerômetro, giroscópio e relógio são alimentados por arquivos de configuração. O fraudador injeta um "feed de câmera" (vídeo) e sensores coerentes, criando um ambiente totalmente controlado para responder ao token sem hardware físico real.

**Como é executado:** Instala o app no emulador, configura a câmera virtual apontando para um MP4 montado, define GPS fixo no Brasil, e (em emuladores avançados) injeta séries de acelerômetro plausíveis. Roda o fluxo de pesagem com tudo simulado. Escala bem para fraude em massa (várias instâncias).

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Fingerprints de emulador: hardware/`Build.FINGERPRINT` genéricos (goldfish/ranchu), ausência de sensores reais ou valores "perfeitos demais", bateria sempre 100%/carregando, ausência de variação térmica.
- Play Integrity falha (emulador não obtém `STRONG`/`ctsProfileMatch`).
- IMU sem ruído natural; câmera com feed plano e sem características de sensor físico.
- Telemetria de toque/UX não-humana, GPS estático com precisão irreal.

**Mitigações:**

- Play Integrity/App Attest barram a maioria dos emuladores (não passam em hardware attestation) → bloqueio ou revisão obrigatória.
- Detecção de emulador (fingerprints de build/sensores/hardware) na engine; sinal de emulador invalida a captura.
- Exigir ruído de sensor realista e correlação IMU↔vídeo (emuladores raramente reproduzem ruído físico convincente).
- Validar consistência de device entre os 3 check-ins (mesmo device atestado) e plausibilidade fisiológica do peso.
- Revisão humana para qualquer sessão com sinal de virtualização.

### Spoof de balança inteligente BLE/Wi-Fi (Fase 3)

**Como funciona:** Na Fase 3, o Charya lê peso de balanças smart suportadas (Mi Scale, Withings) via BLE GATT / API. Um fraudador emula o protocolo GATT da balança em software (peripheral BLE simulado) e transmite leituras de peso falsas, sem nunca pisar numa balança física. O app "confia" no número que veio do device pareado.

**Como é executado:** Usa um adaptador BLE (ou app/firmware ESP32/nRF) configurado para anunciar os UUIDs de serviço/característica da balança alvo e emitir notificações com o payload de peso desejado, replicando o formato (ex.: weight measurement characteristic). Pareia com o app e "pesa" o valor que quiser; pode escriptar uma curva descendente ao longo das semanas.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Identificadores do device BLE (MAC/firmware/serial) não-registrados ou inconsistentes entre check-ins; peso "limpo" sem o ruído natural de impedância/oscilação de uma pesagem real.
- Ausência dos dados secundários que a balança real envia (impedância/bioimpedância, batimento, composição corporal) ou valores fisiologicamente incoerentes.
- Peso da balança BLE divergente do peso lido no vídeo/OCR da mesma sessão.

**Mitigações:**

- NUNCA usar a balança smart como prova única: ela é sinal CORROBORANTE do vídeo+OCR+token, não substituto. O peso oficial vem do vídeo verificado.
- Exigir pareamento via API oficial do fabricante (Withings Health API, conta na nuvem) em vez de BLE direto sempre que possível — autenticação server-to-server é mais difícil de spoofar que GATT local.
- Vincular o serial/firmware da balança à conta e validar consistência entre os 3 check-ins; device novo a cada pesagem = flag.
- Cruzar bioimpedância/composição corporal com a perda reivindicada (plausibilidade fisiológica).
- Pesagem "ao vivo": exigir que a leitura da balança chegue DENTRO da sessão de vídeo (subida na balança filmada coincidindo no tempo com a notificação BLE), correlacionando os dois canais.
- Para payouts altos, balança smart não dispensa o vídeo com token + revisão humana.

### Injeção de peso falso no Apple Health / Health Connect

**Como funciona:** Na Fase 3, o Charya lê a série de peso do HealthKit (iOS) ou Health Connect (Android). Como qualquer app autorizado pode ESCREVER nesses repositórios, o fraudador grava uma série descendente "realista" de pesos via API, e o Charya lê uma evolução fabricada como se viesse de uma balança real. O repositório de saúde é um banco de dados editável, não uma fonte de verdade.

**Como é executado:** Escreve um app/script simples (ou usa apps existentes de "adicionar peso manual") que insere `HKQuantitySample`/registros de Weight com datas retroativas e uma curva suave (ex.: 95→88→82kg ao longo de 8 semanas). Pode marcar a origem como um device plausível. O Charya, ao sincronizar, vê histórico consistente.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- `sourceRevision`/`HKSource` dos samples = app de terceiros ou entrada manual, não uma balança/fabricante reconhecido; `wasUserEntered = true`.
- Curva "perfeita demais": variância diária irreal, ausência de oscilações fisiológicas (retenção hídrica, fim de semana), timestamps em horários improváveis ou inseridos em lote.
- Samples com `startDate` retroativo mas `creationDate` recente (tudo escrito de uma vez).
- Divergência entre série do Health e o peso medido no vídeo/balança vinculada.

**Mitigações:**

- Tratar HealthKit/Health Connect como sinal CORROBORANTE, nunca como prova de payout. A prova é o vídeo com token + OCR server-side.
- Filtrar por procedência: aceitar apenas samples cujo `source` seja um device/fabricante de balança reconhecido e vinculado à conta; descartar entradas manuais e de apps não-confiáveis.
- Inspecionar metadados: rejeitar séries com `creationDate` em lote, `wasUserEntered=true`, ou curva sem ruído fisiológico.
- Cross-check obrigatório: a série do Health deve convergir com os 3 pesos do vídeo verificado; divergência > tolerância → flag.
- Engine de plausibilidade fisiológica sobre a curva (taxa de perda, padrão de oscilação) + revisão humana em payouts altos.

### Falsificação de dados de wearable (passos/atividade)

**Como funciona:** Para fabricar um histórico de atividade coerente com a perda de peso reivindicada (sustentando a narrativa de que "treinou e perdeu de verdade"), o fraudador injeta passos, calorias e batimentos falsos no Garmin Connect/Apple Health, inclusive via upload de arquivos `.FIT` forjados. Visa enganar o score comportamental e os sinais corroborantes da engine.

**Como é executado:** Gera/edita arquivos `.FIT`/GPX com treinos plausíveis (corridas, distância, HR) e faz upload no Garmin Connect, ou usa apps que escrevem passos/HR no Apple Health. Pode usar "treadmill/shaker" físico para gerar passos, ou simuladores. Distribui a atividade ao longo do prazo para parecer um cronograma real de emagrecimento.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- `.FIT`/atividades com assinatura de upload manual ou device não-vinculado; HR sem variabilidade fisiológica (HRV chapada), cadência/pace constantes demais.
- GPS de treinos ausente, repetido ou incoerente; calorias que não fecham com a perda de peso (impossibilidade energética).
- Passos inseridos em blocos, fora de horários plausíveis, ou volume incompatível com check-ins anteriores.
- Atividade que aparece toda de uma vez perto do payout.

**Mitigações:**

- Atividade de wearable é sinal SECUNDÁRIO/comportamental, jamais prova de peso; ela ajusta o score de risco, não libera payout.
- Vincular via OAuth oficial (Garmin/Apple Health/Health Connect) e aceitar só dados de device pareado; rejeitar upload `.FIT` avulso ou origem manual.
- Conferência energética na engine: a perda de peso reivindicada precisa ser consistente com o balanço calórico plausível dado o histórico; incoerência = flag (não bloqueio, mas peso menor na decisão).
- Detectar padrões não-humanos (HRV nula, cadência constante, atividade em lote) e descorrelação entre wearable e os check-ins de vídeo.
- Não permitir que "bom histórico de atividade" compense ausência de vídeo verificado; é apenas corroborante.

### GPS spoofing da geolocalização

**Como funciona:** As 3 pesagens carregam geolocalização para checar consistência (mesma pessoa, locais plausíveis, não pesagens espalhadas pelo mundo indicando contas/operadores diferentes). Com mock location (Developer Options/Magisk), o fraudador mascara inconsistências geográficas ou fabrica uma consistência falsa (todas "do mesmo endereço"), neutralizando esse sinal antifraude.

**Como é executado:** Ativa "permitir locais fictícios" + app de mock location, ou módulo Magisk que injeta coordenadas no nível do sistema, fixando um ponto no Brasil para todas as sessões. Em fraude coordenada (várias contas/operadores), uniformiza a geo para esconder a dispersão real.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Flag `isFromMockProvider`/mock location ativo; coordenadas idênticas ao decimal entre sessões (GPS real tem deriva natural).
- Incoerência GPS vs. IP vs. timezone vs. rede móvel/Wi-Fi; "teletransporte" impossível entre check-ins.
- Precisão/altitude irreais, ausência de variação de satélites/sinal.

**Mitigações:**

- Tratar geo como sinal de PLAUSIBILIDADE, não prova; nunca decisivo sozinho, mas alimenta o score de risco.
- Detectar mock location (Android `isFromMockProvider`, ausência em ambiente atestado) e triangular GPS contra IP, timezone do device, e rede; divergência → flag.
- Validar consistência de device atestado entre os 3 check-ins (mesmo device/conta) — geo uniforme com devices diferentes é suspeito.
- Manipulação de mock location reforçada por Play Integrity (device com mock+root cai de tier).
- Revisão humana correlaciona geo com horário do token e metadados do vídeo.

### Manipulação do relógio do device

**Como funciona:** O token dinâmico e os metadados carregam timestamp para garantir que o vídeo foi feito ao vivo, dentro da janela do desafio e dentro do prazo da aposta. Alterando data/hora do sistema ou desativando o NTP, o fraudador forja o timestamp: faz um vídeo fora da janela parecer dentro do prazo, ou "recua o relógio" para reaproveitar um token/clipe antigo.

**Como é executado:** Desativa "data e hora automáticas", desliga sincronização NTP e ajusta manualmente o relógio para o instante desejado; em device rooted, pode interceptar chamadas de tempo. Assim, EXIF/metadados e o timestamp embutido no vídeo batem com a janela exigida mesmo que a gravação seja antiga ou tardia.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Divergência entre o horário do device e o horário do servidor no momento do request (drift anômalo).
- Timestamp do token (emitido pelo servidor) inconsistente com o tempo real de submissão; NTP desativado.
- EXIF/`creationDate` da mídia incoerente com o recebimento server-side; timezone do device manipulada.

**Mitigações:**

- NUNCA confiar no relógio do device: o token e a janela do desafio são governados por timestamp do SERVIDOR. O nonce/token tem TTL curto validado server-side; vídeo recebido fora da janela = rejeição, independente do que o device diz.
- Carimbar a captura com tempo do servidor (token assinado com expiração) e medir o round-trip; recusar se o tempo de submissão exceder a janela.
- Detectar relógio manual/NTP off e drift device-vs-servidor como sinal de fraude.
- Amarrar prazo da aposta a datas server-side; o "prazo cumprido" é avaliado pelo servidor, não pelo timestamp local.
- Anti-replay (nonce de uso único) impede reaproveitar token antigo mesmo com relógio recuado; revisão humana para drift suspeito em payouts altos.

### Comprometimento do segredo/seed de geração do token dinâmico

**Como funciona:** O token dinâmico (código + palavra + timestamp + gesto) só é antirreplay se for imprevisível para o atacante. Se a lógica de geração roda client-side, ou se o segredo/seed que deriva o token é extraível, o fraudador pode PREVER o token antes de o servidor pedir, pré-gravar/pré-renderizar a resposta correta e derrotar todo o mecanismo challenge-response — sem MITM do canal, apenas conhecendo o gerador.

**Como é executado:** Reverse engineering do app revela que código+palavra+gesto são gerados localmente (PRNG previsível, seed em tempo do device, lista de palavras/gestos embarcada no binário); extração da seed via Frida/dump de memória; descoberta de que o conjunto de gestos é pequeno e enumerável (impede deepfake genérico mas permite pré-gravar todos os gestos possíveis e fazer splice); relógio do device manipulado para forçar timestamp previsível; se houver fallback offline, o token é gerado sem servidor e pode ser forjado.

**Probabilidade:** baixa | **Impacto:** alto | **Sofisticação:** alta

**Sinais de detecção:**

- Resposta ao token rápida demais (latência menor que o tempo humano de ler+executar gesto)
- Token correto mas exibido antes do timestamp do challenge server-side (impossível se gerado no servidor)
- Mesmos gestos/palavras recorrendo em contas distintas em janela curta (enumeração)
- Tentativas de leitura de memória/hooking detectadas por attestation
- Divergência entre relógio do device e relógio do servidor no momento do challenge

**Mitigações:**

- Token gerado EXCLUSIVAMENTE server-side e entregue just-in-time; nada de geração ou seed no cliente
- Espaço de gestos+palavras grande o suficiente e combinatório (sequência de N gestos em ordem aleatória) para inviabilizar pré-gravação exaustiva
- Token vinculado a nonce de servidor + relógio de servidor; rejeitar respostas com latência fora da janela humana plausível (nem rápido demais, nem lento demais)
- Sem modo offline para pesagem comprovada; se sem rede, sessão fica pendente, nunca auto-aprovada
- Rotação periódica do dicionário de palavras/gestos; gestos novos introduzidos para quebrar bancos de vídeo pré-gravados
- Attestation forte (Play Integrity/App Attest) como pré-condição para emitir o token

_(identificado na revisão de completude)_

### Probing adversarial da engine para mapear thresholds e operar logo abaixo do flag

**Como funciona:** A engine comportamental/de plausibilidade decide com base em limiares (ex.: 18kg/20 dias = flag). Um atacante metódico trata a engine como oráculo: submete check-ins de sondagem para inferir ONDE estão as fronteiras de decisão (quanto de perda por dia passa, qual variação de body composition aceita, qual janela de horário não levanta suspeita) e então calibra a fraude para ficar SEMPRE logo abaixo do flag. Não quebra a verificação — aprende o detector e o evade por design. É o ataque que mais ameaça a filosofia 'tornar fraude inviável na média', porque o atacante migra para a cauda aceitável.

**Como é executado:** Criação de contas-sonda descartáveis para observar quando dá flag vs. quando passa; submissões repetidas variando uma feature por vez (perda/dia, velocidade, horário, intervalo entre pesagens) para reconstruir as fronteiras; compartilhamento dos limiares descobertos via 'método' (liga-se ao vetor de fraude-as-a-service); fracionamento da fraude em múltiplos check-ins pequenos abaixo do limiar em vez de um salto detectável; observação de quais combinações disparam revisão humana para evitá-las.

**Probabilidade:** média | **Impacto:** médio | **Sofisticação:** alta

**Sinais de detecção:**

- Muitas contas com resultados 'colados' logo abaixo dos thresholds conhecidos (distribuição com pico suspeito junto à fronteira)
- Contas-sonda: cadastro, poucos check-ins anômalos, abandono, sem aposta real
- Sequências de submissões variando sistematicamente uma única variável
- Mesma rede/device gerando padrões de teste de fronteira

**Mitigações:**

- Não expor o motivo do flag ao usuário; mensagens genéricas para negar feedback de oráculo ao atacante
- Thresholds estocásticos/randomizados e em ensemble (não um corte fixo conhecível); fronteiras móveis ao longo do tempo
- Detecção de anomalia sobre a distribuição populacional: pico de casos 'logo abaixo do limiar' é em si um sinal
- Rate-limit de sondagem: penalizar contas que reenviam variações; ligar abandono-e-recriação à mesma identidade
- Defense-in-depth: nenhuma decisão de payout depende de um único limiar conhecível; revisão humana amostral aleatória mesmo em casos 'aprovados'
- Modelos comportamentais holísticos (graph + histórico + device) que não podem ser evadidos ajustando uma feature isolada

_(identificado na revisão de completude)_

---

## 6. Derrota de OCR, token dinâmico, gesto e liveness

_15 vetores nesta categoria._

### Adesivo/overlay físico de dígitos no visor

**Como funciona:** O fraudador cola adesivo, película recortada ou fita com dígitos impressos (ou um pequeno e-paper/segmento) sobre o display digital da balança. O vídeo é 100% legítimo — rosto real, corpo real, gesto real, token real, balança física real — mas o número que o OCR lê no visor foi adulterado fisicamente. Ataca exatamente o elo mais fraco: a confiança de que "o que aparece no visor é o que a balança mediu". Funciona tanto para inflar o peso inicial quanto para reduzir o peso final.

**Como é executado:** O fraudador imprime dígitos no mesmo tom/fonte de um display de 7 segmentos (LCD/LED), recorta e fixa sobre os dígitos reais; em variações low-tech usa fita transparente com número impresso ou cobre apenas 1-2 dígitos críticos. Para o baseline, infla (ex.: marca 112,0 em vez de 98,0); na pesagem final, reduz. Grava o vídeo contínuo normalmente, mostrando o token, fazendo o gesto e subindo na balança, sabendo que o OCR vai ler o número falso colado. Em balanças com retroiluminação, usa película semitransparente para casar o brilho do fundo.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Dígitos sem o "ghosting"/segmentos apagados típicos do 7-segmentos (um LCD real mostra fracamente os segmentos inativos do "8"); número impresso costuma ser "perfeito demais".
- Bordas, sombra de relevo, brilho/reflexo inconsistente sobre a área dos dígitos vs. resto do visor; reflexo da luz ambiente não percorre o número.
- Peso que não muda micro-oscilações ao subir/estabilizar (balança real oscila décimos antes de travar); número estático desde o frame em que o visor aparece.
- Inconsistência entre peso exibido e estimativa de massa corporal por visão computacional (body estimation, Fase 2).
- Mesma balança com fonte/posição de dígitos diferente entre check-ins do mesmo usuário.

**Mitigações:**

- Exigir no roteiro de captura um "zero dinâmico": o usuário deve filmar a balança ligando/zerando e, em seguida, a oscilação dos dígitos durante a subida — overlay estático não reproduz a transição numérica nem o settling.
- OCR + classificador de display: além de ler o número, validar que é um 7-segmentos legítimo (presença de segmentos fantasma, geometria de segmento, anti-aliasing do LCD vs. impressão). Treinar detector de "overlay/adesivo" como sinal antifraude.
- Cross-check fisiológico na Engine Charya: variação de baseline para final fora de plausibilidade gera flag; baseline muito alto vs. body estimation/altura declarada também.
- Fase 3: balança smart com leitura BLE/Wi-Fi do peso direto do firmware — o número não vem do visor filmado, eliminando o vetor. Para usuários sem balança smart, aplicar revisão humana reforçada em payouts altos.
- Política: exigir a mesma balança (modelo/serial visível) nos 3 momentos e comparar visualmente o display entre check-ins.

### Balança de brinquedo/protótipo com display arbitrário

**Como funciona:** O fraudador substitui o display original por um módulo de 7 segmentos controlado por Arduino/ESP32, ou usa uma balança "falsa" (protótipo/brinquedo) que exibe qualquer número via controle remoto. O objeto parece uma balança real no vídeo, o usuário sobe nela de verdade e faz o gesto/token, mas o peso mostrado é arbitrário e programável — inclusive pode simular oscilação e settling para parecer legítimo.

**Como é executado:** Monta-se um gabinete com aparência de balança digital comum (as mais vendidas no Brasil, de vidro temperado) e dentro coloca-se microcontrolador + display, acionado por botão/Bluetooth para mostrar o peso desejado e até animar a "pesagem". Para vídeo inicial, marca peso alto; final, peso baixo. Como há corpo, rosto, token e gesto reais, todas as checagens de liveness e presença passam — só o número é fabricado, e com settling animado derrota até a checagem de oscilação.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Modelo de balança não identificável/banco de modelos conhecidos; ausência de marca, certificação INMETRO, ou layout de display atípico.
- Comportamento de pesagem "perfeito" demais ou repetível idêntico (settling sempre igual ao milissegundo) entre sessões.
- Inconsistência peso x body estimation; peso não correlaciona com wearable/balança smart histórica.
- Mesma "balança" exibindo pesos com saltos fisiologicamente impossíveis entre check-ins.

**Mitigações:**

- Onboarding da balança: na primeira pesagem, capturar marca/modelo/serial e foto da etiqueta inferior (selo INMETRO); manter no perfil e exigir a mesma nos 3 momentos.
- Body estimation (Fase 2) como sanity-check independente do display: estimativa de massa por visão computacional precisa estar coerente com o número lido (tolerância calibrada).
- Fase 3: priorizar fortemente balança smart com handshake criptográfico (peso assinado pelo firmware via BLE), tornando o display filmado irrelevante; wearables (Garmin/Apple Health/Health Connect) como sinal cruzado de tendência.
- Engine comportamental: flag para qualquer usuário cuja prova dependa exclusivamente de display filmado em payouts acima de limiar -> revisão humana obrigatória.
- Pedido aleatório de "prova de carga": subir/descer um objeto de peso conhecido (ex.: garrafa de água cheia) durante o vídeo e verificar se o delta no visor é plausível — balança falsa programada não reage corretamente a carga não roteirizada.

### Segundo device disfarçado de visor da balança

**Como funciona:** Em vez de adulterar a balança, o fraudador enquadra um segundo aparelho (smartphone, tablet, calculadora) exibindo um número grande, posicionado/recortado para parecer o visor da balança no vídeo. O OCR lê esse "display" externo, não uma pesagem real. O usuário pode até estar sobre uma balança real, mas a câmera é guiada para ler a tela do segundo device.

**Como é executado:** Posiciona-se um celular pequeno exibindo o número em fonte de 7 segmentos no local onde estaria o visor (ou na frente dele), e enquadra-se o vídeo para que a região do OCR caia sobre essa tela. Faz token, gesto e subida normalmente. Pode usar app que imita display de balança com settling animado. O usuário controla qual número o OCR captura, descolando totalmente do peso real.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Assinatura de tela emissiva: cintilação/PWM, padrão sub-pixel RGB, moiré e refresh-rate visíveis em alguns frames (um LCD de balança reflexivo não emite luz própria da mesma forma).
- Reflexos/brilho de tela de smartphone, bordas de bezel, ou proporção de dígitos atípica para o modelo de balança.
- Visor "flutuando" sem integração física com o corpo da balança; paralaxe inconsistente quando a câmera se move.
- Enquadramento que evita mostrar o visor e o corpo da balança no mesmo plano contínuo.

**Mitigações:**

- Roteiro de captura com plano contínuo obrigatório que mostre balança INTEIRA + pés sobre a plataforma + visor no MESMO frame, sem corte de enquadramento isolando o display.
- Detector de tela emissiva no pipeline de visão (Fase 2): classificar a região do número como "display reflexivo de balança" vs. "tela emissiva", flag para PWM/moiré/sub-pixel.
- Exigir movimento de câmera prescrito (pan do rosto -> corpo -> pés na balança -> visor) num único take; segundo device exposto a paralaxe se desmascara.
- Body estimation + balança smart/wearable como verdade independente do que o OCR lê.
- Revisão humana com checklist anti-"segunda tela" para payouts altos.

### Degradação proposital da imagem do visor

**Como funciona:** O fraudador induz deliberadamente reflexo, baixa luz, foco ruim ou ângulo oblíquo para que o OCR leia um dígito errado favorável (8->3, 6->5, 9->4) ou para forçar o sistema a cair num fallback mais leniente (revisão que aceita "o que dá pra ver"). É um ataque de baixa sofisticação que explora a tolerância do pipeline a imagens ruins.

**Como é executado:** Posiciona uma fonte de luz para criar reflexo exatamente sobre um segmento do dígito, desfoca levemente, ou filma em contraluz/penumbra de modo que o OCR confunda dígitos parecidos no 7-segmentos. Repete a captura até "acertar" uma leitura favorável (rejeita silenciosamente as desfavoráveis e reenvia). Alternativamente, degrada o suficiente para o app sinalizar "baixa confiança" e mandar para fila humana, onde aposta numa leitura benevolente.

**Sofisticação:** baixa · **Custo p/ fraudador:** médio · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Confiança do OCR consistentemente baixa só nas pesagens favoráveis ao usuário; visor nítido no resto do vídeo (rosto, token) mas borrado exatamente no número.
- Reflexo/ofuscamento localizado sobre dígito crítico; histograma de nitidez anômalo só na ROI do display.
- Múltiplas tentativas/reenvios antes de uma submissão aceita (padrão de "tentar até passar").
- Discrepância entre leitura final aceita e tendência histórica/wearable.

**Mitigações:**

- Gate de qualidade na captura, no próprio app: rejeitar em tempo real frames com reflexo/desfoque na ROI do visor e instruir o usuário a reposicionar ANTES de enviar — não aceitar OCR de baixa confiança como prova.
- OCR robusto multi-frame: ler o número em N frames do clipe e exigir concordância; divergência entre frames (8 ora lido como 3) = flag, não escolha do valor favorável.
- Nunca tratar "baixa confiança" como fallback leniente: baixa confiança -> repesagem obrigatória ou revisão humana com viés conservador (na dúvida em peso final, arredondar contra o usuário).
- Registrar nº de tentativas/reenvios; padrão de retry alto vira sinal comportamental na Engine.
- Cross-check com body estimation e wearable elimina o ganho de uma leitura ambígua.
- UX: moldura-guia na tela com checagem de iluminação/foco da ROI antes de liberar a gravação.

### Manipulação de dígito por ângulo/parallax

**Como funciona:** Variação dirigida do ataque óptico: o fraudador oculta fisicamente um segmento do LCD/LED (com dedo, borda da balança, fita fina ou reflexo) para que, opticamente, um dígito vire outro. Explora a estrutura de 7 segmentos — apagar o segmento certo transforma 8 em 3/9/0, 6 em 5, ou esconde o dígito de dezena (98 lido como "8"). O peso real está no visor, mas a leitura é enganada por subtração de pixels.

**Como é executado:** Estuda qual segmento precisa sumir para converter seu peso real no peso desejado, e posiciona dedo/borda/reflexo exatamente sobre esse segmento durante o frame em que o OCR lê. Para ocultar a dezena inteira (perder peso "instantâneo"), cobre o primeiro dígito com o dedo ou enquadra cortando-o. Faz token e gesto reais para manter a sessão legítima, manipulando só a leitura.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Dedo/objeto/reflexo sobreposto à área do display no momento da leitura; oclusão parcial detectável por segmentação.
- Contagem de dígitos inconsistente entre frames (ora 2, ora 3 dígitos); dígito que "aparece e some".
- Peso fora de faixa plausível para o corpo estimado (ex.: "8 kg" para adulto) — implausibilidade fisiológica grosseira.
- Reflexo/sombra com formato exato de um segmento isolado.

**Mitigações:**

- OCR com detecção de oclusão: rejeitar leitura se houver dedo/objeto/reflexo sobre a ROI do display; exigir visor totalmente desobstruído e mãos fora do visor durante a leitura.
- Validação de número de dígitos e faixa plausível: peso < limiar fisiológico (ex.: <30 kg para o ICP) = rejeição automática; comparar contagem de dígitos com baseline do usuário.
- Leitura multi-frame com consenso: dígito instável entre frames invalida; exigir estabilidade do display por X frames consecutivos sem oclusão.
- Regra de enquadramento: visor deve aparecer completo e centralizado na moldura-guia; corte de dígito de dezena bloqueia a submissão.
- Cross-check fisiológico (Engine) e wearable/balança smart como verdade independente.
- Revisão humana foca em "havia algo sobre o visor?" em casos de delta grande.

### Falar o token em vez de mostrar (desacoplar do peso)

**Como funciona:** Quando o app aceita o token FALADO como prova de presença, o fraudador apenas verbaliza o código (e diz a palavra dinâmica) enquanto a cena do vídeo exibe um peso adulterado. Como a prova de "estar ao vivo no momento" se baseia no áudio do token, e não no cruzamento token<->cena visual, a pesagem falsa (balança adulterada, segundo device, overlay) convive com um token perfeitamente correto.

**Como é executado:** Recebe o token no app, começa a gravar, fala "CHARYA 4821, EVOLUÇÃO" corretamente — satisfazendo a checagem de presença — e simultaneamente filma uma balança/visor adulterado. O gesto também é feito ao vivo. O token está certo, o rosto está certo, mas nada amarra o token ao número real medido: o áudio prova "estou aqui agora", não "este peso é verdadeiro agora".

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Token correto convivendo com sinais de adulteração de display (overlay, tela emissiva, oclusão).
- Token falado sem que o token escrito apareça simultaneamente no mesmo frame do visor.
- Descompasso temporal entre fala do token e o momento em que o peso estabiliza.

**Mitigações:**

- Não tratar token como prova de peso, e sim como prova de momento: o token autentica o INSTANTE; a veracidade do número vem de OCR robusto + body estimation + balança smart/wearable. Desenhar o sistema assumindo que token correto NÃO garante peso correto.
- Exigir token MOSTRADO no mesmo frame que o visor: o usuário escreve/exibe o código (em papel/tela do próprio app no espelho) junto da balança, forçando o cruzamento token<->cena num único quadro.
- Token efêmero com validade curta (ex.: 60-120s) e timestamp embutido: vídeo deve ser capturado e enviado dentro da janela, com metadata batendo.
- Gesto aleatório atrelado à cena da pesagem (executar o gesto enquanto sobe/permanece na balança com visor visível), não num trecho separado.
- Engine: correlacionar áudio do token, timestamp, geolocalização e leitura do visor; qualquer descolamento temporal vira flag.

### Token exibido em segundo device sem pesagem real

**Como funciona:** O token é satisfeito mostrando-o na tela de outro celular ou num papel, enquanto a "pesagem" é totalmente encenada (balança adulterada, display falso, ou número escrito). A prova de presença/freshness do token é cumprida, mas desacoplada de qualquer medição real de peso.

**Como é executado:** O cúmplice/operador recebe o token e o exibe num segundo device ou papel dentro do enquadramento; o fraudador grava o vídeo encenando a pesagem com display arbitrário. Combina-se com proxy magro ou balança falsa. Como o token aparece "no frame", checagens ingênuas de presença passam.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Token exibido em tela emissiva separada (cintilação/moiré) em vez de manuscrito/no app oficial.
- Token e visor nunca no mesmo plano contínuo; token "entra" no quadro por fora.
- Metadata/timestamp do clipe inconsistente com a emissão do token; geolocalização divergente.
- Sinais simultâneos de display falso na balança.

**Mitigações:**

- Token gerado e renderizado DENTRO do app, com watermark dinâmico/anti-screenshot; preferir token que o usuário precisa reproduzir manuscrito + falar, dificultando exibição de segunda tela.
- Exigir token + rosto + visor no MESMO frame contínuo (regra de co-presença), invalidando token que aparece isolado.
- Detector de segunda tela na ROI do token (mesma lógica do visor emissivo).
- Janela curta de validade + verificação de metadata (timestamp/geo) server-side.
- Para payout alto: pesagem assistida (videochamada ao vivo com revisor humano) ou balança smart obrigatória, neutralizando encenação.

### Janela de pré-gravação da resposta ao token

**Como funciona:** Se houver latência tolerada entre a emissão do token e a captura/upload, o fraudador usa esse intervalo para roteirizar e emendar a resposta numa pesagem falsa. Quanto maior a janela aceita, mais tempo para montar a cena, ensaiar o gesto, posicionar o display adulterado e produzir um clipe convincente "com o token do dia".

**Como é executado:** Solicita o token, mas não grava imediatamente: usa os minutos disponíveis para preparar a cena (overlay/segundo device/proxy), ensaiar fala+gesto, e então gravar e enviar dentro do prazo. Se o app permitir reenviar várias vezes na mesma janela, escolhe a melhor tomada. A folga temporal converte um "desafio ao vivo" num "ensaio com gabarito".

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Tempo entre emissão do token e início da captura/upload próximo do limite da janela.
- Vídeo "produzido demais" (iluminação, enquadramento, gesto perfeitos) com latência alta.
- Múltiplos starts de gravação/reenvios na mesma janela.
- Timestamp do arquivo vs. timestamp de emissão com gap suspeito.

**Mitigações:**

- Janela mínima e curta (ex.: 60-90s) entre emissão do token e fim do upload; expirar e exigir novo token se estourar.
- Captura in-app obrigatória (sem upload de arquivo externo): gravação começa logo após o token e o clipe é carimbado pelo SDK com timestamps confiáveis frame-a-frame.
- Token revelado SÓ no momento da gravação (just-in-time), reduzindo tempo de preparo; segundo gesto/token aleatório DURANTE a gravação (challenge no meio do vídeo) que não pode ser pré-roteirizado.
- Registrar nº de tentativas e penalizar/flag retries excessivos.
- Verificação server-side de monotonicidade de timestamps e ausência de cortes (vídeo contínuo).

### Hijack/relay do token (MITM do canal)

**Como funciona:** O fraudador intercepta o token emitido pelo backend (via root, proxy, instrumentação do app, ou API reversa) e o repassa em tempo real a um cúmplice que grava o vídeo "correto" em outro lugar/momento — tipicamente um proxy magro com balança real. Ataca a confiança no canal: o app de quem aposta nunca filma a pesagem real; quem filma é outra pessoa, alimentada com o token legítimo da conta.

**Como é executado:** Em device rooted ou via engenharia reversa da API, captura o token assim que o backend o emite e o transmite ao cúmplice (mensagem/relay). O cúmplice, fisicamente magro e numa balança real, grava o vídeo com o token e gesto do dia. O clipe é então submetido pela conta do titular. Variante avançada: automatizar o relay para reduzir latência e caber na janela do token.

**Sofisticação:** alta · **Custo p/ fraudador:** médio · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Geolocalização/IP/rede do device que pediu o token divergente do local da captura.
- Device com sinais de root/jailbreak, emulador, hooking (Frida/Magisk), ou câmera virtual.
- Latência anômala entre emissão e captura; dispositivo de captura diferente do registrado (device fingerprint).
- Biometria facial/corpo do clipe diverge do histórico do titular (proxy).

**Mitigações:**

- Atestação de integridade do app e device: Play Integrity API / DeviceCheck/App Attest; bloquear root/jailbreak, emulador, câmera virtual e hooking. SDK de liveness de terceiros (Onfido/Unico/idwall) com detecção de injeção/virtual camera.
- Vincular token a sessão+device+geo: token só válido para captura no MESMO device/sessão que o solicitou; rejeitar se geo/IP/fingerprint divergirem.
- Captura in-app com pipeline selado (frames carimbados pelo SDK), não upload de arquivo arbitrário — relay precisaria comprometer o próprio device de captura.
- Biometria histórica (Fase 2): cruzar rosto E corpo do clipe com baseline do titular; proxy reprova.
- Janela curta e canal TLS com pinning; detectar reuso/relay do token por anomalia temporal.
- Payout alto -> pesagem ao vivo com revisor (videochamada) ou balança smart pareada ao device.

### Presentation attack no liveness (foto/vídeo/playback)

**Como funciona:** Ataque clássico de apresentação contra a checagem facial: foto impressa, vídeo em loop de um proxy magro, ou playback de tela são apresentados à câmera para passar como o "rosto vivo" do titular. Combinado com peso final fraudado, valida identidade sem a pessoa real estar presente — ou validando um proxy mais magro.

**Como é executado:** Exibe foto de alta resolução, ou reproduz num segundo monitor um vídeo previamente gravado do rosto (eventualmente do próprio titular, mas em sessão antiga/magro), enquanto a cena geral mostra a pesagem fraudada. Em liveness passivo fraco, foto/vídeo passam. Pode recortar/emoldurar a tela de playback para preencher o campo da câmera.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Artefatos de tela/impressão: moiré, reflexo, bordas de papel/monitor, ausência de profundidade/microtextura de pele.
- Liveness passivo/ativo: falta de resposta a challenge (piscar, virar, profundidade); reflexo especular de tela.
- Movimento 2D "achatado", paralaxe inconsistente, frequência de cintilação de monitor.
- Rosto do clipe descasa do corpo/cena (iluminação, ângulo) — composição.

**Mitigações:**

- Liveness ativo challenge-response de terceiros (Onfido/Persona/Sumsub/Veriff/Unico) integrado, com gestos aleatórios em tempo real difíceis de pré-gravar; preferir vendor com PAD (presentation attack detection) certificado iBeta nível 1/2.
- Atrelar o desafio facial à MESMA sessão contínua da pesagem (rosto + corpo + visor no mesmo take), impedindo inserir playback isolado.
- Detecção de tela/impressão e câmera virtual no SDK; bloquear injeção de stream.
- Biometria histórica + body estimation: rosto magro de sessão antiga vs. corpo atual gera inconsistência.
- Revisão humana para payout alto, com foco em artefatos de apresentação.

### Máscara 3D / silicone para spoof de biometria

**Como funciona:** Máscara impressa em 3D ou de silicone reproduzindo a face do titular é usada por um proxy mais magro, que sobe na balança real e executa gesto/token ao vivo. Derrota liveness baseado em foto/vídeo e até alguns depth checks (a máscara tem volume 3D), entregando identidade "do titular" sobre um corpo proxy magro com peso real baixo.

**Como é executado:** Produz máscara com a textura/relevo do rosto do titular (a partir de fotos), veste-a sobre um proxy magro e grava a pesagem real do proxy com token e gesto ao vivo. Como há tridimensionalidade e movimento real, liveness 2D e checagens de profundidade simples podem ser enganados; o peso é genuíno (do proxy), então OCR/plausibilidade não disparam.

**Sofisticação:** alta · **Custo p/ fraudador:** alto · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Microexpressões ausentes/rígidas, pele sem perfusão (sem variação rPPG/pulso na face), bordas de máscara no maxilar/olhos, oclusão de boca/olhos.
- Textura de silicone (especular uniforme), ausência de poros/sudorese, piscar não natural.
- Descompasso entre face (titular) e corpo (proxy mais magro/diferente) — body biometrics.
- Tendência de peso historicamente impossível de bater de repente "ao vivo".

**Mitigações:**

- Vendor de liveness com PAD avançado contra máscaras: análise de textura de pele, rPPG (sinal de pulso na face), challenge de microexpressão; exigir nível iBeta PAD Level 2.
- Cross-biometria rosto+corpo (Fase 2): a Engine deve cruzar face com altura/proporção/composição corporal do baseline; proxy magro com máscara descasa do corpo histórico.
- Wearable/HealthKit como verdade longitudinal: queda de peso só "no vídeo", sem lastro em tendência de wearable/balança smart, vira flag forte.
- Payout alto -> pesagem ao vivo com revisor humano que pede gestos faciais não roteirizados e inspeciona bordas/maxilar.
- Política: KYC reforçado e re-verificação biométrica periódica para detectar troca de pessoa entre baseline e final.

### Deepfake em tempo real respondendo challenge-response

**Como funciona:** Avatar deepfake é injetado via câmera virtual e, ao vivo, fala o token e executa o gesto aleatório, derrotando liveness ativo. Com o stream sob controle do fraudador, o peso pode ser sobreposto/composto livremente. É o ataque mais sofisticado contra a camada de liveness: responde a desafios dinâmicos em tempo real, não é pré-gravado.

**Como é executado:** Em device rooted/emulador ou via injeção de câmera virtual no app, alimenta o SDK de liveness com um stream sintético (face-swap/avatar em tempo real do titular) capaz de piscar, virar e "falar" o token sob demanda. A pesagem é composta digitalmente (overlay de visor/cena). Requer GPU, pipeline de inferência de baixa latência e contorno da atestação do device.

**Sofisticação:** alta · **Custo p/ fraudador:** alto · **Probabilidade:** baixa · **Impacto:** alto

**Sinais de detecção:**

- Sinais de câmera virtual/injeção de stream; ausência de sensores reais (sem dados de câmera nativa, frame timing sintético).
- Artefatos de deepfake: bordas de face-swap, inconsistência de iluminação/oclusão, falta de coerência temporal em movimento rápido, rPPG ausente.
- Device comprometido (root/emulador/hooking) na atestação.
- Cena de pesagem composta (visor/corpo) sem física consistente; sem lastro em wearable/balança smart.

**Mitigações:**

- Atestação forte de device e detecção de câmera virtual/injeção como pré-requisito: Play Integrity/App Attest; SDK de liveness com anti-injection (muitos vendors detectam virtual camera e stream emulado). Bloquear root/jailbreak/emulador.
- Liveness com sinais físicos difíceis de sintetizar em tempo real (rPPG, reflexo de luz estruturada/flash colorido aleatório na face — "flash challenge").
- Challenge multimodal aleatório combinando rosto + corpo + interação com objeto físico real (subir/descer carga conhecida na balança), que um avatar facial não reproduz fisicamente.
- Verdade independente do stream: balança smart com peso assinado por firmware (Fase 3) e wearable longitudinal — mesmo um deepfake perfeito não fabrica tendência metabólica coerente.
- Payout alto -> pesagem presencial/ao vivo assistida; revisão humana com detecção de deepfake.

### Proxy humano executa o gesto/challenge

**Como funciona:** Uma pessoa magra real sobe na balança e executa o gesto aleatório e o token ao vivo, batendo todas as checagens de liveness ATIVO — porque é um humano genuíno e presente. O ataque vence se a biometria não cruzar rigidamente rosto + corpo com o titular: o proxy tem peso real baixo, gestos reais e token correto; só não é a pessoa que apostou.

**Como é executado:** O titular recruta um conhecido magro (ou alguém pago) para fazer a pesagem final em seu nome: recebe o token, sobe na balança real, faz o gesto e fala o código ao vivo. Tudo é genuíno exceto a identidade. Se o liveness valida "um humano vivo" mas não "ESTE humano específico cruzado com o corpo do baseline", passa.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Face do clipe diverge da biometria do titular (KYC/baseline) — falha de match facial.
- Corpo/altura/proporção/tatuagens/marcas incoerentes entre baseline e final (body biometrics).
- Mudança brusca de características faciais entre check-ins; voz divergente no token falado.
- Queda de peso sem lastro em wearable/balança smart do titular.

**Mitigações:**

- Match facial 1:1 obrigatório contra o KYC do titular em CADA pesagem (não só liveness genérico); vendor de biometria (Unico/idwall/Onfido) comparando com documento e baseline.
- Cross-biometria de corpo (Fase 2): comparar altura/proporção/marcas corporais e composição entre os 3 momentos; proxy descasa do baseline.
- Biometria de voz no token falado, casada com baseline.
- Wearable/HealthKit/balança smart vinculados à conta como lastro longitudinal — proxy não tem o histórico do titular.
- Política: re-verificação de identidade no payout alto e cláusula contratual antifraude; revisão humana comparando rosto/corpo dos 3 check-ins lado a lado.

### Token correto + peso de outra sessão (replay parcial)

**Como funciona:** Token e gesto do dia são gravados corretamente (sessão legítima), mas o trecho da subida na balança/visor é costurado de uma pesagem antiga do próprio usuário (quando estava mais leve) ou de um terceiro mais leve. Ataca a suposição de continuidade: o app confia que, se o token está certo, todo o vídeo é do mesmo momento — e o fraudador injeta um pedaço reaproveitado.

**Como é executado:** Grava o token+gesto corretamente hoje, e edita/emenda no clipe o segmento do visor mostrando um peso baixo de uma gravação anterior (ou de outra pessoa magra). Tenta mascarar o corte com transição, ou explora pipelines que não verificam continuidade frame-a-frame. Objetivo: parecer um vídeo contínuo legítimo com peso final fraudado.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Descontinuidade no vídeo: salto de iluminação/fundo/roupa, corte/transição, inconsistência de timestamp frame-a-frame, mudança de codec/qualidade no meio.
- Metadata indicando edição (software de edição, recompressão); hashes de frames repetidos de sessões antigas (replay detection).
- Visor/peso descasa do corpo visível na cena (corpo atual mais pesado que o peso exibido).
- Token e visor nunca no mesmo plano contínuo.

**Mitigações:**

- Captura in-app contínua e selada: gravação direta pelo SDK com carimbo de tempo monotônico por frame e assinatura; rejeitar upload de arquivo externo editável.
- Detecção de edição/continuidade (Fase 2): verificar fluxo óptico contínuo, ausência de cortes, consistência de iluminação/fundo; flag para qualquer descontinuidade.
- Replay/dedup: hash perceptual de frames vs. base histórica do usuário e global — trecho reaproveitado bate com gravação anterior.
- Exigir co-presença token + rosto + visor + corpo no MESMO plano contínuo (sem emendas possíveis sem descontinuidade visível).
- Body estimation: corpo na cena precisa ser coerente com o peso do visor; reaproveitar visor magro num corpo atual pesado dispara flag.
- Plausibilidade fisiológica + wearable como lastro independente.

### Adversarial OCR poisoning

**Como funciona:** O fraudador usa caracteres adversariais, padrões ou perturbações visuais no visor (ou numa sobreposição) que enganam o modelo de OCR/visão para "ler" o número que ele escolheu, mesmo que para um humano o display pareça outra coisa (ou ambíguo). Explora fragilidade de redes neurais a exemplos adversariais, mirando especificamente o modelo de reconhecimento automático.

**Como é executado:** Conhecendo (ou inferindo por tentativa/erro) o modelo de OCR, cria uma sobreposição/textura no visor com perturbações que empurram a predição do modelo para o número desejado, mantendo aparência plausível de display. Submete o vídeo apostando que a camada automática aceita a leitura adversarial sem escalar para humano. Variante: glifos/fontes especialmente desenhados que o OCR mapeia errado.

**Sofisticação:** alta · **Custo p/ fraudador:** alto · **Probabilidade:** baixa · **Impacto:** médio

**Sinais de detecção:**

- Divergência entre leitura do OCR principal e de um OCR secundário/independente (ensemble) ou revisão humana.
- Padrões/texturas atípicas na ROI do display; ruído de alta frequência incoerente com um LCD real.
- Confiança do OCR anormalmente alta para um display visualmente ambíguo; leitura instável sob pequenas transformações (crop/blur).
- Peso lido descasa de body estimation e tendência histórica.

**Mitigações:**

- OCR em ensemble + verificação cruzada: dois modelos heterogêneos (e regras clássicas de 7-segmentos) precisam concordar; divergência -> revisão humana.
- Robustez adversarial: data augmentation, defesa por transformações aleatórias (random crop/resize/jpeg) na inferência; preprocessamento que destrói perturbações de alta frequência.
- Não confiar só na máquina em payout alto: revisão humana sempre lê o número de forma independente da camada automática.
- Cross-check com body estimation, plausibilidade fisiológica e wearable/balança smart — a leitura adversarial fica isolada e incoerente.
- Detector de anomalia na textura do display (Fase 2) e bloqueio de sobreposições não-LCD na ROI.
- Fase 3: balança smart com peso assinado por firmware elimina dependência do OCR e, portanto, todo o vetor.

---

## 7. Abuso de processo, metas, baseline e políticas

_13 vetores nesta categoria._

### Goal-gaming: meta/prazo calibrados ao swing fisiológico

**Como funciona:** O fraudador não tenta "burlar a balança"; ele explora a própria regra de plausibilidade fisiológica da engine. Como a engine flagueia perdas implausíveis (ex.: 18kg em 20 dias), o atacante faz o inverso: escolhe a maior meta percentual que ainda cai DENTRO da faixa "saudável/esperada" (ex.: 4-5% em 30 dias). Essa faixa é justamente a magnitude do swing natural de água corporal, glicogênio e conteúdo gastrointestinal de um homem de 90-110kg. Resultado: a "perda" é fabricada por desidratação e depleção de glicogênio controladas, mas a engine a lê como evolução legítima porque está abaixo do teto de suspeita.

**Como é executado:** Homem de 100kg calibra a meta em 4kg/30 dias (4%). Em vez de perder gordura, ele apenas garante baseline "cheio" (hidratado, pós-carboidrato, pós-refeição salgada) e pesagem final "vazia" (24-48h de restrição de carboidrato/sódio + restrição hídrica nas últimas horas + jejum). 4% de 100kg = 4kg, totalmente dentro do swing água+glicogênio (glicogênio muscular+hepático carrega ~3-4g de água por grama; depleção total move 1,5-2,5kg só de água ligada). A engine vê 0,13kg/dia, curva limpa, sem flag.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Cluster de metas posicionadas suspeitosamente próximas ao teto inferior da faixa "plausível" (ex.: muitos usuários escolhendo exatamente 4,0-5,0%).
- Perda concentrada nas margens temporais: zero/negativa no meio do desafio e todo o delta materializado nos últimos 2-3 dias.
- Composição corporal inalterada entre baseline e final (mesmo contorno/circunferência) apesar do peso menor — sinal de água, não gordura.
- Recuperação imediata de peso (rebound) se houver check-in pós-payout ou follow-up.

**Mitigações:**

- Engine comportamental deve tratar plausibilidade como faixa DE DUPLA BORDA: não só flag de perda rápida demais, mas também score de "perda concentrada no fim" e "delta dentro do envelope de swing hídrico" para o peso/sexo declarados.
- Exigir que a meta mínima de payout supere o swing fisiológico esperado (ex.: payout só a partir de ~6-7% ou perda absoluta acima do envelope água+glicogênio estimado para a massa do usuário), tornando 4-5% economicamente não lucrativo de fraudar.
- Validação intermediária OBRIGATÓRIA com peso real decrescente ao longo do tempo (curva monotônica suave), não apenas dois pontos nas pontas.
- Fase 3: cruzar com balança smart/wearable para exigir trajetória de bioimpedância (queda de massa gorda, não só peso total) e tendência de múltiplos dias, não pesagem pontual.
- Política de payout escalonado: parte do prêmio condicionada a manutenção do peso por 2-4 semanas após o final (re-pesagem de confirmação), neutralizando o rebound hídrico.

### Timing diurnal/menstrual/intestinal das pesagens

**Como funciona:** O peso corporal de uma mesma pessoa varia 1,5-3kg ao longo de 24h sem qualquer mudança de gordura — função de hidratação, sódio, conteúdo intestinal/bexiga, refeições e ciclo (no caso de mulheres, retenção pré-menstrual). O atacante registra o baseline no ponto MÁXIMO do dia (noite, pós-jantar salgado, sem ter evacuado/urinado) e o peso final no ponto MÍNIMO (manhã em jejum, pós-banheiro, desidratado). Captura todo o swing diurnal como "perda" — e cada pesagem isolada é perfeitamente verdadeira, então liveness, token e OCR aprovam normalmente.

**Como é executado:** Baseline gravado às 22h após jantar com muito sódio, hidratado, sem evacuar (corpo "cheio"). Peso final gravado às 6h, em jejum de 12h, logo após urinar e evacuar, com restrição hídrica desde a noite anterior. Diferença típica capturada: 1,5-3kg num homem de 100kg, sem perder grama de gordura. Como o app exige só "um vídeo válido por momento", não há controle de horário, e a engine não correlaciona o timestamp do token com a fase metabólica.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Timestamp do token revelando baseline noturno tardio vs. final de madrugada/manhã cedo — padrão sistemático de "cheio→vazio".
- Diferença entre o horário das pesagens fora do protocolo recomendado.
- Delta de peso compatível com swing diurnal (1,5-3kg) e nulo no resto da curva.
- Ausência de geolocalização/contexto consistente de rotina (baseline e final em horários que delatam encenação).

**Mitigações:**

- Padronizar protocolo de pesagem por POLÍTICA: todas as pesagens (baseline, intermediária, final) na MESMA janela horária (ex.: jejum matinal, 6h-9h), mesmas condições (roupa mínima padronizada, pós-banheiro declarado). Token dinâmico carimba o timestamp real, e a engine rejeita pesagens fora da janela.
- Engine cruza o timestamp embutido no token com a fase diurnal: baseline noturno + final matinal = flag automática de "exploração de swing".
- UX de pesagem que agenda e força a janela: o app só libera a gravação do baseline e do final no mesmo intervalo de horário, exibindo countdown.
- Pesagens múltiplas/repetidas na fase 3 (balança smart sincronizando vários dias) para estabelecer média móvel e neutralizar o ponto único manipulado.
- Revisão humana acionada quando baseline e final caem em extremos opostos do dia.

### Arbitragem entre balanças descalibradas

**Como funciona:** Duas balanças físicas diferentes, ambas reais e funcionando, podem divergir 2-4kg por descalibração. O atacante usa uma balança que lê A MAIS no baseline e outra que lê A MENOS no final. O corpo é o mesmo, o dia pode ser o mesmo, mas o número fabrica a "perda" pela física dos equipamentos. Não há adulteração de imagem, nem deepfake, nem edição — o OCR lê fielmente o visor, o liveness confirma a pessoa real, e tudo passa.

**Como é executado:** O fraudador testa várias balanças (casa, academia, farmácia, parentes) e identifica empiricamente uma que superestima e outra que subestima. Grava o baseline na balança "pesada" e o final na balança "leve". Pode inclusive fazer ambas no mesmo dia. Variação de 2-4kg é trivialmente obtenível entre balanças de banheiro baratas e descalibradas, e cai dentro de qualquer meta plausível.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Modelo/aparência da balança diferente entre vídeos (cor, formato do visor, fonte do display, plataforma).
- Ambiente de pesagem distinto entre baseline e final (piso, iluminação, geolocalização) sem justificativa.
- Sequência de zeragem inconsistente: comportamento do display ao zerar difere entre os vídeos.
- Delta de peso compatível com offset de equipamento e curva intermediária ruidosa/incoerente.

**Mitigações:**

- Política de "balança única registrada": exigir que o usuário use a MESMA balança em todas as pesagens, com foto/identificação do equipamento (marca, modelo, visor) capturada no baseline e re-confirmada visualmente pela CV em cada pesagem.
- Computer vision (fase 2) faz fingerprint visual da balança (geometria do display, fonte do visor, plataforma) e flag quando o equipamento muda entre check-ins.
- Procedimento de "two-step weigh-in" no vídeo: zerar a balança a 0,0 e mostrar (already no protocolo) + colocar um objeto de referência de peso conhecido (ex.: o próprio celular, cuja massa o app conhece pelo modelo, ou um halter declarado) para verificar a calibração da balança em vídeo.
- Cruzamento com geolocalização: baseline e final em locais físicos diferentes sem justificativa elevam o score de risco.
- Fase 3: balança smart pareada por BLE/Wi-Fi à conta, eliminando a arbitragem de equipamento — só pesagens daquele dispositivo autenticado contam.

### Balança em unidade/calibração enganosa

**Como funciona:** Variação do vetor anterior, mas focada em manipular o NÚMERO LIDO sem trocar de equipamento e sem editar imagem. O atacante explora: (a) offset de tara/zero — colocar peso extra ou deslocar o zero no baseline e zerar "limpo" no final; (b) ambiguidade de unidade — balança em libras (lb) lendo um número que, interpretado como kg pelo OCR, infla o baseline; (c) modo de display configurável. O OCR lê fielmente o dígito; a fraude está na semântica do número, não no pixel.

**Como é executado:** No baseline, o fraudador usa uma balança com algo escondido sobre a plataforma ou com a tara deslocada para cima (alguns modelos permitem zerar com offset), inflando a leitura. No final, zera corretamente. Alternativamente, configura a balança em lb no baseline (ex.: visor "220" = 220 lb ≈ 100kg) deixando o OCR/usuário tratar como "220kg" — não, melhor: explora visores sem unidade clara para que o engine assuma kg quando o número está em outra escala, ou alterna o modo entre as pesagens para criar delta artificial.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Ausência ou inconsistência da unidade no visor entre baseline e final.
- Sequência de zeragem não mostrada, mostrada parcialmente, ou com objeto sobre a plataforma antes de subir.
- Valor de baseline fisiologicamente improvável para o contorno corporal visível (peso declarado não bate com body estimation).
- Display em modo/aparência diferente entre check-ins (acende segmentos extras, casas decimais distintas).

**Mitigações:**

- OCR deve detectar e travar a UNIDADE explicitamente (kg vs lb vs st) e rejeitar a pesagem se a unidade não for legível ou divergir entre check-ins; normalizar tudo para kg com validação cruzada.
- Protocolo obrigatório de zeragem em vídeo contínuo: mostrar a balança vazia exibindo 0,0 imediatamente antes de subir, sem corte — o token dinâmico ancora o timestamp para impedir reuso.
- Body estimation (fase 2) estabelece faixa plausível de massa pelo vídeo do corpo; um baseline 8-10kg acima da estimativa visual vira flag de "número inflado".
- Política: somente balanças que exibam unidade kg e casa decimal; lista de modelos suportados; instrução de UX explícita.
- Revisão humana para qualquer baseline no topo da distribuição (peso muito alto para o perfil), onde o incentivo de inflar é máximo.

### Abuso de tolerância/arredondamento do OCR

**Como funciona:** Toda engine de OCR + regra de aprovação tem uma margem de erro tolerada (ex.: ±0,3kg para absorver leitura imperfeita, oscilação do display, ângulo). O atacante descobre essa margem por sondagem e posiciona o peso final exatamente na BORDA da tolerância. Uma pesagem que deveria falhar por 0,2kg vira aprovação porque cai dentro do colchão de erro. Repetido em escala, a tolerância vira um subsídio sistemático ao fraudador.

**Como é executado:** O usuário envia múltiplas pesagens finais próximas da meta, observando quais são aceitas e quais rejeitadas, mapeando a fronteira de tolerância (ex.: meta 96,0kg; testa 96,2 / 96,3 / 96,4 e descobre que 96,3 ainda passa). Daí sempre entrega o mínimo esforço que cruza a borda. Combina com micro-manipulações (postura, apoio parcial de mão fora do enquadramento) que empurram a leitura 0,2-0,3kg.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** médio

**Sinais de detecção:**

- Pesos finais concentrados estatisticamente na borda exata da tolerância (distribuição com pico suspeito em meta+margem).
- Múltiplos envios com valores incrementais varrendo a fronteira (assinatura de sondagem).
- Apoio corporal/postura anômala no momento da leitura (mão fora do quadro, peso parcial).
- Leitura no limiar combinada com curva intermediária que não suportaria aquele final.

**Mitigações:**

- Tolerância NÃO deve ser uma borda dura conhecível: usar margem assimétrica e privada, e tratar resultados "na borda" como faixa de revisão, não aprovação automática.
- Anti-probing: limitar tentativas de pesagem final (ver retry farming) e detectar varredura incremental como sinal de fraude por si só.
- OCR robusto deve capturar a leitura ESTABILIZADA do display (vídeo mostrando o número travar por N segundos), não o frame mais favorável; média de frames estáveis reduz o jogo de borda.
- Resultados dentro de X% da meta (zona de borda) entram em revisão humana obrigatória para payouts relevantes.
- Engine considera a curva completa: um final marginal só é aceito se a trajetória intermediária for coerente com ele; final no limiar sem suporte de curva = flag.

### Retry farming (reenvio até passar)

**Como funciona:** O fraudador trata cada envio de vídeo como um bilhete de loteria. Como OCR, liveness e detecção têm variância (ângulo, luz, ruído, oscilação do display), reenviar muitas vezes a mesma gambiarra eventualmente produz uma leitura favorável que passa por todas as camadas automáticas. Não precisa de uma fraude perfeita; precisa de muitas tentativas até uma "dar sorte".

**Como é executado:** Com peso real ainda acima da meta, o usuário grava dezenas de vídeos variando micro-condições (postura, hora, posição da câmera, respiração, leve apoio) e reenvia até o OCR ler o número desejado ou até o liveness/detecção falhar a favor dele. Em apps sem limite de tentativas, é puro brute force até cruzar o limiar.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Número alto de submissões de pesagem final em curto intervalo para o mesmo check-in.
- Leituras oscilando logo abaixo e logo acima da meta entre tentativas consecutivas.
- Variância anormal entre vídeos do mesmo dia/usuário (postura, enquadramento mudando a cada take).
- Padrão de "tentar até aceitar" — última submissão sempre marginalmente aprovada.

**Mitigações:**

- Limitar rigidamente o número de tentativas por check-in (ex.: 1-2 por janela de 24h) e tornar cada token dinâmico de uso ÚNICO, atrelado a um timestamp curto, de modo que cada vídeo seja uma pesagem distinta auditável.
- Registrar e PONTUAR todas as tentativas, não só a aprovada: a engine considera a melhor + as descartadas; muitas tentativas com leituras divergentes = score de fraude alto, não aprovação.
- Cooldown obrigatório entre tentativas e bloqueio progressivo após N falhas, empurrando para revisão humana.
- Liveness/token devem invalidar reuso: se o usuário tenta reenviar o "melhor" vídeo, o token expirado o rejeita; cada take exige novo gesto/código.
- Decisão por trajetória, não por take isolado: a engine valida a coerência da série temporal, então uma única leitura favorável fora da curva não basta.

### Abandono-e-recriação para re-roll do baseline

**Como funciona:** O ponto de partida (baseline) define quanto o usuário precisa "perder". Quanto mais inflado o baseline, mais fácil bater a meta. O atacante abandona desafios cujo baseline ficou "ruim" (peso registrado baixo demais) perdendo apenas a aposta mínima, e recria o desafio até conseguir um baseline o mais inflado possível, otimizando o ponto de partida como quem re-rola dados.

**Como é executado:** O usuário cria um desafio, registra baseline, e se o número não ficou suficientemente alto (estava "vazio" naquele dia, ou a aposta era pequena), abandona — custo: aposta mínima. Recria no dia/condição de máxima retenção hídrica (pós-binge, pós-sódio) para inflar o baseline. Repete até o baseline "sortudo" + meta combinarem num alvo trivialmente atingível por swing fisiológico.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Mesmo usuário/KYC com múltiplos desafios abandonados, cada um com baseline progressivamente mais alto.
- Baselines do mesmo CPF/face divergindo vários kg em poucos dias sem trajetória coerente.
- Padrão de abandono sempre logo após o baseline, antes de qualquer check-in intermediário.
- Recriação concentrada em dias de provável retenção (pós-feriado).

**Mitigações:**

- Vincular baseline ao KYC/CPF/biometria PERSISTENTE: a engine mantém histórico de todos os pesos já registrados por aquela identidade e rejeita/flag baseline novo que diverge do histórico (ex.: baseline 6kg acima do último peso conhecido = suspeito).
- Penalizar abandono: cooldown entre desafios após abandono, e baseline do novo desafio NÃO pode ser maior que o último peso comprovado da mesma identidade sem revisão.
- Custo de re-roll: tornar a aposta mínima e/ou o atrito de KYC alto o suficiente para que abandonar-e-recriar não seja barato.
- Biometria histórica (fase 2): a face/corpo é a mesma identidade; cruzar baselines entre desafios "abandonados" e ativos da mesma pessoa.
- Limitar baselines por identidade num período e exigir revisão humana para baseline que sobe em relação ao histórico.

### Conta descartável criada no pior dia de retenção

**Como funciona:** Combinação de re-roll de baseline com multiconta. Em vez de re-rolar dentro da mesma conta, o atacante cria CONTAS descartáveis, cada uma registrando baseline em um dia de pico de retenção hídrica, e mantém a "conta sortuda" cujo baseline ficou mais inflado — descartando as demais. Como cada conta tem KYC próprio (de terceiros/laranjas), a engine não conecta os baselines.

**Como é executado:** O operador cria contas em sequência, cada uma após um evento de retenção (feriado, churrasco, alta de sódio/álcool/carboidrato), registra baseline inflado, e abandona as que não inflaram bem. A conta cujo baseline ficou no topo é levada adiante; as demais são descartadas (custo: aposta mínima + KYC). Escala isso para garantir pelo menos uma partida ótima.

**Sofisticação:** média · **Custo p/ fraudador:** médio · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Múltiplas contas com baselines registrados em janelas pós-feriado/fim de semana.
- Dispositivo/IP/geolocalização/comportamento compartilhados entre contas "independentes".
- KYCs distintos mas sinais de device fingerprint, padrão de digitação, mesma balança/ambiente nos vídeos.
- Alta taxa de contas que abandonam logo após o baseline.

**Mitigações:**

- Device fingerprinting e correlação de sinais (IP, hardware, padrão de uso, ambiente do vídeo, balança) para ligar contas "independentes" operadas pela mesma pessoa.
- KYC de terceiros (Onfido/Unico/idwall) com liveness forte para encarecer a criação de contas e detectar reuso de documentos/faces; sinalizar faces/documentos recorrentes.
- Engine antifraude trata baseline registrado em janela de retenção conhecida (pós-feriado) com peso fora da estimativa visual como flag.
- Body estimation no baseline: se o contorno corporal não condiz com o peso declarado, flag independentemente da conta.
- Limite por KYC/CPF de desafios simultâneos e histórico cross-conta quando há colisão de identidade real.

### Engenharia social no suporte humano (camada 3)

**Como funciona:** A camada 3 (revisão humana) existe para julgar casos ambíguos, mas o humano é manipulável. O fraudador constrói uma narrativa emocional crível — doença, luto, "balança quebrou no dia", "o app travou e perdi o vídeo", "estou passando por dificuldade" — para pressionar o agente a conceder override, exceção de tolerância, ou aceitar um vídeo fora do protocolo. O ataque mira a empatia e a inconsistência humana, não a tecnologia.

**Como é executado:** Após uma pesagem que falhou nas camadas automáticas, o usuário abre suporte com história comovente e documentos plausíveis (atestado, foto de balança "quebrada"), insiste, escala, ameaça reclamação pública/Reclame Aqui/chargeback, e pede "só desta vez" um override. Agentes sem script rígido, sem treino antifraude, ou com metas de satisfação do cliente cedem e aprovam manualmente.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** alto

**Sinais de detecção:**

- Pedidos de exceção/override concentrados após falha nas camadas 1-2.
- Narrativas recorrentes/templatizadas entre usuários diferentes (mesma "doença", mesma "balança quebrada").
- Escalonamento emocional + ameaça de chargeback/exposição como alavanca.
- Agentes específicos com taxa de override acima da média (possível conluio ou alvo fácil).

**Mitigações:**

- Política de override estrita: nenhum agente pode aprovar payout sozinho; overrides exigem dupla aprovação, motivo registrado, e ficam fora do alcance de metas de CSAT.
- Runbook antifraude para a camada 3: lista de narrativas conhecidas, exigência de evidência verificável (não atestado autodeclarado), e nunca relaxar tolerância de peso por história emocional.
- Auditoria de overrides: dashboard de exceções por agente, por narrativa, por valor; revisão dos outliers.
- Caminho de exceção legítima separado do caminho de payout: problema técnico (app travou) gera nova pesagem dentro de protocolo, NUNCA aprovação retroativa de um peso não comprovado.
- Treinamento e rotação de agentes; separação de funções para reduzir conluio; segregar quem atende do que aprova pagamento.

### Exploração de ambiguidade de regras

**Como funciona:** Onde a política é silenciosa, o fraudador adota a interpretação mais vantajosa em CADA ponta e se defende com "não estava escrito". Roupa pesada no baseline e roupa mínima no final; horário e hidratação livres; calibração não exigida. Cada escolha é "permitida" porque a regra não a proibiu, e a soma fabrica perda sem violar nenhuma cláusula explícita.

**Como é executado:** O usuário lê os termos, identifica lacunas (sem especificação de roupa, calçado, horário, hidratação, balança, unidade) e monta a combinação ótima: baseline vestido/calçado/molhado/cheio, final em roupa íntima/seco/vazio. Se contestado, argumenta literalmente que cumpriu todas as regras escritas. A ambiguidade vira munição contra a própria empresa em disputa.

**Sofisticação:** baixa · **Custo p/ fraudador:** baixo · **Probabilidade:** alta · **Impacto:** médio

**Sinais de detecção:**

- Diferença visível de vestimenta/calçado entre baseline e final no vídeo.
- Condições de pesagem inconsistentes (uma vestido, outra não) detectáveis pela CV.
- Delta de peso parcialmente explicável por vestuário (roupa+tênis pesam 0,8-2kg).
- Argumentação legalista do usuário citando lacunas dos termos em disputas.

**Mitigações:**

- Especificar a política exaustivamente: roupa padronizada (ex.: roupa íntima ou roupa leve definida), sem calçado, mesma janela horária, mesma balança, unidade kg, condição declarada — em TODOS os check-ins, com o mesmo padrão obrigatório.
- Computer vision (fase 2) verifica conformidade visual: detecta calçado, roupa pesada, e flag/rejeita pesagem fora do dress code.
- "Default fecha a favor da casa": termos estabelecem que qualquer condição não conforme ao protocolo invalida a pesagem; ônus de conformidade é do usuário.
- UX que exibe o checklist de condições antes de cada gravação e exige confirmação, removendo a defesa de "não sabia/não estava escrito".
- Revisão jurídica periódica dos termos para fechar lacunas exploradas, com changelog versionado por desafio.

### Ataque à janela de validação intermediária

**Como funciona:** A pesagem intermediária existe para que a engine veja uma curva de perda coerente (monotônica, plausível) em vez de só dois pontos. O atacante subverte isso cronometrando a intermediária para um dia de RETENÇÃO MÁXIMA. Assim cria artificialmente uma "tendência de queda": intermediária alta → final baixo, gerando uma curva que parece consistente, quando na verdade os três pontos foram posicionados para enganar o detector de trajetória.

**Como é executado:** Sabendo que a engine valida a forma da curva, o usuário garante baseline alto, faz a intermediária num dia de pico de retenção (pós-binge/sódio) para que ela fique alta também, e o final em condição vazia. A engine vê baseline 100 → intermediária 99 → final 96 e conclui "queda progressiva coerente", sem perceber que cada ponto foi escolhido pela fase metabólica, não pela perda real de gordura.

**Sofisticação:** alta · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Intermediária registrada em janela de retenção (timestamp + padrão pós-feriado/fim de semana).
- Curva de 3 pontos suspeitosamente "limpa" mas com composição corporal inalterada.
- Intervalo irregular entre check-ins (intermediária deslocada para o dia conveniente).
- Final e intermediária com condições de pesagem divergentes (cheio→vazio).

**Mitigações:**

- Múltiplos pontos intermediários, não apenas um: quanto mais check-ins (idealmente diários via balança smart na fase 3), mais difícil cronometrar todos para a fase certa.
- Fixar o cronograma dos check-ins (datas/janelas definidas pelo app, não escolhidas pelo usuário), com mesma condição/horário, eliminando a escolha do "dia conveniente".
- Engine valida não só monotonicidade mas TAXA e composição: queda concentrada nos últimos dias, ou curva consistente com swing hídrico, gera flag mesmo sendo "coerente" na forma.
- Cruzar pesagens com wearables/balança de bioimpedância para checar se a massa GORDA caiu, não só o peso total.
- Re-pesagem de confirmação pós-final para detectar rebound (peso volta = era água/timing, não gordura).

### Chargeback/MED de Pix e contestação da aposta

**Como funciona:** O fraudador transfere o risco financeiro para o Charya acionando mecanismos de devolução de pagamento. No Pix, o MED (Mecanismo Especial de Devolução) e contestações por "golpe/fraude" podem reverter a aposta. Se o usuário perde o desafio (não emagrece), ele aciona MED/contesta a transação alegando golpe, recuperando o dinheiro que deveria ter sido perdido — convertendo uma aposta perdida em risco zero para si e prejuízo para a casa.

**Como é executado:** O usuário aposta via Pix, falha na meta, e em vez de aceitar a perda, abre contestação no banco/MED alegando que foi vítima de golpe ou que não reconhece/autorizou a cobrança, ou que o "serviço não foi prestado". Se o Charya não tiver evidência robusta de consentimento e de prestação de serviço, o valor é devolvido. Em escala, vira saque sistemático: aposta, perde, recupera.

**Sofisticação:** média · **Custo p/ fraudador:** baixo · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Aberturas de MED/contestação concentradas após desafio PERDIDO.
- Mesma identidade com histórico de contestações em desafios falhos.
- Alegação de "golpe/não reconheço" para transação claramente autenticada e consentida no app.
- Pico de contestações correlacionado a coortes que falharam a meta.

**Mitigações:**

- Trilha de consentimento à prova de disputa: registrar aceite explícito dos termos, autenticação forte no momento da aposta (biometria/KYC), comprovante de que o usuário operou o app e iniciou o desafio — evidência para contestar MED/chargeback.
- Estrutura de produto/jurídica que caracterize a transação como prestação de serviço/entrada em programa, com termos claros sobre não reembolso em caso de falha na meta, em conformidade regulatória brasileira.
- Modelo de pagamento que reduza exposição: custódia/escrow, liberação faseada, ou estrutura em que o valor apostado não fique simplesmente "recebido e reembolsável".
- Bloqueio e blacklist de identidades que abusam de MED; reporte aos provedores e ao arranjo de pagamento.
- Monitoramento de taxa de contestação por coorte e alavancas antifraude no onboarding para barrar laranjas/contas descartáveis que farão chargeback.

### Coordenação multiconta / fila de laranjas em escala

**Como funciona:** O ataque mais perigoso para a banca: um operador profissional roda dezenas/centenas de contas, cada uma com KYC de um laranja diferente (documentos/faces de terceiros, comprados ou recrutados), aplicando a MESMA gambiarra de baseline+timing+swing em todas. Cada conta isolada parece um usuário legítimo de baixo ganho; o agregado, pela lei dos grandes números, drena o caixa de forma consistente e previsível. É fraude industrializada, não oportunista.

**Como é executado:** O operador recruta laranjas (ou usa bases de identidades vazadas/compradas) para passar nos KYCs de terceiros, automatiza o fluxo (câmera virtual/root para liveness quando possível, ou pessoas reais executando o protocolo em série), e aplica em cada conta a estratégia de swing fisiológico + baseline inflado já validada. Como o ganho por conta é "plausível", nenhuma dispara flag isolada; a margem vem do volume.

**Sofisticação:** alta · **Custo p/ fraudador:** alto · **Probabilidade:** média · **Impacto:** alto

**Sinais de detecção:**

- Correlação de dispositivos/IPs/contas bancárias de saque/padrões de comportamento entre contas "independentes".
- Mesma estratégia exata (mesma meta %, mesmo timing, mesma balança/ambiente) replicada em muitas contas.
- Cluster de payouts para contas bancárias/Pix relacionadas ou para o mesmo destino final.
- Picos de cadastro/KYC em lote; faces/documentos com sinais de reuso ou de provedores de laranja.

**Mitigações:**

- Antifraude de grafo: ligar contas por device fingerprint, IP, geolocalização, chave Pix de saque, ambiente do vídeo, balança e padrão comportamental; tratar clusters como uma entidade e cortar payouts agregados.
- KYC + liveness forte de terceiros (Unico/idwall/Onfido/Sumsub) com detecção de câmera virtual, deepfake e reuso de documento; sinalizar identidades recorrentes e velocidade anômala de cadastro.
- Limites de exposição por unidade de tempo e teto de payout agregado por cluster/coorte, com circuit breaker automático quando a taxa de aprovação/pagamento sai do envelope esperado.
- Todas as mitigações dos vetores anteriores (baseline ancorado ao histórico, swing fisiológico, balança smart, múltiplos check-ins, re-pesagem de confirmação) elevam o custo POR conta, quebrando a economia do volume.
- Revisão humana obrigatória e KYC reforçado para payouts altos e para qualquer cluster com sinais de coordenação; segregação de saque com verificação de titularidade Pix == titular KYC.
- Análise atuarial contínua: se a fração de "vencedores" excede o esperado fisiológico da coorte, é sinal de fraude sistêmica, não de sucesso do programa.

---

## Roadmap de defesa por fase

Cada item indica os vetores-alvo principais. Princípio de priorização: **custo de implementação baixo × cobertura de vetores de alta probabilidade primeiro**.

---

### FASE 1 / MVP — Matar a fraude trivial e impor fricção econômica

_(regras automáticas, protocolo de captura, revisão manual; sem IA pesada)_

**A. Protocolo de pesagem padronizado e supervisionado (ataca a maior família de fraude barata)**

- **Baseline gravado e validado como evento crítico**, com os mesmos requisitos do final (rosto + corpo inteiro + balança zerada + subida + visor), revisado antes de aceitar a aposta. Mata "re-roll de baseline", "abandono-e-recriação", "conta descartável no pior dia de retenção".
  → _Vetores: baseline inflado, lastro oculto no baseline, roupa/calçado pesado no baseline, abandono-e-recriação, conta descartável._
- **Protocolo de roupa obrigatório**: pesagem em roupa mínima padronizada (camiseta/shorts, descalço), idêntico no início e no fim, exibido na câmera. Roupa pesada no baseline vs. seminu no final deixa de gerar delta.
- **Demonstração da balança zerada com objeto de referência**: o app pede que o usuário mostre a balança marcando 0 e, em momentos aleatórios, pese um item de peso conhecido sugerido na hora (ex.: "coloque uma garrafa de 2L cheia") — detecta offset de fábrica, troca de balança, calço sob célula, bateria fraca, adesivo no visor, balança de brinquedo.
  → _Vetores: offset de calibração, troca de balança, cunha/calço, bateria fraca, adesivo/overlay de dígitos, balança de brinquedo/protótipo, segundo device como visor._
- **Pesagem em superfície dura obrigatória, mostrada na câmera** (piso, nunca carpete/inclinado), pés ao centro, sem nada ao alcance das mãos no quadro. Câmera deve enquadrar mãos e entorno.
  → _Vetores: superfície inclinada/carpete, apoio em parede/móvel, mão na pia/corrimão, corrimão na altura do quadril, pé fora da plataforma, apoio no próprio device._

**B. Token dinâmico co-localizado e amarrado ao peso (fecha o desacoplamento)**

- **Regra dura: token + gesto + visor + rosto no MESMO frame / mesma cena contínua.** O peso só é válido se o OCR do visor e o token aparecem co-visíveis. "Falar" o token sem mostrá-lo é rejeitado; o token deve ser **exibido fisicamente** (escrito/mostrado) perto da balança.
  → _Vetores: falar o token em vez de mostrar, titular canta o token + proxy fora de quadro, token em segundo device, token correto + peso de outra sessão, replay parcial._
- **Token com janela curtíssima de validade (TTL) e seed server-side** (HMAC com segredo no backend, nunca derivável no cliente). Gera-se sob demanda no momento da captura, expira em segundos.
  → _Vetores: replay attack puro, janela de pré-gravação da resposta, comprometimento do seed do token, replay de tela filmada._
- **Gesto aleatório de corpo inteiro** (não só "mostrar a mão"): virar de lado, agachar, levantar a balança e mostrar a base — encarece pré-gravação e splicing, e ajuda body estimation futuro.

**C. Captura blindada no app (eleva o custo do digital trivial)**

- **Vídeo contínuo gravado dentro do app, sem upload de arquivo externo** no MVP. Sem "escolher da galeria" — só captura ao vivo. Mata em massa edição, splicing, GenAI, reuso de vídeo, foto impressa.
  → _Vetores: splicing, reuso/edição de dois vídeos, deepfake, vídeo GenAI, green screen, foto impressa, replay._
- **Coleta e verificação de metadata na origem** (timestamp do servidor, não do device; geolocalização; integridade do stream). Carimbo de tempo é do backend no momento do recebimento.
  → _Vetores: manipulação do relógio do device, adulteração de timestamp/GPS, GPS spoofing._
- **Detecção básica de ambiente comprometido**: root/jailbreak, emulador, câmera virtual conhecida, screen-recording/overlay ativos → bloqueia ou força revisão humana.
  → _Vetores: câmera virtual/feed injetado, emulador, app repackado, replay de tela filmada._
- **App attestation nativa (Play Integrity / App Attest)** desde o MVP — barato e mata requisições diretas ao backend e apps repackados.
  → _Vetores: requisições diretas ao backend, app repackado, MITM, hooking._

**D. Engine Charya v1 — regras de plausibilidade fisiológica (defende o swing, o vetor #1)**

- **Limites de taxa de perda**: flag automático acima de ~1% do peso corporal/semana ou perdas implausíveis (ex.: 18 kg em 20 dias). Bloqueio para revisão humana.
  → _Vetores: depleção carb/water/sodium, desidratação aguda, diuréticos/laxantes, perda médica/cirúrgica não declarada._
- **Janela de pesagem aleatória imposta pelo app** (o usuário não escolhe a hora/dia): notificação "pese nas próximas X horas", randomizada, para quebrar o timing diurnal/menstrual/intestinal e o pico do swing.
  → _Vetores: timing diurnal/intestinal, esvaziamento de bexiga/intestino + jejum, peak week._
- **Validação intermediária obrigatória e também aleatória**, comparada à curva esperada — curva fisicamente impossível (platô e queda abrupta no fim) vira flag.
  → _Vetores: ataque à janela intermediária, balança intermediária inflada para fabricar curva._
- **Anti-retry / anti-arbitragem**: número limitado de tentativas de submissão, cada rejeição registrada; baseline e final na **mesma balança** (mostrada), comparação de aparência da balança entre sessões.
  → _Vetores: retry farming, arbitragem entre balanças descalibradas, abuso de tolerância/arredondamento do OCR._

**E. Política, KYC e regras contratuais (camada barata e potente)**

- **KYC de terceiro no onboarding** (Onfido/idwall/Unico) + **selfie liveness amarrada à conta** desde o cadastro. Uma conta = uma pessoa.
  → _Vetores: documento/selfie de terceiro, conta familiar compartilhada, conta vendida/alugada._
- **Regras explícitas e antifrágeis** no termo: proibição de perda por meios médicos/cirúrgicos (GLP-1, bariátrica, lipo) não declarados, definição precisa de protocolo de pesagem, cláusula de perda da aposta por fraude. Elimina "ambiguidade de regras".
  → _Vetores: exploração de ambiguidade, perda médica não declarada, goal-gaming._
- **Estrutura de metas robusta ao swing**: metas mínimas (ex.: ≥ X% do peso) e prazos longos o suficiente para que o swing de água/intestino não baste para ganhar — torna o EV do swing negativo.
  → _Vetor: goal-gaming calibrado ao swing fisiológico._
- **Pix antifraude**: titularidade do Pix de aposta e de payout = titular do KYC; janela anti-chargeback/MED, retenção de payout para casos sob revisão.
  → _Vetores: chargeback/MED de Pix, laranjas, multiconta._
- **Revisão humana obrigatória para payout alto e qualquer flag**, com checklist anti-engenharia-social e separação de funções.
  → _Vetores: engenharia social no suporte, insider na camada 3._

---

### FASE 2 — IA visual e biometria histórica encarecem a falsificação de mídia e o proxy

_(computer vision, detecção de edição, body estimation, biometria ao longo do tempo)_

- **Detecção de replay / tela filmada / re-captura** (moiré, reflexos, banding, análise de bordas de tela) — encarece o replay de segunda tela, hoje alta probabilidade/baixa sofisticação.
  → _Vetores: replay de tela filmada, foto impressa, segundo display, presentation attack._
- **OCR robusto e adversarial-aware**: leitura tolerante a parallax controlado mas que rejeita ângulos suspeitos, detecta degradação proposital da imagem, dígitos por parallax, overlay/CGI no visor, e exige nitidez mínima do visor.
  → _Vetores: manipulação de dígito por ângulo, degradação proposital, CGI/edição do visor, loop/freeze do visor, adversarial OCR poisoning._
- **Body/pose estimation e consistência corporal entre sessões**: estima volume/composição corporal e compara baseline→intermediária→final; detecta troca de corpo, dublê magro, postura/contração para enganar, ilusão de ângulo.
  → _Vetores: dublê magro, gêmeo/sósia, fat suit/maquiagem, postura/contração/respiração, ilusão óptica, conluio de troca de corpos._
- **Biometria facial histórica**: a face de cada check-in é comparada à âncora do KYC e ao histórico (mesma pessoa ao longo do tempo), com liveness ativo (challenge-response).
  → _Vetores: dublê/sósia, faceswap, sequestro de identidade, máscara 3D, deepfake._
- **Análise forense de mídia**: detecção de splicing, freeze-frame, recompressão/transcodificação, inconsistência de iluminação/composição, artefatos de GenAI/diffusion, green screen.
  → _Vetores: splicing, reuso/edição, green screen, deepfake, vídeo GenAI, recompressão para apagar rastros, token injetado em pós._
- **Certificate pinning + attestation forte + detecção de hooking (Frida/Xposed/Magisk)** — fecha o que o MVP só mitigou parcialmente.
  → _Vetores: bypass de pinning, hooking em runtime, MITM/replay de pacote, câmera virtual avançada._
- **Engine Charya v2 — underwriting comportamental**: scoring de probing adversarial (usuários que ficam logo abaixo do threshold), grafo de relacionamento entre contas (laranjas, multiconta, KYC farm, coordenação em escala), padrões de device/IP/geolocalização compartilhados.
  → _Vetores: probing da engine, laranjas/fraude-as-a-service, multiconta em escala, KYC farm, coordenação de fila de laranjas, conluio entre participantes._

---

### FASE 3 — Sinais físicos independentes tornam a fraude do peso quase inviável

_(balanças smart, HealthKit/Health Connect, wearables, score metabólico)_

- **Balança inteligente Charya-certificada (BLE/Wi-Fi) como caminho preferencial**, com peso assinado criptograficamente na origem (firmware confiável, chave por device) — remove a confiança no visor filmado e no OCR.
  → _Vetores: todos os de manipulação de visor/balança, spoof BLE, firmware adulterado, MITM da balança, leitura por OCR._
- **Pareamento balança↔corpo↔conta**: a smart scale com bioimpedância amarrada ao mesmo perfil biométrico/wearable, evitando que se pese outra pessoa ou dispositivo.
  → _Vetores: wearable/balança pareada ao proxy, proxy fora de quadro, conluio._
- **Correlação multi-sinal com wearables (Garmin/Apple Health/Google Health Connect)**: atividade, gasto calórico, sono, frequência cardíaca e tendência de peso devem ser **coerentes** com a perda alegada. Perda real de gordura tem assinatura metabólica; swing de água não.
  → _Vetores: injeção de peso falso no Apple Health/Health Connect, falsificação de dados de wearable, desidratação/depleção, perda médica não declarada._
- **Validação de proveniência dos dados de saúde**: aceitar apenas dados originados de devices certificados/atestados, não escrita manual de app de terceiro na HealthKit/Health Connect.
  → _Vetores: injeção no Apple Health/Health Connect, spoof de wearable._
- **Score metabólico Charya**: modelo que funde balança smart + bioimpedância + wearable + histórico, produzindo uma probabilidade de "perda fisiologicamente real" — o underwriting final do payout alto.
  → _Vetores: peak week, depleção, dublê com peso real, qualquer ganho por swing._
- **Defesa contra deepfake em tempo real / GenAI condicionada à pessoa**: liveness multimodal (challenge físico + sinal de device certificado), que um avatar do próprio usuário magro não consegue acompanhar junto com a balança assinada.
  → _Vetores: deepfake em tempo real respondendo challenge, GenAI condicionada à pessoa real, máscara 3D._

---

## Quick wins para o MVP

1. **Captura só ao vivo, dentro do app — proibir upload de arquivo/galeria.** Uma única decisão de produto mata em massa edição, splicing, reuso de vídeo, GenAI, green screen, foto impressa e replay de arquivo. É a mitigação de maior cobertura por menor custo.

2. **Baseline tratado como evento crítico, com protocolo de roupa mínima padronizada (descalço, camiseta/shorts) idêntico no início e no fim, mostrado na câmera.** Aniquila roupa pesada no baseline vs. seminu no final, lastro oculto e baseline inflado por vestimenta — vetores de alta probabilidade e custo zero de implementação.

3. **Janela de pesagem aleatória imposta pelo app** ("pese nas próximas X horas", notificação randomizada), incluindo a validação intermediária. Quebra o timing diurnal/intestinal, o jejum/bexiga vazia matinal e o pico do swing de água — sem nenhuma IA.

4. **Token dinâmico co-localizado: regra dura de que token + gesto + visor + rosto apareçam no mesmo frame/cena contínua, com TTL curto e seed server-side (HMAC).** Fecha o desacoplamento token-peso ("falar o token", proxy fora de quadro, token de outra sessão) e replay — é a correção mais importante do mecanismo de token.

5. **Teste de referência da balança na hora**: pedir que o usuário pese um objeto de peso conhecido sugerido aleatoriamente (ex.: "garrafa de 2L cheia") e mostre a balança zerada. Detecta offset de fábrica, troca de balança, calço, adesivo no visor e balança de brinquedo — gambiarras de altíssima probabilidade.

6. **App attestation nativa (Play Integrity / App Attest) + bloqueio/flag em root, emulador e câmera virtual conhecida.** Barato, nativo, e fecha requisições diretas ao backend, apps repackados e os feeds injetados mais comuns.

7. **Timestamp e geolocalização do servidor, nunca do device.** Elimina manipulação do relógio e adulteração de timestamp de uma vez; GPS spoofing vira flag por inconsistência IP↔GPS.

8. **Regra de plausibilidade fisiológica automática** (flag/bloqueio acima de ~1% do peso/semana ou perdas impossíveis tipo 18 kg em 20 dias) + curva intermediária coerente exigida. Uma regra simples que encaminha à revisão humana os maiores casos de fraude por swing/depleção.

9. **Termo de uso antifrágil + metas robustas ao swing**: regras explícitas de protocolo, proibição de meios médicos/cirúrgicos não declarados (GLP-1, bariátrica, lipo), cláusula de perda por fraude, e meta/prazo dimensionados para que o swing de água/intestino não baste para ganhar. Elimina ambiguidade e zera o EV do goal-gaming.

10. **KYC + liveness amarrados à conta no onboarding, titularidade do Pix = titular do KYC, e revisão humana obrigatória para payout alto/flags com checklist anti-engenharia-social.** Fecha conta compartilhada/vendida, laranjas no Pix e o suporte como vetor de social engineering — tudo com ferramentas já contratadas de terceiros.

---

_Documento gerado a partir da auditoria interna e do dossiê do ecossistema Charya. Objetivo declarado do programa antifraude: não eliminar 100% da fraude (inviável), e sim torná-la **difícil, cara e economicamente inviável** na média._
