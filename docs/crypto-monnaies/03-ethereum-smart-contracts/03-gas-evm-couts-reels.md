---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Gas et EVM : combien coûte réellement l'utilisation d'Ethereum et pourquoi"
estimated_time: "40 min"
fiche_number: 3
total_fiches: 4
cursus: "Phase 3 - Ethereum et les smart contracts"
---

# 03 - Gas, EVM et les coûts réels d'utilisation

> **En bref** : Comprendre comment fonctionne la machine virtuelle d'Ethereum, pourquoi chaque opération à un coût et combien coûte réellement l'utilisation du réseau. Lecture estimée : 40 min.

## Prérequis

- [Fiche 01 - Ethereum : ce que Bitcoin ne fait pas](01-ethereum-au-dela-de-bitcoin.md)
- [Fiche 02 - Smart contracts : du code, pas de la magie](02-smart-contracts-du-code.md)
- Savoir ce qu'est un smart contract et un compte Ethereum

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce qu'est l'EVM, pourquoi le gas existe, comment les frais sont calcules (base fee, tip, EIP-1559), et estimer le coût réel d'une transaction sur Ethereum.

---

## Concepts

### L'EVM : un ordinateur mondial partage

**Définition** : L'EVM (Ethereum Virtual Machine) est la machine virtuelle qui exécute les smart contracts sur Ethereum. Chaque nœud du réseau fait tourner une copie identique de l'EVM, ce qui garantit que tous les nœuds arrivent au même résultat pour chaque transaction.

**Le problème que l'EVM résout** :

Sans machine virtuelle commune :

1. **Résultats différents** : si chaque nœud executait le code avec son propre processeur et système d'exploitation, les résultats pourraient varier (arrondis différents, comportements spécifiques au matériel).
2. **Pas de consensus sur l'état** : les nœuds ne pourraient pas se mettre d'accord sur le résultat d'un smart contract.
3. **Sécurité impossible** : un programme pourrait accéder au disque dur, au réseau ou à la mémoire du nœud qui l'exécute.

**Comment l'EVM résout ces problèmes** :

| Problème | Solution apportée par l'EVM |
| --- | --- |
| Résultats différents | L'EVM définit un jeu d'instructions précis qui produit le même résultat sur toute machine |
| Pas de consensus | Tous les nœuds exécutent le même code dans le même environnement |
| Sécurité | L'EVM est un environnement isole (sandbox) : le code ne peut pas accéder au système hôte |

**Analogie concrète** : L'EVM est comme une salle d'examen standardisee. Chaque etudiant (nœud) reçoit le même sujet (transaction), utilise les mêmes outils autorises (jeu d'instructions EVM) et travaille dans les mêmes conditions (environnement isole). Le résultat est le même pour tous ceux qui calculent correctement.

**Ce que l'EVM n'est PAS** :

- L'EVM n'est pas un ordinateur physique. C'est un logiciel qui simule un ordinateur très simple. Elle ne peut exécuter qu'environ 140 opérations différentes (opcodes).
- L'EVM n'est pas rapide. Elle est extrêmement lente comparée à un ordinateur normal. C'est delibere : la priorité est le determinisme et la sécurité, pas la performance.

**Comparaison avec un ordinateur classique** :

| Ordinateur classique | EVM |
| --- | --- |
| Milliards d'opérations par seconde | Quelques millions d'opérations par bloc |
| Accès au disque, réseau, peripheriques | Accès uniquement à la blockchain |
| Peut exécuter n'importe quel programme | Limité à environ 140 opcodes |
| Un seul utilisateur | Partagé par tous les utilisateurs d'Ethereum |
| Gratuit une fois acheté | Chaque opération coûte du gas |

---

### Qu'est-ce que le gas ?

**Définition** : Le gas est l'unité de mesure du coût de calcul sur Ethereum. Chaque opération exécutée par l'EVM consomme une quantité fixe de gas. Le gas n'est pas une monnaie : c'est une unité de mesure qui est ensuite convertie en ETH pour le paiement.

**Le problème que le gas résout** :

Sans mécanisme de gas :

1. **Boucles infinies** : un programme malveillant ou bugge pourrait tourner indéfiniment, bloquant tout le réseau.
2. **Spam gratuit** : envoyer des millions de transactions coûterait zéro, ce qui saturerait le réseau.
3. **Pas de priorité** : toutes les transactions auraient la même importance, sans moyen de prioriser les urgentes.

**Comment le gas résout ces problèmes** :

| Problème | Solution apportée par le gas |
| --- | --- |
| Boucles infinies | L'utilisateur fixe un gas limit. Quand le gas est epuise, l'exécution s'arrête |
| Spam gratuit | Chaque opération coûte du gas (donc de l'ETH), rendant le spam coûteux |
| Pas de priorité | Les utilisateurs prêts à payér plus de gas sont traités en priorité |

**Coût en gas des opérations courantes** :

| Opération | Coût en gas |
| --- | --- |
| Addition de deux nombres | 3 gas |
| Multiplication | 5 gas |
| Lecture d'une variable stockée | 2 100 gas |
| Écriture d'une nouvelle variable | 20 000 gas |
| Modification d'une variable existante | 5 000 gas |
| Transfert d'ETH simple | 21 000 gas (fixe) |

**Observation importante** : stocker des données sur la blockchain (écriture) coûte beaucoup plus cher que les calculs. C'est logique : un calcul est ephemere, mais une donnée stockée doit être conservee par tous les nœuds du réseau pour toujours.

**Analogie concrète** : Le gas fonctionne comme le compteur d'une cabine téléphonique (pour ceux qui s'en souviennent). Tu inseres des pièces (ETH), chaque seconde de conversation (opération) consomme une unité. Quand tes pièces sont epuisees, la communication est coupee. Tu ne peux pas parler indéfiniment sans payér.

---

### Gas price, gas limit et le calcul des frais

**Définition** : Le coût total d'une transaction sur Ethereum dépend de deux facteurs : la quantité de gas consommee et le prix payé par unité de gas.

**La formule** :

```text
Coût total (en ETH) = Gas utilise x Prix par unité de gas (en gwei)

1 gwei = 0,000000001 ETH (un milliardieme d'ETH)
```

**Les composants d'une transaction** :

| Composant | Définition | Qui le fixe ? |
| --- | --- | --- |
| Gas limit | Quantité maximale de gas que l'utilisateur est prêt à dépenser | L'utilisateur |
| Gas utilise | Quantité de gas réellement consommee par la transaction | Determinee par l'EVM |
| Gas price | Prix payé par unité de gas (en gwei) | L'utilisateur (via base fee + tip) |

**Exemple concret** :

```text
Transfert simple d'ETH :
- Gas limit fixe par l'utilisateur : 30 000
- Gas réellement utilise : 21 000 (c'est fixe pour un transfert simple)
- Prix par unité : 20 gwei

Coût = 21 000 x 20 gwei = 420 000 gwei = 0,00042 ETH

Si 1 ETH = 3 000 euros :
Coût en euros = 0,00042 x 3 000 = 1,26 euros
```

**Que se passe-t-il si le gas limit est atteint ?**

Si une transaction consomme tout le gas avant de finir :

- L'exécution est annulee (toutes les modifications sont annulees).
- Mais le gas est quand même dépensé (il n'est pas remboursé).
- C'est comme si tu avais payé pour un trajet en taxi mais que le taxi était tombe en panne avant d'arriver. Tu paies quand même la course.

**Que se passe-t-il si le gas limit est plus grand que nécessaire ?**

- Seul le gas réellement utilise est facture. Le surplus est rendu.
- Fixer un gas limit trop haut ne coûte rien de plus (tant que la transaction réussit).

---

### EIP-1559 : le nouveau modèle de frais

**Définition** : L'EIP-1559, active en août 2021 (London upgrade), a modifie le mécanisme de frais d'Ethereum. Au lieu d'un prix unique par unité de gas, les frais sont divises en deux parties : une base fee (brulee) et un tip (envoyé au validateur).

**Le problème que l'EIP-1559 résout** :

Avant l'EIP-1559, les utilisateurs devaient deviner le bon prix a payér :

1. **Imprevisibilite** : les frais changeaient d'un bloc à l'autre. Il était difficile de savoir combien payér.
2. **Surpaiement systematique** : par peur que la transaction échoue, les utilisateurs payaient souvent trop.
3. **Manipulation par les validateurs** : les mineurs (a l'époque PoW) pouvaient manipuler l'ordre des transactions pour leur profit.

**Le mécanisme EIP-1559** :

| Composant | Rôle | Ce qui lui arrive |
| --- | --- | --- |
| Base fee | Prix minimum par unité de gas pour être inclus dans un bloc | Brule (détruit) - ni l'utilisateur ni le validateur ne la récupère |
| Priority fee (tip) | Pourboire optionnel pour inciter le validateur a inclure ta transaction | Va au validateur |
| Max fee | Prix maximum total que l'utilisateur accepte de payér | Le surplus (max fee - base fee - tip) est rendu à l'utilisateur |

**Comment la base fee évolue** :

```text
La base fee s'ajuste automatiquement bloc par bloc :

- Si le bloc précédent était plein (plus de 50% de sa capacité) :
  -> La base fee augmente (jusqu'à +12,5% par bloc)

- Si le bloc précédent était vide (moins de 50% de sa capacité) :
  -> La base fee diminue (jusqu'à -12,5% par bloc)

Objectif : maintenir les blocs a environ 50% de leur capacité.
```

**Analogie concrète** : C'est comme un peage autoroutier dynamique. Quand l'autoroute est congestionnee, le prix du peage augmente pour decourager les vehicules non urgents. Quand l'autoroute est vide, le prix diminue pour attirer du trafic. Le peage (base fee) n'est pas récupéré par le gestionnaire - il est détruit.

---

### Le burn de l'EIP-1559

**Définition** : Depuis l'EIP-1559, la base fee de chaque transaction est brulee (detruite). Ces ETH disparaissent définitivement de la circulation. Ce mécanisme rend ETH potentiellement déflationniste.

**Pourquoi brûler la base fee ?**

| Sans burn | Avec burn |
| --- | --- |
| Les frais vont aux validateurs | Seul le tip va aux validateurs |
| Les validateurs ont intérêt a congestionner le réseau pour augmenter les frais | Les validateurs ne profitent pas de la congestion (la base fee est brulee) |
| L'offre d'ETH augmente indéfiniment | L'offre d'ETH peut diminuer si le burn dépasse les nouvelles émissions |

**Chiffres factuels** :

Depuis l'activation de l'EIP-1559 (août 2021) et The Merge (septembre 2022), le burn moyen a souvent dépasse les nouvelles émissions d'ETH. Quand le réseau est très utilise, plus d'ETH sont detruits que créés.

```text
Émission d'ETH par bloc (PoS) : environ 0,02 ETH
Si la base fee est élevée : le burn par bloc peut dépasser 0,02 ETH
  -> ETH est déflationniste (la quantité totale diminue)

Si la base fee est faible : le burn est inférieur a 0,02 ETH
  -> ETH est inflationniste (la quantité totale augmente)
```

**Point critique** : la deflation d'ETH n'est pas garantie. Elle dépend entièrement du niveau d'utilisation du réseau. Si le réseau est peu utilise, ETH redevient inflationniste. Ceux qui presentent ETH comme "toujours déflationniste" simplifient excessivement la réalité.

---

### Combien coûte réellement Ethereum ?

**Définition** : Le coût d'utilisation d'Ethereum varie énormément selon le type d'opération et la congestion du réseau. Voici des estimations basées sur des données réelles.

**Coût en gas par type d'opération** :

| Opération | Gas consomme | Coût a 20 gwei (réseau calme) | Coût a 200 gwei (réseau congestionne) |
| --- | --- | --- | --- |
| Transfert d'ETH | 21 000 | 0,00042 ETH | 0,0042 ETH |
| Transfert d'un token ERC-20 | 65 000 | 0,0013 ETH | 0,013 ETH |
| Approbation d'un token (approve) | 46 000 | 0,00092 ETH | 0,0092 ETH |
| Swap sur Uniswap | 150 000 | 0,003 ETH | 0,03 ETH |
| Ajout de liquidité sur un DEX | 250 000 | 0,005 ETH | 0,05 ETH |
| Déploiement d'un smart contract simple | 1 000 000 | 0,02 ETH | 0,2 ETH |
| Déploiement d'un smart contract complexe | 5 000 000 | 0,1 ETH | 1 ETH |
| Mint d'un NFT | 100 000 | 0,002 ETH | 0,02 ETH |

**Conversion en euros** (avec 1 ETH = 3 000 euros) :

| Opération | Réseau calme (20 gwei) | Réseau congestionne (200 gwei) |
| --- | --- | --- |
| Transfert d'ETH | 1,26 EUR | 12,60 EUR |
| Transfert ERC-20 | 3,90 EUR | 39,00 EUR |
| Swap Uniswap | 9,00 EUR | 90,00 EUR |
| Déploiement simple | 60,00 EUR | 600,00 EUR |
| Déploiement complexe | 300,00 EUR | 3 000,00 EUR |

**La réalité historique des frais** :

| Période | Base fee moyenne | Contexte |
| --- | --- | --- |
| Ete 2020 (défi Summer) | 100-500 gwei | Explosion de la DeFi, congestion extrême |
| Avril-Mai 2021 (NFT mania) | 200-1000 gwei | Pic de spéculation sur les NFTs |
| 2022-2023 (marché baissier) | 10-30 gwei | Baisse d'activité, frais raisonnables |
| 2024-2025 (Layer 2 actifs) | 5-20 gwei | Une partie du trafic a migre vers les Layer 2 |

**Fait marquant** : en mai 2021, un simple swap sur Uniswap pouvait coûter plus de 200 dollars en frais de gas. Un transfert d'ERC-20 pouvait coûter 50 dollars. Cela rendait Ethereum inutilisable pour les petits montants.

---

### Le problème de scalabilité

**Définition** : La scalabilité est la capacité d'un système à gérer un nombre croissant d'utilisateurs et de transactions. Ethereum traite environ 15 a 30 transactions par seconde sur sa couche de base. Ce n'est pas suffisant pour une adoption mondiale.

**Le problème en chiffres** :

| Système | Transactions par seconde |
| --- | --- |
| Ethereum (couche de base) | 15-30 |
| Bitcoin | Environ 7 |
| Visa | ~1 700 en moyenne (capacité maximale théorique : ~65 000) |
| PayPal | Environ 200 |

**Conséquence directe** : quand la demandé dépasse la capacité, les frais explosent. Le réseau fonctionne comme une enchère - les utilisateurs prêts à payér plus passent en premier. Les autres attendent ou abandonnent.

**Les solutions en cours de déploiement (Layer 2)** :

Les "Layer 2" sont des réseaux construits au-dessus d'Ethereum qui traitent les transactions hors de la chaîne principale, puis enregistrent periodiquement un resume sur Ethereum.

| Solution Layer 2 | Type | Transactions par seconde | Frais typiques |
| --- | --- | --- | --- |
| Arbitrum | Optimistic Rollup | 40 000+ | 0,01-0,10 EUR |
| Optimism | Optimistic Rollup | 40 000+ | 0,01-0,10 EUR |
| zkSync | ZK Rollup | 100 000+ (théorique) | 0,01-0,05 EUR |
| Base | Optimistic Rollup | 40 000+ | 0,01-0,05 EUR |

**Ce que les Layer 2 n'eliminent PAS** :

- La complexité pour l'utilisateur : il faut transférer ses fonds d'Ethereum vers un Layer 2, puis éventuellement les retransporter.
- Le risque de fragmentation : les fonds et la liquidité sont repartis entre plusieurs Layer 2.
- La dépendance à Ethereum : la sécurité des Layer 2 repose in fine sur la couche de base d'Ethereum.

---

### Le nonce des transactions Ethereum

**Définition** : Le nonce d'un compte Ethereum est un compteur qui s'incremente de 1 a chaque transaction envoyée depuis ce compte. Le premier envoi d'un compte à le nonce 0, le deuxième le nonce 1, le troisième le nonce 2, et ainsi de suite.

**Le problème que le nonce résout** :

Sans nonce, voici les problèmes rencontrès :

1. **Replay attacks** : un attaquant pourrait copier une transaction valide et la soumettre à nouveau au réseau pour la faire exécuter une deuxième fois. Par exemple, si Alice envoie 1 ETH à Bob, l'attaquant pourrait "rejouer" cette transaction pour envoyer 1 ETH supplémentaire.
2. **Ordre d'exécution indetermine** : si tu envoies 3 transactions en quelques secondes, rien ne garantit qu'elles seront exécutées dans l'ordre où tu les as envoyées.

**Comment le nonce résout ces problèmes** :

| Problème | Solution apportée par le nonce |
| --- | --- |
| Replay attacks | Chaque nonce ne peut être utilise qu'une seule fois. Une transaction avec le nonce 5 ne peut être exécutée qu'une fois. La rejouer échoue car le nonce 5 est déjà consomme |
| Ordre d'exécution | Les transactions sont exécutées dans l'ordre strict de leur nonce : 0, puis 1, puis 2. Pas de saut possible |

**Conséquence pratique : les transactions bloquees** :

```text
Scénario :
- Tu envoies la transaction nonce 0 : exécutée normalement
- Tu envoies la transaction nonce 1 avec un gas trop bas : reste en attente dans le mempool
- Tu envoies la transaction nonce 2 : NE SERA PAS exécutée tant que nonce 1 n'est pas passee

Les transactions forment une file d'attente strictement ordonnee.
Si une transaction est bloquee, toutes les suivantes le sont aussi.

Solution : renvoyer la transaction bloquee (même nonce) avec un gas plus élevé
pour la debloquer, ce qui debloque toute la chaîne.
```

**Ne pas confondre les deux types de nonce** :

| Nonce de compte (Ethereum) | Nonce de minage (Proof of Work) |
| --- | --- |
| Compteur sequentiel lie à un compte | Nombre aléatoire teste par les mineurs |
| Sert a ordonner les transactions et empêcher les replays | Sert a trouver un hash valide pour un bloc |
| Incremente de 1 a chaque transaction | Essaye des milliards de valeurs différentes |
| Utilise dans Ethereum (et d'autres blockchains a comptes) | Utilise dans Bitcoin et les blockchains Proof of Work |

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est l'EVM (machine virtuelle partagée, déterministe, isolée)
- [ ] Je sais pourquoi le gas existe (empêcher le spam, limiter les boucles infinies, inciter les validateurs)
- [ ] Je sais calculer le coût d'une transaction (gas utilise x prix par unité de gas)
- [ ] Je connais le coût en gas d'un transfert simple (21 000 gas)
- [ ] Je sais expliquer l'EIP-1559 (base fee brulee + tip au validateur)
- [ ] Je sais comment la base fee s'ajuste (blocs pleins -> augmente, blocs vides -> diminue)
- [ ] Je comprends le mécanisme de burn et quand ETH est déflationniste vs inflationniste
- [ ] Je connais l'ordre de grandeur des frais (1-10 EUR en réseau calme, 50-200+ EUR en congestion)
- [ ] Je sais qu'Ethereum traite environ 15-30 transactions par seconde (couche de base)
- [ ] Je sais ce qu'est un Layer 2 et pourquoi il existe

---

## Navigation

← Fiche précédente : **[Smart contracts : du code, pas de la magie](02-smart-contracts-du-code.md)**

→ Fiche suivante : **[Anatomie d'un smart contract : lire et comprendre du Solidity](04-anatomie-smart-contract-solidity.md)**
