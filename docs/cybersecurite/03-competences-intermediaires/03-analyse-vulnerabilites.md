---
tags:
  - Cybersécurité
  - Intermédiaire
  - Pratique
description: "OSINT, Nmap avancé, Nessus, OpenVAS, énumération, CVSS, veille sécuritaire"
estimated_time: "70 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 3 - Compétences intermédiaires"
id: "security.cybersecurity.intermediate.analyse-vulnerabilites"
course_id: "security.cybersecurity"
module_id: "security.cybersecurity.intermediate"
content_type: "lesson"
order: 3
---

# 03 - Analyse de vulnérabilités et Reconnaissance

> **En bref** : À la fin de cette fiche, tu sauras mener une phase de reconnaissance passive et active sur une cible autorisée, utiliser Nmap pour le scan avancé de ports et services, effectuer une analyse de vulnérabilités avec Nessus ou OpenVAS, énumérer les services réseau courants, et prioriser les vulnérabilités avec le score CVSS. Lecture estimée : 70 min.

!!! warning "Cadre légal : lab et autorisation uniquement"
    Scan actif (Nmap, Nessus, OpenVAS, énumération) = interaction avec la cible. Ne scanne **que** ton lab, un réseau que tu contrôles, ou une cible couverte par **autorisation écrite**. Un scan non autorisé peut constituer un délit en France (Code pénal, art. 323-1 et s.). Pour l'entraînement : HTB, TryHackMe, VulnHub, lab virtuel personnel.

## Prérequis

- [Phase 1, fiche 03 - Réseaux et protocoles](../01-fondamentaux-informatiques/03-reseaux-protocoles.md) (modèle OSI, TCP/IP, Wireshark)
- [Phase 2, fiche 03 - Sécurité réseau](../02-fondamentaux-securite/03-securite-reseaux.md) (pare-feu, IDS/IPS, VPN)
- Connaissances de base en ligne de commande Linux
- Compréhension des protocoles réseau courants (TCP, UDP, HTTP, DNS, SMB)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras mener une phase de reconnaissance passive et active sur une cible autorisée, utiliser Nmap pour le scan avancé de ports et services, effectuer une analyse de vulnérabilités avec Nessus ou OpenVAS, énumérer les services réseau courants, et prioriser les vulnérabilités avec le score CVSS.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la reconnaissance ?

**Définition** : La reconnaissance est la première phase d'un test de sécurité. Elle consiste à collecter le maximum d'informations sur une cible (entreprise, réseau, application) avant toute tentative d'exploitation. Elle se divise en deux types : passive (sans interaction directe avec la cible) et active (avec interaction directe).

**Le problème que la reconnaissance résout** :

Sans phase de reconnaissance, voici les problèmes rencontrés :

1. **Attaques à l'aveugle** : sans connaître l'infrastructure cible, les tests de sécurité sont inefficaces et incomplets
2. **Surface d'attaque inconnue** : des services exposés, des sous-domaines oubliés ou des fuites de données restent invisibles
3. **Priorisation impossible** : sans cartographie de l'infrastructure, on ne peut pas identifier les points les plus critiques à tester

**Comment la reconnaissance résout ces problèmes** :

| Problème | Solution apportée par la reconnaissance |
| --- | --- |
| Attaques à l'aveugle | La reconnaissance fournit une carte détaillée de l'infrastructure (IP, ports, services, technologies) |
| Surface d'attaque inconnue | L'OSINT et les scans révèlent les actifs exposés, y compris ceux oubliés par l'équipe IT |
| Priorisation impossible | La cartographie permet d'identifier les services critiques et les versions vulnérables en priorité |

**Analogie concrète** : La reconnaissance, c'est comme le travail d'un architecte avant la rénovation d'un bâtiment. Avant de toucher à quoi que ce soit, il fait un état des lieux complet : plans existants, matériaux utilisés, état de la structure, points faibles. Sans cet état des lieux, il risque de casser un mur porteur ou de passer à côté d'une fissure dangereuse.

**Comparaison reconnaissance passive vs active** :

| Reconnaissance passive | Reconnaissance active |
| --- | --- |
| Aucune interaction directe avec la cible | Interaction directe avec la cible (scans, requêtes) |
| Indétectable par la cible | Potentiellement détectable par les IDS/IPS |
| Sources : moteurs de recherche, registres publics, réseaux sociaux | Sources : scan de ports, scan de vulnérabilités, enumération |
| Exemples : Google dorks, Shodan, theHarvester | Exemples : Nmap, Nessus, OpenVAS |

### Qu'est-ce que l'OSINT ?

**Définition** : L'OSINT (Open Source Intelligence) est la collecte et l'analyse d'informations provenant de sources ouvertes et publiques. En cybersécurité, l'OSINT permet de cartographier la surface d'attaque d'une organisation sans toucher à son infrastructure.

**Le problème que l'OSINT résout** :

Sans OSINT, voici les problèmes rencontrés :

1. **Informations cachées en clair** : des mots de passe, des clés API et des documents internes sont souvent accessibles publiquement sans que l'organisation le sache
2. **Sous-domaines oubliés** : des serveurs de test ou d'anciens services restent exposés sur Internet sans surveillance
3. **Ingénierie sociale facilitée** : les attaquants exploitent les informations personnelles des employés (LinkedIn, réseaux sociaux) pour du phishing ciblé

**Comment l'OSINT résout ces problèmes** :

| Problème | Solution apportée par l'OSINT |
| --- | --- |
| Informations cachées en clair | Les Google dorks et les outils de recherche spécialisés détectent les fuites de données publiques |
| Sous-domaines oubliés | Les outils d'énumération DNS et les moteurs comme Shodan révèlent tous les actifs exposés |
| Ingénierie sociale | L'analyse OSINT permet à l'équipe de sécurité d'identifier les informations exposées et de les supprimer |

**Ce que l'OSINT n'est PAS** :

- L'OSINT n'est pas du piratage d'accès : les sources sont en principe publiques. Cela ne supprime pas d'autres règles (conditions d'utilisation des plateformes, RGPD sur les données personnelles, interdictions contractuelles ou professionnelles).
- L'OSINT n'est pas l'espionnage. L'espionnage vise des informations classifiées ou privées obtenues hors cadre légal. L'OSINT se limite aux sources ouvertes, dans le respect du droit applicable.

### Qu'est-ce que Nmap ?

**Définition** : Nmap (Network Mapper) est l'outil de référence pour le scan de ports et la découverte de services réseau. Il permet d'identifier les ports ouverts, les services en écoute, leurs versions, et le système d'exploitation d'une machine.

**Le problème que Nmap résout** :

Sans Nmap, voici les problèmes rencontrés :

1. **Ports inconnus** : impossible de savoir quels ports sont ouverts sur une machine distante
2. **Services non identifiés** : un port ouvert ne dit pas quel logiciel est derrière ni sa version
3. **Pas de détection de vulnérabilités réseau** : sans connaître les versions des services, impossible de chercher les CVE associées

**Comment Nmap résout ces problèmes** :

| Problème | Solution apportée par Nmap |
| --- | --- |
| Ports inconnus | Scan TCP/UDP de 65535 ports avec différentes techniques (SYN, Connect, FIN, XMAS) |
| Services non identifiés | Détection de version (-sV) qui interroge les services pour identifier le logiciel et sa version |
| Pas de détection de vulnérabilités | NSE (Nmap Scripting Engine) avec des centaines de scripts de détection de vulnérabilités |

**Analogie concrète** : Nmap, c'est comme un inspecteur qui fait le tour d'un immeuble en testant chaque porte et chaque fenêtre. Pour chaque ouverture trouvée, il note ce qu'il y a derrière (un bureau, un entrepôt, un laboratoire), la marque de la serrure, et s'il y a des failles connues dans ce modèle de serrure.

### Qu'est-ce que le CVSS ?

**Définition** : Le CVSS (Common Vulnerability Scoring System) est un système de notation standardisé qui attribue un score de 0 à 10 à chaque vulnérabilité pour évaluer sa sévérité. Ce score est utilisé mondialement pour prioriser les corrections.

**Le problème que le CVSS résout** :

Sans CVSS, voici les problèmes rencontrés :

1. **Priorisation subjective** : chaque équipe de sécurité évalue la sévérité à sa manière, sans standard
2. **Trop de vulnérabilités** : un scan peut révéler des centaines de vulnérabilités. Sans scoring, impossible de savoir lesquelles corriger en premier
3. **Communication difficile** : expliquer la sévérité d'une vulnérabilité à la direction sans chiffre objectif est compliqué

**Comment le CVSS résout ces problèmes** :

| Problème | Solution apportée par le CVSS |
| --- | --- |
| Priorisation subjective | Score objectif de 0 à 10 basé sur des critères mesurables (vecteur d'attaque, complexité, impact) |
| Trop de vulnérabilités | Classement par score : Critical (9.0-10.0), High (7.0-8.9), Medium (4.0-6.9), Low (0.1-3.9) |
| Communication difficile | Le score numérique est compréhensible par tous : "Cette vulnérabilité est un 9.8/10" |

**Échelle de sévérité CVSS v3.1** :

| Score | Sévérité | Action recommandée |
| --- | --- | --- |
| 0.0 | None | Aucune action |
| 0.1 - 3.9 | Low | Corriger lors de la prochaine maintenance planifiée |
| 4.0 - 6.9 | Medium | Corriger dans les 30 jours |
| 7.0 - 8.9 | High | Corriger dans les 7 jours |
| 9.0 - 10.0 | Critical | Corriger immédiatement |

**CVSS v4.0** : une nouvelle version du standard est publiée par le FIRST depuis novembre 2023. Elle reste compatible avec l'échelle de sévérité ci-dessus (None à Critical) mais réorganise les métriques en quatre groupes :

| Groupe de métriques | Rôle |
| --- | --- |
| Base | Caractéristiques intrinsèques de la vulnérabilité (vecteur d'attaque, complexité, impact) |
| Threat | Maturité du code d'exploitation (remplace le groupe Temporal de la v3.1) |
| Environmental | Adaptation au contexte de l'organisation (criticité de l'actif touché) |
| Supplemental | Métriques informatives (sécurité automatisable, valeur de la réponse) |

La v4.0 ajoute aussi des métriques dédiées aux systèmes industriels et OT/ICS (Safety). En pratique, **CVSS v3.1 reste très largement utilisé** : la plupart des bases (NVD, CERT) publient encore des scores v3.1, parfois en parallèle des scores v4.0. Tu rencontreras donc les deux versions et tu dois savoir les distinguer (un score est préfixé par sa version dans le vecteur, par exemple `CVSS:4.0/...`).

**Analogie concrète** : Le CVSS, c'est comme l'échelle de Richter pour les séismes. Un séisme de magnitude 2 est imperceptible, un de magnitude 5 fait trembler les murs, et un de magnitude 9 est dévastateur. Le score CVSS permet de mesurer la "magnitude" d'une vulnérabilité de manière universelle.

### Qu'est-ce que l'énumération ?

**Définition** : L'énumération est le processus de collecte d'informations détaillées sur les services réseau découverts lors du scan. Elle consiste à interroger activement les services pour extraire des données exploitables : noms d'utilisateurs, partages réseau, informations SNMP, entrées DNS, etc.

**Le problème que l'énumération résout** :

Sans énumération, voici les problèmes rencontrés :

1. **Informations superficielles** : un scan de ports montre qu'un service est ouvert, mais ne révèle pas les détails exploitables
2. **Vecteurs d'attaque manqués** : des partages réseau ouverts, des comptes utilisateurs sans mot de passe ou des transferts de zone DNS ne sont pas détectés par un simple scan de ports

**Comment l'énumération résout ces problèmes** :

| Problème | Solution apportée par l'énumération |
| --- | --- |
| Informations superficielles | L'interrogation des services révèle les utilisateurs, partages, configurations, versions détaillées |
| Vecteurs d'attaque manqués | L'énumération de chaque protocole (SMB, SNMP, LDAP, DNS, NFS) expose les faiblesses spécifiques |

### Qu'est-ce que la veille sécuritaire ?

**Définition** : La veille sécuritaire est le processus continu de surveillance des nouvelles vulnérabilités, exploits et menaces publiés. Elle repose sur des sources comme les CVE (Common Vulnerabilities and Exposures), le NVD (National Vulnerability Database) et Exploit-DB.

**Le problème que la veille résout** :

1. **Vulnérabilités zéro-day** : de nouvelles vulnérabilités sont publiées chaque jour. Sans veille, une vulnérabilité critique dans un logiciel utilisé peut passer inaperçue pendant des semaines
2. **Exploits publics** : quand un exploit est publié sur Exploit-DB, les attaquants l'utilisent dans les heures qui suivent. L'équipe de sécurité doit être informée en premier

**Sources de veille essentielles** :

| Source | URL | Description |
| --- | --- | --- |
| CVE | cve.mitre.org | Identifiants uniques pour chaque vulnérabilité |
| NVD | nvd.nist.gov | Base de données avec scores CVSS et détails techniques |
| Exploit-DB | exploit-db.com | Archive publique d'exploits fonctionnels |
| CERT-FR | cert.ssi.gouv.fr | Alertes et avis de sécurité en français |
| Shodan | shodan.io | Moteur de recherche d'appareils connectés |
| Censys | search.censys.io | Scan continu de l'Internet, inventaire des services exposés |

---

## Étapes Pratiques

### Étape 1 : Reconnaissance passive avec Google Dorks

Les Google Dorks sont des opérateurs de recherche avancés qui permettent de trouver des informations sensibles indexées par Google.

```bash
# Exemples de Google Dorks (à tester dans un navigateur sur google.com)

# Trouver des fichiers de configuration exposés
# site:example.com filetype:env
# site:example.com filetype:yml "password"
# site:example.com filetype:sql "INSERT INTO"

# Trouver des pages d'administration
# site:example.com inurl:admin
# site:example.com intitle:"index of" inurl:backup

# Trouver des répertoires listés
# site:example.com intitle:"index of /"

# Trouver des pages de login
# site:example.com inurl:login OR inurl:signin OR inurl:auth

# Trouver des fuites d'identifiants
# site:pastebin.com "example.com" password
# site:github.com "example.com" "password" OR "api_key" OR "secret"
```

---

### Étape 2 : Reconnaissance passive avec theHarvester

theHarvester collecte des adresses email, sous-domaines, noms d'hôtes et adresses IP à partir de sources publiques.

```bash
# Installer theHarvester
sudo apt install theharvester    # Kali Linux
pip3 install theHarvester        # Autres distributions

# Lancer une collecte sur un domaine cible (utiliser un domaine autorisé)
theHarvester -d example.com -b google,bing,linkedin,dnsdumpster -l 200
```

**Résultat attendu** :

```text
*******************************************************************
*  _   _                                            _             *
* | |_| |__   ___    /\  /\__ _ _ ____   _____  ___| |_ ___ _ __ *
* | __| '_ \ / _ \  / /_/ / _` | '__\ \ / / _ \/ __| __/ _ \ '__|*
* | |_| | | |  __/ / __  / (_| | |   \ V /  __/\__ \ ||  __/ |   *
*  \__|_| |_|\___| \/ /_/ \__,_|_|    \_/ \___||___/\__\___|_|   *
*                                                                 *
* theHarvester 4.6.0                                              *
*******************************************************************

[*] Target: example.com

[*] Searching Google...
[*] Searching Bing...
[*] Searching LinkedIn...
[*] Searching DNSDumpster...

[*] Emails found: 3
----------------------
admin@example.com
contact@example.com
support@example.com

[*] Hosts found: 8
---------------------
www.example.com: 93.184.216.34
mail.example.com: 93.184.216.35
dev.example.com: 93.184.216.36
staging.example.com: 93.184.216.37
api.example.com: 93.184.216.38
vpn.example.com: 93.184.216.39
ftp.example.com: 93.184.216.40
old.example.com: 93.184.216.41
```

---

### Étape 3 : Reconnaissance passive avec Shodan

Shodan est un moteur de recherche qui scanne Internet en continu et indexe les services exposés (serveurs web, caméras, routeurs, bases de données, etc.).

```bash
# Installer le client Shodan en ligne de commande
pip3 install shodan

# Initialiser avec ta clé API (gratuite après inscription sur shodan.io)
shodan init VOTRE_CLE_API

# Chercher les services exposés pour un domaine
shodan search "hostname:example.com"

# Chercher les serveurs Apache vulnérables dans une plage IP
shodan search "apache" --fields ip_str,port,org,product,version

# Obtenir les informations sur une IP spécifique
shodan host 93.184.216.34
```

**Résultat attendu** :

```text
93.184.216.34
City:                    Norwell
Country:                 United States
Organization:            Edgecast Inc.
Operating System:        None
Number of open ports:    3

Ports:
     80/tcp  |  ECS (dcb/7F83)
    443/tcp  |  ECS (dcb/7F84)
   8080/tcp  |  nginx 1.21.6
```

---

### Étape 4 : Scan de ports avec Nmap (scan basique)

```bash
# Scan TCP SYN des 1000 ports les plus courants (scan par défaut)
# -sS : SYN scan (semi-ouvert, plus discret qu'un scan complet)
# Nécessite les droits root
sudo nmap -sS 192.168.1.100
```

**Résultat attendu** :

```text
Starting Nmap 7.94SVN ( https://nmap.org ) at 2026-03-19 15:00 CET
Nmap scan report for 192.168.1.100
Host is up (0.0012s latency).
Not shown: 995 closed tcp ports (reset)
PORT     STATE SERVICE
22/tcp   open  ssh
80/tcp   open  http
443/tcp  open  https
3306/tcp open  mysql
8080/tcp open  http-proxy

Nmap done: 1 IP address (1 host up) scanned in 1.23 seconds
```

```bash
# Scan de TOUS les 65535 ports TCP
# -p- : scanne tous les ports (1-65535)
# -T4 : vitesse agressive (T0=paranoïaque, T5=insane)
sudo nmap -sS -p- -T4 192.168.1.100
```

---

### Étape 5 : Nmap avancé (détection de versions et OS)

```bash
# Scan avec détection de version et OS
# -sV : détection de version des services
# -O  : détection du système d'exploitation
# -A  : active -sV, -O, scripts par défaut et traceroute
sudo nmap -A 192.168.1.100
```

**Résultat attendu** :

```text
PORT     STATE SERVICE VERSION
22/tcp   open  ssh     OpenSSH 8.9p1 Ubuntu 3ubuntu0.6 (Ubuntu Linux; protocol 2.0)
| ssh-hostkey:
|   256 aa:bb:cc:dd:ee:ff:00:11:22:33:44:55:66:77:88:99 (ECDSA)
|_  256 11:22:33:44:55:66:77:88:99:aa:bb:cc:dd:ee:ff:00 (ED25519)
80/tcp   open  http    Apache httpd 2.4.57 ((Debian))
|_http-title: Site doesn't have a title (text/html).
|_http-server-header: Apache/2.4.57 (Debian)
443/tcp  open  ssl/http Apache httpd 2.4.57 ((Debian))
| ssl-cert: Subject: commonName=example.com
3306/tcp open  mysql   MySQL 8.0.36
| mysql-info:
|   Protocol: 10
|   Version: 8.0.36
|   Thread ID: 42

OS details: Linux 5.15 - 6.1
Network Distance: 1 hop
Service Info: OS: Linux; CPE: cpe:/o:linux:linux_kernel
```

```bash
# Scan avec les scripts NSE (Nmap Scripting Engine)
# Les scripts NSE sont classés par catégorie : auth, broadcast, brute, default,
# discovery, dos, exploit, external, fuzzer, intrusive, malware, safe, version, vuln

# Lancer tous les scripts de détection de vulnérabilités
sudo nmap --script vuln 192.168.1.100

# Lancer un script spécifique (ex: détection de SMB vulnérable)
sudo nmap --script smb-vuln-ms17-010 -p 445 192.168.1.100

# Scanner les vulnérabilités HTTP
sudo nmap --script http-vuln-* -p 80,443 192.168.1.100
```

**Résultat attendu** (extrait) :

```text
PORT    STATE SERVICE
445/tcp open  microsoft-ds

Host script results:
| smb-vuln-ms17-010:
|   VULNERABLE:
|   Remote Code Execution vulnerability in Microsoft SMBv1 servers (ms17-010)
|     State: VULNERABLE
|     IDs:  CVE:CVE-2017-0143
|     Risk factor: HIGH
|       A critical remote code execution vulnerability exists in SMBv1.
|     Disclosure date: 2017-03-14
|     References:
|       https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2017-0143
```

---

### Étape 6 : Scan UDP

```bash
# Le scan UDP est plus lent que le scan TCP car UDP est un protocole sans connexion
# -sU : scan UDP
# --top-ports 100 : scanner uniquement les 100 ports UDP les plus courants
sudo nmap -sU --top-ports 100 -T4 192.168.1.100
```

**Résultat attendu** :

```text
PORT      STATE         SERVICE
53/udp    open          domain
67/udp    open|filtered dhcps
68/udp    open|filtered dhcpc
69/udp    open|filtered tftp
123/udp   open          ntp
161/udp   open          snmp
500/udp   open|filtered isakmp
```

---

### Étape 7 : Énumération SMB

SMB (Server Message Block) est un protocole de partage de fichiers Windows. Il est souvent une source majeure de vulnérabilités.

```bash
# Énumérer les partages SMB
# enum4linux est un outil spécialisé pour l'énumération SMB/NetBIOS
enum4linux -a 192.168.1.100
```

**Résultat attendu** (extrait) :

```text
 =========================================
|    Share Enumeration on 192.168.1.100   |
 =========================================

        Sharename       Type      Comment
        ---------       ----      -------
        ADMIN$          Disk      Remote Admin
        C$              Disk      Default share
        IPC$            IPC       Remote IPC
        Public          Disk      Partage public
        Backup          Disk      Sauvegardes

 ====================================
|    Users on 192.168.1.100          |
 ====================================
user:[Administrator] rid:[0x1f4]
user:[Guest] rid:[0x1f5]
user:[jean.dupont] rid:[0x3e8]
user:[admin.web] rid:[0x3e9]
```

```bash
# Alternative avec smbclient
smbclient -L //192.168.1.100 -N    # -N : pas de mot de passe (null session)

# Se connecter à un partage
smbclient //192.168.1.100/Public -N
```

---

### Étape 8 : Énumération SNMP

SNMP (Simple Network Management Protocol) est utilisé pour la gestion des équipements réseau. La version SNMPv1/v2c utilise des "community strings" (mots de passe en clair) souvent laissées par défaut ("public", "private").

```bash
# Scanner les services SNMP avec la community string "public"
snmpwalk -v2c -c public 192.168.1.1
```

**Résultat attendu** (extrait) :

```text
SNMPv2-MIB::sysDescr.0 = STRING: Linux router 5.15.0-91-generic #101-Ubuntu
SNMPv2-MIB::sysContact.0 = STRING: admin@example.com
SNMPv2-MIB::sysName.0 = STRING: router-prod
SNMPv2-MIB::sysLocation.0 = STRING: Datacenter Paris - Rack 42
IF-MIB::ifDescr.1 = STRING: lo
IF-MIB::ifDescr.2 = STRING: eth0
IF-MIB::ifDescr.3 = STRING: eth1
```

```bash
# Utiliser onesixtyone pour bruteforcer les community strings
onesixtyone -c /usr/share/wordlists/community-strings.txt 192.168.1.0/24
```

---

### Étape 9 : Énumération DNS

```bash
# Tentative de transfert de zone DNS
# Un transfert de zone mal configuré révèle tous les enregistrements DNS d'un domaine
dig @ns1.example.com example.com AXFR
```

**Résultat attendu** (si le transfert de zone est autorisé) :

```text
; <<>> DiG 9.18.18-0ubuntu0.22.04.2-Ubuntu <<>> @ns1.example.com example.com AXFR
;; ANSWER SECTION:
example.com.        86400   IN  SOA     ns1.example.com. admin.example.com.
example.com.        86400   IN  NS      ns1.example.com.
example.com.        86400   IN  NS      ns2.example.com.
example.com.        86400   IN  A       93.184.216.34
www.example.com.    86400   IN  A       93.184.216.34
mail.example.com.   86400   IN  A       93.184.216.35
dev.example.com.    86400   IN  A       93.184.216.36
staging.example.com. 86400  IN  A       93.184.216.37
_internal.example.com. 86400 IN A       10.0.0.50
```

```bash
# Énumération de sous-domaines avec des wordlists
# Utiliser gobuster en mode DNS
gobuster dns -d example.com -w /usr/share/wordlists/subdomains-top1million-5000.txt -t 50
```

**Résultat attendu** :

```text
===============================================================
Gobuster v3.6
===============================================================
[*] Domain:     example.com
[*] Threads:    50
[*] Wordlist:   /usr/share/wordlists/subdomains-top1million-5000.txt
===============================================================
Found: www.example.com
Found: mail.example.com
Found: ftp.example.com
Found: dev.example.com
Found: staging.example.com
Found: api.example.com
Found: vpn.example.com
Found: admin.example.com
===============================================================
```

---

### Étape 10 : Analyse de vulnérabilités avec OpenVAS

OpenVAS (Open Vulnerability Assessment Scanner) est un scanner de vulnérabilités gratuit et open source.

```bash
# Installer OpenVAS via Greenbone Community Edition (GCE)
# Sur Kali Linux :
sudo apt install gvm
sudo gvm-setup    # Configuration initiale (peut prendre 30+ minutes)
sudo gvm-start    # Démarrer les services

# L'interface web est accessible sur https://127.0.0.1:9392
# Login : admin
# Password : affiché lors du gvm-setup
```

```bash
# Créer un scan via l'interface web :
# 1. Aller dans Configuration > Targets > New Target
#    - Name : Serveur Web
#    - Hosts : 192.168.1.100
#    - Port List : All IANA assigned TCP

# 2. Aller dans Scans > Tasks > New Task
#    - Name : Scan serveur web
#    - Scan Targets : Serveur Web
#    - Scanner : OpenVAS Default
#    - Scan Config : Full and fast

# 3. Démarrer le scan en cliquant sur le bouton Play

# Alternative en ligne de commande avec gvm-cli :
gvm-cli --gmp-username admin --gmp-password MOTDEPASSE \
  socket --xml '<create_task><name>Scan CLI</name><target id="TARGET_ID"/><config id="CONFIG_ID"/></create_task>'
```

**Résultat attendu** (extrait du rapport) :

```text
Vulnerability                          | Severity | CVSS  | Host
---------------------------------------|----------|-------|------------------
Apache HTTP Server < 2.4.58 - Multiple | High     | 7.5   | 192.168.1.100
MySQL 8.0.x < 8.0.37 - Auth Bypass    | High     | 7.5   | 192.168.1.100
OpenSSH < 9.6 - Terrapin Attack       | Medium   | 5.9   | 192.168.1.100
SSL/TLS: Certificate Expired           | Medium   | 5.0   | 192.168.1.100
HTTP: Missing Security Headers         | Low      | 2.6   | 192.168.1.100
```

---

### Étape 11 : Rédiger un rapport de vulnérabilités

Un rapport de vulnérabilités doit contenir les éléments suivants pour chaque vulnérabilité trouvée :

```text
## Rapport de vulnérabilités - Serveur 192.168.1.100

### Vulnérabilité 1 : Apache HTTP Server < 2.4.58

- **Sévérité** : High (CVSS 7.5)
- **CVE** : CVE-2023-44487
- **Service affecté** : Apache/2.4.57 sur le port 80/443
- **Description** : Le serveur Apache est vulnérable à l'attaque HTTP/2 Rapid Reset
  qui permet un déni de service.
- **Preuve** : Détecté par Nmap (-sV) et confirmé par OpenVAS.
  Version détectée : Apache/2.4.57
- **Impact** : Un attaquant peut provoquer un déni de service en envoyant
  des requêtes HTTP/2 RST_STREAM.
- **Recommandation** : Mettre à jour Apache vers la version 2.4.58 ou supérieure.
- **Priorité** : Corriger dans les 7 jours.

### Vulnérabilité 2 : ...
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `theHarvester -d domaine -b google` | Collecte OSINT sur un domaine |
| `shodan host IP` | Informations Shodan sur une IP |
| `sudo nmap -sS IP` | Scan SYN des 1000 ports les plus courants |
| `sudo nmap -sS -p- -T4 IP` | Scan SYN de tous les 65535 ports |
| `sudo nmap -A IP` | Scan complet (version, OS, scripts, traceroute) |
| `sudo nmap --script vuln IP` | Scripts de détection de vulnérabilités |
| `sudo nmap -sU --top-ports 100 IP` | Scan UDP des 100 ports les plus courants |
| `enum4linux -a IP` | Énumération complète SMB/NetBIOS |
| `smbclient -L //IP -N` | Lister les partages SMB (null session) |
| `snmpwalk -v2c -c public IP` | Énumération SNMP |
| `dig @NS domaine AXFR` | Tentative de transfert de zone DNS |
| `gobuster dns -d domaine -w wordlist` | Énumération de sous-domaines |
| `sudo gvm-start` | Démarrer OpenVAS |

---

## Pièges Fréquents

### Piège 1 : Scanner sans autorisation

**Problème** : Scanner un réseau ou un système sans autorisation peut être illégal, constitutif d'une faute contractuelle, ou contraire à la politique du fournisseur d'accès. En France, l'accès ou le maintien frauduleux dans un système (art. 323-1 et s. du Code pénal) vise surtout l'accès non autorisé ; un scan peut néanmoins être sanctionné selon le contexte, le périmètre et la juridiction. Ne considère jamais qu'un « simple Nmap » est toujours anodin.

**Solution** : Obtenir une autorisation écrite (lettre de mission, contrat de pentest) avant tout scan hors de ton propre lab. Pour l'entraînement : HackTheBox, TryHackMe, VulnHub, ou un lab virtuel que tu contrôles.

### Piège 2 : Se limiter au scan TCP

**Problème** : Ne scanner que les ports TCP fait manquer les services UDP importants comme DNS (53), SNMP (161), TFTP (69), NTP (123) ou les VPN (500/4500).

**Solution** : Toujours inclure un scan UDP dans la phase de reconnaissance. Le scan UDP est plus lent, donc commencer par les 100 ports UDP les plus courants (`--top-ports 100`).

### Piège 3 : Ignorer les ports non-standard

**Problème** : Se limiter aux 1000 ports par défaut de Nmap fait manquer les services sur des ports non-standard (ex : SSH sur 2222, web sur 8443, admin sur 9090).

**Solution** : Toujours faire un scan complet (`-p-`) au moins une fois sur chaque cible. Combiner avec `-T4` pour accélérer le scan.

### Piège 4 : Confondre CVSS de base et CVSS contextuel

**Problème** : Le score CVSS de base ne prend pas en compte le contexte de ton environnement. Une vulnérabilité CVSS 9.8 sur un serveur isolé sans données sensibles n'a pas le même impact qu'une CVSS 6.0 sur un serveur de production exposé à Internet.

**Solution** : Toujours contextualiser le score CVSS avec les métriques environnementales et temporelles. Prendre en compte : le serveur est-il exposé à Internet ? Contient-il des données sensibles ? Un exploit public existe-t-il ?

---

## Checklist de Validation

- [ ] Je sais utiliser les Google Dorks pour trouver des informations sensibles
- [ ] Je sais utiliser theHarvester pour collecter des emails et sous-domaines
- [ ] Je sais utiliser Shodan pour identifier les services exposés
- [ ] Je sais effectuer un scan Nmap basique (SYN, version, OS)
- [ ] Je sais utiliser les scripts NSE de Nmap pour détecter des vulnérabilités
- [ ] Je sais énumérer les services SMB, SNMP et DNS
- [ ] Je sais utiliser OpenVAS pour un scan de vulnérabilités complet
- [ ] Je comprends le CVSS et je sais prioriser les vulnérabilités
- [ ] Je sais rédiger un rapport de vulnérabilités structuré
- [ ] Je connais les sources de veille (CVE, NVD, Exploit-DB, CERT-FR)

---

## Exercice Pratique

**Énoncé** : Tu disposes d'un réseau de lab avec 3 machines virtuelles (Metasploitable2, une machine Windows vulnérable, et un routeur). Tu dois mener une phase de reconnaissance complète.

1. Reconnaissance passive : utilise theHarvester et Shodan (ou un lab Shodan local) pour collecter les informations disponibles publiquement
2. Scan de ports : effectue un scan Nmap complet (tous les ports TCP + les 100 principaux ports UDP) sur chaque machine
3. Détection de versions : identifie tous les services et leurs versions exactes
4. Énumération : pour chaque service découvert (SMB, SNMP, HTTP, etc.), effectue une énumération approfondie
5. Analyse de vulnérabilités : lance un scan OpenVAS et corrèle les résultats avec les versions détectées par Nmap
6. Rapport : rédige un rapport listant chaque vulnérabilité avec son score CVSS, sa description et la recommandation de remédiation

**Indications** :

- Metasploitable2 est disponible gratuitement sur sourceforge.net
- Commence par le scan Nmap avant d'utiliser OpenVAS (les résultats Nmap guident l'interprétation du scan OpenVAS)
- Utilise `searchsploit` (Exploit-DB local) pour vérifier si des exploits publics existent pour les versions trouvées
- Classe les vulnérabilités par score CVSS décroissant dans ton rapport

**Résultat attendu** : Un rapport de reconnaissance complet avec la cartographie du réseau, les services découverts, les vulnérabilités identifiées et priorisées.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Étape 1 : Découverte des hôtes sur le réseau
sudo nmap -sn 192.168.1.0/24 | grep "Nmap scan report"
# Résultat : 192.168.1.10 (Metasploitable2), 192.168.1.20 (Windows), 192.168.1.1 (routeur)

# Étape 2 : Scan complet TCP de chaque machine
sudo nmap -sS -sV -O -p- -T4 -oA scan-metasploitable 192.168.1.10
sudo nmap -sS -sV -O -p- -T4 -oA scan-windows 192.168.1.20
sudo nmap -sS -sV -O -p- -T4 -oA scan-routeur 192.168.1.1

# Étape 3 : Scan UDP
sudo nmap -sU --top-ports 100 -T4 -oA scan-udp-metasploitable 192.168.1.10

# Étape 4 : Scripts NSE de détection de vulnérabilités
sudo nmap --script vuln -oA vuln-metasploitable 192.168.1.10

# Étape 5 : Énumération SMB sur la machine Windows
enum4linux -a 192.168.1.20

# Étape 6 : Énumération SNMP (si le port 161 est ouvert)
snmpwalk -v2c -c public 192.168.1.1

# Étape 7 : Recherche d'exploits pour les versions trouvées
searchsploit apache 2.4.57
searchsploit openssh 8.9
searchsploit mysql 8.0.36

# Étape 8 : Scan OpenVAS
# Créer un target avec les 3 IPs dans l'interface web OpenVAS
# Lancer un scan "Full and fast"
# Exporter le rapport en PDF

# Étape 9 : Rédiger le rapport
# Classer les vulnérabilités par CVSS décroissant
# Pour chaque vulnérabilité :
# - CVE, CVSS, description, service affecté
# - Preuve (sortie Nmap ou OpenVAS)
# - Impact dans le contexte du lab
# - Recommandation de correction
```

---

## Navigation

← Fiche précédente : **[02 - Sécurité Web et Applicative](02-securite-web-applicative.md)**

→ Fiche suivante : **[04 - Introduction au SOC et Monitoring](04-introduction-soc-monitoring.md)**
