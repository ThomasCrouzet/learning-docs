---
tags:
  - Docker
  - Débutant
  - Pratique
description: "Créer un environnement Docker Compose pour Symfony"
estimated_time: "105 min"
fiche_number: 1
total_fiches: 2
cursus: "Docker"
---

# 01 - Créer un environnement Docker Compose pour Symfony

> **En bref** : À la fin de cette fiche, tu sauras créer un fichier docker-compose.yml qui lance un environnement complet pour développer avec Symfony : PHP, PostgreSQL, et Composer. Lecture estimée : 105 min.


## Prérequis

- Docker Desktop installé sur ton ordinateur
- Savoir utiliser le terminal (ligne de commande)
- Aucune connaissance préalable de Docker n'est requise (tout est expliqué ci-dessous)

## Versions utilisées dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| PHP | 8.3 (cadre pédagogique ; sécurité jusqu'au 31 déc. 2027) |
| PostgreSQL | 16 (support jusqu'au 9 nov. 2028) |
| Symfony | 7.4 LTS (bugs nov. 2028, sécurité nov. 2029) |
| Nginx | alpine (dernière version stable) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un fichier `docker-compose.yml` qui lance un environnement complet pour développer avec Symfony : PHP, PostgreSQL, et Composer.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Docker ?

**Définition** : Docker est un logiciel qui permet de créer des "boîtes isolées" appelées conteneurs. Chaque boîte contient un programme et tout ce dont il a besoin pour fonctionner.

**Le problème que Docker résout** :

Sans Docker, installer un environnement de développement pose ces problèmes :

1. **Conflits de versions** : Tu as PHP 8.1 sur ta machine, mais le projet nécessite PHP 8.3. Installer deux versions de PHP sur le même ordinateur crée des conflits.

2. **Différences entre machines** : Le projet fonctionne sur ton Mac mais pas sur le PC Windows de ton collègue. Chaque système d'exploitation a ses particularités.

3. **Installation complexe** : Pour faire tourner Symfony, tu dois installer PHP, des extensions PHP, Composer, PostgreSQL, configurer chaque outil... Cela prend du temps et les erreurs sont fréquentes.

4. **Pollution du système** : Après plusieurs projets, ton ordinateur accumule des logiciels, des configurations, des fichiers. Désinstaller proprement devient difficile.

**Comment Docker résout ces problèmes** :

| Problème                   | Solution Docker                                                                |
| -------------------------- | ------------------------------------------------------------------------------ |
| Conflits de versions       | Chaque conteneur a sa propre version de PHP, isolée des autres                 |
| Différences entre machines | Le conteneur fonctionne de manière identique sur Mac, Windows, Linux           |
| Installation complexe      | Une seule commande (`docker compose up`) installe et configure tout            |
| Pollution du système       | Supprimer un conteneur supprime tout ce qu'il contient, sans laisser de traces |

**Ce que Docker n'est PAS** :

- Docker n'est pas une machine virtuelle. Une machine virtuelle simule un ordinateur complet avec son propre système d'exploitation. Un conteneur Docker partage le noyau du système hôte, ce qui le rend plus léger et plus rapide.
- Docker n'est pas un langage de programmation. C'est un outil d'infrastructure.

---

### Qu'est-ce qu'un conteneur ?

**Définition** : Un conteneur est un environnement isolé qui contient un programme et toutes ses dépendances (bibliothèques, fichiers de configuration, outils).

**Analogie concrète** : Imagine une boîte de déménagement étiquetée "Cuisine". Cette boîte contient tout ce qui concerne la cuisine : ustensiles, assiettes, épices. Tu peux déplacer cette boîte dans n'importe quelle maison, et tu auras toujours une cuisine fonctionnelle. Le conteneur Docker fonctionne de la même façon : il contient tout ce dont un programme a besoin, et tu peux le déplacer sur n'importe quel ordinateur.

**Ce que contient un conteneur** :

Un conteneur PHP pour Symfony contient :

- Le système de fichiers minimal (basé sur Linux)
- L'interpréteur PHP (version 8.3)
- Les extensions PHP nécessaires (pdo_pgsql, intl, zip...)
- Composer (gestionnaire de dépendances)
- Les fichiers de configuration

**Ce qu'un conteneur ne contient PAS** :

- Ton code source (il est monté via un volume, expliqué plus bas)
- Les données de la base de données (elles sont dans un autre conteneur)
- Un système d'exploitation complet (seulement le strict nécessaire)

**Pourquoi utiliser des conteneurs ?**

| Raison           | Explication                                                                                     |
| ---------------- | ----------------------------------------------------------------------------------------------- |
| Isolation        | Si le conteneur PHP plante, le conteneur PostgreSQL continue de fonctionner                     |
| Reproductibilité | Le conteneur se comporte de la même façon sur tous les ordinateurs                              |
| Légèreté         | Un conteneur démarre en quelques secondes (contre plusieurs minutes pour une machine virtuelle) |
| Jetable          | Tu peux supprimer et recréer un conteneur sans conséquence                                      |

**Cycle de vie d'un conteneur** :

1. **Création** : Docker crée le conteneur à partir d'une image
2. **Démarrage** : Le conteneur s'exécute et le programme à l'intérieur démarre
3. **Exécution** : Le conteneur tourne et répond aux requêtes
4. **Arrêt** : Le conteneur s'arrête (le programme s'arrête)
5. **Suppression** : Le conteneur est supprimé de la mémoire

---

### Qu'est-ce qu'une image Docker ?

**Définition** : Une image Docker est un modèle en lecture seule utilisé pour créer des conteneurs. C'est comme un "plan de construction" ou un "moule".

**Analogie concrète** : Une image est comme une recette de cuisine. La recette (image) décrit les ingrédients et les étapes. Le plat cuisiné (conteneur) est le résultat de l'exécution de cette recette. À partir d'une même recette, tu peux cuisiner plusieurs plats identiques.

**Différence entre image et conteneur** :

| Image                           | Conteneur                                    |
| ------------------------------- | -------------------------------------------- |
| Modèle statique (ne change pas) | Instance en cours d'exécution (peut changer) |
| Stockée sur le disque           | Exécutée en mémoire                          |
| Peut créer plusieurs conteneurs | Créé à partir d'une seule image              |
| Partageable (Docker Hub)        | Local à ta machine                           |

**D'où viennent les images ?**

1. **Docker Hub** : Un site web qui héberge des milliers d'images publiques. Les images officielles (php, postgres, nginx) sont maintenues par les éditeurs des logiciels.

2. **Dockerfile** : Un fichier texte qui décrit comment construire une image personnalisée. Tu pars d'une image existante et tu ajoutes tes modifications.

**Exemple** : L'image `php:8.3-fpm` est l'image officielle de PHP version 8.3 avec FPM. Elle est téléchargée automatiquement depuis Docker Hub la première fois que tu l'utilises.

---

### Qu'est-ce qu'un Dockerfile ?

**Définition** : Un Dockerfile est un fichier texte qui contient les instructions pour construire une image Docker personnalisée.

**Pourquoi créer un Dockerfile ?**

Les images officielles (comme `php:8.3-fpm`) sont génériques. Elles ne contiennent pas les extensions PHP spécifiques dont Symfony a besoin. Le Dockerfile permet d'ajouter ces extensions.

**Structure d'un Dockerfile** :

Chaque ligne du Dockerfile est une instruction :

| Instruction | Signification                                  |
| ----------- | ---------------------------------------------- |
| `FROM`      | Image de départ (base)                         |
| `WORKDIR`   | Définit le dossier de travail                  |
| `RUN`       | Exécute une commande (installation de paquets) |
| `COPY`      | Copie des fichiers dans l'image                |
| `ENV`       | Définit une variable d'environnement           |
| `EXPOSE`    | Indique le port utilisé (documentation)        |
| `CMD`       | Commande exécutée au démarrage du conteneur    |

**Processus de construction** :

1. Docker lit le Dockerfile ligne par ligne
2. Chaque instruction crée une "couche" (layer)
3. Les couches sont empilées pour former l'image finale
4. Les couches sont mises en cache (reconstruction plus rapide)

---

### Qu'est-ce que PHP-FPM ?

**Définition** : PHP-FPM (FastCGI Process Manager) est un gestionnaire de processus PHP qui permet d'exécuter du code PHP de manière performante en répondant aux requêtes d'un serveur web.

**Le problème que PHP-FPM résout** :

Sans PHP-FPM, voici les problèmes rencontrés :

1. **Lenteur** : Chaque requête PHP doit démarrer un nouveau processus PHP, ce qui prend du temps.

2. **Consommation mémoire** : Sans gestion des processus, PHP peut consommer beaucoup de mémoire.

3. **Communication serveur web** : Le serveur web (Nginx) ne sait pas exécuter PHP directement. Il a besoin d'un intermédiaire.

**Comment PHP-FPM résout ces problèmes** :

| Problème               | Solution PHP-FPM                                                |
| ---------------------- | --------------------------------------------------------------- |
| Lenteur                | Garde des processus PHP prêts à répondre (pas de démarrage)     |
| Consommation mémoire   | Gère le nombre de processus actifs automatiquement              |
| Communication serveur  | Écoute sur un port (9000) et répond aux requêtes du serveur web |

**Analogie concrète** : PHP-FPM fonctionne comme un standard téléphonique dans une entreprise. Au lieu que chaque appel crée un nouveau poste téléphonique (lent et coûteux), le standard garde plusieurs lignes ouvertes et prêtes. Quand un appel arrive, il est immédiatement transféré à une ligne disponible.

**Ce que PHP-FPM n'est PAS** :

- PHP-FPM n'est pas un serveur web. Il ne sert pas les fichiers HTML, CSS ou images. Il exécute uniquement le code PHP.
- PHP-FPM n'est pas obligatoire pour PHP. Tu peux utiliser PHP en ligne de commande sans FPM. Mais pour un site web performant, FPM est le standard.

**Le port 9000** :

PHP-FPM écoute par défaut sur le port 9000. C'est sur ce port que Nginx envoie les requêtes PHP à traiter.

---

### Qu'est-ce que Nginx ?

**Définition** : Nginx (prononcé "engine-x") est un serveur web. Son rôle est de recevoir les requêtes HTTP des navigateurs et de renvoyer les fichiers demandés (HTML, CSS, images) ou de transmettre les requêtes PHP à PHP-FPM.

**Le problème que Nginx résout** :

Sans serveur web, voici les problèmes rencontrés :

1. **Pas d'accès HTTP** : Les navigateurs communiquent via HTTP. Sans serveur web, impossible d'accéder à ton site.

2. **Fichiers statiques** : Quelqu'un doit servir les fichiers CSS, JavaScript et images aux visiteurs.

3. **Routage** : Il faut décider quel fichier ou script PHP exécuter selon l'URL demandée.

**Comment Nginx résout ces problèmes** :

| Problème           | Solution Nginx                                                  |
| ------------------ | --------------------------------------------------------------- |
| Pas d'accès HTTP   | Écoute sur le port 80 (HTTP) et répond aux requêtes             |
| Fichiers statiques | Sert directement les fichiers du dossier `public/`              |
| Routage            | Analyse l'URL et redirige vers le bon fichier ou vers PHP-FPM   |

**Analogie concrète** : Nginx est comme un réceptionniste d'hôtel. Quand un visiteur arrive (requête HTTP), le réceptionniste vérifie ce qu'il veut. Si le visiteur veut une brochure (fichier statique), le réceptionniste la lui donne directement. Si le visiteur a une question complexe (requête PHP), le réceptionniste appelle le service concerné (PHP-FPM) pour obtenir la réponse.

**Ce que Nginx n'est PAS** :

- Nginx n'exécute pas le code PHP. Il transmet les requêtes PHP à PHP-FPM qui les exécute.
- Nginx n'est pas le seul serveur web. Apache est une alternative populaire, mais Nginx est plus léger et performant.

**Comparaison Nginx vs Apache** :

| Nginx                           | Apache                              |
| ------------------------------- | ----------------------------------- |
| Léger et rapide                 | Plus lourd mais très configurable   |
| Configuration déclarative       | Fichiers .htaccess dynamiques       |
| Meilleur pour fichiers statiques| Meilleur pour configurations locales|
| Utilisé par défaut avec Symfony | Historiquement plus répandu         |

---

### Qu'est-ce qu'un volume ?

**Définition** : Un volume est un mécanisme pour faire persister des données en dehors du conteneur, ou pour partager des fichiers entre ton ordinateur et le conteneur.

**Le problème que les volumes résolvent** :

Sans volumes, voici les problèmes rencontrés :

1. **Perte de données** : Quand un conteneur est supprimé, tout ce qu'il contient disparaît. Ta base de données serait vide à chaque redémarrage.

2. **Pas de synchronisation** : Tu ne peux pas modifier ton code depuis VS Code et voir les changements dans le conteneur.

3. **Données inaccessibles** : Les fichiers créés dans le conteneur ne sont pas visibles depuis ton ordinateur.

**Comment les volumes résolvent ces problèmes** :

| Problème               | Solution Volume                                                    |
| ---------------------- | ------------------------------------------------------------------ |
| Perte de données       | Les données sont stockées en dehors du conteneur, elles persistent |
| Pas de synchronisation | Le dossier est partagé, les modifications sont instantanées        |
| Données inaccessibles  | Le volume rend les fichiers accessibles des deux côtés             |

**Analogie concrète** : Un volume est comme un disque dur externe branché sur ton ordinateur. Même si tu éteins l'ordinateur (supprimes le conteneur), les fichiers sur le disque externe (volume) restent intacts. Tu peux rebrancher le disque sur un autre ordinateur et retrouver tes fichiers.

**Ce qu'un volume n'est PAS** :

- Un volume n'est pas une copie. C'est un partage en temps réel. Modifier un fichier d'un côté le modifie immédiatement de l'autre.
- Un volume n'est pas automatique. Tu dois explicitement le déclarer dans le `docker-compose.yml`.

**Deux types de volumes** :

1. **Bind mount** (montage de dossier) : Lie un dossier de ton ordinateur à un dossier du conteneur

   ```yaml
   volumes:
     - ./app:/var/www/html
   ```

   Le dossier `./app` sur ton ordinateur est accessible dans `/var/www/html` du conteneur. Les modifications sont synchronisées dans les deux sens.

2. **Named volume** (volume nommé) : Docker gère le stockage automatiquement

   ```yaml
   volumes:
     - postgres_data:/var/lib/postgresql/data
   ```

   Docker crée un espace de stockage qu'il gère lui-même. Les données persistent même si le conteneur est supprimé.

**Quand utiliser quel type ?**

| Type         | Utilisation                                                              |
| ------------ | ------------------------------------------------------------------------ |
| Bind mount   | Code source (tu veux modifier les fichiers depuis ton IDE)               |
| Named volume | Données de base de données (tu ne modifies pas ces fichiers directement) |

---

### Qu'est-ce qu'un réseau Docker ?

**Définition** : Un réseau Docker permet aux conteneurs de communiquer entre eux par leur nom.

**Le problème que les réseaux Docker résolvent** :

Sans réseau Docker, voici les problèmes rencontrés :

1. **Isolation totale** : Par défaut, les conteneurs ne peuvent pas communiquer entre eux.

2. **Adresses IP dynamiques** : L'adresse IP d'un conteneur change à chaque redémarrage. Impossible de la coder en dur.

3. **Pas de résolution DNS** : Sans réseau personnalisé, tu ne peux pas utiliser les noms de services pour communiquer.

**Comment les réseaux Docker résolvent ces problèmes** :

| Problème              | Solution Réseau Docker                                      |
| --------------------- | ----------------------------------------------------------- |
| Isolation totale      | Les conteneurs sur le même réseau peuvent communiquer       |
| Adresses IP dynamiques| Le réseau résout les noms en adresses IP automatiquement    |
| Pas de résolution DNS | Tu utilises le nom du service (`database`) au lieu de l'IP  |

**Comment ça fonctionne** :

Quand tu crées un réseau et que tu y connectes des conteneurs :

1. Chaque conteneur reçoit une adresse IP interne
2. Chaque conteneur peut contacter les autres par leur nom de service
3. Le conteneur PHP peut contacter PostgreSQL en utilisant le nom `database` (pas besoin de connaître l'adresse IP)

**Analogie concrète** : Le réseau Docker est comme un annuaire téléphonique interne dans une entreprise. Au lieu de retenir le numéro de poste de chaque collègue (adresse IP), tu utilises son nom. L'annuaire (réseau Docker) se charge de trouver le bon numéro.

**Ce qu'un réseau Docker n'est PAS** :

- Un réseau Docker n'est pas un réseau internet. C'est un réseau privé interne entre conteneurs. Les conteneurs ne sont pas accessibles depuis l'extérieur sans mapper les ports.
- Un réseau Docker n'est pas obligatoire. Docker Compose crée un réseau par défaut pour tous les services du même fichier. Mais le déclarer explicitement rend la configuration plus claire.

**Exemple concret** :

```yaml
services:
  php:
    networks:
      - symfony_network
  database:
    networks:
      - symfony_network

networks:
  symfony_network:
```

Le conteneur PHP peut maintenant se connecter à `database:5432` pour atteindre PostgreSQL.

---

### Qu'est-ce que Docker Compose ?

**Définition** : Docker Compose est un outil qui permet de définir et gérer plusieurs conteneurs à partir d'un seul fichier de configuration (`docker-compose.yml`).

**Le problème sans Docker Compose** :

Pour lancer un environnement Symfony, tu aurais besoin de 3 commandes séparées :

```bash
docker run -d --name php ...options...
docker run -d --name nginx ...options...
docker run -d --name postgres ...options...
```

Chaque commande a de nombreuses options. C'est long, répétitif, et source d'erreurs.

**Comment Docker Compose résout ce problème** :

Tu décris tous les conteneurs dans un fichier `docker-compose.yml`, puis tu lances une seule commande :

```bash
docker compose up -d
```

Docker Compose :

1. Lit le fichier `docker-compose.yml`
2. Crée le réseau
3. Crée les volumes
4. Construit les images (si nécessaire)
5. Démarre tous les conteneurs dans le bon ordre

**Structure du fichier docker-compose.yml** :

```yaml
services: # Liste des conteneurs
  php: # Premier conteneur
    ...
  nginx: # Deuxième conteneur
    ...
  database: # Troisième conteneur
    ...

networks: # Réseaux partagés
  ...

volumes: # Volumes pour la persistance
  ...
```

Le schéma suivant illustre l'architecture multi-conteneurs gérée par Docker Compose pour un projet Symfony :

<div class="diagram-design">
<p><a href="../../diagrams/01-docker-01-docker-compose-symfony-1.html">Qu&#x27;est-ce que Docker Compose ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/01-docker-01-docker-compose-symfony-1.html" title="Qu&#x27;est-ce que Docker Compose ?" style="width:100%;min-height:572px;border:0;background:transparent"></iframe>
</div>

- Le **navigateur** envoie une requête HTTP à **Nginx**
- **Nginx** transmet les requêtes PHP à **PHP-FPM**
- **PHP-FPM** communique avec **PostgreSQL** pour lire ou écrire des données
- Les trois services sont définis et orchestrés par **Docker Compose**

**Ce que Docker Compose n'est PAS** :

- Ce n'est pas un remplaçant de Docker. Docker Compose utilise Docker.
- Ce n'est pas un outil de déploiement en production (pour cela, on utilise Kubernetes ou Docker Swarm).

---

### Qu'est-ce qu'entrer dans un conteneur ?

**Définition** : Entrer dans un conteneur signifie ouvrir un terminal interactif à l'intérieur de ce conteneur pour y exécuter des commandes.

**Le problème que cette fonctionnalité résout** :

Ton code PHP s'exécute à l'intérieur du conteneur, pas sur ton ordinateur. Quand tu veux exécuter une commande PHP (comme Doctrine ou Composer), tu dois l'exécuter là où PHP est installé : dans le conteneur.

1. **PHP n'est pas installé sur ta machine** : Tu as choisi Docker justement pour ne pas installer PHP localement.

2. **Les fichiers sont dans le conteneur** : Même si ton code est synchronisé via un volume, l'exécution se fait dans le conteneur.

3. **La base de données est accessible depuis le conteneur** : Le conteneur PHP peut contacter `database:5432`, mais ta machine locale ne peut pas utiliser ce nom.

**Analogie concrète** : Imagine que tu as une cuisine équipée dans un camion-restaurant. Pour cuisiner, tu dois entrer dans le camion. Tu ne peux pas utiliser les ustensiles du camion depuis l'extérieur. De la même façon, pour utiliser PHP et ses outils, tu dois entrer dans le conteneur où ils sont installés.

**Ce qu'entrer dans un conteneur n'est PAS** :

- Ce n'est pas une connexion SSH. SSH est un protocole réseau pour se connecter à des machines distantes. Ici, tu ouvres un terminal local dans un processus Docker.
- Ce n'est pas dangereux. Tu peux entrer et sortir autant de fois que tu veux. Les modifications de fichiers sont conservées (grâce aux volumes).

**La commande pour entrer** :

```bash
docker compose exec php bash
```

- `docker compose exec` : exécute une commande dans un conteneur en cours d'exécution
- `php` : nom du service (défini dans docker-compose.yml)
- `bash` : le programme à lancer (un terminal)

**Pour sortir du conteneur** :

```bash
exit
```

---

### Qu'est-ce que l'architecture processeur (ARM64 / AMD64) ?

**Définition** : L'architecture processeur détermine comment un processeur exécute les instructions. Les deux architectures principales sont ARM64 et AMD64, et elles ne sont pas compatibles entre elles.

**Le problème que la multi-architecture résout** :

Sans images multi-architecture, voici les problèmes rencontrés :

1. **Incompatibilité** : Un programme compilé pour ARM64 ne fonctionne pas sur AMD64, et inversement.

2. **Images différentes** : Il faudrait télécharger manuellement la bonne version de chaque image selon ton ordinateur.

3. **Collaboration difficile** : Ton collègue sur Mac M1 et toi sur PC Windows ne pourriez pas utiliser le même Dockerfile.

**Comment Docker résout ces problèmes** :

| Problème                | Solution Docker                                            |
| ----------------------- | ---------------------------------------------------------- |
| Incompatibilité         | Les images officielles contiennent les deux versions       |
| Images différentes      | Docker détecte ton architecture et télécharge la bonne     |
| Collaboration difficile | Le même fichier docker-compose.yml fonctionne partout      |

**Les deux architectures principales** :

| Architecture   | Processeurs                    | Ordinateurs                    |
| -------------- | ------------------------------ | ------------------------------ |
| ARM64          | Apple Silicon (M1, M2, M3, M4) | MacBook récents (depuis 2020)  |
| AMD64 (x86_64) | Intel, AMD                     | PC Windows, Linux, anciens Mac |

**Analogie concrète** : L'architecture processeur est comme le format de prise électrique. Une prise française (ARM64) ne rentre pas dans une prise américaine (AMD64). Les images multi-architecture sont comme des adaptateurs universels : elles fonctionnent avec les deux formats.

**Ce que la multi-architecture n'est PAS** :

- Ce n'est pas quelque chose que tu dois configurer. Docker gère tout automatiquement.
- Ce n'est pas une garantie. Certaines images non-officielles ne supportent qu'une seule architecture. Les images officielles (php, postgres, nginx) supportent les deux.

**Vérification** :

Pour voir l'architecture de ton système :

```bash
docker info | grep Architecture
```

Résultat possible : `Architecture: aarch64` (ARM64) ou `Architecture: x86_64` (AMD64).

---

## Récapitulatif des concepts

Avant de passer à la pratique, voici un résumé des concepts que tu viens d'apprendre :

| Concept        | À retenir                                                           |
| -------------- | ------------------------------------------------------------------- |
| Docker         | Logiciel qui crée des environnements isolés (conteneurs)            |
| Conteneur      | Boîte isolée contenant un programme et ses dépendances              |
| Image          | Modèle pour créer des conteneurs (recette de cuisine)               |
| Dockerfile     | Fichier texte décrivant comment construire une image personnalisée  |
| PHP-FPM        | Gestionnaire de processus PHP, écoute sur le port 9000              |
| Nginx          | Serveur web qui transmet les requêtes PHP à PHP-FPM                 |
| Volume         | Partage de fichiers entre ton ordinateur et le conteneur            |
| Réseau Docker  | Permet aux conteneurs de communiquer par leur nom                   |
| Docker Compose | Outil pour gérer plusieurs conteneurs via un fichier YAML           |

Tu n'as pas besoin de tout mémoriser. Tu peux revenir consulter cette fiche à tout moment.

---

## Comment créer un fichier

Dans les étapes pratiques, tu devras créer plusieurs fichiers. Voici deux méthodes :

### Méthode 1 : Avec VS Code (recommandée)

1. Ouvre le dossier du projet dans VS Code (File → Open Folder)
2. Dans le panneau de gauche (Explorer), fais un clic droit sur le dossier où tu veux créer le fichier
3. Clique sur "New File"
4. Tape le nom du fichier (exemple : `docker-compose.yml`)
5. Appuie sur Entrée
6. Le fichier s'ouvre. Copie-colle le contenu indiqué dans cette fiche
7. Sauvegarde avec Ctrl+S (Windows/Linux) ou Cmd+S (Mac)

### Méthode 2 : Avec le terminal

```bash
# Créer un fichier vide
touch nom-du-fichier.yml

# Puis l'ouvrir avec VS Code
code nom-du-fichier.yml
```

Tu peux aussi utiliser un éditeur en ligne de commande comme `nano` :

```bash
nano nom-du-fichier.yml
# Colle le contenu, puis Ctrl+O pour sauvegarder, Ctrl+X pour quitter
```

---

## Structure des fichiers à créer

Voici les fichiers que tu vas créer dans cette fiche :

```text
mon-projet/
├── docker-compose.yml      # Configuration des conteneurs
├── docker/
│   └── php/
│       └── Dockerfile      # Image personnalisée pour PHP
└── app/                    # Ton code Symfony ira ici
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure de dossiers

Ouvre ton terminal et exécute ces commandes une par une :

```bash
# Crée le dossier principal du projet
mkdir mon-projet

# Entre dans ce dossier
cd mon-projet

# Crée les sous-dossiers nécessaires
mkdir -p docker/php

# Crée le dossier pour le code Symfony
mkdir app
```

**Résultat attendu** : Tu as maintenant un dossier `mon-projet` avec les sous-dossiers `docker/php` et `app`.

Pour vérifier, exécute :

```bash
ls -la
```

Tu dois voir :

```text
drwxr-xr-x  app
drwxr-xr-x  docker
```

---

### Étape 2 : Créer le Dockerfile pour PHP

Ce fichier définit une image PHP personnalisée avec toutes les extensions nécessaires pour Symfony.

Crée le fichier `docker/php/Dockerfile` avec ce contenu :

```dockerfile
# On part de l'image officielle PHP 8.3 avec FPM (FastCGI Process Manager)
# Cette image supporte ARM64 (Mac) et AMD64 (Windows/Linux) automatiquement
FROM php:8.3-fpm

# On définit le dossier de travail dans le conteneur
# Toutes les commandes suivantes s'exécuteront depuis ce dossier
WORKDIR /var/www/html

# Installation des dépendances système nécessaires
# apt-get update : met à jour la liste des paquets disponibles
# apt-get install : installe les paquets listés
RUN apt-get update && apt-get install -y \
    # git : pour cloner des dépôts et pour Composer
    git \
    # unzip : pour décompresser les archives (utilisé par Composer)
    unzip \
    # libpq-dev : bibliothèques nécessaires pour compiler l'extension PostgreSQL
    libpq-dev \
    # libzip-dev : bibliothèques nécessaires pour l'extension zip
    libzip-dev \
    # libicu-dev : bibliothèques pour l'internationalisation (intl)
    libicu-dev \
    # On nettoie le cache apt pour réduire la taille de l'image
    && rm -rf /var/lib/apt/lists/*

# Installation des extensions PHP nécessaires pour Symfony
RUN docker-php-ext-install \
    # pdo_pgsql : permet à PHP de communiquer avec PostgreSQL
    pdo_pgsql \
    # pgsql : fonctions PostgreSQL supplémentaires
    pgsql \
    # zip : manipulation d'archives ZIP (requis par Composer)
    zip \
    # intl : fonctions d'internationalisation (requis par Symfony)
    intl \
    # opcache : améliore les performances en mettant le code en cache
    opcache

# Installation de Composer (gestionnaire de dépendances PHP)
# On copie Composer depuis son image officielle
# Cela garantit d'avoir la dernière version stable
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# On définit une variable d'environnement pour Composer
# Cela permet d'exécuter Composer en tant que root sans avertissement
ENV COMPOSER_ALLOW_SUPERUSER=1

# Le conteneur exposera le port 9000 (port par défaut de PHP-FPM)
EXPOSE 9000

# Commande par défaut : lance PHP-FPM
CMD ["php-fpm"]
```

---

### Étape 3 : Créer le fichier docker-compose.yml

Crée le fichier `docker-compose.yml` à la racine du projet avec ce contenu :

```yaml
# Version de la syntaxe Docker Compose (optionnel depuis Docker Compose V2)
# On ne le met plus car Docker Compose V2 le détecte automatiquement

# Définition des services (= conteneurs)
services:
  # ============================================
  # SERVICE PHP
  # ============================================
  php:
    # On construit l'image à partir de notre Dockerfile
    build:
      # Chemin vers le dossier contenant le Dockerfile
      context: ./docker/php
      # Nom du fichier Dockerfile (par défaut c'est "Dockerfile")
      dockerfile: Dockerfile

    # Nom du conteneur (facilite l'identification)
    container_name: symfony_php

    # Montage de volumes : lie un dossier local à un dossier dans le conteneur
    volumes:
      # Le dossier ./app sur ton ordinateur sera accessible dans /var/www/html du conteneur
      # Ainsi, quand tu modifies un fichier, le changement est immédiat dans le conteneur
      - ./app:/var/www/html

    # Ce service dépend du service "database"
    # Docker Compose démarre "database" avant "php" (ordre de démarrage seulement).
    # Sans healthcheck + condition: service_healthy, Compose n'attend PAS que
    # PostgreSQL accepte déjà les connexions. L'app doit réessayer si la DB n'est
    # pas encore prête (Doctrine le fait souvent, sinon le conteneur peut échouer au boot).
    depends_on:
      - database

    # Connexion aux réseaux
    networks:
      - symfony_network

    # Variables d'environnement pour PHP
    environment:
      # Désactive le mode superuser warning de Composer
      COMPOSER_ALLOW_SUPERUSER: 1

  # ============================================
  # SERVICE NGINX (Serveur Web)
  # ============================================
  nginx:
    # On utilise l'image officielle Nginx
    # Cette image supporte ARM64 et AMD64 automatiquement
    image: nginx:alpine

    # Nom du conteneur
    container_name: symfony_nginx

    # Mappage des ports : port_local:port_conteneur
    # Tu accéderas à ton site via http://localhost:8080
    ports:
      - "8080:80"

    # Volumes montés
    volumes:
      # Le code source
      - ./app:/var/www/html
      # La configuration Nginx (on la crée à l'étape suivante)
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf

    # Dépendances
    depends_on:
      - php

    # Réseaux
    networks:
      - symfony_network

  # ============================================
  # SERVICE DATABASE (PostgreSQL)
  # ============================================
  database:
    # Image officielle PostgreSQL version 16
    # Cette image supporte ARM64 et AMD64 automatiquement
    image: postgres:16-alpine

    # Nom du conteneur
    container_name: symfony_database

    # Variables d'environnement pour configurer PostgreSQL
    environment:
      # Nom de la base de données créée au démarrage
      POSTGRES_DB: symfony_db
      # Nom de l'utilisateur créé au démarrage
      POSTGRES_USER: symfony_user
      # Mot de passe de l'utilisateur (à changer en production !)
      POSTGRES_PASSWORD: symfony_password

    # Mappage des ports
    # Tu pourras te connecter à PostgreSQL via localhost:5432
    ports:
      - "5432:5432"

    # Volume pour persister les données
    # Sans ce volume, les données seraient perdues à chaque redémarrage
    volumes:
      - postgres_data:/var/lib/postgresql/data

    # Réseaux
    networks:
      - symfony_network

# ============================================
# RÉSEAUX
# ============================================
networks:
  # Réseau personnalisé pour que les conteneurs communiquent entre eux
  symfony_network:
    driver: bridge

# ============================================
# VOLUMES
# ============================================
volumes:
  # Volume nommé pour les données PostgreSQL
  # Docker gère ce volume automatiquement
  postgres_data:
```

---

### Étape 4 : Créer la configuration Nginx

Nginx sert de serveur web et transmet les requêtes PHP à PHP-FPM.

Crée d'abord le dossier :

```bash
mkdir -p docker/nginx
```

Puis crée le fichier `docker/nginx/default.conf` :

```nginx
# Configuration du serveur Nginx pour Symfony

server {
    # Nginx écoute sur le port 80 à l'intérieur du conteneur
    listen 80;

    # Nom du serveur (localhost pour le développement)
    server_name localhost;

    # Dossier racine où se trouvent les fichiers publics de Symfony
    root /var/www/html/public;

    # Page par défaut à charger
    index index.php;

    # Gestion des requêtes
    location / {
        # Essaie de servir le fichier demandé directement
        # Si le fichier n'existe pas, redirige vers index.php
        try_files $uri /index.php$is_args$args;
    }

    # Front controller Symfony (index.php)
    location ~ ^/index\.php(/|$) {
        fastcgi_pass php:9000;
        fastcgi_split_path_info ^(.+\.php)(/.*)$;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
    }

    # Autres scripts PHP dans public/ (cursus PHP : test.php, notes.php, etc.)
    # En production Symfony seule, on peut restreindre à index.php.
    location ~ \.php$ {
        try_files $uri =404;
        fastcgi_pass php:9000;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        fastcgi_param DOCUMENT_ROOT $realpath_root;
    }

    # Emplacement des logs d'erreur
    error_log /var/log/nginx/symfony_error.log;
    access_log /var/log/nginx/symfony_access.log;
}
```

---

### Étape 5 : Lancer l'environnement Docker

Ouvre un terminal dans le dossier `mon-projet` et exécute :

```bash
# Construit les images et démarre tous les conteneurs
# -d signifie "detached" : les conteneurs tournent en arrière-plan
docker compose up -d --build
```

**Explication des options** :

- `up` : démarre les services
- `-d` : mode détaché (le terminal reste libre)
- `--build` : reconstruit les images (nécessaire la première fois ou après modification du Dockerfile)

**Résultat attendu** :

```text
[+] Building 45.2s (12/12) FINISHED
[+] Running 4/4
 ✔ Network mon-projet_symfony_network  Created
 ✔ Volume "mon-projet_postgres_data"   Created
 ✔ Container symfony_database          Started
 ✔ Container symfony_php               Started
 ✔ Container symfony_nginx             Started
```

Pour vérifier que tout fonctionne :

```bash
docker compose ps
```

**Résultat attendu** :

```text
NAME                STATUS              PORTS
symfony_database    Up                  0.0.0.0:5432->5432/tcp
symfony_nginx       Up                  0.0.0.0:8080->80/tcp
symfony_php         Up                  9000/tcp
```

Les trois conteneurs doivent avoir le statut "Up".

---

### Étape 6 : Installer Symfony dans le conteneur PHP

Maintenant que l'environnement tourne, on installe Symfony.

```bash
# Entre dans le conteneur PHP
docker compose exec php bash
```

Tu es maintenant **à l'intérieur** du conteneur. Le prompt change (exemple : `root@abc123:/var/www/html#`).

Exécute ces commandes **dans le conteneur** :

```bash
# Crée un nouveau projet Symfony dans le dossier actuel
# Le "." signifie "dans le dossier courant"
composer create-project symfony/skeleton:"7.4.*" .
```

**Résultat attendu** : Composer télécharge Symfony et crée les fichiers du projet.

Pour quitter le conteneur :

```bash
exit
```

---

### Étape 6 bis : Installer Doctrine (accès à la base de données)

Le squelette Symfony minimal n'inclut pas Doctrine, l'outil qui gère la base de données. On l'installe maintenant.

```bash
# Entre dans le conteneur PHP (si tu en es sorti)
docker compose exec php bash
```

Puis, **dans le conteneur**, exécute ces commandes :

```bash
# Installe Doctrine (ORM + outil de migrations)
composer require symfony/orm-pack

# Installe le MakerBundle (commandes make:entity, make:controller...), en développement uniquement
composer require --dev symfony/maker-bundle
```

L'installation de `symfony/orm-pack` ajoute automatiquement une ligne `DATABASE_URL` dans le fichier `app/.env`. C'est cette ligne que tu vas modifier à l'étape suivante.

Puis quitte le conteneur :

```bash
exit
```

---

### Étape 7 : Configurer la connexion à PostgreSQL

Symfony utilise un fichier `.env` pour la configuration. Modifie le fichier `app/.env` :

Après l'installation de Doctrine (Étape 6 bis), le fichier `app/.env` contient une ligne `DATABASE_URL`. Remplace-la par :

```env
DATABASE_URL="postgresql://symfony_user:symfony_password@database:5432/symfony_db?serverVersion=16&charset=utf8"
```

**Explication de l'URL** :

- `postgresql://` : protocole de connexion
- `symfony_user` : nom d'utilisateur (défini dans docker-compose.yml)
- `symfony_password` : mot de passe (défini dans docker-compose.yml)
- `database` : nom du service Docker (pas localhost !)
- `5432` : port PostgreSQL
- `symfony_db` : nom de la base de données
- `serverVersion=16` : version de PostgreSQL

---

### Étape 8 : Tester l'installation

Ouvre ton navigateur et va à l'adresse :

```text
http://localhost:8080
```

**Résultat attendu** : Tu vois la page d'accueil de Symfony avec le message "Welcome to Symfony".

Si tu vois une erreur 404 ou une page blanche, vérifie les logs :

```bash
docker compose logs nginx
docker compose logs php
```

---

## Commandes Docker Compose

### Commandes de gestion des conteneurs

| Commande                       | Action                                                        |
| ------------------------------ | ------------------------------------------------------------- |
| `docker compose up -d`         | Démarre les conteneurs en arrière-plan                        |
| `docker compose up`            | Démarre les conteneurs avec les logs visibles (Ctrl+C arrête) |
| `docker compose up -d --build` | Démarre et reconstruit les images                             |
| `docker compose down`          | Arrête et supprime les conteneurs, réseaux                    |
| `docker compose stop`          | Arrête les conteneurs sans les supprimer                      |
| `docker compose start`         | Redémarre les conteneurs arrêtés                              |
| `docker compose restart`       | Redémarre tous les conteneurs                                 |
| `docker compose ps`            | Liste les conteneurs en cours d'exécution                     |
| `docker compose ps -a`         | Liste tous les conteneurs (même arrêtés)                      |

### Différence entre `stop` et `down`

| Commande                 | Conteneurs | Réseaux   | Volumes nommés |
| ------------------------ | ---------- | --------- | -------------- |
| `docker compose stop`    | Arrêtés    | Conservés | Conservés      |
| `docker compose down`    | Supprimés  | Supprimés | Conservés      |
| `docker compose down -v` | Supprimés  | Supprimés | **Supprimés** (données perdues) |

⚠️ **Danger** : n'utilise `docker compose down -v` que si tu veux effacer volontairement les volumes (base PostgreSQL, etc.). Sans `-v`, les volumes nommés sont conservés.

### Commandes de logs

| Commande                        | Action                            |
| ------------------------------- | --------------------------------- |
| `docker compose logs`           | Affiche tous les logs             |
| `docker compose logs -f`        | Affiche les logs en temps réel    |
| `docker compose logs php`       | Affiche les logs du service php   |
| `docker compose logs -f php`    | Logs du service php en temps réel |
| `docker compose logs --tail=50` | Affiche les 50 dernières lignes   |

### Commandes d'exécution

| Commande                                                          | Action                                     |
| ----------------------------------------------------------------- | ------------------------------------------ |
| `docker compose exec php bash`                                    | Ouvre un terminal dans le conteneur PHP    |
| `docker compose exec php [cmd]`                                   | Exécute une commande dans le conteneur PHP |
| `docker compose exec database psql -U symfony_user -d symfony_db` | Ouvre PostgreSQL en ligne de commande      |

### Commandes de construction

| Commande                          | Action                                           |
| --------------------------------- | ------------------------------------------------ |
| `docker compose build`            | Construit les images                             |
| `docker compose build --no-cache` | Reconstruit sans utiliser le cache               |
| `docker compose pull`             | Télécharge les dernières versions des images     |

---

## Commandes à exécuter dans le conteneur PHP

Ces commandes doivent être exécutées à l'intérieur du conteneur PHP. Tu as deux options :

### Option 1 : Entrer dans le conteneur puis exécuter

```bash
docker compose exec php bash
php bin/console cache:clear
exit
```

### Option 2 : Exécuter directement depuis ta machine (raccourci)

```bash
docker compose exec php php bin/console cache:clear
```

La deuxième option est plus rapide pour une seule commande.

---

### Commandes Doctrine (base de données)

| Commande                                         | Action                                    |
| ------------------------------------------------ | ----------------------------------------- |
| `php bin/console doctrine:database:create`       | Crée la base de données                   |
| `php bin/console doctrine:database:drop --force` | Supprime la base de données               |
| `php bin/console make:entity`                    | Crée une nouvelle entité (table)          |
| `php bin/console make:migration`                 | Génère une migration à partir des entités |
| `php bin/console doctrine:migrations:migrate`    | Exécute les migrations en attente         |
| `php bin/console doctrine:migrations:status`     | Affiche l'état des migrations             |
| `php bin/console doctrine:schema:validate`       | Vérifie la cohérence entités/base         |

**Workflow typique Doctrine** :

1. `make:entity` → Crée ou modifie une entité
2. `make:migration` → Génère le fichier de migration
3. `doctrine:migrations:migrate` → Applique la migration à la base

---

### Commandes Symfony Console

| Commande                          | Action                                             |
| --------------------------------- | -------------------------------------------------- |
| `php bin/console cache:clear`     | Vide le cache (à faire après modification config)  |
| `php bin/console debug:router`    | Liste toutes les routes                            |
| `php bin/console debug:container` | Liste les services disponibles                     |
| `php bin/console make:controller` | Crée un nouveau contrôleur                         |
| `php bin/console make:form`       | Crée un formulaire                                 |
| `php bin/console list`            | Liste toutes les commandes disponibles             |

---

### Commandes Composer

| Commande                           | Action                                          |
| ---------------------------------- | ----------------------------------------------- |
| `composer install`                 | Installe les dépendances (depuis composer.lock) |
| `composer update`                  | Met à jour les dépendances                      |
| `composer require [package]`       | Ajoute une nouvelle dépendance                  |
| `composer require --dev [package]` | Ajoute une dépendance de développement          |
| `composer dump-autoload`           | Régénère l'autoloader                           |

**Exemple** : Installer le bundle Doctrine

```bash
docker compose exec php composer require symfony/orm-pack
```

---

## Pièges Fréquents

### Piège 1 : "Connection refused" à la base de données

⚠️ **Problème** : L'application Symfony ne peut pas se connecter à PostgreSQL.

✅ **Solution** : Dans le fichier `.env`, utilise `database` comme nom d'hôte, pas `localhost`. Le nom `database` correspond au nom du service dans `docker-compose.yml`.

```env
# ❌ Incorrect
DATABASE_URL="postgresql://symfony_user:symfony_password@localhost:5432/symfony_db"

# ✅ Correct
DATABASE_URL="postgresql://symfony_user:symfony_password@database:5432/symfony_db"
```

---

### Piège 2 : Permission denied sur Mac

⚠️ **Problème** : Des erreurs de permission apparaissent dans les logs PHP.

✅ **Solution** : Donne les permissions au dossier `var` de Symfony :

```bash
docker compose exec php chown -R www-data:www-data var/ && chmod -R 775 var/
```

---

### Piège 3 : Le port 5432 est déjà utilisé

⚠️ **Problème** : Tu as déjà PostgreSQL installé localement sur le même port.

✅ **Solution** : Change le port dans `docker-compose.yml` :

```yaml
ports:
  - "5433:5432" # Utilise le port 5433 sur ta machine
```

---

### Piège 4 : Les modifications de code ne sont pas prises en compte

⚠️ **Problème** : Tu modifies un fichier mais rien ne change.

✅ **Solution** : Vérifie que le volume est bien monté :

```bash
docker compose exec php ls -la /var/www/html
```

Tu dois voir tes fichiers Symfony. Si le dossier est vide, vérifie le chemin du volume dans `docker-compose.yml`.

---

## Pour aller plus loin

Ces concepts ne sont pas nécessaires pour ce projet, mais tu peux les explorer si tu veux approfondir :

- **Docker Hub** : Le registre public où sont stockées les images Docker. Tu peux y publier tes propres images et télécharger celles créées par d'autres.

- **Multi-stage builds** : Technique pour créer des images plus légères en séparant l'étape de build (compilation) de l'étape de production (exécution).

- **Docker Swarm** : Outil intégré à Docker pour gérer des conteneurs sur plusieurs machines. Utile quand ton application doit tourner sur plusieurs serveurs.

- **Kubernetes** : L'alternative à Docker Swarm, plus complexe mais plus puissante. C'est le standard dans les grandes entreprises pour orchestrer des conteneurs.

- **Health checks** : Configuration permettant à Docker de vérifier automatiquement si un conteneur fonctionne correctement et de le redémarrer si nécessaire.

- **Docker secrets** : Mécanisme sécurisé pour gérer les mots de passe et clés API en production, sans les écrire en clair dans les fichiers.

---

## Checklist de Validation

- [ ] J'ai créé les fichiers `Dockerfile`, `docker-compose.yml` et `default.conf`
- [ ] La commande `docker compose up -d --build` s'exécute sans erreur
- [ ] La commande `docker compose ps` montre 3 conteneurs avec le statut "Up"
- [ ] Je peux accéder à `http://localhost:8080` dans mon navigateur
- [ ] Je peux entrer dans le conteneur PHP avec `docker compose exec php bash`
- [ ] La commande `composer --version` fonctionne dans le conteneur PHP

---

## Exercice Pratique

**Énoncé** : Ajoute un service Adminer à ton `docker-compose.yml` pour visualiser la base de données via une interface web.

**Indications** :

- Adminer est une interface web pour gérer les bases de données
- L'image Docker s'appelle `adminer`
- Utilise le port 8081 sur ta machine

**Résultat attendu** : Tu peux accéder à `http://localhost:8081` et te connecter à PostgreSQL avec les identifiants définis.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Ajoute ce service dans ton `docker-compose.yml`, dans la section `services:` :

```yaml
# ============================================
# SERVICE ADMINER (Interface de gestion BDD)
# ============================================
adminer:
  # Image officielle Adminer
  image: adminer

  # Nom du conteneur
  container_name: symfony_adminer

  # Mappage des ports
  ports:
    - "8081:8080"

  # Dépendances
  depends_on:
    - database

  # Réseaux
  networks:
    - symfony_network
```

Puis relance les conteneurs :

```bash
docker compose up -d
```

Pour te connecter à Adminer :

1. Va sur `http://localhost:8081`
2. Système : PostgreSQL
3. Serveur : `database`
4. Utilisateur : `symfony_user`
5. Mot de passe : `symfony_password`
6. Base de données : `symfony_db`

---

## Récapitulatif des fichiers créés

```text
mon-projet/
├── docker-compose.yml
├── docker/
│   ├── php/
│   │   └── Dockerfile
│   └── nginx/
│       └── default.conf
└── app/
    └── (fichiers Symfony après installation)
```

---

## Navigation

→ Fiche suivante : **[Lancer le projet et initialiser Git](02-lancement-projet-git.md)**
