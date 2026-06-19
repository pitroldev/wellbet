# Charya Bet — Mecanismo de Validação de Peso (MVP)

> **Escopo:** especificação técnica de **como cada item de uma pesagem é validado** na primeira versão do produto. Captura limitada a **smartphone** — sem balança conectada, sem wearables, sem HealthKit/Health Connect.
>
> **Documento irmão:** [Threat Model — Comprovação de Peso](./Charya_Threat_Model_Comprovacao_de_Peso.md).

---

## 1. Como ler este documento

Cada validação é especificada com o mesmo template:

- **Entrada** — qual dado/sinal chega.
- **Extração** — como o sinal é obtido do vídeo/payload.
- **Lógica de validação** — o cálculo/regra concreta que decide.
- **Decisão** — limiares e mapeamento para `PASS` / `PENDENTE` / `FAIL`.
- **Automação no MVP** — o que roda sozinho vs. o que cai para revisão humana (honesto sobre os limites do MVP sem visão computacional pesada).

Convenção de saída em três estados:
- `PASS` — segue no automático.
- `PENDENTE` — escala para revisão humana ou recaptura (não é reprovação).
- `FAIL` — invalidação automática (raro; só onde a regra é inequívoca).

---

## 2. Payload de uma captura

O que o app envia ao servidor por pesagem (`T0`, `T1` ou `T2`):

| Campo | Origem | Uso na validação |
|---|---|---|
| `video` | gravação in-app contínua | V1–V7 |
| `session_id` | servidor (início da captura) | vincula nonce/desafios |
| `nonce` exibido | servidor → renderizado na captura | V1 |
| `declared_weight` | input do usuário | V4 |
| `device_meta` | SO/SDK (timestamp, modelo, sensores) | V2, V8 |
| `liveness_payload` | SDK do provider de KYC | V6 |
| `scale_ref` | cadastro (foto/marca/modelo no onboarding) | V5, V7 |

**Regra dura:** o vídeo é gravado **pela câmera dentro do app** (não upload da galeria). Upload de arquivo externo → `FAIL` imediato. Isso ancora todas as demais validações no tempo e no dispositivo.

---

## 3. Validações de captura (item a item)

### V1 — Código dinâmico (anti-replay)

- **Entrada:** `nonce` emitido pelo servidor `{token alfanumérico + número + gesto}`, com `issued_at`, `ttl`, `used=false`; e o vídeo onde ele deve aparecer.
- **Extração:** OCR na região do vídeo onde o nonce é exibido sobre o visor → string lida. Detecção do gesto (mão levantada etc.).
- **Lógica de validação:**
  1. **Match textual:** `edit_distance(OCR_nonce, nonce_emitido) ≤ 1` (tolera 1 erro de OCR). Falha → não bate.
  2. **Frescor (TTL):** `upload_time − issued_at ≤ ttl` **e** timestamp interno do vídeo dentro da janela. Fora → replay/pré-gravação.
  3. **Uso único:** `used == false`; após validar, marca `used=true`. Nonce reusado → `FAIL`.
  4. **Gesto:** presença do gesto pedido no vídeo.
- **Decisão:** match textual + TTL + uso único OK → `PASS`. Qualquer um falho → `PENDENTE`. Nonce reusado ou expirado → `FAIL`.
- **Automação no MVP:** itens 1–3 são **automáticos**. O **gesto (item 4) é verificado em revisão humana** quando há gatilho — detecção automática de pose fica para Fase 2. O nonce ser **gerado no servidor e imprevisível** é o que garante que um vídeo pré-existente não pode contê-lo; é isso que entrega o anti-replay mesmo com gesto manual.

### V2 — Continuidade do vídeo (anti-edição / anti-corte)

- **Entrada:** arquivo de vídeo + faixa de áudio + metadados de container.
- **Extração:** parsing do container (átomos/boxes MP4), trilha de timestamps (PTS/DTS), série de frames e waveform de áudio.
- **Lógica de validação (sinais combinados):**
  1. **Estrutura do container:** presença de marcas de re-encode/edição (ex.: `moov`/`mdat` reordenados, múltiplos editores, GOP irregular). Reencode dupla compressão → flag.
  2. **Monotonicidade temporal:** PTS/DTS contínuos e crescentes; `frame_count ≈ fps × duração`. Lacunas → corte.
  3. **Detecção de corte de cena:** diferença frame-a-frame (histograma/hash perceptual); pico abrupto fora de movimento natural → emenda.
  4. **Continuidade de áudio:** ruído ambiente contínuo; descontinuidade na waveform coincidente com pico de vídeo → splice.
  5. **Origem in-app:** `device_meta` confirma gravação pela câmera do app (V2 ancora em §2).
- **Decisão:** todos os sinais consistentes → `PASS`. ≥1 sinal de descontinuidade → `PENDENTE`. Upload externo / reencode evidente de editor → `FAIL`.
- **Automação no MVP:** sinais 1, 2, 4, 5 são **automáticos** (análise de container/timestamps/áudio é barata e determinística). Sinal 3 (corte de cena) roda automático com limiar conservador e, na dúvida, escala.

### V3 — Leitura do visor (OCR do peso)

- **Entrada:** trecho do vídeo com o visor da balança estabilizado.
- **Extração:** localização da região do display → OCR dos dígitos em **N frames consecutivos**.
- **Lógica de validação:**
  1. **Estabilidade:** os N frames precisam concordar (mesmo número) por ≥ `T_estável` segundos. Número oscilando/não estabiliza → leitura inválida.
  2. **Confiança do OCR:** score do OCR ≥ limiar; senão, leitura ambígua.
  3. **Plausibilidade de formato:** valor com 1 casa decimal, dentro de faixa fisiológica de peso humano.
- **Decisão:** leitura estável + confiável + bem formada → `PASS` e produz `OCR_weight`. Instável/ambígua → `PENDENTE` (pede recaptura ou revisão).
- **Automação no MVP:** **automático** (OCR como serviço ou lib embarcada). `OCR_weight` alimenta V4.

### V4 — Visor vs. peso declarado

- **Entrada:** `OCR_weight` (de V3) e `declared_weight` (input do usuário).
- **Lógica de validação:** `|OCR_weight − declared_weight| ≤ tol_visor`.
- **Decisão:** dentro da tolerância → `PASS`. Fora → `PENDENTE` (divergência entre o que a pessoa digitou e o que o visor mostra).
- **Automação no MVP:** **automático**. `tol_visor` calibrado (§9).

### V5 — Tipo de balança (digital obrigatório)

- **Entrada:** frames do visor + `scale_ref` do onboarding.
- **Extração:** classificação visual do display.
- **Lógica de validação:** display de **7 segmentos / numérico digital** → aceito. **Ponteiro/mostrador analógico** → bloqueado (não há como conferir dígito estável nem OCR confiável).
- **Decisão:** digital → `PASS`. Analógica/ponteiro → `FAIL` no envio (regra dura, comunicada no onboarding).
- **Automação no MVP:** classificador simples **automático**; casos ambíguos → `PENDENTE`.

### V6 — Liveness + continuidade de identidade

- **Entrada:** `liveness_payload` do SDK do provider (KYC) em `T0`, `T1`, `T2`.
- **Extração:** o provider retorna **score de liveness** + **template facial** por captura.
- **Lógica de validação:**
  1. **Liveness:** score ≥ limiar do provider (rejeita foto-de-foto, máscara, replay de tela).
  2. **Face match longitudinal:** `similaridade(template_Ti, template_T0) ≥ limiar` para `i ∈ {1,2}`. Rosto diferente entre capturas → substituição de sujeito.
- **Decisão:** liveness OK **e** match OK nas 3 → `PASS`. Liveness baixo ou mismatch → `PENDENTE`.
- **Automação no MVP:** **comprado/automático** (Onfido / Unico / Persona / Sumsub / Veriff / idwall). Roda **só nas 3 capturas**, não continuamente, para conter custo.

### V7 — Integridade de cena (enquadramento normativo)

Roteiro de captura obrigatório; cada item abaixo é um sub-sinal. No MVP, a **presença** de cada frame exigido é checada automaticamente (existe/não existe), e a **interpretação fina** é dirigida à revisão humana quando há gatilho.

| Sub-item | Como é validado | Automático no MVP? |
|---|---|---|
| **Balança vazia em 0,0** | Frame sem pés sobre a balança + OCR == `0.0` antes da subida | Sim |
| **Base/piso visível** | Frame mostrando os 4 pés apoiados em piso plano | Presença: sim · nivelamento: humano |
| **Corpo inteiro na subida** | Frame com corpo completo, mãos visíveis, sem apoio | Presença: sim · apoio/descarga: humano |
| **Visor em close estabilizando** | V3 (estabilização do zero ao peso) | Sim |
| **Rosto no quadro** | Entrada para V6 | Sim |

- **Decisão:** todos os frames exigidos presentes + sub-sinais automáticos OK → `PASS`. Frame faltante → `PENDENTE` (recaptura). Sinal fino suspeito → gatilho de revisão (§5).
- **Automação no MVP:** detecção de **presença** de cada frame é automática; detecção fina de apoio corporal, nivelamento de piso e visor sobreposto depende de inspeção humana — visão computacional dedicada é Fase 2.

### V8 — Objeto de peso conhecido (calibração ad-hoc do instrumento)

- **Entrada:** duas leituras na **mesma** captura — pessoa sozinha `R1` e pessoa+objeto `R2` (ou objeto sozinho), com `W_ref` esperado conhecido pelo servidor.
- **Extração:** V3 aplicado às duas leituras → `R1`, `R2`.
- **Lógica de validação:** massa medida do objeto `W_medido = R2 − R1`. Checa `|W_medido − W_ref| ≤ δ`.
- **Fundamento:** adulterações de instrumento (calibração viciada, calço, inclinação, piso instável, visor falso, ímã) são **distorções aditivas/multiplicativas sobre toda leitura** — logo corrompem também `W_ref`. Uma balança que mente para o corpo mente para o objeto, e a diferença `R2 − R1` denuncia.
- **Decisão:** dentro de `δ` → `PASS` (instrumento confiável naquele ponto). Fora → `PENDENTE` (balança suspeita).
- **Automação no MVP:** **automático** (depende só de V3 + aritmética). É o controle de maior cobertura sobre a categoria "instrumento/visor" do threat model.

---

## 4. Validações longitudinais (engine de plausibilidade)

Rodam sobre a **série** `{(W0,t0),(W1,t1),(W2,t2)}` e o perfil do usuário. Engine proprietário ("Engine CHARYA", **construído**).

### V9 — Taxa de perda fisiológica

- **Entrada:** pesos e datas das capturas + perfil (peso inicial, sexo, faixa).
- **Lógica de validação:** taxa `Δ/semana = (W_i−W_j)/semanas`. Compara contra limite fisiológico por perfil (referência usual: ordem de ~1% do peso corporal/semana como teto saudável; parâmetro calibrável).
  - `Δ/semana ≤ limite_flag` → ok.
  - `limite_flag < Δ/semana ≤ limite_duro` → **flag** (escala).
  - `Δ/semana > limite_duro` (perda fisicamente impossível na janela) → bloqueio.
- **Decisão:** ok → `PASS`; flag → `PENDENTE`; impossível → `FAIL`.
- **Automação no MVP:** **automático**. Pega "perdi 18 kg em 20 dias" e baseline inflado.

### V10 — Regularidade da curva (anti-maquiagem)

- **Entrada:** os 3 pontos da série.
- **Lógica de validação:** ajusta a trajetória e mede **resíduo/variância**. Perda real é ruidosa (água, intestino, hora do dia); uma curva **excessivamente linear/suave** (resíduo perto de zero, `T1` "encaixado demais") indica peso intermediário **calibrado** para legitimar a curva.
  - Variância dos resíduos abaixo de um piso → flag de artificialidade.
- **Decisão:** dentro do esperado → `PASS`; suave demais → `PENDENTE`.
- **Automação no MVP:** **automático**. Com só 3 pontos é um sinal fraco isolado — usado **em conjunto** com V9 e V11, não como veredito único.

### V11 — Consistência inter-captura

- **Entrada:** atributos de cena/sujeito comparáveis entre `T0/T1/T2` (rosto via V6, cenário/balança via V5/V7).
- **Lógica de validação:** descontinuidade fora da tendência — rosto que não casa (já em V6), cômodo/balança diferentes, salto de peso inconsistente com a trajetória → flag.
- **Decisão:** consistente → `PASS`; descontínuo → `PENDENTE`.
- **Automação no MVP:** parcial — face match é automático (V6); cenário/balança é heurística + revisão humana.

---

## 5. Orquestração e gatilhos

Ordem de execução (curto-circuita para revisão na primeira falha relevante):

```
V1..V8 (captura)  ─►  V9..V11 (longitudinal)  ─►  gatilhos  ─►  veredito
   determinístico         engine                  política
```

**Gatilhos que forçam revisão humana (Camada 3):**
- `T2` que **gera payout** → revisão **obrigatória (100%)**.
- Qualquer validação em estado `PENDENTE`.
- `payout > threshold_valor` → revisão mesmo sem flag (tolerância inversa ao prêmio).
- Flag combinada de V9+V10+V11 (sinais fracos somados).

**Política de incerteza:** na dúvida, **`PENDENTE` — nunca `PASS` automático**. Isso minimiza simultaneamente falso aprovado (pagar fraude) e falso reprovado (punir honesto por captura ruim).

---

## 6. Máquina de estados do veredito

| Estado | Como se chega | Ação |
|---|---|---|
| `APROVADO` | Todas as validações `PASS` e nenhum gatilho. | Settlement segue. |
| `PENDENTE` | ≥1 validação `PENDENTE` ou gatilho. | Fila de revisão humana / recaptura orientada → reavalia. |
| `REPROVADO` | ≥1 validação `FAIL` ou revisão humana confirma fraude. | Recusa conforme termos da aposta. |

---

## 7. O que é automático vs. humano no MVP (resumo)

| Validação | Automático | Humano (por gatilho) |
|---|---|:---:|:---:|
| V1 nonce (texto/TTL/uso único) | ✅ | gesto |
| V2 continuidade de vídeo | ✅ | borderline |
| V3 OCR do visor | ✅ | — |
| V4 visor vs. declarado | ✅ | — |
| V5 tipo de balança | ✅ | ambíguo |
| V6 liveness + face match | ✅ (buy) | — |
| V7 integridade de cena | presença ✅ | apoio/piso/visor |
| V8 objeto de peso conhecido | ✅ | — |
| V9 taxa de perda | ✅ | flag |
| V10 regularidade da curva | ✅ | flag |
| V11 consistência inter-captura | parcial | cenário/balança |

---

## 8. Cobertura vs. threat model

| Validação | Vetores neutralizados |
|---|---|
| V1, V2 | replay, vídeo reaproveitado, deepfake, edição/corte |
| V8, V3, V4, V5 | balança/visor adulterados, calço, ímã, piso desnivelado/inclinado, balança de ponteiro |
| V7 | truques de corpo (apoio/descarga), manipulação de piso, visor falso |
| V6 | substituição de pessoa, troca de identidade |
| V9, V10, V11 | "peso de água", baseline inflado, maquiagem de curva, metas impossíveis |
| Gatilhos | residual de alto valor, anomalias não cobertas pelo automático |

**Risco residual conhecido:** o "peso de água" (manipulação hídrica/glicogênio) **não é detectável por nenhuma validação de captura** — o corpo é real, o vídeo é honesto, a balança está correta. Depende exclusivamente de V9–V11 + janela de pesagem sorteada. Permanece o vetor de maior atenção do MVP.

---

## 9. Parâmetros a calibrar (pré-lançamento)

Definidos com piloto/dados, não fixados aqui:

| Parâmetro | Validação | Significado |
|---|---|---|
| `δ` | V8 | tolerância do objeto de referência |
| `tol_visor` | V4 | divergência OCR × peso declarado |
| `N`, `T_estável` | V3 | frames/segundos para leitura estável |
| `ttl` | V1 | janela de validade do nonce |
| `edit_distance` máx | V1 | tolerância de OCR no nonce |
| `limite_flag`, `limite_duro` | V9 | taxa de perda flag vs. bloqueio |
| piso de variância | V10 | quão "suave demais" dispara flag |
| limiares liveness/face match | V6 | definidos com o provider |
| `threshold_valor` | §5 | payout que força revisão |
| meta % automático | §5 | alvo de pesagens resolvidas sem humano |
