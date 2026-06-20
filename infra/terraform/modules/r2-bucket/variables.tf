# modules/r2-bucket/variables.tf
# Bucket de object storage Cloudflare R2 (S3-compatível). Guarda os vídeos de
# pesagem, que sobem DIRETO do app via URL pré-assinada (o pico de upload não
# toca o backend — §3 do doc). CORS liberado p/ o(s) origin(s) do app.

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
