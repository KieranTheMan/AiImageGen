terraform {
  required_providers {
    aws = {
        source = "hashicorp/aws"
        version = "~ 5.0"
    }
  }
}

provider "aws" {
    region = var.aws_region
}

module "ecr" {
    source = "../modules/ecr"

    repositories = var.ecr_repositories

    common_tags = var.tags
}
