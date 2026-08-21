---
tags:
  - Crypto-monnaies
  - Débutant
  - Concept
description: "Bitcoin : le contexte de la crise de 2008, Satoshi Nakamoto et les principes fondateurs du protocole"
estimated_time: "35 min"
fiche_number: 1
total_fiches: 6
cursus: "Phase 2 - Bitcoin"
id: "specializations.crypto.bitcoin.contexte-naissance-principes"
course_id: "specializations.crypto"
module_id: "specializations.crypto.bitcoin"
content_type: "lesson"
order: 1
---

# 01 - Bitcoin : contexte de naissance et principes fondateurs

> **En bref** : Comprendre pourquoi Bitcoin a été créé, dans quel contexte historique, et quels principes fondateurs guident son fonctionnement. Lecture estimée : 35 min.

## Prérequis

- [Phase 1 - Fondamentaux](../01-fondamentaux/index.md) complète (fiches 01 à 04)
- Comprendre ce qu'est une blockchain, un hash et une signature numérique

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le contexte historique qui a mené à la création de Bitcoin, décrire les principes fondateurs du protocole et distinguer ce que Bitcoin prétend résoudre de ce qu'il résout réellement.

---

## Concepts

### La crise financière de 2008

**Définition** : La crise financière de 2008 est une crise bancaire mondiale declenchee par l'effondrement du marché des subprimes aux États-Unis, qui a entraine des faillites bancaires et des renflouements massifs par les gouvernements.

**Le problème que la crise a révélé** :

La crise a mis en lumière trois dysfonctionnements majeurs du système financier :

1. **Prise de risques excessive** : les banques ont accordé des prêts immobiliers (subprimes) à des ménages qui ne pouvaient pas remboursér, puis ont revendu ces prêts sous forme de produits financiers complexes.
2. **Opacité du système** : personne ne savait exactement qui possédait quel risque. Les produits financiers étaient si complexes que même les régulateurs ne les comprenaient pas.
3. **Privatisation des profits, socialisation des pertes** : quand les banques gagnaient de l'argent, les bénéfices allaient aux actionnaires. Quand elles ont perdu, les gouvernements ont utilisé l'argent des contribuables pour les renflouer.

**Chronologie factuelle** :

| Date | Événement |
| --- | --- |
| 2007 | Les premiers défauts de paiement sur les subprimes apparaissent |
| Mars 2008 | Bear Stearns, grande banque d'investissement, est rachetée en urgence |
| 15 septembre 2008 | Lehman Brothers fait faillite - la plus grande faillite de l'histoire américaine à cette date |
| Octobre 2008 | Les gouvernements renflouent les banques (700 milliards de dollars aux États-Unis, plans similaires en Europe) |
| 3 janvier 2009 | Le premier bloc Bitcoin est miné |

**Ce que cette crise a provoqué** : une perte de confiance dans les institutions financières et les banques centrales. C'est dans ce contexte précis que Bitcoin apparaît.

---

### Satoshi Nakamoto et le whitepaper

**Définition** : Satoshi Nakamoto est le pseudonyme de la personne (ou du groupe de personnes) qui a publié le whitepaper de Bitcoin le 31 octobre 2008 et lancé le logiciel le 3 janvier 2009.

**Les faits vérifiables** :

- Le 31 octobre 2008, un message est publié sur la mailing list de cryptographie `metzdowd.com` avec un lien vers un document intitulé "Bitcoin: A Peer-to-Peer Electronic Cash System".
- Le document fait 9 pages. Il décrit un système de paiement électronique pair-à-pair qui ne nécessite aucun tiers de confiance (ni banque, ni gouvernement, ni entreprise).
- Le 3 janvier 2009, Satoshi mine le premier bloc de la blockchain Bitcoin (le "bloc genesis").
- Satoshi a communiqué par email et sur des forums jusqu'en décembre 2010, puis a cessé toute communication.
- L'identité réelle de Satoshi Nakamoto reste inconnue à ce jour. Plusieurs personnes ont été suggérées ou se sont revendiquées, mais aucune preuve définitive n'a été apportée.
- Satoshi posséderait environ 1 million de bitcoins (minés dans les premiers mois du réseau). Ces bitcoins n'ont jamais été dépensés.

**Le message du bloc genesis** :

Le premier bloc de la blockchain Bitcoin contient un message encodé :

```text
The Times 03/Jan/2009 Chancellor on brink of second bailout for banks
```

Ce message est le titre d'un article du journal britannique _The Times_ du 3 janvier 2009. Il parle du chancelier de l'Echiquier (ministre des finances britannique) sur le point d'accorder un deuxième renflouement aux banques.

Ce message remplit deux fonctions :

1. **Horodatage** : il prouve que le bloc n'a pas pu être créé avant le 3 janvier 2009 (puisque l'article n'existait pas avant cette date).
2. **Déclaration d'intention** : il place Bitcoin dans le contexte direct de la crise financière et des renflouements bancaires.

**Analogie concrète** : Le message dans le bloc genesis, c'est comme une photo du journal du jour placée dans la première pierre d'un bâtiment. Il prouve la date de construction et rappelle pourquoi le bâtiment a été construit.

---

### Les principes fondateurs du whitepaper

**Définition** : Le whitepaper de Bitcoin propose un "système de paiement électronique pair-à-pair" (peer-to-peer electronic cash system) qui permet des transactions directes entre deux personnes sans passer par un intermédiaire de confiance.

**Le problème que Bitcoin prétend résoudre** :

Le whitepaper identifie un problème précis : dans le commerce en ligne, toutes les transactions passent par des intermédiaires de confiance (banques, processeurs de paiement). Ce modèle présente trois inconvénients :

1. **Coût des intermédiaires** : chaque transaction coûte de l'argent en frais bancaires et en commissions.
2. **Transactions réversibles** : les intermédiaires peuvent annuler des transactions (chargebacks), ce qui augmente les coûts pour les commerçants.
3. **Dépendance à la confiance** : tout le système repose sur la confiance envers les intermédiaires. Si cette confiance est rompue (comme en 2008), le système est fragilisé.

**Comment Bitcoin prétend les résoudre** :

| Problème | Solution proposée par Bitcoin |
| --- | --- |
| Coût des intermédiaires | Transactions directes entre pairs, sans banque |
| Transactions réversibles | Transactions irréversibles une fois confirmées dans la blockchain |
| Dépendance à la confiance | Remplacement de la confiance par la preuve cryptographique |

**Le principe fondamental** : remplacer la confiance envers des institutions par la vérification mathématique. Au lieu de faire confiance à une banque pour dire "cette transaction est valide", le réseau Bitcoin utilise la cryptographie et le consensus des participants pour le prouver.

---

### Les cinq propriétés clés de Bitcoin

**Définition** : Bitcoin possède cinq propriétés techniques qui le distinguent des systèmes de paiement traditionnels. Chacune a des avantages et des limites.

**Propriété 1 : Décentralisé**

Aucune entité unique ne contrôle le réseau. N'importe qui peut faire tourner un nœud Bitcoin (un logiciel qui vérifie les transactions). Les décisions sont prises par consensus des participants, pas par une autorité centrale.

| Avantage | Limite |
| --- | --- |
| Pas de point de défaillance unique | Les décisions d'évolution sont lentes et conflictuelles |
| Résistant à la censure | Aucun support client si tu perds tes fonds |
| Pas de renflouement possible | La puissance de minage est de fait concentrée dans quelques pools |

**Propriété 2 : Pseudonyme (PAS anonyme)**

Les transactions sont associées à des adresses cryptographiques, pas à des noms. Mais chaque transaction est publique et traçable sur la blockchain. Si une adresse est un jour associée à une identité réelle (via une plateforme d'échange par exemple), tout l'historique de cette adresse devient attribuable.

| Pseudonyme | Anonyme |
| --- | --- |
| Ton nom n'apparaît pas directement | Personne ne peut savoir qui tu es |
| Mais tes transactions sont visibles par tous | Tes transactions sont invisibles |
| Si ton adresse est liée à ton identité, tout est traçable | Aucun lien possible |
| Bitcoin est pseudonyme | Bitcoin n'est PAS anonyme |

**Propriété 3 : Offre limitée a 21 millions**

Le protocole Bitcoin est programmé pour ne jamais créer plus de 21 millions de bitcoins. Ce nombre est codé dans le logiciel. Environ 20,0 millions de bitcoins existent déjà (le 20 millionième BTC a été miné le 9 mars 2026). Vers août 2026 : ~20,06 millions (~95,5%). Le dernier bitcoin sera miné vers l'année 2140.

**Propriété 4 : Transparent**

Chaque transaction, depuis la toute première en janvier 2009, est enregistrée dans la blockchain et accessible à tous. N'importe qui peut vérifier n'importe quelle transaction sur un explorateur de blocs comme `mempool.space`.

**Propriété 5 : Open-source**

Le code source de Bitcoin est public, consultable sur GitHub (`github.com/bitcoin/bitcoin`). N'importe qui peut lire le code, proposer des modifications ou créer sa propre version du logiciel.

---

### Ce que Bitcoin prétend résoudre vs ce qu'il résout réellement

**Définition** : Il existe un écart entre les ambitions du whitepaper et la réalité de l'utilisation de Bitcoin après plus de 15 ans d'existence. Cet écart doit être examiné factuellement.

**Tableau factuel** :

| Promesse du whitepaper | Réalité observable |
| --- | --- |
| Système de paiement pair-à-pair | Peu utilisé pour les paiements quotidiens. La majorité de l'activité est spéculative (achat/vente sur des plateformes). |
| Frais faibles | Les frais varient énormément : de quelques centimes a plus de 50 euros en période de congestion du réseau. |
| Transactions rapides | Un bloc toutes les 10 minutes en moyenne. 6 confirmations (recommandé pour les gros montants) = environ 1 heure. |
| Décentralisé | Le minage est dominé par quelques grands pools. Le développement du code est assuré par un petit nombre de contributeurs. |
| Remplacement de la confiance | Il faut toujours faire confiance aux plateformes d'échange, aux wallets logiciels, et à sa propre capacité à sécuriser ses clés. |

**Ce que Bitcoin résout réellement** :

- **Transferts internationaux sans intermédiaire bancaire** : envoyer de la valeur d'un pays à un autre sans passer par une banque est possible et fonctionne.
- **Résistance à la censure** : dans les pays où l'accès aux services bancaires est restreint ou censuré, Bitcoin offre une alternative fonctionnelle.
- **Registre infalsifiable** : l'historique des transactions ne peut pas être modifié rétroactivement.
- **Réserve de valeur** : certains utilisateurs traitent Bitcoin comme de "l'or numérique" - un actif rare et résistant à l'inflation monétaire. Ce point fait débat, car la volatilité du prix est très élevée.

**Ce que Bitcoin ne résout PAS** :

- **La volatilité** : le prix de Bitcoin peut varier de 20% ou plus en quelques jours. Ce n'est pas adapté comme unité de compte stable.
- **La complexité d'utilisation** : perdre ses clés privées signifie perdre ses fonds définitivement. Il n'existe aucun recours.
- **La scalabilité** : le réseau traite environ 7 transactions par seconde. Visa en traite environ 1 700 par seconde en moyenne (capacité maximale théorique : environ 65 000).
- **La consommation énergétique** : le mécanisme de sécurité (Proof of Work) consomme autant d'électricité qu'un petit pays. Ce point est développé dans la fiche 03.

---

## Checklist de Validation

- [ ] Je sais expliquer le contexte de la crise de 2008 (subprimes, faillite Lehman Brothers, renflouements)
- [ ] Je sais expliquer ce que signifie le message dans le bloc genesis
- [ ] Je sais que Satoshi Nakamoto est un pseudonyme et que l'identité réelle est inconnue
- [ ] Je sais décrire le problème que Bitcoin prétend résoudre (paiement sans tiers de confiance)
- [ ] Je connais les 5 propriétés clés de Bitcoin (décentralisé, pseudonyme, offre limitée, transparent, open-source)
- [ ] Je sais distinguer "pseudonyme" de "anonyme"
- [ ] Je sais nommer au moins 2 choses que Bitcoin résout réellement
- [ ] Je sais nommer au moins 2 choses que Bitcoin ne résout pas

---

## Navigation

← Phase précédente : **[Phase 1 - Fondamentaux](../01-fondamentaux/index.md)**

→ Fiche suivante : **[Transactions Bitcoin : UTXOs, scripts et vérification](02-transactions-utxos-scripts.md)**
