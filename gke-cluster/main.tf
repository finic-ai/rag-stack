terraform {
  required_providers {
    google = {
      source = "hashicorp/google"
      version = "4.51.0"
    }
  }
}

provider "google" {
  credentials = "/Users/ayanbandyopadhyay/Desktop/rag-stack/debug/spearmint-fbf84-87210ebc17af.json"
  project     = "spearmint-fbf84"
  region      = "us-central1"
}

resource "google_container_cluster" "gpu_cluster" {
  name               = "gpu-cluster"
  location           = "us-central1-c"
  initial_node_count = 1
  remove_default_node_pool = true
}

resource "google_container_node_pool" "primary_preemptible_nodes" {
  name       = "gpu-node-pool"
  location   = "us-central1-c"
  cluster    = google_container_cluster.gpu_cluster.name
  node_count = 1

  node_config {
    guest_accelerator {
      type = "nvidia-tesla-t4"
      count = 1
      gpu_sharing_config {
        gpu_sharing_strategy = "TIME_SHARING"
        max_shared_clients_per_gpu = 8
      }
    }
    machine_type = "n1-standard-4"
    disk_size_gb = 50
    spot = true
    oauth_scopes = [
      "https://www.googleapis.com/auth/compute",
      "https://www.googleapis.com/auth/devstorage.read_only",
      "https://www.googleapis.com/auth/logging.write",
      "https://www.googleapis.com/auth/monitoring",
    ]
  }
}