---
tags:
  - Référence
  - Redis
description: "Aide-mémoire Redis : commandes CLI, structures de données et configuration Symfony"
estimated_time: "20 min"
fiche_number: 15
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-redis"
course_id: "references.quick-reference"
content_type: "reference"
order: 15
---

# Aide-mémoire Redis

> **En bref** : Aide-mémoire Redis. Lecture estimée : 20 min.

Fiche de référence rapide pour Redis : commandes CLI, structures de données, cache et sessions Symfony, Messenger.

---

## Commandes de base

| Commande | Action |
| -------- | ------ |
| `SET key value` | Stocker une valeur |
| `GET key` | Récupérer une valeur |
| `DEL key1 key2` | Supprimer des clés |
| `EXISTS key` | Vérifier l'existence (1 ou 0) |
| `PING` | Tester la connexion (PONG) |
| `QUIT` | Quitter redis-cli |

### Options de SET

| Option | Signification |
| ------ | ------------- |
| `SET key val EX 300` | Expire après 300 secondes |
| `SET key val PX 5000` | Expire après 5000 millisecondes |
| `SET key val NX` | Seulement si la clé n'existe pas |
| `SET key val XX` | Seulement si la clé existe |

---

## TTL et expiration

| Commande | Action |
| -------- | ------ |
| `TTL key` | Temps restant en secondes (-1 = pas de TTL, -2 = inexistant) |
| `EXPIRE key 300` | Ajouter un TTL à une clé existante |
| `PERSIST key` | Supprimer le TTL d'une clé |

### TTL recommandés

| Type de donnée | TTL |
| -------------- | --- |
| Données rarement modifiées | 1 heure (3600s) |
| Données fréquemment modifiées | 5 minutes (300s) |
| Sessions | 30 minutes (1800s) |

---

## Gestion des clés

| Commande | Action |
| -------- | ------ |
| `SCAN 0 MATCH "user:*" COUNT 100` | Parcourir les clés par lots (production) |
| `UNLINK key` | Suppression non-bloquante (asynchrone) |
| `SELECT n` | Changer de base (0-15) |
| `DBSIZE` | Nombre de clés dans la base courante |
| `FLUSHDB` | Supprimer toutes les clés de la base |
| `INFO memory` | Statistiques mémoire |

---

## Structures de données

### String (valeurs simples)

```text
SET compteur 0
INCR compteur          # +1
DECR compteur          # -1
INCRBY compteur 5      # +5
MSET k1 v1 k2 v2      # SET multiple
MGET k1 k2            # GET multiple
```

### List (séquences ordonnées)

```text
RPUSH queue "item"     # Ajouter en fin
LPUSH queue "item"     # Ajouter en début
RPOP queue             # Retirer en fin
LPOP queue             # Retirer en début
LRANGE queue 0 -1      # Lister tous les éléments
LLEN queue             # Compter les éléments
```

### Set (éléments uniques)

```text
SADD tags "php"        # Ajouter un membre
SMEMBERS tags          # Lister tous les membres
SISMEMBER tags "php"   # Tester l'appartenance (1 ou 0)
SREM tags "php"        # Retirer un membre
SCARD tags             # Compter les membres
SINTER set1 set2       # Intersection
SUNION set1 set2       # Union
```

### Sorted Set (trié par score)

```text
ZADD board 100 "alice"          # Ajouter avec score
ZRANGE board 0 -1 WITHSCORES   # Lister par score croissant
ZREVRANGE board 0 -1           # Lister par score décroissant
ZSCORE board "alice"            # Score d'un membre
ZRANK board "alice"             # Position (0 = premier)
ZINCRBY board 10 "alice"       # Incrémenter le score
```

### Hash (objet structuré)

```text
HSET user:1 name "Alice" email "alice@ex.com"
HGET user:1 name               # Un champ
HGETALL user:1                 # Tous les champs
HDEL user:1 name               # Supprimer un champ
HINCRBY user:1 age 1           # Incrémenter un champ numérique
```

---

## Configuration Symfony - Cache

```yaml
# config/packages/cache.yaml
framework:
    cache:
        app: cache.adapter.redis
        pools:
            cache.products:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 3600
```

| Adapter | Usage |
| ------- | ----- |
| `cache.adapter.redis` | Cache basique (sans tags) |
| `cache.adapter.redis_tag_aware` | Cache avec invalidation par tags |

---

## Configuration Symfony - Sessions

```yaml
# config/packages/framework.yaml
framework:
    session:
        handler_id: Symfony\Component\HttpFoundation\Session\Storage\Handler\RedisSessionHandler
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
        gc_maxlifetime: 1800
```

---

## Configuration Symfony - Messenger

```yaml
# config/packages/messenger.yaml
framework:
    messenger:
        transports:
            async:
                dsn: '%env(REDIS_URL)%/messages'
                retry_strategy:
                    max_retries: 3
                    delay: 1000
                    multiplier: 2
        routing:
            'App\Message\SendEmailMessage': async
```

### Commandes Messenger

| Commande | Action |
| -------- | ------ |
| `messenger:consume async` | Consommer les messages |
| `messenger:consume async --limit=10` | Traiter 10 messages puis s'arrêter |
| `messenger:consume -vv` | Mode verbose |
| `messenger:failed:show` | Lister les messages en échec |
| `messenger:failed:retry` | Relancer les échecs (interactif) ; ajoute un id et `--force` pour un message précis |

---

## Variable d'environnement

```env
REDIS_URL=redis://redis:6379
```

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| Utiliser `KEYS *` en production | Utiliser `SCAN` - `KEYS` bloque le serveur |
| Oublier les TTL sur les clés de cache | Toujours définir un TTL |
| Nommage incohérent des clés | Convention : `type:id:champ` (ex: `user:42:name`) |
| `SHUTDOWN` au lieu de `QUIT` | `QUIT` quitte redis-cli, `SHUTDOWN` arrête Redis |
| `TagAwareCacheInterface` sans le bon adapter | Utiliser `cache.adapter.redis_tag_aware` |
| `docker compose down -v` | Détruit les données. Utiliser `down` sans `-v` |
| Redis est mono-thread | Éviter les commandes longues qui bloquent tout |

---

## Liens utiles

- [01 - Introduction Redis](../13-redis/01-introduction-redis.md)
- [02 - Installation et CLI](../13-redis/02-installation-cli-redis.md)
- [03 - Structures de données](../13-redis/03-structures-donnees.md)
- [04 - Cache Symfony](../13-redis/04-redis-symfony-cache.md)
- [05 - Sessions Symfony](../13-redis/05-redis-symfony-sessions.md)
- [07 - Messenger](../13-redis/07-redis-transport-messenger.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire API Design](14-aide-memoire-api-design.md)**

→ Fiche suivante : **[Aide-mémoire Monitoring](16-aide-memoire-monitoring.md)**
