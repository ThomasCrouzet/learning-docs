---
tags:
  - Kubernetes
  - Intermédiaire
  - Pratique
description: "Services et networking : exposer des applications avec ClusterIP, NodePort, LoadBalancer et Ingress"
estimated_time: "90 min"
fiche_number: 5
total_fiches: 12
cursus: "Kubernetes"
id: "infrastructure.kubernetes.services-networking"
course_id: "infrastructure.kubernetes"
content_type: "lesson"
order: 5
---

# 05 - Services et networking

> **En bref** : À la fin de cette fiche, tu sauras exposer des pods sur le réseau avec les différents types de Services (ClusterIP, NodePort, LoadBalancer), utiliser le DNS interne, et configurer un Ingress pour le routage HTTP. Lecture estimée : 90 min.

## Prérequis

- Fiche **[04 - Deployments et ReplicaSets](04-deployments-replicasets.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer un Deployment à partir d'un fichier YAML

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |
| Minikube    | 1.34+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comment les pods communiquent entre eux et avec l'extérieur grâce aux Services et à l'Ingress.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Service ?

**Définition** : Un Service est un objet Kubernetes qui fournit une adresse réseau stable pour accéder à un groupe de pods. Les pods ayant des adresses IP éphémères (elles changent à chaque redémarrage), le Service fournit un point d'accès permanent.

**Le problème que les Services résolvent** :

Sans Service :

1. **Adresses IP éphémères** : Chaque pod reçoit une adresse IP lors de sa création. Quand un pod est recréé (après un crash ou une mise à jour), il obtient une nouvelle adresse IP. Les autres pods qui communiquaient avec lui ne peuvent plus le trouver.
2. **Pas de répartition de charge** : Si tu as 3 répliques d'une application, tu dois choisir manuellement vers quel pod envoyer les requêtes.
3. **Pas de découverte de services** : Les pods ne savent pas comment trouver les autres pods dans le cluster.

**Comment les Services résolvent ces problèmes** :

| Problème | Solution apportée par le Service |
| -------- | -------------------------------- |
| Adresses IP éphémères | Le Service a une adresse IP stable (ClusterIP) qui ne change jamais |
| Pas de répartition de charge | Le Service distribue les requêtes entre tous les pods correspondants |
| Pas de découverte de services | Le DNS interne permet d'accéder à un Service par son nom |

**Analogie concrète** : Un Service est comme le numéro de téléphone d'un standard téléphonique d'entreprise. Tu appelles le 01-XX-XX-XX-XX (le Service) et le standard redirige ton appel vers un employé disponible (un pod). Si un employé quitte l'entreprise et est remplacé, le numéro du standard ne change pas. Tu n'as pas besoin de connaître le numéro direct de chaque employé.

**Ce qu'un Service n'est PAS** :

- Un Service n'est pas un pod. Le Service est une abstraction réseau qui pointe vers un groupe de pods. Il ne contient aucune application.
- Un Service n'est pas un load balancer externe. Le type ClusterIP n'est accessible que depuis l'intérieur du cluster. Pour exposer à l'extérieur, il faut utiliser NodePort, LoadBalancer ou Ingress.

---

### Les types de Services

**Définition** : Kubernetes propose quatre types de Services, chacun avec un niveau d'exposition différent.

#### ClusterIP (par défaut)

- Crée une adresse IP interne au cluster
- Accessible uniquement depuis l'intérieur du cluster (par les autres pods)
- Cas d'utilisation : communication entre microservices (ex. : frontend → backend, backend → base de données)

#### NodePort

- Expose le Service sur un port statique (entre 30000 et 32767) sur chaque node du cluster
- Accessible depuis l'extérieur via `<IP-du-node>:<NodePort>`
- Cas d'utilisation : accès depuis l'extérieur en développement

#### LoadBalancer

- Crée un load balancer externe (chez un fournisseur cloud)
- Sur Minikube, utilise `minikube tunnel` pour simuler un LoadBalancer
- Cas d'utilisation : exposer une application en production sur le cloud

#### ExternalName

- Crée un alias DNS vers un service externe
- Pas de proxy ni de load balancing
- Cas d'utilisation : pointer vers une base de données externe

**Comparaison des types de Services** :

| Type | Accessible depuis | Port | Cas d'utilisation |
| ---- | ----------------- | ---- | ----------------- |
| ClusterIP | Intérieur du cluster | Port interne | Communication entre pods |
| NodePort | Extérieur + Intérieur | 30000-32767 | Développement, tests |
| LoadBalancer | Extérieur + Intérieur | Port standard (80, 443) | Production sur le cloud |
| ExternalName | Intérieur du cluster | - | Alias vers un service externe |

Le schéma suivant montre comment les types de Services s'empilent, du plus restrictif au plus exposé :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-05-services-networking-1.html">ExternalName (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-05-services-networking-1.html" title="ExternalName" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

Chaque type de Service est une couche au-dessus du précédent. Un LoadBalancer crée un NodePort, qui crée un ClusterIP. Le trafic externe traverse toute la chaîne pour atteindre les Pods.

**Niveaux d'exposition des Services** :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-05-services-networking-2.html">ExternalName (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-05-services-networking-2.html" title="ExternalName" style="width:100%;min-height:504px;border:0;background:transparent"></iframe>
</div>

Tous les types de Services sont des ressources internes au cluster. L'utilisateur extérieur accède aux Pods via Ingress (routage HTTP), LoadBalancer (IP publique) ou NodePort (port du node). ClusterIP reste accessible uniquement depuis l'intérieur du cluster.

---

### Le DNS interne de Kubernetes

**Définition** : Kubernetes inclut un serveur DNS interne (CoreDNS) qui permet aux pods d'accéder aux Services par leur nom au lieu de leur adresse IP.

**Format des noms DNS** :

| Format | Exemple | Quand l'utiliser |
| ------ | ------- | ---------------- |
| `<service-name>` | `backend` | Dans le même namespace |
| `<service-name>.<namespace>` | `backend.production` | Dans un autre namespace |
| `<service-name>.<namespace>.svc.cluster.local` | `backend.production.svc.cluster.local` | Nom complet (FQDN) |

**Analogie concrète** : Le DNS interne est comme le répertoire téléphonique interne d'une entreprise. Au lieu de composer le numéro direct d'un collègue (adresse IP), tu tapes son nom (nom du Service) et le standard (CoreDNS) te connecte automatiquement.

---

### Qu'est-ce qu'un Ingress ?

**Définition** : Un Ingress est un objet Kubernetes qui gère l'accès HTTP et HTTPS depuis l'extérieur du cluster. Il fournit du routage basé sur le nom de domaine ou le chemin URL.

**Le problème que l'Ingress résout** :

Sans Ingress :

1. **Un LoadBalancer par Service** : Chaque Service exposé à l'extérieur nécessite son propre LoadBalancer, ce qui est coûteux.
2. **Pas de routage par domaine** : Impossible de diriger `api.monsite.com` vers le backend et `monsite.com` vers le frontend avec un seul point d'entrée.
3. **Pas de TLS centralisé** : Tu dois configurer le TLS/SSL sur chaque Service individuellement.

**Comment l'Ingress résout ces problèmes** :

| Problème | Solution apportée par l'Ingress |
| -------- | ------------------------------- |
| Un LoadBalancer par Service | Un seul Ingress peut router vers plusieurs Services |
| Pas de routage par domaine | L'Ingress route par nom de domaine et/ou chemin URL |
| Pas de TLS centralisé | Le TLS est configuré une seule fois au niveau de l'Ingress |

**Analogie concrète** : L'Ingress est comme le réceptionniste d'un immeuble de bureaux. Quand un visiteur arrive, le réceptionniste lui demande quel bureau il cherche (nom de domaine) et l'envoie au bon étage (Service). Un seul réceptionniste gère l'accueil de tout l'immeuble au lieu d'avoir un réceptionniste par bureau.

**Ce qu'un Ingress n'est PAS** :

- Un Ingress ne fonctionne pas seul. Il nécessite un **Ingress Controller** (comme nginx-ingress ou traefik) installé dans le cluster. L'Ingress Controller est le logiciel qui lit les règles Ingress et les applique.

---

## Étapes Pratiques

### Étape 1 : Créer un Deployment pour les tests

Crée un fichier `web-deployment.yaml` :

```yaml
# web-deployment.yaml
# Deployment d'une application web pour tester les Services
apiVersion: apps/v1
kind: Deployment
metadata:
  name: web-app
  labels:
    app: web
spec:
  replicas: 3
  selector:
    matchLabels:
      app: web
  template:
    metadata:
      labels:
        app: web
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
```

```bash
# Crée le Deployment
kubectl apply -f web-deployment.yaml

# Vérifie que les 3 pods tournent
kubectl get pods -l app=web
```

---

### Étape 2 : Créer un Service ClusterIP

Crée un fichier `clusterip-service.yaml` :

```yaml
# clusterip-service.yaml
# Service ClusterIP : accessible uniquement depuis l'intérieur du cluster
apiVersion: v1
kind: Service
metadata:
  name: web-clusterip
spec:
  # Type ClusterIP (par défaut, on peut omettre cette ligne)
  type: ClusterIP
  # Le Service cible les pods avec le label app=web
  selector:
    app: web
  # Mapping des ports
  ports:
    # Port du Service (celui que les autres pods utilisent)
    - port: 80
      # Port du conteneur (celui dans le pod)
      targetPort: 80
      # Protocole (TCP par défaut)
      protocol: TCP
```

```bash
# Crée le Service
kubectl apply -f clusterip-service.yaml

# Vérifie le Service
kubectl get services
```

**Résultat attendu** :

```text
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)   AGE
kubernetes       ClusterIP   10.96.0.1       <none>        443/TCP   1h
web-clusterip    ClusterIP   10.96.xxx.xxx   <none>        80/TCP    10s
```

```bash
# Affiche les détails du Service
kubectl describe service web-clusterip
```

**Résultat attendu** (extrait) :

```text
Name:              web-clusterip
Namespace:         default
Labels:            <none>
Selector:          app=web
Type:              ClusterIP
IP:                10.96.xxx.xxx
Port:              <unset>  80/TCP
TargetPort:        80/TCP
Endpoints:         172.17.0.3:80,172.17.0.4:80,172.17.0.5:80
```

La ligne **Endpoints** montre les adresses IP des 3 pods sélectionnés par le Service.

---

### Étape 3 : Tester le Service ClusterIP depuis un pod

Le Service ClusterIP n'est accessible que depuis l'intérieur du cluster. Crée un pod temporaire pour le tester :

```bash
# Lance un pod temporaire avec curl pour tester le Service
kubectl run test-pod --rm -it --image=curlimages/curl -- sh
```

Dans le shell du pod :

```bash
# Accède au Service par son nom DNS
curl http://web-clusterip

# Accède au Service par son nom complet
curl http://web-clusterip.default.svc.cluster.local

# Fais plusieurs requêtes pour voir la répartition de charge
for i in 1 2 3 4 5; do curl -s http://web-clusterip | head -1; done

# Quitte le pod
exit
```

---

### Étape 4 : Créer un Service NodePort

Crée un fichier `nodeport-service.yaml` :

```yaml
# nodeport-service.yaml
# Service NodePort : accessible depuis l'extérieur sur un port du node
apiVersion: v1
kind: Service
metadata:
  name: web-nodeport
spec:
  type: NodePort
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
      # Port exposé sur le node (entre 30000 et 32767)
      # Si omis, Kubernetes en choisit un automatiquement
      nodePort: 30080
```

```bash
# Crée le Service
kubectl apply -f nodeport-service.yaml

# Vérifie
kubectl get services
```

**Résultat attendu** :

```text
NAME             TYPE        CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web-clusterip    ClusterIP   10.96.xxx.xxx   <none>        80/TCP         5m
web-nodeport     NodePort    10.96.yyy.yyy   <none>        80:30080/TCP   10s
```

```bash
# Accède au Service depuis ta machine via Minikube
minikube service web-nodeport --url
```

**Résultat attendu** :

```text
http://192.168.49.2:30080
```

Ouvre cette URL dans ton navigateur. Tu verras la page d'accueil Nginx.

---

### Étape 5 : Créer un Service LoadBalancer

Crée un fichier `loadbalancer-service.yaml` :

```yaml
# loadbalancer-service.yaml
# Service LoadBalancer : crée un load balancer externe
apiVersion: v1
kind: Service
metadata:
  name: web-loadbalancer
spec:
  type: LoadBalancer
  selector:
    app: web
  ports:
    - port: 80
      targetPort: 80
```

```bash
# Crée le Service
kubectl apply -f loadbalancer-service.yaml

# Vérifie : EXTERNAL-IP sera <pending> sans tunnel Minikube
kubectl get services
```

**Résultat attendu** :

```text
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
web-loadbalancer   LoadBalancer   10.96.zzz.zzz   <pending>     80:xxxxx/TCP   10s
```

Sur Minikube, le LoadBalancer n'obtient pas d'IP externe automatiquement. Utilise `minikube tunnel` :

```bash
# Dans un second terminal, lance le tunnel Minikube
# (laisse cette commande tourner)
minikube tunnel
```

```bash
# Vérifie à nouveau : EXTERNAL-IP est maintenant attribuée
kubectl get services
```

**Résultat attendu** :

```text
NAME               TYPE           CLUSTER-IP      EXTERNAL-IP     PORT(S)        AGE
web-loadbalancer   LoadBalancer   10.96.zzz.zzz   127.0.0.1       80:xxxxx/TCP   1m
```

Tu peux maintenant accéder à `http://127.0.0.1` dans ton navigateur.

---

### Étape 6 : Tester le DNS interne

```bash
# Lance un pod temporaire pour tester le DNS
kubectl run dns-test --rm -it --image=busybox:1.36 -- sh
```

Dans le shell du pod :

```bash
# Résout le nom DNS du Service
nslookup web-clusterip

# Résultat attendu :
# Server:    10.96.0.10
# Address:   10.96.0.10:53
# Name:      web-clusterip.default.svc.cluster.local
# Address:   10.96.xxx.xxx

# Teste aussi avec le nom complet
nslookup web-clusterip.default.svc.cluster.local

# Quitte le pod
exit
```

---

### Étape 7 : Activer l'Ingress Controller sur Minikube

```bash
# Active l'addon Ingress de Minikube (nginx-ingress)
minikube addons enable ingress

# Vérifie que le controller est démarré
kubectl get pods -n ingress-nginx
```

**Résultat attendu** :

```text
NAME                                        READY   STATUS      RESTARTS   AGE
ingress-nginx-controller-xxxxxxxxxx-xxxxx   1/1     Running     0          1m
```

---

### Étape 8 : Créer un deuxième Deployment et Service pour tester l'Ingress

Crée un fichier `api-deployment.yaml` :

```yaml
# api-deployment.yaml
# Simule un service API avec httpd
apiVersion: apps/v1
kind: Deployment
metadata:
  name: api-app
  labels:
    app: api
spec:
  replicas: 2
  selector:
    matchLabels:
      app: api
  template:
    metadata:
      labels:
        app: api
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 80
---
# Service ClusterIP pour l'API
apiVersion: v1
kind: Service
metadata:
  name: api-service
spec:
  type: ClusterIP
  selector:
    app: api
  ports:
    - port: 80
      targetPort: 80
```

```bash
# Crée le Deployment et le Service
kubectl apply -f api-deployment.yaml
```

---

### Étape 9 : Créer une ressource Ingress

Crée un fichier `ingress.yaml` :

```yaml
# ingress.yaml
# Ingress qui route le trafic HTTP vers différents Services selon le chemin
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: web-ingress
  annotations:
    # Réécriture de l'URL pour que / soit transmis au backend
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  # Classe d'Ingress à utiliser
  ingressClassName: nginx
  rules:
    # Règle pour le domaine local
    - host: myapp.local
      http:
        paths:
          # Le chemin / est routé vers le Service web-clusterip
          - path: /
            pathType: Prefix
            backend:
              service:
                name: web-clusterip
                port:
                  number: 80
          # Le chemin /api est routé vers le Service api-service
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: api-service
                port:
                  number: 80
```

```bash
# Crée l'Ingress
kubectl apply -f ingress.yaml

# Vérifie l'Ingress
kubectl get ingress
```

**Résultat attendu** :

```text
NAME          CLASS   HOSTS         ADDRESS        PORTS   AGE
web-ingress   nginx   myapp.local   192.168.49.2   80      10s
```

```bash
# Ajoute le domaine dans /etc/hosts pour le résoudre localement
# Récupère l'IP de Minikube
minikube ip
```

Ajoute cette ligne dans `/etc/hosts` (nécessite les droits administrateur) :

```text
192.168.49.2  myapp.local
```

```bash
# Teste l'Ingress
curl http://myapp.local/
curl http://myapp.local/api
```

---

### Étape 10 : Nettoyer

```bash
# Supprime toutes les ressources créées
kubectl delete -f ingress.yaml
kubectl delete -f api-deployment.yaml
kubectl delete -f loadbalancer-service.yaml
kubectl delete -f nodeport-service.yaml
kubectl delete -f clusterip-service.yaml
kubectl delete -f web-deployment.yaml

# Vérifie
kubectl get all
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl get services` | Liste les Services |
| `kubectl get svc` | Alias court pour `get services` |
| `kubectl describe service <nom>` | Affiche les détails d'un Service |
| `kubectl get endpoints <nom>` | Liste les endpoints (pods) d'un Service |
| `kubectl get ingress` | Liste les Ingress |
| `kubectl describe ingress <nom>` | Affiche les détails d'un Ingress |
| `kubectl port-forward svc/<nom> 8080:80` | Port-forward vers un Service |
| `minikube service <nom> --url` | Obtient l'URL d'un Service NodePort |
| `minikube tunnel` | Simule un LoadBalancer sur Minikube |
| `minikube addons enable ingress` | Active l'Ingress Controller |

---

## Pièges Fréquents

### Piège 1 : Le Service n'a pas d'Endpoints

⚠️ **Problème** : `kubectl describe service <nom>` montre `Endpoints: <none>`.

✅ **Solution** : Le selector du Service ne correspond à aucun pod. Vérifie que les labels du selector correspondent exactement aux labels des pods :

```bash
# Vérifie les labels des pods
kubectl get pods --show-labels

# Vérifie le selector du Service
kubectl describe service <nom> | grep Selector
```

### Piège 2 : NodePort inaccessible

⚠️ **Problème** : Le Service NodePort est créé mais tu ne peux pas y accéder via le navigateur.

✅ **Solution** : Sur Minikube, utilise `minikube service <nom>` pour obtenir l'URL correcte. L'adresse `localhost:30080` ne fonctionne pas directement avec Minikube car le cluster tourne dans un conteneur Docker.

### Piège 3 : Ingress ne fonctionne pas

⚠️ **Problème** : L'Ingress est créé mais les requêtes HTTP retournent 404.

✅ **Solution** : Vérifie que :

1. L'Ingress Controller est installé : `kubectl get pods -n ingress-nginx`
2. L'adresse du domaine est dans `/etc/hosts`
3. Les noms de Services dans l'Ingress correspondent aux Services existants
4. `ingressClassName: nginx` est spécifié dans le YAML

### Piège 4 : Confondre port, targetPort et nodePort

⚠️ **Problème** : Confusion entre les trois types de ports dans un Service.

✅ **Solution** :

| Port | Description | Exemple |
| ---- | ----------- | ------- |
| `port` | Port du Service (utilisé par les autres pods pour communiquer) | 80 |
| `targetPort` | Port du conteneur dans le pod (où l'application écoute) | 80 |
| `nodePort` | Port exposé sur le node (pour accès externe avec NodePort) | 30080 |

```text
Utilisateur → nodePort (30080) → port (80) → targetPort (80) → Conteneur
                                  ↑ Service       ↑ Pod
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre ClusterIP, NodePort et LoadBalancer
- [ ] Je sais créer un Service ClusterIP
- [ ] Je sais créer un Service NodePort et y accéder
- [ ] Je sais utiliser `minikube tunnel` pour un LoadBalancer
- [ ] Je comprends le DNS interne (nom du Service = nom DNS)
- [ ] Je sais configurer un Ingress avec routage par chemin
- [ ] Je comprends la différence entre port, targetPort et nodePort

---

## Exercice Pratique

**Énoncé** : Crée une architecture avec deux services et un Ingress.

1. Crée un Deployment `frontend` (3 répliques, image `nginx:1.26`, port 80)
2. Crée un Deployment `backend` (2 répliques, image `httpd:2.4`, port 80)
3. Crée un Service ClusterIP `frontend-svc` pour le frontend
4. Crée un Service ClusterIP `backend-svc` pour le backend
5. Crée un Ingress qui route :
   - `mysite.local/` vers `frontend-svc`
   - `mysite.local/api` vers `backend-svc`
6. Teste avec `curl http://mysite.local/` et `curl http://mysite.local/api`
7. Crée un Service NodePort pour le frontend sur le port 30090
8. Accède au frontend via NodePort
9. Supprime tout

**Indications** :

- N'oublie pas d'ajouter `mysite.local` dans `/etc/hosts`
- Utilise `minikube ip` pour obtenir l'adresse IP

**Résultat attendu** : L'Ingress route correctement les requêtes vers le frontend et le backend selon le chemin URL.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée un fichier `exercise-networking.yaml` :

```yaml
# exercise-networking.yaml
# --- Frontend Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: frontend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: frontend
  template:
    metadata:
      labels:
        app: frontend
    spec:
      containers:
        - name: nginx
          image: nginx:1.26
          ports:
            - containerPort: 80
---
# --- Backend Deployment ---
apiVersion: apps/v1
kind: Deployment
metadata:
  name: backend
spec:
  replicas: 2
  selector:
    matchLabels:
      app: backend
  template:
    metadata:
      labels:
        app: backend
    spec:
      containers:
        - name: httpd
          image: httpd:2.4
          ports:
            - containerPort: 80
---
# --- Frontend ClusterIP Service ---
apiVersion: v1
kind: Service
metadata:
  name: frontend-svc
spec:
  type: ClusterIP
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
---
# --- Backend ClusterIP Service ---
apiVersion: v1
kind: Service
metadata:
  name: backend-svc
spec:
  type: ClusterIP
  selector:
    app: backend
  ports:
    - port: 80
      targetPort: 80
---
# --- Frontend NodePort Service ---
apiVersion: v1
kind: Service
metadata:
  name: frontend-nodeport
spec:
  type: NodePort
  selector:
    app: frontend
  ports:
    - port: 80
      targetPort: 80
      nodePort: 30090
---
# --- Ingress ---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: mysite-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  ingressClassName: nginx
  rules:
    - host: mysite.local
      http:
        paths:
          - path: /
            pathType: Prefix
            backend:
              service:
                name: frontend-svc
                port:
                  number: 80
          - path: /api
            pathType: Prefix
            backend:
              service:
                name: backend-svc
                port:
                  number: 80
```

```bash
# Crée toutes les ressources
kubectl apply -f exercise-networking.yaml

# Ajoute mysite.local dans /etc/hosts
# sudo sh -c 'echo "$(minikube ip) mysite.local" >> /etc/hosts'

# Teste l'Ingress
curl http://mysite.local/
curl http://mysite.local/api

# Teste le NodePort
minikube service frontend-nodeport --url

# Supprime tout
kubectl delete -f exercise-networking.yaml
```

---

## Navigation

← Fiche précédente : **[04 - Deployments et ReplicaSets](04-deployments-replicasets.md)**

→ Fiche suivante : **[06 - ConfigMaps et Secrets](06-configmaps-secrets.md)**
