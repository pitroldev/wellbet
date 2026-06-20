# Charya Bet — Stacks Tecnológicas (alternativas + recomendação)

> **Objetivo:** comparar opções de stack para **backend, cloud/infra, frontend administrativo e app mobile**, e recomendar uma combinação **custo-eficiente** e **escalável para picos**.
>
> **Contexto que orienta a escolha:**
> - Produto **pesado em vídeo** (upload/armazenamento das pesagens) — ver [Validação de Peso no MVP](./Charya_Validacao_Peso_MVP.md).
> - Carga **espetada** (campanhas, lançamentos, fim de prazo de apostas) → muito ocioso + picos curtos.
> - Time pequeno, MVP **manual-first**, futuro com Pix/carteira.
> - Operação no Brasil → latência e LGPD (residência de dados em região BR).

---

## 1. Critérios de decisão

| Critério | O que favorece |
|---|---|
| **Custo no ocioso** | Compute que **escala a zero** (não paga parado) |
| **Custo de banda (egress)** | Vídeo é o maior tráfego → storage com **egress barato/zero** |
| **Pico** | Autoscaling rápido, sem provisionar servidor fixo |
| **Velocidade do time** | **Uma linguagem** no stack inteiro reduz time/custo |
| **Ops mínimo** | Serviços gerenciados em vez de infra própria |
| **Sem lock-in** | Padrões abertos e peças trocáveis sem reescrever |
| **Brasil** | Região local (latência) + conformidade LGPD |

> **Princípio-guia 1:** **TypeScript em todas as camadas** (mobile, admin, backend). Um time pequeno mantém uma linguagem só, compartilha tipos e validações, e contrata mais fácil.
>
> **Princípio-guia 2 (anti-lock-in):** apoiar tudo em **padrões abertos** — **Postgres** (banco), **API S3** (storage), **containers OCI/Docker** (compute), **OpenAPI** (contratos). Cada fornecedor vira **detalhe de implementação trocável**, não dependência estrutural. Ver §8.

---

## 2. Backend

### Alternativas

| Opção | Prós | Contras |
|---|---|---|
| **A. Node.js + TypeScript** (NestJS ou Fastify) | Mesma linguagem do mobile/admin; ecossistema gigante; ótimo para I/O (upload de vídeo) | CPU-bound puro não é o forte (irrelevante aqui) |
| **B. Python (FastAPI)** | Forte para a futura engine de plausibilidade (ML/dados) | Segunda linguagem no stack; mais lento em I/O concorrente |
| **C. Go** | Melhor custo/req em throughput alto; binário enxuto | Menor velocidade de time; ecossistema menor; verboso para CRUD |
| **D. BaaS (Supabase)** | Postgres + Auth + Storage + Row-Level Security prontos; MVP voa | Lógica custom precisa de Edge Functions ou serviço à parte; lock-in parcial |

### Recomendação: **A — serviço NestJS (TS) em container + Postgres gerenciado, sem amarrar no BaaS**

Toda a **lógica de negócio** (código dinâmico, regra de sanidade, fila de revisão, settlement) fica num **serviço NestJS em TypeScript**, empacotado em **container Docker** — roda em qualquer provedor.

O dado fica em **Postgres gerenciado puro** (Neon, Supabase ou RDS — todos Postgres por baixo, portáveis). **Para evitar lock-in, o banco é tratado só como Postgres**: nada de funções proprietárias do BaaS no caminho crítico.

**Autenticação:** para não casar com um fornecedor, usar uma **lib de auth open-source rodando no próprio backend** (Better Auth / Lucia / Auth.js) em vez de "Supabase Auth". Custa alguns dias a mais que o BaaS pronto, mas tira a dependência. Se a pressa do MVP falar mais alto, dá para usar Supabase Auth **isolado atrás de uma interface própria** e trocar depois — decisão consciente, documentada.

A engine de plausibilidade da Fase 2 (Python) entra como **microserviço isolado**, sem tocar no core TS.

---

## 3. Cloud / Infra

### Alternativas

| Opção | Prós | Contras |
|---|---|---|
| **A. AWS** (sa-east-1 São Paulo) | Mais maduro; tudo existe; região BR | Complexidade e custo; egress de vídeo caro; escala-a-zero exige montagem |
| **B. GCP — Cloud Run** (southamerica-east1) | **Escala a zero**, paga por uso, absorve pico nativamente; região BR | Egress padrão não é barato |
| **C. Cloudflare** (Workers + R2 + Queues) | **R2 com egress ZERO**; edge global; baixíssimo custo | Workers têm limites para backend pesado; menos maduro para serviços longos |
| **D. Fly.io / Render** | PaaS simples; deploy de container fácil; escala a zero | Operação menor que hyperscalers; menos serviços geridos |

### Recomendação: **Híbrido — compute em Cloud Run (ou Fly.io) + vídeo no Cloudflare R2**

A combinação que melhor casa com os dois eixos do projeto — **e tudo trocável**, porque a aplicação é um **container** e o storage fala **API S3**:

- **Compute: Cloud Run** (região São Paulo) — **escala a zero** no ocioso e **autoescala no pico** sem servidor fixo. Como roda um **container OCI**, o mesmo artefato sobe em **Fly.io, Render, ECS ou Kubernetes** sem reescrever — Cloud Run é conveniência, não amarra.
- **Armazenamento de vídeo: Cloudflare R2** — **egress zero** e **API S3-compatível**. Vídeo é o maior tráfego do produto; em S3/GCS o egress vira a maior fatura. R2 mata esse custo, e por falar S3 dá para **migrar para Backblaze B2, AWS S3 ou MinIO** só trocando endpoint/credencial. Upload **direto do app para o R2** via URL pré-assinada, sem passar pelo backend.
- **Banco: Postgres gerenciado** (Neon ou Supabase — ambos **escala a zero** e Postgres puro, portável).
- **CDN/edge:** Cloudflare na frente (proteção e cache) — camada fina, removível.
- **Infra como código: Terraform/OpenTofu** — provisionamento versionado e reprodutível em **qualquer** provedor; é o que torna "trocar de nuvem" um exercício real, não teórico.

> **Por que não AWS "puro":** funciona, mas o egress de vídeo e a montagem de escala-a-zero encarecem e atrasam um MVP. O híbrido entrega o mesmo resultado mais barato — e, por ser container + API S3 + Postgres, **migrar tudo para AWS depois é trivial** se for o caso.

---

## 4. Frontend Administrativo (console de revisão)

É a ferramenta operacional do MVP manual-first: **fila de pesagens + player de vídeo + checklist do revisor + veredito**.

### Alternativas

| Opção | Prós | Contras |
|---|---|---|
| **A. Next.js + shadcn/ui** (React) | Mesma linguagem (TS); controle total da UX de revisão (player + checklist); sem custo de licença | Construir do zero leva alguns dias a mais |
| **B. Retool / Appsmith** (low-code) | Console no ar em dias; CRUD e player rápidos | Custo por assento; UX de revisão de vídeo limitada; lock-in |
| **C. Refine** (framework React admin open-source) | Meio-termo: admin pronto, mas em React/TS; sem licença | Curva inicial; menos controle que Next puro |

### Recomendação: **A — Next.js + shadcn/ui**

O console **é o coração da operação no MVP** (toda pesagem passa por ele), e a UX de revisão (vídeo + checklist item a item) é específica demais para low-code. Construir em **Next.js/TypeScript** mantém a linguagem única, dá controle total e não tem custo por assento conforme o time de revisão cresce. **Retool** fica como plano B se a pressa for extrema na primeira semana.

---

## 5. App Mobile

A captura de vídeo **é o componente mais crítico e mais arriscado** do MVP (gravação contínua, bloqueio de galeria, confiabilidade de upload). A escolha mobile gira em torno disso.

### Alternativas

| Opção | Prós | Contras |
|---|---|---|
| **A. React Native + Expo** | Mesma linguagem (TS); um código iOS+Android; `react-native-vision-camera` é robusto para gravação | Recursos nativos muito específicos exigem módulo nativo |
| **B. Flutter** | UI performática; câmera sólida (`camera`/`CameraX`) | Dart = segunda linguagem; não compartilha tipos com backend/admin |
| **C. Nativo (Swift + Kotlin)** | Controle máximo de câmera/codec/upload | **Dobra** tempo e custo (dois apps); time maior |

### Recomendação: **A — React Native + Expo (com `react-native-vision-camera`)**

Um código para iOS e Android, **na mesma linguagem do resto do stack** (compartilha tipos, validações e gente). O `react-native-vision-camera` cobre gravação contínua e controle de câmera no nível que o MVP precisa. Expo acelera build/OTA. Se algum requisito de câmera/codec passar do que o RN entrega, encapsula-se só aquele trecho num **módulo nativo**, sem reescrever o app.

> Nativo puro só se justifica se o controle fino de codec/upload virar bloqueio real — improvável no MVP.

---

## 6. Stack recomendada (consolidada)

| Camada | Escolha | Porquê (custo + pico + sem lock-in) |
|---|---|---|
| **Mobile** | React Native + Expo + vision-camera | 1 código, TS único, câmera robusta; Expo é open-source (ejetável) |
| **Admin** | Next.js + shadcn/ui | UX de revisão própria, sem custo por assento; framework aberto |
| **Backend** | NestJS (TypeScript) em container | TS único; container roda em qualquer nuvem |
| **Auth** | Lib open-source no backend (Better Auth/Lucia/Auth.js) | Sem casar com fornecedor de identidade |
| **Banco** | Postgres gerenciado (Neon/Supabase) | Gerenciado; escala a zero; **Postgres puro = portável** |
| **Compute** | Cloud Run (ou Fly.io), região BR | **Escala a zero** + autoescala; **container OCI trocável** |
| **Vídeo** | Cloudflare R2 (upload direto, URL pré-assinada) | **Egress zero**; **API S3 = trocável** (B2/S3/MinIO) |
| **Edge/CDN** | Cloudflare | Proteção, cache, latência BR; camada removível |
| **Infra** | Terraform/OpenTofu | Provisionamento portável e versionado |

```
        ┌─────────────────────┐
        │  App (React Native) │
        └──────────┬──────────┘
        upload direto│ (URL pré-assinada)
            ┌────────▼────────┐        ┌──────────────────┐
            │  Cloudflare R2  │◄───────│  Console Admin   │
            │  (vídeos)       │ stream │  (Next.js)       │
            └────────┬────────┘        └────────┬─────────┘
                     │ ref                       │
        ┌────────────▼───────────────────────────▼─────────┐
        │     Backend NestJS @ Cloud Run (escala a zero)    │
        │  código dinâmico · regra de sanidade · settlement │
        └────────────┬───────────────────────────┬─────────┘
                     │                            │
            ┌────────▼────────┐          ┌────────▼────────┐
            │  Supabase Auth  │          │ Postgres (BR)   │
            └─────────────────┘          └─────────────────┘
```

---

## 7. Como esta stack responde aos dois eixos

**Custo-eficiente:**
- Compute **escala a zero** → no ocioso (a maior parte do tempo de um MVP), a fatura de servidor é mínima.
- **R2 com egress zero** → o vídeo, que seria a maior despesa de banda, praticamente não custa para servir.
- **Uma linguagem** → time menor, menos retrabalho, contratação mais barata.
- Serviços gerenciados → quase nenhum custo de ops/DevOps dedicado.

**Escalável para picos:**
- **Cloud Run autoescala** por requisição em segundos no pico de campanha/fim de prazo, e recolhe depois.
- **Upload direto app → R2** tira o vídeo do caminho do backend: o pico de upload não derruba a API.
- **Edge da Cloudflare** absorve tráfego e protege a origem.
- Postgres gerenciado escala vertical/connection-pooling sem reprovisionar.

---

## 8. Portabilidade — como o lock-in é evitado, peça por peça

A regra: cada fornecedor é acessado por um **padrão aberto**, então trocar de fornecedor é mudar config, não reescrever código.

| Peça | Padrão aberto que a isola | Trocar por (sem reescrever) |
|---|---|---|
| Compute (Cloud Run) | **Container OCI/Docker** | Fly.io, Render, AWS ECS, Kubernetes |
| Vídeo (R2) | **API S3** | Backblaze B2, AWS S3, MinIO (self-host) |
| Banco (Neon/Supabase) | **Postgres** (SQL + `pg_dump`) | RDS, Cloud SQL, Postgres self-host |
| Auth (lib no backend) | Sessões/JWT padrão | outra lib, ou IdP via OIDC |
| Contratos da API | **OpenAPI** | qualquer cliente/gateway |
| Provisionamento | **Terraform/OpenTofu** | reaplica em outro provedor |

**Regras de disciplina para manter a portabilidade real (não só teórica):**
- **Nada de função proprietária no caminho crítico** (ex.: triggers/edge functions do BaaS). Lógica mora no NestJS.
- **Acesso a storage sempre via SDK S3**, nunca por API exclusiva do fornecedor.
- **Sem extensões de Postgres exóticas** que só um provedor tem; ficar no SQL padrão.
- **Tudo em IaC** desde o dia 1 — se a infra não está no Terraform, a migração vira manual e cara.
- **Camadas removíveis isoladas atrás de interface própria** (auth, pagamentos, KYC futuro) para troca sem cirurgia.

> **Trade-off assumido:** evitar lock-in custa um pouco de velocidade inicial (ex.: montar auth próprio em vez de usar o BaaS pronto). É uma escolha consciente — porque o custo de **sair** de um BaaS depois é muito maior que o de não entrar.

---

## 9. Caminho de evolução (quando crescer)

| Gatilho | Evolução |
|---|---|
| Engine de plausibilidade (Fase 2) | Microserviço **Python/FastAPI** isolado, sem tocar no core TS |
| Volume de revisão alto | Filas (Cloudflare Queues / SQS) + workers para OCR/forense automáticos |
| Processamento de vídeo | Transcodificação assíncrona (worker dedicado) antes da revisão |
| Pix/carteira | PSP brasileiro (Asaas, Pagar.me, Mercado Pago) ou Stripe — desacoplado por serviço |
| Multi-região / escala | Migrar compute para Kubernetes gerenciado só se Cloud Run virar limite (provável que não tão cedo) |

---

## 10. Riscos e ressalvas

- **"Sem lock-in" exige disciplina, não só ferramenta:** as escolhas acima só seguram se as **regras da §8** forem respeitadas (nada de feature proprietária no caminho crítico). Lock-in entra pela conveniência, aos poucos.
- **Limite do Cloud Run para jobs longos:** transcodificação pesada de vídeo deve ir para **worker assíncrono**, não para o request síncrono.
- **R2 é storage, não banco:** metadados e estado ficam no Postgres; R2 guarda só os arquivos.
- **Auth próprio é responsabilidade sua:** ganhar portabilidade significa assumir a segurança da auth (hashing, sessões, reset) — usar lib madura e auditada, não rolar do zero.
- **LGPD:** manter Postgres e (idealmente) R2 em configuração com dados em região compatível; revisar tratamento de vídeo (dado biométrico) com jurídico.
