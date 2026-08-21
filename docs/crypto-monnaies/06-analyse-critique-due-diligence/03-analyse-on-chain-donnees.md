---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Pratique
description: "Analyse on-chain : utiliser les données publiques de la blockchain pour évaluer un projet objectivement"
estimated_time: "45 min"
fiche_number: 3
total_fiches: 6
cursus: "Phase 6 - Analyse critique et due diligence"
id: "specializations.crypto.analysis.analyse-on-chain-donnees"
course_id: "specializations.crypto"
module_id: "specializations.crypto.analysis"
content_type: "lesson"
order: 3
---

# 03 - Analyse on-chain : les données ne mentent pas

> **En bref** : Apprendre a utiliser les données publiques de la blockchain pour évaluer un projet crypto objectivement, détecter les manipulations et identifier les signaux d'alerte grâce aux outils d'analyse on-chain. Lecture estimée : 45 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complete (fiches 01 a 04)
- [Phase 2 - Bitcoin](../02-bitcoin/index.md) complete (fiches 01 a 06)
- [Fiche 01 - Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)
- [Fiche 02 - Tokenomics : séparer les projets viables du vent](02-tokenomics-projets-viables.md)
- Comprendre ce qu'est une transaction, une adresse et un bloc sur une blockchain

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les outils d'analyse on-chain pour consulter les données publiques de la blockchain, interpréter les métriques clés (adresses actives, volume, TVL, concentration), détecter le wash trading et les signaux précurseurs d'un rug pull.

---

## Concepts

### Qu'est-ce que l'analyse on-chain ?

**Définition** : L'analyse on-chain consiste à examiner les données inscrites directement sur la blockchain (transactions, soldes, activité des adresses) pour évaluer l'état réel d'un réseau ou d'un projet. Ces données sont publiques et vérifiables par tous.

**Le problème que l'analyse on-chain résout** :

Sans analyse on-chain, les informations sur un projet crypto proviennent de :

1. **L'équipe du projet elle-même** : qui à un intérêt à présenter des chiffres favorables.
2. **Les médias crypto** : qui sont souvent financés par les projets qu'ils couvrent.
3. **Les réseaux sociaux** : où le bruit est amplifié et les faits sont rares.

**Comment l'analyse on-chain résout ces problèmes** :

| Problème | Solution apportée par l'analyse on-chain |
| --- | --- |
| Informations biaisées de l'équipe | Données objectives inscrites dans un registre infalsifiable |
| Médias non indépendants | Vérification directe, sans intermédiaire |
| Bruit des réseaux sociaux | Métriques quantifiables et reproductibles |

**Analogie concrète** : L'analyse on-chain est comme la comptabilité forensique d'une entreprise. Au lieu de croire les declarations de l'entreprise sur ses revenus, tu examines directement les rélevés bancaires. Sur une blockchain publique, tous les "rélevés bancaires" sont accessibles a tous.

**Ce que l'analyse on-chain n'est PAS** :

- L'analyse on-chain n'est pas infaillible. Les données sont objectives, mais leur interprétation peut être subjective. Deux analystes peuvent tirer des conclusions différentes des mêmes données.
- L'analyse on-chain ne couvre pas tout. Les transactions sur des plateformes centralisées (Binance, Coinbase) ne sont pas sur la blockchain tant qu'elles restent en interne. Une part significative de l'activité échappe à l'analyse on-chain.

---

### Les outils d'analyse on-chain

**Définition** : Plusieurs outils permettent de consulter et d'analyser les données on-chain. Chacun à une specialite.

**Les outils principaux** :

| Outil | Type | Ce qu'il fait | Accès |
| --- | --- | --- | --- |
| Etherscan (etherscan.io) | Explorateur de blocs Ethereum | Consulter les transactions, les contrats, les soldes de n'importe quelle adresse Ethereum | Gratuit |
| Blockchain.com | Explorateur de blocs Bitcoin | Consulter les transactions et les blocs Bitcoin | Gratuit |
| Solscan (solscan.io) | Explorateur de blocs Solana | Equivalent d'Etherscan pour Solana | Gratuit |
| Dune Analytics (dune.com) | Plateforme de requêtes SQL | Ecrire des requêtes personnalisées sur les données de la blockchain | Gratuit (basique) |
| Glassnode (glassnode.com) | Métriques on-chain | Métriques precalculees : adresses actives, flux d'exchanges, HODL waves | Payant (certaines métriques gratuites) |
| DeFiLlama (defillama.com) | TVL et métriques défi | Total Value Locked par protocole, par chaîne, par catégorie | Gratuit |
| Arkham Intelligence (arkhamintelligence.com) | Identification d'adresses | Associe des adresses blockchain a des entités connues (exchanges, fonds, baleines) | Gratuit (basique) |

**Point important** : cette fiche décrit ces outils pour que tu saches ce qu'ils permettent de faire. En environnement offline, tu ne peux pas y accéder directement. L'objectif est de comprendre la méthode pour l'appliquer quand tu auras accès à internet.

**Comment utiliser un explorateur de blocs (exemple avec Etherscan)** :

```text
1. Va sur etherscan.io
2. Dans la barre de recherche, entre :
   - Une adresse (0x...) pour voir son solde et ses transactions
   - Un hash de transaction (0x...) pour voir les détails d'une transaction
   - Le nom d'un token pour voir ses métriques (holders, transfers)
3. Pour un token ERC-20 :
   - Onglet "Holders" : qui détient combien de tokens
   - Onglet "Transfers" : historique des transferts
   - Onglet "Analytics" : graphiques d'activité
```

**Comment utiliser DeFiLlama** :

```text
1. Va sur defillama.com
2. Page d'accueil : classement des protocoles DeFi par TVL
3. Clique sur un protocole pour voir :
   - TVL actuel et historique
   - Répartition par chaîne (Ethereum, Arbitrum, etc.)
   - Revenus génères
4. Menu "Chains" : compare la TVL entre les blockchains
5. Menu "Stables" : volume et répartition des stablecoins
```

---

### Métriques on-chain importantes

**Définition** : Certaines métriques on-chain sont particulièrement utiles pour évaluer la santé et l'activité réelle d'un projet. Voici les principales et comment les interpréter.

**Métrique 1 : Adresses actives quotidiennes**

| Aspect | Détail |
| --- | --- |
| Définition | Nombre d'adresses uniques ayant effectue au moins une transaction dans les dernières 24 heures |
| Ce que ca mesure | L'activité réelle du réseau |
| Signe positif | Tendance croissante et stable sur plusieurs mois |
| Signe négatif | Chute brutale ou stagnation prolongee |
| Piège | Les bots et les airdrops gonflent artificiellement ce chiffre |

**Comment repérer le gaming des adresses actives** :

```text
Signaux d'adresses actives artificiellement gonflees :
- Pic soudain de nouvelles adresses sans raison apparente (pas de nouvel usage)
- Adresses qui ne font qu'une seule micro-transaction puis disparaissent
- Correlation entre les pics d'adresses et les annonces de airdrops
  (les gens créent des dizaines d'adresses pour recevoir l'airdrop)
```

**Métrique 2 : Volume de transactions**

| Aspect | Détail |
| --- | --- |
| Définition | Valeur totale des transactions effectuées sur la blockchain dans une période donnée |
| Ce que ca mesure | L'utilisation économique réelle du réseau |
| Signe positif | Volume croissant et diversifie (beaucoup d'adresses différentes) |
| Signe négatif | Volume élevé mais concentre sur quelques adresses |
| Piège | Le wash trading gonfle artificiellement le volume |

**Métrique 3 : TVL (Total Value Locked) pour la DeFi**

| Aspect | Détail |
| --- | --- |
| Définition | Valeur totale des actifs déposés dans les smart contracts d'un protocole DeFi |
| Ce que ca mesure | La confiance des utilisateurs dans un protocole (ils y deposent leur argent) |
| Signe positif | TVL stable ou croissant, correle avec des revenus de frais |
| Signe négatif | TVL maintenu uniquement par des incentives (récompenses en tokens) |
| Piège | Le TVL peut être gonfle par des incentives temporaires qui disparaitront |

**Comment interpréter le TVL** :

> **Note de fraîcheur** : le TVL affiché sur DeFiLlama change en continu. Définition officielle (docs.llama.fi, consulté en août 2026) : valeur des tokens verrouillés dans les contrats d'un protocole. Les 100 millions $ ci-dessous sont un **scénario pédagogique**, pas un chiffre observé à une date donnée.

```text
Deux protocoles ont chacun 100 millions $ de TVL.

Protocole A :
- TVL stable depuis 1 an
- Genere 500 000 $ de frais par mois
- Pas d'incentives en tokens
- Conclusion : utilisation organique réelle

Protocole B :
- TVL monte a 100M $ en 2 mois grâce a des récompenses en tokens
- Genere 50 000 $ de frais par mois
- Distribue 2 millions $ de tokens par mois comme incentive
- Conclusion : les utilisateurs sont la pour les récompenses,
  pas pour le service. Quand les récompenses s'arretent, le TVL chute.
```

**Métrique 4 : Concentration des tokens (whales)**

| Aspect | Détail |
| --- | --- |
| Définition | Répartition des tokens entre les plus gros détenteurs |
| Ce que ca mesure | Le degre de décentralisation de la propriété |
| Signe positif | Distribution progressivement plus repartie au fil du temps |
| Signe négatif | Quelques adresses détiennent la majorité des tokens |
| Piège | Les exchanges détiennent des tokens pour le compte de milliers d'utilisateurs (il faut les exclure de l'analyse) |

**Seuils de concentration** :

| Indicateur | Sain | Preoccupant | Critique |
| --- | --- | --- | --- |
| Top 10 adresses (hors exchanges) | < 25% | 25-50% | > 50% |
| Top 100 adresses (hors exchanges) | < 50% | 50-70% | > 70% |
| Gini coefficient (0 = égalité parfaite, 1 = 1 adresse détient tout) | < 0,6 | 0,6-0,8 | > 0,8 |

---

### Comment détecter le wash trading

**Définition** : Le wash trading est une technique de manipulation où une même personne (ou un même groupe) achète et vend un actif simultanément pour créer l'illusion d'un volume de transactions élevé. C'est illégal sur les marchés financiers traditionnels mais non régulé sur la plupart des plateformes crypto.

**Le problème du wash trading** :

Le volume de transactions est souvent utilisé comme indicateur de popularité ou de légitimité d'un token. Un volume élevé attire de nouveaux acheteurs qui croient que le token est activement échangé. Le wash trading fausse cette perception.

**Signaux de wash trading** :

| Signal | Description | Comment vérifier |
| --- | --- | --- |
| Mêmes adresses en boucle | Un petit nombre d'adresses échange le même token de manière répétitive | Suivre les flux de tokens entre adresses sur Etherscan |
| Volume sans impact sur le prix | Volume quotidien élevé mais prix complètement stable | Comparer les graphiques de volume et de prix |
| Transactions de montants identiques | Des transactions de 1 000 dollars exactement, a intervalles réguliers | Examiner les listes de transactions sur l'explorateur |
| Ratio volume/market cap anormal | Un token avec 10 millions de dollars de market cap affiche 100 millions de dollars de volume quotidien | Calculer le ratio : > 200% est suspect |
| Transactions circulaires | A envoie a B, B envoie a C, C renvoie a A | Suivre les chaînes de transactions sur Arkham ou Etherscan |

**Exemple concret de détection** :

```text
Tu examines le token XYZ sur Etherscan :

1. Tu regardes les dernières 100 transactions.
2. Tu notes que 80% des transactions impliquent seulement 5 adresses.
3. Tu suis les flux : l'adresse A envoie 10 000 XYZ a B,
   B envoie 10 000 XYZ a C, C renvoie 10 000 XYZ a A.
   Le cycle se repete toutes les heures.
4. Le volume affiche est de 1 million de XYZ par jour,
   mais ce sont les memes 10 000 XYZ qui circulent en boucle.

Conclusion : le volume est artificiel. L'activité réelle est quasi nulle.
```

---

### Comment détecter un rug pull imminent

**Définition** : Un rug pull est une arnaque ou les créateurs d'un projet retirent soudainement toute la liquidité ou les fonds, laissant les investisseurs avec des tokens sans valeur. Les données on-chain montrent souvent des signaux d'alerte avant le rug pull.

**Les signaux precurseurs d'un rug pull** :

| Signal | Description | Gravite |
| --- | --- | --- |
| Retrait de liquidité | Le créateur retire ses tokens de liquidité du pool de trading | Critique (souvent immediat) |
| Gros transferts vers des exchanges | Les adresses de l'équipe envoient des tokens vers Binance, Coinbase, etc. (pour vendre) | Élevée |
| Activité de développement qui chute | Plus de commits sur GitHub depuis des semaines/mois | Moderee |
| Ventes progressives de l'équipe | Les adresses connues de l'équipe vendent régulièrement | Élevée |
| Contrat non renonce | Le deploieur garde le contrôle du contrat (peut modifier les règles) | Élevée |
| Fonction de mint non plafonnee | Le contrat permet de créer des tokens à l'infini | Critique |

**Comment vérifier ces signaux** :

**Signal 1 : Retrait de liquidité**

```text
Sur un DEX (exchange décentralisé), la liquidité est fournie par des
"liquidity providers" qui deposent des paires de tokens (ex: ETH + TOKEN).

Pour vérifier :
1. Trouve l'adresse du pool de liquidité sur DeFiLlama ou Dexscréener
2. Regarde sur Etherscan si les tokens de liquidité (LP tokens) sont :
   - Bloques dans un contrat de verrouillage (bon signe)
   - Detenus par une adresse unique non verrouillée (risque)
3. Si le deploieur peut retirer la liquidité à tout moment,
   il peut vendre tous les ETH du pool et laisser le token sans valeur.
```

**Signal 2 : Contrat non renonce**

```text
Quand un smart contract est deploye, le deploieur a souvent des
droits d'administration (owner). Il peut :
- Modifier les frais de transaction (les mettre a 99% pour bloquer les ventes)
- Creer de nouveaux tokens
- Blacklister des adresses

Si le deploieur "renonce" (renounce ownership), il perd ces droits.
C'est verifiable sur Etherscan.

ATTENTION : "renounce" n'est pas toujours definitif.
Certains contrats ont des backdoors qui permettent de reprendre le contrôle.
Verifier le code source est nécessaire.
```

**Signal 3 : Fonction de mint non plafonnee**

```text
Regarde le code du smart contract sur Etherscan.
Cherche une fonction de type :

function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
}

Si cette fonction existe ET que le owner est une adresse unique
(pas un multisig, pas un contrat de gouvernance), le propriétaire
peut créer des millions de nouveaux tokens et les vendre.
```

---

### Les limites de l'analyse on-chain

**Définition** : L'analyse on-chain est un outil puissant mais elle a des limites importantes a connaître pour éviter les fausses conclusions.

**Limite 1 : L'activité hors-chaîne est invisible**

Les transactions qui se passent à l'intérieur des plateformes centralisées (Binance, Coinbase) ne sont pas sur la blockchain. Quand tu achetes du Bitcoin sur Binance et que tu le gardes sur Binance, aucune transaction on-chain n'est créée. Ce qui signifie que l'activité on-chain ne représente qu'une fraction de l'activité totale.

**Limite 2 : Les adresses ne sont pas des personnes**

- Une personne peut posséder des milliers d'adresses.
- Un exchange possède quelques adresses qui représentent des millions d'utilisateurs.
- Le nombre d'adresses actives n'est pas équivalent au nombre d'utilisateurs.

**Limite 3 : Les données montrent le "quoi" mais pas le "pourquoi"**

```text
Observation : une baleine a transféré 10 000 BTC vers un exchange.
Interpretation possible 1 : elle va vendre (signal baissier).
Interpretation possible 2 : elle deplace des fonds pour un client OTC
                            (aucun impact sur le prix).
Interpretation possible 3 : elle reorganise ses portefeuilles internes.

Les données montrent le transfert. Le motif est inconnu.
```

**Limite 4 : Les métriques peuvent être manipulees**

Comme vu avec le wash trading, certaines métriques on-chain peuvent être gonflees artificiellement. La blockchain garantit l'exactitude des données brutes (les transactions ont bien eu lieu) mais pas leur signification économique (ces transactions représentent-elles une activité réelle ?).

---

## Checklist de Validation

- [ ] Je sais ce qu'est l'analyse on-chain et pourquoi les données de la blockchain sont une source fiable
- [ ] Je connais les principaux outils (Etherscan, DeFiLlama, Glassnode, Dune Analytics, Arkham)
- [ ] Je sais interpréter les adresses actives et identifier quand ce chiffre est gonfle artificiellement
- [ ] Je comprends le TVL et je sais distinguer un TVL organique d'un TVL maintenu par des incentives
- [ ] Je sais comment détecter le wash trading (adresses en boucle, volume sans impact sur le prix)
- [ ] Je connais les signaux precurseurs d'un rug pull (retrait de liquidité, contrat non renonce, fonction mint)
- [ ] Je sais vérifier si un contrat a été "renounce" et pourquoi ce n'est pas toujours suffisant
- [ ] Je connais les limites de l'analyse on-chain (activité hors-chaîne invisible, adresses pas egales a personnes)
- [ ] Je sais que les données on-chain montrent le "quoi" mais pas le "pourquoi"
- [ ] Je comprends que les métriques on-chain peuvent être manipulees malgré l'immutabilité de la blockchain

---

## Navigation

← Fiche précédente : **[Tokenomics : séparer les projets viables du vent](02-tokenomics-projets-viables.md)**

→ Fiche suivante : **[Autopsie de projets : échecs par catégorie](04-autopsie-projets-par-categorie.md)**
