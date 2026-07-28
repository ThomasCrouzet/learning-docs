---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Serverless avec API Gateway et Lambda : modèle serverless, fonctions Lambda, déclencheurs, API Gateway, cold start, IAM minimal, cas d'usage et coût."
estimated_time: "80 min"
fiche_number: 11
total_fiches: 13
cursus: "Cloud"
---

# 11 - Serverless : API Gateway + Lambda

> **En bref** : Tu découvriras le modèle serverless, comment créer des fonctions Lambda déclenchées par API Gateway, comment configurer les permissions IAM nécessaires et comprendre les implications en termes de performance (cold start) et de coût. Lecture estimée : 80 min.

## Prérequis

- Avoir lu la fiche [05 - IAM et sécurité](05-iam-securite.md) pour comprendre les rôles et politiques IAM
- Avoir lu la fiche [08 - Conteneurs dans le cloud](08-conteneurs-cloud.md) pour connaître les alternatives serverless vs conteneurs
- Avoir un compte AWS configuré avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une fonction Lambda en Python ou Node.js, la déclencher via API Gateway, configurer les permissions IAM minimales nécessaires, comprendre le phénomène de cold start et savoir quand choisir le serverless plutôt que les conteneurs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le modèle serverless ?

**Définition** : Le serverless (sans serveur) est un modèle d'exécution cloud où le fournisseur gère entièrement l'infrastructure. Tu déploies du code (une "fonction"), et le cloud l'exécute à la demande. Tu ne gères ni serveurs, ni système d'exploitation, ni capacité.

**Le problème que le serverless résout** :

Sans serverless, voici les problèmes rencontrés :

1. **Sur-provisionnement** : Pour gérer les pics de charge, tu dois prévoir des serveurs pour le maximum de trafic prévu - même si ce pic ne dure que quelques minutes par jour. Le reste du temps, les serveurs tournent à vide mais continuent à coûter.
2. **Gestion opérationnelle constante** : Mettre à jour le système d'exploitation, appliquer les patches de sécurité, surveiller la santé des serveurs - tout cela prend du temps et de l'expertise.
3. **Scaling manuel** : Quand le trafic augmente soudainement, il faut ajouter des serveurs manuellement ou configurer un auto-scaler complexe.

**Comment le serverless résout ces problèmes** :

| Problème | Solution apportée par le serverless |
| --- | --- |
| Sur-provisionnement | Tu paies uniquement le temps d'exécution réel - à la milliseconde |
| Gestion opérationnelle | AWS gère entièrement l'infrastructure, les patches et la disponibilité |
| Scaling manuel | Scaling automatique de 0 à des milliers d'exécutions simultanées en quelques secondes |

**Analogie concrète** : Le serverless c'est comme un taxi à la demande. Tu ne paies que les kilomètres parcourus, pas le fait que la voiture est garée quelque part. Avec un serveur classique, c'est comme avoir sa propre voiture : tu paies l'assurance, l'entretien et le stationnement même quand elle ne roule pas.

**Ce que le serverless n'est PAS** :

- Le serverless n'est pas "sans serveur" au sens physique. Il y a des serveurs, mais ils appartiennent au fournisseur cloud. Toi, tu n'en gères aucun.
- Le serverless n'est pas adapté à tous les cas d'usage. Les traitements longs (plus de **15 minutes** pour une invocation Lambda), les applications avec un **état local durable** sur l'instance, ou les charges avec des **connexions TCP très longues tenues par le runtime** (ex. un serveur de jeu avec des milliers de sockets ouverts en continu) restent souvent mieux sur VM ou conteneurs.
- Les **WebSockets sont supportés** côté AWS via **API Gateway WebSocket API** + Lambda (chaque message peut invoquer une fonction). Les bases de données aussi : le point sensible n'est pas "interdit", c'est le **pool de connexions** (trop d'invocations concurrentes = trop de connexions RDS). Préfère alors RDS Proxy, ou un store serverless (DynamoDB).

---

### AWS Lambda : les fonctions serverless d'Amazon

**Définition** : AWS Lambda est le service de fonctions serverless d'Amazon. Une fonction Lambda est un morceau de code (Python, Node.js, Java, Go, etc.) qui s'exécute en réponse à un déclencheur.

**Caractéristiques de Lambda** :

| Paramètre | Valeur |
| --- | --- |
| Durée maximale d'exécution | 15 minutes |
| Mémoire configurable | 128 Mo à 10 240 Mo |
| CPU | Proportionnel à la mémoire allouée |
| Espace disque temporaire | 512 Mo à 10 Go (dans `/tmp`) |
| Taille du package de déploiement | 50 Mo (zip upload direct), 250 Mo décompressé (zip + layers) ; jusqu'à **10 Go** en image conteneur |
| Concurrence par défaut | 1 000 exécutions simultanées par compte et par région |

**Structure d'une fonction Lambda** :

Chaque fonction Lambda doit avoir un **handler** - la fonction principale appelée par Lambda à chaque invocation.

En Python :

```python
import json

def handler(event, context):
    """
    Point d'entrée de la fonction Lambda.
    
    event : dict contenant les données de l'événement déclencheur
    context : objet avec les informations sur l'exécution (durée restante, ID de la requête, etc.)
    """
    # Extraire les données de l'événement
    nom = event.get("nom", "monde")
    
    # Logique métier
    message = f"Bonjour, {nom} !"
    
    # Retourner une réponse HTTP (pour API Gateway)
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({"message": message})
    }
```

En Node.js :

```javascript
exports.handler = async (event) => {
    // Extraire les données de l'événement
    const nom = event.queryStringParameters?.nom || "monde";
    
    // Logique métier
    const message = `Bonjour, ${nom} !`;
    
    // Retourner une réponse HTTP (pour API Gateway)
    return {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    };
};
```

---

### Déclencheurs Lambda

**Définition** : Un déclencheur (trigger) est un service AWS qui invoque ta fonction Lambda quand un événement se produit.

**Principaux déclencheurs** :

| Déclencheur | Cas d'usage typique |
| --- | --- |
| API Gateway | Exposer une API HTTP REST ou WebSocket |
| S3 | Traiter un fichier dès qu'il est téléversé (redimensionner une image, parser un CSV) |
| CloudWatch Events | Exécuter une tâche planifiée (cron Lambda) |
| SQS (file de messages) | Traiter des messages en arrière-plan de manière asynchrone |
| DynamoDB Streams | Réagir aux modifications d'une table DynamoDB |
| SNS | Envoyer des notifications en réponse à des événements |

**Cette fiche se concentre sur API Gateway**, qui est le déclencheur le plus courant pour exposer une API web.

---

### API Gateway

**Définition** : Amazon API Gateway est un service qui crée, publie et gère des API HTTP. Il reçoit les requêtes des clients, les transmet à Lambda (ou d'autres services), et renvoie les réponses.

**Le problème que API Gateway résout** :

Sans API Gateway, une fonction Lambda n'est pas directement accessible depuis Internet. Il faut un service intermédiaire qui :

- Écoute sur un port HTTP/HTTPS public
- Route les requêtes vers la bonne fonction Lambda
- Gère l'authentification, le throttling (limitation de débit) et le CORS
- Génère une URL HTTPS publique avec un certificat TLS valide

**Types d'API dans API Gateway** :

| Type | Description | Usage |
| --- | --- | --- |
| HTTP API | Plus simple, moins de fonctionnalités, moins cher | APIs REST simples (recommandé) |
| REST API | Complet, plus cher, plus de configuration | APIs complexes avec transformations, clés API |
| WebSocket API | Connexions bidirectionnelles persistantes | Chat, notifications temps réel |

**Pour la plupart des nouveaux projets, utiliser HTTP API** - c'est moins cher et plus simple.

**Flux d'une requête API Gateway + Lambda** :

```text
Client (navigateur, app mobile)
    |
    | HTTPS POST /api/bonjour?nom=Alice
    v
API Gateway
    |
    | Invocation Lambda avec l'événement formaté
    v
Lambda (handler Python/Node.js)
    |
    | Retour : { statusCode: 200, body: '{"message":"Bonjour, Alice !"}' }
    v
API Gateway
    |
    | Réponse HTTP 200 avec le corps JSON
    v
Client
```

---

### Cold start : le délai de démarrage

**Définition** : Le cold start (démarrage à froid) est le délai supplémentaire lors de la première invocation d'une fonction Lambda, ou après une longue période d'inactivité. AWS doit allouer un conteneur, charger le runtime et initialiser la fonction.

**Le problème du cold start** :

| Phase | Durée typique |
| --- | --- |
| Allocation du conteneur | 100-500 ms |
| Chargement du runtime (Python, Node.js) | 100-500 ms |
| Initialisation du code (imports, connexions) | Variable selon la fonction |
| **Cold start total** | **200 ms à 2+ secondes** |
| Exécution normale (warm start) | Quelques ms |

**Facteurs qui influencent le cold start** :

1. **Langage** : Python et Node.js ont des cold starts plus courts que Java ou .NET
2. **Taille du package** : Plus le code est gros, plus le chargement est long
3. **Mémoire allouée** : Plus de mémoire = plus de CPU = cold start plus court
4. **VPC** : Les fonctions dans un VPC avaient historiquement des cold starts plus longs ; depuis la migration Firecracker d'AWS (2019) et les améliorations ENI, ce surcoût est devenu quasi nul sur les configurations modernes (notamment Graviton)

**Stratégies pour réduire l'impact** :

| Stratégie | Mécanisme |
| --- | --- |
| Provisioned Concurrency | AWS garde des instances préchauffées - coût supplémentaire |
| SnapStart (Java) | AWS prend un snapshot de la JVM initialisée - réduit fortement le cold start Java |
| Garder les fonctions légères | Moins d'imports = moins de temps d'initialisation |
| Allouer plus de mémoire | Plus de CPU = initialisation plus rapide |

**Quand le cold start est acceptable** :

- APIs avec des délais tolérants (tableau de bord, rapports)
- Tâches planifiées (cron)
- Traitements de fichiers en arrière-plan

**Quand le cold start est problématique** :

- APIs temps réel (jeux, trading)
- Expérience utilisateur critique (première visite d'une page web)

---

### IAM minimal pour Lambda

**Définition** : Chaque fonction Lambda s'exécute avec un rôle IAM qui définit ses permissions. Le principe du moindre privilège s'applique : donner uniquement les permissions nécessaires.

**Rôle d'exécution minimal** :

Toute fonction Lambda a besoin au minimum de pouvoir écrire ses logs dans CloudWatch :

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}
```

**Ajouter des permissions selon les besoins** :

| Besoin | Permission à ajouter |
| --- | --- |
| Lire un bucket S3 | `s3:GetObject` sur `arn:aws:s3:::mon-bucket/*` |
| Écrire dans DynamoDB | `dynamodb:PutItem` sur l'ARN de la table |
| Publier sur SNS | `sns:Publish` sur l'ARN du topic |
| Lire des secrets | `secretsmanager:GetSecretValue` sur l'ARN du secret |

**Ce qu'il ne faut jamais faire** :

```json
{
  "Effect": "Allow",
  "Action": "*",
  "Resource": "*"
}
```

Cette politique donne à la fonction Lambda un accès complet à tout ton compte AWS. Si la fonction est compromise, l'attaquant a les clés du royaume.

---

## Étapes Pratiques

### Étape 1 : Créer le rôle IAM d'exécution

```bash
# Créer le fichier de politique de confiance
# Ce fichier dit "Lambda est autorisé à endosser ce rôle"
cat > /tmp/trust-policy.json << 'EOF'
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
```

```bash
# Créer le rôle IAM
aws iam create-role \
  --role-name lambda-bonjour-role \
  --assume-role-policy-document file:///tmp/trust-policy.json
```

**Résultat attendu** :

```json
{
    "Role": {
        "RoleName": "lambda-bonjour-role",
        "Arn": "arn:aws:iam::123456789012:role/lambda-bonjour-role",
        ...
    }
}
```

```bash
# Attacher la politique de base pour les logs CloudWatch
aws iam attach-role-policy \
  --role-name lambda-bonjour-role \
  --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole
```

---

### Étape 2 : Créer la fonction Lambda

```bash
# Créer le fichier de code Python
mkdir -p /tmp/lambda-bonjour
cat > /tmp/lambda-bonjour/handler.py << 'EOF'
import json

def handler(event, context):
    """
    Fonction Lambda qui répond avec un message de salutation.
    Accepte un paramètre 'nom' dans les query strings ou le corps JSON.
    """
    # Extraire le nom depuis les query strings (API Gateway HTTP API)
    nom = "monde"
    if event.get("queryStringParameters"):
        nom = event["queryStringParameters"].get("nom", "monde")
    elif event.get("body"):
        try:
            body = json.loads(event["body"])
            nom = body.get("nom", "monde")
        except json.JSONDecodeError:
            pass
    
    # Construire la réponse
    message = f"Bonjour, {nom} !"
    
    # Format de réponse requis par API Gateway
    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"  # CORS pour les appels depuis le navigateur
        },
        "body": json.dumps({"message": message}, ensure_ascii=False)
    }
EOF
```

```bash
# Créer le zip de déploiement
cd /tmp/lambda-bonjour && zip function.zip handler.py
```

```bash
# Récupérer l'ARN du rôle créé à l'étape précédente
ROLE_ARN=$(aws iam get-role --role-name lambda-bonjour-role --query 'Role.Arn' --output text)
echo "ARN du rôle : $ROLE_ARN"
```

```bash
# Créer la fonction Lambda
aws lambda create-function \
  --function-name bonjour \
  --runtime python3.12 \
  --zip-file fileb:///tmp/lambda-bonjour/function.zip \
  --handler handler.handler \
  --role "$ROLE_ARN" \
  --memory-size 128 \
  --timeout 10
```

**Résultat attendu** :

```json
{
    "FunctionName": "bonjour",
    "FunctionArn": "arn:aws:lambda:eu-west-1:123456789012:function:bonjour",
    "Runtime": "python3.12",
    "State": "Pending",
    ...
}
```

```bash
# Attendre que la fonction soit active
aws lambda wait function-active --function-name bonjour
echo "Fonction Lambda prête"
```

---

### Étape 3 : Tester la fonction Lambda directement

```bash
# Invoquer la fonction Lambda avec un événement de test
aws lambda invoke \
  --function-name bonjour \
  --payload '{"queryStringParameters": {"nom": "Alice"}}' \
  --cli-binary-format raw-in-base64-out \
  /tmp/response.json

# Afficher la réponse
cat /tmp/response.json
```

**Résultat attendu** :

```json
{"statusCode": 200, "headers": {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"}, "body": "{\"message\": \"Bonjour, Alice !\"}"}
```

---

### Étape 4 : Créer une API Gateway HTTP API

```bash
# Créer l'API Gateway de type HTTP
aws apigatewayv2 create-api \
  --name "api-bonjour" \
  --protocol-type HTTP \
  --description "API de salutation avec Lambda"
```

**Résultat attendu** :

```json
{
    "ApiId": "abc123def4",
    "ApiEndpoint": "https://abc123def4.execute-api.eu-west-1.amazonaws.com",
    "Name": "api-bonjour",
    ...
}
```

```bash
# Stocker l'ID de l'API pour la suite
API_ID=$(aws apigatewayv2 get-apis --query 'Items[?Name==`api-bonjour`].ApiId' --output text)
echo "API ID : $API_ID"
```

```bash
# Récupérer l'ARN de la fonction Lambda
LAMBDA_ARN=$(aws lambda get-function --function-name bonjour --query 'Configuration.FunctionArn' --output text)
REGION=$(aws configure get region)
ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
```

```bash
# Créer l'intégration Lambda dans l'API Gateway
aws apigatewayv2 create-integration \
  --api-id "$API_ID" \
  --integration-type AWS_PROXY \
  --integration-uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
  --payload-format-version "2.0"
```

```bash
# Récupérer l'ID de l'intégration
INTEGRATION_ID=$(aws apigatewayv2 get-integrations --api-id "$API_ID" --query 'Items[0].IntegrationId' --output text)
```

```bash
# Créer la route GET /bonjour
aws apigatewayv2 create-route \
  --api-id "$API_ID" \
  --route-key "GET /bonjour" \
  --target "integrations/$INTEGRATION_ID"
```

```bash
# Créer le déploiement (stage $default)
aws apigatewayv2 create-stage \
  --api-id "$API_ID" \
  --stage-name '$default' \
  --auto-deploy
```

---

### Étape 5 : Autoriser API Gateway à invoquer Lambda

```bash
# Ajouter la permission à Lambda d'être invoqué par API Gateway
aws lambda add-permission \
  --function-name bonjour \
  --statement-id apigateway-permission \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*"
```

**Résultat attendu** :

```json
{
    "Statement": "{\"Effect\":\"Allow\",\"Principal\":{\"Service\":\"apigateway.amazonaws.com\"},\"Action\":\"lambda:InvokeFunction\",...}"
}
```

---

### Étape 6 : Tester l'API complète

```bash
# Récupérer l'URL de l'API
API_URL=$(aws apigatewayv2 get-api --api-id "$API_ID" --query 'ApiEndpoint' --output text)
echo "URL de l'API : $API_URL"
```

```bash
# Tester l'API avec curl
curl "${API_URL}/bonjour?nom=Alice"
```

**Résultat attendu** :

```json
{"message": "Bonjour, Alice !"}
```

```bash
# Tester sans paramètre (valeur par défaut)
curl "${API_URL}/bonjour"
```

**Résultat attendu** :

```json
{"message": "Bonjour, monde !"}
```

```bash
# Vérifier les logs d'exécution dans CloudWatch
aws logs get-log-events \
  --log-group-name "/aws/lambda/bonjour" \
  --log-stream-name "$(aws logs describe-log-streams --log-group-name /aws/lambda/bonjour --query 'logStreams[-1].logStreamName' --output text)" \
  --query 'events[*].message' \
  --output text
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws lambda list-functions` | Lister toutes les fonctions Lambda |
| `aws lambda get-function --function-name <nom>` | Détails d'une fonction |
| `aws lambda invoke --function-name <nom> --payload '{}' /tmp/out.json` | Invoquer une fonction manuellement |
| `aws lambda update-function-code --function-name <nom> --zip-file fileb://function.zip` | Mettre à jour le code d'une fonction |
| `aws lambda delete-function --function-name <nom>` | Supprimer une fonction |
| `aws apigatewayv2 get-apis` | Lister toutes les API Gateway |
| `aws apigatewayv2 delete-api --api-id <id>` | Supprimer une API Gateway |
| `aws logs tail /aws/lambda/<nom> --follow` | Suivre les logs d'une fonction en temps réel |

---

## Pièges Fréquents

### Piège 1 : Oublier d'accorder la permission d'invocation à API Gateway

⚠️ **Problème** : L'API Gateway renvoie `{"message":"Internal Server Error"}` et les logs Lambda ne montrent aucune invocation.

✅ **Solution** : API Gateway doit avoir explicitement la permission d'invoquer la fonction Lambda. Cette permission n'est pas accordée automatiquement lors de la création de l'intégration.

```bash
aws lambda add-permission \
  --function-name bonjour \
  --statement-id apigateway-permission \
  --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com \
  --source-arn "arn:aws:execute-api:REGION:ACCOUNT:API_ID/*/*"
```

---

### Piège 2 : Mal formater la réponse Lambda pour API Gateway

⚠️ **Problème** : API Gateway renvoie `502 Bad Gateway` ou le corps de la réponse est incorrect.

✅ **Solution** : La fonction Lambda doit retourner un objet avec les clés `statusCode`, `headers` (optionnel) et `body` (chaîne de caractères sérialisée en JSON). Le `body` doit être une chaîne, pas un objet Python/JavaScript.

```python
# Incorrect
return {"message": "ok"}

# Incorrect
return {
    "statusCode": 200,
    "body": {"message": "ok"}  # body doit être une chaîne, pas un dict
}

# Correct
return {
    "statusCode": 200,
    "body": json.dumps({"message": "ok"})  # body sérialisé en chaîne JSON
}
```

---

### Piège 3 : Mettre la logique d'initialisation dans le handler

⚠️ **Problème** : La connexion à la base de données ou le chargement de la configuration se font à chaque invocation, ce qui ralentit la fonction inutilement.

✅ **Solution** : Le code en dehors du handler s'exécute une seule fois lors du démarrage du conteneur (phase d'init). Mettre les opérations coûteuses en dehors du handler pour les réutiliser entre les invocations du même conteneur (warm start).

```python
import json
import boto3

# Code d'initialisation : exécuté une seule fois (cold start)
dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('ma-table')

def handler(event, context):
    # Code d'invocation : exécuté à chaque requête
    # La connexion DynamoDB est déjà prête grâce à l'initialisation ci-dessus
    response = table.get_item(Key={"id": "123"})
    return {
        "statusCode": 200,
        "body": json.dumps(response.get("Item", {}))
    }
```

---

### Piège 4 : Négliger les timeouts

⚠️ **Problème** : Une fonction Lambda qui appelle un service externe (base de données, API tierce) se bloque indéfiniment si ce service ne répond pas, jusqu'au timeout Lambda (par défaut : 3 secondes).

✅ **Solution** : Toujours configurer des timeouts pour les appels externes, inférieurs au timeout Lambda.

```python
import requests

def handler(event, context):
    try:
        # Timeout de 5 secondes pour ne pas dépasser le timeout Lambda
        response = requests.get(
            "https://api.externe.com/data",
            timeout=5  # Ne pas oublier le timeout
        )
        return {"statusCode": 200, "body": response.text}
    except requests.Timeout:
        return {"statusCode": 504, "body": json.dumps({"error": "Timeout externe"})}
```

---

### Piège 5 : Ignorer le coût de la concurrence

⚠️ **Problème** : Une fonction Lambda mal optimisée (lente, gourmande en mémoire) peut coûter beaucoup plus cher qu'un serveur équivalent si elle est très sollicitée.

✅ **Solution** : Lambda facture à la milliseconde selon la mémoire allouée. Avant de passer en production, utiliser Lambda Power Tuning (outil AWS) pour trouver la configuration mémoire optimale entre coût et performance.

**Modèle de coût Lambda (2025)** :

| Composante | Prix |
| --- | --- |
| Requêtes | 0,20 USD par million de requêtes (1 million gratuit/mois) |
| Durée d'exécution | 0,0000166667 USD par Go-seconde (400 000 Go-secondes gratuits/mois) |

Exemple : 10 millions de requêtes/mois, 100 ms par requête, 128 Mo = environ 2 dollars par mois.

---

## Checklist de Validation

- [ ] J'ai créé un rôle IAM avec uniquement les permissions nécessaires pour Lambda
- [ ] J'ai déployé une fonction Lambda qui retourne une réponse au format API Gateway
- [ ] J'ai créé une API Gateway HTTP API avec une route `GET /bonjour`
- [ ] J'ai accordé à API Gateway la permission d'invoquer ma fonction Lambda
- [ ] J'ai testé l'API avec `curl` et obtenu la réponse attendue
- [ ] Je comprends la différence entre cold start et warm start
- [ ] Je sais consulter les logs d'une fonction Lambda dans CloudWatch
- [ ] Je comprends quand choisir le serverless plutôt que les conteneurs

---

## Exercice Pratique

**Énoncé** : Tu dois créer une API serverless qui calcule l'âge en années à partir d'une date de naissance passée en paramètre.

**Spécifications** :

- Route : `GET /age?naissance=AAAA-MM-JJ`
- Retour si la date est valide : `{"age": 25, "message": "Tu as 25 ans."}`
- Retour si la date est invalide ou manquante : `{"error": "Paramètre 'naissance' manquant ou invalide (format AAAA-MM-JJ)"}` avec status 400

**Étapes à réaliser** :

1. Écrire la fonction Lambda en Python 3.12
2. Créer le rôle IAM d'exécution minimal
3. Déployer la fonction
4. Créer l'API Gateway et la lier à la fonction
5. Tester avec plusieurs dates

**Indications** :

- Utilise le module Python `datetime` : `from datetime import date`
- Le calcul d'âge en années : `(date.today() - naissance).days // 365`
- N'oublie pas de gérer les exceptions avec un `try/except` pour les dates invalides
- Le paramètre arrive dans `event["queryStringParameters"]["naissance"]`

**Résultat attendu** :

```bash
curl "https://ton-api.execute-api.eu-west-1.amazonaws.com/age?naissance=2000-01-15"
```

```json
{"age": 25, "message": "Tu as 25 ans."}
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Code de la fonction Lambda** (`handler.py`) :

```python
import json
from datetime import date

def handler(event, context):
    """
    Calcule l'âge en années à partir d'une date de naissance.
    Paramètre attendu : naissance=AAAA-MM-JJ dans les query strings.
    """
    # Extraire le paramètre depuis les query strings
    params = event.get("queryStringParameters") or {}
    naissance_str = params.get("naissance")
    
    # Vérifier que le paramètre est présent
    if not naissance_str:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"error": "Paramètre 'naissance' manquant ou invalide (format AAAA-MM-JJ)"},
                ensure_ascii=False
            )
        }
    
    # Convertir la chaîne en date et calculer l'âge
    try:
        naissance = date.fromisoformat(naissance_str)   # Accepte AAAA-MM-JJ
        aujourd_hui = date.today()
        
        # Vérifier que la date est dans le passé
        if naissance > aujourd_hui:
            raise ValueError("La date de naissance ne peut pas être dans le futur")
        
        age = (aujourd_hui - naissance).days // 365     # Approximation en années
        
        return {
            "statusCode": 200,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"age": age, "message": f"Tu as {age} ans."},
                ensure_ascii=False
            )
        }
    except (ValueError, TypeError) as e:
        return {
            "statusCode": 400,
            "headers": {"Content-Type": "application/json"},
            "body": json.dumps(
                {"error": "Paramètre 'naissance' manquant ou invalide (format AAAA-MM-JJ)"},
                ensure_ascii=False
            )
        }
```

**Déploiement** :

```bash
# Créer le zip
cd /tmp && mkdir -p lambda-age && cp handler.py lambda-age/ && cd lambda-age && zip function.zip handler.py

# Créer le rôle (si pas encore fait)
aws iam create-role --role-name lambda-age-role --assume-role-policy-document file:///tmp/trust-policy.json
aws iam attach-role-policy --role-name lambda-age-role --policy-arn arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole

# Créer la fonction
ROLE_ARN=$(aws iam get-role --role-name lambda-age-role --query 'Role.Arn' --output text)
aws lambda create-function --function-name calculer-age --runtime python3.12 \
  --zip-file fileb:///tmp/lambda-age/function.zip --handler handler.handler --role "$ROLE_ARN"

# Créer l'API et la route
aws apigatewayv2 create-api --name "api-age" --protocol-type HTTP
API_ID=$(aws apigatewayv2 get-apis --query 'Items[?Name==`api-age`].ApiId' --output text)
LAMBDA_ARN=$(aws lambda get-function --function-name calculer-age --query 'Configuration.FunctionArn' --output text)
REGION=$(aws configure get region) && ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
INT_ID=$(aws apigatewayv2 create-integration --api-id "$API_ID" --integration-type AWS_PROXY \
  --integration-uri "arn:aws:apigateway:${REGION}:lambda:path/2015-03-31/functions/${LAMBDA_ARN}/invocations" \
  --payload-format-version "2.0" --query 'IntegrationId' --output text)
aws apigatewayv2 create-route --api-id "$API_ID" --route-key "GET /age" --target "integrations/$INT_ID"
aws apigatewayv2 create-stage --api-id "$API_ID" --stage-name '$default' --auto-deploy
aws lambda add-permission --function-name calculer-age --statement-id apigw --action lambda:InvokeFunction \
  --principal apigateway.amazonaws.com --source-arn "arn:aws:execute-api:${REGION}:${ACCOUNT_ID}:${API_ID}/*/*"
```

**Tests** :

```bash
API_URL=$(aws apigatewayv2 get-api --api-id "$API_ID" --query 'ApiEndpoint' --output text)
curl "${API_URL}/age?naissance=2000-01-15"
# {"age": 25, "message": "Tu as 25 ans."}

curl "${API_URL}/age"
# {"error": "Paramètre 'naissance' manquant ou invalide (format AAAA-MM-JJ)"}

curl "${API_URL}/age?naissance=pas-une-date"
# {"error": "Paramètre 'naissance' manquant ou invalide (format AAAA-MM-JJ)"}
```

---

## Navigation

← Fiche précédente : **[10 - Projet intégrateur](10-projet-integrateur.md)**

→ Fiche suivante : **[12 - Infrastructure as Code avec AWS CDK](12-iac-aws-cdk.md)**
