# modules/r2-bucket/outputs.tf

output "bucket_name" {
  description = "Nome do bucket R2."
  value       = cloudflare_r2_bucket.this.name
}

output "bucket_id" {
  description = "ID do bucket R2."
  value       = cloudflare_r2_bucket.this.id
}

output "s3_endpoint" {
  description = "Endpoint S3-compatível do R2 (para o AWS SDK v3 da API e p/ assinar URLs)."
  value       = "https://${var.cloudflare_account_id}.r2.cloudflarestorage.com"
}

output "s3_region" {
  description = "Região S3 do R2 — sempre \"auto\"."
  value       = "auto"
}
