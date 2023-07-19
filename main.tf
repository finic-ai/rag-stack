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
  credentials = file(var.key_file)
  project     = var.project_id
  region      = var.region
}


data "google_client_config" "default" {
  depends_on = [module.gke-cluster]
}

# Defer reading the cluster data until the GKE cluster exists.
data "google_container_cluster" "default" {
  name       = "gpu-cluster"
  depends_on = [module.gke-cluster]
  location   = var.region
}

provider "kubernetes" {
  host  = "https://${data.google_container_cluster.default.endpoint}"
  token = data.google_client_config.default.access_token
  cluster_ca_certificate = base64decode(
    data.google_container_cluster.default.master_auth[0].cluster_ca_certificate,
  )
}

resource "kubernetes_deployment" "falcon7b" {
  count = var.model == "falcon7b" ? 1 : 0
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
  count = var.model == "falcon7b" ? 1 : 0
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

resource "kubernetes_deployment" "llama2_7b" {
  count = var.model == "llama2-7b" ? 1 : 0
  metadata {
    name = "llama2-7b"
    labels = {
      app = "llama2-7b"
    }
  }
  spec {
    replicas = 1
    selector {
      match_labels = {
        component = "llama2-7b-layer"
      }
    }
    template {
      metadata {
        labels = {
          component = "llama2-7b-layer"
        }
      }
      spec {
        container {
          image = "psychicapi/llama2-7b:latest"
          name = "llama2-7b-container"
          env {
            name  = "TRUSS_SECRET_huggingface_api_token"
            value = var.hf_api_token
          }
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

resource "kubernetes_service" "llama2_7b_service" {
  count = var.model == "llama2-7b" ? 1 : 0
  metadata {
    name      = "llama2-7b-service"
    namespace = "default"
  }

  spec {
    selector = {
      component = "llama2-7b-layer"
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

variable "model" {
  description = "The model to deploy."
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

variable "hf_api_token" {
  description = "Huggingface API token"
  type        = string     
}

variable "qdrant_port" {
  description = "The port to expose for qdrant."
  type        = string
  default     = "443"
}

resource "google_cloud_run_service" "qdrant" {
  name     = "qdrant"
  location = var.region

  template {
    spec {
      containers {
        image = "qdrant/qdrant:v1.3.0"

        ports {
          container_port = 6333
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
  location = var.region

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
          value = var.model == "falcon7b" ? "http://${kubernetes_service.falcon7b_service[0].status[0].load_balancer[0].ingress[0].ip}" : "http://${kubernetes_service.llama2_7b_service[0].status[0].load_balancer[0].ingress[0].ip}"

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

  project_id = var.project_id
  region     = var.region
  key_file   = var.key_file
}

resource "google_cloud_run_service_iam_member" "public" {
  service  = google_cloud_run_service.qdrant.name
  location = google_cloud_run_service.qdrant.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}