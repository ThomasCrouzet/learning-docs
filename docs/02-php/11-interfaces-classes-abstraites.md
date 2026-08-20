---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les interfaces et les classes abstraites"
estimated_time: "60 min"
fiche_number: 11
total_fiches: 14
cursus: "PHP"
---

# 11 - Les interfaces et les classes abstraites

> **En bref** : À la fin de cette fiche, tu sauras créer et utiliser des interfaces et des classes abstraites en PHP. Tu comprendras pourquoi Symfony utilise des interfaces comme UserInterface ou FormTypeInterface et comment elles structurent le code. Lecture estimée : 60 min.


## Prérequis

- Fiche **[07 - Programmation orientée objet](07-introduction-poo.md)**
- Fiche **[08 - Les classes en détail](08-classes-en-detail.md)**
- Fiche **[09 - Namespaces et use](09-namespaces-use.md)**
- Savoir créer des classes avec héritage, propriétés et méthodes

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des interfaces et des classes abstraites en PHP. Tu comprendras pourquoi Symfony utilise des interfaces comme `UserInterface` ou `FormTypeInterface` et comment elles structurent le code.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une interface ?

**Définition** : Une interface est un contrat. Elle déclare des méthodes qu'une classe **doit** implémenter, sans fournir le code de ces méthodes.

**Le problème que les interfaces résolvent** :

Sans interfaces, voici les problèmes rencontrés :

1. **Pas de garantie** : Rien ne garantit qu'une classe possède certaines méthodes. Si tu passes un objet à une fonction, tu ne sais pas s'il a la méthode attendue.

2. **Couplage fort** : Le code dépend directement d'une classe concrète. Impossible de remplacer une implémentation par une autre.

3. **Pas de standard** : Chaque développeur crée ses propres noms de méthodes. L'un utilise `getUser()`, l'autre `fetchUser()`, le troisième `loadUser()`.

**Comment les interfaces résolvent ces problèmes** :

| Problème | Solution avec les interfaces |
| -------- | ---------------------------- |
| Pas de garantie | L'interface force l'implémentation de méthodes précises |
| Couplage fort | Le code dépend de l'interface, pas de la classe concrète |
| Pas de standard | L'interface impose les noms et signatures des méthodes |

**Analogie concrète** : Une interface est comme une prise électrique normalisée. La norme (interface) dit : "tu dois avoir 2 broches et une terre". Tout appareil qui respecte cette norme (implémente l'interface) peut se brancher. Tu peux brancher un grille-pain ou un aspirateur : ils sont différents, mais ils respectent le même contrat.

**Ce qu'une interface n'est PAS** :

- Une interface n'est pas une classe. Elle ne peut pas être instanciée (`new MonInterface()` provoque une erreur).
- Une interface n'a pas de corps de méthode. Les constantes d'interface existent depuis PHP 5. Depuis PHP 8.1, une classe peut redéfinir une constante héritée d'une interface. Depuis PHP 8.4, une interface peut déclarer des propriétés (hooks `get`/`set`). La RFC « Interface Default Methods » (corps de méthode) a été déclinée : ce n'est pas une fonctionnalité de PHP 8.4.

---

### Syntaxe d'une interface

**Déclarer une interface** :

```php
<?php

namespace App\Contract;

interface PaymentMethodInterface
{
    // Déclare les méthodes sans corps (pas d'accolades {})
    public function pay(float $amount): bool;

    public function refund(float $amount): bool;

    public function getName(): string;
}
```

**Implémenter une interface** :

```php
<?php

namespace App\Payment;

use App\Contract\PaymentMethodInterface;

class CreditCardPayment implements PaymentMethodInterface
{
    // OBLIGATOIRE : implémenter TOUTES les méthodes de l'interface
    public function pay(float $amount): bool
    {
        // Logique de paiement par carte
        return true;
    }

    public function refund(float $amount): bool
    {
        // Logique de remboursement
        return true;
    }

    public function getName(): string
    {
        return 'Carte bancaire';
    }
}
```

**Règles** :

| Règle | Détail |
| ----- | ------ |
| Mot-clé | `interface` pour déclarer, `implements` pour implémenter |
| Méthodes | Uniquement `public` |
| Corps | Aucun corps de méthode dans l'interface |
| Obligation | La classe doit implémenter **toutes** les méthodes |
| Multiple | Une classe peut implémenter plusieurs interfaces |

---

### Implémenter plusieurs interfaces

Une classe peut respecter plusieurs contrats :

```php
<?php

namespace App\Contract;

interface LoggableInterface
{
    public function getLogMessage(): string;
}

interface TimestampableInterface
{
    public function getCreatedAt(): \DateTimeImmutable;

    public function getUpdatedAt(): ?\DateTimeImmutable;
}
```

```php
<?php

namespace App\Entity;

use App\Contract\LoggableInterface;
use App\Contract\TimestampableInterface;

// Implémenter plusieurs interfaces avec une virgule
class Product implements LoggableInterface, TimestampableInterface
{
    private \DateTimeImmutable $createdAt;
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct(private string $name)
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getLogMessage(): string
    {
        return 'Produit : ' . $this->name;
    }

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }
}
```

---

### Type-hinting avec les interfaces

L'intérêt principal : utiliser l'interface comme type dans les paramètres.

```php
<?php

// Cette fonction accepte N'IMPORTE QUEL moyen de paiement
function processPayment(PaymentMethodInterface $method, float $amount): void
{
    if ($method->pay($amount)) {
        echo 'Paiement de ' . $amount . '€ par ' . $method->getName();
    }
}

// Fonctionne avec CreditCardPayment
processPayment(new CreditCardPayment(), 29.99);

// Fonctionne aussi avec PayPalPayment (s'il implémente l'interface)
processPayment(new PayPalPayment(), 29.99);
```

---

### Qu'est-ce qu'une classe abstraite ?

**Définition** : Une classe abstraite est une classe qui ne peut pas être instanciée directement. Elle sert de modèle pour d'autres classes et peut contenir à la fois des méthodes avec du code et des méthodes sans code (abstraites).

**Le problème que les classes abstraites résolvent** :

Sans classes abstraites, voici les problèmes rencontrés :

1. **Duplication de code** : Plusieurs classes partagent du code identique. Tu le copies-colles dans chaque classe.

2. **Instanciation incorrecte** : Une classe "de base" n'a pas de sens seule mais rien n'empêche de l'instancier.

3. **Pas de méthode forcée** : L'héritage classique ne force pas les sous-classes à implémenter certaines méthodes.

**Comment les classes abstraites résolvent ces problèmes** :

| Problème | Solution avec les classes abstraites |
| -------- | ------------------------------------ |
| Duplication de code | Le code commun est dans la classe abstraite |
| Instanciation incorrecte | `abstract` empêche l'instanciation directe |
| Pas de méthode forcée | Les méthodes `abstract` doivent être implémentées |

**Analogie concrète** : Une classe abstraite est comme un plan d'architecte pour un immeuble. Le plan définit les parties communes (escaliers, structure) et indique les emplacements vides ("ici, le propriétaire choisira le carrelage"). On ne peut pas habiter dans un plan, il faut d'abord construire un appartement concret à partir de ce plan.

---

### Syntaxe d'une classe abstraite

```php
<?php

namespace App\Notification;

abstract class AbstractNotification
{
    // Propriété classique : accessible par les sous-classes
    protected string $recipient;

    public function __construct(string $recipient)
    {
        $this->recipient = $recipient;
    }

    // Méthode concrète : contient du code, partagée par toutes les sous-classes
    public function formatMessage(string $message): string
    {
        return '[' . date('Y-m-d H:i') . '] ' . $message;
    }

    // Méthode abstraite : PAS de code, les sous-classes DOIVENT l'implémenter
    abstract public function send(string $message): bool;

    // Autre méthode abstraite
    abstract public function getType(): string;
}
```

**Utiliser la classe abstraite** :

```php
<?php

namespace App\Notification;

class EmailNotification extends AbstractNotification
{
    // OBLIGATOIRE : implémenter les méthodes abstraites
    public function send(string $message): bool
    {
        $formatted = $this->formatMessage($message); // Méthode héritée
        // Envoyer un email à $this->recipient avec $formatted
        return true;
    }

    public function getType(): string
    {
        return 'email';
    }
}

class SmsNotification extends AbstractNotification
{
    public function send(string $message): bool
    {
        $formatted = $this->formatMessage($message);
        // Envoyer un SMS à $this->recipient
        return true;
    }

    public function getType(): string
    {
        return 'sms';
    }
}
```

```php
<?php

// Interdit : on ne peut pas instancier une classe abstraite
// $notif = new AbstractNotification('test@mail.com'); // ERREUR

// Correct : on instancie une classe concrète
$email = new EmailNotification('test@mail.com');
$email->send('Bienvenue');

$sms = new SmsNotification('+33612345678');
$sms->send('Code : 1234');
```

---

### Comparaison interface vs classe abstraite

| Caractéristique | Interface | Classe abstraite |
| --------------- | --------- | ---------------- |
| Mot-clé | `interface` | `abstract class` |
| Code dans les méthodes | Non (jamais : RFC default methods déclinée) | Oui (méthodes concrètes) |
| Propriétés | Constantes ; depuis PHP 8.4 aussi des propriétés (`get`/`set`) | Oui |
| Constructeur | Possible mais fortement déconseillé (manuel PHP) | Oui |
| Héritage multiple | Oui (`implements A, B, C`) | Non (un seul `extends`) |
| Instanciation | Non | Non |
| Utilisation | Définir un contrat | Partager du code + forcer des méthodes |

**Quand utiliser quoi** :

- **Interface** : Quand tu veux qu'une classe respecte un contrat sans imposer d'implémentation. Plusieurs classes différentes, pas de code commun.
- **Classe abstraite** : Quand des classes partagent du code commun et que tu veux forcer certaines méthodes.
- **Les deux** : Une classe abstraite peut implémenter une interface.

Le diagramme suivant illustre les relations entre une interface, une classe abstraite et des classes concrètes :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-11-interfaces-classes-abstraites-1.html">Comparaison interface vs classe abstraite (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-11-interfaces-classes-abstraites-1.html" title="Comparaison interface vs classe abstraite" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

- Les lignes en pointillés (`<|..`) signifient "implémente l'interface"
- La ligne pleine (`<|--`) signifie "hérite de la classe abstraite"
- `CreditCard` implémente `PaymentInterface` et hérite de `AbstractPayment`
- `PayPal` implémente `PaymentInterface` directement

---

### Les interfaces dans Symfony

Symfony utilise massivement les interfaces. Voici les plus courantes :

| Interface | Utilisation |
| --------- | ----------- |
| `UserInterface` | Toute entité qui représente un utilisateur |
| `PasswordAuthenticatedUserInterface` | Utilisateur avec mot de passe |
| `FormTypeInterface` | Tout formulaire |
| `EventSubscriberInterface` | Écouter des événements |
| `NormalizerInterface` | Transformer un objet en tableau ou JSON (sérialisation) |

**Exemple Symfony : UserInterface** :

```php
<?php

namespace App\Entity;

use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;

// L'entité User DOIT implémenter ces interfaces pour la sécurité Symfony
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    // Méthodes imposées par UserInterface
    public function getRoles(): array
    {
        return ['ROLE_USER'];
    }

    // Méthode historique UserInterface (Symfony) : dépréciée depuis 7.3
    // (attribut #[Deprecated]), plus appelée automatiquement en 7.4.
    public function eraseCredentials(): void
    {
        // Nettoyer les données sensibles temporaires
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    // Méthode imposée par PasswordAuthenticatedUserInterface
    public function getPassword(): ?string
    {
        return $this->password;
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer une interface

Crée le fichier `src/Contract/ShapeInterface.php` :

```php
<?php

namespace App\Contract;

interface ShapeInterface
{
    // Toute forme doit pouvoir calculer son aire
    public function getArea(): float;

    // Toute forme doit pouvoir calculer son périmètre
    public function getPerimeter(): float;

    // Toute forme doit avoir un nom
    public function getName(): string;
}
```

---

### Étape 2 : Implémenter l'interface dans plusieurs classes

Crée `src/Shape/Circle.php` :

```php
<?php

namespace App\Shape;

use App\Contract\ShapeInterface;

class Circle implements ShapeInterface
{
    public function __construct(private float $radius)
    {
    }

    public function getArea(): float
    {
        return M_PI * $this->radius ** 2;
    }

    public function getPerimeter(): float
    {
        return 2 * M_PI * $this->radius;
    }

    public function getName(): string
    {
        return 'Cercle';
    }
}
```

Crée `src/Shape/Rectangle.php` :

```php
<?php

namespace App\Shape;

use App\Contract\ShapeInterface;

class Rectangle implements ShapeInterface
{
    public function __construct(
        private float $width,
        private float $height
    ) {
    }

    public function getArea(): float
    {
        return $this->width * $this->height;
    }

    public function getPerimeter(): float
    {
        return 2 * ($this->width + $this->height);
    }

    public function getName(): string
    {
        return 'Rectangle';
    }
}
```

---

### Étape 3 : Utiliser le type-hinting avec l'interface

Crée `src/Service/ShapeCalculator.php` :

```php
<?php

namespace App\Service;

use App\Contract\ShapeInterface;

class ShapeCalculator
{
    // Accepte n'importe quelle forme qui implémente ShapeInterface
    public function describe(ShapeInterface $shape): string
    {
        return sprintf(
            '%s : aire = %.2f, périmètre = %.2f',
            $shape->getName(),
            $shape->getArea(),
            $shape->getPerimeter()
        );
    }

    /**
     * @param ShapeInterface[] $shapes
     */
    public function totalArea(array $shapes): float
    {
        $total = 0;
        foreach ($shapes as $shape) {
            $total += $shape->getArea();
        }
        return $total;
    }
}
```

```php
<?php

// Utilisation
$calculator = new ShapeCalculator();
$circle = new Circle(5);
$rectangle = new Rectangle(4, 6);

echo $calculator->describe($circle);
// Cercle : aire = 78.54, périmètre = 31.42

echo $calculator->describe($rectangle);
// Rectangle : aire = 24.00, périmètre = 20.00

echo $calculator->totalArea([$circle, $rectangle]);
// 102.54
```

---

### Étape 4 : Créer une classe abstraite

Crée `src/Notification/AbstractNotification.php` :

```php
<?php

namespace App\Notification;

abstract class AbstractNotification
{
    protected \DateTimeImmutable $createdAt;

    public function __construct(protected string $recipient)
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // Méthode concrète : partagée par toutes les sous-classes
    public function formatMessage(string $message): string
    {
        return '[' . $this->createdAt->format('H:i') . '] ' . $message;
    }

    // Méthodes abstraites : chaque sous-classe DOIT les implémenter
    abstract public function send(string $message): bool;

    abstract public function getType(): string;
}
```

---

### Étape 5 : Hériter de la classe abstraite

Crée `src/Notification/EmailNotification.php` :

```php
<?php

namespace App\Notification;

class EmailNotification extends AbstractNotification
{
    public function send(string $message): bool
    {
        $formatted = $this->formatMessage($message);
        echo "Email envoyé à {$this->recipient} : {$formatted}\n";
        return true;
    }

    public function getType(): string
    {
        return 'email';
    }
}
```

Crée `src/Notification/SmsNotification.php` :

```php
<?php

namespace App\Notification;

class SmsNotification extends AbstractNotification
{
    public function send(string $message): bool
    {
        $formatted = $this->formatMessage($message);
        echo "SMS envoyé à {$this->recipient} : {$formatted}\n";
        return true;
    }

    public function getType(): string
    {
        return 'sms';
    }
}
```

---

### Étape 6 : Combiner interface et classe abstraite

```php
<?php

namespace App\Contract;

// L'interface définit le contrat
interface NotificationInterface
{
    public function send(string $message): bool;

    public function getType(): string;
}
```

```php
<?php

namespace App\Notification;

use App\Contract\NotificationInterface;

// La classe abstraite implémente l'interface ET fournit du code commun
abstract class AbstractNotification implements NotificationInterface
{
    protected \DateTimeImmutable $createdAt;

    public function __construct(protected string $recipient)
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function formatMessage(string $message): string
    {
        return '[' . $this->createdAt->format('H:i') . '] ' . $message;
    }

    // send() et getType() restent abstraites
    // Elles seront implémentées par les sous-classes concrètes
}
```

---

## Commandes Utiles

| Syntaxe | Description |
| ------- | ----------- |
| `interface NomInterface` | Déclarer une interface |
| `class A implements NomInterface` | Implémenter une interface |
| `class A implements B, C` | Implémenter plusieurs interfaces |
| `abstract class NomClasse` | Déclarer une classe abstraite |
| `abstract public function method(): void` | Déclarer une méthode abstraite |
| `class A extends AbstractClass` | Hériter d'une classe abstraite |

---

## Pièges Fréquents

### Piège 1 : Oublier d'implémenter toutes les méthodes

**Problème** : Erreur "Class must implement all abstract methods".

**Solution** : Implémenter chaque méthode déclarée dans l'interface ou la classe abstraite.

```php
<?php

interface AnimalInterface
{
    public function getName(): string;

    public function getSound(): string;
}

// ❌ Erreur : getSound() n'est pas implémentée
// class Dog implements AnimalInterface
// {
//     public function getName(): string { return 'Chien'; }
// }

// ✅ Correct : toutes les méthodes sont implémentées
class Dog implements AnimalInterface
{
    public function getName(): string
    {
        return 'Chien';
    }

    public function getSound(): string
    {
        return 'Wouf';
    }
}
```

---

### Piège 2 : Signature incompatible

**Problème** : Erreur "Déclaration must be compatible".

**Solution** : La signature (paramètres et type de retour) doit correspondre exactement.

```php
<?php

interface RepositoryInterface
{
    public function find(int $id): ?object;
}

// ❌ Erreur : le type de retour ne correspond pas
// class ProductRepository implements RepositoryInterface
// {
//     public function find(int $id): object { } // Manque le "?"
// }

// ✅ Correct
class ProductRepository implements RepositoryInterface
{
    public function find(int $id): ?object
    {
        return null;
    }
}
```

---

### Piège 3 : Instancier une classe abstraite

**Problème** : Erreur "Cannot instantiate abstract class".

**Solution** : Instancier une sous-classe concrète.

```php
<?php

// ❌ Interdit
// $notif = new AbstractNotification('test@mail.com');

// ✅ Correct
$notif = new EmailNotification('test@mail.com');
```

---

## Checklist de Validation

- [ ] Je comprends qu'une interface est un contrat (méthodes sans code)
- [ ] Je sais créer une interface avec `interface`
- [ ] Je sais implémenter une interface avec `implements`
- [ ] Je sais qu'une classe peut implémenter plusieurs interfaces
- [ ] Je comprends le type-hinting avec une interface
- [ ] Je comprends qu'une classe abstraite mélange code et méthodes abstraites
- [ ] Je sais créer une classe abstraite avec `abstract class`
- [ ] Je connais la différence entre interface et classe abstraite
- [ ] Je comprends pourquoi Symfony utilise des interfaces

---

## Exercice Pratique

**Énoncé** : Crée un système de stockage de fichiers avec interface et classe abstraite.

**Spécifications** :

1. Interface `StorageInterface` avec les méthodes :
   - `save(string $filename, string $content): bool`
   - `read(string $filename): ?string`
   - `delete(string $filename): bool`
   - `exists(string $filename): bool`

2. Classe abstraite `AbstractStorage` qui implémente `StorageInterface` et fournit :
   - Une propriété `$basePath` (chemin de base)
   - Un constructeur qui initialise `$basePath`
   - Une méthode concrète `getFullPath(string $filename): string` qui retourne `$basePath . '/' . $filename`

3. Classe concrète `LocalStorage` qui hérite de `AbstractStorage` et implémente le stockage sur le disque local

4. Classe concrète `MemoryStorage` qui hérite de `AbstractStorage` et stocke les fichiers dans un tableau PHP (en mémoire)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Interface `StorageInterface`** :

```php
<?php

namespace App\Contract;

interface StorageInterface
{
    public function save(string $filename, string $content): bool;

    public function read(string $filename): ?string;

    public function delete(string $filename): bool;

    public function exists(string $filename): bool;
}
```

**Classe abstraite `AbstractStorage`** :

```php
<?php

namespace App\Storage;

use App\Contract\StorageInterface;

abstract class AbstractStorage implements StorageInterface
{
    public function __construct(protected string $basePath)
    {
    }

    // Méthode concrète partagée
    public function getFullPath(string $filename): string
    {
        return $this->basePath . '/' . $filename;
    }
}
```

**Classe `LocalStorage`** :

```php
<?php

namespace App\Storage;

class LocalStorage extends AbstractStorage
{
    public function save(string $filename, string $content): bool
    {
        $path = $this->getFullPath($filename);
        return file_put_contents($path, $content) !== false;
    }

    public function read(string $filename): ?string
    {
        $path = $this->getFullPath($filename);
        if (!file_exists($path)) {
            return null;
        }
        return file_get_contents($path);
    }

    public function delete(string $filename): bool
    {
        $path = $this->getFullPath($filename);
        if (!file_exists($path)) {
            return false;
        }
        return unlink($path);
    }

    public function exists(string $filename): bool
    {
        return file_exists($this->getFullPath($filename));
    }
}
```

**Classe `MemoryStorage`** :

```php
<?php

namespace App\Storage;

class MemoryStorage extends AbstractStorage
{
    private array $files = [];

    public function save(string $filename, string $content): bool
    {
        $path = $this->getFullPath($filename);
        $this->files[$path] = $content;
        return true;
    }

    public function read(string $filename): ?string
    {
        $path = $this->getFullPath($filename);
        return $this->files[$path] ?? null;
    }

    public function delete(string $filename): bool
    {
        $path = $this->getFullPath($filename);
        if (!isset($this->files[$path])) {
            return false;
        }
        unset($this->files[$path]);
        return true;
    }

    public function exists(string $filename): bool
    {
        $path = $this->getFullPath($filename);
        return isset($this->files[$path]);
    }
}
```

**Utilisation** :

```php
<?php

// Les deux classes s'utilisent de la même façon grâce à l'interface
function uploadFile(StorageInterface $storage, string $name, string $content): void
{
    if ($storage->save($name, $content)) {
        echo "Fichier {$name} sauvegardé\n";
    }
}

$local = new LocalStorage('/var/uploads');
$memory = new MemoryStorage('/tmp');

uploadFile($local, 'photo.jpg', '...');    // Stocke sur le disque
uploadFile($memory, 'photo.jpg', '...');   // Stocke en mémoire
```

---

## Navigation

← Fiche précédente : **[Les attributs PHP (annotations modernes)](10-attributs-php.md)**

→ Fiche suivante : **[Les traits](12-traits.md)**
