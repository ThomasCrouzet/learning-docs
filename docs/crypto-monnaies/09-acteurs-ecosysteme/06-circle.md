---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Circle : histoire de l'entreprise derrière USDC, transparence, incident SVB et modèle économique des stablecoins"
estimated_time: "35 min"
fiche_number: 6
total_fiches: 8
cursus: "Phase 9 - Acteurs de l'écosystème"
---

# 06 - Circle : l'entreprise derrière USDC

> **En bref** : Comprendre l'histoire de Circle, le fonctionnement et la transparence d'USDC, l'incident Silicon Valley Bank, le modèle économique base sur les rendements des réserves et la place de Circle dans l'écosystème des stablecoins. Lecture estimée : 35 min.

## Prérequis

- [Phase 9, fiche 05 - Kraken](05-kraken.md)
- [Phase 4, fiche 05 - Stablecoins : l'innovation utile](../04-ecosysteme-signal-bruit/05-stablecoins-innovation-utile.md) (comprendre les types de stablecoins et leur fonctionnement)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire l'histoire de Circle, expliquer comment USDC maintient sa parite avec le dollar, analyser l'incident SVB et ses conséquences, comprendre le modèle économique de Circle et comparer la transparence d'USDC avec celle de Tether (USDT).

---

## Concepts

### Histoire : de l'application de paiement au géant des stablecoins

**Définition** : Circle est une entreprise américaine fondée en 2013 par Jeremy Allaire a Boston. Circle est l'émetteur d'USDC, le deuxième plus grand stablecoin au monde par capitalisation.

**L'évolution de Circle** :

Circle n'a pas toujours été centree sur les stablecoins. L'entreprise a pivote plusieurs fois avant de trouver son positionnement actuel.

**Chronologie** :

| Année | Événement |
| ----- | --------- |
| 2013 | Fondation par Jeremy Allaire a Boston |
| 2015 | Lancement de Circle Pay (application de paiement, concurrent de Venmo) |
| 2018 | Acquisition de Poloniex (exchange) pour 400 millions de dollars |
| 2018 | Création du Centre Consortium avec Coinbase, lancement d'USDC |
| 2019 | Vente de Poloniex (reconcentration sur les stablecoins) |
| 2020 | USDC passe 1 milliard de dollars de capitalisation |
| 2021 | USDC passe 40 milliards de dollars de capitalisation |
| 2023 | Incident SVB (depeg temporaire a 0,87 dollar) |
| 2023 | Dissolution du Centre Consortium (Circle devient seul émetteur d'USDC) |
| 2024 | Conformité MiCA obtenue en Europe |

**Point important** : Circle a abandonne tous ses autres produits (application de paiement, exchange) pour se concentrer entièrement sur USDC et l'infrastructure de paiement en stablecoins. C'est un pari strategique : tout repose sur le succès d'USDC.

---

### USDC : comment fonctionne le stablecoin

**Définition** : USDC (USD Coin) est un stablecoin arrime au dollar américain. Pour chaque USDC en circulation, Circle détient un dollar équivalent en réserves. L'objectif est de maintenir en permanence 1 USDC = 1 dollar.

**Analogie concrète** : Imagine un vestiaire qui te donne un jeton pour chaque manteau déposé. Tant que le vestiaire garde bien chaque manteau, un jeton vaut toujours un manteau. USDC fonctionne sur la même logique : un jeton numérique pour un dollar gardé en réserve. Si les réserves sont mal gérées (comme lors de l'incident SVB en 2023), la confiance dans le jeton baisse temporairement.

**Mécanisme de parite** :

| Étape | Description |
| ----- | ----------- |
| Émission | Un utilisateur (généralement un institution) envoie des dollars a Circle. Circle créé (mint) le même nombre d'USDC et les envoie à l'utilisateur |
| Rachat | L'utilisateur envoie ses USDC a Circle. Circle détruit (burn) les USDC et renvoie les dollars équivalents |
| Arbitrage | Si USDC passe sous 1 dollar, des arbitrageurs achètent de l'USDC a prix réduit et le racheent chez Circle pour 1 dollar, ce qui fait remonter le prix. Si USDC passe au-dessus de 1 dollar, ils emettent de nouveaux USDC et les vendent |

**Composition des réserves** :

Circle détient les réserves d'USDC principalement dans le Circle Réserve Fund (USDXX), un fonds monétaire 2a-7 enregistré auprès de la SEC et géré par BlackRock. Le détail quotidien du portefeuille est public sur le site de BlackRock. La composition évolue :

| Type d'actif | Description |
| ------------ | ----------- |
| Bons du Trésor US à court terme et pensions reverse overnight | Majorité des réserves, via le Circle Réserve Fund (USDXX) |
| Cash en dépôt bancaire | Le reste, surtout chez des banques systémiques américaines règlementées |

Le 10-K Circle au 31 décembre 2025 indiquait environ 88 % des réserves d'USDC dans le Circle Réserve Fund. Ne mémorise pas un ratio 80/20 comme une constante : consulte [circle.com/transparency](https://www.circle.com/transparency) pour le snapshot du jour.

**Attestations mensuelles** : chaque mois, le cabinet comptable Deloitte publie une attestation (pas un audit complet, mais une vérification indépendante) confirmant que les réserves sont au moins egales aux USDC en circulation. Ces attestations sont publiques et consultables sur le site de Circle.

---

### Transparence : USDC vs Tether (USDT)

**Définition** : USDT (Tether) est le plus grand stablecoin au monde, avec une capitalisation environ 2 a 3 fois supérieure a USDC. Mais les deux diffrent radicalement en matière de transparence.

**Comparaison factuelle** :

| Critère | USDC (Circle) | USDT (Tether) |
| ------- | -------------- | -------------- |
| Attestation des réserves | Mensuelle, par Deloitte (Big Four) | Trimestrielle, par BDO Italia (moins prestigieux) |
| Composition des réserves | Detaillee (bons du Trésor, cash, pourcentages) | Moins détaillée (catégories larges, papier commercial historiquement) |
| Domiciliation | États-Unis (réglementé) | Iles Vierges britanniques |
| Historique de problèmes | Incident SVB (2023) | Amende CFTC 41 millions de dollars (2021) pour declarations inexactes sur les réserves |
| Conformité MiCA | Obtenue (2024, EMI France) | Non conforme : Tether n'a pas demandé l'autorisation EMT ; les plateformes UE agréées ont retiré USDT (échéance juillet 2026) |

**Ce que cette comparaison montre** :

- USDC est significativement plus transparent que USDT. Les attestations sont plus fréquentes, plus détaillées et realisees par un cabinet plus repute.
- Mais USDT reste le stablecoin dominant (capitalisation ~2-3x supérieure). Le marché ne récompense pas nécessairement la transparence.
- Aucun des deux n'est aussi transparent qu'un compte bancaire régulé. Les attestations ne sont pas des audits complets.

---

### L'incident SVB : quand la banque traditionnelle met en danger le stablecoin

**Définition** : En mars 2023, Silicon Valley Bank (SVB) a fait faillite. Circle avait 3,3 milliards de dollars de réserves USDC déposées chez SVB (sur environ 40 milliards de réserves totales). L'annonce a provoque un depeg temporaire d'USDC.

**Chronologie de l'incident** :

| Date | Événement |
| ---- | --------- |
| 9 mars 2023 | SVB annonce des pertes massives, les déposants paniquent |
| 10 mars 2023 | SVB est ferme par le régulateur (FDIC prend le contrôle) |
| 10 mars 2023 | Circle annonce avoir 3,3 milliards de dollars chez SVB |
| 11 mars 2023 | USDC tombe a 0,87 dollar sur les marches secondaires (panique) |
| 12 mars 2023 | Le gouvernement américain annonce la garantie de tous les dépôts chez SVB |
| 13 mars 2023 | USDC retrouve sa parite a 1 dollar |

**Ce que cet incident a révèle** :

1. **Dépendance bancaire** : un stablecoin "crypto" dépend en réalité du système bancaire traditionnel. Si la banque fait faillite, le stablecoin est en danger.
2. **Concentration des risques** : 3,3 milliards de dollars (environ 8% des réserves) dans une seule banque était une concentration excessive.
3. **Panique autorisée** : le depeg a 0,87 dollar était disproportionné. Même si SVB avait fait faillite sans garantie FDIC, Circle n'aurait perdu que 8% de ses réserves, pas 13%. La panique a amplifie le problème.
4. **Sauvetage par le gouvernement** : USDC a retrouve sa parite grâce à l'intervention du gouvernement américain, pas grâce à un mécanisme crypto. L'ironie est forte pour un actif cense être indépendant du système financier traditionnel.

**Leçon** : les stablecoins centralisés comme USDC ne sont pas à l'abri des crises bancaires traditionnelles. Ils sont un pont entre la finance traditionnelle et la crypto - et ils heritent des risques des deux systèmes.

---

### Modèle économique : gagner de l'argent en gardant celui des autres

**Définition** : Le modèle économique de Circle repose principalement sur les rendements génères par les réserves d'USDC. Ce modèle est devenu extrêmement rentable avec la hausse des taux d'intérêt.

**Comment Circle gagne de l'argent** :

| Source de revenus | Description |
| ----------------- | ----------- |
| Rendement des réserves | Les bons du Trésor dans les réserves génèrent des intérêts (~4-5% annuel en 2023-2024). Sur 30+ milliards de réserves, cela représente plus d'un milliard de dollars de revenus annuels |
| Frais d'émission/rachat | Commissions sur la création et la destruction d'USDC pour les gros clients |
| Circle Mint | Service API pour les entreprises qui veulent intégrer USDC dans leurs produits |
| CCTP | Cross-Chain Transfer Protocol - protocole pour transférer de l'USDC entre blockchains |

**Le paradoxe du modèle** :

- Quand les taux d'intérêt sont élevés (2023-2024), Circle gagne énormément sur ses réserves.
- Quand les taux sont bas (2020-2021), les réserves rapportent presque rien.
- L'utilisateur qui détient de l'USDC ne reçoit aucun rendement - tout va a Circle.

**En d'autres termes** : detenir de l'USDC, c'est prêter de l'argent a Circle a taux zéro. Circle investit cet argent dans des bons du Trésor et garde les intérêts. C'est exactement le modèle des banques traditionnelles, mais sans les protections (assurance des dépôts, régulation bancaire).

---

### Contribution réelle et verdict factuel

**Ce que Circle a apporte à l'écosystème** :

- **Stablecoin transparent** : USDC est le stablecoin le plus transparent parmi les grands stablecoins. Les attestations mensuelles par Deloitte fixent un standard.
- **Infrastructure de paiement** : USDC est utilise par des fintech, des plateformes de paiement et des protocoles DeFi comme couche de règlement.
- **Conformité MiCA** : Circle est l'un des premiers émetteurs de stablecoins a se conformer au cadre réglementaire europeen, ouvrant la voie a d'autres.
- **CCTP** : le protocole de transfert cross-chain résout un vrai problème (USDC existant sur plusieurs blockchains mais pas transferable nativement entre elles).

**Les critiques légitimes** :

- **Centralisation** : Circle peut geler des USDC sur n'importe quelle adresse (et l'a déjà fait, sur demandé des autorités américaines). Ce pouvoir contredit la promesse de résistance à la censure des crypto-monnaies.
- **Dépendance au système bancaire** : l'incident SVB a montre que USDC n'est pas à l'abri des crises bancaires.
- **Modèle économique desequilibre** : les utilisateurs prennent le risque de depeg sans recevoir de rendement. Circle prend les rendements sans prendre le risque (les réserves sont en bons du Trésor, l'actif le plus sur au monde).
- **Pouvoir d'un seul acteur** : Circle est l'unique émetteur d'USDC depuis la dissolution du Centre Consortium. Un seul acteur contrôle un stablecoin utilise dans tout l'écosystème.

**Verdict factuel** : Circle a créé le stablecoin le plus transparent du marché et construit une infrastructure de paiement utile. Mais USDC reste un actif centralisé, contrôle par une seule entreprise, dependant du système bancaire traditionnel et ne redistribuant pas les rendements a ses détenteurs. C'est un pont entre la finance traditionnelle et la crypto - avec les limites des deux mondes.

---

## Checklist de Validation

- [ ] Je connais l'histoire de Circle (2013, Jeremy Allaire, pivots vers les stablecoins)
- [ ] Je comprends le mécanisme de parite d'USDC (émission, rachat, arbitrage)
- [ ] Je sais en quoi consistent les réserves (majorité dans le Circle Réserve Fund USDXX, le reste en cash bancaire)
- [ ] Je peux comparer la transparence d'USDC et de Tether (attestations, domiciliation, historique)
- [ ] Je connais l'incident SVB (mars 2023, 3,3 milliards de dollars, depeg a 0,87 dollar, sauvetage FDIC)
- [ ] Je comprends le modèle économique (rendement des réserves, prete a taux zéro par les détenteurs)
- [ ] Je sais que Circle peut geler des USDC (pouvoir de censure centralisé)
- [ ] Je peux évaluer la contribution (transparence, infrastructure) et les limites (centralisation, dépendance bancaire)

---

## Navigation

← Fiche précédente : **[Kraken : la plateforme des puristes](05-kraken.md)**

→ Fiche suivante : **[Chainalysis : tracer les transactions pour les gouvernements](07-chainalysis.md)**
