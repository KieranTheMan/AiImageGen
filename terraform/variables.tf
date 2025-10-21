#General Configuration

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "eu-west-2"
}

variable "ecr_repositories" {
  description = "Map of ECR repos to create"
  type = map(object({
    image_tag_mutability = string
    scan_on_push         = bool
    encryption_type      = string
    lifecycle_policy = object({
      keep_last_n_images         = number
      remove_untagged_after_days = number
    })
  }))

  default = {
    "ai-gen-app-frontend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      encryption_type      = "AES256"
      lifecycle_policy = {
        keep_last_n_images         = 5
        remove_untagged_after_days = 3
      }
    }

    "ai-gen-app-backend" = {
      image_tag_mutability = "MUTABLE"
      scan_on_push         = true
      encryption_type      = "AES256"
      lifecycle_policy = {
        keep_last_n_images         = 10
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
    Project     = "ai-image-gen"
    ManagedBy   = "terraform"
    Owner       = "Kieran"
    Team        = "DevOps"
  }
}

variable "allowed_principals" {
  description = "AWS principals allowed to access ECR repositories"
  type        = list(string)
  default     = []
}


variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "ai-image-gen"
}

variable "vpc_cidr" {
  description = "CIDR block for VPC"
  type        = string
  default     = "10.0.0.0/16"
}


variable "cluster_name" {
  description = "Name of the ECS cluster"
  type        = string
}

# Network Configuration

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
  default     = ["eu-west-2a", "eu-west-2b"]
}


# EC2 Configuration
variable "ecs_ami_id" {
  description = "AMI ID for ECS-optimized instances"
  type        = string
}

variable "instance_type" {
  description = "EC2 instance type"
  type        = string
  default     = "t2.micro"
}

variable "volume_size" {
  description = "Size of the EBS volume in GB"
  type        = number
  default     = 30
}

variable "min_capacity" {
  description = "Minimum number of EC2 instances"
  type        = number
  default     = 1
}

variable "max_capacity" {
  description = "Maximum number of EC2 instances"
  type        = number
  default     = 10
}

variable "desired_capacity" {
  description = "Desired number of EC2 instances"
  type        = number
  default     = 2
}

# Frontend Service Configuration
variable "frontend_image" {
  description = "Docker image for frontend"
  type        = string
}

variable "frontend_cpu" {
  description = "CPU units for frontend task"
  type        = number
  default     = 256
}

variable "frontend_memory" {
  description = "Memory (MB) for frontend task"
  type        = number
  default     = 512
}

variable "frontend_desired_count" {
  description = "Desired number of frontend tasks"
  type        = number
  default     = 2
}

variable "frontend_min_tasks" {
  description = "Minimum number of frontend tasks"
  type        = number
  default     = 1
}

variable "frontend_max_tasks" {
  description = "Maximum number of frontend tasks"
  type        = number
  default     = 10
}

variable "frontend_environment_variables" {
  description = "Environment variables for frontend"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

# Backend Service Configuration
variable "backend_image" {
  description = "Docker image for backend"
  type        = string
}

variable "backend_cpu" {
  description = "CPU units for backend task"
  type        = number
  default     = 512
}

variable "backend_memory" {
  description = "Memory (MB) for backend task"
  type        = number
  default     = 1024
}

variable "backend_desired_count" {
  description = "Desired number of backend tasks"
  type        = number
  default     = 2
}

variable "backend_min_tasks" {
  description = "Minimum number of backend tasks"
  type        = number
  default     = 1
}

variable "backend_max_tasks" {
  description = "Maximum number of backend tasks"
  type        = number
  default     = 10
}

variable "backend_environment_variables" {
  description = "Environment variables for backend"
  type = list(object({
    name  = string
    value = string
  }))
  default = []
}

variable "backend_secrets" {
  description = "Secrets for backend from AWS Secrets Manager"
  type = list(object({
    name      = string
    valueFrom = string
  }))
  default = []
}

# Logging
variable "log_retention_days" {
  description = "CloudWatch log retention in days"
  type        = number
  default     = 7
}

# Route 53 Configuration
variable "domain_name" {
  description = "Domain name for Route 53"
  type        = string
  default     = ""
}

variable "create_hosted_zone" {
  description = "Whether to create a new Route 53 hosted zone"
  type        = bool
  default     = false
}