---
tags:
  - Cloud
  - Débutant
  - Concept
description: "Introduction au cloud computing : IaaS, PaaS, SaaS, cloud public, privé et hybride, principaux providers (AWS, Azure, GCP)."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 13
cursus: "Cloud"
---

# 01 - Introduction au Cloud

> **En bref** : Tu découvriras ce qu'est le cloud computing, les trois modèles de service (IaaS, PaaS, SaaS), les types de déploiement (public, privé, hybride) et les principaux fournisseurs (AWS, Azure, GCP). Lecture estimée : 60 min.

## Prérequis

- Savoir créer et gérer des conteneurs Docker - cursus [Docker](../01-docker/index.md)
- Comprendre les bases des réseaux (IP, DNS, ports) - cursus [Réseaux](../20-reseaux/index.md)
- Connaître les principes de CI/CD (pipelines, déploiement automatise) - cursus [CI/CD](../11-ci-cd/index.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras définir le cloud computing, distinguer IaaS, PaaS et SaaS, choisir entre cloud public, privé et hybride, et identifier les services principaux des trois grands fournisseurs cloud.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le cloud computing ?

**Définition** : Le cloud computing est la mise à disposition de ressources informatiques (serveurs, stockage, bases de données, réseau, logiciels) via Internet, facturées à l'usage, sans que tu aies besoin de posséder ou gérer l'infrastructure physique.

**Le problème que le cloud computing résout** :

Sans cloud, voici les problèmes rencontres :

1. **Investissement initial lourd** : Pour lancer un projet, tu dois acheter des serveurs physiques, les installer dans une salle climatisee, les brancher au réseau. Cela coûte des milliers d'euros avant meme de commencer a coder.
2. **Dimensionnement rigide** : Si ton application connaît un pic de trafic (soldes, événement mediatique), tes serveurs sont satures. Si le trafic baisse, tes serveurs tournent a vide et tu paies pour rien.
3. **Maintenance permanente** : Tu dois gérer les pannes hardware, les mises à jour système, les sauvegardes, la sécurité physique. Chaque minute passee sur l'infrastructure est une minute perdue pour le développement.

**Comment le cloud computing résout ces problèmes** :

| Problème | Solution apportée par le cloud |
| --- | --- |
| Investissement initial lourd | Tu créés un serveur en quelques clics. Pas de matériel a acheter. Tu paies uniquement ce que tu consommes |
| Dimensionnement rigide | Le cloud permet le scaling automatique : ajouter ou retirer des ressources en temps réel selon la charge |
| Maintenance permanente | Le fournisseur cloud gère l'infrastructure physique, les mises à jour hardware et la sécurité des datacenters |

**Analogie concrète** : Le cloud, c'est comme l'électricité. Avant l'électricité publique, chaque usine possedait son propre generateur : coûteux a acheter, a entretenir, et impossible a adapter rapidement a la demande. Aujourd'hui, tu branches ta machine a la prise et tu paies ce que tu consommes. Le cloud fait la même chose pour l'informatique : tu utilises des serveurs "a la prise" sans posséder la centrale electrique.

**Ce que le cloud computing n'est PAS** :

- Le cloud n'est pas "l'ordinateur de quelqu'un d'autre". C'est un modèle de service avec des garanties de disponibilité, de sécurité, de scalabilité et de facturation a l'usage. Un simple serveur loue chez un hebergeur n'est pas du cloud s'il ne propose pas ces caractéristiques.
- Le cloud n'est pas gratuit. La facturation a l'usage peut devenir coûteuse si tu ne surveilles pas ta consommation. Un serveur cloud oublie en fonctionnement peut générer des factures importantes.

---

### Les modèles de service : IaaS, PaaS, SaaS

**Définition** : Les modèles de service cloud définissent le niveau d'abstraction entre toi et l'infrastructure physique. Plus le niveau d'abstraction est élevé, moins tu geres de composants techniques.

**IaaS - Infrastructure as a Service** :

Le fournisseur te donne des machines virtuelles, du stockage et du réseau. Tu geres tout le reste : système d'exploitation, middleware, runtime, application.

Exemples de services IaaS :

- **AWS EC2** : machines virtuelles a la demande
- **Azure Virtual Machines** : machines virtuelles Azure
- **Google Compute Engine** : machines virtuelles GCP

Cas d'usage : tu as besoin d'un controle total sur ton environnement serveur. Tu veux installer un logiciel spécifique ou configurer le système d'exploitation a ta facon.

**PaaS - Platform as a Service** :

Le fournisseur gère l'infrastructure ET la plateforme d'exécution (OS, runtime, middleware). Tu te concentres uniquement sur ton code et tes données.

Exemples de services PaaS :

- **AWS Elastic Beanstalk** : déploiement automatique d'applications
- **Azure App Service** : hébergement d'applications web
- **Google App Engine** : plateforme d'exécution managée

Cas d'usage : tu veux déployer une application web sans gérer les serveurs. Tu pousses ton code, la plateforme s'occupe du reste.

**SaaS - Software as a Service** :

Le fournisseur gère tout. Tu utilises un logiciel prêt a l'emploi via ton navigateur, sans rien installer ni configurer.

Exemples de services SaaS :

- **Google Workspace** (Gmail, Docs, Drive)
- **Microsoft 365** (Outlook, Word, Teams)
- **Slack**, **Notion**, **Jira**

**Tableau comparatif des modèles de service** :

| Composant | IaaS | PaaS | SaaS |
| --- | --- | --- | --- |
| Application | Toi | Toi | Fournisseur |
| Données | Toi | Toi | Fournisseur |
| Runtime | Toi | Fournisseur | Fournisseur |
| Middleware | Toi | Fournisseur | Fournisseur |
| OS | Toi | Fournisseur | Fournisseur |
| Virtualisation | Fournisseur | Fournisseur | Fournisseur |
| Serveurs | Fournisseur | Fournisseur | Fournisseur |
| Stockage | Fournisseur | Fournisseur | Fournisseur |
| Réseau | Fournisseur | Fournisseur | Fournisseur |

**Analogie concrète** : Imagine que tu veux manger une pizza.

- **IaaS** : On te donne un four, de la farine et des ingrédients. Tu fais tout toi-meme.
- **PaaS** : On te donne une pate toute prete et les garnitures. Tu assembles et tu enfournes.
- **SaaS** : On te livre la pizza chez toi. Tu manges.

---

### Cloud public, prive et hybride

**Définition** : Le type de déploiement cloud définit qui possède et gère l'infrastructure physique sous-jacente.

**Cloud public** :

L'infrastructure est possedee par un fournisseur tiers (AWS, Azure, GCP) et partagée entre de nombreux clients. Chaque client est isole logiquement des autres.

Avantages :

- Aucun investissement initial
- Scalabilite quasi infinie
- Services geres en continu par le fournisseur

Inconvénients :

- Moins de controle sur l'emplacement physique des données
- Dépendance au fournisseur (vendor lock-in)

**Cloud prive** :

L'infrastructure est dédiée a une seule organisation. Elle peut être hebergee dans les locaux de l'organisation (on-premises) ou chez un fournisseur tiers.

Avantages :

- Controle total sur l'infrastructure et les données
- Conformité réglementaire plus facile (données sensibles, santé, defense)

Inconvénients :

- Coût élevé (achat et maintenance du matériel)
- Scalabilite limitée par le matériel disponible

**Cloud hybride** :

Combinaison d'un cloud public et d'un cloud prive, connectes entre eux. Les données et applications circulent entre les deux selon les besoins.

Cas d'usage typique : une banque stocke les données sensibles des clients sur un cloud prive, mais utilise un cloud public pour les analyses de données et le site web public.

| Type | Propriété | Scalabilite | Coût initial | Controle |
| --- | --- | --- | --- | --- |
| Public | Fournisseur | Haute | Aucun | Limite |
| Prive | Organisation | Limitée | Élevé | Total |
| Hybride | Mixte | Haute | Moyen | Partiel |

---

### Les principaux fournisseurs cloud

**Amazon Web Services (AWS)** :

Leader du marché avec 28% de parts de marché (Q1 2026, source : Synergy Research Group). AWS propose plus de 200 services, des machines virtuelles (EC2) aux services d'intelligence artificielle (SageMaker).

Services clés :

- **EC2** : machines virtuelles
- **S3** : stockage objet
- **RDS** : bases de données relationnelles managées
- **Lambda** : fonctions serverless
- **VPC** : réseau virtuel prive

**Microsoft Azure** :

Deuxième fournisseur mondial (21% de parts de marché, Q1 2026, Synergy Research Group). Fort de l'intégration avec l'écosystème Microsoft (Active Directory, Windows Server, .NET).

Services clés :

- **Virtual Machines** : machines virtuelles
- **Blob Storage** : stockage objet
- **Azure SQL Database** : base de données SQL managée
- **Azure Functions** : fonctions serverless
- **Virtual Network** : réseau virtuel

**Google Cloud Platform (GCP)** :

Troisième fournisseur mondial (14% de parts de marché, Q1 2026, Synergy Research Group). Reconnu pour ses services de données, de machine learning et de conteneurs (Kubernetes a été créé par Google).

Services clés :

- **Compute Engine** : machines virtuelles
- **Cloud Storage** : stockage objet
- **Cloud SQL** : base de données SQL managée
- **Cloud Functions** : fonctions serverless
- **VPC** : réseau virtuel

> **Note - parts de marché** : Ces chiffres évoluent chaque trimestre. Consulte Synergy Research Group ou Statista pour les données les plus récentes.

**Equivalences entre fournisseurs** :

| Fonction | AWS | Azure | GCP |
| --- | --- | --- | --- |
| Machine virtuelle | EC2 | Virtual Machines | Compute Engine |
| Stockage objet | S3 | Blob Storage | Cloud Storage |
| BDD relationnelle | RDS | Azure SQL | Cloud SQL |
| Serverless | Lambda | Azure Functions | Cloud Functions |
| Conteneurs manages | ECS/EKS | AKS | GKE |
| Réseau virtuel | VPC | Virtual Network | VPC |

---

## Étapes Pratiques

### Étape 1 : Créer un compte AWS Free Tier

Depuis le **15 juillet 2025**, les **nouveaux** comptes AWS n'ont plus le modèle "12 mois d'usage gratuit par service" historique. AWS propose plutôt :

| Élément | Ce que c'est |
| ------- | ------------ |
| **Free Plan** | Jusqu'à **6 mois** ou jusqu'à épuisement des crédits (le premier des deux) |
| **Crédits** | Jusqu'à **200 USD** (100 USD à l'inscription + jusqu'à 100 USD en complétant des activités d'exploration) |
| **Always Free** | Plus de 30 services avec un quota mensuel gratuit **permanent** (ex. S3 Standard 5 Go, Lambda 1 M d'invocations) |
| **Paid Plan** | Accès complet aux services, facturation au-delà des crédits / quotas Always Free |

Les comptes créés **avant** le 15 juillet 2025 restent en général sur l'ancien Free Tier (essais 12 mois + Always Free). Vérifie toujours le détail sur `https://aws.amazon.com/free/` : les montants et conditions peuvent évoluer.

1. Rends-toi sur `https://aws.amazon.com/free/`
2. Clique sur **Create a Free Account**
3. Remplis le formulaire avec ton adresse e-mail et un mot de passe
4. Ajoute les informations de facturation (une carte bancaire est requise). Sur le **Free Plan**, tu n'es pas facturé tant que tu restes dans ce plan ; le plan se termine après 6 mois ou quand les crédits sont épuisés. Sur le **Paid Plan**, les crédits s'appliquent d'abord, puis la facturation commence
5. Vérifie ton identité par téléphone
6. Choisis le plan proposé pour les nouveaux comptes (**Free Plan** pour explorer sans facture surprise, ou **Paid Plan** si tu as besoin de tous les services)

**Résultat attendu** :

```text
Tu as acces a la console AWS (https://console.aws.amazon.com/).
Tu vois le tableau de bord avec la liste des services disponibles.
```

---

### Étape 2 : Naviguer dans la console AWS

La console AWS est l'interface web pour gérer tes ressources cloud.

1. Connecte-toi a la console AWS
2. En haut a gauche, clique sur **Services** pour voir tous les services disponibles
3. Utilise la barre de recherche pour trouver un service spécifique (tape "EC2", "S3", etc.)
4. En haut a droite, selectionne la **Region** la plus proche de toi (par exemple `eu-west-3` pour Paris)

**Résultat attendu** :

```text
Tu navigues dans la console AWS.
Tu peux trouver n'importe quel service via la barre de recherche.
Tu as selectionne la region Paris (eu-west-3).
```

---

### Étape 3 : Installer le CLI AWS

L'AWS CLI permet de gérer les services AWS depuis le terminal.

Installation sur Linux/macOS :

```bash
# Telecharger le programme d'installation
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"

# Decompresser l'archive
unzip awscliv2.zip

# Installer le CLI
sudo ./aws/install

# Verifier l'installation
aws --version
```

**Résultat attendu** :

```text
aws-cli/2.x.x Python/3.x.x Linux/x86_64
```

---

### Étape 4 : Configurer le CLI AWS

```bash
# Lancer la configuration interactive
aws configure
```

Le CLI te demande quatre informations :

```text
AWS Access Key ID [None]: <ta-cle-d-acces>
AWS Secret Access Key [None]: <ta-cle-secrete>
Default region name [None]: eu-west-3
Default output format [None]: json
```

Pour obtenir tes clés d'accès (lab / démarrage) :

1. Dans la console AWS, va dans **IAM** (Identity and Access Management)
2. Clique sur **Users** puis sur ton utilisateur
3. Onglet **Security credentials** puis **Create access key**
4. Note la clé d'accès et la clé secrete (la clé secrete n'est affichee qu'une seule fois)

**Sécurité** : les clés d'accès IAM sont des credentials de longue durée (elles n'expirent pas seules). AWS recommande des credentials temporaires (IAM Identity Center / SSO, rôles assumees) des que c'est possible. Ne créé jamais de clés d'accès pour le compte root. Ne commit jamais les clés dans Git.

Verifie que la configuration fonctionne :

```bash
# Lister les buckets S3 (la liste sera vide si tu viens de creer le compte)
aws s3 ls
```

**Résultat attendu** :

```text
(liste vide ou liste de buckets si tu en as deja cree)
```

---

### Étape 5 : Découvrir les services via le CLI

```bash
# Lister les regions disponibles
aws ec2 describe-regions --query "Regions[].RegionName" --output table

# Verifier ton identite
aws sts get-caller-identity
```

**Résultat attendu** :

```json
{
    "UserId": "AIDAXXXXXXXXXXXXXXXX",
    "Account": "123456789012",
    "Arn": "arn:aws:iam::123456789012:user/ton-utilisateur"
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws configure` | Configurer les identifiants AWS |
| `aws sts get-caller-identity` | Vérifier l'identité de l'utilisateur connecte |
| `aws ec2 describe-regions` | Lister les regions disponibles |
| `aws s3 ls` | Lister les buckets S3 |
| `aws --version` | Vérifier la version du CLI AWS |

---

## Pièges Fréquents

### Piège 1 : Oublier de sélectionner la bonne region

**Problème** : Tu créés une ressource dans la region `us-east-1` (Virginie) alors que tu voulais la créer dans `eu-west-3` (Paris). Quand tu cherches ta ressource dans la console, elle n'apparaît pas car tu es dans la mauvaise region.

**Solution** : Verifie toujours la region selectionnee en haut a droite de la console AWS avant de créer une ressource. Configure la region par défaut dans le CLI avec `aws configure`.

### Piège 2 : Ne pas surveiller les coûts

**Problème** : Tu laisses une machine virtuelle fonctionner 24h/24 pendant tout un mois et tu reçois une facture inattendue.

**Solution** : Active les alertes de facturation dans la console AWS. Va dans **Billing** puis **Budgets** et créé un budget avec une alerte par e-mail quand tu depasses un seuil (par exemple 5 euros).

```bash
# Verifier les couts en cours via le CLI
aws ce get-cost-and-usage \
  --time-period Start=2025-01-01,End=2025-01-31 \
  --granularity MONTHLY \
  --metrics "BlendedCost"
```

### Piège 3 : Publier ses clés d'accès sur un dépôt Git

**Problème** : Tu commites tes clés AWS dans un fichier de configuration et tu les pousses sur un dépôt public. Des robots scannent en permanence les dépôts publics pour voler des clés cloud et miner des cryptomonnaies a tes frais.

**Solution** : Ne stocke jamais tes clés dans le code. Utilise `aws configure` qui stocke les clés dans `~/.aws/credentials` (un fichier local qui n'est pas dans ton dépôt). Ajoute `~/.aws/` et `*.env` a ton fichier `.gitignore`.

---

## Checklist de Validation

- [ ] Je sais définir le cloud computing et ses avantages (scalabilité, paiement a l'usage, pas de matériel a gérer)
- [ ] Je distingue IaaS, PaaS et SaaS et je sais donner un exemple de chaque
- [ ] Je connais la difference entre cloud public, prive et hybride
- [ ] Je sais nommer au moins trois services de chaque fournisseur (AWS, Azure, GCP)
- [ ] J'ai un compte AWS (Free Plan ou Paid Plan) fonctionnel et je connais la différence Free Plan / Always Free / crédits
- [ ] J'ai installe et configure le CLI AWS

---

## Exercice Pratique

**Énoncé** : Classe les services suivants dans la bonne catégorie (IaaS, PaaS ou SaaS) et indique a quel fournisseur ils appartiennent.

Services a classer :

1. Google Docs
2. AWS EC2
3. Azure App Service
4. Gmail
5. Google Compute Engine
6. AWS Lambda
7. Microsoft Teams
8. AWS Elastic Beanstalk

**Indications** :

- Demande-toi qui gère quoi. Si tu geres le serveur et l'OS, c'est de l'IaaS.
- Si tu deploies uniquement ton code, c'est du PaaS.
- Si tu utilises un logiciel prêt a l'emploi, c'est du SaaS.

**Résultat attendu** : Un tableau avec les colonnes Service, Modèle, Fournisseur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

| Service | Modèle | Fournisseur |
| --- | --- | --- |
| Google Docs | SaaS | Google |
| AWS EC2 | IaaS | AWS |
| Azure App Service | PaaS | Azure |
| Gmail | SaaS | Google |
| Google Compute Engine | IaaS | GCP |
| AWS Lambda | PaaS (serverless) | AWS |
| Microsoft Teams | SaaS | Microsoft |
| AWS Elastic Beanstalk | PaaS | AWS |

Explications :

- **Google Docs et Gmail** sont des logiciels prêts a l'emploi accessibles via un navigateur. Tu ne geres rien. C'est du SaaS.
- **AWS EC2 et Google Compute Engine** te donnent une machine virtuelle. Tu geres l'OS, le runtime, l'application. C'est de l'IaaS.
- **Azure App Service et AWS Elastic Beanstalk** te permettent de déployer du code sans gérer le serveur. C'est du PaaS.
- **AWS Lambda** est un cas particulier. C'est du serverless (sous-catégorie du PaaS). Tu deploies uniquement une fonction, sans gérer de serveur.
- **Microsoft Teams** est un logiciel prêt a l'emploi. C'est du SaaS.

---

## Navigation

→ Fiche suivante : **[02 - Compute](02-cloud-compute.md)**
