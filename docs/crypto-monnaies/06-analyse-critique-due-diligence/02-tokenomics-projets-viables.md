---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Tokenomics : comprendre la distribution, l'émission et l'utilité réelle d'un token pour évaluer sa viabilite"
estimated_time: "40 min"
fiche_number: 2
total_fiches: 6
cursus: "Phase 6 - Analyse critique et due diligence"
id: "specializations.crypto.analysis.tokenomics-projets-viables"
course_id: "specializations.crypto"
module_id: "specializations.crypto.analysis"
content_type: "lesson"
order: 2
---

# 02 - Tokenomics : séparer les projets viables du vent

> **En bref** : Comprendre les mécanismes économiques d'un token - émission, distribution, utilité réelle - pour évaluer objectivement si un projet crypto est viable ou s'il repose uniquement sur la spéculation. Lecture estimée : 40 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complete (fiches 01 a 04)
- [Phase 2 - Bitcoin](../02-bitcoin/index.md) complete (fiches 01 a 06)
- [Fiche 01 - Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)
- Comprendre ce qu'est un token, une blockchain et un mécanisme de consensus

## Objectif de cette fiche

À la fin de cette fiche, tu sauras analyser les tokenomics d'un projet crypto en évaluant la supply, la distribution, les mécanismes d'émission, l'utilité réelle du token et distinguer un modèle économique viable d'un schéma purement spéculatif.

---

## Concepts

### Qu'est-ce que les tokenomics ?

**Définition** : Les tokenomics (contraction de "token" et "economics") désignent l'ensemble des mécanismes économiques d'un token : comment il est créé, distribué, utilisé et potentiellement détruit. C'est l'économie interne d'un projet crypto.

**Le problème que les tokenomics résolvent** :

Sans analyse des tokenomics, il est impossible de répondre à des questions fondamentales :

1. **Combien de tokens existent et existeront ?** Si la quantité est illimitée, chaque token est dilué au fil du temps.
2. **Qui détient les tokens ?** Si 50% sont détenus par 10 personnes, ces personnes contrôlent le marché.
3. **À quoi sert le token ?** Si la réponse est "à rien de concret", sa valeur repose entièrement sur la spéculation.

**Comment les tokenomics résolvent ces problèmes** :

| Problème | Solution apportée par l'analyse des tokenomics |
| --- | --- |
| Incertitude sur la quantité | Les métriques de supply donnent des chiffres précis et vérifiables |
| Concentration inconnue | La distribution révèle qui détient combien et quand ils peuvent vendre |
| Utilité floue | L'analyse fonctionnelle révèle si le token sert à quelque chose |

**Analogie concrète** : Les tokenomics sont comme le bilan financier d'une entreprise. Avant d'investir dans une entreprise, tu regardes ses revenus, ses dettes, sa tresorerie et sa rentabilité. Les tokenomics sont l'équivalent de ce bilan pour un projet crypto. Un projet sans tokenomics transparentes, c'est comme une entreprise qui refuse de montrer ses comptes.

**Ce que les tokenomics ne sont PAS** :

- Les tokenomics ne sont pas une garantie de succès. Un projet peut avoir des tokenomics impeccables sur le papier et échouer pour d'autres raisons (technologie défaillante, absence de marché, concurrence).
- Les tokenomics ne sont pas immuables. Certains projets modifient leurs tokenomics après le lancement (changement de supply maximale, création de nouveaux tokens). Cela remet en question la confiance dans le projet.

---

### Les métriques de supply

**Définition** : La "supply" (offre) d'un token est mesurée par plusieurs métriques complémentaires. Comprendre la différence entre ces métriques est essentiel pour éviter les erreurs d'interpretation.

**Les 3 métriques de supply** :

| Métrique | Définition | Exemple (fictif) |
| --- | --- | --- |
| Circulating Supply (offre en circulation) | Nombre de tokens disponibles et echangeables aujourd'hui | 100 millions de tokens |
| Total Supply (offre totale) | Nombre de tokens créés a ce jour (y compris ceux bloques ou réserves) | 500 millions de tokens |
| Max Supply (offre maximale) | Nombre maximum de tokens qui existeront jamais | 1 milliard de tokens |

**Pourquoi ces distinctions sont importantes** :

```text
Exemple concret :
- Un token à un prix de 1 $ et une circulating supply de 10 millions.
- Market cap (capitalisation) = prix x circulating supply = 10 millions $.
- Mais la total supply est de 1 milliard de tokens.
- Fully Diluted Valuation (FDV) = prix x max supply = 1 milliard $.

Cela signifie que 990 millions de tokens n'ont pas encore été liberes.
Quand ils le seront, a prix constant, la market cap devrait atteindre
1 milliard $. Mais dans la réalité, la pression vendeuse de ces nouveaux
tokens sur le marche fera probablement baisser le prix.
```

**Les deux chiffres a comparer en priorité** :

| Ratio | Ce qu'il révèle | Seuil d'alerte |
| --- | --- | --- |
| Circulating Supply / Max Supply | Quel pourcentage des tokens est déjà en circulation | Si < 10%, énormément de tokens seront liberes à l'avenir |
| Market Cap / FDV | A quel point la valorisation actuelle est "gonflee" | Si le ratio est très bas (< 0,1), la dilution future sera massive |

**Comparaison avec des exemples connus** :

| Projet | Circulating / Max Supply | Commentaire |
| --- | --- | --- |
| Bitcoin | ~95,6% (~20,07M / 21M, août 2026) | Presque tous les BTC sont en circulation. Dilution future minimale |
| Ethereum | Pas de max supply | Inflationniste par design (mais le burn de gas peut rendre net déflationniste) |

**Règle** : ne regarde jamais la market cap seule. Compare toujours avec la FDV. Si la FDV est 10 fois supérieure à la market cap, les 90% de tokens restants seront un jour liberes et exerceront une pression vendeuse.

---

### Pourquoi la "market cap" peut être trompeuse

**Définition** : La market cap (capitalisation de marche) est calculee en multipliant le prix actuel d'un token par le nombre de tokens en circulation. C'est un chiffre souvent cite mais fréquemment mal compris.

**Le problème** :

La market cap suppose que chaque token en circulation pourrait être vendu au prix actuel. C'est faux.

```text
Exemple :
- Un token a 1 milliard de tokens en circulation.
- Le dernier échange s'est fait a 1 $ le token.
- La market cap affichee est donc de 1 milliard $.

Mais que se passe-t-il si tout le monde essaie de vendre en même temps ?
Le prix chute parce qu'il n'y a pas assez d'acheteurs a 1 $.
La market cap de "1 milliard $" ne représente pas 1 milliard $
que les détenteurs peuvent récupérer. C'est un chiffre théorique.
```

**Market cap vs valeur réelle** :

| Ce que la market cap mesure | Ce que la market cap ne mesure pas |
| --- | --- |
| Prix du dernier échange x nombre de tokens | La quantité d'argent réellement investie dans le projet |
| Une photographie instantanée du marché | La capacité du marché a absorber des ventes massives |
| Un indicateur de taille relative | La solidite financière du projet |

**Un cas extrême pour comprendre** :

```text
Imaginons un token avec :
- 1 000 000 000 de tokens en circulation
- Un seul échange dans la dernière heure : 100 tokens vendus à 10 $

Market cap affichee : 1 000 000 000 x 10 $ = 10 milliards $

En réalité, seuls 1 000 $ ont été échangés.
Ce token est valorise a "10 milliards" sur la base de 1 000 $ de volume.
C'est techniquement correct mais complètement trompeur.
```

**Leçon** : la market cap est un indicateur relatif (pour comparer des projets entre eux), pas un indicateur absolu de la quantité d'argent dans un projet.

---

### La distribution : qui détient combien ?

**Définition** : La distribution d'un token décrit la répartition initiale des tokens entre les différentes parties prenantes : équipe fondatrice, investisseurs prives, communauté, tresorerie du projet, etc.

**Les catégories typiques de distribution** :

| Catégorie | Description | Fourchette typique |
| --- | --- | --- |
| Équipe et fondateurs | Tokens réserves aux créateurs du projet | 10-20% |
| Investisseurs (seed, private) | Tokens vendus a des fonds d'investissement avant le lancement public | 10-25% |
| Communaute / airdrop | Tokens distribués gratuitement ou par récompenses | 5-15% |
| Tresorerie / écosystème | Tokens réserves pour le développement futur du projet | 10-30% |
| Vente publique (ICO/IDO) | Tokens vendus au grand public | 5-30% |
| Mining / staking | Tokens créés progressivement par le mécanisme de consensus | Variable |

**Seuils d'alerte** :

| Indicateur | Seuil acceptable | Seuil d'alerte |
| --- | --- | --- |
| Équipe + fondateurs | < 20% | > 30% |
| Investisseurs prives (total) | < 25% | > 35% |
| Top 10 des adresses (hors exchanges) | < 30% | > 50% |
| Un seul portefeuille (hors exchange) | < 5% | > 10% |

**Pourquoi la concentration est un problème** :

Si une entité détient 30% des tokens, elle peut :

- Vendre massivement et faire chuter le prix (dump).
- Manipuler les votes de gouvernance (si le token donne des droits de vote).
- Contrôler de fait un projet qui se dit "décentralisé".

**Comment vérifier la distribution** :

La blockchain est un registre public. Pour les tokens sur Ethereum, tu peux consulter la répartition sur Etherscan (onglet "Holders"). Pour les autres blockchains, des explorateurs équivalents existent (Solscan pour Solana, etc.).

---

### Vesting et cliff : les tokens bloques

**Définition** : Le vesting est un mécanisme qui empêche les détenteurs (souvent l'équipe et les investisseurs) de vendre leurs tokens immédiatement. Les tokens sont "debloques" progressivement sur une période définie.

**Les termes a connaître** :

| Terme | Définition | Exemple |
| --- | --- | --- |
| Cliff | Période initiale durant laquelle aucun token n'est libere | 1 an de cliff = 0 token pendant 12 mois |
| Vesting | Période de deblocage progressif après le cliff | 3 ans de vesting linéaire = 1/36e des tokens liberes chaque mois |
| TGE (Token Génération Event) | Moment de la création des tokens | Au lancement du projet |
| Unlock | Moment ou un lot de tokens est debloque | Chaque mois après le cliff |

**Un calendrier de vesting typique** :

```text
Mois 0 (TGE)     : 0% libere (début du cliff)
Mois 1-12         : 0% libere (cliff de 1 an)
Mois 13           : 25% libere d'un coup (fin du cliff)
Mois 14-36        : Liberation linéaire du reste (environ 3,26% par mois)
Mois 36           : 100% libere

Total : cliff de 1 an + vesting linéaire sur 2 ans = 3 ans au total
```

**Pourquoi c'est critique** :

Quand un lot important de tokens est debloque, les détenteurs peuvent vendre. Cela créé une pression vendeuse qui fait souvent baisser le prix.

| Situation | Risque |
| --- | --- |
| Cliff court (3 mois) | L'équipe peut vendre rapidement après le lancement |
| Pas de cliff du tout | L'équipe peut vendre immédiatement (red flag majeur) |
| Gros unlock ponctuel (ex: 30% d'un coup) | Pression vendeuse concentree, chute de prix probable |
| Vesting long (3-4 ans) avec cliff d'un an | L'équipe est alignee avec le succès a long terme du projet |

**Ou trouver les calendriers de vesting** :

- Dans le whitepaper ou la documentation du projet.
- Sur des sites comme TokenUnlocks (token.unlocks.app) qui suivent les calendriers de deblocage.
- Sur la blockchain elle-même (les contrats de vesting sont souvent vérifiables).

---

### L'utilité du token : a quoi sert-il concrètement ?

**Définition** : L'utilité d'un token est ce qu'il permet de faire concrètement au sein de l'écosystème du projet. Sans utilité réelle, un token n'a pas de raison fondamentale d'avoir de la valeur.

**Les types d'utilité** :

| Type | Description | Exemples |
| --- | --- | --- |
| Frais de transaction (gas) | Le token est nécessaire pour utiliser le réseau | ETH sur Ethereum |
| Accès à un service | Le token donne accès à une fonctionnalité spécifique | Token de stockage décentralisé (Filecoin) |
| Gouvernance | Le token donne le droit de voter sur les décisions du projet | UNI (Uniswap), AAVE |
| Staking / sécurité | Le token est mis en jeu pour sécuriser le réseau | ETH (Proof of Stake) |
| Moyen de paiement interne | Le token sert a payér au sein de l'écosystème | Tokens de jeux video décentralisés |
| Spéculation pure | Aucune utilité concrete, la valeur vient de l'offre et la demandé | Memecoins (DOGE, SHIB) |

**Le problème de la gouvernance comme seule utilité** :

Beaucoup de tokens n'ont qu'une utilité : "la gouvernance". Cela signifie que le token donne le droit de voter sur les évolutions du protocole.

En théorie, c'est une utilité réelle. En pratique :

- La participation aux votes est souvent inférieure à 5% des détenteurs.
- Les gros portefeuilles dominent les votes (plutocratie).
- La plupart des détenteurs de tokens ne les achètent pas pour voter mais pour spéculer sur le prix.

**Conclusion** : la gouvernance seule est une utilité très faible. Si c'est la seule utilité du token, pose-toi la question : combien paierais-tu pour le droit de voter sur les paramètrès d'un protocole ?

---

### Modèle inflationniste vs déflationniste

**Définition** : Un token est inflationniste si de nouveaux tokens sont créés au fil du temps (l'offre augmente). Il est déflationniste si des tokens sont détruits (l'offre diminue). Il peut aussi être neutre ou à inflation contrôlée.

**Comparaison** :

| Modèle | Mécanisme | Exemple | Conséquence |
| --- | --- | --- | --- |
| Inflationniste pur | Nouveaux tokens créés en permanence, sans destruction | Anciens tokens PoW sans limite | Chaque token existant est dilue |
| Inflationniste contrôlé | Nouveaux tokens créés mais à un rythme prévisible et décroissant | Bitcoin (halving divise l'émission par 2 tous les 4 ans) | Dilution décroissante |
| Déflationniste | Des tokens sont détruits (burn) régulièrement | BNB (Binance brûle des tokens trimestriellement) | L'offre diminue avec le temps |
| Mixte | Émission et destruction coexistent | Ethereum post-merge (émission + burn de gas) | Peut être net inflationniste ou déflationniste selon l'activité |

**Attention au "burn" marketing** :

Certains projets annoncent des "burns" (destruction de tokens) comme si c'était une bonne nouvelle par défaut. Réduire l'offre ne crée pas de valeur en soi.

```text
Analogie :
Si une entreprise rachete et détruit ses propres actions,
cela n'augmente la valeur des actions restantes QUE SI l'entreprise
génère des revenus. Une entreprise sans revenus qui brûlé ses actions
ne fait que réduire le nombre d'actions qui ne valent rien.

Même logique pour les tokens : le burn ne crée pas de valeur
si le projet sous-jacent ne génère pas de valeur.
```

---

### Le test ultime : supprimer le token

**Définition** : Le test le plus rigoureux pour évaluer l'utilité d'un token est de se demander : si on enleve complètement le token de ce projet, le projet fonctionne-t-il encore ?

**Application du test** :

| Projet | Si on enleve le token... | Verdict |
| --- | --- | --- |
| Ethereum (ETH) | Plus de gas = plus de transactions possibles = le réseau s'arrête | Le token est essentiel |
| Bitcoin (BTC) | Plus de récompense de bloc = plus d'incitation a miner = le réseau s'arrête | Le token est essentiel |
| Uniswap (UNI) | Le protocole d'échange fonctionne toujours (les frais sont payés en ETH, pas en UNI) | Le token est non essentiel (utilité limitée à la gouvernance) |
| Un projet qui vend un service classique avec un token ajouté | Le service fonctionne exactement pareil sans le token | Le token est inutile (il a été ajouté pour lever des fonds) |

**Pourquoi ce test est le plus important** :

Si un projet fonctionne sans son token, alors le token n'a pas d'utilité fondamentale. Sa valeur repose sur la spéculation et la narration marketing, pas sur une nécessite technique.

Cela ne signifie pas que le projet lui-même est mauvais. Uniswap est un protocole d'échange fonctionnel et utile. Mais le token UNI n'est pas nécessaire à son fonctionnement. Cette distinction est cruciale pour évaluer la valeur du token séparément de la valeur du projet.

**Questions a poser** :

- Que se passe-t-il si le prix du token tombe a zéro ? Le service fonctionne-t-il toujours ?
- Le token pourrait-il être remplacé par de l'ETH ou du BTC sans changer le fonctionnement ?
- Le token a-t-il été ajouté après la conception du projet (signe qu'il n'est pas intégral) ?

---

## Checklist de Validation

- [ ] Je sais définir les tokenomics et expliquer pourquoi les analyser est essentiel
- [ ] Je connais la différence entre circulating supply, total supply et max supply
- [ ] Je sais pourquoi la market cap peut être trompeuse et je sais comparer market cap et FDV
- [ ] Je sais analyser la distribution d'un token et identifier les seuils d'alerte
- [ ] Je comprends le vesting, le cliff et leur impact sur le prix lors des unlocks
- [ ] Je sais distinguer les types d'utilité (gas, accès, gouvernance, spéculation)
- [ ] Je comprends pourquoi la gouvernance seule est une utilité faible
- [ ] Je connais la différence entre modèle inflationniste et déflationniste
- [ ] Je sais appliquer le test ultime : le projet fonctionne-t-il sans le token ?
- [ ] Je sais que le burn de tokens ne crée pas de valeur si le projet sous-jacent n'en génère pas

---

## Navigation

← Fiche précédente : **[Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)**

→ Fiche suivante : **[Analyse on-chain : les données ne mentent pas](03-analyse-on-chain-donnees.md)**
