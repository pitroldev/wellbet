# modules/cloudflare/variables.tf
# DNS, CDN e WAF na Cloudflare. Aponta os hostnames públicos (api/admin) para o
# Cloud Run (proxied = CDN + WAF na frente), e instala regras básicas de WAF.

variable "zone_id" {
  description = "Zone ID da Cloudflare (domínio raiz, ex.: charya.bet)."
  type        = string
}

variable "records" {
  description = <<-EOT
    Registros DNS a criar. Mapa nome-lógico => objeto.
    proxied=true ativa CDN+WAF da Cloudflare na frente do destino (ex.: Cloud Run).
    Ex.:
    {
      api   = { name = "api.staging",   type = "CNAME", content = "charya-api-staging-xxxx.run.app" }
      admin = { name = "admin.staging", type = "CNAME", content = "charya-admin-staging-xxxx.run.app" }
    }
  EOT
  type = map(object({
    name    = string
    type    = string
    content = string
    proxied = optional(bool, true)
    ttl     = optional(number, 1) # 1 = automático (obrigatório quando proxied)
  }))
  default = {}
}

variable "enable_waf" {
  description = "Liga o ruleset de WAF custom (regras abaixo)."
  type        = bool
  default     = true
}

variable "waf_block_countries" {
  description = "Códigos ISO de países a bloquear no WAF (lista vazia = não bloqueia por país)."
  type        = list(string)
  default     = []
}

variable "rate_limit_requests_per_minute" {
  description = "Limite de requisições/min por IP nas rotas sensíveis (anti-abuso de upload/auth). 0 = desliga."
  type        = number
  default     = 0
}

variable "rate_limit_path" {
  description = "Path/expressão alvo do rate limit (ex.: começa com /auth ou /weighins)."
  type        = string
  default     = "/api/"
}
