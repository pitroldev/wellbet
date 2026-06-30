# Charya Bet — Setup de Desenvolvimento (rodar tudo localmente)

> Como preparar o ambiente e **iniciar cada parte do sistema** na sua máquina:
> backend (api), console (admin), app (mobile) e a infraestrutura local
> (Postgres + MinIO + Jaeger). Tudo roda local, com paridade ao que existe em
> produção (Cloud Run + Cloud SQL + R2). Arquitetura completa em
> [Arquitetura Técnica](./Charya_Arquitetura_Tecnica.md).

---

## 1. Pré-requisitos

| Ferramenta             | Versão               | Como obter                                    | Obrigatório      |
| ---------------------- | -------------------- | --------------------------------------------- | ---------------- |
| **Node.js**            | 22+ (24 recomendado) | nvm / fnm / volta, ou instalador oficial      | ✅               |
| **pnpm**               | 11.7 (pinado)        | **`corepack enable`** (vem com o Node)        | ✅               |
| **Docker**             | 24+ (com Compose v2) | Docker Desktop                                | ✅ (infra local) |
| **Git**                | —                    | —                                             | ✅               |
| Watchman               | —                    | só para o mobile (melhora o Metro)            | opcional         |
| Xcode / Android Studio | —                    | só para rodar o **app em simulador/emulador** | opcional         |
| mise                   | —                    | gerencia Node/pnpm pinados (`mise install`)   | opcional         |

> **pnpm:** não instale manualmente. `corepack enable` faz o repo usar a versão
> pinada em `package.json` (`packageManager: pnpm@11.7.0`) automaticamente.
>
> **Node 24:** é o alvo do projeto (type-stripping nativo etc.), mas tudo **roda
> em Node 22+**. O piso de `engines` é `>=22`.

---

## 2. Setup inicial (uma vez)

```bash
# 1. Habilitar o pnpm via corepack (usa a versão pinada do repo)
corepack enable

# 2. Instalar todo o workspace (api + admin + mobile + packages)
pnpm install

# 3. Criar o .env a partir do exemplo (nomes já batem o schema @charya/env)
cp .env.example .env        # PowerShell: Copy-Item .env.example .env

# 4. Subir a infra local (Postgres + MinIO + Jaeger) em background
pnpm dev:up

# 5. Rodar a primeira migração do banco
pnpm db:migrate
```

Ou, tudo de uma vez (passos 2, 4 e 5):

```bash
corepack enable && cp .env.example .env && pnpm setup
```

> Após instalar, o pnpm pode listar **build scripts ignorados** (esbuild, etc.)
> por segurança. Aprove os necessários uma vez com **`pnpm approve-builds`**
> (selecione esbuild e os pacotes nativos) — necessário para os testes (Vitest).

---

## 3. Infra local (Docker)

Um comando sobe os serviços gerenciados que em prod são Cloud SQL / R2 / coletor OTel:

```bash
pnpm dev:up      # docker compose up -d
pnpm dev:logs    # acompanhar logs
pnpm dev:down    # parar (mantém os dados)
pnpm dev:reset   # parar e APAGAR volumes (banco/bucket zerados)
```

| Serviço      | Porta        | Para que serve                              | Console                                           |
| ------------ | ------------ | ------------------------------------------- | ------------------------------------------------- |
| **postgres** | 5432         | banco (Drizzle)                             | —                                                 |
| **minio**    | 9000 / 9001  | storage S3-compatível (R2 local)            | http://localhost:9001 (`minioadmin`/`minioadmin`) |
| **jaeger**   | 4318 / 16686 | coletor OTLP + UI de traces (OpenTelemetry) | http://localhost:16686                            |

O bucket `charya-evidence` é criado automaticamente no boot do MinIO.

---

## 4. Iniciar cada ambiente

Abra um terminal por ambiente (ou rode `pnpm dev` para api+admin juntos).

### 4.1 Backend — `apps/api` (NestJS)

```bash
pnpm dev:api        # nest start --watch (hot reload)
```

- API: **http://localhost:3000**
- Swagger / OpenAPI: **http://localhost:3000/docs**
- Health: **http://localhost:3000/health**
- Traces aparecem no Jaeger (http://localhost:16686) com `OTEL_ENABLED=true`.

Banco (Drizzle):

```bash
pnpm db:generate    # gera migração a partir do schema
pnpm db:migrate     # aplica migrações
pnpm db:studio      # abre o Drizzle Studio (inspeção visual do banco)
```

### 4.2 Admin — `apps/admin` (Next.js)

```bash
pnpm dev:admin      # next dev
```

- Console: **http://localhost:3001** (a porta 3000 fica para a api)
- Precisa da api rodando (consome `@charya/contracts`).

### 4.3 Mobile — `apps/mobile` (Expo)

```bash
pnpm dev:mobile     # expo start
```

- Abre o Metro bundler; leia o QR code com o **Expo Go** (ou tecle `i`/`a` para
  simulador iOS / emulador Android, se instalados).
- Aponta para a api em `EXPO_PUBLIC_API_URL` (default `http://localhost:3000`).
  Em device físico, troque `localhost` pelo IP da sua máquina na rede.
- Se as versões nativas divergirem do SDK do Expo, alinhe com:
  ```bash
  pnpm --filter @charya/mobile deps:fix   # expo install --fix
  ```

### 4.4 api + admin juntos

```bash
pnpm dev            # turbo run dev (api + admin; mobile fica de fora por ser interativo)
```

---

## 5. Fluxo do contrato (api → apps)

O cliente tipado que mobile/admin usam é **gerado** a partir do OpenAPI da api.
Sempre que mudar endpoints/DTOs:

```bash
pnpm --filter @charya/api build         # emite o openapi.json
pnpm contracts:generate                 # gera o cliente em @charya/contracts
```

Se um app usar a API de forma incompatível com o contrato, **o type-check quebra**
— é essa quebra que evita drift (ver §5 e §8 da Arquitetura).

---

## 6. Comandos úteis (raiz do monorepo)

```bash
pnpm build            # build de tudo (Turborepo, só o afetado)
pnpm typecheck        # tsc em todos os pacotes/apps
pnpm test             # testes (Vitest no back/web, Jest no mobile)
pnpm lint             # ESLint (type-aware)
pnpm lint:fast        # oxlint (pré-passo rápido)
pnpm format           # Prettier
pnpm knip             # acha código/deps morto
pnpm deps:check       # checa versões inconsistentes entre pacotes (syncpack)
pnpm changeset        # registra uma mudança versionável
```

Filtre por projeto com `--filter`:

```bash
pnpm --filter @charya/api test
pnpm --filter @charya/schemas build
```

---

## 7. Mapa de portas

| Porta | Serviço                             |
| ----- | ----------------------------------- |
| 3000  | api (NestJS)                        |
| 3001  | admin (Next.js)                     |
| 5432  | Postgres                            |
| 9000  | MinIO (API S3 / `STORAGE_ENDPOINT`) |
| 9001  | MinIO (console web)                 |
| 4318  | Jaeger (OTLP HTTP)                  |
| 16686 | Jaeger (UI de traces)               |
| 8081  | Metro bundler (Expo)                |

---

## 8. Troubleshooting

| Sintoma                              | Causa provável               | Solução                                                                   |
| ------------------------------------ | ---------------------------- | ------------------------------------------------------------------------- |
| `pnpm` não encontrado                | corepack desabilitado        | `corepack enable`                                                         |
| Aviso de engine (Node)               | máquina em Node < 22         | atualize o Node (nvm/fnm)                                                 |
| Testes falham com erro de esbuild    | build scripts não aprovados  | `pnpm approve-builds` (marque esbuild)                                    |
| api não sobe / erro de env           | `.env` ausente ou incompleto | `cp .env.example .env`; o `@charya/env` valida e diz o que falta          |
| `ECONNREFUSED` no banco              | infra não está de pé         | `pnpm dev:up` e aguarde o healthcheck                                     |
| Upload de evidência falha            | bucket/MinIO fora do ar      | `pnpm dev:up`; confira o console em :9001                                 |
| Sem traces no Jaeger                 | OTel desligado               | `OTEL_ENABLED=true` e `OTEL_EXPORTER_OTLP_ENDPOINT=http://localhost:4318` |
| Mobile não conecta na api            | `localhost` em device físico | use o IP da máquina em `EXPO_PUBLIC_API_URL`                              |
| Versões nativas divergentes (mobile) | drift com o SDK do Expo      | `pnpm --filter @charya/mobile deps:fix`                                   |
| Porta 3000/5432 ocupada              | outro processo               | finalize o processo ou ajuste a porta                                     |

---

## 9. Resumo de um dia normal de trabalho

```bash
pnpm dev:up         # infra local (uma vez por sessão)
pnpm dev            # api + admin com hot reload
# (outra aba) pnpm dev:mobile   — se for mexer no app
# ... codar ...
pnpm typecheck && pnpm test     # antes de abrir PR
```
