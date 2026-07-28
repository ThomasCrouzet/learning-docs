---
tags:
  - Certification
  - Débutant
  - Concept
description: "BC03 - 01 - Introduction au Cloud Computing"
estimated_time: "20 min"
fiche_number: 1
total_fiches: 5
cursus: "BC03 - Cloud computing"
---

# BC03 - 01 - Introduction au Cloud Computing

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est le cloud computing, les différences entre IaaS, PaaS et SaaS, et tu connaîtras les principaux fournisseurs cloud (AWS, Azure, GCP). Lecture estimée : 20 min.


## Prérequis

- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (Docker)
- Fiche **[BC05 - 01 - L'Infrastructure Réseau](../BC05-architecture-si/01-infrastructure-reseau.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est le cloud computing, les différences entre IaaS, PaaS et SaaS, et tu connaîtras les principaux fournisseurs cloud (AWS, Azure, GCP).

---

## Concepts

### Qu'est-ce que le cloud computing ?

**Définition** : Le cloud computing est la mise à disposition de ressources informatiques (serveurs, stockage, bases de données, réseau) via internet, à la demande et facturées à l'usage.

**Le problème que le cloud résout** :

Sans cloud, voici les problèmes rencontrés :

1. **Investissement initial élevé** : Acheter des serveurs coûte cher avant même de commencer.
2. **Sous-utilisation** : Les serveurs sont dimensionnés pour les pics, mais inutilisés 90% du temps.
3. **Maintenance complexe** : Il faut des équipes pour gérer le matériel.
4. **Scalabilité lente** : Commander et installer un serveur prend des semaines.

**Comment le cloud résout ces problèmes** :

| Problème | Solution cloud |
| -------- | -------------- |
| Investissement initial | Paiement à l'usage (pas d'achat) |
| Sous-utilisation | Scale up/down selon les besoins |
| Maintenance complexe | Le fournisseur gère l'infrastructure |
| Scalabilité lente | Nouvelle instance en quelques minutes |

**Analogie concrète** : Le cloud est comme l'électricité. Tu ne construis pas ta propre centrale électrique : tu te branches au réseau et tu paies ce que tu consommes. Le cloud, c'est pareil pour l'informatique : tu utilises les serveurs du fournisseur et tu paies à l'usage.

---

### Qu'est-ce que le edge computing ?

**Définition** : Le edge computing consiste à traiter les données au plus près de leur source (capteurs, objets connectés) plutôt que de tout envoyer vers le cloud central.

**Comparaison Cloud vs Edge** :

| Aspect | Cloud | Edge |
| ------ | ----- | ---- |
| Localisation | Datacenters centralisés | Proche des utilisateurs/capteurs |
| Latence | Plus élevée | Très faible |
| Bande passante | Consomme beaucoup | Économise la bande passante |
| Cas d'usage | Applications classiques | IoT, véhicules autonomes, jeux |

---

### Quels sont les modèles de service cloud ?

**Les 3 modèles principaux** :

| Modèle | Ce que tu gères | Ce que le fournisseur gère |
| ------ | --------------- | -------------------------- |
| **IaaS** (Infrastructure as a Service) | OS, runtime, applications | Serveurs, stockage, réseau |
| **PaaS** (Platform as a Service) | Applications et données | OS, runtime, infrastructure |
| **SaaS** (Software as a Service) | Rien (juste utiliser) | Tout |

**Schéma de responsabilité** :

```text
                    On-premise   IaaS      PaaS      SaaS
                    ──────────   ────      ────      ────
Applications           Toi       Toi       Toi    Fournisseur
Données                Toi       Toi       Toi    Fournisseur
Runtime                Toi       Toi    Fournisseur Fournisseur
Middleware             Toi       Toi    Fournisseur Fournisseur
OS                     Toi       Toi    Fournisseur Fournisseur
Virtualisation         Toi    Fournisseur Fournisseur Fournisseur
Serveurs               Toi    Fournisseur Fournisseur Fournisseur
Stockage               Toi    Fournisseur Fournisseur Fournisseur
Réseau                 Toi    Fournisseur Fournisseur Fournisseur
```

**Exemples concrets** :

| Modèle | Exemples |
| ------ | -------- |
| IaaS | AWS EC2, Azure VMs, Google Compute Engine |
| PaaS | Heroku, Google App Engine, Azure App Service |
| SaaS | Gmail, Slack, Salesforce, Office 365 |

---

### Quels sont les principaux fournisseurs cloud ?

| Fournisseur | Nom complet | Part de marché (~2025-2026, infra cloud) |
| ----------- | ----------- | ----------------------------------------- |
| **AWS** | Amazon Web Services | ~29-30% |
| **Azure** | Microsoft Azure | ~20-22% |
| **GCP** | Google Cloud Platform | ~12-13% |
| **Autres** | Oracle, OVH, Scaleway, Alibaba, etc. | ~35-38% |

Ces pourcentages (ordre de grandeur Synergy Research / presse spécialisée) évoluent chaque trimestre. L'important pédagogique : AWS reste le leader, Azure 2e, GCP 3e.

**Services équivalents** :

| Usage | AWS | Azure | GCP |
| ----- | --- | ----- | --- |
| Machines virtuelles | EC2 | Virtual Machines | Compute Engine |
| Stockage objet | S3 | Blob Storage | Cloud Storage |
| Base de données | RDS | Azure SQL | Cloud SQL |
| Fonctions serverless | Lambda | Functions | Cloud Functions |
| Kubernetes | EKS | AKS | GKE |
| CDN | CloudFront | Azure CDN | Cloud CDN |

---

### Qu'est-ce que le modèle de facturation cloud ?

**Principes de facturation** :

| Ressource | Facturation |
| --------- | ----------- |
| Compute (VM) | À l'heure ou à la seconde |
| Stockage | Par Go/mois |
| Transfert sortant | Par Go transféré |
| Transfert entrant | Gratuit chez la plupart des fournisseurs (AWS, Azure, GCP) |
| Requêtes API | Par millier de requêtes |

**Attention aux coûts cachés** :

| Coût souvent oublié | Exemple |
| ------------------- | ------- |
| Transfert de données | Télécharger depuis S3 = payant |
| IP publique | ~3 USD/mois si non attachée |
| Snapshots oubliés | Stockage facturé |
| Instances non éteintes | Environnement de test qui tourne 24/7 |

---

## Étapes Pratiques

### Étape 1 : Comprendre les régions et zones de disponibilité

```text
AWS Régions et Zones
────────────────────

Région : eu-west-3 (Paris)
├── Zone : eu-west-3a
├── Zone : eu-west-3b
└── Zone : eu-west-3c

Région : eu-central-1 (Francfort)
├── Zone : eu-central-1a
├── Zone : eu-central-1b
└── Zone : eu-central-1c
```

| Concept | Définition |
| ------- | ---------- |
| Région | Zone géographique (ex: Paris, Francfort) |
| Zone de disponibilité (AZ) | Datacenter isolé dans une région |
| Multi-AZ | Déploiement sur plusieurs zones pour la haute disponibilité |

**Choix de la région** :

| Critère | Question |
| ------- | -------- |
| Latence | Où sont les utilisateurs ? |
| Conformité | RGPD = données en Europe |
| Prix | Certaines régions sont moins chères |
| Services | Tous les services ne sont pas partout |

---

### Étape 2 : Créer une instance EC2 (AWS)

```bash
# Avec AWS CLI

# 1. Lister les AMIs (images) Amazon Linux 2023
# Amazon Linux 2 a atteint la fin de support standard le 30 juin 2026 :
# utiliser AL2023 (support jusqu'en 2029).
aws ec2 describe-images \
    --owners amazon \
    --filters "Name=name,Values=al2023-ami-*-x86_64" \
    --query 'Images | sort_by(@, &CreationDate) | [-1].ImageId'

# 2. Créer une instance
aws ec2 run-instances \
    --image-id ami-0123456789abcdef0 \
    --instance-type t3.micro \
    --key-name ma-cle-ssh \
    --security-group-ids sg-0123456789abcdef0 \
    --subnet-id subnet-0123456789abcdef0 \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=MonServeur}]'

# 3. Voir l'état de l'instance
aws ec2 describe-instances \
    --filters "Name=tag:Name,Values=MonServeur"

# 4. Arrêter l'instance (pour économiser)
aws ec2 stop-instances --instance-ids i-0123456789abcdef0

# 5. Terminer (supprimer) l'instance
aws ec2 terminate-instances --instance-ids i-0123456789abcdef0
```

---

### Étape 3 : Utiliser le stockage S3

```bash
# Créer un bucket
aws s3 mb s3://mon-bucket-unique-12345

# Uploader un fichier
aws s3 cp mon-fichier.txt s3://mon-bucket-unique-12345/

# Lister le contenu
aws s3 ls s3://mon-bucket-unique-12345/

# Télécharger un fichier
aws s3 cp s3://mon-bucket-unique-12345/mon-fichier.txt ./

# Synchroniser un dossier
aws s3 sync ./mon-dossier s3://mon-bucket-unique-12345/backup/

# Supprimer un fichier
aws s3 rm s3://mon-bucket-unique-12345/mon-fichier.txt

# Supprimer un bucket (doit être vide)
aws s3 rb s3://mon-bucket-unique-12345
```

---

### Étape 4 : Estimer les coûts avec le calculateur

**AWS Pricing Calculator** : <https://calculator.aws/>

**Exemple d'estimation pour un site web** :

| Ressource | Configuration | Coût estimé/mois |
| --------- | ------------- | ---------------- |
| EC2 | t3.small, 24/7, eu-west-3 | ~15 USD |
| RDS | db.t3.micro, PostgreSQL | ~15 USD |
| S3 | 10 Go stockage | ~0,25 USD |
| Transfert | 50 Go sortant | ~4,50 USD |
| **Total** | | **~35 USD/mois** |

---

### Étape 5 : Configurer les alertes de facturation

```bash
# Créer une alerte quand le coût dépasse 10$
aws cloudwatch put-metric-alarm \
    --alarm-name "BillingAlarm-10USD" \
    --alarm-description "Alerte si coût > 10$" \
    --metric-name EstimatedCharges \
    --namespace AWS/Billing \
    --statistic Maximum \
    --period 21600 \
    --threshold 10 \
    --comparison-operator GreaterThanThreshold \
    --dimensions Name=Currency,Value=USD \
    --evaluation-periods 1 \
    --alarm-actions arn:aws:sns:us-east-1:123456789:MonTopic
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `aws configure` | Configurer les credentials AWS |
| `aws ec2 describe-instances` | Lister les instances EC2 |
| `aws s3 ls` | Lister les buckets S3 |
| `aws sts get-caller-identity` | Vérifier l'identité connectée |
| `az login` | Se connecter à Azure |
| `gcloud auth login` | Se connecter à GCP |

---

## Pièges Fréquents

### Piège 1 : Oublier d'éteindre les ressources

⚠️ **Problème** : Une instance de test tourne 24/7 = facture surprise.

✅ **Solution** : Toujours étiqueter (tag) les ressources et configurer des alertes de facturation.

---

### Piège 2 : Stocker les credentials dans le code

⚠️ **Problème** : Clés AWS dans Git = compromission du compte.

✅ **Solution** : Variables d'environnement, IAM roles, ou gestionnaire de secrets.

---

### Piège 3 : Tout mettre dans une seule zone

⚠️ **Problème** : Si la zone tombe, tout tombe.

✅ **Solution** : Multi-AZ pour la haute disponibilité.

---

### Piège 4 : Ignorer les coûts de transfert

⚠️ **Problème** : Transférer des To de données depuis S3 coûte cher.

✅ **Solution** : Utiliser CloudFront (CDN) pour les fichiers statiques.

---

## Checklist de Validation

- [ ] Je comprends la différence entre IaaS, PaaS et SaaS
- [ ] Je connais les 3 principaux fournisseurs cloud
- [ ] Je comprends les concepts de région et zone de disponibilité
- [ ] Je sais créer et gérer une instance EC2
- [ ] Je sais utiliser le stockage S3
- [ ] Je sais estimer les coûts cloud

---

## Exercice Pratique

**Énoncé** : Propose une architecture cloud pour une startup avec :

- Un site web avec ~1000 visiteurs/jour
- Une API backend
- Une base de données
- Stockage de fichiers uploadés par les utilisateurs

**Résultat attendu** : Schéma d'architecture + estimation de coûts.

---

## Solution de l'Exercice

### Schéma d'architecture

```text
                   Internet
                       │
                       ▼
              ┌────────────────┐
              │  CloudFront    │  CDN pour les assets statiques
              │  (CDN)         │
              └───────┬────────┘
                      │
         ┌────────────┴────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌─────────────────┐
│  S3 Bucket      │      │  Load Balancer  │
│  (assets)       │      │  (ALB)          │
└─────────────────┘      └────────┬────────┘
                                  │
                    ┌─────────────┴─────────────┐
                    │                           │
                    ▼                           ▼
           ┌─────────────┐             ┌─────────────┐
           │  EC2 (AZ-a) │             │  EC2 (AZ-b) │
           │  App Server │             │  App Server │
           └──────┬──────┘             └──────┬──────┘
                  │                           │
                  └─────────────┬─────────────┘
                                │
              ┌─────────────────┼─────────────────┐
              │                 │                 │
              ▼                 ▼                 ▼
      ┌─────────────┐   ┌─────────────┐   ┌─────────────┐
      │ RDS         │   │ S3 Bucket   │   │ ElastiCache │
      │ PostgreSQL  │   │ (uploads)   │   │ Redis       │
      │ (Multi-AZ)  │   │             │   │ (sessions)  │
      └─────────────┘   └─────────────┘   └─────────────┘
```

---

### Estimation des coûts mensuels

| Service | Configuration | Coût/mois |
| ------- | ------------- | --------- |
| EC2 | 2x t3.small (24/7) | 30 USD |
| RDS | db.t3.micro Multi-AZ | 30 USD |
| ALB | Application Load Balancer | 20 USD |
| S3 | 50 Go (assets + uploads) | 2 USD |
| CloudFront | 100 Go transfert | 10 USD |
| ElastiCache | cache.t3.micro | 15 USD |
| **Total** | | **~107 USD/mois** |

---

### Justifications des choix

- **Multi-AZ** : Haute disponibilité si une zone tombe
- **CloudFront** : Réduit la latence et les coûts de transfert EC2
- **ALB** : Répartit la charge et permet le scaling
- **ElastiCache** : Sessions partagées entre les 2 EC2

---

## Navigation

→ Fiche suivante : **[BC03 - 02 - Les Tests d'Intrusion (Pentest)](02-tests-intrusion-pentest.md)**
