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
  default     = "East US"
}

variable "resource_group_name" {
  description = "The name of the Azure resource group"
  type        = string
  default     = "rag-stack-resources"
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

resource "azurerm_container_registry" "acr" {
  name                     = "ragstackregistry"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  sku                      = "Basic"
  admin_enabled            = true
}

output "acr_login_server" {
  value = azurerm_container_registry.acr.login_server
}

output "acr_admin_username" {
  value = azurerm_container_registry.acr.admin_username
}

output "acr_admin_password" {
  value = azurerm_container_registry.acr.admin_password
  sensitive = true
}