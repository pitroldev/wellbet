# envs/staging/main.tf
# Ambiente STAGING — só COMPÕE módulos com variáveis específicas do staging.
# Nenhum recurso é criado fora dos módulos. Igual à prod em forma; difere só nos
# valores (escala menor, escala-a-zero agressiva, etc.).

# ── Providers (configurados aqui, com credenciais vindas de variáveis) ─────
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

# Provider neon só é usado se o módulo postgres rodar com provider_kind=neon.
provider "neon" {
  api_key = var.neon_api_key
}

# Provider AWS apontado ao endpoint S3 do Cloudflare R2 (alias "r2"). NÃO fala
# com a AWS real — só usa o protocolo S3 contra o R2. Região fixa "auto".
provider "aws" {
  alias      = "r2"
  region     = "auto"
  access_key = var.r2_access_key_id
  secret_key = var.r2_secret_access_key

  # R2 não é a AWS: pular as validações que assumem endpoints/IAM da AWS.
  skip_credentials_validation = true
  skip_region_validation      = true
  skip_requesting_account_id  = true
  skip_metadata_api_check     = true

  endpoints {
    s3 = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
  }
}

locals {
  env_name = "staging"
  labels   = { env = "staging", project = "charya", managed_by = "opentofu" }
}

# ── Postgres (Neon por padrão no MVP) ─────────────────────────────────────
module "postgres" {
  source = "../../modules/postgres"

  provider_kind = "neon"
  name          = "charya-${local.env_name}"
  database_name = "charya"
  db_user       = "charya"

  # Escala-a-zero agressiva no staging (baixo volume).
  neon_region             = "aws-sa-east-1" # São Paulo
  neon_autoscaling_min_cu = 0.25
  neon_autoscaling_max_cu = 1

  labels = local.labels
}

# ── Storage de vídeos (R2 S3-compatível) ──────────────────────────────────
# Bucket PRIVADO (vídeos de pesagem com rosto — dado sensível/biométrico, LGPD).
# Acesso SOMENTE via URL pré-assinada emitida pela api; sem ACL pública, sem
# domínio público, sem leitura anônima. CORS restrito aos origins do app
# (`app_cors_origins`, nunca "*"). R2 já criptografa em repouso por padrão.
module "r2" {
  source = "../../modules/r2-bucket"

  providers = {
    aws = aws.r2
  }

  bucket_name           = "charya-weighins-${local.env_name}"
  cloudflare_account_id = var.cloudflare_account_id
  location              = "sam" # América do Sul
  allowed_origins       = var.app_cors_origins
  # evidence_retention_days: ver TODO(lgpd) no módulo. Default 0 (sem expiração
  # automática) em staging; definir o prazo legal antes do go-live de prod.
}

# ── API (Cloud Run, container, escala-a-zero) ─────────────────────────────
module "api" {
  source = "../../modules/cloud-run"

  name                  = "charya-api-${local.env_name}"
  project_id            = var.gcp_project_id
  region                = var.gcp_region
  image                 = var.api_image
  service_account_email = var.api_service_account_email

  min_instances = 0 # escala-a-zero no staging
  max_instances = 4
  cpu           = "1"
  memory        = "512Mi"

  allow_unauthenticated = true

  # Vocabulário de storage unificado STORAGE_* (contrato @charya/env / api).
  # O provider continua sendo R2 (módulo `r2`); só os NOMES das env batem o schema.
  env = {
    # NODE_ENV é SEMPRE "production" em ambiente deployado (staging incluso):
    # libs (pino, express, etc.) otimizam por NODE_ENV==="production", e o schema
    # @charya/env aceita só development|test|production. A distinção staging↔prod
    # vai por APP_ENV (informativo) e pela escala/recursos dos módulos.
    NODE_ENV         = "production"
    APP_ENV          = "staging"
    STORAGE_ENDPOINT = module.r2.s3_endpoint
    STORAGE_BUCKET   = module.r2.bucket_name
    STORAGE_REGION   = module.r2.s3_region
  }

  # Secrets resolvidos em runtime via Secret Manager (valores fora do código).
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

  min_instances = 0
  max_instances = 2
  cpu           = "1"
  memory        = "512Mi"

  allow_unauthenticated = true

  env = {
    NODE_ENV            = "production"
    APP_ENV             = "staging"
    NEXT_PUBLIC_API_URL = module.api.uri
  }

  secrets = {
    BETTER_AUTH_SECRET = { secret_id = var.auth_secret_id }
  }

  labels = merge(local.labels, { app = "admin" })
}

# ── Cloudflare (DNS + CDN + WAF) ──────────────────────────────────────────
module "cloudflare" {
  source = "../../modules/cloudflare"

  zone_id = var.cloudflare_zone_id

  records = {
    api = {
      name    = "api.${local.env_name}"
      type    = "CNAME"
      content = trimprefix(module.api.uri, "https://")
      proxied = true
    }
    admin = {
      name    = "admin.${local.env_name}"
      type    = "CNAME"
      content = trimprefix(module.admin.uri, "https://")
      proxied = true
    }
  }

  enable_waf                     = true
  rate_limit_requests_per_minute = 120
  rate_limit_path                = "/auth"
}
