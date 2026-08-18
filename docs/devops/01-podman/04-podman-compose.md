---
tags:
  - Podman
  - Intermédiaire
  - Pratique
description: "Podman Compose et Quadlet"
estimated_time: "90 min"
fiche_number: 4
total_fiches: 5
cursus: "Podman"
---

# 04 - Podman Compose et Quadlet

> **En bref** : À la fin de cette fiche, tu sauras utiliser podman-compose pour gérer des applications multi-conteneurs et connaître les bases de Quadlet (intégration systemd). Lecture estimée : 90 min.


## Prérequis

- Fiche **[03 - Les Pods dans Podman](03-pods-podman.md)**
- Fiche **[01 - Créer un environnement Docker Compose pour Symfony](../../01-docker/01-docker-compose-symfony.md)**
- Podman installé et fonctionnel sur ton ordinateur
- Savoir utiliser le terminal (ligne de commande)

## Versions utilisées dans cette fiche

| Technologie    | Version |
| -------------- | ------- |
| Podman         | 5.x (exemples compatibles 4.x+) |
| podman-compose | 1.x     |
| Python / pip   | 3.x     |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser podman-compose pour gérer des applications multi-conteneurs et connaître les bases de Quadlet (intégration systemd).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que podman-compose ?

**Définition** : podman-compose est un outil tiers (développé par la communauté) qui lit les fichiers `docker-compose.yml` et les exécute avec Podman au lieu de Docker.

**Le problème que podman-compose résout** :

Sans podman-compose, voici les problèmes rencontrés :

1. **Réécriture des fichiers** : Tu as un fichier `docker-compose.yml` qui fonctionne avec Docker. Pour utiliser Podman, tu devrais réécrire toute la configuration en commandes Podman individuelles.

2. **Commandes longues et répétitives** : Lancer une application multi-conteneurs avec Podman nécessite plusieurs commandes séparées (`podman run`, `podman network create`, `podman volume create`...).

3. **Migration complexe** : De nombreux projets existants utilisent Docker Compose. Migrer vers Podman sans outil de compatibilité oblige à tout reconfigurer manuellement.

4. **Documentation inutilisable** : La plupart des tutoriels fournissent des fichiers `docker-compose.yml`. Sans podman-compose, ces ressources ne fonctionnent pas avec Podman.

**Comment podman-compose résout ces problèmes** :

| Problème                         | Solution apportée par podman-compose                           |
| -------------------------------- | -------------------------------------------------------------- |
| Réécriture des fichiers          | Lit directement les fichiers `docker-compose.yml` existants    |
| Commandes longues et répétitives | Une seule commande (`podman-compose up`) fait tout             |
| Migration complexe               | Aucune modification du fichier `docker-compose.yml` nécessaire |
| Documentation inutilisable       | Les tutoriels Docker Compose fonctionnent tels quels           |

Le diagramme suivant illustre l'architecture d'une application multi-conteneurs gérée par podman-compose.

<div class="diagram-design">
<p><a href="../../../diagrams/devops-01-podman-04-podman-compose-1.html">Qu&#x27;est-ce que podman-compose ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/devops-01-podman-04-podman-compose-1.html" title="Qu&#x27;est-ce que podman-compose ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : podman-compose est comme un adaptateur de prise électrique. Tu as un appareil avec une prise européenne (le fichier `docker-compose.yml` conçu pour Docker). Tu veux le brancher sur une prise américaine (Podman). L'adaptateur (podman-compose) permet de brancher l'appareil sans le modifier. L'appareil fonctionne exactement comme avant, mais sur un système différent.

**Ce que podman-compose n'est PAS** :

- podman-compose est un projet communautaire hébergé sous l'organisation `containers` sur GitHub (avec des contributions d'ingénieurs Red Hat), mais ce n'est pas un produit Red Hat officiel.
- podman-compose n'est pas Docker Compose. C'est un outil séparé qui imite le comportement de Docker Compose en utilisant Podman. Certaines fonctionnalités avancées peuvent ne pas être supportées.
- podman-compose n'est pas nécessaire si tu utilises uniquement des commandes Podman manuelles. C'est un outil de confort pour réutiliser les fichiers `docker-compose.yml`.

**Note importante** : Depuis Podman 4.7, la commande `podman compose` (avec un espace, sans tiret) existe aussi. C'est une sous-commande intégrée à Podman qui appelle automatiquement `podman-compose` ou `docker-compose` s'ils sont installés. Les deux approches fonctionnent.

**Comparaison docker compose vs podman-compose** :

| Critère               | docker compose (V2)            | podman-compose                         |
| --------------------- | ------------------------------ | -------------------------------------- |
| Éditeur               | Docker Inc.                    | Communauté (projet open source)        |
| Moteur utilisé        | Docker Engine                  | Podman                                 |
| Fichier de config     | `docker-compose.yml`           | `docker-compose.yml` (le même fichier) |
| Installation          | Inclus dans Docker Desktop     | `pip install podman-compose`           |
| Daemon requis         | Oui (Docker daemon)            | Non (rootless par défaut)              |
| Commande de lancement | `docker compose up`            | `podman-compose up`                    |
| Réseaux               | Docker bridge                  | Netavark (réseau Podman)               |
| Support complet       | Toutes les fonctionnalités     | La majorité des fonctionnalités        |

---

### Qu'est-ce que les réseaux Podman (netavark) ?

**Définition** : Netavark est le système de réseau par défaut de Podman (depuis Podman 4.0). Il gère la communication entre les conteneurs, comme les réseaux Docker bridge.

**Le problème que netavark résout** :

Sans réseau dédié, voici les problèmes rencontrés :

1. **Isolation totale** : Les conteneurs ne peuvent pas communiquer entre eux par défaut. Le conteneur PHP ne peut pas contacter le conteneur PostgreSQL.

2. **Adresses IP dynamiques** : Chaque conteneur reçoit une adresse IP différente à chaque démarrage. Tu ne peux pas coder une adresse IP en dur.

3. **Pas de résolution de noms** : Sans réseau, tu ne peux pas utiliser le nom du service (comme `database`) pour contacter un autre conteneur.

**Comment netavark résout ces problèmes** :

| Problème                  | Solution apportée par netavark                              |
| ------------------------- | ----------------------------------------------------------- |
| Isolation totale          | Les conteneurs sur le même réseau peuvent communiquer       |
| Adresses IP dynamiques    | Netavark résout les noms automatiquement (DNS interne)      |
| Pas de résolution de noms | Tu utilises le nom du service (`database`) au lieu de l'IP  |

**Analogie concrète** : Netavark fonctionne comme un annuaire téléphonique interne dans un bureau. Chaque employé (conteneur) a un numéro de téléphone (adresse IP) qui peut changer. L'annuaire (netavark) permet de joindre n'importe quel employé par son nom. Tu appelles "Jean du service comptabilité" (le conteneur `database`), et l'annuaire trouve automatiquement le bon numéro.

**Ce que netavark n'est PAS** :

- Netavark n'est pas un outil que tu utilises directement. C'est un composant interne de Podman. Tu n'as jamais besoin de taper une commande netavark.
- Netavark n'est pas Docker bridge. C'est le système réseau spécifique à Podman. Il remplace CNI (Container Network Interface), l'ancien système réseau de Podman.

**Comparaison netavark vs Docker bridge** :

| Critère           | Netavark (Podman)               | Docker bridge                   |
| ----------------- | ------------------------------- | ------------------------------- |
| DNS interne       | Oui (résolution par nom)        | Oui (résolution par nom)        |
| Isolation réseau  | Oui                             | Oui                             |
| Performance       | Comparable à Docker             | Comparable à Podman             |
| Configuration     | Automatique avec podman-compose | Automatique avec docker compose |
| Outil sous-jacent | Netavark (depuis Podman 4.0)    | libnetwork                      |

---

### Qu'est-ce que les volumes Podman ?

**Définition** : Un volume Podman est un mécanisme pour stocker des données en dehors du conteneur. Les données persistent même si le conteneur est supprimé.

**Le problème que les volumes résolvent** :

Sans volumes, voici les problèmes rencontrés :

1. **Perte de données** : Quand un conteneur est supprimé, tout ce qu'il contient disparaît. Ta base de données serait vide à chaque redémarrage.

2. **Pas de synchronisation** : Tu ne peux pas modifier ton code dans VS Code et voir les changements dans le conteneur.

3. **Données inaccessibles** : Les fichiers créés dans le conteneur ne sont pas visibles depuis ton ordinateur.

**Comment les volumes Podman résolvent ces problèmes** :

| Problème               | Solution apportée par les volumes                                  |
| ---------------------- | ------------------------------------------------------------------ |
| Perte de données       | Les données sont stockées en dehors du conteneur, elles persistent |
| Pas de synchronisation | Le dossier est partagé entre ton ordinateur et le conteneur        |
| Données inaccessibles  | Le volume rend les fichiers accessibles des deux côtés             |

**Analogie concrète** : Un volume Podman est comme un coffre-fort dans un hôtel. Tu séjournes dans une chambre (le conteneur). Si tu quittes la chambre (le conteneur est supprimé), tes objets dans la chambre disparaissent. Mais tout ce que tu as mis dans le coffre-fort (le volume) reste en sécurité. Tu peux revenir dans une nouvelle chambre et retrouver tes affaires.

**Ce que les volumes Podman ne sont PAS** :

- Les volumes ne sont pas des copies de fichiers. C'est un partage en temps réel. Modifier un fichier d'un côté le modifie immédiatement de l'autre.
- Les volumes ne sont pas créés automatiquement pour tous les conteneurs. Tu dois les déclarer explicitement dans ton fichier de configuration.

**Deux types de volumes** :

| Type         | Syntaxe YAML                               | Utilisation                                        |
| ------------ | ------------------------------------------ | -------------------------------------------------- |
| Bind mount   | `- ./app:/var/www/html`                    | Code source (tu modifies les fichiers depuis VS Code) |
| Named volume | `- postgres_data:/var/lib/postgresql/data` | Données de base de données (gérées par Podman)     |

---

### Qu'est-ce que Quadlet ?

**Définition** : Quadlet est un système d'intégration de Podman avec systemd (le gestionnaire de services de Linux). Il permet de déclarer des conteneurs sous forme de fichiers de configuration systemd simplifiés.

**Le problème que Quadlet résout** :

Sans Quadlet, voici les problèmes rencontrés :

1. **Pas de démarrage automatique** : Si ta machine redémarre, tes conteneurs ne se relancent pas. Tu dois les relancer manuellement avec `podman-compose up`.

2. **Fichiers systemd complexes** : Pour que systemd gère un conteneur, il faut écrire un fichier `.service` complexe avec toutes les options Podman.

3. **Pas de gestion centralisée** : Sans intégration systemd, tu ne peux pas utiliser les commandes `systemctl` (`start`, `stop`, `status`) pour gérer tes conteneurs.

4. **Pas de journalisation** : Les logs des conteneurs ne sont pas intégrés au journal systemd (`journalctl`).

**Comment Quadlet résout ces problèmes** :

| Problème                     | Solution apportée par Quadlet                                       |
| ---------------------------- | ------------------------------------------------------------------- |
| Pas de démarrage automatique | Le conteneur démarre automatiquement au boot de la machine          |
| Fichiers systemd complexes   | Un format simplifié (`.container`) remplace les fichiers `.service`  |
| Pas de gestion centralisée   | Tu utilises `systemctl start/stop/status` comme pour tout service   |
| Pas de journalisation        | Les logs sont accessibles via `journalctl`                          |

**Analogie concrète** : Quadlet est comme un programmateur de machine à laver. Sans programmateur, tu dois appuyer sur le bouton "Marche" à chaque fois. Avec le programmateur (Quadlet), tu configures une fois le programme. La machine se lance automatiquement sans que tu aies besoin d'intervenir. Si la machine s'arrête (panne de courant), le programmateur la relance dès que le courant revient.

**Ce que Quadlet n'est PAS** :

- Quadlet n'est pas un orchestrateur comme Kubernetes. Il ne gère pas la répartition de conteneurs sur plusieurs machines. Il fonctionne sur une seule machine.
- Quadlet n'est pas un remplacement de podman-compose pour le développement. Quadlet est conçu pour les services qui doivent tourner en permanence (serveurs web, bases de données).
- Quadlet n'est pas disponible sur macOS ou Windows. Il nécessite systemd, spécifique à Linux.

**Les types de fichiers Quadlet** :

| Extension    | Rôle                                  | Emplacement utilisateur            |
| ------------ | ------------------------------------- | ---------------------------------- |
| `.container` | Définit un conteneur                  | `~/.config/containers/systemd/`    |
| `.pod`       | Définit un pod (groupe de conteneurs) | `~/.config/containers/systemd/`    |
| `.network`   | Définit un réseau                     | `~/.config/containers/systemd/`    |
| `.volume`    | Définit un volume                     | `~/.config/containers/systemd/`    |

**Comparaison podman-compose vs Quadlet** :

| Critère                  | podman-compose                   | Quadlet                               |
| ------------------------ | -------------------------------- | ------------------------------------- |
| Cas d'usage principal    | Développement local              | Services en production / serveur      |
| Démarrage automatique    | Non (tu lances manuellement)     | Oui (au boot de la machine)           |
| Redémarrage automatique  | Non                              | Oui (si configuré)                    |
| Fichier de configuration | `docker-compose.yml`             | Fichiers `.container`, `.pod`, etc.   |
| Système requis           | Tout OS (Linux, macOS, Windows)  | Linux uniquement (systemd requis)     |
| Gestion des logs         | `podman-compose logs`            | `journalctl`                          |

---

## Étapes Pratiques

### Étape 1 : Installer podman-compose

La méthode d'installation dépend de ton système :

```bash
# Sur Fedora / RHEL (méthode recommandée)
sudo dnf install podman-compose
```

```bash
# Sur Ubuntu / Debian
sudo apt install podman-compose
```

```bash
# Via pip (toutes plateformes) - utilise --user pour éviter les erreurs de permission
pip install --user podman-compose
```

Si `pip` ne fonctionne pas, utilise `pip3 install --user podman-compose` ou `pipx install podman-compose`.

Vérifie l'installation :

```bash
podman-compose --version
```

**Résultat attendu** :

```text
podman-compose version 1.x.x
```

---

### Étape 2 : Préparer le projet

Copie le projet du cours Docker Compose (Fiche 01) dans un nouveau dossier :

```bash
# Copie le projet Docker existant
cp -r mon-projet mon-projet-podman

# Entre dans le nouveau dossier
cd mon-projet-podman
```

Si tu n'as pas le projet Docker, crée la structure :

```bash
mkdir -p mon-projet-podman/docker/php mon-projet-podman/docker/nginx mon-projet-podman/app
cd mon-projet-podman
```

Le fichier `docker-compose.yml`, le `Dockerfile` et la configuration Nginx sont identiques à ceux du cours Docker Compose (Fiche 01). podman-compose lit exactement le même format.

---

### Étape 3 : Lancer avec podman-compose

```bash
# Construit les images et démarre tous les conteneurs en arrière-plan
podman-compose up -d
```

**Résultat attendu** :

```text
['podman', '--version', '']
using podman version: 5.x.x
podman build -t mon-projet-podman_php ./docker/php
...
Creating network mon-projet-podman_symfony_network
Creating volume mon-projet-podman_postgres_data
Creating container symfony_database
Creating container symfony_php
Creating container symfony_nginx
```

---

### Étape 4 : Vérifier que tout fonctionne

Vérifie les conteneurs :

```bash
podman-compose ps
```

**Résultat attendu** :

```text
CONTAINER ID  IMAGE                                   STATUS        PORTS                   NAMES
abc123def456  localhost/mon-projet-podman_php:latest   Up 2 seconds  9000/tcp                symfony_php
789ghi012jkl  docker.io/library/nginx:alpine          Up 2 seconds  0.0.0.0:8080->80/tcp    symfony_nginx
345mno678pqr  docker.io/library/postgres:16-alpine    Up 3 seconds  0.0.0.0:5432->5432/tcp  symfony_database
```

Vérifie le réseau :

```bash
podman network ls
```

**Résultat attendu** :

```text
NETWORK ID    NAME                                 DRIVER
abc123def456  mon-projet-podman_symfony_network     bridge
2f259bab93aa  podman                               bridge
```

Vérifie le volume :

```bash
podman volume ls
```

**Résultat attendu** :

```text
DRIVER      VOLUME NAME
local       mon-projet-podman_postgres_data
```

Vérifie les logs :

```bash
# Logs de tous les services
podman-compose logs

# Logs d'un service spécifique
podman-compose logs php
```

---

### Étape 5 : Commandes courantes

**Arrêter les conteneurs** :

```bash
podman-compose down
```

**Relancer les conteneurs** :

```bash
podman-compose up -d
```

**Entrer dans le conteneur PHP** :

```bash
podman-compose exec php bash
```

Pour sortir du conteneur :

```bash
exit
```

**Reconstruire les images** (après modification du Dockerfile) :

```bash
podman-compose up -d --build
```

---

### Étape 6 : Créer un fichier Quadlet (optionnel - Linux uniquement)

Cette étape ne fonctionne que sur Linux (systemd requis).

**Crée le dossier de configuration** :

```bash
mkdir -p ~/.config/containers/systemd
```

**Crée le fichier `~/.config/containers/systemd/nginx.container`** :

```text
[Unit]
Description=Serveur web Nginx
After=network-online.target

[Container]
Image=docker.io/library/nginx:alpine
ContainerName=mon-nginx
PublishPort=8080:80

[Service]
Restart=always

[Install]
WantedBy=default.target
```

**Active et démarre le conteneur** :

```bash
# Recharge la configuration systemd
systemctl --user daemon-reload

# Démarre le conteneur
systemctl --user start nginx

# Vérifie le statut
systemctl --user status nginx
```

**Résultat attendu** :

```text
● nginx.service - Serveur web Nginx
     Loaded: loaded (/home/user/.config/containers/systemd/nginx.container)
     Active: active (running) since ...
```

**Démarrage automatique au boot** :

```bash
systemctl --user enable nginx
```

**Arrêter le conteneur** :

```bash
systemctl --user stop nginx
```

---

## Commandes Utiles

### Commandes podman-compose

| Commande                       | Action                                        |
| ------------------------------ | --------------------------------------------- |
| `podman-compose up -d`         | Démarre les conteneurs en arrière-plan         |
| `podman-compose up -d --build` | Démarre et reconstruit les images              |
| `podman-compose down`          | Arrête et supprime les conteneurs et le réseau |
| `podman-compose ps`            | Liste les conteneurs en cours d'exécution      |
| `podman-compose logs`          | Affiche les logs de tous les services          |
| `podman-compose logs php`      | Affiche les logs du service PHP                |
| `podman-compose exec php bash` | Ouvre un terminal dans le conteneur PHP        |
| `podman-compose stop`          | Arrête les conteneurs sans les supprimer       |
| `podman-compose start`         | Redémarre les conteneurs arrêtés               |
| `podman-compose restart`       | Redémarre tous les conteneurs                  |

### Commandes réseau et volume Podman

| Commande                            | Action                          |
| ----------------------------------- | ------------------------------- |
| `podman network ls`                 | Liste tous les réseaux          |
| `podman network create mon_reseau`  | Crée un réseau                  |
| `podman network rm mon_reseau`      | Supprime un réseau              |
| `podman network prune`              | Supprime les réseaux inutilisés |
| `podman volume ls`                  | Liste tous les volumes          |
| `podman volume create mon_volume`   | Crée un volume nommé            |
| `podman volume rm mon_volume`       | Supprime un volume              |
| `podman volume prune`               | Supprime les volumes inutilisés |

### Commandes systemctl pour Quadlet (Linux uniquement)

| Commande                         | Action                                  |
| -------------------------------- | --------------------------------------- |
| `systemctl --user daemon-reload` | Recharge la configuration systemd       |
| `systemctl --user start nginx`   | Démarre le conteneur                    |
| `systemctl --user stop nginx`    | Arrête le conteneur                     |
| `systemctl --user status nginx`  | Affiche le statut du conteneur          |
| `systemctl --user enable nginx`  | Active le démarrage automatique au boot |
| `systemctl --user disable nginx` | Désactive le démarrage automatique      |
| `journalctl --user -u nginx`    | Affiche les logs via journalctl         |

---

## Pièges Fréquents

### Piège 1 : podman-compose n'est pas installé par défaut

**Problème** : Tu tapes `podman-compose up` et tu obtiens `command not found`.

**Solution** :

```bash
# Installe podman-compose
pip install podman-compose

# Si pip n'est pas disponible :
# Fedora / RHEL : sudo dnf install python3-pip
# Ubuntu / Debian : sudo apt install python3-pip
# macOS : brew install python3
```

---

### Piège 2 : Permissions des volumes en mode rootless

**Problème** : Le conteneur n'a pas les droits de lecture ou d'écriture sur les fichiers montés en bind mount.

**Explication** : En mode rootless, les UID/GID à l'intérieur du conteneur ne correspondent pas aux UID/GID de ton utilisateur sur la machine hôte.

**Solution** :

Sur les systèmes avec SELinux (Fedora, RHEL), ajoute `:Z` au montage :

```yaml
volumes:
  - ./app:/var/www/html:Z
```

Sur les systèmes sans SELinux, utilise `podman unshare` :

```bash
# 33 = UID de www-data dans l'image PHP-FPM
podman unshare chown -R 33:33 ./app
```

---

### Piège 3 : Les noms de conteneurs entrent en conflit

**Problème** : Erreur `container name already in use` au lancement.

**Solution** :

```bash
# Supprime le conteneur en conflit
podman rm symfony_php

# Ou supprime tous les conteneurs arrêtés
podman container prune

# Puis relance
podman-compose up -d
```

---

### Piège 4 : Les fichiers Quadlet ne sont pas détectés

**Problème** : `systemctl --user daemon-reload` ne détecte pas ton fichier Quadlet.

**Solution** : Vérifie deux points.

Le fichier doit avoir la bonne extension (`.container`, `.pod`, `.network` ou `.volume`).

Le fichier doit être dans le bon dossier :

- Utilisateur courant : `~/.config/containers/systemd/`
- Système (root) : `/etc/containers/systemd/`

---

### Piège 5 : Différence de syntaxe docker compose vs podman-compose

**Problème** : Un script utilisant `docker compose` ne fonctionne pas avec podman-compose.

**Explication** : `docker compose` (V2) est une sous-commande de `docker` (avec un espace). `podman-compose` est un programme séparé (avec un tiret).

| Docker (V2)              | Podman                     |
| ------------------------ | -------------------------- |
| `docker compose up -d`   | `podman-compose up -d`     |
| `docker compose down`    | `podman-compose down`      |
| `docker compose ps`      | `podman-compose ps`        |
| `docker compose logs`    | `podman-compose logs`      |

---

## Checklist de Validation

- [ ] J'ai installé podman-compose avec pip
- [ ] La commande `podman-compose --version` affiche un numéro de version
- [ ] La commande `podman-compose up -d` démarre les trois conteneurs sans erreur
- [ ] La commande `podman-compose ps` montre les trois conteneurs avec le statut "Up"
- [ ] La commande `podman network ls` montre le réseau créé par podman-compose
- [ ] La commande `podman volume ls` montre le volume PostgreSQL
- [ ] La commande `podman-compose down` arrête et supprime les conteneurs
- [ ] Je comprends la différence entre podman-compose (développement) et Quadlet (production)

---

## Exercice Pratique

**Énoncé** : Prends le fichier `docker-compose.yml` du cours Docker Compose (Fiche 01 - docs/01-docker/01-docker-compose-symfony.md) et lance-le avec podman-compose. Vérifie que tous les services fonctionnent.

**Indications** :

- Copie le dossier `mon-projet/` du cours Docker dans un nouveau dossier
- Utilise `podman-compose up -d` au lieu de `docker compose up -d`
- Vérifie les conteneurs, le réseau et le volume
- Consulte les logs pour vérifier qu'il n'y a pas d'erreur

**Résultat attendu** :

- `podman-compose ps` montre 3 conteneurs avec le statut "Up"
- `podman network ls` montre le réseau `symfony_network`
- `podman volume ls` montre le volume `postgres_data`

---

## Solution de l'Exercice

> **Note** : Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Copie le projet existant.

```bash
cp -r mon-projet mon-projet-podman
cd mon-projet-podman
```

**Étape 2** : Vérifie que podman-compose est installé.

```bash
podman-compose --version
```

**Étape 3** : Lance les conteneurs.

```bash
podman-compose up -d
```

**Étape 4** : Vérifie que les conteneurs fonctionnent.

```bash
podman-compose ps
```

Tu dois voir trois conteneurs avec le statut "Up".

**Étape 5** : Vérifie le réseau et le volume.

```bash
podman network ls
podman volume ls
```

**Étape 6** : Vérifie les logs.

```bash
podman-compose logs
```

Vérifie qu'il n'y a pas de message d'erreur.

**Étape 7** : Teste dans le navigateur.

Ouvre `http://localhost:8080`. Si Symfony est installé, tu verras la page d'accueil. Si le dossier `app/` est vide, tu verras une erreur 403 (le serveur fonctionne mais il n'y a pas de contenu).

**Étape 8** : Arrête les conteneurs.

```bash
podman-compose down
```

---

## Navigation

← Fiche précédente : **[Les Pods dans Podman](03-pods-podman.md)**

→ Fiche suivante : **[Fonctionnalités Avancées de Podman](05-podman-avance.md)**
