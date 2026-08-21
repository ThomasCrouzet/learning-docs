---
tags:
  - API
  - Intermédiaire
  - Pratique
description: "Installer API Platform dans Symfony, créer des ressources CRUD automatiques, personnaliser la sérialisation et les filtres."
estimated_time: "90 min"
fiche_number: 5
total_fiches: 10
cursus: "API Design et Documentation"
id: "web.api-design.api-platform-introduction"
course_id: "web.api-design"
content_type: "lesson"
order: 5
---

# 05 - API Platform - Introduction

> **En bref** : Cette fiche couvre l'installation d'API Platform dans Symfony, la déclaration de ressources API avec l'attribut `ApiResource`, les opérations CRUD automatiques, la sérialisation des données, la personnalisation des opérations et les filtres intégrés. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Principes REST avancés](01-principes-rest-avances.md)** (méthodes HTTP, codes de statut)
- Avoir lu la fiche **[04 - OpenAPI et Swagger](04-openapi-swagger.md)** (OpenAPI, Swagger UI)
- Connaître Doctrine ORM (fiche **[04 - Introduction à Doctrine](../03-symfony/04-introduction-doctrine.md)**)
- Connaître le système de validation Symfony (fiche **[11 - Validation des données](../03-symfony/11-validation-donnees.md)**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer API Platform dans un projet Symfony, exposer des entités comme ressources API avec des opérations CRUD automatiques, personnaliser la sérialisation avec les groupes, ajouter des filtres de recherche, et utiliser l'interface Swagger UI intégrée.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'API Platform ?

**Définition** : API Platform est un framework PHP construit sur Symfony qui permet de créer des API REST (et GraphQL) complètes à partir de tes entités Doctrine. Un seul attribut `#[ApiResource]` sur une entité génère automatiquement les endpoints CRUD, la documentation OpenAPI, la pagination, les filtres et la validation.

**Le problème qu'API Platform résout** :

Sans API Platform, voici les problèmes rencontrés :

1. **Code répétitif** : pour chaque entité, tu dois créer un contrôleur, 5 méthodes (list, show, create, update, delete), la sérialisation, la validation, la pagination et la documentation. C'est le même code à chaque fois.
2. **Standards oubliés** : tu dois implémenter toi-même la pagination, les filtres, le format d'erreur, les headers, la négociation de contenu.
3. **Documentation manuelle** : la documentation OpenAPI doit être synchronisée manuellement avec le code.

**Comment API Platform résout ces problèmes** :

| Problème | Solution apportée par API Platform |
| -------- | ---------------------------------- |
| Code répétitif | Un attribut `#[ApiResource]` génère toutes les opérations CRUD |
| Standards oubliés | Pagination, filtres, RFC 7807, JSON-LD sont intégrés par défaut |
| Documentation manuelle | La documentation OpenAPI est générée automatiquement |

**Analogie concrète** : API Platform est comme un constructeur de maisons préfabriquées. Au lieu de construire chaque mur, chaque toit et chaque porte à la main, tu choisis un modèle de maison (l'entité) et le constructeur (API Platform) bâtit la maison complète. Tu peux ensuite personnaliser les finitions (les opérations, la sérialisation).

**Ce qu'API Platform n'est PAS** :

- API Platform n'est pas un simple générateur de code. Il ne crée pas des fichiers PHP que tu dois modifier. Il génère dynamiquement les routes, contrôleurs et réponses au moment de l'exécution.
- API Platform n'est pas limité au CRUD simple. Tu peux créer des opérations personnalisées, des data processors complexes et des workflows métier avancés.
- API Platform n'est pas incompatible avec tes contrôleurs existants. Tu peux mélanger des endpoints API Platform et des contrôleurs Symfony classiques dans le même projet.

**Comparaison API Platform vs contrôleur manuel** :

| API Platform | Contrôleur manuel |
| ------------ | ----------------- |
| 1 attribut = 5 endpoints CRUD | 1 contrôleur + 5 méthodes par entité |
| Pagination, filtres, validation intégrés | Tout est à implémenter |
| Documentation OpenAPI automatique | Documentation manuelle ou NelmioApiDocBundle |
| Personnalisation via attributs | Contrôle total mais plus de code |
| Courbe d'apprentissage initiale | Plus simple à comprendre au début |

---

### L'attribut ApiResource

**Définition** : L'attribut `#[ApiResource]` est placé sur une entité Doctrine pour l'exposer comme ressource API. Par défaut (API Platform 3), les opérations sont GET collection, GET item, POST, **PATCH** et DELETE. PUT n'est plus une opération par défaut.

**Les opérations par défaut** :

| Opération | Méthode HTTP | URL | Description |
| --------- | ------------ | --- | ----------- |
| GetCollection | GET | `/api/books` | Liste paginée de tous les livres |
| Get | GET | `/api/books/{id}` | Détails d'un livre |
| Post | POST | `/api/books` | Crée un livre |
| Patch | PATCH | `/api/books/{id}` | Modifie partiellement un livre |
| Delete | DELETE | `/api/books/{id}` | Supprime un livre |

Le schéma suivant illustre comment un seul attribut `#[ApiResource]` sur une entité PHP génère automatiquement les cinq opérations CRUD :

<div class="diagram-design">
<p><a href="../../diagrams/12-api-design-05-api-platform-introduction-1.html">L&#x27;attribut ApiResource (HTML + SVG)</a></p>
<iframe src="../../diagrams/12-api-design-05-api-platform-introduction-1.html" title="L&#x27;attribut ApiResource" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

**Ce que l'attribut ApiResource n'est PAS** :

- `ApiResource` ne crée pas de contrôleur PHP. Les opérations sont gérées par le noyau d'API Platform. Si tu cherches un fichier `BookController.php`, tu ne le trouveras pas.
- `ApiResource` ne modifie pas la base de données. L'attribut ne touche pas au mapping Doctrine. Il ajoute une couche API par-dessus.

---

### La sérialisation

**Définition** : La sérialisation est le processus qui transforme un objet PHP (une entité) en un format transmissible (JSON). La désérialisation fait l'inverse : elle transforme du JSON en objet PHP.

**Le problème que la sérialisation résout** :

Sans sérialisation contrôlée :

1. **Toutes les propriétés sont exposées** : les champs sensibles (mot de passe, données internes) sont visibles dans l'API.
2. **Références circulaires** : un article a des commentaires, chaque commentaire référence l'article, ce qui crée une boucle infinie.

**API Platform utilise le Serializer de Symfony** avec des **groupes de sérialisation** pour contrôler quels champs sont exposés.

---

### Les filtres intégrés

**Définition** : Les filtres API Platform permettent au client de filtrer, rechercher et trier les résultats via des query parameters. Ils sont déclarés avec des attributs sur l'entité.

**Les filtres principaux** :

| Filtre | Utilité | Exemple d'URL |
| ------ | ------- | ------------- |
| `SearchFilter` | Recherche par égalité ou partielle | `?title=symfony` |
| `DateFilter` | Filtre par date | `?createdAt[after]=2026-01-01` |
| `BooleanFilter` | Filtre par booléen | `?published=true` |
| `RangeFilter` | Filtre par plage numérique | `?price[gte]=10&price[lte]=50` |
| `OrderFilter` | Tri des résultats | `?order[title]=asc` |
| `ExistsFilter` | Filtre sur l'existence d'une valeur | `?isbn[exists]=true` |

---

## Étapes Pratiques

### Étape 1 : Installer API Platform

Installe API Platform dans un projet Symfony existant.

```bash
# Installer API Platform
composer require api
```

Cette commande installe `api-platform/core` et configure automatiquement les routes, la sérialisation et Swagger UI.

```bash
# Vérifier que les routes API Platform sont enregistrées
php bin/console debug:router | grep api
```

**Résultat attendu** :

```text
api_entrypoint       ANY    /api/
api_doc              ANY    /api/docs
api_jsonld_context   ANY    /api/contexts/{shortName}
```

Swagger UI est accessible à `http://localhost:8000/api/docs`.

---

### Étape 2 : Créer une entité avec ApiResource

Crée une entité `Book` et expose-la comme ressource API.

```php
<?php
// src/Entity/Book.php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

// #[ApiResource] expose l'entité comme ressource API
// Par défaut, API Platform génère 5 opérations CRUD
#[ApiResource(
    // Les opérations explicites (optionnel : par défaut les 5 sont créées)
    operations: [
        new GetCollection(),    // GET /api/books
        new Get(),              // GET /api/books/{id}
        new Post(),             // POST /api/books
        new Patch(),            // PATCH /api/books/{id}
        new Delete(),           // DELETE /api/books/{id}
    ],
    // Ordre par défaut des résultats
    order: ['publishedYear' => 'DESC'],
    // Nombre de résultats par page
    paginationItemsPerPage: 20
)]
#[ORM\Entity]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    // La validation Symfony est automatiquement appliquée par API Platform
    #[Assert\NotBlank(message: 'Le titre est obligatoire.')]
    #[Assert\Length(max: 255)]
    private string $title = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'L\'auteur est obligatoire.')]
    private string $author = '';

    #[ORM\Column(length: 13, nullable: true, unique: true)]
    #[Assert\Length(min: 10, max: 13)]
    private ?string $isbn = null;

    #[ORM\Column(nullable: true)]
    private ?int $publishedYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    private ?string $genre = null;

    #[ORM\Column]
    private bool $published = false;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters et setters
    public function getId(): ?int { return $this->id; }

    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getAuthor(): string { return $this->author; }
    public function setAuthor(string $author): self
    {
        $this->author = $author;
        return $this;
    }

    public function getIsbn(): ?string { return $this->isbn; }
    public function setIsbn(?string $isbn): self
    {
        $this->isbn = $isbn;
        return $this;
    }

    public function getPublishedYear(): ?int { return $this->publishedYear; }
    public function setPublishedYear(?int $year): self
    {
        $this->publishedYear = $year;
        return $this;
    }

    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): self
    {
        $this->genre = $genre;
        return $this;
    }

    public function isPublished(): bool { return $this->published; }
    public function setPublished(bool $published): self
    {
        $this->published = $published;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

```bash
# Créer la migration pour la table book
php bin/console make:migration
```

```bash
# Exécuter la migration
php bin/console doctrine:migrations:migrate
```

**Résultat attendu** : l'API est immédiatement fonctionnelle. Teste avec curl :

```bash
# Créer un livre
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Clean Code", "author": "Robert C. Martin", "isbn": "9780132350884", "publishedYear": 2008, "genre": "Programmation"}'
```

```json
{
    "@context": "/api/contexts/Book",
    "@id": "/api/books/1",
    "@type": "Book",
    "id": 1,
    "title": "Clean Code",
    "author": "Robert C. Martin",
    "isbn": "9780132350884",
    "publishedYear": 2008,
    "genre": "Programmation",
    "published": false,
    "createdAt": "2026-03-20T10:00:00+00:00"
}
```

Le format par défaut est JSON-LD (JSON avec des métadonnées sémantiques `@context`, `@id`, `@type`). Tu peux aussi utiliser JSON classique avec le header `Accept: application/json`.

---

### Étape 3 : Contrôler la sérialisation avec les groupes

Utilise les groupes de sérialisation pour contrôler quels champs sont exposés en lecture et en écriture.

```php
<?php
// src/Entity/Book.php - avec groupes de sérialisation

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Patch(),
        new Delete(),
    ],
    // normalizationContext : quels champs sont retournés en LECTURE (GET)
    normalizationContext: ['groups' => ['book:read']],
    // denormalizationContext : quels champs sont acceptés en ÉCRITURE (POST, PATCH)
    denormalizationContext: ['groups' => ['book:write']],
    order: ['publishedYear' => 'DESC'],
    paginationItemsPerPage: 20
)]
#[ORM\Entity]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    // L'id est visible en lecture mais pas modifiable en écriture
    #[Groups(['book:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    // Le titre est visible en lecture ET modifiable en écriture
    #[Groups(['book:read', 'book:write'])]
    private string $title = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank]
    #[Groups(['book:read', 'book:write'])]
    private string $author = '';

    #[ORM\Column(length: 13, nullable: true, unique: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $isbn = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?int $publishedYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $genre = null;

    #[ORM\Column]
    #[Groups(['book:read', 'book:write'])]
    private bool $published = false;

    #[ORM\Column]
    // La date de création est visible en lecture mais pas modifiable
    #[Groups(['book:read'])]
    private \DateTimeImmutable $createdAt;

    // Getters et setters identiques à l'étape précédente...
    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getAuthor(): string { return $this->author; }
    public function setAuthor(string $author): self { $this->author = $author; return $this; }
    public function getIsbn(): ?string { return $this->isbn; }
    public function setIsbn(?string $isbn): self { $this->isbn = $isbn; return $this; }
    public function getPublishedYear(): ?int { return $this->publishedYear; }
    public function setPublishedYear(?int $year): self { $this->publishedYear = $year; return $this; }
    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): self { $this->genre = $genre; return $this; }
    public function isPublished(): bool { return $this->published; }
    public function setPublished(bool $published): self { $this->published = $published; return $this; }
    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

**Résultat attendu** :

- En lecture (GET) : `id`, `title`, `author`, `isbn`, `publishedYear`, `genre`, `published`, `createdAt` sont visibles.
- En écriture (POST, PATCH) : seuls `title`, `author`, `isbn`, `publishedYear`, `genre`, `published` sont acceptés. Les champs `id` et `createdAt` sont ignorés.

---

### Étape 4 : Ajouter des filtres

Ajoute des filtres pour permettre au client de rechercher et trier les livres.

```php
<?php
// src/Entity/Book.php - avec filtres

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
// ... autres imports

#[ApiResource(
    // ... configuration précédente
)]
// Filtre de recherche : titre en recherche partielle, auteur exact, genre exact
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',    // ?title=symfony → LIKE '%symfony%'
    'author' => 'exact',     // ?author=Robert C. Martin → égalité exacte
    'genre' => 'exact',      // ?genre=Programmation → égalité exacte
])]
// Filtre booléen sur le champ published
#[ApiFilter(BooleanFilter::class, properties: ['published'])]
// Filtre de plage sur l'année de publication
#[ApiFilter(RangeFilter::class, properties: ['publishedYear'])]
// Filtre de tri : le client peut trier par titre, auteur ou année
#[ApiFilter(OrderFilter::class, properties: [
    'title',
    'author',
    'publishedYear',
    'createdAt',
])]
#[ORM\Entity]
class Book
{
    // ... même code que l'étape précédente
}
```

**Résultat attendu** :

```bash
# Rechercher les livres dont le titre contient "code"
curl "http://localhost:8000/api/books?title=code"
```

```bash
# Filtrer les livres publiés après 2020
curl "http://localhost:8000/api/books?publishedYear[gte]=2020"
```

```bash
# Filtrer les livres publiés et trier par titre ascendant
curl "http://localhost:8000/api/books?published=true&order[title]=asc"
```

```bash
# Combiner recherche, filtre et tri
curl "http://localhost:8000/api/books?genre=Programmation&publishedYear[gte]=2010&order[publishedYear]=desc"
```

---

### Étape 5 : Personnaliser les opérations

Personnalise les opérations pour des besoins spécifiques.

```php
<?php
// src/Entity/Book.php - opérations personnalisées

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;

#[ApiResource(
    operations: [
        // Liste : personnaliser la pagination et la description
        new GetCollection(
            paginationItemsPerPage: 20,
            paginationMaximumItemsPerPage: 100,
            description: 'Retourne la liste paginée des livres.'
        ),
        // Détail : personnaliser la description
        new Get(
            description: 'Retourne les détails d\'un livre.'
        ),
        // Création : groupes de validation spécifiques
        new Post(
            validationContext: ['groups' => ['Default', 'book:create']],
            description: 'Crée un nouveau livre.'
        ),
        // Modification partielle
        new Patch(
            description: 'Modifie partiellement un livre.'
        ),
        // Suppression : ajouter une condition de sécurité
        new Delete(
            description: 'Supprime un livre.'
        ),
    ],
    normalizationContext: ['groups' => ['book:read']],
    denormalizationContext: ['groups' => ['book:write']],
    order: ['publishedYear' => 'DESC']
)]
#[ORM\Entity]
class Book
{
    // ... même code que précédemment
}
```

---

### Étape 6 : Configurer la pagination

Configure la pagination globalement et par ressource.

```yaml
# config/packages/api_platform.yaml

api_platform:
    # Titre et description de l'API
    title: "API Bibliothèque"
    description: "API REST pour gérer une bibliothèque de livres."
    version: "1.0.0"

    # Configuration globale de la pagination
    defaults:
        # Activer la pagination par défaut
        pagination_enabled: true
        # Nombre d'éléments par page par défaut
        pagination_items_per_page: 20
        # Le client peut changer le nombre d'éléments par page
        pagination_client_items_per_page: true
        # Nombre maximum d'éléments par page
        pagination_maximum_items_per_page: 100
        # Le client peut activer/désactiver la pagination
        pagination_client_enabled: true

    # Formats supportés
    formats:
        jsonld: ["application/ld+json"]
        json: ["application/json"]

    # Documentation
    swagger:
        versions: [3]
    enable_swagger_ui: true
```

**Résultat attendu** :

```bash
# Page 2, 10 éléments par page
curl "http://localhost:8000/api/books?page=2&itemsPerPage=10"

# Désactiver la pagination (retourne tous les résultats)
curl "http://localhost:8000/api/books?pagination=false"
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `composer require api` | Installer API Platform |
| `php bin/console debug:router \| grep api` | Lister les routes API Platform |
| `php bin/console api:openapi:export --format=yaml` | Exporter la spécification OpenAPI |
| `php bin/console debug:config api_platform` | Voir la configuration actuelle |
| `php bin/console make:entity` | Créer ou modifier une entité |
| `php bin/console make:migration` | Générer une migration |
| `php bin/console doctrine:migrations:migrate` | Exécuter les migrations |

---

## Pièges Fréquents

### Piège 1 : Oublier le Content-Type application/ld+json

⚠️ **Problème** : Tu envoies du JSON avec `Content-Type: application/json` mais API Platform attend `application/ld+json` par défaut.

✅ **Solution** : Utilise `Content-Type: application/ld+json` pour les requêtes POST et PATCH. Ou configure API Platform pour accepter aussi `application/json` (voir la configuration YAML).

```bash
# ❌ Peut ne pas fonctionner par défaut
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/json" \
  -d '{"title": "Test"}'

# ✅ Format par défaut d'API Platform
curl -X POST http://localhost:8000/api/books \
  -H "Content-Type: application/ld+json" \
  -d '{"title": "Test"}'
```

### Piège 2 : Exposer tous les champs sans groupes de sérialisation

⚠️ **Problème** : Sans groupes de sérialisation, tous les champs de l'entité sont exposés, y compris les champs sensibles (mot de passe, tokens internes).

✅ **Solution** : Toujours définir des groupes `normalizationContext` (lecture) et `denormalizationContext` (écriture). Ne place l'attribut `#[Groups]` que sur les champs que tu veux exposer.

### Piège 3 : Chercher un contrôleur qui n'existe pas

⚠️ **Problème** : Tu cherches le fichier `BookController.php` pour modifier le comportement de l'API, mais il n'existe pas.

✅ **Solution** : API Platform n'utilise pas de contrôleurs PHP classiques. La personnalisation se fait via les attributs sur l'entité (`#[ApiResource]`), les filtres (`#[ApiFilter]`), ou les State Processors (fiche suivante).

### Piège 4 : Confondre SearchFilter partial et exact

⚠️ **Problème** : Tu utilises `'title' => 'exact'` et le filtre `?title=code` ne retourne rien parce que le titre complet est « Clean Code ».

✅ **Solution** : Utilise `'partial'` pour la recherche dans le texte (LIKE), `'exact'` pour l'égalité stricte, `'start'` pour le début du texte, `'end'` pour la fin.

| Stratégie | SQL équivalent | Exemple |
| --------- | -------------- | ------- |
| `exact` | `WHERE title = 'code'` | Correspondance exacte |
| `partial` | `WHERE title LIKE '%code%'` | Contient le texte |
| `start` | `WHERE title LIKE 'code%'` | Commence par |
| `end` | `WHERE title LIKE '%code'` | Finit par |
| `word_start` | `WHERE title LIKE '% code%' OR title LIKE 'code%'` | Mot commençant par |

---

## Checklist de Validation

- [ ] API Platform est installé et Swagger UI est accessible à `/api/docs`
- [ ] Mon entité a l'attribut `#[ApiResource]` et les 5 opérations CRUD fonctionnent
- [ ] Les groupes de sérialisation contrôlent les champs en lecture et écriture
- [ ] Les contraintes de validation Symfony sont appliquées automatiquement
- [ ] Des filtres SearchFilter, BooleanFilter et OrderFilter sont configurés
- [ ] La pagination est configurée (20 éléments par page, max 100)
- [ ] Je sais personnaliser les opérations (description, pagination par opération)

---

## Exercice Pratique

**Énoncé** : Crée une API complète pour un catalogue de films avec API Platform.

**Spécifications** :

- Entité `Movie` : `id`, `title` (obligatoire), `director` (obligatoire), `releaseYear`, `genre`, `rating` (0 à 10), `synopsis`, `available` (booléen)
- Groupes de sérialisation : `movie:read` pour la lecture, `movie:write` pour l'écriture. Le champ `id` est en lecture seule.
- Filtres : `title` en recherche partielle, `director` en exact, `genre` en exact, `available` en booléen, `releaseYear` en plage, tri par `title`, `releaseYear`, `rating`
- Pagination : 15 éléments par page, max 50
- Validation : `title` et `director` obligatoires, `rating` entre 0 et 10

**Indications** :

- Utilise `#[ApiResource]` avec les opérations explicites
- Utilise `#[Groups]` sur chaque propriété
- Utilise `#[ApiFilter]` pour chaque filtre
- Teste avec Swagger UI : crée 5 films, filtre par genre, trie par rating descendant

**Résultat attendu** : une API fonctionnelle accessible via Swagger UI avec filtres, pagination et validation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Entity/Movie.php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\BooleanFilter;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            paginationItemsPerPage: 15,
            paginationMaximumItemsPerPage: 50,
            description: 'Retourne la liste paginée des films.'
        ),
        new Get(description: 'Retourne les détails d\'un film.'),
        new Post(description: 'Crée un nouveau film.'),
        new Patch(description: 'Modifie partiellement un film.'),
        new Delete(description: 'Supprime un film.'),
    ],
    normalizationContext: ['groups' => ['movie:read']],
    denormalizationContext: ['groups' => ['movie:write']],
    order: ['releaseYear' => 'DESC']
)]
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',
    'director' => 'exact',
    'genre' => 'exact',
])]
#[ApiFilter(BooleanFilter::class, properties: ['available'])]
#[ApiFilter(RangeFilter::class, properties: ['releaseYear', 'rating'])]
#[ApiFilter(OrderFilter::class, properties: ['title', 'releaseYear', 'rating'])]
#[ORM\Entity]
class Movie
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['movie:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le titre est obligatoire.')]
    #[Assert\Length(max: 255)]
    #[Groups(['movie:read', 'movie:write'])]
    private string $title = '';

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le réalisateur est obligatoire.')]
    #[Groups(['movie:read', 'movie:write'])]
    private string $director = '';

    #[ORM\Column(nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?int $releaseYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?string $genre = null;

    #[ORM\Column(nullable: true)]
    #[Assert\Range(
        min: 0,
        max: 10,
        notInRangeMessage: 'La note doit être entre {{ min }} et {{ max }}.'
    )]
    #[Groups(['movie:read', 'movie:write'])]
    private ?float $rating = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['movie:read', 'movie:write'])]
    private ?string $synopsis = null;

    #[ORM\Column]
    #[Groups(['movie:read', 'movie:write'])]
    private bool $available = true;

    // Getters et setters
    public function getId(): ?int { return $this->id; }
    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self { $this->title = $title; return $this; }
    public function getDirector(): string { return $this->director; }
    public function setDirector(string $director): self { $this->director = $director; return $this; }
    public function getReleaseYear(): ?int { return $this->releaseYear; }
    public function setReleaseYear(?int $year): self { $this->releaseYear = $year; return $this; }
    public function getGenre(): ?string { return $this->genre; }
    public function setGenre(?string $genre): self { $this->genre = $genre; return $this; }
    public function getRating(): ?float { return $this->rating; }
    public function setRating(?float $rating): self { $this->rating = $rating; return $this; }
    public function getSynopsis(): ?string { return $this->synopsis; }
    public function setSynopsis(?string $synopsis): self { $this->synopsis = $synopsis; return $this; }
    public function isAvailable(): bool { return $this->available; }
    public function setAvailable(bool $available): self { $this->available = $available; return $this; }
}
```

---

## Navigation

← Fiche précédente : **[04 - OpenAPI et Swagger](04-openapi-swagger.md)**

→ Fiche suivante : **[06 - API Platform - Avancé](06-api-platform-avance.md)**
