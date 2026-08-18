---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "La blockchain : une structure de données chaînée, pas une révolution magique"
estimated_time: "40 min"
fiche_number: 4
total_fiches: 4
cursus: "Phase 1 - Fondamentaux"
---

# 04 - Blockchain : une structure de données, pas une révolution magique

> **En bref** : Comprendre ce qu'est réellement une blockchain, comment elle fonctionne techniquement, ce qu'elle fait bien et ce qu'elle ne fait pas bien. Lecture estimée : 40 min.

## Prérequis

- [Fiche 01 - La monnaie : fonctions, confiance et limites](01-monnaie-fonctions-confiance-limites.md)
- [Fiche 02 - Cryptographie essentielle](02-cryptographie-essentielle.md) (en particulier : fonctions de hachage)
- [Fiche 03 - Réseaux pair-à-pair et décentralisation](03-reseaux-pair-a-pair-decentralisation.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire la structure interne d'un bloc, expliquer pourquoi la blockchain est difficile à falsifier, comprendre l'arbre de Merkle, et évaluer si un cas d'usage nécessite réellement une blockchain.

---

## Concepts

### Qu'est-ce qu'une blockchain ?

**Définition** : Une blockchain est une liste chaînée de blocs de données, où chaque bloc contient un ensemble de transactions et le hash (empreinte numérique) du bloc précédent. Cette structure rend extrêmement difficile la modification des données déjà enregistrées.

**Le problème que la blockchain résout** :

Sans blockchain, voici les problèmes rencontrés dans un réseau décentralisé :

1. **Pas d'historique fiable** : dans un réseau sans serveur central, comment s'assurer que tout le monde à le même historique de transactions ?
2. **Risque de falsification** : un participant malhonnête pourrait modifier d'anciennes transactions pour se donner de l'argent qu'il n'a pas.
3. **Pas d'ordre chronologique garanti** : sans autorité centrale, comment savoir quelle transaction est arrivée en premier ?

**Comment la blockchain résout ces problèmes** :

| Problème | Solution apportée par la blockchain |
| --- | --- |
| Pas d'historique fiable | Chaque nœud possède une copie complète de la chaîne |
| Risque de falsification | Modifier un bloc oblige à recalculer tous les blocs suivants |
| Pas d'ordre chronologique | Les blocs sont numérotés et enchaînés dans un ordre précis |

**Analogie concrète** : Un registre comptable dont chaque page référence la précédente. La page 50 contient un résumé chiffré de la page 49. La page 49 contient un résumé chiffré de la page 48. Et ainsi de suite jusqu'à la page 1. Si quelqu'un modifie un chiffre sur la page 30, le résumé de la page 30 change. Donc le résumé de la page 31 ne correspond plus. Et toutes les pages suivantes deviennent invalides. Pour tricher, il faudrait réécrire les 20 pages suivantes, ce qui est très coûteux.

**Ce qu'une blockchain n'est PAS** :

- Une blockchain n'est pas une base de données classique. Une base de données permet de modifier et supprimer des données facilement. Une blockchain est conçue pour rendre la modification extrêmement difficile.
- Une blockchain n'est pas un système de stockage de fichiers. Stocker des données sur une blockchain coûte très cher (chaque octet est répliqué sur des milliers de nœuds).
- Une blockchain n'est pas une solution à tous les problèmes. Dans la plupart des cas, une base de données classique est plus rapide, moins coûteuse et plus adaptée.

---

### Structure d'un bloc

**Définition** : Un bloc est l'unité de base d'une blockchain. Il est composé de deux parties : un header (en-tête) qui contient les métadonnées du bloc, et un body (corps) qui contient les transactions.

**Schéma de la structure d'un bloc** :

```text
┌─────────────────────────────────────────────┐
│                 BLOC #542                    │
├─────────────────────────────────────────────┤
│  HEADER (en-tête)                           │
│  ┌─────────────────────────────────────┐    │
│  │ Hash du bloc précédent (#541) :     │    │
│  │   0000a8f3...7c2e                   │    │
│  │                                     │    │
│  │ Timestamp :                         │    │
│  │   2024-01-15 14:32:07 UTC           │    │
│  │                                     │    │
│  │ Nonce :                             │    │
│  │   2,784,912                         │    │
│  │                                     │    │
│  │ Merkle Root :                       │    │
│  │   b4c7d2...a91f                     │    │
│  └─────────────────────────────────────┘    │
├─────────────────────────────────────────────┤
│  BODY (corps)                               │
│  ┌─────────────────────────────────────┐    │
│  │ Transaction 1 : Alice → Bob  0.5 BTC│    │
│  │ Transaction 2 : Carol → Dave 1.2 BTC│    │
│  │ Transaction 3 : Eve → Frank 0.1 BTC │    │
│  │ ... (jusqu'à plusieurs milliers)    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Explication de chaque élément du header** :

- **Hash du bloc précédent** : l'empreinte numérique du bloc qui vient juste avant dans la chaîne. C'est ce lien qui forme la "chaîne" dans "blockchain". Si le bloc précédent est modifié, son hash change, et le lien est cassé.

- **Timestamp** : la date et l'heure à laquelle le bloc a été créé. Cela permet d'établir un ordre chronologique.

- **Nonce** : un nombre que les mineurs modifient pour trouver un hash valide (ce concept sera expliqué en détail dans la Phase 2, fiche sur le Proof of Work). Pour l'instant, retiens que c'est un nombre utilisé dans un calcul coûteux.

- **Merkle Root** : un hash unique qui résume toutes les transactions du bloc en une seule empreinte. Il permet de vérifier rapidement si une transaction fait partie du bloc (expliqué plus bas dans cette fiche).

---

### Comment les blocs sont chaînes

**Définition** : Le chaînage des blocs est le mécanisme qui lie chaque bloc au précédent via son hash, formant une chaîne continue et chronologique depuis le tout premier bloc (appelé "bloc genesis").

**Schéma du chaînage** :

```text
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│ Bloc #0  │←───│ Bloc #1  │←───│ Bloc #2  │←───│ Bloc #3  │
│ (genesis)│    │          │    │          │    │          │
│          │    │ Hash #0: │    │ Hash #1: │    │ Hash #2: │
│ Hash:    │    │ a3f2...  │    │ 7b1c...  │    │ e4d9...  │
│ a3f2...  │    │          │    │          │    │          │
│          │    │ Hash:    │    │ Hash:    │    │ Hash:    │
│          │    │ 7b1c...  │    │ e4d9...  │    │ 1f5a...  │
└──────────┘    └──────────┘    └──────────┘    └──────────┘

Chaque bloc contient le hash du bloc précédent.
La flèche ← signifie "référence".
```

Le diagramme suivant illustre le chaînage des blocs par leurs empreintes :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-01-fondamentaux-04-blockchain-structure-de-donnees-1.html">Comment les blocs sont chaînes (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-01-fondamentaux-04-blockchain-structure-de-donnees-1.html" title="Comment les blocs sont chaînes" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Pourquoi c'est difficile à falsifier** :

Imagine qu'un attaquant veut modifier une transaction dans le Bloc #1 :

1. Il modifie la transaction dans le Bloc #1
2. Le hash du Bloc #1 change (car le contenu a change)
3. Le Bloc #2 contient l'ancien hash du Bloc #1, qui ne correspond plus
4. L'attaquant doit donc recalculer le Bloc #2 avec le nouveau hash
5. Mais recalculer un bloc demandé un travail énorme (Proof of Work)
6. Et modifier le Bloc #2 change aussi son hash, donc il faut recalculer le Bloc #3
7. Et ainsi de suite pour tous les blocs suivants

**Résultat** : plus un bloc est ancien (plus il y a de blocs après lui), plus il est difficile à modifier. Sur Bitcoin, une transaction avec 6 blocs de confirmation est considérée comme pratiquement irréversible, car il faudrait recalculer 6 blocs - ce qui coûterait des millions de dollars en électricité.

---

### L'arbre de Merkle

**Définition** : Un arbre de Merkle (Merkle tree) est une structure de données en forme d'arbre où chaque nœud contient le hash de ses nœuds enfants. À la racine (le "Merkle root"), un seul hash résume l'ensemble de toutes les transactions du bloc.

**Le problème que l'arbre de Merkle résout** :

Sans arbre de Merkle, voici les problèmes rencontrés :

1. **Vérification coûteuse** : pour vérifier qu'une transaction est dans un bloc, il faudrait télécharger tout le bloc (potentiellement plusieurs mégaoctets).
2. **Pas de preuve compacte** : impossible de prouver l'inclusion d'une transaction sans montrer toutes les autres transactions.

**Comment l'arbre de Merkle résout ces problèmes** :

| Problème | Solution apportée par l'arbre de Merkle |
| --- | --- |
| Vérification coûteuse | Tu n'as qu'à télécharger quelques hash (une "branche") au lieu de tout le bloc |
| Pas de preuve compacte | Une preuve de Merkle contient seulement log2(N) hash pour N transactions |

**Analogie concrète** : Un arbre généalogique où chaque branche résume la suivante. Imagine un tournoi sportif à élimination directe. Au premier tour, 8 équipes jouent 4 matchs. Au deuxième tour, les 4 gagnants jouent 2 matchs. Puis une demi-finale, puis la finale. Pour prouver qu'une équipe a participé au tournoi, tu n'as pas besoin de montrer tous les matchs : montrer les résultats des matchs de sa branche jusqu'à la finale est suffisant.

**Schéma d'un arbre de Merkle** :

```text
                    Merkle Root
                   Hash(AB + CD)
                   /            \
              Hash AB          Hash CD
             /      \         /      \
         Hash A    Hash B  Hash C   Hash D
           |         |       |        |
         Tx A      Tx B    Tx C     Tx D

Pour prouver que Tx B est dans le bloc :
- Fournir : Hash A et Hash CD
- Le verificateur calcule : Hash B = hash(Tx B)
- Puis Hash AB = hash(Hash A + Hash B)
- Puis Merkle Root = hash(Hash AB + Hash CD)
- Si le résultat correspond au Merkle Root du bloc, Tx B est confirmee.

Nombre de hash nécessaires : 2 (au lieu de 4 transactions complètes)
Pour 1000 transactions : seulement 10 hash nécessaires (log2 de 1000)
```

**Ce qu'un arbre de Merkle n'est PAS** :

- Un arbre de Merkle n'est pas spécifique aux blockchains. Cette structure est utilisée dans Git (gestion de versions), dans les systèmes de fichiers (ZFS), et dans de nombreux protocoles de vérification de données.

---

### Ce que la blockchain fait bien

**Définition** : La blockchain excelle dans un ensemble précis et limité de cas d'usage, tous liés à la tenue d'un registre partagé sans autorité centrale.

Voici ce que la blockchain fait bien :

- **Registre transparent** : chaque transaction est visible par tous les participants. N'importe qui peut vérifier n'importe quelle transaction, à tout moment, sans demander de permission.

- **Immutabilité (en pratique)** : une fois qu'une transaction est enregistrée et confirmée par suffisamment de blocs, la modifier est si coûteux que c'est considéré comme impossible en pratique.

- **Vérifiable par tous** : les règles du système sont publiques. Chaque participant peut vérifier que les règles sont respectées, sans faire confiance à un tiers.

- **Transfert de valeur sans intermédiaire** : deux personnes peuvent s'échanger de la valeur directement, sans passer par une banque, un service de paiement ou un notaire.

---

### Ce que la blockchain ne fait PAS bien

**Définition** : La blockchain a des limitations fondamentales liées à sa conception. Ces limitations ne sont pas des bugs : ce sont des conséquences directes des choix techniques qui lui donnent ses avantages.

Voici ce que la blockchain ne fait pas bien :

- **Stocker de grandes quantités de données** : chaque octet stocké sur la blockchain est répliqué sur des milliers de nœuds. Stocker 1 Mo de données sur Ethereum coûte des milliers de dollars. Une base de données classique stocke 1 Mo pour une fraction de centime.

- **Être rapide** : Bitcoin traite environ 7 transactions par seconde. Ethereum en traite environ 15. Visa traite environ 1 700 transactions par seconde en moyenne (capacité maximale théorique : environ 65 000). Cette lenteur est une conséquence directe de la décentralisation (voir le trilemme de la fiche précédente).

- **Être confidentielle** : sur une blockchain publique, toutes les transactions sont visibles par tout le monde. Les adresses sont pseudonymes (pas directement liées à une identité), mais des techniques d'analyse permettent souvent de remonter à l'identité réelle.

- **Corriger les erreurs humaines** : si tu envoies des fonds à la mauvaise adresse, si tu perds ta clé privée, ou si tu te fais arnaquer par un smart contract malveillant, il n'y a aucun mécanisme de correction. La transaction est définitive.

- **Vérifier les informations du monde réel** : une blockchain peut garantir que les données qu'elle contient n'ont pas été modifiées. Mais elle ne peut pas garantir que ces données étaient correctes au départ. Si quelqu'un enregistre une fausse information sur la blockchain, cette fausse information sera immuable.

**Tableau comparatif : blockchain vs base de données classique** :

| Critère | Blockchain | Base de données classique |
| --- | --- | --- |
| Vitesse | 7 à 15 transactions/seconde | Des milliers à des millions/seconde |
| Coût de stockage | Très élevé (répliqué sur milliers de nœuds) | Très faible |
| Modification des données | Quasi-impossible après confirmation | Simple (UPDATE, DELETE) |
| Confidentialité | Faible (tout est public) | Forte (accès contrôlé) |
| Besoin de confiance | Non (vérification par tous) | Oui (confiance envers l'administrateur) |
| Recours en cas d'erreur | Aucun | Possible (rollback, support) |
| Consommation énergétique | Très élevée | Faible |

---

### Grille d'évaluation : a-t-on vraiment besoin d'une blockchain ?

**Définition** : Avant d'accepter l'affirmation "la blockchain va révolutionner X", il faut poser trois questions précises. Si la réponse à l'une de ces questions est non, une base de données classique suffit.

**Les trois questions** :

1. **A-t-on besoin d'un registre partage entre plusieurs acteurs qui ne se font pas confiance ?**
   Si les participants se font déjà confiance, ou s'il existe un intermédiaire de confiance accepté par tous (une banque, un notaire, un gouvernement), une base de données classique gérée par cet intermédiaire est plus simple et plus efficace.

2. **A-t-on besoin de se passer d'un tiers de confiance ?**
   Si un intermédiaire de confiance existe et fonctionne bien, l'éliminer n'apporte rien et ajoute de la complexité. La blockchain n'a de sens que lorsque l'intermédiaire est absent, défaillant ou inacceptable.

3. **Le coût de la décentralisation est-il justifie ?**
   La décentralisation à un prix : lenteur, redondance, coût de stockage, consommation énergétique. Ce prix n'est justifié que si les avantages (résistance à la censure, immutabilité, transparence) sont indispensables au cas d'usage.

**Application de la grille à des cas concrets** :

| Cas d'usage | Question 1 | Question 2 | Question 3 | Blockchain utile ? |
| --- | --- | --- | --- | --- |
| Transfert d'argent entre pays sans système bancaire | Oui | Oui | Oui | Potentiellement oui |
| Suivi de colis dans une entreprise | Non (un seul acteur) | Non | Non | Non, une BDD suffit |
| Registre foncier dans un pays instable | Oui | Oui (institutions défaillantes) | À évaluer | Peut-être |
| Vote électronique | Oui | Discutable | Discutable | Probablement non (d'autres solutions existent) |
| "Certificats d'authenticite" pour des baskets | Non (la marque est le tiers de confiance) | Non | Non | Non, du marketing |

**Règle pratique** : quand quelqu'un te dit "on va mettre ça sur la blockchain", pose ces trois questions. Dans la majorité des cas, la réponse honnête est : une base de données classique ferait le même travail, en moins cher, en plus rapide et en plus simple.

---

## Checklist de Validation

- [ ] Je sais définir ce qu'est une blockchain en une phrase précise
- [ ] Je peux décrire les quatre éléments du header d'un bloc (hash précédent, timestamp, nonce, Merkle root)
- [ ] Je comprends pourquoi modifier un ancien bloc est extrêmement coûteux
- [ ] Je sais expliquer le fonctionnement d'un arbre de Merkle et son utilité
- [ ] Je peux citer au moins trois choses que la blockchain fait bien
- [ ] Je peux citer au moins trois choses que la blockchain ne fait pas bien
- [ ] Je sais utiliser la grille des trois questions pour évaluer si un cas d'usage nécessite réellement une blockchain
- [ ] Quand quelqu'un me dit "la blockchain va révolutionner X", je sais poser les bonnes questions

---

## Navigation

← Fiche précédente : **[03 - Réseaux pair-à-pair et décentralisation](03-reseaux-pair-a-pair-decentralisation.md)**

→ Phase suivante : **[Phase 2 - Bitcoin : le protocole originel](../02-bitcoin/index.md)**
