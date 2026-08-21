---
tags:
  - Podman
  - Débutant
  - Concept
description: "Introduction à Podman"
estimated_time: "115 min"
fiche_number: 1
total_fiches: 5
cursus: "Podman"
id: "infrastructure.podman.introduction-podman"
course_id: "infrastructure.podman"
content_type: "lesson"
order: 1
---

# 01 - Introduction à Podman

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est Podman, en quoi il diffère de Docker, et tu auras installé Podman sur ta machine. Lecture estimée : 115 min.


## Prérequis

- Avoir lu la fiche [01 - Créer un environnement Docker Compose pour Symfony](../../01-docker/01-docker-compose-symfony.md) pour connaître les bases de Docker et des conteneurs
- Savoir utiliser le terminal (ouvrir un terminal, taper une commande, lire le résultat)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Podman      | 5.x (exemples compatibles 4.x+) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est Podman, en quoi il diffère de Docker, et tu auras installé Podman sur ta machine.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Podman ?

**Définition** : Podman (Pod Manager) est un outil de gestion de conteneurs créé par Red Hat. Il permet de créer, lancer et gérer des conteneurs. Ses commandes sont compatibles avec celles de Docker.

**Le problème que Podman résout** :

Docker fonctionne bien, mais il impose une architecture qui pose des problèmes dans certaines situations :

1. **Daemon root** : Docker repose sur un processus en arrière-plan (le daemon `dockerd`) qui tourne avec les droits administrateur (`root`). Tout programme qui tourne en root peut modifier n'importe quel fichier du système. Si un attaquant exploite une faille dans le daemon Docker, il obtient un accès total à la machine.

2. **Point de défaillance unique** : Tous les conteneurs Docker dépendent du daemon. Si le daemon plante, tous les conteneurs s'arrêtent en même temps. Aucun conteneur ne peut fonctionner sans le daemon.

3. **Incompatibilité Kubernetes** : Docker utilise son propre format interne. Kubernetes (l'outil standard pour orchestrer des conteneurs en production) utilise le format OCI (Open Container Initiative). Docker nécessite une couche de traduction supplémentaire.

4. **Pas de pods natifs** : Docker gère les conteneurs un par un. Kubernetes organise les conteneurs en "pods" (groupes de conteneurs qui partagent le même réseau). Docker ne supporte pas cette notion nativement.

**Comment Podman résout ces problèmes** :

| Problème                     | Solution apportée par Podman                                                                 |
| ---------------------------- | -------------------------------------------------------------------------------------------- |
| Daemon root                  | Podman n'a pas de daemon. Chaque conteneur est un processus indépendant lancé par ton compte |
| Point de défaillance unique  | Pas de daemon central. Si un conteneur plante, les autres continuent de fonctionner          |
| Incompatibilité Kubernetes   | Podman utilise le format OCI nativement. Pas de couche de traduction nécessaire              |
| Pas de pods natifs           | Podman supporte les pods nativement avec la commande `podman pod`                            |

**Analogie concrète** : Docker fonctionne comme un restaurant avec un chef unique qui coordonne tout en cuisine (le daemon). Toutes les commandes passent par ce chef. Si le chef tombe malade, le restaurant ferme entièrement. Podman fonctionne comme un food court (aire de restauration) où chaque stand est indépendant. Chaque stand prépare ses propres plats sans dépendre d'un chef central. Si un stand ferme, les autres continuent de servir sans interruption.

**Ce que Podman n'est PAS** :

- Podman n'est pas un fork de Docker. Podman a été écrit entièrement de zéro par Red Hat. Il ne reprend aucun code source de Docker. Seule l'interface en ligne de commande (CLI) est volontairement compatible.
- Podman n'est pas incompatible avec Docker. Les images Docker fonctionnent avec Podman. Les fichiers `Dockerfile` fonctionnent avec Podman. Les commandes sont identiques dans la grande majorité des cas.
- Podman n'est pas un outil expérimental. Il est utilisé en production par Red Hat dans OpenShift (leur plateforme Kubernetes d'entreprise) depuis 2019.

**Comparaison Podman vs Docker** :

| Critère             | Docker                                             | Podman                                              |
| ------------------- | -------------------------------------------------- | --------------------------------------------------- |
| Daemon              | Oui (`dockerd` tourne en permanence)               | Non (pas de daemon)                                 |
| Droits root         | Le daemon tourne en root par défaut                | Rootless par défaut (pas besoin de root)            |
| Architecture        | Client/serveur (le CLI parle au daemon)            | Fork/exec (chaque commande lance un processus)      |
| Pods natifs         | Non                                                | Oui (commande `podman pod`)                         |
| Format d'images     | Docker + OCI                                       | OCI natif + Docker compatible                       |
| CLI                 | `docker ...`                                       | `podman ...` (mêmes commandes)                      |
| Compose             | `docker compose` intégré                           | `podman-compose` ou `podman compose` (depuis 4.7+)  |
| Swarm               | Oui                                                | Non (utilise Kubernetes à la place)                  |
| Société             | Docker Inc.                                        | Red Hat (IBM)                                        |

Le schéma suivant illustre la différence d'architecture entre Docker (avec démon central) et Podman (sans démon) :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-01-podman-01-introduction-podman-1.html">Qu&#x27;est-ce que Podman ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-01-podman-01-introduction-podman-1.html" title="Qu&#x27;est-ce que Podman ?" style="width:100%;min-height:728px;border:0;background:transparent"></iframe>
</div>

Avec Docker, toutes les commandes passent par un démon central qui tourne en root. Avec Podman, chaque conteneur est lancé directement par le client CLI, sans intermédiaire et sans droits root.

---

### Qu'est-ce que l'architecture fork/exec ?

**Définition** : L'architecture fork/exec signifie que chaque conteneur est lancé comme un processus fils direct de la commande qui l'a créé. Il n'y a pas de processus intermédiaire (daemon) entre toi et le conteneur.

**Le problème que l'architecture fork/exec résout** :

Sans fork/exec, voici les problèmes rencontrés avec l'architecture daemon de Docker :

1. **Dépendance au daemon** : Si le daemon Docker s'arrête (crash, mise à jour, bug), tous les conteneurs s'arrêtent immédiatement. Tu perds tout ton travail en cours.

2. **Surface d'attaque** : Le daemon est un processus unique qui gère tous les conteneurs. Un seul point d'entrée pour un attaquant suffit pour compromettre tous les conteneurs.

3. **Ressources gaspillées** : Le daemon tourne en permanence, même quand aucun conteneur n'est actif. Il consomme de la mémoire et du processeur.

**Comment l'architecture fork/exec résout ces problèmes** :

| Problème               | Solution fork/exec                                                                   |
| ---------------------- | ------------------------------------------------------------------------------------ |
| Dépendance au daemon   | Chaque conteneur est indépendant. Si un conteneur plante, les autres ne sont pas affectés |
| Surface d'attaque      | Pas de processus central à attaquer. Chaque conteneur est isolé                     |
| Ressources gaspillées  | Pas de processus en arrière-plan. Les ressources ne sont utilisées que quand un conteneur tourne |

**Analogie concrète** : Avec Docker, c'est comme si tous les employés d'un bureau devaient passer par un secrétaire central pour envoyer leurs courriers. Si le secrétaire est absent, personne ne peut envoyer de courrier. Avec Podman (fork/exec), chaque employé poste son propre courrier directement. L'absence d'un employé n'empêche pas les autres de poster les leurs.

**Ce que l'architecture fork/exec n'est PAS** :

- Fork/exec ne signifie pas que les conteneurs ne communiquent pas entre eux. Ils peuvent toujours partager un réseau et échanger des données.
- Fork/exec ne signifie pas que Podman est plus lent. Le lancement d'un conteneur est aussi rapide qu'avec Docker, car il y a une étape de moins (pas de communication avec un daemon).

---

### Qu'est-ce que le mode rootless ?

**Définition** : Le mode rootless signifie que Podman peut créer et gérer des conteneurs sans avoir besoin des droits administrateur (root). Ton compte utilisateur normal suffit.

**Le problème que le mode rootless résout** :

Sans mode rootless, voici les problèmes rencontrés :

1. **Risque de sécurité** : Le daemon Docker tourne en root. Si un conteneur est compromis, l'attaquant peut potentiellement accéder au système avec les droits root. Root peut lire, modifier et supprimer tous les fichiers du système.

2. **Restrictions d'entreprise** : Dans beaucoup d'entreprises, les développeurs n'ont pas les droits root sur leur machine. Ils ne peuvent pas utiliser Docker sans demander à un administrateur.

3. **Environnements partagés** : Sur un serveur partagé entre plusieurs développeurs, donner les droits root à Docker est un risque. Un développeur pourrait accidentellement (ou volontairement) accéder aux données des autres.

**Comment le mode rootless résout ces problèmes** :

| Problème                    | Solution rootless                                                                        |
| --------------------------- | --------------------------------------------------------------------------------------- |
| Risque de sécurité          | Les conteneurs tournent avec les droits de ton utilisateur. Pas d'accès root possible   |
| Restrictions d'entreprise   | Pas besoin de droits root. N'importe quel développeur peut utiliser Podman               |
| Environnements partagés     | Chaque utilisateur gère ses propres conteneurs, isolés des autres utilisateurs          |

**Analogie concrète** : Avec Docker en mode root, c'est comme si tu devais emprunter le passe-partout du concierge pour accéder à ton propre appartement. Si tu perds ce passe-partout, quelqu'un peut ouvrir tous les appartements de l'immeuble. Avec Podman en rootless, tu utilises ta propre clé qui n'ouvre que ton appartement. Même si tu la perds, seul ton appartement est concerné.

**Ce que le mode rootless n'est PAS** :

- Le mode rootless ne signifie pas que les conteneurs ont moins de fonctionnalités. La grande majorité des conteneurs fonctionnent exactement de la même façon en rootless.
- Le mode rootless ne signifie pas que tu ne peux jamais utiliser root. Si tu as besoin de droits root pour un cas précis, tu peux lancer Podman avec `sudo`. Mais ce n'est pas le comportement par défaut.

---

### Pourquoi Red Hat a créé Podman ?

**Définition** : Red Hat est une entreprise (filiale d'IBM) spécialisée dans les logiciels open source pour les entreprises. Elle est l'éditeur de Red Hat Enterprise Linux (RHEL), Fedora et OpenShift.

**Le problème que Red Hat cherchait à résoudre** :

Red Hat avait besoin d'un outil de conteneurs pour sa plateforme OpenShift (basée sur Kubernetes). Docker posait plusieurs problèmes pour cet usage :

1. **Sécurité insuffisante** : Le daemon root de Docker est un risque inacceptable dans un environnement d'entreprise où la sécurité est prioritaire.

2. **Non-conformité OCI** : Red Hat voulait un outil 100% conforme au standard OCI (Open Container Initiative), le standard ouvert pour les conteneurs. Docker utilisait son propre format avant de migrer vers OCI.

3. **Pas de pods natifs** : Kubernetes organise les conteneurs en pods. Docker ne supporte pas cette notion. Red Hat avait besoin d'un outil qui gère les pods nativement pour faciliter la transition entre développement local et déploiement Kubernetes.

4. **Dépendance à Docker Inc.** : Red Hat ne voulait pas dépendre d'une entreprise tierce (Docker Inc.) pour un composant aussi critique que le runtime de conteneurs.

**Comment Podman répond aux besoins de Red Hat** :

| Besoin de Red Hat            | Réponse de Podman                                                  |
| ---------------------------- | ------------------------------------------------------------------ |
| Sécurité renforcée           | Mode rootless par défaut, pas de daemon                            |
| Conformité OCI               | Utilise le format OCI nativement                                   |
| Pods natifs                  | Commande `podman pod` intégrée                                     |
| Indépendance                 | Développé et maintenu par Red Hat en open source                   |

**Résultat concret** : Depuis RHEL 8 (2019), Red Hat a remplacé Docker par Podman comme outil de conteneurs par défaut. OpenShift utilise CRI-O (un autre projet Red Hat basé sur les mêmes principes) comme runtime de conteneurs Kubernetes.

---

### La compatibilité CLI avec Docker

**Définition** : La compatibilité CLI signifie que les commandes Podman utilisent la même syntaxe que les commandes Docker. Tu peux remplacer le mot `docker` par `podman` dans la majorité des commandes, et elles fonctionneront.

**Le problème que la compatibilité CLI résout** :

Sans compatibilité CLI, voici les problèmes rencontrés :

1. **Courbe d'apprentissage** : Apprendre un nouvel ensemble de commandes prend du temps. Si Podman utilisait une syntaxe différente, il faudrait tout réapprendre.

2. **Scripts existants** : Des milliers de scripts, tutoriels et documentations utilisent les commandes Docker. Sans compatibilité, il faudrait tous les réécrire.

3. **Adoption freinée** : Si Podman demandait d'apprendre de nouvelles commandes, peu de développeurs prendraient le temps de migrer depuis Docker.

**Comment la compatibilité CLI résout ces problèmes** :

| Problème                | Solution de la compatibilité CLI                                              |
| ----------------------- | ----------------------------------------------------------------------------- |
| Courbe d'apprentissage  | Si tu connais Docker, tu connais déjà Podman. Mêmes commandes, même syntaxe  |
| Scripts existants       | Un simple alias `alias docker=podman` suffit pour faire fonctionner les scripts existants |
| Adoption freinée        | La migration est transparente. Pas de temps d'apprentissage supplémentaire    |

**Analogie concrète** : C'est comme deux marques de voitures qui ont les mêmes commandes de conduite : volant, pédales, clignotants au même endroit. Si tu sais conduire une voiture de marque A (Docker), tu sais conduire une voiture de marque B (Podman) sans formation supplémentaire. Seul le moteur sous le capot est différent.

**Ce que la compatibilité CLI n'est PAS** :

- La compatibilité CLI ne signifie pas que Podman est une copie de Docker. Le code source est entièrement différent. Seule l'interface en ligne de commande est identique.
- La compatibilité CLI ne signifie pas que 100% des commandes sont identiques. Certaines fonctionnalités spécifiques à Docker n'existent pas dans Podman (voir les différences ci-dessous).

**Commandes identiques entre Docker et Podman** :

| Commande Docker         | Commande Podman         | Action                                 |
| ----------------------- | ----------------------- | -------------------------------------- |
| `docker pull`           | `podman pull`           | Télécharger une image                  |
| `docker push`           | `podman push`           | Envoyer une image vers un registre     |
| `docker build`          | `podman build`          | Construire une image depuis Dockerfile |
| `docker run`            | `podman run`            | Lancer un conteneur                    |
| `docker ps`             | `podman ps`             | Lister les conteneurs actifs           |
| `docker images`         | `podman images`         | Lister les images locales              |
| `docker stop`           | `podman stop`           | Arrêter un conteneur                   |
| `docker rm`             | `podman rm`             | Supprimer un conteneur                 |
| `docker rmi`            | `podman rmi`            | Supprimer une image                    |
| `docker exec`           | `podman exec`           | Exécuter une commande dans un conteneur|
| `docker logs`           | `podman logs`           | Afficher les logs d'un conteneur       |
| `docker inspect`        | `podman inspect`        | Afficher les détails d'un conteneur    |

**Différences notables** :

| Fonctionnalité Docker          | Équivalent Podman                                         |
| ------------------------------ | --------------------------------------------------------- |
| `docker compose`               | `podman-compose` (outil séparé à installer)               |
| Docker Swarm                   | Non supporté (utiliser Kubernetes à la place)             |
| Docker Desktop (GUI)           | Podman Desktop (GUI séparée, à installer)                 |

---

## Étapes Pratiques

### Étape 1 : Vérifier si Podman est déjà installé

Avant d'installer Podman, vérifie s'il est déjà présent sur ta machine.

Ouvre un terminal et tape cette commande :

```bash
# Affiche la version de Podman installée
podman --version
```

**Résultat attendu si Podman est installé** :

```text
podman version 5.x.x
```

Le numéro de version peut être différent. L'important est que la commande affiche un numéro de version sans erreur.

**Résultat attendu si Podman n'est pas installé** :

```text
zsh: command not found: podman
```

Si tu obtiens ce message, passe à l'étape 2 pour installer Podman.

Si Podman est déjà installé, passe directement à l'étape 3.

---

### Étape 2 : Installer Podman

L'installation dépend de ton système d'exploitation. Suis uniquement la section qui correspond à ta machine.

**Sur macOS (avec Homebrew)** :

```bash
# Installe Podman via Homebrew
brew install podman
```

```text
==> Downloading https://ghcr.io/v2/homebrew/core/podman/...
==> Installing podman
==> Pouring podman--4.9.3.arm64_sonoma.bottle.tar.gz
🍺  /opt/homebrew/Cellar/podman/4.9.3: 195 files, 57.2MB
```

Sur macOS, Podman a besoin d'une machine virtuelle Linux pour faire tourner les conteneurs (car les conteneurs sont basés sur Linux). Il faut initialiser et démarrer cette machine :

```bash
# Crée la machine virtuelle Linux pour Podman
podman machine init
```

```text
Downloading VM image: fedora-coreos-39.20240210.2.0-qemu.aarch64.qcow2.xz
Extracting compressed file: fedora-coreos-39.20240210.2.0-qemu.aarch64.qcow2.xz
Image resized.
Machine init complete
```

```bash
# Démarre la machine virtuelle
podman machine start
```

```text
Starting machine "podman-machine-default"
Waiting for VM ...
Machine "podman-machine-default" started successfully
```

**Sur Linux (Fedora)** :

```bash
# Installe Podman via dnf
sudo dnf install podman
```

```text
Installing:
 podman    x86_64    4.9.3-1.fc39    updates    14 M
Complete!
```

Sur Linux, Podman n'a pas besoin de machine virtuelle. Les conteneurs tournent directement sur le noyau Linux de ta machine.

**Sur Linux (Ubuntu / Debian)** :

```bash
# Installe Podman via apt
sudo apt install podman
```

```text
Reading package lists... Done
Setting up podman (4.9.3-1) ...
```

Sur Ubuntu et Debian aussi, pas besoin de machine virtuelle.

---

### Étape 3 : Vérifier l'installation

Maintenant que Podman est installé, vérifie que tout fonctionne correctement.

```bash
# Affiche la version installée
podman --version
```

**Résultat attendu** :

```text
podman version 5.x.x
```

Ensuite, affiche les informations détaillées de Podman :

```bash
# Affiche les informations complètes sur l'installation
podman info
```

**Résultat attendu** (extrait des informations les plus importantes) :

```text
host:
  arch: arm64
  os: darwin
  kernel: 6.6.9-200.fc39.aarch64
  memFree: 1073741824
  memTotal: 2147483648
  buildahVersion: 1.33.3
  conmon:
    version: 'conmon version 2.1.10'
  ociRuntime:
    name: crun
    version: 'crun version 1.14'
version:
  APIVersion: 4.9.3
  Built: 1707400000
  BuiltTime: "Thu Feb 8 16:00:00 2024"
  Version: 4.9.3
registries:
  search:
  - registry.fedoraproject.org
  - registry.access.redhat.com
  - docker.io
```

Les informations importantes à vérifier :

- **Version** : confirme que Podman est installé et sa version
- **ociRuntime** : le runtime de conteneurs utilisé (`crun` sur Fedora/RHEL, `runc` sur d'autres distributions)
- **registries** : les registres d'images configurés (d'où Podman télécharge les images)

---

### Étape 4 : Lancer ton premier conteneur

Lance le conteneur de test `hello-world` pour vérifier que Podman fonctionne correctement.

```bash
# Télécharge et lance le conteneur de test hello-world
podman run hello-world
```

**Résultat attendu** :

```text
Resolved "hello-world" as an alias (/etc/containers/registries.conf.d/...)
Trying to pull docker.io/library/hello-world:latest...
Getting image source signatures
Copying blob sha256:...
Writing manifest to image destination
Storing signatures

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.
```

Le message dit "Hello from Docker!" car cette image a été créée pour Docker. Elle fonctionne de la même façon avec Podman grâce à la compatibilité des formats d'images.

Si tu vois ce message, Podman fonctionne correctement.

---

### Étape 5 : Comparer avec Docker

Podman utilise les mêmes commandes que Docker. Voici des exemples qui le démontrent.

**Lister les images téléchargées** :

```bash
# Liste toutes les images présentes sur ta machine
podman images
```

**Résultat attendu** :

```text
REPOSITORY                     TAG       IMAGE ID       CREATED       SIZE
docker.io/library/hello-world  latest    d2c94e258dcb   9 months ago  13.3 kB
```

Tu vois l'image `hello-world` que tu viens de télécharger.

**Lister tous les conteneurs (y compris les arrêtés)** :

```bash
# Liste tous les conteneurs, y compris ceux qui sont arrêtés
podman ps -a
```

**Résultat attendu** :

```text
CONTAINER ID  IMAGE                                 COMMAND  CREATED         STATUS                     NAMES
a1b2c3d4e5f6  docker.io/library/hello-world:latest  /hello   2 minutes ago   Exited (0) 2 minutes ago   brave_newton
```

La colonne **STATUS** montre `Exited (0)`. Cela signifie que le conteneur s'est arrêté sans erreur (code 0 = succès). Le conteneur `hello-world` affiche son message puis s'arrête automatiquement.

**Supprimer le conteneur arrêté** :

```bash
# Supprime le conteneur (remplace a1b2c3d4e5f6 par ton CONTAINER ID)
podman rm a1b2c3d4e5f6
```

Tu peux aussi utiliser le nom du conteneur au lieu de l'ID :

```bash
# Supprime le conteneur par son nom
podman rm brave_newton
```

Ces commandes sont identiques à leurs équivalents Docker (`docker images`, `docker ps -a`, `docker rm`).

---

## Commandes Utiles

| Commande                    | Action                                                         |
| --------------------------- | -------------------------------------------------------------- |
| `podman --version`          | Affiche la version de Podman installée                         |
| `podman info`               | Affiche les informations détaillées de l'installation          |
| `podman run <image>`        | Télécharge (si nécessaire) et lance un conteneur               |
| `podman ps`                 | Liste les conteneurs en cours d'exécution                      |
| `podman ps -a`              | Liste tous les conteneurs (y compris les arrêtés)              |
| `podman images`             | Liste les images téléchargées sur ta machine                   |
| `podman stop <conteneur>`   | Arrête un conteneur en cours d'exécution                       |
| `podman rm <conteneur>`     | Supprime un conteneur arrêté                                   |
| `podman rmi <image>`        | Supprime une image                                             |
| `podman machine init`       | Crée la machine virtuelle Podman (macOS et Windows)            |
| `podman machine start`      | Démarre la machine virtuelle Podman (macOS et Windows)         |
| `podman machine stop`       | Arrête la machine virtuelle Podman (macOS et Windows)          |
| `podman machine rm`         | Supprime la machine virtuelle Podman (macOS et Windows)        |

---

## Pièges Fréquents

### Piège 1 : Machine Podman non démarrée (macOS)

**Problème** : Sur macOS, tu lances une commande Podman et tu obtiens cette erreur :

```text
Cannot connect to Podman. Is Podman running?
Error: unable to connect to Podman socket
```

**Explication** : Sur macOS, Podman a besoin d'une machine virtuelle Linux pour fonctionner. Cette machine doit être démarrée avant de pouvoir utiliser Podman.

**Solution** : Démarre la machine Podman :

```bash
# Démarre la machine virtuelle Podman
podman machine start
```

**Résultat attendu** :

```text
Starting machine "podman-machine-default"
Machine "podman-machine-default" started successfully
```

Pour vérifier l'état de la machine :

```bash
# Affiche l'état de la machine Podman
podman machine list
```

```text
NAME                     VM TYPE     CREATED        LAST UP            CPUS        MEMORY      DISK SIZE
podman-machine-default*  applehv     2 hours ago    Currently running  1           2.147GB     107.4GB
```

La colonne **LAST UP** doit afficher `Currently running`.

---

### Piège 2 : Erreur de registre d'images

**Problème** : Tu lances `podman pull nginx` et tu obtiens cette erreur :

```text
Error: short-name "nginx" did not resolve to an alias and no unqualified-search registries are defined in "/etc/containers/registries.conf"
```

**Explication** : Contrairement à Docker, Podman ne cherche pas automatiquement sur `docker.io` quand tu donnes un nom court d'image (comme `nginx` au lieu de `docker.io/library/nginx`). Podman veut savoir exactement d'où vient l'image.

**Solution 1** : Utilise le chemin complet de l'image :

```bash
# Spécifie le registre complet
podman pull docker.io/library/nginx
```

**Solution 2** : Configure les registres de recherche. Crée ou modifie le fichier de configuration :

Sur Linux, le fichier est `/etc/containers/registries.conf`.
Sur macOS, le fichier est dans la machine Podman.

```bash
# Édite la configuration des registres (Linux)
sudo nano /etc/containers/registries.conf
```

Ajoute ou vérifie cette ligne :

```ini
unqualified-search-registries = ["docker.io", "quay.io"]
```

Cette ligne indique à Podman de chercher les images sur `docker.io` et `quay.io` quand tu donnes un nom court.

Après cette configuration, `podman pull nginx` fonctionnera comme `docker pull nginx`.

---

### Piège 3 : Confusion entre daemon Docker et Podman

**Problème** : Tu cherches comment "démarrer le service Podman" ou "lancer le daemon Podman", comme tu le ferais avec Docker (`sudo systemctl start docker`).

**Explication** : Podman n'a pas de daemon. C'est l'une de ses différences fondamentales avec Docker. Il n'y a pas de processus en arrière-plan à démarrer ou arrêter.

**Solution** : Avec Podman, tu lances directement les commandes. Pas besoin de démarrer un service au préalable.

- Sur Linux : tape directement `podman run ...`, `podman ps`, etc.
- Sur macOS : la seule chose à démarrer est la machine virtuelle (`podman machine start`), mais ce n'est pas un daemon. C'est la VM Linux qui exécute les conteneurs.

| Docker                                | Podman                                 |
| ------------------------------------- | -------------------------------------- |
| `sudo systemctl start docker`         | Rien à faire (pas de daemon)           |
| `sudo systemctl stop docker`          | Rien à faire (pas de daemon)           |
| `sudo systemctl enable docker`        | Rien à faire (pas de daemon)           |
| Le daemon doit tourner en permanence  | Podman fonctionne à la demande         |

---

## Checklist de Validation

- [ ] Podman est installé et `podman --version` affiche un numéro de version
- [ ] `podman info` fonctionne sans erreur et affiche les informations du système
- [ ] Le conteneur `hello-world` s'est lancé avec succès et a affiché son message
- [ ] Je comprends la différence principale entre Podman et Docker (pas de daemon, rootless par défaut)
- [ ] Je sais que les commandes Podman et Docker sont identiques dans la majorité des cas

---

## Exercice Pratique

**Énoncé** : Installe Podman, lance le conteneur `hello-world`, puis lance un conteneur Nginx en arrière-plan sur le port 8080. Vérifie qu'il répond, puis arrête-le et supprime-le.

**Indications** :

- Utilise `podman run` avec l'option `-d` pour lancer en arrière-plan (mode détaché)
- Utilise l'option `-p` pour mapper un port de ta machine vers le port du conteneur
- Nginx écoute par défaut sur le port 80 à l'intérieur du conteneur
- Utilise `curl` pour vérifier que Nginx répond
- Utilise `podman stop` pour arrêter le conteneur
- Utilise `podman rm` pour supprimer le conteneur arrêté

**Résultat attendu** :

- Le conteneur `hello-world` affiche son message de bienvenue
- Le conteneur Nginx tourne en arrière-plan
- `curl http://localhost:8080` affiche la page d'accueil Nginx (du HTML)
- Le conteneur Nginx est arrêté et supprimé
- `podman ps -a` ne montre plus le conteneur Nginx

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Partie 1 : Lancer hello-world**

```bash
# Lance le conteneur hello-world
podman run docker.io/library/hello-world
```

**Résultat attendu** :

```text
Hello from Docker!
This message shows that your installation appears to be working correctly.
...
```

---

**Partie 2 : Lancer Nginx en arrière-plan sur le port 8080**

```bash
# Lance Nginx en arrière-plan (-d) avec le port 8080 de ta machine
# mappé vers le port 80 du conteneur (-p 8080:80)
# --name mon-nginx donne un nom au conteneur pour le retrouver facilement
podman run -d --name mon-nginx -p 8080:80 docker.io/library/nginx
```

Explication des options :

- `-d` : mode détaché (le conteneur tourne en arrière-plan, tu récupères ton terminal)
- `--name mon-nginx` : donne le nom "mon-nginx" au conteneur (plus facile à utiliser qu'un ID)
- `-p 8080:80` : redirige le port 8080 de ta machine vers le port 80 du conteneur
- `docker.io/library/nginx` : chemin complet de l'image Nginx officielle

**Résultat attendu** :

```text
Resolved "docker.io/library/nginx" as an alias...
Trying to pull docker.io/library/nginx:latest...
Getting image source signatures
Copying blob sha256:...
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

La longue chaîne de caractères à la fin est l'identifiant du conteneur. Le terminal est disponible immédiatement (grâce à `-d`).

---

**Partie 3 : Vérifier que le conteneur tourne**

```bash
# Liste les conteneurs en cours d'exécution
podman ps
```

**Résultat attendu** :

```text
CONTAINER ID  IMAGE                           COMMAND               CREATED         STATUS         PORTS                 NAMES
a1b2c3d4e5f6  docker.io/library/nginx:latest  nginx -g daemon o...  30 seconds ago  Up 30 seconds  0.0.0.0:8080->80/tcp  mon-nginx
```

Le conteneur `mon-nginx` est bien en cours d'exécution (STATUS = `Up`).

---

**Partie 4 : Vérifier que Nginx répond**

```bash
# Envoie une requête HTTP à Nginx sur le port 8080
curl http://localhost:8080
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html>
<head>
<title>Welcome to nginx!</title>
...
</head>
<body>
<h1>Welcome to nginx!</h1>
<p>If you see this page, the nginx web server is successfully installed and
working. Further configuration is required.</p>
...
</body>
</html>
```

Si tu vois ce HTML, Nginx fonctionne correctement dans ton conteneur Podman.

---

**Partie 5 : Arrêter le conteneur**

```bash
# Arrête le conteneur mon-nginx
podman stop mon-nginx
```

**Résultat attendu** :

```text
mon-nginx
```

Podman affiche le nom du conteneur arrêté.

---

**Partie 6 : Supprimer le conteneur**

```bash
# Supprime le conteneur arrêté
podman rm mon-nginx
```

**Résultat attendu** :

```text
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0e1f2
```

Podman affiche l'identifiant du conteneur supprimé.

---

**Partie 7 : Vérifier que le conteneur est bien supprimé**

```bash
# Liste tous les conteneurs (y compris les arrêtés)
podman ps -a
```

**Résultat attendu** :

```text
CONTAINER ID  IMAGE                                 COMMAND  CREATED        STATUS                     NAMES
b2c3d4e5f6g7  docker.io/library/hello-world:latest  /hello   10 minutes ago  Exited (0) 10 minutes ago  gallant_morse
```

Seul le conteneur `hello-world` reste (car tu ne l'as pas supprimé). Le conteneur `mon-nginx` n'apparaît plus.

Pour supprimer aussi le conteneur `hello-world` :

```bash
# Supprime tous les conteneurs arrêtés
podman rm -a
```

---

**Récapitulatif des commandes de l'exercice** :

| Étape                        | Commande                                                            |
| ---------------------------- | ------------------------------------------------------------------- |
| Lancer hello-world           | `podman run docker.io/library/hello-world`                          |
| Lancer Nginx en arrière-plan | `podman run -d --name mon-nginx -p 8080:80 docker.io/library/nginx` |
| Vérifier les conteneurs      | `podman ps`                                                         |
| Tester Nginx                 | `curl http://localhost:8080`                                        |
| Arrêter Nginx                | `podman stop mon-nginx`                                             |
| Supprimer Nginx              | `podman rm mon-nginx`                                               |
| Vérifier la suppression      | `podman ps -a`                                                      |

---

## Navigation

→ Fiche suivante : **[Gérer les Images et les Conteneurs](02-images-conteneurs.md)**
