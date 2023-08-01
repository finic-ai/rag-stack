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

defaultRagServerImageName="jfan001/ragstack-server:latest"
read -p "Docker image name for the RAG server (default: ${defaultRagServerImageName}): " RAG_SERVER_IMAGE_NAME

if [ ! -z "$RAG_SERVER_IMAGE_NAME" ] && [ "$RAG_SERVER_IMAGE_NAME" != "$defaultRagServerImageName" ]
then
  read -p "Please enter the URL for your Docker registry: " RAG_SERVER_IMAGE_LOGIN_SERVER
  read -p "Please enter the username for your Docker registry at ${RAG_SERVER_IMAGE_LOGIN_SERVER}: " RAG_SERVER_IMAGE_USERNAME
  read -s -p "Please enter the password for your Docker registry at ${RAG_SERVER_IMAGE_LOGIN_SERVER}: " RAG_SERVER_IMAGE_PASSWORD
  echo

  export TF_VAR_rag_server_image_login_server=$RAG_SERVER_IMAGE_LOGIN_SERVER
  export TF_VAR_rag_server_image_username=$RAG_SERVER_IMAGE_USERNAME
  export TF_VAR_rag_server_image_password=$RAG_SERVER_IMAGE_PASSWORD
  export TF_VAR_rag_server_image_name=$RAG_SERVER_IMAGE_NAME
fi

read -p "Enter your Superbase URL: " SUPERBASE_URL
read -p "Enter your Superbase API key: " SUPERBASE_API_KEY

export TF_VAR_superbase_url=$SUPERBASE_URL
export TF_VAR_superbase_api_key=$SUPERBASE_API_KEY
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

cat "./README.md"
