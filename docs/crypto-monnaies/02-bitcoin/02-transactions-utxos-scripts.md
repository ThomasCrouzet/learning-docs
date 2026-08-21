---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Transactions Bitcoin : le modèle UTXO, les scripts de vérification et le fonctionnement réel des transferts"
estimated_time: "55 min"
fiche_number: 2
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
id: "specializations.crypto.bitcoin.transactions-utxos-scripts"
course_id: "specializations.crypto"
module_id: "specializations.crypto.bitcoin"
content_type: "lesson"
order: 2
---

# 02 - Transactions Bitcoin : UTXOs, scripts et vérification

> **En bref** : Comprendre comment fonctionne un transfert Bitcoin, du modèle UTXO aux scripts de vérification, en passant par le mempool et les frais. Lecture estimée : 55 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)
- Comprendre ce qu'est une clé privée, une clé publique et une signature numérique

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer comment une transaction Bitcoin fonctionne étape par étape, décrire le modèle UTXO, comprendre le rôle des scripts de vérification, et expliquer pourquoi Bitcoin n'est pas anonyme.

---

## Concepts

### Comment fonctionne un transfert Bitcoin

**Définition** : Un transfert Bitcoin est une opération ou un expéditeur prouve cryptographiquement qu'il à le droit de dépenser certains fonds, puis désigne un ou plusieurs destinataires.

**Le problème que le système de transfert résout** :

Sans un système de transfert décentralisé, voici les problèmes rencontrès :

1. **Double dépense** : rien n'empêche quelqu'un de copier de la monnaie numérique et de la dépenser deux fois (comme copier un fichier MP3).
2. **Tiers de confiance** : il faut une banque pour vérifier que l'expéditeur possède bien les fonds.
3. **Censure** : un intermédiaire peut refuser ou bloquer une transaction.

**Comment Bitcoin résout ces problèmes** :

| Problème | Solution apportée par Bitcoin |
| --- | --- |
| Double dépense | Chaque pièce numérique (UTXO) ne peut être dépensée qu'une seule fois, vérifié par tout le réseau |
| Tiers de confiance | La preuve cryptographique remplace la vérification bancaire |
| Censure | Les transactions sont diffusees à tout le réseau, pas à un seul intermédiaire |

**Les étapes d'un transfert** :

1. Alice veut envoyer 0,5 BTC à Bob.
2. Alice créé une transaction qui référence les fonds qu'elle possède (ses UTXOs).
3. Alice signe la transaction avec sa clé privée (preuve qu'elle est propriétaire des fonds).
4. La transaction est diffusee à tout le réseau Bitcoin.
5. Les nœuds du réseau vérifient que la signature est valide et que les UTXOs n'ont pas déjà été dépenses.
6. Un mineur inclut la transaction dans un bloc.
7. Le bloc est ajoute à la blockchain. La transaction est confirmee.

Le schéma suivant résume le parcours d'une transaction Bitcoin :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-02-bitcoin-02-transactions-utxos-scripts-1.html">Comment fonctionne un transfert Bitcoin (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-02-bitcoin-02-transactions-utxos-scripts-1.html" title="Comment fonctionne un transfert Bitcoin" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Le modèle UTXO

**Définition** : UTXO signifie "Unspent Transaction Output" (sortie de transaction non dépensée). C'est le modèle utilise par Bitcoin pour suivre qui possède quoi. Il n'existe pas de "solde" dans le protocole Bitcoin : il n'y a que des UTXOs.

**Le problème que le modèle UTXO résout** :

Sans le modèle UTXO, voici les problèmes rencontrès :

1. **Gestion des soldes** : un système a solde nécessite de maintenir un état global (le solde de chaque compte), ce qui est complexe a décentralisér.
2. **Vérification de possession** : il faut pouvoir prouver qu'on possède les fonds sans autorité centrale.
3. **Prevention de la double dépense** : il faut pouvoir vérifier rapidement si des fonds ont déjà été dépenses.

**Comment le modèle UTXO résout ces problèmes** :

| Problème | Solution apportée par les UTXOs |
| --- | --- |
| Gestion des soldes | Pas de solde : chaque UTXO est une pièce discrete, indépendante |
| Vérification de possession | Chaque UTXO est verrouille par une condition cryptographique |
| Double dépense | Un UTXO ne peut être dépense qu'une seule fois, vérifié par tout le réseau |

**Analogie concrète** : Tu n'as pas un "solde" dans ton portefeuille physique. Tu as des billets et des pièces spécifiques : un billet de 20 euros, un billet de 10 euros, une pièce de 2 euros. Ton "solde" est la somme de ces billets et pièces. Quand tu paies, tu donnes des billets spécifiques et tu reçois de la monnaie. Les UTXOs fonctionnent exactement pareil.

**Exemple concret** :

```text
Situation initiale :
Alice possède 2 UTXOs :
- UTXO A : 0,3 BTC (reçu dans une transaction précédente)
- UTXO B : 0,5 BTC (reçu dans une autre transaction précédente)

Son "solde" affiche par son wallet : 0,8 BTC (somme de ses UTXOs)

Alice veut envoyer 0,6 BTC à Bob :
- Aucun de ses UTXOs ne fait exactement 0,6 BTC
- Son wallet crée une transaction qui depense les DEUX UTXOs (0,3 + 0,5 = 0,8 BTC)
- La transaction crée 2 nouveaux UTXOs :
  - UTXO C : 0,6 BTC pour Bob (le paiement)
  - UTXO D : 0,1998 BTC pour Alice (la monnaie rendue)
  - 0,0002 BTC de frais pour le mineur

Les anciens UTXOs A et B sont maintenant "depenses" et ne peuvent plus être utilisés.
```

**Ce qu'un UTXO n'est PAS** :

- Un UTXO n'est pas un compte bancaire. Il n'y a pas de solde stocke quelque part. Le wallet calcule le "solde" en additionnant tous les UTXOs que tu controles.
- Un UTXO n'est pas divisible. On ne peut pas dépenser "la moitié" d'un UTXO. On le dépense en entier et on créé de la monnaie.

**Comparaison modèle UTXO vs modèle a solde** :

| Modèle UTXO (Bitcoin) | Modèle a solde (banque, Ethereum) |
| --- | --- |
| Pièces discretes, comme des billets | Solde numérique, comme un compte bancaire |
| Pas d'état global a maintenir | État global de tous les comptes |
| Chaque pièce est indépendante | Les soldes sont interdependants |
| Vérification locale (cette pièce existe-t-elle ?) | Vérification globale (le solde est-il suffisant ?) |
| Plus facile a vérifier en parallele | Plus simple a comprendre pour un humain |

---

### Anatomie d'une transaction

**Définition** : Une transaction Bitcoin est une structure de données composee de trois parties : les inputs (entrées), les outputs (sorties) et les frais.

**Les inputs (entrées)** :

Chaque input référence un UTXO existant que l'expéditeur veut dépenser. L'input contient :

- La référence de la transaction précédente (un hash) et l'index de l'output dans cette transaction
- Le script de deverrouillage (scriptSig) : la preuve que l'expéditeur à le droit de dépenser cet UTXO (généralement une signature numérique + la clé publique)

**Les outputs (sorties)** :

Chaque output créé un nouvel UTXO. L'output contient :

- Le montant en satoshis (1 BTC = 100 000 000 satoshis)
- Le script de verrouillage (scriptPubKey) : les conditions que le futur depenseur devra remplir (généralement : prouver qu'il possède la clé privée correspondant à une adresse donnée)

**Les frais** :

Les frais ne sont pas un champ explicite dans la transaction. Ils sont calcules par différence :

```text
Frais = Somme des inputs - Somme des outputs
```

Si Alice dépense un UTXO de 0,5 BTC et créé des outputs totalisant 0,4998 BTC, la différence (0,0002 BTC) va au mineur qui inclut la transaction dans un bloc.

**Schéma d'une transaction** :

```text
TRANSACTION
+--------------------------------------------------+
|                                                  |
| INPUTS (ce qu'on depense)                        |
| +----------------------------------------------+ |
| | Input 0 :                                    | |
| |   Ref: tx_abc123, output #0                  | |
| |   Script de deverrouillage: [signature + clé]| |
| +----------------------------------------------+ |
| | Input 1 :                                    | |
| |   Ref: tx_def456, output #2                  | |
| |   Script de deverrouillage: [signature + clé]| |
| +----------------------------------------------+ |
|                                                  |
| OUTPUTS (ce qu'on crée)                          |
| +----------------------------------------------+ |
| | Output 0 : 0,6 BTC                           | |
| |   Script de verrouillage: [adresse de Bob]   | |
| +----------------------------------------------+ |
| | Output 1 : 0,1998 BTC                        | |
| |   Script de verrouillage: [adresse d'Alice]  | |
| +----------------------------------------------+ |
|                                                  |
| FRAIS IMPLICITES : 0,0002 BTC                   |
| (somme inputs - somme outputs)                   |
+--------------------------------------------------+
```

---

### Scripts Bitcoin

**Définition** : Bitcoin utilise un mini-langage de programmation appelé _Script_ pour définir les conditions sous lesquelles un UTXO peut être dépense. Ce langage est volontairement limite.

**Le problème que les scripts résolvent** :

Sans scripts, les conditions de dépense seraient fixes : une seule clé privée, un seul propriétaire. Les scripts permettent des conditions plus souples.

**Comment les scripts résolvent ce problème** :

| Besoin | Script utilise |
| --- | --- |
| Transfert simple (une personne) | P2PKH : "prouve que tu possedes la clé privée de cette adresse" |
| Multi-signature (2 sur 3) | P2SH : "2 des 3 clés autorisées doivent signer" |
| Verrouillage temporel | Timelock : "cet UTXO ne peut être dépense qu'après le bloc 800 000" |

**Analogie concrète** : Le script de verrouillage est un cadenas. Le script de deverrouillage est la clé. Quand on créé un output, on pose un cadenas dessus. Pour le dépenser, il faut fournir la bonne clé. Le cadenas le plus courant dit : "seule la personne qui possède cette clé privée peut ouvrir". Mais on peut aussi créer des cadenas plus complexes : "il faut deux clés sur trois pour ouvrir" (multi-signature).

**Ce que Bitcoin Script n'est PAS** :

- Bitcoin Script n'est PAS Turing-complet. Il ne peut pas exécuter de boucles ou de programmes complexes. C'est un choix délibéré de sécurité : un script s'exécute et termine toujours.
- Bitcoin Script n'est PAS un langage de smart contracts. Les smart contracts (comme sur Ethereum) permettent des programmes arbitrairement complexes. Bitcoin Script permet uniquement de définir des conditions de dépense.

**Fonctionnement technique simplifie** :

```text
Étape 1 : Alice crée un output avec un script de verrouillage
  scriptPubKey : "Vérifie que la signature correspond à l'adresse 1A1zP1..."

Étape 2 : Bob veut depenser cet output, il fournit un script de deverrouillage
  scriptSig : "[signature de Bob] [clé publique de Bob]"

Étape 3 : Le nœud exécute les deux scripts ensemble
  1. Il met la clé publique de Bob sur la pile
  2. Il met la signature de Bob sur la pile
  3. Il vérifie que la clé publique correspond à l'adresse 1A1zP1...
  4. Il vérifie que la signature est valide pour cette transaction
  5. Si tout est correct : la transaction est valide
```

---

### Le processus de vérification par les nœuds

**Définition** : Un nœud Bitcoin est un ordinateur qui exécute le logiciel Bitcoin et qui vérifie indépendamment chaque transaction qu'il reçoit. Chaque nœud applique exactement les mêmes règles.

**Les vérifications effectuées par chaque nœud** :

Quand un nœud reçoit une transaction, il vérifie dans cet ordre :

1. **Format** : la transaction respecte-t-elle le format technique attendu ?
2. **Inputs existants** : les UTXOs références dans les inputs existent-ils réellement ?
3. **Non déjà dépenses** : ces UTXOs n'ont-ils pas déjà été dépenses par une autre transaction ?
4. **Scripts valides** : les scripts de deverrouillage satisfont-ils les scripts de verrouillage ?
5. **Montants coherents** : la somme des outputs est-elle inférieure ou égale à la somme des inputs ? (la différence étant les frais)
6. **Pas de création de bitcoins** : la transaction ne créé pas de bitcoins à partir de rien (seule la transaction coinbase d'un bloc peut le faire)

Si une seule de ces vérifications échoue, la transaction est rejetee. Le nœud ne la transmet pas aux autres nœuds.

---

### Le mempool

**Définition** : Le mempool (contraction de "memory pool") est l'ensemble des transactions valides qui ont été vérifiees par un nœud mais qui n'ont pas encore été incluses dans un bloc.

**Le problème que le mempool résout** :

Sans mempool, voici les problèmes rencontrès :

1. **Perte de transactions** : les transactions non encore minees seraient perdues.
2. **Pas de file d'attente** : les mineurs n'auraient pas de transactions a inclure dans les blocs.

**Analogie concrète** : Le mempool, c'est la salle d'attente d'un bureau de poste. Les transactions arrivent et attendent leur tour. Celles qui "paient plus" (frais plus élevés) passent en priorité. Chaque nœud a sa propre salle d'attente, qui peut differer légèrement de celle des autres nœuds.

**Points importants** :

- Chaque nœud a son propre mempool. Il n'existe pas un mempool unique pour tout le réseau.
- Les transactions restent dans le mempool jusqu'à ce qu'un mineur les inclue dans un bloc.
- Si le mempool est plein, les transactions avec les frais les plus bas sont supprimees.
- Une transaction peut rester dans le mempool pendant des heures, voire des jours, si les frais sont trop bas.

---

### Les frais de transaction

**Définition** : Les frais de transaction sont le montant que l'expéditeur paie au mineur pour inclure sa transaction dans un bloc. Ce montant est la différence entre la somme des inputs et la somme des outputs.

**Le problème que les frais résolvent** :

Sans frais, voici les problèmes rencontrès :

1. **Spam** : n'importe qui pourrait inonder le réseau de transactions gratuites.
2. **Absence d'incitation** : les mineurs n'auraient aucune raison d'inclure les transactions dans leurs blocs (a part la récompense de bloc, qui diminue avec le temps).

**Comment les frais sont determines** :

Les frais fonctionnent comme un marché d'enchères :

| Situation du réseau | Frais typiques | Temps d'attente |
| --- | --- |--- |
| Peu de transactions (réseau calme) | Quelques centimes d'euro | Quelques minutes a 1 heure |
| Trafic normal | 1 a 5 euros | 10 minutes a 2 heures |
| Forte congestion | 10 a 50+ euros | Quelques heures |
| Congestion extrême (bull run) | 50 a 100+ euros | Variable |

Les frais ne dépendent pas du montant envoyé mais de la taille de la transaction en octets. Envoyer 0,001 BTC ou 1000 BTC coûte le même prix en frais si les transactions ont la même taille.

**Ce que les frais ne sont PAS** :

- Les frais ne sont pas fixes. Ils varient constamment en fonction de la demande.
- Les frais ne sont pas un pourcentage du montant envoyé (contrairement aux frais bancaires).
- Les frais ne sont pas optionnels. Une transaction sans frais (ou avec des frais trop bas) ne sera jamais confirmee.

---

### SegWit, Taproot et les évolutions du protocole

Les types de transactions Bitcoin ont évolué au fil du temps. Le format original (P2PKH, adresses commençant par `1`) a été complété par de nouveaux formats plus efficaces :

| Format | Adresse | Introduction |
| ------ | ------- | ------------ |
| P2PKH (legacy) | `1...` | 2009 (originel) |
| P2SH | `3...` | 2012 (BIP-16) |
| P2WPKH (SegWit) | `bc1q...` | 2017 (SegWit) |
| P2TR (Taproot) | `bc1p...` | 2021 (Taproot) |

Ces évolutions sont détaillées dans la [fiche 06 - Forks et évolution des protocoles](06-forks-evolution-protocoles.md).

---

### Pourquoi Bitcoin n'est PAS anonyme

**Définition** : Bitcoin est pseudonyme, pas anonyme. Chaque transaction est enregistrée définitivement dans la blockchain et visible par tout le monde. Les adresses ne contiennent pas de nom, mais toute l'activité d'une adresse est publique.

**Le problème de la confusion** :

Beaucoup de gens pensent que Bitcoin est anonyme parce que les adresses ne contiennent pas de nom. C'est faux. Voici pourquoi :

1. **Chaque transaction est publique** : n'importe qui peut voir toutes les transactions sur un explorateur de blocs (`mempool.space`, `blockchain.info`).
2. **Les adresses sont tracables** : si une adresse est liee à une identité (par exemple via une plateforme d'échange qui demandé une pièce d'identité), tout l'historique de cette adresse est attribuable a cette personne.
3. **L'analyse de chaîne existe** : des entreprises specialisees (Chainalysis, Elliptic) utilisent des algorithmes pour relier des adresses entre elles et identifier les propriétaires.

**Comparaison avec l'anonymat réel** :

| Aspect | Bitcoin (pseudonyme) | Espèces (plus anonyme) |
| --- | --- | --- |
| Historique des transactions | Chaque transaction est enregistrée pour toujours | Aucun historique une fois l'échange fait |
| Lien avec l'identité | Possible via les plateformes d'échange | Difficile a établir |
| Tracabilite | Complete via l'analyse de chaîne | Quasiment impossible |
| Visibilite | Toutes les transactions sont publiques | Seuls l'acheteur et le vendeur savent |

**Analogie concrète** : Utiliser Bitcoin, c'est comme écrire sous un pseudonyme sur un forum public. Tes messages sont visibles par tout le monde. Tant que personne ne connaît ton pseudonyme, tu es tranquille. Mais si un jour quelqu'un fait le lien entre ton pseudonyme et ton nom réel, tout ton historique de messages devient attribuable.

---

## Checklist de Validation

- [ ] Je sais expliquer ce qu'est un UTXO et pourquoi il n'y a pas de "solde" dans Bitcoin
- [ ] Je sais décrire les trois parties d'une transaction (inputs, outputs, frais)
- [ ] Je comprends le concept de "monnaie rendue" (change) dans une transaction
- [ ] Je sais expliquer a quoi servent les scripts Bitcoin (verrouillage et deverrouillage)
- [ ] Je sais que Bitcoin Script n'est PAS Turing-complet et pourquoi
- [ ] Je connais les 6 vérifications effectuées par un nœud sur chaque transaction
- [ ] Je sais expliquer ce qu'est le mempool
- [ ] Je comprends comment les frais de transaction fonctionnent (marché d'enchères, taille en octets)
- [ ] Je sais expliquer pourquoi Bitcoin est pseudonyme et pas anonyme

---

## Navigation

← Fiche précédente : **[Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)**

→ Fiche suivante : **[Proof of Work : le consensus par l'énergie](03-proof-of-work-consensus-energie.md)**
