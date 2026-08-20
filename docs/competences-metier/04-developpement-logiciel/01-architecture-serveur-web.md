---
tags:
  - Méthodologie
  - Débutant
  - Concept
description: "01 - L'Architecture Serveur Web"
estimated_time: "30 min"
fiche_number: 1
total_fiches: 4
cursus: "Développement logiciel"
---

# 01 - L'Architecture Serveur Web

> **En bref** : À la fin de cette fiche, tu sauras comment fonctionne un serveur web, ce qu'est le protocole HTTP, comment s'architecture une application web moderne, et comment optimiser les performances. Lecture estimée : 30 min.


## Prérequis

- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (Docker)
- Fiche **[02-php/01-introduction-php.md](../../02-php/01-introduction-php.md)** (PHP)
- Fiche **[01 - L'Infrastructure Réseau](../05-architecture-si/01-infrastructure-reseau.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras comment fonctionne un serveur web, ce qu'est le protocole HTTP, comment s'architecture une application web moderne, et comment optimiser les performances.

---

## Concepts

### Qu'est-ce qu'un serveur web ?

**Définition** : Un serveur web est un logiciel qui reçoit des requêtes HTTP de clients (navigateurs) et renvoie des réponses (pages HTML, fichiers, données JSON).

**Le problème que le serveur web résout** :

Sans serveur web, voici les problèmes rencontrés :

1. **Pas d'accès distant** : Les fichiers restent sur ton ordinateur uniquement.
2. **Pas de traitement dynamique** : Impossible de personnaliser les pages.
3. **Pas de standardisation** : Chaque application invente son protocole.

**Comment le serveur web résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Pas d'accès distant | Écoute sur un port réseau (80, 443) |
| Pas de traitement dynamique | Exécute du code (PHP, Python, Node) |
| Pas de standardisation | Protocole HTTP universel |

**Analogie concrète** : Un serveur web est comme un serveur dans un restaurant. Le client (navigateur) commande un plat (URL). Le serveur transmet à la cuisine (PHP/backend). La cuisine prépare le plat (traitement). Le serveur apporte l'assiette (réponse HTML).

---

### Comment fonctionne le protocole HTTP ?

**Définition** : HTTP (HyperText Transfer Protocol) est le protocole de communication entre les navigateurs et les serveurs web. HTTPS est la version sécurisée (chiffrée).

**Structure d'une requête HTTP** :

```text
GET /articles/123 HTTP/1.1
Host: www.example.com
User-Agent: Mozilla/5.0
Accept: text/html
Accept-Language: fr-FR
```

| Ligne | Signification |
| ----- | ------------- |
| `GET /articles/123 HTTP/1.1` | Méthode, chemin, version |
| `Host: www.example.com` | Nom du site demandé |
| `User-Agent: ...` | Identifiant du navigateur |
| `Accept: text/html` | Format de réponse souhaité |

**Structure d'une réponse HTTP** :

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1234

<!DOCTYPE html>
<html>...
```

| Ligne | Signification |
| ----- | ------------- |
| `HTTP/1.1 200 OK` | Version, code de statut, message |
| `Content-Type: text/html` | Format de la réponse |
| `Content-Length: 1234` | Taille en octets |
| (ligne vide puis contenu) | Corps de la réponse |

**Les méthodes HTTP** :

| Méthode | Usage | Idempotent |
| ------- | ----- | ---------- |
| GET | Lire une ressource | Oui |
| POST | Créer une ressource | Non |
| PUT | Remplacer une ressource | Oui |
| PATCH | Modifier partiellement | Non |
| DELETE | Supprimer une ressource | Oui |

**Les codes de statut HTTP** :

| Code | Catégorie | Exemples |
| ---- | --------- | -------- |
| 1xx | Information | 100 Continue |
| 2xx | Succès | 200 OK, 201 Created, 204 No Content |
| 3xx | Redirection | 301 Moved, 302 Found, 304 Not Modified |
| 4xx | Erreur client | 400 Bad Request, 401 Unauthorized, 404 Not Found |
| 5xx | Erreur serveur | 500 Internal Error, 502 Bad Gateway, 503 Unavailable |

---

### Quelle est l'architecture d'une application web moderne ?

**Architecture 3-tiers classique** :

```text
┌─────────────────┐
│    Navigateur   │  ← Tier 1 : Client (Frontend)
│   HTML/CSS/JS   │
└────────┬────────┘
         │ HTTP/HTTPS
         ▼
┌─────────────────┐
│  Serveur Web    │  ← Tier 2 : Application (Backend)
│  Nginx + PHP    │
└────────┬────────┘
         │ SQL
         ▼
┌─────────────────┐
│ Base de données │  ← Tier 3 : Données
│   PostgreSQL    │
└─────────────────┘
```

**Architecture avec reverse proxy** :

```text
Internet
    │
    ▼
┌─────────────────┐
│  Reverse Proxy  │  ← Nginx (SSL, cache, load balancing)
│     Nginx       │
└────────┬────────┘
         │
    ┌────┴────┐
    ▼         ▼
┌───────┐ ┌───────┐
│ App 1 │ │ App 2 │  ← Serveurs d'application (PHP-FPM)
└───┬───┘ └───┬───┘
    └────┬────┘
         ▼
┌─────────────────┐
│ Base de données │
└─────────────────┘
```

---

### Qu'est-ce qu'un reverse proxy ?

**Définition** : Un reverse proxy est un serveur qui se place devant les serveurs d'application. Il reçoit les requêtes des clients et les transmet aux serveurs backend appropriés.

**Le problème que le reverse proxy résout** :

| Problème | Solution reverse proxy |
| -------- | ---------------------- |
| SSL sur chaque serveur | Terminaison SSL centralisée |
| Un seul serveur surchargé | Load balancing entre plusieurs |
| Requêtes identiques répétées | Cache des réponses |
| Exposition directe des backends | Protection et masquage |

---

## Étapes Pratiques

### Étape 1 : Comprendre le flux d'une requête web

Voici ce qui se passe quand tu accèdes à `https://example.com/articles/5` :

```text
1. Navigateur : Résolution DNS (example.com → 93.184.216.34)
2. Navigateur : Connexion TCP au port 443
3. Navigateur : Handshake TLS (chiffrement)
4. Navigateur : Envoi de la requête GET /articles/5
5. Nginx : Reçoit la requête
6. Nginx : Transmet à PHP-FPM via FastCGI
7. PHP : Exécute le code Symfony
8. PHP : Requête SQL pour l'article 5
9. PostgreSQL : Retourne les données
10. PHP : Génère le HTML
11. PHP : Retourne le HTML à Nginx
12. Nginx : Envoie la réponse HTTP au navigateur
13. Navigateur : Affiche la page
```

---

### Étape 2 : Configuration Nginx basique

```nginx
# /etc/nginx/sites-available/example.conf

server {
    listen 80;
    server_name example.com;

    # Redirection HTTP → HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    http2 on;
    server_name example.com;

    # Certificats SSL
    ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Racine du site
    root /var/www/example/public;
    index index.php index.html;

    # Logs
    access_log /var/log/nginx/example.access.log;
    error_log /var/log/nginx/example.error.log;

    # Fichiers statiques
    location ~* \.(css|js|jpg|jpeg|png|gif|ico|svg|woff2?)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # PHP via FastCGI
    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.3-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    # Symfony : tout passe par index.php
    location / {
        try_files $uri /index.php$is_args$args;
    }
}
```

---

### Étape 3 : Configuration PHP-FPM pour la performance

```ini
; /etc/php/8.3/fpm/pool.d/www.conf

[www]
user = www-data
group = www-data

; Socket Unix (plus rapide que TCP)
listen = /var/run/php/php8.3-fpm.sock

; Gestion des processus
pm = dynamic
pm.max_children = 50          ; Max de workers simultanés
pm.start_servers = 5          ; Workers au démarrage
pm.min_spare_servers = 5      ; Minimum en attente
pm.max_spare_servers = 35     ; Maximum en attente
pm.max_requests = 500         ; Requêtes avant recyclage

; Timeouts
request_terminate_timeout = 30s
```

---

### Étape 4 : Optimiser les performances

**Checklist d'optimisation** :

```markdown
## Optimisations serveur

### Nginx
- [ ] HTTP/2 activé
- [ ] Gzip activé pour HTML, CSS, JS, JSON
- [ ] Cache des fichiers statiques (expires)
- [ ] Keepalive activé

### PHP
- [ ] OPcache activé et configuré
- [ ] Realpath cache augmenté
- [ ] Sessions en Redis (si multi-serveurs)

### Application
- [ ] Cache Symfony activé (prod)
- [ ] Cache Doctrine (query + result)
- [ ] Assets compilés et minifiés

### Base de données
- [ ] Index sur les colonnes filtrées
- [ ] Requêtes N+1 éliminées
- [ ] Connection pooling si haute charge
```

**Configuration OPcache recommandée** :

```ini
; /etc/php/8.3/fpm/conf.d/10-opcache.ini

opcache.enable=1
opcache.memory_consumption=256
opcache.interned_strings_buffer=16
opcache.max_accelerated_files=20000
opcache.validate_timestamps=0  ; Désactiver en prod
opcache.revalidate_freq=0
```

---

### Étape 5 : Tester les performances

```bash
# Test de charge avec Apache Bench
ab -n 1000 -c 10 https://example.com/

# Test avec wrk (plus moderne)
wrk -t4 -c100 -d30s https://example.com/

# Mesurer le temps de réponse
curl -w "@curl-format.txt" -o /dev/null -s https://example.com/
```

**Fichier curl-format.txt** :

```text
     time_namelookup:  %{time_namelookup}s\n
        time_connect:  %{time_connect}s\n
     time_appconnect:  %{time_appconnect}s\n
    time_pretransfer:  %{time_pretransfer}s\n
       time_redirect:  %{time_redirect}s\n
  time_starttransfer:  %{time_starttransfer}s\n
                     ----------\n
          time_total:  %{time_total}s\n
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `nginx -t` | Tester la configuration Nginx |
| `systemctl reload nginx` | Recharger Nginx sans coupure |
| `php-fpm -t` | Tester la configuration PHP-FPM |
| `curl -I <url>` | Voir les headers de réponse |
| `ab -n 100 -c 10 <url>` | Test de charge basique |

---

## Pièges Fréquents

### Piège 1 : Oublier le HTTPS

⚠️ **Problème** : Site en HTTP = données interceptables, pénalisé par Google.

✅ **Solution** : HTTPS obligatoire. Let's Encrypt est gratuit.

---

### Piège 2 : Mauvaise configuration des permissions

⚠️ **Problème** : `chmod 777` sur tout = faille de sécurité majeure.

✅ **Solution** : Fichiers en 644, dossiers en 755, propriétaire www-data.

---

### Piège 3 : Ne pas activer OPcache en production

⚠️ **Problème** : Chaque requête recompile le PHP = lenteur.

✅ **Solution** : OPcache activé + `validate_timestamps=0` en prod.

---

## Checklist de Validation

- [ ] Je comprends le flux d'une requête HTTP
- [ ] Je connais les méthodes et codes HTTP principaux
- [ ] Je comprends l'architecture 3-tiers
- [ ] Je sais ce qu'est un reverse proxy
- [ ] Je sais configurer Nginx pour Symfony
- [ ] Je connais les optimisations de base (OPcache, cache, gzip)

---

## Exercice Pratique

**Énoncé** : Dessine l'architecture d'une application web haute disponibilité avec :

- 2 serveurs d'application
- 1 load balancer
- 1 base de données
- 1 serveur Redis pour les sessions

**Résultat attendu** : Un schéma en texte + explication des flux.

---

## Solution de l'Exercice

### Schéma d'architecture

```text
                    Internet
                        │
                        ▼
              ┌─────────────────┐
              │  Load Balancer  │  Nginx (SSL termination)
              │     Nginx       │  Round-robin entre App1 et App2
              └────────┬────────┘
                       │
           ┌───────────┴───────────┐
           │                       │
           ▼                       ▼
    ┌─────────────┐         ┌─────────────┐
    │   App 1     │         │   App 2     │   PHP-FPM + Symfony
    │  PHP-FPM    │         │  PHP-FPM    │
    └──────┬──────┘         └──────┬──────┘
           │                       │
           └───────────┬───────────┘
                       │
         ┌─────────────┼─────────────┐
         │             │             │
         ▼             ▼             ▼
  ┌───────────┐ ┌───────────┐ ┌───────────┐
  │  Redis    │ │PostgreSQL │ │  Fichiers │
  │ Sessions  │ │    BDD    │ │   (NFS)   │
  └───────────┘ └───────────┘ └───────────┘
```

---

### Flux d'une requête

1. **Internet → Load Balancer** : Requête HTTPS
2. **Load Balancer** : Terminaison SSL, choix du serveur (round-robin)
3. **Load Balancer → App1 ou App2** : Requête HTTP interne
4. **App → Redis** : Lecture/écriture de la session
5. **App → PostgreSQL** : Requêtes SQL
6. **App → NFS** : Fichiers uploadés (partagés entre serveurs)
7. **App → Load Balancer → Client** : Réponse

---

### Points clés

- **Sessions en Redis** : Permet de basculer entre App1 et App2 sans perdre la session
- **Fichiers sur NFS** : Les uploads sont accessibles par les deux serveurs
- **SSL uniquement sur le LB** : Simplifie la gestion des certificats

---

## Navigation

→ Fiche suivante : **[02 - La Sécurité et l'Authentification Web](02-securite-authentification.md)**
