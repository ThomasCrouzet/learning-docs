---
tags:
  - Méthodologie
  - Débutant
  - Pratique
description: "03 - L'Infrastructure as Code (IaC)"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 5
cursus: "Cloud computing"
---

# 03 - L'Infrastructure as Code (IaC)

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est l'Infrastructure as Code, pourquoi elle est essentielle dans le cloud, et tu connaîtras les outils principaux (Terraform, Ansible) pour automatiser le déploiement d'infrastructure. Lecture estimée : 45 min.


## Prérequis

- Fiche **[01 - Introduction au Cloud Computing](01-introduction-cloud.md)**
- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (Docker)
- Notions de base en ligne de commande

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est l'Infrastructure as Code, pourquoi elle est essentielle dans le cloud, et tu connaîtras les outils principaux (Terraform, Ansible) pour automatiser le déploiement d'infrastructure.

---

## Concepts

### Qu'est-ce que l'Infrastructure as Code (IaC) ?

**Définition** : L'Infrastructure as Code est une pratique qui consiste à définir et gérer l'infrastructure informatique (serveurs, réseaux, bases de données) à travers des fichiers de configuration plutôt que par des actions manuelles.

**Le problème que l'IaC résout** :

Sans IaC, voici les problèmes rencontrés :

1. **Configuration manuelle** : Chaque serveur est configuré à la main, ce qui prend du temps.
2. **Drift de configuration** : Les serveurs divergent au fil du temps (modifications non documentées).
3. **Non-reproductibilité** : Impossible de recréer un environnement identique.
4. **Erreurs humaines** : Oublis, fautes de frappe dans les configurations.
5. **Pas de versioning** : Aucun historique des changements d'infrastructure.

**Comment l'IaC résout ces problèmes** :

| Problème | Solution IaC |
| -------- | ------------ |
| Configuration manuelle | Automatisation complète |
| Drift de configuration | État désiré déclaré et appliqué |
| Non-reproductibilité | Même fichier = même infrastructure |
| Erreurs humaines | Code révisable et testable |
| Pas de versioning | Fichiers dans Git |

**Analogie concrète** : L'IaC est comme un plan d'architecte pour une maison. Au lieu de construire chaque maison différemment selon l'humeur du maçon, tu as un plan précis. Avec ce plan, n'importe qui peut construire la même maison. Et si tu veux modifier quelque chose, tu modifies le plan, pas la maison directement.

---

### Quels sont les types d'outils IaC ?

| Type | Objectif | Exemples |
| ---- | -------- | -------- |
| **Provisioning** | Créer l'infrastructure | Terraform, CloudFormation, Pulumi |
| **Configuration** | Configurer les serveurs | Ansible, Chef, Puppet, Salt |
| **Conteneurs** | Définir les environnements | Docker, Podman |
| **Orchestration** | Gérer les conteneurs | Kubernetes, Docker Swarm |

**Terraform vs Ansible** :

| Aspect | Terraform | Ansible |
| ------ | --------- | ------- |
| Objectif | Créer l'infrastructure | Configurer les serveurs |
| Approche | Déclarative | Impérative/Déclarative |
| État | Gère un fichier d'état | Sans état |
| Langage | HCL (HashiCorp Configuration Language) | YAML |
| Exemple d'usage | Créer une VM EC2 | Installer Nginx sur la VM |

**Complémentarité** : En pratique, on utilise souvent les deux :

1. Terraform crée les serveurs
2. Ansible les configure

---

### Qu'est-ce que l'approche déclarative vs impérative ?

| Approche | Description | Exemple |
| -------- | ----------- | ------- |
| **Impérative** | Tu décris **comment** faire | "Crée un serveur, installe Nginx, démarre le service" |
| **Déclarative** | Tu décris **ce que** tu veux | "Je veux un serveur avec Nginx actif" |

**Avantage de l'approche déclarative** : L'outil calcule lui-même les actions nécessaires pour atteindre l'état désiré. Si Nginx est déjà installé, il ne fait rien.

---

### Qu'est-ce que l'idempotence ?

**Définition** : Une opération est idempotente si l'exécuter plusieurs fois produit le même résultat que l'exécuter une seule fois.

**Exemple** :

| Opération | Idempotente ? | Explication |
| --------- | ------------- | ----------- |
| `apt install nginx` | Oui | Si déjà installé, ne fait rien |
| `echo "config" >> file` | Non | Ajoute une ligne à chaque exécution |
| Terraform apply | Oui | N'applique que les différences |

**Pourquoi c'est important** : Tu peux relancer ton code IaC sans crainte de casser quelque chose.

---

## Étapes Pratiques

### Étape 1 : Comprendre la structure d'un projet Terraform

```text
mon-projet-terraform/
├── main.tf           # Ressources principales
├── variables.tf      # Variables d'entrée
├── outputs.tf        # Valeurs de sortie
├── terraform.tfvars  # Valeurs des variables
└── providers.tf      # Configuration des providers
```

**Fichier main.tf basique** :

```hcl
# providers.tf - Configuration du provider AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}
```

```hcl
# variables.tf - Définition des variables
variable "aws_region" {
  description = "Région AWS"
  type        = string
  default     = "eu-west-3"
}

variable "instance_type" {
  description = "Type d'instance EC2"
  type        = string
  default     = "t3.micro"
}

variable "environment" {
  description = "Environnement (dev, staging, prod)"
  type        = string
}
```

```hcl
# main.tf - Ressources
resource "aws_instance" "web_server" {
  ami           = "ami-0123456789abcdef0"
  instance_type = var.instance_type

  tags = {
    Name        = "web-server-${var.environment}"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

resource "aws_security_group" "web_sg" {
  name        = "web-sg-${var.environment}"
  description = "Security group pour serveur web"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

```hcl
# outputs.tf - Sorties
output "instance_public_ip" {
  description = "IP publique de l'instance"
  value       = aws_instance.web_server.public_ip
}

output "instance_id" {
  description = "ID de l'instance"
  value       = aws_instance.web_server.id
}
```

---

### Étape 2 : Utiliser Terraform

```bash
# Initialiser le projet (télécharge les providers)
terraform init

# Voir ce que Terraform va faire (sans appliquer)
terraform plan

# Appliquer les changements
terraform apply

# Appliquer sans confirmation interactive
terraform apply -auto-approve

# Détruire l'infrastructure
terraform destroy

# Formater le code
terraform fmt

# Valider la syntaxe
terraform validate
```

**Cycle de vie Terraform** :

```text
1. terraform init     → Initialise le projet
        ↓
2. terraform plan     → Montre les changements prévus
        ↓
3. terraform apply    → Applique les changements
        ↓
4. terraform destroy  → Supprime tout (optionnel)
```

---

### Étape 3 : Comprendre la structure d'un projet Ansible

```text
mon-projet-ansible/
├── inventory/
│   ├── production.yml    # Serveurs de production
│   └── staging.yml       # Serveurs de staging
├── playbooks/
│   ├── deploy.yml        # Playbook de déploiement
│   └── setup.yml         # Playbook de configuration
├── roles/
│   └── webserver/
│       ├── tasks/
│       │   └── main.yml
│       ├── handlers/
│       │   └── main.yml
│       ├── templates/
│       │   └── nginx.conf.j2
│       └── defaults/
│           └── main.yml
└── ansible.cfg           # Configuration Ansible
```

---

### Étape 4 : Écrire un playbook Ansible

```yaml
# inventory/staging.yml
all:
  hosts:
    web1:
      ansible_host: 192.168.1.10
      ansible_user: ubuntu
    web2:
      ansible_host: 192.168.1.11
      ansible_user: ubuntu
  vars:
    ansible_python_interpreter: /usr/bin/python3
```

```yaml
# playbooks/setup.yml
---
- name: Configuration des serveurs web
  hosts: all
  become: yes  # Exécuter en sudo

  vars:
    app_name: mon-application
    app_port: 8080

  tasks:
    - name: Mettre à jour les paquets
      apt:
        update_cache: yes
        upgrade: dist

    - name: Installer les paquets nécessaires
      apt:
        name:
          - nginx
          - python3
          - git
        state: present

    - name: Copier la configuration Nginx
      template:
        src: templates/nginx.conf.j2
        dest: /etc/nginx/sites-available/{{ app_name }}
      notify: Redémarrer Nginx

    - name: Activer le site
      file:
        src: /etc/nginx/sites-available/{{ app_name }}
        dest: /etc/nginx/sites-enabled/{{ app_name }}
        state: link
      notify: Redémarrer Nginx

    - name: S'assurer que Nginx est démarré
      service:
        name: nginx
        state: started
        enabled: yes

  handlers:
    - name: Redémarrer Nginx
      service:
        name: nginx
        state: restarted
```

```nginx
# templates/nginx.conf.j2
server {
    listen 80;
    server_name {{ ansible_host }};

    location / {
        proxy_pass http://127.0.0.1:{{ app_port }};
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

### Étape 5 : Utiliser Ansible

```bash
# Tester la connexion aux serveurs
ansible all -i inventory/staging.yml -m ping

# Exécuter un playbook
ansible-playbook -i inventory/staging.yml playbooks/setup.yml

# Exécuter en mode dry-run (vérifie sans appliquer)
ansible-playbook -i inventory/staging.yml playbooks/setup.yml --check

# Exécuter avec plus de détails
ansible-playbook -i inventory/staging.yml playbooks/setup.yml -v

# Limiter à un seul serveur
ansible-playbook -i inventory/staging.yml playbooks/setup.yml --limit web1

# Exécuter une commande ad-hoc
ansible all -i inventory/staging.yml -m shell -a "uptime"
```

---

### Étape 6 : Bonnes pratiques IaC

```yaml
# Utiliser des variables pour les valeurs réutilisables
# ansible/group_vars/all.yml
---
common_packages:
  - htop
  - vim
  - curl
  - wget

timezone: Europe/Paris

ntp_servers:
  - 0.fr.pool.ntp.org
  - 1.fr.pool.ntp.org
```

```hcl
# Terraform : utiliser des modules pour réutiliser le code
# modules/ec2-instance/main.tf
variable "name" {}
variable "instance_type" {}
variable "ami" {}

resource "aws_instance" "this" {
  ami           = var.ami
  instance_type = var.instance_type

  tags = {
    Name = var.name
  }
}

output "instance_id" {
  value = aws_instance.this.id
}

# Utilisation du module
module "web_server" {
  source        = "./modules/ec2-instance"
  name          = "web-server"
  instance_type = "t3.micro"
  ami           = "ami-0123456789"
}
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `terraform init` | Initialiser un projet Terraform |
| `terraform plan` | Voir les changements prévus |
| `terraform apply` | Appliquer les changements |
| `terraform destroy` | Détruire l'infrastructure |
| `terraform fmt` | Formater le code |
| `ansible-playbook -i inventory playbook.yml` | Exécuter un playbook |
| `ansible all -m ping` | Tester la connexion |
| `ansible-vault encrypt file.yml` | Chiffrer un fichier de secrets |

---

## Pièges Fréquents

### Piège 1 : Modifier l'infrastructure manuellement

⚠️ **Problème** : Modifier un serveur via la console AWS crée un décalage avec le code Terraform.

✅ **Solution** : Toujours modifier via le code, jamais manuellement. Si le state a dérivé, utiliser `terraform apply -refresh-only` (la commande `terraform refresh` est retirée des workflows récents).

---

### Piège 2 : Stocker le state Terraform localement

⚠️ **Problème** : Le fichier `terraform.tfstate` contient des secrets et peut être perdu.

✅ **Solution** : Utiliser un backend distant (S3, Azure Blob, etc.).

```hcl
terraform {
  backend "s3" {
    bucket = "mon-bucket-tfstate"
    key    = "prod/terraform.tfstate"
    region = "eu-west-3"
  }
}
```

---

### Piège 3 : Secrets en clair dans le code

⚠️ **Problème** : Mots de passe et clés API visibles dans Git.

✅ **Solution** : Utiliser des variables d'environnement ou un gestionnaire de secrets.

```bash
# Variables d'environnement pour Terraform
export TF_VAR_db_password="mon_secret"

# Ansible Vault pour les secrets
ansible-vault create secrets.yml
```

---

### Piège 4 : Ne pas versionner le code IaC

⚠️ **Problème** : Impossible de revenir en arrière ou de collaborer.

✅ **Solution** : Tout le code IaC dans Git (sauf les fichiers d'état et secrets).

```text
# .gitignore pour Terraform
*.tfstate
*.tfstate.backup
.terraform/
*.tfvars  # Si contient des secrets
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre provisioning et configuration
- [ ] Je connais la différence entre Terraform et Ansible
- [ ] Je sais ce qu'est l'idempotence
- [ ] Je sais écrire un fichier Terraform basique
- [ ] Je sais écrire un playbook Ansible
- [ ] Je comprends l'importance de versionner l'IaC

---

## Exercice Pratique

**Énoncé** : Écris un playbook Ansible qui :

1. Installe Docker sur un serveur Ubuntu
2. Crée un réseau Docker nommé "app-network"
3. Lance un conteneur Nginx sur ce réseau

**Résultat attendu** : Un fichier `playbook.yml` fonctionnel.

---

## Solution de l'Exercice

```yaml
# playbook.yml
---
- name: Installation Docker et déploiement Nginx
  hosts: all
  become: yes

  vars:
    docker_network: app-network
    nginx_container_name: nginx-web

  tasks:
    - name: Installer les prérequis
      apt:
        name:
          - apt-transport-https
          - ca-certificates
          - curl
          - gnupg
          - lsb-release
        state: present
        update_cache: yes

    - name: Créer le dossier des trousseaux de clés APT
      ansible.builtin.file:
        path: /etc/apt/keyrings
        state: directory
        mode: "0755"

    # Le module apt_key est déprécié depuis ansible-core 2.13 :
    # on télécharge la clé et on la convertit en trousseau dearmored
    - name: Télécharger et convertir la clé GPG Docker
      ansible.builtin.get_url:
        url: https://download.docker.com/linux/ubuntu/gpg
        dest: /etc/apt/keyrings/docker.asc
        mode: "0644"

    - name: Ajouter le repository Docker (signé par le trousseau)
      ansible.builtin.apt_repository:
        repo: "deb [arch=amd64 signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu {{ ansible_distribution_release }} stable"
        state: present
        filename: docker

    - name: Installer Docker
      apt:
        name:
          - docker-ce
          - docker-ce-cli
          - containerd.io
        state: present
        update_cache: yes

    - name: S'assurer que Docker est démarré
      service:
        name: docker
        state: started
        enabled: yes

    - name: Installer le module Docker pour Python
      pip:
        name: docker
        state: present

    - name: Créer le réseau Docker
      docker_network:
        name: "{{ docker_network }}"
        state: present

    - name: Lancer le conteneur Nginx
      docker_container:
        name: "{{ nginx_container_name }}"
        image: nginx:latest
        state: started
        restart_policy: unless-stopped
        networks:
          - name: "{{ docker_network }}"
        ports:
          - "80:80"
```

**Pour exécuter** :

```bash
ansible-playbook -i inventory.yml playbook.yml
```

---

## Navigation

← Fiche précédente : **[02 - Les Tests d'Intrusion (Pentest)](02-tests-intrusion-pentest.md)**

→ Fiche suivante : **[04 - Le Déploiement Continu (CI/CD)](04-deploiement-continu.md)**
