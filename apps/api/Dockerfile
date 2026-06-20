# syntax=docker/dockerfile:1
# Charya API — build multi-stage, Node 24 alpine, imagem standalone/imutável.
# A imagem é promovida staging→prod sem rebuild (ver §8.2 do doc).

# ---------- base ----------
FROM node:24-alpine AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable || npm i -g pnpm@11.7.0
WORKDIR /repo

# ---------- deps: instala dependências do workspace ----------
FROM base AS deps
# Manifests da raiz + dos pacotes que a api consome (cache de instalação).
COPY pnpm-workspace.yaml package.json pnpm-lock.yaml .npmrc ./
COPY apps/api/package.json apps/api/
COPY packages/schemas/package.json packages/schemas/
COPY packages/env/package.json packages/env/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile

# ---------- build: compila a api (tsc via nest build) ----------
FROM deps AS build
COPY . .
RUN pnpm --filter @charya/api... build

# ---------- runtime: imagem final enxuta ----------
FROM node:24-alpine AS runtime
ENV NODE_ENV=production
WORKDIR /app
# Apenas artefatos necessários para rodar.
RUN corepack enable || npm i -g pnpm@11.7.0
COPY --from=build /repo/pnpm-workspace.yaml /repo/package.json /repo/pnpm-lock.yaml /repo/.npmrc ./
COPY --from=build /repo/apps/api/package.json ./apps/api/
COPY --from=build /repo/packages/schemas ./packages/schemas
COPY --from=build /repo/packages/env ./packages/env
COPY --from=build /repo/apps/api/dist ./apps/api/dist
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --prod

# Usuário não-root.
USER node
EXPOSE 3000
# Observabilidade: OTel é inicializado no topo de main.ts (import side-effect).
CMD ["node", "apps/api/dist/main.js"]
