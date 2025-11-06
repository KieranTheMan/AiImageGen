# Local variables to extract resource names from ARNs
locals {
  # Extract ALB name from ARN: arn:aws:elasticloadbalancing:region:account:loadbalancer/app/name/id
  alb_name = split("/", module.alb.alb_arn)[1]
  alb_full_name = "${split("/", module.alb.alb_arn)[1]}/${split("/", module.alb.alb_arn)[2]}/${split("/", module.alb.alb_arn)[3]}"
  
  # Extract target group names from ARNs: arn:aws:elasticloadbalancing:region:account:targetgroup/name/id
  frontend_tg_name = split(":", split("/", module.alb.frontend_target_group_arn)[1])[0]
  frontend_tg_full_name = "${split("/", module.alb.frontend_target_group_arn)[1]}/${split("/", module.alb.frontend_target_group_arn)[2]}"
  
  backend_tg_name = split(":", split("/", module.alb.backend_target_group_arn)[1])[0]
  backend_tg_full_name = "${split("/", module.alb.backend_target_group_arn)[1]}/${split("/", module.alb.backend_target_group_arn)[2]}"
}

# CloudWatch Dashboard for AI Image Gen Application
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.cluster_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      # ============================================
      # Service Overview - ECS CPU & Memory
      # ============================================
      {
        type = "metric"
        x    = 0
        y    = 0
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "CPUUtilization", "ServiceName", module.frontend_service.service_name, "ClusterName", module.ecs_cluster.cluster_name, { stat = "Average", label = "Frontend CPU" }],
            ["...", module.backend_service.service_name, ".", ".", { stat = "Average", label = "Backend CPU" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS Service CPU Utilization"
          yAxis = {
            left = { min = 0, max = 100 }
          }
          annotations = {
            horizontal = [
              {
                value = 70
                label = "CPU Scaling Threshold"
                fill  = "above"
                color = "#ff7f0e"
              }
            ]
          }
        }
      },
      {
        type = "metric"
        x    = 12
        y    = 0
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ECS", "MemoryUtilization", "ServiceName", module.frontend_service.service_name, "ClusterName", module.ecs_cluster.cluster_name, { stat = "Average", label = "Frontend Memory" }],
            ["...", module.backend_service.service_name, ".", ".", { stat = "Average", label = "Backend Memory" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS Service Memory Utilization"
          yAxis = {
            left = { min = 0, max = 100 }
          }
          annotations = {
            horizontal = [
              {
                value = 80
                label = "Memory Scaling Threshold"
                fill  = "above"
                color = "#d62728"
              }
            ]
          }
        }
      },

      # ============================================
      # ECS Task Count
      # ============================================
      {
        type = "metric"
        x    = 0
        y    = 6
        width = 12
        height = 6
        properties = {
          metrics = [
            ["ECS/ContainerInsights", "RunningTaskCount", "ServiceName", module.frontend_service.service_name, "ClusterName", module.ecs_cluster.cluster_name, { stat = "Average", label = "Frontend Running" }],
            ["...", module.backend_service.service_name, ".", ".", { stat = "Average", label = "Backend Running" }],
            [".", "DesiredTaskCount", ".", module.frontend_service.service_name, ".", ".", { stat = "Average", label = "Frontend Desired" }],
            ["...", module.backend_service.service_name, ".", ".", { stat = "Average", label = "Backend Desired" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ECS Task Count (Running vs Desired)"
          yAxis = {
            left = { min = 0 }
          }
        }
      },

      # ============================================
      # ALB Performance - Response Time
      # ============================================
      {
        type = "metric"
        x    = 12
        y    = 6
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", local.alb_full_name, "TargetGroup", local.frontend_tg_full_name, { stat = "Average", label = "Frontend Response Time" }],
            ["...", local.backend_tg_full_name, { stat = "Average", label = "Backend Response Time" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ALB Target Response Time"
          yAxis = {
            left = { min = 0 }
          }
        }
      },

      # ============================================
      # ALB Request Count
      # ============================================
      {
        type = "metric"
        x    = 0
        y    = 12
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", local.alb_full_name, { stat = "Sum", label = "Total Requests" }],
            [".", ".", ".", ".", "TargetGroup", local.frontend_tg_full_name, { stat = "Sum", label = "Frontend Requests" }],
            ["...", local.backend_tg_full_name, { stat = "Sum", label = "Backend Requests" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ALB Request Count"
          yAxis = {
            left = { min = 0 }
          }
          period = 300
        }
      },

      # ============================================
      # HTTP Status Codes
      # ============================================
      {
        type = "metric"
        x    = 12
        y    = 12
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_2XX_Count", "LoadBalancer", local.alb_full_name, { stat = "Sum", label = "2XX Success", color = "#2ca02c" }],
            [".", "HTTPCode_Target_4XX_Count", ".", ".", { stat = "Sum", label = "4XX Client Error", color = "#ff7f0e" }],
            [".", "HTTPCode_Target_5XX_Count", ".", ".", { stat = "Sum", label = "5XX Server Error", color = "#d62728" }],
            [".", "HTTPCode_ELB_5XX_Count", ".", ".", { stat = "Sum", label = "5XX ELB Error", color = "#9467bd" }],
          ]
          view    = "timeSeries"
          stacked = true
          region  = var.aws_region
          title   = "HTTP Response Codes"
          yAxis = {
            left = { min = 0 }
          }
          period = 300
        }
      },

      # ============================================
      # Target Health
      # ============================================
      {
        type = "metric"
        x    = 0
        y    = 18
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HealthyHostCount", "TargetGroup", local.frontend_tg_full_name, "LoadBalancer", local.alb_full_name, { stat = "Average", label = "Frontend Healthy", color = "#2ca02c" }],
            [".", "UnHealthyHostCount", ".", ".", ".", ".", { stat = "Average", label = "Frontend Unhealthy", color = "#d62728" }],
            [".", "HealthyHostCount", ".", local.backend_tg_full_name, ".", ".", { stat = "Average", label = "Backend Healthy", color = "#1f77b4" }],
            [".", "UnHealthyHostCount", ".", ".", ".", ".", { stat = "Average", label = "Backend Unhealthy", color = "#ff7f0e" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "Target Health Status"
          yAxis = {
            left = { min = 0 }
          }
        }
      },

      # ============================================
      # ALB Active Connections
      # ============================================
      {
        type = "metric"
        x    = 12
        y    = 18
        width = 12
        height = 6
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "ActiveConnectionCount", "LoadBalancer", local.alb_full_name, { stat = "Sum", label = "Active Connections" }],
            [".", "NewConnectionCount", ".", ".", { stat = "Sum", label = "New Connections" }],
          ]
          view    = "timeSeries"
          stacked = false
          region  = var.aws_region
          title   = "ALB Connection Count"
          yAxis = {
            left = { min = 0 }
          }
        }
      },

      # ============================================
      # CloudWatch Logs Insights Widget
      # ============================================
      {
        type = "log"
        x    = 0
        y    = 24
        width = 24
        height = 6
        properties = {
          query   = <<-EOT
            SOURCE '${module.backend_service.log_group_name}'
            | fields @timestamp, @message
            | filter @message like /error|ERROR|Error|DALL-E|Cloudinary/
            | sort @timestamp desc
            | limit 100
          EOT
          region  = var.aws_region
          stacked = false
          title   = "Backend Error & API Logs (Last 100)"
          view    = "table"
        }
      },

      # ============================================
      # Number Widgets - Key Metrics Summary
      # ============================================
      {
        type = "metric"
        x    = 0
        y    = 30
        width = 6
        height = 3
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "RequestCount", "LoadBalancer", local.alb_full_name, { stat = "Sum" }]
          ]
          view    = "singleValue"
          region  = var.aws_region
          title   = "Total Requests (1h)"
          period  = 3600
        }
      },
      {
        type = "metric"
        x    = 6
        y    = 30
        width = 6
        height = 3
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "TargetResponseTime", "LoadBalancer", local.alb_full_name, { stat = "Average" }]
          ]
          view    = "singleValue"
          region  = var.aws_region
          title   = "Avg Response Time (1h)"
          period  = 3600
        }
      },
      {
        type = "metric"
        x    = 12
        y    = 30
        width = 6
        height = 3
        properties = {
          metrics = [
            ["AWS/ApplicationELB", "HTTPCode_Target_5XX_Count", "LoadBalancer", local.alb_full_name, { stat = "Sum" }]
          ]
          view    = "singleValue"
          region  = var.aws_region
          title   = "5XX Errors (1h)"
          period  = 3600
        }
      },
      {
        type = "metric"
        x    = 18
        y    = 30
        width = 6
        height = 3
        properties = {
          metrics = [
            ["ECS/ContainerInsights", "RunningTaskCount", "ServiceName", module.backend_service.service_name, "ClusterName", module.ecs_cluster.cluster_name, { stat = "Average" }]
          ]
          view    = "singleValue"
          region  = var.aws_region
          title   = "Backend Running Tasks"
          period  = 300
        }
      },
    ]
  })

  depends_on = [
    module.frontend_service,
    module.backend_service,
    module.alb
  ]
}

# Output the dashboard URL for easy access
output "cloudwatch_dashboard_url" {
  description = "URL to the CloudWatch Dashboard"
  value       = "https://console.aws.amazon.com/cloudwatch/home?region=${var.aws_region}#dashboards:name=${aws_cloudwatch_dashboard.main.dashboard_name}"
}