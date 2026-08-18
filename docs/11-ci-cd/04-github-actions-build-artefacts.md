---
tags:
  - CI/CD
  - Intermédiaire
  - Pratique
description: "Builder des images Docker et gérer les artefacts dans GitHub Actions"
estimated_time: "75 min"
fiche_number: 4
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 04 - GitHub Actions - Build et artefacts

> **En bref** : Cette fiche t'apprend à builder des images Docker dans GitHub Actions, à les pousser vers GitHub Container Registry, et à gérer les artefacts (upload, download, cache des couches Docker). Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche [03 - GitHub Actions - Tests et lint](03-github-actions-tests-lint.md)
- Connaître les bases de Docker (Dockerfile, `docker build`, `docker push`)
- Savoir ce qu'est un registry d'images Docker

## Objectif de cette fiche

À la fin de cette fiche, tu sauras builder une image Docker dans un pipeline GitHub Actions, la pousser vers GitHub Container Registry (GHCR), utiliser le cache des couches Docker, et transférer des artefacts entre jobs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le build dans un pipeline CI/CD ?

**Définition** : Le build est l'étape du pipeline qui transforme le code source en un livrable prêt à être déployé. Ce livrable peut être une image Docker, un fichier JAR, un binaire compilé, ou un bundle JavaScript.

**Le problème que le build CI résout** :

Sans build automatisé, voici les problèmes rencontrés :

1. **Build manuel** : Un développeur doit exécuter `docker build` sur sa machine, puis `docker push` vers le registry. Il peut oublier une étape ou utiliser la mauvaise version du code.

2. **Builds non reproductibles** : Le build sur la machine du développeur A donne un résultat différent de celui sur la machine du développeur B. Les variables d'environnement, les versions d'outils, les fichiers locaux diffèrent.

3. **Pas de traçabilité** : Quelle version du code a produit cette image Docker ? Quand a-t-elle été buildée ? Par qui ? Sans pipeline, ces informations sont perdues.

**Comment le build CI résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Build manuel | Le pipeline exécute le build automatiquement à chaque push ou tag |
| Builds non reproductibles | Le build s'exécute dans un environnement neutre et identique à chaque fois |
| Pas de traçabilité | Le pipeline associe chaque build à un commit, un auteur, une date |

Le diagramme suivant illustre les étapes d'un pipeline de build et de publication d'artefacts.

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-04-github-actions-build-artefacts-1.html">Qu&#x27;est-ce que le build dans un pipeline CI/CD ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-04-github-actions-build-artefacts-1.html" title="Qu&#x27;est-ce que le build dans un pipeline CI/CD ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Analogie concrète** : Imagine une boulangerie industrielle. Chaque baguette est fabriquée par la même machine, avec les mêmes ingrédients, à la même température. Le résultat est identique à chaque fois. Le build CI est cette machine : il produit le même résultat à partir du même code, à chaque fois.

---

### Qu'est-ce que GitHub Container Registry (GHCR) ?

**Définition** : GitHub Container Registry (GHCR) est un service de stockage d'images Docker intégré à GitHub. Il permet de pousser et de tirer des images Docker directement depuis ton dépôt GitHub.

**Le problème que GHCR résout** :

Sans registry intégré, voici les problèmes rencontrés :

1. **Service externe** : Tu dois créer un compte sur Docker Hub ou un autre registry. Tu dois gérer des identifiants séparés.

2. **Pas de lien avec le code** : L'image Docker est stockée dans un endroit séparé du code. Il faut manuellement associer une image à un commit.

**Comment GHCR résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Service externe | GHCR est intégré à GitHub, pas de compte supplémentaire |
| Pas de lien avec le code | Les images sont liées au dépôt et visibles dans l'onglet "Packages" |

**URL d'une image GHCR** :

```text
ghcr.io/ton-utilisateur/nom-image:tag

Exemples :
ghcr.io/jdupont/mon-app:latest
ghcr.io/jdupont/mon-app:v1.2.3
ghcr.io/jdupont/mon-app:abc123 (SHA du commit)
```

**Ce que GHCR n'est PAS** :

- GHCR n'est pas Docker Hub. Docker Hub est un registry public géré par Docker Inc. GHCR est un registry géré par GitHub.
- GHCR n'est pas gratuit sans limite. Les dépôts privés ont un quota de stockage et de bande passante (500 Mo pour les comptes gratuits).

---

### Qu'est-ce que le cache des couches Docker ?

**Définition** : Le cache des couches Docker permet de réutiliser les couches d'une image Docker qui n'ont pas changé. Si seul le code source a changé, les couches qui installent les dépendances système ne sont pas reconstruites.

**Le problème que le cache résout** :

Sans cache, chaque build Docker reconstruit toutes les couches depuis zéro. Un build qui prend 10 minutes avec cache en prend 2 sans cache.

**Comment le cache fonctionne** :

```text
Dockerfile :
FROM php:8.3-fpm          ← Couche 1 : image de base (cachée)
RUN apt-get update         ← Couche 2 : paquets système (cachée)
COPY composer.json .       ← Couche 3 : fichier composer (cachée si inchangé)
RUN composer install       ← Couche 4 : dépendances (cachée si inchangé)
COPY . .                   ← Couche 5 : code source (reconstruite à chaque push)

Avec cache : seule la couche 5 est reconstruite (quelques secondes)
Sans cache : les 5 couches sont reconstruites (plusieurs minutes)
```

---

### Qu'est-ce qu'un artefact de build ?

**Définition** : Un artefact de build est un fichier ou un dossier produit par le pipeline et mis à disposition pour téléchargement ou pour un autre job. Exemples : une image Docker, un fichier ZIP, un rapport de tests, un binaire compilé.

**Différence entre artefact et cache** :

| Artefact | Cache |
| --- | --- |
| Résultat du pipeline (produit fini) | Données temporaires pour accélérer le pipeline |
| Téléchargeable par les utilisateurs | Invisible pour les utilisateurs |
| Transférable entre jobs | Partagé entre exécutions du même workflow |
| Durée de vie configurable (1 à 90 jours) | Durée de vie de 7 jours sans utilisation |

---

## Étapes Pratiques

### Étape 1 : Créer un projet avec un Dockerfile

Crée un projet Symfony simplifié :

```bash
# Crée la structure du projet
mkdir -p mon-app-docker/public
cd mon-app-docker
```

Crée le fichier `public/index.php` :

```php
<?php

// Point d'entrée simplifié de l'application
echo "Application version " . getenv('APP_VERSION') . "\n";
echo "Environnement : " . getenv('APP_ENV') . "\n";
```

Crée le fichier `Dockerfile` :

```dockerfile
# Image de base : PHP 8.3 avec Apache
FROM php:8.3-apache

# Copie la configuration Apache
# mod_rewrite est nécessaire pour Symfony
RUN a2enmod rewrite

# Définit le dossier de travail
WORKDIR /var/www/html

# Copie le code source de l'application
COPY public/ /var/www/html/

# Variables d'environnement par défaut
ENV APP_VERSION=dev
ENV APP_ENV=production

# Expose le port 80
EXPOSE 80

# Commande de démarrage (Apache en premier plan)
CMD ["apache2-foreground"]
```

Vérifie que le build fonctionne en local :

```bash
# Build l'image en local
docker build -t mon-app:test .

# Vérifie que l'image existe
docker images mon-app
```

**Résultat attendu** :

```text
REPOSITORY   TAG       IMAGE ID       CREATED          SIZE
mon-app      test      abc123def456   10 seconds ago   xxx MB
```

---

### Étape 2 : Créer un workflow de build Docker simple

Crée le fichier `.github/workflows/docker-build.yml` :

```yaml
# Workflow qui build une image Docker à chaque push
name: Docker Build

on:
  push:
    branches:
      - main

jobs:
  build:
    name: Build Docker Image
    runs-on: ubuntu-latest

    steps:
      # Étape 1 : récupérer le code
      - name: Récupérer le code
        uses: actions/checkout@v4

      # Étape 2 : configurer Docker Buildx
      # Buildx est une version améliorée de docker build
      # Il supporte le cache, le multi-plateforme, etc.
      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Étape 3 : builder l'image Docker
      - name: Builder l'image
        uses: docker/build-push-action@v6
        with:
          # Contexte de build : le dossier courant
          context: .
          # Ne pas pousser l'image (juste vérifier que le build fonctionne)
          push: false
          # Tags de l'image
          tags: mon-app:${{ github.sha }}
```

**Résultat attendu** :

```text
Le workflow build l'image Docker sans la pousser.
Le tag de l'image contient le SHA du commit : mon-app:abc123...
```

---

### Étape 3 : Pousser l'image vers GitHub Container Registry

Crée le fichier `.github/workflows/docker-push.yml` :

```yaml
# Workflow qui build et pousse une image Docker vers GHCR
name: Docker Push

on:
  push:
    branches:
      - main
    # Déclenché aussi quand un tag est créé
    tags:
      - "v*.*.*"

jobs:
  build-and-push:
    name: Build & Push
    runs-on: ubuntu-latest

    # Permissions nécessaires pour pousser vers GHCR
    permissions:
      contents: read
      packages: write

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v4

      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Se connecter à GitHub Container Registry
      # Le token GITHUB_TOKEN est automatiquement fourni par GitHub Actions
      - name: Se connecter à GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Générer les métadonnées (tags et labels) de l'image
      - name: Métadonnées de l'image
        id: meta
        uses: docker/metadata-action@v5
        with:
          # Nom complet de l'image sur GHCR
          images: ghcr.io/${{ github.repository }}
          # Règles de tagging
          tags: |
            # Tag "latest" pour la branche main
            type=raw,value=latest,enable={{is_default_branch}}
            # Tag basé sur le SHA du commit (toujours)
            type=sha,prefix=
            # Tag basé sur le tag Git (si c'est un tag)
            type=semver,pattern={{version}}
            type=semver,pattern={{major}}.{{minor}}

      # Builder et pousser l'image
      - name: Builder et pousser
        uses: docker/build-push-action@v6
        with:
          context: .
          # Cette fois, on pousse l'image
          push: true
          # Tags générés par l'étape précédente
          tags: ${{ steps.meta.outputs.tags }}
          # Labels générés par l'étape précédente
          labels: ${{ steps.meta.outputs.labels }}
```

**Résultat attendu** :

```text
Pour un push sur main :
- ghcr.io/ton-utilisateur/mon-app:latest
- ghcr.io/ton-utilisateur/mon-app:abc123 (SHA)

Pour un tag v1.2.3 :
- ghcr.io/ton-utilisateur/mon-app:1.2.3
- ghcr.io/ton-utilisateur/mon-app:1.2
- ghcr.io/ton-utilisateur/mon-app:abc123 (SHA)

L'image est visible dans l'onglet "Packages" du dépôt GitHub.
```

---

### Étape 4 : Ajouter le cache des couches Docker

Modifie le workflow pour utiliser le cache :

```yaml
# Workflow avec cache des couches Docker
name: Docker Build avec Cache

on:
  push:
    branches:
      - main

jobs:
  build:
    name: Build avec cache
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v4

      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Se connecter à GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Builder et pousser
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ghcr.io/${{ github.repository }}:latest
          # Configuration du cache
          # Le cache est stocké dans le registry GitHub
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**Explication du cache** :

```text
cache-from: type=gha
  → Cherche le cache dans GitHub Actions Cache
  → Si trouvé, les couches inchangées ne sont pas reconstruites

cache-to: type=gha,mode=max
  → Sauvegarde toutes les couches dans le cache
  → mode=max : sauvegarde aussi les couches intermédiaires
  → mode=min : ne sauvegarde que les couches finales

Résultat : le premier build est lent (pas de cache),
les suivants sont rapides (cache des couches inchangées)
```

**Résultat attendu** :

```text
Premier build : 3-5 minutes (pas de cache)
Builds suivants : 30-60 secondes (cache hit sur les couches inchangées)
```

---

### Étape 5 : Transférer des artefacts entre jobs

Crée un workflow qui build dans un job et utilise le résultat dans un autre :

```yaml
# Workflow avec transfert d'artefacts entre jobs
name: Artefacts Multi-Jobs

on:
  push:
    branches:
      - main

jobs:
  # Job 1 : builder et sauvegarder l'artefact
  build:
    name: Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      # Crée un fichier de build (simulation)
      - name: Créer le build
        run: |
          mkdir -p dist
          echo "Version: ${{ github.sha }}" > dist/version.txt
          echo "Date: $(date)" >> dist/version.txt
          echo "Build réussi" > dist/status.txt
          tar -czf dist/app.tar.gz public/

      # Sauvegarde le dossier dist/ comme artefact
      - name: Sauvegarder l'artefact
        uses: actions/upload-artifact@v4
        with:
          # Nom de l'artefact
          name: build-output
          # Fichiers à sauvegarder
          path: dist/
          # Durée de conservation
          retention-days: 5

  # Job 2 : récupérer et utiliser l'artefact
  verify:
    name: Vérifier le build
    runs-on: ubuntu-latest
    # Attend que le job "build" soit terminé
    needs: build
    steps:
      # Récupère l'artefact sauvegardé par le job "build"
      - name: Récupérer l'artefact
        uses: actions/download-artifact@v4
        with:
          # Même nom que dans upload-artifact
          name: build-output
          # Dossier de destination
          path: build-result/

      # Vérifie le contenu
      - name: Vérifier le contenu
        run: |
          echo "Contenu de l'artefact :"
          ls -la build-result/
          echo ""
          echo "Version :"
          cat build-result/version.txt
          echo ""
          echo "Status :"
          cat build-result/status.txt
```

**Résultat attendu** :

```text
Job "build" :
✓ Créer le build → fichiers créés dans dist/
✓ Sauvegarder l'artefact → artefact "build-output" sauvegardé

Job "verify" :
✓ Récupérer l'artefact → fichiers récupérés dans build-result/
✓ Vérifier le contenu → affiche la version et le status
```

---

### Étape 6 : Créer un workflow complet (test + build + push)

Crée le fichier `.github/workflows/ci-cd.yml` qui enchaîne les étapes :

```yaml
# Pipeline complet : test → build → push
name: CI/CD Pipeline

on:
  push:
    branches:
      - main
    tags:
      - "v*.*.*"
  pull_request:
    branches:
      - main

jobs:
  # ──────────────────────────────────────
  # Étape 1 : Tests
  # ──────────────────────────────────────
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: Exécuter les tests
        run: vendor/bin/phpunit --testdox

  # ──────────────────────────────────────
  # Étape 2 : Build Docker (après les tests)
  # ──────────────────────────────────────
  build:
    name: Build Docker
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v3

      # Se connecter à GHCR uniquement sur la branche main (pas sur les PR)
      - name: Se connecter à GHCR
        if: github.event_name != 'pull_request'
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Métadonnées de l'image
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=raw,value=latest,enable={{is_default_branch}}
            type=sha,prefix=
            type=semver,pattern={{version}}

      - name: Builder et pousser
        uses: docker/build-push-action@v6
        with:
          context: .
          # Pousser uniquement si ce n'est pas une PR
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
```

**Résultat attendu** :

```text
Sur une pull request :
test → build (sans push)

Sur un push vers main :
test → build → push vers GHCR

Sur un tag v1.2.3 :
test → build → push vers GHCR avec tag 1.2.3
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `docker build -t image:tag .` | Build une image Docker en local |
| `docker push ghcr.io/user/image:tag` | Pousse une image vers GHCR |
| `docker pull ghcr.io/user/image:tag` | Tire une image depuis GHCR |
| `docker login ghcr.io` | Se connecte à GHCR |
| `gh run view <id>` | Voir le détail d'un run GitHub Actions |
| `gh run download <id>` | Télécharger les artefacts d'un run |

---

## Pièges Fréquents

### Piège 1 : Oublier les permissions pour GHCR

⚠️ **Problème** : Le push vers GHCR échoue avec "permission denied". Le token `GITHUB_TOKEN` n'a pas les droits pour écrire dans le registry.

✅ **Solution** : Ajoute le bloc `permissions` dans le job :

```yaml
jobs:
  build:
    runs-on: ubuntu-latest
    # Ces permissions sont obligatoires pour pousser vers GHCR
    permissions:
      contents: read
      packages: write
```

---

### Piège 2 : Pousser depuis une pull request

⚠️ **Problème** : Tu pousses une image Docker depuis un workflow déclenché par une pull request. L'image contient du code non vérifié qui se retrouve dans le registry.

✅ **Solution** : Utilise une condition `if` pour ne pousser que depuis `main` :

```yaml
- name: Se connecter à GHCR
  if: github.event_name != 'pull_request'
  uses: docker/login-action@v3
  with:
    registry: ghcr.io
    username: ${{ github.actor }}
    password: ${{ secrets.GITHUB_TOKEN }}
```

---

### Piège 3 : Image trop grosse

⚠️ **Problème** : L'image Docker fait 2 Go. Le push prend 10 minutes. Le déploiement est lent.

✅ **Solution** : Utilise une image de base légère et un build multi-stage :

```dockerfile
# Stage 1 : installer les dépendances (cette image n'est pas conservée)
FROM composer:2 AS builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --optimize-autoloader

# Stage 2 : image finale légère
FROM php:8.3-alpine
WORKDIR /var/www/html
COPY --from=builder /app/vendor vendor/
COPY public/ public/
```

---

### Piège 4 : Ne pas utiliser le cache Docker

⚠️ **Problème** : Chaque build reconstruit toutes les couches Docker. Un build qui pourrait prendre 30 secondes prend 5 minutes.

✅ **Solution** : Active le cache `gha` (GitHub Actions) :

```yaml
- uses: docker/build-push-action@v6
  with:
    context: .
    push: true
    tags: mon-image:latest
    # Active le cache
    cache-from: type=gha
    cache-to: type=gha,mode=max
```

---

## Checklist de Validation

- [ ] Je sais builder une image Docker dans GitHub Actions
- [ ] Je sais pousser une image vers GitHub Container Registry (GHCR)
- [ ] Je comprends le rôle de `docker/build-push-action`
- [ ] Je sais configurer le cache des couches Docker avec `type=gha`
- [ ] Je sais utiliser `actions/upload-artifact` et `actions/download-artifact`
- [ ] Je sais conditionner le push avec `if: github.event_name != 'pull_request'`
- [ ] Je sais créer un pipeline complet : test → build → push

---

## Exercice Pratique

**Énoncé** : Crée un workflow `release.yml` qui :

1. Se déclenche uniquement quand un tag `v*.*.*` est poussé
2. Exécute les tests PHPUnit
3. Build une image Docker avec les tags suivants : le numéro de version (ex: `1.2.3`) et `latest`
4. Pousse l'image vers GHCR
5. Sauvegarde un artefact `build-info` contenant un fichier `info.txt` avec la version et la date de build

**Indications** :

- Utilise `on: push: tags: ["v*.*.*"]` comme déclencheur
- Utilise `docker/metadata-action` pour les tags
- Utilise `docker/build-push-action` avec cache
- Utilise `actions/upload-artifact` pour l'artefact

**Résultat attendu** : Quand tu pousses le tag `v1.0.0`, le pipeline build et pousse `ghcr.io/user/app:1.0.0` et `ghcr.io/user/app:latest`, et sauvegarde un artefact `build-info`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `.github/workflows/release.yml` :

```yaml
# Workflow de release déclenché par un tag
name: Release

on:
  push:
    tags:
      - "v*.*.*"

jobs:
  # Job 1 : exécuter les tests
  test:
    name: Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2

      - run: composer install --no-interaction --prefer-dist
      - run: vendor/bin/phpunit --testdox

  # Job 2 : builder et pousser l'image Docker
  release:
    name: Build & Push Release
    runs-on: ubuntu-latest
    needs: test
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      - name: Configurer Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Se connecter à GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Métadonnées de l'image
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ghcr.io/${{ github.repository }}
          tags: |
            type=semver,pattern={{version}}
            type=raw,value=latest

      - name: Builder et pousser
        uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
          cache-from: type=gha
          cache-to: type=gha,mode=max

      # Créer et sauvegarder l'artefact build-info
      - name: Créer les informations de build
        run: |
          mkdir -p build-info
          echo "Version: ${{ github.ref_name }}" > build-info/info.txt
          echo "Commit: ${{ github.sha }}" >> build-info/info.txt
          echo "Date: $(date -u +%Y-%m-%dT%H:%M:%SZ)" >> build-info/info.txt
          echo "Image: ghcr.io/${{ github.repository }}" >> build-info/info.txt

      - name: Sauvegarder l'artefact
        uses: actions/upload-artifact@v4
        with:
          name: build-info
          path: build-info/
          retention-days: 30
```

**Explication** :

- Le workflow se déclenche uniquement sur les tags `v*.*.*` (ex: `v1.0.0`)
- Le job `test` exécute PHPUnit avant le build
- Le job `release` attend les tests (grâce à `needs: test`)
- `docker/metadata-action` génère les tags `1.0.0` et `latest`
- Le cache Docker accélère les builds suivants
- L'artefact `build-info` contient la version, le commit, la date et le nom de l'image

---

## Navigation

← Fiche précédente : **[GitHub Actions - Tests et lint](03-github-actions-tests-lint.md)**

→ Fiche suivante : **[GitHub Actions - Avancé](05-github-actions-avance.md)**
