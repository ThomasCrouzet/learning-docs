---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "MEV et front-running : comment les acteurs extraient de la valeur au detriment des utilisateurs ordinaires"
estimated_time: "40 min"
fiche_number: 4
total_fiches: 7
cursus: "Phase 7 - Concepts techniques avances"
---

# 04 - MEV et front-running : le côté obscur de la DeFi

> **En bref** : Comprendre le MEV (Maximal Extractable Value), les attaques de front-running et sandwich, les chiffres réels de l'extraction de valeur et les solutions techniques en cours de déploiement. Lecture estimée : 40 min.

## Prérequis

- [Fiche 01 - Layer 2 et scalabilité](01-layer-2-scalabilite.md) : comprendre les rollups et les sequenceurs
- [Fiche 02 - Bridges et interopérabilité](02-bridges-interoperabilite.md)
- [Fiche 03 - Zéro-knowledge proofs](03-zero-knowledge-proofs-vie-privee.md) : comprendre la confidentialité des transactions
- Connaître le fonctionnement des DEX (pools de liquidité, AMM) ([Phase 4, fiche 02](../04-ecosysteme-signal-bruit/02-defi-finance-ou-casino.md))
- Comprendre le mempool et le processus d'inclusion des transactions dans un bloc

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer ce qu'est le MEV, décrire les mécanismes de front-running, sandwich attack et back-running, citer les chiffres réels de l'extraction de valeur et comprendre les solutions techniques (Flashbots, PBS) ainsi que l'impact sur l'utilisateur ordinaire.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce que le MEV ?

**Définition** : Le MEV (Maximal Extractable Value, anciennement "Miner Extractable Value") désigne la valeur maximale que les validateurs (ou les bots spécialisés qui collaborent avec eux) peuvent extraire en réordonnant, insérant ou censurant des transactions dans un bloc.

**Le problème que le MEV révèle** :

Sur une blockchain, les transactions ne sont pas incluses dans les blocs dans l'ordre d'arrivée. Le validateur choisit quelles transactions inclure et dans quel ordre. Ce pouvoir d'ordonnancement crée des opportunités de profit :

1. **Arbitrage informationnel** : le validateur voit toutes les transactions en attente (dans le mempool) AVANT qu'elles ne soient incluses dans un bloc. Il sait ce qui va se passer.
2. **Pouvoir d'ordonnancement** : le validateur décide de l'ordre des transactions dans le bloc. Cet ordre à un impact direct sur les prix dans les DEX.
3. **Pouvoir d'inclusion/exclusion** : le validateur peut choisir d'inclure ou d'exclure certaines transactions.

**Analogie concrète** : imagine un courtier en bourse qui reçoit les ordres de tous ses clients. Avant d'exécuter les ordres de ses clients, il regarde quels ordres vont faire monter le prix, achète pour lui-même, puis exécute les ordres des clients (qui font monter le prix), et revend immédiatement. C'est exactement ce qui se passe dans le MEV - sauf qu'en bourse traditionnelle, c'est illégal.

**Ce que le MEV n'est PAS** :

- Le MEV n'est pas un bug à corriger. C'est une conséquence structurelle du fonctionnement des blockchains. Tant qu'il y à un pouvoir d'ordonnancement des transactions, il y aura du MEV.
- Le MEV n'est pas toujours négatif. L'arbitrage (égaliser les prix entre les DEX) est une forme de MEV qui améliore l'efficience du marché.

---

### Le mempool : la file d'attente publique

**Définition** : Le mempool (memory pool) est l'espace où les transactions attendent d'être incluses dans un bloc. Sur Ethereum, le mempool est public : n'importe qui peut voir toutes les transactions en attente.

**Pourquoi le mempool public est un problème** :

```text
Quand tu envoies une transaction sur Ethereum :

1. Ta transaction arrive dans le mempool
2. Elle est visible par TOUT LE MONDE :
   - Les validateurs
   - Les bots de MEV (programmes automatises qui surveillent le mempool 24h/24)
   - N'importe quel nœud du réseau

3. Les bots analysent ta transaction en millisecondes :
   - Quel token tu achetes ?
   - Sur quel DEX ?
   - Quel montant ?
   - Quel slippage maximum tu as autorisé ?

4. Si ta transaction est profitable a exploiter, un bot reagit
   AVANT que ta transaction ne soit incluse dans le bloc

C'est comme crier tes ordres de bourse dans une salle remplie de
traders professionnels avant que l'ordre ne soit exécute.
```

---

### Front-running : passer devant toi

**Définition** : Le front-running consiste à observer une transaction en attente dans le mempool et à placer sa propre transaction AVANT celle-ci dans le bloc, pour profiter du mouvement de prix prévisible.

**Comment ca fonctionne** :

```text
Scénario :
Tu veux acheter 10 ETH sur Uniswap.
Ta transaction est dans le mempool.

Ce que le bot de MEV voit :
"Quelqu'un va acheter 10 ETH. Cet achat va faire monter le prix."

Ce que le bot fait :
1. Le bot achète 10 ETH AVANT toi (en payant plus de gas pour passer en premier)
2. Ta transaction s'exécute (tu achetes 10 ETH, mais à un prix plus élevé
   parce que le bot a déjà fait monter le prix)
3. Le bot revend ses 10 ETH (au prix plus élevé)

Résultat :
- Le bot a fait un profit
- Tu as payé plus cher que prévu pour tes 10 ETH
```

**Comment le bot passe-t-il en premier ?**

```text
Sur Ethereum, les validateurs incluent les transactions qui paient le
plus de gas en priorité. Le bot offre un gas plus élevé que ta
transaction pour garantir qu'il passe avant toi.

Exemple :
- Ta transaction offre 30 gwei de gas
- Le bot offre 50 gwei de gas
- Le validateur inclut le bot en premier (plus rentable pour lui)

C'est une enchère : les bots se font concurrence pour passer en premier.
Cette competition est appelée "PGA" (Priority Gas Auction).
```

---

### Sandwich attack : pris en étau

**Définition** : Une sandwich attack est un type de MEV où le bot place une transaction AVANT et une transaction APRÈS ta transaction, t'encadrant comme un sandwich. C'est la forme de MEV la plus directement nuisible pour l'utilisateur ordinaire.

**Comment ca fonctionne** :

```text
Ta transaction : acheter 10 000 USDC de tokens XYZ sur Uniswap
Ton slippage maximum : 1% (tu acceptes de payér jusqu'à 1% de plus)

Le bot détecte ta transaction dans le mempool et exécute :

Transaction 1 (AVANT toi) :
- Le bot achète des tokens XYZ
- Le prix de XYZ monte

Ta transaction (au milieu) :
- Tu achetes des tokens XYZ au prix augmente
- Tu paies plus cher que prévu (jusqu'à ton slippage maximum de 1%)
- Ton achat fait encore monter le prix

Transaction 2 (APRÈS toi) :
- Le bot vend ses tokens XYZ au prix augmente par ton achat
- Le bot encaisse la difference

Résultat chiffre (exemple simplifie) :
- Prix initial de XYZ : 1,00 $
- Prix après l'achat du bot : 1,008 $
- Prix auquel tu achetes : 1,008 $ (au lieu de 1,00 $)
- Prix après ton achat : 1,009 $
- Le bot vend a 1,009 $

Profit du bot : environ 0,1% de ta transaction
Sur 10 000 USDC : le bot gagne environ 10 $

Ca semble peu, mais multiplie par des milliers de transactions par jour...
```

**L'analogie du restaurant** :

```text
Tu commandes le dernier steak au menu. Un serveur voit ta commande
avant qu'elle n'arrive en cuisine. Il achète le steak, le côté du
menu augmente (offre et demande), tu paies plus cher. Puis le serveur
revend le steak au prix augmente à la table suivante.

La difference avec le monde réel : au restaurant, c'est illégal.
Sur une blockchain publique, il n'y a pas de loi qui l'interdit.
```

---

### Back-running : profiter de l'onde de choc

**Définition** : Le back-running consiste à placer sa transaction immédiatement APRÈS une grosse transaction pour profiter de l'opportunité qu'elle crée. C'est la forme de MEV la moins nocive.

**Exemple : arbitrage après un gros trade** :

```text
Situation :
- Un gros achat de 1 million $ d'ETH sur Uniswap fait monter
  le prix de l'ETH sur Uniswap
- Mais le prix de l'ETH sur Sushiswap n'a pas encore bouge

Le bot de back-running :
1. Détecte le desequilibre de prix entre les deux DEX
2. Achete de l'ETH sur Sushiswap (prix bas)
3. Vend de l'ETH sur Uniswap (prix haut)
4. Empoche la difference

Ce type de MEV est considere comme "positif" car il reequilibre
les prix entre les DEX (arbitrage).
```

---

### Les chiffres du MEV

**Définition** : Le MEV est mesurable grâce à la transparence des blockchains. Des outils comme Flashbots, EigenPhi et mev-inspect permettent de quantifier l'extraction de valeur.

**Chiffres cumules du MEV sur Ethereum (ordres de grandeur)** :

| Métrique | Valeur |
| --- | --- |
| MEV total extrait (depuis The Merge, sept 2022 - fin 2024) | > 600 millions de dollars |
| Nombre de transactions MEV par jour | Plusieurs milliers |
| Types les plus fréquents | Arbitrage (~60%), sandwich attacks (~30%), liquidations (~10%) |
| Nombre de bots MEV actifs | Des centaines |

**Le MEV est un "impot invisible"** :

```text
Quand tu fais un swap sur un DEX, tu paies :

Coûts visibles :
- Gas (frais de réseau) : visible dans ton wallet
- Frais du protocole (0,3% sur Uniswap v2) : visible

Coût invisible :
- MEV : la difference entre le prix que tu aurais obtenu dans un
  marche equitable et le prix que tu obtiens réellement
- Ce coût n'apparaît nulle part dans ton wallet
- Tu ne sais même pas que tu l'as payé

Estimation : pour un swap moyen sur Ethereum, le MEV représente
entre 0,1% et 1% de la transaction. Sur des millions de transactions,
cela représente des centaines de millions de dollars par an.
```

---

### Flashbots et les solutions au MEV

**Définition** : Flashbots est un projet de recherche et développement qui vise a rendre le MEV plus transparent et moins nocif. Plutôt que d'éliminer le MEV (ce qui est considéré comme impossible), Flashbots propose de le canaliser.

**Comment fonctionnait le MEV avant Flashbots** :

```text
Avant Flashbots (2020-2021) :

1. Les bots se faisaient la guerre dans le mempool public
2. Ils surencherissaient sur le gas pour passer en premier (PGA)
3. Ces enchères congestionnaient le réseau
4. Les transactions echouees (bots perdants) payaient quand même
   du gas, gaspillant des millions de dollars
5. Le réseau était encombré par des transactions de bots, pas d'utilisateurs

Problème : le MEV polluait le réseau pour tout le monde.
```

**Comment Flashbots a change le paysage** :

```text
Après Flashbots :

1. Les bots soumettent leurs "bundles" (paquets de transactions) a un
   marche prive (Flashbots Relay), pas dans le mempool public
2. Les validateurs reçoivent les bundles et choisissent les plus rentables
3. Les bundles qui ne sont pas selectionnes ne paient pas de gas
   (plus de transactions echouees)
4. Les enchères se font en prive, pas en public

Résultat : le réseau est moins encombré, mais le MEV existe toujours.
Il est juste mieux organise.
```

**PBS (Proposer-Builder Separation)** :

```text
PBS separe deux rôles qui étaient confondus :

Avant PBS :
- Le validateur fait TOUT : il ordonne les transactions et propose le bloc

Avec PBS :
- Le "builder" (constructeur) assemble le bloc en ordonnant les transactions
  de maniere optimale pour le MEV
- Le "proposer" (validateur) choisit le bloc le plus rentable parmi
  les blocs proposes par les builders
- Le proposer ne voit pas le contenu du bloc avant de le choisir

Avantage : le validateur ne peut pas censurer des transactions spécifiques
(il ne voit pas le contenu)

État actuel : PBS est partiellement deploye via MEV-Boost (Flashbots).
Plus de 90% des blocs Ethereum passent par ce système.
```

---

### Le débat : le MEV est-il un bug ou une feature ?

**Définition** : La communauté crypto est divisée sur la nature du MEV. Deux visions s'opposent.

**Arguments "le MEV est un problème"** :

| Argument | Explication |
| --- | --- |
| Taxe invisible sur les utilisateurs | Chaque transaction défi coûte plus cher que nécessaire à cause du MEV |
| Avantage aux insiders | Seuls les acteurs techniques sophistiques (bots, builders) profitent du MEV |
| Centralisation | Le MEV favorise la concentration : les builders les plus performants capturent la majorité des profits |
| Erosion de la confiance | Les utilisateurs qui découvrent le MEV perdent confiance dans l'équité du système |

**Arguments "le MEV est inevitable et partiellement utile"** :

| Argument | Explication |
| --- | --- |
| Arbitrage benefique | L'arbitrage entre DEX (forme dominante de MEV) améliore l'efficience des prix |
| Liquidations nécessaires | Le MEV des liquidations maintient la solvabilité des protocoles de lending |
| Impossible a eliminer | Tant qu'il y à un ordonnancement des transactions, il y a du MEV. L'éliminer nécessiterait un changement fondamental de l'architecture blockchain |
| Redistribution possible | Des mécanismes comme le MEV Sharing (Flashbots Protect) redistribuent une partie du MEV aux utilisateurs |

**Fait** : le débat n'est pas tranché. Les deux positions ont des arguments valides. Ce qui est certain, c'est que le MEV existe, qu'il coûte de l'argent aux utilisateurs ordinaires et qu'aucune solution ne l'a éliminé.

---

### Comment se protéger du MEV en tant qu'utilisateur

**Définition** : Il est impossible d'éliminer totalement le MEV, mais certaines pratiques réduisent l'exposition.

**Mesures de protection** :

| Protection | Comment | Efficacité |
| --- | --- | --- |
| Réduire le slippage maximum | Configurer un slippage bas (0,5% au lieu de 3%) dans les paramètrès du DEX | Bonne : les sandwich attacks ne sont rentables que si ton slippage est élevé |
| Utiliser Flashbots Protect | Soumettre les transactions via le RPC de Flashbots au lieu du mempool public | Bonne : ta transaction n'est pas visible dans le mempool public |
| Éviter les gros swaps en une seule transaction | Fractionner un swap de 100 000 dollars en plusieurs swaps de 10 000 dollars | Modérée : chaque transaction individuelle est moins attractive pour les bots |
| Utiliser des agrégateurs (1inch, CoW Swap) | Ces outils optimisent l'exécution et intègrent des protections MEV | Bonne : CoW Swap utilise un système de batch auctions qui elimine le front-running |
| Utiliser des ordres limites | Un ordre limite ne révèle pas d'urgence (pas dans le mempool) | Bonne quand disponible |

**Attention** : aucune protection n'est absolue. Le MEV est un jeu du chat et de la souris. Les bots s'adaptent aux nouvelles protections.

---

## Checklist de Validation

- [ ] Je sais définir le MEV (valeur extraite par le reordonnancement des transactions)
- [ ] Je comprends pourquoi le mempool public est un problème (toutes les transactions en attente sont visibles)
- [ ] Je sais expliquer le front-running (acheter avant la victime pour profiter de la hausse de prix)
- [ ] Je sais expliquer la sandwich attack (acheter avant et vendre après, encadrant la transaction de la victime)
- [ ] Je sais distinguer le back-running (arbitrage post-transaction, considéré comme positif)
- [ ] Je connais l'ordre de grandeur du MEV extrait (centaines de millions de dollars par an)
- [ ] Je comprends le rôle de Flashbots (canaliser le MEV, pas l'éliminer)
- [ ] Je sais ce qu'est PBS (Proposer-Builder Separation)
- [ ] Je connais les mesures de protection (slippage bas, Flashbots Protect, CoW Swap)
- [ ] Je comprends que le MEV est un "impot invisible" sur chaque transaction défi

---

## Navigation

← Fiche précédente : **[Zéro-knowledge proofs : la crypto au service de la vie privée](03-zero-knowledge-proofs-vie-privee.md)**

→ Fiche suivante : **[Mécanismes de consensus : PoS, DPoS, BFT et au-delà](05-mecanismes-consensus-pos-bft.md)**
