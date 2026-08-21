---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "IPv6 et coexistence IPv4/IPv6 : format d'adresse, types (link-local, ULA, global), SLAAC vs DHCPv6, dual-stack, tunneling et configuration pratique Linux."
estimated_time: "75 min"
fiche_number: 13
total_fiches: 14
cursus: "Réseaux"
id: "infrastructure.networks.ipv6-coexistence"
course_id: "infrastructure.networks"
content_type: "lesson"
order: 13
---

# 13 - IPv6 et coexistence IPv4/IPv6

> **En bref** : Tu apprendras le format des adresses IPv6, les différents types d'adresses, comment configurer un réseau IPv6 sur Linux, et comment faire coexister IPv4 et IPv6 avec le dual-stack. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [02 - Adressage IP](02-adressage-ip.md) pour comprendre IPv4, les masques CIDR et les notions de réseau/hôte
- Avoir lu la fiche [01 - Introduction aux réseaux](01-introduction-reseaux.md) pour le modèle OSI et le principe d'encapsulation

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et écrire une adresse IPv6 complète ou abrégée, distinguer les types d'adresses (link-local, ULA, global unicast), comprendre la différence entre SLAAC et DHCPv6, configurer une interface Linux en IPv6 et mettre en place un dual-stack opérationnel.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Pourquoi IPv6 est devenu indispensable ?

**Définition** : IPv6 (Internet Protocol version 6) est la sixième version du protocole Internet. Il utilise des adresses de 128 bits, contre 32 bits pour IPv4, ce qui résout définitivement la pénurie d'adresses publiques.

**Le problème que IPv6 résout** :

Sans IPv6, voici les problèmes rencontrés :

1. **Épuisement des adresses IPv4** : Les 4,3 milliards d'adresses IPv4 ont été attribuées en totalité. Les registres régionaux (ARIN, RIPE, APNIC) n'ont plus de blocs disponibles depuis 2011 à 2019 selon les régions.
2. **Complexité du NAT** : Pour contourner la pénurie, le NAT (Network Address Translation) permet à plusieurs machines de partager une seule IP publique. Cela complique le débogage, brise le modèle end-to-end d'Internet et pose des problèmes pour les protocoles pair-à-pair.
3. **Absence d'auto-configuration native** : IPv4 nécessite un serveur DHCP ou une configuration manuelle pour attribuer les adresses.

**Comment IPv6 résout ces problèmes** :

| Problème | Solution apportée par IPv6 |
| --- | --- |
| Épuisement IPv4 | 2^128 adresses (~3,4 × 10^38) - assez pour attribuer une adresse publique à chaque objet sur Terre |
| Complexité du NAT | Chaque appareil peut avoir une adresse publique unique. Le NAT n'est plus **nécessaire** pour économiser de l'IPv4, mais le NPTv6 / NAT66 existe encore dans certains déploiements. |
| Absence d'auto-configuration | SLAAC (Stateless Address Autoconfiguration) permet à une machine de générer sa propre adresse sans serveur |

**Analogie concrète** : IPv4 c'est comme un immeuble avec 4,3 milliards d'appartements - tous occupés. IPv6 c'est comme construire un nouvel immeuble avec 340 milliards de milliards de milliards de milliards d'appartements. Il n'y a plus besoin de faire partager un même appartement à plusieurs familles (NAT).

**Ce qu'IPv6 n'est PAS** :

- IPv6 n'est pas une mise à jour transparente d'IPv4. Les deux protocoles sont incompatibles : une machine purement IPv4 ne peut pas communiquer directement avec une machine purement IPv6.
- IPv6 n'est pas encore universel. En 2025-2026, de l'ordre de 45 à 50 % des utilisateurs Google accèdent au service en IPv6 (mesure publique Google IPv6 Statistics), mais de nombreux réseaux d'entreprise et FAI restent en IPv4 uniquement ou en dual-stack.

---

### Format et notation des adresses IPv6

**Définition** : Une adresse IPv6 est composée de 128 bits, écrits sous la forme de 8 groupes de 4 chiffres hexadécimaux, séparés par des deux-points.

**Format complet** :

```text
2001:0db8:85a3:0000:0000:8a2e:0370:7334
 \___/ \___/ \___/ \___/ \___/ \___/ \___/ \___/
  g1    g2    g3    g4    g5    g6    g7    g8
```

Chaque groupe représente 16 bits (4 chiffres hexadécimaux).

**Règles d'abréviation** :

Règle 1 : Les zéros en tête de chaque groupe peuvent être omis.

```text
2001:0db8:0000:0001   →   2001:db8:0:1
```

Règle 2 : Une séquence consécutive de groupes tous à zéro peut être remplacée par `::` - **une seule fois** dans l'adresse.

```text
2001:db8:0:0:0:0:0:1   →   2001:db8::1
```

**Exemples d'abréviation** :

| Adresse complète | Adresse abrégée |
| --- | --- |
| `2001:0db8:0000:0000:0000:0000:0000:0001` | `2001:db8::1` |
| `fe80:0000:0000:0000:0200:ff:fe00:0001` | `fe80::200:ff:fe00:1` |
| `0000:0000:0000:0000:0000:0000:0000:0001` | `::1` |
| `0000:0000:0000:0000:0000:0000:0000:0000` | `::` |

**Piège** : On ne peut pas utiliser `::` deux fois dans la même adresse. `2001::db8::1` est invalide car il serait impossible de savoir combien de zéros chaque `::` représente.

---

### Types d'adresses IPv6

**Définition** : IPv6 définit plusieurs types d'adresses selon leur portée et leur usage. Connaître ces types est indispensable pour configurer un réseau IPv6 correctement.

**Le problème que les types d'adresses résolvent** :

Sans distinction par types, voici les problèmes rencontrés :

1. **Confusion entre adresses locales et globales** : Comment savoir si une adresse est utilisable sur Internet ou seulement sur le réseau local ?
2. **Pas de séparation réseau interne / Internet** : IPv4 utilise les plages privées (RFC 1918) pour ça. IPv6 a son propre mécanisme.
3. **Communication sur le même lien sans routeur** : Il faut une adresse qui fonctionne même sans routeur ni DHCP.

**Les trois types principaux** :

| Type | Plage | Portée | Analogie |
| --- | --- | --- | --- |
| Link-local | `fe80::/10` | Un seul lien réseau (un seul câble / Wi-Fi) | Numéro de poste interne à un bâtiment |
| ULA (Unique Local Address) | `fc00::/7` (en pratique `fd00::/8`) | Réseau privé (non routable sur Internet) | Adresse privée IPv4 (192.168.x.x) |
| Global unicast | `2000::/3` | Internet entier | Adresse IP publique IPv4 |

**Détail du type link-local** :

L'adresse link-local (`fe80::/10`) est **générée automatiquement** par chaque interface réseau dès son activation. Elle est indispensable au fonctionnement d'IPv6 car elle sert à :

- Découvrir les autres machines sur le même lien (NDP - Neighbor Discovery Protocol)
- Communiquer avec le routeur par défaut
- Lancer SLAAC ou DHCPv6

**Format typique** : `fe80::xxxx:xxxx:xxxx:xxxx/64` où `xxxx:xxxx:xxxx:xxxx` est dérivé de l'adresse MAC de l'interface (méthode EUI-64) ou généré aléatoirement (privacy extensions).

**Détail du type ULA** :

L'ULA est l'équivalent IPv6 des adresses privées RFC 1918. Le préfixe réservé par la RFC 4193 est `fc00::/7`, mais seul `fd00::/8` (bit L=1) est actuellement défini et utilisé ; `fc00::/8` (bit L=0) n'est pas encore assigné par l'IETF. En pratique, tout préfixe ULA commence donc par `fd`.

**Comment générer un préfixe ULA** : Prendre 40 bits aléatoires et les ajouter à `fd`. Par exemple : `fd12:3456:789a::/48`.

**Détail du type global unicast** :

Les adresses global unicast (`2000::/3`) sont les adresses IPv6 publiques, routables sur Internet. Un fournisseur d'accès attribue généralement un préfixe `/48` ou `/56` à un client, qui peut ensuite diviser ce préfixe en sous-réseaux `/64`.

---

### SLAAC vs DHCPv6

**Définition** : SLAAC (Stateless Address Autoconfiguration) et DHCPv6 sont deux mécanismes permettant à une machine d'obtenir une adresse IPv6 automatiquement, sans configuration manuelle.

**Le problème que ces mécanismes résolvent** :

Sans auto-configuration, chaque machine doit être configurée manuellement avec son adresse IPv6, son préfixe et sa passerelle - un travail impossible à grande échelle.

**SLAAC** :

SLAAC permet à une machine de construire sa propre adresse IPv6 globale sans serveur centralisé :

1. La machine émet une requête "Router Solicitation" (RS) en multicast
2. Le routeur répond avec une "Router Advertisement" (RA) contenant le préfixe réseau (ex: `2001:db8::/64`)
3. La machine combine ce préfixe avec son identifiant d'interface (dérivé de l'adresse MAC ou aléatoire)
4. La machine vérifie que l'adresse n'est pas déjà utilisée sur le lien (DAD - Duplicate Address Détection)
5. L'adresse est prête à l'emploi

```text
Préfixe annoncé par le routeur : 2001:db8:cafe::/64
Identifiant d'interface (EUI-64) : 0200:ff:fe00:0001
Adresse résultante : 2001:db8:cafe::200:ff:fe00:1/64
```

**DHCPv6** :

DHCPv6 fonctionne comme DHCP en IPv4 : un serveur central attribue des adresses aux clients. Il est utilisé quand on veut :

- Contrôler quelle machine reçoit quelle adresse (attribution statique)
- Fournir des options supplémentaires (serveurs DNS, domaine de recherche)
- Enregistrer les attributions dans un journal

**Comparaison SLAAC vs DHCPv6** :

| Critère | SLAAC | DHCPv6 |
| --- | --- | --- |
| Serveur requis | Non (routeur suffit) | Oui |
| Contrôle des adresses | Non (auto-générées) | Oui (attribution explicite) |
| Options DNS | Via RA (RDNSS) ou DHCPv6 | Oui, toujours |
| Complexité | Faible | Moyenne |
| Usage typique | Réseaux résidentiels, petites entreprises | Grandes entreprises, ISP |

**Note** : Les deux mécanismes peuvent coexister. Le routeur peut annoncer un préfixe via RA (pour SLAAC) et indiquer en même temps qu'un serveur DHCPv6 est disponible pour les options supplémentaires (mode "M" et "O" dans les RA).

---

### Dual-stack : faire coexister IPv4 et IPv6

**Définition** : Le dual-stack est la configuration dans laquelle une machine ou un réseau supporte simultanément IPv4 et IPv6. C'est la stratégie de transition recommandée.

**Le problème que le dual-stack résout** :

La migration d'IPv4 vers IPv6 ne peut pas être instantanée. Des milliards d'équipements, de serveurs et de services fonctionnent encore en IPv4. Le dual-stack permet de faire fonctionner les deux protocoles en parallèle pendant toute la période de transition.

**Comment le dual-stack fonctionne** :

| Composant | Configuration dual-stack |
| --- | --- |
| Interface réseau | Possède une adresse IPv4 ET une adresse IPv6 |
| Pile réseau OS | Supporte les deux protocoles nativement |
| Application | Utilise IPv6 si disponible (préférence), sinon IPv4 (RFC 6724) |
| DNS | Enregistrements A (IPv4) ET AAAA (IPv6) pour le même nom |

**Règle de préférence** : Quand les deux protocoles sont disponibles, un système dual-stack préfère IPv6 (RFC 6724). Si la connexion IPv6 échoue, il bascule automatiquement sur IPv4 - c'est le mécanisme "Happy Eyeballs" (RFC 8305).

**Analogie concrète** : Le dual-stack c'est comme un commerçant qui accepte les paiements en euros ET en dollars. Il préfère les euros (IPv6, plus moderne), mais s'adapte si le client n'a que des dollars (IPv4).

---

### Tunneling IPv6 sur IPv4 (notion)

**Définition** : Le tunneling permet de transporter du trafic IPv6 dans des paquets IPv4 lorsque l'infrastructure réseau intermédiaire ne supporte pas encore IPv6.

**Principe** :

Le paquet IPv6 est encapsulé (emballé) dans un paquet IPv4. À l'autre extrémité du tunnel, le paquet IPv4 est décapsulé pour extraire le paquet IPv6 d'origine.

```text
  [En-tête IPv4][En-tête IPv6][Données]
  |--- tunnel IPv4 ----------|
```

**Principaux mécanismes** :

| Mécanisme | Usage |
| --- | --- |
| 6to4 | Connexion automatique entre îlots IPv6 via Internet IPv4 (déprécié) |
| ISATAP | Réseau interne IPv6 sur infrastructure IPv4 existante |
| 6in4 (SIT) | Tunnel manuel statique entre deux points fixes |
| Teredo | Tunnel IPv6 via UDP pour clients derrière NAT (Windows notamment) |

Dans la pratique quotidienne, le tunneling est une solution de transition. L'objectif final est un réseau dual-stack ou purement IPv6.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'état IPv6 de l'interface réseau

```bash
# Afficher toutes les adresses de toutes les interfaces
ip -6 addr show
```

**Résultat attendu** :

```text
1: lo: <LOOPBACK,UP,LOWER_UP>
    inet6 ::1/128 scope host
       valid_lft forever preferred_lft forever
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 2001:db8:cafe::1/64 scope global dynamic
       valid_lft 86400sec preferred_lft 14400sec
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
       valid_lft forever preferred_lft forever
```

Ce que tu vois :

- `scope host` : adresse de loopback (`::1`), valide uniquement sur la machine elle-même
- `scope global dynamic` : adresse globale unicast obtenue via SLAAC ou DHCPv6
- `scope link` : adresse link-local (`fe80::...`), valide uniquement sur le lien local

---

### Étape 2 : Vérifier la connectivité IPv6 locale

```bash
# Ping vers le loopback IPv6 (équivalent de ping 127.0.0.1)
ping -6 -c 4 ::1
```

**Résultat attendu** :

```text
PING ::1(::1) 56 data bytes
64 bytes from ::1: icmp_seq=1 ttl=64 time=0.031 ms
64 bytes from ::1: icmp_seq=2 ttl=64 time=0.029 ms
64 bytes from ::1: icmp_seq=3 ttl=64 time=0.030 ms
64 bytes from ::1: icmp_seq=4 ttl=64 time=0.028 ms
```

```bash
# Ping vers la passerelle en utilisant l'adresse link-local
# (remplace fe80::1%eth0 par l'adresse de ta passerelle)
ping -6 -c 4 fe80::1%eth0
```

**Note** : Pour les adresses link-local, il faut spécifier l'interface après `%` car elles ne sont pas routables et une même machine peut avoir plusieurs interfaces avec des adresses link-local.

---

### Étape 3 : Configurer une adresse IPv6 statique avec ip

```bash
# Ajouter une adresse IPv6 statique sur l'interface eth0
sudo ip -6 addr add 2001:db8:cafe::10/64 dev eth0
```

```bash
# Vérifier que l'adresse a bien été ajoutée
ip -6 addr show eth0
```

**Résultat attendu** :

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet6 2001:db8:cafe::10/64 scope global
       valid_lft forever preferred_lft forever
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
       valid_lft forever preferred_lft forever
```

```bash
# Ajouter une route par défaut IPv6
sudo ip -6 route add default via 2001:db8:cafe::1
```

```bash
# Vérifier la table de routage IPv6
ip -6 route show
```

**Résultat attendu** :

```text
2001:db8:cafe::/64 dev eth0 proto kernel metric 256 pref medium
default via 2001:db8:cafe::1 dev eth0 metric 1024 pref medium
```

**Note** : Cette configuration est temporaire. Elle disparaît au redémarrage. Pour la rendre permanente, utilise la configuration réseau de ton système (Netplan sur Debian/Ubuntu moderne).

---

### Étape 4 : Configurer le dual-stack de manière permanente (Netplan)

Sur Debian 12 / Ubuntu, Netplan est le gestionnaire de configuration réseau. Le fichier de configuration se trouve dans `/etc/netplan/`.

```bash
# Afficher la configuration réseau actuelle
cat /etc/netplan/01-netcfg.yaml
```

```bash
# Modifier la configuration pour activer le dual-stack
sudo nano /etc/netplan/01-netcfg.yaml
```

Contenu du fichier `/etc/netplan/01-netcfg.yaml` pour un dual-stack statique :

```yaml
network:
  version: 2
  ethernets:
    eth0:
      # Configuration IPv4 statique
      addresses:
        - 192.168.1.10/24
        - 2001:db8:cafe::10/64   # Adresse IPv6 statique
      routes:
        - to: default
          via: 192.168.1.1       # Passerelle IPv4
        - to: "::/0"
          via: "2001:db8:cafe::1" # Passerelle IPv6
      nameservers:
        addresses:
          - 8.8.8.8              # DNS IPv4
          - 2001:4860:4860::8888  # DNS IPv6 de Google
```

Pour un dual-stack avec DHCP en IPv4 et SLAAC en IPv6 :

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true                # IPv4 via DHCP
      dhcp6: false               # Pas de DHCPv6
      accept-ra: true            # Accepter les Router Advertisements (SLAAC)
```

```bash
# Appliquer la configuration (sans redémarrer)
sudo netplan apply
```

```bash
# Vérifier les adresses configurées
ip addr show eth0
```

**Résultat attendu** :

```text
2: eth0: <BROADCAST,MULTICAST,UP,LOWER_UP>
    inet 192.168.1.10/24 brd 192.168.1.255 scope global eth0
    inet6 2001:db8:cafe::10/64 scope global
    inet6 fe80::a00:27ff:feab:cdef/64 scope link
```

La machine possède maintenant une adresse IPv4 et une adresse IPv6.

---

### Étape 5 : Vérifier la résolution DNS en IPv6 (enregistrement AAAA)

```bash
# Résoudre un nom en IPv6 avec dig
dig AAAA ipv6.google.com
```

**Résultat attendu** :

```text
;; ANSWER SECTION:
ipv6.google.com.    299    IN    AAAA    2a00:1450:4007:817::200e
```

L'enregistrement `AAAA` (prononcé "quad A") est l'équivalent IPv6 de l'enregistrement `A` pour IPv4.

```bash
# Tester la connectivité IPv6 vers un service public
ping -6 -c 4 ipv6.google.com
```

**Résultat attendu** :

```text
PING ipv6.google.com(2a00:1450:4007:817::200e) 56 data bytes
64 bytes from 2a00:1450:4007:817::200e: icmp_seq=1 ttl=116 time=12.4 ms
```

---

### Étape 6 : Désactiver IPv6 sur une interface (si nécessaire)

Dans certains cas (environnement de test, service qui ne supporte pas IPv6), on peut vouloir désactiver IPv6 temporairement.

```bash
# Désactiver IPv6 sur l'interface eth0 (temporaire, jusqu'au prochain redémarrage)
sudo sysctl -w net.ipv6.conf.eth0.disable_ipv6=1
```

```bash
# Vérifier que l'interface n'a plus d'adresse IPv6
ip -6 addr show eth0
```

**Résultat attendu** :

```text
(aucune sortie - l'interface n'a plus d'adresse IPv6)
```

```bash
# Réactiver IPv6
sudo sysctl -w net.ipv6.conf.eth0.disable_ipv6=0
```

Pour rendre cette modification permanente, ajouter dans `/etc/sysctl.conf` :

```text
net.ipv6.conf.eth0.disable_ipv6 = 1
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `ip -6 addr show` | Afficher toutes les adresses IPv6 |
| `ip -6 addr show eth0` | Afficher les adresses IPv6 d'une interface |
| `ip -6 route show` | Afficher la table de routage IPv6 |
| `ping -6 -c 4 ::1` | Tester la connectivité IPv6 locale |
| `ping -6 -c 4 <adresse>` | Tester la connectivité vers une adresse IPv6 |
| `dig AAAA <nom>` | Résoudre un enregistrement DNS IPv6 |
| `ip -6 addr add <adresse>/<préfixe> dev <iface>` | Ajouter une adresse IPv6 statique |
| `ip -6 route add default via <passerelle>` | Ajouter la route par défaut IPv6 |
| `sudo sysctl -w net.ipv6.conf.<iface>.disable_ipv6=1` | Désactiver IPv6 sur une interface |
| `sudo netplan apply` | Appliquer la configuration Netplan |

---

## Pièges Fréquents

### Piège 1 : Oublier le `%interface` pour les adresses link-local

⚠️ **Problème** : Tu essaies de faire un ping vers une adresse link-local (`fe80::1`) et tu obtiens `Network unreachable` ou `Invalid argument`.

✅ **Solution** : Les adresses link-local nécessitent de spécifier l'interface réseau à utiliser, car plusieurs interfaces peuvent avoir des adresses dans `fe80::/10`. Utilise le format `adresse%interface` :

```bash
# Incorrect
ping -6 fe80::1

# Correct
ping -6 fe80::1%eth0
```

---

### Piège 2 : Utiliser `::` deux fois dans une adresse

⚠️ **Problème** : Tu écris `2001::db8::1` et la configuration échoue ou l'adresse est mal interprétée.

✅ **Solution** : `::` ne peut apparaître qu'une seule fois dans une adresse IPv6. Si tu dois abréger plusieurs groupes, choisit le groupe de zéros consécutifs le plus long pour `::`.

```text
Incorrect : 2001::db8::1
Correct   : 2001:0:0:db8::1   (les premiers 0 sont développés, seuls les derniers utilisent ::)
```

---

### Piège 3 : Négliger l'adresse link-local

⚠️ **Problème** : Tu configures uniquement une adresse globale ou ULA sur une interface, et le routage IPv6 ne fonctionne pas.

✅ **Solution** : L'adresse link-local (`fe80::/10`) est générée automatiquement sur chaque interface active. Elle est indispensable au fonctionnement d'IPv6 (NDP, RA, DAD). Ne pas la supprimer ni la désactiver. Pour vérifier qu'elle est présente :

```bash
ip -6 addr show eth0 | grep "scope link"
```

---

### Piège 4 : Confondre les enregistrements DNS A et AAAA

⚠️ **Problème** : Tu cherches l'adresse IPv6 d'un serveur avec `dig A` et tu n'obtiens rien.

✅ **Solution** : Les adresses IPv4 sont dans des enregistrements `A`, les adresses IPv6 dans des enregistrements `AAAA`. Un serveur peut avoir les deux, un seul, ou aucun :

```bash
# Adresse IPv4
dig A monserveur.example.com

# Adresse IPv6
dig AAAA monserveur.example.com

# Les deux en une commande
dig monserveur.example.com ANY
```

---

### Piège 5 : Oublier que SLAAC génère une adresse basée sur l'adresse MAC

⚠️ **Problème** : Sur un serveur ou un service qui journalise les adresses IP, l'adresse IPv6 générée par SLAAC contient l'adresse MAC de la machine - ce qui est un problème de vie privée.

✅ **Solution** : Activer les privacy extensions (RFC 8981, qui remplace RFC 4941) pour générer un identifiant d'interface aléatoire, ou utiliser une adresse statique pour les serveurs :

```bash
# Activer les privacy extensions (adresse temporaire aléatoire)
sudo sysctl -w net.ipv6.conf.eth0.use_tempaddr=2
```

Pour les serveurs, préférer une adresse statique explicite.

---

## Checklist de Validation

- [ ] Je sais abréger une adresse IPv6 complète selon les deux règles
- [ ] Je connais les trois types d'adresses IPv6 (link-local, ULA, global) et leur portée
- [ ] Je comprends la différence entre SLAAC et DHCPv6
- [ ] Je sais afficher les adresses IPv6 d'une interface avec `ip -6 addr show`
- [ ] Je sais configurer une adresse IPv6 statique avec `ip -6 addr add`
- [ ] Je sais ajouter une configuration dual-stack permanente avec Netplan
- [ ] Je sais résoudre un enregistrement DNS `AAAA` avec `dig`
- [ ] Je comprends pourquoi les adresses link-local nécessitent un `%interface`

---

## Exercice Pratique

**Énoncé** : Tu dois configurer et vérifier un dual-stack sur une machine Debian 12.

**Questions** :

1. Affiche toutes les adresses IPv6 de ton système. Identifie le type de chaque adresse (link-local, ULA ou global).
2. Quelle est l'adresse loopback IPv6 ? Teste la connectivité vers elle.
3. Abrège les adresses IPv6 suivantes :
   - `2001:0db8:0000:0001:0000:0000:0000:0042`
   - `fe80:0000:0000:0000:0a00:00ff:fe00:0001`
4. Vérifie si le site `ipv6.google.com` a un enregistrement AAAA. Quelle est l'adresse obtenue ?
5. Configure Netplan pour avoir un dual-stack sur `eth0` : IPv4 en DHCP et IPv6 en SLAAC. Montre la configuration YAML.

**Indications** :

- Pour la question 1, utilise `ip -6 addr show` et identifie `scope link` (link-local), `scope global` (global unicast ou ULA)
- Pour la question 2, l'adresse loopback IPv6 est `::1`
- Pour la question 3, applique les deux règles d'abréviation dans l'ordre : d'abord les zéros en tête, ensuite `::` pour les groupes consécutifs
- Pour la question 4, utilise `dig AAAA ipv6.google.com`
- Pour la question 5, `dhcp4: true`, `dhcp6: false` et `accept-ra: true`

**Résultat attendu** : Tu as les réponses aux cinq questions et tu es capable de lire la sortie de `ip -6 addr show` sans hésitation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Question 1 : Types d'adresses IPv6**

```bash
ip -6 addr show
```

Sortie typique à analyser :

```text
1: lo:
    inet6 ::1/128 scope host          ← loopback (scope host)
2: eth0:
    inet6 2001:db8::10/64 scope global ← global unicast (routable sur Internet)
    inet6 fe80::1/64 scope link        ← link-local (lien local uniquement)
```

Réponse : `::1` est l'adresse de loopback (scope host), `fe80::1` est link-local, `2001:db8::10` est global unicast.

**Question 2 : Loopback IPv6**

```bash
ping -6 -c 4 ::1
```

```text
PING ::1(::1) 56 data bytes
64 bytes from ::1: icmp_seq=1 ttl=64 time=0.031 ms
```

Réponse : L'adresse loopback IPv6 est `::1` (équivalent de `127.0.0.1` en IPv4).

**Question 3 : Abréviation des adresses**

Adresse 1 : `2001:0db8:0000:0001:0000:0000:0000:0042`

1. Supprimer les zéros en tête : `2001:db8:0:1:0:0:0:42`
2. Remplacer les groupes nuls consécutifs par `::` (les trois groupes `0:0:0`) : `2001:db8:0:1::42`

Adresse 2 : `fe80:0000:0000:0000:0a00:00ff:fe00:0001`

1. Supprimer les zéros en tête : `fe80:0:0:0:a00:ff:fe00:1`
2. Remplacer les groupes nuls consécutifs par `::` (les trois premiers `0:0:0`) : `fe80::a00:ff:fe00:1`

**Question 4 : Enregistrement AAAA**

```bash
dig AAAA ipv6.google.com
```

```text
;; ANSWER SECTION:
ipv6.google.com.    299    IN    AAAA    2a00:1450:4007:817::200e
```

Réponse : L'adresse IPv6 de `ipv6.google.com` est par exemple `2a00:1450:4007:817::200e` (la valeur exacte peut varier selon le resolver et la localisation).

**Question 5 : Configuration Netplan dual-stack**

Fichier `/etc/netplan/01-netcfg.yaml` :

```yaml
network:
  version: 2
  ethernets:
    eth0:
      dhcp4: true       # IPv4 obtenu via DHCP
      dhcp6: false      # Pas de DHCPv6 stateful
      accept-ra: true   # Accepter les Router Advertisements pour SLAAC
```

Après `sudo netplan apply`, la machine aura :

- Une adresse IPv4 dynamique via DHCP
- Une adresse IPv6 link-local générée automatiquement (`fe80::...`)
- Une adresse IPv6 globale via SLAAC si un routeur annonce un préfixe

---

## Navigation

← Fiche précédente : **[12 - Projet intégrateur](12-projet-integrateur.md)**

→ Fiche suivante : **[14 - BGP : le routage entre opérateurs](14-bgp-routage-internet.md)**
