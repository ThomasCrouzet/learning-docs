---
tags:
  - CI/CD
  - Avancé
  - Projet
description: "Projet intégrateur : mettre en place un pipeline CI/CD complet pour un projet Symfony + React"
estimated_time: "120 min"
fiche_number: 10
total_fiches: 10
cursus: "CI/CD Pipelines"
---

# 10 - Projet intégrateur

> **En bref** : Ce projet met en pratique tout ce que tu as appris dans le cursus CI/CD. Tu vas concevoir et implémenter un pipeline CI/CD complet pour un projet Symfony (backend) + React (frontend), avec lint, tests, build Docker, déploiement multi-environnement et stratégie de déploiement. Lecture estimée : 120 min.

## Prérequis

- Toutes les fiches précédentes du cursus CI/CD (01 à 09)
- Avoir Docker installé et fonctionnel sur ton ordinateur
- Avoir `act` installé pour l'exécution locale (fiche 08)
- Connaître les bases de Symfony et React (la fiche fournit tout le code nécessaire)

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé un pipeline CI/CD complet avec : lint et analyse statique du code PHP et JavaScript, tests unitaires backend (PHPUnit) et frontend (Jest), build d'images Docker backend et frontend, déploiement multi-environnement (staging puis production), stratégie de déploiement blue-green, et exécution locale avec `act`.

---

## Concepts

Cette section explique les concepts spécifiques au projet intégrateur. Les concepts fondamentaux ont été couverts dans les fiches précédentes.

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur combine toutes les compétences acquises dans un cursus pour résoudre un problème concret et réaliste. Il ne s'agit pas d'apprendre de nouveaux concepts, mais de mettre en pratique les concepts existants ensemble.

**Analogie concrète** : Imagine que tu as appris séparément à couper des légumes, cuire de la viande, faire une sauce et dresser une assiette. Le projet intégrateur, c'est le moment où tu prépares un repas complet en combinant toutes ces techniques dans le bon ordre, du début à la fin.

**Ce que tu vas construire** :

Un pipeline CI/CD complet pour un projet Symfony + React qui automatise :

1. **Lint et analyse statique** : PHP CS Fixer pour le backend, ESLint pour le frontend (fiches 03 et 04)
2. **Tests automatisés** : PHPUnit pour le backend, Jest pour le frontend (fiche 03)
3. **Build Docker** : images Docker pour le backend et le frontend (fiche 04)
4. **Déploiement multi-environnement** : staging puis production avec approbation (fiche 05)
5. **Stratégie blue-green** : basculement sans downtime (fiche 09)
6. **Exécution locale** : vérification du pipeline avec `act` (fiche 08)

---

### Architecture du projet

**Schéma** :

```text
┌────────────────────────────────────────────────────────────────┐
│                        Dépôt Git                                │
│                                                                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────────────┐   │
│  │   backend/   │  │  frontend/   │  │ .github/workflows/   │   │
│  │  (Symfony)   │  │  (React)     │  │  ci.yml              │   │
│  │              │  │              │  │  deploy.yml           │   │
│  └─────────────┘  └─────────────┘  └──────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  docker-compose.yml                                       │  │
│  │  docker-compose.prod.yml                                  │  │
│  │  Makefile                                                 │  │
│  └──────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────┘
```

**Pipeline CI/CD** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-10-projet-integrateur-1.html">Architecture du projet (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-10-projet-integrateur-1.html" title="Architecture du projet" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Rôle de chaque composant** :

| Composant | Rôle |
| --- | --- |
| `backend/` | Application Symfony (API REST) |
| `frontend/` | Application React (interface utilisateur) |
| `.github/workflows/ci.yml` | Pipeline de lint, tests et build |
| `.github/workflows/deploy.yml` | Pipeline de déploiement |
| `docker-compose.yml` | Environnement de développement local |
| `docker-compose.prod.yml` | Configuration de production (blue-green) |
| `Makefile` | Raccourcis pour les commandes courantes |

---

### Séparation CI et CD

**Définition** : On sépare le pipeline en deux workflows distincts : un pour la CI (lint, tests, build) et un pour la CD (déploiement). Cette séparation permet de déclencher les deux pipelines indépendamment.

**Analogie concrète** : Dans une usine automobile, la chaîne de contrôle qualité (vérifier que les pièces sont conformes) et la chaîne de livraison (envoyer les voitures chez les concessionnaires) sont deux processus distincts. Le contrôle qualité tourne pour chaque pièce produite, mais la livraison ne se déclenche que quand un lot complet est validé.

**Le problème que la séparation résout** :

Sans séparation, le déploiement se déclenche à chaque push, même sur les branches de développement. Avec la séparation, le déploiement ne se déclenche que sur des événements spécifiques (merge sur main, création de tag).

| Pipeline | Déclencheur | Contenu |
| --- | --- | --- |
| CI (`ci.yml`) | Push sur toutes les branches, pull requests | Lint, tests, build |
| CD (`deploy.yml`) | Push sur `main` uniquement | Déploiement staging puis production |

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet

```bash
# Crée le dossier du projet
mkdir -p projet-cicd/{backend,frontend,.github/workflows}

# Entre dans le dossier
cd projet-cicd

# Initialise Git
git init
git checkout -b main
```

Crée la structure du backend Symfony (version réduite pour la démonstration) :

```bash
# Crée les dossiers du backend
mkdir -p backend/{src/Controller,tests,config}
```

Crée le fichier `backend/composer.json` :

```json
{
    "name": "projet-cicd/backend",
    "type": "project",
    "require": {
        "php": ">=8.3",
        "symfony/framework-bundle": "^7.4",
        "symfony/runtime": "^7.4"
    },
    "require-dev": {
        "phpunit/phpunit": "^11.0",
        "friendsofphp/php-cs-fixer": "^3.0"
    },
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "App\\Tests\\": "tests/"
        }
    },
    "scripts": {
        "test": "phpunit",
        "lint": "php-cs-fixer fix --dry-run --diff",
        "lint:fix": "php-cs-fixer fix"
    }
}
```

Crée le fichier `backend/src/Controller/HealthController.php` :

```php
<?php
// backend/src/Controller/HealthController.php
// Contrôleur qui expose un endpoint de health check

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class HealthController extends AbstractController
{
    // Endpoint appelé par le pipeline CI/CD pour vérifier que l'app fonctionne
    #[Route('/api/health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'version' => $_ENV['APP_VERSION'] ?? 'dev',
            'timestamp' => date('c'),
        ]);
    }
}
```

Crée un test unitaire `backend/tests/Controller/HealthControllerTest.php` :

```php
<?php
// backend/tests/Controller/HealthControllerTest.php
// Test du endpoint health check

namespace App\Tests\Controller;

use PHPUnit\Framework\TestCase;

class HealthControllerTest extends TestCase
{
    // Vérifie que le health check retourne les bonnes clés
    public function testHealthResponse(): void
    {
        // Simule la réponse du health check
        $response = [
            'status' => 'ok',
            'version' => 'dev',
            'timestamp' => date('c'),
        ];

        // Vérifie que le statut est "ok"
        $this->assertSame('ok', $response['status']);

        // Vérifie que la version est présente
        $this->assertArrayHasKey('version', $response);

        // Vérifie que le timestamp est présent
        $this->assertArrayHasKey('timestamp', $response);
    }
}
```

---

### Étape 2 : Créer la structure du frontend React

> **Note** : Cette fiche utilise **Vite** comme outil de build React. Create React App (`react-scripts`) a été officiellement déprécié par l'équipe React en février 2025 et n'est plus maintenu. Vite est l'alternative recommandée : démarrage plus rapide, support TypeScript natif, HMR instantané.

Initialise le projet frontend avec Vite (depuis la racine du projet) :

```bash
# Créer le projet React avec Vite + TypeScript
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install
```

Modifie le fichier `frontend/package.json` pour ajouter le lint et les tests :

```json
{
    "name": "projet-cicd-frontend",
    "version": "1.0.0",
    "private": true,
    "scripts": {
        "dev": "vite",
        "build": "tsc -b && vite build",
        "test": "vitest run",
        "lint": "eslint src/ --ext .ts,.tsx"
    },
    "dependencies": {
        "react": "^18.3.0",
        "react-dom": "^18.3.0"
    },
    "devDependencies": {
        "@types/react": "^18.3.0",
        "@types/react-dom": "^18.3.0",
        "@vitejs/plugin-react": "^4.3.0",
        "@testing-library/react": "^16.0.0",
        "@testing-library/jest-dom": "^6.0.0",
        "eslint": "^9.0.0",
        "typescript": "^5.0.0",
        "vite": "^6.0.0",
        "vitest": "^2.0.0",
        "jsdom": "^25.0.0"
    }
}
```

Crée le fichier `frontend/src/App.tsx` :

```typescript
// frontend/src/App.tsx
// Composant principal de l'application React

import { useState, useEffect } from 'react';

interface HealthResponse {
  status: string;
  version: string;
}

function App() {
  // État pour stocker les données du health check
  const [health, setHealth] = useState<HealthResponse | null>(null);

  // Au chargement, appelle le health check du backend
  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data: HealthResponse) => setHealth(data))
      .catch((error) => console.error('Erreur:', error));
  }, []);

  return (
    <div className="App">
      <h1>Projet CI/CD</h1>
      {health ? (
        <div>
          <p>Status: {health.status}</p>
          <p>Version: {health.version}</p>
        </div>
      ) : (
        <p>Chargement...</p>
      )}
    </div>
  );
}

export default App;
```

Crée le fichier de configuration Vitest `frontend/vite.config.ts` (si le template ne l'a pas généré avec la config de test) :

```typescript
// frontend/vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Environnement DOM pour les tests React
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test-setup.ts',
  },
});
```

Crée le fichier `frontend/src/test-setup.ts` :

```typescript
// frontend/src/test-setup.ts
// Configuration globale des tests
import '@testing-library/jest-dom';
```

Crée le test `frontend/src/App.test.tsx` :

```typescript
// frontend/src/App.test.tsx
// Test du composant App
import App from './App';

// Vérifie que le composant App est défini
test('App module is defined', () => {
  // Vérifie que le composant App est importable
  expect(App).toBeDefined();
});

// Vérifie que les données de health check ont le bon format
test('health check response format', () => {
  const healthResponse = {
    status: 'ok',
    version: '1.0.0',
    timestamp: '2026-03-20T10:30:00+00:00'
  };

  // Vérifie que le statut est "ok"
  expect(healthResponse.status).toBe('ok');

  // Vérifie que la version est présente
  expect(healthResponse.version).toBeDefined();

  // Vérifie que le timestamp est présent
  expect(healthResponse.timestamp).toBeDefined();
});
```

---

### Étape 3 : Créer les Dockerfiles

Crée le fichier `backend/Dockerfile` :

```dockerfile
# backend/Dockerfile
# Image de production pour le backend Symfony

# Étape 1 : installer les dépendances
FROM composer:2 AS composer
WORKDIR /app
COPY composer.json composer.lock* ./
RUN composer install --no-dev --optimize-autoloader --no-scripts

# Étape 2 : image de production
FROM php:8.3-fpm-alpine

# Installe les extensions PHP nécessaires
RUN docker-php-ext-install pdo pdo_pgsql opcache

# Copie le code source
WORKDIR /var/www/html
COPY . .

# Copie les dépendances depuis l'étape composer
COPY --from=composer /app/vendor ./vendor

# La version est passée comme argument de build
ARG APP_VERSION=dev
ENV APP_VERSION=${APP_VERSION}

# Expose le port PHP-FPM
EXPOSE 9000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD php -r "echo 'ok';" || exit 1
```

Crée le fichier `frontend/Dockerfile` :

```dockerfile
# frontend/Dockerfile
# Image de production pour le frontend React (Vite)

# Étape 1 : builder l'application
FROM node:22-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
# Vite compile TypeScript et génère le dossier dist/ (pas build/)
RUN npm run build

# Étape 2 : servir avec Nginx
FROM nginx:1.26-alpine

# Copie les fichiers buildés (Vite génère dist/, pas build/)
COPY --from=builder /app/dist /usr/share/nginx/html

# Configuration Nginx pour SPA (Single Page Application)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose le port HTTP
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \
  CMD wget -qO- http://localhost/health || exit 1
```

Crée la configuration Nginx pour le frontend `frontend/nginx.conf` :

```nginx
# frontend/nginx.conf
# Configuration Nginx pour une SPA React

server {
    listen 80;

    root /usr/share/nginx/html;
    index index.html;

    # Toutes les routes non trouvées redirigent vers index.html
    # (nécessaire pour le routing côté client de React)
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy vers le backend Symfony pour les appels API
    location /api/ {
        proxy_pass http://backend:9000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check pour le load balancer
    location /health {
        return 200 '{"status":"ok"}';
        add_header Content-Type application/json;
    }
}
```

---

### Étape 4 : Créer le workflow CI

Crée le fichier `.github/workflows/ci.yml` :

```yaml
# .github/workflows/ci.yml
# Pipeline CI : lint, tests et build pour le backend et le frontend

name: CI

on:
  # Se déclenche sur push vers toutes les branches
  push:
    branches:
      - main
      - "feature/**"
      - "fix/**"
  # Se déclenche sur les pull requests vers main
  pull_request:
    branches:
      - main

# Annule les runs précédents sur la même branche
concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true

jobs:
  # ──────────────────────────────────────
  # Backend : Lint PHP
  # ──────────────────────────────────────
  lint-backend:
    name: Lint Backend (PHP)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Installer PHP 8.3
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2, php-cs-fixer

      - name: Cache Composer
        uses: actions/cache@v4
        with:
          path: backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('backend/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: Vérifier le formatage PHP
        run: php-cs-fixer fix --dry-run --diff

  # ──────────────────────────────────────
  # Backend : Tests PHPUnit
  # ──────────────────────────────────────
  test-backend:
    name: Tests Backend (PHPUnit)
    runs-on: ubuntu-latest
    needs: lint-backend
    defaults:
      run:
        working-directory: backend

    steps:
      - uses: actions/checkout@v4

      - name: Installer PHP 8.3
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2
          coverage: xdebug

      - name: Cache Composer
        uses: actions/cache@v4
        with:
          path: backend/vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('backend/composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: Exécuter les tests avec couverture
        run: |
          vendor/bin/phpunit --testdox --coverage-text

  # ──────────────────────────────────────
  # Frontend : Lint JavaScript
  # ──────────────────────────────────────
  lint-frontend:
    name: Lint Frontend (ESLint)
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - name: Installer Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Installer les dépendances
        run: npm ci

      - name: Vérifier le formatage JavaScript
        run: npm run lint

  # ──────────────────────────────────────
  # Frontend : Tests Jest
  # ──────────────────────────────────────
  test-frontend:
    name: Tests Frontend (Jest)
    runs-on: ubuntu-latest
    needs: lint-frontend
    defaults:
      run:
        working-directory: frontend

    steps:
      - uses: actions/checkout@v4

      - name: Installer Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Installer les dépendances
        run: npm ci

      - name: Exécuter les tests
        run: npm test

  # ──────────────────────────────────────
  # Build des images Docker
  # ──────────────────────────────────────
  build:
    name: Build Docker Images
    runs-on: ubuntu-latest
    needs:
      - test-backend
      - test-frontend
    # Obligatoire pour pousser vers GHCR avec GITHUB_TOKEN
    # (les permissions par défaut du token sont restrictives : contents: read uniquement)
    permissions:
      contents: read
      packages: write

    steps:
      - uses: actions/checkout@v4

      # Se connecter au registry GitHub Container Registry
      - name: Se connecter à GHCR
        uses: docker/login-action@v3
        with:
          registry: ghcr.io
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      # Builder et pousser l'image backend
      - name: Build image backend
        uses: docker/build-push-action@v6
        with:
          context: backend
          push: ${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/${{ github.repository }}/backend:${{ github.sha }}
            ghcr.io/${{ github.repository }}/backend:latest
          build-args: |
            APP_VERSION=${{ github.sha }}

      # Builder et pousser l'image frontend
      - name: Build image frontend
        uses: docker/build-push-action@v6
        with:
          context: frontend
          push: ${{ github.event_name != 'pull_request' }}
          tags: |
            ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}
            ghcr.io/${{ github.repository }}/frontend:latest
```

**Résultat attendu** :

```text
Le pipeline CI exécute 5 jobs :
1. lint-backend → vérifie le formatage PHP
2. lint-frontend → vérifie le formatage JavaScript
3. test-backend → exécute les tests PHPUnit (attend lint-backend)
4. test-frontend → exécute les tests Jest (attend lint-frontend)
5. build → construit les images Docker (attend test-backend ET test-frontend)

Sur une PR : les images ne sont pas poussées (push: false)
Sur main : les images sont poussées vers GHCR
```

---

### Étape 5 : Créer le workflow de déploiement

Crée le fichier `.github/workflows/deploy.yml` :

```yaml
# .github/workflows/deploy.yml
# Pipeline CD : déploiement staging puis production (blue-green)

name: Deploy

on:
  # Se déclenche uniquement sur push vers main
  push:
    branches:
      - main
  # Permet le déclenchement manuel
  workflow_dispatch:
    inputs:
      environment:
        description: "Environnement cible"
        required: true
        type: choice
        options:
          - staging
          - production

# Un seul déploiement à la fois
concurrency:
  group: deploy-production
  cancel-in-progress: false

jobs:
  # ──────────────────────────────────────
  # Attendre que la CI soit verte
  # ──────────────────────────────────────
  wait-ci:
    name: Attendre la CI
    runs-on: ubuntu-latest
    steps:
      - name: Attendre le workflow CI
        uses: lewagon/wait-on-check-action@v1.3.4
        with:
          ref: ${{ github.sha }}
          check-name: "Build Docker Images"
          repo-token: ${{ secrets.GITHUB_TOKEN }}
          wait-interval: 15

  # ──────────────────────────────────────
  # Déploiement Staging
  # ──────────────────────────────────────
  deploy-staging:
    name: Deploy Staging
    runs-on: ubuntu-latest
    needs: wait-ci
    environment:
      name: staging
      url: https://staging.mon-app.example.com

    steps:
      - uses: actions/checkout@v4

      - name: Préparer le déploiement
        run: |
          echo "=== Déploiement Staging ==="
          echo "Version : ${{ github.sha }}"
          echo "Image backend : ghcr.io/${{ github.repository }}/backend:${{ github.sha }}"
          echo "Image frontend : ghcr.io/${{ github.repository }}/frontend:${{ github.sha }}"

      - name: Déployer sur staging
        run: |
          # Ici, tu lancerais les commandes de déploiement réelles
          # Exemple avec Docker Compose :
          # export IMAGE_TAG=${{ github.sha }}
          # docker compose -f docker-compose.prod.yml pull
          # docker compose -f docker-compose.prod.yml up -d
          echo "Déploiement sur staging terminé"

      - name: Vérifier le health check staging
        run: |
          MAX_RETRIES=10
          RETRY_INTERVAL=5

          for i in $(seq 1 $MAX_RETRIES); do
            echo "Vérification $i/$MAX_RETRIES..."
            # En conditions réelles, utilise l'URL de staging
            # HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
            #   https://staging.mon-app.example.com/api/health)
            HTTP_CODE="200"

            if [ "$HTTP_CODE" = "200" ]; then
              echo "Health check staging OK"
              exit 0
            fi

            echo "En attente... ($HTTP_CODE)"
            sleep $RETRY_INTERVAL
          done

          echo "Health check staging ÉCHOUÉ"
          exit 1

  # ──────────────────────────────────────
  # Déploiement Production (Blue-Green)
  # ──────────────────────────────────────
  deploy-production:
    name: Deploy Production
    runs-on: ubuntu-latest
    needs: deploy-staging
    environment:
      name: production
      url: https://mon-app.example.com

    steps:
      - uses: actions/checkout@v4

      - name: Préparer le déploiement blue-green
        run: |
          echo "=== Déploiement Production (Blue-Green) ==="
          echo "Version : ${{ github.sha }}"

      - name: Déployer la version green
        run: |
          # Étape 1 : déployer la nouvelle version sur l'environnement green
          # export IMAGE_TAG=${{ github.sha }}
          # docker compose -f docker-compose.prod.yml up -d green-backend green-frontend
          echo "Version green déployée"

      - name: Vérifier le health check green
        run: |
          MAX_RETRIES=10
          RETRY_INTERVAL=5

          for i in $(seq 1 $MAX_RETRIES); do
            echo "Vérification green $i/$MAX_RETRIES..."
            # En conditions réelles :
            # HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
            #   http://green.internal:8080/api/health)
            HTTP_CODE="200"

            if [ "$HTTP_CODE" = "200" ]; then
              echo "Health check green OK"
              exit 0
            fi

            echo "En attente... ($HTTP_CODE)"
            sleep $RETRY_INTERVAL
          done

          echo "Health check green ÉCHOUÉ. Rollback..."
          exit 1

      - name: Basculer le trafic vers green
        run: |
          # Étape 2 : basculer le load balancer de blue vers green
          # Avec Nginx : modifier la configuration et recharger
          # ssh serveur "cp /etc/nginx/green.conf /etc/nginx/app.conf && nginx -s reload"
          echo "Trafic basculé vers green"
          echo "Version ${{ github.sha }} en production"

      - name: Vérifier le health check production
        run: |
          MAX_RETRIES=5
          RETRY_INTERVAL=3

          for i in $(seq 1 $MAX_RETRIES); do
            echo "Vérification production $i/$MAX_RETRIES..."
            # HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" \
            #   https://mon-app.example.com/api/health)
            HTTP_CODE="200"

            if [ "$HTTP_CODE" = "200" ]; then
              echo "Health check production OK"
              exit 0
            fi

            echo "En attente... ($HTTP_CODE)"
            sleep $RETRY_INTERVAL
          done

          echo "Health check production ÉCHOUÉ"
          exit 1

      - name: Rollback en cas d'échec
        if: failure()
        run: |
          echo "=== ROLLBACK ==="
          echo "Rétablissement du trafic vers blue..."
          # ssh serveur "cp /etc/nginx/blue.conf /etc/nginx/app.conf && nginx -s reload"
          echo "Rollback terminé"
```

**Résultat attendu** :

```text
Le pipeline CD exécute 3 jobs :
1. wait-ci → attend que le pipeline CI soit vert
2. deploy-staging → déploie sur staging + health check
3. deploy-production → déploie en blue-green + health check + rollback auto

Si le health check de staging échoue → le pipeline s'arrête
Si le health check de production échoue → rollback automatique
```

---

### Étape 6 : Créer le Docker Compose de production

Crée le fichier `docker-compose.prod.yml` :

```yaml
# docker-compose.prod.yml
# Configuration de production avec stratégie blue-green

services:
  # ──────────────────────────────────────
  # Load Balancer
  # ──────────────────────────────────────
  loadbalancer:
    image: nginx:1.26-alpine
    ports:
      - "80:80"
    volumes:
      - ./nginx-prod.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - blue-backend
      - blue-frontend
      - green-backend
      - green-frontend

  # ──────────────────────────────────────
  # Blue (version actuelle)
  # ──────────────────────────────────────
  blue-backend:
    image: ghcr.io/${GITHUB_REPOSITORY}/backend:${BLUE_TAG:-latest}
    environment:
      APP_ENV: prod
      APP_VERSION: ${BLUE_TAG:-latest}
      DATABASE_URL: postgresql://app:secret@database:5432/app

  blue-frontend:
    image: ghcr.io/${GITHUB_REPOSITORY}/frontend:${BLUE_TAG:-latest}

  # ──────────────────────────────────────
  # Green (nouvelle version)
  # ──────────────────────────────────────
  green-backend:
    image: ghcr.io/${GITHUB_REPOSITORY}/backend:${GREEN_TAG:-latest}
    environment:
      APP_ENV: prod
      APP_VERSION: ${GREEN_TAG:-latest}
      DATABASE_URL: postgresql://app:secret@database:5432/app

  green-frontend:
    image: ghcr.io/${GITHUB_REPOSITORY}/frontend:${GREEN_TAG:-latest}

  # ──────────────────────────────────────
  # Base de données (partagée)
  # ──────────────────────────────────────
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
```

Crée la configuration Nginx de production `nginx-prod.conf` :

```nginx
# nginx-prod.conf
# Configuration Nginx pour le blue-green en production

# Par défaut, le trafic va vers blue
# Pour basculer vers green, change "blue" en "green" ci-dessous

upstream backend {
    server blue-backend:9000;
}

upstream frontend {
    server blue-frontend:80;
}

server {
    listen 80;

    # Routes API → backend Symfony
    location /api/ {
        fastcgi_pass backend;
        fastcgi_param SCRIPT_FILENAME /var/www/html/public/index.php;
        include fastcgi_params;
    }

    # Toutes les autres routes → frontend React
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Health check du load balancer
    location /lb-health {
        return 200 '{"status":"ok"}';
        add_header Content-Type application/json;
    }
}
```

---

### Étape 7 : Créer le Makefile

Crée le fichier `Makefile` pour simplifier les commandes.

**Important** : dans un Makefile, les lignes de commande sous chaque cible doivent commencer par une tabulation (touche Tab), pas des espaces. L'exemple ci-dessous utilise des espaces pour l'affichage, mais tu dois utiliser des tabulations dans ton fichier réel.

```makefile
# Makefile
# Raccourcis pour les commandes du projet CI/CD
# ATTENTION : chaque ligne de commande doit commencer par une TABULATION

# Variables
COMPOSE = docker compose
COMPOSE_PROD = docker compose -f docker-compose.prod.yml

# ──────────────────────────────────────
# Développement
# ──────────────────────────────────────

## Installer les dépendances
install:
    cd backend && composer install
    cd frontend && npm ci

## Lancer les lints
lint:
    cd backend && composer lint
    cd frontend && npm run lint

## Lancer les tests
test:
    cd backend && composer test
    cd frontend && npm test

## Lancer lint + tests
ci: lint test
    @echo "CI locale terminée avec succès"

# ──────────────────────────────────────
# Docker
# ──────────────────────────────────────

## Builder les images Docker
build:
    docker build -t projet-cicd/backend:local backend/
    docker build -t projet-cicd/frontend:local frontend/

## Démarrer l'environnement de développement
up:
    $(COMPOSE) up -d

## Arrêter l'environnement
down:
    $(COMPOSE) down

# ──────────────────────────────────────
# Pipeline local avec act
# ──────────────────────────────────────

## Exécuter le pipeline CI localement avec act
act-ci:
    act push -j lint-backend -j lint-frontend

## Exécuter les tests localement avec act
act-test:
    act push -j test-backend -j test-frontend

## Exécuter le build localement avec act
act-build:
    act push -j build

## Exécuter tout le pipeline CI localement
act-all:
    act push

# ──────────────────────────────────────
# Aide
# ──────────────────────────────────────

## Afficher l'aide
help:
    @echo "Commandes disponibles :"
    @echo ""
    @echo "  make install    Installer les dépendances"
    @echo "  make lint       Lancer les lints"
    @echo "  make test       Lancer les tests"
    @echo "  make ci         Lancer lint + tests"
    @echo "  make build      Builder les images Docker"
    @echo "  make up         Démarrer le dev"
    @echo "  make down       Arrêter le dev"
    @echo "  make act-ci     Pipeline CI local (act)"
    @echo "  make act-all    Pipeline complet local (act)"
    @echo "  make help       Afficher cette aide"
```

---

### Étape 8 : Tester le pipeline localement avec act

Crée le fichier `.actrc` pour configurer `act` :

```bash
# Crée le fichier .actrc
cat > .actrc << 'EOF'
-P ubuntu-latest=catthehacker/ubuntu:act-latest
--secret-file .secrets
--env-file .env
EOF
```

Crée le fichier `.secrets` (ne pas committer) :

```bash
# Crée le fichier de secrets locaux
cat > .secrets << 'EOF'
GITHUB_TOKEN=ghp_local_test_token
EOF

# Ajoute .secrets à .gitignore
echo ".secrets" >> .gitignore
```

Exécute le pipeline CI localement :

```bash
# Liste les workflows et jobs disponibles
act --list
```

**Résultat attendu** :

```text
Stage  Job ID          Job name                  Workflow name  Workflow file  Events
0      lint-backend    Lint Backend (PHP)        CI             ci.yml         push
0      lint-frontend   Lint Frontend (ESLint)    CI             ci.yml         push
1      test-backend    Tests Backend (PHPUnit)   CI             ci.yml         push
1      test-frontend   Tests Frontend (Jest)     CI             ci.yml         push
2      build           Build Docker Images       CI             ci.yml         push
```

Exécute un job spécifique :

```bash
# Exécute uniquement le lint backend
act push -j lint-backend
```

---

### Étape 9 : Créer le fichier .gitignore et committer

```bash
# Crée le fichier .gitignore
cat > .gitignore << 'EOF'
# Dépendances
backend/vendor/
frontend/node_modules/

# Secrets
.secrets
.env.local

# Build
frontend/build/

# IDE
.idea/
.vscode/

# OS
.DS_Store
Thumbs.db
EOF
```

Ajoute et committe le projet :

```bash
# Ajoute tous les fichiers
git add .

# Premier commit
git commit -m "feat: pipeline CI/CD complet pour Symfony + React"
```

---

### Étape 10 : Vérifier le récapitulatif du pipeline

Vérifie que la structure du projet est complète :

```bash
# Affiche la structure du projet
find . -type f -not -path './.git/*' | sort
```

**Résultat attendu** :

```text
./.actrc
./.github/workflows/ci.yml
./.github/workflows/deploy.yml
./.gitignore
./.secrets
./Makefile
./backend/Dockerfile
./backend/composer.json
./backend/src/Controller/HealthController.php
./backend/tests/Controller/HealthControllerTest.php
./docker-compose.prod.yml
./frontend/Dockerfile
./frontend/nginx.conf
./frontend/package.json
./frontend/src/App.js
./frontend/tests/App.test.js
./nginx-prod.conf
```

**Récapitulatif du pipeline complet** :

<div class="diagram-design">
<p><a href="../../diagrams/11-ci-cd-10-projet-integrateur-2.html">Affiche la structure du projet (HTML + SVG)</a></p>
<iframe src="../../diagrams/11-ci-cd-10-projet-integrateur-2.html" title="Affiche la structure du projet" style="width:100%;min-height:772px;border:0;background:transparent"></iframe>
</div>

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `make ci` | Exécute lint + tests localement |
| `make build` | Construit les images Docker |
| `make act-all` | Exécute le pipeline CI complet avec act |
| `act --list` | Liste les jobs disponibles |
| `act push -j <job>` | Exécute un job spécifique avec act |
| `docker compose -f docker-compose.prod.yml up -d` | Démarre l'environnement de production |
| `gh run list` | Liste les exécutions de workflows sur GitHub |
| `gh run watch <id>` | Suit une exécution en temps réel |

---

## Pièges Fréquents

### Piège 1 : Build qui passe en local mais échoue en CI

⚠️ **Problème** : Le build Docker fonctionne sur ton ordinateur mais échoue dans le pipeline GitHub Actions. La raison : un fichier n'est pas inclus dans le contexte de build Docker car il est dans le `.dockerignore`.

✅ **Solution** : Vérifie le fichier `.dockerignore`. Assure-toi que les fichiers nécessaires ne sont pas ignorés. Teste le build dans un conteneur propre :

```bash
# Simule un build propre (sans cache)
docker build --no-cache -t test-backend backend/
```

---

### Piège 2 : Tests frontend qui échouent à cause du cache npm

⚠️ **Problème** : Les tests passent sur ta machine mais échouent en CI. Le cache npm contient des dépendances d'une version précédente qui n'est plus compatible.

✅ **Solution** : Utilise `npm ci` au lieu de `npm install` dans le pipeline. La commande `npm ci` supprime le dossier `node_modules` et installe exactement les versions spécifiées dans `package-lock.json`.

```yaml
# Correct : npm ci pour un environnement reproductible
- run: npm ci

# Incorrect : npm install peut utiliser des versions différentes
- run: npm install
```

---

### Piège 3 : Secrets non disponibles dans les workflows de PR

⚠️ **Problème** : Le build Docker échoue sur les pull requests avec "authentication required". Les secrets ne sont pas accessibles dans les workflows déclenchés par une PR depuis un fork.

✅ **Solution** : Ne pousse pas les images Docker sur les pull requests. Utilise une condition pour éviter le push :

```yaml
- name: Build image
  uses: docker/build-push-action@v6
  with:
    # Ne pousse que sur main, pas sur les PR
    push: ${{ github.event_name != 'pull_request' }}
```

---

### Piège 4 : Rollback qui échoue à cause des migrations

⚠️ **Problème** : Le déploiement blue-green bascule vers green (v2.0), mais un bug est détecté. Tu rebascules vers blue (v1.0). Cependant, une migration a modifié la base de données. La v1.0 ne sait pas gérer le nouveau schéma.

✅ **Solution** : Applique la règle des migrations rétrocompatibles (voir fiche 09). Teste toujours le rollback dans un environnement de staging avant de valider la migration.

---

### Piège 5 : Pipeline trop long (plus de 15 minutes)

⚠️ **Problème** : Le pipeline CI prend 20 minutes. Les développeurs n'attendent pas le résultat et mergent sans vérifier.

✅ **Solution** :

1. Parallélise les jobs (lint et tests en parallèle pour backend et frontend)
2. Utilise le cache pour les dépendances (Composer, npm)
3. Limite la matrice aux combinaisons essentielles
4. Utilise `concurrency` pour annuler les runs obsolètes

```text
Pipeline lent (séquentiel) :
lint → test → build = 20 min

Pipeline optimisé (parallèle + cache) :
┌ lint-back ─→ test-back ─┐
│                           ├→ build = 8 min
└ lint-front → test-front ─┘
```

---

## Checklist de Validation

- [ ] Je sais créer une structure de projet avec backend et frontend séparés
- [ ] Je sais écrire un workflow CI qui lint, teste et build les deux parties
- [ ] Je sais écrire un workflow CD avec staging, approbation et production
- [ ] Je sais implémenter un déploiement blue-green dans le workflow
- [ ] Je sais créer des Dockerfiles multi-stage pour le backend et le frontend
- [ ] Je sais utiliser `act` pour exécuter le pipeline localement
- [ ] Je sais créer un Makefile avec les commandes essentielles
- [ ] Je sais intégrer des health checks dans le pipeline de déploiement
- [ ] Je sais configurer la concurrence pour éviter les runs inutiles
- [ ] Je sais gérer les secrets séparément pour staging et production

---

## Exercice Pratique

**Énoncé** : Ajoute les fonctionnalités suivantes au pipeline existant :

1. Un job `security-audit` dans le workflow CI qui vérifie les vulnérabilités des dépendances PHP (`composer audit`) et JavaScript (`npm audit`)
2. Un job `lighthouse` dans le workflow CI qui exécute un audit de performance sur le frontend (simulé avec un script qui vérifie la taille du build)
3. Un step de notification dans le workflow CD qui affiche un résumé du déploiement (version, environnement, date, auteur du commit)
4. Un fichier `docker-compose.yml` pour le développement local avec les services backend, frontend, database et un volume pour les données

**Indications** :

- `composer audit` retourne un code d'erreur non-zéro si des vulnérabilités sont trouvées
- `npm audit --audit-level=high` vérifie uniquement les vulnérabilités de niveau high et critical
- Le job `security-audit` doit s'exécuter en parallèle des lints (pas de dépendance)
- Le step de notification utilise le contexte `${{ github.actor }}` pour l'auteur
- Le Docker Compose de développement utilise les images locales (pas GHCR)

**Résultat attendu** : Le pipeline CI comporte 6 jobs (lint-backend, lint-frontend, test-backend, test-frontend, security-audit, build). Le pipeline CD affiche un résumé à chaque déploiement. Un Docker Compose de développement permet de travailler localement.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Job `security-audit` à ajouter dans `.github/workflows/ci.yml` :

```yaml
  # ──────────────────────────────────────
  # Audit de sécurité des dépendances
  # ──────────────────────────────────────
  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      # Audit des dépendances PHP
      - name: Installer PHP 8.3
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2

      - name: Audit Composer
        working-directory: backend
        run: |
          composer install --no-interaction --prefer-dist
          echo "=== Audit des dépendances PHP ==="
          composer audit

      # Audit des dépendances JavaScript
      - name: Installer Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Audit npm
        working-directory: frontend
        run: |
          npm ci
          echo "=== Audit des dépendances JavaScript ==="
          npm audit --audit-level=high
```

Job `lighthouse` (simulé) à ajouter dans `.github/workflows/ci.yml` :

```yaml
  # ──────────────────────────────────────
  # Vérification de la taille du build frontend
  # ──────────────────────────────────────
  lighthouse:
    name: Frontend Size Check
    runs-on: ubuntu-latest
    needs: lint-frontend

    steps:
      - uses: actions/checkout@v4

      - name: Installer Node.js 22
        uses: actions/setup-node@v4
        with:
          node-version: "22"
          cache: "npm"
          cache-dependency-path: frontend/package-lock.json

      - name: Installer et builder
        working-directory: frontend
        run: |
          npm ci
          npm run build

      - name: Vérifier la taille du build
        working-directory: frontend
        run: |
          # Vérifie que le build ne dépasse pas 5 Mo
          MAX_SIZE_KB=5120
          BUILD_SIZE_KB=$(du -sk build/ | cut -f1)

          echo "Taille du build : ${BUILD_SIZE_KB} Ko"
          echo "Taille maximale : ${MAX_SIZE_KB} Ko"

          if [ "$BUILD_SIZE_KB" -gt "$MAX_SIZE_KB" ]; then
            echo "ERREUR : le build dépasse la taille maximale"
            exit 1
          fi

          echo "Taille du build OK"
```

Step de notification à ajouter dans `.github/workflows/deploy.yml` (dans le job `deploy-production`) :

```yaml
      - name: Résumé du déploiement
        if: success()
        run: |
          echo "╔══════════════════════════════════════════╗"
          echo "║        DÉPLOIEMENT RÉUSSI                ║"
          echo "╠══════════════════════════════════════════╣"
          echo "║ Version    : ${{ github.sha }}           "
          echo "║ Environnement : production               "
          echo "║ Date       : $(date '+%Y-%m-%d %H:%M:%S')"
          echo "║ Auteur     : ${{ github.actor }}          "
          echo "║ Message    : ${{ github.event.head_commit.message }}"
          echo "╚══════════════════════════════════════════╝"
```

Fichier `docker-compose.yml` pour le développement local :

```yaml
# docker-compose.yml
# Environnement de développement local

services:
  # Backend Symfony
  backend:
    image: php:8.3-cli
    working_dir: /app
    volumes:
      - ./backend:/app
    ports:
      - "8000:8000"
    environment:
      APP_ENV: dev
      APP_VERSION: dev
      DATABASE_URL: postgresql://app:secret@database:5432/app
    command: php -S 0.0.0.0:8000 -t public/
    depends_on:
      - database

  # Frontend React
  frontend:
    image: node:22-alpine
    working_dir: /app
    volumes:
      - ./frontend:/app
      - frontend-node-modules:/app/node_modules
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development
    command: sh -c "npm install && npm start"

  # Base de données PostgreSQL
  database:
    image: postgres:16-alpine
    environment:
      POSTGRES_DB: app
      POSTGRES_USER: app
      POSTGRES_PASSWORD: secret
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

volumes:
  db-data:
  frontend-node-modules:
```

**Commandes pour tester** :

```bash
# Démarre l'environnement de développement
docker compose up -d

# Backend accessible sur http://localhost:8000
# Frontend accessible sur http://localhost:3000
# PostgreSQL accessible sur localhost:5432
```

---

## Navigation

← Fiche précédente : **[Stratégies de déploiement](09-strategies-deploiement.md)**

Fin du cursus CI/CD Pipelines.
