---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Marches de prédiction : parier sur l'avenir avec Polymarket et Kalshi, entre innovation et spéculation"
estimated_time: "45 min"
fiche_number: 7
total_fiches: 9
cursus: "Phase 4 - L'écosystème crypto"
---

# 07 - Marches de prédiction : parier sur l'avenir

> **En bref** : Comprendre le fonctionnement des marches de prédiction (Polymarket, Kalshi, Augur, Azuro), leurs chiffres réels, et évaluer si cette innovation est un outil d'information ou une forme de gambling. Lecture estimée : 45 min.

## Prérequis

- [Fiche 01 - Taxonomie des tokens](01-taxonomie-tokens.md)
- [Fiche 02 - DeFi : finance décentralisée ou casino décentralisé](02-defi-finance-ou-casino.md)
- [Fiche 03 - NFTs : la technologie vs la spéculation](03-nfts-technologie-vs-speculation.md)
- [Fiche 04 - DAOs : gouvernance décentralisée en pratique](04-daos-gouvernance-decentralisee.md)
- [Fiche 05 - Stablecoins : l'innovation la plus utile du secteur](05-stablecoins-innovation-utile.md)
- [Fiche 06 - Staking en pratique](06-staking-en-pratique.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est un marché de prédiction, connaître les acteurs majeurs (Polymarket, Kalshi, Augur, Azuro), comprendre comment les prix refletent les probabilités estimees par le marche, et évaluer les limites et les risques de ces plateformes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce qu'un marché de prédiction ?

**Définition** : Un marché de prédiction est une plateforme où les participants achètent et vendent des contrats lies à l'issue d'événements futurs (elections, prix d'actifs, événements sportifs, meteo, geopolitique). Le prix d'un contrat reflete la probabilité estimée par l'ensemble des participants.

**Le problème que les marches de prédiction résolvent** :

Sans marches de prédiction, voici les problèmes rencontrès :

1. **Sondages peu fiables** : les sondages classiques reposent sur des declarations d'intention, pas sur un engagement financier. Les gens disent une chose et font autre chose.
2. **Experts souvent faux** : les prévisions des experts individuels sont fréquemment incorrectes, surtout pour les événements complexes.
3. **Information dispersee** : les signaux faibles sur l'issue d'un événement sont repartis entre des milliers de personnes et ne sont pas agreges efficacement.

**Comment les marches de prédiction résolvent ces problèmes** :

| Problème | Solution apportée par les marches de prédiction |
| --- | --- |
| Sondages peu fiables | Les participants engagent de l'argent réel : leur mise reflete une conviction, pas une simple opinion |
| Experts souvent faux | L'agrégation de milliers de paris produit souvent une estimation plus precise qu'un expert seul |
| Information dispersee | Le prix du contrat agrege en temps réel toute l'information disponible sur le marché |

**Analogie concrète** : imagine un bocal rempli de billes. Si tu demandes à une seule personne de deviner le nombre de billes, elle se trompera probablement. Mais si tu demandes à 1 000 personnes et que tu fais la moyenne de leurs réponses, cette moyenne sera souvent plus proche du vrai nombre que la réponse de n'importe quel individu.
Un marché de prédiction fonctionne sur ce principe (appelé "sagesse des foules"), avec une différence : chaque participant met de l'argent en jeu, ce qui l'incite à être le plus précis possible.

**Comment lire le prix d'un contrat** :

```text
Exemple : "Le candidat X sera-t-il elu president ?"

- Tu peux acheter un contrat "Oui" ou un contrat "Non"
- Si le contrat "Oui" se négocie à 0,65 $ :
  le marche estime la probabilité a 65%
- Si l'événement se realise :
  le contrat "Oui" vaut 1,00 $ (tu gagnes 0,35 $ par contrat)
- Si l'événement ne se realise pas :
  le contrat "Oui" vaut 0,00 $ (tu perds tes 0,65 $)

Le prix fluctue en temps réel selon les achats et ventes des participants.
```

**Ce qu'un marché de prédiction n'est PAS** :

- Un marché de prédiction n'est pas un sondage. Un sondage demandé une opinion gratuite. Un marché de prédiction demandé de mettre de l'argent en jeu.
- Un marché de prédiction n'est pas une prevision infaillible. Le prix reflete une estimation collective, pas une certitude. Les événements a faible probabilité (cygnes noirs) sont régulièrement sous-estimes.

---

### Polymarket : le leader décentralisé

**Définition** : Polymarket est le plus grand marché de prédiction base sur la blockchain. Fonde en 2020 par Shayne Coplan, il est construit sur Polygon (une couche 2 d'Ethereum). Les paris sont règles en USDC (stablecoin).

**Chiffres et faits** :

```text
Historique :
- 2020 : lancement sur Polygon
- 2024 : explosion du volume pendant les elections américaines
  (prédictions plus précises que les sondages traditionnels)
- Octobre 2025 : investissement de 2 milliards $ par ICE
  (Intercontinental Exchange, propriétaire de la Bourse de New York)
  Valorisation d'environ 8 milliards $ pre-investissement
  (9 milliards $ post-investissement)
- Novembre 2025 : autorisation de la CFTC (régulateur américain des
  marches derives) pour operer aux États-Unis comme exchange régulée

Chiffres 2025-2026 :
- Volume annuel 2025 : environ 22 milliards $
- Février 2026 : record de 7 milliards $ de volume mensuel
- Plus de 450 000 traders actifs

Marches disponibles :
- Geopolitique (elections, conflits, traites)
- Sport (résultats, transferts de joueurs)
- Macroeconomie (taux d'intérêt, inflation, décisions de banques centrales)
- Culture pop (récompenses, sorties de films, événements mediatiques)
- Meteo (temperatures, ouragans)
```

**Pourquoi Polymarket a explose en 2024** : les marches de prédiction sur les elections américaines de 2024 ont attire une attention massive. Les probabilités affichees par Polymarket se sont revelees plus précises que celles des sondages traditionnels. Cela a donne de la crédibilité au concept et attire des millions de dollars de volume.

---

### Kalshi : l'approche régulée

**Définition** : Kalshi est une plateforme de marches de prédiction fondée en 2018 par Tarek Mansour et Luana Lopes Lara, lancee publiquement en 2021, basée a New York. Contrairement a Polymarket, Kalshi a choisi des le départ une approche régulée : elle est enregistrée auprès de la CFTC (Commodity Futures Trading Commission).

**Chiffres et faits** :

```text
Approche opposee a Polymarket :
- Polymarket : lance d'abord, régulation ensuite (approche crypto classique)
- Kalshi : régulation d'abord, lancement ensuite (approche finance traditionnelle)

Chiffres :
- Volume annualise au pic 2025 : 50 milliards $
  (volume réel cumule 2025 : environ 24 milliards $)
- Plus de 60% de part de marche mondiale
- Serie C de 185 millions $ a 2 milliards $ de valorisation (juin 2025)
- Serie D de 300 millions $ a 5 milliards $ de valorisation (octobre 2025)
- A gagne son proces contre la CFTC pour le droit de lister
  des contrats sur les elections politiques

Domination du marche :
- Kalshi + Polymarket = 97,5% du marche mondial des prédiction markets en 2025
- Les autres acteurs se partagent les 2,5% restants
```

**Comparaison Polymarket vs Kalshi** :

| Critère | Polymarket | Kalshi |
| --- | --- | --- |
| Fondation | 2020 | 2018 (lancement public 2021) |
| Infrastructure | Blockchain (Polygon) | Serveurs centralisés |
| Régulation | CFTC depuis novembre 2025 | CFTC des le lancement |
| Devise de règlement | USDC (stablecoin) | Dollar américain |
| KYC (vérification d'identité) | Oui (depuis la régulation) | Oui |
| Part de marché (2025) | ~35% | ~60% |
| Accès international | Large (historiquement sans KYC) | Principalement États-Unis |

---

### Augur : le pionnier décentralisé

**Définition** : Augur est le premier marché de prédiction décentralisé, dont l'ICO a eu lieu en 2015 sur Ethereum (5,3 millions de dollars leves) et la plateforme a été lancee en 2018. C'est un cas d'école en technologie : être le premier ne garantit pas le succès si l'expérience utilisateur est mauvaise.

**Ce qui s'est passe** :

```text
Chronologie :
- 2015 : ICO de 5,3 millions $
- 2018 : lancement de la plateforme (version 1)
  - Interface complexe et lente
  - Frais de gas Ethereum très élevés
  - Adoption marginale (quelques milliers d'utilisateurs)

- 2020-2021 : lancement d'Augur v2 (Turbo)
  - Tentative d'ameliorer l'UX et de réduire les frais
  - N'a jamais decolle en volume

- 2023-2024 : l'équipe a quitte le projet
  - Le protocole existe toujours on-chain (personne ne peut le supprimer)
  - Volume negligeable (quelques milliers de dollars par mois)
  - Pas de maintenance active

Leçon :
- Augur a prouve que le concept de marche de prédiction décentralisé
  était viable techniquement
- Mais l'UX catastrophique, les frais élevés et l'absence
  d'utilisateurs ont tue l'adoption
- Polymarket a appris de ces erreurs en utilisant Polygon (frais bas)
  et en creant une interface simple
```

---

### Azuro : le protocole de liquidité pour les paris

**Définition** : Azuro est un protocole de liquidité pour les paris décentralisés. Au lieu de créer un marché de prédiction directement, Azuro fournit l'infrastructure (liquidité, odds, règlement) sur laquelle d'autres applications construisent des interfaces. Le modèle est comparable a celui d'Uniswap pour les DEX : un protocole sous-jacent, plusieurs interfaces par-dessus.

**Comment Azuro fonctionne** :

```text
Modèle traditionnel (Polymarket, Kalshi) :
Utilisateur -> Plateforme unique -> Marche

Modèle Azuro :
Utilisateur -> Interface A (site web)  -> Protocole Azuro -> Marche
Utilisateur -> Interface B (app mobile) -> Protocole Azuro -> Marche
Utilisateur -> Interface C (bot Telegram) -> Protocole Azuro -> Marche

Avantages :
- N'importe qui peut construire une interface de paris
- La liquidité est partagée entre toutes les interfaces
- Le règlement est automatique et verifiable on-chain

Limites :
- Volume encore modeste par rapport a Polymarket et Kalshi
- Protocole complexe a comprendre pour les utilisateurs non techniques
```

---

### L'angle critique : information ou gambling ?

**Le débat fondamental** : les marches de prédiction sont-ils un outil d'information qui produit des estimations de probabilité utiles à la société, ou sont-ils une forme de gambling habillée en innovation ?

**Arguments en faveur** :

- Les prix des contrats agreggent l'information de manière efficace
- Les prédictions ont été plus précises que les sondages (elections 2024)
- Les entreprises et les gouvernements pourraient utiliser ces marches pour anticiper des événements
- La régulation (CFTC) leur donne un cadre légal

**Arguments critiques** :

| Problème | Détail |
| --- | --- |
| Taux de perte des retail traders | La majorité des traders individuels perdent de l'argent (les statistiques des brokers CFD/forex europeens, obliges de publier ces chiffres, rapportent des taux de perte de 70 a 80%) |
| Manipulation des marches a faible liquidité | Un seul acteur avec assez de capital peut deplacer le prix d'un contrat peu liquide, donnant une fausse impression de probabilité |
| Limites de la "sagesse des foules" | Les marches de prédiction sous-estiment systematiquement les événements a faible probabilité (cygnes noirs). Un événement estimé a 2% peut se produire bien plus souvent |
| Problèmes régulatoires | Dans de nombreux pays, les marches de prédiction sont consideres comme des jeux d'argent et sont donc illégaux sans licence |
| Biais des participants | Les traders ne sont pas un échantillon representatif de la population. Ils sont majoritairement jeunes, masculins et technophiles |

**Les marches de prédiction en France** : en France, les marches de prédiction avec mise financière sont assimiles a des jeux d'argent en ligne. Seuls les opérateurs autorises par l'ANJ (Autorité Nationale des Jeux) peuvent proposer des paris. Ni Polymarket ni Kalshi ne sont autorises en France à la date de redaction de cette fiche.

**Fait** : la précision des marches de prédiction repose sur un principe simple : quand quelqu'un met de l'argent en jeu, il est incité à être exact plutôt qu'optimiste. Mais cette incitation ne suffit pas toujours. Les marches de prédiction ont donne une probabilité d'environ 25% au Brexit la veille du référendum de 2016. La foule peut se tromper collectivement, surtout quand tout le monde partage les mêmes biais.

---

### Cadre légal : France et Europe

**En France** :

- Polymarket est **geobloquee** par l'ANJ (Autorité Nationale des Jeux) qui considere les marches de prédiction comme des jeux d'argent non autorises
- En droit français, parier de l'argent sur l'issue d'un événement futur rélevé des jeux d'argent et de hasard, règlementes par la loi du 12 mai 2010
- Seuls les paris sportifs, hippiques et le poker en ligne sont autorises (via des opérateurs agrees par l'ANJ)
- Accéder a Polymarket depuis la France via un VPN est techniquement possible mais juridiquement risque

**En Europe** :

- **Aucun cadre unifie** : chaque pays applique ses propres règles
- **Pays-Bas** : Polymarket interdite par la Ksa (autorité des jeux), avec injonction de cessation avant le 17 février 2026
- **Belgique** : Polymarket sur la liste noire de la Commission des Jeux de hasard
- **Portugal** : fermeture ordonnée en 48 heures après 120 millions de dollars de volume sur l'election présidentielle (janvier 2026)
- **Roumanie** : Polymarket blacklistee après les paris sur l'election présidentielle 2025 (600 millions de dollars de volume)
- **Allemagne et Espagne** : accessibles pour le moment, mais sans cadre légal clair

**MiCA et les marches de prédiction** :

- MiCA (entre en vigueur fin 2024) ne couvre pas directement les marches de prédiction en tant que tels
- Mais les plateformes crypto qui les operent doivent se conformer a MiCA (licence CASP - Crypto-Asset Service Provider)
- La question fondamentale reste ouverte : un marché de prédiction est-il un instrument financier (régulé par MiFID), un jeu d'argent (régulé par les autorités nationales des jeux), ou un produit derive (régulé par la CFTC aux USA) ?
- En 2026, aucune jurisprudence européenne ne tranche ce débat

**Kalshi vs Polymarket** :

| Aspect | Kalshi | Polymarket |
| ------ | ------ | ---------- |
| Juridiction | USA (régulée CFTC) | Offshore (Polygon/crypto) |
| KYC obligatoire | Oui | Non (wallet crypto suffit) |
| Accès Europe | Oui (140+ pays depuis octobre 2025, sauf France, UK et quelques autres) | Geobloquee dans plusieurs pays |
| Recours légal | Oui (tribunaux USA) | Non (smart contracts, pas de recours) |

---

## Checklist de Validation

- [ ] Je sais qu'un marché de prédiction permet de parier sur l'issue d'événements futurs
- [ ] Je comprends comment lire le prix d'un contrat (0,65 dollar = 65% de probabilité estimée)
- [ ] Je connais Polymarket (blockchain, 22 milliards de dollars de volume 2025, investi par ICE)
- [ ] Je connais Kalshi (régulée CFTC, 60%+ de part de marche, 50 milliards de dollars annualises)
- [ ] Je sais que Polymarket + Kalshi = 97,5% du marché mondial
- [ ] Je connais l'histoire d'Augur (pionnier décentralisé, échec par UX mauvaise)
- [ ] Je comprends le modèle d'Azuro (protocole de liquidité sous-jacent)
- [ ] Je sais que la majorité des traders retail perdent de l'argent sur ces plateformes (70-80% selon les brokers europeens)
- [ ] Je comprends les limites de la "sagesse des foules" (cygnes noirs, biais partages)
- [ ] Je sais que les marches de prédiction ne sont pas autorises en France (assimiles a des jeux d'argent)
- [ ] Je connais le cadre légal en France (ANJ, loi du 12 mai 2010) et en Europe (pas de cadre unifie, MiCA ne couvre pas directement les marches de prédiction)

---

## Navigation

← Fiche précédente : **[Staking en pratique : rendements, risques et réalités](06-staking-en-pratique.md)**

→ Fiche suivante : **[Gambling crypto : l'industrie qui ne dit pas son nom](08-gambling-crypto.md)**
