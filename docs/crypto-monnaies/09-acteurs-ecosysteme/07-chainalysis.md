---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Chainalysis : traçage des transactions crypto, produits KYT et Reactor, cas célèbres et débat vie privée vs sécurité"
estimated_time: "40 min"
fiche_number: 7
total_fiches: 8
cursus: "Phase 9 - Acteurs de l'écosystème"
---

# 07 - Chainalysis : tracer les transactions pour les gouvernements

> **En bref** : Comprendre comment Chainalysis trace les transactions sur les blockchains publiques, ses produits (KYT, Reactor), les cas célèbres résolus grâce a ses outils et le débat fondamental entre vie privée et sécurité dans l'écosystème crypto. Lecture estimée : 40 min.

## Prérequis

- [Phase 9, fiche 06 - Circle](06-circle.md)
- [Phase 1, fiche 02 - Cryptographie essentielle](../01-fondamentaux/02-cryptographie-essentielle.md) (comprendre les adresses et les transactions)
- [Phase 2, fiche 02 - Transactions Bitcoin](../02-bitcoin/02-transactions-utxos-scripts.md) (comprendre le fonctionnement des transactions)

## Objectif de cette fiche

A la fin de cette fiche, tu sauras expliquer ce que fait Chainalysis, comment ses outils tracent les transactions sur les blockchains publiques, citer des cas concrets ou ces outils ont été utilisés et analyser le débat entre vie privée et sécurité que cette activité souleve.

---

## Concepts

### Histoire : rendre les blockchains lisibles pour les autorités

**Définition** : Chainalysis est une entreprise de blockchain analytics fondée en 2014 par Michael Gronager et Jonathan Levin a New York. Elle développe des logiciels qui permettent de tracer, d'analyser et de visualiser les flux de crypto-monnaies sur les blockchains publiques.

**Le contexte de la fondation** :

En 2014, Bitcoin était régulièrement associe aux activités illégales, principalement a cause de Silk Road (marché noir en ligne ferme par le FBI en 2013). Les autorités avaient besoin d'outils pour suivre les transactions en crypto-monnaies. Mais les blockchains publiques, bien que transparentes (toutes les transactions sont visibles), sont difficiles a lire sans outils specialises : les adresses sont pseudonymes et les flux peuvent être complexes.

**Le paradoxe de Bitcoin** : Bitcoin n'est pas anonyme - il est pseudonyme. Toutes les transactions sont publiques et permanentes sur la blockchain. Ce que Chainalysis fait, c'est relier les adresses pseudonymes a des identités réelles en croisant des données publiques (blockchain) avec des données privées (KYC des exchanges, données d'enquete).

**Chronologie** :

| Année | Événement |
| ----- | --------- |
| 2014 | Fondation par Michael Gronager et Jonathan Levin |
| 2015 | Premiers contrats avec le gouvernement américain |
| 2018 | Levee de fonds Serie B (30 millions de dollars) |
| 2021 | Levee de fonds Serie E (100 millions de dollars, valorisation 4,2 milliards de dollars) |
| 2022 | Levee de fonds Serie F (170 millions de dollars, valorisation 8,6 milliards de dollars) |
| 2014-2024 | Plus de 800 clients dans 70+ pays |

**Analogie concrète** : Imagine un réseau routier ou toutes les voitures circulent avec des plaques d'immatriculation mais sans nom de propriétaire inscrit dessus. N'importe qui peut voir les voitures circuler, mais personne ne sait a qui elles appartiennent. Chainalysis est l'entreprise qui relie les plaques aux propriétaires en croisant différentes sources d'information.

---

### Produits : comment Chainalysis trace les transactions

**Définition** : Chainalysis propose plusieurs produits, chacun cible un usage spécifique du traçage de transactions.

**Produits principaux** :

| Produit | Description | Clients types |
| ------- | ----------- | ------------- |
| KYT (Know Your Transaction) | Surveillance en temps réel des transactions. Alerte automatiquement quand une transaction implique une adresse suspecte (sanctionnee, liee à un hack, etc.) | Exchanges, fintech, banques |
| Reactor | Outil d'investigation visuel. Permet de suivre les flux de crypto d'adresse en adresse, de voir les connexions et de retracer l'origine et la destination des fonds | Forces de l'ordre (FBI, DEA, IRS, Europol) |
| Kryptos | Analyse de marché et recherche. Données sur les protocoles DeFi, les exchanges et les tendances | Fonds d'investissement, analystes |
| Storyline | Suivi des transactions Ethereum et des interactions avec les smart contracts | Enqueteurs, compliance |

**Comment KYT fonctionne en pratique** :

1. Un utilisateur envoie du Bitcoin à un exchange.
2. KYT analyse automatiquement l'historique de cette transaction.
3. Si les fonds proviennent d'une adresse liee à un ransomware, un marché noir ou une adresse sanctionnee, KYT déclenche une alerte.
4. L'exchange peut alors bloquer le dépôt et signaler la transaction aux autorités.

**Comment Reactor fonctionne en pratique** :

1. Un enqueteur entre une adresse Bitcoin suspecte dans Reactor.
2. Reactor affiche visuellement toutes les transactions entrantes et sortantes de cette adresse.
3. L'enqueteur peut suivre les flux d'adresse en adresse, en "deroulant le fil".
4. Quand les fonds arrivent sur une adresse identifiée (un exchange qui a fait du KYC, par exemple), l'enqueteur peut demander à l'exchange l'identité du propriétaire.
5. Le parcours complet des fonds est ainsi reconstitue.

---

### Cas célèbres : quand le traçage fonctionne

**Définition** : Chainalysis a été implique dans plusieurs affaires majeures. Voici les cas les plus documentes publiquement.

**Cas 1 : la rancon de Colonial Pipeline (2021)**

| Détail | Fait |
| ------ | ---- |
| Événement | Le groupe de ransomware DarkSide a paralyse le pipeline Colonial (qui fournit 45% du carburant de la côté est des États-Unis) |
| Rancon | Colonial a payé 75 BTC (~4,4 millions de dollars au moment du paiement) |
| Tracage | Le FBI, avec l'aide d'outils de blockchain analytics (dont Chainalysis), a suivi les BTC à travers plusieurs adresses |
| Résultat | 63,7 BTC (~2,3 millions de dollars) ont été saisis. Le FBI avait obtenu la clé privée d'une des adresses intermédiaires (les détails de comment ne sont pas publics) |

**Cas 2 : vendeurs Silk Road**

Après la fermeture de Silk Road en 2013, les autorités américaines ont continue pendant des années a identifier des vendeurs grâce au traçage des transactions. En 2020, le DOJ a saisi plus de 69 000 BTC (valant plus d'un milliard de dollars à l'époque) lies a Silk Road, grâce à l'analyse de transactions datant de 2012-2013.

**Cas 3 : faillite de Mt. Gox**

En février 2014, Mt. Gox a annoncé la disparition d'environ 850 000 BTC. Le 7 mars 2014, l'exchange a déclaré avoir retrouvé environ 200 000 BTC dans un ancien portefeuille oublié (format antérieur à juin 2011), ce qui a ramené le manque à environ 650 000 BTC.

Cette découverte a été faite par Mt. Gox elle-même, pas par un outil de blockchain analytics. Des analyses ultérieures (notamment WizSec en 2015) ont conclu que la plus grande partie des fonds restants avait été volée progressivement. Des sociétés d'analytics, dont Chainalysis, ont ensuite retracé certains mouvements publics de ces fonds.

**Cas 4 : sanctions et blanchiment**

Chainalysis a contribue à l'identification d'adresses utilisées par des groupes nord-coreens (Lazarus Group) pour blanchir les fonds volés lors de hacks (notamment le hack du pont Ronin/Axie Infinity en 2022, 625 millions de dollars).

**Ce que ces cas montrent** : les blockchains publiques laissent des traces permanentes. Des transactions effectuées il y a des années peuvent être retracees et analysees retrospectivement. Le pseudonymat de Bitcoin n'est pas un anonymat.

---

### Le débat : vie privée vs sécurité

**Définition** : L'activité de Chainalysis souleve un débat fondamental dans l'écosystème crypto. D'un côté, les forces de l'ordre utilisent ces outils pour combattre la criminalite. De l'autre, les defenseurs de la vie privée considerent que cette surveillance de masse potentielle est dangereuse.

**Les arguments pour le traçage** :

| Argument | Détail |
| -------- | ------ |
| Lutte contre la criminalite | Le traçage permet de récupérer des fonds volés, de demanteler des réseaux de ransomware et de tracer le financement du terrorisme |
| Conformité régulatoire | Les exchanges doivent respecter les lois anti-blanchiment (AML). Le traçage est nécessaire pour se conformer |
| Legitimite de l'écosystème | Si la crypto est vue comme un outil pour criminels, l'adoption grand public sera freinee |
| Justice | Les victimes de hacks et de scams ont plus de chances de récupérer leurs fonds |

**Les arguments contre le traçage** :

| Argument | Détail |
| -------- | ------ |
| Surveillance de masse | Les mêmes outils qui tracent les criminels peuvent surveiller n'importe qui. Il n'y a pas de mandat judiciaire nécessaire pour analyser une blockchain publique |
| Faux positifs | Les algorithmes de "risk scoring" peuvent flaguer des transactions légitimes. Un utilisateur innocent peut se retrouver bloque sur un exchange sans recours clair |
| Chilling effect | Si les gens savent que toutes leurs transactions sont tracees, ils s'autocensurent. La vie privée financière disparaît |
| Outil de regimes autoritaires | Ce que les democraties utilisent pour attraper des criminels, les regimes autoritaires peuvent l'utiliser pour persecuter des dissidents |
| Contradiction philosophique | Bitcoin a été créé pour resister à la censure. Le traçage de masse annule cette propriété |

**La position de Chainalysis** : Chainalysis se positionne comme un outil neutre - comparable à un expert en empreintes digitales qui travaille pour la police. L'outil ne juge pas, il analyse.

**La réponse de la communauté crypto** : des protocoles de vie privée (Tornado Cash, Monero, Zcash) existent spécifiquement pour contrer ce type de surveillance. En août 2022, le Trésor américain a sanctionne Tornado Cash (un smart contract Ethereum de mixage), creant un précédent : c'est la première fois qu'un gouvernement sanctionne du code informatique plutôt qu'une personne ou une entreprise.

---

### Modèle économique : le SaaS de la surveillance blockchain

**Définition** : Chainalysis fonctionne sur un modèle SaaS (Software as a Service). Ses clients paient des abonnements pour accéder a ses outils.

**Clients et contrats** :

| Type de client | Exemples | Type de contrat |
| -------------- | -------- | --------------- |
| Gouvernements | FBI, DEA, IRS (USA), Europol, HMRC (UK) | Contrats pluriannuels, souvent a millions de dollars |
| Exchanges | Coinbase, Binance, Kraken et autres | Abonnements pour KYT (compliance obligatoire) |
| Banques et fintech | Institutions qui touchent à la crypto | Abonnements KYT |
| Assurances et fonds | Analyse de risque | Abonnements Kryptos |

**Chiffres** :

- Valorisation : 8,6 milliards de dollars (Serie F, 2022)
- Plus de 800 clients dans 70+ pays
- Contrats gouvernementaux publics : plusieurs dizaines de millions de dollars par an (documents publics des marches gouvernementaux américains)

**Concurrents** :

| Entreprise | Siege | Particularite |
| ---------- | ----- | ------------- |
| Chainalysis | New York | Leader du marche, plus de clients gouvernementaux |
| Elliptic | Londres | Focus sur la conformité européenne |
| CipherTrace | San Jose | Acquis par Mastercard en 2021 |
| TRM Labs | San Francisco | Challenger, croissance rapide |

---

### Contribution réelle et verdict factuel

**Ce que Chainalysis a apporte à l'écosystème** :

- **Justice** : des fonds volés ont été recuperes, des criminels identifies et des victimes indemnisees grâce au traçage.
- **Conformité** : les exchanges qui utilisent KYT sont moins susceptibles de faciliter involontairement le blanchiment d'argent.
- **Données de marche** : les rapports publics de Chainalysis (Crypto Crime Report, par exemple) fournissent des données factuelles sur l'ampleur réelle de la criminalite crypto (qui est souvent inférieure a ce que le grand public imagine).

**Les critiques légitimes** :

- **Surveillance de masse** : les outils de Chainalysis sont vendus a des gouvernements sans garantie d'utilisation proportionnee. Un regime autoritaire peut utiliser Reactor pour persecuter des opposants.
- **Opacite des méthodes** : les algorithmes de scoring des risques ne sont pas publics. Un utilisateur flagge ne peut pas contester le scoring de manière transparente.
- **Bitcoin de moins en moins resistant à la censure** : chaque avancée de Chainalysis réduit la résistance à la censure de Bitcoin, qui était pourtant une de ses propriétés fondamentales.
- **Conflit d'intérêts** : Chainalysis à un intérêt commercial a ce que la surveillance blockchain reste nécessaire et s'intensifie.

**Verdict factuel** : Chainalysis fournit des outils qui servent autant la justice que la surveillance. Le même logiciel qui récupère des fonds volés peut surveiller des dissidents. La question n'est pas "Chainalysis est-il bon ou mauvais ?" mais "qui l'utilise et pour quoi ?". C'est un outil puissant dans un écosystème qui n'a pas encore tranché le débat fondamental entre transparence totale et vie privée financière.

---

## Checklist de Validation

- [ ] Je sais ce que fait Chainalysis (blockchain analytics, traçage de transactions)
- [ ] Je comprends comment KYT fonctionne (surveillance en temps réel, alertes sur adresses suspectes)
- [ ] Je comprends comment Reactor fonctionne (investigation visuelle, suivre les flux d'adresse en adresse)
- [ ] Je peux citer des cas concrets (Colonial Pipeline, Silk Road, Mt. Gox, Lazarus Group)
- [ ] Je connais les arguments pour le traçage (justice, conformité, légitimité)
- [ ] Je connais les arguments contre le traçage (surveillance de masse, faux positifs, regimes autoritaires)
- [ ] Je comprends le modèle économique (SaaS, contrats gouvernementaux, abonnements)
- [ ] Je sais que Bitcoin est pseudonyme (pas anonyme) et que le traçage exploite cette propriété

---

## Navigation

← Fiche précédente : **[Circle : l'entreprise derrière USDC](06-circle.md)**

→ Fiche suivante : **[Consensys : l'infrastructure invisible d'Ethereum](08-consensys.md)**
