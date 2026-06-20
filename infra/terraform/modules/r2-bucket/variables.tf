# modules/r2-bucket/variables.tf
# Bucket de object storage Cloudflare R2 (S3-compatível). Guarda os vídeos de
# pesagem, que sobem DIRETO do app via URL pré-assinada (o pico de upload não
# toca o backend — §3 do doc). CORS liberado SÓ p/ o(s) origin(s) do app.
#
# POSTURA DE SEGURANÇA (LGPD — dado pessoal sensível/biométrico):
# Os vídeos contêm ROSTO. O bucket é PRIVADO por padrão no R2 e DEVE permanecer
# privado: o acesso é SEMPRE via URL pré-assinada de curta duração emitida pela
# api (nunca leitura anônima, nunca ACL pública, nunca domínio público r2.dev).
# Ver comentários em main.tf sobre por que NÃO há recurso de public-access-block
# nem de ACL aqui (o R2 não implementa essas operações na API S3).

variable "bucket_name" {
  description = "Nome do bucket R2 (ex.: charya-weighins-staging). Único por conta."
  type        = string
}

variable "cloudflare_account_id" {
  description = "Account ID da Cloudflare (dono do R2)."
  type        = string
}

variable "location" {
  description = "Hint de localização do R2 (ex.: \"enam\", \"weur\", \"apac\", \"sam\" p/ América do Sul)."
  type        = string
  default     = "sam"
}

variable "allowed_origins" {
  description = <<-EOT
    Origins permitidos no CORS p/ upload direto via PUT pré-assinado.
    Inclua os schemes do app (ex.: ["https://app.charya.bet"]) e, em dev/mobile,
    o origin do Expo/dev. NÃO usar "*" em prod.
  EOT
  type    = list(string)
  default = []
}

variable "allowed_methods" {
  description = "Métodos HTTP do CORS. PUT p/ upload pré-assinado; GET p/ leitura; HEAD p/ checagem."
  type        = list(string)
  default     = ["PUT", "GET", "HEAD"]
}

variable "allowed_headers" {
  description = "Headers permitidos no CORS (Content-Type etc.)."
  type        = list(string)
  default     = ["Content-Type", "Content-Length", "Authorization"]
}

variable "max_age_seconds" {
  description = "Cache do preflight CORS (Access-Control-Max-Age)."
  type        = number
  default     = 3600
}

variable "abort_incomplete_upload_days" {
  description = "Dias até abortar multipart uploads incompletos (limpeza de custo após uploads de vídeo falhos)."
  type        = number
  default     = 7
}

# Retenção / expurgo LGPD: vídeo de pesagem é dado pessoal sensível (rosto), e a
# LGPD pede minimização — não guardar evidência além do necessário. Esta variável
# define a janela de retenção; o objeto expira (é deletado) automaticamente depois.
# 0 = SEM expiração automática (retenção indefinida — use só se houver base legal
# e política de expurgo manual). O R2 suporta expiration de objeto via API S3
# (mesma API do abort de multipart já usado aqui), então isto é aplicável via TF.
variable "evidence_retention_days" {
  description = <<-EOT
    Dias de retenção do vídeo de pesagem antes do expurgo automático (LGPD).
    O objeto é deletado após este prazo via lifecycle de expiração do R2.
    0 desliga a expiração automática (retenção indefinida — exige base legal e
    política de expurgo manual; ver TODO em main.tf).
  EOT
  type        = number
  default     = 0

  validation {
    condition     = var.evidence_retention_days >= 0
    error_message = "evidence_retention_days deve ser >= 0 (0 = sem expiração automática)."
  }
}
