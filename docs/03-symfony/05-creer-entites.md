---
tags:
  - Symfony
  - Intermédiaire
  - Pratique
description: "Créer des entités"
estimated_time: "65 min"
fiche_number: 5
total_fiches: 21
cursus: "Symfony"
---

# 05 - Créer des entités

> **En bref** : À la fin de cette fiche, tu sauras créer une entité Doctrine avec la commande make:entity et comprendre le code généré. Lecture estimée : 65 min.


## Prérequis

- Avoir lu la fiche **[04 - Introduction à Doctrine](04-introduction-doctrine.md)**
- Comprendre les classes PHP (fiche **[02-php/07 - Introduction à la POO](../02-php/07-introduction-poo.md)**)
- Comprendre les getters/setters (fiche **[02-php/08 - Les classes en détail](../02-php/08-classes-en-detail.md)**)
- Comprendre les attributs PHP (fiche **[02-php/10 - Les attributs PHP](../02-php/10-attributs-php.md)**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une entité Doctrine avec la commande `make:entity` et comprendre le code généré.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### La commande make:entity

**Définition** : `make:entity` est une commande Symfony qui génère automatiquement le code d'une entité avec un assistant interactif.

**Le problème que make:entity résout** :

Sans `make:entity`, tu devrais écrire manuellement :

1. La classe avec le bon namespace
2. Tous les attributs Doctrine (`#[ORM\Entity]`, `#[ORM\Column]`, etc.)
3. Les propriétés avec leurs types
4. Les getters et setters
5. Le fichier repository associé

**Comment make:entity résout ce problème** :

| Tâche manuelle | Solution make:entity |
| -------------- | -------------------- |
| Créer la classe | Génère le fichier avec le bon namespace |
| Écrire les attributs | Ajoute les attributs corrects selon tes réponses |
| Créer les propriétés | Génère les propriétés avec les bons types |
| Écrire getters/setters | Génère automatiquement tous les accesseurs |

**Analogie concrète** : Imagine un formulaire en ligne avec des cases à remplir. Tu réponds aux questions (nom, type, longueur...) et le système génère automatiquement un document complet et correctement formaté. `make:entity` fonctionne de la même façon : tu réponds aux questions, il génère le code.

---

### Les types de colonnes Doctrine

Doctrine propose de nombreux types pour les colonnes. Voici les plus courants :

**Types de base** :

| Type Doctrine | Type PHP | Type SQL (PostgreSQL) | Usage |
| ------------- | -------- | --------------------- | ----- |
| `string` | `string` | VARCHAR | Texte court (max 255 car.) |
| `text` | `string` | TEXT | Texte long (sans limite) |
| `integer` | `int` | INT | Nombre entier |
| `smallint` | `int` | SMALLINT | Petit nombre (-32768 à 32767) |
| `bigint` | `string` | BIGINT | Très grand nombre |
| `boolean` | `bool` | BOOLEAN | Vrai/Faux |
| `float` | `float` | DOUBLE PRECISION | Nombre décimal (approximatif) |
| `decimal` | `string` | DECIMAL | Nombre décimal (précis, pour l'argent) |

**Types de date** :

| Type Doctrine | Type PHP | Type SQL | Usage |
| ------------- | -------- | -------- | ----- |
| `datetime` | `\DateTime` | TIMESTAMP | Date + heure |
| `datetime_immutable` | `\DateTimeImmutable` | TIMESTAMP | Date + heure (non modifiable) |
| `date` | `\DateTime` | DATE | Date seule |
| `time` | `\DateTime` | TIME | Heure seule |

**Types spéciaux** :

| Type Doctrine | Type PHP | Type SQL | Usage |
| ------------- | -------- | -------- | ----- |
| `json` | `array` | JSON | Données structurées (tableau, objet) |
| `guid` | `string` | UUID | Identifiant unique universel (format classique) |
| `uuid` | `Symfony\Component\Uid\Uuid` | UUID | UUID natif Symfony (recommandé en Symfony 7.x) |
| `ulid` | `Symfony\Component\Uid\Ulid` | VARCHAR(26) | ULID - UUID trié chronologiquement, recommandé pour les clés primaires hautes performances |

> **Note** : l'ancien type `array` (sérialisation PHP) a été supprimé dans Doctrine DBAL 4, la version installée avec l'ORM 3.x de référence. Utilise `json` pour stocker un tableau ou un objet.
>
> **Recommandation Symfony 7.x** : pour les identifiants, préfère `uuid` ou `ulid` à l'auto-increment entier. Un ULID est trié par date de création, ce qui évite la fragmentation des index. Installe le composant avec `composer require symfony/uid`.

---

### Les options de colonnes

Chaque colonne peut avoir des options supplémentaires :

| Option | Valeur | Description |
| ------ | ------ | ----------- |
| `length` | Nombre | Longueur max (pour string) |
| `nullable` | true/false | Accepte NULL ou non |
| `unique` | true/false | Valeur unique dans la table |
| `precision` | Nombre | Chiffres totaux (pour decimal) |
| `scale` | Nombre | Chiffres après virgule (pour decimal) |

**Exemples** :

```php
// String de 100 caractères max
#[ORM\Column(type: 'string', length: 100)]

// Champ optionnel (peut être vide)
#[ORM\Column(type: 'string', nullable: true)]

// Email unique
#[ORM\Column(type: 'string', length: 180, unique: true)]

// Prix avec 2 décimales (ex: 1234567.89)
#[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
```

---

### Structure d'une entité complète

Voici la structure complète d'une entité générée par `make:entity` :

```php
<?php
// src/Entity/Product.php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    // ========================================
    // 1. PROPRIÉTÉS
    // ========================================

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    // ========================================
    // 2. GETTERS ET SETTERS
    // ========================================

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

    public function getPrice(): ?string
    {
        return $this->price;
    }

    public function setPrice(string $price): static
    {
        $this->price = $price;
        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): static
    {
        $this->description = $description;
        return $this;
    }
}
```

**Points importants** :

1. **L'attribut `#[ORM\Entity]`** : Déclare la classe comme une entité Doctrine
2. **`repositoryClass: ProductRepository::class`** : Associe un repository personnalisé
3. **Pas de setter pour `$id`** : L'ID est généré automatiquement par la base
4. **`return $this`** : Les setters renvoient l'objet pour permettre le chaînage
5. **`Types::TEXT`, `Types::DECIMAL`** : pour les types autres que `string`, `make:entity` utilise les constantes de la classe `Types` et ajoute l'import `use Doctrine\DBAL\Types\Types;` automatiquement. `Types::TEXT` vaut la chaîne `'text'` : les deux écritures sont équivalentes.

**Le chaînage des setters** :

```php
// Grâce à "return $this", on peut chaîner les appels
$product = new Product();
$product
    ->setName('Clavier')
    ->setPrice('49.99')
    ->setDescription('Un clavier mécanique');
```

---

### Le Repository généré

Quand tu crées une entité, un repository est automatiquement créé dans `src/Repository/`.

**Structure du repository** :

```php
<?php
// src/Repository/ProductRepository.php

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

    // Tu peux ajouter des méthodes personnalisées ici
}
```

Le repository hérite de méthodes par défaut : `find()`, `findAll()`, `findBy()`, `findOneBy()`.

---

## Étapes Pratiques

### Étape 1 : Créer une entité avec make:entity

Lance la commande :

```bash
php bin/console make:entity
```

**Dialogue interactif** (exemple pour créer une entité `Book`) :

```text
Class name of the entity to create or update (e.g. GentlePizza):
> Book

created: src/Entity/Book.php
created: src/Repository/BookRepository.php

Entity generated! Now let's add some fields.
You can always add more fields later manually or by re-running this command.

New property name (press <return> to stop adding fields):
>
```

---

### Étape 2 : Ajouter une propriété string

À la question "New property name", tape le nom de la propriété :

```text
New property name (press <return> to stop adding fields):
> title

Field type (enter ? to see all types) [string]:
> string

Field length [255]:
> 255

Can this field be null in the database (nullable) (yes/no) [no]:
> no

updated: src/Entity/Book.php

Add another property? Enter the property name (or press <return> to stop adding fields):
>
```

**Ce qui a été généré** :

```php
#[ORM\Column(length: 255)]
private ?string $title = null;

public function getTitle(): ?string
{
    return $this->title;
}

public function setTitle(string $title): static
{
    $this->title = $title;
    return $this;
}
```

---

### Étape 3 : Ajouter une propriété text (nullable)

Continue à ajouter des propriétés :

```text
Add another property? Enter the property name:
> description

Field type [string]:
> text

Can this field be null in the database (nullable) (yes/no) [no]:
> yes

updated: src/Entity/Book.php
```

**Ce qui a été généré** :

```php
#[ORM\Column(type: Types::TEXT, nullable: true)]
private ?string $description = null;

public function getDescription(): ?string
{
    return $this->description;
}

public function setDescription(?string $description): static
{
    $this->description = $description;
    return $this;
}
```

**Note** : Le paramètre du setter est `?string` (avec `?`) car le champ est nullable.

---

### Étape 4 : Ajouter une propriété integer

```text
Add another property? Enter the property name:
> pageCount

Field type [string]:
> integer

Can this field be null in the database (nullable) (yes/no) [no]:
> no

updated: src/Entity/Book.php
```

**Ce qui a été généré** :

```php
#[ORM\Column]
private ?int $pageCount = null;

public function getPageCount(): ?int
{
    return $this->pageCount;
}

public function setPageCount(int $pageCount): static
{
    $this->pageCount = $pageCount;
    return $this;
}
```

---

### Étape 5 : Ajouter une propriété decimal (prix)

```text
Add another property? Enter the property name:
> price

Field type [string]:
> decimal

Precision (total number of digits stored) [10]:
> 10

Scale (number of decimals to store) [0]:
> 2

Can this field be null in the database (nullable) (yes/no) [no]:
> no

updated: src/Entity/Book.php
```

**Explication précision/scale** :

- `precision: 10` = 10 chiffres au total
- `scale: 2` = 2 chiffres après la virgule
- Exemple : `12345678.99` (8 chiffres + 2 décimales = 10)

**Ce qui a été généré** :

```php
#[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
private ?string $price = null;
```

**Note** : Les valeurs décimales sont stockées comme `string` en PHP pour préserver la précision.

---

### Étape 6 : Ajouter une propriété datetime

```text
Add another property? Enter the property name:
> publishedAt

Field type [string]:
> datetime_immutable

Can this field be null in the database (nullable) (yes/no) [no]:
> yes

updated: src/Entity/Book.php
```

**Ce qui a été généré** :

```php
#[ORM\Column(nullable: true)]
private ?\DateTimeImmutable $publishedAt = null;

public function getPublishedAt(): ?\DateTimeImmutable
{
    return $this->publishedAt;
}

public function setPublishedAt(?\DateTimeImmutable $publishedAt): static
{
    $this->publishedAt = $publishedAt;
    return $this;
}
```

---

### Étape 7 : Ajouter une propriété boolean

```text
Add another property? Enter the property name:
> isAvailable

Field type [string]:
> boolean

Can this field be null in the database (nullable) (yes/no) [no]:
> no

updated: src/Entity/Book.php
```

**Ce qui a été généré** :

```php
#[ORM\Column]
private ?bool $isAvailable = null;

public function isAvailable(): ?bool
{
    return $this->isAvailable;
}

public function setIsAvailable(bool $isAvailable): static
{
    $this->isAvailable = $isAvailable;
    return $this;
}
```

**Note** : Pour un booléen, `make:entity` retire le préfixe `is` uniquement pour le getter (`isAvailable()` et non `getIsAvailable()`), mais le conserve pour le setter (`setIsAvailable()`).

---

### Étape 8 : Terminer la création

Appuie sur Entrée sans rien taper pour terminer :

```text
Add another property? Enter the property name (or press <return> to stop adding fields):
> (Entrée)

Success!

Next: When you're ready, create a migration with php bin/console make:migration
```

---

### Étape 9 : Vérifier l'entité générée

Ouvre le fichier `src/Entity/Book.php` pour voir le résultat complet.

Le fichier `src/Repository/BookRepository.php` a également été créé.

---

### Étape 10 : Ajouter une propriété à une entité existante

Tu peux relancer `make:entity` avec le même nom pour ajouter des propriétés :

```bash
php bin/console make:entity Book
```

Doctrine détecte que l'entité existe et te propose d'ajouter de nouvelles propriétés.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:entity` | Créer ou modifier une entité |
| `php bin/console make:entity --regenerate` | Régénérer les getters/setters |
| `php bin/console doctrine:schema:validate` | Vérifier la synchronisation |

---

## Pièges Fréquents

### Piège 1 : Oublier de créer la migration

**Problème** : L'entité existe mais la table n'existe pas en base.

**Cause** : Créer l'entité ne crée pas automatiquement la table.

**Solution** : Après `make:entity`, crée et exécute une migration :

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

Voir la fiche suivante pour les détails sur les migrations.

---

### Piège 2 : Nom de propriété avec underscore

**Problème** : Tu veux une colonne `page_count` mais tu tapes `page_count` comme nom de propriété.

**Cause** : En PHP, les propriétés utilisent le camelCase.

**Solution** : Utilise le camelCase pour les propriétés PHP. Doctrine génère automatiquement le nom de colonne en snake_case.

```text
Propriété PHP : pageCount (camelCase)
Colonne SQL  : page_count (snake_case automatique)
```

---

### Piège 3 : Modifier manuellement sans mettre à jour la base

**Problème** : Tu modifies l'entité à la main et tu obtiens des erreurs.

**Cause** : La base de données n'est plus synchronisée avec l'entité.

**Solution** :

```bash
# Vérifier l'état
php bin/console doctrine:schema:validate

# Créer une migration pour les changements
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

### Piège 4 : Type decimal et calculs

**Problème** : Tu veux faire des calculs avec un prix decimal mais PHP le considère comme un string.

**Cause** : Doctrine stocke les valeurs décimales comme `string` pour préserver la précision.

**Solution** : Convertir en float pour les calculs (avec perte de précision acceptable) :

```php
$price = (float) $book->getPrice();
$total = $price * $quantity;

// Ou utiliser une bibliothèque comme BCMath pour la précision
$total = bcmul($book->getPrice(), (string) $quantity, 2);
```

---

### Piège 5 : Champ unique qui génère des erreurs

**Problème** : Erreur "Duplicate entry" lors de l'ajout d'un enregistrement.

**Cause** : Tu essaies d'insérer une valeur qui existe déjà dans un champ `unique`.

**Solution** : Vérifier si la valeur existe avant d'insérer, ou utiliser un try/catch :

```php
// Vérifier avant d'insérer
$existing = $repository->findOneBy(['isbn' => $isbn]);
if ($existing) {
    // Le livre existe déjà
}
```

---

## Checklist de Validation

- [ ] Je sais lancer `make:entity` et répondre aux questions
- [ ] Je connais les types courants : string, text, integer, decimal, boolean, datetime
- [ ] Je comprends la différence entre nullable et non-nullable
- [ ] Je sais ajouter une propriété à une entité existante
- [ ] Je comprends le code généré (attributs, getters, setters)
- [ ] Je sais que la création d'entité nécessite une migration ensuite

---

## Exercice Pratique

**Énoncé** : Crée une entité `Article` pour un blog avec les propriétés suivantes :

| Propriété | Type | Nullable | Description |
| --------- | ---- | -------- | ----------- |
| `title` | string (255) | Non | Titre de l'article |
| `content` | text | Non | Contenu de l'article |
| `summary` | string (500) | Oui | Résumé optionnel |
| `createdAt` | datetime_immutable | Non | Date de création |
| `updatedAt` | datetime_immutable | Oui | Date de modification |
| `viewCount` | integer | Non | Nombre de vues |
| `isPublished` | boolean | Non | Article publié ou non |

**Étapes** :

1. Lance `php bin/console make:entity Article`
2. Ajoute chaque propriété avec les bons types et options
3. Vérifie le fichier généré

**Résultat attendu** : Un fichier `src/Entity/Article.php` avec toutes les propriétés et leurs accesseurs.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Commandes à exécuter** :

```bash
php bin/console make:entity Article
```

**Dialogue complet** :

```text
Class name of the entity to create or update:
> Article

New property name:
> title
Field type [string]:
> string
Field length [255]:
> 255
Can this field be null in the database (nullable) [no]:
> no

New property name:
> content
Field type [string]:
> text
Can this field be null in the database (nullable) [no]:
> no

New property name:
> summary
Field type [string]:
> string
Field length [255]:
> 500
Can this field be null in the database (nullable) [no]:
> yes

New property name:
> createdAt
Field type [string]:
> datetime_immutable
Can this field be null in the database (nullable) [no]:
> no

New property name:
> updatedAt
Field type [string]:
> datetime_immutable
Can this field be null in the database (nullable) [no]:
> yes

New property name:
> viewCount
Field type [string]:
> integer
Can this field be null in the database (nullable) [no]:
> no

New property name:
> isPublished
Field type [string]:
> boolean
Can this field be null in the database (nullable) [no]:
> no

New property name:
> (Entrée pour terminer)
```

**Fichier généré `src/Entity/Article.php`** :

```php
<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ArticleRepository::class)]
class Article
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT)]
    private ?string $content = null;

    #[ORM\Column(length: 500, nullable: true)]
    private ?string $summary = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column]
    private ?int $viewCount = null;

    #[ORM\Column]
    private ?bool $isPublished = null;

    // ... getters et setters générés automatiquement
}
```

**Vérification** :

```bash
php bin/console doctrine:schema:validate
```

---

## Navigation

← Fiche précédente : **[Introduction à Doctrine](04-introduction-doctrine.md)**

→ Fiche suivante : **[Les migrations](06-migrations.md)**
