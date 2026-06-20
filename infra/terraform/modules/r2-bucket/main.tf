# modules/r2-bucket/main.tf
# O bucket em si é criado pelo provider NATIVO da Cloudflare (cloudflare_r2_bucket).
# A configuração de CORS é S3-compatível e aplicada via provider AWS apontado ao
# endpoint S3 do R2 (não há recurso de CORS no provider Cloudflare). Isso mantém
# o storage 100% S3-compatível e trocável (R2 → B2 → S3 = trocar endpoint).

resource "cloudflare_r2_bucket" "this" {
  account_id = var.cloudflare_account_id
  name       = var.bucket_name
  location   = var.location
}

# Regra de CORS p/ permitir o PUT pré-assinado direto do app no browser/WebView.
# Aplicada via API S3 (provider aws no alias "r2", configurado no ambiente que
# instancia este módulo apontando para https://<account>.r2.cloudflarestorage.com).
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = cloudflare_r2_bucket.this.name

  cors_rule {
    allowed_origins = var.allowed_origins
    allowed_methods = var.allowed_methods
    allowed_headers = var.allowed_headers
    # ETag é necessário p/ confirmar o upload no cliente (TanStack Query).
    expose_headers  = ["ETag"]
    max_age_seconds = var.max_age_seconds
  }
}

# Limpeza de uploads multipart incompletos — vídeos de pesagem podem falhar no
# meio do upload (rede instável); evita acúmulo de partes órfãs = custo.
resource "aws_s3_bucket_lifecycle_configuration" "this" {
  bucket = cloudflare_r2_bucket.this.name

  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = var.abort_incomplete_upload_days
    }
  }
}

# TODO(infra): criar o R2 API Token (Access Key ID / Secret) p/ assinar URLs
# fica FORA do Terraform (token = secret). Gerar no painel R2 com escopo mínimo
# (Object Read & Write neste bucket) e guardar no Secret Manager como
# R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY, injetados na API em runtime.
