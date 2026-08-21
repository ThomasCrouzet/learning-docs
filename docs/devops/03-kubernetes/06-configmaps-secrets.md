---
tags:
  - Kubernetes
  - Intermédiaire
  - Pratique
description: "ConfigMaps et Secrets : externaliser la configuration et gérer les données sensibles"
estimated_time: "75 min"
fiche_number: 6
total_fiches: 12
cursus: "Kubernetes"
id: "infrastructure.kubernetes.configmaps-secrets"
course_id: "infrastructure.kubernetes"
content_type: "lesson"
order: 6
---

# 06 - ConfigMaps et Secrets

> **En bref** : À la fin de cette fiche, tu sauras créer des ConfigMaps et des Secrets pour externaliser la configuration de tes applications, les monter en variables d'environnement ou en fichiers, et appliquer les bonnes pratiques de sécurité. Lecture estimée : 75 min.

## Prérequis

- Fiche **[05 - Services et networking](05-services-networking.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer un Deployment et un Service

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras externaliser la configuration de tes applications avec des ConfigMaps et protéger les données sensibles avec des Secrets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un ConfigMap ?

**Définition** : Un ConfigMap est un objet Kubernetes qui stocke des données de configuration sous forme de paires clé-valeur. Il permet de séparer la configuration de l'image Docker.

**Le problème que les ConfigMaps résolvent** :

Sans ConfigMap :

1. **Configuration codée en dur** : Les variables de configuration (URL de la base de données, mode debug, nom de l'application) sont intégrées dans l'image Docker. Pour changer une configuration, tu dois reconstruire l'image.
2. **Pas de séparation des environnements** : La même image Docker ne peut pas être utilisée en dev et en production avec des configurations différentes.
3. **Pas de fichiers de configuration externalisés** : Les fichiers de configuration (nginx.conf, php.ini) sont dans l'image. Les modifier nécessite de reconstruire l'image.

**Comment les ConfigMaps résolvent ces problèmes** :

| Problème | Solution apportée par ConfigMap |
| -------- | ------------------------------- |
| Configuration codée en dur | La configuration est stockée dans un ConfigMap, séparée de l'image |
| Pas de séparation des environnements | Tu crées un ConfigMap par environnement (dev, staging, production) |
| Pas de fichiers externalisés | Le ConfigMap peut contenir des fichiers entiers montés dans le conteneur |

**Analogie concrète** : Un ConfigMap est comme un panneau d'affichage dans un bureau. Le contenu du panneau (les informations) change selon les besoins, mais le bureau (le conteneur) reste le même. Tu peux afficher les horaires d'été ou d'hiver sans reconstruire le bureau.

**Ce qu'un ConfigMap n'est PAS** :

- Un ConfigMap n'est pas fait pour les données sensibles. Les données d'un ConfigMap ne sont pas chiffrées. Pour les mots de passe, clés API et certificats, utilise un Secret.
- Un ConfigMap n'est pas un système de stockage. Il est limité à 1 Mo. Pour du stockage, utilise des volumes.

---

### Qu'est-ce qu'un Secret ?

**Définition** : Un Secret est un objet Kubernetes similaire à un ConfigMap, mais conçu pour stocker des données sensibles (mots de passe, clés API, certificats TLS). Les données sont encodées en base64.

**Le problème que les Secrets résolvent** :

Sans Secret :

1. **Mots de passe dans les images** : Les identifiants de base de données sont codés en dur dans le code ou dans les variables d'environnement de l'image Docker. Toute personne ayant accès à l'image peut lire les mots de passe.
2. **Mots de passe dans les fichiers YAML versionnés** : Les fichiers de déploiement contiennent les mots de passe en clair, visibles dans Git.

**Comment les Secrets résolvent ces problèmes** :

| Problème | Solution apportée par Secret |
| -------- | ---------------------------- |
| Mots de passe dans les images | Les Secrets sont injectés au moment du déploiement, pas dans l'image |
| Mots de passe dans les fichiers YAML | Les Secrets sont créés séparément et référencés par nom |

**Analogie concrète** : Un Secret est comme un coffre-fort dans un bureau. Le contenu du coffre (mots de passe, clés) n'est pas affiché sur le panneau d'affichage (ConfigMap). Seules les personnes autorisées (les pods référençant le Secret) peuvent ouvrir le coffre.

**Ce qu'un Secret n'est PAS** :

- Un Secret n'est pas chiffré par défaut. Les données sont encodées en base64, ce qui n'est PAS du chiffrement. Base64 est réversible en une commande. Pour un vrai chiffrement, il faut activer le chiffrement au repos (encryption at rest) dans etcd ou utiliser un gestionnaire de secrets externe (HashiCorp Vault).

**Types de Secrets** :

| Type | Description | Cas d'utilisation |
| ---- | ----------- | ----------------- |
| `Opaque` | Type par défaut. Données arbitraires | Mots de passe, clés API |
| `kubernetes.io/tls` | Certificat et clé TLS | HTTPS |
| `kubernetes.io/dockerconfigjson` | Identifiants d'un registre Docker | Pull d'images privées |
| `kubernetes.io/basic-auth` | Identifiants utilisateur/mot de passe | Authentification HTTP basique |

---

Le diagramme suivant montre les deux mécanismes d'injection de configuration dans un Pod.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-06-configmaps-secrets-1.html">Qu&#x27;est-ce qu&#x27;un Secret ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-06-configmaps-secrets-1.html" title="Qu&#x27;est-ce qu&#x27;un Secret ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Deux façons d'utiliser ConfigMaps et Secrets

| Méthode | Description | Quand l'utiliser |
| ------- | ----------- | ---------------- |
| Variables d'environnement | Injecte les valeurs dans les variables d'env du conteneur | Valeurs simples (URL, port, mode debug) |
| Montage en fichier (volume) | Monte le ConfigMap/Secret comme un fichier dans le conteneur | Fichiers de configuration (nginx.conf, .env) |

---

## Étapes Pratiques

### Étape 1 : Créer un ConfigMap en ligne de commande

```bash
# Crée un ConfigMap avec des paires clé-valeur
kubectl create configmap app-config \
  --from-literal=APP_ENV=development \
  --from-literal=APP_DEBUG=true \
  --from-literal=DATABASE_HOST=postgres-service \
  --from-literal=DATABASE_PORT=5432
```

**Résultat attendu** :

```text
configmap/app-config created
```

```bash
# Vérifie le ConfigMap
kubectl get configmaps

# Affiche le contenu du ConfigMap
kubectl describe configmap app-config
```

**Résultat attendu** :

```text
Name:         app-config
Namespace:    default
Labels:       <none>
Data
====
APP_DEBUG:
----
true
APP_ENV:
----
development
DATABASE_HOST:
----
postgres-service
DATABASE_PORT:
----
5432
```

---

### Étape 2 : Créer un ConfigMap via un fichier YAML

Crée un fichier `configmap.yaml` :

```yaml
# configmap.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: app-config-yaml
data:
  # Paires clé-valeur simples
  APP_ENV: "production"
  APP_DEBUG: "false"
  DATABASE_HOST: "postgres-service"
  DATABASE_PORT: "5432"

  # Fichier de configuration complet (multi-ligne)
  nginx.conf: |
    server {
        listen 80;
        server_name localhost;
        root /var/www/html/public;
        index index.php;

        location / {
            try_files $uri /index.php$is_args$args;
        }
    }
```

```bash
# Crée le ConfigMap
kubectl apply -f configmap.yaml

# Vérifie
kubectl describe configmap app-config-yaml
```

---

### Étape 3 : Utiliser un ConfigMap en variables d'environnement

Crée un fichier `pod-env-configmap.yaml` :

```yaml
# pod-env-configmap.yaml
# Pod qui utilise un ConfigMap comme variables d'environnement
apiVersion: v1
kind: Pod
metadata:
  name: pod-env-configmap
spec:
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "echo APP_ENV=$APP_ENV APP_DEBUG=$APP_DEBUG DB=$DATABASE_HOST:$DATABASE_PORT && sleep 3600"]
      # Injecte toutes les clés du ConfigMap comme variables d'environnement
      envFrom:
        - configMapRef:
            name: app-config
```

```bash
# Crée le pod
kubectl apply -f pod-env-configmap.yaml

# Vérifie les logs
kubectl logs pod-env-configmap
```

**Résultat attendu** :

```text
APP_ENV=development APP_DEBUG=true DB=postgres-service:5432
```

Tu peux aussi sélectionner des clés spécifiques :

```yaml
# Alternative : sélectionner des clés spécifiques
spec:
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "echo $MY_ENV && sleep 3600"]
      env:
        # Injecte une seule clé du ConfigMap sous un nom personnalisé
        - name: MY_ENV
          valueFrom:
            configMapKeyRef:
              name: app-config
              key: APP_ENV
```

---

### Étape 4 : Monter un ConfigMap en fichier

Crée un fichier `pod-volume-configmap.yaml` :

```yaml
# pod-volume-configmap.yaml
# Pod qui monte un ConfigMap comme fichier
apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-configmap
spec:
  # Déclare un volume basé sur le ConfigMap
  volumes:
    - name: config-volume
      configMap:
        name: app-config-yaml
  containers:
    - name: nginx
      image: nginx:1.26
      ports:
        - containerPort: 80
      # Monte le volume dans le conteneur
      volumeMounts:
        - name: config-volume
          # Chemin où le ConfigMap sera monté
          mountPath: /etc/config
          # readOnly : le conteneur ne peut pas modifier les fichiers
          readOnly: true
```

```bash
# Crée le pod
kubectl apply -f pod-volume-configmap.yaml

# Vérifie les fichiers montés
kubectl exec pod-volume-configmap -- ls /etc/config
```

**Résultat attendu** :

```text
APP_DEBUG
APP_ENV
DATABASE_HOST
DATABASE_PORT
nginx.conf
```

Chaque clé du ConfigMap devient un fichier. Le contenu du fichier est la valeur de la clé.

```bash
# Vérifie le contenu du fichier nginx.conf
kubectl exec pod-volume-configmap -- cat /etc/config/nginx.conf
```

**Résultat attendu** :

```text
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args;
    }
}
```

---

### Étape 5 : Créer un Secret en ligne de commande

```bash
# Crée un Secret de type Opaque
kubectl create secret generic db-credentials \
  --from-literal=DB_USER=admin \
  --from-literal=DB_PASSWORD=S3cur3P@ssw0rd \
  --from-literal=DB_NAME=myapp
```

**Résultat attendu** :

```text
secret/db-credentials created
```

```bash
# Vérifie le Secret
kubectl get secrets

# Affiche les détails (les valeurs sont masquées)
kubectl describe secret db-credentials
```

**Résultat attendu** :

```text
Name:         db-credentials
Namespace:    default
Type:         Opaque

Data
====
DB_NAME:      5 bytes
DB_PASSWORD:  14 bytes
DB_USER:      5 bytes
```

Les valeurs ne sont pas affichées, seulement leur taille en octets.

```bash
# Pour voir les valeurs encodées en base64
kubectl get secret db-credentials -o yaml
```

**Résultat attendu** (extrait) :

```yaml
data:
  DB_NAME: bXlhcHA=
  DB_PASSWORD: UzNjdXIzUEBzc3cwcmQ=
  DB_USER: YWRtaW4=
```

```bash
# Pour décoder une valeur base64
echo "YWRtaW4=" | base64 --decode
```

**Résultat attendu** :

```text
admin
```

---

### Étape 6 : Créer un Secret via un fichier YAML

Crée un fichier `secret.yaml` :

```yaml
# secret.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials-yaml
type: Opaque
# Les valeurs doivent être encodées en base64
data:
  DB_USER: YWRtaW4=
  DB_PASSWORD: UzNjdXIzUEBzc3cwcmQ=
  DB_NAME: bXlhcHA=
```

Pour encoder en base64 :

```bash
# Encode une valeur en base64
echo -n "admin" | base64
# Résultat : YWRtaW4=

echo -n "S3cur3P@ssw0rd" | base64
# Résultat : UzNjdXIzUEBzc3cwcmQ=
```

Tu peux aussi utiliser `stringData` pour écrire les valeurs en clair (Kubernetes les encode automatiquement) :

```yaml
# secret-stringdata.yaml
apiVersion: v1
kind: Secret
metadata:
  name: db-credentials-clear
type: Opaque
# stringData accepte les valeurs en clair (encodées automatiquement)
stringData:
  DB_USER: "admin"
  DB_PASSWORD: "S3cur3P@ssw0rd"
  DB_NAME: "myapp"
```

---

### Étape 7 : Utiliser un Secret en variables d'environnement

Crée un fichier `pod-env-secret.yaml` :

```yaml
# pod-env-secret.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-env-secret
spec:
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "echo DB_USER=$DB_USER DB_NAME=$DB_NAME && sleep 3600"]
      # Injecte toutes les clés du Secret comme variables d'environnement
      envFrom:
        - secretRef:
            name: db-credentials
```

```bash
# Crée le pod
kubectl apply -f pod-env-secret.yaml

# Vérifie
kubectl logs pod-env-secret
```

**Résultat attendu** :

```text
DB_USER=admin DB_NAME=myapp
```

---

### Étape 8 : Monter un Secret en fichier

Crée un fichier `pod-volume-secret.yaml` :

```yaml
# pod-volume-secret.yaml
apiVersion: v1
kind: Pod
metadata:
  name: pod-volume-secret
spec:
  volumes:
    - name: secret-volume
      secret:
        secretName: db-credentials
        # Permissions des fichiers (lecture seule pour le propriétaire)
        defaultMode: 0400
  containers:
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "cat /etc/secrets/DB_USER && echo && sleep 3600"]
      volumeMounts:
        - name: secret-volume
          mountPath: /etc/secrets
          readOnly: true
```

```bash
# Crée le pod
kubectl apply -f pod-volume-secret.yaml

# Vérifie les fichiers montés
kubectl exec pod-volume-secret -- ls -la /etc/secrets
```

**Résultat attendu** :

```text
lrwxrwxrwx    1 root     root    14 ... DB_NAME -> ..data/DB_NAME
lrwxrwxrwx    1 root     root    18 ... DB_PASSWORD -> ..data/DB_PASSWORD
lrwxrwxrwx    1 root     root    14 ... DB_USER -> ..data/DB_USER
```

---

### Étape 9 : Combiner ConfigMap et Secret dans un Deployment

Crée un fichier `combined-deployment.yaml` :

```yaml
# combined-deployment.yaml
# Deployment qui utilise à la fois un ConfigMap et un Secret
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp-combined
spec:
  replicas: 2
  selector:
    matchLabels:
      app: webapp-combined
  template:
    metadata:
      labels:
        app: webapp-combined
    spec:
      containers:
        - name: app
          image: busybox:1.36
          command:
            - sh
            - -c
            - |
              echo "=== Configuration ==="
              echo "Environment: $APP_ENV"
              echo "Debug: $APP_DEBUG"
              echo "Database: $DB_USER@$DATABASE_HOST:$DATABASE_PORT/$DB_NAME"
              echo "=== Config files ==="
              cat /etc/config/nginx.conf
              sleep 3600
          # Variables d'environnement depuis le ConfigMap
          envFrom:
            - configMapRef:
                name: app-config
          # Variables d'environnement depuis le Secret
          env:
            - name: DB_USER
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: DB_USER
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: DB_PASSWORD
            - name: DB_NAME
              valueFrom:
                secretKeyRef:
                  name: db-credentials
                  key: DB_NAME
          # Volume pour les fichiers de configuration
          volumeMounts:
            - name: config-files
              mountPath: /etc/config
              readOnly: true
      volumes:
        - name: config-files
          configMap:
            name: app-config-yaml
            # Monte uniquement la clé nginx.conf
            items:
              - key: nginx.conf
                path: nginx.conf
```

```bash
# Crée le Deployment
kubectl apply -f combined-deployment.yaml

# Vérifie les logs d'un pod
kubectl logs -l app=webapp-combined --tail=20
```

**Résultat attendu** :

```text
=== Configuration ===
Environment: development
Debug: true
Database: admin@postgres-service:5432/myapp
=== Config files ===
server {
    listen 80;
    server_name localhost;
    root /var/www/html/public;
    index index.php;

    location / {
        try_files $uri /index.php$is_args$args;
    }
}
```

---

### Étape 10 : Nettoyer

```bash
# Supprime toutes les ressources
kubectl delete deployment webapp-combined
kubectl delete pod pod-env-configmap pod-volume-configmap pod-env-secret pod-volume-secret
kubectl delete configmap app-config app-config-yaml
kubectl delete secret db-credentials db-credentials-yaml

# Vérifie
kubectl get all
kubectl get configmaps
kubectl get secrets
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl create configmap <nom> --from-literal=KEY=value` | Crée un ConfigMap en ligne de commande |
| `kubectl create configmap <nom> --from-file=fichier.conf` | Crée un ConfigMap à partir d'un fichier |
| `kubectl get configmaps` | Liste les ConfigMaps |
| `kubectl describe configmap <nom>` | Affiche le contenu d'un ConfigMap |
| `kubectl create secret generic <nom> --from-literal=KEY=value` | Crée un Secret en ligne de commande |
| `kubectl get secrets` | Liste les Secrets |
| `kubectl describe secret <nom>` | Affiche les métadonnées d'un Secret |
| `kubectl get secret <nom> -o yaml` | Affiche le Secret avec les valeurs en base64 |
| `echo -n "texte" \| base64` | Encode en base64 |
| `echo "dGV4dGU=" \| base64 --decode` | Décode du base64 |

---

## Pièges Fréquents

### Piège 1 : Oublier le -n lors de l'encodage base64

⚠️ **Problème** : L'encodage base64 inclut un saut de ligne, ce qui corrompt la valeur.

✅ **Solution** : Utilise toujours `echo -n` (sans saut de ligne) :

```bash
# ❌ Incorrect : inclut un saut de ligne
echo "admin" | base64
# Résultat : YWRtaW4K (le K final est le saut de ligne)

# ✅ Correct : pas de saut de ligne
echo -n "admin" | base64
# Résultat : YWRtaW4=
```

### Piège 2 : Croire que base64 = chiffrement

⚠️ **Problème** : Stocker des secrets en base64 en pensant qu'ils sont protégés.

✅ **Solution** : Base64 est un encodage, pas un chiffrement. N'importe qui peut décoder du base64. Pour une vraie sécurité :

- Active le chiffrement au repos dans etcd
- Utilise un gestionnaire de secrets externe (Vault)
- Limite l'accès aux Secrets avec RBAC (fiche 08)

### Piège 3 : Le ConfigMap n'est pas trouvé

⚠️ **Problème** : Le pod échoue avec `configmap "xxx" not found`.

✅ **Solution** : Le ConfigMap doit être créé avant le pod qui le référence. Vérifie aussi que le ConfigMap est dans le même namespace que le pod.

### Piège 4 : Monter un volume écrase le dossier existant

⚠️ **Problème** : Monter un ConfigMap sur `/etc/nginx/` supprime tout le contenu original du dossier.

✅ **Solution** : Utilise `subPath` pour monter un seul fichier sans écraser le dossier :

```yaml
volumeMounts:
  - name: config-volume
    mountPath: /etc/nginx/nginx.conf
    subPath: nginx.conf
```

---

## Checklist de Validation

- [ ] Je sais créer un ConfigMap en ligne de commande et en YAML
- [ ] Je sais injecter un ConfigMap en variables d'environnement
- [ ] Je sais monter un ConfigMap comme fichier
- [ ] Je sais créer un Secret en ligne de commande et en YAML
- [ ] Je comprends la différence entre `data` (base64) et `stringData` (clair)
- [ ] Je sais combiner ConfigMap et Secret dans un Deployment
- [ ] Je comprends que base64 n'est pas du chiffrement

---

## Exercice Pratique

**Énoncé** : Configure une application avec ConfigMap et Secret.

1. Crée un ConfigMap `redis-config` avec :
   - `REDIS_HOST=redis-service`
   - `REDIS_PORT=6379`
   - `CACHE_TTL=3600`
2. Crée un Secret `redis-auth` avec :
   - `REDIS_PASSWORD=R3d1sP@ss!`
3. Crée un Deployment `cache-app` (2 répliques, image `busybox:1.36`) qui :
   - Charge toutes les clés du ConfigMap en variables d'environnement
   - Charge le mot de passe depuis le Secret
   - Affiche toutes les variables puis attend
4. Vérifie les logs pour confirmer que les valeurs sont correctes
5. Supprime tout

**Indications** :

- Utilise `envFrom` pour le ConfigMap
- Utilise `env` avec `secretKeyRef` pour le Secret
- La commande du conteneur peut être : `echo "Redis: $REDIS_HOST:$REDIS_PORT, Auth: $REDIS_PASSWORD, TTL: $CACHE_TTL" && sleep 3600`

**Résultat attendu** : Les logs affichent `Redis: redis-service:6379, Auth: R3d1sP@ss!, TTL: 3600`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Crée le ConfigMap
kubectl create configmap redis-config \
  --from-literal=REDIS_HOST=redis-service \
  --from-literal=REDIS_PORT=6379 \
  --from-literal=CACHE_TTL=3600

# 2. Crée le Secret
kubectl create secret generic redis-auth \
  --from-literal=REDIS_PASSWORD='R3d1sP@ss!'
```

Crée le fichier `cache-app.yaml` :

```yaml
# cache-app.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cache-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cache-app
  template:
    metadata:
      labels:
        app: cache-app
    spec:
      containers:
        - name: app
          image: busybox:1.36
          command:
            - sh
            - -c
            - |
              echo "Redis: $REDIS_HOST:$REDIS_PORT, Auth: $REDIS_PASSWORD, TTL: $CACHE_TTL"
              sleep 3600
          envFrom:
            - configMapRef:
                name: redis-config
          env:
            - name: REDIS_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: redis-auth
                  key: REDIS_PASSWORD
```

```bash
# 3. Crée le Deployment
kubectl apply -f cache-app.yaml

# 4. Vérifie les logs
kubectl logs -l app=cache-app
# Résultat : Redis: redis-service:6379, Auth: R3d1sP@ss!, TTL: 3600

# 5. Supprime tout
kubectl delete deployment cache-app
kubectl delete configmap redis-config
kubectl delete secret redis-auth
```

---

## Navigation

← Fiche précédente : **[05 - Services et networking](05-services-networking.md)**

→ Fiche suivante : **[07 - Volumes et persistance](07-volumes-persistance.md)**
