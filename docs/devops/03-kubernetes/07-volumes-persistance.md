---
tags:
  - Kubernetes
  - Intermédiaire
  - Pratique
description: "Volumes et persistance : stocker des données de manière durable avec PV, PVC et StorageClasses"
estimated_time: "90 min"
fiche_number: 7
total_fiches: 12
cursus: "Kubernetes"
---

# 07 - Volumes et persistance

> **En bref** : À la fin de cette fiche, tu sauras utiliser les volumes éphémères (emptyDir), créer des PersistentVolumes et PersistentVolumeClaims, comprendre les StorageClasses, et déployer PostgreSQL avec du stockage persistant. Lecture estimée : 90 min.

## Prérequis

- Fiche **[06 - ConfigMaps et Secrets](06-configmaps-secrets.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Connaître les ConfigMaps et Secrets

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |
| PostgreSQL  | 16      |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras gérer le stockage persistant dans Kubernetes pour que tes données survivent aux redémarrages de pods.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Le problème du stockage éphémère

**Définition** : Par défaut, le système de fichiers d'un conteneur est éphémère. Quand un pod est supprimé ou redémarré, toutes les données écrites dans le conteneur sont perdues.

**Le problème que le stockage persistant résout** :

Sans stockage persistant :

1. **Perte de données au redémarrage** : Si un pod PostgreSQL redémarre, toutes les données de la base sont perdues.
2. **Pas de partage entre conteneurs** : Deux conteneurs dans le même pod ne peuvent pas partager de fichiers sans volume.
3. **Pas de partage entre pods** : Deux pods sur des nodes différents ne peuvent pas accéder aux mêmes fichiers.

**Comment le stockage persistant résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Perte de données au redémarrage | Les PersistentVolumes conservent les données indépendamment du cycle de vie des pods |
| Pas de partage entre conteneurs | Les volumes emptyDir permettent le partage au sein d'un pod |
| Pas de partage entre pods | Certains types de volumes (NFS, CephFS) permettent l'accès concurrent |

**Analogie concrète** : Les pods sont comme des conteneurs de chantier temporaires. Quand le chantier est terminé, les conteneurs sont retirés et tout ce qu'ils contenaient disparaît. Un PersistentVolume est comme un entrepôt permanent à côté du chantier. Tu y ranges tes outils et tes matériaux. Même si le conteneur de chantier est remplacé, l'entrepôt reste avec tout son contenu.

---

### Types de volumes dans Kubernetes

| Type | Durée de vie | Partage | Cas d'utilisation |
| ---- | ------------ | ------- | ----------------- |
| `emptyDir` | Durée de vie du pod | Entre conteneurs du même pod | Cache temporaire, fichiers partagés entre sidecars |
| `hostPath` | Durée de vie du node | Non | Accès au système de fichiers du node (déconseillé en production) |
| `PersistentVolume` | Indépendant des pods | Selon le type de stockage | Bases de données, uploads utilisateurs, logs |
| `configMap` / `secret` | Durée de vie de la ressource | Non | Fichiers de configuration |

---

### Qu'est-ce qu'un PersistentVolume (PV) ?

**Définition** : Un PersistentVolume est une ressource de stockage dans le cluster, provisionnée par un administrateur ou dynamiquement par une StorageClass. Il existe indépendamment des pods.

**Analogie concrète** : Un PV est comme un disque dur externe dans une armoire. L'administrateur système le branche et le rend disponible. Les utilisateurs (pods) peuvent demander à l'utiliser.

---

### Qu'est-ce qu'un PersistentVolumeClaim (PVC) ?

**Définition** : Un PersistentVolumeClaim est une demande de stockage faite par un pod. Le PVC spécifie la taille et le mode d'accès nécessaires. Kubernetes associe automatiquement le PVC à un PV compatible.

**Le problème que PV et PVC résolvent** :

Sans PV/PVC :

1. **Couplage fort** : Le pod doit connaître les détails du stockage (type de disque, chemin, serveur NFS). Si le stockage change, le pod doit être modifié.
2. **Pas de réutilisation** : Si un pod est supprimé, le stockage associé est difficile à réattribuer.

**Comment PV et PVC résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Couplage fort | Le PVC est une abstraction. Le pod demande "je veux 10 Go", sans se soucier du type de stockage |
| Pas de réutilisation | Le PV survit à la suppression du pod. Un nouveau pod peut réclamer le même PVC |

**Analogie concrète** : Le PV est un espace de rangement dans un garde-meuble. Le PVC est le contrat de location : "Je veux un espace de 10 m2 avec un accès 24h/24". Le gérant (Kubernetes) te donne un espace qui correspond à ta demande. Tu n'as pas besoin de savoir dans quel bâtiment il se trouve.

**Modes d'accès** :

| Mode | Abréviation | Description |
| ---- | ----------- | ----------- |
| ReadWriteOnce | RWO | Lecture-écriture par un seul node à la fois (plusieurs pods du même node peuvent monter le volume) |
| ReadOnlyMany | ROX | Lecture seule par plusieurs nodes |
| ReadWriteMany | RWX | Lecture-écriture par plusieurs nodes |
| ReadWriteOncePod | RWOP | Lecture-écriture par un seul pod dans tout le cluster (stable depuis Kubernetes 1.29, volumes CSI). Distinct de RWO, qui est limité au node, pas au pod |

---

### Qu'est-ce qu'une StorageClass ?

**Définition** : Une StorageClass définit un profil de stockage. Elle permet le provisionnement dynamique : quand un PVC est créé, la StorageClass crée automatiquement un PV correspondant.

**Le problème que les StorageClasses résolvent** :

Sans StorageClass :

1. **Provisionnement manuel** : L'administrateur doit créer chaque PV manuellement avant qu'un pod puisse l'utiliser.
2. **Pas de profils** : Tous les volumes ont les mêmes caractéristiques. Impossible de différencier stockage rapide (SSD) et stockage lent (HDD).

**Comment les StorageClasses résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Provisionnement manuel | La StorageClass crée les PV automatiquement quand un PVC est créé |
| Pas de profils | Tu peux créer plusieurs StorageClasses (ssd, hdd, nfs) |

Le schéma suivant illustre la hiérarchie du stockage persistant dans Kubernetes :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-07-volumes-persistance-1.html">Qu&#x27;est-ce qu&#x27;une StorageClass ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-07-volumes-persistance-1.html" title="Qu&#x27;est-ce qu&#x27;une StorageClass ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le Pod monte un PVC (sa demande de stockage). Le PVC est lié à un PV (le stockage réel). La StorageClass peut créer automatiquement le PV quand un PVC est créé (provisionnement dynamique).

```bash
# Minikube fournit une StorageClass par défaut
kubectl get storageclasses
```

**Résultat attendu** :

```text
NAME                 PROVISIONER                RECLAIMPOLICY   VOLUMEBINDINGMODE   ALLOWVOLUMEEXPANSION   AGE
standard (default)   k8s.io/minikube-hostpath   Delete          Immediate           false                  1h
```

---

### Introduction aux StatefulSets

**Définition** : Un StatefulSet est comme un Deployment, mais pour les applications qui nécessitent un stockage persistant et une identité stable (nom de pod fixe, ordre de démarrage). C'est l'objet recommandé pour les bases de données.

**Comparaison Deployment vs StatefulSet** :

| Critère | Deployment | StatefulSet |
| ------- | ---------- | ----------- |
| Nom des pods | Aléatoire (xxx-yyyyy) | Ordonné (nom-0, nom-1, nom-2) |
| Ordre de démarrage | Parallèle | Séquentiel (0 d'abord, puis 1, etc.) |
| Stockage | Partagé ou aucun | Un PVC par pod |
| Cas d'utilisation | Applications stateless | Bases de données, caches |

---

## Étapes Pratiques

### Étape 1 : Créer un volume emptyDir

Crée un fichier `emptydir-pod.yaml` :

```yaml
# emptydir-pod.yaml
# Pod avec un volume emptyDir partagé entre deux conteneurs
apiVersion: v1
kind: Pod
metadata:
  name: emptydir-pod
spec:
  volumes:
    # Volume temporaire : créé avec le pod, supprimé avec le pod
    - name: shared-cache
      emptyDir: {}
  containers:
    # Conteneur 1 : écrit dans le volume
    - name: writer
      image: busybox:1.36
      command:
        - sh
        - -c
        - |
          while true; do
            echo "$(date) - Donnee ecrite par writer" >> /cache/data.log
            sleep 5
          done
      volumeMounts:
        - name: shared-cache
          mountPath: /cache

    # Conteneur 2 : lit depuis le volume
    - name: reader
      image: busybox:1.36
      command:
        - sh
        - -c
        - |
          while true; do
            echo "=== Contenu du cache ==="
            cat /cache/data.log 2>/dev/null || echo "Pas encore de donnees"
            sleep 10
          done
      volumeMounts:
        - name: shared-cache
          mountPath: /cache
```

```bash
# Crée le pod
kubectl apply -f emptydir-pod.yaml

# Vérifie que les deux conteneurs tournent
kubectl get pods emptydir-pod

# Lis les logs du reader
kubectl logs emptydir-pod -c reader
```

**Résultat attendu** :

```text
=== Contenu du cache ===
Mon Jan 10 10:00:00 UTC 2025 - Donnee ecrite par writer
Mon Jan 10 10:00:05 UTC 2025 - Donnee ecrite par writer
```

---

### Étape 2 : Créer un PersistentVolume manuellement

Crée un fichier `pv.yaml` :

```yaml
# pv.yaml
# PersistentVolume : espace de stockage disponible dans le cluster
apiVersion: v1
kind: PersistentVolume
metadata:
  name: manual-pv
  labels:
    type: local
spec:
  # Taille du volume
  capacity:
    storage: 1Gi
  # Mode d'accès : lecture-écriture par un seul node
  accessModes:
    - ReadWriteOnce
  # Politique de récupération : le volume est conservé après suppression du PVC
  persistentVolumeReclaimPolicy: Retain
  # Stockage local sur le node (spécifique à Minikube)
  hostPath:
    path: /data/manual-pv
```

```bash
# Crée le PV
kubectl apply -f pv.yaml

# Vérifie
kubectl get pv
```

**Résultat attendu** :

```text
NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS      CLAIM   STORAGECLASS   AGE
manual-pv   1Gi        RWO            Retain           Available                          10s
```

Le status `Available` signifie que le PV est libre et prêt à être réclamé.

---

### Étape 3 : Créer un PersistentVolumeClaim

Crée un fichier `pvc.yaml` :

```yaml
# pvc.yaml
# PersistentVolumeClaim : demande de stockage par un pod
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: manual-pvc
spec:
  # Mode d'accès demandé
  accessModes:
    - ReadWriteOnce
  # Taille demandée
  resources:
    requests:
      storage: 500Mi
  # Pas de StorageClass : Kubernetes cherche un PV existant compatible
  storageClassName: ""
```

```bash
# Crée le PVC
kubectl apply -f pvc.yaml

# Vérifie le PVC
kubectl get pvc
```

**Résultat attendu** :

```text
NAME         STATUS   VOLUME      CAPACITY   ACCESS MODES   STORAGECLASS   AGE
manual-pvc   Bound    manual-pv   1Gi        RWO                           10s
```

Le status `Bound` signifie que le PVC est associé au PV `manual-pv`.

```bash
# Vérifie que le PV est maintenant lié
kubectl get pv
```

**Résultat attendu** :

```text
NAME        CAPACITY   ACCESS MODES   RECLAIM POLICY   STATUS   CLAIM                STORAGECLASS   AGE
manual-pv   1Gi        RWO            Retain           Bound    default/manual-pvc                  2m
```

---

### Étape 4 : Utiliser un PVC dans un pod

Crée un fichier `pod-pvc.yaml` :

```yaml
# pod-pvc.yaml
# Pod qui utilise le PVC pour stocker des données persistantes
apiVersion: v1
kind: Pod
metadata:
  name: pod-pvc
spec:
  volumes:
    # Référence le PVC créé précédemment
    - name: persistent-storage
      persistentVolumeClaim:
        claimName: manual-pvc
  containers:
    - name: app
      image: busybox:1.36
      command:
        - sh
        - -c
        - |
          echo "Ecriture de donnees persistantes..."
          echo "Donnee creee le $(date)" >> /data/persistent.log
          echo "Contenu du fichier :"
          cat /data/persistent.log
          sleep 3600
      volumeMounts:
        - name: persistent-storage
          mountPath: /data
```

```bash
# Crée le pod
kubectl apply -f pod-pvc.yaml

# Vérifie les logs
kubectl logs pod-pvc
```

**Résultat attendu** :

```text
Ecriture de donnees persistantes...
Contenu du fichier :
Donnee creee le Mon Jan 10 10:05:00 UTC 2025
```

```bash
# Supprime le pod
kubectl delete pod pod-pvc

# Recrée le pod
kubectl apply -f pod-pvc.yaml

# Vérifie les logs : les anciennes données sont toujours là
kubectl logs pod-pvc
```

**Résultat attendu** :

```text
Ecriture de donnees persistantes...
Contenu du fichier :
Donnee creee le Mon Jan 10 10:05:00 UTC 2025
Donnee creee le Mon Jan 10 10:10:00 UTC 2025
```

Les données persistent entre les redémarrages du pod.

---

### Étape 5 : Provisionnement dynamique avec StorageClass

Crée un fichier `dynamic-pvc.yaml` :

```yaml
# dynamic-pvc.yaml
# PVC avec provisionnement dynamique (la StorageClass crée le PV automatiquement)
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: dynamic-pvc
spec:
  accessModes:
    - ReadWriteOnce
  resources:
    requests:
      storage: 2Gi
  # Utilise la StorageClass par défaut de Minikube
  storageClassName: standard
```

```bash
# Crée le PVC
kubectl apply -f dynamic-pvc.yaml

# Vérifie : un PV est créé automatiquement
kubectl get pvc
kubectl get pv
```

**Résultat attendu** :

```text
NAME          STATUS   VOLUME                                     CAPACITY   ACCESS MODES   STORAGECLASS   AGE
dynamic-pvc   Bound    pvc-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx   2Gi        RWO            standard       10s
```

Le PV a été créé automatiquement par la StorageClass `standard`.

---

### Étape 6 : Déployer PostgreSQL avec du stockage persistant

Crée un fichier `postgres-statefulset.yaml` :

```yaml
# postgres-statefulset.yaml
# StatefulSet PostgreSQL avec stockage persistant
apiVersion: v1
kind: Secret
metadata:
  name: postgres-secret
type: Opaque
stringData:
  POSTGRES_USER: "admin"
  POSTGRES_PASSWORD: "P0stgr3s!"
  POSTGRES_DB: "myapp"
---
apiVersion: v1
kind: Service
metadata:
  name: postgres-service
spec:
  # ClusterIP pour l'accès interne
  type: ClusterIP
  selector:
    app: postgres
  ports:
    - port: 5432
      targetPort: 5432
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
spec:
  # Le Service associé au StatefulSet
  serviceName: postgres-service
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
          # Variables d'environnement depuis le Secret
          envFrom:
            - secretRef:
                name: postgres-secret
          # Monte le volume pour les données PostgreSQL
          volumeMounts:
            - name: postgres-data
              mountPath: /var/lib/postgresql/data
  # Template de PVC : chaque pod du StatefulSet obtient son propre PVC
  volumeClaimTemplates:
    - metadata:
        name: postgres-data
      spec:
        accessModes:
          - ReadWriteOnce
        storageClassName: standard
        resources:
          requests:
            storage: 5Gi
```

```bash
# Crée le StatefulSet
kubectl apply -f postgres-statefulset.yaml

# Vérifie que le pod PostgreSQL tourne
kubectl get pods -l app=postgres

# Vérifie le PVC créé automatiquement
kubectl get pvc
```

**Résultat attendu** :

```text
NAME                          STATUS   VOLUME         CAPACITY   ACCESS MODES   STORAGECLASS   AGE
postgres-data-postgres-0      Bound    pvc-xxxxx...   5Gi        RWO            standard       30s
```

```bash
# Connecte-toi à PostgreSQL
kubectl exec -it postgres-0 -- psql -U admin -d myapp
```

Dans le shell PostgreSQL :

```sql
-- Crée une table de test
CREATE TABLE users (id SERIAL PRIMARY KEY, name VARCHAR(100));

-- Insère des données
INSERT INTO users (name) VALUES ('Alice'), ('Bob');

-- Vérifie
SELECT * FROM users;

-- Quitte
\q
```

```bash
# Supprime le pod (le StatefulSet va le recréer)
kubectl delete pod postgres-0

# Attends que le pod soit recréé
kubectl get pods -l app=postgres -w

# Reconnecte-toi et vérifie que les données sont toujours là
kubectl exec -it postgres-0 -- psql -U admin -d myapp -c "SELECT * FROM users;"
```

**Résultat attendu** :

```text
 id | name
----+-------
  1 | Alice
  2 | Bob
(2 rows)
```

Les données ont survécu à la suppression du pod.

---

### Étape 7 : Nettoyer

```bash
# Supprime les ressources
kubectl delete statefulset postgres
kubectl delete service postgres-service
kubectl delete secret postgres-secret
kubectl delete pod pod-pvc emptydir-pod
kubectl delete pvc manual-pvc dynamic-pvc postgres-data-postgres-0
kubectl delete pv manual-pv

# Vérifie
kubectl get all
kubectl get pvc
kubectl get pv
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl get pv` | Liste les PersistentVolumes |
| `kubectl get pvc` | Liste les PersistentVolumeClaims |
| `kubectl get storageclasses` | Liste les StorageClasses |
| `kubectl describe pv <nom>` | Affiche les détails d'un PV |
| `kubectl describe pvc <nom>` | Affiche les détails d'un PVC |
| `kubectl get statefulsets` | Liste les StatefulSets |
| `kubectl describe statefulset <nom>` | Affiche les détails d'un StatefulSet |
| `kubectl delete pvc <nom>` | Supprime un PVC (et le PV si reclaimPolicy=Delete) |

---

## Pièges Fréquents

### Piège 1 : Le PVC reste en status Pending

⚠️ **Problème** : Le PVC est créé mais son status reste `Pending`.

✅ **Solution** : Causes possibles :

- Aucun PV compatible n'existe (taille ou mode d'accès incompatible)
- La StorageClass spécifiée n'existe pas
- Le provisionnement dynamique n'est pas configuré

```bash
# Vérifie la raison avec describe
kubectl describe pvc <nom>
```

### Piège 2 : Données perdues après suppression du PVC

⚠️ **Problème** : Les données ont été supprimées après la suppression du PVC.

✅ **Solution** : Vérifie la `reclaimPolicy` du PV :

- `Delete` : le PV est supprimé avec le PVC (comportement par défaut avec provisionnement dynamique)
- `Retain` : le PV est conservé même après suppression du PVC

### Piège 3 : StatefulSet bloqué lors de la suppression

⚠️ **Problème** : `kubectl delete statefulset` ne se termine pas.

✅ **Solution** : Le StatefulSet attend que tous les pods soient arrêtés dans l'ordre inverse. Si un pod est bloqué, utilise :

```bash
# Supprime le StatefulSet sans attendre les pods
kubectl delete statefulset <nom> --cascade=orphan
# Puis supprime les pods manuellement
kubectl delete pods -l app=<label>
```

### Piège 4 : Le volume est plein

⚠️ **Problème** : Le pod plante car le volume n'a plus d'espace disponible.

✅ **Solution** : Vérifie l'utilisation du volume :

```bash
# Depuis un pod qui monte le volume
kubectl exec <pod> -- df -h /data
```

Si le volume est plein, tu peux augmenter sa taille si la StorageClass le permet (`allowVolumeExpansion: true`).

### Piège 5 : Utiliser hostPath en production

⚠️ **Problème** : Tu utilises `hostPath` pour stocker des données en production. Le pod se déploie sur un autre node et les données sont perdues (le chemin n'existe pas sur ce node). De plus, un pod avec accès `hostPath` peut lire et écrire des fichiers sensibles du système hôte.

✅ **Solution** : Utilise `hostPath` uniquement sur Minikube pour les exercices pédagogiques. En production :

- Utilise une **StorageClass avec provisionnement dynamique** (recommandé) pour obtenir un PV adapté au cloud ou à ton infrastructure.
- Les volumes `hostPath` créent un **couplage fort** entre le pod et un node spécifique. Si le pod est schedulé sur un autre node, il ne trouve pas les données.
- Les volumes `hostPath` permettent l'**escalade de privilèges** : un conteneur compromis peut accéder aux secrets de l'hôte (fichiers `/etc`, clés SSH, tokens kubelet).

```yaml
# NON : hostPath en production
spec:
  volumes:
    - name: data
      hostPath:
        path: /data/mon-app  # Dangereux en production

# OUI : StorageClass avec provisionnement dynamique
spec:
  volumes:
    - name: data
      persistentVolumeClaim:
        claimName: mon-pvc  # PVC avec StorageClass adaptee
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre stockage éphémère et persistant
- [ ] Je sais créer un volume emptyDir pour le partage entre conteneurs
- [ ] Je sais créer un PV manuellement et un PVC qui le réclame
- [ ] Je comprends le provisionnement dynamique avec StorageClass
- [ ] Je sais déployer PostgreSQL avec un StatefulSet et du stockage persistant
- [ ] Je sais vérifier que les données survivent à la suppression d'un pod
- [ ] Je comprends les modes d'accès (RWO, ROX, RWX)

---

## Exercice Pratique

**Énoncé** : Déploie une application avec stockage persistant.

1. Crée un PVC `app-data` de 1 Go avec la StorageClass `standard`
2. Crée un Deployment `file-server` (2 répliques, image `nginx:1.26`) qui :
   - Monte le PVC sur `/usr/share/nginx/html`
3. Crée un pod temporaire qui écrit un fichier `index.html` dans le volume :
   - Contenu : `<h1>Donnees persistantes</h1>`
4. Crée un Service NodePort pour accéder au file-server
5. Accède au Service et vérifie que la page s'affiche
6. Supprime le Deployment et le pod, puis recrée-les
7. Vérifie que le fichier `index.html` est toujours présent
8. Supprime tout

**Indications** :

- Le PVC est partagé par les 2 répliques du Deployment
- Utilise `kubectl exec` pour écrire dans le volume
- Le mode d'accès doit être `ReadWriteOnce` pour Minikube

**Résultat attendu** : Les données persistent même après la suppression et la recréation du Deployment.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée le fichier `exercise-volumes.yaml` :

```yaml
# exercise-volumes.yaml
# --- PVC ---
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: app-data
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: standard
  resources:
    requests:
      storage: 1Gi
---
# --- Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: file-server
spec:
  replicas: 2
  selector:
    matchLabels:
      app: file-server
  template:
    metadata:
      labels:
        app: file-server
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
          volumeMounts:
            - name: data
              mountPath: /usr/share/nginx/html
      volumes:
        - name: data
          persistentVolumeClaim:
            claimName: app-data
---
# --- Service NodePort ---
apiVersion: v1
kind: Service
metadata:
  name: file-server-svc
spec:
  type: NodePort
  selector:
    app: file-server
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30100
```

```bash
# Crée les ressources
kubectl apply -f exercise-volumes.yaml

# Attends que les pods soient prêts
kubectl get pods -l app=file-server -w

# Écris dans le volume via un pod
kubectl exec deploy/file-server -- sh -c 'echo "<h1>Donnees persistantes</h1>" > /usr/share/nginx/html/index.html'

# Accède au Service
minikube service file-server-svc --url
# Ouvre l'URL dans le navigateur : tu verras "Donnees persistantes"

# Supprime le Deployment
kubectl delete deployment file-server

# Recrée le Deployment (le PVC existe toujours)
kubectl apply -f exercise-volumes.yaml

# Vérifie que les données sont toujours là
kubectl exec deploy/file-server -- cat /usr/share/nginx/html/index.html
# Résultat : <h1>Donnees persistantes</h1>

# Supprime tout
kubectl delete -f exercise-volumes.yaml
```

---

## Navigation

← Fiche précédente : **[06 - ConfigMaps et Secrets](06-configmaps-secrets.md)**

→ Fiche suivante : **[08 - Namespaces et RBAC](08-namespaces-rbac.md)**
