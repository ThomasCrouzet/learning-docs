---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "Commutation et VLANs : fonctionnement du switch, adresses MAC, table CAM, segmentation en VLANs, trunk et 802.1Q."
estimated_time: "60 min"
fiche_number: 6
total_fiches: 14
cursus: "Réseaux"
---

# 06 - Commutation et VLANs

> **En bref** : Tu découvriras comment un switch transféré les trames grâce aux adresses MAC, le fonctionnement de la table CAM, la segmentation du réseau en VLANs, les liens trunk et l'etiquetage 802.1Q. Lecture estimée : 60 min.

## Prérequis

- Avoir lu la fiche [05 - Routage](05-routage.md) pour connaître le routage IP, la passerelle par défaut et le NAT

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer comment un switch transféré les trames Ethernet, lire une table d'adresses MAC, comprendre pourquoi et comment segmenter un réseau en VLANs, décrire le fonctionnement des liens trunk et du protocole 802.1Q.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la commutation ?

**Définition** : La commutation (switching) est le processus par lequel un switch (commutateur) transféré des trames Ethernet entre ses ports en se basant sur les adresses MAC. La commutation fonctionne a la couche 2 (Liaison de données) du modèle OSI.

**Le problème que la commutation résout** :

Sans commutation, voici les problèmes rencontres :

1. **Collisions** : Avec un hub (concentrateur), toutes les machines partagent le meme domaine de collision. Quand deux machines emettent en même temps, les données se percutent et sont perdues. Plus il y a de machines, plus les collisions sont frequentes et le réseau devient lent.
2. **Broadcast permanent** : Un hub repete les trames sur tous ses ports, même si le destinataire est un seul appareil. Cela gaspille la bande passante et expose les données a toutes les machines.
3. **Pas de bande passante dédiée** : Avec un hub, la bande passante (par exemple 100 Mbps) est partagée entre toutes les machines. Avec 10 machines, chacune dispose en moyenne de 10 Mbps.

**Comment la commutation résout ces problèmes** :

| Problème | Solution apportée par la commutation |
| --- | --- |
| Collisions | Chaque port du switch est un domaine de collision separe. Les collisions disparaissent en full-duplex |
| Broadcast permanent | Le switch n'envoie la trame qu'au port du destinataire (sauf broadcast) |
| Pas de bande passante dédiée | Chaque port a sa propre bande passante dédiée (100 Mbps, 1 Gbps, etc.) |

**Analogie concrète** : Un hub fonctionne comme un haut-parleur dans une salle : tout le monde entend tout ce qui est dit, et si deux personnes parlent en même temps, personne ne comprend rien. Un switch fonctionne comme un standard téléphonique : il connecte directement l'appelant au destinataire, sans deranger les autres.

**Ce que la commutation n'est PAS** :

- La commutation n'est pas du routage. Le switch travaille avec des adresses MAC (couche 2) et ne comprend pas les adresses IP (couche 3). Il ne peut pas transférer des trames entre réseaux différents - c'est le rôle du routeur.
- Un switch n'est pas un hub. Un hub repete betement les trames sur tous les ports. Un switch apprend les adresses MAC et envoie les trames uniquement au port concerne.

**Comparaison hub vs switch** :

| Hub | Switch |
| --- | --- |
| Repete sur tous les ports | Envoie uniquement au port destination |
| Un seul domaine de collision | Un domaine de collision par port |
| Bande passante partagée | Bande passante dédiée par port |
| Couche 1 (Physique) | Couche 2 (Liaison de données) |
| Obsolete | Standard actuel |

---

### L'adresse MAC

**Définition** : L'adresse MAC (Media Access Control) est un identifiant unique de 48 bits (6 octets) grave dans chaque carte réseau par le fabricant. Elle est ecrite en hexadecimal, avec des deux-points ou des tirets entre chaque octet.

**Format** : `XX:XX:XX:XX:XX:XX` - exemple : `08:00:27:ab:cd:ef`

**Structure** :

```text
08:00:27:ab:cd:ef
|______| |______|
   |         |
   OUI      NIC
(fabricant) (identifiant unique)
```

- **OUI (Organizationally Unique Identifier)** : les 3 premiers octets identifient le fabricant. `08:00:27` = Oracle (VirtualBox).
- **NIC (Network Interface Controller)** : les 3 derniers octets sont un identifiant unique attribue par le fabricant.

**Adresses MAC speciales** :

| Adresse | Role |
| --- | --- |
| `FF:FF:FF:FF:FF:FF` | Broadcast - envoyé a toutes les machines du réseau local |
| `01:00:5E:xx:xx:xx` | Multicast IPv4 |
| `33:33:xx:xx:xx:xx` | Multicast IPv6 |

**Comparaison adresse MAC vs adresse IP** :

| Adresse MAC | Adresse IP |
| --- | --- |
| Couche 2 (Liaison de données) | Couche 3 (Réseau) |
| 48 bits, hexadecimal | 32 bits (IPv4), decimal |
| Gravee dans la carte réseau | Configurée par logiciel (DHCP ou manuel) |
| Identifie la carte réseau physique | Identifie la machine sur le réseau logique |
| Ne change pas (en theorie) | Peut changer a chaque connexion |
| Portee locale (meme réseau) | Portee globale (routage Internet) |

---

### La table CAM (table d'adresses MAC)

**Définition** : La table CAM (Content Addressable Memory), aussi appelée table d'adresses MAC, est une base de données maintenue par le switch. Elle associe chaque adresse MAC a un port physique du switch. Le switch utilise cette table pour savoir sur quel port envoyer une trame.

**Le problème que la table CAM résout** :

Sans table CAM, le switch ne saurait pas sur quel port se trouve chaque machine et devrait envoyer chaque trame sur tous les ports (comme un hub).

**Comment le switch apprend les adresses MAC** :

```text
1. PC1 (MAC aa:bb:cc:dd:ee:01) envoie une trame depuis le port 1
   → Le switch enregistre : "aa:bb:cc:dd:ee:01 est sur le port 1"

2. PC2 (MAC aa:bb:cc:dd:ee:02) envoie une trame depuis le port 3
   → Le switch enregistre : "aa:bb:cc:dd:ee:02 est sur le port 3"

3. PC1 envoie une trame a PC2
   → Le switch regarde sa table :
     "aa:bb:cc:dd:ee:02 est sur le port 3"
   → Il envoie la trame uniquement sur le port 3
```

**Processus de transfert (forwarding)** :

1. Le switch reçoit une trame sur un port
2. Il lit l'adresse MAC source et l'associe au port de reception (apprentissage)
3. Il lit l'adresse MAC destination et cherche dans sa table CAM
4. **Si l'adresse est dans la table** : il envoie la trame sur le port correspondant (unicast)
5. **Si l'adresse n'est pas dans la table** : il envoie la trame sur tous les ports sauf celui de reception (flood/inondation)
6. **Si l'adresse est `FF:FF:FF:FF:FF:FF`** : il envoie la trame sur tous les ports (broadcast)

**Exemple de table CAM** :

| Adresse MAC | Port | VLAN | Age |
| --- | --- | --- | --- |
| aa:bb:cc:dd:ee:01 | Gi0/1 | 10 | 120s |
| aa:bb:cc:dd:ee:02 | Gi0/3 | 10 | 45s |
| aa:bb:cc:dd:ee:03 | Gi0/5 | 20 | 200s |

Le champ `Age` indique depuis combien de temps l'entrée est en cache. Après un certain temps (généralement 300 secondes), l'entrée expire et est supprimee si la machine n'a pas émis de trame.

---

### Qu'est-ce qu'un VLAN ?

**Définition** : Un VLAN (Virtual Local Area Network) est un réseau local virtuel qui permet de segmenter un switch physique en plusieurs réseaux logiques indépendants. Les machines dans le meme VLAN peuvent communiquer entre elles, mais les machines dans des VLANs différents ne le peuvent pas sans routeur.

**Le problème que les VLANs résolvent** :

Sans VLANs, voici les problèmes rencontres :

1. **Pas de segmentation** : Toutes les machines connectees au même switch partagent le meme domaine de broadcast. Un broadcast émis par une machine atteint toutes les autres, meme celles qui n'ont rien a voir. Sur un réseau de 500 machines, le trafic broadcast peut saturer le réseau.
2. **Pas de sécurité** : Le service comptabilité et le service informatique partagent le meme réseau. Un employé de la comptabilité peut accéder aux serveurs de l'informatique.
3. **Rigidite physique** : Si tu veux séparer deux départements, tu dois acheter un switch pour chaque département et les cabler séparément.

**Comment les VLANs résolvent ces problèmes** :

| Problème | Solution apportée par les VLANs |
| --- | --- |
| Pas de segmentation | Chaque VLAN est un domaine de broadcast indépendant |
| Pas de sécurité | Les machines de VLANs différents ne communiquent pas sans routeur (avec des règles de filtrage) |
| Rigidite physique | Un seul switch peut heberger plusieurs VLANs. Deplacer une machine de VLAN se fait par configuration, sans recabler |

**Analogie concrète** : Un VLAN fonctionne comme les étages d'un immeuble de bureaux. Chaque étage (VLAN) est un espace indépendant avec ses propres employés. Les employés du même étage se voient et communiquent librement. Pour aller a un autre étage, il faut passer par l'ascenseur (le routeur), qui peut avoir un controle d'accès (un pare-feu).

**Ce qu'un VLAN n'est PAS** :

- Un VLAN n'est pas un sous-réseau IP. Un VLAN est un concept de couche 2, un sous-réseau est un concept de couche 3. En pratique, on associe souvent un VLAN a un sous-réseau IP, mais ce n'est pas obligatoire techniquement.
- Un VLAN n'est pas un pare-feu. Un VLAN isole les domaines de broadcast mais ne filtre pas le trafic. Pour filtrer, il faut un pare-feu ou des ACL (Access Control Lists) sur le routeur.

---

### Types de VLANs et attribution

**Définition** : Il existe plusieurs manieres d'attribuer un port de switch a un VLAN.

**VLAN par port (le plus courant)** :

Chaque port du switch est configure pour appartenir a un VLAN spécifique. C'est la méthode la plus simple et la plus utilisée.

```text
Switch 48 ports :
  Ports 1-12  → VLAN 10 (Informatique)
  Ports 13-24 → VLAN 20 (Comptabilite)
  Ports 25-36 → VLAN 30 (Direction)
  Ports 37-48 → VLAN 40 (Invites)
```

**VLANs courants** :

| VLAN ID | Usage courant |
| --- | --- |
| 1 | VLAN par défaut (tous les ports non configures) |
| 10-99 | VLANs utilisateurs (par département) |
| 100-199 | VLANs serveurs |
| 200-299 | VLANs gestion (management) |
| 999 | VLAN "poubelle" (ports inutilises, sécurité) |

Le VLAN 1 est le VLAN par défaut sur la plupart des switchs. Pour des raisons de sécurité, il est recommande de ne pas l'utiliser pour le trafic de production et d'attribuer les ports inutilises a un VLAN dedie (VLAN 999 par exemple).

---

### Les liens trunk et le protocole 802.1Q

**Définition** : Un lien trunk est un lien réseau qui transporte le trafic de plusieurs VLANs sur un meme cable physique. Le protocole IEEE 802.1Q ajoute une etiquette (tag) a chaque trame Ethernet pour identifier le VLAN d'appartenance.

**Le problème que les trunks résolvent** :

Sans trunk, voici les problèmes rencontres :

1. **Un cable par VLAN** : Si un switch a 4 VLANs et doit être connecte a un autre switch, il faudrait 4 cables (un par VLAN).
2. **Pas d'extension des VLANs** : Un VLAN ne pourrait exister que sur un seul switch. Impossible d'avoir des machines du même VLAN sur des switchs différents.

**Comment les trunks résolvent ces problèmes** :

| Problème | Solution apportée par les trunks |
| --- | --- |
| Un cable par VLAN | Un seul cable trunk transporte tous les VLANs |
| Pas d'extension des VLANs | Les VLANs sont propages entre switchs via les trunks |

**Le tag 802.1Q** :

Le protocole 802.1Q insere un champ de 4 octets dans l'en-tete de la trame Ethernet pour identifier le VLAN :

```text
Trame Ethernet classique :
[MAC dest] [MAC src] [Type] [Donnees] [FCS]

Trame Ethernet avec tag 802.1Q :
[MAC dest] [MAC src] [Tag 802.1Q] [Type] [Donnees] [FCS]
                      |__________|
                      4 octets :
                      - TPID : 0x8100 (identifie le tag)
                      - Priorite : 3 bits (QoS)
                      - DEI : 1 bit
                      - VLAN ID : 12 bits (0-4095)
```

Le champ VLAN ID fait 12 bits, ce qui permet 4096 VLANs (0 a 4095). Les VLAN 0 et 4095 sont réserves.

**Port access vs port trunk** :

| Port access | Port trunk |
| --- | --- |
| Appartient a un seul VLAN | Transporte plusieurs VLANs |
| Les trames ne sont pas etiquetees | Les trames sont etiquetees avec le VLAN ID |
| Connecte les machines des utilisateurs | Connecte les switchs entre eux |
| Configure avec un VLAN ID unique | Configure avec la liste des VLANs autorises |

**VLAN natif (native VLAN)** :

Sur un lien trunk, un VLAN peut être désigne comme "natif". Les trames de ce VLAN ne sont pas etiquetees sur le trunk. C'est une mesure de compatibilité avec les anciens équipements qui ne comprennent pas le 802.1Q. Par défaut, le VLAN natif est le VLAN 1.

**Schéma d'interconnexion avec trunk** :

```text
Switch A                        Switch B
+---+---+---+---+          +---+---+---+---+
| 1 | 2 | 3 |24 |          | 1 | 2 | 3 |24 |
+---+---+---+---+          +---+---+---+---+
|V10|V10|V20|Trk|==========|Trk|V10|V20|V20|
                    Trunk
              (VLAN 10 + 20)
```

Le port 24 de chaque switch est configure en trunk. Il transporte les trames des VLANs 10 et 20 avec un tag 802.1Q. Ainsi, les machines du VLAN 10 sur le Switch A communiquent avec celles du VLAN 10 sur le Switch B, même si elles sont sur des switchs différents.

---

### Le routage inter-VLAN

**Définition** : Les machines de VLANs différents ne peuvent pas communiquer directement (c'est le but de la segmentation). Pour permettre la communication entre VLANs, il faut un routeur ou un switch de couche 3 (switch L3).

**Méthode "router-on-a-stick"** :

Un seul routeur connecte au switch par un lien trunk. Le routeur créé des sous-interfaces, une par VLAN :

```text
Switch                    Routeur
+---+---+---+---+    +----------+
| 1 | 2 | 3 |24 |    |          |
+---+---+---+---+    | eth0.10  |
|V10|V20|V30|Trk|====| eth0.20  |
                      | eth0.30  |
                      +----------+
```

Le routeur a 3 sous-interfaces :

- `eth0.10` : passerelle pour le VLAN 10 (ex: `192.168.10.1`)
- `eth0.20` : passerelle pour le VLAN 20 (ex: `192.168.20.1`)
- `eth0.30` : passerelle pour le VLAN 30 (ex: `192.168.30.1`)

Les machines de chaque VLAN configurent leur passerelle vers la sous-interface correspondante du routeur.

---

## Étapes Pratiques

### Étape 1 : Afficher l'adresse MAC de tes interfaces

```bash
# Affiche l'adresse MAC de toutes les interfaces
ip link show
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    link/loopback 00:00:00:00:00:00 brd 00:00:00:00:00:00
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
```

Tu vois :

- `link/loopback 00:00:00:00:00:00` : l'interface loopback n'a pas de vraie adresse MAC
- `link/ether 08:00:27:ab:cd:ef` : l'adresse MAC de ton interface physique
- `brd ff:ff:ff:ff:ff:ff` : l'adresse de broadcast MAC

---

### Étape 2 : Afficher la table ARP (association IP - MAC)

Le protocole ARP (Address Resolution Protocol) fait le lien entre les adresses IP et les adresses MAC sur le réseau local.

```bash
# Affiche le cache ARP (table IP → MAC)
ip neigh show
```

**Résultat attendu** :

```text
192.168.1.1 dev eth0 lladdr aa:bb:cc:11:22:33 REACHABLE
192.168.1.100 dev eth0 lladdr aa:bb:cc:44:55:66 STALE
```

Ce résultat montre :

- `192.168.1.1` a l'adresse MAC `aa:bb:cc:11:22:33` (ta box Internet)
- `REACHABLE` : cette entrée est confirmee recemment
- `STALE` : cette entrée n'a pas été confirmee depuis un moment

---

### Étape 3 : Observer le protocole ARP en action

```bash
# Capture les paquets ARP sur le reseau local
sudo tcpdump -c 5 -i eth0 -n arp
```

Dans un autre terminal, force une resolution ARP :

```bash
# Ping une machine du reseau local pour declencher une requete ARP
ping -c 1 192.168.1.1
```

**Résultat attendu dans tcpdump** :

```text
14:35:01.001 ARP, Request who-has 192.168.1.1 tell 192.168.1.42, length 28
14:35:01.002 ARP, Reply 192.168.1.1 is-at aa:bb:cc:11:22:33, length 28
```

Tu vois les deux étapes d'ARP :

- **ARP Request** (broadcast) : "Qui a l'adresse 192.168.1.1 ? Dis-le a 192.168.1.42"
- **ARP Reply** (unicast) : "192.168.1.1 est a l'adresse MAC aa:bb:cc:11:22:33"

---

### Étape 4 : Voir les VLANs sur ta machine (si disponible)

Si ta machine Linux est connectee a un trunk ou si tu utilises des VLANs, tu peux les afficher :

```bash
# Liste les interfaces VLAN configurees
ip -d link show | grep -A 1 "vlan"
```

**Résultat attendu** (si des VLANs sont configures) :

```text
3: eth0.10@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    vlan protocol 802.1Q id 10 <REORDER_HDR>
4: eth0.20@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    vlan protocol 802.1Q id 20 <REORDER_HDR>
```

Si aucun VLAN n'est configure, la commande ne retourne rien.

---

### Étape 5 : Creer un VLAN sur une interface Linux

```bash
# Charge le module VLAN du noyau
sudo modprobe 8021q
```

```bash
# Cree une interface VLAN 10 sur eth0
sudo ip link add link eth0 name eth0.10 type vlan id 10
```

```bash
# Attribue une adresse IP a l'interface VLAN
sudo ip addr add 192.168.10.1/24 dev eth0.10
```

```bash
# Active l'interface VLAN
sudo ip link set eth0.10 up
```

**Résultat attendu** :

```bash
# Verifie l'interface VLAN
ip addr show eth0.10
```

```text
3: eth0.10@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    link/ether 08:00:27:ab:cd:ef brd ff:ff:ff:ff:ff:ff
    inet 192.168.10.1/24 scope global eth0.10
```

L'interface `eth0.10` est une interface virtuelle associee au VLAN 10. Les trames envoyées via cette interface seront automatiquement etiquetees avec le tag 802.1Q VLAN ID 10.

---

### Étape 6 : Supprimer l'interface VLAN

```bash
# Desactive et supprime l'interface VLAN
sudo ip link set eth0.10 down
sudo ip link delete eth0.10
```

**Résultat attendu** :

```bash
# Verifie que l'interface a ete supprimee
ip link show eth0.10 2>&1
```

```text
Device "eth0.10" does not exist.
```

---

### Étape 7 : Analyser le trafic Ethernet avec tcpdump

```bash
# Capture des trames avec les en-tetes Ethernet (option -e)
sudo tcpdump -c 5 -i eth0 -n -e
```

**Résultat attendu** :

```text
14:36:01.001 08:00:27:ab:cd:ef > aa:bb:cc:11:22:33, ethertype IPv4 (0x0800), length 98: 192.168.1.42 > 8.8.8.8: ICMP echo request
14:36:01.015 aa:bb:cc:11:22:33 > 08:00:27:ab:cd:ef, ethertype IPv4 (0x0800), length 98: 8.8.8.8 > 192.168.1.42: ICMP echo reply
```

L'option `-e` affiche les adresses MAC source et destination. Tu vois que les trames contiennent a la fois les adresses MAC (couche 2) et les adresses IP (couche 3).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip link show` | Affiche les interfaces et leurs adresses MAC |
| `ip neigh show` | Affiche le cache ARP (table IP vers MAC) |
| `sudo tcpdump -e -i eth0` | Capture les trames avec les en-tetes Ethernet |
| `sudo tcpdump -i eth0 arp` | Capture les paquets ARP |
| `sudo ip link add link eth0 name eth0.10 type vlan id 10` | Créé une interface VLAN 10 |
| `sudo ip link delete eth0.10` | Supprime une interface VLAN |
| `ip -d link show` | Affiche les détails des interfaces (dont VLANs) |
| `sudo modprobe 8021q` | Charge le module VLAN du noyau Linux |

---

## Pièges Frequents

### Piège 1 : Confondre switch et routeur

⚠️ **Problème** : Tu penses qu'un switch peut router des paquets entre des réseaux différents.

✅ **Solution** : Un switch classique (L2) ne comprend que les adresses MAC et transféré les trames au sein d'un meme VLAN/réseau. Pour communiquer entre réseaux (ou VLANs), il faut un routeur ou un switch de couche 3 (L3) qui comprend les adresses IP.

---

### Piège 2 : Oublier de configurer le trunk entre deux switchs

⚠️ **Problème** : Tu créés un VLAN 10 sur deux switchs mais les machines du VLAN 10 sur le switch A ne communiquent pas avec celles du VLAN 10 sur le switch B.

✅ **Solution** : Le lien entre les deux switchs doit être configure en trunk et le VLAN 10 doit être autorise sur ce trunk. Sans trunk, les trames du VLAN 10 ne traversent pas le lien inter-switch.

---

### Piège 3 : Laisser tous les ports dans le VLAN 1

⚠️ **Problème** : Tu ne configures aucun VLAN et tous les ports restent dans le VLAN 1 par défaut. Toutes les machines partagent le meme domaine de broadcast.

✅ **Solution** : Créé des VLANs pour segmenter ton réseau. Les ports inutilises doivent être places dans un VLAN dedie (ex: VLAN 999) et desactives. Cela empêche quelqu'un de brancher un appareil non autorise.

---

### Piège 4 : Confondre adresse MAC et adresse IP

⚠️ **Problème** : Tu essaies de router du trafic en utilisant les adresses MAC, ou tu essaies de commuter des trames en utilisant les adresses IP.

✅ **Solution** : L'adresse MAC est utilisée pour la communication locale (couche 2, meme réseau/VLAN). L'adresse IP est utilisée pour la communication entre réseaux (couche 3). ARP fait le lien entre les deux : il traduit une adresse IP en adresse MAC sur le réseau local.

---

### Piège 5 : Ne pas comprendre le VLAN natif sur un trunk

⚠️ **Problème** : Le VLAN natif est différent sur les deux extremites du trunk. Les trames non etiquetees arrivent dans le mauvais VLAN.

✅ **Solution** : Le VLAN natif doit être identique des deux cotes du trunk. Si le switch A a le VLAN natif 1 et le switch B a le VLAN natif 10, les trames non etiquetees seront placees dans le VLAN 1 d'un cote et le VLAN 10 de l'autre. Cela créé un problème de sécurité et de connectivite.

---

## Checklist de Validation

- [ ] Je sais expliquer la difference entre un hub et un switch
- [ ] Je connais le rôle de l'adresse MAC et sa structure (OUI + NIC)
- [ ] Je comprends comment un switch apprend les adresses MAC (table CAM)
- [ ] Je sais expliquer ce qu'est un VLAN et pourquoi segmenter un réseau
- [ ] Je connais la difference entre un port access et un port trunk
- [ ] Je sais décrire le fonctionnement du tag 802.1Q
- [ ] J'ai utilise `ip neigh show` pour afficher le cache ARP
- [ ] J'ai créé et supprime une interface VLAN sur Linux

---

## Exercice Pratique

**Enonce** : Explore la couche 2 de ton réseau et mets en pratique les concepts de commutation et de VLANs.

**Questions** :

1. Quelle est l'adresse MAC de chaque interface réseau de ta machine ?
2. Quelles entrées sont presentes dans ton cache ARP ? A quoi correspondent-elles ?
3. Capture une requête ARP avec `tcpdump`. Identifie la requête (qui demande ?) et la réponse (qui répond et avec quelle adresse MAC ?).
4. Créé une interface VLAN 42 sur ton interface principale avec l'adresse `10.42.0.1/24`. Verifie qu'elle est active. Puis supprime-la.
5. Dessine un schéma de réseau avec 2 switchs, 3 VLANs (10 = Développement, 20 = Marketing, 30 = Serveurs) et un routeur pour l'interconnexion. Indique quels ports sont access et lesquels sont trunk.

**Indications** :

- Utilise `ip link show` pour la question 1
- Utilise `ip neigh show` pour la question 2
- Utilise `sudo tcpdump -i eth0 arp` et `ping` pour la question 3
- Utilise les commandes de l'étape 5 pour la question 4
- Pour la question 5, pense a placer le trunk entre les deux switchs et le routeur sur un port trunk

**Résultat attendu** : Tu as les réponses aux cinq questions et tu comprends l'articulation entre les adresses MAC, les VLANs et le routage.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Adresses MAC**

```bash
ip link show
```

```text
1: lo: link/loopback 00:00:00:00:00:00
2: eth0: link/ether 08:00:27:ab:cd:ef
```

Réponse : L'interface `lo` a l'adresse `00:00:00:00:00:00` (loopback, pas de vraie MAC). L'interface `eth0` a l'adresse `08:00:27:ab:cd:ef` (tes valeurs seront différentes). Les 3 premiers octets (`08:00:27`) identifient le fabricant.

**Question 2 : Cache ARP**

```bash
ip neigh show
```

```text
192.168.1.1 dev eth0 lladdr aa:bb:cc:11:22:33 REACHABLE
```

Réponse : Le cache contient la correspondance IP-MAC des machines recemment contactees. `192.168.1.1` est généralement ta box Internet. Si tu as ping d'autres machines recemment, leurs entrées apparaissent aussi.

**Question 3 : Capture ARP**

Terminal 1 :

```bash
sudo tcpdump -c 4 -i eth0 -n arp
```

Terminal 2 :

```bash
# Vide le cache ARP et ping pour forcer une nouvelle resolution
sudo ip neigh flush all
ping -c 1 192.168.1.1
```

Résultat :

```text
ARP, Request who-has 192.168.1.1 tell 192.168.1.42
ARP, Reply 192.168.1.1 is-at aa:bb:cc:11:22:33
```

Réponse : Ta machine (`192.168.1.42`) demande "Qui a l'adresse 192.168.1.1 ?". La box Internet répond "C'est moi, mon adresse MAC est `aa:bb:cc:11:22:33`".

**Question 4 : Interface VLAN 42**

```bash
# Creation
sudo modprobe 8021q
sudo ip link add link eth0 name eth0.42 type vlan id 42
sudo ip addr add 10.42.0.1/24 dev eth0.42
sudo ip link set eth0.42 up

# Verification
ip addr show eth0.42
```

```text
3: eth0.42@eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 10.42.0.1/24 scope global eth0.42
```

```bash
# Suppression
sudo ip link set eth0.42 down
sudo ip link delete eth0.42
```

**Question 5 : Schéma de réseau**

```text
                    [Routeur]
                    eth0 (trunk)
                    VLAN 10: 192.168.10.1
                    VLAN 20: 192.168.20.1
                    VLAN 30: 192.168.30.1
                       |
              +--------+--------+
              |    Trunk (V10,V20,V30)
         [Switch A]         [Switch B]
         +---------+        +---------+
Port 1-4 |  V10    |  Port 1-4 |  V10    |   (Dev)
Port 5-8 |  V20    |  Port 5-8 |  V20    |   (Marketing)
Port 9-12|  V30    |  Port 9-12|  V30    |   (Serveurs)
Port 24  |  Trunk  |  Port 24  |  Trunk  |   (Inter-switch)
         +---------+        +---------+
```

Réponse : Les ports 1-12 de chaque switch sont des ports access, chacun dans son VLAN. Les ports 24 sont des ports trunk qui transportent les VLANs 10, 20 et 30 entre les switchs et vers le routeur. Le routeur a une sous-interface par VLAN et sert de passerelle pour le routage inter-VLAN.

---

## Navigation

← Fiche précédente : **[05 - Routage](05-routage.md)**

→ Fiche suivante : **[07 - Firewalls et filtrage](07-firewalls-filtrage.md)**
