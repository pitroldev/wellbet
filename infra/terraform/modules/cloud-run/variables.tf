# modules/cloud-run/variables.tf
# Entradas do módulo de serviço de container no Cloud Run v2.

variable "name" {
  description = "Nome do serviço Cloud Run (ex.: charya-api-staging)."
  type        = string
}

variable "project_id" {
  description = "ID do projeto GCP onde o serviço roda."
  type        = string
}

variable "region" {
  description = "Região do Cloud Run. Default: São Paulo (southamerica-east1)."
  type        = string
  default     = "southamerica-east1"
}

variable "image" {
  description = "Imagem do container (digest imutável, ex.: REGISTRY/charya-api@sha256:...). Imagem imutável promovida staging→prod."
  type        = string
}

variable "service_account_email" {
  description = "Service Account de runtime do serviço (princípio do menor privilégio)."
  type        = string
}

# ── Escala (escala-a-zero no MVP, teto para o pico) ───────────────────────
variable "min_instances" {
  description = "Mínimo de instâncias. 0 = escala-a-zero (ideal p/ MVP de baixo volume). Use 1+ em prod p/ matar cold start."
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Máximo de instâncias — teto para o pico (ex.: janela de pesagem). Protege custo e o Postgres de saturar conexões."
  type        = number
  default     = 10
}

variable "concurrency" {
  description = "Requisições simultâneas por instância antes de escalar."
  type        = number
  default     = 80
}

# ── Recursos por instância ────────────────────────────────────────────────
variable "cpu" {
  description = "CPU por instância (ex.: \"1\", \"2\")."
  type        = string
  default     = "1"
}

variable "memory" {
  description = "Memória por instância (ex.: \"512Mi\", \"1Gi\")."
  type        = string
  default     = "512Mi"
}

variable "cpu_idle" {
  description = "Se true, CPU só é alocada durante requisições (mais barato; combina com escala-a-zero). false = CPU sempre ligada."
  type        = bool
  default     = true
}

variable "startup_cpu_boost" {
  description = "Boost de CPU no boot p/ reduzir cold start (relevante com escala-a-zero)."
  type        = bool
  default     = true
}

variable "container_port" {
  description = "Porta que o container escuta (NestJS escuta $PORT injetado pelo Cloud Run)."
  type        = number
  default     = 8080
}

# ── Configuração de ambiente ──────────────────────────────────────────────
variable "env" {
  description = "Variáveis de ambiente em texto puro (NÃO-secretas). Ex.: NODE_ENV, OTEL_EXPORTER_OTLP_ENDPOINT."
  type        = map(string)
  default     = {}
}

variable "secrets" {
  description = <<-EOT
    Secrets injetados em runtime a partir do Secret Manager — NUNCA no código.
    Mapa de NOME_DA_ENV => { secret_id = "id-no-secret-manager", version = "latest" }.
    Ex.: { DATABASE_URL = { secret_id = "charya-db-url-staging", version = "latest" } }
  EOT
  type = map(object({
    secret_id = string
    version   = optional(string, "latest")
  }))
  default = {}
}

variable "allow_unauthenticated" {
  description = "Se true, expõe o serviço publicamente (allUsers invoker). A API pública precisa disso; jobs internos não."
  type        = bool
  default     = true
}

variable "ingress" {
  description = "Controle de ingresso: INGRESS_TRAFFIC_ALL | INGRESS_TRAFFIC_INTERNAL_ONLY | INGRESS_TRAFFIC_INTERNAL_LOAD_BALANCER."
  type        = string
  default     = "INGRESS_TRAFFIC_ALL"
}

variable "labels" {
  description = "Labels para organização/billing (ex.: { env = \"staging\", app = \"api\" })."
  type        = map(string)
  default     = {}
}
