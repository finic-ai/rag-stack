terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = file(var.key_file)
  project     = var.project_id
  region      = var.region
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
  location = var.region

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
  location = var.region

  template {
    spec {
      containers {
        image = "jfan001/ragstack-server:latest"

        env {
          name  = "QDRANT_URL"
          value = google_cloud_run_service.qdrant.status[0].url
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