---
tags:
  - Audit
  - Qualité
  - Méthodologie
description: "Pourquoi auditer une application existante : trois objectifs (comprendre, protéger, prioriser) et les pièges à éviter."
estimated_time: "45 min"
fiche_number: 1
total_fiches: 6
cursus: "Audit et Qualité"
id: "transversal.audit.pourquoi-auditer"
course_id: "transversal.audit"
content_type: "lesson"
order: 1
---

# 01 - Pourquoi auditer une application existante

> **En bref** : Reprendre une application en production qui a peu de tests demande une stratégie. Cette fiche pose les trois objectifs d'un audit (comprendre, protéger, prioriser) et liste les pièges classiques. Lecture estimée : 45 min.

## Prérequis

- Cursus 09-testing, au moins la fiche [01 - Pourquoi tester](../09-testing/01-pourquoi-tester.md)
- Connaissances de base d'un framework web (Symfony, ou équivalent)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi un audit de code existant est nécessaire, identifier les trois objectifs principaux d'un audit, et reconnaître les réflexes contre-productifs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un audit de code ?

**Définition** : Un audit de code est un examen méthodique d'une base de code existante pour en comprendre l'état, cartographier son fonctionnement et identifier les zones à risque avant toute modification importante.

**Le problème que l'audit résout** :

Sans audit, voici les problèmes rencontrés sur une application en production :

1. **Dette inconnue** : une application non conçue avec des tests accumule des comportements implicites, des effets de bord et des règles métier non documentées.
2. **Absence de carte** : les développeurs nouveaux sur le projet n'ont aucun moyen de prioriser leurs lectures et leurs interventions.
3. **Modifications à l'aveugle** : sans connaître les zones critiques, chaque changement peut casser un comportement qu'on ignorait.

**Comment l'audit résout ces problèmes** :

| Problème | Solution apportée par l'audit |
| --- | --- |
| Dette inconnue | Mise en évidence des zones risquées et des comportements implicites |
| Absence de carte | Cartographie écrite des flux, routes et entités principales |
| Modifications à l'aveugle | Tests sur les invariants critiques avant intervention |

**Analogie concrète** : Pense à un inventaire de stock dans un magasin existant avant la prise de poste d'un nouveau gérant. Tu n'achètes pas de nouveaux produits, tu ne réorganises pas les rayons, tu prends d'abord la mesure de ce qui est déjà là. Tu comptes, tu notes les manques, tu repères ce qui est mal rangé. C'est seulement après cet inventaire que tu peux prendre des décisions justes.

**Ce qu'un audit n'est PAS** :

- Un audit n'est pas une réécriture. L'objectif est de comprendre l'existant, pas de le remplacer.
- Un audit n'est pas un refactoring brutal. On ne modifie pas le code pendant qu'on l'observe.
- Un audit n'est pas un jugement sur la qualité des anciens développeurs. Les décisions techniques répondent souvent à des contraintes qu'on ne voit plus.

---

### Trois objectifs d'un audit

**Définition** : Un audit poursuit trois objectifs distincts et complémentaires : comprendre l'application, protéger ses zones critiques, et prioriser les interventions futures.

**Le problème que cette structure résout** :

Sans objectifs explicites, un audit dérive en exploration générale et produit un document que personne ne lit. Les trois objectifs fournissent une grille de lecture qui rend l'audit actionnable.

**Détail des trois objectifs** :

| Objectif | Question à laquelle on répond | Livrable type |
| --- | --- | --- |
| Comprendre | Que fait cette application ? Quels acteurs ? Quels flux ? | Cartographie écrite |
| Protéger | Quelles zones casseraient si on les touchait ? | Suite de tests sur les invariants critiques |
| Prioriser | Par où commencer compte tenu du temps disponible ? | Matrice risque / effort |

**Analogie concrète** : Pense à un médecin qui rencontre un nouveau patient. Il commence par comprendre (anamnèse, examen clinique), puis il protège (vaccins, dépistages, traitement des risques majeurs), puis il priorise (quel problème traiter en premier compte tenu de la gravité et des ressources). Un audit applique la même séquence à une application.

**Ce que ces trois objectifs ne sont PAS** :

- Ce ne sont pas trois phases successives. Les trois s'enrichissent en parallèle : en cartographiant on découvre des invariants, en écrivant des tests on affine la cartographie.
- Ce ne sont pas trois livrables séparés. Un seul document peut couvrir les trois, à condition que chaque section réponde à sa question.

---

### Audit fonctionnel, audit sécurité, audit performance

**Définition** : Un audit peut cibler des dimensions différentes selon la question posée. Les trois types les plus courants sont l'audit fonctionnel (comportement métier), l'audit sécurité (vulnérabilités exploitables) et l'audit performance (temps de réponse et consommation).

**Le problème que cette distinction résout** :

Sans distinguer ces dimensions, un audit fonctionnel dérive sur des questions de sécurité ou de performance, perd en profondeur sur chaque sujet, et ne produit pas de recommandations exploitables.

**Comparaison des trois types** :

| Type | Focus | Outils typiques |
| --- | --- | --- |
| Fonctionnel | Comportement métier conforme à l'attendu | Lecture de code, tests fonctionnels |
| Sécurité | Vulnérabilités exploitables | Scanners, revue manuelle des points d'entrée |
| Performance | Goulots et temps de réponse | Profiler (Blackfire, Xdebug), métriques en production |

**Cette fiche se concentre sur l'audit fonctionnel.** Les deux autres sont mentionnés comme cousins : ils suivent la même méthode générale (comprendre, protéger, prioriser) mais sur des questions différentes.

**Analogie concrète** : Pense au contrôle technique d'un véhicule. Il vérifie plusieurs dimensions distinctes : la mécanique (freins, suspension), la sécurité passive (ceintures, airbags), la conformité réglementaire (émissions, éclairage). Chaque dimension a ses propres outils et ses propres critères. On peut faire un contrôle complet ou cibler une seule dimension.

---

### Trois principes directeurs

**Définition** : Trois principes guident la conduite d'un audit pour éviter qu'il ne devienne disproportionné, accusateur ou ponctuel : économie, humilité, itération.

**Le problème que ces principes résolvent** :

Sans ces principes, un audit produit trop de tests sans valeur, juge les anciens développeurs au lieu de comprendre leurs choix, et s'arrête à la première édition sans s'enrichir des incidents suivants.

**Détail des trois principes** :

| Principe | Énoncé | Exemple d'application |
| --- | --- | --- |
| Économie | On ne teste pas tout, on teste ce qui compte | 5 tests sur des invariants critiques valent mieux que 50 tests sur des accesseurs |
| Humilité | Le code observé est probablement bon | Avant de juger une décision étrange, supposer un contexte qu'on ne voit pas |
| Itération | L'audit n'est pas un projet unique | À chaque incident, on enrichit la cartographie |

**Analogie concrète** : Pense à un cartographe qui dessine une région. Il ne cartographie pas chaque caillou (économie). Il ne juge pas les anciens cartographes dont les cartes étaient moins précises (humilité). Il met sa carte à jour à chaque nouveau relevé (itération). C'est l'inverse d'un dessin parfait fait une fois pour toutes.

**Ce que ces principes ne sont PAS** :

- L'économie n'est pas de la paresse. Tester peu, c'est choisir, pas éviter.
- L'humilité n'est pas de la naïveté. On reste critique sur le code, on ne reste pas critique sur les personnes.
- L'itération n'est pas du report indéfini. Chaque incident impose une mise à jour rapide, pas une remise à plus tard.

---

### Quand auditer, quand ne pas auditer

**Définition** : Un audit n'est pas toujours pertinent. Sa valeur dépend du contexte du projet, du temps disponible et de la nature des modifications à venir.

**Le problème que cette distinction résout** :

Sans critères clairs, on lance des audits inutiles sur des projets qui n'en ont pas besoin (projet neuf, code jetable) ou on évite des audits là où ils auraient évité des incidents (reprise de projet existant, refonte d'un module critique).

**Tableau de décision** :

| Situation | Auditer ? |
| --- | --- |
| Reprise d'un projet existant non documenté | OUI |
| Refactoring d'un module critique | OUI sur le module concerné |
| Préparation d'une montée de version majeure | OUI ciblé |
| Projet vert (à partir de zéro) | NON, écrire des tests dès le début |
| Code temporaire jetable | NON |

**Analogie concrète** : Pense à un état des lieux d'entrée dans un logement. Il est obligatoire si tu reprends un appartement existant, parce que tu seras responsable de l'état que tu trouves. Il n'a pas de sens si tu fais construire ta maison, parce que tu en connais chaque détail. Le même critère s'applique au code.

**Ce que cette grille n'est PAS** :

- Ce n'est pas une règle absolue. Un projet vert peut justifier un audit si l'équipe initiale change et que la documentation manque.
- Ce n'est pas une excuse pour ne jamais auditer. Si tu hésites, audite à minima : une cartographie de surface vaut mieux que rien.

---

## Étapes Pratiques

### Étape 1 : Définir le périmètre

Avant tout, écris une phrase qui répond à : "Quelle question cet audit doit-il aider à trancher ?". Sans cette phrase, l'audit dérive en exploration générale et ne produit pas de décision.

Exemples de questions valides :

- "Quelles zones casseraient si on remplaçait le système d'authentification ?"
- "L'isolation des données entre clients est-elle correcte ?"
- "Quel module supporterait le moins une refonte ?"

Exemples de questions à reformuler :

- "Améliorer la qualité du code" : trop vague, ne tranche rien
- "Tout comprendre" : impossible à finir, donc impossible à livrer
- "Voir ce qu'il y a" : pas une question, c'est une exploration sans but

**Résultat attendu** :

```text
Une seule phrase, écrite en haut du document d'audit, qui précise :
  - Le sujet (zone, module, comportement)
  - L'enjeu (modification à venir, risque identifié, montée de version)
```

---

### Étape 2 : Définir le temps disponible

Si tu as 1 semaine, tu ne feras pas le même audit que si tu as 1 mois. Le temps imposé structure les choix : combien de routes cartographier, combien de tests écrire, jusqu'à quelle profondeur descendre.

Tableau temps disponibles / livrables réalistes :

| Temps | Livrable minimal |
| --- | --- |
| 1 jour | Cartographie de 10 routes critiques |
| 1 semaine | Cartographie + tableau de priorisation |
| 1 mois | Cartographie + matrice de risques + 5 à 10 tests sur les invariants |
| 3 mois | Cartographie + tests + premiers refactorings documentés |

**Résultat attendu** :

```text
Une ligne dans le document d'audit qui précise :
  - La durée allouée
  - Le livrable visé en fin de période
  - Ce qui sera laissé de côté faute de temps
```

---

### Étape 3 : Lister les sources d'information

Avant de lire du code, recense les sources d'information disponibles. Ouvrir le premier fichier au hasard n'est jamais le bon départ.

Sources typiques à consulter dans l'ordre :

- Documentation existante (README, wiki interne, CLAUDE.md du projet s'il existe)
- Schéma de base de données (`pg_dump --schema-only` ou équivalent pour ton SGBD)
- Tests existants même partiels (chaque test documente un comportement attendu)
- Historique git (qui a modifié quoi, quand, et avec quel message de commit)
- Personnes encore disponibles ayant travaillé sur le projet
- Tickets ouverts et tickets fermés récemment

**Résultat attendu** :

```text
Une liste écrite des sources consultées, avec pour chacune :
  - Sa nature (doc, code, personne)
  - Sa fraîcheur (à jour, périmée, datant de quand)
  - Sa fiabilité (officielle, officieuse, à vérifier)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `grep -rn "pattern"` | Recherche rapide dans le code |
| `git log --since="6 months ago" --pretty=format:"%h %s"` | Lire les commits récents |
| `git log --diff-filter=A -- "*.php"` | Voir les ajouts de fichiers |
| `php bin/console debug:router` | Lister les routes (si Symfony) |
| `php bin/console debug:container` | Lister les services |
| `composer outdated` | Repérer les dépendances obsolètes |

---

## Pièges Fréquents

### Piège 1 : Audit sans objectif

⚠️ **Problème** : Tu produis un document de 50 pages que personne ne lit, parce qu'il ne répond à aucune question précise.

✅ **Solution** : Toujours écrire en haut de l'audit la question qu'il aide à trancher. Si tu ne peux pas l'écrire, c'est que tu n'as pas de mandat clair.

---

### Piège 2 : Cartographie infinie

⚠️ **Problème** : Tu cartographies pendant 3 mois sans jamais écrire de test ni produire de recommandation. Le document grossit, mais rien ne progresse.

✅ **Solution** : Donner une date limite par phase. Au bout de 2 semaines de cartographie maximum, passer à l'écriture des tests, quitte à revenir compléter la carte plus tard.

---

### Piège 3 : Tests sur du code peu critique

⚠️ **Problème** : Tu testes les accesseurs, les formulaires triviaux ou les pages statiques, et tu manques les invariants métier qui sauteront à la prochaine modification.

✅ **Solution** : Suivre la matrice de priorisation. Un invariant critique est une règle métier dont la violation coûterait cher (perte de données, facturation erronée, fuite entre comptes clients).

---

### Piège 4 : Recommandations non actionnables

⚠️ **Problème** : Tu écris "Améliorer la qualité du code" ou "Refactorer ce module" sans préciser quoi, ni comment, ni quand.

✅ **Solution** : Préférer des recommandations concrètes. Exemple : "Ajouter un test fonctionnel sur la route POST /réservation avant la prochaine modification de cette route".

---

### Piège 5 : Audit isolé du métier

⚠️ **Problème** : Tu interroges uniquement le code, sans confronter aux règles métier produit. Tu identifies des invariants techniques (le code fait X) qui ne sont pas des invariants métier (X devrait être Y).

✅ **Solution** : Au moins une session avec une personne qui connaît le métier. Confronter chaque invariant technique à la question : "Est-ce le comportement attendu, ou un bug installé depuis longtemps ?"

---

## Checklist de Validation

- [ ] Je sais expliquer les trois objectifs d'un audit (comprendre, protéger, prioriser)
- [ ] Je sais formuler la question à laquelle un audit doit répondre
- [ ] Je distingue audit fonctionnel, audit sécurité et audit performance
- [ ] Je connais les pièges du "tout tester" et du "refactor en lisant"
- [ ] Je sais lister les sources d'information disponibles avant de lire le code
- [ ] Je dimensionne mes ambitions selon le temps disponible

---

## Exercice Pratique

**Énoncé** : On te confie pour la première fois une application Symfony en production qui gère un système de réservations en ligne. Tu as 1 semaine d'audit avant la prochaine grosse modification. Écris :

1. La question à laquelle ton audit doit répondre (1 phrase).
2. La liste des 5 sources d'information que tu vas consulter en priorité.
3. Le livrable attendu en fin de semaine.

**Indications** :

- La question doit pouvoir être tranchée en fin de semaine (ni trop large, ni trop floue).
- Les sources doivent être triées par priorité, en commençant par celles qui te donnent le plus de contexte au moindre coût.
- Le livrable doit être un document qu'une autre personne peut lire et utiliser, pas un brouillon mental.

**Résultat attendu** : Trois éléments écrits qui formeraient la première page du document d'audit avant de commencer la lecture du code.

---

## Solution de l'Exercice

> **Note** : Cette section contient une proposition de solution. Essaie d'abord de résoudre l'exercice par toi-même avant de la consulter. La "bonne réponse" dépend du contexte ; l'important est de pouvoir justifier tes choix.

---

Une proposition possible :

1. **Question** : "Quelles zones du code de réservation devraient être protégées par des tests avant la prochaine modification ?"

2. **Sources** par ordre de priorité :

    1. README du projet (vue d'ensemble, dépendances, commandes principales)
    2. Schéma de la base de données (entités, contraintes, relations)
    3. Historique git des 6 derniers mois (commits fréquents = zones actives)
    4. Tickets fermés récemment (incidents passés = zones fragiles)
    5. Personne ayant travaillé sur le module (questions ciblées, transmission orale)

3. **Livrable attendu en fin de semaine** :

    - Tableau de 10 à 15 routes cartographiées (verbe, URL, contrôleur, entités touchées)
    - 5 invariants critiques identifiés (règles métier dont la violation coûte cher)
    - 3 propositions de tests à écrire en priorité, avec leur justification

**Discussion** : la solution proposée est une parmi plusieurs. Une autre équipe pourrait choisir de consulter d'abord les tickets, ou de commencer par interroger une personne. L'important n'est pas le choix précis, mais le fait que chaque choix soit justifié par le contexte (temps disponible, sources fiables, enjeu de la modification à venir).

---

## Navigation

← Retour à l'index : **[Cursus Audit et Qualité](index.md)**

→ Fiche suivante : **[Cartographier une application](02-cartographier-application.md)**
