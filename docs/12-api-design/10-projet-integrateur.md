---
tags:
  - API
  - Avancé
  - Projet
description: "Projet intégrateur : construire une API REST complète avec API Platform, documentation OpenAPI, authentification JWT, tests et bonnes pratiques."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 10
cursus: "API Design et Documentation"
id: "web.api-design.projet-integrateur"
course_id: "web.api-design"
content_type: "project"
order: 10
---

# 10 - Projet intégrateur

> **En bref** : Ce projet intégrateur met en pratique toutes les notions du cursus API Design et Documentation : conception REST, pagination, gestion des erreurs, documentation OpenAPI, API Platform, versioning, authentification JWT et tests. Tu vas construire une API complète pour gérer une bibliothèque de livres. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- Avoir lu toutes les [fiches précédentes du cursus](index.md) (fiches 01 à 09)
- Avoir un projet Symfony fonctionnel avec API Platform installé
- Avoir LexikJWTAuthenticationBundle installé et configuré
- Connaître Doctrine ORM et le Validator de Symfony

## Objectif de cette fiche

À la fin de ce projet, tu auras construit une API REST complète de gestion de bibliothèque avec : 3 entités liées (Book, Author, Review), des opérations CRUD sécurisées par JWT, une documentation OpenAPI générée automatiquement, des filtres et de la pagination, une gestion des erreurs conforme à la RFC 9457 (successeur de la RFC 7807), et des tests fonctionnels.

---

## Description du projet

### Le contexte

Tu construis une API REST pour une bibliothèque en ligne. Cette API sera consommée par une application web (SPA) et une application mobile. L'API doit être bien documentée, sécurisée et testable.

### Les entités

Le projet comporte 3 entités liées :

```text
Author (1) ───── (N) Book (1) ───── (N) Review
```

- Un auteur peut avoir écrit plusieurs livres.
- Un livre est écrit par un seul auteur.
- Un livre peut avoir plusieurs avis.
- Un avis est lié à un seul livre.

### Les fonctionnalités attendues

| Fonctionnalité | Détails |
| -------------- | ------- |
| CRUD Author | Créer, lire, modifier, supprimer un auteur |
| CRUD Book | Créer, lire, modifier, supprimer un livre |
| CRUD Review | Créer, lire un avis (suppression réservée à un admin ; pas d'opération PATCH dans le code de cette fiche) |
| Authentification | JWT avec deux rôles : `ROLE_USER` (lecture + créer des avis) et `ROLE_ADMIN` (tout) |
| Pagination | 20 éléments par page, max 100 |
| Filtres | Recherche par titre, auteur, genre, année |
| Tri | Par titre, année de publication, date de création (`createdAt`) |
| Documentation | OpenAPI 3.1 générée automatiquement via API Platform |
| Erreurs | RFC 9457 Problem Details (successeur de RFC 7807) |
| Tests | Tests fonctionnels pour chaque endpoint |

---

## Étapes Pratiques

### Étape 1 : Créer l'entité Author

Crée l'entité `Author` avec les champs nécessaires.

```php
<?php
// src/Entity/Author.php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            description: 'Liste les auteurs.',
            paginationItemsPerPage: 20,
            paginationMaximumItemsPerPage: 100
        ),
        new Get(
            description: 'Affiche un auteur avec ses livres.'
        ),
        new Post(
            description: 'Crée un auteur.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent créer des auteurs.'
        ),
        new Patch(
            description: 'Modifie un auteur.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent modifier des auteurs.'
        ),
        new Delete(
            description: 'Supprime un auteur.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent supprimer des auteurs.'
        ),
    ],
    normalizationContext: ['groups' => ['author:read']],
    denormalizationContext: ['groups' => ['author:write']],
    order: ['lastName' => 'ASC']
)]
// Filtre de recherche : nom partiel, nationalité exacte
#[ApiFilter(SearchFilter::class, properties: [
    'firstName' => 'partial',
    'lastName' => 'partial',
    'nationality' => 'exact',
])]
// Filtre de tri : nom, prénom
#[ApiFilter(OrderFilter::class, properties: ['lastName', 'firstName'])]
#[ORM\Entity]
class Author
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['author:read', 'book:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le prénom est obligatoire.')]
    #[Groups(['author:read', 'author:write', 'book:read'])]
    private string $firstName = '';

    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    #[Groups(['author:read', 'author:write', 'book:read'])]
    private string $lastName = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['author:read', 'author:write'])]
    private ?string $biography = null;

    #[ORM\Column(length: 50, nullable: true)]
    #[Groups(['author:read', 'author:write'])]
    private ?string $nationality = null;

    // Relation OneToMany : un auteur peut avoir plusieurs livres
    #[ORM\OneToMany(mappedBy: 'author', targetEntity: Book::class)]
    #[Groups(['author:read'])]
    private Collection $books;

    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getFirstName(): string { return $this->firstName; }
    public function setFirstName(string $firstName): self
    {
        $this->firstName = $firstName;
        return $this;
    }

    public function getLastName(): string { return $this->lastName; }
    public function setLastName(string $lastName): self
    {
        $this->lastName = $lastName;
        return $this;
    }

    public function getBiography(): ?string { return $this->biography; }
    public function setBiography(?string $biography): self
    {
        $this->biography = $biography;
        return $this;
    }

    public function getNationality(): ?string { return $this->nationality; }
    public function setNationality(?string $nationality): self
    {
        $this->nationality = $nationality;
        return $this;
    }

    public function getBooks(): Collection { return $this->books; }

    public function addBook(Book $book): self
    {
        if (!$this->books->contains($book)) {
            $this->books->add($book);
            $book->setAuthor($this);
        }
        return $this;
    }
}
```

---

### Étape 2 : Créer l'entité Book

Crée l'entité `Book` liée à `Author` et `Review`.

```php
<?php
// src/Entity/Book.php

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
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            description: 'Liste les livres avec pagination et filtres.',
            paginationItemsPerPage: 20,
            paginationMaximumItemsPerPage: 100
        ),
        new Get(
            description: 'Affiche un livre avec son auteur et ses avis.'
        ),
        new Post(
            description: 'Crée un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent créer des livres.'
        ),
        new Patch(
            description: 'Modifie un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent modifier des livres.'
        ),
        new Delete(
            description: 'Supprime un livre.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent supprimer des livres.'
        ),
    ],
    normalizationContext: ['groups' => ['book:read']],
    denormalizationContext: ['groups' => ['book:write']],
    order: ['publishedYear' => 'DESC']
)]
// Filtres de recherche
#[ApiFilter(SearchFilter::class, properties: [
    'title' => 'partial',
    'author.lastName' => 'partial',
    'genre' => 'exact',
    'isbn' => 'exact',
])]
#[ApiFilter(BooleanFilter::class, properties: ['published'])]
#[ApiFilter(RangeFilter::class, properties: ['publishedYear'])]
#[ApiFilter(OrderFilter::class, properties: [
    'title', 'publishedYear', 'createdAt',
])]
#[ORM\Entity]
class Book
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['book:read', 'author:read', 'review:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Assert\NotBlank(message: 'Le titre est obligatoire.')]
    #[Assert\Length(max: 255)]
    #[Groups(['book:read', 'book:write', 'author:read', 'review:read'])]
    private string $title = '';

    // Relation ManyToOne : chaque livre a un auteur
    #[ORM\ManyToOne(targetEntity: Author::class, inversedBy: 'books')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'L\'auteur est obligatoire.')]
    #[Groups(['book:read', 'book:write'])]
    private ?Author $author = null;

    #[ORM\Column(length: 13, nullable: true, unique: true)]
    #[Assert\Length(min: 10, max: 13)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $isbn = null;

    #[ORM\Column(nullable: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?int $publishedYear = null;

    #[ORM\Column(length: 100, nullable: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $genre = null;

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['book:read', 'book:write'])]
    private ?string $synopsis = null;

    #[ORM\Column]
    #[Groups(['book:read', 'book:write'])]
    private bool $published = false;

    // Relation OneToMany : un livre peut avoir plusieurs avis
    #[ORM\OneToMany(mappedBy: 'book', targetEntity: Review::class, orphanRemoval: true)]
    #[Groups(['book:read'])]
    private Collection $reviews;

    #[ORM\Column]
    #[Groups(['book:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->reviews = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getTitle(): string { return $this->title; }
    public function setTitle(string $title): self
    {
        $this->title = $title;
        return $this;
    }

    public function getAuthor(): ?Author { return $this->author; }
    public function setAuthor(?Author $author): self
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

    public function getSynopsis(): ?string { return $this->synopsis; }
    public function setSynopsis(?string $synopsis): self
    {
        $this->synopsis = $synopsis;
        return $this;
    }

    public function isPublished(): bool { return $this->published; }
    public function setPublished(bool $published): self
    {
        $this->published = $published;
        return $this;
    }

    public function getReviews(): Collection { return $this->reviews; }

    public function addReview(Review $review): self
    {
        if (!$this->reviews->contains($review)) {
            $this->reviews->add($review);
            $review->setBook($this);
        }
        return $this;
    }

    public function removeReview(Review $review): self
    {
        $this->reviews->removeElement($review);
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }

    // Propriété calculée : note moyenne des avis
    #[Groups(['book:read'])]
    public function getAverageRating(): ?float
    {
        if ($this->reviews->isEmpty()) {
            return null;
        }

        $total = 0;
        foreach ($this->reviews as $review) {
            $total += $review->getRating();
        }

        // Arrondir à une décimale
        return round($total / $this->reviews->count(), 1);
    }
}
```

---

### Étape 3 : Créer l'entité Review

Crée l'entité `Review` liée à `Book`.

```php
<?php
// src/Entity/Review.php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\RangeFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(
            description: 'Liste les avis.',
            paginationItemsPerPage: 20
        ),
        new Get(
            description: 'Affiche un avis.'
        ),
        // Tout utilisateur authentifié peut créer un avis
        new Post(
            description: 'Crée un avis sur un livre.',
            security: 'is_granted("ROLE_USER")',
            securityMessage: 'Tu dois être connecté pour donner un avis.'
        ),
        // Seul un admin peut supprimer un avis
        new Delete(
            description: 'Supprime un avis.',
            security: 'is_granted("ROLE_ADMIN")',
            securityMessage: 'Seuls les administrateurs peuvent supprimer des avis.'
        ),
    ],
    normalizationContext: ['groups' => ['review:read']],
    denormalizationContext: ['groups' => ['review:write']],
    order: ['createdAt' => 'DESC']
)]
#[ApiFilter(RangeFilter::class, properties: ['rating'])]
#[ApiFilter(OrderFilter::class, properties: ['rating', 'createdAt'])]
#[ORM\Entity]
class Review
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['review:read', 'book:read'])]
    private ?int $id = null;

    // La note de 1 à 5
    #[ORM\Column]
    #[Assert\NotNull(message: 'La note est obligatoire.')]
    #[Assert\Range(
        min: 1,
        max: 5,
        notInRangeMessage: 'La note doit être entre {{ min }} et {{ max }}.'
    )]
    #[Groups(['review:read', 'review:write', 'book:read'])]
    private int $rating = 0;

    // Le commentaire de l'avis
    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['review:read', 'review:write', 'book:read'])]
    private ?string $comment = null;

    // Le pseudonyme de l'auteur de l'avis
    #[ORM\Column(length: 100)]
    #[Assert\NotBlank(message: 'Le pseudonyme est obligatoire.')]
    #[Groups(['review:read', 'review:write', 'book:read'])]
    private string $reviewerName = '';

    // Relation ManyToOne : chaque avis est lié à un livre
    #[ORM\ManyToOne(targetEntity: Book::class, inversedBy: 'reviews')]
    #[ORM\JoinColumn(nullable: false)]
    #[Assert\NotNull(message: 'Le livre est obligatoire.')]
    #[Groups(['review:read', 'review:write'])]
    private ?Book $book = null;

    #[ORM\Column]
    #[Groups(['review:read', 'book:read'])]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    public function getId(): ?int { return $this->id; }

    public function getRating(): int { return $this->rating; }
    public function setRating(int $rating): self
    {
        $this->rating = $rating;
        return $this;
    }

    public function getComment(): ?string { return $this->comment; }
    public function setComment(?string $comment): self
    {
        $this->comment = $comment;
        return $this;
    }

    public function getReviewerName(): string { return $this->reviewerName; }
    public function setReviewerName(string $reviewerName): self
    {
        $this->reviewerName = $reviewerName;
        return $this;
    }

    public function getBook(): ?Book { return $this->book; }
    public function setBook(?Book $book): self
    {
        $this->book = $book;
        return $this;
    }

    public function getCreatedAt(): \DateTimeImmutable { return $this->createdAt; }
}
```

---

### Étape 4 : Créer la base de données et les fixtures

Génère les migrations et insère des données de test.

```bash
# Créer la migration
php bin/console make:migration

# Exécuter la migration
php bin/console doctrine:migrations:migrate
```

Crée une commande pour insérer des données de test :

```php
<?php
// src/Command/LoadFixturesCommand.php

namespace App\Command;

use App\Entity\Author;
use App\Entity\Book;
use App\Entity\Review;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;

#[AsCommand(name: 'app:load-fixtures', description: 'Charge les données de test')]
class LoadFixturesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $em,
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        // Créer les auteurs
        $martin = new Author();
        $martin->setFirstName('Robert C.');
        $martin->setLastName('Martin');
        $martin->setNationality('Américain');
        $martin->setBiography('Auteur de Clean Code et Clean Architecture.');
        $this->em->persist($martin);

        $fowler = new Author();
        $fowler->setFirstName('Martin');
        $fowler->setLastName('Fowler');
        $fowler->setNationality('Britannique');
        $fowler->setBiography('Spécialiste du refactoring et des patterns.');
        $this->em->persist($fowler);

        $gamma = new Author();
        $gamma->setFirstName('Erich');
        $gamma->setLastName('Gamma');
        $gamma->setNationality('Suisse');
        $gamma->setBiography('Co-auteur du livre Design Patterns (Gang of Four).');
        $this->em->persist($gamma);

        // Créer les livres
        $cleanCode = new Book();
        $cleanCode->setTitle('Clean Code');
        $cleanCode->setAuthor($martin);
        $cleanCode->setIsbn('9780132350884');
        $cleanCode->setPublishedYear(2008);
        $cleanCode->setGenre('Programmation');
        $cleanCode->setSynopsis('Guide pratique pour écrire du code propre et maintenable.');
        $cleanCode->setPublished(true);
        $this->em->persist($cleanCode);

        $refactoring = new Book();
        $refactoring->setTitle('Refactoring');
        $refactoring->setAuthor($fowler);
        $refactoring->setIsbn('9780134757599');
        $refactoring->setPublishedYear(2018);
        $refactoring->setGenre('Programmation');
        $refactoring->setSynopsis('Techniques pour améliorer la structure du code existant.');
        $refactoring->setPublished(true);
        $this->em->persist($refactoring);

        $designPatterns = new Book();
        $designPatterns->setTitle('Design Patterns');
        $designPatterns->setAuthor($gamma);
        $designPatterns->setIsbn('9780201633610');
        $designPatterns->setPublishedYear(1994);
        $designPatterns->setGenre('Architecture');
        $designPatterns->setSynopsis('Catalogue de solutions réutilisables en conception objet.');
        $designPatterns->setPublished(true);
        $this->em->persist($designPatterns);

        $cleanArch = new Book();
        $cleanArch->setTitle('Clean Architecture');
        $cleanArch->setAuthor($martin);
        $cleanArch->setIsbn('9780134494166');
        $cleanArch->setPublishedYear(2017);
        $cleanArch->setGenre('Architecture');
        $cleanArch->setSynopsis('Guide pour concevoir des architectures logicielles durables.');
        $cleanArch->setPublished(true);
        $this->em->persist($cleanArch);

        // Créer les avis
        $review1 = new Review();
        $review1->setBook($cleanCode);
        $review1->setRating(5);
        $review1->setReviewerName('Alice');
        $review1->setComment('Indispensable pour tout développeur.');
        $this->em->persist($review1);

        $review2 = new Review();
        $review2->setBook($cleanCode);
        $review2->setRating(4);
        $review2->setReviewerName('Bob');
        $review2->setComment('Très bien mais parfois répétitif.');
        $this->em->persist($review2);

        $review3 = new Review();
        $review3->setBook($refactoring);
        $review3->setRating(5);
        $review3->setReviewerName('Charlie');
        $review3->setComment('La référence absolue pour le refactoring.');
        $this->em->persist($review3);

        $review4 = new Review();
        $review4->setBook($designPatterns);
        $review4->setRating(4);
        $review4->setReviewerName('Alice');
        $review4->setComment('Un classique, mais les exemples sont en C++.');
        $this->em->persist($review4);

        $this->em->flush();

        $output->writeln('Données de test chargées :');
        $output->writeln('- 3 auteurs');
        $output->writeln('- 4 livres');
        $output->writeln('- 4 avis');

        return Command::SUCCESS;
    }
}
```

```bash
# Charger les données de test
php bin/console app:load-fixtures
```

**Résultat attendu** :

```text
Données de test chargées :
- 3 auteurs
- 4 livres
- 4 avis
```

---

### Étape 5 : Vérifier la documentation OpenAPI

API Platform génère automatiquement la documentation OpenAPI. Vérifie qu'elle est complète.

```bash
# Exporter la spécification OpenAPI au format YAML
php bin/console api:openapi:export --format=yaml > openapi.yaml
```

```bash
# Vérifier que les 3 ressources sont documentées
php bin/console api:openapi:export --format=json | php -r '
    $spec = json_decode(file_get_contents("php://stdin"), true);
    echo "Titre : " . $spec["info"]["title"] . PHP_EOL;
    echo "Version : " . $spec["info"]["version"] . PHP_EOL;
    echo "Endpoints :" . PHP_EOL;
    foreach (array_keys($spec["paths"]) as $path) {
        echo "  " . $path . PHP_EOL;
    }
'
```

**Résultat attendu** :

```text
Titre : API Bibliothèque
Version : 1.0.0
Endpoints :
  /api/authors
  /api/authors/{id}
  /api/books
  /api/books/{id}
  /api/reviews
  /api/reviews/{id}
```

Ouvre Swagger UI à `http://localhost:8000/api/docs` pour vérifier visuellement la documentation.

**Points à vérifier dans Swagger UI** :

- Les 3 ressources sont listées (Authors, Books, Reviews)
- Chaque opération a une description claire
- Les schémas de requête et de réponse sont corrects
- Les filtres apparaissent comme paramètres de query
- Les codes de statut (200, 201, 204, 400, 401, 403, 404, 422) sont documentés

---

### Étape 6 : Écrire les tests fonctionnels

Crée des tests fonctionnels pour vérifier le comportement de l'API.

```bash
# Installer les outils de test (pack Symfony + client HTTP)
# Source : https://api-platform.com/docs/symfony/testing/
composer require --dev symfony/test-pack symfony/http-client
```

```php
<?php
// tests/Api/BookTest.php

namespace App\Tests\Api;

use ApiPlatform\Symfony\Bundle\Test\ApiTestCase;
use App\Entity\Author;
use App\Entity\Book;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class BookTest extends ApiTestCase
{
    private ?string $userToken = null;
    private ?string $adminToken = null;

    // Méthode utilitaire pour obtenir un token JWT
    private function getToken(string $email, string $password): string
    {
        $response = static::createClient()->request('POST', '/api/login', [
            'json' => [
                'email' => $email,
                'password' => $password,
            ],
        ]);

        return $response->toArray()['token'];
    }

    // Prépare les données de test avant chaque test
    protected function setUp(): void
    {
        parent::setUp();

        $container = static::getContainer();
        $em = $container->get(EntityManagerInterface::class);
        $hasher = $container->get(UserPasswordHasherInterface::class);

        // Créer les utilisateurs de test
        $user = new User();
        $user->setEmail('user@test.com');
        $user->setRoles(['ROLE_USER']);
        $user->setPassword($hasher->hashPassword($user, 'password123'));
        $em->persist($user);

        $admin = new User();
        $admin->setEmail('admin@test.com');
        $admin->setRoles(['ROLE_ADMIN']);
        $admin->setPassword($hasher->hashPassword($admin, 'admin123'));
        $em->persist($admin);

        // Créer un auteur et un livre de test
        $author = new Author();
        $author->setFirstName('Robert C.');
        $author->setLastName('Martin');
        $em->persist($author);

        $book = new Book();
        $book->setTitle('Clean Code');
        $book->setAuthor($author);
        $book->setIsbn('9780132350884');
        $book->setPublishedYear(2008);
        $book->setGenre('Programmation');
        $book->setPublished(true);
        $em->persist($book);

        $em->flush();

        // Obtenir les tokens
        $this->userToken = $this->getToken('user@test.com', 'password123');
        $this->adminToken = $this->getToken('admin@test.com', 'admin123');
    }

    // Test : lister les livres sans token → 401
    public function testListBooksWithoutAuth(): void
    {
        $response = static::createClient()->request('GET', '/api/books');

        // Le serveur doit retourner 401 Unauthorized
        $this->assertResponseStatusCodeSame(401);
    }

    // Test : lister les livres avec token → 200
    public function testListBooksWithAuth(): void
    {
        $response = static::createClient()->request('GET', '/api/books', [
            'auth_bearer' => $this->userToken,
        ]);

        // Le serveur doit retourner 200 OK
        $this->assertResponseIsSuccessful();
        // La réponse doit être au format JSON-LD
        $this->assertResponseHeaderSame(
            'content-type',
            'application/ld+json; charset=utf-8'
        );
    }

    // Test : créer un livre avec ROLE_USER → 403
    public function testCreateBookAsUser(): void
    {
        $response = static::createClient()->request('POST', '/api/books', [
            'auth_bearer' => $this->userToken,
            'json' => [
                'title' => 'Nouveau livre',
                'author' => '/api/authors/1',
                'publishedYear' => 2026,
            ],
        ]);

        // ROLE_USER n'a pas le droit de créer → 403
        $this->assertResponseStatusCodeSame(403);
    }

    // Test : créer un livre avec ROLE_ADMIN → 201
    public function testCreateBookAsAdmin(): void
    {
        $response = static::createClient()->request('POST', '/api/books', [
            'auth_bearer' => $this->adminToken,
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'title' => 'Nouveau livre',
                'author' => '/api/authors/1',
                'isbn' => '9781234567890',
                'publishedYear' => 2026,
                'genre' => 'Programmation',
                'published' => true,
            ],
        ]);

        // Le serveur doit retourner 201 Created
        $this->assertResponseStatusCodeSame(201);
        // La réponse doit contenir le titre du livre créé
        $this->assertJsonContains(['title' => 'Nouveau livre']);
    }

    // Test : créer un livre sans titre → 422
    public function testCreateBookWithoutTitle(): void
    {
        $response = static::createClient()->request('POST', '/api/books', [
            'auth_bearer' => $this->adminToken,
            'headers' => ['Content-Type' => 'application/ld+json'],
            'json' => [
                'title' => '',
                'author' => '/api/authors/1',
            ],
        ]);

        // Validation échouée → 422
        $this->assertResponseStatusCodeSame(422);
    }

    // Test : filtrer les livres par genre
    public function testFilterBooksByGenre(): void
    {
        $response = static::createClient()->request(
            'GET',
            '/api/books?genre=Programmation',
            ['auth_bearer' => $this->userToken]
        );

        $this->assertResponseIsSuccessful();
        // API Platform 4 : hydra_prefix=false par défaut, donc "member" (pas "hydra:member")
        $data = $response->toArray();
        foreach ($data['member'] as $book) {
            $this->assertSame('Programmation', $book['genre']);
        }
    }

    // Test : supprimer un livre avec ROLE_ADMIN → 204
    public function testDeleteBookAsAdmin(): void
    {
        $response = static::createClient()->request(
            'DELETE',
            '/api/books/1',
            ['auth_bearer' => $this->adminToken]
        );

        // Le serveur doit retourner 204 No Content
        $this->assertResponseStatusCodeSame(204);
    }

    // Test : accéder à un livre inexistant → 404
    public function testGetNonExistentBook(): void
    {
        $response = static::createClient()->request(
            'GET',
            '/api/books/999',
            ['auth_bearer' => $this->userToken]
        );

        // Le serveur doit retourner 404 Not Found
        $this->assertResponseStatusCodeSame(404);
    }
}
```

```bash
# Exécuter les tests
php bin/phpunit tests/Api/BookTest.php
```

**Résultat attendu** :

```text
PHPUnit 12.x

.......                                                            7 / 7 (100%)

Time: 00:02.345, Memory: 42.00 MB

OK (7 tests, 12 assertions)
```

---

### Étape 7 : Tester l'API complète avec curl

Vérifie l'API complète en suivant un scénario réaliste.

```bash
# 1. Obtenir un token administrateur
TOKEN=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "admin@test.com", "password": "admin123"}' \
  | php -r 'echo json_decode(file_get_contents("php://stdin"))->token;')

echo "Token obtenu : ${TOKEN:0:20}..."
```

```bash
# 2. Lister les auteurs
curl -s http://localhost:8000/api/authors \
  -H "Authorization: Bearer $TOKEN" | php -r '
    $data = json_decode(file_get_contents("php://stdin"), true);
    foreach ($data["member"] as $author) {
        echo $author["firstName"] . " " . $author["lastName"] . PHP_EOL;
    }
'
```

**Résultat attendu** :

```text
Erich Gamma
Martin Fowler
Robert C. Martin
```

```bash
# 3. Créer un nouvel auteur
curl -s -X POST http://localhost:8000/api/authors \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/ld+json" \
  -d '{
    "firstName": "Kent",
    "lastName": "Beck",
    "nationality": "Américain",
    "biography": "Créateur de l'\''Extreme Programming et du TDD."
  }'
```

```bash
# 4. Lister les livres avec filtre et tri
curl -s "http://localhost:8000/api/books?genre=Programmation&order[publishedYear]=desc" \
  -H "Authorization: Bearer $TOKEN" | php -r '
    $data = json_decode(file_get_contents("php://stdin"), true);
    foreach ($data["member"] as $book) {
        echo $book["title"] . " (" . $book["publishedYear"] . ")" . PHP_EOL;
    }
'
```

**Résultat attendu** :

```text
Refactoring (2018)
Clean Code (2008)
```

```bash
# 5. Afficher un livre avec ses avis
curl -s http://localhost:8000/api/books/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | php -r '
    $book = json_decode(file_get_contents("php://stdin"), true);
    echo "Titre : " . $book["title"] . PHP_EOL;
    echo "Note moyenne : " . ($book["averageRating"] ?? "Aucun avis") . PHP_EOL;
    echo "Nombre d'\''avis : " . count($book["reviews"]) . PHP_EOL;
'
```

**Résultat attendu** :

```text
Titre : Clean Code
Note moyenne : 4.5
Nombre d'avis : 2
```

```bash
# 6. Ajouter un avis (avec un token ROLE_USER)
TOKEN_USER=$(curl -s -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@test.com", "password": "password123"}' \
  | php -r 'echo json_decode(file_get_contents("php://stdin"))->token;')

curl -s -X POST http://localhost:8000/api/reviews \
  -H "Authorization: Bearer $TOKEN_USER" \
  -H "Content-Type: application/ld+json" \
  -d '{
    "book": "/api/books/1",
    "rating": 5,
    "reviewerName": "David",
    "comment": "Le meilleur livre sur le code propre."
  }'
```

```bash
# 7. Vérifier que la note moyenne a changé
curl -s http://localhost:8000/api/books/1 \
  -H "Authorization: Bearer $TOKEN" \
  -H "Accept: application/json" | php -r '
    $book = json_decode(file_get_contents("php://stdin"), true);
    echo "Note moyenne après nouvel avis : " . $book["averageRating"] . PHP_EOL;
'
```

**Résultat attendu** :

```text
Note moyenne après nouvel avis : 4.7
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console make:migration` | Créer une migration |
| `php bin/console doctrine:migrations:migrate` | Exécuter les migrations |
| `php bin/console app:load-fixtures` | Charger les données de test |
| `php bin/console api:openapi:export --format=yaml` | Exporter la spec OpenAPI |
| `php bin/console debug:router \| grep api` | Lister les routes API |
| `php bin/phpunit tests/Api/` | Exécuter les tests API |
| `php bin/console lexik:jwt:generate-keypair` | Régénérer les clés JWT |

---

## Pièges Fréquents

### Piège 1 : Références circulaires dans la sérialisation

⚠️ **Problème** : L'entité `Book` sérialise l'`Author`, qui sérialise ses `Books`, qui sérialisent leur `Author`... Boucle infinie.

✅ **Solution** : Utilise des groupes de sérialisation différents pour chaque direction. Le groupe `book:read` inclut `author` (avec le groupe `book:read` sur les champs de `Author`). Le groupe `author:read` inclut `books` (avec le groupe `author:read` sur les champs de `Book`). Chaque direction expose un sous-ensemble de champs différent.

```php
<?php
// Dans Author.php
#[Groups(['author:read', 'book:read'])]  // Visible dans les deux contextes
private string $lastName = '';

#[Groups(['author:read'])]  // Visible uniquement dans le contexte auteur
private Collection $books;   // Pas inclus quand on sérialise un livre
```

### Piège 2 : Oublier les IRI dans les relations

⚠️ **Problème** : Tu envoies `"author": 1` au lieu de `"author": "/api/authors/1"` pour créer un livre. L'erreur suivante apparaît : « Expected IRI or nested document ».

✅ **Solution** : API Platform utilise les IRI (Internationalized Resource Identifier) pour les relations. Envoie toujours le chemin complet.

```json
{
    "title": "Nouveau livre",
    "author": "/api/authors/1"
}
```

### Piège 3 : Ne pas tester les cas d'erreur

⚠️ **Problème** : Tu testes uniquement les cas de succès (200, 201). Les cas d'erreur (401, 403, 404, 422) ne sont pas couverts.

✅ **Solution** : Chaque test doit couvrir au minimum : le cas de succès, l'accès sans authentification (401), l'accès sans autorisation (403), la validation (422) et la ressource introuvable (404).

### Piège 4 : Propriété calculée non accessible

⚠️ **Problème** : La propriété `averageRating` est définie comme méthode sur l'entité, mais elle n'apparaît pas dans la réponse API.

✅ **Solution** : Ajoute le groupe de sérialisation `#[Groups(['book:read'])]` sur la méthode `getAverageRating()`. API Platform sérialise aussi les méthodes getter qui ont un groupe de sérialisation.

---

## Checklist de Validation

- [ ] Les 3 entités (Author, Book, Review) sont créées avec les relations correctes
- [ ] Les migrations sont exécutées et les données de test sont chargées
- [ ] Les opérations CRUD fonctionnent pour chaque entité
- [ ] L'authentification JWT fonctionne (login, token, accès protégé)
- [ ] Les rôles sont respectés (ROLE_USER = lecture + avis, ROLE_ADMIN = tout)
- [ ] Les filtres fonctionnent (recherche par titre, genre, année)
- [ ] Le tri fonctionne (par titre, année, note)
- [ ] La pagination fonctionne (20 éléments par page)
- [ ] La documentation OpenAPI est accessible et complète dans Swagger UI
- [ ] La note moyenne est calculée correctement
- [ ] Les tests fonctionnels passent (7 tests minimum)
- [ ] Les erreurs sont au format RFC 9457 (Problem Details, successeur de RFC 7807)

---

## Exercice Pratique

**Énoncé** : Étends l'API de bibliothèque avec les fonctionnalités suivantes.

**Spécifications** :

1. **Entité Category** : crée une entité `Category` (id, name, description) liée en ManyToMany avec `Book`. Un livre peut appartenir à plusieurs catégories. Une catégorie peut contenir plusieurs livres.
2. **Endpoint de statistiques** : crée un endpoint custom `GET /api/stats` qui retourne :
   - Le nombre total de livres
   - Le nombre total d'auteurs
   - Le nombre total d'avis
   - La note moyenne globale
   - Le livre le mieux noté
3. **Filtre par catégorie** : ajoute un filtre sur `Book` pour filtrer par catégorie (`?category=Programmation`)
4. **Tests** : ajoute des tests pour le CRUD de `Category`, la relation ManyToMany, et l'endpoint de statistiques

**Indications** :

- Pour la relation ManyToMany, utilise `#[ORM\ManyToMany]` avec une table de jointure
- Pour l'endpoint custom, crée un contrôleur Symfony classique (pas une opération API Platform)
- Pour le filtre par catégorie, utilise `SearchFilter` sur la propriété `categories.name`
- Pense aux groupes de sérialisation pour éviter les références circulaires

**Résultat attendu** : l'API supporte les catégories, les statistiques et le filtrage par catégorie. Tous les tests passent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Entité Category** :

```php
<?php
// src/Entity/Category.php

namespace App\Entity;

use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Delete;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Patch;
use ApiPlatform\Metadata\Post;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
    operations: [
        new GetCollection(description: 'Liste les catégories.'),
        new Get(description: 'Affiche une catégorie avec ses livres.'),
        new Post(
            description: 'Crée une catégorie.',
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new Patch(
            description: 'Modifie une catégorie.',
            security: 'is_granted("ROLE_ADMIN")'
        ),
        new Delete(
            description: 'Supprime une catégorie.',
            security: 'is_granted("ROLE_ADMIN")'
        ),
    ],
    normalizationContext: ['groups' => ['category:read']],
    denormalizationContext: ['groups' => ['category:write']],
)]
#[ApiFilter(SearchFilter::class, properties: ['name' => 'partial'])]
#[ORM\Entity]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['category:read', 'book:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 100, unique: true)]
    #[Assert\NotBlank(message: 'Le nom est obligatoire.')]
    #[Groups(['category:read', 'category:write', 'book:read'])]
    private string $name = '';

    #[ORM\Column(type: 'text', nullable: true)]
    #[Groups(['category:read', 'category:write'])]
    private ?string $description = null;

    // Relation ManyToMany avec Book
    #[ORM\ManyToMany(targetEntity: Book::class, mappedBy: 'categories')]
    #[Groups(['category:read'])]
    private Collection $books;

    public function __construct()
    {
        $this->books = new ArrayCollection();
    }

    public function getId(): ?int { return $this->id; }

    public function getName(): string { return $this->name; }
    public function setName(string $name): self
    {
        $this->name = $name;
        return $this;
    }

    public function getDescription(): ?string { return $this->description; }
    public function setDescription(?string $description): self
    {
        $this->description = $description;
        return $this;
    }

    public function getBooks(): Collection { return $this->books; }
}
```

**Ajout de la relation dans Book** :

```php
<?php
// Dans src/Entity/Book.php - ajouter la relation ManyToMany

// Relation ManyToMany avec Category
#[ORM\ManyToMany(targetEntity: Category::class, inversedBy: 'books')]
#[ORM\JoinTable(name: 'book_category')]
#[Groups(['book:read', 'book:write'])]
private Collection $categories;

// Dans le constructeur, ajouter :
// $this->categories = new ArrayCollection();

public function getCategories(): Collection { return $this->categories; }

public function addCategory(Category $category): self
{
    if (!$this->categories->contains($category)) {
        $this->categories->add($category);
    }
    return $this;
}

public function removeCategory(Category $category): self
{
    $this->categories->removeElement($category);
    return $this;
}
```

**Endpoint de statistiques** :

```php
<?php
// src/Controller/Api/StatsController.php

namespace App\Controller\Api;

use App\Repository\AuthorRepository;
use App\Repository\BookRepository;
use App\Repository\ReviewRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class StatsController extends AbstractController
{
    #[Route('/api/stats', methods: ['GET'])]
    public function stats(
        BookRepository $bookRepo,
        AuthorRepository $authorRepo,
        ReviewRepository $reviewRepo,
    ): JsonResponse {
        // Compter les entités
        $totalBooks = $bookRepo->count([]);
        $totalAuthors = $authorRepo->count([]);
        $totalReviews = $reviewRepo->count([]);

        // Calculer la note moyenne globale
        $allReviews = $reviewRepo->findAll();
        $averageRating = null;
        if (count($allReviews) > 0) {
            $total = array_sum(array_map(
                fn($r) => $r->getRating(),
                $allReviews
            ));
            $averageRating = round($total / count($allReviews), 1);
        }

        // Trouver le livre le mieux noté
        $bestBook = null;
        $bestRating = 0;
        foreach ($bookRepo->findAll() as $book) {
            $rating = $book->getAverageRating();
            if ($rating !== null && $rating > $bestRating) {
                $bestRating = $rating;
                $bestBook = [
                    'id' => $book->getId(),
                    'title' => $book->getTitle(),
                    'averageRating' => $rating,
                ];
            }
        }

        return $this->json([
            'totalBooks' => $totalBooks,
            'totalAuthors' => $totalAuthors,
            'totalReviews' => $totalReviews,
            'averageRating' => $averageRating,
            'bestRatedBook' => $bestBook,
        ], Response::HTTP_OK);
    }
}
```

Test de l'endpoint de statistiques :

```bash
curl -s http://localhost:8000/api/stats \
  -H "Authorization: Bearer $TOKEN" | php -r '
    $stats = json_decode(file_get_contents("php://stdin"), true);
    echo "Livres : " . $stats["totalBooks"] . PHP_EOL;
    echo "Auteurs : " . $stats["totalAuthors"] . PHP_EOL;
    echo "Avis : " . $stats["totalReviews"] . PHP_EOL;
    echo "Note moyenne : " . $stats["averageRating"] . PHP_EOL;
    echo "Meilleur livre : " . $stats["bestRatedBook"]["title"] . " (" . $stats["bestRatedBook"]["averageRating"] . ")" . PHP_EOL;
'
```

**Résultat attendu** :

```text
Livres : 4
Auteurs : 3
Avis : 4
Note moyenne : 4.5
Meilleur livre : Clean Code (4.5)
```

---

## Navigation

← Fiche précédente : **[09 - Introduction à GraphQL](09-introduction-graphql.md)**

Fin du cursus API Design et Documentation.
