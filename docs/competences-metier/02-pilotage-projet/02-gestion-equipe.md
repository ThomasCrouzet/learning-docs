---
tags:
  - Méthodologie
  - Débutant
  - Projet
description: "02 - La Gestion d'Équipe"
estimated_time: "25 min"
fiche_number: 2
total_fiches: 3
cursus: "Pilotage de projet"
id: "transversal.professional-skills.delivery.gestion-equipe"
course_id: "transversal.professional-skills"
module_id: "transversal.professional-skills.delivery"
content_type: "lesson"
order: 2
---

# 02 - La Gestion d'Équipe

> **En bref** : À la fin de cette fiche, tu sauras organiser et communiquer efficacement au sein d'une équipe projet, répartir les tâches selon les compétences, et adapter ta communication selon les situations et les personnes (y compris en situation de handicap). Lecture estimée : 25 min.


## Prérequis

- Fiche **[01 - Les Méthodologies Agiles](01-methodologies-agiles.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser et communiquer efficacement au sein d'une équipe projet, répartir les tâches selon les compétences, et adapter ta communication selon les situations et les personnes (y compris en situation de handicap).

---

## Concepts

### Qu'est-ce que la gestion d'équipe ?

**Définition** : La gestion d'équipe est l'ensemble des pratiques qui permettent de coordonner le travail de plusieurs personnes pour atteindre un objectif commun, en tenant compte des compétences, des disponibilités et des besoins de chacun.

**Le problème que la gestion d'équipe résout** :

Sans gestion d'équipe, voici les problèmes rencontrés :

1. **Travail en doublon** : Deux personnes font la même chose sans le savoir.
2. **Tâches orphelines** : Personne ne sait qui doit faire quoi.
3. **Conflits** : Tensions dues à des malentendus ou des injustices perçues.
4. **Démotivation** : L'équipe ne comprend pas l'objectif ou se sent ignorée.

**Comment la gestion d'équipe résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Travail en doublon | Attribution claire des responsabilités |
| Tâches orphelines | Planification et suivi rigoureux |
| Conflits | Communication régulière et transparente |
| Démotivation | Implication dans les décisions, reconnaissance |

**Analogie concrète** : Une équipe projet est comme un orchestre. Chaque musicien a son instrument (sa compétence), sa partition (ses tâches), et le chef d'orchestre (le chef de projet) s'assure que tout le monde joue au bon moment. Sans coordination, c'est la cacophonie.

---

### Qu'est-ce que la matrice RACI ?

**Définition** : RACI est un outil qui définit clairement les rôles et responsabilités pour chaque tâche d'un projet.

| Lettre | Signification | Rôle |
| ------ | ------------- | ---- |
| **R** | Responsible (Réalisateur) | Fait le travail |
| **A** | Accountable (Approbateur) | Valide et assume la responsabilité finale |
| **C** | Consulted (Consulté) | Donne son avis avant |
| **I** | Informed (Informé) | Est informé après |

**Règles** :

- Une seule personne **A** par tâche (un seul responsable final)
- Au moins une personne **R** par tâche (quelqu'un doit faire le travail)
- **C** et **I** peuvent être plusieurs personnes ou aucune

**Exemple** :

| Tâche | Dev 1 | Dev 2 | Tech Lead | Chef de projet | Client |
| ----- | ----- | ----- | --------- | -------------- | ------ |
| Développer la fonctionnalité X | R | | C | I | I |
| Valider le code | | R | A | I | |
| Déployer en production | R | | A | I | I |
| Accepter la livraison | | | I | R | A |

---

### Comment adapter la communication aux différents profils ?

**Définition** : Chaque personne a un style de communication préféré. Adapter son style améliore la compréhension et la collaboration.

**Les 4 styles principaux (modèle DISC simplifié)** :

| Style | Caractéristiques | Préfère | À éviter |
| ----- | ---------------- | ------- | -------- |
| **Directif** | Rapide, orienté résultats | Messages courts, décisions rapides | Trop de détails, hésitations |
| **Analytique** | Méthodique, orienté données | Faits, chiffres, preuves | Approximations, émotions |
| **Expressif** | Enthousiaste, orienté relations | Échanges, brainstorming | Formalisme excessif |
| **Aimable** | Patient, orienté harmonie | Consensus, écoute | Conflits, pression |

**Ce tableau n'est pas une classification rigide** : Une personne peut avoir plusieurs styles selon le contexte.

---

### Comment communiquer avec une personne en situation de handicap ?

**Définition** : Le handicap peut être visible (moteur, sensoriel) ou invisible (troubles cognitifs, autisme, dyslexie, troubles psychiques). L'objectif est de permettre à chacun de contribuer au projet.

**Principes généraux** :

| Principe | Application |
| -------- | ----------- |
| **Demander, ne pas supposer** | "Comment préfères-tu qu'on communique ?" |
| **Adapter, pas simplifier** | Ajuster le format, pas le contenu |
| **Respecter la confidentialité** | Ne pas divulguer le handicap sans accord |
| **Se concentrer sur les compétences** | Le handicap n'est pas le sujet principal |

**Adaptations possibles selon le type de handicap** :

| Situation | Adaptations possibles |
| --------- | --------------------- |
| Troubles de l'attention | Réunions courtes, instructions écrites, rappels |
| Autisme | Communication explicite, pas d'implicite, prévenir des changements |
| Dyslexie | Supports visuels, temps supplémentaire pour la lecture |
| Déficience auditive | Communication écrite, sous-titres en visio |
| Déficience visuelle | Descriptions vocales, documents accessibles (contraste, taille) |
| Troubles anxieux | Environnement prévisible, éviter les surprises |

**Important** : Chaque personne est différente. Ces adaptations sont des pistes, pas des règles absolues. Demande toujours à la personne concernée ce qui lui convient.

---

## Étapes Pratiques

### Étape 1 : Cartographier les compétences de l'équipe

Avant de répartir les tâches, identifie les compétences de chaque membre :

```markdown
## Matrice de compétences

### Niveaux

| Niveau | Signification |
| ------ | ------------- |
| 0 | Pas de connaissance |
| 1 | Notions de base |
| 2 | Pratique autonome |
| 3 | Expert / peut former |

### Équipe projet

| Compétence | Alice | Bob | Charlie | Diana |
| ---------- | ----- | --- | ------- | ----- |
| PHP/Symfony | 3 | 2 | 1 | 0 |
| JavaScript | 1 | 3 | 2 | 1 |
| PostgreSQL | 2 | 1 | 3 | 2 |
| Docker | 2 | 2 | 2 | 3 |
| Tests unitaires | 3 | 1 | 2 | 2 |
| UX/Design | 0 | 1 | 0 | 3 |

### Analyse

- **Alice** : Référente PHP et tests, peut monter en compétence sur JS
- **Bob** : Référent JavaScript, à former sur les tests
- **Charlie** : Référent PostgreSQL, profil fullstack
- **Diana** : Référente Docker et UX, profil DevOps/Design
```

---

### Étape 2 : Créer une matrice RACI pour le projet

Définis qui fait quoi pour chaque grande tâche :

```markdown
## Matrice RACI - Projet Blog

| Tâche | Alice | Bob | Charlie | Diana | Tech Lead | Client |
| ----- | ----- | --- | ------- | ----- | --------- | ------ |
| Architecture technique | C | C | C | C | A/R | I |
| Développement backend | R | | C | | A | I |
| Développement frontend | | R | | C | A | I |
| Base de données | C | | R | | A | I |
| Design UI | | C | | R | A | C |
| Tests automatisés | R | R | R | R | A | I |
| Déploiement | C | | C | R | A | I |
| Documentation | R | R | R | R | A | C |
| Recette finale | I | I | I | I | R | A |

### Légende
- R = Réalise
- A = Approuve (responsable final)
- C = Consulté
- I = Informé
```

---

### Étape 3 : Organiser une réunion de lancement (Kick-off)

Le kick-off aligne toute l'équipe sur les objectifs et les règles :

```markdown
## Ordre du jour - Réunion de lancement

### 1. Présentation du projet (15 min)
- Contexte et objectifs
- Périmètre (ce qui est inclus / exclu)
- Planning global

### 2. Présentation de l'équipe (10 min)
- Tour de table : nom, rôle, compétences principales
- Points de contact et disponibilités

### 3. Organisation du travail (20 min)
- Méthodologie choisie (Scrum, Kanban)
- Outils utilisés (GitLab, Slack, etc.)
- Rituels et horaires

### 4. Règles de fonctionnement (15 min)
- Communication : quels canaux pour quoi
- Gestion des conflits
- Critères de qualité (code review, tests)

### 5. Questions / Clarifications (15 min)

### 6. Prochaines étapes (5 min)
- Actions immédiates
- Date du prochain point
```

**Règles de fonctionnement type** :

```markdown
## Charte d'équipe

### Communication

| Sujet | Canal | Délai de réponse attendu |
| ----- | ----- | ------------------------ |
| Urgence / blocage | Téléphone | Immédiat |
| Question rapide | Slack | < 2h |
| Discussion technique | GitLab Issue | < 24h |
| Information générale | Email | < 48h |

### Réunions

| Réunion | Fréquence | Durée max | Obligatoire |
| ------- | --------- | --------- | ----------- |
| Daily standup | Quotidien 9h30 | 15 min | Oui |
| Point technique | Mercredi 14h | 1h | Oui |
| Rétrospective | Fin de sprint | 1h | Oui |

### Code

- Toute modification passe par une Merge Request
- Minimum 1 approbation avant merge
- Tests obligatoires pour toute nouvelle fonctionnalité
- Pas de merge le vendredi après 16h
```

---

### Étape 4 : Répartir les tâches équitablement

Utilise la matrice de compétences et la charge de travail :

```markdown
## Répartition Sprint 1

### Charge disponible par personne

| Personne | Disponibilité | Jours disponibles (2 sem) |
| -------- | ------------- | ------------------------- |
| Alice | 100% | 10 jours |
| Bob | 80% | 8 jours |
| Charlie | 100% | 10 jours |
| Diana | 50% | 5 jours |

### Attribution des User Stories

| User Story | Estimation | Attribuée à | Justification |
| ---------- | ---------- | ----------- | ------------- |
| US-001 Backend API | 3 jours | Alice | Experte PHP |
| US-002 Frontend liste | 2 jours | Bob | Expert JS |
| US-003 Modèle BDD | 2 jours | Charlie | Expert PostgreSQL |
| US-004 Design pages | 3 jours | Diana | Experte UX |
| US-005 Tests API | 2 jours | Alice | Experte tests |
| US-006 Déploiement | 1 jour | Diana | Experte Docker |

### Vérification de charge

| Personne | Charge attribuée | Capacité | État |
| -------- | ---------------- | -------- | ---- |
| Alice | 5 jours | 10 jours | ✅ OK |
| Bob | 2 jours | 8 jours | ✅ OK (peut aider) |
| Charlie | 2 jours | 10 jours | ✅ OK (peut aider) |
| Diana | 4 jours | 5 jours | ✅ OK |
```

---

### Étape 5 : Gérer un conflit

Les conflits sont normaux dans une équipe. Voici une méthode de résolution :

```markdown
## Processus de résolution de conflit

### Étape 1 : Identifier le conflit

| Question | Réponse à documenter |
| -------- | -------------------- |
| Qui est impliqué ? | [Noms] |
| Quel est le sujet ? | [Description factuelle] |
| Depuis quand ? | [Date] |
| Impact sur le projet ? | [Conséquences] |

### Étape 2 : Écouter chaque partie (séparément)

Poser les questions :
- "Que s'est-il passé selon toi ?" (faits)
- "Comment te sens-tu ?" (émotions)
- "Qu'est-ce qui serait une solution acceptable pour toi ?" (besoins)

### Étape 3 : Réunion de médiation

1. Rappeler les règles : respect mutuel, écoute, focus sur les solutions
2. Chaque partie expose sa vision sans interruption
3. Identifier les points d'accord
4. Chercher une solution ensemble
5. Formaliser l'accord par écrit

### Étape 4 : Suivi

- Point de suivi à J+7
- Ajuster si nécessaire
```

---

## Commandes Utiles

Cette fiche ne contient pas de commandes techniques.

---

## Pièges Fréquents

### Piège 1 : Ne pas clarifier les responsabilités dès le début

⚠️ **Problème** : "Je pensais que c'était toi qui le faisais" - phrase entendue trop tard.

✅ **Solution** : Créer la matrice RACI au kick-off et la revoir à chaque sprint.

---

### Piège 2 : Surcharger les experts

⚠️ **Problème** : L'expert PHP fait tout le PHP, pendant que les autres attendent.

✅ **Solution** : Binômage (pair programming) pour transférer les compétences.

```markdown
<!-- ❌ Mauvaise répartition -->
Alice (expert PHP) : 15 jours de tâches PHP
Bob (junior PHP) : 2 jours de tâches JS

<!-- ✅ Bonne répartition avec montée en compétence -->
Alice + Bob en binôme : 8 jours de tâches PHP (Bob monte en compétence)
Alice seule : 5 jours de tâches PHP complexes
Bob seul : 2 jours de tâches JS + 2 jours PHP (tâches simples)
```

---

### Piège 3 : Communiquer uniquement par écrit avec tout le monde

⚠️ **Problème** : Un email de 3 paragraphes pour une question qui se résout en 2 minutes à l'oral.

✅ **Solution** : Adapter le canal au message.

| Situation | Canal adapté |
| --------- | ------------ |
| Question complexe | Appel ou visio |
| Question simple | Chat |
| Décision importante | Email (trace écrite) |
| Blocage urgent | Téléphone |

---

### Piège 4 : Ignorer les signaux de mal-être

⚠️ **Problème** : Un membre devient silencieux, s'isole, fait des erreurs inhabituelles.

✅ **Solution** : Point individuel privé pour prendre des nouvelles (pas devant l'équipe).

---

## Checklist de Validation

- [ ] Je sais créer une matrice de compétences
- [ ] Je comprends et sais utiliser une matrice RACI
- [ ] Je sais organiser une réunion de kick-off
- [ ] Je sais répartir les tâches en fonction des compétences et de la charge
- [ ] Je connais les différents styles de communication
- [ ] Je sais adapter ma communication à une personne en situation de handicap
- [ ] Je connais un processus de résolution de conflit

---

## Exercice Pratique

**Énoncé** : Tu dois constituer et organiser une équipe de 4 personnes pour un projet de 3 mois.

1. Crée une matrice de compétences pour 4 membres fictifs
2. Crée une matrice RACI pour 5 tâches principales
3. Rédige 3 règles de fonctionnement pour la charte d'équipe
4. Décris comment tu adapterais ta communication pour un membre dyslexique

**Résultat attendu** : Un document Markdown d'environ 60 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

```markdown
# Organisation équipe - Projet E-commerce

## 1. Matrice de compétences

| Compétence | Emma | Fabien | Gina | Hugo |
| ---------- | ---- | ------ | ---- | ---- |
| PHP/Symfony | 3 | 2 | 1 | 1 |
| React | 1 | 3 | 2 | 2 |
| PostgreSQL | 2 | 1 | 3 | 1 |
| Docker/DevOps | 1 | 1 | 2 | 3 |
| Tests | 2 | 2 | 2 | 2 |
| Gestion de projet | 2 | 1 | 1 | 1 |

**Analyse** : Emma = Tech Lead / Backend, Fabien = Frontend, Gina = BDD, Hugo = DevOps

## 2. Matrice RACI

| Tâche | Emma | Fabien | Gina | Hugo | Client |
| ----- | ---- | ------ | ---- | ---- | ------ |
| Architecture | A/R | C | C | C | I |
| Développement backend | R | | C | | I |
| Développement frontend | C | R | | | I |
| Base de données | C | | R | | I |
| Déploiement | I | | | R | I |

## 3. Charte d'équipe (extraits)

### Règle 1 : Communication
- Questions urgentes : Slack avec @mention
- Questions non urgentes : GitLab Issue
- Délai de réponse sur Slack : 2h max en journée

### Règle 2 : Code Review
- Toute MR doit avoir 1 approbation minimum
- Délai max de review : 24h
- Si blocage, demander en standup

### Règle 3 : Disponibilité
- Plage de disponibilité commune : 10h-12h et 14h-17h
- Daily standup obligatoire sauf congés
- Prévenir l'équipe 24h avant toute absence

## 4. Adaptation pour membre dyslexique

Pour Gina qui a une dyslexie :

| Adaptation | Mise en oeuvre |
| ---------- | -------------- |
| Instructions écrites | Bullet points, phrases courtes, pas de pavés de texte |
| Documentation | Police sans-serif (Arial), taille 14, interligne 1.5 |
| Réunions | Compte-rendu écrit envoyé après, pas de lecture à voix haute forcée |
| Délais | Temps supplémentaire pour relecture de docs longs |
| Code review | Feedback oral en plus des commentaires écrits |

**Communication directe** : "Gina, est-ce que ce format te convient ? Dis-moi si tu préfères qu'on adapte quelque chose."
```

---

## Navigation

← Fiche précédente : **[01 - Les Méthodologies Agiles](01-methodologies-agiles.md)**

→ Fiche suivante : **[03 - La Roadmap et Planification](03-roadmap-planification.md)**
