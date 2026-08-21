---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Autopsie de projets crypto : analyse des échecs majeurs classés par catégorie (hack, fraude, design, régulation)"
estimated_time: "45 min"
fiche_number: 4
total_fiches: 6
cursus: "Phase 6 - Analyse critique et due diligence"
id: "specializations.crypto.analysis.autopsie-projets-par-categorie"
course_id: "specializations.crypto"
module_id: "specializations.crypto.analysis"
content_type: "lesson"
order: 4
---

# 04 - Autopsie de projets : échecs par catégorie

> **En bref** : Analyser les échecs majeurs de l'histoire crypto classés en quatre catégories - hacks, fraudes, design défaillant et faillites - pour comprendre les mécanismes d'effondrement et reconnaître les signaux d'alerte qui existaient avant chaque catastrophe. Lecture estimée : 45 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complete (fiches 01 a 04)
- [Phase 2 - Bitcoin](../02-bitcoin/index.md) complete (fiches 01 a 06)
- [Phase 3 - Ethereum et les smart contracts](../03-ethereum-smart-contracts/index.md) complete (fiches 01 a 04)
- [Phase 4 - L'écosystème crypto](../04-ecosysteme-signal-bruit/index.md) complete (fiches 01 a 09)
- [Phase 5 - Sécurité et survie](../05-securite-survie/index.md) complete (fiches 01 a 05)
- [Fiche 01 - Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)
- [Fiche 02 - Tokenomics : séparer les projets viables du vent](02-tokenomics-projets-viables.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire les mécanismes d'échec des principales catastrophes crypto, classer les échecs par catégorie (hack, fraude, design, faillite), identifier les signaux d'alerte qui existaient avant chaque effondrement et appliquer ces leçons à l'évaluation de nouveaux projets.

---

## Concepts

### Pourquoi étudier les échecs ?

**Définition** : L'étude des échecs crypto n'est pas du pessimisme. C'est la méthode la plus fiable pour développer un jugement critique. Les erreurs qui ont causé des milliards de dollars de pertes se répètent sous des formes légèrement différentes. Reconnaître les patterns permet de les éviter.

**Le problème que l'étude des échecs résout** :

Sans connaissance des échecs passes, il est impossible de :

1. **Reconnaître les signaux d'alerte** : chaque effondrement avait des signaux visibles avant la catastrophe.
2. **Évaluer les risques réels** : la crypto présente des risques spécifiques qui n'existent pas dans la finance traditionnelle.
3. **Résister au marketing** : les projets qui échouent utilisent souvent les mêmes techniques de persuasion.

**Les 4 catégories d'échecs** :

| Catégorie | Cause principale | Exemple emblématique | Pertes |
| --- | --- | --- | --- |
| Hack | Faille de sécurité technique | Mt. Gox, The DAO | Centaines de millions à milliards |
| Fraude | Tromperie deliberee | FTX, Bitconnect | Milliards |
| Design défaillant | Mécanisme technique fondamentalement fragile | Terra/Luna, Iron Finance | Dizaines de milliards |
| Faillite / mauvaise gestion | Promesses impossibles à tenir | Celsius, Voyager | Milliards |

---

### Catégorie 1 : Les hacks

#### Mt. Gox (2014) - Le plus grand hack de l'histoire Bitcoin

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2010 | Mt. Gox est lancé comme plateforme d'échange Bitcoin (à l'origine un site d'échange de cartes Magic: The Gathering) |
| 2013 | Mt. Gox traite environ 70% de toutes les transactions Bitcoin mondiales |
| Février 2014 | Mt. Gox suspend les retraits |
| 28 février 2014 | Mt. Gox annonce la perte de 850 000 BTC (environ 450 millions de dollars à l'époque) |
| Avril 2014 | Dépôt de bilan |
| 2014-2024 | Procédure judiciaire au Japon, redistribution partielle aux crediteurs |

**Mécanisme de l'échec** :

```text
1. Mt. Gox stockait les bitcoins de ses clients dans un "hot wallet"
   (connecte a internet) au lieu d'un "cold wallet" (hors ligne).
2. Des failles de sécurité ont permis a des attaquants de siphonner
   progressivement les BTC pendant plusieurs années.
3. La plateforme n'avait pas de système de vérification des réserves.
   Personne (ni l'équipe, ni les utilisateurs) ne savait combien
   de BTC étaient réellement detenus.
4. Quand les retraits ont été suspendus, il était déjà trop tard :
   les fonds avaient disparu depuis longtemps.
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Problèmes de retrait recurrents | Des utilisateurs signalaient des retards de semaines sur les retraits depuis 2013 |
| Code source non audite | La plateforme avait des bugs connus et non corriges |
| Gestion amateur | Le fondateur (Mark Karpeles) n'avait pas d'expérience en sécurité financière |
| Pas de preuve de réserves | Aucun audit indépendant des fonds détenus |
| Concentration des volumes | 70% du marché sur une seule plateforme = point de défaillance unique |

**Pertes** : 850 000 BTC (environ 450 millions de dollars en 2014, plus de 50 milliards de dollars aux cours de 2024).

**Leçon** : la sécurité technique est le fondement. Un exchange sans cold storage, sans audits et sans preuve de réserves est une bombe à retardement.

---

#### The DAO (2016) - Le hack qui a coupé Ethereum en deux

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| Avril 2016 | The DAO est lancé : un fonds d'investissement décentralisé sur Ethereum |
| Mai 2016 | The DAO lève 150 millions de dollars en ETH (le plus grand crowdfunding de l'histoire à l'époque) |
| 17 juin 2016 | Un attaquant exploite un bug de reentrancy et siphonne 3,6 millions ETH (~60 millions de dollars) |
| 20 juillet 2016 | La communauté Ethereum vote un "hard fork" pour annuler le hack |
| Juillet 2016 | Le fork créé deux chaînes : Ethereum (ETH) et Ethereum Classic (ETC) |

**Mécanisme de l'échec** :

```text
1. Le smart contract de The DAO contenait un bug de reentrancy
   (voir fiche 04 de la Phase 3 pour les détails techniques).
2. La fonction de retrait envoyait les ETH AVANT de mettre a jour le solde.
3. L'attaquant a appelé la fonction de retrait de maniere recursive :
   - Appel 1 : envoie 1 000 ETH, le solde n'est pas encore mis a jour
   - Appel 2 (depuis le premier) : envoie encore 1 000 ETH
   - Appel 3, 4, 5... : même chose, en boucle
4. Le solde n'a été mis a jour qu'après la fin de la chaîne d'appels,
   quand il était déjà trop tard.
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Code non audité par des experts en sécurité | Le smart contract gérait 150 millions de dollars sans audit professionnel |
| Bug de reentrancy connu | Des développeurs avaient signalé le risque publiquement avant le hack |
| Complexite du code | Le contrat était trop complexe pour sa maturité (Ethereum avait moins d'un an) |
| Smart contracts immutables | Aucune possibilité de corriger un bug après déploiement |

**Pertes** : 3,6 millions ETH (~60 millions de dollars à l'époque). L'argent a été récupéré par le hard fork, mais au prix d'un précédent controversé : la blockchain "immutable" a été modifiée par décision communautaire.

**Leçon** : un smart contract qui gère des fonds importants DOIT être audité par des experts indépendants. Les bugs de sécurité dans un code immutable sont irréversibles (sauf mesure extrême comme un fork).

---

### Catégorie 2 : Les fraudes

#### FTX / Sam Bankman-Fried (2022) - La plus grande fraude crypto

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2019 | Sam Bankman-Fried (SBF) fonde FTX, une plateforme d'échange crypto |
| 2021 | FTX est valorisé à 32 milliards de dollars lors d'une levée de fonds |
| 2021-2022 | FTX sponsorise des stades, des équipes sportives, fait du lobbying a Washington |
| 2 novembre 2022 | CoinDesk publie un article révélant que Alameda Research (le fonds de SBF) détient des milliards en FTT (le token de FTX) |
| 6 novembre 2022 | Binance annonce vendre ses FTT. Panique bancaire sur FTX |
| 8 novembre 2022 | FTX suspend les retraits. Il manque environ 8 milliards de dollars |
| 11 novembre 2022 | FTX déclare faillite |
| Novembre 2023 | SBF reconnu coupable de 7 chefs d'accusation (fraude, blanchiment) |
| Mars 2024 | SBF condamne a 25 ans de prison |

**Mécanisme de la fraude** :

```text
1. FTX et Alameda Research (fonds d'investissement) étaient diriges
   par la même personne (SBF). Conflit d'intérêts majeur.
2. FTX utilisait les fonds de ses clients pour financer les trades
   spéculatifs d'Alameda. C'est l'équivalent d'une banque qui joue
   au casino avec l'argent de ses déposants.
3. FTX a crée son propre token (FTT) et l'a utilise comme
   collatéral pour des emprunts de milliards de dollars.
   Problème : la valeur du FTT dependait de la confiance en FTX.
   Quand la confiance a disparu, le FTT s'est effondre,
   et les emprunts sont devenus insolvables.
4. Aucun contrôle interne, aucun audit sérieux, comptabilité chaotique.
   SBF a admis que les comptes étaient geres via QuickBooks
   (un logiciel pour petites entreprises).
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Conflit d'intérêts FTX/Alameda | Le fondateur dirigeait à la fois la plateforme et un fonds qui y tradait |
| Token propriétaire (FTT) comme garantie | Utiliser son propre token comme collatéral est un schéma circulaire |
| Absence d'audit financier | Aucun audit par un cabinet reconnu des "Big Four" |
| Croissance et dépenses excessives | Sponsoring de stades, publicites au Super Bowl, donations politiques massives |
| Centralisation extrême | Toutes les décisions prises par un petit groupe sans contrôle externe |

**Pertes** : environ 8 milliards de dollars de fonds clients détournés.

**Leçon** : la centralisation combinée à l'opacité est le cocktail le plus dangereux en crypto. Une plateforme centralisée qui refuse les audits indépendants est un risque majeur, quelle que soit sa réputation.

---

#### Bitconnect (2018) - Le schéma de Ponzi classique

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2016 | Bitconnect est lancé. Promet des rendements quotidiens de 0,5% à 1% (soit 180% à 365% par an) |
| 2017 | Le token BCC atteint un sommet de 463 dollars. Capitalisation de 2,6 milliards de dollars |
| Janvier 2018 | Bitconnect annonce la fermeture de sa plateforme de lending |
| Janvier 2018 | Le prix du BCC chute de 463 dollars à moins de 1 dollar en quelques jours |
| 2022 | Le fondateur (Satish Kumbhani) est inculpé par le DOJ américain pour fraude |

**Mécanisme de la fraude** :

```text
Structure de Ponzi classique :
1. Les investisseurs deposent du Bitcoin.
2. Bitconnect promet des rendements quotidiens de ~1%
   grâce à un "bot de trading" propriétaire.
3. En réalité, les rendements sont payés avec l'argent
   des nouveaux investisseurs.
4. Tant que de nouveaux investisseurs arrivent, le système tient.
5. Quand l'afflux de nouveaux fonds ralentit, le système s'effondre.

Ce mécanisme est identique au schéma de Ponzi invente par
Charles Ponzi en 1920 et utilise par Bernard Madoff pendant 17 ans.
La seule difference : le mot "blockchain" a été ajoute.
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Rendements "garantis" | 1% par jour = 365% par an. Aucun investissement légitime ne produit cela |
| "Bot de trading" secret | Aucune preuve de l'existence de cet algorithme. Aucun audit |
| Schéma de parrainage | Récompenses pour recruter de nouveaux investisseurs (schéma pyramidal) |
| Équipe anonyme | Le fondateur était inconnu |
| Pas de produit réel | Bitconnect ne fournissait aucun service en dehors du schéma de lending |

**Pertes** : environ 2,4 milliards de dollars.

**Leçon** : si quelqu'un promet des rendements garantis en crypto (ou ailleurs), c'est un schéma de Ponzi jusqu'à preuve du contraire. La règle est universelle : des rendements élevés et garantis n'existent pas.

---

### Catégorie 3 : Design défaillant

#### Terra/Luna (mai 2022) - 40 milliards évaporés en 3 jours

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2020 | Terra lance UST, un stablecoin algorithmique indexé sur le dollar |
| 2021-2022 | UST atteint 18 milliards de dollars de capitalisation. Anchor Protocol promet 20% de rendement sur les dépôts en UST |
| 7 mai 2022 | UST commence a perdre son ancrage au dollar (depeg) |
| 9 mai 2022 | UST tombe a 0,35 dollar. LUNA s'effondre de 80 dollars a moins de 1 dollar |
| 12 mai 2022 | LUNA vaut moins de 0,001 dollar. UST vaut 0,10 dollar. Environ 40 milliards de dollars de valeur detruits |
| Mars 2023 | Do Kwon (fondateur) arrêté au Montenegro |
| Août 2025 | Do Kwon plaide coupable aux États-Unis (conspiracy et wire fraud) |
| 11 décembre 2025 | Do Kwon condamné à 15 ans de prison, avec confiscation de plus de 19 millions de dollars. Le juge qualifie l'affaire de "fraude d'une ampleur générationnelle" |

**Mécanisme de l'échec** :

```text
Le design de Terra/Luna reposait sur un mécanisme d'arbitrage :

1. UST est un stablecoin algorithmique : il n'est adosse a aucune
   réserve en dollars. Sa stabilité dépend d'un mécanisme de
   création/destruction avec LUNA.

2. Le mécanisme :
   - Si UST > 1 $ : on peut créer de nouveaux UST en brûlant des LUNA
     (l'offre d'UST augmente, le prix baisse vers 1 $)
   - Si UST < 1 $ : on peut brûler des UST pour créer des LUNA
     (l'offre d'UST diminue, le prix remonte vers 1 $)

3. Ce mécanisme fonctionne tant que les gens ont confiance.
   Quand la confiance disparaît, une spirale de la mort se déclenche :
   - UST perd son peg (tombe sous 1 $)
   - Les détenteurs vendent leurs UST en masse
   - Pour chaque UST brûlé, de nouveaux LUNA sont créés
   - L'offre de LUNA explose (de 350 millions a 6 500 milliards en 3 jours)
   - Le prix de LUNA s'effondre
   - La confiance chute encore plus
   - Plus de gens vendent leurs UST
   - Boucle infernale jusqu'à la destruction totale
```

**Pourquoi Anchor Protocol a accelere l'effondrement** :

```text
Anchor Protocol offrait 20% de rendement annuel sur les dépôts en UST.
- Ce rendement n'était pas durable (il était subventionne par la
  tresorerie de Terra).
- Il a attire des milliards de dollars d'UST deposés uniquement
  pour le rendement.
- Quand les gens ont commence a douter de la pérennité du rendement,
  ils ont retire leurs UST massivement.
- Ce retrait massif a déclenche la spirale de depeg.

Leçon dans la leçon : des rendements anormalement élevés attirent
des fonds "mercenaires" qui fuient au premier signe de faiblesse.
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Stablecoin algorithmique sans réserve | Le mécanisme dépend de la confiance, pas de réserves réelles |
| 20% de rendement "garanti" sur Anchor | Aucun modèle économique ne justifie 20% de rendement sur un stablecoin |
| Précédent historique | Iron Finance avait subi le même type d'effondrement en juin 2021, 11 mois avant Terra |
| Concentration des dépôts | La majorité des UST était déposée sur Anchor pour le rendement (pas pour l'utilité) |
| Critiques ignorées | Des analystes avaient publié des alertes détaillées sur le risque de spirale de la mort |

**Pertes** : environ 40 milliards de dollars de valeur détruits en 3 jours.

**Leçon** : les stablecoins algorithmiques purs (sans réserve) sont fragiles par design. Ils fonctionnent tant que la confiance est présente, mais s'effondrent complètement quand elle disparaît. C'est un problème structurel, pas un accident.

---

#### Iron Finance (juin 2021) - Le précédent ignore

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2021 | Iron Finance lance IRON, un stablecoin partiellement algorithmique sur Polygon |
| 16 juin 2021 | IRON perd son ancrage. Le token TITAN passe de 65 dollars a quasiment zéro en quelques heures |
| Juin 2021 | L'effondrement est analyse par la communauté crypto |
| Mai 2022 | Terra/Luna subit exactement le même type d'effondrement, 11 mois plus tard |

**Mécanisme** : identique a Terra/Luna, en plus petit. Spirale de la mort entre le stablecoin (IRON) et le token de gouvernance (TITAN). Quand les gros détenteurs ont commence a vendre, la spirale s'est declenchee et le token est passe a zéro.

**Leçon spécifique** : Iron Finance a prouvé que le mécanisme de stablecoin algorithmique pur était fragile. Terra/Luna a répété exactement le même schéma 11 mois plus tard, à une échelle 100 fois supérieure. Les leçons des échecs précédents ne sont pas toujours retenues.

---

### Catégorie 4 : Faillites et mauvaise gestion

#### Celsius (2022) - Les rendements impossibles du CeFi

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2017 | Celsius Network est fondé : plateforme de lending CeFi (finance centralisée) |
| 2020-2021 | Celsius attire des milliards de dollars en promettant des rendements de 8-17% sur les dépôts crypto |
| Juin 2022 | Celsius gele les retraits |
| Juillet 2022 | Celsius déclare faillite (chapitre 11) |
| 2023 | Le fondateur (Alex Mashinsky) est arrêté pour fraude |

**Mécanisme de l'échec** :

```text
1. Celsius promettait des rendements élevés (8-17% par an)
   sur les dépôts de crypto-monnaies.
2. Pour générer ces rendements, Celsius prenait des risques
   de plus en plus importants :
   - Prêts non collatéralises a des fonds spéculatifs
   - Investissements dans des protocoles DeFi risques
   - Stratégies de staking avec des périodes de blocage longues
3. Quand le marche a chute en 2022, les emprunteurs n'ont pas
   pu remboursér, les investissements DeFi ont perdu de la valeur,
   et les actifs en staking ne pouvaient pas être retires.
4. Celsius n'avait pas assez d'actifs liquides pour honorer
   les retraits de ses clients.
5. Les retraits ont été geles. Faillite.
```

**Signaux d'alerte qui existaient AVANT l'effondrement** :

| Signal | Détail |
| --- | --- |
| Rendements trop élevés | 8-17% par an sur des crypto-monnaies, sans explication claire de la source |
| Opacité sur les investissements | Celsius ne divulguait pas comment les rendements étaient générés |
| Pas d'assurance des dépôts | Contrairement aux banques, aucune garantie en cas de faillite |
| Centralisation des décisions | Toutes les décisions de risque prises par le fondateur |
| Prêts non collatéralisés | Prêter sans garantie = risque de non-remboursément |

**Pertes** : environ 4,7 milliards de dollars de fonds clients.

---

#### Voyager Digital (2022) - Le même problème, la même issue

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2018 | Voyager Digital est fondée : courtier crypto |
| 2020-2021 | Voyager attire des milliards en promettant des rendements élevés |
| Juin 2022 | Three Arrows Capital (3AC), un fonds a qui Voyager avait prete 650 millions de dollars, fait faillite |
| Juillet 2022 | Voyager déclare faillite |

**Mécanisme** : quasi identique a Celsius. Rendements promis non soutenables, prêts non collatéralises a des fonds spéculatifs (notamment 3AC), et quand les emprunteurs ont fait faillite, Voyager a suivi.

**Pertes** : environ 1,3 milliard de dollars de fonds clients.

**Leçon commune a Celsius et Voyager** : les rendements "garantis" en crypto n'existent pas. Si une plateforme promet 10% ou plus sur vos dépôts, posez la question : d'où vient ce rendement ? Si la réponse est floue ou absente, le risque est que VOS dépôts soient le rendement de quelqu'un d'autre (schéma de Ponzi) ou que la plateforme prenne des risques demesures avec votre argent.

---

### Synthèse : les patterns recurrents

**Définition** : En analysant ces échecs, des patterns recurrents emergent. Les reconnaître est la meilleure protection.

**Pattern 1 : Opacite + Centralisation = Danger maximal**

| Cas | Centralisation | Opacite | Résultat |
| --- | --- | --- | --- |
| Mt. Gox | Une personne gère les fonds | Pas de preuve de réserves | 850 000 BTC volés |
| FTX | SBF contrôle tout | Pas d'audit financier | 8 milliards de dollars detournes |
| Celsius | Mashinsky décide seul | Stratégies non divulguees | 4,7 milliards de dollars perdus |

**Pattern 2 : Rendements impossibles = Schéma insoutenable**

| Cas | Rendement promis | Source réelle du rendement | Résultat |
| --- | --- | --- | --- |
| Bitconnect | 365% par an | Argent des nouveaux investisseurs | Ponzi |
| Anchor/Terra | 20% sur stablecoin | Subvention de la tresorerie | Effondrement |
| Celsius | 8-17% par an | Prêts risques et investissements spéculatifs | Faillite |

**Pattern 3 : Les précédents ignores**

| Échec | Précédent qui aurait du alerter |
| --- | --- |
| Terra/Luna (mai 2022) | Iron Finance (juin 2021) - même mécanisme |
| Voyager (juillet 2022) | Celsius (juin 2022) - même modèle |
| FTX (novembre 2022) | Mt. Gox (2014) - même problème de réserves |

---

## Checklist de Validation

- [ ] Je connais les 4 catégories d'échecs crypto (hack, fraude, design, faillite)
- [ ] Je sais expliquer le hack de Mt. Gox et la leçon sur les preuves de réserves
- [ ] Je sais expliquer le hack de The DAO et la leçon sur les audits de smart contracts
- [ ] Je sais expliquer la fraude FTX et la leçon sur centralisation + opacité
- [ ] Je sais expliquer Bitconnect et reconnaître un schéma de Ponzi en crypto
- [ ] Je sais expliquer la spirale de la mort de Terra/Luna et pourquoi les stablecoins algorithmiques sont fragiles
- [ ] Je sais expliquer pourquoi Celsius et Voyager ont fait faillite (rendements impossibles)
- [ ] Je reconnais le pattern "opacité + centralisation = danger maximal"
- [ ] Je reconnais le pattern "rendements impossibles = schéma insoutenable"
- [ ] Je sais que les échecs précédents sont souvent ignorés et que les mêmes erreurs se répètent

---

## Navigation

← Fiche précédente : **[Analyse on-chain : les données ne mentent pas](03-analyse-on-chain-donnees.md)**

→ Fiche suivante : **[Due diligence : la checklist du sceptique eclaire](05-due-diligence-checklist-sceptique.md)**
