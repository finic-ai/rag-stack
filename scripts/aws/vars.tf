variable "aws_access_key" {
  type = string
}

variable "aws_secret_key" {
  type = string
}

variable "model" {
  type = string
}

variable "hf_api_token" {
  type = string
}

variable "weaviate_authentication_apikey_allowed_keys" {
  type = string
  default = "jane-secret-key"
}

variable "weaviate_authentication_apikey_users" {
  type = string
  default = "jane@doe.com"
}