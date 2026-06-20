# infra/terraform — IaC (OpenTofu)

Infraestrutura da Charya como código, com **OpenTofu** (fork aberto do
Terraform — coerente com o princípio anti-lock-in da §6 da Arquitetura Técnica).
Todos os comandos usam o binário **`tofu`** (não `terraform`).

> **Regra de ouro:** **nada é criado pela console.** Se não está aqui, não
> existe. É isso que torna a migração de nuvem real e o ambiente reprodutível.

## Estrutura

```
infra/terraform/
├── versions.tf          # required_version + providers (google, cloudflare, neon, aws→R2, random)
├── remote-state.tf      # DOC do backend de state remoto (GCS com lock nativo) + alternativa R2
├── modules/             # módulos REUTILIZÁVEIS (sem valores de ambiente)
│   ├── cloud-run/       # serviço de container, escala-a-zero→pico, secrets via Secret Manager
│   ├── postgres/        # Neon (default) ou Cloud SQL — provider TROCÁVEL; output DATABASE_URL
│   ├── r2-bucket/       # bucket S3-compatível (R2) + CORS p/ upload direto via URL pré-assinada
│   └── cloudflare/      # DNS + CDN + WAF
└── envs/                # ambientes só COMPÕEM módulos com variáveis diferentes
    ├── staging/         # escala-a-zero agressiva; igual à prod em forma
    └── prod/            # min 1 instância (sem cold start); tetos de pico maiores
```

**Princípios** (§6):

- **Módulos reutilizáveis**; `envs/*` só compõem com variáveis diferentes.
- **State remoto versionado, com lock** (backend GCS — lock nativo, sem DynamoDB).
- **Secrets fora do código** — Secret Manager, injetados em runtime no Cloud Run.
  No Terraform passamos apenas os **IDs** dos secrets, nunca os valores.
- **Padrões abertos e trocáveis**: Postgres (Neon↔Cloud SQL), S3 (R2↔B2↔S3),
  container (Cloud Run). Fornecedor é detalhe atrás de variável.
- **Região São Paulo** por padrão (`southamerica-east1` no GCP / `aws-sa-east-1`
  no Neon / `sam` no R2).

## Pré-requisitos

- [OpenTofu](https://opentofu.org) (`tofu`) >= 1.6.
- Bucket de state criado UMA vez no bootstrap (ver `remote-state.tf`):
  ```sh
  gcloud storage buckets create gs://charya-tfstate \
    --location=southamerica-east1 --uniform-bucket-level-access \
    --public-access-prevention=enforced
  gcloud storage buckets update gs://charya-tfstate --versioning
  ```
- Secrets já criados no Secret Manager (DATABASE_URL, BETTER_AUTH_SECRET,
  R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY). O Terraform referencia por **ID**.
- Credenciais via variáveis de ambiente `TF_VAR_*` (nunca em arquivo commitado):
  `TF_VAR_cloudflare_api_token`, `TF_VAR_neon_api_key`,
  `TF_VAR_r2_access_key_id`, `TF_VAR_r2_secret_access_key`.

## Uso local (por ambiente)

```sh
cd infra/terraform/envs/staging      # ou envs/prod
cp terraform.tfvars.example terraform.tfvars   # preencher (NÃO commitar)

tofu init        # inicializa o backend GCS (state + lock)
tofu fmt -check  # formatação
tofu validate    # validação estática
tofu plan        # diff (não aplica nada)
tofu apply       # aplica (em prod: só após aprovação — ver abaixo)
```

## Fluxo de CI/CD (§8.4)

```
PR que toca infra/   →  tofu fmt + tofu validate + tofu plan  (diff comentado no PR)
merge na main        →  tofu apply em STAGING  (AUTOMÁTICO)
                     →  tofu apply em PROD     (APROVAÇÃO MANUAL — GitHub Environment)
```

- **Plan no PR:** todo PR que altera `infra/` roda `tofu plan` e comenta o diff.
  Nada é aplicado a partir do PR.
- **Staging automático:** no merge para `main`, o `apply` de staging roda sozinho.
- **Prod manual:** o `apply` de prod fica atrás de **aprovação manual** num
  GitHub Environment protegido. A imagem é a **mesma** promovida de staging
  (digest imutável, sem rebuild).
- **Rollback:** re-deploy da revisão anterior do Cloud Run (1 comando) ou
  `tofu apply` com a imagem anterior.

## Notas de design

- **R2 via provider AWS:** o Cloudflare R2 é object storage **S3-compatível**.
  Não há provider nativo "r2" para CORS/lifecycle; usamos o provider `aws`
  (alias `r2`) apontado ao endpoint `https://<account>.r2.cloudflarestorage.com`,
  com `region = "auto"` e as validações de AWS desligadas. Nenhuma chamada à AWS
  real acontece — é só o protocolo S3. Trocar R2 por B2/S3 = trocar o endpoint.
- **Upload direto do app:** o bucket tem CORS liberado para o(s) origin(s) do
  app, permitindo `PUT` via **URL pré-assinada** — o pico de upload de vídeo
  **não toca o backend** (§3).
- **Postgres trocável:** o módulo `postgres` escolhe Neon (default MVP) ou Cloud
  SQL via `provider_kind`, e expõe um **`DATABASE_URL` uniforme** — quem consome
  (a API, via `packages/env`) não sabe qual provider está por trás.
- **Escala-a-zero:** no MVP de baixo volume, `min_instances = 0` no staging. Em
  prod, `min_instances = 1` para eliminar cold start na primeira requisição;
  `max_instances` é o teto do pico (ex.: janela de pesagem sorteada pelo app).

```

```
