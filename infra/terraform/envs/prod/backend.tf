# envs/prod/backend.tf
# State remoto do ambiente PROD, com lock nativo do GCS. Mesmo bucket do staging,
# `prefix` distinto isola o state. Apply em prod é MANUAL (aprovação no GitHub
# Environment) — ver README.

terraform {
  backend "gcs" {
    bucket = "charya-tfstate"
    prefix = "prod"
  }
}
