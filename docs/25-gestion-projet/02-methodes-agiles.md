---
tags:
  - Projet
  - Débutant
  - Concept
description: "Méthodes agiles : Manifeste Agile, Scrum (rôles, cérémonies, artefacts) et Kanban (tableau, WIP, flux)."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 6
cursus: "Gestion de projet"
---

# 02 - Méthodes agiles

> **En bref** : Comprendre le Manifeste Agile, maîtriser le cadre Scrum (rôles, cérémonies, artefacts) et découvrir Kanban (tableau, WIP, flux). Lecture estimée : 75 min.

## Prérequis

- [01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les 4 valeurs et les 12 principes du Manifeste Agile, décrire les rôles, cérémonies et artefacts de Scrum, et utiliser un tableau Kanban pour visualiser un flux de travail.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Manifeste Agile ?

**Définition** : Le Manifeste Agile est un document de 2001, rédigé par 17 experts du développement logiciel, qui définit 4 valeurs et 12 principes pour guider le développement de logiciels.

**Le problème que le Manifeste Agile résout** :

Sans le Manifeste Agile, voici les problèmes rencontrés :

1. **Processus rigides** : les méthodes traditionnelles imposent des processus lourds qui ralentissent le travail sans apporter de valeur.
2. **Documentation excessive** : on passe plus de temps à rédiger des documents qu'à écrire du code fonctionnel.
3. **Client absent** : le client valide un cahier des charges en début de projet, puis ne revoit le produit qu'à la fin, 12 mois plus tard.

**Comment le Manifeste Agile résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Processus rigides | Privilégier les individus et les interactions plutôt que les processus |
| Documentation excessive | Privilégier le logiciel fonctionnel plutôt que la documentation exhaustive |
| Client absent | Privilégier la collaboration avec le client plutôt que la négociation contractuelle |

**Les 4 valeurs du Manifeste** :

| On valorise davantage... | ... que... |
| --- | --- |
| Les individus et leurs interactions | Les processus et les outils |
| Un logiciel fonctionnel | Une documentation exhaustive |
| La collaboration avec le client | La négociation contractuelle |
| L'adaptation au changement | Le suivi d'un plan |

La partie de droite a de la valeur. Mais la partie de gauche en a davantage.

**Les 12 principes du Manifeste** (résumés) :

1. Satisfaire le client par la livraison rapide de logiciel à valeur ajoutée
2. Accueillir le changement, même tard dans le projet
3. Livrer fréquemment un logiciel fonctionnel (semaines plutôt que mois)
4. Les gens du métier et les développeurs travaillent ensemble quotidiennement
5. Construire le projet autour de personnes motivées
6. La conversation en face-à-face est le moyen le plus efficace de communiquer
7. Un logiciel fonctionnel est la principale mesure de progrès
8. Rythme soutenable indéfiniment (pas de crunch permanent)
9. L'excellence technique et la bonne conception renforcent l'agilité
10. La simplicité (maximiser la quantité de travail qu'on ne fait pas)
11. Les meilleures architectures émergent d'équipes auto-organisées
12. L'équipe réfléchit régulièrement à comment devenir plus efficace

**Analogie concrète** : Le Manifeste Agile, c'est comme un guide de voyage plutôt qu'un itinéraire figé. L'itinéraire figé te dit "jour 1 : musée, jour 2 : plage, jour 3 : montagne". Le guide te dit "voici les choses intéressantes à voir, adapte ton programme selon la météo, ton humeur et les découvertes du jour".

**Ce que le Manifeste Agile n'est PAS** :

- Le Manifeste n'est pas une méthode. C'est un ensemble de valeurs et de principes. Scrum et Kanban sont des méthodes (cadres) qui implémentent ces principes.
- Le Manifeste ne dit pas "pas de documentation". Il dit que le logiciel fonctionnel a plus de valeur qu'une documentation exhaustive. On documente ce qui est utile.

---

### Qu'est-ce que Scrum ?

**Définition** : Scrum est un cadre de travail (framework) agile qui organise le développement en cycles courts appelés sprints (1 à 4 semaines), avec des rôles définis, des cérémonies régulières et des artefacts précis.

**Le problème que Scrum résout** :

Sans Scrum, voici les problèmes rencontrés :

1. **Pas de rythme** : l'équipe travaille au fil de l'eau sans cadence régulière.
2. **Pas de feedback** : personne ne vérifie régulièrement si le produit va dans la bonne direction.
3. **Pas d'amélioration** : l'équipe répète les mêmes erreurs sans prendre le temps de les analyser.

**Comment Scrum résout ces problèmes** :

| Problème | Solution apportée par Scrum |
| --- | --- |
| Pas de rythme | Sprints de durée fixe (1-4 semaines) |
| Pas de feedback | Revue de sprint avec le client à chaque fin de sprint |
| Pas d'amélioration | Rétrospective à chaque fin de sprint |

**Analogie concrète** : Scrum, c'est comme un entraînement sportif structuré. Plutôt que de courir au hasard, tu suis un programme : chaque semaine a un objectif précis, tu mesures tes progrès, tu ajustes l'intensité, et tu fais le bilan avec ton coach.

**Les trois piliers de Scrum** :

| Pilier | Description |
| --- | --- |
| Transparence | Tout le monde voit l'état du travail (backlog visible, burndown chart) |
| Inspection | L'équipe vérifie régulièrement le produit et le processus |
| Adaptation | L'équipe ajuste son plan en fonction des inspections |

---

### Les rôles Scrum

**Définition** : Scrum définit trois rôles obligatoires, chacun avec des responsabilités précises.

**Les trois rôles** :

| Rôle | Responsabilité | Analogie |
| --- | --- | --- |
| Product Owner (PO) | Définit ce qu'il faut construire et dans quel ordre. Il gère le backlog produit | Le client du restaurant qui passe commande |
| Scrum Master (SM) | Facilite le processus Scrum, supprime les obstacles, protège l'équipe | Le maître d'hôtel qui s'assure que le service se déroule bien |
| Développeurs | Réalisent le travail (code, tests, documentation). Toute l'équipe Scrum (PO + Scrum Master + développeurs) compte typiquement 10 personnes ou moins (Scrum Guide 2020) | Les cuisiniers qui préparent les plats |

**Ce que les rôles ne sont PAS** :

- Le Product Owner n'est pas un chef de projet. Il ne gère pas l'équipe, il gère le produit (les priorités, la vision).
- Le Scrum Master n'est pas un manager. Il ne donne pas d'ordres. Il facilite, coache et supprime les obstacles.
- Les développeurs ne sont pas uniquement des codeurs. Le Scrum Guide 2020 utilise ce mot pour tous ceux qui créent l'incrément (testeurs, designers, DevOps inclus).

---

### Les cérémonies Scrum

**Définition** : Le Scrum Guide définit le **Sprint** comme conteneur, plus quatre événements formels qui le structurent (soit cinq événements au total). Le raffinement du backlog (Backlog Refinement) est une activité continue recommandée, pas un cinquième événement formel distinct.

| Événement | Quand | Durée (sprint de 2 sem.) | Participants | Objectif |
| --- | --- | --- | --- | --- |
| Sprint | Conteneur de 1 à 4 semaines | Durée fixe choisie par l'équipe | Toute l'équipe Scrum | Produire un incrément utilisable |
| Sprint Planning | Début du sprint | 4h max | PO, SM, équipe | Planifier le travail du sprint |
| Daily Scrum (mêlée) | Chaque jour | 15 min max | SM, équipe (PO optionnel) | Synchroniser l'équipe |
| Sprint Review (revue) | Fin du sprint | 2h max | PO, SM, équipe, parties prenantes | Montrer ce qui a été fait |
| Sprint Retrospective | Fin du sprint (après revue) | 1h30 max | SM, équipe (PO optionnel) | Améliorer le processus |

**Activité recommandée (hors événements formels)** : le **Backlog Refinement** (clarifier et estimer les prochains éléments du Product Backlog) se fait en continu, souvent ~10% du temps de l'équipe, sans durée imposée par le Guide.

**Le Daily Scrum en détail** :

L'objectif du Daily Scrum (Scrum Guide 2020) est de **inspecter la progression vers l'objectif du sprint** et d'**adapter le plan** du jour. L'équipe de développement choisit la structure qui lui convient.

Un format encore très utilisé (héritage des guides antérieurs, toujours valide en pratique) :

1. Qu'est-ce que j'ai fait hier qui aide à atteindre l'objectif du sprint ?
2. Qu'est-ce que je vais faire aujourd'hui pour y contribuer ?
3. Est-ce que j'ai un obstacle ?

Le Daily Scrum n'est pas un rapport à un chef. C'est une synchronisation entre membres de l'équipe.

---

### Les artefacts Scrum

**Définition** : Les artefacts sont les documents et outils produits par Scrum pour rendre le travail visible.

| Artefact | Description | Responsable |
| --- | --- | --- |
| Product Backlog | Liste ordonnée de tout ce que le produit pourrait contenir | Product Owner |
| Sprint Backlog | Sous-ensemble du Product Backlog sélectionné pour le sprint en cours | Équipe de développement |
| Incrément | Le résultat fonctionnel livré à la fin de chaque sprint | Équipe de développement |

**Le Product Backlog en détail** :

- C'est une liste vivante qui évolue en permanence
- Les éléments en haut sont détaillés et prêts à être développés
- Les éléments en bas sont vagues et seront affinés plus tard
- Le PO est le seul responsable de l'ordre des éléments

---

### Qu'est-ce que Kanban ?

**Définition** : Kanban est une méthode de gestion du flux de travail qui utilise un tableau visuel pour limiter le travail en cours et optimiser le débit de livraison.

**Le problème que Kanban résout** :

Sans Kanban, voici les problèmes rencontrés :

1. **Surcharge de travail** : chaque membre de l'équipe a 10 tâches en parallèle, rien n'avance.
2. **Goulots d'étranglement invisibles** : une étape du processus bloque sans que personne ne le remarque.
3. **Pas de visibilité** : impossible de savoir ce qui est en cours et ce qui est bloqué.

**Comment Kanban résout ces problèmes** :

| Problème | Solution apportée par Kanban |
| --- | --- |
| Surcharge de travail | Limites WIP (Work In Progress) : nombre maximum de tâches en cours par colonne |
| Goulots d'étranglement invisibles | Le tableau rend les blocages visibles immédiatement |
| Pas de visibilité | Toutes les tâches sont sur le tableau, visibles par tous |

**Analogie concrète** : Kanban, c'est comme le tableau d'un restaurant qui affiche les commandes en cuisine. Chaque commande passe de "à préparer" à "en préparation" à "prêt à servir". Le chef voit d'un coup d'oeil s'il y a trop de commandes en préparation et peut ajuster.

**Comparaison Scrum vs Kanban** :

| Scrum | Kanban |
| --- | --- |
| Itérations fixes (sprints) | Flux continu (pas de sprints) |
| Rôles définis (PO, SM, équipe) | Pas de rôles imposés |
| Cérémonies obligatoires | Pas de cérémonies imposées |
| Engagement sur un sprint backlog | Pas d'engagement, flux continu |
| Burndown chart | Lead time, cycle time |
| Changement interdit pendant le sprint | Changement autorisé à tout moment |

**Ce que Kanban n'est PAS** :

- Kanban n'est pas un simple tableau de post-its. Le tableau est l'outil, mais Kanban repose sur des règles précises (limites WIP, politique explicite, mesure du flux).
- Kanban n'est pas incompatible avec Scrum. Beaucoup d'équipes combinent les deux (Scrumban) : sprints de Scrum + tableau et limites WIP de Kanban.

---

## Étapes Pratiques

### Étape 1 : Créer un tableau Kanban simple

Crée un tableau Kanban pour un projet de développement web. Utilise un tableau blanc, un mur avec des post-its, ou un outil en ligne (Trello, Vikunja, Jira).

```text
Colonnes du tableau :

| À faire | En cours (max 3) | En revue (max 2) | Terminé |
| ------- | ----------------- | ----------------- | ------- |
|         |                   |                   |         |
```

Les nombres entre parenthèses sont les limites WIP. "En cours (max 3)" signifie que l'équipe ne peut pas avoir plus de 3 tâches en développement simultanément.

---

### Étape 2 : Simuler un sprint planning

Voici un Product Backlog fictif pour une application de gestion de tâches :

```text
Product Backlog (ordonné par priorité) :

1. [US-001] En tant qu'utilisateur, je veux créer un compte pour
   accéder à l'application (5 points)
2. [US-002] En tant qu'utilisateur, je veux me connecter avec mon
   email et mot de passe (3 points)
3. [US-003] En tant qu'utilisateur, je veux créer une tâche avec un
   titre et une description (3 points)
4. [US-004] En tant qu'utilisateur, je veux marquer une tâche comme
   terminée (2 points)
5. [US-005] En tant qu'utilisateur, je veux supprimer une tâche
   (1 point)
6. [US-006] En tant qu'utilisateur, je veux filtrer les tâches par
   statut (3 points)
7. [US-007] En tant qu'utilisateur, je veux assigner une tâche à un
   membre de l'équipe (5 points)
8. [US-008] En tant qu'utilisateur, je veux recevoir une notification
   quand une tâche m'est assignée (8 points)
```

Si la vélocité de l'équipe est de 13 points par sprint, sélectionne les user stories pour le sprint :

```text
Sprint Backlog (vélocité = 13 points) :

- [US-001] Créer un compte (5 points)
- [US-002] Se connecter (3 points)
- [US-003] Créer une tâche (3 points)
- [US-004] Marquer comme terminé (2 points)
Total : 13 points ✓

On ne prend pas US-005 (1 point) car 13 + 1 = 14 > vélocité.
En pratique, l'équipe pourrait décider de le prendre si elle est
confiante, mais il vaut mieux sous-promettre et sur-livrer.
```

---

### Étape 3 : Simuler un Daily Scrum

Voici les réponses de trois membres de l'équipe au Daily Scrum du mercredi :

```text
Alice (développeuse front-end) :
- Hier : j'ai terminé la maquette de la page de connexion
- Aujourd'hui : je commence l'intégration HTML/CSS de la page
- Obstacle : aucun

Bob (développeur back-end) :
- Hier : j'ai travaillé sur l'API de création de compte
- Aujourd'hui : je continue l'API, il me reste la validation email
- Obstacle : j'ai besoin de savoir quel service d'email on utilise

Charlie (testeur) :
- Hier : j'ai écrit les tests pour la création de compte
- Aujourd'hui : je vais exécuter les tests quand Bob aura fini l'API
- Obstacle : j'attends que l'API soit prête
```

L'obstacle de Bob doit être traité par le Scrum Master. Le Scrum Master organise une réunion avec le PO et Bob pour décider du service d'email. Charlie ne peut pas avancer tant que Bob n'a pas terminé : le Scrum Master peut aider Charlie à trouver du travail en attendant (écrire des tests supplémentaires, documenter).

---

## Pièges Fréquents

### Piège 1 : Le Scrum Master devient un chef de projet

**Problème** : Le Scrum Master donne des ordres, assigne les tâches et fait du micro-management. L'équipe perd son autonomie.

**Solution** : Le Scrum Master facilite. Il ne décide pas qui fait quoi. C'est l'équipe de développement qui s'auto-organise. Le SM supprime les obstacles, anime les cérémonies et coache l'équipe sur les pratiques agiles.

---

### Piège 2 : Les Daily Scrum qui durent 45 minutes

**Problème** : Le Daily Scrum se transforme en réunion technique où on résout les problèmes.

**Solution** : 15 minutes maximum. Trois questions, pas de résolution de problèmes. Les discussions techniques se font après le Daily, entre les personnes concernées.

---

### Piège 3 : Kanban sans limites WIP

**Problème** : On utilise un tableau Kanban mais sans limiter le nombre de tâches en cours. Résultat : tout le monde a 8 tâches en parallèle, rien n'avance.

**Solution** : Fixe des limites WIP strictes. Si la colonne "En cours" est limitée à 3 et qu'il y a déjà 3 cartes, il faut terminer une carte avant d'en commencer une nouvelle. C'est la règle fondamentale de Kanban.

---

### Piège 4 : Confondre vélocité et productivité

**Problème** : Le manager veut que la vélocité augmente chaque sprint. L'équipe gonfle les estimations pour avoir l'air plus productive.

**Solution** : La vélocité est un outil de planification, pas une mesure de performance. Elle sert à prédire combien de travail l'équipe peut accomplir dans un sprint. Elle se stabilise naturellement au bout de 3-5 sprints.

---

## Checklist de Validation

- J'ai compris les 4 valeurs du Manifeste Agile
- Je sais nommer les 3 rôles Scrum et leurs responsabilités
- Je sais lister les 5 événements Scrum (Sprint + 4 événements formels)
- Je sais expliquer ce qu'est un Product Backlog et un Sprint Backlog
- Je sais créer un tableau Kanban avec des limites WIP
- Je sais faire la différence entre Scrum et Kanban

---

## Exercice Pratique

**Énoncé** : Tu fais partie d'une équipe Scrum de 5 personnes (1 PO, 1 SM, 3 développeurs). Vous commencez un projet de blog collaboratif. Prépare les éléments suivants :

1. Un Product Backlog avec 10 user stories ordonnées par priorité
2. Une estimation en story points pour chaque user story (1, 2, 3, 5, 8 ou 13)
3. Un Sprint Backlog pour le premier sprint (vélocité estimée : 20 points)
4. Un tableau Kanban avec les limites WIP appropriées

**Indications** :

- Utilise le format : "En tant que [rôle], je veux [action] pour [bénéfice]"
- Commence par les fonctionnalités essentielles (inscription, connexion, création d'article)
- Les limites WIP dépendent de la taille de l'équipe (3 développeurs = limites de 2-3)

**Résultat attendu** : Un document structuré avec les 4 éléments demandés.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
1. PRODUCT BACKLOG (ordonné par priorité)

  #  | User Story                                                    | Points
  -- | ------------------------------------------------------------- | ------
  01 | En tant qu'utilisateur, je veux créer un compte pour accéder  |   5
     | au blog                                                       |
  02 | En tant qu'utilisateur, je veux me connecter avec mon email   |   3
     | et mot de passe                                               |
  03 | En tant qu'auteur, je veux écrire un article avec titre et    |   5
     | contenu pour publier sur le blog                              |
  04 | En tant que lecteur, je veux voir la liste des articles sur   |   3
     | la page d'accueil                                             |
  05 | En tant que lecteur, je veux lire un article complet en       |   2
     | cliquant dessus                                               |
  06 | En tant qu'auteur, je veux modifier un article que j'ai écrit |   3
  07 | En tant qu'auteur, je veux supprimer un article que j'ai      |   2
     | écrit                                                         |
  08 | En tant que lecteur, je veux commenter un article             |   5
  09 | En tant qu'auteur, je veux ajouter des catégories à mes       |   3
     | articles                                                      |
  10 | En tant que lecteur, je veux filtrer les articles par          |   5
     | catégorie                                                     |

2. SPRINT BACKLOG (vélocité = 20 points)

  - [US-01] Créer un compte (5 points)
  - [US-02] Se connecter (3 points)
  - [US-03] Écrire un article (5 points)
  - [US-04] Liste des articles (3 points)
  - [US-05] Lire un article (2 points)
  Total : 18 points (marge de 2 points pour les imprévus, premier
  sprint = on ne se surcharge pas)

3. TABLEAU KANBAN

  | À faire   | En cours (max 3) | En revue (max 2) | Terminé |
  | --------- | ---------------- | ---------------- | ------- |
  | [US-03]   | [US-01]          |                  |         |
  | [US-04]   | [US-02]          |                  |         |
  | [US-05]   |                  |                  |         |

  Limites WIP :
  - En cours : 3 (un par développeur)
  - En revue : 2 (le PO et un développeur révisent en parallèle)
```

---

## Navigation

← Fiche précédente : **[01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)**

→ Fiche suivante : **[03 - Outils de gestion de projet](03-outils-projet.md)**
