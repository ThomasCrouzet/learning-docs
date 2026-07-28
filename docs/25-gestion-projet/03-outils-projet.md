---
tags:
  - Projet
  - Intermédiaire
  - Pratique
description: "Outils de gestion de projet : backlog, user stories, estimation (planning poker, story points), velocity."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 6
cursus: "Gestion de projet"
---

# 03 - Outils de gestion de projet

> **En bref** : Maîtriser les outils concrets de la gestion de projet agile : rédiger des user stories, estimer avec le planning poker et les story points, et suivre la vélocité de l'équipe. Lecture estimée : 60 min.

## Prérequis

- [01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)
- [02 - Méthodes agiles](02-methodes-agiles.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras rédiger une user story complète avec ses critères d'acceptation, estimer la complexité d'une tâche en story points, et utiliser la vélocité pour planifier un sprint.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une user story ?

**Définition** : Une user story est une description courte d'une fonctionnalité, rédigée du point de vue de l'utilisateur, qui exprime un besoin concret et la valeur attendue.

**Le problème que les user stories résolvent** :

Sans user stories, voici les problèmes rencontrés :

1. **Spécifications ambiguës** : "Le système doit gérer les utilisateurs" ne dit rien sur ce qu'il faut faire concrètement.
2. **Focus sur la technique** : on décrit la solution technique au lieu du besoin utilisateur.
3. **Validation impossible** : comment savoir si la fonctionnalité est terminée sans critères précis ?

**Comment les user stories résolvent ces problèmes** :

| Problème | Solution apportée par les user stories |
| --- | --- |
| Spécifications ambiguës | Format structuré qui force la clarté |
| Focus sur la technique | Point de vue de l'utilisateur, pas du développeur |
| Validation impossible | Critères d'acceptation vérifiables |

**Le format standard** :

```text
En tant que [rôle],
je veux [action],
pour [bénéfice / valeur métier].
```

**Exemple** :

```text
En tant que client du site e-commerce,
je veux filtrer les produits par prix croissant,
pour trouver rapidement les produits dans mon budget.
```

**Analogie concrète** : Une user story, c'est comme une commande au restaurant. Tu ne dis pas au cuisinier "mets du beurre dans la poêle, coupe les oignons, fais revenir 5 minutes". Tu dis "je veux un steak frites saignant". Le cuisinier sait comment le préparer, et toi tu sais ce que tu attends dans ton assiette.

**Ce qu'une user story n'est PAS** :

- Une user story n'est pas une spécification technique. "Créer un endpoint POST /api/users" est une tâche technique, pas une user story.
- Une user story n'est pas un bug report. "Le bouton ne fonctionne pas" est un bug, pas une fonctionnalité souhaitée.
- Une user story n'est pas une épopée. Si elle prend plus d'un sprint, c'est une epic qu'il faut découper en user stories plus petites.

---

### Qu'est-ce qu'un critère d'acceptation ?

**Définition** : Un critère d'acceptation est une condition vérifiable qui définit quand une user story est considérée comme terminée. C'est le contrat entre le Product Owner et l'équipe de développement.

**Le problème que les critères d'acceptation résolvent** :

Sans critères d'acceptation, voici les problèmes rencontrés :

1. **"C'est terminé ?" / "Pas encore"** : pas de définition claire de ce que "terminé" veut dire.
2. **Interprétations divergentes** : le développeur et le PO n'ont pas la même vision du résultat.
3. **Tests impossibles** : le testeur ne sait pas quoi vérifier.

**Comment les critères d'acceptation résolvent ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Pas de définition de "terminé" | Liste vérifiable de conditions |
| Interprétations divergentes | Accord écrit entre PO et équipe |
| Tests impossibles | Chaque critère = un test à écrire |

**Le format Given/When/Then** :

```text
ÉTANT DONNÉ [contexte / état initial]
QUAND [action de l'utilisateur]
ALORS [résultat attendu]
```

**Exemple complet d'une user story avec critères** :

```text
User Story :
En tant que client du site e-commerce,
je veux filtrer les produits par prix croissant,
pour trouver rapidement les produits dans mon budget.

Critères d'acceptation :

1. ÉTANT DONNÉ une liste de 20 produits affichés
   QUAND je sélectionne "Prix croissant" dans le menu de tri
   ALORS les produits sont réordonnés du moins cher au plus cher

2. ÉTANT DONNÉ un tri "Prix croissant" actif
   QUAND je change de catégorie
   ALORS le tri reste actif sur la nouvelle catégorie

3. ÉTANT DONNÉ un tri "Prix croissant" actif
   QUAND je sélectionne "Par défaut" dans le menu de tri
   ALORS les produits reviennent à l'ordre par défaut
```

**Analogie concrète** : Les critères d'acceptation, c'est comme la fiche de contrôle technique d'une voiture. Le garagiste ne se demande pas "est-ce que la voiture est bonne ?". Il a une liste précise de points à vérifier : freins, phares, pneus, échappement. Chaque point est soit conforme, soit non conforme.

---

### Qu'est-ce que le planning poker ?

**Définition** : Le planning poker est une technique d'estimation collaborative où chaque membre de l'équipe donne son estimation de la complexité d'une user story en utilisant des cartes numérotées, puis l'équipe discute des écarts.

**Le problème que le planning poker résout** :

Sans estimation collaborative, voici les problèmes rencontrés :

1. **Effet d'ancrage** : le premier à parler influence tous les autres. Si le senior dit "c'est 2 points", personne n'ose dire 8.
2. **Estimation par un seul expert** : une seule personne estime, les autres ne donnent pas leur avis.
3. **Estimations trop optimistes** : sans discussion, on sous-estime systématiquement la complexité.

**Comment le planning poker résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Effet d'ancrage | Tout le monde révèle son estimation en même temps |
| Estimation par un seul expert | Chaque membre de l'équipe vote |
| Estimations trop optimistes | La discussion après le vote révèle les risques cachés |

**La suite de Fibonacci** :

Les cartes du planning poker utilisent la suite de Fibonacci : 1, 2, 3, 5, 8, 13, 21.

Pourquoi Fibonacci et pas 1, 2, 3, 4, 5 ? Parce que plus une tâche est grosse, plus l'incertitude est grande. La différence entre 2 et 3 est significative. La différence entre 20 et 21 est négligeable. Fibonacci reflète cette incertitude croissante.

**Analogie concrète** : Le planning poker, c'est comme un jury dans un concours de cuisine. Chaque juré note le plat séparément, puis ils comparent. Si un juré met 9/10 et un autre met 3/10, ils discutent pour comprendre l'écart. C'est la discussion qui est précieuse, pas la note finale.

---

### Qu'est-ce qu'un story point ?

**Définition** : Un story point est une unité de mesure relative de la complexité d'une user story. Ce n'est pas une mesure de temps (heures ou jours), mais une mesure d'effort qui combine complexité technique, volume de travail et incertitude.

**Le problème que les story points résolvent** :

Sans story points, voici les problèmes rencontrés :

1. **Estimation en heures peu fiable** : "ça prendra 4 heures" se transforme souvent en 12 heures.
2. **Comparaison difficile** : une tâche de 8 heures pour un junior est une tâche de 2 heures pour un senior.
3. **Pression sur les estimations** : si on estime en heures, le manager demande pourquoi 8 heures et pas 4.

**Comment les story points résolvent ces problèmes** :

| Problème | Solution apportée par les story points |
| --- | --- |
| Estimation en heures peu fiable | Estimation relative, pas absolue |
| Comparaison difficile | Un point de référence commun à toute l'équipe |
| Pression sur les estimations | On estime la complexité, pas la durée |

**Comment les utiliser** :

1. L'équipe choisit une user story de référence et lui attribue une valeur (par exemple : "créer un formulaire de connexion = 3 points")
2. Pour chaque nouvelle user story, on compare avec la référence : "c'est plus complexe ou moins complexe que le formulaire de connexion ?"
3. Si c'est deux fois plus complexe, c'est 5 points. Si c'est beaucoup plus complexe, c'est 8 ou 13 points

**Analogie concrète** : Les story points, c'est comme la difficulté des pistes de ski. Une piste verte est facile, une rouge est difficile, une noire est très difficile. Le temps pour descendre dépend du skieur (débutant ou expert), mais la difficulté de la piste reste la même.

**Ce que les story points ne sont PAS** :

- Les story points ne sont pas des heures déguisées. "1 point = 1 heure" est une erreur courante qui annule tout l'intérêt du système.
- Les story points ne sont pas comparables entre équipes. L'équipe A estime peut-être 5 points pour quelque chose que l'équipe B estime à 8. C'est normal : chaque équipe a sa propre échelle.

---

### Qu'est-ce que la vélocité ?

**Définition** : La vélocité est le nombre total de story points que l'équipe termine lors d'un sprint. C'est une mesure empirique qui se stabilise au bout de 3 à 5 sprints.

**Le problème que la vélocité résout** :

Sans vélocité, voici les problèmes rencontrés :

1. **Planification au doigt mouillé** : on ne sait pas combien de travail prendre dans le prochain sprint.
2. **Prédictions impossibles** : on ne peut pas estimer la date de livraison d'une fonctionnalité.
3. **Surcharge récurrente** : on prend trop de travail et on ne termine jamais le sprint.

**Comment la vélocité résout ces problèmes** :

| Problème | Solution apportée par la vélocité |
| --- | --- |
| Planification au doigt mouillé | La vélocité passée prédit la capacité future |
| Prédictions impossibles | Points restants / vélocité = nombre de sprints |
| Surcharge récurrente | On ne prend pas plus que la vélocité passée |

**Exemple** :

```text
Sprint 1 : 18 points terminés
Sprint 2 : 22 points terminés
Sprint 3 : 20 points terminés

Vélocité moyenne : (18 + 22 + 20) / 3 = 20 points par sprint

Reste à faire dans le backlog : 80 points
Estimation : 80 / 20 = 4 sprints restants
Avec des sprints de 2 semaines : environ 8 semaines de travail
```

**Analogie concrète** : La vélocité, c'est comme le compteur kilométrique d'une voiture sur un long trajet. Tu sais que tu fais en moyenne 80 km/h sur ce type de route. Il te reste 240 km. Tu sais donc qu'il te faut environ 3 heures. Ce n'est pas une science exacte, mais c'est une estimation fiable basée sur l'expérience passée.

---

## Étapes Pratiques

### Étape 1 : Rédiger des user stories

Rédige 5 user stories pour une application de gestion de recettes de cuisine :

```text
US-001 : En tant que cuisinier amateur,
je veux créer une recette avec un titre, des ingrédients et des étapes,
pour sauvegarder mes recettes préférées.

US-002 : En tant que cuisinier amateur,
je veux rechercher une recette par ingrédient,
pour utiliser ce que j'ai dans mon réfrigérateur.

US-003 : En tant que cuisinier amateur,
je veux noter une recette de 1 à 5 étoiles,
pour retrouver facilement mes recettes préférées.

US-004 : En tant que cuisinier amateur,
je veux partager une recette avec un ami par email,
pour lui recommander un plat que j'ai aimé.

US-005 : En tant que cuisinier amateur,
je veux voir le temps de préparation et de cuisson d'une recette,
pour savoir si j'ai le temps de la préparer ce soir.
```

---

### Étape 2 : Ajouter des critères d'acceptation

Complète la user story US-001 avec ses critères d'acceptation :

```text
US-001 : En tant que cuisinier amateur,
je veux créer une recette avec un titre, des ingrédients et des étapes,
pour sauvegarder mes recettes préférées.

Critères d'acceptation :

1. ÉTANT DONNÉ que je suis connecté
   QUAND je clique sur "Nouvelle recette"
   ALORS un formulaire s'affiche avec les champs : titre (obligatoire),
   description (optionnel), ingrédients (au moins 1), étapes (au moins 1)

2. ÉTANT DONNÉ que j'ai rempli tous les champs obligatoires
   QUAND je clique sur "Enregistrer"
   ALORS la recette est sauvegardée et je suis redirigé vers la page
   de la recette

3. ÉTANT DONNÉ que le titre est vide
   QUAND je clique sur "Enregistrer"
   ALORS un message d'erreur s'affiche : "Le titre est obligatoire"
   ET la recette n'est pas sauvegardée

4. ÉTANT DONNÉ que j'ai rempli le formulaire
   QUAND je clique sur "Annuler"
   ALORS je suis redirigé vers la liste de mes recettes
   ET aucune recette n'est créée
```

---

### Étape 3 : Simuler un planning poker

Voici une user story à estimer. Chaque membre de l'équipe a choisi sa carte :

```text
User Story :
En tant qu'utilisateur, je veux recevoir un email de confirmation
après mon inscription pour vérifier mon adresse email.

Estimations :
- Alice : 5 points
- Bob : 8 points
- Charlie : 3 points

Discussion :
- Charlie (3) : "C'est juste l'envoi d'un email, on a déjà la
  librairie configurée."
- Bob (8) : "Il faut aussi générer un token unique, le stocker en
  base, créer la page de confirmation, gérer l'expiration du token
  et le cas où l'email n'arrive pas."
- Alice (5) : "Bob a raison sur la complexité, mais on a déjà fait
  un truc similaire pour la réinitialisation de mot de passe."

Deuxième tour :
- Alice : 5 points
- Bob : 5 points
- Charlie : 5 points

Résultat : 5 points (consensus)
```

---

### Étape 4 : Calculer la vélocité et planifier

Voici l'historique de vélocité d'une équipe sur 5 sprints :

```text
Sprint 1 : 15 points (premier sprint, l'équipe découvre le projet)
Sprint 2 : 20 points
Sprint 3 : 22 points
Sprint 4 : 18 points (un développeur absent 3 jours)
Sprint 5 : 21 points

Vélocité moyenne (sprints 2-5) : (20 + 22 + 18 + 21) / 4 = 20,25
On arrondit à 20 points par sprint.

Note : on exclut le sprint 1 car il n'est pas représentatif
(mise en place, apprentissage).

Backlog restant : 120 points
Sprints nécessaires : 120 / 20 = 6 sprints
Durée estimée : 6 x 2 semaines = 12 semaines (3 mois)
```

---

## Pièges Fréquents

### Piège 1 : Des user stories trop grosses

**Problème** : "En tant qu'utilisateur, je veux gérer mon profil" est trop vague et trop gros (on appelle ça une "epic"). Impossible de l'estimer et de la terminer en un sprint.

**Solution** : Découpe l'epic en user stories plus petites :

```text
- En tant qu'utilisateur, je veux modifier mon nom
- En tant qu'utilisateur, je veux changer ma photo de profil
- En tant qu'utilisateur, je veux modifier mon email
- En tant qu'utilisateur, je veux changer mon mot de passe
```

Chaque user story doit pouvoir être terminée en quelques jours.

---

### Piège 2 : Des user stories techniques

**Problème** : "En tant que développeur, je veux mettre en place Docker" n'est pas une user story. Elle ne délivre pas de valeur à l'utilisateur final.

**Solution** : Les tâches techniques (infrastructure, refactoring, dette technique) sont légitimes, mais elles doivent être formulées comme des "enablers" ou des tâches techniques dans le backlog, pas comme des user stories. On peut aussi les rattacher à une user story : "Pour livrer US-001, on a besoin de configurer Docker".

---

### Piège 3 : Estimer en heures déguisées

**Problème** : L'équipe dit "1 point = 1 jour" ou "1 point = 4 heures". On perd tout l'intérêt des story points.

**Solution** : Rappelle que les story points mesurent la complexité relative, pas la durée. La question n'est pas "combien de temps ?" mais "c'est combien de fois plus complexe que notre user story de référence ?".

---

## Checklist de Validation

- Je sais rédiger une user story au format "En tant que... je veux... pour..."
- Je sais écrire des critères d'acceptation au format Given/When/Then
- Je comprends le planning poker et pourquoi on utilise la suite de Fibonacci
- Je sais expliquer la différence entre story points et heures
- Je sais calculer la vélocité d'une équipe et m'en servir pour planifier

---

## Exercice Pratique

**Énoncé** : Tu es Product Owner d'une application de suivi de dépenses personnelles. Rédige un backlog complet pour le premier sprint :

1. Rédige 6 user stories ordonnées par priorité
2. Pour chaque user story, écris au moins 2 critères d'acceptation au format Given/When/Then
3. Estime chaque user story en story points (1, 2, 3, 5, 8 ou 13)
4. Sélectionne les user stories pour un sprint (vélocité = 18 points)

**Indications** :

- Commence par les fonctionnalités indispensables (inscription, ajout de dépense)
- Les critères d'acceptation doivent couvrir les cas nominaux et les cas d'erreur
- Une user story estimée à plus de 8 points est probablement trop grosse : découpe-la

**Résultat attendu** : Un document structuré avec le backlog, les critères, les estimations et le sprint backlog.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
BACKLOG PRODUIT - Application de suivi de dépenses

US-001 : En tant qu'utilisateur, je veux créer un compte avec email
et mot de passe pour accéder à l'application. (5 points)

  Critères :
  1. ÉTANT DONNÉ un email valide et un mot de passe de 8 caractères
     minimum
     QUAND je soumets le formulaire d'inscription
     ALORS mon compte est créé et je suis redirigé vers le tableau
     de bord

  2. ÉTANT DONNÉ un email déjà utilisé
     QUAND je soumets le formulaire d'inscription
     ALORS un message d'erreur s'affiche : "Cet email est déjà
     utilisé"

  3. ÉTANT DONNÉ un mot de passe de moins de 8 caractères
     QUAND je soumets le formulaire
     ALORS un message d'erreur s'affiche : "Le mot de passe doit
     contenir au moins 8 caractères"

US-002 : En tant qu'utilisateur, je veux me connecter avec mon email
et mot de passe pour retrouver mes données. (3 points)

  Critères :
  1. ÉTANT DONNÉ des identifiants valides
     QUAND je me connecte
     ALORS je suis redirigé vers le tableau de bord

  2. ÉTANT DONNÉ un mot de passe incorrect
     QUAND je me connecte
     ALORS un message d'erreur s'affiche : "Email ou mot de passe
     incorrect"

US-003 : En tant qu'utilisateur, je veux ajouter une dépense avec
montant, catégorie et date pour suivre mes achats. (5 points)

  Critères :
  1. ÉTANT DONNÉ que je suis connecté
     QUAND je remplis le formulaire de dépense (montant, catégorie,
     date) et que je valide
     ALORS la dépense est enregistrée et apparaît dans ma liste

  2. ÉTANT DONNÉ un montant négatif ou nul
     QUAND je valide le formulaire
     ALORS un message d'erreur s'affiche : "Le montant doit être
     supérieur à zéro"

US-004 : En tant qu'utilisateur, je veux voir la liste de mes
dépenses du mois en cours pour connaître mes achats récents.
(3 points)

  Critères :
  1. ÉTANT DONNÉ que j'ai 5 dépenses ce mois-ci
     QUAND j'ouvre le tableau de bord
     ALORS les 5 dépenses s'affichent avec montant, catégorie et date

  2. ÉTANT DONNÉ que je n'ai aucune dépense ce mois-ci
     QUAND j'ouvre le tableau de bord
     ALORS un message s'affiche : "Aucune dépense ce mois-ci"

US-005 : En tant qu'utilisateur, je veux voir le total de mes
dépenses du mois pour connaître mon budget restant. (2 points)

  Critères :
  1. ÉTANT DONNÉ 3 dépenses de 10, 20 et 30 euros
     QUAND j'ouvre le tableau de bord
     ALORS le total affiché est "60,00 euros"

  2. ÉTANT DONNÉ aucune dépense
     QUAND j'ouvre le tableau de bord
     ALORS le total affiché est "0,00 euros"

US-006 : En tant qu'utilisateur, je veux supprimer une dépense
saisie par erreur. (2 points)

  Critères :
  1. ÉTANT DONNÉ une dépense existante
     QUAND je clique sur "Supprimer" et que je confirme
     ALORS la dépense est supprimée et le total est recalculé

  2. ÉTANT DONNÉ une dépense existante
     QUAND je clique sur "Supprimer" et que j'annule
     ALORS la dépense n'est pas supprimée

SPRINT BACKLOG (vélocité = 18 points) :

  - US-001 : Créer un compte (5 points)
  - US-002 : Se connecter (3 points)
  - US-003 : Ajouter une dépense (5 points)
  - US-004 : Liste des dépenses (3 points)
  - US-005 : Total du mois (2 points)
  Total : 18 points ✓

  US-006 (2 points) est reportée au sprint 2.
```

---

## Navigation

← Fiche précédente : **[02 - Méthodes agiles](02-methodes-agiles.md)**

→ Fiche suivante : **[04 - Rédiger un cahier des charges](04-cahier-des-charges.md)**
