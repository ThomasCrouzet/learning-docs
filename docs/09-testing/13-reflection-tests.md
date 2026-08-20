---
tags:
  - Testing
  - PHP
  - Avancé
description: "Utiliser la Reflection PHP pour injecter un ID ou accéder à des propriétés privées dans les tests. Quand c'est utile, quand c'est dangereux."
estimated_time: "45 min"
fiche_number: 13
total_fiches: 15
cursus: "Testing et Qualité"
---

# 13 - Reflection pour les tests

> **En bref** : Quand Doctrine génère un ID au flush et que tu veux tester sans BDD, ou quand une propriété privée n'a pas de setter, l'API Reflection de PHP te permet de contourner les restrictions d'accès. Cette fiche montre comment et surtout quand ne pas le faire. Lecture estimée : 45 min.

## Prérequis

- Fiche 12 : [Test doubles avec PHPUnit](12-test-doubles-phpunit.md)
- Cursus PHP, notions de visibilité (`public`, `protected`, `private`)
- Notions de base sur Doctrine ORM (cursus Symfony)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser `ReflectionClass` et `ReflectionProperty` pour injecter une valeur dans une propriété privée pendant un test, créer un helper réutilisable, et identifier les alternatives qui rendent la Reflection inutile.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la Reflection en PHP ?

**Définition** : La Reflection est une API native de PHP qui permet d'inspecter et de manipuler des classes, des objets, des propriétés et des méthodes à l'exécution, indépendamment de leur visibilité déclarée (`public`, `protected`, `private`).

**Le problème que la Reflection résout** :

Sans Reflection, voici les problèmes rencontrés dans les tests :

1. **Propriétés inaccessibles** : une propriété `private` ne peut pas être lue ni écrite depuis l'extérieur de la classe.
2. **IDs générés par la persistance** : un ORM comme Doctrine n'assigne l'identifiant qu'après un appel à `flush()`, ce qui rend impossible la simulation d'une entité déjà persistée en test unitaire.
3. **Instanciation sans constructeur** : certains tests doivent créer un objet dans un état partiel impossible à obtenir via le constructeur public.

**Comment la Reflection résout ces problèmes** :

| Problème | Solution apportée par la Reflection |
| --- | --- |
| Propriétés inaccessibles | `ReflectionProperty::setValue` écrit même sur du `private` |
| IDs générés par la persistance | On injecte l'ID directement dans la propriété sans booter la BDD |
| Instanciation sans constructeur | `newInstanceWithoutConstructor` crée l'objet vide |

**Analogie concrète** : Pense à un passe partout détenu par le concierge d'un immeuble. Les locataires ferment leurs portes (les propriétés `private` du code de production). Le concierge a un passe pour intervenir en cas d'urgence, mais il ne s'en sert pas tous les jours et il ne le confie à personne. La Reflection est ce passe partout : utile dans le contexte précis des tests, jamais en production.

**Ce que la Reflection n'est PAS** :

- La Reflection n'est pas un outil de production. Elle est lente, casse l'encapsulation et déclenche des warnings si elle est utilisée à mauvais escient.
- La Reflection n'est pas un substitut à un bon design. Si tu as besoin de Reflection partout dans ton code applicatif, ton API publique est probablement mal conçue.
- La Reflection n'est pas magique. Elle exécute du code réel et peut échouer (propriété inexistante, classe finale verrouillée, propriété `readonly` figée).

---

### Pourquoi avoir besoin de la Reflection dans les tests ?

**Définition** : Dans le contexte des tests, la Reflection sert à placer un objet dans un état précis que l'API publique ne permet pas d'atteindre directement, afin de tester un comportement métier sans dépendance à une infrastructure (base de données, kernel Symfony, file d'attente).

**Le problème que la Reflection en test résout** :

1. **Test unitaire sans base de données** : on veut tester `OrderService::cancel(Order $order)` qui appelle `$order->getId()` pour produire un événement. Sans Reflection, il faut booter Doctrine ou rendre l'ID public.
2. **Propriétés managées par le framework** : un champ `private $createdAt` initialisé par un listener Doctrine `prePersist` n'a pas de setter, donc impossible à fixer dans un test pur.
3. **État intermédiaire non atteignable** : on veut tester un cas où une commande est en état `shipped` mais avec une date future, combinaison interdite par l'API publique mais qui peut arriver suite à un bug de migration.

**Comment la Reflection en test résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Test sans BDD | Injecter l'ID directement dans la propriété privée |
| Propriétés managées par le framework | Forcer la valeur sans passer par le listener |
| État intermédiaire impossible | Construire l'objet puis figer son état exact |

**Analogie concrète** : Imagine un mannequin de crash test. Le constructeur ne le fabrique pas comme un humain réel, il l'assemble pièce par pièce dans la position exacte requise par l'essai. La Reflection joue ce rôle pour les objets de test : tu assembles l'état précis dont tu as besoin pour ton scénario, même si cet état n'est pas reproductible naturellement.

**Ce que ce n'est PAS** :

- Ce n'est pas une excuse pour ne pas écrire de factories propres dans le code applicatif. Si la même Reflection apparaît dans dix tests, extraire une factory publique sur l'entité est souvent préférable.
- Ce n'est pas un substitut aux tests d'intégration. Un test qui passe avec Reflection ne garantit pas que la persistance Doctrine fonctionne réellement.

---

### Reflection vs alternatives propres

**Définition** : Avant d'utiliser la Reflection, il faut vérifier qu'aucune alternative plus simple n'existe. Les alternatives propres exposent une porte d'entrée contrôlée dans le code applicatif, ce qui rend les tests lisibles et le code de production résistant aux abus.

**Le problème que cette analyse résout** :

1. **Tests fragiles** : un test qui dépend du nom exact d'une propriété privée casse silencieusement quand la propriété est renommée.
2. **Test couplé à l'implémentation** : tester un état privé revient à tester comment la classe est construite, pas ce qu'elle fait.
3. **Code de production pollué** : ajouter des setters publics juste pour les tests détériore l'API.

**Tableau comparatif** :

| Besoin | Reflection | Alternative |
| --- | --- | --- |
| Injecter un ID Doctrine | `ReflectionProperty::setValue` | Méthode statique factory `withId()` côté entité |
| Forcer un état interne | Reflection sur la propriété | Exposer un setter annoté `@internal` |
| Lire un état privé | `ReflectionProperty::getValue` | Exposer un getter de test ou tester via le comportement |
| Tester une méthode privée | `ReflectionMethod::setAccessible` | Tester via la méthode publique qui l'appelle |
| Instancier sans constructeur | `newInstanceWithoutConstructor` | Constructeur de test ou factory dédiée |

**Analogie concrète** : Pense à une fenêtre verrouillée. Tu peux la forcer avec un pied-de-biche (Reflection) ou demander une clé au propriétaire (factory publique). Le pied-de-biche marche toujours, mais il abîme le cadre et tu en gardes une trace. La clé est plus propre, à condition que le propriétaire accepte d'en faire une. Pour les entités que tu contrôles, demande la clé. Pour les classes verrouillées par un framework, prends le pied-de-biche.

**Ce que ce n'est PAS** :

- Ce n'est pas une règle stricte. Une factory `withId()` purement créée pour les tests pollue aussi l'API publique. Le bon choix dépend du contexte.
- Ce n'est pas un substitut à la réflexion sur le design. Si tu hésites entre Reflection et factory, prends quinze minutes pour identifier pourquoi la classe est si difficile à instancier.

---

## Étapes Pratiques

### Étape 1 : Écrire un test qui plante sans ID

Voici une classe `Order` qui suit la convention Doctrine : `$id` est `private` et n'a pas de setter, car il est généré par la base de données au moment du `flush()`.

```php
<?php

namespace App\Entity;

class Order
{
    private ?int $id = null;
    private string $reference;
    private string $status = 'pending';

    public function __construct(string $reference)
    {
        $this->reference = $reference;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): string
    {
        return $this->reference;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function cancel(): void
    {
        $this->status = 'cancelled';
    }
}
```

Un premier test naïf tente de vérifier que `getId()` renvoie un entier après un appel métier.

```php
<?php

namespace App\Tests\Entity;

use App\Entity\Order;
use PHPUnit\Framework\TestCase;

final class OrderTest extends TestCase
{
    public function testCancelOrderKeepsIdReadable(): void
    {
        $order = new Order('CMD-001');
        $order->cancel();

        // Ce test échoue : getId() renvoie null car Doctrine
        // n'a jamais été appelé pour assigner un identifiant.
        static::assertSame(42, $order->getId());
    }
}
```

**Résultat attendu** :

```text
Failed asserting that null is identical to 42.

/app/tests/Entity/OrderTest.php:14
```

Le test échoue car aucune persistance n'a eu lieu et `$id` reste à `null`.

---

### Étape 2 : Injecter l'ID via Reflection

On utilise `ReflectionClass` pour récupérer la propriété privée `$id`, puis `ReflectionProperty::setValue` pour y écrire la valeur souhaitée.

```php
<?php

namespace App\Tests\Entity;

use App\Entity\Order;
use PHPUnit\Framework\TestCase;

final class OrderReflectionTest extends TestCase
{
    public function testCancelOrderKeepsIdReadable(): void
    {
        // On crée l'objet via son API publique.
        $order = new Order('CMD-001');

        // On obtient le reflet de la classe.
        $reflection = new \ReflectionClass($order);

        // On cible la propriété privée par son nom exact.
        $property = $reflection->getProperty('id');

        // On écrit la valeur. Depuis PHP 8.1, setAccessible(true)
        // est implicite pour les propriétés privées et protégées.
        $property->setValue($order, 42);

        // L'API publique renvoie maintenant la valeur injectée.
        $order->cancel();

        static::assertSame(42, $order->getId());
        static::assertSame('cancelled', $order->getStatus());
    }
}
```

**Résultat attendu** :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

.                                                              1 / 1 (100%)

Time: 00:00.012, Memory: 6.00 MB

OK (1 test, 2 assertions)
```

**Note PHP 8.1 / 8.5** : avant PHP 8.1, il fallait écrire `$property->setAccessible(true);` avant `setValue`. Depuis PHP 8.1, cet appel n'a plus d'effet (accès Reflection par défaut). Depuis PHP 8.5, `setAccessible()` est **déprécié**. Sur PHP 8.3 (référence du cursus), ne l'écris plus.

---

### Étape 3 : Factoriser dans un trait réutilisable

Si plusieurs tests ont besoin du même pattern, on extrait la logique dans un trait pour éviter la duplication.

```php
<?php

namespace App\Tests\Support;

trait CreatesEntitiesWithId
{
    /**
     * Injecte un identifiant dans une entité sans passer par la persistance.
     *
     * Utile pour les tests unitaires qui ne bootent pas Doctrine.
     */
    private function withId(object $entity, int $id, string $propertyName = 'id'): object
    {
        $reflection = new \ReflectionClass($entity);
        $property = $reflection->getProperty($propertyName);
        $property->setValue($entity, $id);

        return $entity;
    }
}
```

Usage dans un test de service métier :

```php
<?php

namespace App\Tests\Service;

use App\Entity\Order;
use App\Event\OrderCancelledEvent;
use App\Service\OrderService;
use App\Tests\Support\CreatesEntitiesWithId;
use PHPUnit\Framework\TestCase;
use Psr\EventDispatcher\EventDispatcherInterface;

final class OrderServiceTest extends TestCase
{
    use CreatesEntitiesWithId;

    public function testCancelOrderEmitsEventWithId(): void
    {
        // On prépare une entité qui semble déjà persistée.
        $order = $this->withId(new Order('CMD-001'), 42);

        // On crée un mock pour vérifier l'événement émis.
        $dispatcher = $this->createMock(EventDispatcherInterface::class);
        $dispatcher
            ->expects(static::once())
            ->method('dispatch')
            ->with(static::callback(
                fn (OrderCancelledEvent $event) => $event->getOrderId() === 42,
            ));

        $service = new OrderService($dispatcher);
        $service->cancel($order);
    }
}
```

**Résultat attendu** :

```text
.                                                              1 / 1 (100%)

OK (1 test, 1 assertion)
```

Le trait est désormais réutilisable dans tous les tests du projet. Si tu changes le nom de la propriété, tu peux passer un troisième argument.

---

### Étape 4 : Lire une propriété privée (cas d'audit)

La Reflection sert aussi à lire un état interne, par exemple pour vérifier qu'un listener Doctrine a bien initialisé `$createdAt`.

```php
<?php

namespace App\Tests\Listener;

use App\Entity\Order;
use App\Listener\OrderTimestampListener;
use PHPUnit\Framework\TestCase;

final class OrderTimestampListenerTest extends TestCase
{
    public function testListenerSetsCreatedAtOnNewOrder(): void
    {
        $order = new Order('CMD-001');
        $listener = new OrderTimestampListener();

        // Avant l'appel du listener, createdAt est null.
        $listener->prePersist($order);

        // On lit la propriété privée pour vérifier l'effet du listener.
        $reflection = new \ReflectionClass($order);
        $property = $reflection->getProperty('createdAt');
        $value = $property->getValue($order);

        static::assertInstanceOf(\DateTimeImmutable::class, $value);
    }
}
```

**Résultat attendu** :

```text
.                                                              1 / 1 (100%)

OK (1 test, 1 assertion)
```

Cette approche reste un dernier recours. Si tu lis souvent `$createdAt`, expose un getter `getCreatedAt(): ?DateTimeImmutable` dans l'entité : c'est de toute façon une donnée que ton application affichera.

---

### Étape 5 : Alternative recommandée, factory côté entité

Pour les classes que tu contrôles entièrement, une factory statique évite la Reflection et rend le test plus lisible.

```php
<?php

namespace App\Entity;

class Order
{
    private ?int $id = null;
    private string $reference;
    private string $status = 'pending';

    public function __construct(string $reference)
    {
        $this->reference = $reference;
    }

    /**
     * Factory de test : reconstruit une entité dans l'état "persistée".
     *
     * @internal Réservé aux tests unitaires.
     */
    public static function reconstitute(int $id, string $reference, string $status): self
    {
        $order = new self($reference);
        $order->id = $id;
        $order->status = $status;

        return $order;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getStatus(): string
    {
        return $this->status;
    }
}
```

Le test devient plus court et l'intention plus claire :

```php
<?php

namespace App\Tests\Entity;

use App\Entity\Order;
use PHPUnit\Framework\TestCase;

final class OrderTest extends TestCase
{
    public function testReconstituteRestoresPersistedState(): void
    {
        $order = Order::reconstitute(42, 'CMD-001', 'pending');

        static::assertSame(42, $order->getId());
        static::assertSame('pending', $order->getStatus());
    }
}
```

**Quand préférer la Reflection vs une factory** :

| Situation | Préférer |
| --- | --- |
| Entité d'une bibliothèque tierce que tu ne contrôles pas | Reflection |
| Code applicatif que tu maîtrises entièrement | Factory ou setter `@internal` |
| Plusieurs tests utilisent le même pattern de construction | Trait ou helper Reflection |
| Un seul test exotique nécessite un état précis | Reflection inline |
| L'entité a beaucoup de champs `private` à initialiser | Factory dédiée plus lisible |

**Résultat attendu** :

```text
Le test est lisible en une ligne (Order::reconstitute(...)),
ne dépend pas du nom exact de la propriété,
et fonctionne même si l'implémentation interne change.
```

---

## Commandes Utiles

| Élément | Action |
| --- | --- |
| `new \ReflectionClass($obj)` | Obtenir le reflet d'une instance |
| `$ref->getProperty('name')` | Accéder à une propriété par son nom |
| `$prop->setValue($obj, $val)` | Écrire une propriété (privée ou non) |
| `$prop->getValue($obj)` | Lire une propriété (privée ou non) |
| `$ref->getMethod('name')` | Accéder à une méthode |
| `$method->invoke($obj, ...$args)` | Appeler une méthode (privée ou non) |
| `$ref->newInstanceWithoutConstructor()` | Instancier sans appeler `__construct` |
| `$ref->getProperties()` | Lister toutes les propriétés d'une classe |
| `$prop->isReadOnly()` | Détecter une propriété `readonly` (PHP 8.1+) |

---

## Pièges Fréquents

### Piège 1 : Utiliser la Reflection en production

⚠️ **Problème** : La Reflection est plus lente que les appels directs (les benchmarks montrent un facteur 2 à 5 selon le scénario) et casse les protections orientées objet. Un développeur qui découvre du code de production utilisant `ReflectionProperty::setValue` perd la garantie que les invariants de la classe sont respectés.

✅ **Solution** : Réserve la Reflection aux tests et aux outils de développement (générateurs de code, mappers ORM, sérialiseurs). Dans le code applicatif, expose une méthode publique qui exprime l'intention métier.

```php
// ❌ À éviter en production
$reflection = new \ReflectionClass($order);
$reflection->getProperty('status')->setValue($order, 'cancelled');

// ✅ Préférer une méthode métier explicite
$order->cancel();
```

---

### Piège 2 : Tester l'implémentation plutôt que le comportement

⚠️ **Problème** : Tu écris un test qui vérifie que la propriété privée `$attemptCount` vaut 3 après trois échecs. Si tu renommes la propriété en `$failureCount`, le test casse alors que le comportement métier est inchangé.

✅ **Solution** : Vérifie le comportement observable depuis l'API publique. Dans cet exemple, l'API métier devrait exposer `hasReachedMaxAttempts(): bool` ou émettre un événement après le troisième échec. C'est ça qu'on teste.

```php
// ❌ Couplé à l'implémentation
$property = $reflection->getProperty('attemptCount');
static::assertSame(3, $property->getValue($order));

// ✅ Couplé au comportement
static::assertTrue($order->hasReachedMaxAttempts());
```

---

### Piège 3 : Oublier que `setAccessible` est inutile en PHP 8.1+ (déprécié en 8.5)

⚠️ **Problème** : Sur un projet PHP 8.1 ou supérieur, écrire `$property->setAccessible(true);` n'a plus d'effet. Depuis PHP 8.5, cet appel est **déprécié** et peut produire un avertissement de dépréciation.

✅ **Solution** : Vérifie la version de PHP du projet (`php -v` ou `composer.json` clé `require.php`). Si tu cibles PHP 8.1+ (dont la référence du cursus, PHP 8.3), supprime l'appel à `setAccessible`. Si tu maintiens du code compatible avec PHP 8.0 ou antérieur, conserve l'appel.

```php
// PHP 8.0 et antérieur
$property->setAccessible(true);
$property->setValue($obj, 42);

// PHP 8.1+ (et PHP 8.3 de référence)
$property->setValue($obj, 42);
```

---

### Piège 4 : Reflection sur une propriété `readonly`

⚠️ **Problème** : Depuis PHP 8.1, le mot-clé `readonly` empêche la modification après initialisation, même via Reflection. PHP lève une `Error` (pas une `ReflectionException`) du type « Cannot modify readonly property… ».

```php
class Identifier
{
    public function __construct(
        public readonly int $value,
    ) {
    }
}

$id = new Identifier(1);
$ref = new \ReflectionClass($id);
$ref->getProperty('value')->setValue($id, 2);
// Error: Cannot modify readonly property Identifier::$value
```

✅ **Solution** : Utilise `newInstanceWithoutConstructor()` puis `setValue` avant que la propriété ne soit considérée comme initialisée. Si ce n'est pas possible, repense le test : une propriété `readonly` est un signal que la valeur doit être passée au constructeur.

```php
$ref = new \ReflectionClass(Identifier::class);
$id = $ref->newInstanceWithoutConstructor();
$ref->getProperty('value')->setValue($id, 42);
// Cette fois, l'écriture est acceptée car la propriété
// n'a jamais été initialisée par le constructeur.
```

---

### Piège 5 : Coupler le test au nom exact de la propriété

⚠️ **Problème** : Si la propriété `$id` est renommée en `$identifier`, ton test échoue avec une `ReflectionException` à l'exécution. L'analyseur statique ne le détecte pas car le nom est une chaîne de caractères.

✅ **Solution** : Ajoute toujours un test "de surface" qui exerce l'API publique sans Reflection. Si l'API publique continue de fonctionner, le renommage est sans danger fonctionnel et tu corriges la chaîne en une fois.

```php
// Test 1 : surface (ne dépend pas du nom interne)
public function testCancelChangesStatus(): void
{
    $order = new Order('CMD-001');
    $order->cancel();
    static::assertSame('cancelled', $order->getStatus());
}

// Test 2 : avec Reflection (à isoler dans une suite dédiée)
public function testCancelEmitsEventWithInjectedId(): void
{
    // Si ce test casse seul, c'est probablement un renommage.
}
```

---

## Checklist de Validation

- [ ] Je comprends pourquoi un test unitaire n'a pas accès aux IDs générés par Doctrine
- [ ] Je sais injecter une valeur dans une propriété privée via `ReflectionProperty::setValue`
- [ ] Je sais factoriser ce pattern dans un trait réutilisable
- [ ] Je connais l'alternative factory côté entité et ses limites
- [ ] Je n'utilise jamais la Reflection dans le code de production
- [ ] Je sais que la Reflection échoue sur les propriétés `readonly` initialisées
- [ ] Je connais `newInstanceWithoutConstructor` pour contourner le constructeur
- [ ] Je distingue un test couplé à l'implémentation d'un test couplé au comportement

---

## Exercice Pratique

**Énoncé** : Tu disposes d'une classe `Invoice` avec deux propriétés privées gérées par Doctrine : `$id` (généré au flush) et `$total` (calculé par un listener au moment de la persistance). Tu dois écrire des tests qui simulent une facture déjà persistée sans booter le kernel Symfony.

**Indications** :

- Crée un trait `WithReflection` qui expose une méthode `setPrivateProperty(object $entity, string $property, mixed $value): void`.
- Crée une classe de test `InvoiceTest` qui utilise ce trait.
- Le test doit créer une `Invoice` avec `id=99` et `total=150.00`.
- Le test doit vérifier que `getId()` renvoie `99` et que `getTotal()` renvoie `150.00`.
- Ajoute un second test qui vérifie le comportement métier `markAsPaid()` après avoir injecté l'état persisté.

**Résultat attendu** : Deux tests verts qui passent sans aucune dépendance à Doctrine, au container Symfony ou à une base de données.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Classe à tester** :

```php
<?php

namespace App\Entity;

class Invoice
{
    private ?int $id = null;
    private string $reference;
    private float $total = 0.0;
    private string $status = 'draft';

    public function __construct(string $reference)
    {
        $this->reference = $reference;
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getReference(): string
    {
        return $this->reference;
    }

    public function getTotal(): float
    {
        return $this->total;
    }

    public function getStatus(): string
    {
        return $this->status;
    }

    public function markAsPaid(): void
    {
        if ($this->id === null) {
            throw new \LogicException('Impossible de marquer une facture non persistée comme payée.');
        }

        if ($this->total <= 0) {
            throw new \LogicException('Impossible de payer une facture sans montant.');
        }

        $this->status = 'paid';
    }
}
```

**Trait `WithReflection`** :

```php
<?php

namespace App\Tests\Support;

trait WithReflection
{
    /**
     * Écrit une valeur dans une propriété privée ou protégée.
     *
     * Utilisé pour simuler un état post-persistance Doctrine
     * sans booter le kernel Symfony ni la base de données.
     */
    private function setPrivateProperty(object $entity, string $property, mixed $value): void
    {
        $reflection = new \ReflectionClass($entity);
        $reflection->getProperty($property)->setValue($entity, $value);
    }
}
```

**Tests** :

```php
<?php

namespace App\Tests\Entity;

use App\Entity\Invoice;
use App\Tests\Support\WithReflection;
use PHPUnit\Framework\TestCase;

final class InvoiceTest extends TestCase
{
    use WithReflection;

    public function testInjectedStateIsReadable(): void
    {
        // On crée la facture via son API publique.
        $invoice = new Invoice('FAC-2026-001');

        // On simule l'état post-persistance Doctrine.
        $this->setPrivateProperty($invoice, 'id', 99);
        $this->setPrivateProperty($invoice, 'total', 150.00);

        // L'API publique renvoie les valeurs injectées.
        static::assertSame(99, $invoice->getId());
        static::assertSame(150.00, $invoice->getTotal());
        static::assertSame('FAC-2026-001', $invoice->getReference());
        static::assertSame('draft', $invoice->getStatus());
    }

    public function testMarkAsPaidRequiresPersistedState(): void
    {
        $invoice = new Invoice('FAC-2026-002');
        $this->setPrivateProperty($invoice, 'id', 99);
        $this->setPrivateProperty($invoice, 'total', 150.00);

        // On exerce le comportement métier sur l'état préparé.
        $invoice->markAsPaid();

        static::assertSame('paid', $invoice->getStatus());
    }

    public function testMarkAsPaidFailsWithoutId(): void
    {
        $invoice = new Invoice('FAC-2026-003');
        $this->setPrivateProperty($invoice, 'total', 150.00);

        // Sans ID, l'API métier refuse la transition.
        $this->expectException(\LogicException::class);
        $this->expectExceptionMessage('non persistée');

        $invoice->markAsPaid();
    }
}
```

**Pourquoi cette approche évite de booter le kernel Symfony** :

- Aucun service du container n'est instancié : pas de configuration YAML chargée, pas d'auto-wiring, pas de compilation.
- Aucune connexion Doctrine n'est ouverte : pas de schéma à créer, pas de fixtures à charger.
- Le test se concentre sur la logique métier de `Invoice::markAsPaid()`, pas sur la persistance.
- Le temps d'exécution est typiquement inférieur à 50 ms, contre plusieurs secondes pour un test d'intégration.

Cette stratégie est complémentaire des tests d'intégration : tu écris beaucoup de tests unitaires rapides avec Reflection, et tu gardes un petit nombre de tests d'intégration pour vérifier que la persistance Doctrine fonctionne réellement.

---

## Navigation

← Fiche précédente : **[Test doubles avec PHPUnit](12-test-doubles-phpunit.md)**

→ Fiche suivante : **[Auditer la couverture d'un projet existant](14-audit-couverture-legacy.md)**
