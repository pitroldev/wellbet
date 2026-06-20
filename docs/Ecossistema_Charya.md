# Dossiê Completo: Ecossistema CHARYA V2

Este documento consolida todas as informações estratégicas, de produto, de público e visuais referentes ao ecossistema CHARYA V2, baseado na documentação, pesquisas e definições do projeto.

---

## 1. Visão Geral e Filosofia Central

A CHARYA deixa de ser apenas "um app" para se tornar uma **plataforma de transformação comportamental gamificada**.
Ela não vende academia, apostas, treinos ou wellness. Ela vende **compromisso aplicado à transformação**.

O conceito central da plataforma é: **"Seu comportamento gera valor."**

O sistema é desenhado para resolver o problema da **falta de consistência**. As pessoas querem mudar, mas não conseguem manter a rotina por falta de compromisso real, sem consequências, sem comunidade e em aplicativos que são muito passivos.

A CHARYA constrói um _flywheel_ comportamental (um ciclo vicioso para o bem) onde o compromisso financeiro, a disciplina, a comunidade e a recompensa se retroalimentam.

---

## 2. O Ecossistema de Produtos

O ecossistema é formado por dois produtos que operam juntos. Os nomes favoritos internamente são **WellBet** (Produto 1) e **WeBet** (Produto 2). Eles compartilham a mesma _wallet_, o _Charya Score_, a mesma identidade e _streaks_.

### Produto 1: CHARYA BET (WellBet)

- **Território:** Transformação pessoal com compromisso financeiro.
- **Papel no Ecossistema:** Transformação profunda, monetização do esforço e aumento extremo de comprometimento.
- **Como funciona:** O usuário define uma meta pessoal (ex: perda de peso) e um prazo. Em seguida, aposta dinheiro em si mesmo. Um motor (_engine_) calcula a probabilidade, o risco de abandono e o _payout_. Se o usuário cumprir a meta, ganha a recompensa financeira.
- **Mecânica Psicológica:** _Loss aversion_ (aversão à perda), _commitment contract_ (contrato de compromisso), _skin in the game_ e prestação de contas (accountability) pessoal.

### Produto 2: GYM BET (WeBet)

- **Território:** Fitness social gamificado.
- **Papel no Ecossistema:** Retenção diária/social, aumento de frequência, criação de comunidade e geração de dopamina social.
- **Como funciona:** Focado em desafios do dia a dia (passos, treinos semanais, HIIT, corrida). Os usuários entram em _Squads_ (amigos, empresas, academias), sobem em rankings sociais/globais, mantêm suas _streaks_ (ofensivas) e ganham recompensas (badges, troféus).
- **Mecânica Psicológica:** Pertencimento, validação social, competição leve e medo de ficar pra trás (FOMO).

---

## 3. CHARYA SCORE™ e Mecânicas de Gamificação

O **CHARYA Score™** é o coração da integração. É um sistema proprietário de reputação comportamental. Acumula pontos baseados em _streak_, frequência, check-ins e conclusão de desafios, sofrendo queda acentuada em caso de abandono.
Usuários com Score alto desbloqueiam desafios, melhoram seu _payout_ em apostas e entram em ligas premium. Funciona como uma linguagem universal de evolução em todos os públicos.

Além disso, a gamificação traz elementos dos **jogos Gacha**, transformando esforço diário em "tiros" na roleta (com _drops_ de recompensas, bônus e _shields_ para proteger a streak), tornando a disciplina um hábito viciante.

---

## 4. O Público e os 5 Clusters de Atuação

A CHARYA atua como uma "plataforma adaptativa". Ela usa o mesmo sistema, mas adapta a narrativa de acordo com 5 clusters diferentes da população:

1. **Classe Média Fragilizada (38% - Prioridade Extrema):** Pessoas cansadas, com histórico de sanfona, que buscam recuperar o controle. A narrativa foca na "esperança de transformação" e pequenas vitórias (Charya Bet → migração para Gym Bet leve).
2. **Jovem Digital Sedentário (20% - Prioridade Extrema):** Jovens conectados que buscam pertencimento social e competição (Entram pelo Gym Bet para socializar → migram para o Charya Bet depois).
3. **Executivo Exausto (12% - Prioridade Alta):** Profissionais de 35 a 55 anos sem tempo e estressados. Entram pelo _skin in the game_ (Charya Bet) para forçar o compromisso e recuperar energia.
4. **Obesidade Crônica (22% - Prioridade Alta):** Foco em acolhimento e microvitórias constantes no Charya Bet leve. O foco não é competição, é o recomeço.
5. **Fitness Premium (8% - Prioridade Média):** Perfil crossfit, academias frequentes, com foco extremo em status, _squads_ de elite e rankings competitivos (Entrada pelo Gym Bet).

### O ICP Inicial (Go-to-Market)

O primeiro teste de mercado foca num subgrupo ideal: **Homens de 30–50 anos, com sobrepeso, competitivos, familiarizados com apostas esportivas e Pix**.

- Esse grupo entende o mecanismo de "stake/aposta" imediatamente (educação de mercado zero).
- A mensagem para eles não é "Perca peso e tenha saúde", mas sim: _"Você apostaria R$ 200 que consegue perder 8 kg em 4 meses? A única aposta em que você torce para você ganhar."_

---

## 5. Auditoria e Prevenção de Fraude (Behavioral Engine)

O maior risco do Charya Bet é o usuário tentar quebrar a banca com pesos falsos.
A auditoria utiliza uma **Matriz Build vs Buy**:

- **Comprado (Terceirizado):** KYC, OCR, Prova de Vida (_liveness_ facial) com empresas como Onfido, Unico ou Persona.
- **Construído (Proprietário):** O motor de _underwriting_ comportamental (O "Engine CHARYA™"). A IA não valida apenas o "número", ela valida a **plausibilidade fisiológica** (Ex: se alguém diz que perdeu 18kg em 20 dias, há um bloqueio automático).

**A Solução de UX Segura no MVP:** Uso do **Token Dinâmico na Tela**. O aplicativo gera palavras e números aleatórios ("CHARYA 4821", "EVOLUÇÃO") e um gesto na hora (ex: levantar a mão direita). O usuário grava um vídeo _contínuo_, sem cortes, mostrando rosto, subindo na balança, lendo o token dinâmico e mostrando o visor do peso. Isso elimina a fraude massiva, impossibilita deepfakes, replays de vídeos antigos e adulterações sem aumentar agressivamente o custo operacional. A fraude deixa de ser impossível, mas torna-se economicamente muito cara de ser feita.

---

## 6. Diretrizes Visuais, Naming e Narrativas

- **A Arquitetura de Naming (Favorita):** O prefixo compartilhado "We/Well" (WellBet / WeBet) reforça a percepção de ecossistema com uma estrutura fonética comum, imitando redes gigantes como Globo (Gshow, G1, Ge).
- **Narrativa a ser seguida:** _"Você muda quando existe algo real em jogo"_, _"Comprometa-se. Evolua. Ganhe."_, _"Aposte na sua transformação."_
- **Estética Visual Exigida:** Mostrar **pessoas reais**, evolução e diversidade corporal no esforço. Mostrar o momento do treino diário. Usar estilo visual moderno mas limpo.
- **O que deve ser COMPLETAMENTE EVITADO (Risco Tóxico):** \* Não usar linguagem adolescente/gamer excessiva ("Lucre treinando", "Dinheiro fácil").
  - **Proibir estética de Cassino/Neon de bet**: a plataforma vende saúde e credibilidade. Cores e vibes de site de aposta barata destruiriam a confiança do usuário que está apostando o próprio dinheiro para sua mudança de vida.
  - Não deve parecer um ambiente elitizado (_bodybuilding_, estética perfeita) nem focar na "humilhação" dos últimos lugares nos rankings, para não causar evasão.

---

## 7. Status e Contratações

O projeto já está estruturado jurídica e operacionalmente, com Contrato de Prestação de Serviços (SLA) firmado para o desenvolvimento tecnológico do _core_ do sistema entre a CHARYA SAUDE E BEM-ESTAR LTDA e o fornecedor de tecnologia. O contrato garante a propriedade intelectual integral de todos os códigos (bases, scripts, módulos) à Charya, estipulando multas pesadas por vazamentos (Nível R$ 500 mil) para assegurar que a engine de gamificação e o _Behavioral Underwriting_ permaneçam como o fosso competitivo exclusivo da empresa.
