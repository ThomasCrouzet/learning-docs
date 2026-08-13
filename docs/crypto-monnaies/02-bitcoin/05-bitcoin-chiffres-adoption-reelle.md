---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Bitcoin en chiffres : l'offre limitée, les halvings, la volatilité et l'adoption réelle mesurée par les données"
estimated_time: "40 min"
fiche_number: 5
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
---

# 05 - Bitcoin en chiffres : supply, halving et adoption réelle

> **En bref** : Examiner Bitcoin à travers les données factuelles - l'offre limitée, les halvings, la volatilité historique, l'adoption réelle et les cas d'usage avérés vs exagérés. Lecture estimée : 40 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)
- [Fiche 02 - Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)
- [Fiche 03 - Proof of Work : le consensus par l'énergie](03-proof-of-work-consensus-energie.md)
- [Fiche 04 - Le réseau Bitcoin : nœuds, mineurs et pools](04-reseau-noeuds-mineurs-pools.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer l'offre limitée de Bitcoin et son mécanisme de halving, évaluer la volatilité historique avec des chiffres, distinguer les cas d'usage réels des cas d'usage exagérés, et mesurer l'adoption réelle par les données plutôt que par le battage médiatique.

---

## Concepts

### L'offre limitée : 21 millions de BTC

**Définition** : Le protocole Bitcoin est programme pour ne jamais créer plus de 21 millions de bitcoins. Ce plafond est inscrit dans le code source et applique par chaque nœud du réseau.

**Le problème que l'offre limitée prétend résoudre** :

Sans limite d'offre, voici les problèmes rencontrès dans les monnaies traditionnelles :

1. **Inflation monétaire** : les banques centrales peuvent créer de la monnaie en quantité illimitée, ce qui dilue la valeur de la monnaie existante.
2. **Perte de pouvoir d'achat** : quand la quantité de monnaie augmente plus vite que la production de biens, les prix montent.
3. **Absence de prévisibilité** : personne ne sait combien d'euros ou de dollars seront en circulation dans 10 ans. Les banques centrales décident au cas par cas.

**Comment l'offre limitée fonctionne** :

| Métrique | Valeur |
| --- | --- |
| Nombre maximum de BTC | 21 000 000 (exactement) |
| BTC déjà minés (août 2026) | Environ 20,06 millions (~95,5%) |
| BTC restant a miner | Environ 1,1 million (~5%) |
| Date estimée du dernier BTC | Vers 2140 |
| Plus petite unité (1 satoshi) | 0,00000001 BTC |
| Nombre de satoshis dans 1 BTC | 100 000 000 |

**Pourquoi exactement 21 millions ?**

Il n'y a pas de justification mathématique profonde. Satoshi Nakamoto a choisi ce nombre en combinant deux paramètrès :

```text
Récompense initiale : 50 BTC par bloc
Division par 2 tous les 210 000 blocs

Total = 210 000 x (50 + 25 + 12,5 + 6,25 + 3,125 + ...)
Total = 210 000 x 100
Total = 21 000 000
```

La somme de la serie geometrique (50 + 25 + 12,5 + ...) converge vers 100. Multiplie par 210 000 blocs entre chaque halving, cela donne 21 millions.

**Analogie concrète** : Imagine un gâteau dont la recette est publique et impossible a modifier. La recette dit : "Ce gâteau contient exactement 21 millions de parts. On distribue les parts au fur et a mesure, en divisant par deux la quantité distribuée tous les 4 ans." Tout le monde peut vérifier la recette et s'assurer que personne ne triche.

**Ce que l'offre limitée n'est PAS** :

- L'offre limitée n'est pas une garantie de valeur. Un actif rare n'a pas forcément de la valeur. Des millions de choses sont rares sans avoir de prix élevé.
- L'offre limitée n'empêche pas la perte de pouvoir d'achat. Le prix de Bitcoin en euros peut baisser même si le nombre de bitcoins est fixe. La rareté ne protège pas de la volatilité du marche.

---

### Les halvings : calendrier et conséquences

**Définition** : Le halving est un événement programme dans le protocole Bitcoin qui divise par deux la récompense de bloc tous les 210 000 blocs (environ 4 ans). Ce mécanisme contrôle le rythme de création des nouveaux bitcoins.

**Historique complet des halvings** :

| Date | Numéro du bloc | Récompense avant | Récompense après | BTC en circulation après |
| --- | --- | --- | --- | --- |
| Janvier 2009 (lancement) | 0 | - | 50 BTC | 0 |
| Novembre 2012 (1er halving) | 210 000 | 50 BTC | 25 BTC | ~10,5 millions |
| Juillet 2016 (2e halving) | 420 000 | 25 BTC | 12,5 BTC | ~15,75 millions |
| Mai 2020 (3e halving) | 630 000 | 12,5 BTC | 6,25 BTC | ~18,375 millions |
| Avril 2024 (4e halving) | 840 000 | 6,25 BTC | 3,125 BTC | ~19,6 millions |
| ~2028 (5e halving prévu) | 1 050 000 | 3,125 BTC | 1,5625 BTC | ~20,3 millions |

**Conséquence mathématique** : chaque halving divise par deux le rythme d'émission. Après le 4e halving, environ 94% de tous les bitcoins qui existeront jamais ont déjà été mines. Les 6% restants seront mines sur les 115 prochaînes années.

**Le dernier bitcoin** :

Vers 2140, la récompense de bloc deviendra si petite qu'elle sera arrondie a zéro (inférieure a 1 satoshi). À ce moment-là, plus aucun nouveau bitcoin ne sera créé. Les mineurs seront rémunérés uniquement par les frais de transaction.

**Le halving et le prix - ce que les données montrent** :

Historiquement, le prix de Bitcoin a augmente dans les 12 a 18 mois suivant chaque halving. Ce fait est souvent utilise pour predire de futures hausses.

**Mises en garde importantes** :

- Correlation n'est pas causalité. Le prix de Bitcoin dépend de nombreux facteurs (demande, régulation, conditions macroeconomiques).
- Chaque halving est connu à l'avance (programme dans le code). Si le marché était parfaitement efficient, l'impact du halving serait déjà intégré dans le prix avant l'événement.
- L'échantillon est minuscule : 4 halvings en 15 ans. Tirer des conclusions statistiques sur 4 points de données est methodologiquement fragile.
- Les conditions de marché étaient différentes a chaque halving (adoption, régulation, contexte économique mondial).

---

### La volatilité : les chiffres factuels

**Définition** : La volatilité mesure l'amplitude des variations de prix d'un actif. Bitcoin est connu pour sa volatilité extrême comparée aux monnaies traditionnelles et même à la plupart des actions.

**Les crashes majeurs de Bitcoin** :

| Période | Prix au sommet | Prix au creux | Chute | Durée de la baisse |
| --- | --- | --- | --- | --- |
| Juin 2011 | ~32 dollars | ~2 dollars | -94% | 5 mois |
| Décembre 2013 | ~1 150 dollars | ~170 dollars | -85% | 14 mois |
| Décembre 2017 | ~19 800 dollars | ~3 200 dollars | -84% | 12 mois |
| Novembre 2021 | ~69 000 dollars | ~15 500 dollars | -78% | 13 mois |

**Fait** : Bitcoin a perdu plus de 50% de sa valeur a au moins 4 reprises en 15 ans. A chaque fois, le prix a fini par dépasser le sommet précédent, mais il a parfois fallu attendre 2 a 3 ans.

**Comparaison avec d'autres actifs (volatilité annualisee moyenne)** :

| Actif | Volatilité annualisee typique |
| --- | --- |
| Euro/Dollar (EUR/USD) | ~5-8% |
| Or | ~15-20% |
| S&P 500 (actions américaines) | ~15-20% |
| Bitcoin | ~50-80% |

**Cela disqualifie-t-il Bitcoin comme "réserve de valeur" ?**

**Arguments de ceux qui disent oui** :

- Une réserve de valeur doit être stable par définition. Un actif qui peut perdre 80% en un an ne protège pas le pouvoir d'achat.
- L'or, souvent cite comme référence, à une volatilité 3 a 5 fois inférieure a celle de Bitcoin.
- Les personnes qui ont achète Bitcoin au sommet de 2017 ont du attendre fin 2020 (3 ans) pour retrouver leur mise.

**Arguments de ceux qui disent non** :

- La volatilité diminue avec le temps. Les crashes sont moins profonds a chaque cycle (94%, 85%, 84%, 78%).
- Sur des périodes longues (5 ans et plus), Bitcoin a surperformé tous les autres actifs. Mais les performances passees ne garantissent pas les performances futures.
- La volatilité est une conséquence de l'adoption progressive. Un actif passe de 0 a plusieurs milliers de milliards de dollars de capitalisation n'atteint pas ce niveau de manière linéaire.

**Fait objectif** : Bitcoin est un actif extrêmement volatil. Toute affirmation sur son rôle de "réserve de valeur" doit être évaluée à la lumiere de cette volatilité mesurée.

---

### L'adoption réelle : ce que les données montrent

**Définition** : L'adoption d'une technologie se mesure par des indicateurs concrets (nombre d'utilisateurs actifs, volume de transactions, infrastructure). Les affirmations sur l'adoption de Bitcoin doivent être confrontees aux données.

**Indicateurs mesurables (2024-2026)** :

| Indicateur | Valeur approximative | Source |
| --- | --- | --- |
| Adresses ayant un solde non nul | Environ 50 millions | Glassnode, blockchain.com |
| Transactions quotidiennes (couche de base) | 300 000 a 500 000 | mempool.space |
| Capacité de la couche de base | ~7 transactions par seconde | Limitation du protocole |
| Capacité de Visa | ~1 700 transactions par seconde en moyenne (capacité maximale théorique : ~65 000) | Visa Inc. |
| Capitalisation boursiere de Bitcoin | Variable (~500 milliards a ~1 500 milliards de dollars) | CoinMarketCap |
| Pays ayant adopte Bitcoin comme monnaie légale | 1 (El Salvador, depuis septembre 2021). La Republique centrafricaine avait adopte Bitcoin en avril 2022, mais a abroge cette loi le 23 mars 2023. | Legislation officielle |

**Mise en garde sur les chiffres** :

- "50 millions d'adresses" ne signifie pas "50 millions d'utilisateurs". Une personne peut posséder des centaines d'adresses. Inversement, des millions de personnes utilisent Bitcoin via des plateformes centralisées sans adresse propre.
- Les transactions quotidiennes incluent les mouvements internes des plateformes d'échange. Le volume réel de "paiements" est difficile a isoler.
- La capitalisation boursiere est calculee sur la base du dernier prix échange. Elle ne représente pas la quantité d'argent investie dans Bitcoin.

**Comparaison factuelle avec les systèmes de paiement** :

| Système | Transactions par seconde | Coût par transaction | Temps de confirmation |
| --- | --- | --- | --- |
| Bitcoin (couche de base) | ~7 | Variable (0,50 a 50+ dollars) | ~10 min (1 confirmation) |
| Bitcoin (Lightning Network) | Theoriquement illimité | < 0,01 dollar | Quasi instantané |
| Visa | ~65 000 (capacité) / ~1 700 (moyenne) | ~1-3% du montant | Quelques secondes |
| SWIFT (virements internationaux) | Variable | 15-50 dollars | 1-5 jours ouvrables |

**Note** : Le Lightning Network est une "couche 2" construite au-dessus de Bitcoin. Il permet des transactions rapides et bon marche, mais il est encore en phase d'adoption et ne représente qu'une fraction du volume total.

---

### Cas d'usage réels et avérés

**Définition** : Un cas d'usage "avéré" est une utilisation de Bitcoin qui est documentee, mesurable et qui résout un problème réel pour ses utilisateurs.

**Cas d'usage 1 : Transferts internationaux (remittances)**

Le marché mondial des transferts internationaux représente environ 800 milliards de dollars par an. Les travailleurs expatries envoient de l'argent a leur famille dans leur pays d'origine.

| Méthode | Coût moyen | Délai |
| --- | --- | --- |
| Western Union / MoneyGram | 5-10% du montant | 1-3 jours |
| Virement bancaire SWIFT | 15-50 dollars fixe | 1-5 jours |
| Bitcoin (couche de base) | 0,50-5 dollars (variable) | 10-60 min |
| Bitcoin (Lightning Network) | < 0,01 dollar | Quasi instantané |

Pour des transferts vers des pays avec des systèmes bancaires peu developpes (Philippines, Nigeria, El Salvador), Bitcoin offre une alternative fonctionnelle et moins coûteuse. Ce cas d'usage est documente et mesurable.

**Cas d'usage 2 : Couverture contre l'hyperinflation**

Dans les pays ou la monnaie locale perd sa valeur rapidement, certains habitants convertissent une partie de leur épargne en Bitcoin.

| Pays | Inflation annuelle (estimation) | Utilisation documentee de Bitcoin |
| --- | --- | --- |
| Venezuela | > 100% (historiquement > 1 000 000% en 2018) | Adoption significative documentee par Reuters, BBC |
| Argentine | 100-200% (2023-2024) | Volume d'échange élevé sur les plateformes locales |
| Turquie | 50-80% (2022-2023) | Augmentation documentee des achats de Bitcoin |
| Nigeria | 25-35% (2023-2024) | Forte adoption malgré les restrictions gouvernementales |

**Mise en garde** : Bitcoin est lui-même très volatil. Il est possible de perdre plus de pouvoir d'achat avec Bitcoin qu'avec une monnaie locale en hyperinflation, selon le moment d'achat. Ce n'est pas une solution sans risque.

**Cas d'usage 3 : Registre infalsifiable**

La blockchain Bitcoin est un registre public que personne ne peut modifier retroactivement. Cela permet de prouver qu'une donnée existait à une date precise (horodatage cryptographique). Ce cas d'usage est réel mais de niche.

---

### Cas d'usage exagérés ou non prouves

**Définition** : Un cas d'usage "exagere" est une utilisation affirmee par des partisans de Bitcoin mais qui n'est pas confirmee par les données, ou qui est présentée de manière trompeuse.

**Affirmation 1 : "Bitcoin est une réserve de valeur comparable à l'or"**

| Critère | Or | Bitcoin |
| --- | --- | --- |
| Anciennete comme réserve de valeur | Plusieurs milliers d'années | ~15 ans |
| Volatilité annuelle | 15-20% | 50-80% |
| Correlation avec les actions en crise | Généralement faible (valeur refuge) | Variable - parfois correle aux actions tech |
| Acceptation institutionnelle | Banques centrales détiennent des réserves d'or | Adoption institutionnelle recente et limitée |

**Fait** : la corrélation de Bitcoin avec les marches actions (notamment le Nasdaq) est variable. Lors de la crise COVID de mars 2020, Bitcoin a chute de 50% en même temps que les actions. Ce n'est pas le comportement attendu d'une "valeur refuge". En revanche, sur d'autres périodes, la corrélation est faible. Les données ne permettent pas de conclure définitivement.

**Affirmation 2 : "Bitcoin va remplacer les monnaies traditionnelles"**

Les données actuelles ne soutiennent pas cette affirmation :

- Bitcoin traite ~7 transactions par seconde (couche de base). Le monde a besoin de millions de transactions par seconde.
- La volatilité empêche l'utilisation comme unité de compte. Aucun commercant ne peut fixer des prix en Bitcoin si la valeur change de 5% dans la journee.
- El Salvador a adopte Bitcoin comme monnaie légale en 2021. L'utilisation quotidienne par la population est restee marginale (le dollar américain reste largement prefere).

**Affirmation 3 : "Bitcoin protège de l'inflation"**

- En 2022, l'inflation mondiale était élevée (8-10% dans les pays developpes). Le prix de Bitcoin a chute de 65% la même année.
- Sur le long terme (5-10 ans), Bitcoin a surperformé l'inflation. Mais sur des périodes plus courtes, ce n'est pas garanti.
- "Proteger de l'inflation" et "spéculation avec potentiel de hausse" sont deux choses différentes. La première implique de la stabilité, la seconde de la volatilité.

---

### Les bitcoins perdus

**Définition** : Les "bitcoins perdus" sont des bitcoins dont les clés privées sont inaccessibles de manière permanente. Ces bitcoins existent toujours dans la blockchain mais ne peuvent plus jamais être dépenses.

**Estimations** :

| Catégorie | Estimation |
| --- | --- |
| Bitcoins de Satoshi Nakamoto (jamais dépenses depuis 2009) | ~1 million de BTC |
| Bitcoins mines dans les premières années (clés perdues) | ~1,5 a 2,5 millions de BTC |
| Bitcoins envoyés a des adresses invalides (burn) | Quelques milliers de BTC |
| Total estimé de BTC inaccessibles | ~3 a 4 millions de BTC |

**Source** : ces estimations proviennent d'analyses on-chain (Chainalysis, Glassnode) qui identifient les UTXOs n'ayant jamais été dépenses depuis des années et les adresses datant d'une époque ou le bitcoin ne valait presque rien.

**Conséquence** : sur les 21 millions de BTC théoriques, environ 3 a 4 millions sont probablement perdus a jamais. L'offre réellement disponible serait donc de 17 a 18 millions de BTC. Ce chiffre ne peut pas être connu avec certitude car il est impossible de distinguer un bitcoin "perdu" d'un bitcoin dont le propriétaire attend juste pour le dépenser.

**Cas documentees de pertes** :

- James Howells (Royaume-Uni) : a jete un disque dur contenant les clés de 8 000 BTC en 2013. Il bataille depuis avec la municipalite pour fouiller la decharge.
- Stefan Thomas (programmeur) : a perdu le mot de passe d'un disque dur IronKey contenant 7 002 BTC. Le disque s'efface après 10 tentatives ratees. Il lui reste 2 tentatives.
- QuadrigaCX (plateforme d'échange canadienne) : le fondateur est decede en 2018, emportant les clés privées donnant accès a environ 115 millions de dollars en crypto-monnaies.

**Analogie concrète** : Imagine un coffre-fort dont la serrure est physiquement impossible a forcer. Si tu perds la clé, le contenu du coffre existe toujours mais personne ne pourra jamais y accéder. Il n'y a pas de serrurier, pas de numéro de support, pas de procédure de récupération.

---

### Ordinals et Inscriptions (BRC-20)

**Définition** : Les Ordinals sont un système introduit en janvier 2023 qui attribué un numéro unique a chaque satoshi (la plus petite unité de Bitcoin). Ce système permet d'inscrire des données - images, texte, code - directement dans la blockchain Bitcoin.

**Comment ca fonctionne** :

```text
1 BTC = 100 000 000 satoshis

Le protocole Ordinals attribué un numéro d'ordre a chaque satoshi
en fonction de l'ordre dans lequel il a été mine.

Exemple :
- Le tout premier satoshi mine (bloc 0, transaction coinbase) = ordinal #0
- Le deuxième = ordinal #1
- etc.

Chaque satoshi est unique et identifiable par son numéro ordinal.

Une "inscription" consiste à attacher des données (image, texte, fichier)
a un satoshi spécifique, en les stockant dans la partie "witness"
de la transaction (espace libere par SegWit).
```

**BRC-20 : des tokens sur Bitcoin**

Inspire du standard ERC-20 d'Ethereum, le BRC-20 est un mécanisme expérimental pour créer des tokens fongibles sur Bitcoin. Malgré le nom similaire, le fonctionnement est très différent :

| ERC-20 (Ethereum) | BRC-20 (Bitcoin) |
| --- | --- |
| Smart contracts avec logique programmable | Inscriptions JSON dans la blockchain |
| Les soldes sont geres par le contrat | Les soldes sont deduits en lisant les inscriptions |
| Création, transfert et règles codees dans le contrat | Tout repose sur des conventions de format JSON |
| Mature et éprouvé depuis 2015 | Expérimental, pas de garantie de fonctionnement |

**Le débat dans la communauté Bitcoin** :

| Argument "innovation" | Argument "pollution" |
| --- | --- |
| Bitcoin doit évoluer et trouver de nouveaux cas d'usage | Bitcoin est conçu pour les transferts de valeur, pas pour stocker des images |
| Les inscriptions génèrent des frais pour les mineurs, ce qui renforce la sécurité | Les inscriptions congestionnent le réseau et font monter les frais pour les utilisateurs normaux |
| Chacun peut utiliser l'espace de bloc comme il le souhaite (il paie les frais) | Le stockage de données non financières gaspille une ressource limitée |

**Impact mesurable sur les frais** :

En mai 2023, au pic de la fievre BRC-20, les frais de transaction Bitcoin ont temporairement dépasse 30 dollars pour un simple transfert (contre 1-2 dollars en période normale). Cette congestion a dure quelques semaines avant que l'activité ne retombe.

**Fait** : après le pic initial de 2023, les volumes de BRC-20 et d'inscriptions Ordinals ont fortement baisse. L'activité continue d'exister mais à un niveau bien inférieur au pic. C'est un schéma classique dans l'écosystème crypto : engouement massif, pic, puis retour a des niveaux modestes.

---

## Checklist de Validation

- [ ] Je sais que le nombre maximum de BTC est 21 millions et j'en comprends le mécanisme
- [ ] Je connais l'historique des 4 halvings et la récompense de bloc actuelle (3,125 BTC)
- [ ] Je sais que le dernier bitcoin sera mine vers 2140
- [ ] Je sais que Bitcoin a perdu plus de 50% de sa valeur a au moins 4 reprises
- [ ] Je sais comparer la capacité de Bitcoin (~7 tx/s) a celle de Visa (~1 700 tx/s en moyenne, ~65 000 tx/s théorique)
- [ ] Je sais nommer 2 cas d'usage réels et avérés (transferts internationaux, couverture hyperinflation)
- [ ] Je sais nommer 2 cas d'usage exagérés ou non prouves et expliquer pourquoi
- [ ] Je connais l'estimation de BTC perdus (3-4 millions) et je comprends les conséquences
- [ ] Je sais expliquer pourquoi "corrélation n'est pas causalité" concernant le halving et le prix
- [ ] Je sais distinguer les faits des opinions dans le débat sur Bitcoin

---

## Navigation

← Fiche précédente : **[Le réseau Bitcoin : nœuds, mineurs et pools](04-reseau-noeuds-mineurs-pools.md)**

→ Fiche suivante : **[Forks et évolution des protocoles](06-forks-evolution-protocoles.md)**
