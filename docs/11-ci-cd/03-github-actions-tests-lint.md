---
tags:
  - CI/CD
  - Intermédiaire
  - Pratique
description: "Configurer un workflow GitHub Actions pour exécuter les tests et le linting automatiquement"
estimated_time: "90 min"
fiche_number: 3
total_fiches: 10
cursus: "CI/CD Pipelines"
id: "infrastructure.cicd.github-actions-tests-lint"
course_id: "infrastructure.cicd"
content_type: "lesson"
order: 3
---

# 03 - GitHub Actions - Tests et lint

> **En bref** : Cette fiche t'apprend à configurer des workflows GitHub Actions pour lancer automatiquement PHPUnit, markdownlint, PHP CS Fixer, Jest, et à mettre en cache les dépendances. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche [02 - GitHub Actions - Premiers pas](02-github-actions-premiers-pas.md)
- Connaître les bases de PHPUnit (exécuter des tests)
- Connaître les bases de npm (installer des packages)
- Savoir ce qu'est un linter (outil de vérification du code)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des workflows qui exécutent automatiquement les tests unitaires (PHPUnit, Jest), le linting (PHP CS Fixer, markdownlint), et qui utilisent le cache pour accélérer les pipelines.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le linting dans un pipeline CI ?

**Définition** : Le linting est la vérification automatique du formatage et du style du code. Dans un pipeline CI, le linting s'exécute avant les tests pour détecter rapidement les problèmes de style.

**Le problème que le linting CI résout** :

Sans linting automatisé, voici les problèmes rencontrés :

1. **Style incohérent** : Chaque développeur formate le code différemment. Les revues de code passent du temps à signaler des problèmes de style au lieu de se concentrer sur la logique.

2. **Oubli du lint local** : Un développeur oublie de lancer le linter avant de pousser. Le code mal formaté arrive dans le dépôt.

3. **Débats sans fin** : L'équipe débat des règles de formatage à chaque revue. "Faut-il un espace avant l'accolade ?" La discussion est inutile si un outil tranche automatiquement.

**Comment le linting CI résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Style incohérent | Le linter impose les mêmes règles à tout le monde |
| Oubli du lint local | Le pipeline CI lance le linter automatiquement à chaque push |
| Débats sans fin | Les règles sont dans un fichier de configuration, pas dans les discussions |

**Analogie concrète** : Imagine un correcteur orthographique intégré à une imprimerie. Chaque manuscrit passe par le correcteur avant impression. Même si l'auteur a oublié de relire, les fautes sont détectées. Le linting CI est ce correcteur automatique.

---

### Qu'est-ce que le cache dans un pipeline CI ?

**Définition** : Le cache permet de sauvegarder des fichiers entre les exécutions d'un pipeline. Les dépendances (vendor/, node_modules/) sont téléchargées une fois, puis réutilisées lors des exécutions suivantes.

**Le problème que le cache résout** :

Sans cache, voici les problèmes rencontrés :

1. **Lenteur** : À chaque exécution du pipeline, `composer install` télécharge toutes les dépendances depuis Internet. Pour un projet Symfony, cela prend 1 à 3 minutes.

2. **Consommation de bande passante** : Chaque exécution télécharge des centaines de Mo. Multiplié par 20 push par jour, cela consomme beaucoup de bande passante.

3. **Dépendance au réseau** : Si le serveur de packages est lent ou indisponible, le pipeline échoue.

**Comment le cache résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Lenteur | Les dépendances sont récupérées depuis le cache en quelques secondes |
| Consommation de bande passante | Les fichiers ne sont téléchargés qu'une fois |
| Dépendance au réseau | Le cache est stocké par GitHub, pas sur un serveur externe |

**Analogie concrète** : Imagine que tu prépares un gâteau chaque jour. Sans garde-manger, tu vas au supermarché chaque jour pour acheter farine, sucre, beurre. Avec un garde-manger, tu achètes une seule fois et tu pioches dedans chaque jour. Le cache CI est ce garde-manger.

**Ce que le cache n'est PAS** :

- Le cache n'est pas permanent. Par défaut, GitHub supprime les entrées de cache après 7 jours sans utilisation (la rétention peut être allongée dans les paramètres Actions du dépôt).
- Le cache n'est pas partagé entre toutes les branches. Une exécution sur `feature-x` peut restaurer un cache créé sur la branche par défaut (`main`). Un cache créé sur `feature-x` n'est pas accessible depuis `main` ni depuis une autre branche de feature.

---

### Qu'est-ce qu'un artefact de test ?

**Définition** : Un artefact de test est un fichier produit par les tests et sauvegardé par le pipeline. Par exemple : un rapport de couverture de code, un fichier de logs, un rapport JUnit XML.

**Le problème que les artefacts résolvent** :

Sans artefacts, les résultats détaillés des tests disparaissent à la fin du pipeline. Tu vois "tests échoués" mais tu ne peux pas télécharger le rapport de couverture ou les screenshots de tests.

**Comment les artefacts résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Résultats perdus | Les artefacts sont sauvegardés et téléchargeables depuis l'interface GitHub |

---

## Étapes Pratiques

### Étape 1 : Créer un projet PHP avec des tests

Crée un projet PHP minimal avec PHPUnit :

```bash
# Crée le dossier du projet
mkdir mon-projet-php-ci
cd mon-projet-php-ci

# Initialise Composer
composer init --name="test/ci-demo" --type="project" --no-interaction

# Installe PHPUnit
composer require --dev phpunit/phpunit

# Crée la structure de dossiers
mkdir -p src tests
```

Crée le fichier `src/Calculator.php` :

```php
<?php

// Classe simple pour les démonstrations de tests
namespace App;

class Calculator
{
    // Additionne deux nombres et retourne le résultat
    public function add(int $a, int $b): int
    {
        return $a + $b;
    }

    // Soustrait le deuxième nombre du premier
    public function subtract(int $a, int $b): int
    {
        return $a - $b;
    }

    // Multiplie deux nombres
    public function multiply(int $a, int $b): int
    {
        return $a * $b;
    }

    // Divise le premier nombre par le deuxième
    // Lance une exception si le diviseur est zéro
    public function divide(int $a, int $b): float
    {
        if ($b === 0) {
            throw new \InvalidArgumentException('Division par zéro impossible');
        }

        return $a / $b;
    }
}
```

Crée le fichier `tests/CalculatorTest.php` :

```php
<?php

// Tests unitaires pour la classe Calculator
namespace Tests;

use App\Calculator;
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;

    // Exécuté avant chaque test : crée une instance de Calculator
    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    // Teste l'addition de deux nombres positifs
    public function testAdd(): void
    {
        $result = $this->calculator->add(2, 3);
        $this->assertSame(5, $result);
    }

    // Teste la soustraction
    public function testSubtract(): void
    {
        $result = $this->calculator->subtract(10, 4);
        $this->assertSame(6, $result);
    }

    // Teste la multiplication
    public function testMultiply(): void
    {
        $result = $this->calculator->multiply(3, 7);
        $this->assertSame(21, $result);
    }

    // Teste la division
    public function testDivide(): void
    {
        $result = $this->calculator->divide(10, 2);
        $this->assertSame(5.0, $result);
    }

    // Teste que la division par zéro lance une exception
    public function testDivideByZero(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->calculator->divide(10, 0);
    }
}
```

Crée le fichier `phpunit.xml` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit bootstrap="vendor/autoload.php"
         colors="true">
    <testsuites>
        <testsuite name="Tests">
            <directory>tests</directory>
        </testsuite>
    </testsuites>
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

Vérifie que les tests passent en local :

```bash
# Lance les tests
vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 12.x.x

.....                                                               5 / 5 (100%)

Time: 00:00.xxx, Memory: x.xx MB

OK (5 tests, 5 assertions)
```

---

### Étape 2 : Créer un workflow PHPUnit

Crée le fichier `.github/workflows/phpunit.yml` :

```yaml
# Workflow qui exécute les tests PHPUnit à chaque push
name: PHPUnit Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  tests:
    # Nom affiché dans l'interface GitHub
    name: Tests PHP 8.3
    runs-on: ubuntu-latest

    steps:
      # Étape 1 : récupérer le code du dépôt
      - name: Récupérer le code
        uses: actions/checkout@v7

      # Étape 2 : installer PHP 8.3 avec les extensions nécessaires
      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          # Version de PHP à installer
          php-version: "8.3"
          # Extensions PHP nécessaires (séparées par des virgules)
          extensions: mbstring, xml, ctype, iconv
          # Outils supplémentaires à installer
          tools: composer:v2
          # Activer la couverture de code avec Xdebug
          coverage: xdebug

      # Étape 3 : mettre en cache les dépendances Composer
      - name: Cache Composer
        uses: actions/cache@v5
        with:
          # Dossier à mettre en cache
          path: vendor
          # Clé de cache basée sur le fichier composer.lock
          # Si composer.lock change, le cache est recréé
          key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
          # Clés de secours si la clé exacte n'est pas trouvée
          restore-keys: |
            ${{ runner.os }}-composer-

      # Étape 4 : installer les dépendances
      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      # Étape 5 : exécuter les tests
      - name: Exécuter PHPUnit
        run: vendor/bin/phpunit --testdox
```

**Résultat attendu** :

```text
Le workflow s'exécute et affiche :
✓ Récupérer le code
✓ Installer PHP
✓ Cache Composer (miss ou hit)
✓ Installer les dépendances
✓ Exécuter PHPUnit → 5 tests, 5 assertions, OK
```

---

### Étape 3 : Ajouter PHP CS Fixer au pipeline

Installe PHP CS Fixer dans le projet :

```bash
# Installe PHP CS Fixer
composer require --dev friendsofphp/php-cs-fixer
```

Crée le fichier `.php-cs-fixer.dist.php` :

```php
<?php

// Configuration de PHP CS Fixer
$finder = (new PhpCsFixer\Finder())
    // Cherche les fichiers PHP dans le dossier src/
    ->in(__DIR__ . '/src')
    // Cherche aussi dans le dossier tests/
    ->in(__DIR__ . '/tests');

return (new PhpCsFixer\Config())
    ->setRules([
        // Utilise le jeu de règles Symfony
        '@Symfony' => true,
        // Force la déclaration strict_types
        'declare_strict_types' => true,
    ])
    ->setFinder($finder);
```

Crée le fichier `.github/workflows/lint.yml` :

```yaml
# Workflow qui vérifie le formatage du code PHP
name: Lint PHP

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  php-cs-fixer:
    name: PHP CS Fixer
    runs-on: ubuntu-latest

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v7

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2, cs2pr

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      # Exécute PHP CS Fixer en mode "dry-run"
      # --dry-run : vérifie sans modifier les fichiers
      # --diff : affiche les différences trouvées
      # Si des problèmes sont détectés, la commande retourne un code d'erreur
      # et le pipeline échoue
      - name: Vérifier le formatage
        run: vendor/bin/php-cs-fixer fix --dry-run --diff --verbose
```

**Résultat attendu** :

```text
Si le code est bien formaté :
✓ Vérifier le formatage → aucune modification nécessaire

Si le code est mal formaté :
✗ Vérifier le formatage → affiche les différences et le pipeline échoue
```

---

### Étape 4 : Ajouter markdownlint au pipeline

Crée le fichier `package.json` :

```json
{
  "name": "ci-demo",
  "private": true,
  "scripts": {
    "lint:md": "markdownlint '**/*.md' --ignore node_modules"
  },
  "devDependencies": {
    "markdownlint-cli": "^0.41.0"
  }
}
```

Crée le fichier `.markdownlint.json` :

```json
{
  "default": true,
  "MD013": {
    "line_length": 500
  },
  "MD033": false
}
```

Crée le fichier `.github/workflows/markdownlint.yml` :

```yaml
# Workflow qui vérifie le formatage des fichiers Markdown
name: Markdown Lint

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  markdownlint:
    name: markdownlint
    runs-on: ubuntu-latest

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v7

      # Installe Node.js (nécessaire pour markdownlint)
      - name: Installer Node.js
        uses: actions/setup-node@v7
        with:
          node-version: "22"
          # Cache intégré à l'action setup-node
          cache: "npm"

      - name: Installer les dépendances
        run: npm ci

      # Exécute markdownlint sur tous les fichiers .md
      - name: Vérifier le Markdown
        run: npm run lint:md
```

**Résultat attendu** :

```text
Si le Markdown est valide :
✓ Vérifier le Markdown → aucune erreur

Si le Markdown a des problèmes :
✗ Vérifier le Markdown → liste des erreurs avec fichier et ligne
```

---

### Étape 5 : Créer un workflow Jest pour JavaScript

Crée les fichiers pour une application JavaScript minimale.

Fichier `src/utils.js` :

```javascript
// Fonctions utilitaires pour les démonstrations
function capitalize(str) {
  // Vérifie que l'argument est une chaîne
  if (typeof str !== "string") {
    throw new TypeError("L'argument doit être une chaîne de caractères");
  }
  // Retourne la chaîne avec la première lettre en majuscule
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function sum(numbers) {
  // Vérifie que l'argument est un tableau
  if (!Array.isArray(numbers)) {
    throw new TypeError("L'argument doit être un tableau");
  }
  // Additionne tous les nombres du tableau
  return numbers.reduce((total, n) => total + n, 0);
}

module.exports = { capitalize, sum };
```

Fichier `tests/utils.test.js` :

```javascript
// Tests pour les fonctions utilitaires
const { capitalize, sum } = require("../src/utils");

describe("capitalize", () => {
  test("met la première lettre en majuscule", () => {
    expect(capitalize("hello")).toBe("Hello");
  });

  test("gère une chaîne vide", () => {
    expect(capitalize("")).toBe("");
  });

  test("lance une erreur si ce n'est pas une chaîne", () => {
    expect(() => capitalize(123)).toThrow(TypeError);
  });
});

describe("sum", () => {
  test("additionne un tableau de nombres", () => {
    expect(sum([1, 2, 3])).toBe(6);
  });

  test("retourne 0 pour un tableau vide", () => {
    expect(sum([])).toBe(0);
  });

  test("lance une erreur si ce n'est pas un tableau", () => {
    expect(() => sum("abc")).toThrow(TypeError);
  });
});
```

Ajoute Jest dans `package.json` :

```json
{
  "name": "ci-demo",
  "private": true,
  "scripts": {
    "lint:md": "markdownlint '**/*.md' --ignore node_modules",
    "test": "jest"
  },
  "devDependencies": {
    "jest": "^29.7.0",
    "markdownlint-cli": "^0.41.0"
  }
}
```

Crée le fichier `.github/workflows/jest.yml` :

```yaml
# Workflow qui exécute les tests JavaScript avec Jest
name: Jest Tests

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  jest:
    name: Tests JavaScript
    runs-on: ubuntu-latest

    steps:
      - name: Récupérer le code
        uses: actions/checkout@v7

      - name: Installer Node.js
        uses: actions/setup-node@v7
        with:
          node-version: "22"
          cache: "npm"

      - name: Installer les dépendances
        run: npm ci

      # Exécute Jest avec le flag --ci (optimisé pour la CI)
      # --coverage génère un rapport de couverture de code
      - name: Exécuter les tests
        run: npx jest --ci --coverage

      # Sauvegarde le rapport de couverture comme artefact
      - name: Sauvegarder le rapport de couverture
        uses: actions/upload-artifact@v5
        # "if: always()" signifie que cette étape s'exécute
        # même si les tests échouent
        if: always()
        with:
          # Nom de l'artefact (affiché dans l'interface GitHub)
          name: coverage-report
          # Dossier à sauvegarder
          path: coverage/
          # Durée de conservation en jours
          retention-days: 5
```

**Résultat attendu** :

```text
Le workflow affiche :
✓ Exécuter les tests → 6 tests passés
✓ Sauvegarder le rapport de couverture → artefact téléchargeable
```

---

### Étape 6 : Créer un workflow combiné (lint + tests)

Crée le fichier `.github/workflows/ci.yml` qui combine tout :

```yaml
# Workflow principal qui exécute lint et tests
name: CI

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  # Job 1 : linting PHP (rapide)
  lint-php:
    name: Lint PHP
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2

      - name: Cache Composer
        uses: actions/cache@v5
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: PHP CS Fixer
        run: vendor/bin/php-cs-fixer fix --dry-run --diff

  # Job 2 : linting Markdown (rapide)
  lint-md:
    name: Lint Markdown
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: "22"
          cache: "npm"

      - run: npm ci
      - run: npm run lint:md

  # Job 3 : tests PHP (attend le lint PHP)
  test-php:
    name: Tests PHP
    runs-on: ubuntu-latest
    needs: lint-php
    steps:
      - uses: actions/checkout@v7

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2
          coverage: xdebug

      - name: Cache Composer
        uses: actions/cache@v5
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - run: composer install --no-interaction --prefer-dist
      - run: vendor/bin/phpunit --testdox

  # Job 4 : tests JavaScript (attend le lint Markdown)
  test-js:
    name: Tests JavaScript
    runs-on: ubuntu-latest
    needs: lint-md
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: "22"
          cache: "npm"

      - run: npm ci
      - run: npx jest --ci --coverage
```

**Résultat attendu** :

```text
Schéma d'exécution :

┌───────────┐         ┌───────────┐
│ lint-php  │────────▶│ test-php  │
└───────────┘         └───────────┘

┌───────────┐         ┌───────────┐
│ lint-md   │────────▶│ test-js   │
└───────────┘         └───────────┘

Les deux branches s'exécutent en parallèle.
```

---

### Étape 7 : Comprendre les clés de cache

La clé de cache est importante. Voici comment elle fonctionne :

```yaml
# Clé de cache basée sur le hash du fichier composer.lock
key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
```

```text
Décomposition de la clé :

${{ runner.os }}                    → "Linux" (le système d'exploitation)
composer                            → un identifiant que tu choisis
${{ hashFiles('composer.lock') }}   → un hash unique du fichier composer.lock

Exemple de clé générée : "Linux-composer-abc123def456"

Comportement :
1. Si composer.lock n'a pas changé → le hash est le même → cache HIT
2. Si composer.lock a changé → le hash est différent → cache MISS → nouveau téléchargement
```

**Clés de cache pour différents langages** :

| Langage | Fichier de lock | Dossier à cacher | Clé de cache |
| --- | --- | --- | --- |
| PHP | `composer.lock` | `vendor` | `${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}` |
| Node.js | `package-lock.json` | `node_modules` | `${{ runner.os }}-node-${{ hashFiles('package-lock.json') }}` |
| Python | `requirements.txt` | `~/.cache/pip` | `${{ runner.os }}-pip-${{ hashFiles('requirements.txt') }}` |

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `vendor/bin/phpunit --testdox` | Exécute PHPUnit avec un affichage lisible |
| `vendor/bin/php-cs-fixer fix --dry-run --diff` | Vérifie le formatage PHP sans modifier les fichiers |
| `npm run lint:md` | Exécute markdownlint sur les fichiers Markdown |
| `npx jest --ci --coverage` | Exécute Jest avec rapport de couverture |
| `composer install --no-interaction` | Installe les dépendances sans questions interactives |
| `npm ci` | Installe les dépendances depuis le lockfile (plus rapide que `npm install`) |

---

## Pièges Fréquents

### Piège 1 : Utiliser `npm install` au lieu de `npm ci` en CI

⚠️ **Problème** : Tu utilises `npm install` dans le pipeline. Cette commande peut modifier `package-lock.json` et installer des versions différentes de celles prévues.

✅ **Solution** : Utilise toujours `npm ci` en CI. Cette commande installe exactement les versions spécifiées dans `package-lock.json` et supprime `node_modules` avant l'installation.

```yaml
# Incorrect en CI
- run: npm install

# Correct en CI
- run: npm ci
```

---

### Piège 2 : Oublier `--no-interaction` avec Composer

⚠️ **Problème** : Tu exécutes `composer install` sans `--no-interaction`. Composer pose une question interactive (par exemple "Do you want to remove the existing VCS?"). Le pipeline se bloque car personne ne peut répondre.

✅ **Solution** : Ajoute toujours `--no-interaction` (ou `-n`) à toutes les commandes Composer en CI.

```yaml
# Incorrect : risque de blocage
- run: composer install

# Correct : pas de question interactive
- run: composer install --no-interaction --prefer-dist
```

---

### Piège 3 : Cache invalidé trop souvent

⚠️ **Problème** : Tu utilises `hashFiles('composer.json')` au lieu de `hashFiles('composer.lock')` pour la clé de cache. Comme `composer.json` change plus souvent (ajout de scripts, modification de la description), le cache est invalidé inutilement.

✅ **Solution** : Base la clé de cache sur le fichier de lock (`composer.lock`, `package-lock.json`), pas sur le fichier de configuration.

```yaml
# Incorrect : cache invalidé trop souvent
key: ${{ runner.os }}-composer-${{ hashFiles('composer.json') }}

# Correct : cache invalidé uniquement quand les dépendances changent
key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
```

---

### Piège 4 : Tests qui passent en local mais échouent en CI

⚠️ **Problème** : Les tests passent sur ton ordinateur mais échouent dans le pipeline. Causes fréquentes : chemin de fichier différent (Linux vs macOS), fuseau horaire différent, variable d'environnement manquante.

✅ **Solution** : Vérifie ces points :

1. Les chemins de fichiers sont-ils relatifs (pas absolus) ?
2. Les tests dépendent-ils d'un fuseau horaire ? Si oui, configure-le en CI.
3. Les variables d'environnement nécessaires sont-elles définies ?

```yaml
# Configurer le fuseau horaire dans le pipeline
- name: Configurer le fuseau horaire
  run: sudo timedatectl set-timezone Europe/Paris

# Définir des variables d'environnement
- name: Exécuter les tests
  run: vendor/bin/phpunit
  env:
    APP_ENV: test
    DATABASE_URL: sqlite:///%kernel.project_dir%/var/test.db
```

---

## Checklist de Validation

- [ ] Je sais créer un workflow qui exécute PHPUnit
- [ ] Je sais créer un workflow qui exécute PHP CS Fixer en mode vérification
- [ ] Je sais créer un workflow qui exécute markdownlint
- [ ] Je sais créer un workflow qui exécute Jest
- [ ] Je comprends le fonctionnement du cache et des clés de cache
- [ ] Je sais utiliser `actions/upload-artifact` pour sauvegarder des rapports
- [ ] Je sais combiner plusieurs jobs dans un workflow avec `needs`
- [ ] J'utilise `npm ci` et `composer install --no-interaction` en CI

---

## Exercice Pratique

**Énoncé** : Crée un workflow `ci-complet.yml` pour un projet qui contient du PHP et du JavaScript. Le workflow doit :

1. Vérifier le formatage PHP avec PHP CS Fixer
2. Vérifier le formatage Markdown avec markdownlint
3. Exécuter les tests PHPUnit (seulement si le lint PHP passe)
4. Exécuter les tests Jest (seulement si le lint Markdown passe)
5. Utiliser le cache pour Composer et npm
6. Sauvegarder le rapport de couverture Jest comme artefact

**Indications** :

- Utilise 4 jobs : `lint-php`, `lint-md`, `test-php`, `test-js`
- `test-php` dépend de `lint-php` (utilise `needs`)
- `test-js` dépend de `lint-md`
- Utilise `actions/cache@v5` pour Composer
- Utilise le cache intégré de `actions/setup-node@v7` pour npm
- Utilise `actions/upload-artifact@v5` pour le rapport de couverture

**Résultat attendu** : Le workflow s'exécute avec 4 jobs. Les deux branches (PHP et JS) sont parallèles. Le rapport de couverture est téléchargeable.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `.github/workflows/ci-complet.yml` :

```yaml
# Workflow CI complet avec lint et tests pour PHP et JavaScript
name: CI Complet

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  # ──────────────────────────────────────
  # Branche PHP : lint → tests
  # ──────────────────────────────────────

  lint-php:
    name: Lint PHP
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2

      - name: Cache Composer
        uses: actions/cache@v5
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: Vérifier le formatage PHP
        run: vendor/bin/php-cs-fixer fix --dry-run --diff --verbose

  test-php:
    name: Tests PHP
    runs-on: ubuntu-latest
    # Attend que le lint PHP soit terminé
    needs: lint-php
    steps:
      - uses: actions/checkout@v7

      - name: Installer PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: "8.3"
          tools: composer:v2
          coverage: xdebug

      - name: Cache Composer
        uses: actions/cache@v5
        with:
          path: vendor
          key: ${{ runner.os }}-composer-${{ hashFiles('composer.lock') }}
          restore-keys: ${{ runner.os }}-composer-

      - name: Installer les dépendances
        run: composer install --no-interaction --prefer-dist

      - name: Exécuter PHPUnit
        run: vendor/bin/phpunit --testdox

  # ──────────────────────────────────────
  # Branche JavaScript : lint → tests
  # ──────────────────────────────────────

  lint-md:
    name: Lint Markdown
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: "22"
          cache: "npm"

      - run: npm ci
      - run: npm run lint:md

  test-js:
    name: Tests JavaScript
    runs-on: ubuntu-latest
    # Attend que le lint Markdown soit terminé
    needs: lint-md
    steps:
      - uses: actions/checkout@v7

      - uses: actions/setup-node@v7
        with:
          node-version: "22"
          cache: "npm"

      - run: npm ci

      - name: Exécuter Jest avec couverture
        run: npx jest --ci --coverage

      # Sauvegarde le rapport de couverture
      - name: Sauvegarder le rapport de couverture
        uses: actions/upload-artifact@v5
        if: always()
        with:
          name: jest-coverage-report
          path: coverage/
          retention-days: 7
```

**Explication** :

- Le workflow contient 4 jobs organisés en deux branches parallèles
- Branche PHP : `lint-php` → `test-php` (séquentiels grâce à `needs`)
- Branche JS : `lint-md` → `test-js` (séquentiels grâce à `needs`)
- Les deux branches s'exécutent en parallèle
- Le cache Composer utilise `composer.lock` comme clé
- Le cache npm est intégré à `actions/setup-node@v7`
- Le rapport de couverture Jest est sauvegardé avec `if: always()`

---

## Navigation

← Fiche précédente : **[GitHub Actions - Premiers pas](02-github-actions-premiers-pas.md)**

→ Fiche suivante : **[GitHub Actions - Build et artefacts](04-github-actions-build-artefacts.md)**
