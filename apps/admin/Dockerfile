# syntax=docker/dockerfile:1.7
#
# Charya admin — imagem multi-stage.
# Build a partir da RAIZ do monorepo (contexto = L:\Dev\charya), pois o app
# depende de packages workspace:
#   docker build -f apps/admin/Dockerfile -t charya-admin .
#
# Saída: roda o servidor standalone do Next (output: 'standalone'), que carrega
# apenas o subconjunto de node_modules tracado — imagem enxuta para Cloud Run.

ARG NODE_VERSION=24

# ---------- base: toolchain pnpm ----------
FROM node:${NODE_VERSION}-slim AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable || npm i -g pnpm@11.7.0
WORKDIR /app

# ---------- deps: instala dependências do workspace ----------
FROM base AS deps
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc ./
COPY apps/admin/package.json apps/admin/package.json
COPY packages/ packages/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @charya/admin...

# ---------- builder: gera o build standalone ----------
FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED=1
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/packages ./packages
COPY pnpm-workspace.yaml pnpm-lock.yaml package.json .npmrc tsconfig.base.json ./
COPY apps/admin ./apps/admin
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile --filter @charya/admin...
RUN pnpm --filter @charya/admin build

# ---------- runner: imagem final mínima ----------
FROM node:${NODE_VERSION}-slim AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

# Usuário sem privilégios.
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

# `output: 'standalone'` produz apps/admin/.next/standalone com o server.js e o
# subconjunto de node_modules tracado, preservando a estrutura do monorepo.
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/.next/static ./apps/admin/.next/static
COPY --from=builder --chown=nextjs:nodejs /app/apps/admin/public ./apps/admin/public

USER nextjs
EXPOSE 3000

# O server.js do standalone fica sob o caminho do app no monorepo.
CMD ["node", "apps/admin/server.js"]
