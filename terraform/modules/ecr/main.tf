resource "aws_ecr_repository" "this" {
  for_each = var.repositories
  name = each.key
  image_tag_mutability = each.value.image_tag_mutability

  image_scanning_configuration {
    scan_on_push = each.value.scan_on_push
  }

  encryption_configuration {
    encryption_type = each.value.encryption_type
  }

  tags = merge(
    var.tags,
    {
        name = each.key
    }
  )
}

resource "aws_ecr_lifecycle_policy" "this" {
    for_each = {
        for key, val in var.repositories : key => val
        if val.lifecycle_policy != null 
    }

    repository = aws_ecr_repository.this[each.key].name
    policy = jsondecode({
        rules = [
        {
            rulePrority = 1
            discription = "Keep last ${each.value.lifecycle_policy.keep_last_image} image "
            selection ={
                tagStatus = "any"
                countType = "imageCountMoreThan"
                countNumber = each.value.lifecycle_policy.keep_last_n_images
            }
            action = {
                type = "expire"
            }
    },
    {
        rulePriority = 2
        description  = "Remove untagged images after ${each.value.lifecycle_policy.remove_untagged_after_days} days"
        selection = {
          tagStatus   = "untagged"
          countType   = "sinceImagePushed"
          countUnit   = "days"
          countNumber = each.value.lifecycle_policy.remove_untagged_after_days
        }
        action = {
          type = "expire"
        }
    }
    
        ]
    })
}