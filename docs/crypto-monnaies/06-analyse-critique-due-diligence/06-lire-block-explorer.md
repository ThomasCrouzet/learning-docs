---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Pratique
description: "Lire un block explorer : guide pratique pour Etherscan et mempool.space, lire des transactions et vérifier des contrats"
estimated_time: "45 min"
fiche_number: 6
total_fiches: 6
cursus: "Phase 6 - Analyse critique et due diligence"
---

# 06 - Lire un block explorer : le guide pratique

> **En bref** : Apprendre à naviguer dans Etherscan et mempool.space, lire une transaction Ethereum ou Bitcoin, identifier les types de transactions et vérifier un smart contract. Lecture estimée : 45 min.

## Prérequis

- [Phase 6 complète](index.md) (fiches 01 à 06) :
  - [Fiche 01 - Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)
  - [Fiche 02 - Tokenomics : séparer les projets viables du vent](02-tokenomics-projets-viables.md)
  - [Fiche 03 - Analyse on-chain : les données ne mentent pas](03-analyse-on-chain-donnees.md)
  - [Fiche 04 - Autopsie de projets : échecs par catégorie](04-autopsie-projets-par-categorie.md)
  - [Fiche 05 - Due diligence : la checklist du sceptique eclaire](05-due-diligence-checklist-sceptique.md)
- [Phase 3 - Ethereum et les smart contracts](../03-ethereum-smart-contracts/index.md) (fiches 01 a 04)
- Connaître les bases d'une transaction (from, to, value) et d'un smart contract

## Objectif de cette fiche

À la fin de cette fiche, tu sauras naviguer dans Etherscan (Ethereum) et mempool.space (Bitcoin), lire et interpréter une transaction (hash, status, gas, value), identifier le type d'une transaction (transfert simple, transfert de token, appel de smart contract) et vérifier si un smart contract est audité et son code est public.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux exercices.

### Qu'est-ce qu'un block explorer ?

**Définition** : Un block explorer est une interface web qui permet de naviguer dans les données publiques d'une blockchain. C'est un moteur de recherche pour les transactions, les adresses et les blocs. Toutes les données affichées sont publiques et vérifiables par quiconque.

**Le problème que les block explorers résolvent** :

Sans block explorer, les données de la blockchain sont difficilement accessibles :

1. **Données brutes illisibles** : la blockchain stocke les données en format binaire. Lire directement un bloc nécessite des outils techniques.
2. **Pas de moteur de recherche** : trouver une transaction spécifique parmi des milliards nécessite un index.
3. **Vérification impossible pour les non-techniciens** : sans interface, seuls les développeurs peuvent vérifier les données.

**Comment les block explorers résolvent ces problèmes** :

| Problème | Solution apportée par les block explorers |
| --- | --- |
| Données brutes illisibles | Interface web qui traduit les données en format lisible |
| Pas de moteur de recherche | Recherche par adresse, hash de transaction, numéro de bloc |
| Vérification impossible | N'importe qui peut vérifier une transaction, un solde ou un contrat |

**Analogie concrète** : un block explorer est à la blockchain ce qu'un cadastre en ligne est au registre foncier. Le registre foncier contient toutes les informations sur les propriétés, mais il est stocké dans des dossiers administratifs difficiles d'accès. Le cadastre en ligne met ces mêmes données dans une interface web où tu peux rechercher une parcelle par adresse, par propriétaire ou par numéro.

**Les principaux block explorers** :

| Blockchain | Block explorer | URL |
| --- | --- | --- |
| Ethereum | Etherscan | etherscan.io |
| Bitcoin | mempool.space | mempool.space |
| Bitcoin | Blockstream Explorer | blockstream.info |
| Polygon | Polygonscan | polygonscan.com |
| Arbitrum | Arbiscan | arbiscan.io |
| Solana | Solscan | solscan.io |

---

### Etherscan : anatomie de la page d'accueil

**Définition** : Etherscan est le block explorer le plus utilisé pour Ethereum. Sa page d'accueil affiche un résumé de l'état actuel du réseau.

**Les éléments de la page d'accueil** :

| Élément | Ce qu'il indique |
| --- | --- |
| ETH Price | Le cours actuel de l'ETH en dollars |
| Gas Tracker | Le coût actuel du gas en gwei (unité de prix du gas). Low/Average/High. |
| Latest Blocks | Les derniers blocs mines, avec leur numéro, l'age (il y a combien de secondes) et le nombre de transactions |
| Latest Transactions | Les dernières transactions, avec le hash, le from, le to et le montant |
| Search Bar | Barre de recherche pour chercher par adresse (0x...), hash de transaction (0x...) ou numéro de bloc |

**Ce qu'on peut rechercher** :

```text
Dans la barre de recherche d'Etherscan, tu peux entrer :

1. Une adresse (0x742d35Cc6634C0532925a3b844Bc9e7595f...)
   -> Affiche le solde, l'historique des transactions, les tokens detenus

2. Un hash de transaction (0x5c504ed432cb51138bcf09a...)
   -> Affiche tous les détails de la transaction

3. Un numéro de bloc (19000000)
   -> Affiche toutes les transactions contenues dans ce bloc

4. Un nom ENS (vitalik.eth)
   -> Redirige vers la page de l'adresse associee
```

---

### Lire une transaction Ethereum

**Définition** : Chaque transaction sur Ethereum à une page détaillée sur Etherscan. Voici les champs principaux et leur signification.

**Anatomie d'une transaction** :

| Champ | Signification | Exemple |
| --- | --- | --- |
| Transaction Hash | Identifiant unique de la transaction (empreinte cryptographique) | 0x5c504ed432cb51138bcf09aa15... |
| Status | Résultat de la transaction | Success (réussie) ou Failed (echouee) |
| Block | Numéro du bloc dans lequel la transaction est incluse | 19 234 567 |
| Timestamp | Date et heure de la transaction | 2024-01-15 14:32:55 UTC |
| From | Adresse de l'expéditeur | 0x742d35Cc6634C053... |
| To | Adresse du destinataire (un compte ou un smart contract) | 0xdAC17F958D2ee523... |
| Value | Montant d'ETH transféré | 1.5 ETH |
| Transaction Fee | Frais payés au validateur | 0.003 ETH |
| Gas Price | Prix par unité de gas (en gwei) | 25 Gwei |
| Gas Limit | Quantité maximale de gas autorisée | 21 000 |
| Gas Used | Quantité de gas réellement consommée | 21 000 |
| Input Data | Données supplémentaires envoyées avec la transaction | `0x` (vide) ou calldata |

**Comprendre le gas** :

```text
Le gas, c'est la mesure du "travail" que la transaction demande au réseau.

Gas Limit : le maximum de gas que tu acceptes de consommer
Gas Used : le gas réellement consomme
Gas Price : le prix que tu paies par unité de gas

Frais de transaction = Gas Used x Gas Price

Exemple :
Gas Used = 21 000 unités (transfert simple)
Gas Price = 25 gwei (0,000000025 ETH par unité)
Frais = 21 000 x 0,000000025 = 0,000525 ETH

Note : un transfert simple d'ETH consomme exactement 21 000 gas.
Un appel de smart contract consomme beaucoup plus (100 000 a 500 000+).
```

---

### Identifier le type d'une transaction

**Définition** : Le champ "Input Data" (aussi appelé calldata) révèle le type d'une transaction. En lisant ce champ, tu peux savoir ce que la transaction fait exactement.

**Les trois types principaux** :

| Type | Input Data | Description |
| --- | --- | --- |
| Transfert ETH simple | 0x (vide) | Envoyer des ETH d'une adresse à une autre |
| Transfert de token ERC-20 | Commence par 0xa9059cbb | Appeler la fonction `transfer` d'un contrat de token |
| Appel de smart contract | Commence par d'autres selecteurs de fonction | Interagir avec un smart contract (swap, stake, vote...) |

**Exemple 1 : transfert ETH simple**

```text
From: 0xABC...
To: 0xDEF...
Value: 2.5 ETH
Input Data: 0x

Interpretation :
- L'adresse 0xABC envoie 2,5 ETH à l'adresse 0xDEF
- Input Data vide = pas d'interaction avec un smart contract
- Gas Used = 21 000 (toujours 21 000 pour un transfert simple)
```

**Exemple 2 : transfert de token ERC-20**

```text
From: 0xABC...
To: 0xdAC17F958D2ee523... (contrat USDT)
Value: 0 ETH
Input Data: 0xa9059cbb
            000000000000000000000000DEF123456789...  (adresse destinataire)
            0000000000000000000000000000000000000000000000000000003B9ACA00 (montant)

Interpretation :
- L'adresse 0xABC appelle la fonction transfer() du contrat USDT
- 0xa9059cbb est le selecteur de la fonction transfer(address,uint256)
- Le destinataire est l'adresse DEF123...
- Le montant est 1 000 000 000 (en unités de base du token)
- Value = 0 ETH car c'est un transfert de tokens, pas d'ETH
- Le champ "To" pointe vers le contrat du token, pas vers le destinataire
```

**Exemple 3 : swap sur Uniswap**

```text
From: 0xABC...
To: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D (Uniswap Router)
Value: 1 ETH
Input Data: 0x7ff36ab5... (selecteur + parametrès encodes)

Interpretation :
- L'adresse 0xABC appelle le routeur Uniswap
- 0x7ff36ab5 est le selecteur de la fonction swapExactETHForTokens
- L'utilisateur échange 1 ETH contre des tokens
- Gas Used sera élevé (~150 000-300 000) car l'opération est complexe
```

**Comment reconnaître les selecteurs de fonction** :

| Selecteur | Fonction | Description |
| --- | --- | --- |
| 0xa9059cbb | transfer(address,uint256) | Transfert de tokens ERC-20 |
| 0x095ea7b3 | approve(address,uint256) | Autoriser un contrat à dépenser tes tokens |
| 0x7ff36ab5 | swapExactETHForTokens | Swap ETH vers tokens sur Uniswap v2 |
| 0x38ed1739 | swapExactTokensForTokens | Swap tokens vers tokens sur Uniswap v2 |
| 0xa694fc3a | stake(uint256) | Staker des tokens dans un contrat |

---

### Internal Transactions et Logs

**Définition** : Au-delà de la transaction principale, Etherscan affiche deux onglets supplémentaires qui révèlent ce qui se passe "sous le capot" quand un smart contract est appelé.

**Internal Transactions** :

```text
Quand un smart contract appelle un autre smart contract, ces appels
internes ne sont pas des transactions visibles directement sur la
blockchain. Etherscan les reconstitue et les affiche dans l'onglet
"Internal Transactions".

Exemple : un swap sur Uniswap
Transaction principale : Alice -> Routeur Uniswap (1 ETH)
Internal Transactions :
  1. Routeur Uniswap -> Pool WETH/USDC (1 ETH)
  2. Pool WETH/USDC -> Alice (2 000 USDC)

Les Internal Transactions montrent le chemin complet des fonds.
```

**Logs (événements)** :

```text
Les smart contracts emettent des "événements" (events) quand
certaines actions se produisent. Ces événements sont stockes dans
les logs de la transaction.

Structure d'un log :
- Address : le contrat qui a émis l'événement
- Topics : les parametrès indexes (recherchables)
  - Topic[0] : le hash de la signature de l'événement
  - Topic[1], [2], [3] : parametrès indexes (maximum 3)
- Data : les parametrès non indexes

Exemple : un événement Transfer d'un token ERC-20
- Address : 0xdAC17F958D2ee523... (contrat USDT)
- Topic[0] : 0xddf252ad1be2c89b69c2b068fc378daa952ba7f16... (hash de Transfer)
- Topic[1] : 0x000...ABC (from)
- Topic[2] : 0x000...DEF (to)
- Data : 0x000...3B9ACA00 (montant)
```

**À quoi servent les logs** : les logs permettent de reconstituer l'historique complet des événements sur un contrat. C'est ce qu'utilisent les services d'analyse on-chain (Dune Analytics, Nansen) pour construire leurs tableaux de bord.

---

### Vérifier un smart contract sur Etherscan

**Définition** : Etherscan permet de consulter le code source d'un smart contract, à condition que le déployeur ait choisi de le publier (vérification). Un contrat vérifié est un contrat dont le code source est visible publiquement.

**L'onglet "Contract" d'une adresse de smart contract** :

| Sous-onglet | Ce qu'il montre |
| --- | --- |
| Code | Le code source du contrat (si vérifié). Le compilateur utilisé, la version de Solidity, les paramètrès de compilation. |
| Read Contract | Les fonctions de lecture (ne coûtent pas de gas). Exemples : totalSupply(), balanceOf(), name(). Tu peux les appeler directement depuis Etherscan. |
| Write Contract | Les fonctions d'écriture (coûtent du gas). Exemples : transfer(), approve(), stake(). Tu peux les appeler en connectant ton wallet. |

**Contrat vérifié vs non vérifié** :

| Critère | Contrat vérifié | Contrat non vérifié |
| --- | --- | --- |
| Code source visible | Oui (code Solidity lisible) | Non (seulement le bytecode, illisible) |
| Fonctions identifiées | Oui (noms de fonctions, paramètres) | Non (sélecteurs hexadécimaux uniquement) |
| Auditabilité | Quiconque peut lire et analyser le code | Impossible de vérifier ce que fait le contrat |
| Niveau de confiance | Plus élevé (transparence) | Faible (boîte noire) |
| Signal | Le déployeur accepte la transparence | Pourquoi cachér le code ? Question à se poser. |

**Les vérifications a effectuer sur un contrat** :

```text
Quand tu examines un smart contract sur Etherscan, vérifie :

1. Le code est-il vérifie ? (icône verte "Verified" a côté du nom)
   Si non : red flag. Pourquoi le deploieur caché-t-il son code ?

2. Le contrat a-t-il une fonction "mint" sans restriction ?
   Chercher : function mint(... dans le code source
   Si le owner peut mint des tokens à l'infini : red flag

3. Le contrat a-t-il une fonction "pause" ou "blacklist" ?
   Cela signifie que le deploieur peut arrêter les transfers ou
   bloquer des adresses spécifiques

4. Le deploieur a-t-il renonce à la propriété ?
   Chercher : renounceOwnership() dans les transactions du contrat
   Si oui : le deploieur ne peut plus modifier le contrat

5. Le contrat est-il un proxy (upgradeable) ?
   Si oui : le deploieur peut modifier le comportement du contrat
   à tout moment. Ce n'est pas forcément un red flag (beaucoup de
   protocoles sérieux utilisent des proxies) mais c'est important
   a savoir.
```

---

### mempool.space (Bitcoin)

**Définition** : mempool.space est le block explorer le plus utilisé pour Bitcoin. Il permet de visualiser les transactions en attente (le mempool), les blocs confirmes et les frais en temps réel.

**Le mempool** :

```text
Le mempool (memory pool) est l'ensemble des transactions en attente
de confirmation. Quand tu envoies une transaction Bitcoin, elle entre
d'abord dans le mempool avant d'être incluse dans un bloc par un mineur.

Ce que mempool.space montre :
- Le nombre de transactions en attente
- Les frais recommandes pour être inclus dans le prochain bloc
  (priorité haute, moyenne, basse)
- Une visualisation des blocs en attente (chaque transaction est
  representee par un carre dont la taille dépend des frais)
```

**Lire une transaction Bitcoin** :

| Champ | Signification |
| --- | --- |
| Transaction ID (txid) | Identifiant unique de la transaction |
| Status | Confirmed (combien de confirmations) ou Unconfirmed |
| Included in Block | Numéro du bloc qui contient la transaction |
| Inputs | Les UTXOs consommes (d'où viennent les fonds) |
| Outputs | Les nouvelles UTXOs créées (ou vont les fonds) |
| Fee | Frais payés au mineur (en satoshis et en sat/vB) |
| Size | Taille de la transaction en octets virtuels (vB) |

**Difference entre Bitcoin et Ethereum** :

| Aspect | Bitcoin (mempool.space) | Ethereum (Etherscan) |
| --- | --- | --- |
| Modèle | UTXOs (entrées et sorties) | Comptes (from, to, value) |
| Frais | En sat/vB (satoshis par octet virtuel) | En gwei (prix par unité de gas) |
| Complexité | Transferts principalement | Transferts + smart contracts |
| Temps de confirmation | ~10 min par bloc | ~12 secondes par bloc |
| Smart contracts | Non (scripts limités) | Oui (Solidity, EVM) |

---

## Exercice Pratique

**Énoncé** : Analyse les trois transactions fictives suivantes et réponds aux questions pour chacune.

**Transaction A** :

```text
Transaction Hash: 0xaaa111...
Status: Success
From: 0x742d35Cc6634C0532925a3b844Bc9e7595f...
To: 0x8Ba1f109551bD432803012645Ac136ddd64DBA72
Value: 5.2 ETH
Transaction Fee: 0.000525 ETH
Gas Used: 21 000
Input Data: 0x
```

**Questions pour la Transaction A** :

- Quel est le type de cette transaction ?
- Combien de gas a été consommé ?
- Pourquoi le gas est-il exactement 21 000 ?

**Transaction B** :

```text
Transaction Hash: 0xbbb222...
Status: Success
From: 0x123abc...
To: 0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48 (USDC contract)
Value: 0 ETH
Transaction Fee: 0.0042 ETH
Gas Used: 65 000
Input Data: 0xa9059cbb
            0000000000000000000000009876def...  (adresse destinataire)
            000000000000000000000000000000000000000000000000000000003B9ACA00
```

**Questions pour la Transaction B** :

- Quel est le type de cette transaction ?
- À quoi correspond 0xa9059cbb ?
- Pourquoi Value est-il 0 ETH alors qu'un transfert a lieu ?
- Le champ "To" pointe vers le contrat USDC et non vers le destinataire. Pourquoi ?

**Transaction C** :

```text
Transaction Hash: 0xccc333...
Status: Success
From: 0x456def...
To: 0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D (Uniswap V2 Router)
Value: 2 ETH
Transaction Fee: 0.018 ETH
Gas Used: 180 000
Input Data: 0x7ff36ab5... (parametrès longs)
Internal Transactions:
  1. Uniswap Router -> WETH Contract (2 ETH)
  2. WETH/USDC Pool -> 0x456def... (4 200 USDC)
```

**Questions pour la Transaction C** :

- Quel est le type de cette transaction ?
- Que fait la fonction 0x7ff36ab5 ?
- Pourquoi y a-t-il des Internal Transactions ?
- Que s'est-il passé concrètement (en une phrase) ?
- Pourquoi le gas est-il beaucoup plus élevé que pour les transactions A et B ?

---

## Solution de l'Exercice

> **Note** : Cette section contient les réponses complètes. Essaie d'abord de répondre par toi-même avant de consulter cette solution.

---

**Réponses Transaction A** :

- **Type** : transfert ETH simple. L'Input Data est 0x (vide), ce qui confirme qu'il n'y a pas d'interaction avec un smart contract.
- **Gas consommé** : 21 000 unités.
- **Pourquoi 21 000** : un transfert simple d'ETH consomme toujours exactement 21 000 gas. C'est le coût de base d'une transaction sur Ethereum.

**Réponses Transaction B** :

- **Type** : transfert de token ERC-20 (USDC).
- **0xa9059cbb** : c'est le sélecteur de la fonction `transfer(address,uint256)` du standard ERC-20. Il indique que la transaction appelle la fonction de transfert du contrat USDC.
- **Value = 0 ETH** : la transaction n'envoie pas d'ETH. Elle appelle un smart contract qui transfère des tokens USDC. Les tokens sont des données dans le contrat, pas de l'ETH.
- **"To" = contrat USDC** : la transaction est envoyée AU contrat USDC. C'est le contrat qui exécute la logique de transfert et met à jour les soldes en interne. Le destinataire final est encodé dans l'Input Data (l'adresse 0x9876def...).

**Réponses Transaction C** :

- **Type** : appel de smart contract (swap sur Uniswap V2).
- **0x7ff36ab5** : c'est le sélecteur de la fonction `swapExactETHForTokens`. L'utilisateur échange un montant exact d'ETH contre des tokens.
- **Internal Transactions** : le routeur Uniswap appelle d'autres contrats pour exécuter le swap. D'abord il convertit l'ETH en WETH (Wrapped ETH), puis il échange le WETH contre de l'USDC dans la pool de liquidité.
- **Concrètement** : l'utilisateur 0x456def a échangé 2 ETH contre 4 200 USDC via Uniswap.
- **Gas élevé** : un swap implique plusieurs appels de smart contracts (wrapping, calcul du prix, transfert de tokens). Chaque opération consomme du gas. Les opérations complexes consomment beaucoup plus de gas qu'un transfert simple.

---

## Checklist de Validation

- [ ] Je sais ce qu'est un block explorer et à quoi il sert
- [ ] Je sais rechercher une adresse, une transaction ou un bloc sur Etherscan
- [ ] Je sais lire les champs d'une transaction Ethereum (hash, status, from, to, value, gas)
- [ ] Je sais identifier un transfert simple (Input Data = 0x, gas = 21 000)
- [ ] Je sais identifier un transfert ERC-20 (sélecteur 0xa9059cbb, value = 0 ETH)
- [ ] Je sais identifier un appel de smart contract (sélecteur spécifique, gas élevé)
- [ ] Je comprends les Internal Transactions (appels entre smart contracts)
- [ ] Je sais ce que sont les Logs (événements émis par les contrats)
- [ ] Je sais vérifier un contrat sur Etherscan (code vérifié, fonctions, propriétaire)
- [ ] Je sais naviguer dans mempool.space et lire une transaction Bitcoin

---

## Navigation

← Fiche précédente : **[Due diligence : la checklist du sceptique eclaire](05-due-diligence-checklist-sceptique.md)**

→ Phase suivante : **[Phase 7 - Concepts techniques avances](../07-concepts-techniques-avances/index.md)**
