---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Infrastructure as Code avec Terraform : provider, resource, variable, output, state, plan et apply."
estimated_time: "90 min"
fiche_number: 6
total_fiches: 13
cursus: "Cloud"
---

# 06 - Infrastructure as Code

> **En bref** : Tu découvriras l'Infrastructure as Code (IaC) et tu apprendras a utiliser Terraform pour définir, previsualiser et déployer de l'infrastructure cloud de maniere declarative et reproductible. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [05 - IAM et sécurité](05-iam-securite.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

A la fin de cette fiche, tu sauras écrire un fichier Terraform pour créer des ressources cloud, utiliser les variables et les outputs, comprendre le state et exécuter le workflow plan/apply/destroy.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'Infrastructure as Code ?

**Définition** : L'Infrastructure as Code (IaC) est la pratique qui consiste a définir et gérer l'infrastructure (serveurs, réseaux, bases de données) sous forme de fichiers de code, au lieu de la configurer manuellement via des interfaces graphiques ou des commandes CLI.

**Le problème que l'IaC résout** :

Sans IaC, voici les problèmes rencontres :

1. **Non-reproductibilité** : Tu as créé ton infrastructure en cliquant dans la console. Quand tu dois recreer le meme environnement (staging, disaster recovery), tu ne te souviens plus de tous les paramètres.
2. **Pas de versionning** : Les modifications d'infrastructure ne sont pas tracees. Impossible de savoir qui a change quoi, quand, et pourquoi. Impossible de revenir en arriere.
3. **Erreurs humaines** : Chaque clic manuel est une occasion d'erreur. Un mauvais security group, un mauvais CIDR, un oubli de tag. Les erreurs sont frequentes et coûteuses.

**Comment l'IaC résout ces problèmes** :

| Problème | Solution apportée par l'IaC |
| --- | --- |
| Non-reproductibilité | L'infrastructure est définie dans des fichiers. Tu peux la recreer a l'identique en executant ces fichiers |
| Pas de versionning | Les fichiers sont dans Git. Chaque modification est un commit avec un auteur, une date et un message |
| Erreurs humaines | Le code est revu en Pull Request avant d'être applique. Les erreurs sont detectees avant le déploiement |

**Analogie concrète** : L'IaC, c'est comme un plan d'architecte. Au lieu de construire une maison "a l'oeil" (clics dans la console), tu dessines un plan detaille (code Terraform). Le plan est versionne, partageable, et un maçon (Terraform) peut construire exactement la même maison 10 fois de suite sans erreur.

**Ce que l'IaC n'est PAS** :

- L'IaC n'est pas de l'automatisation de scripts. Un script bash qui execute des commandes `aws ec2 run-instances` est de l'automatisation imperative ("fais ceci, puis cela"). L'IaC est declarative ("je veux cette infrastructure, debrouille-toi pour y arriver").
- L'IaC n'est pas seulement Terraform. Ansible, CloudFormation, Pulumi et Crossplane sont aussi des outils d'IaC. Terraform est le plus populaire pour le cloud multi-provider.

---

### Qu'est-ce que Terraform ?

**Définition** : Terraform est un outil d'Infrastructure as Code developpe par HashiCorp. Il utilise un langage declaratif (HCL - HashiCorp Configuration Language) pour définir l'infrastructure et interagit avec les fournisseurs cloud via leurs API.

**Concepts clés de Terraform** :

| Concept | Description |
| --- | --- |
| **Provider** | Plugin qui connecte Terraform a un service (AWS, Azure, GCP, etc.) |
| **Resource** | Un composant d'infrastructure (instance EC2, bucket S3, VPC, etc.) |
| **Variable** | Un paramètre configurable (region, taille d'instance, nom du projet) |
| **Output** | Une valeur exportee après le déploiement (IP publique, URL, etc.) |
| **State** | Un fichier qui stocke l'état actuel de l'infrastructure deployee |
| **Module** | Un ensemble de ressources réutilisable (comme une fonction en programmation) |

**Le workflow Terraform** :

```text
1. terraform init     - Telecharge les providers et initialise le projet
2. terraform plan     - Compare l'etat desire (code) avec l'etat actuel (state)
3. terraform apply    - Applique les changements necessaires
4. terraform destroy  - Supprime toute l'infrastructure definie
```

---

### Le langage HCL

**Syntaxe de base** :

```terraform
# Recuperer dynamiquement l'AMI Amazon Linux 2023 (evite les AMI ID obsoletes)
data "aws_ami" "al2023" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["al2023-ami-*-x86_64"]
  }
}

# Un bloc resource definit un composant d'infrastructure
resource "aws_instance" "web" {
  ami           = data.aws_ami.al2023.id
  instance_type = "t3.micro"

  tags = {
    Name = "serveur-web"
  }
}
```

Decomposition :

- `data` : mot-clé qui lit une information existante (ici l'AMI la plus recente)
- `resource` : mot-clé qui définit une ressource
- `"aws_instance"` : type de la ressource (instance EC2 sur AWS)
- `"web"` : nom local de la ressource (pour la referencer dans le code)
- `ami` : attribut de la ressource (identifiant de l'image, ici issu du data source)
- `instance_type` : attribut de la ressource (taille de l'instance)
- `tags` : attribut de type map (paires clé/valeur)

**Références entre ressources** :

```terraform
# Le security group est cree en premier
resource "aws_security_group" "web_sg" {
  name = "web-sg"
  # ...
}

# L'instance reference le security group et l'AMI resolue dynamiquement
resource "aws_instance" "web" {
  ami                    = data.aws_ami.al2023.id
  instance_type          = "t3.micro"
  vpc_security_group_ids = [aws_security_group.web_sg.id]
}
```

Terraform comprend automatiquement l'ordre de création : le security group doit être créé avant l'instance.

---

### Le state Terraform

**Définition** : Le state est un fichier JSON (`terraform.tfstate`) qui enregistre l'état actuel de l'infrastructure deployee. Terraform compare le state avec le code pour déterminer les changements a appliquer.

**Pourquoi le state est important** :

- Sans state, Terraform ne sait pas ce qui existe déjà. Il essaierait de créer des ressources qui existent déjà, ce qui provoquerait des erreurs.
- Le state permet a Terraform de savoir quelles ressources modifier, créer ou supprimer quand tu changes le code.

**State local vs state distant** :

| Type | Stockage | Cas d'usage |
| --- | --- | --- |
| Local | Fichier `terraform.tfstate` sur ton disque | Apprentissage, projets personnels |
| Distant (remote) | S3, Azure Blob, GCS, Terraform Cloud | Équipe, production |

Pour le travail en équipe, le state distant est obligatoire. Il garantit que tous les membres de l'équipe travaillent sur le meme état.

---

## Étapes Pratiques

### Étape 1 : Installer Terraform

```bash
# Sur macOS avec Homebrew
brew tap hashicorp/tap
brew install hashicorp/tap/terraform

# Sur Linux (Debian/Ubuntu)
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform

# Verifier l'installation
terraform version
```

**Résultat attendu** (la version mineure évolue ; en août 2026 le binaire HashiCorp courant est 1.15.x) :

```text
Terraform v1.15.x
on darwin_arm64
```

---

### Étape 2 : Creer le premier projet Terraform

> **Note - provider AWS v6** : Le provider AWS v6.0 est généralement disponible depuis juin 2025 (annonce HashiCorp du 18 juin 2025). En v6, l'argument `region` est _optionnel_ sur la plupart des ressources : s'il est omis, Terraform reprend la région du bloc `provider`. Il n'est pas obligatoire de le répéter sur chaque ressource. La contrainte `~> 6.0` ci-dessous cible cette série. Si tu dois rester sur v5, utilise `version = "~> 5.0"`.

```bash
# Creer un dossier pour le projet
mkdir -p ~/terraform-demo && cd ~/terraform-demo
```

Créé le fichier `main.tf` :

```terraform
# Configuration du provider AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.9.0"
}

# Configuration du provider
provider "aws" {
  region = "eu-west-3"
}

# Creer un bucket S3
resource "aws_s3_bucket" "demo" {
  bucket = "mon-bucket-terraform-demo-2025"

  tags = {
    Name        = "demo-terraform"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

# Activer le versioning sur le bucket
resource "aws_s3_bucket_versioning" "demo" {
  bucket = aws_s3_bucket.demo.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

---

### Étape 3 : Initialiser le projet

```bash
# Initialiser Terraform (telecharge le provider AWS)
terraform init
```

**Résultat attendu** :

```text
Initializing the backend...
Initializing provider plugins...
- Finding hashicorp/aws versions matching "~> 6.0"...
- Installing hashicorp/aws v6.x.x...
- Installed hashicorp/aws v6.x.x (signed by HashiCorp)

Terraform has been successfully initialized!
```

---

### Étape 4 : Previsualiser les changements

```bash
# Voir ce que Terraform va creer
terraform plan
```

**Résultat attendu** :

```text
Terraform will perform the following actions:

  # aws_s3_bucket.demo will be created
  + resource "aws_s3_bucket" "demo" {
      + bucket = "mon-bucket-terraform-demo-2025"
      + id     = (known after apply)
      + tags   = {
          + "Environment" = "dev"
          + "ManagedBy"   = "terraform"
          + "Name"        = "demo-terraform"
        }
    }

  # aws_s3_bucket_versioning.demo will be created
  + resource "aws_s3_bucket_versioning" "demo" {
      + bucket = (known after apply)
      + versioning_configuration {
          + status = "Enabled"
        }
    }

Plan: 2 to add, 0 to change, 0 to destroy.
```

Le plan montre exactement ce que Terraform va faire. Le symbole `+` indique une création, `~` une modification, `-` une suppression.

---

### Étape 5 : Appliquer les changements

```bash
# Appliquer le plan (cree les ressources)
terraform apply
```

Terraform affiche le plan et demande confirmation :

```text
Do you want to perform these actions?
  Terraform will perform the actions described above.
  Only 'yes' will be accepted to approve.

  Enter a value: yes
```

**Résultat attendu** :

```text
aws_s3_bucket.demo: Creating...
aws_s3_bucket.demo: Creation complete after 3s [id=mon-bucket-terraform-demo-2025]
aws_s3_bucket_versioning.demo: Creating...
aws_s3_bucket_versioning.demo: Creation complete after 1s

Apply complete! Resources: 2 added, 0 changed, 0 destroyed.
```

---

### Étape 6 : Utiliser les variables et les outputs

Créé le fichier `variables.tf` :

```terraform
variable "region" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-3"
}

variable "environment" {
  description = "Nom de l'environnement"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "demo-terraform"
}
```

Créé le fichier `outputs.tf` :

```terraform
output "bucket_name" {
  description = "Nom du bucket S3"
  value       = aws_s3_bucket.demo.bucket
}

output "bucket_arn" {
  description = "ARN du bucket S3"
  value       = aws_s3_bucket.demo.arn
}

output "bucket_region" {
  description = "Region du bucket S3"
  value       = aws_s3_bucket.demo.region
}
```

Modifie `main.tf` pour utiliser les variables :

```terraform
provider "aws" {
  region = var.region
}

resource "aws_s3_bucket" "demo" {
  bucket = "${var.project_name}-${var.environment}-2025"

  tags = {
    Name        = var.project_name
    Environment = var.environment
    ManagedBy   = "terraform"
  }
}
```

Applique et verifie les outputs :

```bash
# Appliquer les changements
terraform apply -auto-approve

# Voir les outputs
terraform output
```

**Résultat attendu** :

```text
bucket_arn    = "arn:aws:s3:::demo-terraform-dev-2025"
bucket_name   = "demo-terraform-dev-2025"
bucket_region = "eu-west-3"
```

---

### Étape 7 : Inspecter le state

```bash
# Lister les ressources dans le state
terraform state list

# Voir les details d'une ressource
terraform state show aws_s3_bucket.demo
```

**Résultat attendu** :

```text
aws_s3_bucket.demo
aws_s3_bucket_versioning.demo
```

```text
# aws_s3_bucket.demo:
resource "aws_s3_bucket" "demo" {
    bucket = "demo-terraform-dev-2025"
    id     = "demo-terraform-dev-2025"
    region = "eu-west-3"
    tags   = {
        "Environment" = "dev"
        "ManagedBy"   = "terraform"
        "Name"        = "demo-terraform"
    }
}
```

---

### Étape 8 : Detruire l'infrastructure

```bash
# Supprimer toutes les ressources
terraform destroy
```

Terraform affiche les ressources qui vont être supprimees et demande confirmation :

```text
Plan: 0 to add, 0 to change, 2 to destroy.

Do you really want to destroy all resources?
  Terraform will destroy all your managed infrastructure, as shown above.
  Only 'yes' will be accepted to confirm.

  Enter a value: yes
```

**Résultat attendu** :

```text
aws_s3_bucket_versioning.demo: Destroying...
aws_s3_bucket_versioning.demo: Destruction complete after 1s
aws_s3_bucket.demo: Destroying...
aws_s3_bucket.demo: Destruction complete after 2s

Destroy complete! Resources: 2 destroyed.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `terraform init` | Initialiser un projet (telecharger les providers) |
| `terraform plan` | Previsualiser les changements |
| `terraform apply` | Appliquer les changements |
| `terraform destroy` | Supprimer toute l'infrastructure |
| `terraform fmt` | Formater les fichiers HCL |
| `terraform validate` | Valider la syntaxe des fichiers |
| `terraform state list` | Lister les ressources dans le state |
| `terraform state show <resource>` | Afficher les détails d'une ressource |
| `terraform output` | Afficher les outputs |
| `terraform providers` | Lister les providers utilises |

---

## Pièges Frequents

### Piège 1 : Modifier l'infrastructure dans la console après un deploy Terraform

**Problème** : Tu deploies une instance EC2 avec Terraform, puis tu changes son security group manuellement dans la console AWS. Au prochain `terraform plan`, Terraform detecte la difference et veut revenir a la configuration définie dans le code. Tu perds ta modification manuelle.

**Solution** : Ne modifie jamais l'infrastructure manuellement quand elle est geree par Terraform. Toutes les modifications doivent passer par le code. Si tu as modifie manuellement, utilise `terraform import` pour synchroniser le state ou mets a jour le code.

### Piège 2 : Commiter le fichier terraform.tfstate dans Git

**Problème** : Le state contient des informations sensibles (mots de passe, clés d'accès, IP internes). Le commiter dans un dépôt Git expose ces informations.

**Solution** : Ajoute `*.tfstate` et `*.tfstate.backup` a ton `.gitignore`. Pour le travail en équipe, utilise un backend distant (S3 + DynamoDB pour le verrouillage).

```bash
# .gitignore
*.tfstate
*.tfstate.backup
.terraform/
```

### Piège 3 : Oublier terraform destroy sur un environnement de test

**Problème** : Tu créés une infrastructure de test et tu oublies de la supprimer. Les ressources cloud continuent de facturer.

**Solution** : Après chaque session de test, execute `terraform destroy`. Utilise des tags `Environment = "test"` pour identifier facilement les ressources temporaires. Configure des alertes de facturation sur AWS.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est l'Infrastructure as Code et ses avantages
- [ ] Je sais installer et configurer Terraform
- [ ] Je sais écrire un fichier `main.tf` avec un provider et des ressources
- [ ] Je comprends le workflow init/plan/apply/destroy
- [ ] Je sais utiliser les variables et les outputs
- [ ] Je comprends le rôle du state et je sais l'inspecter

---

## Exercice Pratique

**Enonce** : Écris une configuration Terraform qui créé l'infrastructure suivante :

1. Un VPC avec le CIDR `10.0.0.0/16`
2. Un sous-réseau public avec le CIDR `10.0.1.0/24` dans la zone `eu-west-3a`
3. Un security group qui autorise le HTTP (port 80) depuis n'importe ou
4. Un bucket S3 avec le versioning active

Utilise des variables pour :

- La region (défaut : `eu-west-3`)
- Le CIDR du VPC (défaut : `10.0.0.0/16`)
- Le nom du projet (défaut : `exercice-terraform`)

Créé des outputs pour :

- L'ID du VPC
- L'ID du sous-réseau
- Le nom du bucket S3

**Indications** :

- Commence par le fichier `variables.tf`
- Puis le `main.tf` avec le provider et les ressources
- Termine par le fichier `outputs.tf`
- Utilise `terraform validate` pour vérifier la syntaxe avant `plan`

**Résultat attendu** : Trois fichiers (`variables.tf`, `main.tf`, `outputs.tf`) qui passent `terraform validate` et `terraform plan` sans erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**variables.tf** :

```terraform
variable "region" {
  description = "Region AWS"
  type        = string
  default     = "eu-west-3"
}

variable "vpc_cidr" {
  description = "CIDR du VPC"
  type        = string
  default     = "10.0.0.0/16"
}

variable "project_name" {
  description = "Nom du projet"
  type        = string
  default     = "exercice-terraform"
}
```

**main.tf** :

```terraform
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
  required_version = ">= 1.9.0"
}

provider "aws" {
  region = var.region
}

# VPC
resource "aws_vpc" "main" {
  cidr_block = var.vpc_cidr

  tags = {
    Name      = "${var.project_name}-vpc"
    ManagedBy = "terraform"
  }
}

# Sous-reseau public
resource "aws_subnet" "public" {
  vpc_id            = aws_vpc.main.id
  cidr_block        = "10.0.1.0/24"
  availability_zone = "${var.region}a"

  tags = {
    Name      = "${var.project_name}-public"
    ManagedBy = "terraform"
  }
}

# Security group HTTP
resource "aws_security_group" "web" {
  name        = "${var.project_name}-web-sg"
  description = "Autorise le trafic HTTP"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name      = "${var.project_name}-web-sg"
    ManagedBy = "terraform"
  }
}

# Bucket S3
resource "aws_s3_bucket" "data" {
  bucket = "${var.project_name}-data-2025"

  tags = {
    Name      = "${var.project_name}-data"
    ManagedBy = "terraform"
  }
}

# Versioning S3
resource "aws_s3_bucket_versioning" "data" {
  bucket = aws_s3_bucket.data.id

  versioning_configuration {
    status = "Enabled"
  }
}
```

**outputs.tf** :

```terraform
output "vpc_id" {
  description = "ID du VPC"
  value       = aws_vpc.main.id
}

output "subnet_id" {
  description = "ID du sous-reseau public"
  value       = aws_subnet.public.id
}

output "bucket_name" {
  description = "Nom du bucket S3"
  value       = aws_s3_bucket.data.bucket
}
```

Vérification :

```bash
terraform init
terraform validate
terraform plan
```

---

## Navigation

← Fiche précédente : **[05 - IAM et sécurité](05-iam-securite.md)**

→ Fiche suivante : **[07 - Bases de données cloud](07-bases-de-donnees-cloud.md)**
