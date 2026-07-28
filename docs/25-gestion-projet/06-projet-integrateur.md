---
tags:
  - Projet
  - Avancé
  - Pratique
description: "Projet intégrateur : simuler un sprint complet - backlog, estimation, développement, revue, rétrospective."
estimated_time: "90 min"
fiche_number: 6
total_fiches: 6
cursus: "Gestion de projet"
---

# 06 - Projet intégrateur

> **En bref** : Mettre en pratique toutes les compétences du cursus en simulant un sprint complet de A à Z - du backlog à la rétrospective. Lecture estimée : 90 min.

## Prérequis

- [01 - Introduction à la gestion de projet IT](01-introduction-gestion-projet.md)
- [02 - Méthodes agiles](02-methodes-agiles.md)
- [03 - Outils de gestion de projet](03-outils-projet.md)
- [04 - Rédiger un cahier des charges](04-cahier-des-charges.md)
- [05 - Qualité et documentation technique](05-qualite-documentation.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras dérouler un sprint complet en autonomie : constituer un backlog, estimer les tâches, planifier un sprint, simuler le développement avec suivi quotidien, conduire une revue de sprint et animer une rétrospective.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un sprint complet ?

**Définition** : Un sprint complet est un cycle de développement agile (généralement 1 à 4 semaines) qui commence par une planification, passe par le développement quotidien, et se termine par une revue du produit et une rétrospective de l'équipe.

**Le problème qu'un sprint complet résout** :

Sans sprint structuré, voici les problèmes rencontrés :

1. **Travail sans direction** : les développeurs codent ce qui leur semble prioritaire, sans coordination.
2. **Pas de rythme** : le projet avance par à-coups, avec des semaines productives et des semaines perdues.
3. **Pas d'amélioration** : l'équipe répète les mêmes erreurs parce qu'elle ne prend jamais le temps d'analyser ce qui fonctionne et ce qui ne fonctionne pas.

**Comment le sprint complet résout ces problèmes** :

| Problème | Solution apportée par le sprint |
| --- | --- |
| Travail sans direction | Le sprint planning définit les tâches et les priorités |
| Pas de rythme | Le sprint impose un cadre temporel régulier |
| Pas d'amélioration | La rétrospective identifie les problèmes et les actions correctives |

**Analogie concrète** : Un sprint, c'est comme une semaine de préparation d'un repas de fête. Le lundi, tu planifies le menu et fais la liste des courses (planning). Du mardi au jeudi, tu prépares les plats un par un (développement), avec un point chaque soir pour vérifier l'avancement. Le vendredi, tu fais goûter les plats aux invités (revue). Le samedi, tu notes ce qui a bien marché et ce qu'il faudra améliorer la prochaine fois (rétrospective).

**Ce qu'un sprint n'est PAS** :

- Un sprint n'est pas un marathon. On ne travaille pas plus vite ni plus longtemps. On travaille de manière organisée sur un périmètre défini.
- Un sprint n'est pas une prison. Si une urgence apparaît, l'équipe peut ajuster le périmètre avec le Product Owner. Mais ce doit rester exceptionnel.

---

### Qu'est-ce que le sprint planning ?

**Définition** : Le sprint planning est la réunion de début de sprint où l'équipe sélectionne les user stories du backlog à réaliser pendant le sprint, les découpe en tâches techniques et estime l'effort nécessaire.

**Le problème que le sprint planning résout** :

Sans sprint planning, voici les problèmes rencontrés :

1. **Surcharge de travail** : l'équipe s'engage sur trop de tâches et ne termine rien correctement.
2. **Tâches mal comprises** : les développeurs commencent à coder sans avoir compris les besoins, ce qui provoque des allers-retours.
3. **Pas de découpage** : une user story reste un bloc monolithique que personne ne sait par où attaquer.

**Comment le sprint planning résout ces problèmes** :

| Problème | Solution apportée par le sprint planning |
| --- | --- |
| Surcharge de travail | L'équipe utilise sa vélocité pour limiter le volume de travail |
| Tâches mal comprises | Chaque story est discutée et clarifiée avant d'être acceptée |
| Pas de découpage | Chaque story est découpée en tâches techniques concrètes |

**Analogie concrète** : Le sprint planning, c'est comme préparer un voyage en voiture. Avant de démarrer, tu choisis la destination (objectif du sprint), tu planifies les étapes (tâches), et tu vérifies que le réservoir est plein (capacité de l'équipe). Si tu essaies de faire Paris-Marseille avec un demi-réservoir, tu tombes en panne à mi-chemin.

---

### Qu'est-ce que le daily standup ?

**Définition** : Le daily standup (ou mêlée quotidienne) est une réunion de 15 minutes maximum, chaque jour à la même heure, où chaque membre de l'équipe répond à trois questions : qu'ai-je fait hier ? Que vais-je faire aujourd'hui ? Ai-je un blocage ?

**Le problème que le daily standup résout** :

Sans daily standup, voici les problèmes rencontrés :

1. **Blocages non détectés** : un développeur est bloqué depuis deux jours sur un problème que son collègue aurait résolu en 10 minutes.
2. **Travail en doublon** : deux développeurs travaillent sur la même tâche sans le savoir.
3. **Pas de visibilité** : personne ne sait où en est le sprint, si on est en avance ou en retard.

**Comment le daily standup résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Blocages non détectés | La question "Ai-je un blocage ?" force l'identification des problèmes |
| Travail en doublon | Chacun dit ce qu'il fait, les doublons sont visibles |
| Pas de visibilité | L'avancement quotidien est partagé avec toute l'équipe |

**Analogie concrète** : Le daily standup, c'est comme le briefing matinal d'une équipe de cuisine dans un restaurant. Avant le service, chaque cuisinier dit ce qu'il prépare aujourd'hui et s'il a besoin d'un ingrédient particulier. Si le poissonnier dit "Je n'ai pas reçu le saumon", le chef peut immédiatement changer le menu ou trouver une solution, plutôt que de le découvrir au moment du service.

**Ce que le daily standup n'est PAS** :

- Le daily standup n'est pas un rapport d'activité au chef. C'est un échange entre pairs, pas un contrôle hiérarchique.
- Le daily standup n'est pas une réunion de résolution de problèmes. Si un sujet nécessite une discussion de 20 minutes, on note le sujet et on programme une réunion dédiée après le standup.

---

### Qu'est-ce que la revue de sprint ?

**Définition** : La revue de sprint (sprint review) est la réunion de fin de sprint où l'équipe présente les fonctionnalités terminées au Product Owner et aux parties prenantes, en faisant une démonstration du produit fonctionnel.

**Le problème que la revue de sprint résout** :

Sans revue de sprint, voici les problèmes rencontrés :

1. **Produit déconnecté des besoins** : l'équipe développe pendant 3 sprints sans montrer le produit au client, qui découvre à la fin que ce n'est pas ce qu'il voulait.
2. **Fonctionnalités "presque terminées"** : sans démonstration, il est facile de dire "c'est fini à 90%" alors qu'il reste 50% du travail (le dernier 10% prend autant de temps que les premiers 90%).
3. **Pas de feedback** : sans retour des utilisateurs, l'équipe continue à développer dans une direction qui n'est peut-être pas la bonne.

**Comment la revue de sprint résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Produit déconnecté des besoins | Démonstration régulière au client |
| Fonctionnalités "presque terminées" | Seules les fonctionnalités "Done" (selon la DoD) sont présentées |
| Pas de feedback | Le client donne son avis immédiatement, l'équipe ajuste au sprint suivant |

**Analogie concrète** : La revue de sprint, c'est comme l'essayage intermédiaire chez un tailleur. Le tailleur ne livre pas le costume fini sans essayage. Il te fait essayer la veste en cours de confection pour vérifier les épaules, la longueur et la coupe. Si un ajustement est nécessaire, il le fait maintenant, pas une fois le costume terminé.

---

### Qu'est-ce que la rétrospective ?

**Définition** : La rétrospective est la réunion de fin de sprint où l'équipe de développement (sans le client) analyse son propre fonctionnement : ce qui a bien marché, ce qui a mal marché, et ce qu'elle va améliorer au prochain sprint.

**Le problème que la rétrospective résout** :

Sans rétrospective, voici les problèmes rencontrés :

1. **Erreurs répétées** : l'équipe fait les mêmes erreurs sprint après sprint (mauvaise estimation, bugs récurrents, communication défaillante).
2. **Frustrations non exprimées** : un développeur est frustré par un processus inefficace mais ne le dit jamais. La frustration s'accumule.
3. **Pas d'amélioration continue** : sans moment dédié à l'analyse, l'équipe ne progresse pas dans son fonctionnement.

**Comment la rétrospective résout ces problèmes** :

| Problème | Solution apportée |
| --- | --- |
| Erreurs répétées | Analyse des causes et plan d'action concret |
| Frustrations non exprimées | Cadre sécurisé pour exprimer les difficultés |
| Pas d'amélioration continue | Une action d'amélioration par sprint, mesurable |

**Analogie concrète** : La rétrospective, c'est comme le debriefing après un match de football. L'entraîneur ne dit pas juste "On a gagné" ou "On a perdu". Il analyse : "La défense a bien tenu en première mi-temps, mais on a perdu trop de ballons au milieu du terrain. Au prochain match, on va travailler les passes courtes." C'est une analyse factuelle pour progresser.

**Ce que la rétrospective n'est PAS** :

- La rétrospective n'est pas une séance de plaintes. L'objectif n'est pas de se plaindre, mais de trouver des solutions concrètes.
- La rétrospective n'est pas un tribunal. On analyse les processus, pas les personnes. "Les tests ont été insuffisants" au lieu de "Thomas n'a pas écrit ses tests".

---

## Étapes Pratiques

L'exercice de cette fiche est un projet intégrateur. Chaque étape simule une phase d'un sprint complet. Tu vas jouer tous les rôles (Product Owner, Scrum Master, développeur) pour comprendre l'ensemble du processus.

**Contexte du projet** : Tu reprends le projet MyBooks (application de gestion de bibliothèque personnelle, voir fiche 04). Le backlog initial contient 12 user stories. Tu dois planifier et simuler un sprint de 2 semaines.

### Étape 1 : Constituer le backlog produit

Voici le backlog produit initial, déjà priorisé par le Product Owner :

```text
BACKLOG PRODUIT - MyBooks (priorisé)

ID   | Story                                              | Points
-----|----------------------------------------------------|---------
US01 | En tant qu'utilisateur, je veux créer un compte    |   3
     | pour accéder à l'application                       |
US02 | En tant qu'utilisateur, je veux me connecter       |   2
     | avec mon email et mot de passe                     |
US03 | En tant qu'utilisateur, je veux ajouter un livre   |   5
     | (titre, auteur, ISBN) à ma bibliothèque            |
US04 | En tant qu'utilisateur, je veux voir la liste      |   3
     | de mes livres                                      |
US05 | En tant qu'utilisateur, je veux changer le statut  |   3
     | d'un livre (à lire, en cours, lu)                  |
US06 | En tant qu'utilisateur, je veux rechercher un      |   5
     | livre dans ma bibliothèque par titre ou auteur     |
US07 | En tant qu'utilisateur, je veux supprimer un       |   2
     | livre de ma bibliothèque                           |
US08 | En tant qu'utilisateur, je veux ajouter une note   |   3
     | et un commentaire à un livre                       |
US09 | En tant qu'utilisateur, je veux trier mes livres   |   3
     | par date d'ajout, titre ou auteur                  |
US10 | En tant qu'utilisateur, je veux voir mes           |   5
     | statistiques de lecture (livres par mois)          |
US11 | En tant qu'utilisateur, je veux exporter ma        |   5
     | bibliothèque en CSV                                |
US12 | En tant qu'utilisateur, je veux partager une       |   8
     | recommandation de livre par email                  |
```

---

### Étape 2 : Planifier le sprint (sprint planning)

La vélocité estimée de l'équipe est de **16 points par sprint** (2 semaines).

**Sélection des stories** :

En partant du haut du backlog (priorité décroissante), sélectionne des stories jusqu'à atteindre la vélocité :

```text
SPRINT 1 - Stories sélectionnées

ID   | Story                                    | Points
-----|------------------------------------------|---------
US01 | Créer un compte                          |   3
US02 | Se connecter                             |   2
US03 | Ajouter un livre                         |   5
US04 | Voir la liste de mes livres              |   3
US05 | Changer le statut d'un livre             |   3
-----|------------------------------------------|---------
     | TOTAL                                    |  16

Objectif du sprint : "L'utilisateur peut créer un compte, se connecter,
ajouter des livres et gérer leur statut de lecture."
```

**Découpage en tâches techniques** :

Chaque user story doit être découpée en tâches concrètes :

```text
US01 - Créer un compte (3 points)

Tâches techniques :
T01.1 : Créer l'entité User (Doctrine) avec email, password, name
T01.2 : Créer le formulaire d'inscription (Symfony Form)
T01.3 : Créer le contrôleur RegisterController avec validation
T01.4 : Créer la page React d'inscription
T01.5 : Écrire les tests (unitaire : validation email, intégration :
        création de compte)

Critères d'acceptation :
- L'utilisateur remplit email, mot de passe et nom
- Le mot de passe doit contenir au moins 8 caractères
- Si l'email existe déjà, un message d'erreur s'affiche
- Après inscription, l'utilisateur est redirigé vers la page de connexion

US02 - Se connecter (2 points)

Tâches techniques :
T02.1 : Configurer l'authentification JWT (LexikJWTAuthenticationBundle)
T02.2 : Créer le endpoint POST /api/login
T02.3 : Créer la page React de connexion
T02.4 : Stocker le token JWT dans le localStorage
T02.5 : Écrire les tests (unitaire : validation, intégration : login)

Critères d'acceptation :
- L'utilisateur se connecte avec email et mot de passe
- Un token JWT est retourné en cas de succès
- Un message d'erreur s'affiche si les identifiants sont incorrects
- L'utilisateur reste connecté après rafraîchissement de la page

US03 - Ajouter un livre (5 points)

Tâches techniques :
T03.1 : Créer l'entité Book (Doctrine) avec titre, auteur, ISBN, statut
T03.2 : Créer le endpoint POST /api/books
T03.3 : Créer le formulaire React d'ajout de livre
T03.4 : Valider les données côté back-end (titre obligatoire, ISBN unique)
T03.5 : Écrire les tests (unitaire : validation, intégration : ajout)
T03.6 : Ajouter la vérification de doublon (même ISBN)

Critères d'acceptation :
- L'utilisateur peut saisir titre (obligatoire), auteur et ISBN
- Le statut par défaut est "À lire"
- Si l'ISBN existe déjà, un message d'erreur s'affiche
- Le livre apparaît dans la liste après ajout
```

---

### Étape 3 : Simuler le développement quotidien

Voici la simulation d'une semaine de développement avec les daily standups :

```text
JOUR 1 (lundi) - Daily standup

Développeur 1 :
- Hier : Sprint planning
- Aujourd'hui : T01.1 (entité User) et T01.2 (formulaire inscription)
- Blocage : Aucun

Développeur 2 :
- Hier : Sprint planning
- Aujourd'hui : T02.1 (configuration JWT)
- Blocage : Aucun

Développeur 3 :
- Hier : Sprint planning
- Aujourd'hui : T03.1 (entité Book) et début T03.2 (endpoint)
- Blocage : Aucun

-------------------------------------------------------------

JOUR 2 (mardi) - Daily standup

Développeur 1 :
- Hier : T01.1 et T01.2 terminés
- Aujourd'hui : T01.3 (contrôleur) et T01.4 (page React)
- Blocage : Aucun

Développeur 2 :
- Hier : T02.1 en cours (problème de configuration du bundle JWT)
- Aujourd'hui : Finir T02.1 et commencer T02.2
- Blocage : OUI - la documentation du bundle est ambiguë sur la
  configuration des clés RSA

  -> Action Scrum Master : planifier une session de pair programming
     entre Dev 2 et le lead technique après le standup

Développeur 3 :
- Hier : T03.1 terminé, T03.2 à moitié
- Aujourd'hui : Finir T03.2 et commencer T03.3
- Blocage : Aucun

-------------------------------------------------------------

JOUR 3 (mercredi) - Daily standup

Développeur 1 :
- Hier : T01.3 et T01.4 terminés
- Aujourd'hui : T01.5 (tests) et début revue de code de US03
- Blocage : Aucun

Développeur 2 :
- Hier : T02.1 résolu grâce au pair programming, T02.2 terminé
- Aujourd'hui : T02.3 (page React connexion) et T02.4 (stockage token)
- Blocage : Aucun

Développeur 3 :
- Hier : T03.2 et T03.3 terminés
- Aujourd'hui : T03.4 (validation back) et T03.5 (tests)
- Blocage : Aucun

-------------------------------------------------------------

JOUR 4 (jeudi) - Daily standup

Développeur 1 :
- Hier : US01 terminée (tests OK, revue de code soumise)
- Aujourd'hui : Commencer US04 (T04.1 : endpoint GET /api/books)
- Blocage : Aucun

Développeur 2 :
- Hier : T02.3 et T02.4 terminés
- Aujourd'hui : T02.5 (tests) et soumission de la revue de code
- Blocage : Aucun

Développeur 3 :
- Hier : T03.4 terminé, T03.5 en cours
- Aujourd'hui : Finir T03.5 et T03.6 (vérification doublon)
- Blocage : Aucun

-------------------------------------------------------------

JOUR 5 (vendredi) - Daily standup

Développeur 1 :
- Hier : US04 avancée (endpoint + page React en cours)
- Aujourd'hui : Finir US04, relire la PR de Dev 2 (US02)
- Blocage : Aucun

Développeur 2 :
- Hier : US02 terminée, PR soumise
- Aujourd'hui : Relire la PR de Dev 3 (US03), commencer US05
- Blocage : Aucun

Développeur 3 :
- Hier : US03 terminée, PR soumise
- Aujourd'hui : Relire la PR de Dev 1 (US01 et US04)
- Blocage : Aucun
```

**Tableau de suivi du sprint (fin de semaine 1)** :

```text
SPRINT BOARD - Fin de semaine 1

| À FAIRE     | EN COURS      | EN REVUE       | TERMINÉ        |
|-------------|---------------|----------------|----------------|
| US05 (3pts) | US04 (3pts)   |                | US01 (3pts)    |
|             |               |                | US02 (2pts)    |
|             |               |                | US03 (5pts)    |
|-------------|---------------|----------------|----------------|
| Restant: 3  | En cours: 3   | En revue: 0    | Fait: 10       |

Points réalisés : 10 / 16
Semaine restante : 1
Statut : en bonne voie
```

---

### Étape 4 : Conduire la revue de sprint

À la fin du sprint, l'équipe présente les fonctionnalités terminées au Product Owner :

```text
REVUE DE SPRINT - Sprint 1

Date : vendredi, fin de sprint
Participants : équipe de développement (3 devs) + Product Owner
Durée : 1 heure

OBJECTIF DU SPRINT :
"L'utilisateur peut créer un compte, se connecter, ajouter des livres
et gérer leur statut de lecture."

DÉMONSTRATION :

1. US01 - Créer un compte : TERMINÉ
   -> Démonstration : inscription avec email, mot de passe (8 caractères
      minimum), redirection vers la page de connexion
   -> PO : "OK, validé"

2. US02 - Se connecter : TERMINÉ
   -> Démonstration : connexion avec les identifiants créés, token JWT
      stocké, persistance après rafraîchissement
   -> PO : "OK, validé. Pour le sprint 2, il faudrait un bouton
      'Mot de passe oublié'."
   -> Action : ajouter US13 au backlog ("Réinitialiser son mot de passe")

3. US03 - Ajouter un livre : TERMINÉ
   -> Démonstration : ajout d'un livre avec titre + auteur, vérification
      du doublon par ISBN
   -> PO : "OK, validé. L'ISBN est-il vérifié (format) ?"
   -> Réponse : "Non, on vérifie uniquement l'unicité, pas le format."
   -> Action : ajouter une tâche technique au backlog (validation du
      format ISBN)

4. US04 - Voir la liste de mes livres : TERMINÉ
   -> Démonstration : affichage de la liste avec titre, auteur et statut
   -> PO : "OK, validé"

5. US05 - Changer le statut d'un livre : TERMINÉ
   -> Démonstration : changement de statut via un menu déroulant
   -> PO : "OK, validé"

RÉSULTAT :
- Stories terminées : 5/5 (16/16 points)
- Stories validées par le PO : 5/5
- Vélocité réelle du sprint 1 : 16 points

NOUVELLES ENTRÉES DANS LE BACKLOG :
- US13 : Réinitialiser son mot de passe (suggestion PO)
- Tâche technique : Validation du format ISBN (13 chiffres)
```

---

### Étape 5 : Animer la rétrospective

L'équipe se réunit (sans le Product Owner) pour analyser son fonctionnement :

```text
RÉTROSPECTIVE - Sprint 1

Date : vendredi, après la revue de sprint
Participants : équipe de développement (3 devs) + Scrum Master
Durée : 45 minutes
Format : Start / Stop / Continue

CE QUI A BIEN MARCHÉ (Continue) :
- Le découpage en tâches techniques pendant le planning a été utile :
  chacun savait exactement quoi faire
- Les revues de code croisées ont permis de détecter 3 bugs avant
  le merge
- Le pair programming pour résoudre le blocage JWT a été efficace
  (résolu en 30 minutes au lieu de 2 jours)

CE QUI A MAL MARCHÉ (Stop) :
- Le daily standup durait parfois 25 minutes au lieu de 15
  -> Cause : on discutait des solutions techniques pendant le standup
  -> Action : limiter à 15 minutes strictement, noter les sujets
     techniques pour des discussions séparées après le standup

- Les tests ont été écrits en dernier, ce qui a mis la pression
  en fin de sprint
  -> Cause : habitude de coder d'abord, tester ensuite
  -> Action : écrire les tests en même temps que le code (pas de PR
     sans tests)

CE QU'ON VEUT ESSAYER (Start) :
- Limiter les PR à 300 lignes maximum pour des revues plus efficaces
- Utiliser un timer de 15 minutes pendant le daily standup
- Commencer chaque tâche par les tests (approche TDD)

PLAN D'ACTION POUR LE SPRINT 2 :
1. [Priorité haute] Timer de 15 minutes pour le daily -> Dev 2 chronomètre
2. [Priorité haute] Pas de PR sans tests -> Ajouter à la DoD
3. [Priorité moyenne] Limite de 300 lignes par PR -> Ajouter à la DoD
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `git log --oneline --since="1 week"` | Voir les commits de la dernière semaine |
| `git shortlog -s --since="2 weeks"` | Compter les commits par développeur sur le sprint |
| `git branch --list "feature/*"` | Lister les branches de fonctionnalités en cours |
| `git log --oneline --graph --all` | Visualiser toutes les branches et fusions |

---

## Pièges Fréquents

### Piège 1 : Le sprint planning trop optimiste

**Problème** : L'équipe sélectionne 20 points de stories alors que sa vélocité moyenne est de 16. À la fin du sprint, 2 stories ne sont pas terminées. Le Product Owner est déçu. L'équipe est découragée.

**Solution** : Respecte la vélocité. Si l'équipe fait 16 points par sprint en moyenne, ne planifie pas plus de 16 points. Mieux vaut terminer tout ce qui est prévu et ajouter une story en cours de sprint si l'équipe a de l'avance, que de ne pas finir ce qui était planifié.

```text
RÈGLE : La vélocité est un constat, pas un objectif.

Bon  : "Notre vélocité est de 16, on planifie 16 points."
Mauvais : "Notre vélocité est de 16, mais cette fois on va faire 22
          parce qu'on est motivés."
```

---

### Piège 2 : Le daily standup qui devient une réunion technique

**Problème** : Au lieu de durer 15 minutes, le daily dure 45 minutes parce que les développeurs discutent de solutions techniques. Les personnes non concernées par le sujet technique s'ennuient et décrochent.

**Solution** : Applique la règle du "parking lot" (parking à sujets). Si un sujet nécessite plus de 2 minutes de discussion, le Scrum Master le note et programme une discussion dédiée après le standup, avec uniquement les personnes concernées.

```text
Format strict du daily (15 minutes) :

Chaque personne, 2 minutes maximum :
1. "Hier, j'ai terminé [tâche]."
2. "Aujourd'hui, je travaille sur [tâche]."
3. "Je suis bloqué sur [sujet]." (ou "Pas de blocage.")

Si discussion technique nécessaire :
-> "On en parle après le standup avec [personnes concernées]."
```

---

### Piège 3 : La rétrospective sans action concrète

**Problème** : L'équipe dit "On devrait mieux communiquer" et "Il faudrait écrire plus de tests", mais ne définit aucune action précise. Au sprint suivant, rien n'a changé.

**Solution** : Chaque point d'amélioration doit se transformer en une action SMART (Spécifique, Mesurable, Atteignable, Réaliste, Temporelle) avec un responsable :

```text
Mauvais : "On devrait mieux communiquer."
Bon     : "À partir du sprint 2, chaque PR doit inclure une description
           de 3 lignes minimum. Dev 1 est responsable de vérifier
           pendant les revues de code."

Mauvais : "Il faudrait écrire plus de tests."
Bon     : "On ajoute à la DoD : pas de merge sans tests unitaires.
           La couverture minimum est de 80% sur le nouveau code.
           Le Scrum Master vérifie avant chaque merge."
```

---

### Piège 4 : Ignorer la revue de sprint

**Problème** : L'équipe saute la revue de sprint parce que "tout le monde sait ce qui a été fait" ou "le PO était occupé". Résultat : le PO découvre des problèmes 3 sprints plus tard, et il faut tout refaire.

**Solution** : La revue de sprint est obligatoire. Si le PO ne peut pas être présent physiquement, organise une visioconférence. Si même une visio est impossible, envoie une vidéo de démonstration avec un formulaire de feedback. Le PO doit valider chaque story avant qu'elle soit considérée comme terminée.

---

## Checklist de Validation

- Je sais constituer un backlog produit priorisé avec des story points
- Je sais planifier un sprint en respectant la vélocité de l'équipe
- Je sais découper une user story en tâches techniques
- Je sais simuler un daily standup avec les trois questions (hier, aujourd'hui, blocage)
- Je sais conduire une revue de sprint avec démonstration au Product Owner
- Je sais animer une rétrospective (Start / Stop / Continue) avec des actions concrètes
- Je sais utiliser un tableau de suivi de sprint (À faire, En cours, En revue, Terminé)

---

## Exercice Pratique

**Énoncé** : Simule le sprint 2 du projet MyBooks en autonomie.

Le sprint 2 reprend là où le sprint 1 s'est arrêté. La vélocité confirmée est de 16 points. Le backlog restant est :

```text
BACKLOG RESTANT (priorisé)

ID   | Story                                              | Points
-----|----------------------------------------------------|---------
US06 | Rechercher un livre par titre ou auteur             |   5
US07 | Supprimer un livre                                  |   2
US08 | Ajouter une note et un commentaire à un livre       |   3
US09 | Trier mes livres par date, titre ou auteur          |   3
US10 | Voir mes statistiques de lecture                    |   5
US11 | Exporter ma bibliothèque en CSV                     |   5
US12 | Partager une recommandation par email                |   8
US13 | Réinitialiser son mot de passe (nouveau)            |   3
```

Tu dois produire :

1. **Sprint planning** : sélectionne les stories pour le sprint 2 (16 points max), découpe au moins 2 stories en tâches techniques avec critères d'acceptation
2. **Daily standups** : simule 3 jours de daily (jour 1, jour 3, jour 5) pour une équipe de 3 développeurs. Inclus au moins un blocage et sa résolution
3. **Sprint board** : dessine le tableau de suivi en fin de semaine 1 (répartition des stories entre les colonnes)
4. **Revue de sprint** : rédige le compte-rendu de la revue avec les retours du PO (au moins 1 story non validée du premier coup)
5. **Rétrospective** : rédige le compte-rendu au format Start / Stop / Continue avec au moins 2 actions concrètes pour le sprint 3

**Indications** :

- US13 (réinitialiser son mot de passe) est prioritaire parce qu'elle est issue d'un retour du PO
- Imagine un blocage réaliste lié à US06 (la recherche peut être complexe si elle doit chercher dans les titres ET les auteurs)
- Pour la revue, imagine que le PO n'est pas satisfait de l'ergonomie d'une fonctionnalité

**Résultat attendu** : 5 documents distincts, suivant les formats présentés dans les étapes pratiques.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Sprint planning - Sprint 2

```text
SPRINT 2 - Stories sélectionnées (vélocité : 16 points)

ID   | Story                                    | Points
-----|------------------------------------------|---------
US13 | Réinitialiser son mot de passe           |   3
US06 | Rechercher un livre par titre ou auteur   |   5
US07 | Supprimer un livre                        |   2
US08 | Ajouter une note et un commentaire        |   3
US09 | Trier mes livres                          |   3
-----|------------------------------------------|---------
     | TOTAL                                    |  16

Objectif du sprint : "L'utilisateur peut réinitialiser son mot de passe,
rechercher ses livres, les supprimer, les commenter et les trier."
```

**Découpage de US06 - Rechercher un livre (5 points)** :

```text
Tâches techniques :
T06.1 : Créer le endpoint GET /api/books?search=terme
T06.2 : Implémenter la recherche dans le repository Doctrine
        (LIKE sur titre ET auteur)
T06.3 : Créer le composant React SearchBar avec debounce (300ms)
T06.4 : Afficher les résultats filtrés dans la liste existante
T06.5 : Gérer le cas "aucun résultat" (message explicite)
T06.6 : Écrire les tests (unitaire : requête de recherche,
        intégration : recherche complète)

Critères d'acceptation :
- L'utilisateur peut saisir un terme de recherche
- La recherche s'effectue sur le titre ET l'auteur
- La recherche est insensible à la casse ("dune" trouve "Dune")
- Si aucun résultat : message "Aucun livre trouvé pour [terme]"
- La recherche se déclenche après 300ms d'inactivité (debounce)
```

**Découpage de US13 - Réinitialiser son mot de passe (3 points)** :

```text
Tâches techniques :
T13.1 : Créer le endpoint POST /api/forgot-password (envoie un email
        avec un token de réinitialisation)
T13.2 : Créer le endpoint POST /api/reset-password (vérifie le token
        et change le mot de passe)
T13.3 : Créer la page React "Mot de passe oublié"
T13.4 : Créer la page React "Nouveau mot de passe"
T13.5 : Écrire les tests (unitaire : validation token, intégration :
        flux complet)

Critères d'acceptation :
- L'utilisateur clique sur "Mot de passe oublié" depuis la page
  de connexion
- Il saisit son email et reçoit un lien de réinitialisation
- Le lien contient un token valable 1 heure
- Après 1 heure, le lien ne fonctionne plus (message d'erreur)
- Le nouveau mot de passe doit respecter les mêmes règles que
  l'inscription (8 caractères minimum)
```

### 2. Daily standups (jours 1, 3 et 5)

```text
JOUR 1 (lundi) - Daily standup

Développeur 1 :
- Hier : Sprint planning
- Aujourd'hui : T13.1 et T13.2 (endpoints reset password)
- Blocage : Aucun

Développeur 2 :
- Hier : Sprint planning
- Aujourd'hui : T06.1 et T06.2 (endpoint et recherche Doctrine)
- Blocage : Aucun

Développeur 3 :
- Hier : Sprint planning
- Aujourd'hui : US07 (supprimer un livre - endpoint + page React)
- Blocage : Aucun

-------------------------------------------------------------

JOUR 3 (mercredi) - Daily standup

Développeur 1 :
- Hier : T13.1 à T13.4 terminés
- Aujourd'hui : T13.5 (tests) et soumission PR
- Blocage : Aucun

Développeur 2 :
- Hier : T06.1 et T06.2 terminés, T06.3 en cours
- Aujourd'hui : Finir T06.3 (debounce) et T06.4
- Blocage : OUI - la recherche LIKE en PostgreSQL ne gère pas bien
  les accents ("herve" ne trouve pas "Hervé"). Faut-il utiliser
  unaccent ou normaliser les données ?

  -> Action Scrum Master : discussion technique après le standup
     entre Dev 2 et Dev 1 pour choisir l'approche. Si l'extension
     unaccent est simple à configurer, on l'utilise. Sinon, on
     normalise les données à l'insertion.

Développeur 3 :
- Hier : US07 terminée (PR soumise), commencé US08
- Aujourd'hui : Continuer US08 (T08.2 : formulaire note + commentaire)
- Blocage : Aucun

-------------------------------------------------------------

JOUR 5 (vendredi) - Daily standup

Développeur 1 :
- Hier : US13 terminée et validée en revue de code
- Aujourd'hui : Commencer US09 (trier les livres)
- Blocage : Aucun

Développeur 2 :
- Hier : Blocage résolu (extension unaccent configurée en 20 minutes),
  T06.3 à T06.5 terminés
- Aujourd'hui : T06.6 (tests) et soumission PR
- Blocage : Aucun

Développeur 3 :
- Hier : US08 terminée, PR soumise
- Aujourd'hui : Relire les PR de Dev 1 (US13) et Dev 2 (US06)
- Blocage : Aucun
```

### 3. Sprint board - Fin de semaine 1

```text
SPRINT BOARD - Sprint 2, fin de semaine 1

| À FAIRE     | EN COURS      | EN REVUE       | TERMINÉ        |
|-------------|---------------|----------------|----------------|
| US09 (3pts) |               | US06 (5pts)    | US13 (3pts)    |
|             |               | US08 (3pts)    | US07 (2pts)    |
|-------------|---------------|----------------|----------------|
| Restant: 3  | En cours: 0   | En revue: 8    | Fait: 5        |

Points réalisés : 5 / 16
Points en revue : 8
Semaine restante : 1
Statut : en bonne voie (13 points terminés ou en revue sur 16)
```

### 4. Revue de sprint - Sprint 2

```text
REVUE DE SPRINT - Sprint 2

Date : vendredi, fin de sprint
Participants : équipe (3 devs) + Product Owner
Durée : 1 heure

OBJECTIF DU SPRINT :
"L'utilisateur peut réinitialiser son mot de passe, rechercher ses
livres, les supprimer, les commenter et les trier."

DÉMONSTRATION :

1. US13 - Réinitialiser son mot de passe : TERMINÉ
   -> Démonstration : clic sur "Mot de passe oublié", saisie de l'email,
      réception de l'email avec lien, saisie du nouveau mot de passe,
      connexion avec le nouveau mot de passe
   -> PO : "OK, validé"

2. US06 - Rechercher un livre : TERMINÉ
   -> Démonstration : saisie de "dune" dans la barre de recherche,
      résultat affiché après 300ms, recherche insensible aux accents
   -> PO : "OK, validé. La recherche est rapide, c'est bien."

3. US07 - Supprimer un livre : TERMINÉ
   -> Démonstration : clic sur "Supprimer", message de confirmation,
      suppression du livre de la liste
   -> PO : "OK, validé"

4. US08 - Ajouter une note et un commentaire : TERMINÉ
   -> Démonstration : clic sur un livre, ajout d'une note (1-5) et
      d'un commentaire texte
   -> PO : "NON VALIDÉ. La note va de 1 à 5, mais il n'y a pas de
      représentation visuelle (étoiles). Et le commentaire n'a pas
      de limite de caractères - on pourrait écrire un roman."
   -> Actions :
      - Ajouter une représentation en étoiles (visuel)
      - Limiter le commentaire à 500 caractères avec compteur

5. US09 - Trier mes livres : TERMINÉ
   -> Démonstration : tri par date d'ajout, par titre (alphabétique),
      par auteur (alphabétique)
   -> PO : "OK, validé. Pour plus tard, ce serait bien de pouvoir
      trier par note aussi."
   -> Action : ajouter au backlog (tri par note)

RÉSULTAT :
- Stories terminées : 5/5 (16/16 points)
- Stories validées par le PO : 4/5 (US08 nécessite des ajustements)
- Vélocité réelle du sprint 2 : 16 points
- Vélocité moyenne : (16 + 16) / 2 = 16 points

AJUSTEMENTS US08 :
- Les corrections mineures (étoiles + limite caractères) sont ajoutées
  en priorité dans le sprint 3

NOUVELLES ENTRÉES DANS LE BACKLOG :
- US14 : Trier les livres par note (suggestion PO)
- Ajustements US08 : étoiles visuelles + limite 500 caractères
```

### 5. Rétrospective - Sprint 2

```text
RÉTROSPECTIVE - Sprint 2

Date : vendredi, après la revue de sprint
Participants : équipe (3 devs) + Scrum Master
Durée : 45 minutes
Format : Start / Stop / Continue

CE QUI A BIEN MARCHÉ (Continue) :
- Le timer de 15 minutes pour le daily a bien fonctionné
  (pas de dépassement cette fois)
- Le pair programming pour résoudre le blocage de la recherche avec
  accents a été rapide (30 minutes, extension unaccent configurée)
- Les tests écrits en même temps que le code ont évité des bugs
  (2 erreurs de validation détectées avant la revue de code)

CE QUI A MAL MARCHÉ (Stop) :
- US08 n'a pas été validée par le PO parce que l'ergonomie
  n'a pas été discutée en amont (note sans étoiles, pas de limite
  de caractères)
  -> Cause : l'équipe n'a pas montré de maquette au PO avant de coder
  -> Action : pour chaque story avec un composant visuel, montrer une
     maquette rapide (même un dessin sur papier) au PO AVANT de coder.
     Responsable : Scrum Master vérifie au daily du jour 2

- Les PR de la fin de semaine 1 (US06 et US08) n'ont été relues que
  le lundi de la semaine 2, ce qui a retardé les corrections
  -> Cause : les relecteurs étaient occupés sur leurs propres tâches
  -> Action : chaque matin, avant de commencer sa propre tâche,
     relire les PR en attente (max 30 minutes). Responsable : chaque
     développeur, vérification au daily

CE QU'ON VEUT ESSAYER (Start) :
- Ajouter une colonne "Maquette validée" avant "En cours" dans le
  sprint board pour les stories avec interface utilisateur
- Définir un délai maximum de 24 heures pour relire une PR

PLAN D'ACTION POUR LE SPRINT 3 :
1. [Priorité haute] Maquette obligatoire avant le code pour les stories
   avec interface -> Ajouter à la DoD
2. [Priorité haute] Relire les PR en attente chaque matin avant
   de coder -> Règle d'équipe
3. [Priorité moyenne] Corriger US08 (étoiles + limite caractères)
   en priorité au sprint 3
```

---

## Navigation

← Fiche précédente : **[05 - Qualité et documentation technique](05-qualite-documentation.md)**
