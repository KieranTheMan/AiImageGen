#Virtual Private Cloud

resource "aws_vpc" "main" {
  cidr_block           = var.vpc_cidr
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-vpc"
    }
  )
}

# Internet Gateway
resource "aws_internt_gateway" "main" {
   vpc_id = aws_vpc.main.id

   tags = merge(
     var.tags,
     {
       Name = "${var.project_name}-igw"
     }
   )
 }

# Public subnets

resource "aws_subnet" "public" {
    count = length(var.availability_zones)
    vpc_id = aws_vpc.main.id
    cidr_block = cidrsubnet(var.vpc_cidr, 8, count.index)
    availability_zone = var.availability_zones[count.index]
    map_public_ip_on_launch = true

    tags = merge(
        var.tags,
        {
            name = " ${var.project_name}-public-subnet-${count.index + 1}"
            type = "public"
        }
    )
}


# Private Subnets

resource "aws_subnet" "private" {
  count             = length(var.availability_zones)
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(var.vpc_cidr, 8, count.index + length(var.availability_zones))
  availability_zone = var.availability_zones[count.index]

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-private-subnet-${count.index + 1}"
      Type = "private"
    }
  )
}

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-public-rt"
    }
  )
}

resource "aws_route_table_association" "public" {
    count = length(aws_subnet.public)
    subnet_id = aws_subnet.public[count.index].id
    route_table_id = aws_route_table.public.id
}

# Private Route Tables
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-private-rt-${count.index + 1}"
    }
  )
}

resource "aws_route_table_association" "private" {
  count = length(var.availability_zones)
  subnet_id = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}


# Security Groups for ALB(Virtual firewall rules)

resource "aws_security_group" "alb" {
  name_prefix =  "${var.project_name}-alb-sg"
  description =  "Security group for Application Load Balancer"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 80
    to_port =  80
    protocol = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTP traffic in from anywhere"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow HTTPS traffic in from anywhere"
  }

    egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }

  tags = merge(
    var.tags,
    {
      Name = "${var.project_name}-alb-sg"
    }
  )

  lifecycle {
    create_before_destroy = true
  }
}

#Security Group for ECS Tasks

resource "aws_security_group" "ecs_tasks" {
  name_prefix = "${var.project_name}-ecs-sg"
  description = "Security Group for ECS Tasks"
  vpc_id = aws_vpc.main.id

  ingress {
    from_port = 0
    to_port = 65535
    protocol = "tcp"
    security_groups = [aws_security_group.alb.id]
    description = "Allows All traffic from ALB"
  }

  egress {
    from_port = 0
    to_port = 0
    protocol = "-1"
    cidr_blocks= ["0.0.0.0/0"]
    description = "Allow all outbound traffic"
  }
  
  tags = merge(
    var.tags,
    {
    Name = "${var.project_name}-ecs-tasks.sg"
    }
 )
 lifecycle {
    create_before_destroy = true
  }
}