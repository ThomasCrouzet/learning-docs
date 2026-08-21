---
tags:
  - Testing
  - Avancé
  - Projet
description: "Projet intégrateur : ajouter une suite de tests complète (unitaires, intégration, fonctionnels, E2E) à un projet Symfony + React existant."
estimated_time: "120 min"
fiche_number: 15
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.projet-integrateur"
course_id: "web.testing"
content_type: "project"
order: 15
---

# 15 - Projet intégrateur

> **En bref** : Ce projet intégrateur te fait mettre en pratique toutes les notions du cursus Testing et Qualité en ajoutant une suite de tests complète (unitaires, intégration, fonctionnels, E2E) à un projet Symfony + React existant. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- Toutes les fiches précédentes du cursus :
  - [01 - Pourquoi tester](01-pourquoi-tester.md)
  - [02 - Tests unitaires PHP](02-tests-unitaires-php.md)
  - [03 - Tests unitaires JS](03-tests-unitaires-js.md)
  - [04 - Tests d'intégration Symfony](04-tests-integration-symfony.md)
  - [05 - Tests fonctionnels Symfony](05-tests-fonctionnels-symfony.md)
  - [06 - Introduction au TDD](06-introduction-tdd.md)
  - [07 - Tests E2E avec Playwright](07-tests-e2e-playwright.md)
  - [08 - Playwright avancé](08-playwright-avance.md)
  - [09 - Couverture de code](09-couverture-code.md)
  - [10 - Tests d'API](10-tests-api.md)
  - [11 - Stratégie de test en équipe](11-strategie-test-equipe.md)
  - [12 - Test doubles avec PHPUnit](12-test-doubles-phpunit.md)
  - [13 - Réflexion pour les tests](13-reflection-tests.md)
  - [14 - Auditer la couverture d'un projet existant](14-audit-couverture-legacy.md)
- Savoir écrire des tests unitaires avec PHPUnit et Jest
- Savoir écrire des tests d'intégration et fonctionnels Symfony
- Savoir écrire des tests E2E avec Playwright
- Savoir mesurer la couverture de code
- Savoir définir une stratégie de test
- PHP 8.3, Composer, Node.js 22 LTS, npm installés

## Objectif de cette fiche

À la fin de cette fiche, tu auras ajouté une suite de tests complète à un projet Symfony + React existant : tests de fumée, tests unitaires PHP et JavaScript, tests d'intégration, tests fonctionnels d'API, tests E2E avec Playwright et rapport de couverture.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice qui combine toutes les compétences apprises dans un cursus. Au lieu de pratiquer chaque compétence isolément, tu les appliques ensemble sur un projet réaliste.

**Le problème qu'un projet intégrateur résout** :

Sans projet intégrateur, voici les problèmes rencontrés :

1. **Connaissances fragmentées** : Tu sais écrire un test unitaire et un test E2E séparément, mais tu ne sais pas comment les combiner dans un même projet.
2. **Pas de vision d'ensemble** : Tu ne sais pas quelle proportion de chaque type de test utiliser dans un vrai projet.
3. **Manque de pratique réaliste** : Les exercices isolés testent des fonctions simples. Un vrai projet a des dépendances, des configurations et des interactions complexes.

**Analogie concrète** : Les fiches précédentes t'ont appris à couper des légumes, cuire de la viande, préparer une sauce et dresser une assiette. Le projet intégrateur, c'est préparer un repas complet de A à Z : choisir le menu, gérer le timing, coordonner les cuissons et servir un plat cohérent.

---

### Qu'est-ce que le projet à tester ?

**Définition** : Le projet à tester est une application de gestion de produits composée d'un backend Symfony et d'un frontend React. Chaque couche a des composants distincts qui nécessitent des types de tests différents.

**Le problème que la compréhension du projet résout** :

Sans vue d'ensemble du projet :

1. **Tests incomplets** : tu testes le backend mais tu oublies le frontend, ou inversement. Des bugs passent entre les couches.
2. **Mauvaise répartition des efforts** : tu passes 80% du temps à tester les composants React (visuels) et 20% sur le calcul de prix (critique). Un bug de calcul de TVA arrive en production.
3. **Architecture de tests incohérente** : chaque développeur organise ses tests différemment selon la couche qu'il teste. Le projet devient difficile à maintenir.

**Analogie concrète** : Comprendre le projet avant de le tester, c'est comme un inspecteur qui étudie les plans d'un bâtiment avant de faire un contrôle. Il identifie les étages (backend, frontend), les pièces (entités, services, composants) et les installations critiques (calcul de prix, authentification). Grâce à cette vue d'ensemble, il sait exactement quoi vérifier et dans quel ordre, au lieu de parcourir le bâtiment au hasard.

**Backend Symfony** :

- Entité `Product` (id, name, price, category, createdAt)
- Entité `Category` (id, name, description)
- Service `PriceCalculator` (calcul de remises, TVA, arrondi)
- Service `ProductSearchService` (recherche par nom, filtre par catégorie, tri)
- API REST complète (`/api/products`, `/api/categories`)
- Authentification JWT (login, register)

**Frontend React** :

- Composant `ProductList` (affichage de la liste des produits)
- Composant `ProductForm` (formulaire de création/modification)
- Composant `SearchBar` (recherche et filtres)
- Service `api.js` (appels HTTP vers le backend)
- Utilitaire `formatPrice.js` (formatage des prix)

Tu vas ajouter des tests à chaque couche de ce projet.

---

### Qu'est-ce qu'un plan de test ?

**Définition** : Un plan de test est un document qui décrit les types de tests à écrire, les cibles de chaque test, le nombre de tests estimé et le temps nécessaire. Il sert de feuille de route pour organiser le travail de test.

**Le problème qu'un plan de test résout** :

Sans plan de test :

1. **Travail sans direction** : tu commences à écrire des tests sans savoir combien il en faut, pour quoi et dans quel ordre. Tu risques de passer 2 heures sur les tests de fumée et de ne plus avoir de temps pour les tests unitaires critiques.
2. **Estimation impossible** : ton responsable te demande "combien de temps pour tester le projet ?". Sans plan, tu ne peux pas donner de réponse précise.
3. **Oublis systématiques** : sans liste exhaustive des cibles de test, tu oublies de tester certaines couches (par exemple, les tests d'intégration avec la base de données).

**Analogie concrète** : Un plan de test, c'est comme la liste des courses avant de faire les courses. Tu sais exactement ce qu'il te faut (types de tests), en quelle quantité (nombre de tests), dans quels rayons aller (cibles) et combien de temps ça va prendre (estimation). Sans liste, tu achètes trois fois le même ingrédient et tu oublies le plat principal.

**Voici le plan de test que tu vas suivre, organisé par type de test** :

| Étape | Type de test | Cible | Nombre de tests | Temps estimé |
| --- | --- | --- | --- | --- |
| 1 | Fumée | Pages principales | 6-8 tests | 10 min |
| 2 | Unitaire PHP | PriceCalculator | 10-15 tests | 20 min |
| 3 | Unitaire JS | formatPrice, api.js | 8-12 tests | 15 min |
| 4 | Intégration | ProductRepository | 5-8 tests | 15 min |
| 5 | Fonctionnel API | /api/products, /api/catégories | 12-15 tests | 20 min |
| 6 | E2E | Parcours CRUD complet | 5-8 tests | 25 min |
| 7 | Couverture | Rapport global | - | 15 min |
| **Total** | | | **46-66 tests** | **120 min** |

---

## Étapes Pratiques

### Étape 1 : Créer la structure du projet de test

Crée la structure de dossiers pour les tests :

```bash
# Crée les dossiers de tests PHP
mkdir -p tests/Unit/Service
mkdir -p tests/Integration/Repository
mkdir -p tests/Functional/Api

# Crée les dossiers de tests JavaScript
mkdir -p assets/tests

# Crée les dossiers de tests E2E
mkdir -p e2e/pages
mkdir -p e2e/specs
```

Vérifie que la configuration PHPUnit est en place :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- phpunit.xml -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         failOnWarning="true">

    <testsuites>
        <testsuite name="Smoke">
            <file>tests/SmokeTest.php</file>
        </testsuite>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
        <testsuite name="Functional">
            <directory>tests/Functional</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

---

### Étape 2 : Écrire les tests de fumée

Crée `tests/SmokeTest.php` :

```php
<?php
// tests/SmokeTest.php
// Tests de fumée : vérifient que l'application ne crashe pas

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SmokeTest extends WebTestCase
{
    public static function publicUrlProvider(): array
    {
        return [
            'accueil' => ['/'],
            'produits' => ['/products'],
            'API produits' => ['/api/products'],
            'API catégories' => ['/api/categories'],
            'login' => ['/login'],
            'register' => ['/register'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('publicUrlProvider')]
    public function testPublicPageResponds(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        $statusCode = $client->getResponse()->getStatusCode();

        // Vérifie que la page ne retourne pas d'erreur serveur
        $this->assertLessThan(
            500,
            $statusCode,
            "La page $url retourne une erreur serveur ($statusCode)"
        );
    }

    public function testApiProductsReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/products');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }
}
```

Lance les tests de fumée :

```bash
./vendor/bin/phpunit --testsuite Smoke
```

**Résultat attendu** :

```text
OK (7 tests, 8 assertions)
```

---

### Étape 3 : Écrire les tests unitaires PHP

Crée le service à tester `src/Service/PriceCalculator.php` :

```php
<?php
// src/Service/PriceCalculator.php
// Service de calcul de prix avec remises et TVA

namespace App\Service;

class PriceCalculator
{
    // Taux de TVA par défaut (20%)
    private const DEFAULT_VAT_RATE = 0.20;

    // Calcule le prix TTC à partir du prix HT
    public function calculatePriceWithVat(
        float $priceHt,
        float $vatRate = self::DEFAULT_VAT_RATE
    ): float {
        if ($priceHt < 0) {
            throw new \InvalidArgumentException("Le prix ne peut pas être négatif");
        }

        if ($vatRate < 0 || $vatRate > 1) {
            throw new \InvalidArgumentException(
                "Le taux de TVA doit être entre 0 et 1"
            );
        }

        return round($priceHt * (1 + $vatRate), 2);
    }

    // Applique une remise en pourcentage
    public function applyDiscount(float $price, float $discountPercent): float
    {
        if ($discountPercent < 0 || $discountPercent > 100) {
            throw new \InvalidArgumentException(
                "La remise doit être entre 0 et 100"
            );
        }

        $discountAmount = $price * ($discountPercent / 100);

        return round($price - $discountAmount, 2);
    }

    // Calcule le prix final (remise + TVA)
    public function calculateFinalPrice(
        float $priceHt,
        float $discountPercent = 0,
        float $vatRate = self::DEFAULT_VAT_RATE
    ): float {
        // Étape 1 : appliquer la remise sur le prix HT
        $discountedPrice = $this->applyDiscount($priceHt, $discountPercent);

        // Étape 2 : appliquer la TVA sur le prix remisé
        return $this->calculatePriceWithVat($discountedPrice, $vatRate);
    }

    // Calcule le montant de la TVA
    public function calculateVatAmount(
        float $priceHt,
        float $vatRate = self::DEFAULT_VAT_RATE
    ): float {
        return round($priceHt * $vatRate, 2);
    }

    // Formate un prix en euros
    public function formatPrice(float $price): string
    {
        return number_format($price, 2, ',', ' ') . ' €';
    }
}
```

Crée les tests `tests/Unit/Service/PriceCalculatorTest.php` :

```php
<?php
// tests/Unit/Service/PriceCalculatorTest.php
// Tests unitaires du service PriceCalculator

namespace App\Tests\Unit\Service;

use PHPUnit\Framework\TestCase;
use App\Service\PriceCalculator;

class PriceCalculatorTest extends TestCase
{
    private PriceCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new PriceCalculator();
    }

    // --- Tests de calculatePriceWithVat ---

    public function testCalculatePriceWithDefaultVat(): void
    {
        // 100 € HT + 20% TVA = 120 € TTC
        $result = $this->calculator->calculatePriceWithVat(100.0);

        $this->assertEquals(120.0, $result);
    }

    public function testCalculatePriceWithCustomVat(): void
    {
        // 100 € HT + 5.5% TVA = 105.50 € TTC
        $result = $this->calculator->calculatePriceWithVat(100.0, 0.055);

        $this->assertEquals(105.50, $result);
    }

    public function testCalculatePriceWithZeroVat(): void
    {
        // 100 € HT + 0% TVA = 100 € TTC
        $result = $this->calculator->calculatePriceWithVat(100.0, 0.0);

        $this->assertEquals(100.0, $result);
    }

    public function testCalculatePriceWithNegativePriceThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("Le prix ne peut pas être négatif");

        $this->calculator->calculatePriceWithVat(-10.0);
    }

    public function testCalculatePriceWithInvalidVatThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->calculator->calculatePriceWithVat(100.0, 1.5);
    }

    // --- Tests de applyDiscount ---

    public function testApplyDiscountTenPercent(): void
    {
        // 100 € - 10% = 90 €
        $result = $this->calculator->applyDiscount(100.0, 10);

        $this->assertEquals(90.0, $result);
    }

    public function testApplyDiscountZeroPercent(): void
    {
        // 100 € - 0% = 100 €
        $result = $this->calculator->applyDiscount(100.0, 0);

        $this->assertEquals(100.0, $result);
    }

    public function testApplyDiscountHundredPercent(): void
    {
        // 100 € - 100% = 0 €
        $result = $this->calculator->applyDiscount(100.0, 100);

        $this->assertEquals(0.0, $result);
    }

    public function testApplyDiscountWithDecimal(): void
    {
        // 99.99 € - 15% = 84.99 €
        $result = $this->calculator->applyDiscount(99.99, 15);

        $this->assertEqualsWithDelta(84.99, $result, 0.01);
    }

    public function testApplyDiscountNegativeThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->calculator->applyDiscount(100.0, -5);
    }

    public function testApplyDiscountOver100ThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->calculator->applyDiscount(100.0, 150);
    }

    // --- Tests de calculateFinalPrice ---

    public function testCalculateFinalPriceWithoutDiscount(): void
    {
        // 100 € HT, 0% remise, 20% TVA = 120 € TTC
        $result = $this->calculator->calculateFinalPrice(100.0);

        $this->assertEquals(120.0, $result);
    }

    public function testCalculateFinalPriceWithDiscount(): void
    {
        // 100 € HT, 10% remise = 90 € HT, 20% TVA = 108 € TTC
        $result = $this->calculator->calculateFinalPrice(100.0, 10);

        $this->assertEquals(108.0, $result);
    }

    public function testCalculateFinalPriceWithDiscountAndCustomVat(): void
    {
        // 200 € HT, 25% remise = 150 € HT, 5.5% TVA = 158.25 € TTC
        $result = $this->calculator->calculateFinalPrice(200.0, 25, 0.055);

        $this->assertEquals(158.25, $result);
    }

    // --- Tests de calculateVatAmount ---

    public function testCalculateVatAmount(): void
    {
        // TVA sur 100 € à 20% = 20 €
        $result = $this->calculator->calculateVatAmount(100.0);

        $this->assertEquals(20.0, $result);
    }

    // --- Tests de formatPrice ---

    public function testFormatPriceInteger(): void
    {
        $result = $this->calculator->formatPrice(120.0);

        $this->assertEquals('120,00 €', $result);
    }

    public function testFormatPriceWithDecimals(): void
    {
        $result = $this->calculator->formatPrice(1234.56);

        $this->assertEquals('1 234,56 €', $result);
    }

    public function testFormatPriceZero(): void
    {
        $result = $this->calculator->formatPrice(0.0);

        $this->assertEquals('0,00 €', $result);
    }

    // --- Data provider pour les cas complets ---

    public static function finalPriceProvider(): array
    {
        return [
            'sans remise ni TVA personnalisée' => [100.0, 0, 0.20, 120.0],
            'avec remise 10%' => [100.0, 10, 0.20, 108.0],
            'avec remise 50%' => [100.0, 50, 0.20, 60.0],
            'TVA réduite 5.5%' => [100.0, 0, 0.055, 105.50],
            'remise + TVA réduite' => [200.0, 20, 0.055, 168.80],
            'prix à zéro' => [0.0, 50, 0.20, 0.0],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('finalPriceProvider')]
    public function testFinalPriceCalculation(
        float $priceHt,
        float $discount,
        float $vatRate,
        float $expected
    ): void {
        $result = $this->calculator->calculateFinalPrice(
            $priceHt,
            $discount,
            $vatRate
        );

        $this->assertEqualsWithDelta($expected, $result, 0.01);
    }
}
```

Lance les tests unitaires :

```bash
./vendor/bin/phpunit --testsuite Unit
```

**Résultat attendu** :

```text
OK (24 tests, 24 assertions)
```

---

### Étape 4 : Écrire les tests unitaires JavaScript

Crée le module à tester `assets/utils/formatPrice.js` :

```javascript
// assets/utils/formatPrice.js
// Utilitaire de formatage des prix

// Formate un prix en centimes vers un affichage en euros
// Exemple : 1999 → "19,99 €"
function formatPrice(priceInCents) {
  if (typeof priceInCents !== 'number') {
    throw new Error('Le prix doit être un nombre');
  }

  if (priceInCents < 0) {
    throw new Error('Le prix ne peut pas être négatif');
  }

  const euros = (priceInCents / 100).toFixed(2);
  return euros.replace('.', ',') + ' €';
}

// Calcule le prix avec une remise
// Retourne le prix en centimes après remise
function applyDiscount(priceInCents, discountPercent) {
  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('La remise doit être entre 0 et 100');
  }

  return Math.round(priceInCents * (1 - discountPercent / 100));
}

// Calcule le total d'un panier
// items = [{ price: number, quantity: number }, ...]
function calculateCartTotal(items) {
  if (!Array.isArray(items)) {
    throw new Error('Le panier doit être un tableau');
  }

  return items.reduce((total, item) => {
    return total + item.price * item.quantity;
  }, 0);
}

module.exports = { formatPrice, applyDiscount, calculateCartTotal };
```

Crée les tests `assets/tests/formatPrice.test.js` :

```javascript
// assets/tests/formatPrice.test.js
// Tests unitaires des utilitaires de prix

const {
  formatPrice,
  applyDiscount,
  calculateCartTotal,
} = require('../utils/formatPrice');

describe('formatPrice', () => {
  test('formats price in cents to euros', () => {
    expect(formatPrice(1999)).toBe('19,99 €');
  });

  test('formats zero price', () => {
    expect(formatPrice(0)).toBe('0,00 €');
  });

  test('formats round price', () => {
    expect(formatPrice(1000)).toBe('10,00 €');
  });

  test('formats single cent', () => {
    expect(formatPrice(1)).toBe('0,01 €');
  });

  test('throws error for non-number', () => {
    expect(() => formatPrice('abc')).toThrow('Le prix doit être un nombre');
  });

  test('throws error for negative price', () => {
    expect(() => formatPrice(-100)).toThrow(
      'Le prix ne peut pas être négatif'
    );
  });
});

describe('applyDiscount', () => {
  test('applies 10% discount', () => {
    // 1000 centimes - 10% = 900 centimes
    expect(applyDiscount(1000, 10)).toBe(900);
  });

  test('applies 0% discount', () => {
    expect(applyDiscount(1000, 0)).toBe(1000);
  });

  test('applies 100% discount', () => {
    expect(applyDiscount(1000, 100)).toBe(0);
  });

  test('rounds correctly', () => {
    // 999 centimes - 33% = 669.33 → arrondi à 669
    expect(applyDiscount(999, 33)).toBe(669);
  });

  test('throws error for negative discount', () => {
    expect(() => applyDiscount(1000, -5)).toThrow(
      'La remise doit être entre 0 et 100'
    );
  });

  test('throws error for discount over 100', () => {
    expect(() => applyDiscount(1000, 150)).toThrow(
      'La remise doit être entre 0 et 100'
    );
  });
});

describe('calculateCartTotal', () => {
  test('calculates total of one item', () => {
    const items = [{ price: 1000, quantity: 2 }];
    expect(calculateCartTotal(items)).toBe(2000);
  });

  test('calculates total of multiple items', () => {
    const items = [
      { price: 1000, quantity: 2 }, // 2000
      { price: 500, quantity: 3 }, // 1500
      { price: 250, quantity: 1 }, // 250
    ];
    expect(calculateCartTotal(items)).toBe(3750);
  });

  test('returns 0 for empty cart', () => {
    expect(calculateCartTotal([])).toBe(0);
  });

  test('throws error for non-array', () => {
    expect(() => calculateCartTotal('abc')).toThrow(
      'Le panier doit être un tableau'
    );
  });
});
```

Lance les tests JavaScript :

```bash
npx jest assets/tests/
```

**Résultat attendu** :

```text
PASS  assets/tests/formatPrice.test.js
  formatPrice
    ✓ formats price in cents to euros
    ✓ formats zero price
    ✓ formats round price
    ✓ formats single cent
    ✓ throws error for non-number
    ✓ throws error for negative price
  applyDiscount
    ✓ applies 10% discount
    ✓ applies 0% discount
    ✓ applies 100% discount
    ✓ rounds correctly
    ✓ throws error for negative discount
    ✓ throws error for discount over 100
  calculateCartTotal
    ✓ calculates total of one item
    ✓ calculates total of multiple items
    ✓ returns 0 for empty cart
    ✓ throws error for non-array

Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total
```

---

### Étape 5 : Écrire les tests d'intégration

Crée les tests d'intégration pour le repository. Ces tests vérifient que les requêtes en base de données fonctionnent correctement.

```php
<?php
// tests/Integration/Repository/ProductRepositoryTest.php
// Tests d'intégration du ProductRepository

namespace App\Tests\Integration\Repository;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductRepositoryTest extends KernelTestCase
{
    private ProductRepository $repository;
    private $entityManager;

    protected function setUp(): void
    {
        // Démarre le kernel Symfony pour accéder aux services
        self::bootKernel();

        $this->entityManager = static::getContainer()
            ->get('doctrine')
            ->getManager();

        $this->repository = $this->entityManager
            ->getRepository(Product::class);
    }

    protected function tearDown(): void
    {
        // Nettoie l'EntityManager après chaque test
        $this->entityManager->close();
        parent::tearDown();
    }

    // Méthode utilitaire pour créer un produit de test
    private function createProduct(
        string $name,
        float $price,
        ?string $category = null
    ): Product {
        $product = new Product();
        $product->setName($name);
        $product->setPrice($price);
        $product->setCategory($category);

        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    public function testFindAllReturnsArray(): void
    {
        $products = $this->repository->findAll();

        $this->assertIsArray($products);
    }

    public function testPersistAndRetrieveProduct(): void
    {
        // Crée un produit
        $product = $this->createProduct('Clavier test', 49.99, 'Informatique');
        $id = $product->getId();

        // Récupère le produit par son ID
        $found = $this->repository->find($id);

        // Vérifie que le produit récupéré correspond
        $this->assertNotNull($found);
        $this->assertEquals('Clavier test', $found->getName());
        $this->assertEquals(49.99, $found->getPrice());
        $this->assertEquals('Informatique', $found->getCategory());
    }

    public function testFindByCategory(): void
    {
        // Crée plusieurs produits
        $this->createProduct('Produit A', 10.0, 'Audio');
        $this->createProduct('Produit B', 20.0, 'Audio');
        $this->createProduct('Produit C', 30.0, 'Vidéo');

        // Cherche par catégorie
        $audioProducts = $this->repository->findBy(
            ['category' => 'Audio']
        );

        // Vérifie le résultat
        $this->assertGreaterThanOrEqual(2, count($audioProducts));

        foreach ($audioProducts as $product) {
            $this->assertEquals('Audio', $product->getCategory());
        }
    }

    public function testDeleteProduct(): void
    {
        // Crée un produit
        $product = $this->createProduct('À supprimer', 5.0);
        $id = $product->getId();

        // Supprime le produit
        $this->entityManager->remove($product);
        $this->entityManager->flush();

        // Vérifie que le produit n'existe plus
        $found = $this->repository->find($id);
        $this->assertNull($found);
    }

    public function testFindByNonExistingCategoryReturnsEmpty(): void
    {
        $products = $this->repository->findBy(
            ['category' => 'Catégorie inexistante ' . uniqid()]
        );

        $this->assertCount(0, $products);
    }
}
```

Lance les tests d'intégration :

```bash
./vendor/bin/phpunit --testsuite Integration
```

**Résultat attendu** :

```text
OK (5 tests, 8 assertions)
```

---

### Étape 6 : Écrire les tests fonctionnels d'API

Crée les tests pour l'API REST complète :

```php
<?php
// tests/Functional/Api/ProductApiTest.php
// Tests fonctionnels de l'API REST des produits

namespace App\Tests\Functional\Api;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductApiTest extends WebTestCase
{
    private $client;

    protected function setUp(): void
    {
        $this->client = static::createClient();
    }

    // --- Helper pour envoyer des requêtes JSON ---

    private function jsonRequest(
        string $method,
        string $url,
        array $data = []
    ): array {
        $this->client->request(
            $method,
            $url,
            [],
            [],
            ['CONTENT_TYPE' => 'application/json'],
            empty($data) ? null : json_encode($data)
        );

        $content = $this->client->getResponse()->getContent();

        return json_decode($content, true) ?? [];
    }

    // --- Tests de GET /api/products ---

    public function testListProducts(): void
    {
        $this->client->request('GET', '/api/products');

        $this->assertResponseStatusCodeSame(200);
        $this->assertResponseHeaderSame('content-type', 'application/json');
    }

    public function testListProductsReturnsArray(): void
    {
        $data = $this->jsonRequest('GET', '/api/products');

        $this->assertIsArray($data);
    }

    public function testListProductsStructure(): void
    {
        $data = $this->jsonRequest('GET', '/api/products');

        if (count($data) > 0) {
            $product = $data[0];
            $this->assertArrayHasKey('id', $product);
            $this->assertArrayHasKey('name', $product);
            $this->assertArrayHasKey('price', $product);
            $this->assertArrayHasKey('category', $product);
        }
    }

    // --- Tests de POST /api/products ---

    public function testCreateProduct(): void
    {
        $data = $this->jsonRequest('POST', '/api/products', [
            'name' => 'Produit de test',
            'price' => 29.99,
            'category' => 'Test',
        ]);

        $this->assertResponseStatusCodeSame(201);
        $this->assertEquals('Produit de test', $data['name']);
        $this->assertEquals(29.99, $data['price']);
        $this->assertArrayHasKey('id', $data);
    }

    public function testCreateProductWithoutNameReturns422(): void
    {
        $this->jsonRequest('POST', '/api/products', [
            'price' => 10.0,
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateProductWithoutPriceReturns422(): void
    {
        $this->jsonRequest('POST', '/api/products', [
            'name' => 'Test',
        ]);

        $this->assertResponseStatusCodeSame(422);
    }

    public function testCreateProductErrorFormat(): void
    {
        $data = $this->jsonRequest('POST', '/api/products', []);

        $this->assertResponseStatusCodeSame(422);
        $this->assertArrayHasKey('error', $data);
        $this->assertIsString($data['error']);
    }

    // --- Tests de GET /api/products/{id} ---

    public function testShowProduct(): void
    {
        // Crée un produit d'abord
        $created = $this->jsonRequest('POST', '/api/products', [
            'name' => 'Produit à afficher',
            'price' => 15.0,
        ]);

        // Récupère le produit
        $data = $this->jsonRequest('GET', '/api/products/' . $created['id']);

        $this->assertResponseStatusCodeSame(200);
        $this->assertEquals('Produit à afficher', $data['name']);
    }

    public function testShowNonExistingProductReturns404(): void
    {
        $this->client->request('GET', '/api/products/999999');

        $this->assertResponseStatusCodeSame(404);
    }

    // --- Tests de DELETE /api/products/{id} ---

    public function testDeleteProduct(): void
    {
        // Crée un produit
        $created = $this->jsonRequest('POST', '/api/products', [
            'name' => 'À supprimer',
            'price' => 1.0,
        ]);

        // Supprime le produit
        $this->client->request('DELETE', '/api/products/' . $created['id']);

        $this->assertResponseStatusCodeSame(204);
    }

    public function testDeleteNonExistingProductReturns404(): void
    {
        $this->client->request('DELETE', '/api/products/999999');

        $this->assertResponseStatusCodeSame(404);
    }

    public function testDeletedProductIsGone(): void
    {
        // Crée un produit
        $created = $this->jsonRequest('POST', '/api/products', [
            'name' => 'Temporaire',
            'price' => 1.0,
        ]);

        // Supprime le produit
        $this->client->request('DELETE', '/api/products/' . $created['id']);

        // Vérifie qu'il n'existe plus
        $this->client->request('GET', '/api/products/' . $created['id']);
        $this->assertResponseStatusCodeSame(404);
    }

    // --- Test de contrat d'API ---

    public function testProductApiContract(): void
    {
        $created = $this->jsonRequest('POST', '/api/products', [
            'name' => 'Contrat test',
            'price' => 42.0,
            'category' => 'Test',
        ]);

        // Vérifie la structure complète
        $expectedKeys = ['id', 'name', 'price', 'category'];
        foreach ($expectedKeys as $key) {
            $this->assertArrayHasKey($key, $created, "Clé manquante : $key");
        }

        // Vérifie les types
        $this->assertIsInt($created['id']);
        $this->assertIsString($created['name']);
    }
}
```

Lance les tests fonctionnels :

```bash
./vendor/bin/phpunit --testsuite Functional
```

**Résultat attendu** :

```text
OK (13 tests, 20 assertions)
```

---

### Étape 7 : Écrire les tests E2E avec Playwright

Crée le Page Object `e2e/pages/ProductListPage.js` :

```javascript
// e2e/pages/ProductListPage.js
// Page Object pour la liste des produits

class ProductListPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.productRows = page.locator('table tbody tr');
    this.addButton = page.getByRole('link', { name: 'Ajouter un produit' });
  }

  async goto() {
    await this.page.goto('/products');
  }

  async getProductCount() {
    return await this.productRows.count();
  }

  async clickAddProduct() {
    await this.addButton.click();
  }
}

module.exports = ProductListPage;
```

Crée le Page Object `e2e/pages/ProductFormPage.js` :

```javascript
// e2e/pages/ProductFormPage.js
// Page Object pour le formulaire de produit

class ProductFormPage {
  constructor(page) {
    this.page = page;
    this.nameInput = page.getByLabel('Nom');
    this.priceInput = page.getByLabel('Prix');
    this.categoryInput = page.getByLabel('Catégorie');
    this.submitButton = page.getByRole('button', { name: 'Créer' });
  }

  async goto() {
    await this.page.goto('/products/new');
  }

  async createProduct(name, price, category = '') {
    await this.nameInput.fill(name);
    await this.priceInput.fill(String(price));
    if (category) {
      await this.categoryInput.fill(category);
    }
    await this.submitButton.click();
  }
}

module.exports = ProductFormPage;
```

Crée les tests E2E `e2e/specs/products.spec.js` :

```javascript
// e2e/specs/products.spec.js
// Tests E2E du parcours CRUD des produits

const { test, expect } = require('@playwright/test');
const ProductListPage = require('../pages/ProductListPage');
const ProductFormPage = require('../pages/ProductFormPage');

test.describe('Products CRUD', () => {
  test('product list page loads', async ({ page }) => {
    const productList = new ProductListPage(page);
    await productList.goto();

    // Vérifie que le titre est affiché
    await expect(productList.heading).toBeVisible();
  });

  test('product list displays products', async ({ page }) => {
    const productList = new ProductListPage(page);
    await productList.goto();

    // Vérifie qu'il y a au moins un produit
    const count = await productList.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('create a new product', async ({ page }) => {
    const productForm = new ProductFormPage(page);
    await productForm.goto();

    // Crée un produit
    const productName = 'Produit E2E ' + Date.now();
    await productForm.createProduct(productName, 99.99, 'Test');

    // Vérifie la redirection ou la confirmation
    await expect(page.getByText(productName)).toBeVisible();
  });

  test('navigate from list to form', async ({ page }) => {
    const productList = new ProductListPage(page);
    await productList.goto();

    // Clique sur "Ajouter un produit"
    await productList.clickAddProduct();

    // Vérifie qu'on est sur le formulaire
    await expect(page).toHaveURL(/\/products\/new/);
  });

  test('form validation prevents empty submission', async ({ page }) => {
    const productForm = new ProductFormPage(page);
    await productForm.goto();

    // Soumet le formulaire vide
    await productForm.submitButton.click();

    // Le navigateur ou l'application empêche la soumission
    // On vérifie qu'on est toujours sur le formulaire
    await expect(page).toHaveURL(/\/products\/new/);
  });

  test('complete CRUD journey', async ({ page }) => {
    const productList = new ProductListPage(page);
    const productForm = new ProductFormPage(page);

    // Étape 1 : compter les produits
    await productList.goto();
    const countBefore = await productList.getProductCount();

    // Étape 2 : créer un produit
    await productList.clickAddProduct();
    const productName = 'CRUD Test ' + Date.now();
    await productForm.createProduct(productName, 49.99, 'Test');

    // Étape 3 : vérifier que le produit est dans la liste
    await productList.goto();
    const countAfter = await productList.getProductCount();
    expect(countAfter).toBe(countBefore + 1);
  });
});
```

Lance les tests E2E :

```bash
npx playwright test e2e/specs/
```

**Résultat attendu** :

```text
Running 6 tests using 3 workers

  6 passed (5.2s)
```

---

### Étape 8 : Générer le rapport de couverture global

Lance tous les tests avec le rapport de couverture :

```bash
# Tests PHP avec couverture
# XDEBUG_MODE=coverage est obligatoire : sans ce préfixe, Xdebug 3.x
# ne collecte pas la couverture et PHPUnit affiche "No code coverage driver"
XDEBUG_MODE=coverage ./vendor/bin/phpunit --coverage-text --coverage-html coverage-php

# Tests JavaScript avec couverture
npx jest --coverage --coverageDirectory=coverage-js
```

**Résultat attendu (PHP)** :

```text
OK (42 tests, 52 assertions)

Code Coverage Report:

 Summary:
  Classes: 80.00% (4/5)
  Methods: 85.71% (12/14)
  Lines:   82.35% (56/68)
```

**Résultat attendu (JavaScript)** :

```text
Test Suites: 1 passed, 1 total
Tests:       16 passed, 16 total

----------------------|---------|----------|---------|---------|
File                  | % Stmts | % Branch | % Funcs | % Lines |
----------------------|---------|----------|---------|---------|
All files             |   95.00 |    90.00 |   100   |   95.00 |
 formatPrice.js       |   95.00 |    90.00 |   100   |   95.00 |
----------------------|---------|----------|---------|---------|
```

Ouvre les rapports HTML :

```bash
# Rapport PHP
open coverage-php/index.html

# Rapport JavaScript
open coverage-js/lcov-report/index.html
```

---

### Étape 9 : Récapitulatif de la suite de tests

Voici un récapitulatif de tous les tests écrits dans ce projet :

| Suite | Fichier(s) | Nb tests | Temps |
| --- | --- | --- | --- |
| Fumée | `tests/SmokeTest.php` | 7 | < 2s |
| Unitaire PHP | `tests/Unit/Service/PriceCalculatorTest.php` | 24 | < 1s |
| Unitaire JS | `assets/tests/formatPrice.test.js` | 16 | < 2s |
| Intégration | `tests/Integration/Repository/ProductRepositoryTest.php` | 5 | < 5s |
| Fonctionnel | `tests/Functional/Api/ProductApiTest.php` | 13 | < 5s |
| E2E | `e2e/specs/products.spec.js` | 6 | < 10s |
| **Total** | | **71** | **< 25s** |

Lance toute la suite en une commande :

```bash
# Tous les tests PHP
./vendor/bin/phpunit

# Tous les tests JavaScript
npx jest

# Tous les tests E2E
npx playwright test e2e/specs/
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit` | Lancer tous les tests PHP |
| `./vendor/bin/phpunit --testsuite Smoke` | Tests de fumée uniquement |
| `./vendor/bin/phpunit --testsuite Unit` | Tests unitaires PHP uniquement |
| `./vendor/bin/phpunit --coverage-html coverage-php` | Rapport de couverture HTML (PHP) |
| `npx jest` | Lancer tous les tests JavaScript |
| `npx jest --coverage` | Tests JS avec couverture |
| `npx playwright test e2e/specs/` | Lancer les tests E2E |
| `npx playwright test --headed` | Tests E2E avec navigateur visible |
| `npx playwright show-report` | Rapport HTML des tests E2E |

---

## Pièges Fréquents

### Piège 1 : Lancer les tests E2E sans démarrer le serveur

⚠️ **Problème** : Tu lances `npx playwright test` mais le serveur Symfony n'est pas démarré. Tous les tests échouent avec "ERR_CONNECTION_REFUSED".

✅ **Solution** : Démarre le serveur avant les tests E2E, ou configure Playwright pour le faire automatiquement :

```javascript
// playwright.config.js
module.exports = defineConfig({
  webServer: {
    command: 'php -S localhost:8000 -t public/',
    url: 'http://localhost:8000',
    reuseExistingServer: true,
  },
});
```

---

### Piège 2 : Tests d'intégration qui polluent la base de données

⚠️ **Problème** : Les tests d'intégration créent des produits en base. À chaque exécution, la base grossit. Les tests finissent par devenir lents ou par échouer à cause de données parasites.

✅ **Solution** : Utilise une base de données de test séparée et réinitialise-la avant chaque suite :

```yaml
# .env.test
DATABASE_URL="postgresql://user:pass@localhost/myapp_test"
```

```bash
# Recrée la base de test avant les tests
php bin/console doctrine:database:drop --force --env=test
php bin/console doctrine:database:create --env=test
php bin/console doctrine:schema:create --env=test
```

---

### Piège 3 : Oublier de tester les cas d'erreur de l'API

⚠️ **Problème** : Tu testes que `POST /api/products` fonctionne avec des données valides. Mais tu ne testes pas les données invalides, les champs manquants ou les types incorrects.

✅ **Solution** : Pour chaque endpoint, applique la règle "1 test de succès, 3 tests d'erreur" :

- Données manquantes
- Données invalides (mauvais type, trop long, etc.)
- Ressource inexistante (404)

---

### Piège 4 : Tests E2E fragiles à cause des sélecteurs

⚠️ **Problème** : Tes tests E2E utilisent des sélecteurs CSS (`.btn-primary`, `#submit-form`) qui cassent dès qu'un développeur change une classe CSS.

✅ **Solution** : Utilise les locators Playwright basés sur le rôle et le contenu, pas sur le CSS :

```javascript
// ❌ Fragile : dépend du CSS
page.locator('.btn-primary');
page.locator('#submit-form');

// ✅ Robuste : dépend du contenu et des rôles HTML
page.getByRole('button', { name: 'Créer' });
page.getByLabel('Nom');
page.getByText('Produit ajouté');
```

---

## Checklist de Validation

- [ ] J'ai créé la structure de dossiers de tests (Unit, Integration, Functional, E2E)
- [ ] Les tests de fumée vérifient que toutes les pages principales répondent
- [ ] Les tests unitaires PHP couvrent le service PriceCalculator (10+ tests)
- [ ] Les tests unitaires JavaScript couvrent les utilitaires (10+ tests)
- [ ] Les tests d'intégration vérifient les opérations en base de données
- [ ] Les tests fonctionnels couvrent l'API REST (GET, POST, DELETE + erreurs)
- [ ] Les tests E2E vérifient le parcours CRUD dans un vrai navigateur
- [ ] La couverture PHP est supérieure à 70%
- [ ] La couverture JavaScript est supérieure à 80%
- [ ] Tous les tests passent en une seule commande

---

## Exercice Pratique

**Énoncé** : Complète la suite de tests du projet intégrateur en ajoutant les éléments suivants :

1. **Tests unitaires supplémentaires** : Ajoute un service `ProductSearchService` avec une méthode `search(string $query, ?string $category): array` et écris 8 tests unitaires (recherche par nom, par catégorie, recherche vide, aucun résultat, etc.)

2. **Tests d'API pour les catégories** : Écris 6 tests pour l'endpoint `/api/categories` (GET, POST, GET/{id}, DELETE, cas d'erreur)

3. **Test E2E de recherche** : Crée un Page Object `SearchPage` et un test E2E qui vérifie que la recherche de produits fonctionne (saisir un terme, vérifier les résultats)

4. **Rapport de couverture** : Génère le rapport de couverture global et vérifie que tu atteins 80% de couverture sur les services

**Résultat attendu** : Au moins 85 tests au total, couverture > 80% sur les services, tous les tests passent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Service/ProductSearchService.php
// Service de recherche de produits

namespace App\Service;

use App\Entity\Product;
use App\Repository\ProductRepository;

class ProductSearchService
{
    public function __construct(
        private ProductRepository $repository
    ) {
    }

    // Recherche des produits par nom et/ou catégorie
    public function search(string $query = '', ?string $category = null): array
    {
        // Si la recherche est vide et pas de catégorie, retourner tout
        if ($query === '' && $category === null) {
            return $this->repository->findAll();
        }

        // Recherche par catégorie seule
        if ($query === '' && $category !== null) {
            return $this->repository->findBy(['category' => $category]);
        }

        // Recherche par nom (et catégorie optionnelle)
        $qb = $this->repository->createQueryBuilder('p')
            ->where('LOWER(p.name) LIKE LOWER(:query)')
            ->setParameter('query', '%' . $query . '%');

        if ($category !== null) {
            $qb->andWhere('p.category = :category')
               ->setParameter('category', $category);
        }

        return $qb->getQuery()->getResult();
    }
}
```

```php
<?php
// tests/Integration/Service/ProductSearchServiceTest.php
// Tests d'intégration du ProductSearchService

namespace App\Tests\Integration\Service;

use App\Service\ProductSearchService;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductSearchServiceTest extends KernelTestCase
{
    private ProductSearchService $searchService;

    protected function setUp(): void
    {
        self::bootKernel();
        $this->searchService = static::getContainer()
            ->get(ProductSearchService::class);
    }

    public function testSearchReturnsArray(): void
    {
        $results = $this->searchService->search();
        $this->assertIsArray($results);
    }

    public function testSearchByName(): void
    {
        $results = $this->searchService->search('clavier');
        $this->assertIsArray($results);
    }

    public function testSearchByCategory(): void
    {
        $results = $this->searchService->search('', 'Informatique');
        $this->assertIsArray($results);

        foreach ($results as $product) {
            $this->assertEquals('Informatique', $product->getCategory());
        }
    }

    public function testSearchByNameAndCategory(): void
    {
        $results = $this->searchService->search('clavier', 'Informatique');
        $this->assertIsArray($results);
    }

    public function testSearchEmptyQueryReturnsAll(): void
    {
        $all = $this->searchService->search();
        $this->assertNotEmpty($all);
    }

    public function testSearchNoResultsReturnsEmpty(): void
    {
        $results = $this->searchService->search(
            'produit-inexistant-' . uniqid()
        );
        $this->assertCount(0, $results);
    }

    public function testSearchIsCaseInsensitive(): void
    {
        $lower = $this->searchService->search('clavier');
        $upper = $this->searchService->search('CLAVIER');

        // Les deux recherches doivent donner le même nombre de résultats
        $this->assertCount(count($lower), $upper);
    }

    public function testSearchNonExistingCategoryReturnsEmpty(): void
    {
        $results = $this->searchService->search(
            '',
            'Catégorie-inexistante-' . uniqid()
        );
        $this->assertCount(0, $results);
    }
}
```

```javascript
// e2e/pages/SearchPage.js
// Page Object pour la recherche de produits

class SearchPage {
  constructor(page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('Rechercher un produit');
    this.searchButton = page.getByRole('button', { name: 'Rechercher' });
    this.results = page.locator('.product-card');
    this.noResults = page.getByText('Aucun produit trouvé');
  }

  async goto() {
    await this.page.goto('/products');
  }

  async search(query) {
    await this.searchInput.fill(query);
    await this.searchButton.click();
  }

  async getResultCount() {
    return await this.results.count();
  }
}

module.exports = SearchPage;
```

```javascript
// e2e/specs/search.spec.js
// Tests E2E de la recherche de produits

const { test, expect } = require('@playwright/test');
const SearchPage = require('../pages/SearchPage');

test.describe('Product search', () => {
  test('search bar is visible', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    await expect(searchPage.searchInput).toBeVisible();
  });

  test('search returns matching products', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    await searchPage.search('clavier');

    const count = await searchPage.getResultCount();
    expect(count).toBeGreaterThan(0);
  });

  test('search with no results shows message', async ({ page }) => {
    const searchPage = new SearchPage(page);
    await searchPage.goto();

    await searchPage.search('xyznonexistent12345');

    await expect(searchPage.noResults).toBeVisible();
  });
});
```

Lance tous les tests :

```bash
# Tests PHP (fumée + unitaire + intégration + fonctionnel)
./vendor/bin/phpunit

# Tests JavaScript
npx jest

# Tests E2E
npx playwright test e2e/specs/
```

**Résultat attendu global** :

```text
PHP:  49 tests, 65 assertions - OK
JS:   16 tests - PASS
E2E:   9 tests - passed

Total : 74 tests
```

---

## Navigation

← Fiche précédente : **[Auditer la couverture d'un projet existant](14-audit-couverture-legacy.md)**

Fin du cursus Testing et Qualité.
