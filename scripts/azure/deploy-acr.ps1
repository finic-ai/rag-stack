Set-StrictMode -Version Latest
$ErrorActionPreference = "Stop"

$AzureDirectory = Get-Location
$AcrDirectory = Join-Path -Path $AzureDirectory -ChildPath "acr"
$ServerDirectory = Join-Path -Path $AzureDirectory -ChildPath "..\..\server"
$UiDirectory = Join-Path -Path $AzureDirectory -ChildPath "..\..\ragstack-ui"

try {
    # Prompt the user for their deployment details
    $SUBSCRIPTION_ID = Read-Host -Prompt "Enter your Azure subscription ID"
    $REGION = Read-Host -Prompt "Enter the Azure region (default: East US)"
    $RESOURCE_GROUP_NAME = Read-Host -Prompt "Enter the Azure resource group name (default: rag-stack-resources)"
    
    # Set the Terraform variables
    $Env:TF_VAR_subscription_id = $SUBSCRIPTION_ID
    $Env:TF_VAR_region = $REGION
    $Env:TF_VAR_resource_group_name = $RESOURCE_GROUP_NAME
    
    # Change directory to ACR module
    Set-Location $AcrDirectory
    
    # Initialize Terraform
    terraform init
    
    # Validate the Terraform configuration
    terraform validate
    
    # Apply the deployment
    terraform apply
    
    # Extract ACR details
    $ACR_LOGIN_SERVER=$(terraform output -raw acr_login_server)
    $ACR_USERNAME=$(terraform output -raw acr_admin_username)
    $ACR_PASSWORD=$(terraform output -raw acr_admin_password)
    
    # Build Docker images and push to ACR
    $ACR_PASSWORD.Trim() | docker login $ACR_LOGIN_SERVER --username $ACR_USERNAME --password-stdin
    
    # Change directory to the server
    Set-Location $ServerDirectory
    $ragServerImageName = "${ACR_LOGIN_SERVER}/ragstack-server:latest"
    docker build -t $ragServerImageName .
    docker push $ragServerImageName
    $Env:TF_VAR_rag_server_image_name = $ragServerImageName

    # Change directory to the UI
    Set-Location $UiDirectory
    $ragUiImageName = "${ACR_LOGIN_SERVER}/ragstack-ui:latest"
    docker build -t $ragUiImageName .
    docker push $ragUiImageName
} finally {
    # Return to the root directory
    Set-Location $AzureDirectory
}

