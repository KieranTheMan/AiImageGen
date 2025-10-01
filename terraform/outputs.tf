output "ecr_repository_urls" {
  description = "URLs of all ECR repositories"
  value       = module.ecr.repository_urls
}

output "ecr_repository_arns" {
  description = "ARNs of all ECR repositories"
  value       = module.ecr.repository_arns
}
