---
tags:
  - Certification
  - Intermédiaire
  - Pratique
description: "BC03 - 05 - Les Bases de Kubernetes"
estimated_time: "55 min"
fiche_number: 5
total_fiches: 5
cursus: "BC03 - Cloud computing"
---

# BC03 - 05 - Les Bases de Kubernetes

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est Kubernetes, comment il orchestre les conteneurs, et tu connaîtras les concepts fondamentaux (Pods, Services, Deployments) pour déployer une application. Lecture estimée : 55 min.


## Prérequis

- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (Docker)
- Fiche **[BC03 - 01 - Introduction au Cloud Computing](01-introduction-cloud.md)**
- Fiche **[BC03 - 04 - Le Déploiement Continu (CI/CD)](04-deploiement-continu.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est Kubernetes, comment il orchestre les conteneurs, et tu connaîtras les concepts fondamentaux (Pods, Services, Deployments) pour déployer une application.

---

## Concepts

### Qu'est-ce que Kubernetes ?

**Définition** : Kubernetes (souvent abrégé K8s) est une plateforme open-source d'orchestration de conteneurs. Il automatise le déploiement, la mise à l'échelle et la gestion des applications conteneurisées.

**Le problème que Kubernetes résout** :

Sans Kubernetes, voici les problèmes rencontrés avec les conteneurs :

1. **Gestion manuelle** : Démarrer/arrêter les conteneurs sur plusieurs serveurs à la main.
2. **Haute disponibilité** : Si un conteneur tombe, personne ne le redémarre automatiquement.
3. **Mise à l'échelle** : Ajouter des conteneurs manuellement en cas de charge.
4. **Réseau complexe** : Faire communiquer des conteneurs sur différents serveurs.
5. **Mises à jour risquées** : Pas de rollback automatique en cas de problème.

**Comment Kubernetes résout ces problèmes** :

| Problème | Solution Kubernetes |
| -------- | ------------------- |
| Gestion manuelle | Déclaratif : "Je veux 3 instances" |
| Haute disponibilité | Redémarrage automatique des conteneurs |
| Mise à l'échelle | Auto-scaling selon la charge |
| Réseau complexe | Réseau virtuel intégré |
| Mises à jour risquées | Rolling updates avec rollback |

**Analogie concrète** : Kubernetes est comme un chef d'orchestre. Toi, tu lui donnes la partition (la configuration). Lui, il coordonne tous les musiciens (conteneurs) pour qu'ils jouent ensemble harmonieusement. Si un musicien se trompe ou s'arrête, le chef le remplace immédiatement sans que le concert s'arrête.

---

### Quelle est l'architecture de Kubernetes ?

```text
┌─────────────────────────────────────────────────────────────┐
│                     Cluster Kubernetes                       │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐ │
│  │                   Control Plane (Master)                │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐ │ │
│  │  │   API    │ │ Scheduler│ │Controller│ │   etcd    │ │ │
│  │  │  Server  │ │          │ │ Manager  │ │ (database)│ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────┘ │ │
│  └────────────────────────────────────────────────────────┘ │
│                              │                               │
│  ┌───────────────────────────┴────────────────────────────┐ │
│  │                      Worker Nodes                       │ │
│  │                                                         │ │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │ │
│  │  │   Node 1    │  │   Node 2    │  │   Node 3    │    │ │
│  │  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │    │ │
│  │  │  │ Pod A │  │  │  │ Pod B │  │  │  │ Pod C │  │    │ │
│  │  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │    │ │
│  │  │  ┌───────┐  │  │  ┌───────┐  │  │  ┌───────┐  │    │ │
│  │  │  │ Pod D │  │  │  │ Pod E │  │  │  │ Pod F │  │    │ │
│  │  │  └───────┘  │  │  └───────┘  │  │  └───────┘  │    │ │
│  │  │  kubelet    │  │  kubelet    │  │  kubelet    │    │ │
│  │  └─────────────┘  └─────────────┘  └─────────────┘    │ │
│  └─────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

| Composant | Rôle |
| --------- | ---- |
| **API Server** | Point d'entrée pour toutes les commandes |
| **Scheduler** | Décide sur quel node placer les pods |
| **Controller Manager** | Maintient l'état désiré (nombre de replicas) |
| **etcd** | Base de données clé-valeur (configuration du cluster) |
| **kubelet** | Agent sur chaque node, exécute les pods |
| **kube-proxy** | Gère le réseau sur chaque node |

---

### Qu'est-ce qu'un Pod ?

**Définition** : Un Pod est la plus petite unité déployable dans Kubernetes. Il contient un ou plusieurs conteneurs qui partagent le même réseau et stockage.

**Caractéristiques** :

| Propriété | Description |
| --------- | ----------- |
| IP unique | Chaque pod a sa propre adresse IP |
| Éphémère | Un pod peut être détruit et recréé |
| Co-localisation | Conteneurs d'un même pod sur le même node |
| Partage réseau | Conteneurs communiquent via localhost |

**Exemple de pod** :

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-pod
spec:
  containers:
    - name: app
      image: nginx:latest
      ports:
        - containerPort: 80
```

**Ce qu'un Pod n'est PAS** :

- Un Pod n'est pas un conteneur. Un pod peut contenir plusieurs conteneurs.
- Un Pod n'est pas permanent. Il peut être supprimé et recréé à tout moment.

---

### Qu'est-ce qu'un Deployment ?

**Définition** : Un Deployment est un objet Kubernetes qui gère un ensemble de Pods identiques (replicas). Il assure que le nombre désiré de pods est toujours en cours d'exécution.

**Ce que le Deployment gère** :

| Fonctionnalité | Description |
| -------------- | ----------- |
| Replicas | Maintient N copies du pod |
| Rolling updates | Met à jour sans interruption |
| Rollback | Revient à une version précédente |
| Self-healing | Recrée les pods qui échouent |

---

### Qu'est-ce qu'un Service ?

**Définition** : Un Service est une abstraction qui expose un groupe de Pods comme un service réseau stable. Les pods étant éphémères (IP qui change), le Service fournit une IP et un nom DNS fixes.

Le diagramme suivant montre l'architecture simplifiée d'un déploiement Kubernetes avec Ingress, Service et Pods.

```mermaid
graph TD
    user[Utilisateur] --> ingress[Ingress<br>Point d'entrée]
    ingress --> svc[Service]
    svc --> pod1[Pod 1]
    svc --> pod2[Pod 2]
    pod1 --> pvc[(Volume persistant)]
    pod2 --> pvc
```

**Types de Services** :

| Type | Description | Accès |
| ---- | ----------- | ----- |
| **ClusterIP** | IP interne au cluster | Depuis le cluster uniquement |
| **NodePort** | Expose sur un port de chaque node | Depuis l'extérieur via nodeIP:port |
| **LoadBalancer** | Utilise un load balancer cloud | Depuis internet |
| **ExternalName** | Alias DNS vers un service externe | Redirection DNS |

```text
┌─────────────────────────────────────────┐
│              Service (ClusterIP)         │
│              app-service:80              │
│                    │                     │
│         ┌─────────┼─────────┐           │
│         ▼         ▼         ▼           │
│    ┌────────┐ ┌────────┐ ┌────────┐    │
│    │ Pod 1  │ │ Pod 2  │ │ Pod 3  │    │
│    │ app:80 │ │ app:80 │ │ app:80 │    │
│    └────────┘ └────────┘ └────────┘    │
└─────────────────────────────────────────┘
```

---

### Qu'est-ce qu'un ConfigMap et un Secret ?

| Objet | Usage | Encodage |
| ----- | ----- | -------- |
| **ConfigMap** | Configuration non sensible | Texte clair |
| **Secret** | Données sensibles | Base64 (pas chiffré !) |

**Exemples d'utilisation** :

| ConfigMap | Secret |
| --------- | ------ |
| URL de base de données | Mot de passe de BDD |
| Niveau de log | Clés API |
| Paramètres applicatifs | Certificats TLS |

---

## Étapes Pratiques

### Étape 1 : Installer un cluster local avec Minikube

```bash
# Installer Minikube (cluster local pour le développement)
# macOS
brew install minikube

# Linux
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

# Démarrer le cluster
minikube start

# Vérifier l'état
minikube status

# Installer kubectl (CLI Kubernetes)
# macOS
brew install kubectl

# Vérifier la connexion au cluster
kubectl cluster-info
```

---

### Étape 2 : Créer un Deployment

```yaml
# deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
  labels:
    app: mon-app
spec:
  replicas: 3  # Nombre de pods
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
        - name: app
          image: nginx:1.26
          ports:
            - containerPort: 80
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "200m"
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
```

```bash
# Appliquer le deployment
kubectl apply -f deployment.yaml

# Voir les deployments
kubectl get deployments

# Voir les pods créés
kubectl get pods

# Voir les détails d'un pod
kubectl describe pod mon-app-xxxxx

# Voir les logs d'un pod
kubectl logs mon-app-xxxxx
```

---

### Étape 3 : Créer un Service

```yaml
# service.yaml
apiVersion: v1
kind: Service
metadata:
  name: mon-app-service
spec:
  type: ClusterIP  # Ou NodePort, LoadBalancer
  selector:
    app: mon-app  # Sélectionne les pods avec ce label
  ports:
    - protocol: TCP
      port: 80        # Port du service
      targetPort: 80  # Port du conteneur
```

```bash
# Appliquer le service
kubectl apply -f service.yaml

# Voir les services
kubectl get services

# Tester l'accès (avec Minikube)
minikube service mon-app-service --url
```

---

### Étape 4 : Utiliser ConfigMap et Secret

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
data:
  APP_ENV: "production"
  LOG_LEVEL: "info"
  DATABASE_HOST: "postgres-service"
```

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
data:
  # Valeurs encodées en base64
  # echo -n "mon_mot_de_passe" | base64
  DATABASE_PASSWORD: bW9uX21vdF9kZV9wYXNzZQ==
  API_KEY: Y2xlX3NlY3JldGU=
```

```yaml
# deployment-avec-config.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mon-app
  template:
    metadata:
      labels:
        app: mon-app
    spec:
      containers:
        - name: app
          image: mon-app:latest
          ports:
            - containerPort: 80
          # Variables depuis ConfigMap
          envFrom:
            - configMapRef:
                name: app-config
          # Variables depuis Secret
          env:
            - name: DATABASE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: app-secrets
                  key: DATABASE_PASSWORD
```

```bash
# Créer le ConfigMap
kubectl apply -f configmap.yaml

# Créer le Secret
kubectl apply -f secret.yaml

# Créer le Secret depuis la ligne de commande
kubectl create secret generic app-secrets \
  --from-literal=DATABASE_PASSWORD=mon_mot_de_passe \
  --from-literal=API_KEY=cle_secrete
```

---

### Étape 5 : Mise à l'échelle et mise à jour

```bash
# Mettre à l'échelle manuellement
kubectl scale deployment mon-app --replicas=5

# Mettre à jour l'image (ici vers la variante Alpine de la même version)
kubectl set image deployment/mon-app app=nginx:1.26-alpine

# Voir l'historique des déploiements
kubectl rollout history deployment/mon-app

# Revenir à la version précédente
kubectl rollout undo deployment/mon-app

# Revenir à une révision spécifique
kubectl rollout undo deployment/mon-app --to-revision=2

# Voir le statut du rollout
kubectl rollout status deployment/mon-app
```

---

### Étape 6 : Application complète avec base de données

```yaml
# postgres-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
        - name: postgres
          image: postgres:16
          ports:
            - containerPort: 5432
          env:
            - name: POSTGRES_DB
              value: "app_db"
            - name: POSTGRES_USER
              value: "app_user"
            - name: POSTGRES_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secrets
                  key: password
          volumeMounts:
            - name: postgres-storage
              mountPath: /var/lib/postgresql/data
      volumes:
        - name: postgres-storage
          persistentVolumeClaim:
            claimName: postgres-pvc
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 1Gi
```

```yaml
# app-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web-app
  template:
    metadata:
      labels:
        app: web-app
    spec:
      containers:
        - name: app
          image: mon-app:latest
          ports:
            - containerPort: 80
          env:
            - name: DATABASE_URL
              value: "postgresql://app_user:$(DATABASE_PASSWORD)@postgres-service:5432/app_db"
            - name: DATABASE_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: postgres-secrets
                  key: password
          readinessProbe:
            httpGet:
              path: /health
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 5
---
apiVersion: v1
kind: Service
metadata:
  name: web-app-service
spec:
  type: LoadBalancer
  selector:
    app: web-app
  ports:
    - port: 80
      targetPort: 80
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl get pods` | Lister les pods |
| `kubectl get deployments` | Lister les deployments |
| `kubectl get services` | Lister les services |
| `kubectl describe pod <nom>` | Détails d'un pod |
| `kubectl logs <pod>` | Logs d'un pod |
| `kubectl exec -it <pod> -- bash` | Shell dans un pod |
| `kubectl apply -f fichier.yaml` | Appliquer une config |
| `kubectl delete -f fichier.yaml` | Supprimer une config |
| `kubectl scale deployment <nom> --replicas=N` | Changer le nombre de replicas |
| `kubectl rollout undo deployment <nom>` | Rollback |

---

## Pièges Fréquents

### Piège 1 : Pods en CrashLoopBackOff

⚠️ **Problème** : Le conteneur démarre, crash, redémarre en boucle.

✅ **Solution** : Vérifier les logs et la configuration.

```bash
# Voir les logs
kubectl logs mon-pod

# Voir les événements
kubectl describe pod mon-pod

# Causes fréquentes :
# - Image non trouvée
# - Variable d'environnement manquante
# - Commande de démarrage incorrecte
```

---

### Piège 2 : Service qui ne route pas vers les pods

⚠️ **Problème** : Le service existe mais n'atteint pas les pods.

✅ **Solution** : Vérifier les labels et selectors.

```bash
# Les labels du pod doivent correspondre au selector du service
kubectl get pods --show-labels
kubectl describe service mon-service
```

---

### Piège 3 : Ressources insuffisantes

⚠️ **Problème** : Pods en Pending car pas assez de ressources.

✅ **Solution** : Vérifier les requests/limits et les ressources du cluster.

```bash
# Voir pourquoi un pod est Pending
kubectl describe pod mon-pod

# Voir les ressources des nodes
kubectl describe nodes
```

---

### Piège 4 : Secrets non chiffrés

⚠️ **Problème** : Les Secrets Kubernetes sont juste encodés en base64, **pas chiffrés**. N'importe qui ayant accès au cluster peut décoder les secrets avec une simple commande :

```bash
# Décoder un secret (aucune clé nécessaire !)
kubectl get secret mon-secret -o jsonpath='{.data.password}' | base64 -d
```

**Risques** :

- Toute personne avec accès `kubectl` peut lire tous les secrets
- Les secrets sont stockés en clair dans etcd (base de données du cluster)
- En cas de compromission du cluster, tous les secrets sont exposés

✅ **Solution** : Pour les environnements de production, utiliser des solutions de gestion de secrets externes :

| Solution | Description |
| -------- | ----------- |
| **HashiCorp Vault** | Coffre-fort sécurisé avec chiffrement, rotation automatique des secrets |
| **Sealed Secrets** | Chiffre les secrets avec une clé asymétrique, seul le cluster peut les déchiffrer |
| **External Secrets Operator** | Synchronise les secrets depuis des sources externes (AWS Secrets Manager, etc.) |

**Pour le développement local** : Les Secrets base64 sont acceptables pour apprendre et tester. En production, c'est un risque de sécurité majeur.

---

## Checklist de Validation

- [ ] Je comprends ce qu'est Kubernetes et pourquoi l'utiliser
- [ ] Je connais l'architecture d'un cluster (master/nodes)
- [ ] Je sais ce qu'est un Pod, un Deployment, un Service
- [ ] Je sais créer et appliquer des fichiers YAML Kubernetes
- [ ] Je sais utiliser kubectl pour gérer le cluster
- [ ] Je comprends les ConfigMaps et Secrets

---

## Exercice Pratique

**Énoncé** : Crée les fichiers YAML pour déployer une application web avec :

1. Un Deployment avec 2 replicas d'une image nginx
2. Un Service de type NodePort pour y accéder
3. Un ConfigMap avec une variable `APP_NAME`

**Résultat attendu** : 3 fichiers YAML fonctionnels.

---

## Solution de l'Exercice

```yaml
# 1-configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: webapp-config
data:
  APP_NAME: "Mon Application Web"
```

```yaml
# 2-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
          env:
            - name: APP_NAME
              valueFrom:
                configMapKeyRef:
                  name: webapp-config
                  key: APP_NAME
          resources:
            requests:
              memory: "64Mi"
              cpu: "100m"
            limits:
              memory: "128Mi"
              cpu: "200m"
```

```yaml
# 3-service.yaml
apiVersion: v1
kind: Service
metadata:
  name: webapp-service
spec:
  type: NodePort
  selector:
    app: webapp
  ports:
    - protocol: TCP
      port: 80
      targetPort: 80
      nodePort: 30080  # Port accessible depuis l'extérieur (30000-32767)
```

**Pour déployer** :

```bash
# Appliquer dans l'ordre
kubectl apply -f 1-configmap.yaml
kubectl apply -f 2-deployment.yaml
kubectl apply -f 3-service.yaml

# Vérifier
kubectl get all

# Accéder à l'application
minikube service webapp-service --url
# Ou via http://<node-ip>:30080
```

---

## Navigation

← Fiche précédente : **[BC03 - 04 - Le Déploiement Continu (CI/CD)](04-deploiement-continu.md)**
