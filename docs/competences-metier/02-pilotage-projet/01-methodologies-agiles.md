---
tags:
  - Méthodologie
  - Débutant
  - Projet
description: "01 - Les Méthodologies Agiles"
estimated_time: "25 min"
fiche_number: 1
total_fiches: 3
cursus: "Pilotage de projet"
---

# 01 - Les Méthodologies Agiles

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est l'agilité en gestion de projet, comment fonctionnent les méthodes Scrum et Kanban, et comment organiser un projet informatique en sprints. Lecture estimée : 25 min.


## Prérequis

- Fiche **[Cahier des charges](../01-besoins-utilisateurs/01-cahier-des-charges.md)** (utile mais pas obligatoire)
- Fiche **[01 - Le Cahier des Charges Technique](../01-besoins-utilisateurs/01-cahier-des-charges.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est l'agilité en gestion de projet, comment fonctionnent les méthodes Scrum et Kanban, et comment organiser un projet informatique en sprints.

---

## Concepts

### Qu'est-ce que l'agilité ?

**Définition** : L'agilité est une approche de gestion de projet qui privilégie la flexibilité, la collaboration, et la livraison rapide de valeur, plutôt que de suivre un plan rigide défini à l'avance.

**Le problème que l'agilité résout** :

Sans agilité (méthode dite "en cascade" ou "waterfall"), voici les problèmes rencontrés :

1. **Effet tunnel** : Le client ne voit rien pendant des mois, puis découvre un produit qui ne correspond pas à ses attentes.
2. **Rigidité** : Impossible de changer quoi que ce soit une fois le plan validé.
3. **Retards invisibles** : On découvre les problèmes trop tard pour les corriger.
4. **Documentation excessive** : Des mois passés à documenter avant d'écrire une ligne de code.

**Comment l'agilité résout ces problèmes** :

| Problème | Solution agile |
| -------- | -------------- |
| Effet tunnel | Livraisons fréquentes (toutes les 2-4 semaines) |
| Rigidité | Le plan évolue à chaque sprint |
| Retards invisibles | Rétrospectives régulières pour identifier les problèmes |
| Documentation excessive | Documentation juste nécessaire, focus sur le code fonctionnel |

**Analogie concrète** : Imagine que tu construis une maison. En méthode cascade, tu dessines tout le plan, tu commandes tous les matériaux, et tu construis tout d'un coup. Si tu réalises que la cuisine est trop petite, c'est trop tard. En méthode agile, tu construis une pièce, tu la montres au client, il peut ajuster ses demandes pour la pièce suivante.

**Ce que l'agilité n'est PAS** :

- L'agilité n'est pas l'absence de planification. On planifie, mais sur des cycles courts.
- L'agilité n'est pas le chaos. Il y a des règles et des rituels précis.
- L'agilité n'est pas une excuse pour ne pas documenter. On documente ce qui est utile.

**Comparaison Cascade vs Agile** :

| Cascade (Waterfall) | Agile |
| ------------------- | ----- |
| Plan complet au départ | Plan évolutif |
| Livraison à la fin | Livraisons fréquentes |
| Changements coûteux | Changements bienvenus |
| Client voit le produit à la fin | Client voit le produit à chaque sprint |
| Adapté aux projets très cadrés | Adapté aux projets évolutifs |

---

### Qu'est-ce que Scrum ?

**Définition** : Scrum est un framework agile qui organise le travail en cycles courts appelés "sprints", avec des rôles définis et des rituels réguliers.

**Les 3 rôles Scrum** :

| Rôle | Responsabilité | Analogie |
| ---- | -------------- | -------- |
| **Product Owner** (PO) | Définit ce qu'il faut faire et les priorités | Le client ou son représentant |
| **Scrum Master** (SM) | Facilite le processus, élimine les obstacles | L'arbitre / le coach |
| **Équipe de développement** | Réalise le travail technique | Les joueurs |

**Les artéfacts Scrum** :

| Artéfact | Description |
| -------- | ----------- |
| **Product Backlog** | Liste de toutes les fonctionnalités souhaitées, priorisée par le PO |
| **Sprint Backlog** | Liste des tâches à réaliser pendant le sprint en cours |
| **Incrément** | Le produit fonctionnel à la fin de chaque sprint |

**Les rituels Scrum** :

| Rituel | Quand | Durée | Objectif |
| ------ | ----- | ----- | -------- |
| **Sprint Planning** | Début de sprint | 2-4h | Choisir ce qu'on va faire |
| **Daily Standup** | Chaque jour | 15 min max | Synchronisation rapide |
| **Sprint Review** | Fin de sprint | 1-2h | Démontrer ce qui a été fait |
| **Sprint Retrospective** | Fin de sprint | 1-2h | Améliorer le processus |

Le diagramme suivant montre le cycle Scrum, du backlog produit jusqu'à la rétrospective qui boucle vers le backlog.

<div class="diagram-design">
<p><a href="../../../diagrams/competences-metier-02-pilotage-projet-01-methodologies-agiles-1.html">Qu&#x27;est-ce que Scrum ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/competences-metier-02-pilotage-projet-01-methodologies-agiles-1.html" title="Qu&#x27;est-ce que Scrum ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Qu'est-ce que Kanban ?

**Définition** : Kanban est une méthode agile visuelle qui gère le flux de travail avec un tableau et des limites de travail en cours (WIP - Work In Progress).

**Comparaison Scrum vs Kanban** :

| Aspect | Scrum | Kanban |
| ------ | ----- | ------ |
| Cycles | Sprints fixes (2-4 semaines) | Flux continu |
| Rôles | PO, SM, Équipe | Pas de rôles imposés |
| Planification | Au début de chaque sprint | En continu |
| Changements | Entre les sprints | À tout moment |
| Idéal pour | Projets avec livrables définis | Maintenance, support, flux continu |

**Les colonnes Kanban standard** :

| Colonne | Signification |
| ------- | ------------- |
| **À faire** (To Do) | Tâches en attente |
| **En cours** (In Progress) | Tâches en cours de réalisation |
| **En revue** (Review) | Tâches terminées, en attente de validation |
| **Terminé** (Done) | Tâches validées et livrées |

**La limite WIP** : Chaque colonne a une limite de tâches. Si "En cours" est limité à 3 et qu'il y a déjà 3 tâches, personne ne peut en prendre une nouvelle. Cela force à finir avant de commencer.

---

## Étapes Pratiques

### Étape 1 : Créer un Product Backlog

Le Product Backlog liste toutes les fonctionnalités sous forme de "User Stories" :

```markdown
## Product Backlog

### Format d'une User Story

> **En tant que** [type d'utilisateur],
> **je veux** [action/fonctionnalité],
> **afin de** [bénéfice/objectif].

### Exemple de Product Backlog

| ID | User Story | Priorité | Estimation |
| -- | ---------- | -------- | ---------- |
| US-001 | En tant qu'utilisateur, je veux créer un compte afin d'accéder à l'application | Haute | 5 |
| US-002 | En tant qu'utilisateur, je veux me connecter afin d'accéder à mes données | Haute | 3 |
| US-003 | En tant qu'admin, je veux voir la liste des utilisateurs afin de les gérer | Moyenne | 5 |
| US-004 | En tant qu'utilisateur, je veux réinitialiser mon mot de passe afin de récupérer mon accès | Moyenne | 3 |
| US-005 | En tant qu'utilisateur, je veux modifier mon profil afin de mettre à jour mes informations | Basse | 2 |
```

**Règles de rédaction** :

- Une User Story = une fonctionnalité indépendante
- Assez petite pour être réalisée en 1 sprint
- Critères d'acceptation clairs

---

### Étape 2 : Estimer les User Stories (Planning Poker)

L'estimation utilise souvent la suite de Fibonacci : 1, 2, 3, 5, 8, 13, 21...

| Points | Signification |
| ------ | ------------- |
| 1 | Trivial, quelques minutes |
| 2 | Simple, quelques heures |
| 3 | Modéré, environ 1 jour |
| 5 | Significatif, 2-3 jours |
| 8 | Complexe, presque 1 semaine |
| 13 | Très complexe, à découper |
| 21+ | Trop gros, doit être découpé |

**Processus du Planning Poker** :

1. Le PO présente une User Story
2. L'équipe pose des questions pour clarifier
3. Chaque membre choisit une carte (en secret)
4. Tout le monde révèle en même temps
5. Si consensus : on note l'estimation
6. Si écart : discussion puis nouveau vote

---

### Étape 3 : Planifier un Sprint

Un sprint dure 2 semaines (durée la plus courante ; certaines équipes utilisent 1 ou 3 semaines). Voici comment le planifier :

```markdown
## Sprint Planning - Sprint 3

### Informations du sprint

| Élément | Valeur |
| ------- | ------ |
| Numéro | Sprint 3 |
| Durée | 2 semaines (10 jours ouvrés) |
| Début | 15/01/2024 |
| Fin | 26/01/2024 |
| Vélocité prévue | 21 points |

### Objectif du sprint

> Permettre aux utilisateurs de créer un compte et de se connecter.

### Sprint Backlog

| ID | User Story | Points | Responsable | Statut |
| -- | ---------- | ------ | ----------- | ------ |
| US-001 | Création de compte | 5 | Alice | À faire |
| US-002 | Connexion | 3 | Bob | À faire |
| US-004 | Réinitialisation mdp | 3 | Alice | À faire |
| TECH-001 | Mise en place CI/CD | 5 | Charlie | À faire |
| TECH-002 | Configuration base de données | 5 | Bob | À faire |

### Total points : 21

### Critères de succès du sprint

- [ ] Un utilisateur peut créer un compte avec email/mot de passe
- [ ] Un utilisateur peut se connecter avec ses identifiants
- [ ] Un utilisateur peut demander un lien de réinitialisation
- [ ] Le pipeline CI/CD déploie automatiquement sur l'environnement de test
```

---

### Étape 4 : Animer un Daily Standup

Le Daily Standup (ou "mêlée quotidienne") dure 15 minutes maximum. Chaque membre répond à 3 questions :

```markdown
## Daily Standup - 17/01/2024

### Format

Chaque participant répond à :
1. Qu'ai-je fait hier ?
2. Que vais-je faire aujourd'hui ?
3. Y a-t-il des obstacles ?

### Compte-rendu

**Alice** :
- Hier : Terminé le formulaire de création de compte
- Aujourd'hui : Implémenter la validation email
- Obstacles : Aucun

**Bob** :
- Hier : Configuration PostgreSQL terminée
- Aujourd'hui : Commencer US-002 (connexion)
- Obstacles : Besoin de clarification sur la gestion des sessions (question pour le PO)

**Charlie** :
- Hier : Pipeline CI fonctionnel pour les tests
- Aujourd'hui : Ajouter le déploiement automatique
- Obstacles : Accès au serveur de test en attente (→ Scrum Master)

### Actions

| Action | Responsable | Échéance |
| ------ | ----------- | -------- |
| Clarifier gestion sessions | Product Owner | Aujourd'hui 14h |
| Obtenir accès serveur test | Scrum Master | Aujourd'hui 16h |
```

**Règles importantes** :

- Debout (pour rester court)
- Même heure, même lieu chaque jour
- Pas de résolution de problème pendant le standup (on note les sujets pour après)
- Pas de compte-rendu au manager (c'est pour l'équipe)

---

### Étape 5 : Créer un tableau Kanban

Tu peux utiliser un tableau physique (post-its) ou numérique (Trello, Jira, GitLab).

```markdown
## Tableau Kanban - Sprint 3

### Colonnes et limites WIP

| Colonne | Limite WIP |
| ------- | ---------- |
| À faire | Illimité |
| En cours | 3 |
| En revue | 2 |
| Terminé | Illimité |

### État actuel (17/01)

| À faire | En cours (3/3) | En revue (1/2) | Terminé |
| ------- | -------------- | -------------- | ------- |
| US-004 | US-001 (Alice) | TECH-002 (Bob) | - |
| TECH-001 | US-002 (Bob) | | |
| | Configuration CI (Charlie) | | |
```

**Visualisation textuelle** :

```text
┌─────────────┬─────────────────┬──────────────┬───────────┐
│   À FAIRE   │    EN COURS     │   EN REVUE   │  TERMINÉ  │
│             │    (max: 3)     │   (max: 2)   │           │
├─────────────┼─────────────────┼──────────────┼───────────┤
│ US-004      │ US-001 [Alice]  │ TECH-002     │           │
│ TECH-001    │ US-002 [Bob]    │ [Bob]        │           │
│             │ CI/CD [Charlie] │              │           │
└─────────────┴─────────────────┴──────────────┴───────────┘
```

---

### Étape 6 : Animer une rétrospective

La rétrospective a lieu à la fin de chaque sprint pour améliorer le processus.

```markdown
## Rétrospective - Sprint 3

### Format : Start / Stop / Continue

#### Start (À commencer)

Ce qu'on devrait commencer à faire :

- Faire une revue de code systématique avant merge
- Documenter les décisions d'architecture

#### Stop (À arrêter)

Ce qu'on devrait arrêter de faire :

- Accepter des changements de scope en cours de sprint
- Faire des réunions de plus d'1h sans pause

#### Continue (À continuer)

Ce qui fonctionne bien :

- Daily standup à 9h30 (heure qui convient à tous)
- Binômage sur les tâches complexes
- Communication sur Slack instantanée

### Actions d'amélioration

| Action | Responsable | Échéance |
| ------ | ----------- | -------- |
| Mettre en place code review obligatoire | Tech Lead | Sprint 4 |
| Créer template de documentation architecture | Alice | Sprint 4 |
| Ajouter règle "pas de changement après J+3" | Scrum Master | Immédiat |
```

---

## Commandes Utiles

Cette fiche ne contient pas de commandes techniques car elle porte sur l'organisation.

**Outils Kanban recommandés** :

| Outil | Type | Prix | Adapté pour |
| ----- | ---- | ---- | ----------- |
| Trello | SaaS | Gratuit (limité) | Petites équipes |
| Jira | SaaS | Payant | Équipes structurées |
| GitLab Issues | SaaS/Self-hosted | Gratuit | Équipes techniques |
| Notion | SaaS | Gratuit (limité) | Équipes polyvalentes |
| Tableau physique | Post-its | ~20€ | Équipes co-localisées |

---

## Pièges Fréquents

### Piège 1 : Confondre vélocité et productivité

⚠️ **Problème** : Augmenter la vélocité artificiellement en gonflant les estimations.

✅ **Solution** : La vélocité sert à prévoir, pas à évaluer la performance.

```markdown
<!-- ❌ Mauvais usage -->
"Notre vélocité a augmenté de 20 à 40, on est 2x plus productifs !"
(En réalité, on a juste gonflé les estimations)

<!-- ✅ Bon usage -->
"Notre vélocité est stable à 25 points, on peut donc prévoir 25 points pour le prochain sprint"
```

---

### Piège 2 : Daily standup qui dure 45 minutes

⚠️ **Problème** : Les discussions techniques s'éternisent pendant le standup.

✅ **Solution** : Noter les sujets et les traiter APRÈS le standup avec les personnes concernées.

---

### Piège 3 : Pas de rétrospective car "on n'a pas le temps"

⚠️ **Problème** : Sans rétrospective, les mêmes problèmes se répètent sprint après sprint.

✅ **Solution** : La rétrospective est NON NÉGOCIABLE. C'est le moment d'amélioration continue.

---

### Piège 4 : Le Product Owner absent

⚠️ **Problème** : L'équipe ne peut pas clarifier les User Stories et fait des suppositions.

✅ **Solution** : Le PO doit être disponible pendant le sprint. S'il ne peut pas, un proxy PO doit être désigné.

---

## Checklist de Validation

- [ ] Je comprends la différence entre Cascade et Agile
- [ ] Je connais les 3 rôles Scrum (PO, SM, Équipe)
- [ ] Je sais rédiger une User Story au format "En tant que... je veux... afin de..."
- [ ] Je connais les 4 rituels Scrum (Planning, Daily, Review, Rétro)
- [ ] Je sais estimer en points avec la suite de Fibonacci
- [ ] Je comprends le fonctionnement d'un tableau Kanban avec WIP
- [ ] Je sais animer une rétrospective Start/Stop/Continue

---

## Exercice Pratique

**Énoncé** : Tu dois organiser le premier sprint d'un projet de blog.

1. Rédige 5 User Stories pour les fonctionnalités de base d'un blog
2. Estime-les en points (1, 2, 3, 5, 8)
3. Crée un Sprint Backlog pour un sprint de 2 semaines (vélocité estimée : 15 points)
4. Dessine l'état du tableau Kanban après 3 jours de sprint

**Résultat attendu** : Un document Markdown d'environ 50 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

```markdown
# Sprint 1 - Projet Blog

## 1. Product Backlog (User Stories)

| ID | User Story | Points |
| -- | ---------- | ------ |
| US-001 | En tant que visiteur, je veux voir la liste des articles afin de parcourir le contenu | 3 |
| US-002 | En tant que visiteur, je veux lire un article complet afin de consulter son contenu | 2 |
| US-003 | En tant qu'admin, je veux créer un article afin de publier du contenu | 5 |
| US-004 | En tant qu'admin, je veux modifier un article afin de corriger des erreurs | 3 |
| US-005 | En tant qu'admin, je veux supprimer un article afin de retirer du contenu obsolète | 2 |

**Total : 15 points**

## 2. Sprint Backlog (Sprint 1)

| Élément | Valeur |
| ------- | ------ |
| Durée | 2 semaines |
| Vélocité prévue | 15 points |
| Objectif | Permettre de lire et gérer les articles du blog |

**User Stories sélectionnées** : US-001, US-002, US-003, US-004, US-005 (toutes)

## 3. Tableau Kanban - Jour 3

| À faire | En cours (2/3) | En revue (1/2) | Terminé |
| ------- | -------------- | -------------- | ------- |
| US-004 | US-003 [Dev 1] | US-001 | US-002 |
| US-005 | | | |

**Synthèse J3** :
- US-002 (lire article) : Terminé ✓
- US-001 (liste articles) : En revue, en attente de validation
- US-003 (créer article) : En cours, 50% fait
- US-004 et US-005 : Non commencés
```

---

## Navigation

→ Fiche suivante : **[02 - La Gestion d'Équipe](02-gestion-equipe.md)**
