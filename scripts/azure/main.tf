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
        container {
          image = "jfan001/ragstack-server:latest"
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