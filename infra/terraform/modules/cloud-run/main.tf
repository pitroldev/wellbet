# modules/cloud-run/main.tf
# Serviço de container no Cloud Run v2 — escala-a-zero (min_instances=0) até o
# pico (max_instances), região São Paulo por padrão, secrets via Secret Manager
# e env tipada injetada em runtime. Deploy por imagem imutável (digest).

# Usamos o provider beta p/ ter acesso garantido a campos como startup_cpu_boost
# e tags de tráfego sem surpresas entre versões do provider GA.
resource "google_cloud_run_v2_service" "this" {
  provider = google-beta

  name     = var.name
  project  = var.project_id
  location = var.region
  ingress  = var.ingress
  labels   = var.labels

  # Por que NÃO deletar a revisão em troca: histórico permite rollback de 1
  # comando (re-deploy da revisão anterior), conforme §8.2.
  deletion_protection = false

  template {
    service_account = var.service_account_email

    scaling {
      min_instance_count = var.min_instances # 0 = escala-a-zero
      max_instance_count = var.max_instances # teto do pico
    }

    max_instance_request_concurrency = var.concurrency

    containers {
      image = var.image

      ports {
        container_port = var.container_port
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
        cpu_idle          = var.cpu_idle
        startup_cpu_boost = var.startup_cpu_boost
      }

      # Variáveis NÃO-secretas (texto puro).
      dynamic "env" {
        for_each = var.env
        content {
          name  = env.key
          value = env.value
        }
      }

      # Secrets: referência ao Secret Manager, resolvidos em runtime pelo Cloud
      # Run. O valor NUNCA aparece no state nem no código.
      dynamic "env" {
        for_each = var.secrets
        content {
          name = env.key
          value_source {
            secret_key_ref {
              secret  = env.value.secret_id
              version = env.value.version
            }
          }
        }
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }

  lifecycle {
    # A imagem é promovida por pipeline (digest imutável). Mudanças de imagem
    # vêm sempre via var.image vinda do CD — sem drift manual.
    ignore_changes = []
  }
}

# Acesso público (invoker = allUsers). A API pública precisa; serviços internos
# devem passar allow_unauthenticated = false.
resource "google_cloud_run_v2_service_iam_member" "public_invoker" {
  count = var.allow_unauthenticated ? 1 : 0

  provider = google-beta
  project  = var.project_id
  location = var.region
  name     = google_cloud_run_v2_service.this.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
