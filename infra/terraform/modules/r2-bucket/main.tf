# modules/r2-bucket/main.tf
# O bucket em si é criado pelo provider NATIVO da Cloudflare (cloudflare_r2_bucket).
# A configuração de CORS é S3-compatível e aplicada via provider AWS apontado ao
# endpoint S3 do R2 (não há recurso de CORS no provider Cloudflare). Isso mantém
# o storage 100% S3-compatível e trocável (R2 → B2 → S3 = trocar endpoint).
#
# ─────────────────────────────────────────────────────────────────────────────
# POSTURA DE SEGURANÇA DO BUCKET (LGPD — vídeos de pesagem com ROSTO)
# ─────────────────────────────────────────────────────────────────────────────
# Este bucket é PRIVADO e deve permanecer PRIVADO. O acesso aos objetos é SEMPRE
# via URL pré-assinada de curta duração emitida pela api (AWS SDK v3). NUNCA:
#   - leitura/escrita anônima (nada de `mc anonymous set` — isso é DEV-ONLY no
#     docker-compose com MinIO; ver comentário forte lá);
#   - ACL pública;
#   - domínio público (r2.dev ou custom domain) apontando p/ este bucket.
#
# Por que NÃO há `aws_s3_bucket_public_access_block` nem `aws_s3_bucket_acl` aqui:
#   O Cloudflare R2 é privado POR PADRÃO — um bucket R2 só fica acessível
#   publicamente se você EXPLICITAMENTE habilitar o managed domain (r2.dev) ou
#   anexar um custom domain. Não fazemos nada disso (este módulo não cria domínio
#   público), então o bucket nasce e permanece fechado.
#   Além disso, a API S3 do R2 NÃO implementa as operações PutPublicAccessBlock
#   nem PutBucketAcl/PutBucketPolicy do S3 — declarar esses recursos via provider
#   AWS resultaria em erro 501/NotImplemented no apply. Logo, o "bloqueio de acesso
#   público" no R2 é uma propriedade da plataforma (default privado), não um
#   recurso Terraform. Garantia operacional = NÃO habilitar domínio público.
#
# CRIPTOGRAFIA EM REPOUSO:
#   O R2 criptografa TODOS os objetos em repouso por padrão (AES-256), de forma
#   transparente e não desligável. Não há `aws_s3_bucket_server_side_encryption_
#   configuration` aqui porque a API S3 do R2 também não expõe PutBucketEncryption
#   (a criptografia é sempre-on na plataforma). Documentado, portanto, em vez de
#   configurado.
# ─────────────────────────────────────────────────────────────────────────────

resource "cloudflare_r2_bucket" "this" {
  account_id = var.cloudflare_account_id
  name       = var.bucket_name
  location   = var.location
}

# Regra de CORS p/ permitir o PUT pré-assinado direto do app no browser/WebView.
# Aplicada via API S3 (provider aws no alias "r2", configurado no ambiente que
# instancia este módulo apontando para https://<account>.r2.cloudflarestorage.com).
#
# SEGURANÇA: `allowed_origins` vem do ambiente (var `app_cors_origins`, default
# []) e lista origins EXPLÍCITOS do app (ex.: https://app.charya.bet). NUNCA "*":
# o CORS é o que limita quem pode disparar o upload pré-assinado do browser. O
# guard abaixo FALHA o plan/apply se alguém passar "*" ou lista vazia em origin.
resource "aws_s3_bucket_cors_configuration" "this" {
  bucket = cloudflare_r2_bucket.this.name

  # Trava anti-"*": CORS curinga em bucket de dado sensível é proibido.
  lifecycle {
    precondition {
      condition     = length(var.allowed_origins) > 0 && !contains(var.allowed_origins, "*")
      error_message = "allowed_origins não pode ser vazio nem conter \"*\" — liste os origins explícitos do app (LGPD: bucket de vídeos com rosto)."
    }
  }

  cors_rule {
    allowed_origins = var.allowed_origins
    allowed_methods = var.allowed_methods
    allowed_headers = var.allowed_headers
    # ETag é necessário p/ confirmar o upload no cliente (TanStack Query).
    expose_headers  = ["ETag"]
    max_age_seconds = var.max_age_seconds
  }
}

# Lifecycle do bucket. Duas responsabilidades:
#   1) Limpeza de uploads multipart incompletos — vídeos de pesagem podem falhar
#      no meio do upload (rede instável); evita acúmulo de partes órfãs = custo.
#   2) Expurgo LGPD — expiração automática do objeto após `evidence_retention_days`
#      (dado pessoal sensível: minimização / não reter além do necessário). O R2
#      suporta expiration de objeto via API S3, então isto é aplicável via TF.
#      Quando `evidence_retention_days = 0`, a regra de expiração NÃO é criada
#      (retenção indefinida — ver TODO abaixo).
resource "aws_s3_bucket_lifecycle_configuration" "this" {
  bucket = cloudflare_r2_bucket.this.name

  rule {
    id     = "abort-incomplete-multipart"
    status = "Enabled"

    abort_incomplete_multipart_upload {
      days_after_initiation = var.abort_incomplete_upload_days
    }
  }

  # Expurgo LGPD: só existe quando há janela de retenção configurada (> 0).
  dynamic "rule" {
    for_each = var.evidence_retention_days > 0 ? [1] : []

    content {
      id     = "lgpd-evidence-expiration"
      status = "Enabled"

      expiration {
        days = var.evidence_retention_days
      }
    }
  }
}

# TODO(lgpd): definir o prazo de retenção legal dos vídeos de pesagem (com o
# jurídico/DPO) e setar `evidence_retention_days` nos envs. Enquanto o prazo não
# for decidido, o default é 0 (sem expiração automática) e o expurgo é MANUAL —
# o que NÃO atende plenamente o princípio de minimização da LGPD. Fechar isto
# antes do go-live de produção.

# TODO(infra): criar o R2 API Token (Access Key ID / Secret) p/ assinar URLs
# fica FORA do Terraform (token = secret). Gerar no painel R2 com escopo mínimo
# (Object Read & Write neste bucket) e guardar no Secret Manager como
# R2_ACCESS_KEY_ID / R2_SECRET_ACCESS_KEY, injetados na API em runtime.
