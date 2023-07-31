#!/bin/bash
echo '    ____              _____ __             __  '
echo '   / __ \____ _____ _/ ___// /_____ ______/ /__'
echo '  / /_/ / __ `/ __ `/\__ \/ __/ __ `/ ___/ //_/'
echo ' / _, _/ /_/ / /_/ /___/ / /_/ /_/ / /__/ ,<   '
echo '/_/ |_|\__,_/\__, //____/\__/\__,_/\___/_/|_|  '
echo '            /____/   '
echo '_______________________________________________'
echo

set -e

# Prompt the user for their deployment details
read -p "Enter your Azure subscription ID: " SUBSCRIPTION_ID
read -p "Enter the Azure region (default: East US): " REGION
read -p "Enter the Azure resource group name (default: rag-stack-resources): " RESOURCE_GROUP_NAME
read -p "Model to deploy: llama2-7b or falcon7b (default: falcon7b): " MODEL

# Set the Terraform variables
export TF_VAR_subscription_id=$SUBSCRIPTION_ID
export TF_VAR_region=$REGION
export TF_VAR_resource_group_name=$RESOURCE_GROUP_NAME
export TF_VAR_model=$MODEL

# Initialize Terraform
terraform init

# Validate the Terraform configuration
terraform validate

# Apply the deployment
terraform apply