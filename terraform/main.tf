terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~>5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Network Infrastructure Module
module "networking" {
  source = "./modules/networking"

  project_name       = var.project_name
  vpc_cidr           = var.vpc_cidr
  availability_zones = var.availability_zones
  tags               = var.tags
}

# ECR Module
module "ecr" {
  source = "./modules/ecr"

  repositories       = var.ecr_repositories
  tags               = var.tags
  allowed_principals = var.allowed_principals
}

# IAM Roles Module
module "iam_roles" {
  source = "./modules/iam-role"

  cluster_name = var.cluster_name
  tags         = var.tags
}

# ECS Cluster Module
module "ecs_cluster" {
  source = "./modules/ecs-cluster"

  cluster_name          = var.cluster_name
  vpc_id                = module.networking.vpc_id
  private_subnet_ids    = module.networking.private_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  ecs_ami_id            = var.ecs_ami_id
  instance_type         = var.instance_type
  volume_size           = var.volume_size
  min_capacity          = var.min_capacity
  max_capacity          = var.max_capacity
  desired_capacity      = var.desired_capacity
  tags                  = var.tags
}

# Application Load Balancer Module
module "alb" {
  source = "./modules/alb"

  name                  = var.cluster_name
  vpc_id                = module.networking.vpc_id
  public_subnet_ids     = module.networking.public_subnet_ids
  alb_security_group_id = module.networking.alb_security_group_id
  tags                  = var.tags
}


# Frontend Service Module
module "frontend_service" {
  source = "./modules/ecs-service"

  cluster_name            = var.cluster_name
  cluster_id              = module.ecs_cluster.cluster_id
  service_name            = "frontend"
  container_image         = var.frontend_image
  container_port          = 80
  cpu                     = var.frontend_cpu
  memory                  = var.frontend_memory
  desired_count           = var.frontend_desired_count
  min_tasks               = var.frontend_min_tasks
  max_tasks               = var.frontend_max_tasks
  cpu_target_value        = 70
  memory_target_value     = 80
  task_execution_role_arn = module.iam_roles.task_execution_role_arn
  #task_role_arn           = module.iam_roles.task_role_arn
  target_group_arn   = module.alb.frontend_target_group_arn
  alb_listener_arn   = module.alb.listener_arn
  aws_region         = var.aws_region
  log_retention_days = var.log_retention_days

  health_check_command = [
    "CMD-SHELL",
    "wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1"
  ]

  environment_variables = var.frontend_environment_variables
  tags                  = var.tags

  depends_on = [module.ecs_cluster]
}


# Backend Service Module
module "backend_service" {
  source = "./modules/ecs-service"

  cluster_name            = var.cluster_name
  cluster_id              = module.ecs_cluster.cluster_id
  service_name            = "backend"
  container_image         = var.backend_image
  container_port          = 8000
  cpu                     = var.backend_cpu
  memory                  = var.backend_memory
  desired_count           = var.backend_desired_count
  min_tasks               = var.backend_min_tasks
  max_tasks               = var.backend_max_tasks
  cpu_target_value        = 70
  memory_target_value     = 80
  task_execution_role_arn = module.iam_roles.task_execution_role_arn
  #task_role_arn           = module.iam_roles.task_role_arn
  target_group_arn   = module.alb.backend_target_group_arn
  alb_listener_arn   = module.alb.listener_arn
  aws_region         = var.aws_region
  log_retention_days = var.log_retention_days

  health_check_command = [
    "CMD-SHELL",
    "wget --no-verbose --tries=1 --spider http://localhost:8000/health || exit 1"
  ]

  environment_variables = var.backend_environment_variables
  secrets               = var.backend_secrets
  tags                  = var.tags

  depends_on = [module.ecs_cluster]
}



