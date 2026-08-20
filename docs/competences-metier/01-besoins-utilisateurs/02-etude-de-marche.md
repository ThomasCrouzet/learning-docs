---
tags:
  - Méthodologie
  - Débutant
  - Pratique
description: "02 - L'Étude de Marché et Veille Technologique"
estimated_time: "25 min"
fiche_number: 2
total_fiches: 3
cursus: "Besoins utilisateurs"
---

# 02 - L'Étude de Marché et Veille Technologique

> **En bref** : À la fin de cette fiche, tu sauras réaliser une étude de marché pour un projet informatique, effectuer une veille technologique, et analyser la concurrence de manière méthodique. Lecture estimée : 25 min.


## Prérequis

- Fiche **[01 - Le Cahier des Charges Technique](01-cahier-des-charges.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras réaliser une étude de marché pour un projet informatique, effectuer une veille technologique, et analyser la concurrence de manière méthodique.

---

## Concepts

### Qu'est-ce qu'une étude de marché en informatique ?

**Définition** : Une étude de marché est une analyse structurée qui permet de comprendre l'environnement d'un projet : qui sont les concurrents, quelles technologies existent, quels sont les besoins des utilisateurs, et si le projet est viable.

**Le problème que l'étude de marché résout** :

Sans étude de marché, voici les problèmes rencontrés :

1. **Réinventer la roue** : Tu développes une fonctionnalité qui existe déjà ailleurs, en mieux.
2. **Ignorer la concurrence** : Tu ne sais pas comment te différencier.
3. **Mauvais choix techniques** : Tu choisis une technologie obsolète ou inadaptée.
4. **Échec commercial** : Tu crées un produit dont personne ne veut.

**Comment l'étude de marché résout ces problèmes** :

| Problème | Solution apportée par l'étude de marché |
| -------- | --------------------------------------- |
| Réinventer la roue | Identifier les solutions existantes et s'en inspirer |
| Ignorer la concurrence | Analyser les forces/faiblesses des concurrents |
| Mauvais choix techniques | Comparer les technologies disponibles |
| Échec commercial | Valider le besoin avant de développer |

**Analogie concrète** : Imagine que tu veux ouvrir une pizzeria. Avant d'investir, tu vas regarder combien de pizzerias existent déjà dans le quartier, ce qu'elles proposent, leurs prix, et ce que les habitants aimeraient avoir. L'étude de marché, c'est cette recherche préalable appliquée à un projet informatique.

**Ce qu'une étude de marché n'est PAS** :

- Une étude de marché n'est pas un document commercial. Elle est objective, pas promotionnelle.
- Une étude de marché n'est pas une formalité. Ses conclusions doivent réellement influencer les décisions.

---

### Qu'est-ce que la veille technologique ?

**Définition** : La veille technologique est une activité de surveillance continue des évolutions techniques (nouveaux langages, frameworks, outils, bonnes pratiques) dans un domaine donné.

**Le problème que la veille technologique résout** :

Sans veille technologique, voici les problèmes rencontrés :

1. **Technologies obsolètes** : Tu utilises des outils dépassés sans le savoir.
2. **Failles de sécurité** : Tu n'es pas au courant des vulnérabilités découvertes.
3. **Perte de compétitivité** : Tes concurrents utilisent des outils plus efficaces.

**Comment la veille technologique résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Technologies obsolètes | Tu identifies les tendances et les migrations |
| Failles de sécurité | Tu suis les alertes de sécurité (CVE) |
| Perte de compétitivité | Tu connais les nouvelles possibilités |

**Analogie concrète** : La veille technologique est comme lire le journal pour un médecin. Un médecin doit se tenir au courant des nouveaux traitements, des nouvelles maladies, des études récentes. Un développeur doit se tenir au courant des nouveaux frameworks, des failles découvertes, des bonnes pratiques qui évoluent.

---

### Qu'est-ce que l'analyse SWOT ?

**Définition** : SWOT est un acronyme anglais pour Strengths (Forces), Weaknesses (Faiblesses), Opportunities (Opportunités), Threats (Menaces). C'est un outil d'analyse stratégique.

**Structure du SWOT** :

| | Positif | Négatif |
| --- | ------- | ------- |
| **Interne** (ton projet) | Forces | Faiblesses |
| **Externe** (environnement) | Opportunités | Menaces |

**Analogie concrète** : Imagine que tu prépares un match de football.

- **Forces** : Tes joueurs sont rapides
- **Faiblesses** : Tu n'as pas de gardien expérimenté
- **Opportunités** : L'équipe adverse a deux joueurs blessés
- **Menaces** : Il va pleuvoir et ton équipe joue mal sur terrain mouillé

L'analyse SWOT te permet de voir clairement ta situation avant de définir ta stratégie.

---

## Étapes Pratiques

### Étape 1 : Identifier les concurrents directs et indirects

**Concurrents directs** : Solutions qui font exactement la même chose que ton projet.
**Concurrents indirects** : Solutions qui répondent au même besoin d'une autre manière.

Crée un tableau pour lister les concurrents :

```markdown
## Analyse de la concurrence

### Concurrents directs

| Nom | URL | Description | Points forts | Points faibles |
| --- | --- | ----------- | ------------ | -------------- |
| [Concurrent 1] | [URL] | [Description courte] | [3 points] | [3 points] |
| [Concurrent 2] | [URL] | [Description courte] | [3 points] | [3 points] |

### Concurrents indirects

| Nom | Type | Comment il répond au besoin |
| --- | ---- | --------------------------- |
| [Solution alternative] | [Type] | [Explication] |
```

**Exemple concret** : Pour un projet de gestion de tâches :

```markdown
### Concurrents directs

| Nom | URL | Description | Points forts | Points faibles |
| --- | --- | ----------- | ------------ | -------------- |
| Trello | trello.com | Gestion de tâches en colonnes Kanban | Interface intuitive, Gratuit pour petites équipes | Limité pour projets complexes, Pas de Gantt |
| Asana | asana.com | Gestion de projets complète | Fonctionnalités avancées, Vues multiples, Automatisations | Prix élevé, Courbe d'apprentissage, Complexe pour petits projets |

### Concurrents indirects

| Nom | Type | Comment il répond au besoin |
| --- | ---- | --------------------------- |
| Fichiers Excel | Tableur | Listes de tâches manuelles, filtres, partage de fichier |
| Post-it physiques | Analogique | Tableau Kanban physique dans le bureau |
| Notes iPhone/Android | Application mobile | Listes de tâches simples intégrées au téléphone |
```

---

### Étape 2 : Comparer les fonctionnalités

Crée une matrice de fonctionnalités pour comparer objectivement les solutions :

```markdown
## Matrice de fonctionnalités

| Fonctionnalité | Mon projet | Concurrent 1 | Concurrent 2 | Concurrent 3 |
| -------------- | ---------- | ------------ | ------------ | ------------ |
| Création de tâches | ✅ | ✅ | ✅ | ✅ |
| Sous-tâches | ✅ | ❌ | ✅ | ✅ |
| Vue Kanban | ✅ | ✅ | ✅ | ❌ |
| Vue Gantt | ✅ | ❌ | ✅ | ✅ |
| Mode hors-ligne | ✅ | ❌ | ❌ | ❌ |
| Auto-hébergement | ✅ | ❌ | ❌ | ❌ |
| API publique | ✅ | ✅ | ✅ | ❌ |
| Prix (équipe 10 pers.) | Gratuit | 100€/mois | 150€/mois | 80€/mois |

### Légende
- ✅ = Disponible
- ❌ = Non disponible
- 🔶 = Partiellement disponible ou en option payante
```

---

### Étape 3 : Réaliser une analyse SWOT

Synthétise tes recherches dans une matrice SWOT :

```markdown
## Analyse SWOT du projet

### Forces (Strengths) - Interne, Positif

Ce que ton projet fait bien :

- [Force 1] : Description
- [Force 2] : Description
- [Force 3] : Description

### Faiblesses (Weaknesses) - Interne, Négatif

Ce que ton projet fait moins bien :

- [Faiblesse 1] : Description
- [Faiblesse 2] : Description
- [Faiblesse 3] : Description

### Opportunités (Opportunities) - Externe, Positif

Éléments de l'environnement favorables :

- [Opportunité 1] : Description
- [Opportunité 2] : Description
- [Opportunité 3] : Description

### Menaces (Threats) - Externe, Négatif

Éléments de l'environnement défavorables :

- [Menace 1] : Description
- [Menace 2] : Description
- [Menace 3] : Description
```

**Exemple concret** pour un projet de gestion de tâches auto-hébergé :

```markdown
## Analyse SWOT

### Forces

- **Mode hors-ligne** : Fonctionne sans connexion internet, contrairement aux concurrents SaaS
- **Auto-hébergement** : Les données restent sous le contrôle du client (facilite la conformité RGPD, sans la garantir à lui seul)
- **Open source** : Code auditable, pas de vendor lock-in

### Faiblesses

- **Équipe réduite** : Moins de ressources pour le développement que les concurrents établis
- **Notoriété nulle** : Marque inconnue, besoin de construire la confiance
- **Support limité** : Pas de support 24/7, documentation à créer

### Opportunités

- **Préoccupations RGPD** : Les entreprises européennes cherchent des solutions souveraines
- **Fatigue du SaaS** : Certaines entreprises veulent réduire leur dépendance aux abonnements
- **Marché croissant** : Le télétravail augmente le besoin d'outils collaboratifs

### Menaces

- **Concurrents établis** : Trello, Asana ont des millions d'utilisateurs et des budgets marketing
- **Gratuité des concurrents** : Les offres gratuites des concurrents sont suffisantes pour beaucoup
- **Complexité auto-hébergement** : Installer et maintenir un serveur reste complexe pour les PME
```

---

### Étape 4 : Effectuer une veille technologique

Identifie les technologies pertinentes pour ton projet :

```markdown
## Veille technologique

### Technologies backend envisagées

| Technologie | Maturité | Communauté | Avantages | Inconvénients | Verdict |
| ----------- | -------- | ---------- | --------- | ------------- | ------- |
| PHP/Symfony | Stable | Large | Maîtrisé, performant | Verbeux | ✅ Retenu |
| Node.js/Express | Stable | Très large | Rapide, JS partout | Callback hell | ❌ Non retenu |
| Python/Django | Stable | Large | Lisible, batteries incluses | ORM moins flexible | ❌ Non retenu |

### Justification du choix

Le choix de PHP/Symfony est justifié par :
1. Maîtrise existante de l'équipe (pas de formation nécessaire)
2. Écosystème mature avec bundles pour toutes les fonctionnalités nécessaires
3. Performance prouvée pour des applications similaires
```

**Sources de veille recommandées** :

| Source | URL | Type de contenu |
| ------ | --- | --------------- |
| Hacker News | news.ycombinator.com | Actualités tech généralistes |
| Dev.to | dev.to | Articles techniques |
| GitHub Trending | github.com/trending | Projets populaires du moment |
| Stack Overflow Blog | stackoverflow.blog | Tendances et bonnes pratiques |
| Release notes officielles | (sites des frameworks) | Nouvelles versions, breaking changes |

---

### Étape 5 : Rédiger les conclusions et recommandations

Termine ton étude par des recommandations concrètes :

```markdown
## Conclusions et recommandations

### Synthèse de l'analyse

[Résumé en 3-5 phrases des principales découvertes]

### Positionnement recommandé

Notre projet se différencie par :
1. [Différenciateur 1]
2. [Différenciateur 2]
3. [Différenciateur 3]

### Fonctionnalités prioritaires

Basé sur l'analyse concurrentielle, les fonctionnalités prioritaires sont :

| Priorité | Fonctionnalité | Justification |
| -------- | -------------- | ------------- |
| 1 | [Fonctionnalité] | [Pourquoi c'est prioritaire] |
| 2 | [Fonctionnalité] | [Pourquoi c'est prioritaire] |
| 3 | [Fonctionnalité] | [Pourquoi c'est prioritaire] |

### Risques identifiés

| Risque | Probabilité | Impact | Mitigation |
| ------ | ----------- | ------ | ---------- |
| [Risque 1] | Haute/Moyenne/Basse | Fort/Moyen/Faible | [Action] |

### Décision Go/No-Go

- [ ] GO : Le projet est viable, recommandation de poursuivre
- [ ] NO-GO : Le projet présente trop de risques, recommandation d'abandonner
- [ ] GO conditionnel : Le projet est viable sous réserve de [conditions]
```

---

## Commandes Utiles

Cette fiche ne contient pas de commandes techniques car elle porte sur l'analyse et la rédaction.

---

## Pièges Fréquents

### Piège 1 : Se comparer uniquement aux géants

⚠️ **Problème** : Comparer ton projet à Google ou Microsoft et conclure que c'est impossible.

✅ **Solution** : Compare-toi aussi aux solutions de niche et aux projets open source similaires.

```markdown
<!-- ❌ Comparaison décourageante -->
Concurrents : Microsoft Teams, Slack, Google Chat
Conclusion : Impossible de rivaliser

<!-- ✅ Comparaison pertinente -->
Concurrents directs : Mattermost (open source), Rocket.Chat, Zulip
Concurrents indirects : Discord, Microsoft Teams (segment entreprise)
Niche identifiée : Auto-hébergement + conformité RGPD
```

---

### Piège 2 : Ne lister que les points positifs de son projet

⚠️ **Problème** : Un SWOT sans faiblesses ni menaces n'est pas crédible et ne prépare pas aux difficultés.

✅ **Solution** : Sois honnête et objectif. Les faiblesses permettent de s'améliorer.

---

### Piège 3 : Faire la veille une seule fois

⚠️ **Problème** : Une veille ponctuelle devient obsolète rapidement dans le domaine informatique.

✅ **Solution** : Planifie une veille régulière (hebdomadaire ou mensuelle).

```markdown
## Planning de veille

| Fréquence | Action | Responsable |
| --------- | ------ | ----------- |
| Quotidien | Lecture Hacker News (15 min) | Équipe |
| Hebdomadaire | Revue des releases des dépendances | Tech Lead |
| Mensuel | Mise à jour de l'analyse concurrentielle | Chef de projet |
| Trimestriel | Réévaluation des choix technologiques | Architecte |
```

---

### Piège 4 : Ignorer les solutions non-techniques

⚠️ **Problème** : Oublier que les utilisateurs peuvent résoudre leur problème autrement qu'avec du logiciel.

✅ **Solution** : Toujours inclure les concurrents indirects, y compris les solutions "manuelles".

---

## Checklist de Validation

- [ ] Je comprends la différence entre concurrents directs et indirects
- [ ] Je sais créer une matrice de fonctionnalités comparative
- [ ] Je sais réaliser une analyse SWOT avec les 4 quadrants
- [ ] Je connais au moins 3 sources pour la veille technologique
- [ ] Je sais formuler des recommandations basées sur l'analyse
- [ ] Je comprends l'importance d'une veille régulière

---

## Exercice Pratique

**Énoncé** : Réalise une mini-étude de marché pour une application de suivi de budget personnel.

**Indications** :

1. Identifie 3 concurrents directs (applications de budget)
2. Identifie 2 concurrents indirects
3. Crée une matrice de fonctionnalités avec 6 critères
4. Réalise une analyse SWOT (2 éléments par quadrant minimum)
5. Propose un positionnement différenciant

**Résultat attendu** : Un document Markdown d'environ 60-80 lignes.

---

## Solution de l'Exercice

> **Note** : Cette section contient une solution possible. Essaie d'abord de résoudre l'exercice par toi-même.

---

```markdown
# Étude de Marché - Application Budget Personnel

## 1. Concurrents directs

| Nom | URL | Description | Points forts | Points faibles |
| --- | --- | ----------- | ------------ | -------------- |
| Bankin' | bankin.com | Agrégateur bancaire + budget | Connexion bancaire automatique, Catégorisation IA | Dépendance aux banques, Données hébergées chez eux |
| Linxo | linxo.com | Agrégation et budget | Interface claire, Alertes personnalisées | Version gratuite limitée, Pas d'export |
| YNAB | ynab.com | Budget prévisionnel | Méthode éprouvée, Formation incluse | Prix élevé (109 USD/an d'après [ynab.com/pricing](https://www.ynab.com/pricing)), En anglais |

## 2. Concurrents indirects

| Nom | Type | Comment il répond au besoin |
| --- | ---- | --------------------------- |
| Tableur Excel/Sheets | Logiciel générique | Création manuelle de tableaux de suivi |
| Carnet papier | Analogique | Notes manuscrites des dépenses |

## 3. Matrice de fonctionnalités

| Fonctionnalité | Mon projet | Bankin' | Linxo | YNAB |
| -------------- | ---------- | ------- | ----- | ---- |
| Saisie manuelle | ✅ | ✅ | ✅ | ✅ |
| Connexion bancaire | ❌ | ✅ | ✅ | ✅ |
| Catégorisation auto | ✅ | ✅ | ✅ | 🔶 |
| Mode hors-ligne | ✅ | ❌ | ❌ | ❌ |
| Données locales | ✅ | ❌ | ❌ | ❌ |
| Gratuit | ✅ | 🔶 | 🔶 | ❌ |

## 4. Analyse SWOT

### Forces
- **Données 100% locales** : Aucune donnée bancaire ne quitte l'appareil
- **Gratuit et open source** : Pas d'abonnement, code vérifiable
- **Mode hors-ligne complet** : Fonctionne sans internet

### Faiblesses
- **Saisie manuelle obligatoire** : Plus contraignant que la connexion bancaire
- **Pas de synchronisation multi-appareils** : Données sur un seul appareil

### Opportunités
- **Scandales données personnelles** : Méfiance croissante envers les agrégateurs
- **Digital detox** : Certains préfèrent une approche manuelle et consciente

### Menaces
- **Habitude de la connexion bancaire** : Les utilisateurs veulent de l'automatisation
- **Applications bancaires natives** : Les banques intègrent des fonctions budget

## 5. Positionnement

Notre application se positionne comme :
> "L'application budget pour ceux qui veulent garder le contrôle de leurs données"

Différenciateurs clés :
1. Zéro connexion bancaire = zéro risque de fuite de données
2. 100% gratuit, sans publicité, sans collecte de données
3. Fonctionne entièrement hors-ligne
```

---

## Navigation

← Fiche précédente : **[01 - Le Cahier des Charges Technique](01-cahier-des-charges.md)**

→ Fiche suivante : **[03 - L'Analyse de Faisabilité et Cartographie SI](03-analyse-faisabilite.md)**
