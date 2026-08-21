---
tags:
  - Réseaux
  - Intermédiaire
  - Concept
description: "BGP, le routage entre opérateurs : systèmes autonomes (AS), eBGP vs iBGP, attributs (AS_PATH, LOCAL_PREF, MED, NEXT_HOP), annonces de préfixes, peering vs transit et sélection de route."
estimated_time: "80 min"
fiche_number: 14
total_fiches: 14
cursus: "Réseaux"
id: "infrastructure.networks.bgp-routage-internet"
course_id: "infrastructure.networks"
content_type: "lesson"
order: 14
---

# 14 - BGP : le routage entre opérateurs

> **En bref** : Tu découvriras comment les grands réseaux d'Internet échangent leurs routes grâce au protocole BGP, ce qu'est un système autonome (AS), la différence entre eBGP et iBGP, le rôle des attributs de route, et comment une route est choisie parmi plusieurs. Lecture estimée : 80 min.

## Prérequis

- Avoir lu la fiche [05 - Routage](05-routage.md) pour comprendre les tables de routage, la passerelle par défaut et le routage statique
- Avoir lu la fiche [02 - Adressage IP](02-adressage-ip.md) pour les notions de préfixe, de masque CIDR et d'agrégation d'adresses
- Avoir lu la fiche [01 - Introduction aux réseaux](01-introduction-reseaux.md) pour le vocabulaire réseau de base

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est un système autonome, distinguer eBGP et iBGP, lire les principaux attributs d'une route BGP, comprendre comment un préfixe est annoncé sur Internet, faire la différence entre peering et transit, et dérouler à la main l'algorithme de sélection de route BGP.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un système autonome (AS) ?

**Définition** : Un système autonome (Autonomous System, AS) est un ensemble de réseaux IP géré par une seule entité administrative (un opérateur, une entreprise, un fournisseur d'accès) et qui applique une politique de routage cohérente vers l'extérieur. Chaque AS est identifié par un numéro unique appelé ASN (Autonomous System Number).

**Le problème que les AS résolvent** :

Sans découpage en systèmes autonomes, voici les problèmes rencontrés :

1. **Impossible de router à l'échelle d'Internet** : Internet relie des centaines de milliers de réseaux. Un seul protocole qui connaîtrait chaque routeur individuellement s'effondrerait sous le nombre de routes.
2. **Pas de frontière de responsabilité** : Sans découpage, on ne sait pas quel opérateur est responsable de quelle partie du réseau.
3. **Aucune politique commerciale possible** : Un opérateur veut choisir par où entre et sort son trafic (qui il paie, qui le paie). Il faut une unité de décision claire.

**Comment les AS résolvent ces problèmes** :

| Problème | Solution apportée par les AS |
| --- | --- |
| Échelle d'Internet | On route entre AS (quelques dizaines de milliers), pas entre routeurs individuels |
| Frontière de responsabilité | Chaque AS a un propriétaire identifié par son ASN |
| Politique commerciale | Chaque AS décide seul de sa politique de routage vers l'extérieur |

**Analogie concrète** : Un AS, c'est comme un pays sur une carte routière internationale. À l'intérieur du pays, on connaît chaque rue (routage interne). Mais pour aller d'un pays à un autre, on ne raisonne qu'au niveau des frontières entre pays, pas au niveau de chaque rue. BGP est l'accord qui décide par quels postes-frontière on passe.

**Format d'un numéro d'AS (ASN)** :

| Type | Plage | Exemple |
| --- | --- | --- |
| ASN sur 16 bits | 1 à 65535 | `AS3215` (Orange), `AS2914` (NTT) |
| ASN sur 32 bits | 65536 à 4294967295 | `AS200000` et au-delà |
| ASN privés (16 bits) | 64512 à 65534 | Usage interne, non routable sur Internet |

Les ASN publics sont attribués par les registres régionaux (RIPE pour l'Europe, ARIN pour l'Amérique du Nord).

**Ce qu'un AS n'est PAS** :

- Un AS n'est pas une seule machine ni un seul routeur. C'est un ensemble de réseaux, souvent des dizaines de routeurs et des milliers de préfixes.
- Un AS n'est pas la même chose qu'une entreprise. Une grande entreprise peut posséder plusieurs ASN, et un petit hébergeur peut n'en avoir aucun (il utilise alors celui de son opérateur).

---

### Qu'est-ce que BGP ?

**Définition** : BGP (Border Gateway Protocol) est le protocole de routage qui permet aux systèmes autonomes d'échanger entre eux les informations d'accessibilité des réseaux. C'est le protocole qui fait tenir Internet ensemble : il décide, pour chaque destination, par quel AS voisin il faut passer.

**Le problème que BGP résout** :

Sans BGP, voici les problèmes rencontrés :

1. **Pas de routage entre opérateurs** : Les protocoles internes (comme OSPF, vus dans la fiche 05) fonctionnent à l'intérieur d'un seul réseau, mais pas entre opérateurs distincts qui ne se font pas confiance.
2. **Pas d'application des politiques** : Un opérateur veut router selon des accords commerciaux, pas seulement selon le chemin le plus court. Les protocoles internes ne savent pas faire ça.
3. **Pas de propagation des préfixes à l'échelle mondiale** : Quand une entreprise obtient un bloc d'adresses, le monde entier doit apprendre comment l'atteindre.

**Comment BGP résout ces problèmes** :

| Problème | Solution apportée par BGP |
| --- | --- |
| Routage entre opérateurs | BGP s'établit entre deux routeurs de bordure (sessions de voisinage) |
| Application des politiques | BGP choisit les routes selon des attributs configurables, pas seulement la distance |
| Propagation mondiale | Chaque AS annonce ses préfixes à ses voisins, qui les réannoncent en chaîne |

**Caractéristiques techniques de BGP** :

| Caractéristique | Valeur |
| --- | --- |
| Type de protocole | Vecteur de chemin (path-vector) |
| Transport | TCP, port 179 |
| Version actuelle | BGP-4 (RFC 4271) |
| Unité d'information | Le préfixe (réseau) et ses attributs |
| Décision | Basée sur des attributs et des politiques, pas sur une métrique unique |

**Analogie concrète** : BGP, c'est comme le système postal international entre pays. Chaque pays (AS) affiche à ses voisins la liste des régions qu'il sait livrer (préfixes annoncés), et précise par quels pays intermédiaires le courrier passera (le chemin d'AS). Chaque pays choisit ensuite, parmi les itinéraires proposés par ses voisins, celui qui l'arrange selon ses propres règles.

**Ce que BGP n'est PAS** :

- BGP n'est pas un protocole de routage interne. À l'intérieur d'un AS, on utilise OSPF, IS-IS ou des routes statiques. BGP gère les frontières entre AS.
- BGP ne choisit pas le chemin le plus rapide. Il choisit le chemin conforme aux politiques de l'opérateur, qui peut être plus long mais moins cher ou contractuellement préféré.

---

### eBGP vs iBGP

**Définition** : BGP s'utilise dans deux contextes. L'eBGP (external BGP) relie deux routeurs appartenant à des AS différents. L'iBGP (internal BGP) relie deux routeurs appartenant au même AS, pour propager à l'intérieur les routes apprises de l'extérieur.

**Pourquoi cette distinction existe** :

Quand un routeur de bordure apprend une route d'un AS voisin via eBGP, les autres routeurs du même AS doivent aussi connaître cette route pour pouvoir acheminer le trafic. C'est le rôle de l'iBGP : distribuer les routes externes à l'intérieur de l'AS.

**Comparaison eBGP vs iBGP** :

| Critère | eBGP | iBGP |
| --- | --- | --- |
| Relie | Deux AS différents | Deux routeurs du même AS |
| Numéro d'AS des pairs | Différents | Identiques |
| Modification de l'AS_PATH | Oui (l'ASN est ajouté) | Non |
| Distance administrative (Cisco) | 20 (préféré) | 200 |
| Voisins directement connectés | Souvent oui | Pas nécessairement (via routage interne) |

**Règle importante (split horizon iBGP)** : Une route apprise par iBGP n'est **pas** réannoncée à un autre voisin iBGP. Cette règle évite les boucles, mais impose que tous les routeurs iBGP d'un AS soient interconnectés en maillage complet (full mesh), ou utilisent un mécanisme comme les route reflectors pour passer à l'échelle.

**Analogie concrète** : L'eBGP, c'est la négociation entre deux pays à leur poste-frontière. L'iBGP, c'est la circulaire interne envoyée à toutes les préfectures du pays pour leur dire : voici comment joindre l'étranger. Le pays négocie à la frontière (eBGP), puis diffuse l'information en interne (iBGP).

---

### Les attributs de route BGP

**Définition** : Un attribut BGP est une information attachée à une route annoncée. Les attributs servent à décrire le chemin et à influencer la sélection de la meilleure route. Ce sont les leviers principaux des politiques de routage.

**Les quatre attributs à connaître** :

| Attribut | Rôle | Influence le choix |
| --- | --- | --- |
| AS_PATH | Liste des AS traversés pour atteindre le préfixe | Plus la liste est courte, mieux c'est |
| LOCAL_PREF | Préférence locale, valable dans tout l'AS | Plus la valeur est haute, mieux c'est |
| MED (Multi-Exit Discriminator) | Suggère un point d'entrée à un AS voisin | Plus la valeur est basse, mieux c'est |
| NEXT_HOP | Adresse IP du prochain saut pour atteindre le préfixe | Doit être joignable, sinon la route est ignorée |

**Détail de l'AS_PATH** :

L'AS_PATH est la liste ordonnée des AS qu'un paquet traversera pour atteindre la destination. Chaque fois qu'une route franchit une frontière eBGP, l'AS émetteur ajoute son propre ASN en tête de la liste.

```text
Préfixe 203.0.113.0/24 annoncé par AS64500
Vu depuis AS64502 : AS_PATH = 64501 64500
Lecture : pour joindre 203.0.113.0/24, passer par AS64501 puis AS64500
```

L'AS_PATH sert à deux choses :

- **Choisir le chemin le plus court** : à politique égale, BGP préfère l'AS_PATH le plus court (moins d'AS traversés).
- **Éviter les boucles** : si un AS voit son propre ASN dans un AS_PATH reçu, il rejette la route (la route a déjà traversé cet AS).

**Détail du LOCAL_PREF** :

Le LOCAL_PREF exprime la préférence d'un AS pour une route de sortie. Il est partagé entre tous les routeurs de l'AS via iBGP. C'est l'attribut le plus puissant pour décider par quel voisin **sortir** : une valeur élevée signifie "préférer cette sortie".

**Détail du MED** :

Le MED est une suggestion envoyée à un AS voisin pour lui indiquer par quel point d'entrée **entrer** dans notre réseau quand plusieurs liens existent. Une valeur basse est préférée. Contrairement au LOCAL_PREF, le MED est un indice donné au voisin, qui reste libre de l'ignorer.

**Détail du NEXT_HOP** :

Le NEXT_HOP est l'adresse IP du routeur à qui envoyer les paquets pour cette route. Si le NEXT_HOP n'est pas joignable (pas de route interne vers lui), la route entière est considérée comme inutilisable.

**Analogie concrète** : Imagine un itinéraire routier. L'AS_PATH, c'est la liste des pays à traverser (3 pays, c'est plus court que 5). Le LOCAL_PREF, c'est ta préférence personnelle pour sortir par tel poste-frontière (parce que la route y est gratuite). Le MED, c'est le panneau qu'un pays voisin met à sa frontière : "entrez plutôt par ici". Le NEXT_HOP, c'est l'adresse exacte du prochain péage où te présenter.

**Ce que les attributs ne sont PAS** :

- Les attributs ne sont pas une simple métrique de distance comme dans OSPF. Ils encodent des politiques commerciales et techniques, pas seulement la longueur du chemin.
- LOCAL_PREF et MED ne jouent pas le même rôle : LOCAL_PREF décide comment **sortir** de ton AS (interne), MED suggère comment **entrer** dans ton AS (vers le voisin). Ne pas les confondre.

---

### Annonce de préfixes

**Définition** : Annoncer un préfixe, c'est déclarer à ses voisins BGP qu'on sait acheminer le trafic vers un bloc d'adresses donné (par exemple `203.0.113.0/24`). C'est par ces annonces, propagées d'AS en AS, que le monde entier apprend comment joindre chaque réseau.

**Comment une annonce se propage** :

1. L'AS propriétaire du bloc `203.0.113.0/24` l'annonce à ses voisins directs en eBGP.
2. Chaque voisin qui accepte l'annonce ajoute son propre ASN à l'AS_PATH, puis la réannonce à ses propres voisins.
3. De proche en proche, l'annonce traverse Internet. Chaque AS construit ainsi une route vers `203.0.113.0/24`.

```text
AS64500 annonce 203.0.113.0/24
  -> AS64501 reçoit, AS_PATH = 64500, réannonce
    -> AS64502 reçoit, AS_PATH = 64501 64500
```

**Agrégation de préfixes** : Un AS peut regrouper plusieurs petits blocs contigus en un seul préfixe plus large (par exemple annoncer `203.0.113.0/24` et `203.0.114.0/24` sous la forme... non, ces deux-là ne s'agrègent pas car non alignés). L'agrégation réduit la taille de la table de routage mondiale : le [CIDR Report](https://www.cidr-report.org/as2.0/) compte environ 1,07 million de préfixes IPv4 actifs en août 2026.

**Filtrage des annonces** : Un AS ne réannonce pas forcément tout ce qu'il reçoit. Il applique des filtres selon ses politiques : par exemple, ne réannoncer à ses clients que les routes utiles, ou ne pas propager des préfixes trop petits (plus spécifiques que `/24` en IPv4 sont souvent filtrés).

---

### Peering vs transit

**Définition** : Le peering et le transit sont les deux grands types de relations commerciales entre AS. Le **transit** est un service payant où un opérateur fournit l'accès à tout Internet. Le **peering** est un échange (souvent gratuit) où deux AS s'échangent uniquement le trafic destiné à leurs réseaux respectifs et à leurs clients.

**Le problème que cette distinction résout** :

Un AS doit décider comment il atteint le reste d'Internet et comment il rentabilise son réseau. Sans modèle économique clair, aucun opérateur n'aurait intérêt à transporter le trafic des autres.

**Comparaison peering vs transit** :

| Critère | Transit | Peering |
| --- | --- | --- |
| Qui paie | Le client paie le fournisseur de transit | En général personne (settlement-free) |
| Destinations accessibles | Tout Internet | Seulement le pair et ses clients |
| Relation | Client / fournisseur | Pairs égaux |
| LOCAL_PREF typique | Plus bas (route de secours) | Plus haut (route préférée, gratuite) |

**Hiérarchie d'Internet (simplifiée)** :

| Niveau | Description | Exemple |
| --- | --- | --- |
| Tier 1 | Atteint tout Internet uniquement par peering, n'achète jamais de transit | Quelques très grands opérateurs mondiaux |
| Tier 2 | Fait du peering, mais achète aussi du transit pour atteindre le reste | Opérateurs régionaux et nationaux |
| Tier 3 | Achète tout son accès Internet via du transit | Petits fournisseurs d'accès locaux |

**Règle de préférence économique** : Un AS configure généralement ses LOCAL_PREF ainsi : préférer les routes vers ses clients (qui le paient), puis les routes de peering (gratuites), et en dernier recours les routes de transit (qui lui coûtent de l'argent).

**Analogie concrète** : Le transit, c'est payer un transporteur qui livre partout dans le monde. Le peering, c'est un accord entre deux transporteurs voisins : "je livre tes colis dans ma région, tu livres les miens dans la tienne, et on ne se facture rien". Le peering est gratuit mais limité au voisin ; le transit coûte cher mais va partout.

**Ce que le peering n'est PAS** :

- Le peering n'est pas un accès à tout Internet. Par un pair, on n'atteint que ce pair et ses clients, jamais le reste du monde.
- Le peering n'est pas toujours gratuit. Il existe du peering payant (paid peering) quand le rapport de force entre les deux AS est déséquilibré.

---

### L'algorithme de sélection de route BGP

**Définition** : Quand un routeur BGP reçoit plusieurs routes vers le même préfixe, il doit en choisir une seule à installer dans sa table de routage. BGP applique pour cela une liste de critères dans un ordre strict, en s'arrêtant dès qu'un critère départage les routes.

**L'ordre des critères (simplifié, standard RFC 4271)** :

| Ordre | Critère | Règle |
| --- | --- | --- |
| 1 | LOCAL_PREF | Préférer la valeur la plus haute |
| 2 | AS_PATH | Préférer le chemin le plus court (moins d'AS) |
| 3 | Origine | Préférer une route apprise en interne (IGP) plutôt qu'incomplète |
| 4 | MED | Préférer la valeur la plus basse (à AS voisin égal) |
| 5 | eBGP vs iBGP | Préférer une route eBGP à une route iBGP |
| 6 | Coût IGP vers le NEXT_HOP | Préférer le NEXT_HOP le plus proche en interne |
| 7 | ID du routeur | Départage final : préférer le plus petit Router ID |

> **Note Cisco IOS** : l'implémentation IOS ajoute un attribut propriétaire, le **Weight** (valeur haute préférée, local au routeur, non transmis aux voisins), qui est évalué **avant** LOCAL_PREF. Il n'existe pas dans la RFC 4271 et n'est visible que sur les équipements Cisco. Si tu configures BGP sur IOS, le Weight est donc le critère numéro 1 effectif.

**Comment lire ce tableau** : on commence par le critère 1. Si une route a un LOCAL_PREF plus élevé, elle gagne immédiatement et on s'arrête. Si toutes les routes ont le même LOCAL_PREF, on passe au critère 2 (AS_PATH), et ainsi de suite jusqu'à ce qu'une seule route reste.

**Analogie concrète** : C'est comme départager des candidats à un emploi avec une grille de critères classés. On regarde d'abord le critère le plus important (LOCAL_PREF). S'il y a égalité, on regarde le critère suivant (AS_PATH), puis le suivant, jusqu'à ce qu'un seul candidat reste. On ne descend jamais à un critère inférieur tant que le critère supérieur départage.

---

## Étapes Pratiques

Ces étapes manipulent des concepts BGP à travers des données publiques et des raisonnements à la main. Il n'est pas nécessaire de posséder un AS ni des routeurs : on observe et on calcule.

### Étape 1 : Identifier l'AS de ton fournisseur d'accès

L'outil `whois` permet de retrouver à quel AS appartient une adresse IP. Sur Debian 12, il s'installe avec le paquet `whois`.

```bash
# Installer whois si nécessaire
sudo apt install -y whois
```

```bash
# Trouver l'AS qui annonce une adresse IP publique
# (exemple avec une IP de documentation ; remplace par une IP réelle pour un vrai test)
whois -h whois.cymru.com " -v 8.8.8.8"
```

**Résultat attendu** :

```text
AS      | IP               | AS Name
15169   | 8.8.8.8          | GOOGLE, US
```

Ce que tu vois :

- `AS` : le numéro de système autonome (ici `AS15169`, Google)
- `IP` : l'adresse interrogée
- `AS Name` : le nom de l'organisation propriétaire de l'AS

---

### Étape 2 : Lire un AS_PATH avec traceroute

`traceroute` (vu dans la fiche 05) montre le chemin réseau saut par saut. Combiné aux numéros d'AS, il révèle par quels opérateurs ton trafic transite.

```bash
# Tracer le chemin vers un serveur public en affichant les AS traversés (-A)
traceroute -A 1.1.1.1
```

**Résultat attendu** (extrait, les valeurs varient selon ta connexion) :

```text
 1  box.local (192.168.1.1) [*]  1.2 ms
 2  10.0.0.1 [AS3215]  8.4 ms
 3  ae-1.core1.par.example.net (203.0.113.9) [AS3215]  9.1 ms
 4  cloudflare-peer.example.net (198.51.100.4) [AS13335]  9.8 ms
 5  one.one.one.one (1.1.1.1) [AS13335]  10.0 ms
```

Ce que tu vois :

- Les premiers sauts sont dans l'AS de ton opérateur (ici `AS3215`)
- Le trafic franchit ensuite une frontière vers l'AS de destination (`AS13335`, Cloudflare)
- Le passage d'un ASN à un autre marque une frontière eBGP

**Note** : Les adresses `192.168.1.1` et `10.0.0.1` sont privées (vues dans la fiche 02) et n'ont pas d'AS public, d'où le `[*]`.

---

### Étape 3 : Reconstituer un AS_PATH à la main

À partir d'une topologie donnée, on peut écrire l'AS_PATH tel que BGP le construit. Soit la topologie suivante :

```text
AS64500 (origine du préfixe 203.0.113.0/24)
   |
AS64501
   |
AS64502 (ton AS)
```

Question : quel AS_PATH ton AS (`AS64502`) voit-il pour `203.0.113.0/24` ?

Raisonnement :

1. `AS64500` annonce `203.0.113.0/24`. L'AS_PATH est vide à l'origine.
2. En franchissant vers `AS64501`, l'émetteur `AS64500` ajoute son ASN. AS_PATH = `64500`.
3. En franchissant vers `AS64502`, l'émetteur `AS64501` ajoute son ASN. AS_PATH = `64501 64500`.

**Résultat attendu** :

```text
Préfixe   : 203.0.113.0/24
AS_PATH   : 64501 64500
Lecture   : passer par AS64501 puis AS64500 pour atteindre le préfixe
Longueur  : 2 AS
```

---

### Étape 4 : Dérouler la sélection de route BGP

Soit deux routes reçues pour le même préfixe `203.0.113.0/24` :

```text
Route A : LOCAL_PREF=100  AS_PATH=64501 64500  (apprise par peering)
Route B : LOCAL_PREF=200  AS_PATH=64510 64520 64500  (apprise d'un client)
```

Applique l'algorithme de sélection, critère par critère :

1. **LOCAL_PREF** : Route A = 100, Route B = 200. La valeur la plus haute gagne. Route B (200) l'emporte. On s'arrête ici.

**Résultat attendu** :

```text
Route choisie : Route B
Raison        : LOCAL_PREF plus élevé (200 > 100)
Remarque      : peu importe que l'AS_PATH de B soit plus long ;
                LOCAL_PREF est prioritaire sur AS_PATH dans l'algorithme
```

Maintenant, modifie l'exemple pour que les deux routes aient le même LOCAL_PREF :

```text
Route A : LOCAL_PREF=100  AS_PATH=64501 64500          (2 AS)
Route B : LOCAL_PREF=100  AS_PATH=64510 64520 64500    (3 AS)
```

1. **LOCAL_PREF** : 100 = 100, égalité. On passe au critère suivant.
2. **AS_PATH** : Route A a 2 AS, Route B a 3 AS. Le plus court gagne. Route A l'emporte.

**Résultat attendu** :

```text
Route choisie : Route A
Raison        : LOCAL_PREF égal, donc départage par AS_PATH le plus court (2 < 3)
```

---

### Étape 5 : Observer la table de routage globale (taille)

La taille de la table de routage BGP mondiale illustre l'échelle d'Internet. On peut consulter cette donnée via des projets publics comme le CIDR Report ou les serveurs « looking glass » des opérateurs.

```bash
# Compter le nombre de routes IPv4 reçues sur un routeur Cisco/IOS (exemple de sortie)
# show ip bgp summary | include entries
```

**Résultat attendu** (ordre de grandeur, [CIDR Report](https://www.cidr-report.org/as2.0/) du 20 août 2026) :

```text
BGP routing table entries using ... bytes of memory
~ 1070000 entries IPv4
~ 257000 entries IPv6
```

Ce que tu retiens : la table IPv4 dépasse le million de préfixes (environ 1,07 million d'entrées actives) ; l'IPv6 est autour de 257 000 préfixes. C'est précisément pour contenir cette croissance que l'agrégation de préfixes et le filtrage des annonces sont essentiels.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `whois -h whois.cymru.com " -v <ip>"` | Trouver l'AS qui annonce une adresse IP |
| `whois AS<numéro>` | Afficher les informations d'enregistrement d'un AS |
| `traceroute -A <hôte>` | Tracer le chemin en affichant les AS traversés |
| `mtr -z <hôte>` | Diagnostic combiné ping/traceroute avec affichage des AS |
| `dig +short <nom>` | Résoudre un nom en IP avant de chercher son AS |
| `ip route show` | Afficher la table de routage locale (rappel fiche 05) |

---

## Pièges Fréquents

### Piège 1 : Confondre BGP et un protocole de routage interne

⚠️ **Problème** : Tu penses que BGP remplace OSPF ou les routes statiques à l'intérieur d'un réseau, et tu cherches à l'utiliser pour router entre deux sous-réseaux d'une même entreprise.

✅ **Solution** : BGP gère le routage **entre AS** (entre opérateurs). À l'intérieur d'un AS, on utilise un protocole interne (OSPF, IS-IS) ou des routes statiques. L'iBGP n'est utilisé que pour propager les routes externes à l'intérieur de l'AS, pas pour router le trafic purement interne.

```text
Entre deux opérateurs distincts   -> BGP (eBGP)
À l'intérieur d'un même opérateur -> OSPF / IS-IS / statique (+ iBGP pour les routes externes)
```

---

### Piège 2 : Croire que BGP choisit le chemin le plus rapide

⚠️ **Problème** : Tu observes un trafic qui prend un chemin plus long que nécessaire et tu en conclus que BGP est mal configuré.

✅ **Solution** : BGP ne mesure ni la latence ni la bande passante. Il applique des politiques (LOCAL_PREF, AS_PATH, accords commerciaux). Un opérateur peut volontairement préférer une route plus longue mais gratuite (peering) à une route plus courte mais payante (transit). C'est un choix économique, pas une erreur.

---

### Piège 3 : Inverser le sens de LOCAL_PREF et MED

⚠️ **Problème** : Tu configures un MED élevé en pensant rendre une route préférée, ou tu utilises LOCAL_PREF pour influencer le trafic entrant.

✅ **Solution** : Retiens deux règles opposées :

- **LOCAL_PREF** : valeur **haute** = préférée, influence le trafic **sortant** de ton AS.
- **MED** : valeur **basse** = préférée, suggère le point d'entrée du trafic **entrant** vers ton AS.

```text
Sortir de mon AS par tel voisin  -> augmenter LOCAL_PREF (haut = préféré)
Faire entrer le trafic par tel lien -> baisser MED (bas = préféré)
```

---

### Piège 4 : Oublier que le NEXT_HOP doit être joignable

⚠️ **Problème** : Une route BGP est bien reçue et a de bons attributs, mais le trafic ne passe pas.

✅ **Solution** : Si le NEXT_HOP de la route n'est pas joignable via le routage interne, BGP marque la route comme inutilisable et ne l'installe pas. Vérifie toujours qu'il existe une route interne (IGP) vers l'adresse de NEXT_HOP.

```bash
# Vérifier la joignabilité du next-hop annoncé (exemple)
ping -c 2 198.51.100.4
```

---

### Piège 5 : Croire que tous les préfixes sont annoncés sans filtre

⚠️ **Problème** : Tu t'attends à voir sur Internet le moindre petit bloc d'adresses que tu annonces, par exemple un `/27`.

✅ **Solution** : De nombreux opérateurs filtrent les préfixes plus spécifiques que `/24` en IPv4 (et `/48` en IPv6) pour limiter la taille de la table mondiale. Pour qu'un préfixe soit visible globalement, il faut en général annoncer au moins un `/24` IPv4 ou un `/48` IPv6, et que ce bloc soit enregistré correctement auprès du registre régional.

---

## Checklist de Validation

- [ ] Je sais définir un système autonome (AS) et expliquer le rôle d'un ASN
- [ ] Je distingue eBGP (entre AS) et iBGP (dans un même AS)
- [ ] Je connais les quatre attributs AS_PATH, LOCAL_PREF, MED et NEXT_HOP et leur effet
- [ ] Je sais reconstituer un AS_PATH à partir d'une topologie
- [ ] Je comprends comment un préfixe se propage d'AS en AS
- [ ] Je fais la différence entre peering (gratuit, limité) et transit (payant, mondial)
- [ ] Je sais dérouler l'algorithme de sélection de route BGP critère par critère
- [ ] Je sais retrouver l'AS d'une adresse IP avec `whois` et `traceroute -A`

---

## Exercice Pratique

**Énoncé** : Un AS reçoit trois routes pour le même préfixe `198.51.100.0/24`. Tu dois déterminer laquelle BGP installe, en appliquant l'algorithme de sélection.

**Données** :

```text
Route 1 : LOCAL_PREF=100  AS_PATH=64600 64700        Origine=IGP  type=eBGP
Route 2 : LOCAL_PREF=150  AS_PATH=64610 64620 64700  Origine=IGP  type=eBGP
Route 3 : LOCAL_PREF=150  AS_PATH=64630 64700        Origine=IGP  type=iBGP
```

**Questions** :

1. Quelle route est choisie ? Indique le critère qui départage.
2. Si on retirait la Route 2, quelle route serait choisie entre la Route 1 et la Route 3 ? Pourquoi ?
3. Donne un exemple concret de configuration de politique (peering ou transit) qui justifierait le LOCAL_PREF=150 des routes 2 et 3.

**Indications** :

- Applique l'ordre des critères : LOCAL_PREF, puis AS_PATH, puis origine, puis MED, puis eBGP/iBGP.
- LOCAL_PREF : valeur la plus haute préférée. AS_PATH : longueur la plus courte préférée.
- Pour la question 3, rappelle-toi qu'un AS préfère faire sortir son trafic par les liens gratuits (peering) avant les liens payants (transit).

**Résultat attendu** : Tu identifies une seule route gagnante par question, avec le critère exact qui a tranché.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Question 1 : route choisie parmi les trois**

On applique l'algorithme dans l'ordre.

1. **LOCAL_PREF** :
   - Route 1 = 100
   - Route 2 = 150
   - Route 3 = 150

   La valeur la plus haute est 150. La Route 1 (100) est éliminée. Il reste les routes 2 et 3, à égalité de LOCAL_PREF. On passe au critère suivant.

2. **AS_PATH** :
   - Route 2 = `64610 64620 64700` -> 3 AS
   - Route 3 = `64630 64700` -> 2 AS

   Le plus court gagne. La Route 3 (2 AS) l'emporte sur la Route 2 (3 AS).

```text
Route choisie : Route 3
Critère décisif : LOCAL_PREF élimine la Route 1, puis AS_PATH le plus court départage 3 vs 2
```

**Question 2 : sans la Route 2**

Il reste la Route 1 et la Route 3.

1. **LOCAL_PREF** :
   - Route 1 = 100
   - Route 3 = 150

   La Route 3 (150) gagne immédiatement, car sa préférence locale est plus élevée. On s'arrête au premier critère.

```text
Route choisie : Route 3
Raison : LOCAL_PREF plus élevé (150 > 100)
Remarque : peu importe que la Route 3 soit iBGP et la Route 1 eBGP ;
           le critère eBGP/iBGP n'arrive qu'en 5e position, bien après LOCAL_PREF
```

**Question 3 : justification du LOCAL_PREF élevé**

Un LOCAL_PREF de 150 (plus haut que la valeur par défaut de 100) signifie que l'opérateur veut faire **sortir** son trafic en priorité par les voisins des routes 2 et 3.

Exemple concret : ces deux routes sont apprises via des accords de **peering gratuit**. L'opérateur leur affecte un LOCAL_PREF élevé pour les préférer, afin d'éviter de payer du **transit**. La Route 1, avec LOCAL_PREF=100, correspondrait alors à un lien de transit payant, gardé comme solution de secours.

```text
LOCAL_PREF 150 -> liens de peering (gratuits), à préférer
LOCAL_PREF 100 -> lien de transit (payant), route de secours
```

C'est l'application directe de la règle de préférence économique : clients d'abord, puis peering, puis transit en dernier recours.

---

## Navigation

← Fiche précédente : **[13 - IPv6 et coexistence IPv4/IPv6](13-ipv6-coexistence.md)**

Tu as terminé le cursus Réseaux. Pour continuer ton apprentissage :

→ Cursus suivant suggéré : **[Services système](../21-services-systeme/index.md)** - Administre les services Linux (systemd, journald, cron, utilisateurs)

→ Cursus suivant suggéré : **[Cloud](../22-cloud/index.md)** - Déploie des applications dans le cloud (AWS, GCP, Azure)
