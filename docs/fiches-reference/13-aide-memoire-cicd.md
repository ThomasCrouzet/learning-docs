---
tags:
  - Référence
  - CI/CD
description: "Aide-mémoire CI/CD : GitHub Actions, GitLab CI et stratégies de déploiement"
estimated_time: "20 min"
fiche_number: 13
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire CI/CD

> **En bref** : Aide-mémoire CI/CD. Lecture estimée : 20 min.

Fiche de référence rapide pour la CI/CD : structure des workflows GitHub Actions, GitLab CI, commandes CLI et stratégies de déploiement.

---

## GitHub Actions - Structure d'un workflow

```yaml
name: CI
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: "22"
          cache: "npm"
      - run: npm ci
      - run: npm test
```

---

## Triggers (on:)

| Trigger | Description |
| ------- | ----------- |
| `push` | Code poussé sur une branche |
| `pull_request` | PR créée ou mise à jour |
| `schedule` | Cron planifié (`"0 2 * * *"`) |
| `workflow_dispatch` | Déclenchement manuel |
| `release` | Release publiée |
| `workflow_call` | Appelé par un autre workflow |

### Filtrer par branche

```yaml
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]
```

---

## Actions courantes

| Action | Usage |
| ------ | ----- |
| `actions/checkout@v5` | Récupérer le code |
| `actions/setup-node@v5` | Installer Node.js |
| `shivammathur/setup-php@v2` | Installer PHP |
| `actions/cache@v5` | Mettre en cache des fichiers |
| `actions/upload-artifact@v5` | Sauvegarder des artefacts |
| `actions/download-artifact@v4` | Récupérer des artefacts |
| `docker/build-push-action@v6` | Build et push image Docker |
| `docker/login-action@v3` | Connexion au registry Docker |

---

## Cache

```yaml
- uses: actions/cache@v5
  with:
    path: vendor
    key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
    restore-keys: ${{ runner.os }}-composer-
```

---

## Matrice de builds

```yaml
strategy:
  fail-fast: false
  matrix:
    php-version: ["8.2", "8.3"]
    os: [ubuntu-latest]
```

---

## Conditions (if:)

| Condition | Description |
| --------- | ----------- |
| `if: github.ref == 'refs/heads/main'` | Branche main uniquement |
| `if: github.event_name != 'pull_request'` | Pas sur une PR |
| `if: failure()` | Si un step précédent a échoué |
| `if: always()` | Toujours exécuter |
| `if: success()` | Si tout est OK |

---

## Variables de contexte

| Variable | Valeur |
| -------- | ------ |
| `${{ github.repository }}` | Nom du dépôt |
| `${{ github.ref_name }}` | Nom de la branche ou tag |
| `${{ github.sha }}` | SHA du commit |
| `${{ github.actor }}` | Utilisateur déclencheur |
| `${{ github.run_number }}` | Numéro du run |
| `${{ secrets.NOM }}` | Secret du dépôt |

---

## Secrets et permissions

```yaml
# Utiliser un secret
env:
  API_KEY: ${{ secrets.API_KEY }}

# Permissions Docker (GHCR)
permissions:
  contents: read
  packages: write
```

---

## Concurrence

```yaml
concurrency:
  group: deploy-${{ github.ref_name }}
  cancel-in-progress: true
```

---

## Commandes CLI (gh)

| Commande | Action |
| -------- | ------ |
| `gh run list` | Lister les exécutions récentes |
| `gh run view <id>` | Détails d'une exécution |
| `gh run watch <id>` | Suivre en temps réel |
| `gh run rerun <id>` | Relancer une exécution |
| `gh run download <id>` | Télécharger les artefacts |
| `gh secret set NOM` | Créer/modifier un secret |
| `gh secret list` | Lister les secrets |

---

## GitLab CI - Structure

```yaml
stages:
  - lint
  - test
  - build
  - deploy

image: php:8.3-cli

test-php:
  stage: test
  script:
    - composer install --no-interaction
    - vendor/bin/phpunit --testdox
  cache:
    key:
      files: [composer.lock]
    paths: [vendor/]
```

---

## GitLab CI - Services

```yaml
test-integration:
  stage: test
  services:
    - name: postgres:16-alpine
      alias: postgres
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: test_user
    POSTGRES_PASSWORD: test_pass
    DATABASE_URL: "postgresql://test_user:test_pass@postgres:5432/test_db"
```

---

## GitLab CI - Variables prédéfinies

| Variable | Valeur |
| -------- | ------ |
| `$CI_COMMIT_BRANCH` | Nom de la branche |
| `$CI_COMMIT_TAG` | Nom du tag |
| `$CI_COMMIT_SHORT_SHA` | SHA court |
| `$CI_PROJECT_NAME` | Nom du projet |
| `$CI_REGISTRY_IMAGE` | URL de l'image registry |
| `$CI_PIPELINE_SOURCE` | Type de pipeline |

---

## Exécution locale

| Outil | Commande |
| ----- | -------- |
| act (GitHub Actions) | `act push` |
| act - un seul job | `act push -j <job>` |
| act - avec secrets | `act push --secret-file .secrets` |
| act - lister les jobs | `act --list` |

> **Note** : la commande `gitlab-runner exec` a été **retirée** (GitLab Runner 16+). Pour tester un job GitLab CI en local, utilise un runner local enregistré, un pipeline sur une branche de test, ou un outil tiers documenté par ton équipe.

---

## Stratégies de déploiement

| Stratégie | Principe | Rollback |
| --------- | -------- | -------- |
| Blue-Green | 2 environnements identiques, bascule du trafic | Instantané (rebascule) |
| Canary | Déploiement progressif (5% -> 25% -> 100%) | Rapide (réduire le %) |
| Rolling Update | Mise à jour instance par instance | Plus lent |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| Oublier `actions/checkout@v5` | Toujours en premier step |
| Indentation YAML incorrecte | 2 espaces par niveau, jamais de tabs |
| `npm install` en CI | Utiliser `npm ci` (plus fiable avec le lockfile) |
| `composer install` sans `--no-interaction` | Le pipeline bloque en attente d'input |
| Cache basé sur `composer.json` | Utiliser `hashFiles('composer.lock')` |
| Tests passent en local, échouent en CI | Chemins relatifs, timezone, variables d'environnement |
| Secret exposé dans les logs | Ne jamais `echo` un secret |
| `localhost` dans les services GitLab CI | Utiliser le nom du service (`postgres`, `redis`) |
| `docker compose down -v` en CI | Détruit les volumes de données |
| Fichier `.gitlab-ci.yml` non détecté | Doit être à la racine avec le point initial |

---

## Liens utiles

- [01 - Introduction CI/CD](../11-ci-cd/01-introduction-ci-cd.md)
- [02 - GitHub Actions premiers pas](../11-ci-cd/02-github-actions-premiers-pas.md)
- [05 - GitHub Actions avancé](../11-ci-cd/05-github-actions-avance.md)
- [06 - GitLab CI](../11-ci-cd/06-gitlab-ci-introduction.md)
- [08 - Exécution locale](../11-ci-cd/08-execution-locale-pipelines.md)
- [09 - Stratégies de déploiement](../11-ci-cd/09-strategies-deploiement.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire TypeScript](12-aide-memoire-typescript.md)**

→ Fiche suivante : **[Aide-mémoire API Design](14-aide-memoire-api-design.md)**
