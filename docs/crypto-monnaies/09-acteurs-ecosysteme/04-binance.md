---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Binance : croissance fulgurante, BNB, BNB Smart Chain, controverses majeures et amende DOJ de 4,3 milliards $"
estimated_time: "45 min"
fiche_number: 4
total_fiches: 8
cursus: "Phase 9 - Acteurs de l'écosystème"
---

# 04 - Binance : le géant controverse

> **En bref** : Comprendre l'ascension fulgurante de Binance, son écosystème (BNB, BSC), ses controverses majeures (absence de siege, amende DOJ, demission de CZ) et les questions que pose la domination d'un seul acteur dans un écosystème décentralisé. Lecture estimée : 45 min.

## Prérequis

- [Phase 9, fiche 03 - Coinbase](03-coinbase.md) (comprendre le modèle d'un exchange régulé)
- [Phase 4, fiche 01 - Taxonomie des tokens](../04-ecosysteme-signal-bruit/01-taxonomie-tokens.md) (comprendre les utility tokens)
- [Phase 5, fiche 04 - Régulation en France et en Europe](../05-securite-survie/04-regulation-loi-france-europe.md)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras décrire l'ascension de Binance, expliquer le rôle de BNB et de la BNB Smart Chain, lister les controverses majeures (régulatoires, juridiques, transparence) et évaluer factuellement la contribution et les risques que Binance représente pour l'écosystème.

---

## Concepts

### Histoire : de l'ICO au premier exchange mondial en 6 mois

**Définition** : Binance est une plateforme d'échange de crypto-monnaies fondée en juillet 2017 par Changpeng Zhao (dit "CZ"), un développeur canadien d'origine chinoise. En moins de 6 mois, Binance est devenu le premier exchange mondial par volume de transactions.

**Le fondateur : Changpeng Zhao (CZ)** :

Avant Binance, CZ avait travaille chez Blockchain.info (wallet Bitcoin) et OKCoin (exchange chinois). Il a quitte OKCoin pour fonder Binance avec une vision claire : créer l'exchange le plus rapide, le moins cher et avec le plus de crypto-monnaies listees.

**Chronologie** :

| Année | Événement |
| ----- | --------- |
| Juillet 2017 | ICO de BNB (100 millions de tokens vendus a 0,15 dollar chacun, levant environ 15 millions de dollars) |
| Juillet 2017 | Lancement de la plateforme Binance |
| Janvier 2018 | Binance devient le premier exchange mondial par volume (6 mois après sa création) |
| 2018 | Binance demenage de la Chine vers Malte (la Chine interdit les exchanges) |
| 2019 | Lancement de Binance Chain et Binance DEX |
| 2020 | Lancement de BNB Smart Chain (BSC) |
| 2021 | Problèmes régulatoires dans plus de 10 pays |
| 2023 | Amende DOJ de 4,3 milliards de dollars, CZ plaide coupable et demissionne |
| 2023 | Richard Teng remplace CZ comme CEO |

**Analogie concrète** : Binance est comparable à un supermarché géant qui s'est installe dans une zone sans règles d'urbanisme. Il offre tout, moins cher que tout le monde, mais personne ne sait exactement ou se trouve le siege social, qui est responsable en cas de problème et si les règles sanitaires sont respectees.

---

### BNB : le token de l'exchange

**Définition** : BNB (initialement "Binance Coin") est le token natif de l'écosystème Binance. Lancé via une ICO en juillet 2017 à 0,15 dollar par token, il a d'abord connu un pic autour de 690 dollars en 2021, puis un sommet historique autour de 1 370 dollars en octobre 2025.

**Fonctions de BNB** :

| Fonction | Description |
| -------- | ----------- |
| Reduction des frais | Payer les frais de trading en BNB donne une reduction (initialement 50%, réduite au fil du temps) |
| Gas sur BSC | BNB est utilise pour payér les frais de transaction sur BNB Smart Chain |
| Launchpad | Les détenteurs de BNB peuvent participer aux ventes de nouveaux tokens sur Binance Launchpad |
| Burns trimestriels | Binance "brûle" (détruit) des BNB chaque trimestre pour réduire l'offre totale |

**Mécanisme de burn** :

Binance s'est engagé à brûler des BNB régulièrement jusqu'à ce qu'il ne reste que 100 millions de tokens (sur les 200 millions initiaux). Le montant brûlé chaque trimestre est basé sur le volume de transactions de la plateforme. C'est un mécanisme déflationniste qui vise à soutenir le prix du BNB.

**Question critique** : BNB est-il un utility token ou une security ? La SEC américaine considere que BNB est une security (investissement dans le succès de Binance). Binance conteste cette qualification. La réponse a cette question a des conséquences juridiques majeures.

---

### BNB Smart Chain (BSC) : blockchain a bas coût, centralisation a haut coût

**Définition** : BNB Smart Chain (BSC, anciennement Binance Smart Chain) est une blockchain compatible EVM (Ethereum Virtual Machine) lancee en septembre 2020. Elle permet d'exécuter des smart contracts similaires a ceux d'Ethereum, mais avec des frais beaucoup plus bas et des transactions plus rapides.

**Comment BSC fonctionne** :

| Caractéristique | BSC | Ethereum (pour comparaison) |
| --------------- | --- | --------------------------- |
| Consensus | Proof of Staked Authority (PoSA) | Proof of Stake |
| Nombre de validateurs | 45 validateurs actifs (21 Cabinet + 24 Candidates) | 900 000+ validateurs |
| Temps de bloc | ~0,45 seconde (réduit depuis 3 s par les hardforks Lorentz, Maxwell et Fermi) | ~12 secondes |
| Frais par transaction | ~0,05-0,30 USD | ~1-50 USD (selon la congestion) |
| Compatibilite | EVM compatible (même code Solidity) | EVM natif |

**Le problème de la centralisation** :

45 validateurs actifs, c'est très peu. Pour comparaison, Ethereum en a plus de 900 000. Cela signifie que :

1. **Les validateurs sont contrôlés par Binance** : ils sont élus par les détenteurs de BNB, mais en pratique, Binance et ses alliés contrôlent suffisamment de BNB pour influencer l'élection.
2. **Censure possible** : avec seulement 45 validateurs, une coordination pour censurer des transactions est beaucoup plus facile qu'avec 900 000.
3. **Point de défaillance** : si un nombre suffisant de validateurs sont compromis ou contraints par un gouvernement, le réseau peut être arrêté ou censuré.

**Succès d'adoption** : malgré cette centralisation, BSC a attire des millions d'utilisateurs, principalement parce que les frais d'Ethereum étaient prohibitifs en 2020-2021 (parfois 50-100 dollars par transaction). BSC offrait la même fonctionnalité pour quelques centimes.

---

### Domination du marché : les chiffres

**Définition** : Binance a domine le marché des exchanges crypto pendant des années, avec une part de marché qui a atteint plus de 50% du volume spot mondial.

**Parts de marché estimees (volumes spot, pic 2022-2023)** :

| Exchange | Part de marché spot (estimation) |
| -------- | -------------------------------- |
| Binance | ~50-60% |
| Coinbase | ~5-8% |
| Kraken | ~2-4% |
| OKX | ~5-7% |
| Bybit | ~3-5% |
| Tous les autres | ~20-30% |

**Pourquoi Binance domine** :

- **Frais les plus bas** : 0,1% de base (maker/taker), réduit avec BNB
- **Plus de crypto-monnaies listees** : 350+ paires de trading
- **Produits multiples** : spot, futures, margin, staking, lending, launchpad, NFTs, copy trading
- **Accessibilite mondiale** : disponible dans la plupart des pays (même si pas toujours legalement)

**Le risque de cette domination** : quand un seul exchange représente plus de la moitié du volume mondial, il devient systemique. Un problème chez Binance (hack, faillite, action régulatoire) affecterait l'ensemble du marché crypto.

---

### Controverses majeures : la liste est longue

**Définition** : Binance a accumule un nombre significatif de controverses et de conflits régulatoires. Voici les principaux, bases sur des faits documentes.

**Controverse 1 : pas de siege social identifié**

Pendant des années, Binance n'a eu aucun siege social officiel. CZ affirmait que Binance était une entreprise "décentralisée" sans adresse fixe. En pratique, cela signifiait :

- Aucun régulateur ne savait qui était responsable de quoi.
- Les clients ne savaient pas dans quel pays porter plainte en cas de problème.
- Binance evitait les obligations légales en changeant de juridiction.

**Controverse 2 : accusations de wash trading**

Des analyses indépendantes (notamment par Forbes en 2022) ont estimé que jusqu'à 70% du volume affiche par Binance pourrait être du wash trading (transactions fictives ou l'acheteur et le vendeur sont la même entité, pour gonfler les volumes affiches). Binance a conteste ces chiffres.

**Controverse 3 : problèmes régulatoires dans 10+ pays**

| Pays | Action régulatoire |
| ---- | ------------------ |
| Royaume-Uni | FCA interdit les activités régulées de Binance (2021) |
| Japon | Avertissement de la FSA pour opérations non autorisées (2021) |
| Allemagne | BaFin avertit Binance (2021) |
| Pays-Bas | Amende de 3,3 millions euros pour opérations non autorisées (2022) |
| France | Enquete pour blanchiment d'argent aggrave (2023) |
| États-Unis | Poursuite DOJ + CFTC + SEC (2023) |
| Canada | Retrait du marché (2023) |
| Australie | Revocation de la licence de derives (2023) |

**Controverse 4 : amende DOJ de 4,3 milliards de dollars (novembre 2023)**

C'est l'événement le plus grave. Le Department of Justice américain a accuse Binance de :

- Violation des lois anti-blanchiment (AML) : Binance a sciemment permis a des utilisateurs dans des pays sous sanctions (Iran, Cuba, Syrie) d'utiliser la plateforme.
- Violation des sanctions : des transactions avec des entités sanctionnees n'ont pas été bloquees.
- Transmission de fonds non autorisée : opérations aux États-Unis sans licence.

**Conséquence** : Binance a accepte de payér 4,3 milliards de dollars d'amende. CZ a plaide coupable personnellement pour violation des lois anti-blanchiment, a demissionne de son poste de CEO et a été condamne a 4 mois de prison (sentence purgee en 2024). Richard Teng lui a succede.

**Controverse 5 : BUSD arrête sous pression régulatoire**

BUSD était le stablecoin de Binance, émis par Paxos. En février 2023, le NYDFS (régulateur new-yorkais) a ordonne a Paxos d'arrêter l'émission de BUSD. La raison invoquee : problèmes de gestion des risques. BUSD a été progressivement retire du marche.

**Controverse 6 : questions sur les réserves**

Après l'effondrement de FTX (novembre 2022), Binance a publie une "preuve de réserves". Mais cette preuve était incomplete : elle montrait les actifs mais pas les passifs (dettes). Sans connaître les dettes, il est impossible de savoir si Binance est solvable. L'audit initial par Mazars a été arrête, et Mazars a retire son rapport.

---

### Contribution réelle et verdict factuel

**Ce que Binance a apporte à l'écosystème** :

- **Democratisation mondiale** : Binance a rendu l'accès aux crypto-monnaies disponible dans presque tous les pays, souvent là où aucun autre exchange ne servait.
- **Frais les plus bas** : la concurrence sur les frais initiee par Binance a bénéficie a tous les utilisateurs, même sur d'autres plateformes.
- **Innovation produit** : launchpad, BSC, Binance Academy (education gratuite), vaste gamme de produits.
- **BSC** : malgré sa centralisation, BSC a permis a des millions d'utilisateurs d'experimenter la DeFi a bas coût quand Ethereum était trop cher.

**Les critiques légitimes** :

- **Manque de transparence** : pas de siege identifié pendant des années, réserves non clairement auditees, accusations de wash trading.
- **Mepris des régulateurs** : opérer dans des pays sans licence n'est pas de la "décentralisation", c'est du contournement des lois.
- **Risque systemique** : une part de marché de 50%+ créé une dépendance dangereuse à un seul acteur.
- **Contradiction fondamentale** : Binance est une entreprise ultra-centralisée qui prospere dans un écosystème qui prone la décentralisation. CZ avait plus de pouvoir sur l'écosystème crypto que n'importe quelle banque centrale n'en a sur sa monnaie.

**Verdict factuel** : Binance a democratise l'accès aux crypto-monnaies à l'échelle mondiale et pousse les frais de trading vers le bas. Mais son histoire est marquee par un mepris systematique des obligations légales, un manque de transparence et une concentration de pouvoir qui contredit les principes fondamentaux de l'écosystème qu'elle sert.

L'amende de 4,3 milliards de dollars et la condamnation de CZ ne sont pas des accidents. Ils sont le résultat logique d'une stratégie qui a consiste à grandir d'abord et a se conformer ensuite.

---

## Checklist de Validation

- [ ] Je connais l'histoire de Binance (2017, CZ, premier exchange mondial en 6 mois)
- [ ] Je comprends le rôle de BNB (frais réduits, gas sur BSC, burns, launchpad)
- [ ] Je sais ce qu'est BSC (blockchain EVM compatible, 45 validateurs actifs, centralisation)
- [ ] Je peux citer les principales controverses (pas de siege, wash trading, 10+ conflits régulatoires)
- [ ] Je connais les détails de l'amende DOJ de 4,3 milliards de dollars (AML, sanctions, demission de CZ)
- [ ] Je sais que BUSD a été arrête sous pression régulatoire
- [ ] Je comprends le risque systemique d'un exchange a 50%+ de part de marche
- [ ] Je peux évaluer la contribution (accessibilité, frais bas) et les limites (transparence, légalité, centralisation)

---

## Navigation

← Fiche précédente : **[Coinbase : l'exchange qui a choisi la régulation](03-coinbase.md)**

→ Fiche suivante : **[Kraken : la plateforme des puristes](05-kraken.md)**
