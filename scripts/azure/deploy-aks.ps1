Write-Host '    ____              _____ __             __  '  
Write-Host '   / __ \____ _____ _/ ___// /_____ ______/ /__' 
Write-Host '  / /_/ / __ `/ __ `/\__ \/ __/ __ `/ ___/ //_/' 
Write-Host ' / _, _/ /_/ / /_/ /___/ / /_/ /_/ / /__/ ,<   '  
Write-Host '/_/ |_|\__,_/\__, //____/\__/\__,_/\___/_/|_|  '  
Write-Host '            /____/   ' 
Write-Host '_______________________________________________'
Write-Host

# Prompt the user for their deployment details
$SUBSCRIPTION_ID = Read-Host -Prompt "Enter your Azure subscription ID"
$REGION = Read-Host -Prompt "Enter the Azure region (default: East US)"
$RESOURCE_GROUP_NAME = Read-Host -Prompt "Enter the Azure resource group name (default: rag-stack-resources)"
$MODEL = Read-Host -Prompt "Model to deploy: llama2-7b or falcon7b (default: falcon7b)"

# Set the Terraform variables
$Env:TF_VAR_subscription_id = $SUBSCRIPTION_ID
$Env:TF_VAR_region = $REGION
$Env:TF_VAR_resource_group_name = $RESOURCE_GROUP_NAME
$Env:TF_VAR_model = $MODEL

$defaultRagServerImageName = "jfan001/ragstack-server:latest"
$RAG_SERVER_IMAGE_NAME = Read-Host -Prompt "Docker image name for the RAG server (default: ${defaultRagServerImageName})"

if ($RAG_SERVER_IMAGE_NAME -ne "" -and $RAG_SERVER_IMAGE_NAME -ne $defaultRagServerImageName) {
  $RAG_SERVER_IMAGE_LOGIN_SERVER = Read-Host -Prompt "Please enter the URL for your Docker registry."
  $RAG_SERVER_IMAGE_USERNAME = Read-Host -Prompt "Please enter the username for your Docker registry at ${RAG_SERVER_IMAGE_LOGIN_SERVER}"
  $RAG_SERVER_IMAGE_PASSWORD = Read-Host -Prompt "Please enter the password for your Docker registry at ${RAG_SERVER_IMAGE_LOGIN_SERVER}"

  $Env:TF_VAR_rag_server_image_login_server = $RAG_SERVER_IMAGE_LOGIN_SERVER
  $Env:TF_VAR_rag_server_image_username = $RAG_SERVER_IMAGE_USERNAME
  $Env:TF_VAR_rag_server_image_password = $RAG_SERVER_IMAGE_PASSWORD
  $Env:TF_VAR_rag_server_image_name = $RAG_SERVER_IMAGE_NAME
}

$SUPERBASE_URL = Read-Host -Prompt "Enter your Superbase URL"
$SUPERBASE_API_KEY = Read-Host -Prompt "Enter your Superbase API key"

$Env:TF_VAR_superbase_url = $SUPERBASE_URL
$Env:TF_VAR_superbase_api_key = $SUPERBASE_API_KEY

# Initialize Terraform
terraform init

# Validate the Terraform configuration
terraform validate

# Apply the deployment
terraform apply

Get-Content -Path ".\README.md"
