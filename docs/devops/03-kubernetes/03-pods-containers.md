---
tags:
  - Kubernetes
  - Intermédiaire
  - Pratique
description: "Pods et containers : créer, inspecter et gérer la plus petite unité de Kubernetes"
estimated_time: "75 min"
fiche_number: 3
total_fiches: 12
cursus: "Kubernetes"
id: "infrastructure.kubernetes.pods-containers"
course_id: "infrastructure.kubernetes"
content_type: "lesson"
order: 3
---

# 03 - Pods et containers

> **En bref** : À la fin de cette fiche, tu sauras créer un pod via un fichier YAML, inspecter son état, lire ses logs, et comprendre le pattern multi-conteneurs (sidecar). Lecture estimée : 75 min.

## Prérequis

- Fiche **[01 - Introduction à Kubernetes](01-introduction-kubernetes.md)**
- Fiche **[02 - Installation locale (Minikube)](02-installation-minikube.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Connaître les bases de YAML (indentation par espaces, listes avec `-`, paires clé-valeur)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.34+ (supportées août 2026 : 1.34, 1.35, 1.36) |
| kubectl     | 1.34+   |
| Minikube    | 1.34+   |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des pods Kubernetes à partir de fichiers YAML, inspecter leur état, lire leurs logs, et comprendre le cycle de vie d'un pod.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Pod ?

**Définition** : Un pod est la plus petite unité déployable dans Kubernetes. Un pod contient un ou plusieurs conteneurs qui partagent le même réseau et le même stockage. Dans la grande majorité des cas, un pod contient un seul conteneur.

**Le problème que les pods résolvent** :

Sans pods, voici les problèmes rencontrés :

1. **Pas de groupement logique** : Certains conteneurs doivent fonctionner ensemble (exemple : un serveur web et un collecteur de logs). Sans pods, il faut gérer leur association manuellement.
2. **Pas de réseau partagé** : Deux conteneurs sur le même hôte ne partagent pas automatiquement le même réseau. Ils doivent communiquer via des ports exposés.
3. **Pas de stockage partagé** : Deux conteneurs ne peuvent pas accéder au même volume de stockage sans configuration spécifique.
4. **Pas de cycle de vie commun** : Si un conteneur dépend d'un autre, il faut gérer leur démarrage et leur arrêt dans le bon ordre.

**Comment les pods résolvent ces problèmes** :

| Problème | Solution apportée par les pods |
| -------- | ------------------------------ |
| Pas de groupement logique | Les conteneurs d'un même pod sont toujours déployés ensemble sur le même node |
| Pas de réseau partagé | Les conteneurs d'un pod partagent la même adresse IP et les mêmes ports |
| Pas de stockage partagé | Les conteneurs d'un pod peuvent partager des volumes |
| Pas de cycle de vie commun | Tous les conteneurs d'un pod démarrent et s'arrêtent ensemble |

**Analogie concrète** : Un pod est comme un appartement dans un immeuble. Les conteneurs sont les colocataires de cet appartement. Ils partagent la même adresse postale (adresse IP), la même cuisine et la même salle de bain (volumes partagés). Si l'appartement est détruit, tous les colocataires sont affectés en même temps.

**Ce qu'un pod n'est PAS** :

- Un pod n'est pas un conteneur. Un pod est une enveloppe qui contient un ou plusieurs conteneurs. Le pod fournit l'environnement partagé (réseau, stockage), le conteneur exécute l'application.
- Un pod n'est pas permanent. Les pods sont éphémères par conception. Quand un pod meurt, Kubernetes en crée un nouveau (via un Deployment) au lieu de réparer l'ancien.
- Un pod n'est pas un serveur. Un pod n'a pas d'accès SSH. Tu interagis avec lui via `kubectl exec`, `kubectl logs` et `kubectl describe`.

---

### Le cycle de vie d'un pod

**Définition** : Le cycle de vie d'un pod décrit les différents états par lesquels un pod passe depuis sa création jusqu'à sa suppression.

Les états possibles d'un pod :

| État | Description |
| ---- | ----------- |
| `Pending` | Le pod est accepté par Kubernetes mais pas encore démarré. Il attend d'être assigné à un node ou que les images soient téléchargées |
| `Running` | Le pod est assigné à un node et au moins un conteneur est en cours d'exécution |
| `Succeeded` | Tous les conteneurs du pod se sont terminés avec succès (code de sortie 0). Typique pour les Jobs |
| `Failed` | Tous les conteneurs du pod se sont terminés et au moins un a échoué (code de sortie non nul) |
| `Unknown` | L'état du pod ne peut pas être déterminé. Généralement, le kubelet du node ne répond plus |

**Schéma du cycle de vie** :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-03-kubernetes-03-pods-containers-1.html">Le cycle de vie d&#x27;un pod (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-03-kubernetes-03-pods-containers-1.html" title="Le cycle de vie d&#x27;un pod" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

---

### Structure YAML d'un pod

**Définition** : Un fichier YAML de pod contient quatre sections principales obligatoires.

```yaml
# Version de l'API Kubernetes à utiliser
apiVersion: v1

# Type de ressource Kubernetes
kind: Pod

# Métadonnées du pod (nom, labels, annotations)
metadata:
  name: mon-pod
  labels:
    app: mon-app

# Spécification du pod (conteneurs, volumes, etc.)
spec:
  containers:
    - name: mon-conteneur
      image: nginx:1.26
      ports:
        - containerPort: 80
```

Explication de chaque champ :

| Champ | Rôle |
| ----- | ---- |
| `apiVersion` | Version de l'API. Pour les pods, c'est toujours `v1` |
| `kind` | Type de ressource. Ici `Pod` |
| `metadata.name` | Nom unique du pod dans le namespace |
| `metadata.labels` | Étiquettes clé-valeur pour identifier et filtrer les pods |
| `spec.containers` | Liste des conteneurs dans le pod |
| `spec.containers[].name` | Nom du conteneur (unique dans le pod) |
| `spec.containers[].image` | Image Docker à utiliser |
| `spec.containers[].ports` | Ports exposés par le conteneur |

---

### Les labels et selectors

**Définition** : Les labels sont des paires clé-valeur attachées aux objets Kubernetes. Les selectors permettent de filtrer les objets par leurs labels.

**Le problème que les labels résolvent** :

Sans labels :

1. **Pas d'identification** : Dans un cluster avec des centaines de pods, impossible de savoir lequel appartient à quelle application.
2. **Pas de regroupement** : Impossible de sélectionner un groupe de pods pour leur appliquer un service ou une politique réseau.

**Comment les labels résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas d'identification | Chaque pod porte des labels comme `app: frontend`, `env: production` |
| Pas de regroupement | Les selectors filtrent les pods par labels. Un service peut cibler tous les pods avec `app: frontend` |

**Analogie concrète** : Les labels sont comme les étiquettes sur des boîtes de rangement. Tu peux écrire "Cuisine", "Chambre", "Fragile" sur chaque boîte. Quand tu cherches toutes les boîtes de la cuisine, tu filtres par l'étiquette "Cuisine". C'est exactement ce que font les selectors.

---

### Le pattern multi-conteneurs (sidecar)

**Définition** : Le pattern sidecar consiste à ajouter un conteneur secondaire dans un pod pour enrichir le conteneur principal. Le sidecar effectue une tâche complémentaire sans modifier le conteneur principal.

**Cas d'utilisation courants** :

| Pattern | Conteneur principal | Sidecar | Exemple |
| ------- | ------------------- | ------- | ------- |
| Sidecar log | Application web | Collecteur de logs | Nginx + Fluentd |
| Sidecar proxy | Application | Proxy réseau | App + Envoy |
| Sidecar sync | Application | Synchronisation de fichiers | App + Git-sync |

**Quand utiliser un sidecar** :

- Quand deux conteneurs doivent partager le même réseau (même IP)
- Quand deux conteneurs doivent partager le même volume de stockage
- Quand un conteneur enrichit les fonctionnalités d'un autre sans le modifier

**Quand ne PAS utiliser un sidecar** :

- Quand les deux conteneurs n'ont pas besoin de communiquer directement
- Quand les deux conteneurs ont des cycles de vie différents
- Dans ces cas, utilise deux pods séparés

---

## Étapes Pratiques

### Étape 1 : Créer un pod simple

Crée un fichier `nginx-pod.yaml` :

```yaml
# nginx-pod.yaml
# Ce fichier définit un pod contenant un seul conteneur Nginx
apiVersion: v1
kind: Pod
metadata:
  # Nom unique du pod dans le namespace
  name: nginx-pod
  # Labels pour identifier ce pod
  labels:
    app: nginx
    env: dev
spec:
  containers:
    # Définition du conteneur
    - name: nginx
      # Image Nginx version 1.26
      image: nginx:1.26
      # Ports exposés par le conteneur
      ports:
        - containerPort: 80
```

Applique ce fichier :

```bash
# Crée le pod à partir du fichier YAML
kubectl apply -f nginx-pod.yaml
```

**Résultat attendu** :

```text
pod/nginx-pod created
```

---

### Étape 2 : Vérifier l'état du pod

```bash
# Liste les pods du namespace par défaut
kubectl get pods
```

**Résultat attendu** :

```text
NAME        READY   STATUS    RESTARTS   AGE
nginx-pod   1/1     Running   0          30s
```

Explication des colonnes :

| Colonne | Signification |
| ------- | ------------- |
| `NAME` | Nom du pod |
| `READY` | Nombre de conteneurs prêts / nombre total |
| `STATUS` | État du pod (Pending, Running, Succeeded, Failed) |
| `RESTARTS` | Nombre de redémarrages |
| `AGE` | Temps écoulé depuis la création |

```bash
# Affiche plus de détails (IP, node, etc.)
kubectl get pods -o wide
```

**Résultat attendu** :

```text
NAME        READY   STATUS    RESTARTS   AGE   IP           NODE       NOMINATED NODE   READINESS GATES
nginx-pod   1/1     Running   0          1m    172.17.0.3   minikube   <none>           <none>
```

---

### Étape 3 : Inspecter un pod en détail

```bash
# Affiche tous les détails du pod
kubectl describe pod nginx-pod
```

**Résultat attendu** (extrait) :

```text
Name:             nginx-pod
Namespace:        default
Priority:         0
Service Account:  default
Node:             minikube/192.168.49.2
Start Time:       ...
Labels:           app=nginx
                  env=dev
Status:           Running
IP:               172.17.0.3
Containers:
  nginx:
    Container ID:   docker://abc123...
    Image:          nginx:1.26
    Port:           80/TCP
    State:          Running
      Started:      ...
    Ready:          True
Events:
  Type    Reason     Age   From               Message
  ----    ------     ----  ----               -------
  Normal  Scheduled  2m    default-scheduler  Successfully assigned default/nginx-pod to minikube
  Normal  Pulling    2m    kubelet            Pulling image "nginx:1.26"
  Normal  Pulled     1m    kubelet            Successfully pulled image "nginx:1.26"
  Normal  Created    1m    kubelet            Created container nginx
  Normal  Started    1m    kubelet            Started container nginx
```

La section **Events** en bas est très utile pour le débogage. Elle montre chronologiquement ce qui s'est passé :

1. Le scheduler a assigné le pod au node `minikube`
2. Le kubelet a téléchargé l'image `nginx:1.26`
3. Le kubelet a créé puis démarré le conteneur

---

### Étape 4 : Lire les logs d'un pod

```bash
# Affiche les logs du conteneur dans le pod
kubectl logs nginx-pod
```

**Résultat attendu** :

```text
/docker-entrypoint.sh: /docker-entrypoint.d/ is not empty, will attempt to perform configuration
/docker-entrypoint.sh: Looking for shell scripts in /docker-entrypoint.d/
...
```

```bash
# Suivre les logs en temps réel (comme tail -f)
# Appuie sur Ctrl+C pour arrêter
kubectl logs nginx-pod -f
```

```bash
# Afficher les 20 dernières lignes de logs
kubectl logs nginx-pod --tail=20
```

---

### Étape 5 : Exécuter une commande dans un pod

```bash
# Ouvre un shell interactif dans le conteneur
kubectl exec -it nginx-pod -- /bin/bash
```

**Résultat attendu** :

```text
root@nginx-pod:/#
```

Tu es maintenant dans le conteneur. Tu peux exécuter des commandes :

```bash
# Vérifie que Nginx tourne
curl localhost:80

# Affiche la page d'accueil Nginx
cat /usr/share/nginx/html/index.html

# Quitte le shell
exit
```

```bash
# Exécuter une commande sans ouvrir de shell interactif
kubectl exec nginx-pod -- cat /etc/nginx/nginx.conf
```

---

### Étape 6 : Accéder au pod depuis ta machine

Les pods ne sont pas accessibles directement depuis ta machine. Utilise `port-forward` :

```bash
# Redirige le port 8080 de ta machine vers le port 80 du pod
kubectl port-forward nginx-pod 8080:80
```

**Résultat attendu** :

```text
Forwarding from 127.0.0.1:8080 -> 80
Forwarding from [::1]:8080 -> 80
```

Ouvre ton navigateur et va sur `http://localhost:8080`. Tu verras la page d'accueil de Nginx.

Appuie sur `Ctrl+C` pour arrêter le port-forward.

---

### Étape 7 : Créer un pod avec des variables d'environnement

Crée un fichier `app-pod.yaml` :

```yaml
# app-pod.yaml
# Pod avec des variables d'environnement
apiVersion: v1
kind: Pod
metadata:
  name: app-pod
  labels:
    app: demo
spec:
  containers:
    - name: busybox
      # BusyBox est une image minimale avec des outils Unix de base
      image: busybox:1.36
      # Commande qui affiche les variables puis attend indéfiniment
      command: ["sh", "-c", "echo Bonjour $APP_NAME version $APP_VERSION && sleep 3600"]
      # Variables d'environnement
      env:
        - name: APP_NAME
          value: "mon-application"
        - name: APP_VERSION
          value: "1.0.0"
```

```bash
# Crée le pod
kubectl apply -f app-pod.yaml

# Vérifie qu'il tourne
kubectl get pods

# Lis les logs pour voir le message
kubectl logs app-pod
```

**Résultat attendu** :

```text
Bonjour mon-application version 1.0.0
```

---

### Étape 8 : Créer un pod multi-conteneurs (sidecar)

Crée un fichier `sidecar-pod.yaml` :

```yaml
# sidecar-pod.yaml
# Pod avec deux conteneurs : un serveur web et un sidecar qui génère du contenu
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-pod
  labels:
    app: sidecar-demo
spec:
  # Volume partagé entre les deux conteneurs
  volumes:
    - name: shared-data
      # emptyDir : volume temporaire créé avec le pod, supprimé avec le pod
      emptyDir: {}

  containers:
    # Conteneur principal : serveur web Nginx
    - name: nginx
      image: nginx:1.26
      ports:
        - containerPort: 80
      # Monte le volume partagé dans le dossier de Nginx
      volumeMounts:
        - name: shared-data
          mountPath: /usr/share/nginx/html

    # Conteneur sidecar : génère du contenu toutes les 5 secondes
    - name: content-generator
      image: busybox:1.36
      # Écrit la date dans un fichier HTML toutes les 5 secondes
      command:
        - sh
        - -c
        - |
          while true; do
            echo "<h1>Page generee le $(date)</h1>" > /html/index.html
            sleep 5
          done
      # Monte le même volume partagé
      volumeMounts:
        - name: shared-data
          mountPath: /html
```

```bash
# Crée le pod sidecar
kubectl apply -f sidecar-pod.yaml

# Vérifie que les deux conteneurs tournent (READY doit afficher 2/2)
kubectl get pods
```

**Résultat attendu** :

```text
NAME          READY   STATUS    RESTARTS   AGE
sidecar-pod   2/2     Running   0          30s
```

```bash
# Accède au pod via port-forward
kubectl port-forward sidecar-pod 8080:80
```

Ouvre `http://localhost:8080` dans ton navigateur. Rafraîchis la page plusieurs fois : la date change toutes les 5 secondes car le sidecar met à jour le fichier HTML.

```bash
# Pour lire les logs d'un conteneur spécifique dans un pod multi-conteneurs
kubectl logs sidecar-pod -c nginx
kubectl logs sidecar-pod -c content-generator
```

---

### Étape 9 : Filtrer les pods par labels

```bash
# Liste les pods avec le label app=nginx
kubectl get pods -l app=nginx

# Liste les pods avec le label app=demo
kubectl get pods -l app=demo

# Liste les pods avec le label env=dev
kubectl get pods -l env=dev

# Affiche les labels de tous les pods
kubectl get pods --show-labels
```

**Résultat attendu** :

```text
NAME        READY   STATUS    RESTARTS   AGE   LABELS
nginx-pod   1/1     Running   0          10m   app=nginx,env=dev
app-pod     1/1     Running   0          5m    app=demo
sidecar-pod 2/2     Running   0          2m    app=sidecar-demo
```

---

### Étape 10 : Supprimer les pods

```bash
# Supprime un pod par son nom
kubectl delete pod nginx-pod

# Supprime un pod à partir de son fichier YAML
kubectl delete -f app-pod.yaml

# Supprime tous les pods avec un label spécifique
kubectl delete pods -l app=sidecar-demo

# Vérifie que tous les pods sont supprimés
kubectl get pods
```

**Résultat attendu** :

```text
No resources found in default namespace.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `kubectl apply -f fichier.yaml` | Crée ou met à jour une ressource |
| `kubectl get pods` | Liste les pods |
| `kubectl get pods -o wide` | Liste les pods avec plus de détails |
| `kubectl get pods --show-labels` | Liste les pods avec leurs labels |
| `kubectl get pods -l app=nom` | Filtre les pods par label |
| `kubectl describe pod <nom>` | Affiche les détails d'un pod |
| `kubectl logs <nom>` | Affiche les logs d'un pod |
| `kubectl logs <nom> -f` | Suit les logs en temps réel |
| `kubectl logs <nom> -c <conteneur>` | Affiche les logs d'un conteneur spécifique |
| `kubectl exec -it <nom> -- /bin/bash` | Ouvre un shell dans un pod |
| `kubectl port-forward <nom> 8080:80` | Redirige un port local vers le pod |
| `kubectl delete pod <nom>` | Supprime un pod |
| `kubectl delete -f fichier.yaml` | Supprime les ressources du fichier |

---

## Pièges Fréquents

### Piège 1 : Le pod reste en status Pending

⚠️ **Problème** : Le pod est créé mais ne démarre pas. Son status reste `Pending`.

✅ **Solution** : Utilise `kubectl describe pod <nom>` et regarde la section **Events**. Les causes courantes sont :

- L'image n'existe pas (erreur `ImagePullBackOff`)
- Le node n'a pas assez de ressources (CPU ou mémoire)
- Un volume demandé n'est pas disponible

### Piège 2 : Erreur ImagePullBackOff

⚠️ **Problème** : Le pod affiche `ImagePullBackOff` ou `ErrImagePull`.

✅ **Solution** : Vérifie le nom de l'image et le tag :

```bash
# Vérifie les événements du pod
kubectl describe pod <nom>

# Erreur courante : faute de frappe dans le nom de l'image
# ❌ image: ngix:1.26 (il manque le "n")
# ✅ image: nginx:1.26
```

### Piège 3 : Oublier le `-it` avec exec

⚠️ **Problème** : `kubectl exec nginx-pod -- /bin/bash` ouvre un shell mais tu ne peux pas taper de commandes.

✅ **Solution** : Ajoute les flags `-it` :

- `-i` (interactive) : garde le stdin ouvert
- `-t` (tty) : alloue un pseudo-terminal

```bash
# ❌ Sans -it : le shell se ferme immédiatement
kubectl exec nginx-pod -- /bin/bash

# ✅ Avec -it : le shell reste ouvert et tu peux taper des commandes
kubectl exec -it nginx-pod -- /bin/bash
```

### Piège 4 : Le pod redémarre en boucle (CrashLoopBackOff)

⚠️ **Problème** : Le pod affiche `CrashLoopBackOff` et le compteur RESTARTS augmente.

✅ **Solution** : Le conteneur plante immédiatement après son démarrage. Vérifie les logs :

```bash
# Affiche les logs du dernier crash
kubectl logs <nom> --previous
```

Causes courantes :

- La commande dans le conteneur retourne une erreur
- L'application plante au démarrage (erreur de configuration)
- Le conteneur n'a pas de processus qui tourne en permanence (il se termine immédiatement)

---

## Checklist de Validation

- [ ] Je sais créer un pod à partir d'un fichier YAML
- [ ] Je sais vérifier l'état d'un pod avec `kubectl get pods`
- [ ] Je sais inspecter un pod avec `kubectl describe pod`
- [ ] Je sais lire les logs avec `kubectl logs`
- [ ] Je sais ouvrir un shell dans un pod avec `kubectl exec -it`
- [ ] Je sais accéder à un pod avec `kubectl port-forward`
- [ ] Je comprends le pattern sidecar
- [ ] Je sais filtrer les pods par labels
- [ ] Je sais supprimer un pod

---

## Exercice Pratique

**Énoncé** : Crée un pod multi-conteneurs qui simule une application web avec un sidecar de monitoring.

1. Crée un fichier `monitoring-pod.yaml` avec :
   - Un conteneur principal `web` utilisant l'image `nginx:1.26` sur le port 80
   - Un conteneur sidecar `monitor` utilisant l'image `busybox:1.36` qui écrit l'heure et le status HTTP de la page toutes les 10 secondes dans un fichier `/logs/monitor.log`
   - Un volume partagé `log-volume` de type `emptyDir`
   - Le conteneur `monitor` monte le volume sur `/logs`
   - Les labels `app: web-monitored` et `env: dev`

2. Déploie le pod et vérifie qu'il a bien 2/2 conteneurs en `Running`
3. Lis les logs du conteneur `monitor`
4. Accède à la page Nginx via port-forward sur le port 9090
5. Supprime le pod

**Indications** :

- La commande du sidecar peut être : `while true; do echo "$(date) - Status: OK" >> /logs/monitor.log; sleep 10; done`
- Utilise `kubectl logs <pod> -c <conteneur>` pour les logs d'un conteneur spécifique
- Utilise `kubectl exec <pod> -c monitor -- cat /logs/monitor.log` pour vérifier le fichier

**Résultat attendu** : Le pod `monitoring-pod` tourne avec 2 conteneurs. Le sidecar écrit dans le fichier de logs toutes les 10 secondes.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Crée le fichier `monitoring-pod.yaml` :

```yaml
# monitoring-pod.yaml
apiVersion: v1
kind: Pod
metadata:
  name: monitoring-pod
  labels:
    app: web-monitored
    env: dev
spec:
  volumes:
    - name: log-volume
      emptyDir: {}

  containers:
    # Conteneur principal : serveur web Nginx
    - name: web
      image: nginx:1.26
      ports:
        - containerPort: 80

    # Conteneur sidecar : monitoring
    - name: monitor
      image: busybox:1.36
      command:
        - sh
        - -c
        - |
          while true; do
            echo "$(date) - Status: OK" >> /logs/monitor.log
            sleep 10
          done
      volumeMounts:
        - name: log-volume
          mountPath: /logs
```

```bash
# Déploie le pod
kubectl apply -f monitoring-pod.yaml

# Vérifie que les 2 conteneurs tournent
kubectl get pods
# Résultat : monitoring-pod   2/2     Running   0          30s

# Lis les logs du conteneur monitor
kubectl logs monitoring-pod -c monitor

# Vérifie le fichier de logs
kubectl exec monitoring-pod -c monitor -- cat /logs/monitor.log
# Résultat :
# Fri Jan 10 14:30:00 UTC 2025 - Status: OK
# Fri Jan 10 14:30:10 UTC 2025 - Status: OK
# ...

# Accède à Nginx via port-forward
kubectl port-forward monitoring-pod 9090:80
# Ouvre http://localhost:9090 dans le navigateur

# Supprime le pod
kubectl delete pod monitoring-pod
```

---

## Navigation

← Fiche précédente : **[02 - Installation locale (Minikube)](02-installation-minikube.md)**

→ Fiche suivante : **[04 - Deployments et ReplicaSets](04-deployments-replicasets.md)**
