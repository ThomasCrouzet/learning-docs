---
tags:
  - Référence
  - Architecture
description: "Aide-mémoire Architecture : SOLID, design patterns, Clean Architecture et DDD"
estimated_time: "20 min"
fiche_number: 17
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-architecture"
course_id: "references.quick-reference"
content_type: "reference"
order: 17
---

# Aide-mémoire Architecture

> **En bref** : Aide-mémoire Architecture. Lecture estimée : 20 min.

Fiche de référence rapide pour l'architecture logicielle : principes SOLID, design patterns, Clean Architecture et DDD.

---

## Principes SOLID

| Principe | Résumé |
| -------- | ------ |
| **S** - Single Responsibility | Une classe = une seule raison de changer |
| **O** - Open/Closed | Ouvert à l'extension, fermé à la modification |
| **L** - Liskov Substitution | Un sous-type doit pouvoir remplacer son type parent |
| **I** - Interface Segregation | Plusieurs petites interfaces plutôt qu'une grosse |
| **D** - Dependency Inversion | Dépendre d'abstractions, pas d'implémentations |

### Application rapide

```php
// S - Séparer les responsabilités
class UserRepository { /* persistance */ }
class WelcomeEmailSender { /* emails */ }
class EmailValidator { /* validation */ }

// O - Étendre sans modifier
interface NotificationChannelInterface {
    public function send(string $message): void;
}
// Ajouter SmsChannel sans modifier le code existant

// D - Dépendre des interfaces
class OrderService {
    public function __construct(
        private PaymentGatewayInterface $payment, // pas StripeGateway
    ) {}
}
```

---

## Design patterns - Création

### Factory Method

```php
class NotificationFactory {
    public static function create(string $type): NotificationInterface {
        return match ($type) {
            'email' => new EmailNotification(),
            'sms' => new SmsNotification(),
            'push' => new PushNotification(),
        };
    }
}
```

### Builder

```php
$email = (new EmailBuilder())
    ->from('sender@example.com')
    ->to('dest@example.com')
    ->subject('Bienvenue')
    ->body('Contenu')
    ->build();
```

---

## Design patterns - Structure

### Adapter

```php
// Adapter une librairie tierce à notre interface
class StripeAdapter implements PaymentGatewayInterface {
    public function pay(float $amount): PaymentResult {
        // Convertit euros en centimes pour l'API Stripe
        $result = $this->stripe->charge($amount * 100);
        return new PaymentResult($result->id, $result->status);
    }
}
```

### Decorator

```php
// Empiler des comportements
$logger = new TimedLoggerDecorator(
    new FilteredLoggerDecorator(
        new FileLogger('app.log'),
        LogLevel::WARNING
    )
);
```

Décoration Symfony :

```yaml
services:
    App\Decorator\CachedProductRepository:
        decorates: App\Repository\ProductRepository
        arguments: ['@.inner']
```

---

## Design patterns - Comportement

### Strategy

```php
interface PricingStrategyInterface {
    public function calculate(float $price, int $qty): float;
}

class RegularPricing implements PricingStrategyInterface { /* prix normal */ }
class VolumePricing implements PricingStrategyInterface { /* remise volume */ }
class PremiumPricing implements PricingStrategyInterface { /* -25% fixe */ }

$cart->setPricingStrategy(new VolumePricing());
```

### Observer (Symfony EventDispatcher)

```php
// Événement
class ProductCreatedEvent {
    public function __construct(public readonly Product $product) {}
}

// Listener
#[AsEventListener(event: ProductCreatedEvent::class)]
class SendNotificationListener {
    public function __invoke(ProductCreatedEvent $event): void { ... }
}

// Dispatch
$dispatcher->dispatch(new ProductCreatedEvent($product));
```

### Command

```php
interface CommandInterface {
    public function execute(): void;
    public function undo(): void;
}
// Encapsuler une action en objet : undo, queue, log
```

---

## Résumé des patterns

| Pattern | Type | Problème résolu |
| ------- | ---- | --------------- |
| Factory | Création | Créer des objets sans connaître la classe exacte |
| Builder | Création | Construire un objet complexe étape par étape |
| Adapter | Structure | Rendre compatible une interface tierce |
| Decorator | Structure | Ajouter des comportements sans modifier la classe |
| Façade | Structure | Simplifier un sous-système complexe |
| Strategy | Comportement | Choisir un algorithme à l'exécution |
| Observer | Comportement | Réagir à un événement sans couplage |
| Command | Comportement | Encapsuler une action (undo, queue) |

---

## Clean Architecture - Couches

```text
┌─────────────────────────────────────┐
│  4. Frameworks (Symfony, Doctrine)  │
│  ┌─────────────────────────────┐    │
│  │  3. Adapters (Controllers,  │    │
│  │     Repositories impl.)    │    │
│  │  ┌─────────────────────┐   │    │
│  │  │  2. Use Cases        │   │    │
│  │  │  ┌─────────────┐    │   │    │
│  │  │  │ 1. Entities  │    │   │    │
│  │  │  └─────────────┘    │   │    │
│  │  └─────────────────────┘   │    │
│  └─────────────────────────────┘    │
└─────────────────────────────────────┘
```

| Couche | Contenu | Dépend de |
| ------ | ------- | --------- |
| 1. Entities | Logique métier pure (pas de framework) | Rien |
| 2. Use Cases | Cas d'utilisation, ports (interfaces) | Entities |
| 3. Adapters | Controllers, implémentations des ports | Entities + Use Cases |
| 4. Frameworks | Symfony, Doctrine, Twig | Tout |

**Règle** : les dépendances pointent toujours vers l'intérieur.

---

## DDD - Concepts essentiels

### Entity vs Value Object

| Entity | Value Object |
| ------ | ------------ |
| Identité unique (ID) | Défini par ses attributs |
| Mutable | Immuable |
| Égalité par ID | Égalité par valeur |
| Ex : `Client`, `Commande` | Ex : `Email`, `Montant`, `Adresse` |

### Value Object

```php
final readonly class Email {
    public function __construct(public string $adresse) {
        if (!filter_var($adresse, FILTER_VALIDATE_EMAIL)) {
            throw new \InvalidArgumentException("Email invalide");
        }
    }

    public function estEgalA(self $autre): bool {
        return $this->adresse === $autre->adresse;
    }
}
```

### Agrégat

- Groupe d'entités/value objects traité comme une unité
- **Racine d'agrégat** : seul point d'entrée pour les modifications
- Règles : pas de référence directe aux objets internes, un agrégat = une transaction

### Bounded Context

- Frontière explicite dans laquelle un modèle est défini
- Chaque contexte a sa propre définition d'une entité
- Ex : `Commande` dans le contexte Vente vs dans le contexte Livraison

### Langage ubiquitaire

| Mauvais | Bon |
| ------- | --- |
| `DataProcessor` | `CalculateurTarif` |
| `ItemManager` | `GestionnaireStock` |
| `handleRequest()` | `confirmerCommande()` |

---

## Anti-patterns courants

| Anti-pattern | Symptôme | Solution |
| ------------ | -------- | -------- |
| God Class | 500+ lignes, 20+ méthodes, noms en Manager/Helper | Découper par responsabilité (SRP) |
| Spaghetti Code | Imbrication > 4 niveaux, méthodes 50+ lignes | Extraire des méthodes, early return |
| Lava Flow | Code mort, commentaires "au cas où" | Supprimer (Git conserve l'historique) |
| Golden Hammer | Même solution pour tout | Adapter l'outil au problème |
| Primitive Obsession | `string` pour email, `float` pour prix | Value Objects |
| Feature Envy | Classe utilisant surtout les méthodes d'une autre | Déplacer la logique dans la bonne classe |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| SRP trop granulaire (1 méthode = 1 classe) | Une responsabilité = un domaine cohérent |
| Interfaces pour tout | Créer une interface quand il y a 2+ implémentations |
| Héritage par défaut | Préférer la composition (`has-a` > `is-a`) |
| `EntityManager` dans le controller | Utiliser les repositories |
| Pattern pour un `if` simple | Le pattern doit simplifier, pas complexifier |
| "Au cas où" (YAGNI) | Implémenter quand le besoin existe |

---

## Liens utiles

- [02 - SOLID principes](../10-architecture/02-solid-principes.md)
- [04 - Patterns de création](../10-architecture/04-patterns-creation.md)
- [05 - Patterns de structure](../10-architecture/05-patterns-structure.md)
- [06 - Patterns de comportement](../10-architecture/06-patterns-comportement.md)
- [08 - Clean Architecture](../10-architecture/08-clean-architecture.md)
- [09 - Introduction DDD](../10-architecture/09-introduction-ddd.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire Monitoring](16-aide-memoire-monitoring.md)**

→ Fiche suivante : **[Aide-mémoire Testing](18-aide-memoire-testing.md)**
