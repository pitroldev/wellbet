# modules/postgres/variables.tf
# Postgres gerenciado com PROVIDER TROCÁVEL (ports & adapters na infra).
# `provider_kind` seleciona o backend; o módulo só materializa o caminho
# escolhido e expõe um DATABASE_URL uniforme — quem consome não sabe qual é.

variable "provider_kind" {
  description = "Backend de Postgres: \"neon\" (default MVP) ou \"cloudsql\"."
  type        = string
  default     = "neon"

  validation {
    condition     = contains(["neon", "cloudsql"], var.provider_kind)
    error_message = "provider_kind deve ser \"neon\" ou \"cloudsql\"."
  }
}

variable "name" {
  description = "Nome lógico do projeto/instância (ex.: charya-staging)."
  type        = string
}

variable "database_name" {
  description = "Nome do banco de aplicação."
  type        = string
  default     = "charya"
}

variable "db_user" {
  description = "Usuário de aplicação (owner do banco)."
  type        = string
  default     = "charya"
}

# ── Específico Neon ───────────────────────────────────────────────────────
variable "neon_region" {
  description = "Região do Neon (ex.: aws-sa-east-1 = São Paulo). Só usado quando provider_kind = neon."
  type        = string
  default     = "aws-sa-east-1"
}

variable "neon_pg_version" {
  description = "Versão major do Postgres no Neon."
  type        = number
  default     = 17
}

variable "neon_autoscaling_min_cu" {
  description = "Compute Units mínimas (Neon escala-a-zero/baixo no MVP)."
  type        = number
  default     = 0.25
}

variable "neon_autoscaling_max_cu" {
  description = "Compute Units máximas no pico."
  type        = number
  default     = 2
}

# ── Específico Cloud SQL ──────────────────────────────────────────────────
variable "project_id" {
  description = "Projeto GCP (só usado quando provider_kind = cloudsql)."
  type        = string
  default     = null
}

variable "cloudsql_region" {
  description = "Região do Cloud SQL. Default: São Paulo."
  type        = string
  default     = "southamerica-east1"
}

variable "cloudsql_tier" {
  description = "Tier da instância Cloud SQL (ex.: db-f1-micro p/ staging)."
  type        = string
  default     = "db-f1-micro"
}

variable "cloudsql_pg_version" {
  description = "Versão do Postgres no Cloud SQL (formato do provider: POSTGRES_17)."
  type        = string
  default     = "POSTGRES_17"
}

variable "cloudsql_db_password" {
  description = "Senha do usuário de app no Cloud SQL. Vem de var sensível (Secret Manager / tfvars não-commitado), NUNCA literal."
  type        = string
  default     = null
  sensitive   = true
}

variable "labels" {
  description = "Labels/billing."
  type        = map(string)
  default     = {}
}
