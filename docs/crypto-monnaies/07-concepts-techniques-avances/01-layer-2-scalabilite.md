---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Layer 2 et scalabilité : les problèmes réels de débit des blockchains et les solutions techniques"
estimated_time: "45 min"
fiche_number: 1
total_fiches: 7
cursus: "Phase 7 - Concepts techniques avances"
---

# 01 - Layer 2 et scalabilité : les vrais problèmes techniques

> **En bref** : Comprendre les limites réelles de débit des blockchains, le trilemme de la scalabilité et les solutions techniques (state channels, rollups, sidechains) avec leurs compromis. Lecture estimée : 45 min.

## Prérequis

- [Phase 6 complete](../06-analyse-critique-due-diligence/index.md) :
  - [Fiche 01 - Lire un whitepaper : méthode et red flags](../06-analyse-critique-due-diligence/01-lire-whitepaper-red-flags.md)
  - [Fiche 02 - Tokenomics : séparer les projets viables du vent](../06-analyse-critique-due-diligence/02-tokenomics-projets-viables.md)
  - [Fiche 03 - Analyse on-chain : les données ne mentent pas](../06-analyse-critique-due-diligence/03-analyse-on-chain-donnees.md)
  - [Fiche 04 - Autopsie de projets : échecs par catégorie](../06-analyse-critique-due-diligence/04-autopsie-projets-par-categorie.md)
  - [Fiche 05 - Due diligence : la checklist du sceptique eclaire](../06-analyse-critique-due-diligence/05-due-diligence-checklist-sceptique.md)
- Connaître le fonctionnement de Bitcoin (transactions, blocs, consensus PoW)
- Connaître le fonctionnement d'Ethereum (smart contracts, gas, EVM)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi les blockchains principales ont un débit limité, formuler le trilemme de la scalabilité et décrire le fonctionnement des principales solutions Layer 2 (state channels, optimistic rollups, ZK-rollups, sidechains) avec leurs compromis respectifs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Le problème de scalabilité : les chiffres réels

**Définition** : La scalabilité d'une blockchain désigne sa capacité à traiter un nombre croissant de transactions sans dégrader les performances ni augmenter démesurément les coûts.

**Les chiffres bruts** :

| Système | Transactions par seconde (tx/s) | Temps de finalité | Coût par transaction (ordre de grandeur) |
| --- | --- | --- | --- |
| Bitcoin | ~7 tx/s | ~60 minutes (6 confirmations) | 1-50 USD (variable selon la congestion) |
| Ethereum (Layer 1) | ~15-30 tx/s | ~12 secondes (un bloc) mais ~15 min pour une finalité forte | 1-100 USD (variable selon la congestion) |
| Visa | ~65 000 tx/s (capacité théorique), ~1 700 tx/s (moyenne réelle) | Quelques secondes | ~0,01 USD |
| PayPal | ~1 000 tx/s | Quelques secondes | ~0,02 USD |

**Le problème que la scalabilité résout** :

Sans scalabilité, les blockchains ne peuvent pas être utilisées à grande échelle :

1. **Files d'attente** : quand le réseau est saturé, les transactions attendent des heures (ou des jours sur Bitcoin en période de forte demande)
2. **Coûts prohibitifs** : sur Ethereum, un simple échange de tokens peut coûter 50-200 dollars en gas lors des pics de congestion
3. **Exclusion des petits utilisateurs** : si envoyer 10 dollars coûte 50 dollars de frais, seuls les gros montants sont viables

**Comment la scalabilité résout ces problèmes** :

| Problème | Solution apportée par la scalabilité |
| --- | --- |
| Files d'attente | Plus de transactions traitées par seconde, moins de congestion |
| Coûts prohibitifs | Plus de capacité disponible, moins de compétition pour l'espace de bloc |
| Exclusion des petits utilisateurs | Des frais suffisamment bas pour que les petites transactions soient viables |

**Analogie concrète** : imagine une autoroute à une seule voie. Aux heures de pointe, les voitures s'accumulent et personne n'avance. La scalabilité, c'est ajouter des voies supplémentaires. Mais attention : chaque solution technique ajoute des voies d'une manière différente, avec des compromis différents.

---

### Le trilemme de la scalabilité

**Définition** : Le trilemme de la scalabilité (formulé par Vitalik Buterin) affirme qu'une blockchain ne peut optimiser simultanément que deux des trois propriétés suivantes : sécurité, décentralisation et scalabilité.

**Les trois propriétés** :

| Propriété | Définition | Exemple de compromis |
| --- | --- | --- |
| Sécurité | Le réseau résiste aux attaques et garantit l'intégrité des transactions | Réduire la sécurité pour aller plus vite = vulnérable aux attaques |
| Décentralisation | Le réseau fonctionne sans autorité centrale, avec de nombreux participants indépendants | Réduire la décentralisation (moins de nœuds) pour aller plus vite = risque de censure |
| Scalabilité | Le réseau traite un grand nombre de transactions rapidement et à faible coût | Augmenter la scalabilité sans toucher aux deux autres = le défi technique majeur |

**Comment chaque blockchain fait ses compromis** :

| Blockchain | Sécurité | Décentralisation | Scalabilité | Choix fait |
| --- | --- | --- | --- | --- |
| Bitcoin | Très élevée | Élevée (~17 000 nœuds) | Très faible (~7 tx/s) | Priorité sécurité + décentralisation |
| Ethereum L1 | Très élevée | Élevée (~8 000 nœuds) | Faible (~15-30 tx/s) | Priorité sécurité + décentralisation |
| Solana | Modérée | Faible (~1 900 validateurs, hardware coûteux) | Élevée (~400 tx/s réelles) | Priorité scalabilité, compromis sur la décentralisation |
| BSC (BNB Chain) | Modérée | Très faible (21 validateurs) | Élevée | Priorité scalabilité, compromis majeur sur la décentralisation |

Le diagramme suivant illustre les tensions entre les trois propriétés du trilemme :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-07-concepts-techniques-avances-01-layer-2-scalabilite-1.html">Le trilemme de la scalabilité (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-07-concepts-techniques-avances-01-layer-2-scalabilite-1.html" title="Le trilemme de la scalabilité" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que le trilemme n'est PAS** :

- Le trilemme n'est pas une loi physique prouvée. C'est une observation empirique. Il est théoriquement possible qu'une innovation future le contourne.
- Le trilemme ne dit pas que les trois propriétés sont impossibles simultanément. Il dit que c'est extrêmement difficile et qu'aucune solution connue n'y parvient pleinement.

**L'idée clé des solutions Layer 2** : plutôt que de modifier la blockchain principale (Layer 1), on déplace une partie du travail sur une couche supplémentaire (Layer 2) qui hérite de la sécurité du Layer 1. C'est la stratégie choisie par Ethereum.

---

### State channels : le Lightning Network

**Définition** : Un state channel est un canal de communication entre deux parties qui permet de réaliser des transactions hors de la blockchain principale (off-chain), en ne publiant que le résultat final sur la blockchain.

**Le problème que les state channels résolvent** :

Si Alice et Bob font 100 transactions entre eux, sans state channel, chaque transaction est enregistrée sur la blockchain (100 transactions on-chain, 100 frais de gas). Avec un state channel, seules 2 transactions sont on-chain : l'ouverture et la fermeture du canal.

**Comment fonctionne le Lightning Network (Bitcoin)** :

```text
Étape 1 : Ouverture du canal
- Alice et Bob créent une transaction "multi-signature" sur Bitcoin
- Ils deposent chacun 0,5 BTC dans le canal
- Cette transaction est enregistrée sur la blockchain (on-chain)

Étape 2 : Transactions off-chain
- Alice envoie 0,1 BTC à Bob (balance : Alice 0,4 / Bob 0,6)
- Bob envoie 0,05 BTC à Alice (balance : Alice 0,45 / Bob 0,55)
- Alice envoie 0,2 BTC à Bob (balance : Alice 0,25 / Bob 0,75)
- Aucune de ces transactions n'est sur la blockchain
- Elles sont signees par les deux parties et stockées localement

Étape 3 : Fermeture du canal
- Alice et Bob publient la balance finale sur la blockchain
- Une seule transaction on-chain : Alice reçoit 0,25 BTC, Bob reçoit 0,75 BTC

Résultat : 3 transactions off-chain, seulement 2 transactions on-chain
```

**Le réseau de canaux** :

```text
Alice n'a pas besoin d'un canal direct avec chaque personne.
Si Alice à un canal avec Bob, et Bob à un canal avec Charlie,
Alice peut payér Charlie via Bob :

Alice --[canal]--> Bob --[canal]--> Charlie

Les paiements sont routés à travers le réseau de canaux existants.
C'est comme un réseau de tuyaux : l'argent circule de proche en proche.
```

**Limites des state channels** :

| Limite | Explication |
| --- | --- |
| Liquidité bloquée | Les fonds doivent être déposés à l'avance dans le canal |
| Les deux parties doivent être en ligne | Impossible de recevoir un paiement si tu es hors ligne (sauf avec des watchtowers) |
| Routage complexe | Trouver un chemin entre deux utilisateurs dans le réseau peut échouer |
| Pas adapté aux smart contracts complexes | Principalement utile pour les paiements simples |
| Capacité limitée | Un canal ne peut pas transmettre plus que ce qu'il contient |

**Chiffres du Lightning Network (ordre de grandeur, 2024)** :

| Métrique | Valeur approximative |
| --- | --- |
| Capacité du réseau | ~5 000 BTC (~150 millions de dollars) |
| Nombre de nœuds | ~15 000 |
| Nombre de canaux | ~50 000 |
| Frais moyens par transaction | < 0,01 USD |

---

### Rollups : la solution privilégiée par Ethereum

**Définition** : Un rollup est une solution Layer 2 qui exécute des transactions hors de la blockchain principale, puis publie un résumé compressé de ces transactions sur le Layer 1. Le Layer 1 garantit la sécurité, le rollup fournit la scalabilité.

**Analogie concrète** : imagine un professeur qui corrige des copies. Plutôt que de noter chaque réponse individuellement sur le tableau (Layer 1), il corrige un lot de 100 copies dans son bureau (Layer 2), puis affiche uniquement les résultats finaux sur le tableau.

**Les deux types de rollups** :

**Optimistic rollups** : supposent que les transactions sont valides par défaut.

```text
Fonctionnement des optimistic rollups :

1. Un "sequenceur" collecte des centaines de transactions off-chain
2. Il les exécute et calcule le nouvel état
3. Il publie un resume compresse sur Ethereum (Layer 1)
4. Hypothese optimiste : les transactions sont considérées valides

En cas de fraude :
5. N'importe qui peut soumettre une "preuve de fraude" pendant
   une période de contestation (généralement 7 jours)
6. Si la fraude est prouvee, la transaction est annulee et le
   sequenceur est penalise

Conséquence : les retraits vers le Layer 1 prennent 7 jours
(le temps de la période de contestation)
```

**ZK-rollups** : prouvent mathématiquement que les transactions sont valides.

```text
Fonctionnement des ZK-rollups :

1. Un "prover" collecte des centaines de transactions off-chain
2. Il les exécute et génère une preuve cryptographique (ZK proof)
   qui prouve mathématiquement que toutes les transactions sont valides
3. Il publie le resume + la preuve sur Ethereum (Layer 1)
4. Le smart contract sur Ethereum vérifie la preuve (rapide et peu coûteux)
5. Si la preuve est valide, les transactions sont acceptees immédiatement

Conséquence : pas de période de contestation, finalité plus rapide
```

**Comparaison optimistic rollups vs ZK-rollups** :

| Critère | Optimistic rollups | ZK-rollups |
| --- | --- | --- |
| Hypothèse de sécurité | Les transactions sont valides sauf preuve contraire | Les transactions sont prouvées mathématiquement valides |
| Temps de retrait vers L1 | ~7 jours (période de contestation) | Quelques heures (temps de génération de la preuve) |
| Coût de publication sur L1 | Plus faible (pas de preuve à publier) | Plus élevé (la preuve doit être publiée) |
| Compatibilité EVM | Élevée (Arbitrum, Optimism sont quasi identiques à Ethereum) | En progression (zkSync Era, StarkNet - quelques incompatibilités) |
| Maturité | Plus mature (optimistic rollups en production depuis ~2021, historique) | Plus récent (ZK rollups en production depuis ~2023, historique) |
| Complexité technique | Modérée | Très élevée (cryptographie avancée) |
| Projets principaux | Arbitrum, Optimism, Base | zkSync Era, StarkNet, Scroll, Linea |

**Chiffres des rollups (ordre de grandeur, 2024)** :

| Rollup | Type | TVL | Transactions par seconde |
| --- | --- | --- | --- |
| Arbitrum | Optimistic | ~10 milliards de dollars | ~40 tx/s |
| Optimism (OP Mainnet) | Optimistic | ~7 milliards de dollars | ~20 tx/s |
| Base | Optimistic (OP Stack) | ~6 milliards de dollars | ~30 tx/s |
| zkSync Era | ZK | ~1 milliard de dollars | ~10 tx/s |
| StarkNet | ZK | ~200 millions de dollars | ~10 tx/s |

---

### Sidechains : blockchains séparées avec un pont

**Définition** : Une sidechain est une blockchain indépendante avec son propre mécanisme de consensus, connectée à la blockchain principale par un pont (bridge). Elle n'hérite PAS de la sécurité du Layer 1.

**Comment fonctionne Polygon PoS (l'exemple le plus connu)** :

```text
1. Polygon PoS est une blockchain a part entière
2. Elle a ses propres validateurs (environ 100 validateurs PoS)
3. Elle a son propre consensus (pas celui d'Ethereum)
4. Un pont permet de transférer des tokens entre Ethereum et Polygon

Pour utiliser Polygon :
1. Tu envoies tes tokens depuis Ethereum vers le pont
2. Le pont verrouille tes tokens sur Ethereum
3. Des tokens équivalents sont créés sur Polygon
4. Tu fais tes transactions sur Polygon (frais : ~0,01 USD)
5. Quand tu veux revenir sur Ethereum, tu utilisés le pont en sens inverse
```

**Difference cruciale : sidechain vs rollup** :

| Critère | Sidechain (Polygon PoS) | Rollup (Arbitrum) |
| --- | --- | --- |
| Sécurité | Propre consensus (ensemble limité de validateurs) | Hérite de la sécurité d'Ethereum (centaines de milliers de validateurs ; le chiffre exact change, ne fige pas 1 000 000) |
| Si les validateurs trichent | Les fonds sur la sidechain sont en danger | Les preuves de fraude protègent les utilisateurs |
| Décentralisation | Dépend de la sidechain (souvent moindre) | Celle d'Ethereum |
| Coûts | Très faibles (~0,01 USD) | Faibles (~0,10-0,50 USD) |
| Vitesse | Rapide (~2 secondes) | Rapide (~0,5-2 secondes) |

**Point important** : Polygon PoS n'est techniquement pas un Layer 2 au sens strict, car il ne dérive pas sa sécurité d'Ethereum. C'est une sidechain avec un pont vers Ethereum. La confusion est fréquente dans l'écosystème.

---

### Tableau comparatif des solutions de scalabilité

| Solution | Sécurité | Débit | Coût par tx | Temps de retrait vers L1 | Maturité |
| --- | --- | --- | --- | --- | --- |
| Ethereum L1 | Très élevée | ~15-30 tx/s | 1-100 USD | - | Très mature |
| Lightning Network | Élevée (héritée de Bitcoin) | Théoriquement illimité | < 0,01 USD | Fermeture de canal (~1h) | Mature |
| Optimistic rollups | Élevée (héritée d'Ethereum) | ~20-40 tx/s | 0,10-0,50 USD | ~7 jours | Mature |
| ZK-rollups | Élevée (héritée d'Ethereum) | ~10-30 tx/s (en croissance) | 0,10-0,50 USD | Quelques heures | En maturation |
| Sidechains | Variable (propre consensus) | Élevée | ~0,01 USD | Variable (dépend du pont) | Mature |

---

### Les limites et problèmes non résolus

**Définition** : Les solutions Layer 2 améliorent la scalabilité, mais elles introduisent de nouveaux problèmes. Ces problèmes sont rarement mentionnés dans le marketing des projets.

**Les problèmes réels** :

| Problème | Explication |
| --- | --- |
| Fragmentation de la liquidité | Les fonds sont répartis entre L1, Arbitrum, Optimism, Base, zkSync, etc. Un DEX sur Arbitrum n'a pas accès à la liquidité d'Optimism |
| Complexité pour l'utilisateur | L'utilisateur doit choisir un réseau, payér pour les ponts, gérer des adresses sur plusieurs chaînes |
| Risque des ponts | Transférer des fonds entre L1 et L2 (ou entre L2) nécessite des ponts, qui sont des cibles privilégiées des hackers |
| Centralisation des séquenceurs | La plupart des rollups ont un seul séquenceur (géré par l'équipe du projet). Si le séquenceur tombe en panne, le rollup s'arrête |
| Coût de disponibilité des données | Les rollups doivent publier les données de transaction sur L1, ce qui reste coûteux |

**Le problème de la centralisation des sequenceurs** :

```text
Situation actuelle (2024) pour la plupart des rollups :

1. Un seul sequenceur, gère par l'équipe du projet
2. Ce sequenceur ordonne toutes les transactions
3. Si le sequenceur tombe en panne, le rollup s'arrête
4. L'équipe peut théoriquement censurer des transactions

Plans futurs :
- Sequenceurs décentralisés (pas encore deployes à grande échelle)
- Sequenceurs partages entre rollups
- Mécanisme d'echappatoire : possibilite de soumettre des transactions
  directement sur L1 en cas de panne du sequenceur
```

**Point factuel** : au moment de cette rédaction, aucun rollup majeur n'a pleinement décentralisé son séquenceur. C'est un problème reconnu par les équipes de développement, mais pas encore résolu.

---

## Checklist de Validation

- [ ] Je sais citer les chiffres de débit réels de Bitcoin (~7 tx/s), Ethereum (~15-30 tx/s) et Visa (~1 700 tx/s en moyenne, ~65 000 tx/s théorique)
- [ ] Je comprends le trilemme de la scalabilité (sécurité, décentralisation, scalabilité) et les compromis de chaque blockchain
- [ ] Je sais expliquer le fonctionnement du Lightning Network (ouverture de canal, transactions off-chain, fermeture)
- [ ] Je sais distinguer un optimistic rollup d'un ZK-rollup (hypothèse de validité vs preuve mathématique)
- [ ] Je connais la différence entre un rollup (hérite la sécurité de L1) et une sidechain (sécurité propre)
- [ ] Je sais nommer les principaux projets de chaque catégorie (Arbitrum, Optimism, zkSync, Polygon PoS)
- [ ] Je comprends les limites des solutions L2 (fragmentation, complexité, centralisation des séquenceurs)
- [ ] Je sais que la plupart des rollups ont actuellement un séquenceur centralisé

---

## Navigation

← Phase précédente : **[Phase 6 - Analyse critique et due diligence](../06-analyse-critique-due-diligence/index.md)**

→ Fiche suivante : **[Bridges et interopérabilité : risques et réalités](02-bridges-interoperabilite.md)**
