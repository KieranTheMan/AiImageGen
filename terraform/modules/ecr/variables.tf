variable "repositories" {
  description = "Map of ECR repositories to create"
  type = map(object({
    image_tag_mutability = string
    scan_on_push         = bool
    encryption_type      = string
    lifecycle_policy     = object({
      keep_last_n_images         = number
      remove_untagged_after_days = number
    })
  }))
}

variable "tags" {
  description = "tags to apply to all resources"
  type        = map(string)
  default = {
    Environment = "production"
    Project = "ai-image-gen"
    ManagedBy   = "terraform"
    Owner = "Kieran"
    Team = "DevOps"
  }
}

variable "allowed_principals" {
  description = "List of AWS principals (users/roles) allowed to access ECR"
  type        = list(string)
  default     = []
}