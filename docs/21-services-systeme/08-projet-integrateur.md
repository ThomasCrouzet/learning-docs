---
tags:
  - Systèmes
  - Avancé
  - Projet
description: "Projet intégrateur : déployer une infrastructure multi-services complete conteneurisee avec DNS, web, mail, LDAP, reverse proxy et monitoring."
estimated_time: "120 min"
fiche_number: 8
total_fiches: 9
cursus: "Services système"
id: "infrastructure.system-services.projet-integrateur"
course_id: "infrastructure.system-services"
content_type: "project"
order: 8
---

# 08 - Projet intégrateur

> **En bref** : Tu vas déployer une infrastructure multi-services complete et conteneurisee pour une entreprise fictive, en integrant DNS, serveur web, messagerie, annuaire LDAP, reverse proxy et monitoring. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- Avoir lu la fiche [Conteneurisation des services](07-conteneurisation-services.md)
- Avoir complete toutes les fiches précédentes du cursus

## Objectif de cette fiche

À la fin de cette fiche, tu auras déployé une infrastructure complète pour l'entreprise fictive "TechLab" avec un serveur DNS autoritaire, un serveur web avec deux sites, un annuaire LDAP avec des utilisateurs et des groupes, un serveur de messagerie, un reverse proxy HTTP (port hôte 8080, sans TLS dans ce lab) et un système de monitoring. Tous les services seront conteneurisés et orchestrés avec Docker Compose.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une infrastructure multi-services ?

**Définition** : Une infrastructure multi-services est un ensemble de services réseau interconnectes qui fournissent les fonctions essentielles d'un système informatique d'entreprise : resolution de noms (DNS), hébergement web, messagerie, authentification centralisée (LDAP), distribution d'adresses (DHCP) et accès sécurisé (reverse proxy).

**Le problème que l'infrastructure multi-services résout** :

Sans infrastructure organisee, voici les problèmes rencontres :

1. **Services isoles** : Chaque service fonctionne indépendamment. Le serveur web ne sait pas utiliser le DNS interne. Le serveur mail ne connaît pas les utilisateurs LDAP. Il n'y a pas de cohérence.
2. **Pas de vision globale** : Sans monitoring, tu ne sais pas quel service est en panne, surcharge ou mal configure. Tu decouvres les problèmes quand les utilisateurs se plaignent.
3. **Déploiement manuel** : Chaque service est installe et configure a la main. Reconstruire l'infrastructure après une panne prend des heures ou des jours.

**Comment l'infrastructure multi-services résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Services isoles | Les services communiquent via des réseaux dedies et s'appuient les uns sur les autres (DNS, LDAP) |
| Pas de vision globale | Le monitoring centralise l'état de tous les services et envoie des alertes |
| Déploiement manuel | Docker Compose et les fichiers de configuration versionnent toute l'infrastructure |

**Analogie concrète** : Une infrastructure multi-services fonctionne comme une ville. Le DNS est le service des noms de rue (traduit les adresses lisibles en coordonnees). Le serveur web est le centre commercial (fournit les services aux visiteurs). Le LDAP est la mairie (registre des habitants). Le serveur mail est la poste. Le reverse proxy est le rond-point principal (dirige le trafic). Et le monitoring est le centre de surveillance (verifie que tout fonctionne).

---

### Architecture du projet

**Schéma de l'infrastructure** :

```text
                        [Internet / Client]
                              |
                         [Reverse Proxy]
                          Caddy (:80 / hôte 8080)
                         /      |      \
                   [Web]    [Webmail]  [API]
                  Nginx     (futur)   (futur)
                    |
               [DNS Bind9]
                    |
              [LDAP OpenLDAP]
                    |
              [Mail Postfix/Dovecot]
                    |
              [Monitoring]
               Healthcheck
```

**Réseaux Docker** :

| Réseau | Sous-réseau | Services | Role |
| --- | --- | --- | --- |
| `front` | 172.40.0.0/24 | Reverse proxy | Expose aux clients (ports publies) |
| `back` | 172.40.1.0/24 | Web, Mail | Services applicatifs |
| `infra` | 172.40.2.0/24 | DNS, LDAP | Services d'infrastructure |

Le reverse proxy est connecte aux réseaux `front` et `back`. Le serveur web est connecte aux réseaux `back` et `infra`. Cette architecture segmente le trafic et limite la surface d'attaque.

---

### Organisation des fichiers

```text
~/projet-techlab/
├── docker-compose.yml          # Orchestration de tous les services
├── .env                        # Variables d'environnement
├── dns/
│   ├── named.conf              # Configuration Bind9
│   └── zones/
│       ├── db.techlab.local    # Zone directe
│       └── db.172.40           # Zone inverse
├── web/
│   ├── nginx.conf              # Configuration Nginx
│   ├── sites/
│   │   ├── intranet.conf       # Virtual host intranet
│   │   └── docs.conf           # Virtual host documentation
│   └── html/
│       ├── intranet/           # Fichiers du site intranet
│       └── docs/               # Fichiers du site documentation
├── ldap/
│   └── ldifs/
│       ├── 01-ous.ldif         # Unites organisationnelles
│       ├── 02-users.ldif       # Utilisateurs
│       └── 03-groups.ldif      # Groupes
├── mail/
│   └── postfix/
│       └── main.cf             # Configuration Postfix
├── proxy/
│   └── Caddyfile               # Configuration reverse proxy
└── monitoring/
    └── healthcheck.sh          # Script de verification
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Cree toute l'arborescence
mkdir -p ~/projet-techlab/{dns/zones,web/{sites,html/intranet,html/docs},ldap/ldifs,mail/postfix,proxy,monitoring}

# Cree le fichier d'environnement
cat > ~/projet-techlab/.env << 'EOF'
# Domaine de l'entreprise
DOMAIN=techlab.local

# Mot de passe admin LDAP
LDAP_ADMIN_PASSWORD=TechLab2025!

# Sous-reseaux
SUBNET_FRONT=172.40.0.0/24
SUBNET_BACK=172.40.1.0/24
SUBNET_INFRA=172.40.2.0/24
EOF
```

---

### Étape 2 : Configurer le DNS

```bash
# Configuration Bind9
cat > ~/projet-techlab/dns/named.conf << 'EOF'
options {
    directory "/var/cache/bind";
    listen-on { any; };
    listen-on-v6 { none; };
    allow-query { any; };
    recursion yes;
    forwarders { 8.8.8.8; 1.1.1.1; };
    forward first;
    dnssec-validation no;
};

// Journalisation
logging {
    channel default_log {
        stderr;
        severity info;
        print-time yes;
        print-category yes;
    };
    category default { default_log; };
    category queries { default_log; };
};

// Zone directe
zone "techlab.local" {
    type master;
    file "/var/lib/bind/db.techlab.local";
    allow-update { none; };
};

// Zone inverse
zone "40.172.in-addr.arpa" {
    type master;
    file "/var/lib/bind/db.172.40";
    allow-update { none; };
};
EOF

# Zone directe
cat > ~/projet-techlab/dns/zones/db.techlab.local << 'EOF'
$TTL    86400
@       IN      SOA     ns1.techlab.local. admin.techlab.local. (
                        2025040701      ; Serial
                        3600            ; Refresh
                        900             ; Retry
                        604800          ; Expire
                        86400           ; Negative TTL
)

; Serveur de noms
@       IN      NS      ns1.techlab.local.

; Infrastructure
ns1         IN      A       172.40.2.10
ldap        IN      A       172.40.2.20

; Services applicatifs
web         IN      A       172.40.1.10
mail        IN      A       172.40.1.20

; Reverse proxy (point d'entree)
proxy       IN      A       172.40.0.10

; Alias
intranet    IN      CNAME   web.techlab.local.
docs        IN      CNAME   web.techlab.local.
www         IN      CNAME   proxy.techlab.local.

; Mail
@           IN      MX      10      mail.techlab.local.

; SPF
@           IN      TXT     "v=spf1 mx ip4:172.40.1.20 -all"

; DMARC
_dmarc      IN      TXT     "v=DMARC1; p=quarantine; rua=mailto:admin@techlab.local"
EOF

# Zone inverse
cat > ~/projet-techlab/dns/zones/db.172.40 << 'EOF'
$TTL    86400
@       IN      SOA     ns1.techlab.local. admin.techlab.local. (
                        2025040701 3600 900 604800 86400 )

@       IN      NS      ns1.techlab.local.

; Infrastructure (172.40.2.x)
10.2    IN      PTR     ns1.techlab.local.
20.2    IN      PTR     ldap.techlab.local.

; Services (172.40.1.x)
10.1    IN      PTR     web.techlab.local.
20.1    IN      PTR     mail.techlab.local.

; Front (172.40.0.x)
10.0    IN      PTR     proxy.techlab.local.
EOF
```

---

### Étape 3 : Configurer le serveur web

```bash
# Configuration principale Nginx
cat > ~/projet-techlab/web/nginx.conf << 'EOF'
worker_processes auto;
error_log /var/log/nginx/error.log warn;
pid /var/run/nginx.pid;

events {
    worker_connections 1024;
}

http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;

    # Format de log avec IP reelle (transmise par le reverse proxy)
    log_format main '$http_x_real_ip - $remote_user [$time_local] '
                    '"$request" $status $body_bytes_sent '
                    '"$http_referer" "$http_user_agent"';

    access_log /var/log/nginx/access.log main;

    sendfile on;
    keepalive_timeout 65;

    # Inclut les virtual hosts
    include /etc/nginx/conf.d/*.conf;
}
EOF

# Virtual host : intranet
cat > ~/projet-techlab/web/sites/intranet.conf << 'EOF'
server {
    listen 80;
    server_name intranet.techlab.local;

    root /usr/share/nginx/html/intranet;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    # Headers de securite
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

# Virtual host : documentation
cat > ~/projet-techlab/web/sites/docs.conf << 'EOF'
server {
    listen 80;
    server_name docs.techlab.local;

    root /usr/share/nginx/html/docs;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }

    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
}
EOF

# Page intranet
cat > ~/projet-techlab/web/html/intranet/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>TechLab - Intranet</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white;
                     padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #2c3e50; }
        .services { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-top: 20px; }
        .service { padding: 15px; background: #ecf0f1; border-radius: 4px; }
        .service h3 { margin: 0 0 5px 0; color: #2980b9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>TechLab - Intranet</h1>
        <p>Bienvenue sur l'intranet de TechLab.</p>
        <div class="services">
            <div class="service">
                <h3>Documentation</h3>
                <p>Acces a la documentation interne</p>
            </div>
            <div class="service">
                <h3>Messagerie</h3>
                <p>Acces a la messagerie d'entreprise</p>
            </div>
            <div class="service">
                <h3>Annuaire</h3>
                <p>Rechercher un collaborateur</p>
            </div>
            <div class="service">
                <h3>Support</h3>
                <p>Contacter l'equipe technique</p>
            </div>
        </div>
    </div>
</body>
</html>
EOF

# Page documentation
cat > ~/projet-techlab/web/html/docs/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>TechLab - Documentation</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 40px; }
        h1 { color: #2c3e50; }
        ul { line-height: 2; }
    </style>
</head>
<body>
    <h1>TechLab - Documentation technique</h1>
    <ul>
        <li>Guide d'installation des postes de travail</li>
        <li>Procedures de securite</li>
        <li>Configuration VPN</li>
        <li>Politique de mots de passe</li>
    </ul>
</body>
</html>
EOF
```

---

### Étape 4 : Configurer le LDAP

```bash
# Unites organisationnelles
cat > ~/projet-techlab/ldap/ldifs/01-ous.ldif << 'EOF'
dn: ou=personnes,dc=techlab,dc=local
objectClass: organizationalUnit
ou: personnes

dn: ou=groupes,dc=techlab,dc=local
objectClass: organizationalUnit
ou: groupes

dn: ou=services,dc=techlab,dc=local
objectClass: organizationalUnit
ou: services
EOF

# Utilisateurs
cat > ~/projet-techlab/ldap/ldifs/02-users.ldif << 'EOF'
dn: uid=sophie,ou=personnes,dc=techlab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: sophie
cn: Sophie Bernard
sn: Bernard
givenName: Sophie
mail: sophie@techlab.local
userPassword: sophie2025
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/sophie
loginShell: /bin/bash
title: Directrice technique

dn: uid=marc,ou=personnes,dc=techlab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: marc
cn: Marc Lefevre
sn: Lefevre
givenName: Marc
mail: marc@techlab.local
userPassword: marc2025
uidNumber: 1002
gidNumber: 1002
homeDirectory: /home/marc
loginShell: /bin/bash
title: Developpeur senior

dn: uid=julie,ou=personnes,dc=techlab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: julie
cn: Julie Moreau
sn: Moreau
givenName: Julie
mail: julie@techlab.local
userPassword: julie2025
uidNumber: 1003
gidNumber: 1003
homeDirectory: /home/julie
loginShell: /bin/bash
title: Administratrice systeme

dn: uid=thomas,ou=personnes,dc=techlab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: thomas
cn: Thomas Petit
sn: Petit
givenName: Thomas
mail: thomas@techlab.local
userPassword: thomas2025
uidNumber: 1004
gidNumber: 1004
homeDirectory: /home/thomas
loginShell: /bin/bash
title: Stagiaire developpement
EOF

# Groupes
cat > ~/projet-techlab/ldap/ldifs/03-groups.ldif << 'EOF'
dn: cn=direction,ou=groupes,dc=techlab,dc=local
objectClass: groupOfNames
cn: direction
member: uid=sophie,ou=personnes,dc=techlab,dc=local

dn: cn=developpeurs,ou=groupes,dc=techlab,dc=local
objectClass: groupOfNames
cn: developpeurs
member: uid=marc,ou=personnes,dc=techlab,dc=local
member: uid=thomas,ou=personnes,dc=techlab,dc=local

dn: cn=sysadmins,ou=groupes,dc=techlab,dc=local
objectClass: groupOfNames
cn: sysadmins
member: uid=julie,ou=personnes,dc=techlab,dc=local

dn: cn=tous,ou=groupes,dc=techlab,dc=local
objectClass: groupOfNames
cn: tous
member: uid=sophie,ou=personnes,dc=techlab,dc=local
member: uid=marc,ou=personnes,dc=techlab,dc=local
member: uid=julie,ou=personnes,dc=techlab,dc=local
member: uid=thomas,ou=personnes,dc=techlab,dc=local
EOF
```

---

### Étape 5 : Configurer le reverse proxy

```bash
# Caddyfile
cat > ~/projet-techlab/proxy/Caddyfile << 'EOF'
# Intranet
:80 {
    # Route basee sur le header Host
    @intranet host intranet.techlab.local
    handle @intranet {
        reverse_proxy web:80
    }

    # Documentation
    @docs host docs.techlab.local
    handle @docs {
        reverse_proxy web:80
    }

    # Page par defaut
    handle {
        respond "TechLab - Utilisez intranet.techlab.local ou docs.techlab.local" 200
    }

    # Headers de securite globaux
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }

    log {
        output stdout
        format console
    }
}
EOF
```

---

### Étape 6 : Configurer le serveur mail

```bash
# Configuration Postfix minimale
cat > ~/projet-techlab/mail/postfix/main.cf << 'EOF'
myhostname = mail.techlab.local
mydomain = techlab.local
mydestination = $myhostname, $mydomain, localhost
mynetworks = 127.0.0.0/8, 172.16.0.0/12
home_mailbox = Maildir/
smtpd_banner = $myhostname ESMTP
inet_interfaces = all
inet_protocols = ipv4
message_size_limit = 26214400
EOF
```

---

### Étape 7 : Créer le script de monitoring

```bash
cat > ~/projet-techlab/monitoring/healthcheck.sh << 'SCRIPT'
#!/bin/sh
# Script de verification de sante de tous les services
# Usage : ./healthcheck.sh

echo "=== TechLab - Verification de sante ==="
echo "Date : $(date)"
echo ""

ERRORS=0

# Fonction de test
check_service() {
    local name="$1"
    local command="$2"
    if eval "$command" > /dev/null 2>&1; then
        echo "[OK]   $name"
    else
        echo "[FAIL] $name"
        ERRORS=$((ERRORS + 1))
    fi
}

# Tests des services
check_service "DNS (Bind9)" \
    "docker exec techlab-dns dig @127.0.0.1 techlab.local SOA +short"

check_service "LDAP (OpenLDAP)" \
    "docker exec techlab-ldap ldapsearch -x -H ldap://localhost \
     -b dc=techlab,dc=local -D cn=admin,dc=techlab,dc=local \
     -w TechLab2025! '(objectClass=organization)'"

check_service "Web (Nginx)" \
    "docker exec techlab-web curl -sf http://localhost"

check_service "Reverse Proxy (Caddy)" \
    "curl -sf http://localhost:8080"

check_service "Mail (Postfix)" \
    "docker exec techlab-mail postfix status"

echo ""
if [ "$ERRORS" -eq 0 ]; then
    echo "Resultat : Tous les services sont operationnels."
else
    echo "Resultat : $ERRORS service(s) en erreur."
fi

echo ""
echo "=== Statistiques des conteneurs ==="
docker stats --no-stream --format \
    "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}" \
    techlab-dns techlab-ldap techlab-web techlab-proxy techlab-mail 2>/dev/null
SCRIPT

chmod +x ~/projet-techlab/monitoring/healthcheck.sh
```

---

### Étape 8 : Créer le fichier Docker Compose complet

```bash
cat > ~/projet-techlab/docker-compose.yml << 'EOF'
# ===========================================================
# TechLab - Infrastructure multi-services conteneurisee
# ===========================================================
# Demarrage : docker compose up -d
# Arret     : docker compose down
# Monitoring: ./monitoring/healthcheck.sh
# ===========================================================

networks:
  front:
    driver: bridge
    ipam:
      config:
        - subnet: 172.40.0.0/24
  back:
    driver: bridge
    ipam:
      config:
        - subnet: 172.40.1.0/24
  infra:
    driver: bridge
    ipam:
      config:
        - subnet: 172.40.2.0/24

volumes:
  dns-cache:
  ldap-data:
  ldap-config:
  mail-data:

services:
  # ========================================================
  # COUCHE INFRASTRUCTURE
  # ========================================================

  dns:
    image: internetsystemsconsortium/bind9:9.20
    container_name: techlab-dns
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.40.2.10
    volumes:
      - ./dns/named.conf:/etc/bind/named.conf:ro
      - ./dns/zones:/var/lib/bind:ro
      - dns-cache:/var/cache/bind
    healthcheck:
      test: ["CMD", "dig", "@127.0.0.1", "techlab.local", "SOA", "+short"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  # Note : osixia/openldap:1.5.0 est une image de demonstration (2021).
  # Pour la production, utilise osixia/container-openldap ou les paquets officiels.
  ldap:
    image: osixia/openldap:1.5.0
    container_name: techlab-ldap
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.40.2.20
    environment:
      LDAP_ORGANISATION: "TechLab"
      LDAP_DOMAIN: "techlab.local"
      LDAP_ADMIN_PASSWORD: "${LDAP_ADMIN_PASSWORD:-TechLab2025!}"
    volumes:
      - ldap-data:/var/lib/ldap
      - ldap-config:/etc/ldap/slapd.d
    healthcheck:
      test: ["CMD", "ldapsearch", "-x", "-H", "ldap://localhost",
             "-b", "dc=techlab,dc=local",
             "-D", "cn=admin,dc=techlab,dc=local",
             "-w", "TechLab2025!"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

  # ========================================================
  # COUCHE APPLICATIVE
  # ========================================================

  web:
    image: nginx:1.26
    container_name: techlab-web
    restart: unless-stopped
    networks:
      back:
        ipv4_address: 172.40.1.10
      infra: {}
    volumes:
      - ./web/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./web/sites:/etc/nginx/conf.d:ro
      - ./web/html:/usr/share/nginx/html:ro
    depends_on:
      dns:
        condition: service_healthy
    dns:
      - 172.40.2.10
    healthcheck:
      test: ["CMD", "curl", "-sf", "http://localhost"]
      interval: 10s
      timeout: 5s
      retries: 3

  # Note : boky/postfix est une image communautaire (non officielle), usage pedagogique.
  mail:
    image: boky/postfix:latest
    container_name: techlab-mail
    restart: unless-stopped
    networks:
      back:
        ipv4_address: 172.40.1.20
      infra: {}
    environment:
      HOSTNAME: "mail.techlab.local"
      DOMAIN: "techlab.local"
    volumes:
      - ./mail/postfix/main.cf:/etc/postfix/main.cf:ro
      - mail-data:/var/mail
    depends_on:
      dns:
        condition: service_healthy
    dns:
      - 172.40.2.10
    healthcheck:
      test: ["CMD", "postfix", "status"]
      interval: 15s
      timeout: 5s
      retries: 3
      start_period: 20s

  # ========================================================
  # COUCHE FRONTALE
  # ========================================================

  proxy:
    image: caddy:2
    container_name: techlab-proxy
    restart: unless-stopped
    networks:
      front:
        ipv4_address: 172.40.0.10
      back: {}
    ports:
      - "8080:80"
    volumes:
      - ./proxy/Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      web:
        condition: service_healthy
    dns:
      - 172.40.2.10
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1",
             "--spider", "http://localhost:80"]
      interval: 10s
      timeout: 5s
      retries: 3
EOF
```

---

### Étape 9 : Deployer l'infrastructure

```bash
# Place-toi dans le dossier du projet
cd ~/projet-techlab

# Demarre tous les services
docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 9/9
 ✔ Network projet-techlab_front   Created
 ✔ Network projet-techlab_back    Created
 ✔ Network projet-techlab_infra   Created
 ✔ Volume "projet-techlab_dns-cache"    Created
 ✔ Volume "projet-techlab_ldap-data"    Created
 ✔ Volume "projet-techlab_ldap-config"  Created
 ✔ Volume "projet-techlab_mail-data"    Created
 ✔ Container techlab-dns     Healthy
 ✔ Container techlab-ldap    Healthy
 ✔ Container techlab-web     Healthy
 ✔ Container techlab-mail    Started
 ✔ Container techlab-proxy   Started
```

Verifie l'état de tous les services :

```bash
docker compose ps
```

**Résultat attendu** :

```text
NAME            IMAGE                                   STATUS                  PORTS
techlab-dns     internetsystemsconsortium/bind9:9.20    Up (healthy)
techlab-ldap    osixia/openldap:1.5.0                   Up (healthy)
techlab-web     nginx:1.26                              Up (healthy)
techlab-mail    boky/postfix:latest                     Up (healthy)
techlab-proxy   caddy:2                                 Up (healthy)            0.0.0.0:8080->80/tcp
```

---

### Étape 10 : Peupler le LDAP

```bash
# Injecte les unites organisationnelles
docker exec -i techlab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=techlab,dc=local" \
  -w "TechLab2025!" < ~/projet-techlab/ldap/ldifs/01-ous.ldif

# Injecte les utilisateurs
docker exec -i techlab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=techlab,dc=local" \
  -w "TechLab2025!" < ~/projet-techlab/ldap/ldifs/02-users.ldif

# Injecte les groupes
docker exec -i techlab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=techlab,dc=local" \
  -w "TechLab2025!" < ~/projet-techlab/ldap/ldifs/03-groups.ldif
```

**Résultat attendu** :

```text
adding new entry "ou=personnes,dc=techlab,dc=local"
adding new entry "ou=groupes,dc=techlab,dc=local"
adding new entry "ou=services,dc=techlab,dc=local"
adding new entry "uid=sophie,ou=personnes,dc=techlab,dc=local"
adding new entry "uid=marc,ou=personnes,dc=techlab,dc=local"
adding new entry "uid=julie,ou=personnes,dc=techlab,dc=local"
adding new entry "uid=thomas,ou=personnes,dc=techlab,dc=local"
adding new entry "cn=direction,ou=groupes,dc=techlab,dc=local"
adding new entry "cn=developpeurs,ou=groupes,dc=techlab,dc=local"
adding new entry "cn=sysadmins,ou=groupes,dc=techlab,dc=local"
adding new entry "cn=tous,ou=groupes,dc=techlab,dc=local"
```

---

### Étape 11 : Tester tous les services

```bash
echo "=== Test 1 : DNS ==="
docker exec techlab-dns dig @127.0.0.1 web.techlab.local +short
# 172.40.1.10

docker exec techlab-dns dig @127.0.0.1 techlab.local MX +short
# 10 mail.techlab.local.

echo ""
echo "=== Test 2 : LDAP ==="
docker exec techlab-ldap ldapsearch -x -H ldap://localhost \
  -b "ou=personnes,dc=techlab,dc=local" \
  -D "cn=admin,dc=techlab,dc=local" -w "TechLab2025!" \
  "(objectClass=inetOrgPerson)" uid cn title

echo ""
echo "=== Test 3 : LDAP authentification ==="
docker exec techlab-ldap ldapwhoami -x -H ldap://localhost \
  -D "uid=julie,ou=personnes,dc=techlab,dc=local" -w julie2025
# dn:uid=julie,ou=personnes,dc=techlab,dc=local

echo ""
echo "=== Test 4 : Reverse proxy - Intranet ==="
curl -s -H "Host: intranet.techlab.local" http://localhost:8080 | head -5
# <!DOCTYPE html>
# <html lang="fr">
# ...

echo ""
echo "=== Test 5 : Reverse proxy - Documentation ==="
curl -s -H "Host: docs.techlab.local" http://localhost:8080 | head -5
# <!DOCTYPE html>
# <html lang="fr">
# ...

echo ""
echo "=== Test 6 : Headers de securite ==="
curl -sI -H "Host: intranet.techlab.local" http://localhost:8080 | grep -i "x-frame\|x-content\|referrer"
# X-Frame-Options: SAMEORIGIN
# X-Content-Type-Options: nosniff
# Referrer-Policy: strict-origin-when-cross-origin
```

---

### Étape 12 : Executer le monitoring

```bash
# Execute le script de monitoring
~/projet-techlab/monitoring/healthcheck.sh
```

**Résultat attendu** :

```text
=== TechLab - Verification de sante ===
Date : Mon Apr  7 14:30:00 UTC 2025

[OK]   DNS (Bind9)
[OK]   LDAP (OpenLDAP)
[OK]   Web (Nginx)
[OK]   Reverse Proxy (Caddy)
[OK]   Mail (Postfix)

Resultat : Tous les services sont operationnels.

=== Statistiques des conteneurs ===
NAME            CPU %     MEM USAGE / LIMIT     NET I/O
techlab-dns     0.10%     25.4MiB / 8GiB        1.2kB / 800B
techlab-ldap    0.05%     32.1MiB / 8GiB        2.1kB / 1.5kB
techlab-web     0.02%     8.5MiB / 8GiB         500B / 300B
techlab-proxy   0.03%     18.2MiB / 8GiB        3.4kB / 2.8kB
techlab-mail    0.08%     42.3MiB / 8GiB        1.8kB / 1.2kB
```

---

### Étape 13 : Nettoyage

```bash
# Arrete l'infrastructure (conserve les donnees)
cd ~/projet-techlab
docker compose down

# Pour tout supprimer (donnees incluses) :
# docker compose down -v
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` | Demarre toute l'infrastructure |
| `docker compose down` | Arrete l'infrastructure (conserve les volumes) |
| `docker compose ps` | État de tous les services |
| `docker compose logs -f [service]` | Logs en temps réel d'un service |
| `docker compose restart [service]` | Redemarre un service |
| `docker stats --no-stream` | Statistiques CPU/RAM de tous les conteneurs |
| `./monitoring/healthcheck.sh` | Vérification de santé complete |
| `docker compose config` | Valide le fichier Docker Compose |
| `docker network inspect projet-techlab_infra` | Détails d'un réseau Docker |

---

## Pièges Fréquents

### Piège 1 : Ne pas segmenter les réseaux

⚠️ **Problème** : Tu mets tous les services sur le meme réseau Docker. Le reverse proxy, le DNS, le LDAP et le mail sont tous sur le meme réseau. Si un service est compromis, l'attaquant a accès a tous les autres.

✅ **Solution** : Segmente les services en plusieurs réseaux (front, back, infra). Chaque service n'a accès qu'aux réseaux dont il a besoin. Le reverse proxy est sur `front` et `back`, mais pas sur `infra`.

---

### Piège 2 : Mot de passe LDAP en dur dans Docker Compose

⚠️ **Problème** : Tu écris le mot de passe admin LDAP directement dans le `docker-compose.yml`. Toute personne ayant accès au fichier connaît le mot de passe.

✅ **Solution** : Utilise un fichier `.env` (ajoute au `.gitignore`) ou des secrets Docker. Ne commite jamais de mots de passe dans un dépôt git.

```yaml
# ✅ Reference une variable d'environnement
environment:
  LDAP_ADMIN_PASSWORD: "${LDAP_ADMIN_PASSWORD}"
```

---

### Piège 3 : Oublier les health checks

⚠️ **Problème** : Sans health check, `depends_on` se contente de vérifier que le conteneur est demarre, pas que le service est prêt. Le serveur web demarre avant que le DNS soit operationnel.

✅ **Solution** : Définis un `healthcheck` pour chaque service et utilise `condition: service_healthy` dans `depends_on`.

---

### Piège 4 : Volumes non sauvegardes

⚠️ **Problème** : Les données LDAP et les zones DNS sont dans des volumes Docker. Si le disque tombe en panne, tout est perdu.

✅ **Solution** : Mets en place une stratégie de sauvegarde :

```bash
# Sauvegarde les volumes Docker
docker run --rm -v projet-techlab_ldap-data:/data \
  -v ~/backups:/backup alpine \
  tar czf /backup/ldap-data-$(date +%Y%m%d).tar.gz -C /data .
```

---

## Checklist de Validation

- [ ] J'ai deploye une infrastructure complete avec au moins 5 services conteneurises
- [ ] Les réseaux Docker sont segmentes (front, back, infra)
- [ ] Chaque service a un health check fonctionnel
- [ ] Les dépendances de démarrage sont définies avec `depends_on` et `condition: service_healthy`
- [ ] Les données sont persistees dans des volumes nommes
- [ ] Les fichiers de configuration sont montes en lecture seule (`:ro`)
- [ ] Le DNS résout correctement les noms internes
- [ ] Le LDAP contient des utilisateurs et des groupes
- [ ] Le reverse proxy route correctement vers les virtual hosts
- [ ] Le script de monitoring verifie l'état de tous les services

---

## Exercice Pratique

**Énoncé** : Ameliore l'infrastructure TechLab avec les ajouts suivants :

1. Ajoute un troisième site web `status.techlab.local` qui affiche une page HTML avec l'état de chaque service
2. Ajoute un enregistrement DNS pour `status.techlab.local`
3. Configure le reverse proxy pour router vers ce nouveau site
4. Ajoute un utilisateur LDAP `admin-infra` dans le groupe `sysadmins`
5. Envoie un mail de test avec telnet via le conteneur Postfix
6. Ameliore le script de monitoring pour envoyer les résultats dans un fichier de log avec horodatage

**Indications** :

- Créé un nouveau dossier `web/html/status/` avec une page HTML
- Ajoute un virtual host Nginx pour `status.techlab.local`
- Mets a jour la zone DNS et le Caddyfile
- Redemarre les services modifies avec `docker compose restart`

**Résultat attendu** : Les trois sites sont accessibles via le reverse proxy. Le nouvel utilisateur LDAP s'authentifie correctement. Le monitoring genere un fichier de log date.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Page de statut :

```bash
cat > ~/projet-techlab/web/html/status/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>TechLab - Statut</title>
    <style>
        body { font-family: monospace; margin: 40px; background: #1a1a2e; color: #e0e0e0; }
        h1 { color: #0f3460; }
        table { border-collapse: collapse; width: 100%; }
        td, th { padding: 10px; border: 1px solid #333; }
        .ok { color: #00ff41; }
        .fail { color: #ff4444; }
    </style>
</head>
<body>
    <h1>TechLab - Page de statut</h1>
    <table>
        <tr><th>Service</th><th>Statut</th></tr>
        <tr><td>DNS (Bind9)</td><td class="ok">Operationnel</td></tr>
        <tr><td>LDAP (OpenLDAP)</td><td class="ok">Operationnel</td></tr>
        <tr><td>Web (Nginx)</td><td class="ok">Operationnel</td></tr>
        <tr><td>Mail (Postfix)</td><td class="ok">Operationnel</td></tr>
        <tr><td>Proxy (Caddy)</td><td class="ok">Operationnel</td></tr>
    </table>
</body>
</html>
EOF
```

Virtual host Nginx :

```bash
cat > ~/projet-techlab/web/sites/status.conf << 'EOF'
server {
    listen 80;
    server_name status.techlab.local;
    root /usr/share/nginx/html/status;
    index index.html;
    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

Mise a jour de la zone DNS (ajouter dans `db.techlab.local`) :

```text
status  IN      CNAME   web.techlab.local.
```

Mise a jour du Caddyfile :

```bash
cat > ~/projet-techlab/proxy/Caddyfile << 'EOF'
:80 {
    @intranet host intranet.techlab.local
    handle @intranet {
        reverse_proxy web:80
    }

    @docs host docs.techlab.local
    handle @docs {
        reverse_proxy web:80
    }

    @status host status.techlab.local
    handle @status {
        reverse_proxy web:80
    }

    handle {
        respond "TechLab - Utilisez intranet, docs ou status.techlab.local" 200
    }

    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
        Referrer-Policy "strict-origin-when-cross-origin"
        -Server
    }

    log { output stdout; format console }
}
EOF
```

Nouvel utilisateur LDAP :

```bash
cat << 'EOF' | docker exec -i techlab-ldap ldapadd -x \
  -H ldap://localhost -D "cn=admin,dc=techlab,dc=local" -w "TechLab2025!"
dn: uid=admin-infra,ou=personnes,dc=techlab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: admin-infra
cn: Admin Infra
sn: Infra
mail: admin-infra@techlab.local
userPassword: infra2025
uidNumber: 1005
gidNumber: 1005
homeDirectory: /home/admin-infra
loginShell: /bin/bash
EOF

# Ajoute au groupe sysadmins
cat << 'EOF' | docker exec -i techlab-ldap ldapmodify -x \
  -H ldap://localhost -D "cn=admin,dc=techlab,dc=local" -w "TechLab2025!"
dn: cn=sysadmins,ou=groupes,dc=techlab,dc=local
changetype: modify
add: member
member: uid=admin-infra,ou=personnes,dc=techlab,dc=local
EOF
```

Script de monitoring avec log :

```bash
cat > ~/projet-techlab/monitoring/healthcheck.sh << 'SCRIPT'
#!/bin/sh
LOG_DIR=~/projet-techlab/monitoring/logs
mkdir -p "$LOG_DIR"
LOG_FILE="$LOG_DIR/health-$(date +%Y%m%d-%H%M%S).log"

{
    echo "=== TechLab - Verification de sante ==="
    echo "Date : $(date)"
    echo ""
    ERRORS=0
    check_service() {
        if eval "$2" > /dev/null 2>&1; then
            echo "[OK]   $1"
        else
            echo "[FAIL] $1"
            ERRORS=$((ERRORS + 1))
        fi
    }
    check_service "DNS" "docker exec techlab-dns dig @127.0.0.1 techlab.local SOA +short"
    check_service "LDAP" "docker exec techlab-ldap ldapwhoami -x -H ldap://localhost \
        -D cn=admin,dc=techlab,dc=local -w TechLab2025!"
    check_service "Web" "docker exec techlab-web curl -sf http://localhost"
    check_service "Proxy" "curl -sf http://localhost:8080"
    check_service "Mail" "docker exec techlab-mail postfix status"
    echo ""
    echo "Erreurs : $ERRORS"
} | tee "$LOG_FILE"

echo "Log enregistre : $LOG_FILE"
SCRIPT
chmod +x ~/projet-techlab/monitoring/healthcheck.sh
```

Redemarrage :

```bash
cd ~/projet-techlab
docker compose restart web proxy
```

Tests :

```bash
curl -s -H "Host: status.techlab.local" http://localhost:8080 | head -3
docker exec techlab-ldap ldapwhoami -x -H ldap://localhost \
  -D "uid=admin-infra,ou=personnes,dc=techlab,dc=local" -w infra2025
~/projet-techlab/monitoring/healthcheck.sh
```

---

## Pour aller plus loin

### Gérer les secrets avec `secrets:` Docker Compose

Dans ce projet, les mots de passe sont passés via des variables d'environnement ou des fichiers `.env`. Une approche plus sécurisée consiste à utiliser les `secrets:` de Docker Compose, montés en lecture seule dans `/run/secrets/` :

```yaml
services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD_FILE: /run/secrets/postgres_password
    secrets:
      - postgres_password

secrets:
  postgres_password:
    file: ./secrets/postgres_password.txt   # fichier local, mode 0600, hors-repo
```

```bash
# Contenu de ./secrets/postgres_password.txt (jamais commite)
echo "MonMotDePasseSecret" > ./secrets/postgres_password.txt
chmod 0600 ./secrets/postgres_password.txt
```

Le mot de passe est monté dans le conteneur comme fichier - jamais exposé dans les variables d'environnement ni dans `docker inspect`. Le pattern `*_FILE` est supporté par PostgreSQL, MySQL, Redis et d'autres images officielles.

Tu as terminé le cursus Services système. Tu maîtrises maintenant le déploiement et l'administration des principaux services réseau en conteneurs Docker.

Pour continuer ton apprentissage, le cursus [Cloud](../22-cloud/index.md) te permettra de déployer ces services sur des infrastructures cloud (AWS, GCP, Azure) et de découvrir les services managés qui remplacent les services auto-hébergés.

---

## Navigation

← Fiche précédente : **[07 - Conteneurisation des services](07-conteneurisation-services.md)**

→ Fiche suivante : **[09 - Certificats TLS avec Let's Encrypt](09-certificats-letsencrypt.md)**
