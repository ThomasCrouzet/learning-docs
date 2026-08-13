---
tags:
  - Kubernetes
  - Avancé
  - Projet
description: "Projet intégrateur : déployer une application complète Symfony + React + PostgreSQL sur Kubernetes"
estimated_time: "120 min"
fiche_number: 12
total_fiches: 12
cursus: "Kubernetes"
---

# 12 - Projet intégrateur

> **En bref** : Dans ce projet, tu vas déployer une application complète composée d'un back-end Symfony (API), d'un front-end React, d'une base PostgreSQL et d'un cache Redis sur un cluster Minikube, en appliquant toutes les notions vues dans le cursus : Deployments, Services, ConfigMaps, Secrets, PVC, probes, Helm et Ingress. Lecture estimée : 120 min.

## Prérequis

- Toutes les fiches du [cursus Kubernetes](index.md) (fiches 01 à 11)
- Avoir un cluster Minikube démarré et fonctionnel
- Avoir Helm installé
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
| Node.js     | 22 LTS  |

## Objectif de cette fiche

À la fin de ce projet, tu auras déployé une application complète sur Kubernetes avec :

- Un back-end API (Symfony + PHP-FPM + Nginx)
- Un front-end (React servi par Nginx)
- Une base de données (PostgreSQL avec stockage persistant)
- Un cache (Redis)
- Un Ingress pour router le trafic entre le front-end et l'API
- Des health checks sur tous les services
- Un HPA pour l'autoscaling du back-end

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Architecture du projet

**Définition** : L'architecture cible est une application web classique avec une séparation front-end / back-end, une base de données et un cache, chaque composant étant un service Kubernetes indépendant.

**Schéma de l'architecture** :

```mermaid
flowchart TD
    ING["Ingress\n(routage)"] --> |"/"| FRONT["Front-end\n(React + Nginx)"]
    ING --> |"/api"| BACK["Back-end\n(Symfony + PHP-FPM + Nginx)"]
    BACK --> PG["PostgreSQL\n(+ PVC)"]
    BACK --> REDIS["Redis\n(cache)"]
```

**Les composants** :

| Composant | Rôle | Ressources Kubernetes |
| --------- | ---- | --------------------- |
| Front-end React | Interface utilisateur | Deployment (2 répliques) + Service ClusterIP |
| Back-end Symfony | API REST | Deployment (2 répliques) + Service ClusterIP + HPA |
| PostgreSQL | Base de données | Deployment (1 réplique) + Service ClusterIP + PVC |
| Redis | Cache et sessions | Deployment (1 réplique) + Service ClusterIP |
| Ingress | Routage HTTP | Ingress (route `/` vers React, `/api` vers Symfony) |

---

### Qu'est-ce qu'un Ingress ?

**Définition** : Un Ingress est un objet Kubernetes qui gère l'accès HTTP/HTTPS externe vers les services du cluster. Il agit comme un reverse proxy qui route les requêtes vers différents services en fonction de l'URL.

**Le problème que l'Ingress résout** :

Sans Ingress :

1. **Un NodePort par service** : Chaque service exposé nécessite son propre port (30080 pour le front, 30081 pour l'API). L'utilisateur doit connaître les numéros de port.
2. **Pas de routage par URL** : Tu ne peux pas envoyer `/api` vers Symfony et `/` vers React sans un reverse proxy externe.
3. **Pas de HTTPS centralisé** : Chaque service doit gérer son propre certificat TLS.

**Comment l'Ingress résout ces problèmes** :

| Problème | Solution apportée par l'Ingress |
| -------- | ------------------------------- |
| Un NodePort par service | Un seul point d'entrée (port 80/443) pour tous les services |
| Pas de routage par URL | L'Ingress route par chemin (`/api` → Symfony, `/` → React) |
| Pas de HTTPS centralisé | L'Ingress gère le certificat TLS pour tous les services |

**Analogie concrète** : L'Ingress est comme l'accueil d'un immeuble de bureaux. Au lieu de donner une porte d'entrée différente à chaque entreprise (NodePort), l'accueil (Ingress) reçoit tous les visiteurs par la porte principale et les oriente vers le bon étage : "Tu cherches l'API ? 3e étage. Tu cherches le site web ? Rez-de-chaussée."

---

## Étapes Pratiques

### Étape 1 : Préparer l'environnement

```bash
# Active l'addon Ingress sur Minikube
minikube addons enable ingress

# Vérifie que le contrôleur Ingress tourne
kubectl get pods -n ingress-nginx
```

**Résultat attendu** :

```text
NAME                                        READY   STATUS    RESTARTS   AGE
ingress-nginx-controller-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
```

```bash
# Active le metrics-server (pour le HPA)
minikube addons enable metrics-server

# Crée le namespace du projet
kubectl create namespace fullstack

# Change le namespace par défaut
kubectl config set-context --current --namespace=fullstack
```

---

### Étape 2 : Créer les Secrets et ConfigMaps

Crée un fichier `01-config.yaml` :

```yaml
# 01-config.yaml
# Secrets pour toute la stack
apiVersion: v1
kind: Secret
metadata:
  name: db-secrets
  namespace: fullstack
type: Opaque
stringData:
  POSTGRES_USER: "fullstack_user"
  POSTGRES_PASSWORD: "fullstack_secure_2025"
  POSTGRES_DB: "fullstack_db"
---
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
  namespace: fullstack
type: Opaque
stringData:
  APP_SECRET: "projet-integrateur-secret-key-2025"
  DATABASE_URL: "postgresql://fullstack_user:fullstack_secure_2025@postgres-svc:5432/fullstack_db?serverVersion=16&charset=utf8"
  REDIS_URL: "redis://redis-svc:6379"
---
# ConfigMap pour la configuration non sensible
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config
  namespace: fullstack
data:
  APP_ENV: "prod"
  APP_DEBUG: "0"
  # Configuration Nginx pour le back-end (PHP-FPM)
  backend-nginx.conf: |
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
  # Configuration Nginx pour le front-end (React)
  frontend-nginx.conf: |
    server {
        listen 80;
        server_name _;
        root /usr/share/nginx/html;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }
    }
```

```bash
# Crée les configs
kubectl apply -f 01-config.yaml

# Vérifie
kubectl get secrets
kubectl get configmaps
```

---

### Étape 3 : Déployer PostgreSQL

Crée un fichier `02-postgres.yaml` :

```yaml
# 02-postgres.yaml
# PVC pour PostgreSQL
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: postgres-pvc
  namespace: fullstack
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
---
# Deployment PostgreSQL
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres
  namespace: fullstack
  labels:
    app: postgres
    tier: database
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  # Stratégie Recreate : un seul pod PostgreSQL à la fois
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: postgres
        tier: database
    spec:
      containers:
        - name: postgres
          image: postgres:16-alpine
          ports:
            - containerPort: 5432
          envFrom:
            - secretRef:
                name: db-secrets
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
              subPath: pgdata
          resources:
            requests:
              cpu: "100m"
              memory: "256Mi"
            limits:
              cpu: "500m"
              memory: "512Mi"
          startupProbe:
            exec:
              command: ["pg_isready", "-U", "fullstack_user", "-d", "fullstack_db"]
            periodSeconds: 5
            failureThreshold: 12
          readinessProbe:
            exec:
              command: ["pg_isready", "-U", "fullstack_user", "-d", "fullstack_db"]
            periodSeconds: 5
            failureThreshold: 2
          livenessProbe:
            exec:
              command: ["pg_isready", "-U", "fullstack_user", "-d", "fullstack_db"]
            periodSeconds: 10
            failureThreshold: 3
      volumes:
        - name: postgres-data
          persistentVolumeClaim:
            claimName: postgres-pvc
---
# Service PostgreSQL
apiVersion: v1
kind: Service
metadata:
  name: postgres-svc
  namespace: fullstack
spec:
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
  type: ClusterIP
```

```bash
# Déploie PostgreSQL
kubectl apply -f 02-postgres.yaml

# Attends que PostgreSQL soit prêt
kubectl wait --for=condition=ready pod -l app=postgres --timeout=120s

# Vérifie
kubectl get pods -l app=postgres
kubectl get pvc
```

---

### Étape 4 : Déployer Redis

Crée un fichier `03-redis.yaml` :

```yaml
# 03-redis.yaml
# Deployment Redis
apiVersion: apps/v1
kind: Deployment
metadata:
  name: redis
  namespace: fullstack
  labels:
    app: redis
    tier: cache
spec:
  replicas: 1
  selector:
    matchLabels:
      app: redis
  template:
    metadata:
      labels:
        app: redis
        tier: cache
    spec:
      containers:
        - name: redis
          image: redis:7-alpine
          ports:
            - containerPort: 6379
          # Lance Redis avec un mot de passe et une limite mémoire
          command:
            - redis-server
            - --maxmemory
            - "128mb"
            - --maxmemory-policy
            - allkeys-lru
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "200m"
              memory: "192Mi"
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
# Service Redis
apiVersion: v1
kind: Service
metadata:
  name: redis-svc
  namespace: fullstack
spec:
  selector:
    app: redis
  ports:
    - port: 6379
      targetPort: 6379
  type: ClusterIP
```

```bash
# Déploie Redis
kubectl apply -f 03-redis.yaml

# Attends que Redis soit prêt
kubectl wait --for=condition=ready pod -l app=redis --timeout=60s

# Vérifie
kubectl get pods -l app=redis
```

---

### Étape 5 : Déployer le back-end Symfony

Crée un fichier `04-backend.yaml` :

```yaml
# 04-backend.yaml
# Deployment back-end Symfony (PHP-FPM + Nginx)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
  namespace: fullstack
  labels:
    app: backend
    tier: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
        tier: api
    spec:
      # Init container : prépare le code de l'application
      initContainers:
        - name: init-app
          image: php:8.3-fpm-alpine
          command:
            - sh
            - -c
            - |
              mkdir -p /app/public
              # Crée une API minimale pour la démonstration
              cat > /app/public/index.php << 'PHPEOF'
              <?php
              header('Content-Type: application/json');
              header('Access-Control-Allow-Origin: *');
              header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
              header('Access-Control-Allow-Headers: Content-Type');

              // Gestion des requêtes OPTIONS (CORS)
              if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
                  http_response_code(204);
                  exit;
              }

              $uri = $_SERVER['REQUEST_URI'];
              $response = [];

              // Route : /api/health
              if (strpos($uri, '/api/health') === 0) {
                  $response = [
                      'status' => 'healthy',
                      'service' => 'backend-api',
                      'hostname' => gethostname(),
                      'php_version' => PHP_VERSION,
                      'timestamp' => date('c'),
                  ];
              }
              // Route : /api/status
              elseif (strpos($uri, '/api/status') === 0) {
                  $checks = ['api' => true];

                  // Vérifie PostgreSQL
                  $dbUrl = getenv('DATABASE_URL');
                  if ($dbUrl) {
                      $checks['database_configured'] = true;
                  }

                  // Vérifie Redis
                  $redisUrl = getenv('REDIS_URL');
                  if ($redisUrl) {
                      $checks['redis_configured'] = true;
                  }

                  $response = [
                      'status' => 'ok',
                      'environment' => getenv('APP_ENV') ?: 'unknown',
                      'checks' => $checks,
                  ];
              }
              // Route par défaut
              else {
                  $response = [
                      'service' => 'Symfony API',
                      'version' => '1.0.0',
                      'endpoints' => [
                          '/api/health' => 'Health check',
                          '/api/status' => 'Status de la stack',
                      ],
                  ];
              }

              echo json_encode($response, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
              PHPEOF
          volumeMounts:
            - name: app-code
              mountPath: /app
      containers:
        # Conteneur PHP-FPM
        - name: php-fpm
          image: php:8.3-fpm-alpine
          ports:
            - containerPort: 9000
          envFrom:
            - secretRef:
                name: app-secrets
            - configMapRef:
                name: app-config
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
          startupProbe:
            tcpSocket:
              port: 9000
            periodSeconds: 2
            failureThreshold: 15
          readinessProbe:
            tcpSocket:
              port: 9000
            periodSeconds: 5
            failureThreshold: 2
          livenessProbe:
            tcpSocket:
              port: 9000
            periodSeconds: 10
            failureThreshold: 3
        # Conteneur Nginx
        - name: nginx
          image: nginx:1.26-alpine
          ports:
            - containerPort: 80
          volumeMounts:
            - name: app-code
              mountPath: /var/www/html
            - name: nginx-config
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: backend-nginx.conf
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "150m"
              memory: "128Mi"
          readinessProbe:
            httpGet:
              path: /api/health
              port: 80
            initialDelaySeconds: 10
            periodSeconds: 5
          livenessProbe:
            httpGet:
              path: /api/health
              port: 80
            initialDelaySeconds: 15
            periodSeconds: 10
      volumes:
        - name: app-code
          emptyDir: {}
        - name: nginx-config
          configMap:
            name: app-config
---
# Service back-end
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
  namespace: fullstack
spec:
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
---
# HPA pour le back-end (autoscaling)
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: backend-hpa
  namespace: fullstack
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend
  minReplicas: 2
  maxReplicas: 6
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

```bash
# Déploie le back-end
kubectl apply -f 04-backend.yaml

# Attends que les pods soient prêts
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s

# Vérifie
kubectl get pods -l app=backend
kubectl get hpa
```

**Résultat attendu** :

```text
NAME                       READY   STATUS    RESTARTS   AGE
backend-xxxxxxxxxx-xxxxx   2/2     Running   0          30s
backend-xxxxxxxxxx-xxxxx   2/2     Running   0          30s
```

---

### Étape 6 : Déployer le front-end React

Crée un fichier `05-frontend.yaml` :

```yaml
# 05-frontend.yaml
# Deployment front-end React (servi par Nginx)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
  namespace: fullstack
  labels:
    app: frontend
    tier: ui
spec:
  replicas: 2
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
        tier: ui
    spec:
      # Init container : crée une application React minimale (HTML/JS statique)
      initContainers:
        - name: init-frontend
          image: nginx:1.26-alpine
          command:
            - sh
            - -c
            - |
              mkdir -p /app
              # Crée une page HTML qui simule un front-end React
              cat > /app/index.html << 'HTMLEOF'
              <!DOCTYPE html>
              <html lang="fr">
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Projet Intégrateur Kubernetes</title>
                  <style>
                      * { margin: 0; padding: 0; box-sizing: border-box; }
                      body { font-family: -apple-system, sans-serif; background: #f5f5f5; padding: 2rem; }
                      .container { max-width: 800px; margin: 0 auto; }
                      h1 { color: #333; margin-bottom: 1rem; }
                      .card { background: white; border-radius: 8px; padding: 1.5rem; margin-bottom: 1rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
                      .status { display: inline-block; padding: 4px 12px; border-radius: 12px; font-size: 0.875rem; }
                      .status.ok { background: #d4edda; color: #155724; }
                      .status.error { background: #f8d7da; color: #721c24; }
                      .status.loading { background: #fff3cd; color: #856404; }
                      pre { background: #f8f9fa; padding: 1rem; border-radius: 4px; overflow-x: auto; margin-top: 0.5rem; }
                      button { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; margin-right: 8px; margin-top: 8px; }
                      .btn-primary { background: #007bff; color: white; }
                      .btn-secondary { background: #6c757d; color: white; }
                  </style>
              </head>
              <body>
                  <div class="container">
                      <h1>Projet Intégrateur Kubernetes</h1>
                      <p style="margin-bottom: 1rem; color: #666;">Front-end React (simulation) connecté à l'API Symfony</p>

                      <div class="card">
                          <h2>API Health Check</h2>
                          <div id="health-status" class="status loading">Chargement...</div>
                          <pre id="health-data">En attente...</pre>
                          <button class="btn-primary" onclick="checkHealth()">Vérifier</button>
                      </div>

                      <div class="card">
                          <h2>Status de la Stack</h2>
                          <div id="stack-status" class="status loading">Chargement...</div>
                          <pre id="stack-data">En attente...</pre>
                          <button class="btn-secondary" onclick="checkStack()">Vérifier</button>
                      </div>

                      <div class="card">
                          <h2>Informations</h2>
                          <pre id="info">Front-end servi par : Nginx sur Kubernetes
              Namespace : fullstack
              Architecture : React + Symfony + PostgreSQL + Redis</pre>
                      </div>
                  </div>

                  <script>
                      // URL de l'API (même domaine grâce à l'Ingress)
                      const API_BASE = '/api';

                      async function checkHealth() {
                          const statusEl = document.getElementById('health-status');
                          const dataEl = document.getElementById('health-data');
                          statusEl.className = 'status loading';
                          statusEl.textContent = 'Chargement...';
                          try {
                              const res = await fetch(API_BASE + '/health');
                              const data = await res.json();
                              statusEl.className = 'status ok';
                              statusEl.textContent = 'OK';
                              dataEl.textContent = JSON.stringify(data, null, 2);
                          } catch (e) {
                              statusEl.className = 'status error';
                              statusEl.textContent = 'Erreur';
                              dataEl.textContent = 'Erreur : ' + e.message;
                          }
                      }

                      async function checkStack() {
                          const statusEl = document.getElementById('stack-status');
                          const dataEl = document.getElementById('stack-data');
                          statusEl.className = 'status loading';
                          statusEl.textContent = 'Chargement...';
                          try {
                              const res = await fetch(API_BASE + '/status');
                              const data = await res.json();
                              statusEl.className = 'status ok';
                              statusEl.textContent = 'OK';
                              dataEl.textContent = JSON.stringify(data, null, 2);
                          } catch (e) {
                              statusEl.className = 'status error';
                              statusEl.textContent = 'Erreur';
                              dataEl.textContent = 'Erreur : ' + e.message;
                          }
                      }

                      // Vérifie au chargement de la page
                      checkHealth();
                      checkStack();
                  </script>
              </body>
              </html>
              HTMLEOF
          volumeMounts:
            - name: frontend-code
              mountPath: /app
      containers:
        - name: nginx
          image: nginx:1.26-alpine
          ports:
            - containerPort: 80
          volumeMounts:
            - name: frontend-code
              mountPath: /usr/share/nginx/html
            - name: nginx-config
              mountPath: /etc/nginx/conf.d/default.conf
              subPath: frontend-nginx.conf
          resources:
            requests:
              cpu: "50m"
              memory: "64Mi"
            limits:
              cpu: "150m"
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
        - name: frontend-code
          emptyDir: {}
        - name: nginx-config
          configMap:
            name: app-config
---
# Service front-end
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
  namespace: fullstack
spec:
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

```bash
# Déploie le front-end
kubectl apply -f 05-frontend.yaml

# Attends que les pods soient prêts
kubectl wait --for=condition=ready pod -l app=frontend --timeout=60s

# Vérifie
kubectl get pods -l app=frontend
```

---

### Étape 7 : Créer l'Ingress

Crée un fichier `06-ingress.yaml` :

```yaml
# 06-ingress.yaml
# Ingress : route le trafic vers le front-end et le back-end
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: fullstack-ingress
  namespace: fullstack
  annotations:
    # Réécrit le chemin pour le back-end
    # /api/health → /api/health (pas de réécriture nécessaire)
    nginx.ingress.kubernetes.io/use-regex: "true"
spec:
  ingressClassName: nginx
  rules:
    - http:
        paths:
          # Route /api vers le back-end Symfony
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-svc
                port:
                  number: 80
          # Route / vers le front-end React (route par défaut)
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
```

```bash
# Crée l'Ingress
kubectl apply -f 06-ingress.yaml

# Vérifie
kubectl get ingress
```

**Résultat attendu** :

```text
NAME                CLASS   HOSTS   ADDRESS        PORTS   AGE
fullstack-ingress   nginx   *       192.168.49.2   80      30s
```

```bash
# Récupère l'IP de Minikube
minikube ip
```

---

### Étape 8 : Tester l'application complète

```bash
# Récupère l'IP de Minikube
MINIKUBE_IP=$(minikube ip)

# Teste le front-end (route /)
curl http://$MINIKUBE_IP/
```

**Résultat attendu** : Le HTML de la page React s'affiche.

```bash
# Teste l'API (route /api/health)
curl http://$MINIKUBE_IP/api/health
```

**Résultat attendu** :

```json
{
    "status": "healthy",
    "service": "backend-api",
    "hostname": "backend-xxxxxxxxxx-xxxxx",
    "php_version": "8.3.x",
    "timestamp": "2025-xx-xxTxx:xx:xx+00:00"
}
```

```bash
# Teste le status de la stack
curl http://$MINIKUBE_IP/api/status
```

**Résultat attendu** :

```json
{
    "status": "ok",
    "environment": "prod",
    "checks": {
        "api": true,
        "database_configured": true,
        "redis_configured": true
    }
}
```

---

### Étape 9 : Vérifier l'état global

```bash
# Liste toutes les ressources du namespace
kubectl get all

# Vérifie le HPA
kubectl get hpa

# Vérifie les PVCs
kubectl get pvc

# Vérifie l'Ingress
kubectl get ingress

# Vérifie les Secrets et ConfigMaps
kubectl get secrets
kubectl get configmaps
```

**Résultat attendu** (kubectl get all, simplifié) :

```text
NAME                            READY   STATUS    RESTARTS   AGE
pod/backend-xxxxx               2/2     Running   0          5m
pod/backend-xxxxx               2/2     Running   0          5m
pod/frontend-xxxxx              1/1     Running   0          3m
pod/frontend-xxxxx              1/1     Running   0          3m
pod/postgres-xxxxx              1/1     Running   0          8m
pod/redis-xxxxx                 1/1     Running   0          7m

NAME                   TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)    AGE
service/backend-svc    ClusterIP   10.x.x.x        <none>        80/TCP     5m
service/frontend-svc   ClusterIP   10.x.x.x        <none>        80/TCP     3m
service/postgres-svc   ClusterIP   10.x.x.x        <none>        5432/TCP   8m
service/redis-svc      ClusterIP   10.x.x.x        <none>        6379/TCP   7m

NAME                       READY   UP-TO-DATE   AVAILABLE   AGE
deployment/backend         2/2     2            2           5m
deployment/frontend        2/2     2            2           3m
deployment/postgres        1/1     1            1           8m
deployment/redis           1/1     1            1           7m
```

---

### Étape 10 : Tester la résilience

```bash
# Supprime un pod back-end (Kubernetes en crée un nouveau automatiquement)
kubectl delete pod -l app=backend --field-selector=status.phase=Running --wait=false

# Observe la re-création automatique
kubectl get pods -l app=backend -w
```

Le Deployment recrée automatiquement le pod supprimé pour maintenir le nombre de répliques à 2.

```bash
# Teste que l'API continue de répondre pendant la re-création
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/api/health
```

L'API répond car l'autre réplique prend le relais.

---

### Étape 11 : Vérifier l'autoscaling

```bash
# Vérifie le HPA
kubectl get hpa backend-hpa
```

**Résultat attendu** :

```text
NAME          REFERENCE            TARGETS   MINPODS   MAXPODS   REPLICAS   AGE
backend-hpa   Deployment/backend   x%/70%    2         6         2          10m
```

Le HPA surveille l'utilisation CPU du back-end. Si elle dépasse 70%, il ajoute des pods (jusqu'à 6 maximum).

---

### Étape 12 : Nettoyer

```bash
# Supprime toutes les ressources dans l'ordre inverse
kubectl delete -f 06-ingress.yaml
kubectl delete -f 05-frontend.yaml
kubectl delete -f 04-backend.yaml
kubectl delete -f 03-redis.yaml
kubectl delete -f 02-postgres.yaml
kubectl delete -f 01-config.yaml

# Reviens au namespace default et supprime le namespace
kubectl config set-context --current --namespace=default
kubectl delete namespace fullstack

# Vérifie
kubectl get namespaces
kubectl get all
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl get all -n fullstack` | Liste toutes les ressources du projet |
| `kubectl get ingress -n fullstack` | Vérifie la configuration de l'Ingress |
| `kubectl logs deploy/backend -c php-fpm` | Logs du back-end PHP |
| `kubectl logs deploy/backend -c nginx` | Logs du reverse proxy Nginx du back-end |
| `kubectl logs deploy/frontend` | Logs du front-end |
| `kubectl describe ingress fullstack-ingress` | Détails du routage Ingress |
| `kubectl get hpa backend-hpa` | Status de l'autoscaling |
| `minikube addons list` | Liste les addons Minikube |
| `minikube ip` | Affiche l'IP de Minikube |

---

## Pièges Fréquents

### Piège 1 : L'Ingress ne fonctionne pas

⚠️ **Problème** : Les requêtes vers `http://<minikube-ip>/` retournent une erreur 404 ou ne passent pas.

✅ **Solution** : Vérifie que l'addon Ingress est activé et que le contrôleur tourne :

```bash
# Active l'addon
minikube addons enable ingress

# Vérifie que le contrôleur fonctionne
kubectl get pods -n ingress-nginx

# Vérifie l'adresse de l'Ingress
kubectl get ingress -n fullstack
```

Si l'adresse est vide, attends quelques secondes que le contrôleur assigne l'IP.

### Piège 2 : Les requêtes /api retournent le front-end

⚠️ **Problème** : L'Ingress route `/api` vers le front-end au lieu du back-end.

✅ **Solution** : L'ordre des règles dans l'Ingress est important. La règle `/api` (plus spécifique) doit être listée avant `/` (plus générale). Le contrôleur Nginx Ingress évalue les règles par ordre de spécificité du chemin, mais vérifie que la configuration est correcte :

```bash
kubectl describe ingress fullstack-ingress -n fullstack
```

### Piège 3 : CORS bloque les requêtes du front-end vers l'API

⚠️ **Problème** : Le navigateur affiche des erreurs CORS quand le front-end appelle l'API.

✅ **Solution** : Grâce à l'Ingress, le front-end et l'API sont sur le même domaine (même IP, même port). Il n'y a donc pas de problème CORS. Si tu vois des erreurs CORS, vérifie que l'Ingress fonctionne et que tu n'accèdes pas directement aux Services (NodePort).

### Piège 4 : Le pod PostgreSQL ne redémarre pas après un reboot de Minikube

⚠️ **Problème** : Après `minikube stop` puis `minikube start`, PostgreSQL ne démarre pas car le PVC n'est plus accessible.

✅ **Solution** : Vérifie que le PVC est toujours lié après le redémarrage :

```bash
kubectl get pvc -n fullstack
```

Si le PVC est en status `Lost`, tu dois le recréer. Les données de la base de données sont perdues dans ce cas. En production, tu utiliserais un opérateur PostgreSQL ou un stockage externe.

---

## Checklist de Validation

- [ ] Je sais déployer une architecture multi-services sur Kubernetes
- [ ] Je sais configurer un Ingress pour router le trafic entre le front-end et l'API
- [ ] Je sais séparer la configuration sensible (Secrets) et non sensible (ConfigMaps)
- [ ] Je sais déployer PostgreSQL avec du stockage persistant
- [ ] Je sais déployer Redis comme service de cache
- [ ] Je sais configurer des probes (startup, readiness, liveness) sur tous les services
- [ ] Je sais mettre en place un HPA pour l'autoscaling
- [ ] Je sais tester la résilience en supprimant des pods
- [ ] Je sais nettoyer proprement toutes les ressources

---

## Exercice Pratique

**Énoncé** : Améliore le projet intégrateur avec les fonctionnalités suivantes.

1. Ajoute un **NetworkPolicy** qui :
   - Autorise le back-end à communiquer avec PostgreSQL et Redis
   - Autorise le front-end à communiquer uniquement avec le back-end (via l'Ingress)
   - Bloque toute autre communication entre les pods
2. Ajoute des **ResourceQuotas** au namespace `fullstack` :
   - Maximum 15 pods
   - Maximum 4 CPU et 4 Gi de mémoire au total
3. Augmente les répliques du front-end à 3 et vérifie que le trafic est distribué
4. Simule une panne du back-end :
   - Scale le back-end à 0 répliques
   - Vérifie que le front-end affiche une erreur quand il appelle l'API
   - Remets le back-end à 2 répliques
   - Vérifie que tout refonctionne
5. Supprime tout proprement

**Indications** :

- Les NetworkPolicies nécessitent un plugin réseau qui les supporte. Sur Minikube, active le plugin Calico : `minikube start --cni=calico`
- Utilise `kubectl get networkpolicies` pour vérifier les politiques
- Teste la connectivité avec `kubectl exec -it <pod> -- nc -zv <service> <port>`

**Résultat attendu** : La stack est sécurisée avec des NetworkPolicies, limitée avec des quotas, et la résilience est vérifiée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée le fichier `exercise-improvements.yaml` :

```yaml
# exercise-improvements.yaml
# --- NetworkPolicy : back-end peut parler à PostgreSQL et Redis ---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: backend-policy
  namespace: fullstack
spec:
  podSelector:
    matchLabels:
      app: backend
  policyTypes:
    - Egress
  egress:
    # Autorise le trafic vers PostgreSQL
    - to:
        - podSelector:
            matchLabels:
              app: postgres
      ports:
        - port: 5432
    # Autorise le trafic vers Redis
    - to:
        - podSelector:
            matchLabels:
              app: redis
      ports:
        - port: 6379
    # Autorise le DNS (obligatoire pour la résolution de noms)
    - to: []
      ports:
        - port: 53
          protocol: UDP
        - port: 53
          protocol: TCP
---
# --- NetworkPolicy : front-end ne peut parler à personne (sauf via Ingress) ---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: frontend-policy
  namespace: fullstack
spec:
  podSelector:
    matchLabels:
      app: frontend
  policyTypes:
    - Egress
  # Aucune règle egress : le front-end ne peut pas initier de connexion
  # L'Ingress gère le routage vers le back-end au niveau du cluster
  egress:
    # Autorise le DNS
    - to: []
      ports:
        - port: 53
          protocol: UDP
---
# --- NetworkPolicy : PostgreSQL accepte uniquement le back-end ---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: postgres-policy
  namespace: fullstack
spec:
  podSelector:
    matchLabels:
      app: postgres
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend
      ports:
        - port: 5432
---
# --- NetworkPolicy : Redis accepte uniquement le back-end ---
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: redis-policy
  namespace: fullstack
spec:
  podSelector:
    matchLabels:
      app: redis
  policyTypes:
    - Ingress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: backend
      ports:
        - port: 6379
---
# --- ResourceQuota ---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: fullstack-quota
  namespace: fullstack
spec:
  hard:
    pods: "15"
    requests.cpu: "4"
    requests.memory: "4Gi"
    limits.cpu: "8"
    limits.memory: "8Gi"
```

```bash
# Applique les améliorations (les fichiers 01 à 06 doivent déjà être appliqués)
kubectl apply -f exercise-improvements.yaml

# Vérifie les NetworkPolicies
kubectl get networkpolicies -n fullstack

# Vérifie le quota
kubectl describe resourcequota fullstack-quota -n fullstack

# 3. Augmente les répliques du front-end
kubectl scale deployment frontend --replicas=3 -n fullstack
kubectl get pods -l app=frontend -n fullstack

# Teste la distribution du trafic (les hostnames changent)
MINIKUBE_IP=$(minikube ip)
curl http://$MINIKUBE_IP/api/health
curl http://$MINIKUBE_IP/api/health
curl http://$MINIKUBE_IP/api/health

# 4. Simule une panne du back-end
kubectl scale deployment backend --replicas=0 -n fullstack
kubectl get pods -l app=backend -n fullstack

# Vérifie que l'API ne répond plus
curl http://$MINIKUBE_IP/api/health
# Résultat : erreur 502 ou 503

# Remets le back-end
kubectl scale deployment backend --replicas=2 -n fullstack
kubectl wait --for=condition=ready pod -l app=backend --timeout=120s -n fullstack

# Vérifie que tout refonctionne
curl http://$MINIKUBE_IP/api/health

# 5. Supprime tout
kubectl delete -f exercise-improvements.yaml
kubectl delete -f 06-ingress.yaml
kubectl delete -f 05-frontend.yaml
kubectl delete -f 04-backend.yaml
kubectl delete -f 03-redis.yaml
kubectl delete -f 02-postgres.yaml
kubectl delete -f 01-config.yaml
kubectl config set-context --current --namespace=default
kubectl delete namespace fullstack
```

---

## Navigation

← Fiche précédente : **[11 - Déployer Symfony sur Kubernetes](11-deployer-symfony-kubernetes.md)**

Fin du cursus Kubernetes.
