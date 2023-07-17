terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.51.0"
    }
    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

provider "google" {
  credentials = file("/Users/ayanbandyopadhyay/Desktop/rag-stack/debug/spearmint-fbf84-87210ebc17af.json")
  project     = "spearmint-fbf84"
  region      = "us-central1"
}


data "google_client_config" "default" {
  depends_on = [module.gke-cluster]
}

# Defer reading the cluster data until the GKE cluster exists.
data "google_container_cluster" "default" {
  name       = "gpu-cluster"
  depends_on = [module.gke-cluster]
}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.default.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.default.master_auth[0].cluster_ca_certificate,
  )
}


resource "kubernetes_deployment" "falcon7b" {
  metadata {
    name = "falcon7b"
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
          resources {
            limits = {
              "nvidia.com/gpu" = 1
            }
          }
        }
      }
    }
  }
}

resource "kubernetes_service" "falcon7b_service" {
  metadata {
    name      = "falcon7b-service"
    namespace = "default"
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

variable "project_id" {
  description = "The ID of the project in which the resources will be deployed."
  type        = string
}

variable "key_file" {
  description = "The path to the GCP service account key file."
  type        = string
}

variable "region" {
  description = "The GCP region to deploy to."
  type        = string
  default     = "us-west1"  
}

variable "qdrant_port" {
  description = "The port to expose for qdrant."
  type        = string
  default     = "6333"
}

resource "google_cloud_run_service" "qdrant" {
  name     = "qdrant"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "qdrant/qdrant:v1.3.0"

        env {
            name  = "QDRANT__SERVICE__HTTP_PORT"
            value = "8080"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "ragstack-server" {
  name     = "ragstack-server"
  location = "us-central1"

  template {
    spec {
      containers {
        image = "jfan001/ragstack-server:latest"

        resources {
          limits = {
            memory = "2Gi"
          }
        }

        env {
          name  = "QDRANT_URL"
          value = google_cloud_run_service.qdrant.status[0].url
        }

        env {
          name = "LLM_URL"
          value = kubernetes_service.falcon7b_service.status[0].load_balancer.ingress[0].ip
        }

        env {
          name  = "QDRANT_PORT"
          value = var.qdrant_port
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

module "gke-cluster" {
  source       = "./gke-cluster"
}