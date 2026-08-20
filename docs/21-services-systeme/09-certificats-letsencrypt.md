---
tags:
  - Systèmes
  - Intermédiaire
  - Pratique
description: "Certificats TLS avec Let's Encrypt : problème des certificats auto-signés, protocole ACME, certbot, challenges HTTP-01 et DNS-01, renouvellement automatique et intégration Nginx."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 9
cursus: "Services système"
---

# 09 - Certificats TLS avec Let's Encrypt

> **En bref** : Tu apprendras à obtenir et renouveler automatiquement des certificats TLS gratuits avec Let's Encrypt et certbot, à configurer Nginx pour servir du HTTPS avec un certificat valide, et à comprendre les deux types de challenges ACME. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Serveur web avancé](01-serveur-web-avance.md) pour la configuration Nginx, les virtual hosts et le SSL/TLS avec certificats auto-signés
- Avoir un nom de domaine qui pointe vers ton serveur (enregistrement DNS `A` ou `AAAA`)
- Avoir lu la fiche [02 - Serveur DNS](02-serveur-dns.md) pour comprendre les enregistrements DNS

## Objectif de cette fiche

À la fin de cette fiche, tu sauras obtenir un certificat TLS gratuit signé par Let's Encrypt avec certbot, configurer le renouvellement automatique via un timer systemd, choisir entre le challenge HTTP-01 et DNS-01 selon la situation, et intégrer le certificat dans Nginx.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Le problème des certificats auto-signés

**Définition** : Un certificat auto-signé est un certificat TLS que tu génères toi-même, sans qu'une Autorité de Certification (CA) reconnue ne le valide. La fiche [01 - Serveur web avancé](01-serveur-web-avance.md) couvre leur création. Cette fiche couvre l'étape suivante : obtenir un certificat valide et reconnu.

**Le problème que Let's Encrypt résout** :

Sans certificat signé par une CA reconnue, voici les problèmes rencontrés :

1. **Avertissement navigateur** : Les navigateurs affichent "Connexion non sécurisée" ou "Certificat non valide" pour les certificats auto-signés. Les utilisateurs font face à une page d'erreur alarmante qui les incite à quitter le site.
2. **Absence de confiance** : Les certificats auto-signés ne prouvent pas que tu es bien le propriétaire du domaine. N'importe qui peut en créer un pour n'importe quel nom.
3. **Coût prohibitif** : Avant Let's Encrypt (lancé en 2016), un certificat TLS valide coûtait entre 50 et 500 euros par an selon la CA et le type de certificat.

**Comment Let's Encrypt résout ces problèmes** :

| Problème | Solution apportée par Let's Encrypt |
| --- | --- |
| Avertissement navigateur | Certificat signé par une CA reconnue par tous les navigateurs - aucun avertissement |
| Absence de confiance | Vérification automatique que tu contrôles bien le domaine via le protocole ACME |
| Coût prohibitif | Certificats entièrement gratuits, renouvelables indéfiniment |

**Analogie concrète** : Un certificat auto-signé c'est comme une carte de visite que tu as imprimée toi-même et signée toi-même. Tout le monde peut en faire une. Un certificat Let's Encrypt c'est comme une carte d'identité délivrée par l'État après vérification de ton identité - elle est reconnue partout et impossible à falsifier.

**Ce que Let's Encrypt n'est PAS** :

- Let's Encrypt ne délivre pas de certificats EV. Chrome a retiré le nom d'entreprise de la barre d'adresse (Chrome 77, 2019) : un certificat EV n'affiche plus ce nom dans l'URL. Ne vends pas l'EV comme « confiance visible dans la barre ».
- Let's Encrypt ne garantit pas la sécurité de ton site. Il prouve seulement que tu contrôles le domaine. La sécurité applicative reste ta responsabilité.

---

### Le protocole ACME

**Définition** : ACME (Automatic Certificate Management Environment) est le protocole que certbot et d'autres clients utilisent pour communiquer avec Let's Encrypt et prouver qu'ils contrôlent un domaine.

**Le problème que ACME résout** :

Sans ACME, obtenir un certificat TLS nécessitait de remplir des formulaires, envoyer des pièces justificatives, attendre plusieurs jours et payer. ACME automatise entièrement ce processus.

**Le déroulement d'une émission ACME** :

```text
Client certbot                    Serveur Let's Encrypt (ACME)
      |                                      |
      |--- Demande de certificat pour ------->|
      |    example.com                        |
      |                                      |
      |<-- Défi (challenge) : prouve que -----|
      |    tu contrôles example.com           |
      |                                      |
      |--- Mise en place du défi ------------->|
      |    (fichier HTTP ou enregistrement DNS)|
      |                                      |
      |<-- Vérification du défi --------------|
      |    (Let's Encrypt contacte le serveur)|
      |                                      |
      |--- Défi réussi, voici la CSR -------->|
      |    (Certificate Signing Request)      |
      |                                      |
      |<-- Certificat signé ------------------|
```

---

### Challenge HTTP-01 vs DNS-01

**Définition** : Un "challenge" ACME est la méthode utilisée pour prouver à Let's Encrypt que tu contrôles le domaine pour lequel tu demandes un certificat. Il existe deux challenges principaux.

**Challenge HTTP-01** :

Let's Encrypt demande à ton serveur de rendre accessible un fichier spécifique à une URL précise. Si le fichier est accessible depuis Internet, la preuve de contrôle est établie.

```text
URL vérifiée par Let's Encrypt :
http://example.com/.well-known/acme-challenge/<token>

Contenu du fichier :
<token>.<empreinte_de_la_clé>
```

**Conditions requises pour HTTP-01** :

- Le domaine doit pointer vers l'IP du serveur dans le DNS public
- Le port 80 (HTTP) doit être accessible depuis Internet
- Un serveur web (Nginx, Apache) doit tourner sur ce port

**Challenge DNS-01** :

Let's Encrypt demande de créer un enregistrement DNS TXT spécifique pour le domaine. Si l'enregistrement est présent dans le DNS public, la preuve de contrôle est établie.

```text
Enregistrement DNS à créer :
_acme-challenge.example.com IN TXT "<valeur>"
```

**Conditions requises pour DNS-01** :

- Accès à l'API de ton registrar DNS (ex: Cloudflare, OVH, Gandi)
- Pas besoin que le port 80 soit accessible

**Comparaison HTTP-01 vs DNS-01** :

| Critère | HTTP-01 | DNS-01 |
| --- | --- | --- |
| Facilité de mise en place | Simple (certbot le fait automatiquement) | Nécessite un plugin certbot pour l'API DNS |
| Port 80 requis | Oui | Non |
| Certificats wildcard (`*.example.com`) | Non supporté | Supporté |
| Serveur derrière firewall | Impossible | Possible |
| Usage typique | Serveur web accessible depuis Internet | Wildcard, serveur interne, CDN |

**Quand utiliser DNS-01** :

- Pour obtenir un certificat wildcard (`*.example.com`) qui couvre tous les sous-domaines
- Quand le serveur n'est pas accessible depuis Internet (réseau interne, serveur derrière NAT)
- Quand le port 80 est bloqué par un firewall

---

### Durée de validité et renouvellement

**Définition** : Les certificats Let's Encrypt durent **90 jours** par défaut (profil 45 jours en option depuis 2026). Pour les CA publiques, le plafond CA/B Forum est **200 jours** depuis le 15 mars 2026, plus « 1 à 2 ans ».

**Pourquoi 90 jours ?** :

1. **Rotation automatique** : Forcer le renouvellement régulier limite les risques liés à un certificat compromis.
2. **Réduction de la surface d'attaque** : Un certificat volé devient inutilisable après 90 jours au maximum.
3. **Encouragement à l'automatisation** : Un renouvellement annuel peut être manuel. Un renouvellement mensuel doit être automatisé.

**Recommandation** : Renouveler dès que le certificat a moins de 30 jours de validité. Certbot fait ça automatiquement.

**Renouvellement avec systemd timer** :

Sur Debian 12 / Ubuntu, certbot installe automatiquement un timer systemd :

```bash
# Vérifier que le timer est actif
systemctl status snap.certbot.renew.timer
# ou selon l'installation :
systemctl status certbot.timer
```

Le timer vérifie deux fois par jour si un certificat doit être renouvelé et le renouvelle automatiquement si nécessaire.

---

## Étapes Pratiques

### Étape 1 : Installer certbot sur Debian 12

Certbot est le client officiel Let's Encrypt. Il automatise l'obtention, la configuration et le renouvellement des certificats.

> **Méthode recommandée par Certbot EFF** : installer via snap. Historique : snap est la voie privilégiée par l'EFF depuis 2021. En 2026, c'est toujours le choix le plus simple pour obtenir des mises à jour automatiques. La méthode apt reste fonctionnelle mais peut embarquer un paquet plus ancien.

**Méthode recommandée : snap**

```bash
# Installer snap
sudo apt install snapd -y

# Installer certbot via snap
sudo snap install --classic certbot

# Créer le lien symbolique
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

```bash
# Vérifier la version installée
certbot --version
```

**Résultat attendu** :

```text
certbot 2.x.x
```

**Alternative via apt** (version des dépôts Debian, fonctionnelle sur Debian 12) :

```bash
# Mettre à jour les paquets
sudo apt update

# Installer certbot et le plugin Nginx
sudo apt install certbot python3-certbot-nginx -y
```

---

### Étape 2 : Préparer Nginx pour le challenge HTTP-01

Avant de demander un certificat, il faut que Nginx soit configuré pour servir le répertoire de challenge ACME.

```bash
# Vérifier que Nginx est actif
sudo systemctl status nginx
```

```bash
# Créer le répertoire pour les challenges
sudo mkdir -p /var/www/letsencrypt/.well-known/acme-challenge
```

Ajouter le bloc suivant dans la configuration Nginx de ton site (dans `/etc/nginx/sites-available/example.com`) :

```nginx
server {
    listen 80;
    server_name example.com www.example.com;

    # Répertoire pour les challenges ACME (Let's Encrypt)
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;    # Certbot dépose ici le fichier de preuve
        allow all;                     # Accessible depuis Internet (Let's Encrypt doit le lire)
    }

    # Rediriger tout le reste vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}
```

```bash
# Vérifier la syntaxe Nginx
sudo nginx -t
```

**Résultat attendu** :

```text
nginx: the configuration file /etc/nginx/nginx.conf syntax is ok
nginx: configuration file /etc/nginx/nginx.conf test is successful
```

```bash
# Recharger Nginx
sudo systemctl reload nginx
```

---

### Étape 3 : Obtenir un certificat avec le challenge HTTP-01

```bash
# Obtenir un certificat pour example.com et www.example.com
# --nginx : certbot configure Nginx automatiquement
# -d : domaine(s) à couvrir (peut être répété)
sudo certbot --nginx -d example.com -d www.example.com
```

Certbot te pose quelques questions interactives :

```text
Saving debug log to /var/log/letsencrypt/letsencrypt.log
Enter email address (used for urgent renewal and security notices)
(Enter 'c' to cancel): ton@email.com

Please read the Terms of Service at [URL]
You must agree in order to register with the ACME server. Do you agree?
(Y)es/(N)o: Y

Would you be willing, once your first certificate is issued, to share your
email address with the Electronic Frontier Foundation?
(Y)es/(N)o: N
```

**Résultat attendu** :

```text
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/example.com/privkey.pem
This certificate expires on 2025-09-15.
These files will be updated when the certificate renews.
```

Certbot modifie automatiquement la configuration Nginx pour activer HTTPS avec le nouveau certificat.

---

### Étape 4 : Obtenir un certificat avec le challenge DNS-01 (Cloudflare)

Cette méthode est utile pour les certificats wildcard ou les serveurs sans accès HTTP depuis Internet.

```bash
# Installer le plugin Cloudflare pour certbot
sudo apt install python3-certbot-dns-cloudflare -y
```

```bash
# Créer le fichier de credentials Cloudflare
sudo mkdir -p /etc/letsencrypt/secrets
sudo nano /etc/letsencrypt/secrets/cloudflare.ini
```

Contenu du fichier `/etc/letsencrypt/secrets/cloudflare.ini` :

```text
# Token API Cloudflare avec permission "Zone:DNS:Edit"
dns_cloudflare_api_token = ton_token_cloudflare_ici
```

```bash
# Sécuriser le fichier (lisible uniquement par root)
sudo chmod 600 /etc/letsencrypt/secrets/cloudflare.ini
```

```bash
# Obtenir un certificat wildcard via DNS-01
sudo certbot certonly \
  --dns-cloudflare \
  --dns-cloudflare-credentials /etc/letsencrypt/secrets/cloudflare.ini \
  -d example.com \
  -d "*.example.com"
```

**Résultat attendu** :

```text
Successfully received certificate.
Certificate is saved at: /etc/letsencrypt/live/example.com/fullchain.pem
Key is saved at:         /etc/letsencrypt/live/example.com/privkey.pem
```

Le certificat `*.example.com` couvre tous les sous-domaines : `api.example.com`, `blog.example.com`, etc.

---

### Étape 5 : Vérifier et configurer Nginx manuellement

Certbot modifie la configuration Nginx automatiquement avec `--nginx`. Si tu préfères contrôler la configuration manuellement, utilise `certonly` puis configure Nginx toi-même.

Configuration Nginx complète avec certificat Let's Encrypt :

```nginx
# Bloc HTTP : redirige vers HTTPS
server {
    listen 80;
    server_name example.com www.example.com;

    # Nécessaire pour le renouvellement HTTP-01
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }

    # Redirection permanente vers HTTPS
    location / {
        return 301 https://$host$request_uri;
    }
}

# Bloc HTTPS : sert le site avec TLS
server {
    listen 443 ssl;
    server_name example.com www.example.com;

    # Certificat Let's Encrypt (mis à jour automatiquement par certbot)
    ssl_certificate     /etc/letsencrypt/live/example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/example.com/privkey.pem;

    # Options TLS recommandées par Let's Encrypt
    include /etc/letsencrypt/options-ssl-nginx.conf;
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem;

    # En-têtes de sécurité
    add_header Strict-Transport-Security "max-age=31536000" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-Frame-Options "SAMEORIGIN" always;

    # Contenu du site
    root /var/www/example.com;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# Tester la configuration
sudo nginx -t
```

```bash
# Recharger Nginx
sudo systemctl reload nginx
```

---

### Étape 6 : Vérifier le renouvellement automatique

```bash
# Vérifier que le timer certbot est actif
systemctl list-timers | grep certbot
```

**Résultat attendu** :

```text
Mon 2025-06-16 05:27:00 UTC  11h left  Sun 2025-06-15 17:27:00 UTC  6h ago  snap.certbot.renew.timer
```

```bash
# Tester le renouvellement sans effectuer de changement
sudo certbot renew --dry-run
```

**Résultat attendu** :

```text
Simulating renewal of an existing certificate for example.com and www.example.com
...
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/example.com/fullchain.pem (success)
```

Si le dry-run réussit, le renouvellement automatique est correctement configuré.

```bash
# Vérifier la date d'expiration du certificat
sudo certbot certificates
```

**Résultat attendu** :

```text
Found the following certs:
  Certificate Name: example.com
    Domains: example.com www.example.com
    Expiry Date: 2025-09-15 12:00:00+00:00 (VALID: 89 days)
    Certificate Path: /etc/letsencrypt/live/example.com/fullchain.pem
    Private Key Path: /etc/letsencrypt/live/example.com/privkey.pem
```

---

### Étape 7 : Vérifier le certificat dans le navigateur et en ligne de commande

```bash
# Vérifier le certificat TLS d'un site avec openssl
openssl s_client -connect example.com:443 -servername example.com < /dev/null 2>/dev/null | openssl x509 -noout -text | grep -E "Subject:|Issuer:|Not Before:|Not After:"
```

**Résultat attendu** :

```text
            Issuer: C=US, O=Let's Encrypt, CN=R10
            Subject: CN=example.com
            Not Before: Jun 16 12:00:00 2025 GMT
            Not After : Sep 14 12:00:00 2025 GMT
```

L'émetteur (`Issuer`) doit être "Let's Encrypt" et non ton propre nom (ce qui indiquerait un certificat auto-signé).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `sudo certbot --nginx -d <domaine>` | Obtenir un certificat et configurer Nginx automatiquement |
| `sudo certbot certonly --nginx -d <domaine>` | Obtenir un certificat sans modifier Nginx |
| `sudo certbot certificates` | Lister tous les certificats gérés par certbot |
| `sudo certbot renew --dry-run` | Tester le renouvellement sans modifier les fichiers |
| `sudo certbot renew` | Forcer le renouvellement immédiat |
| `sudo certbot delete --cert-name <nom>` | Supprimer un certificat |
| `systemctl list-timers \| grep certbot` | Vérifier le timer de renouvellement automatique |
| `openssl s_client -connect <domaine>:443` | Inspecter le certificat TLS d'un serveur |
| `sudo nginx -t` | Tester la syntaxe de la configuration Nginx |
| `sudo systemctl reload nginx` | Recharger Nginx sans coupure de service |

---

## Pièges Fréquents

### Piège 1 : Le domaine ne pointe pas vers le serveur

⚠️ **Problème** : Certbot échoue avec une erreur du type `DNS problem: NXDOMAIN looking up A for example.com` ou `Connection refused on port 80`.

✅ **Solution** : Vérifie que :

1. L'enregistrement DNS `A` (ou `AAAA`) de ton domaine pointe bien vers l'IP de ton serveur
2. La propagation DNS est terminée (peut prendre jusqu'à 48 heures)
3. Le port 80 est ouvert dans le firewall

```bash
# Vérifier où pointe le domaine
dig A example.com

# Vérifier que le port 80 est accessible depuis l'extérieur
curl -I http://example.com/.well-known/acme-challenge/test
```

---

### Piège 2 : Renouveler sans recharger Nginx

⚠️ **Problème** : Le certificat est renouvelé automatiquement mais Nginx continue à servir l'ancien certificat expiré.

✅ **Solution** : Certbot doit recharger Nginx après le renouvellement. Vérifier que le hook de post-renouvellement est en place :

```bash
# Certbot avec le plugin Nginx gère ça automatiquement
# Pour une configuration manuelle, ajouter un hook :
sudo nano /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

Contenu du fichier :

```bash
#!/bin/bash
# Recharge Nginx après chaque renouvellement de certificat
systemctl reload nginx
```

```bash
# Rendre le script exécutable
sudo chmod +x /etc/letsencrypt/renewal-hooks/post/reload-nginx.sh
```

---

### Piège 3 : Dépasser la limite de rate limiting de Let's Encrypt

⚠️ **Problème** : Certbot échoue avec `too many certificates already issued for exact set of domains`.

✅ **Solution** : Let's Encrypt limite à 5 certificats identiques par semaine. En phase de test, utilise le serveur de staging :

```bash
# Utiliser le serveur de staging (certificats non valides mais sans limite)
sudo certbot --nginx --staging -d example.com

# Une fois les tests validés, obtenir le vrai certificat
sudo certbot delete --cert-name example.com
sudo certbot --nginx -d example.com
```

---

### Piège 4 : Oublier de renouveler le certificat

⚠️ **Problème** : Le certificat expire et le site devient inaccessible avec une erreur "NET::ERR_CERT_DATE_INVALID".

✅ **Solution** :

1. Vérifier que le timer systemd est actif : `systemctl is-enabled certbot.timer`
2. Activer le timer s'il est désactivé : `sudo systemctl enable --now certbot.timer`
3. Configurer une alerte email dans certbot (le premier paramètre lors de l'installation)

```bash
# Vérifier l'expiration de tous les certificats
sudo certbot certificates | grep "Expiry Date"
```

---

### Piège 5 : Confondre fullchain.pem et cert.pem

⚠️ **Problème** : Tu utilises `cert.pem` dans Nginx et certains clients reçoivent des erreurs de certificat intermédiaire.

✅ **Solution** : Utilise toujours `fullchain.pem` comme certificat dans Nginx. Ce fichier contient le certificat du serveur **et** la chaîne de certification intermédiaire. `cert.pem` ne contient que le certificat du serveur, ce qui peut causer des erreurs avec certains clients.

```nginx
# Incorrect
ssl_certificate /etc/letsencrypt/live/example.com/cert.pem;

# Correct
ssl_certificate /etc/letsencrypt/live/example.com/fullchain.pem;
```

---

## Checklist de Validation

- [ ] J'ai installé certbot sur mon serveur Debian 12
- [ ] J'ai obtenu un certificat Let's Encrypt valide pour mon domaine
- [ ] Mon site répond en HTTPS sans avertissement navigateur
- [ ] La configuration Nginx utilise `fullchain.pem` et `privkey.pem`
- [ ] Le timer de renouvellement automatique est actif (`systemctl list-timers | grep certbot`)
- [ ] Le dry-run de renouvellement réussit (`certbot renew --dry-run`)
- [ ] Je comprends la différence entre challenge HTTP-01 et DNS-01
- [ ] Je sais vérifier la date d'expiration d'un certificat avec `certbot certificates`

---

## Exercice Pratique

**Énoncé** : Tu dois sécuriser un site Nginx avec un certificat Let's Encrypt valide sur un serveur Debian 12 accessible depuis Internet.

**Prérequis pour l'exercice** :

- Un nom de domaine dont tu contrôles le DNS (ex: `mosite.example.com`)
- Un serveur Debian 12 avec Nginx installé
- Le DNS configuré pour pointer vers l'IP du serveur

**Étapes à réaliser** :

1. Installe certbot et le plugin Nginx
2. Obtiens un certificat pour ton domaine avec le challenge HTTP-01
3. Vérifie que le site répond en HTTPS sans avertissement
4. Affiche la date d'expiration du certificat avec `certbot certificates`
5. Lance un dry-run de renouvellement et confirme qu'il réussit

**Indications** :

- Utilise `sudo certbot --nginx -d ton-domaine.com` pour tout faire en une commande
- Si tu n'as pas de serveur accessible depuis Internet, utilise le flag `--staging` pour tester sans dépenser tes quotas
- Pour vérifier le certificat depuis la ligne de commande : `openssl s_client -connect ton-domaine.com:443 < /dev/null | head -20`

**Résultat attendu** : Ton site répond en HTTPS avec un cadenas vert dans le navigateur et le certificat est signé par "Let's Encrypt".

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1 : Installation de certbot**

```bash
sudo apt update && sudo apt install certbot python3-certbot-nginx -y
certbot --version
```

**Étape 2 : Obtention du certificat**

```bash
sudo certbot --nginx -d mosite.example.com
```

Certbot demande un email pour les notifications d'expiration, puis gère le challenge HTTP-01 automatiquement et modifie la configuration Nginx.

**Étape 3 : Vérification HTTPS**

```bash
curl -I https://mosite.example.com
```

```text
HTTP/2 200
server: nginx/1.26.0
...
```

Aucun avertissement, le site répond en HTTPS.

**Étape 4 : Date d'expiration**

```bash
sudo certbot certificates
```

```text
Certificate Name: mosite.example.com
  Domains: mosite.example.com
  Expiry Date: 2025-09-15 12:00:00+00:00 (VALID: 89 days)
```

**Étape 5 : Dry-run de renouvellement**

```bash
sudo certbot renew --dry-run
```

```text
Congratulations, all simulated renewals succeeded:
  /etc/letsencrypt/live/mosite.example.com/fullchain.pem (success)
```

Le renouvellement automatique est opérationnel. Le timer systemd s'en chargera avant l'expiration.

---

## Navigation

← Fiche précédente : **[08 - Projet intégrateur](08-projet-integrateur.md)**

Tu as terminé le cursus Services système. Tu maîtrises maintenant le déploiement et l'administration des principaux services réseau en conteneurs Docker, avec des certificats TLS valides.

Pour continuer ton apprentissage, le cursus [Cloud](../22-cloud/index.md) te permettra de déployer ces services sur des infrastructures cloud (AWS, GCP, Azure) et de découvrir les services managés qui remplacent les services auto-hébergés.
