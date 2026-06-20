# envs/prod/main.tf
# Ambiente PROD — só COMPÕE os mesmos módulos do staging, com variáveis de
# produção: sem escala-a-zero na API (min_instances=1 mata cold start), tetos de
# pico maiores, Neon em CU maior. Apply em prod é MANUAL (aprovação no GitHub
# Environment) e a imagem é a MESMA promovida de staging (não rebuild).

# ── Providers ──────────────────────────────────────────────────────────────
provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "google-beta" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

provider "cloudflare" {
  api_token = var.cloudflare_api_token
}

provider "neon" {
  api_key = var.neon_api_key
}

# Provider AWS apontado ao endpoint S3 do Cloudflare R2 (alias "r2"). Protocolo
# S3 contra o R2 — sem chamadas à AWS real.
provider "aws" {
  alias      = "r2"
  region     = "auto"
  access_key = var.r2_access_key_id
  secret_key = var.r2_secret_access_key

  skip_credentials_validation = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  endpoints {
    s3 = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  }
}

locals {
  env_name = "prod"
  labels   = { env = "prod", project = "charya", managed_by = "opentofu" }
}

# ── Postgres (Neon, CU maior que staging) ─────────────────────────────────
module "postgres" {
  source = "../../modules/postgres"

  provider_kind = "neon"
  name          = "charya-${local.env_name}"
  database_name = "charya"
  db_user       = "charya"

  neon_region             = "aws-sa-east-1" # São Paulo
  neon_autoscaling_min_cu = 0.5
  neon_autoscaling_max_cu = 4

  labels = local.labels
}

# ── Storage de vídeos (R2 S3-compatível) ──────────────────────────────────
# PROD: bucket OBRIGATORIAMENTE PRIVADO. Os vídeos de pesagem têm rosto (dado
# pessoal sensível/biométrico — LGPD). Acesso a objetos SOMENTE via URL pré-
# assinada de curta duração emitida pela api. PROIBIDO: ACL pública, domínio
# público (r2.dev/custom), leitura anônima, ou CORS "*". O `mc anonymous set
# download` do docker-compose é EXCLUSIVO de dev local com MinIO — NUNCA replicar
# aqui. R2 criptografa em repouso por padrão (AES-256, sempre-on).
module "r2" {
  source = "../../modules/r2-bucket"

  providers = {
    aws = aws.r2
  }

  bucket_name           = "charya-weighins-${local.env_name}"
  cloudflare_account_id = var.cloudflare_account_id
  location              = "sam"
  allowed_origins       = var.app_cors_origins
  # evidence_retention_days: ver TODO(lgpd) no módulo. Definir o prazo legal de
  # retenção (jurídico/DPO) e setar aqui ANTES do go-live; default 0 hoje (expurgo
  # manual) não atende plenamente a minimização da LGPD.
}

# ── API (Cloud Run — min 1 p/ matar cold start em prod) ───────────────────
module "api" {
  source = "../../modules/cloud-run"

  name                  = "charya-api-${local.env_name}"
  project_id            = var.gcp_project_id
  region                = var.gcp_region
  image                 = var.api_image
  service_account_email = var.api_service_account_email

  min_instances = 1  # 1 quente em prod (sem cold start na 1ª requisição)
  max_instances = 20 # teto do pico (janela de pesagem)
  cpu           = "1"
  memory        = "1Gi"

  allow_unauthenticated = true

  # Vocabulário de storage unificado STORAGE_* (contrato @charya/env / api).
  # O provider continua sendo R2 (módulo `r2`); só os NOMES das env batem o schema.
  env = {
    NODE_ENV         = "production"
    STORAGE_ENDPOINT = module.r2.s3_endpoint
    STORAGE_BUCKET   = module.r2.bucket_name
    STORAGE_REGION   = module.r2.s3_region
  }

  secrets = {
    DATABASE_URL              = { secret_id = var.database_url_secret_id }
    BETTER_AUTH_SECRET        = { secret_id = var.auth_secret_id }
    STORAGE_ACCESS_KEY_ID     = { secret_id = var.r2_access_key_secret_id }
    STORAGE_SECRET_ACCESS_KEY = { secret_id = var.r2_secret_key_secret_id }
  }

  labels = merge(local.labels, { app = "api" })
}

# ── Admin (Cloud Run, Next.js standalone) ─────────────────────────────────
module "admin" {
  source = "../../modules/cloud-run"

  name                  = "charya-admin-${local.env_name}"
  project_id            = var.gcp_project_id
  region                = var.gcp_region
  image                 = var.admin_image
  service_account_email = var.admin_service_account_email

  min_instances = 1
  max_instances = 4
  cpu           = "1"
  memory        = "512Mi"

  allow_unauthenticated = true

  env = {
    NODE_ENV            = "production"
    NEXT_PUBLIC_API_URL = module.api.uri
  }

  secrets = {
    BETTER_AUTH_SECRET = { secret_id = var.auth_secret_id }
  }

  labels = merge(local.labels, { app = "admin" })
}

# ── Cloudflare (DNS + CDN + WAF) ──────────────────────────────────────────
# Em prod, os hostnames são os de apex/produção (sem prefixo de ambiente).
module "cloudflare" {
  source = "../../modules/cloudflare"

  zone_id = var.cloudflare_zone_id

  records = {
    api = {
      name    = "api"
      type    = "CNAME"
      content = trimprefix(module.api.uri, "https://")
      proxied = true
    }
    admin = {
      name    = "admin"
      type    = "CNAME"
      content = trimprefix(module.admin.uri, "https://")
      proxied = true
    }
  }

  enable_waf                     = true
  rate_limit_requests_per_minute = 120
  rate_limit_path                = "/auth"
}
