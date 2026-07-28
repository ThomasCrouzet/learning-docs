---
tags:
  - Référence
  - Kubernetes
description: "Aide-mémoire Kubernetes : commandes kubectl et manifestes types"
estimated_time: "20 min"
fiche_number: 10
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire Kubernetes

> **En bref** : Aide-mémoire Kubernetes. Lecture estimée : 20 min.

Fiche de référence rapide pour les commandes kubectl et les manifestes Kubernetes courants.

---

## Commandes kubectl essentielles

### Informations sur le cluster

| Commande | Action |
| -------- | ------ |
| `kubectl cluster-info` | Informations sur le cluster |
| `kubectl get nodes` | Lister les nœuds |
| `kubectl get namespaces` | Lister les namespaces |
| `kubectl api-resources` | Lister les types de ressources |

### Gestion des ressources

| Commande | Action |
| -------- | ------ |
| `kubectl get pods` | Lister les pods |
| `kubectl get pods -o wide` | Lister avec détails (IP, nœud) |
| `kubectl get deploy` | Lister les déploiements |
| `kubectl get svc` | Lister les services |
| `kubectl get all` | Lister toutes les ressources |
| `kubectl get pods -n [namespace]` | Lister dans un namespace |
| `kubectl get pods -A` | Lister dans tous les namespaces |
| `kubectl get pods -w` | Surveiller les changements en temps réel |

### Détails et debug

| Commande | Action |
| -------- | ------ |
| `kubectl describe pod [name]` | Détails complets d'un pod |
| `kubectl logs [pod]` | Logs d'un pod |
| `kubectl logs [pod] -f` | Suivre les logs en temps réel |
| `kubectl logs [pod] -c [container]` | Logs d'un conteneur spécifique |
| `kubectl logs [pod] --previous` | Logs du conteneur précédent (crashé) |
| `kubectl exec -it [pod] -- bash` | Terminal dans un pod |
| `kubectl port-forward [pod] 8080:80` | Redirection de port |
| `kubectl top pods` | Consommation CPU/mémoire des pods |

### Créer et modifier

| Commande | Action |
| -------- | ------ |
| `kubectl apply -f [file.yaml]` | Appliquer un manifeste |
| `kubectl apply -f [directory/]` | Appliquer tous les manifestes d'un dossier |
| `kubectl delete -f [file.yaml]` | Supprimer les ressources du manifeste |
| `kubectl delete pod [name]` | Supprimer un pod |
| `kubectl scale deploy [name] --replicas=3` | Changer le nombre de réplicas |
| `kubectl rollout restart deploy [name]` | Redémarrer un déploiement |
| `kubectl rollout status deploy [name]` | Statut du déploiement |
| `kubectl rollout undo deploy [name]` | Annuler le dernier déploiement |

### ConfigMaps et Secrets

| Commande | Action |
| -------- | ------ |
| `kubectl create configmap [name] --from-file=[file]` | Créer depuis un fichier |
| `kubectl create configmap [name] --from-literal=key=value` | Créer depuis une valeur |
| `kubectl create secret generic [name] --from-literal=key=value` | Créer un secret |
| `kubectl get configmap [name] -o yaml` | Voir le contenu |
| `kubectl get secret [name] -o jsonpath='{.data.key}'` | Lire une valeur de secret (base64) |

---

## Manifestes types

### Pod

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: mon-app
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
          cpu: "250m"
        limits:
          memory: "128Mi"
          cpu: "500m"
```

### Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mon-app
spec:
  replicas: 3
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
          image: mon-app:1.0
          ports:
            - containerPort: 80
          env:
            - name: DATABASE_URL
              valueFrom:
                secretKeyRef:
                  name: db-secret
                  key: url
```

### Service

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mon-app-svc
spec:
  selector:
    app: mon-app
  ports:
    - port: 80
      targetPort: 80
  type: ClusterIP
```

### Ingress

```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mon-app-ingress
spec:
  rules:
    - host: mon-app.example.com
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: mon-app-svc
                port:
                  number: 80
```

---

## Labels et sélecteurs

```bash
# Filtrer par label
kubectl get pods -l app=mon-app

# Filtrer par plusieurs labels
kubectl get pods -l "app=mon-app,env=prod"

# Ajouter un label
kubectl label pod [name] env=prod

# Supprimer un label
kubectl label pod [name] env-
```

---

## Helm (commandes courantes)

| Commande | Action |
| -------- | ------ |
| `helm repo add [name] [url]` | Ajouter un dépôt |
| `helm repo update` | Mettre à jour les dépôts |
| `helm search repo [keyword]` | Chercher un chart |
| `helm install [release] [chart]` | Installer un chart |
| `helm install [release] [chart] -f values.yaml` | Installer avec des valeurs personnalisées |
| `helm upgrade [release] [chart]` | Mettre à jour une release |
| `helm uninstall [release]` | Désinstaller |
| `helm list` | Lister les releases |

---

## Navigation

← Fiche précédente : **[Aide-mémoire React](09-aide-memoire-react.md)**

→ Fiche suivante : **[Aide-mémoire Ansible](11-aide-memoire-ansible.md)**
