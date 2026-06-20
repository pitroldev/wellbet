# remote-state.tf — documentação do BACKEND de state remoto (com lock).
#
# IMPORTANTE: este arquivo é DOCUMENTAÇÃO/REFERÊNCIA, não um backend ativo.
# O bloco `backend {}` precisa viver DENTRO do bloco `terraform {}` e NÃO aceita
# variáveis nem interpolação — por isso cada ambiente define o SEU backend em
# `envs/<env>/backend.tf`, apontando para um prefixo de state diferente no mesmo
# bucket. Aqui só explicamos o padrão e centralizamos a decisão.
#
# ──────────────────────────────────────────────────────────────────────────
# Padrão escolhido: backend GCS (Google Cloud Storage)
# ──────────────────────────────────────────────────────────────────────────
# Por que GCS:
#   - State versionado: habilitar Object Versioning no bucket garante histórico
#     e rollback do state.
#   - LOCK NATIVO: o backend `gcs` faz lock automático via a própria API do GCS
#     (não precisa de tabela DynamoDB como no S3). Dois `apply` concorrentes não
#     corrompem o state.
#   - Criptografia em repouso por padrão; IAM granular por ambiente.
#
# Provisionamento do bucket de state (BOOTSTRAP — feito UMA vez, fora do ciclo
# normal, pois é o ovo antes da galinha). NÃO criar pela console; usar gcloud:
#
#   gcloud storage buckets create gs://charya-tfstate \
#     --project=<PROJECT_ID> \
#     --location=southamerica-east1 \
#     --uniform-bucket-level-access \
#     --public-access-prevention=enforced
#   gcloud storage buckets update gs://charya-tfstate --versioning
#
# Cada ambiente usa o MESMO bucket com `prefix` distinto (isolamento de state):
#   staging → prefix = "staging"
#   prod    → prefix = "prod"
#
# Exemplo do bloco que vive em envs/<env>/backend.tf:
#
#   terraform {
#     backend "gcs" {
#       bucket = "charya-tfstate"
#       prefix = "staging"   # ou "prod"
#     }
#   }
#
# ──────────────────────────────────────────────────────────────────────────
# Alternativa S3-compatível (Cloudflare R2) — para zerar dependência de GCP
# ──────────────────────────────────────────────────────────────────────────
# Coerente com anti-lock-in: o state também pode morar num bucket R2 via backend
# `s3` apontado ao endpoint do R2. ATENÇÃO: o R2 não oferece lock via DynamoDB;
# use `use_lockfile = true` (lock por arquivo no próprio bucket, suportado nas
# versões recentes de OpenTofu/Terraform) e desabilite as validações de AWS:
#
#   terraform {
#     backend "s3" {
#       bucket                      = "charya-tfstate"
#       key                         = "staging/terraform.tfstate"
#       region                      = "auto"
#       endpoints                   = { s3 = "https://<ACCOUNT_ID>.r2.cloudflarestorage.com" }
#       skip_credentials_validation = true
#       skip_region_validation      = true
#       skip_requesting_account_id  = true
#       use_lockfile                = true   # lock por arquivo (R2 não tem DynamoDB)
#       # AWS_ACCESS_KEY_ID / AWS_SECRET_ACCESS_KEY = token R2 S3 (via env, nunca no código)
#     }
#   }
#
# TODO(infra): decidir GCS vs R2 para o state. Default do MVP = GCS (lock nativo).
# Os arquivos envs/*/backend.tf abaixo usam o backend GCS por padrão.
