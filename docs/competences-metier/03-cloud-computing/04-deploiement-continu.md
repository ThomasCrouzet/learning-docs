---
tags:
  - Méthodologie
  - Intermédiaire
  - Pratique
description: "04 - Le Déploiement Continu (CI/CD)"
estimated_time: "35 min"
fiche_number: 4
total_fiches: 5
cursus: "Cloud computing"
---

# 04 - Le Déploiement Continu (CI/CD)

> **En bref** : À la fin de cette fiche, tu sauras ce qu'est l'intégration continue (CI) et le déploiement continu (CD), comment configurer des pipelines automatisés avec GitLab CI et GitHub Actions, et tu comprendras les bonnes pratiques de déploiement. Lecture estimée : 35 min.


## Prérequis

- Fiche **[03 - L'Infrastructure as Code](03-infrastructure-as-code.md)**
- Fiche **[01-docker/01-docker-compose-symfony.md](../../01-docker/01-docker-compose-symfony.md)** (Docker)
- Connaissances de base en Git

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ce qu'est l'intégration continue (CI) et le déploiement continu (CD), comment configurer des pipelines automatisés avec GitLab CI et GitHub Actions, et tu comprendras les bonnes pratiques de déploiement.

---

## Concepts

### Qu'est-ce que CI/CD ?

**Définition** :

| Terme | Signification | Description |
| ----- | ------------- | ----------- |
| **CI** | Continuous Integration | Intégrer et tester le code automatiquement à chaque commit |
| **CD** | Continuous Delivery | Préparer automatiquement le code pour le déploiement |
| **CD** | Continuous Deployment | Déployer automatiquement en production |

**Le problème que CI/CD résout** :

Sans CI/CD, voici les problèmes rencontrés :

1. **Intégration tardive** : Les conflits de code sont découverts trop tard.
2. **Tests manuels** : Oublis, erreurs, lenteur.
3. **Déploiements risqués** : "Ça marchait sur ma machine".
4. **Livraisons lentes** : Plusieurs jours entre un commit et la mise en production.
5. **Bugs en production** : Détectés par les utilisateurs, pas par les développeurs.

**Comment CI/CD résout ces problèmes** :

| Problème | Solution CI/CD |
| -------- | -------------- |
| Intégration tardive | Intégration à chaque commit |
| Tests manuels | Tests automatisés |
| Déploiements risqués | Environnements identiques |
| Livraisons lentes | Déploiement en quelques minutes |
| Bugs en production | Détection avant déploiement |

**Analogie concrète** : CI/CD est comme une chaîne de montage automobile. Chaque pièce (commit) passe par des postes de contrôle automatiques (tests). Si une pièce est défectueuse, la chaîne s'arrête immédiatement. Une voiture ne quitte l'usine (production) que si tous les contrôles sont passés.

---

### Qu'est-ce qu'un pipeline ?

**Définition** : Un pipeline est une séquence d'étapes automatisées qui transforment le code source en application déployée.

Le diagramme suivant montre les étapes d'un pipeline CI/CD complet.

<div class="diagram-design">
<p><a href="../../../diagrams/competences-metier-03-cloud-computing-04-deploiement-continu-1.html">Qu&#x27;est-ce qu&#x27;un pipeline ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/competences-metier-03-cloud-computing-04-deploiement-continu-1.html" title="Qu&#x27;est-ce qu&#x27;un pipeline ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Structure d'un pipeline typique** :

```text
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────┐
│  Build  │ → │  Test   │ → │  Scan   │ → │ Package │ → │ Deploy  │
└─────────┘    └─────────┘    └─────────┘    └─────────┘    └─────────┘
     │              │              │              │              │
     ▼              ▼              ▼              ▼              ▼
 Compiler      Tests auto     Sécurité      Image Docker   Mise en prod
```

**Concepts clés** :

| Concept | Description |
| ------- | ----------- |
| **Stage** | Groupe d'étapes (ex: build, test, deploy) |
| **Job** | Tâche individuelle dans un stage |
| **Artifact** | Fichier produit par un job (ex: JAR, image Docker) |
| **Runner** | Machine qui exécute les jobs |
| **Trigger** | Événement qui déclenche le pipeline (push, merge request) |

---

### Quelles sont les stratégies de déploiement ?

| Stratégie | Description | Risque | Rollback |
| --------- | ----------- | ------ | -------- |
| **Big Bang** | Tout remplacer d'un coup | Élevé | Difficile |
| **Rolling** | Remplacer les instances une par une | Moyen | Moyen |
| **Blue/Green** | Deux environnements, basculer le trafic | Faible | Instantané |
| **Canary** | Déployer sur un petit % d'utilisateurs | Très faible | Rapide |

**Blue/Green deployment** :

```text
        ┌─────────────────┐
        │  Load Balancer  │
        └────────┬────────┘
                 │
    ┌────────────┴────────────┐
    │                         │
    ▼                         ▼
┌─────────┐             ┌─────────┐
│  Blue   │             │  Green  │
│  (v1.0) │             │  (v1.1) │
│ ACTIVE  │             │ STANDBY │
└─────────┘             └─────────┘

Après basculement :
    Blue = STANDBY (v1.0)
    Green = ACTIVE (v1.1)
```

---

## Étapes Pratiques

### Étape 1 : Configurer GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - security
  - deploy

variables:
  DOCKER_IMAGE: $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA

# Cache des dépendances
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/
    - node_modules/

# Job de build
build:
  stage: build
  image: composer:2
  script:
    - composer install --no-dev --optimize-autoloader
    - npm ci
    - npm run build
  artifacts:
    paths:
      - vendor/
      - public/build/
    expire_in: 1 hour

# Tests unitaires
test:unit:
  stage: test
  image: php:8.3-cli
  needs: [build]
  script:
    - php bin/phpunit --testsuite=unit
  coverage: '/^\s*Lines:\s*\d+.\d+\%/'

# Tests fonctionnels
test:functional:
  stage: test
  image: php:8.3-cli
  needs: [build]
  services:
    - postgres:16
  variables:
    DATABASE_URL: "postgresql://postgres:postgres@postgres:5432/test_db"
  script:
    - php bin/phpunit --testsuite=functional

# Analyse de sécurité
security:sast:
  stage: security
  image: semgrep/semgrep
  script:
    - semgrep --config=auto --error src/
  allow_failure: true

# Déploiement staging
deploy:staging:
  stage: deploy
  image: docker:24
  environment:
    name: staging
    url: https://staging.example.com
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
    - ssh deploy@staging "docker pull $DOCKER_IMAGE && docker compose up -d"
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"

# Déploiement production (manuel)
deploy:production:
  stage: deploy
  image: docker:24
  environment:
    name: production
    url: https://example.com
  script:
    - docker build -t $DOCKER_IMAGE .
    - docker push $DOCKER_IMAGE
    - ssh deploy@production "docker pull $DOCKER_IMAGE && docker compose up -d"
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
```

---

### Étape 2 : Configurer GitHub Actions

```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v5

      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          extensions: pdo_pgsql, intl
          coverage: xdebug

      - name: Install dependencies
        run: composer install --prefer-dist --no-progress

      - name: Cache Composer packages
        uses: actions/cache@v5
        with:
          path: vendor
          key: ${{ runner.os }}-php-${{ hashFiles('**/composer.lock') }}

      - name: Upload artifacts
        uses: actions/upload-artifact@v5
        with:
          name: build
          path: |
            vendor/
            public/build/

  test:
    runs-on: ubuntu-latest
    needs: build
    services:
      postgres:
        image: postgres:16
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: test_db
        ports:
          - 5432:5432
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - uses: actions/checkout@v5

      - uses: shivammathur/setup-php@v2
        with:
          php-version: '8.3'
          coverage: xdebug

      - name: Download artifacts
        uses: actions/download-artifact@v5
        with:
          name: build

      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:postgres@localhost:5432/test_db
        run: |
          php bin/phpunit --coverage-text

  security:
    runs-on: ubuntu-latest
    needs: build
    steps:
      - uses: actions/checkout@v5

      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          scan-type: 'fs'
          scan-ref: '.'

  deploy-staging:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/develop'
    environment:
      name: staging
      url: https://staging.example.com
    steps:
      - uses: actions/checkout@v5

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:staging

      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # ssh deploy@staging "docker compose pull && docker compose up -d"

  deploy-production:
    runs-on: ubuntu-latest
    needs: [test, security]
    if: github.ref == 'refs/heads/main'
    environment:
      name: production
      url: https://example.com
    steps:
      - uses: actions/checkout@v5

      - name: Login to Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v5
        with:
          context: .
          push: true
          tags: |
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest
            ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}

      - name: Deploy to production
        run: |
          echo "Deploying to production..."
```

---

### Étape 3 : Dockerfile optimisé pour CI/CD

```dockerfile
# Dockerfile
# Étape 1 : Build
FROM composer:2 AS composer-build
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader
COPY . .
RUN composer dump-autoload --optimize

# Étape 2 : Assets frontend
FROM node:22-alpine AS node-build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Étape 3 : Image finale
FROM php:8.3-fpm-alpine

# Installer les extensions PHP
RUN apk add --no-cache postgresql-dev \
    && docker-php-ext-install pdo_pgsql opcache

# Copier la configuration PHP optimisée
COPY docker/php.ini /usr/local/etc/php/conf.d/custom.ini

# Copier l'application
WORKDIR /var/www/html
COPY --from=composer-build /app/vendor ./vendor
COPY --from=node-build /app/public/build ./public/build
COPY . .

# Permissions
RUN chown -R www-data:www-data var/

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
    CMD php-fpm-healthcheck || exit 1

EXPOSE 9000
CMD ["php-fpm"]
```

---

### Étape 4 : Tests automatisés dans le pipeline

```xml
<!-- phpunit.xml.dist -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         colors="true"
         bootstrap="tests/bootstrap.php">
    <testsuites>
        <testsuite name="unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="functional">
            <directory>tests/Functional</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory suffix=".php">src</directory>
        </include>
    </source>

    <coverage>
        <report>
            <clover outputFile="coverage.xml"/>
            <text outputFile="php://stdout"/>
        </report>
    </coverage>

    <php>
        <env name="APP_ENV" value="test"/>
        <env name="KERNEL_CLASS" value="App\Kernel"/>
    </php>
</phpunit>
```

---

### Étape 5 : Gestion des environnements

```yaml
# docker-compose.yml pour le déploiement
services:
  app:
    image: ${DOCKER_IMAGE:-myapp:latest}
    restart: unless-stopped
    environment:
      - APP_ENV=${APP_ENV:-prod}
      - DATABASE_URL=${DATABASE_URL}
      - APP_SECRET=${APP_SECRET}
    depends_on:
      - db
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf:ro
    depends_on:
      - app
    networks:
      - app-network

  db:
    image: postgres:16-alpine
    restart: unless-stopped
    environment:
      - POSTGRES_DB=${DB_NAME}
      - POSTGRES_USER=${DB_USER}
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - db-data:/var/lib/postgresql/data
    networks:
      - app-network

networks:
  app-network:

volumes:
  db-data:
```

```bash
# Script de déploiement
#!/bin/bash
# deploy.sh

set -e

echo "Pulling latest images..."
docker compose pull

echo "Starting services..."
docker compose up -d

echo "Running migrations..."
docker compose exec -T app php bin/console doctrine:migrations:migrate --no-interaction

echo "Clearing cache..."
docker compose exec -T app php bin/console cache:clear

echo "Deployment complete!"
```

---

### Étape 6 : Notifications et monitoring

```yaml
# GitLab CI : notifications Slack
notify:success:
  stage: .post
  script:
    - 'curl -X POST -H "Content-type: application/json"
       --data "{\"text\":\"✅ Deployment successful: $CI_PROJECT_NAME ($CI_COMMIT_REF_NAME)\"}"
       $SLACK_WEBHOOK_URL'
  when: on_success
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

notify:failure:
  stage: .post
  script:
    - 'curl -X POST -H "Content-type: application/json"
       --data "{\"text\":\"❌ Pipeline failed: $CI_PROJECT_NAME ($CI_COMMIT_REF_NAME)\"}"
       $SLACK_WEBHOOK_URL'
  when: on_failure
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `gitlab-ci-local` | Tester un job GitLab CI localement (`gitlab-runner exec` a été retiré dans GitLab Runner 16) |
| `act` | Tester GitHub Actions localement |
| `docker build -t app:test .` | Builder l'image Docker |
| `docker compose up -d` | Démarrer les services |
| `docker compose logs -f` | Voir les logs en temps réel |

---

## Pièges Fréquents

### Piège 1 : Tests qui passent localement mais échouent en CI

⚠️ **Problème** : Différences d'environnement (versions, variables, services).

✅ **Solution** : Utiliser Docker pour avoir le même environnement partout.

```yaml
# Utiliser la même image en local et en CI
test:
  image: php:8.3-cli
  services:
    - postgres:16
```

---

### Piège 2 : Secrets exposés dans les logs

⚠️ **Problème** : Les variables d'environnement sont affichées dans les logs.

✅ **Solution** : Masquer les variables sensibles.

```yaml
# GitLab CI
variables:
  DATABASE_PASSWORD:
    value: $DATABASE_PASSWORD
    masked: true
```

---

### Piège 3 : Pipeline trop long

⚠️ **Problème** : 30 minutes d'attente pour chaque commit.

✅ **Solution** : Paralléliser les jobs et utiliser le cache.

```yaml
# Jobs en parallèle
test:unit:
  stage: test
  parallel: 3
  script:
    - php bin/phpunit --testsuite=unit

# Cache des dépendances
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/
    - node_modules/
```

---

### Piège 4 : Rollback impossible

⚠️ **Problème** : Impossible de revenir à la version précédente rapidement.

✅ **Solution** : Taguer les images Docker avec le SHA du commit.

```yaml
# Garder plusieurs versions
tags:
  - $CI_REGISTRY_IMAGE:$CI_COMMIT_SHA
  - $CI_REGISTRY_IMAGE:latest
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre CI et CD
- [ ] Je sais configurer un pipeline GitLab CI ou GitHub Actions
- [ ] Je connais les différentes stratégies de déploiement
- [ ] Je sais écrire un Dockerfile multi-stage optimisé
- [ ] Je comprends l'importance des tests automatisés
- [ ] Je sais gérer les secrets dans un pipeline

---

## Exercice Pratique

**Énoncé** : Crée un fichier `.gitlab-ci.yml` pour une application Symfony avec :

1. Un stage de build (composer install)
2. Un stage de test (PHPUnit)
3. Un stage de déploiement vers staging (uniquement sur la branche develop)

**Résultat attendu** : Un pipeline fonctionnel avec 3 stages.

---

## Solution de l'Exercice

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

variables:
  # Désactiver le clone automatique pour certains jobs
  GIT_STRATEGY: fetch

# Configuration PHP commune
.php-setup: &php-setup
  image: php:8.3-cli
  before_script:
    - apt-get update && apt-get install -y git unzip libpq-dev
    - docker-php-ext-install pdo_pgsql
    - curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Cache Composer
cache:
  key: ${CI_COMMIT_REF_SLUG}
  paths:
    - vendor/

# Stage Build
build:
  <<: *php-setup
  stage: build
  script:
    - composer install --no-dev --optimize-autoloader
  artifacts:
    paths:
      - vendor/
    expire_in: 1 hour

# Stage Test
test:
  <<: *php-setup
  stage: test
  needs: [build]
  services:
    - name: postgres:16
      alias: db
  variables:
    POSTGRES_DB: test_db
    POSTGRES_USER: postgres
    POSTGRES_PASSWORD: postgres
    DATABASE_URL: "postgresql://postgres:postgres@db:5432/test_db"
  script:
    - composer install  # Inclut les dépendances de dev
    - php bin/console doctrine:database:create --if-not-exists --env=test
    - php bin/console doctrine:migrations:migrate --no-interaction --env=test
    - php bin/phpunit
  coverage: '/^\s*Lines:\s*\d+.\d+\%/'

# Stage Deploy Staging
deploy:staging:
  stage: deploy
  image: alpine:latest
  needs: [test]
  before_script:
    - apk add --no-cache openssh-client
    - eval $(ssh-agent -s)
    - echo "$SSH_PRIVATE_KEY" | ssh-add -
    - mkdir -p ~/.ssh
    - echo "$SSH_KNOWN_HOSTS" >> ~/.ssh/known_hosts
  script:
    - ssh deploy@staging.example.com "cd /var/www/app && git pull origin develop && composer install --no-dev && php bin/console cache:clear"
  environment:
    name: staging
    url: https://staging.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "develop"
```

**Variables à configurer dans GitLab** (Settings > CI/CD > Variables) :

| Variable | Description |
| -------- | ----------- |
| `SSH_PRIVATE_KEY` | Clé SSH privée pour le déploiement |
| `SSH_KNOWN_HOSTS` | Fingerprint du serveur staging |

---

## Navigation

← Fiche précédente : **[03 - L'Infrastructure as Code (IaC)](03-infrastructure-as-code.md)**

→ Fiche suivante : **[05 - Les Bases de Kubernetes](05-kubernetes-bases.md)**
