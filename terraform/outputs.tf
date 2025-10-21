
# ECR Outputs
output "ecr_repository_urls" {
  description = "URLs of all ECR repositories"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "ARNs of all ECR repositories"
  value       = module.ecr.repository_arns
}

# Cluster Outputs
output "cluster_name" {
  description = "Name of the ECS cluster"
  value       = module.ecs_cluster.cluster_name
}

output "cluster_arn" {
  description = "ARN of the ECS cluster"
  value       = module.ecs_cluster.cluster_arn
}

# ALB Outputs
output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = module.alb.alb_dns_name
}

output "alb_arn" {
  description = "ARN of the Application Load Balancer"
  value       = module.alb.alb_arn
}

# Frontend Service Outputs
output "frontend_service_name" {
  description = "Name of the frontend service"
  value       = module.frontend_service.service_name
}

output "frontend_log_group" {
  description = "CloudWatch log group for frontend"
  value       = module.frontend_service.log_group_name
}

# Backend Service Outputs
output "backend_service_name" {
  description = "Name of the backend service"
  value       = module.backend_service.service_name
}

output "backend_log_group" {
  description = "CloudWatch log group for backend"
  value       = module.backend_service.log_group_name
}

# IAM Outputs
output "task_execution_role_arn" {
  description = "ARN of the task execution role"
  value       = module.iam_roles.task_execution_role_arn
}

# output "task_role_arn" {
#   description = "ARN of the task role"
#   value       = module.iam_roles.task_role_arn
# }