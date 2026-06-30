# WellBet — Jornada do Usuário (app mobile)

> Como o usuário atravessa o app, do primeiro toque ao "deu green" (ou à perda).
> Este doc define a **jornada-norte** e os princípios que a guiam. É par do
> [Manual de Marca](./WellBet_Manual_de_Marca_e_Voz.md) (a voz) — aqui mora o **fluxo**.
>
> **Por que existe:** o fluxo atual está, nas palavras do fundador, "bugado e sem
> sentido". O diagnóstico (§2) confirma — o app não tem **espinha**. Este doc
> redesenha a jornada para que ela **nunca deixe o usuário perdido**.
>
> **Escopo do MVP (decidido):**
> - **Onboarding-funil:** uma trilha linear que desenha a aposta (meta + prazo + valor),
>   **revela o prêmio** (o gancho) e prova o peso de partida em **vídeo** — tudo antes do Pix (§4).
> - **2 pesagens:** uma no **começo** (baseline, em vídeo, dentro do onboarding) e uma no **fim** (final).
> - **A ordem do dinheiro:** mostrar o prêmio cedo (valor-primeiro), mas o **Pix só depois da
>   prova em vídeo** do baseline (§3).
> - **Revisão 100% manual** (uma pessoa confere cada vídeo). Automação é evolução.

---

## 0. Os três pilares

Toda decisão de fluxo passa por três filtros, em ordem de prioridade.

1. **PROATIVA** — o app sabe o próximo passo antes de você perguntar. Ele **puxa**
   você: diz quando pesar, lembra do prazo, mostra a única próxima ação.
2. **TRANSPARENTE** — nada escondido, principalmente o dinheiro e a verdade. Quanto
   está em jogo, quantos dias faltam, em que pé está a revisão, de onde vem o prêmio.
3. **DIDÁTICA** (o mais importante) — o app te ensina a **mudar**, não só a usar o app.
   O que é a aposta, por que cada passo da pesagem existe, e a psicologia de não
   desistir. Na hora certa, em pedaços pequenos, com feedback imediato.

---

## 1. As referências — o que adotamos, adaptamos e rejeitamos

Três produtos provam que esses pilares funcionam em escala: **Duolingo** (vício no
hábito de aprender), **Noom** (mudança de comportamento por psicologia) e
**MyFitnessPal** (transparência do número). **Referência de verdade é também saber o
que NÃO copiar.** Abaixo, as mecânicas *reais* de cada app e a decisão da WellBet.

### Duolingo — a espinha (gamificação do hábito)

| Mecânica real do Duolingo | Decisão | Como vira WellBet |
|---|---|---|
| O **caminho** (árvore de lições, um nó por vez) | **ADOTAR** | a aposta é um caminho: baseline → período → final; a home mostra onde você está e o próximo nó |
| **1 botão gigante** ("CONTINUAR") pro próximo passo | **ADOTAR** | exatamente 1 CTA por estado na home; nunca um menu de 4 botões ambíguos (é a quebra J de hoje) |
| **Streak** + "não quebre a sequência" (aversão à perda) | **ADOTAR** | streak de check-ins/dias no rumo, e de apostas concluídas |
| **Streak freeze** (proteção do streak) | **ADAPTAR** | um "escudo" pra 1 check-in perdido — sem virar venda de item de loja |
| **Hearts/vidas** (errar custa uma vida) | **REJEITAR** | nosso custo de errar é **real** (o dinheiro em jogo); não inventamos vida artificial |
| **Lições bite-size + feedback imediato** | **ADOTAR** | onboarding e protocolo de pesagem em micro-passos, cada um com o porquê |
| **Liga / leaderboard** (ranking social) | **REJEITAR** | Manual §5: "aqui não tem humilhação de ranking"; comparar corpos trai a marca |
| **Mascote** (a coruja como personagem fofo) | **REJEITAR** | já matamos o mascote; sobra a **função** (o lembrete), não o personagem |
| **Push de lembrete** ("hora da lição!") | **ADOTAR** | lembrete da janela de pesagem e da lição do dia, na voz do treinador |

### Noom — a psicologia da mudança

| Mecânica real do Noom | Decisão | Como vira WellBet |
|---|---|---|
| **Quiz de onboarding** que personaliza o plano | **ADOTAR** (enxuto) | 3-4 perguntas: objetivo, **porquê**, o que te travou antes → plano + munição pro treinador |
| **Lições diárias** de psicologia (CBT, ~10 min) | **ADOTAR** (1-2 min) | lição curta no período: gatilho, recaída, platô, o "porquê" declarado |
| **Comida verde/amarelo/vermelho** (densidade calórica) | **REJEITAR** | não somos contador de caloria; nosso **verde** é o green da meta, não comida |
| **Coach humano + grupo de apoio** | **ADAPTAR** | o "coach" é a **voz do app** (treinador durão), não uma pessoa; sem grupo no MVP |
| **Tom empático, acolhedor** | **REJEITAR (o tom)** | pegamos a estrutura, não a fofura — onde o Noom afaga, a gente cutuca (a desistência, nunca o corpo) |
| **Vitórias-não-da-balança** | **ADOTAR** | reconhece processo ("3 dias sem furar") sem usar o verde/confete do green real |
| **"Progresso, não perfeição"** | **ADAPTAR** | recaída não é o fim — mas a meta e o prazo são reais; a régua não afrouxa |

### MyFitnessPal — transparência do número e hábito de registro

| Mecânica real do MFP | Decisão | Como vira WellBet |
|---|---|---|
| **Diário** (logar todo dia) | **ADAPTAR** | check-in **informal** de peso (não-oficial, não vai pra revisão) só pra você se acompanhar |
| **Gráfico de tendência** do peso + projeção | **ADOTAR** | o gráfico na home: estou no rumo da meta? projeção até o prazo |
| **"Quanto falta hoje"** (o anel de calorias) | **ADOTAR** | "faltam 2,8 kg e 12 dias" — o pace sempre visível |
| **Scanner de código de barras** | **REJEITAR** (n/a) | nosso registro é o número da balança, não comida |
| **Lembrete de logar** | **ADOTAR** | nudge diário do check-in |
| **Comunidade / feed social** | **REJEITAR** | sem social no MVP — anti-ranking, foco no compromisso individual |

> **O que prova que é referência, não decoração:** as linhas **REJEITAR**. A liga do
> Duolingo, o tom fofo do Noom e o feed do MFP foram **estudados e recusados** por
> baterem de frente com a marca. Quem só repinta um esqueleto antigo não sabe o que
> está deixando de fora — aqui sabemos, e dizemos por quê.

> **A frase-norte:** WellBet **ensina a mudar** como o Noom, **vicia no hábito** como o
> Duolingo e **mostra a verdade** como o MFP — só que com a atitude de um **treinador
> durão**, não de um coach que passa a mão na sua cabeça. Sempre o próximo passo.
> Sempre a verdade. Sempre ensinando.

---

## 2. Diagnóstico — por que o fluxo atual não faz sentido

O mapa do app atual (rotas `app/`) revelou 13 problemas. Agrupados pelo pilar que
violam — cada um é uma dívida que a jornada-norte precisa pagar:

### Sem espinha proativa (o usuário não sabe o que fazer)
- **A home não reflete a aposta.** `app/index.tsx` é estática: 4 botões + histórico.
  Não mostra se há aposta ativa, stake em jogo, prazo, meta nem progresso. É o oposto
  da home do Duolingo (que destaca **o** próximo passo). *(quebra J)*
- **Sem cadência nem prazo.** As pesagens são derivadas só por **contagem**
  (`useActiveWeighInTarget.ts:36-40`). Dá pra fazer todas em 5 minutos. A dimensão
  temporal — o coração de "pesagem no começo e no fim" — **não existe no cliente**. *(E)*
- **Criou aposta e pagou → nenhum feedback.** A tela de Pix mostra o BR Code e só
  "voltar para Home". Sem polling, sem "aguardando → ativa". *(I)*

### Sem transparência de estado (a verdade fica escondida)
- **A tela de desfecho da aposta (bateu/não bateu → Pix) NÃO EXISTE.** O fluxo termina
  em `/weighin` "done" → "Aguarde o resultado" e acabou. A promessa central do produto
  não tem destino. *(F)*
- **A recompensa celebra tudo.** `result.tsx` dispara confete + som de vitória +
  háptico "Success" **sempre** — inclusive na pesagem inicial e sem saber se o peso
  caiu. Dopamina enganosa — o que o manual proíbe. *(G)*

### Sem didática (o app não ensina — e o erro custa caro)
- **O guia das 6 etapas trava na etapa 1.** `nextStep()` nunca é chamado em produção;
  o overlay fica eterno em "Etapa 1 de 6". O roteiro **não avança**. *(C)*
- **Perfil é pré-requisito mas está fora do caminho.** A API exige `taxId`/`pixKey` pra
  apostar, mas o onboarding não leva ao perfil e `/bet/new` não redireciona. *(H)*
- **Onboarding é beco de mão única.** Sem voltar; "Como funciona" reusa o fluxo de
  primeiro acesso em vez de uma ajuda dedicada. *(M)*

### Fundação quebrada (a casa sem alicerce)
- **Não há login/sessão.** `tokenStore.save()` nunca é chamado; nenhuma request leva
  `Authorization`. Logo `/me`, `/bets`, `/weighins`, `start/submit` **todos falham**
  (401) → o app **sempre cai em "no-bet"**, em silêncio. É o problema-raiz. *(A)*
- **Retry de erro é loop morto.** Em erro, "tentar de novo" faz `replace("/weighin")`
  sem resetar o store → remonta em `error` pra sempre. *(B)*
- **Estados-fantasma.** `CapturePhase` define `uploading/done/instructions` que nada
  seta; não há tela de instruções no fluxo. *(D)*
- **`bet`/`profile` fora do Stack raiz** (`_layout.tsx:64-66`). *(K)*
- **Marca inconsistente** — "Charya" (`bet/new.tsx:104`) vs "WellBet". *(L)*

> **Leitura:** o app tem **peças boas isoladas** (a captura por vídeo, o Pix, o
> histórico) mas **nenhum fio** que as costure. A solução não é mais telas — é uma
> **espinha**: a home-caminho do Duolingo, que sempre mostra o estado e o próximo passo.

---

## 3. A ordem do dinheiro: prêmio cedo, Pix só depois da prova

A régua de honestidade (Manual: dopamina sim, cassino não) define a ordem. Duas verdades a
guiam — e juntas matam o `pagar → pesar`:

- **O gancho vem cedo; o dinheiro, por último.** O usuário **desenha a aposta e vê o
  prêmio** (meta + prazo + valor → quanto leva se vencer) ainda no onboarding, **antes** de
  criar conta — é o "valor-primeiro" do Duolingo (faça a lição antes do cadastro). Mas o
  **Pix** só entra **depois** da prova em vídeo do baseline. Desejo e compromisso primeiro;
  dinheiro por último.
- **A prova (vídeo) vem antes do dinheiro.** A pesagem de partida é **gravada e
  comprovada** antes de qualquer Pix. Você nunca paga contra um chute: o vídeo trava o
  número de partida, e só então a home pede o pagamento.

### A sequência (implementada)
`declarar peso+altura → desenhar meta/prazo → escolher o valor + VER O PRÊMIO → criar conta
→ PROVAR o peso em vídeo → pagar (Pix) → aposta no ar`

O peso é **declarado** no onboarding (pra calcular meta e prêmio na hora) e **comprovado**
logo em seguida pelo vídeo — antes de mover um centavo. Inflar a partida não compensa: a
meta é relativa ao baseline e o vídeo é o evento mais escrutinado da jornada.

### O prêmio — de volta + fatia do bolo (sem multiplicador)
Se você bater a meta, recebe **seu valor de volta + uma fatia do bolo** de quem desistiu. O que
**NÃO** fazemos (Manual §5.4): inventar cotação, multiplicador ou "ganhe R$X" fixo — é mentira
de cassino. A recompensa **varia com o bolo**, e a tela **diz isso**. A dificuldade da meta
entra **em palavras, não em número**: quanto mais dura (mais % do peso por semana), maior a sua
fatia — *"meta forte: sua fatia do bolo é maior"*. O gancho é honesto e enquadrado pela perda:
o **valor de volta** (certo) + a **fatia** (que varia) + a fonte nomeada (*"sem mágica: o prêmio
vem de quem desistiu, não da casa"*).

### Por que essa ordem (e não `pagar → pesar`)
1. **Valor-primeiro (Duolingo) — o argumento decisivo.** Ver o prêmio e entender a aposta
   **antes** do cadastro derruba o maior gargalo ("dar Pix contra si mesmo"). Quem chega no
   Pix já se comprometeu várias vezes (quiz, números, prêmio, conta, vídeo).
2. **Transparente — a aposta vira real sobre um número COMPROVADO.** O Pix nunca precede a
   prova: a partida é travada por vídeo, não por chute.
3. **Didática — a 1ª pesagem é a aula.** O usuário aprende o roteiro de 6 passos quando
   ainda não pagou nada (baixa pressão) e aplica a habilidade já treinada na final.
4. **Compromisso comportamental (Noom — foot-in-the-door).** Uma escada de micro-passos
   (responder o quiz → declarar os números → topar o desafio → criar conta → gravar) escala
   o comprometimento até o Pix virar **coerência**, não um salto no escuro.

---

## 4. A jornada-norte (o "caminho" do Duolingo)

A jornada inteira é uma **trilha linear** — a árvore do Duolingo. Em cada nó o usuário
sabe onde está e qual é o **próximo passo único**. Nunca há beco.

```
 FASE 0  DESCOBERTA ........ landing (continuidade de voz)

 FASE 1  ONBOARDING-FUNIL .. trilha linear, um passo por vez, sem beco:
          1 boas-vindas (hierarquia clara)
          2 quiz (Noom: objetivo · porquê · o que travou)
          3 frase motivadora (devolve o seu porquê)
          4 medidas (peso + altura)
          5 meta (quanto perder + prazo)
          6 o que está em jogo — valor de volta + fatia do bolo  ◄ o gancho
          7 conta (criada no CTA do prêmio)
          8 guia da captura (roteiro de 6 passos)
          9 câmera — pesagem de partida em vídeo
         10 revisar + confirmar → fecha o onboarding

 FASE 2  PIX + ATIVAÇÃO .... a home pede o Pix; ao cair, "APOSTA ATIVA"

 FASE 3  PERÍODO ATIVO ..... o loop (home-placar · lição · check-in · streak)
          └─ janela sorteada perto do prazo ─┐
 FASE 4  PESAGEM FINAL ..... dentro da janela, mesmo rigor
 FASE 5  REVISÃO MANUAL .... 100% humana, comunicada
 FASE 6  DESFECHO .......... deu green / não bateu → Pix + bolo
 FASE 7  RE-ENGAJAMENTO .... a próxima aposta, com streak
```

Cada fase segue o molde: **objetivo · proativo · transparente · didático · telas ·
copy · referência (com a mecânica específica)**.

---

### FASE 0 — Descoberta
**Objetivo:** entender em 10 segundos e instalar. *(vive na landing; aqui só a
continuidade de voz.)* O app **abre na mesma frase** da landing — sem ruptura de tom.

---

### FASE 1 — Onboarding (o funil que desenha a aposta e prova o peso)
**Objetivo:** sair de "será que é pra mim?" para "já topei o desafio e provei meu peso" —
numa **trilha linear** (Duolingo), um passo por vez, **sem beco**. O dinheiro (Pix) fica pro
fim; aqui moram o **gancho** e o **compromisso**.

**1 · Boas-vindas (hierarquia clara).** Raio da marca → eyebrow → título-soco → corpo → os
**dois desfechos** lado a lado (✓ bateu / ✗ não bateu) → a prova ("vídeo revisado por
gente") → 1 CTA. Quem já tem conta entra direto pelo login. *Transparente: nomeia a perda
antes de pedir qualquer coisa.*

**2 · Quiz (Noom).** Objetivo · **porquê** ("por quem/por quê?") · o que te travou antes.
Guarda o porquê pra **munição do treinador** na Fase 3: *"você disse que era pelo seu filho.
Não é hoje que você amolece."* *Didática.*

**3 · Frase motivadora.** Fecha o "combinado" e **devolve o seu porquê** como citação —
ancora emoção antes de pedir números. *Didática/Transparente.*

**4 · Peso + altura (medidas).** O ponto de partida **declarado** (vira o baseline, ainda
sem prova) + o IMC. É o que dimensiona a meta e o prêmio. *Transparente.*

**5 · Meta + prazo.** Quanto perder (kg) e em quantas semanas. O app valida **perda saudável
e robusta** — rejeita metas triviais (~3-5%, que cabem na variação de água); ajuda a
escolher, não deixa errar. *MFP (pace saudável) · Proativo.*

**6 · O que está em jogo — o gancho (valor-primeiro do Duolingo).** Escolhe **quanto apostar**
e vê o que recebe se bater: **o valor de volta + a fatia do bolo** de quem desistiu. SEM
cotação/multiplicador inventado (Manual §5.4) — a recompensa **varia com o bolo**, e a tela diz
isso; a dificuldade vira a **sua fatia** em palavras (*"meta forte: sua fatia é maior"*).
Enquadrado pela perda, não pelo jackpot. *Transparente/Didática.*

**7 · Conta.** O CTA do prêmio cria a conta (Better Auth) pra **travar o desafio**. Cadastro
**tardio** (Duolingo): só depois de ver o valor. *Fundação.*

**8 · Guia da captura.** Explica o **roteiro contínuo de 6 passos** com ícones, antes de
abrir a câmera (preenche o estado-fantasma `instructions`, §2/D). *Didática.*

**9 · Câmera — pesagem de partida em vídeo.** A estreia ensina o roteiro **com o passo
avançando de verdade** (corrige §2/C): rosto → código+gesto → balança 0,0 → piso/base → subir
sem apoio → visor em close, cada um com o **porquê**. Tom **sóbrio** — é prova, zero dopamina
(Manual §4). *Didática.*

**10 · Revisar + confirmar.** O usuário revê a gravação e confirma o envio. Confirmar **fecha
o onboarding**: cria a aposta a partir do rascunho e marca o baseline (no MVP local, aprovado
na hora; com backend, vai pra fila de revisão humana). *Transparente.*

**Copy:** Eyebrow `BORA?` · Título **"Quanto você apostaria em você?"** · no prêmio, **"Se
vencer, você leva R$ …"** · CTA **"Topar o desafio"**.

**Ref:** Duolingo (trilha linear · 1 CTA · valor-primeiro · cadastro tardio · lição guiada
com as rodinhas) · Noom (quiz + o porquê como munição).

---

### FASE 2 — Pix + ativação (o dinheiro, por último)
**Objetivo:** mover o dinheiro **depois** de o peso estar provado — e dar feedback ao vivo.

**Proativo/transparente:** com o baseline confirmado (Fase 1), a home pede o **Pix**: *"Falta
só o Pix. R$ 200 e sua aposta entra em jogo."* Pede a **chave Pix** (mesmo titular —
anti-laranja), mostra o BR Code e **fica em "aguardando seu Pix"** com status ao vivo → quando
cai, anima pra **"APOSTA ATIVA"** e empurra pra Fase 3 (corrige §2/I). Nunca mais "pague e se
vire".

**Por que aqui (e não no onboarding):** a aposta já foi **desenhada** e o prêmio já foi
**visto** na Fase 1 (o gancho), e o número de partida já foi **provado** em vídeo. O Pix é o
último passo — coerência, não salto no escuro (§3). A chave Pix entra aqui (mesmo titular) só
quando o dinheiro vai mesmo se mover.

**Copy:** CTA **"Já paguei"** · Pós-Pix **"Tá valendo. Seu R$ 200 está em jogo."**

**Ref:** Duolingo (o "daily goal" travado) · MFP (a meta ancorada no número real).

---

### FASE 3 — O período ativo (o loop — onde o app vive)
**Objetivo:** manter o usuário no rumo entre o baseline e a final. Com só 2 pesagens
oficiais, é aqui que o engajamento diário se sustenta — e a fase que mais usa o **Noom**.

**Proativo:** a home (§5) mostra o estado e a próxima ação. Perto do prazo, o app
**sorteia a janela** da pesagem final ("pese nas próximas 12h") e **notifica** — o
usuário não escolhe o dia (regra do produto + anti-fraude). É a coruja do Duolingo com
função real.

**Didático — a lição diária (mecânica do Noom: a aula de CBT):** uma **lição curta**
(1-2 min) na voz do treinador, sobre a *psicologia* de não desistir: o gatilho do fim de
semana, a recaída que não é o fim, o platô que assusta, o **"porquê" do quiz**. Não é
"como usar o app" — é **como mudar de verdade**.

**Transparente + hábito (mecânica do MFP):** a home sempre com **R$ em jogo · dias ·
progresso**, e o **gráfico de tendência**. **Check-ins opcionais** — registrar o peso de
forma **informal** (não-oficial, não vai pra revisão) só pra ver o gráfico e saber se
está no rumo. Cria o hábito diário do MFP e alimenta nudges ("faltam 2 kg e 9 dias —
dá, se não afrouxar no fim de semana").

**Vitórias-não-da-balança (mecânica do Noom):** reconhece progresso que **não** é o
número — "3 dias sem furar o check-in" — **sem** usar o verde/confete do green real
(Manual §6.7). O **streak** (Duolingo) vive aqui e entre apostas (Fase 7).

**Telas:** a home (§5) + a lição do dia + tela de check-in informal + o gráfico.

**Ref:** Noom (lição diária + vitórias-não-da-balança) · MFP (gráfico de tendência +
hábito de log) · Duolingo (o streak).

---

### FASE 4 — Pesagem final (a prova que vale o prêmio)
**Objetivo:** comprovar o peso final, dentro da janela sorteada.

**Proativo:** a final só abre **dentro da janela** perto do prazo; fora dela, o app diz
quando abre (em vez de deixar pesar a qualquer hora, §2/E).

**Didático:** o roteiro já é familiar — guia enxuto (rodinhas off). Mesmo rigor do
baseline.

**Tom:** sóbrio. Máxima tentação de fraude e máxima prova — não é hora de festa ainda.

**Transparente (pós-envio, corrige §2/F e G):** a tela **não festeja** — diz o estado:
- `EM REVISÃO` — "Seu vídeo está na fila. A gente confere e te avisa." (sem confete)
- `PENDENTE` — "Faltou um trecho. Bora regravar — leva 1 minuto."
- `REPROVADO` — direto, com o porquê e o próximo passo, sem humilhar.
- `APROVADO` → segue pro **veredito da aposta** (Fase 6).

**Telas:** `weighin/result.tsx` reflete o **veredito real**; some o háptico de vitória no
baseline (§2/G).

**Ref:** Duolingo (a tela de fim-de-lição que **corrige** o erro) · Manual (dopamina só
na vitória real).

---

### FASE 5 — Revisão manual (bastidor, mas comunicado)
**Objetivo (do usuário):** saber que está sendo conferido e quando sai.

No MVP, **uma pessoa revisa 100%** dos vídeos com checklist: vídeo contínuo (sem corte,
origem in-app), código+gesto certos, balança zerada, piso ok, sem apoio, visor íntegro,
**mesma pessoa** (compara baseline × final) e plausibilidade.

**Transparente:** o app mostra "em revisão" e **avisa** (push) quando sai. Não promete
prazo que não cumpre; diz a faixa real ("costuma sair em até X h").

**Ref:** Manual (a revisão humana é credibilidade).

---

### FASE 6 — Desfecho da aposta (o clímax)
**Objetivo:** fechar o ciclo — ganhou ou perdeu, e o dinheiro se move. Era a maior lacuna
do app (§2/F) — agora a tela existe (`bet/result`).

**Transparente — tela de settlement explícita:**
- **DEU GREEN:** "Você bateu. R$ 200 de volta + R$ 73 do bolo. Cai no seu Pix." Mostra
  **de onde veio** ("sem mágica: o prêmio vem de quem desistiu", Manual §11). Festa
  honesta: confete, "DEU GREEN" em verde, som — **agora** é a hora (§7).
- **NÃO BATEU:** sem humilhação, com verdade: "Não rolou dessa vez. Seu R$ 200 vai pro
  bolo de quem conseguiu." E **imediatamente** o caminho pra frente (Fase 7).

**Proativo:** push quando o resultado sai, levando direto à tela.

**Transparência do dinheiro:** se houver **retenção/payout escalonado** (parte
condicionada a manter o peso por algumas semanas — regra anti-sanfona), aparece claro:
"Metade agora, metade quando você mantiver por 3 semanas." Nunca um "pendente" mudo.

**Telas:** **nova** — `bet/result` (ou `settlement`).

**Ref:** Manual (o soco do desfecho + honestidade do prêmio e da perda).

---

### FASE 7 — Re-engajamento
**Objetivo:** transformar um ciclo em hábito.

**Proativo:** ganhou ou perdeu, o app oferece **a próxima aposta** na hora, com o streak
(de apostas concluídas) como continuidade.

**Didático/honesto:** o produto **penaliza abandono e re-rolagem de baseline** (não dá
pra desistir e recriar pra baixar a régua). O app explica a regra com naturalidade, não
como punição-surpresa.

**Ref:** Duolingo (o streak de longo prazo) · Noom (mudança sustentável — cada ciclo
fecha um hábito).

---

## 5. A home — a síntese das três homes que funcionam

A home é onde tudo desanda hoje (estática, muda — §2/J). Em vez de inventar, **copiamos
as homes que dão certo** e juntamos:

- **Home do Duolingo:** barra de status fixa no topo (streak, gemas) + **o caminho** +
  **o próximo passo destacado** num botão só.
- **Home do Noom:** **a tarefa/lição de hoje** em destaque.
- **Home do MFP:** **o painel de números** (tendência do peso + quanto falta).

Juntando, nasce a home da WellBet — a **home-caminho do Duolingo** vestida de **placar**
de aposta (o termo da casa, Manual §9). **Não é um HUD de jogo**; é a árvore do Duolingo
com os números do MFP e a tarefa do Noom. Na implementação, o "caminho" virou um **anel de
progresso** (ProgressRing) como placar central, e os números do MFP viram **pílulas de
status** + **card de tendência**. Mock (estado "aposta ativa, no período"), cada elemento
marcado com sua origem:

```
┌──────────────────────────────────┐
│  WELLBET                  perfil ▸│
│ ┌────────────────────────────────┐│   ← barra de status fixa  [DUOLINGO]
│ │  R$ 200  ·  12 dias  ·  🔥 5    ││     (lá: streak/gemas; aqui: em jogo,
│ └────────────────────────────────┘│      prazo, streak)
│                                   │
│  META · PERDER 6 KG               │   ← o painel de números   [MFP]
│  90,0  →  84,0 kg                 │
│  ▓▓▓▓▓▓▓░░░░░░   −3,2 kg · 53%    │     (tendência + quanto falta)
│                                   │
│  ●━━━━━━━━━━━━━━━━━━━○             │   ← o caminho             [DUOLINGO]
│  INÍCIO            FINAL          │     (2 nós: baseline → final)
│  90,0 ✓          faltam 12 dias   │
│                                   │
│ ┌─ LIÇÃO DE HOJE ────────────────┐│   ← a tarefa de hoje      [NOOM]
│ │ "O fim de semana não é folga   ││
│ │  da meta." · 2 min          ▸  ││
│ └────────────────────────────────┘│
│                                   │
│ ┌────────────────────────────────┐│   ← o próximo passo único [DUOLINGO]
│ │      REGISTRAR CHECK-IN        ││     (vira "PESAR AGORA" quando a
│ │      (acompanhe seu rumo)      ││      janela final abre)
│ └────────────────────────────────┘│
└──────────────────────────────────┘
```

**A home muda de cara conforme o estado** — como a árvore do Duolingo destaca **a**
próxima lição, a home destaca **a** próxima ação. Cada estado tem tela; nunca um vazio:

| Estado | A barra/painel mostra | Próximo passo único |
|--------|------------------------|---------------------|
| Sem conta/aposta | "Nenhuma aposta rolando." (convite, não vergonha) | **"Começar minha aposta"** |
| Conta criada, sem baseline | — | **"Fazer minha 1ª pesagem"** (grátis) |
| Baseline ok, sem bilhete | "Você está em 90,0 kg." | **"Montar minha aposta"** |
| Pagamento pendente | "Aguardando seu Pix de R$ 200…" (ao vivo) | **"Ver o código Pix"** |
| Ativa, no período | R$ · dias · streak · progresso + lição do dia | **"Registrar check-in"** |
| Ativa, **janela final aberta** | idem + contador da janela | **"PESAR AGORA"** |
| Em revisão | "Pesagem na fila." | "Acompanhar" (read-only) |
| Desfecho pronto | resultado | **"Ver resultado"** → Fase 6 |

> **Primeiro ciclo × recorrência:** no **1º ciclo**, os primeiros estados (sem conta /
> baseline / bilhete) são cobertos pelo **funil de onboarding** (§4 · Fase 1); a home assume
> a partir do **Pix** (Fase 2). Da 2ª aposta em diante, a home orquestra direto — conta e
> baseline já existem, então vai de `no-bet` → Pix → ativa.

**Regra de ouro (Duolingo):** o estado está **sempre** visível (a barra de topo) e há
**sempre** exatamente um próximo passo (o botão único). Nunca duas decisões ambíguas
(a quebra J de hoje), nunca zero.

---

## 6. Proatividade — janelas, lembretes e streak

O motor proativo (hoje ausente — §2/E) é o que faz o app **puxar** o usuário.

- **Janela sorteada (regra do produto):** o servidor sorteia quando a pesagem **final**
  abre ("pese nas próximas X horas"), em horário randômico, mesmas condições. O usuário
  **não escolhe** — é justiça + anti-fraude **e** o gancho proativo perfeito.
- **Lembretes (a coruja do Duolingo, na voz do manual):**
  > "Sua janela de pesagem abriu. Tem 12h. R$ 200 em jogo." *(curto, com algo em jogo,
  > sem drama — Manual §7)*
- **Lição do dia (Noom):** o nudge diário da lição mantém o vínculo educacional e lembra
  o "porquê" do quiz.
- **Check-in / streak (MFP + Duolingo):** o check-in informal mantém o hábito; o streak
  de dias no rumo **dói** de perder (aversão à perda no hábito, espelhando a do dinheiro).
- **Sem alarme falso:** nunca "⚠️ VOCÊ VAI PERDER TUDO!!!". A urgência é real e seca.

---

## 7. A dopamina honesta (quando o app pode festejar)

Direto do Manual §6.7 — onde o app atual mais erra (festeja tudo):

- **Pode festejar** (confete, "DEU GREEN" em verde, som, háptico): **só** num **green
  real** (final aprovada + meta batida) ou numa **simulação rotulada**.
- **Não pode festejar:** a pesagem inicial, "enviado-mas-não-revisado", qualquer estado
  que não seja vitória → tom **sóbrio e claro**.
- **Vitória-não-da-balança ≠ green (Noom):** "3 dias de check-in" é um tapinha de moral,
  com peso menor — **nunca** usa o confete/verde reservado ao green real.
- **Por quê:** festejar uma não-vitória como se fosse o green é o tell do caça-níquel.

---

## 8. Princípios de UX (cada um amarrado numa mecânica de referência)

Cole isto em toda revisão de tela:

1. **Sempre o próximo passo (Duolingo: a home destaca a próxima lição).** Nenhuma tela é
   beco; toda tela tem **uma** ação primária óbvia. Usuário parado sem saber o que fazer
   = falha.
2. **A barra de status nunca some (Duolingo: o topo com streak/gemas).** R$ em jogo,
   prazo, progresso e streak são onipresentes no contexto da aposta.
3. **Ensine antes de cobrar (Duolingo: bite-size + feedback).** Nada de pedir Pix, gravar
   vídeo ou confirmar peso sem ter ensinado o porquê — uma vez, curto, na hora.
4. **Ensine a MUDAR, não só a usar (Noom: a lição de CBT).** As lições são sobre
   comportamento (gatilho, recaída, o "porquê"), não sobre botões. O treinador usa o
   **porquê que você declarou** contra as suas desculpas.
5. **Mostre o número e a tendência (MFP: o gráfico).** O progresso e o pace são visíveis;
   nunca esconda quão longe (ou perto) você está.
6. **Nomeie o dinheiro e a perda (Transparente/Manual).** "Em jogo: R$ 200", "vai pro
   bolo de quem conseguiu". Sem letra miúda.
7. **Festa só na vitória real (Manual §6.7).** Verde é sagrado; vitória-não-da-balança é
   tapinha, não festa.
8. **Erro é lição, não punição (Duolingo: a tela de correção).** Todo estado ruim vem com
   **o porquê** e **o caminho de volta**.
9. **A captura é sóbria; o desfecho é visceral (Manual).** Prova = funcional; green = soco.

---

## 9. Mapa de rotas — atual vs. proposto

> Boa parte do "Norte" já está implementada (✓ na coluna *Hoje*); a tabela fica como mapa de
> origem e do que falta costurar com o backend real.

| Rota / tela | Hoje | Norte |
|-------------|------|-------|
| `app/_layout.tsx` | Stack só declara index/onboarding/weighin | declarar `auth`, `bet`, `profile` (§2/K) |
| `(auth)/` + `(onboarding)/account` | ✓ entrar/criar conta (Bearer, grava token) | login + signup dentro do funil |
| `app/index.tsx` (home) | ✓ home-placar por estado (anel) | barra de status + anel + tendência + lição + 1 CTA (§5) |
| `(onboarding)/*` | welcome + quiz | **funil (§4·Fase 1):** welcome · quiz · motivation · measures · goal · **odds** · account · capture-intro · capture · capture-review |
| **pesagem inicial** | — | **em vídeo, dentro do onboarding** (§4·Fase 1), antes do Pix |
| `bet/new.tsx` | form + Pix sem ativação | **bilhete vivo** (round 2+; no 1º ciclo a aposta nasce no funil) |
| **lição diária + check-in** | não existe | **novo** — lição (Noom) + log opcional + gráfico (MFP) no período |
| `weighin/index.tsx` | passo travado, sem janela | passos que avançam + janela sorteada só na final |
| `weighin/result.tsx` | confete sempre | feedback por **veredito** (§7) |
| **`bet/result`** | **não existe** (§2/F) | **nova** — deu green / não bateu + Pix + bolo |
| `profile.tsx` | só pela home | Pix/CPF entram no fluxo de pagamento; acessível pela barra de status |

---

## 10. Backlog priorizado (o caminho pra desentortar)

Em ordem — cada item paga uma dívida do §2. **A fundação primeiro.**

> **Status (jun/2026):** a maior parte já foi implementada (auth, home-placar, desfecho,
> veredito real, captura, recuperação de erro, higiene) + o **funil de onboarding** (medidas,
> meta, prêmio, conta, vídeo de baseline). A lista segue como mapa de origem; o que falta
> é sobretudo costurar com o backend real (placeBet, upload/revisão da pesagem, janela/push).

1. **Auth/sessão** — login + gravar token. Destrava TODOS os dados (§2/A). *Bloqueador.*
2. **Home-caminho** — barra de status + painel + caminho + 1 CTA por estado (§2/J, §5).
3. **Reordenar pra `pesar → pagar`** — pesagem inicial antes do bilhete/Pix (§3/§4).
4. **Tela de desfecho da aposta** (`bet/result`) — deu green / não bateu + Pix (§2/F).
5. **Veredito real na pesagem** — fim do "confete sempre" (§2/G, §7).
6. **Janela + lembretes da final** — pesagem só na janela sorteada + push (§2/E, §6).
7. **Ativação do pagamento** — "aguardando Pix → ativa" ao vivo (§2/I).
8. **Consertar a captura** — passos que avançam + tela de instruções (§2/C, §2/D).
9. **Onboarding-funil + período educacionais** — o funil (quiz · motivação · medidas · meta ·
   **prêmio (de volta + fatia do bolo)** · conta · vídeo de baseline) + lição diária + check-in/gráfico (MFP).
10. **Recuperação de erro** — reset do store, fim do loop morto (§2/B).
11. **Higiene** — registrar rotas no Stack (§2/K) + varrer "Charya"→"WellBet" (§2/L).

---

## Apêndice — escopo do MVP e evolução

**Decidido para o MVP (este doc):**
- **2 pesagens** (início — em vídeo, dentro do onboarding — + fim). A intermediária do produto
  completo fica pra evolução (vira um terceiro nó no caminho, sem mudar a estrutura).
- **Ordem do dinheiro:** prêmio cedo (valor-primeiro), **Pix só depois da prova em vídeo** (§3).
- **Revisão 100% manual** — uma pessoa confere cada vídeo; a identidade é checada pelo
  revisor comparando baseline × final. Sem KYC/liveness comprado agora.

**Evolução (não inventar no v1, mas a jornada acomoda):**
- 3ª pesagem (intermediária) — novo nó no caminho + nova janela sorteada.
- KYC/liveness automático, OCR do visor, forense de vídeo — trocam o "como" da revisão,
  não a jornada.
- As lições diárias viram uma **trilha de conteúdo** mais longa (Noom) conforme o
  catálogo cresce.
- Objeto de peso conhecido, baseline por média de dias, payout escalonado com manutenção
  — entram como regras, com tela/explicação própria quando chegarem.
