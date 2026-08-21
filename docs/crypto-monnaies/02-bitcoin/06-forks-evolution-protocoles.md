---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Forks et évolution des protocoles : hard fork, soft fork, SegWit, Taproot et les grandes scissions de l'histoire crypto"
estimated_time: "40 min"
fiche_number: 6
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
id: "specializations.crypto.bitcoin.forks-evolution-protocoles"
course_id: "specializations.crypto"
module_id: "specializations.crypto.bitcoin"
content_type: "lesson"
order: 6
---

# 06 - Forks et évolution des protocoles

> **En bref** : Comprendre la différence entre hard fork et soft fork, connaître les mises à jour majeures de Bitcoin (SegWit, Taproot) et analyser les grandes scissions historiques (Bitcoin Cash, Bitcoin SV, Ethereum Classic). Lecture estimée : 40 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)
- [Fiche 02 - Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)
- [Fiche 03 - Proof of Work : le consensus par l'énergie](03-proof-of-work-consensus-energie.md)
- [Fiche 04 - Le réseau Bitcoin : nœuds, mineurs et pools](04-reseau-noeuds-mineurs-pools.md)
- [Fiche 05 - Bitcoin en chiffres : supply, halving et adoption réelle](05-bitcoin-chiffres-adoption-reelle.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer la différence entre un hard fork et un soft fork, décrire le fonctionnement de SegWit et Taproot, raconter l'histoire des grandes scissions (Bitcoin Cash, Bitcoin SV, Ethereum Classic) et comprendre ce que les forks révèlent sur la gouvernance des protocoles décentralisés.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Qu'est-ce qu'un fork ?

**Définition** : Un fork est un changement des règles du protocole d'une blockchain. Le mot "fork" (fourchette en anglais) évoque un embranchement : la chaîne se divise en deux chemins possibles.

**Le problème que les forks résolvent** :

Sans mécanisme de fork, les protocoles de blockchain rencontrent ces problèmes :

1. **Immobilisme** : les bugs ne peuvent pas être corrigés et les améliorations techniques ne peuvent pas être déployées.
2. **Désaccord sans issue** : quand les participants ne s'accordent pas sur l'évolution du protocole, il n'y a pas de mécanisme pour trancher.
3. **Obsolescence** : un protocole qui ne peut pas évoluer finit par être dépassé par les alternatives.

**Comment les forks résolvent ces problèmes** :

| Problème | Solution apportée par les forks |
| --- | --- |
| Immobilisme | Les forks permettent de mettre à jour les règles du protocole |
| Désaccord sans issue | Chaque camp peut suivre sa version des règles (hard fork) |
| Obsolescence | Les soft forks ajoutent des fonctionnalités en restant compatibles |

**Analogie concrète** : Imagine une route a voie unique. Un fork, c'est un embranchement ou la route se divise en deux. Un soft fork, c'est quand on ajoute une voie supplémentaire a côté de la route existante : les anciens vehicules peuvent continuer a utiliser la route, et les nouveaux vehicules peuvent aussi emprunter la nouvelle voie. Un hard fork, c'est quand la route se divise en deux routes séparées qui vont dans des directions différentes : il faut choisir laquelle prendre.

**Ce qu'un fork n'est PAS** :

- Un fork n'est pas forcément un conflit. Beaucoup de forks sont des mises à jour consensuelles acceptées par toute la communauté (exemple : SegWit, Taproot).
- Un fork ne crée pas forcément deux crypto-monnaies distinctes. Seuls les hard forks contentieux créent une nouvelle crypto-monnaie.

---

### Hard fork vs soft fork

**Définition** : Un hard fork est un changement incompatible avec les anciennes versions du logiciel. Un soft fork est un changement retrocompatible avec les anciennes versions.

**Hard fork** :

```text
Principe :
- Les nouvelles règles sont INCOMPATIBLES avec les anciennes
- Les anciens nœuds (qui n'ont pas mis a jour) rejettent les nouveaux blocs
- Les nouveaux nœuds (qui ont mis a jour) rejettent les anciens blocs
- Résultat : si tout le monde ne met pas a jour, la chaîne se divise en deux

Exemple simplifie :
Règle actuelle : taille maximale d'un bloc = 1 Mo
Hard fork : taille maximale d'un bloc = 8 Mo

- Les anciens nœuds voient un bloc de 8 Mo et le rejettent (trop gros)
- Les nouveaux nœuds acceptent les blocs de 8 Mo
- Deux chaînes coexistent desormais
```

**Soft fork** :

```text
Principe :
- Les nouvelles règles sont un SOUS-ENSEMBLE des anciennes règles
- Les anciens nœuds acceptent les nouveaux blocs (ils restent valides
  selon les anciennes règles)
- Les nouveaux nœuds appliquent les nouvelles règles (plus strictes)
- Résultat : pas de division si la majorité des mineurs met a jour

Exemple simplifie :
Règle actuelle : taille maximale d'un bloc = 1 Mo
Soft fork : les données de signature sont deplacees pour liberer de l'espace
            (le bloc fait toujours 1 Mo selon les anciennes règles)

- Les anciens nœuds voient un bloc valide (< 1 Mo) et l'acceptent
- Les nouveaux nœuds interpretent les données differemment mais le bloc
  reste valide pour tout le monde
```

**Comparaison hard fork vs soft fork** :

| Critère | Hard fork | Soft fork |
| --- | --- | --- |
| Compatibilite avec les anciens nœuds | Non - les anciens nœuds rejettent les nouveaux blocs | Oui - les anciens nœuds acceptent les nouveaux blocs |
| Mise a jour obligatoire | Oui - tous les nœuds doivent mettre a jour | Non - les anciens nœuds continuent de fonctionner |
| Risque de division de la chaîne | Élevé si des participants refusent la mise à jour | Faible si la majorité des mineurs adopte |
| Réversibilité | Difficile - deux chaînes indépendantes existent | Plus facile - la chaîne reste unifiée |
| Exemples sur Bitcoin | Bitcoin Cash (2017), Bitcoin SV (2018) | SegWit (2017), Taproot (2021) |

---

### SegWit (Segregated Witness) - août 2017

**Définition** : SegWit est un soft fork de Bitcoin activé le 24 août 2017. Il déplace les données de signature (witness data) dans une structure séparée du bloc principal, ce qui libère de l'espace et corrige un bug critique.

**Le problème que SegWit résout** :

Sans SegWit, Bitcoin avait ces limitations :

1. **Capacité limitée** : chaque bloc ne pouvait contenir qu'environ 1 Mo de données, soit environ 2 000 à 3 000 transactions.
2. **Bug de malléabilité** : il était possible de modifier l'identifiant (txid) d'une transaction sans invalider la transaction elle-même. Ce bug rendait certaines fonctionnalités avancées impossibles à construire de manière fiable.
3. **Frais élevés en période de congestion** : quand le réseau est saturé, les utilisateurs doivent surenchérir pour que leur transaction soit incluse dans le prochain bloc.

**Comment SegWit fonctionne** :

```text
Avant SegWit :
Un bloc Bitcoin contient les données de transaction ET les signatures.
Les signatures occupent environ 60% de l'espace d'un bloc.

Bloc = [Transaction 1 + Signature 1] + [Transaction 2 + Signature 2] + ...
Limite : 1 Mo

Après SegWit :
Les signatures sont deplacees dans une structure séparée (witness).
Le bloc principal ne contient que les transactions sans les signatures.

Bloc principal = [Transaction 1] + [Transaction 2] + ...
Structure witness = [Signature 1] + [Signature 2] + ...

Nouvelle mesure : "weight units" (WU)
- Limite : 4 000 000 WU (4 MWU) par bloc
- Données de transaction : 4 WU par octet
- Données witness (signatures) : 1 WU par octet
- Résultat : la capacité effective passe de ~1 Mo a ~2-4 Mo
```

**Conséquences de SegWit** :

| Aspect | Avant SegWit | Après SegWit |
| --- | --- | --- |
| Capacité effective par bloc | ~1 Mo (~2 500 tx) | ~2-4 Mo (~5 000-8 000 tx) |
| Bug de malléabilité | Présent | Corrigé |
| Format d'adresses | 1... (Legacy) ou 3... (P2SH) | bc1q... (Bech32) |
| Lightning Network | Impossible a construire de manière fiable | Possible grâce à la correction de la malleabilite |
| Frais de transaction | Basé sur la taille en octets | Basé sur le poids en weight units (WU) |

**Pourquoi SegWit est important** : au-delà de l'augmentation de capacité, SegWit a corrigé le bug de malléabilité. Cette correction était un prérequis technique indispensable pour construire le Lightning Network, la couche 2 de Bitcoin qui permet des transactions quasi instantanées et bon marché.

**Adoption** : en 2025-2026, environ 85-90% des transactions Bitcoin dépensent au moins une entrée SegWit. Les adresses bc1q... sont devenues le format standard.

---

### Taproot - novembre 2021

**Définition** : Taproot est un soft fork de Bitcoin activé le 14 novembre 2021 au bloc 709 632. Il introduit les signatures Schnorr et MAST (Merkelized Abstract Syntax Trees) pour améliorer l'efficacité, la confidentialité et la programmabilité de Bitcoin.

**Le problème que Taproot résout** :

1. **Efficacité des signatures** : l'ancien algorithme de signature (ECDSA) ne permet pas d'agréger plusieurs signatures en une seule. Quand une transaction multisig (3 sur 5 par exemple) est effectuée, les 3 signatures sont visibles individuellement dans le bloc.
2. **Confidentialité insuffisante** : sur la blockchain, une transaction multisig est visuellement différente d'une transaction simple. Cela révèle des informations sur les participants.
3. **Programmabilité limitée** : les scripts complexes (conditions de dépense multiples) prennent beaucoup de place et coûtent cher en frais.

**Les deux innovations de Taproot** :

```text
1. Signatures Schnorr (remplacement d'ECDSA) :

Avantage principal : l'aggregation de signatures.
- Avant (ECDSA) : 3 signataires = 3 signatures séparées dans le bloc
- Après (Schnorr) : 3 signataires = 1 seule signature aggregee

Conséquence : une transaction multisig ressemble à une transaction simple
sur la blockchain. Même taille, même coût, même apparence.

2. MAST (Merkelized Abstract Syntax Trees) :

Principe : les conditions de depense complexes sont organisees en arbre
de Merkle. Seule la condition utilisée est revelee, pas toutes les
conditions possibles.

Exemple :
Alice crée un script avec 3 conditions :
a) Alice signe seule (cas normal)
b) Bob et Charlie signent ensemble (si Alice est indisponible)
c) Après 6 mois, quiconque possède la clé de secours peut depenser

Avant (sans MAST) : les 3 conditions sont visibles sur la blockchain
quand la transaction est depensee.

Après (avec MAST) : seule la condition utilisée (par exemple a) est
revelee. Les conditions b et c restent invisibles.
```

**Conséquences de Taproot** :

| Aspect | Avant Taproot | Après Taproot |
| --- | --- | --- |
| Algorithme de signature | ECDSA | Schnorr (plus efficace) |
| Transaction multisig sur la blockchain | Visuellement différente d'une transaction simple | Identique à une transaction simple (meilleure confidentialité) |
| Conditions de dépense complexes | Toutes les conditions sont visibles | Seule la condition utilisée est révélée |
| Format d'adresses | bc1q... (SegWit v0) | bc1p... (SegWit v1, Taproot) |
| Taille des transactions complexes | Grande (toutes les branches du script) | Réduite (seule la branche utilisée) |

**Adoption** : l'adoption de Taproot est plus lente et plus volatile que celle de SegWit. En 2025-2026, environ 15-20% des transactions utilisent Taproot (pic au-dessus de 40% en 2024 lié aux inscriptions/Runes). Les wallets intègrent progressivement le format `bc1p...`.

---

### Bitcoin Cash (BCH) - août 2017

**Définition** : Bitcoin Cash est un hard fork de Bitcoin activé le 1er août 2017. Il est né d'un désaccord fondamental sur la manière de résoudre le problème de scalabilité de Bitcoin.

**Le contexte : le débat sur la taille des blocs**

```text
Le problème (2015-2017) :
- Bitcoin ne peut traiter que ~7 transactions par seconde
- Les frais augmentent quand le réseau est sature
- En décembre 2017, un simple transfert coutait 20-50 $

Deux camps s'affrontent :

Camp 1 : "Big Blockers" (Roger Ver, Jihan Wu)
- Solution : augmenter la taille des blocs (de 1 Mo a 8 Mo, puis plus)
- Argument : plus de transactions par bloc = plus de capacité = frais bas
- Risque identifie par les opposants : les gros blocs rendent les nœuds
  plus coûteux a operer, ce qui réduit la décentralisation

Camp 2 : "Small Blockers" (Bitcoin Core developers)
- Solution : optimiser sans augmenter la taille (SegWit + Layer 2)
- Argument : la décentralisation est plus importante que la vitesse.
  La scalabilité doit venir des couches supérieures (Lightning Network)
- Risque identifie par les opposants : les frais restent élevés sur
  la couche de base, Bitcoin devient inutilisable pour les petits paiements
```

**La scission** :

Le 1er août 2017, les big blockers activent un hard fork. Bitcoin Cash nait avec des blocs de 8 Mo (augmentes ensuite a 32 Mo).

**Bitcoin Cash en chiffres (2025-2026)** :

| Métrique | Bitcoin (BTC) | Bitcoin Cash (BCH) |
| --- | --- | --- |
| Taille maximale des blocs | ~4 Mo (weight units) | 32 Mo |
| Prix (ordre de grandeur) | Dizaines de milliers de dollars | Quelques centaines de dollars |
| Hashrate (puissance de minage) | > 99% du hashrate SHA-256 | < 1% du hashrate SHA-256 |
| Nombre de nœuds | ~15 000 | ~1 000 |
| Adoption par les commercants | Faible mais réelle | Très faible |

**Verdict factuel** : Bitcoin Cash n'a pas réussi à convaincre la majorité de la communauté. Le marché a largement favorisé Bitcoin (BTC). Le hashrate, le prix et l'adoption de BCH sont marginaux par rapport à BTC. L'argument des big blockers (frais bas pour les paiements quotidiens) est partiellement adressé par le Lightning Network sur Bitcoin.

---

### Bitcoin SV (BSV) - novembre 2018

**Définition** : Bitcoin SV ("Satoshi Vision") est un hard fork de Bitcoin Cash, créé en novembre 2018 par Craig Wright et Calvin Ayre. Il pousse la logique des gros blocs à l'extrême avec des blocs pouvant atteindre 4 Go.

**Contexte** : Craig Wright affirme être Satoshi Nakamoto, le créateur de Bitcoin. Il n'a jamais fourni de preuve cryptographique de cette affirmation (signer un message avec les clés de Satoshi). En 2024, un tribunal britannique a statué qu'il n'est pas Satoshi Nakamoto.

**Bitcoin SV en chiffres** :

| Métrique | Valeur |
| --- | --- |
| Taille maximale des blocs | 4 Go (théorique) |
| Prix (2025-2026) | Quelques dizaines de dollars |
| Adoption | Quasi nulle |
| Délisté par les principales plateformes | Oui (Binance, Kraken, ShapeShift) |
| Nombre de transactions réelles | La majorité du volume provient d'inscriptions de données, pas de paiements |

**Verdict factuel** : Bitcoin SV est un exemple de projet dont l'adoption est négligeable malgré une capacité technique élevée (gros blocs). La taille des blocs seule ne suffit pas : la sécurité (hashrate), la décentralisation et l'écosystème de développeurs sont les facteurs déterminants.

---

### Ethereum Classic (ETC) - juillet 2016

**Définition** : Ethereum Classic est la chaîne originale d'Ethereum, qui a continué sans le rollback effectué après le hack de The DAO en juin 2016.

**Le contexte : le hack de The DAO**

```text
Chronologie :

Avril 2016 :
- The DAO (Decentralized Autonomous Organization) est lancee sur Ethereum
- C'est un fonds d'investissement décentralisé : les détenteurs de tokens
  votent pour financer des projets
- The DAO leve ~150 millions $ en ETH (le plus gros crowdfunding de l'époque)

Juin 2016 :
- Un attaquant exploite une faille dans le smart contract de The DAO
- Il siphonne ~60 millions $ d'ETH grâce à une attaque par "reentrancy"
  (appeler la fonction de retrait en boucle avant que le solde soit mis a jour)

Le dilemme :
- Option A : ne rien faire. Le code est la loi, l'attaquant a techniquement
  utilise le contrat tel qu'il était écrit. Les fonds sont perdus.
- Option B : modifier l'historique de la blockchain (hard fork) pour
  annuler le vol et rendre les fonds aux investisseurs.

Le vote de la communauté :
- ~87% des votants choisissent l'option B (hard fork pour annuler le vol)
- La communauté Ethereum effectue le hard fork le 20 juillet 2016

La scission :
- La chaîne avec le rollback devient "Ethereum" (ETH)
- La chaîne originale (sans rollback) continue sous le nom
  "Ethereum Classic" (ETC)
```

**Ethereum Classic en chiffres (2025-2026)** :

| Métrique | Ethereum (ETH) | Ethereum Classic (ETC) |
| --- | --- | --- |
| Consensus | Proof of Stake (depuis The Merge, sept. 2022) | Proof of Work (toujours) |
| Capitalisation | Top 2-3 mondial | En dehors du top 30 |
| Écosystème défi | > 50 milliards de dollars TVL | Quasi inexistant |
| Nombre de développeurs actifs | Des milliers | Quelques dizaines |

**L'argument philosophique d'Ethereum Classic** : "le code est la loi". Si on modifie l'historique de la blockchain pour corriger une erreur humaine, on crée un précédent dangereux. Qui décide quand un rollback est justifié ? Cette question reste un débat philosophique majeur dans l'écosystème crypto.

---

### Ce que les forks révèlent sur la gouvernance

**Définition** : Les forks sont le mécanisme de "dernier recours" de la gouvernance décentralisée. Quand le consensus social échoue, la chaîne se divise.

**Les leçons des grandes scissions** :

| Fork | Leçon |
| --- | --- |
| Bitcoin Cash (2017) | Le désaccord technique peut être profond, mais le marché tranche. La communauté majoritaire l'emporte par le hashrate et l'adoption. |
| Bitcoin SV (2018) | Un projet peut être techniquement viable (gros blocs) mais échouer sans communauté et sans crédibilité. |
| Ethereum Classic (2016) | Les valeurs philosophiques ("le code est la loi") ne suffisent pas a maintenir un écosystème actif. |

**Le paradoxe de la gouvernance décentralisée** :

```text
La décentralisation signifie que personne ne commande.
Mais quand il faut prendre une décision, il faut bien que quelqu'un décide.

En pratique, la gouvernance fonctionne ainsi :

1. Les développeurs proposent des changements (BIP pour Bitcoin, EIP pour Ethereum)
2. La communauté débat (forums, conférences, réseaux sociaux)
3. Les nœuds choisissent quel logiciel exécuter
4. Les mineurs/validateurs choisissent quelle version de la chaîne suivre
5. Le marche tranche (le prix reflete le soutien de la communauté)

Si tout le monde est d'accord : soft fork, la chaîne evolue en douceur.
Si le désaccord est irreductible : hard fork, la chaîne se divise.
```

**Fait** : Bitcoin a volontairement un processus de mise à jour très lent et conservateur. Chaque changement (SegWit a pris ~2 ans de débats, Taproot ~4 ans) est délibéré car la priorité est la stabilité et la sécurité, pas la rapidité d'évolution. C'est un choix délibéré, pas un défaut.

---

## Checklist de Validation

- [ ] Je sais expliquer la différence entre un hard fork et un soft fork
- [ ] Je comprends que les soft forks sont retrocompatibles et les hard forks ne le sont pas
- [ ] Je sais décrire SegWit (signatures séparées, weight units, correction de la malléabilité)
- [ ] Je sais décrire Taproot (signatures Schnorr, MAST, meilleure confidentialité)
- [ ] Je connais l'histoire de Bitcoin Cash et le débat big blocks vs small blocks
- [ ] Je sais que Bitcoin SV à une adoption quasi nulle malgré ses gros blocs
- [ ] Je connais l'histoire du hack de The DAO et la naissance d'Ethereum Classic
- [ ] Je comprends le paradoxe de la gouvernance décentralisée (personne ne commande, mais il faut décider)
- [ ] Je sais que les forks révèlent les tensions de gouvernance dans les protocoles
- [ ] Je comprends que chaque fork divise la communauté et la sécurité du réseau

---

## Navigation

← Fiche précédente : **[Bitcoin en chiffres : supply, halving et adoption réelle](05-bitcoin-chiffres-adoption-reelle.md)**

→ Phase suivante : **[Phase 3 - Ethereum et les smart contracts](../03-ethereum-smart-contracts/index.md)**
