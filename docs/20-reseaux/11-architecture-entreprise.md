---
tags:
  - Réseaux
  - Avancé
  - Concept
description: "Architecture réseau d'entreprise : DMZ, proxy, reverse proxy, load balancer, haute disponibilité."
estimated_time: "75 min"
fiche_number: 11
total_fiches: 14
cursus: "Réseaux"
---

# 11 - Architecture réseau d'entreprise

> **En bref** : Tu apprendras à concevoir une architecture réseau d'entreprise avec DMZ, proxy, reverse proxy, load balancer et haute disponibilité, et à comprendre le rôle de chaque composant. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [10 - Diagnostic et outils](10-diagnostic-outils.md)
- Connaître les bases du routage et du NAT
- Connaître les principes de filtrage avec un firewall
- Comprendre le fonctionnement de HTTP/HTTPS

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le rôle d'une DMZ, la différence entre un proxy et un reverse proxy, le fonctionnement d'un load balancer et les stratégies de haute disponibilité. Tu sauras aussi dessiner une architecture réseau d'entreprise complète.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une DMZ ?

**Définition** : Une DMZ (DeMilitarized Zone) est un sous-réseau isole situe entre le réseau interne (LAN) et le réseau externe (Internet). Elle heberge les services accessibles depuis Internet (serveur web, serveur mail, DNS public) tout en les isolant du réseau interne.

**Le problème que la DMZ résout** :

Sans DMZ, voici les problèmes rencontres :

1. **Exposition directe** : Un serveur web accessible depuis Internet est place directement sur le réseau interne. S'il est compromis, l'attaquant a accès a tout le réseau (base de données, postes de travail, partages de fichiers).
2. **Pas de segmentation** : Tous les services sont sur le meme réseau, au même niveau de confiance. Un visiteur web et un administrateur interne ont le meme accès réseau.
3. **Règles de firewall complexes** : Sans zone distincte, les règles de filtrage deviennent très complexes car elles doivent gérer tous les cas sur une seule interface.

**Comment la DMZ résout ces problèmes** :

| Problème | Solution apportée par la DMZ |
| --- | --- |
| Exposition directe | Les serveurs publics sont isoles dans un réseau separe |
| Pas de segmentation | Trois zones claires : Internet, DMZ, LAN avec des règles différentes |
| Règles de firewall complexes | Chaque zone a ses propres règles, plus simples a gérer |

**Architecture DMZ** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-11-architecture-entreprise-1.html">Qu&#x27;est-ce qu&#x27;une DMZ ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-11-architecture-entreprise-1.html" title="Qu&#x27;est-ce qu&#x27;une DMZ ?" style="width:100%;min-height:676px;border:0;background:transparent"></iframe>
</div>

**Règles de trafic entre les zones** :

| Source | Destination | Autorise ? | Exemple |
| --- | --- | --- | --- |
| Internet | DMZ | Oui (ports spécifiques) | HTTP/HTTPS vers le serveur web |
| Internet | LAN | Non | Aucun accès direct |
| DMZ | LAN | Limite | Le serveur web interroge la base de données (port 5432) |
| DMZ | Internet | Limite | Le serveur mail envoie des e-mails (port 25) |
| LAN | DMZ | Oui | Administration des serveurs en DMZ |
| LAN | Internet | Oui (via proxy) | Navigation web des employés |

**Analogie concrète** : Une DMZ fonctionne comme le hall d'accueil d'une entreprise. Les visiteurs (Internet) peuvent entrer dans le hall (DMZ) et utiliser les services d'accueil (serveur web, serveur mail). Mais ils ne peuvent pas accéder aux bureaux (LAN) sans badge. Le hall est separe des bureaux par une porte sécurisée (firewall interne). Si un visiteur malveillant saccage le hall, les bureaux restent intacts.

**Ce qu'une DMZ n'est PAS** :

- Une DMZ n'est pas un VPN. Un VPN créé un tunnel chiffre pour accéder au réseau interne depuis l'extérieur. Une DMZ isole les services publics du réseau interne.
- Une DMZ n'est pas un réseau ouvert. Les services en DMZ sont proteges par le firewall externe. Seuls les ports explicitement autorises sont accessibles.

---

### Qu'est-ce qu'un proxy ?

**Définition** : Un proxy (proxy forward) est un serveur intermédiaire qui reçoit les requêtes des clients internes et les transmet vers Internet en leur nom. Les serveurs externes voient l'adresse IP du proxy, pas celle du client.

**Le problème que le proxy résout** :

Sans proxy, voici les problèmes rencontres :

1. **Pas de controle de la navigation** : Les employés peuvent accéder a n'importe quel site web. Pas de filtrage des sites malveillants ou inappropries.
2. **Pas de cache** : Chaque employé qui visite le meme site telecharge les memes données. La bande passante est gaspillee.
3. **Pas de traçabilité** : Impossible de savoir qui a visite quel site et quand. En cas d'incident de sécurité, pas de logs.

**Comment le proxy résout ces problèmes** :

| Problème | Solution apportée par le proxy |
| --- | --- |
| Pas de controle | Le proxy filtre les URL selon des règles (listes noires, catégories) |
| Pas de cache | Le proxy met en cache les réponses fréquentes |
| Pas de traçabilité | Le proxy enregistre toutes les requêtes dans des logs |

**Ce qu'un proxy n'est PAS** :

- Un proxy n'est pas un VPN. Un proxy ne chiffre pas le trafic (sauf s'il est configuré en HTTPS). Il fait du relais de requêtes, sans chiffrer par défaut.
- Un proxy n'est pas un reverse proxy. Le proxy forward sert les clients internes qui vont vers Internet. Le reverse proxy sert les clients externes qui vont vers les serveurs internes (voir section suivante).

---

### Qu'est-ce qu'un reverse proxy ?

**Définition** : Un reverse proxy est un serveur intermédiaire place devant les serveurs web internes. Il reçoit les requêtes des clients externes (Internet) et les redirige vers le bon serveur en fonction de l'URL, du nom de domaine ou d'autres critères.

**Le problème que le reverse proxy résout** :

Sans reverse proxy, voici les problèmes rencontres :

1. **Exposition des serveurs** : Chaque serveur web doit avoir sa propre adresse IP publique et être expose directement sur Internet.
2. **Pas de terminaison TLS centralisée** : Chaque serveur doit gérer ses propres certificats TLS. La gestion et le renouvellement sont multiplies.
3. **Pas de répartition de charge** : Si un serveur web est surcharge, il n'y a pas de mécanisme pour rediriger le trafic vers un autre serveur.

**Comment le reverse proxy résout ces problèmes** :

| Problème | Solution apportée par le reverse proxy |
| --- | --- |
| Exposition des serveurs | Un seul point d'entrée expose sur Internet, les serveurs restent internes |
| Pas de terminaison TLS centralisée | Le reverse proxy gère tous les certificats TLS en un seul endroit |
| Pas de répartition de charge | Le reverse proxy distribue les requêtes entre plusieurs serveurs |

**Comparaison proxy vs reverse proxy** :

| Proxy (forward) | Reverse proxy |
| --- | --- |
| Devant les clients (LAN vers Internet) | Devant les serveurs (Internet vers LAN) |
| Protégé les clients | Protégé les serveurs |
| Filtre la navigation sortante | Distribue le trafic entrant |
| Exemple : Squid | Exemple : Nginx, Caddy, HAProxy |

**Analogie concrète** : Un reverse proxy fonctionne comme le standard téléphonique d'une entreprise. Quand un client appelle le numéro général (adresse IP publique), le standardiste (reverse proxy) redirige l'appel vers le bon service (serveur interne) selon la demande. Le client ne connaît pas le numéro direct du service. Si un service est en reunion (surcharge), le standardiste redirige vers un collègue disponible (répartition de charge).

**Architecture avec reverse proxy** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-11-architecture-entreprise-2.html">Qu&#x27;est-ce qu&#x27;un reverse proxy ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-11-architecture-entreprise-2.html" title="Qu&#x27;est-ce qu&#x27;un reverse proxy ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce qu'un load balancer ?

**Définition** : Un load balancer (repartiteur de charge) est un dispositif qui distribue le trafic réseau entre plusieurs serveurs identiques. Son objectif est de repartir la charge pour qu'aucun serveur ne soit surcharge et que le service reste disponible même si un serveur tombe en panne.

**Le problème que le load balancer résout** :

Sans load balancer, voici les problèmes rencontres :

1. **Serveur unique surcharge** : Quand le nombre d'utilisateurs augmente, un seul serveur ne suffit plus. Les temps de réponse augmentent et le service devient inutilisable.
2. **Point de défaillance unique** : Si le serveur tombe en panne, le service est complètement indisponible. Pas de basculement automatique.
3. **Maintenance sans coupure impossible** : Pour mettre a jour le serveur, il faut l'arrêter et donc couper le service.

**Comment le load balancer résout ces problèmes** :

| Problème | Solution apportée par le load balancer |
| --- | --- |
| Serveur surcharge | Le trafic est reparti entre N serveurs |
| Point de défaillance unique | Si un serveur tombe, les autres prennent le relais |
| Maintenance sans coupure | Les serveurs sont mis a jour un par un (rolling update) |

**Algorithmes de répartition** :

| Algorithme | Fonctionnement | Cas d'usage |
| --- | --- | --- |
| Round Robin | Chaque requête va au serveur suivant dans l'ordre | Serveurs identiques, requêtes similaires |
| Least Connections | La requête va au serveur qui a le moins de connexions actives | Requêtes de durée variable |
| IP Hash | La meme IP client va toujours au même serveur | Sessions persistantes (sticky sessions) |
| Weighted Round Robin | Comme Round Robin, mais les serveurs ont un poids (2x plus de trafic pour un serveur 2x plus puissant) | Serveurs de capacités différentes |

**Architecture avec load balancer** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-11-architecture-entreprise-3.html">Qu&#x27;est-ce qu&#x27;un load balancer ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-11-architecture-entreprise-3.html" title="Qu&#x27;est-ce qu&#x27;un load balancer ?" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que la haute disponibilité ?

**Définition** : La haute disponibilité (HA - High Availability) est un ensemble de techniques qui garantissent qu'un service reste accessible meme en cas de panne d'un composant. L'objectif est de minimiser le temps d'indisponibilite.

**Le problème que la haute disponibilité résout** :

Sans haute disponibilité, chaque composant de l'architecture est un point de défaillance unique (SPOF - Single Point of Failure). Si le load balancer tombe, tout le service est indisponible, même si les serveurs fonctionnent.

**Niveaux de disponibilité** :

| Niveau | Disponibilite | Temps d'arrêt par an | Designation |
| --- | --- | --- | --- |
| 99% | "Deux neufs" | 3.65 jours | Faible |
| 99.9% | "Trois neufs" | 8.76 heures | Standard |
| 99.99% | "Quatre neufs" | 52.56 minutes | Haute disponibilité |
| 99.999% | "Cinq neufs" | 5.26 minutes | Tres haute disponibilité |

**Techniques de haute disponibilité** :

| Technique | Description | Composant protégé |
| --- | --- | --- |
| Redondance active/passive | Un composant secondaire prend le relais en cas de panne | Load balancer, base de données |
| Redondance active/active | Deux composants partagent la charge en permanence | Serveurs applicatifs |
| Failover automatique | Détection de panne et basculement sans intervention humaine | Tous les composants |
| Replication de données | Les données sont copiees en temps réel sur un second serveur | Base de données |
| VRRP/Keepalived | Adresse IP virtuelle partagée entre deux machines | Load balancer, routeur |

**Analogie concrète** : La haute disponibilité fonctionne comme un avion avec deux moteurs. En vol normal, les deux moteurs fonctionnent et partagent la charge. Si un moteur tombe en panne, l'autre prend le relais automatiquement. L'avion continue de voler sans que les passagers (les utilisateurs) ne remarquent le problème.

---

## Étapes Pratiques

### Étape 1 : Configurer un reverse proxy avec Nginx

```bash
# Installe Nginx
sudo apt install -y nginx

# Cree la configuration du reverse proxy
sudo tee /etc/nginx/sites-available/reverse-proxy << 'EOF'
# Reverse proxy pour une application sur le port 3000
server {
    listen 80;
    server_name app.example.com;

    location / {
        # Transmet les requetes vers le serveur applicatif
        proxy_pass http://127.0.0.1:3000;

        # Transmet les en-tetes du client original
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF
```

```bash
# Active la configuration
sudo ln -s /etc/nginx/sites-available/reverse-proxy /etc/nginx/sites-enabled/

# Teste la configuration
sudo nginx -t
```

**Résultat attendu** :

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

```bash
# Recharge Nginx
sudo systemctl reload nginx
```

---

### Étape 2 : Configurer un load balancer avec Nginx

```bash
# Configuration Nginx avec repartition de charge
sudo tee /etc/nginx/sites-available/load-balancer << 'EOF'
# Pool de serveurs backend
upstream backend {
    # Algorithme : least_conn (moins de connexions)
    least_conn;

    server 192.168.1.11:3000;  # Serveur 1
    server 192.168.1.12:3000;  # Serveur 2
    server 192.168.1.13:3000 backup;  # Serveur 3 (uniquement si 1 et 2 sont indisponibles)
}

server {
    listen 80;
    server_name app.example.com;

    location / {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    # Page de status pour verifier le load balancer
    location /nginx_status {
        stub_status on;
        allow 192.168.1.0/24;
        deny all;
    }
}
EOF
```

```bash
# Active et teste la configuration
sudo ln -sf /etc/nginx/sites-available/load-balancer /etc/nginx/sites-enabled/reverse-proxy
sudo nginx -t && sudo systemctl reload nginx
```

```bash
# Verifie que le load balancer fonctionne
curl http://app.example.com/
# Lance plusieurs requetes pour voir la repartition
for i in $(seq 1 10); do
  curl -s http://app.example.com/hostname
  echo ""
done
```

---

### Étape 3 : Configurer un reverse proxy avec Caddy

```bash
# Installe Caddy
sudo apt install -y caddy

# Cree la configuration Caddy (Caddyfile)
sudo tee /etc/caddy/Caddyfile << 'EOF'
# Reverse proxy avec TLS automatique
app.example.com {
    reverse_proxy 127.0.0.1:3000
}

# Load balancer avec plusieurs backends
api.example.com {
    reverse_proxy 192.168.1.11:8080 192.168.1.12:8080 {
        lb_policy least_conn
        health_uri /health
        health_interval 10s
    }
}
EOF
```

```bash
# Recharge la configuration Caddy
sudo systemctl reload caddy
```

---

### Étape 4 : Simuler une architecture avec Docker Compose

```bash
# Cree un repertoire pour le projet
mkdir -p ~/reseau-cursus/architecture && cd ~/reseau-cursus/architecture
```

```yaml
# docker-compose.yml - Architecture avec reverse proxy et load balancer
services:
  # Reverse proxy / Load balancer
  nginx:
    image: nginx:1.26
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app1
      - app2
      - app3

  # 3 instances de l'application
  app1:
    image: nginx:1.26-alpine
    volumes:
      - ./app1.html:/usr/share/nginx/html/index.html:ro

  app2:
    image: nginx:1.26-alpine
    volumes:
      - ./app2.html:/usr/share/nginx/html/index.html:ro

  app3:
    image: nginx:1.26-alpine
    volumes:
      - ./app3.html:/usr/share/nginx/html/index.html:ro
```

```bash
# Cree les fichiers de contenu pour chaque instance
echo "<h1>Serveur 1</h1>" > app1.html
echo "<h1>Serveur 2</h1>" > app2.html
echo "<h1>Serveur 3</h1>" > app3.html
```

```bash
# Cree la configuration Nginx pour le load balancer
tee nginx.conf << 'EOF'
events {}
http {
    upstream backend {
        server app1:80;
        server app2:80;
        server app3:80;
    }
    server {
        listen 80;
        location / {
            proxy_pass http://backend;
        }
    }
}
EOF
```

```bash
# Lance la stack
docker compose up -d

# Teste la repartition de charge
for i in $(seq 1 9); do
  curl -s http://localhost | grep -o "Serveur [0-9]"
done
```

**Résultat attendu** :

```text
Serveur 1
Serveur 2
Serveur 3
Serveur 1
Serveur 2
Serveur 3
Serveur 1
Serveur 2
Serveur 3
```

---

### Étape 5 : Tester le failover

```bash
# Arrete le serveur 2
docker compose stop app2

# Verifie que le trafic est redistribue sur les serveurs 1 et 3
for i in $(seq 1 6); do
  curl -s http://localhost | grep -o "Serveur [0-9]"
done
```

**Résultat attendu** :

```text
Serveur 1
Serveur 3
Serveur 1
Serveur 3
Serveur 1
Serveur 3
```

```bash
# Redemarre le serveur 2
docker compose start app2

# Verifie que le trafic est de nouveau reparti sur les 3 serveurs
for i in $(seq 1 6); do
  curl -s http://localhost | grep -o "Serveur [0-9]"
done
```

---

### Étape 6 : Configurer la haute disponibilité avec Keepalived

```bash
# Installe Keepalived
sudo apt install -y keepalived

# Configuration du noeud principal (MASTER)
sudo tee /etc/keepalived/keepalived.conf << 'EOF'
vrrp_instance VI_1 {
    state MASTER
    interface eth0
    virtual_router_id 51
    priority 100
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass motdepasse
    }

    virtual_ipaddress {
        192.168.1.100/24
    }
}
EOF
```

```bash
# Configuration du noeud secondaire (BACKUP) - sur la 2e machine
sudo tee /etc/keepalived/keepalived.conf << 'EOF'
vrrp_instance VI_1 {
    state BACKUP
    interface eth0
    virtual_router_id 51
    priority 90
    advert_int 1

    authentication {
        auth_type PASS
        auth_pass motdepasse
    }

    virtual_ipaddress {
        192.168.1.100/24
    }
}
EOF
```

```bash
# Demarre Keepalived
sudo systemctl start keepalived
sudo systemctl enable keepalived

# Verifie quelle machine porte l'IP virtuelle
ip addr show eth0 | grep "192.168.1.100"
```

**Résultat attendu** (sur le MASTER) :

```text
    inet 192.168.1.100/24 scope global secondary eth0
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `sudo nginx -t` | Teste la configuration Nginx |
| `sudo systemctl reload nginx` | Recharge Nginx sans coupure |
| `curl -I http://localhost` | Teste le reverse proxy |
| `sudo systemctl status keepalived` | Verifie l'état de Keepalived |
| `ip addr show` | Affiche les adresses IP (dont l'IP virtuelle) |
| `docker compose up -d --scale app=3` | Lance 3 instances d'un service |

---

## Pièges Fréquents

### Piège 1 : Le reverse proxy ne transmet pas l'IP du client

⚠️ **Problème** : Les logs de l'application montrent toujours l'adresse IP du reverse proxy (127.0.0.1) au lieu de celle du client réel.

✅ **Solution** : Configure les en-tetes de transmission dans le reverse proxy :

```text
# Dans la configuration Nginx
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
```

L'application doit être configurée pour lire l'en-tete `X-Real-IP` ou `X-Forwarded-For` au lieu de l'adresse IP de la connexion.

---

### Piège 2 : Load balancer et sessions

⚠️ **Problème** : Un utilisateur se connecte sur le serveur 1 et créé une session. La requête suivante est envoyée au serveur 2 qui ne connaît pas la session. L'utilisateur est deconnecte.

✅ **Solution** : Trois approches :

1. **Sessions sticky** : Le load balancer envoie toujours le meme client au même serveur (IP Hash)
2. **Sessions partagées** : Stocke les sessions dans Redis ou une base de données partagée
3. **Tokens stateless** : Utilise des JWT (JSON Web Tokens) qui ne necessitent pas de session serveur

---

### Piège 3 : Keepalived split-brain

⚠️ **Problème** : Les deux nœuds Keepalived perdent la communication entre eux. Chacun pense être le MASTER et prend l'adresse IP virtuelle. Deux machines ont la même IP, ce qui cause des problèmes de routage.

✅ **Solution** : Configure un mécanisme de fencing (isolation du nœud defaillant) et utilise plusieurs interfaces pour la communication entre les nœuds Keepalived.

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle d'une DMZ et les règles de trafic entre zones
- [ ] Je comprends la difference entre un proxy forward et un reverse proxy
- [ ] Je sais configurer un reverse proxy avec Nginx ou Caddy
- [ ] Je sais configurer un load balancer avec Nginx
- [ ] Je connais les algorithmes de répartition de charge (Round Robin, Least Connections, IP Hash)
- [ ] Je sais expliquer le concept de haute disponibilité et les niveaux de disponibilité
- [ ] Je comprends le fonctionnement de Keepalived et VRRP
- [ ] Je sais tester le failover d'un load balancer

---

## Exercice Pratique

**Énoncé** : Deploie une architecture avec Docker Compose qui comprend :

1. Un reverse proxy Nginx qui écoute sur le port 80
2. Trois instances d'une application web (peuvent être de simples conteneurs Nginx avec un contenu différent)
3. Une répartition de charge en Round Robin
4. Teste le failover en arretant une instance
5. Documente l'architecture dans un schéma

**Indications** :

- Utilise le bloc `upstream` de Nginx pour définir les backends
- Chaque instance doit retourner un identifiant unique (nom du serveur) pour vérifier la répartition
- Arrete une instance avec `docker compose stop <service>` et verifie que les requêtes sont redistribuees
- Redemarre l'instance et verifie le retour a la normale

**Résultat attendu** :

- Les requêtes sont reparties equitablement entre les 3 instances
- Quand une instance est arretee, les requêtes sont redistribuees sur les 2 restantes
- Quand l'instance est redemarree, elle reprend sa part du trafic

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Structure du projet** :

```text
~/reseau-cursus/exercice-lb/
├── docker-compose.yml
├── nginx.conf
├── app1.html
├── app2.html
└── app3.html
```

**docker-compose.yml** :

```yaml
services:
  lb:
    image: nginx:1.26
    ports:
      - "80:80"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app1
      - app2
      - app3

  app1:
    image: nginx:1.26-alpine
    volumes:
      - ./app1.html:/usr/share/nginx/html/index.html:ro

  app2:
    image: nginx:1.26-alpine
    volumes:
      - ./app2.html:/usr/share/nginx/html/index.html:ro

  app3:
    image: nginx:1.26-alpine
    volumes:
      - ./app3.html:/usr/share/nginx/html/index.html:ro
```

**nginx.conf** :

```text
events {}
http {
    upstream backend {
        server app1:80;
        server app2:80;
        server app3:80;
    }
    server {
        listen 80;
        location / {
            proxy_pass http://backend;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
}
```

**Fichiers de contenu** :

```bash
echo "Serveur 1" > app1.html
echo "Serveur 2" > app2.html
echo "Serveur 3" > app3.html
```

**Test de répartition** :

```bash
# Lance la stack
docker compose up -d

# Verifie la repartition (9 requetes = 3 par serveur en Round Robin)
for i in $(seq 1 9); do curl -s http://localhost; done
```

**Test de failover** :

```bash
# Arrete le serveur 2
docker compose stop app2

# Verifie la redistribution
for i in $(seq 1 6); do curl -s http://localhost; done
# Resultat : alternance entre Serveur 1 et Serveur 3

# Redemarre le serveur 2
docker compose start app2

# Verifie le retour a la normale
for i in $(seq 1 9); do curl -s http://localhost; done
```

**Schéma de l'architecture** :

```text
                  ┌──────────────────┐
                  │   Client (curl)  │
                  └────────┬─────────┘
                           │ Port 80
                  ┌────────▼─────────┐
                  │   Load Balancer  │
                  │   (Nginx)        │
                  └──┬─────┬─────┬───┘
                     │     │     │
              ┌──────▼┐ ┌──▼───┐ ┌▼──────┐
              │ App 1 │ │ App 2│ │ App 3 │
              │ :80   │ │ :80  │ │ :80   │
              └───────┘ └──────┘ └───────┘
```

```bash
# Nettoyage
docker compose down
```

---

## Navigation

← Fiche précédente : **[10 - Diagnostic et outils](10-diagnostic-outils.md)**

→ Fiche suivante : **[12 - Projet intégrateur](12-projet-integrateur.md)**
