# versions.tf — declaração de versões da toolchain IaC e dos providers.
#
# Ferramenta: OpenTofu (fork aberto do Terraform — coerente com o princípio
# anti-lock-in da §6 da Arquitetura Técnica). Todos os blocos abaixo são
# compatíveis com Terraform >= 1.6, mas o fluxo oficial usa o binário `tofu`.
#
# Este arquivo NÃO instancia providers (sem credenciais aqui). Apenas fixa as
# constraints de versão. A configuração concreta de cada provider (project,
# region, tokens) é feita por ambiente em `envs/<env>/main.tf`, lendo de
# variáveis — nunca de literais no código.

terraform {
  # Pinamos um teto de major para evitar quebras silenciosas de sintaxe HCL.
  required_version = ">= 1.6.0, < 2.0.0"

  required_providers {
    # GCP — Cloud Run (container, escala-a-zero), Secret Manager, IAM.
    google = {
      source  = "hashicorp/google"
      version = "~> 6.0"
    }

    # GCP beta — necessário p/ alguns campos de Cloud Run v2 (ex.: startup
    # CPU boost, traffic tags) que ainda vivem no provider beta.
    google-beta = {
      source  = "hashicorp/google-beta"
      version = "~> 6.0"
    }

    # Cloudflare — DNS, CDN, WAF (módulo `cloudflare`).
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 5.0"
    }

    # Postgres gerenciado. Provider TROCÁVEL (ports & adapters na infra):
    #   - Neon (default do MVP): provider da comunidade `terraform-community-providers/neon`.
    #   - Cloud SQL: usar o provider `google` (sem provider extra).
    # Deixamos o provider Neon declarado; o módulo `postgres` escolhe o caminho
    # via variável `provider_kind` ("neon" | "cloudsql") e só usa o que precisa.
    neon = {
      source  = "terraform-community-providers/neon"
      version = "~> 0.1"
    }

    # Cloudflare R2 é um object storage S3-compatível. NÃO existe um provider
    # nativo "r2"; usamos o provider AWS apontado para o endpoint S3 do R2
    # (https://<account_id>.r2.cloudflarestorage.com) com a região fixa "auto".
    # O provider AWS aqui fala o protocolo S3 — nenhuma chamada à AWS real é
    # feita. Isso mantém o storage 100% S3-compatível e trocável (R2 → B2 → S3).
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }

    # Geração de IDs/sufixos estáveis (ex.: nomes de bucket únicos).
    random = {
      source  = "hashicorp/random"
      version = "~> 3.6"
    }
  }
}
