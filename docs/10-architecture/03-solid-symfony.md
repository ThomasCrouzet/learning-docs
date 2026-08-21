---
tags:
  - Architecture
  - Intermédiaire
  - Pratique
description: "Application des principes SOLID dans un projet Symfony : services, contrôleurs, repositories, event listeners."
estimated_time: "90 min"
fiche_number: 3
total_fiches: 17
cursus: "Architecture et Design Patterns"
id: "web.architecture.solid-symfony"
course_id: "web.architecture"
content_type: "lesson"
order: 3
---

# 03 - SOLID - Application dans Symfony

> **En bref** : Appliquer chaque principe SOLID dans Symfony avec des exemples concrets de refactoring : services, contrôleurs, repositories et event listeners. Lecture estimée : 90 min.

## Prérequis

- Fiche 1 : [Introduction aux design patterns](01-introduction-design-patterns.md)
- Fiche 2 : [SOLID - Principes fondamentaux](02-solid-principes.md)
- [Cursus Symfony](../03-symfony/index.md), au moins jusqu'à la fiche 13 (services)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer les 5 principes SOLID dans un projet Symfony réel, refactorer un contrôleur trop chargé et structurer tes services correctement.

---

## Concepts

### SOLID et Symfony : un mariage naturel

**Définition** : Symfony est conçu autour des principes SOLID. Le conteneur de services, l'autowiring et le système d'événements facilitent l'application de ces principes.

**Le problème que SOLID résout dans Symfony** :

Sans SOLID dans Symfony, voici les problèmes rencontrés :

1. **Contrôleurs obèses** : un contrôleur qui fait 500 lignes avec la validation, la logique métier, les requêtes SQL et l'envoi d'emails.
2. **Services monolithiques** : un `UserService` qui gère la création, la mise à jour, la suppression, l'envoi d'emails et les statistiques.
3. **Tests impossibles** : les contrôleurs appellent directement Doctrine, rendant les tests unitaires impossibles sans base de données.

**Comment Symfony facilite SOLID** :

| Principe SOLID | Fonctionnalité Symfony correspondante |
| --- | --- |
| SRP | Services dédiés, autowiring pour les injecter |
| OCP | Tags de services, event listeners, voters |
| LSP | Interfaces des composants (FormTypeInterface, VoterInterface) |
| ISP | Interfaces granulaires (LoggerInterface, CacheInterface) |
| DIP | Autowiring par interface, configuration des services |

**Analogie concrète** : Symfony est comme un immeuble bien conçu. Chaque appartement (service) a son propre compteur d'eau et d'électricité (dépendances). Le syndic (conteneur de services) gère les connexions entre les appartements. Si tu changes le fournisseur d'électricité (implémentation), les appartements ne s'en rendent pas compte.

---

### SRP dans Symfony : contrôleurs minces

**Définition** : Dans Symfony, le principe SRP s'applique d'abord aux contrôleurs. Un contrôleur doit être un "chef d'orchestre" : il reçoit la requête, délègue le travail aux services et retourne la réponse.

**Le problème des contrôleurs obèses** :

```php
<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// ❌ VIOLATION SRP : le controleur fait TOUT
class ProductController extends AbstractController
{
    #[Route('/product/create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
    ): Response {
        // Responsabilite 1 : extraction des donnees
        $name = $request->request->get('name');
        $price = (float) $request->request->get('price');

        // Responsabilite 2 : validation metier
        if (empty($name)) {
            return $this->json(['error' => 'Nom requis'], 400);
        }
        if ($price <= 0) {
            return $this->json(['error' => 'Prix invalide'], 400);
        }
        if ($price > 10000) {
            return $this->json(['error' => 'Prix trop eleve'], 400);
        }

        // Responsabilite 3 : verification unicite
        $existing = $em->getRepository(Product::class)
            ->findOneBy(['name' => $name]);
        if ($existing) {
            return $this->json(['error' => 'Produit deja existant'], 409);
        }

        // Responsabilite 4 : creation de l'entite
        $product = new Product();
        $product->setName($name);
        $product->setPrice($price);
        $product->setSlug(strtolower(str_replace(' ', '-', $name)));
        $product->setCreatedAt(new \DateTimeImmutable());

        // Responsabilite 5 : persistance
        $em->persist($product);
        $em->flush();

        // Responsabilite 6 : notification
        mail('admin@shop.com', 'Nouveau produit', "Produit : $name");

        // Responsabilite 7 : log
        file_put_contents(
            '/var/log/products.log',
            date('Y-m-d H:i:s') . " - Produit cree : $name\n",
            FILE_APPEND
        );

        return $this->json(['id' => $product->getId()], 201);
    }
}
```

**La solution : extraire des services** :

```php
<?php

namespace App\Controller;

use App\DTO\CreateProductRequest;
use App\Service\ProductService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

// ✅ SRP respecte : le controleur ne fait que orchestrer
class ProductController extends AbstractController
{
    #[Route('/product/create', methods: ['POST'])]
    public function create(
        // Symfony deserialise et valide automatiquement la requete
        #[MapRequestPayload] CreateProductRequest $request,
        ProductService $productService,
    ): Response {
        // Le controleur delegue TOUT au service
        $product = $productService->create($request);

        return $this->json(['id' => $product->getId()], 201);
    }
}
```

---

### OCP dans Symfony : event listeners et voters

**Définition** : Dans Symfony, le principe OCP s'applique via le système d'événements et les services taggés. Tu ajoutes des fonctionnalités sans modifier le code existant.

**Exemple concret : ajouter des traitements à la création d'un produit**

Au lieu de modifier `ProductService` à chaque nouveau besoin, on émet un événement :

```php
<?php

namespace App\Service;

use App\DTO\CreateProductRequest;
use App\Entity\Product;
use App\Event\ProductCreatedEvent;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

// ✅ OCP : cette classe ne changera JAMAIS quand on ajoute
// un nouveau traitement post-creation
class ProductService
{
    public function __construct(
        private EntityManagerInterface $em,
        private EventDispatcherInterface $dispatcher,
    ) {
    }

    public function create(CreateProductRequest $request): Product
    {
        // Creation du produit
        $product = new Product();
        $product->setName($request->name);
        $product->setPrice($request->price);
        $product->setCreatedAt(new \DateTimeImmutable());

        // Persistance
        $this->em->persist($product);
        $this->em->flush();

        // Emission de l'evenement : les listeners reagiront
        // On peut ajouter autant de listeners qu'on veut
        // sans modifier cette classe
        $this->dispatcher->dispatch(new ProductCreatedEvent($product));

        return $product;
    }
}
```

```php
<?php

namespace App\EventListener;

use App\Event\ProductCreatedEvent;
use Psr\Log\LoggerInterface;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// ✅ OCP : ce listener est ajoute SANS modifier ProductService
#[AsEventListener(event: ProductCreatedEvent::class)]
class LogProductCreatedListener
{
    public function __construct(
        private LoggerInterface $logger,
    ) {
    }

    public function __invoke(ProductCreatedEvent $event): void
    {
        // On log la creation du produit
        $this->logger->info('Produit cree', [
            'id' => $event->getProduct()->getId(),
            'name' => $event->getProduct()->getName(),
        ]);
    }
}
```

```php
<?php

namespace App\EventListener;

use App\Event\ProductCreatedEvent;
use App\Service\NotificationService;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// ✅ OCP : encore un nouveau listener, toujours SANS modifier ProductService
#[AsEventListener(event: ProductCreatedEvent::class)]
class NotifyAdminOnProductCreatedListener
{
    public function __construct(
        private NotificationService $notifier,
    ) {
    }

    public function __invoke(ProductCreatedEvent $event): void
    {
        $product = $event->getProduct();

        $this->notifier->sendToAdmin(
            "Nouveau produit : {$product->getName()}"
        );
    }
}
```

---

### LSP dans Symfony : respecter les contrats

**Définition** : Dans Symfony, LSP signifie que chaque implémentation d'une interface doit respecter le contrat défini par cette interface. Les FormType, les Voters et les Normalizers doivent se comporter de manière cohérente.

**Exemple : un Voter qui viole LSP**

```php
<?php

namespace App\Security;

use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

// ❌ VIOLATION LSP : ce Voter retourne toujours true dans supports()
// mais lance une exception dans voteOnAttribute()
// Le contrat de Voter dit : si supports() retourne true,
// voteOnAttribute() doit fonctionner normalement
class BrokenVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        // ❌ Dit "oui je gere tout"
        return true;
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
    ): bool {
        // ❌ Mais lance une exception pour certains cas
        // Cela viole le contrat : si supports() retourne true,
        // cette methode doit retourner un booleen
        if ($attribute === 'ROLE_SUPER_ADMIN') {
            throw new \LogicException('Non supporte');
        }

        return true;
    }
}
```

**Exemple : un Voter qui respecte LSP**

```php
<?php

namespace App\Security;

use App\Entity\Article;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\Security\Core\Authorization\Voter\Voter;

// ✅ LSP respecte : supports() filtre correctement,
// voteOnAttribute() retourne toujours un booleen
class ArticleVoter extends Voter
{
    protected function supports(string $attribute, mixed $subject): bool
    {
        // On ne gere QUE les actions 'edit' et 'delete' sur des Article
        return in_array($attribute, ['edit', 'delete'])
            && $subject instanceof Article;
    }

    protected function voteOnAttribute(
        string $attribute,
        mixed $subject,
        TokenInterface $token,
    ): bool {
        // Ici, on est CERTAIN que $subject est un Article
        // et que $attribute est 'edit' ou 'delete'
        /** @var Article $article */
        $article = $subject;
        $user = $token->getUser();

        // Retourne toujours un booleen, jamais d'exception
        return $article->getAuthor() === $user;
    }
}
```

---

### ISP dans Symfony : interfaces granulaires

**Définition** : Symfony utilise déjà ISP en proposant de nombreuses petites interfaces. Par exemple, `LoggerInterface` ne contient que des méthodes de logging, `CacheInterface` ne contient que des méthodes de cache.

**Appliquer ISP dans tes services** :

```php
<?php

namespace App\Service;

// ❌ VIOLATION ISP : interface trop large
// Un service de lecture n'a pas besoin des methodes d'ecriture
interface ProductServiceInterface
{
    public function findById(int $id): ?Product;
    public function findAll(): array;
    public function create(CreateProductRequest $request): Product;
    public function update(int $id, UpdateProductRequest $request): Product;
    public function delete(int $id): void;
    public function export(): string;
    public function import(string $data): void;
}
```

```php
<?php

namespace App\Service;

// ✅ ISP respecte : interfaces separees par besoin

// Interface pour la lecture
interface ProductReaderInterface
{
    public function findById(int $id): ?Product;
    public function findAll(): array;
}

// Interface pour l'ecriture
interface ProductWriterInterface
{
    public function create(CreateProductRequest $request): Product;
    public function update(int $id, UpdateProductRequest $request): Product;
    public function delete(int $id): void;
}

// Interface pour l'import/export
interface ProductExporterInterface
{
    public function export(): string;
    public function import(string $data): void;
}

// Un controleur de listing n'a besoin QUE de la lecture
class ProductListController extends AbstractController
{
    public function __construct(
        // ✅ On injecte uniquement ce dont on a besoin
        private ProductReaderInterface $reader,
    ) {
    }
}

// Le service complet implemente plusieurs interfaces
class ProductService implements
    ProductReaderInterface,
    ProductWriterInterface
{
    // Implemente les methodes de lecture ET d'ecriture
}
```

---

### DIP dans Symfony : autowiring par interface

**Définition** : Symfony facilite DIP grâce à l'autowiring. Tu déclares tes dépendances par interface et Symfony injecte automatiquement la bonne implémentation.

**Configuration dans `services.yaml`** :

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    # Symfony detecte automatiquement que PostgreSQLProductRepository
    # implemente ProductRepositoryInterface
    # et l'injecte partout ou l'interface est requise

    App\Repository\ProductRepositoryInterface:
        # On specifie quelle implementation utiliser
        class: App\Repository\PostgreSQLProductRepository

    # Alternative : si une seule classe implemente l'interface,
    # Symfony la detecte automatiquement (pas besoin de configuration)
```

```php
<?php

namespace App\Repository;

// L'interface definit le contrat
interface ProductRepositoryInterface
{
    public function findById(int $id): ?Product;
    public function save(Product $product): void;
}

// Implementation PostgreSQL
class PostgreSQLProductRepository implements ProductRepositoryInterface
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
    }

    public function findById(int $id): ?Product
    {
        return $this->em->find(Product::class, $id);
    }

    public function save(Product $product): void
    {
        $this->em->persist($product);
        $this->em->flush();
    }
}

// Implementation pour les tests
class InMemoryProductRepository implements ProductRepositoryInterface
{
    private array $products = [];

    public function findById(int $id): ?Product
    {
        return $this->products[$id] ?? null;
    }

    public function save(Product $product): void
    {
        $this->products[$product->getId()] = $product;
    }
}
```

```php
<?php

namespace App\Service;

// Le service depend de l'interface, pas de l'implementation
class ProductService
{
    public function __construct(
        // ✅ DIP : on injecte l'interface
        // En production : PostgreSQLProductRepository
        // En test : InMemoryProductRepository
        private ProductRepositoryInterface $repository,
    ) {
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer un service respectant SRP

Crée un service de gestion de commandes avec des responsabilités bien séparées.

Fichier `src/DTO/CreateOrderRequest.php` :

```php
<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

// Ce DTO porte les donnees de la requete
// La validation est declarative grace aux attributs
class CreateOrderRequest
{
    public function __construct(
        #[Assert\NotBlank(message: 'Le nom du client est requis')]
        public readonly string $customerName,

        #[Assert\NotBlank(message: "L'email est requis")]
        #[Assert\Email(message: "L'email n'est pas valide")]
        public readonly string $customerEmail,

        #[Assert\Count(
            min: 1,
            minMessage: 'La commande doit contenir au moins un article'
        )]
        public readonly array $items,
    ) {
    }
}
```

**Résultat attendu** :

```text
src/DTO/CreateOrderRequest.php créé avec validation déclarative.
Les contraintes sont vérifiées automatiquement par Symfony.
```

---

### Étape 2 : Créer l'événement et les listeners (OCP)

Fichier `src/Event/OrderPlacedEvent.php` :

```php
<?php

namespace App\Event;

use App\Entity\Order;
use Symfony\Contracts\EventDispatcher\Event;

// Cet evenement est emis quand une commande est passee
class OrderPlacedEvent extends Event
{
    public function __construct(
        private Order $order,
    ) {
    }

    public function getOrder(): Order
    {
        return $this->order;
    }
}
```

Fichier `src/EventListener/SendOrderConfirmationListener.php` :

```php
<?php

namespace App\EventListener;

use App\Event\OrderPlacedEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

// Ce listener envoie un email de confirmation
// Il peut etre ajoute ou supprime SANS modifier OrderService
#[AsEventListener(event: OrderPlacedEvent::class)]
class SendOrderConfirmationListener
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function __invoke(OrderPlacedEvent $event): void
    {
        $order = $event->getOrder();

        $email = (new Email())
            ->to($order->getCustomerEmail())
            ->subject('Confirmation de commande')
            ->text("Votre commande #{$order->getId()} a ete confirmee.");

        $this->mailer->send($email);
    }
}
```

Fichier `src/EventListener/UpdateStockOnOrderListener.php` :

```php
<?php

namespace App\EventListener;

use App\Event\OrderPlacedEvent;
use App\Service\StockService;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;

// Ce listener met a jour le stock
// Encore un traitement ajoute SANS modifier OrderService
#[AsEventListener(event: OrderPlacedEvent::class, priority: 10)]
class UpdateStockOnOrderListener
{
    public function __construct(
        private StockService $stockService,
    ) {
    }

    public function __invoke(OrderPlacedEvent $event): void
    {
        $order = $event->getOrder();

        // On reduit le stock pour chaque article de la commande
        foreach ($order->getItems() as $item) {
            $this->stockService->reduce(
                $item->getProductId(),
                $item->getQuantity()
            );
        }
    }
}
```

**Résultat attendu** :

```text
src/
├── Event/
│   └── OrderPlacedEvent.php
└── EventListener/
    ├── SendOrderConfirmationListener.php
    └── UpdateStockOnOrderListener.php

Quand une commande est passée :
1. Le stock est mis à jour (priorité 10 = exécuté en premier)
2. L'email de confirmation est envoyé (priorité par défaut = 0)
```

---

### Étape 3 : Configurer DIP dans services.yaml

```yaml
# config/services.yaml
services:
    _defaults:
        autowire: true
        autoconfigure: true

    App\:
        resource: '../src/'
        exclude:
            - '../src/DependencyInjection/'
            - '../src/Entity/'
            - '../src/Kernel.php'

    # DIP : on lie l'interface a l'implementation
    App\Repository\OrderRepositoryInterface:
        class: App\Repository\DoctrineOrderRepository

    # En environnement de test, on utilise une autre implementation
    # (a configurer dans config/services_test.yaml)
```

```yaml
# config/services_test.yaml
services:
    # En test, on remplace l'implementation par un mock en memoire
    App\Repository\OrderRepositoryInterface:
        class: App\Repository\InMemoryOrderRepository
```

**Résultat attendu** :

```text
En production : Symfony injecte DoctrineOrderRepository
En test : Symfony injecte InMemoryOrderRepository
Le code métier (OrderService) ne change pas du tout.
```

---

### Étape 4 : Vérifier les services avec la console Symfony

```bash
# Verifier que l'interface est bien liee a l'implementation
php bin/console debug:autowiring OrderRepository
```

**Résultat attendu** :

```text
App\Repository\OrderRepositoryInterface
    App\Repository\DoctrineOrderRepository
```

```bash
# Verifier que les listeners sont bien enregistres
php bin/console debug:event-dispatcher OrderPlacedEvent
```

**Résultat attendu** :

```text
"App\Event\OrderPlacedEvent" event
-----------------------------------
  Order   Callable
  #1      App\EventListener\UpdateStockOnOrderListener
  #2      App\EventListener\SendOrderConfirmationListener
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:autowiring` | Lister toutes les interfaces autowirables |
| `php bin/console debug:container NomDuService` | Voir les détails d'un service |
| `php bin/console debug:event-dispatcher` | Lister tous les event listeners |
| `php bin/console lint:container` | Vérifier que tous les services sont bien configurés |

---

## Pièges Fréquents

### Piège 1 : Injecter EntityManager dans les contrôleurs

**Problème** : Tu injectes `EntityManagerInterface` directement dans les contrôleurs au lieu de passer par un repository.

**Solution** : Crée un repository (ou un service) qui encapsule les accès à la base de données. Le contrôleur ne doit pas connaître Doctrine.

```php
// ❌ Le controleur accede directement a Doctrine
class ProductController extends AbstractController
{
    public function show(int $id, EntityManagerInterface $em): Response
    {
        $product = $em->getRepository(Product::class)->find($id);
        // ...
    }
}

// ✅ Le controleur utilise un service dedie
class ProductController extends AbstractController
{
    public function show(
        int $id,
        ProductRepositoryInterface $repository,
    ): Response {
        $product = $repository->findById($id);
        // ...
    }
}
```

### Piège 2 : Créer un "God Service"

**Problème** : Tu crées un `AppService` ou `MainService` qui orchestre tout le code métier.

**Solution** : Chaque domaine fonctionnel doit avoir son propre service. Un `OrderService` pour les commandes, un `ProductService` pour les produits, un `UserService` pour les utilisateurs.

### Piège 3 : Ne pas utiliser les événements Symfony

**Problème** : Tu ajoutes du code dans `OrderService` à chaque nouveau besoin (email, log, stock, statistiques).

**Solution** : Émets un événement et crée des listeners. Chaque nouveau besoin est un nouveau listener, sans modifier le service existant (OCP).

---

## Checklist de Validation

- [ ] Je sais extraire la logique métier d'un contrôleur vers un service (SRP)
- [ ] Je sais utiliser les événements Symfony pour respecter OCP
- [ ] Je sais configurer l'autowiring par interface dans services.yaml (DIP)
- [ ] Je sais créer un DTO avec validation déclarative
- [ ] Je sais vérifier mes services avec `debug:autowiring` et `debug:container`
- [ ] Je comprends pourquoi les contrôleurs doivent rester minces

---

## Exercice Pratique

**Énoncé** : Refactore le contrôleur suivant pour qu'il respecte les principes SOLID.

```php
class UserController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        Request $request,
        EntityManagerInterface $em,
    ): Response {
        $email = $request->request->get('email');
        $password = $request->request->get('password');

        // Validation
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            return $this->json(['error' => 'Email invalide'], 400);
        }
        if (strlen($password) < 8) {
            return $this->json(['error' => 'Mot de passe trop court'], 400);
        }

        // Verification doublon
        $existing = $em->getRepository(User::class)
            ->findOneBy(['email' => $email]);
        if ($existing) {
            return $this->json(['error' => 'Email deja utilise'], 409);
        }

        // Creation
        $user = new User();
        $user->setEmail($email);
        $user->setPassword(password_hash($password, PASSWORD_BCRYPT));
        $user->setCreatedAt(new \DateTimeImmutable());
        $em->persist($user);
        $em->flush();

        // Notification
        mail($email, 'Bienvenue', 'Votre compte a ete cree');

        return $this->json(['id' => $user->getId()], 201);
    }
}
```

**Indications** :

- Crée un DTO `RegisterUserRequest` avec validation
- Crée un `UserService` pour la logique métier
- Crée un événement `UserRegisteredEvent` et un listener pour l'email
- Utilise une interface pour le repository

**Résultat attendu** : 6-8 fichiers bien séparés, contrôleur de 10 lignes maximum.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. DTO avec validation** (`src/DTO/RegisterUserRequest.php`) :

```php
<?php

namespace App\DTO;

use Symfony\Component\Validator\Constraints as Assert;

class RegisterUserRequest
{
    public function __construct(
        #[Assert\NotBlank(message: "L'email est requis")]
        #[Assert\Email(message: "L'email n'est pas valide")]
        public readonly string $email,

        #[Assert\NotBlank(message: 'Le mot de passe est requis')]
        #[Assert\Length(
            min: 8,
            minMessage: 'Le mot de passe doit contenir au moins 8 caracteres'
        )]
        public readonly string $password,
    ) {
    }
}
```

**2. Interface repository** (`src/Repository/UserRepositoryInterface.php`) :

```php
<?php

namespace App\Repository;

use App\Entity\User;

interface UserRepositoryInterface
{
    public function findByEmail(string $email): ?User;
    public function save(User $user): void;
}
```

**3. Événement** (`src/Event/UserRegisteredEvent.php`) :

```php
<?php

namespace App\Event;

use App\Entity\User;
use Symfony\Contracts\EventDispatcher\Event;

class UserRegisteredEvent extends Event
{
    public function __construct(
        private User $user,
    ) {
    }

    public function getUser(): User
    {
        return $this->user;
    }
}
```

**4. Listener** (`src/EventListener/SendWelcomeEmailListener.php`) :

```php
<?php

namespace App\EventListener;

use App\Event\UserRegisteredEvent;
use Symfony\Component\EventDispatcher\Attribute\AsEventListener;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Email;

#[AsEventListener(event: UserRegisteredEvent::class)]
class SendWelcomeEmailListener
{
    public function __construct(
        private MailerInterface $mailer,
    ) {
    }

    public function __invoke(UserRegisteredEvent $event): void
    {
        $user = $event->getUser();

        $email = (new Email())
            ->to($user->getEmail())
            ->subject('Bienvenue')
            ->text('Votre compte a ete cree.');

        $this->mailer->send($email);
    }
}
```

**5. Service** (`src/Service/UserRegistrationService.php`) :

```php
<?php

namespace App\Service;

use App\DTO\RegisterUserRequest;
use App\Entity\User;
use App\Event\UserRegisteredEvent;
use App\Repository\UserRepositoryInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Contracts\EventDispatcher\EventDispatcherInterface;

class UserRegistrationService
{
    public function __construct(
        private UserRepositoryInterface $repository,
        private UserPasswordHasherInterface $hasher,
        private EventDispatcherInterface $dispatcher,
    ) {
    }

    public function register(RegisterUserRequest $request): User
    {
        // Verification unicite
        $existing = $this->repository->findByEmail($request->email);
        if ($existing) {
            throw new \DomainException('Email deja utilise');
        }

        // Creation
        $user = new User();
        $user->setEmail($request->email);
        $user->setPassword($this->hasher->hashPassword($user, $request->password));
        $user->setCreatedAt(new \DateTimeImmutable());

        // Persistance
        $this->repository->save($user);

        // Evenement
        $this->dispatcher->dispatch(new UserRegisteredEvent($user));

        return $user;
    }
}
```

**6. Contrôleur mince** (`src/Controller/UserController.php`) :

```php
<?php

namespace App\Controller;

use App\DTO\RegisterUserRequest;
use App\Service\UserRegistrationService;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Attribute\MapRequestPayload;
use Symfony\Component\Routing\Attribute\Route;

class UserController extends AbstractController
{
    #[Route('/register', methods: ['POST'])]
    public function register(
        #[MapRequestPayload] RegisterUserRequest $request,
        UserRegistrationService $service,
    ): Response {
        $user = $service->register($request);

        return $this->json(['id' => $user->getId()], 201);
    }
}
```

---

## Navigation

← Fiche précédente : **[SOLID - Principes fondamentaux](02-solid-principes.md)**

→ Fiche suivante : **[Patterns de création](04-patterns-creation.md)**
