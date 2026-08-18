---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Le réseau Bitcoin : les différents types de nœuds, le rôle des mineurs et le fonctionnement des pools de minage"
estimated_time: "35 min"
fiche_number: 4
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
---

# 04 - Le réseau Bitcoin : nœuds, mineurs et pools

> **En bref** : Comprendre qui fait quoi dans le réseau Bitcoin - les différents types de nœuds, le rôle des mineurs, le fonctionnement des pools de minage et la question de la centralisation. Lecture estimée : 35 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- [Fiche 01 - Bitcoin : contexte de naissance et principes](01-contexte-naissance-principes.md)
- [Fiche 02 - Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)
- [Fiche 03 - Proof of Work : le consensus par l'énergie](03-proof-of-work-consensus-energie.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire les différents types de nœuds du réseau Bitcoin, expliquer le rôle de chaque acteur, comprendre pourquoi les pools de minage existent et évaluer factuellement la question de la centralisation du minage.

---

## Concepts

### Les différents types de nœuds

**Définition** : Un nœud (node) est un ordinateur qui fait tourner le logiciel Bitcoin et participe au réseau. Il existe plusieurs types de nœuds avec des rôles différents.

**Le problème que les nœuds résolvent** :

Sans nœuds repartis dans le monde, voici les problèmes rencontrès :

1. **Point de défaillance unique** : si un seul serveur stocke la blockchain, l'éteindre arrête tout le réseau.
2. **Falsification possible** : sans vérification indépendante par des milliers de machines, un acteur malveillant pourrait modifier les règles.
3. **Censure facile** : un gouvernement ou une entreprise pourrait bloquer l'accès au réseau en ciblant un seul endroit.

**Les trois types principaux de nœuds** :

| Type de nœud | Ce qu'il fait | Ce qu'il stocke | Qui le fait tourner |
| --- | --- | --- | --- |
| Full node (nœud complet) | Telechargement et vérification de chaque bloc et chaque transaction depuis le bloc genesis | La blockchain complete (~600 Go en 2025-2026) | N'importe qui avec un ordinateur et un disque dur suffisant |
| Light node (SPV) | Vérification simplifiée - ne telecharge que les en-tetes de blocs | Seulement les en-tetes de blocs (~60 Mo) | La plupart des wallets sur smartphone |
| Mining node (nœud mineur) | Full node + participation active au minage (calcul de hashes) | La blockchain complete + logiciel de minage | Les mineurs professionnels ou les membres de pools |

Le diagramme suivant illustre les types de nœuds et ce qu'ils stockent :

<div class="diagram-design">
<p><a href="../../../diagrams/crypto-monnaies-02-bitcoin-04-reseau-noeuds-mineurs-pools-1.html">Les différents types de nœuds (HTML + SVG)</a></p>
<iframe src="../../../diagrams/crypto-monnaies-02-bitcoin-04-reseau-noeuds-mineurs-pools-1.html" title="Les différents types de nœuds" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Full node (nœud complet) en détail** :

Un full node effectue les vérifications suivantes pour chaque bloc et chaque transaction :

- Chaque transaction respecte les règles du protocole (signatures valides, pas de double dépense).
- Chaque bloc respecte le format attendu (difficulté correcte, hash valide).
- La récompense de bloc ne dépasse pas le montant autorisé.
- Aucun bitcoin n'est créé à partir de rien.

Si un bloc ne respecte pas une seule de ces règles, le full node le rejette. Il ne fait confiance à personne : il vérifie tout lui-même.

**Light node (SPV - Simplified Payment Vérification) en détail** :

Un light node ne vérifie pas chaque transaction. Il fait confiance aux full nodes pour cette tâche. Il vérifie seulement que :

- Un bloc existe dans la chaîne la plus longue (la plus lourde en travail).
- Une transaction est incluse dans un bloc (via une preuve de Merkle).

| Full node | Light node (SPV) |
| --- | --- |
| Vérifie tout lui-même | Fait confiance aux full nodes pour la vérification |
| Stocke ~600 Go | Stocke ~60 Mo |
| Nécessite un ordinateur dedie ou un serveur | Fonctionne sur un smartphone |
| Maximum de sécurité | Sécurité réduite (dépend de la fiabilité des full nodes) |

**Analogie concrète** : Un full node, c'est comme un comptable qui vérifie chaque ligne de chaque facture depuis le début de l'entreprise. Un light node, c'est comme un employé qui regarde seulement le total en bas de page et fait confiance au comptable pour les détails.

---

### Combien de nœuds dans le réseau ?

**Définition** : Le nombre de nœuds accessibles publiquement est mesurable par des sites comme `bitnodes.io`. Ce nombre ne représente qu'une partie du total, car certains nœuds ne sont pas accessibles depuis internet.

**Les chiffres** :

| Métrique | Estimation (2025-2026) |
| --- | --- |
| Full nodes accessibles publiquement | Environ 15 000 a 20 000 |
| Full nodes totaux estimes (y compris ceux derrière un pare-feu) | Potentiellement 50 000 a 100 000 |
| Répartition géographique | Principalement Amerique du Nord et Europe |
| Pays avec le plus de nœuds | États-Unis, Allemagne, France, Pays-Bas, Canada |

**Ce nombre est-il suffisant ?**

**Arguments pour** :

- 15 000 nœuds repartis dans des dizaines de pays rendent le réseau extrêmement difficile a arrêter. Il faudrait coordonner une action simultanee dans de nombreuses juridictions.
- N'importe qui peut lancer un full node à tout moment. Le logiciel est gratuit et open-source. Un Raspberry Pi a 50 euros suffit (avec un disque dur externe).
- La redondance est massive : même si 90% des nœuds disparaissaient, le réseau continuerait de fonctionner.

**Arguments contre** :

- La taille de la blockchain (~600 Go et en croissance) constitue une barriere. Plus elle grossit, moins de personnes peuvent faire tourner un full node.
- La majorité des nœuds est concentree dans les pays developpes. Cette répartition géographique desequilibree pourrait poser problème.
- La plupart des utilisateurs utilisent des light nodes (smartphones) et font confiance aux full nodes sans les vérifier eux-mêmes.

---

### Le rôle de chaque acteur dans le réseau

**Définition** : Le réseau Bitcoin fonctionne grâce a trois types d'acteurs qui ont chacun un rôle distinct et complémentaire. Comprendre cette séparation est essentiel pour évaluer la sécurité du système.

**Tableau des rôles** :

| Acteur | Rôle principal | Pouvoir | Ce qu'il ne peut PAS faire |
| --- | --- | --- | --- |
| Full nodes | Vérifier que les règles du protocole sont respectees | Rejeter les blocs et transactions invalides | Ne peut pas créer de nouveaux blocs |
| Mineurs | Securiser le réseau en depensant de l'énergie pour trouver des blocs valides | Choisir quelles transactions inclure dans un bloc | Ne peut pas modifier les règles (les nœuds rejetteraient les blocs) |
| Utilisateurs | Effectuer des transactions | Choisir quel logiciel utiliser et quelles règles accepter | Ne peut pas valider des transactions sans nœud |

**Pourquoi cette séparation compte** :

Les mineurs sont souvent percus comme "ceux qui contrôlent Bitcoin". C'est faux. Les mineurs proposent des blocs, mais les full nodes les acceptent ou les rejettent. Si un mineur créé un bloc qui ne respecte pas les règles (par exemple, en s'attribuant plus de bitcoins que la récompense autorisée), tous les full nodes le rejetteront.

En 2017, un événement concret a illustre cette séparation : le débat sur la taille des blocs (SegWit2x). Les principaux mineurs et entreprises voulaient doubler la taille des blocs. Les opérateurs de full nodes ont refuse. Le changement n'a pas eu lieu.

---

### La propagation d'un bloc dans le réseau

**Définition** : Quand un mineur trouve un nouveau bloc valide, ce bloc doit se propager à travers le réseau mondial pour que tous les participants mettent a jour leur copie de la blockchain.

**Le processus étape par étape** :

```text
1. Le mineur trouve un nonce valide
   -> Il à un bloc candidat avec un hash qui respecte la difficulté.

2. Le mineur diffuse le bloc a ses voisins
   -> Chaque nœud est connecte a 8-12 autres nœuds en moyenne.

3. Chaque nœud qui reçoit le bloc le vérifie
   -> Vérification du hash, des transactions, de la récompense, des règles.
   -> Cette vérification prend environ 1-2 secondes.

4. Si le bloc est valide, le nœud l'ajoute a sa copie de la blockchain
   -> Et le retransmet a ses propres voisins.

5. Si le bloc est invalide, le nœud le rejette
   -> Et ne le retransmet pas.

6. En quelques secondes, le bloc atteint la majorité du réseau
   -> Propagation typique : 5 a 15 secondes pour atteindre 90% des nœuds.
```

**Que se passe-t-il si deux mineurs trouvent un bloc en même temps ?**

Cela arrive parfois (on parle de "bloc orphelin" ou "stale block") :

1. Deux mineurs trouvent un bloc valide a quelques secondes d'intervalle.
2. Une partie du réseau reçoit le bloc A en premier, une autre partie reçoit le bloc B en premier.
3. Le réseau est temporairement divise : certains nœuds travaillent sur la suite du bloc A, d'autres sur la suite du bloc B.
4. Des qu'un nouveau bloc est trouve au-dessus de l'un des deux (disons au-dessus de A), la chaîne contenant A devient plus longue.
5. Tous les nœuds adoptent la chaîne la plus longue (la plus lourde en travail).
6. Le bloc B est abandonne. Les transactions qu'il contenait retournent dans le mempool et seront incluses dans un prochain bloc.

**Ce mécanisme est automatique et ne nécessite aucune intervention humaine.**

---

### Les pools de minage

**Définition** : Un pool de minage est un groupe de mineurs qui combinent leur puissance de calcul pour trouver des blocs ensemble et partagent la récompense proportionnellement à la puissance fournie par chacun.

**Le problème que les pools résolvent** :

Sans pools de minage, voici les problèmes rencontrès :

1. **Revenus imprevisibles** : un mineur solo avec un seul ASIC à une probabilité quasi nulle de trouver un bloc. Il pourrait ne rien gagner pendant des années.
2. **Investissement sans retour** : sans revenus réguliers, les petits mineurs ne peuvent pas couvrir leurs frais d'électricité.
3. **Concentration inevitable** : seuls les très gros acteurs (avec des milliers de machines) auraient des revenus réguliers.

**Comment les pools résolvent ces problèmes** :

| Problème | Solution apportée par les pools |
| --- | --- |
| Revenus imprevisibles | Le pool trouve des blocs régulièrement et partage la récompense entre tous les participants |
| Investissement sans retour | même un petit mineur reçoit un revenu proportionnel a sa contribution |
| Concentration inevitable | Les pools permettent a de petits mineurs de participer au minage |

**Comment fonctionne un pool, étape par étape** :

```text
1. Le mineur se connecte au pool via internet.

2. Le pool attribué a chaque mineur une portion du travail
   -> "Cherche un nonce dans cette plage de valeurs."

3. Le mineur calcule des hashes et envoie les résultats au pool.

4. Si un des mineurs du pool trouve un bloc valide,
   le pool reçoit la récompense (3,125 BTC + frais).

5. Le pool distribue la récompense entre les participants
   proportionnellement à la puissance de calcul fournie.
```

**Analogie concrète** : Imagine une loterie ou le billet gagnant rapporte 1 000 euros. Si tu achetes un seul billet, tu as une chance infime de gagner. Mais si tu formes un groupe de 100 personnes et que vous achetez 100 billets, le groupe a 100 fois plus de chances de gagner. Si le groupe gagne, chacun reçoit 10 euros. Les gains individuels sont plus faibles, mais ils sont réguliers et previsibles.

**Méthodes de distribution des récompenses** :

| Méthode | Fonctionnement | Risque pour le mineur |
| --- | --- | --- |
| PPS (Pay Per Share) | Le pool paie un montant fixe pour chaque "share" soumise, que le pool trouve un bloc ou non | Faible (revenu régulier) |
| PPLNS (Pay Per Last N Shares) | Le pool paie uniquement quand un bloc est trouve, proportionnellement aux shares recentes | Moyen (revenu variable) |
| FPPS (Full Pay Per Share) | Comme PPS, mais inclut aussi une estimation des frais de transaction | Faible (revenu régulier + frais) |

---

### La concentration du minage : un problème de centralisation ?

**Définition** : La concentration du minage désigne le fait qu'un petit nombre de pools de minage contrôle une part importante de la puissance de calcul totale (hashrate) du réseau.

**Les chiffres (2025-2026)** :

| Pool | Part estimée du hashrate |
| --- | --- |
| Foundry USA | ~28-32% |
| AntPool | ~18-22% |
| ViaBTC | ~12-15% |
| F2Pool | ~10-13% |
| Autrès pools | ~20-30% |

**Fait** : les 3 a 4 plus gros pools contrôlent régulièrement plus de 50% du hashrate total. Cela signifie que si ces pools se coordonnaient, ils disposeraient théoriquement de la puissance nécessaire pour une attaque 51%.

**Arguments de ceux qui considerent que c'est un problème** :

- La concentration contredit le principe de décentralisation de Bitcoin.
- Un petit nombre d'opérateurs de pools prennent des décisions qui affectent le réseau entier (quelles transactions inclure, quelle version du logiciel utiliser).
- Un gouvernement pourrait théoriquement forcer quelques opérateurs de pools a censurer certaines transactions.
- La frontière entre "pool" et "entité centralisée" est floue : un pool est dirige par une entreprise, avec des employés et un PDG.

**Arguments de ceux qui considerent que ce n'est pas un vrai problème** :

- Les pools ne possedent pas les machines de minage. Ce sont les mineurs individuels qui possedent le matériel et l'électricité. Si un pool se comporte de manière malveillante, les mineurs peuvent changer de pool en quelques minutes.
- En 2014, le pool GHash.IO a brièvement dépasse 50% du hashrate. Les mineurs ont quitte le pool voluntairement et sa part a diminue rapidement.
- Un pool qui attaquerait le réseau perdrait immédiatement ses mineurs et sa source de revenus.
- Les nœuds complets rejettent les blocs invalides, quelle que soit la puissance du mineur qui les propose.

**Fait objectif** : la concentration du hashrate dans quelques pools est une réalité mesurable. L'évaluation du risque que cela représente dépend des hypotheses que l'on fait sur le comportement des mineurs et des opérateurs de pools. Les deux positions (problème réel vs risque surestime) reposent sur des arguments légitimes.

---

### Geographie du minage : ou se trouvent les mineurs ?

**Définition** : La répartition géographique du minage Bitcoin a considerablement change au fil des années, principalement en raison des réglementations et du prix de l'électricité.

**Chronologie factuelle** :

| Période | Situation |
| --- | --- |
| 2013-2020 | La Chine domine le minage : environ 65-75% du hashrate mondial. Raison : électricité bon marché (charbon et hydroelectricite dans le Sichuan et le Xinjiang). |
| Mai 2021 | Le gouvernement chinois interdit le minage de crypto-monnaies sur son territoire. |
| Juin-Septembre 2021 | Exode massif des mineurs chinois. Le hashrate mondial chute d'environ 50% en quelques semaines, puis remonte progressivement. |
| 2022-2026 | Le minage se redistribue à l'échelle mondiale. |

**Répartition estimée après la migration (2024-2026)** :

| Pays | Part estimée du hashrate | Raison principale |
| --- | --- | --- |
| États-Unis | ~35-40% | Électricité relativement bon marché dans certains États (Texas, Wyoming), cadre réglementaire permissif |
| Kazakhstan | ~5-8% | Électricité bon marché (charbon), proximite géographique de la Chine |
| Russie | ~8-12% | Électricité bon marché (gaz naturel, hydroelectricite siberienne) |
| Canada | ~5-8% | Hydroelectricite au Quebec, climat froid (réduit le coût du refroidissement) |
| Autrès | ~30-40% | Divers pays (Irlande, Norvege, Emirats, Paraguay, etc.) |

**Ce que l'exode chinois a demontre** :

- Le réseau a survecu à la perte soudaine de 65% de sa puissance de calcul. L'ajustement de la difficulté (tous les 2 016 blocs) a permis au réseau de continuer a fonctionner normalement après quelques semaines de blocs plus lents.
- Les mineurs ont deplace leur matériel physiquement d'un continent à un autre en quelques mois.
- La décentralisation géographique a augmente : le minage est moins concentre dans un seul pays qu'avant 2021.

**Facteurs qui determinent ou les mineurs s'installent** :

1. **Prix de l'électricité** : c'est le facteur dominant. Le minage est rentable uniquement si l'électricité est bon marche.
2. **Réglementation** : les mineurs fuient les pays qui interdisent ou taxent lourdement le minage.
3. **Climat** : les machines produisent beaucoup de chaleur. Un climat froid réduit les coûts de refroidissement.
4. **Stabilite politique** : les mineurs investissent des millions en équipement. Ils preferent les pays stables ou leur matériel ne risque pas d'être confisque.

---

## Checklist de Validation

- [ ] Je sais décrire les trois types de nœuds (full node, light node, mining node) et leur rôle
- [ ] Je connais la taille approximative de la blockchain (~600 Go) et le nombre de full nodes (~15 000-20 000 publics)
- [ ] Je sais expliquer la différence entre un full node (vérifie tout) et un light node (fait confiance)
- [ ] Je sais décrire le rôle de chaque acteur : les nœuds valident, les mineurs securisent, les utilisateurs transactent
- [ ] Je sais expliquer le processus de propagation d'un bloc dans le réseau
- [ ] Je sais expliquer pourquoi les pools de minage existent (revenus réguliers pour les petits mineurs)
- [ ] Je connais les principaux pools et leur part du hashrate (les 3-4 plus gros > 50%)
- [ ] Je sais présenter les arguments des deux côtés du débat sur la centralisation du minage
- [ ] Je connais l'histoire de l'exode minier chinois de 2021 et ses conséquences
- [ ] Je sais nommer les facteurs qui determinent ou les mineurs s'installent

---

## Navigation

← Fiche précédente : **[Proof of Work : le consensus par l'énergie](03-proof-of-work-consensus-energie.md)**

→ Fiche suivante : **[Bitcoin en chiffres : supply, halving et adoption réelle](05-bitcoin-chiffres-adoption-reelle.md)**
