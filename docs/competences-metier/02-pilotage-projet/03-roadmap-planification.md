---
tags:
  - Méthodologie
  - Débutant
  - Projet
description: "03 - La Roadmap et Planification"
estimated_time: "25 min"
fiche_number: 3
total_fiches: 3
cursus: "Pilotage de projet"
id: "transversal.professional-skills.delivery.roadmap-planification"
course_id: "transversal.professional-skills"
module_id: "transversal.professional-skills.delivery"
content_type: "lesson"
order: 3
---

# 03 - La Roadmap et Planification

> **En bref** : À la fin de cette fiche, tu sauras créer une roadmap projet, définir des jalons, planifier les livrables, et argumenter tes décisions techniques auprès des parties prenantes. Lecture estimée : 25 min.


## Prérequis

- Fiche **[01 - Les Méthodologies Agiles](01-methodologies-agiles.md)**
- Fiche **[02 - La Gestion d'Équipe](02-gestion-equipe.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une roadmap projet, définir des jalons, planifier les livrables, et argumenter tes décisions techniques auprès des parties prenantes.

---

## Concepts

### Qu'est-ce qu'une roadmap ?

**Définition** : Une roadmap (feuille de route) est une représentation visuelle et chronologique des grandes étapes d'un projet, montrant ce qui sera livré et quand.

**Le problème que la roadmap résout** :

Sans roadmap, voici les problèmes rencontrés :

1. **Absence de vision** : L'équipe ne sait pas où le projet va à moyen terme.
2. **Priorités floues** : On ne sait pas ce qui doit être fait en premier.
3. **Communication difficile** : Impossible d'expliquer clairement l'avancement aux parties prenantes.
4. **Attentes mal gérées** : Le client attend tout pour demain.

**Comment la roadmap résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Absence de vision | Vue d'ensemble sur plusieurs mois |
| Priorités floues | Ordre chronologique des fonctionnalités |
| Communication difficile | Support visuel clair pour les présentations |
| Attentes mal gérées | Engagements réalistes et datés |

**Analogie concrète** : Une roadmap est comme le programme d'un voyage organisé. Tu sais que le Jour 1 tu visites Paris, le Jour 3 Lyon, et le Jour 5 Marseille. Tu ne connais pas tous les détails de chaque visite, mais tu as une vue d'ensemble du parcours.

**Ce qu'une roadmap n'est PAS** :

- Une roadmap n'est pas un planning détaillé. Elle montre les grandes étapes, pas les tâches quotidiennes.
- Une roadmap n'est pas un engagement contractuel figé. Elle évolue au fil du projet.

---

### Qu'est-ce qu'un jalon (milestone) ?

**Définition** : Un jalon est un événement significatif dans le projet qui marque la fin d'une phase ou la livraison d'un élément important. Un jalon n'a pas de durée : c'est un point dans le temps.

**Exemples de jalons** :

| Jalon | Ce qu'il marque |
| ----- | --------------- |
| Kick-off | Début officiel du projet |
| MVP livré | Première version utilisable |
| Recette validée | Tests terminés et acceptés |
| Go Live | Mise en production |
| Clôture | Fin du projet |

**Différence jalon vs livrable** :

| Jalon | Livrable |
| ----- | -------- |
| Événement ponctuel | Produit concret |
| "Recette terminée" | "Application testée" |
| Date | Chose à fournir |

---

### Comment argumenter une décision technique ?

**Définition** : Argumenter une décision technique, c'est expliquer clairement pourquoi tu as choisi une solution plutôt qu'une autre, avec des critères objectifs.

**Structure d'une argumentation** :

| Élément | Description |
| ------- | ----------- |
| **Contexte** | La situation et le problème à résoudre |
| **Options** | Les différentes solutions possibles |
| **Critères** | Les facteurs de décision (coût, temps, risque, etc.) |
| **Analyse** | Comparaison des options selon les critères |
| **Recommandation** | Le choix et sa justification |

**Exemple** :

> **Contexte** : Nous devons choisir une base de données pour le projet.
>
> **Options** : MySQL, PostgreSQL, MongoDB
>
> **Critères** : Performance, coût, maîtrise équipe, fonctionnalités requises
>
> **Analyse** : PostgreSQL offre les fonctionnalités géographiques requises, est maîtrisé par l'équipe, et est gratuit.
>
> **Recommandation** : PostgreSQL est le meilleur choix car il répond à tous nos critères.

---

## Étapes Pratiques

### Étape 1 : Définir les phases du projet

Découpe le projet en grandes phases logiques :

```markdown
## Phases du projet

| Phase | Nom | Description | Durée estimée |
| ----- | --- | ----------- | ------------- |
| 1 | Cadrage | Spécifications, architecture, environnement | 2 semaines |
| 2 | Développement MVP | Fonctionnalités essentielles | 6 semaines |
| 3 | Développement complet | Fonctionnalités secondaires | 4 semaines |
| 4 | Recette | Tests, corrections, optimisations | 2 semaines |
| 5 | Déploiement | Mise en production, formation | 1 semaine |
| 6 | Garantie | Support post-production | 4 semaines |

**Total : 19 semaines (~5 mois)**
```

---

### Étape 2 : Créer la roadmap visuelle

Représente les phases sur une ligne de temps :

````markdown
## Roadmap - Projet Blog

### Vue trimestrielle

```text
        Janvier          Février           Mars             Avril
        S1  S2  S3  S4   S5  S6  S7  S8   S9  S10 S11 S12  S13 S14 S15 S16
        ─────────────────────────────────────────────────────────────────
Phase 1 ████████                                                    Cadrage
Phase 2         ████████████████████████                            MVP
Phase 3                                 ████████████████            Complet
Phase 4                                                 ████████    Recette
Phase 5                                                         ██  Go Live

Jalons:
  ▼ S1  : Kick-off
  ▼ S4  : Architecture validée
  ▼ S8  : MVP livré
  ▼ S12 : Fonctionnalités complètes
  ▼ S14 : Recette validée
  ▼ S15 : Go Live
```

### Format tableau

| Mois | Semaines | Phase | Jalon | Livrable |
| ---- | -------- | ----- | ----- | -------- |
| Janvier | S1-S2 | Cadrage | Kick-off (S1) | Cahier des charges |
| Janvier | S3-S4 | Cadrage | Archi validée (S4) | Document d'architecture |
| Février | S5-S8 | MVP | MVP livré (S8) | Application fonctionnelle de base |
| Mars | S9-S12 | Complet | Features complètes (S12) | Application complète |
| Avril | S13-S14 | Recette | Recette validée (S14) | PV de recette signé |
| Avril | S15 | Go Live | Production (S15) | Application en ligne |

````

---

### Étape 3 : Définir les livrables par jalon

Chaque jalon doit avoir des livrables concrets et des critères d'acceptation :

```markdown
## Livrables par jalon

### Jalon 1 : Kick-off (S1)

| Livrable | Format | Critère d'acceptation |
| -------- | ------ | --------------------- |
| Compte-rendu kick-off | PDF | Signé par toutes les parties |
| Charte projet | Markdown | Validée par l'équipe |
| Accès outils | - | Tous les membres ont accès à Git, Slack, etc. |

### Jalon 2 : Architecture validée (S4)

| Livrable | Format | Critère d'acceptation |
| -------- | ------ | --------------------- |
| Document d'architecture | Markdown | Validé par Tech Lead et Client |
| Environnement de dev | Docker | Tous les devs peuvent lancer le projet |
| Backlog initial | GitLab | User Stories priorisées |

### Jalon 3 : MVP livré (S8)

| Livrable | Format | Critère d'acceptation |
| -------- | ------ | --------------------- |
| Application MVP | Code déployé | Fonctionnalités core opérationnelles |
| Documentation technique | Markdown | Installation en < 30 min |
| Tests automatisés | PHPUnit | Couverture > 60% |

### Jalon 4 : Go Live (S15)

| Livrable | Format | Critère d'acceptation |
| -------- | ------ | --------------------- |
| Application production | URL live | 0 bug bloquant |
| Documentation utilisateur | PDF | Validée par le client |
| Formation | Session | Tous les utilisateurs formés |
| PV de recette | PDF | Signé |
```

---

### Étape 4 : Planifier avec des marges réalistes

Les projets IT dépassent souvent les estimations. Prévois des marges :

```markdown
## Estimation avec marges

### Calcul de la marge

| Type de tâche | Marge recommandée |
| ------------- | ----------------- |
| Tâche maîtrisée | +20% |
| Tâche nouvelle mais documentée | +50% |
| Tâche avec incertitude technique | +100% |
| Intégration système externe | +100% |

### Application au projet

| Phase | Estimation brute | Type | Marge | Estimation finale |
| ----- | ---------------- | ---- | ----- | ----------------- |
| Cadrage | 1.5 sem | Maîtrisé | +20% | 2 sem |
| MVP | 4 sem | Mixte | +50% | 6 sem |
| Complet | 3 sem | Nouvelle techno | +50% | 4.5 sem → 5 sem |
| Recette | 1.5 sem | Maîtrisé | +20% | 2 sem |
| Déploiement | 0.5 sem | Maîtrisé | +20% | 1 sem |

### Buffer projet

En plus des marges par tâche, prévoir un buffer global :
- **Buffer projet** : 10% de la durée totale
- **Total brut** : 15 semaines
- **Buffer** : 1.5 semaines
- **Total avec buffer** : 16.5 semaines → **17 semaines**
```

---

### Étape 5 : Argumenter une décision technique (template)

Utilise ce format pour documenter et présenter tes choix :

```markdown
## Note de décision technique

### Informations

| Élément | Valeur |
| ------- | ------ |
| Sujet | Choix du framework frontend |
| Date | 15/01/2024 |
| Décideur | Tech Lead |
| Statut | Validé |

### Contexte

Le projet nécessite un frontend interactif avec des formulaires complexes.
L'équipe a une expérience variable en JavaScript.
Le backend est en Symfony.

### Options évaluées

| Option | Description |
| ------ | ----------- |
| A - React | Bibliothèque populaire, composants réutilisables |
| B - Vue.js | Framework progressif, syntaxe simple |
| C - Twig + jQuery | Technologie native Symfony, simple |

### Critères d'évaluation

| Critère | Poids | Description |
| ------- | ----- | ----------- |
| Maîtrise équipe | 30% | Compétences existantes |
| Performance | 20% | Rapidité, réactivité |
| Intégration Symfony | 25% | Facilité d'intégration |
| Maintenabilité | 25% | Facilité de maintenance future |

### Analyse comparative

| Critère | React | Vue.js | Twig+jQuery |
| ------- | ----- | ------ | ----------- |
| Maîtrise équipe | 2/5 | 3/5 | 5/5 |
| Performance | 5/5 | 5/5 | 3/5 |
| Intégration Symfony | 3/5 | 4/5 | 5/5 |
| Maintenabilité | 4/5 | 4/5 | 2/5 |

### Calcul pondéré

| Option | Score |
| ------ | ----- |
| React | 2×0.3 + 5×0.2 + 3×0.25 + 4×0.25 = 3.35 |
| Vue.js | 3×0.3 + 5×0.2 + 4×0.25 + 4×0.25 = 3.9 |
| Twig+jQuery | 5×0.3 + 3×0.2 + 5×0.25 + 2×0.25 = 3.85 |

### Recommandation

**Choix : Vue.js**

**Justification** :
1. Meilleur score global (3.9)
2. Bon compromis entre maîtrise équipe et performance
3. Syntaxe accessible pour l'équipe qui monte en compétence
4. Intégration Symfony facilitée par des bundles existants

### Risques et mitigations

| Risque | Probabilité | Mitigation |
| ------ | ----------- | ---------- |
| Courbe d'apprentissage | Moyenne | Formation de 2 jours prévue |
| Complexité build | Basse | Utilisation de Webpack Encore |

### Validation

| Partie prenante | Validation | Date |
| --------------- | ---------- | ---- |
| Tech Lead | ✅ | 15/01 |
| Chef de projet | ✅ | 16/01 |
| Client | ✅ | 18/01 |
```

---

### Étape 6 : Communiquer la roadmap aux parties prenantes

Adapte le niveau de détail selon l'audience :

```markdown
## Roadmap - Versions selon l'audience

### Version Direction (résumé exécutif)

| Trimestre | Livraison | Budget consommé |
| --------- | --------- | --------------- |
| T1 | MVP opérationnel | 40% |
| T2 | Application complète en production | 100% |

### Version Client (jalons et fonctionnalités)

| Date | Ce qui sera livré | Ce que vous pourrez faire |
| ---- | ----------------- | ------------------------- |
| 28/02 | MVP | Créer et consulter des articles |
| 31/03 | Version complète | Gérer les utilisateurs, statistiques |
| 15/04 | Production | Utilisation réelle |

### Version Équipe (détail technique)

[Roadmap complète avec sprints, User Stories, dépendances techniques]
```

---

## Commandes Utiles

Cette fiche ne contient pas de commandes techniques.

**Outils de roadmap** :

| Outil | Type | Adapté pour |
| ----- | ---- | ----------- |
| Notion | SaaS | Roadmaps simples, équipes réduites |
| Miro | SaaS | Roadmaps visuelles collaboratives |
| GitLab Milestones | SaaS/Self | Roadmaps liées aux issues |
| Mermaid (Markdown) | Code | Diagrammes de Gantt en texte |
| Excel/Sheets | Tableur | Roadmaps tabulaires |

---

## Pièges Fréquents

### Piège 1 : Roadmap trop détaillée

⚠️ **Problème** : Une roadmap avec des tâches quotidiennes devient illisible et obsolète immédiatement.

✅ **Solution** : Rester au niveau des phases et jalons. Le détail est dans le backlog.

---

### Piège 2 : Roadmap figée

⚠️ **Problème** : La roadmap créée en début de projet n'est jamais mise à jour.

✅ **Solution** : Revoir la roadmap à chaque fin de phase ou mensuellement.

---

### Piège 3 : Pas de marge dans le planning

⚠️ **Problème** : Planning "au plus juste" qui explose au premier imprévu.

✅ **Solution** : Toujours prévoir 20-50% de marge selon l'incertitude.

---

### Piège 4 : Décision technique non documentée

⚠️ **Problème** : 6 mois plus tard, personne ne sait pourquoi on a choisi cette technologie.

✅ **Solution** : Documenter systématiquement les décisions importantes (ADR - Architecture Decision Record).

---

## Checklist de Validation

- [ ] Je sais créer une roadmap avec des phases et des jalons
- [ ] Je sais définir des livrables avec des critères d'acceptation
- [ ] Je comprends l'importance des marges dans la planification
- [ ] Je sais argumenter une décision technique avec des critères objectifs
- [ ] Je sais adapter la communication de la roadmap selon l'audience
- [ ] Je connais les outils de création de roadmap

---

## Exercice Pratique

**Énoncé** : Tu dois planifier un projet de 4 mois pour créer une application de réservation de salles de réunion.

1. Définis 4 phases avec leurs durées
2. Place 5 jalons sur une roadmap
3. Liste 3 livrables pour le jalon "MVP"
4. Rédige une note de décision pour le choix entre une API REST et GraphQL

**Résultat attendu** : Un document Markdown d'environ 70-90 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible.

---

### 1. Phases du projet

| Phase | Nom | Durée | Semaines |
| ----- | --- | ----- | -------- |
| 1 | Cadrage & Design | 3 semaines | S1-S3 |
| 2 | Développement MVP | 6 semaines | S4-S9 |
| 3 | Fonctionnalités avancées | 4 semaines | S10-S13 |
| 4 | Recette & Déploiement | 3 semaines | S14-S16 |

**Total : 16 semaines (4 mois)**

---

### 2. Roadmap avec jalons

```text
       Mois 1        Mois 2        Mois 3        Mois 4
       S1 S2 S3 S4   S5 S6 S7 S8   S9 S10 S11 S12 S13 S14 S15 S16
       ─────────────────────────────────────────────────────────
       ████████████                                         Cadrage
                   ████████████████████████                 MVP
                                           ████████████     Avancé
                                                       ████ Recette
Jalons:
▼ S1  : Kick-off
▼ S3  : Spécifications validées
▼ S9  : MVP livré
▼ S13 : Application complète
▼ S16 : Go Live
```

---

### 3. Livrables du jalon "MVP livré" (S9)

| Livrable | Format | Critère d'acceptation |
| -------- | ------ | --------------------- |
| API de réservation | Code déployé | CRUD salles et réservations fonctionnel |
| Interface de réservation | Web app | Un utilisateur peut réserver une salle |
| Tests automatisés | PHPUnit | Couverture > 50%, 0 test en échec |

---

### 4. Note de décision : REST vs GraphQL

**Contexte** : L'application doit exposer une API pour le frontend web et une future app mobile. L'équipe a de l'expérience en REST, aucune en GraphQL.

**Options** :

| Option | Description |
| ------ | ----------- |
| REST | API classique avec endpoints fixes |
| GraphQL | Requêtes flexibles, un seul endpoint |

**Critères et analyse** :

| Critère | Poids | REST | GraphQL |
| ------- | ----- | ---- | ------- |
| Maîtrise équipe | 40% | 5/5 | 1/5 |
| Flexibilité requêtes | 20% | 3/5 | 5/5 |
| Simplicité implémentation | 25% | 4/5 | 2/5 |
| Documentation auto | 15% | 4/5 | 4/5 |

**Scores** :

- REST : 5x0.4 + 3x0.2 + 4x0.25 + 4x0.15 = 4.2
- GraphQL : 1x0.4 + 5x0.2 + 2x0.25 + 4x0.15 = 2.5

**Recommandation : API REST**

- Score nettement supérieur (4.2 vs 2.5)
- Équipe opérationnelle immédiatement
- Besoins en flexibilité couverts par REST + filtres
- Courbe d'apprentissage GraphQL non justifiée pour ce projet

**Risques** :

| Risque | Mitigation |
| ------ | ---------- |
| Sous-fetching/Over-fetching | Endpoints bien conçus, utilisation de sparse fieldsets |

---

## Navigation

← Fiche précédente : **[02 - La Gestion d'Équipe](02-gestion-equipe.md)**
