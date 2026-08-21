---
tags:
  - Projet
  - Intermédiaire
  - Pratique
description: "Qualité et documentation technique : revue de code, définition of done, documentation technique, ADR (Architecture Decision Records)."
estimated_time: "70 min"
fiche_number: 5
total_fiches: 6
cursus: "Gestion de projet"
id: "transversal.project-management.qualite-documentation"
course_id: "transversal.project-management"
content_type: "lesson"
order: 5
---

# 05 - Qualité et documentation technique

> **En bref** : Mettre en place les pratiques de qualité logicielle (revue de code, définition of done) et de documentation technique (documentation de projet, ADR). Lecture estimée : 70 min.

## Prérequis

- [01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)
- [02 - Méthodes agiles](02-methodes-agiles.md)
- [03 - Outils de gestion de projet](03-outils-projet.md)
- [04 - Rédiger un cahier des charges](04-cahier-des-charges.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser une revue de code efficace, rédiger une définition of done claire, structurer une documentation technique de projet et créer des ADR (Architecture Decision Records) pour tracer les décisions techniques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la revue de code ?

**Définition** : La revue de code (code review) est le processus par lequel un ou plusieurs développeurs relisent le code écrit par un collègue avant de l'intégrer dans la branche principale du projet.

**Le problème que la revue de code résout** :

Sans revue de code, voici les problèmes rencontrés :

1. **Bugs non détectés** : un développeur seul ne voit pas ses propres erreurs. Des bugs passent en production sans que personne ne les remarque.
2. **Code incohérent** : chaque développeur utilise ses propres conventions (nommage, structure, patterns), ce qui rend le code difficile à maintenir.
3. **Connaissances cloisonnées** : un seul développeur comprend le code qu'il a écrit. S'il quitte l'équipe, personne ne peut reprendre son travail.

**Comment la revue de code résout ces problèmes** :

| Problème | Solution apportée par la revue de code |
| --- | --- |
| Bugs non détectés | Un regard extérieur détecte les erreurs que l'auteur ne voit plus |
| Code incohérent | Le relecteur vérifie le respect des conventions de l'équipe |
| Connaissances cloisonnées | Le relecteur apprend le code en le lisant, le savoir est partagé |

**Analogie concrète** : La revue de code, c'est comme la relecture d'un mémoire universitaire par un camarade. Quand tu rédiges un texte, tu ne remarques plus tes fautes d'orthographe ni tes phrases confuses. Un relecteur extérieur les repère immédiatement. En plus, il apprend le sujet en te relisant, et il peut suggérer des formulations plus claires.

**Ce que la revue de code n'est PAS** :

- La revue de code n'est pas un jugement personnel. On commente le code, pas la personne. "Cette variable devrait être renommée" est acceptable. "Tu ne sais pas nommer tes variables" ne l'est pas.
- La revue de code n'est pas un test. Elle ne remplace pas les tests unitaires ni les tests d'intégration. Elle les complète.
- La revue de code n'est pas une formalité à expédier. Approuver sans lire est pire que ne pas faire de revue du tout.

---

### Qu'est-ce que la définition of done ?

**Définition** : La définition of done (DoD) est une liste de critères que chaque tâche (user story, bug fix, fonctionnalité) doit remplir pour être considérée comme terminée. Elle est partagée par toute l'équipe.

**Le problème que la définition of done résout** :

Sans définition of done, voici les problèmes rencontrés :

1. **"Terminé" est subjectif** : pour un développeur, "terminé" signifie "le code compile". Pour un autre, "terminé" signifie "testé et documenté". Chacun a sa propre interprétation.
2. **Dette technique cachée** : les tâches sont marquées comme terminées sans tests, sans documentation, sans vérification de performance. La dette s'accumule.
3. **Livraisons instables** : on livre des fonctionnalités "presque terminées" qui cassent en production parce que les vérifications finales n'ont pas été faites.

**Comment la définition of done résout ces problèmes** :

| Problème | Solution apportée par la définition of done |
| --- | --- |
| "Terminé" est subjectif | Liste objective et partagée de critères vérifiables |
| Dette technique cachée | Chaque critère oblige à vérifier tests, documentation, qualité |
| Livraisons instables | Rien n'est livré tant que tous les critères ne sont pas remplis |

**Analogie concrète** : La définition of done, c'est comme la checklist de contrôle avant le décollage d'un avion. Le pilote ne décolle pas parce qu'il "a l'impression que tout va bien". Il vérifie chaque point de la liste : volets, carburant, instruments, communication avec la tour. Si un seul point n'est pas validé, l'avion ne décolle pas.

**Ce que la définition of done n'est PAS** :

- La définition of done n'est pas figée pour toujours. L'équipe peut la faire évoluer à chaque rétrospective.
- La définition of done n'est pas les critères d'acceptation d'une user story. Les critères d'acceptation sont spécifiques à une fonctionnalité ("le bouton affiche un message de confirmation"). La DoD est transversale à toutes les tâches ("le code est testé et documenté").

**Comparaison définition of done vs critères d'acceptation** :

| Définition of done | Critères d'acceptation |
| --- | --- |
| S'applique à toutes les tâches | Spécifiques à une user story |
| Définie une seule fois par l'équipe | Rédigés pour chaque story |
| Concerne la qualité technique | Concerne le comportement fonctionnel |
| Exemple : "les tests passent" | Exemple : "le formulaire affiche un message de succès" |

---

### Qu'est-ce que la documentation technique ?

**Définition** : La documentation technique est l'ensemble des documents qui décrivent comment un logiciel est construit, comment il fonctionne et comment le maintenir. Elle s'adresse aux développeurs (actuels et futurs) et aux équipes d'exploitation.

**Le problème que la documentation technique résout** :

Sans documentation technique, voici les problèmes rencontrés :

1. **Onboarding lent** : un nouveau développeur met des semaines à comprendre le projet parce que personne n'a documenté l'architecture ni les conventions.
2. **Décisions oubliées** : "Pourquoi a-t-on choisi PostgreSQL plutôt que MySQL ?" Personne ne s'en souvient.
3. **Maintenance risquée** : corriger un bug dans un module sans comprendre ses interactions avec les autres modules provoque des régressions.

**Comment la documentation technique résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Onboarding lent | Guide d'installation, architecture documentée, conventions écrites |
| Décisions oubliées | ADR qui tracent chaque décision avec son contexte et ses raisons |
| Maintenance risquée | Schéma d'architecture qui montre les dépendances entre modules |

**Analogie concrète** : La documentation technique, c'est comme le carnet d'entretien d'une voiture. Quand tu achètes une voiture d'occasion, le carnet d'entretien te dit quand la courroie de distribution a été changée, quel type d'huile utiliser et quels travaux ont déjà été faits. Sans ce carnet, tu risques de changer une pièce déjà neuve ou d'oublier un entretien critique.

**Ce que la documentation technique n'est PAS** :

- La documentation technique n'est pas un roman. Elle doit être concise, structurée et facile à naviguer. Un développeur cherche une information précise, pas une histoire.
- La documentation technique n'est pas le code. Le code explique le "comment". La documentation explique le "pourquoi" et le "quand".
- La documentation technique n'est pas un effort unique. Elle doit être maintenue à jour à chaque changement significatif.

---

### Qu'est-ce qu'un ADR (Architecture Decision Record) ?

**Définition** : Un ADR est un document court (une page maximum) qui enregistre une décision d'architecture ou technique importante, avec son contexte, les options envisagées et les raisons du choix.

**Le problème que les ADR résolvent** :

Sans ADR, voici les problèmes rencontrés :

1. **Décisions orales perdues** : "On avait décidé en réunion de ne pas utiliser Redis. Pourquoi déjà ?" Trois mois plus tard, personne ne s'en souvient.
2. **Rediscussions sans fin** : la même décision est remise en question tous les mois parce que les raisons du choix initial ne sont pas documentées.
3. **Nouvelles recrues désorientées** : un nouveau développeur ne comprend pas pourquoi le projet utilise telle technologie plutôt qu'une autre, plus populaire.

**Comment les ADR résolvent ces problèmes** :

| Problème | Solution apportée par les ADR |
| --- | --- |
| Décisions orales perdues | Document écrit, versionné avec le code |
| Rediscussions sans fin | Le contexte et les raisons sont consultables à tout moment |
| Nouvelles recrues désorientées | L'historique des décisions est lisible comme un journal |

**Analogie concrète** : Un ADR, c'est comme le procès-verbal d'une assemblée générale de copropriété. Quand les copropriétaires décident de refaire la toiture en ardoise plutôt qu'en tuile, le procès-verbal note la décision, les arguments pour et contre, et le vote. Deux ans plus tard, si quelqu'un demande "Pourquoi de l'ardoise ?", on relit le procès-verbal au lieu de réorganiser un débat.

**Ce qu'un ADR n'est PAS** :

- Un ADR n'est pas un document de conception détaillé. C'est une page maximum qui se concentre sur une seule décision.
- Un ADR n'est pas immuable. Si la décision change, on crée un nouvel ADR qui fait référence à l'ancien et explique pourquoi la décision a évolué.

---

## Étapes Pratiques

### Étape 1 : Organiser une revue de code

Voici les règles d'une revue de code efficace :

```text
CHECKLIST DE REVUE DE CODE

AVANT DE SOUMETTRE (auteur) :
- [ ] Le code compile et tous les tests passent
- [ ] Les messages de commit sont clairs et descriptifs
- [ ] La pull request est de taille raisonnable (< 400 lignes modifiées)
- [ ] La description de la PR explique le "quoi" et le "pourquoi"

PENDANT LA REVUE (relecteur) :
- [ ] Le code est lisible et compréhensible sans explication orale
- [ ] Les noms de variables et fonctions sont explicites
- [ ] Les cas d'erreur sont gérés (try/catch, validation, null checks)
- [ ] Il n'y a pas de duplication de code
- [ ] Les tests couvrent les cas nominaux et les cas limites
- [ ] Le code respecte les conventions de l'équipe (linter, formatage)
- [ ] Pas de données sensibles en dur (mots de passe, clés API)

FORMULATION DES COMMENTAIRES :
- Utiliser "suggestion" et non "tu dois" :
  "Et si on renommait cette variable en 'userCount' pour plus de clarté ?"
- Distinguer bloquant / non bloquant :
  "[bloquant] Cette requête SQL est vulnérable à l'injection"
  "[suggestion] On pourrait extraire cette logique dans une méthode dédiée"
```

---

### Étape 2 : Rédiger une définition of done

Voici un exemple de définition of done pour une équipe de développement web :

```text
DEFINITION OF DONE - Équipe WebApp

Une user story est "Done" quand TOUS les critères suivants sont remplis :

CODE :
- [ ] Le code est écrit et compile sans erreur
- [ ] Le code respecte les conventions du projet (linter vert)
- [ ] Le code a été revu par au moins un autre développeur
- [ ] Les commentaires de la revue bloquants sont résolus

TESTS :
- [ ] Les tests unitaires sont écrits et passent (couverture >= 80%)
- [ ] Les tests d'intégration sont écrits pour les cas critiques
- [ ] Les tests sont exécutés dans la CI (pipeline vert)

DOCUMENTATION :
- [ ] La documentation technique est mise à jour si nécessaire
- [ ] Un ADR est créé si une décision d'architecture a été prise
- [ ] Le README est mis à jour si l'installation change

DÉPLOIEMENT :
- [ ] La fonctionnalité est déployée sur l'environnement de staging
- [ ] La fonctionnalité a été testée manuellement sur staging
- [ ] Pas de régression détectée sur les fonctionnalités existantes

PRODUIT :
- [ ] La fonctionnalité correspond aux critères d'acceptation de la story
- [ ] Le Product Owner a validé la fonctionnalité sur staging
```

---

### Étape 3 : Structurer une documentation technique

Voici la structure type d'une documentation technique de projet :

```text
STRUCTURE DE LA DOCUMENTATION TECHNIQUE

docs/
  README.md                   <- Point d'entrée, vue d'ensemble du projet
  GETTING_STARTED.md          <- Installation et premier lancement
  ARCHITECTURE.md             <- Schéma d'architecture, composants, flux
  CONTRIBUTING.md             <- Conventions de code, process de contribution
  DEPLOYMENT.md               <- Procédure de déploiement (staging, production)
  adr/                        <- Architecture Decision Records
    001-choix-base-de-donnees.md
    002-strategie-authentification.md
    003-choix-framework-front.md
  api/                        <- Documentation des endpoints API
    users.md
    orders.md
```

Contenu minimum du README :

```text
README.md - CONTENU MINIMUM

1. NOM DU PROJET
   Une phrase qui décrit ce que fait le projet.

2. PRÉREQUIS
   Liste exacte des outils nécessaires avec leurs versions.
   Exemple : Docker 24+, Node.js 22+, PostgreSQL 16

3. INSTALLATION
   Commandes à exécuter, dans l'ordre, pour installer le projet.
   Chaque commande doit être copiable telle quelle.

4. UTILISATION
   Comment lancer le projet et accéder à l'application.

5. TESTS
   Comment exécuter les tests.

6. STRUCTURE DU PROJET
   Arborescence commentée des dossiers principaux.

7. CONTRIBUTION
   Lien vers CONTRIBUTING.md ou résumé des conventions.
```

---

### Étape 4 : Créer un ADR

Voici le template standard d'un ADR (format Michael Nygard) :

```text
# ADR-001 : Choix de PostgreSQL comme base de données

## Statut

Accepté (2025-03-15)

## Contexte

Nous développons une application de gestion de rendez-vous médicaux.
L'application doit :
- Stocker des données relationnelles (patients, médecins, créneaux)
- Gérer des requêtes complexes (recherche par spécialité + localisation +
  disponibilité)
- Respecter les contraintes RGPD (chiffrement des données de santé)
- Supporter 10 000 utilisateurs actifs à terme

## Options envisagées

### Option 1 : MySQL 8
- Avantages : très répandu, grande communauté, performant en lecture
- Inconvénients : moins performant sur les requêtes complexes, pas de
  support natif du type JSON avancé

### Option 2 : PostgreSQL 16
- Avantages : requêtes complexes performantes, types avancés (JSON,
  arrays), extensions (PostGIS pour la géolocalisation), chiffrement
  natif (pgcrypto)
- Inconvénients : légèrement plus complexe à configurer

### Option 3 : MongoDB 7
- Avantages : flexible (schéma libre), performant en écriture
- Inconvénients : pas adapté aux données relationnelles, jointures
  complexes à gérer manuellement

## Décision

Nous choisissons **PostgreSQL 16**.

## Justification

- Les données sont fortement relationnelles (patients <-> médecins <->
  créneaux) : PostgreSQL gère mieux les jointures que MongoDB
- La recherche par localisation nécessitera PostGIS à terme
- Le chiffrement natif avec pgcrypto simplifie la conformité RGPD
- L'équipe a déjà de l'expérience avec PostgreSQL sur d'autres projets

## Conséquences

- L'équipe doit configurer PostgreSQL 16 dans Docker
- La CI doit inclure un service PostgreSQL pour les tests
- Les migrations sont gérées par Doctrine (Symfony)
- Si les besoins de géolocalisation évoluent, PostGIS est déjà disponible
```

---

### Étape 5 : Mettre en place un flux de revue de code

Voici un flux type avec Git :

```text
FLUX DE REVUE DE CODE

1. Le développeur crée une branche depuis la branche principale :
   git checkout -b feature/ajout-recherche-medecin

2. Le développeur écrit son code et ses tests.

3. Le développeur pousse sa branche :
   git push origin feature/ajout-recherche-medecin

4. Le développeur crée une pull request (PR) avec :
   - Titre : "Ajout de la recherche de médecins par spécialité"
   - Description : ce que fait la PR, pourquoi, comment tester
   - Lien vers la user story concernée

5. La CI s'exécute automatiquement :
   - Linter
   - Tests unitaires
   - Tests d'intégration
   - Build

6. Un relecteur est assigné (automatiquement ou manuellement).

7. Le relecteur lit le code et laisse des commentaires :
   - [bloquant] : doit être corrigé avant la fusion
   - [suggestion] : amélioration optionnelle
   - [question] : demande de clarification

8. Le développeur corrige les commentaires bloquants et répond
   aux questions.

9. Le relecteur approuve la PR.

10. La PR est fusionnée dans la branche principale.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `mkdir -p docs/adr` | Créer le dossier pour les ADR |
| `git log --oneline --graph` | Voir l'historique des commits en format condensé |
| `git diff main..feature/ma-branche` | Voir les changements d'une branche par rapport à main |
| `git log --author="Nom" --since="1 week"` | Voir les commits d'un développeur sur la dernière semaine |

---

## Pièges Fréquents

### Piège 1 : Des revues de code trop tardives

**Problème** : Le développeur travaille une semaine entière sur une fonctionnalité complexe, puis soumet une pull request de 2 000 lignes. Le relecteur ne peut pas absorber autant de code d'un coup et approuve sans lire en détail.

**Solution** : Découpe les pull requests en morceaux de 200 à 400 lignes maximum. Une grosse fonctionnalité peut être découpée en plusieurs PR successives :

```text
PR 1 : Ajout du modèle Medecin et migration
PR 2 : Ajout du repository et des tests
PR 3 : Ajout du contrôleur de recherche
PR 4 : Ajout de la vue de résultats
```

---

### Piège 2 : Une définition of done trop longue

**Problème** : La DoD contient 30 critères. Personne ne la lit en entier, et elle est systématiquement ignorée parce qu'elle prend trop de temps à vérifier.

**Solution** : Limite la DoD à 10-15 critères essentiels. Si certains critères ne s'appliquent qu'à certains types de tâches, crée des variantes :

```text
DoD - Bug fix :
- [ ] Le bug est reproduit par un test
- [ ] Le fix est écrit et tous les tests passent
- [ ] Le code est revu par un pair
- [ ] Déployé sur staging et vérifié

DoD - Nouvelle fonctionnalité :
- [ ] Les critères d'acceptation sont vérifiés
- [ ] Tests unitaires et d'intégration écrits
- [ ] Documentation mise à jour
- [ ] Code revu par un pair
- [ ] Déployé sur staging et validé par le PO
```

---

### Piège 3 : De la documentation jamais maintenue

**Problème** : L'équipe rédige une documentation technique complète au démarrage du projet. Six mois plus tard, la documentation décrit une architecture qui n'existe plus. Personne ne la met à jour parce que ce n'est "la responsabilité de personne".

**Solution** : Intègre la mise à jour de la documentation dans la définition of done. Si le code change l'architecture, la documentation doit être mise à jour dans la même pull request :

```text
DoD - Critère documentation :
- [ ] Si le changement modifie l'architecture : ARCHITECTURE.md mis à jour
- [ ] Si le changement modifie l'installation : GETTING_STARTED.md mis à jour
- [ ] Si une décision d'architecture est prise : ADR créé
```

---

### Piège 4 : Des ADR sans contexte

**Problème** : Un ADR qui dit "On utilise PostgreSQL" sans expliquer pourquoi est inutile. Six mois plus tard, personne ne sait si ce choix est toujours pertinent.

**Solution** : Chaque ADR doit contenir au minimum :

- Le contexte (quel problème on résout)
- Les options envisagées (au moins 2)
- La décision et sa justification
- Les conséquences (ce que cette décision implique)

---

## Checklist de Validation

- Je sais organiser une revue de code avec des commentaires constructifs
- Je sais distinguer commentaires bloquants et suggestions
- Je sais rédiger une définition of done adaptée à mon équipe
- Je sais faire la différence entre définition of done et critères d'acceptation
- Je sais structurer une documentation technique de projet
- Je sais créer un ADR avec contexte, options, décision et conséquences

---

## Exercice Pratique

**Énoncé** : Tu rejoins une équipe qui développe une application de gestion de bibliothèque (le projet MyBooks de la fiche précédente). L'équipe n'a aucune pratique de qualité en place : pas de revue de code, pas de DoD, pas de documentation technique, pas d'ADR.

Ta mission :

1. Rédiger une définition of done adaptée au projet MyBooks (8 à 12 critères)
2. Créer un ADR pour justifier le choix de React comme framework front-end (au lieu de Vue.js ou Angular)
3. Rédiger une checklist de revue de code spécifique au projet (10 points de vérification)
4. Décrire la structure du dossier `docs/` du projet avec le contenu minimum de chaque fichier

**Indications** :

- Le projet utilise Symfony 7.4 (back-end API REST) et React 19 (front-end SPA)
- L'équipe est composée de 3 développeurs juniors et 1 lead technique
- Le projet est en phase de démarrage (sprint 1)
- Le déploiement se fait via Docker et GitLab CI

**Résultat attendu** : Quatre documents distincts, chacun prêt à être utilisé par l'équipe.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Définition of done - Projet MyBooks

```text
DEFINITION OF DONE - MyBooks

Une tâche est "Done" quand TOUS ces critères sont remplis :

CODE :
- [ ] Le code compile sans erreur ni warning
- [ ] Le linter passe (ESLint pour React, PHP-CS-Fixer pour Symfony)
- [ ] Le code a été revu et approuvé par au moins un autre développeur

TESTS :
- [ ] Les tests unitaires sont écrits (couverture >= 80% du nouveau code)
- [ ] La pipeline CI est verte (linter + tests + build)

DOCUMENTATION :
- [ ] Un ADR est créé si une décision technique a été prise
- [ ] Le README est mis à jour si les commandes d'installation changent

VALIDATION :
- [ ] La fonctionnalité est déployée sur staging
- [ ] Les critères d'acceptation de la user story sont vérifiés
- [ ] Le Product Owner a validé sur staging
```

### 2. ADR - Choix de React

```text
# ADR-001 : Choix de React comme framework front-end

## Statut

Accepté (2025-04-01)

## Contexte

Le projet MyBooks nécessite un front-end interactif (SPA) qui communique
avec l'API REST Symfony. L'équipe est composée de 3 développeurs juniors
et 1 lead technique. Le projet doit être maintenable sur le long terme.

## Options envisagées

### Option 1 : React 19
- Avantages : écosystème très large, nombreux tutoriels et ressources,
  communauté active, marché de l'emploi favorable
- Inconvénients : nécessite des bibliothèques complémentaires (routing,
  state management)

### Option 2 : Vue.js 3
- Avantages : courbe d'apprentissage douce, solution complète (Vuex,
  Vue Router intégrés), bonne documentation
- Inconvénients : écosystème plus petit, moins de ressources pour les
  juniors, marché de l'emploi plus restreint

### Option 3 : Angular 22
- Avantages : framework complet (routing, formulaires, HTTP), TypeScript
  natif, conventions strictes
- Inconvénients : courbe d'apprentissage très raide pour des juniors,
  complexité élevée pour un projet de cette taille

## Décision

Nous choisissons **React 19** avec TypeScript.

## Justification

- L'équipe de 3 juniors trouvera davantage de ressources d'apprentissage
  (tutoriels, Stack Overflow, cours en ligne) avec React
- La flexibilité de React permet de commencer simple et d'ajouter des
  bibliothèques au besoin (React Router, Zustand)
- Le lead technique a de l'expérience avec React sur un projet précédent
- Angular est trop complexe pour le niveau de l'équipe actuelle

## Conséquences

- Installer React 19 avec Vite comme bundler
- Ajouter React Router pour la navigation
- Définir les conventions de nommage des composants dès le sprint 1
- Prévoir une formation TypeScript de 2 jours pour les juniors
```

### 3. Checklist de revue de code - Projet MyBooks

```text
CHECKLIST DE REVUE DE CODE - MyBooks

BACK-END (Symfony) :
- [ ] Les entités Doctrine ont des validations (@Assert)
- [ ] Les contrôleurs sont légers (logique métier dans les services)
- [ ] Les requêtes SQL sont paramétrées (pas de concaténation)
- [ ] Les endpoints retournent les bons codes HTTP (201 Created, 404 Not
      Found, etc.)

FRONT-END (React) :
- [ ] Les composants sont découpés (un composant = une responsabilité)
- [ ] Les appels API sont centralisés (pas de fetch dans les composants)
- [ ] Les états sont gérés au bon niveau (local vs global)

TRANSVERSAL :
- [ ] Le code ne contient pas de données sensibles en dur
- [ ] Les noms de variables et fonctions sont explicites
- [ ] Les cas d'erreur sont gérés (try/catch, messages utilisateur)
```

### 4. Structure de la documentation

```text
mybooks/
  docs/
    README.md
      -> Description du projet (1 phrase)
      -> Prérequis : Docker 24+, Node.js 22+, PHP 8.3
      -> Installation : 4 commandes (git clone, docker compose up,
         npm install, npm run dev)
      -> Accès : http://localhost:3000 (front), http://localhost:8000 (API)

    GETTING_STARTED.md
      -> Guide pas à pas d'installation (chaque commande détaillée)
      -> Variables d'environnement à configurer
      -> Vérification que tout fonctionne (URLs, commandes de test)

    ARCHITECTURE.md
      -> Schéma d'architecture (front SPA <-> API REST <-> PostgreSQL)
      -> Description de chaque composant
      -> Flux de données (requête utilisateur -> React -> API -> BDD)

    CONTRIBUTING.md
      -> Conventions de code (ESLint, PHP-CS-Fixer)
      -> Processus de contribution (branche, PR, revue, fusion)
      -> Nommage des branches (feature/, bugfix/, hotfix/)
      -> Nommage des commits (type: description)

    DEPLOYMENT.md
      -> Environnements (local, staging, production)
      -> Procédure de déploiement (GitLab CI pipeline)
      -> Rollback en cas de problème

    adr/
      001-choix-base-de-donnees.md   -> PostgreSQL (voir fiche 04)
      002-choix-framework-front.md   -> React 19 (voir ci-dessus)
```

---

## Navigation

← Fiche précédente : **[04 - Rédiger un cahier des charges](04-cahier-des-charges.md)**

→ Fiche suivante : **[06 - Projet intégrateur](06-projet-integrateur.md)**
