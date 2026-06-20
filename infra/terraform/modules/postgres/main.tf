# modules/postgres/main.tf
# Materializa o backend de Postgres escolhido por `provider_kind`. Apenas UM dos
# caminhos é criado (count baseado na variável). O DATABASE_URL final é montado
# em outputs.tf de forma uniforme — o consumidor (a API) não sabe qual provider
# está por trás (padrão aberto: "Postgres", fornecedor é detalhe trocável).

locals {
  is_neon     = var.provider_kind == "neon"
  is_cloudsql = var.provider_kind == "cloudsql"
}

# ──────────────────────────────────────────────────────────────────────────
# Caminho A: Neon (default do MVP) — serverless, escala-a-zero, região SP.
# ──────────────────────────────────────────────────────────────────────────
resource "neon_project" "this" {
  count = local.is_neon ? 1 : 0

  name       = var.name
  region_id  = var.neon_region
  pg_version = var.neon_pg_version

  # Autoscaling de compute: barato no idle, sobe no pico.
  default_endpoint_settings = {
    autoscaling_limit_min_cu = var.neon_autoscaling_min_cu
    autoscaling_limit_max_cu = var.neon_autoscaling_max_cu
  }
}

# Role (usuário) e database de aplicação no Neon.
resource "neon_role" "app" {
  count = local.is_neon ? 1 : 0

  project_id = neon_project.this[0].id
  branch_id  = neon_project.this[0].default_branch_id
  name       = var.db_user
}

resource "neon_database" "app" {
  count = local.is_neon ? 1 : 0

  project_id = neon_project.this[0].id
  branch_id  = neon_project.this[0].default_branch_id
  name       = var.database_name
  owner_name = neon_role.app[0].name
}

# ──────────────────────────────────────────────────────────────────────────
# Caminho B: Cloud SQL (GCP) — trocável sem mudar quem consome o DATABASE_URL.
# ──────────────────────────────────────────────────────────────────────────
resource "google_sql_database_instance" "this" {
  count = local.is_cloudsql ? 1 : 0

  project          = var.project_id
  name             = var.name
  region           = var.cloudsql_region
  database_version = var.cloudsql_pg_version

  settings {
    tier = var.cloudsql_tier

    ip_configuration {
      # No MVP a API (Cloud Run) conecta via conector serverless / IP privado.
      ipv4_enabled = false
      # TODO(infra): amarrar a VPC privada quando o conector serverless existir.
    }

    backup_configuration {
      enabled = true
    }
  }

  # Proteja prod contra destroy acidental via override no env (ver envs/prod).
  deletion_protection = false
}

resource "google_sql_database" "app" {
  count = local.is_cloudsql ? 1 : 0

  project  = var.project_id
  name     = var.database_name
  instance = google_sql_database_instance.this[0].name
}

resource "google_sql_user" "app" {
  count = local.is_cloudsql ? 1 : 0

  project  = var.project_id
  name     = var.db_user
  instance = google_sql_database_instance.this[0].name
  password = var.cloudsql_db_password
}
