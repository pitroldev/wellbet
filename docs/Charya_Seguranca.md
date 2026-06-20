# Charya — Postura de Segurança e TODO tracker

> Estado da segurança do ecossistema Charya e a lista viva de itens (um TODO por
> item). Princípio: **seguro por design desde o dia 0** — as fundações certas já
> estão postas; este documento rastreia o que falta para "seguro e pronto pra
> produção". Marque `[x]` ao concluir.
>
> Legenda: ✅ implementado · 🔄 parcial · ⬜ a fazer · 🔒 depende de processo/jurídico.
> Última atualização: 2026-06-20.

---

## 1. Fundações já em pé (decisões de dia 0)

- [x] **Segredos fora do git** — `.gitignore` cobre `.env*` (só `.env.example` versionado).
- [x] **Env validada no boot** — `@charya/env` (t3-env); `BETTER_AUTH_SECRET` exige ≥32 chars; fronteira server/client (segredo não vai pro bundle).
- [x] **Auth library segura** — Better Auth pinado **≥1.6.14** (fix dos advisories de jun/2026); self-hosted.
- [x] **Supply-chain** — lockfile commitado; build scripts bloqueados por padrão (allowlist explícita; `@scarf` negado); **Renovate**; `minimumReleaseAge` documentado.
- [x] **Storage por URL pré-assinada** — sem credencial no app; TTL curto (`STORAGE_PRESIGN_TTL_SECONDS`).
- [x] **Validação de borda** — Zod em todo DTO; fonte única `@charya/schemas`.
- [x] **Idempotência** em escrita financeira.
- [x] **Error taxonomy** — filtro global; não vaza stack trace.
- [x] **Deploy sem chave longa** — OIDC/Workload Identity; segredos via Secret Manager; imagem imutável; merge queue.
- [x] **Container non-root** (Dockerfile).
- [x] **Observabilidade** — OpenTelemetry (detecção de anomalia/incidente).
- [x] **Runtime LTS** — Node travado em `^22 || ^24` (`.nvmrc`=24, mise=24); só linhas LTS.
- [x] **Gates de qualidade** — typecheck, ESLint type-aware, oxlint, `no-explicit-any`, hooks de commit.

---

## 2. Bloco 🔴 — Agora ✅ (entregue em 2026-06-20)

### Backend (apps/api)

- [x] ✅ **Auth aplicada ponta a ponta** — middleware de sessão (Better Auth `getSession`) → `req.user`; **`AuthGuard` global** (`APP_GUARD`, 401), opt-out por `@Public()`; `RolesGuard` (403) + `@Roles()` alinhado a `@charya/schemas` (`user|reviewer|admin`; `input:false` impede auto-promoção). `ReviewController` já protegido por `@Roles("reviewer","admin")`.
- [x] ✅ **Helmet** — `app.use(helmet(...))` (HSTS/noSniff/frameguard/hidePoweredBy; CSP off por ser API JSON).
- [x] ✅ **Rate limiting** — `@nestjs/throttler` global (100/min) + `ThrottlerGuard`; limite estrito (10/min) nas rotas de auth via o rate-limiter do próprio Better Auth.
- [x] ✅ **Cookies de sessão seguros + CSRF** — `httpOnly`, `secure` (prod), `sameSite:'lax'`; CSRF do Better Auth ativo (Origin + Fetch-Metadata); `trustedOrigins`.
- [x] ✅ **Redação de PII/segredos nos logs** — Pino `redact` (authorization, cookie, set-cookie, password, token, secret, accessToken/refreshToken, apiKey); `/api/auth/*` fora do auto-log.

### CI/CD

- [x] ✅ **Secret scanning** — `security.yml` job gitleaks (PR + push, fetch-depth 0).
- [x] ✅ **Vuln scan de deps** — `pnpm audit --audit-level=high --prod` (falha em high/critical).
- [x] ✅ **SAST** — `codeql.yml` (javascript-typescript; PR + push main + schedule semanal).
- [x] ✅ **Node 24 em todo o CI/CD** — via `mise-action` (lê `mise.toml`); novos workflows idem.

> Gate único `security-ok` em `security.yml` para exigir um só check na branch protection.

---

## 3. Bloco 🟠 — Antes de produção

- [x] ✅ **Bucket R2 privado** — sem ACL/domínio público (R2 privado por padrão; API S3 não expõe `PutPublicAccessBlock`/ACL); `precondition` **falha o apply se CORS for `*` ou vazio**; cripto AES-256 em repouso (R2 default).
- [x] ✅ **Aviso dev-only** no `mc anonymous set download` (compose) — comentário forte: nunca replicar em prod.
- [ ] 🔒 **LGPD — dado biométrico (vídeo/rosto):** consentimento explícito; **política de retenção/expurgo** (variável `evidence_retention_days` pronta no TF, default 0 → **definir prazo legal antes do go-live**); minimização; base legal. _(processo + jurídico/DPO)_
- [x] 🔄 **Cookies/CSRF** — implementado (acima); **falta conferir no fluxo real** de login do admin/app end-to-end.
- [x] 🔄 **Redação de PII** — feita na **api**; **conferir o log server-side do admin** (Next) também.
- [x] 🔄 **Scan de imagem (Trivy)** — `trivy fs` no CI ✅; **`trivy image` pendente** (atrelado ao Dockerfile do CD, hoje TODO).
- [ ] ⬜ **Headers de segurança no admin/landing** (CSP do Next, etc.).
- [ ] ⬜ **Política de senha/sessão** — expiração/rotação de sessão (throttler já cobre tentativas).
- [ ] ⬜ **Throttler multi-instância** — `TODO(security)` no código: trocar store em memória por Redis/`secondary-storage` (api + Better Auth) quando houver >1 réplica, senão o limite é por processo.

---

## 4. Bloco 🟡 — Contínuo

- [x] ✅ **CodeQL agendado** (schedule semanal) + alertas no Security tab.
- [x] 🔄 **Trivy/Grype recorrente** — `trivy fs` no CI ✅; imagem pendente (ver §3).
- [ ] ⬜ **SBOM** por release.
- [x] ✅ **`SECURITY.md` + canal de disclosure** — criado (raiz); `TODO(security)` para provisionar o e-mail e o `security.txt`.
- [ ] ⬜ **Pen-test** antes do lançamento público.
- [ ] ⬜ **Sair do `drizzle-orm` 1.0-rc** quando estabilizar (software pré-estável no caminho de dados).
- [ ] ⬜ **Reativar `minimumReleaseAge`** (pnpm) quando as deps estabilizarem; Renovate ativo.
- [ ] ⬜ **Backup/retenção do Postgres** + plano de recuperação.
- [ ] ⬜ **Auditoria de acessos** (quem viu qual vídeo de pesagem) — trilha para LGPD.

---

## 5. Notas

- **Testes de domínio:** `apps/api/src/modules/weighin/domain/sanity.spec.ts` tem 5 testes falhando (pré-existentes, não relacionados ao hardening) — corrigir a lógica/expectativa da regra de sanidade. _(qualidade, não segurança)_
- O **threat model de comprovação de peso** ([doc](./Charya_Threat_Model_Comprovacao_de_Peso.md)) é parte central da segurança do produto (antifraude).
- A questão **regulatória** (aposta/"jogo de azar" vs. habilidade, Lei das bets) é trilha jurídica separada, não coberta aqui.
