---
tags:
  - OpenShift
  - Intermédiaire
  - Pratique
description: "Builds et ImageStreams"
estimated_time: "145 min"
fiche_number: 5
total_fiches: 6
cursus: "OpenShift"
id: "infrastructure.openshift.builds-imagestreams"
course_id: "infrastructure.openshift"
content_type: "lesson"
order: 5
---

# 05 - Builds et ImageStreams

> **En bref** : À la fin de cette fiche, tu sauras créer des BuildConfigs pour construire des images de conteneurs directement dans le cluster OpenShift, et utiliser les ImageStreams pour suivre les versions d'images et déclencher des mises à jour automatiques. Lecture estimée : 145 min.


## Prérequis

- Fiche [04 - Routes et Services](04-routes-services.md) lue et comprise
- Fiche [02 - Images et Conteneurs (Podman)](../01-podman/02-images-conteneurs.md) lue et comprise (pour le concept de Containerfile)
- Savoir utiliser `oc` en ligne de commande (connexion au cluster, création de projets)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| OpenShift | 4.14+ |
| PHP | 8.3 |
| oc (CLI) | 4.14+ |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des BuildConfigs pour construire des images de conteneurs directement dans le cluster OpenShift, et utiliser les ImageStreams pour suivre les versions d'images et déclencher des mises à jour automatiques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une BuildConfig ?

**Définition** : Une BuildConfig est une ressource OpenShift qui décrit comment construire une image de conteneur à l'intérieur du cluster. Elle contient les instructions de construction (source du code, stratégie de build, image de sortie).

**Le problème que la BuildConfig résout** :

Sans BuildConfig, voici les problèmes rencontrés :

1. **Construction manuelle** : Tu dois construire chaque image sur ta machine locale avec `podman build`, puis pousser l'image vers un registre distant avec `podman push`. Cela prend du temps et nécessite une connexion au registre.

2. **Pas de reproductibilité** : Chaque développeur construit l'image sur sa propre machine, avec des versions différentes des outils. Le résultat peut varier d'une machine à l'autre.

3. **Pas d'automatisation** : Si tu veux reconstruire l'image après chaque modification du code, tu dois répéter les mêmes commandes à chaque fois. Rien ne se fait automatiquement.

**Comment la BuildConfig résout ces problèmes** :

| Problème | Solution apportée par la BuildConfig |
| --- | --- |
| Construction manuelle | OpenShift construit l'image directement dans le cluster, sans passer par ta machine |
| Pas de reproductibilité | Le build s'exécute toujours dans le même environnement (le cluster), avec les mêmes outils |
| Pas d'automatisation | La BuildConfig peut déclencher un build automatiquement quand le code change ou quand l'image de base est mise à jour |

**Les trois stratégies de build** :

OpenShift propose trois façons de construire une image. Chaque stratégie correspond à un cas d'usage différent.

| Stratégie | Entrée | Sortie | Complexité | Cas d'usage |
| --- | --- | --- | --- | --- |
| Source (S2I) | Code source + builder image | Image prête à l'emploi | Faible | Applications standard (PHP, Node.js, Python) |
| Docker | Containerfile/Dockerfile | Image personnalisée | Moyenne | Besoins spécifiques, contrôle total du Containerfile |
| Custom | Script personnalisé | Selon le script | Élevée | Cas très spécifiques (rarement utilisé) |

**Détail de chaque stratégie** :

1. **Source-to-Image (S2I)** : Tu fournis uniquement ton code source et tu choisis une image builder (par exemple `php:8.3`). OpenShift combine automatiquement le code et l'image builder pour produire une image finale. Tu n'écris pas de Containerfile.

2. **Docker** : Tu fournis un Containerfile (ou Dockerfile). OpenShift exécute les instructions du Containerfile pour construire l'image, exactement comme `podman build` le ferait sur ta machine.

3. **Custom** : Tu fournis un script qui s'exécute dans un conteneur que tu définis. Cette stratégie est rarement utilisée et ne sera pas détaillée dans cette fiche.

**Analogie concrète** : Une BuildConfig fonctionne comme les instructions d'une imprimerie. La BuildConfig décrit ce qu'il faut imprimer (le code source), dans quel format (la stratégie de build), et quelle reliure utiliser (l'image de base). À chaque commande d'impression (un build), l'imprimerie produit un exemplaire du livre (une image de conteneur). Tu peux relancer la commande autant de fois que nécessaire, et chaque exemplaire sera identique.

**Ce qu'une BuildConfig n'est PAS** :

- Une BuildConfig n'est pas une image de conteneur. La BuildConfig est le _plan de construction_. L'image est le _résultat_ de la construction. La BuildConfig peut produire plusieurs images (une à chaque build).
- Une BuildConfig n'est pas un Deployment. La BuildConfig construit l'image. Le Deployment utilise l'image pour créer des Pods. Ce sont deux étapes distinctes.

**Comparaison BuildConfig vs construction locale** :

| Construction locale (podman build) | BuildConfig (OpenShift) |
| --- | --- |
| S'exécute sur ta machine | S'exécute dans le cluster |
| Tu dois pousser l'image vers un registre | L'image est stockée dans le registre interne du cluster |
| Déclenchement manuel | Déclenchement automatique possible |
| Dépend de ta machine | Environnement identique à chaque build |

---

### Qu'est-ce qu'un Build ?

**Définition** : Un Build est une exécution unique d'une BuildConfig. Chaque fois que tu lances une construction, OpenShift crée un objet Build qui représente cette exécution spécifique.

**Le problème que la distinction Build/BuildConfig résout** :

Sans cette distinction, voici les problèmes rencontrés :

1. **Pas d'historique** : Impossible de savoir quand un build a été lancé, s'il a réussi ou échoué, et combien de temps il a pris.

2. **Pas de debug** : Si un build échoue, impossible de consulter les logs de cette exécution spécifique.

**Comment la distinction Build/BuildConfig résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas d'historique | Chaque Build est un objet distinct avec sa date, son statut et sa durée |
| Pas de debug | Chaque Build a ses propres logs consultables avec `oc logs build/<nom>` |

**Analogie concrète** : La BuildConfig est le modèle d'un bon de commande vierge dans une usine. Chaque Build est un bon de commande rempli et exécuté. Le modèle reste le même, mais chaque bon de commande a un numéro unique, une date, et un résultat (commande livrée ou annulée).

**Ce qu'un Build n'est PAS** :

- Un Build n'est pas réutilisable. Un Build représente une seule exécution. Pour relancer une construction, tu crées un nouveau Build à partir de la même BuildConfig.
- Un Build n'est pas un Pod applicatif. Le Pod de build est temporaire : il s'exécute pendant la construction, puis il s'arrête. Les Pods applicatifs sont ceux qui exécutent ton application.

---

### Qu'est-ce qu'un ImageStream ?

**Définition** : Un ImageStream est une abstraction OpenShift qui pointe vers des images de conteneurs (dans n'importe quel registre) et qui suit leurs versions. C'est un registre de références vers des images, pas un stockage d'images.

**Le problème que l'ImageStream résout** :

Sans ImageStream, voici les problèmes rencontrés :

1. **Pas de détection de nouvelles versions** : Ton Deployment pointe vers une URL d'image fixe (par exemple `quay.io/php:8.3`). Si une nouvelle version de l'image est publiée avec le même tag, le Deployment ne le détecte pas. Tes Pods continuent de tourner avec l'ancienne version.

2. **Pas de déclenchement automatique** : Quand l'image de base change (par exemple une mise à jour de sécurité de PHP 8.3), tu dois manuellement relancer le build et le déploiement. Rien ne se fait automatiquement.

3. **Couplage fort avec le registre** : Ton Deployment pointe directement vers une URL de registre spécifique. Si tu changes de registre (par exemple de Docker Hub vers le registre interne), tu dois modifier tous les Deployments.

**Comment l'ImageStream résout ces problèmes** :

| Problème | Solution apportée par l'ImageStream |
| --- | --- |
| Pas de détection de nouvelles versions | L'ImageStream surveille les images et détecte quand une nouvelle version est disponible |
| Pas de déclenchement automatique | L'ImageStream peut déclencher automatiquement un rebuild ou un redéploiement |
| Couplage fort avec le registre | Le Deployment pointe vers l'ImageStream (pas vers le registre), ce qui permet de changer de registre sans modifier le Deployment |

Le diagramme suivant résume le flux Source-to-Image, du code source au déploiement des Pods.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-02-openshift-05-builds-imagestreams-1.html">Qu&#x27;est-ce qu&#x27;un ImageStream ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-02-openshift-05-builds-imagestreams-1.html" title="Qu&#x27;est-ce qu&#x27;un ImageStream ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : Un ImageStream fonctionne comme un abonnement à un journal. Sans abonnement, tu dois aller acheter le journal chaque jour au kiosque (pull manuel de l'image). Avec un abonnement (ImageStream), le journal est livré automatiquement dans ta boîte aux lettres dès qu'une nouvelle édition (nouvelle version de l'image) sort. Tu n'as rien à faire : la livraison est automatique.

**Ce qu'un ImageStream n'est PAS** :

- Un ImageStream n'est pas un registre d'images. Un registre (comme le registre interne d'OpenShift ou Docker Hub) stocke physiquement les images. Un ImageStream est un _pointeur_ vers ces images. Il contient des références (URL, digest SHA), pas les images elles-mêmes.
- Un ImageStream n'est pas obligatoire. Tu peux référencer les images directement par leur URL dans tes Deployments. L'ImageStream est un outil supplémentaire qui apporte l'automatisation et le suivi de versions.

**Comparaison référence directe d'image vs ImageStream** :

| Référence directe (`image: quay.io/php:8.3`) | ImageStream |
| --- | --- |
| Pas de détection de changement | Détection automatique des nouvelles versions |
| Pas de triggers | Peut déclencher un rebuild ou un redéploiement |
| Couplé au registre | Abstraction : indépendant du registre |
| Pas de portabilité | Facile à migrer entre environnements |

---

### Qu'est-ce qu'un ImageStream Tag ?

**Définition** : Un ImageStream Tag (ISTag) est une étiquette à l'intérieur d'un ImageStream qui pointe vers une version spécifique d'une image, identifiée par son digest SHA (empreinte unique).

**Le problème que les ImageStream Tags résolvent** :

Sans ImageStream Tags, voici les problèmes rencontrés :

1. **Tags mutables** : Le tag `latest` ou `8.3` d'une image peut pointer vers des contenus différents au fil du temps. Tu ne sais pas exactement quelle version tu utilises.

2. **Pas de suivi granulaire** : Tu ne peux pas suivre indépendamment plusieurs versions d'une même image (par exemple `8.3`, `8.2`, `latest`).

**Comment les ImageStream Tags résolvent ces problèmes** :

| Problème | Solution apportée par les ImageStream Tags |
| --- | --- |
| Tags mutables | Chaque ISTag stocke le digest SHA de l'image, qui est immuable |
| Pas de suivi granulaire | Chaque tag est suivi indépendamment et peut déclencher ses propres triggers |

**Fonctionnement des ImageStream Tags** :

- Chaque ImageStream peut avoir plusieurs tags : `latest`, `8.3`, `stable`, `v1.0`, etc.
- Chaque tag pointe vers une image spécifique via son digest SHA (par exemple `sha256:abc123...`).
- Quand l'image source change (même tag, nouveau contenu), OpenShift met à jour le digest automatiquement.
- Cette mise à jour peut déclencher un rebuild ou un redéploiement.

**Analogie concrète** : Les ImageStream Tags fonctionnent comme les signets dans un navigateur web. Chaque signet a un nom (le tag) et pointe vers une page web (l'image). Si la page web change de contenu (nouvelle version de l'image), le signet pointe toujours vers la même adresse, mais le contenu est différent. OpenShift détecte ce changement et peut réagir.

**Ce qu'un ImageStream Tag n'est PAS** :

- Un ISTag n'est pas un tag Docker/Podman classique. Un tag Docker est juste un nom (`latest`, `8.3`). Un ISTag contient en plus le digest SHA et des métadonnées. Il connaît l'historique des images associées à ce tag.

---

### Quels sont les triggers de build ?

**Définition** : Un trigger de build est un mécanisme qui déclenche automatiquement un nouveau Build à partir d'une BuildConfig, sans intervention manuelle.

**Le problème que les triggers résolvent** :

Sans triggers, voici les problèmes rencontrés :

1. **Oubli de rebuild** : Après une modification du code, tu oublies de relancer le build. L'image déployée ne correspond plus au code actuel.

2. **Image de base obsolète** : L'image de base (par exemple `php:8.3`) reçoit une mise à jour de sécurité, mais tes images applicatives ne sont pas reconstruites avec cette nouvelle base.

3. **Intervention manuelle constante** : Chaque modification nécessite une intervention humaine pour relancer le build. C'est répétitif et source d'erreurs.

**Comment les triggers résolvent ces problèmes** :

| Problème | Solution apportée par les triggers |
| --- | --- |
| Oubli de rebuild | Le trigger Webhook reconstruit automatiquement quand le code change |
| Image de base obsolète | Le trigger ImageChange reconstruit automatiquement quand l'image de base change |
| Intervention manuelle constante | Les triggers automatisent le processus, tu n'as rien à faire |

**Les quatre types de triggers** :

| Type de trigger | Déclencheur | Cas d'usage | Configuration |
| --- | --- | --- | --- |
| ImageChange | L'image de base (builder) a changé dans l'ImageStream | Mise à jour de sécurité de l'image de base | Automatique si l'image de base est un ImageStream |
| Webhook | Un commit est poussé vers le dépôt Git (GitHub, GitLab) | Rebuild après chaque modification du code | Nécessite de configurer l'URL du webhook dans le dépôt Git |
| ConfigChange | La BuildConfig elle-même est modifiée | Premier build après création de la BuildConfig | Automatique par défaut |
| Manuel | Commande `oc start-build` | Tests, debug, build ponctuel | Aucune configuration nécessaire |

**Analogie concrète** : Les triggers fonctionnent comme les différentes façons de déclencher une alarme incendie. Le détecteur de fumée (ImageChange) se déclenche automatiquement quand il détecte de la fumée (changement d'image). Le bouton d'alarme manuelle (Webhook) est activé quand quelqu'un appuie dessus (push de code). L'alarme de test périodique (ConfigChange) se déclenche quand on modifie le système. Et tu peux toujours déclencher l'alarme toi-même en appelant les pompiers (oc start-build).

**Ce que les triggers ne sont PAS** :

- Les triggers ne sont pas des pipelines CI/CD complets. Un trigger déclenche un build unique. Pour des workflows plus complexes (tests, validation, déploiement multi-environnements), il faut utiliser un outil CI/CD comme Tekton ou Jenkins.
- Les triggers ne sont pas obligatoires. Tu peux toujours lancer tes builds manuellement avec `oc start-build`.

---

## Étapes Pratiques

### Étape 1 : Créer un Project

Cette étape crée un project dédié pour les exercices de cette fiche.

Commande :

```bash
# Créer un nouveau project nommé "demo-builds"
oc new-project demo-builds
```

**Résultat attendu** :

```text
Now using project "demo-builds" on server "https://api.crc.testing:6443".
```

**Vérification** :

```bash
# Vérifier que tu es bien dans le project "demo-builds"
oc project
```

**Résultat attendu** :

```text
Using project "demo-builds" on server "https://api.crc.testing:6443".
```

---

### Étape 2 : Créer les fichiers source

Cette étape crée un dossier de travail avec un fichier PHP et un Containerfile.

**2a. Créer le dossier de travail** :

```bash
# Créer un dossier pour le projet
mkdir -p ~/demo-builds
cd ~/demo-builds
```

**2b. Créer le fichier `index.php`** :

Crée un fichier `index.php` dans le dossier `~/demo-builds` avec ce contenu :

```php
<?php
// Affiche un message avec le nom du serveur (hostname du Pod)
echo "Bonjour depuis OpenShift ! Serveur : " . gethostname();
```

**2c. Créer le Containerfile** :

Crée un fichier `Containerfile` dans le même dossier avec ce contenu :

```dockerfile
# Image de base : PHP 8.3 avec Apache
# On utilise une image UBI (Universal Base Image) de Red Hat, optimisée pour OpenShift
FROM registry.access.redhat.com/ubi9/php-83:latest

# Copier le fichier PHP dans le répertoire servi par Apache
# /opt/app-root/src/ est le répertoire par défaut de l'image UBI PHP
COPY index.php /opt/app-root/src/index.php

# Le port 8080 est déjà exposé par l'image de base
# Pas besoin de le redéclarer

# La commande de démarrage est déjà définie dans l'image de base
# Pas besoin de CMD
```

**Structure du dossier à ce stade** :

```text
~/demo-builds/
├── Containerfile      # Instructions pour construire l'image
└── index.php          # Fichier PHP à exécuter
```

---

### Étape 3 : Créer une BuildConfig

Cette étape crée une BuildConfig qui utilise la stratégie Docker (Containerfile).

Commande :

```bash
# Créer une BuildConfig de type binaire avec la stratégie Docker
# --strategy=docker : utilise le Containerfile pour construire l'image
# --binary=true : les fichiers source seront envoyés manuellement (pas depuis un dépôt Git)
# --name=mon-php-build : nom de la BuildConfig
oc new-build --strategy=docker --binary=true --name=mon-php-build
```

**Résultat attendu** :

```text
    * A Docker build using binary input will be created
      * The resulting image will be pushed to image stream tag "mon-php-build:latest"
      * A binary build was created, use 'oc start-build --from-dir' to trigger a new build

--> Creating resources with label build=mon-php-build ...
    imagestream.image.openshift.io "mon-php-build" created
    buildconfig.build.openshift.io "mon-php-build" created
--> Success
```

**Ce qui s'est passé** :

OpenShift a créé deux ressources :

1. **BuildConfig** `mon-php-build` : le plan de construction
2. **ImageStream** `mon-php-build` : le pointeur vers les images produites par les builds

**Vérification** :

```bash
# Vérifier que la BuildConfig existe
oc get buildconfigs
```

**Résultat attendu** :

```text
NAME             TYPE     FROM     LATEST
mon-php-build    Docker   Binary   0
```

**Explication de chaque colonne** :

| Colonne | Signification |
| --- | --- |
| NAME | Nom de la BuildConfig |
| TYPE | Stratégie de build (Docker, Source, Custom) |
| FROM | Source des fichiers (Binary = envoi manuel, Git = dépôt distant) |
| LATEST | Numéro du dernier build exécuté (0 = aucun build lancé) |

---

### Étape 4 : Lancer le build

Cette étape envoie les fichiers source au cluster et lance la construction de l'image.

Commande :

```bash
# Se placer dans le dossier contenant le Containerfile et index.php
cd ~/demo-builds

# Lancer le build en envoyant le contenu du dossier courant
# --from-dir=. : envoie tous les fichiers du dossier courant au cluster
# --follow : affiche les logs du build en temps réel
oc start-build mon-php-build --from-dir=. --follow
```

**Résultat attendu** :

```text
Uploading directory "." as binary input for the build ...
...
Sending build context to Docker daemon  3.072kB
Step 1/2 : FROM registry.access.redhat.com/ubi9/php-83:latest
latest: Pulling from ubi9/php-83
...
Step 2/2 : COPY index.php /opt/app-root/src/index.php
...
Successfully built abc123def456
Successfully tagged image-registry.openshift-image-registry.svc:5000/demo-builds/mon-php-build:latest
...

Push successful
```

Le build s'exécute dans un Pod temporaire à l'intérieur du cluster. L'image produite est poussée automatiquement vers le registre interne d'OpenShift.

**Vérification** :

```bash
# Lister les builds
oc get builds
```

**Résultat attendu** :

```text
NAME               TYPE     FROM             STATUS     STARTED          DURATION
mon-php-build-1    Docker   Binary@latest    Complete   2 minutes ago    45s
```

**Explication de chaque colonne** :

| Colonne | Signification |
| --- | --- |
| NAME | Nom du build (BuildConfig + numéro séquentiel) |
| TYPE | Stratégie utilisée |
| FROM | Source des fichiers |
| STATUS | État du build (New, Pending, Running, Complete, Failed) |
| STARTED | Quand le build a commencé |
| DURATION | Combien de temps le build a pris |

**Consulter les logs d'un build spécifique** :

```bash
# Voir les logs du build (utile si le build échoue)
oc logs build/mon-php-build-1
```

---

### Étape 5 : Vérifier l'ImageStream

Cette étape vérifie que l'image construite est bien référencée dans l'ImageStream.

Commande :

```bash
# Lister les ImageStreams du project
oc get imagestreams
```

**Résultat attendu** :

```text
NAME              IMAGE REPOSITORY                                                              TAGS     UPDATED
mon-php-build     image-registry.openshift-image-registry.svc:5000/demo-builds/mon-php-build    latest   2 minutes ago
```

**Explication de chaque colonne** :

| Colonne | Signification |
| --- | --- |
| NAME | Nom de l'ImageStream |
| IMAGE REPOSITORY | URL de l'image dans le registre interne |
| TAGS | Liste des tags disponibles |
| UPDATED | Date de la dernière mise à jour |

**Voir les détails de l'ImageStream** :

```bash
# Afficher les détails de l'ImageStream
oc describe imagestream mon-php-build
```

**Résultat attendu** (extraits importants) :

```text
Name:           mon-php-build
Namespace:      demo-builds
...

latest
  tagged from image-registry.openshift-image-registry.svc:5000/demo-builds/mon-php-build@sha256:abc123...

  * image-registry.openshift-image-registry.svc:5000/demo-builds/mon-php-build@sha256:abc123...
      2 minutes ago
```

Le tag `latest` pointe vers l'image identifiée par son digest SHA (`sha256:abc123...`). Ce digest est l'empreinte unique de l'image.

---

### Étape 6 : Déployer l'image construite

Cette étape crée un Deployment et un Service à partir de l'image construite.

Commande :

```bash
# Créer un Deployment à partir de l'ImageStream
# OpenShift utilise l'ImageStream "mon-php-build" pour trouver l'image
# --name=php-app : nom du Deployment
oc new-app mon-php-build --name=php-app
```

**Résultat attendu** :

```text
--> Found image abc123d (2 minutes old) in image stream "demo-builds/mon-php-build" under tag "latest" for "mon-php-build"
...
--> Creating resources ...
    deployment.apps "php-app" created
    service "php-app" created
--> Success
    Application is not exposed. You can expose services to the outside world by executing one or more of the commands:
      'oc expose service/php-app'
    Run 'oc status' to view your app.
```

**Ce qui s'est passé** :

OpenShift a créé :

1. **Deployment** `php-app` : gère les Pods qui exécutent l'application
2. **Service** `php-app` : point d'accès réseau interne vers les Pods

**Vérifier que le Pod tourne** :

```bash
# Lister les Pods
oc get pods
```

**Résultat attendu** :

```text
NAME                        READY   STATUS      RESTARTS   AGE
php-app-6b7c8d9e0f-x1y2z   1/1     Running     0          30s
```

Le Pod est en status `Running` : l'application tourne.

**Créer une Route pour accéder à l'application depuis l'extérieur** :

```bash
# Exposer le Service via une Route
oc expose service php-app
```

**Résultat attendu** :

```text
route.route.openshift.io/php-app exposed
```

**Récupérer l'URL de la Route** :

```bash
# Afficher l'URL de la Route
oc get route php-app -o jsonpath='{.spec.host}'
```

**Résultat attendu** :

```text
php-app-demo-builds.apps-crc.testing
```

**Vérification** :

```bash
# Tester l'application via curl
curl http://php-app-demo-builds.apps-crc.testing
```

**Résultat attendu** :

```text
Bonjour depuis OpenShift ! Serveur : php-app-6b7c8d9e0f-x1y2z
```

Le nom du serveur correspond au nom du Pod. Cela confirme que l'application tourne dans OpenShift.

---

### Étape 7 : Modifier le code et relancer le build

Cette étape montre comment une modification du code source est propagée automatiquement jusqu'au Deployment.

**7a. Modifier le fichier PHP** :

Modifie le fichier `~/demo-builds/index.php` :

```php
<?php
// Version 2 : affiche la date et le nom du serveur
echo "Version 2 - Bonjour depuis OpenShift ! Serveur : " . gethostname();
echo " | Date : " . date('Y-m-d H:i:s');
```

**7b. Relancer le build** :

```bash
# Se placer dans le dossier du projet
cd ~/demo-builds

# Relancer le build avec les fichiers modifiés
oc start-build mon-php-build --from-dir=. --follow
```

**Résultat attendu** :

```text
Uploading directory "." as binary input for the build ...
...
Push successful
```

**7c. Vérifier la mise à jour automatique** :

Quand le build est terminé, l'ImageStream est mis à jour avec la nouvelle image. Le Deployment détecte ce changement (trigger ImageChange) et crée automatiquement de nouveaux Pods. Cette détection automatique fonctionne car `oc new-app` ajoute l'annotation `image.openshift.io/triggers` au Deployment. Un Deployment Kubernetes standard ne détecte pas nativement les changements d'ImageStream.

```bash
# Vérifier que le Deployment a été mis à jour
oc get pods
```

**Résultat attendu** :

```text
NAME                        READY   STATUS      RESTARTS   AGE
php-app-7c8d9e0f1g-a2b3c   1/1     Running     0          15s
```

Le nom du Pod a changé : c'est un nouveau Pod avec la nouvelle image.

**Vérification** :

```bash
# Tester la nouvelle version
curl http://php-app-demo-builds.apps-crc.testing
```

**Résultat attendu** :

```text
Version 2 - Bonjour depuis OpenShift ! Serveur : php-app-7c8d9e0f1g-a2b3c | Date : 2025-01-15 14:30:00
```

Le message affiche maintenant "Version 2" et la date. La mise à jour a fonctionné.

---

### Étape 8 : Nettoyer

Cette étape supprime toutes les ressources créées pendant les exercices.

```bash
# Supprimer le project et toutes ses ressources
oc delete project demo-builds
```

**Résultat attendu** :

```text
project.project.openshift.io "demo-builds" deleted
```

Supprimer le project supprime automatiquement toutes les ressources qu'il contient : BuildConfig, Builds, ImageStreams, Deployments, Services, Routes, Pods.

**Nettoyer les fichiers locaux** :

```bash
# Supprimer le dossier de travail
rm -rf ~/demo-builds
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `oc new-build --strategy=docker --binary=true --name=<nom>` | Créer une BuildConfig de type binaire (stratégie Docker) |
| `oc start-build <nom> --from-dir=. --follow` | Lancer un build en envoyant les fichiers du dossier courant |
| `oc get builds` | Lister tous les builds du project |
| `oc logs build/<nom-du-build>` | Afficher les logs d'un build spécifique |
| `oc get buildconfigs` | Lister toutes les BuildConfigs du project |
| `oc describe buildconfig <nom>` | Afficher les détails d'une BuildConfig |
| `oc get imagestreams` | Lister tous les ImageStreams du project |
| `oc describe imagestream <nom>` | Afficher les détails d'un ImageStream (tags, digests) |
| `oc import-image <nom> --from=<url-registre> --confirm` | Importer une image externe dans un ImageStream |
| `oc tag <source> <destination>` | Créer un tag dans un ImageStream (exemple : `oc tag mon-php-build:latest mon-php-build:v1.0`) |
| `oc cancel-build <nom-du-build>` | Annuler un build en cours |
| `oc delete buildconfig <nom>` | Supprimer une BuildConfig |

---

## Pièges Fréquents

### Piège 1 : Build échoué avec "permission denied"

**Problème** : Le build échoue avec un message contenant "permission denied" ou "Opération not permitted".

**Cause** : Le Containerfile utilise l'instruction `USER root` ou exécute des commandes qui nécessitent les droits root. Par défaut, OpenShift exécute les builds et les conteneurs avec un utilisateur non-root (UID aléatoire) pour des raisons de sécurité.

**Solution** :

```dockerfile
# Incorrect : utilise root
FROM docker.io/library/php:8.3-cli
USER root
RUN apt-get update

# Correct : utilise une image UBI qui fonctionne sans root
FROM registry.access.redhat.com/ubi9/php-83:latest
COPY index.php /opt/app-root/src/index.php
```

**Règle** : Utilise les images UBI (Universal Base Image) de Red Hat. Elles sont conçues pour fonctionner avec un utilisateur non-root dans OpenShift.

---

### Piège 2 : ImageStream non mis à jour après un push externe

**Problème** : Tu as poussé une nouvelle version de l'image vers un registre externe (Docker Hub, Quay.io), mais l'ImageStream affiche toujours l'ancienne version.

**Cause** : Par défaut, OpenShift vérifie les mises à jour des images externes selon un intervalle de temps configuré (schedule). La vérification n'est pas instantanée.

**Solution** :

```bash
# Forcer l'import immédiat de l'image
oc import-image mon-imagestream --from=docker.io/monuser/monimage:latest --confirm

# Vérifier que l'ImageStream a été mis à jour
oc describe imagestream mon-imagestream
```

**Vérifier la politique de scheduling** :

```bash
# Voir la configuration de l'ImageStream
oc get imagestream mon-imagestream -o yaml
```

Cherche la section `importPolicy.scheduled`. Si elle vaut `true`, OpenShift vérifie périodiquement les mises à jour. Si elle est absente ou `false`, aucune vérification automatique n'est effectuée.

---

### Piège 3 : "--from-dir" oublié lors d'un build binaire

**Problème** : Tu lances `oc start-build mon-php-build` sans l'option `--from-dir` et le build échoue immédiatement.

**Cause** : La BuildConfig a été créée avec `--binary=true`. Cela signifie que les fichiers source doivent être fournis à chaque build. Sans `--from-dir`, le build n'a pas de fichiers à construire.

**Solution** :

```bash
# Incorrect : pas de fichiers source
oc start-build mon-php-build

# Correct : envoie les fichiers du dossier courant
oc start-build mon-php-build --from-dir=.

# Correct aussi : envoie les fichiers d'un dossier spécifique
oc start-build mon-php-build --from-dir=~/mon-projet/
```

---

### Piège 4 : Confusion entre Build et BuildConfig

**Problème** : Tu essaies de modifier un Build ou de relancer un Build spécifique, et la commande échoue.

**Cause** : Confusion entre la BuildConfig (le modèle) et le Build (une exécution unique).

**Solution** :

| Action | Commande correcte | Commande incorrecte |
| --- | --- | --- |
| Relancer un build | `oc start-build mon-php-build` (nom de la BuildConfig) | `oc start-build mon-php-build-1` (nom du Build) |
| Voir les logs | `oc logs build/mon-php-build-1` (nom du Build) | `oc logs buildconfig/mon-php-build` (ne montre que le dernier build) |
| Modifier la configuration | `oc edit buildconfig mon-php-build` | `oc edit build mon-php-build-1` (un Build n'est pas modifiable) |

**Règle** : La BuildConfig est le modèle réutilisable. Le Build est un résultat unique et non modifiable.

---

### Piège 5 : Image de base non trouvée dans le registre

**Problème** : Le build échoue avec "manifest unknown" ou "image not found" pour l'image de base.

**Cause** : L'image de base spécifiée dans le Containerfile (`FROM ...`) n'est pas accessible depuis le cluster. Le cluster peut avoir des restrictions d'accès réseau ou le registre nécessite une authentification.

**Solution** :

```bash
# Vérifier que le cluster peut accéder au registre
# Essayer d'importer l'image manuellement
oc import-image test-php --from=registry.access.redhat.com/ubi9/php-83:latest --confirm

# Si l'import échoue, vérifier les secrets d'authentification
oc get secrets -o name | grep pull
```

**Règle** : Privilégie les images du registre `registry.access.redhat.com` ou du registre interne d'OpenShift. Elles sont accessibles sans configuration supplémentaire.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est une BuildConfig et à quoi elle sert
- [ ] Je sais expliquer la différence entre BuildConfig et Build
- [ ] Je connais les trois stratégies de build (Source, Docker, Custom)
- [ ] Je sais créer une BuildConfig avec `oc new-build`
- [ ] Je sais lancer un build avec `oc start-build --from-dir=.`
- [ ] Je sais consulter les logs d'un build avec `oc logs build/<nom>`
- [ ] Je sais expliquer ce qu'est un ImageStream et à quoi il sert
- [ ] Je sais lister les ImageStreams avec `oc get imagestreams`
- [ ] Je sais consulter les détails d'un ImageStream avec `oc describe imagestream`
- [ ] Je sais que l'ImageStream peut déclencher un redéploiement automatique
- [ ] Je connais les quatre types de triggers (ImageChange, Webhook, ConfigChange, Manuel)
- [ ] Je sais que les builds OpenShift s'exécutent sans droits root par défaut

---

## Exercice Pratique

**Énoncé** : Crée une application PHP complète avec BuildConfig et ImageStream, déploie-la, modifie le code, et vérifie que la mise à jour est automatique.

**Indications** :

- Crée un project `exercice-builds`
- Crée un dossier `~/exercice-builds/` contenant un fichier `index.php` et un `Containerfile`
- Le fichier `index.php` doit afficher : "Exercice Builds - Version 1"
- Le Containerfile doit utiliser l'image `registry.access.redhat.com/ubi9/php-83:latest`
- Crée une BuildConfig nommée `exercice-php` avec la stratégie Docker et le mode binaire
- Lance le build, déploie l'application, expose-la via une Route
- Modifie `index.php` pour afficher "Exercice Builds - Version 2"
- Relance le build et vérifie que la Route affiche la version 2

**Résultat attendu** :

- Après le premier build : `curl` affiche "Exercice Builds - Version 1"
- Après le deuxième build : `curl` affiche "Exercice Builds - Version 2"

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer le project** :

```bash
# Créer le project dédié à l'exercice
oc new-project exercice-builds
```

**Étape 2 : Créer les fichiers source** :

```bash
# Créer le dossier de travail
mkdir -p ~/exercice-builds
cd ~/exercice-builds
```

Crée un fichier `index.php` avec ce contenu :

```php
<?php
// Affiche le message de la version 1
echo "Exercice Builds - Version 1";
```

Crée un fichier `Containerfile` avec ce contenu :

```dockerfile
# Image de base : PHP 8.3 avec Apache (image UBI Red Hat)
FROM registry.access.redhat.com/ubi9/php-83:latest

# Copier le fichier PHP dans le répertoire servi par Apache
COPY index.php /opt/app-root/src/index.php
```

**Étape 3 : Créer la BuildConfig** :

```bash
# Créer la BuildConfig avec la stratégie Docker et le mode binaire
oc new-build --strategy=docker --binary=true --name=exercice-php
```

**Résultat attendu** :

```text
--> Creating resources with label build=exercice-php ...
    imagestream.image.openshift.io "exercice-php" created
    buildconfig.build.openshift.io "exercice-php" created
--> Success
```

**Étape 4 : Lancer le premier build** :

```bash
# Se placer dans le dossier du projet
cd ~/exercice-builds

# Lancer le build
oc start-build exercice-php --from-dir=. --follow
```

**Résultat attendu** : Le build se termine par "Push successful".

**Étape 5 : Déployer l'application** :

```bash
# Créer le Deployment et le Service
oc new-app exercice-php --name=exercice-app

# Exposer le Service via une Route
oc expose service exercice-app
```

**Étape 6 : Vérifier le premier déploiement** :

```bash
# Récupérer l'URL de la Route
oc get route exercice-app -o jsonpath='{.spec.host}'
```

```bash
# Tester l'application (remplacer l'URL par celle affichée ci-dessus)
curl http://exercice-app-exercice-builds.apps-crc.testing
```

**Résultat attendu** :

```text
Exercice Builds - Version 1
```

**Étape 7 : Modifier le code** :

Modifie le fichier `~/exercice-builds/index.php` :

```php
<?php
// Affiche le message de la version 2
echo "Exercice Builds - Version 2";
```

**Étape 8 : Relancer le build** :

```bash
# Se placer dans le dossier du projet
cd ~/exercice-builds

# Relancer le build avec les fichiers modifiés
oc start-build exercice-php --from-dir=. --follow
```

**Résultat attendu** : Le build se termine par "Push successful".

**Étape 9 : Vérifier la mise à jour** :

Attends quelques secondes que le nouveau Pod soit créé, puis :

```bash
# Vérifier que le nouveau Pod tourne
oc get pods
```

```bash
# Tester la nouvelle version
curl http://exercice-app-exercice-builds.apps-crc.testing
```

**Résultat attendu** :

```text
Exercice Builds - Version 2
```

Le message affiche "Version 2" : la mise à jour automatique a fonctionné.

**Étape 10 : Nettoyer** :

```bash
# Supprimer le project et toutes ses ressources
oc delete project exercice-builds

# Supprimer les fichiers locaux
rm -rf ~/exercice-builds
```

---

## Navigation

← Fiche précédente : **[Routes et Services](04-routes-services.md)**

→ Fiche suivante : **[Stockage et Configuration (Projet Intégrateur)](06-stockage-configuration.md)**
