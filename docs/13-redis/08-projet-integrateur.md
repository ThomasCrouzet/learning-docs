---
tags:
  - Redis
  - Avancé
  - Projet
description: "Projet intégrateur : ajouter Redis à une application Symfony pour le cache, les sessions et les messages asynchrones"
estimated_time: "90 min"
fiche_number: 8
total_fiches: 8
cursus: "Redis et Cache"
---

# 08 - Projet intégrateur

> **En bref** : Ce projet met en pratique tout ce que tu as appris dans ce cursus. Tu vas ajouter Redis à une application Symfony existante pour optimiser les performances avec le cache, les sessions et le traitement asynchrone. Lecture estimée : 90 min.

## Prérequis

- Toutes les fiches précédentes du cursus Redis (01 à 07)
- Un projet Symfony fonctionnel avec Docker Compose, Doctrine et PostgreSQL
- Comprendre les services, les contrôleurs et les entités Symfony

## Version utilisée dans cette fiche

| Technologie | Version |
| ----------- | ------- |
| Redis | 7.x |
| Symfony | 7.4 LTS |
| PHP | 8.3 |
| PostgreSQL | 16 |

## Objectif de cette fiche

À la fin de cette fiche, tu auras intégré Redis dans une application Symfony complète avec : un cache des requêtes API, des sessions Redis, un worker Messenger pour les tâches asynchrones, et tu sauras mesurer l'impact sur les performances.

---

## Concepts

Cette section explique les concepts spécifiques au projet intégrateur. Les concepts fondamentaux ont été couverts dans les fiches précédentes.

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur combine toutes les compétences acquises dans un cursus pour résoudre un problème concret et réaliste. Il ne s'agit pas d'apprendre de nouveaux concepts, mais de mettre en pratique les concepts existants ensemble.

**Analogie concrète** : Imagine que tu as appris séparément à couper des légumes, cuire de la viande, préparer une sauce et dresser une assiette. Le projet intégrateur, c'est le moment où tu prépares un repas complet en combinant toutes ces techniques dans le bon ordre, du début à la fin.

**Ce que tu vas construire** :

Une application web Symfony qui gère un catalogue de produits avec :

1. **Cache Redis** pour les listes de produits et les fiches produit (fiche 04 et 06)
2. **Sessions Redis** pour le panier d'achat (fiche 05)
3. **Messages asynchrones** pour l'envoi d'e-mails et la génération de factures (fiche 07)
4. **Mesure des performances** pour comparer les temps de réponse avec et sans Redis

---

### Architecture de l'application

Le diagramme suivant montre l'architecture complète de l'application avec les trois usages de Redis.

```mermaid
graph TD
    browser[Navigateur] --> symfony[Symfony]
    symfony --> cache[Redis<br>Cache applicatif]
    symfony --> sessions[Redis<br>Sessions]
    symfony --> messenger[Redis<br>Messages async]
    symfony --> postgres[(PostgreSQL)]
    messenger --> worker[Worker]
```

**Schéma** :

```text
┌─────────────────────────────────────────────────────────────┐
│                         Docker Compose                       │
│                                                              │
│  ┌──────────┐    ┌──────────┐    ┌──────────┐               │
│  │   Nginx   │    │  PHP-FPM  │    │  Redis   │               │
│  │  (port 80)│───→│ (Symfony) │───→│ (port    │               │
│  └──────────┘    └──────────┘    │  6379)   │               │
│                       │          └──────────┘               │
│                       │                                      │
│                       │          ┌──────────────┐           │
│                       └─────────→│  PostgreSQL   │           │
│                                  │  (port 5432)  │           │
│                                  └──────────────┘           │
│                                                              │
│  ┌──────────────────┐                                        │
│  │  Worker Messenger │───→ Redis (lit les messages)          │
│  │  (processus CLI)  │                                       │
│  └──────────────────┘                                        │
└─────────────────────────────────────────────────────────────┘
```

**Rôle de chaque service** :

| Service | Rôle |
| ------- | ---- |
| Nginx | Reçoit les requêtes HTTP et les transmet à PHP-FPM |
| PHP-FPM | Exécute l'application Symfony |
| Redis | Cache, sessions, transport Messenger |
| PostgreSQL | Base de données relationnelle (source de vérité) |
| Worker | Processus qui traite les messages asynchrones |

---

### Mesurer les performances

**Définition** : Mesurer les performances te permet de quantifier l'impact de Redis sur ton application. Sans mesure, tu ne sais pas si le cache est efficace.

**Analogie concrète** : Quand tu réorganises ta cuisine pour gagner du temps, tu chronométres le temps de préparation d'un repas avant et après la réorganisation. Sans chronométrage, tu ne sais pas si le changement a réellement amélioré les choses ou si c'est juste une impression.

**Métriques à mesurer** :

| Métrique | Sans Redis | Avec Redis | Comment mesurer |
| -------- | ---------- | ---------- | --------------- |
| Temps de réponse d'une page | 200-500 ms | 5-20 ms | Profiler Symfony |
| Nombre de requêtes SQL par page | 5-20 | 0-2 | Profiler Symfony |
| Temps de chargement moyen | Variable | Stable | Barre de debug Symfony |
| Mémoire utilisée par Redis | 0 Mo | 5-50 Mo | `INFO memory` dans redis-cli |

---

## Étapes Pratiques

### Étape 1 : Préparer le Docker Compose

Crée un fichier `docker-compose.yml` complet avec tous les services :

```yaml
# docker-compose.yml

services:
  # Serveur web Nginx
  nginx:
    image: nginx:1.26-alpine
    ports:
      - "8080:80"
    volumes:
      - ./:/var/www/html
      - ./docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - php

  # PHP-FPM avec les extensions nécessaires
  php:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    volumes:
      - ./:/var/www/html
    depends_on:
      - database
      - redis

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
      - db_data:/var/lib/postgresql/data

  # Redis pour le cache, les sessions et Messenger
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    # Active la persistance AOF pour les sessions
    command: redis-server --appendonly yes --maxmemory 100mb --maxmemory-policy allkeys-lru

  # Worker Messenger
  worker:
    build:
      context: .
      dockerfile: docker/php/Dockerfile
    # Le worker tourne en continu et consomme les messages
    command: php bin/console messenger:consume async --time-limit=3600 --memory-limit=128
    volumes:
      - ./:/var/www/html
    depends_on:
      - redis
      - database
    # Redémarre le worker s'il s'arrête
    restart: unless-stopped

volumes:
  db_data:
  redis_data:
```

**Explications des options Redis** :

| Option | Rôle |
| ------ | ---- |
| `--appendonly yes` | Persistance AOF (pour les sessions) |
| `--maxmemory 100mb` | Limite la mémoire à 100 Mo |
| `--maxmemory-policy allkeys-lru` | Quand la mémoire est pleine, supprime les clés les moins récemment utilisées |

⚠️ **Attention (sessions + messages + cache partagés)** : `allkeys-lru` peut supprimer des sessions actives et des messages Messenger encore en attente dès que la limite mémoire est atteinte. C'est acceptable pour un lab local avec peu de données. En production, sépare au minimum le cache (politique d'éviction agressive) des sessions et des files Messenger (politique `noeviction`, ou une instance Redis dédiée).

---

### Étape 2 : Créer le Dockerfile PHP

```dockerfile
# docker/php/Dockerfile

FROM php:8.3-fpm-alpine

# Installe les extensions PHP nécessaires
RUN apk add --no-cache \
    # Extension PostgreSQL
    postgresql-dev \
    # Extension Redis
    && docker-php-ext-install pdo pdo_pgsql \
    # Installe l'extension Redis via PECL
    && apk add --no-cache --virtual .build-deps autoconf g++ make \
    && pecl install redis \
    && docker-php-ext-enable redis \
    && apk del .build-deps

# Installe Composer (pin majeures 2.x, évite les surprises de composer:latest)
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html
```

---

### Étape 3 : Configurer le fichier .env

```env
# .env

# Base de données PostgreSQL
DATABASE_URL="postgresql://app:secret@database:5432/app?serverVersion=16&charset=utf8"

# Redis
REDIS_URL=redis://redis:6379
REDIS_HOST=redis
REDIS_PORT=6379

# Messenger (transport Redis)
MESSENGER_TRANSPORT_DSN=redis://redis:6379/messages
```

---

### Étape 4 : Configurer le cache avec Redis

```yaml
# config/packages/cache.yaml

framework:
    cache:
        # Le cache applicatif utilise Redis
        app: cache.adapter.redis
        # URL de connexion Redis
        default_redis_provider: '%env(REDIS_URL)%'

        # Pools spécialisés
        pools:
            # Pool pour les produits avec support des tags
            cache.products:
                adapter: cache.adapter.redis_tag_aware
                default_lifetime: 1800  # 30 minutes

            # Pool pour les statistiques
            cache.stats:
                adapter: cache.adapter.redis
                default_lifetime: 300  # 5 minutes
```

---

### Étape 5 : Configurer les sessions avec Redis

```yaml
# config/packages/framework.yaml

framework:
    session:
        handler_id: '%env(REDIS_URL)%'
        gc_maxlifetime: 1800    # 30 minutes
        cookie_secure: auto
        cookie_httponly: true
        cookie_samesite: lax
```

---

### Étape 6 : Configurer Messenger avec Redis

Installe Messenger et le pont Redis (le DSN `redis://` ne fonctionne pas sans le pont) :

```bash
composer require symfony/messenger symfony/redis-messenger
```

Le transport Redis de Messenger exige l'extension PHP `redis` (phpredis), déjà installée dans le Dockerfile de l'étape 2. `predis/predis` ne convient pas pour ce transport.

```yaml
# config/packages/messenger.yaml

framework:
    messenger:
        transports:
            async:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                retry_strategy:
                    max_retries: 3
                    delay: 1000
                    multiplier: 2
                    max_delay: 60000

            failed:
                dsn: '%env(MESSENGER_TRANSPORT_DSN)%'
                options:
                    stream: 'symfony_messenger_failed'

        failure_transport: failed

        routing:
            'App\Message\SendOrderConfirmation': async
            'App\Message\GenerateInvoicePdf': async
            'App\Message\UpdateProductStats': async
```

---

### Étape 7 : Créer les entités

```php
<?php
// src/Entity/Product.php

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

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column]
    private float $price;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private int $stock = 0;

    #[ORM\Column]
    private int $views = 0;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters et setters
    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): self { $this->name = $name; return $this; }
    public function getPrice(): float { return $this->price; }
    public function setPrice(float $price): self { $this->price = $price; return $this; }
    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self { $this->description = $description; return $this; }
    public function getStock(): int { return $this->stock; }
    public function setStock(int $stock): self { $this->stock = $stock; return $this; }
    public function getViews(): int { return $this->views; }
    public function setViews(int $views): self { $this->views = $views; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

---

### Étape 8 : Créer le service de cache produit

```php
<?php
// src/Service/ProductCacheService.php

namespace App\Service;

use App\Repository\ProductRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\ItemInterface;
use Symfony\Contracts\Cache\TagAwareCacheInterface;

class ProductCacheService
{
    public function __construct(
        #[Autowire(service: 'cache.products')]
        private TagAwareCacheInterface $cache,
        private ProductRepository $productRepository,
    ) {
    }

    // Cache-aside pour la liste des produits
    public function getAllProducts(): array
    {
        return $this->cache->get('all_products', function (ItemInterface $item) {
            $item->expiresAfter(1800);
            $item->tag(['products']);

            $products = $this->productRepository->findBy([], ['createdAt' => 'DESC']);

            return array_map(fn($p) => [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'price' => $p->getPrice(),
                'stock' => $p->getStock(),
            ], $products);
        });
    }

    // Cache-aside pour un produit individuel
    public function getProduct(int $id): ?array
    {
        return $this->cache->get("product_{$id}", function (ItemInterface $item) use ($id) {
            $item->expiresAfter(1800);
            $item->tag(['products', "product_{$id}"]);

            $product = $this->productRepository->find($id);

            if (!$product) {
                return null;
            }

            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
                'price' => $product->getPrice(),
                'description' => $product->getDescription(),
                'stock' => $product->getStock(),
                'views' => $product->getViews(),
                'createdAt' => $product->getCreatedAt()->format('Y-m-d'),
            ];
        });
    }

    // Invalide tout le cache produit
    public function invalidateAll(): void
    {
        $this->cache->invalidateTags(['products']);
    }

    // Invalide le cache d'un produit spécifique
    public function invalidateProduct(int $id): void
    {
        $this->cache->invalidateTags(['products', "product_{$id}"]);
    }
}
```

---

### Étape 9 : Créer le service de compteur de vues

```php
<?php
// src/Service/ViewCounterService.php

namespace App\Service;

class ViewCounterService
{
    public function __construct(
        private \Redis $redis,
    ) {
    }

    // Write-behind : incrémente dans Redis (rapide)
    public function incrementViews(int $productId): int
    {
        return (int) $this->redis->incr("views:product:{$productId}");
    }

    // Lecture du compteur depuis Redis
    public function getViews(int $productId): int
    {
        return (int) $this->redis->get("views:product:{$productId}");
    }

    // Récupère les vues de plusieurs produits
    public function getMultipleViews(array $productIds): array
    {
        if (empty($productIds)) {
            return [];
        }

        $keys = array_map(fn(int $id) => "views:product:{$id}", $productIds);
        $values = $this->redis->mget($keys);

        $result = [];
        foreach ($productIds as $index => $id) {
            $result[$id] = (int) ($values[$index] ?? 0);
        }

        return $result;
    }
}
```

---

### Étape 10 : Créer le service panier (sessions)

```php
<?php
// src/Service/CartService.php

namespace App\Service;

use Symfony\Component\HttpFoundation\RequestStack;

class CartService
{
    // Clé utilisée dans la session pour stocker le panier
    private const CART_KEY = 'cart';

    public function __construct(
        private RequestStack $requestStack,
    ) {
    }

    // Récupère le panier depuis la session Redis
    public function getCart(): array
    {
        return $this->getSession()->get(self::CART_KEY, []);
    }

    // Ajoute un produit au panier
    public function addProduct(int $productId, int $quantity = 1): void
    {
        $cart = $this->getCart();

        // Incrémente la quantité si le produit est déjà dans le panier
        $cart[$productId] = ($cart[$productId] ?? 0) + $quantity;

        $this->getSession()->set(self::CART_KEY, $cart);
    }

    // Retire un produit du panier
    public function removeProduct(int $productId): void
    {
        $cart = $this->getCart();
        unset($cart[$productId]);
        $this->getSession()->set(self::CART_KEY, $cart);
    }

    // Met à jour la quantité d'un produit
    public function updateQuantity(int $productId, int $quantity): void
    {
        $cart = $this->getCart();

        if ($quantity <= 0) {
            unset($cart[$productId]);
        } else {
            $cart[$productId] = $quantity;
        }

        $this->getSession()->set(self::CART_KEY, $cart);
    }

    // Vide le panier
    public function clear(): void
    {
        $this->getSession()->remove(self::CART_KEY);
    }

    // Nombre total d'articles dans le panier
    public function getTotalItems(): int
    {
        return array_sum($this->getCart());
    }

    // Nombre de produits distincts
    public function getProductCount(): int
    {
        return count($this->getCart());
    }

    private function getSession(): \Symfony\Component\HttpFoundation\Session\SessionInterface
    {
        return $this->requestStack->getSession();
    }
}
```

---

### Étape 11 : Créer les messages Messenger

```php
<?php
// src/Message/SendOrderConfirmation.php

namespace App\Message;

class SendOrderConfirmation
{
    public function __construct(
        private string $email,
        private int $orderId,
        private float $totalAmount,
    ) {
    }

    public function getEmail(): string { return $this->email; }
    public function getOrderId(): int { return $this->orderId; }
    public function getTotalAmount(): float { return $this->totalAmount; }
}
```

```php
<?php
// src/Message/GenerateInvoicePdf.php

namespace App\Message;

class GenerateInvoicePdf
{
    public function __construct(
        private int $orderId,
    ) {
    }

    public function getOrderId(): int { return $this->orderId; }
}
```

```php
<?php
// src/Message/UpdateProductStats.php

namespace App\Message;

class UpdateProductStats
{
    public function __construct(
        private int $productId,
        private int $views,
    ) {
    }

    public function getProductId(): int { return $this->productId; }
    public function getViews(): int { return $this->views; }
}
```

---

### Étape 12 : Créer les handlers

```php
<?php
// src/MessageHandler/SendOrderConfirmationHandler.php

namespace App\MessageHandler;

use App\Message\SendOrderConfirmation;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class SendOrderConfirmationHandler
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(SendOrderConfirmation $message): void
    {
        // En production : utilise MailerInterface pour envoyer un vrai e-mail
        // Ici on simule en loguant l'action
        $this->logger->info('E-mail de confirmation envoyé', [
            'email' => $message->getEmail(),
            'order_id' => $message->getOrderId(),
            'total' => $message->getTotalAmount(),
        ]);
    }
}
```

```php
<?php
// src/MessageHandler/GenerateInvoicePdfHandler.php

namespace App\MessageHandler;

use App\Message\GenerateInvoicePdf;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class GenerateInvoicePdfHandler
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(GenerateInvoicePdf $message): void
    {
        // En production : génère un PDF avec une bibliothèque comme Dompdf
        // Ici on simule la génération
        $this->logger->info('Facture PDF générée', [
            'order_id' => $message->getOrderId(),
        ]);

        // Simule un temps de traitement (2 secondes)
        sleep(2);

        $this->logger->info('Facture PDF sauvegardée', [
            'order_id' => $message->getOrderId(),
            'path' => "/var/www/html/var/invoices/invoice_{$message->getOrderId()}.pdf",
        ]);
    }
}
```

```php
<?php
// src/MessageHandler/UpdateProductStatsHandler.php

namespace App\MessageHandler;

use App\Message\UpdateProductStats;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\Messenger\Attribute\AsMessageHandler;

#[AsMessageHandler]
class UpdateProductStatsHandler
{
    public function __construct(
        private ProductRepository $productRepository,
        private EntityManagerInterface $em,
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(UpdateProductStats $message): void
    {
        // Write-behind : met à jour les vues en base de données
        $product = $this->productRepository->find($message->getProductId());

        if (!$product) {
            return;
        }

        // Met à jour les vues en base
        $product->setViews($product->getViews() + $message->getViews());
        $this->em->flush();

        $this->logger->info('Statistiques produit mises à jour', [
            'product_id' => $message->getProductId(),
            'new_views' => $message->getViews(),
            'total_views' => $product->getViews(),
        ]);
    }
}
```

---

### Étape 13 : Créer les contrôleurs

```php
<?php
// src/Controller/ProductController.php

namespace App\Controller;

use App\Service\ProductCacheService;
use App\Service\ViewCounterService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    public function __construct(
        private ProductCacheService $productCacheService,
        private ViewCounterService $viewCounterService,
    ) {
    }

    // Liste des produits (cache Redis)
    #[Route('', name: 'product_list')]
    public function list(): Response
    {
        // Servi depuis Redis si le cache existe
        $products = $this->productCacheService->getAllProducts();

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }

    // Détail d'un produit (cache Redis + compteur de vues)
    #[Route('/{id}', name: 'product_show', requirements: ['id' => '\d+'])]
    public function show(int $id): Response
    {
        // Servi depuis Redis si le cache existe
        $product = $this->productCacheService->getProduct($id);

        if (!$product) {
            throw $this->createNotFoundException('Produit non trouvé.');
        }

        // Incrémente le compteur de vues dans Redis (write-behind)
        $views = $this->viewCounterService->incrementViews($id);

        // Ajoute le compteur Redis au produit
        $product['live_views'] = $views;

        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}
```

```php
<?php
// src/Controller/CartController.php

namespace App\Controller;

use App\Message\GenerateInvoicePdf;
use App\Message\SendOrderConfirmation;
use App\Service\CartService;
use App\Service\ProductCacheService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Messenger\MessageBusInterface;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/cart')]
class CartController extends AbstractController
{
    public function __construct(
        private CartService $cartService,
        private ProductCacheService $productCacheService,
    ) {
    }

    // Affiche le panier (session Redis)
    #[Route('', name: 'cart_show')]
    public function show(): Response
    {
        $cart = $this->cartService->getCart();
        $products = [];

        foreach ($cart as $productId => $quantity) {
            $product = $this->productCacheService->getProduct($productId);
            if ($product) {
                $product['quantity'] = $quantity;
                $product['subtotal'] = $product['price'] * $quantity;
                $products[] = $product;
            }
        }

        $total = array_sum(array_column($products, 'subtotal'));

        return $this->render('cart/show.html.twig', [
            'products' => $products,
            'total' => $total,
            'itemCount' => $this->cartService->getTotalItems(),
        ]);
    }

    // Ajoute un produit au panier
    #[Route('/add/{id}', name: 'cart_add', requirements: ['id' => '\d+'])]
    public function add(int $id): Response
    {
        $this->cartService->addProduct($id);
        $this->addFlash('success', 'Produit ajouté au panier.');

        return $this->redirectToRoute('cart_show');
    }

    // Retire un produit du panier
    #[Route('/remove/{id}', name: 'cart_remove', requirements: ['id' => '\d+'])]
    public function remove(int $id): Response
    {
        $this->cartService->removeProduct($id);
        $this->addFlash('success', 'Produit retiré du panier.');

        return $this->redirectToRoute('cart_show');
    }

    // Vide le panier
    #[Route('/clear', name: 'cart_clear')]
    public function clear(): Response
    {
        $this->cartService->clear();
        $this->addFlash('success', 'Panier vidé.');

        return $this->redirectToRoute('cart_show');
    }

    // Valide la commande (dispatch des messages asynchrones)
    #[Route('/checkout', name: 'cart_checkout')]
    public function checkout(MessageBusInterface $bus): Response
    {
        $cart = $this->cartService->getCart();

        if (empty($cart)) {
            $this->addFlash('warning', 'Le panier est vide.');
            return $this->redirectToRoute('cart_show');
        }

        // Calcule le total
        $total = 0;
        foreach ($cart as $productId => $quantity) {
            $product = $this->productCacheService->getProduct($productId);
            if ($product) {
                $total += $product['price'] * $quantity;
            }
        }

        // Simule un ID de commande
        $orderId = random_int(1000, 9999);

        // 1. Dispatch l'e-mail de confirmation (asynchrone)
        $bus->dispatch(new SendOrderConfirmation(
            email: 'client@example.com',
            orderId: $orderId,
            totalAmount: $total,
        ));

        // 2. Dispatch la génération de la facture PDF (asynchrone)
        $bus->dispatch(new GenerateInvoicePdf(
            orderId: $orderId,
        ));

        // 3. Vide le panier
        $this->cartService->clear();

        $this->addFlash('success', sprintf(
            'Commande #%d validée (%.2f €). Un e-mail de confirmation va être envoyé.',
            $orderId,
            $total
        ));

        return $this->redirectToRoute('product_list');
    }
}
```

---

### Étape 14 : Créer la commande de synchronisation des vues

```php
<?php
// src/Command/SyncViewsCommand.php

namespace App\Command;

use App\Message\UpdateProductStats;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\Messenger\MessageBusInterface;

#[AsCommand(
    name: 'app:sync-views',
    description: 'Synchronise les compteurs de vues Redis vers PostgreSQL',
)]
class SyncViewsCommand extends Command
{
    public function __construct(
        private \Redis $redis,
        private MessageBusInterface $bus,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Synchronisation des compteurs de vues');

        $cursor = null;
        $synced = 0;

        // Parcours toutes les clés de compteurs de vues
        do {
            $keys = $this->redis->scan($cursor, 'views:product:*', 100);

            if ($keys !== false) {
                foreach ($keys as $key) {
                    // Extraire l'ID du produit
                    $productId = (int) str_replace('views:product:', '', $key);

                    // Lire la valeur et remettre à zéro atomiquement
                    // set() avec l'option 'GET' retourne l'ancienne valeur avant de l'écraser
                    $views = (int) $this->redis->set($key, '0', ['GET']);

                    if ($views > 0) {
                        // Dispatch un message asynchrone pour la mise à jour en base
                        $this->bus->dispatch(new UpdateProductStats(
                            productId: $productId,
                            views: $views,
                        ));

                        $io->info(sprintf(
                            'Produit #%d : %d vues à synchroniser',
                            $productId,
                            $views
                        ));

                        $synced++;
                    }
                }
            }
        } while ($cursor > 0);

        $io->success(sprintf('%d compteurs synchronisés.', $synced));

        return Command::SUCCESS;
    }
}
```

---

### Étape 15 : Créer la commande de diagnostic Redis

```php
<?php
// src/Command/RedisDiagnosticCommand.php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:redis:diagnostic',
    description: 'Affiche un diagnostic complet de Redis',
)]
class RedisDiagnosticCommand extends Command
{
    public function __construct(
        private \Redis $redis,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Diagnostic Redis');

        // 1. Connexion
        try {
            $pong = $this->redis->ping();
            $io->success('Connexion Redis : OK');
        } catch (\Exception $e) {
            $io->error('Connexion Redis : ÉCHEC - ' . $e->getMessage());
            return Command::FAILURE;
        }

        // 2. Informations serveur
        $info = $this->redis->info();
        $io->section('Serveur');
        $io->listing([
            'Version : ' . ($info['redis_version'] ?? 'inconnue'),
            'Uptime : ' . ($info['uptime_in_seconds'] ?? 0) . ' secondes',
            'Clients connectés : ' . ($info['connected_clients'] ?? 0),
        ]);

        // 3. Mémoire
        $io->section('Mémoire');
        $io->listing([
            'Utilisée : ' . ($info['used_memory_human'] ?? 'inconnue'),
            'Pic : ' . ($info['used_memory_peak_human'] ?? 'inconnu'),
            'Fragmentation : ' . ($info['mem_fragmentation_ratio'] ?? 'inconnue'),
        ]);

        // 4. Clés
        $io->section('Clés');
        $dbSize = $this->redis->dbSize();
        $io->listing([
            "Nombre total de clés : {$dbSize}",
        ]);

        // Compter par type de clé
        $types = [
            'Cache produits' => 'cache:products:*',
            'Sessions' => 'sf_session:*',
            'Compteurs de vues' => 'views:product:*',
            'Messenger' => 'symfony_messenger*',
        ];

        foreach ($types as $label => $pattern) {
            $count = 0;
            $cursor = null;
            do {
                $keys = $this->redis->scan($cursor, $pattern, 100);
                if ($keys !== false) {
                    $count += count($keys);
                }
            } while ($cursor > 0);

            $io->listing(["  {$label} : {$count} clés"]);
        }

        // 5. Persistance
        $io->section('Persistance');
        $io->listing([
            'AOF activé : ' . (($info['aof_enabled'] ?? '0') === '1' ? 'Oui' : 'Non'),
            'RDB en cours : ' . (($info['rdb_bgsave_in_progress'] ?? '0') === '1' ? 'Oui' : 'Non'),
        ]);

        return Command::SUCCESS;
    }
}
```

---

### Étape 16 : Lancer et tester

```bash
# 1. Lance tous les services
docker compose up -d

# 2. Installe les dépendances PHP
docker compose exec php composer install

# 3. Crée la base de données
docker compose exec php php bin/console doctrine:database:create --if-not-exists
docker compose exec php php bin/console doctrine:migrations:migrate --no-interaction

# 4. Charge des données de test (si tu as des fixtures)
docker compose exec php php bin/console doctrine:fixtures:load --no-interaction

# 5. Vérifie que Redis est accessible
docker compose exec redis redis-cli PING
# PONG

# 6. Vérifie le diagnostic Redis
docker compose exec php php bin/console app:redis:diagnostic
```

---

### Étape 17 : Mesurer les performances

```bash
# Connecte-toi à redis-cli
docker compose exec redis redis-cli
```

```bash
# Avant de visiter une page (cache vide)
DBSIZE
# (integer) 0

# Visite la page /products dans le navigateur
# Puis vérifie
DBSIZE
# (integer) 1 (clé cache all_products créée)

# SCAN est non-bloquant, contrairement à KEYS (à préférer en production)
SCAN 0 COUNT 100
# 1) "0"    (curseur = 0 : itération terminée)
# 2) 1) "cache:products:all_products"

TTL "cache:products:all_products"
# (integer) ~1800

# Visite une page produit /products/1
DBSIZE
# (integer) 3 (cache produit + session + compteur de vues)

# Vérifie les informations mémoire
INFO memory
# used_memory_human: ~2M

# Quitte
QUIT
```

**Comparaison des performances** :

Pour mesurer l'impact, utilise la barre de debug Symfony (profiler) :

```text
Sans Redis (première visite, cache miss) :
  - Temps de réponse : ~200 ms
  - Requêtes SQL : 5-10
  - Mémoire PHP : ~15 Mo

Avec Redis (deuxième visite, cache hit) :
  - Temps de réponse : ~15 ms
  - Requêtes SQL : 0
  - Mémoire PHP : ~10 Mo
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `docker compose up -d` | Lance tous les services |
| `docker compose logs -f worker` | Suit les logs du worker Messenger |
| `docker compose exec redis redis-cli` | Ouvre redis-cli |
| `php bin/console app:redis:diagnostic` | Diagnostic complet de Redis |
| `php bin/console app:sync-views` | Synchronise les vues vers PostgreSQL |
| `php bin/console messenger:consume async -vv` | Lance un worker en mode verbeux |
| `php bin/console messenger:failed:show` | Liste les messages en échec |
| `php bin/console cache:pool:clear cache.products` | Vide le cache des produits |

---

## Pièges Fréquents

### Piège 1 : Le worker ne démarre pas dans Docker Compose

⚠️ **Problème** : Le service `worker` dans Docker Compose ne démarre pas ou redémarre en boucle parce que les migrations n'ont pas été exécutées ou que les dépendances ne sont pas installées.

✅ **Solution** : Installe les dépendances et exécute les migrations avant de lancer le worker. Tu peux aussi ajouter un script d'attente dans le service :

```yaml
worker:
    # ...
    # Attend que les dépendances soient prêtes
    command: >
        sh -c "
        while ! php bin/console doctrine:query:sql 'SELECT 1' > /dev/null 2>&1; do
            echo 'Waiting for database...'
            sleep 2
        done
        php bin/console messenger:consume async --time-limit=3600 --memory-limit=128
        "
```

---

### Piège 2 : Sessions et cache dans le même FLUSHDB

⚠️ **Problème** : Tu fais un `FLUSHDB` pour vider le cache et tu supprimes aussi les sessions. Tous les utilisateurs sont déconnectés.

✅ **Solution** : Utilise les pools Symfony pour vider uniquement le cache, pas les sessions :

```bash
# ✅ Vide uniquement le cache des produits
php bin/console cache:pool:clear cache.products

# ❌ Vide TOUT Redis (cache + sessions + messages)
# redis-cli FLUSHDB
```

---

### Piège 3 : Oublier de redémarrer les workers après un déploiement

⚠️ **Problème** : Tu déploies une nouvelle version du code. Les workers continuent d'exécuter l'ancien code car ils sont des processus longue durée.

✅ **Solution** : Redémarre les workers après chaque déploiement :

```bash
# Avec Docker Compose
docker compose restart worker

# Avec Supervisor
supervisorctl restart messenger-consume:*
```

---

### Piège 4 : Ne pas monitorer Redis en production

⚠️ **Problème** : Redis consomme de plus en plus de mémoire sans que tu t'en rendes compte. Un jour, Redis atteint la limite de mémoire et commence à supprimer des clés.

✅ **Solution** : Utilise la commande de diagnostic régulièrement et configure des alertes :

```bash
# Exécute le diagnostic régulièrement
php bin/console app:redis:diagnostic

# Ou vérifie manuellement
docker compose exec redis redis-cli INFO memory
```

---

## Checklist de Validation

- [ ] Mon Docker Compose contient PHP, PostgreSQL, Redis et un worker
- [ ] Le cache des produits est stocké dans Redis (je le vois dans redis-cli)
- [ ] Les sessions sont stockées dans Redis (clés `sf_session:*`)
- [ ] Le compteur de vues utilise Redis (clés `views:product:*`)
- [ ] Les messages Messenger passent par Redis
- [ ] Le worker traite les messages asynchrones
- [ ] La commande `app:sync-views` synchronise les vues vers PostgreSQL
- [ ] La commande `app:redis:diagnostic` affiche un rapport complet
- [ ] Les performances sont améliorées (moins de requêtes SQL, temps de réponse réduit)
- [ ] Je sais vider le cache sans supprimer les sessions

---

## Exercice Pratique

**Énoncé** : Complète l'application en ajoutant les fonctionnalités suivantes.

**Indications** :

- Ajoute un cache pour les résultats de recherche de produits avec un TTL de 5 minutes
- Crée une page "Tableau de bord" qui affiche :
  - Le nombre de produits en cache
  - Le nombre de sessions actives
  - Le nombre de messages en attente dans Messenger
  - La mémoire utilisée par Redis
- Ajoute un listener Doctrine qui invalide automatiquement le cache quand un produit est modifié
- Crée un CRON (commande Symfony) qui synchronise les vues toutes les 10 minutes
- Teste le scénario complet :
  1. Visite la liste des produits (cache miss → requête SQL)
  2. Revisite la liste (cache hit → pas de requête SQL)
  3. Ajoute des produits au panier (session Redis)
  4. Valide la commande (messages asynchrones)
  5. Vérifie que le worker traite les messages
  6. Modifie un produit (le cache est automatiquement invalidé)

**Résultat attendu** : L'application utilise Redis pour le cache, les sessions et les messages de manière transparente et performante.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Cache de recherche :

```php
<?php
// src/Service/SearchCacheService.php

namespace App\Service;

use App\Repository\ProductRepository;
use Symfony\Component\DependencyInjection\Attribute\Autowire;
use Symfony\Contracts\Cache\CacheInterface;
use Symfony\Contracts\Cache\ItemInterface;

class SearchCacheService
{
    public function __construct(
        #[Autowire(service: 'cache.stats')]
        private CacheInterface $cache,
        private ProductRepository $productRepository,
    ) {
    }

    public function search(string $query): array
    {
        // Normalise la clé de cache (supprime les espaces, met en minuscules)
        $cacheKey = 'search_' . md5(mb_strtolower(trim($query)));

        return $this->cache->get($cacheKey, function (ItemInterface $item) use ($query) {
            $item->expiresAfter(300); // 5 minutes

            // Requête SQL de recherche
            $results = $this->productRepository->createQueryBuilder('p')
                ->where('LOWER(p.name) LIKE :query')
                ->setParameter('query', '%' . mb_strtolower($query) . '%')
                ->getQuery()
                ->getResult();

            return array_map(fn($p) => [
                'id' => $p->getId(),
                'name' => $p->getName(),
                'price' => $p->getPrice(),
            ], $results);
        });
    }
}
```

Tableau de bord :

```php
<?php
// src/Controller/DashboardController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    public function __construct(
        private \Redis $redis,
    ) {
    }

    #[Route('/dashboard', name: 'dashboard')]
    public function index(): Response
    {
        // Mémoire Redis
        $info = $this->redis->info();
        $memory = $info['used_memory_human'] ?? 'inconnue';

        // Nombre de clés par type
        $stats = [
            'cache_products' => $this->countKeys('cache:products:*'),
            'sessions' => $this->countKeys('sf_session:*'),
            'views' => $this->countKeys('views:product:*'),
            'memory' => $memory,
            'total_keys' => $this->redis->dbSize(),
            'uptime' => ($info['uptime_in_seconds'] ?? 0),
        ];

        return $this->render('dashboard/index.html.twig', [
            'stats' => $stats,
        ]);
    }

    private function countKeys(string $pattern): int
    {
        $count = 0;
        $cursor = null;

        do {
            $keys = $this->redis->scan($cursor, $pattern, 100);
            if ($keys !== false) {
                $count += count($keys);
            }
        } while ($cursor > 0);

        return $count;
    }
}
```

Listener Doctrine :

```php
<?php
// src/EventListener/ProductCacheListener.php

namespace App\EventListener;

use App\Entity\Product;
use App\Service\ProductCacheService;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsEntityListener;
use Doctrine\ORM\Events;

#[AsEntityListener(event: Events::postUpdate, entity: Product::class)]
#[AsEntityListener(event: Events::postPersist, entity: Product::class)]
#[AsEntityListener(event: Events::postRemove, entity: Product::class)]
class ProductCacheListener
{
    public function __construct(
        private ProductCacheService $productCacheService,
    ) {
    }

    public function postUpdate(Product $product): void
    {
        $this->productCacheService->invalidateProduct($product->getId());
    }

    public function postPersist(Product $product): void
    {
        $this->productCacheService->invalidateAll();
    }

    public function postRemove(Product $product): void
    {
        $this->productCacheService->invalidateProduct($product->getId());
    }
}
```

Test du scénario complet :

```bash
# 1. Lance les services
docker compose up -d

# 2. Visite /products (cache miss)
# → Vérifie dans le profiler Symfony : requêtes SQL visibles

# 3. Revisite /products (cache hit)
# → Vérifie dans le profiler : 0 requêtes SQL

# 4. Vérifie dans Redis
docker compose exec redis redis-cli
# SCAN est non-bloquant, à préférer à KEYS en production
SCAN 0 COUNT 100
# cache:products:all_products
# sf_session:...

# 5. Ajoute au panier : visite /cart/add/1
# Vérifie la session
SCAN 0 MATCH sf_session:* COUNT 100

# 6. Valide la commande : visite /cart/checkout
# Vérifie les logs du worker
docker compose logs -f worker

# 7. Vérifie les statistiques
docker compose exec php php bin/console app:redis:diagnostic

# 8. Synchronise les vues
docker compose exec php php bin/console app:sync-views

QUIT
```

---

## Navigation

← Fiche précédente : **[Redis comme transport Messenger](07-redis-transport-messenger.md)**
