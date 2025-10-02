variable "aws_region" {
    description = "AWS region"
    type = string
    default = "eu-west-2"
}

variable "ecr_repositories" {
  description = "Map of ECR repos to create"
  type = map(object({
    image_tag_mutability = string
    scan_on_push = bool
    encryption_type = string
    lifecycle_policy = (object({
      keep_last_images = number
      remove_untagged_after_days = number
    }))
  }))

  default = {
    "Ai-Gen-App-frontend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push = "true"
      encryption_type = "AES256"
      lifecycle_policy = {
        keep_last_images = 5
        remove_untagged_after_days = 3
      }
    }

        "Ai-Gen-App-backend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push = "true"
      encryption_type = "AES256"
      lifecycle_policy = {
        keep_last_images = 10
        remove_untagged_after_days = 7
      }
    }
  }

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


