---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Stablecoins : les différents mécanismes de stabilisation, utilité réelle et risques"
estimated_time: "35 min"
fiche_number: 5
total_fiches: 9
cursus: "Phase 4 - L'écosystème crypto"
---

# 05 - Stablecoins : l'innovation la plus utile du secteur

> **En bref** : Comprendre les trois types de stablecoins (fiat-backed, crypto-backed, algorithmique), analyser l'effondrement de Terra/Luna, évaluer l'utilité réelle et les risques de chaque mécanisme. Lecture estimée : 35 min.

## Prérequis

- [Fiche 01 - Taxonomie des tokens](01-taxonomie-tokens.md)
- [Fiche 02 - DeFi : finance décentralisée ou casino décentralisé](02-defi-finance-ou-casino.md)
- [Fiche 03 - NFTs : la technologie vs la spéculation](03-nfts-technologie-vs-speculation.md)
- [Fiche 04 - DAOs : gouvernance décentralisée en pratique](04-daos-gouvernance-decentralisee.md)
- Comprendre ce qu'est un token et un smart contract

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les trois mécanismes de stabilisation des stablecoins, décrire l'effondrement de Terra/Luna et ses causes, évaluer les risques spécifiques de chaque type de stablecoin et identifier les cas d'usage où les stablecoins apportent une utilité réelle.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce qu'un stablecoin ?

**Définition** : Un stablecoin est un token dont le prix est conçu pour rester stable par rapport à un actif de référence, généralement le dollar américain. L'objectif est que 1 stablecoin = 1 dollar à tout moment.

**Le problème que les stablecoins résolvent** :

Sans stablecoins, l'écosystème crypto rencontre ces problèmes :

1. **Volatilité** : le Bitcoin peut perdre 20% en une journee, ce qui le rend inutilisable comme moyen de paiement
2. **Sortie vers le fiat coûteuse** : convertir des crypto en euros ou dollars passe par un exchange, nécessite un KYC, prend du temps et coûte des frais
3. **Transferts internationaux** : envoyer des dollars de la France aux Philippines coûte cher (frais bancaires, frais Western Union de 5-10%) et prend 1 a 5 jours

**Comment les stablecoins résolvent ces problèmes** :

| Problème | Solution apportée par les stablecoins |
| --- | --- |
| Volatilité | Le prix reste (en théorie) à 1 dollar |
| Sortie vers le fiat coûteuse | Echanger une crypto contre un stablecoin est instantané et peu coûteux |
| Transferts internationaux | Envoyer des USDC coûte quelques centimes et prend quelques secondes |

**Analogie concrète** : un stablecoin, c'est comme un jeton de casino qui vaut toujours 1 euro. Tu peux l'échanger contre n'importe quel jeu (token crypto) dans le casino, et quand tu veux partir, tu le reconvertis en euros. Le jeton ne fluctue pas en valeur - 1 jeton = 1 euro, toujours.

**Ce qu'un stablecoin n'est PAS** :

- Un stablecoin n'est pas un dollar. C'est un token qui essaie de maintenir un prix égal à 1 dollar. La différence est fondamentale : un dollar est garanti par l'État américain, un stablecoin est garanti par le mécanisme de son émetteur.
- Un stablecoin n'est pas sans risque. Le mécanisme de stabilisation peut échouer (voir la section sur Terra/Luna).

---

### Type 1 : stablecoins adosses a des réserves fiat (fiat-backed)

**Définition** : Un stablecoin fiat-backed est émis par une entreprise qui détient des réserves en monnaie fiduciaire (dollars, euros) ou en actifs équivalents (bons du Trésor). Pour chaque stablecoin émis, l'entreprise est censee detenir 1 dollar en réserve.

**USDT (Tether)** :

| Aspect | Détail |
| --- | --- |
| Émetteur | Tether Limited (enregistrée aux Iles Vierges britanniques) |
| Capitalisation | > 100 milliards de dollars (le plus gros stablecoin) |
| Réserves déclarées | Dollars, bons du Trésor US, prêts, autres investissements |
| Audits | Attestations trimestrielles (pas des audits complets) |
| Controverse | Amendes de la CFTC (41 millions de dollars) pour declarations trompeuses sur les réserves. Pendant des années, Tether affirmait que chaque USDT était adosse a 1 dollar en banque. En réalité, les réserves comprenaient des prêts, du papier commercial et d'autres actifs moins liquides. |

**USDC (Circle)** :

| Aspect | Détail |
| --- | --- |
| Émetteur | Circle (entreprise américaine) |
| Capitalisation | > 30 milliards de dollars |
| Réserves déclarées | Dollars et bons du Trésor US a court terme |
| Audits | Attestations mensuelles par un cabinet comptable (Deloitte) |
| Incident notable | En mars 2023, USDC a brièvement perdu son peg (tombe a 0,87 dollar) car 3,3 milliards de dollars de réserves étaient déposés chez Silicon Valley Bank, qui a fait faillite. Le peg a été rétabli après l'intervention du gouvernement américain pour garantir les dépôts de SVB. |

**Comparaison USDT vs USDC** :

| Critère | USDT (Tether) | USDC (Circle) |
| --- | --- | --- |
| Transparence | Faible (attestations, pas d'audit complet) | Moderee (attestations mensuelles) |
| Juridiction | Iles Vierges britanniques | États-Unis |
| Historique de controverses | Plusieurs amendes et doutes persistants | Incident SVB en 2023 |
| Adoption | Plus large (dominance sur le marche) | Forte, surtout dans la DeFi |
| Réserves | Mix d'actifs (bons du Trésor, prêts, etc.) | Principalement bons du Trésor US |

**Le risque fondamental des stablecoins fiat-backed** : tu fais confiance à une entreprise privée pour detenir les réserves. Si l'entreprise ment sur ses réserves, fait faillite ou est sanctionnee par un régulateur, le stablecoin peut perdre son peg.

---

### Type 2 : stablecoins crypto-backed (surcolateralises)

**Définition** : Un stablecoin crypto-backed est garanti par des crypto-monnaies déposées dans un smart contract. Comme les crypto-monnaies sont volatiles, le collatéral doit être supérieur à la valeur du stablecoin émis (surcollatéralisation).

**DAI (MakerDAO)** :

```text
Fonctionnement :
1. Alice veut créer 1 000 DAI (1 000 $)
2. Elle depose 2 000 $ d'ETH dans un smart contract MakerDAO
   (ratio de colateralisation : 200%)
3. Le smart contract crée 1 000 DAI et les envoie à Alice
4. Pour récupérer ses ETH, Alice doit remboursér les 1 000 DAI + des frais

Si le prix d'ETH baisse :
- Si le ratio descend sous 150%, la position d'Alice est liquidee
  automatiquement
- Le smart contract vend les ETH pour remboursér les DAI

Pourquoi ca fonctionne :
- Le colateral est toujours supérieur à la valeur des DAI en circulation
- Si le colateral baisse, les liquidations automatiques protègent le système
- Le code est public et verifiable
```

**Avantages et inconvénients du crypto-backed** :

| Avantage | Inconvénient |
| --- | --- |
| Décentralisé (pas d'entreprise a qui faire confiance) | Nécessite une surcollatéralisation (capital inefficient) |
| Transparent (code et réserves vérifiables on-chain) | Risque de liquidation si le marché chute brutalement |
| Resistant à la censure | Plus complexe a comprendre et a utiliser |
| Gouverne par une DAO (MakerDAO) | Les paramètrès de risque dépendent des décisions de la DAO |

---

### Type 3 : stablecoins algorithmiques

**Définition** : Un stablecoin algorithmique maintient son peg via un mécanisme automatique d'ajustement de l'offre, sans réserves fiat ni surcollatéralisation crypto. Quand le prix monte au-dessus de 1 dollar, le protocole créé plus de tokens (augmente l'offre). Quand le prix descend sous 1 dollar, le protocole retire des tokens (réduit l'offre).

**Le mécanisme typique (simplifie)** :

```text
Si le stablecoin vaut 1,02 $ (au-dessus du peg) :
- Le protocole crée de nouveaux tokens
- Plus d'offre = le prix baisse vers 1 $

Si le stablecoin vaut 0,98 $ (en dessous du peg) :
- Le protocole incite les utilisateurs a brûler (détruire) des tokens
- Moins d'offre = le prix remonte vers 1 $
- L'incitation : les utilisateurs reçoivent un autre token en échange

Le problème : ce mécanisme repose sur la confiance des utilisateurs.
Si les utilisateurs perdent confiance et refusent de brûler leurs
tokens, le prix continue de chuter. C'est une spirale mortelle.
```

**Pourquoi les stablecoins algorithmiques purs sont fragiles** :

| Situation | Stablecoin fiat-backed | Stablecoin algorithmique |
| --- | --- | --- |
| Panique des utilisateurs | Les réserves sont la - chaque token est convertible | Si tout le monde vend en même temps, le mécanisme s'effondre |
| Chute du marché crypto | Les réserves fiat ne sont pas affectees | Le token secondaire chute, le mécanisme perd sa contrepartie |
| Perte de confiance | L'émetteur peut prouver les réserves (audit) | Aucune réserve a montrer - la confiance est le seul soutien |

---

### L'effondrement de Terra/Luna (mai 2022)

**Définition** : Terra (UST) était un stablecoin algorithmique adosse à un token secondaire, Luna. En mai 2022, l'effondrement de ce système a cause la perte de plus de 40 milliards de dollars en quelques jours.

**Comment fonctionnait Terra/UST** :

```text
Le mécanisme :
- Pour créer 1 UST (1 $), tu brûlais 1 $ de LUNA
- Pour détruire 1 UST, tu recevais 1 $ de LUNA
- Ce mécanisme d'arbitrage maintenait le peg :
  - UST > 1 $ ? Bruler LUNA pour créer des UST (vendre UST, profit)
  - UST < 1 $ ? Bruler UST pour créer des LUNA (vendre LUNA, profit)

L'appat :
- Le protocole Anchor offrait 20% de rendement annuel sur les dépôts UST
- D'ou venait ce rendement ? Principalement des réserves de la fondation
  Terra (pas d'un mécanisme économique durable)
- Plus de 70% de tous les UST étaient déposés dans Anchor
  (dépendance extrême)
```

**La spirale mortelle (chronologie)** :

```text
7 mai 2022 :
- De gros retraits d'UST provoquent un léger depegging (0,98 $)

8 mai 2022 :
- La panique commence. Les utilisateurs retirent massivement
  d'Anchor
- Pour récupérer leur argent, ils brulent des UST contre du LUNA
- L'afflux de LUNA fait chuter son prix

9 mai 2022 :
- UST tombe a 0,70 $
- LUNA chute de 80 $ a 30 $
- La spirale s'accelere : plus d'UST sont brules, plus de LUNA
  sont créés, plus le prix de LUNA chute

10-12 mai 2022 :
- UST tombe a 0,10 $
- LUNA passe de 30 $ a moins de 0,001 $
- L'offre de LUNA explose (de 350 millions a 6 500 milliards de tokens)
- 40 milliards $ de capitalisation s'evaporent

Après :
- Do Kwon (fondateur) est arrête au Montenegro en mars 2023
- Extrade aux États-Unis, il plaide coupable en août 2025
  (conspiracy et wire fraud)
- Condamne a 15 ans de prison le 11 décembre 2025, avec
  confiscation de plus de 19 millions $
- Le juge a qualifie l'affaire de "fraude d'une ampleur
  generationnelle"
- Des dizaines de milliers de personnes ont perdu leurs économies
```

**Pourquoi c'était previsible** :

| Signal d'alerte | Ce que ca signifiait |
| --- | --- |
| 20% de rendement "stable" | Un rendement 5 fois supérieur au marché sans risque n'existe pas |
| 70% des UST dans un seul protocole (Anchor) | Dépendance extrême à une seule source de demandé |
| Le mécanisme reposait sur la confiance | Aucune réserve réelle - si la confiance disparaît, tout s'effondre |
| Le fondateur qualifiait les critiques de "pauvres" | Manque de rigueur et arrogance face aux risques identifies |

**Leçon** : un stablecoin algorithmique pur, sans réserves réelles, est un système fragile. La stabilité ne peut pas reposer uniquement sur un mécanisme d'arbitrage quand la confiance disparaît.

---

### L'utilité réelle des stablecoins

**Définition** : Au-delà de la spéculation crypto, les stablecoins résolvent des problèmes concrets pour des millions de personnes dans le monde.

**Cas d'usage avec utilité demontree** :

| Cas d'usage | Problème résolu | Exemple concret |
| --- | --- | --- |
| Transferts internationaux | Les virements bancaires internationaux coûtent 5-10% et prennent des jours | Envoyer 1 000 dollars en USDC des États-Unis aux Philippines coûte quelques centimes et prend quelques minutes |
| Accès au dollar | Dans certains pays (Argentine, Nigeria, Turquie), la monnaie locale perd rapidement sa valeur | Les habitants achètent des USDT pour protéger leur pouvoir d'achat |
| Commerce défi | Les traders ont besoin d'un actif stable pour entrer et sortir de positions | Les stablecoins sont la paire de trading la plus utilisée |
| Salaires en crypto | Certaines entreprises paient des fréelances internationaux en crypto | Un paiement en USDC est plus simple qu'un virement Swift |

**Chiffres de perspective** :

```text
Volume de transfert des stablecoins :
- En 2023, les stablecoins ont traite plus de transferts de valeur
  que Visa sur une base annuelle
- USDT est particulierement utilise en Asie et dans les pays emergents
- Les stablecoins représentent plus de 50% du volume de trading crypto

Mais attention :
- Une grande partie du volume est du trading spéculatif, pas de
  l'utilisation réelle
- Les chiffres de volume brut incluent les robots de trading et
  l'arbitrage automatise
- L'utilisation "réelle" (transferts, paiements) est difficile a
  isoler dans les statistiques
```

---

### Les risques des stablecoins

**Définition** : Chaque type de stablecoin porte des risques spécifiques qu'il faut connaître.

**Risque 1 : le depegging**

Le depegging, c'est quand le stablecoin perd son ancrage à 1 dollar. Quelques episodes historiques :

| Stablecoin | Date | Depeg | Cause | Retablissement |
| --- | --- | --- | --- | --- |
| USDC | Mars 2023 | 0,87 dollar | Faillite de SVB (3,3 Mds de dollars de réserves chez SVB) | Oui (gouvernement US a garanti les dépôts) |
| UST (Terra) | Mai 2022 | 0,00 dollar | Spirale mortelle algorithmique | Non (perte totale) |
| USDT | Plusieurs episodes | 0,95-0,98 dollar | Craintes sur les réserves | Oui (retour au peg en quelques heures/jours) |
| DAI | Mars 2020 | 1,10 dollar | Crash du marche, liquidations massives | Oui (ajout de USDC comme collatéral) |

**Risque 2 : le risque de réserves**

Pour les stablecoins fiat-backed, les réserves sont la clé. Si l'émetteur n'a pas réellement les réserves annoncees, le stablecoin est une bombe a retardement.

**Risque 3 : le risque réglementaire**

| Réglementation | Impact |
| --- | --- |
| MiCA (Europe) | EMT/ART : application depuis le 30 juin 2024 ; le reste de MiCA depuis le 30 décembre 2024. Vérifie le registre CASP ESMA/AMF plutôt qu'une formule figée sur Tether. |
| Réglementation US (en discussion) | Plusieurs projets de loi visent a encadrer les stablecoins, imposer des audits et des réserves |
| Sanctions internationales | Les émetteurs de stablecoins peuvent geler les fonds des adresses sanctionnees (Tether et Circle l'ont déjà fait) |

**Un point rarement mentionne** : la capacité de geler des fonds signifie que les stablecoins fiat-backed ne sont pas resistants à la censure. L'émetteur peut bloquer n'importe quelle adresse sur demandé des autorités. C'est une différence fondamentale avec le Bitcoin.

---

## Checklist de Validation

- [ ] Je sais qu'un stablecoin est un token dont le prix est conçu pour rester à 1 dollar
- [ ] Je connais les 3 types : fiat-backed (USDT, USDC), crypto-backed (DAI), algorithmique (ex-UST)
- [ ] Je comprends la différence de transparence entre USDT et USDC
- [ ] Je sais expliquer le mécanisme de surcollatéralisation de DAI
- [ ] Je peux raconter l'effondrement de Terra/Luna et expliquer pourquoi il était previsible
- [ ] Je comprends pourquoi un rendement de 20% "garanti" est un signal d'alerte
- [ ] Je connais les cas d'usage réels des stablecoins (transferts internationaux, accès au dollar)
- [ ] Je connais les 3 types de risques : depegging, réserves, réglementaire
- [ ] Je sais que les émetteurs de stablecoins fiat-backed peuvent geler des fonds
- [ ] Je comprends l'impact de MiCA sur les stablecoins en Europe

---

## Navigation

← Fiche précédente : **[DAOs : gouvernance décentralisée en pratique](04-daos-gouvernance-decentralisee.md)**

→ Fiche suivante : **[Staking en pratique : rendements, risques et réalités](06-staking-en-pratique.md)**
