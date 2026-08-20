---
tags:
  - Méthodologie
  - Débutant
  - Concept
description: "01 - L'Infrastructure Réseau"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 4
cursus: "Architecture SI"
---

# 01 - L'Infrastructure Réseau

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est une infrastructure réseau, comment les ordinateurs communiquent entre eux, et tu comprendras les concepts de base : adresses IP, sous-réseaux, protocoles, et VLAN. Lecture estimée : 40 min.


## Prérequis

- Connaissances de base en informatique (ce qu'est un ordinateur, internet)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est une infrastructure réseau, comment les ordinateurs communiquent entre eux, et tu comprendras les concepts de base : adresses IP, sous-réseaux, protocoles, et VLAN.

---

## Concepts

### Qu'est-ce qu'une infrastructure réseau ?

**Définition** : Une infrastructure réseau est l'ensemble des équipements (câbles, switchs, routeurs, serveurs) et des configurations qui permettent aux ordinateurs de communiquer entre eux et avec internet.

**Le problème que l'infrastructure réseau résout** :

Sans réseau, voici les problèmes rencontrés :

1. **Isolation** : Chaque ordinateur est isolé, impossible de partager des fichiers.
2. **Pas d'internet** : Aucun accès aux ressources en ligne.
3. **Duplication** : Chaque poste doit avoir sa propre copie de tout.
4. **Communication difficile** : Échanges uniquement par clé USB ou papier.

**Comment le réseau résout ces problèmes** :

| Problème | Solution réseau |
| -------- | --------------- |
| Isolation | Connexion de tous les postes |
| Pas d'internet | Passerelle vers l'extérieur |
| Duplication | Serveurs de fichiers partagés |
| Communication difficile | Email, messagerie instantanée |

**Analogie concrète** : Un réseau informatique est comme le réseau routier d'une ville. Les ordinateurs sont les maisons, les câbles sont les routes, les switchs sont les carrefours, et le routeur est le péage d'autoroute qui te permet de sortir de la ville (aller sur internet).

---

### Qu'est-ce qu'une adresse IP ?

**Définition** : Une adresse IP (Internet Protocol) est un numéro unique qui identifie un appareil sur un réseau, comme une adresse postale identifie une maison.

**Deux versions d'IP** :

| Version | Format | Exemple | Nombre d'adresses |
| ------- | ------ | ------- | ----------------- |
| IPv4 | 4 nombres de 0 à 255 | 192.168.1.10 | ~4 milliards |
| IPv6 | 8 groupes hexadécimaux | 2001:0db8:85a3::8a2e:0370:7334 | Quasi-infini |

**Types d'adresses IPv4** :

| Type | Plage | Usage |
| ---- | ----- | ----- |
| Privée | 10.x.x.x, 172.16-31.x.x, 192.168.x.x | Réseau interne (non routable sur internet) |
| Publique | Toutes les autres | Accessible depuis internet |
| Localhost | 127.0.0.1 | L'ordinateur lui-même |

**Analogie concrète** : L'adresse IP est comme l'adresse postale d'une maison. L'adresse privée (192.168.1.10) est comme "Appartement 10, Bâtiment A" - ça n'a de sens qu'à l'intérieur de la résidence. L'adresse publique est comme "15 rue de la Paix, 75001 Paris" - tout le monde peut t'y trouver.

---

### Qu'est-ce qu'un sous-réseau (subnet) ?

**Définition** : Un sous-réseau est une division logique d'un réseau plus grand. Il permet de segmenter le réseau en parties plus petites et plus faciles à gérer.

**Le masque de sous-réseau** :

Le masque indique quelle partie de l'adresse IP identifie le réseau et quelle partie identifie l'appareil.

| Masque | Notation CIDR | Signification |
| ------ | ------------- | ------------- |
| 255.255.255.0 | /24 | 256 adresses (254 utilisables) |
| 255.255.0.0 | /16 | 65 536 adresses |
| 255.0.0.0 | /8 | 16 millions d'adresses |

**Exemple** :

```text
Adresse IP : 192.168.1.10
Masque : 255.255.255.0 (/24)

Partie réseau : 192.168.1.x (identifie le sous-réseau)
Partie hôte : x.x.x.10 (identifie l'appareil dans ce sous-réseau)

Adresses dans ce sous-réseau : 192.168.1.0 à 192.168.1.255
- 192.168.1.0 = adresse du réseau (réservée)
- 192.168.1.255 = broadcast (réservée)
- 192.168.1.1 à 192.168.1.254 = utilisables (254 appareils)
```

**Analogie concrète** : Le sous-réseau est comme un étage dans un immeuble. L'adresse "192.168.1.x" est l'étage 1, "192.168.2.x" est l'étage 2. Le masque /24 dit "les 3 premiers nombres = l'étage, le dernier = le numéro d'appartement".

---

### Qu'est-ce qu'un VLAN ?

**Définition** : Un VLAN (Virtual Local Area Network) est un réseau local virtuel qui permet de séparer logiquement des appareils sur un même réseau physique, comme s'ils étaient sur des réseaux différents.

**Le problème que les VLANs résolvent** :

Sans VLAN, voici les problèmes rencontrés :

1. **Pas de segmentation** : Tous les appareils peuvent se voir et communiquer.
2. **Sécurité faible** : Un virus se propage à tous les postes.
3. **Performance dégradée** : Le trafic broadcast atteint tout le monde.

**Comment les VLANs résolvent ces problèmes** :

| Problème | Solution VLAN |
| -------- | ------------- |
| Pas de segmentation | Séparation logique par département/fonction |
| Sécurité faible | Isolation du trafic entre VLANs |
| Performance dégradée | Broadcast limité au VLAN |

**Exemple d'organisation** :

| VLAN ID | Nom | Sous-réseau | Usage |
| ------- | --- | ----------- | ----- |
| 10 | Administration | 192.168.10.0/24 | Direction, RH, Compta |
| 20 | Production | 192.168.20.0/24 | Développeurs, serveurs |
| 30 | Invités | 192.168.30.0/24 | WiFi visiteurs |
| 40 | Serveurs | 192.168.40.0/24 | Infrastructure |

**Analogie concrète** : Les VLANs sont comme les badges d'accès dans une entreprise. Même si tout le monde est dans le même bâtiment (même réseau physique), ton badge ne te donne accès qu'à certains étages (ton VLAN). Le VLAN "Invités" ne peut pas accéder aux serveurs, même s'ils sont branchés sur le même switch.

---

### Quels sont les équipements réseau principaux ?

| Équipement | Rôle | Couche OSI |
| ---------- | ---- | ---------- |
| **Câble** | Transporte le signal électrique/optique | 1 - Physique |
| **Switch** | Connecte les appareils d'un même réseau | 2 - Liaison |
| **Routeur** | Connecte différents réseaux entre eux | 3 - Réseau |
| **Firewall** | Filtre le trafic selon des règles | 3-7 |
| **Point d'accès WiFi** | Connexion sans fil | 1-2 |

**Schéma simplifié** :

```text
Internet
    │
    ▼
┌─────────┐
│ Routeur │ ← Relie le réseau local à internet
└────┬────┘
     │
┌────▼────┐
│Firewall │ ← Filtre le trafic entrant/sortant
└────┬────┘
     │
┌────▼────┐
│ Switch  │ ← Connecte tous les appareils locaux
└────┬────┘
     │
┌────┴────┬─────────┬─────────┐
│         │         │         │
▼         ▼         ▼         ▼
PC1      PC2     Serveur   Imprimante
```

---

## Étapes Pratiques

### Étape 1 : Afficher la configuration réseau de ton ordinateur

**Sur Linux/Mac** :

```bash
# Afficher toutes les interfaces réseau
ip addr

# Ou version plus lisible
ip -c addr
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet 127.0.0.1/8 scope host lo

2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.1.50/24 brd 192.168.1.255 scope global eth0
```

**Explication ligne par ligne** :

| Élément | Signification |
| ------- | ------------- |
| `lo` | Interface loopback (localhost) |
| `eth0` | Interface Ethernet (carte réseau filaire) |
| `inet 192.168.1.50/24` | Adresse IP et masque |
| `brd 192.168.1.255` | Adresse de broadcast |

---

### Étape 2 : Afficher la table de routage

```bash
# Afficher les routes
ip route
```

**Résultat attendu** :

```text
default via 192.168.1.1 dev eth0
192.168.1.0/24 dev eth0 proto kernel scope link src 192.168.1.50
```

**Explication** :

| Ligne | Signification |
| ----- | ------------- |
| `default via 192.168.1.1` | Passerelle par défaut (routeur) |
| `192.168.1.0/24 dev eth0` | Réseau local accessible directement |

---

### Étape 3 : Tester la connectivité avec ping

```bash
# Tester la connexion à la passerelle
ping -c 4 192.168.1.1

# Tester la connexion à internet
ping -c 4 8.8.8.8

# Tester la résolution DNS
ping -c 4 google.com
```

**Résultat attendu (succès)** :

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.
64 bytes from 8.8.8.8: icmp_seq=1 ttl=117 time=12.3 ms
64 bytes from 8.8.8.8: icmp_seq=2 ttl=117 time=11.8 ms

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 4 received, 0% packet loss
```

**Résultat si échec** :

```text
PING 8.8.8.8 (8.8.8.8) 56(84) bytes of data.

--- 8.8.8.8 ping statistics ---
4 packets transmitted, 0 received, 100% packet loss
```

---

### Étape 4 : Diagnostiquer le chemin réseau avec traceroute

```bash
# Voir le chemin jusqu'à une destination
traceroute google.com
```

**Résultat attendu** :

```text
traceroute to google.com (142.250.75.238), 30 hops max
 1  192.168.1.1 (192.168.1.1)  1.234 ms
 2  10.0.0.1 (10.0.0.1)  8.567 ms
 3  isp-router.example.com (203.0.113.1)  15.890 ms
 ...
10  142.250.75.238 (142.250.75.238)  25.123 ms
```

Chaque ligne est un "saut" (hop) = un routeur traversé.

---

### Étape 5 : Analyser les ports ouverts

```bash
# Voir les ports en écoute sur ta machine
ss -tuln
```

**Résultat attendu** :

```text
Netid  State   Local Address:Port
tcp    LISTEN  0.0.0.0:22
tcp    LISTEN  0.0.0.0:80
tcp    LISTEN  127.0.0.1:5432
```

**Explication** :

| Port | Service typique |
| ---- | --------------- |
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS |
| 5432 | PostgreSQL |
| 3306 | MySQL |

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `ip addr` | Afficher les interfaces et adresses IP |
| `ip route` | Afficher la table de routage |
| `ping <ip>` | Tester la connectivité |
| `traceroute <ip>` | Voir le chemin réseau |
| `ss -tuln` | Voir les ports en écoute |
| `nslookup <domaine>` | Résoudre un nom de domaine en IP |
| `curl ifconfig.me` | Afficher ton IP publique |

---

## Pièges Fréquents

### Piège 1 : Confondre IP privée et IP publique

⚠️ **Problème** : Donner son IP privée (192.168.x.x) quand on demande l'IP publique.

✅ **Solution** : IP privée = `ip addr`. IP publique = `curl ifconfig.me`.

---

### Piège 2 : Oublier le masque de sous-réseau

⚠️ **Problème** : Configurer une IP sans masque = pas de communication.

✅ **Solution** : Toujours spécifier le masque : `192.168.1.10/24` ou `255.255.255.0`.

---

### Piège 3 : Mauvaise passerelle par défaut

⚠️ **Problème** : Réseau local OK, mais pas d'accès internet.

✅ **Solution** : Vérifier que la passerelle (`default via x.x.x.x`) est correcte et accessible.

---

### Piège 4 : Confondre switch et routeur

⚠️ **Problème** : Penser qu'un switch permet d'accéder à internet.

✅ **Solution** : Switch = même réseau. Routeur = entre réseaux différents.

---

## Checklist de Validation

- [ ] Je comprends ce qu'est une adresse IP (privée vs publique)
- [ ] Je comprends le rôle du masque de sous-réseau
- [ ] Je sais ce qu'est un VLAN et pourquoi on l'utilise
- [ ] Je connais la différence entre switch et routeur
- [ ] Je sais afficher ma configuration réseau (`ip addr`)
- [ ] Je sais tester la connectivité (`ping`)
- [ ] Je sais voir le chemin réseau (`traceroute`)

---

## Exercice Pratique

**Énoncé** : Tu dois concevoir le plan d'adressage IP pour une petite entreprise de 50 personnes avec 3 départements.

1. Définis 3 VLANs avec leurs noms et usages
2. Attribue un sous-réseau /24 à chaque VLAN
3. Indique la passerelle par défaut pour chaque VLAN
4. Dessine un schéma simplifié de l'infrastructure

**Résultat attendu** : Un document Markdown d'environ 40-50 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

### 1. VLANs définis

| VLAN ID | Nom | Usage | Postes estimés |
| ------- | --- | ----- | -------------- |
| 10 | Administration | Direction, RH, Comptabilité | 15 |
| 20 | Technique | Développeurs, IT | 25 |
| 30 | Serveurs | Infrastructure, services | 10 |

---

### 2. Sous-réseaux

| VLAN | Sous-réseau | Plage utilisable | Broadcast |
| ---- | ----------- | ---------------- | --------- |
| 10 | 192.168.10.0/24 | 192.168.10.1 - 192.168.10.254 | 192.168.10.255 |
| 20 | 192.168.20.0/24 | 192.168.20.1 - 192.168.20.254 | 192.168.20.255 |
| 30 | 192.168.30.0/24 | 192.168.30.1 - 192.168.30.254 | 192.168.30.255 |

---

### 3. Passerelles

| VLAN | Passerelle par défaut |
| ---- | --------------------- |
| 10 | 192.168.10.1 |
| 20 | 192.168.20.1 |
| 30 | 192.168.30.1 |

Le routeur possède une interface dans chaque VLAN (inter-VLAN routing).

---

### 4. Schéma d'infrastructure

```text
                Internet
                    │
              ┌─────▼─────┐
              │  Routeur  │
              │ Firewall  │
              └─────┬─────┘
                    │
         ┌──────────┼──────────┐
         │          │          │
    VLAN 10    VLAN 20    VLAN 30
   ┌──┴──┐    ┌──┴──┐    ┌──┴──┐
   │Switch│    │Switch│    │Switch│
   └──┬──┘    └──┬──┘    └──┬──┘
      │          │          │
   15 PC      25 PC     Serveurs
   Admin     Technique  (Web, BDD)
```

---

## Navigation

→ Fiche suivante : **[02 - La Supervision et le Monitoring](02-supervision-monitoring.md)**
