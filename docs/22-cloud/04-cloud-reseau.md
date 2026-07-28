---
tags:
  - Cloud
  - Intermédiaire
  - Concept
description: "Réseau cloud : VPC, sous-réseaux, security groups, load balancers, CDN (CloudFront) et DNS (Route 53)."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 13
cursus: "Cloud"
---

# 04 - Réseau cloud

> **En bref** : Tu découvriras comment créer un réseau virtuel (VPC) dans le cloud, configurer des sous-réseaux publics et prives, protéger tes ressources avec les security groups, distribuer le trafic avec un load balancer et accelerer la diffusion avec un CDN. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [03 - Stockage](03-cloud-stockage.md)
- Comprendre les bases du réseau (IP, sous-réseaux, ports) - cursus [Réseaux](../20-reseaux/index.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras créer un VPC avec des sous-réseaux publics et prives, configurer des security groups, mettre en place un load balancer et comprendre le rôle d'un CDN et du DNS manage.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un VPC ?

**Définition** : Un VPC (Virtual Private Cloud) est un réseau virtuel isole dans le cloud. C'est ton propre espace réseau prive, complètement separe des autres clients du fournisseur cloud. Tu decides de la plage d'adresses IP, tu créés des sous-réseaux, tu configures les règles de routage et de sécurité.

**Le problème que le VPC résout** :

Sans VPC, voici les problèmes rencontres :

1. **Pas d'isolation** : Toutes tes ressources cloud sont sur le meme réseau partage avec d'autres clients. N'importe quelle machine pourrait théoriquement communiquer avec la tienne.
2. **Pas de controle réseau** : Tu ne peux pas définir tes propres plages d'adresses IP, tes règles de routage ou tes politiques de sécurité réseau.
3. **Architecture plate** : Impossible de séparer les serveurs web (accessibles au public) des bases de données (qui ne doivent pas être accessibles depuis Internet).

**Comment le VPC résout ces problèmes** :

| Problème | Solution apportée par le VPC |
| --- | --- |
| Pas d'isolation | Le VPC est un réseau isole. Les autres clients ne voient pas tes ressources |
| Pas de controle réseau | Tu définis tes plages IP (CIDR), tes tables de routage et tes règles de sécurité |
| Architecture plate | Tu créés des sous-réseaux publics (web) et prives (BDD) avec des règles d'accès distinctes |

**Analogie concrète** : Un VPC, c'est comme un terrain cloture. Tu possedes un terrain dans un lotissement (le cloud). La cloture (l'isolation du VPC) empêche les voisins d'entrer. A l'intérieur, tu organises ton terrain comme tu veux : la maison a l'avant avec un accès depuis la rue (sous-réseau public), le jardin prive a l'arriere sans accès direct (sous-réseau prive), et un portail avec un gardien qui controle les entrées (security group).

**Ce qu'un VPC n'est PAS** :

- Un VPC n'est pas un VPN. Un VPN est un tunnel chiffre pour connecter deux réseaux. Un VPC est un réseau virtuel dans le cloud. Tu peux connecter un VPN a un VPC, mais ce sont deux choses différentes.
- Un VPC n'est pas un sous-réseau. Le VPC est le conteneur. Les sous-réseaux sont des divisions a l'intérieur du VPC.

---

### Sous-réseaux publics et prives

**Définition** : Un sous-réseau (subnet) est une subdivision d'un VPC. Chaque sous-réseau occupe une plage d'adresses IP a l'intérieur du CIDR du VPC et est associe a une zone de disponibilité.

**Sous-réseau public** :

Un sous-réseau est public quand sa table de routage contient une route vers une Internet Gateway. Les ressources dans un sous-réseau public peuvent communiquer directement avec Internet (si elles ont une IP publique).

Cas d'usage : serveurs web, load balancers, bastions SSH.

**Sous-réseau prive** :

Un sous-réseau est prive quand il n'a pas de route directe vers Internet. Les ressources dans un sous-réseau prive ne sont pas accessibles depuis Internet.

Cas d'usage : bases de données, serveurs d'applications internes, caches.

**NAT Gateway** :

Pour qu'une ressource dans un sous-réseau prive puisse accéder a Internet (par exemple pour telecharger des mises à jour), tu utilises une NAT Gateway placee dans un sous-réseau public. La ressource prive envoie son trafic a la NAT Gateway, qui transmet la requête a Internet. La réponse revient par le meme chemin.

```text
Internet
    |
Internet Gateway
    |
Sous-reseau public (10.0.1.0/24)
    |--- Serveur web (IP publique)
    |--- NAT Gateway
    |
Sous-reseau prive (10.0.2.0/24)
    |--- Base de donnees (IP privee uniquement)
    |--- Serveur d'application (IP privee, sort via NAT)
```

**Zones de disponibilité** :

Chaque region cloud est divisee en plusieurs zones de disponibilité (AZ). Chaque AZ est un datacenter physiquement separe des autres. Pour la haute disponibilité, tu deploies tes sous-réseaux dans au moins deux AZ différentes.

| Region | Zones de disponibilité |
| --- | --- |
| eu-west-3 (Paris) | eu-west-3a, eu-west-3b, eu-west-3c |
| us-east-1 (Virginie) | us-east-1a, us-east-1b, ..., us-east-1f |

---

### Security Groups et Network ACLs

**Security Group** :

Un security group est un pare-feu virtuel qui controle le trafic entrant (inbound) et sortant (outbound) d'une ressource. Il fonctionne au niveau de l'instance (de la machine virtuelle ou du service).

Règles par défaut :

- **Inbound** : tout le trafic entrant est bloque
- **Outbound** : tout le trafic sortant est autorise

Caractéristiques :

- **Stateful** : si tu autorises le trafic entrant sur le port 80, les réponses sont automatiquement autorisées en sortie (pas besoin de règle outbound supplémentaire)
- Tu autorises uniquement (pas de règle de refus explicite)
- Tu peux referencer un autre security group comme source (au lieu d'une adresse IP)

Exemple de règles pour un serveur web :

| Direction | Protocole | Port | Source | Description |
| --- | --- | --- | --- | --- |
| Inbound | TCP | 80 | 0.0.0.0/0 | HTTP depuis n'importe ou |
| Inbound | TCP | 443 | 0.0.0.0/0 | HTTPS depuis n'importe ou |
| Inbound | TCP | 22 | 10.0.0.0/16 | SSH depuis le VPC uniquement |
| Outbound | Tout | Tout | 0.0.0.0/0 | Tout le trafic sortant |

**Network ACL** :

Une Network ACL (Access Control List) est un pare-feu au niveau du sous-réseau. A la difference d'un security group, une Network ACL est **stateless** (tu dois définir les règles inbound ET outbound) et elle supporte les règles de refus explicite.

**Comparaison Security Group vs Network ACL** :

| Critère | Security Group | Network ACL |
| --- | --- | --- |
| Niveau | Instance | Sous-réseau |
| Stateful | Oui | Non |
| Règles de refus | Non | Oui |
| Evaluation | Toutes les règles | Par ordre de priorité |
| Par défaut | Tout bloque (inbound) | Tout autorise |

---

### Load Balancers

**Définition** : Un load balancer (equilibreur de charge) distribue le trafic entrant entre plusieurs instances backend. Il garantit la haute disponibilité (si une instance tombe, le trafic est redirige vers les autres) et ameliore les performances (la charge est repartie).

**Types de load balancers AWS** :

| Type | Couche OSI | Usage |
| --- | --- | --- |
| Application Load Balancer (ALB) | Couche 7 (HTTP/HTTPS) | Applications web, APIs REST, microservices |
| Network Load Balancer (NLB) | Couche 4 (TCP/UDP) | Performances extrêmes, trafic non-HTTP |
| Gateway Load Balancer (GWLB) | Couche 3 | Appliances réseau (firewall, IDS) |

L'ALB est le plus utilise. Il permet le routage base sur l'URL, les en-tetes HTTP, les cookies et le hostname.

```text
Client
  |
  v
ALB (port 443, HTTPS)
  |--- /api/*     --> Groupe cible "api" (3 instances)
  |--- /static/*  --> Groupe cible "static" (2 instances)
  |--- /*         --> Groupe cible "web" (3 instances)
```

---

### CDN et DNS manages

**CDN (Content Delivery Network)** :

Un CDN distribue tes fichiers statiques (images, CSS, JS) sur des serveurs repartis dans le monde entier (points de presence). Quand un utilisateur accede a ton site, il reçoit les fichiers depuis le serveur le plus proche, ce qui réduit la latence.

| Fournisseur | Service CDN |
| --- | --- |
| AWS | CloudFront |
| Azure | Azure CDN |
| GCP | Cloud CDN |

**DNS manage** :

Un service DNS manage heberge tes zones DNS avec une haute disponibilité et de faibles latences. Il est integre aux autres services cloud pour le routage automatique.

| Fournisseur | Service DNS |
| --- | --- |
| AWS | Route 53 |
| Azure | Azure DNS |
| GCP | Cloud DNS |

---

## Étapes Pratiques

### Étape 1 : Creer un VPC

```bash
# Creer un VPC avec le CIDR 10.0.0.0/16 (65 536 adresses)
aws ec2 create-vpc \
  --cidr-block 10.0.0.0/16 \
  --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=mon-vpc}]'
```

**Résultat attendu** :

```json
{
    "Vpc": {
        "VpcId": "vpc-0abcdef1234567890",
        "CidrBlock": "10.0.0.0/16",
        "State": "available",
        "Tags": [
            {
                "Key": "Name",
                "Value": "mon-vpc"
            }
        ]
    }
}
```

Note la valeur de `VpcId`, tu en auras besoin dans les étapes suivantes.

---

### Étape 2 : Creer des sous-réseaux

```bash
# Sous-reseau public dans la zone eu-west-3a
aws ec2 create-subnet \
  --vpc-id vpc-0abcdef1234567890 \
  --cidr-block 10.0.1.0/24 \
  --availability-zone eu-west-3a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-a}]'

# Sous-reseau prive dans la zone eu-west-3a
aws ec2 create-subnet \
  --vpc-id vpc-0abcdef1234567890 \
  --cidr-block 10.0.2.0/24 \
  --availability-zone eu-west-3a \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=private-a}]'

# Sous-reseau public dans la zone eu-west-3b (pour la haute disponibilite)
aws ec2 create-subnet \
  --vpc-id vpc-0abcdef1234567890 \
  --cidr-block 10.0.3.0/24 \
  --availability-zone eu-west-3b \
  --tag-specifications 'ResourceType=subnet,Tags=[{Key=Name,Value=public-b}]'
```

**Résultat attendu** :

```json
{
    "Subnet": {
        "SubnetId": "subnet-0abc123def456789a",
        "CidrBlock": "10.0.1.0/24",
        "AvailabilityZone": "eu-west-3a",
        "Tags": [
            {
                "Key": "Name",
                "Value": "public-a"
            }
        ]
    }
}
```

---

### Étape 3 : Creer une Internet Gateway

```bash
# Creer une Internet Gateway
aws ec2 create-internet-gateway \
  --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=mon-igw}]'

# Attacher l'Internet Gateway au VPC
aws ec2 attach-internet-gateway \
  --internet-gateway-id igw-0abc123 \
  --vpc-id vpc-0abcdef1234567890
```

**Résultat attendu** :

```json
{
    "InternetGateway": {
        "InternetGatewayId": "igw-0abc123",
        "Tags": [
            {
                "Key": "Name",
                "Value": "mon-igw"
            }
        ]
    }
}
```

---

### Étape 4 : Configurer le routage

```bash
# Creer une table de routage pour les sous-reseaux publics
aws ec2 create-route-table \
  --vpc-id vpc-0abcdef1234567890 \
  --tag-specifications 'ResourceType=route-table,Tags=[{Key=Name,Value=public-rt}]'

# Ajouter une route vers Internet via l'Internet Gateway
aws ec2 create-route \
  --route-table-id rtb-0abc123 \
  --destination-cidr-block 0.0.0.0/0 \
  --gateway-id igw-0abc123

# Associer la table de routage au sous-reseau public
aws ec2 associate-route-table \
  --route-table-id rtb-0abc123 \
  --subnet-id subnet-0abc123def456789a
```

**Résultat attendu** :

```json
{
    "Return": true
}
```

---

### Étape 5 : Creer un Security Group

```bash
# Creer un security group pour un serveur web
aws ec2 create-security-group \
  --group-name web-sg \
  --description "Security group pour serveur web" \
  --vpc-id vpc-0abcdef1234567890

# Autoriser le trafic HTTP entrant
aws ec2 authorize-security-group-ingress \
  --group-id sg-0abc123 \
  --protocol tcp \
  --port 80 \
  --cidr 0.0.0.0/0

# Autoriser le trafic HTTPS entrant
aws ec2 authorize-security-group-ingress \
  --group-id sg-0abc123 \
  --protocol tcp \
  --port 443 \
  --cidr 0.0.0.0/0

# Autoriser le SSH uniquement depuis le VPC
aws ec2 authorize-security-group-ingress \
  --group-id sg-0abc123 \
  --protocol tcp \
  --port 22 \
  --cidr 10.0.0.0/16

# Verifier les regles du security group
aws ec2 describe-security-groups \
  --group-ids sg-0abc123 \
  --query "SecurityGroups[0].IpPermissions"
```

**Résultat attendu** :

```json
[
    {
        "IpProtocol": "tcp",
        "FromPort": 80,
        "ToPort": 80,
        "IpRanges": [{"CidrIp": "0.0.0.0/0"}]
    },
    {
        "IpProtocol": "tcp",
        "FromPort": 443,
        "ToPort": 443,
        "IpRanges": [{"CidrIp": "0.0.0.0/0"}]
    },
    {
        "IpProtocol": "tcp",
        "FromPort": 22,
        "ToPort": 22,
        "IpRanges": [{"CidrIp": "10.0.0.0/16"}]
    }
]
```

---

### Étape 6 : Nettoyer les ressources

```bash
# Supprimer le security group
aws ec2 delete-security-group --group-id sg-0abc123

# Dissocier et supprimer la table de routage
aws ec2 disassociate-route-table --association-id rtbassoc-0abc123
aws ec2 delete-route-table --route-table-id rtb-0abc123

# Detacher et supprimer l'Internet Gateway
aws ec2 detach-internet-gateway --internet-gateway-id igw-0abc123 --vpc-id vpc-0abcdef1234567890
aws ec2 delete-internet-gateway --internet-gateway-id igw-0abc123

# Supprimer les sous-reseaux
aws ec2 delete-subnet --subnet-id subnet-0abc123def456789a
aws ec2 delete-subnet --subnet-id subnet-0abc456def789012b
aws ec2 delete-subnet --subnet-id subnet-0abc789def012345c

# Supprimer le VPC
aws ec2 delete-vpc --vpc-id vpc-0abcdef1234567890
```

**Résultat attendu** :

```text
Toutes les ressources sont supprimees sans erreur.
Le VPC n'apparait plus dans la liste des VPCs.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws ec2 create-vpc` | Creer un VPC |
| `aws ec2 describe-vpcs` | Lister les VPCs |
| `aws ec2 create-subnet` | Creer un sous-réseau |
| `aws ec2 create-internet-gateway` | Creer une Internet Gateway |
| `aws ec2 create-security-group` | Creer un security group |
| `aws ec2 authorize-security-group-ingress` | Ajouter une règle inbound |
| `aws ec2 describe-security-groups` | Lister les règles d'un security group |
| `aws ec2 create-route-table` | Creer une table de routage |
| `aws ec2 create-route` | Ajouter une route |

---

## Pièges Frequents

### Piège 1 : Ouvrir le port 22 (SSH) au monde entier

**Problème** : Tu autorises le SSH depuis `0.0.0.0/0` (toutes les adresses IP). Des robots tentent en permanence des connexions SSH par brute-force sur toutes les machines exposees.

**Solution** : Restreins le SSH a ton adresse IP ou au CIDR de ton VPC. Utilise un bastion host dans un sous-réseau public pour accéder aux machines dans les sous-réseaux prives.

```bash
# Autoriser le SSH uniquement depuis ton IP
aws ec2 authorize-security-group-ingress \
  --group-id sg-0abc123 \
  --protocol tcp \
  --port 22 \
  --cidr $(curl -s https://checkip.amazonaws.com)/32
```

### Piège 2 : Oublier la NAT Gateway pour les sous-réseaux prives

**Problème** : Tes instances dans le sous-réseau prive ne peuvent pas accéder a Internet. Les mises à jour système echouent, les telechargements de paquets bloquent.

**Solution** : Créé une NAT Gateway dans un sous-réseau public et ajoute une route dans la table de routage du sous-réseau prive pointant vers cette NAT Gateway. Attention : la NAT Gateway est facturee (~0,045 USD/heure + trafic).

### Piège 3 : Un seul sous-réseau dans une seule AZ

**Problème** : Toutes tes ressources sont dans une seule zone de disponibilité. Si cette AZ tombe en panne (rare mais possible), toute ton application est hors ligne.

**Solution** : Deploie tes sous-réseaux dans au moins deux zones de disponibilité. Utilise un load balancer pour distribuer le trafic entre les AZ.

---

## Checklist de Validation

- [ ] Je sais ce qu'est un VPC et pourquoi il est nécessaire
- [ ] Je distingue sous-réseau public et sous-réseau prive
- [ ] Je sais configurer un security group avec des règles appropriees
- [ ] Je comprends le rôle de l'Internet Gateway et de la NAT Gateway
- [ ] Je connais la difference entre security group et Network ACL
- [ ] Je comprends le rôle d'un load balancer et d'un CDN

---

## Exercice Pratique

**Enonce** : Dessine l'architecture réseau d'une application web classique avec les composants suivants :

- Un VPC avec le CIDR `10.0.0.0/16`
- Deux zones de disponibilité
- Dans chaque AZ : un sous-réseau public et un sous-réseau prive
- Un Application Load Balancer dans les sous-réseaux publics
- Deux instances web dans les sous-réseaux publics
- Une base de données dans un sous-réseau prive
- Les security groups nécessaires

Pour chaque composant, indique :

- Son sous-réseau (public ou prive)
- Son security group (quels ports ouverts, depuis quelle source)

**Indications** :

- Le load balancer doit accepter le trafic HTTPS (443) depuis Internet
- Les instances web doivent accepter le trafic HTTP (80) depuis le load balancer uniquement
- La base de données doit accepter les connexions PostgreSQL (5432) depuis les instances web uniquement

**Résultat attendu** : Un schéma en texte et un tableau des security groups.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Schéma de l'architecture :

```text
                    Internet
                       |
                Internet Gateway
                       |
    +---------VPC 10.0.0.0/16---------+
    |                                  |
    |  AZ eu-west-3a    AZ eu-west-3b |
    |                                  |
    |  Public           Public         |
    |  10.0.1.0/24      10.0.3.0/24   |
    |  +---ALB---+      +---ALB---+   |
    |  | Web-1   |      | Web-2   |   |
    |                                  |
    |  Prive            Prive          |
    |  10.0.2.0/24      10.0.4.0/24   |
    |  | BDD (primaire) | BDD (replica)|
    |                                  |
    +----------------------------------+
```

Tableau des security groups :

| Security Group | Ressource | Inbound | Source |
| --- | --- | --- | --- |
| sg-alb | ALB | TCP 443 | 0.0.0.0/0 |
| sg-web | Instances web | TCP 80 | sg-alb |
| sg-web | Instances web | TCP 22 | 10.0.0.0/16 |
| sg-bdd | Base de données | TCP 5432 | sg-web |

Explications :

- **sg-alb** : Le load balancer accepte le HTTPS depuis Internet. C'est le seul point d'entrée public.
- **sg-web** : Les instances web acceptent le HTTP uniquement depuis le load balancer (référence au security group sg-alb, pas a une IP). Le SSH est restreint au VPC pour l'administration.
- **sg-bdd** : La base de données accepte les connexions PostgreSQL uniquement depuis les instances web (référence au security group sg-web). Aucun accès depuis Internet.

---

## Navigation

← Fiche précédente : **[03 - Stockage](03-cloud-stockage.md)**

→ Fiche suivante : **[05 - IAM et sécurité](05-iam-securite.md)**
