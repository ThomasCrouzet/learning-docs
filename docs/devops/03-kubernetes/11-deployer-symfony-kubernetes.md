---
tags:
  - Kubernetes
  - Avancé
  - Pratique
description: "Déployer Symfony sur Kubernetes : application Symfony + PostgreSQL + Redis sur Minikube"
estimated_time: "90 min"
fiche_number: 11
total_fiches: 12
cursus: "Kubernetes"
---

# 11 - Déployer Symfony sur Kubernetes

> **En bref** : À la fin de cette fiche, tu sauras déployer une application Symfony complète sur Kubernetes avec PostgreSQL pour la base de données et Redis pour le cache, en utilisant des Deployments, Services, ConfigMaps, Secrets et PersistentVolumeClaims sur un cluster Minikube. Lecture estimée : 90 min.

## Prérequis

- Fiche **[10 - Helm - Gestionnaire de packages](10-helm-gestionnaire-packages.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer des Deployments, Services, ConfigMaps, Secrets et PVC
- Connaître les bases de Symfony ([cursus Symfony](../../03-symfony/index.md))
- Connaître les bases de PostgreSQL ([cursus PostgreSQL](../../04-postgresql/index.md))

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |
| Minikube    | 1.34+   |
| Helm        | 3.x     |
| PHP         | 8.3     |
| Symfony     | 7.4 LTS |
| PostgreSQL  | 16      |
| Redis       | 7.x     |
| Nginx       | 1.26    |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déployer une stack Symfony (PHP-FPM + Nginx + PostgreSQL + Redis) sur Kubernetes, en configurant correctement les variables d'environnement, les secrets, le stockage persistant et le réseau entre les services.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une architecture multi-services sur Kubernetes ?

**Définition** : Une architecture multi-services est un déploiement dans lequel chaque composant de l'application (PHP-FPM, Nginx, PostgreSQL, Redis) est un service Kubernetes indépendant, avec son propre Deployment, son propre Service et ses propres configurations.

**Le problème que cette architecture résout** :

Sans architecture multi-services :

1. **Tout dans un seul conteneur** : Mettre PHP, Nginx, PostgreSQL et Redis dans un seul conteneur empêche de les scaler indépendamment. Si l'application PHP a besoin de plus de puissance, tu dois dupliquer aussi PostgreSQL.
2. **Pas de résilience** : Si le processus PHP plante, il emporte Nginx et la base de données avec lui.
3. **Pas de mise à jour indépendante** : Pour mettre à jour PHP de 8.3 à 8.4, tu dois reconstruire l'image complète contenant tous les services.

**Comment cette architecture résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Tout dans un seul conteneur | Chaque service a son propre Deployment. Tu peux scaler PHP à 5 répliques tout en gardant 1 seule instance PostgreSQL |
| Pas de résilience | Si PHP plante, Kubernetes le redémarre sans toucher aux autres services |
| Pas de mise à jour indépendante | Tu mets à jour l'image PHP sans toucher à Nginx ni PostgreSQL |

**Analogie concrète** : C'est comme un restaurant. Le chef (PHP-FPM) prépare les plats. Le serveur (Nginx) les apporte aux clients. Le réfrigérateur (PostgreSQL) stocke les ingrédients. Le plan de travail propre (Redis) garde les ingrédients fréquemment utilisés à portée de main. Chaque poste fonctionne indépendamment. Si le chef est débordé, tu embauches un second chef sans acheter un second réfrigérateur.

---

### Les composants de la stack Symfony sur Kubernetes

| Composant | Rôle | Type Kubernetes |
| --------- | ---- | --------------- |
| **PHP-FPM** | Exécute le code Symfony | Deployment + Service (ClusterIP) |
| **Nginx** | Sert les fichiers statiques et transmet les requêtes PHP à PHP-FPM | Deployment + Service (NodePort) |
| **PostgreSQL** | Base de données | Deployment + Service (ClusterIP) + PVC |
| **Redis** | Cache et sessions | Deployment + Service (ClusterIP) |

**Flux des requêtes** :

Le diagramme suivant illustre l'architecture complète de la stack Symfony sur Kubernetes.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-11-déployer-symfony-kubernetes-1.html">Les composants de la stack Symfony sur Kubernetes (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-11-déployer-symfony-kubernetes-1.html" title="Les composants de la stack Symfony sur Kubernetes" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

```text
Client → Nginx (NodePort) → PHP-FPM (ClusterIP) → PostgreSQL (ClusterIP)
                                                 → Redis (ClusterIP)
```

---

### Pourquoi séparer Nginx et PHP-FPM ?

Dans un environnement Docker simple, tu peux mettre Nginx et PHP-FPM dans le même conteneur. Sur Kubernetes, on les sépare pour deux raisons :

1. **Scaling indépendant** : Si l'application est lente à cause de PHP (pas de Nginx), tu peux ajouter des répliques PHP-FPM sans multiplier les instances Nginx.
2. **Mises à jour indépendantes** : Tu peux mettre à jour la version de PHP sans toucher à la configuration Nginx.

Dans cette fiche, pour simplifier, **Nginx et PHP-FPM partagent le même pod** (multi-conteneurs). Ils ont besoin d'accéder au même système de fichiers (le code Symfony). On utilise un volume `emptyDir` partagé entre les deux conteneurs du pod.

---

## Étapes Pratiques

### Étape 1 : Préparer le namespace

```bash
# Crée un namespace dédié
kubectl create namespace symfony-app

# Change le namespace par défaut
kubectl config set-context --current --namespace=symfony-app
```

---

### Étape 2 : Créer les Secrets

Crée un fichier `secrets.yaml` :

```yaml
# secrets.yaml
# Secrets pour la base de données et l'application
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: symfony-app
type: Opaque
# Les valeurs sont encodées en base64
# Pour encoder : echo -n "ma-valeur" | base64
stringData:
  # stringData accepte les valeurs en clair (Kubernetes les encode automatiquement)
  POSTGRES_USER: "symfony_user"
  POSTGRES_PASSWORD: "symfony_secret_2025"
  POSTGRES_DB: "symfony_db"
  APP_SECRET: "a1b2c3d4e5f6789012345678abcdef01"
  DATABASE_URL: "postgresql://symfony_user:symfony_secret_2025@postgres-svc:5432/symfony_db?serverVersion=16&charset=utf8"
  REDIS_URL: "redis://redis-svc:6379"
```

```bash
# Crée les secrets
kubectl apply -f secrets.yaml

# Vérifie (les valeurs sont masquées)
kubectl get secrets app-secrets
kubectl describe secret app-secrets
```

---

### Étape 3 : Créer le ConfigMap

Crée un fichier `configmap.yaml` :

```yaml
# configmap.yaml
# Configuration non sensible de l'application (variables d'environnement)
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: symfony-app
data:
  APP_ENV: "prod"
  APP_DEBUG: "0"
---
# nginx-configmap.yaml
# Configuration Nginx (montée en volume, pas en variable d'environnement)
apiVersion: v1
kind: ConfigMap
metadata:
  name: nginx-config
  namespace: symfony-app
data:
  # Configuration Nginx pour PHP-FPM
  nginx.conf: |
    server {
        listen 80;
        server_name _;
        root /var/www/html/public;

        location / {
            try_files $uri /index.php$is_args$args;
        }

        location ~ ^/index\.php(/|$) {
            # Envoie les requêtes PHP à PHP-FPM (même pod, port 9000)
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_split_path_info ^(.+\.php)(/.*)$;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            fastcgi_param DOCUMENT_ROOT $realpath_root;
            internal;
        }

        location ~ \.php$ {
            return 404;
        }
    }
```

```bash
# Crée le ConfigMap
kubectl apply -f configmap.yaml

# Vérifie
kubectl get configmaps app-config
```

---

### Étape 4 : Déployer PostgreSQL

Crée un fichier `postgres.yaml` :

```yaml
# postgres.yaml
# PersistentVolumeClaim pour les données PostgreSQL
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: symfony-app
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      # 1 Go de stockage pour la base de données
      storage: 1Gi
---
# Deployment PostgreSQL
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: symfony-app
spec:
  # PostgreSQL ne supporte pas plusieurs répliques sans configuration spéciale
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
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          # Variables d'environnement depuis le Secret
          envFrom:
            - secretRef:
                name: app-secrets
          # Monte le volume persistant pour les données
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
              # Sous-dossier obligatoire pour PostgreSQL (sinon erreur de permissions)
              subPath: pgdata
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          # Health check : vérifie que PostgreSQL accepte les connexions
          readinessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - symfony_user
                - -d
                - symfony_db
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            exec:
              command:
                - pg_isready
                - -U
                - symfony_user
                - -d
                - symfony_db
            initialDelaySeconds: 30
            periodSeconds: 10
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-pvc
---
# Service PostgreSQL (accessible uniquement dans le cluster)
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: symfony-app
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  # ClusterIP : accessible uniquement depuis les autres pods
  type: ClusterIP
```

```bash
# Crée les ressources PostgreSQL
kubectl apply -f postgres.yaml

# Vérifie que le PVC est lié
kubectl get pvc postgres-pvc

# Vérifie que le pod PostgreSQL tourne
kubectl get pods -l app=postgres

# Attends que le pod soit Ready (1/1)
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
```

**Résultat attendu** :

```text
NAME                        READY   STATUS    RESTARTS   AGE
postgres-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
```

---

### Étape 5 : Déployer Redis

Crée un fichier `redis.yaml` :

```yaml
# redis.yaml
# Deployment Redis
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: symfony-app
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          # Health check : vérifie que Redis répond
          readinessProbe:
            exec:
              command:
                - redis-cli
                - ping
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            exec:
              command:
                - redis-cli
                - ping
            initialDelaySeconds: 10
            periodSeconds: 10
---
# Service Redis (accessible uniquement dans le cluster)
apiVersion: v1
kind: Service
metadata:
  name: redis-svc
  namespace: symfony-app
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
```

```bash
# Crée les ressources Redis
kubectl apply -f redis.yaml

# Vérifie que le pod Redis tourne
kubectl get pods -l app=redis

# Attends que le pod soit Ready
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s
```

> **Note sécurité Redis en production** : Le déploiement ci-dessus lance Redis sans authentification (`requirepass`), ce qui est acceptable pour Minikube et les exercices locaux. En production, tu dois obligatoirement sécuriser Redis avec un mot de passe :
>
> 1. Crée un Secret Kubernetes contenant le mot de passe Redis.
> 2. Passe le mot de passe à Redis via la commande `redis-server --requirepass $(REDIS_PASSWORD)` dans le conteneur.
> 3. Mets à jour la variable `REDIS_URL` dans le ConfigMap Symfony : `redis://:$(REDIS_PASSWORD)@redis-svc:6379`.
>
> Sans authentification, tout pod du cluster peut lire et modifier le cache Redis, ce qui peut entraîner des fuites de données de session ou des attaques de type cache poisoning.

---

### Étape 6 : Déployer l'application Symfony (PHP-FPM + Nginx)

Crée un fichier `symfony-app.yaml` :

```yaml
# symfony-app.yaml
# Deployment Symfony (PHP-FPM + Nginx dans le même pod)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: symfony
  namespace: symfony-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: symfony
  template:
    metadata:
      labels:
        app: symfony
    spec:
      # Init container : copie le code Symfony dans un volume partagé
      # En production, ton image PHP contiendrait déjà le code
      initContainers:
        - name: init-app
          image: php:8.3-fpm-alpine
          command:
            - sh
            - -c
            - |
              # Crée une application Symfony minimale pour la démonstration
              mkdir -p /app/public
              # Crée un fichier index.php minimal
              cat > /app/public/index.php << 'PHPEOF'
              <?php
              // Point d'entrée Symfony simplifié pour la démonstration
              header('Content-Type: application/json');
              $response = [
                  'status' => 'ok',
                  'message' => 'Symfony sur Kubernetes fonctionne',
                  'php_version' => PHP_VERSION,
                  'hostname' => gethostname(),
                  'timestamp' => date('Y-m-d H:i:s'),
              ];
              // Teste la connexion PostgreSQL
              try {
                  $dsn = getenv('DATABASE_URL');
                  if ($dsn) {
                      $response['database'] = 'URL configuree';
                  }
              } catch (Exception $e) {
                  $response['database_error'] = $e->getMessage();
              }
              // Teste la connexion Redis
              try {
                  $redisUrl = getenv('REDIS_URL');
                  if ($redisUrl) {
                      $response['redis'] = 'URL configuree';
                  }
              } catch (Exception $e) {
                  $response['redis_error'] = $e->getMessage();
              }
              echo json_encode($response, JSON_PRETTY_PRINT);
              PHPEOF
          volumeMounts:
            - name: app-code
              mountPath: /app
      containers:
        # Conteneur 1 : PHP-FPM
        - name: php-fpm
          image: php:8.3-fpm-alpine
          ports:
            - containerPort: 9000
          # Variables d'environnement depuis le Secret et le ConfigMap
          envFrom:
            - secretRef:
                name: app-secrets
            - configMapRef:
                name: app-config
          # Monte le code de l'application
          volumeMounts:
            - name: app-code
              mountPath: /var/www/html
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "300m"
              memory: "256Mi"
          # Health check : vérifie que PHP-FPM écoute sur le port 9000
          readinessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 10
            periodSeconds: 10
        # Conteneur 2 : Nginx (même pod que PHP-FPM)
        - name: nginx
          image: nginx:1.26-alpine
          ports:
            - containerPort: 80
          # Monte le code de l'application (pour les fichiers statiques)
          volumeMounts:
            - name: app-code
              mountPath: /var/www/html
            # Monte la configuration Nginx depuis le ConfigMap
            - name: nginx-config
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: nginx.conf
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
      volumes:
        # Volume partagé entre PHP-FPM et Nginx (code de l'application)
        - name: app-code
          emptyDir: {}
        # Configuration Nginx depuis le ConfigMap dédié
        - name: nginx-config
          configMap:
            name: nginx-config
---
# Service Symfony (accessible depuis l'extérieur via NodePort)
apiVersion: v1
kind: Service
metadata:
  name: symfony-svc
  namespace: symfony-app
spec:
  selector:
    app: symfony
  ports:
    - port: 80
      targetPort: 80
  type: NodePort
```

```bash
# Crée les ressources Symfony
kubectl apply -f symfony-app.yaml

# Vérifie que les pods Symfony tournent (2 conteneurs par pod : php-fpm + nginx)
kubectl get pods -l app=symfony

# Attends que les pods soient Ready (2/2)
kubectl wait --for=condition=ready pod -l app=symfony --timeout=120s
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
symfony-xxxxxxxxxx-xxxxx   2/2     Running   0          30s
symfony-xxxxxxxxxx-xxxxx   2/2     Running   0          30s
```

Le `2/2` dans la colonne READY indique que les deux conteneurs (PHP-FPM et Nginx) du pod sont prêts.

---

### Étape 7 : Vérifier la stack complète

```bash
# Liste tous les pods
kubectl get pods

# Liste tous les services
kubectl get services

# Liste les PVCs
kubectl get pvc
```

**Résultat attendu** :

```text
NAME                        READY   STATUS    RESTARTS   AGE
postgres-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
redis-xxxxxxxxxx-xxxxx      1/1     Running   0          4m
symfony-xxxxxxxxxx-xxxxx    2/2     Running   0          2m
symfony-xxxxxxxxxx-xxxxx    2/2     Running   0          2m
```

---

### Étape 8 : Accéder à l'application

```bash
# Récupère l'URL du service Symfony
minikube service symfony-svc -n symfony-app --url
```

**Résultat attendu** :

```text
http://192.168.49.2:3xxxx
```

```bash
# Teste l'application (remplace l'URL par celle affichée)
curl $(minikube service symfony-svc -n symfony-app --url)
```

**Résultat attendu** :

```json
{
    "status": "ok",
    "message": "Symfony sur Kubernetes fonctionne",
    "php_version": "8.3.x",
    "hostname": "symfony-xxxxxxxxxx-xxxxx",
    "timestamp": "2025-xx-xx xx:xx:xx",
    "database": "URL configuree",
    "redis": "URL configuree"
}
```

Le champ `hostname` change entre les requêtes car Kubernetes distribue le trafic entre les 2 répliques.

---

### Étape 9 : Vérifier la connectivité entre les services

```bash
# Vérifie que PHP-FPM peut atteindre PostgreSQL
kubectl exec -it deploy/symfony -c php-fpm -- sh -c "nc -zv postgres-svc 5432"
```

**Résultat attendu** :

```text
postgres-svc (10.x.x.x:5432) open
```

```bash
# Vérifie que PHP-FPM peut atteindre Redis
kubectl exec -it deploy/symfony -c php-fpm -- sh -c "nc -zv redis-svc 6379"
```

**Résultat attendu** :

```text
redis-svc (10.x.x.x:6379) open
```

```bash
# Vérifie les variables d'environnement dans le conteneur PHP-FPM
kubectl exec -it deploy/symfony -c php-fpm -- env | grep -E "DATABASE_URL|REDIS_URL|APP_ENV"
```

**Résultat attendu** :

```text
DATABASE_URL=postgresql://symfony_user:symfony_secret_2025@postgres-svc:5432/symfony_db?serverVersion=16&charset=utf8
REDIS_URL=redis://redis-svc:6379
APP_ENV=prod
```

---

### Étape 10 : Consulter les logs

```bash
# Logs du conteneur PHP-FPM
kubectl logs deploy/symfony -c php-fpm

# Logs du conteneur Nginx
kubectl logs deploy/symfony -c nginx

# Logs de PostgreSQL
kubectl logs deploy/postgres

# Logs de Redis
kubectl logs deploy/redis
```

---

### Étape 11 : Scaler l'application

```bash
# Augmente le nombre de répliques Symfony à 3
kubectl scale deployment symfony --replicas=3

# Vérifie
kubectl get pods -l app=symfony
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
symfony-xxxxxxxxxx-xxxxx   2/2     Running   0          5m
symfony-xxxxxxxxxx-xxxxx   2/2     Running   0          5m
symfony-xxxxxxxxxx-xxxxx   2/2     Running   0          10s
```

PostgreSQL et Redis ne changent pas. Seul le front-end PHP est scalé.

---

### Étape 12 : Nettoyer

```bash
# Supprime toutes les ressources
kubectl delete -f symfony-app.yaml
kubectl delete -f redis.yaml
kubectl delete -f postgres.yaml
kubectl delete -f configmap.yaml
kubectl delete -f secrets.yaml

# Supprime le namespace
kubectl config set-context --current --namespace=default
kubectl delete namespace symfony-app

# Vérifie
kubectl get namespaces
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl get all -n symfony-app` | Liste toutes les ressources du namespace |
| `kubectl logs deploy/symfony -c php-fpm` | Affiche les logs du conteneur PHP-FPM |
| `kubectl logs deploy/symfony -c nginx` | Affiche les logs du conteneur Nginx |
| `kubectl exec -it deploy/symfony -c php-fpm -- sh` | Ouvre un shell dans le conteneur PHP-FPM |
| `kubectl describe pod -l app=symfony` | Affiche les détails des pods Symfony |
| `kubectl port-forward svc/symfony-svc 8080:80 -n symfony-app` | Redirige le port 8080 local vers le Service |
| `kubectl scale deployment symfony --replicas=N` | Change le nombre de répliques |
| `minikube service symfony-svc -n symfony-app --url` | Récupère l'URL du Service |

---

## Pièges Fréquents

### Piège 1 : Le pod Symfony affiche "0/2 Ready"

⚠️ **Problème** : Les conteneurs PHP-FPM ou Nginx ne démarrent pas. Le pod reste en status `Init:0/1` ou `0/2`.

✅ **Solution** : Vérifie les logs de chaque conteneur et de l'init container :

```bash
# Logs de l'init container
kubectl logs <nom-du-pod> -c init-app

# Logs de PHP-FPM
kubectl logs <nom-du-pod> -c php-fpm

# Logs de Nginx
kubectl logs <nom-du-pod> -c nginx

# Événements du pod
kubectl describe pod <nom-du-pod>
```

### Piège 2 : PostgreSQL ne démarre pas (erreur de permissions)

⚠️ **Problème** : PostgreSQL affiche une erreur `initdb: could not change permissions of directory`.

✅ **Solution** : Utilise `subPath` dans le volumeMount de PostgreSQL. Le montage direct d'un PVC sur `/var/lib/postgresql/data` pose des problèmes de permissions. Le `subPath: pgdata` crée un sous-dossier avec les bonnes permissions :

```yaml
volumeMounts:
  - name: postgres-data
    mountPath: /var/lib/postgresql/data
    subPath: pgdata
```

### Piège 3 : Les services ne se trouvent pas entre eux

⚠️ **Problème** : PHP-FPM ne peut pas se connecter à `postgres-svc` ou `redis-svc`.

✅ **Solution** : Vérifie que tous les services sont dans le même namespace. Le DNS interne de Kubernetes résout `<service-name>` uniquement dans le même namespace. Pour accéder à un service dans un autre namespace, utilise `<service-name>.<namespace>.svc.cluster.local`.

```bash
# Vérifie les services
kubectl get services -n symfony-app

# Teste la résolution DNS depuis un pod
kubectl exec -it deploy/symfony -c php-fpm -- nslookup postgres-svc
```

### Piège 4 : Minikube manque de ressources

⚠️ **Problème** : Les pods restent en `Pending` avec le message "Insufficient cpu" ou "Insufficient memory".

✅ **Solution** : Augmente les ressources de Minikube ou réduis les requests des pods :

```bash
# Vérifie les ressources disponibles
kubectl describe node minikube | grep -A 5 Allocatable

# Si nécessaire, redémarre Minikube avec plus de ressources
minikube stop
minikube start --cpus=4 --memory=4096
```

---

## Checklist de Validation

- [ ] Je sais organiser une application multi-services sur Kubernetes
- [ ] Je sais configurer des Secrets pour les données sensibles (mots de passe, URLs)
- [ ] Je sais configurer un ConfigMap avec une configuration Nginx
- [ ] Je sais déployer PostgreSQL avec un PVC pour la persistance
- [ ] Je sais déployer Redis comme service de cache
- [ ] Je sais déployer un pod multi-conteneurs (PHP-FPM + Nginx)
- [ ] Je sais vérifier la connectivité entre les services
- [ ] Je sais accéder à l'application via Minikube

---

## Exercice Pratique

**Énoncé** : Déploie la stack Symfony avec des améliorations.

1. Crée un namespace `symfony-exercise`
2. Déploie PostgreSQL avec :
   - Un PVC de 2 Go
   - Des probes liveness et readiness
   - Un utilisateur et une base de données personnalisés
3. Déploie Redis avec des probes
4. Déploie l'application Symfony (PHP-FPM + Nginx) avec :
   - 3 répliques
   - Des probes sur les deux conteneurs
   - Un Service NodePort
5. Vérifie que l'application répond
6. Scale les répliques Symfony à 5 puis à 1
7. Vérifie que l'application continue de répondre après le scaling
8. Supprime tout

**Indications** :

- Utilise `stringData` dans les Secrets pour éviter l'encodage base64 manuel
- Vérifie les probes avec `kubectl describe pod`
- Utilise `kubectl wait` pour attendre que les pods soient prêts avant de tester

**Résultat attendu** : La stack complète fonctionne et le scaling ne cause aucune interruption.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Crée le namespace
kubectl create namespace symfony-exercise
kubectl config set-context --current --namespace=symfony-exercise
```

Crée le fichier `exercise-stack.yaml` :

```yaml
# exercise-stack.yaml
# --- Secrets ---
apiVersion: v1
kind: Secret
metadata:
  name: exercise-secrets
  namespace: symfony-exercise
type: Opaque
stringData:
  POSTGRES_USER: "exercise_user"
  POSTGRES_PASSWORD: "exercise_password_2025"
  POSTGRES_DB: "exercise_db"
  APP_SECRET: "exercise-app-secret-key-0123456789ab"
  DATABASE_URL: "postgresql://exercise_user:exercise_password_2025@pg-svc:5432/exercise_db?serverVersion=16&charset=utf8"
  REDIS_URL: "redis://cache-svc:6379"
---
# --- ConfigMap ---
apiVersion: v1
kind: ConfigMap
metadata:
  name: exercise-config
  namespace: symfony-exercise
data:
  APP_ENV: "prod"
  APP_DEBUG: "0"
  nginx.conf: |
    server {
        listen 80;
        server_name _;
        root /var/www/html/public;
        location / {
            try_files $uri /index.php$is_args$args;
        }
        location ~ ^/index\.php(/|$) {
            fastcgi_pass 127.0.0.1:9000;
            fastcgi_split_path_info ^(.+\.php)(/.*)$;
            include fastcgi_params;
            fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
            fastcgi_param DOCUMENT_ROOT $realpath_root;
            internal;
        }
        location ~ \.php$ {
            return 404;
        }
    }
---
# --- PostgreSQL PVC ---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: pg-pvc
  namespace: symfony-exercise
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
---
# --- PostgreSQL Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: symfony-exercise
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
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          envFrom:
            - secretRef:
                name: exercise-secrets
          volumeMounts:
            - name: pg-data
              mountPath: /var/lib/postgresql/data
              subPath: pgdata
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          readinessProbe:
            exec:
              command: ["pg_isready", "-U", "exercise_user", "-d", "exercise_db"]
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", "exercise_user", "-d", "exercise_db"]
            initialDelaySeconds: 30
            periodSeconds: 10
      volumes:
        - name: pg-data
          persistentVolumeClaim:
            claimName: pg-pvc
---
# --- PostgreSQL Service ---
apiVersion: v1
kind: Service
metadata:
  name: pg-svc
  namespace: symfony-exercise
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
---
# --- Redis Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: symfony-exercise
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          readinessProbe:
            exec:
              command: ["redis-cli", "ping"]
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            exec:
              command: ["redis-cli", "ping"]
            initialDelaySeconds: 10
            periodSeconds: 10
---
# --- Redis Service ---
apiVersion: v1
kind: Service
metadata:
  name: cache-svc
  namespace: symfony-exercise
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
---
# --- Symfony Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: symfony
  namespace: symfony-exercise
spec:
  replicas: 3
  selector:
    matchLabels:
      app: symfony
  template:
    metadata:
      labels:
        app: symfony
    spec:
      initContainers:
        - name: init-app
          image: php:8.3-fpm-alpine
          command:
            - sh
            - -c
            - |
              mkdir -p /app/public
              cat > /app/public/index.php << 'PHPEOF'
              <?php
              header('Content-Type: application/json');
              echo json_encode([
                  'status' => 'ok',
                  'hostname' => gethostname(),
                  'php' => PHP_VERSION,
                  'time' => date('H:i:s'),
              ], JSON_PRETTY_PRINT);
              PHPEOF
          volumeMounts:
            - name: app-code
              mountPath: /app
      containers:
        - name: php-fpm
          image: php:8.3-fpm-alpine
          ports:
            - containerPort: 9000
          envFrom:
            - secretRef:
                name: exercise-secrets
            - configMapRef:
                name: exercise-config
          volumeMounts:
            - name: app-code
              mountPath: /var/www/html
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "300m"
              memory: "256Mi"
          readinessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            tcpSocket:
              port: 9000
            initialDelaySeconds: 10
            periodSeconds: 10
        - name: nginx
          image: nginx:1.26-alpine
          ports:
            - containerPort: 80
          volumeMounts:
            - name: app-code
              mountPath: /var/www/html
            - name: nginx-config
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: nginx.conf
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "128Mi"
          readinessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 5
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 10
      volumes:
        - name: app-code
          emptyDir: {}
        - name: nginx-config
          configMap:
            name: exercise-config
---
# --- Symfony Service ---
apiVersion: v1
kind: Service
metadata:
  name: symfony-svc
  namespace: symfony-exercise
spec:
  selector:
    app: symfony
  ports:
    - port: 80
      targetPort: 80
  type: NodePort
```

```bash
# Crée les ressources
kubectl apply -f exercise-stack.yaml

# Attends que tout soit prêt
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s
kubectl wait --for=condition=ready pod -l app=symfony --timeout=120s

# 5. Vérifie que l'application répond
curl $(minikube service symfony-svc -n symfony-exercise --url)

# 6. Scale à 5 puis à 1
kubectl scale deployment symfony --replicas=5
kubectl get pods -l app=symfony
kubectl scale deployment symfony --replicas=1
kubectl get pods -l app=symfony

# 7. Vérifie que l'application répond toujours
curl $(minikube service symfony-svc -n symfony-exercise --url)

# 8. Supprime tout
kubectl delete -f exercise-stack.yaml
kubectl config set-context --current --namespace=default
kubectl delete namespace symfony-exercise
```

---

## Navigation

← Fiche précédente : **[10 - Helm -- Gestionnaire de packages](10-helm-gestionnaire-packages.md)**

→ Fiche suivante : **[12 - Projet intégrateur](12-projet-integrateur.md)**
