---
tags:
  - Kubernetes
  - Avancé
  - Pratique
description: "Helm - Gestionnaire de packages : installer, configurer et gérer des applications Kubernetes avec des charts"
estimated_time: "90 min"
fiche_number: 10
total_fiches: 12
cursus: "Kubernetes"
---

# 10 - Helm - Gestionnaire de packages

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est Helm, comment il fonctionne (charts, releases, values), installer des applications depuis des dépôts de charts, personnaliser les configurations avec des fichiers values, et créer ton propre chart Helm. Lecture estimée : 90 min.

## Prérequis

- Fiche **[09 - Health checks et autoscaling](09-health-checks-autoscaling.md)**
- Avoir un cluster Minikube démarré et fonctionnel
- Savoir créer des Deployments, Services, ConfigMaps et Secrets
- Avoir Helm installé (`brew install helm`)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Kubernetes  | 1.31+   |
| kubectl     | 1.31+   |
| Minikube    | 1.34+   |
| Helm        | 3.x     |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser Helm pour installer des applications complexes sur Kubernetes en une seule commande, personnaliser les configurations via des fichiers values, et créer tes propres charts pour packager tes applications.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Helm ?

**Définition** : Helm est le gestionnaire de packages de Kubernetes. Il permet d'installer, de mettre à jour et de supprimer des applications Kubernetes à partir de packages préconfigurés appelés **charts**.

**Le problème que Helm résout** :

Sans Helm :

1. **Trop de fichiers YAML** : Déployer une application comme PostgreSQL nécessite plusieurs fichiers YAML (Deployment, Service, ConfigMap, Secret, PVC, ServiceAccount). Tu dois les créer et les gérer un par un.
2. **Pas de paramétrage centralisé** : Si tu veux changer le mot de passe de la base de données, tu dois modifier plusieurs fichiers à différents endroits.
3. **Pas de versioning des déploiements** : Tu ne peux pas facilement revenir à une version précédente de ta configuration. Un `kubectl apply` écrase l'état précédent sans historique.
4. **Pas de réutilisation** : Si tu déploies la même application dans plusieurs environnements (dev, staging, production), tu dois dupliquer tous les fichiers YAML.

**Comment Helm résout ces problèmes** :

| Problème | Solution apportée par Helm |
| -------- | -------------------------- |
| Trop de fichiers YAML | Un chart regroupe tous les fichiers YAML nécessaires dans un seul package |
| Pas de paramétrage centralisé | Un fichier `values.yaml` centralise toutes les variables. Modifier une valeur met à jour tous les templates |
| Pas de versioning | Chaque installation crée une **release** avec un historique. Tu peux revenir à une version précédente avec `helm rollback` |
| Pas de réutilisation | Le même chart peut être installé avec des values différentes pour chaque environnement |

**Analogie concrète** : Helm est comme un installeur de logiciel (par exemple `apt install` sur Linux ou `brew install` sur macOS). Au lieu de télécharger les fichiers source, de les compiler et de les configurer toi-même, tu tapes une seule commande et l'installeur gère tout. Le chart Helm est le package d'installation. Le fichier `values.yaml` est le questionnaire de configuration que tu remplis avant l'installation.

**Ce que Helm n'est PAS** :

- Helm n'est pas un outil de CI/CD. Il installe des applications sur un cluster existant, mais il ne gère pas le pipeline de build ou de test.
- Helm n'est pas obligatoire. Tu peux déployer des applications sans Helm en utilisant directement `kubectl apply`. Helm simplifie la gestion, mais il ajoute une couche d'abstraction.

---

### Les concepts clés de Helm

#### Chart

**Définition** : Un chart est un package Helm. C'est un dossier contenant tous les fichiers nécessaires pour déployer une application sur Kubernetes : les templates YAML, les valeurs par défaut et les métadonnées.

**Structure d'un chart** :

```text
mon-chart/
├── Chart.yaml          # Métadonnées du chart (nom, version, description)
├── values.yaml         # Valeurs par défaut (paramètres configurables)
├── templates/          # Templates YAML Kubernetes
│   ├── deployment.yaml
│   ├── service.yaml
│   ├── configmap.yaml
│   ├── _helpers.tpl    # Fonctions réutilisables dans les templates
│   └── NOTES.txt       # Message affiché après l'installation
└── charts/             # Dépendances (sous-charts)
```

#### Release

**Définition** : Une release est une instance d'un chart installée sur un cluster. Chaque fois que tu installes un chart, Helm crée une release avec un nom unique.

Tu peux installer le même chart plusieurs fois avec des noms de release différents. Par exemple, installer PostgreSQL deux fois : `postgres-dev` et `postgres-prod`.

#### Repository (dépôt)

**Définition** : Un repository est un serveur qui héberge des charts Helm. Le plus connu est **ArtifactHub** (artifact-hub.io), qui référence des milliers de charts maintenus par la communauté.

---

### Le système de templates

**Définition** : Les fichiers dans `templates/` ne sont pas des fichiers YAML classiques. Ils contiennent des directives de template (syntaxe Go) qui sont remplacées par les valeurs de `values.yaml` lors de l'installation.

**Exemple** :

Fichier `values.yaml` :

```yaml
# Nombre de répliques
replicaCount: 3

# Image Docker à utiliser
image:
  repository: nginx
  tag: "1.26"
```

Fichier `templates/deployment.yaml` :

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  # Le nom de la release est injecté automatiquement
  name: {{ .Release.Name }}-app
spec:
  # La valeur vient de values.yaml
  replicas: {{ .Values.replicaCount }}
  template:
    spec:
      containers:
        - name: app
          # Les valeurs imbriquées sont accessibles avec des points
          image: "{{ .Values.image.repository }}:{{ .Values.image.tag }}"
```

Quand tu installes le chart avec `helm install mon-app ./mon-chart`, Helm remplace les `{{ }}` par les valeurs réelles et applique le résultat sur le cluster.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'installation de Helm

```bash
# Vérifie que Helm est installé
helm version
```

**Résultat attendu** :

```text
version.BuildInfo{Version:"v3.x.x", GitCommit:"...", GitTreeState:"clean", GoVersion:"go1.x.x"}
```

```bash
# Vérifie que Minikube tourne
minikube status
```

---

### Étape 2 : Ajouter un dépôt de charts

```bash
# Ajoute le dépôt officiel Bitnami (le plus populaire)
helm repo add bitnami https://charts.bitnami.com/bitnami

# Met à jour la liste des charts disponibles
helm repo update
```

**Résultat attendu** :

```text
"bitnami" has been added to your repositories
Hang tight while we grab the latest from your chart repositories...
...Successfully got an update from the "bitnami" chart repository
Update Complete. ⎈Happy Helming!⎈
```

```bash
# Liste les dépôts configurés
helm repo list
```

**Résultat attendu** :

```text
NAME    URL
bitnami https://charts.bitnami.com/bitnami
```

---

### Étape 3 : Rechercher des charts

```bash
# Recherche les charts contenant "nginx" dans les dépôts configurés
helm search repo nginx
```

**Résultat attendu** :

```text
NAME                    CHART VERSION   APP VERSION   DESCRIPTION
bitnami/nginx           ...             1.x.x         NGINX Open Source is a web server...
bitnami/nginx-ingress   ...             ...           ...
```

```bash
# Affiche les détails d'un chart
helm show chart bitnami/nginx
```

```bash
# Affiche les valeurs par défaut d'un chart (très utile)
helm show values bitnami/nginx
```

Cette dernière commande affiche toutes les valeurs que tu peux personnaliser. C'est la documentation du chart.

---

### Étape 4 : Installer un chart (Nginx)

```bash
# Installe le chart Nginx avec le nom de release "mon-nginx"
helm install mon-nginx bitnami/nginx
```

**Résultat attendu** :

```text
NAME: mon-nginx
LAST DEPLOYED: ...
NAMESPACE: default
STATUS: deployed
REVISION: 1
...
```

```bash
# Vérifie les pods créés
kubectl get pods

# Vérifie les services créés
kubectl get services

# Liste les releases Helm
helm list
```

**Résultat attendu** (helm list) :

```text
NAME       NAMESPACE   REVISION   UPDATED                    STATUS     CHART          APP VERSION
mon-nginx  default     1          2025-...                   deployed   nginx-x.x.x   1.x.x
```

---

### Étape 5 : Personnaliser l'installation avec des values

Crée un fichier `nginx-values.yaml` :

```yaml
# nginx-values.yaml
# Personnalise l'installation de Nginx

# Nombre de répliques
replicaCount: 2

# Limites de ressources
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "200m"
    memory: "256Mi"

# Type de service (NodePort pour accéder depuis l'extérieur de Minikube)
service:
  type: NodePort
```

```bash
# Désinstalle l'ancienne release
helm uninstall mon-nginx

# Réinstalle avec les valeurs personnalisées
helm install mon-nginx bitnami/nginx -f nginx-values.yaml
```

```bash
# Vérifie que les valeurs sont appliquées
kubectl get pods -l app.kubernetes.io/name=nginx

# Vérifie le type de service
kubectl get services
```

**Résultat attendu** :

```text
NAME                     TYPE       CLUSTER-IP      EXTERNAL-IP   PORT(S)        AGE
mon-nginx                NodePort   10.x.x.x       <none>        80:3xxxx/TCP   30s
```

```bash
# Accède à Nginx via Minikube
minikube service mon-nginx --url
```

---

### Étape 6 : Mettre à jour une release

```bash
# Modifie le nombre de répliques dans nginx-values.yaml
# (ou passe la valeur directement en ligne de commande)
helm upgrade mon-nginx bitnami/nginx -f nginx-values.yaml --set replicaCount=3
```

**Résultat attendu** :

```text
Release "mon-nginx" has been upgraded. Happy Helming!
```

```bash
# Vérifie le numéro de révision
helm list
```

**Résultat attendu** :

```text
NAME       NAMESPACE   REVISION   UPDATED   STATUS     CHART          APP VERSION
mon-nginx  default     2          ...       deployed   nginx-x.x.x   1.x.x
```

La REVISION est passée de 1 à 2.

```bash
# Affiche l'historique des révisions
helm history mon-nginx
```

**Résultat attendu** :

```text
REVISION   UPDATED                    STATUS       CHART          APP VERSION   DESCRIPTION
1          ...                        superseded   nginx-x.x.x   1.x.x         Install complete
2          ...                        deployed     nginx-x.x.x   1.x.x         Upgrade complete
```

---

### Étape 7 : Revenir à une version précédente (rollback)

```bash
# Reviens à la révision 1
helm rollback mon-nginx 1
```

**Résultat attendu** :

```text
Rollback was a success! Happy Helming!
```

```bash
# Vérifie : la révision est maintenant 3 (rollback crée une nouvelle révision)
helm history mon-nginx
```

**Résultat attendu** :

```text
REVISION   UPDATED   STATUS       CHART          APP VERSION   DESCRIPTION
1          ...       superseded   nginx-x.x.x   1.x.x         Install complete
2          ...       superseded   nginx-x.x.x   1.x.x         Upgrade complete
3          ...       deployed     nginx-x.x.x   1.x.x         Rollback to 1
```

```bash
# Vérifie que le nombre de répliques est revenu à 2
kubectl get pods -l app.kubernetes.io/name=nginx
```

---

### Étape 8 : Créer ton propre chart

```bash
# Crée un nouveau chart dans le répertoire courant
helm create mon-app
```

Cette commande crée un dossier `mon-app/` avec la structure complète d'un chart.

```bash
# Explore la structure créée
ls -la mon-app/
ls -la mon-app/templates/
```

**Résultat attendu** :

```text
mon-app/
├── Chart.yaml
├── charts/
├── templates/
│   ├── NOTES.txt
│   ├── _helpers.tpl
│   ├── deployment.yaml
│   ├── hpa.yaml
│   ├── ingress.yaml
│   ├── service.yaml
│   ├── serviceaccount.yaml
│   └── tests/
│       └── test-connection.yaml
└── values.yaml
```

---

### Étape 9 : Personnaliser le chart

Modifie le fichier `mon-app/values.yaml` :

```yaml
# mon-app/values.yaml
# Valeurs par défaut pour mon-app

# Nombre de répliques
replicaCount: 2

# Image Docker
image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "1.26"

# Configuration du service
service:
  type: ClusterIP
  port: 80

# Limites de ressources
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "200m"
    memory: "256Mi"

# Autoscaling (désactivé par défaut)
autoscaling:
  enabled: false

# ServiceAccount
serviceAccount:
  create: true
```

```bash
# Vérifie la syntaxe du chart (lint)
helm lint mon-app/
```

**Résultat attendu** :

```text
==> Linting mon-app/
[INFO] Chart.yaml: icon is recommended

1 chart(s) linted, 0 chart(s) failed
```

```bash
# Affiche les manifestes générés sans les appliquer (dry-run)
helm template mon-app-release mon-app/
```

Cette commande est très utile pour vérifier ce que Helm va générer avant de l'installer.

---

### Étape 10 : Installer et tester le chart personnalisé

```bash
# Installe le chart personnalisé
helm install mon-app-release mon-app/

# Vérifie les pods
kubectl get pods -l app.kubernetes.io/name=mon-app

# Vérifie le service
kubectl get services
```

```bash
# Teste avec des valeurs différentes (sans fichier)
helm upgrade mon-app-release mon-app/ --set replicaCount=3 --set service.type=NodePort

# Vérifie
kubectl get pods -l app.kubernetes.io/name=mon-app
kubectl get services
```

---

### Étape 11 : Nettoyer

```bash
# Supprime toutes les releases
helm uninstall mon-nginx
helm uninstall mon-app-release

# Supprime le dossier du chart
rm -rf mon-app/

# Supprime le fichier de values
rm nginx-values.yaml

# Vérifie
helm list
kubectl get all
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `helm version` | Affiche la version de Helm |
| `helm repo add <nom> <url>` | Ajoute un dépôt de charts |
| `helm repo update` | Met à jour la liste des charts |
| `helm search repo <mot-clé>` | Recherche des charts dans les dépôts |
| `helm show values <chart>` | Affiche les valeurs par défaut d'un chart |
| `helm install <release> <chart>` | Installe un chart |
| `helm install <release> <chart> -f values.yaml` | Installe avec des valeurs personnalisées |
| `helm upgrade <release> <chart>` | Met à jour une release |
| `helm rollback <release> <revision>` | Revient à une révision précédente |
| `helm list` | Liste les releases installées |
| `helm history <release>` | Affiche l'historique des révisions |
| `helm uninstall <release>` | Supprime une release |
| `helm create <nom>` | Crée un nouveau chart |
| `helm lint <chart>` | Vérifie la syntaxe d'un chart |
| `helm template <release> <chart>` | Affiche les manifestes générés sans installer |

---

## Pièges Fréquents

### Piège 1 : Oublier de mettre à jour les dépôts

⚠️ **Problème** : `helm install` échoue car le chart n'est pas trouvé, ou une version obsolète est installée.

✅ **Solution** : Exécute toujours `helm repo update` avant d'installer un chart :

```bash
helm repo update
helm install mon-app bitnami/nginx
```

### Piège 2 : Confondre helm install et helm upgrade

⚠️ **Problème** : Tu utilises `helm install` pour mettre à jour une release existante. Helm retourne une erreur "cannot re-use a name that is still in use".

✅ **Solution** : Utilise `helm upgrade` pour mettre à jour une release existante. Si tu veux combiner les deux (installer si la release n'existe pas, mettre à jour sinon), utilise le flag `--install` :

```bash
# Installe ou met à jour selon le cas
helm upgrade --install mon-app bitnami/nginx -f values.yaml
```

### Piège 3 : Ne pas vérifier les values par défaut

⚠️ **Problème** : Tu installes un chart sans regarder les valeurs par défaut. Le chart crée un LoadBalancer (qui ne fonctionne pas sur Minikube) ou utilise trop de ressources.

✅ **Solution** : Consulte toujours les valeurs par défaut avant d'installer :

```bash
# Affiche toutes les valeurs configurables
helm show values bitnami/nginx
```

Puis crée un fichier `values.yaml` avec les valeurs adaptées à ton environnement.

### Piège 4 : Les pods restent en Pending après l'installation

⚠️ **Problème** : Après `helm install`, les pods sont en status `Pending` car le chart demande plus de ressources (CPU, mémoire, stockage) que Minikube ne peut fournir.

✅ **Solution** : Réduis les ressources dans tes values :

```yaml
resources:
  requests:
    cpu: "100m"
    memory: "128Mi"
  limits:
    cpu: "200m"
    memory: "256Mi"
```

---

## Checklist de Validation

- [ ] Je comprends ce qu'est un chart, une release et un repository Helm
- [ ] Je sais ajouter un dépôt et rechercher des charts
- [ ] Je sais installer un chart avec des valeurs par défaut
- [ ] Je sais personnaliser une installation avec un fichier values.yaml
- [ ] Je sais mettre à jour une release avec `helm upgrade`
- [ ] Je sais revenir à une version précédente avec `helm rollback`
- [ ] Je sais créer un chart personnalisé avec `helm create`
- [ ] Je sais vérifier un chart avec `helm lint` et `helm template`

---

## Exercice Pratique

**Énoncé** : Installe et configure une application avec Helm, puis crée ton propre chart.

1. Ajoute le dépôt Bitnami
2. Installe le chart `bitnami/nginx` avec le nom de release `web-server`
3. Crée un fichier `custom-values.yaml` avec :
   - 3 répliques
   - Service de type NodePort
   - Requests : 50m CPU, 64Mi mémoire
   - Limits : 150m CPU, 128Mi mémoire
4. Mets à jour la release avec ces valeurs personnalisées
5. Vérifie que 3 pods tournent et que le service est de type NodePort
6. Fais un rollback vers la révision 1
7. Vérifie que le nombre de répliques est revenu à 1
8. Crée un chart personnalisé `exercice-chart` avec `helm create`
9. Modifie le `values.yaml` pour utiliser l'image `nginx:1.26` avec 2 répliques
10. Installe le chart et vérifie qu'il fonctionne
11. Supprime tout

**Indications** :

- Utilise `helm show values bitnami/nginx` pour trouver les noms des valeurs
- Utilise `helm template` pour vérifier avant d'installer
- N'oublie pas `helm repo update` avant l'installation

**Résultat attendu** : Deux releases installées et fonctionnelles, puis tout supprimé proprement.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# 1. Ajoute le dépôt
helm repo add bitnami https://charts.bitnami.com/bitnami
helm repo update

# 2. Installe Nginx
helm install web-server bitnami/nginx
```

Crée le fichier `custom-values.yaml` :

```yaml
# custom-values.yaml
replicaCount: 3

service:
  type: NodePort

resources:
  requests:
    cpu: "50m"
    memory: "64Mi"
  limits:
    cpu: "150m"
    memory: "128Mi"
```

```bash
# 4. Mets à jour avec les valeurs personnalisées
helm upgrade web-server bitnami/nginx -f custom-values.yaml

# 5. Vérifie
kubectl get pods -l app.kubernetes.io/name=nginx
kubectl get services

# 6. Rollback vers la révision 1
helm rollback web-server 1

# 7. Vérifie le nombre de répliques
kubectl get pods -l app.kubernetes.io/name=nginx
helm history web-server

# 8. Crée un chart personnalisé
helm create exercice-chart
```

Modifie `exercice-chart/values.yaml` :

```yaml
# exercice-chart/values.yaml (les valeurs importantes à modifier)
replicaCount: 2

image:
  repository: nginx
  pullPolicy: IfNotPresent
  tag: "1.26"

service:
  type: ClusterIP
  port: 80
```

```bash
# 9-10. Vérifie et installe
helm lint exercice-chart/
helm template exercice-release exercice-chart/
helm install exercice-release exercice-chart/

# Vérifie
kubectl get pods -l app.kubernetes.io/name=exercice-chart
kubectl get services

# 11. Supprime tout
helm uninstall web-server
helm uninstall exercice-release
rm -rf exercice-chart/
rm custom-values.yaml
```

---

## Navigation

← Fiche précédente : **[09 - Health checks et autoscaling](09-health-checks-autoscaling.md)**

→ Fiche suivante : **[11 - Déployer Symfony sur Kubernetes](11-deployer-symfony-kubernetes.md)**
