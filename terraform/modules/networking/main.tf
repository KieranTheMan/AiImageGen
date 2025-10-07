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

