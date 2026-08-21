---
tags:
  - Architecture
  - Avancé
  - Projet
description: "Projet intégrateur : refactorer un projet Symfony en appliquant SOLID, Clean Architecture et design patterns."
estimated_time: "120 min"
fiche_number: 17
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.projet-integrateur"
course_id: "web.architecture"
content_type: "project"
order: 17
---

# 17 - Projet intégrateur

> **En bref** : Mettre en pratique tous les concepts du cursus en refactorant un projet Symfony existant : appliquer SOLID, Clean Architecture, design patterns et éliminer les anti-patterns. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- Toutes les fiches du cursus Architecture et Design Patterns (fiches 1 à 16)
- [Cursus PHP](../02-php/index.md), fiches 7 à 14 (programmation orientée objet)
- [Cursus Symfony](../03-symfony/index.md), au moins jusqu'aux services (fiche 13)

## Objectif de cette fiche

À la fin de cette fiche, tu auras refactoré un projet Symfony en appliquant les principes SOLID, la Clean Architecture et les design patterns. Tu sauras identifier les anti-patterns dans du code existant et les corriger méthodiquement.

---

## Concepts

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice qui combine tous les concepts appris dans un cursus. L'objectif n'est pas d'apprendre de nouveaux concepts, mais de les appliquer ensemble sur un cas concret.

**Le problème que le projet intégrateur résout** :

Sans projet intégrateur, voici les problèmes rencontrés :

1. **Connaissances fragmentées** : tu connais chaque pattern individuellement, mais tu ne sais pas les combiner.
2. **Pas de réflexe d'analyse** : tu ne sais pas par où commencer face à du code existant à améliorer.
3. **Manque de confiance** : tu hésites à appliquer les patterns dans un vrai projet.

**Comment le projet intégrateur résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Connaissances fragmentées | Tu combines SOLID, patterns et architecture sur un même projet |
| Pas de réflexe d'analyse | Tu suis une méthode structurée d'audit et de refactoring |
| Manque de confiance | Tu pratiques sur un cas réaliste, étape par étape |

**Analogie concrète** : Pendant le cursus, tu as appris à utiliser chaque outil individuellement : marteau, scie, perceuse, vis. Le projet intégrateur, c'est construire un meuble complet en utilisant tous ces outils ensemble. Tu dois choisir le bon outil pour chaque étape et les enchaîner dans le bon ordre.

---

### La méthode de refactoring en 4 phases

**Définition** : Le refactoring suit une méthode structurée en 4 phases pour éviter de casser le code existant tout en l'améliorant progressivement.

**Le problème que cette méthode résout** :

Sans méthode structurée de refactoring, voici les problèmes rencontrés :

1. **Refactoring chaotique** : on modifie le code sans plan, on casse des fonctionnalités existantes et on perd du temps à corriger les régressions.
2. **Paralysie face au code** : face à du code mal structuré, on ne sait pas par où commencer et on finit par ne rien faire.
3. **Pas de validation** : on refactore sans vérifier que le comportement est inchangé, ce qui introduit des bugs silencieux.

**Analogie concrète** : Pense à la rénovation d'une maison habitée. Tu ne peux pas tout casser d'un coup : les habitants doivent continuer à vivre dedans. Tu commences par inspecter la maison (audit), tu planifies les travaux pièce par pièce (planification), tu rénoves une pièce à la fois en gardant le reste fonctionnel (refactoring), puis tu vérifies que tout est en ordre après chaque étape (validation).

**Phase 1 : Audit** - Analyser le code existant et identifier les problèmes.

**Phase 2 : Planification** - Décider quoi refactorer et dans quel ordre.

**Phase 3 : Refactoring** - Modifier le code par petites étapes testées.

**Phase 4 : Validation** - Vérifier que le comportement est inchangé et que le code est meilleur.

**Règle fondamentale** : Le refactoring ne change JAMAIS le comportement externe du code. Après chaque étape de refactoring, l'application doit fonctionner exactement comme avant.

---

## Le projet à refactorer

### Description

Tu vas refactorer une application Symfony de gestion de librairie en ligne. Le code initial est fonctionnel mais contient de nombreux anti-patterns. Ton objectif est d'améliorer sa structure sans changer son comportement.

### Code initial : le contrôleur monolithique

Voici le contrôleur tel qu'il existe dans le projet. Il fonctionne, mais il concentre toute la logique :

```php
<?php

namespace App\Controller;

use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// ❌ Ce contrôleur contient TOUTE la logique de l'application
// C'est une God class : gestion des livres, commandes, recherche,
// calculs de prix, envoi d'emails, tout est ici
class BookController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    // ❌ Méthode de 80+ lignes avec logique métier dans le contrôleur
    #[Route('/api/books/{id}/order', methods: ['POST'])]
    public function order(int $id, Request $request): JsonResponse
    {
        $book = $this->em->getRepository(Book::class)->find($id);

        if (!$book) {
            return new JsonResponse(['error' => 'Livre non trouvé'], 404);
        }

        $data = json_decode($request->getContent(), true);
        $quantity = $data['quantity'] ?? 1;

        // ❌ Magic number : 0 et 100 sans explication
        if ($quantity <= 0 || $quantity > 100) {
            return new JsonResponse(['error' => 'Quantité invalide'], 400);
        }

        // ❌ Logique métier dans le contrôleur
        $stock = $book->getStock();

        if ($stock < $quantity) {
            return new JsonResponse(['error' => 'Stock insuffisant'], 400);
        }

        // ❌ Calcul de prix complexe dans le contrôleur
        $price = $book->getPrice() * $quantity;

        // ❌ Magic numbers : 10, 0.95, 50, 0.90, 100, 0.85
        if ($quantity >= 10) {
            $price = $price * 0.95; // 5% de remise
        }

        if ($quantity >= 50) {
            $price = $price * 0.90; // 10% supplémentaire
        }

        // ❌ Magic number : 100
        if ($price > 100) {
            $shippingCost = 0;
        } else {
            // ❌ Magic number : 4.99
            $shippingCost = 4.99;
        }

        $total = $price + $shippingCost;

        // ❌ Magic number : 0.20
        $tax = $total * 0.20;
        $totalWithTax = $total + $tax;

        // ❌ Mise à jour directe du stock dans le contrôleur
        $book->setStock($stock - $quantity);
        $this->em->flush();

        // ❌ Construction manuelle de la reponse, pas de DTO
        return new JsonResponse([
            'bookTitle' => $book->getTitle(),
            'quantity' => $quantity,
            'unitPrice' => $book->getPrice(),
            'subtotal' => round($price, 2),
            'shipping' => $shippingCost,
            'tax' => round($tax, 2),
            'total' => round($totalWithTax, 2),
        ]);
    }

    // ❌ Recherche avec logique complexe dans le contrôleur
    #[Route('/api/books/search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        $query = $request->query->get('q', '');
        $category = $request->query->get('category');
        $minPrice = $request->query->get('min_price');
        $maxPrice = $request->query->get('max_price');
        $sort = $request->query->get('sort', 'title');

        // ❌ Construction de requête DQL dans le contrôleur
        $qb = $this->em->createQueryBuilder()
            ->select('b')
            ->from(Book::class, 'b');

        if ($query) {
            $qb->andWhere('b.title LIKE :query OR b.author LIKE :query')
                ->setParameter('query', "%$query%");
        }

        if ($category) {
            $qb->andWhere('b.category = :category')
                ->setParameter('category', $category);
        }

        if ($minPrice) {
            $qb->andWhere('b.price >= :minPrice')
                ->setParameter('minPrice', (float) $minPrice);
        }

        if ($maxPrice) {
            $qb->andWhere('b.price <= :maxPrice')
                ->setParameter('maxPrice', (float) $maxPrice);
        }

        // ❌ Magic strings : 'title', 'price', 'author'
        $sortField = match ($sort) {
            'price' => 'b.price',
            'author' => 'b.author',
            default => 'b.title',
        };

        $qb->orderBy($sortField, 'ASC');

        $books = $qb->getQuery()->getResult();

        // ❌ Formatage manuel dans le contrôleur
        $results = [];
        foreach ($books as $book) {
            $results[] = [
                'id' => $book->getId(),
                'title' => $book->getTitle(),
                'author' => $book->getAuthor(),
                'price' => $book->getPrice(),
                'stock' => $book->getStock(),
                'category' => $book->getCategory(),
                // ❌ Logique de formatage dans le contrôleur
                'available' => $book->getStock() > 0,
                'priceFormatted' => number_format($book->getPrice(), 2, ',', ' ') . ' EUR',
            ];
        }

        return new JsonResponse($results);
    }

    // ❌ Méthode pour les statistiques dans le même contrôleur
    #[Route('/api/books/stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        $books = $this->em->getRepository(Book::class)->findAll();

        $totalBooks = count($books);
        $totalValue = 0;
        $outOfStock = 0;
        $categories = [];

        foreach ($books as $book) {
            $totalValue += $book->getPrice() * $book->getStock();

            if ($book->getStock() === 0) {
                $outOfStock++;
            }

            $cat = $book->getCategory();
            if (!isset($categories[$cat])) {
                $categories[$cat] = 0;
            }
            $categories[$cat]++;
        }

        return new JsonResponse([
            'totalBooks' => $totalBooks,
            'totalValue' => round($totalValue, 2),
            'outOfStock' => $outOfStock,
            'categories' => $categories,
            'averagePrice' => $totalBooks > 0
                ? round($totalValue / $totalBooks, 2)
                : 0,
        ]);
    }
}
```

---

## Étapes Pratiques

### Phase 1 : Audit du code existant

Avant de toucher au code, analyse-le et documente les problèmes.

**Étape 1 : Identifier les anti-patterns**

Lis le contrôleur et remplis ce tableau :

```text
| # | Anti-pattern        | Localisation                    | Impact     |
| - | ------------------- | ------------------------------- | ---------- |
| 1 | God class           | BookController (3 responsabilités) | Élevé   |
| 2 | Magic numbers       | order() : 0.95, 0.90, 100, 4.99 | Moyen    |
| 3 | Logique métier      | order() : calcul de prix         | Élevé   |
|   | dans le contrôleur  |                                   |          |
| 4 | Requête DQL dans    | search() : QueryBuilder         | Moyen    |
|   | le contrôleur       |                                   |          |
| 5 | Pas de DTO          | Reponses JSON construites       | Moyen    |
|   |                     | manuellement                     |          |
| 6 | Pas de validation   | order() : validation minimale   | Élevé   |
|   | structurée          |                                   |          |
```

**Étape 2 : Identifier les principes SOLID violés**

```text
| Principe | Violation                                              |
| -------- | ------------------------------------------------------ |
| SRP      | Le contrôleur gère commandes, recherche ET statistiques |
| OCP      | Ajouter un nouveau type de remise oblige a modifier     |
|          | la methode order()                                      |
| DIP      | Le contrôleur dépend directement de Doctrine             |
|          | (EntityManager), pas d'une interface                    |
```

**Résultat attendu** :

```text
Tu as un document clair qui liste :
- 6 anti-patterns identifiés
- 3 violations SOLID
- Les méthodes concernées
- L'impact de chaque problème (élevé/moyen/faible)
```

---

### Phase 2 : Planification du refactoring

**Étape 3 : Définir l'ordre du refactoring**

Refactore du plus impactant au moins impactant :

```text
Ordre de refactoring :

1. Extraire les constantes (magic numbers) → Rapide, sans risque
2. Créer les value objects (Montant) → Fondation pour la suite
3. Extraire le calcul de prix dans un service (Strategy) → Logique métier
4. Extraire la recherche dans un repository → Séparation des couches
5. Créer les DTO de réponse → Structure de sortie
6. Découper le contrôleur → God class éliminée
7. Ajouter les interfaces (ports) → Clean Architecture
```

**Résultat attendu** :

```text
Un plan en 7 étapes, du plus simple au plus complexe.
Chaque étape est indépendante : si tu t'arrêtes à l'étape 3,
le code est déjà meilleur qu'avant.
```

---

### Phase 3 : Refactoring étape par étape

**Étape 4 : Extraire les constantes**

```php
<?php

namespace App\Domain;

// Toutes les constantes métier en un seul endroit
class OrderRules
{
    // Quantites
    public const MIN_QUANTITY = 1;
    public const MAX_QUANTITY = 100;

    // Remises par volume
    public const VOLUME_DISCOUNT_TIER_1_THRESHOLD = 10;
    public const VOLUME_DISCOUNT_TIER_1_RATE = 0.05; // 5%

    public const VOLUME_DISCOUNT_TIER_2_THRESHOLD = 50;
    public const VOLUME_DISCOUNT_TIER_2_RATE = 0.10; // 10%

    // Livraison
    public const FREE_SHIPPING_THRESHOLD = 100.00;
    public const STANDARD_SHIPPING_COST = 4.99;

    // Taxes
    public const VAT_RATE = 0.20; // 20%
}
```

**Résultat attendu** :

```text
src/Domain/OrderRules.php créé avec toutes les constantes.
Les magic numbers dans le contrôleur sont remplacés par des références
aux constantes. Le comportement est strictement identique.
```

---

**Étape 5 : Créer le service de calcul de prix (pattern Strategy)**

```php
<?php

namespace App\Domain\Service;

use App\Domain\OrderRules;

// Interface Strategy : différentes stratégies de calcul de prix
interface PricingStrategyInterface
{
    public function calculateDiscount(float $subtotal, int $quantity): float;
    public function getName(): string;
}

// Stratégie 1 : remise par volume
class VolumeDiscountStrategy implements PricingStrategyInterface
{
    public function calculateDiscount(float $subtotal, int $quantity): float
    {
        // Même enchaînement que le contrôleur initial : les deux if
        // s'appliquent (pas un elseif). Quantité >= 50 : 5 % puis 10 %
        // supplémentaire, soit un facteur 0.95 * 0.90.
        $price = $subtotal;

        if ($quantity >= OrderRules::VOLUME_DISCOUNT_TIER_1_THRESHOLD) {
            $price *= (1 - OrderRules::VOLUME_DISCOUNT_TIER_1_RATE);
        }

        if ($quantity >= OrderRules::VOLUME_DISCOUNT_TIER_2_THRESHOLD) {
            $price *= (1 - OrderRules::VOLUME_DISCOUNT_TIER_2_RATE);
        }

        return $subtotal - $price;
    }

    public function getName(): string
    {
        return 'Remise volume';
    }
}

// Stratégie 2 : pas de remise (prix standard)
class StandardPricingStrategy implements PricingStrategyInterface
{
    public function calculateDiscount(float $subtotal, int $quantity): float
    {
        return 0.0;
    }

    public function getName(): string
    {
        return 'Prix standard';
    }
}
```

```php
<?php

namespace App\Domain\Service;

use App\Domain\OrderRules;

// Service de calcul de prix : orchestre les stratégies
class PriceCalculator
{
    public function __construct(
        private PricingStrategyInterface $pricingStrategy,
    ) {
    }

    public function calculate(float $unitPrice, int $quantity): OrderPriceResult
    {
        // Sous-total avant remise
        $subtotal = $unitPrice * $quantity;

        // Appliquer la stratégie de remise
        $discount = $this->pricingStrategy->calculateDiscount($subtotal, $quantity);
        $priceAfterDiscount = $subtotal - $discount;

        // Frais de livraison
        $shipping = $priceAfterDiscount > OrderRules::FREE_SHIPPING_THRESHOLD
            ? 0.0
            : OrderRules::STANDARD_SHIPPING_COST;

        // Taxes
        $totalBeforeTax = $priceAfterDiscount + $shipping;
        $tax = $totalBeforeTax * OrderRules::VAT_RATE;
        $totalWithTax = $totalBeforeTax + $tax;

        return new OrderPriceResult(
            subtotal: round($priceAfterDiscount, 2),
            shipping: $shipping,
            tax: round($tax, 2),
            total: round($totalWithTax, 2),
            discountApplied: round($discount, 2),
            strategyUsed: $this->pricingStrategy->getName(),
        );
    }
}
```

```php
<?php

namespace App\Domain\Service;

// DTO de résultat du calcul de prix
class OrderPriceResult
{
    public function __construct(
        public readonly float $subtotal,
        public readonly float $shipping,
        public readonly float $tax,
        public readonly float $total,
        public readonly float $discountApplied,
        public readonly string $strategyUsed,
    ) {
    }
}
```

**Résultat attendu** :

```text
$calculator = new PriceCalculator(new VolumeDiscountStrategy());

$result = $calculator->calculate(unitPrice: 20.00, quantity: 15);
// subtotal: 285.00 (20 * 15 - 5%)
// shipping: 0.00 (> 100 EUR)
// tax: 57.00 (20%)
// total: 342.00
// discountApplied: 15.00
// strategyUsed: "Remise volume"
```

---

**Étape 6 : Créer le Use Case de commande**

```php
<?php

namespace App\Application\DTO;

// DTO d'entrée du Use Case
class PlaceBookOrderRequest
{
    public function __construct(
        public readonly int $bookId,
        public readonly int $quantity,
    ) {
    }
}

// DTO de sortie du Use Case
class PlaceBookOrderResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $bookTitle = null,
        public readonly ?int $quantity = null,
        public readonly ?float $unitPrice = null,
        public readonly ?float $subtotal = null,
        public readonly ?float $shipping = null,
        public readonly ?float $tax = null,
        public readonly ?float $total = null,
        public readonly ?string $errorMessage = null,
    ) {
    }
}
```

```php
<?php

namespace App\Application\Port;

use App\Entity\Book;

// Port : interface pour accéder aux livres
// Le Use Case ne connait PAS Doctrine
interface BookRepositoryPort
{
    public function findById(int $id): ?Book;
    public function save(Book $book): void;
}
```

```php
<?php

namespace App\Application\UseCase;

use App\Application\DTO\PlaceBookOrderRequest;
use App\Application\DTO\PlaceBookOrderResponse;
use App\Application\Port\BookRepositoryPort;
use App\Domain\OrderRules;
use App\Domain\Service\PriceCalculator;

// Use Case : passer une commande de livre
// Ce code ne connaît PAS Symfony, PAS Doctrine, PAS le HTTP
class PlaceBookOrder
{
    public function __construct(
        private BookRepositoryPort $bookRepository,
        private PriceCalculator $priceCalculator,
    ) {
    }

    public function execute(PlaceBookOrderRequest $request): PlaceBookOrderResponse
    {
        // Étape 1 : trouver le livre
        $book = $this->bookRepository->findById($request->bookId);

        if (!$book) {
            return new PlaceBookOrderResponse(
                success: false,
                errorMessage: 'Livre non trouvé',
            );
        }

        // Étape 2 : valider la quantité
        if ($request->quantity < OrderRules::MIN_QUANTITY
            || $request->quantity > OrderRules::MAX_QUANTITY) {
            return new PlaceBookOrderResponse(
                success: false,
                errorMessage: sprintf(
                    'La quantité doit être entre %d et %d',
                    OrderRules::MIN_QUANTITY,
                    OrderRules::MAX_QUANTITY,
                ),
            );
        }

        // Étape 3 : vérifier le stock
        if ($book->getStock() < $request->quantity) {
            return new PlaceBookOrderResponse(
                success: false,
                errorMessage: sprintf(
                    'Stock insuffisant : %d disponible(s), %d demandé(s)',
                    $book->getStock(),
                    $request->quantity,
                ),
            );
        }

        // Étape 4 : calculer le prix
        $priceResult = $this->priceCalculator->calculate(
            unitPrice: $book->getPrice(),
            quantity: $request->quantity,
        );

        // Étape 5 : mettre à jour le stock
        $book->decreaseStock($request->quantity);
        $this->bookRepository->save($book);

        // Étape 6 : retourner le résultat
        return new PlaceBookOrderResponse(
            success: true,
            bookTitle: $book->getTitle(),
            quantity: $request->quantity,
            unitPrice: $book->getPrice(),
            subtotal: $priceResult->subtotal,
            shipping: $priceResult->shipping,
            tax: $priceResult->tax,
            total: $priceResult->total,
        );
    }
}
```

**Résultat attendu** :

```text
Le Use Case est testable SANS Symfony et SANS base de données.
Il depend uniquement :
  - d'un port (BookRepositoryPort) → interface
  - d'un service de calcul (PriceCalculator) → domaine
  - de DTOs (Request/Response) → données simples
```

---

**Étape 7 : Extraire la recherche dans un repository**

```php
<?php

namespace App\Application\DTO;

// DTO de critères de recherche
class BookSearchCriteria
{
    public function __construct(
        public readonly ?string $query = null,
        public readonly ?string $category = null,
        public readonly ?float $minPrice = null,
        public readonly ?float $maxPrice = null,
        public readonly string $sortBy = 'title',
    ) {
    }
}
```

```php
<?php

namespace App\Application\Port;

use App\Application\DTO\BookSearchCriteria;
use App\Entity\Book;

// Ajouter la methode de recherche au port
interface BookRepositoryPort
{
    public function findById(int $id): ?Book;
    public function save(Book $book): void;
    public function search(BookSearchCriteria $criteria): array;
    public function findAll(): array;
}
```

```php
<?php

namespace App\Infrastructure\Persistence;

use App\Application\DTO\BookSearchCriteria;
use App\Application\Port\BookRepositoryPort;
use App\Entity\Book;
use Doctrine\ORM\EntityManagerInterface;

// Adapter Doctrine : implémente le port avec Doctrine ORM
class DoctrineBookRepository implements BookRepositoryPort
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function findById(int $id): ?Book
    {
        return $this->em->find(Book::class, $id);
    }

    public function save(Book $book): void
    {
        $this->em->persist($book);
        $this->em->flush();
    }

    public function search(BookSearchCriteria $criteria): array
    {
        $qb = $this->em->createQueryBuilder()
            ->select('b')
            ->from(Book::class, 'b');

        if ($criteria->query) {
            $qb->andWhere('b.title LIKE :query OR b.author LIKE :query')
                ->setParameter('query', "%{$criteria->query}%");
        }

        if ($criteria->category) {
            $qb->andWhere('b.category = :category')
                ->setParameter('category', $criteria->category);
        }

        if ($criteria->minPrice !== null) {
            $qb->andWhere('b.price >= :minPrice')
                ->setParameter('minPrice', $criteria->minPrice);
        }

        if ($criteria->maxPrice !== null) {
            $qb->andWhere('b.price <= :maxPrice')
                ->setParameter('maxPrice', $criteria->maxPrice);
        }

        $sortField = match ($criteria->sortBy) {
            'price' => 'b.price',
            'author' => 'b.author',
            default => 'b.title',
        };

        $qb->orderBy($sortField, 'ASC');

        return $qb->getQuery()->getResult();
    }

    public function findAll(): array
    {
        return $this->em->getRepository(Book::class)->findAll();
    }
}
```

---

**Étape 8 : Créer le DTO de réponse pour la recherche**

```php
<?php

namespace App\Application\DTO;

// DTO de représentation d'un livre dans les résultats de recherche
class BookListItem
{
    public function __construct(
        public readonly int $id,
        public readonly string $title,
        public readonly string $author,
        public readonly float $price,
        public readonly int $stock,
        public readonly string $category,
        public readonly bool $available,
        public readonly string $priceFormatted,
    ) {
    }

    // Factory method pour créer un BookListItem depuis un Book
    public static function fromBook(object $book): self
    {
        return new self(
            id: $book->getId(),
            title: $book->getTitle(),
            author: $book->getAuthor(),
            price: $book->getPrice(),
            stock: $book->getStock(),
            category: $book->getCategory(),
            available: $book->getStock() > 0,
            priceFormatted: number_format($book->getPrice(), 2, ',', ' ') . ' EUR',
        );
    }
}
```

---

**Étape 9 : Créer le service de statistiques**

```php
<?php

namespace App\Application\UseCase;

use App\Application\Port\BookRepositoryPort;

class GetBookStats
{
    public function __construct(
        private BookRepositoryPort $bookRepository,
    ) {
    }

    public function execute(): BookStatsResponse
    {
        $books = $this->bookRepository->findAll();
        $totalBooks = count($books);
        $totalValue = 0.0;
        $outOfStock = 0;
        $categories = [];

        foreach ($books as $book) {
            $totalValue += $book->getPrice() * $book->getStock();

            if ($book->getStock() === 0) {
                $outOfStock++;
            }

            $category = $book->getCategory();

            if (!isset($categories[$category])) {
                $categories[$category] = 0;
            }

            $categories[$category]++;
        }

        return new BookStatsResponse(
            totalBooks: $totalBooks,
            totalValue: round($totalValue, 2),
            outOfStock: $outOfStock,
            categories: $categories,
            averagePrice: $totalBooks > 0
                ? round($totalValue / $totalBooks, 2)
                : 0.0,
        );
    }
}

class BookStatsResponse
{
    public function __construct(
        public readonly int $totalBooks,
        public readonly float $totalValue,
        public readonly int $outOfStock,
        public readonly array $categories,
        public readonly float $averagePrice,
    ) {
    }
}
```

---

**Étape 10 : Refactorer le contrôleur**

```php
<?php

namespace App\Infrastructure\Controller;

use App\Application\DTO\BookListItem;
use App\Application\DTO\BookSearchCriteria;
use App\Application\DTO\PlaceBookOrderRequest;
use App\Application\Port\BookRepositoryPort;
use App\Application\UseCase\GetBookStats;
use App\Application\UseCase\PlaceBookOrder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// ✅ Le contrôleur refactoré : uniquement de la conversion HTTP <-> DTO
class BookController
{
    public function __construct(
        private PlaceBookOrder $placeBookOrder,
        private BookRepositoryPort $bookRepository,
        private GetBookStats $getBookStats,
    ) {
    }

    #[Route('/api/books/{id}/order', methods: ['POST'])]
    public function order(int $id, Request $request): JsonResponse
    {
        // Conversion HTTP → DTO
        $data = json_decode($request->getContent(), true);

        $useCaseRequest = new PlaceBookOrderRequest(
            bookId: $id,
            quantity: $data['quantity'] ?? 1,
        );

        // Appel du Use Case
        $response = $this->placeBookOrder->execute($useCaseRequest);

        // Conversion DTO → HTTP
        if (!$response->success) {
            return new JsonResponse(
                ['error' => $response->errorMessage],
                400,
            );
        }

        return new JsonResponse([
            'bookTitle' => $response->bookTitle,
            'quantity' => $response->quantity,
            'unitPrice' => $response->unitPrice,
            'subtotal' => $response->subtotal,
            'shipping' => $response->shipping,
            'tax' => $response->tax,
            'total' => $response->total,
        ], 201);
    }

    #[Route('/api/books/search', methods: ['GET'])]
    public function search(Request $request): JsonResponse
    {
        // Conversion HTTP → DTO
        $criteria = new BookSearchCriteria(
            query: $request->query->get('q'),
            category: $request->query->get('category'),
            minPrice: $request->query->has('min_price')
                ? (float) $request->query->get('min_price')
                : null,
            maxPrice: $request->query->has('max_price')
                ? (float) $request->query->get('max_price')
                : null,
            sortBy: $request->query->get('sort', 'title'),
        );

        // Délégation au repository
        $books = $this->bookRepository->search($criteria);

        // Conversion entités → DTOs
        $results = array_map(
            fn ($book) => BookListItem::fromBook($book),
            $books,
        );

        return new JsonResponse($results);
    }

    #[Route('/api/books/stats', methods: ['GET'])]
    public function stats(): JsonResponse
    {
        // Délégation au Use Case
        $stats = $this->getBookStats->execute();

        return new JsonResponse([
            'totalBooks' => $stats->totalBooks,
            'totalValue' => $stats->totalValue,
            'outOfStock' => $stats->outOfStock,
            'categories' => $stats->categories,
            'averagePrice' => $stats->averagePrice,
        ]);
    }
}
```

---

**Étape 11 : Configurer les services Symfony**

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'

    # Port → Adapter
    App\Application\Port\BookRepositoryPort:
        class: App\Infrastructure\Persistence\DoctrineBookRepository

    # Stratégie de prix par défaut
    App\Domain\Service\PricingStrategyInterface:
        class: App\Domain\Service\VolumeDiscountStrategy
```

**Résultat attendu** :

```text
La configuration Symfony lie :
  BookRepositoryPort → DoctrineBookRepository
  PricingStrategyInterface → VolumeDiscountStrategy

Le Use Case et le PriceCalculator sont autowires automatiquement.
```

---

### Phase 4 : Validation

**Étape 12 : Vérifier la structure finale**

```text
src/
├── Domain/                           ← Couche 1 : règles métier
│   ├── OrderRules.php                ← Constantes métier
│   └── Service/
│       ├── PricingStrategyInterface.php
│       ├── VolumeDiscountStrategy.php
│       ├── StandardPricingStrategy.php
│       ├── PriceCalculator.php
│       └── OrderPriceResult.php
│
├── Application/                      ← Couche 2 : use cases
│   ├── DTO/
│   │   ├── PlaceBookOrderRequest.php
│   │   ├── PlaceBookOrderResponse.php
│   │   ├── BookSearchCriteria.php
│   │   └── BookListItem.php
│   ├── Port/
│   │   └── BookRepositoryPort.php    ← Interface (port)
│   └── UseCase/
│       ├── PlaceBookOrder.php        ← Use case commande
│       └── GetBookStats.php          ← Use case statistiques
│
├── Infrastructure/                   ← Couches 3 et 4
│   ├── Controller/
│   │   └── BookController.php        ← Adapter HTTP (refactoré)
│   └── Persistence/
│       └── DoctrineBookRepository.php ← Adapter BDD
│
└── Entity/
    └── Book.php                      ← Entite Doctrine (existante)
```

**Étape 13 : Écrire un test du Use Case**

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\DTO\PlaceBookOrderRequest;
use App\Application\UseCase\PlaceBookOrder;
use App\Domain\Service\PriceCalculator;
use App\Domain\Service\VolumeDiscountStrategy;
use App\Entity\Book;
use PHPUnit\Framework\TestCase;

class PlaceBookOrderTest extends TestCase
{
    private InMemoryBookRepository $repository;
    private PlaceBookOrder $useCase;

    protected function setUp(): void
    {
        // Repository en mémoire : pas besoin de base de données
        $this->repository = new InMemoryBookRepository();

        // PriceCalculator avec la stratégie de remise volume
        $calculator = new PriceCalculator(new VolumeDiscountStrategy());

        $this->useCase = new PlaceBookOrder($this->repository, $calculator);
    }

    public function testOrderSuccessful(): void
    {
        // Arrange : un livre en stock
        $book = new Book();
        $book->setTitle('Design Patterns');
        $book->setPrice(45.00);
        $book->setStock(20);
        $this->repository->addForTest(1, $book);

        // Act : commander 2 exemplaires
        $response = $this->useCase->execute(new PlaceBookOrderRequest(
            bookId: 1,
            quantity: 2,
        ));

        // Assert
        $this->assertTrue($response->success);
        $this->assertSame('Design Patterns', $response->bookTitle);
        $this->assertSame(2, $response->quantity);
        $this->assertSame(45.00, $response->unitPrice);
        $this->assertSame(18, $book->getStock()); // Stock diminue
    }

    public function testOrderFailsWhenBookNotFound(): void
    {
        $response = $this->useCase->execute(new PlaceBookOrderRequest(
            bookId: 999,
            quantity: 1,
        ));

        $this->assertFalse($response->success);
        $this->assertSame('Livre non trouvé', $response->errorMessage);
    }

    public function testOrderFailsWhenInsufficientStock(): void
    {
        $book = new Book();
        $book->setTitle('Clean Code');
        $book->setPrice(35.00);
        $book->setStock(3);
        $this->repository->addForTest(1, $book);

        $response = $this->useCase->execute(new PlaceBookOrderRequest(
            bookId: 1,
            quantity: 10,
        ));

        $this->assertFalse($response->success);
        $this->assertStringContainsString('Stock insuffisant', $response->errorMessage);
    }

    public function testVolumeDiscountApplied(): void
    {
        $book = new Book();
        $book->setTitle('PHP Patterns');
        $book->setPrice(20.00);
        $book->setStock(100);
        $this->repository->addForTest(1, $book);

        $response = $this->useCase->execute(new PlaceBookOrderRequest(
            bookId: 1,
            quantity: 15,
        ));

        $this->assertTrue($response->success);
        // 20 * 15 = 300, - 5% = 285, + 0 livraison, + 20% TVA = 342
        $this->assertSame(285.00, $response->subtotal);
        $this->assertSame(0.00, $response->shipping);
        $this->assertSame(57.00, $response->tax);
        $this->assertSame(342.00, $response->total);
    }
}
```

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\DTO\BookSearchCriteria;
use App\Application\Port\BookRepositoryPort;
use App\Entity\Book;

// Repository en mémoire pour les tests
class InMemoryBookRepository implements BookRepositoryPort
{
    private array $books = [];

    public function addForTest(int $id, Book $book): void
    {
        $this->books[$id] = $book;
    }

    public function findById(int $id): ?Book
    {
        return $this->books[$id] ?? null;
    }

    public function save(Book $book): void
    {
        // En mémoire : rien à faire, l'objet est déjà en mémoire
    }

    public function search(BookSearchCriteria $criteria): array
    {
        // Implémentation simplifiée pour les tests
        return array_values($this->books);
    }

    public function findAll(): array
    {
        return array_values($this->books);
    }
}
```

**Résultat attendu** :

```text
vendor/bin/phpunit tests/Application/

OK (4 tests, 12 assertions)

Les tests s'exécutent en quelques millisecondes car :
- Pas de base de données
- Pas de framework Symfony
- Pas de requête HTTP
```

---

**Étape 14 : Vérification finale**

Vérifie que le refactoring est complet en remplissant ce tableau :

```text
| Critere                          | Avant           | Apres               |
| -------------------------------- | --------------- | ------------------- |
| Lignes dans le contrôleur        | ~120            | ~60                 |
| Nombre de responsabilités        | 5+              | 1 (conversion HTTP) |
| Magic numbers                    | 8               | 0                   |
| Dépendance directe à Doctrine    | Oui             | Non (via un port)   |
| Use case testable sans framework | Non             | Oui                 |
| DTO de réponse                   | Non (tableaux)  | Oui                 |
| Stratégie de prix extensible     | Non             | Oui (Strategy)      |
| Clean Architecture respectée    | Non             | Oui                 |
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `vendor/bin/phpunit tests/Application/` | Tester les use cases (sans framework) |
| `vendor/bin/phpstan analyse src/ --level 5` | Vérifier les types et le code mort |
| `php bin/console debug:autowiring Port` | Vérifier le câblage des ports |
| `php bin/console debug:container --types` | Voir les types enregistrés |

---

## Pièges Fréquents

### Piège 1 : Refactorer sans tests

⚠️ **Problème** : Tu refactores le code sans avoir de tests. Si tu casses quelque chose, tu ne le découvres qu'en production.

✅ **Solution** : Avant de refactorer, écris au moins des tests qui vérifient le comportement actuel. Puis refactore en vérifiant que les tests passent à chaque étape.

### Piège 2 : Tout refactorer d'un coup

⚠️ **Problème** : Tu essaies de tout refactorer en une seule fois. Le refactoring est trop gros, tu perds le fil, et le code ne compile plus.

✅ **Solution** : Refactore par petites étapes. Chaque étape doit laisser le code dans un état fonctionnel. Si une étape échoue, tu peux revenir à l'étape précédente.

### Piège 3 : Sur-architecturer un petit projet

⚠️ **Problème** : Tu appliques Clean Architecture, DDD et 5 design patterns sur un CRUD de 3 entités. Le projet passe de 10 fichiers à 50 fichiers sans gain réel.

✅ **Solution** : Adapte le niveau d'architecture à la complexité du projet. Un petit projet peut se contenter de MVC classique avec des services. Applique les patterns quand la complexité le justifie.

---

## Checklist de Validation

- [ ] Je sais auditer du code existant et identifier les anti-patterns
- [ ] Je sais planifier un refactoring par étapes progressives
- [ ] Je sais extraire les magic numbers dans des constantes
- [ ] Je sais appliquer le pattern Strategy pour le calcul de prix
- [ ] Je sais créer un Use Case avec des DTOs d'entrée et de sortie
- [ ] Je sais créer un port (interface) et un adapter (implémentation)
- [ ] Je sais extraire la logique de recherche dans un repository
- [ ] Je sais écrire des tests de Use Case sans framework ni base de données
- [ ] Je sais configurer les ports dans `services.yaml`
- [ ] Je sais structurer un projet selon Clean Architecture

---

## Récapitulatif du cursus

Ce projet intégrateur conclut le cursus Architecture et Design Patterns. Voici un résumé de ce que tu as appris :

| Fiche | Concept clé | Application dans le projet |
| --- | --- | --- |
| 01 | Design patterns | Vocabulaire et catégories |
| 02 | SOLID | Principes fondamentaux |
| 03 | SOLID dans Symfony | Application dans un framework |
| 04 | Patterns de création | Factory, Builder |
| 05 | Patterns de structure | Adapter, Decorator, Façade |
| 06 | Patterns de comportement | Strategy, Observer, Command |
| 07 | MVC en profondeur | Séparation des responsabilités |
| 08 | Clean Architecture | Couches, ports et adapters |
| 09 | DDD | Entités, value objects, agrégats |
| 10 | Patterns JavaScript | Module, observer, pub/sub, middleware |
| 11 | Anti-patterns | God class, spaghetti, magic numbers |
| 12 | Multi-tenancy | Isoler les données par client |
| 13 | Soft delete | Supprimer sans effacer |
| 14 | Anti-énumération | Ne pas révéler qui existe |
| 15 | URLs signées | Tokens d'accès anonyme |
| 16 | Filtres Doctrine | Isolation transparente |
| 17 | Projet intégrateur | Tout combiner sur un cas réel |

---

## Exercice Pratique

**Énoncé** : Tu disposes d'un contrôleur `UserController` qui gère l'inscription, la mise à jour du profil et la suppression d'un utilisateur. Comme le `BookController` initial, il concentre toute la logique métier : validation des données, hachage du mot de passe, vérification d'unicité de l'email, envoi d'un email de bienvenue et accès direct à Doctrine. Voici le code de départ :

```php
<?php

namespace App\Controller;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    #[Route('/api/users/register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $email = $data['email'] ?? '';
        $password = $data['password'] ?? '';
        $name = $data['name'] ?? '';

        // Validation dans le contrôleur
        if (strlen($password) < 8) {
            return new JsonResponse(['error' => 'Mot de passe trop court'], 400);
        }

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return new JsonResponse(['error' => 'Email invalide'], 400);
        }

        // Requête Doctrine directement dans le contrôleur
        $existing = $this->em->getRepository(User::class)
            ->findOneBy(['email' => $email]);

        if ($existing) {
            return new JsonResponse(['error' => 'Email déjà utilisé'], 409);
        }

        $user = new User();
        $user->setName($name);
        $user->setEmail($email);
        // Hachage du mot de passe dans le contrôleur
        $user->setPassword(password_hash($password, PASSWORD_BCRYPT));
        $user->setCreatedAt(new \DateTimeImmutable());

        $this->em->persist($user);
        $this->em->flush();

        // Envoi d'email simulé directement dans le contrôleur
        mail($email, 'Bienvenue', 'Bienvenue ' . $name . ' !');

        return new JsonResponse([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
        ], 201);
    }
}
```

Refactore ce contrôleur en appliquant les techniques du cursus :

1. **Extraire les constantes** : longueur minimale du mot de passe, algorithme de hachage.
2. **Créer un port** `UserRepositoryPort` avec les méthodes `findByEmail`, `save`.
3. **Créer un port** `MailerPort` avec une méthode `sendWelcomeEmail`.
4. **Créer les DTOs** `RegisterUserRequest` et `RegisterUserResponse`.
5. **Créer un Use Case** `RegisterUser` qui orchestre la logique métier.
6. **Refactorer le contrôleur** pour qu'il ne fasse que la conversion HTTP vers DTO et DTO vers HTTP.
7. **Écrire un test unitaire** du Use Case avec un `InMemoryUserRepository` et un `FakeMailer`.

**Indications** :

- Suis la même méthode en 4 phases que dans cette fiche : audit, planification, refactoring, validation
- Commence par créer les constantes dans une classe `UserRules` (namespace `App\Domain`)
- Le Use Case `RegisterUser` ne doit connaître ni Symfony ni Doctrine
- Le `FakeMailer` dans les tests doit enregistrer les emails envoyés dans un tableau pour que tu puisses vérifier qu'un email a bien été envoyé
- La structure de fichiers cible doit ressembler à celle du projet de la fiche (Domain, Application, Infrastructure)

**Résultat attendu** :

- Le contrôleur ne contient plus aucune logique métier
- Le Use Case `RegisterUser` est testable sans framework ni base de données
- Les tests vérifient : inscription réussie, email déjà utilisé, mot de passe trop court, email invalide, envoi de l'email de bienvenue
- La structure suit Clean Architecture avec les couches Domain, Application et Infrastructure

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### Étape 1 : Les constantes métier

```php
<?php

namespace App\Domain;

// Constantes métier pour la gestion des utilisateurs
class UserRules
{
    public const MIN_PASSWORD_LENGTH = 8;
    public const PASSWORD_ALGORITHM = PASSWORD_BCRYPT;
}
```

---

### Étape 2 : Les ports (interfaces)

```php
<?php

namespace App\Application\Port;

use App\Entity\User;

// Port pour l'accès aux utilisateurs
interface UserRepositoryPort
{
    public function findByEmail(string $email): ?User;
    public function save(User $user): void;
}
```

```php
<?php

namespace App\Application\Port;

// Port pour l'envoi d'emails
interface MailerPort
{
    public function sendWelcomeEmail(string $email, string $name): void;
}
```

---

### Étape 3 : Les DTOs

```php
<?php

namespace App\Application\DTO;

// DTO d'entrée du Use Case RegisterUser
class RegisterUserRequest
{
    public function __construct(
        public readonly string $name,
        public readonly string $email,
        public readonly string $password,
    ) {
    }
}
```

```php
<?php

namespace App\Application\DTO;

// DTO de sortie du Use Case RegisterUser
class RegisterUserResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?int $id = null,
        public readonly ?string $name = null,
        public readonly ?string $email = null,
        public readonly ?string $errorMessage = null,
        public readonly ?int $httpStatus = null,
    ) {
    }
}
```

---

### Étape 4 : Le Use Case

```php
<?php

namespace App\Application\UseCase;

use App\Application\DTO\RegisterUserRequest;
use App\Application\DTO\RegisterUserResponse;
use App\Application\Port\MailerPort;
use App\Application\Port\UserRepositoryPort;
use App\Domain\UserRules;
use App\Entity\User;

// Use Case : inscrire un nouvel utilisateur
// Ce code ne connaît PAS Symfony, PAS Doctrine, PAS le HTTP
class RegisterUser
{
    public function __construct(
        private UserRepositoryPort $userRepository,
        private MailerPort $mailer,
    ) {
    }

    public function execute(RegisterUserRequest $request): RegisterUserResponse
    {
        // Étape 1 : valider le mot de passe
        if (strlen($request->password) < UserRules::MIN_PASSWORD_LENGTH) {
            return new RegisterUserResponse(
                success: false,
                errorMessage: sprintf(
                    'Le mot de passe doit contenir au moins %d caractères',
                    UserRules::MIN_PASSWORD_LENGTH,
                ),
                httpStatus: 400,
            );
        }

        // Étape 2 : valider l'email
        if (!filter_var($request->email, FILTER_VALIDATE_EMAIL)) {
            return new RegisterUserResponse(
                success: false,
                errorMessage: 'Email invalide',
                httpStatus: 400,
            );
        }

        // Étape 3 : vérifier l'unicité de l'email
        $existing = $this->userRepository->findByEmail($request->email);

        if ($existing !== null) {
            return new RegisterUserResponse(
                success: false,
                errorMessage: 'Email déjà utilisé',
                httpStatus: 409,
            );
        }

        // Étape 4 : créer l'utilisateur
        $user = new User();
        $user->setName($request->name);
        $user->setEmail($request->email);
        $user->setPassword(
            password_hash($request->password, UserRules::PASSWORD_ALGORITHM),
        );
        $user->setCreatedAt(new \DateTimeImmutable());

        // Étape 5 : persister l'utilisateur
        $this->userRepository->save($user);

        // Étape 6 : envoyer l'email de bienvenue
        $this->mailer->sendWelcomeEmail($request->email, $request->name);

        // Étape 7 : retourner le résultat
        return new RegisterUserResponse(
            success: true,
            id: $user->getId(),
            name: $user->getName(),
            email: $user->getEmail(),
        );
    }
}
```

---

### Étape 5 : Le contrôleur refactoré

```php
<?php

namespace App\Infrastructure\Controller;

use App\Application\DTO\RegisterUserRequest;
use App\Application\UseCase\RegisterUser;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// Le contrôleur ne fait que la conversion HTTP <-> DTO
class UserController
{
    public function __construct(
        private RegisterUser $registerUser,
    ) {
    }

    #[Route('/api/users/register', methods: ['POST'])]
    public function register(Request $request): JsonResponse
    {
        // Conversion HTTP → DTO
        $data = json_decode($request->getContent(), true);

        $useCaseRequest = new RegisterUserRequest(
            name: $data['name'] ?? '',
            email: $data['email'] ?? '',
            password: $data['password'] ?? '',
        );

        // Appel du Use Case
        $response = $this->registerUser->execute($useCaseRequest);

        // Conversion DTO → HTTP
        if (!$response->success) {
            return new JsonResponse(
                ['error' => $response->errorMessage],
                $response->httpStatus ?? 400,
            );
        }

        return new JsonResponse([
            'id' => $response->id,
            'name' => $response->name,
            'email' => $response->email,
        ], 201);
    }
}
```

---

### Étape 6 : Les tests avec doubles de test

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\Port\UserRepositoryPort;
use App\Entity\User;

// Repository en mémoire pour les tests
class InMemoryUserRepository implements UserRepositoryPort
{
    /** @var array<string, User> Indexé par email */
    private array $users = [];

    private int $nextId = 1;

    public function findByEmail(string $email): ?User
    {
        return $this->users[$email] ?? null;
    }

    public function save(User $user): void
    {
        // Simuler l'auto-incrément de l'ID
        if ($user->getId() === null) {
            $reflection = new \ReflectionProperty(User::class, 'id');
            $reflection->setValue($user, $this->nextId++);
        }

        $this->users[$user->getEmail()] = $user;
    }
}
```

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\Port\MailerPort;

// Faux service d'envoi d'emails pour les tests
class FakeMailer implements MailerPort
{
    /** @var array<int, array{email: string, name: string}> */
    public array $sentEmails = [];

    public function sendWelcomeEmail(string $email, string $name): void
    {
        // On enregistre l'email envoyé pour pouvoir vérifier dans les tests
        $this->sentEmails[] = ['email' => $email, 'name' => $name];
    }

    public function hasSentEmailTo(string $email): bool
    {
        foreach ($this->sentEmails as $sent) {
            if ($sent['email'] === $email) {
                return true;
            }
        }

        return false;
    }
}
```

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\DTO\RegisterUserRequest;
use App\Application\UseCase\RegisterUser;
use PHPUnit\Framework\TestCase;

class RegisterUserTest extends TestCase
{
    private InMemoryUserRepository $repository;
    private FakeMailer $mailer;
    private RegisterUser $useCase;

    protected function setUp(): void
    {
        $this->repository = new InMemoryUserRepository();
        $this->mailer = new FakeMailer();
        $this->useCase = new RegisterUser($this->repository, $this->mailer);
    }

    public function testRegisterSuccessful(): void
    {
        // Act : inscrire un utilisateur
        $response = $this->useCase->execute(new RegisterUserRequest(
            name: 'Alice Dupont',
            email: 'alice@exemple.fr',
            password: 'motdepasse123',
        ));

        // Assert : l'inscription a réussi
        $this->assertTrue($response->success);
        $this->assertSame('Alice Dupont', $response->name);
        $this->assertSame('alice@exemple.fr', $response->email);
        $this->assertNotNull($response->id);
    }

    public function testRegisterSendsWelcomeEmail(): void
    {
        // Act
        $this->useCase->execute(new RegisterUserRequest(
            name: 'Alice Dupont',
            email: 'alice@exemple.fr',
            password: 'motdepasse123',
        ));

        // Assert : un email de bienvenue a été envoyé
        $this->assertTrue($this->mailer->hasSentEmailTo('alice@exemple.fr'));
        $this->assertCount(1, $this->mailer->sentEmails);
    }

    public function testRegisterFailsWithShortPassword(): void
    {
        // Act : mot de passe trop court (moins de 8 caractères)
        $response = $this->useCase->execute(new RegisterUserRequest(
            name: 'Bob Martin',
            email: 'bob@exemple.fr',
            password: 'court',
        ));

        // Assert
        $this->assertFalse($response->success);
        $this->assertStringContainsString('au moins 8 caractères', $response->errorMessage);
        $this->assertSame(400, $response->httpStatus);
    }

    public function testRegisterFailsWithInvalidEmail(): void
    {
        // Act : email invalide
        $response = $this->useCase->execute(new RegisterUserRequest(
            name: 'Charlie',
            email: 'pas-un-email',
            password: 'motdepasse123',
        ));

        // Assert
        $this->assertFalse($response->success);
        $this->assertSame('Email invalide', $response->errorMessage);
        $this->assertSame(400, $response->httpStatus);
    }

    public function testRegisterFailsWithDuplicateEmail(): void
    {
        // Arrange : inscrire un premier utilisateur
        $this->useCase->execute(new RegisterUserRequest(
            name: 'Alice Dupont',
            email: 'alice@exemple.fr',
            password: 'motdepasse123',
        ));

        // Act : essayer d'inscrire un deuxième utilisateur avec le même email
        $response = $this->useCase->execute(new RegisterUserRequest(
            name: 'Alice Autre',
            email: 'alice@exemple.fr',
            password: 'autremotdepasse',
        ));

        // Assert
        $this->assertFalse($response->success);
        $this->assertSame('Email déjà utilisé', $response->errorMessage);
        $this->assertSame(409, $response->httpStatus);
    }

    public function testNoEmailSentOnFailure(): void
    {
        // Act : inscription qui échoue (mot de passe trop court)
        $this->useCase->execute(new RegisterUserRequest(
            name: 'Eve',
            email: 'eve@exemple.fr',
            password: 'court',
        ));

        // Assert : aucun email envoyé
        $this->assertCount(0, $this->mailer->sentEmails);
    }
}
```

**Résultat attendu** :

```text
vendor/bin/phpunit tests/Application/UseCase/RegisterUserTest.php

OK (6 tests, 14 assertions)

La structure finale :
src/
├── Domain/
│   └── UserRules.php
├── Application/
│   ├── DTO/
│   │   ├── RegisterUserRequest.php
│   │   └── RegisterUserResponse.php
│   ├── Port/
│   │   ├── UserRepositoryPort.php
│   │   └── MailerPort.php
│   └── UseCase/
│       └── RegisterUser.php
└── Infrastructure/
    └── Controller/
        └── UserController.php

tests/
└── Application/
    └── UseCase/
        ├── InMemoryUserRepository.php
        ├── FakeMailer.php
        └── RegisterUserTest.php
```

---

## Navigation

← Fiche précédente : **[Filtres Doctrine -- isolation transparente](16-filtres-doctrine.md)**

Fin du cursus Architecture et Design Patterns.
