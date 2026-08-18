---
tags:
  - OpenShift
  - Débutant
  - Pratique
description: "Déployer une Application"
estimated_time: "90 min"
fiche_number: 3
total_fiches: 6
cursus: "OpenShift"
---

# 03 - Déployer une Application

> **En bref** : À la fin de cette fiche, tu sauras déployer une application sur OpenShift via la CLI oc, des fichiers YAML, et Source-to-Image (S2I). Lecture estimée : 90 min.


## Prérequis

- Avoir lu la fiche [02 - Installer un Cluster Local avec CRC](./02-installation-crc.md)
- CRC démarré et `oc login` effectué (tu es connecté au cluster)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| OpenShift   | 4.14+   |
| PHP         | 8.3     |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déployer une application sur OpenShift via la CLI `oc`, des fichiers YAML, et Source-to-Image (S2I).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un Project OpenShift ?

**Définition** : Un Project est un espace isolé sur OpenShift qui regroupe toutes les ressources d'une application (pods, services, routes, builds). C'est l'équivalent d'un Namespace Kubernetes avec des fonctionnalités supplémentaires.

**Le problème que les Projects résolvent** :

Sans Projects, voici les problèmes rencontrés :

1. **Mélange des ressources** : Plusieurs équipes déploient sur le même cluster. Leurs pods, services et configurations se mélangent.
2. **Pas d'isolation** : Une équipe peut accidentellement modifier ou supprimer les ressources d'une autre équipe.
3. **Pas de limites** : Une application qui consomme trop de mémoire ou de CPU affecte toutes les autres.

**Comment les Projects résolvent ces problèmes** :

| Problème               | Solution apportée par les Projects                                       |
| ---------------------- | ------------------------------------------------------------------------ |
| Mélange des ressources | Chaque Project est un espace séparé avec ses propres ressources          |
| Pas d'isolation        | Les Projects sont isolés par défaut : isolation réseau et droits d'accès |
| Pas de limites         | Chaque Project peut avoir des quotas de CPU, mémoire et nombre de pods   |

**Analogie concrète** : Un Project est comme un casier personnel dans un vestiaire. Chaque personne a son propre casier avec une clé. Tu ranges tes affaires dans ton casier, et personne d'autre ne peut y toucher. Le vestiaire (le cluster) contient tous les casiers (les Projects), mais chacun est indépendant.

**Ce qu'un Project n'est PAS** :

- Un Project n'est pas un serveur séparé. Tous les Projects partagent le même cluster physique. L'isolation est logique (logicielle), pas physique (matérielle).
- Un Project n'est pas permanent par défaut. Si tu supprimes un Project, toutes les ressources qu'il contient sont supprimées.

**Comparaison Project OpenShift vs Namespace Kubernetes** :

| Project OpenShift                          | Namespace Kubernetes                |
| ------------------------------------------ | ----------------------------------- |
| Isolation réseau par défaut entre Projects | Pas d'isolation réseau par défaut   |
| Quotas et limites intégrés                 | Quotas possibles mais manuels       |
| Gestion des droits via RBAC intégré        | RBAC disponible mais plus manuel    |
| Commande `oc new-project`                  | Commande `kubectl create namespace` |

---

### Les 3 méthodes de déploiement sur OpenShift

**Définition** : OpenShift propose trois méthodes pour déployer une application. Chaque méthode offre un niveau différent de contrôle et de simplicité.

**Le problème que ces méthodes résolvent** :

Sans ces méthodes, déployer une application nécessite d'écrire manuellement plusieurs fichiers de configuration :

1. **Écriture manuelle complexe** : Il faut écrire un Deployment, un Service, une Route, et, si l'application nécessite un build S2I, un BuildConfig. Chaque fichier a sa propre syntaxe YAML.
2. **Risque d'erreur** : Un espace mal placé dans un fichier YAML empêche le déploiement.
3. **Lenteur** : Écrire et tester tous ces fichiers à la main prend du temps.

**Comment les 3 méthodes résolvent ces problèmes** :

| Problème            | Solution                                                                       |
| ------------------- | ------------------------------------------------------------------------------ |
| Écriture complexe   | Méthode 2 (`oc new-app`) génère automatiquement tous les fichiers nécessaires  |
| Risque d'erreur     | Méthode 3 (S2I) détecte automatiquement le langage et configure le déploiement |
| Lenteur             | Méthode 2 et 3 déploient en une seule commande                                |

**Les 3 méthodes en détail** :

| Critère        | Méthode 1 : fichiers YAML      | Méthode 2 : `oc new-app`       | Méthode 3 : S2I                          |
| -------------- | ------------------------------- | ------------------------------- | ----------------------------------------- |
| Principe       | Tu écris les fichiers toi-même | OpenShift génère les ressources | OpenShift construit l'image depuis le code |
| Contrôle       | Total                          | Moyen                          | Faible (automatisé)                       |
| Simplicité     | Faible (beaucoup de YAML)      | Élevée (une commande)          | Très élevée (pas de Dockerfile)           |
| Cas d'usage    | Production, config fines       | Prototypage rapide, tests      | Déploiement depuis du code source         |
| Quand utiliser | Tu veux un contrôle précis     | Tu veux déployer une image     | Tu as du code source sans Dockerfile      |

**Analogie concrète** : Imagine que tu veuilles manger un repas.

- **Méthode 1 (YAML)** : Tu achètes chaque ingrédient et suis la recette toi-même. C'est plus long, mais tu contrôles tout.
- **Méthode 2 (`oc new-app`)** : Tu commandes un plat préparé au restaurant. Tu choisis le plat, mais pas chaque ingrédient.
- **Méthode 3 (S2I)** : Tu déposes tes ingrédients dans un robot cuiseur automatique. Tu appuies sur un bouton, la machine prépare le plat pour toi.

**Ce que ces méthodes ne sont PAS** :

- Ces méthodes ne sont pas exclusives. Tu peux utiliser `oc new-app` pour créer les ressources initiales, puis modifier les fichiers YAML générés.
- Ces méthodes ne sont pas spécifiques à un langage. Tu peux déployer du PHP, du Python, du Node.js ou du Java avec chacune.

Le schéma suivant illustre les trois méthodes de déploiement et leur chemin vers un Pod :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-02-openshift-03-déploiement-application-1.html">Les 3 méthodes de déploiement sur OpenShift (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-02-openshift-03-déploiement-application-1.html" title="Les 3 méthodes de déploiement sur OpenShift" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Chaque méthode aboutit à un Pod en cours d'exécution. La méthode 1 offre un contrôle total, la méthode 2 automatise la création des ressources, et la méthode 3 construit l'image directement depuis le code source.

---

### Qu'est-ce que Source-to-Image (S2I) ?

**Définition** : S2I est un mécanisme spécifique à OpenShift qui prend ton code source et une image builder, puis produit automatiquement une image de conteneur prête à déployer. Tu n'as pas besoin d'écrire un Dockerfile.

**Le problème que S2I résout** :

Sans S2I, voici les problèmes rencontrés :

1. **Écrire un Dockerfile correct** : Il faut choisir l'image de base, installer les dépendances, configurer le serveur, gérer les permissions. Une erreur produit une image qui ne fonctionne pas.
2. **Sécurité des images** : Un Dockerfile de débutant contient souvent des failles : exécution en root, dépendances inutiles, secrets exposés.
3. **Reproductibilité** : Chaque développeur écrit son Dockerfile différemment. Le résultat varie d'un développeur à l'autre.

**Comment S2I résout ces problèmes** :

| Problème          | Solution apportée par S2I                                                   |
| ----------------- | --------------------------------------------------------------------------- |
| Écrire Dockerfile | S2I n'en a pas besoin. Il détecte le langage et configure tout              |
| Sécurité          | Les builder images sont maintenues par Red Hat avec les bonnes pratiques    |
| Reproductibilité  | Le même builder produit toujours le même résultat pour le même code source  |

**Ce que S2I prend en charge automatiquement** :

- Détection du langage (PHP, Python, Node.js, Ruby, Java, Go)
- Installation des dépendances (`composer install`, `npm install`, `pip install`)
- Configuration du serveur web (Apache pour PHP, serveur intégré pour Node.js)
- Configuration de sécurité (exécution en non-root)

**Langages supportés par les builder images officielles** :

| Langage | Image builder      | Versions (varient selon la version d'OpenShift) |
| ------- | ------------------ | ----------------------------------------------- |
| PHP     | `php`              | 8.0, 8.1, 8.2 (8.3 sur OCP 4.15+)             |
| Python  | `python`           | 3.9, 3.11                                       |
| Node.js | `nodejs`           | 18, 20                                           |
| Ruby    | `ruby`             | 3.1, 3.2                                         |
| Java    | `java` / `openjdk` | 11, 17                                           |

**Note** : Les versions exactes dépendent de ta version d'OpenShift. Pour voir les builder images disponibles sur ton cluster : `oc get is -n openshift`.

**Analogie concrète** : S2I fonctionne comme une machine à pain automatique. Tu mets les ingrédients (ton code source), tu choisis le programme (l'image builder PHP/Python/Node.js), et la machine produit le pain (l'image de conteneur). Tu n'as pas besoin de connaître la recette exacte (le Dockerfile).

**Ce que S2I n'est PAS** :

- S2I n'est pas magique. Il utilise des builder images prédéfinies. Si ton projet a des besoins très spécifiques (compilation C++, dépendances système inhabituelles), S2I peut ne pas suffire.
- S2I n'est pas disponible pour tous les langages. Seuls ceux qui ont une builder image officielle sont supportés.
- S2I n'est pas un standard Kubernetes. C'est une fonctionnalité spécifique à OpenShift.

**Comparaison déploiement classique (Dockerfile) vs S2I** :

| Critère                | Déploiement avec Dockerfile           | Déploiement avec S2I                  |
| ---------------------- | ------------------------------------- | ------------------------------------- |
| Dockerfile requis      | Oui (tu l'écris toi-même)            | Non (S2I gère tout)                   |
| Connaissances requises | Conteneurisation, Docker, Linux       | Aucune (juste ton code source)        |
| Sécurité               | Dépend de ton Dockerfile              | Builder images sécurisées par Red Hat |
| Personnalisation       | Totale                                | Limitée aux options du builder        |
| Temps de mise en place | Long (écrire + tester le Dockerfile)  | Court (une seule commande)            |

---

### Deployment vs DeploymentConfig

**Définition** : Un Deployment est la ressource Kubernetes standard qui gère le déploiement d'une application. Un DeploymentConfig est l'ancienne ressource spécifique à OpenShift qui remplissait le même rôle.

**Le problème que cette distinction résout** :

Sans comprendre cette distinction, voici les problèmes rencontrés :

1. **Confusion documentation** : Certains tutoriels utilisent DeploymentConfig, d'autres Deployment. Sans savoir lequel choisir, tu risques d'utiliser une ressource obsolète.
2. **Incompatibilité** : DeploymentConfig n'existe pas dans Kubernetes standard. Si tu migres, tes fichiers ne fonctionneront pas.
3. **Fonctionnalités manquantes** : DeploymentConfig ne supporte pas certaines fonctionnalités récentes de Kubernetes.

**Comment cette distinction résout ces problèmes** :

| Problème              | Solution                                                                   |
| --------------------- | -------------------------------------------------------------------------- |
| Confusion             | Règle claire : utilise toujours Deployment (standard Kubernetes)           |
| Incompatibilité       | Deployment fonctionne sur Kubernetes et OpenShift                          |
| Fonctionnalités       | Deployment est activement développé et reçoit les nouvelles fonctionnalités |

**Analogie concrète** : DeploymentConfig est comme un ancien modèle de téléphone portable. Il fonctionne encore, mais il ne reçoit plus de mises à jour. Deployment est le modèle actuel : maintenu, compatible avec tous les outils récents.

**Comparaison Deployment vs DeploymentConfig** :

| Critère               | Deployment (recommandé)               | DeploymentConfig (legacy)            |
| --------------------- | ------------------------------------- | ------------------------------------ |
| Standard              | Kubernetes natif                      | Spécifique à OpenShift               |
| `oc new-app` crée     | Par défaut depuis OpenShift 4.5       | Était le défaut avant 4.5            |
| Portabilité           | Fonctionne sur K8s et OpenShift       | Fonctionne uniquement sur OpenShift  |
| Rollback              | `oc rollout undo`                     | `oc rollback`                        |
| Statut                | Activement maintenu                   | Déprécié (sera supprimé à terme)     |

**Ce que Deployment n'est PAS** :

- Un Deployment n'est pas un Pod. Un Deployment gère un ou plusieurs Pods. Il décide combien de Pods doivent tourner et les recrée si l'un d'eux plante.
- Un Deployment n'est pas un Service. Un Deployment gère les Pods (les conteneurs). Un Service gère le réseau (comment accéder aux Pods).

---

## Étapes Pratiques

### Étape 1 : Créer un Project

```bash
# Crée un nouveau Project nommé "demo-deploiement"
oc new-project demo-deploiement
```

**Résultat attendu** :

```text
Now using project "demo-deploiement" on server "https://api.crc.testing:6443".
```

Vérifie que tu es dans le bon Project :

```bash
# Affiche le Project actif
oc project
```

**Résultat attendu** :

```text
Using project "demo-deploiement" on server "https://api.crc.testing:6443".
```

---

### Étape 2 : Méthode 1 - Déploiement via fichiers YAML

Cette méthode te donne un contrôle total. Tu écris toi-même le fichier de configuration.

Crée un fichier `deployment.yaml` avec le contenu suivant :

```yaml
# deployment.yaml - Déploiement Kubernetes pour Nginx
apiVersion: apps/v1        # Version de l'API Kubernetes utilisée
kind: Deployment           # Type de ressource : un Deployment
metadata:
  name: nginx-yaml         # Nom du Deployment (unique dans le Project)
  labels:
    app: nginx-yaml        # Étiquette pour identifier ce Deployment
spec:
  replicas: 1              # Nombre de Pods à créer (1 seul Pod)
  selector:
    matchLabels:
      app: nginx-yaml      # Le Deployment gère les Pods avec cette étiquette
  template:
    metadata:
      labels:
        app: nginx-yaml    # Étiquette appliquée à chaque Pod créé
    spec:
      containers:
        - name: nginx                            # Nom du conteneur dans le Pod
          image: docker.io/nginxinc/nginx-unprivileged:alpine  # Image Nginx non-root (compatible SCC restricted-v2)
          ports:
            - containerPort: 8080                # Port d'écoute (8080 car non-root)
```

Applique ce fichier sur le cluster :

```bash
# Envoie le fichier YAML au cluster pour créer les ressources
oc apply -f deployment.yaml
```

**Résultat attendu** :

```text
deployment.apps/nginx-yaml created
```

Vérifie que le Pod a été créé :

```bash
# Liste les Pods du Project actif
oc get pods
```

**Résultat attendu** :

```text
NAME                          READY   STATUS    RESTARTS   AGE
nginx-yaml-7d4b8c9f5-x2k9m   1/1     Running   0          15s
```

Le Pod est en `Running` : Nginx tourne dans le cluster.

---

### Étape 3 : Méthode 2 - Déploiement via oc new-app

Cette méthode génère automatiquement les ressources nécessaires à partir d'une image de conteneur.

```bash
# Crée un déploiement à partir d'une image Nginx non-root
oc new-app --image=docker.io/nginxinc/nginx-unprivileged:alpine --name=nginx-auto
```

**Résultat attendu** :

```text
--> Found container image abc1234 from docker.io for "docker.io/library/nginx:alpine"
--> Creating resources ...
    imagestream.image.openshift.io "nginx-auto" created
    deployment.apps "nginx-auto" created
    service "nginx-auto" created
--> Success
    Run 'oc status' to view your app.
```

OpenShift a créé automatiquement trois ressources :

- **ImageStream** : référence vers l'image Nginx (suivi des versions)
- **Deployment** : gestion du Pod qui fait tourner Nginx
- **Service** : point d'accès réseau interne vers le Pod

Vérifie les ressources créées avec `oc get all`. Tu verras un Pod, un Service et un Deployment pour `nginx-auto`, plus le `nginx-yaml` de l'étape précédente.

---

### Étape 4 : Méthode 3 - Déploiement via S2I

Cette méthode construit une image de conteneur directement à partir de ton code source.

**Préparer le code source** :

```bash
# Crée un dossier pour le projet PHP
mkdir -p /tmp/php-s2i
```

Crée le fichier `/tmp/php-s2i/index.php` avec le contenu suivant :

```php
<?php
// Affiche un message de bienvenue
echo "Hello OpenShift ! Déployé avec S2I.";
```

**Lancer le déploiement S2I** :

```bash
# Déploie l'application PHP avec S2I
# php:8.3 : utilise le builder PHP version 8.3
# /tmp/php-s2i : chemin vers le code source local
oc new-app php:8.3~/tmp/php-s2i --name=php-s2i
```

Le caractère `~` (tilde) est la syntaxe S2I. Il signifie : "utilise le builder `php:8.3` pour construire le code source situé à `/tmp/php-s2i`".

**Variante** : si ton code source est dans un dépôt Git, remplace le chemin local par l'URL : `oc new-app php:8.3~https://github.com/ton-compte/ton-projet.git --name=php-s2i-git`

**Résultat attendu** :

```text
--> Found image abc1234 in image stream "openshift/php" under tag "8.3" for "php:8.3"
--> Creating resources ...
    imagestream.image.openshift.io "php-s2i" created
    buildconfig.build.openshift.io "php-s2i" created
    deployment.apps "php-s2i" created
    service "php-s2i" created
--> Success
```

Lance le build avec le code source local :

```bash
# Lance le build en envoyant le code source local au cluster
# --follow : affiche les logs du build en temps réel
oc start-build php-s2i --from-dir=/tmp/php-s2i --follow
```

**Résultat attendu** :

```text
Uploading directory "/tmp/php-s2i" as binary input for the build ...
---> Installing application source...
---> 'php-s2i-1' : Build complete.
Pushing image image-registry.openshift-image-registry.svc:5000/demo-deploiement/php-s2i:latest ...
Push successful
```

Vérifie que le Pod tourne :

```bash
# Liste les Pods
oc get pods
```

**Résultat attendu** :

```text
NAME                          READY   STATUS      RESTARTS   AGE
nginx-auto-6f8b9c7d4-h3j5k   1/1     Running     0          10m
nginx-yaml-7d4b8c9f5-x2k9m   1/1     Running     0          15m
php-s2i-1-build               0/1     Completed   0          2m
php-s2i-5d8f9b7c6-t4w2n      1/1     Running     0          45s
```

Le Pod `php-s2i-1-build` (`Completed`) est le Pod de build. Le Pod `php-s2i-...` (`Running`) est l'application PHP.

---

### Étape 5 : Vérifier le déploiement

**Lister les Deployments** :

```bash
oc get deployments
```

**Résultat attendu** :

```text
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
nginx-auto   1/1     1            1           12m
nginx-yaml   1/1     1            1           17m
php-s2i      1/1     1            1           4m
```

`READY 1/1` signifie : 1 Pod demandé, 1 Pod prêt.

**Afficher les détails d'un Pod** :

```bash
# Remplace le nom du Pod par celui affiché dans oc get pods
oc describe pod php-s2i-5d8f9b7c6-t4w2n
```

La commande `oc describe` affiche le status, l'IP interne, le port d'écoute et l'historique des événements du Pod. Les builder images S2I utilisent le port 8080 par défaut (pas le port 80).

**Afficher les logs d'un Pod** :

```bash
oc logs php-s2i-5d8f9b7c6-t4w2n
```

Les logs montrent qu'Apache a démarré avec PHP 8.3. Pour vérifier les logs du build S2I : `oc logs buildconfig/php-s2i`.

---

### Étape 6 : Nettoyer

```bash
# Supprime le Project et toutes ses ressources
oc delete project demo-deploiement
```

Cette commande supprime tous les Pods, Deployments, Services, BuildConfigs et ImageStreams du Project. Vérifie avec `oc projects` que le Project n'apparaît plus.

---

## Commandes Utiles

| Commande                                     | Action                                                  |
| -------------------------------------------- | ------------------------------------------------------- |
| `oc new-project <nom>`                       | Crée un nouveau Project                                 |
| `oc project`                                 | Affiche le Project actif                                |
| `oc project <nom>`                           | Change de Project actif                                 |
| `oc new-app --image=<image> --name=<nom>`    | Déploie depuis une image de conteneur                   |
| `oc new-app <builder>~<source> --name=<nom>` | Déploie via S2I depuis du code source                   |
| `oc apply -f <fichier.yaml>`                 | Applique un fichier de configuration YAML               |
| `oc get pods`                                | Liste les Pods du Project actif                         |
| `oc get deployments`                         | Liste les Deployments du Project actif                  |
| `oc get all`                                 | Liste toutes les ressources du Project actif            |
| `oc describe pod <nom>`                      | Affiche les détails d'un Pod                            |
| `oc logs <nom-du-pod>`                       | Affiche les logs d'un Pod                               |
| `oc logs buildconfig/<nom>`                  | Affiche les logs d'un build S2I                         |
| `oc logs -f buildconfig/<nom>`               | Suit les logs d'un build en temps réel                  |
| `oc start-build <nom> --from-dir=<chemin>`   | Lance un build S2I avec du code source local            |
| `oc status`                                  | Affiche l'état global du Project                        |
| `oc delete project <nom>`                    | Supprime un Project et toutes ses ressources            |
| `oc delete all --selector app=<nom>`         | Supprime toutes les ressources liées à une application  |

---

## Pièges Fréquents

### Piège 1 : L'image doit tourner en non-root (SCC restrictif)

**Problème** : Tu déploies une image et le Pod reste en `CrashLoopBackOff`. Les logs affichent :

```text
Permission denied
```

**Explication** : OpenShift applique par défaut une politique de sécurité (SCC) qui interdit l'exécution en tant que root. Beaucoup d'images Docker officielles (comme `nginx:latest`) tentent de s'exécuter en root, ce qui est refusé.

**Solution** : Utilise des images qui supportent l'exécution en non-root :

```bash
# L'image Bitnami Nginx tourne en non-root :
oc new-app --image=docker.io/bitnami/nginx:latest --name=nginx-ok
```

Les builder images S2I (PHP, Python, Node.js) sont toutes configurées pour tourner en non-root.

---

### Piège 2 : oc new-app échoue car le registre n'est pas accessible

**Problème** : Tu obtiens cette erreur :

```text
error: unable to locate any images in image streams, local docker images with name "..."
```

**Explication** : OpenShift n'arrive pas à télécharger l'image (problème réseau, registre privé, faute de frappe).

**Solution** : Vérifie que l'image est correcte :

```bash
# Vérifie que l'image existe sur ta machine locale
podman pull docker.io/library/nginx:alpine
```

Pour un registre privé, crée un secret d'authentification :

```bash
oc create secret docker-registry mon-secret \
  --docker-server=mon-registre.example.com \
  --docker-username=mon-utilisateur \
  --docker-password=mon-mot-de-passe
oc secrets link default mon-secret --for=pull
```

---

### Piège 3 : Le build S2I échoue

**Problème** : Le Pod de build affiche `Error` ou `Failed`.

**Solution** : Consulte toujours les logs du build en premier :

```bash
oc logs buildconfig/php-s2i
```

Les erreurs les plus fréquentes :

| Erreur dans les logs            | Cause probable                             | Solution                               |
| ------------------------------- | ------------------------------------------ | -------------------------------------- |
| `composer install failed`       | `composer.json` invalide                   | Vérifie ton `composer.json` localement |
| `npm install failed`            | `package.json` invalide                    | Vérifie ton `package.json` localement  |
| `No such file or directory`     | Code source mal envoyé                     | Vérifie le chemin dans `--from-dir`    |
| `Permission denied`             | Problème de droits sur les fichiers source | Vérifie les permissions des fichiers   |

Pour relancer un build après correction :

```bash
oc start-build php-s2i --from-dir=/tmp/php-s2i --follow
```

---

### Piège 4 : Utiliser DeploymentConfig au lieu de Deployment

**Problème** : Tu suis un ancien tutoriel et tu crées un fichier YAML avec `kind: DeploymentConfig`.

**Explication** : DeploymentConfig est déprécié depuis OpenShift 4.14.

**Solution** : Utilise toujours `kind: Deployment` dans tes fichiers YAML :

| Ancien (DeploymentConfig)          | Nouveau (Deployment)                  |
| ---------------------------------- | ------------------------------------- |
| `apiVersion: apps.openshift.io/v1` | `apiVersion: apps/v1`                 |
| `kind: DeploymentConfig`           | `kind: Deployment`                    |
| `spec.triggers`                    | À supprimer (pas supporté)            |
| `oc rollback`                      | `oc rollout undo deployment/<nom>`    |

---

## Checklist de Validation

- [ ] J'ai créé un Project avec `oc new-project` et vérifié avec `oc project`
- [ ] J'ai déployé via un fichier YAML (méthode 1) et le Pod est en `Running`
- [ ] J'ai déployé via `oc new-app` (méthode 2) et le Pod est en `Running`
- [ ] J'ai déployé via S2I (méthode 3) et le build s'est terminé avec succès
- [ ] Je sais utiliser `oc get pods`, `oc describe pod` et `oc logs` pour vérifier un déploiement
- [ ] Je comprends la différence entre Deployment et DeploymentConfig
- [ ] Je sais nettoyer avec `oc delete project`
- [ ] Je comprends ce que fait le caractère `~` dans la syntaxe S2I (`builder~source`)

---

## Exercice Pratique

**Énoncé** : Déploie une application PHP via S2I qui affiche "Hello OpenShift". Crée un fichier `index.php`, utilise `oc new-app` avec le builder PHP 8.3, vérifie les logs du build, puis vérifie que le Pod fonctionne.

**Indications** :

- Crée un nouveau Project nommé `exercice-s2i`
- Crée un dossier `/tmp/exercice-php` contenant un fichier `index.php`
- Utilise la syntaxe `php:8.3~<chemin>` pour le builder S2I
- Utilise `oc start-build <nom> --from-dir=<chemin> --follow` pour lancer le build
- Vérifie l'état des Pods avec `oc get pods`
- Lis les logs avec `oc logs <nom-du-pod>`
- Nettoie le Project à la fin

**Résultat attendu** :

- Le build S2I se termine avec `Push successful`
- Le Pod `exercice-php-...` est en `Running`
- Les logs du Pod montrent qu'Apache est démarré avec PHP 8.3

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 : Créer le Project**

```bash
oc new-project exercice-s2i
```

**Résultat attendu** :

```text
Now using project "exercice-s2i" on server "https://api.crc.testing:6443".
```

---

**Partie 2 : Créer le code source PHP**

```bash
mkdir -p /tmp/exercice-php
```

Crée le fichier `/tmp/exercice-php/index.php` :

```php
<?php
// Point d'entrée de l'application
// Le builder S2I PHP le détectera automatiquement
echo "Hello OpenShift";
```

---

**Partie 3 : Déployer avec S2I et lancer le build**

```bash
# Crée les ressources S2I
oc new-app php:8.3~/tmp/exercice-php --name=exercice-php

# Lance le build en envoyant le code source
oc start-build exercice-php --from-dir=/tmp/exercice-php --follow
```

Le build se termine par `Push successful`.

---

**Partie 4 : Vérifier et nettoyer**

```bash
# Vérifie que le Pod tourne
oc get pods
# Le Pod exercice-php-... doit être en Running

# Vérifie les logs (remplace le nom du Pod par le tien)
oc logs exercice-php-6b8f9c7d4-m3k7p
# Apache doit afficher qu'il est démarré avec PHP 8.3

# Nettoie
oc delete project exercice-s2i
rm -rf /tmp/exercice-php
```

---

**Récapitulatif des commandes de l'exercice** :

| Étape                      | Commande                                                            |
| -------------------------- | ------------------------------------------------------------------- |
| Créer le Project           | `oc new-project exercice-s2i`                                       |
| Créer le dossier source    | `mkdir -p /tmp/exercice-php`                                        |
| Déployer avec S2I          | `oc new-app php:8.3~/tmp/exercice-php --name=exercice-php`          |
| Lancer le build            | `oc start-build exercice-php --from-dir=/tmp/exercice-php --follow` |
| Vérifier les Pods          | `oc get pods`                                                       |
| Voir les logs du Pod       | `oc logs <nom-du-pod>`                                              |
| Nettoyer                   | `oc delete project exercice-s2i`                                    |

---

## Navigation

← Fiche précédente : **[Installer un Cluster Local avec CRC](02-installation-crc.md)**

→ Fiche suivante : **[Routes et Services](04-routes-services.md)**
