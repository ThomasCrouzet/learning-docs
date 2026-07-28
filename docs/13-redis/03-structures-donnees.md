---
tags:
  - Redis
  - Intermédiaire
  - Concept
description: "Maîtriser les structures de données Redis : Strings, Lists, Sets, Sorted Sets et Hashes"
estimated_time: "75 min"
fiche_number: 3
total_fiches: 8
cursus: "Redis et Cache"
---

# 03 - Structures de données

> **En bref** : À la fin de cette fiche, tu maîtriseras les cinq structures de données principales de Redis (Strings, Lists, Sets, Sorted Sets, Hashes) et tu sauras choisir la bonne structure selon le cas d'utilisation. Lecture estimée : 75 min.

## Prérequis

- Fiche [01 - Introduction à Redis](01-introduction-redis.md)
- Fiche [02 - Installation et CLI redis](02-installation-cli-redis.md)
- Savoir lancer Redis avec Docker Compose et utiliser redis-cli

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les cinq structures de données principales de Redis, connaître leurs commandes respectives et choisir la structure adaptée à chaque situation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Vue d'ensemble des structures de données

**Définition** : Redis n'est pas limité aux simples paires clé-valeur de type chaîne de caractères. Chaque clé peut contenir une valeur d'un type précis parmi cinq structures principales.

**Les cinq structures** :

| Structure | Description | Exemple d'utilisation |
| --------- | ----------- | --------------------- |
| **String** | Chaîne de caractères ou nombre | Cache d'une page, compteur de vues |
| **List** | Liste ordonnée d'éléments | File d'attente, historique récent |
| **Set** | Ensemble d'éléments uniques (non ordonnés) | Tags, liste d'utilisateurs connectés |
| **Sorted Set** | Ensemble ordonné par score | Classement, timeline |
| **Hash** | Table de paires champ-valeur | Objet utilisateur, données structurées |

**Analogie concrète** : Redis est comme une boîte à outils. Tu ne prends pas un marteau pour visser une vis. De la même façon, tu ne stockes pas un classement dans une String : tu utilises un Sorted Set. Chaque structure est un outil conçu pour un usage précis.

---

### Strings

**Définition** : Le type String est le plus simple. Une clé contient une seule valeur qui peut être une chaîne de caractères, un nombre entier ou un nombre décimal. La taille maximale est de 512 Mo.

**Le problème que les Strings résolvent** :

1. **Stocker une valeur simple** : un nom, un e-mail, un token, un fragment HTML
2. **Compter des événements** : nombre de vues, nombre de clics
3. **Stocker des données sérialisées** : un objet JSON converti en chaîne

**Commandes principales** :

| Commande | Action | Exemple |
| -------- | ------ | ------- |
| `SET clé valeur` | Stocke une valeur | `SET name "Alice"` |
| `GET clé` | Récupère la valeur | `GET name` → `"Alice"` |
| `INCR clé` | Incrémente de 1 (atomique) | `INCR counter` → `1` |
| `DECR clé` | Décrémente de 1 (atomique) | `DECR counter` → `0` |
| `INCRBY clé n` | Incrémente de n | `INCRBY counter 5` → `5` |
| `DECRBY clé n` | Décrémente de n | `DECRBY counter 2` → `3` |
| `APPEND clé valeur` | Ajoute du texte à la fin | `APPEND name " B."` |
| `STRLEN clé` | Longueur de la valeur | `STRLEN name` → `8` |
| `MSET clé1 val1 clé2 val2` | Stocke plusieurs clés | `MSET a "1" b "2"` |
| `MGET clé1 clé2` | Récupère plusieurs valeurs | `MGET a b` → `"1"` `"2"` |

**Ce que les Strings ne font PAS** :

- Elles ne permettent pas de stocker plusieurs champs (utilise un Hash pour cela)
- Elles ne permettent pas de trier des éléments (utilise un Sorted Set)

**Quand utiliser String** :

- Cache d'un résultat de requête (HTML, JSON)
- Compteurs (vues de page, likes)
- Tokens de session simples
- Flags (feature toggles)

---

### Lists

**Définition** : Une List Redis est une liste ordonnée de chaînes de caractères. Tu peux ajouter des éléments au début (gauche) ou à la fin (droite) de la liste. Les éléments sont ordonnés par ordre d'insertion.

**Le problème que les Lists résolvent** :

1. **File d'attente (FIFO)** : Premier arrivé, premier servi. Les tâches sont traitées dans l'ordre.
2. **Pile (LIFO)** : Dernier arrivé, premier servi. L'historique récent est affiché en premier.
3. **Liste bornée** : Garder uniquement les N derniers éléments (logs récents, notifications).

**Commandes principales** :

| Commande | Action | Exemple |
| -------- | ------ | ------- |
| `LPUSH clé valeur` | Ajoute au début (gauche) | `LPUSH queue "tâche1"` |
| `RPUSH clé valeur` | Ajoute à la fin (droite) | `RPUSH queue "tâche2"` |
| `LPOP clé` | Retire et retourne le premier élément | `LPOP queue` → `"tâche1"` |
| `RPOP clé` | Retire et retourne le dernier élément | `RPOP queue` → `"tâche2"` |
| `LRANGE clé début fin` | Retourne une plage d'éléments | `LRANGE queue 0 -1` (tous) |
| `LLEN clé` | Nombre d'éléments | `LLEN queue` → `2` |
| `LINDEX clé index` | Élément à l'index donné | `LINDEX queue 0` |
| `LTRIM clé début fin` | Garde uniquement la plage | `LTRIM queue 0 99` (100 derniers) |

**Analogie concrète** : Une List Redis est comme une file d'attente à la boulangerie. Les clients arrivent par la droite (`RPUSH`) et sont servis par la gauche (`LPOP`). Tu peux aussi regarder qui est dans la file sans les sortir (`LRANGE`).

**File d'attente (FIFO) vs Pile (LIFO)** :

| Pattern | Ajouter | Retirer | Usage |
| ------- | ------- | ------- | ----- |
| File d'attente (FIFO) | `RPUSH` | `LPOP` | Tâches à traiter dans l'ordre |
| Pile (LIFO) | `LPUSH` | `LPOP` | Dernier élément ajouté traité en premier |

---

### Sets

**Définition** : Un Set Redis est une collection non ordonnée d'éléments uniques. Chaque élément ne peut apparaître qu'une seule fois dans le Set. L'ajout d'un doublon est ignoré sans erreur.

**Le problème que les Sets résolvent** :

1. **Unicité** : Tu veux stocker une liste d'éléments sans doublons (tags, catégories, utilisateurs connectés).
2. **Opérations ensemblistes** : Tu veux calculer l'intersection, l'union ou la différence entre deux groupes.
3. **Appartenance rapide** : Tu veux vérifier instantanément si un élément fait partie d'un groupe.

**Commandes principales** :

| Commande | Action | Exemple |
| -------- | ------ | ------- |
| `SADD clé membre` | Ajoute un membre | `SADD tags "php"` |
| `SMEMBERS clé` | Liste tous les membres | `SMEMBERS tags` |
| `SISMEMBER clé membre` | Vérifie l'appartenance | `SISMEMBER tags "php"` → `1` |
| `SREM clé membre` | Supprime un membre | `SREM tags "php"` |
| `SCARD clé` | Nombre de membres | `SCARD tags` → `3` |
| `SINTER clé1 clé2` | Intersection de deux Sets | `SINTER tags1 tags2` |
| `SUNION clé1 clé2` | Union de deux Sets | `SUNION tags1 tags2` |
| `SDIFF clé1 clé2` | Différence (dans clé1 mais pas clé2) | `SDIFF tags1 tags2` |
| `SRANDMEMBER clé [n]` | Retourne n membres aléatoires | `SRANDMEMBER tags 2` |

**Analogie concrète** : Un Set est comme un sac de billes de couleurs différentes. Tu peux ajouter une bille rouge, mais si tu essaies d'en ajouter une deuxième rouge, le sac ne change pas. Tu peux facilement vérifier si une bille bleue est dans le sac. Tu peux aussi comparer deux sacs pour trouver les billes en commun (intersection).

**Ce que les Sets ne font PAS** :

- Ils ne maintiennent pas d'ordre. Si tu as besoin d'un ordre, utilise un Sorted Set ou une List.
- Ils ne permettent pas les doublons. Si tu as besoin de compter les occurrences, utilise un Hash ou un compteur.

---

### Sorted Sets

**Définition** : Un Sorted Set (ensemble trié) est comme un Set, mais chaque membre a un score numérique. Les membres sont automatiquement triés par score croissant. Si deux membres ont le même score, ils sont triés par ordre alphabétique.

**Le problème que les Sorted Sets résolvent** :

1. **Classements** : Top 10 des joueurs, articles les plus lus, produits les plus vendus.
2. **Données temporelles** : Timeline d'événements triés par timestamp.
3. **Priorités** : File d'attente avec priorités (les tâches urgentes passent en premier).

**Commandes principales** :

| Commande | Action | Exemple |
| -------- | ------ | ------- |
| `ZADD clé score membre` | Ajoute avec un score | `ZADD leaderboard 100 "alice"` |
| `ZRANGE clé début fin` | Membres triés par score croissant | `ZRANGE leaderboard 0 -1` |
| `ZRANGE clé début fin REV` | Membres triés par score décroissant | `ZRANGE leaderboard 0 -1 REV` |
| `ZRANGE clé début fin WITHSCORES` | Avec les scores | `ZRANGE leaderboard 0 -1 WITHSCORES` |
| `ZRANGE clé min max BYSCORE` | Membres dont le score est entre min et max | `ZRANGE leaderboard 50 100 BYSCORE` |
| `ZSCORE clé membre` | Score d'un membre | `ZSCORE leaderboard "alice"` → `100` |
| `ZRANK clé membre` | Position (rang) d'un membre (0 = premier) | `ZRANK leaderboard "alice"` |
| `ZREVRANK clé membre` | Position en ordre inversé | `ZREVRANK leaderboard "alice"` |
| `ZINCRBY clé incrément membre` | Incrémente le score | `ZINCRBY leaderboard 10 "alice"` |
| `ZREM clé membre` | Supprime un membre | `ZREM leaderboard "alice"` |
| `ZCARD clé` | Nombre de membres | `ZCARD leaderboard` |

**Analogie concrète** : Un Sorted Set est comme un tableau de scores dans une salle de jeux vidéo. Chaque joueur a un score. Le tableau se réorganise automatiquement quand un score change. Tu peux demander "qui est en première place ?" ou "quels sont les joueurs avec un score entre 50 et 100 ?".

**Comparaison Set vs Sorted Set** :

| Set | Sorted Set |
| --- | ---------- |
| Pas d'ordre | Trié par score |
| Pas de score | Chaque membre a un score |
| `SADD clé membre` | `ZADD clé score membre` |
| `SMEMBERS clé` | `ZRANGE clé 0 -1` |
| Opérations ensemblistes (SINTER, SUNION) | Requêtes par plage de scores |

---

### Hashes

**Définition** : Un Hash Redis est une table de correspondance entre des champs (fields) et des valeurs, stockée sous une seule clé. C'est l'équivalent d'un objet ou d'un dictionnaire.

**Le problème que les Hashes résolvent** :

1. **Données structurées** : Tu veux stocker un objet avec plusieurs propriétés (nom, e-mail, âge) sous une seule clé.
2. **Lecture partielle** : Tu veux lire un seul champ d'un objet sans récupérer tout l'objet.
3. **Mise à jour partielle** : Tu veux modifier un seul champ sans réécrire tout l'objet.

**Commandes principales** :

| Commande | Action | Exemple |
| -------- | ------ | ------- |
| `HSET clé champ valeur` | Définit un champ | `HSET user:1 name "Alice"` |
| `HSET clé ch1 v1 ch2 v2` | Définit plusieurs champs (multi-champs) | `HSET user:1 name "Alice" age "30"` |
| `HGET clé champ` | Récupère un champ | `HGET user:1 name` → `"Alice"` |
| `HGETALL clé` | Récupère tous les champs et valeurs | `HGETALL user:1` |
| `HMGET clé ch1 ch2` | Récupère plusieurs champs | `HMGET user:1 name age` |
| `HDEL clé champ` | Supprime un champ | `HDEL user:1 age` |
| `HEXISTS clé champ` | Vérifie si un champ existe | `HEXISTS user:1 name` → `1` |
| `HLEN clé` | Nombre de champs | `HLEN user:1` → `2` |
| `HKEYS clé` | Liste les noms de champs | `HKEYS user:1` |
| `HVALS clé` | Liste les valeurs | `HVALS user:1` |
| `HINCRBY clé champ n` | Incrémente un champ numérique | `HINCRBY user:1 views 1` |

**Analogie concrète** : Un Hash est comme une fiche cartonnée dans un classeur. La clé Redis est l'étiquette sur l'onglet de la fiche (`user:1`). Sur la fiche, il y a plusieurs lignes : `nom: Alice`, `email: alice@example.com`, `age: 30`. Tu peux lire une seule ligne, modifier une seule ligne ou lire toute la fiche.

**Comparaison : String JSON vs Hash** :

| String avec JSON | Hash |
| ---------------- | ---- |
| `SET user:1 '{"name":"Alice","age":30}'` | `HSET user:1 name "Alice" age "30"` |
| Pour lire un champ, tu dois lire tout le JSON | Tu peux lire un seul champ avec `HGET` |
| Pour modifier un champ, tu dois réécrire tout le JSON | Tu peux modifier un seul champ avec `HSET` |
| Compact en mémoire pour les petits objets | Plus efficace pour les objets avec beaucoup de champs |

---

### Choisir la bonne structure

**Guide de décision** :

| Besoin | Structure recommandée |
| ------ | --------------------- |
| Stocker une valeur simple (chaîne, nombre) | String |
| Compter des événements (vues, clics) | String (INCR/DECR) |
| Stocker un objet avec plusieurs champs | Hash |
| File d'attente (premier arrivé, premier servi) | List (RPUSH + LPOP) |
| Historique des N derniers éléments | List (LPUSH + LTRIM) |
| Liste d'éléments uniques sans ordre | Set |
| Vérifier si un élément fait partie d'un groupe | Set (SISMEMBER) |
| Trouver les éléments communs à deux groupes | Set (SINTER) |
| Classement avec scores | Sorted Set |
| Timeline triée par date | Sorted Set (score = timestamp) |
| File d'attente avec priorités | Sorted Set (score = priorité) |

---

## Étapes Pratiques

Lance Redis avant de commencer :

```bash
# Lance Redis avec Docker Compose
cd ~/redis-lab && docker compose up -d
```

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

---

### Étape 1 : Strings - Compteur de vues

```bash
# Simule un compteur de vues pour un article
# INCR crée la clé avec la valeur 0 puis incrémente de 1
INCR article:42:views
# (integer) 1

INCR article:42:views
# (integer) 2

INCR article:42:views
# (integer) 3

# Vérifie la valeur actuelle
GET article:42:views
# "3"

# Incrémente de 10 d'un coup
INCRBY article:42:views 10
# (integer) 13

# Décrémente de 2
DECRBY article:42:views 2
# (integer) 11
```

```bash
# Stocke plusieurs valeurs en une seule commande
MSET article:42:title "Redis pour les débutants" article:42:author "Alice"
# OK

# Récupère plusieurs valeurs en une seule commande
MGET article:42:title article:42:author article:42:views
# 1) "Redis pour les d\xc3\xa9butants"
# 2) "Alice"
# 3) "11"
```

```bash
# APPEND ajoute du texte à la fin d'une String
SET greeting "Bonjour"
# OK

APPEND greeting " le monde"
# (integer) 16

GET greeting
# "Bonjour le monde"

STRLEN greeting
# (integer) 16
```

---

### Étape 2 : Lists - File d'attente de tâches

```bash
# Simule une file d'attente d'e-mails à envoyer
# RPUSH ajoute à la fin de la liste (droite)
RPUSH email:queue "Bienvenue à Alice"
# (integer) 1

RPUSH email:queue "Confirmation de commande pour Bob"
# (integer) 2

RPUSH email:queue "Réinitialisation du mot de passe de Charlie"
# (integer) 3

# Voir tous les éléments de la liste
# 0 = premier élément, -1 = dernier élément
LRANGE email:queue 0 -1
# 1) "Bienvenue à Alice"
# 2) "Confirmation de commande pour Bob"
# 3) "R\xc3\xa9initialisation du mot de passe de Charlie"

# Nombre d'éléments dans la liste
LLEN email:queue
# (integer) 3
```

```bash
# Traiter la file d'attente : retirer le premier élément (FIFO)
LPOP email:queue
# "Bienvenue à Alice"

LPOP email:queue
# "Confirmation de commande pour Bob"

# Vérifier ce qui reste
LRANGE email:queue 0 -1
# 1) "R\xc3\xa9initialisation du mot de passe de Charlie"
```

```bash
# Simuler un historique des 5 dernières notifications
LPUSH notifications:user:1 "Nouveau commentaire"
LPUSH notifications:user:1 "Nouvelle commande"
LPUSH notifications:user:1 "Mot de passe changé"
LPUSH notifications:user:1 "Profil mis à jour"
LPUSH notifications:user:1 "E-mail vérifié"
LPUSH notifications:user:1 "Connexion depuis un nouvel appareil"
LPUSH notifications:user:1 "Photo de profil changée"

# Voir toutes les notifications (7 éléments)
LRANGE notifications:user:1 0 -1
# 1) "Photo de profil changée"      (la plus récente)
# 2) "Connexion depuis un nouvel appareil"
# 3) "E-mail vérifié"
# 4) "Profil mis à jour"
# 5) "Mot de passe changé"
# 6) "Nouvelle commande"
# 7) "Nouveau commentaire"           (la plus ancienne)

# Garder uniquement les 5 dernières (indices 0 à 4)
LTRIM notifications:user:1 0 4
# OK

LRANGE notifications:user:1 0 -1
# 1) "Photo de profil changée"
# 2) "Connexion depuis un nouvel appareil"
# 3) "E-mail vérifié"
# 4) "Profil mis à jour"
# 5) "Mot de passe changé"
```

---

### Étape 3 : Sets - Gestion de tags

```bash
# Tags d'un article
SADD article:1:tags "php" "symfony" "redis" "docker"
# (integer) 4

SADD article:2:tags "php" "symfony" "postgresql" "doctrine"
# (integer) 4

SADD article:3:tags "javascript" "react" "redis" "api"
# (integer) 4

# Lister les tags d'un article
SMEMBERS article:1:tags
# 1) "php"
# 2) "symfony"
# 3) "redis"
# 4) "docker"

# Nombre de tags
SCARD article:1:tags
# (integer) 4

# Vérifier si un tag existe
SISMEMBER article:1:tags "redis"
# (integer) 1 - oui

SISMEMBER article:1:tags "javascript"
# (integer) 0 - non
```

```bash
# Tags communs entre l'article 1 et l'article 2 (intersection)
SINTER article:1:tags article:2:tags
# 1) "php"
# 2) "symfony"

# Tous les tags uniques des articles 1 et 2 (union)
SUNION article:1:tags article:2:tags
# 1) "php"
# 2) "symfony"
# 3) "redis"
# 4) "docker"
# 5) "postgresql"
# 6) "doctrine"

# Tags dans l'article 1 mais pas dans l'article 2 (différence)
SDIFF article:1:tags article:2:tags
# 1) "redis"
# 2) "docker"

# Tags dans l'article 2 mais pas dans l'article 1
SDIFF article:2:tags article:1:tags
# 1) "postgresql"
# 2) "doctrine"
```

```bash
# Essayer d'ajouter un doublon
SADD article:1:tags "php"
# (integer) 0 - le doublon est ignoré

SCARD article:1:tags
# (integer) 4 - toujours 4 éléments

# Supprimer un tag
SREM article:1:tags "docker"
# (integer) 1

SMEMBERS article:1:tags
# 1) "php"
# 2) "symfony"
# 3) "redis"
```

---

### Étape 4 : Sorted Sets - Classement de joueurs

```bash
# Ajouter des joueurs avec leurs scores
ZADD leaderboard 1500 "alice"
ZADD leaderboard 2300 "bob"
ZADD leaderboard 1800 "charlie"
ZADD leaderboard 3100 "diana"
ZADD leaderboard 950 "eve"
# (integer) 1 pour chaque

# Classement par score croissant
ZRANGE leaderboard 0 -1 WITHSCORES
# 1) "eve"
# 2) "950"
# 3) "alice"
# 4) "1500"
# 5) "charlie"
# 6) "1800"
# 7) "bob"
# 8) "2300"
# 9) "diana"
# 10) "3100"

# Classement par score décroissant (top players)
# REV inverse l'ordre (du plus haut score au plus bas)
ZRANGE leaderboard 0 -1 REV WITHSCORES
# 1) "diana"
# 2) "3100"
# 3) "bob"
# 4) "2300"
# 5) "charlie"
# 6) "1800"
# 7) "alice"
# 8) "1500"
# 9) "eve"
# 10) "950"
```

```bash
# Top 3 des meilleurs joueurs
ZRANGE leaderboard 0 2 REV WITHSCORES
# 1) "diana"
# 2) "3100"
# 3) "bob"
# 4) "2300"
# 5) "charlie"
# 6) "1800"

# Score d'un joueur
ZSCORE leaderboard "alice"
# "1500"

# Position d'un joueur (0 = premier, par score croissant)
ZRANK leaderboard "diana"
# (integer) 4 - 5e position en ordre croissant (donc 1re en décroissant)

# Position en ordre décroissant
ZREVRANK leaderboard "diana"
# (integer) 0 - 1re position
```

```bash
# Alice gagne 500 points
ZINCRBY leaderboard 500 "alice"
# "2000"

# Joueurs avec un score entre 1500 et 2500
# BYSCORE filtre par score (min et max inclusifs)
ZRANGE leaderboard 1500 2500 BYSCORE WITHSCORES
# 1) "charlie"
# 2) "1800"
# 3) "alice"
# 4) "2000"
# (ordre croissant par score)

# Nombre total de joueurs
ZCARD leaderboard
# (integer) 5

# Supprimer un joueur
ZREM leaderboard "eve"
# (integer) 1

ZCARD leaderboard
# (integer) 4
```

---

### Étape 5 : Hashes - Profil utilisateur

```bash
# Créer un profil utilisateur avec plusieurs champs
HSET user:1 name "Alice" email "alice@example.com" age "30" city "Paris"
# (integer) 4

# Lire un seul champ
HGET user:1 name
# "Alice"

HGET user:1 email
# "alice@example.com"

# Lire plusieurs champs
HMGET user:1 name email
# 1) "Alice"
# 2) "alice@example.com"

# Lire tous les champs et valeurs
HGETALL user:1
# 1) "name"
# 2) "Alice"
# 3) "email"
# 4) "alice@example.com"
# 5) "age"
# 6) "30"
# 7) "city"
# 8) "Paris"
```

```bash
# Modifier un seul champ
HSET user:1 city "Lyon"
# (integer) 0 - 0 car le champ existait déjà (mise à jour)

HGET user:1 city
# "Lyon"

# Ajouter un nouveau champ
HSET user:1 role "admin"
# (integer) 1 - 1 car c'est un nouveau champ

# Nombre de champs
HLEN user:1
# (integer) 5

# Liste des noms de champs
HKEYS user:1
# 1) "name"
# 2) "email"
# 3) "age"
# 4) "city"
# 5) "role"

# Liste des valeurs
HVALS user:1
# 1) "Alice"
# 2) "alice@example.com"
# 3) "30"
# 4) "Lyon"
# 5) "admin"
```

```bash
# Vérifier si un champ existe
HEXISTS user:1 email
# (integer) 1

HEXISTS user:1 phone
# (integer) 0

# Supprimer un champ
HDEL user:1 role
# (integer) 1

# Incrémenter un champ numérique
HINCRBY user:1 age 1
# (integer) 31

HGET user:1 age
# "31"
```

---

### Étape 6 : Nettoyage

```bash
# Supprime toutes les clés de la base
FLUSHDB
# OK

# Quitte redis-cli
QUIT
```

---

## Commandes Utiles

### Strings

| Commande | Action |
| -------- | ------ |
| `SET clé valeur` | Stocke une valeur |
| `GET clé` | Récupère une valeur |
| `INCR clé` | Incrémente de 1 |
| `DECR clé` | Décrémente de 1 |
| `INCRBY clé n` | Incrémente de n |
| `APPEND clé texte` | Ajoute du texte |
| `MSET clé1 val1 clé2 val2` | Stocke plusieurs clés |
| `MGET clé1 clé2` | Récupère plusieurs valeurs |

### Lists

| Commande | Action |
| -------- | ------ |
| `LPUSH clé valeur` | Ajoute au début |
| `RPUSH clé valeur` | Ajoute à la fin |
| `LPOP clé` | Retire le premier élément |
| `RPOP clé` | Retire le dernier élément |
| `LRANGE clé 0 -1` | Liste tous les éléments |
| `LLEN clé` | Nombre d'éléments |
| `LTRIM clé 0 n` | Garde les n+1 premiers |

### Sets

| Commande | Action |
| -------- | ------ |
| `SADD clé membre` | Ajoute un membre |
| `SMEMBERS clé` | Liste les membres |
| `SISMEMBER clé membre` | Vérifie l'appartenance |
| `SINTER clé1 clé2` | Intersection |
| `SUNION clé1 clé2` | Union |
| `SDIFF clé1 clé2` | Différence |

### Sorted Sets

| Commande | Action |
| -------- | ------ |
| `ZADD clé score membre` | Ajoute avec score |
| `ZRANGE clé 0 -1 WITHSCORES` | Tri croissant avec scores |
| `ZRANGE clé 0 -1 REV WITHSCORES` | Tri décroissant avec scores |
| `ZRANGE clé min max BYSCORE` | Membres dont le score est entre min et max |
| `ZSCORE clé membre` | Score d'un membre |
| `ZRANK clé membre` | Position (croissant) |
| `ZINCRBY clé n membre` | Incrémente le score |

### Hashes

| Commande | Action |
| -------- | ------ |
| `HSET clé champ valeur` | Définit un champ |
| `HGET clé champ` | Récupère un champ |
| `HGETALL clé` | Tous les champs et valeurs |
| `HDEL clé champ` | Supprime un champ |
| `HEXISTS clé champ` | Vérifie si le champ existe |
| `HINCRBY clé champ n` | Incrémente un champ numérique |

---

## Pièges Fréquents

### Piège 1 : Utiliser une String JSON au lieu d'un Hash

⚠️ **Problème** : Tu stockes un objet utilisateur comme une String JSON : `SET user:1 '{"name":"Alice","age":30}'`. Pour modifier l'âge, tu dois lire tout le JSON, le parser, modifier le champ, re-sérialiser et réécrire.

✅ **Solution** : Utilise un Hash quand tu as besoin de lire ou modifier des champs individuels :

```bash
# ❌ String JSON - modification complexe
SET user:1 '{"name":"Alice","age":30}'

# ✅ Hash - modification simple
HSET user:1 name "Alice" age "30"
HINCRBY user:1 age 1
```

---

### Piège 2 : Confondre LPUSH/RPUSH avec l'ordre des éléments

⚠️ **Problème** : Tu utilises `LPUSH` pour ajouter des éléments et tu t'attends à les voir dans l'ordre d'ajout avec `LRANGE 0 -1`. Mais `LPUSH` ajoute au début, donc les éléments apparaissent dans l'ordre inverse.

✅ **Solution** : Pour un ordre chronologique (premier ajouté = premier listé), utilise `RPUSH` :

```bash
# ❌ LPUSH - ordre inversé
LPUSH list "a"
LPUSH list "b"
LPUSH list "c"
LRANGE list 0 -1
# 1) "c"  2) "b"  3) "a"

# ✅ RPUSH - ordre chronologique
RPUSH list2 "a"
RPUSH list2 "b"
RPUSH list2 "c"
LRANGE list2 0 -1
# 1) "a"  2) "b"  3) "c"
```

---

### Piège 3 : Oublier que HSET retourne 0 pour une mise à jour

⚠️ **Problème** : Tu utilises `HSET user:1 name "Alice"` et Redis retourne `(integer) 0`. Tu penses que la commande a échoué.

✅ **Solution** : `HSET` retourne le nombre de nouveaux champs créés. Si le champ existait déjà, Redis le met à jour mais retourne `0` car aucun nouveau champ n'a été créé. Ce n'est pas une erreur.

---

### Piège 4 : Ne pas limiter la taille des Lists

⚠️ **Problème** : Tu ajoutes des éléments à une List sans jamais la tronquer. Avec le temps, la List contient des millions d'éléments et consomme beaucoup de mémoire.

✅ **Solution** : Utilise `LTRIM` après chaque ajout pour limiter la taille :

```bash
# Ajoute un élément et garde uniquement les 100 derniers
LPUSH logs:app "nouveau log"
LTRIM logs:app 0 99
```

---

## Checklist de Validation

- [ ] Je sais utiliser les Strings pour stocker des valeurs et compter des événements
- [ ] Je sais utiliser les Lists pour créer des files d'attente
- [ ] Je sais utiliser `LTRIM` pour limiter la taille d'une List
- [ ] Je sais utiliser les Sets pour gérer des collections uniques
- [ ] Je sais calculer l'intersection et l'union de deux Sets
- [ ] Je sais utiliser les Sorted Sets pour créer des classements
- [ ] Je sais utiliser les Hashes pour stocker des objets structurés
- [ ] Je sais choisir la structure de données adaptée à chaque besoin

---

## Exercice Pratique

**Énoncé** : Construis un mini-système de blog avec Redis en utilisant toutes les structures de données.

**Indications** :

- Crée 3 articles avec des Hashes (`article:1`, `article:2`, `article:3`) contenant les champs : `title`, `author`, `content`, `created_at`
- Ajoute des tags à chaque article avec des Sets (`article:1:tags`, etc.)
- Crée un compteur de vues pour chaque article avec des Strings (`article:1:views`)
- Crée un classement des articles par nombre de vues avec un Sorted Set (`articles:popular`)
- Crée un historique des 5 derniers articles publiés avec une List (`articles:recent`)
- Simule des vues sur les articles et mets à jour le classement
- Trouve les tags communs entre l'article 1 et l'article 2
- Affiche le top 3 des articles les plus vus

**Résultat attendu** : Tu as utilisé les 5 structures de données dans un même projet cohérent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Connecte-toi à Redis
cd ~/redis-lab && docker compose exec redis redis-cli
```

```bash
# 1. Créer les articles avec des Hashes
HSET article:1 title "Introduction à Redis" author "Alice" content "Redis est une base en mémoire..." created_at "2025-01-15"
HSET article:2 title "Docker pour débutants" author "Bob" content "Docker permet de conteneuriser..." created_at "2025-01-16"
HSET article:3 title "Symfony et Redis" author "Alice" content "Intégrer Redis dans Symfony..." created_at "2025-01-17"

# 2. Ajouter des tags avec des Sets
SADD article:1:tags "redis" "base-de-donnees" "cache" "debutant"
SADD article:2:tags "docker" "conteneur" "devops" "debutant"
SADD article:3:tags "symfony" "redis" "php" "cache"

# 3. Initialiser les compteurs de vues (Strings)
SET article:1:views 0
SET article:2:views 0
SET article:3:views 0

# 4. Initialiser le classement (Sorted Set)
ZADD articles:popular 0 "article:1"
ZADD articles:popular 0 "article:2"
ZADD articles:popular 0 "article:3"

# 5. Historique des derniers articles publiés (List)
RPUSH articles:recent "article:1"
RPUSH articles:recent "article:2"
RPUSH articles:recent "article:3"

# Garder les 5 derniers
LTRIM articles:recent 0 4

# 6. Simuler des vues
# Article 1 : 150 vues
INCRBY article:1:views 150
ZADD articles:popular 150 "article:1"

# Article 2 : 320 vues
INCRBY article:2:views 320
ZADD articles:popular 320 "article:2"

# Article 3 : 85 vues
INCRBY article:3:views 85
ZADD articles:popular 85 "article:3"

# 7. Tags communs entre article 1 et article 2
SINTER article:1:tags article:2:tags
# 1) "debutant"

# Tags communs entre article 1 et article 3
SINTER article:1:tags article:3:tags
# 1) "redis"
# 2) "cache"

# 8. Top 3 des articles les plus vus (score décroissant)
ZRANGE articles:popular 0 2 REV WITHSCORES
# 1) "article:2"
# 2) "320"
# 3) "article:1"
# 4) "150"
# 5) "article:3"
# 6) "85"

# Vérifier les détails de l'article le plus populaire
HGETALL article:2
# 1) "title"
# 2) "Docker pour débutants"
# 3) "author"
# 4) "Bob"
# 5) "content"
# 6) "Docker permet de conteneuriser..."
# 7) "created_at"
# 8) "2025-01-16"

# Derniers articles publiés
LRANGE articles:recent 0 -1
# 1) "article:1"
# 2) "article:2"
# 3) "article:3"

# Nettoyage
FLUSHDB
QUIT
```

---

## Navigation

← Fiche précédente : **[Installation et CLI redis](02-installation-cli-redis.md)**

→ Fiche suivante : **[Redis dans Symfony - Cache](04-redis-symfony-cache.md)**
