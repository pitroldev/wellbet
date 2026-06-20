# modules/cloud-run/outputs.tf

output "service_name" {
  description = "Nome do serviço Cloud Run."
  value       = google_cloud_run_v2_service.this.name
}

output "uri" {
  description = "URL pública do serviço (run.app). O Cloudflare aponta o DNS/CDN para cá."
  value       = google_cloud_run_v2_service.this.uri
}

output "latest_ready_revision" {
  description = "Última revisão pronta — usada p/ rollback (re-deploy da revisão anterior)."
  value       = google_cloud_run_v2_service.this.latest_ready_revision
}

output "location" {
  description = "Região onde o serviço roda."
  value       = google_cloud_run_v2_service.this.location
}
