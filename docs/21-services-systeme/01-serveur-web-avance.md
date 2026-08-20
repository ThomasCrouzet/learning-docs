---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Serveur web avance : configuration complete de Nginx avec virtual hosts, reverse proxy, SSL/TLS et headers de sécurité."
estimated_time: "90 min"
fiche_number: 1
total_fiches: 9
cursus: "Services système"
---

# 01 - Serveur web avancé

> **En bref** : Tu apprendras a configurer Nginx de maniere complete avec des virtual hosts, un reverse proxy, le chiffrement SSL/TLS et les headers de sécurité. Lecture estimée : 90 min.

## Prérequis

- Savoir utiliser le terminal Linux (naviguer, editer des fichiers, gérer les permissions) - cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md)
- Connaitre les bases des protocoles réseau (TCP/IP, DNS, HTTP) - cursus [Réseaux](../20-reseaux/index.md)
- Savoir utiliser Docker et Docker Compose - cursus [Docker](../01-docker/index.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras configurer Nginx avec plusieurs virtual hosts, mettre en place un reverse proxy vers des applications backend, activer le chiffrement SSL/TLS avec des certificats auto-signes et renforcer la sécurité avec les headers HTTP.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un serveur web ?

**Définition** : Un serveur web est un logiciel qui écoute les requêtes HTTP (ou HTTPS) des clients (navigateurs) et leur renvoie des réponses : pages HTML, fichiers CSS, images, ou données JSON.

**Le problème que les serveurs web résolvent** :

Sans serveur web, voici les problèmes rencontres :

1. **Pas d'accès distant aux fichiers** : Les fichiers HTML restent sur la machine locale. Personne d'autre ne peut les consulter via un navigateur.
2. **Pas de gestion des requêtes simultanees** : Même si tu partages un dossier, il n'y a aucun mécanisme pour gérer des centaines de visiteurs en même temps.
3. **Pas de sécurité** : Sans HTTPS, les données circulent en clair. N'importe qui sur le réseau peut lire les échanges.

**Comment les serveurs web résolvent ces problèmes** :

| Problème | Solution apportée par le serveur web |
| --- | --- |
| Pas d'accès distant | Le serveur écoute sur un port (80 ou 443) et répond aux requêtes de n'importe quel client réseau |
| Pas de gestion des requêtes simultanees | Le serveur gère des milliers de connexions concurrentes grâce a un modèle evenementiel (Nginx) ou multi-processus (Apache) |
| Pas de sécurité | Le serveur supporte HTTPS avec des certificats SSL/TLS pour chiffrer les communications |

**Analogie concrète** : Un serveur web fonctionne comme le guichet d'un bureau de poste. Les clients (navigateurs) arrivent avec une demande (requête HTTP). Le guichetier (serveur web) cherche le colis correspondant (fichier HTML) et le remet au client. Si plusieurs clients arrivent en même temps, le guichetier les fait patienter dans une file d'attente ordonnee.

**Ce qu'un serveur web n'est PAS** :

- Un serveur web n'est pas un serveur d'application. Nginx sert des fichiers statiques et transmet les requêtes dynamiques a un backend (PHP-FPM, Node.js, Python). Il ne execute pas de code applicatif lui-même.
- Un serveur web n'est pas un serveur physique. C'est un logiciel. Plusieurs serveurs web peuvent tourner sur la même machine physique.

**Comparaison Nginx vs Apache** :

| Nginx | Apache |
| --- | --- |
| Modèle evenementiel (un processus gère des milliers de connexions) | Modèle multi-processus (un processus par connexion) |
| Performant pour le contenu statique | Performant avec les modules dynamiques (.htaccess) |
| Configuration centralisée (fichiers de config) | Configuration distribuee (.htaccess par dossier) |
| Reverse proxy natif très performant | Reverse proxy possible mais moins optimise |
| Utilise moins de mémoire sous forte charge | Consomme plus de mémoire sous forte charge |

---

### Qu'est-ce qu'un virtual host ?

**Définition** : Un virtual host (ou server block dans la terminologie Nginx) permet a un seul serveur web de servir plusieurs sites web différents, chacun avec son propre nom de domaine, sur la même machine et la même adresse IP.

**Le problème que les virtual hosts résolvent** :

Sans virtual hosts, voici les problèmes rencontres :

1. **Un serveur = un site** : Pour heberger 10 sites web, tu aurais besoin de 10 machines (ou 10 adresses IP), ce qui est coûteux et gaspille des ressources.
2. **Pas de separation** : Tous les fichiers de tous les sites seraient melanges dans le meme dossier. La maintenance serait un cauchemar.

**Comment les virtual hosts résolvent ces problèmes** :

| Problème | Solution apportée par les virtual hosts |
| --- | --- |
| Un serveur = un site | Un seul serveur Nginx sert plusieurs sites grâce aux directives `server_name` |
| Pas de separation | Chaque virtual host pointe vers un dossier différent (`root`) avec sa propre configuration |

**Analogie concrète** : Les virtual hosts fonctionnent comme les boites aux lettres d'un immeuble. L'immeuble (le serveur) a une seule adresse postale (adresse IP), mais chaque appartement (site web) a sa propre boite aux lettres (virtual host). Le facteur (DNS) sait dans quelle boite déposer chaque lettre grâce au nom sur la boite (nom de domaine).

---

### Qu'est-ce qu'un reverse proxy ?

**Définition** : Un reverse proxy est un serveur intermédiaire qui reçoit les requêtes des clients et les transmet a un ou plusieurs serveurs backend. Le client ne communique jamais directement avec le backend.

**Le problème que le reverse proxy résout** :

Sans reverse proxy, voici les problèmes rencontres :

1. **Exposition directe** : Le serveur applicatif (Node.js, Python, PHP-FPM) est directement accessible depuis Internet, ce qui augmente la surface d'attaque.
2. **Pas de terminaison SSL centralisée** : Chaque application doit gérer ses propres certificats SSL, ce qui complique la maintenance.
3. **Pas de répartition de charge** : Si une application reçoit trop de trafic, il n'y a aucun mécanisme pour distribuer les requêtes entre plusieurs instances.

**Comment le reverse proxy résout ces problèmes** :

| Problème | Solution apportée par le reverse proxy |
| --- | --- |
| Exposition directe | Seul le reverse proxy est expose. Les backends restent sur un réseau interne |
| Pas de terminaison SSL centralisée | Le reverse proxy gère tous les certificats SSL a un seul endroit |
| Pas de répartition de charge | Le reverse proxy distribue les requêtes entre plusieurs backends |

**Analogie concrète** : Un reverse proxy fonctionne comme la reception d'un hôtel. Les clients (visiteurs web) s'adressent a la reception (reverse proxy), qui les dirige vers la bonne chambre (serveur backend). Les clients ne vont jamais directement dans les chambres. La reception gère aussi la sécurité (vérification d'identité = SSL) et la répartition (diriger vers les chambres disponibles = load balancing).

**Ce qu'un reverse proxy n'est PAS** :

- Un reverse proxy n'est pas un proxy classique (forward proxy). Un forward proxy agit au nom du client pour accéder a Internet. Un reverse proxy agit au nom du serveur pour recevoir les requêtes.

---

### Qu'est-ce que SSL/TLS ?

**Définition** : SSL (Secure Sockets Layer) et TLS (Transport Layer Security) sont des protocoles de chiffrement qui securisent les communications entre un client et un serveur. TLS est le successeur de SSL. Quand on dit "SSL" aujourd'hui, on parle en réalité de TLS.

**Le problème que SSL/TLS résout** :

Sans chiffrement, voici les problèmes rencontres :

1. **Écoute passive** : N'importe qui sur le meme réseau peut lire le contenu des échanges HTTP (mots de passe, données personnelles).
2. **Usurpation d'identité** : Sans certificat, tu ne peux pas vérifier que le serveur auquel tu parles est bien celui qu'il prétend être.
3. **Modification des données** : Un attaquant intermédiaire peut modifier les données en transit (injection de code malveillant dans une page web).

**Comment SSL/TLS résout ces problèmes** :

| Problème | Solution apportée par SSL/TLS |
| --- | --- |
| Écoute passive | Les données sont chiffrees. Seuls le client et le serveur peuvent les lire |
| Usurpation d'identité | Le certificat SSL prouve l'identité du serveur |
| Modification des données | L'intégrité des données est verifiee par des sommes de controle cryptographiques |

**Analogie concrète** : SSL/TLS fonctionne comme un courrier recommande scelle. L'enveloppe est scellee (chiffrement) pour que personne ne puisse lire le contenu en transit. Le cachet de cire prouve l'identité de l'expéditeur (certificat). Et si quelqu'un ouvre l'enveloppe, le sceau est brise et le destinataire le sait (intégrité).

---

### Qu'est-ce que les headers de sécurité HTTP ?

**Définition** : Les headers de sécurité HTTP sont des directives envoyées par le serveur dans les en-tetes de réponse HTTP. Ils indiquent au navigateur comment se comporter pour protéger l'utilisateur contre certaines attaques.

**Les headers de sécurité principaux** :

| Header | Role | Exemple |
| --- | --- | --- |
| `X-Frame-Options` | Empeche l'affichage de la page dans une iframe (protection clickjacking) | `DENY` ou `SAMEORIGIN` |
| `X-Content-Type-Options` | Empeche le navigateur de deviner le type MIME | `nosniff` |
| `X-XSS-Protection` | Désactivé explicitement (header déprécié, remplacé par CSP) | `0` |
| `Strict-Transport-Security` | Force le navigateur a utiliser HTTPS pour les visites futures | `max-age=31536000; includeSubDomains` |
| `Content-Security-Policy` | Définit les sources autorisées pour les scripts, images, styles | `default-src 'self'` |
| `Referrer-Policy` | Controle les informations envoyées dans le header Referer | `strict-origin-when-cross-origin` |

> **Note - `X-XSS-Protection` déprécié** : Ce header a été supprimé de Chrome (depuis v78, 2019) et n'a jamais été implémenté par Firefox. Le positionner à `0` le désactive explicitement pour les rares navigateurs legacy qui le liraient encore. La protection contre les attaques XSS doit aujourd'hui reposer exclusivement sur `Content-Security-Policy` (CSP).

---

## Étapes Pratiques

### Étape 1 : Démarrer un conteneur Nginx

Créé un dossier de travail et lance un conteneur Nginx avec Docker.

```bash
# Cree le dossier de travail
mkdir -p ~/lab-nginx/{sites,ssl,html/site1,html/site2}

# Lance un conteneur Nginx avec les volumes necessaires
docker run -d \
  --name lab-nginx \
  -p 8080:80 \
  -p 8443:443 \
  -v ~/lab-nginx/sites:/etc/nginx/conf.d \
  -v ~/lab-nginx/ssl:/etc/nginx/ssl \
  -v ~/lab-nginx/html:/usr/share/nginx/html \
  nginx:1.30
```

**Résultat attendu** :

```text
Unable to find image 'nginx:1.30' locally
1.30: Pulling from library/nginx
...
Status: Downloaded newer image for nginx:1.30
a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0
```

Verifie que le conteneur tourne :

```bash
# Verifie l'etat du conteneur
docker ps --filter name=lab-nginx
```

**Résultat attendu** :

```text
CONTAINER ID   IMAGE       STATUS          PORTS                                      NAMES
a1b2c3d4e5f6   nginx:1.30  Up 10 seconds   0.0.0.0:8080->80/tcp, 0.0.0.0:8443->443/tcp   lab-nginx
```

---

### Étape 2 : Creer deux sites statiques

Créé des pages HTML pour deux sites différents.

```bash
# Page du site 1
cat > ~/lab-nginx/html/site1/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Site 1</title></head>
<body><h1>Bienvenue sur le Site 1</h1><p>Ce site est servi par Nginx.</p></body>
</html>
EOF

# Page du site 2
cat > ~/lab-nginx/html/site2/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Site 2</title></head>
<body><h1>Bienvenue sur le Site 2</h1><p>Ce site est aussi servi par Nginx.</p></body>
</html>
EOF
```

---

### Étape 3 : Configurer les virtual hosts

Créé un fichier de configuration avec deux virtual hosts.

```bash
# Configuration des virtual hosts
cat > ~/lab-nginx/sites/virtual-hosts.conf << 'EOF'
# Virtual host pour site1.local
server {
    listen 80;
    server_name site1.local;

    # Dossier racine du site 1
    root /usr/share/nginx/html/site1;
    index index.html;

    # Journalisation specifique a ce site
    access_log /var/log/nginx/site1.access.log;
    error_log /var/log/nginx/site1.error.log;

    location / {
        # Tente de servir le fichier demande, sinon renvoie 404
        try_files $uri $uri/ =404;
    }
}

# Virtual host pour site2.local
server {
    listen 80;
    server_name site2.local;

    # Dossier racine du site 2
    root /usr/share/nginx/html/site2;
    index index.html;

    access_log /var/log/nginx/site2.access.log;
    error_log /var/log/nginx/site2.error.log;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF
```

Recharge la configuration Nginx sans redémarrer le conteneur :

```bash
# Teste la configuration avant de la recharger
docker exec lab-nginx nginx -t

# Recharge la configuration
docker exec lab-nginx nginx -s reload
```

**Résultat attendu** :

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

---

### Étape 4 : Tester les virtual hosts

Ajoute les noms de domaine locaux dans le fichier `/etc/hosts` de ta machine hôte :

```bash
# Ajoute les entrees DNS locales (necessite sudo)
echo "127.0.0.1 site1.local site2.local" | sudo tee -a /etc/hosts
```

Teste chaque site avec `curl` :

```bash
# Teste le site 1
curl -H "Host: site1.local" http://localhost:8080

# Teste le site 2
curl -H "Host: site2.local" http://localhost:8080
```

**Résultat attendu pour site 1** :

```text
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Site 1</title></head>
<body><h1>Bienvenue sur le Site 1</h1><p>Ce site est servi par Nginx.</p></body>
</html>
```

---

### Étape 5 : Generer un certificat SSL auto-signe

Créé un certificat auto-signe pour activer HTTPS en environnement de test.

```bash
# Genere un certificat auto-signe valide 365 jours
openssl req -x509 -nodes \
  -days 365 \
  -newkey rsa:2048 \
  -keyout ~/lab-nginx/ssl/server.key \
  -out ~/lab-nginx/ssl/server.crt \
  -subj "/C=FR/ST=Rhone/L=Lyon/O=Lab/CN=site1.local"
```

**Résultat attendu** :

```text
Generating a RSA private key
..........+++++
..........+++++
writing new private key to '/home/user/lab-nginx/ssl/server.key'
-----
```

> **Alternative moderne - ECDSA** : RSA 2048 bits est correct, mais ECDSA (P-256) offre une sécurité équivalente avec des clés plus courtes et de meilleures performances TLS. Commande alternative :
>
> ```bash
> openssl ecparam -genkey -name prime256v1 -noout -out ~/lab-nginx/ssl/ec-key.pem
> openssl req -x509 -new -key ~/lab-nginx/ssl/ec-key.pem \
>   -days 365 -out ~/lab-nginx/ssl/ec-cert.pem \
>   -subj "/C=FR/ST=Rhone/L=Lyon/O=Lab/CN=site1.local"
> ```
>
> ECDSA est le choix recommandé pour les nouveaux déploiements en 2026.

---

### Étape 6 : Activer HTTPS avec le certificat

Ajoute un bloc server HTTPS dans la configuration :

```bash
# Configuration HTTPS pour site1.local
cat > ~/lab-nginx/sites/ssl.conf << 'EOF'
server {
    listen 443 ssl;
    server_name site1.local;

    # Chemins vers le certificat et la cle privee
    ssl_certificate /etc/nginx/ssl/server.crt;
    ssl_certificate_key /etc/nginx/ssl/server.key;

    # Protocoles et ciphers recommandes
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html/site1;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
EOF

# Recharge Nginx
docker exec lab-nginx nginx -t && docker exec lab-nginx nginx -s reload
```

Teste la connexion HTTPS :

```bash
# Teste HTTPS (le flag -k ignore l'erreur de certificat auto-signe)
curl -k https://localhost:8443
```

**Résultat attendu** :

```text
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Site 1</title></head>
<body><h1>Bienvenue sur le Site 1</h1><p>Ce site est servi par Nginx.</p></body>
</html>
```

---

### Étape 7 : Configurer le reverse proxy

Créé un backend simple avec Python et configure Nginx comme reverse proxy.

```bash
# Lance un petit serveur HTTP Python dans un conteneur (simule un backend)
docker run -d --name lab-backend -p 9000:8000 python:3.12-slim \
  python -m http.server 8000

# Configuration reverse proxy
cat > ~/lab-nginx/sites/reverse-proxy.conf << 'EOF'
server {
    listen 80;
    server_name app.local;

    location / {
        # Transmet les requetes au serveur backend
        proxy_pass http://host.docker.internal:9000;

        # Transmet les headers originaux au backend
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
EOF

# Ajoute l'entree DNS locale
echo "127.0.0.1 app.local" | sudo tee -a /etc/hosts

# Recharge Nginx
docker exec lab-nginx nginx -t && docker exec lab-nginx nginx -s reload
```

Teste le reverse proxy :

```bash
# Teste l'acces via le reverse proxy
curl -H "Host: app.local" http://localhost:8080
```

**Résultat attendu** :

```text
<!DOCTYPE HTML>
<html lang="en">
<head>
<title>Directory listing for /</title>
</head>
...
```

Tu reçois la page générée par le serveur Python, mais transmise via Nginx.

---

### Étape 8 : Ajouter les headers de sécurité

Ajoute les headers de sécurité dans la configuration Nginx :

```bash
# Configuration avec headers de securite
cat > ~/lab-nginx/sites/security-headers.conf << 'EOF'
# Configuration partagee des headers de securite
# A inclure dans chaque bloc server avec : include /etc/nginx/conf.d/security-headers.conf;

# Empeche l'affichage dans une iframe (protection clickjacking)
add_header X-Frame-Options "SAMEORIGIN" always;

# Empeche le navigateur de deviner le type MIME
add_header X-Content-Type-Options "nosniff" always;

# Force HTTPS pour les 365 prochains jours
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Controle les informations envoyees dans le header Referer
add_header Referrer-Policy "strict-origin-when-cross-origin" always;

# Politique de securite du contenu (restrictive)
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" always;

# Desactive X-XSS-Protection (depreicie depuis Chrome 78/2019 - remplace par CSP)
add_header X-XSS-Protection "0" always;
EOF

# Recharge Nginx
docker exec lab-nginx nginx -t && docker exec lab-nginx nginx -s reload
```

Verifie que les headers sont presents :

```bash
# Affiche les headers de reponse
curl -I -H "Host: site1.local" http://localhost:8080
```

**Résultat attendu** :

```text
HTTP/1.1 200 OK
Server: nginx/1.30
Content-Type: text/html
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Strict-Transport-Security: max-age=31536000; includeSubDomains
Referrer-Policy: strict-origin-when-cross-origin
Content-Security-Policy: default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'
X-XSS-Protection: 0
```

---

### Étape 9 : Nettoyage

```bash
# Arrete et supprime les conteneurs
docker stop lab-nginx lab-backend
docker rm lab-nginx lab-backend

# Supprime les entrees DNS locales (edite manuellement /etc/hosts)
sudo sed -i '/site1.local\|site2.local\|app.local/d' /etc/hosts
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker exec lab-nginx nginx -t` | Teste la syntaxe de la configuration Nginx |
| `docker exec lab-nginx nginx -s reload` | Recharge la configuration sans redémarrer |
| `curl -I http://localhost:8080` | Affiche uniquement les headers de réponse HTTP |
| `curl -k https://localhost:8443` | Requête HTTPS en ignorant les erreurs de certificat |
| `openssl req -x509 -nodes -days 365 -newkey rsa:2048 -keyout key.pem -out cert.pem` | Genere un certificat auto-signe |
| `openssl s_client -connect localhost:8443` | Teste la connexion SSL et affiche le certificat |

---

## Pièges Frequents

### Piège 1 : Oublier de tester la configuration avant de recharger

⚠️ **Problème** : Tu modifies un fichier de configuration et tu recharges Nginx directement. Si la syntaxe est invalide, Nginx refuse de recharger et les logs affichent une erreur que tu ne vois pas.

✅ **Solution** : Toujours exécuter `nginx -t` avant `nginx -s reload`. La commande `-t` verifie la syntaxe sans appliquer les changements.

```bash
# Toujours tester AVANT de recharger
docker exec lab-nginx nginx -t && docker exec lab-nginx nginx -s reload
```

---

### Piège 2 : Confondre root et alias dans les directives de chemin

⚠️ **Problème** : Tu utilises `root /var/www/site;` dans un `location /images/`. Nginx cherche les fichiers dans `/var/www/site/images/` (il ajoute le chemin du location). Si tu voulais pointer vers `/var/www/images/`, les fichiers ne sont pas trouves.

✅ **Solution** : Utilise `root` quand le chemin du location fait partie du chemin sur le disque. Utilise `alias` quand tu veux remplacer complètement le chemin.

```nginx
# Avec root : /images/photo.jpg -> /var/www/site/images/photo.jpg
location /images/ {
    root /var/www/site;
}

# Avec alias : /images/photo.jpg -> /var/www/photos/photo.jpg
location /images/ {
    alias /var/www/photos/;
}
```

---

### Piège 3 : Oublier le trailing slash avec proxy_pass

⚠️ **Problème** : Tu écris `proxy_pass http://backend:3000` sans slash final. Le chemin du `location` est transmis tel quel au backend. Si tu écris `proxy_pass http://backend:3000/`, Nginx remplace le chemin du location par `/`.

✅ **Solution** : Comprends la difference :

```nginx
# Sans slash : /api/users -> backend recoit /api/users
location /api/ {
    proxy_pass http://backend:3000;
}

# Avec slash : /api/users -> backend recoit /users
location /api/ {
    proxy_pass http://backend:3000/;
}
```

---

### Piège 4 : Utiliser un certificat auto-signe en production

⚠️ **Problème** : Tu deploies un site public avec un certificat auto-signe. Les navigateurs affichent un avertissement de sécurité effrayant et les visiteurs fuient.

✅ **Solution** : Les certificats auto-signes servent uniquement pour les tests locaux. En production, utilise Let's Encrypt (gratuit) ou un certificat delivre par une autorité de certification reconnue.

---

## Checklist de Validation

- [ ] Je sais configurer un virtual host Nginx avec `server_name` et `root`
- [ ] Je sais créer plusieurs virtual hosts sur le meme serveur Nginx
- [ ] Je sais configurer Nginx comme reverse proxy avec `proxy_pass`
- [ ] Je sais générer un certificat SSL auto-signe avec `openssl`
- [ ] Je sais activer HTTPS dans Nginx avec `ssl_certificate` et `ssl_certificate_key`
- [ ] Je sais ajouter les headers de sécurité HTTP dans Nginx
- [ ] Je sais tester et recharger la configuration Nginx sans redémarrer le service

---

## Exercice Pratique

**Enonce** : Configure un serveur Nginx qui gère trois virtual hosts :

1. `blog.local` - sert un site statique depuis `/usr/share/nginx/html/blog/`
2. `api.local` - agit comme reverse proxy vers un backend sur le port 5000
3. `secure.local` - sert un site statique en HTTPS avec un certificat auto-signe et tous les headers de sécurité

**Indications** :

- Créé un fichier de configuration par virtual host
- Genere un certificat auto-signe pour `secure.local`
- Ajoute une redirection HTTP vers HTTPS pour `secure.local`
- Teste chaque site avec `curl`

**Résultat attendu** : Les trois sites répondent correctement : `blog.local` en HTTP, `api.local` transmet les requêtes au backend, `secure.local` redirige vers HTTPS et affiche tous les headers de sécurité.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

Créé les dossiers et les pages :

```bash
# Cree les dossiers
mkdir -p ~/lab-nginx/html/blog ~/lab-nginx/html/secure

# Page du blog
cat > ~/lab-nginx/html/blog/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Blog</title></head>
<body><h1>Mon Blog</h1></body>
</html>
EOF

# Page securisee
cat > ~/lab-nginx/html/secure/index.html << 'EOF'
<!DOCTYPE html>
<html lang="fr">
<head><meta charset="UTF-8"><title>Site Securise</title></head>
<body><h1>Site Securise (HTTPS)</h1></body>
</html>
EOF
```

Genere le certificat :

```bash
# Certificat auto-signe pour secure.local
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout ~/lab-nginx/ssl/secure.key \
  -out ~/lab-nginx/ssl/secure.crt \
  -subj "/CN=secure.local"
```

Configuration des trois virtual hosts :

```nginx
# ~/lab-nginx/sites/blog.conf
server {
    listen 80;
    server_name blog.local;
    root /usr/share/nginx/html/blog;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}

# ~/lab-nginx/sites/api.conf
server {
    listen 80;
    server_name api.local;

    location / {
        proxy_pass http://host.docker.internal:5000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# ~/lab-nginx/sites/secure.conf
server {
    listen 80;
    server_name secure.local;
    # Redirige tout le trafic HTTP vers HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name secure.local;

    ssl_certificate /etc/nginx/ssl/secure.crt;
    ssl_certificate_key /etc/nginx/ssl/secure.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    root /usr/share/nginx/html/secure;
    index index.html;

    # Headers de securite
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'" always;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

Tests :

```bash
# Teste le blog
curl -H "Host: blog.local" http://localhost:8080
# Resultat : page HTML du blog

# Teste la redirection HTTPS de secure.local
curl -I -H "Host: secure.local" http://localhost:8080
# Resultat : 301 Moved Permanently -> https://secure.local/

# Teste secure.local en HTTPS
curl -k -I https://localhost:8443
# Resultat : 200 OK avec tous les headers de securite
```

---

## Navigation

→ Fiche suivante : **[02 - Serveur DNS](02-serveur-dns.md)**
