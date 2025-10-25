# CI/CD role for GitHub Actions.

# Github actions creates security token
resource "aws_iam_openid_connect_provider" "github" {
  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}


resource "aws_iam_role" "github_actions" {
  name = "github-actions-role"

  # Trust policy: GitHub Actions can assume this role
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Principal = {
          # Github OIDC provider
          Federated = aws_iam_openid_connect_provider.github.arn
        }
        # AWS API assuming role using OIDC/WebIdentity Token
        Action = "sts:AssumeRoleWithWebIdentity"
        Condition = {
          StringEquals = {
            # Token must be AWS Security Token Service
            "token.actions.githubusercontent.com:aud" = "sts.amazonaws.com"
            # Token must be from main or develop branch
            "token.actions.githubusercontent.com:sub" = [
              "repo:KieranTheMan/AiImageGen:ref:refs/heads/main",
              "repo:KieranTheMan/AiImageGen:ref:refs/heads/develop",
              "repo:KieranTheMan/AiImageGen:pull_request"
            ]
          }
        }
      }
    ]
  })

  tags = var.tags
}

# Attach ECR permissions to the role
resource "aws_iam_role_policy" "github_actions_ecr" {
  name = "ECR-Access-Policy"
  role = aws_iam_role.github_actions.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "ecr:GetAuthorizationToken"
        ]
        Resource = "*"
      },
      {
        Effect = "Allow"
        Action = [
          "ecr:BatchCheckLayerAvailability",
          "ecr:GetDownloadUrlForLayer",
          "ecr:BatchGetImage",
          "ecr:PutImage",
          "ecr:InitiateLayerUpload",
          "ecr:UploadLayerPart",
          "ecr:CompleteLayerUpload"
        ]
        Resource = [
          for repo in module.ecr.repository_arns : repo
        ]
      }
    ]
  })
}

# Get current AWS account ID
data "aws_caller_identity" "current" {}

