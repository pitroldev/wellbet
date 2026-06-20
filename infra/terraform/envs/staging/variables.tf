# envs/staging/variables.tf
# Entradas do ambiente STAGING. Valores reais vêm de terraform.tfvars (não
# commitado) ou de variáveis de ambiente TF_VAR_* no CI. Aqui só os tipos.

# ── GCP ───────────────────────────────────────────────────────────────────
variable "gcp_project_id" {
  description = "Projeto GCP do ambiente staging."
  type        = string
}

variable "gcp_region" {
  description = "Região GCP. Default: São Paulo."
  type        = string
  default     = "southamerica-east1"
}

variable "api_image" {
  description = "Imagem do container da API (digest imutável vindo do CD)."
  type        = string
}

variable "admin_image" {
  description = "Imagem do container do admin Next.js standalone (digest imutável)."
  type        = string
}

variable "api_service_account_email" {
  description = "Service Account de runtime da API (acesso a Secret Manager etc.)."
  type        = string
}

variable "admin_service_account_email" {
  description = "Service Account de runtime do admin."
  type        = string
}

# ── Secret Manager (IDs dos secrets já criados; valores NUNCA no código) ───
variable "database_url_secret_id" {
  description = "Secret ID do DATABASE_URL no Secret Manager."
  type        = string
}

variable "auth_secret_id" {
  description = "Secret ID do segredo do Better Auth (BETTER_AUTH_SECRET)."
  type        = string
}

variable "r2_access_key_secret_id" {
  description = "Secret ID do R2_ACCESS_KEY_ID."
  type        = string
}

variable "r2_secret_key_secret_id" {
  description = "Secret ID do R2_SECRET_ACCESS_KEY."
  type        = string
}

# ── Cloudflare ────────────────────────────────────────────────────────────
variable "cloudflare_account_id" {
  description = "Account ID da Cloudflare."
  type        = string
}

variable "cloudflare_zone_id" {
  description = "Zone ID do domínio (ex.: charya.bet)."
  type        = string
}

variable "cloudflare_api_token" {
  description = "API Token da Cloudflare (escopo mínimo: DNS edit, R2 edit, WAF). Via TF_VAR, nunca no código."
  type        = string
  sensitive   = true
}

# ── R2 (credenciais S3 p/ aplicar CORS via provider aws apontado ao R2) ────
variable "r2_access_key_id" {
  description = "Access Key ID do token R2 S3 (p/ o provider aws gerenciar CORS/lifecycle). Via TF_VAR."
  type        = string
  sensitive   = true
}

variable "r2_secret_access_key" {
  description = "Secret Access Key do token R2 S3. Via TF_VAR."
  type        = string
  sensitive   = true
}

# ── Domínio / app ─────────────────────────────────────────────────────────
variable "app_cors_origins" {
  description = "Origins permitidos no CORS do bucket R2 (upload direto do app)."
  type        = list(string)
  default     = []
}

variable "neon_api_key" {
  description = "API key do Neon (provider neon). Via TF_VAR, nunca no código."
  type        = string
  sensitive   = true
  default     = null
}
