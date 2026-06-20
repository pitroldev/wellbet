# modules/postgres/outputs.tf
# Expõe um DATABASE_URL uniforme independente do provider. Quem consome (a API,
# via packages/env t3-env) recebe sempre a mesma forma. O valor é SENSÍVEL e
# deve ser gravado no Secret Manager pelo ambiente, nunca impresso/commitado.

locals {
  # Neon entrega a connection string pronta no endpoint default da branch.
  neon_database_url = local.is_neon ? (
    "postgresql://${neon_role.app[0].name}:${neon_role.app[0].password}@${neon_project.this[0].default_endpoint_host}/${neon_database.app[0].name}?sslmode=require"
  ) : null

  # Cloud SQL: monta a URL via socket do Cloud SQL Connector (host = caminho do
  # socket /cloudsql/<connection_name>), padrão p/ Cloud Run.
  cloudsql_database_url = local.is_cloudsql ? (
    "postgresql://${google_sql_user.app[0].name}:${var.cloudsql_db_password}@localhost/${google_sql_database.app[0].name}?host=/cloudsql/${google_sql_database_instance.this[0].connection_name}&sslmode=disable"
  ) : null

  database_url = coalesce(local.neon_database_url, local.cloudsql_database_url)
}

output "database_url" {
  description = "Connection string Postgres pronta p/ a API (gravar no Secret Manager)."
  value       = local.database_url
  sensitive   = true
}

output "database_name" {
  description = "Nome do banco de aplicação."
  value       = var.database_name
}

output "provider_kind" {
  description = "Backend efetivamente provisionado (neon | cloudsql)."
  value       = var.provider_kind
}

# Só faz sentido no Cloud SQL — usado pelo Cloud Run p/ anexar o conector.
output "cloudsql_connection_name" {
  description = "connection_name do Cloud SQL (null quando provider_kind = neon)."
  value       = local.is_cloudsql ? google_sql_database_instance.this[0].connection_name : null
}
