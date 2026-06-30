# Charya Bet — Stack Adotada (as-built)

> **O que é este doc:** o retrato **do que foi efetivamente adotado e fixado** no
> repositório, com as versões reais que estão hoje nos manifests. É o complemento
> _as-built_ do [`Charya_Stack_Tecnologica.md`](./Charya_Stack_Tecnologica.md) —
> aquele explica **por que** (alternativas + recomendação); este registra **o que**.
> Resumo de uma linha por ambiente está no [`README`](../README.md).
>
> **Fonte da verdade das versões:** `pnpm-workspace.yaml` (catálogo) + os
> `package.json` de cada app/pacote. Em caso de divergência, **o manifest vence
> este doc** — mantenha esta página alinhada quando subir versão.
>
> _Atualizado em: 2026-06-23._

---

## 1. Princípios que a stack materializa

- **TypeScript em todas as camadas** (mobile, admin, backend, infra-as-code-glue) — uma linguagem só, tipos e validações compartilhados.
- **Anti-lock-in por padrões abertos** — Postgres (banco), API S3 (storage), OCI/Docker (compute), OpenAPI (contrato). Cada fornecedor é detalhe trocável.
- **Contrato como SSoT única** — a `api` emite OpenAPI; o cliente TS é **gerado**, nunca escrito à mão; _drift_ quebra o CI.
- **Ports & adapters no backend** — regra de negócio isolada de infra (Postgres, R2, Stark Bank, fila) atrás de interfaces.
- **ESM em todo o monorepo** (`"type": "module"`) + path aliases (`@/`, `@charya/*`).
- **Manual-first** — revisão humana de vídeo no MVP; engine de plausibilidade (Fase 2) entra como peça isolada.

---

## 2. Toolchain & monorepo

| Peça                | Versão / escolha             | Papel                                                                  |
| ------------------- | ---------------------------- | ---------------------------------------------------------------------- |
| **Node**            | 24 (`engines: ^22 \|\| ^24`) | runtime, pinado por **mise** (`exact_match`)                           |
| **pnpm**            | 11.7.0                       | gerenciador (campo `packageManager` + mise; Corepack saiu do Node 25+) |
| **TypeScript**      | ^5.9.3 (catalog)             | linguagem única; `strict`, ESM                                         |
| **Turborepo**       | ^2.9.0                       | orquestra `lint/typecheck/test/build`, cache remoto, `--affected`      |
| **pnpm workspaces** | `apps/*`, `packages/*`       | monorepo; deps fluem só para dentro                                    |
| **pnpm catalogs**   | —                            | versão única central das deps compartilhadas                           |
| **mise**            | `node=24`, `pnpm=11.7.0`     | toolchain reprodutível (substitui nvm/asdf)                            |

**Regra do monorepo:** `apps/*` dependem de `packages/*`; `packages/*` **não** dependem de `apps/*`. Imports cross-package via `@charya/<nome>`.

---

## 3. Backend — `apps/api`

**NestJS 11, modular por feature + ports & adapters.** Container Docker multi-stage.

| Domínio          | Pacote                                                                               | Versão        | Papel                                                                |
| ---------------- | ------------------------------------------------------------------------------------ | ------------- | -------------------------------------------------------------------- |
| **Framework**    | `@nestjs/{common,core,platform-express}`                                             | ^11.1.0       | HTTP modular, DI                                                     |
| **Contrato**     | `@nestjs/swagger`                                                                    | ^11.0.0       | emite o OpenAPI (DB-free) que vira `@charya/contracts`               |
| **Validação**    | `nestjs-zod` + `zod`                                                                 | ^5 / ^4.4.3   | DTOs e validação a partir de Zod 4                                   |
| **ORM**          | `drizzle-orm` / `drizzle-kit`                                                        | 1.0.0-rc.3    | SQL tipado + migrações; `drizzle-zod` ^0.8                           |
| **Driver**       | `pg`                                                                                 | ^8.13         | Postgres                                                             |
| **Auth**         | `better-auth`                                                                        | ^1.6.14       | auth open-source no próprio backend (sem BaaS)                       |
| **Fila**         | `pg-boss`                                                                            | ^12.19        | jobs sobre o próprio Postgres (sem broker extra)                     |
| **Pagamentos**   | `starkbank`                                                                          | ^2.40         | Pix (cobrança do _stake_ + payout)                                   |
| **Storage**      | `@aws-sdk/client-s3` + `s3-request-presigner`                                        | ^3.7          | R2 via API S3; URLs pré-assinadas p/ vídeo                           |
| **Rate limit**   | `@nestjs/throttler`                                                                  | ^6.4          | proteção de borda                                                    |
| **Headers seg.** | `helmet`                                                                             | ^8            | hardening HTTP                                                       |
| **Logs**         | `nestjs-pino` / `pino` / `pino-http`                                                 | ^4 / ^9 / ^10 | log estruturado                                                      |
| **Tracing**      | `@opentelemetry/{api,sdk-node,auto-instrumentations-node,exporter-trace-otlp-proto}` | ^1.9 / ^0.219 | OTLP → Jaeger (dev) / coletor (prod); `pino-opentelemetry-transport` |
| **Base**         | `reflect-metadata`, `rxjs`                                                           | —             | metadados de DI / streams do Nest                                    |

**Build:** `nest build` + `tsc-alias` (resolve os `@/` em runtime no `dist`).
**Geração do contrato:** `@hey-api/openapi-ts` consome o `openapi.json` emitido.

> ⚠️ `openapi:emit` roda o `dist/openapi-emit.js` **buildado** — sempre `nest build` **antes** de emitir, senão usa dist velho.

---

## 4. Admin — `apps/admin`

**Next.js 16 (App Router, output standalone).** Console de revisão humana.

| Domínio          | Pacote                                               | Versão     | Papel                            |
| ---------------- | ---------------------------------------------------- | ---------- | -------------------------------- |
| **Framework**    | `next`                                               | ^16.2.9    | App Router, container standalone |
| **UI lib**       | `react` / `react-dom`                                | 19.2.0     | —                                |
| **Componentes**  | `@base-ui-components/react`                          | 1.0.0-rc.0 | base headless (estilo shadcn)    |
| **Estilo**       | `tailwindcss` + `@tailwindcss/postcss`               | ^4.3       | Tailwind v4                      |
| **Utils estilo** | `class-variance-authority`, `clsx`, `tailwind-merge` | —          | variantes/merge de classes       |
| **Ícones**       | `lucide-react`                                       | ^1.0       | —                                |
| **Vídeo**        | `media-chrome`                                       | ^4         | player p/ revisar as pesagens    |
| **Dados**        | `@tanstack/react-query`                              | ^5.101     | estado de servidor               |
| **Tabelas**      | `@tanstack/react-table`                              | ^8.21      | fila de revisão / apostas        |
| **Forms**        | `react-hook-form` + `@hookform/resolvers`            | ^7.80 / ^5 | forms validados por Zod          |
| **Auth**         | `better-auth`                                        | ^1.6.14    | mesma lib do backend             |

Consome `@charya/{contracts,env,schemas,ui-tokens}`.
**Testes:** Vitest + `@testing-library/react` + jsdom; **Playwright** para e2e.

---

## 5. Mobile — `apps/mobile`

**Expo SDK 56 / React Native 0.86 / React 19.2.** `expo-router` (file-based).

| Domínio        | Pacote                                                                  | Versão          | Papel                            |
| -------------- | ----------------------------------------------------------------------- | --------------- | -------------------------------- |
| **Plataforma** | `expo` + `expo-router`                                                  | ^56             | runtime + navegação por arquivos |
| **Core**       | `react-native` / `react`                                                | 0.86.0 / 19.2.0 | —                                |
| **Câmera**     | `react-native-vision-camera`                                            | ^5              | captura do vídeo de pesagem      |
| **Animação**   | `react-native-reanimated` + `react-native-worklets`                     | ^4.4 / ^0.9     | motion                           |
| **Gestos/Nav** | `gesture-handler`, `screens`, `safe-area-context`, `screen-transitions` | —               | UX nativa                        |
| **Estilo**     | `nativewind` + `tailwindcss`                                            | ^4.2 / ^3.4     | Tailwind no RN                   |
| **Listas**     | `@shopify/flash-list`                                                   | ^2.3            | listas performáticas             |
| **Gráficos**   | `@shopify/react-native-skia`                                            | ^2.6            | canvas/gráfico                   |
| **Recompensa** | `lottie-react-native` / `rive-react-native`                             | ^7 / ^9         | animações de reward              |
| **Dados**      | `@tanstack/react-query`                                                 | ^5              | estado de servidor               |
| **Estado**     | `zustand`                                                               | ^5              | estado de cliente                |
| **Storage**    | `react-native-mmkv` + `expo-secure-store`                               | ^4              | KV rápido + segredos (token)     |
| **Forms**      | `react-hook-form` + `@hookform/resolvers`                               | ^7.80 / ^5      | —                                |
| **Mídia/UX**   | `expo-{image,audio,haptics,constants,status-bar}`                       | ^56             | —                                |

Consome `@charya/{contracts,schemas,ui-tokens}`.
**Testes:** Jest + `jest-expo` + `@testing-library/react-native`. **CI:** `expo-doctor`.

---

## 6. Pacotes compartilhados — `packages/*`

| Pacote                  | Stack                                                 | Papel                                                                                                               |
| ----------------------- | ----------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **`@charya/contracts`** | `@hey-api/openapi-ts` + `@hey-api/client-fetch` ^0.13 | **SSoT do fio.** OpenAPI da `api` → cliente TS tipado **gerado**. Drift quebra o CI.                                |
| **`@charya/schemas`**   | `zod` ^4.4.3                                          | primitivos de validação + plausibilidade compartilhados (podados ao essencial; o contrato é dono dos tipos do fio). |
| **`@charya/env`**       | `@t3-oss/env-core` + `zod` 4                          | env **tipada e validada no boot**; fronteira explícita server vs client.                                            |
| **`@charya/ui-tokens`** | TS puro                                               | design tokens (cores/espaço/tipografia/motion) p/ Tailwind v4 (admin) + NativeWind (mobile).                        |
| **`@charya/config`**    | ESLint flat / Prettier / oxlint + tsconfig base       | presets de toolchain do monorepo.                                                                                   |

---

## 7. Infra & ambientes

| Camada      | Tecnologia                                 | Observação                                                                   |
| ----------- | ------------------------------------------ | ---------------------------------------------------------------------------- |
| **IaC**     | **OpenTofu** 1.10.0                        | módulos + ambientes (`staging`/`prod`); `fmt`+`validate` no CI               |
| **Compute** | **Cloud Run**                              | container OCI; escala a zero                                                 |
| **Banco**   | **Cloud SQL — Postgres 16**                | tratado só como Postgres (anti-lock-in)                                      |
| **Storage** | **Cloudflare R2** (API S3)                 | vídeos de pesagem; bucket **privado**, acesso só por URL pré-assinada (LGPD) |
| **Borda**   | **Cloudflare**                             | CDN/proxy                                                                    |
| **Imagem**  | Docker multi-stage (`apps/api/Dockerfile`) | validada em _dry build_ no CI                                                |

**Dev local (paridade dev↔prod, `docker-compose.yml`):**
`postgres:16-alpine` (= Cloud SQL) · `minio` (= R2, API S3) · `jaeger` (coletor OTLP + UI de traces).

---

## 8. Qualidade, testes & CI

**Lint/format/higiene:** ESLint flat + `typescript-eslint` (type-aware, fonte da verdade) · **oxlint** como pré-passo rápido · **Prettier** (formato) · **knip** (código/dep morto) · **syncpack** + **manypkg** (consistência de versão) · **Changesets** · **publint** + **attw** (saúde de publish dos pacotes).

**Camadas de teste:**

| Camada          | Ferramenta                            | Cobre                                                                                      |
| --------------- | ------------------------------------- | ------------------------------------------------------------------------------------------ |
| **Unit**        | Vitest ^4.1                           | regra de negócio com ports mockados                                                        |
| **e2e (api)**   | Vitest + Supertest                    | sobe o `AppModule` real com adapters de infra fakeados (auth/fila/repos/pagamento)         |
| **Integração**  | **Testcontainers** + Postgres 16 real | os 6 repositórios Drizzle contra SQL real (anti-cobrança-dupla, anti-replay, joins, JSONB) |
| **e2e (admin)** | Playwright                            | fluxos do console                                                                          |
| **Mobile**      | Jest + jest-expo                      | componentes/hooks                                                                          |

**Gates do CI (`.github/workflows/ci.yml`, em `pull_request` + `merge_group`):**
`oxlint` (pré-passo) → `affected` (turbo lint/typecheck/test/build só afetados) · `integration` (Testcontainers) · `spec-drift` (OpenAPI ↔ `@charya/contracts`) · `expo-doctor` · `docker-build` (dry) · `tofu fmt+validate` → **`ci-ok`** (gate único da branch protection / merge queue).

---

## 9. Mudou alguma versão?

1. Atualize a versão no `package.json` do pacote (ou no **catálogo** `pnpm-workspace.yaml` se for compartilhada).
2. `pnpm install` (atualiza o lockfile).
3. Atualize a linha correspondente **aqui** e no [`README`](../README.md) se mudar o resumo.
4. CI verde = stack coerente.
