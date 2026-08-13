---
tags:
  - Réseaux
  - Débutant
  - Concept
description: "Adressage IP : IPv4, notation CIDR, calcul de sous-réseaux, masques de sous-réseau et introduction a IPv6."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 14
cursus: "Réseaux"
---

# 02 - Adressage IP

> **En bref** : Tu apprendras comment les machines sont identifiees sur un réseau grâce aux adresses IP, comment fonctionnent les masques de sous-réseau et la notation CIDR, comment decouper un réseau en sous-réseaux, et tu découvriras les bases d'IPv6. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [01 - Introduction aux réseaux](01-introduction-reseaux.md) pour connaître le modèle OSI, le modèle TCP/IP et le principe d'encapsulation

## Objectif de cette fiche

A la fin de cette fiche, tu sauras lire et écrire une adresse IPv4, calculer un masque de sous-réseau, utiliser la notation CIDR, déterminer si deux machines sont sur le meme réseau, et identifier les differences fondamentales entre IPv4 et IPv6.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une adresse IP ?

**Définition** : Une adresse IP (Internet Protocol) est un identifiant numérique unique attribue a chaque équipement connecte a un réseau. Elle permet aux équipements de s'identifier et de communiquer entre eux. L'adresse IP fonctionne au niveau de la couche 3 (Réseau) du modèle OSI.

**Le problème que les adresses IP résolvent** :

Sans adresses IP, voici les problèmes rencontres :

1. **Pas d'identification** : Comment un routeur sait-il a quelle machine envoyer les données si aucune machine n'a d'identifiant unique ?
2. **Pas de routage** : Sans adresse, impossible de déterminer le chemin que doivent prendre les données pour atteindre leur destination.
3. **Pas de distinction réseau/machine** : Sans système d'adressage structure, impossible de savoir si deux machines sont sur le meme réseau local ou sur des réseaux différents.

**Comment les adresses IP résolvent ces problèmes** :

| Problème | Solution apportée par les adresses IP |
| --- | --- |
| Pas d'identification | Chaque machine reçoit une adresse unique sur le réseau |
| Pas de routage | Les routeurs lisent l'adresse de destination pour acheminer les paquets |
| Pas de distinction réseau/machine | L'adresse IP est divisee en deux parties : une partie réseau et une partie hôte |

**Analogie concrète** : Une adresse IP fonctionne comme une adresse postale. L'adresse `192.168.1.42` est comparable a "42, rue du Réseau, 75001 Paris". La partie "75001 Paris" identifie la ville (le réseau) et "42, rue du Réseau" identifie la maison dans cette ville (la machine sur le réseau).

**Ce qu'une adresse IP n'est PAS** :

- Une adresse IP n'est pas permanente (en général). La plupart des machines reçoivent une adresse dynamique via DHCP, qui peut changer a chaque connexion. Seuls les serveurs ont généralement des adresses statiques (fixes).
- Une adresse IP n'est pas une adresse MAC. L'adresse MAC identifie la carte réseau physique (couche 2). L'adresse IP identifie la machine sur le réseau (couche 3). Une machine peut avoir plusieurs adresses IP mais une seule adresse MAC par interface réseau.

---

### Structure d'une adresse IPv4

**Définition** : Une adresse IPv4 est composee de 4 octets (32 bits) separés par des points. Chaque octet est un nombre compris entre 0 et 255.

**Format** : `X.X.X.X` ou chaque `X` est un nombre entre 0 et 255.

**Exemples** :

- `192.168.1.42` - adresse privée typique
- `8.8.8.8` - serveur DNS public de Google
- `127.0.0.1` - adresse de loopback

**Representation binaire** :

Chaque octet correspond a 8 bits. L'adresse `192.168.1.42` en binaire :

```text
192     .  168     .  1       .  42
11000000.  10101000.  00000001.  00101010
```

Pour convertir un nombre decimal en binaire, on divise successivement par 2 :

```text
192 / 2 = 96  reste 0
 96 / 2 = 48  reste 0
 48 / 2 = 24  reste 0
 24 / 2 = 12  reste 0
 12 / 2 =  6  reste 0
  6 / 2 =  3  reste 0
  3 / 2 =  1  reste 1
  1 / 2 =  0  reste 1

En lisant les restes de bas en haut : 11000000 = 192
```

**Nombre total d'adresses IPv4** : 2^32 = 4 294 967 296 adresses (environ 4,3 milliards). Ce nombre est insuffisant pour le nombre d'équipements connectes dans le monde (plus de 15 milliards en 2025).

---

### Partie réseau et partie hôte

**Définition** : Une adresse IPv4 est divisee en deux parties :

- **Partie réseau** : identifie le réseau auquel appartient la machine
- **Partie hôte** : identifie la machine sur ce réseau

Le masque de sous-réseau détermine ou se situe la separation entre ces deux parties.

**Exemple avec le masque 255.255.255.0** :

```text
Adresse IP :       192.168.1.42
Masque :           255.255.255.0

Partie reseau :    192.168.1.___     (les 3 premiers octets)
Partie hote :      ___.___.___.42    (le dernier octet)
```

Toutes les machines dont l'adresse commence par `192.168.1` sont sur le meme réseau. La partie hôte (`.42`) identifie une machine spécifique dans ce réseau.

---

### Les classes d'adresses IPv4

**Définition** : Historiquement, les adresses IPv4 étaient reparties en classes (A, B, C) selon la taille du réseau. Cette classification est aujourd'hui largement remplacee par le CIDR, mais elle reste utilisée dans le vocabulaire courant.

| Classe | Premier octet | Masque par défaut | Nombre de réseaux | Nombre d'hôtes par réseau |
| --- | --- | --- | --- | --- |
| A | 1 - 126 | 255.0.0.0 | 126 | 16 777 214 |
| B | 128 - 191 | 255.255.0.0 | 16 384 | 65 534 |
| C | 192 - 223 | 255.255.255.0 | 2 097 152 | 254 |

**Adresses privées** (RFC 1918) :

Ces plages d'adresses sont reservees aux réseaux internes et ne sont pas routables sur Internet :

| Préfixe RFC 1918 | Plage privée | Masque | Usage typique |
| ---------------- | ------------ | ------ | ------------- |
| /8 | 10.0.0.0 - 10.255.255.255 | 255.0.0.0 | Grands réseaux internes |
| /12 (pas une classe B) | 172.16.0.0 - 172.31.255.255 | 255.240.0.0 | Réseaux internes moyens |
| /16 (pas une classe C) | 192.168.0.0 - 192.168.255.255 | 255.255.0.0 | Réseaux domestiques |

**Adresses speciales** :

| Adresse | Role |
| --- | --- |
| `127.0.0.1` | Loopback (la machine elle-même) |
| `0.0.0.0` | Adresse non specifiee (toutes les interfaces) |
| `255.255.255.255` | Broadcast (diffusion a toutes les machines du réseau) |
| `169.254.x.x` | APIPA (adresse automatique quand DHCP échoue) |

---

### Le masque de sous-réseau

**Définition** : Le masque de sous-réseau est un nombre de 32 bits qui indique quelle partie de l'adresse IP correspond au réseau et quelle partie correspond a l'hôte. Les bits a `1` designent la partie réseau, les bits a `0` designent la partie hôte.

**Le problème que le masque de sous-réseau résout** :

Sans masque de sous-réseau, voici les problèmes rencontres :

1. **Ambiguite** : En voyant l'adresse `10.1.2.3`, impossible de savoir si `10` est la partie réseau ou si c'est `10.1` ou `10.1.2`.
2. **Pas de sous-réseaux** : Sans masque, impossible de decouper un grand réseau en sous-réseaux plus petits pour organiser le trafic.

**Comment le masque résout ces problèmes** :

| Problème | Solution apportée par le masque |
| --- | --- |
| Ambiguite | Le masque indique exactement ou se trouve la frontière réseau/hôte |
| Pas de sous-réseaux | En modifiant le masque, on crée des sous-réseaux de tailles différentes |

**Exemples de masques courants** :

| Masque decimal | Masque binaire | Bits réseau | Notation CIDR |
| --- | --- | --- | --- |
| 255.0.0.0 | 11111111.00000000.00000000.00000000 | 8 | /8 |
| 255.255.0.0 | 11111111.11111111.00000000.00000000 | 16 | /16 |
| 255.255.255.0 | 11111111.11111111.11111111.00000000 | 24 | /24 |
| 255.255.255.128 | 11111111.11111111.11111111.10000000 | 25 | /25 |
| 255.255.255.192 | 11111111.11111111.11111111.11000000 | 26 | /26 |

**Analogie concrète** : Le masque de sous-réseau fonctionne comme le code postal dans une adresse postale. Le code postal `75001` te dit que la lettre va a Paris (1er arrondissement). Sans code postal, le facteur ne sait pas dans quelle ville chercher la rue. Le masque joue le meme rôle : il dit a la machine "les N premiers bits sont le réseau, le reste est l'adresse de la machine dans ce réseau".

---

### La notation CIDR

**Définition** : La notation CIDR (Classless Inter-Domain Routing) est une facon compacte d'écrire une adresse IP avec son masque de sous-réseau. On écrit l'adresse IP suivie d'un slash et du nombre de bits de la partie réseau.

**Format** : `adresse_IP/nombre_de_bits_reseau`

**Exemples** :

| Notation CIDR | Masque équivalent | Signification |
| --- | --- | --- |
| `192.168.1.0/24` | 255.255.255.0 | Les 24 premiers bits sont le réseau |
| `10.0.0.0/8` | 255.0.0.0 | Les 8 premiers bits sont le réseau |
| `172.16.0.0/16` | 255.255.0.0 | Les 16 premiers bits sont le réseau |
| `192.168.1.0/26` | 255.255.255.192 | Les 26 premiers bits sont le réseau |

**Calcul du nombre d'hôtes** :

Pour un réseau en `/N`, le nombre d'adresses disponibles est `2^(32-N)`. On soustrait 2 (l'adresse réseau et l'adresse de broadcast) pour obtenir le nombre d'hôtes utilisables :

| CIDR | Adresses totales | Hôtes utilisables |
| --- | --- | --- |
| /24 | 256 | 254 |
| /25 | 128 | 126 |
| /26 | 64 | 62 |
| /27 | 32 | 30 |
| /28 | 16 | 14 |
| /30 | 4 | 2 |

Le `/30` est utilise pour les liens point-a-point entre deux routeurs (2 hôtes suffisent).

---

### Le sous-reseautage (subnetting)

**Définition** : Le sous-reseautage consiste a decouper un réseau en sous-réseaux plus petits en empruntant des bits de la partie hôte pour les ajouter a la partie réseau.

**Le problème que le sous-reseautage résout** :

Sans sous-reseautage, voici les problèmes rencontres :

1. **Gaspillage d'adresses** : Un réseau en /24 donne 254 hôtes. Si tu n'en utilises que 10, les 244 adresses restantes sont gaspillees.
2. **Broadcast excessif** : Toutes les machines du même réseau reçoivent les messages broadcast. Plus le réseau est grand, plus le broadcast encombre le réseau.
3. **Pas de segmentation** : Sans sous-réseaux, tous les départements de l'entreprise partagent le meme réseau sans separation.

**Exemple de découpage** :

Réseau de départ : `192.168.1.0/24` (254 hôtes)

Decoupage en 4 sous-réseaux de `/26` (62 hôtes chacun) :

| Sous-réseau | Plage d'adresses | Adresse réseau | Broadcast | Hôtes utilisables |
| --- | --- | --- | --- | --- |
| 1 | 192.168.1.0 - 192.168.1.63 | 192.168.1.0 | 192.168.1.63 | 192.168.1.1 - 192.168.1.62 |
| 2 | 192.168.1.64 - 192.168.1.127 | 192.168.1.64 | 192.168.1.127 | 192.168.1.65 - 192.168.1.126 |
| 3 | 192.168.1.128 - 192.168.1.191 | 192.168.1.128 | 192.168.1.191 | 192.168.1.129 - 192.168.1.190 |
| 4 | 192.168.1.192 - 192.168.1.255 | 192.168.1.192 | 192.168.1.255 | 192.168.1.193 - 192.168.1.254 |

**Comment savoir si deux machines sont sur le meme réseau ?**

Applique le masque (opération ET logique) aux deux adresses. Si le résultat est identique, elles sont sur le meme réseau :

```text
Machine A : 192.168.1.42  / 255.255.255.0
Machine B : 192.168.1.100 / 255.255.255.0

192.168.1.42  ET 255.255.255.0 = 192.168.1.0
192.168.1.100 ET 255.255.255.0 = 192.168.1.0

Meme resultat → meme reseau ✅
```

```text
Machine A : 192.168.1.42  / 255.255.255.0
Machine C : 192.168.2.10  / 255.255.255.0

192.168.1.42 ET 255.255.255.0 = 192.168.1.0
192.168.2.10 ET 255.255.255.0 = 192.168.2.0

Resultat different → reseaux differents ❌ (besoin d'un routeur)
```

---

### Introduction a IPv6

**Définition** : IPv6 (Internet Protocol version 6) est le successeur d'IPv4. Il utilise des adresses de 128 bits (contre 32 bits pour IPv4), ce qui fournit un espace d'adressage immense.

**Pourquoi IPv6 existe** :

Le problème principal est l'epuisement des adresses IPv4. Avec 4,3 milliards d'adresses et plus de 15 milliards d'équipements connectes, IPv4 ne suffit plus. Le NAT (Network Address Translation) a repousse le problème mais ne l'a pas résolu.

**Format d'une adresse IPv6** :

- 128 bits, écrits en 8 groupes de 4 chiffres hexadecimaux separes par `:`
- Exemple : `2001:0db8:85a3:0000:0000:8a2e:0370:7334`

**Règles de simplification** :

1. Les zéros en tete de chaque groupe peuvent être omis : `0db8` → `db8`
2. Un ou plusieurs groupes consecutifs de zéros peuvent être remplaces par `::` (une seule fois) : `2001:0db8:0000:0000:0000:0000:0000:0001` → `2001:db8::1`

**Comparaison IPv4 vs IPv6** :

| IPv4 | IPv6 |
| --- | --- |
| 32 bits | 128 bits |
| ~4,3 milliards d'adresses | ~3,4 x 10^38 adresses |
| Notation décimale pointee (192.168.1.1) | Notation hexadecimale (2001:db8::1) |
| Necessite NAT | Assez d'adresses pour tout connecter directement |
| Configuration manuelle ou DHCP | Auto-configuration (SLAAC) |

**Adresses IPv6 speciales** :

| Adresse | Role |
| --- | --- |
| `::1` | Loopback (équivalent de 127.0.0.1) |
| `fe80::/10` | Lien local (équivalent de 169.254.x.x) |
| `2000::/3` | Adresses globales unicast (routables sur Internet) |
| `ff00::/8` | Multicast |

---

## Étapes Pratiques

### Étape 1 : Afficher ta configuration IP complete

```bash
# Affiche les adresses IP de toutes les interfaces
ip addr show
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP> mtu 65536
    inet 127.0.0.1/8 scope host lo
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
```

Tu vois :

- `inet 192.168.1.42/24` : ton adresse IPv4 avec le masque en notation CIDR
- `brd 192.168.1.255` : l'adresse de broadcast du réseau
- `inet6 fe80::...` : ton adresse IPv6 de lien local (générée automatiquement)

---

### Étape 2 : Identifier ton masque de sous-réseau

```bash
# Affiche les details de l'interface principale
ip -4 addr show eth0
```

**Résultat attendu** :

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP> mtu 1500
    inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
```

Le `/24` après l'adresse IP est le masque en notation CIDR. Cela correspond au masque `255.255.255.0`.

---

### Étape 3 : Calculer l'adresse réseau

L'adresse réseau s'obtient en appliquant un ET logique entre l'adresse IP et le masque. Avec des outils en ligne de commande :

```bash
# Installe ipcalc si necessaire (Debian/Ubuntu)
sudo apt install ipcalc -y
```

```bash
# Calcule les informations du sous-reseau
ipcalc 192.168.1.42/24
```

**Résultat attendu** :

```text
Address:   192.168.1.42         11000000.10101000.00000001. 00101010
Netmask:   255.255.255.0 = 24   11111111.11111111.11111111. 00000000
Wildcard:  0.0.0.255            00000000.00000000.00000000. 11111111
=>
Network:   192.168.1.0/24       11000000.10101000.00000001. 00000000
HostMin:   192.168.1.1          11000000.10101000.00000001. 00000001
HostMax:   192.168.1.254        11000000.10101000.00000001. 11111110
Broadcast: 192.168.1.255        11000000.10101000.00000001. 11111111
Hosts/Net: 254
```

Ce résultat montre clairement :

- L'adresse réseau : `192.168.1.0`
- La première adresse utilisable : `192.168.1.1`
- La dernière adresse utilisable : `192.168.1.254`
- L'adresse de broadcast : `192.168.1.255`
- Le nombre d'hôtes utilisables : 254

---

### Étape 4 : Decouper un réseau en sous-réseaux

Utilise `ipcalc` pour visualiser un découpage en sous-réseaux :

```bash
# Decoupe le reseau 192.168.1.0/24 en sous-reseaux de /26
ipcalc 192.168.1.0/26
```

**Résultat attendu** :

```text
Address:   192.168.1.0          11000000.10101000.00000001. 00000000
Netmask:   255.255.255.192 = 26 11111111.11111111.11111111. 11000000
Wildcard:  0.0.0.63             00000000.00000000.00000000. 00111111
=>
Network:   192.168.1.0/26       11000000.10101000.00000001. 00000000
HostMin:   192.168.1.1          11000000.10101000.00000001. 00000001
HostMax:   192.168.1.62         11000000.10101000.00000001. 00111110
Broadcast: 192.168.1.63         11000000.10101000.00000001. 00111111
Hosts/Net: 62
```

Pour voir le deuxième sous-réseau :

```bash
# Informations du deuxieme sous-reseau
ipcalc 192.168.1.64/26
```

**Résultat attendu** :

```text
Network:   192.168.1.64/26
HostMin:   192.168.1.65
HostMax:   192.168.1.126
Broadcast: 192.168.1.127
Hosts/Net: 62
```

---

### Étape 5 : Verifier la connectivite IPv6

```bash
# Affiche uniquement les adresses IPv6
ip -6 addr show
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet6 ::1/128 scope host
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
```

```bash
# Ping en IPv6 vers le loopback
ping -6 -c 4 ::1
```

**Résultat attendu** :

```text
PING ::1(::1) 56 data bytes
64 bytes from ::1: icmp_seq=1 ttl=64 time=0.030 ms
64 bytes from ::1: icmp_seq=2 ttl=64 time=0.025 ms
64 bytes from ::1: icmp_seq=3 ttl=64 time=0.027 ms
64 bytes from ::1: icmp_seq=4 ttl=64 time=0.026 ms
```

L'adresse `::1` est l'équivalent IPv6 de `127.0.0.1`.

---

### Étape 6 : Déterminer si deux machines sont sur le meme réseau

```bash
# Methode manuelle avec ipcalc
# Machine A
ipcalc 192.168.1.42/24 | grep Network
```

```text
Network:   192.168.1.0/24
```

```bash
# Machine B
ipcalc 192.168.1.100/24 | grep Network
```

```text
Network:   192.168.1.0/24
```

Meme adresse réseau (`192.168.1.0/24`) → les deux machines sont sur le meme réseau.

```bash
# Machine C (reseau different)
ipcalc 192.168.2.10/24 | grep Network
```

```text
Network:   192.168.2.0/24
```

Adresse réseau différente (`192.168.2.0/24`) → Machine C est sur un autre réseau. Il faut un routeur pour que Machine A communique avec Machine C.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip addr show` | Affiche toutes les adresses IP |
| `ip -4 addr show eth0` | Affiche l'adresse IPv4 de l'interface eth0 |
| `ip -6 addr show` | Affiche les adresses IPv6 |
| `ipcalc <adresse>/<masque>` | Calcule les informations du sous-réseau |
| `ping -6 -c 4 ::1` | Teste la connectivite IPv6 vers le loopback |
| `hostname -I` | Affiche toutes les adresses IP de la machine |

---

## Pièges Frequents

### Piège 1 : Confondre adresse réseau et adresse de broadcast

⚠️ **Problème** : Tu essaies d'attribuer l'adresse `192.168.1.0` ou `192.168.1.255` a une machine dans un réseau `/24`.

✅ **Solution** : Dans un réseau `/24`, la première adresse (`192.168.1.0`) est l'adresse réseau et la dernière (`192.168.1.255`) est l'adresse de broadcast. Ces deux adresses sont reservees et ne peuvent pas être attribuees a un hôte. Les adresses utilisables vont de `.1` a `.254`.

---

### Piège 2 : Oublier que le masque change le nombre d'hôtes

⚠️ **Problème** : Tu penses que `192.168.1.0/24` et `192.168.1.0/26` sont le meme réseau parce qu'ils commencent par les memes chiffres.

✅ **Solution** : Le masque change tout. Un `/24` contient 254 hôtes (192.168.1.1 a 192.168.1.254). Un `/26` contient seulement 62 hôtes (192.168.1.1 a 192.168.1.62). Utilise toujours `ipcalc` pour vérifier.

---

### Piège 3 : Utiliser une adresse privée sur Internet

⚠️ **Problème** : Tu configures un serveur avec l'adresse `192.168.1.100` en pensant qu'il sera accessible depuis Internet.

✅ **Solution** : Les adresses privées (10.x.x.x, 172.16-31.x.x, 192.168.x.x) ne sont pas routables sur Internet. Elles fonctionnent uniquement dans un réseau local. Pour rendre un serveur accessible depuis Internet, il faut une adresse IP publique (fournie par ton FAI) et configurer le NAT sur ton routeur.

---

### Piège 4 : Confondre /24 et /16

⚠️ **Problème** : Tu configures ton masque en `/16` au lieu de `/24` sur un petit réseau domestique. Résultat : la machine croit que 65 534 adresses sont sur le meme réseau et n'utilise plus le routeur pour les joindre.

✅ **Solution** : Verifie le masque avec `ip addr show`. Un réseau domestique utilise généralement `/24` (255.255.255.0). Si tu vois `/16`, c'est probablement une erreur de configuration.

---

## Checklist de Validation

- [ ] Je sais lire une adresse IPv4 et identifier chaque octet
- [ ] Je comprends la difference entre partie réseau et partie hôte
- [ ] Je sais convertir un masque CIDR en masque decimal (ex: /24 = 255.255.255.0)
- [ ] Je sais calculer le nombre d'hôtes utilisables pour un masque donne
- [ ] Je sais déterminer si deux machines sont sur le meme réseau
- [ ] Je connais les plages d'adresses privées (10.x, 172.16-31.x, 192.168.x)
- [ ] Je sais lire une adresse IPv6 simplifiée
- [ ] J'ai utilise `ipcalc` pour calculer un sous-réseau

---

## Exercice Pratique

**Enonce** : Reponds aux questions suivantes en utilisant les commandes et les connaissances acquises dans cette fiche.

**Questions** :

1. Quelle est l'adresse IP, le masque et l'adresse de broadcast de ton interface principale ?
2. Combien d'hôtes utilisables contient ton réseau ?
3. Decoupe le réseau `10.0.0.0/24` en 8 sous-réseaux. Donne l'adresse réseau, la première et la dernière adresse utilisable et l'adresse de broadcast de chaque sous-réseau.
4. Les machines `172.16.5.20/20` et `172.16.12.100/20` sont-elles sur le meme réseau ?
5. Simplifie l'adresse IPv6 `2001:0db8:0000:0000:0000:0000:0000:0001`.

**Indications** :

- Utilise `ip addr show` pour la question 1
- Utilise `ipcalc` pour les questions 2, 3 et 4
- Pour la question 3, si tu decoupes un /24 en 8, tu empruntes 3 bits supplémentaires (2^3 = 8), donc le masque devient /27
- Pour la question 5, applique les règles de simplification IPv6

**Résultat attendu** : Tu as les réponses aux cinq questions et tu sais utiliser `ipcalc` pour vérifier tes calculs.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complete. Essaie d'abord de résoudre l'exercice par toi-meme avant de consulter cette solution.

---

**Question 1 : Adresse IP, masque et broadcast**

```bash
# Affiche les informations de l'interface principale
ip -4 addr show eth0
```

Résultat typique :

```text
inet 192.168.1.42/24 brd 192.168.1.255 scope global eth0
```

Réponse : Adresse `192.168.1.42`, masque `/24` (255.255.255.0), broadcast `192.168.1.255`. Tes valeurs seront différentes.

**Question 2 : Nombre d'hôtes utilisables**

```bash
ipcalc 192.168.1.42/24 | grep Hosts
```

```text
Hosts/Net: 254
```

Réponse : 254 hôtes utilisables (256 adresses totales - 1 adresse réseau - 1 adresse broadcast).

**Question 3 : Decoupage en 8 sous-réseaux**

Un /24 decoupe en 8 sous-réseaux donne des sous-réseaux en /27 (24 + 3 = 27, car 2^3 = 8).

```bash
# Premier sous-reseau
ipcalc 10.0.0.0/27
```

| # | Adresse réseau | Première utilisable | Dernière utilisable | Broadcast |
| --- | --- | --- | --- | --- |
| 1 | 10.0.0.0/27 | 10.0.0.1 | 10.0.0.30 | 10.0.0.31 |
| 2 | 10.0.0.32/27 | 10.0.0.33 | 10.0.0.62 | 10.0.0.63 |
| 3 | 10.0.0.64/27 | 10.0.0.65 | 10.0.0.94 | 10.0.0.95 |
| 4 | 10.0.0.96/27 | 10.0.0.97 | 10.0.0.126 | 10.0.0.127 |
| 5 | 10.0.0.128/27 | 10.0.0.129 | 10.0.0.158 | 10.0.0.159 |
| 6 | 10.0.0.160/27 | 10.0.0.161 | 10.0.0.190 | 10.0.0.191 |
| 7 | 10.0.0.192/27 | 10.0.0.193 | 10.0.0.222 | 10.0.0.223 |
| 8 | 10.0.0.224/27 | 10.0.0.225 | 10.0.0.254 | 10.0.0.255 |

Chaque sous-réseau contient 30 hôtes utilisables (32 - 2 = 30).

**Question 4 : Meme réseau ?**

```bash
ipcalc 172.16.5.20/20 | grep Network
ipcalc 172.16.12.100/20 | grep Network
```

```text
Network:   172.16.0.0/20
Network:   172.16.0.0/20
```

Réponse : Oui, les deux machines sont sur le meme réseau (`172.16.0.0/20`). Un masque /20 couvre les adresses de 172.16.0.0 a 172.16.15.255.

**Question 5 : Simplification IPv6**

Adresse originale : `2001:0db8:0000:0000:0000:0000:0000:0001`

1. Suppression des zéros en tete : `2001:db8:0:0:0:0:0:1`
2. Remplacement des groupes de zéros consecutifs par `::` : `2001:db8::1`

Réponse : `2001:db8::1`

---

## Navigation

← Fiche précédente : **[01 - Introduction aux réseaux](01-introduction-reseaux.md)**

→ Fiche suivante : **[03 - Protocoles de transport](03-protocoles-transport.md)**
