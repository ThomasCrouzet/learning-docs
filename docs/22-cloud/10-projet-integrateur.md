---
tags:
  - Cloud
  - Avancé
  - Pratique
description: "Projet intégrateur cloud : déployer une application complete avec VPC, RDS, ECS Fargate, monitoring CloudWatch et Infrastructure as Code."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 13
cursus: "Cloud"
---

# 10 - Projet intégrateur

> **En bref** : Tu deploieras une application web complete sur AWS en combinant toutes les connaissances du cursus : réseau (VPC), base de données (RDS), conteneurs (ECS Fargate), monitoring (CloudWatch) et Infrastructure as Code (Terraform). Lecture estimée : 120 min.

## Prérequis

- Avoir lu toutes les fiches précédentes du cursus Cloud (01 a 09)
- Avoir un compte AWS configure avec le CLI
- Avoir Terraform installe (fiche [06 - Infrastructure as Code](06-infrastructure-as-code.md))
- Connaissances de base en Docker

## Objectif de cette fiche

A la fin de cette fiche, tu auras deploye une application web complete sur AWS avec une architecture production-ready : un VPC isole, une base de données RDS, une application conteneurisee sur ECS Fargate, un load balancer et un monitoring complet.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Architecture cible

Le projet deploie une application de gestion de taches (API REST) avec l'architecture suivante :

<div class="diagram-design">
<p><a href="../../diagrams/22-cloud-10-projet-intégrateur-1.html">Architecture cible (HTML + SVG)</a></p>
<iframe src="../../diagrams/22-cloud-10-projet-intégrateur-1.html" title="Architecture cible" style="width:100%;min-height:720px;border:0;background:transparent"></iframe>
</div>

**Composants** :

| Composant | Service AWS | Role |
| --- | --- | --- |
| Réseau | VPC + sous-réseaux | Isolation et segmentation réseau |
| Load Balancer | Application Load Balancer | Répartition du trafic et terminaison SSL |
| Application | ECS Fargate (2 tasks) | Exécution des conteneurs sans serveur |
| Base de données | RDS PostgreSQL | Stockage persistant des données |
| Cache | ElastiCache Redis | Cache des requêtes frequentes |
| Registre d'images | ECR | Stockage des images Docker |
| Monitoring | CloudWatch + SNS | Surveillance et alertes |
| Infrastructure | Terraform | Déploiement reproductible |

---

### Pourquoi tout combiner ?

**Le problème que le projet intégrateur résout** :

Chaque fiche précédente couvre un service isole. Mais en production, les services interagissent les uns avec les autres :

1. **Le réseau conditionne tout** : Si les sous-réseaux ou les security groups sont mal configures, les conteneurs ne peuvent pas atteindre la base de données.
2. **Les secrets traversent les services** : Le mot de passe de la base de données doit être transmis aux conteneurs de maniere sécurisée.
3. **Le monitoring couvre l'ensemble** : Un problème peut venir du réseau, de la base de données, du cache ou de l'application. Le monitoring doit couvrir tous les composants.

**Ce que ce projet va t'apprendre** :

| Compétence | Fiche d'origine | Application dans le projet |
| --- | --- | --- |
| Creer un VPC | Fiche 04 | VPC avec sous-réseaux publics et prives |
| Configurer IAM | Fiche 05 | Rôles pour ECS, RDS et CloudWatch |
| Ecrire du Terraform | Fiche 06 | Toute l'infrastructure en code |
| Deployer une base de données | Fiche 07 | RDS PostgreSQL + ElastiCache Redis |
| Deployer des conteneurs | Fiche 08 | ECS Fargate avec ECR |
| Mettre en place le monitoring | Fiche 09 | CloudWatch alarmes + tableau de bord |

---

### Organisation du code Terraform

```text
projet-integrateur/
├── main.tf              # Provider et backend
├── variables.tf         # Variables d'entree
├── outputs.tf           # Valeurs de sortie
├── vpc.tf               # VPC, sous-reseaux, passerelles
├── security-groups.tf   # Security groups
├── rds.tf               # Base de donnees RDS
├── elasticache.tf       # Cache Redis
├── ecr.tf               # Registre d'images
├── ecs.tf               # Cluster, task definition, service
├── alb.tf               # Load balancer
├── monitoring.tf        # CloudWatch alarmes et tableau de bord
├── iam.tf               # Roles et politiques IAM
└── terraform.tfvars     # Valeurs des variables (non commite)
```

Chaque fichier gère un composant. Cette organisation rend le code lisible et maintenable.

---

## Étapes Pratiques

### Étape 1 : Préparer le projet

```bash
# Creer le dossier du projet
mkdir -p ~/projet-integrateur && cd ~/projet-integrateur
```

Créé le fichier `variables.tf` :

```terraform
variable "region" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-3"
}

variable "project_name" {
  description = "Nom du projet (utilise comme prefixe)"
  type        = string
  default     = "projet-cloud"
}

variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
  default     = "dev"
}

variable "db_username" {
  description = "Nom d'utilisateur de la base de donnees"
  type        = string
  default     = "app_user"
}

variable "db_password" {
  description = "Mot de passe de la base de donnees"
  type        = string
  sensitive   = true
}

variable "app_image_tag" {
  description = "Tag de l'image Docker de l'application"
  type        = string
  default     = "1.0.0"
}
```

Créé le fichier `main.tf` :

```terraform
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.9.0"
}

provider "aws" {
  region = var.region

  default_tags {
    tags = {
      Project     = var.project_name
      Environment = var.environment
      ManagedBy   = "terraform"
    }
  }
}
```

---

### Étape 2 : Creer le réseau (VPC)

Créé le fichier `vpc.tf` :

```terraform
# VPC principal
resource "aws_vpc" "main" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = "${var.project_name}-vpc"
  }
}

# Sous-reseaux publics (2 zones de disponibilite)
resource "aws_subnet" "public" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 1}.0/24"
  availability_zone = "${var.region}${count.index == 0 ? "a" : "b"}"

  map_public_ip_on_launch = true

  tags = {
    Name = "${var.project_name}-public-${count.index + 1}"
    Tier = "public"
  }
}

# Sous-reseaux prives (2 zones de disponibilite)
resource "aws_subnet" "private" {
  count             = 2
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.${count.index + 10}.0/24"
  availability_zone = "${var.region}${count.index == 0 ? "a" : "b"}"

  tags = {
    Name = "${var.project_name}-private-${count.index + 1}"
    Tier = "private"
  }
}

# Internet Gateway (acces internet pour les sous-reseaux publics)
resource "aws_internet_gateway" "main" {
  vpc_id = aws_vpc.main.id

  tags = {
    Name = "${var.project_name}-igw"
  }
}

# Elastic IP pour la NAT Gateway
resource "aws_eip" "nat" {
  domain = "vpc"

  tags = {
    Name = "${var.project_name}-nat-eip"
  }
}

# NAT Gateway (acces internet sortant pour les sous-reseaux prives)
resource "aws_nat_gateway" "main" {
  allocation_id = aws_eip.nat.id
  subnet_id     = aws_subnet.public[0].id

  tags = {
    Name = "${var.project_name}-nat"
  }
}

# Table de routage publique
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-public-rt"
  }
}

# Table de routage privee
resource "aws_route_table" "private" {
  vpc_id = aws_vpc.main.id

  route {
    cidr_block     = "0.0.0.0/0"
    nat_gateway_id = aws_nat_gateway.main.id
  }

  tags = {
    Name = "${var.project_name}-private-rt"
  }
}

# Associer les sous-reseaux publics a la table publique
resource "aws_route_table_association" "public" {
  count          = 2
  subnet_id      = aws_subnet.public[count.index].id
  route_table_id = aws_route_table.public.id
}

# Associer les sous-reseaux prives a la table privee
resource "aws_route_table_association" "private" {
  count          = 2
  subnet_id      = aws_subnet.private[count.index].id
  route_table_id = aws_route_table.private.id
}
```

---

### Étape 3 : Creer les security groups

Créé le fichier `security-groups.tf` :

```terraform
# Security group pour le load balancer (acces HTTP/HTTPS depuis internet)
resource "aws_security_group" "alb" {
  name        = "${var.project_name}-alb-sg"
  description = "Autorise le trafic HTTP et HTTPS vers le load balancer"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTP depuis internet"
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
    description = "HTTPS depuis internet"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Tout le trafic sortant"
  }

  tags = {
    Name = "${var.project_name}-alb-sg"
  }
}

# Security group pour les conteneurs ECS (acces depuis le load balancer uniquement)
resource "aws_security_group" "ecs" {
  name        = "${var.project_name}-ecs-sg"
  description = "Autorise le trafic depuis le load balancer vers les conteneurs"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 3000
    to_port         = 3000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
    description     = "Trafic depuis le load balancer"
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
    description = "Tout le trafic sortant"
  }

  tags = {
    Name = "${var.project_name}-ecs-sg"
  }
}

# Security group pour RDS (acces depuis les conteneurs ECS uniquement)
resource "aws_security_group" "rds" {
  name        = "${var.project_name}-rds-sg"
  description = "Autorise le trafic depuis les conteneurs vers la base de donnees"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
    description     = "PostgreSQL depuis les conteneurs ECS"
  }

  tags = {
    Name = "${var.project_name}-rds-sg"
  }
}

# Security group pour ElastiCache (acces depuis les conteneurs ECS uniquement)
resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg"
  description = "Autorise le trafic depuis les conteneurs vers Redis"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = 6379
    to_port         = 6379
    protocol        = "tcp"
    security_groups = [aws_security_group.ecs.id]
    description     = "Redis depuis les conteneurs ECS"
  }

  tags = {
    Name = "${var.project_name}-redis-sg"
  }
}
```

---

### Étape 4 : Creer la base de données et le cache

Créé le fichier `rds.tf` :

```terraform
# Groupe de sous-reseaux pour RDS
resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnet"
  subnet_ids = aws_subnet.private[*].id

  tags = {
    Name = "${var.project_name}-db-subnet"
  }
}

# Instance RDS PostgreSQL
resource "aws_db_instance" "main" {
  identifier     = "${var.project_name}-db"
  engine         = "postgres"
  engine_version = "16.14"
  instance_class = "db.t3.micro"

  allocated_storage = 20
  storage_type      = "gp3"
  storage_encrypted = true

  db_name  = "application"
  username = var.db_username
  password = var.db_password

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.rds.id]

  backup_retention_period = 7
  skip_final_snapshot     = true
  publicly_accessible     = false

  tags = {
    Name = "${var.project_name}-db"
  }
}
```

Créé le fichier `elasticache.tf` :

```terraform
# Groupe de sous-reseaux pour ElastiCache
resource "aws_elasticache_subnet_group" "main" {
  name       = "${var.project_name}-cache-subnet"
  subnet_ids = aws_subnet.private[*].id
}

# Cluster ElastiCache Redis
resource "aws_elasticache_cluster" "main" {
  cluster_id           = "${var.project_name}-redis"
  engine               = "redis"
  node_type            = "cache.t3.micro"
  num_cache_nodes      = 1
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.main.name
  security_group_ids   = [aws_security_group.redis.id]

  tags = {
    Name = "${var.project_name}-redis"
  }
}
```

---

### Étape 5 : Creer le registre d'images et les rôles IAM

Créé le fichier `ecr.tf` :

```terraform
# Depot ECR pour l'application
resource "aws_ecr_repository" "app" {
  name = "${var.project_name}-app"

  image_scanning_configuration {
    scan_on_push = true
  }

  encryption_configuration {
    encryption_type = "AES256"
  }

  tags = {
    Name = "${var.project_name}-app"
  }
}
```

Créé le fichier `iam.tf` :

```terraform
# Role d'execution ECS (permet de telecharger l'image et d'envoyer les logs)
resource "aws_iam_role" "ecs_execution" {
  name = "${var.project_name}-ecs-execution"

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

resource "aws_iam_role_policy_attachment" "ecs_execution" {
  role       = aws_iam_role.ecs_execution.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy"
}

# Role de tache ECS (permissions de l'application)
resource "aws_iam_role" "ecs_task" {
  name = "${var.project_name}-ecs-task"

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
```

---

### Étape 6 : Creer le load balancer et le service ECS

Créé le fichier `alb.tf` :

```terraform
# Application Load Balancer
resource "aws_lb" "main" {
  name               = "${var.project_name}-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id

  tags = {
    Name = "${var.project_name}-alb"
  }
}

# Target group pour les conteneurs
resource "aws_lb_target_group" "app" {
  name        = "${var.project_name}-tg"
  port        = 3000
  protocol    = "HTTP"
  vpc_id      = aws_vpc.main.id
  target_type = "ip"

  health_check {
    path                = "/health"
    protocol            = "HTTP"
    healthy_threshold   = 3
    unhealthy_threshold = 3
    timeout             = 5
    interval            = 30
    matcher             = "200"
  }

  tags = {
    Name = "${var.project_name}-tg"
  }
}

# Listener HTTP
resource "aws_lb_listener" "http" {
  load_balancer_arn = aws_lb.main.arn
  port              = 80
  protocol          = "HTTP"

  default_action {
    type             = "forward"
    target_group_arn = aws_lb_target_group.app.arn
  }
}
```

Créé le fichier `ecs.tf` :

```terraform
# Cluster ECS
resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"

  setting {
    name  = "containerInsights"
    value = "enabled"
  }

  tags = {
    Name = "${var.project_name}-cluster"
  }
}

# Groupe de logs pour les conteneurs
resource "aws_cloudwatch_log_group" "ecs" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 30

  tags = {
    Name = "${var.project_name}-ecs-logs"
  }
}

# Task Definition
resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-app"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "512"
  memory                   = "1024"
  execution_role_arn       = aws_iam_role.ecs_execution.arn
  task_role_arn            = aws_iam_role.ecs_task.arn

  container_definitions = jsonencode([
    {
      name  = "app"
      image = "${aws_ecr_repository.app.repository_url}:${var.app_image_tag}"

      portMappings = [
        {
          containerPort = 3000
          protocol      = "tcp"
        }
      ]

      environment = [
        {
          name  = "DATABASE_HOST"
          value = aws_db_instance.main.address
        },
        {
          name  = "DATABASE_PORT"
          value = "5432"
        },
        {
          name  = "DATABASE_NAME"
          value = "application"
        },
        {
          name  = "DATABASE_USER"
          value = var.db_username
        },
        {
          name  = "REDIS_HOST"
          value = aws_elasticache_cluster.main.cache_nodes[0].address
        },
        {
          name  = "REDIS_PORT"
          value = "6379"
        },
        {
          name  = "NODE_ENV"
          value = var.environment
        }
      ]

      secrets = [
        {
          name      = "DATABASE_PASSWORD"
          valueFrom = "arn:aws:ssm:${var.region}:${data.aws_caller_identity.current.account_id}:parameter/${var.project_name}/db-password"
        }
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.ecs.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "ecs"
        }
      }

      healthCheck = {
        command     = ["CMD-SHELL", "curl -f http://localhost:3000/health || exit 1"]
        interval    = 30
        timeout     = 5
        retries     = 3
        startPeriod = 60
      }

      essential = true
    }
  ])

  tags = {
    Name = "${var.project_name}-task-definition"
  }
}

# Data source pour l'ID du compte AWS
data "aws_caller_identity" "current" {}

# Service ECS
resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-service"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 2
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.private[*].id
    security_groups  = [aws_security_group.ecs.id]
    assign_public_ip = false
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = 3000
  }

  depends_on = [aws_lb_listener.http]

  tags = {
    Name = "${var.project_name}-service"
  }
}
```

---

### Étape 7 : Configurer le monitoring

Créé le fichier `monitoring.tf` :

```terraform
# Sujet SNS pour les notifications
resource "aws_sns_topic" "alarmes" {
  name = "${var.project_name}-alarmes"

  tags = {
    Name = "${var.project_name}-alarmes"
  }
}

# Alarme CPU ECS
resource "aws_cloudwatch_metric_alarm" "ecs_cpu" {
  alarm_name          = "${var.project_name}-ecs-cpu"
  alarm_description   = "CPU ECS > 80% pendant 10 min"
  namespace           = "AWS/ECS"
  metric_name         = "CPUUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }

  alarm_actions = [aws_sns_topic.alarmes.arn]
  ok_actions    = [aws_sns_topic.alarmes.arn]

  tags = {
    Name = "${var.project_name}-ecs-cpu-alarm"
  }
}

# Alarme memoire ECS
resource "aws_cloudwatch_metric_alarm" "ecs_memory" {
  alarm_name          = "${var.project_name}-ecs-memoire"
  alarm_description   = "Memoire ECS > 85% pendant 10 min"
  namespace           = "AWS/ECS"
  metric_name         = "MemoryUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 85
  comparison_operator = "GreaterThanThreshold"

  dimensions = {
    ClusterName = aws_ecs_cluster.main.name
    ServiceName = aws_ecs_service.app.name
  }

  alarm_actions = [aws_sns_topic.alarmes.arn]

  tags = {
    Name = "${var.project_name}-ecs-memoire-alarm"
  }
}

# Alarme CPU RDS
resource "aws_cloudwatch_metric_alarm" "rds_cpu" {
  alarm_name          = "${var.project_name}-rds-cpu"
  alarm_description   = "CPU RDS > 80% pendant 10 min"
  namespace           = "AWS/RDS"
  metric_name         = "CPUUtilization"
  statistic           = "Average"
  period              = 300
  evaluation_periods  = 2
  threshold           = 80
  comparison_operator = "GreaterThanThreshold"

  dimensions = {
    DBInstanceIdentifier = aws_db_instance.main.identifier
  }

  alarm_actions = [aws_sns_topic.alarmes.arn]

  tags = {
    Name = "${var.project_name}-rds-cpu-alarm"
  }
}

# Alarme erreurs 5XX du load balancer
resource "aws_cloudwatch_metric_alarm" "alb_5xx" {
  alarm_name          = "${var.project_name}-alb-5xx"
  alarm_description   = "Erreurs 5XX > 10 pendant 5 min"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "HTTPCode_ELB_5XX_Count"
  statistic           = "Sum"
  period              = 60
  evaluation_periods  = 5
  threshold           = 10
  comparison_operator = "GreaterThanThreshold"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alarmes.arn]

  tags = {
    Name = "${var.project_name}-alb-5xx-alarm"
  }
}

# Tableau de bord CloudWatch
resource "aws_cloudwatch_dashboard" "main" {
  dashboard_name = "${var.project_name}-dashboard"

  dashboard_body = jsonencode({
    widgets = [
      {
        type   = "metric"
        x      = 0
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "CPU ECS"
          metrics = [["AWS/ECS", "CPUUtilization", "ClusterName", aws_ecs_cluster.main.name, "ServiceName", aws_ecs_service.app.name]]
          period  = 300
          stat    = "Average"
          region  = var.region
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 0
        width  = 12
        height = 6
        properties = {
          title   = "Memoire ECS"
          metrics = [["AWS/ECS", "MemoryUtilization", "ClusterName", aws_ecs_cluster.main.name, "ServiceName", aws_ecs_service.app.name]]
          period  = 300
          stat    = "Average"
          region  = var.region
        }
      },
      {
        type   = "metric"
        x      = 0
        y      = 6
        width  = 12
        height = 6
        properties = {
          title   = "CPU RDS"
          metrics = [["AWS/RDS", "CPUUtilization", "DBInstanceIdentifier", aws_db_instance.main.identifier]]
          period  = 300
          stat    = "Average"
          region  = var.region
        }
      },
      {
        type   = "metric"
        x      = 12
        y      = 6
        width  = 12
        height = 6
        properties = {
          title   = "Requetes ALB"
          metrics = [["AWS/ApplicationELB", "RequestCount", "LoadBalancer", aws_lb.main.arn_suffix]]
          period  = 300
          stat    = "Sum"
          region  = var.region
        }
      },
      {
        type   = "alarm"
        x      = 0
        y      = 12
        width  = 24
        height = 3
        properties = {
          title = "Statut des alarmes"
          alarms = [
            aws_cloudwatch_metric_alarm.ecs_cpu.arn,
            aws_cloudwatch_metric_alarm.ecs_memory.arn,
            aws_cloudwatch_metric_alarm.rds_cpu.arn,
            aws_cloudwatch_metric_alarm.alb_5xx.arn
          ]
        }
      }
    ]
  })
}
```

---

### Étape 8 : Definir les outputs

Créé le fichier `outputs.tf` :

```terraform
output "vpc_id" {
  description = "ID du VPC"
  value       = aws_vpc.main.id
}

output "alb_dns_name" {
  description = "DNS du load balancer (URL de l'application)"
  value       = aws_lb.main.dns_name
}

output "rds_endpoint" {
  description = "Endpoint de la base de donnees RDS"
  value       = aws_db_instance.main.endpoint
}

output "redis_endpoint" {
  description = "Endpoint du cache Redis"
  value       = aws_elasticache_cluster.main.cache_nodes[0].address
}

output "ecr_repository_url" {
  description = "URL du depot ECR"
  value       = aws_ecr_repository.app.repository_url
}

output "ecs_cluster_name" {
  description = "Nom du cluster ECS"
  value       = aws_ecs_cluster.main.name
}

output "cloudwatch_dashboard_url" {
  description = "URL du tableau de bord CloudWatch"
  value       = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#dashboards:name=${var.project_name}-dashboard"
}
```

---

### Étape 9 : Deployer l'infrastructure

```bash
# Creer le fichier de variables (ne pas commiter ce fichier)
cat > terraform.tfvars << 'EOF'
region        = "eu-west-3"
project_name  = "projet-cloud"
environment   = "dev"
db_username   = "app_user"
db_password   = "MonMotDePasse2025!"
app_image_tag = "1.0.0"
EOF

# Initialiser Terraform
terraform init

# Valider la syntaxe
terraform validate

# Previsualiser les changements
terraform plan

# Deployer (confirmation requise)
terraform apply
```

**Résultat attendu** :

```text
Apply complete! Resources: 25 added, 0 changed, 0 destroyed.

Outputs:

alb_dns_name         = "projet-cloud-alb-123456789.eu-west-3.elb.amazonaws.com"
cloudwatch_dashboard_url = "https://eu-west-3.console.aws.amazon.com/cloudwatch/..."
ecr_repository_url   = "123456789012.dkr.ecr.eu-west-3.amazonaws.com/projet-cloud-app"
ecs_cluster_name     = "projet-cloud-cluster"
rds_endpoint         = "projet-cloud-db.xxxxxxxxxxxx.eu-west-3.rds.amazonaws.com:5432"
redis_endpoint       = "projet-cloud-redis.xxxxxx.0001.euw3.cache.amazonaws.com"
vpc_id               = "vpc-0abc123def456ghi7"
```

---

### Étape 10 : Construire et déployer l'application

```bash
# Se connecter a ECR
aws ecr get-login-password --region eu-west-3 | \
  docker login --username AWS --password-stdin \
  $(terraform output -raw ecr_repository_url | cut -d'/' -f1)

# Construire l'image
docker build -t projet-cloud-app:1.0.0 .

# Taguer pour ECR
docker tag projet-cloud-app:1.0.0 \
  $(terraform output -raw ecr_repository_url):1.0.0

# Pousser vers ECR
docker push $(terraform output -raw ecr_repository_url):1.0.0
```

```bash
# Verifier que le service ECS est en cours d'execution
aws ecs describe-services \
  --cluster $(terraform output -raw ecs_cluster_name) \
  --services projet-cloud-service \
  --query "services[0].{Desired:desiredCount,Running:runningCount,Status:status}"
```

**Résultat attendu** :

```text
{
    "Desired": 2,
    "Running": 2,
    "Status": "ACTIVE"
}
```

```bash
# Tester l'application via le load balancer
curl http://$(terraform output -raw alb_dns_name)/health
```

**Résultat attendu** :

```text
{"status":"ok","timestamp":"2025-01-15T14:30:00.000Z"}
```

---

### Étape 11 : Detruire l'infrastructure

```bash
# Supprimer toutes les ressources
terraform destroy
```

Terraform affiche les 25 ressources qui vont être supprimees et demande confirmation. Verifie la liste avant de confirmer.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `terraform init` | Initialiser le projet |
| `terraform plan` | Previsualiser les changements |
| `terraform apply` | Deployer l'infrastructure |
| `terraform destroy` | Supprimer l'infrastructure |
| `terraform output` | Afficher les outputs (URL, endpoints) |
| `terraform state list` | Lister toutes les ressources deployees |
| `aws ecs describe-services --cluster <nom>` | Statut du service ECS |
| `aws logs tail /ecs/<nom> --follow` | Suivre les logs des conteneurs |
| `curl http://<alb-dns>/health` | Tester l'application |

---

## Pièges Frequents

### Piège 1 : Oublier la NAT Gateway pour les sous-réseaux prives

**Problème** : Les conteneurs ECS dans les sous-réseaux prives n'arrivent pas a telecharger l'image depuis ECR. Les tasks restent bloquees en statut "PROVISIONING".

**Solution** : Les sous-réseaux prives n'ont pas d'accès internet direct. La NAT Gateway (dans le sous-réseau public) permet le trafic sortant. Sans elle, ECS ne peut pas atteindre ECR, CloudWatch ou d'autres services AWS.

### Piège 2 : Security groups trop restrictifs entre les services

**Problème** : Les conteneurs ECS demarrent mais ne peuvent pas se connecter a la base de données RDS. L'application affiche "connection refused" ou "timeout".

**Solution** : Verifie la chaîne de security groups :

1. Le security group de RDS autorise le port 5432 depuis le security group d'ECS
2. Le security group d'ECS autorise le trafic sortant (port 5432 vers RDS, port 6379 vers Redis)
3. Les sous-réseaux sont dans le meme VPC

### Piège 3 : Mot de passe de base de données en dur dans le code Terraform

**Problème** : Tu écris le mot de passe directement dans le fichier `rds.tf`. Le fichier est commite dans Git. Le mot de passe est expose.

**Solution** : Utilise une variable sensible (`sensitive = true`) et passe la valeur via `terraform.tfvars` (ajoute ce fichier au `.gitignore`). En production, utilise AWS Secrets Manager ou SSM Parameter Store.

```terraform
# .gitignore
terraform.tfvars
*.tfstate
*.tfstate.backup
.terraform/
```

### Piège 4 : Ne pas configurer les health checks du load balancer

**Problème** : Le target group du load balancer ne detecte jamais les conteneurs comme sains (healthy). Le load balancer renvoie des erreurs 502.

**Solution** : Assure-toi que :

1. Le conteneur expose une route `/health` qui répond 200
2. Le health check du target group pointe vers cette route
3. Le port du health check correspond au port du conteneur (3000)
4. Le security group du conteneur autorise le trafic depuis le security group du load balancer

---

## Checklist de Validation

- [ ] Je sais concevoir une architecture cloud multi-couches (VPC, load balancer, conteneurs, base de données)
- [ ] Je sais écrire du code Terraform organise en fichiers par composant
- [ ] Je comprends le rôle de chaque security group et la chaîne d'accès entre les services
- [ ] Je sais déployer une application conteneurisee sur ECS Fargate
- [ ] Je sais configurer le monitoring avec des alarmes et un tableau de bord
- [ ] Je sais détruire proprement l'infrastructure pour éviter les coûts
- [ ] Je comprends les interactions entre tous les services (réseau, IAM, DNS, logs)

---

## Exercice Pratique

**Enonce** : Ameliore l'architecture du projet intégrateur en ajoutant les éléments suivants :

1. **Auto-scaling ECS** : Configure une politique d'auto-scaling qui :
   - Ajoute des tasks quand le CPU dépasse 70%
   - Retire des tasks quand le CPU passe sous 30%
   - Minimum : 2 tasks, maximum : 6 tasks

2. **Multi-AZ RDS** : Active la haute disponibilité sur l'instance RDS avec une replique dans une autre zone de disponibilité

3. **Alarme supplémentaire** : Ajoute une alarme sur la latence du load balancer (temps de réponse > 2 secondes pendant 5 minutes)

4. **Output supplémentaire** : Ajoute un output qui affiche l'URL complete du tableau de bord CloudWatch

**Indications** :

- Pour l'auto-scaling ECS, utilise les ressources `aws_appautoscaling_target` et `aws_appautoscaling_policy`
- Pour le Multi-AZ RDS, ajoute l'attribut `multi_az = true` a la ressource `aws_db_instance`
- Pour l'alarme de latence ALB, utilise la métrique `TargetResponseTime`
- Ajoute les nouvelles ressources dans les fichiers existants

**Résultat attendu** : L'infrastructure se deploie avec `terraform apply` sans erreur, l'auto-scaling est configure (visible dans la console ECS), et les 5 alarmes sont actives dans CloudWatch.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**1. Auto-scaling ECS** (a ajouter dans `ecs.tf`) :

```terraform
# Cible d'auto-scaling
resource "aws_appautoscaling_target" "ecs" {
  max_capacity       = 6
  min_capacity       = 2
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  scalable_dimension = "ecs:service:DesiredCount"
  service_namespace  = "ecs"
}

# Politique de scale up (CPU > 70%)
resource "aws_appautoscaling_policy" "ecs_scale_up" {
  name               = "${var.project_name}-scale-up"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.ecs.resource_id
  scalable_dimension = aws_appautoscaling_target.ecs.scalable_dimension
  service_namespace  = aws_appautoscaling_target.ecs.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
    target_value       = 70.0
    scale_in_cooldown  = 300
    scale_out_cooldown = 60
  }
}
```

**2. Multi-AZ RDS** (modifier dans `rds.tf`) :

```terraform
resource "aws_db_instance" "main" {
  # ... (parametres existants)
  multi_az = true
}
```

**3. Alarme de latence ALB** (a ajouter dans `monitoring.tf`) :

```terraform
resource "aws_cloudwatch_metric_alarm" "alb_latence" {
  alarm_name          = "${var.project_name}-alb-latence"
  alarm_description   = "Latence ALB > 2s pendant 5 min"
  namespace           = "AWS/ApplicationELB"
  metric_name         = "TargetResponseTime"
  statistic           = "Average"
  period              = 60
  evaluation_periods  = 5
  threshold           = 2
  comparison_operator = "GreaterThanThreshold"

  dimensions = {
    LoadBalancer = aws_lb.main.arn_suffix
  }

  alarm_actions = [aws_sns_topic.alarmes.arn]

  tags = {
    Name = "${var.project_name}-alb-latence-alarm"
  }
}
```

**4. Output supplémentaire** (a ajouter dans `outputs.tf`) :

```terraform
output "cloudwatch_alarms_url" {
  description = "URL de la page des alarmes CloudWatch"
  value       = "https://${var.region}.console.aws.amazon.com/cloudwatch/home?region=${var.region}#alarmsV2:"
}
```

**Vérification** :

```bash
terraform validate
terraform plan
terraform apply
```

Le plan doit afficher les nouvelles ressources (auto-scaling target, auto-scaling policy, alarme latence) a créer.

---

## Navigation

← Fiche précédente : **[09 - Monitoring cloud](09-monitoring-cloud.md)**

→ Fiche suivante : **[11 - Serverless : API Gateway + Lambda](11-serverless-api-gateway-lambda.md)**
