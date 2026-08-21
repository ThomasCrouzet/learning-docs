---
tags:
  - Crypto-monnaies
  - Avancé
  - Concept
description: "Ledger : histoire, produits, Secure Élément, fuite de données 2020 et controverse Recover"
estimated_time: "40 min"
fiche_number: 1
total_fiches: 8
cursus: "Phase 9 - Acteurs de l'écosystème"
---

# 01 - Ledger : sécuriser ses clés avec du hardware français

> **En bref** : Comprendre l'histoire de Ledger, ses produits, son modèle économique et ses controverses majeures (fuite de données 2020, Ledger Recover) pour évaluer factuellement cette entreprise centrale de l'écosystème crypto. Lecture estimée : 40 min.

## Prérequis

- [Phase 8 - Perspective et avenir réaliste](../08-perspective-avenir-realiste/index.md) complete (fiches 01 a 04)
- [Phase 5, fiche 01 - Wallets : comprendre ce qu'on possède](../05-securite-survie/01-wallets-comprendre-possession.md) (comprendre clés privées, hot/cold wallets)
- Comprendre la différence entre custodial et non-custodial

## Objectif de cette fiche

À la fin de cette fiche, tu sauras décrire l'histoire de Ledger, expliquer comment fonctionne un Secure Élément, lister les produits de la gamme, analyser factuellement les deux controverses majeures (fuite de données 2020 et Ledger Recover) et évaluer la contribution réelle de l'entreprise à l'écosystème.

---

## Concepts

### Histoire : de la startup parisienne au leader mondial

**Définition** : Ledger est une entreprise française fondée en 2014 a Paris par Eric Larcheveque et 7 cofondateurs. Elle concoit et vend des hardware wallets - des appareils physiques dedies à la sécurisation des clés privées de crypto-monnaies.

**Le problème que Ledger résout** :

En 2014, les options pour stocker ses crypto-monnaies étaient limitées et risquees :

1. **Wallets logiciels** : les clés privées sont stockées sur un ordinateur ou un telephone connecte a internet. Un malware, un keylogger ou un piratage peut les voler.
2. **Exchanges** : laisser ses crypto sur un exchange signifie confier ses clés à un tiers. Le hack de Mt. Gox (2014, 850 000 BTC perdus) avait demontre le risque.
3. **Paper wallets** : imprimer ses clés sur papier est sécurisé contre le piratage informatique, mais fragile (feu, eau, perte physique) et peu pratique pour signer des transactions.

**Comment Ledger résout ces problèmes** :

| Problème | Solution apportée par Ledger |
| -------- | ---------------------------- |
| Clés exposees sur un ordinateur connecte | Les clés sont stockées dans une puce sécurisée, jamais exposees a internet |
| Confiance en un tiers (exchange) | L'utilisateur garde le contrôle total de ses clés (non-custodial) |
| Fragilite du papier | Appareil physique durable, plus pratique pour signer des transactions |

**Analogie concrète** : Un hardware wallet, c'est comme un coffre-fort portatif. Ton ordinateur est la vitrine du magasin - visible par tout le monde. Le hardware wallet est l'arriere-boutique verrouilllee ou tu gardes les objets de valeur. Même si quelqu'un casse la vitrine (pirate ton ordinateur), il n'accede pas au coffre.

**Chronologie** :

| Année | Événement |
| ----- | --------- |
| 2014 | Fondation a Paris par Eric Larcheveque et 7 cofondateurs |
| 2016 | Lancement du Ledger Nano S - premier produit grand public |
| 2019 | Pascal Gauthier (premier investisseur en 2014, ex-COO Criteo) devient Chairman et CEO, succedant a Eric Larcheveque. Lancement du Ledger Nano X (Bluetooth, plus de stockage) |
| 2020 | Fuite de la base de données clients (272 000 noms/adresses) |
| 2021 | Levee de fonds de 380 millions de dollars (valorisation 1,5 milliard de dollars) |
| 2023 | Lancement du Ledger Stax (écran E-Ink), annonce de Ledger Recover |
| 2024 | Lancement du Ledger Flex |

---

### Le Secure Élément : la puce au coeur de la sécurité

**Définition** : Un Secure Élément est une puce électronique certifiee, conçue spécifiquement pour stocker des données sensibles et resister aux attaques physiques. C'est la même technologie utilisée dans les cartes bancaires et les passeports biometriques.

**Le problème que le Secure Élément résout** :

Sans Secure Élément, un attaquant qui a accès physique à l'appareil peut tenter :

1. **Extraction de mémoire** : lire directement le contenu de la puce mémoire pour extraire les clés privées.
2. **Attaques par canaux auxiliaires** : analyser la consommation électrique ou les émissions electromagnetiques de l'appareil pendant qu'il signe une transaction pour deduire les clés.
3. **Voltage glitching** : envoyer des impulsions électriques anormales pour provoquer des erreurs et extraire des informations.

**Comment le Secure Élément resiste** :

| Type d'attaque | Protection du Secure Élément |
| -------------- | ---------------------------- |
| Extraction de mémoire | Mémoire chiffree, auto-destruction en cas de tentative d'ouverture physique |
| Canaux auxiliaires | Circuits conçu pour avoir une consommation électrique constante, masquant les opérations |
| Voltage glitching | Detecteurs d'anomalies électriques qui reinitialise la puce |

**Certification** : les Secure Éléments de Ledger sont certifies CC EAL5+ ou EAL6+ (Common Criteria Évaluation Assurance Level). Cette certification est delivree par l'ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information) en France. EAL5+ est le niveau utilise pour les cartes bancaires. EAL6+ est un niveau encore plus élevé.

**Ce qu'un Secure Élément n'est PAS** :

- Un Secure Élément n'est pas infaillible. Aucun système de sécurité n'est inviolable. Mais les attaques contre un Secure Élément certifie coûtent des dizaines de milliers d'euros en équipement et expertise, ce qui rend l'attaque non rentable pour la plupart des cibles.
- Un Secure Élément ne protège pas contre les erreurs humaines. Si tu donnes ta seed phrase à un attaquant, le Secure Élément ne peut rien y faire.

---

### Produits : la gamme Ledger

**Définition** : Ledger vend plusieurs modèles de hardware wallets, chacun cible un segment de marché différent. Tous utilisent un Secure Élément et le système d'exploitation propriétaire BOLOS.

**Comparaison des produits** :

| Modèle | Année | Prix (~) | Ecran | Connexion | Stockage d'apps |
| ------ | ----- | -------- | ----- | --------- | --------------- |
| Nano S | 2016 | 60 euros | Petit OLED | USB | Limite (3-5 apps) |
| Nano S Plus | 2022 | 80 euros | Petit OLED | USB-C | Elargi (~100 apps) |
| Nano X | 2019 | 150 euros | Petit OLED | USB-C + Bluetooth | Large (~100 apps) |
| Stax | 2023 | 280 euros | Grand E-Ink tactile | USB-C + Bluetooth | Large |
| Flex | 2024 | 250 euros | Grand E-Ink tactile | USB-C + Bluetooth | Large |

**Ledger Live** : Ledger fournit aussi une application logicielle gratuite (Ledger Live, disponible sur ordinateur et mobile). Cette application permet de gérer ses crypto-monnaies, d'envoyer et recevoir des transactions, de faire du staking et d'accéder a des services DeFi - tout en gardant les clés dans le hardware wallet. Les clés privées ne quittent jamais le Secure Élément. Ledger Live envoie les transactions a signer au hardware wallet, qui les signe en interne et renvoie la transaction signée.

---

### Modèle économique : comment Ledger gagne de l'argent

**Définition** : Ledger est une entreprise privée (non côtée en bourse) qui génère ses revenus de plusieurs sources.

**Sources de revenus** :

| Source | Description |
| ------ | ----------- |
| Vente de hardware | Marge sur chaque wallet vendu (principale source de revenus) |
| Ledger Live (services) | Commissions sur les swaps de crypto effectues via l'application |
| Ledger Enterprise | Solutions de custody pour les entreprises et les institutions |
| Ledger Recover | Abonnement mensuel pour le service de sauvegarde de la seed phrase (lance en 2023) |

**Chiffres connus** :

- Plus de 7 millions de hardware wallets vendus (chiffre communiqué par Ledger sur ledger.com/the-company)
- Valorisation de 1,5 milliard de dollars après la levee de fonds de 2021
- Levees de fonds totales : plus de 500 millions de dollars auprès d'investisseurs comme 10T Holdings, Cathay Innovation et d'autres

**Point critique** : Ledger est une entreprise qui doit croitre pour satisfaire ses investisseurs. Cette pression peut créer des tensions entre les intérêts commerciaux (vendre de nouveaux services) et les principes de sécurité (minimalisme, moins de surface d'attaque).

---

### Controverse 1 : la fuite de données de décembre 2020

**Définition** : En décembre 2020, une base de données de clients Ledger a été publiee en ligne. Cette base contenait les informations personnelles de 272 000 clients : noms, adresses email, numéros de telephone et adresses postales.

**Le problème que cette fuite a cause** :

1. **Phishing massif** : des milliers de faux emails imitant Ledger ont été envoyés aux clients, demandant de "mettre a jour leur firmware" via un lien piège qui volait leur seed phrase.
2. **Menaces physiques** : certains clients dont l'adresse postale était dans la fuite ont reçu des menaces de cambriolage. Quand un attaquant sait que tu possedes des crypto-monnaies ET ou tu habites, le risque physique est réel.
3. **Perte de confiance** : une entreprise de sécurité qui ne protège pas ses propres données clients - c'est un paradoxe difficile a justifier.

**Chronologie de la fuite** :

| Date | Événement |
| ---- | --------- |
| Juin 2020 | Ledger découvre la vulnérabilité sur son site e-commerce (API mal configurée) |
| Juillet 2020 | Ledger annonce la fuite, minimise l'ampleur (9 500 clients affectés selon eux) |
| Décembre 2020 | La base complete (272 000 clients) est publiee gratuitement sur un forum |
| 2021 | Vagues de phishing massives, plaintes de clients, class action envisagee |

**Ce que cette fuite a montre** :

- Les données des clients n'étaient pas les clés privées (celles-ci restent dans le Secure Élément). Aucune crypto-monnaie n'a été volee directement par la fuite.
- Mais les informations personnelles sont un vecteur d'attaque : avec le nom et l'adresse, un attaquant peut cibler ses victimes.
- Ledger stockait plus de données clients que nécessaire et les protegeait insuffisamment.

**Leçon** : acheter un hardware wallet de sécurité ne protège pas contre les failles de l'entreprise qui le vend. La sécurité du hardware ne garantit pas la sécurité des pratiques de l'entreprise.

---

### Controverse 2 : Ledger Recover (mai 2023)

**Définition** : En mai 2023, Ledger a annonce Ledger Recover, un service optionnel et payant (9,99 euros/mois) qui permet de sauvegarder sa seed phrase en la divisant en 3 fragments chiffres, envoyés a 3 entreprises tierces de confiance (Ledger, Coincover et EscrowTech). En cas de perte du hardware wallet et de la seed phrase, l'utilisateur peut récupérer ses clés en prouvant son identité (KYC avec passeport).

**Le problème que Ledger Recover a déclenche** :

La communauté crypto s'est revoltee. Voici pourquoi :

1. **Extraction de la seed** : le service implique que le firmware du Ledger est capable d'extraire la seed phrase du Secure Élément, de la fragmenter et de l'envoyer par internet. Avant cette annonce, beaucoup d'utilisateurs pensaient que la seed ne pouvait pas quitter le Secure Élément.
2. **Confiance en des tiers** : confier des fragments de sa seed phrase a 3 entreprises contredit le principe fondamental des hardware wallets ("ne fais confiance a personne").
3. **Mise a jour firmware** : le service est livre via une mise à jour du firmware. Même si le service est optionnel, le firmware qui permet l'extraction est installe sur tous les appareils mis a jour. La question devient : fait-on confiance a Ledger pour ne pas activer cette fonctionnalité sans le consentement de l'utilisateur ?

**Les arguments de Ledger** :

| Argument de Ledger | Contre-argument de la communauté |
| ------------------ | -------------------------------- |
| Le service est optionnel | Le firmware qui rend l'extraction possible est installe même si on n'active pas le service |
| Les fragments sont chiffres et repartis entre 3 entreprises | 3 entreprises qui cooperent (ou sont piratees) peuvent reconstituer la seed |
| Ca aide les utilisateurs non techniques qui perdent leur seed | Si la seed peut être extraite, c'est une surface d'attaque supplémentaire pour tout le monde |
| Le code sera open source | Le code n'était pas open source au moment de l'annonce |

**Ce que cette controverse révèle** :

- Un hardware wallet n'est aussi sécurisé que son firmware. L'utilisateur fait confiance à l'entreprise qui écrit le firmware.
- Le conflit d'intérêts est structurel : Ledger a besoin de revenus recurrents (abonnements), mais les utilisateurs veulent un appareil minimaliste qui ne fait rien de plus que stocker des clés.
- La transparence est cruciale. L'annonce brutale sans code source disponible a amplifie la méfiance.

---

### Contribution réelle et verdict factuel

**Ce que Ledger a apporte à l'écosystème** :

- **Democratisation** : Ledger a rendu la sécurisation des crypto-monnaies accessible au grand public. Avant les hardware wallets, seuls les utilisateurs très techniques pouvaient sécuriser correctement leurs clés.
- **Standard industriel** : le Secure Élément est devenu le standard de facto pour les hardware wallets. Les concurrents (Trezor, Coldcard) sont evalues par rapport a ce standard.
- **Ecosystem** : Ledger Live offre une interface complete qui permet d'interagir avec de nombreuses blockchains sans quitter l'environnement sécurisé.

**Les limites et les risques** :

- **Code propriétaire** : le firmware de Ledger n'est pas entièrement open source (contrairement a Trezor). L'utilisateur fait confiance a Ledger sans pouvoir vérifier le code.
- **Centralisation** : un seul constructeur domine le marché des hardware wallets. Si Ledger fait faillite ou prend de mauvaises décisions, des millions d'utilisateurs sont affectés.
- **Historique de sécurité mitige** : la fuite de 2020 et la controverse Recover montrent que même les entreprises de sécurité font des erreurs graves.

**Verdict factuel** : Ledger a rendu un service réel à l'écosystème en democratisant la sécurisation des crypto-monnaies. Mais les controverses montrent qu'il faut évaluer une entreprise de sécurité avec la même rigueur critique qu'on applique a n'importe quel projet crypto. La confiance ne se décrète pas - elle se vérifie.

---

## Checklist de Validation

- [ ] Je connais l'histoire de Ledger (fondation 2014, Paris, Eric Larcheveque)
- [ ] Je sais expliquer ce qu'est un Secure Élément et pourquoi il est important (puce certifiee CC EAL5+/6+)
- [ ] Je peux lister les principaux produits de la gamme (Nano S, Nano X, Stax, Flex)
- [ ] Je connais les détails de la fuite de données de 2020 (272 000 clients, phishing, menaces physiques)
- [ ] Je comprends la controverse Ledger Recover (extraction de la seed, fragments envoyés a 3 tiers)
- [ ] Je sais identifier le conflit d'intérêts entre revenus recurrents et minimalisme securitaire
- [ ] Je peux évaluer la contribution réelle de Ledger (democratisation de la sécurité) et ses limites (code propriétaire, centralisation)

---

## Navigation

← Phase précédente : **[Phase 8 - Perspective et avenir réaliste](../08-perspective-avenir-realiste/index.md)**

→ Fiche suivante : **[Trezor : le pionnier des hardware wallets](02-trezor.md)**
