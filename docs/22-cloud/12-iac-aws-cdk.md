---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Infrastructure as Code avec AWS CDK : définir l'infrastructure en TypeScript ou Python, constructs L1/L2/L3, stacks, cdk synth/diff/deploy et comparaison avec Terraform."
estimated_time: "85 min"
fiche_number: 12
total_fiches: 13
cursus: "Cloud"
---

# 12 - Infrastructure as Code avec AWS CDK

> **En bref** : Tu découvriras l'AWS CDK, un outil qui permet de décrire ton infrastructure cloud dans un vrai langage de programmation (TypeScript ou Python) au lieu d'un langage déclaratif. Tu apprendras les constructs, les stacks, le cycle synth/diff/deploy, et tu sauras quand préférer le CDK à Terraform. Lecture estimée : 85 min.

## Prérequis

- Avoir lu la fiche [06 - Infrastructure as Code](06-infrastructure-as-code.md) pour comprendre l'IaC déclarative avec Terraform (provider, resource, state, plan/apply)
- Avoir lu la fiche [05 - IAM et sécurité](05-iam-securite.md) pour les rôles et politiques IAM
- Avoir un compte AWS configuré avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))
- Connaître les bases de TypeScript (cursus [TypeScript](../07-typescript/index.md)) ou de Python (cursus [Python](../15-python/index.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras initialiser un projet CDK, écrire une stack en TypeScript qui crée des ressources AWS, distinguer les trois niveaux de constructs (L1, L2, L3), exécuter le cycle `cdk synth` / `cdk diff` / `cdk deploy`, et expliquer les différences entre le CDK et Terraform pour choisir le bon outil.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'AWS CDK ?

**Définition** : L'AWS CDK (Cloud Development Kit) est un framework open source qui permet de définir une infrastructure cloud en utilisant un langage de programmation classique (TypeScript, Python, Java, C#, Go). Le code est ensuite transformé en un modèle CloudFormation, le service natif d'AWS qui crée réellement les ressources.

**Le problème que le CDK résout** :

Sans CDK, voici les problèmes rencontrés avec l'IaC purement déclarative (HCL de Terraform, YAML de CloudFormation) :

1. **Répétition manuelle** : Pour créer dix ressources presque identiques, il faut écrire dix blocs presque identiques. Les langages déclaratifs ont peu d'outils pour factoriser.
2. **Pas de logique réelle** : Les conditions, les boucles et le calcul de valeurs sont limités ou absents. Construire une configuration qui dépend de l'environnement (dev, prod) devient verbeux.
3. **Pas de réutilisation typée** : Difficile de packager un ensemble de ressources cohérent (un bucket sécurisé, une API complète) en un composant réutilisable et vérifié par un compilateur.

**Comment le CDK résout ces problèmes** :

| Problème | Solution apportée par le CDK |
| --- | --- |
| Répétition manuelle | Boucles et fonctions du langage : créer dix ressources avec une boucle `for` |
| Pas de logique réelle | Conditions, variables, calculs natifs du langage de programmation |
| Pas de réutilisation typée | Constructs : des classes réutilisables, vérifiées par le compilateur |

**Analogie concrète** : L'IaC déclarative (Terraform, CloudFormation) c'est comme remplir un formulaire papier : chaque case décrit une ressource, mais tu ne peux pas écrire "répète ce bloc 10 fois" sur un formulaire. Le CDK, c'est comme écrire un petit programme qui remplit le formulaire à ta place : tu gardes toute la puissance d'un langage (boucles, fonctions) pour générer le formulaire final.

**Ce que le CDK n'est PAS** :

- Le CDK n'est pas un remplaçant de CloudFormation. Au contraire, il s'appuie dessus : `cdk synth` produit un fichier CloudFormation, et c'est CloudFormation qui déploie. Le CDK est une surcouche.
- Le CDK n'est pas multi-cloud à la base. Il vise AWS (via CloudFormation). Il existe une variante, `cdktf`, qui génère du Terraform et permet le multi-cloud, mais le CDK « classique » est centré sur AWS.

---

### Constructs : les briques du CDK

**Définition** : Un construct est l'unité de base du CDK. C'est un objet qui représente un ou plusieurs composants d'infrastructure cloud. On assemble des constructs entre eux pour décrire l'ensemble de l'infrastructure, un peu comme on assemble des composants dans une application.

**Le problème que les constructs résolvent** :

Sans une notion de composant réutilisable, chaque ressource doit être configurée intégralement à la main, à chaque usage, avec tous ses paramètres de sécurité. Les constructs encapsulent les bonnes pratiques dans des objets prêts à l'emploi.

**Les trois niveaux de constructs** :

| Niveau | Nom | Description | Exemple |
| --- | --- | --- | --- |
| L1 | Constructs CFN | Correspondance directe 1-pour-1 avec une ressource CloudFormation. Préfixe `Cfn`. Tout est à configurer manuellement. | `CfnBucket` |
| L2 | Constructs de service | Une ressource AWS avec des valeurs par défaut sûres et une API simplifiée. | `Bucket` |
| L3 | Patterns | Un assemblage de plusieurs ressources qui réalise un cas d'usage complet. | `ApplicationLoadBalancedFargateService` |

**Détail des constructs L1** :

Les constructs L1 (préfixés `Cfn`) sont la traduction brute des ressources CloudFormation. Ils exposent exactement les mêmes propriétés, sans valeur par défaut. On les utilise quand un L2 n'existe pas encore ou quand on a besoin d'un contrôle total.

**Détail des constructs L2** :

Les constructs L2 sont le niveau le plus utilisé. Ils ajoutent des valeurs par défaut raisonnables, des méthodes pratiques et des vérifications. Par exemple, un `Bucket` L2 permet d'activer le chiffrement en une ligne, là où le L1 demanderait de configurer manuellement toute la structure.

**Détail des constructs L3 (patterns)** :

Les constructs L3 assemblent plusieurs ressources pour un cas d'usage complet. Par exemple, un seul construct L3 peut créer un service conteneurisé avec son load balancer, son réseau et ses rôles IAM, en quelques lignes.

**Analogie concrète** : Pense à des meubles. Le L1, c'est un kit de pièces détachées brutes (vis, planches) : tout assembler toi-même. Le L2, c'est un meuble en kit avec une notice et les bonnes vis déjà choisies : plus rapide, moins d'erreurs. Le L3, c'est une chambre complète livrée prête : lit, armoire et bureau assortis, posés ensemble.

---

### Stacks et App

**Définition** : Une stack est une unité de déploiement du CDK. Elle correspond à une stack CloudFormation : un ensemble de ressources créées, mises à jour et supprimées ensemble. Une App est le conteneur racine qui regroupe une ou plusieurs stacks.

**Hiérarchie des objets CDK** :

```text
App (racine du projet)
 └── Stack (unité de déploiement = 1 stack CloudFormation)
      └── Construct (L2, L3 ...)
           └── Construct / ressource (L1)
```

**Pourquoi découper en plusieurs stacks** :

| Raison | Bénéfice |
| --- | --- |
| Cycle de vie distinct | Déployer le réseau (rarement modifié) séparément de l'application (souvent modifiée) |
| Limite de taille | Une stack CloudFormation est limitée en nombre de ressources |
| Séparation des responsabilités | Une stack par domaine : réseau, base de données, application |
| Réutilisation entre environnements | Une même stack instanciée pour dev et pour prod |

**Ce qu'une stack n'est PAS** :

- Une stack n'est pas un simple fichier. C'est une frontière de déploiement : tout ce qu'elle contient est créé ou détruit ensemble lors d'un `cdk deploy` ou `cdk destroy`.
- Une stack n'est pas liée à un seul construct. Elle peut en contenir des dizaines, organisés en arbre.

---

### Le cycle synth / diff / deploy

**Définition** : Le CDK suit un cycle en plusieurs commandes. `cdk synth` transforme le code en modèle CloudFormation, `cdk diff` montre ce qui changerait par rapport à l'existant, et `cdk deploy` applique réellement les changements sur AWS.

**Les commandes principales** :

| Commande | Rôle | Équivalent Terraform |
| --- | --- | --- |
| `cdk synth` | Génère le template CloudFormation (JSON/YAML) à partir du code | (génération du plan interne) |
| `cdk diff` | Affiche les différences entre le code et l'infrastructure déployée | `terraform plan` |
| `cdk deploy` | Crée ou met à jour les ressources sur AWS | `terraform apply` |
| `cdk destroy` | Supprime toutes les ressources de la stack | `terraform destroy` |
| `cdk bootstrap` | Prépare le compte/région (bucket S3, rôles) pour le CDK | (initialisation du backend) |

**Pourquoi `cdk synth` est central** :

Le CDK ne déploie jamais directement. Il **synthétise** d'abord un template CloudFormation, puis ce template est déployé par CloudFormation. C'est ce qui rend le déploiement fiable : CloudFormation gère le suivi d'état, les retours arrière en cas d'échec (rollback) et la cohérence.

```text
Code TypeScript/Python
        | cdk synth
        v
Template CloudFormation (JSON)
        | cdk deploy
        v
CloudFormation crée les ressources AWS
```

**Analogie concrète** : `cdk synth` c'est comme compiler du code source en exécutable. Tu écris dans un langage lisible (TypeScript), et la compilation produit un format que la machine sait exécuter (le template CloudFormation). `cdk deploy` revient à lancer cet exécutable sur AWS.

---

### CDK vs Terraform

**Définition** : Le CDK et Terraform sont deux approches de l'Infrastructure as Code. Le CDK utilise un langage de programmation impératif (TypeScript, Python) et cible principalement AWS via CloudFormation. Terraform utilise un langage déclaratif dédié (HCL) et gère de nombreux fournisseurs (multi-cloud).

**Comparaison CDK vs Terraform** :

| Critère | AWS CDK | Terraform |
| --- | --- | --- |
| Langage | Programmation (TypeScript, Python, Java, C#, Go) | Déclaratif dédié (HCL) |
| Fournisseurs | AWS surtout (via CloudFormation) | Multi-cloud (AWS, GCP, Azure, et plus de 1000 providers) |
| Gestion d'état | Déléguée à CloudFormation (côté AWS) | Fichier d'état (`terraform.tfstate`) à gérer/stocker |
| Logique (boucles, conditions) | Native au langage | Limitée (`count`, `for_each`, expressions) |
| Courbe d'apprentissage | Plus douce si on connaît déjà le langage | Apprendre HCL, mais syntaxe simple et stable |
| Aperçu des changements | `cdk diff` | `terraform plan` (souvent jugé plus lisible) |
| Réutilisation | Constructs (classes, packages npm/pip) | Modules |

**Quand choisir le CDK** :

- L'infrastructure est principalement (ou uniquement) sur AWS.
- L'équipe est composée de développeurs à l'aise avec TypeScript ou Python.
- On veut une forte logique de génération (beaucoup de ressources dérivées d'une configuration).

**Quand choisir Terraform** :

- L'infrastructure est multi-cloud ou hybride (AWS + GCP + on-premise).
- On préfère un langage déclaratif stable, lu facilement par toute l'équipe (y compris non-développeurs).
- On veut un large écosystème de providers tiers.

**Ce que le CDK n'est PAS face à Terraform** :

- Le CDK n'est pas « meilleur » que Terraform dans l'absolu. C'est un choix d'approche : impératif et centré AWS, contre déclaratif et multi-cloud. Le bon outil dépend du contexte.
- Le CDK ne supprime pas le besoin de comprendre l'infrastructure sous-jacente. Un construct L2 masque la complexité, mais une mauvaise configuration reste possible.

---

### Limites du CDK

**Définition** : Le CDK apporte de la puissance, mais aussi des contraintes qu'il faut connaître avant de l'adopter.

**Principales limites** :

| Limite | Conséquence |
| --- | --- |
| Dépendance à CloudFormation | Hérite des limites de CloudFormation (vitesse de déploiement, quotas, messages d'erreur parfois opaques) |
| Verrouillage AWS | Le CDK classique cible AWS ; migrer vers un autre cloud demande une réécriture |
| Code = plus de liberté = plus de risques | La puissance du langage permet aussi d'écrire une infrastructure désordonnée |
| Bootstrap requis | Chaque compte/région doit être préparé via `cdk bootstrap` avant le premier déploiement |

**Conseil** : Pour garder un code CDK maintenable, limite la logique complexe, nomme clairement tes stacks et constructs, et privilégie les constructs L2 (équilibre entre contrôle et simplicité).

---

## Étapes Pratiques

### Étape 1 : Installer et initialiser un projet CDK

Le CDK s'installe via npm. CDK v2 requiert Node.js >= 18 ; Node.js 22 LTS est recommandé en 2026 (Node.js 20 LTS est passé en End-of-Life en avril 2026).

```bash
# Installer la CLI du CDK globalement
npm install -g aws-cdk
```

```bash
# Vérifier la version installée
cdk --version
```

**Résultat attendu** :

```text
2.150.0 (build abc1234)
```

```bash
# Créer un dossier de projet et initialiser une application CDK en TypeScript
mkdir mon-infra-cdk && cd mon-infra-cdk
cdk init app --language typescript
```

**Résultat attendu** (extrait) :

```text
Applying project template app for typescript
# Welcome to your CDK TypeScript project
...
✅ All done!
```

L'initialisation crée notamment :

- `bin/mon-infra-cdk.ts` : le point d'entrée (l'App)
- `lib/mon-infra-cdk-stack.ts` : la définition de la stack
- `cdk.json` : la configuration du projet

---

### Étape 2 : Préparer le compte AWS (bootstrap)

Avant le premier déploiement dans un compte et une région, il faut exécuter le bootstrap. Il crée les ressources techniques dont le CDK a besoin (un bucket S3 pour les artefacts, des rôles IAM).

```bash
# Préparer le compte et la région courante pour le CDK
cdk bootstrap
```

**Résultat attendu** (extrait) :

```text
 ⏳  Bootstrapping environment aws://123456789012/eu-west-1...
 ✅  Environment aws://123456789012/eu-west-1 bootstrapped.
```

**Note** : Le bootstrap n'est nécessaire qu'une seule fois par couple compte/région.

---

### Étape 3 : Écrire une stack qui crée un bucket S3 sécurisé

On édite le fichier `lib/mon-infra-cdk-stack.ts` pour créer un bucket S3 avec un construct L2.

```typescript
// Import du coeur du CDK (Stack, App, etc.)
import * as cdk from "aws-cdk-lib";
// Import du module S3 (constructs L2 du service S3)
import * as s3 from "aws-cdk-lib/aws-s3";
// Construct est le type de base passé au constructeur de la stack
import { Construct } from "constructs";

// Une stack est une classe qui hérite de cdk.Stack
export class MonInfraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    // On appelle le constructeur parent (obligatoire)
    super(scope, id, props);

    // Construct L2 : un bucket S3 avec de bonnes valeurs par défaut
    new s3.Bucket(this, "BucketDocuments", {
      // Chiffrement géré par S3, activé en une ligne grâce au L2
      encryption: s3.BucketEncryption.S3_MANAGED,
      // Bloque tout accès public (sécurité par défaut)
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // Active le versioning pour garder l'historique des objets
      versioned: true,
      // À la suppression de la stack, on détruit le bucket (pratique en dev)
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      // Vide le bucket avant suppression (sinon la destruction échoue)
      autoDeleteObjects: true,
    });
  }
}
```

Le point d'entrée `bin/mon-infra-cdk.ts` instancie l'App et la stack :

```typescript
#!/usr/bin/env node
import * as cdk from "aws-cdk-lib";
import { MonInfraCdkStack } from "../lib/mon-infra-cdk-stack";

// L'App est le conteneur racine
const app = new cdk.App();

// On instancie la stack avec un nom logique
new MonInfraCdkStack(app, "MonInfraCdkStack", {});
```

---

### Étape 4 : Synthétiser le template CloudFormation

```bash
# Transformer le code en template CloudFormation, sans rien déployer
cdk synth
```

**Résultat attendu** (extrait du template généré) :

```yaml
Resources:
  BucketDocuments...:
    Type: AWS::S3::Bucket
    Properties:
      BucketEncryption:
        ServerSideEncryptionConfiguration:
          - ServerSideEncryptionByDefault:
              SSEAlgorithm: AES256
      PublicAccessBlockConfiguration:
        BlockPublicAcls: true
        ...
      VersioningConfiguration:
        Status: Enabled
```

Tu vois que les quelques lignes de TypeScript du construct L2 ont généré un template CloudFormation complet, avec toutes les options de chiffrement et de blocage d'accès public développées.

---

### Étape 5 : Comparer avec l'infrastructure existante (diff)

```bash
# Afficher ce qui changerait si on déployait maintenant
cdk diff
```

**Résultat attendu** (premier déploiement, tout est nouveau) :

```text
Stack MonInfraCdkStack
Resources
[+] AWS::S3::Bucket BucketDocuments BucketDocuments... 
```

Ce que tu vois :

- `[+]` : une ressource va être ajoutée
- `[-]` indiquerait une suppression, `[~]` une modification

C'est l'équivalent du `terraform plan` : tu valides l'impact avant d'agir.

---

### Étape 6 : Déployer puis détruire la stack

```bash
# Créer réellement les ressources sur AWS
cdk deploy
```

**Résultat attendu** (extrait) :

```text
MonInfraCdkStack: deploying...
 ✅  MonInfraCdkStack

✨  Deployment time: 38.7s
```

```bash
# Quand tu n'as plus besoin de l'infrastructure, tout supprimer
cdk destroy
```

**Résultat attendu** :

```text
Are you sure you want to delete: MonInfraCdkStack (y/n)? y
MonInfraCdkStack: destroying...
 ✅  MonInfraCdkStack: destroyed
```

**Note** : Comme on a mis `removalPolicy: DESTROY` et `autoDeleteObjects: true`, le bucket et son contenu sont supprimés proprement. En production, on conserve généralement les buckets (`RemovalPolicy.RETAIN`).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `cdk init app --language typescript` | Initialiser un nouveau projet CDK en TypeScript |
| `cdk init app --language python` | Initialiser un nouveau projet CDK en Python |
| `cdk bootstrap` | Préparer un compte/région pour le CDK (une fois) |
| `cdk synth` | Générer le template CloudFormation à partir du code |
| `cdk diff` | Afficher les différences avec l'infrastructure déployée |
| `cdk deploy` | Créer ou mettre à jour les ressources sur AWS |
| `cdk destroy` | Supprimer toutes les ressources de la stack |
| `cdk ls` | Lister les stacks de l'application |

---

## Pièges Fréquents

### Piège 1 : Oublier le bootstrap avant le premier déploiement

⚠️ **Problème** : Au premier `cdk deploy`, tu obtiens une erreur du type `This stack uses assets, so the toolkit stack must be deployed to the environment (Run "cdk bootstrap")`.

✅ **Solution** : Le CDK a besoin de ressources techniques (bucket S3, rôles) dans le compte et la région ciblés. Exécute le bootstrap une fois par couple compte/région avant tout déploiement :

```bash
cdk bootstrap aws://123456789012/eu-west-1
```

---

### Piège 2 : Confondre `cdk synth` et `cdk deploy`

⚠️ **Problème** : Tu lances `cdk synth`, tu vois le template, et tu crois que l'infrastructure est déployée. En réalité, rien n'a été créé sur AWS.

✅ **Solution** : `cdk synth` ne fait que générer le template CloudFormation localement (comme une compilation). C'est `cdk deploy` qui crée réellement les ressources. Pense au cycle : `synth` (compiler) -> `diff` (vérifier) -> `deploy` (appliquer).

---

### Piège 3 : Utiliser un construct L1 quand un L2 existe

⚠️ **Problème** : Tu écris beaucoup de code avec des constructs `Cfn...` (L1) et tu dois configurer chaque détail de sécurité manuellement, en oubliant parfois le chiffrement ou le blocage d'accès public.

✅ **Solution** : Utilise les constructs L2 par défaut. Ils appliquent des valeurs par défaut sûres et exposent une API simple. Ne descends au L1 que lorsqu'un L2 n'existe pas pour la fonctionnalité voulue.

```typescript
// À éviter si un L2 existe : L1 (CfnBucket), tout à configurer
// Préférer le L2 (Bucket) avec ses options de haut niveau
new s3.Bucket(this, "Bucket", { encryption: s3.BucketEncryption.S3_MANAGED });
```

---

### Piège 4 : Détruire un bucket non vide

⚠️ **Problème** : `cdk destroy` échoue avec une erreur indiquant que le bucket S3 n'est pas vide et ne peut pas être supprimé.

✅ **Solution** : CloudFormation refuse de supprimer un bucket qui contient des objets. En développement, ajoute `autoDeleteObjects: true` pour vider automatiquement le bucket avant suppression. En production, on garde généralement les données (`removalPolicy: RETAIN`).

```typescript
new s3.Bucket(this, "Bucket", {
  removalPolicy: cdk.RemovalPolicy.DESTROY,
  autoDeleteObjects: true, // Vide le bucket avant de le détruire
});
```

---

### Piège 5 : Mettre toute l'infrastructure dans une seule stack géante

⚠️ **Problème** : Une seule stack contient le réseau, la base de données et l'application. Chaque petit changement applicatif redéploie tout, et tu atteins la limite de ressources d'une stack CloudFormation.

✅ **Solution** : Découpe en plusieurs stacks selon le cycle de vie : une stack réseau (stable), une stack base de données, une stack application (changée souvent). Chaque stack se déploie indépendamment, ce qui réduit le risque et accélère les mises à jour.

---

## Checklist de Validation

- [ ] J'ai installé la CLI CDK et initialisé un projet en TypeScript
- [ ] J'ai exécuté `cdk bootstrap` sur mon compte/région
- [ ] J'ai écrit une stack qui crée un bucket S3 avec un construct L2
- [ ] Je distingue les constructs L1, L2 et L3 et je sais quand utiliser chacun
- [ ] J'ai généré un template avec `cdk synth` et vérifié les changements avec `cdk diff`
- [ ] J'ai déployé puis détruit la stack avec `cdk deploy` et `cdk destroy`
- [ ] Je sais expliquer au moins trois différences entre le CDK et Terraform
- [ ] Je sais dans quels cas préférer le CDK et dans quels cas préférer Terraform

---

## Exercice Pratique

**Énoncé** : Tu dois créer une stack CDK en TypeScript qui provisionne une file de messages SQS et une fonction Lambda déclenchée par cette file, en réutilisant ce que tu as appris sur Lambda (fiche [11 - Serverless](11-serverless-api-gateway-lambda.md)).

**Spécifications** :

- Une file SQS nommée logiquement `FileTraitement`.
- Une fonction Lambda en Python qui lit les messages de la file et écrit un log.
- La Lambda doit avoir la permission de consommer la file (le construct L2 doit gérer l'IAM automatiquement).

**Étapes à réaliser** :

1. Réutiliser le projet CDK initialisé plus haut.
2. Importer les modules `aws-sqs` et `aws-lambda`, ainsi que le module de source d'événement.
3. Créer la file, puis la fonction, puis lier les deux.
4. Vérifier avec `cdk synth` que les ressources et les permissions IAM sont générées.

**Indications** :

- Modules à importer : `aws-cdk-lib/aws-sqs`, `aws-cdk-lib/aws-lambda`, `aws-cdk-lib/aws-lambda-event-sources`.
- Le construct L2 `lambda.Function` attend un `runtime`, un `handler` et un `code`.
- Pour brancher la file sur la Lambda, utilise `fonction.addEventSource(new SqsEventSource(file))`. Le L2 ajoute alors automatiquement les permissions IAM de lecture sur la file.

**Résultat attendu** : `cdk synth` produit un template contenant une ressource `AWS::SQS::Queue`, une ressource `AWS::Lambda::Function`, et une politique IAM autorisant la Lambda à lire la file.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Code de la stack** (`lib/mon-infra-cdk-stack.ts`) :

```typescript
import * as cdk from "aws-cdk-lib";
import * as sqs from "aws-cdk-lib/aws-sqs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { SqsEventSource } from "aws-cdk-lib/aws-lambda-event-sources";
import { Construct } from "constructs";

export class MonInfraCdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. Créer la file SQS (construct L2)
    const file = new sqs.Queue(this, "FileTraitement", {
      // Délai de visibilité : temps pendant lequel un message lu est masqué
      visibilityTimeout: cdk.Duration.seconds(30),
    });

    // 2. Créer la fonction Lambda en Python (construct L2)
    const fonction = new lambda.Function(this, "TraiterMessages", {
      runtime: lambda.Runtime.PYTHON_3_12, // Runtime Python 3.12
      handler: "index.handler",            // Fichier index.py, fonction handler
      // Code inline pour l'exemple (en pratique : lambda.Code.fromAsset("chemin"))
      code: lambda.Code.fromInline(
        "def handler(event, context):\n" +
        "    # Chaque enregistrement correspond à un message SQS\n" +
        "    for record in event['Records']:\n" +
        "        print('Message reçu :', record['body'])\n" +
        "    return {'statusCode': 200}\n"
      ),
    });

    // 3. Brancher la file sur la Lambda.
    // Le L2 ajoute AUTOMATIQUEMENT les permissions IAM de lecture sur la file.
    fonction.addEventSource(new SqsEventSource(file));
  }
}
```

**Synthèse et vérification** :

```bash
# Générer le template et vérifier les ressources créées
cdk synth
```

Dans le template généré, tu retrouves trois éléments clés :

```text
AWS::SQS::Queue          -> la file FileTraitement
AWS::Lambda::Function    -> la fonction TraiterMessages
AWS::IAM::Policy         -> autorise la Lambda à lire la file (sqs:ReceiveMessage, etc.)
```

**Point clé** : tu n'as écrit aucune politique IAM à la main. La méthode `addEventSource` du construct L2 a généré automatiquement les permissions nécessaires (`sqs:ReceiveMessage`, `sqs:DeleteMessage`, `sqs:GetQueueAttributes`). C'est l'un des grands avantages des constructs de haut niveau : les bonnes pratiques IAM sont appliquées par défaut.

```bash
# Déployer pour tester réellement, puis nettoyer
cdk deploy
cdk destroy
```

---

## Navigation

← Fiche précédente : **[11 - Serverless : API Gateway + Lambda](11-serverless-api-gateway-lambda.md)**

→ Fiche suivante : **[13 - FinOps : maîtriser les coûts cloud](13-finops-optimisation-couts.md)**
