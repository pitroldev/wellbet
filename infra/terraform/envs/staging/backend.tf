# envs/staging/backend.tf
# State remoto do ambiente STAGING, com lock nativo do GCS.
# O bucket é provisionado UMA vez no bootstrap (ver remote-state.tf na raiz).
# `prefix` isola o state deste ambiente dos demais no mesmo bucket.
#
# Nota: o bloco `backend` não aceita variáveis — valores são literais. Para
# trocar o bucket por ambiente sem editar este arquivo, use:
#   tofu init -backend-config="bucket=<outro>" -backend-config="prefix=staging"

terraform {
  backend "gcs" {
    bucket = "charya-tfstate"
    prefix = "staging"
  }
}
