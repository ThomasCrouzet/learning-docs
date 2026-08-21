---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Conteneurisation des services : déployer les services réseau avec Docker Compose, gérer les volumes et les réseaux."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 9
cursus: "Services système"
---

# 07 - Conteneurisation des services

> **En bref** : Tu apprendras à déployer les services réseau étudiés dans les fiches précédentes avec Docker Compose, à gérer les volumes persistants, les réseaux Docker et les dépendances entre services. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [Proxy et reverse proxy](06-proxy-reverse-proxy.md)
- Savoir utiliser Docker et Docker Compose - cursus [Docker](../01-docker/index.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras structurer un fichier `docker-compose.yml` multi-services, configurer les réseaux Docker pour isoler les services, utiliser les volumes pour persister les données, gérer les dépendances et l'ordre de démarrage entre services, et déployer une stack complète DNS + Web + Reverse Proxy.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi conteneuriser les services système ?

**Définition** : La conteneurisation des services système consiste a déployer chaque service réseau (DNS, web, mail, LDAP, DHCP, proxy) dans un conteneur Docker isole, plutôt que de les installer directement sur le système d'exploitation.

**Le problème que la conteneurisation résout** :

Sans conteneurisation, voici les problèmes rencontres :

1. **Conflits de dépendances** : Nginx necessite OpenSSL 1.1 mais Postfix necessite OpenSSL 3.0. Les deux ne peuvent pas coexister sur le meme système.
2. **Installation complexe** : Installer Bind9, Postfix, Dovecot et OpenLDAP sur une meme machine necessite des dizaines de paquets, des fichiers de configuration eparpilles et des heures de travail.
3. **Pas de reproductibilité** : La configuration faite sur une machine ne se reproduit pas facilement sur une autre. Les differences d'OS, de versions de paquets et de configuration entrainent des comportements différents.
4. **Nettoyage difficile** : Desinstaller un service laisse des fichiers de configuration, des utilisateurs système et des dépendances orphelines.

**Comment la conteneurisation résout ces problèmes** :

| Problème | Solution apportée par la conteneurisation |
| --- | --- |
| Conflits de dépendances | Chaque conteneur a ses propres dépendances, isolées des autres |
| Installation complexe | Une seule commande `docker compose up` demarre tous les services |
| Pas de reproductibilité | Le fichier `docker-compose.yml` décrit exactement l'infrastructure. Il fonctionne partout |
| Nettoyage difficile | `docker compose down` supprime tout proprement |

**Analogie concrète** : La conteneurisation fonctionne comme des appartements dans un immeuble. Chaque service (DNS, web, mail) habite dans son propre appartement (conteneur) avec sa propre cuisine et sa propre salle de bain (dépendances). Les appartements partagent les murs porteurs (le noyau Linux) et les parties communes (le réseau Docker), mais chacun est indépendant. Quand un locataire part, l'appartement est vide et prêt pour le suivant.

**Ce que la conteneurisation n'est PAS** :

- La conteneurisation n'est pas de la virtualisation. Un conteneur ne simule pas un ordinateur complet. Il partage le noyau du système hôte, ce qui le rend plus léger et plus rapide qu'une machine virtuelle.
- La conteneurisation n'est pas une solution de sécurité en soi. Les conteneurs ajoutent une couche d'isolation, mais un conteneur mal configure peut être compromis. La sécurité reste une responsabilite du déploiement.

---

### Les réseaux Docker pour les services

**Définition** : Les réseaux Docker permettent de définir comment les conteneurs communiquent entre eux et avec l'extérieur. Pour une infrastructure de services, on crée des réseaux dedies pour isoler les différentes zones.

**Architecture réseau recommandée** :

```text
                    [Internet]
                        |
                   [Reverse Proxy]
                    (reseau front)
                   /      |       \
              [Web]    [API]    [Mail]
                    (reseau back)
                   /      |
              [DNS]    [LDAP]
                    (reseau infra)
                        |
                     [DHCP]
```

**Types de réseaux Docker** :

| Type | Usage | Isolation |
| --- | --- | --- |
| `bridge` (défaut) | Réseau local entre conteneurs | Moyenne (tous les conteneurs du bridge se voient) |
| `bridge` (personnalise) | Réseau dedie pour un groupe de services | Forte (seuls les conteneurs du réseau se voient) |
| `host` | Le conteneur utilise directement le réseau de l'hôte | Aucune (utile pour DHCP) |
| `none` | Pas de réseau | Totale |

---

### Les volumes pour la persistance

**Définition** : Les volumes Docker permettent de stocker les données des services de maniere persistante, indépendamment du cycle de vie des conteneurs. Quand un conteneur est supprime et recree, les données dans les volumes sont conservees.

**Types de données a persister** :

| Donnée | Exemple | Pourquoi persister |
| --- | --- | --- |
| Configuration | `named.conf`, `dhcpd.conf`, `nginx.conf` | Conserver les paramètres après redémarrage |
| Données | Zones DNS, baux DHCP, boites mail, arborescence LDAP | Données metier essentielles |
| Logs | Logs d'accès, logs d'erreur | Diagnostic et audit |
| Certificats | Clés SSL, certificats | Sécurité (ne pas regenerer a chaque démarrage) |

---

### Les dépendances entre services

**Définition** : Les services système ont des dépendances les uns envers les autres. Le serveur web a besoin du DNS pour résoudre les noms. Le serveur mail a besoin du DNS pour les enregistrements MX. Docker Compose permet de définir ces dépendances avec `depends_on` et les health checks.

**Ordre de démarrage recommande** :

```text
1. DNS (independant)
2. LDAP (independant)
3. DHCP (depend du reseau)
4. Serveur web (depend du DNS)
5. Serveur mail (depend du DNS, LDAP)
6. Reverse proxy (depend du serveur web, mail)
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Cree l'arborescence du projet
mkdir -p ~/lab-stack/{dns/zones,web/html,proxy,ldap/ldifs}

# Arborescence finale
# ~/lab-stack/
# ├── docker-compose.yml
# ├── dns/
# │   ├── named.conf
# │   └── zones/
# │       └── db.lab.local
# ├── web/
# │   └── html/
# │       └── index.html
# ├── proxy/
# │   └── Caddyfile
# └── ldap/
#     └── ldifs/
#         └── init.ldif
```

---

### Étape 2 : Créer les fichiers de configuration

Configuration DNS (Bind9) :

```bash
# named.conf
cat > ~/lab-stack/dns/named.conf << 'EOF'
options {
    directory "/var/cache/bind";
    listen-on { any; };
    allow-query { any; };
    recursion yes;
    forwarders { 8.8.8.8; 1.1.1.1; };
    dnssec-validation no;
};

zone "lab.local" {
    type master;
    file "/var/lib/bind/db.lab.local";
    allow-update { none; };
};
EOF

# Zone directe
cat > ~/lab-stack/dns/zones/db.lab.local << 'EOF'
$TTL    86400
@       IN      SOA     ns1.lab.local. admin.lab.local. (
                        2025040701 3600 900 604800 86400 )
@       IN      NS      ns1.lab.local.
ns1     IN      A       172.30.0.10
web     IN      A       172.30.0.20
ldap    IN      A       172.30.0.30
proxy   IN      A       172.30.0.40
www     IN      CNAME   web.lab.local.
@       IN      MX      10 mail.lab.local.
EOF
```

Page web :

```bash
cat > ~/lab-stack/web/html/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Lab Stack</title>
    <style>
        body { font-family: sans-serif; margin: 40px; }
        h1 { color: #333; }
        .status { color: green; font-weight: bold; }
    </style>
</head>
<body>
    <h1>Infrastructure Lab</h1>
    <p>Statut : <span class="status">Tous les services sont operationnels</span></p>
    <ul>
        <li>DNS (Bind9) - Actif</li>
        <li>Web (Nginx) - Actif</li>
        <li>LDAP (OpenLDAP) - Actif</li>
        <li>Reverse Proxy (Caddy) - Actif</li>
    </ul>
</body>
</html>
EOF
```

Configuration Caddy (reverse proxy) :

```bash
cat > ~/lab-stack/proxy/Caddyfile << 'EOF'
:80 {
    # Reverse proxy vers le serveur web
    reverse_proxy web:80

    # Headers de securite
    header {
        X-Frame-Options "SAMEORIGIN"
        X-Content-Type-Options "nosniff"
    }

    log {
        output stdout
    }
}
EOF
```

Fichier LDIF d'initialisation :

```bash
cat > ~/lab-stack/ldap/ldifs/init.ldif << 'EOF'
dn: ou=personnes,dc=lab,dc=local
objectClass: organizationalUnit
ou: personnes

dn: ou=groupes,dc=lab,dc=local
objectClass: organizationalUnit
ou: groupes

dn: uid=admin-web,ou=personnes,dc=lab,dc=local
objectClass: inetOrgPerson
objectClass: posixAccount
uid: admin-web
cn: Administrateur Web
sn: Web
mail: admin-web@lab.local
userPassword: adminweb123
uidNumber: 1001
gidNumber: 1001
homeDirectory: /home/admin-web
loginShell: /bin/bash
EOF
```

---

### Étape 3 : Créer le fichier Docker Compose

```bash
cat > ~/lab-stack/docker-compose.yml << 'EOF'
# Infrastructure multi-services conteneurisee
# Demarrage : docker compose up -d
# Arret : docker compose down

networks:
  # Reseau backend pour la communication entre services
  backend:
    driver: bridge
    ipam:
      config:
        - subnet: 172.30.0.0/24

volumes:
  # Volumes nommes pour la persistance
  dns-cache:
  ldap-data:
  ldap-config:

services:
  # ============================================================
  # Service DNS (Bind9)
  # ============================================================
  dns:
    image: internetsystemsconsortium/bind9:9.20
    container_name: lab-dns
    restart: unless-stopped
    networks:
      backend:
        ipv4_address: 172.30.0.10
    volumes:
      - ./dns/named.conf:/etc/bind/named.conf:ro
      - ./dns/zones:/var/lib/bind:ro
      - dns-cache:/var/cache/bind
    healthcheck:
      test: ["CMD", "dig", "@127.0.0.1", "lab.local", "SOA", "+short"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  # ============================================================
  # Service LDAP (OpenLDAP)
  # Note : osixia/openldap:1.5.0 est une image de demonstration (2021).
  # Pour la production, utilise osixia/container-openldap ou les paquets officiels.
  # ============================================================
  ldap:
    image: osixia/openldap:1.5.0
    container_name: lab-ldap
    restart: unless-stopped
    networks:
      backend:
        ipv4_address: 172.30.0.30
    environment:
      LDAP_ORGANISATION: "Lab Entreprise"
      LDAP_DOMAIN: "lab.local"
      LDAP_ADMIN_PASSWORD: "admin123"
    volumes:
      - ldap-data:/var/lib/ldap
      - ldap-config:/etc/ldap/slapd.d
    healthcheck:
      test: ["CMD", "ldapsearch", "-x", "-H", "ldap://localhost",
             "-b", "dc=lab,dc=local", "-D", "cn=admin,dc=lab,dc=local",
             "-w", "admin123"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

  # ============================================================
  # Service Web (Nginx)
  # ============================================================
  web:
    image: nginx:1.26
    container_name: lab-web
    restart: unless-stopped
    networks:
      backend:
        ipv4_address: 172.30.0.20
    volumes:
      - ./web/html:/usr/share/nginx/html:ro
    depends_on:
      dns:
        condition: service_healthy
    dns:
      - 172.30.0.10
    healthcheck:
      # L'image officielle nginx n'inclut pas curl ni wget.
      # nginx -t vérifie que le binaire répond et que la config est valide.
      test: ["CMD-SHELL", "nginx -t"]
      interval: 10s
      timeout: 5s
      retries: 3

  # ============================================================
  # Reverse Proxy (Caddy)
  # ============================================================
  proxy:
    image: caddy:2
    container_name: lab-proxy
    restart: unless-stopped
    networks:
      backend:
        ipv4_address: 172.30.0.40
    ports:
      - "8080:80"
    volumes:
      - ./proxy/Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      web:
        condition: service_healthy
    dns:
      - 172.30.0.10
    healthcheck:
      test: ["CMD", "wget", "--no-verbose", "--tries=1",
             "--spider", "http://localhost:80"]
      interval: 10s
      timeout: 5s
      retries: 3
EOF
```

---

### Étape 4 : Démarrer la stack

```bash
# Demarre tous les services
cd ~/lab-stack
docker compose up -d
```

**Résultat attendu** :

```text
[+] Running 6/6
 ✔ Network lab-stack_backend    Created
 ✔ Volume "lab-stack_dns-cache" Created
 ✔ Volume "lab-stack_ldap-data" Created
 ✔ Volume "lab-stack_ldap-config" Created
 ✔ Container lab-dns            Healthy
 ✔ Container lab-ldap           Healthy
 ✔ Container lab-web            Healthy
 ✔ Container lab-proxy          Started
```

---

### Étape 5 : Vérifier l'état des services

```bash
# Affiche l'etat de tous les services
docker compose ps
```

**Résultat attendu** :

```text
NAME        IMAGE                                    STATUS                   PORTS
lab-dns     internetsystemsconsortium/bind9:9.20     Up (healthy)
lab-ldap    osixia/openldap:1.5.0                    Up (healthy)
lab-web     nginx:1.26                               Up (healthy)
lab-proxy   caddy:2                                  Up (healthy)             0.0.0.0:8080->80/tcp
```

Tous les services sont en état `healthy`.

---

### Étape 6 : Tester les services

```bash
# Teste le reverse proxy (point d'entree)
curl http://localhost:8080
# Resultat : page HTML "Infrastructure Lab"

# Teste le DNS interne
docker exec lab-dns dig @127.0.0.1 web.lab.local +short
# Resultat : 172.30.0.20

# Teste le LDAP
docker exec lab-ldap ldapsearch -x -H ldap://localhost \
  -b "dc=lab,dc=local" -D "cn=admin,dc=lab,dc=local" -w admin123 \
  "(objectClass=organization)" o
# Resultat : o: Lab Entreprise

# Verifie que le web utilise le DNS interne
docker exec lab-web nslookup dns.lab.local 172.30.0.10
```

---

### Étape 7 : Peupler le LDAP

```bash
# Injecte les donnees initiales dans LDAP
docker exec -i lab-ldap ldapadd -x \
  -H ldap://localhost \
  -D "cn=admin,dc=lab,dc=local" \
  -w admin123 < ~/lab-stack/ldap/ldifs/init.ldif
```

**Résultat attendu** :

```text
adding new entry "ou=personnes,dc=lab,dc=local"

adding new entry "ou=groupes,dc=lab,dc=local"

adding new entry "uid=admin-web,ou=personnes,dc=lab,dc=local"
```

Verifie :

```bash
# Recherche l'utilisateur admin-web
docker exec lab-ldap ldapsearch -x -H ldap://localhost \
  -b "dc=lab,dc=local" -D "cn=admin,dc=lab,dc=local" -w admin123 \
  "(uid=admin-web)" cn mail
```

**Résultat attendu** :

```text
dn: uid=admin-web,ou=personnes,dc=lab,dc=local
cn: Administrateur Web
mail: admin-web@lab.local
```

---

### Étape 8 : Consulter les logs

```bash
# Logs de tous les services
docker compose logs --tail 5

# Logs d'un service specifique
docker compose logs dns --tail 10

# Suivre les logs en temps reel
docker compose logs -f proxy
```

---

### Étape 9 : Arreter et nettoyer

```bash
# Arrete les services (conserve les volumes)
cd ~/lab-stack
docker compose down

# Arrete et supprime les volumes (perd toutes les donnees)
# docker compose down -v
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker compose up -d` | Demarre tous les services en arriere-plan |
| `docker compose down` | Arrete et supprime les conteneurs et réseaux |
| `docker compose ps` | Affiche l'état de tous les services |
| `docker compose logs -f [service]` | Affiche les logs en temps réel |
| `docker compose restart [service]` | Redemarre un service |
| `docker compose exec [service] sh` | Ouvre un shell dans un conteneur |
| `docker compose config` | Valide et affiche la configuration Compose |
| `docker network inspect lab-stack_backend` | Détails du réseau (IP, conteneurs connectes) |
| `docker volume ls` | Liste les volumes Docker |

---

## Pièges Fréquents

### Piège 1 : Ordre de démarrage non garanti

⚠️ **Problème** : Tu utilises `depends_on` sans health check. Le conteneur web demarre avant que le DNS soit prêt a répondre. Les requêtes DNS echouent pendant les premières secondes.

✅ **Solution** : Utilise `depends_on` avec `condition: service_healthy` et définis un `healthcheck` pour chaque service. Docker Compose attend que le health check soit positif avant de démarrer les services dependants.

```yaml
depends_on:
  dns:
    condition: service_healthy
```

---

### Piège 2 : Données perdues au redémarrage

⚠️ **Problème** : Tu utilises `docker compose down -v` et tu perds toutes les données LDAP, les zones DNS et les baux DHCP.

✅ **Solution** : N'utilise `docker compose down -v` que quand tu veux explicitement repartir de zéro. Pour un arrêt normal, utilise `docker compose down` (sans `-v`) qui conserve les volumes.

---

### Piège 3 : Adresses IP hardcodees

⚠️ **Problème** : Tu utilises des adresses IP fixes (`172.30.0.10`) partout dans les configurations. Si le réseau change, tout casse.

✅ **Solution** : Utilise les noms de services Docker (`dns`, `web`, `ldap`) au lieu des adresses IP dans les configurations des services. Docker Compose fournit un DNS interne qui résout automatiquement les noms de services en adresses IP. Réserve les IP fixes uniquement pour le serveur DNS (qui doit être référence par IP dans les directives `dns:`).

```yaml
# ❌ Evite
proxy_pass http://172.30.0.20;

# ✅ Prefere
proxy_pass http://web;
```

---

### Piège 4 : Fichiers de configuration en lecture-écriture

⚠️ **Problème** : Tu montes les fichiers de configuration sans le flag `:ro` (read-only). Un conteneur compromis peut modifier sa propre configuration.

✅ **Solution** : Monte les fichiers de configuration en lecture seule avec `:ro`. Seuls les volumes de données doivent être en lecture-écriture.

```yaml
volumes:
  - ./dns/named.conf:/etc/bind/named.conf:ro    # Config : lecture seule
  - dns-cache:/var/cache/bind                    # Donnees : lecture-ecriture
```

---

## Checklist de Validation

- [ ] Je sais créer un `docker-compose.yml` avec plusieurs services réseau
- [ ] Je sais configurer des réseaux Docker personnalises pour isoler les services
- [ ] Je sais utiliser les volumes pour persister les données
- [ ] Je sais définir les dépendances entre services avec `depends_on` et health checks
- [ ] Je sais démarrer, arrêter et diagnostiquer une stack multi-services
- [ ] Je comprends la difference entre `docker compose down` et `docker compose down -v`
- [ ] Je sais utiliser les noms de services Docker au lieu des adresses IP

---

## Exercice Pratique

**Énoncé** : Créé une stack Docker Compose complete avec :

1. Un serveur DNS (Bind9) pour le domaine `entreprise.local`
2. Un serveur web (Nginx) servant deux sites : `www.entreprise.local` et `api.entreprise.local`
3. Un serveur LDAP (OpenLDAP) avec 3 utilisateurs
4. Un reverse proxy (Caddy) qui route les requêtes vers les bons virtual hosts Nginx
5. Un réseau dedie `infra` pour tous les services
6. Des volumes nommes pour les données LDAP et le cache DNS
7. Des health checks pour chaque service
8. L'ordre de démarrage correct (DNS -> LDAP -> Web -> Proxy)

**Indications** :

- Utilise les fichiers de configuration des fiches précédentes comme base
- Créé deux fichiers de configuration Nginx (un par virtual host)
- Le Caddyfile doit router selon le header `Host`
- Teste chaque service après le démarrage

**Résultat attendu** : `docker compose up -d` demarre tous les services dans le bon ordre. Le reverse proxy route correctement les requêtes vers les bons virtual hosts.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Structure :

```bash
mkdir -p ~/lab-stack-ex/{dns/zones,web/{html-www,html-api,conf},proxy,ldap/ldifs}
```

Configuration DNS :

```bash
cat > ~/lab-stack-ex/dns/named.conf << 'EOF'
options {
    directory "/var/cache/bind";
    listen-on { any; };
    allow-query { any; };
    recursion yes;
    forwarders { 8.8.8.8; };
    dnssec-validation no;
};
zone "entreprise.local" {
    type master;
    file "/var/lib/bind/db.entreprise.local";
};
EOF

cat > ~/lab-stack-ex/dns/zones/db.entreprise.local << 'EOF'
$TTL 86400
@ IN SOA ns1.entreprise.local. admin.entreprise.local. (
    2025040701 3600 900 604800 86400 )
@ IN NS ns1.entreprise.local.
ns1  IN A 172.31.0.10
www  IN A 172.31.0.20
api  IN A 172.31.0.20
ldap IN A 172.31.0.30
EOF
```

Pages web :

```bash
echo '<h1>www.entreprise.local</h1>' > ~/lab-stack-ex/web/html-www/index.html
echo '{"status":"ok","service":"api"}' > ~/lab-stack-ex/web/html-api/index.html
```

Configuration Nginx :

```bash
cat > ~/lab-stack-ex/web/conf/default.conf << 'EOF'
server {
    listen 80;
    server_name www.entreprise.local;
    root /usr/share/nginx/html/www;
    index index.html;
}
server {
    listen 80;
    server_name api.entreprise.local;
    root /usr/share/nginx/html/api;
    index index.html;
    default_type application/json;
}
EOF
```

Caddyfile :

```bash
cat > ~/lab-stack-ex/proxy/Caddyfile << 'EOF'
:80 {
    reverse_proxy web:80
    log { output stdout }
}
EOF
```

Docker Compose :

```yaml
# ~/lab-stack-ex/docker-compose.yml
networks:
  infra:
    driver: bridge
    ipam:
      config:
        - subnet: 172.31.0.0/24

volumes:
  dns-cache:
  ldap-data:
  ldap-config:

services:
  dns:
    image: internetsystemsconsortium/bind9:9.20
    container_name: ex-dns
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.31.0.10
    volumes:
      - ./dns/named.conf:/etc/bind/named.conf:ro
      - ./dns/zones:/var/lib/bind:ro
      - dns-cache:/var/cache/bind
    healthcheck:
      test: ["CMD", "dig", "@127.0.0.1", "entreprise.local", "SOA", "+short"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 10s

  ldap:
    image: osixia/openldap:1.5.0
    container_name: ex-ldap
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.31.0.30
    environment:
      LDAP_ORGANISATION: "Entreprise Lab"
      LDAP_DOMAIN: "entreprise.local"
      LDAP_ADMIN_PASSWORD: "admin123"
    volumes:
      - ldap-data:/var/lib/ldap
      - ldap-config:/etc/ldap/slapd.d
    healthcheck:
      test: ["CMD", "ldapsearch", "-x", "-H", "ldap://localhost",
             "-b", "dc=entreprise,dc=local",
             "-D", "cn=admin,dc=entreprise,dc=local", "-w", "admin123"]
      interval: 10s
      timeout: 5s
      retries: 3
      start_period: 15s

  web:
    image: nginx:1.26
    container_name: ex-web
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.31.0.20
    volumes:
      - ./web/html-www:/usr/share/nginx/html/www:ro
      - ./web/html-api:/usr/share/nginx/html/api:ro
      - ./web/conf/default.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      dns:
        condition: service_healthy
    healthcheck:
      # L'image officielle nginx n'inclut pas curl ni wget.
      test: ["CMD-SHELL", "nginx -t"]
      interval: 10s
      timeout: 5s
      retries: 3

  proxy:
    image: caddy:2
    container_name: ex-proxy
    restart: unless-stopped
    networks:
      infra:
        ipv4_address: 172.31.0.40
    ports:
      - "8080:80"
    volumes:
      - ./proxy/Caddyfile:/etc/caddy/Caddyfile:ro
    depends_on:
      web:
        condition: service_healthy
```

Démarrage et tests :

```bash
cd ~/lab-stack-ex
docker compose up -d

# Teste
curl -H "Host: www.entreprise.local" http://localhost:8080
curl -H "Host: api.entreprise.local" http://localhost:8080

# Nettoyage
docker compose down
```

---

## Navigation

← Fiche précédente : **[06 - Proxy et reverse proxy](06-proxy-reverse-proxy.md)**

→ Fiche suivante : **[08 - Projet intégrateur](08-projet-integrateur.md)**
