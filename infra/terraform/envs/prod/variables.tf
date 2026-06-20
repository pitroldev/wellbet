# envs/prod/variables.tf
# Entradas do ambiente PROD. Mesma forma do staging; valores reais vêm de
# terraform.tfvars (não commitado) ou TF_VAR_* no CI. Aqui só os tipos.

# ── GCP ───────────────────────────────────────────────────────────────────
variable "gcp_project_id" {
  description = "Projeto GCP do ambiente prod."
  type        = string
}

variable "gcp_region" {
  description = "Região GCP. Default: São Paulo."
  type        = string
  default     = "southamerica-east1"
}

variable "api_image" {
  description = "Imagem do container da API (MESMO digest promovido de staging — imagem imutável)."
  type        = string
}

variable "admin_image" {
  description = "Imagem do container do admin Next.js standalone (digest promovido de staging)."
  type        = string
}

variable "api_service_account_email" {
  description = "Service Account de runtime da API."
  type        = string
}

variable "admin_service_account_email" {
  description = "Service Account de runtime do admin."
  type        = string
}

# ── Secret Manager (IDs; valores NUNCA no código) ─────────────────────────
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
  description = "API Token da Cloudflare (escopo mínimo). Via TF_VAR, nunca no código."
  type        = string
  sensitive   = true
}

# ── R2 (credenciais S3 p/ provider aws apontado ao R2) ────────────────────
variable "r2_access_key_id" {
  description = "Access Key ID do token R2 S3. Via TF_VAR."
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
