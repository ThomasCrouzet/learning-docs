---
tags:
  - Kubernetes
  - Débutant
  - Pratique
description: "Installation locale de Kubernetes avec Minikube et kubectl"
estimated_time: "75 min"
fiche_number: 2
total_fiches: 12
cursus: "Kubernetes"
id: "infrastructure.kubernetes.installation-minikube"
course_id: "infrastructure.kubernetes"
content_type: "lesson"
order: 2
---

# 02 - Installation locale (Minikube)

> **En bref** : À la fin de cette fiche, tu auras installé Minikube et kubectl sur ta machine, démarré un cluster Kubernetes local, et vérifié son bon fonctionnement avec le dashboard. Lecture estimée : 75 min.

## Prérequis

- Fiche **[01 - Introduction à Kubernetes](01-introduction-kubernetes.md)**
- Avoir Docker installé et fonctionnel sur ta machine
- Savoir utiliser le terminal (ouvrir un terminal, taper une commande, lire le résultat)
- Au moins 2 CPU et 4 Go de RAM disponibles sur ta machine

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Minikube    | 1.38+   |
| kubectl     | 1.36+   |
| Docker      | 24+     |

## Objectif de cette fiche

À la fin de cette fiche, tu auras un cluster Kubernetes fonctionnel sur ta machine locale avec Minikube, et tu sauras utiliser `kubectl` pour interagir avec ce cluster.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Minikube ?

**Définition** : Minikube est un outil qui crée un cluster Kubernetes local sur ta machine. Il simule un cluster complet (control plane + worker node) dans une seule machine virtuelle ou un conteneur Docker.

**Le problème que Minikube résout** :

Sans Minikube, voici les problèmes rencontrés pour apprendre Kubernetes :

1. **Coût d'un vrai cluster** : Un cluster Kubernetes en production nécessite au minimum 3 machines (1 control plane + 2 workers). Louer ces machines sur le cloud coûte de l'argent.
2. **Complexité d'installation** : Installer Kubernetes manuellement (avec kubeadm) nécessite de configurer le réseau, les certificats TLS, etcd, et chaque composant individuellement.
3. **Pas de cluster pour apprendre** : Sans cluster accessible, impossible de pratiquer les commandes `kubectl` et de tester des déploiements.

**Comment Minikube résout ces problèmes** :

| Problème | Solution apportée par Minikube |
| -------- | ------------------------------ |
| Coût d'un vrai cluster | Minikube est gratuit et tourne sur ta machine locale |
| Complexité d'installation | Une seule commande `minikube start` installe et configure tout |
| Pas de cluster pour apprendre | Minikube fournit un cluster complet et fonctionnel en quelques minutes |

**Analogie concrète** : Si Kubernetes en production est un aéroport international avec ses pistes, ses tours de contrôle et ses terminaux, Minikube est un simulateur de vol sur ton ordinateur. Il reproduit fidèlement l'environnement réel, mais en miniature et sans coût. Tu peux t'entraîner autant que tu veux avant de piloter un vrai avion.

Le diagramme suivant illustre l'architecture de Minikube, qui regroupe le Control Plane et le Worker dans une seule VM.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-02-installation-minikube-1.html">Qu&#x27;est-ce que Minikube ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-02-installation-minikube-1.html" title="Qu&#x27;est-ce que Minikube ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que Minikube n'est PAS** :

- Minikube n'est pas fait pour la production. Il est conçu pour le développement et l'apprentissage. Un cluster de production utilise plusieurs machines réelles.
- Minikube n'est pas un cluster multi-nodes par défaut. Il crée un seul node qui joue le rôle de control plane et de worker. Tu peux ajouter des nodes supplémentaires avec `minikube node add`, mais c'est optionnel.

---

### Qu'est-ce que kubectl ?

**Définition** : kubectl (Kubernetes Control, prononcé "koub-control" ou "koub-C-T-L") est l'outil en ligne de commande pour interagir avec un cluster Kubernetes. C'est l'interface principale entre toi et le cluster.

**Le problème que kubectl résout** :

Sans kubectl :

1. **Pas d'interface CLI** : Tu devrais envoyer des requêtes HTTP directement à l'API server, ce qui est complexe et peu pratique.
2. **Pas de formatage** : Les réponses brutes de l'API sont en JSON et difficiles à lire dans un terminal.

**Comment kubectl résout ces problèmes** :

| Problème | Solution apportée par kubectl |
| -------- | ----------------------------- |
| Pas d'interface CLI | kubectl fournit des commandes simples comme `kubectl get pods` |
| Pas de formatage | kubectl affiche les résultats dans des tableaux lisibles |

**Analogie concrète** : kubectl est la télécommande de ton cluster Kubernetes. Sans elle, tu devrais aller appuyer sur les boutons directement sur l'appareil (l'API server). Avec la télécommande, tu contrôles tout confortablement depuis ton fauteuil (ton terminal).

---

### Le fichier kubeconfig

**Définition** : Le fichier kubeconfig (par défaut `~/.kube/config`) contient les informations de connexion à un ou plusieurs clusters Kubernetes : adresse du serveur, certificats d'authentification, et contexte actif.

**Le problème que kubeconfig résout** :

Sans kubeconfig :

1. **Pas de connexion** : kubectl ne sait pas à quel cluster se connecter.
2. **Pas de multi-cluster** : Si tu travailles avec plusieurs clusters (dev, staging, production), tu dois reconfigurer kubectl à chaque fois.

**Comment kubeconfig résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas de connexion | kubeconfig stocke l'adresse et les credentials du cluster |
| Pas de multi-cluster | kubeconfig peut contenir plusieurs contextes et tu bascules avec `kubectl config use-context` |

**Structure du fichier kubeconfig** :

```yaml
# ~/.kube/config
apiVersion: v1
kind: Config

# Liste des clusters configurés
clusters:
  - name: minikube
    cluster:
      # Adresse de l'API server
      server: https://192.168.49.2:8443
      # Certificat de l'autorité de certification
      certificate-authority: /home/user/.minikube/ca.crt

# Liste des utilisateurs configurés
users:
  - name: minikube
    user:
      # Certificat client pour l'authentification
      client-certificate: /home/user/.minikube/profiles/minikube/client.crt
      client-key: /home/user/.minikube/profiles/minikube/client.key

# Liste des contextes (association cluster + utilisateur)
contexts:
  - name: minikube
    context:
      cluster: minikube
      user: minikube
      namespace: default

# Contexte actif (celui utilisé par kubectl)
current-context: minikube
```

---

### Les drivers Minikube

**Définition** : Un driver est la technologie utilisée par Minikube pour créer le cluster. Minikube supporte plusieurs drivers selon ton système d'exploitation.

| Driver | OS | Description |
| ------ | -- | ----------- |
| `docker` | macOS, Linux, Windows | Crée le cluster dans un conteneur Docker. Le plus simple et le plus courant |
| `hyperkit` | macOS | Utilise HyperKit (machine virtuelle légère pour macOS). Remplacé par `qemu2` sur Apple Silicon |
| `qemu2` | macOS (Apple Silicon) | Émulateur de machine virtuelle pour les Mac M1/M2/M3 |
| `virtualbox` | macOS, Linux, Windows | Utilise VirtualBox. Plus lourd, mais compatible partout |
| `kvm2` | Linux | Utilise KVM (hyperviseur natif de Linux). Performant sur Linux |

**Recommandation** : Utilise le driver `docker`. C'est le plus simple à configurer et il fonctionne sur tous les systèmes.

---

## Étapes Pratiques

### Étape 1 : Installer kubectl

kubectl est l'outil en ligne de commande pour Kubernetes. Installe-le en premier.

**Sur macOS (avec Homebrew)** :

```bash
# Installe kubectl via Homebrew
brew install kubectl
```

**Sur Linux (Ubuntu/Debian)** :

```bash
# Télécharge la dernière version stable de kubectl
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"

# Rend le fichier exécutable
chmod +x kubectl

# Déplace kubectl dans un dossier accessible depuis le PATH
sudo mv kubectl /usr/local/bin/
```

**Vérification** :

```bash
# Vérifie que kubectl est installé
kubectl version --client
```

**Résultat attendu** :

```text
Client Version: v1.36.x
Kustomize Version: v5.x.x
```

---

### Étape 2 : Installer Minikube

**Sur macOS (avec Homebrew)** :

```bash
# Installe Minikube via Homebrew
brew install minikube
```

**Sur Linux (Ubuntu/Debian)** :

```bash
# Télécharge le binaire Minikube (URL officielle GitHub Releases)
curl -LO https://github.com/kubernetes/minikube/releases/latest/download/minikube-linux-amd64

# Installe Minikube dans /usr/local/bin puis supprime le fichier téléchargé
sudo install minikube-linux-amd64 /usr/local/bin/minikube && rm minikube-linux-amd64
```

**Vérification** :

```bash
# Vérifie que Minikube est installé
minikube version
```

**Résultat attendu** :

```text
minikube version: v1.38.x
commit: xxxxxxx
```

---

### Étape 3 : Démarrer le cluster

```bash
# Démarre un cluster Minikube avec le driver Docker
# --driver=docker : utilise Docker pour créer le node
# --cpus=2 : attribue 2 CPU au cluster
# --memory=4096 : attribue 4 Go de RAM au cluster
minikube start --driver=docker --cpus=2 --memory=4096
```

**Résultat attendu** :

```text
😄  minikube v1.38.x on Darwin arm64
✨  Using the docker driver based on user configuration
📌  Using Docker Desktop driver with root privileges
👍  Starting "minikube" primary control-plane node in "minikube" cluster
🚜  Pulling base image v0.0.45 ...
🔥  Creating docker container (CPUs=2, Memory=4096MB) ...
🐳  Preparing Kubernetes v1.35.x on Docker 27.x.x ...
    ▪ Generating certificates and keys ...
    ▪ Booting up control plane ...
    ▪ Configuring RBAC rules ...
🔗  Configuring bridge CNI (Container Networking Interface) ...
🔎  Verifying Kubernetes components...
    ▪ Using image gcr.io/k8s-minikube/storage-provisioner:v5
🌟  Enabled addons: storage-provisioner, default-storageclass
🏄  Done! kubectl is now configured to use "minikube" cluster and "default" namespace by default
```

Le démarrage prend entre 1 et 5 minutes selon ta machine et ta connexion internet (pour le premier démarrage uniquement).

---

### Étape 4 : Vérifier le cluster

```bash
# Affiche les informations du cluster
kubectl cluster-info
```

**Résultat attendu** :

```text
Kubernetes control plane is running at https://127.0.0.1:xxxxx
CoreDNS is running at https://127.0.0.1:xxxxx/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

```bash
# Liste les nodes du cluster
kubectl get nodes
```

**Résultat attendu** :

```text
NAME       STATUS   ROLES           AGE   VERSION
minikube   Ready    control-plane   2m    v1.35.x
```

Tu vois un seul node appelé `minikube` avec le rôle `control-plane`. Ce node joue à la fois le rôle de control plane et de worker node.

```bash
# Affiche l'état de Minikube
minikube status
```

**Résultat attendu** :

```text
minikube
type: Control Plane
host: Running
kubelet: Running
apiserver: Running
kubeconfig: Configured
```

Les quatre lignes doivent afficher `Running` ou `Configured`.

---

### Étape 5 : Explorer les composants système

Les composants internes de Kubernetes tournent dans le namespace `kube-system` :

```bash
# Liste les pods du namespace kube-system
kubectl get pods -n kube-system
```

**Résultat attendu** :

```text
NAME                               READY   STATUS    RESTARTS   AGE
coredns-xxxxxxxxx-xxxxx            1/1     Running   0          5m
etcd-minikube                      1/1     Running   0          5m
kube-apiserver-minikube            1/1     Running   0          5m
kube-controller-manager-minikube   1/1     Running   0          5m
kube-proxy-xxxxx                   1/1     Running   0          5m
kube-scheduler-minikube            1/1     Running   0          5m
storage-provisioner                1/1     Running   0          5m
```

Tu retrouves les composants vus dans la fiche 01 :

- **etcd-minikube** : la base de données du cluster
- **kube-apiserver-minikube** : le point d'entrée des requêtes
- **kube-controller-manager-minikube** : les boucles de contrôle
- **kube-scheduler-minikube** : le planificateur de pods
- **kube-proxy** : la gestion réseau
- **coredns** : le serveur DNS interne du cluster

---

### Étape 6 : Ouvrir le dashboard

Minikube inclut un dashboard web pour visualiser ton cluster :

```bash
# Active l'addon dashboard
minikube addons enable dashboard

# Active l'addon metrics-server (nécessaire pour voir les métriques)
minikube addons enable metrics-server
```

```bash
# Ouvre le dashboard dans ton navigateur
minikube dashboard
```

**Résultat attendu** : Ton navigateur s'ouvre avec l'interface web de Kubernetes. Tu peux explorer les namespaces, les pods, les services, etc.

Pour quitter le dashboard, appuie sur `Ctrl+C` dans le terminal.

---

### Étape 7 : Commandes de gestion Minikube

```bash
# Mettre le cluster en pause (libère les ressources CPU mais garde l'état)
minikube pause

# Reprendre le cluster après une pause
minikube unpause

# Arrêter le cluster (libère toutes les ressources)
minikube stop

# Redémarrer le cluster (après un stop)
minikube start

# Supprimer le cluster complètement (supprime tout, il faudra recréer)
# ⚠️ Ne fais cette commande que si tu veux repartir de zéro
minikube delete
```

---

### Étape 8 : Configurer l'auto-complétion kubectl

L'auto-complétion permet de compléter les commandes kubectl avec la touche Tab :

**Pour Bash** :

```bash
# Ajoute l'auto-complétion à ton profil Bash
echo 'source <(kubectl completion bash)' >> ~/.bashrc

# Recharge le profil
source ~/.bashrc
```

**Pour Zsh** :

```bash
# Ajoute l'auto-complétion à ton profil Zsh
echo 'source <(kubectl completion zsh)' >> ~/.zshrc

# Recharge le profil
source ~/.zshrc
```

**Vérification** :

```bash
# Tape kubectl get puis appuie sur Tab
kubectl get [Tab]
```

**Résultat attendu** : Une liste de ressources s'affiche (pods, services, deployments, etc.).

---

### Étape 9 : Créer un alias pour kubectl

La commande `kubectl` est longue à taper. Crée un alias `k` :

**Pour Bash** :

```bash
# Ajoute l'alias à ton profil Bash
echo 'alias k=kubectl' >> ~/.bashrc
echo 'complete -o default -F __start_kubectl k' >> ~/.bashrc
source ~/.bashrc
```

**Pour Zsh** :

```bash
# Ajoute l'alias à ton profil Zsh
echo 'alias k=kubectl' >> ~/.zshrc
echo 'compdef k=kubectl' >> ~/.zshrc
source ~/.zshrc
```

**Vérification** :

```bash
# Ces deux commandes sont équivalentes
kubectl get nodes
k get nodes
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `minikube start` | Démarre le cluster |
| `minikube stop` | Arrête le cluster |
| `minikube status` | Affiche l'état du cluster |
| `minikube delete` | Supprime le cluster |
| `minikube dashboard` | Ouvre le dashboard web |
| `minikube addons list` | Liste les addons disponibles |
| `minikube addons enable <nom>` | Active un addon |
| `minikube ssh` | Se connecte en SSH dans le node Minikube |
| `minikube ip` | Affiche l'adresse IP du node Minikube |
| `kubectl cluster-info` | Affiche les informations du cluster |
| `kubectl get nodes` | Liste les nodes |
| `kubectl get pods -n kube-system` | Liste les pods système |
| `kubectl config current-context` | Affiche le contexte kubectl actif |

---

## Pièges Fréquents

### Piège 1 : Docker n'est pas démarré

⚠️ **Problème** : `minikube start` échoue avec l'erreur `Cannot connect to the Docker daemon`.

✅ **Solution** : Démarre Docker avant de lancer Minikube. Sur macOS, ouvre Docker Desktop (ou OrbStack). Sur Linux, exécute `sudo systemctl start docker`.

### Piège 2 : Pas assez de ressources

⚠️ **Problème** : `minikube start` échoue ou le cluster est très lent car ta machine n'a pas assez de CPU ou de mémoire.

✅ **Solution** : Minikube nécessite au minimum 2 CPU et 2 Go de RAM. Si ta machine est limitée, réduis les ressources :

```bash
# Démarre avec le minimum de ressources
minikube start --cpus=2 --memory=2048
```

### Piège 3 : kubectl pointe vers un mauvais cluster

⚠️ **Problème** : Tes commandes `kubectl` ne fonctionnent pas car kubectl est configuré pour un autre cluster.

✅ **Solution** : Vérifie et change le contexte :

```bash
# Affiche le contexte actuel
kubectl config current-context

# Liste tous les contextes disponibles
kubectl config get-contexts

# Bascule sur le contexte Minikube
kubectl config use-context minikube
```

### Piège 4 : Minikube ne démarre pas après un crash

⚠️ **Problème** : Après un crash ou un arrêt brutal, `minikube start` affiche des erreurs.

✅ **Solution** : Supprime le cluster et recrée-le :

```bash
# Supprime le cluster actuel
minikube delete

# Recrée un nouveau cluster
minikube start --driver=docker --cpus=2 --memory=4096
```

---

## Checklist de Validation

- [ ] kubectl est installé et `kubectl version --client` affiche une version
- [ ] Minikube est installé et `minikube version` affiche une version
- [ ] Le cluster est démarré et `minikube status` affiche "Running"
- [ ] `kubectl get nodes` affiche un node `minikube` avec le status `Ready`
- [ ] `kubectl get pods -n kube-system` affiche les composants système
- [ ] Le dashboard Minikube s'ouvre dans le navigateur
- [ ] L'auto-complétion kubectl fonctionne avec Tab
- [ ] L'alias `k` est configuré

---

## Exercice Pratique

**Énoncé** : Crée un cluster Minikube, explore ses composants, puis nettoie.

1. Démarre un cluster Minikube avec 2 CPU et 4 Go de RAM
2. Vérifie que le cluster fonctionne avec `kubectl cluster-info`
3. Liste les nodes du cluster
4. Liste tous les pods du namespace `kube-system`
5. Identifie les 4 composants du control plane dans la liste des pods
6. Affiche le fichier kubeconfig et identifie le cluster, l'utilisateur et le contexte
7. Ouvre le dashboard, explore l'interface, puis ferme-le
8. Arrête le cluster avec `minikube stop`
9. Vérifie que le cluster est arrêté avec `minikube status`
10. Redémarre le cluster avec `minikube start`

**Indications** :

- Utilise `kubectl get pods -n kube-system` pour lister les pods système
- Le fichier kubeconfig est dans `~/.kube/config`
- Utilise `cat ~/.kube/config` pour afficher le contenu du fichier

**Résultat attendu** : Tu as un cluster Minikube fonctionnel et tu sais le démarrer, l'arrêter et le relancer.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Démarrer le cluster
minikube start --driver=docker --cpus=2 --memory=4096

# 2. Vérifier le cluster
kubectl cluster-info

# 3. Lister les nodes
kubectl get nodes

# 4. Lister les pods système
kubectl get pods -n kube-system

# 5. Les 4 composants du control plane sont :
# - etcd-minikube
# - kube-apiserver-minikube
# - kube-controller-manager-minikube
# - kube-scheduler-minikube

# 6. Afficher le kubeconfig
cat ~/.kube/config
# Le fichier contient :
# - clusters: minikube (avec l'adresse du serveur)
# - users: minikube (avec les certificats)
# - contexts: minikube (associe le cluster et l'utilisateur)
# - current-context: minikube

# 7. Ouvrir le dashboard
minikube dashboard
# Appuie sur Ctrl+C pour fermer

# 8. Arrêter le cluster
minikube stop

# 9. Vérifier que le cluster est arrêté
minikube status
# Résultat : host: Stopped

# 10. Redémarrer le cluster
minikube start
```

---

## Navigation

← Fiche précédente : **[01 - Introduction à Kubernetes](01-introduction-kubernetes.md)**

→ Fiche suivante : **[03 - Pods et containers](03-pods-containers.md)**
