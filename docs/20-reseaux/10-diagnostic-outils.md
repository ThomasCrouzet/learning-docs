---
tags:
  - Réseaux
  - Intermédiaire
  - Pratique
description: "Diagnostic et outils réseau : ping, traceroute, netstat/ss, tcpdump, Wireshark, nmap, dig/nslookup."
estimated_time: "75 min"
fiche_number: 10
total_fiches: 14
cursus: "Réseaux"
id: "infrastructure.networks.diagnostic-outils"
course_id: "infrastructure.networks"
content_type: "lesson"
order: 10
---

# 10 - Diagnostic et outils

> **En bref** : Tu apprendras à utiliser les outils essentiels de diagnostic réseau (ping, traceroute, ss, tcpdump, Wireshark, nmap, dig) pour identifier et résoudre les problèmes de connectivité, de performance et de sécurité. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [09 - Wi-Fi et sécurité sans fil](09-wifi-securite.md)
- Connaître les bases de TCP/IP (adresses IP, ports, protocoles)
- Savoir utiliser un terminal Linux

## Objectif de cette fiche

À la fin de cette fiche, tu sauras diagnostiquer les problèmes réseau courants en utilisant les bons outils au bon moment, capturer et analyser du trafic réseau, et scanner un réseau pour identifier les machines et services actifs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le diagnostic réseau ?

**Définition** : Le diagnostic réseau est l'ensemble des techniques et outils qui permettent d'identifier, localiser et résoudre les problèmes de communication entre machines. Il suit une méthodologie par couches : on verifie la connectivité physique, puis la couche IP, puis la couche transport, puis la couche application.

**Le problème que le diagnostic réseau résout** :

Sans méthodologie de diagnostic, voici les problèmes rencontres :

1. **Tâtonnement** : Tu essaies des solutions au hasard sans comprendre la cause du problème. Tu redemarres le routeur, le serveur, le PC, et parfois ca fonctionne, parfois non.
2. **Mauvais diagnostic** : Tu suspectes le serveur web alors que le problème vient du DNS. Tu perds du temps a chercher au mauvais endroit.
3. **Problèmes intermittents** : Certains problèmes n'apparaissent que ponctuellement. Sans outil de capture, tu ne peux pas les observer.

**Comment le diagnostic réseau résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tâtonnement | Methodologie par couches : physique, IP, transport, application |
| Mauvais diagnostic | Chaque outil cible une couche spécifique |
| Problèmes intermittents | Les outils de capture enregistrent le trafic pour analyse ulterieure |

**Methodologie de diagnostic par couches** :

| Étape | Couche | Outil | Question |
| --- | --- | --- | --- |
| 1 | Physique/Lien | `ip link`, `ethtool` | Le cable est-il branche ? L'interface est-elle active ? |
| 2 | Réseau (IP) | `ping`, `traceroute` | La machine distante est-elle joignable ? Quel chemin prend le trafic ? |
| 3 | Transport (TCP/UDP) | `ss`, `nmap`, `tcpdump` | Le port est-il ouvert ? Les paquets arrivent-ils ? |
| 4 | Application | `curl`, `dig`, `openssl` | Le service répond-il correctement ? |

**Analogie concrète** : Diagnostiquer un problème réseau, c'est comme chercher une panne dans une installation electrique. Tu commences par vérifier que le courant arrive au compteur (couche physique). Puis tu verifies les disjoncteurs (couche réseau). Puis tu verifies la prise (couche transport). Enfin, tu verifies l'appareil lui-même (couche application). Sauter des étapes peut te faire perdre du temps.

---

### Qu'est-ce que ping ?

**Définition** : `ping` est un outil qui envoie des paquets ICMP Echo Request a une machine distante et attend les réponses (ICMP Echo Reply). Il permet de vérifier la connectivité et de mesurer la latence.

**Les informations fournies par ping** :

| Information | Signification |
| --- | --- |
| `time=X ms` | Latence (temps aller-retour) |
| `ttl=X` | Nombre de sauts maximum restants (Time To Live) |
| `X packets transmitted, X received` | Taux de perte de paquets |
| `min/avg/max/mdev` | Statistiques de latence |

---

### Qu'est-ce que traceroute ?

**Définition** : `traceroute` affiche le chemin réseau suivi par les paquets entre ta machine et une destination. Il identifie chaque routeur intermédiaire (saut) et mesure la latence a chaque étape.

**Le problème que traceroute résout** :

Sans traceroute, quand un service distant ne répond pas, tu ne sais pas si le problème vient de ton réseau local, de ton FAI, d'un routeur intermédiaire ou du serveur de destination. Traceroute montre exactement ou le trafic est bloque ou ralenti.

---

### Qu'est-ce que ss (anciennement netstat) ?

**Définition** : `ss` (Socket Statistics) est un outil qui affiche les connexions réseau actives, les ports en écoute et les statistiques des sockets. Il remplace `netstat` qui est plus lent et deprecie.

**Comparaison ss vs netstat** :

| ss | netstat |
| --- | --- |
| Rapide (lit directement /proc) | Plus lent (appels système) |
| Syntaxe moderne | Syntaxe historique |
| Installe par défaut | Necessite le paquet `net-tools` |
| Commande : `ss -tlnp` | Commande : `netstat -tlnp` |

---

### Qu'est-ce que tcpdump ?

**Définition** : `tcpdump` est un analyseur de paquets en ligne de commande. Il capture le trafic réseau qui passe sur une interface et l'affiche en temps réel ou le sauvegarde dans un fichier pour analyse ulterieure.

**Le problème que tcpdump résout** :

Sans tcpdump, voici les problèmes rencontres :

1. **Problèmes invisibles** : Un service ne répond pas, mais les logs applicatifs ne montrent rien. Le problème est peut-être au niveau réseau (paquets perdus, resets TCP, timeout).
2. **Diagnostic de performance** : Le service est lent, mais tu ne sais pas si c'est la latence réseau, la taille des paquets ou le nombre de retransmissions.

**Comment tcpdump résout ces problèmes** :

| Problème | Solution apportée par tcpdump |
| --- | --- |
| Problèmes invisibles | Capture les paquets bruts pour voir exactement ce qui transite |
| Diagnostic de performance | Montre les temps de réponse, les retransmissions et les resets |

---

### Qu'est-ce que Wireshark ?

**Définition** : Wireshark est un analyseur de paquets avec une interface graphique. Il permet de capturer, filtrer et analyser le trafic réseau de maniere visuelle. Il lit aussi les fichiers de capture generes par tcpdump.

**Ce que Wireshark n'est PAS** :

- Wireshark n'est pas un outil offensif. Il capture le trafic sur l'interface locale. Il ne peut pas intercepter le trafic entre deux autres machines (sauf configuration spécifique : port mirroring, ARP spoofing).
- Wireshark n'est pas un outil temps réel pour la production. Pour la capture en production, utilise tcpdump (plus léger) et analyse les fichiers `.pcap` avec Wireshark ensuite.

La progression dédiée (filtres BPF et d'affichage, flux TCP, tshark, cadre légal des pcap) est dans le cursus [Analyse réseau](../30-analyse-reseau/index.md).

---

### Qu'est-ce que nmap ?

**Définition** : `nmap` (Network Mapper) est un outil de decouverte réseau et d'audit de sécurité. Il scanne les ports d'une machine ou d'un réseau pour identifier les services actifs, les versions des logiciels et les systèmes d'exploitation.

**Le problème que nmap résout** :

Sans nmap, voici les problèmes rencontres :

1. **Inventaire réseau inexistant** : Tu ne sais pas combien de machines sont actives sur le réseau et quels services elles exposent.
2. **Ports ouverts non documentes** : Un serveur a des ports ouverts dont personne ne connaît l'usage. Ce sont des failles de sécurité potentielles.

---

### Qu'est-ce que dig/nslookup ?

**Définition** : `dig` (Domain Information Groper) et `nslookup` sont des outils de requête DNS. Ils permettent de résoudre des noms de domaine en adresses IP, de vérifier les enregistrements DNS et de diagnostiquer les problèmes de resolution de noms.

**Comparaison dig vs nslookup** :

| dig | nslookup |
| --- | --- |
| Sortie détaillée (format DNS complet) | Sortie simplifiée |
| Plus d'options de requête | Interface interactive |
| Prefere par les administrateurs | Plus simple pour les débutants |
| Installe via `dnsutils` | Installe via `dnsutils` |

---

## Étapes Pratiques

### Étape 1 : Utiliser ping

```bash
# Ping une machine distante (4 paquets)
ping -c 4 8.8.8.8
```

**Résultat attendu** :

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=117 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=117 time=11.9 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
rtt min/avg/max/mdev = 11.800/12.025/12.300/0.185 ms
```

```bash
# Ping un nom de domaine (teste aussi la resolution DNS)
ping -c 4 example.com

# Ping avec taille de paquet personnalisee (teste la fragmentation)
ping -c 4 -s 1472 8.8.8.8

# Ping en continu avec intervalle d'une seconde (Ctrl+C pour arreter)
ping -i 1 8.8.8.8
```

---

### Étape 2 : Utiliser traceroute

```bash
# Trace le chemin vers une destination
traceroute 8.8.8.8
```

**Résultat attendu** :

```text
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1 (192.168.1.1)  1.234 ms  0.987 ms  1.012 ms
 2  10.0.0.1 (10.0.0.1)  5.678 ms  5.432 ms  5.567 ms
 3  isp-router.example.net (203.0.113.1)  12.345 ms  11.987 ms  12.123 ms
 4  * * *
 5  dns.google (8.8.8.8)  12.567 ms  12.234 ms  12.456 ms
```

```bash
# Traceroute avec protocole TCP (contourne certains firewalls qui bloquent ICMP)
sudo traceroute -T -p 443 example.com

# Traceroute rapide avec MTR (combine ping et traceroute)
mtr -c 10 --report 8.8.8.8
```

**Résultat attendu** (MTR) :

```text
HOST: machine                  Loss%   Snt   Last   Avg  Best  Wrst StDev
  1.|-- 192.168.1.1             0.0%    10    1.2   1.1   0.9   1.5   0.2
  2.|-- 10.0.0.1                0.0%    10    5.6   5.4   5.1   6.2   0.3
  3.|-- isp-router              0.0%    10   12.3  12.1  11.8  12.8   0.3
  4.|-- ???                    100.0    10    0.0   0.0   0.0   0.0   0.0
  5.|-- dns.google              0.0%    10   12.5  12.3  12.0  13.1   0.3
```

---

### Étape 3 : Utiliser ss

```bash
# Liste tous les ports TCP en ecoute avec le processus associe
sudo ss -tlnp
```

**Résultat attendu** :

```text
State  Recv-Q Send-Q  Local Address:Port   Peer Address:Port  Process
LISTEN 0      128           0.0.0.0:22          0.0.0.0:*      users:(("sshd",pid=1234,fd=3))
LISTEN 0      511           0.0.0.0:80          0.0.0.0:*      users:(("nginx",pid=5678,fd=6))
LISTEN 0      511           0.0.0.0:443         0.0.0.0:*      users:(("nginx",pid=5678,fd=7))
```

```bash
# Liste toutes les connexions TCP etablies
ss -tn

# Compte le nombre de connexions par etat
ss -s

# Filtre les connexions vers un port specifique
ss -tn dport = :443

# Filtre les connexions depuis une adresse IP
ss -tn src 192.168.1.0/24
```

**Résultat attendu** (ss -s) :

```text
Total: 234
TCP:   45 (estab 12, closed 8, orphaned 0, timewait 5)
Transport Total     IP        IPv6
RAW       0         0         0
UDP       6         4         2
TCP       37        25        12
INET      43        29        14
FRAG      0         0         0
```

---

### Étape 4 : Utiliser tcpdump

```bash
# Capture le trafic sur l'interface eth0 (10 paquets)
sudo tcpdump -i eth0 -c 10
```

**Résultat attendu** :

```text
14:30:45.123456 IP 192.168.1.10.54321 > 104.20.23.154.80: Flags [S], seq 123456, win 64240
14:30:45.135678 IP 104.20.23.154.80 > 192.168.1.10.54321: Flags [S.], seq 654321, ack 123457
14:30:45.135789 IP 192.168.1.10.54321 > 104.20.23.154.80: Flags [.], ack 654322
```

```bash
# Capture uniquement le trafic HTTP (port 80)
sudo tcpdump -i eth0 -c 20 port 80

# Capture le trafic vers/depuis une adresse IP specifique
sudo tcpdump -i eth0 -c 20 host 192.168.1.1

# Capture avec details complets (en-tetes)
sudo tcpdump -i eth0 -c 5 -vv port 443

# Sauvegarde la capture dans un fichier pour analyse avec Wireshark
sudo tcpdump -i eth0 -c 100 -w /tmp/capture.pcap

# Lit un fichier de capture
tcpdump -r /tmp/capture.pcap

# Capture le trafic DNS
sudo tcpdump -i eth0 -c 10 port 53
```

```bash
# Filtre avance : trafic TCP SYN (tentatives de connexion)
sudo tcpdump -i eth0 -c 10 'tcp[tcpflags] & tcp-syn != 0'
```

---

### Étape 5 : Utiliser nmap

**Cadre** : tu ne scannes que `127.0.0.1` ou une machine que tu possèdes, avec autorisation. Un scan vers un tiers (y compris `example.com`) peut être illégal et vu comme une attaque.

```bash
# Scanne les ports communs de la machine locale (laboratoire)
nmap 127.0.0.1
```

**Résultat attendu** :

```text
Starting Nmap 7.94 ( https://nmap.org ) at 2026-08-20 14:30 CET
Nmap scan report for localhost (127.0.0.1)
Host is up (0.00012s latency).
Not shown: 997 closed tcp ports (conn-refused)
PORT    STATE SERVICE
22/tcp  open  ssh
80/tcp  open  http
443/tcp open  https

Nmap done: 1 IP address (1 host up) scanned in 0.23 seconds
```

```bash
# Scanne tous les ports (1-65535) de la machine locale
nmap -p- 127.0.0.1

# Scanne avec detection de version des services
nmap -sV 127.0.0.1

# Scanne avec detection du systeme d'exploitation (laboratoire uniquement)
sudo nmap -O 127.0.0.1
```

**Résultat attendu** : Nmap liste les ports ouverts de `127.0.0.1`. Un scan de sous-réseau (`-sn 192.168.1.0/24`) n'est légitime que sur un LAN que tu administres.

```bash
# Scan de vulnerabilites basique avec les scripts NSE
# Scripts "vuln" : uniquement 127.0.0.1, jamais un tiers
nmap --script vuln 127.0.0.1
```

---

### Étape 6 : Utiliser dig et nslookup

```bash
# Resolution DNS basique
dig example.com
```

**Résultat attendu** (les adresses A de example.com évoluent ; plusieurs réponses possibles) :

```text
; <<>> DiG 9.18.28 <<>> example.com
;; ANSWER SECTION:
example.com.        86400   IN      A       104.20.23.154

;; Query time: 23 msec
;; SERVER: 192.168.1.1#53(192.168.1.1) (UDP)
```

```bash
# Resolution DNS avec un serveur specifique
dig @8.8.8.8 example.com

# Requete pour un type d'enregistrement specifique
dig example.com MX          # Serveurs mail
dig example.com NS          # Serveurs DNS autoritaires
dig example.com TXT         # Enregistrements texte (SPF, DKIM)
dig example.com AAAA        # Adresse IPv6

# Resolution inverse (IP vers nom). example.com est souvent derriere un CDN :
# son PTR ne renvoie pas "example.com". Utilise une IP avec un PTR stable :
dig -x 8.8.8.8
# Resultat typique : dns.google.

# Requete courte (reponse uniquement ; une ou plusieurs IP possibles)
dig +short example.com

# Trace le chemin de resolution DNS
dig +trace example.com
```

```bash
# Alternative avec nslookup
nslookup example.com
nslookup -type=MX example.com
```

**Résultat attendu** (nslookup) :

```text
Server:     192.168.1.1
Address:    192.168.1.1#53

Non-authoritative answer:
Name:   example.com
Address: 104.20.23.154
```

---

### Étape 7 : Combiner les outils pour un diagnostic complet

Voici un scénario de diagnostic complet : un site web ne répond pas.

```bash
# Etape 1 : Verifier la resolution DNS
dig +short example.com
# Si pas de reponse : probleme DNS
# Note : example.com peut renvoyer plusieurs adresses A ; retiens-en une pour la suite
EXAMPLE_IP=$(dig +short example.com A | head -1)

# Etape 2 : Verifier la connectivite IP
ping -c 3 "$EXAMPLE_IP"
# Si pas de reponse : probleme reseau ou machine eteinte

# Etape 3 : Tracer le chemin reseau
traceroute "$EXAMPLE_IP"
# Identifie ou le trafic est bloque

# Etape 4 : Verifier le port du service
nmap -p 80,443 127.0.0.1
# Si port ferme : service arrete ou firewall

# Etape 5 : Tester le service HTTP
curl -I "http://${EXAMPLE_IP}"
# Si timeout : probleme applicatif

# Etape 6 : Capturer le trafic pour analyse detaillee
sudo tcpdump -i eth0 -c 20 host "$EXAMPLE_IP" -w /tmp/debug.pcap
curl "http://${EXAMPLE_IP}"
# Analyse le fichier pcap avec Wireshark
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ping -c 4 <host>` | Teste la connectivité (4 paquets) |
| `traceroute <host>` | Affiche le chemin réseau |
| `mtr --report <host>` | Combine ping et traceroute |
| `sudo ss -tlnp` | Liste les ports TCP en écoute |
| `ss -tn` | Liste les connexions TCP etablies |
| `sudo tcpdump -i <iface> -c 10` | Capture 10 paquets |
| `sudo tcpdump -w /tmp/capture.pcap` | Sauvegarde la capture |
| `nmap <host>` | Scanne les ports courants |
| `nmap -sn <subnet>` | Découvre les machines actives |
| `nmap -sV <host>` | Detecte les versions des services |
| `dig <domain>` | Requête DNS |
| `dig +short <domain>` | Requête DNS (réponse courte) |
| `dig -x <ip>` | Resolution DNS inverse |

---

## Pièges Fréquents

### Piège 1 : Ping bloque ne signifie pas machine éteinte

⚠️ **Problème** : Tu testes la connectivité avec ping et tu ne reçois pas de réponse. Tu conclus que la machine est éteinte, alors qu'elle a un firewall qui bloque ICMP.

✅ **Solution** : Utilise d'autres méthodes pour vérifier :

```bash
# Si le ping ne repond pas, teste directement le port du service
nmap -p 22,80,443 127.0.0.1

# Ou utilise un traceroute TCP
sudo traceroute -T -p 443 192.168.1.10
```

---

### Piège 2 : nmap considere comme une attaque

⚠️ **Problème** : Tu scannes un réseau avec nmap et tu declenches des alertes de sécurité ou tu te fais bloquer par un IDS/IPS.

✅ **Solution** : Ne scanne **jamais** un réseau sans autorisation. En environnement de production, previens l'équipe sécurité avant de lancer un scan. Utilise les options douces :

```bash
# Scan discret (plus lent mais moins detecte)
nmap -T2 -sV 127.0.0.1

# Scan d'un seul port specifique
nmap -p 80 127.0.0.1
```

---

### Piège 3 : tcpdump sans filtre sur un serveur charge

⚠️ **Problème** : Tu lances `sudo tcpdump -i eth0` sur un serveur qui reçoit des milliers de connexions par seconde. Le terminal est submerge de données et la capture consomme trop de CPU.

✅ **Solution** : Utilise toujours des filtres et une limite de paquets :

```bash
# ❌ Mauvais : capture tout, indefiniment
sudo tcpdump -i eth0

# ✅ Bon : filtre par port, limite a 50 paquets, sauvegarde dans un fichier
sudo tcpdump -i eth0 -c 50 port 80 -w /tmp/debug.pcap
```

---

### Piège 4 : dig sans vérifier le serveur DNS utilise

⚠️ **Problème** : Tu fais un `dig example.com` et le résultat ne correspond pas a ce que tu attends. Tu ne verifies pas quel serveur DNS a repondu. Le problème vient peut-être du cache DNS local.

✅ **Solution** : Teste toujours avec un serveur DNS spécifique :

```bash
# Compare le resultat du DNS local et d'un DNS public
dig example.com @192.168.1.1      # DNS local
dig example.com @8.8.8.8          # DNS Google
dig example.com @1.1.1.1          # DNS Cloudflare
```

---

## Checklist de Validation

- [ ] Je sais utiliser ping pour tester la connectivité et mesurer la latence
- [ ] Je sais utiliser traceroute pour identifier le chemin réseau
- [ ] Je sais utiliser ss pour lister les ports en écoute et les connexions actives
- [ ] Je sais capturer du trafic avec tcpdump et sauvegarder dans un fichier pcap
- [ ] Je sais scanner les ports d'une machine avec nmap
- [ ] Je sais découvrir les machines actives sur un sous-réseau avec nmap
- [ ] Je sais faire des requêtes DNS avec dig (A, MX, NS, AAAA, PTR)
- [ ] Je connais la méthodologie de diagnostic par couches (physique, IP, transport, application)

---

## Exercice Pratique

**Énoncé** : Realise un diagnostic réseau complet en suivant ces étapes :

1. Verifie que `example.com` est joignable (ping)
2. Trace le chemin réseau vers `example.com` (traceroute)
3. Resous le nom `example.com` avec dig et note l'adresse IP
4. Scanne les ports 80 et 443 de `127.0.0.1` avec nmap (pas `example.com`)
5. Capture 10 paquets du trafic HTTP vers `example.com` avec tcpdump
6. Liste tous les ports en écoute sur ta machine locale avec ss
7. Produis un rapport de diagnostic avec tes observations

**Indications** :

- Utilise `ping -c 4` pour limiter le nombre de paquets
- Utilise `dig +short` pour une sortie concise
- Utilise `nmap -p 80,443` pour cibler les ports web
- Sauvegarde la capture tcpdump dans `/tmp/diagnostic.pcap`
- N'oublie pas d'utiliser sudo pour tcpdump et nmap

**Résultat attendu** : Un rapport avec la latence, le nombre de sauts, l'adresse IP resolue, les ports ouverts, un extrait de la capture réseau et la liste des services locaux.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

```bash
# 1. Ping
ping -c 4 example.com
# Resultat attendu : 4 paquets recus, latence variable, 0% perte

# 2. Traceroute
traceroute example.com
# Resultat attendu : 5-15 sauts, dernier saut = IP resolue de example.com

# 3. Resolution DNS
dig +short example.com
# Resultat attendu : une ou plusieurs adresses IPv4 (ex. 104.20.23.154)
EXAMPLE_IP=$(dig +short example.com A | head -1)

dig example.com MX
# Resultat attendu : pas d'enregistrement MX (ou 0 mail.example.com)

# 4. Scan de ports
nmap -p 80,443 127.0.0.1
# Resultat attendu : 80/tcp open http, 443/tcp open https

# 5. Capture de trafic
sudo tcpdump -i eth0 -c 10 host "$EXAMPLE_IP" -w /tmp/diagnostic.pcap &
curl -s http://example.com > /dev/null
wait
tcpdump -r /tmp/diagnostic.pcap
# Resultat attendu : handshake TCP (SYN, SYN-ACK, ACK) + requete HTTP

# 6. Ports en ecoute
sudo ss -tlnp
# Resultat attendu : liste des ports avec les processus associes

# 7. Rapport de diagnostic
echo "=== Rapport de diagnostic ==="
echo "Cible : example.com (${EXAMPLE_IP})"
echo "Latence : variable selon le reseau"
echo "Sauts : variable"
echo "Ports ouverts : 80 (HTTP), 443 (HTTPS)"
echo "DNS : resolution OK"
echo "Capture : 10 paquets sauvegardes dans /tmp/diagnostic.pcap"
```

---

## Navigation

← Fiche précédente : **[09 - Wi-Fi et sécurité sans fil](09-wifi-securite.md)**

→ Fiche suivante : **[11 - Architecture réseau d'entreprise](11-architecture-entreprise.md)**
