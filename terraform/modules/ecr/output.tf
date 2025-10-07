output "repository_urls" {
  description = "Map of repository names to URLs"
  value = {
    for key, val in aws_ecr_repository.this : key => val.repository_url
  }
}

output "repository_arns" {
  description = "Map of repository names to ARNs"
  value = {
    for key, val in aws_ecr_repository.this : key => val.arn
  }
}

output "registry_id" {
  description = "Registry ID"
  value       = try(values(aws_ecr_repository.this)[0].registry_id, null)
}