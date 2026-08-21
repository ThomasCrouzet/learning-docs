---
tags:
  - Kubernetes
  - Intermédiaire
  - Pratique
description: "Deployments et ReplicaSets : gérer le cycle de vie des applications avec réplication et mises à jour"
estimated_time: "90 min"
fiche_number: 4
total_fiches: 12
cursus: "Kubernetes"
id: "infrastructure.kubernetes.deployments-replicasets"
course_id: "infrastructure.kubernetes"
content_type: "lesson"
order: 4
---

# 04 - Deployments et ReplicaSets

> **En bref** : À la fin de cette fiche, tu sauras créer un Deployment, gérer les répliques, effectuer des mises à jour progressives (rolling updates), et revenir à une version précédente (rollback). Lecture estimée : 90 min.

## Prérequis

- Fiche **[03 - Pods et containers](03-pods-containers.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer un pod à partir d'un fichier YAML

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et gérer des Deployments Kubernetes pour déployer des applications avec réplication, mises à jour sans interruption et rollback.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un ReplicaSet ?

**Définition** : Un ReplicaSet est un objet Kubernetes qui garantit qu'un nombre défini de pods identiques (replicas) tournent en permanence. Si un pod meurt, le ReplicaSet en crée un nouveau pour maintenir le nombre demandé.

**Le problème que les ReplicaSets résolvent** :

Sans ReplicaSet :

1. **Pas de réplication** : Si tu crées un pod manuellement et qu'il plante, il ne revient pas. Tu dois le recréer manuellement.
2. **Pas de haute disponibilité** : Un seul pod signifie un seul point de défaillance. Si ce pod meurt, l'application est indisponible.
3. **Pas de mise à l'échelle** : Tu dois créer et supprimer des pods manuellement pour ajuster la capacité.

**Comment les ReplicaSets résolvent ces problèmes** :

| Problème | Solution apportée par le ReplicaSet |
| -------- | ----------------------------------- |
| Pas de réplication | Le ReplicaSet maintient automatiquement le nombre de pods demandé |
| Pas de haute disponibilité | Si un pod meurt, un nouveau est créé immédiatement |
| Pas de mise à l'échelle | Tu changes le nombre de replicas et Kubernetes ajuste |

**Analogie concrète** : Un ReplicaSet est comme un chef d'équipe dans un centre d'appels. Le chef a une consigne : "Il faut toujours 5 opérateurs en ligne". Si un opérateur prend sa pause, le chef en appelle un autre immédiatement pour le remplacer. Si la consigne change à 8 opérateurs, le chef en recrute 3 de plus.

**Ce qu'un ReplicaSet n'est PAS** :

- Un ReplicaSet ne gère pas les mises à jour. Il ne sait pas remplacer les pods par une nouvelle version de l'application. C'est le rôle du Deployment.
- En pratique, tu ne crées jamais un ReplicaSet directement. Tu crées un Deployment qui crée et gère les ReplicaSets automatiquement.

---

### Qu'est-ce qu'un Deployment ?

**Définition** : Un Deployment est un objet Kubernetes de plus haut niveau qui gère les ReplicaSets. Il ajoute la gestion des mises à jour progressives (rolling updates) et des retours en arrière (rollbacks).

**Le problème que les Deployments résolvent** :

Sans Deployment :

1. **Pas de mises à jour sans interruption** : Pour mettre à jour une application, il faut supprimer tous les pods de l'ancienne version puis créer ceux de la nouvelle. Pendant ce temps, l'application est indisponible.
2. **Pas d'historique** : Impossible de savoir quelle version était déployée avant et de revenir en arrière en cas de problème.
3. **Pas de stratégie** : Tu dois gérer manuellement le remplacement des pods un par un.

**Comment les Deployments résolvent ces problèmes** :

| Problème | Solution apportée par le Deployment |
| -------- | ----------------------------------- |
| Pas de mises à jour sans interruption | Le Deployment remplace les pods un par un (rolling update) |
| Pas d'historique | Le Deployment conserve l'historique des ReplicaSets précédents |
| Pas de stratégie | Tu choisis une stratégie (RollingUpdate ou Recreate) |

**Analogie concrète** : Si le ReplicaSet est le chef d'équipe qui maintient 5 opérateurs en ligne, le Deployment est le directeur du centre d'appels. Le directeur peut décider de remplacer progressivement les anciens opérateurs par de nouveaux (formés sur un nouveau produit), tout en s'assurant qu'il y a toujours au moins 4 opérateurs en ligne pendant la transition. Et si les nouveaux opérateurs ne conviennent pas, le directeur peut rappeler les anciens immédiatement.

**Ce qu'un Deployment n'est PAS** :

- Un Deployment n'est pas un pod. C'est un objet qui gère des ReplicaSets, qui gèrent des pods. La hiérarchie est : Deployment → ReplicaSet → Pod.
- Un Deployment n'est pas nécessaire pour un Job ponctuel. Les Jobs et CronJobs sont des objets différents conçus pour les tâches ponctuelles.

**Hiérarchie Deployment → ReplicaSet → Pod** :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-04-deployments-replicasets-1.html">Qu&#x27;est-ce qu&#x27;un Deployment ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-04-deployments-replicasets-1.html" title="Qu&#x27;est-ce qu&#x27;un Deployment ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le Deployment gère les versions. Chaque ReplicaSet maintient le nombre voulu de pods pour une version donnée. Lors d'une mise à jour, un nouveau ReplicaSet est créé et l'ancien est progressivement réduit.

---

### Stratégies de mise à jour

**Définition** : La stratégie de mise à jour définit comment Kubernetes remplace les anciens pods par les nouveaux lors d'une mise à jour.

**Stratégie RollingUpdate (par défaut)** :

- Remplace les pods progressivement, un par un (ou par lots)
- L'application reste disponible pendant la mise à jour
- Tu peux configurer `maxUnavailable` (nombre max de pods indisponibles) et `maxSurge` (nombre max de pods en plus pendant la transition)

**Stratégie Recreate** :

- Supprime tous les anciens pods d'abord, puis crée les nouveaux
- L'application est indisponible pendant la transition
- Utile quand la nouvelle version est incompatible avec l'ancienne (ex. : changement de schéma de base de données)

| Critère | RollingUpdate | Recreate |
| ------- | ------------- | -------- |
| Disponibilité pendant la mise à jour | Oui | Non |
| Deux versions coexistent | Oui (brièvement) | Non |
| Vitesse | Plus lent (progressif) | Plus rapide (tout d'un coup) |
| Cas d'utilisation | Applications web, APIs | Bases de données, migrations |

---

## Étapes Pratiques

### Étape 1 : Créer un Deployment

Crée un fichier `nginx-deployment.yaml` :

```yaml
# nginx-deployment.yaml
# Deployment qui maintient 3 répliques d'un serveur Nginx
apiVersion: apps/v1
kind: Deployment
metadata:
  # Nom du Deployment
  name: nginx-deployment
  # Labels du Deployment lui-même
  labels:
    app: nginx
spec:
  # Nombre de pods à maintenir
  replicas: 3
  # Selector : le Deployment gère les pods qui ont ce label
  selector:
    matchLabels:
      app: nginx
  # Template : modèle utilisé pour créer les pods
  template:
    # Métadonnées des pods créés par ce Deployment
    metadata:
      labels:
        app: nginx
    # Spécification des pods
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
```

Points importants :

- `spec.replicas` : nombre de pods à maintenir
- `spec.selector.matchLabels` : doit correspondre aux labels dans `spec.template.metadata.labels`
- `spec.template` : le modèle de pod qui sera répliqué

```bash
# Crée le Deployment
kubectl apply -f nginx-deployment.yaml
```

**Résultat attendu** :

```text
deployment.apps/nginx-deployment created
```

---

### Étape 2 : Vérifier le Deployment

```bash
# Liste les Deployments
kubectl get deployments
```

**Résultat attendu** :

```text
NAME               READY   UP-TO-DATE   AVAILABLE   AGE
nginx-deployment   3/3     3            3           30s
```

Explication des colonnes :

| Colonne | Signification |
| ------- | ------------- |
| `READY` | Pods prêts / pods demandés |
| `UP-TO-DATE` | Pods à jour avec la dernière version du template |
| `AVAILABLE` | Pods disponibles pour servir du trafic |

```bash
# Liste les ReplicaSets créés par le Deployment
kubectl get replicasets
```

**Résultat attendu** :

```text
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-xxxxxxxxxx   3         3         3       1m
```

```bash
# Liste les pods créés par le ReplicaSet
kubectl get pods
```

**Résultat attendu** :

```text
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          1m
```

Les noms des pods suivent le format : `<deployment>-<replicaset-hash>-<pod-hash>`.

---

### Étape 3 : Tester la résilience

Supprime un pod manuellement et observe ce qui se passe :

```bash
# Note le nom d'un pod
kubectl get pods

# Supprime ce pod (remplace le nom par celui de ton pod)
kubectl delete pod nginx-deployment-xxxxxxxxxx-xxxxx

# Vérifie immédiatement : un nouveau pod est créé
kubectl get pods
```

**Résultat attendu** :

```text
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-xxxxxxxxxx-aaaaa   1/1     Running   0          2m
nginx-deployment-xxxxxxxxxx-bbbbb   1/1     Running   0          2m
nginx-deployment-xxxxxxxxxx-ccccc   1/1     Running   0          5s
```

Le pod supprimé a été remplacé immédiatement par un nouveau (celui avec AGE = 5s). Le ReplicaSet a détecté qu'il n'y avait que 2 pods au lieu de 3 et en a créé un troisième.

---

### Étape 4 : Mettre à l'échelle (scaling)

```bash
# Augmente le nombre de répliques à 5
kubectl scale deployment nginx-deployment --replicas=5

# Vérifie
kubectl get pods
```

**Résultat attendu** :

```text
NAME                                READY   STATUS    RESTARTS   AGE
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          5m
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          10s
nginx-deployment-xxxxxxxxxx-xxxxx   1/1     Running   0          10s
```

```bash
# Réduis le nombre de répliques à 2
kubectl scale deployment nginx-deployment --replicas=2

# Vérifie
kubectl get pods
```

**Résultat attendu** : Seulement 2 pods restent. Les 3 autres ont été supprimés.

```bash
# Remet à 3 pour la suite
kubectl scale deployment nginx-deployment --replicas=3
```

---

### Étape 5 : Effectuer une mise à jour (rolling update)

Mets à jour l'image Nginx de la version 1.25 à 1.26 :

```bash
# Met à jour l'image du conteneur nginx
kubectl set image deployment/nginx-deployment nginx=nginx:1.26

# Observe la mise à jour en temps réel
kubectl rollout status deployment/nginx-deployment
```

**Résultat attendu** :

```text
Waiting for deployment "nginx-deployment" rollout to finish: 1 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 2 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 3 out of 3 new replicas have been updated...
Waiting for deployment "nginx-deployment" rollout to finish: 1 old replicas are pending termination...
deployment "nginx-deployment" successfully rolled out
```

```bash
# Vérifie que les pods utilisent la nouvelle image
kubectl describe deployment nginx-deployment | grep Image
```

**Résultat attendu** :

```text
    Image:        nginx:1.26
```

```bash
# Vérifie les ReplicaSets : il y en a maintenant 2
kubectl get replicasets
```

**Résultat attendu** :

```text
NAME                          DESIRED   CURRENT   READY   AGE
nginx-deployment-aaaaaaaaaa   3         3         3       30s
nginx-deployment-bbbbbbbbbb   0         0         0       10m
```

L'ancien ReplicaSet (avec 0 pods) est conservé pour permettre un rollback.

---

### Étape 6 : Vérifier l'historique des déploiements

```bash
# Affiche l'historique des rollouts
kubectl rollout history deployment/nginx-deployment
```

**Résultat attendu** :

```text
deployment.apps/nginx-deployment
REVISION  CHANGE-CAUSE
1         <none>
2         <none>
```

```bash
# Affiche les détails d'une révision spécifique
kubectl rollout history deployment/nginx-deployment --revision=1
```

**Résultat attendu** :

```text
deployment.apps/nginx-deployment with revision #1
Pod Template:
  Labels:       app=nginx
                pod-template-hash=bbbbbbbbbb
  Containers:
   nginx:
    Image:      nginx:1.25
    Port:       80/TCP
```

---

### Étape 7 : Effectuer un rollback

Reviens à la version précédente :

```bash
# Rollback vers la version précédente
kubectl rollout undo deployment/nginx-deployment

# Vérifie que le rollback est en cours
kubectl rollout status deployment/nginx-deployment
```

**Résultat attendu** :

```text
deployment "nginx-deployment" successfully rolled out
```

```bash
# Vérifie l'image utilisée
kubectl describe deployment nginx-deployment | grep Image
```

**Résultat attendu** :

```text
    Image:        nginx:1.25
```

```bash
# Rollback vers une révision spécifique
kubectl rollout undo deployment/nginx-deployment --to-revision=2
```

---

### Étape 8 : Configurer la stratégie de mise à jour

Modifie le fichier `nginx-deployment.yaml` pour ajouter une stratégie explicite :

```yaml
# nginx-deployment.yaml (version mise à jour)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: nginx-deployment
  labels:
    app: nginx
spec:
  replicas: 3
  # Stratégie de mise à jour
  strategy:
    # RollingUpdate : remplace les pods progressivement
    type: RollingUpdate
    rollingUpdate:
      # Maximum 1 pod indisponible pendant la mise à jour
      maxUnavailable: 1
      # Maximum 1 pod en plus pendant la transition
      maxSurge: 1
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
          # Limites de ressources (bonne pratique)
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "200m"
              memory: "256Mi"
```

```bash
# Applique la configuration mise à jour
kubectl apply -f nginx-deployment.yaml
```

---

### Étape 9 : Tester la stratégie Recreate

Crée un fichier `recreate-deployment.yaml` :

```yaml
# recreate-deployment.yaml
# Deployment avec stratégie Recreate (tous les pods sont remplacés en même temps)
apiVersion: apps/v1
kind: Deployment
metadata:
  name: recreate-deployment
  labels:
    app: recreate-demo
spec:
  replicas: 3
  # Stratégie Recreate : supprime tous les anciens pods avant de créer les nouveaux
  strategy:
    type: Recreate
  selector:
    matchLabels:
      app: recreate-demo
  template:
    metadata:
      labels:
        app: recreate-demo
    spec:
      containers:
        - name: nginx
          image: nginx:1.25
          ports:
            - containerPort: 80
```

```bash
# Crée le Deployment
kubectl apply -f recreate-deployment.yaml

# Vérifie que les 3 pods tournent
kubectl get pods -l app=recreate-demo

# Met à jour l'image
kubectl set image deployment/recreate-deployment nginx=nginx:1.26

# Observe : tous les anciens pods sont supprimés avant que les nouveaux soient créés
kubectl get pods -l app=recreate-demo -w
```

Appuie sur `Ctrl+C` pour arrêter le watch.

---

### Étape 10 : Nettoyer

```bash
# Supprime les Deployments
kubectl delete deployment nginx-deployment
kubectl delete deployment recreate-deployment

# Vérifie
kubectl get deployments
kubectl get pods
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl apply -f deployment.yaml` | Crée ou met à jour un Deployment |
| `kubectl get deployments` | Liste les Deployments |
| `kubectl get replicasets` | Liste les ReplicaSets |
| `kubectl describe deployment <nom>` | Affiche les détails d'un Deployment |
| `kubectl scale deployment <nom> --replicas=N` | Change le nombre de répliques |
| `kubectl set image deployment/<nom> <conteneur>=<image>` | Met à jour l'image |
| `kubectl rollout status deployment/<nom>` | Affiche l'état du rollout |
| `kubectl rollout history deployment/<nom>` | Affiche l'historique des versions |
| `kubectl rollout undo deployment/<nom>` | Rollback vers la version précédente |
| `kubectl rollout undo deployment/<nom> --to-revision=N` | Rollback vers une version spécifique |
| `kubectl delete deployment <nom>` | Supprime un Deployment |

---

## Pièges Fréquents

### Piège 1 : Labels du selector et du template qui ne correspondent pas

⚠️ **Problème** : Le Deployment échoue avec l'erreur `selector does not match template labels`.

✅ **Solution** : Les labels dans `spec.selector.matchLabels` doivent correspondre exactement aux labels dans `spec.template.metadata.labels` :

```yaml
# ❌ Incorrect : les labels ne correspondent pas
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: web  # Différent de "nginx" !

# ✅ Correct : les labels correspondent
spec:
  selector:
    matchLabels:
      app: nginx
  template:
    metadata:
      labels:
        app: nginx  # Identique au selector
```

### Piège 2 : Modifier le fichier YAML sans appliquer

⚠️ **Problème** : Tu modifies le fichier YAML mais le Deployment ne change pas.

✅ **Solution** : Après chaque modification du fichier YAML, tu dois l'appliquer :

```bash
# Applique les modifications
kubectl apply -f nginx-deployment.yaml
```

### Piège 3 : Confondre Deployment et ReplicaSet

⚠️ **Problème** : Créer un ReplicaSet directement au lieu d'un Deployment.

✅ **Solution** : Utilise toujours un Deployment. Le Deployment crée et gère les ReplicaSets automatiquement. Créer un ReplicaSet directement ne permet pas les rolling updates ni les rollbacks.

### Piège 4 : Le rollback ne fonctionne pas

⚠️ **Problème** : `kubectl rollout undo` ne change rien.

✅ **Solution** : Vérifie l'historique avec `kubectl rollout history`. S'il n'y a qu'une seule révision, il n'y a rien vers quoi revenir. L'historique est conservé selon la valeur de `spec.revisionHistoryLimit` (10 par défaut).

---

## Checklist de Validation

- [ ] Je sais créer un Deployment avec un fichier YAML
- [ ] Je comprends la hiérarchie Deployment → ReplicaSet → Pod
- [ ] Je sais mettre à l'échelle un Deployment avec `kubectl scale`
- [ ] Je sais effectuer une mise à jour avec `kubectl set image`
- [ ] Je sais vérifier l'état du rollout avec `kubectl rollout status`
- [ ] Je sais consulter l'historique avec `kubectl rollout history`
- [ ] Je sais faire un rollback avec `kubectl rollout undo`
- [ ] Je comprends la différence entre RollingUpdate et Recreate

---

## Exercice Pratique

**Énoncé** : Simule un cycle complet de déploiement avec mises à jour et rollback.

1. Crée un Deployment `webapp` avec :
   - 4 répliques
   - Image `httpd:2.4.58` (Apache)
   - Port 80
   - Stratégie RollingUpdate avec `maxUnavailable: 1` et `maxSurge: 1`
   - Labels : `app: webapp`, `version: v1`
2. Vérifie que les 4 pods tournent
3. Mets à l'échelle à 6 répliques
4. Mets à jour l'image vers `httpd:2.4.59`
5. Vérifie que la mise à jour s'est bien passée
6. Consulte l'historique des versions
7. Fais un rollback vers la version 1
8. Vérifie que l'image est revenue à `httpd:2.4.58`
9. Supprime le Deployment

**Indications** :

- Utilise `kubectl rollout status` pour attendre la fin de chaque mise à jour
- Utilise `kubectl describe deployment` pour vérifier l'image

**Résultat attendu** : Tu as effectué un cycle complet : déploiement, scaling, mise à jour, rollback.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée le fichier `webapp-deployment.yaml` :

```yaml
# webapp-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  labels:
    app: webapp
    version: v1
spec:
  replicas: 4
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxUnavailable: 1
      maxSurge: 1
  selector:
    matchLabels:
      app: webapp
  template:
    metadata:
      labels:
        app: webapp
        version: v1
    spec:
      containers:
        - name: httpd
          image: httpd:2.4.58
          ports:
            - containerPort: 80
```

```bash
# 1. Crée le Deployment
kubectl apply -f webapp-deployment.yaml

# 2. Vérifie les 4 pods
kubectl get pods -l app=webapp
# Résultat : 4 pods en Running

# 3. Mise à l'échelle à 6 répliques
kubectl scale deployment webapp --replicas=6
kubectl get pods -l app=webapp
# Résultat : 6 pods en Running

# 4. Mise à jour de l'image
kubectl set image deployment/webapp httpd=httpd:2.4.59

# 5. Vérifie la mise à jour
kubectl rollout status deployment/webapp
kubectl describe deployment webapp | grep Image
# Résultat : Image: httpd:2.4.59

# 6. Historique
kubectl rollout history deployment/webapp
# Résultat : 2 révisions

# 7. Rollback
kubectl rollout undo deployment/webapp
kubectl rollout status deployment/webapp

# 8. Vérifie le rollback
kubectl describe deployment webapp | grep Image
# Résultat : Image: httpd:2.4.58

# 9. Supprime le Deployment
kubectl delete deployment webapp
```

---

## Navigation

← Fiche précédente : **[03 - Pods et containers](03-pods-containers.md)**

→ Fiche suivante : **[05 - Services et networking](05-services-networking.md)**
