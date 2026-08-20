---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Taxonomie des tokens : utility, governance, security, stablecoins et memecoins"
estimated_time: "50 min"
fiche_number: 1
total_fiches: 9
cursus: "Phase 4 - L'écosystème crypto"
---

# 01 - Taxonomie des tokens : utility, governance, stablecoins, memecoins

> **En bref** : Apprendre à distinguer les différentes catégories de tokens (utility, governance, security, stablecoins, memecoins), comprendre leur utilité réelle et identifier les red flags de chaque catégorie. Lecture estimée : 50 min.

## Prérequis

- [Phase 3 - Ethereum et les smart contracts](../03-ethereum-smart-contracts/index.md) (les 4 fiches)
- Savoir ce qu'est un smart contract et un token ERC-20
- Comprendre les bases d'Ethereum (gas, EVM, déploiement)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras faire la différence entre un coin et un token, classifier un token dans sa catégorie, évaluer son utilité réelle et repérer les signaux d'alerte qui distinguent un projet sérieux d'un token purement spéculatif.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Coin vs token : une distinction fondamentale

**Définition** : Un coin est la monnaie native d'une blockchain (BTC pour Bitcoin, ETH pour Ethereum). Un token est un actif créé sur une blockchain existante, via un smart contract.

**Le problème que cette distinction résout** :

Sans cette distinction, on confond des choses fondamentalement différentes :

1. **Confusion technique** : un coin fait fonctionner une blockchain entière, un token est un programme sur une blockchain existante
2. **Confusion de valeur** : la valeur d'un coin est liée à la sécurité et au fonctionnement d'un réseau, la valeur d'un token dépend du projet qui l'a créé
3. **Confusion de risque** : supprimer Bitcoin impliquerait de détruire tout son réseau, supprimer un token nécessite juste d'abandonner un smart contract

**Analogie concrète** : un coin, c'est comme l'euro - la monnaie officielle d'un pays, geree par une banque centrale. Un token, c'est comme un bon d'achat émis par un magasin - il a de la valeur tant que le magasin existe et l'accepte, mais il dépend de l'infrastructure monétaire existante (l'euro) pour fonctionner.

**Comparaison coin vs token** :

| Critère | Coin | Token |
| --- | --- | --- |
| Exemple | BTC, ETH, SOL | UNI, LINK, USDC |
| Blockchain | Possède sa propre blockchain | Créé sur une blockchain existante |
| Rôle | Fait fonctionner le réseau (frais, récompenses) | Sert un projet spécifique (ou rien) |
| Création | Nécessite de lancer une blockchain entière | Nécessite de déployer un smart contract |
| Nombre existant | Quelques dizaines | Des millions |

**Un chiffre à retenir** : il existe des millions de tokens. La grande majorité n'ont aucune utilité réelle et ne valent rien. Le simple fait qu'un token existe ne signifie rien - n'importe qui peut créer un token en quelques minutes.

---

### Utility tokens : accès à un service

**Définition** : Un utility token donne accès à un service ou une fonctionnalité dans un écosystème spécifique. Il a une fonction utilitaire concrète : sans lui, tu ne peux pas utiliser le service.

**Exemples concrets** :

| Token | Projet | Utilité réelle |
| --- | --- | --- |
| LINK | Chainlink | Payer les fournisseurs d'oracles (données du monde réel pour smart contracts) |
| FIL | Filecoin | Payer le stockage de fichiers décentralisé |
| BAT | Brave Browser | Recompenser les utilisateurs qui regardent des publicites |
| GRT | The Graph | Payer l'indexation de données blockchain |

**Comment vérifier l'utilité réelle** :

- Le token est-il nécessaire pour utiliser le service, ou juste un ajout artificiel ?
- Le service fonctionnerait-il aussi bien sans token (en utilisant ETH directement) ?
- Y a-t-il des utilisateurs réels du service, ou seulement des speculateurs sur le token ?

**Red flags des utility tokens** :

- Le whitepaper décrit une utilité vague ("alimenter l'écosystème", "recompenser la communauté")
- Le service n'existe pas encore (uniquement une promesse)
- Le token pourrait être remplace par ETH ou un simple système de points sans aucune différence fonctionnelle
- L'équipe a vendu une grande partie des tokens avant que le produit n'existe

---

### Governance tokens : droit de vote

**Définition** : Un governance token donne à son détenteur un droit de vote sur les décisions d'un protocole décentralisé. Chaque token représente généralement une voix.

**Le problème que les governance tokens résolvent** :

Les protocoles décentralisés n'ont pas de PDG ni de conseil d'administration. Quelqu'un doit prendre les décisions (modifier les paramètres, allouer les fonds, approuver les mises à jour). Les governance tokens permettent aux utilisateurs du protocole de voter sur ces décisions.

**Exemples concrets** :

| Token | Protocole | Décisions soumises au vote |
| --- | --- | --- |
| UNI | Uniswap | Frais du protocole, déploiement sur de nouvelles blockchains |
| AAVE | Aave | Paramètrès de prêt, ajout de nouveaux actifs |
| MKR | MakerDAO | Taux de stabilité, types de collatéral acceptes pour DAI |
| COMP | Compound | Paramètrès du protocole, distribution des récompenses |

**La réalité des governance tokens** :

| Promesse | Réalité |
| --- | --- |
| "Democratie décentralisée" | Les gros détenteurs (whales) dominent les votes |
| "Tous les détenteurs participent" | Taux de participation souvent inférieur à 10% |
| "Le token à une utilité : voter" | La plupart des détenteurs achètent pour speculer, pas pour voter |

**Red flags des governance tokens** :

- Le token est présenté comme ayant une "utilité" alors que la seule utilité est de voter sur des propositions que personne ne lit
- L'équipe fondatrice et les investisseurs initiaux détiennent plus de 50% des tokens (ils contrôlent de facto toutes les décisions)
- Le protocole génère des revenus mais ne les redistribue pas aux détenteurs (le token ne capture pas la valeur)

---

### Security tokens : actifs financiers tokenises

**Définition** : Un security token représente un actif financier réel (action, obligation, immobilier, part de fonds) sous forme de token sur une blockchain. Il est soumis aux mêmes réglementations que les titres financiers traditionnels.

**Le problème que les security tokens résolvent** :

1. **Fractionnement** : acheter une part d'immeuble à 50 euros au lieu de 500 000 euros
2. **Accessibilite** : investir dans des actifs habituellement réserves aux gros investisseurs
3. **Liquidité** : revendre sa part à tout moment sur un marché secondaire

**La réalité** : les security tokens restent un marché de niche. Les contraintes réglementaires (KYC, enregistrement auprès des régulateurs) freinent leur adoption. Peu de plateformes permettent de les échanger.

**Ce qu'un security token n'est PAS** :

- Un security token n'est pas un moyen de contourner la réglementation financière. Au contraire, il y est pleinement soumis.
- Un security token n'est pas un utility token qui "passe" pour un investissement. La distinction est juridique : si un token est achète dans l'espoir d'un profit grâce au travail d'une équipe, c'est un security (test de Howey aux États-Unis).

---

### Stablecoins : monnaie stable sur blockchain

**Définition** : Un stablecoin est un token dont le prix est arrimé à un actif stable, généralement le dollar américain. 1 USDC vaut 1 dollar (en théorie).

**Pourquoi les stablecoins existent** :

| Problème | Solution apportée par les stablecoins |
| --- | --- |
| Le Bitcoin et l'ETH sont trop volatils pour payér quoi que ce soit | Un stablecoin garde un prix stable |
| Convertir des crypto en euros/dollars est lent et coûteux | Échanger des crypto contre un stablecoin est instantané |
| Transferer des dollars à l'international coûte cher et prend des jours | Transferer des stablecoins est rapide et peu coûteux |

**Les principaux stablecoins** :

| Stablecoin | Émetteur | Mécanisme | Capitalisation (ordre de grandeur) |
| --- | --- | --- | --- |
| USDT | Tether | Adossé à des réserves (dollars, obligations) | > 100 milliards de dollars |
| USDC | Circle | Adossé à des réserves (dollars, bons du Trésor) | > 30 milliards de dollars |
| DAI | MakerDAO | Surcollatéralisé en crypto | environ 4 à 5 milliards de dollars |

**Point important** : les stablecoins sont traites en détail dans la fiche 05 de cette phase.

---

### Memecoins : spéculation pure

**Définition** : Un memecoin est un token créé autour d'un même, d'une blague ou d'un phénomène internet. Il n'a aucune utilité technique ni fonctionnelle. Sa valeur dépend uniquement de la spéculation et de l'attention qu'il reçoit.

**Exemples** :

| Memecoin | Origine | Ce qui s'est passe |
| --- | --- | --- |
| DOGE | Créé en 2013 comme parodie de Bitcoin (logo : chien Shiba Inu) | A atteint des milliards de capitalisation grâce à des tweets d'Elon Musk |
| SHIB | Créé en 2020, imite DOGE | Des milliers de % de hausse, puis chute massive |
| PEPE | Base sur le même Pepe the Frog | Hausse spectaculaire en 2023, purement spéculative |

**Pourquoi les memecoins montent** :

1. **Effet de réseau social** : plus on en parle, plus les gens achètent, plus le prix monte
2. **Prix unitaire bas** : un token à 0,00001 dollar donne l'illusion qu'il peut "monter à 1 dollar" (ce qui nécessiterait une capitalisation supérieure au PIB mondial)
3. **FOMO** : la peur de rater une opportunité pousse les gens a acheter sans reflexion
4. **Manipulation** : des groupes coordonnes achètent massivement, font monter le prix, puis vendent (pump and dump)

**Pourquoi les memecoins descendent** :

1. L'attention se deplece vers le memecoin suivant
2. Les gros détenteurs vendent leurs positions
3. Il n'y a aucun produit, service ou revenu qui soutient le prix

**Fait** : pour chaque personne qui gagne de l'argent avec un memecoin, des milliers en perdent. C'est mathématiquement un jeu à somme négative (les frais de transaction et le spread reduisent le pot total).

---

### Comment évaluer un token : grille d'analyse factuelle

**Définition** : Avant de s'intéresser à un token, il existe des critères objectifs pour évaluer s'il à une utilité réelle ou s'il est purement spéculatif.

**Grille d'évaluation** :

| Question | Si oui | Si non |
| --- | --- | --- |
| Le token est-il nécessaire au fonctionnement du service ? | Signal positif | Le token est probablement un ajout marketing |
| Le service fonctionne-t-il déjà avec des utilisateurs réels ? | Signal positif | Tu investis dans une promesse |
| Le code source est-il ouvert et audite ? | Signal positif | Impossible de vérifier les affirmations |
| La répartition des tokens est-elle publique et equilibree ? | Signal positif | Risque de concentration et de dump par les insiders |
| Le token a-t-il des revenus ou un mécanisme de capture de valeur ? | Signal positif | Le prix ne repose que sur la spéculation |
| Le projet survivrait-il à un marché baissier de 2 ans ? | Signal positif | Risque d'abandon |

**La réalité du marche** :

- Sur les millions de tokens existants, moins de 100 ont une utilité réelle demontree
- La majorité des tokens sont créés dans le seul but de lever des fonds ou de speculer
- Le fait qu'un token soit liste sur une plateforme d'échange ne prouve rien sur sa qualité (les plateformes gagnent de l'argent sur les frais de trading, pas sur la qualité des tokens)

**Les questions que personne ne veut entendre** :

- Ce projet a-t-il besoin d'une blockchain ou une base de données classique suffirait ?
- Ce projet a-t-il besoin d'un token ou pourrait-il fonctionner avec ETH ?
- Si je retire la spéculation, est-ce que quelqu'un utiliserait encore ce token ?

---

### Les airdrops : tokens gratuits ou stratégie marketing ?

**Définition** : Un airdrop est une distribution gratuite de tokens a des adresses de wallet, généralement sans que les destinataires aient besoin de payér quoi que ce soit. Les projets envoient des tokens directement dans les wallets des utilisateurs cibles.

**Pourquoi les projets font des airdrops** :

| Objectif | Mécanisme | Exemple |
| --- | --- | --- |
| Recompenser les early adopters | Distribuer des tokens aux premiers utilisateurs du protocole | Uniswap (2020) : 400 UNI par utilisateur ayant interagi avec le protocole avant le snapshot |
| Decentralisér la distribution | Éviter que tous les tokens soient entre les mains de l'équipe et des investisseurs | Optimism (2022) : airdrop aux utilisateurs actifs sur le réseau |
| créer de la communauté | Attirer l'attention et inciter les gens a découvrir le projet | Des dizaines de projets distribuent des tokens pour se faire connaître |
| Attirer de la liquidité | Inciter les utilisateurs a déposer des fonds dans le protocole | Protocoles défi qui distribuent des tokens aux fournisseurs de liquidité |

**Airdrop farming : utiliser un protocole dans l'espoir d'un airdrop futur**

Depuis l'airdrop de Uniswap en 2020 (qui a distribue environ 400 UNI par utilisateur, d'une valeur de plusieurs milliers de dollars au pic), une pratique est apparue : l'airdrop farming.

```text
Le principe :
1. Un nouveau protocole est lance sans token
2. Des utilisateurs interagissent activement avec le protocole
   (transactions, fourniture de liquidité, utilisation régulière)
3. Quand le protocole lance son token, il distribue un airdrop
   aux utilisateurs actifs
4. Les "farmers" esperent recevoir des tokens qui auront de la valeur

Le problème :
- Les projets sont de plus en plus conscients du farming
- Ils ajoutent des critères anti-sybil (détecter les faux comptes)
- Le nombre de farmers augmente, donc la part par personne diminue
- Les coûts de gas pour farmer peuvent dépasser la valeur de l'airdrop
```

**Les risques des airdrops** :

- **Faux airdrops (arnaques)** : des messages "Vous avez reçu un airdrop, connectez votre wallet pour le reclamer" sont très souvent des arnaques qui vident ton wallet. Ne connecte jamais ton wallet à un site inconnu (voir [Phase 5, fiche 02 - Arnaques et scams](../05-securite-survie/02-arnaques-scams-manipulation.md))
- **Fiscalité** : dans la plupart des juridictions, les tokens recus par airdrop sont imposables au moment de leur reception, a leur valeur de marche. Tu peux devoir des impots sur des tokens que tu n'as pas achetes (voir [Phase 5, fiche 05 - Fiscalité](../05-securite-survie/05-fiscalite-imposition-crypto.md))
- **Dilution** : un airdrop massif augmente le nombre de tokens en circulation, ce qui peut faire baisser le prix pour les détenteurs existants
- **Pression de vente** : la majorité des bénéficiaires d'un airdrop vendent immédiatement, ce qui fait chuter le prix dans les heures ou jours suivant la distribution

**Fait** : l'airdrop de Uniswap le 17 septembre 2020 est devenu un cas d'école. Les 400 UNI distribués a chaque utilisateur valaient environ 1 360 dollars à la distribution (UNI a environ 3,40 dollars). Au pic du marché haussier, ils ont atteint plus de 16 000 dollars. Mais la majorité des bénéficiaires ont vendu rapidement, souvent pour quelques centaines de dollars.

---

## Checklist de Validation

- [ ] Je sais faire la différence entre un coin (monnaie native d'une blockchain) et un token (créé sur une blockchain existante)
- [ ] Je connais les 5 catégories de tokens : utility, governance, security, stablecoin, memecoin
- [ ] Je sais qu'un utility token doit être nécessaire au fonctionnement du service pour avoir une utilité réelle
- [ ] Je comprends que les governance tokens souffrent souvent d'une faible participation et d'une concentration du pouvoir
- [ ] Je sais que les security tokens sont soumis aux mêmes réglementations que les actifs financiers traditionnels
- [ ] Je sais qu'un memecoin n'a aucune utilité technique et que sa valeur repose uniquement sur la spéculation
- [ ] Je connais les red flags pour chaque catégorie de tokens
- [ ] Je sais utiliser la grille d'évaluation pour analyser un token de manière factuelle
- [ ] Je comprends que la grande majorité des tokens n'ont pas d'utilité réelle

---

## Navigation

← Phase précédente : **[Phase 3 - Ethereum et les smart contracts](../03-ethereum-smart-contracts/index.md)**

→ Fiche suivante : **[DeFi : finance décentralisée ou casino décentralisé](02-defi-finance-ou-casino.md)**
