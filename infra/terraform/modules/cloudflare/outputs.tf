# modules/cloudflare/outputs.tf

output "record_hostnames" {
  description = "Mapa nome-lógico => hostname FQDN criado (ex.: api => api.staging.charya.bet)."
  value       = { for k, r in cloudflare_dns_record.this : k => r.name }
}

output "waf_ruleset_id" {
  description = "ID do ruleset de WAF custom (null se WAF desligado)."
  value       = var.enable_waf ? cloudflare_ruleset.waf_custom[0].id : null
}
