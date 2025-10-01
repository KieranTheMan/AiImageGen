variable "aws_region" {
    description = "AWS region"
    type = string
    default = "us-east-1"
}

variable "ecr_repositories" {
  description = "Map of ECR repos to create"
  type = map(object({
    image_tag_mutability = string
    scan_on_push = bool
    encryption_type = string
  }))

  default = {
    "Ai-Gen-App-frontend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push = "true"
      encryption_type = "AES256"
    }

        "Ai-Gen-App-backend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push = "true"
      encryption_type = "AES256"
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
  }
}


