---
tags:
  - Réseaux
  - Débutant
  - Concept
description: "Introduction aux réseaux : LAN, WAN, topologies, modèle OSI, modèle TCP/IP et encapsulation des données."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 14
cursus: "Réseaux"
id: "infrastructure.networks.introduction-reseaux"
course_id: "infrastructure.networks"
content_type: "lesson"
order: 1
---

# 01 - Introduction aux réseaux

> **En bref** : Tu découvriras ce qu'est un réseau informatique, les types de réseaux (LAN, WAN), les topologies physiques et logiques, le modèle OSI en 7 couches et le modèle TCP/IP en 4 couches. Lecture estimée : 60 min.

## Prérequis

- Savoir utiliser le terminal Linux (ouvrir un terminal, taper une commande, lire le résultat) - cursus [Unix/Bash](../fondamentaux/02-unix-bash/index.md)
- Aucune connaissance prealable des réseaux n'est requise (tout est explique ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras définir ce qu'est un réseau, distinguer un LAN d'un WAN, décrire les principales topologies réseau, nommer les 7 couches du modèle OSI et les 4 couches du modèle TCP/IP, et expliquer le principe d'encapsulation.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un réseau informatique ?

**Définition** : Un réseau informatique est un ensemble d'équipements (ordinateurs, serveurs, smartphones, imprimantes) connectes entre eux pour échanger des données. La connexion peut être filaire (cable Ethernet) ou sans fil (Wi-Fi).

**Le problème que les réseaux résolvent** :

Sans réseau, voici les problèmes rencontres :

1. **Isolation des machines** : Chaque ordinateur fonctionne seul. Pour transmettre un fichier a un collègue, tu dois le copier sur une clé USB et l'apporter physiquement.
2. **Pas de ressources partagées** : Chaque machine a besoin de sa propre imprimante, de son propre stockage et de ses propres logiciels. Cela coûte cher et gaspille des ressources.
3. **Pas de communication instantanée** : Sans réseau, pas d'e-mail, pas de messagerie, pas de visioconference. Toute communication passe par le telephone ou le deplacement physique.

**Comment les réseaux résolvent ces problèmes** :

| Problème | Solution apportée par les réseaux |
| --- | --- |
| Isolation des machines | Les machines echangent des données directement via des cables ou des ondes radio |
| Pas de ressources partagées | Une imprimante, un serveur de fichiers ou une base de données sont accessibles par toutes les machines du réseau |
| Pas de communication instantanée | Les protocoles réseau permettent l'e-mail, la messagerie, le web et la visioconference |

**Analogie concrète** : Un réseau informatique fonctionne comme le réseau routier d'une ville. Les routes connectent les maisons (les machines), les voitures transportent des marchandises (les données), et les carrefours et ronds-points dirigent le trafic (les routeurs et switchs). Sans routes, chaque maison serait isolée.

**Ce qu'un réseau n'est PAS** :

- Un réseau n'est pas Internet. Internet est un réseau spécifique (le plus grand du monde), mais un réseau peut être purement local, sans aucune connexion a Internet. Par exemple, deux ordinateurs relies par un cable Ethernet forment un réseau.
- Un réseau n'est pas un cable. Le cable est un support de transmission. Le réseau, c'est l'ensemble : équipements + support de transmission + protocoles de communication.

---

### Types de réseaux : LAN, WAN et les autres

**Définition** : Les réseaux sont classes selon leur etendue geographique. Les deux types principaux sont le LAN (réseau local) et le WAN (réseau etendu).

**LAN - Local Area Network (réseau local)** :

Un LAN couvre une zone geographique restreinte : un bureau, un étage, un bâtiment ou un campus. Les équipements sont proches les uns des autres (quelques metres a quelques centaines de metres).

Caractéristiques d'un LAN :

- **Etendue** : 1 metre a 1 kilometre environ
- **Débit** : élevé (100 Mbps a 10 Gbps en Ethernet)
- **Propriétaire** : une seule organisation possède et gère le réseau
- **Exemples** : le réseau de ton appartement, le réseau d'un bureau, le réseau Wi-Fi d'une école

**WAN - Wide Area Network (réseau etendu)** :

Un WAN couvre une zone geographique large : une ville, un pays ou le monde entier. Il relie plusieurs LAN entre eux.

Caractéristiques d'un WAN :

- **Etendue** : dizaines de kilometres a des milliers de kilometres
- **Débit** : variable, souvent inférieur a un LAN
- **Propriétaire** : souvent gère par des opérateurs telecoms (Orange, SFR, etc.)
- **Exemples** : Internet, le réseau prive d'une entreprise multi-sites

**Autres types de réseaux** :

| Type | Etendue | Exemple |
| --- | --- | --- |
| PAN (Personal Area Network) | Quelques metres | Bluetooth entre un telephone et des ecouteurs |
| LAN (Local Area Network) | Un bâtiment | Le réseau Wi-Fi de ton domicile |
| MAN (Metropolitan Area Network) | Une ville | Le réseau d'une universite reparti sur plusieurs campus |
| WAN (Wide Area Network) | Un pays ou le monde | Internet |

---

### Topologies réseau

**Définition** : La topologie d'un réseau décrit la maniere dont les équipements sont connectes entre eux. On distingue la topologie physique (la disposition réelle des cables) et la topologie logique (le chemin que suivent les données).

**Le problème que les topologies résolvent** :

Sans reflexion sur la topologie, voici les problèmes rencontres :

1. **Point unique de défaillance** : Si un seul cable ou un seul équipement tombe en panne, tout le réseau s'arrête.
2. **Performances inegales** : Certaines machines sont surchargees parce qu'elles font transiter tout le trafic.
3. **Difficulté d'extension** : Ajouter une nouvelle machine au réseau oblige a recabler tout le réseau.

**Les topologies principales** :

**Topologie en étoile** :

```text
        [PC1]
          |
[PC2]---[SWITCH]---[PC3]
          |
        [PC4]
```

Tous les équipements sont connectes a un équipement central (switch ou hub). C'est la topologie la plus courante dans les réseaux modernes.

- **Avantage** : Si un cable tombe en panne, seul l'équipement concerne est deconnecte. Les autres continuent de fonctionner.
- **Inconvénient** : Si le switch central tombe en panne, tout le réseau s'arrête.

**Topologie en bus** :

```text
[PC1]---[PC2]---[PC3]---[PC4]
          |
     (cable unique)
```

Tous les équipements partagent un seul cable. Les données circulent dans les deux directions et chaque équipement écoute le cable.

- **Avantage** : Simple et peu coûteux en cablage.
- **Inconvénient** : Si le cable est coupe, tout le réseau s'arrête. Les collisions sont fréquentes quand plusieurs machines emettent en même temps.

**Topologie en anneau** :

```text
[PC1]---[PC2]
  |       |
[PC4]---[PC3]
```

Les équipements sont relies en boucle fermee. Les données circulent dans un seul sens (ou les deux dans un double anneau).

- **Avantage** : Pas de collisions, chaque machine attend son tour pour emettre.
- **Inconvénient** : Si un équipement ou un cable tombe en panne, l'anneau est casse.

**Topologie maillee** :

```text
[PC1]---[PC2]
  |  \  / |
  |   \/  |
  |   /\  |
  |  /  \ |
[PC4]---[PC3]
```

Chaque équipement est connecte a plusieurs autres. C'est la topologie la plus resiliente mais aussi la plus coûteuse.

- **Avantage** : Plusieurs chemins possibles. Si un lien tombe en panne, les données passent par un autre chemin.
- **Inconvénient** : Beaucoup de cables et de ports nécessaires. Couteuse a mettre en place.

**Comparaison des topologies** :

| Topologie | Résilience | Coût | Usage courant |
| --- | --- | --- | --- |
| Étoile | Moyenne | Moyen | Réseaux locaux modernes |
| Bus | Faible | Faible | Réseaux anciens (obsolète) |
| Anneau | Faible | Moyen | Token Ring (obsolète) |
| Maillee | Forte | Élevé | Internet, datacenters |

---

### Le modèle OSI

**Définition** : Le modèle OSI (Open Systems Interconnection) est un modèle theorique qui decompose la communication réseau en 7 couches. Chaque couche a un rôle précis et communique avec la couche au-dessus et en dessous d'elle.

**Le problème que le modèle OSI résout** :

Sans modèle en couches, voici les problèmes rencontres :

1. **Complexite monolithique** : La communication réseau implique des dizaines de taches différentes (conversion electrique, adressage, controle d'erreurs, formatage des données). Sans modèle, tout est melange et impossible a comprendre ou a depanner.
2. **Incompatibilite** : Chaque fabricant invente son propre système. Les équipements de marques différentes ne communiquent pas entre eux.
3. **Difficulté de mise à jour** : Modifier une partie de la communication oblige a tout refaire.

**Comment le modèle OSI résout ces problèmes** :

| Problème | Solution apportée par le modèle OSI |
| --- | --- |
| Complexite monolithique | Chaque couche a un rôle unique et bien défini |
| Incompatibilite | Le modèle définit des interfaces standards entre les couches |
| Difficulté de mise à jour | Modifier une couche n'affecte pas les autres |

**Les 7 couches du modèle OSI** :

| Couche | Nom | Role | Exemple |
| --- | --- | --- | --- |
| 7 | Application | Interface avec l'utilisateur | HTTP, FTP, SMTP, DNS |
| 6 | Presentation | Formatage, chiffrement, compression | SSL/TLS, JPEG, ASCII |
| 5 | Session | Gestion des sessions de communication | NetBIOS, RPC |
| 4 | Transport | Fiabilite de la transmission, controle de flux | TCP, UDP |
| 3 | Réseau | Adressage logique et routage | IP, ICMP |
| 2 | Liaison de données | Adressage physique et accès au media | Ethernet, Wi-Fi (802.11) |
| 1 | Physique | Transmission des bits sur le support | Cables, signaux electriques, fibre optique |

**Analogie concrète** : Le modèle OSI fonctionne comme le système postal. Tu écris une lettre (couche 7 - Application). Tu la mets dans une enveloppe avec l'adresse du destinataire (couche 3 - Réseau). Le facteur la trie et la transporte par camion ou avion (couche 1 - Physique). A l'arrivée, le processus inverse se produit : le courrier est trie, distribue et ouvert par le destinataire.

**Moyen mnemotechnique** (de la couche 7 a la couche 1) :

**A**ll **P**eople **S**eem **T**o **N**eed **D**ata **P**rocessing

(Application, Presentation, Session, Transport, Network, Data Link, Physical)

**Ce que le modèle OSI n'est PAS** :

- Le modèle OSI n'est pas un protocole. C'est un modèle de référence theorique. Aucun protocole ne suit les 7 couches exactement.
- Le modèle OSI n'est pas utilise tel quel dans la pratique. Le modèle TCP/IP (4 couches) est le modèle réel d'Internet. Mais le vocabulaire OSI est utilise partout ("couche 2", "couche 3", "couche 7").

---

### Le modèle TCP/IP

**Définition** : Le modèle TCP/IP est le modèle réel sur lequel fonctionne Internet. Il comporte 4 couches et correspond a une version simplifiée et pratique du modèle OSI.

**Les 4 couches du modèle TCP/IP** :

| Couche TCP/IP | Equivalent OSI | Role | Protocoles |
| --- | --- | --- | --- |
| Application | Couches 5, 6, 7 | Protocoles de haut niveau | HTTP, DNS, SMTP, FTP, SSH |
| Transport | Couche 4 | Livraison fiable ou rapide | TCP, UDP |
| Internet | Couche 3 | Adressage et routage | IP, ICMP |
| Accès réseau | Couches 1-2 | Transmission locale | Ethernet, Wi-Fi, ARP |

**Comparaison OSI vs TCP/IP** :

| Modèle OSI | Modèle TCP/IP |
| --- | --- |
| 7 couches | 4 couches |
| Modèle theorique de référence | Modèle pratique utilise dans la réalité |
| Developpe par l'ISO | Developpe par le DoD (département de la defense américain) |
| Décrit ce que chaque couche devrait faire | Décrit ce que chaque couche fait réellement |
| Utilise pour enseigner et diagnostiquer | Utilise pour implementer les protocoles |

---

### L'encapsulation

**Définition** : L'encapsulation est le processus par lequel chaque couche du modèle ajoute un en-tete (header) aux données recues de la couche supérieure avant de les passer a la couche inférieure. A la reception, le processus inverse (desencapsulation) retire les en-tetes couche par couche.

**Le problème que l'encapsulation résout** :

Sans encapsulation, voici les problèmes rencontres :

1. **Perte d'informations** : Sans en-tetes, le destinataire ne sait pas d'ou viennent les données, quel protocole utiliser pour les lire ou si elles sont arrivées intactes.
2. **Pas de routage** : Sans adresse IP dans un en-tete, les routeurs ne savent pas ou envoyer les données.

**Le processus d'encapsulation** :

```text
Couche Application :  [Donnees]
                         |
Couche Transport :    [En-tete TCP] + [Donnees]           = Segment
                         |
Couche Internet :     [En-tete IP] + [Segment]            = Paquet
                         |
Couche Acces reseau : [En-tete Ethernet] + [Paquet] + [FCS] = Trame
```

Chaque couche donne un nom différent a l'unité de données :

| Couche | Nom de l'unité | Contenu |
| --- | --- | --- |
| Application | Données (data) | Le message brut (page web, e-mail, fichier) |
| Transport | Segment (TCP) ou Datagramme (UDP) | En-tete de transport + données |
| Internet | Paquet (packet) | En-tete IP + segment |
| Accès réseau | Trame (frame) | En-tete Ethernet + paquet + somme de controle |

**Analogie concrète** : L'encapsulation fonctionne comme un colis postal. Tu écris une lettre (données). Tu la mets dans une enveloppe avec l'adresse du destinataire (en-tete IP). Le service postal ajoute un code-barres de suivi (en-tete transport). Le tout est place dans un sac postal avec une etiquette de tri (en-tete Ethernet). A chaque étape, une nouvelle couche d'emballage est ajoutee. A l'arrivée, chaque couche est retiree dans l'ordre inverse.

---

## Étapes Pratiques

### Étape 1 : Vérifier ta connexion réseau

Commence par vérifier que ta machine est bien connectee a un réseau.

```bash
# Affiche les interfaces reseau et leurs adresses IP
ip addr show
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
```

Tu vois au moins deux interfaces :

- `lo` : l'interface de loopback (127.0.0.1). C'est une interface virtuelle qui permet a la machine de communiquer avec elle-même.
- `eth0` (ou `enp0s3`, `ens33`, etc.) : ton interface réseau physique avec ton adresse IP locale.

---

### Étape 2 : Tester la connectivité avec ping

La commande `ping` envoie des paquets ICMP a une machine distante pour vérifier qu'elle est joignable.

```bash
# Envoie 4 paquets ICMP vers l'adresse de loopback
ping -c 4 127.0.0.1
```

**Résultat attendu** :

```text
PING 127.0.0.1 (127.0.0.1) 56(84) bytes of data.
64 bytes from 127.0.0.1: icmp_seq=1 ttl=64 time=0.042 ms
64 bytes from 127.0.0.1: icmp_seq=2 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: icmp_seq=3 ttl=64 time=0.036 ms
64 bytes from 127.0.0.1: icmp_seq=4 ttl=64 time=0.035 ms

--- 127.0.0.1 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3060ms
```

Ce résultat montre :

- `icmp_seq` : le numéro de séquence de chaque paquet
- `ttl` : le Time To Live (nombre de routeurs maximum que le paquet peut traverser)
- `time` : le temps d'aller-retour en millisecondes
- `0% packet loss` : aucun paquet n'a été perdu

---

### Étape 3 : Tester la connectivité vers un hôte distant

```bash
# Envoie 4 paquets ICMP vers le serveur DNS public de Google
ping -c 4 8.8.8.8
```

**Résultat attendu** :

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=11.8 ms
64 bytes from 8.8.8.8: icmp_seq=3 ttl=118 time=12.1 ms
64 bytes from 8.8.8.8: icmp_seq=4 ttl=118 time=11.9 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss, time 3004ms
```

Remarque que le `time` est plus élevé (environ 12 ms contre 0.04 ms pour le loopback) car les paquets traversent plusieurs routeurs pour atteindre le serveur de Google.

---

### Étape 4 : Identifier la passerelle par défaut

La passerelle par défaut est le routeur qui permet a ta machine d'accéder aux réseaux extérieurs (Internet).

```bash
# Affiche la table de routage et la passerelle par defaut
ip route show
```

**Résultat attendu** :

```text
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.42
```

La première ligne montre que la passerelle par défaut est `192.168.1.1`. Toute destination inconnue sera envoyée a cette adresse (ta box Internet, en général).

---

### Étape 5 : Visualiser les couches avec une capture de trafic

Utilise `tcpdump` pour capturer quelques paquets et voir les en-tetes de chaque couche.

```bash
# Capture 5 paquets sur l'interface principale (necessite sudo)
sudo tcpdump -c 5 -i eth0 -n
```

**Résultat attendu** :

```text
14:32:01.123456 IP 192.168.1.42.54321 > 8.8.8.8.53: UDP, length 42
14:32:01.134567 IP 8.8.8.8.53 > 192.168.1.42.54321: UDP, length 58
14:32:01.145678 IP 192.168.1.42.443 > 104.20.23.154.443: TCP, length 0
```

Chaque ligne montre :

- L'horodatage (`14:32:01.123456`)
- Le protocole de couche 3 (`IP`)
- L'adresse source et le port (`192.168.1.42.54321`)
- L'adresse destination et le port (`8.8.8.8.53`)
- Le protocole de couche 4 (`UDP` ou `TCP`)
- La taille des données

Tu vois concrètement les couches en action : adresses IP (couche Internet), ports et protocoles (couche Transport).

---

### Étape 6 : Compter les interfaces réseau

```bash
# Liste uniquement les noms des interfaces reseau
ip -brief link show
```

**Résultat attendu** :

```text
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eth0             UP             08:00:27:ab:cd:ef <BROADCAST,MULTICAST,UP,LOWER_UP>
```

Tu vois l'état de chaque interface (`UP` = active, `DOWN` = inactive) et son adresse MAC (ex: `08:00:27:ab:cd:ef`).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip addr show` | Affiche les interfaces réseau et leurs adresses IP |
| `ip -brief link show` | Liste les interfaces avec leur état (UP/DOWN) |
| `ip route show` | Affiche la table de routage |
| `ping -c 4 <adresse>` | Teste la connectivité vers une machine (4 paquets) |
| `sudo tcpdump -c 5 -i eth0` | Capture 5 paquets sur l'interface eth0 |
| `hostname -I` | Affiche les adresses IP de la machine |

---

## Pièges Fréquents

### Piège 1 : Confondre le modèle OSI et le modèle TCP/IP

⚠️ **Problème** : Tu melanges les couches des deux modèles. Tu parles de "couche 5" en pensant au modèle TCP/IP alors qu'il n'a que 4 couches.

✅ **Solution** : Quand quelqu'un dit "couche 3" ou "couche 7", il parle du modèle OSI. Le modèle TCP/IP n'a que 4 couches et on les désigne généralement par leur nom (Application, Transport, Internet, Accès réseau).

---

### Piège 2 : Penser que le modèle OSI est utilise dans la pratique

⚠️ **Problème** : Tu crois que les protocoles suivent exactement les 7 couches du modèle OSI.

✅ **Solution** : Le modèle OSI est un modèle theorique de référence. Dans la réalité, c'est le modèle TCP/IP qui est utilise. Le modèle OSI sert a enseigner, a diagnostiquer et a communiquer entre professionnels ("c'est un problème de couche 2").

---

### Piège 3 : Confondre topologie physique et topologie logique

⚠️ **Problème** : Tu vois des cables branches en étoile sur un switch et tu penses que la topologie est forcément en étoile. Mais logiquement, les données peuvent circuler differemment.

✅ **Solution** : La topologie physique décrit le cablage réel. La topologie logique décrit le chemin des données. Un réseau cable en étoile physique peut fonctionner comme un bus logique (c'était le cas avec les hubs).

---

### Piège 4 : Oublier l'interface loopback

⚠️ **Problème** : Tu ne comprends pas pourquoi `127.0.0.1` répond toujours au ping meme sans connexion réseau.

✅ **Solution** : L'interface loopback (`lo`, adresse `127.0.0.1`) est une interface virtuelle presente sur toute machine. Elle permet a la machine de communiquer avec elle-même. Elle est toujours active, meme sans cable réseau branche.

---

## Checklist de Validation

- [ ] Je sais définir ce qu'est un réseau informatique
- [ ] Je connais la difference entre LAN et WAN
- [ ] Je sais décrire les topologies en étoile, en bus, en anneau et maillee
- [ ] Je peux nommer les 7 couches du modèle OSI
- [ ] Je peux nommer les 4 couches du modèle TCP/IP
- [ ] Je comprends le principe d'encapsulation et les noms des unités de données (trame, paquet, segment)
- [ ] J'ai utilise `ip addr show` pour voir mes interfaces réseau
- [ ] J'ai utilise `ping` pour tester la connectivité

---

## Exercice Pratique

**Énoncé** : Explore la configuration réseau de ta machine et reponds aux questions suivantes.

**Questions** :

1. Combien d'interfaces réseau ta machine possède-t-elle ? Liste leurs noms.
2. Quelle est ton adresse IP locale ?
3. Quelle est ta passerelle par défaut ?
4. Quel est le temps de réponse moyen quand tu ping `127.0.0.1` ? Et quand tu ping `8.8.8.8` ? Pourquoi la difference ?
5. A quelle couche du modèle OSI travaille la commande `ping` ? (Indice : `ping` utilise le protocole ICMP)

**Indications** :

- Utilise `ip addr show` pour les interfaces et l'adresse IP
- Utilise `ip route show` pour la passerelle
- Utilise `ping -c 4` pour les tests de connectivité
- Le protocole ICMP fonctionne au-dessus d'IP

**Résultat attendu** : Tu as les réponses aux cinq questions et tu comprends pourquoi le ping local est plus rapide que le ping distant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Combien d'interfaces réseau ?**

```bash
# Liste les interfaces reseau
ip -brief link show
```

Résultat typique :

```text
lo               UNKNOWN        00:00:00:00:00:00 <LOOPBACK,UP,LOWER_UP>
eth0             UP             08:00:27:ab:cd:ef <BROADCAST,MULTICAST,UP,LOWER_UP>
```

Réponse : 2 interfaces - `lo` (loopback) et `eth0` (interface physique). Le nombre peut varier selon ta machine (tu peux avoir `wlan0` pour le Wi-Fi, `docker0` si Docker est installe, etc.).

**Question 2 : Quelle est ton adresse IP locale ?**

```bash
# Affiche les adresses IP
ip addr show eth0
```

Résultat :

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
```

Réponse : `192.168.1.42` (ton adresse sera différente). Le `/24` est le masque de sous-réseau (explique dans la fiche suivante).

**Question 3 : Quelle est ta passerelle par défaut ?**

```bash
# Affiche la passerelle par defaut
ip route show default
```

Résultat :

```text
default via 192.168.1.1 dev eth0
```

Réponse : `192.168.1.1` (généralement l'adresse de ta box Internet).

**Question 4 : Temps de réponse ping ?**

```bash
# Ping loopback
ping -c 4 127.0.0.1
```

Temps moyen : environ `0.04 ms` (les paquets ne quittent pas la machine).

```bash
# Ping Google DNS
ping -c 4 8.8.8.8
```

Temps moyen : environ `10-20 ms` (les paquets traversent plusieurs routeurs via Internet).

Réponse : Le ping local est beaucoup plus rapide car les paquets restent dans la machine. Le ping distant est plus lent car les paquets doivent traverser le réseau local, la box, le réseau de ton fournisseur d'accès, et plusieurs routeurs Internet.

**Question 5 : A quelle couche OSI travaille ping ?**

Réponse : Le protocole ICMP (utilise par `ping`) fonctionne a la **couche 3 (Réseau)** du modèle OSI. ICMP est encapsule directement dans des paquets IP, sans passer par TCP ou UDP (couche 4).

---

## Navigation

→ Fiche suivante : **[02 - Adressage IP](02-adressage-ip.md)**
