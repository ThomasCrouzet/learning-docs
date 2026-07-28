---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Régulation des crypto-monnaies : cadre légal en France (PSAN, AMF) et en Europe (MiCA)"
estimated_time: "35 min"
fiche_number: 4
total_fiches: 6
cursus: "Phase 5 - Sécurité et survie"
---

# 04 - Régulation : ce que dit la loi en France et en Europe

> **En bref** : Comprendre le cadre légal des crypto-monnaies en France (PSAN, AMF) et en Europe (MiCA), savoir quelles obligations s'appliquent aux plateformes et aux utilisateurs, et connaître les conséquences pratiques de ces réglementations. Lecture estimée : 35 min.

## Prérequis

- [Fiche 01 - Wallets : comprendre ce qu'on possède vraiment](01-wallets-comprendre-possession.md)
- [Fiche 02 - Arnaques, scams et manipulation : le guide de survie](02-arnaques-scams-manipulation.md)
- Savoir ce qu'est une crypto-monnaie, un token et une plateforme d'échange

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer le cadre légal français (PSAN, rôle de l'AMF), le règlement européen MiCA et ses implications, les différences avec l'approche américaine, et les obligations concrètes qui s'appliquent à toi en tant qu'utilisateur en France.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer à la suite.

### Pourquoi réguler les crypto-monnaies ?

**Définition** : La régulation est l'ensemble des règles juridiques imposées par les autorités publiques pour encadrer une activité économique. En matière de crypto-monnaies, la régulation vise à protéger les consommateurs, lutter contre le blanchiment d'argent et le financement du terrorisme, et assurer la stabilité financière.

**Le problème que la régulation résout** :

Sans régulation, voici les problèmes constatés :

1. **Arnaques généralisées** : aucune barrière à l'entrée pour créer une plateforme ou un token frauduleux
2. **Blanchiment d'argent** : les crypto-monnaies facilitent le transfert de fonds illicites si aucune vérification d'identité n'est requise
3. **Instabilité financière** : des faillites comme FTX ou Celsius peuvent avoir des effets en cascade sur l'ensemble du système financier
4. **Asymétrie d'information** : les utilisateurs n'ont aucun moyen de vérifier la solidité d'une plateforme

**Ce que la régulation n'est PAS** :

- La régulation n'est pas une interdiction. Réguler signifie encadrer, pas interdire. La France et l'Europe ont choisi d'encadrer les crypto-monnaies, pas de les interdire
- La régulation ne garantit pas l'absence de risque. Une plateforme régulée peut aussi faire faillite. La régulation réduit le risque, elle ne l'élimine pas

---

### Le cadre français : le statut PSAN

**Définition** : PSAN signifie Prestataire de Services sur Actifs Numériques. C'est un statut juridique créé par la loi PACTE (2019) qui oblige les entreprises fournissant des services sur actifs numériques en France à s'enregistrer auprès de l'AMF (Autorité des Marchés Financiers).

**Les services concernés par le statut PSAN** :

| Service | Description | Exemple |
| ------- | ----------- | ------- |
| Conservation d'actifs numériques | Garder les clés privées des clients | Coinhouse conserve les crypto-monnaies de ses clients |
| Achat/vente de crypto contre monnaie fiat | Permettre d'acheter des crypto avec des euros ou l'inverse | Acheter du Bitcoin avec ta carte bancaire sur Paymium |
| Échange de crypto contre crypto | Permettre d'échanger un token contre un autre | Echanger du Bitcoin contre de l'Ethereum sur une plateforme |
| Exploitation d'une plateforme de négociation | Gérer un carnet d'ordres (achat/vente) | Bitstamp opère une plateforme de trading |

**Ce que l'enregistrement PSAN impose** :

| Obligation | Description |
| ---------- | ----------- |
| KYC (Know Your Customer) | Vérification d'identité de tous les clients (pièce d'identité, justificatif de domicile) |
| LCB-FT | Lutte contre le blanchiment de capitaux et le financement du terrorisme |
| Cybersécurité | Mise en place de mesures de protection des données et des fonds |
| Honorabilité des dirigeants | Les dirigeants ne doivent pas avoir de casier judiciaire pour certaines infractions |
| Assurance ou fonds propres | Capacité financière minimale pour opérer |

**Le rôle de l'AMF** :

L'Autorité des Marchés Financiers est le régulateur français des marchés financiers. En matière de crypto-monnaies, elle :

- Enregistre les PSAN et vérifie qu'ils respectent les obligations
- Tient une liste publique des PSAN enregistrés (consultable sur `amf-france.org`)
- Publie une liste noire des sites non autorisés (consultable sur `amf-france.org/espace-epargnants`)
- Peut sanctionner les acteurs non conformes

**Comment vérifier si une plateforme est enregistrée** :

```text
1. Va sur amf-france.org
2. Cherche "Liste des PSAN enregistres"
3. Vérifie que la plateforme que tu veux utiliser est dans la liste
4. Si elle n'y est pas, cela signifie qu'elle n'est pas autorisée
   a operer en France

Quelques PSAN enregistrès en France (liste non exhaustive) :
- Coinhouse
- Paymium
- SocGen Forge (Société Générale)
- Bitstamp (pour ses activités en France)
```

---

### Le règlement européen MiCA

**Définition** : MiCA (Markets in Crypto-Assets Régulation) est le premier cadre réglementaire complet pour les crypto-actifs en Europe. Adopté en 2023, il est entré pleinement en vigueur le 30 décembre 2024.

**Ce que MiCA change** :

| Avant MiCA | Avec MiCA |
| ---------- | --------- |
| Chaque pays européen avait ses propres règles (ou pas de règles) | Un cadre unique pour les 27 pays de l'UE |
| Une plateforme enregistrée en France devait se reenregistrer dans chaque pays | Un enregistrement dans un pays de l'UE vaut pour toute l'UE ("passeport europeen") |
| Aucune règle spécifique pour les stablecoins | Règles strictes pour les émetteurs de stablecoins |
| Pas de protection spécifique pour les consommateurs | Obligations d'information et de transparence |

**Les principales dispositions de MiCA** :

| Disposition | Description |
| ----------- | ----------- |
| Enregistrement obligatoire | Toute plateforme d'échange de crypto-actifs doit être enregistrée dans un pays de l'UE |
| Whitepaper obligatoire | Tout émetteur de token doit publier un document d'information standardisé et véridique |
| Réserves pour les stablecoins | Les émetteurs de stablecoins adossés à une monnaie fiat doivent maintenir des réserves 1:1 en actifs liquides et sécurisés |
| Interdiction des stablecoins purement algorithmiques | Les stablecoins dont la stabilité repose uniquement sur un algorithme (comme Terra/LUNA) sont interdits |
| Protection des consommateurs | Interdiction des pratiques commerciales trompeuses, droit de retrait pour les acheteurs de tokens |
| Lutte contre les abus de marché | Interdiction du délit d'initié et de la manipulation de marché sur les crypto-actifs |

**Les limites de MiCA** :

| Ce que MiCA couvre | Ce que MiCA ne couvre PAS |
| ------------------ | ------------------------ |
| Tokens utilitaires (utility tokens) | NFTs (sauf s'ils sont fongibles ou utilisés comme instruments financiers) |
| Stablecoins | Protocoles défi purement décentralisés (pas d'entité identifiable à réguler) |
| Plateformes d'échange centralisées | Bitcoin et Ethereum en eux-mêmes (ce sont des actifs, pas des services) |
| Services de conservation | Les wallets non-custodial (tu geres tes propres clés) |

---

### L'approche américaine : une régulation fragmentée

**Définition** : Contrairement à l'Europe qui a choisi un cadre unique (MiCA), les États-Unis n'ont pas de loi fédérale unique pour les crypto-monnaies. Plusieurs agences se disputent la compétence, ce qui crée une incertitude juridique importante.

**Les principaux acteurs** :

| Agence | Compétence revendiquée | Position |
| ------ | ---------------------- | -------- |
| SEC (Securities and Exchange Commission) | Les tokens qui sont des "securities" (titres financiers) | Considère que la plupart des tokens sont des securities et doivent respecter la loi sur les valeurs mobilières |
| CFTC (Commodity Futures Trading Commission) | Les tokens qui sont des "commodities" (matières premières) | Considère Bitcoin et Ethereum comme des commodities |
| FinCEN (Financial Crimes Enforcement Network) | Lutte contre le blanchiment d'argent | Exige le KYC pour les plateformes |
| IRS (Internal Revenue Service) | Fiscalité | Les crypto-monnaies sont des biens imposables |

**Le débat central : security ou commodity ?**

```text
La distinction est fondamentale car les conséquences sont très différentes :

Si un token est une "security" (titre financier) :
- Il doit être enregistre auprès de la SEC
- L'émetteur doit publier des rapports financiers réguliers
- La plateforme d'échange doit être un broker enregistre
- Les penalites en cas de non-conformité sont très lourdes

Si un token est une "commodity" (matiere première) :
- Il est regule par la CFTC, dont les règles sont moins strictes
- L'émetteur a moins d'obligations de reporting
- Les plateformes ont plus de flexibilité

Le "Howey Test" (1946) est le critère utilise par la SEC pour déterminer
si un actif est une security. Un actif est une security s'il s'agit :
1. D'un investissement d'argent
2. Dans une entreprise commune
3. Avec une attente de profit
4. Provenant essentiellement des efforts d'autrui
```

**Pourquoi ça te concerne même en France** : De nombreuses plateformes et projets crypto opèrent depuis les États-Unis. Les décisions de la SEC affectent les tokens disponibles en Europe, les partenariats des projets et la confiance des investisseurs institutionnels.

---

### Le KYC : vérification d'identité obligatoire

**Définition** : KYC (Know Your Customer) est le processus par lequel une plateforme vérifie l'identité de ses clients. C'est une obligation légale dans tous les pays qui régulent les crypto-monnaies.

**Ce que le KYC implique concrètement** :

```text
Pour ouvrir un compte sur une plateforme régulée, tu dois fournir :

1. Pièce d'identité (carte d'identité, passeport ou permis de conduire)
2. Justificatif de domicile (facture de moins de 3 mois)
3. Parfois : selfie avec ta pièce d'identité
4. Parfois : déclaration de l'origine des fonds (si les montants sont importants)
```

**Pourquoi le KYC existe** :

| Raison | Explication |
| ------ | ----------- |
| Lutte contre le blanchiment | Empêcher les criminels de convertir de l'argent illicite en crypto (ou l'inverse) |
| Lutte contre le financement du terrorisme | Tracer les flux financiers suspects |
| Lutte contre l'evasion fiscale | Permettre aux administrations fiscales de vérifier les declarations |
| Protection des consommateurs | Identifier les clients pour les protéger en cas de litige |

**Ce que le KYC ne fait PAS** :

- Le KYC n'empêche pas les arnaques sur les plateformes non régulées. Il ne s'applique qu'aux plateformes qui respectent la loi
- Le KYC ne signifie pas que la plateforme est fiable. FTX appliquait le KYC à ses clients tout en détournant leurs fonds

---

### La liste noire de l'AMF

**Définition** : L'AMF publie régulièrement une liste de sites et de plateformes non autorisés à opérer en France. Cette liste est un outil de protection pour les consommateurs.

**Comment utiliser la liste noire** :

```text
1. Va sur amf-france.org
2. Rubrique "Espace epargnants" > "Proteger votre epargne"
3. Consulte la liste noire des sites non autorises
4. Si la plateforme que tu envisages d'utiliser est dans cette liste :
   ne l'utilise PAS

Attention : la liste n'est pas exhaustive. Un site absent de la liste
noire n'est pas forcément fiable. Vérifie aussi la liste positive
(PSAN enregistres).
```

---

### Obligations de l'utilisateur en France

**Définition** : En tant qu'utilisateur de crypto-monnaies résidant en France, tu as des obligations légales spécifiques, indépendamment de la plateforme utilisée.

**Les obligations** :

| Obligation | Description | Conséquence en cas de non-respect |
| ---------- | ----------- | --------------------------------- |
| Déclarer les comptes à l'étranger | Si tu utilisés une plateforme basée hors de France (Binance, Coinbase, Kraken), tu dois déclarer ce compte (formulaire 3916-bis) | Amende de 750 euros par compte non déclaré (1 500 euros si le compte est dans un État non coopératif) |
| Déclarer les plus-values | Les gains réalisés lors de la vente de crypto-monnaies contre des euros doivent être déclarés | Redressement fiscal + pénalités + intérêts de retard |
| Conserver les justificatifs | Tu dois pouvoir justifier l'origine de tes fonds et tes transactions | Difficulté à prouver ta bonne foi en cas de contrôle fiscal |

**Point important** : La fiscalité des crypto-monnaies est détaillée dans la fiche suivante (fiche 05).

---

### Résumé : comparaison des approches réglementaires

| Critère | France (PSAN) | Europe (MiCA) | USA |
| ------- | ------------- | ------------- | --- |
| Cadre | Loi PACTE (2019) | Règlement MiCA (2024) | Pas de loi unique |
| Régulateur | AMF | Autorités nationales + ESMA | SEC, CFTC, FinCEN (fragmentée) |
| Enregistrement | Obligatoire | Obligatoire (passeport EU) | Variable selon l'agence |
| KYC | Obligatoire | Obligatoire | Obligatoire |
| Stablecoins | Encadrés | Réserves 1:1, algorithmiques purs interdits | Pas de cadre spécifique (en discussion) |
| Protection consommateur | Oui (limites) | Oui (whitepaper obligatoire, droit de retrait) | Variable |
| défi | Non couverte | Non couverte (si véritablement décentralisée) | La SEC tente de réguler au cas par cas |

---

## Checklist de Validation

- [ ] Je sais ce qu'est un PSAN et pourquoi l'enregistrement est obligatoire en France
- [ ] Je sais comment vérifier si une plateforme est enregistrée auprès de l'AMF
- [ ] Je connais la liste noire de l'AMF et je sais la consulter
- [ ] Je sais ce qu'est MiCA et les principales obligations qu'il impose
- [ ] Je comprends la différence entre l'approche européenne (cadre unique) et américaine (fragmentée)
- [ ] Je sais ce qu'est le KYC et pourquoi il est obligatoire
- [ ] Je connais mes obligations en tant qu'utilisateur en France (déclaration des comptes étrangers, des plus-values, conservation des justificatifs)
- [ ] Je sais que la régulation ne garantit pas l'absence de risque
- [ ] Je comprends que les stablecoins algorithmiques purs sont interdits sous MiCA

---

## Navigation

← Fiche précédente : **[03 - FOMO, FUD et biais cognitifs : pourquoi ton cerveau te piège](03-fomo-fud-biais-cognitifs.md)**

→ Fiche suivante : **[05 - Fiscalité : déclarer et comprendre l'imposition](05-fiscalite-imposition-crypto.md)**
