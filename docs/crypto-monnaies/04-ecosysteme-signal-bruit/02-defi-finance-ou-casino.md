---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "DeFi : les mécanismes réels de la finance décentralisée, ses innovations et ses risques"
estimated_time: "60 min"
fiche_number: 2
total_fiches: 9
cursus: "Phase 4 - L'écosystème crypto"
---

# 02 - DeFi : finance décentralisée ou casino décentralisé

> **En bref** : Comprendre les mécanismes réels de la finance décentralisée (DEX, lending, yield farming), identifier d'où vient le rendement et évaluer factuellement les risques. Lecture estimée : 60 min.

## Prérequis

- [Fiche 01 - Taxonomie des tokens](01-taxonomie-tokens.md)
- Comprendre ce qu'est un smart contract et comment il s'exécute
- Connaître la différence entre coin et token

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le fonctionnement des principaux protocoles DeFi (DEX, lending, yield farming), calculer un impermanent loss, identifier la source d'un rendement et évaluer les risques réels de la finance décentralisée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce que la DeFi ?

**Définition** : DeFi (Decentralized Finance) désigne l'ensemble des services financiers (échange, prêt, emprunt, assurance) fonctionnant via des smart contracts sur une blockchain, sans intermédiaire humain.

**Le problème que la DeFi résout** :

Sans DeFi, les services financiers nécessitent des intermédiaires :

1. **Accès restreint** : ouvrir un compte bancaire, obtenir un prêt ou investir nécessite des vérifications, des revenus minimums et parfois la bonne nationalite
2. **Horaires limites** : les banques ferment le soir, les bourses ferment le week-end
3. **Opacite** : tu ne sais pas ce que la banque fait avec ton argent
4. **Frais d'intermediation** : chaque intermédiaire prend une commission

**Comment la DeFi résout ces problèmes** :

| Problème | Solution DeFi |
| --- | --- |
| Accès restreint | N'importe qui avec un wallet peut interagir avec les protocoles |
| Horaires limites | Les smart contracts fonctionnent 24h/24, 7j/7 |
| Opacite | Le code source est public, les transactions sont visibles |
| Frais d'intermediation | Pas d'intermédiaire humain (mais des frais de gas et de protocole existent) |

**Analogie concrète** : imagine un distributeur automatique de billets qui ne dépend d'aucune banque. Il fonctionne tout seul, 24h/24, et n'importe qui peut l'utiliser. La DeFi, c'est ce distributeur appliqué à tous les services financiers : échange, prêt, emprunt.

**Ce que la DeFi n'est PAS** :

- La DeFi n'est pas gratuite. Les frais de gas sur Ethereum peuvent être très élevés (parfois plus de 50 dollars pour une transaction). Les protocoles prennent aussi une commission.
- La DeFi n'est pas sans risque. L'absence d'intermédiaire signifie aussi l'absence de recours en cas de problème. Si un smart contract à un bug et que tu perds tes fonds, personne ne te rembourséra.
- La DeFi n'est pas toujours décentralisée. Certains protocoles ont des clés d'administration qui permettent à l'équipe de modifier les règles ou de geler des fonds.

**La métrique clé : TVL (Total Value Locked)**

La TVL représente la valeur totale des crypto-monnaies déposées dans les smart contracts d'un protocole DeFi. C'est la métrique la plus utilisée pour mesurer l'adoption de la DeFi.

| Precision sur la TVL | Explication |
| --- | --- |
| Ce que la TVL mesure | Le montant total depose dans les smart contracts d'un protocole |
| Ce que la TVL ne mesure pas | La rentabilité, la sécurité ou la qualité du protocole |
| Piège courant | Comparer la TVL DeFi au bilan d'une banque (les deux mesurent des choses différentes) |

---

### DEX : les échanges décentralisés

**Définition** : Un DEX (Decentralized Exchange) est un protocole qui permet d'échanger des tokens directement entre utilisateurs, sans intermédiaire centralisé. Le plus connu est Uniswap.

**Comment fonctionne un DEX a AMM (Automated Market Maker)** :

Contrairement à une bourse traditionnelle ou des acheteurs et vendeurs placent des ordres, un DEX a AMM utilise des pools de liquidité.

```text
Pool de liquidité ETH/USDC :

Un pool contient deux tokens en réserve :
- 100 ETH
- 200 000 USDC

Le prix est détermine par le ratio entre les deux :
200 000 / 100 = 1 ETH vaut 2 000 USDC

Formule de base (Uniswap v2) :
x * y = k (produit constant)
100 * 200 000 = 20 000 000

Si tu achetes 1 ETH :
- Le pool passe a 99 ETH et 202 020 USDC (pour maintenir k)
- Le prix de ton ETH : 2 020 USDC (et non 2 000)
- La difference (20 USDC) est le "slippage" - le prix a bouge parce que tu as modifie le ratio
```

**Qui fournit la liquidité ?**

Des utilisateurs appelés "liquidity providers" (LP) deposent des paires de tokens dans le pool. En échange, ils reçoivent une part des frais de trading (généralement 0,3% par transaction sur Uniswap v2).

**Comparaison DEX vs exchange centralisé** :

| Critère | DEX (Uniswap) | Exchange centralisé (Binance, Coinbase) |
| --- | --- | --- |
| Contrôle des fonds | Tu gardes le contrôle (ton wallet) | L'exchange détient tes fonds |
| KYC (vérification d'identité) | Aucun | Obligatoire |
| Liquidité | Variable selon les pools | Généralement plus élevée |
| Frais | Gas + frais de protocole | Frais de trading (souvent 0,1%) |
| Recours en cas de problème | Aucun | Support client (variable) |
| Risque | Bug de smart contract, slippage | Faillite de l'exchange (FTX), gel de compte |

---

### Lending et borrowing : prêt et emprunt décentralisés

**Définition** : Les protocoles de lending (prêt) et borrowing (emprunt) permettent de prêter ses crypto-monnaies pour gagner des intérêts, ou d'emprunter des crypto-monnaies en déposant un collatéral (garantie).

**Comment ca fonctionne (exemple avec Aave)** :

```text
PRET :
1. Alice depose 10 000 USDC dans le protocole Aave
2. Le protocole prete ces USDC a des emprunteurs
3. Alice reçoit des intérêts (taux variable, par exemple 3% par an)

EMPRUNT :
1. Bob veut emprunter 5 000 USDC
2. Il doit déposer un colateral supérieur à l'emprunt (surcolateralisation)
3. Il depose 4 ETH (valeur : 8 000 $) pour emprunter 5 000 USDC
4. Ratio de colateralisation : 8 000 / 5 000 = 160%
5. Bob paie des intérêts sur son emprunt
```

**Pourquoi la surcollatéralisation ?**

| Question | Réponse |
| --- | --- |
| Pourquoi déposer 8 000 dollars pour emprunter 5 000 dollars ? | Parce qu'il n'y a pas de vérification d'identité ni de recours légal. Le collatéral est la seule garantie |
| Que se passe-t-il si le collatéral baisse ? | Si le ratio descend sous le seuil (par exemple 130%), le collatéral est liquide automatiquement |
| Qui a intérêt a emprunter dans ces conditions ? | Des traders qui veulent garder leur exposition a ETH tout en obtenant de la liquidité, ou des stratégies fiscales (emprunter n'est pas un événement taxable) |

**Liquidation en cascade** :

```text
Scénario :
1. Le prix d'ETH chute de 2 000 $ a 1 500 $ en quelques heures
2. Des milliers d'emprunteurs voient leur ratio de colateralisation passer
   sous le seuil
3. Leurs positions sont liquidees automatiquement (ETH vendu pour remboursér)
4. Ces ventes massives font baisser encore plus le prix d'ETH
5. Ce qui déclenche de nouvelles liquidations
6. Effet domino : les liquidations alimentent la baisse qui alimente
   les liquidations
```

C'est exactement ce qui s'est passe lors de plusieurs crashs crypto.

---

### Yield farming : fournir de la liquidité en échange de récompenses

**Définition** : Le yield farming consiste à déposer des crypto-monnaies dans un protocole DeFi pour obtenir un rendement. Ce rendement peut venir des frais de trading, des intérêts de prêt ou de tokens de récompense distribués par le protocole.

**D'ou vient le rendement ?**

C'est LA question a poser systematiquement. Voici les sources possibles :

| Source de rendement | Mécanisme | Durabilite |
| --- | --- | --- |
| Frais de trading (DEX) | Les traders paient des frais, redistribués aux LP | Durable tant qu'il y a du volume |
| Intérêts d'emprunt (lending) | Les emprunteurs paient des intérêts | Durable tant qu'il y a de la demandé d'emprunt |
| Tokens de récompense (incentives) | Le protocole distribue ses propres tokens aux utilisateurs | Non durable - les tokens distribués sont vendus, le prix baisse, les rendements baissent |
| Source inconnue ou vague | "Rendement généré par l'écosystème" | Si tu ne peux pas identifier la source du rendement, tu ES le rendement |

**La règle d'or** : si un protocole offre 50% de rendement annuel et que tu ne comprends pas d'où vient l'argent, c'est que l'argent vient des nouveaux déposants. C'est la définition d'un schéma de Ponzi.

**Comparaison des rendements (ordres de grandeur)** :

| Investissement | Rendement annuel typique | Risque |
| --- | --- | --- |
| Livret A (France, 2024) | 3% | Garanti par l'État |
| Obligations d'État (10 ans) | 3-4% | Très faible |
| Actions (indice mondial, historique) | 7-10% | Moyen (volatilité) |
| Lending DeFi (stablecoins) | 2-8% | Smart contract, depegging, protocole |
| Liquidity providing (paire stable) | 5-15% | Smart contract, impermanent loss |
| Yield farming (incentives) | 20-1000%+ | Tous les risques DeFi + effondrement des récompenses |

**Analyse critique** : quand un protocole DeFi offre 200% de rendement, pose-toi la question : pourquoi un rendement 20 fois supérieur au marché actions ? La réponse est toujours le risque. Le marché ne fait pas de cadeaux.

---

### Impermanent loss : le coût caché du liquidity providing

**Définition** : L'impermanent loss (perte impermanente) est la différence entre la valeur de tes tokens dans un pool de liquidité et la valeur qu'ils auraient eue si tu les avais juste gardes dans ton wallet.

**Exemple chiffre** :

```text
Situation initiale :
- Tu déposés 1 ETH + 2 000 USDC dans un pool Uniswap
- Valeur totale : 4 000 $ (1 ETH a 2 000 $ + 2 000 USDC)

Le prix d'ETH double a 4 000 $ :

OPTION A - Tu avais garde tes tokens dans ton wallet :
- 1 ETH = 4 000 $
- 2 000 USDC = 2 000 $
- Total : 6 000 $

OPTION B - Tes tokens sont dans le pool :
- Le pool se reequilibre automatiquement (formule x * y = k)
- Tu as maintenant environ 0,707 ETH + 2 828 USDC
- 0,707 ETH a 4 000 $ = 2 828 $
- 2 828 USDC = 2 828 $
- Total : 5 656 $

Impermanent loss : 6 000 $ - 5 656 $ = 344 $ (soit 5,7%)

Tu as gagne de l'argent (5 656 $ vs 4 000 $ initiaux) mais tu aurais
gagne PLUS en ne faisant rien (6 000 $).
```

**Pourquoi "impermanente" ?**

La perte est dite "impermanente" parce que si le prix revient a son niveau initial, la perte disparaît. Mais si tu retires ta liquidité à un prix différent de l'entrée, la perte devient permanente.

**Impermanent loss en fonction de la variation de prix** :

| Variation de prix du token | Impermanent loss |
| --- | --- |
| 0% (prix stable) | 0% |
| 25% de hausse ou baisse | 0,6% |
| 50% de hausse ou baisse | 2,0% |
| 100% de hausse (prix double) | 5,7% |
| 200% de hausse (prix triple) | 13,4% |
| 500% de hausse (prix x6) | 30,0% |

**Conclusion** : pour que le liquidity providing soit rentable, les frais de trading recus doivent être supérieurs à l'impermanent loss. C'est souvent le cas pour les paires stables (USDC/USDT), rarement pour les paires volatiles (ETH/même token).

---

### Les risques réels de la DeFi

**Définition** : La DeFi cumule des risques spécifiques qui n'existent pas dans la finance traditionnelle. Chaque risque doit être compris avant toute interaction.

**Tableau des risques** :

| Risque | Description | Probabilité | Conséquence |
| --- | --- | --- | --- |
| Bug de smart contract | Le code contient une erreur exploitable | Moderee (même les audits ne garantissent pas l'absence de bugs) | Perte totale des fonds du protocole |
| Rug pull | L'équipe retire la liquidité et disparaît | Élevée sur les petits projets | Perte totale |
| Oracle manipulation | Un attaquant fausse les données de prix | Moderee | Liquidations injustifiees, vol de fonds |
| Impermanent loss | La variation de prix cause une perte pour les LP | Certaine (des que le prix bouge) | Perte partielle |
| Liquidation en cascade | Chute de prix declenchant des liquidations en domino | Periodique (a chaque crash) | Pertes amplifiees pour les emprunteurs |
| Exploit de composabilité | Un protocole interagit avec un autre de manière imprevue | Moderee | Perte totale via effet de contagion |
| Risque réglementaire | Un régulateur bloque ou sanctionne un protocole | Croissante | Gel de fonds, interdiction |

**Quelques hacks DeFi majeurs** :

| Protocole | Date | Montant perdu | Cause |
| --- | --- | --- | --- |
| The DAO | Juin 2016 | 60 millions de dollars | Reentrancy (bug de smart contract) |
| Poly Network | Août 2021 | 611 millions de dollars (totalité restituee par le hacker dans les 15 jours - cas unique) | Exploit de smart contract |
| Ronin (Axie Infinity) | Mars 2022 | 625 millions de dollars | Clés privées compromises |
| Wormhole | Février 2022 | 320 millions de dollars | Bug dans le pont cross-chain |
| Euler Finance | Mars 2023 | 197 millions de dollars | Exploit de smart contract |

**Fait** : des milliards de dollars ont été volés dans la DeFi. Aucun des utilisateurs affectés n'a été remboursé par une assurance publique. Certains protocoles ont négocié le retour partiel des fonds avec les hackers.

---

### Composabilite : les "money legos" de la DeFi

**Définition** : La composabilité est la capacité des protocoles DeFi a interagir entre eux sans permission. Chaque protocole est un "lego" que l'on peut emboîter avec d'autres pour créer des stratégies financières complexes.

**Exemple concret d'emboitement** :

```text
Étape 1 : Deposer 10 ETH dans Aave (protocole de lending)
   -> Tu reçois 10 aETH (token qui représente ton dépôt)

Étape 2 : Utiliser les 10 aETH comme liquidité sur Curve (DEX)
   -> Tu reçois des LP tokens Curve

Étape 3 : Staker les LP tokens Curve sur Convex (optimiseur de rendement)
   -> Tu reçois des récompenses en CRV et CVX

Résultat : ton ETH initial génère des intérêts sur Aave,
des frais de trading sur Curve, et des récompenses sur Convex.
Le tout simultanement.
```

**Avantage** : n'importe quel développeur peut construire un nouveau protocole qui interagit avec les protocoles existants, sans demander la permission a personne. C'est de l'innovation sans autorisation.

**Risque : l'effet domino** :

La composabilité créé des dépendances en chaîne. Si un maillon casse, toute la chaîne s'effondre :

| Scénario | Conséquence |
| --- | --- |
| Bug dans Aave | Les aETH perdent leur valeur, les pools Curve qui les utilisent deviennent insolvables, Convex perd les récompenses |
| Un stablecoin perd son ancrage | Tous les pools qui contiennent ce stablecoin sont affectés, les protocoles de lending qui l'acceptent comme collatéral subissent des liquidations massives |
| Un oracle donne un prix errone | Les liquidations se declenchent a tort, les arbitrages amplifient l'erreur à travers plusieurs protocoles |

**Fait** : l'effondrement de Terra/UST en mai 2022 a montre cet effet domino en temps réel. La perte de l'ancrage de l'UST a entraine des liquidations en cascade sur des dizaines de protocoles qui utilisaient l'UST, causant des pertes de plus de 40 milliards de dollars en quelques jours.

---

### Flash loans : emprunter des millions pour une transaction

**Définition** : Un flash loan (prêt eclair) est un emprunt sans collatéral qui doit être remboursé dans la même transaction. Si le remboursément n'a pas lieu avant la fin de la transaction, toute l'opération est annulee comme si elle n'avait jamais existe.

**Comment c'est possible** :

```text
Transaction unique (tout se passe dans un seul bloc) :

1. Emprunter 10 millions de USDC sur Aave (0 colateral)
2. Utiliser les 10 millions pour une opération (arbitrage, liquidation...)
3. Récupérer les fonds + profit
4. Rembourser les 10 millions + frais (environ 0,05%)
5. Garder le profit

Si l'étape 4 échoue (pas assez de fonds pour remboursér),
TOUTE la transaction est annulee :
- L'emprunt n'a jamais eu lieu
- L'opération n'a jamais eu lieu
- Le seul coût est les frais de gas de la transaction echouee
```

**Pourquoi c'est uniquement possible en DeFi** : Dans la finance traditionnelle, un emprunt et son remboursément sont deux événements séparés dans le temps. Sur une blockchain, une transaction est atomique : elle réussit entièrement ou échoue entièrement. C'est cette propriété qui permet les flash loans.

**Cas d'usage légitimes** :

| Cas d'usage | Description |
| --- | --- |
| Arbitrage | Exploiter une différence de prix entre deux DEX : acheter moins cher sur un DEX, revendre plus cher sur l'autre, remboursér l'emprunt |
| Liquidation | Emprunter les fonds nécessaires pour liquider une position sous-colateralisee et récupérer le bonus de liquidation |
| Refinancement | Changer de protocole de lending sans avoir a retirer et redeposer manuellement (swap de dette en une transaction) |

**Cas d'usage malveillants** :

| Attaque | Description |
| --- | --- |
| Manipulation d'oracle | Emprunter des millions pour desequilibrer un pool, ce qui fausse le prix lu par un oracle, exploiter le prix errone sur un autre protocole |
| Attaque de gouvernance | Emprunter une quantité massive de tokens de gouvernance, voter sur une proposition qui profite à l'attaquant, remboursér les tokens |

**Fait** : en 2020-2021, des dizaines d'attaques par flash loan ont cause des pertes cumulees de centaines de millions de dollars. Les protocoles ont depuis ameliore leurs protections (oracles décentralisés, verrouillages temporels sur les votes).

---

### Order books vs AMMs : deux modèles de marche

**Définition** : Il existe deux mécanismes fondamentalement différents pour échanger des actifs : le carnet d'ordres (order book) et le market maker automatise (AMM). Le premier est le modèle traditionnel des bourses. Le second est l'innovation des DEX.

**Order book (carnet d'ordres)** :

```text
Acheteurs (bids)          Vendeurs (asks)
---------------------     ---------------------
1,99 $ - 500 tokens       2,01 $ - 300 tokens
1,98 $ - 1 000 tokens     2,02 $ - 800 tokens
1,97 $ - 200 tokens       2,05 $ - 1 500 tokens

Un "matching engine" (moteur d'appariement) connecte
un acheteur et un vendeur quand leurs prix se croisent.

Si quelqu'un veut acheter a 2,01 $, le matching engine
le connecte avec le vendeur a 2,01 $.
```

**AMM (Automated Market Maker)** :

```text
Pas d'ordres individuels. Un pool contient deux tokens.
Le prix est détermine par une formule mathématique.

Pool ETH/USDC :
100 ETH + 200 000 USDC
Formule : x * y = k = 20 000 000

Le prix est le ratio : 200 000 / 100 = 2 000 USDC par ETH

Quand quelqu'un achète, il modifie le ratio,
ce qui modifie automatiquement le prix.
```

**Comparaison des deux modèles** :

| Critère | Order book (Binance, Coinbase) | AMM (Uniswap, Curve) |
| --- | --- | --- |
| Liquidité | Fournie par des market makers professionnels | Fournie par des utilisateurs qui deposent dans les pools |
| Slippage (écart de prix) | Faible sur les paires liquides | Variable, augmente avec la taille de l'ordre |
| Frais | Généralement 0,1% | 0,3% (Uniswap v2), variable (Uniswap v3) |
| Transparence | Ordres visibles mais exécution centralisée | Code source public, exécution on-chain |
| Accessibilite | Nécessite un compte avec vérification d'identité | N'importe qui avec un wallet |
| Risque | Faillite de la plateforme (FTX) | Bug de smart contract, impermanent loss |

**Ce qu'il faut retenir** : les deux modèles ont des forces et des faiblesses. Les order books offrent généralement de meilleurs prix pour les gros ordres. Les AMMs offrent l'accessibilité et la transparence. Certains DEX recents combinent les deux approches.

---

### Wrapped tokens : utiliser Bitcoin dans la DeFi Ethereum

**Définition** : Un wrapped token (token emballe) est une representation d'un actif d'une blockchain sur une autre blockchain. Le plus connu est WBTC (Wrapped Bitcoin) : un token ERC-20 sur Ethereum qui représente du Bitcoin.

**Comment ca fonctionne (WBTC)** :

```text
1. Alice envoie 1 BTC à un custodien (BitGo - une entreprise)
2. Le custodien vérifie la reception du BTC
3. Le custodien autorisé la création de 1 WBTC sur Ethereum
4. Alice reçoit 1 WBTC dans son wallet Ethereum
5. Alice peut utiliser son WBTC dans la DeFi Ethereum
   (Uniswap, Aave, Curve, etc.)

Pour récupérer son BTC :
1. Alice envoie 1 WBTC au contrat de burn
2. Le WBTC est détruit
3. Le custodien libere 1 BTC et l'envoie à Alice
```

**Pourquoi WBTC existe** : Bitcoin ne supporte pas les smart contracts. Ethereum à tout l'écosystème DeFi. WBTC est le pont entre les deux : il permet aux détenteurs de Bitcoin d'accéder aux services DeFi d'Ethereum sans vendre leur BTC.

**Changement de garde en 2024** : Historiquement, BitGo était le custodien unique de WBTC. En août 2024, la custody a changé de mains, ce qui a déclenché une controverse sur la centralisation :

- BitGo a transféré la custody vers une coentreprise (BitGo / BiT Global) dont une partie est liée à Justin Sun (fondateur de Tron), avec une répartition des clés entre les États-Unis, Singapour et Hong Kong.
- MakerDAO a retiré WBTC du collatéral de son stablecoin DAI.
- Coinbase a délisté WBTC en décembre 2024.

Cet épisode illustre que la confiance dans un wrapped token dépend entièrement de qui contrôle les clés - une information qui peut changer du jour au lendemain.

**Le cas particulier de WETH** :

ETH natif n'est pas un token ERC-20 (il existait avant le standard ERC-20). Certains smart contracts exigent des tokens ERC-20 en entrée. WETH (Wrapped Ether) est une version ERC-20 de l'ETH : tu déposes 1 ETH, tu reçois 1 WETH. Le WETH est toujours echangeable 1:1 contre de l'ETH.

**Les risques des wrapped tokens** :

| Risque | Description |
| --- | --- |
| Centralisation | WBTC dépend de ses custodiens (coentreprise BitGo / BiT Global depuis 2024). Si un custodien fait faillite, est pirate ou gele les fonds, les WBTC perdent leur garantie |
| Risque de depeg | Si la confiance dans le custodien diminue, le WBTC peut se decaler du prix du BTC (valoir moins que 1 BTC) |
| Risque de smart contract | Le contrat qui gère le mint et le burn de WBTC peut contenir des bugs |
| Risque réglementaire | Un régulateur pourrait exiger le gel des BTC detenus par le custodien |

**Fait** : les wrapped tokens représentent des dizaines de milliards de dollars de valeur verrouillée. WBTC seul détient plus de 100 000 BTC. C'est un rouage essentiel de la DeFi, mais aussi un point de centralisation dans un écosystème qui se veut décentralisé.

---

## Checklist de Validation

- [ ] Je sais que la DeFi désigne les services financiers fonctionnant via des smart contracts, sans intermédiaire humain
- [ ] Je comprends comment fonctionne un DEX a AMM (pools de liquidité, formule x * y = k)
- [ ] Je sais que la surcollatéralisation est obligatoire dans le lending défi parce qu'il n'y a pas de recours légal
- [ ] Je comprends le mécanisme des liquidations en cascade
- [ ] Je sais calculer un impermanent loss sur un exemple simple
- [ ] Je connais les différentes sources de rendement en DeFi (frais, intérêts, incentives)
- [ ] Je sais appliquer la règle : "si tu ne peux pas identifier la source du rendement, tu ES le rendement"
- [ ] Je connais les principaux risques de la DeFi (bugs, rug pulls, oracles, liquidations)
- [ ] Je sais que des milliards de dollars ont été volés dans la DeFi et qu'aucune assurance publique ne couvre ces pertes

---

## Navigation

← Fiche précédente : **[Taxonomie des tokens](01-taxonomie-tokens.md)**

→ Fiche suivante : **[NFTs : la technologie vs la spéculation](03-nfts-technologie-vs-speculation.md)**
