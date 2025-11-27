# modules/iam-roles/variables.tf

variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}


variable "tags" {
  description = "Tags to apply to all resources"
  type        = map(string)
  default     = {}
}

variable "s3_config_bucket_arn" {
  description = "ARN of the S3 bucket for terraform configuration"
  type        = string
  default     = ""
}