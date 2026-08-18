---
tags:
  - CI/CD
  - Débutant
  - Concept
description: "Comprendre les concepts fondamentaux de l'intégration continue et du déploiement continu"
estimated_time: "45 min"
fiche_number: 1
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 01 - Introduction à la CI/CD

> **En bref** : Cette fiche présente les concepts fondamentaux de la CI/CD : intégration continue, livraison continue et déploiement continu, ainsi que les outils du marché. Lecture estimée : 45 min.

## Prérequis

- Connaître les bases de Git (commits, branches, merge)
- Savoir utiliser le terminal (ligne de commande)
- Aucune connaissance préalable de la CI/CD n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer ce que sont la CI, la CD et un pipeline, identifier les principaux outils du marché, et comprendre pourquoi l'automatisation est indispensable dans un projet logiciel.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'intégration continue (CI) ?

**Définition** : L'intégration continue (CI, pour _Continuous Integration_) est une pratique qui consiste à fusionner régulièrement le code de chaque développeur dans un dépôt partagé, puis à exécuter automatiquement des vérifications (tests, lint, compilation) à chaque fusion.

**Le problème que la CI résout** :

Sans intégration continue, voici les problèmes rencontrés :

1. **Conflits tardifs** : Deux développeurs travaillent chacun de leur côté pendant deux semaines. Quand ils fusionnent leur code, les conflits sont nombreux et difficiles à résoudre.

2. **Bugs découverts tard** : Un développeur introduit un bug le lundi. Personne ne le détecte avant le vendredi, quand un collègue tombe dessus. Le bug a eu le temps de se propager dans d'autres parties du code.

3. **Absence de vérification** : Chaque développeur exécute les tests sur sa machine, mais certains oublient. Le code arrive en production avec des erreurs.

4. **"Ça marche sur ma machine"** : Le code fonctionne sur l'ordinateur du développeur, mais pas sur celui du collègue ni sur le serveur. Les différences d'environnement causent des bugs invisibles localement.

**Comment la CI résout ces problèmes** :

| Problème | Solution apportée par la CI |
| --- | --- |
| Conflits tardifs | Les fusions sont fréquentes (plusieurs fois par jour), donc les conflits sont petits et faciles à résoudre |
| Bugs découverts tard | Les tests s'exécutent automatiquement à chaque push, le bug est détecté immédiatement |
| Absence de vérification | La CI exécute les vérifications à chaque push, personne ne peut les oublier |
| "Ça marche sur ma machine" | La CI exécute le code dans un environnement neutre et reproductible |

**Analogie concrète** : Imagine une chaîne de montage automobile. Chaque ouvrier ajoute une pièce sur la voiture. Un contrôleur qualité vérifie la voiture après chaque étape. Si une pièce est mal posée, le contrôleur le détecte immédiatement et l'ouvrier corrige. Sans contrôleur, les défauts s'accumulent et la voiture complète est défectueuse. La CI est ce contrôleur qualité automatique.

**Ce que la CI n'est PAS** :

- La CI n'est pas un outil. C'est une _pratique_, une façon de travailler. Les outils (GitHub Actions, GitLab CI, Jenkins) permettent de mettre cette pratique en place.
- La CI ne garantit pas l'absence de bugs. Elle détecte uniquement les problèmes couverts par les tests. Si un scénario n'est pas testé, la CI ne le vérifie pas.

---

### Qu'est-ce que la livraison continue (CD) ?

**Définition** : La livraison continue (CD, pour _Continuous Delivery_) est une pratique qui consiste à préparer automatiquement le code pour un déploiement en production. Le code passe par des étapes de test, de build et de validation. À la fin du pipeline, le code est prêt à être déployé, mais un humain décide du moment du déploiement.

**Le problème que la livraison continue résout** :

Sans livraison continue, voici les problèmes rencontrés :

1. **Préparation manuelle** : À chaque mise en production, quelqu'un doit compiler le code, créer les paquets, vérifier les configurations. Ce processus prend des heures et est sujet à des erreurs.

2. **Déploiements rares et risqués** : Comme la préparation est longue, on déploie peu souvent (une fois par mois). Chaque déploiement contient beaucoup de changements, ce qui augmente le risque de bug.

3. **Pas de confiance** : L'équipe n'a pas confiance dans le code. "Est-ce que cette version est vraiment prête ?" Personne ne sait avec certitude.

**Comment la livraison continue résout ces problèmes** :

| Problème | Solution apportée par la CD |
| --- | --- |
| Préparation manuelle | Le pipeline automatise la compilation, le packaging et la validation |
| Déploiements rares et risqués | Le code est toujours prêt, on peut déployer à tout moment avec peu de changements |
| Pas de confiance | Le pipeline prouve que le code a passé tous les tests et toutes les validations |

**Analogie concrète** : Imagine un restaurant qui prépare les plats à l'avance. Les ingrédients sont lavés, coupés, pré-cuisinés et mis au réfrigérateur. Quand un client commande, le cuisinier n'a qu'à réchauffer et dresser l'assiette. La livraison continue fonctionne de la même façon : le code est toujours prêt à être servi.

---

### Qu'est-ce que le déploiement continu ?

**Définition** : Le déploiement continu (aussi abrégé CD, pour _Continuous Deployment_) va plus loin que la livraison continue. Chaque changement qui passe tous les tests est automatiquement déployé en production, sans intervention humaine.

**Comparaison livraison continue vs déploiement continu** :

| Livraison continue (Continuous Delivery) | Déploiement continu (Continuous Deployment) |
| --- | --- |
| Le code est prêt à être déployé | Le code est déployé automatiquement |
| Un humain décide du moment du déploiement | Aucune intervention humaine |
| Adapté aux projets avec contraintes réglementaires | Adapté aux projets web avec cycle rapide |
| Le pipeline se termine par un artefact prêt | Le pipeline se termine par un déploiement réel |

**Ce que le déploiement continu n'est PAS** :

- Le déploiement continu n'est pas adapté à tous les projets. Un logiciel embarqué dans un avion ne sera jamais déployé automatiquement sans validation humaine.
- Le déploiement continu n'élimine pas les tests manuels. Certains tests (ergonomie, accessibilité, validation métier) restent manuels.

---

### Qu'est-ce qu'un pipeline ?

**Définition** : Un pipeline est une suite d'étapes automatisées qui s'exécutent dans un ordre précis. Chaque étape effectue une tâche spécifique (tester, compiler, déployer). Si une étape échoue, le pipeline s'arrête.

**Le problème que les pipelines résolvent** :

Sans pipeline, voici les problèmes rencontrés :

1. **Étapes oubliées** : Un développeur oublie de lancer les tests avant de déployer. Un bug arrive en production.

2. **Ordre incorrect** : Quelqu'un déploie le code avant de le compiler. Le déploiement échoue.

3. **Pas de traçabilité** : Personne ne sait quelles vérifications ont été faites sur le code en production. "Est-ce que les tests ont été lancés ? Lesquels ?"

**Comment les pipelines résolvent ces problèmes** :

| Problème | Solution apportée par les pipelines |
| --- | --- |
| Étapes oubliées | Le pipeline exécute toutes les étapes automatiquement, sans oubli possible |
| Ordre incorrect | Les étapes sont définies dans un ordre précis et s'exécutent toujours dans cet ordre |
| Pas de traçabilité | Le pipeline enregistre le résultat de chaque étape avec horodatage |

**Analogie concrète** : Imagine une ligne de production dans une usine de chocolat. Chaque poste fait une tâche : torréfier les fèves, les broyer, mélanger le sucre, mouler les tablettes, emballer. Si le broyage est mal fait, la chaîne s'arrête. On ne mélange pas du sucre dans des fèves mal broyées. Un pipeline CI/CD fonctionne de la même façon : chaque étape dépend de la réussite de la précédente.

**Structure typique d'un pipeline** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-01-introduction-ci-cd-1.html">Qu&#x27;est-ce qu&#x27;un pipeline ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-01-introduction-ci-cd-1.html" title="Qu&#x27;est-ce qu&#x27;un pipeline ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Si une étape échoue, le pipeline s'arrête. Les étapes suivantes ne s'exécutent pas.

---

### Les outils CI/CD du marché

**Définition** : Un outil CI/CD est un logiciel qui permet de créer, exécuter et surveiller des pipelines. Il se connecte à un dépôt Git et réagit aux événements (push, merge request, tag).

Voici les principaux outils :

| Outil | Type | Points forts | Utilisé par |
| --- | --- | --- | --- |
| **GitHub Actions** | Cloud (intégré à GitHub) | Gratuit pour les dépôts publics, marketplace d'actions | Projets open source, startups |
| **GitLab CI** | Cloud ou auto-hébergé | Intégré à GitLab, pipeline as code | Entreprises, projets privés |
| **Jenkins** | Auto-hébergé | Très configurable, plugins nombreux | Grandes entreprises |
| **CircleCI** | Cloud | Rapide, bon cache | Startups, projets moyens |
| **Travis CI** | Cloud | Simple à configurer | Projets open source (historique) |

Dans ce cursus, tu apprendras **GitHub Actions** (fiches 2 à 5) et **GitLab CI** (fiches 6 à 7). Ces deux outils couvrent la majorité des besoins.

---

### Comment la CI/CD s'intègre avec Git

**Définition** : La CI/CD repose sur Git comme déclencheur. Chaque action dans Git (push, merge, tag) peut déclencher automatiquement un pipeline.

**Flux typique** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-01-introduction-ci-cd-2.html">Comment la CI/CD s&#x27;intègre avec Git (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-01-introduction-ci-cd-2.html" title="Comment la CI/CD s&#x27;intègre avec Git" style="width:100%;min-height:600px;border:0;background:transparent"></iframe>
</div>

**Événements Git qui déclenchent un pipeline** :

| Événement | Description | Exemple d'utilisation |
| --- | --- | --- |
| `push` | Un développeur pousse du code | Lancer les tests à chaque push |
| `pull_request` | Une merge request est créée ou mise à jour | Vérifier le code avant fusion |
| `tag` | Un tag est créé (ex: `v1.0.0`) | Créer une release et déployer |
| `schedule` | Planification horaire (cron) | Lancer un audit de sécurité chaque nuit |
| `workflow_dispatch` | Déclenchement manuel | Déployer en production à la demande |

---

## Étapes Pratiques

### Étape 1 : Visualiser un pipeline existant sur GitHub

Ouvre un navigateur et va sur un projet open source populaire. Par exemple le dépôt Symfony :

```text
https://github.com/symfony/symfony
```

Clique sur l'onglet **Actions** en haut du dépôt.

**Résultat attendu** :

```text
Tu vois une liste de workflows (pipelines) exécutés récemment.
Chaque ligne affiche :
- Le nom du workflow
- Le commit qui l'a déclenché
- Le statut (✓ succès, ✗ échec, ● en cours)
- La durée d'exécution
```

---

### Étape 2 : Explorer la structure d'un workflow

Dans le même dépôt, navigue vers le dossier des workflows :

```text
.github/workflows/
```

Tu y trouves des fichiers `.yml`. Chaque fichier définit un workflow (pipeline).

Ouvre un fichier pour observer sa structure. Voici un exemple simplifié de ce que tu peux voir :

```yaml
# Nom affiché dans l'onglet Actions de GitHub
name: Tests

# Événement déclencheur : ce workflow s'exécute à chaque push
on:
  push:
    branches:
      - main

# Liste des tâches à exécuter
jobs:
  # Premier job : exécuter les tests
  test:
    # Environnement : une machine Ubuntu fournie par GitHub
    runs-on: ubuntu-latest

    # Étapes du job
    steps:
      # Étape 1 : récupérer le code du dépôt
      - uses: actions/checkout@v4

      # Étape 2 : installer les dépendances
      - run: composer install

      # Étape 3 : lancer les tests
      - run: vendor/bin/phpunit
```

**Résultat attendu** :

```text
Tu comprends la structure de base :
- name     → le nom du workflow
- on       → quand il se déclenche
- jobs     → les tâches à exécuter
- steps    → les étapes de chaque tâche
```

---

### Étape 3 : Comprendre le cycle de vie d'un pipeline

Voici les étapes typiques d'un pipeline CI/CD, dans l'ordre :

```text
1. DÉCLENCHEMENT
   └── Un développeur fait un git push

2. LINT (vérification du formatage)
   └── Le code respecte-t-il les règles de style ?
   └── Outils : PHP CS Fixer, ESLint, markdownlint

3. TESTS (vérification du comportement)
   └── Le code fonctionne-t-il comme prévu ?
   └── Outils : PHPUnit, Jest, pytest

4. BUILD (compilation / création d'artefact)
   └── Le code se compile-t-il sans erreur ?
   └── Création d'une image Docker, d'un JAR, etc.

5. DEPLOY (mise en production)
   └── L'artefact est envoyé sur le serveur
   └── Staging d'abord, puis production
```

**Résultat attendu** :

```text
Tu connais les 5 étapes fondamentales d'un pipeline :
Déclenchement → Lint → Tests → Build → Deploy
```

---

### Étape 4 : Créer la structure de dossier pour un workflow GitHub Actions

Sur ton ordinateur, crée un projet de test :

```bash
# Crée un nouveau dossier pour le projet
mkdir -p mon-projet-ci/.github/workflows

# Entre dans le dossier du projet
cd mon-projet-ci

# Initialise un dépôt Git
git init

# Crée un fichier README
echo "# Mon Projet CI" > README.md

# Vérifie la structure créée
find . -type f | sort
```

**Résultat attendu** :

```text
./.git/...
./.github/workflows/
./README.md
```

Le dossier `.github/workflows/` est l'endroit où GitHub Actions cherche les fichiers de pipeline. Tout fichier `.yml` dans ce dossier sera automatiquement détecté.

---

### Étape 5 : Créer un premier fichier de workflow vide

Crée un fichier de workflow minimal :

```bash
# Crée le fichier de workflow
cat > .github/workflows/ci.yml << 'EOF'
name: CI

on:
  push:
    branches:
      - main

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Dire bonjour
        run: echo "Hello CI/CD !"
EOF
```

Vérifie le contenu :

```bash
# Affiche le contenu du fichier
cat .github/workflows/ci.yml
```

**Résultat attendu** :

```yaml
name: CI

on:
  push:
    branches:
      - main

jobs:
  hello:
    runs-on: ubuntu-latest
    steps:
      - name: Dire bonjour
        run: echo "Hello CI/CD !"
```

Ce workflow ne fait rien d'utile pour l'instant. Il ne fait qu'afficher "Hello CI/CD !" quand du code est poussé sur la branche `main`. Tu apprendras à le rendre utile dans les fiches suivantes.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `git push` | Pousse le code et déclenche le pipeline |
| `git tag v1.0.0` | Crée un tag qui peut déclencher un pipeline de release |
| `mkdir -p .github/workflows` | Crée le dossier pour les workflows GitHub Actions |
| `cat .github/workflows/ci.yml` | Affiche le contenu d'un fichier de workflow |

---

## Pièges Fréquents

### Piège 1 : Confondre livraison continue et déploiement continu

⚠️ **Problème** : Les deux concepts s'abrègent "CD". Beaucoup de développeurs les confondent. La livraison continue prépare le code pour un déploiement manuel. Le déploiement continu déploie automatiquement.

✅ **Solution** : Retiens cette règle simple :

- **Livraison continue** = le code est _prêt_ à être déployé (bouton à presser)
- **Déploiement continu** = le code _est_ déployé (automatiquement)

---

### Piège 2 : Croire que la CI remplace les tests manuels

⚠️ **Problème** : Un développeur pense que la CI suffit. Il arrête de tester manuellement. Un bug d'affichage passe inaperçu car aucun test automatisé ne vérifie le rendu visuel.

✅ **Solution** : La CI exécute les tests automatisés. Elle ne remplace pas les tests manuels (tests exploratoires, vérification visuelle, tests utilisateur). Les deux sont complémentaires.

---

### Piège 3 : Mettre le dossier workflows au mauvais endroit

⚠️ **Problème** : Tu crées le dossier `github/workflows/` (sans le point devant `github`). GitHub ne détecte pas tes workflows.

✅ **Solution** : Le dossier doit être `.github/workflows/` (avec un point devant). Le point indique un dossier caché sur Linux/macOS.

```bash
# Incorrect : GitHub ne détecte pas ce dossier
mkdir -p github/workflows

# Correct : le point est obligatoire
mkdir -p .github/workflows
```

---

### Piège 4 : Penser que la CI/CD est réservée aux grandes équipes

⚠️ **Problème** : Un développeur solo pense que la CI/CD est inutile pour lui. Il ne met pas en place de pipeline. Il oublie de lancer les tests avant un déploiement et un bug arrive en production.

✅ **Solution** : La CI/CD est utile même pour un développeur seul. Elle automatise les tâches que tu risques d'oublier. Un pipeline simple (lint + tests) prend 15 minutes à mettre en place et économise des heures de débogage.

---

## Checklist de Validation

- [ ] Je sais définir CI (intégration continue) en une phrase
- [ ] Je sais expliquer la différence entre livraison continue et déploiement continu
- [ ] Je sais ce qu'est un pipeline et ses étapes principales (lint, test, build, deploy)
- [ ] Je connais au moins 3 outils CI/CD du marché
- [ ] Je sais que les workflows GitHub Actions se placent dans `.github/workflows/`
- [ ] J'ai créé la structure de dossier pour un workflow sur mon ordinateur

---

## Exercice Pratique

**Énoncé** : Dessine sur papier (ou dans un fichier texte) le pipeline CI/CD que tu mettrais en place pour un projet Symfony avec les contraintes suivantes :

- Le code doit respecter le style PHP CS Fixer
- Les tests PHPUnit doivent passer
- L'application doit être packagée dans une image Docker
- Le déploiement se fait d'abord en staging, puis en production après validation manuelle

**Indications** :

- Identifie les étapes du pipeline (lint, test, build, deploy)
- Pour chaque étape, note l'outil utilisé
- Indique quelles étapes sont automatiques et lesquelles nécessitent une action humaine
- Précise les événements Git qui déclenchent le pipeline

**Résultat attendu** : Un schéma ou un texte structuré décrivant 4 à 6 étapes, avec les outils correspondants et les déclencheurs Git.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```text
Pipeline CI/CD - Projet Symfony
================================

DÉCLENCHEUR : git push sur n'importe quelle branche
              git push de tag v*.*.* pour le déploiement

ÉTAPE 1 : LINT (automatique)
├── Outil : PHP CS Fixer (--dry-run)
├── Rôle : vérifier que le code respecte les règles de style
└── Si échec : le pipeline s'arrête, le développeur corrige le formatage

ÉTAPE 2 : TESTS (automatique)
├── Outil : PHPUnit
├── Rôle : exécuter tous les tests unitaires et fonctionnels
├── Nécessite : une base PostgreSQL de test
└── Si échec : le pipeline s'arrête, le développeur corrige le bug

ÉTAPE 3 : BUILD (automatique)
├── Outil : docker build
├── Rôle : créer l'image Docker de l'application
├── L'image contient : PHP 8.3, Nginx, le code Symfony compilé
└── L'image est poussée dans un registry (GitHub Container Registry)

ÉTAPE 4 : DEPLOY STAGING (automatique)
├── Déclencheur : le build de l'étape 3 a réussi + tag v*.*.*
├── Rôle : déployer l'image sur le serveur de staging
└── L'équipe peut tester manuellement sur staging

ÉTAPE 5 : VALIDATION (manuelle)
├── Un humain teste l'application sur staging
├── Il vérifie les fonctionnalités critiques
└── Il approuve le déploiement en production

ÉTAPE 6 : DEPLOY PRODUCTION (manuelle → semi-automatique)
├── Déclencheur : approbation humaine
├── Rôle : déployer l'image sur le serveur de production
└── Même image Docker que staging (garantie d'identité)
```

**Schéma résumé** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-01-introduction-ci-cd-3.html">Solution de l&#x27;Exercice (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-01-introduction-ci-cd-3.html" title="Solution de l&#x27;Exercice" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

## Navigation

→ Fiche suivante : **[GitHub Actions - Premiers pas](02-github-actions-premiers-pas.md)**
