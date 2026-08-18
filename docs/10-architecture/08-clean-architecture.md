---
tags:
  - Architecture
  - Avancé
  - Concept
description: "Clean Architecture : couches, règle de dépendance, ports et adapters, implémentation dans Symfony."
estimated_time: "90 min"
fiche_number: 8
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 08 - Clean Architecture

> **En bref** : Comprendre les couches de Clean Architecture, la règle de dépendance, les ports et adapters, et implémenter cette architecture dans un projet Symfony. Lecture estimée : 90 min.

## Prérequis

- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- Fiche 3 : [SOLID - Application dans Symfony](03-solid-symfony.md)
- Fiche 7 : [MVC en profondeur](07-mvc-profondeur.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les 4 couches de Clean Architecture, appliquer la règle de dépendance, implémenter les ports et adapters et structurer un projet Symfony selon cette architecture.

---

## Concepts

### Qu'est-ce que Clean Architecture ?

**Définition** : Clean Architecture est un ensemble de principes architecturaux proposés par Robert C. Martin ("Uncle Bob") en 2012. L'idée centrale est de séparer le code en couches concentriques, où les couches internes ne connaissent pas les couches externes.

**Le problème que Clean Architecture résout** :

Sans Clean Architecture, voici les problèmes rencontrés :

1. **Dépendance au framework** : la logique métier est mélangée avec le code Symfony. Si Symfony change, tout le code métier doit être modifié.
2. **Dépendance à la base de données** : la logique métier utilise directement Doctrine. Changer de base de données oblige à réécrire la logique.
3. **Tests coûteux** : pour tester la logique métier, il faut démarrer Symfony, Doctrine et une base de données.

**Comment Clean Architecture résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Dépendance au framework | La logique métier est dans une couche indépendante du framework |
| Dépendance à la base de données | La persistance est derrière une interface (port) |
| Tests coûteux | La logique métier se teste avec des mocks, sans infrastructure |

**Analogie concrète** : Pense à un oignon avec plusieurs couches. Le coeur de l'oignon (la logique métier) ne change jamais, quelle que soit la couche extérieure. Tu peux changer la peau de l'oignon (le framework, la base de données) sans toucher au coeur. Chaque couche ne connaît que la couche immédiatement en dessous d'elle.

---

### Les 4 couches de Clean Architecture

**Définition** : Clean Architecture organise le code en 4 couches concentriques, du centre (le plus stable) vers l'extérieur (le plus volatile).

```text
┌─────────────────────────────────────────────┐
│           Frameworks & Drivers              │ ← Couche 4 (externe)
│  (Symfony, Doctrine, Twig, HTTP, CLI)       │
│  ┌─────────────────────────────────────┐    │
│  │      Interface Adapters             │    │ ← Couche 3
│  │  (Controleurs, Presenters, Repos)   │    │
│  │  ┌─────────────────────────────┐    │    │
│  │  │      Use Cases              │    │    │ ← Couche 2
│  │  │  (Services applicatifs)     │    │    │
│  │  │  ┌─────────────────────┐    │    │    │
│  │  │  │     Entities        │    │    │    │ ← Couche 1 (centre)
│  │  │  │  (Logique metier)   │    │    │    │
│  │  │  └─────────────────────┘    │    │    │
│  │  └─────────────────────────────┘    │    │
│  └─────────────────────────────────────┘    │
└─────────────────────────────────────────────┘
```

**Règle de dépendance** : les dépendances pointent toujours vers l'intérieur. Les couches externes dépendent des couches internes, jamais l'inverse.

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-08-clean-architecture-1.html">Les 4 couches de Clean Architecture (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-08-clean-architecture-1.html" title="Les 4 couches de Clean Architecture" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Les Entities ne connaissent rien des couches extérieures. Chaque couche ne dépend que de la couche immédiatement intérieure.

**Couche 1 : Entities (Entités métier)**

| Aspect | Description |
| --- | --- |
| Contenu | Objets métier purs avec leurs règles |
| Dépend de | Rien (aucune dépendance) |
| Exemple | `Domain/Entity/Order.php`, `Domain/ValueObject/Money.php` |
| Change quand | Les règles métier changent |

```php
<?php

namespace App\Domain\Entity;

// Entite metier PURE : aucune annotation Doctrine, aucun import Symfony
// Cette classe ne depend de RIEN d'externe
class Order
{
    private array $items = [];
    private string $status = 'pending';

    public function __construct(
        private string $customerId,
        private \DateTimeImmutable $createdAt,
    ) {
    }

    // La logique metier est DANS l'entite
    public function addItem(string $productId, int $quantity, float $unitPrice): void
    {
        if ($quantity <= 0) {
            throw new \DomainException('La quantite doit etre superieure a 0');
        }

        $this->items[] = [
            'productId' => $productId,
            'quantity' => $quantity,
            'unitPrice' => $unitPrice,
        ];
    }

    public function getTotal(): float
    {
        $total = 0.0;

        foreach ($this->items as $item) {
            $total += $item['quantity'] * $item['unitPrice'];
        }

        return $total;
    }

    public function confirm(): void
    {
        if (empty($this->items)) {
            throw new \DomainException(
                'Impossible de confirmer une commande vide'
            );
        }

        if ($this->status !== 'pending') {
            throw new \DomainException(
                "Impossible de confirmer : statut actuel = {$this->status}"
            );
        }

        $this->status = 'confirmed';
    }

    public function getStatus(): string { return $this->status; }
    public function getCustomerId(): string { return $this->customerId; }
    public function getItems(): array { return $this->items; }
}
```

**Couche 2 : Use Cases (Cas d'utilisation)**

| Aspect | Description |
| --- | --- |
| Contenu | Services applicatifs qui orchestrent la logique métier |
| Dépend de | Couche 1 (Entities) uniquement |
| Exemple | `Application/UseCase/PlaceOrder.php` |
| Change quand | Un scénario d'utilisation change |

```php
<?php

namespace App\Application\UseCase;

use App\Domain\Entity\Order;
use App\Application\Port\OrderRepositoryPort;
use App\Application\Port\PaymentGatewayPort;

// Le Use Case orchestre la logique metier
// Il ne connait PAS Symfony, PAS Doctrine, PAS le HTTP
class PlaceOrder
{
    public function __construct(
        // Les ports (interfaces) sont definis dans la couche Application
        private OrderRepositoryPort $orderRepository,
        private PaymentGatewayPort $paymentGateway,
    ) {
    }

    public function execute(PlaceOrderRequest $request): PlaceOrderResponse
    {
        // Etape 1 : creer la commande (logique metier)
        $order = new Order(
            customerId: $request->customerId,
            createdAt: new \DateTimeImmutable(),
        );

        // Etape 2 : ajouter les articles
        foreach ($request->items as $item) {
            $order->addItem(
                productId: $item['productId'],
                quantity: $item['quantity'],
                unitPrice: $item['unitPrice'],
            );
        }

        // Etape 3 : effectuer le paiement (via un port)
        $paymentResult = $this->paymentGateway->charge(
            amount: $order->getTotal(),
            customerId: $request->customerId,
        );

        if (!$paymentResult->success) {
            return new PlaceOrderResponse(
                success: false,
                errorMessage: 'Paiement refuse',
            );
        }

        // Etape 4 : confirmer la commande
        $order->confirm();

        // Etape 5 : sauvegarder (via un port)
        $this->orderRepository->save($order);

        return new PlaceOrderResponse(
            success: true,
            orderId: $order->getId(),
        );
    }
}
```

**Couche 3 : Interface Adapters (Adaptateurs d'interface)**

| Aspect | Description |
| --- | --- |
| Contenu | Contrôleurs, presenters, implémentations de repositories |
| Dépend de | Couche 2 (Use Cases) et Couche 1 (Entities) |
| Exemple | `Infrastructure/Controller/OrderController.php` |
| Change quand | La manière d'interagir avec l'extérieur change |

**Couche 4 : Frameworks & Drivers**

| Aspect | Description |
| --- | --- |
| Contenu | Symfony, Doctrine, Twig, librairies externes |
| Dépend de | Couches 1, 2 et 3 |
| Exemple | `config/`, `vendor/`, `docker-compose.yml` |
| Change quand | L'infrastructure technique change |

---

### La règle de dépendance

**Définition** : Les dépendances ne doivent pointer que vers l'intérieur. Jamais une couche interne ne doit importer ou utiliser quelque chose d'une couche externe.

**Le problème que la règle de dépendance résout** :

Sans cette règle, voici les problèmes rencontrés :

1. **Le coeur dépend de l'infrastructure** : changer la base de données casse la logique métier.
2. **Tests impossibles** : tester un Use Case nécessite de démarrer toute l'infrastructure.
3. **Migration bloquée** : impossible de migrer vers un autre framework.

**Schéma des dépendances** :

```text
✅ Dependances correctes (vers l'intérieur) :
  Controleur → Use Case → Entity
  Repository Doctrine → OrderRepositoryPort (interface)

❌ Dependances interdites (vers l'exterieur) :
  Entity → Doctrine (annotation @ORM)
  Use Case → Symfony (Request, Response)
  Entity → Repository Doctrine
```

**Analogie concrète** : Pense à un PDG d'entreprise. Le PDG (entité métier) définit les règles de l'entreprise. Il ne sait pas quel logiciel comptable est utilisé (infrastructure). Le directeur financier (use case) applique les règles du PDG en utilisant le logiciel comptable. Si on change de logiciel, le PDG n'a rien à modifier.

---

### Ports et Adapters (Architecture Hexagonale)

**Définition** : Les "ports" sont des interfaces définies par la couche métier. Les "adapters" sont les implémentations concrètes dans la couche infrastructure. C'est la mise en oeuvre du principe DIP (Dependency Inversion) appliqué à l'architecture.

**Les ports (interfaces)** :

```php
<?php

namespace App\Application\Port;

use App\Domain\Entity\Order;

// Port : defini par la couche Application
// Ce port decrit CE DONT le metier a besoin, pas COMMENT c'est fait
interface OrderRepositoryPort
{
    public function save(Order $order): void;
    public function findById(string $id): ?Order;
    public function findByCustomerId(string $customerId): array;
}
```

```php
<?php

namespace App\Application\Port;

// Port pour le paiement
interface PaymentGatewayPort
{
    public function charge(float $amount, string $customerId): PaymentResult;
}
```

**Les adapters (implémentations)** :

```php
<?php

namespace App\Infrastructure\Persistence;

use App\Application\Port\OrderRepositoryPort;
use App\Domain\Entity\Order;
use Doctrine\ORM\EntityManagerInterface;

// Adapter : implemente le port avec Doctrine
// Cette classe connait Doctrine, mais le Use Case ne la connait PAS
class DoctrineOrderRepository implements OrderRepositoryPort
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function save(Order $order): void
    {
        $this->em->persist($order);
        $this->em->flush();
    }

    public function findById(string $id): ?Order
    {
        return $this->em->find(Order::class, $id);
    }

    public function findByCustomerId(string $customerId): array
    {
        return $this->em->getRepository(Order::class)
            ->findBy(['customerId' => $customerId]);
    }
}
```

```php
<?php

namespace App\Infrastructure\Payment;

use App\Application\Port\PaymentGatewayPort;
use App\Application\Port\PaymentResult;

// Adapter : implemente le port avec Stripe
class StripePaymentGateway implements PaymentGatewayPort
{
    public function __construct(
        private string $apiKey,
    ) {
    }

    public function charge(float $amount, string $customerId): PaymentResult
    {
        // Appel a l'API Stripe
        // Le Use Case ne sait pas que c'est Stripe
        return new PaymentResult(
            success: true,
            transactionId: 'tx_' . uniqid(),
        );
    }
}
```

```php
<?php

namespace App\Infrastructure\Payment;

use App\Application\Port\PaymentGatewayPort;
use App\Application\Port\PaymentResult;

// Adapter pour les tests : pas de vrai paiement
class FakePaymentGateway implements PaymentGatewayPort
{
    public function charge(float $amount, string $customerId): PaymentResult
    {
        // Simule un paiement reussi
        return new PaymentResult(
            success: true,
            transactionId: 'fake_' . uniqid(),
        );
    }
}
```

---

### Structure de dossiers Clean Architecture dans Symfony

**Définition** : Voici comment organiser un projet Symfony selon Clean Architecture.

```text
src/
├── Domain/                          ← Couche 1 : Entites metier
│   ├── Entity/
│   │   ├── Order.php                ← Entite pure (pas d'annotations Doctrine)
│   │   └── Customer.php
│   ├── ValueObject/
│   │   ├── Money.php                ← Objets valeur immuables
│   │   └── EmailAddress.php
│   ├── Event/
│   │   └── OrderConfirmedEvent.php  ← Evenements metier
│   └── Exception/
│       └── InsufficientStockException.php
│
├── Application/                     ← Couche 2 : Use Cases
│   ├── UseCase/
│   │   ├── PlaceOrder.php           ← Cas d'utilisation
│   │   └── CancelOrder.php
│   ├── DTO/
│   │   ├── PlaceOrderRequest.php    ← Entree du use case
│   │   └── PlaceOrderResponse.php   ← Sortie du use case
│   └── Port/
│       ├── OrderRepositoryPort.php  ← Interface (port)
│       └── PaymentGatewayPort.php   ← Interface (port)
│
├── Infrastructure/                  ← Couches 3 et 4
│   ├── Controller/
│   │   └── OrderController.php      ← Adapter HTTP
│   ├── Persistence/
│   │   └── DoctrineOrderRepository.php  ← Adapter BDD
│   ├── Payment/
│   │   ├── StripePaymentGateway.php     ← Adapter paiement
│   │   └── FakePaymentGateway.php       ← Adapter test
│   └── Mapping/
│       └── Order.orm.xml            ← Mapping Doctrine (separe de l'entite)
│
└── Kernel.php
```

---

## Étapes Pratiques

### Étape 1 : Créer une entité métier pure

```php
<?php

namespace App\Domain\ValueObject;

// Value Object : immuable, sans identite
// Deux Money avec les memes valeurs sont consideres comme egaux
class Money
{
    public function __construct(
        private readonly float $amount,
        private readonly string $currency,
    ) {
        if ($amount < 0) {
            throw new \DomainException(
                'Le montant ne peut pas etre negatif'
            );
        }
    }

    public function getAmount(): float
    {
        return $this->amount;
    }

    public function getCurrency(): string
    {
        return $this->currency;
    }

    public function add(self $other): self
    {
        if ($this->currency !== $other->currency) {
            throw new \DomainException(
                "Impossible d'additionner {$this->currency} et {$other->currency}"
            );
        }

        // Retourne un NOUVEL objet (immuabilite)
        return new self($this->amount + $other->amount, $this->currency);
    }

    public function multiply(int $factor): self
    {
        return new self($this->amount * $factor, $this->currency);
    }

    public function equals(self $other): bool
    {
        return $this->amount === $other->amount
            && $this->currency === $other->currency;
    }
}
```

**Résultat attendu** :

```text
$price = new Money(29.99, 'EUR');
$doubled = $price->multiply(2);
// $doubled->getAmount() === 59.98
// $price->getAmount() === 29.99 (inchange : immuable)

$total = $price->add(new Money(10.01, 'EUR'));
// $total->getAmount() === 40.00
```

---

### Étape 2 : Créer un Use Case

```php
<?php

namespace App\Application\DTO;

// Entree du Use Case : donnees necessaires
class PlaceOrderRequest
{
    public function __construct(
        public readonly string $customerId,
        public readonly array $items,
    ) {
    }
}

// Sortie du Use Case : resultat de l'operation
class PlaceOrderResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $orderId = null,
        public readonly ?string $errorMessage = null,
    ) {
    }
}
```

```php
<?php

namespace App\Application\UseCase;

use App\Application\DTO\PlaceOrderRequest;
use App\Application\DTO\PlaceOrderResponse;
use App\Application\Port\OrderRepositoryPort;
use App\Domain\Entity\Order;

class PlaceOrder
{
    public function __construct(
        private OrderRepositoryPort $repository,
    ) {
    }

    public function execute(PlaceOrderRequest $request): PlaceOrderResponse
    {
        // Toute la logique est ici, sans framework
        $order = new Order(
            customerId: $request->customerId,
            createdAt: new \DateTimeImmutable(),
        );

        foreach ($request->items as $item) {
            $order->addItem(
                $item['productId'],
                $item['quantity'],
                $item['unitPrice'],
            );
        }

        $order->confirm();
        $this->repository->save($order);

        return new PlaceOrderResponse(
            success: true,
            orderId: $order->getId(),
        );
    }
}
```

**Résultat attendu** :

```text
Ce Use Case est testable SANS Symfony et SANS base de données :

$fakeRepo = new InMemoryOrderRepository();
$useCase = new PlaceOrder($fakeRepo);

$response = $useCase->execute(new PlaceOrderRequest(
    customerId: 'cust_123',
    items: [
        ['productId' => 'prod_1', 'quantity' => 2, 'unitPrice' => 29.99],
    ],
));

assert($response->success === true);
```

---

### Étape 3 : Créer le contrôleur (adapter HTTP)

```php
<?php

namespace App\Infrastructure\Controller;

use App\Application\DTO\PlaceOrderRequest;
use App\Application\UseCase\PlaceOrder;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

// Le controleur est un ADAPTER : il convertit HTTP en appel de Use Case
class OrderController
{
    public function __construct(
        private PlaceOrder $placeOrder,
    ) {
    }

    #[Route('/api/orders', methods: ['POST'])]
    public function place(Request $request): JsonResponse
    {
        // Conversion HTTP → DTO
        $data = json_decode($request->getContent(), true);

        $useCaseRequest = new PlaceOrderRequest(
            customerId: $data['customerId'],
            items: $data['items'],
        );

        // Appel du Use Case
        $response = $this->placeOrder->execute($useCaseRequest);

        // Conversion resultat → HTTP
        if ($response->success) {
            return new JsonResponse(
                ['orderId' => $response->orderId],
                201,
            );
        }

        return new JsonResponse(
            ['error' => $response->errorMessage],
            400,
        );
    }
}
```

**Résultat attendu** :

```text
Le contrôleur ne contient AUCUNE logique métier.
Il fait uniquement la conversion :
  HTTP Request → DTO → Use Case → DTO → HTTP Response
```

---

### Étape 4 : Configurer les ports dans Symfony

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'

    # Lier les ports (interfaces) a leurs adapters (implementations)
    App\Application\Port\OrderRepositoryPort:
        class: App\Infrastructure\Persistence\DoctrineOrderRepository

    App\Application\Port\PaymentGatewayPort:
        class: App\Infrastructure\Payment\StripePaymentGateway
        arguments:
            $apiKey: '%env(STRIPE_API_KEY)%'
```

```yaml
# config/services_test.yaml
services:
    # En test, on utilise les faux adapters
    App\Application\Port\OrderRepositoryPort:
        class: App\Infrastructure\Persistence\InMemoryOrderRepository

    App\Application\Port\PaymentGatewayPort:
        class: App\Infrastructure\Payment\FakePaymentGateway
```

**Résultat attendu** :

```text
En production :
  OrderRepositoryPort → DoctrineOrderRepository (PostgreSQL)
  PaymentGatewayPort → StripePaymentGateway (Stripe API)

En test :
  OrderRepositoryPort → InMemoryOrderRepository (mémoire)
  PaymentGatewayPort → FakePaymentGateway (pas de vrai paiement)

Le Use Case PlaceOrder ne change pas du tout.
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:autowiring Port` | Vérifier les ports et leurs adapters |
| `php bin/console debug:container --types` | Voir les types enregistrés |
| `vendor/bin/phpunit tests/Application/` | Tester les use cases (sans infra) |
| `vendor/bin/phpstan analyse src/Domain/` | Vérifier que le domain n'a pas de dépendances externes |

---

## Pièges Fréquents

### Piège 1 : Annotations Doctrine dans les entités métier

**Problème** : Tu mets des annotations `#[ORM\Entity]` dans les entités du dossier `Domain/`. Cela crée une dépendance de la couche métier vers Doctrine (couche infrastructure).

**Solution** : Utilise le mapping XML ou YAML de Doctrine, dans un fichier séparé (`Infrastructure/Mapping/`).

```text
❌ Dependance vers Doctrine dans le Domain :
  Domain/Entity/Order.php avec #[ORM\Entity]

✅ Mapping separe :
  Domain/Entity/Order.php (PHP pur)
  Infrastructure/Mapping/Order.orm.xml (mapping Doctrine)
```

### Piège 2 : Trop de couches pour un projet simple

**Problème** : Tu appliques Clean Architecture sur un CRUD simple de 5 entités. Tu te retrouves avec 50 fichiers au lieu de 15.

**Solution** : Clean Architecture est utile quand la logique métier est complexe. Pour un CRUD simple, MVC classique avec des services suffit. Applique Clean Architecture graduellement, quand le projet grandit.

### Piège 3 : Le Use Case qui connaît Symfony

**Problème** : Tu importes `Request`, `Response` ou `EntityManagerInterface` dans un Use Case.

**Solution** : Le Use Case ne doit dépendre que des entités métier et des ports (interfaces). Tout le reste est dans la couche infrastructure.

```php
// ❌ Use Case qui depend de Symfony
use Symfony\Component\HttpFoundation\Request;

class PlaceOrder
{
    public function execute(Request $request) { } // ❌
}

// ✅ Use Case qui depend d'un DTO
use App\Application\DTO\PlaceOrderRequest;

class PlaceOrder
{
    public function execute(PlaceOrderRequest $request) { } // ✅
}
```

---

## Checklist de Validation

- [ ] Je sais nommer les 4 couches de Clean Architecture
- [ ] Je comprends la règle de dépendance (vers l'intérieur uniquement)
- [ ] Je sais créer une entité métier pure (sans Doctrine, sans Symfony)
- [ ] Je sais créer un Use Case qui orchestre la logique métier
- [ ] Je sais définir un port (interface) et créer un adapter (implémentation)
- [ ] Je sais configurer les ports dans `services.yaml`
- [ ] Je comprends quand Clean Architecture est utile et quand c'est excessif

---

## Exercice Pratique

**Énoncé** : Implémente une fonctionnalité "annuler une commande" en Clean Architecture.

**Instructions** :

1. Ajoute une méthode `cancel()` dans l'entité `Order` (Domain)
2. Crée un Use Case `CancelOrder` avec un DTO d'entrée et de sortie (Application)
3. Crée le contrôleur correspondant (Infrastructure)
4. Écris un test du Use Case avec un repository en mémoire

**Résultat attendu** : Le Use Case est testable sans Symfony et sans base de données.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Entité métier** (`Domain/Entity/Order.php` - ajout de `cancel()`) :

```php
<?php

// Ajout dans la classe Order existante
public function cancel(): void
{
    // Regle metier : on ne peut annuler que si la commande est pending ou confirmed
    if (!in_array($this->status, ['pending', 'confirmed'])) {
        throw new \DomainException(
            "Impossible d'annuler une commande avec le statut : {$this->status}"
        );
    }

    $this->status = 'cancelled';
}
```

**2. DTO** :

```php
<?php

namespace App\Application\DTO;

class CancelOrderRequest
{
    public function __construct(
        public readonly string $orderId,
        public readonly string $reason,
    ) {
    }
}

class CancelOrderResponse
{
    public function __construct(
        public readonly bool $success,
        public readonly ?string $errorMessage = null,
    ) {
    }
}
```

**3. Use Case** :

```php
<?php

namespace App\Application\UseCase;

use App\Application\DTO\CancelOrderRequest;
use App\Application\DTO\CancelOrderResponse;
use App\Application\Port\OrderRepositoryPort;

class CancelOrder
{
    public function __construct(
        private OrderRepositoryPort $repository,
    ) {
    }

    public function execute(CancelOrderRequest $request): CancelOrderResponse
    {
        $order = $this->repository->findById($request->orderId);

        if (!$order) {
            return new CancelOrderResponse(
                success: false,
                errorMessage: 'Commande non trouvee',
            );
        }

        try {
            $order->cancel();
        } catch (\DomainException $e) {
            return new CancelOrderResponse(
                success: false,
                errorMessage: $e->getMessage(),
            );
        }

        $this->repository->save($order);

        return new CancelOrderResponse(success: true);
    }
}
```

**4. Test sans infrastructure** :

```php
<?php

namespace Tests\Application\UseCase;

use App\Application\DTO\CancelOrderRequest;
use App\Application\UseCase\CancelOrder;
use App\Domain\Entity\Order;
use App\Infrastructure\Persistence\InMemoryOrderRepository;
use PHPUnit\Framework\TestCase;

class CancelOrderTest extends TestCase
{
    public function testCancelPendingOrder(): void
    {
        // Arrange : creer un repository en memoire avec une commande
        $repo = new InMemoryOrderRepository();
        $order = new Order('cust_1', new \DateTimeImmutable());
        $order->addItem('prod_1', 1, 10.00);
        $repo->save($order);

        $useCase = new CancelOrder($repo);

        // Act : annuler la commande
        $response = $useCase->execute(new CancelOrderRequest(
            orderId: $order->getId(),
            reason: 'Changement avis',
        ));

        // Assert
        $this->assertTrue($response->success);
        $this->assertSame('cancelled', $order->getStatus());
    }

    public function testCannotCancelShippedOrder(): void
    {
        $repo = new InMemoryOrderRepository();
        $order = new Order('cust_1', new \DateTimeImmutable());
        $order->addItem('prod_1', 1, 10.00);
        $order->confirm();
        // Simuler une expedition (via reflexion ou methode de test)
        $repo->save($order);

        $useCase = new CancelOrder($repo);

        $response = $useCase->execute(new CancelOrderRequest(
            orderId: $order->getId(),
            reason: 'Trop tard',
        ));

        // La commande confirmee peut etre annulee
        $this->assertTrue($response->success);
    }
}
```

---

## Navigation

← Fiche précédente : **[MVC en profondeur](07-mvc-profondeur.md)**

→ Fiche suivante : **[Introduction au DDD](09-introduction-ddd.md)**
