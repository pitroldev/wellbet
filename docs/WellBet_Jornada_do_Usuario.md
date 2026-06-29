# WellBet — Jornada do Usuário (app mobile)

> Como o usuário atravessa o app, do primeiro toque ao "deu green" (ou à perda).
> Este doc define a **jornada-norte** e os princípios que a guiam. É par do
> [Manual de Marca](./WellBet_Manual_de_Marca_e_Voz.md) (a voz) — aqui mora o **fluxo**.
>
> **Por que existe:** o fluxo atual está, nas palavras do fundador, "bugado e sem
> sentido". O diagnóstico (§1) confirma — o app não tem **espinha**. Este doc
> redesenha a jornada para que ela **nunca deixe o usuário perdido**.
>
> **Escopo do MVP (decidido):**
>
> - **2 pesagens:** uma no **começo** (baseline) e uma no **fim** (final). Sem
>   intermediária por enquanto.
> - **Fluxo do dinheiro: PESAR → PAGAR** (a pesagem inicial vem antes do pagamento —
>   ver §2, com o racional).
> - **Revisão 100% manual** (uma pessoa confere cada vídeo). Automação é evolução.

---

## 0. Os três pilares (e as três referências)

Toda decisão de fluxo passa por três filtros, em ordem de prioridade.

### 1. PROATIVA — o app sabe o próximo passo antes de você perguntar

Você nunca chega numa tela sem saber o que fazer. O app **puxa** você: diz quando
pesar, lembra do prazo, mostra a única próxima ação. Se existe um próximo passo, ele
está na sua cara.

### 2. TRANSPARENTE — nada escondido, principalmente o dinheiro e a verdade

O estado é sempre visível: quanto está em jogo, quantos dias faltam, em que pé está a
revisão, de onde vem o prêmio. A honestidade radical do manual vira **estado de tela**.

### 3. DIDÁTICA — o app te ensina a ganhar (o pilar mais importante)

WellBet é difícil de propósito (você pode perder dinheiro). Então o app **ensina**: o
que é a aposta, por que cada passo da pesagem existe, o que vem depois. Na hora certa,
em pedaços pequenos, com feedback imediato. Quem entende o jogo **confia** e **ganha**.

### As referências (e o que tiramos de cada uma)

| Ref                      | Pilar que reforça       | O que roubamos                                                                                                                                                                                                                   |
| ------------------------ | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Duolingo** (a espinha) | Didática + Proativa     | O **caminho** linear (sempre se sabe o próximo nó); onboarding **valor-primeiro**; **um** CTA gigante por tela; **streak** com aversão à perda; micro-lições com feedback na hora; a coruja que lembra.                          |
| **MyFitnessPal**         | Transparente + Proativa | O **hábito de registro** (check-ins); o **gráfico de tendência** do peso (estou no rumo?); o nudge de "completar o dia".                                                                                                         |
| **DOOM**                 | Transparente + Proativa | O **HUD** sempre na tela (vida/munição = dias/R$ em jogo); **momentum pra frente** (nunca travado, sempre a próxima luta); feedback **visceral e brutal** (o soco do "DEU GREEN", o peso da perda) — a personalidade Desafiante. |

> **A frase-norte:** WellBet é um **treinador de combate** (DOOM) que ensina como um
> **professor** (Duolingo) e mostra o placar como um **diário honesto** (MFP). Sempre
> o próximo passo. Sempre a verdade. Sempre ensinando.

---

## 1. Diagnóstico — por que o fluxo atual não faz sentido

O mapa do app atual (rotas `app/`) revelou 13 problemas. Agrupados pelo pilar que
violam — cada um é uma dívida que a jornada-norte precisa pagar:

### Sem espinha proativa (o usuário não sabe o que fazer)

- **A home não reflete a aposta.** `app/index.tsx` é estática: 4 botões + histórico.
  Não mostra se há aposta ativa, stake em jogo, prazo, meta nem progresso. Num app de
  aposta, a tela central não comunica "o que está rolando". _(quebra J)_
- **Sem cadência nem prazo.** As pesagens são derivadas só por **contagem**
  (`useActiveWeighInTarget.ts:36-40`). Dá pra fazer todas em 5 minutos. A dimensão
  temporal — o coração de "pesagem no começo e no fim" — **não existe no cliente**. _(E)_
- **Criou aposta e pagou → nenhum feedback.** A tela de Pix mostra o BR Code e só
  "voltar para Home". Sem polling, sem "aguardando → ativa". O usuário não sabe se a
  aposta abriu. _(I)_

### Sem transparência de estado (a verdade fica escondida)

- **A tela de desfecho da aposta (bateu/não bateu → Pix) NÃO EXISTE.** O fluxo termina
  em `/weighin` "done" → "Aguarde o resultado" e acabou. A promessa central do produto
  não tem destino. _(F)_
- **A recompensa celebra tudo.** `result.tsx` dispara confete + som de vitória +
  háptico "Success" **sempre** — inclusive na pesagem inicial e sem saber se o peso
  caiu. Dopamina enganosa — o que o manual proíbe. _(G)_

### Sem didática (o app não ensina — e o erro custa caro)

- **O guia das 6 etapas trava na etapa 1.** `nextStep()` nunca é chamado em produção;
  o overlay fica eterno em "Etapa 1 de 6". O roteiro **não avança**. _(C)_
- **Perfil é pré-requisito mas está fora do caminho.** A API exige `taxId`/`pixKey` pra
  apostar, mas o onboarding não leva ao perfil e `/bet/new` não redireciona. O novato:
  onboarding → aposta → **erro genérico** sem rota pra resolver. _(H)_
- **Onboarding é beco de mão única.** Sem voltar; e "Como funciona" reusa o fluxo de
  primeiro acesso em vez de uma ajuda dedicada. _(M)_

### Fundação quebrada (a casa sem alicerce)

- **Não há login/sessão.** `tokenStore.save()` nunca é chamado; nenhuma request leva
  `Authorization`. Logo `/me`, `/bets`, `/weighins`, `start/submit` **todos falham**
  (401) → o app **sempre cai em "no-bet"**, em silêncio. É o problema-raiz. _(A)_
- **Retry de erro é loop morto.** Em erro, "tentar de novo" faz `replace("/weighin")`
  sem resetar o store → remonta em `error` pra sempre. _(B)_
- **Estados-fantasma.** `CapturePhase` define `uploading/done/instructions` que nada
  seta; não há tela de instruções no fluxo. _(D)_
- **`bet`/`profile` fora do Stack raiz** (`_layout.tsx:64-66`). _(K)_
- **Marca inconsistente** — "Charya" (`bet/new.tsx:104`) vs "WellBet". _(L)_

> **Leitura:** o app tem **peças boas isoladas** (a captura por vídeo, o Pix, o
> histórico) mas **nenhum fio** que as costure. A solução não é mais telas — é uma
> **espinha**: um HUD que sempre mostra o estado e sempre aponta o próximo passo.

---

## 2. A decisão do fluxo do dinheiro: PESAR → PAGAR

Duas ordens possíveis. A escolha define a primeira impressão e a honestidade da aposta.

- **`pagar → pesar`** — paga primeiro, depois faz a pesagem inicial.
- **`pesar → pagar`** — faz a pesagem inicial (baseline), **depois** monta o bilhete e
  paga. ← **é a nossa.**

### Por que `pesar → pagar` (ancorado nas referências e pilares)

1. **Valor-primeiro (Duolingo) — o argumento decisivo.** O Duolingo te faz fazer uma
   lição **antes** de pedir cadastro. Aqui, o usuário faz o **ritual real** (uma
   pesagem de verdade) e **aprende o protocolo** antes de arriscar um centavo. Confiança
   é conquistada **antes** de pedir dinheiro — o maior gargalo de "dar Pix contra si
   mesmo" cai. Sim, alguns vão pesar e não pagar; quem paga é mais qualificado e confia.
2. **Transparente — a aposta nasce de um número COMPROVADO.** Você aposta contra um
   peso inicial **verificado por vídeo**, não contra um chute. A meta fica honesta e
   bem-calibrada: _"Você está em 90,0 kg — comprovado. Aposte em chegar a 84,0."_ No
   `pagar → pesar`, a meta é montada sobre um peso auto-declarado que pode não bater.
3. **Didática — a primeira pesagem é a aula, em modo "treino".** O usuário aprende o
   roteiro de 6 passos quando ainda **não tem dinheiro em jogo** (baixa pressão), e
   aplica a habilidade já treinada quando conta. Rodinhas primeiro, depois a corrida.
4. **MFP — registra o número real antes de definir a meta.** Logar o ponto de partida
   e só então mirar o alvo é o fluxo natural de quem acompanha peso.
5. **DOOM / momentum.** Na hora de pagar, você **já agiu** (já pesou). O pagamento é
   um passo pra frente de quem já está investido — não um pedido frio na cara dura.

### O trade-off (e por que não nos custa nada)

O único contra: na pesagem inicial **não há dinheiro em jogo** — isso enfraquece a
honestidade do baseline? Não, porque:

- O baseline é **revisado por humano** com o protocolo completo (é o evento mais
  escrutinado do produto — é onde mais se tenta inflar o peso inicial).
- A meta é **relativa ao baseline verificado** — inflar o número de partida não te dá
  vantagem óbvia (a régua sobe junto).
- O risco de gamear o baseline existe **igual** no `pagar → pesar` (sempre há um
  baseline pra gamear). Logo não perdemos nada — e ganhamos os 5 pontos acima.

> **Resumo:** pesar antes de pagar transforma o momento de maior fricção (o Pix) no
> momento de maior **confiança** (você já viu o ritual funcionar e já sabe seu número).

---

## 3. A jornada-norte (o "caminho" do Duolingo)

A jornada inteira é uma **trilha linear** — como a árvore do Duolingo. Em cada nó o
usuário sabe onde está e qual é o **próximo passo único**. Nunca há beco.

```
 ┌FASE 0┐ ┌─ FASE 1 ─┐ ┌FASE 2┐ ┌── FASE 3 ──┐ ┌── FASE 4 ──┐
 DESCOBERTA→ ONBOARDING → CONTA → PESAGEM      → BILHETE+PIX
 (landing)   (entender,   (login)  INICIAL        (meta+valor,
              simular)             (baseline,      PAGAR →
                                    grátis)         ATIVA)
                                                       │
 ┌──────── FASE 5: PERÍODO ATIVO (o loop) ────────────┘
 │  HUD (home) · check-ins opcionais (MFP) · lembretes · streak
 │                                                          │
 └──── janela sorteada perto do fim ──→ FASE 6: PESAGEM FINAL
                                                            │
 ┌─ FASE 7 ─┐ ┌──── FASE 8 ────┐ ┌── FASE 9 ──┐            │
  VEREDITO  ← REVISÃO MANUAL ←──┘                          │
     │                                                      │
     └──→ DESFECHO (deu green / não bateu → Pix) → RE-ENGAJAMENTO
```

Cada fase segue o molde: **objetivo · proativo · transparente · didático · telas ·
copy · referência**.

---

### FASE 0 — Descoberta

**Objetivo:** entender em 10 segundos e instalar. _(vive na landing; aqui só a
continuidade de voz.)_ O app **abre na mesma frase** da landing — sem ruptura de tom.
Quem instala já sabe que pode perder (a perda é nomeada desde a landing).

---

### FASE 1 — Onboarding educacional (valor primeiro, à la Duolingo)

**Objetivo:** "entender se isso é pra mim" — sem ainda gastar nada.

**Proativo:** conduz, uma tela por ideia, um CTA só. Nunca um muro de texto.

**Transparente:** mostra os **dois desfechos** lado a lado (já em `(onboarding)/index.tsx`):
✓ bateu → de volta + bolo / ✗ não bateu → vai pro bolo. Nomeia a perda **antes** de
pedir qualquer coisa.

**Didático (o núcleo):** ensina o mecanismo em 3 micro-lições estilo Duolingo:

1. **O que é** — "Você aposta na sua meta. Em você, não na sorte."
2. **Como se ganha** — "Bate a meta no prazo → de volta + a fatia do bolo de quem
   desistiu." (bilhete-exemplo com números, rotulado `SIMULAÇÃO`).
3. **A prova** — "Cada pesagem é um vídeo revisado por gente. É o que faz o green ser
   seu de verdade." (preview do roteiro — sem ainda gravar).

**Valor-primeiro:** deixe **simular um green** antes de pagar — meta fictícia, "como
seria". Engaja sem custo. Marca-d'água `SIMULAÇÃO` o tempo todo (Manual §6.7).

**Copy:**

> Eyebrow `BORA?` · Título **"Quanto você apostaria em você?"**
> CTA **"Ver como funciona"**

**Ref:** Duolingo (micro-lições + valor antes do compromisso + 1 CTA).

---

### FASE 2 — Conta (a fundação que falta)

**Objetivo:** ter uma identidade no app — leve, sem fricção de KYC pesado.

**Proativo:** depois de entender o jogo, "cria sua conta em 30 segundos pra começar a
pesar". O mínimo pra ter sessão e salvar progresso.

**Didático/transparente:** explica que a **identidade fina** (é você mesmo) vem da
**própria pesagem em vídeo** — no MVP, o revisor humano confere. Sem pedir documento/
liveness comprado agora (isso é evolução). A chave Pix entra **na hora de pagar**
(Fase 4), não aqui — menos fricção antes do valor.

**Telas:** **nova** — `auth/` (entrar/criar conta; grava o token — corrige §1/A).

**Ref:** Duolingo (cadastro mínimo, tardio, indolor).

---

### FASE 3 — Pesagem inicial / baseline (grátis, a aula completa)

**Objetivo:** registrar o ponto de partida verificado — **antes** de pagar.

**Proativo:** "Vamos ver de onde você parte. Pesa aí — é de graça, sem nada em jogo
ainda." Conduz direto.

**Transparente:** "Esse é o seu número de partida. É daqui que a gente mede — honesto
agora, justo no fim."

**Didático (primeira vez = aula completa):** a estreia ensina o roteiro de 6 passos
**com o passo avançando de verdade** (corrige §1/C): rosto → código+gesto → balança
zerada (0,0) → piso/base → subir sem apoio → visor em close. Cada passo com o **porquê**
("a balança vazia em 0,0 prova que ela não está viciada"). Da pesagem final em diante,
o guia encolhe — as rodinhas saem (Duolingo).

**Tom:** **sóbrio, funcional** — é prova, zero dopamina (Manual §4). A festa fica pro
desfecho.

**Revisão manual:** o vídeo vai pra fila; se vier `PENDENTE`, recaptura orientada. O
baseline precisa ser válido antes da aposta travar.

**Telas:** `weighin/index.tsx` + `CameraCapture.tsx` (consertar avanço de passo) + uma
**tela de instruções** real antes de gravar (preenche o estado-fantasma `instructions`,
§1/D).

**Ref:** Duolingo (lição passo-a-passo com feedback; rodinhas que somem).

---

### FASE 4 — Montar o bilhete + pagar (o compromisso, ancorado no número real)

**Objetivo:** virar o número verificado em aposta: meta + prazo + valor + Pix.

**Proativo:** com o baseline na mão, o app já propõe: "Você está em 90,0 kg. Que tal
perder 6 kg em 8 semanas?" — sugere uma meta **saudável e robusta** (o produto rejeita
metas triviais de ~4-5%, que cabem na variação de água). Ajuda a escolher, não deixa
errar.

**Transparente:** o **bilhete vivo** atualiza enquanto o usuário mexe — meta, prazo,
valor em jogo e os dois desfechos. Enquadra pela **perda** ("Em jogo: R$ 200"), nunca
por multiplicador inventado (Manual §5.4).

**Didático:** a escala de valor com tom desafiante — _"um empurrãozinho → agora dói
desistir → sem desculpa"_ (Manual §11). Ensina: stake maior = mais **compromisso**, não
"mais prêmio garantido".

**Pix + ATIVAÇÃO (corrige §1/I):** pede a **chave Pix** (mesmo titular — regra
anti-laranja), mostra o BR Code, e **fica na tela "aguardando seu Pix"** com status ao
vivo → quando cai, anima pra **"APOSTA ATIVA"** e empurra pra Fase 5. Nunca mais "pague
e se vire".

**Telas:** `bet/new.tsx` (evoluir o form num bilhete vivo) + tela de ativação.

**Copy:**

> CTA **"Apostar R$ 200 em mim"** (1ª pessoa) · Pós-Pix **"Tá valendo. Seu R$ 200 está
> em jogo."**

**Ref:** Duolingo (setup do "daily goal") · MFP (meta com pace saudável).

---

### FASE 5 — O período ativo (o loop — onde o app vive)

**Objetivo:** manter o usuário no rumo entre o baseline e a final. Com só 2 pesagens
oficiais, é aqui que o engajamento diário se sustenta — sem inflar a quantidade de
vídeos revisados.

**Proativo:** o HUD na home (§4) mostra o estado e a próxima ação. Conforme o prazo se
aproxima, o app **sorteia a janela** da pesagem final ("pese nas próximas 12h") e
**notifica** — o usuário não escolhe o dia (regra do produto + anti-fraude). É a coruja
do Duolingo com função real.

**Transparente:** HUD sempre com **R$ em jogo · dias restantes · progresso pra meta**.

**Didático + hábito (MFP):** **check-ins opcionais** — o usuário pode registrar o peso
de forma **informal** (não conta como pesagem oficial, não vai pra revisão) só pra ver
o **gráfico de tendência** e saber se está no rumo. Isso cria o hábito diário do MFP e
alimenta nudges no tom de treinador ("faltam 2 kg e 9 dias — dá, se não afrouxar no fim
de semana"), nunca culpa de corpo. O **streak** vive aqui (check-ins/dias no rumo) e
entre apostas (Fase 9).

**Telas:** o HUD (home) + tela de check-in informal + o gráfico.

**Ref:** DOOM (HUD + momentum) · MFP (gráfico + hábito de log) · Duolingo (streak).

---

### FASE 6 — Pesagem final (a prova que vale o prêmio)

**Objetivo:** comprovar o peso final, dentro da janela sorteada.

**Proativo:** a final só abre **dentro da janela** perto do prazo; fora dela, o app
explica quando abre (em vez de deixar pesar a qualquer hora, §1/E).

**Didático:** o roteiro já é familiar — guia enxuto (rodinhas off). Mesmo rigor do
baseline.

**Tom:** sóbrio. É o momento de máxima tentação de fraude e de máxima prova — não é hora
de festa ainda.

**Transparente (pós-envio, corrige §1/F e G):** a tela **não festeja** — diz o estado:

- `EM REVISÃO` — "Seu vídeo está na fila. A gente confere e te avisa." (sem confete)
- `PENDENTE` — "Faltou um trecho. Bora regravar — leva 1 minuto." (recaptura orientada)
- `REPROVADO` — direto, com o porquê e o próximo passo, sem humilhar.
- `APROVADO` → segue pro **veredito da aposta** (Fase 8).

**Telas:** `weighin/result.tsx` deixa de ser "confete sempre" e reflete o **veredito
real**; some o háptico de vitória no baseline (§1/G).

**Ref:** Duolingo (feedback que corrige) · Manual (dopamina só na vitória real).

---

### FASE 7 — Revisão manual (bastidor, mas comunicado)

**Objetivo (do usuário):** saber que está sendo conferido e quando sai.

No MVP, **uma pessoa revisa 100%** dos vídeos com checklist: vídeo contínuo (sem corte,
origem in-app), código+gesto certos, balança zerada, piso ok, sem apoio, visor íntegro,
**mesma pessoa** (compara o vídeo do baseline com o da final), e plausibilidade.

**Transparente:** o app mostra "em revisão" honestamente e **avisa** (push) quando sai.
Não promete prazo que não cumpre; diz a faixa real ("costuma sair em até X h").

**Ref:** Manual (a revisão humana é credibilidade — repita sem medo).

---

### FASE 8 — Desfecho da aposta (a tela que não existe hoje)

**Objetivo:** fechar o ciclo — ganhou ou perdeu, e o dinheiro se move. **É a maior
lacuna do app (§1/F).**

**Transparente — tela de settlement explícita:**

- **DEU GREEN:** "Você bateu. R$ 200 de volta + R$ 73 do bolo. Cai no seu Pix." Mostra
  **de onde veio** ("sem mágica: o prêmio vem de quem desistiu", Manual §11). Festa
  honesta: confete, "DEU GREEN" em verde, som — **agora** é a hora (§6).
- **NÃO BATEU:** sem humilhação, com verdade: "Não rolou dessa vez. Seu R$ 200 vai pro
  bolo de quem conseguiu." E **imediatamente** o caminho pra frente (Fase 9).

**Proativo:** push quando o resultado sai, levando direto à tela.

**Transparência do dinheiro:** se houver **retenção/payout escalonado** (parte
condicionada a manter o peso por algumas semanas — regra anti-sanfona do produto), isso
aparece claro: "Metade agora, metade quando você mantiver por 3 semanas." Nunca um
"pendente" mudo.

**Telas:** **nova** — `bet/result` (ou `settlement`). Hoje inexistente.

**Ref:** DOOM (o soco do desfecho) · Manual (honestidade do prêmio e da perda).

---

### FASE 9 — Re-engajamento

**Objetivo:** transformar um ciclo em hábito.

**Proativo:** ganhou ou perdeu, o app oferece **a próxima aposta** na hora, com o
streak (de apostas concluídas) como continuidade. "Você manteve a meta. Próxima?"

**Didático/honesto:** o produto **penaliza abandono e re-rolagem de baseline** (não dá
pra desistir e recriar pra baixar a régua). O app explica a regra com naturalidade, não
como punição-surpresa.

**Ref:** Duolingo (o streak de longo prazo — o vício saudável do hábito).

---

## 4. A tela-casa = o HUD (DOOM) + a home do Duolingo

A home é onde tudo desanda hoje (estática, muda — §1/J). Ela vira o **centro de
comando**: em 1 segundo o usuário vê o estado e a próxima ação. Mock (estado "aposta
ativa, no período"):

```
┌──────────────────────────────────┐
│  WELLBET                  perfil ▸│
│                                   │
│ ┌─ EM JOGO ──────────────────────┐│   ← HUD persistente (DOOM)
│ │  R$ 200   ·   12 dias   ·  🔥 5 ││     stake · prazo · streak
│ └────────────────────────────────┘│
│                                   │
│  META · PERDER 6 KG               │   ← o bilhete (números em mono)
│  90,0  →  84,0 kg                 │
│  ▓▓▓▓▓▓▓░░░░░░   −3,2 kg · 53%    │   ← progresso pra meta (gráfico MFP)
│                                   │
│  ●━━━━━━━━━━━━━━━━━━━○             │   ← o PATH (Duolingo) — 2 nós
│  INÍCIO            FINAL          │
│  90,0 ✓          faltam 12 dias   │
│                                   │
│ ┌────────────────────────────────┐│
│ │      REGISTRAR CHECK-IN        ││   ← CTA do dia (Duolingo)
│ │      (acompanhe seu rumo)      ││     opcional, MFP — vira "PESAR
│ └────────────────────────────────┘│     AGORA" quando a janela final abre
│                                   │
│  Você está no rumo. Faltam 2,8 kg │   ← linha proativa/transparente
│  e 12 dias.                       │
└──────────────────────────────────┘
```

**O HUD muda de cara conforme o estado** (transparência — cada estado tem tela, nunca
um vazio mudo):

| Estado                         | O que o HUD mostra                                | Próxima ação (CTA único)              |
| ------------------------------ | ------------------------------------------------- | ------------------------------------- |
| Sem conta/aposta               | "Nenhuma aposta rolando." (convite, não vergonha) | **"Começar minha aposta"**            |
| Conta criada, sem baseline     | —                                                 | **"Fazer minha 1ª pesagem"** (grátis) |
| Baseline ok, sem bilhete       | "Você está em 90,0 kg."                           | **"Montar minha aposta"**             |
| Pagamento pendente             | "Aguardando seu Pix de R$ 200…" (status ao vivo)  | **"Ver o código Pix"**                |
| Ativa, no período              | R$ · dias · streak · progresso                    | **"Registrar check-in"** (opcional)   |
| Ativa, **janela final aberta** | idem + contador da janela                         | **"PESAR AGORA"**                     |
| Em revisão                     | "Pesagem na fila."                                | "Acompanhar" (read-only)              |
| Desfecho pronto                | resultado                                         | **"Ver resultado"** → Fase 8          |

**Regra de ouro do HUD (DOOM):** o estado está **sempre** visível e há **sempre**
exatamente uma ação primária. Nunca duas decisões ambíguas, nunca zero.

---

## 5. Proatividade — janelas, lembretes e streak

O motor proativo (hoje ausente — §1/E) é o que faz o app **puxar** o usuário.

- **Janela sorteada (regra do produto):** o servidor sorteia quando a pesagem **final**
  abre ("pese nas próximas X horas"), em horário randômico, mesmas condições. O usuário
  **não escolhe** — é justiça + anti-fraude **e** o gancho proativo perfeito.
- **Lembretes (a coruja do Duolingo, na voz do manual):**
  > "Sua janela de pesagem abriu. Tem 12h. R$ 200 em jogo." _(curto, com algo em jogo,
  > sem drama — Manual §7)_
  > "Faltam 3h pra fechar a janela. Não deixa o green escapar."
- **Check-in / streak (MFP + Duolingo §5.1):** o nudge diário do check-in informal
  mantém o hábito; o streak de dias no rumo **dói** de perder (aversão à perda no
  hábito, espelhando a do dinheiro).
- **Sem alarme falso:** nunca "⚠️ VOCÊ VAI PERDER TUDO!!!". A urgência é real e seca.

---

## 6. A dopamina honesta (quando o app pode festejar)

Direto do Manual §6.7 — onde o app atual mais erra (festeja tudo):

- **Pode festejar** (confete, "DEU GREEN" em verde, som, háptico): **só** num **green
  real** (final aprovada + meta batida) ou numa **simulação rotulada**.
- **Não pode festejar:** a pesagem inicial (baseline), "enviado-mas-não-revisado",
  qualquer estado que não seja vitória. Aí o tom é **sóbrio e claro** ("registrado,
  segue o jogo").
- **Por quê:** festejar uma não-vitória é o tell do caça-níquel — destrói a confiança
  que faz alguém apostar contra si mesmo.

---

## 7. Princípios de UX (os três pilares virando regra prática)

Cole isto em toda revisão de tela:

1. **Sempre o próximo passo (Proativa/DOOM).** Nenhuma tela é beco. Toda tela tem
   exatamente **uma** ação primária óbvia. Usuário parado sem saber o que fazer = falha.
2. **O HUD nunca some (Transparente/DOOM).** R$ em jogo, prazo, progresso e streak são
   onipresentes no contexto da aposta.
3. **Ensine antes de cobrar (Didática/Duolingo).** Nada de pedir Pix, gravar vídeo ou
   confirmar peso sem ter ensinado o porquê — uma vez, curto, na hora. Rodinhas somem.
4. **Nomeie o dinheiro e a perda, sempre (Transparente/Manual).** "Em jogo: R$ 200",
   "vai pro bolo de quem conseguiu". Sem letra miúda.
5. **Um pensamento por tela (Duolingo).** Uma ideia, uma pergunta, um CTA.
6. **Festa só na vitória real (Manual §6.7).** Verde é sagrado.
7. **Erro é lição, não punição (Duolingo).** Todo estado ruim vem com **o porquê** e **o
   caminho de volta**.
8. **A captura é sóbria; o desfecho é visceral (DOOM/Manual).** Prova = funcional; green
   = soco.

---

## 8. Mapa de rotas — atual vs. proposto

| Rota / tela            | Hoje                                      | Norte                                                            |
| ---------------------- | ----------------------------------------- | ---------------------------------------------------------------- |
| `app/_layout.tsx`      | Stack só declara index/onboarding/weighin | declarar `auth`, `bet`, `profile` (§1/K)                         |
| **`auth/`**            | **não existe** (§1/A)                     | **nova** — entrar/criar conta; grava o token (a fundação)        |
| `app/index.tsx` (home) | estática, 4 botões                        | **o HUD** (§4): estado da aposta + 1 CTA                         |
| `(onboarding)/*`       | welcome → guide → home                    | welcome (✓) + micro-lições + **simulador** valor-primeiro        |
| **pesagem inicial**    | sem ordem definida                        | **antes do pagamento** (§2/§3), grátis, ensina o protocolo       |
| `bet/new.tsx`          | form + Pix sem ativação                   | **bilhete vivo** ancorado no baseline + "aguardando Pix → ativa" |
| **check-in informal**  | não existe                                | **novo** — log opcional (MFP) pro gráfico/streak no período      |
| `weighin/index.tsx`    | passo travado, sem janela                 | passos que avançam + janela sorteada só na final                 |
| `weighin/result.tsx`   | confete sempre                            | feedback por **veredito** (§6)                                   |
| **`bet/result`**       | **não existe** (§1/F)                     | **nova** — deu green / não bateu + Pix + bolo                    |
| `profile.tsx`          | só pela home                              | Pix/CPF entram no fluxo de pagamento; acessível pelo HUD         |

---

## 9. Backlog priorizado (o caminho pra desentortar)

Em ordem — cada item paga uma dívida do §1. **A fundação primeiro; sem ela, o resto é
fachada.**

1. **Auth/sessão** — login + gravar token. Destrava TODOS os dados (§1/A). _Bloqueador._
2. **Home = HUD** — estado da aposta + 1 CTA por estado (§1/J, §4). É a espinha.
3. **Reordenar pra `pesar → pagar`** — pesagem inicial antes do bilhete/Pix (§2/§3/§4).
4. **Tela de desfecho da aposta** (`bet/result`) — deu green / não bateu + Pix (§1/F).
5. **Veredito real na pesagem** — fim do "confete sempre"; feedback por estado (§1/G, §6).
6. **Janela + lembretes da final** — pesagem só na janela sorteada + push (§1/E, §5).
7. **Ativação do pagamento** — "aguardando Pix → ativa" ao vivo (§1/I).
8. **Consertar a captura** — passos que avançam + tela de instruções (§1/C, §1/D).
9. **Check-in informal + gráfico** — o hábito do período (MFP), 2 pesagens oficiais só.
10. **Recuperação de erro** — reset do store, fim do loop morto (§1/B).
11. **Higiene** — registrar rotas no Stack (§1/K) + varrer "Charya"→"WellBet" (§1/L).

---

## Apêndice — escopo do MVP e evolução

**Decidido para o MVP (este doc):**

- **2 pesagens** (início + fim). A intermediária do produto completo fica pra evolução
  (vira um terceiro nó no path, sem mudar a estrutura).
- **`pesar → pagar`** (§2).
- **Revisão 100% manual** — uma pessoa confere cada vídeo; a **identidade** é checada
  pelo revisor comparando o vídeo do baseline com o da final. Sem KYC/liveness comprado
  agora.

**Evolução (não inventar no v1, mas a jornada acomoda):**

- 3ª pesagem (intermediária) — novo nó no path + nova janela sorteada.
- KYC/liveness automático, OCR do visor, forense de vídeo — trocam o "como" da revisão,
  não a jornada.
- Objeto de peso conhecido na captura, baseline por média de dias, payout escalonado com
  manutenção — entram como regras, com tela/explicação própria quando chegarem.
