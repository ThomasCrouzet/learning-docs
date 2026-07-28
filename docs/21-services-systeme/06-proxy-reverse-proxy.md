---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Proxy et reverse proxy : configurer Squid, HAProxy et Caddy/Nginx en reverse proxy, load balancing et SSL termination."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 9
cursus: "Services système"
---

# 06 - Proxy et reverse proxy

> **En bref** : Tu apprendras a configurer un proxy direct (Squid), un reverse proxy et un load balancer (HAProxy, Caddy, Nginx), a mettre en place la répartition de charge et la terminaison SSL. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [Serveur DHCP](05-serveur-dhcp.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras distinguer un proxy (forward proxy) d'un reverse proxy, configurer Squid comme proxy direct, configurer HAProxy comme load balancer et reverse proxy, utiliser Caddy comme reverse proxy avec SSL automatique, et mettre en place une répartition de charge entre plusieurs backends.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un proxy (forward proxy) ?

**Définition** : Un proxy (ou forward proxy) est un serveur intermédiaire qui se place entre les clients d'un réseau local et Internet. Les clients envoient leurs requêtes au proxy, qui les transmet a Internet en son propre nom, puis renvoie les réponses aux clients.

**Le problème que le proxy résout** :

Sans proxy, voici les problèmes rencontres :

1. **Pas de filtrage** : Chaque machine accede directement a Internet. Tu ne peux pas bloquer les sites non autorises (réseaux sociaux en entreprise, sites malveillants).
2. **Pas de cache** : Si 100 employés consultent la même page web, 100 requêtes identiques sont envoyées vers Internet, gaspillant la bande passante.
3. **Pas d'anonymisation** : Chaque machine expose directement son adresse IP aux sites web visites.

**Comment le proxy résout ces problèmes** :

| Problème | Solution apportée par le proxy |
| --- | --- |
| Pas de filtrage | Le proxy applique des règles (ACL) pour autoriser ou bloquer certains sites |
| Pas de cache | Le proxy met en cache les pages consultees. Les requêtes suivantes sont servies depuis le cache |
| Pas d'anonymisation | Les sites web voient l'adresse IP du proxy, pas celle des clients |

**Analogie concrète** : Un proxy fonctionne comme un assistant personnel. Tu lui demandes d'acheter un livre (requête). L'assistant va a la librairie (Internet), achète le livre (telecharge la page) et te le ramene (réponse). Le libraire ne sait pas qui est le vrai acheteur. Et si un autre collègue demande le meme livre, l'assistant en a garde un exemplaire (cache) et peut le fournir immédiatement.

---

### Qu'est-ce qu'un reverse proxy ?

**Définition** : Un reverse proxy est un serveur intermédiaire qui se place devant un ou plusieurs serveurs backend. Les clients d'Internet envoient leurs requêtes au reverse proxy, qui les transmet au backend approprie. Le client ne connaît pas l'existence des backends.

**Le problème que le reverse proxy résout** :

Sans reverse proxy, voici les problèmes rencontres :

1. **Exposition directe des backends** : Les serveurs applicatifs sont directement accessibles depuis Internet, augmentant la surface d'attaque.
2. **Pas de répartition de charge** : Si un backend est surcharge, les utilisateurs subissent des lenteurs. Il n'y a aucun mécanisme pour distribuer le trafic.
3. **Gestion SSL complexe** : Chaque backend doit gérer ses propres certificats SSL, ce qui multiplie la complexité.

**Comment le reverse proxy résout ces problèmes** :

| Problème | Solution apportée par le reverse proxy |
| --- | --- |
| Exposition directe | Seul le reverse proxy est expose. Les backends restent sur un réseau interne |
| Pas de répartition de charge | Le reverse proxy distribue les requêtes entre plusieurs backends (load balancing) |
| Gestion SSL complexe | Le reverse proxy centralise la terminaison SSL a un seul point |

**Ce qu'un reverse proxy n'est PAS** :

- Un reverse proxy n'est pas un firewall. Le reverse proxy gère le trafic HTTP/HTTPS au niveau applicatif (couche 7). Un firewall filtre le trafic au niveau réseau (couches 3-4). Les deux sont complémentaires.

**Comparaison forward proxy vs reverse proxy** :

| Forward proxy | Reverse proxy |
| --- | --- |
| Protégé les clients (réseau interne) | Protégé les serveurs (backends) |
| Se place entre les clients et Internet | Se place entre Internet et les backends |
| Les clients connaissent le proxy | Les clients ne connaissent pas les backends |
| Filtre les requêtes sortantes | Filtre les requêtes entrantes |
| Exemples : Squid, privoxy | Exemples : Nginx, HAProxy, Caddy, Traefik |

```text
Forward proxy :
[Client] --> [Proxy] --> [Internet]

Reverse proxy :
[Internet] --> [Reverse Proxy] --> [Backend 1]
                                --> [Backend 2]
                                --> [Backend 3]
```

---

### Qu'est-ce que le load balancing ?

**Définition** : Le load balancing (répartition de charge) est la technique qui consiste a distribuer les requêtes entrantes entre plusieurs serveurs backends pour éviter la surcharge d'un seul serveur et assurer la haute disponibilité.

**Les algorithmes de load balancing** :

| Algorithme | Description | Cas d'usage |
| --- | --- | --- |
| Round Robin | Distribue les requêtes a tour de rôle (1, 2, 3, 1, 2, 3...) | Backends identiques en performance |
| Least Connections | Envoie la requête au backend qui a le moins de connexions actives | Requêtes de durée variable |
| IP Hash | La meme IP client est toujours envoyée au même backend | Sessions persistantes |
| Weighted Round Robin | Round Robin avec des poids (un backend puissant reçoit plus de requêtes) | Backends de performance inegale |

---

### Qu'est-ce que la terminaison SSL ?

**Définition** : La terminaison SSL (ou SSL termination) est la technique qui consiste a dechiffrer le trafic HTTPS au niveau du reverse proxy. Le trafic entre le reverse proxy et les backends circule en HTTP non chiffre (sur un réseau interne sécurisé).

```text
[Client] --HTTPS--> [Reverse Proxy] --HTTP--> [Backend]
                    (dechiffrement)           (pas de SSL)
```

**Avantages** :

- Les backends n'ont pas a gérer les certificats SSL
- Le reverse proxy centralise la gestion SSL (renouvellement, configuration)
- Les backends sont plus légers (pas de charge de chiffrement)

---

## Étapes Pratiques

### Étape 1 : Configurer Squid comme forward proxy

```bash
# Cree le dossier de travail
mkdir -p ~/lab-proxy/{squid,haproxy,caddy}

# Lance Squid dans un conteneur
docker run -d \
  --name lab-squid \
  -p 3128:3128 \
  -v ~/lab-proxy/squid:/etc/squid \
  ubuntu/squid:latest
```

Créé une configuration Squid avec des règles de filtrage :

```bash
# Configuration Squid
cat > ~/lab-proxy/squid/squid.conf << 'EOF'
# Port d'ecoute
http_port 3128

# ACL : definition des reseaux autorises
acl localnet src 172.16.0.0/12
acl localnet src 192.168.0.0/16
acl localnet src 10.0.0.0/8

# ACL : ports autorises
acl SSL_ports port 443
acl Safe_ports port 80 443 8080

# ACL : sites bloques
acl sites_bloques dstdomain .facebook.com .twitter.com .tiktok.com

# Regles d'acces
http_access deny sites_bloques
http_access deny !Safe_ports
http_access allow localnet
http_access deny all

# Cache : 256 Mo en memoire, 2 Go sur disque
cache_mem 256 MB
cache_dir ufs /var/spool/squid 2048 16 256

# Logs
access_log /var/log/squid/access.log squid
EOF

# Redemarre Squid pour appliquer la configuration
docker restart lab-squid
```

Teste le proxy :

```bash
# Requete via le proxy (site autorise)
curl -x http://localhost:3128 http://example.com
# Resultat : page HTML de example.com

# Requete via le proxy (site bloque)
curl -x http://localhost:3128 http://www.facebook.com
# Resultat : page d'erreur Squid "Access Denied"
```

**Résultat attendu pour le site bloque** :

```text
<html>
<head><title>ERROR: The requested URL could not be retrieved</title></head>
<body>
<h1>ERROR</h1>
<p>Access Denied.</p>
</body>
</html>
```

---

### Étape 2 : Creer des backends de test

Avant de configurer le reverse proxy et le load balancer, créé trois serveurs backend simples :

```bash
# Cree un reseau dedie
docker network create lab-proxy-net

# Backend 1
docker run -d --name backend1 --network lab-proxy-net \
  -e PORT=8001 python:3.12-slim \
  sh -c 'echo "Reponse du backend 1" > /index.html && python -m http.server 8001 --directory /'

# Backend 2
docker run -d --name backend2 --network lab-proxy-net \
  -e PORT=8002 python:3.12-slim \
  sh -c 'echo "Reponse du backend 2" > /index.html && python -m http.server 8002 --directory /'

# Backend 3
docker run -d --name backend3 --network lab-proxy-net \
  -e PORT=8003 python:3.12-slim \
  sh -c 'echo "Reponse du backend 3" > /index.html && python -m http.server 8003 --directory /'
```

---

### Étape 3 : Configurer HAProxy comme load balancer

```bash
# Configuration HAProxy
cat > ~/lab-proxy/haproxy/haproxy.cfg << 'EOF'
# Section globale
global
    # Journalisation
    log stdout format raw local0
    # Nombre maximum de connexions simultanees
    maxconn 4096

# Parametres par defaut
defaults
    log     global
    mode    http
    option  httplog
    option  dontlognull
    # Timeouts
    timeout connect 5s
    timeout client  30s
    timeout server  30s
    # Retries en cas d'echec
    retries 3

# Frontend : point d'entree des requetes
frontend http_front
    # Ecoute sur le port 80
    bind *:80
    # Envoie les requetes au backend
    default_backend http_back

# Backend : groupe de serveurs
backend http_back
    # Algorithme de repartition : round robin
    balance roundrobin
    # Verification de sante toutes les 5 secondes
    option httpchk GET /
    # Liste des serveurs backend
    server backend1 backend1:8001 check
    server backend2 backend2:8002 check
    server backend3 backend3:8003 check

# Page de statistiques HAProxy
listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 5s
    stats auth admin:admin123
EOF

# Lance HAProxy
docker run -d \
  --name lab-haproxy \
  --network lab-proxy-net \
  -p 8080:80 \
  -p 8404:8404 \
  -v ~/lab-proxy/haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro \
  haproxy:2.9
```

**Résultat attendu** :

```text
[NOTICE] ... : haproxy version 2.9.x
[NOTICE] ... : New worker (1) forked
```

---

### Étape 4 : Tester le load balancing

```bash
# Envoie 6 requetes successives
for i in 1 2 3 4 5 6; do
  echo "Requete $i :"
  curl -s http://localhost:8080
done
```

**Résultat attendu (round robin)** :

```text
Requete 1 :
Reponse du backend 1
Requete 2 :
Reponse du backend 2
Requete 3 :
Reponse du backend 3
Requete 4 :
Reponse du backend 1
Requete 5 :
Reponse du backend 2
Requete 6 :
Reponse du backend 3
```

Les requêtes sont distribuees a tour de rôle entre les trois backends.

Consulte les statistiques HAProxy :

```bash
# Ouvre les stats dans le navigateur ou avec curl
curl -u admin:admin123 http://localhost:8404/stats
```

---

### Étape 5 : Tester la haute disponibilité

```bash
# Arrete le backend 2
docker stop backend2

# Envoie des requetes (le trafic est redirige vers les backends restants)
for i in 1 2 3 4; do
  echo "Requete $i :"
  curl -s http://localhost:8080
done
```

**Résultat attendu** :

```text
Requete 1 :
Reponse du backend 1
Requete 2 :
Reponse du backend 3
Requete 3 :
Reponse du backend 1
Requete 4 :
Reponse du backend 3
```

HAProxy a detecte que le backend 2 est hors service (health check échoue) et ne lui envoie plus de requêtes.

```bash
# Relance le backend 2
docker start backend2
```

---

### Étape 6 : Configurer Caddy comme reverse proxy

Caddy est un serveur web moderne qui gère automatiquement les certificats SSL avec Let's Encrypt.

```bash
# Configuration Caddy (Caddyfile)
cat > ~/lab-proxy/caddy/Caddyfile << 'EOF'
# Reverse proxy pour app.lab.local
:8080 {
    reverse_proxy backend1:8001 backend2:8002 backend3:8003 {
        # Load balancing round robin
        lb_policy round_robin

        # Health checks
        health_uri /
        health_interval 10s
        health_timeout 5s
    }

    # Headers de securite
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        Strict-Transport-Security "max-age=31536000"
    }

    # Journalisation
    log {
        output stdout
        format console
    }
}
EOF

# Lance Caddy
docker run -d \
  --name lab-caddy \
  --network lab-proxy-net \
  -p 8081:8080 \
  -v ~/lab-proxy/caddy/Caddyfile:/etc/caddy/Caddyfile:ro \
  caddy:2
```

Teste le reverse proxy Caddy :

```bash
# Teste via Caddy
for i in 1 2 3; do
  echo "Requete $i :"
  curl -s http://localhost:8081
done
```

**Résultat attendu** :

```text
Requete 1 :
Reponse du backend 1
Requete 2 :
Reponse du backend 2
Requete 3 :
Reponse du backend 3
```

---

### Étape 7 : Configurer Nginx comme reverse proxy avec load balancing

```bash
# Configuration Nginx reverse proxy
mkdir -p ~/lab-proxy/nginx
cat > ~/lab-proxy/nginx/default.conf << 'EOF'
# Groupe de serveurs backend (upstream)
upstream backends {
    # Algorithme : round robin (par defaut)
    server backend1:8001;
    server backend2:8002;
    server backend3:8003;
}

server {
    listen 80;

    location / {
        # Transmet les requetes au groupe de backends
        proxy_pass http://backends;

        # Transmet les headers originaux
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Page de statut Nginx
    location /nginx_status {
        stub_status;
        allow 127.0.0.1;
        deny all;
    }
}
EOF

# Lance Nginx
docker run -d \
  --name lab-nginx-rp \
  --network lab-proxy-net \
  -p 8082:80 \
  -v ~/lab-proxy/nginx/default.conf:/etc/nginx/conf.d/default.conf:ro \
  nginx:1.26
```

Teste :

```bash
# Teste via Nginx
for i in 1 2 3; do
  echo "Requete $i :"
  curl -s http://localhost:8082
done
```

---

### Étape 8 : Nettoyage

```bash
# Arrete et supprime tout
docker stop lab-squid lab-haproxy lab-caddy lab-nginx-rp \
  backend1 backend2 backend3 2>/dev/null
docker rm lab-squid lab-haproxy lab-caddy lab-nginx-rp \
  backend1 backend2 backend3 2>/dev/null
docker network rm lab-proxy-net 2>/dev/null
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `curl -x http://proxy:3128 http://site.com` | Envoie une requête via un proxy HTTP |
| `curl -I http://localhost:8080` | Affiche les headers de réponse du reverse proxy |
| `haproxy -c -f /etc/haproxy/haproxy.cfg` | Teste la syntaxe de la configuration HAProxy |
| `caddy validate --config /etc/caddy/Caddyfile` | Teste la syntaxe du Caddyfile |
| `nginx -t` | Teste la syntaxe de la configuration Nginx |
| `curl -u admin:admin http://localhost:8404/stats` | Consulte les statistiques HAProxy |

---

## Pièges Frequents

### Piège 1 : Confondre forward proxy et reverse proxy

⚠️ **Problème** : Tu configures un forward proxy (Squid) en pensant protéger tes serveurs backend. Ou tu configures un reverse proxy (Nginx) en pensant filtrer la navigation de tes utilisateurs.

✅ **Solution** : Retiens la règle simple :

- **Forward proxy** : protégé les **clients** (filtre la navigation sortante)
- **Reverse proxy** : protégé les **serveurs** (filtre le trafic entrant)

---

### Piège 2 : Pas de health check sur les backends

⚠️ **Problème** : Tu configures un load balancer sans health check. Un backend tombe en panne mais le load balancer continue de lui envoyer des requêtes. Les utilisateurs reçoivent des erreurs 502 ou 503.

✅ **Solution** : Active toujours les health checks. HAProxy, Caddy et Nginx supportent tous la vérification de santé des backends :

```text
# HAProxy
option httpchk GET /health
server backend1 backend1:8001 check inter 5s fall 3 rise 2

# Caddy
health_uri /health
health_interval 10s

# Nginx (module tiers ngx_http_upstream_hc_module)
```

---

### Piège 3 : Perdre l'adresse IP du client

⚠️ **Problème** : Le backend voit l'adresse IP du reverse proxy au lieu de celle du client. Les logs du backend montrent toujours la même adresse IP.

✅ **Solution** : Configure le reverse proxy pour transmettre l'adresse IP réelle du client via les headers `X-Real-IP` et `X-Forwarded-For`. Cote backend, configure l'application pour lire ces headers.

```nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

---

### Piège 4 : SSL entre le reverse proxy et les backends

⚠️ **Problème** : Tu chiffres le trafic entre le reverse proxy et les backends sur le meme réseau interne. La charge CPU est doublee sans gain de sécurité réel.

✅ **Solution** : Sur un réseau interne sécurisé (Docker bridge, VLAN dedie), la terminaison SSL au niveau du reverse proxy est suffisante. Le trafic interne en HTTP n'est pas un risque si le réseau est isole. En revanche, si les backends sont sur un réseau non fiable (WAN, cloud multi-tenant), chiffre aussi le trafic interne.

---

## Checklist de Validation

- [ ] Je sais distinguer un forward proxy d'un reverse proxy
- [ ] Je sais configurer Squid comme proxy de filtrage et de cache
- [ ] Je sais configurer HAProxy comme load balancer avec health checks
- [ ] Je sais configurer Caddy comme reverse proxy avec SSL automatique
- [ ] Je sais configurer Nginx comme reverse proxy avec upstream
- [ ] Je comprends les algorithmes de load balancing (round robin, least connections)
- [ ] Je comprends le principe de terminaison SSL

---

## Exercice Pratique

**Enonce** : Configure une infrastructure de haute disponibilité avec :

1. Trois backends identiques servant une page HTML
2. HAProxy comme load balancer en mode `leastconn` (least connections)
3. Health check HTTP sur le chemin `/` toutes les 3 secondes
4. Page de statistiques HAProxy accessible sur le port 8404
5. Teste la haute disponibilité en arretant un backend et en verifiant que le trafic est redirige

**Indications** :

- Utilise les images Python pour les backends
- Modifie `balance roundrobin` en `balance leastconn`
- Verifie les statistiques pour voir l'état de chaque backend

**Résultat attendu** : Le load balancer distribue les requêtes entre les backends disponibles. Quand un backend tombe, le trafic est automatiquement redirige vers les backends restants.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

```bash
# Cree le reseau
docker network create lab-ha-net

# Trois backends
for i in 1 2 3; do
  docker run -d --name ha-backend$i --network lab-ha-net \
    python:3.12-slim \
    sh -c "echo 'Backend $i OK' > /index.html && python -m http.server 800$i --directory /"
done

# Configuration HAProxy
mkdir -p ~/lab-ha
cat > ~/lab-ha/haproxy.cfg << 'EOF'
global
    log stdout format raw local0
    maxconn 4096

defaults
    log global
    mode http
    option httplog
    timeout connect 5s
    timeout client 30s
    timeout server 30s
    retries 3

frontend http_front
    bind *:80
    default_backend http_back

backend http_back
    balance leastconn
    option httpchk GET /
    http-check expect status 200
    server backend1 ha-backend1:8001 check inter 3s fall 2 rise 2
    server backend2 ha-backend2:8002 check inter 3s fall 2 rise 2
    server backend3 ha-backend3:8003 check inter 3s fall 2 rise 2

listen stats
    bind *:8404
    stats enable
    stats uri /stats
    stats refresh 3s
    stats auth admin:admin123
EOF

# Lance HAProxy
docker run -d --name lab-ha-proxy --network lab-ha-net \
  -p 8080:80 -p 8404:8404 \
  -v ~/lab-ha/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg:ro \
  haproxy:2.9

# Teste le load balancing
for i in 1 2 3 4 5 6; do curl -s http://localhost:8080; done

# Arrete un backend
docker stop ha-backend2

# Verifie que le trafic est redirige
for i in 1 2 3 4; do curl -s http://localhost:8080; done
# Seuls backend1 et backend3 repondent

# Relance le backend
docker start ha-backend2

# Nettoyage
docker stop lab-ha-proxy ha-backend1 ha-backend2 ha-backend3 2>/dev/null
docker rm lab-ha-proxy ha-backend1 ha-backend2 ha-backend3 2>/dev/null
docker network rm lab-ha-net 2>/dev/null
```

---

## Navigation

← Fiche précédente : **[05 - Serveur DHCP](05-serveur-dhcp.md)**

→ Fiche suivante : **[07 - Conteneurisation des services](07-conteneurisation-services.md)**
