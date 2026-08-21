---
tags:
  - Cloud
  - Intermédiaire
  - Concept
description: "IAM et sécurité cloud : utilisateurs, groupes, rôles, politiques, MFA, principe du moindre privilège et audit."
estimated_time: "60 min"
fiche_number: 5
total_fiches: 13
cursus: "Cloud"
id: "infrastructure.cloud.iam-securite"
course_id: "infrastructure.cloud"
content_type: "lesson"
order: 5
---

# 05 - IAM et sécurité

> **En bref** : Tu découvriras comment gérer les identités et les accès dans le cloud avec IAM, créer des utilisateurs, des groupes et des rôles, écrire des politiques de permissions et appliquer le principe du moindre privilege. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [04 - Réseau cloud](04-cloud-reseau.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des utilisateurs et des groupes IAM, écrire des politiques de permissions, attribuer des rôles aux services et activer l'authentification multi-facteur (MFA).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que IAM ?

**Définition** : IAM (Identity and Access Management) est le service qui controle qui peut faire quoi dans ton compte cloud. Il gère l'authentification (prouver son identité) et l'autorisation (vérifier ses droits d'accès).

**Le problème que IAM résout** :

Sans IAM, voici les problèmes rencontres :

1. **Un seul compte pour tout** : Tous les membres de l'équipe utilisent le meme compte root avec un accès total. Si quelqu'un fait une erreur, il peut supprimer toute l'infrastructure.
2. **Pas de traçabilité** : Impossible de savoir qui a fait quoi. Si une ressource est supprimee, tu ne sais pas qui l'a supprimee.
3. **Permissions trop larges** : Un développeur qui a uniquement besoin de déployer du code a aussi accès a la facturation, aux bases de données de production et aux configurations réseau.

**Comment IAM résout ces problèmes** :

| Problème | Solution apportée par IAM |
| --- | --- |
| Un seul compte pour tout | Chaque personne a son propre utilisateur IAM avec des permissions spécifiques |
| Pas de traçabilité | Chaque action est journalisee avec l'identité de l'auteur (CloudTrail) |
| Permissions trop larges | Les politiques IAM définissent précisément ce que chaque utilisateur peut faire |

**Analogie concrète** : IAM, c'est comme le système de badges d'un immeuble de bureaux. Chaque employé a son propre badge (utilisateur IAM). Le badge donne accès a certains étages et certaines salles (permissions). Le stagiaire accede a l'open space mais pas a la salle des serveurs. Le directeur accede a tout. Et chaque passage de badge est enregistre dans un journal (audit).

**Ce que IAM n'est PAS** :

- IAM n'est pas un annuaire d'entreprise (comme Active Directory). IAM gère les accès aux ressources cloud. Pour les comptes utilisateurs de l'entreprise, tu utilises un fournisseur d'identité (IdP) qui peut être federe avec IAM.
- IAM n'est pas un pare-feu. IAM controle les accès au niveau des services et des API. Les security groups et les Network ACLs contrôlent les accès au niveau réseau.

---

### Les composants IAM

**Utilisateur (User)** :

Un utilisateur IAM représente une personne ou une application qui interagit avec les services cloud. Chaque utilisateur a un nom unique et des identifiants propres (mot de passe pour la console, clés d'accès pour le CLI).

**Groupe (Group)** :

Un groupe est un ensemble d'utilisateurs qui partagent les memes permissions. Au lieu d'attacher des permissions a chaque utilisateur individuellement, tu les attaches au groupe. Quand un nouvel utilisateur rejoint l'équipe, tu l'ajoutes au groupe et il herite des permissions.

Exemples de groupes :

- **Développeurs** : accès aux services de deploy, aux logs, au stockage
- **Administrateurs** : accès total
- **Lecteurs** : accès en lecture seule a tous les services

**Role** :

Un rôle est une identité temporaire attribuee a un service ou a un utilisateur federe. Contrairement a un utilisateur, un rôle n'a pas de mot de passe ni de clé d'accès permanente. Il fournit des credentials temporaires (token a durée limitée).

Cas d'usage :

- Donner a une instance EC2 le droit de lire des fichiers dans S3
- Donner a une fonction Lambda le droit d'écrire dans DynamoDB
- Permettre a un utilisateur d'un autre compte AWS d'accéder a tes ressources

**Politique (Policy)** :

Une politique est un document JSON qui définit les permissions. Elle specifie quelles actions sont autorisées ou refusees sur quelles ressources.

Structure d'une politique :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject"
            ],
            "Resource": "arn:aws:s3:::mon-bucket/*"
        }
    ]
}
```

Chaque statement contient :

- **Effect** : `Allow` (autoriser) ou `Deny` (refuser)
- **Action** : les opérations autorisées (`s3:GetObject`, `ec2:StartInstances`, etc.)
- **Resource** : les ressources concernees (identifiees par leur ARN)

**ARN (Amazon Resource Name)** :

Un ARN identifie de maniere unique chaque ressource AWS. Le format est :

```text
arn:aws:service:region:account-id:resource-type/resource-id
```

Exemples :

```text
arn:aws:s3:::mon-bucket              (bucket S3, global)
arn:aws:s3:::mon-bucket/*            (tous les objets du bucket)
arn:aws:ec2:eu-west-3:123456:instance/i-0abc123  (instance EC2 specifique)
arn:aws:iam::123456:user/thomas      (utilisateur IAM)
```

---

### Le principe du moindre privilege

**Définition** : Le principe du moindre privilege consiste a donner a chaque utilisateur ou service uniquement les permissions strictement nécessaires pour accomplir sa tache. Pas plus, pas moins.

**Pourquoi c'est important** :

| Situation | Risque |
| --- | --- |
| Un dev a `AdministratorAccess` | Il peut supprimer la production par erreur |
| Une Lambda a `AmazonS3FullAccess` | Un bug peut ecraser ou supprimer tous les fichiers de tous les buckets |
| Un compte de service a `*` sur `*` | Si le compte est compromis, l'attaquant controle tout |

**Comment appliquer le moindre privilege** :

1. Commence avec zéro permission
2. Identifie les actions nécessaires (lire S3, écrire dans DynamoDB, etc.)
3. Créé une politique qui autorise uniquement ces actions sur les ressources concernees
4. Teste et ajuste si nécessaire

---

### MFA (Multi-Factor Authentication)

**Définition** : L'authentification multi-facteur ajoute une deuxième vérification lors de la connexion, en plus du mot de passe. Même si ton mot de passe est vole, l'attaquant ne peut pas se connecter sans le deuxième facteur.

Les facteurs d'authentification :

1. **Ce que tu sais** : mot de passe, code PIN
2. **Ce que tu possedes** : telephone, clé physique (YubiKey)
3. **Ce que tu es** : empreinte digitale, reconnaissance faciale

En pratique, le MFA cloud utilise une application de génération de codes temporaires (TOTP) comme Google Authenticator ou Authy.

---

### Audit et CloudTrail

**Définition** : CloudTrail est le service AWS qui enregistre toutes les actions effectuées dans ton compte. Chaque appel API, chaque connexion a la console, chaque création ou suppression de ressource est journalise avec l'identité de l'auteur, la date, l'adresse IP source et le résultat (succès ou échec).

Exemples d'événements CloudTrail :

```json
{
    "eventTime": "2025-01-15T10:30:00Z",
    "eventName": "TerminateInstances",
    "userIdentity": {
        "userName": "thomas"
    },
    "sourceIPAddress": "203.0.113.50",
    "requestParameters": {
        "instancesSet": {
            "items": [{"instanceId": "i-0abc123"}]
        }
    }
}
```

Ce journal montre que l'utilisateur `thomas` a supprime l'instance `i-0abc123` le 15 janvier 2025 a 10h30 depuis l'adresse IP `203.0.113.50`.

---

## Étapes Pratiques

### Étape 1 : Créer un utilisateur IAM

```bash
# Creer un utilisateur IAM
aws iam create-user --user-name dev-alice

# Creer des cles d'acces pour le CLI (lab uniquement)
# AWS recommande des credentials temporaires (roles, IAM Identity Center / SSO)
# plutot que des cles d'acces de longue duree. Les cles n'expirent pas
# automatiquement : si elles fuient, l'attaquant garde l'acces jusqu'a suppression.
aws iam create-access-key --user-name dev-alice
```

**Résultat attendu** :

```json
{
    "AccessKey": {
        "UserName": "dev-alice",
        "AccessKeyId": "AKIAIOSFODNN7EXAMPLE",
        "Status": "Active",
        "SecretAccessKey": "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
    }
}
```

Note bien la clé secrete : elle n'est affichee qu'une seule fois. Ne la commit jamais dans Git. En production, prefere `aws sso login` ou un rôle assume plutôt que des clés permanentes.

---

### Étape 2 : Créer un groupe et y ajouter l'utilisateur

```bash
# Creer un groupe "developpeurs"
aws iam create-group --group-name developpeurs

# Ajouter l'utilisateur au groupe
aws iam add-user-to-group --user-name dev-alice --group-name developpeurs

# Verifier l'appartenance
aws iam get-group --group-name developpeurs
```

**Résultat attendu** :

```json
{
    "Group": {
        "GroupName": "developpeurs",
        "GroupId": "AGPA1234567890EXAMPLE"
    },
    "Users": [
        {
            "UserName": "dev-alice"
        }
    ]
}
```

---

### Étape 3 : Créer et attacher une politique personnalisee

```bash
# Creer le fichier de politique
cat > politique-s3-readonly.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "LectureS3",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::mon-bucket-prod",
                "arn:aws:s3:::mon-bucket-prod/*"
            ]
        }
    ]
}
EOF

# Creer la politique dans IAM
aws iam create-policy \
  --policy-name S3ReadOnlyMonBucket \
  --policy-document file://politique-s3-readonly.json

# Attacher la politique au groupe
aws iam attach-group-policy \
  --group-name developpeurs \
  --policy-arn arn:aws:iam::123456789012:policy/S3ReadOnlyMonBucket

# Verifier les politiques du groupe
aws iam list-attached-group-policies --group-name developpeurs
```

**Résultat attendu** :

```json
{
    "AttachedPolicies": [
        {
            "PolicyName": "S3ReadOnlyMonBucket",
            "PolicyArn": "arn:aws:iam::123456789012:policy/S3ReadOnlyMonBucket"
        }
    ]
}
```

---

### Étape 4 : Créer un rôle pour un service

```bash
# Creer le fichier de trust policy (qui peut assumer le role)
cat > trust-policy-lambda.json << 'EOF'
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "Service": "lambda.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
EOF

# Creer le role
aws iam create-role \
  --role-name lambda-s3-reader \
  --assume-role-policy-document file://trust-policy-lambda.json

# Attacher une politique au role (lecture S3)
aws iam attach-role-policy \
  --role-name lambda-s3-reader \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

# Verifier le role
aws iam get-role --role-name lambda-s3-reader
```

**Résultat attendu** :

```json
{
    "Role": {
        "RoleName": "lambda-s3-reader",
        "Arn": "arn:aws:iam::123456789012:role/lambda-s3-reader",
        "AssumeRolePolicyDocument": {
            "Statement": [
                {
                    "Effect": "Allow",
                    "Principal": {
                        "Service": "lambda.amazonaws.com"
                    },
                    "Action": "sts:AssumeRole"
                }
            ]
        }
    }
}
```

---

### Étape 5 : Activer le MFA (console uniquement)

L'activation du MFA se fait via la console AWS :

1. Connecte-toi a la console AWS
2. Clique sur ton nom d'utilisateur en haut a droite puis **Security credentials**
3. Dans la section **Multi-factor authentication (MFA)**, clique sur **Assign MFA device**
4. Choisis **Authenticator app**
5. Scanne le QR code avec ton application d'authentification (Google Authenticator, Authy)
6. Entre deux codes consecutifs generes par l'application
7. Clique sur **Assign MFA**

**Résultat attendu** :

```text
Le MFA est actif sur ton compte. A chaque connexion a la console,
un code temporaire sera demande en plus du mot de passe.
```

---

### Étape 6 : Consulter les journaux CloudTrail

```bash
# Lister les evenements recents (derniere heure)
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=CreateUser \
  --max-results 5

# Voir les evenements d'un utilisateur specifique
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=Username,AttributeValue=dev-alice \
  --max-results 10
```

**Résultat attendu** :

```json
{
    "Events": [
        {
            "EventId": "abc-123-def",
            "EventName": "CreateUser",
            "EventTime": "2025-01-15T10:30:00Z",
            "Username": "thomas",
            "Resources": [
                {
                    "ResourceName": "dev-alice",
                    "ResourceType": "AWS::IAM::User"
                }
            ]
        }
    ]
}
```

---

### Étape 7 : Nettoyer les ressources

```bash
# Detacher la politique du groupe
aws iam detach-group-policy \
  --group-name developpeurs \
  --policy-arn arn:aws:iam::123456789012:policy/S3ReadOnlyMonBucket

# Supprimer la politique
aws iam delete-policy --policy-arn arn:aws:iam::123456789012:policy/S3ReadOnlyMonBucket

# Retirer l'utilisateur du groupe
aws iam remove-user-from-group --user-name dev-alice --group-name developpeurs

# Supprimer les cles d'acces de l'utilisateur
aws iam delete-access-key --user-name dev-alice --access-key-id AKIAIOSFODNN7EXAMPLE

# Supprimer l'utilisateur
aws iam delete-user --user-name dev-alice

# Supprimer le groupe
aws iam delete-group --group-name developpeurs

# Detacher la politique du role et supprimer le role
aws iam detach-role-policy \
  --role-name lambda-s3-reader \
  --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess
aws iam delete-role --role-name lambda-s3-reader
```

**Résultat attendu** :

```text
Toutes les ressources IAM sont supprimees.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws iam create-user` | Créer un utilisateur |
| `aws iam create-group` | Créer un groupe |
| `aws iam add-user-to-group` | Ajouter un utilisateur a un groupe |
| `aws iam create-policy` | Créer une politique |
| `aws iam attach-group-policy` | Attacher une politique a un groupe |
| `aws iam create-role` | Créer un rôle |
| `aws iam attach-role-policy` | Attacher une politique a un rôle |
| `aws cloudtrail lookup-events` | Consulter les événements d'audit |
| `aws sts get-caller-identity` | Vérifier l'identité courante |

---

## Pièges Fréquents

### Piège 1 : Utiliser le compte root au quotidien

**Problème** : Le compte root a un accès illimité a tous les services et a la facturation. Si ses identifiants sont compromis, l'attaquant a un controle total.

**Solution** : N'utilise jamais le compte root pour les taches quotidiennes. Active le MFA sur le compte root et réserve-le aux opérations qui l'exigent (changement du plan de support, fermeture du compte, récupération d'urgence).

Pour le travail quotidien :

1. Prefere **IAM Identity Center** (SSO) avec des rôles a credentials temporaires, plutôt que des utilisateurs IAM avec clés d'accès permanentes
2. Si tu dois créer un utilisateur IAM (lab, CLI simple), donne-lui uniquement les permissions nécessaires a sa tache (principe du moindre privilege)
3. Réserve `AdministratorAccess` a un rôle ou compte de **break-glass** (urgence), pas a un usage quotidien. Un admin full-access peut supprimer la production par erreur

En lab personnel, un utilisateur admin avec MFA peut être acceptable pour découvrir les services. En équipe ou en production, applique toujours le moindre privilege.

### Piège 2 : Donner `*` (tout) comme permission

**Problème** : Une politique avec `"Action": "*"` et `"Resource": "*"` donne accès a tout. Si un service avec cette politique est compromis, l'attaquant peut faire n'importe quoi dans ton compte.

**Solution** : Applique le principe du moindre privilege. Liste explicitement les actions nécessaires et limite les ressources a celles qui sont réellement utilisées.

```json
{
    "Effect": "Allow",
    "Action": ["s3:GetObject"],
    "Resource": "arn:aws:s3:::mon-bucket-specifique/*"
}
```

### Piège 3 : Ne pas supprimer les clés d'accès inutilisees

**Problème** : Un ancien employé garde ses clés d'accès actives. Il peut toujours accéder aux ressources cloud après son départ.

**Solution** : Audite régulièrement les clés d'accès et desactive celles qui ne sont plus utilisées.

```bash
# Generer un rapport des credentials
aws iam generate-credential-report
aws iam get-credential-report --output text --query Content | base64 -d
```

---

## Checklist de Validation

- [ ] Je sais créer un utilisateur IAM et lui attribuer des permissions
- [ ] Je comprends la difference entre utilisateur, groupe et rôle
- [ ] Je sais écrire une politique IAM en JSON
- [ ] Je connais le principe du moindre privilege et je sais l'appliquer
- [ ] Je sais pourquoi le MFA est important et comment l'activer
- [ ] Je sais consulter les journaux CloudTrail pour auditer les actions

---

## Exercice Pratique

**Énoncé** : Tu geres une équipe de trois personnes avec les besoins suivants :

1. **Alice** (développeur) : doit pouvoir lire et écrire dans le bucket S3 `app-assets` et déployer des fonctions Lambda
2. **Bob** (ops) : doit pouvoir gérer les instances EC2 (lancer, arrêter, terminer) et configurer les security groups
3. **Carol** (manager) : doit pouvoir consulter la facturation et lire les logs CloudTrail, sans toucher a l'infrastructure

Créé :

- Trois groupes IAM avec les permissions appropriees
- Une politique IAM pour chaque groupe
- Ajoute chaque utilisateur au bon groupe

**Indications** :

- Utilise des politiques managées AWS quand c'est possible (`AmazonEC2FullAccess`, `AWSLambda_FullAccess`, etc.)
- Créé des politiques personnalisees quand les politiques managées donnent trop de permissions
- Respecte le principe du moindre privilege

**Résultat attendu** : Les trois fichiers JSON des politiques et les commandes CLI pour créer les groupes et attacher les politiques.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Groupe "développeurs" (Alice)** :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "S3AppAssets",
            "Effect": "Allow",
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:DeleteObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::app-assets",
                "arn:aws:s3:::app-assets/*"
            ]
        },
        {
            "Sid": "LambdaDeploy",
            "Effect": "Allow",
            "Action": [
                "lambda:CreateFunction",
                "lambda:UpdateFunctionCode",
                "lambda:UpdateFunctionConfiguration",
                "lambda:InvokeFunction",
                "lambda:GetFunction",
                "lambda:ListFunctions"
            ],
            "Resource": "*"
        }
    ]
}
```

**Groupe "ops" (Bob)** :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EC2Management",
            "Effect": "Allow",
            "Action": [
                "ec2:RunInstances",
                "ec2:StartInstances",
                "ec2:StopInstances",
                "ec2:TerminateInstances",
                "ec2:DescribeInstances",
                "ec2:DescribeSecurityGroups",
                "ec2:CreateSecurityGroup",
                "ec2:AuthorizeSecurityGroupIngress",
                "ec2:RevokeSecurityGroupIngress",
                "ec2:DeleteSecurityGroup"
            ],
            "Resource": "*"
        }
    ]
}
```

**Groupe "managers" (Carol)** :

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "BillingReadOnly",
            "Effect": "Allow",
            "Action": [
                "billing:GetBillingData",
                "billing:GetBillingDetails",
                "ce:GetCostAndUsage",
                "budgets:ViewBudget"
            ],
            "Resource": "*"
        },
        {
            "Sid": "CloudTrailReadOnly",
            "Effect": "Allow",
            "Action": [
                "cloudtrail:LookupEvents",
                "cloudtrail:GetTrailStatus",
                "cloudtrail:DescribeTrails"
            ],
            "Resource": "*"
        }
    ]
}
```

> **Note - actions `billing:*`** : Les anciennes actions `aws-portal:ViewBilling` et `aws-portal:ViewUsage` sont dépréciées depuis novembre 2023 et ne fonctionnent plus sur les nouveaux comptes AWS. Utilise `billing:GetBillingData`, `billing:GetBillingDetails` et `ce:GetCostAndUsage` (Cost Explorer) à la place.

Commandes pour créer les groupes et attacher les politiques :

```bash
# Creer les groupes
aws iam create-group --group-name developpeurs
aws iam create-group --group-name ops
aws iam create-group --group-name managers

# Creer les utilisateurs
aws iam create-user --user-name alice
aws iam create-user --user-name bob
aws iam create-user --user-name carol

# Ajouter aux groupes
aws iam add-user-to-group --user-name alice --group-name developpeurs
aws iam add-user-to-group --user-name bob --group-name ops
aws iam add-user-to-group --user-name carol --group-name managers

# Creer et attacher les politiques (repeter pour chaque groupe)
aws iam create-policy --policy-name DevPolicy --policy-document file://dev-policy.json
aws iam attach-group-policy --group-name developpeurs \
  --policy-arn arn:aws:iam::123456789012:policy/DevPolicy
```

---

## Navigation

← Fiche précédente : **[04 - Réseau cloud](04-cloud-reseau.md)**

→ Fiche suivante : **[06 - Infrastructure as Code](06-infrastructure-as-code.md)**
