---
tags:
  - Redis
  - Débutant
  - Pratique
description: "Installer Redis avec Docker et maîtriser les commandes de base de redis-cli"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 8
cursus: "Redis et Cache"
id: "web.redis.installation-cli-redis"
course_id: "web.redis"
content_type: "lesson"
order: 2
---

# 02 - Installation et CLI redis

> **En bref** : À la fin de cette fiche, tu sauras installer Redis avec Docker Compose, utiliser redis-cli pour interagir avec le serveur, et maîtriser les commandes de base (SET, GET, DEL, EXISTS, TTL, EXPIRE, KEYS, SCAN). Lecture estimée : 60 min.

## Prérequis

- Fiche [01 - Introduction à Redis](01-introduction-redis.md)
- [Cursus Docker](../01-docker/index.md) terminé
- Savoir utiliser Docker Compose (`docker compose up`, `docker compose down`)

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |
| Docker | 24+ |
| Docker Compose | 2.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer Redis dans un fichier Docker Compose, te connecter avec redis-cli et utiliser les commandes de base pour lire, écrire, supprimer et inspecter des données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que redis-cli ?

**Définition** : redis-cli (Redis Command Line Interface) est un programme en ligne de commande fourni avec Redis. Il te permet d'envoyer des commandes au serveur Redis et de voir les réponses directement dans le terminal.

**Le problème que redis-cli résout** :

Sans redis-cli, voici les problèmes rencontrés :

1. **Pas d'interface graphique** : Redis n'a pas d'interface graphique intégrée (contrairement à pgAdmin pour PostgreSQL). Tu as besoin d'un outil pour interagir avec le serveur.

2. **Débogage difficile** : Quand ton application a un problème de cache, tu as besoin de vérifier manuellement ce que Redis contient.

3. **Tests manuels impossibles** : Tu veux tester une commande Redis avant de l'intégrer dans ton code PHP.

**Comment redis-cli résout ces problèmes** :

| Problème | Solution redis-cli |
| -------- | ------------------ |
| Pas d'interface graphique | Interface texte simple et directe |
| Débogage difficile | Inspecter les clés, valeurs et TTL en temps réel |
| Tests manuels impossibles | Tester chaque commande avant de coder |

**Analogie concrète** : redis-cli est comme le terminal que tu utilises pour parler à ton système d'exploitation. Au lieu de taper des commandes Bash, tu tapes des commandes Redis. C'est un dialogue direct avec le serveur Redis.

**Ce que redis-cli n'est PAS** :

- Ce n'est pas une interface graphique. C'est un outil en ligne de commande (texte uniquement).
- Ce n'est pas un outil de production. En production, ton application (Symfony) communique directement avec Redis via une bibliothèque PHP. redis-cli sert au développement et au débogage.

---

### Docker Compose et Redis

**Définition** : Docker Compose te permet de déclarer plusieurs services (conteneurs) dans un seul fichier YAML. Tu vas ajouter un service Redis à côté de tes services PHP et PostgreSQL existants.

**Le problème que Docker Compose résout pour Redis** :

Sans Docker Compose, tu devrais lancer Redis avec une longue commande `docker run` à chaque fois. Docker Compose te permet de :

1. Déclarer la configuration Redis une seule fois dans un fichier
2. Lancer tous les services (PHP, PostgreSQL, Redis) en une seule commande
3. Créer un réseau partagé entre les services (PHP peut accéder à Redis par son nom de service)

**Configuration Docker Compose pour Redis** :

```yaml
# Extrait de docker-compose.yml
services:
  redis:
    # Image officielle Redis 7, version Alpine (légère)
    image: redis:7-alpine
    # Redémarre automatiquement si Redis crash
    restart: unless-stopped
    # Expose le port 6379 pour redis-cli depuis la machine hôte
    ports:
      - "6379:6379"
    # Volume pour la persistance des données
    volumes:
      - redis_data:/data
    # Commande de démarrage avec persistance AOF activée
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

**Explication de chaque ligne** :

| Ligne | Rôle |
| ----- | ---- |
| `image: redis:7-alpine` | Utilise l'image officielle Redis 7, basée sur Alpine Linux (petite et rapide) |
| `restart: unless-stopped` | Redis redémarre automatiquement sauf si tu l'arrêtes manuellement |
| `ports: "6379:6379"` | Rend Redis accessible depuis ta machine sur le port 6379 |
| `volumes: redis_data:/data` | Les données Redis sont persistées dans un volume Docker |
| `command: redis-server --appendonly yes` | Active la persistance AOF pour ne pas perdre les données au redémarrage |

---

### Les types de réponses Redis

**Définition** : Quand tu envoies une commande à Redis, le serveur répond avec un type de données précis. Comprendre ces types t'aide à interpréter les résultats.

**Les types de réponses** :

| Type | Exemple | Signification |
| ---- | ------- | ------------- |
| Simple string | `OK` | La commande a réussi |
| Bulk string | `"Bonjour"` | Une valeur textuelle |
| Integer | `(integer) 1` | Un nombre entier |
| Nil | `(nil)` | La clé n'existe pas ou pas de résultat |
| Array | `1) "clé1"` `2) "clé2"` | Une liste de résultats |
| Error | `(error) ERR ...` | Une erreur s'est produite |

---

### La commande SCAN vs KEYS

**Définition** : `KEYS` et `SCAN` permettent toutes les deux de chercher des clés par pattern. Mais elles fonctionnent très différemment.

**Le problème avec KEYS** :

La commande `KEYS *` parcourt toutes les clés de la base en une seule opération. Si Redis contient des millions de clés, cette commande bloque le serveur pendant plusieurs secondes. Pendant ce temps, aucune autre commande ne peut être traitée.

**Comment SCAN résout ce problème** :

`SCAN` parcourt les clés par petits lots (par défaut 10 clés à la fois). Entre chaque lot, Redis peut traiter d'autres commandes. Le serveur n'est jamais bloqué.

**Comparaison** :

| KEYS | SCAN |
| ---- | ---- |
| Bloque le serveur | Ne bloque pas le serveur |
| Résultat complet en une fois | Résultat par lots (itération) |
| Acceptable en développement | Recommandé en production |
| Syntaxe simple : `KEYS pattern` | Syntaxe avec curseur : `SCAN 0 MATCH pattern` |

**Règle** : En développement avec peu de clés, `KEYS` est acceptable. En production, utilise toujours `SCAN`.

---

### Les commandes INFO et MONITOR

**Définition** : Redis fournit des commandes d'administration pour surveiller l'état du serveur.

#### INFO

La commande `INFO` affiche des statistiques détaillées sur le serveur Redis :

- Mémoire utilisée
- Nombre de clés
- Nombre de connexions
- Temps de fonctionnement (uptime)

Tu peux demander une section spécifique : `INFO memory`, `INFO stats`, `INFO keyspace`.

#### MONITOR

La commande `MONITOR` affiche en temps réel toutes les commandes reçues par le serveur Redis. C'est un outil de débogage puissant.

**Attention** : `MONITOR` ralentit Redis car le serveur doit envoyer chaque commande au client MONITOR en plus de l'exécuter. Utilise-le uniquement en développement et pour de courtes durées.

---

## Étapes Pratiques

### Étape 1 : Créer un fichier Docker Compose avec Redis

Crée un nouveau dossier de travail et un fichier `docker-compose.yml` :

```bash
# Crée un dossier de travail pour ce cursus
mkdir -p ~/redis-lab
```

Crée le fichier `docker-compose.yml` dans ce dossier avec le contenu suivant :

```yaml
# ~/redis-lab/docker-compose.yml
# Configuration Docker Compose avec Redis pour le cursus Redis et Cache

services:
  # Service Redis
  redis:
    # Image officielle Redis 7 basée sur Alpine Linux
    image: redis:7-alpine
    # Redémarrage automatique
    restart: unless-stopped
    # Port accessible depuis la machine hôte
    ports:
      - "6379:6379"
    # Persistance des données dans un volume Docker
    volumes:
      - redis_data:/data
    # Active la persistance AOF
    command: redis-server --appendonly yes

# Volumes nommés pour la persistance
volumes:
  redis_data:
```

---

### Étape 2 : Lancer Redis avec Docker Compose

```bash
# Depuis le dossier ~/redis-lab
# Lance Redis en arrière-plan
cd ~/redis-lab && docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 2/2
 ✔ Network redis-lab_default  Created
 ✔ Container redis-lab-redis-1  Started
```

Vérifie que Redis est bien lancé :

```bash
# Affiche les conteneurs en cours d'exécution
docker compose ps
```

**Résultat attendu** :

```text
NAME                  IMAGE             SERVICE   STATUS          PORTS
redis-lab-redis-1     redis:7-alpine    redis     Up 10 seconds   0.0.0.0:6379->6379/tcp
```

---

### Étape 3 : Se connecter à Redis avec redis-cli

```bash
# Ouvre redis-cli dans le conteneur Redis
docker compose exec redis redis-cli
```

**Résultat attendu** :

```text
127.0.0.1:6379>
```

Tu es maintenant connecté au serveur Redis.

---

### Étape 4 : Commandes d'écriture et lecture

#### SET et GET

```bash
# Stocke une chaîne de caractères
SET greeting "Bonjour le monde"
# OK

# Récupère la valeur
GET greeting
# "Bonjour le monde"
```

#### SET avec options

```bash
# SET avec TTL en secondes (EX)
SET cache:news "Dernières nouvelles" EX 300
# OK - cette clé expire dans 300 secondes (5 minutes)

# SET avec TTL en millisecondes (PX)
SET cache:flash "Message flash" PX 5000
# OK - cette clé expire dans 5000 millisecondes (5 secondes)

# SET seulement si la clé n'existe PAS (NX)
SET user:1:name "Alice" NX
# OK - la clé n'existait pas, elle est créée

SET user:1:name "Bob" NX
# (nil) - la clé existe déjà, rien ne change

# SET seulement si la clé EXISTE déjà (XX)
SET user:1:name "Charlie" XX
# OK - la clé existait, elle est mise à jour

SET user:2:name "Diana" XX
# (nil) - la clé n'existait pas, rien ne se passe
```

**Récapitulatif des options de SET** :

| Option | Signification |
| ------ | ------------- |
| `EX secondes` | Expire après X secondes |
| `PX millisecondes` | Expire après X millisecondes |
| `NX` | Set seulement si la clé N'eXiste pas |
| `XX` | Set seulement si la clé eXiste déjà |

---

### Étape 5 : Commandes de gestion des clés

#### EXISTS

```bash
# Vérifie si une clé existe
EXISTS user:1:name
# (integer) 1 - la clé existe

EXISTS user:99:name
# (integer) 0 - la clé n'existe pas

# Vérifie plusieurs clés en une seule commande
EXISTS user:1:name greeting cache:news
# (integer) 3 - les 3 clés existent
```

#### DEL

```bash
# Supprime une clé
DEL greeting
# (integer) 1 - 1 clé supprimée

# Supprime plusieurs clés en une seule commande
DEL user:1:name cache:news
# (integer) 2 - 2 clés supprimées

# Tente de supprimer une clé qui n'existe pas
DEL clé_inexistante
# (integer) 0 - aucune clé supprimée
```

#### UNLINK

```bash
# Comme DEL mais non-bloquant (suppression asynchrone)
# Préférable pour supprimer de grosses clés
SET big:data "valeur volumineuse"
UNLINK big:data
# (integer) 1
```

**Différence DEL vs UNLINK** :

| DEL | UNLINK |
| --- | ------ |
| Supprime immédiatement (bloquant) | Marque pour suppression (non-bloquant) |
| Bloque Redis si la clé est volumineuse | Redis reste réactif |
| Acceptable pour les petites clés | Recommandé pour les grosses clés |

---

### Étape 6 : Commandes de TTL et expiration

#### TTL et PTTL

```bash
# Crée une clé avec TTL
SET session:abc "données de session" EX 1800
# OK

# Vérifie le TTL en secondes
TTL session:abc
# (integer) 1798

# Vérifie le TTL en millisecondes (plus précis)
PTTL session:abc
# (integer) 1797500

# TTL d'une clé sans expiration
SET permanent "donnée permanente"
TTL permanent
# (integer) -1 - la clé n'a pas de TTL

# TTL d'une clé qui n'existe pas
TTL clé_inexistante
# (integer) -2 - la clé n'existe pas
```

**Valeurs de retour de TTL** :

| Valeur | Signification |
| ------ | ------------- |
| Nombre positif | Secondes restantes avant expiration |
| `-1` | La clé existe mais n'a pas de TTL |
| `-2` | La clé n'existe pas |

#### EXPIRE et PERSIST

```bash
# Ajoute un TTL à une clé existante
EXPIRE permanent 60
# (integer) 1 - TTL ajouté

TTL permanent
# (integer) 58

# Supprime le TTL d'une clé (la rend permanente)
PERSIST permanent
# (integer) 1 - TTL supprimé

TTL permanent
# (integer) -1 - plus de TTL
```

---

### Étape 7 : Rechercher des clés

#### KEYS (développement uniquement)

```bash
# Crée quelques clés pour tester
SET user:1:name "Alice"
SET user:2:name "Bob"
SET user:3:name "Charlie"
SET product:1:name "Ordinateur"
SET product:2:name "Clavier"
```

```bash
# Liste toutes les clés
KEYS *
# 1) "user:1:name"
# 2) "user:2:name"
# 3) "user:3:name"
# 4) "product:1:name"
# 5) "product:2:name"
# 6) "permanent"

# Liste les clés qui commencent par "user:"
KEYS user:*
# 1) "user:1:name"
# 2) "user:2:name"
# 3) "user:3:name"

# Liste les clés qui contiennent ":1:"
KEYS *:1:*
# 1) "user:1:name"
# 2) "product:1:name"
```

**Patterns disponibles** :

| Pattern | Signification |
| ------- | ------------- |
| `*` | Correspond à tout |
| `?` | Correspond à un seul caractère |
| `[abc]` | Correspond à a, b ou c |
| `[a-z]` | Correspond à un caractère entre a et z |

#### SCAN (recommandé en production)

```bash
# SCAN retourne un curseur et un lot de clés
# Le premier argument est le curseur (0 pour commencer)
SCAN 0
# 1) "0"         ← prochain curseur (0 = fin du parcours)
# 2) 1) "user:1:name"
#    2) "user:2:name"
#    3) "product:1:name"
#    ...

# SCAN avec un pattern
SCAN 0 MATCH user:*
# 1) "0"
# 2) 1) "user:1:name"
#    2) "user:2:name"
#    3) "user:3:name"

# SCAN avec un nombre maximum de résultats par lot
SCAN 0 MATCH * COUNT 2
# 1) "5"         ← prochain curseur (pas 0, donc continuer)
# 2) 1) "user:1:name"
#    2) "user:2:name"

# Continuer avec le curseur retourné
SCAN 5 MATCH * COUNT 2
# 1) "0"         ← curseur 0 = fin du parcours
# 2) 1) "product:1:name"
#    2) "permanent"
```

**Comment utiliser SCAN** :

1. Commence avec le curseur `0`
2. Redis retourne un nouveau curseur et un lot de clés
3. Si le curseur retourné est `0`, le parcours est terminé
4. Sinon, rappelle SCAN avec le nouveau curseur

---

### Étape 8 : Commandes d'information

#### INFO

```bash
# Informations générales sur le serveur
INFO server
```

**Résultat attendu** (extrait) :

```text
# Server
redis_version:7.4.x
redis_mode:standalone
os:Linux 6.x.x-0-virt x86_64
tcp_port:6379
uptime_in_seconds:1234
```

Le tag `redis:7-alpine` suit la ligne 7.4 (7.4.11 sur Docker Hub en août 2026). Le préfixe `7.` reste le pin de cette fiche.

```bash
# Informations sur la mémoire
INFO memory
```

**Résultat attendu** (extrait) :

```text
# Memory
used_memory:1234567
used_memory_human:1.18M
used_memory_peak:2345678
used_memory_peak_human:2.24M
```

```bash
# Informations sur les bases de données
INFO keyspace
```

**Résultat attendu** :

```text
# Keyspace
db0:keys=6,expires=0,avg_ttl=0
```

Cela signifie que la base de données 0 contient 6 clés, dont 0 avec un TTL.

#### DBSIZE

```bash
# Compte le nombre total de clés
DBSIZE
# (integer) 6
```

#### MONITOR

```bash
# Affiche en temps réel toutes les commandes reçues
# Appuie sur Ctrl+C pour arrêter
MONITOR
```

**Résultat attendu** :

```text
OK
1234567890.123456 [0 127.0.0.1:12345] "SET" "test" "valeur"
1234567890.234567 [0 127.0.0.1:12345] "GET" "test"
```

Chaque ligne montre :

- Le timestamp (horodatage Unix)
- Le numéro de la base de données (`[0 ...]`)
- L'adresse IP et le port du client
- La commande exécutée avec ses arguments

Appuie sur `Ctrl+C` pour arrêter MONITOR.

---

### Étape 9 : Sélection de base de données

Redis a 16 bases de données numérotées de 0 à 15. Par défaut, tu es sur la base 0.

```bash
# Sélectionne la base de données 1
SELECT 1
# OK

# Crée une clé dans la base 1
SET test "dans la base 1"
# OK

# Reviens à la base 0
SELECT 0
# OK

# La clé "test" n'existe pas dans la base 0
GET test
# (nil)

# Retourne dans la base 1
SELECT 1
# OK

# La clé existe dans la base 1
GET test
# "dans la base 1"

# Reviens à la base 0
SELECT 0
# OK
```

**En pratique** : La plupart des projets utilisent uniquement la base 0. Les bases multiples sont parfois utilisées pour séparer différentes applications sur le même serveur Redis.

---

### Étape 10 : Vider les données

```bash
# Supprime toutes les clés de la base actuelle (base 0)
FLUSHDB
# OK

# Vérifie que la base est vide
DBSIZE
# (integer) 0

# FLUSHALL supprime TOUTES les clés de TOUTES les bases
# ⚠️ À utiliser avec précaution
FLUSHALL
# OK
```

---

### Étape 11 : Quitter et arrêter

```bash
# Quitte redis-cli
QUIT
```

```bash
# Arrête les services Docker Compose
cd ~/redis-lab && docker compose down
```

**Résultat attendu** :

```text
[+] Running 2/2
 ✔ Container redis-lab-redis-1  Removed
 ✔ Network redis-lab_default    Removed
```

Les données sont conservées dans le volume Docker `redis_data`. Au prochain `docker compose up -d`, tes données seront toujours là.

⚠️ **Ne lance pas** `docker compose down -v` : le flag `-v` supprime aussi les volumes nommés (donc toutes les données Redis du lab). Pour arrêter les services en conservant les données, utilise uniquement `docker compose down` (sans `-v`), comme ci-dessus.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `SET clé valeur` | Stocke une valeur |
| `SET clé valeur EX sec` | Stocke avec TTL en secondes |
| `SET clé valeur NX` | Stocke seulement si la clé n'existe pas |
| `GET clé` | Récupère la valeur |
| `DEL clé [clé ...]` | Supprime une ou plusieurs clés |
| `UNLINK clé [clé ...]` | Supprime de manière non-bloquante |
| `EXISTS clé [clé ...]` | Vérifie l'existence (retourne le nombre de clés trouvées) |
| `TTL clé` | Temps restant en secondes |
| `PTTL clé` | Temps restant en millisecondes |
| `EXPIRE clé secondes` | Ajoute un TTL à une clé existante |
| `PERSIST clé` | Supprime le TTL d'une clé |
| `KEYS pattern` | Liste les clés (développement uniquement) |
| `SCAN curseur MATCH pattern` | Parcourt les clés par lots (production) |
| `INFO [section]` | Affiche les statistiques du serveur |
| `DBSIZE` | Compte le nombre de clés |
| `MONITOR` | Affiche les commandes en temps réel |
| `SELECT n` | Change de base de données (0-15) |
| `FLUSHDB` | Supprime toutes les clés de la base actuelle |
| `FLUSHALL` | Supprime toutes les clés de toutes les bases |

---

## Pièges Fréquents

### Piège 1 : Utiliser KEYS en production

⚠️ **Problème** : Tu utilises `KEYS *` en production pour chercher des clés. Redis bloque toutes les autres requêtes pendant le parcours de millions de clés.

✅ **Solution** : Utilise `SCAN` en production. `SCAN` parcourt les clés par petits lots sans bloquer le serveur.

```bash
# ❌ En production
KEYS user:*

# ✅ En production
SCAN 0 MATCH user:* COUNT 100
```

---

### Piège 2 : Oublier que Redis est mono-thread

⚠️ **Problème** : Tu lances une commande longue (comme `KEYS *` sur des millions de clés) et toutes les autres requêtes sont en attente.

✅ **Solution** : Redis traite les commandes une par une (mono-thread pour les commandes). Évite les commandes qui parcourent un grand nombre de clés en une seule opération. Utilise `SCAN` et les commandes par lots.

---

### Piège 3 : Ne pas exposer le port en Docker Compose

⚠️ **Problème** : Tu n'as pas ajouté `ports: "6379:6379"` dans ton `docker-compose.yml`. Tu ne peux pas te connecter à Redis depuis ta machine hôte.

✅ **Solution** : Ajoute le mapping de port dans la configuration Docker Compose. Note : les services dans le même réseau Docker peuvent se joindre par nom de service (ex : `redis:6379`) sans mapping de port.

```yaml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"  # Nécessaire pour accéder depuis la machine hôte
```

---

### Piège 4 : Perdre les données au redémarrage

⚠️ **Problème** : Tu utilises `docker compose down -v` (avec le flag `-v`) et toutes les données Redis sont supprimées avec le volume.

✅ **Solution** : Utilise `docker compose down` sans le flag `-v` pour conserver les données. Utilise `-v` uniquement quand tu veux intentionnellement repartir de zéro.

```bash
# ✅ Conserve les données
docker compose down

# ⚠️ Supprime les données
docker compose down -v
```

---

### Piège 5 : Confondre QUIT et SHUTDOWN

⚠️ **Problème** : Tu tapes `SHUTDOWN` au lieu de `QUIT` dans redis-cli. Redis s'arrête complètement.

✅ **Solution** : `QUIT` ferme la connexion redis-cli. `SHUTDOWN` arrête le serveur Redis. Utilise toujours `QUIT` pour sortir de redis-cli.

```bash
# ✅ Ferme redis-cli (le serveur continue)
QUIT

# ⚠️ Arrête le serveur Redis
SHUTDOWN
```

---

## Checklist de Validation

- [ ] J'ai créé un fichier `docker-compose.yml` avec un service Redis
- [ ] J'ai lancé Redis avec `docker compose up -d`
- [ ] Je sais me connecter à redis-cli avec `docker compose exec redis redis-cli`
- [ ] Je maîtrise SET, GET, DEL, EXISTS
- [ ] Je maîtrise les options de SET (EX, PX, NX, XX)
- [ ] Je maîtrise TTL, PTTL, EXPIRE, PERSIST
- [ ] Je connais la différence entre KEYS et SCAN
- [ ] Je sais utiliser INFO et MONITOR
- [ ] Je sais arrêter et supprimer les services avec Docker Compose

---

## Exercice Pratique

**Énoncé** : Crée un environnement Redis avec Docker Compose et simule un système de sessions utilisateur.

**Indications** :

- Lance Redis avec Docker Compose
- Connecte-toi à redis-cli
- Crée 5 sessions utilisateur avec des TTL de 30 minutes (1800 secondes) :
  - `session:aaa111` → `{"user_id": 1, "username": "alice"}`
  - `session:bbb222` → `{"user_id": 2, "username": "bob"}`
  - `session:ccc333` → `{"user_id": 3, "username": "charlie"}`
  - `session:ddd444` → `{"user_id": 4, "username": "diana"}`
  - `session:eee555` → `{"user_id": 5, "username": "eve"}`
- Utilise `KEYS session:*` pour lister toutes les sessions
- Utilise `SCAN` pour faire la même recherche
- Vérifie le TTL de chaque session
- Simule une déconnexion : supprime la session de Bob
- Vérifie le nombre total de clés avec `DBSIZE`
- Utilise `INFO keyspace` pour voir les statistiques
- Nettoie tout avec `FLUSHDB`

**Résultat attendu** : Tu as manipulé des sessions avec TTL, recherché des clés avec KEYS et SCAN, et utilisé les commandes d'information.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Lance Redis
cd ~/redis-lab && docker compose up -d
```

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

Dans redis-cli :

```bash
# Crée les 5 sessions avec un TTL de 1800 secondes (30 minutes)
SET session:aaa111 '{"user_id": 1, "username": "alice"}' EX 1800
SET session:bbb222 '{"user_id": 2, "username": "bob"}' EX 1800
SET session:ccc333 '{"user_id": 3, "username": "charlie"}' EX 1800
SET session:ddd444 '{"user_id": 4, "username": "diana"}' EX 1800
SET session:eee555 '{"user_id": 5, "username": "eve"}' EX 1800

# Liste les sessions avec KEYS
KEYS session:*
# 1) "session:aaa111"
# 2) "session:bbb222"
# 3) "session:ccc333"
# 4) "session:ddd444"
# 5) "session:eee555"

# Liste les sessions avec SCAN
SCAN 0 MATCH session:*
# 1) "0"
# 2) 1) "session:aaa111"
#    2) "session:bbb222"
#    3) "session:ccc333"
#    4) "session:ddd444"
#    5) "session:eee555"

# Vérifie le TTL de chaque session
TTL session:aaa111
# (integer) 1795 (environ)
TTL session:bbb222
# (integer) 1794 (environ)
TTL session:ccc333
# (integer) 1793 (environ)
TTL session:ddd444
# (integer) 1792 (environ)
TTL session:eee555
# (integer) 1791 (environ)

# Simule la déconnexion de Bob
DEL session:bbb222
# (integer) 1

# Vérifie que la session de Bob n'existe plus
EXISTS session:bbb222
# (integer) 0

# Compte le nombre total de clés
DBSIZE
# (integer) 4

# Affiche les statistiques
INFO keyspace
# # Keyspace
# db0:keys=4,expires=4,avg_ttl=1790000

# Nettoie tout
FLUSHDB
# OK

# Vérifie
DBSIZE
# (integer) 0

# Quitte
QUIT
```

```bash
# Arrête Redis
cd ~/redis-lab && docker compose down
```

---

## Navigation

← Fiche précédente : **[Introduction à Redis](01-introduction-redis.md)**

→ Fiche suivante : **[Structures de données](03-structures-donnees.md)**
