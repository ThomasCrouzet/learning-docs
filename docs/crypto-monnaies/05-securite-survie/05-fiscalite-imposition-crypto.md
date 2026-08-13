---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Fiscalité des crypto-monnaies en France : quand et comment déclarer, taux d'imposition et obligations"
estimated_time: "30 min"
fiche_number: 5
total_fiches: 6
cursus: "Phase 5 - Sécurité et survie"
---

# 05 - Fiscalité : déclarer et comprendre l'imposition

> **En bref** : Comprendre quand et comment les crypto-monnaies sont imposées en France, savoir calculer une plus-value, connaître les formulaires de déclaration et les obligations fiscales. Lecture estimée : 30 min.

## Prérequis

- [Fiche 01 - Wallets : comprendre ce qu'on possède vraiment](01-wallets-comprendre-possession.md)
- [Fiche 04 - Régulation : ce que dit la loi en France et en Europe](04-regulation-loi-france-europe.md)
- Savoir ce qu'est une crypto-monnaie, un token et une plateforme d'échange
- Savoir ce qu'est la différence entre custodial et non-custodial

## Objectif de cette fiche

À la fin de cette fiche, tu sauras quand une transaction crypto est imposable en France, comment calculer une plus-value, quels formulaires utiliser pour déclarer, et quelles sont les conséquences en cas de non-déclaration.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Avertissement préalable

**IMPORTANT** : Les règles fiscales présentées dans cette fiche sont celles en vigueur en 2025-2026 pour les résidents fiscaux français (personnes physiques, activité non professionnelle). La fiscalité évolue régulièrement. Avant de faire ta déclaration, vérifie les règles actuelles sur `impots.gouv.fr` ou consulte un professionnel.

Cette fiche ne constitue pas un conseil fiscal. Elle explique les mécanismes pour que tu comprennes tes obligations.

---

### Quand est-ce imposable ?

**Définition** : En France, les crypto-monnaies sont imposées au moment de la cession - c'est-à-dire quand tu les convertis en monnaie fiat (euros, dollars) ou quand tu les utilisés pour acheter un bien ou un service.

**Ce qui est imposable** :

| Opération | Imposable ? | Explication |
| --------- | ----------- | ----------- |
| Vente de crypto contre des euros | Oui | C'est la conversion en monnaie fiat qui déclenche l'imposition |
| Vente de crypto contre des dollars | Oui | Toute monnaie fiat, pas seulement l'euro |
| Achat d'un bien avec des crypto | Oui | C'est équivalent à une vente suivie d'un achat |
| Échange de crypto contre crypto (sans soulte) | Sursis | Selon `impots.gouv.fr` (art. 150 VH bis CGI), l'échange sans soulte bénéficie d'un **sursis d'imposition** : pas d'imposition immédiate, mais le gain n'est pas "effacé" ; l'imposition intervient lors d'une cession imposable ultérieure |
| Réception de crypto en paiement d'un salaire | Oui | Imposé au titre des revenus (et non des plus-values) |
| Achat de crypto avec des euros | Non | Tu ne fais que convertir tes euros en crypto |
| Transfert de crypto entre tes propres wallets | Non | Tu déplaces tes fonds, tu ne les vends pas |

**Point essentiel** : L'échange crypto-crypto sans soulte n'est en principe **pas un fait générateur d'imposition immédiate** (sursis d'imposition). Si tu échanges du Bitcoin contre de l'Ethereum, aucune plus-value n'est en principe à déclarer à ce moment-là. L'imposition intervient lors d'une cession imposable (sortie vers fiat, achat d'un bien, etc.). Ce n'est pas une exonération définitive du gain : conserve tes historiques de prix d'acquisition.

**Seuil d'exonération de 305 € (art. 150 VH bis du CGI)** : lorsque le **total des prix de cession** de l'année (foyer fiscal) n'excède pas **305 €**, les plus-values de cession d'actifs numériques sont **exonérées d'impôt**.

Ce seuil s'apprécie sur la somme des prix de cession, pas sur le montant de la plus-value. S'il est dépassé, **toute** la plus-value annuelle devient imposable (y compris les petites opérations). Ce seuil ne dispense pas de conserver les justificatifs, ni de déclarer un compte d'actifs numériques à l'étranger (formulaire 3916-bis) le cas échéant.

Vérifie toujours le texte et la FAQ en vigueur sur `impots.gouv.fr` et Légifrance.

---

### Le régime fiscal : la flat tax

**Définition** : Depuis 2019, les plus-values sur les crypto-monnaies des particuliers (activité non professionnelle) sont soumises au Prélèvement Forfaitaire Unique (PFU), communément appelé "flat tax".

**Composition de la flat tax** :

| Composante | Taux | Nature |
| ---------- | ---- | ------ |
| Impôt sur le revenu | 12,8% | Part forfaitaire d'impôt sur le revenu |
| Prélèvements sociaux | 18,6% | CSG, CRDS et autres prélèvements sociaux |
| **Total** | **31,4%** | **Taux unique appliqué sur la plus-value nette** |

**Note sur l'évolution du taux** : Jusqu'au 31 décembre 2025, le total de la flat tax était de 30% (12,8% + 17,2% de prélèvements sociaux). Depuis le 1er janvier 2026, la loi de financement de la Sécurité sociale 2026 a relevé la CSG de 1,4 point, portant les prélèvements sociaux à 18,6% et le total à 31,4%. Vérifié le 13 août 2026 sur [service-public.fr (plus-values valeurs mobilières / PFU)](https://www.service-public.fr/particuliers/vosdroits/F21618).

**L'option pour le barème progressif** :

Tu peux choisir de soumettre tes plus-values crypto au barème progressif de l'impôt sur le revenu (au lieu des 12,8% forfaitaires). Les 18,6% de prélèvements sociaux s'appliquent dans tous les cas.

| Tranche de revenu imposable (barème 2026, revenus 2025, 1 part) | Taux marginal |
| -------------------------------------------------------------- | ------------- |
| Jusqu'à 11 600 euros | 0% |
| De 11 601 à 29 579 euros | 11% |
| De 29 580 à 84 577 euros | 30% |
| De 84 578 à 181 917 euros | 41% |
| Au-delà de 181 917 euros | 45% |

Ces tranches sont revalorisées chaque année. Vérifie le barème en vigueur sur `service-public.fr` ou `impots.gouv.fr` avant tout calcul.

**Quand choisir le barème progressif** : Si ton revenu imposable total (salaires + plus-values crypto) est faible, le barème progressif peut être plus avantageux. Par exemple, si tu es étudiant sans revenus et que tu réalises une plus-value crypto de 5 000 euros, le barème progressif te coûterait 0% d'impôt sur le revenu (tranche à 0%) + 18,6% de prélèvements sociaux = 18,6%, au lieu de 31,4% avec la flat tax.

**Attention** : Pour les plus-values d'actifs numériques, l'option pour le barème (case **3CN**) est **indépendante** de l'option barème sur les revenus de capitaux mobiliers, et elle est **définitive** (source : `impots.gouv.fr`, FAQ plus-values d'actifs numériques, mise à jour 17/07/2026). Vérifie toujours la FAQ en vigueur avant de cocher.

---

### Comment calculer la plus-value

**Définition** : La plus-value est la différence entre le prix de vente et le prix d'acquisition. En crypto, le calcul est spécifique car tu ne vends pas toujours la totalité de ton portefeuille.

**La formule officielle** :

```text
Plus-value = Prix de cession - (Prix total d'acquisition x Proportion du portefeuille cede)

Ou, en termes plus simples :
Plus-value = Prix de vente - (Ce que tout ton portefeuille t'a coûte x (Montant vendu / Valeur totale du portefeuille))
```

**Cas pratique 1 : calcul simple**

```text
Situation :
- Tu as achète 1 000 euros de Bitcoin au total (c'est ton unique investissement crypto)
- Ton portefeuille vaut maintenant 3 000 euros
- Tu vends la totalité contre des euros

Calcul :
Prix de cession = 3 000 euros
Prix total d'acquisition = 1 000 euros
Proportion cedee = 3 000 / 3 000 = 100%

Plus-value = 3 000 - (1 000 x 100%) = 3 000 - 1 000 = 2 000 euros

Impot (flat tax 31,4%) = 2 000 x 31,4% = 628 euros
Tu reçois 3 000 - 628 = 2 372 euros nets
```

**Cas pratique 2 : vente partielle**

```text
Situation :
- Tu as achète 2 000 euros de crypto au total (divers tokens)
- Ton portefeuille vaut maintenant 5 000 euros
- Tu vends pour 1 000 euros de crypto contre des euros

Calcul :
Prix de cession = 1 000 euros
Prix total d'acquisition du portefeuille entier = 2 000 euros
Valeur totale du portefeuille au moment de la vente = 5 000 euros
Proportion cedee = 1 000 / 5 000 = 20%

Plus-value = 1 000 - (2 000 x 20%) = 1 000 - 400 = 600 euros

Impot (flat tax 31,4%) = 600 x 31,4% = 188,4 euros
```

**Cas pratique 3 : moins-value**

```text
Situation :
- Tu as achète 3 000 euros de crypto au total
- Ton portefeuille vaut maintenant 1 500 euros
- Tu vends la totalité contre des euros

Calcul :
Prix de cession = 1 500 euros
Prix total d'acquisition = 3 000 euros
Proportion cedee = 1 500 / 1 500 = 100%

Plus-value = 1 500 - (3 000 x 100%) = 1 500 - 3 000 = -1 500 euros

C'est une moins-value de 1 500 euros.
Les moins-values sont reportables sur les plus-values crypto de la même année.
Si tu n'as pas d'autres plus-values crypto cette année, la moins-value est perdue
(elle n'est pas reportable sur les années suivantes pour les crypto-monnaies).
```

**Point important sur les moins-values** : Contrairement aux actions boursières, les moins-values crypto ne sont PAS reportables sur les années suivantes (en l'état actuel de la législation). Elles ne peuvent compenser que les plus-values crypto de la même année fiscale.

---

### Les formulaires de déclaration

**Définition** : La déclaration des plus-values crypto se fait lors de la déclaration annuelle des revenus. Deux formulaires spécifiques sont concernés.

**Formulaire 2086 : déclaration des plus-values**

```text
Le formulaire 2086 est le formulaire spécifique aux plus-values
de cession d'actifs numériques.

Il demande pour chaque cession :
1. La date de la cession
2. La valeur globale du portefeuille au moment de la cession
3. Le prix de cession (montant en euros reçu)
4. Le prix total d'acquisition du portefeuille
5. La plus-value ou moins-value calculee

Le résultat net (total des plus-values moins total des moins-values
de l'année) est reporte sur la déclaration de revenus (formulaire 2042-C).
```

**Formulaire 3916-bis : déclaration des comptes à l'étranger**

```text
Si tu utilisés une plateforme dont le siege social est hors de France,
tu dois déclarer ce compte chaque année.

Exemples de plateformes a déclarer :
- Binance (siege aux iles Caimans)
- Coinbase (siege aux États-Unis)
- Kraken (siege aux États-Unis)
- Bybit (siege a Dubai)
- KuCoin (siege aux Seychelles)

Exemples de comptes qui n'ont PAS besoin d'être déclarés au 3916-bis
(prestataire établi en France, agréé PSCA / CASP sur la liste blanche AMF) :
- Coinhouse (siège en France)
- Paymium (siège en France)
```

**Sanctions en cas de non-déclaration** :

| Infraction | Sanction |
| ---------- | -------- |
| Non-déclaration d'un compte à l'étranger | 750 euros par compte et par année (1 500 euros si dans un État non coopératif) |
| Non-déclaration d'un compte d'actifs numériques à l'étranger (3916-bis) | 750 euros par compte et par année (1 500 euros si le montant des avoirs dépasse 50 000 euros) - barème spécifique aux comptes d'actifs numériques, distinct des comptes bancaires |
| Non-déclaration de plus-values | Redressement fiscal + majorations de 10% à 80% selon la situation + intérêts de retard |

---

### Le cas du minage

**Définition** : Le minage de crypto-monnaies est considéré comme une activité de production en France. Les revenus du minage sont imposés différemment des plus-values.

**Regime fiscal du minage** :

| Critère | Détail |
| ------- | ------ |
| Catégorie fiscale | BNC (Benefices Non Commerciaux) |
| Fait générateur | La réception des crypto-monnaies minées (pas leur vente) |
| Base imposable | Valeur en euros des crypto-monnaies au moment de leur réception |
| Régime | Micro-BNC si recettes annuelles inférieures à 83 600 euros HT (seuil 2026, abattement de 34%), ou régime réel |

**Exemple** :

```text
Tu mines du Bitcoin et tu reçois 0,01 BTC le 15 mars.
Le cours du Bitcoin le 15 mars est de 50 000 euros.

Revenu a déclarer = 0,01 x 50 000 = 500 euros

Ce montant est impose comme un BNC, en plus de tes autres revenus.
Si tu vends ensuite ce Bitcoin avec une plus-value,
cette plus-value supplémentaire est également imposable.
```

---

### Le cas du staking et des airdrops

**Définition** : Le staking (immobilisation de crypto-monnaies pour sécuriser un réseau) est imposé en BNC selon `impots.gouv.fr` (FAQ du 17 juillet 2026). Les airdrops (distribution gratuite de tokens) n'ont pas de texte spécifique aussi net.

**État des lieux** :

| Situation | Regime fiscal probable | Niveau de certitude |
| --------- | ---------------------- | ------------------- |
| Staking | BNC (comme le minage), selon `impots.gouv.fr` (FAQ 17/07/2026) | Élevé - texte officiel, pas une exonération |
| Airdrops | BNC au moment de la reception | Incertain - pas de texte spécifique |
| Rewards de défi (yield farming) | BNC ou plus-values selon le mécanisme | Très incertain |

**Recommandation** : En l'absence de règles claires, la prudence consiste à :

1. Conserver un historique détaillé de toutes les récompenses reçues (date, montant, valeur en euros)
2. Déclarer les revenus en BNC si tu fais du staking ou du minage de manière régulière
3. Consulter un expert-comptable ou un avocat fiscaliste si les montants sont significatifs

---

### Conseils pratiques pour la déclaration

**Définition** : Voici des recommandations concrètes pour faciliter ta déclaration fiscale.

**Ce qu'il faut faire toute l'année** :

| Action | Pourquoi |
| ------ | -------- |
| Conserver l'historique de TOUTES les transactions | Nécessaire pour calculer le prix total d'acquisition et les plus-values |
| Noter la valeur totale du portefeuille à chaque cession | Indispensable pour la formule de calcul de la plus-value |
| Exporter les historiques des plateformes régulièrement | Les plateformes peuvent fermer ou perdre des données |
| Utiliser un outil de suivi fiscal (Waltio, CoinTracking, Koinly) | Ces outils automatisent le calcul des plus-values et génèrent les formulaires |

**Les erreurs fréquentes** :

| Erreur | Conséquence |
| ------ | ----------- |
| Oublier de déclarer un compte à l'étranger | Amende de 750 euros minimum par compte |
| Confondre échange crypto-crypto et cession imposable | Déclarer trop (ou pas assez) de plus-values |
| Ne pas conserver l'historique des transactions | Impossibilité de justifier le prix d'acquisition en cas de contrôle |
| Croire que « petit montant = rien à faire » | En dessous de 305 € de cessions annuelles les plus-values sont exonérées, mais les justificatifs restent nécessaires ; un compte à l'étranger doit quand même être déclaré (3916-bis) |

---

### Résumé : les règles essentielles

| Règle | Détail |
| ----- | ------ |
| Quand est-ce imposable ? | Conversion crypto vers fiat (euros), ou achat de bien/service avec crypto |
| Échange crypto-crypto (sans soulte) | Sursis d'imposition (pas d'imposition immédiate) |
| Taux d'imposition | 31,4% (flat tax) ou barème progressif sur option |
| Formulaire plus-values | 2086 |
| Formulaire comptes etrangers | 3916-bis |
| Minage | BNC (bénéfices non commerciaux) |
| Moins-values | Compensables avec les plus-values de la même année. Non reportables |
| Seuil d'exonération | 305 € de prix de cession totaux par an (art. 150 VH bis) : en dessous, plus-values exonérées ; au-delà, totalité imposable |

---

## Checklist de Validation

- [ ] Je sais que la conversion crypto vers fiat déclenche l'imposition, et que l'échange crypto-crypto sans soulte relève en principe d'un sursis d'imposition (pas d'imposition immédiate)
- [ ] Je connais le seuil d'exonération de 305 € de cessions annuelles (art. 150 VH bis) et sa limite (dépassement = totalité imposable)
- [ ] Je connais le taux de la flat tax (31,4% = 12,8% IR + 18,6% prélèvements sociaux depuis le 1er janvier 2026)
- [ ] Je sais calculer une plus-value avec la formule officielle (prix de cession - prix d'acquisition x proportion cédée)
- [ ] Je sais quand le barème progressif est plus avantageux que la flat tax
- [ ] Je connais le formulaire 2086 (plus-values) et le formulaire 3916-bis (comptes etrangers)
- [ ] Je sais que les comptes sur des plateformes étrangères doivent être déclarés (amende de 750 euros par compte)
- [ ] Je comprends que les moins-values ne sont pas reportables d'une année sur l'autre
- [ ] Je sais que le minage est imposé comme BNC, pas comme plus-value
- [ ] Je sais que le staking est imposé en BNC (FAQ impots.gouv.fr, 17/07/2026) et que les airdrops restent sans texte spécifique
- [ ] Je sais que je dois conserver l'historique de toutes mes transactions

---

## Navigation

← Fiche précédente : **[04 - Régulation : ce que dit la loi en France et en Europe](04-regulation-loi-france-europe.md)**

→ Fiche suivante : **[06 - Acheter et vendre concrètement (France)](06-acheter-vendre-concretement.md)**
