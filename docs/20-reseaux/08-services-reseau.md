---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "Services réseau : HTTP/HTTPS, SSH, FTP/SFTP, SMTP/IMAP, NTP, SNMP - protocoles et fonctionnement."
estimated_time: "60 min"
fiche_number: 8
total_fiches: 14
cursus: "Réseaux"
---

# 08 - Services réseau

> **En bref** : Tu découvriras comment fonctionnent les principaux services réseau (HTTP/HTTPS, SSH, FTP/SFTP, SMTP/IMAP, NTP, SNMP), sur quels ports ils opèrent et comment les tester depuis la ligne de commande. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [07 - Firewalls et filtrage](07-firewalls-filtrage.md)
- Connaître les bases de TCP/IP (adresses IP, ports, protocoles TCP et UDP)
- Savoir utiliser un terminal Linux

## Objectif de cette fiche

À la fin de cette fiche, tu sauras identifier les services réseau courants, comprendre leur fonctionnement, connaître leurs ports par défaut et les tester avec des commandes en ligne.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un service réseau ?

**Définition** : Un service réseau est un programme qui écoute sur un port TCP ou UDP et répond aux requêtes des clients selon un protocole spécifique. Il fonctionne en mode client-serveur : le serveur attend les connexions, le client les initie.

**Le problème que les services réseau résolvent** :

Sans services réseau, voici les problèmes rencontres :

1. **Pas de communication standardisee** : Chaque application invente son propre format d'échange. Deux logiciels de deux editeurs différents ne peuvent pas communiquer.
2. **Pas d'interopérabilité** : Un navigateur ne pourrait pas afficher un site web heberge sur un serveur d'un autre système d'exploitation.
3. **Pas de specialisation** : Chaque application devrait gérer elle-même le transfert de fichiers, l'envoi d'e-mails, la synchronisation de l'heure, etc.

**Comment les services réseau résolvent ces problèmes** :

| Problème | Solution apportée par les services réseau |
| --- | --- |
| Pas de communication standardisee | Chaque service utilise un protocole normalise (RFC) |
| Pas d'interopérabilité | Les protocoles sont indépendants du système d'exploitation |
| Pas de specialisation | Chaque service se concentre sur une seule fonction |

**Analogie concrète** : Les services réseau sont comme les différents guichets d'une mairie. Le guichet "État civil" (HTTP) delivre des documents. Le guichet "Courrier" (SMTP) envoie et reçoit du courrier. Le guichet "Archives" (FTP) permet de déposer et récupérer des documents. Chaque guichet a son numéro (port) et ses procédures (protocole).

**Resume des ports par défaut** :

| Service | Protocole | Port | Transport |
| --- | --- | --- | --- |
| HTTP | Web non chiffre | 80 | TCP |
| HTTPS | Web chiffre (TLS) | 443 | TCP |
| SSH | Accès distant sécurisé | 22 | TCP |
| FTP | Transfert de fichiers | 21 (controle), 20 (données) | TCP |
| SFTP | Transfert de fichiers sécurisé | 22 (via SSH) | TCP |
| SMTP | Envoi d'e-mails | 25 (non chiffre), 587 (TLS) | TCP |
| IMAP | Lecture d'e-mails | 143 (non chiffre), 993 (TLS) | TCP |
| POP3 | Telechargement d'e-mails | 110 (non chiffre), 995 (TLS) | TCP |
| NTP | Synchronisation de l'heure | 123 | UDP |
| SNMP | Supervision d'équipements | 161 (requêtes), 162 (traps) | UDP |
| DNS | Resolution de noms | 53 | TCP/UDP |

---

### Qu'est-ce que HTTP/HTTPS ?

**Définition** : HTTP (HyperText Transfer Protocol) est le protocole de communication entre un navigateur web (client) et un serveur web. HTTPS est la version sécurisée qui chiffre les échanges avec TLS (Transport Layer Security).

**Le problème que HTTP/HTTPS résout** :

Sans HTTP, voici les problèmes rencontres :

1. **Pas de standard pour le web** : Chaque serveur web utiliserait son propre format de requête et de réponse. Les navigateurs devraient être programmes specifiquement pour chaque serveur.
2. **Pas de sécurité (HTTP seul)** : Les données circulent en clair sur le réseau. N'importe qui peut lire les mots de passe, les numéros de carte bancaire ou les cookies de session.

**Comment HTTP/HTTPS résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de standard pour le web | HTTP définit un format de requête (GET, POST, PUT, DELETE) et de réponse (codes 200, 404, 500) |
| Pas de sécurité | HTTPS ajoute une couche TLS qui chiffre toutes les données entre le client et le serveur |

**Fonctionnement d'une requête HTTP** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-08-services-reseau-1.html">Qu&#x27;est-ce que HTTP/HTTPS ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-08-services-reseau-1.html" title="Qu&#x27;est-ce que HTTP/HTTPS ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que SSH ?

**Définition** : SSH (Secure Shell) est un protocole de communication sécurisé qui permet de se connecter a distance a un serveur et d'exécuter des commandes. Toutes les données sont chiffrees.

**Le problème que SSH résout** :

Sans SSH, voici les problèmes rencontres :

1. **Telnet en clair** : Avant SSH, Telnet était utilise pour l'accès distant. Les mots de passe et les commandes circulaient en clair sur le réseau.
2. **Pas d'authentification forte** : Telnet ne supporte que l'authentification par mot de passe. Pas de clés cryptographiques.

**Comment SSH résout ces problèmes** :

| Problème | Solution apportée par SSH |
| --- | --- |
| Données en clair | Chiffrement de bout en bout de toute la session |
| Pas d'authentification forte | Support des clés publiques/privées en plus des mots de passe |

**Ce que SSH n'est PAS** :

- SSH n'est pas un VPN. Il créé un tunnel chiffre pour une seule connexion, pas pour tout le trafic réseau.
- SSH n'est pas un protocole de transfert de fichiers. Mais il sert de base a SFTP et SCP qui transferent des fichiers de maniere sécurisée.

---

### Qu'est-ce que FTP/SFTP ?

**Définition** : FTP (File Transfer Protocol) est un protocole de transfert de fichiers. SFTP (SSH File Transfer Protocol) est sa version sécurisée qui fonctionne par-dessus SSH.

**Le problème que FTP/SFTP résout** :

Sans FTP/SFTP, voici les problèmes rencontres :

1. **Pas de protocole dedie au transfert** : Copier un fichier entre deux machines necessite un support physique (clé USB) ou un protocole non prévu pour cela.
2. **Pas de reprise de transfert** : Si la connexion est coupee pendant le transfert d'un gros fichier, il faut tout recommencer.

**Comparaison FTP vs SFTP** :

| FTP | SFTP |
| --- | --- |
| Données et mots de passe en clair | Tout est chiffre via SSH |
| Deux ports (20 et 21) | Un seul port (22) |
| Modes actif et passif (complexe pour les firewalls) | Un seul mode (simple pour les firewalls) |
| Protocole historique, de moins en moins utilise | Standard recommande aujourd'hui |

---

### Qu'est-ce que SMTP/IMAP ?

**Définition** : SMTP (Simple Mail Transfer Protocol) est le protocole d'envoi d'e-mails entre serveurs. IMAP (Internet Message Access Protocol) est le protocole de lecture d'e-mails depuis un client.

**Le problème que SMTP/IMAP résolvent** :

Sans ces protocoles, voici les problèmes rencontres :

1. **Pas d'envoi standardise** : Chaque système de messagerie utiliserait son propre format. Un e-mail envoyé depuis Gmail ne pourrait pas atteindre Outlook.
2. **Pas d'accès multi-appareils** : Sans IMAP, les e-mails sont telecharges et supprimes du serveur (comme POP3). Tu ne peux pas les lire depuis un autre appareil.

**Parcours d'un e-mail** :

<div class="diagram-design">
<p><a href="../../diagrams/20-reseaux-08-services-reseau-2.html">Qu&#x27;est-ce que SMTP/IMAP ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/20-reseaux-08-services-reseau-2.html" title="Qu&#x27;est-ce que SMTP/IMAP ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que NTP ?

**Définition** : NTP (Network Time Protocol) est un protocole de synchronisation de l'heure entre machines via le réseau. Il permet de maintenir une horloge precise a quelques millisecondes pres.

**Le problème que NTP résout** :

Sans NTP, voici les problèmes rencontres :

1. **Horloges desynchronisees** : Chaque machine a sa propre horloge matérielle qui derive legerement. Après quelques jours, les machines d'un réseau ont des heures différentes.
2. **Logs incoherents** : Les logs de plusieurs serveurs ne sont pas correles temporellement. Impossible de reconstituer la chronologie d'un incident.
3. **Certificats invalides** : Les certificats TLS ont des dates de validité. Une horloge decalee peut rendre un certificat valide "expire" ou accepter un certificat revoque.

---

### Qu'est-ce que SNMP ?

**Définition** : SNMP (Simple Network Management Protocol) est un protocole de supervision qui permet de collecter des informations sur les équipements réseau (routeurs, switchs, serveurs, imprimantes) et de les contrôler a distance.

**Le problème que SNMP résout** :

Sans SNMP, voici les problèmes rencontres :

1. **Pas de supervision unifiee** : Chaque équipement a sa propre interface d'administration. Pour vérifier l'état de 50 switchs, tu dois te connecter a chacun individuellement.
2. **Pas d'alertes automatiques** : Tu decouvres les problèmes quand les utilisateurs se plaignent, pas avant.

**Comment SNMP résout ces problèmes** :

| Problème | Solution apportée par SNMP |
| --- | --- |
| Pas de supervision unifiee | Un serveur central interroge tous les équipements via SNMP |
| Pas d'alertes automatiques | Les équipements envoient des traps (notifications) en cas de problème |

**Analogie concrète** : SNMP fonctionne comme un système de rondes dans un bâtiment. Le gardien (serveur de supervision) passe régulièrement dans chaque pièce (équipement) pour vérifier que tout fonctionne. Si un detecteur de fumee se déclenche, il envoie une alerte au gardien sans attendre la prochaine ronde (trap SNMP).

---

## Étapes Pratiques

### Étape 1 : Tester HTTP/HTTPS

```bash
# Envoie une requete HTTP et affiche les en-tetes de reponse
curl -I http://example.com
```

**Résultat attendu** :

```text
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
Content-Length: 1256
Connection: keep-alive
```

```bash
# Envoie une requete HTTPS et affiche les details du certificat TLS
curl -vI https://example.com 2>&1 | grep -E "subject:|issuer:|expire"
```

**Résultat attendu** :

```text
*  subject: CN=www.example.org
*  issuer: C=US; O=DigiCert Inc; CN=DigiCert Global G2 TLS RSA SHA256 2020 CA1
*  expire date: Mar 01 23:59:59 2025 GMT
```

```bash
# Teste la connectivite HTTP avec telnet (protocole brut)
echo -e "GET / HTTP/1.1\r\nHost: example.com\r\nConnection: close\r\n\r\n" | nc example.com 80
```

---

### Étape 2 : Tester SSH

```bash
# Verifie que le service SSH ecoute sur le port 22
ss -tlnp | grep :22
```

**Résultat attendu** :

```text
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=1234,fd=3))
```

```bash
# Teste la connexion SSH a un serveur (sans se connecter)
ssh -o ConnectTimeout=5 -o BatchMode=yes user@192.168.1.10 exit 2>&1
```

```bash
# Affiche la cle publique du serveur SSH distant
ssh-keyscan -t ed25519 192.168.1.10
```

**Résultat attendu** :

```text
192.168.1.10 ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAI...
```

```bash
# Genere une paire de cles SSH (si tu n'en as pas encore)
ssh-keygen -t ed25519 -C "mon-email@example.com"
```

---

### Étape 3 : Tester FTP/SFTP

```bash
# Teste la connexion SFTP a un serveur
sftp user@192.168.1.10 << 'EOF'
ls
pwd
bye
EOF
```

**Résultat attendu** :

```text
Connected to 192.168.1.10.
sftp> ls
documents   images   scripts
sftp> pwd
Remote working directory: /home/user
sftp> bye
```

```bash
# Transfere un fichier via SFTP en une seule commande
sftp user@192.168.1.10 <<< "put /tmp/test.txt /home/user/test.txt"
```

```bash
# Alternative : utilise scp pour un transfert simple
scp /tmp/test.txt user@192.168.1.10:/home/user/
```

---

### Étape 4 : Tester SMTP

```bash
# Teste la connexion au serveur SMTP (port 25)
nc -w 5 mail.example.com 25
```

**Résultat attendu** :

```text
220 mail.example.com ESMTP Postfix
```

```bash
# Envoie un e-mail de test via SMTP en mode interactif
# (Tape chaque ligne une par une)
nc mail.example.com 25 << 'EOF'
EHLO test.local
MAIL FROM:<test@example.com>
RCPT TO:<destinataire@example.com>
DATA
Subject: Test SMTP

Ceci est un test.
.
QUIT
EOF
```

```bash
# Teste la connexion SMTP avec chiffrement TLS (port 587)
openssl s_client -starttls smtp -connect mail.example.com:587
```

---

### Étape 5 : Tester NTP

```bash
# Affiche l'heure systeme actuelle et la source de synchronisation
timedatectl
```

**Résultat attendu** :

```text
               Local time: lun. 2025-03-10 14:30:45 CET
           Universal time: lun. 2025-03-10 13:30:45 UTC
                 RTC time: lun. 2025-03-10 13:30:45
                Time zone: Europe/Paris (CET, +0100)
System clock synchronized: yes
              NTP service: active
```

```bash
# Interroge un serveur NTP directement
ntpdate -q pool.ntp.org
```

**Résultat attendu** :

```text
server 162.159.200.1, stratum 3, offset +0.001234, delay 0.04567
10 Mar 14:30:46 ntpdate[12345]: adjust time server 162.159.200.1 offset +0.001234 sec
```

```bash
# Verifie les sources NTP configurees (systemd-timesyncd)
timedatectl show-timesync --all 2>/dev/null || chronyc sources
```

---

### Étape 6 : Tester SNMP

```bash
# Installe les outils SNMP (Debian/Ubuntu)
sudo apt install -y snmp snmp-mibs-downloader
```

```bash
# Interroge un equipement SNMP (communaute "public")
snmpwalk -v2c -c public 192.168.1.1 system
```

**Résultat attendu** :

```text
SNMPv2-MIB::sysDescr.0 = STRING: Linux router 5.15.0 #1 SMP x86_64
SNMPv2-MIB::sysUpTime.0 = Timeticks: (123456789) 14 days, 6:56:07.89
SNMPv2-MIB::sysContact.0 = STRING: admin@example.com
SNMPv2-MIB::sysName.0 = STRING: router
SNMPv2-MIB::sysLocation.0 = STRING: Salle serveur
```

```bash
# Recupere une valeur specifique (uptime)
snmpget -v2c -c public 192.168.1.1 sysUpTime.0
```

---

### Étape 7 : Lister les services actifs sur une machine

```bash
# Liste tous les ports en ecoute avec le nom du service
sudo ss -tlnp
```

**Résultat attendu** :

```text
State  Recv-Q Send-Q Local Address:Port  Peer Address:Port Process
LISTEN 0      128          0.0.0.0:22         0.0.0.0:*    users:(("sshd",pid=1234,fd=3))
LISTEN 0      511          0.0.0.0:80         0.0.0.0:*    users:(("nginx",pid=5678,fd=6))
LISTEN 0      511          0.0.0.0:443        0.0.0.0:*    users:(("nginx",pid=5678,fd=7))
LISTEN 0      100        127.0.0.1:25         0.0.0.0:*    users:(("master",pid=9012,fd=13))
```

```bash
# Liste les ports UDP en ecoute
sudo ss -ulnp
```

```bash
# Verifie quel processus utilise un port specifique
sudo lsof -i :80
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `curl -I <url>` | Affiche les en-tetes HTTP d'une URL |
| `curl -vI https://<url>` | Affiche les détails TLS et les en-tetes |
| `ssh-keyscan <host>` | Recupere la clé publique SSH d'un serveur |
| `sftp user@host` | Ouvre une session SFTP interactive |
| `scp fichier user@host:/chemin` | Copie un fichier via SSH |
| `nc <host> <port>` | Teste la connexion TCP a un port |
| `openssl s_client -connect <host>:<port>` | Teste une connexion TLS |
| `timedatectl` | Affiche l'état de synchronisation NTP |
| `snmpwalk -v2c -c public <host> system` | Interroge un équipement SNMP |
| `sudo ss -tlnp` | Liste les ports TCP en écoute |
| `sudo lsof -i :<port>` | Identifie le processus sur un port |

---

## Pièges Fréquents

### Piège 1 : Confondre HTTP et HTTPS

⚠️ **Problème** : Tu testes une URL en HTTP (port 80) alors que le serveur redirige vers HTTPS (port 443). Tu obtiens une réponse `301 Moved Permanently` au lieu du contenu attendu.

✅ **Solution** : Utilise l'option `-L` de curl pour suivre les redirections :

```bash
# ❌ Sans suivi de redirection
curl -I http://example.com
# Reponse : 301 Moved Permanently

# ✅ Avec suivi de redirection
curl -IL http://example.com
# Reponse : 200 OK (apres redirection vers HTTPS)
```

---

### Piège 2 : FTP bloque par le firewall

⚠️ **Problème** : FTP en mode actif ne fonctionne pas a travers un firewall. Le serveur FTP tente d'ouvrir une connexion vers le client sur un port aleatoire, qui est bloque.

✅ **Solution** : Utilise le mode passif (le client initie toutes les connexions) ou passe a SFTP qui n'utilise qu'un seul port (22) :

```bash
# SFTP : un seul port, pas de probleme de firewall
sftp user@serveur
```

---

### Piège 3 : SNMP avec la communauté par défaut

⚠️ **Problème** : Tu laisses la communauté SNMP "public" (lecture) ou "private" (écriture) par défaut. N'importe qui sur le réseau peut lire ou modifier la configuration de tes équipements.

✅ **Solution** : Change la communauté SNMP pour une chaîne aleatoire ou passe a SNMPv3 avec authentification :

```bash
# SNMPv3 avec authentification et chiffrement
snmpwalk -v3 -u monuser -l authPriv \
  -a SHA -A "motdepasse_auth" \
  -x AES -X "motdepasse_priv" \
  192.168.1.1 system
```

---

### Piège 4 : NTP desynchronise après une longue coupure

⚠️ **Problème** : Après une longue coupure réseau, l'horloge a derive de plusieurs minutes. Le service NTP refuse de corriger un écart trop important.

✅ **Solution** : Force une synchronisation manuelle :

```bash
# Force la synchronisation immediate
sudo systemctl stop systemd-timesyncd
sudo ntpdate pool.ntp.org
sudo systemctl start systemd-timesyncd
```

---

## Checklist de Validation

- [ ] Je connais les ports par défaut des services HTTP, SSH, FTP, SMTP, IMAP, NTP et SNMP
- [ ] Je sais tester une connexion HTTP/HTTPS avec curl
- [ ] Je sais générer et utiliser des clés SSH
- [ ] Je comprends la difference entre FTP et SFTP
- [ ] Je sais expliquer le parcours d'un e-mail (SMTP vers IMAP)
- [ ] Je sais vérifier la synchronisation NTP d'une machine
- [ ] Je sais interroger un équipement SNMP
- [ ] Je sais lister les services actifs sur une machine avec ss ou lsof

---

## Exercice Pratique

**Énoncé** : Realise un audit des services réseau d'une machine Linux. Tu dois :

1. Lister tous les ports en écoute (TCP et UDP) avec le nom du processus associe
2. Tester la connexion HTTP/HTTPS sur les ports 80 et 443 (si presents)
3. Vérifier la configuration SSH (port, méthodes d'authentification)
4. Vérifier la synchronisation NTP
5. Produire un tableau récapitulatif de tous les services trouves avec : port, protocole, nom du service, état

**Indications** :

- Utilise `sudo ss -tlnp` et `sudo ss -ulnp` pour lister les ports
- Utilise `curl -I` pour tester HTTP/HTTPS
- Utilise `sshd -T | grep -E "port|passwordauthentication|pubkeyauthentication"` pour la config SSH
- Utilise `timedatectl` pour NTP

**Résultat attendu** : Un tableau récapitulatif des services actifs sur la machine, avec des recommandations de sécurité pour chaque service.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Étape 1 - Lister les ports** :

```bash
# Ports TCP en ecoute
sudo ss -tlnp

# Ports UDP en ecoute
sudo ss -ulnp
```

**Étape 2 - Tester HTTP/HTTPS** :

```bash
# Teste HTTP
curl -I http://localhost 2>/dev/null && echo "HTTP actif" || echo "HTTP inactif"

# Teste HTTPS
curl -I https://localhost 2>/dev/null && echo "HTTPS actif" || echo "HTTPS inactif"
```

**Étape 3 - Vérifier SSH** :

```bash
# Affiche la configuration effective de SSH
sudo sshd -T 2>/dev/null | grep -E "port |passwordauthentication |pubkeyauthentication |permitrootlogin "
```

Résultat attendu :

```text
port 22
passwordauthentication yes
pubkeyauthentication yes
permitrootlogin prohibit-password
```

**Étape 4 - Vérifier NTP** :

```bash
timedatectl | grep -E "synchronized|NTP"
```

**Étape 5 - Tableau récapitulatif** :

| Port | Protocole | Service | État | Recommandation |
| --- | --- | --- | --- | --- |
| 22/tcp | SSH | sshd | Actif | Desactiver PasswordAuthentication, utiliser des clés |
| 80/tcp | HTTP | nginx | Actif | Rediriger vers HTTPS |
| 443/tcp | HTTPS | nginx | Actif | Vérifier le certificat TLS |
| 25/tcp | SMTP | postfix | Actif | Restreindre au localhost si pas de serveur mail |
| 123/udp | NTP | systemd-timesyncd | Actif | Synchronise - aucune action nécessaire |

---

## Navigation

← Fiche précédente : **[07 - Firewalls et filtrage](07-firewalls-filtrage.md)**

→ Fiche suivante : **[09 - Wi-Fi et sécurité sans fil](09-wifi-securite.md)**
