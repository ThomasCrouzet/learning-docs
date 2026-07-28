---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "NFTs : la technologie des tokens non fongibles vs la bulle spéculative"
estimated_time: "35 min"
fiche_number: 3
total_fiches: 9
cursus: "Phase 4 - L'écosystème crypto"
---

# 03 - NFTs : la technologie vs la spéculation

> **En bref** : Comprendre ce qu'est techniquement un NFT, ce qu'il contient réellement, distinguer les cas d'usage légitimes de la bulle spéculative et analyser l'effondrement du marche. Lecture estimée : 35 min.

## Prérequis

- [Fiche 01 - Taxonomie des tokens](01-taxonomie-tokens.md)
- [Fiche 02 - DeFi : finance décentralisée ou casino décentralisé](02-defi-finance-ou-casino.md)
- Comprendre ce qu'est un token et un smart contract

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'un NFT contient réellement (et ne contient pas), identifier les cas d'usage techniques légitimes, décrire les mécanismes de la bulle spéculative 2021-2022 et comprendre pourquoi 95%+ des NFTs n'ont plus de valeur.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce qu'un NFT ?

**Définition** : Un NFT (Non-Fungible Token) est un token unique sur une blockchain. Contrairement à un bitcoin ou un USDC (qui sont interchangeables - fongibles), chaque NFT est distinct et non interchangeable.

**Le problème que les NFTs résolvent** :

Sans les NFTs, la blockchain ne gère que des tokens interchangeables :

1. **Pas d'unicite** : impossible de représenter un objet unique (un billet de concert, un titre de propriété) avec un token standard ERC-20
2. **Pas de provenance** : impossible de prouver de manière vérifiable qui a créé un objet numérique et qui l'a possédé
3. **Pas de rareté vérifiable** : un créateur affirme qu'il n'y a que 100 exemplaires, mais comment le vérifier ?

**Comment les NFTs résolvent ces problèmes** :

| Problème | Solution apportée par les NFTs |
| --- | --- |
| Pas d'unicite | Chaque NFT à un identifiant unique (token ID) sur la blockchain |
| Pas de provenance | L'historique complet (création, ventes, transferts) est enregistre publiquement |
| Pas de rareté vérifiable | Le smart contract définit le nombre total d'exemplaires, vérifiable par tous |

**Analogie concrète** : un billet de 10 euros est fongible - n'importe quel billet de 10 euros à la même valeur et tu peux les échanger sans différence. Un tableau original de Picasso est non fongible - il est unique, et le remplacer par un autre tableau de Picasso ne donne pas la même chose. Un NFT est comme un certificat d'authenticite numérique grave dans la blockchain.

**Ce qu'un NFT n'est PAS** :

- Un NFT n'est pas une image. Le NFT est un enregistrement sur la blockchain qui pointe vers une image (ou un fichier). L'image elle-même n'est pas sur la blockchain.
- Un NFT ne protège pas le droit d'auteur. Acheter un NFT ne donne généralement pas les droits d'auteur sur l'oeuvre. Tu possedes le token, pas l'oeuvre.

---

### Ce que contient réellement un NFT

**Définition** : Un NFT est un smart contract (généralement au standard ERC-721 ou ERC-1155) qui stocke un identifiant unique et un lien vers des metadonnées. Il ne contient PAS le fichier lui-même.

**Structure technique d'un NFT** :

```text
Ce qui est SUR la blockchain (dans le smart contract) :
- Token ID : un numéro unique (par exemple 4237)
- Propriétaire : l'adresse du wallet qui possède le NFT
- Token URI : un lien vers les metadonnées

Ce qui est HORS de la blockchain (au bout du lien) :
- Un fichier JSON contenant :
  - Nom de l'oeuvre
  - Description
  - Lien vers l'image/le fichier
  - Attributs (rareté, propriétés)
- L'image ou le fichier lui-même
```

**Où est stockée l'image ?**

| Stockage | Description | Risque |
| --- | --- | --- |
| IPFS (InterPlanetary File System) | Réseau décentralisé de stockage de fichiers | Le fichier peut disparaître si personne ne le "pin" (heberge) |
| Arweave | Stockage permanent décentralisé | Plus fiable mais plus coûteux |
| Serveur centralisé (AWS, Google Cloud) | Serveur classique d'une entreprise | Si l'entreprise ferme ou supprime le fichier, le NFT pointe vers rien |

**Le problème du lien casse** :

```text
Scénario réel :
1. Tu achetes un NFT pour 2 ETH
2. Le NFT contient un lien : https://serveur-du-projet.com/images/4237.png
3. Le projet ferme 6 mois plus tard
4. Le serveur est eteint
5. Ton NFT pointe maintenant vers une erreur 404
6. Tu possedes un token qui référence... rien

Ce scénario s'est produit des milliers de fois. C'est l'équivalent
d'acheter un certificat d'authenticite pour un tableau qui a brûlé.
```

**Fait** : une étude de 2023 a montre qu'une proportion significative des NFTs existants pointent vers des liens morts. Le token existe toujours sur la blockchain, mais le contenu a disparu.

---

### Cas d'usage techniques légitimes

**Définition** : Au-delà de la spéculation sur les images, la technologie NFT a des applications concrètes où l'unicite et la provenance vérifiable apportent une valeur réelle.

**Cas d'usage avec utilité demontree** :

| Cas d'usage | Pourquoi un NFT est utile | Exemple |
| --- | --- | --- |
| Billets d'événements | Empecher la contrefacon, limiter la revente | Ticketmaster teste les NFT tickets |
| Certificats d'authenticite | Prouver l'origine d'un objet physique (luxe, art) | LVMH et Aura Blockchain |
| Noms de domaine décentralisés | Posseder un nom (.eth) sans autorité centrale | Ethereum Name Service (ENS) |
| Identité numérique | Prouver des diplomes, certifications | Experimentation par certaines universites |
| Gaming | Posseder des objets in-game transferables entre jeux | Encore au stade expérimental |

**Pourquoi ces cas sont différents de la spéculation** :

- Le NFT représente quelque chose d'utile indépendamment de son prix de revente
- L'utilisateur achète le NFT pour l'utiliser, pas pour le revendre plus cher
- Le prix est lie à la valeur du service (un billet de concert coûte le prix du concert, pas 10 000 dollars)

**Les limites de ces cas d'usage** :

- La plupart en sont encore au stade expérimental
- Pour beaucoup, une base de données classique suffirait (un billet numérique n'a pas forcément besoin d'une blockchain)
- L'expérience utilisateur reste complexe pour un utilisateur non technique

---

### La bulle NFT 2021-2022

**Définition** : Entre 2021 et 2022, le marché des NFTs a connu une bulle spéculative où des images numériques se vendaient pour des millions de dollars, avant un effondrement massif.

**Chronologie factuelle** :

```text
Mars 2021 :
- L'artiste Beeple vend un NFT pour 69 millions $ chez Christie's
- C'est le troisième prix le plus élevé pour un artiste vivant
- L'acheteur (Metakovan) est un investisseur crypto
  qui possède déjà d'autres NFTs de Beeple

Avril-Novembre 2021 :
- Bored Ape Yacht Club (BAYC) : 10 000 images de singes génèrees
  algorithmiquement. Prix de lancement : 0,08 ETH (environ 190 $)
- Le prix monte a plus de 100 ETH (environ 300 000 $) par singe
- Des celebrites achètent des BAYC (Justin Bieber, Eminem, Snoop Dogg)
- Le volume mensuel de ventes NFT dépasse 5 milliards $

2022 :
- Le marche crypto global s'effondre
- Les volumes de vente NFT chutent de plus de 90%
- La plupart des collections perdent 90-99% de leur valeur

2023-2024 :
- 95%+ des NFTs n'ont plus aucune valeur marchande
- Le volume de trading est une fraction de ce qu'il était
- Les celebrites qui promouvaient des NFTs n'en parlent plus
```

**Les mécanismes de la bulle** :

| Mécanisme | Explication |
| --- | --- |
| Rareté artificielle | 10 000 images générées algorithmiquement, vendues comme "rares" |
| Effet de communauté | Posseder un BAYC donnait accès à un "club exclusif" |
| Celebrites | L'implication de celebrites attirait de nouveaux acheteurs |
| FOMO | "Si je n'achète pas maintenant, le prix va encore monter" |
| Liquidité facile | Le marché crypto était en hausse, les gens avaient des gains à dépenser |
| Recit du "nouveau paradigme" | "Les NFTs vont revolutionner l'art, la propriété, internet" |

---

### Le wash trading : gonfler les volumes artificiellement

**Définition** : Le wash trading consiste à s'acheter un NFT a soi-même (en utilisant deux wallets différents) pour créer l'illusion d'un volume de trading élevé et d'un prix en hausse.

**Comment ca fonctionne** :

```text
1. Alice crée un NFT
2. Alice le met en vente pour 1 ETH
3. Alice, avec un autre wallet (qui semble être une autre personne),
   achète son propre NFT pour 1 ETH
4. Alice remet le NFT en vente pour 3 ETH
5. Alice, avec un troisième wallet, achète le NFT pour 3 ETH
6. Le NFT affiche maintenant un "historique de ventes" :
   - Vente 1 : 1 ETH
   - Vente 2 : 3 ETH
   - "Tendance" : en hausse
7. Un vrai acheteur voit cet historique et achète le NFT pour 5 ETH
8. Alice a gagne 5 ETH (moins les frais de gas)
```

**L'ampleur du problème** :

- Des analyses on-chain ont estimé que le wash trading representait une part significative du volume total sur certaines plateformes NFT
- Sur les blockchains, il est impossible d'empêcher une personne de posséder plusieurs wallets
- Certaines plateformes ont tente de filtrer le wash trading, mais c'est un problème difficile à résoudre

---

### Bilan factuel : technologie vs spéculation

**La technologie NFT** :

| Aspect | Évaluation factuelle |
| --- | --- |
| Unicite vérifiable sur blockchain | Innovation technique réelle |
| Provenance et historique de propriété | Utilité demontree pour certains cas |
| Interoperabilite (utiliser un NFT dans plusieurs applications) | Theoriquement possible, rarement mise en oeuvre |
| Smart contracts pour les royalties (l'artiste reçoit un % à chaque revente) | Fonctionnel techniquement, mais contournable en pratique |

**La spéculation NFT** :

| Aspect | Évaluation factuelle |
| --- | --- |
| 95%+ des collections ne valent plus rien | Confirme par les données de marché |
| Les "communautés exclusives" ont disparu | La plupart des projets sont abandonnes |
| Les celebrites qui promouvaient des NFTs | Ont arrête d'en parler, certaines poursuivies en justice |
| "Les NFTs vont remplacer les titres de propriété" | Aucune adoption significative a ce jour |

**Conclusion factuelle** : la technologie des tokens non fongibles résout un problème réel (représenter l'unicite sur une blockchain). La spéculation de 2021-2022 a instrumentalisé cette technologie pour vendre des images générées algorithmiquement a des prix deconnectes de toute réalité. La technologie survivra dans des niches utiles. La spéculation a causé des pertes massives pour la majorité des acheteurs.

---

## Checklist de Validation

- [ ] Je sais qu'un NFT est un token unique et non interchangeable sur une blockchain
- [ ] Je comprends qu'un NFT contient un lien vers un fichier, pas le fichier lui-même
- [ ] Je connais les trois types de stockage (IPFS, Arweave, serveur centralisé) et leurs risques
- [ ] Je sais que posséder un NFT ne donne généralement pas les droits d'auteur sur l'oeuvre
- [ ] Je connais les cas d'usage techniques légitimes (billets, certificats, noms de domaine)
- [ ] Je peux décrire les mécanismes de la bulle NFT 2021-2022 (rareté artificielle, FOMO, celebrites)
- [ ] Je comprends ce qu'est le wash trading et pourquoi il fausse les volumes
- [ ] Je sais que 95%+ des NFTs n'ont plus de valeur marchande
- [ ] Je fais la distinction entre la technologie (potentiellement utile) et la spéculation (destructrice)

---

## Navigation

← Fiche précédente : **[DeFi : finance décentralisée ou casino décentralisé](02-defi-finance-ou-casino.md)**

→ Fiche suivante : **[DAOs : gouvernance décentralisée en pratique](04-daos-gouvernance-decentralisee.md)**
