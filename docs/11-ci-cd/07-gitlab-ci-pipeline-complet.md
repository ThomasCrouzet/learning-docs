---
tags:
  - CI/CD
  - Intermédiaire
  - Pratique
description: "Construire un pipeline GitLab CI complet avec services, cache, artefacts et environments"
estimated_time: "90 min"
fiche_number: 7
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 07 - GitLab CI - Pipeline complet

> **En bref** : Cette fiche t'apprend à construire un pipeline GitLab CI complet : services (PostgreSQL, Redis), cache avancé, artefacts, environments GitLab et review apps. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [06 - GitLab CI - Introduction](06-gitlab-ci-introduction.md)
- Connaître les bases de Docker (images, conteneurs, réseaux)
- Connaître les bases de PostgreSQL (connexion, requêtes simples)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un pipeline GitLab CI avec des services Docker (PostgreSQL, Redis), configurer le cache avancé, utiliser les artefacts et les rapports, mettre en place des environments GitLab et comprendre les review apps.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un service dans GitLab CI ?

**Définition** : Un service est un conteneur Docker supplémentaire qui s'exécute à côté du job principal. Il fournit un service réseau (base de données, cache, API) accessible par le job pendant son exécution.

**Le problème que les services résolvent** :

Sans services, voici les problèmes rencontrés :

1. **Pas de base de données** : Les tests d'intégration ont besoin d'une base PostgreSQL. Sans service, il faut installer PostgreSQL dans le même conteneur que PHP, ce qui est complexe et fragile.

2. **Configuration manuelle** : Tu dois écrire des scripts pour installer, configurer et démarrer PostgreSQL dans le `before_script`. Cela ajoute des minutes au pipeline.

**Comment les services résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de base de données | Le service lance un conteneur PostgreSQL automatiquement |
| Configuration manuelle | GitLab configure le réseau et les variables de connexion |

**Analogie concrète** : Imagine un bureau de travail. Le job principal est ton ordinateur. Les services sont les périphériques branchés dessus : une imprimante (PostgreSQL), un disque externe (Redis). Chaque périphérique fonctionne indépendamment mais est accessible depuis ton ordinateur.

**Ce qu'un service n'est PAS** :

- Un service n'est pas permanent. Il est créé au début du job et détruit à la fin. Les données ne persistent pas entre les jobs.
- Un service n'est pas un serveur de production. Il sert uniquement pour les tests dans le pipeline.

**Comment le job accède au service** :

```text
Le service est accessible par son nom d'image (sans le tag).
PostgreSQL → hostname: postgres
Redis      → hostname: redis
MySQL      → hostname: mysql

Exemple de connexion :
  Host : postgres
  Port : 5432
  User : défini par la variable d'environnement
  Pass : défini par la variable d'environnement
```

---

### Qu'est-ce que le cache avancé dans GitLab CI ?

**Définition** : Le cache dans GitLab CI sauvegarde des fichiers entre les exécutions de pipeline. Le cache avancé permet de définir des stratégies de cache par job, par branche, et de contrôler quand le cache est lu ou écrit.

**Le problème que le cache avancé résout** :

Sans cache avancé, voici les problèmes rencontrés :

1. **Cache partagé inadéquat** : Le même cache est utilisé par tous les jobs. Le job de lint pollue le cache du job de test.

2. **Cache obsolète** : Le cache d'une branche de feature contient des dépendances obsolètes. Les tests échouent avec des erreurs mystérieuses.

**Comment le cache avancé résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Cache partagé inadéquat | Chaque job peut avoir sa propre clé de cache |
| Cache obsolète | La politique `pull-push` ou `pull` contrôle la lecture/écriture |

**Politiques de cache** :

| Politique | Comportement |
| --- | --- |
| `pull-push` (défaut) | Lit le cache au début, écrit le cache à la fin |
| `pull` | Lit le cache au début, ne le met pas à jour |
| `push` | N'utilise pas le cache existant, écrit un nouveau cache |

---

### Qu'est-ce qu'un artefact dans GitLab CI ?

**Définition** : Un artefact est un fichier ou un dossier produit par un job et transmis aux jobs suivants ou téléchargeable depuis l'interface GitLab.

**Différence entre cache et artefact dans GitLab CI** :

| Cache | Artefact |
| --- | --- |
| Accélère les jobs (dépendances) | Transmet des résultats entre jobs |
| Partagé entre exécutions du même pipeline | Transmis aux jobs du même pipeline |
| Non garanti (peut disparaître) | Garanti (toujours disponible dans le pipeline) |
| Défini par `cache:` | Défini par `artifacts:` |

---

### Qu'est-ce qu'un environment GitLab ?

**Définition** : Un environment GitLab est une destination de déploiement nommée (staging, production). Il permet de suivre les déploiements, d'afficher l'URL de l'application, et de revenir à une version précédente (rollback).

**Le problème que les environments résolvent** :

Sans environments, voici les problèmes rencontrés :

1. **Pas de suivi** : Tu ne sais pas quelle version du code est déployée sur quel serveur.

2. **Pas de rollback** : Si un déploiement échoue, tu ne peux pas revenir facilement à la version précédente.

**Comment les environments résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de suivi | GitLab affiche la version déployée pour chaque environment |
| Pas de rollback | Un bouton "Rollback" permet de redéployer une version précédente |

---

### Qu'est-ce qu'une review app ?

**Définition** : Une review app est un environnement temporaire créé automatiquement pour chaque merge request. Elle permet de tester les changements dans un environnement isolé avant de fusionner le code.

**Le problème que les review apps résolvent** :

Sans review apps, le reviewer lit le code de la merge request mais ne peut pas tester l'application. Il doit cloner la branche localement, installer les dépendances, et lancer l'application.

**Comment les review apps résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Pas de test en direct | La review app déploie la branche automatiquement |
| Installation locale | Le reviewer clique sur un lien pour voir l'application |

---

## Étapes Pratiques

### Étape 1 : Pipeline avec service PostgreSQL

Crée le fichier `.gitlab-ci.yml` :

```yaml
# Pipeline avec service PostgreSQL pour les tests d'intégration
stages:
  - test

test-integration:
  stage: test
  # Image PHP avec les extensions nécessaires
  image: php:8.3-cli

  # Service PostgreSQL : un conteneur PostgreSQL s'exécute à côté du job
  services:
    - name: postgres:16-alpine
      # Alias : nom utilisé pour se connecter au service
      alias: postgres

  # Variables d'environnement pour configurer PostgreSQL
  variables:
    # Variables pour le service PostgreSQL
    POSTGRES_DB: "test_db"
    POSTGRES_USER: "test_user"
    POSTGRES_PASSWORD: "test_password"
    # Variable pour l'application (connexion à PostgreSQL)
    DATABASE_URL: "postgresql://test_user:test_password@postgres:5432/test_db"

  before_script:
    # Installer les extensions PHP nécessaires
    - apt-get update -qq
    - apt-get install -y -qq libpq-dev unzip git
    - docker-php-ext-install pdo pdo_pgsql
    # Installer Composer
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    # Installer les dépendances
    - composer install --prefer-dist --no-interaction
    # Attendre que PostgreSQL soit prêt
    - |
      echo "Attente de PostgreSQL..."
      for i in $(seq 1 30); do
        if pg_isready -h postgres -p 5432 -U test_user 2>/dev/null; then
          echo "PostgreSQL est prêt !"
          break
        fi
        echo "Tentative $i/30..."
        sleep 1
      done

  script:
    # Vérifier la connexion à PostgreSQL
    - php -r "new PDO('$DATABASE_URL');" && echo "Connexion OK"
    # Exécuter les migrations
    - php bin/console doctrine:migrations:migrate --no-interaction || true
    # Exécuter les tests
    - vendor/bin/phpunit --testdox
```

**Résultat attendu** :

```text
Le pipeline :
1. Lance un conteneur PostgreSQL 16
2. Lance un conteneur PHP 8.3
3. Installe les extensions et Composer
4. Attend que PostgreSQL soit prêt
5. Exécute les tests avec la base de données
```

---

### Étape 2 : Pipeline avec services multiples (PostgreSQL + Redis)

```yaml
stages:
  - test

test-with-services:
  stage: test
  image: php:8.3-cli

  # Deux services : PostgreSQL ET Redis
  services:
    - name: postgres:16-alpine
      alias: postgres
    - name: redis:7-alpine
      alias: redis

  variables:
    POSTGRES_DB: "test_db"
    POSTGRES_USER: "test_user"
    POSTGRES_PASSWORD: "test_password"
    DATABASE_URL: "postgresql://test_user:test_password@postgres:5432/test_db"
    # Redis est accessible sur le hostname "redis", port 6379
    REDIS_URL: "redis://redis:6379"

  before_script:
    - apt-get update -qq
    - apt-get install -y -qq libpq-dev unzip git
    - docker-php-ext-install pdo pdo_pgsql
    - pecl install redis && docker-php-ext-enable redis
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist --no-interaction

  script:
    # Vérifier PostgreSQL
    - php -r "new PDO('pgsql:host=postgres;dbname=test_db', 'test_user', 'test_password');" && echo "PostgreSQL OK"
    # Vérifier Redis
    - php -r "\$r = new Redis(); \$r->connect('redis', 6379); echo 'Redis OK';"
    # Exécuter les tests
    - vendor/bin/phpunit --testdox
```

**Résultat attendu** :

```text
Le pipeline lance 3 conteneurs :
1. php:8.3-cli (job principal)
2. postgres:16-alpine (service base de données)
3. redis:7-alpine (service cache)

Les trois conteneurs sont dans le même réseau Docker.
Le job principal accède aux services par leurs alias.
```

---

### Étape 3 : Cache avancé avec politiques

```yaml
stages:
  - install
  - test

# Job dédié à l'installation des dépendances
install-deps:
  stage: install
  image: php:8.3-cli
  before_script:
    - apt-get update -qq && apt-get install -y -qq unzip git
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
  script:
    - composer install --prefer-dist --no-interaction
  cache:
    # Clé de cache basée sur le fichier de lock
    key:
      files:
        - composer.lock
      prefix: composer
    paths:
      - vendor/
    # Politique push : ce job crée/met à jour le cache
    policy: push

# Job de test qui utilise le cache
test-php:
  stage: test
  image: php:8.3-cli
  before_script:
    - apt-get update -qq && apt-get install -y -qq unzip git
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    # Si le cache est disponible, cette commande est quasi instantanée
    - composer install --prefer-dist --no-interaction
  script:
    - vendor/bin/phpunit --testdox
  cache:
    key:
      files:
        - composer.lock
      prefix: composer
    paths:
      - vendor/
    # Politique pull : ce job lit le cache mais ne le modifie pas
    policy: pull
```

**Explication** :

```text
Flux du cache :
1. install-deps : installe les dépendances → écrit le cache (policy: push)
2. test-php : lit le cache → les dépendances sont déjà là (policy: pull)

Avantage : le cache est écrit une seule fois par le job install-deps.
Les autres jobs le lisent sans le modifier.
```

---

### Étape 4 : Artefacts et rapports

```yaml
stages:
  - test

test-with-reports:
  stage: test
  image: php:8.3-cli
  before_script:
    - apt-get update -qq && apt-get install -y -qq unzip git
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist --no-interaction

  script:
    # Exécuter les tests avec rapport JUnit et couverture
    - vendor/bin/phpunit --testdox --log-junit report.xml --coverage-text --coverage-cobertura coverage.xml

  # Configuration des artefacts
  artifacts:
    # Fichiers à conserver
    paths:
      - report.xml
      - coverage.xml
    # Rapports intégrés à l'interface GitLab
    reports:
      # Rapport JUnit : affiche les résultats de test dans la MR
      junit: report.xml
      # Rapport de couverture : affiche le pourcentage dans la MR
      coverage_report:
        coverage_format: cobertura
        path: coverage.xml
    # Durée de conservation
    expire_in: 1 week
    # Quand sauvegarder les artefacts
    when: always
```

**Types de rapports GitLab** :

| Type | Fichier | Affichage dans GitLab |
| --- | --- | --- |
| `junit` | XML JUnit | Résultats des tests dans la merge request |
| `coverage_report` | Cobertura XML | Couverture de code ligne par ligne dans la MR |
| `codequality` | Code Climate JSON | Problèmes de qualité dans la merge request |
| `sast` | SARIF/JSON | Vulnérabilités de sécurité dans la MR |
| `dependency_scanning` | JSON | Dépendances vulnérables |

**Résultat attendu** :

```text
Dans une merge request, GitLab affiche :
- Un onglet "Tests" avec les résultats PHPUnit (réussi/échoué)
- La couverture de code sur chaque fichier modifié
- Les artefacts sont téléchargeables depuis la page du pipeline
```

---

### Étape 5 : Environments et déploiement

```yaml
stages:
  - test
  - deploy

# Image par défaut
image: php:8.3-cli

test:
  stage: test
  script:
    - echo "Tests passés"

# Déploiement staging
deploy-staging:
  stage: deploy
  script:
    - echo "Déploiement sur staging..."
    - echo "Version : $CI_COMMIT_SHORT_SHA"
  # Déclaration de l'environment
  environment:
    # Nom de l'environment
    name: staging
    # URL de l'application déployée
    url: https://staging.mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# Déploiement production (manuel)
deploy-production:
  stage: deploy
  script:
    - echo "Déploiement en production..."
    - echo "Version : $CI_COMMIT_SHORT_SHA"
  environment:
    name: production
    url: https://mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  # Empêcher l'exécution automatique
  allow_failure: false
```

**Résultat attendu** :

```text
Dans Operate → Environments, tu vois :
- staging : dernière version déployée, lien vers l'application
- production : dernière version déployée, lien vers l'application

Chaque environment affiche :
- L'historique des déploiements
- Le commit associé à chaque déploiement
- Un bouton "Rollback" pour revenir à une version précédente
```

---

### Étape 6 : Review apps

```yaml
stages:
  - test
  - review
  - deploy

test:
  stage: test
  script:
    - echo "Tests passés"

# Review app : environment temporaire pour chaque merge request
review:
  stage: review
  script:
    # Déployer la branche sur un environnement temporaire
    - echo "Déploiement de la review app..."
    - echo "Branche : $CI_COMMIT_REF_SLUG"
    - echo "URL : https://$CI_COMMIT_REF_SLUG.review.mon-app.example.com"
  environment:
    # Nom dynamique basé sur le nom de la branche
    name: review/$CI_COMMIT_REF_SLUG
    # URL dynamique
    url: https://$CI_COMMIT_REF_SLUG.review.mon-app.example.com
    # Suppression automatique quand la branche est supprimée
    on_stop: stop-review
  rules:
    # Uniquement pour les merge requests
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"

# Job de nettoyage : supprime la review app
stop-review:
  stage: review
  script:
    - echo "Suppression de la review app $CI_COMMIT_REF_SLUG..."
  environment:
    name: review/$CI_COMMIT_REF_SLUG
    action: stop
  rules:
    - if: $CI_PIPELINE_SOURCE == "merge_request_event"
      when: manual
  # Permettre l'échec (la review app peut déjà être supprimée)
  allow_failure: true

deploy-production:
  stage: deploy
  script:
    - echo "Déploiement en production"
  environment:
    name: production
    url: https://mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
```

**Explication** :

```text
Flux des review apps :
1. Un développeur crée une merge request
2. GitLab CI déploie automatiquement la branche
3. L'URL de la review app apparaît dans la merge request
4. Le reviewer teste l'application en ligne
5. Quand la MR est fusionnée ou la branche supprimée, la review app est détruite

Exemple :
- Branche : feature/login-page
- Slug : feature-login-page
- URL : https://feature-login-page.review.mon-app.example.com
```

---

### Étape 7 : Pipeline complet test-build-deploy

```yaml
# Pipeline GitLab CI complet
stages:
  - lint
  - test
  - build
  - deploy

image: php:8.3-cli

variables:
  COMPOSER_NO_INTERACTION: "1"
  POSTGRES_DB: "test_db"
  POSTGRES_USER: "test_user"
  POSTGRES_PASSWORD: "test_pass"

cache:
  key:
    files:
      - composer.lock
    prefix: composer
  paths:
    - vendor/

# ──────────────────────────────────────
# Lint
# ──────────────────────────────────────

lint:
  stage: lint
  before_script:
    - apt-get update -qq && apt-get install -y -qq unzip git
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist
  script:
    - vendor/bin/php-cs-fixer fix --dry-run --diff

# ──────────────────────────────────────
# Tests
# ──────────────────────────────────────

test:
  stage: test
  services:
    - name: postgres:16-alpine
      alias: postgres
  variables:
    DATABASE_URL: "postgresql://test_user:test_pass@postgres:5432/test_db"
  before_script:
    - apt-get update -qq && apt-get install -y -qq libpq-dev unzip git
    - docker-php-ext-install pdo pdo_pgsql
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist
  script:
    - vendor/bin/phpunit --testdox --log-junit report.xml
  artifacts:
    reports:
      junit: report.xml
    expire_in: 1 week

# ──────────────────────────────────────
# Build
# ──────────────────────────────────────

build-image:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker build -t $CI_REGISTRY_IMAGE:latest .
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# ──────────────────────────────────────
# Deploy
# ──────────────────────────────────────

deploy-staging:
  stage: deploy
  before_script:
    - echo "Préparation du déploiement"
  script:
    - echo "Déploiement de $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA sur staging"
  environment:
    name: staging
    url: https://staging.mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-production:
  stage: deploy
  before_script:
    - echo "Préparation du déploiement"
  script:
    - echo "Déploiement de $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA en production"
  environment:
    name: production
    url: https://mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  allow_failure: false
```

**Résultat attendu** :

```text
Pipeline complet :
lint → test (avec PostgreSQL) → build (image Docker) → deploy

Sur la branche main :
- lint et test s'exécutent automatiquement
- build crée et pousse l'image Docker
- deploy-staging s'exécute automatiquement
- deploy-production attend un clic manuel
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `git push` | Déclenche le pipeline |
| CI/CD → Pipelines | Voir tous les pipelines |
| CI/CD → Jobs | Voir tous les jobs |
| Operate → Environments | Voir les environnements déployés |
| CI/CD → Editor | Éditer et valider `.gitlab-ci.yml` |
| `$CI_REGISTRY_IMAGE` | URL de l'image dans le registry GitLab |

---

## Pièges Fréquents

### Piège 1 : Service non prêt au démarrage du job

⚠️ **Problème** : Le job commence à exécuter les tests avant que PostgreSQL soit complètement démarré. Les tests échouent avec "connection refused".

✅ **Solution** : Ajoute une boucle d'attente dans `before_script` :

```yaml
before_script:
  # Attendre que PostgreSQL soit prêt (max 30 secondes)
  - |
    for i in $(seq 1 30); do
      if pg_isready -h postgres -p 5432 2>/dev/null; then
        echo "PostgreSQL prêt"
        break
      fi
      sleep 1
    done
```

---

### Piège 2 : Cache qui empêche la mise à jour des dépendances

⚠️ **Problème** : Tu modifies `composer.json` pour ajouter un package. Le cache contient l'ancien `vendor/`. `composer install` ne détecte pas le changement.

✅ **Solution** : Base la clé de cache sur `composer.lock` :

```yaml
cache:
  key:
    files:
      - composer.lock
    prefix: composer
  paths:
    - vendor/
```

---

### Piège 3 : Artefacts non transmis entre stages

⚠️ **Problème** : Le job `build` crée un fichier dans `dist/`. Le job `deploy` (stage suivant) ne trouve pas le fichier.

✅ **Solution** : Déclare explicitement les artefacts dans le job `build`. Les artefacts sont automatiquement disponibles dans les jobs des stages suivants :

```yaml
build:
  stage: build
  script:
    - mkdir dist && echo "app" > dist/app.tar.gz
  artifacts:
    paths:
      - dist/
    expire_in: 1 hour

deploy:
  stage: deploy
  script:
    # Le fichier dist/app.tar.gz est automatiquement disponible
    - ls dist/
```

---

### Piège 4 : Docker-in-Docker mal configuré

⚠️ **Problème** : Tu veux builder une image Docker dans un job GitLab CI. Tu utilises l'image `docker:27` mais la commande `docker build` échoue car le démon Docker n'est pas disponible.

✅ **Solution** : Utilise le service Docker-in-Docker (DinD) :

```yaml
build:
  image: docker:27
  services:
    - docker:27-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  script:
    - docker build -t mon-image .
```

---

## Checklist de Validation

- [ ] Je sais utiliser des services (PostgreSQL, Redis) dans un job GitLab CI
- [ ] Je sais configurer le cache avec des politiques (pull, push, pull-push)
- [ ] Je sais utiliser les artefacts pour transmettre des fichiers entre jobs
- [ ] Je sais configurer des rapports (JUnit, couverture) dans les artefacts
- [ ] Je sais déclarer des environments (staging, production) avec des URLs
- [ ] Je comprends le concept de review apps
- [ ] Je sais utiliser Docker-in-Docker pour builder des images

---

## Exercice Pratique

**Énoncé** : Crée un fichier `.gitlab-ci.yml` pour un projet PHP/Symfony qui :

1. Définit 4 stages : `lint`, `test`, `build`, `deploy`
2. Le stage `test` utilise un service PostgreSQL
3. Le stage `build` crée une image Docker et la pousse dans le registry GitLab
4. Le stage `deploy` déploie sur staging (automatique) et production (manuel)
5. Les résultats de test sont publiés comme rapport JUnit
6. Le cache Composer est basé sur `composer.lock`

**Indications** :

- Utilise `services:` pour PostgreSQL dans le job de test
- Utilise `docker:27` et `docker:27-dind` pour le build Docker
- Utilise `environment:` pour staging et production
- Utilise `artifacts: reports: junit:` pour les résultats de test
- Utilise `cache: key: files:` pour la clé de cache basée sur le fichier

**Résultat attendu** : Un pipeline à 4 stages. Les tests utilisent PostgreSQL. L'image Docker est poussée dans le registry. Le déploiement production est manuel.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `.gitlab-ci.yml` :

```yaml
# Pipeline complet Symfony avec services et Docker
stages:
  - lint
  - test
  - build
  - deploy

# Image par défaut
image: php:8.3-cli

# Variables globales
variables:
  COMPOSER_NO_INTERACTION: "1"
  POSTGRES_DB: "app_test"
  POSTGRES_USER: "app"
  POSTGRES_PASSWORD: "secret"

# Cache Composer global
cache:
  key:
    files:
      - composer.lock
    prefix: php83-composer
  paths:
    - vendor/

# ──────────────────────────────────────
# Stage 1 : Lint
# ──────────────────────────────────────

lint:
  stage: lint
  before_script:
    - apt-get update -qq && apt-get install -y -qq unzip git
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist
  script:
    - vendor/bin/php-cs-fixer fix --dry-run --diff --verbose

# ──────────────────────────────────────
# Stage 2 : Test (avec PostgreSQL)
# ──────────────────────────────────────

test:
  stage: test
  services:
    - name: postgres:16-alpine
      alias: postgres
  variables:
    DATABASE_URL: "postgresql://app:secret@postgres:5432/app_test"
  before_script:
    - apt-get update -qq && apt-get install -y -qq libpq-dev unzip git postgresql-client
    - docker-php-ext-install pdo pdo_pgsql
    - curl -sS https://getcomposer.org/installer | php
    - mv composer.phar /usr/local/bin/composer
    - composer install --prefer-dist
    # Attendre PostgreSQL
    - until pg_isready -h postgres -p 5432; do sleep 1; done
  script:
    - vendor/bin/phpunit --testdox --log-junit report.xml
  artifacts:
    reports:
      junit: report.xml
    expire_in: 1 week
    when: always

# ──────────────────────────────────────
# Stage 3 : Build Docker
# ──────────────────────────────────────

build:
  stage: build
  image: docker:27
  services:
    - docker:27-dind
  variables:
    DOCKER_TLS_CERTDIR: "/certs"
  # Pas de cache Composer pour ce job
  cache: []
  before_script:
    - docker login -u $CI_REGISTRY_USER -p $CI_REGISTRY_PASSWORD $CI_REGISTRY
  script:
    - docker build -t $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA .
    - docker tag $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA $CI_REGISTRY_IMAGE:latest
    - docker push $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA
    - docker push $CI_REGISTRY_IMAGE:latest
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

# ──────────────────────────────────────
# Stage 4 : Deploy
# ──────────────────────────────────────

deploy-staging:
  stage: deploy
  # Pas besoin de PHP pour le déploiement
  image: alpine:latest
  cache: []
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Déploiement de $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA sur staging"
  environment:
    name: staging
    url: https://staging.mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"

deploy-production:
  stage: deploy
  image: alpine:latest
  cache: []
  before_script:
    - apk add --no-cache curl
  script:
    - echo "Déploiement de $CI_REGISTRY_IMAGE:$CI_COMMIT_SHORT_SHA en production"
  environment:
    name: production
    url: https://mon-app.example.com
  rules:
    - if: $CI_COMMIT_BRANCH == "main"
      when: manual
  allow_failure: false
```

**Explication** :

- Le pipeline a 4 stages exécutés séquentiellement
- Le job `test` utilise un service PostgreSQL avec attente de disponibilité
- Le job `build` utilise Docker-in-Docker pour créer l'image
- Les jobs de déploiement utilisent `alpine` (image légère, pas besoin de PHP)
- `cache: []` sur les jobs build et deploy désactive le cache Composer inutile
- Le rapport JUnit est publié avec `when: always` (même si les tests échouent)
- Le déploiement production est manuel (`when: manual`)

---

## Navigation

← Fiche précédente : **[GitLab CI - Introduction](06-gitlab-ci-introduction.md)**

→ Fiche suivante : **[Exécution locale des pipelines](08-execution-locale-pipelines.md)**
