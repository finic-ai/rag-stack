### START VPC RESOURCES ###
resource "aws_vpc" "ragstack_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true
  tags = {
    Name = "ragstack-vpc"
  }
}

resource "aws_subnet" "public_subnet_1" {
  vpc_id            = aws_vpc.ragstack_vpc.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "public_subnet_2" {
  vpc_id            = aws_vpc.ragstack_vpc.id
  cidr_block        = "10.0.2.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_subnet" "private_subnet_1" {
  vpc_id            = aws_vpc.ragstack_vpc.id
  cidr_block        = "10.0.3.0/24"
  availability_zone = "us-east-1a"
}

resource "aws_subnet" "private_subnet_2" {
  vpc_id            = aws_vpc.ragstack_vpc.id
  cidr_block        = "10.0.4.0/24"
  availability_zone = "us-east-1b"
}

resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.ragstack_vpc.id
}

resource "aws_eip" "nat_gateway_eip" {
  vpc = true
}

resource "aws_nat_gateway" "ngw" {
  allocation_id = aws_eip.nat_gateway_eip.id
  subnet_id     = aws_subnet.public_subnet_1.id
}

resource "aws_route_table" "public_route_table" {
  vpc_id = aws_vpc.ragstack_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }
}

resource "aws_route_table" "private_route_table" {
  vpc_id = aws_vpc.ragstack_vpc.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.ngw.id
  }
}

resource "aws_route_table_association" "private_subnet_1_association" {
  subnet_id      = aws_subnet.private_subnet_1.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "private_subnet_2_association" {
  subnet_id      = aws_subnet.private_subnet_2.id
  route_table_id = aws_route_table.private_route_table.id
}

resource "aws_route_table_association" "public_subnet_1_association" {
  subnet_id      = aws_subnet.public_subnet_1.id
  route_table_id = aws_route_table.public_route_table.id
}

resource "aws_route_table_association" "public_subnet_2_association" {
  subnet_id      = aws_subnet.public_subnet_2.id
  route_table_id = aws_route_table.public_route_table.id
}
### END VPC RESOURCES ###

### START ALB RESOURCES ###
resource "aws_lb" "ragstack_alb" {
  name               = "ragstack-service-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.ragstack_alb_sg.id]
  subnets            = [aws_subnet.public_subnet_1.id, aws_subnet.public_subnet_2.id]
}

resource "aws_lb_target_group" "ragstack_service_target_group" {
  name        = "ragstack-service-target-group"
  port        = 8080
  protocol    = "HTTP"
  vpc_id      = aws_vpc.ragstack_vpc.id
  target_type = "ip"

  health_check {
    path                = "/docs"
    port                = "traffic-port"
    protocol            = "HTTP"
    unhealthy_threshold = 2
    interval            = 30
    matcher             = "200-399"
  }
}

resource "aws_lb_listener" "ragstack_service_alb_listener" {
  load_balancer_arn = aws_lb.ragstack_alb.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.ragstack_service_target_group.id
  }
}
### END ALB RESOURCES ###

### START SECURITY GROUPS ###
resource "aws_security_group" "ragstack_alb_sg" {
  name_prefix = "ragstack_alb_sg"
  vpc_id      = aws_vpc.ragstack_vpc.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    protocol    = "tcp"
    from_port   = 443
    to_port     = 443
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "ragstack_server_sg" {
  name_prefix = "ragstack-server-sg"
  vpc_id      = aws_vpc.ragstack_vpc.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.ragstack_alb_sg.id]
  }

  ingress {
    protocol  = -1
    from_port = 0
    to_port   = 0
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "weaviate_sg" {
  name_prefix = "weaviate-sg"
  vpc_id      = aws_vpc.ragstack_vpc.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.ragstack_server_sg.id]
  }

  ingress {
    protocol  = -1
    from_port = 0
    to_port   = 0
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "llm_sg" {
  name_prefix = "llm-sg"
  vpc_id      = aws_vpc.ragstack_vpc.id

  ingress {
    from_port       = 8080
    to_port         = 8080
    protocol        = "tcp"
    security_groups = [aws_security_group.ragstack_server_sg.id]
  }

  ingress {
    protocol  = -1
    from_port = 0
    to_port   = 0
    self      = true
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
### END SECURITY GROUPS ###

resource "aws_ecs_cluster" "ragstack-cluster" {
  name = "ragstack-cluster"
}

resource "aws_ecs_cluster" "llm-cluster" {
  name = "llm-cluster"
}

resource "aws_service_discovery_private_dns_namespace" "ragstack-cloudmap-namespace" {
  name = "ragstack"
  vpc  = aws_vpc.ragstack_vpc.id
}

### START WEAVIATE SERVICE RESOURCES ###
resource "aws_service_discovery_service" "weaviate_service" {
  name = "weaviate"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.ragstack-cloudmap-namespace.id

    dns_records {
      type = "A"
      ttl  = 10
    }
  }
}

resource "aws_cloudwatch_log_group" "weaviate_container_logs" {
  name              = "weaviate-container"
  retention_in_days = 7
}

resource "aws_ecs_task_definition" "weaviate_task" {
  family                   = "weaviate-task"
  network_mode             = "awsvpc"
  cpu                      = 512
  memory                   = 2048
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "weaviate-container"
      image     = "semitechnologies/weaviate:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        },
        {
          containerPort = 50051
          hostPort      = 50051
        },
        {
          containerPort = 2112
          hostPort      = 2112
        }
      ],
      "logConfiguration": {
          "logDriver": "awslogs",
          "options": {
            "awslogs-group": "weaviate-container",
            "awslogs-region": "us-east-1",
            "awslogs-create-group": "true",
            "awslogs-stream-prefix": "ecs"
          }
        },
      "environment": [
        {
          "name": "QUERY_DEFAULTS_LIMIT",
          "value": "25"
        },
        {
          "name": "PERSISTENCE_DATA_PATH",
          "value": "/var/lib/weaviate"
        },
        {
          "name": "DEFAULT_VECTORIZER_MODULE",
          "value": "none"
        },
        {
          "name": "ENABLE_MODULES",
          "value": ""
        },
        {
          "name": "CLUSTER_HOSTNAME",
          "value": "node1"
        },
        {
          "name": "AUTHENTICATION_APIKEY_ENABLED",
          "value": "true"
        },
        {
          "name": "AUTHENTICATION_APIKEY_ALLOWED_KEYS",
          "value": "var.weaviate_authentication_apikey_allowed_keys"
        },
        {
          "name": "AUTHENTICATION_APIKEY_USERS",
          "value": "var.weaviate_authentication_apikey_users"
        }
      ]

    }
  ])
}

resource "aws_ecs_service" "weaviate_service" {
  name            = "weaviate-service"
  cluster         = aws_ecs_cluster.ragstack-cluster.id
  task_definition = aws_ecs_task_definition.weaviate_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  network_configuration {
    subnets         = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_groups = [aws_security_group.weaviate_sg.id]
  }
  service_registries {
    registry_arn = aws_service_discovery_service.weaviate_service.arn
  }
}
### END WEAVIATE SERVICE RESOURCES ###

### START LLM SERVICE RESOURCES ###
resource "aws_service_discovery_service" "llm_service" {
  name = "llm"

  dns_config {
    namespace_id = aws_service_discovery_private_dns_namespace.ragstack-cloudmap-namespace.id

    dns_records {
      type = "A"
      ttl  = 10
    }
  }
}

resource "aws_cloudwatch_log_group" "llm_log_group" {
  name = "llm-ecs-log-group"
}


resource "aws_iam_role" "llm_service_role" {
  name = "llm-service-instance-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "llm_service_pa" {
  role       = aws_iam_role.llm_service_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEC2ContainerServiceforEC2Role"
}

resource "aws_iam_instance_profile" "llm_service" {
  name = "ecsInstanceProfile"
  role = aws_iam_role.llm_service_role.name
}

resource "aws_launch_configuration" "llm_service_lc" {
  name_prefix     = "lauch-configuration-"
  security_groups = [aws_security_group.llm_sg.id]
  image_id        = "ami-0271ce88f6c03e149"
  instance_type   = "p2.xlarge"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "llm_service_asg" {
  name_prefix          = "llm-service-asg-"
  launch_configuration = aws_launch_configuration.llm_service_lc.name
  min_size             = 1
  max_size             = 1
  desired_capacity     = 1
  vpc_zone_identifier  = [aws_subnet.private_subnet_2.id]
}

resource "aws_ecs_task_definition" "llm_task" {
  family                   = "llm-task"
  network_mode             = "awsvpc"
  memory                   = "32768"
  requires_compatibilities = ["EC2"]
  container_definitions = jsonencode([
    {
      name      = "llm-container"
      image     = var.model == "llama2-7b" ? "psychicapi/llama2-7b:latest" : "psychicapi/falcon7b:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.llm_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "llm"
        }
      }
      resourceRequirements = [
        {
          "type" : "GPU",
          "value" : "1"
        }
      ]

    }
  ])
}

resource "aws_ecs_service" "llm_service" {
  name            = "llm_service"
  cluster         = aws_ecs_cluster.llm-cluster.id
  task_definition = aws_ecs_task_definition.llm_task.arn
  desired_count   = 1
  network_configuration {
    subnets         = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_groups = [aws_security_group.llm_sg.id]
  }
  service_registries {
    registry_arn = aws_service_discovery_service.llm_service.arn
  }
}
### END LLM SERVICE RESOURCES ###

### START RAGSTACK-SERVER RESOURCES ###
resource "aws_iam_role" "ecs_task_execution_role" {
  name = "ecs-task-execution-role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ecs-tasks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_cloudwatch_log_group" "ecs_log_group" {
  name = "ragstack-ecs-log-group"
}

resource "aws_iam_role_policy_attachment" "ecs_task_execution_role_attachment" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
  role       = aws_iam_role.ecs_task_execution_role.name
}

resource "aws_ecs_task_definition" "ragstack_server_task" {
  family                   = "ragstack-server-task"
  cpu                      = 256
  memory                   = 2048
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  execution_role_arn       = aws_iam_role.ecs_task_execution_role.arn
  container_definitions = jsonencode([
    {
      name      = "ragstack-server-container"
      image     = "jfan001/ragstack-server:latest"
      essential = true
      portMappings = [
        {
          containerPort = 8080
          hostPort      = 8080
        }
      ]
      environment = [
        {
          "name" : "WEAVIATE_URL",
          "value" = "http://${aws_service_discovery_service.weaviate_service.name}.${aws_service_discovery_private_dns_namespace.ragstack-cloudmap-namespace.name}"
        },
        {
          "name" : "WEAVIATE_PORT",
          "value" : "8080"
        },
        {
          "name":  "USE_WEAVIATE_VECTORSTORE",
          "value": "true"
        },
        {
          "name" : "LLM_URL",
          "value" = "http://${aws_service_discovery_service.llm_service.name}.${aws_service_discovery_private_dns_namespace.ragstack-cloudmap-namespace.name}"
        }
      ],
      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs_log_group.name
          "awslogs-region"        = "us-east-1"
          "awslogs-stream-prefix" = "ragstack-server"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "ragstack_server" {
  name            = "ragstack-server"
  cluster         = aws_ecs_cluster.ragstack-cluster.id
  task_definition = aws_ecs_task_definition.ragstack_server_task.arn
  desired_count   = 1
  launch_type     = "FARGATE"
  load_balancer {
    target_group_arn = aws_lb_target_group.ragstack_service_target_group.id
    container_port   = 8080
    container_name   = "ragstack-server-container"
  }
  network_configuration {
    subnets         = [aws_subnet.private_subnet_1.id, aws_subnet.private_subnet_2.id]
    security_groups = [aws_security_group.ragstack_server_sg.id]
  }
}
### END RAGSTACK-SERVER RESOURCES ###