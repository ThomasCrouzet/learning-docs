---
tags:
  - Cybersécurité
  - Avancé
  - Concept
  - Pratique
description: "Sécuriser les environnements cloud : responsabilité partagée, IAM, conteneurs, IaC et outils d'audit"
estimated_time: "65 min"
fiche_number: 1
total_fiches: 5
cursus: "Phase 6 - Domaines Avancés"
id: "security.cybersecurity.advanced.securite-cloud"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.advanced"
content_type: "lesson"
order: 1
---

# 01 - Sécurité Cloud

> **En bref** : À la fin de cette fiche, tu sauras identifier les risques de sécurité spécifiques aux environnements cloud, configurer les contrôles IAM, sécuriser des workloads (conteneurs, serverless, VM), détecter les misconfigurations courantes et utiliser les outils d'audit cloud. Lecture estimée : 65 min.


## Prérequis

- [Phase 1 - Fondamentaux informatiques](../01-fondamentaux-informatiques/index.md), [Phase 2 - Fondamentaux sécurité](../02-fondamentaux-securite/index.md) et [Phase 3 - Compétences intermédiaires](../03-competences-intermediaires/index.md) complètes
- [Phase 4 - Spécialisation offensive](../04-specialisation-offensive/index.md) ou [Phase 5 - Spécialisation défensive](../05-specialisation-defensive/index.md)
- Connaissances de base en administration système Linux
- Notions de réseau (TCP/IP, pare-feu, DNS)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les risques de sécurité spécifiques aux environnements cloud, configurer les contrôles IAM, sécuriser des workloads (conteneurs, serverless, VM), détecter les misconfigurations courantes et utiliser les outils d'audit cloud.

---

## Concepts

### Qu'est-ce que le Cloud Computing du point de vue sécurité ?

**Définition** : Le cloud computing consiste à utiliser des ressources informatiques (serveurs, stockage, réseau, bases de données) fournies par un tiers via Internet. Du point de vue sécurité, cela signifie que la responsabilité de la protection est partagée entre le fournisseur cloud et le client.

**Le problème que la sécurité cloud résout** :

1. **Surface d'attaque étendue** : les ressources cloud sont accessibles depuis Internet, ce qui augmente les vecteurs d'attaque par rapport à un datacenter privé
2. **Complexité de la configuration** : les services cloud offrent des centaines d'options de configuration, et une seule erreur peut exposer des données sensibles
3. **Manque de visibilité** : sans outils adaptés, il est difficile de savoir qui accède à quoi, quand et depuis où
4. **Conformité réglementaire** : les données stockées dans le cloud doivent respecter les mêmes réglementations (RGPD, PCI-DSS) que les données on-premise

**Comment la sécurité cloud résout ces problèmes** :

| Problème | Solution apportée par la sécurité cloud |
| -------- | --------------------------------------- |
| Surface d'attaque étendue | Segmentation réseau cloud (VPC, security groups, network ACL) |
| Complexité de configuration | Outils d'audit automatisés (ScoutSuite, Prowler) et IaC scanning |
| Manque de visibilité | Logging centralisé (CloudTrail, Azure Monitor, GCP Audit Logs) |
| Conformité réglementaire | Politiques de sécurité automatisées et benchmarks CIS |

**Analogie concrète** : Imagine un immeuble en colocation. Le propriétaire (fournisseur cloud) s'occupe de la structure du bâtiment, des murs porteurs, de l'ascenseur et du système anti-incendie. Toi, le locataire (client), tu es responsable de fermer ta porte à clé, de ne pas laisser tes fenêtres ouvertes et de ne pas stocker de produits dangereux. Si un cambrioleur entre parce que tu as laissé ta porte ouverte, ce n'est pas la faute du propriétaire.

**Ce que la sécurité cloud n'est PAS** :

- La sécurité cloud n'est pas uniquement la responsabilité du fournisseur. Le modèle de responsabilité partagée signifie que le client a des obligations précises selon le type de service (IaaS, PaaS, SaaS)
- La sécurité cloud n'est pas identique à la sécurité on-premise. Les concepts fondamentaux sont les mêmes, mais les outils, les interfaces et les vecteurs d'attaque diffèrent

---

### Qu'est-ce que le modèle de responsabilité partagée ?

**Définition** : Le modèle de responsabilité partagée définit précisément ce que le fournisseur cloud protège et ce que le client doit protéger lui-même. Cette répartition varie selon le type de service utilisé.

Le diagramme suivant illustre la répartition des responsabilités entre le client et le fournisseur cloud :

<div class="diagram-design">
<p><a href="../../../diagrams/cybersecurite-06-domaines-avances-01-securite-cloud-1.html">Qu&#x27;est-ce que le modèle de responsabilité partagée ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/cybersecurite-06-domaines-avances-01-securite-cloud-1.html" title="Qu&#x27;est-ce que le modèle de responsabilité partagée ?" style="width:100%;min-height:556px;border:0;background:transparent"></iframe>
</div>

**Répartition par type de service** :

| Couche | IaaS (EC2, VM) | PaaS (App Service, Lambda) | SaaS (Office 365, Gmail) |
| ------ | --------------- | -------------------------- | ------------------------ |
| Données | Client | Client | Client |
| Applications | Client | Client | Fournisseur |
| OS / Runtime | Client | Fournisseur | Fournisseur |
| Réseau virtuel | Client | Partagé | Fournisseur |
| Infrastructure physique | Fournisseur | Fournisseur | Fournisseur |

**Répartition par fournisseur** :

| Élément | AWS | Azure | GCP |
| ------- | --- | ----- | --- |
| Documentation responsabilité | Shared Responsibility Model | Shared Responsibility in the Cloud | Shared Responsibilities |
| Logging natif | CloudTrail, GuardDuty | Azure Monitor, Defender | Cloud Audit Logs, Security Command Center |
| IAM | IAM Policies + Rôles | Azure AD + RBAC | IAM + Workload Identity |
| Réseau | VPC, Security Groups | VNet, NSG | VPC, Firewall Rules |

---

### Qu'est-ce que l'IAM Cloud ?

**Définition** : L'IAM (Identity and Access Management) cloud est le système qui contrôle qui peut accéder à quelles ressources cloud et avec quelles permissions. C'est la première ligne de défense dans tout environnement cloud.

**Le problème que l'IAM cloud résout** :

1. **Accès non autorisé** : sans IAM, n'importe qui ayant les identifiants pourrait accéder à toutes les ressources
2. **Privilèges excessifs** : les utilisateurs obtiennent souvent plus de droits que nécessaire
3. **Traçabilité** : impossible de savoir qui a fait quoi sans gestion d'identité centralisée

**Comment l'IAM cloud résout ces problèmes** :

| Problème | Solution IAM |
| -------- | ------------ |
| Accès non autorisé | Authentification multifacteur (MFA), fédération d'identité |
| Privilèges excessifs | Principe du moindre privilège, policies granulaires |
| Traçabilité | Journalisation de chaque appel API avec identité associée |

**Composants clés de l'IAM cloud** :

- **Policies** : documents JSON qui définissent les permissions (Allow/Deny sur des actions et ressources)
- **Rôles** : ensemble de permissions attribuables à des utilisateurs, groupes ou services
- **Service Accounts** : identités pour les applications et services (pas pour les humains)
- **Fédération** : connexion avec un fournisseur d'identité externe (SAML, OIDC) pour centraliser l'authentification

**Analogie concrète** : L'IAM cloud fonctionne comme le système de badges d'un hôpital. Chaque employé a un badge (identité) avec un rôle (médecin, infirmier, administratif). Le badge donne accès uniquement aux zones autorisées pour ce rôle. Un médecin peut entrer en salle d'opération, mais pas dans le bureau comptable. Chaque passage de badge est enregistré.

---

### Qu'est-ce que la sécurité des workloads cloud ?

**Définition** : La sécurité des workloads cloud couvre la protection des charges de travail qui s'exécutent dans le cloud : machines virtuelles, conteneurs, fonctions serverless et bases de données.

**Sécurité des conteneurs (Docker, Kubernetes)** :

Les conteneurs introduisent des risques spécifiques :

- **Images vulnérables** : une image Docker contenant des bibliothèques obsolètes
- **Escalade de privilèges** : un conteneur exécuté en root qui compromet l'hôte
- **Communications non contrôlées** : des conteneurs qui communiquent sans restriction dans le cluster

**Contrôles Kubernetes** :

| Contrôle | Rôle |
| -------- | ---- |
| RBAC | Contrôle d'accès basé sur les rôles pour l'API Kubernetes |
| Network Policies | Règles de pare-feu entre les pods |
| Pod Security Standards | Restrictions sur les capacités des conteneurs (Restricted, Baseline, Privileged) |
| Admission Controllers | Validation/mutation des requêtes avant création des ressources |
| Secrets Management | Stockage chiffré des secrets (intégration avec Vault, KMS) |

**Sécurité serverless** :

Les fonctions serverless (AWS Lambda, Azure Functions, GCP Cloud Functions) ont des risques spécifiques :

- Permissions IAM trop larges attribuées à la fonction
- Injection de code via les événements déclencheurs
- Dépendances vulnérables dans les packages déployés
- Durée de vie courte qui complique le monitoring

---

### Qu'est-ce qu'une misconfiguration cloud ?

**Définition** : Une misconfiguration cloud est un réglage incorrect ou insuffisant d'un service cloud qui crée une vulnérabilité. C'est la première cause de brèches de sécurité dans le cloud.

**Misconfigurations les plus fréquentes** :

| Misconfiguration | Impact | Exemple réel |
| ---------------- | ------ | ------------ |
| Mauvaise config IAM / SSRF vers le metadata service | Fuite de données | Capital One (2019) : SSRF + IMDSv1, pas un bucket S3 public |
| Security groups trop ouverts | Accès non autorisé | Port 22 (SSH) ouvert à 0.0.0.0/0 |
| Absence de logging | Pas de détection | CloudTrail désactivé = aucune trace des actions |
| Clés d'accès dans le code | Compromission complète | Clés AWS dans un dépôt GitHub public |
| Chiffrement désactivé | Données lisibles | Volumes EBS ou disques non chiffrés |
| MFA non activée | Prise de contrôle du compte | Compte root AWS sans MFA |

---

### Qu'est-ce que l'IaC Security ?

**Définition** : L'IaC Security (Infrastructure as Code Security) consiste à analyser les fichiers de définition d'infrastructure (Terraform, CloudFormation, Pulumi) pour détecter les problèmes de sécurité avant le déploiement.

**Le problème que l'IaC Security résout** :

1. **Détection tardive** : les misconfigurations sont détectées en production, après le déploiement
2. **Dérive de configuration** : la configuration réelle s'écarte de ce qui a été prévu
3. **Reproductibilité** : les corrections manuelles ne sont pas documentées

**Comment l'IaC Security résout ces problèmes** :

| Problème | Solution IaC Security |
| -------- | --------------------- |
| Détection tardive | Analyse statique dans le pipeline CI/CD, avant déploiement |
| Dérive de configuration | Comparaison continue entre l'état déclaré et l'état réel |
| Reproductibilité | Corrections intégrées dans le code, versionnées et auditables |

**Outils de scanning IaC** :

| Outil | Spécialité |
| ----- | ---------- |
| tfsec / Trivy | Analyse Terraform |
| cfn-lint + cfn-nag | Analyse CloudFormation |
| Checkov | Multi-framework (Terraform, CloudFormation, Kubernetes, Helm) |
| KICS | Multi-framework, open source par Checkmarx |

---

## Étapes Pratiques

### Étape 1 : Analyser une policy IAM AWS

Une policy IAM est un document JSON qui définit les permissions. Voici comment analyser une policy pour détecter les problèmes.

Crée un fichier `policy-example.json` :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "TropDePermissions",
            "Effect": "Allow",
            "Action": "*",
            "Resource": "*"
        }
    ]
}
```

Cette policy est dangereuse : elle donne toutes les permissions sur toutes les ressources. C'est l'équivalent d'un badge passe-partout dans un bâtiment.

Voici une version corrigée suivant le principe du moindre privilège :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LectureSeulementS3",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::mon-bucket-donnees",
                "arn:aws:s3:::mon-bucket-donnees/*"
            ]
        }
    ]
}
```

**Résultat attendu** :

```text
La policy corrigée autorise uniquement la lecture (GetObject) et le listage
(ListBucket) sur un seul bucket S3 spécifique. Aucune autre action n'est permise.
```

---

### Étape 2 : Scanner un compte AWS avec Prowler

Prowler est un outil open source qui audite la conformité d'un compte AWS par rapport aux benchmarks CIS.

```bash
# Installer Prowler (nécessite Python 3.9+)
pip install prowler

# Vérifier l'installation
prowler --version
```

```bash
# Lancer un scan complet du compte AWS
# Prowler utilise les credentials AWS configurés (~/.aws/credentials)
prowler aws --output-formats html json

# Scanner uniquement les contrôles IAM
prowler aws --service iam --output-formats html

# Scanner avec le benchmark CIS AWS Foundations (identifiant historique encore
# listé par Prowler). AWS Security Hub documente désormais CIS v3.0 et v5.0 :
# adapte le flag (`cis_2.0_aws`, `cis_3.0_aws`, etc.) à la version que tu cibles.
prowler aws --compliance cis_1.5_aws --output-formats html
```

**Résultat attendu** :

```text
Prowler génère un rapport HTML et JSON dans le dossier output/.
Le rapport liste chaque contrôle vérifié avec un statut :
- PASS : le contrôle est conforme
- FAIL : une misconfiguration a été détectée
- INFO : information complémentaire

Exemple de sortie :
[FAIL] iam_root_mfa_enabled: Root account does not have MFA enabled.
[PASS] iam_password_policy_minimum_length: Password policy requires minimum length of 14.
[FAIL] s3_bucket_public_access: Bucket "logs-backup" has public access enabled.
```

---

### Étape 3 : Scanner une infrastructure avec ScoutSuite

ScoutSuite est un outil multi-cloud qui collecte et analyse la configuration des services.

```bash
# Installer ScoutSuite
pip install scoutsuite

# Scanner un compte AWS
scout aws --report-dir ./scoutsuite-report

# Scanner un tenant Azure
scout azure --cli --report-dir ./scoutsuite-report

# Scanner un projet GCP
scout gcp --project-id mon-projet --report-dir ./scoutsuite-report
```

**Résultat attendu** :

```text
ScoutSuite génère un rapport HTML interactif dans le dossier spécifié.
Le rapport affiche :
- Un dashboard avec le nombre de findings par service et par sévérité
- Des détails pour chaque finding avec la ressource concernée
- Des recommandations de remédiation

Ouvrir le fichier report.html dans un navigateur pour consulter les résultats.
```

---

### Étape 4 : Scanner des images Docker avec Trivy

Trivy détecte les vulnérabilités dans les images de conteneurs, les fichiers IaC et les dépendances.

```bash
# Installer Trivy (macOS)
brew install aquasecurity/trivy/trivy

# Installer Trivy (Linux)
curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin
```

```bash
# Scanner une image Docker pour les vulnérabilités
trivy image nginx:latest

# Scanner uniquement les vulnérabilités critiques et hautes
trivy image --severity CRITICAL,HIGH nginx:latest

# Scanner un fichier Terraform
trivy config --severity CRITICAL,HIGH ./terraform/

# Scanner un dossier Kubernetes
trivy config ./k8s-manifests/

# Générer un rapport au format JSON
trivy image --format json --output rapport-trivy.json nginx:latest
```

**Résultat attendu** :

```text
nginx:latest (debian 12.5)

Total: 142 (CRITICAL: 3, HIGH: 21, MEDIUM: 78, LOW: 40)

┌──────────────────┬────────────────┬──────────┬───────────────────┬──────────────────┐
│     Library      │ Vulnerability  │ Severity │ Installed Version │  Fixed Version   │
├──────────────────┼────────────────┼──────────┼───────────────────┼──────────────────┤
│ libssl3          │ CVE-2023-5678  │ CRITICAL │ 3.0.11-1          │ 3.0.13-1         │
│ libcurl4         │ CVE-2023-38545 │ HIGH     │ 7.88.1-10         │ 7.88.1-10+deb12u5│
└──────────────────┴────────────────┴──────────┴───────────────────┴──────────────────┘
```

---

### Étape 5 : Scanner du code Terraform avec Checkov

Checkov analyse les fichiers IaC pour détecter les misconfigurations avant le déploiement.

Crée un fichier `main.tf` de test :

```text
# Exemple de configuration Terraform avec des problèmes de sécurité
resource "aws_s3_bucket" "data" {
  bucket = "mon-bucket-donnees"
}

resource "aws_s3_bucket_public_access_block" "data" {
  bucket = aws_s3_bucket.data.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

resource "aws_security_group" "web" {
  name = "web-sg"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
}
```

```bash
# Installer Checkov
pip install checkov

# Scanner le fichier Terraform
checkov -f main.tf

# Scanner un dossier entier
checkov -d ./terraform/

# Scanner avec un format de sortie spécifique
checkov -d ./terraform/ --output json > checkov-report.json
```

**Résultat attendu** :

```text
Passed checks: 1, Failed checks: 5, Skipped checks: 0

Check: CKV_AWS_53: "Ensure S3 bucket has block public ACLS enabled"
  FAILED for resource: aws_s3_bucket_public_access_block.data
  File: /main.tf:8-15

Check: CKV_AWS_24: "Ensure no security group allows ingress from 0.0.0.0/0 to port 22"
  FAILED for resource: aws_security_group.web
  File: /main.tf:17-26

Check: CKV_AWS_18: "Ensure the S3 bucket has access logging enabled"
  FAILED for resource: aws_s3_bucket.data
  File: /main.tf:2-4
```

---

### Étape 6 : Configurer des Network Policies Kubernetes

Les Network Policies contrôlent les communications entre les pods dans un cluster Kubernetes.

Crée un fichier `network-policy.yaml` :

```yaml
# Cette policy bloque tout le trafic entrant par défaut
# pour les pods dans le namespace "production"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: deny-all-ingress
  namespace: production
spec:
  # Sélectionne tous les pods du namespace
  podSelector: {}
  policyTypes:
    - Ingress

---
# Cette policy autorise uniquement le trafic
# depuis le pod "frontend" vers le pod "api"
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: allow-frontend-to-api
  namespace: production
spec:
  podSelector:
    matchLabels:
      app: api
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: frontend
      ports:
        - protocol: TCP
          port: 8080
```

```bash
# Appliquer les Network Policies
kubectl apply -f network-policy.yaml

# Vérifier les policies actives
kubectl get networkpolicies -n production

# Tester la connectivité (depuis un pod de test)
kubectl run test-pod --image=busybox --rm -it --restart=Never -- wget -qO- http://api:8080
```

**Résultat attendu** :

```text
# Avant la Network Policy : tous les pods communiquent entre eux
# Après la Network Policy :
# - Le pod frontend peut joindre le pod api sur le port 8080
# - Tous les autres pods sont bloqués
# - Le trafic sortant n'est pas affecté (seulement Ingress est filtré)

networkpolicy.networking.k8s.io/deny-all-ingress created
networkpolicy.networking.k8s.io/allow-frontend-to-api created
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `prowler aws --service iam` | Auditer les configurations IAM AWS |
| `prowler aws --compliance cis_1.5_aws` | Auditer selon le benchmark CIS |
| `scout aws --report-dir ./report` | Scanner un compte AWS avec ScoutSuite |
| `trivy image nginx:latest` | Scanner une image Docker |
| `trivy config ./terraform/` | Scanner des fichiers IaC |
| `checkov -d ./terraform/` | Analyser du code Terraform |
| `aws iam get-account-authorization-details` | Lister toutes les policies IAM du compte |
| `aws s3api get-bucket-policy --bucket nom` | Afficher la policy d'un bucket S3 |
| `aws s3api get-public-access-block --bucket nom` | Vérifier le blocage d'accès public |
| `kubectl get networkpolicies -A` | Lister les Network Policies de tous les namespaces |
| `kubectl auth can-i --list` | Lister les permissions RBAC de l'utilisateur courant |

---

## Pièges Fréquents

### Piège 1 : Clés d'accès dans le code source

⚠️ **Problème** : les clés d'accès AWS/Azure/GCP sont codées en dur dans les fichiers de configuration ou le code source, puis poussées sur un dépôt Git. Des bots scannent en permanence GitHub pour trouver ces clés.

✅ **Solution** : utiliser des variables d'environnement, des fichiers `.env` exclus du dépôt Git (`.gitignore`), ou un gestionnaire de secrets (AWS Secrets Manager, Azure Key Vault, HashiCorp Vault). Scanner le code avec GitLeaks ou TruffleHog avant chaque commit.

```bash
# Scanner un dépôt Git pour des secrets exposés
gitleaks detect --source . --verbose
```

---

### Piège 2 : Policy IAM trop permissive "pour tester"

⚠️ **Problème** : attribuer la policy `AdministratorAccess` ou `Action: *` "temporairement" pour débloquer un problème. Ces permissions temporaires deviennent permanentes et créent un risque majeur.

✅ **Solution** : toujours appliquer le principe du moindre privilège. Utiliser AWS IAM Access Analyzer pour identifier les permissions réellement utilisées et supprimer les permissions inutiles.

---

### Piège 3 : Bucket S3 rendu public par erreur

⚠️ **Problème** : un bucket S3 est configuré avec un accès public (ACL ou bucket policy) pour un besoin ponctuel, puis oublié. Des données sensibles deviennent accessibles à tout Internet.

✅ **Solution** : activer le Block Public Access au niveau du compte AWS (pas seulement du bucket). Utiliser AWS Config pour détecter automatiquement tout bucket devenu public.

---

### Piège 4 : Ignorer le logging

⚠️ **Problème** : CloudTrail, Azure Activity Log ou GCP Audit Logs ne sont pas activés ou ne sont pas centralisés. En cas d'incident, aucune trace n'est disponible pour l'investigation.

✅ **Solution** : activer le logging sur tous les comptes et régions. Centraliser les logs dans un compte dédié avec des protections contre la suppression (S3 Object Lock, rétention).

---

### Piège 5 : Conteneur exécuté en root

⚠️ **Problème** : un conteneur Docker exécuté avec l'utilisateur root peut, en cas de vulnérabilité d'évasion de conteneur, compromettre l'hôte sous-jacent.

✅ **Solution** : toujours spécifier un utilisateur non-root dans le Dockerfile. Dans Kubernetes, utiliser les Pod Security Standards en mode "Restricted".

```dockerfile
# Mauvaise pratique : le conteneur tourne en root par défaut
FROM nginx:latest

# Bonne pratique : créer et utiliser un utilisateur non-root
FROM nginx:latest
RUN groupadd -r appuser && useradd -r -g appuser appuser
USER appuser
```

---

## Checklist de Validation

- [ ] Je comprends le modèle de responsabilité partagée et ses variantes (IaaS, PaaS, SaaS)
- [ ] Je sais lire et écrire une policy IAM AWS en JSON
- [ ] Je connais la différence entre un rôle, une policy, un utilisateur et un service account
- [ ] Je sais utiliser Prowler pour auditer un compte AWS
- [ ] Je sais utiliser ScoutSuite pour un audit multi-cloud
- [ ] Je sais scanner une image Docker avec Trivy
- [ ] Je sais analyser du code Terraform avec Checkov
- [ ] Je comprends les Network Policies Kubernetes
- [ ] Je connais les misconfigurations cloud les plus fréquentes
- [ ] Je sais détecter des clés d'accès exposées dans du code

---

## Exercice Pratique

**Énoncé** : Tu reçois le rapport Prowler suivant pour un compte AWS. Identifie les 5 problèmes critiques, classe-les par sévérité et propose un plan de remédiation pour chacun.

```text
[FAIL] iam_root_mfa_enabled: Root account does not have MFA enabled.
[FAIL] iam_user_accesskey_unused: User "deploy-bot" has access keys unused for 180 days.
[FAIL] s3_bucket_public_access: Bucket "client-backups" has public read access.
[FAIL] ec2_security_group_open_to_world: Security group "sg-abc123" allows SSH from 0.0.0.0/0.
[PASS] iam_password_policy_minimum_length: OK - minimum 14 characters.
[FAIL] cloudtrail_enabled: CloudTrail is not enabled in region eu-west-3.
[PASS] s3_bucket_versioning: Bucket "client-backups" has versioning enabled.
[FAIL] ec2_ebs_encryption: 3 EBS volumes are not encrypted.
```

**Indications** :

- Classe les findings du plus critique au moins critique
- Pour chaque finding, explique le risque concret
- Propose une commande ou action de remédiation
- Indique si la remédiation peut être automatisée

**Résultat attendu** : un rapport structuré avec les 6 findings classés par sévérité, chacun avec une explication du risque et un plan de remédiation.

---

## Solution de l'Exercice

> **Note** : cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Classement par sévérité (de critique à modéré)** :

**1. CRITIQUE - Root account sans MFA**

- **Risque** : le compte root a un accès illimité à toutes les ressources AWS. Sans MFA, un mot de passe volé suffit pour compromettre tout le compte
- **Remédiation** : activer MFA sur le compte root immédiatement via la console AWS (Security Credentials > MFA). Utiliser une clé physique (YubiKey) de préférence
- **Automatisation** : détection automatique possible, activation manuelle requise

**2. CRITIQUE - Bucket S3 public avec données clients**

- **Risque** : le bucket "client-backups" contient vraisemblablement des sauvegardes de données clients. L'accès public expose ces données à tout Internet
- **Remédiation** :

```bash
# Bloquer l'accès public au bucket
aws s3api put-public-access-block \
    --bucket client-backups \
    --public-access-block-configuration \
    BlockPublicAcls=true,IgnorePublicAcls=true,BlockPublicPolicy=true,RestrictPublicBuckets=true
```

- **Automatisation** : oui, via AWS Config rule `s3-bucket-public-read-prohibited`

**3. ÉLEVÉ - CloudTrail désactivé en eu-west-3**

- **Risque** : aucune trace des actions API dans cette région. Un attaquant pourrait y créer des ressources sans détection
- **Remédiation** :

```bash
# Activer CloudTrail pour toutes les régions
aws cloudtrail create-trail \
    --name audit-trail \
    --s3-bucket-name audit-logs-bucket \
    --is-multi-region-trail \
    --enable-log-file-validation
aws cloudtrail start-logging --name audit-trail
```

- **Automatisation** : oui, via Terraform ou CloudFormation

**4. ÉLEVÉ - Security group SSH ouvert à tout Internet**

- **Risque** : le port 22 (SSH) est accessible depuis n'importe quelle adresse IP. Cela expose les instances à des attaques par force brute
- **Remédiation** :

```bash
# Supprimer la règle trop permissive
aws ec2 revoke-security-group-ingress \
    --group-id sg-abc123 \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

# Ajouter une règle restreinte (remplacer par ton IP)
aws ec2 authorize-security-group-ingress \
    --group-id sg-abc123 \
    --protocol tcp \
    --port 22 \
    --cidr 203.0.113.50/32
```

- **Automatisation** : oui, via AWS Config rule `restricted-ssh`

**5. MODÉRÉ - Clés d'accès inutilisées depuis 180 jours**

- **Risque** : des clés d'accès inutilisées représentent un vecteur d'attaque si elles sont compromises
- **Remédiation** :

```bash
# Désactiver les clés inutilisées
aws iam update-access-key \
    --user-name deploy-bot \
    --access-key-id AKIAXXXXXXXXXXXXXXXX \
    --status Inactive
```

- **Automatisation** : oui, via une Lambda déclenchée par AWS Config

**6. MODÉRÉ - Volumes EBS non chiffrés**

- **Risque** : les données stockées sur ces volumes sont lisibles si le disque physique est compromis ou si un snapshot est partagé
- **Remédiation** : activer le chiffrement par défaut pour les nouveaux volumes EBS. Pour les volumes existants, créer un snapshot chiffré puis recréer le volume

```bash
# Activer le chiffrement par défaut pour les nouveaux volumes
aws ec2 enable-ebs-encryption-by-default
```

- **Automatisation** : oui, via AWS Config rule `encrypted-volumes`

---

## Certifications associées

| Certification | Fournisseur | Niveau |
| ------------- | ----------- | ------ |
| AWS Certified Security - Specialty | Amazon | Expert |
| AZ-500 Azure Security Engineer Associate | Microsoft | Intermédiaire |
| CCSP (Certified Cloud Security Professional) | (ISC)² | Expert |
| Google Professional Cloud Security Engineer | Google | Expert |
| CKS (Certified Kubernetes Security Specialist) | CNCF | Expert |

---

## Navigation

→ Fiche suivante : **[02 - Sécurité OT/ICS/SCADA](02-securite-ot-ics-scada.md)**
