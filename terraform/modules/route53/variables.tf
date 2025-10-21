variable "domain_name" {
  description = "The domain name for Route 53"
  type        = string
}

variable "create_hosted_zone" {
  description = "Whether to create a new hosted zone or use an existing one"
  type        = bool
  default     = true
}

variable "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  type        = string
}

variable "alb_zone_id" {
  description = "Zone ID of the Application Load Balancer"
  type        = string
}

variable "tags" {
  description = "Tags to apply to resources"
  type        = map(string)
  default     = {}
}