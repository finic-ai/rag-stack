terraform {
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = ">=2.0"
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
}

variable "resource_group_name" {
  description = "The name of the Azure resource group"
  type        = string
}

provider "azurerm" {
  features {}
  skip_provider_registration = true
  subscription_id = var.subscription_id
}

resource "azurerm_resource_group" "rg" {
  name     = var.resource_group_name
  location = var.region
}

resource "azurerm_kubernetes_cluster" "aks_cluster" {
  name                = "rag-stack"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  dns_prefix          = "rag-stack"

  identity {
    type = "SystemAssigned"
  }

  default_node_pool {
    name       = "default"
    node_count = 1
    vm_size    = "Standard_DS2_v2"
  }
}

resource "azurerm_kubernetes_cluster_node_pool" "gpu_node_pool" {
  name                = "gpu"
  kubernetes_cluster_id = azurerm_kubernetes_cluster.aks_cluster.id
  node_count          = 1
  vm_size             = "Standard_NC4as_T4_v3"
  os_disk_size_gb     = 100
}

output "kube_config" {
  value = azurerm_kubernetes_cluster.aks_cluster.kube_config
  sensitive = true
}