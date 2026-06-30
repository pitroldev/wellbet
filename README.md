# Charya Bet — monorepo

Monorepo do **Charya Bet**: apostas sobre metas reais de emagrecimento, com **comprovação de peso por vídeo** e **revisão humana** (abordagem manual-first do MVP).

> Visão técnica completa: [`docs/Charya_Arquitetura_Tecnica.md`](./docs/Charya_Arquitetura_Tecnica.md).
> Stack adotada (as-built, versões reais): [`docs/Charya_Stack_Adotada.md`](./docs/Charya_Stack_Adotada.md).
> Mecanismo de validação do MVP: [`docs/Charya_Validacao_Peso_MVP.md`](./docs/Charya_Validacao_Peso_MVP.md).

## Stack (uma linha por ambiente)

| Ambiente                         | Stack                                                                                     |
| -------------------------------- | ----------------------------------------------------------------------------------------- |
| **Backend** (`apps/api`)         | NestJS 11 + Drizzle + Zod 4 + Better Auth + pg-boss + OpenTelemetry · Node 24 · container |
| **Admin** (`apps/admin`)         | Next.js 16 (standalone) + shadcn/Base UI + Tailwind v4 + TanStack Table/Query             |
| **Mobile** (`apps/mobile`)       | Expo SDK 56 (RN 0.85 / React 19.2) + expo-router + vision-camera 5 + TanStack Query       |
| **Compartilhado** (`packages/*`) | Zod schemas · cliente OpenAPI (Hey API) · t3-env · presets de config · design tokens      |
| **Infra** (`infra/terraform`)    | OpenTofu → Cloud Run + Postgres + R2 + Cloudflare                                         |

## Estrutura de pastas

```
charya/
├── apps/
│   ├── api/            # Backend NestJS (container)
│   ├── admin/          # Console de revisão (Next.js)
│   └── mobile/         # App (Expo / React Native)
├── packages/
│   ├── contracts/      # OpenAPI + cliente tipado gerado (fonte: api)
│   ├── schemas/        # Zod schemas + tipos de domínio compartilhados
│   ├── env/            # t3-env: variáveis tipadas e validadas
│   ├── config/         # presets ESLint/Prettier/oxlint (este time)
│   └── ui-tokens/      # design tokens (web + mobile)
├── infra/terraform/    # OpenTofu (módulos + ambientes)
├── .github/workflows/  # CI/CD
├── .devcontainer/      # onboarding reprodutível
├── mise.toml · turbo.json · pnpm-workspace.yaml · tsconfig.base.json
```

**Regra do monorepo:** dependências fluem só para dentro — `apps/*` dependem de `packages/*`; `packages/*` **não** dependem de `apps/*`. Imports cross-package por `@charya/<nome>`.

## Setup

Toolchain pinada por **mise** (Node 24 + pnpm 11). Corepack saiu do Node 25+.

```bash
mise install            # instala Node/pnpm exatos do mise.toml
pnpm install            # instala deps do workspace
cp .env.example .env    # preencha as variáveis
```

> Alternativa zero-config: abra no **Dev Container** (`.devcontainer/`) — Codespaces ou VS Code "Reopen in Container".

## Comandos (raiz)

| Comando                        | O que faz                                   |
| ------------------------------ | ------------------------------------------- |
| `pnpm dev`                     | `turbo run dev` (todos os apps em paralelo) |
| `pnpm build`                   | `turbo run build` (só o afetado, com cache) |
| `pnpm lint`                    | `turbo run lint` (ESLint flat type-aware)   |
| `pnpm lint:fast`               | `oxlint` (pré-passo rápido, 50–100×)        |
| `pnpm typecheck`               | `turbo run typecheck`                       |
| `pnpm test`                    | `turbo run test` (Vitest nos pacotes TS)    |
| `pnpm format` / `format:check` | Prettier write / check                      |
| `pnpm knip`                    | código/deps morto                           |
| `pnpm deps:check` / `deps:fix` | syncpack (consistência de versões)          |
| `pnpm changeset`               | registra mudança de versão de pacote        |

## Qualidade & CI/CD

- **Lint:** ESLint flat + typescript-eslint (fonte da verdade) · **oxlint** como pré-passo · **Prettier** para formato. Presets em [`packages/config`](./packages/config).
- **CI** ([`.github/workflows/ci.yml`](./.github/workflows/ci.yml)): mise + pnpm + oxlint + `turbo run lint typecheck test build` **só afetados**; roda em `pull_request` **e** `merge_group` (merge queue); cache Turborepo remoto.
- **CD:** backend/admin = imagem imutável promovida staging→prod (Cloud Run) · mobile = EAS (OTA p/ JS, Build+Submit p/ nativo) · infra = tofu plan no PR, apply staging auto + prod manual.
- **Higiene:** knip · syncpack · Changesets.

## Branching

Trunk-based: `main` sempre deployável, branches curtas, PR + **merge queue**.
