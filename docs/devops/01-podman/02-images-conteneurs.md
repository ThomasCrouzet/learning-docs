---
tags:
  - Podman
  - Débutant
  - Pratique
description: "Gérer les Images et les Conteneurs"
estimated_time: "130 min"
fiche_number: 2
total_fiches: 5
cursus: "Podman"
---

# 02 - Gérer les Images et les Conteneurs

> **En bref** : À la fin de cette fiche, tu sauras télécharger des images, créer/démarrer/arrêter des conteneurs, et construire tes propres images avec un Containerfile. Lecture estimée : 130 min.


## Prérequis

- Fiche [01 - Introduction à Podman](01-introduction-podman.md) lue et comprise
- Podman installé et fonctionnel sur ta machine
- Savoir utiliser le terminal (commandes `cd`, `ls`, `pwd`)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Podman | 5.x (exemples compatibles 4.x+) |
| PHP | 8.3 |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras télécharger des images, créer/démarrer/arrêter des conteneurs, et construire tes propres images avec un Containerfile.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un registre d'images ?

**Définition** : Un registre d'images est un serveur distant qui stocke et distribue des images de conteneurs. C'est l'endroit où tu télécharges les images dont tu as besoin.

**Le problème que les registres résolvent** :

Sans registres, voici les problèmes rencontrés :

1. **Pas d'images disponibles** : Tu devrais construire chaque image de zéro, y compris le système d'exploitation minimal, PHP, Nginx, PostgreSQL. Cela prendrait des heures.

2. **Pas de partage** : Impossible de partager tes images avec d'autres personnes ou d'utiliser des images créées par des experts.

3. **Pas de versions** : Sans système centralisé, tu ne saurais pas quelle version d'une image est la plus récente ou la plus stable.

**Comment les registres résolvent ces problèmes** :

| Problème | Solution apportée par les registres |
| --- | --- |
| Pas d'images disponibles | Des milliers d'images prêtes à l'emploi sont disponibles |
| Pas de partage | N'importe qui peut publier et télécharger des images |
| Pas de versions | Chaque image est étiquetée avec un numéro de version (tag) |

**Les trois registres principaux** :

| Registre | Maintenu par | Images principales | Utilisation |
| --- | --- | --- | --- |
| `quay.io` | Red Hat | Images Red Hat, Fedora, CentOS | Registre Red Hat public |
| `docker.io` | Docker Inc. | Images officielles (nginx, php, postgres) | Le plus grand registre public |
| `ghcr.io` | GitHub | Images liées à des projets GitHub | Registre lié à GitHub |

**Où Podman cherche les images** :

Quand tu tapes `podman pull nginx`, Podman cherche l'image dans plusieurs registres. L'ordre de recherche est configuré dans le fichier `/etc/containers/registries.conf`.

La liste des registres dépend de ta distribution Linux :

- **Fedora** : `registry.fedoraproject.org`, `registry.access.redhat.com`, `docker.io`
- **RHEL** : `registry.access.redhat.com`, `registry.redhat.io`, `docker.io`
- **macOS (Homebrew)** : la machine virtuelle Podman utilise Fedora CoreOS, donc la liste Fedora s'applique

Pour éviter toute ambiguïté, précise toujours le registre complet dans la commande. Par exemple : `podman pull docker.io/library/nginx:alpine`.

**Analogie concrète** : Un registre d'images fonctionne comme une bibliothèque municipale. Chaque livre dans la bibliothèque est une image. Tu peux emprunter un livre (télécharger une image), le lire (utiliser l'image pour créer un conteneur), et le rendre (supprimer l'image locale). La bibliothèque garde toujours un exemplaire disponible pour les autres emprunteurs.

**Ce qu'un registre n'est PAS** :

- Un registre n'est pas un hébergeur de code source. GitHub héberge du code source (fichiers `.php`, `.js`, etc.). Un registre héberge des images de conteneurs (systèmes de fichiers complets prêts à être exécutés).
- Un registre n'est pas un CDN (réseau de distribution de contenu). Un CDN distribue des fichiers statiques (images, CSS, JavaScript) aux visiteurs d'un site web. Un registre distribue des images de conteneurs aux développeurs.

---

### Qu'est-ce qu'un Containerfile ?

**Définition** : Un Containerfile est un fichier texte qui contient les instructions pour construire une image de conteneur. La syntaxe est identique à celle d'un Dockerfile.

**Le problème que le Containerfile résout** :

Sans Containerfile, voici les problèmes rencontrés :

1. **Pas d'automatisation** : Tu devrais installer manuellement chaque outil dans un conteneur, puis sauvegarder l'état. C'est long et source d'erreurs.

2. **Pas de reproductibilité** : Si tu installes les outils à la main, tu risques d'oublier une étape. Le résultat sera différent à chaque fois.

3. **Pas de documentation** : Sans fichier écrit, personne ne sait comment l'image a été construite. Impossible de la reconstruire si elle est perdue.

**Comment le Containerfile résout ces problèmes** :

| Problème | Solution apportée par le Containerfile |
| --- | --- |
| Pas d'automatisation | Chaque instruction est exécutée automatiquement par Podman |
| Pas de reproductibilité | Le même Containerfile produit toujours la même image |
| Pas de documentation | Le Containerfile documente chaque étape de construction |

**Containerfile vs Dockerfile** :

| Caractéristique | Containerfile | Dockerfile |
| --- | --- | --- |
| Nom du fichier | `Containerfile` | `Dockerfile` |
| Syntaxe | Identique | Identique |
| Utilisé par | Podman (recommandé), Buildah | Docker |
| Accepté par Podman | Oui | Oui |

Red Hat utilise le nom "Containerfile" pour se distinguer de Docker. Mais la syntaxe est strictement identique. Podman reconnaît les deux noms de fichier. Dans cette fiche, nous utilisons "Containerfile" car c'est le nom recommandé pour Podman.

**Les instructions principales du Containerfile** :

| Instruction | Rôle | Exemple |
| --- | --- | --- |
| `FROM` | Image de base sur laquelle construire | `FROM php:8.3-cli` |
| `RUN` | Exécute une commande pendant la construction | `RUN apt-get update` |
| `COPY` | Copie un fichier de ta machine dans l'image | `COPY index.php /app/` |
| `WORKDIR` | Définit le répertoire de travail | `WORKDIR /app` |
| `EXPOSE` | Documente le port utilisé (informatif) | `EXPOSE 8080` |
| `CMD` | Commande exécutée au démarrage du conteneur | `CMD ["php", "-S", "0.0.0.0:8080"]` |
| `ENV` | Définit une variable d'environnement | `ENV APP_ENV=prod` |

**Analogie concrète** : Un Containerfile fonctionne comme un plan de montage d'un meuble IKEA. Le plan liste les étapes dans un ordre précis : d'abord tu prépares les pièces (FROM), tu assembles la structure (RUN), tu ajoutes les étagères (COPY), tu choisis où le placer (WORKDIR), et tu notes les dimensions sur la boîte (EXPOSE). Si tu suis le même plan deux fois, tu obtiens deux meubles identiques.

**Ce qu'un Containerfile n'est PAS** :

- Un Containerfile n'est pas un script shell. Un script shell est exécuté en une seule fois. Un Containerfile est lu par Podman instruction par instruction, et chaque instruction crée une couche (_layer_) dans l'image.
- Un Containerfile n'est pas un fichier de configuration. Il ne configure pas un logiciel existant. Il construit une image à partir de zéro (ou presque).

---

### Qu'est-ce que le mode rootless ?

**Définition** : Le mode rootless est la capacité d'exécuter des conteneurs sans avoir besoin des droits administrateur (root) sur la machine hôte.

**Le problème que le mode rootless résout** :

Sans mode rootless, voici les problèmes rencontrés :

1. **Faille de sécurité** : Docker nécessite un daemon qui tourne en root (administrateur). Si un attaquant exploite une faille dans un conteneur, il obtient les droits root sur la machine hôte. C'est une faille de sécurité majeure.

2. **Dépendance au daemon** : Docker utilise un processus central (le daemon) pour gérer tous les conteneurs. Si le daemon plante, tous les conteneurs s'arrêtent.

3. **Droits administrateur requis** : Sur un serveur partagé ou une machine d'entreprise, tu n'as pas toujours les droits root. Avec Docker, tu ne peux pas lancer de conteneurs sans ces droits.

**Comment le mode rootless résout ces problèmes** :

| Problème | Solution apportée par le mode rootless |
| --- | --- |
| Faille de sécurité | Le conteneur tourne avec les droits de ton utilisateur, pas en root |
| Dépendance au daemon | Podman n'a pas de daemon central, chaque conteneur est indépendant |
| Droits administrateur requis | Tu peux lancer des conteneurs avec ton compte utilisateur normal |

**Conséquence importante : les ports** :

En mode rootless, les ports inférieurs à 1024 (comme le port 80 pour HTTP ou 443 pour HTTPS) ne sont pas accessibles. Ces ports sont réservés au système et nécessitent les droits root.

**Solutions** :

- Utiliser un port supérieur à 1024 (par exemple 8080 au lieu de 80)
- Sur Linux, autoriser les ports bas : `sudo sysctl net.ipv4.ip_unprivileged_port_start=80`

**Comparaison rootless vs rootful** :

| Caractéristique | Rootless (sans root) | Rootful (avec root) |
| --- | --- | --- |
| Sécurité | Élevée (droits utilisateur) | Risquée (droits root) |
| Ports < 1024 | Non accessibles par défaut | Accessibles |
| Volumes système | Restrictions sur certains chemins | Accès complet |
| Performance | Légèrement plus lent (couche UID mapping) | Pleine vitesse |
| Recommandation | Mode par défaut et recommandé | Uniquement si nécessaire |

**Analogie concrète** : Le mode rootless fonctionne comme un employé dans un bureau. Un employé normal (rootless) peut travailler à son poste, utiliser son ordinateur, accéder à ses fichiers. Mais il ne peut pas entrer dans la salle serveur ni modifier la configuration réseau. Le directeur (rootful) a accès à tout, mais s'il perd ses clés, n'importe qui peut entrer partout.

**Ce que le mode rootless n'est PAS** :

- Le mode rootless n'est pas un mode dégradé ou limité. C'est le mode recommandé par Red Hat et la communauté Podman. La grande majorité des cas d'utilisation fonctionnent parfaitement en rootless.
- Le mode rootless ne signifie pas que le conteneur n'a pas de root interne. À l'intérieur du conteneur, le processus peut tourner en tant que root. Mais ce root interne est _mappé_ vers ton utilisateur normal sur la machine hôte.

---

### Quel est le cycle de vie d'un conteneur Podman ?

**Définition** : Le cycle de vie d'un conteneur est l'ensemble des états par lesquels un conteneur passe, de sa création à sa suppression.

**Le problème que la compréhension du cycle de vie résout** :

Sans comprendre le cycle de vie, voici les problèmes rencontrés :

1. **Conteneurs oubliés** : Tu lances des conteneurs et tu oublies de les arrêter. Ils consomment des ressources (mémoire, CPU) en arrière-plan.

2. **Données perdues** : Tu supprimes un conteneur en pensant qu'il était juste arrêté. Les données non sauvegardées dans un volume sont perdues.

3. **Erreurs de commandes** : Tu essaies de démarrer un conteneur qui n'existe pas encore, ou de créer un conteneur avec un nom déjà utilisé.

**Comment la compréhension du cycle de vie résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Conteneurs oubliés | Tu sais lister et arrêter les conteneurs en cours d'exécution |
| Données perdues | Tu sais qu'un conteneur arrêté conserve ses données, mais un conteneur supprimé les perd |
| Erreurs de commandes | Tu sais quelle commande utiliser à chaque étape |

**Les quatre états d'un conteneur** :

```text
  Created ──────> Running ──────> Stopped ──────> Removed
  (créé)         (en cours)      (arrêté)        (supprimé)
     │               │               │
     │               │               │
     │               │               └── podman rm
     │               │
     │               └── podman stop
     │
     └── podman create
             ou
         podman run (crée + démarre)
```

**Détail de chaque état** :

| État | Description | Le conteneur consomme des ressources ? |
| --- | --- | --- |
| Created | Le conteneur existe mais n'est pas démarré | Non (seulement du disque) |
| Running | Le conteneur est en cours d'exécution | Oui (CPU, mémoire, réseau) |
| Stopped | Le conteneur est arrêté mais existe encore | Non (seulement du disque) |
| Removed | Le conteneur est supprimé définitivement | Non (rien) |

**Commandes pour chaque transition** :

| Transition | Commande | Explication |
| --- | --- | --- |
| Rien vers Created | `podman create` | Crée le conteneur sans le démarrer |
| Rien vers Running | `podman run` | Crée et démarre le conteneur en une seule commande |
| Created vers Running | `podman start` | Démarre un conteneur déjà créé |
| Running vers Stopped | `podman stop` | Arrête le conteneur proprement |
| Stopped vers Running | `podman start` | Redémarre un conteneur arrêté |
| Stopped vers Removed | `podman rm` | Supprime définitivement le conteneur |
| Running vers Removed | `podman rm -f` | Force la suppression d'un conteneur en cours d'exécution |

**Analogie concrète** : Le cycle de vie d'un conteneur fonctionne comme un trajet en voiture de location. Tu _réserves_ la voiture (Created) : elle est prête mais tu ne roules pas encore. Tu _démarres_ la voiture (Running) : tu roules et tu consommes de l'essence. Tu _gares_ la voiture (Stopped) : elle est à l'arrêt mais elle est toujours louée à ton nom. Tu _rends_ la voiture (Removed) : elle ne t'appartient plus, un autre client peut la louer.

**Ce que le cycle de vie n'est PAS** :

- Le cycle de vie n'est pas linéaire obligatoirement. Tu peux passer de Stopped à Running plusieurs fois avant de supprimer le conteneur.
- Le cycle de vie n'est pas spécifique à Podman. Docker utilise les mêmes états. La seule différence est le nom des commandes (qui sont identiques dans ce cas).

Le schéma suivant résume le cycle de vie d'une image et d'un conteneur Podman :

<div class="diagram-design">
<p><a href="../../../diagrams/devops-01-podman-02-images-conteneurs-1.html">Quel est le cycle de vie d&#x27;un conteneur Podman ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-01-podman-02-images-conteneurs-1.html" title="Quel est le cycle de vie d&#x27;un conteneur Podman ?" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

Le Containerfile est la source. La commande `podman build` produit une image. Depuis cette image, `podman run` crée un conteneur actif. Le conteneur peut être arrêté, redémarré ou supprimé. L'image peut aussi être publiée vers un registry avec `podman push`.

---

## Étapes Pratiques

### Étape 1 : Télécharger une image

Cette étape télécharge une image Nginx depuis le registre Docker Hub.

Commande :

```bash
# Télécharger l'image Nginx en version Alpine (légère)
podman pull docker.io/library/nginx:alpine
```

**Résultat attendu** :

```text
Trying to pull docker.io/library/nginx:alpine...
Getting image source signatures
Copying blob sha256:abcdef123456
Copying config sha256:789abc...
Writing manifest to image destination
Storing signatures
abcdef123456789
```

**Vérification** : Vérifie que l'image est bien présente sur ta machine :

```bash
# Lister toutes les images présentes sur ta machine
podman images
```

**Résultat attendu** :

```text
REPOSITORY                  TAG       IMAGE ID       CREATED        SIZE
docker.io/library/nginx     alpine    a1b2c3d4e5f6   2 weeks ago    43.2 MB
```

**Explication de chaque colonne** :

| Colonne | Signification |
| --- | --- |
| REPOSITORY | Nom complet de l'image (registre + nom) |
| TAG | Version de l'image (ici `alpine` = version légère) |
| IMAGE ID | Identifiant unique de l'image (12 premiers caractères) |
| CREATED | Date de création de l'image par son auteur |
| SIZE | Taille de l'image sur le disque |

---

### Étape 2 : Lancer un conteneur depuis cette image

Cette étape crée et démarre un conteneur Nginx accessible depuis ton navigateur.

Commande :

```bash
# Lancer un conteneur Nginx en arrière-plan
# -d : mode détaché (le terminal reste libre)
# --name : donne un nom au conteneur (plus facile à gérer)
# -p 8080:80 : redirige le port 8080 de ta machine vers le port 80 du conteneur
podman run -d --name mon-nginx -p 8080:80 docker.io/library/nginx:alpine
```

**Explication de chaque option** :

| Option | Signification |
| --- | --- |
| `-d` | Mode détaché : le conteneur tourne en arrière-plan |
| `--name mon-nginx` | Donne le nom "mon-nginx" au conteneur |
| `-p 8080:80` | Redirige le port 8080 (ta machine) vers le port 80 (conteneur) |
| `docker.io/library/nginx:alpine` | Image à utiliser pour créer le conteneur |

**Résultat attendu** :

```text
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

Podman affiche l'identifiant complet du conteneur. C'est normal.

**Vérification** : Vérifie que le conteneur tourne :

```bash
# Lister les conteneurs en cours d'exécution
podman ps
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE                              COMMAND                  CREATED         STATUS         PORTS                  NAMES
a1b2c3d4e5f6   docker.io/library/nginx:alpine     "/docker-entrypoint.…"   5 seconds ago   Up 5 seconds   0.0.0.0:8080->80/tcp   mon-nginx
```

**Vérification dans le navigateur** : Ouvre un navigateur et va à l'adresse `http://localhost:8080`. Tu dois voir la page d'accueil de Nginx.

Tu peux aussi vérifier avec `curl` dans le terminal :

```bash
# Envoyer une requête HTTP à ton conteneur Nginx
curl http://localhost:8080
```

**Résultat attendu** : Du code HTML contenant "Welcome to nginx!".

---

### Étape 3 : Gérer le conteneur

Cette étape montre comment arrêter, redémarrer et supprimer un conteneur.

**3a. Arrêter le conteneur** :

```bash
# Arrêter le conteneur proprement
podman stop mon-nginx
```

**Résultat attendu** :

```text
mon-nginx
```

Podman affiche le nom du conteneur arrêté. Vérifie qu'il n'apparaît plus dans la liste des conteneurs actifs :

```bash
# Lister les conteneurs en cours d'exécution
podman ps
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

La liste est vide : le conteneur est arrêté.

**3b. Voir les conteneurs arrêtés** :

```bash
# Lister TOUS les conteneurs (y compris les arrêtés)
# -a : affiche tous les conteneurs, pas seulement ceux en cours d'exécution
podman ps -a
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE                              COMMAND                  CREATED          STATUS                     PORTS   NAMES
a1b2c3d4e5f6   docker.io/library/nginx:alpine     "/docker-entrypoint.…"   2 minutes ago    Exited (0) 30 seconds ago          mon-nginx
```

Le statut est "Exited" : le conteneur existe encore mais il est arrêté.

**3c. Redémarrer le conteneur** :

```bash
# Redémarrer un conteneur arrêté
podman start mon-nginx
```

**Résultat attendu** :

```text
mon-nginx
```

Le conteneur tourne à nouveau. Tu peux le vérifier avec `podman ps`.

**3d. Supprimer le conteneur** :

Pour supprimer un conteneur, il faut d'abord l'arrêter :

```bash
# Arrêter puis supprimer le conteneur
podman stop mon-nginx
podman rm mon-nginx
```

**Résultat attendu** :

```text
mon-nginx
mon-nginx
```

Chaque commande affiche le nom du conteneur traité.

**Vérification** : Vérifie que le conteneur n'existe plus :

```bash
# Vérifier que le conteneur est bien supprimé
podman ps -a
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE   COMMAND   CREATED   STATUS   PORTS   NAMES
```

La liste est vide : le conteneur est définitivement supprimé.

---

### Étape 4 : Créer un Containerfile PHP

Cette étape crée une image personnalisée contenant PHP et un fichier `index.php`.

**4a. Créer le dossier de travail** :

```bash
# Créer un dossier pour le projet
mkdir -p ~/mon-projet-php
cd ~/mon-projet-php
```

**4b. Créer le fichier `index.php`** :

Crée un fichier `index.php` dans le dossier `~/mon-projet-php` avec ce contenu :

```php
<?php
// Ce script affiche un message dans le navigateur
echo "Bonjour depuis Podman !";
```

**4c. Créer le Containerfile** :

Crée un fichier nommé `Containerfile` (sans extension) dans le même dossier avec ce contenu :

```dockerfile
# Étape 1 : Choisir l'image de base
# php:8.3-cli contient PHP 8.3 en mode ligne de commande (CLI)
# CLI inclut le serveur web intégré de PHP (suffisant pour le développement)
FROM docker.io/library/php:8.3-cli

# Étape 2 : Définir le répertoire de travail dans le conteneur
# Toutes les commandes suivantes s'exécuteront dans ce dossier
WORKDIR /app

# Étape 3 : Copier le fichier index.php de ta machine dans le conteneur
# Le premier argument (index.php) est le fichier sur ta machine
# Le second argument (.) signifie "dans le répertoire de travail" (/app)
COPY index.php .

# Étape 4 : Documenter le port utilisé
# EXPOSE ne publie pas le port, il documente quel port l'application utilise
# Le serveur PHP intégré écoutera sur le port 8080
EXPOSE 8080

# Étape 5 : Définir la commande exécutée au démarrage du conteneur
# php -S : lance le serveur web intégré de PHP
# 0.0.0.0 : écoute sur toutes les interfaces réseau (nécessaire dans un conteneur)
# :8080 : sur le port 8080
# -t /app : sert les fichiers du dossier /app
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/app"]
```

**Structure du dossier à ce stade** :

```text
~/mon-projet-php/
├── Containerfile      # Instructions pour construire l'image
└── index.php          # Fichier PHP à exécuter
```

---

### Étape 5 : Construire l'image

Cette étape utilise le Containerfile pour construire une image personnalisée.

Commande :

```bash
# Se placer dans le dossier contenant le Containerfile
cd ~/mon-projet-php

# Construire l'image
# -t mon-php:1.0 : donne un nom (mon-php) et un tag (1.0) à l'image
# . : indique que le contexte de construction est le dossier courant
podman build -t mon-php:1.0 .
```

**Résultat attendu** :

```text
STEP 1/5: FROM docker.io/library/php:8.3-cli
Trying to pull docker.io/library/php:8.3-cli...
Getting image source signatures
Copying blob sha256:...
...
STEP 2/5: WORKDIR /app
--> abc1234def
STEP 3/5: COPY index.php .
--> 567890abcd
STEP 4/5: EXPOSE 8080
--> ef1234567
STEP 5/5: CMD ["php", "-S", "0.0.0.0:8080", "-t", "/app"]
COMMIT mon-php:1.0
--> 890abcdef1
Successfully tagged localhost/mon-php:1.0
890abcdef1234567890abcdef1234567890abcdef1234567890abcdef12345678
```

Podman affiche chaque étape du Containerfile. Le message "Successfully tagged" confirme que l'image est créée.

**Vérification** : Vérifie que l'image est présente :

```bash
# Lister les images
podman images
```

**Résultat attendu** :

```text
REPOSITORY                  TAG       IMAGE ID       CREATED          SIZE
localhost/mon-php            1.0       890abcdef1     10 seconds ago   500 MB
docker.io/library/php       8.3-cli   fedcba987654   3 weeks ago      498 MB
docker.io/library/nginx     alpine    a1b2c3d4e5f6   2 weeks ago      43.2 MB
```

L'image `localhost/mon-php` avec le tag `1.0` est présente. Sa taille est proche de l'image PHP de base car elle n'ajoute qu'un petit fichier.

---

### Étape 6 : Lancer le conteneur depuis l'image personnalisée

Cette étape lance un conteneur à partir de l'image que tu viens de construire.

Commande :

```bash
# Lancer le conteneur en arrière-plan
# -d : mode détaché
# --name php-app : nom du conteneur
# -p 8080:8080 : port 8080 de ta machine vers port 8080 du conteneur
podman run -d --name php-app -p 8080:8080 mon-php:1.0
```

**Résultat attendu** :

```text
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

**Vérification** :

```bash
# Vérifier que le conteneur tourne
podman ps
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE                    COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   localhost/mon-php:1.0    "php -S 0.0.0.0:808…"   5 seconds ago   Up 5 seconds   0.0.0.0:8080->8080/tcp   php-app
```

**Vérification dans le navigateur** : Ouvre un navigateur et va à l'adresse `http://localhost:8080`. Tu dois voir le message "Bonjour depuis Podman !".

Tu peux aussi vérifier avec `curl` :

```bash
# Envoyer une requête HTTP au conteneur PHP
curl http://localhost:8080
```

**Résultat attendu** :

```text
Bonjour depuis Podman !
```

**Consulter les logs du conteneur** :

Si le message n'apparaît pas, consulte les logs pour comprendre le problème :

```bash
# Afficher les logs du conteneur
podman logs php-app
```

**Résultat attendu** :

```text
[Tue Oct 15 14:30:00 2024] PHP 8.3.0 Development Server (http://0.0.0.0:8080) started
[Tue Oct 15 14:30:05 2024] 10.0.2.100:54321 Accepted
[Tue Oct 15 14:30:05 2024] 10.0.2.100:54321 [200]: GET /
```

---

### Étape 7 : Nettoyer

Cette étape supprime le conteneur et les images pour libérer de l'espace disque.

**7a. Arrêter et supprimer le conteneur** :

```bash
# Arrêter le conteneur
podman stop php-app

# Supprimer le conteneur
podman rm php-app
```

**Résultat attendu** :

```text
php-app
php-app
```

**7b. Supprimer les images** :

```bash
# Supprimer l'image personnalisée
podman rmi mon-php:1.0

# Supprimer l'image Nginx (si tu n'en as plus besoin)
podman rmi docker.io/library/nginx:alpine

# Supprimer l'image PHP (si tu n'en as plus besoin)
podman rmi docker.io/library/php:8.3-cli
```

**Résultat attendu** : Podman affiche l'identifiant de chaque image supprimée.

**7c. Vérifier que tout est nettoyé** :

```bash
# Vérifier qu'il n'y a plus de conteneurs
podman ps -a

# Vérifier qu'il n'y a plus d'images
podman images
```

**Résultat attendu** : Les deux listes sont vides.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `podman pull <image>` | Télécharger une image depuis un registre |
| `podman images` | Lister toutes les images présentes sur ta machine |
| `podman run -d --name <nom> -p <port_hôte>:<port_conteneur> <image>` | Créer et lancer un conteneur en arrière-plan |
| `podman ps` | Lister les conteneurs en cours d'exécution |
| `podman ps -a` | Lister tous les conteneurs (y compris les arrêtés) |
| `podman stop <nom>` | Arrêter un conteneur |
| `podman start <nom>` | Démarrer un conteneur arrêté |
| `podman rm <nom>` | Supprimer un conteneur arrêté |
| `podman rm -f <nom>` | Forcer la suppression d'un conteneur (même en cours d'exécution) |
| `podman rmi <image>` | Supprimer une image |
| `podman build -t <nom>:<tag> .` | Construire une image depuis un Containerfile |
| `podman inspect <nom>` | Afficher les détails d'un conteneur ou d'une image (format JSON) |
| `podman logs <nom>` | Afficher les logs d'un conteneur |
| `podman logs -f <nom>` | Suivre les logs en temps réel (Ctrl+C pour arrêter) |

---

## Pièges Fréquents

### Piège 1 : Image introuvable (image not found)

⚠️ **Problème** : Tu tapes `podman pull nginx` et Podman ne trouve pas l'image, ou te propose une liste de choix.

**Cause** : Podman cherche dans plusieurs registres et ne sait pas lequel utiliser.

✅ **Solution** : Toujours préciser le registre complet dans la commande :

```bash
# Incorrect : ambigu
podman pull nginx

# Correct : registre explicite
podman pull docker.io/library/nginx:alpine
```

**Règle** : Pour les images officielles sur Docker Hub, le chemin complet est toujours `docker.io/library/<nom>:<tag>`.

---

### Piège 2 : Port déjà utilisé (address already in use)

⚠️ **Problème** : Tu lances un conteneur avec `-p 8080:80` et tu obtiens l'erreur "address already in use".

**Cause** : Un autre conteneur ou un autre programme utilise déjà le port 8080.

✅ **Solution** :

```bash
# Étape 1 : Voir quel conteneur utilise le port
podman ps

# Étape 2 : Arrêter le conteneur qui utilise le port
podman stop <nom-du-conteneur>

# OU utiliser un autre port
podman run -d --name mon-nginx -p 9090:80 docker.io/library/nginx:alpine
```

---

### Piège 3 : Nom de conteneur déjà utilisé

⚠️ **Problème** : Tu lances `podman run --name mon-nginx ...` et tu obtiens l'erreur "container name mon-nginx is already in use".

**Cause** : Un conteneur avec ce nom existe déjà (même s'il est arrêté).

✅ **Solution** :

```bash
# Étape 1 : Voir tous les conteneurs (y compris les arrêtés)
podman ps -a

# Étape 2 : Supprimer l'ancien conteneur
podman rm mon-nginx

# Étape 3 : Relancer le nouveau conteneur
podman run -d --name mon-nginx -p 8080:80 docker.io/library/nginx:alpine
```

---

### Piège 4 : Mode rootless et ports inférieurs à 1024

⚠️ **Problème** : Tu lances un conteneur avec `-p 80:80` et tu obtiens l'erreur "permission denied" ou "rootlessport cannot expose privileged port".

**Cause** : En mode rootless, les ports inférieurs à 1024 sont réservés au système.

✅ **Solution** : Utiliser un port supérieur à 1024 :

```bash
# Incorrect en mode rootless
podman run -d -p 80:80 docker.io/library/nginx:alpine

# Correct : utiliser le port 8080
podman run -d -p 8080:80 docker.io/library/nginx:alpine
```

---

### Piège 5 : Containerfile ou Dockerfile non trouvé

⚠️ **Problème** : Tu lances `podman build -t mon-image .` et tu obtiens l'erreur "no Containerfile or Dockerfile found".

**Cause** : Le fichier `Containerfile` (ou `Dockerfile`) n'existe pas dans le dossier courant, ou il a un mauvais nom.

✅ **Solution** :

```bash
# Vérifier que tu es dans le bon dossier
pwd
ls -la

# Le fichier doit se nommer exactement "Containerfile" ou "Dockerfile"
# Pas de majuscule incorrecte, pas d'extension
# Correct : Containerfile
# Incorrect : containerfile, containerFile, Containerfile.txt
```

---

## Checklist de Validation

- [ ] Je sais télécharger une image avec `podman pull`
- [ ] Je sais lister les images avec `podman images`
- [ ] Je sais lancer un conteneur avec `podman run`
- [ ] Je sais lister les conteneurs avec `podman ps` et `podman ps -a`
- [ ] Je sais arrêter un conteneur avec `podman stop`
- [ ] Je sais redémarrer un conteneur avec `podman start`
- [ ] Je sais supprimer un conteneur avec `podman rm`
- [ ] Je sais supprimer une image avec `podman rmi`
- [ ] Je sais écrire un Containerfile avec les instructions FROM, WORKDIR, COPY, EXPOSE, CMD
- [ ] Je sais construire une image avec `podman build`
- [ ] Je sais consulter les logs avec `podman logs`
- [ ] Je comprends la différence entre rootless et rootful
- [ ] Je sais utiliser un port supérieur à 1024 en mode rootless

---

## Exercice Pratique

**Énoncé** : Crée une image PHP personnalisée qui affiche "Bonjour depuis Podman" sur une page web, construis l'image, lance le conteneur, et vérifie que la page fonctionne.

**Indications** :

- Crée un dossier `~/exercice-podman/`
- Crée un fichier `index.php` qui affiche le message avec `echo`
- Crée un `Containerfile` basé sur `docker.io/library/php:8.3-cli`
- Utilise le serveur PHP intégré sur le port 8080
- Donne le nom `exercice-php` au conteneur
- Vérifie avec `curl http://localhost:8080`

**Résultat attendu** : La commande `curl http://localhost:8080` affiche "Bonjour depuis Podman".

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Créer le dossier de travail** :

```bash
# Créer le dossier
mkdir -p ~/exercice-podman
cd ~/exercice-podman
```

**Étape 2 : Créer le fichier `index.php`** :

Crée un fichier `index.php` avec ce contenu :

```php
<?php
// Affiche le message demandé dans le navigateur
echo "Bonjour depuis Podman";
```

**Étape 3 : Créer le Containerfile** :

Crée un fichier `Containerfile` avec ce contenu :

```dockerfile
# Image de base : PHP 8.3 en mode CLI (inclut le serveur web intégré)
FROM docker.io/library/php:8.3-cli

# Répertoire de travail dans le conteneur
WORKDIR /app

# Copier le fichier PHP dans le conteneur
COPY index.php .

# Documenter le port utilisé
EXPOSE 8080

# Lancer le serveur PHP intégré au démarrage du conteneur
CMD ["php", "-S", "0.0.0.0:8080", "-t", "/app"]
```

**Étape 4 : Construire l'image** :

```bash
# Construire l'image avec le nom "exercice-php" et le tag "1.0"
podman build -t exercice-php:1.0 .
```

**Étape 5 : Lancer le conteneur** :

```bash
# Lancer le conteneur en arrière-plan
podman run -d --name exercice-php -p 8080:8080 exercice-php:1.0
```

**Étape 6 : Vérifier** :

```bash
# Vérifier que le conteneur tourne
podman ps
```

```text
CONTAINER ID   IMAGE                          COMMAND                  CREATED         STATUS         PORTS                    NAMES
a1b2c3d4e5f6   localhost/exercice-php:1.0     "php -S 0.0.0.0:808…"   5 seconds ago   Up 5 seconds   0.0.0.0:8080->8080/tcp   exercice-php
```

```bash
# Vérifier la page web
curl http://localhost:8080
```

```text
Bonjour depuis Podman
```

Le message "Bonjour depuis Podman" s'affiche : l'exercice est réussi.

**Étape 7 : Nettoyer** :

```bash
# Arrêter et supprimer le conteneur
podman stop exercice-php
podman rm exercice-php

# Supprimer l'image
podman rmi exercice-php:1.0
```

---

## Navigation

← Fiche précédente : **[Introduction à Podman](01-introduction-podman.md)**

→ Fiche suivante : **[Les Pods dans Podman](03-pods-podman.md)**
