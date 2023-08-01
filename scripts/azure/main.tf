terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=2.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = ">=1.13.3"
    }
  }
}

variable "subscription_id" {
  description = "The ID of the Azure subscription in which resources will be deployed."
  type        = string
}

variable "region" {
  description = "The Azure region to deploy to."
  type        = string
  default     = "East US"
}

variable "resource_group_name" {
  description = "The name of the Azure resource group"
  type        = string
  default     = "rag-stack-resources"
}

variable "model" {
  description = "The model to deploy."
  type        = string
  default     = "falcon7b"
}

variable "qdrant_port" {
  description = "The port to expose for qdrant."
  type        = string
  default     = "443"
}

variable "rag_server_image_name" {
  description = "The Docker image name for the RAG server."
  type        = string
  default = "jfan001/ragstack-server:latest"
}

variable "rag_server_image_login_server" {
  description = "The Docker registry URL for the RAG server image."
  type        = string
  default     = "https://index.docker.io/v1/"
}

variable "rag_server_image_username" {
  description = "The Docker registry username for the RAG server image."
  type        = string
  default     = ""
}

variable "rag_server_image_password" {
  description = "The Docker registry password for the RAG server image."
  type        = string
  default     = ""
  sensitive   = true
}

variable "superbase_url" {
  description = "The Superbase URL."
  type        = string
}

variable "superbase_api_key" {
  description = "The Superbase API key."
  type        = string
  sensitive   = true
}

module "aks-cluster" {
  source       = "./aks-cluster"

  subscription_id     = var.subscription_id
  region              = var.region
  resource_group_name = var.resource_group_name
}

provider "kubernetes" {
  host                   = module.aks-cluster.kube_config.0.host
  client_certificate     = base64decode(module.aks-cluster.kube_config.0.client_certificate)
  client_key             = base64decode(module.aks-cluster.kube_config.0.client_key)
  cluster_ca_certificate = base64decode(module.aks-cluster.kube_config.0.cluster_ca_certificate)
}

resource "kubernetes_namespace" "rag_stack" {
  metadata {
    name = "rag-stack"
  }
}

resource "kubernetes_deployment" "falcon7b" {
  count = var.model == "falcon7b" ? 1 : 0
  depends_on = [module.aks-cluster]
  metadata {
    name = "falcon7b"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
    labels = {
      app = "falcon7b"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        component = "falcon7b-layer"
      }
    }
    template {
      metadata {
        labels = {
          component = "falcon7b-layer"
        }
      }
      spec {
        container {
          image = "psychicapi/falcon7b:latest"
          name = "falcon7b-container"
          port {
            container_port = 8080
          }
        }
        node_selector = {
          "agentpool" = "gpu"
        }
      }
    }
  }
}

resource "kubernetes_service" "falcon7b_service" {
  count = var.model == "falcon7b" ? 1 : 0
  depends_on = [module.aks-cluster]
  metadata {
    name      = "falcon7b"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
  }

  spec {
    selector = {
      component = "falcon7b-layer"
    }

    port {
      port        = 8080
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}

resource "kubernetes_deployment" "qdrant" {
  depends_on = [module.aks-cluster]
  metadata {
    name = "qdrant"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
    labels = {
      app = "qdrant"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        component = "qdrant"
      }
    }
    template {
      metadata {
        labels = {
          component = "qdrant"
        }
      }
      spec {
        container {
          image = "qdrant/qdrant:v1.3.0"
          name = "qdrant-container"
          port {
            container_port = 6333
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "qdrant_service" {
  count = 1
  depends_on = [module.aks-cluster]
  metadata {
    name      = "qdrant"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
  }

  spec {
    selector = {
      component = "qdrant"
    }

    port {
      port        = var.qdrant_port
      target_port = 6333
    }

    type = "LoadBalancer"
  }
}

resource "kubernetes_secret" "docker_registry_secret" {
  metadata {
    name = "docker-registry-secret"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
  }

  data = {
    ".dockerconfigjson" = jsonencode({
      "auths" = {
        "${var.rag_server_image_login_server}" = {
          "username" = "${var.rag_server_image_username}"
          "password" = "${var.rag_server_image_password}"
        }
      }
    })
  }

  type = "kubernetes.io/dockerconfigjson"
}

resource "kubernetes_secret" "superbase_api_secret" {
  metadata {
    name = "superbase-api-secret"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
  }

  data = {
    "SUPABASE_KEY" = var.superbase_api_key
  }

  type = "Opaque"
}

resource "kubernetes_deployment" "rag_server" {
  depends_on = [kubernetes_service.qdrant_service]
  metadata {
    name = "rag-server"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
    labels = {
      app = "rag-server"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        component = "rag-server"
      }
    }
    template {
      metadata {
        labels = {
          component = "rag-server"
        }
      }
      spec {
        image_pull_secrets {
          name = kubernetes_secret.docker_registry_secret.metadata[0].name
        }

        container {
          image = var.rag_server_image_name
          name = "rag-server-container"
          port {
            container_port = 8080
          }
          
          resources {
            limits = {
                memory = "2Gi"
              }
          }

          env {
            name  = "QDRANT_URL"
            value = "http://${kubernetes_service.qdrant_service[0].status[0].load_balancer[0].ingress[0].ip}"
          }
          env {
            name = "LLM_URL"
            value = "http://${kubernetes_service.falcon7b_service[0].status[0].load_balancer[0].ingress[0].ip}"

          }
          env {
            name  = "QDRANT_PORT"
            value = var.qdrant_port
          }
          env {
            name  = "SUPABASE_URL"
            value = var.superbase_url
          }
          
          env {
            name = "SUPABASE_KEY"
            value_from {
              secret_key_ref {
                name = kubernetes_secret.superbase_api_secret.metadata[0].name
                key  = "SUPABASE_KEY"
              }
            }
          }
          env {
            name  = "USE_API_KEY"
            value = var.superbase_url != "" ? "true" : "false"
          }
        }
        node_selector = {
          "agentpool" = "default"
        }
      }
    }
  }
}

resource "kubernetes_service" "rag_server_service" {
  depends_on = [kubernetes_service.qdrant_service]
  metadata {
    name      = "rag-server"
    namespace = kubernetes_namespace.rag_stack.metadata[0].name
  }

  spec {
    selector = {
      component = "rag-server"
    }

    port {
      port        = 8081
      target_port = 8080
    }

    type = "LoadBalancer"
  }
}