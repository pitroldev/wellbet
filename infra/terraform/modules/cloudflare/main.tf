# modules/cloudflare/main.tf
# DNS + CDN (proxy laranja) + WAF. Os hostnames públicos passam pela Cloudflare,
# ganhando cache/CDN e o WAF na frente do Cloud Run.

# ── DNS ───────────────────────────────────────────────────────────────────
resource "cloudflare_dns_record" "this" {
  for_each = var.records

  zone_id = var.zone_id
  name    = each.value.name
  type    = each.value.type
  content = each.value.content
  proxied = each.value.proxied # true = CDN + WAF na frente
  ttl     = each.value.ttl
}

# ── WAF — ruleset custom no fase http_request_firewall_custom ─────────────
# Regras simples e declarativas. Expandir conforme o produto (ex.: proteger as
# rotas de upload pré-assinado e auth).
resource "cloudflare_ruleset" "waf_custom" {
  count = var.enable_waf ? 1 : 0

  zone_id = var.zone_id
  name    = "charya-waf-custom"
  kind    = "zone"
  phase   = "http_request_firewall_custom"

  # Bloqueio por país (opcional). Só cria a regra se houver países na lista.
  dynamic "rules" {
    for_each = length(var.waf_block_countries) > 0 ? [1] : []
    content {
      action      = "block"
      description = "Bloqueia países da lista"
      expression  = "(ip.geoip.country in {${join(" ", [for c in var.waf_block_countries : "\"${c}\""])}})"
      enabled     = true
    }
  }

  # Rate limit por IP nas rotas sensíveis (anti-abuso de auth/upload).
  dynamic "rules" {
    for_each = var.rate_limit_requests_per_minute > 0 ? [1] : []
    content {
      action      = "block"
      description = "Rate limit por IP em rotas sensíveis"
      expression  = "(http.request.uri.path contains \"${var.rate_limit_path}\")"
      enabled     = true

      ratelimit {
        characteristics     = ["ip.src"]
        period              = 60
        requests_per_period = var.rate_limit_requests_per_minute
        mitigation_timeout  = 60
      }
    }
  }
}

# TODO(infra): habilitar os Managed Rulesets da Cloudflare (OWASP/Cloudflare
# Managed) que exigem plano pago — referenciar via cloudflare_ruleset com
# phase http_request_firewall_managed quando o plano permitir.
