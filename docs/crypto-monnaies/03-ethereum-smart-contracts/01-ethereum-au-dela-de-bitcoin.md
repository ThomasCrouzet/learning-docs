---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Ethereum : pourquoi il a été créé, ce qu'il ajoute à Bitcoin et comment il fonctionne differemment"
estimated_time: "45 min"
fiche_number: 1
total_fiches: 4
cursus: "Phase 3 - Ethereum et les smart contracts"
---

# 01 - Ethereum : ce que Bitcoin ne fait pas

> **En bref** : Comprendre pourquoi Ethereum a été créé, ce qu'il ajoute à Bitcoin et en quoi son fonctionnement est fondamentalement différent. Lecture estimée : 45 min.

## Prérequis

- [Phase 2 - Bitcoin](../02-bitcoin/index.md) complete (fiches 01 à 06)
- Comprendre ce qu'est une blockchain, une transaction et le Proof of Work
- Savoir ce que fait Bitcoin Script (opérations de base sur les transactions)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi Ethereum a été créé, décrire les différences fondamentales entre Bitcoin et Ethereum, et comprendre le passage du Proof of Work au Proof of Stake.

---

## Concepts

### Les limites de Bitcoin

**Définition** : Bitcoin a été conçu pour un seul objectif : permettre des transferts de valeur sans intermédiaire. Son langage de programmation interne (Bitcoin Script) est volontairement limite pour des raisons de sécurité.

**Le problème que Bitcoin ne résout pas** :

Bitcoin Script peut vérifier des conditions simples (cette clé privée correspond-elle à cette adresse ? le délai est-il expire ?), mais il ne peut pas :

1. **Stocker des données complexes** : Bitcoin Script n'a pas de mémoire persistante. Il ne peut pas enregistrer un état qui change dans le temps.
2. **exécuter des boucles** : Bitcoin Script est volontairement non-Turing-complet. Il ne peut pas exécuter de boucle `for` ou `while`. Chaque script s'exécute de manière linéaire, du début à la fin.
3. **créer des applications programmables** : tu ne peux pas écrire un programme complexe qui tourne sur la blockchain Bitcoin. Tu peux seulement définir des conditions de dépense.

**Analogie concrète** : Bitcoin est une calculatrice. Tu peux faire des additions, des soustractions, quelques opérations. Mais tu ne peux pas lui demander de gérer un tableur, d'envoyer un email ou d'exécuter un programme. C'est volontaire : une calculatrice est simple, fiable et difficile à pirater.

**Pourquoi ces limites existent** : Satoshi Nakamoto a choisi de limiter Bitcoin Script pour réduire les risques de bugs et d'attaques. Moins un système peut faire de choses, moins il y a de facons de le casser. C'est un compromis delibere entre sécurité et fonctionnalité.

---

### Vitalik Buterin et la création d'Ethereum

**Définition** : Ethereum est une blockchain créée par Vitalik Buterin, lancee le 30 juillet 2015. Son objectif est de permettre l'exécution de programmes arbitraires (appelés smart contracts) directement sur la blockchain.

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| Fin 2013 | Vitalik Buterin, 19 ans, publie le whitepaper d'Ethereum |
| Janvier 2014 | Annonce publique du projet lors d'une conférence Bitcoin à Miami |
| Juillet-Août 2014 | Vente participative (ICO) : 31 591 BTC collectes (environ 18 millions de dollars à l'époque) |
| 30 juillet 2015 | Lancement du réseau principal (mainnet) - premier bloc mine |

**Le problème qu'Ethereum prétend résoudre** :

Vitalik Buterin a identifié un problème simple : chaque nouvelle application décentralisée devrait-elle créer sa propre blockchain ? Il a proposé une plateforme unique, programmable, sur laquelle n'importe qui pourrait déployer des programmes.

Sans Ethereum :

1. **Fragmentation** : chaque projet crée sa propre blockchain avec son propre mécanisme de consensus, ce qui multiplie les efforts et les coûts.
2. **Pas d'interaction** : les blockchains séparées ne communiquent pas entre elles.
3. **Barrieres à l'entrée** : créer une blockchain complete est un travail colossal, inaccessible à la plupart des développeurs.

**Comment Ethereum résout ces problèmes** :

| Problème | Solution apportée par Ethereum |
| --- | --- |
| Fragmentation | Une seule blockchain, partagée par tous les programmes |
| Pas d'interaction | Les smart contracts peuvent s'appeler entre eux sur la même blockchain |
| Barrieres à l'entrée | Un développeur écrit un programme et le deploie sur Ethereum, sans créer de blockchain |

**Analogie concrète** : Si Bitcoin est une calculatrice, Ethereum est un smartphone. Le smartphone à un système d'exploitation sur lequel n'importe qui peut installer des applications. Les applications partagent le même appareil, peuvent interagir entre elles, et tu n'as pas besoin de fabriquer un nouveau telephone pour chaque application.

**Ce qu'Ethereum n'est PAS** :

- Ethereum n'est pas "un meilleur Bitcoin". Les deux projets ont des objectifs différents. Bitcoin vise à être une réserve de valeur et un système de paiement. Ethereum vise à être une plateforme d'exécution de programmes.
- Ethereum n'est pas une entreprise. Il n'y a pas de PDG, pas d'actionnaires, pas de siege social. La Fondation Ethereum coordonne le développement, mais ne contrôle pas le réseau.

---

### Le modèle de comptes (vs UTXOs)

**Définition** : Ethereum utilise un modèle de comptes pour suivre les soldes, contrairement à Bitcoin qui utilise le modèle UTXO. Dans le modèle de comptes, chaque adresse à un solde global, comme un compte bancaire.

**Le problème que le modèle de comptes résout** :

Le modèle UTXO de Bitcoin est efficace pour les transferts simples, mais il complique la gestion d'un état persistant (comme le solde d'un token ou le résultat d'un vote).

1. **Complexite pour les programmes** : avec les UTXOs, un smart contract devrait gérer des "pièces" de valeur individuelles au lieu d'un solde simple.
2. **État difficile à suivre** : les UTXOs ne stockent pas d'état. Ils sont consommes et recréés. Un programme a besoin de variables qui persistent et changent dans le temps.

**Comparaison des deux modèles** :

| Modèle UTXO (Bitcoin) | Modèle de comptes (Ethereum) |
| --- | --- |
| Chaque transaction consomme des "pièces" (UTXOs) et en crée de nouvelles | Chaque adresse à un solde global qui augmente ou diminue |
| Pas d'état persistant | Chaque compte à un état (solde, données de stockage) |
| Meilleur pour la confidentialité (adresses à usage unique) | Plus simple à programmer |
| Vérification parallele plus facile | Vérification sequentielle nécessaire |

**Deux types de comptes dans Ethereum** :

| Type | Description | Exemple |
| --- | --- | --- |
| Compte externe (EOA) | Contrôle par une clé privée, appartient à un humain | Ton portefeuille Ethereum |
| Compte de contrat | Contrôle par du code (un smart contract), pas de clé privée | Un contrat de vote, un token ERC-20 |

Un compte externe peut envoyer des transactions. Un compte de contrat ne peut qu'exécuter du code en réponse à une transaction recue.

---

### Ether : le carburant du réseau

**Définition** : Ether (ETH) est la crypto-monnaie native d'Ethereum. Il sert à payér les frais d'exécution des transactions et des smart contracts sur le réseau. Son rôle principal est celui de "carburant" : sans ETH, impossible d'utiliser Ethereum.

**Le problème que l'Ether résout** :

Sans mécanisme de paiement pour les opérations :

1. **Spam illimité** : n'importe qui pourrait envoyer des millions de transactions gratuitement, saturant le réseau.
2. **Boucles infinies** : un programme bugge ou malveillant pourrait tourner indéfiniment, bloquant le réseau entier.
3. **Pas d'incitation pour les validateurs** : personne n'aurait intérêt à valider les transactions et maintenir le réseau.

**Comment l'Ether résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Spam illimité | Chaque opération coûte de l'ETH, rendant le spam coûteux |
| Boucles infinies | Chaque opération consomme du "gas" - quand le gas est epuise, l'exécution s'arrête |
| Pas d'incitation | Les validateurs reçoivent les frais payés en ETH |

**Analogie concrète** : L'Ether est comme l'essence d'une voiture. La voiture (Ethereum) peut aller n'importe où et faire beaucoup de choses, mais chaque kilometre consomme de l'essence. Si tu n'as plus d'essence, la voiture s'arrête. Et le prix de l'essence varie selon la demande.

**ETH et Bitcoin : rôles différents** :

| Bitcoin (BTC) | Ether (ETH) |
| --- | --- |
| Conçu comme monnaie et réserve de valeur | Conçu comme carburant d'une plateforme |
| Offre fixe : 21 millions maximum | Pas de limite fixe, mais mécanisme de burn (destruction) |
| Utilisé principalement pour les transferts | Utilisé principalement pour payér les frais de gas |

---

### The Merge : du Proof of Work au Proof of Stake

**Définition** : The Merge est le nom donne à la transition d'Ethereum du mécanisme de consensus Proof of Work (preuve de travail) vers le Proof of Stake (preuve d'enjeu), effectuée le 15 septembre 2022.

**Le problème que The Merge résout** :

Avant The Merge, Ethereum fonctionnait comme Bitcoin : des mineurs depensaient de l'énergie pour trouver des blocs. Cela posait trois problèmes :

1. **Consommation énergétique massive** : Ethereum en Proof of Work consommait environ 78 TWh par an - comparable à la consommation électrique du Chili.
2. **Centralisation du minage** : le minage favorisait ceux qui avaient accès à de l'électricité bon marché et à du matériel spécialisé.
3. **Barrieres à la participation** : devenir mineur necessitait un investissement important en matériel.

**Comment le Proof of Stake fonctionne** :

Au lieu de dépenser de l'énergie (Proof of Work), les validateurs deposent 32 ETH en garantie (leur "enjeu" - stake). Le protocole selectionne aleatoirement un validateur pour proposer chaque bloc. Si le validateur agit honnement, il reçoit une récompense. S'il triche, il perd une partie de son enjeu (slashing).

| Proof of Work (avant The Merge) | Proof of Stake (après The Merge) |
| --- | --- |
| Les mineurs dépensent de l'énergie | Les validateurs deposent de l'ETH |
| Coût : électricité et matériel | Coût : 32 ETH immobilises |
| Récompense pour le premier qui trouve le nonce | Récompense pour le validateur selectionne aleatoirement |
| Si tu triches : tu as gaspille de l'électricité | Si tu triches : tu perds tes ETH (slashing) |
| Consommation : environ 78 TWh/an | Consommation : environ 0,01 TWh/an (reduction de 99,95%) |

**Chiffres factuels de The Merge** :

| Métrique | Valeur |
| --- | --- |
| Date | 15 septembre 2022, 06:42:42 UTC |
| Bloc de la transition | 15 537 393 |
| Reduction de consommation énergétique | Environ 99,95% |
| Nombre de validateurs actifs (mars 2026) | Environ 1 000 000 |
| Enjeu total depose | Environ 34 millions d'ETH |

**Ce que The Merge n'est PAS** :

- The Merge n'a pas réduit les frais de transaction. Les frais dépendent de la congestion du réseau, pas du mécanisme de consensus. Beaucoup de gens ont été decus parce qu'ils attendaient des frais plus bas.
- The Merge n'a pas augmente la vitesse des transactions. Le temps entre les blocs est passé de 13 secondes en moyenne à 12 secondes. La différence est negligeable pour l'utilisateur.

**Ce que The Merge a changé** :

- La consommation énergétique a chuté de 99,95%.
- La création de nouveaux ETH a diminué d'environ 90%. Combiné avec le mécanisme de burn (EIP-1559), ETH est souvent déflationniste (plus d'ETH detruits que créés).
- Le minage d'Ethereum n'existe plus. Les mineurs ont du se reconvertir vers d'autres blockchains ou arrêter.

---

### Tableau comparatif : Bitcoin vs Ethereum

| Critère | Bitcoin | Ethereum |
| --- | --- | --- |
| Date de lancement | 3 janvier 2009 | 30 juillet 2015 |
| Créateur | Satoshi Nakamoto (pseudonyme) | Vitalik Buterin (identité connue) |
| Objectif principal | Transfert de valeur, réserve de valeur | Plateforme d'exécution de programmes |
| Langage de programmation | Bitcoin Script (limite) | Solidity, Vyper (Turing-complet) |
| Modèle de données | UTXOs | Comptes |
| Consensus actuel | Proof of Work | Proof of Stake (depuis sept. 2022) |
| Temps entre blocs | Environ 10 minutes | Environ 12 secondes |
| Offre maximale | 21 millions BTC | Pas de limite fixe |
| Consommation énergétique | Environ 100-150 TWh/an | Environ 0,01 TWh/an |
| Transactions par seconde (couche de base) | Environ 7 | Environ 15-30 |
| Cas d'usage principal réel | Réserve de valeur, transferts internationaux | défi, tokens, NFTs, applications décentralisées |

**Point important** : ce tableau n'est pas un classement. Bitcoin et Ethereum ont des objectifs différents. Les comparer en termes de "meilleur" ou "moins bon" n'a pas de sens sans préciser le critère d'évaluation.

---

### EIPs et gouvernance d'Ethereum

**Définition** : Un EIP (Ethereum Improvement Proposal) est le processus formel par lequel des modifications au protocole Ethereum sont proposees, discutees et acceptees. C'est le mécanisme de gouvernance technique d'Ethereum.

**Le processus de bout en bout** :

```text
1. Draft (brouillon)
   -> Quelqu'un redige une proposition technique détaillée
   -> Format standardise : motivation, specification, justification

2. Review (examen)
   -> Les core developers (environ 20-30 développeurs actifs)
      examinent la proposition
   -> Discussion publique sur les forums et appels video
   -> Modifications et itérations

3. Last Call (dernier appel)
   -> La proposition est considérée comme finalisee
   -> Dernière chance pour la communauté de soulever des objections

4. Final (acceptee)
   -> La proposition est acceptee et sera intégrée
      dans une prochaîne mise à jour du protocole
```

**Exemples d'EIPs marquants** :

| EIP | Nom usuel | Date d'activation | Ce qu'il change |
| --- | --- | --- | --- |
| EIP-1559 | London upgrade | Août 2021 | Reforme des frais de gas : base fee brulee + tip au validateur |
| EIP-4844 | Proto-danksharding | Mars 2024 | Reduit les coûts de données pour les Layer 2 (blobs) |
| EIP-4337 | Account abstraction | Deploye 2023 | Permet des comptes programmables (social recovery, paiement de gas par un tiers) |

**Qui décide ?**

| Acteur | Rôle | Pouvoir réel |
| --- | --- | --- |
| Core developers | Proposent et implementent les changements | Fort - ils ecrivent le code |
| Validateurs | Choisissent quel logiciel exécuter | Decisif - sans adoption par les validateurs, un changement est mort |
| Utilisateurs et protocoles DeFi | Expriment leurs besoins et préférences | Influence indirecte via la pression sociale et économique |
| Fondation Ethereum | Coordonne et finance la recherche | Influence forte mais pas de pouvoir de veto |

**Ce que la gouvernance Ethereum n'est PAS** :

- La gouvernance Ethereum n'est pas un vote democratique. Il n'y a pas de scrutin où chaque personne à une voix. Les décisions sont prises par un consensus approximatif entre les core developers, valide par l'adoption des validateurs.
- La gouvernance n'est pas rapide. Un EIP peut mettre des mois ou des années entre le brouillon et l'activation. C'est volontaire : les changements au protocole sont risqués et doivent être testes exhaustivement.

**Comparaison avec la gouvernance de Bitcoin (BIPs)** :

| Gouvernance Ethereum (EIPs) | Gouvernance Bitcoin (BIPs) |
| --- | --- |
| Changements relativement fréquents (plusieurs EIPs par an) | Changements très rares et conservateurs |
| Leadership technique visible (Vitalik Buterin, core devs) | Pas de leader identifié (Satoshi a disparu en 2010) |
| Accepte les changements ambitieux (The Merge, PoS) | Résistance forte au changement (débat SegWit a duré des années) |
| Priorise l'innovation | Priorise la stabilité et la sécurité |

---

## Checklist de Validation

- [ ] Je sais expliquer les limites de Bitcoin Script (pas de boucles, pas d'état persistant)
- [ ] Je sais expliquer pourquoi Ethereum a été créé (plateforme programmable unique vs une blockchain par application)
- [ ] Je connais la date de lancement d'Ethereum (30 juillet 2015) et son créateur (Vitalik Buterin)
- [ ] Je sais décrire la différence entre le modèle UTXO (Bitcoin) et le modèle de comptes (Ethereum)
- [ ] Je sais distinguer un compte externe (EOA) d'un compte de contrat
- [ ] Je sais expliquer le rôle de l'Ether (carburant du réseau, paiement du gas)
- [ ] Je sais décrire The Merge (passage PoW vers PoS, 15 septembre 2022)
- [ ] Je sais que The Merge a réduit la consommation énergétique de 99,95% mais n'a pas réduit les frais
- [ ] Je sais nommer au moins 3 différences entre Bitcoin et Ethereum

---

## Navigation

← Phase précédente : **[Phase 2 - Bitcoin](../02-bitcoin/index.md)**

→ Fiche suivante : **[Smart contracts : du code, pas de la magie](02-smart-contracts-du-code.md)**
