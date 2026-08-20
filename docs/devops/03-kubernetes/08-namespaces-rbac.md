---
tags:
  - Kubernetes
  - Avancé
  - Pratique
description: "Namespaces et RBAC : isoler les environnements et contrôler les accès"
estimated_time: "75 min"
fiche_number: 8
total_fiches: 12
cursus: "Kubernetes"
---

# 08 - Namespaces et RBAC

> **En bref** : À la fin de cette fiche, tu sauras créer des namespaces pour isoler les environnements, configurer des quotas de ressources, et mettre en place le RBAC (Role-Based Access Control) avec des Roles, RoleBindings et ServiceAccounts. Lecture estimée : 75 min.

## Prérequis

- Fiche **[07 - Volumes et persistance](07-volumes-persistance.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer des Deployments, Services et ConfigMaps

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras isoler des applications dans des namespaces, limiter les ressources avec des quotas, et contrôler qui peut faire quoi dans le cluster avec le RBAC.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Namespace ?

**Définition** : Un namespace est un espace de noms virtuel dans Kubernetes qui permet d'isoler logiquement les ressources. Chaque namespace est un environnement indépendant au sein du même cluster.

**Le problème que les namespaces résolvent** :

Sans namespace :

1. **Collision de noms** : Deux équipes ne peuvent pas créer un Service appelé `backend` dans le même cluster. Les noms doivent être uniques.
2. **Pas d'isolation** : Toutes les ressources sont visibles par tout le monde. Un développeur peut accidentellement supprimer les pods de production.
3. **Pas de quotas par équipe** : Impossible de limiter les ressources (CPU, mémoire) qu'une équipe peut consommer.

**Comment les namespaces résolvent ces problèmes** :

| Problème | Solution apportée par les namespaces |
| -------- | ------------------------------------ |
| Collision de noms | Chaque namespace a son propre espace de noms. `backend` peut exister dans `dev` et `production` |
| Pas d'isolation | Les ressources d'un namespace ne sont pas visibles depuis un autre (sauf les Services via DNS) |
| Pas de quotas | Les ResourceQuotas limitent les ressources par namespace |

**Analogie concrète** : Les namespaces sont comme les étages d'un immeuble de bureaux. L'étage "développement" et l'étage "production" utilisent le même bâtiment (cluster), mais chaque étage a ses propres bureaux (pods), son propre standard téléphonique (Services) et son propre budget (quotas). Un employé de l'étage "développement" ne peut pas accéder à l'étage "production" sans autorisation.

**Ce qu'un namespace n'est PAS** :

- Un namespace n'est pas une isolation réseau. Par défaut, les pods de namespaces différents peuvent communiquer entre eux. Pour l'isolation réseau, il faut des NetworkPolicies.
- Un namespace n'est pas un cluster séparé. Tous les namespaces partagent le même control plane et les mêmes worker nodes.

**Namespaces par défaut** :

| Namespace | Rôle |
| --------- | ---- |
| `default` | Namespace utilisé si aucun n'est spécifié |
| `kube-system` | Composants internes de Kubernetes (API server, etcd, CoreDNS) |
| `kube-public` | Ressources accessibles par tout le monde (rarement utilisé) |
| `kube-node-lease` | Heartbeats des nodes (gestion interne) |

---

### Qu'est-ce que le RBAC ?

**Définition** : RBAC (Role-Based Access Control) est le système d'autorisation de Kubernetes. Il définit qui (sujet) peut faire quoi (verbe) sur quelles ressources.

**Le problème que le RBAC résout** :

Sans RBAC :

1. **Pas de contrôle d'accès** : Tout utilisateur avec accès au cluster peut tout faire : créer, supprimer, modifier n'importe quelle ressource.
2. **Risques de sécurité** : Un développeur peut accidentellement supprimer les pods de production ou lire les Secrets d'une autre équipe.
3. **Pas de principe du moindre privilège** : Les applications (pods) ont accès à toutes les API Kubernetes, même celles dont elles n'ont pas besoin.

**Comment le RBAC résout ces problèmes** :

| Problème | Solution apportée par le RBAC |
| -------- | ----------------------------- |
| Pas de contrôle d'accès | Les Roles définissent les permissions. Les RoleBindings les attribuent à des utilisateurs |
| Risques de sécurité | Chaque utilisateur n'a accès qu'à ce dont il a besoin |
| Pas de moindre privilège | Les ServiceAccounts donnent des permissions minimales aux pods |

**Analogie concrète** : Le RBAC est comme le système de badges dans une entreprise. Chaque badge (ServiceAccount) donne accès à certaines portes (ressources). Un badge "développeur" ouvre les bureaux de dev mais pas la salle serveur. Un badge "administrateur" ouvre toutes les portes. Tu ne donnes jamais un badge administrateur à quelqu'un qui n'en a pas besoin.

---

Le diagramme suivant montre le modèle RBAC : un sujet obtient des permissions sur des ressources via un RoleBinding.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-08-namespaces-rbac-1.html">Qu&#x27;est-ce que le RBAC ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-08-namespaces-rbac-1.html" title="Qu&#x27;est-ce que le RBAC ?" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

### Les objets RBAC

| Objet | Portée | Rôle |
| ----- | ------ | ---- |
| **Role** | Un seul namespace | Définit les permissions dans un namespace |
| **ClusterRole** | Tout le cluster | Définit les permissions dans tout le cluster |
| **RoleBinding** | Un seul namespace | Attribue un Role ou ClusterRole à un utilisateur dans un namespace |
| **ClusterRoleBinding** | Tout le cluster | Attribue un ClusterRole à un utilisateur dans tout le cluster |
| **ServiceAccount** | Un seul namespace | Identité utilisée par les pods pour interagir avec l'API Kubernetes |

**Les verbes RBAC** :

| Verbe | Action |
| ----- | ------ |
| `get` | Lire une ressource spécifique |
| `list` | Lister toutes les ressources d'un type |
| `watch` | Surveiller les changements en temps réel |
| `create` | Créer une ressource |
| `update` | Modifier une ressource existante |
| `patch` | Modifier partiellement une ressource |
| `delete` | Supprimer une ressource |

---

## Étapes Pratiques

### Étape 1 : Créer et utiliser des namespaces

```bash
# Crée un namespace pour le développement
kubectl create namespace dev

# Crée un namespace pour la production
kubectl create namespace production

# Liste les namespaces
kubectl get namespaces
```

**Résultat attendu** :

```text
NAME              STATUS   AGE
default           Active   1h
dev               Active   10s
kube-node-lease   Active   1h
kube-public       Active   1h
kube-system       Active   1h
production        Active   5s
```

---

### Étape 2 : Déployer dans un namespace spécifique

Crée un fichier `dev-deployment.yaml` :

```yaml
# dev-deployment.yaml
# Deployment dans le namespace dev
apiVersion: apps/v1
kind: Deployment
metadata:
  name: webapp
  # Spécifie le namespace
  namespace: dev
  labels:
    app: webapp
    env: dev
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
          resources:
            requests:
              cpu: "100m"
              memory: "128Mi"
            limits:
              cpu: "200m"
              memory: "256Mi"
---
apiVersion: v1
kind: Service
metadata:
  name: webapp-svc
  namespace: dev
spec:
  selector:
    app: webapp
  ports:
    - port: 80
      targetPort: 80
```

```bash
# Crée les ressources dans le namespace dev
kubectl apply -f dev-deployment.yaml

# Liste les pods du namespace dev
kubectl get pods -n dev

# Liste les services du namespace dev
kubectl get services -n dev
```

**Résultat attendu** :

```text
NAME                      READY   STATUS    RESTARTS   AGE
webapp-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
webapp-xxxxxxxxxx-xxxxx   1/1     Running   0          30s
```

```bash
# Le namespace default est vide
kubectl get pods
```

**Résultat attendu** :

```text
No resources found in default namespace.
```

---

### Étape 3 : Changer le namespace par défaut

```bash
# Change le namespace par défaut de kubectl
kubectl config set-context --current --namespace=dev

# Maintenant, kubectl utilise le namespace dev par défaut
kubectl get pods
# Affiche les pods du namespace dev sans -n dev

# Reviens au namespace default
kubectl config set-context --current --namespace=default
```

---

### Étape 4 : Configurer des quotas de ressources

Crée un fichier `resource-quota.yaml` :

```yaml
# resource-quota.yaml
# Limite les ressources dans le namespace dev
apiVersion: v1
kind: ResourceQuota
metadata:
  name: dev-quota
  namespace: dev
spec:
  hard:
    # Nombre maximum de pods
    pods: "10"
    # CPU total maximum pour tous les pods du namespace
    requests.cpu: "2"
    requests.memory: "2Gi"
    limits.cpu: "4"
    limits.memory: "4Gi"
    # Nombre maximum de Services
    services: "5"
    # Nombre maximum de PVCs
    persistentvolumeclaims: "3"
```

```bash
# Crée le quota
kubectl apply -f resource-quota.yaml

# Vérifie le quota
kubectl describe resourcequota dev-quota -n dev
```

**Résultat attendu** :

```text
Name:                   dev-quota
Namespace:              dev
Resource                Used    Hard
--------                ----    ----
limits.cpu              400m    4
limits.memory           512Mi   4Gi
persistentvolumeclaims  0       3
pods                    2       10
requests.cpu            200m    2
requests.memory         256Mi   2Gi
services                1       5
```

---

### Étape 5 : Configurer des LimitRange

Crée un fichier `limit-range.yaml` :

```yaml
# limit-range.yaml
# Définit les limites par défaut pour les conteneurs dans le namespace dev
apiVersion: v1
kind: LimitRange
metadata:
  name: dev-limits
  namespace: dev
spec:
  limits:
    - type: Container
      # Valeurs par défaut si le conteneur ne spécifie pas de limites
      default:
        cpu: "200m"
        memory: "256Mi"
      # Requêtes par défaut si le conteneur ne spécifie pas de requêtes
      defaultRequest:
        cpu: "100m"
        memory: "128Mi"
      # Limites maximales autorisées par conteneur
      max:
        cpu: "1"
        memory: "1Gi"
      # Limites minimales autorisées par conteneur
      min:
        cpu: "50m"
        memory: "64Mi"
```

```bash
# Crée le LimitRange
kubectl apply -f limit-range.yaml

# Vérifie
kubectl describe limitrange dev-limits -n dev
```

---

### Étape 6 : Créer un ServiceAccount

```bash
# Crée un ServiceAccount dans le namespace dev
kubectl create serviceaccount app-sa -n dev

# Vérifie
kubectl get serviceaccounts -n dev
```

**Résultat attendu** :

```text
NAME      SECRETS   AGE
app-sa    0         10s
default   0         30m
```

Tu peux aussi le créer via un fichier YAML :

```yaml
# serviceaccount.yaml
apiVersion: v1
kind: ServiceAccount
metadata:
  name: app-sa
  namespace: dev
```

---

### Étape 7 : Créer un Role

Crée un fichier `role.yaml` :

```yaml
# role.yaml
# Role qui autorise la lecture des pods et services dans le namespace dev
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: pod-reader
  namespace: dev
rules:
  # Première règle : accès aux pods
  - apiGroups: [""]
    # Ressources autorisées
    resources: ["pods", "pods/log"]
    # Actions autorisées
    verbs: ["get", "list", "watch"]
  # Deuxième règle : accès aux services
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["get", "list"]
```

```bash
# Crée le Role
kubectl apply -f role.yaml

# Vérifie
kubectl get roles -n dev
```

**Résultat attendu** :

```text
NAME         CREATED AT
pod-reader   2025-01-10T10:15:00Z
```

---

### Étape 8 : Créer un RoleBinding

Crée un fichier `rolebinding.yaml` :

```yaml
# rolebinding.yaml
# RoleBinding qui lie le Role pod-reader au ServiceAccount app-sa
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: read-pods-binding
  namespace: dev
# Le sujet : qui reçoit les permissions
subjects:
  - kind: ServiceAccount
    name: app-sa
    namespace: dev
# Le rôle : quelles permissions
roleRef:
  kind: Role
  name: pod-reader
  apiGroup: rbac.authorization.k8s.io
```

```bash
# Crée le RoleBinding
kubectl apply -f rolebinding.yaml

# Vérifie
kubectl get rolebindings -n dev
```

**Résultat attendu** :

```text
NAME                 ROLE              AGE
read-pods-binding    Role/pod-reader   10s
```

---

### Étape 9 : Tester les permissions RBAC

```bash
# Vérifie les permissions du ServiceAccount
kubectl auth can-i get pods --namespace=dev --as=system:serviceaccount:dev:app-sa
```

**Résultat attendu** :

```text
yes
```

```bash
# Vérifie une permission non accordée
kubectl auth can-i delete pods --namespace=dev --as=system:serviceaccount:dev:app-sa
```

**Résultat attendu** :

```text
no
```

```bash
# Vérifie dans un autre namespace
kubectl auth can-i get pods --namespace=production --as=system:serviceaccount:dev:app-sa
```

**Résultat attendu** :

```text
no
```

Le ServiceAccount `app-sa` peut lire les pods dans `dev`, mais ne peut pas les supprimer, et n'a aucun accès dans `production`.

---

### Étape 10 : Créer un ClusterRole et ClusterRoleBinding

Crée un fichier `clusterrole.yaml` :

```yaml
# clusterrole.yaml
# ClusterRole qui autorise la lecture des nodes (ressource globale au cluster)
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRole
metadata:
  name: node-reader
rules:
  - apiGroups: [""]
    resources: ["nodes"]
    verbs: ["get", "list", "watch"]
---
# ClusterRoleBinding qui lie le ClusterRole au ServiceAccount
apiVersion: rbac.authorization.k8s.io/v1
kind: ClusterRoleBinding
metadata:
  name: read-nodes-binding
subjects:
  - kind: ServiceAccount
    name: app-sa
    namespace: dev
roleRef:
  kind: ClusterRole
  name: node-reader
  apiGroup: rbac.authorization.k8s.io
```

```bash
# Crée le ClusterRole et le ClusterRoleBinding
kubectl apply -f clusterrole.yaml

# Vérifie
kubectl auth can-i get nodes --as=system:serviceaccount:dev:app-sa
```

**Résultat attendu** :

```text
yes
```

---

### Étape 11 : Utiliser un ServiceAccount dans un pod

Crée un fichier `pod-sa.yaml` :

```yaml
# pod-sa.yaml
# Pod qui utilise le ServiceAccount app-sa
apiVersion: v1
kind: Pod
metadata:
  name: sa-test-pod
  namespace: dev
spec:
  # Utilise le ServiceAccount app-sa
  serviceAccountName: app-sa
  containers:
    - name: kubectl
      image: bitnami/kubectl:1.34
      command: ["sh", "-c", "kubectl get pods -n dev && echo '---' && kubectl get nodes && sleep 3600"]
```

```bash
# Crée le pod
kubectl apply -f pod-sa.yaml

# Vérifie les logs (le pod peut lire les pods et les nodes)
kubectl logs sa-test-pod -n dev
```

**Résultat attendu** :

```text
NAME                      READY   STATUS    RESTARTS   AGE
sa-test-pod               1/1     Running   0          10s
webapp-xxxxxxxxxx-xxxxx   1/1     Running   0          20m
webapp-xxxxxxxxxx-xxxxx   1/1     Running   0          20m
---
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   2h    v1.34.x
```

---

### Étape 12 : Nettoyer

```bash
# Supprime toutes les ressources
kubectl delete -f pod-sa.yaml
kubectl delete -f clusterrole.yaml
kubectl delete -f rolebinding.yaml
kubectl delete -f role.yaml
kubectl delete -f limit-range.yaml
kubectl delete -f resource-quota.yaml
kubectl delete -f dev-deployment.yaml
kubectl delete serviceaccount app-sa -n dev
kubectl delete namespace dev
kubectl delete namespace production

# Vérifie
kubectl get namespaces
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl create namespace <nom>` | Crée un namespace |
| `kubectl get namespaces` | Liste les namespaces |
| `kubectl get all -n <namespace>` | Liste toutes les ressources d'un namespace |
| `kubectl config set-context --current --namespace=<nom>` | Change le namespace par défaut |
| `kubectl describe resourcequota <nom> -n <ns>` | Affiche les quotas |
| `kubectl create serviceaccount <nom> -n <ns>` | Crée un ServiceAccount |
| `kubectl get roles -n <ns>` | Liste les Roles |
| `kubectl get rolebindings -n <ns>` | Liste les RoleBindings |
| `kubectl get clusterroles` | Liste les ClusterRoles |
| `kubectl auth can-i <verb> <resource> --as=<user>` | Vérifie une permission |

---

## Pièges Fréquents

### Piège 1 : Oublier de spécifier le namespace

⚠️ **Problème** : Tu crées une ressource dans le namespace `default` au lieu du namespace cible.

✅ **Solution** : Spécifie toujours le namespace dans le fichier YAML ou en ligne de commande :

```bash
# En ligne de commande
kubectl apply -f deployment.yaml -n dev

# Dans le fichier YAML
metadata:
  namespace: dev
```

### Piège 2 : Role vs ClusterRole

⚠️ **Problème** : Tu crées un Role pour accéder aux nodes, mais ça ne fonctionne pas.

✅ **Solution** : Les nodes sont des ressources globales au cluster. Un Role (limité à un namespace) ne peut pas donner accès aux nodes. Utilise un ClusterRole :

- **Role** : pour les ressources dans un namespace (pods, services, configmaps)
- **ClusterRole** : pour les ressources globales (nodes, namespaces, PVs) ou pour des permissions multi-namespaces

### Piège 3 : Le pod ne peut pas accéder à l'API Kubernetes

⚠️ **Problème** : Le pod utilise le ServiceAccount `default` qui n'a aucune permission RBAC personnalisée.

✅ **Solution** : Crée un ServiceAccount dédié avec les permissions nécessaires :

1. Crée un ServiceAccount
2. Crée un Role avec les permissions nécessaires
3. Crée un RoleBinding qui lie les deux
4. Spécifie `serviceAccountName` dans le pod

### Piège 4 : ResourceQuota bloque la création de pods

⚠️ **Problème** : Les pods ne se créent pas car le quota est atteint ou les conteneurs n'ont pas de `resources` définies.

✅ **Solution** : Quand un ResourceQuota est actif, chaque conteneur doit spécifier ses `requests` et `limits` de ressources. Sinon, Kubernetes refuse la création. Utilise un LimitRange pour définir des valeurs par défaut.

---

## Checklist de Validation

- [ ] Je sais créer un namespace et déployer des ressources dedans
- [ ] Je sais changer le namespace par défaut de kubectl
- [ ] Je sais configurer un ResourceQuota pour limiter les ressources d'un namespace
- [ ] Je sais configurer un LimitRange pour définir les limites par défaut
- [ ] Je comprends la différence entre Role et ClusterRole
- [ ] Je sais créer un ServiceAccount et l'attribuer à un pod
- [ ] Je sais vérifier les permissions avec `kubectl auth can-i`

---

## Exercice Pratique

**Énoncé** : Crée un environnement isolé avec RBAC.

1. Crée un namespace `staging`
2. Crée un ResourceQuota dans `staging` : max 5 pods, 1 CPU total, 1 Go de mémoire
3. Crée un LimitRange dans `staging` : par défaut 100m CPU et 128Mi mémoire par conteneur
4. Crée un ServiceAccount `deployer-sa` dans `staging`
5. Crée un Role `deployer-role` dans `staging` qui autorise :
   - `get`, `list`, `create`, `update`, `delete` sur les pods et deployments
   - `get`, `list` sur les services
6. Crée un RoleBinding pour lier `deployer-role` à `deployer-sa`
7. Vérifie les permissions avec `kubectl auth can-i`
8. Crée un Deployment de test dans `staging` (2 répliques, nginx)
9. Supprime tout

**Indications** :

- Les deployments sont dans l'apiGroup `apps`
- Les pods et services sont dans l'apiGroup `""` (vide)

**Résultat attendu** : Le ServiceAccount `deployer-sa` peut gérer les pods et deployments dans `staging` mais pas les secrets.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Crée le namespace
kubectl create namespace staging
```

Crée le fichier `exercise-rbac.yaml` :

```yaml
# exercise-rbac.yaml
# --- ResourceQuota ---
apiVersion: v1
kind: ResourceQuota
metadata:
  name: staging-quota
  namespace: staging
spec:
  hard:
    pods: "5"
    requests.cpu: "1"
    requests.memory: "1Gi"
    limits.cpu: "2"
    limits.memory: "2Gi"
---
# --- LimitRange ---
apiVersion: v1
kind: LimitRange
metadata:
  name: staging-limits
  namespace: staging
spec:
  limits:
    - type: Container
      default:
        cpu: "100m"
        memory: "128Mi"
      defaultRequest:
        cpu: "100m"
        memory: "128Mi"
---
# --- ServiceAccount ---
apiVersion: v1
kind: ServiceAccount
metadata:
  name: deployer-sa
  namespace: staging
---
# --- Role ---
apiVersion: rbac.authorization.k8s.io/v1
kind: Role
metadata:
  name: deployer-role
  namespace: staging
rules:
  - apiGroups: [""]
    resources: ["pods"]
    verbs: ["get", "list", "create", "update", "delete"]
  - apiGroups: ["apps"]
    resources: ["deployments"]
    verbs: ["get", "list", "create", "update", "delete"]
  - apiGroups: [""]
    resources: ["services"]
    verbs: ["get", "list"]
---
# --- RoleBinding ---
apiVersion: rbac.authorization.k8s.io/v1
kind: RoleBinding
metadata:
  name: deployer-binding
  namespace: staging
subjects:
  - kind: ServiceAccount
    name: deployer-sa
    namespace: staging
roleRef:
  kind: Role
  name: deployer-role
  apiGroup: rbac.authorization.k8s.io
---
# --- Test Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: test-app
  namespace: staging
spec:
  replicas: 2
  selector:
    matchLabels:
      app: test
  template:
    metadata:
      labels:
        app: test
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
```

```bash
# Crée les ressources
kubectl apply -f exercise-rbac.yaml

# 7. Vérifie les permissions
kubectl auth can-i get pods -n staging --as=system:serviceaccount:staging:deployer-sa
# yes
kubectl auth can-i delete deployments -n staging --as=system:serviceaccount:staging:deployer-sa
# yes
kubectl auth can-i get secrets -n staging --as=system:serviceaccount:staging:deployer-sa
# no
kubectl auth can-i delete services -n staging --as=system:serviceaccount:staging:deployer-sa
# no

# 8. Vérifie le Deployment
kubectl get pods -n staging

# 9. Supprime tout
kubectl delete -f exercise-rbac.yaml
kubectl delete namespace staging
```

---

## Navigation

← Fiche précédente : **[07 - Volumes et persistance](07-volumes-persistance.md)**

→ Fiche suivante : **[09 - Health checks et autoscaling](09-health-checks-autoscaling.md)**
