---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Zéro-knowledge proofs : prouver sans révéler, applications a la confidentialité et a la scalabilité"
estimated_time: "50 min"
fiche_number: 3
total_fiches: 7
cursus: "Phase 7 - Concepts techniques avances"
---

# 03 - Zéro-knowledge proofs : la crypto au service de la vie privée

> **En bref** : Comprendre les zéro-knowledge proofs (prouver qu'une affirmation est vraie sans révéler l'information), les types ZK-SNARKs et ZK-STARKs, et les applications à la confidentialité, la scalabilité et l'identité décentralisée. Lecture estimée : 50 min.

## Prérequis

- [Fiche 01 - Layer 2 et scalabilité](01-layer-2-scalabilite.md) : comprendre les ZK-rollups dans le contexte de la scalabilité
- [Fiche 02 - Bridges et interopérabilité](02-bridges-interoperabilite.md) : comprendre les ZK-bridges
- Connaître les bases de la cryptographie (hachage, clés publiques/privées) (Phase 1)
- Comprendre que les transactions Bitcoin et Ethereum sont publiques

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer le principe des zéro-knowledge proofs, distinguer ZK-SNARKs et ZK-STARKs, citer les trois grandes applications (confidentialité, scalabilité, identité) et évaluer le niveau de maturité de cette technologie.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Le problème de la transparence totale

**Définition** : Sur la plupart des blockchains (Bitcoin, Ethereum), chaque transaction est publique. N'importe qui peut consulter l'historique complet de n'importe quelle adresse.

**Le problème que les zéro-knowledge proofs résolvent** :

La transparence totale des blockchains pose des problèmes concrets :

1. **Pas de vie privée financière** : ton employeur, tes voisins, n'importe qui peut voir combien tu possèdes et à qui tu envoies de l'argent. Connaître ton adresse est suffisant.
2. **Risque de sécurité personnelle** : si on sait que ton adresse contient 1 million de dollars en crypto, tu deviens une cible pour des attaques physiques.
3. **Desavantage commercial** : une entreprise qui paie ses fournisseurs on-chain révèle ses partenaires commerciaux et ses volumes à ses concurrents.

**Ce que la transparence permet de voir (exemple concret)** :

```text
Sur un explorateur de blocs (Etherscan, par exemple) :

Si quelqu'un connaît ton adresse Ethereum, il peut voir :
- Ton solde actuel (en ETH et en tokens)
- Chaque transaction que tu as faite (montant, date, destinataire)
- Les protocoles DeFi que tu utilisés
- Les NFTs que tu possedes
- Ton historique complet depuis la création de l'adresse

Même les pseudonymes ne protègent pas totalement.
Des sociétés d'analyse (Chainalysis, Elliptic) specialisent
dans le traçage des transactions et le rattachement des adresses
a des identités réelles.
```

**Ce qu'un zéro-knowledge proof n'est PAS** :

- Un ZK proof n'est pas un outil d'anonymat total. Il permet de prouver des choses sans révéler les détails, mais le contexte d'utilisation peut toujours révéler des informations.
- Un ZK proof n'est pas un outil pour contourner la loi. Les transactions confidentielles restent soumises aux lois en vigueur. Zcash, par exemple, est régulièrement audité pour prouver que la supply totale est correcte.

---

### Qu'est-ce qu'un zéro-knowledge proof ?

**Définition** : Un zéro-knowledge proof (preuve à divulgation nulle de connaissance) est un protocole cryptographique qui permet à une partie (le prouveur) de prouver à une autre partie (le vérificateur) qu'une affirmation est vraie, sans révéler aucune information au-delà de la véracité de cette affirmation.

**Analogie concrète : la grotte d'Ali Baba**

```text
Imagine une grotte circulaire avec une porte au fond qui ne s'ouvre
qu'avec un mot de passe.

La grotte :
         Entrée
        /       \
       /         \
  Chemin A    Chemin B
       \         /
        \       /
      [PORTE FERMEE]

Alice veut prouver à Bob qu'elle connaît le mot de passe,
sans le lui révéler.

Protocole :
1. Bob attend à l'entrée et ne regarde pas
2. Alice entre dans la grotte et choisit un chemin (A ou B) au hasard
3. Bob arrive à l'entrée et crie : "Sors par le chemin A !" (ou B)
4. Si Alice connaît le mot de passe, elle peut toujours sortir par
   le chemin demandé (en traversant la porte si nécessaire)
5. Si elle ne connaît pas le mot de passe, elle ne peut sortir par le
   bon chemin que si elle est déjà du bon côté (1 chance sur 2)

Après 20 répétitions :
- Si Alice connaît le mot de passe : elle réussit 20/20 fois
- Si elle ne le connaît pas : probabilité de réussir 20/20 = (1/2)^20
  = 1 chance sur 1 048 576

Bob est convaincu sans connaître le mot de passe.
```

**Les trois propriétés d'un ZK proof** :

| Propriété | Définition | En langage simple |
| --- | --- | --- |
| Complétude (completeness) | Si l'affirmation est vraie, le vérificateur sera convaincu | Si Alice connaît vraiment le mot de passe, Bob sera toujours convaincu |
| Solidité (soundness) | Si l'affirmation est fausse, le prouveur ne peut pas tromper le vérificateur (sauf avec une probabilité négligeable) | Si Alice ne connaît pas le mot de passe, elle ne peut pas tricher |
| Zéro connaissance (zéro-knowledge) | Le vérificateur n'apprend rien au-delà de la véracité de l'affirmation | Bob est convaincu mais ne connaît toujours pas le mot de passe |

---

### Exemples concrets de ZK proofs

**Définition** : Pour illustrer la puissance des ZK proofs, voici des exemples concrets de ce qu'ils permettent.

**Ce que tu peux prouver sans révéler** :

| Tu veux prouver | Tu ne révèles pas | Application |
| --- | --- | --- |
| "J'ai plus de 18 ans" | Ta date de naissance | Vérification d'âge en ligne |
| "Mon solde est suffisant pour cette transaction" | Le montant exact de ton solde | Transaction confidentielle |
| "Je suis citoyen de l'UE" | Ton pays exact, ton nom, ton adresse | Accès à un service réservé aux résidents UE |
| "Ce lot de 1 000 transactions est valide" | Le détail de chaque transaction | ZK-rollups (scalabilité) |
| "Je connais la solution de ce sudoku" | La solution elle-même | Exemple académique souvent cité |

---

### ZK-SNARKs vs ZK-STARKs

**Définition** : ZK-SNARKs et ZK-STARKs sont deux familles de preuves à divulgation nulle. Elles différent par leur construction mathématique, leurs propriétés de sécurité et leurs performances.

**ZK-SNARKs (Succinct Non-interactive ARguments of Knowledge)** :

```text
Decoposition du nom :
- Succinct : la preuve est petite et rapide a vérifier
- Non-interactive : le prouveur envoie une seule preuve, pas besoin
  d'échanges multiples avec le verificateur
- ARguments of Knowledge : le prouveur demontre qu'il connaît
  l'information sans la révéler

Propriétés :
- Taille de la preuve : ~200-300 octets (très compact)
- Temps de vérification : quelques millisecondes
- Nécessite un "trusted setup" (ceremonie de confiance initiale)
```

**Le problème du trusted setup** :

```text
Pour générer des preuves ZK-SNARKs, il faut d'abord créer des
parametrès cryptographiques via une "ceremonie de confiance".

Le problème :
1. Pendant cette ceremonie, un "dechet toxique" (toxic waste) est génère
2. Si quelqu'un conserve ce dechet toxique, il peut créer de fausses preuves
3. Il faut donc s'assurer que le dechet est détruit

Solution : ceremonies multi-parties (MPC)
- Des centaines ou milliers de participants contribuent à la ceremonie
- Il suffit qu'UN SEUL participant soit honnete et detruise sa part
  du dechet toxique pour que le système soit sur
- Zcash a realise une ceremonie avec plus de 80 000 participants

Risque residuel : le trusted setup est un point de confiance.
Si le processus est compromis, tout le système l'est.
```

**ZK-STARKs (Scalable Transparent ARguments of Knowledge)** :

```text
Decoposition du nom :
- Scalable : les performances restent bonnes même pour de gros
  ensembles de données
- Transparent : pas besoin de trusted setup

Propriétés :
- Taille de la preuve : ~50-200 ko (beaucoup plus gros que les SNARKs)
- Temps de vérification : plus lent que les SNARKs
- Pas de trusted setup (avantage majeur)
- Resistant aux attaques par ordinateur quantique
```

**Comparaison ZK-SNARKs vs ZK-STARKs** :

| Critère | ZK-SNARKs | ZK-STARKs |
| --- | --- | --- |
| Trusted setup | Oui (cérémonie nécessaire) | Non (transparent) |
| Taille de la preuve | Très petite (~300 octets) | Plus grande (~50-200 ko) |
| Temps de vérification | Très rapide | Plus lent |
| Temps de génération de la preuve | Rapide | Plus lent pour les petits circuits, plus rapide pour les gros |
| Résistance quantique | Non | Oui |
| Maturité | Plus mature (Zcash depuis 2016) | Plus récent |
| Utilisé par | Zcash, zkSync Era, Scroll, Mina | StarkNet (StarkWare) |
| Coût on-chain | Faible (petite preuve à stocker) | Plus élevé (preuve plus volumineuse) |

---

### Application 1 : Confidentialité des transactions

**Définition** : Les ZK proofs permettent de réaliser des transactions dont le montant, l'expéditeur et le destinataire sont cachés, tout en prouvant que la transaction est valide (pas de double dépense, pas de création de tokens ex nihilo).

**Zcash : le premier cas d'usage à grande échelle** :

```text
Zcash propose deux types de transactions :

Transaction transparente (comme Bitcoin) :
- Expediteur : visible
- Destinataire : visible
- Montant : visible
- Tout le monde peut vérifier

Transaction blindée (shielded) :
- Expediteur : caché
- Destinataire : caché
- Montant : caché
- Un ZK-SNARK prouve que :
  * L'expéditeur possède les fonds
  * Le montant est positif
  * Pas de double depense
  * La supply totale est préservée

Le verificateur (n'importe quel nœud) peut vérifier la preuve
en quelques millisecondes, sans connaître aucun détail de la transaction.
```

**Fait sur l'adoption des transactions blindées** :

| Métrique | Valeur (ordre de grandeur, 2024) |
| --- | --- |
| Pourcentage de transactions Zcash qui sont blindées | ~15-25% |
| Pourcentage de la supply dans des adresses blindées | ~25-35% |

La majorité des utilisateurs de Zcash n'utilisent pas les transactions blindées. C'est un fait important : la confidentialité optionnelle est peu adoptée.

**Autrès projets axés sur la confidentialité** :

| Projet | Technologie | Particularite |
| --- | --- | --- |
| Zcash | ZK-SNARKs | Confidentialité optionnelle (transparente ou blindée) |
| Monero | Ring signatures + Stealth addresses (pas de ZK proofs) | Confidentialité par défaut, toutes les transactions sont privées |
| Tornado Cash | ZK-SNARKs sur Ethereum | Mixeur de transactions (sanctionné par l'OFAC en 2022) |
| Aztec Network | ZK-SNARKs | Transactions privées sur Ethereum (Layer 2) |

**L'affaire Tornado Cash** :

```text
Tornado Cash était un protocole sur Ethereum qui permettait de
"melanger" des transactions pour rompre le lien entre expéditeur
et destinataire (comme un mixeur de billets).

Chronologie :
1. Août 2022 : le Trésor américain (OFAC) sanctionne les adresses
   de smart contracts de Tornado Cash
2. Le développeur Alexey Pertsev est arrête aux Pays-Bas
3. Mai 2024 : Pertsev est condamne a 5 ans et 4 mois de prison
   pour blanchiment d'argent
4. Novembre 2024 : la cour d'appel federale (5e circuit, affaire
   Van Loon v. Treasury) juge que l'OFAC a outrepasse ses pouvoirs
   en sanctionnant des smart contracts immuables (qui ne sont pas
   une "propriété" au sens de la loi sur les sanctions)
5. Mars 2025 : l'OFAC retire les adresses de Tornado Cash de sa
   liste de sanctions

Implications :
- C'est la première fois qu'un gouvernement a sanctionne un smart contract
  (du code, pas une personne ou une entreprise)
- Pendant la période de sanctions, les exchanges ont bloque les fonds
  de tous les utilisateurs ayant interagi avec Tornado Cash
- Le débat : punir un développeur pour avoir écrit du code ?

Fait : le protocole a toujours fonctionne (un smart contract deploye
ne peut pas être arrête). Les sanctions OFAC sur les contrats
eux-mêmes ont été levees en 2025 après la décision de justice, mais
la condamnation penale d'Alexey Pertsev (mai 2024) reste valable :
écrire le code et le faire tourner ne protège pas son auteur des
poursuites pour blanchiment.
```

---

### Application 2 : Scalabilité (ZK-rollups)

**Définition** : Les ZK proofs sont utilisés par les ZK-rollups pour prouver que des milliers de transactions sont valides sans que le Layer 1 ait besoin de les re-exécuter une par une. C'est l'application qui attire le plus d'investissement et de recherche.

**Comment les ZK-rollups utilisent les ZK proofs** :

```text
Sans ZK proof (vérification naive) :
1. Le rollup exécute 10 000 transactions
2. Il publie les 10 000 transactions sur Ethereum
3. Ethereum ré-exécute les 10 000 transactions pour vérifier
4. Coût : énorme (on a juste deplace le problème)

Avec ZK proof :
1. Le rollup exécute 10 000 transactions
2. Il génère UN ZK proof qui prouve que les 10 000 transactions sont valides
3. Il publie un resume compresse + le ZK proof sur Ethereum
4. Ethereum vérifie le ZK proof en une seule opération (quelques ms)
5. Coût : une seule vérification au lieu de 10 000

Gain : la vérification sur L1 est indépendante du nombre de transactions.
Que le batch contienne 100 ou 100 000 transactions, le coût de
vérification est quasi identique.
```

**Projets ZK-rollups** :

| Projet | Type de preuve | Compatibilité EVM | État (2024) |
| --- | --- | --- | --- |
| zkSync Era | ZK-SNARKs | zkEVM (compatible Solidity, quelques différences) | Mainnet depuis mars 2023 |
| StarkNet | ZK-STARKs | Langage Cairo (pas directement compatible Solidity) | Mainnet depuis novembre 2022 |
| Scroll | ZK-SNARKs | zkEVM (très compatible) | Mainnet depuis octobre 2023 |
| Linea (Consensys) | ZK-SNARKs | zkEVM | Mainnet depuis juillet 2023 |
| Polygon zkEVM | ZK-SNARKs | zkEVM | Mainnet depuis mars 2023 |

---

### Application 3 : Identité décentralisée

**Définition** : Les ZK proofs permettent de prouver des attributs d'identité (âge, nationalité, solvabilité) sans révéler les documents sous-jacents. C'est l'application la plus intuitive mais la moins déployée à grande échelle.

**Exemples concrets** :

| Scénario | Sans ZK proof | Avec ZK proof |
| --- | --- | --- |
| Prouver ton âge pour acheter de l'alcool en ligne | Tu envoies une copie de ta carte d'identité (nom, adresse, photo, tout est révélé) | Tu génères une preuve qui dit "j'ai plus de 18 ans" sans révéler ta date de naissance ni ton nom |
| Prouver ta solvabilité pour un prêt | Tu fournis tes relevés bancaires (montants, transactions, habitudes de dépenses - tout est révélé) | Tu génères une preuve qui dit "mon solde moyen sur 3 mois dépasse 5 000 euros" sans révéler le montant exact |
| Prouver que tu n'es pas sur une liste de sanctions | Ton identité complète est vérifiée par un tiers | Tu prouves que ton identité n'est pas sur la liste, sans révéler ton identité au vérificateur |

**État de maturité** :

| Aspect | État |
| --- | --- |
| Recherche théorique | Avancée |
| Prototypes fonctionnels | Existants (Polygon ID, Worldcoin, Sismo) |
| Adoption à grande échelle | Quasi inexistante |
| Standards (W3C Verifiable Credentials) | En cours de définition |
| Intégration avec les systèmes existants (gouvernements, banques) | Très limitée |

---

### Les limites des zéro-knowledge proofs

**Définition** : Les ZK proofs sont une avancée cryptographique majeure, mais elles font face à des limites techniques et pratiques significatives.

**Les limites actuelles** :

| Limite | Explication |
| --- | --- |
| Complexité mathématique extrême | Les ZK proofs reposent sur des mathématiques avancées (courbes elliptiques, polynômes, algèbre abstraite). Très peu de personnes dans le monde sont capables de les concevoir et de les auditer. |
| Coût de calcul élevé | Générer une preuve (côté prouveur) est très coûteux en CPU et en mémoire. C'est pourquoi les ZK-rollups nécessitent du hardware puissant pour les provers. |
| Risques de bugs | Plus le code est complexe, plus le risque de bugs est élevé. Les circuits ZK sont parmi les logiciels les plus difficiles à auditer. |
| Trusted setup (pour les SNARKs) | La cérémonie de confiance initiale est un point de risque. Les STARKs résolvent ce problème mais au prix de preuves plus volumineuses. |
| UX (expérience utilisateur) | L'utilisateur final ne comprend généralement pas ce qui se passe. L'intégration transparente dans les applications est encore en chantier. |

**Un mot sur la maturité** :

```text
Les ZK proofs sont probablement la technologie la plus prometteuse de
l'écosystème crypto. Mais "prometteuse" signifie justement que les
promesses ne sont pas encore toutes tenues.

Ce qui fonctionne aujourd'hui :
- Transactions blindées (Zcash, depuis 2016)
- ZK-rollups (en production depuis 2022-2023, mais encore jeunes)
- Preuves de concept pour l'identité décentralisée

Ce qui est encore expérimental :
- ZK-EVM entièrement équivalents à l'EVM originale
- ZK-bridges à grande échelle
- Identité décentralisée avec adoption réelle
- Génération de preuves sur du matériel grand public (smartphone)

Horizon réaliste : les ZK proofs atteindront une maturité
comparable aux protocoles web actuels dans 5 à 10 ans,
pas dans 1 à 2 ans comme le marketing le suggère.
```

---

## Checklist de Validation

- [ ] Je sais que les transactions sur Bitcoin et Ethereum sont totalement publiques
- [ ] Je comprends le principe d'un zéro-knowledge proof (prouver une affirmation sans révéler l'information)
- [ ] Je sais expliquer l'analogie de la grotte d'Ali Baba
- [ ] Je connais les trois propriétés d'un ZK proof (complétude, solidité, zéro connaissance)
- [ ] Je sais distinguer ZK-SNARKs (compact, trusted setup) et ZK-STARKs (transparent, plus volumineux)
- [ ] Je comprends le problème du trusted setup et pourquoi les STARKs l'eliminent
- [ ] Je connais les trois grandes applications : confidentialité (Zcash), scalabilité (ZK-rollups), identité
- [ ] Je sais que l'affaire Tornado Cash a établi un précédent juridique majeur
- [ ] Je comprends les limites actuelles (complexité, coût de calcul, maturité)
- [ ] Je sais que les ZK proofs sont prometteuses mais encore en maturation

---

## Navigation

← Fiche précédente : **[Bridges et interopérabilité : risques et réalités](02-bridges-interoperabilite.md)**

→ Fiche suivante : **[MEV et front-running : le côté obscur de la DeFi](04-mev-front-running-cote-obscur.md)**
