# AGENTS.md

This file provides guidance to Codex, Grok and other agents when working with code in this repository.

## Objectif du Projet

Créer une documentation de programmation structurée et explicite pour l'apprentissage en autonomie. L'apprenant travaille en **autonomie complète** dans un **environnement offline**. Les fiches sont conçues pour mieux répondre aux besoins fréquents d'un public neurodivergent, sans prétendre convenir universellement à chaque personne.

---

## Commandes de Développement

| Tâche | Commande |
| ----- | -------- |
| Lint MD | `npm run lint` |
| Lint + fix | `npm run lint:fix` |
| Vérifier noms fichiers | `npm run lint:check-names` |
| Valider frontmatter | `npm run lint:frontmatter` |
| Détecter em dashes | `npm run lint:emdash` |
| Corriger em dashes | `npm run lint:emdash:fix` |
| Détecter accents manquants | `npm run lint:accents` |
| Corriger accents manquants | `npm run lint:accents:fix` |
| Vérifier liens prérequis | `npm run lint:prereq-links` |
| Générer carte des cursus | `npm run generate:cursus-map` |
| PDF d'un fichier | `./create-pdf.sh docs/01-docker/01-xxx.md` |
| PDF d'un dossier | `./create-pdf.sh docs/01-docker/` |
| PDF dans sous-dossier | `./create-pdf.sh docs/01-docker/01-xxx.md 01-docker` |
| Wiki MkDocs démarrer | `docker compose up -d` |
| Wiki MkDocs arrêter | `docker compose down` |
| Wiki MkDocs build | `docker compose run --rm mkdocs build` |
| Wiki MkDocs build strict | `docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.6 build --strict` |
| Ajouter temps lecture | `npm run a11y:reading-time` |
| Ajouter navigation | `npm run a11y:navigation` |
| Générer "En Bref" | `npm run a11y:en-bref` |
| Tous les scripts a11y | `npm run a11y:all` |
| Tests | `npm test` |
| Tests watch | `npm run test:watch` |
| Tests couverture | `npm run test:coverage` |
| Validation complète | `npm run validate` |

Un pre-commit hook (Husky + lint-staged) exécute `fix-accents.js`, `fix-emdash.js` puis `markdownlint --fix` sur les fichiers `.md` modifiés à chaque commit.

**Prérequis** : Node.js >= 22.0.0

## Workflow Rapide

| Situation | Commande |
| --------- | -------- |
| Avant commit | Automatique (Husky : accents + em dashes + markdownlint) |
| Validation complète | `npm run validate` (tests + lint + nommage + em dashes + frontmatter) |
| Build MkDocs strict | `docker run --rm -v $(pwd):/docs squidfunk/mkdocs-material:latest build --strict` |
| Avant push | `/pre-push` (validation complète + build MkDocs) |

## Architecture du Projet

Ce projet est un **repo de documentation uniquement** (pas d'application). Le contenu principal est constitué de fiches pédagogiques Markdown dans `docs/`.

### Contenu pédagogique (`docs/`)

Le projet contient **603 fiches réparties sur 64 cursus** (chiffres à recalculer via la carte si tu modifies le corpus). La carte complète est dans `docs/carte-cursus.md`, qui fait **autorité sur les nombres de fiches par cursus** : c'est un fichier généré (régénérable via `npm run generate:cursus-map`, vérifiable via `npm run lint:cursus-map`). Mettre à jour les comptes ci-dessous d'après cette carte, jamais l'inverse.

**Développement Web** :

- **Premiers pas** (`commencer/`) : guide de démarrage (2 fiches)
- **Outils IA** (`00-outils-ia/`) : utiliser l'IA pour apprendre, rechercher efficacement
- **Docker** (`01-docker/`) : conteneurisation et environnement de développement (2 fiches)
- **PHP** (`02-php/`) : fondamentaux du langage (14 fiches)
- **EasyAdmin** (`03-easyadmin/`) : interface admin Symfony (7 fiches)
- **Symfony** (`03-symfony/`) : framework PHP avec Doctrine (21 fiches)
- **PostgreSQL** (`04-postgresql/`) : base de données relationnelle (8 fiches)
- **JavaScript** (`05-javascript/`) : jQuery, Webpack, ES6+ (7 fiches)
- **JavaScript Moderne** (`06-javascript-moderne/`) : ES6+, Promises, async/await, Fetch API (14 fiches)
- **TypeScript** (`07-typescript/`) : types, interfaces, generics, Node.js (15 fiches)
- **React** (`08-react/`) : composants, hooks, Router, Context, formulaires, tests (19 fiches)
- **Testing** (`09-testing/`) : PHPUnit, Jest, TDD, Playwright, couverture de code (15 fiches)
- **Architecture** (`10-architecture/`) : design patterns, SOLID, Clean Architecture, DDD (17 fiches)
- **API Design** (`12-api-design/`) : REST avancé, OpenAPI, API Platform, GraphQL (10 fiches)
- **Redis** (`13-redis/`) : cache, sessions, Messenger dans Symfony (8 fiches)
- **Python** (`15-python/`) : fondamentaux et écosystème (12 fiches)
- **Python Data** (`16-python-data/`) : pandas, numpy, analyse de données (8 fiches)
- **MongoDB** (`17-mongodb/`) : base NoSQL orientée documents (8 fiches)
- **C#** (`18-csharp/`) : langage et .NET (10 fiches)
- **Dev Mobile** (`23-dev-mobile/`) : React Native, Expo (13 fiches)

**Langages et fondamentaux** (`fondamentaux/`) : Java, Unix/Bash, Git, HTML/CSS, JavaScript, Node.js, Rust, projets, aide-mémoires (64 fiches sur 9 cursus)

**Infrastructure et DevOps** :

- **CI/CD** (`11-ci-cd/`) : GitHub Actions, GitLab CI, stratégies de déploiement (10 fiches)
- **Monitoring** (`14-monitoring/`) : Prometheus, Grafana, Loki, traces distribuées (10 fiches)
- **Langage C** (`19-langage-c/`) : programmation système (10 fiches)
- **Réseaux** (`20-reseaux/`) : TCP/IP, protocoles, services (14 fiches)
- **Services Système** (`21-services-systeme/`) : systemd, daemons (9 fiches)
- **Cloud** (`22-cloud/`) : AWS, GCP, Azure (13 fiches)
- **Virtualisation** (`24-virtualisation/`) : VMs, hyperviseurs (6 fiches)
- **Podman** (`devops/01-podman/`) : conteneurisation sans démon (5 fiches)
- **OpenShift** (`devops/02-openshift/`) : plateforme Red Hat (6 fiches)
- **Kubernetes** (`devops/03-kubernetes/`) : orchestration, Helm, déploiement Symfony (12 fiches)
- **Ansible** (`ansible/`) : playbooks, rôles, vault, CI/CD (14 fiches)

**Cursus thématiques longs** :

- **Cybersécurité** (`cybersecurite/`) : 8 phases, de zéro à red team et leadership (35 fiches)
- **Intelligence Artificielle** (`ia/`) : 9 phases, du ML classique aux systèmes agentiques (37 fiches)
- **Faust** (`faust/`) : 7 phases, traitement audio et synthèse sonore (32 fiches)
- **Crypto-monnaies** (`crypto-monnaies/`) : 9 phases, de zéro à initié sans le battage médiatique (54 fiches)

**Compétences transverses** :

- **Gestion de Projet** (`25-gestion-projet/`) : méthodes, planification (6 fiches)
- **Droit et RGPD** (`26-droit-rgpd/`) : conformité, DPO, sous-traitants (4 fiches)
- **UX Design** (`27-ux-design/`) : ergonomie, accessibilité (4 fiches)
- **Audit et Qualité** (`28-audit-qualite/`) : tests avancés, workflow, patterns d'isolation (6 fiches)

**Compétences métier et références** :

- **Compétences métier** (`competences-metier/`) : besoins utilisateurs, pilotage projet, cloud, développement logiciel, architecture SI
- **Aide-mémoires** (`fiches-reference/`) : fiches courtes de référence rapide (18 fiches)

### Wiki MkDocs

Le wiki utilise **MkDocs Material 9.7.6** (image Docker épinglée dans `docker-compose.yml` et `requirements.txt`). En local : `docker compose up -d` puis `http://localhost:8100`.

- **`mkdocs.yml`** : configuration MkDocs avec navigation complète de toutes les fiches
- **`docker-compose.yml`** : service MkDocs Material (port 8100)
- **`docs/index.md`** : page d'accueil du wiki avec sommaire par cursus

### Outillage

- **`create-pdf.sh`** : pipeline Markdown -> HTML (pandoc) -> post-traitement Python (blocs visuels, landscape pour grands tableaux, TOC conditionnel) -> PDF (weasyprint)
- **`scripts/check-filenames.js`** : valide que tous les fichiers dans `docs/` suivent le pattern `[00-99]-[kebab-case].md` et les dossiers `[00-99]-[kebab-case]` (exceptions : `BC0x`, `fiches-reference`)
- **`scripts/audit-fiches.sh`** : audit qualité des fiches via Claude AI (conformité au template CLAUDE.md)
- **`scripts/check-prereq-links.js`** : vérifie que les références à des fiches/cursus dans les sections Prérequis contiennent des liens Markdown
- **`scripts/fix-emdash.js`** : détecte et corrige les em dashes (`-`) → tirets simples (`-`). Accepte `--fix` et des fichiers en argument (lint-staged)
- **`scripts/validate-frontmatter.js`** : valide la présence des champs obligatoires (`tags`, `description`, `estimated_time`, `fiche_number`, `total_fiches`, `cursus`) dans le frontmatter YAML
- **`scripts/generate-cursus-map.js`** : génère `docs/carte-cursus.md` avec le tableau récapitulatif de tous les cursus
- **`scripts/pdf-changed.sh`** : génère les PDFs uniquement pour les fichiers `.md` modifiés depuis le dernier commit
- **`scripts/add-frontmatter.js`** : ajoute le frontmatter YAML obligatoire aux fiches qui n'en ont pas
- **`scripts/fix-fiche-links.js`** : détecte et corrige les liens internes cassés entre fiches
- **`scripts/rename-h1.sh`** : renomme les titres H1 des fiches pour correspondre à la nomenclature
- **Validation pre-push** :
  - `scripts/pre-push-hard.sh` : validation déterministe (npm validate + lint + build MkDocs strict). Pour usage CI ou cron.
  - `scripts/pre-push-validate.sh` : validation sémantique des fiches modifiées via Claude (structure, frontmatter, liens, total_fiches).
- **Audit automatisé** :
  - `scripts/audit-fiches.sh [dossier]` : audit Claude d'un dossier de fiches.
  - `scripts/auto-review.sh` : audit des fiches modifiées (staged/unstaged) via Claude.
  - `scripts/nightly-audit.sh` : audit hebdomadaire optionnel des fiches modifiées sur 7 jours (outil CLI local si disponible).
  - `scripts/nightly-validate.sh` : validation quotidienne optionnelle `npm run validate` (webhook via `LEARNING_DOCS_NOTIFY_URL` si défini).
- **`.markdownlint.json`** : config markdownlint stricte (ATX headings, dash lists, ordered numbers, fenced code with language, emphasis bold=`*` italic=`_`, leading+trailing pipes)
- **`scripts/__tests__/`** : tests unitaires Vitest (globals activés, `vitest run` pour un lancement unique, `vitest` pour le mode watch). Couverture V8 sur `scripts/lib/`

### Suivi de progression

Le suivi de progression (planning, tableaux de bord) est hors de ce dépôt public.

### Hooks Claude Code (`.claude/hooks/`)

- **`session-start.sh`** : injecte le contexte pédagogique (nombre de fiches, état MkDocs, fichiers modifiés)
- **`post-edit-lint.sh`** : auto-fix markdownlint après édition de fichiers `.md` dans `docs/`
- **`pre-bash-guard.sh`** : bloque les commandes dangereuses (rm -rf, git push --force, DROP TABLE, etc.)
- **`stop-validate.sh`** : validation finale (markdownlint, nommage, em dashes, frontmatter) sur les fichiers modifiés
- **`post-push-ci.sh`** : surveille le statut CI GitHub Actions après un `git push` vers le remote `github`
- **`post-docker-health.sh`** : vérifie la santé du container MkDocs après `docker compose up`
- **`notify.sh`** : notification macOS quand une tâche longue se termine

### Skills Claude Code (`.claude/commands/`)

- **`/question`** : assistant pédagogique qui répond aux questions sur les cours
- **`/pdf`** : génère un PDF depuis un fichier ou dossier Markdown
- **`/new-fiche`** : crée une nouvelle fiche pédagogique suivant le template
- **`/review-fiche`** : vérifie la conformité d'une fiche aux standards du projet
- **`/fix-links`** : détecte et corrige les liens internes cassés dans les fiches
- **`/update-nav`** : synchronise la navigation `mkdocs.yml` avec les fiches existantes
- **`/build`** : valide le build MkDocs pour détecter les erreurs de navigation et de liens
- **`/audit-all`** : audit complet de cohérence, consistance, fiabilité et qualité linguistique de toutes les fiches
- **`/pre-push`** : validation complète avant push (tests + lint + build MkDocs)
- **`/stats`** : tableau de bord rapide de la santé du projet

### Agents Claude Code (`.claude/agents/`)

- **`review`** : audit qualité de fiches pédagogiques en lot (conformité au template CLAUDE.md)
- **`consistency`** : vérifie la cohérence des fiches au sein d'un cursus (numérotation, navigation, total_fiches, prérequis)
- **`language`** : audit qualité linguistique (formulations interdites, ton, clarté, tutoiement, accents)

### CI/CD (`.github/workflows/deploy.yml`)

Pipeline GitHub Actions (push sur master ou workflow_dispatch) :

1. Lint Markdown (`npm run lint`)
2. Validation noms de fichiers (`npm run lint:check-names`)
3. Détection em dashes (`npm run lint:emdash`)
4. Vérification liens prérequis (`npm run lint:prereq-links`)
5. Validation frontmatter (`npm run lint:frontmatter`)
6. Build MkDocs strict (`--strict` : échoue sur warnings)
7. Déploiement GitHub Pages

---

## Technologies Couvertes (Développement Web)

1. **Docker** - Conteneurisation et environnement de développement
2. **PHP** - Fondamentaux du langage
3. **Symfony** - Framework PHP (avec Doctrine, EasyAdmin)
4. **PostgreSQL** - Base de données
5. **JavaScript** - jQuery, Webpack, ES6+, TypeScript, React

---

## Versions de Référence (2025-2026)

Ce tableau définit les versions utilisées dans toute la documentation. Ces versions sont compatibles entre elles.

| Technologie | Version | Fin de support |
| ----------- | ------- | -------------- |
| PHP | 8.3 | Novembre 2027 |
| Symfony | 7.4 LTS | Novembre 2028 |
| PostgreSQL | 16 | Novembre 2028 |
| Doctrine ORM | 3.x | - |
| Twig | 3.x | - |
| EasyAdmin | 4.x | - |
| Nginx | 1.26 | - |
| MkDocs Material | 9.7.6 | projet Material : maintenance limitée annoncée jusqu'à fin 2026 (suivre le changelog) |
| Java | 21 LTS | Septembre 2031 |
| Node.js | 22 LTS | Avril 2027 |
| Podman | 4.x | - |
| OpenShift | 4.14+ | - |
| CRC | 2.x | - |
| Ansible | 10.x (ansible-core 2.17) | - |

**Note** : Les exemples de code et configurations de cette documentation utilisent ces versions. Si tu utilises des versions différentes, certaines syntaxes peuvent varier.

---

## Principes de Rédaction Essentiels

### Structure Explicite Obligatoire

- **Jamais d'implicite** : tout doit être dit explicitement
- **Pas de "vous savez déjà"** : ne jamais supposer de connaissances préalables non listées
- **Séquençage précis** : étapes numérotées 1, 2, 3...
- **Prérequis explicites** : lister les fiches à lire avant en début de document
- **Frontmatter obligatoire** : chaque fiche doit inclure `estimated_time`, `fiche_number`, `total_fiches` et `cursus` dans le frontmatter YAML
- **En Bref obligatoire** : chaque fiche doit avoir un blockquote immédiatement après le H1, format exact : `> **En bref** : [Objectif en une phrase]. Lecture estimée : XX min.`
- **Navigation bidirectionnelle** : chaque fiche doit se terminer par une section `## Navigation` avec des liens vers les fiches précédente et suivante du cursus

### Clarté Visuelle

- Design **épuré** : pas de surcharge d'informations
- **Une idée par paragraphe**
- Utiliser des listes à puces plutôt que des blocs de texte
- Espacement généreux entre les sections
- Code dans des blocs distincts avec commentaires ligne par ligne si nécessaire

### Langage

- **Niveau débutant** : phrases courtes, vocabulaire simple
- **Niveau avancé** : vocabulaire technique précis, ton formel
- **Toujours** : éviter les métaphores abstraites, préférer les analogies concrètes du quotidien
- **Jamais** : humour implicite, sarcasme, expressions idiomatiques ambiguës

---

## Structure d'une Fiche

Chaque fiche doit suivre cette structure exacte :

```markdown
---
tags:
  - [Technologie]
  - [Niveau]
  - [Type]
description: "[Description courte de la fiche]"
estimated_time: "[XX min]"
fiche_number: [N]
total_fiches: [Total]
cursus: "[Nom du cursus]"
---

# [Numéro] - [Titre]

> **En bref** : [Objectif reformulé en une phrase]. Lecture estimée : XX min.

## Prérequis

- Liste des fiches à lire avant (avec liens)
- Connaissances nécessaires
- Si aucun prérequis : "Aucune connaissance préalable de [sujet] n'est requise (tout est expliqué ci-dessous)"

## Objectif de cette fiche

Une phrase claire : "À la fin de cette fiche, tu sauras [action concrète]."

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### [Concept 1]

[Voir la structure détaillée d'un concept ci-dessous]

### [Concept 2]

...

---

## Étapes Pratiques

### Étape 1 : [Titre de l'étape]

[Description de ce que fait cette étape]

Commande ou code :

\`\`\`bash
# Commentaire explicatif
commande exemple
\`\`\`

**Résultat attendu** :

\`\`\`text
[Sortie attendue dans le terminal]
\`\`\`

---

### Étape 2 : [Titre de l'étape]

...

---

## Commandes Utiles

| Commande            | Action                          |
| ------------------- | ------------------------------- |
| `commande exemple`  | Description de ce qu'elle fait  |

---

## Pièges Fréquents

### Piège 1 : [Titre du piège]

⚠️ **Problème** : [Description du problème]

✅ **Solution** : [Comment le résoudre]

\`\`\`code
# Exemple de correction si pertinent
\`\`\`

---

## Checklist de Validation

- [ ] J'ai compris [concept 1]
- [ ] J'ai réussi [action 1]
- [ ] Mon résultat ressemble à [description]

---

## Exercice Pratique

**Énoncé** : [Description claire de ce qu'il faut faire]

**Indications** :

- Indication 1
- Indication 2

**Résultat attendu** : [Ce que l'apprenant doit obtenir]

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

[Solution complète avec code et explications]

---

## Navigation

← Fiche précédente : **[Titre](chemin.md)**

→ Fiche suivante : **[Titre](chemin.md)**
```

---

## Structure Détaillée d'un Concept

Chaque concept doit suivre ce pattern exact pour garantir une compréhension complète :

```markdown
### Qu'est-ce que [Concept] ?

**Définition** : [Une phrase claire et précise qui définit le concept]

**Le problème que [Concept] résout** :

Sans [Concept], voici les problèmes rencontrés :

1. **[Problème 1]** : [Explication du problème]
2. **[Problème 2]** : [Explication du problème]
3. **[Problème 3]** : [Explication du problème]

**Comment [Concept] résout ces problèmes** :

| Problème     | Solution apportée par [Concept]  |
| ------------ | -------------------------------- |
| [Problème 1] | [Solution]                       |
| [Problème 2] | [Solution]                       |

**Analogie concrète** : [Une analogie du quotidien, sans métaphore abstraite. Exemples : boîte de déménagement, recette de cuisine, plan de construction]

**Ce que [Concept] n'est PAS** :

- [Concept] n'est pas [confusion fréquente 1]. [Explication de la différence]
- [Concept] n'est pas [confusion fréquente 2]. [Explication de la différence]

**[Si pertinent] Comparaison avec un concept similaire** :

| [Concept A]         | [Concept B]         |
| ------------------- | ------------------- |
| [Caractéristique 1] | [Caractéristique 1] |
| [Caractéristique 2] | [Caractéristique 2] |
```

### Éléments obligatoires pour chaque concept

| Élément | Obligatoire | Quand l'inclure |
| ------- | ----------- | --------------- |
| Définition | Toujours | Toujours |
| Problème résolu | Toujours | Toujours - explique le "pourquoi" |
| Tableau problème/solution | Si ≥ 2 problèmes | Quand plusieurs problèmes sont résolus |
| Analogie concrète | Toujours | Toujours - aide à la compréhension |
| Ce que ce n'est PAS | Si confusion possible | Quand le concept peut être confondu avec un autre |
| Tableau comparatif | Si concept similaire existe | Quand deux concepts sont souvent confondus |

### Exemple complet d'un concept bien rédigé

```markdown
### Qu'est-ce qu'un conteneur ?

**Définition** : Un conteneur est un environnement isolé qui contient un programme et toutes ses dépendances (bibliothèques, fichiers de configuration, outils).

**Le problème que les conteneurs résolvent** :

Sans conteneurs, voici les problèmes rencontrés :

1. **Conflits de versions** : Deux projets nécessitent des versions différentes de PHP.
2. **Différences entre machines** : Le code fonctionne sur ton ordinateur mais pas sur celui d'un collègue.
3. **Installation complexe** : Installer tous les outils nécessaires prend du temps.

**Comment les conteneurs résolvent ces problèmes** :

| Problème                   | Solution apportée par les conteneurs               |
| -------------------------- | -------------------------------------------------- |
| Conflits de versions       | Chaque conteneur a sa propre version, isolée       |
| Différences entre machines | Le conteneur fonctionne de façon identique partout |
| Installation complexe      | Une seule commande installe tout                   |

**Analogie concrète** : Imagine une boîte de déménagement étiquetée "Cuisine". Cette boîte contient tout ce qui concerne la cuisine :
ustensiles, assiettes, épices. Tu peux déplacer cette boîte dans n'importe quelle maison, et tu auras toujours une cuisine fonctionnelle.

**Ce qu'un conteneur n'est PAS** :

- Un conteneur n'est pas une machine virtuelle. Une machine virtuelle simule un ordinateur complet. Un conteneur partage le noyau du système hôte, ce qui le rend plus léger.
- Un conteneur n'est pas permanent. Quand tu le supprimes, tout ce qu'il contient disparaît (sauf les volumes).

**Comparaison conteneur vs machine virtuelle** :

| Conteneur                  | Machine virtuelle              |
| -------------------------- | ------------------------------ |
| Démarre en secondes        | Démarre en minutes             |
| Partage le noyau système   | Système complet isolé          |
| Léger (quelques Mo)        | Lourd (plusieurs Go)           |
| Moins isolé                | Isolation complète             |
```

---

## Règles de Formatage Markdown

### Blocs de code

Toujours spécifier le langage après les trois backticks :

| Type de contenu | Langage à utiliser |
| --------------- | ------------------ |
| Commandes terminal | `bash` |
| Sortie terminal / texte brut | `text` |
| Code PHP | `php` |
| Configuration YAML | `yaml` |
| Configuration Nginx | `nginx` |
| Dockerfile | `dockerfile` |
| Variables d'environnement | `env` |
| SQL | `sql` |
| JavaScript | `javascript` |
| TypeScript | `typescript` |
| JSON | `json` |
| HTML | `html` |
| CSS | `css` |
| Java | `java` |
| Rust | `rust` |
| Python | `python` |
| C / C++ | `c` / `cpp` |
| Makefile | `makefile` |
| Twig | `twig` |
| Jinja2 | `jinja2` |
| Faust | `faust` |
| Solidity | `solidity` |
| PowerShell | `powershell` |
| XML | `xml` |
| JSX / TSX | `jsx` / `tsx` |
| GraphQL | `graphql` |
| Terraform / HCL | `terraform` / `hcl` |
| PromQL | `promql` |
| Diff | `diff` |
| Structure de fichiers | `text` |

La liste complète des langages autorisés est dans `.markdownlint.json` (règle MD040).

### Tableaux

Les tableaux doivent avoir des espaces autour des pipes et des tirets alignés :

```markdown
<!-- ❌ Incorrect -->
|Colonne 1|Colonne 2|
|---------|---------|

<!-- ✅ Correct -->
| Colonne 1 | Colonne 2 |
| --------- | --------- |
```

### Listes

Toujours laisser une ligne vide avant une liste :

```markdown
<!-- ❌ Incorrect -->
**Titre** :
- Élément 1
- Élément 2

<!-- ✅ Correct -->
**Titre** :

- Élément 1
- Élément 2
```

### Séparateurs

Utiliser `---` entre les sections principales pour une meilleure lisibilité.

### Diagrammes (diagram-design)

- Nouveau diagramme : un fichier HTML autonome dans `docs/diagrams/` (SVG inline, `role="img"`, `<title>` / `<desc>` prefixés). Skill : [cathrynlavery/diagram-design](https://github.com/cathrynlavery/diagram-design).
- Types : architecture, flowchart, sequence, state, ER, tree, layers, process, data-flow. Pas de figure publiée en Mermaid, D2 ou draw.io.
- Fichier unique, hors ligne, sans JavaScript Mermaid et sans Google Fonts. Police system-ui / Georgia / ui-monospace.
- Dans la fiche : lien plus iframe vers le HTML (classe `diagram-design`). Max ~15 nœuds. Labels en français, identifiants en anglais.

### Formules KaTeX

- Inline : `$formule$` pour les formules dans le texte
- Block : `$$formule$$` pour les formules centrées
- Utiliser uniquement dans les fiches où les maths sont nécessaires (IA, Faust)

### Accentuation française

- **Obligatoire** : tous les textes en français doivent porter les accents corrects
- Exemples courants : définition, méthode, référence, paramètre, étape, système, déploiement, prérequis, mémoire, sécurité, événement, précédent, problème, répertoire, nécessaire, différent, vérifier, générer, créé, exécuter
- Les accents ne s'appliquent **pas** dans : les blocs de code, le code inline, les URLs, les chemins de fichiers, les identifiants techniques
- Le script `fix-accents.js` corrige automatiquement les accents manquants au commit

---

## Règles de Code

### Commentaires

- Commenter **chaque ligne non triviale**
- Expliquer le **pourquoi**, pas seulement le **quoi**

```php
// Mauvais commentaire :
$user = new User(); // Crée un utilisateur

// Bon commentaire :
$user = new User(); // On crée un objet User vide qu'on va remplir ensuite
```

### Exemples

- Toujours donner un exemple **complet et fonctionnel**
- Montrer l'entrée ET la sortie attendue
- Inclure les imports/use nécessaires

### Erreurs

- Montrer les messages d'erreur courants
- Expliquer ce que chaque partie du message signifie
- Donner la solution pas à pas

---

## Environnement de Développement

- **IDE** : VS Code
- **Contrainte** : Environnement **OFFLINE** - aucune extension nécessitant internet
- Documenter uniquement les extensions locales ou intégrées
- Fournir des configurations copiables/collables

---

## Organisation des Fichiers

```text
docs/
├── commencer/
│   └── index.md
├── 01-docker/
│   ├── 01-concepts-base.md
│   ├── 02-installation.md
│   └── ...
├── 02-php/
│   ├── 01-syntaxe-base.md
│   └── ...
├── 03-symfony/
├── 04-postgresql/
├── 05-javascript/
└── fiches-reference/
    └── (fiches courtes de référence rapide)
```

---

## Nomenclature

- Fichiers : `[numéro]-[sujet-en-kebab-case].md`
- Dossiers : `[numéro]-[technologie]/`
- Toujours en minuscules, sans espaces ni caractères spéciaux
- Exceptions de nommage : `fiches-reference`, `diagrams`, `fondamentaux`, `competences-metier`

---

## Principes Pédagogiques Clés

### À FAIRE

- Donner des règles explicites et sans exception (ou lister les exceptions clairement)
- Utiliser des patterns répétitifs et prévisibles
- Fournir des templates réutilisables
- Expliquer le "pourquoi" derrière chaque règle
- Donner des critères objectifs de réussite
- Réduire la charge cognitive avec des étapes courtes, une structure stable et un contexte entièrement explicite
- Préserver la compatibilité avec les besoins fréquents d'un public neurodivergent

### À ÉVITER

- Ambiguïté ("généralement", "parfois", "ça dépend" sans préciser de quoi)
- Instructions incomplètes
- Supposer que quelque chose est "évident"
- Changements de format imprévisibles entre fiches
- Trop d'informations sur une même page

---

## Tonalité

- **Respectueuse** : jamais condescendante
- **Directe** : aller droit au but
- **Encourageante sans excès** : éviter les superlatifs ("Super !", "Génial !")
- **Neutre** : pas de jugement sur la vitesse d'apprentissage

---

## Exemple de Formulations

| ❌ Éviter | ✅ Préférer |
|-----------|-------------|
| "C'est simple, il suffit de..." | "Voici les étapes à suivre :" |
| "Comme tu le sais déjà..." | "Rappel : [concept]" |
| "Évidemment..." | (supprimer, expliquer directement) |
| "Tu devrais pouvoir..." | "L'objectif est de..." |
| "En gros..." | "Précisément : ..." |

## Interdictions spécifiques

- **Jamais** de `docker compose down -v` (détruit les données MkDocs)
- **Jamais** de push direct sur master sans validation CI
- **Jamais** d'em dashes (-) dans le contenu, utiliser des tirets simples (-)
- **Transparence obligatoire sur l'IA** : le README, l'index et la page À propos doivent indiquer clairement que la majorité du corpus a été générée ou largement développée avec l'aide de l'intelligence artificielle
- **Jamais** présenter une validation automatique ou une assistance par IA comme une garantie d'exactitude ou une relecture humaine complète
- **Jamais** de placeholder URL (`URL0`, `URL1`, etc.) dans les fiches

## Documentation de projet (mainteneurs)

Après des changements structurants (nouveaux cursus, CI, licence), mettre à jour le README et `docs/a-propos.md` pour qu'ils restent exacts. La source de vérité publique est ce dépôt, pas un wiki interne.

Build strict de validation :

```bash
docker run --rm -v "$(pwd)":/docs squidfunk/mkdocs-material:9.7.6 build --strict
```
