---
tags:
  - Crypto-monnaies
  - Intermédiaire
  - Concept
description: "Due diligence : la checklist méthodique du sceptique éclairé pour évaluer tout projet crypto"
estimated_time: "45 min"
fiche_number: 5
total_fiches: 6
cursus: "Phase 6 - Analyse critique et due diligence"
---

# 05 - Due diligence : la checklist du sceptique éclairé

> **En bref** : Appliquer une méthode complète de due diligence en 7 catégories pour évaluer tout projet crypto de manière rigoureuse, indépendante et sans émotion. Lecture estimée : 45 min.

## Prérequis

- [Phase 6 complete](index.md) (fiches 01 a 04) :
  - [Fiche 01 - Lire un whitepaper : méthode et red flags](01-lire-whitepaper-red-flags.md)
  - [Fiche 02 - Tokenomics : séparer les projets viables du vent](02-tokenomics-projets-viables.md)
  - [Fiche 03 - Analyse on-chain : les données ne mentent pas](03-analyse-on-chain-donnees.md)
  - [Fiche 04 - Autopsie de projets : échecs par catégorie](04-autopsie-projets-par-categorie.md)
- Savoir lire un whitepaper, analyser des tokenomics, utiliser les outils on-chain et reconnaître les patterns d'échec

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer une méthode de due diligence complète en 7 catégories pour évaluer n'importe quel projet crypto, utiliser la checklist finale comme outil de décision et identifier les red flags absolus qui justifient de fuir immédiatement.

---

## Concepts

### Qu'est-ce que la due diligence ?

**Définition** : La due diligence est un processus d'investigation méthodique visant à évaluer la solidité d'un projet avant de s'y engager. En finance traditionnelle, c'est une obligation légale avant toute acquisition ou investissement majeur. En crypto, c'est à chaque individu de la faire lui-même.

**Le problème que la due diligence résout** :

Sans due diligence, les décisions reposent sur :

1. **L'émotion** : FOMO (peur de rater une opportunité), euphorie du marché, pression sociale.
2. **Le marketing** : les projets dépensent des millions pour paraître légitimes (sponsoring, influenceurs, publicités).
3. **Les opinions d'inconnus** : des recommandations sur Twitter, YouTube ou Telegram, souvent faites par des personnes payées pour promouvoir un projet.

**Comment la due diligence résout ces problèmes** :

| Problème | Solution apportée par la due diligence |
| --- | --- |
| Décisions émotionnelles | Méthode systématique basée sur des critères objectifs |
| Marketing trompeur | Vérification indépendante de chaque affirmation |
| Opinions non fiables | Évaluation basée sur des données vérifiables, pas sur des avis |

**Analogie concrète** : La due diligence est comme l'inspection d'une maison avant achat. Tu ne te fies pas à la photo de l'annonce immobilière. Tu fais venir un expert qui vérifie les fondations, la toiture, l'électricité, la plomberie. Si l'expert trouve un problème structural, tu ne l'achètes pas, peu importe la beauté de la façade.

**Ce que la due diligence n'est PAS** :

- La due diligence n'est pas une garantie de succès. Même après une analyse rigoureuse, un projet peut échouer pour des raisons imprévisibles.
- La due diligence n'est pas du pessimisme. C'est une méthode neutre qui cherche les forces ET les faiblesses d'un projet.

---

### Catégorie 1 : Équipe

**Définition** : L'équipe derrière un projet est souvent l'indicateur le plus important de sa viabilité. La technologie peut être corrigée, le marketing ajusté, mais une équipe incompétente ou malhonnête ne peut pas être "réparée".

**Ce qu'il faut vérifier** :

| Élément | Comment vérifier | Signe positif | Signe négatif |
| --- | --- | --- | --- |
| Identités réelles | LinkedIn, conférences, publications | Profils vérifiables avec historique | Anonymat sans justification technique |
| Expérience pertinente | Parcours professionnel, projets précédents | Expertise en blockchain, cryptographie ou domaine d'application | CV gonflé, expérience non pertinente |
| Historique | Anciens projets réussis ou échoués | Historique transparent, y compris les échecs | Échecs cachés ou projets précédents abandonnés |
| Profils GitHub | Contributions au code du projet | Commits réguliers, code de qualité | Pas de profil, pas de contributions, ou profil créé récemment |
| Présence publique | Conférences, interviews, articles | Participation régulière et substantielle | Aucune apparition publique ou uniquement du marketing |

**L'anonymat est-il toujours un red flag ?**

| Situation | Verdict |
| --- | --- |
| Équipe anonyme d'un projet qui leve des millions | Red flag majeur |
| Développeur anonyme d'un protocole open source audite et fonctionnel (ex: Bitcoin) | Acceptable si le code est vérifiable |
| Équipe "pseudo-anonyme" avec des profils créés une semaine avant le lancement | Red flag majeur |

**Règle** : l'anonymat peut être justifié par des raisons de sécurité personnelle (dans certains pays, créer une crypto-monnaie peut être dangereux). Mais si l'équipe est anonyme ET que le code n'est pas open source ET qu'il n'y a pas d'audit, la combinaison est un signal d'alerte maximal.

---

### Catégorie 2 : Technologie

**Définition** : Un projet crypto est avant tout un projet technologique. Évaluer sa solidité technique est essentiel, même sans être développeur.

**Ce qu'il faut vérifier** :

| Élément | Comment vérifier | Signe positif | Signe négatif |
| --- | --- | --- | --- |
| Code open source | Vérifier sur GitHub | Code public, commenté, avec documentation | Code fermé ou "bientôt publié" (depuis des mois) |
| Activité GitHub | Nombre de commits, fréquence, contributeurs | Activité régulière (hebdomadaire au minimum) | Pas de commits depuis des semaines/mois |
| Audits de sécurité | Rapports publies par des auditeurs reconnus | Audits par Trail of Bits, OpenZeppelin, Certora, Consensys Diligence | Pas d'audit, ou audit par une société inconnue |
| Testnets / Mainnets | Réseau de test ou de production fonctionnel | Testnet public avec documentation pour les développeurs | Aucun réseau fonctionnel ("mainnet en 2025" depuis 2022) |
| Innovations réelles | Comparaison avec les solutions existantes | Amélioration technique mesurable et documentée | Mêmes fonctionnalités que les concurrents mais "en mieux" sans preuve |

**Comment évaluer l'activité GitHub sans être développeur** :

```text
Sur la page GitHub du projet :

1. Nombre de commits recents
   - Regarde l'onglet "Insights" > "Contributors"
   - Si personne n'a commite depuis 3 mois, le développement est
     peut-être arrête

2. Nombre de contributeurs
   - Un seul contributeur = risque de "bus factor"
     (si cette personne part, le projet meurt)
   - 10+ contributeurs actifs = signe de santé

3. Issues et Pull Requests
   - Des issues ouvertes et des discussions actives = communauté
     de développeurs engagee
   - Zéro issues = soit personne n'utilise le code, soit les issues
     sont desactivees (ce qui est un red flag)

4. Licence
   - MIT, Apache 2.0, GPL = licences open source reconnues
   - Pas de licence = droits d'utilisation flous
```

**Les audits de sécurité en détail** :

| Auditeur | Reputation | Projets audites notables |
| --- | --- | --- |
| Trail of Bits | Très élevée | Ethereum 2.0, Uniswap, Compound |
| OpenZeppelin | Très élevée | Aave, Chainlink, Coinbase |
| Certora | Élevée (vérification formelle) | Aave, Maker, Lido |
| Consensys Diligence | Élevée | Protocoles de l'écosystème Ethereum |

**Attention** : un audit ne garantit pas l'absence de bugs. Il réduit le risque. Un projet non audite qui gère des fonds importants est un risque majeur.

---

### Catégorie 3 : Tokenomics

**Définition** : Cette catégorie reprend les concepts de la fiche 02 et les intègre dans la checklist de due diligence.

**Resume des points a vérifier** :

| Élément | Ce qu'il faut vérifier | Seuil d'alerte |
| --- | --- | --- |
| Supply en circulation vs max supply | Quel pourcentage est déjà en circulation ? | < 10% en circulation |
| Distribution | Qui détient combien ? | Équipe + investisseurs > 30% |
| Vesting | Les tokens de l'équipe sont-ils bloques ? | Pas de cliff ou cliff < 6 mois |
| Utilité du token | À quoi sert le token concrètement ? | Gouvernance seule ou aucune utilité |
| Modèle économique | Le projet génère-t-il des revenus ? | Revenus uniquement dépendants du prix du token |
| Test de suppression | Le projet fonctionne-t-il sans le token ? | Oui = le token est superflu |

---

### Catégorie 4 : Communauté

**Définition** : La communauté d'un projet est un indicateur de sa santé, mais aussi un terrain fertile pour la manipulation. Savoir distinguer une communauté organique d'une echo chamber est essentiel.

**Ce qu'il faut vérifier** :

| Élément | Signe positif | Signe négatif |
| --- | --- | --- |
| Discussion technique | Les membres discutent du code, des fonctionnalités, des bugs | Les discussions portent uniquement sur le prix et les prédictions |
| Tolérance à la critique | Les questions critiques sont bienvenues et répondues | Les critiques sont supprimées, les critiques sont bannis |
| Ratio bots/vrais utilisateurs | Profils avec historique, discussions nuancées | Profils créés récemment, messages copier-coller, emojis en masse |
| Diversité des opinions | Débats constructifs avec des points de vue différents | Unanimité suspecte ("to the moon", "best project ever") |
| Forum de gouvernance | Propositions débattues publiquement avec des arguments | Pas de forum, ou forum vide |

**Comment détecter une echo chamber** :

```text
Une echo chamber est un espace ou seules les opinions positives
sont tolerees. Les signes :

1. Toute critique est accueillie par "FUD" (Fear, Uncertainty, Doubt)
   sans réponse de fond.
2. Les modérateurs bannissent les membres qui posent des questions
   inconfortables.
3. Le vocabulaire est uniformement enthousiaste ("revolutionary",
   "game-changer", "moon").
4. Les discussions techniques sont quasi absentes.
5. Les membres attaquent personnellement ceux qui ne sont pas d'accord.

Règle : si tu ne peux pas poser une question critique dans la
communauté d'un projet sans être banni ou insulte, c'est un red flag.
```

---

### Catégorie 5 : Business model

**Définition** : Le business model répond à une question simple : d'où vient l'argent ? Si la seule source de revenus est la spéculation sur le token, le projet ne survivra pas à un marché baissier prolongé.

**Questions a poser** :

| Question | Réponse saine | Réponse problematique |
| --- | --- | --- |
| D'ou viennent les revenus du projet ? | Frais de service, abonnements, commissions mesurables | "Le token prendra de la valeur" |
| Les revenus couvrent-ils les dépenses ? | Oui, ou trajectoire claire vers la rentabilité | Trésorerie qui fond sans revenus |
| Le projet survivrait-il si le token valait zéro ? | Oui, le service à une valeur propre | Non, tout dépend de la valeur du token |
| Les revenus sont-ils vérifiables on-chain ? | Oui, via les frais de protocole mesurables | Non, chiffres annonces sans preuve |
| Le modèle dépend-il de la croissance perpetuelle ? | Non, le service est viable avec une base stable | Oui, il faut toujours de nouveaux utilisateurs (schéma de Ponzi potentiel) |

**Le test du marché baissier** :

```text
Imaginez que le prix du token chute de 90% et qu'il y reste
pendant 2 ans. Que se passe-t-il ?

Projet sain :
- Les développeurs continuent de travailler (finances par les revenus du protocole)
- Le service fonctionne toujours
- Les utilisateurs utilisent le service pour son utilité, pas pour specurer

Projet fragile :
- L'équipe ne peut plus se payér (les salaires étaient en tokens)
- Les utilisateurs partent (ils étaient la pour les rendements spéculatifs)
- Le développement s'arrête
```

---

### Catégorie 6 : Risques

**Définition** : Chaque projet a des risques spécifiques. Les identifier ne signifie pas rejeter le projet, mais les ignorer signifie prendre des décisions à l'aveugle.

**Les types de risques a évaluer** :

| Type de risque | Questions a poser | Exemple |
| --- | --- | --- |
| Concurrence | Quels sont les concurrents directs ? Quelle est l'avance du projet ? | Un DEX qui arrive après Uniswap, Sushiswap, Curve, etc. |
| Dépendances | Le projet dépend-il d'un autre projet ? Si cette dépendance échoue ? | Un protocole DeFi sur Ethereum dépend de la stabilité d'Ethereum |
| Régulatoire | Le projet est-il légal dans les principales juridictions ? | Les securities tokens sont soumis à des régulations strictes |
| Technique | Quels sont les risques de bugs, hacks, pannes ? | Smart contracts non audités gérant des millions |
| Concentration | Un point de défaillance unique (une personne, un serveur, une clé) ? | Le fondateur détient la seule clé d'admin du contrat |
| Marché | Le marché visé est-il assez grand ? Les utilisateurs existent-ils ? | Un protocole de paiement dans un pays où personne n'utilise la crypto |

**Exercice** : pour chaque projet évalué, lister au minimum 3 risques spécifiques. Si tu n'en trouves aucun, c'est que tu n'as pas cherché assez.

---

### Catégorie 7 : Red flags absolus

**Définition** : Certains signaux sont si graves qu'un seul d'entre eux justifie de fuir immédiatement, sans autre analyse. Ce ne sont pas des "points d'attention" - ce sont des signaux d'alarme.

**Les red flags absolus** :

| Red flag | Pourquoi c'est eliminatoire | Exemple réel |
| --- | --- | --- |
| Rendements garantis | Aucun investissement ne peut garantir un rendement. C'est le marqueur numéro un d'un schéma de Ponzi | Bitconnect (365% par an), Celsius (17% "garanti") |
| Urgence artificielle | "Achetez maintenant avant qu'il soit trop tard" est une technique de manipulation psychologique | ICOs avec "dernière chance", countdown timers |
| Équipe anonyme sans justification + code ferme | Si on ne sait pas qui a écrit le code ET qu'on ne peut pas vérifier le code, c'est un acte de foi aveugle | Memecoins lances par des inconnus |
| Pas de code source | Un projet crypto sans code vérifiable n'est pas un projet crypto, c'est une promesse | Projets qui annoncent un mainnet "bientot" depuis des années |
| Whitepaper vague | Si le document fondateur ne contient pas de détails techniques, le projet n'a probablement pas de technologie | Whitepapers de 5 pages remplis de buzzwords |
| Schéma de parrainage | Les récompenses pour recruter de nouveaux investisseurs sont le mécanisme central des pyramides de Ponzi | Bitconnect, OneCoin, SafeMoon (schéma de referral agressif) |
| Mint illimité par le déployeur | Si le créateur peut créer des tokens à l'infini, il peut diluer les détenteurs à volonté | Tokens sans cap sur la fonction mint |

**La règle** : si un seul de ces red flags est présent, aucune autre qualité du projet ne compense. Un restaurant peut avoir la meilleure carte du monde - si la cuisine est infestée de rats, tu n'y manges pas.

---

### La checklist finale

**Définition** : Voici la checklist complète, à appliquer systématiquement à tout projet crypto. Chaque ligne est une question binaire (oui/non). Plus il y a de "non", plus le risque est élevé.

**Équipe** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 1 | Les identités des membres de l'équipe sont-elles vérifiables ? | |
| 2 | L'équipe a-t-elle une expérience pertinente (blockchain, cryptographie, domaine d'application) ? | |
| 3 | L'historique de l'équipe est-il transparent (y compris les échecs) ? | |
| 4 | Les profils GitHub montrent-ils des contributions réelles au projet ? | |

**Technologie** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 5 | Le code source est-il public et open source ? | |
| 6 | L'activité GitHub est-elle régulière (commits hebdomadaires au minimum) ? | |
| 7 | Le projet a-t-il été audite par un auditeur reconnu ? | |
| 8 | Un réseau de test ou de production est-il fonctionnel ? | |

**Tokenomics** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 9 | Plus de 20% des tokens sont-ils en circulation ? | |
| 10 | L'équipe et les investisseurs détiennent-ils moins de 30% des tokens ? | |
| 11 | Les tokens de l'équipe sont-ils soumis à un vesting avec cliff d'au moins 1 an ? | |
| 12 | Le token a-t-il une utilité concrète au-delà de la gouvernance ? | |

**Communaute** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 13 | Les discussions portent-elles sur la technologie (pas uniquement sur le prix) ? | |
| 14 | Les critiques sont-elles tolérées et répondues ? | |
| 15 | Le ratio de vrais utilisateurs semble-t-il sain (pas de bots massifs) ? | |

**Business model** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 16 | Le projet génère-t-il des revenus indépendants de la valeur du token ? | |
| 17 | Le projet survivrait-il si le token valait zéro ? | |
| 18 | Le modèle ne dépend-il pas d'une croissance perpétuelle ? | |

**Risques** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 19 | Les risques principaux sont-ils identifiés et documentés ? | |
| 20 | Il n'y a pas de point de défaillance unique (une personne, une clé) ? | |

**Red flags absolus (si un seul "oui", fuir)** :

| # | Question | Oui/Non |
| --- | --- | --- |
| 21 | Le projet promet-il des rendements garantis ? | |
| 22 | Le projet utilise-t-il l'urgence artificielle ("dernière chance") ? | |
| 23 | L'équipe est-elle anonyme ET le code est-il fermé ? | |
| 24 | Existe-t-il un schéma de parrainage ? | |
| 25 | Le déployeur peut-il créer des tokens à l'infini ? | |

**Comment interpréter les résultats** :

| Score (questions 1-20) | Interpretation |
| --- | --- |
| 18-20 "oui" | Projet solide selon ces critères (reste a évaluer d'autres facteurs) |
| 14-17 "oui" | Projet avec des faiblesses identifiées. Analyser les "non" en profondeur |
| 10-13 "oui" | Risque élevé. Plusieurs critères importants ne sont pas remplis |
| < 10 "oui" | Très haut risque. La majorité des critères de base ne sont pas remplis |
| 1+ "oui" aux questions 21-25 | Fuir. Aucun score positif sur les autres questions ne compense |

---

### Scepticisme et prudence

**Définition** : Le scepticisme n'est pas du pessimisme. C'est une méthode intellectuelle qui consiste à ne pas accepter une affirmation sans preuve suffisante.

**Différence entre scepticisme et pessimisme** :

| Scepticisme | Pessimisme |
| --- | --- |
| "Prouvez-le et je vous croirai" | "Ca ne marchera jamais" |
| Basé sur des preuves | Basé sur une émotion (la peur) |
| Ouvert à être convaincu par des faits | Fermé aux faits positifs |
| Évalue objectivement les forces ET les faiblesses | Ne voit que les faiblesses |

**Le sceptique eclaire** :

- Il ne rejette pas la crypto par principe. Il rejette les projets qui ne passent pas l'examen.
- Il reconnaît que Bitcoin, Ethereum et quelques autres projets ont une valeur technique réelle et prouvée.
- Il sait que pour chaque projet viable, il existe des dizaines de projets frauduleux ou incompetents.
- Il accepte de "rater" des opportunités plutôt que de tomber dans un piège.

**Le coût de la prudence vs le coût de l'imprudence** :

| Scénario | Coût de la prudence | Coût de l'imprudence |
| --- | --- | --- |
| Le projet réussit (tu n'as pas investi) | Tu as "rate" un gain potentiel | Tu n'as rien perdu |
| Le projet échoue (tu as investi) | Ce scénario ne se produit pas | Tu perds ton investissement (potentiellement 100%) |
| Le projet échoue (tu n'as pas investi) | Tu n'as rien perdu | Ce scénario ne se produit pas |

**Fait** : dans l'histoire de la crypto, la majorité des projets qui ont existé ont fini à zéro ou proche de zéro. Selon les données de CoinGecko, plus de 14 000 tokens ont été listés et délistés depuis 2014. La prudence protège contre la majorité des cas, pas contre une minorité.

---

## Checklist de Validation

- [ ] Je sais définir la due diligence et expliquer pourquoi elle est nécessaire
- [ ] Je sais évaluer l'équipe d'un projet (identités, expérience, historique, GitHub)
- [ ] Je sais évaluer la technologie (code open source, activité GitHub, audits, réseau fonctionnel)
- [ ] Je sais appliquer les critères de tokenomics (supply, distribution, vesting, utilité)
- [ ] Je sais distinguer une communauté saine d'une echo chamber
- [ ] Je sais évaluer un business model (revenus, test du marché baissier, dépendance au token)
- [ ] Je sais identifier les risques spécifiques d'un projet (concurrence, dépendances, régulation)
- [ ] Je connais les 7 red flags absolus et je sais qu'un seul suffit pour fuir
- [ ] Je sais utiliser la checklist en 25 questions pour évaluer un projet
- [ ] Je comprends que le scepticisme est une méthode, pas une emotion

---

## Navigation

← Fiche précédente : **[Autopsie de projets : échecs par catégorie](04-autopsie-projets-par-categorie.md)**

→ Fiche suivante : **[Lire un block explorer : le guide pratique](06-lire-block-explorer.md)**
