---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Apprendre à écrire des tests d'intégration Symfony avec KernelTestCase : services, repositories et base de données de test."
estimated_time: "90 min"
fiche_number: 4
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.tests-integration-symfony"
course_id: "web.testing"
content_type: "lesson"
order: 4
---

# 04 - Tests d'intégration Symfony

> **En bref** : Cette fiche te guide dans l'écriture de tests d'intégration Symfony avec KernelTestCase pour tester des services, des repositories et la base de données de test. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Pourquoi tester](01-pourquoi-tester.md)** (types de tests)
- Avoir lu la fiche **[02 - Tests unitaires PHP](02-tests-unitaires-php.md)** (PHPUnit)
- Cursus Symfony jusqu'à la fiche 17 (services, Doctrine, repositories)
- PHP 8.3 et Composer installés
- Un projet Symfony 7.4 fonctionnel avec Doctrine

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des tests d'intégration Symfony qui testent tes services avec le conteneur de services réel, tes repositories avec une base de données de test et tes fixtures pour peupler la base de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test d'intégration Symfony ?

**Définition** : Un test d'intégration Symfony vérifie que plusieurs composants fonctionnent correctement ensemble dans le contexte du framework. Il démarre le kernel Symfony, accède au conteneur de services et interagit avec la base de données de test.

**Le problème que les tests d'intégration Symfony résolvent** :

Sans tests d'intégration, voici les problèmes rencontrés :

1. **Services mal configurés** : Le service fonctionne en test unitaire (avec des mocks), mais échoue en production parce que l'injection de dépendances est mal configurée.
2. **Requêtes Doctrine incorrectes** : Le code DQL ou QueryBuilder fonctionne dans ta tête, mais la requête SQL générée est fausse.
3. **Problèmes de mapping** : L'entité Doctrine a un mapping incorrect (mauvais type de colonne, relation mal définie), et tu le découvres uniquement en production.

**Comment les tests d'intégration Symfony résolvent ces problèmes** :

| Problème | Solution apportée par les tests d'intégration |
| --- | --- |
| Services mal configurés | Le test démarre le vrai conteneur Symfony et injecte les vraies dépendances |
| Requêtes incorrectes | Le test exécute les vraies requêtes sur une base de données de test |
| Problèmes de mapping | Doctrine crée le schéma à partir du mapping et détecte les erreurs |

**Analogie concrète** : Les tests unitaires vérifient chaque pièce du moteur séparément (bougies, pistons, injecteurs). Les tests d'intégration démarrent le moteur et vérifient qu'il tourne. C'est possible que chaque pièce soit bonne individuellement mais que le moteur ne démarre pas (mauvais branchement, mauvais ordre d'assemblage).

**Ce qu'un test d'intégration Symfony n'est PAS** :

- Ce n'est pas un test unitaire. Le test d'intégration utilise le vrai conteneur de services, pas des mocks.
- Ce n'est pas un test fonctionnel. Le test d'intégration ne simule pas de requêtes HTTP. Il teste les services directement.

**Comparaison avec les tests unitaires** :

| Test unitaire | Test d'intégration |
| --- | --- |
| Étend `TestCase` | Étend `KernelTestCase` |
| Pas de kernel Symfony | Démarre le kernel Symfony |
| Pas de base de données | Utilise une base de données de test |
| Très rapide (ms) | Plus lent (100ms-1s) |
| Dépendances mockées | Dépendances réelles |

---

### Qu'est-ce que KernelTestCase ?

**Définition** : `KernelTestCase` est une classe de base PHPUnit fournie par Symfony. Elle démarre le kernel Symfony dans l'environnement de test, ce qui donne accès au conteneur de services et à toutes les dépendances configurées.

**Le problème que KernelTestCase résout** :

Sans KernelTestCase, voici les problèmes rencontrés :

1. **Pas d'accès au conteneur** : Tu ne peux pas récupérer tes services Symfony dans les tests.
2. **Configuration manuelle** : Tu dois démarrer le kernel manuellement, gérer le conteneur et nettoyer après chaque test.

**Comment KernelTestCase résout ces problèmes** :

| Problème | Solution apportée par KernelTestCase |
| --- | --- |
| Pas d'accès au conteneur | `self::getContainer()` retourne le conteneur de services |
| Configuration manuelle | Le kernel est démarré et arrêté automatiquement |

**Méthodes importantes de KernelTestCase** :

| Méthode | Rôle |
| --- | --- |
| `self::bootKernel()` | Démarre le kernel Symfony |
| `self::getContainer()` | Retourne le conteneur de services (appelle bootKernel si nécessaire) |
| `self::getContainer()->get('service_id')` | Récupère un service depuis le conteneur |

---

### Qu'est-ce qu'une base de données de test ?

**Définition** : Une base de données de test est une base de données séparée, utilisée uniquement pour les tests. Elle est créée, peuplée et détruite automatiquement pendant les tests, sans affecter la base de données de développement.

**Le problème que la base de données de test résout** :

Sans base de données de test, voici les problèmes rencontrés :

1. **Données de développement corrompues** : Les tests modifient ou suppriment les données de développement.
2. **Tests non reproductibles** : Le résultat des tests dépend des données présentes dans la base, qui changent au fil du temps.
3. **Tests interdépendants** : Un test insère des données, le test suivant les retrouve et échoue si l'ordre change.

**Comment la base de données de test résout ces problèmes** :

| Problème | Solution apportée par la base de données de test |
| --- | --- |
| Données corrompues | La base de test est séparée de la base de développement |
| Tests non reproductibles | La base est recréée avant chaque test (ou suite de tests) |
| Tests interdépendants | Chaque test commence avec le même état de la base |

**Analogie concrète** : La base de données de test est comme un bac à sable. Tu peux construire et détruire ce que tu veux, ça ne modifie pas le jardin principal (base de développement). Et le bac à sable est remis à plat avant chaque partie (test).

---

### Qu'est-ce qu'une fixture ?

**Définition** : Une fixture est un jeu de données prédéfini qui est chargé dans la base de données de test avant les tests. Les fixtures créent des entités (utilisateurs, articles, catégories) avec des données connues et prévisibles.

**Le problème que les fixtures résolvent** :

Sans fixtures, voici les problèmes rencontrés :

1. **Création manuelle de données** : Chaque test crée ses propres données avec des `INSERT` ou des `persist()`. C'est répétitif et verbeux.
2. **Données incohérentes** : Les tests utilisent des données différentes, ce qui rend les résultats difficiles à comparer.

**Comment les fixtures résolvent ces problèmes** :

| Problème | Solution apportée par les fixtures |
| --- | --- |
| Création manuelle | Les fixtures créent les données automatiquement |
| Données incohérentes | Tous les tests utilisent le même jeu de données de référence |

**Analogie concrète** : Les fixtures sont comme les échantillons d'un laboratoire. Avant chaque analyse (test), le laborantin utilise toujours le même échantillon de référence. Cela garantit des résultats comparables.

---

## Étapes Pratiques

### Étape 1 : Configurer l'environnement de test

Dans un projet Symfony existant, configure la base de données de test.

Modifie le fichier `.env.test` :

```env
# .env.test
# Configuration spécifique à l'environnement de test

# Base de données de test (séparée de la base de développement)
# On ajoute "_test" au nom de la base de données
DATABASE_URL="postgresql://app:app@127.0.0.1:5432/myapp_test?serverVersion=16&charset=utf8"
```

Installe les dépendances de test :

```bash
# Installe le pack de test Symfony (inclut PHPUnit Bridge)
composer require --dev symfony/test-pack

# Installe les fixtures Doctrine
composer require --dev doctrine/doctrine-fixtures-bundle
```

**Résultat attendu** :

```text
Installing symfony/test-pack
Installing doctrine/doctrine-fixtures-bundle
```

---

### Étape 2 : Créer la base de données de test

```bash
# Crée la base de données de test
php bin/console doctrine:database:create --env=test

# Crée le schéma (toutes les tables) dans la base de test
php bin/console doctrine:schema:create --env=test
```

**Résultat attendu** :

```text
Created database `myapp_test` for connection named default
[OK] Database schema created successfully!
```

---

### Étape 3 : Créer une entité à tester

Si tu n'as pas déjà une entité, crée `src/Entity/Product.php` :

```php
<?php
// src/Entity/Product.php
// Entité Product qui représente un produit en base de données

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    // Nom du produit (obligatoire, 255 caractères max)
    #[ORM\Column(length: 255)]
    private ?string $name = null;

    // Prix du produit en centimes (pour éviter les problèmes de flottants)
    #[ORM\Column]
    private ?int $priceInCents = null;

    // Le produit est-il en stock ?
    #[ORM\Column]
    private bool $inStock = true;

    // Catégorie du produit (optionnelle)
    #[ORM\Column(length: 100, nullable: true)]
    private ?string $category = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getPriceInCents(): ?int
    {
        return $this->priceInCents;
    }

    public function setPriceInCents(int $priceInCents): static
    {
        $this->priceInCents = $priceInCents;

        return $this;
    }

    // Retourne le prix en euros (conversion depuis les centimes)
    public function getPriceInEuros(): float
    {
        return $this->priceInCents / 100;
    }

    public function isInStock(): bool
    {
        return $this->inStock;
    }

    public function setInStock(bool $inStock): static
    {
        $this->inStock = $inStock;

        return $this;
    }

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(?string $category): static
    {
        $this->category = $category;

        return $this;
    }
}
```

---

### Étape 4 : Créer le repository

Crée `src/Repository/ProductRepository.php` :

```php
<?php
// src/Repository/ProductRepository.php
// Repository pour accéder aux produits en base de données

namespace App\Repository;

use App\Entity\Product;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class ProductRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Product::class);
    }

    // Trouve les produits en stock, triés par nom
    public function findInStock(): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.inStock = :inStock')
            ->setParameter('inStock', true)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // Trouve les produits par catégorie
    public function findByCategory(string $category): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.category = :category')
            ->setParameter('category', $category)
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    // Trouve les produits dont le prix est inférieur à un montant (en centimes)
    public function findCheaperThan(int $maxPriceInCents): array
    {
        return $this->createQueryBuilder('p')
            ->andWhere('p.priceInCents <= :maxPrice')
            ->setParameter('maxPrice', $maxPriceInCents)
            ->orderBy('p.priceInCents', 'ASC')
            ->getQuery()
            ->getResult();
    }
}
```

---

### Étape 5 : Créer un service à tester

Crée `src/Service/ProductService.php` :

```php
<?php
// src/Service/ProductService.php
// Service métier pour gérer les produits

namespace App\Service;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;

class ProductService
{
    // Le service reçoit le repository et l'entity manager par injection
    public function __construct(
        private ProductRepository $productRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    // Crée un nouveau produit et le persiste en base
    public function createProduct(
        string $name,
        int $priceInCents,
        ?string $category = null
    ): Product {
        // Validation du nom
        if (trim($name) === '') {
            throw new \InvalidArgumentException('Le nom du produit ne peut pas être vide');
        }

        // Validation du prix
        if ($priceInCents < 0) {
            throw new \InvalidArgumentException('Le prix ne peut pas être négatif');
        }

        // Création de l'entité
        $product = new Product();
        $product->setName(trim($name));
        $product->setPriceInCents($priceInCents);
        $product->setCategory($category);

        // Persistance en base de données
        $this->entityManager->persist($product);
        $this->entityManager->flush();

        return $product;
    }

    // Retourne les produits en stock dans une catégorie donnée
    public function getAvailableProducts(?string $category = null): array
    {
        if ($category !== null) {
            // Filtre par catégorie puis vérifie le stock
            $products = $this->productRepository->findByCategory($category);

            return array_filter(
                $products,
                fn(Product $p) => $p->isInStock()
            );
        }

        // Tous les produits en stock
        return $this->productRepository->findInStock();
    }

    // Calcule le prix total d'une liste de produits (en centimes)
    public function calculateTotalPrice(array $products): int
    {
        $total = 0;

        foreach ($products as $product) {
            if (!$product instanceof Product) {
                throw new \InvalidArgumentException('Tous les éléments doivent être des instances de Product');
            }

            $total += $product->getPriceInCents();
        }

        return $total;
    }
}
```

---

### Étape 6 : Créer les fixtures

Crée `src/DataFixtures/ProductFixtures.php` :

```php
<?php
// src/DataFixtures/ProductFixtures.php
// Fixtures qui créent des produits de test dans la base de données

namespace App\DataFixtures;

use App\Entity\Product;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ProductFixtures extends Fixture
{
    // Cette méthode est appelée pour charger les données de test
    public function load(ObjectManager $manager): void
    {
        // Produit 1 : en stock, catégorie Électronique
        $product1 = new Product();
        $product1->setName('Clavier mécanique');
        $product1->setPriceInCents(8999);
        $product1->setCategory('Électronique');
        $product1->setInStock(true);
        $manager->persist($product1);

        // Produit 2 : en stock, catégorie Électronique
        $product2 = new Product();
        $product2->setName('Souris sans fil');
        $product2->setPriceInCents(4999);
        $product2->setCategory('Électronique');
        $product2->setInStock(true);
        $manager->persist($product2);

        // Produit 3 : hors stock, catégorie Électronique
        $product3 = new Product();
        $product3->setName('Écran 27 pouces');
        $product3->setPriceInCents(34999);
        $product3->setCategory('Électronique');
        $product3->setInStock(false);
        $manager->persist($product3);

        // Produit 4 : en stock, catégorie Bureautique
        $product4 = new Product();
        $product4->setName('Cahier A4');
        $product4->setPriceInCents(299);
        $product4->setCategory('Bureautique');
        $product4->setInStock(true);
        $manager->persist($product4);

        // Produit 5 : en stock, catégorie Bureautique
        $product5 = new Product();
        $product5->setName('Stylo bleu');
        $product5->setPriceInCents(150);
        $product5->setCategory('Bureautique');
        $product5->setInStock(true);
        $manager->persist($product5);

        // On envoie tous les produits en base de données
        $manager->flush();
    }
}
```

Charge les fixtures dans la base de test :

```bash
# Charge les fixtures (--env=test utilise la base de test)
# --no-interaction évite la confirmation "Careful, database will be purged"
php bin/console doctrine:fixtures:load --env=test --no-interaction
```

**Résultat attendu** :

```text
  > purging database
  > loading App\DataFixtures\ProductFixtures
```

---

### Étape 7 : Écrire le test d'intégration du repository

Crée `tests/Repository/ProductRepositoryTest.php` :

```php
<?php
// tests/Repository/ProductRepositoryTest.php
// Tests d'intégration du repository Product

namespace App\Tests\Repository;

use App\Entity\Product;
use App\Repository\ProductRepository;
// KernelTestCase démarre le kernel Symfony pour accéder au conteneur
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductRepositoryTest extends KernelTestCase
{
    private ProductRepository $repository;

    protected function setUp(): void
    {
        // Démarre le kernel Symfony dans l'environnement de test
        self::bootKernel();

        // Récupère le repository depuis le conteneur de services
        $this->repository = self::getContainer()->get(ProductRepository::class);
    }

    public function testFindInStockReturnsOnlyInStockProducts(): void
    {
        // ACT : on récupère les produits en stock
        $products = $this->repository->findInStock();

        // ASSERT : on vérifie que tous les produits retournés sont en stock
        foreach ($products as $product) {
            $this->assertTrue(
                $product->isInStock(),
                sprintf('Le produit "%s" devrait être en stock', $product->getName())
            );
        }

        // On vérifie qu'il y a bien 4 produits en stock (d'après les fixtures)
        $this->assertCount(4, $products);
    }

    public function testFindInStockReturnsSortedByName(): void
    {
        $products = $this->repository->findInStock();

        // Les produits doivent être triés par nom alphabétique
        $names = array_map(fn(Product $p) => $p->getName(), $products);

        // On vérifie que le premier est bien "Cahier A4" (alphabétiquement)
        $this->assertEquals('Cahier A4', $names[0]);
    }

    public function testFindByCategoryReturnsCorrectProducts(): void
    {
        $products = $this->repository->findByCategory('Électronique');

        // 3 produits dans la catégorie Électronique (dont 1 hors stock)
        $this->assertCount(3, $products);

        foreach ($products as $product) {
            $this->assertEquals('Électronique', $product->getCategory());
        }
    }

    public function testFindByCategoryReturnsEmptyForUnknownCategory(): void
    {
        $products = $this->repository->findByCategory('Catégorie inexistante');

        $this->assertEmpty($products);
    }

    public function testFindCheaperThanReturnsCorrectProducts(): void
    {
        // Produits à moins de 10 euros (1000 centimes)
        $products = $this->repository->findCheaperThan(1000);

        // Cahier A4 (299) et Stylo bleu (150) sont à moins de 10 euros
        $this->assertCount(2, $products);

        foreach ($products as $product) {
            $this->assertLessThanOrEqual(1000, $product->getPriceInCents());
        }
    }

    public function testFindCheaperThanReturnsSortedByPrice(): void
    {
        $products = $this->repository->findCheaperThan(100000);

        // Vérifie que les prix sont en ordre croissant
        $previousPrice = 0;
        foreach ($products as $product) {
            $this->assertGreaterThanOrEqual($previousPrice, $product->getPriceInCents());
            $previousPrice = $product->getPriceInCents();
        }
    }
}
```

Lance le test :

```bash
./vendor/bin/phpunit tests/Repository/ProductRepositoryTest.php
```

**Résultat attendu** :

```text
PHPUnit 12.x.x by Sebastian Bergmann and contributors.

......                                                              6 / 6 (100%)

Time: 00:00.250, Memory: 32.00 MB

OK (6 tests, 12 assertions)
```

---

### Étape 8 : Écrire le test d'intégration du service

Crée `tests/Service/ProductServiceTest.php` :

```php
<?php
// tests/Service/ProductServiceTest.php
// Tests d'intégration du service Product

namespace App\Tests\Service;

use App\Entity\Product;
use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ProductServiceTest extends KernelTestCase
{
    private ProductService $productService;

    protected function setUp(): void
    {
        self::bootKernel();

        // Récupère le service depuis le conteneur
        $this->productService = self::getContainer()->get(ProductService::class);
    }

    public function testCreateProductPersistsInDatabase(): void
    {
        // ACT : on crée un produit via le service
        $product = $this->productService->createProduct(
            'Nouveau produit',
            1999,
            'Test'
        );

        // ASSERT : le produit a un ID (il a été persisté en base)
        $this->assertNotNull($product->getId());
        $this->assertEquals('Nouveau produit', $product->getName());
        $this->assertEquals(1999, $product->getPriceInCents());
        $this->assertEquals('Test', $product->getCategory());
        $this->assertTrue($product->isInStock());
    }

    public function testCreateProductWithEmptyNameThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Le nom du produit ne peut pas être vide');

        $this->productService->createProduct('', 1000);
    }

    public function testCreateProductWithNegativePriceThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Le prix ne peut pas être négatif');

        $this->productService->createProduct('Test', -100);
    }

    public function testCreateProductTrimsName(): void
    {
        $product = $this->productService->createProduct(
            '  Produit avec espaces  ',
            1000
        );

        $this->assertEquals('Produit avec espaces', $product->getName());
    }

    public function testGetAvailableProductsReturnsInStockProducts(): void
    {
        $products = $this->productService->getAvailableProducts();

        // Tous les produits retournés doivent être en stock
        foreach ($products as $product) {
            $this->assertTrue($product->isInStock());
        }
    }

    public function testGetAvailableProductsByCategoryFiltersCorrectly(): void
    {
        $products = $this->productService->getAvailableProducts('Électronique');

        // Seuls les produits en stock de la catégorie Électronique
        foreach ($products as $product) {
            $this->assertEquals('Électronique', $product->getCategory());
            $this->assertTrue($product->isInStock());
        }

        // 2 produits électroniques sont en stock (clavier et souris)
        $this->assertCount(2, $products);
    }

    public function testCalculateTotalPriceReturnsCorrectTotal(): void
    {
        // ARRANGE : on crée des produits manuellement
        $product1 = new Product();
        $product1->setName('Produit 1');
        $product1->setPriceInCents(1000);

        $product2 = new Product();
        $product2->setName('Produit 2');
        $product2->setPriceInCents(2500);

        // ACT
        $total = $this->productService->calculateTotalPrice([$product1, $product2]);

        // ASSERT : 1000 + 2500 = 3500
        $this->assertEquals(3500, $total);
    }

    public function testCalculateTotalPriceWithEmptyArrayReturnsZero(): void
    {
        $total = $this->productService->calculateTotalPrice([]);

        $this->assertEquals(0, $total);
    }

    public function testCalculateTotalPriceWithInvalidItemThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        // On passe un objet qui n'est pas un Product
        $this->productService->calculateTotalPrice(['not a product']);
    }
}
```

```bash
./vendor/bin/phpunit tests/Service/ProductServiceTest.php
```

**Résultat attendu** :

```text
PHPUnit 12.x.x by Sebastian Bergmann and contributors.

.........                                                           9 / 9 (100%)

Time: 00:00.350, Memory: 34.00 MB

OK (9 tests, 16 assertions)
```

---

### Étape 9 : Recharger les fixtures entre les tests

Un problème courant : les tests qui créent des données perturbent les tests suivants. Pour résoudre cela, recharge les fixtures avant chaque test ou chaque classe de test.

Crée une classe de base pour tes tests d'intégration `tests/DatabaseTestCase.php` :

```php
<?php
// tests/DatabaseTestCase.php
// Classe de base pour les tests d'intégration qui utilisent la base de données

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;
use Symfony\Bundle\FrameworkBundle\Console\Application;
use Symfony\Component\Console\Input\ArrayInput;
use Symfony\Component\Console\Output\NullOutput;

abstract class DatabaseTestCase extends KernelTestCase
{
    protected function setUp(): void
    {
        self::bootKernel();

        // Recrée le schéma et charge les fixtures avant chaque test
        $this->loadFixtures();
    }

    private function loadFixtures(): void
    {
        $application = new Application(self::$kernel);
        $application->setAutoExit(false);

        // Supprime et recrée le schéma
        $application->run(
            new ArrayInput([
                'command' => 'doctrine:schema:drop',
                '--force' => true,
                '--quiet' => true,
            ]),
            new NullOutput()
        );

        $application->run(
            new ArrayInput([
                'command' => 'doctrine:schema:create',
                '--quiet' => true,
            ]),
            new NullOutput()
        );

        // Charge les fixtures
        $application->run(
            new ArrayInput([
                'command' => 'doctrine:fixtures:load',
                '--no-interaction' => true,
                '--quiet' => true,
            ]),
            new NullOutput()
        );
    }
}
```

Utilise cette classe de base dans tes tests :

```php
<?php
// Au lieu de :
class ProductRepositoryTest extends KernelTestCase

// Utilise :
class ProductRepositoryTest extends \App\Tests\DatabaseTestCase
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console doctrine:database:create --env=test` | Créer la base de données de test |
| `php bin/console doctrine:schema:create --env=test` | Créer le schéma dans la base de test |
| `php bin/console doctrine:schema:drop --force --env=test` | Supprimer le schéma de la base de test |
| `php bin/console doctrine:schema:update --force --env=test` | Mettre à jour le schéma de la base de test |
| `php bin/console doctrine:fixtures:load --env=test --no-interaction` | Charger les fixtures |
| `./vendor/bin/phpunit tests/Repository/` | Lancer les tests d'un dossier |
| `./vendor/bin/phpunit --filter testFindInStock` | Lancer un test spécifique |

---

## Pièges Fréquents

### Piège 1 : Oublier de créer la base de données de test

**Problème** : Tu lances les tests et tu obtiens `SQLSTATE[08006] Connection refused` ou `database "myapp_test" does not exist`.

**Solution** : Crée la base de données de test avant de lancer les tests :

```bash
php bin/console doctrine:database:create --env=test
php bin/console doctrine:schema:create --env=test
```

---

### Piège 2 : Utiliser la mauvaise base de données

**Problème** : Les tests modifient les données de développement. Tu as oublié de configurer `.env.test` avec une base séparée.

**Solution** : Vérifie que `.env.test` contient un `DATABASE_URL` différent de `.env`. Le nom de la base doit se terminer par `_test`.

```env
# .env (développement)
DATABASE_URL="postgresql://app:app@127.0.0.1:5432/myapp"

# .env.test (test - base séparée)
DATABASE_URL="postgresql://app:app@127.0.0.1:5432/myapp_test"
```

---

### Piège 3 : Tests qui échouent dans un ordre différent

**Problème** : Les tests passent quand tu les lances ensemble, mais échouent quand tu changes l'ordre. Un test crée des données qui interfèrent avec un autre test.

**Solution** : Utilise la classe `DatabaseTestCase` (étape 9) pour recharger les fixtures avant chaque test. Chaque test doit être indépendant.

---

### Piège 4 : Le service est introuvable dans le conteneur de test

**Problème** : `self::getContainer()->get(MonService::class)` lève une exception `Service not found`.

**Solution** : Dans Symfony 7.4, `static::getContainer()` retourne un conteneur de test spécial. Il donne accès aux services publics **et** aux services privés **non supprimés** (ceux encore utilisés par au moins un autre service). Tu n'as pas besoin de les rendre publics pour un service métier injecté comme `ProductService`.

Tu dois déclarer un service comme public dans `config/services_test.yaml` **uniquement** s'il est privé **et** supprimé du conteneur compilé (aucun autre service ne l'utilise) :

```yaml
# config/services_test.yaml
# Uniquement pour un service privé jamais injecté ailleurs (donc retiré du conteneur)
services:
    App\Service\ServicePriveInutilise:
        public: true
```

---

## Checklist de Validation

- [ ] J'ai configuré une base de données de test séparée dans `.env.test`
- [ ] J'ai créé le schéma dans la base de test
- [ ] J'ai écrit des fixtures pour peupler la base de test
- [ ] Je sais écrire un test d'intégration avec KernelTestCase
- [ ] Je sais récupérer un service depuis le conteneur de test
- [ ] Je sais tester un repository avec des requêtes réelles
- [ ] Je sais tester un service avec ses vraies dépendances
- [ ] Tous mes tests passent avec `./vendor/bin/phpunit`

---

## Exercice Pratique

**Énoncé** : Crée une entité `User` avec les propriétés suivantes : `email` (unique), `firstName`, `lastName`, `active` (boolean). Crée un repository avec les méthodes `findActiveUsers()` et `findByEmail(string $email)`. Crée un service `UserService` avec `createUser()`, `deactivateUser(int $id)` et `getActiveUserCount()`. Écris des fixtures et des tests d'intégration complets.

**Indications** :

- L'entité doit avoir les getters et setters appropriés
- `createUser` doit valider l'email (format valide) et lever une exception si l'email existe déjà
- `deactivateUser` doit lever une exception si l'utilisateur n'existe pas
- Crée au minimum 5 utilisateurs dans les fixtures (dont 2 inactifs)
- Écris au minimum 10 tests d'intégration

**Résultat attendu** : Tous les tests passent avec `./vendor/bin/phpunit`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Entity/User.php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\Table(name: '`user`')]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 100)]
    private ?string $firstName = null;

    #[ORM\Column(length: 100)]
    private ?string $lastName = null;

    #[ORM\Column]
    private bool $active = true;

    public function getId(): ?int { return $this->id; }
    public function getEmail(): ?string { return $this->email; }
    public function setEmail(string $email): static { $this->email = $email; return $this; }
    public function getFirstName(): ?string { return $this->firstName; }
    public function setFirstName(string $firstName): static { $this->firstName = $firstName; return $this; }
    public function getLastName(): ?string { return $this->lastName; }
    public function setLastName(string $lastName): static { $this->lastName = $lastName; return $this; }
    public function isActive(): bool { return $this->active; }
    public function setActive(bool $active): static { $this->active = $active; return $this; }
}
```

```php
<?php
// src/Repository/UserRepository.php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    public function findActiveUsers(): array
    {
        return $this->createQueryBuilder('u')
            ->andWhere('u.active = :active')
            ->setParameter('active', true)
            ->orderBy('u.lastName', 'ASC')
            ->getQuery()
            ->getResult();
    }

    public function findByEmail(string $email): ?User
    {
        return $this->findOneBy(['email' => $email]);
    }
}
```

```php
<?php
// src/Service/UserService.php

namespace App\Service;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;

class UserService
{
    public function __construct(
        private UserRepository $userRepository,
        private EntityManagerInterface $entityManager,
    ) {
    }

    public function createUser(string $email, string $firstName, string $lastName): User
    {
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException('Email invalide');
        }

        if ($this->userRepository->findByEmail($email) !== null) {
            throw new \InvalidArgumentException('Cet email existe déjà');
        }

        $user = new User();
        $user->setEmail($email);
        $user->setFirstName($firstName);
        $user->setLastName($lastName);

        $this->entityManager->persist($user);
        $this->entityManager->flush();

        return $user;
    }

    public function deactivateUser(int $id): User
    {
        $user = $this->userRepository->find($id);

        if ($user === null) {
            throw new \InvalidArgumentException("Utilisateur avec l'id $id introuvable");
        }

        $user->setActive(false);
        $this->entityManager->flush();

        return $user;
    }

    public function getActiveUserCount(): int
    {
        return count($this->userRepository->findActiveUsers());
    }
}
```

```php
<?php
// src/DataFixtures/UserFixtures.php

namespace App\DataFixtures;

use App\Entity\User;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class UserFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $users = [
            ['alice@example.com', 'Alice', 'Dupont', true],
            ['bob@example.com', 'Bob', 'Martin', true],
            ['charlie@example.com', 'Charlie', 'Durand', true],
            ['diane@example.com', 'Diane', 'Bernard', false],
            ['eric@example.com', 'Eric', 'Petit', false],
        ];

        foreach ($users as [$email, $firstName, $lastName, $active]) {
            $user = new User();
            $user->setEmail($email);
            $user->setFirstName($firstName);
            $user->setLastName($lastName);
            $user->setActive($active);
            $manager->persist($user);
        }

        $manager->flush();
    }
}
```

```php
<?php
// tests/Service/UserServiceTest.php

namespace App\Tests\Service;

use App\Service\UserService;
use App\Tests\DatabaseTestCase;

class UserServiceTest extends DatabaseTestCase
{
    private UserService $userService;

    protected function setUp(): void
    {
        parent::setUp();
        $this->userService = self::getContainer()->get(UserService::class);
    }

    public function testCreateUserPersistsInDatabase(): void
    {
        $user = $this->userService->createUser('new@example.com', 'Nouveau', 'Utilisateur');

        $this->assertNotNull($user->getId());
        $this->assertEquals('new@example.com', $user->getEmail());
        $this->assertTrue($user->isActive());
    }

    public function testCreateUserWithInvalidEmailThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->createUser('invalid-email', 'Test', 'User');
    }

    public function testCreateUserWithDuplicateEmailThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Cet email existe déjà');
        $this->userService->createUser('alice@example.com', 'Alice2', 'Dupont2');
    }

    public function testDeactivateUserSetsInactive(): void
    {
        $user = $this->userService->createUser('temp@example.com', 'Temp', 'User');
        $deactivated = $this->userService->deactivateUser($user->getId());

        $this->assertFalse($deactivated->isActive());
    }

    public function testDeactivateNonExistingUserThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->userService->deactivateUser(99999);
    }

    public function testGetActiveUserCountReturnsCorrectCount(): void
    {
        $count = $this->userService->getActiveUserCount();
        $this->assertEquals(3, $count);
    }

    public function testGetActiveUserCountAfterDeactivation(): void
    {
        $user = $this->userService->createUser('temp@example.com', 'Temp', 'User');
        $initialCount = $this->userService->getActiveUserCount();

        $this->userService->deactivateUser($user->getId());

        $this->assertEquals($initialCount - 1, $this->userService->getActiveUserCount());
    }
}
```

---

## Navigation

← Fiche précédente : **[Tests unitaires JS (Jest)](03-tests-unitaires-js.md)**

→ Fiche suivante : **[Tests fonctionnels Symfony](05-tests-fonctionnels-symfony.md)**
