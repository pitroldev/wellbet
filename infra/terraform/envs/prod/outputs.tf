# envs/prod/outputs.tf

output "api_uri" {
  description = "URL pública da API no Cloud Run."
  value       = module.api.uri
}

output "admin_uri" {
  description = "URL pública do admin no Cloud Run."
  value       = module.admin.uri
}

output "r2_bucket" {
  description = "Bucket R2 de vídeos de pesagem."
  value       = module.r2.bucket_name
}

output "r2_endpoint" {
  description = "Endpoint S3 do R2."
  value       = module.r2.s3_endpoint
}

output "postgres_provider" {
  description = "Backend de Postgres provisionado."
  value       = module.postgres.provider_kind
}

output "database_url" {
  description = "Connection string Postgres (sensível). Grave no Secret Manager."
  value       = module.postgres.database_url
  sensitive   = true
}
