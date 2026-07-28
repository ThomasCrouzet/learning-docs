---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "Routage : table de routage, passerelle par défaut, routage statique, NAT/PAT et diagnostic avec traceroute."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 14
cursus: "Réseaux"
---

# 05 - Routage

> **En bref** : Tu découvriras comment les paquets IP sont achemines d'un réseau a un autre grâce aux tables de routage, le rôle de la passerelle par défaut, la difference entre routage statique et dynamique, le fonctionnement du NAT/PAT et le diagnostic de chemin avec traceroute. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [04 - DNS et DHCP](04-dns-dhcp.md) pour connaître la resolution de noms et l'attribution automatique d'adresses

## Objectif de cette fiche

A la fin de cette fiche, tu sauras lire et interpréter une table de routage, expliquer comment un routeur achemine les paquets, configurer une route statique, comprendre le fonctionnement du NAT/PAT, et utiliser `traceroute` pour diagnostiquer le chemin des paquets.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le routage ?

**Définition** : Le routage est le processus par lequel un routeur détermine le meilleur chemin pour acheminer un paquet IP depuis sa source jusqu'a sa destination, en traversant un ou plusieurs réseaux intermédiaires. Le routage fonctionne a la couche 3 (Réseau) du modèle OSI.

**Le problème que le routage résout** :

Sans routage, voici les problèmes rencontres :

1. **Isolation des réseaux** : Deux machines sur des réseaux différents (par exemple `192.168.1.0/24` et `10.0.0.0/24`) ne peuvent pas communiquer. Les paquets restent confines a leur réseau local.
2. **Pas de chemin vers Internet** : Sans routeur, ta machine ne peut envoyer des paquets qu'aux machines de son réseau local. Aucune communication avec le monde extérieur n'est possible.
3. **Pas de redondance** : S'il n'existe qu'un seul chemin entre deux réseaux et que ce chemin tombe en panne, la communication est impossible.

**Comment le routage résout ces problèmes** :

| Problème | Solution apportée par le routage |
| --- | --- |
| Isolation des réseaux | Le routeur transféré les paquets d'un réseau a un autre |
| Pas de chemin vers Internet | La passerelle par défaut achemine les paquets vers les réseaux inconnus |
| Pas de redondance | Le routage dynamique detecte les pannes et redirige le trafic |

**Analogie concrète** : Le routage fonctionne comme le système postal. Quand tu envoies une lettre, le bureau de poste de ta ville (ton routeur) regarde l'adresse de destination. S'il s'agit d'une adresse locale, il la distribue directement. Sinon, il l'envoie au centre de tri regional (le routeur suivant), qui la transmet au centre de tri de la ville de destination, et ainsi de suite jusqu'a la livraison.

**Ce que le routage n'est PAS** :

- Le routage n'est pas la commutation. La commutation (switching) fonctionne a la couche 2 et utilise les adresses MAC pour transférer les trames au sein d'un meme réseau local. Le routage fonctionne a la couche 3 et utilise les adresses IP pour transférer les paquets entre réseaux différents.
- Le routage ne garantit pas la fiabilité. Le routage achemine les paquets au mieux (best effort). C'est TCP (couche 4) qui gère la fiabilité.

---

### La table de routage

**Définition** : Une table de routage est une base de données locale presente sur chaque machine et chaque routeur. Elle contient les règles qui determinent vers quelle interface ou passerelle envoyer un paquet en fonction de sa destination.

**Le problème que la table de routage résout** :

Sans table de routage, voici les problèmes rencontres :

1. **Pas de décision** : Quand un paquet arrive, la machine ne sait pas par quelle interface ou vers quel routeur l'envoyer.
2. **Pas de priorité** : Quand plusieurs chemins sont possibles, il n'y a pas de critère pour choisir le meilleur.

**Structure d'une table de routage** :

| Champ | Role | Exemple |
| --- | --- | --- |
| Destination | Le réseau ou l'hôte de destination | `192.168.1.0/24` |
| Gateway (passerelle) | Le routeur suivant pour atteindre cette destination | `192.168.1.1` |
| Interface | L'interface réseau a utiliser pour envoyer le paquet | `eth0` |
| Métrique | Le coût du chemin (plus c'est bas, mieux c'est) | `100` |

**Comment un routeur choisit la route** :

Quand un paquet arrive, le routeur :

1. Lit l'adresse IP de destination dans l'en-tete du paquet
2. Cherche dans sa table de routage la route la plus spécifique (longest prefix match) correspondant a cette destination
3. Envoie le paquet vers la passerelle ou l'interface indiquee par cette route
4. Si aucune route spécifique ne correspond, utilise la route par défaut (default route)

**Le "longest prefix match"** :

Si la table contient ces routes :

```text
10.0.0.0/8      via 192.168.1.1
10.1.0.0/16     via 192.168.1.2
10.1.2.0/24     via 192.168.1.3
```

Pour un paquet destine a `10.1.2.50`, les trois routes correspondent. Le routeur choisit la plus spécifique : `10.1.2.0/24` (le masque le plus long, /24 > /16 > /8). Le paquet est envoyé via `192.168.1.3`.

---

### La passerelle par défaut

**Définition** : La passerelle par défaut (default gateway) est le routeur vers lequel une machine envoie tous les paquets dont la destination n'est pas sur le réseau local et ne correspond a aucune route spécifique dans la table de routage. C'est la route "de dernier recours".

**Fonctionnement** :

```text
Machine (192.168.1.42) veut envoyer un paquet a 8.8.8.8

1. La machine consulte sa table de routage
2. 8.8.8.8 n'est pas dans le reseau local (192.168.1.0/24)
3. Aucune route specifique pour 8.8.8.0/24
4. Utilise la route par defaut : "default via 192.168.1.1"
5. Le paquet est envoye a 192.168.1.1 (la box Internet)
6. La box transmet le paquet vers Internet
```

---

### Routage statique vs routage dynamique

**Définition** : Le routage statique utilise des routes configurées manuellement par l'administrateur. Le routage dynamique utilise des protocoles (OSPF, BGP, RIP) qui decouvrent et mettent a jour les routes automatiquement.

**Comparaison** :

| Critère | Routage statique | Routage dynamique |
| --- | --- | --- |
| Configuration | Manuelle | Automatique (protocoles) |
| Adaptation aux pannes | Non (routes fixes) | Oui (recalcul automatique) |
| Charge du routeur | Faible | Plus élevée (protocole actif) |
| Complexite | Simple | Plus complexe |
| Usage typique | Petits réseaux, liens point-a-point | Grands réseaux, Internet |
| Protocoles | Aucun | OSPF, BGP, RIP, EIGRP |

**Quand utiliser le routage statique** :

- Réseaux de petite taille (moins de 5 routeurs)
- Route par défaut vers Internet
- Liens point-a-point (un seul chemin possible)

**Quand utiliser le routage dynamique** :

- Réseaux complexes avec de nombreux routeurs
- Besoin de redondance et de basculement automatique
- Internet (BGP gère les routes entre les opérateurs)

---

### Le NAT - Network Address Translation

**Définition** : Le NAT (Network Address Translation) est un mécanisme qui modifie les adresses IP dans les en-tetes des paquets lors de leur passage a travers un routeur. Il permet a plusieurs machines d'un réseau prive de partager une seule adresse IP publique pour accéder a Internet.

**Le problème que le NAT résout** :

Sans NAT, voici les problèmes rencontres :

1. **Penurie d'adresses IPv4** : Il n'y a que 4,3 milliards d'adresses IPv4 pour plus de 15 milliards d'équipements. Impossible d'attribuer une adresse publique a chaque machine.
2. **Exposition directe** : Chaque machine du réseau local aurait une adresse publique accessible directement depuis Internet, ce qui augmente la surface d'attaque.

**Comment le NAT résout ces problèmes** :

| Problème | Solution apportée par le NAT |
| --- | --- |
| Penurie d'adresses | Plusieurs machines partagent une seule adresse publique |
| Exposition directe | Les machines du réseau prive ne sont pas directement accessibles depuis Internet |

**Types de NAT** :

| Type | Description | Exemple |
| --- | --- | --- |
| NAT statique | 1 adresse privée = 1 adresse publique (mapping fixe) | Serveur interne accessible depuis Internet |
| NAT dynamique | Pool d'adresses publiques partagées | Rarement utilise |
| PAT (Port Address Translation) | Plusieurs machines partagent 1 adresse publique via des ports différents | Usage domestique (ta box Internet) |

**Fonctionnement du PAT (le plus courant)** :

```text
Reseau prive (192.168.1.0/24)          Routeur/Box          Internet
                                     (NAT/PAT)
PC1 (192.168.1.10:50001) ──┐
                            ├──→ 85.123.45.67:50001 ──→ google.com:443
PC2 (192.168.1.11:50002) ──┤
                            ├──→ 85.123.45.67:50002 ──→ google.com:443
PC3 (192.168.1.12:50003) ──┘
                            └──→ 85.123.45.67:50003 ──→ google.com:443
```

Le routeur remplace l'adresse privée source par son adresse publique et attribue un port unique pour chaque connexion. Quand la réponse arrive, il utilise le port pour retrouver la machine d'origine et lui transmettre le paquet.

**Table NAT (dans le routeur)** :

| Adresse interne | Port interne | Adresse externe | Port externe |
| --- | --- | --- | --- |
| 192.168.1.10 | 50001 | 85.123.45.67 | 50001 |
| 192.168.1.11 | 50002 | 85.123.45.67 | 50002 |
| 192.168.1.12 | 50003 | 85.123.45.67 | 50003 |

**Analogie concrète** : Le NAT fonctionne comme le standard téléphonique d'une entreprise. L'entreprise a un seul numéro de telephone public (l'adresse publique). Quand un employé appelle l'extérieur, le standard attribue une extension (le port) et fait le lien. Quand quelqu'un rappelle, le standard sait vers quel employé rediriger l'appel grâce a l'extension.

**Ce que le NAT n'est PAS** :

- Le NAT n'est pas un pare-feu. Le NAT masque les adresses privées mais ne filtre pas le trafic. Un pare-feu applique des règles pour bloquer ou autoriser des connexions spécifiques.
- Le NAT n'est pas une solution definitive a la penurie d'adresses. C'est un palliatif. IPv6 résout le problème a la racine avec son espace d'adressage gigantesque.

---

### Traceroute : tracer le chemin des paquets

**Définition** : `traceroute` (ou `tracepath` sous Linux) est un outil de diagnostic qui affiche chaque routeur traverse par un paquet entre ta machine et une destination. Il exploite le champ TTL (Time To Live) des paquets IP.

**Fonctionnement** :

1. `traceroute` envoie un paquet avec TTL=1. Le premier routeur le reçoit, decremente le TTL a 0 et répond avec un message ICMP "Time Exceeded".
2. Il envoie un paquet avec TTL=2. Le deuxième routeur fait de même.
3. Le processus se repete en augmentant le TTL jusqu'a ce que le paquet atteigne la destination.

```text
TTL=1 → Routeur 1 repond (hop 1)
TTL=2 → Routeur 2 repond (hop 2)
TTL=3 → Routeur 3 repond (hop 3)
...
TTL=N → Destination atteinte
```

---

## Étapes Pratiques

### Étape 1 : Afficher la table de routage

```bash
# Affiche la table de routage de ta machine
ip route show
```

**Résultat attendu** :

```text
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.42 metric 100
```

Explication de chaque ligne :

- **`default via 192.168.1.1`** : la route par défaut. Tous les paquets dont la destination est inconnue sont envoyés a `192.168.1.1` (ta box).
- **`192.168.1.0/24 dev eth0`** : les paquets destines au réseau local (`192.168.1.0/24`) sont envoyés directement via l'interface `eth0`, sans passer par un routeur.
- **`proto dhcp`** : cette route a été apprise via DHCP.
- **`proto kernel`** : cette route a été créée automatiquement par le noyau.
- **`metric 100`** : le coût de cette route (plus c'est bas, plus la route est prioritaire).

---

### Étape 2 : Tester le chemin avec traceroute

```bash
# Trace le chemin vers le serveur DNS de Google
traceroute -n 8.8.8.8
```

**Résultat attendu** :

```text
traceroute to 8.8.8.8 (8.8.8.8), 30 hops max, 60 byte packets
 1  192.168.1.1      1.234 ms  0.987 ms  0.876 ms
 2  10.0.0.1         5.678 ms  5.432 ms  5.321 ms
 3  172.16.0.1       8.901 ms  8.765 ms  8.654 ms
 4  * * *
 5  74.125.242.1    11.234 ms 11.123 ms 11.012 ms
 6  8.8.8.8         12.345 ms 12.234 ms 12.123 ms
```

Ce résultat montre :

- **Hop 1** : ta box Internet (`192.168.1.1`) - temps de réponse ~1 ms
- **Hop 2-3** : routeurs de ton FAI - temps de réponse ~5-9 ms
- **Hop 4** : `* * *` signifie que ce routeur ne répond pas aux requêtes traceroute (ce n'est pas une panne, c'est une configuration de sécurité)
- **Hop 5-6** : routeurs de Google - le paquet arrive a destination en ~12 ms

L'option `-n` desactive la resolution DNS pour accelerer l'affichage.

---

### Étape 3 : Utiliser tracepath comme alternative

```bash
# tracepath est une alternative qui ne necessite pas sudo
tracepath -n 8.8.8.8
```

**Résultat attendu** :

```text
 1:  192.168.1.42                           0.100ms pmtu 1500
 1:  192.168.1.1                            1.234ms
 2:  10.0.0.1                               5.678ms
 3:  8.8.8.8                               12.345ms reached
```

`tracepath` affiche en plus le MTU (Maximum Transmission Unit) decouvert pour chaque segment.

---

### Étape 4 : Ajouter une route statique

```bash
# Ajoute une route vers le reseau 10.10.0.0/24 via la passerelle 192.168.1.254
sudo ip route add 10.10.0.0/24 via 192.168.1.254 dev eth0
```

**Résultat attendu** :

```text
# Pas de sortie si la commande reussit
```

Verifie que la route a été ajoutee :

```bash
ip route show | grep 10.10
```

```text
10.10.0.0/24 via 192.168.1.254 dev eth0
```

Pour supprimer la route :

```bash
# Supprime la route ajoutee
sudo ip route del 10.10.0.0/24 via 192.168.1.254 dev eth0
```

Ces routes ajoutees avec `ip route add` sont temporaires et disparaissent au redémarrage.

---

### Étape 5 : Verifier la table NAT du noyau

```bash
# Affiche les connexions NAT actives (necessite conntrack)
sudo conntrack -L 2>/dev/null | head -10 || cat /proc/net/nf_conntrack 2>/dev/null | head -10
```

**Résultat attendu** :

```text
tcp  6 300 ESTABLISHED src=192.168.1.42 dst=104.20.23.154 sport=54321 dport=443 src=104.20.23.154 dst=192.168.1.42 sport=443 dport=54321
udp  17 30 src=192.168.1.42 dst=8.8.8.8 sport=45678 dport=53 src=8.8.8.8 dst=192.168.1.42 sport=53 dport=45678
```

Chaque ligne montre une connexion suivie avec les adresses et ports source/destination dans les deux directions.

---

### Étape 6 : Diagnostiquer un problème de routage

```bash
# Verifie quelle route serait utilisee pour joindre une destination
ip route get 8.8.8.8
```

**Résultat attendu** :

```text
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.42 uid 1000
    cache
```

Cette commande montre exactement quelle passerelle et quelle interface seraient utilisées pour joindre `8.8.8.8`. C'est utile pour diagnostiquer des problèmes de routage sans envoyer de paquets.

```bash
# Verifie pour une adresse du reseau local
ip route get 192.168.1.100
```

```text
192.168.1.100 dev eth0 src 192.168.1.42 uid 1000
    cache
```

Pas de `via` : le paquet est envoyé directement sur l'interface `eth0` sans passer par une passerelle.

---

### Étape 7 : Afficher les statistiques d'interface

```bash
# Affiche les statistiques de trafic de chaque interface
ip -s link show eth0
```

**Résultat attendu** :

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    RX: bytes  packets  errors  dropped
    1234567    8901     0       0
    TX: bytes  packets  errors  dropped
    987654     6543     0       0
```

Les compteurs `errors` et `dropped` doivent être a 0 en fonctionnement normal. Des valeurs non nulles indiquent des problèmes physiques (cable defectueux, interface surchargee).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip route show` | Affiche la table de routage |
| `ip route get <destination>` | Montre quelle route serait utilisée |
| `traceroute -n <destination>` | Trace le chemin vers une destination |
| `tracepath -n <destination>` | Alternative a traceroute sans sudo |
| `sudo ip route add <reseau> via <passerelle>` | Ajoute une route statique temporaire |
| `sudo ip route del <reseau> via <passerelle>` | Supprime une route statique |
| `ip -s link show <interface>` | Affiche les statistiques de trafic |
| `ping -c 4 <passerelle>` | Verifie que la passerelle est joignable |

---

## Pièges Frequents

### Piège 1 : Confondre routage et commutation

⚠️ **Problème** : Tu penses qu'un switch fait du routage parce qu'il "envoie des données".

✅ **Solution** : Un switch travaille a la couche 2 (adresses MAC) et transféré les trames au sein d'un meme réseau local. Un routeur travaille a la couche 3 (adresses IP) et transféré les paquets entre réseaux différents. Ce sont deux mécanismes distincts.

---

### Piège 2 : Oublier la route par défaut

⚠️ **Problème** : Tu configures des routes statiques pour des réseaux spécifiques mais tu oublies la route par défaut. Résultat : ta machine peut joindre les réseaux configures mais pas Internet.

✅ **Solution** : Verifie toujours la presence de la route par défaut avec `ip route show | grep default`. Si elle manque, ajoute-la : `sudo ip route add default via <passerelle> dev <interface>`.

---

### Piège 3 : Croire que le NAT protégé comme un pare-feu

⚠️ **Problème** : Tu penses que ton réseau est sécurisé parce que tu as du NAT. Tu ne configures pas de pare-feu.

✅ **Solution** : Le NAT masque les adresses privées mais ne filtre pas le trafic. Un attaquant peut exploiter les connexions sortantes (malware, phishing). Un pare-feu est indispensable pour contrôler quelles connexions sont autorisées et lesquelles sont bloquees.

---

### Piège 4 : Les étoiles dans traceroute ne sont pas des pannes

⚠️ **Problème** : Tu vois `* * *` dans la sortie de `traceroute` et tu penses que le routeur est en panne.

✅ **Solution** : `* * *` signifie que le routeur ne répond pas aux requêtes traceroute (il bloque les paquets ICMP ou UDP de sondage). C'est une configuration de sécurité courante. Si les hops suivants répondent, le routeur fonctionne correctement, il refuse simplement de s'identifier.

---

## Checklist de Validation

- [ ] Je sais lire une table de routage et expliquer chaque champ
- [ ] Je comprends le rôle de la passerelle par défaut
- [ ] Je sais ajouter et supprimer une route statique
- [ ] Je comprends la difference entre routage statique et dynamique
- [ ] Je sais expliquer le fonctionnement du NAT/PAT
- [ ] Je sais utiliser `traceroute` pour tracer le chemin d'un paquet
- [ ] Je sais utiliser `ip route get` pour diagnostiquer le routage

---

## Exercice Pratique

**Enonce** : Analyse le routage de ta machine et diagnostique les chemins réseau.

**Questions** :

1. Affiche ta table de routage et identifie la passerelle par défaut et le réseau local.
2. Trace le chemin vers `google.com` et vers `1.1.1.1`. Compare le nombre de hops et les temps de réponse.
3. Verifie quelle route serait utilisée pour joindre les adresses suivantes : `192.168.1.100`, `10.0.0.1` et `8.8.8.8`. Pour lesquelles la passerelle par défaut est-elle utilisée ?
4. Ajoute une route statique vers le réseau `172.16.0.0/16` via ta passerelle par défaut. Verifie qu'elle est bien dans la table. Puis supprime-la.
5. Pourquoi ton réseau domestique a-t-il besoin du NAT pour accéder a Internet ?

**Indications** :

- Utilise `ip route show` pour la question 1
- Utilise `traceroute -n` pour la question 2
- Utilise `ip route get` pour la question 3
- Utilise `sudo ip route add/del` pour la question 4
- Pour la question 5, pense aux adresses privées et aux adresses publiques

**Résultat attendu** : Tu as les réponses aux cinq questions et tu sais diagnostiquer les problèmes de routage.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Table de routage**

```bash
ip route show
```

```text
default via 192.168.1.1 dev eth0 proto dhcp metric 100
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.42 metric 100
```

Réponse : La passerelle par défaut est `192.168.1.1`. Le réseau local est `192.168.1.0/24`. Tes valeurs seront différentes.

**Question 2 : Traceroute comparatif**

```bash
traceroute -n google.com
traceroute -n 1.1.1.1
```

Réponse : Le nombre de hops dépend de ta localisation et de ton FAI. En général, `google.com` et `1.1.1.1` (Cloudflare DNS) sont a 5-15 hops. Le temps de réponse varie selon la distance geographique et la qualité du réseau. Le premier hop est toujours ta box (~1 ms).

**Question 3 : Route utilisée**

```bash
ip route get 192.168.1.100
```

```text
192.168.1.100 dev eth0 src 192.168.1.42
```

Réponse : `192.168.1.100` est sur le réseau local - pas de passerelle, envoi direct.

```bash
ip route get 10.0.0.1
```

```text
10.0.0.1 via 192.168.1.1 dev eth0 src 192.168.1.42
```

Réponse : `10.0.0.1` n'est pas sur le réseau local - la passerelle par défaut (`192.168.1.1`) est utilisée.

```bash
ip route get 8.8.8.8
```

```text
8.8.8.8 via 192.168.1.1 dev eth0 src 192.168.1.42
```

Réponse : `8.8.8.8` n'est pas sur le réseau local - la passerelle par défaut est utilisée. Seule `192.168.1.100` est jointe directement, les deux autres necessitent la passerelle.

**Question 4 : Route statique**

```bash
# Ajout
sudo ip route add 172.16.0.0/16 via 192.168.1.1 dev eth0

# Verification
ip route show | grep 172.16
```

```text
172.16.0.0/16 via 192.168.1.1 dev eth0
```

```bash
# Suppression
sudo ip route del 172.16.0.0/16 via 192.168.1.1 dev eth0

# Verification
ip route show | grep 172.16
```

```text
# Pas de sortie : la route a ete supprimee
```

**Question 5 : Pourquoi le NAT ?**

Réponse : Ton réseau domestique utilise des adresses privées (ex: `192.168.1.0/24`). Ces adresses ne sont pas routables sur Internet - les routeurs Internet ne savent pas ou les envoyer. Le NAT de ta box remplace ton adresse privée (`192.168.1.42`) par son adresse publique (fournie par ton FAI, ex: `85.123.45.67`) avant d'envoyer les paquets sur Internet. Sans NAT, tes paquets seraient ignores par les routeurs Internet car ils auraient une adresse source privée non routable.

---

## Navigation

← Fiche précédente : **[04 - DNS et DHCP](04-dns-dhcp.md)**

→ Fiche suivante : **[06 - Commutation et VLANs](06-commutations-vlans.md)**
