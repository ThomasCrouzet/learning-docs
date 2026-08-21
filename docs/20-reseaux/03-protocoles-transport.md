---
tags:
  - Réseaux
  - Débutant
  - Concept
description: "Protocoles de transport : TCP vs UDP, ports, handshake 3 voies, segments, datagrammes et controle de flux."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 14
cursus: "Réseaux"
id: "infrastructure.networks.protocoles-transport"
course_id: "infrastructure.networks"
content_type: "lesson"
order: 3
---

# 03 - Protocoles de transport

> **En bref** : Tu découvriras le rôle de la couche transport, les differences entre TCP et UDP, le fonctionnement du handshake 3 voies, les notions de ports et de sockets, et quand utiliser chaque protocole. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [02 - Adressage IP](02-adressage-ip.md) pour connaître l'adressage IPv4, les masques de sous-réseau et la notation CIDR

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le rôle de la couche transport, distinguer TCP de UDP, décrire le handshake 3 voies de TCP, identifier un service par son numéro de port, et choisir le protocole adapte a un usage donne.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la couche transport ?

**Définition** : La couche transport est la couche 4 du modèle OSI (et la deuxième couche du modèle TCP/IP). Elle assure la communication de bout en bout entre deux applications sur deux machines différentes. Elle prend les données de la couche application et les decoupe en segments (TCP) ou datagrammes (UDP) avant de les confier a la couche réseau (IP).

**Le problème que la couche transport résout** :

Sans couche transport, voici les problèmes rencontres :

1. **Pas de distinction entre applications** : La couche réseau (IP) sait envoyer des paquets d'une machine a une autre, mais elle ne sait pas a quelle application ces paquets sont destines. Si ta machine fait tourner un serveur web et un serveur mail en même temps, comment IP distingue-t-il les paquets web des paquets mail ?
2. **Pas de fiabilité** : La couche réseau (IP) est "best effort" - elle envoie les paquets sans garantie de livraison. Les paquets peuvent être perdus, dupliques ou arrives dans le desordre.
3. **Pas de controle de débit** : Sans controle, un émetteur rapide peut submerger un récepteur lent, provoquant des pertes de données.

**Comment la couche transport résout ces problèmes** :

| Problème | Solution apportée par la couche transport |
| --- | --- |
| Pas de distinction entre applications | Les numéros de ports identifient chaque application |
| Pas de fiabilité | TCP ajoute des mécanismes d'acquittement, de retransmission et de reordonnancement |
| Pas de controle de débit | TCP adapte la vitesse d'envoi a la capacité du récepteur (controle de flux) |

**Analogie concrète** : La couche réseau (IP) est comme le service postal : elle achemine les colis a la bonne adresse (la bonne machine). La couche transport est comme la reception de l'immeuble : elle lit le nom du destinataire sur le colis (le numéro de port) et le depose devant la bonne porte (la bonne application).

---

### Les ports

**Définition** : Un port est un numéro compris entre 0 et 65535 qui identifie une application ou un service spécifique sur une machine. La combinaison adresse IP + port s'appelle un socket et permet d'identifier de maniere unique un point de communication.

**Format d'un socket** : `adresse_IP:port` - exemple : `192.168.1.42:80`

**Les plages de ports** :

| Plage | Nom | Usage |
| --- | --- | --- |
| 0 - 1023 | Ports bien connus (well-known) | Réserves aux services standards (HTTP, SSH, DNS). Necessite les droits root pour écouter |
| 1024 - 49151 | Ports enregistres (registered) | Utilises par des applications connues (MySQL, PostgreSQL) |
| 49152 - 65535 | Ports dynamiques (ephemeres) | Attribues automatiquement aux connexions sortantes |

**Ports les plus courants** :

| Port | Protocole | Service |
| --- | --- | --- |
| 22 | TCP | SSH (connexion sécurisée) |
| 25 | TCP | SMTP (envoi d'e-mails) |
| 53 | TCP/UDP | DNS (resolution de noms) |
| 80 | TCP | HTTP (web non chiffre) |
| 443 | TCP | HTTPS (web chiffre) |
| 3306 | TCP | MySQL/MariaDB |
| 5432 | TCP | PostgreSQL |
| 8080 | TCP | Proxy HTTP / serveur de dev |

**Ce qu'un port n'est PAS** :

- Un port n'est pas un port physique (comme un port USB ou un port Ethernet). C'est un concept logiciel, un numéro qui identifie un processus.
- Un port n'est pas exclusif a TCP ou UDP. Le port 53 peut être utilise en TCP et en UDP simultanement (le DNS utilise les deux).

---

### TCP - Transmission Control Protocol

**Définition** : TCP est un protocole de transport oriente connexion qui garantit la livraison fiable et ordonnee des données. Avant d'envoyer des données, TCP etablit une connexion entre l'émetteur et le récepteur (handshake 3 voies).

**Le problème que TCP résout** :

Sans TCP, voici les problèmes rencontres :

1. **Paquets perdus** : Sur Internet, des paquets peuvent être perdus a cause de la congestion ou d'erreurs réseau. Sans mécanisme de retransmission, les données arrivent incompletes.
2. **Paquets dans le desordre** : Les paquets peuvent emprunter des chemins différents et arriver dans le desordre. Sans reordonnancement, un fichier telecharge serait corrompu.
3. **Paquets dupliques** : Un paquet peut être retransmis par erreur et arrive en double. Sans détection de doublons, les données seraient corrompues.

**Comment TCP résout ces problèmes** :

| Problème | Solution TCP |
| --- | --- |
| Paquets perdus | Acquittement (ACK) + retransmission automatique |
| Paquets dans le desordre | Numéros de séquence pour reordonner |
| Paquets dupliques | Numéros de séquence pour détecter les doublons |

**Caractéristiques de TCP** :

- **Oriente connexion** : connexion etablie avant l'envoi de données
- **Fiable** : chaque segment est acquitte par le récepteur
- **Ordonne** : les segments sont numerotes et reordonnes a l'arrivée
- **Controle de flux** : l'émetteur adapte sa vitesse a la capacité du récepteur
- **Controle de congestion** : TCP réduit le débit quand le réseau est sature

---

### Le handshake 3 voies de TCP

**Définition** : Le handshake 3 voies (three-way handshake) est le processus d'etablissement d'une connexion TCP. Il se deroule en 3 étapes et garantit que les deux parties sont pretes a communiquer.

**Les 3 étapes** :

```text
Client                          Serveur
   |                               |
   |------- SYN (seq=100) -------->|   1. Le client demande une connexion
   |                               |
   |<----- SYN-ACK (seq=300,  ----|   2. Le serveur accepte et propose
   |        ack=101)               |      sa propre connexion
   |                               |
   |------- ACK (ack=301) -------->|   3. Le client confirme
   |                               |
   |    Connexion etablie ✅       |
```

Explication de chaque étape :

1. **SYN** (Synchronize) : Le client envoie un segment SYN avec un numéro de séquence initial (ISN), ici `100`. Il dit : "Je veux communiquer, mon premier numéro de séquence sera 100."
2. **SYN-ACK** : Le serveur répond avec un segment SYN-ACK. Il acquitte le SYN du client (`ack=101`, ce qui signifie "j'attends le segment 101") et propose son propre numéro de séquence (`seq=300`).
3. **ACK** (Acknowledge) : Le client acquitte le SYN du serveur (`ack=301`). La connexion est etablie dans les deux sens.

**Fermeture de connexion TCP (4 étapes)** :

```text
Client                          Serveur
   |------- FIN ---------------->|   1. Le client veut fermer
   |<------ ACK -----------------|   2. Le serveur acquitte
   |<------ FIN -----------------|   3. Le serveur ferme aussi
   |------- ACK ---------------->|   4. Le client acquitte
```

**Analogie concrète** : Le handshake 3 voies fonctionne comme un appel téléphonique. Tu composes le numéro (SYN). L'interlocuteur decroche et dit "Allo ?" (SYN-ACK). Tu reponds "Bonjour, c'est Thomas" (ACK). Maintenant vous pouvez parler. À la fin, l'un dit "Au revoir" (FIN), l'autre répond "Au revoir" (FIN-ACK) et raccroche.

---

### UDP - User Datagram Protocol

**Définition** : UDP est un protocole de transport sans connexion qui envoie des datagrammes sans garantie de livraison, d'ordre ou d'intégrité. Il est plus rapide que TCP car il n'a pas de mécanisme d'acquittement ni de connexion prealable.

**Le problème que UDP résout** :

TCP ajoute de la fiabilité mais aussi de la latence (délai). Pour certaines applications, la rapidite est plus importante que la fiabilité :

1. **Streaming video** : Un pixel perdu pendant un appel video est invisible. Attendre la retransmission du paquet perdu causerait un gel de l'image, ce qui est pire.
2. **Jeux en ligne** : La position d'un joueur il y a 100 ms n'a plus de valeur. Mieux vaut recevoir la position actuelle que retransmettre l'ancienne.
3. **DNS** : Une requête DNS est courte (un seul paquet). Etablir une connexion TCP (3 paquets) pour envoyer une requête de 1 paquet serait du gaspillage.

**Caractéristiques de UDP** :

- **Sans connexion** : pas de handshake, les datagrammes sont envoyés directement
- **Non fiable** : pas d'acquittement, pas de retransmission
- **Non ordonne** : les datagrammes peuvent arriver dans n'importe quel ordre
- **Rapide** : pas de délai d'etablissement de connexion, pas d'en-tete volumineux
- **Léger** : l'en-tete UDP fait 8 octets (contre 20 octets minimum pour TCP)

---

### Comparaison TCP vs UDP

| Critère | TCP | UDP |
| --- | --- | --- |
| Type de connexion | Oriente connexion (handshake) | Sans connexion |
| Fiabilite | Garantie (ACK + retransmission) | Aucune garantie |
| Ordre des données | Garanti (numéros de séquence) | Non garanti |
| Controle de flux | Oui | Non |
| Vitesse | Plus lent (overhead du controle) | Plus rapide |
| Taille de l'en-tete | 20 octets minimum | 8 octets |
| Usage typique | Web (HTTP), mail (SMTP), transfert de fichiers (FTP) | DNS, streaming, jeux en ligne, VoIP |

**Règle simple pour choisir** :

- **Utilise TCP** quand les données doivent arriver complètes et dans l'ordre (web, e-mail, fichiers, bases de données)
- **Utilise UDP** quand la vitesse prime sur la fiabilité (streaming, jeux, DNS, VoIP)

---

### Segments TCP et datagrammes UDP

**Définition** : L'unité de données au niveau de la couche transport s'appelle un segment (pour TCP) ou un datagramme (pour UDP). Chaque unité contient un en-tete avec les informations du protocole et les données utiles (payload).

**En-tete TCP (20 octets minimum)** :

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Port source           |       Port destination        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                      Numero de sequence                       |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|                     Numero d'acquittement                     |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|Offset| Res |U|A|P|R|S|F|       Fenetre (Window)              |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|        Checksum               |       Pointeur urgent         |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

Les champs importants :

- **Port source / destination** : identifient les applications
- **Numéro de séquence** : position de ce segment dans le flux de données
- **Numéro d'acquittement** : indique le prochain octet attendu
- **Flags** : SYN, ACK, FIN, RST (controle de connexion)
- **Fenêtre** : taille du buffer de reception (controle de flux)

**En-tete UDP (8 octets)** :

```text
 0                   1                   2                   3
 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|         Port source           |       Port destination        |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
|          Longueur             |          Checksum             |
+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
```

UDP est beaucoup plus simple : seulement 4 champs. Pas de numéro de séquence, pas d'acquittement, pas de controle de flux.

---

## Étapes Pratiques

### Étape 1 : Lister les ports en écoute sur ta machine

```bash
# Liste tous les ports TCP et UDP en ecoute
ss -tuln
```

**Résultat attendu** :

```text
Netid  State   Recv-Q  Send-Q    Local Address:Port   Peer Address:Port
tcp    LISTEN  0       128       0.0.0.0:22            0.0.0.0:*
tcp    LISTEN  0       128       0.0.0.0:80            0.0.0.0:*
udp    UNCONN  0       0         127.0.0.53%lo:53      0.0.0.0:*
```

Explication des colonnes :

- `Netid` : le protocole (`tcp` ou `udp`)
- `State` : `LISTEN` pour TCP (en attente de connexions), `UNCONN` pour UDP (sans connexion)
- `Local Address:Port` : l'adresse et le port en écoute
- `0.0.0.0:22` signifie : le service SSH écoute sur le port 22, sur toutes les interfaces

---

### Étape 2 : Identifier les services par leur port

```bash
# Affiche les ports en ecoute avec le nom du processus
ss -tulnp
```

**Résultat attendu** :

```text
Netid  State   Local Address:Port   Process
tcp    LISTEN  0.0.0.0:22           users:(("sshd",pid=1234,fd=3))
tcp    LISTEN  0.0.0.0:80           users:(("nginx",pid=5678,fd=6))
udp    UNCONN  127.0.0.53%lo:53     users:(("systemd-resolve",pid=789,fd=13))
```

Tu vois que :

- Le port 22 est utilise par `sshd` (serveur SSH)
- Le port 80 est utilise par `nginx` (serveur web)
- Le port 53 est utilise par `systemd-resolve` (resolution DNS locale)

---

### Étape 3 : Observer le handshake TCP avec tcpdump

```bash
# Capture les 10 premiers paquets d'une connexion TCP vers un serveur web
sudo tcpdump -c 10 -i eth0 -n port 80
```

Dans un autre terminal, genere du trafic HTTP :

```bash
# Envoie une requete HTTP vers un serveur
curl -s http://example.com > /dev/null
```

**Résultat attendu dans tcpdump** :

```text
14:32:01.001 IP 192.168.1.42.54321 > 104.20.23.154.80: Flags [S], seq 123456
14:32:01.025 IP 104.20.23.154.80 > 192.168.1.42.54321: Flags [S.], seq 789012, ack 123457
14:32:01.025 IP 192.168.1.42.54321 > 104.20.23.154.80: Flags [.], ack 789013
14:32:01.026 IP 192.168.1.42.54321 > 104.20.23.154.80: Flags [P.], seq 123457:123520, ack 789013
```

Les flags correspondent aux étapes du handshake :

- `[S]` = SYN (étape 1 : le client demande une connexion)
- `[S.]` = SYN-ACK (étape 2 : le serveur accepte)
- `[.]` = ACK (étape 3 : le client confirme)
- `[P.]` = PSH-ACK (envoi de données HTTP)

---

### Étape 4 : Observer du trafic UDP avec tcpdump

```bash
# Capture les paquets DNS (port 53, souvent en UDP)
sudo tcpdump -c 5 -i eth0 -n port 53
```

Dans un autre terminal :

```bash
# Genere une requete DNS
nslookup example.com
```

**Résultat attendu** :

```text
14:33:01.001 IP 192.168.1.42.45678 > 8.8.8.8.53: UDP, length 32
14:33:01.015 IP 8.8.8.8.53 > 192.168.1.42.45678: UDP, length 48
```

Remarque qu'il n'y a que 2 paquets (requête + réponse). Pas de handshake, pas d'acquittement. C'est la simplicite d'UDP.

---

### Étape 5 : Vérifier la connectivité sur un port spécifique

```bash
# Teste si le port 22 (SSH) est ouvert sur ta machine
ss -tln | grep :22
```

**Résultat attendu** :

```text
LISTEN  0  128  0.0.0.0:22  0.0.0.0:*
```

Si aucun résultat, le port 22 n'est pas en écoute (le service SSH n'est pas lance).

Pour tester un port sur une machine distante :

```bash
# Resout l'IP actuelle de example.com (elle peut changer), puis teste le port 80
EXAMPLE_IP=$(dig +short example.com A | head -1)
timeout 3 bash -c "echo > /dev/tcp/${EXAMPLE_IP}/80 && echo \"Port ouvert\" || echo \"Port ferme\""
```

**Résultat attendu** :

```text
Port ouvert
```

---

### Étape 6 : Observer les états d'une connexion TCP

```bash
# Affiche toutes les connexions TCP avec leur etat
ss -tn
```

**Résultat attendu** :

```text
State      Recv-Q Send-Q  Local Address:Port   Peer Address:Port
ESTAB      0      0       192.168.1.42:54321   104.20.23.154:80
TIME-WAIT  0      0       192.168.1.42:54322   104.20.23.154:443
```

Les états principaux d'une connexion TCP :

| État | Signification |
| --- | --- |
| LISTEN | En attente de connexions entrantes |
| SYN-SENT | SYN envoyé, attente du SYN-ACK |
| ESTABLISHED | Connexion etablie, échange de données en cours |
| FIN-WAIT-1 | FIN envoyé, attente de l'acquittement |
| TIME-WAIT | Connexion fermee, attente avant reutilisation du port |
| CLOSE-WAIT | FIN reçu, attente de la fermeture locale |

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ss -tuln` | Liste les ports TCP et UDP en écoute |
| `ss -tulnp` | Liste les ports en écoute avec le nom du processus |
| `ss -tn` | Affiche les connexions TCP etablies avec leur état |
| `sudo tcpdump -c 10 -i eth0 port 80` | Capture 10 paquets TCP sur le port 80 |
| `sudo tcpdump -c 5 -i eth0 port 53` | Capture 5 paquets DNS (UDP) |
| `nc -zv <ip> <port>` | Teste si un port est ouvert sur une machine distante |

---

## Pièges Fréquents

### Piège 1 : Penser que UDP est "mauvais" parce qu'il n'est pas fiable

⚠️ **Problème** : Tu penses que TCP est toujours meilleur que UDP parce qu'il est fiable.

✅ **Solution** : UDP n'est pas mauvais, il est différent. Pour le streaming video, le DNS ou les jeux en ligne, la rapidite de UDP est un avantage. Retransmettre un paquet video perdu n'a pas de sens si l'image a déjà change. Chaque protocole a ses cas d'usage.

---

### Piège 2 : Confondre port et protocole

⚠️ **Problème** : Tu penses que le port 80 "est" HTTP. En réalité, le port 80 est une convention, pas une obligation.

✅ **Solution** : Un serveur web peut écouter sur n'importe quel port (8080, 3000, 9090). Le port 80 est le port standard pour HTTP par convention, mais rien n'empêche de changer. C'est pour cela que les URLs avec un port non standard doivent le préciser : `http://localhost:8080`.

---

### Piège 3 : Ne pas voir le handshake TCP dans tcpdump

⚠️ **Problème** : Tu lances `tcpdump` après avoir initie la connexion et tu ne vois pas le handshake.

✅ **Solution** : Lance `tcpdump` en premier, puis initie la connexion dans un second terminal. Le handshake se produit au début de la connexion. Si tu as manque le début, tu ne verras que les paquets de données.

---

### Piège 4 : Oublier que DNS utilise TCP et UDP

⚠️ **Problème** : Tu penses que DNS utilise uniquement UDP.

✅ **Solution** : Sans EDNS(0) (RFC 6891), une réponse DNS UDP dépassant 512 octets était tronquée (bit TC). Avec EDNS(0), UDP peut dépasser 512 octets. TCP reste utilisé si TC=1 et pour les transferts de zone. Les deux protocoles coexistent sur le port 53.

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle de la couche transport
- [ ] Je connais la difference entre TCP (fiable, oriente connexion) et UDP (rapide, sans connexion)
- [ ] Je peux décrire les 3 étapes du handshake TCP (SYN, SYN-ACK, ACK)
- [ ] Je sais ce qu'est un port et je connais les ports courants (22, 80, 443, 53)
- [ ] Je sais utiliser `ss -tuln` pour lister les ports en écoute
- [ ] Je sais observer le trafic réseau avec `tcpdump`
- [ ] Je sais quand utiliser TCP et quand utiliser UDP

---

## Exercice Pratique

**Énoncé** : Explore les connexions réseau de ta machine et analyse le trafic TCP et UDP.

**Questions** :

1. Quels ports sont actuellement en écoute sur ta machine ? Quels services correspondent a ces ports ?
2. Capture le handshake TCP d'une connexion HTTP vers `example.com`. Identifie les 3 étapes (SYN, SYN-ACK, ACK) dans la sortie de `tcpdump`.
3. Capture une requête DNS avec `tcpdump`. Combien de paquets sont échanges ? Quel protocole est utilise (TCP ou UDP) ?
4. Compare le nombre de paquets échanges pour une requête DNS (UDP) et pour une requête HTTP (TCP). Pourquoi la difference ?
5. Ta machine fait tourner un serveur de jeu en ligne. Quel protocole choisirais-tu (TCP ou UDP) ? Justifie.

**Indications** :

- Utilise `ss -tulnp` pour la question 1
- Lance `tcpdump` dans un terminal et `curl` dans un autre pour la question 2
- Lance `tcpdump` avec `port 53` et `nslookup` pour la question 3
- Pour la question 5, pense a ce qui est plus important : la fiabilité ou la rapidite

**Résultat attendu** : Tu as les réponses aux cinq questions et tu comprends les differences pratiques entre TCP et UDP.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Ports en écoute**

```bash
ss -tulnp
```

Résultat typique :

```text
tcp   LISTEN  0.0.0.0:22     users:(("sshd",pid=1234))
tcp   LISTEN  0.0.0.0:80     users:(("nginx",pid=5678))
udp   UNCONN  127.0.0.53:53  users:(("systemd-resolve",pid=789))
```

Réponse : Port 22 = SSH, Port 80 = Nginx (serveur web), Port 53 = DNS local. Tes résultats varieront selon les services installes sur ta machine.

**Question 2 : Handshake TCP**

Terminal 1 :

```bash
# Resout l'IP actuelle (example.com peut changer d'adresse)
EXAMPLE_IP=$(dig +short example.com A | head -1)
sudo tcpdump -c 10 -i eth0 -n host "$EXAMPLE_IP" and port 80
```

Terminal 2 :

```bash
curl -s http://example.com > /dev/null
```

Résultat dans tcpdump (les adresses IP varient selon la resolution DNS du moment) :

```text
[S]    192.168.1.42.54321 > 104.20.23.154.80    (SYN)
[S.]   104.20.23.154.80 > 192.168.1.42.54321    (SYN-ACK)
[.]    192.168.1.42.54321 > 104.20.23.154.80    (ACK)
[P.]   192.168.1.42.54321 > 104.20.23.154.80    (donnees HTTP)
```

Réponse : Les 3 premiers paquets sont le handshake : `[S]` (SYN), `[S.]` (SYN-ACK), `[.]` (ACK). Le 4eme paquet contient la requête HTTP.

**Question 3 : Requête DNS**

Terminal 1 :

```bash
sudo tcpdump -c 5 -i eth0 -n port 53
```

Terminal 2 :

```bash
nslookup example.com 8.8.8.8
```

Résultat :

```text
192.168.1.42.45678 > 8.8.8.8.53: UDP, length 32
8.8.8.8.53 > 192.168.1.42.45678: UDP, length 48
```

Réponse : 2 paquets sont échanges (1 requête + 1 réponse). Le protocole utilise est UDP.

**Question 4 : Comparaison**

- DNS (UDP) : 2 paquets (requête + réponse)
- HTTP (TCP) : au minimum 7 paquets (3 handshake + 1 requête + 1 réponse + 2 fermeture minimum)

Réponse : TCP necessite plus de paquets a cause du handshake (3 paquets supplémentaires) et de la fermeture de connexion (4 paquets). Pour une requête courte comme le DNS, ce surplus est disproportionne - d'ou l'utilisation d'UDP.

**Question 5 : Protocole pour un jeu en ligne**

Réponse : **UDP**. Dans un jeu en ligne, la position d'un joueur change constamment. Recevoir la position d'il y a 200 ms n'a aucune valeur - seule la position actuelle compte. TCP retransmettrait les paquets perdus, ajoutant de la latence. Avec UDP, si un paquet est perdu, le suivant contient des données plus recentes. La fluidite du jeu est plus importante que la garantie de livraison de chaque paquet.

---

## Navigation

← Fiche précédente : **[02 - Adressage IP](02-adressage-ip.md)**

→ Fiche suivante : **[04 - DNS et DHCP](04-dns-dhcp.md)**
