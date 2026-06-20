# Charya Bet — Arquitetura Técnica (stack detalhada, monorepo e CI/CD)

> **Pré-requisito:** stack já decidida em [Stack Tecnológica](./Charya_Stack_Tecnologica.md). Este documento desce ao nível de **cada ambiente** (backend, mobile, admin, infra), detalhando **frameworks, libs, padrões de código e arquitetura**, e define a **estrutura do monorepo** e os **pipelines de CI/CD**.
>
> **Baseline de versões (jun/2026):** Node 24 LTS · TypeScript 6 (TS 7 RC para type-check de CI) · Expo SDK 56 (RN 0.85 + React 19.2, New Architecture obrigatória) · Reanimated 4 · Zod 4 · Vitest 4 · NestJS 11 (v12 alpha). Auditoria de modernização e itens a adotar estão na **§10**.

---

## 0. Princípios de engenharia (valem para tudo)

1. **TypeScript em tudo**, em modo `strict`. Tipos e validações compartilhados entre apps.
2. **Padrões abertos** (Postgres, S3, OCI, OpenAPI, OpenTelemetry) — fornecedor é detalhe trocável.
3. **Fronteiras externas atrás de interface** (storage, auth, pagamento, KYC) — _ports & adapters_. Trocar de fornecedor = trocar adapter.
4. **Schema como fonte única da verdade:** Zod define a validação **uma vez**, reusada no back e no front.
5. **Contrato explícito entre apps:** OpenAPI gerado pelo backend → cliente tipado gerado para mobile/admin. Ninguém "adivinha" o shape da API.
6. **Tudo versionado e reprodutível:** infra em IaC, toolchain pinada (mise), deploy por container imutável, migrações versionadas.

---

## 1. Estrutura do monorepo

**Gerenciador:** **pnpm workspaces** (rápido, disco eficiente; usar **catalogs** para centralizar versões compartilhadas).
**Orquestrador de build:** **Turborepo** (cache local + remoto, build só do afetado via `turbo query affected`).
**Toolchain pinada:** **mise** (Node, pnpm, etc. reprodutíveis — Corepack saiu do Node 25+).

```
charya/
├── apps/
│   ├── api/            # Backend NestJS (container)
│   ├── admin/          # Console de revisão (Next.js)
│   └── mobile/         # App (Expo / React Native)
├── packages/
│   ├── contracts/      # OpenAPI + cliente tipado gerado (fonte: api)
│   ├── schemas/        # Zod schemas + tipos de domínio compartilhados
│   ├── env/            # t3-env: variáveis de ambiente tipadas e validadas
│   ├── config/         # tsconfig base, eslint/oxlint, prettier presets
│   └── ui-tokens/      # design tokens (cores, espaçamento) p/ web e mobile
├── infra/
│   └── terraform/      # OpenTofu (módulos + ambientes)
├── .github/workflows/  # CI/CD
├── .devcontainer/      # onboarding reprodutível (Codespaces/VS Code/JetBrains)
├── mise.toml           # versões de toolchain pinadas
├── turbo.json
├── pnpm-workspace.yaml  # inclui catalogs
├── package.json        # raiz: scripts, devDeps comuns
└── tsconfig.base.json
```

**Regras do monorepo:**

- **Dependências fluem só para dentro:** `apps/*` dependem de `packages/*`; `packages/*` **não** dependem de `apps/*`.
- `schemas` é a base; `contracts` é gerado a partir do `api`; ninguém edita `contracts` à mão.
- **TypeScript project references** + `tsconfig.base.json` único (`composite` + `declarationMap` para go-to-definition cross-package).
- Versionamento de pacotes internos com **Changesets**.
- **Higiene contínua:** **knip** (código/deps morto), **syncpack** + **@manypkg/cli** (versões e `workspace:` consistentes), **publint + attw** (exports/types corretos dos pacotes).

**Por que monorepo:** com TS em tudo, compartilhar tipos/validação/contrato no mesmo repo elimina drift entre app e API e acelera o time pequeno. Turborepo garante que o CI builde só o app afetado.

---

## 2. Backend — `apps/api`

### Stack

| Item            | Escolha                                         | Porquê                                                                         |
| --------------- | ----------------------------------------------- | ------------------------------------------------------------------------------ |
| Framework       | **NestJS** (11; v12 alpha)                      | Estrutura modular opinada, DI, testável; container portável                    |
| ORM             | **Drizzle ORM** (v1 RC — **pinar versão**)      | SQL-first, leve, Postgres-nativo, sem runtime pesado                           |
| Validação       | **Zod 4** (via `nestjs-zod` v5)                 | Mesma lib do front; ~5× mais rápida; DTO e OpenAPI a partir do schema          |
| Auth            | **Better Auth** (**≥ 1.6.14**)                  | Open-source, self-hosted, adapter Postgres; **ver alerta de segurança abaixo** |
| Fila/jobs       | **pg-boss**                                     | Fila em cima do **próprio Postgres** — zero infra extra no MVP                 |
| Config/env      | **t3-env** (`packages/env`) + `@nestjs/config`  | App não sobe com env inválido; fronteira de env tipada                         |
| Log             | **Pino** + **`pino-opentelemetry-transport`**   | JSON estruturado, correlacionado a `traceId`                                   |
| Observabilidade | **OpenTelemetry** (auto-instrumentation → OTLP) | Tracing vendor-neutro; ver §10 (maior gap fechado)                             |
| Storage         | **AWS SDK v3 (S3 client)** apontando para R2    | API S3 = trocável                                                              |
| OpenAPI         | `@nestjs/swagger` → cliente via **Hey API**     | Emite o contrato; **check de drift no CI**                                     |
| Runtime         | **Node 24 LTS** (type-stripping nativo)         | Sem transpile de build; `tsc --noEmit` só p/ type-check                        |
| Testes          | **Vitest 4** + **Supertest**                    | Rápido, mesmo runner dos pacotes TS                                            |

> **⚠️ Segurança — Better Auth:** um lote de **15 advisories (jun/2026)**, incluindo SSO/OIDC críticos, foi corrigido na linha **1.6.14**. Pinar **≥ 1.6.14** e atualizar **todos** os pacotes `@better-auth/*` (não só o core).

### Arquitetura — modular por feature, com ports & adapters nas bordas

```
apps/api/src/
├── main.ts
├── app.module.ts
├── observability/         # OTel SDK, instrumentação, exporters OTLP
├── config/                # env (t3-env), config tipada
├── shared/                # filtros de exceção, interceptors, guards, logger
├── infra/                 # ADAPTERS de borda (implementações)
│   ├── db/                # drizzle client, schema, migrations
│   ├── storage/           # S3Adapter (R2) implementa StoragePort
│   ├── auth/              # Better Auth wiring
│   └── queue/             # pg-boss
└── modules/
    ├── weighin/           # feature: pesagem
    │   ├── domain/        # entidades, regras puras (ex.: regra de sanidade)
    │   ├── application/   # use-cases (serviços), PORTS (interfaces)
    │   ├── infra/         # repositórios Drizzle do módulo
    │   └── http/          # controllers, DTOs (zod), mapeadores
    ├── challenge/         # código dinâmico (nonce)
    ├── review/            # fila + veredito da revisão humana
    ├── bet/               # aposta, settlement
    └── identity/          # usuário, auth
```

**Padrões:**

- **Use-case por arquivo** na camada `application` (um caso de uso = uma classe `XUseCase` com `execute()`).
- **Ports (interfaces) na `application`**, **adapters na `infra`** — ex.: `StoragePort` → `R2StorageAdapter`. Trocar R2 por B2 = novo adapter, zero mudança no use-case.
- **Regras de domínio são funções/objetos puros e testáveis** sem framework (ex.: `perda_por_semana` e a regra de sanidade vivem em `domain/`).
- **DTOs via Zod** (`nestjs-zod`): o mesmo schema valida o request e alimenta o OpenAPI. **`drizzle-zod`** deriva validadores a partir das tabelas → schema único do banco ao input.
- **Erros padronizados:** taxonomia de erros (union discriminada/classes) → `exception filter` global → resposta JSON consistente (`{ code, message, details }`). Nada de `throw new Error` solto.
- **Observabilidade por padrão:** OTel auto-instrumenta HTTP/DB; spans correlacionados aos logs Pino.
- **Migrações:** Drizzle Kit, versionadas em `infra/db/migrations`, aplicadas em step de deploy (nunca auto-migrate em runtime).
- **Idempotência** nos endpoints de escrita financeira/settlement (chave de idempotência).

---

## 3. Mobile — `apps/mobile`

### Stack

| Item                  | Escolha                                                        | Porquê                                                                              |
| --------------------- | -------------------------------------------------------------- | ----------------------------------------------------------------------------------- |
| Framework             | **Expo SDK 56** (RN 0.85 / React 19.2)                         | 1 código iOS+Android; OTA; New Architecture obrigatória                             |
| Navegação             | **expo-router**                                                | Rotas por arquivo (igual mental ao Next)                                            |
| Câmera                | **react-native-vision-camera v5** (Nitro)                      | Gravação contínua; ~15× mais rápido que TurboModules; frame processors via worklets |
| Estado servidor       | **TanStack Query v5**                                          | Cache, retry, sync — crítico p/ upload instável                                     |
| Estado local          | **Zustand 5**                                                  | Simples, sem boilerplate de Redux                                                   |
| Formulários           | **react-hook-form + Zod 4**                                    | Reusa os schemas do `packages/schemas`                                              |
| Estilo (estático)     | **NativeWind** (Unistyles em telas hot)                        | Mesma linguagem do admin; Unistyles atualiza estilo sem re-render                   |
| Listas                | **FlashList v2**                                               | Auto-sizing (sem `estimatedItemSize`); recycle-pool tunável                         |
| Motor de animação     | **react-native-reanimated 4**                                  | UI thread (60/120fps); **CSS Animations API** declarativa off-thread                |
| Gestos                | **react-native-gesture-handler 3.0**                           | API de hooks; `Touchable` sem re-render; integra com Reanimated                     |
| Imagens               | **expo-image** (ThumbHash/BlurHash)                            | Padrão performático; placeholder sem jank                                           |
| Feedback tátil        | **expo-haptics** (dentro de worklets de gesto)                 | Háptico frame-accurate ao gesto                                                     |
| Animação interativa   | **Rive**                                                       | State-machine, data-bound, ~10-15× menor que Lottie (mascote, onboarding reativo)   |
| Animação decorativa   | **Lottie** (`lottie-react-native`)                             | Confete, reveal de prêmio — desmontar ao terminar                                   |
| Gráfico/efeito custom | **react-native-skia**                                          | Partículas, gacha, efeitos contínuos (GPU, UI thread)                               |
| Som                   | **expo-audio**                                                 | Feedback sonoro de vitória/streak (expo-av foi removido no SDK 55)                  |
| HTTP                  | cliente tipado de `packages/contracts`                         | Sem adivinhar shape da API                                                          |
| Storage seguro        | **expo-secure-store** (tokens) + **MMKV v4** (Nitro)           | Token seguro; cache rápido nativo                                                   |
| Testes                | **Jest + jest-expo** + **RN Testing Library**; E2E **Maestro** | ⚠️ Vitest **não suporta RN**; Jest é o runner oficial do Expo                       |
| Build/Deploy          | **EAS Build / Submit / Update** (+ **EAS Workflows**)          | Build na nuvem + OTA + cache de build nativo                                        |

> **Pré-requisito:** **New Architecture** (Fabric + JSI + Hermes) é a **única** arquitetura desde RN 0.82 — `newArchEnabled=false` é ignorado. Worklets agora vêm no pacote separado **`react-native-worklets`** (plugin Babel `react-native-worklets/plugin`).
>
> **120Hz:** habilitar **`CADisableMinimumFrameDurationOnPhone`** no `Info.plist` (padrão no template RN 0.82+, mas **verificar** — sem isso o app trava silenciosamente em 60fps).

### Arquitetura

```
apps/mobile/
├── app/                    # rotas (expo-router): onboarding, pesagem, aposta...
├── src/
│   ├── features/           # por domínio: weighin, bet, auth, wallet
│   │   └── weighin/
│   │       ├── api/        # hooks TanStack Query (usa contracts)
│   │       ├── components/
│   │       ├── camera/     # captura: gravação contínua + overlay do código
│   │       └── model/      # store zustand, lógica de fluxo da captura
│   ├── shared/             # ui base, hooks, libs (storage, http client)
│   └── theme/              # tokens de ui-tokens
└── app.config.ts
```

**Padrões:**

- **Feature-first** (mesma divisão do backend) — cada feature tem `api/components/model`.
- **Camada de captura isolada:** toda a lógica de vídeo (gravar sem corte, exibir o código dinâmico, bloquear galeria, retry de upload) mora em `features/weighin/camera`, encapsulável num **módulo nativo (Nitro)** se passar do que o vision-camera entrega.
- **Upload resiliente:** upload **direto para R2** via URL pré-assinada, com retry/resumo gerenciado por TanStack Query — o pico de upload não toca o backend.
- **Schemas Zod compartilhados** validam formulário e payload antes de enviar.

### Animação e feel (dopamina)

A UI do app é **deliberadamente animada, snappy e recompensadora** — coerente com a gamificação do produto (streaks, gacha, recompensa). Isso é requisito de produto, não enfeite.

**Onde a "suculência" mora:** nas telas de **resultado, meta batida, streak, ranking e recompensa** — não na tela de captura. Toda interação relevante dá **retorno tátil (haptics) + visual + sonoro**.

**Padrões de animação:**

- **Anima na UI thread, sempre.** Motion declarativo via **CSS Animations API do Reanimated 4** (off-thread, sem shared values); casos imperativos via `useAnimatedStyle`/worklets. **Nunca** animar por estado React nem troca de `className`. NativeWind cuida só do estilo **estático**.
- **Háptico dentro de worklets de gesto** (frame-accurate ao progresso do gesto), não em handler na thread JS.
- **Transições entre telas** via **react-native-screen-transitions** (as Shared Element Transitions do Reanimated seguem experimentais, atrás de flag).
- **Rive** para animação interativa/state-machine (mascote, onboarding reativo); **Lottie** só para decorativo discreto (confete, reveal — desmontar ao fim); **Skia** para contínuo/partícula (gacha).
- **Respeitar `useReducedMotion`/`ReducedMotionConfig`** (acessibilidade).

> Nota: **Moti** ficou para trás — é baseado em Reanimated 3 e quebra no Reanimated 4. A CSS API do RN4 cobre o que ele fazia. Não expandir uso de Moti.

### Orçamento de performance

Feel rico **e** 60/120fps coexistem se a disciplina abaixo for respeitada. Queda de FPS é tratada como **bug**, não como "natural".

| Regra                                                                                       | Por quê                                                        |
| ------------------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **Animar só via Reanimated 4 / Skia (UI thread)**                                           | mantém fluidez mesmo com a thread JS ocupada                   |
| **Nunca animar por `className`/estado React**                                               | recomputar a cada frame trava a thread JS                      |
| **FlashList v2 em toda lista** (nunca FlatList longa)                                       | listas são o maior matador de FPS do RN                        |
| **120Hz habilitado** (`CADisableMinimumFrameDurationOnPhone`)                               | sem isso, trava em 60fps silenciosamente                       |
| **expo-image com placeholder**                                                              | decodificação de imagem fora do caminho de jank                |
| **Lottie discreto / Skia contínuo / Rive interativo**                                       | cada um na ferramenta certa; loop full-screen de Lottie é caro |
| **Tela de captura enxuta durante a gravação**                                               | vision-camera já consome CPU/GPU/memória — não competir        |
| **Worklets para lógica de gesto/animação**                                                  | tira trabalho da thread JS no toque                            |
| **Profiling on-device** (RN DevTools, Hermes profiler, **Flashlight** no CI, **Radon IDE**) | mede JS FPS vs UI FPS separadamente — queda de JS FPS = bug    |

> **Regra de ouro:** **NativeWind para o estático; Reanimated 4/Skia para tudo que se move.** O risco de performance real do app não é a animação — é o **vídeo**; por isso a captura é sóbria e a dopamina visual fica nas telas que não disputam com a câmera.

---

## 4. Admin — `apps/admin`

### Stack

| Item            | Escolha                                                             | Porquê                                                                   |
| --------------- | ------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Framework       | **Next.js 16 (App Router)**, `output: 'standalone'`                 | React/TS; container no Cloud Run (não Vercel → sem lock-in). _Ver nota._ |
| UI              | **shadcn/ui + Tailwind v4**                                         | Componentes próprios, sem custo por assento                              |
| Primitivos      | **Base UI** (v1.0) para componentes novos                           | Radix tem risco de manutenção; Base UI é o sucessor                      |
| Tabela          | **TanStack Table v8**                                               | Fila de revisão com sort/filter/paginação                                |
| Player de vídeo | **`<video>` puro** (ou Media Chrome / Mux Player)                   | **Vidstack saiu** (manutenção reduzida); esses alimentam o Video.js v10  |
| Estado servidor | **TanStack Query v5**                                               | Mesma lib do mobile                                                      |
| Formulários     | **react-hook-form + Zod 4**                                         | Reusa schemas                                                            |
| Auth            | **Better Auth** (sessão compartilhada com a API)                    | Mesmo sistema do backend                                                 |
| Testes          | **Vitest 4** (+ Browser Mode) + Testing Library; E2E **Playwright** | Componente em browser real + fluxo do revisor                            |

> **Nota estratégica:** para um admin **interno, em container, anti-lock-in**, **Next.js + RSC é leve overkill** (sem SEO, autenticado, interativo — RSC não ajuda). **Não vale migrar** o que funciona, mas o default do **próximo** app interno deveria ser **TanStack Start** (Vite, sem "imposto RSC", container-trivial) — Query/Table/Form/Better Auth já rodam nativamente nele.

### Arquitetura

```
apps/admin/
├── app/
│   ├── (auth)/             # login
│   └── (dashboard)/
│       ├── review/         # fila + tela de revisão (player + checklist)
│       ├── bets/           # apostas
│       └── users/
├── src/
│   ├── features/review/    # componentes: VideoReviewer, ChecklistForm, queue
│   ├── shared/             # ui (shadcn/Base UI), http client (contracts), hooks
│   └── lib/
└── next.config.ts          # output: 'standalone' (container)
```

**Padrões:**

- **Server Components** para listagens/leitura; **Client Components** só onde há interação (player, checklist).
- **O console é o coração do MVP manual-first:** a tela de revisão = player + **checklist item a item** (os V1–V11 do doc de validação) + ação de veredito (`APROVADO`/`PENDENTE`/`REPROVADO`), gravando motivo e flags (vira dataset da Fase 2).
- **Next em modo `standalone`** → imagem Docker enxuta; com cache handler externo se escalar além de 1 instância.

---

## 5. Pacotes compartilhados — `packages/*`

| Pacote          | Conteúdo                                                                             | Consumido por                         |
| --------------- | ------------------------------------------------------------------------------------ | ------------------------------------- |
| **`schemas`**   | Schemas **Zod 4** (pesagem, aposta, usuário) + tipos de domínio                      | api, mobile, admin                    |
| **`contracts`** | **OpenAPI** (emitido pela api) + **cliente TS gerado** (**Hey API**)                 | mobile, admin                         |
| **`env`**       | **t3-env** (Standard Schema) — env tipada e validada no boot                         | api, admin                            |
| **`config`**    | `tsconfig.base`, presets de **ESLint (flat) + Prettier** e **oxlint**, regras comuns | todos                                 |
| **`ui-tokens`** | Design tokens (cores, espaçamento, tipografia)                                       | admin (Tailwind), mobile (NativeWind) |

**Fluxo do contrato:** `api` emite `openapi.json` no build → **Hey API** gera o cliente tipado em `contracts` → `mobile`/`admin` importam funções tipadas. Mudou a API e não atualizou o contrato? **O type-check do CI quebra** e o **check de spec-drift** falha o build. É essa quebra que evita drift.

---

## 6. Infra — `infra/terraform`

**Ferramenta:** **OpenTofu** (fork aberto do Terraform — coerente com anti-lock-in).

```
infra/terraform/
├── modules/
│   ├── cloud-run/          # serviço de container + autoscaling + min/max
│   ├── postgres/           # Neon/Cloud SQL (provider trocável)
│   ├── r2-bucket/          # bucket S3-compatível + CORS p/ upload direto
│   └── cloudflare/         # DNS, CDN, WAF
├── envs/
│   ├── staging/
│   └── prod/
└── remote-state.tf         # state remoto (bucket) + lock
```

**Padrões:**

- **Módulos reutilizáveis**, ambientes (`staging`/`prod`) só compõem módulos com variáveis diferentes.
- **State remoto** versionado, com lock.
- **Nada criado pela console** — se não está no OpenTofu, não existe. É o que torna migração de nuvem real.
- Secrets fora do código: **Secret Manager** (ou Cloudflare/Doppler), injetados em runtime.

---

## 7. Padrões de código (transversais)

| Tema                     | Padrão                                                                                             |
| ------------------------ | -------------------------------------------------------------------------------------------------- |
| Lint type-aware          | **ESLint flat + typescript-eslint** (fonte da verdade) — preset em `packages/config`               |
| Lint rápido              | **oxlint** como pré-passo (50-100× mais rápido) em pre-commit/CI, antes do ESLint                  |
| Format                   | **Prettier**                                                                                       |
| Commits                  | **Conventional Commits** + **commitlint**                                                          |
| Pre-commit               | **Lefthook** (paralelo, monorepo-aware; substitui Husky+lint-staged)                               |
| Branching                | **Trunk-based**: `main` sempre deployável; branches curtas; PR + **merge queue**                   |
| Versionamento de pacotes | **Changesets**                                                                                     |
| Toolchain                | **mise** (Node/pnpm pinados e reprodutíveis)                                                       |
| Higiene                  | **knip**, **syncpack**, **@manypkg/cli**, **publint+attw**; **Renovate** para updates              |
| Env                      | **t3-env** — toda variável de ambiente tipada e validada                                           |
| Tipagem                  | TS `strict`; **proibido `any`** sem justificativa; validação de borda sempre via Zod               |
| Testes                   | **Vitest** (backend/web/pacotes TS) · **Jest + jest-expo** (mobile) · **Playwright/Maestro** (E2E) |
| Nomes                    | feature-first; `XUseCase`, `XPort`, `XAdapter`, `XRepository`                                      |

---

## 8. CI/CD

**Plataforma:** **GitHub Actions**. **Cache:** Turborepo remoto (Vercel Remote Cache grátis, ou self-hosted em S3/R2) + `turbo query affected` para buildar só o afetado.

### 8.1 CI — em todo Pull Request

```
PR aberto/atualizado
  └─ mise install (toolchain pinada) + pnpm install + cache turbo
     └─ oxlint (pré-passo rápido)
        └─ turbo run lint typecheck test build  (apenas afetados)
           ├─ api:    lint · typecheck · unit (Vitest) · e2e (Supertest) · spec-drift OpenAPI · build imagem (dry)
           ├─ admin:  lint · typecheck · unit (Vitest) · build Next standalone
           ├─ mobile: lint · typecheck · unit (Jest/jest-expo) · expo-doctor
           └─ infra:  tofu fmt · tofu validate · tofu plan (comenta diff no PR)
```

Merge via **merge queue** (checks no evento **`merge_group`**, não só `pull_request` — senão um PR verde ainda quebra a `main`). **Drift de contrato quebra aqui** (typecheck do cliente gerado + spec-drift).

### 8.2 CD — Backend (`api`) e Admin

Ambos são **containers** → mesmo fluxo:

```
merge na main
  └─ build imagem Docker (multi-stage)
     └─ push p/ registry (Artifact Registry / GHCR)
        └─ deploy STAGING (Cloud Run) automático
           └─ migrações Drizzle (job, antes de rotear tráfego)
              └─ smoke test
                 └─ deploy PROD: aprovação manual (GitHub Environment) → Cloud Run
```

- **Imagem imutável** promovida de staging → prod (mesmo artefato, não rebuild).
- **Migrações** rodam como **step explícito**, nunca em runtime.
- Rollback = re-deploy da revisão anterior do Cloud Run (1 comando).

### 8.3 CD — Mobile

```
merge na main (mudou apps/mobile) — via EAS Workflows
  ├─ mudança só JS/TS  → EAS Update (OTA) p/ canal staging → promove p/ prod
  └─ mudança nativa    → EAS Build (cache) → EAS Submit (TestFlight / Play Internal) → store
```

- **OTA (EAS Update)** para correções de JS sem passar pela store.
- Build nativo só quando muda dependência/config nativa (Fingerprint pula builds redundantes).

### 8.4 CD — Infra

```
PR em infra/  → tofu plan comentado no PR
merge na main → tofu apply em STAGING (auto)
             → tofu apply em PROD (aprovação manual)
```

### 8.5 Ambientes

| Ambiente        | Propósito                 | Deploy                                                                 |
| --------------- | ------------------------- | ---------------------------------------------------------------------- |
| **dev (local)** | desenvolvimento           | Dev Container; docker-compose (Postgres + MinIO + api); Expo; Next dev |
| **staging**     | homologação, igual à prod | automático no merge                                                    |
| **prod**        | produção                  | promoção com aprovação manual                                          |

**Paridade dev↔prod:** como tudo é container + Postgres + API S3, o `docker-compose` local usa **Postgres real** e **MinIO** (S3-compatível) — o mesmo código de storage roda local e em produção sem `if`. **Testcontainers** para testes de integração; **bancos de preview efêmeros** por PR.

---

## 9. Resumo — uma linha por ambiente

| Ambiente          | Stack                                                                                                                                                                                        |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**       | NestJS + Drizzle + Zod 4 + Better Auth + pg-boss + **OpenTelemetry**, modular/ports-adapters, Node 24, container                                                                             |
| **Mobile**        | Expo SDK 56 + expo-router + **vision-camera 5** + TanStack Query + Zustand + NativeWind; feel via **Reanimated 4 (CSS API) + Skia + Rive + Lottie + Haptics + FlashList 2**; testes **Jest** |
| **Admin**         | Next.js 16 + shadcn/Base UI + Tailwind v4 + TanStack Table/Query + **`<video>`/Media Chrome**, container standalone                                                                          |
| **Compartilhado** | Zod 4 schemas + cliente OpenAPI (Hey API) + **t3-env** + presets de config + tokens                                                                                                          |
| **Infra**         | OpenTofu (Cloud Run + Postgres + R2 + Cloudflare), state remoto                                                                                                                              |
| **CI/CD**         | GitHub Actions + Turborepo (remote cache, affected) + **merge queue**; **Lefthook**; container promovido staging→prod; EAS Workflows p/ mobile                                               |

> Tudo amarrado por: **TypeScript único**, **Zod como fonte da verdade**, **OpenAPI como contrato**, **OpenTelemetry para observabilidade**, **container/S3/Postgres como padrões trocáveis**.

---

## 10. Roadmap de modernização (auditoria jun/2026)

Auditoria do stack contra o estado da arte de meados de 2026. As escolhas grandes seguem ótimas; abaixo, o que mudar.

### Trocar agora (algo claramente melhor surgiu)

| Item                 | De → Para                                                                   | Motivo                                                            |
| -------------------- | --------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| Testes mobile        | Vitest → **Jest + jest-expo**                                               | Vitest **não suporta React Native**                               |
| Git hooks            | Husky+lint-staged → **Lefthook**                                            | Husky parado desde nov/2024; Lefthook é paralelo e monorepo-aware |
| Player admin         | Vidstack → **`<video>` / Media Chrome**                                     | Vidstack em manutenção reduzida                                   |
| Animação declarativa | Moti → **Reanimated 4 CSS API**                                             | Moti quebra no Reanimated 4                                       |
| Majors mobile        | → **vision-camera 5, MMKV 4, FlashList 2, gesture-handler 3, Reanimated 4** | Nitro (~15×), auto-sizing, hooks sem re-render                    |
| **Segurança**        | Better Auth → **≥ 1.6.14**                                                  | 15 advisories (SSO/OIDC) de jun/2026                              |

### Adicionar (gaps que um stack top-tier 2026 tem)

- **OpenTelemetry** no backend (auto-instrumentation → OTLP) — **maior gap**; + Pino correlacionado a trace.
- **Check de spec-drift de OpenAPI** no CI; **drizzle-zod** (schema único banco→input).
- **t3-env** (env tipada); **merge queue** (`merge_group`); **remote cache** no CI; **mise** (toolchain).
- Higiene: **knip, syncpack, publint+attw, Renovate**; **Dev Containers** + **Testcontainers**.
- Mobile feel/perf: **Rive**, **120Hz ProMotion** explícito, **expo-image** (ThumbHash), **háptico em worklet**, **react-native-screen-transitions**, **`useReducedMotion`**, profiling (**Flashlight/Radon IDE**).

### Considerar (opcional, sem urgência)

- **oxlint** como pré-passo (já no §7); **TS 7 RC** só para type-check de CI (migração total no 7.1).
- **Unistyles 3** em telas hot; **Base UI** para componentes novos (já no §4).
- **NestJS v12** quando sair de alpha (~Q3 2026); **pnpm catalogs**; **Vitest 4** (`workspace`→`projects`).
- **TanStack Start** como default do próximo app interno (não migrar o atual).
- Piloto de **Bun** num serviço Cloud Run não-crítico se cold-start/CI doerem.

### Validados (seguem ótimos, sem troca)

pnpm · Turborepo · NestJS · Drizzle (pinar) · Zod 4 · Better Auth · pg-boss · Node 24 · Pino · Expo · expo-router · TanStack Query/Table · Zustand · Skia · NativeWind · Next.js (manter) · Changesets · GitHub Actions · OpenTofu.
