output "zone_id" {
  description = "The Route53 hosted zone ID"
  value       = local.zone_id
}

output "zone_name" {
  description = "The Route53 hosted zone name"
  value       = var.domain_name
}

output "name_servers" {
  description = "Name servers for the hosted zone (only if created)"
  value       = var.create_hosted_zone ? aws_route53_zone.main[0].name_servers : null
}

# Certificate outputs
output "certificate_arn" {
  description = "The ARN of the ACM certificate"
  value       = aws_acm_certificate.main.arn
}

output "certificate_domain_name" {
  description = "The domain name for which the certificate is issued"
  value       = aws_acm_certificate.main.domain_name
}

output "certificate_status" {
  description = "Status of the certificate"
  value       = aws_acm_certificate.main.status
}

output "validated_certificate_arn" {
  description = "The ARN of the validated certificate"
  value       = aws_acm_certificate_validation.main.certificate_arn
}

# DNS record outputs
output "main_record_name" {
  description = "The name of the main A record"
  value       = aws_route53_record.main.name
}

output "main_record_fqdn" {
  description = "The FQDN of the main A record"
  value       = aws_route53_record.main.fqdn
}

output "www_record_name" {
  description = "The name of the www A record"
  value       = aws_route53_record.www.name
}

output "www_record_fqdn" {
  description = "The FQDN of the www A record"
  value       = aws_route53_record.www.fqdn
}