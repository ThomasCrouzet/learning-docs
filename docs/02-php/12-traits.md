---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les traits"
estimated_time: "40 min"
fiche_number: 12
total_fiches: 14
cursus: "PHP"
---

# 12 - Les traits

> **En bref** : À la fin de cette fiche, tu sauras créer et utiliser des traits en PHP pour partager du code entre des classes qui n'ont pas de lien d'héritage. Tu comprendras pourquoi on crée des traits dans une application Doctrine pour factoriser des besoins récurrents comme les dates de création et de modification. Lecture estimée : 40 min.


## Prérequis

- Fiche **[08 - Les classes en détail](08-classes-en-detail.md)**
- Fiche **[11 - Interfaces et classes abstraites](11-interfaces-classes-abstraites.md)**
- Comprendre l'héritage et les interfaces

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des traits en PHP pour partager du code entre des classes qui n'ont pas de lien d'héritage. Tu comprendras pourquoi on crée des traits dans une application Doctrine pour factoriser des besoins récurrents comme les dates de création et de modification.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un trait ?

**Définition** : Un trait est un mécanisme de réutilisation de code. Il permet de copier des méthodes et des propriétés dans une classe, sans utiliser l'héritage.

**Le problème que les traits résolvent** :

Sans traits, voici les problèmes rencontrés :

1. **Héritage simple** : PHP ne permet d'hériter que d'une seule classe. Si deux classes non liées ont besoin du même code, tu ne peux pas les faire hériter d'une classe commune.

2. **Duplication de code** : Tu copies-colles les mêmes méthodes dans plusieurs classes.

3. **Maintenance difficile** : Si tu corriges un bug dans le code dupliqué, tu dois modifier chaque copie.

**Comment les traits résolvent ces problèmes** :

| Problème | Solution avec les traits |
| -------- | ------------------------ |
| Héritage simple | Un trait est indépendant de l'héritage |
| Duplication de code | Le code est écrit une seule fois dans le trait |
| Maintenance | Modifier le trait met à jour toutes les classes |

**Analogie concrète** : Un trait est comme une recette de sauce. Tu peux utiliser la même recette de sauce tomate dans un plat de pâtes, une pizza ou une lasagne. Ces trois plats sont différents (pas de lien de parenté), mais ils partagent la même sauce. Le trait permet de "verser" le même code dans des classes différentes.

**Ce qu'un trait n'est PAS** :

- Un trait n'est pas une classe. Il ne peut pas être instancié (`new MonTrait()` provoque une erreur).
- Un trait n'est pas une interface. Il contient du code concret (méthodes avec corps).

**Comparaison trait, interface et classe abstraite** :

| Caractéristique | Trait | Interface | Classe abstraite |
| --------------- | ----- | --------- | ---------------- |
| Contient du code | Oui | Non | Oui (partiel) |
| Peut être instancié | Non | Non | Non |
| Héritage nécessaire | Non (`use`) | Non (`implements`) | Oui (`extends`) |
| Multiple | Oui (plusieurs `use`) | Oui (plusieurs `implements`) | Non (un seul `extends`) |
| Propriétés | Oui | Non | Oui |

---

### Syntaxe des traits

**Déclarer un trait** :

```php
<?php

namespace App\Trait;

trait TimestampableTrait
{
    private \DateTimeImmutable $createdAt;
    private ?\DateTimeImmutable $updatedAt = null;

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): void
    {
        $this->createdAt = $createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): void
    {
        $this->updatedAt = $updatedAt;
    }

    // Initialise les dates automatiquement
    public function initializeTimestamps(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }
}
```

**Utiliser un trait dans une classe** :

```php
<?php

namespace App\Entity;

use App\Trait\TimestampableTrait;

class Product
{
    // Le mot-clé "use" à l'intérieur d'une classe importe un trait
    use TimestampableTrait;

    public function __construct(private string $name)
    {
        $this->initializeTimestamps(); // Méthode du trait
    }
}
```

```php
<?php

// Utilisation : Product a maintenant les méthodes du trait
$product = new Product('Clavier');
echo $product->getCreatedAt()->format('Y-m-d'); // 2025-12-15
```

---

### Utiliser plusieurs traits

```php
<?php

namespace App\Trait;

trait SoftDeletableTrait
{
    private ?\DateTimeImmutable $deletedAt = null;

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    public function softDelete(): void
    {
        $this->deletedAt = new \DateTimeImmutable();
    }
}

trait SlugTrait
{
    private string $slug;

    public function getSlug(): string
    {
        return $this->slug;
    }

    public function generateSlug(string $text): void
    {
        $this->slug = strtolower(
            preg_replace('/[^a-zA-Z0-9]+/', '-', $text)
        );
    }
}
```

```php
<?php

namespace App\Entity;

use App\Trait\TimestampableTrait;
use App\Trait\SoftDeletableTrait;
use App\Trait\SlugTrait;

class Article
{
    // Plusieurs traits séparés par des virgules ou plusieurs "use"
    use TimestampableTrait;
    use SoftDeletableTrait;
    use SlugTrait;

    public function __construct(private string $title)
    {
        $this->initializeTimestamps();
        $this->generateSlug($title);
    }
}
```

```php
<?php

$article = new Article('Mon Premier Article');
echo $article->getSlug();          // mon-premier-article
var_dump($article->isDeleted());   // bool(false)
$article->softDelete();
var_dump($article->isDeleted());   // bool(true)
```

---

### Traits et Doctrine

On peut créer des traits réutilisables pour ses entités Doctrine :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    // Propriétés ajoutées manuellement (même logique qu'un trait)
    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }

    // Getters et setters pour createdAt et updatedAt...
}
```

**Avec un trait personnalisé**, tu évites de réécrire ce code dans chaque entité :

```php
<?php

namespace App\Trait;

use Doctrine\ORM\Mapping as ORM;

trait DoctrineTimestampableTrait
{
    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    #[ORM\PrePersist]
    public function initializeCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
```

```php
<?php

namespace App\Entity;

use App\Trait\DoctrineTimestampableTrait;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Product
{
    use DoctrineTimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;
}

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Category
{
    use DoctrineTimestampableTrait;  // Même trait, même code

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private string $name;
}
```

---

## Étapes Pratiques

### Étape 1 : Créer un trait basique

Crée le fichier `src/Trait/HasNameTrait.php` :

```php
<?php

namespace App\Trait;

trait HasNameTrait
{
    private string $name;

    public function getName(): string
    {
        return $this->name;
    }

    public function setName(string $name): void
    {
        $this->name = $name;
    }
}
```

---

### Étape 2 : Utiliser le trait dans plusieurs classes

```php
<?php

namespace App\Entity;

use App\Trait\HasNameTrait;

class Product
{
    use HasNameTrait;

    public function __construct(string $name, private float $price)
    {
        $this->name = $name;
    }
}

class Category
{
    use HasNameTrait;

    public function __construct(string $name)
    {
        $this->name = $name;
    }
}
```

```php
<?php

$product = new Product('Clavier', 49.99);
$category = new Category('Informatique');

echo $product->getName();  // Clavier
echo $category->getName(); // Informatique
```

---

### Étape 3 : Trait avec Doctrine

Crée `src/Trait/DoctrineTimestampableTrait.php` pour tes entités :

```php
<?php

namespace App\Trait;

use Doctrine\ORM\Mapping as ORM;

trait DoctrineTimestampableTrait
{
    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    public function getCreatedAt(): \DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    #[ORM\PrePersist]
    public function initializeCreatedAt(): void
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function updateTimestamp(): void
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
}
```

Utilise-le dans une entité :

```php
<?php

namespace App\Entity;

use App\Trait\DoctrineTimestampableTrait;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]  // Nécessaire pour PrePersist et PreUpdate
class Product
{
    use DoctrineTimestampableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;
}
```

**Résultat** : La table `product` aura automatiquement les colonnes `created_at` et `updated_at`.

---

## Commandes Utiles

| Syntaxe | Description |
| ------- | ----------- |
| `trait NomDuTrait { }` | Déclarer un trait |
| `use NomDuTrait;` | Utiliser un trait dans une classe |
| `use TraitA, TraitB;` | Utiliser plusieurs traits |

---

## Pièges Fréquents

### Piège 1 : Conflit de noms entre traits

**Problème** : Deux traits ont une méthode avec le même nom.

**Solution** : Utiliser `insteadof` pour choisir et `as` pour renommer.

```php
<?php

trait TraitA
{
    public function hello(): string
    {
        return 'Hello de A';
    }
}

trait TraitB
{
    public function hello(): string
    {
        return 'Hello de B';
    }
}

class MyClass
{
    use TraitA, TraitB {
        TraitA::hello insteadof TraitB; // Utiliser hello() de TraitA
        TraitB::hello as helloB;        // Renommer hello() de TraitB
    }
}

$obj = new MyClass();
echo $obj->hello();   // Hello de A
echo $obj->helloB();  // Hello de B
```

---

### Piège 2 : Confondre use pour import et use pour trait

**Problème** : Le mot-clé `use` a deux usages différents.

**Solution** : `use` en haut du fichier importe une classe. `use` dans une classe importe un trait.

```php
<?php

namespace App\Entity;

// "use" en haut du fichier : import de namespace
use App\Trait\TimestampableTrait;
use Doctrine\ORM\Mapping as ORM;

class Product
{
    // "use" dans la classe : import de trait
    use TimestampableTrait;
}
```

---

### Piège 3 : Oublier HasLifecycleCallbacks avec Doctrine

**Problème** : Les méthodes `#[ORM\PrePersist]` et `#[ORM\PreUpdate]` du trait ne sont pas appelées.

**Solution** : Ajouter `#[ORM\HasLifecycleCallbacks]` sur la classe.

```php
<?php

// ❌ Les lifecycle callbacks du trait ne fonctionnent pas
#[ORM\Entity]
class Product
{
    use DoctrineTimestampableTrait;
}

// ✅ Correct
#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Product
{
    use DoctrineTimestampableTrait;
}
```

---

## Checklist de Validation

- [ ] Je comprends qu'un trait est un bloc de code réutilisable
- [ ] Je sais déclarer un trait avec `trait`
- [ ] Je sais utiliser un trait dans une classe avec `use`
- [ ] Je sais utiliser plusieurs traits dans une même classe
- [ ] Je comprends la différence entre trait, interface et classe abstraite
- [ ] Je sais créer un trait Doctrine avec `#[ORM\PrePersist]`
- [ ] Je sais résoudre les conflits de noms avec `insteadof` et `as`

---

## Exercice Pratique

**Énoncé** : Crée un trait `SoftDeletableTrait` pour tes entités Doctrine.

**Spécifications** :

1. Le trait ajoute une propriété `$deletedAt` (nullable `DateTimeImmutable`)
2. Méthode `softDelete()` : met la date actuelle dans `$deletedAt`
3. Méthode `restore()` : remet `$deletedAt` à null
4. Méthode `isDeleted()` : retourne `true` si `$deletedAt` n'est pas null
5. Attribut Doctrine `#[ORM\Column(nullable: true)]` sur la propriété

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Trait/SoftDeletableTrait.php

namespace App\Trait;

use Doctrine\ORM\Mapping as ORM;

trait SoftDeletableTrait
{
    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function softDelete(): void
    {
        $this->deletedAt = new \DateTimeImmutable();
    }

    public function restore(): void
    {
        $this->deletedAt = null;
    }

    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }
}
```

**Utilisation dans une entité** :

```php
<?php
// src/Entity/Article.php

namespace App\Entity;

use App\Trait\DoctrineTimestampableTrait;
use App\Trait\SoftDeletableTrait;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\HasLifecycleCallbacks]
class Article
{
    use DoctrineTimestampableTrait;
    use SoftDeletableTrait;

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $title;

    // Pour exclure les articles supprimés dans le repository :
    // $qb->andWhere('a.deletedAt IS NULL')
}
```

---

## Navigation

← Fiche précédente : **[Les interfaces et les classes abstraites](11-interfaces-classes-abstraites.md)**

→ Fiche suivante : **[Les exceptions et la gestion d'erreurs](13-exceptions-gestion-erreurs.md)**
