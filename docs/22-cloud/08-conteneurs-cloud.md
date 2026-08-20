---
tags:
  - Cloud
  - Intermédiaire
  - Pratique
description: "Conteneurs dans le cloud : ECS, Fargate, GKE, AKS, registres d'images (ECR), déploiement et orchestration."
estimated_time: "80 min"
fiche_number: 8
total_fiches: 13
cursus: "Cloud"
---

# 08 - Conteneurs cloud

> **En bref** : Tu découvriras comment déployer des conteneurs dans le cloud avec les services d'orchestration manages (ECS, Fargate, GKE, AKS), tu apprendras a utiliser un registre d'images (ECR) et tu deploieras une application conteneurisee. Lecture estimée : 80 min.

## Prérequis

- Avoir lu la fiche [07 - Bases de données cloud](07-bases-de-donnees-cloud.md)
- Avoir un compte AWS configure avec le CLI (fiche [01 - Introduction au Cloud](01-introduction-cloud.md))
- Connaissances de base en Docker (images, conteneurs, Dockerfile)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras pousser une image Docker dans un registre cloud (ECR), créer un cluster ECS, déployer une application avec Fargate et configurer un load balancer pour la rendre accessible.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'orchestration de conteneurs dans le cloud ?

**Définition** : L'orchestration de conteneurs dans le cloud consiste a utiliser un service manage pour déployer, gérer, mettre a l'échelle et surveiller des conteneurs. Le fournisseur cloud gère l'infrastructure sous-jacente (serveurs, réseau, sécurité) pendant que tu te concentres sur tes applications.

**Le problème que l'orchestration cloud résout** :

Sans orchestration cloud, voici les problèmes rencontres :

1. **Gestion manuelle des serveurs** : Tu dois provisionner des machines virtuelles, installer Docker, configurer le réseau et maintenir le système d'exploitation. Chaque serveur est un point de maintenance.
2. **Mise a l'échelle complexe** : Quand le trafic augmente, tu dois ajouter des serveurs manuellement, reconfigurer le load balancer et t'assurer que les conteneurs sont bien repartis.
3. **Déploiements risques** : Mettre a jour une application sans coupure de service (zéro-downtime) demande une configuration complexe de health checks, de rolling updates et de rollback.

**Comment l'orchestration cloud résout ces problèmes** :

| Problème | Solution apportée par l'orchestration cloud |
| --- | --- |
| Gestion manuelle des serveurs | Le service manage gère les serveurs ou les elimine complètement (serverless avec Fargate) |
| Mise a l'échelle complexe | L'auto-scaling ajoute ou retire des conteneurs automatiquement selon la charge |
| Déploiements risques | Les stratégies de déploiement (rolling, blue/green) sont intégrées avec rollback automatique |

**Analogie concrète** : L'orchestration de conteneurs, c'est comme un service de livraison de colis. Sans orchestration, tu conduis toi-meme chaque colis a destination (gestion manuelle des serveurs). Avec l'orchestration cloud, tu confies tes colis a un service de livraison (ECS, GKE). Il décide quels camions utiliser, optimise les itineraires et envoie des camions supplémentaires pendant les fetes. Tu ne geres que le contenu des colis (tes conteneurs).

**Ce que l'orchestration cloud n'est PAS** :

- L'orchestration cloud n'est pas Docker. Docker créé et execute des conteneurs sur une seule machine. L'orchestration gère des conteneurs sur plusieurs machines avec du load balancing et de l'auto-scaling.
- L'orchestration cloud n'est pas Kubernetes uniquement. ECS est un orchestrateur spécifique a AWS qui ne necessite pas de connaître Kubernetes.

---

### Les services d'orchestration par fournisseur

| Fournisseur | Service manage | Equivalent Kubernetes | Serverless |
| --- | --- | --- | --- |
| **AWS** | ECS (Elastic Container Service) | EKS (Elastic Kubernetes Service) | Fargate |
| **Google Cloud** | Cloud Run | GKE (Google Kubernetes Engine) | Cloud Run |
| **Azure** | ACI (Azure Container Instances) | AKS (Azure Kubernetes Service) | ACI |

---

### Qu'est-ce que Amazon ECS ?

**Définition** : ECS (Elastic Container Service) est le service d'orchestration de conteneurs natif d'AWS. Il gère le déploiement, la mise a l'échelle et la surveillance des conteneurs Docker.

**Concepts clés d'ECS** :

| Concept | Description |
| --- | --- |
| **Cluster** | Groupe logique de ressources ou s'executent les conteneurs |
| **Task Définition** | Modèle qui décrit un ou plusieurs conteneurs (image, CPU, mémoire, ports, variables d'environnement) |
| **Task** | Instance en cours d'exécution d'une Task Définition (un conteneur qui tourne) |
| **Service** | Composant qui maintient un nombre desire de Tasks en exécution et les connecte a un load balancer |

**Architecture ECS** :

<div class="diagram-design">
<p><a href="../../diagrams/22-cloud-08-conteneurs-cloud-1.html">Qu&#x27;est-ce que Amazon ECS ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/22-cloud-08-conteneurs-cloud-1.html" title="Qu&#x27;est-ce que Amazon ECS ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que AWS Fargate ?

**Définition** : Fargate est un moteur de calcul serverless pour ECS (et EKS). Il execute les conteneurs sans que tu aies a gérer des serveurs EC2. Tu définis les ressources nécessaires (CPU, mémoire) et Fargate provisionne l'infrastructure automatiquement.

**Comparaison EC2 vs Fargate** :

| Critère | ECS sur EC2 | ECS sur Fargate |
| --- | --- | --- |
| Gestion des serveurs | Tu geres les instances EC2 (mises à jour, patches, scaling) | Aucun serveur a gérer |
| Coût | Paiement a l'instance (même si sous-utilisée) | Paiement a la seconde (CPU + mémoire utilises) |
| Controle | Accès complet aux instances (SSH, outils système) | Pas d'accès au système sous-jacent |
| Scaling | Tu geres l'auto-scaling des instances EC2 en plus des tasks | Seul le scaling des tasks est nécessaire |
| Cas d'usage | Charges de travail stables a fort volume | Applications variables, microservices, prototypage |

---

### Qu'est-ce qu'un registre d'images ?

**Définition** : Un registre d'images est un dépôt ou tu stockes tes images Docker. Quand ECS deploie un conteneur, il telecharge l'image depuis le registre.

**Le problème que les registres résolvent** :

Sans registre cloud, voici les problèmes rencontres :

1. **Distribution manuelle** : Tu dois copier l'image Docker manuellement sur chaque serveur ou la reconstruire a chaque déploiement.
2. **Pas de versionning** : Tu n'as pas d'historique des versions de tes images. Impossible de revenir a une version précédente rapidement.
3. **Sécurité** : Les images sur Docker Hub sont publiques par défaut. Tes images contiennent potentiellement du code propriétaire et des configurations sensibles.

**Comment les registres cloud résolvent ces problèmes** :

| Problème | Solution apportée par les registres cloud |
| --- | --- |
| Distribution manuelle | Le service d'orchestration telecharge l'image depuis le registre automatiquement |
| Pas de versionning | Chaque image est identifiee par un tag et un digest SHA256 unique |
| Sécurité | Les images sont privées par défaut, chiffrees au repos et accessibles uniquement avec les permissions IAM |

**Registres par fournisseur** :

| Fournisseur | Service | Adresse |
| --- | --- | --- |
| AWS | ECR (Elastic Container Registry) | `<account-id>.dkr.ecr.<region>.amazonaws.com` |
| Google Cloud | Artifact Registry | `<region>-docker.pkg.dev/<project>/<repo>` |
| Azure | ACR (Azure Container Registry) | `<nom>.azurecr.io` |

---

### Comparaison des services Kubernetes manages

| Critère | EKS (AWS) | GKE (Google) | AKS (Azure) |
| --- | --- | --- | --- |
| Coût du control plane | ~73 USD/mois (0,10 USD/heure) | 0,10 USD/heure par cluster (crédit Always Free ~74,40 USD/mois : 1 cluster Autopilot ou zonal) | Gratuit (tier Free, sans SLA) ; Standard ~0,10 USD/heure |
| Intégration native | AWS (IAM, VPC, ALB) | GCP (IAM, VPC, Cloud Load Balancing) | Azure (AD, VNet, App Gateway) |
| Mise a jour Kubernetes | Manuelle ou automatique | Automatique (Autopilot) | Automatique |
| Particularite | Forte adoption en entreprise | Meilleure expérience Kubernetes native | Intégration Active Directory |

---

## Étapes Pratiques

### Étape 1 : Creer un dépôt ECR

```bash
# Creer un depot ECR pour stocker les images
aws ecr create-repository \
  --repository-name demo-app \
  --image-scanning-configuration scanOnPush=true \
  --encryption-configuration encryptionType=AES256 \
  --tags Key=Environment,Value=dev
```

**Résultat attendu** :

```text
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:eu-west-3:123456789012:repository/demo-app",
        "repositoryName": "demo-app",
        "repositoryUri": "123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app",
        "imageScanningConfiguration": {
            "scanOnPush": true
        }
    }
}
```

---

### Étape 2 : Construire et pousser une image Docker

Créé un fichier `Dockerfile` :

```dockerfile
# Image de base legere
FROM node:22-alpine

# Repertoire de travail dans le conteneur
WORKDIR /app

# Copier les fichiers de dependances
COPY package*.json ./

# Installer les dependances (sans les devDependencies)
# --only=production est deprecie : utiliser --omit=dev
RUN npm ci --omit=dev

# Copier le code source
COPY . .

# Port expose par l'application
EXPOSE 3000

# Commande de demarrage
CMD ["node", "server.js"]
```

Créé un fichier `server.js` minimal :

```javascript
// Serveur HTTP minimal pour la demonstration
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    status: 'ok',
    message: 'Application deployee sur ECS',
    timestamp: new Date().toISOString()
  }));
});

server.listen(3000, () => {
  console.log('Serveur demarre sur le port 3000');
});
```

Créé un fichier `package.json` :

```json
{
  "name": "demo-app",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": {
    "start": "node server.js"
  }
}
```

```bash
# Se connecter au registre ECR
aws ecr get-login-password --region eu-west-3 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com

# Construire l'image Docker
docker build -t demo-app:1.0.0 .

# Taguer l'image pour ECR
docker tag demo-app:1.0.0 \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app:1.0.0

# Pousser l'image vers ECR
docker push \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app:1.0.0
```

**Résultat attendu** :

```text
The push refers to repository [123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app]
abc123def456: Pushed
789ghi012jkl: Pushed
1.0.0: digest: sha256:abcdef123456... size: 1234
```

---

### Étape 3 : Creer un cluster ECS

```bash
# Creer un cluster ECS
aws ecs create-cluster \
  --cluster-name demo-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1 \
  --tags key=Environment,value=dev
```

**Résultat attendu** :

```text
{
    "cluster": {
        "clusterArn": "arn:aws:ecs:eu-west-3:123456789012:cluster/demo-cluster",
        "clusterName": "demo-cluster",
        "status": "ACTIVE",
        "capacityProviders": ["FARGATE"]
    }
}
```

---

### Étape 4 : Creer une Task Définition

Créé un fichier `task-definition.json` :

```json
{
  "family": "demo-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "256",
  "memory": "512",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "demo-app",
      "image": "123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app:1.0.0",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/demo-app",
          "awslogs-region": "eu-west-3",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -q -O /dev/null http://localhost:3000/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "essential": true
    }
  ]
}
```

L'image `node:22-alpine` n'embarque pas `curl` (le binaire n'est installé que pendant le build, puis retiré). Alpine fournit `wget` via BusyBox, d'où le health check ci-dessus.

Decomposition des champs importants :

- `family` : nom logique de la task définition (les versions sont numerotees automatiquement)
- `networkMode: awsvpc` : chaque task reçoit sa propre adresse IP dans le VPC
- `cpu: 256` : 0.25 vCPU (256 unités = 0.25 CPU). Fargate Linux accepte 256, 512, 1024, 2048, 4096, et aussi 8192 (8 vCPU) et 16384 (16 vCPU) depuis la plateforme 1.4.0
- `memory: 512` : 512 Mo de mémoire vive
- `executionRoleArn` : rôle IAM qui permet a ECS de telecharger l'image et d'envoyer les logs
- `logConfiguration` : envoie les logs du conteneur vers CloudWatch Logs

```bash
# Creer le groupe de logs CloudWatch
aws logs create-log-group --log-group-name /ecs/demo-app

# Enregistrer la task definition
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json
```

**Résultat attendu** :

```text
{
    "taskDefinition": {
        "taskDefinitionArn": "arn:aws:ecs:eu-west-3:123456789012:task-definition/demo-app:1",
        "family": "demo-app",
        "revision": 1,
        "status": "ACTIVE"
    }
}
```

---

### Étape 5 : Creer un service ECS avec Fargate

```bash
# Creer le service ECS
# Le service maintient 2 tasks en execution et les connecte au reseau
aws ecs create-service \
  --cluster demo-cluster \
  --service-name demo-service \
  --task-definition demo-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],
    securityGroups=[sg-xxxxxxxx],
    assignPublicIp=ENABLED
  }"
```

**Résultat attendu** :

```text
{
    "service": {
        "serviceName": "demo-service",
        "clusterArn": "arn:aws:ecs:...:cluster/demo-cluster",
        "desiredCount": 2,
        "runningCount": 0,
        "status": "ACTIVE",
        "launchType": "FARGATE"
    }
}
```

```bash
# Verifier que les tasks demarrent
aws ecs list-tasks \
  --cluster demo-cluster \
  --service-name demo-service
```

---

### Étape 6 : Mettre a jour le déploiement

```bash
# Construire et pousser une nouvelle version
docker build -t demo-app:1.1.0 .
docker tag demo-app:1.1.0 \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app:1.1.0
docker push \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/demo-app:1.1.0

# Mettre a jour la task definition avec la nouvelle image
# (modifier le fichier task-definition.json avec 1.1.0)
aws ecs register-task-definition \
  --cli-input-json file://task-definition.json

# Mettre a jour le service pour utiliser la nouvelle revision
aws ecs update-service \
  --cluster demo-cluster \
  --service-name demo-service \
  --task-definition demo-app:2
```

ECS effectue un rolling update : il demarre de nouvelles tasks avec la version 1.1.0, attend qu'elles soient saines (health check), puis arrête les anciennes tasks avec la version 1.0.0.

---

### Étape 7 : Nettoyer les ressources

```bash
# Mettre le nombre de tasks a 0
aws ecs update-service \
  --cluster demo-cluster \
  --service-name demo-service \
  --desired-count 0

# Supprimer le service
aws ecs delete-service \
  --cluster demo-cluster \
  --service-name demo-service

# Supprimer le cluster
aws ecs delete-cluster --cluster demo-cluster

# Supprimer les images ECR
aws ecr batch-delete-image \
  --repository-name demo-app \
  --image-ids imageTag=1.0.0 imageTag=1.1.0

# Supprimer le depot ECR
aws ecr delete-repository \
  --repository-name demo-app

# Supprimer le groupe de logs
aws logs delete-log-group --log-group-name /ecs/demo-app
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `aws ecr get-login-password` | Obtenir un mot de passe temporaire pour le registre ECR |
| `aws ecr list-images --repository-name <nom>` | Lister les images dans un dépôt ECR |
| `aws ecs list-clusters` | Lister les clusters ECS |
| `aws ecs list-services --cluster <nom>` | Lister les services d'un cluster |
| `aws ecs list-tasks --cluster <nom>` | Lister les tasks en cours d'exécution |
| `aws ecs describe-tasks --cluster <nom> --tasks <id>` | Détails d'une task (IP, statut, logs) |
| `aws ecs update-service --desired-count <n>` | Changer le nombre de tasks |
| `aws logs tail /ecs/<nom> --follow` | Suivre les logs d'un conteneur en temps réel |

---

## Pièges Frequents

### Piège 1 : Utiliser le tag "latest" en production

**Problème** : Tu pousses toutes tes images avec le tag `latest`. ECS telecharge `latest`, mais tu ne sais pas quelle version du code tourne réellement. Un rollback est impossible car l'ancienne image a été ecrasee.

**Solution** : Utilise des tags explicites bases sur le numéro de version ou le hash du commit Git : `demo-app:1.2.3` ou `demo-app:abc123f`. Chaque déploiement référence un tag unique et immutable.

### Piège 2 : Oublier le health check dans la Task Définition

**Problème** : Tu ne configures pas de health check. ECS considere que toutes les tasks sont saines des leur démarrage. Si l'application plante après le démarrage, ECS ne le detecte pas et ne relance pas la task.

**Solution** : Configure toujours un health check dans la Task Définition. Utilise une route HTTP dédiée (`/health`) qui verifie que l'application fonctionne correctement (connexion a la base de données, accès au cache, etc.).

### Piège 3 : Ne pas dimensionner correctement CPU et mémoire

**Problème** : Tu alloues 256 CPU units et 512 Mo de mémoire, mais ton application Node.js consomme 800 Mo au pic. ECS tue la task avec une erreur OOMKilled (Out Of Memory Killed) et la relance en boucle.

**Solution** : Mesure la consommation réelle de ton application en local avec `docker stats`. Ajoute une marge de 20-30% pour les pics. Surveille les métriques CloudWatch MemoryUtilization et CPUUtilization pour ajuster.

### Piège 4 : Exposer le conteneur directement sur internet

**Problème** : Tu configures `assignPublicIp=ENABLED` et tu exposes le port du conteneur directement. Pas de SSL, pas de load balancing, pas de protection.

**Solution** : Place un Application Load Balancer (ALB) devant tes conteneurs. L'ALB gère le SSL (certificat ACM), la répartition de charge et les health checks. Les conteneurs restent dans des sous-réseaux prives.

---

## Checklist de Validation

- [ ] Je sais créer un dépôt ECR et y pousser une image Docker
- [ ] Je comprends la difference entre ECS sur EC2 et ECS sur Fargate
- [ ] Je sais créer un cluster ECS et une Task Définition
- [ ] Je sais déployer un service ECS avec Fargate
- [ ] Je comprends le mécanisme de rolling update
- [ ] Je sais consulter les logs d'un conteneur dans CloudWatch
- [ ] Je connais les services équivalents chez GCP (GKE) et Azure (AKS)

---

## Exercice Pratique

**Enonce** : Deploie une application web conteneurisee sur ECS Fargate :

1. Créé un dépôt ECR nomme `exercice-app`
2. Construis une image Docker a partir du Dockerfile et du serveur fournis dans les étapes pratiques (ou une application de ton choix)
3. Pousse l'image dans ECR avec le tag `1.0.0`
4. Créé un cluster ECS nomme `exercice-cluster`
5. Écris une Task Définition avec :
   - 512 CPU units et 1024 Mo de mémoire
   - Un health check sur le port de l'application
   - Les logs envoyés vers CloudWatch
6. Créé un service avec 2 tasks
7. Verifie que les tasks sont en cours d'exécution et que les logs apparaissent dans CloudWatch

**Indications** :

- N'oublie pas de créer le groupe de logs CloudWatch avant d'enregistrer la task définition
- Verifie que le rôle `ecsTaskExecutionRole` existe dans ton compte (il est créé automatiquement la première fois que tu utilises ECS via la console)
- Utilise des sous-réseaux publics avec `assignPublicIp=ENABLED` pour simplifier le test

**Résultat attendu** : 2 tasks en statut "RUNNING" dans le cluster, et des logs visibles dans CloudWatch Logs.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

```bash
# 1. Creer le depot ECR
aws ecr create-repository \
  --repository-name exercice-app \
  --image-scanning-configuration scanOnPush=true

# 2. Se connecter a ECR
aws ecr get-login-password --region eu-west-3 | \
  docker login --username AWS --password-stdin \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com

# 3. Construire et pousser l'image
docker build -t exercice-app:1.0.0 .
docker tag exercice-app:1.0.0 \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/exercice-app:1.0.0
docker push \
  123456789012.dkr.ecr.eu-west-3.amazonaws.com/exercice-app:1.0.0

# 4. Creer le cluster
aws ecs create-cluster \
  --cluster-name exercice-cluster \
  --capacity-providers FARGATE \
  --default-capacity-provider-strategy capacityProvider=FARGATE,weight=1

# 5. Creer le groupe de logs
aws logs create-log-group --log-group-name /ecs/exercice-app
```

Créé le fichier `exercice-task-definition.json` :

```json
{
  "family": "exercice-app",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::123456789012:role/ecsTaskExecutionRole",
  "containerDefinitions": [
    {
      "name": "exercice-app",
      "image": "123456789012.dkr.ecr.eu-west-3.amazonaws.com/exercice-app:1.0.0",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/exercice-app",
          "awslogs-region": "eu-west-3",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "wget -q -O /dev/null http://localhost:3000/ || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3,
        "startPeriod": 60
      },
      "essential": true
    }
  ]
}
```

```bash
# 6. Enregistrer la task definition
aws ecs register-task-definition \
  --cli-input-json file://exercice-task-definition.json

# 7. Creer le service avec 2 tasks
aws ecs create-service \
  --cluster exercice-cluster \
  --service-name exercice-service \
  --task-definition exercice-app:1 \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={
    subnets=[subnet-xxxxxxxx,subnet-yyyyyyyy],
    securityGroups=[sg-xxxxxxxx],
    assignPublicIp=ENABLED
  }"

# 8. Verifier les tasks
aws ecs list-tasks \
  --cluster exercice-cluster \
  --service-name exercice-service

# 9. Voir les logs
aws logs tail /ecs/exercice-app --follow
```

**Nettoyer** :

```bash
aws ecs update-service --cluster exercice-cluster --service-name exercice-service --desired-count 0
aws ecs delete-service --cluster exercice-cluster --service-name exercice-service
aws ecs delete-cluster --cluster exercice-cluster
aws ecr delete-repository --repository-name exercice-app --force
aws logs delete-log-group --log-group-name /ecs/exercice-app
```

---

## Navigation

← Fiche précédente : **[07 - Bases de données cloud](07-bases-de-donnees-cloud.md)**

→ Fiche suivante : **[09 - Monitoring cloud](09-monitoring-cloud.md)**
