terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "3.0.2"
    }

    aws = {
      source  = "hashicorp/aws"
      version = "5.9.0"
    }

    kubernetes = {
      source = "hashicorp/kubernetes"
    }
  }
}

provider "docker" {}

provider "aws" {
  region     = "us-east-1"
  access_key = var.aws_access_key
  secret_key = var.aws_secret_key
}
