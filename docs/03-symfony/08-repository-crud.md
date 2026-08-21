---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Repository et CRUD"
estimated_time: "65 min"
fiche_number: 8
total_fiches: 21
cursus: "Symfony"
id: "web.symfony.repository-crud"
course_id: "web.symfony"
content_type: "lesson"
order: 8
---

# 08 - Repository et CRUD

> **En bref** : À la fin de cette fiche, tu sauras effectuer les opérations CRUD (Create, Read, Update, Delete) sur les entités avec Doctrine. Lecture estimée : 65 min.


## Prérequis

- Avoir lu la fiche **[04 - Introduction à Doctrine](04-introduction-doctrine.md)**
- Avoir lu la fiche **[05 - Créer des entités](05-creer-entites.md)**
- Avoir lu la fiche **[06 - Les migrations](06-migrations.md)**
- Comprendre les tableaux PHP (fiche **[02-php/03 - Les tableaux](../02-php/03-tableaux-arrays.md)**)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras effectuer les opérations CRUD (Create, Read, Update, Delete) sur les entités avec Doctrine.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que CRUD ?

**Définition** : CRUD est l'acronyme des quatre opérations de base sur les données : Create (créer), Read (lire), Update (modifier), Delete (supprimer).

| Opération | Action | Méthode Doctrine |
| --------- | ------ | ---------------- |
| **C**reate | Créer un nouvel enregistrement | `persist()` + `flush()` |
| **R**ead | Lire des enregistrements | `find()`, `findAll()`, `findBy()` |
| **U**pdate | Modifier un enregistrement | Modifier l'objet + `flush()` |
| **D**elete | Supprimer un enregistrement | `remove()` + `flush()` |

**Analogie concrète** : CRUD représente les actions de base qu'on peut faire avec un fichier Excel :

- Create = Ajouter une nouvelle ligne
- Read = Consulter les données
- Update = Modifier une cellule
- Delete = Supprimer une ligne

Le diagramme suivant montre les quatre opérations CRUD et les méthodes Doctrine associées :

<div class="diagram-design">
<p><a href="../../diagrams/03-symfony-08-repository-crud-1.html">Qu&#x27;est-ce que CRUD ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/03-symfony-08-repository-crud-1.html" title="Qu&#x27;est-ce que CRUD ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Le Repository : rappel

**Définition** : Le repository est la classe qui permet de rechercher des entités dans la base de données.

**Où le trouver** : `src/Repository/[Entité]Repository.php`

**Comment l'obtenir dans un contrôleur** :

```php
// Méthode 1 : Injection dans la méthode (recommandé)
public function list(ProductRepository $productRepository): Response
{
    $products = $productRepository->findAll();
}

// Méthode 2 : Via l'EntityManager
public function list(EntityManagerInterface $em): Response
{
    $repository = $em->getRepository(Product::class);
    $products = $repository->findAll();
}
```

---

### L'EntityManager : rappel

**Définition** : L'EntityManager est le service qui gère la persistance des entités (sauvegarde, modification, suppression).

**Comment l'obtenir** :

```php
use Doctrine\ORM\EntityManagerInterface;

public function create(EntityManagerInterface $em): Response
{
    // Utiliser $em pour persist(), remove(), flush()
}
```

---

### Les méthodes de recherche du Repository

Chaque repository hérite de méthodes pour rechercher des entités :

| Méthode | Retour | Description |
| ------- | ------ | ----------- |
| `find($id)` | Entité ou `null` | Trouve par ID |
| `findOneBy(['champ' => 'valeur'])` | Entité ou `null` | Trouve un résultat par critères |
| `findAll()` | Tableau d'entités | Tous les enregistrements |
| `findBy(['champ' => 'valeur'])` | Tableau d'entités | Filtre par critères |
| `count(['champ' => 'valeur'])` | Entier | Compte les résultats |

**Paramètres avancés de findBy()** :

```php
findBy(
    array $criteria,      // Critères de filtrage
    array $orderBy = null, // Tri
    int $limit = null,     // Nombre max de résultats
    int $offset = null     // Décalage (pagination)
)
```

**Exemples** :

```php
// Trouver tous les produits à 29.99€
$products = $repository->findBy(['price' => '29.99']);

// Trouver tous les produits, triés par nom
$products = $repository->findBy([], ['name' => 'ASC']);

// Trouver les 10 premiers produits disponibles, triés par prix décroissant
$products = $repository->findBy(
    ['available' => true],  // Critères
    ['price' => 'DESC'],    // Tri
    10,                     // Limite
    0                       // Offset
);

// Pour la page 2 (éléments 11 à 20)
$products = $repository->findBy(
    ['available' => true],
    ['price' => 'DESC'],
    10,                     // Limite
    10                      // Offset (saute les 10 premiers)
);
```

---

### Le cycle persist/flush

**persist()** : Indique à Doctrine de "surveiller" un objet. L'objet sera sauvegardé au prochain `flush()`.

**flush()** : Exécute toutes les opérations SQL en attente (INSERT, UPDATE, DELETE).

**Pourquoi deux étapes ?**

Cette séparation permet de :

1. Préparer plusieurs opérations
2. Les exécuter toutes en une seule transaction
3. Annuler si besoin avant le flush

```php
// On peut préparer plusieurs opérations
$em->persist($product1);
$em->persist($product2);
$em->remove($oldProduct);

// Puis tout exécuter d'un coup (une seule transaction)
$em->flush();
```

---

### Le tracking des entités

Doctrine "surveille" (track) automatiquement les entités chargées depuis la base.

**Règle importante** : Pour une entité déjà en base, pas besoin de `persist()` pour la modifier.

```php
// Charger un produit (Doctrine le surveille automatiquement)
$product = $repository->find(1);

// Modifier le produit
$product->setPrice('39.99');

// Pas besoin de persist() ! L'entité est déjà surveillée.
$em->flush();  // Doctrine détecte le changement et fait un UPDATE
```

**Quand utiliser persist()** :

| Situation | persist() nécessaire ? |
| --------- | ---------------------- |
| Nouvelle entité (pas encore en base) | Oui |
| Entité chargée via find/findBy | Non |
| Entité passée en paramètre de requête | Non |

---

## Étapes Pratiques

### Étape 1 : CREATE - Créer une entité

```php
// src/Controller/ProductController.php

use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products')]
class ProductController extends AbstractController
{
    #[Route('/create', name: 'product_create')]
    public function create(EntityManagerInterface $em): Response
    {
        // 1. Créer l'objet
        $product = new Product();
        $product->setName('Clavier mécanique');
        $product->setPrice('89.99');
        $product->setDescription('Un clavier RGB');

        // 2. Dire à Doctrine de préparer la sauvegarde
        $em->persist($product);

        // 3. Exécuter le SQL (INSERT)
        $em->flush();

        // 4. Après flush, l'ID est disponible
        return new Response('Produit créé avec l\'ID : ' . $product->getId());
    }
}
```

**SQL généré** :

```sql
INSERT INTO product (name, price, description) VALUES ('Clavier mécanique', 89.99, 'Un clavier RGB');
```

---

### Étape 2 : READ - Lire une entité par ID

```php
#[Route('/{id}', name: 'product_show', methods: ['GET'])]
public function show(int $id, ProductRepository $repository): Response
{
    // Trouver le produit par son ID
    $product = $repository->find($id);

    // Vérifier si le produit existe
    if (!$product) {
        throw $this->createNotFoundException('Produit non trouvé');
    }

    return $this->render('product/show.html.twig', [
        'product' => $product,
    ]);
}
```

**Alternative avec le résolveur d'entité** (plus simple) :

```php
// Symfony convertit automatiquement l'ID en entité (résolveur d'entité intégré)
#[Route('/{id}', name: 'product_show', methods: ['GET'])]
public function show(Product $product): Response
{
    // Si le produit n'existe pas, Symfony lance automatiquement une 404
    return $this->render('product/show.html.twig', [
        'product' => $product,
    ]);
}
```

Pour personnaliser ce comportement (chercher par un autre champ que l'ID, par exemple), on utilise l'attribut optionnel `#[MapEntity]`.

---

### Étape 3 : READ - Lire tous les enregistrements

```php
#[Route('/', name: 'product_list', methods: ['GET'])]
public function list(ProductRepository $repository): Response
{
    // Récupérer tous les produits
    $products = $repository->findAll();

    return $this->render('product/list.html.twig', [
        'products' => $products,
    ]);
}
```

---

### Étape 4 : READ - Lire avec des critères

```php
#[Route('/available', name: 'product_available', methods: ['GET'])]
public function available(ProductRepository $repository): Response
{
    // Trouver les produits disponibles, triés par prix
    $products = $repository->findBy(
        ['available' => true],
        ['price' => 'ASC']
    );

    return $this->render('product/list.html.twig', [
        'products' => $products,
    ]);
}

#[Route('/search/{name}', name: 'product_search', methods: ['GET'])]
public function search(string $name, ProductRepository $repository): Response
{
    // Trouver un produit par son nom exact
    $product = $repository->findOneBy(['name' => $name]);

    if (!$product) {
        throw $this->createNotFoundException('Produit non trouvé');
    }

    return $this->render('product/show.html.twig', [
        'product' => $product,
    ]);
}
```

---

### Étape 5 : UPDATE - Modifier une entité

```php
#[Route('/{id}/edit', name: 'product_edit', methods: ['GET', 'POST'])]
public function edit(Product $product, EntityManagerInterface $em): Response
{
    // 1. L'entité est déjà chargée (résolveur d'entité)

    // 2. Modifier les propriétés
    $product->setPrice('79.99');
    $product->setDescription('Description mise à jour');

    // 3. Pas de persist() nécessaire !
    // L'entité est déjà surveillée par Doctrine

    // 4. Exécuter le SQL (UPDATE)
    $em->flush();

    return new Response('Produit mis à jour');
}
```

**SQL généré** :

```sql
UPDATE product SET price = 79.99, description = 'Description mise à jour' WHERE id = 1;
```

---

### Étape 6 : DELETE - Supprimer une entité

```php
#[Route('/{id}/delete', name: 'product_delete', methods: ['POST'])]
public function delete(Product $product, EntityManagerInterface $em): Response
{
    // 1. Marquer l'entité pour suppression
    $em->remove($product);

    // 2. Exécuter le SQL (DELETE)
    $em->flush();

    return $this->redirectToRoute('product_list');
}
```

**SQL généré** :

```sql
DELETE FROM product WHERE id = 1;
```

---

### Étape 7 : Créer une méthode personnalisée dans le Repository

Les méthodes par défaut ne permettent pas les recherches complexes (LIKE, comparaisons, etc.). Pour cela, on ajoute des méthodes au repository.

```php
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

    /**
     * Trouve les produits dont le nom contient une chaîne
     *
     * @return Product[]
     */
    public function findByNameContaining(string $search): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.name LIKE :search')
            ->setParameter('search', '%' . $search . '%')
            ->orderBy('p.name', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve les produits dans une fourchette de prix
     *
     * @return Product[]
     */
    public function findByPriceRange(float $min, float $max): array
    {
        return $this->createQueryBuilder('p')
            ->where('p.price >= :min')
            ->andWhere('p.price <= :max')
            ->setParameter('min', $min)
            ->setParameter('max', $max)
            ->orderBy('p.price', 'ASC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Compte les produits disponibles
     */
    public function countAvailable(): int
    {
        return $this->createQueryBuilder('p')
            ->select('COUNT(p.id)')
            ->where('p.available = :available')
            ->setParameter('available', true)
            ->getQuery()
            ->getSingleScalarResult();
    }
}
```

**Utilisation dans le contrôleur** :

```php
#[Route('/search', name: 'product_search')]
public function search(Request $request, ProductRepository $repository): Response
{
    $term = $request->query->get('q', '');

    $products = $repository->findByNameContaining($term);

    return $this->render('product/list.html.twig', [
        'products' => $products,
        'searchTerm' => $term,
    ]);
}
```

---

### Étape 8 : Le QueryBuilder en détail

Le QueryBuilder permet de construire des requêtes complexes de manière programmatique.

**Structure de base** :

```php
$this->createQueryBuilder('p')    // 'p' est l'alias de l'entité Product
    ->select('p')                  // Ce qu'on veut récupérer
    ->where('p.price > :price')    // Conditions
    ->setParameter('price', 50)    // Valeurs des paramètres
    ->orderBy('p.name', 'ASC')     // Tri
    ->setMaxResults(10)            // Limite
    ->getQuery()                   // Obtient l'objet Query
    ->getResult();                 // Exécute et retourne les résultats
```

**Méthodes du QueryBuilder** :

| Méthode | Action | Exemple |
| ------- | ------ | ------- |
| `select()` | Champs à sélectionner | `select('p.name, p.price')` |
| `where()` | Première condition | `where('p.price > :min')` |
| `andWhere()` | Condition ET | `andWhere('p.available = true')` |
| `orWhere()` | Condition OU | `orWhere('p.featured = true')` |
| `orderBy()` | Premier tri | `orderBy('p.name', 'ASC')` |
| `addOrderBy()` | Tri supplémentaire | `addOrderBy('p.price', 'DESC')` |
| `setMaxResults()` | Limite | `setMaxResults(10)` |
| `setFirstResult()` | Offset | `setFirstResult(20)` |
| `setParameter()` | Valeur d'un paramètre | `setParameter('min', 50)` |
| `leftJoin()` | Jointure | `leftJoin('p.category', 'c')` |
| `addSelect()` | Ajoute à la sélection | `addSelect('c')` |

**Méthodes pour obtenir les résultats** :

| Méthode | Retour | Usage |
| ------- | ------ | ----- |
| `getResult()` | Tableau d'entités | Liste de résultats |
| `getOneOrNullResult()` | Entité ou null | Un seul résultat attendu |
| `getSingleScalarResult()` | Valeur unique | COUNT, SUM, etc. |
| `getArrayResult()` | Tableau associatif | Performance (pas d'objets) |

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/console doctrine:query:dql "SELECT p FROM App\Entity\Product p"` | Tester une requête DQL |
| `php bin/console doctrine:query:sql "SELECT * FROM product"` | Exécuter du SQL brut |

---

## Pièges Fréquents

### Piège 1 : Oublier flush()

**Problème** : Les modifications ne sont pas sauvegardées.

**Cause** : `persist()` et `remove()` ne font que préparer. Sans `flush()`, rien n'est exécuté.

```php
// ❌ Les données ne sont PAS en base
$em->persist($product);

// ✅ Maintenant elles le sont
$em->persist($product);
$em->flush();
```

---

### Piège 2 : persist() sur une entité existante

**Problème** : Tu appelles `persist()` sur une entité déjà en base.

**Ce n'est pas une erreur**, mais c'est inutile :

```php
$product = $repository->find(1);  // Entité déjà surveillée
$product->setPrice('39.99');

$em->persist($product);  // Inutile mais pas d'erreur
$em->flush();            // Fonctionne
```

**Règle** : `persist()` seulement pour les nouvelles entités.

---

### Piège 3 : find() retourne null

**Problème** : `find()` retourne `null` et tu obtiens une erreur ensuite.

**Cause** : L'ID n'existe pas en base.

**Solution** : Toujours vérifier le résultat :

```php
$product = $repository->find($id);

if (!$product) {
    throw $this->createNotFoundException('Produit non trouvé');
}

// Maintenant on peut utiliser $product en sécurité
```

---

### Piège 4 : Injection SQL dans le QueryBuilder

**Problème** : Tu concatènes des valeurs directement dans la requête.

```php
// ❌ DANGEREUX : injection SQL possible
->where("p.name = '" . $userInput . "'")

// ✅ SÉCURISÉ : utiliser les paramètres
->where('p.name = :name')
->setParameter('name', $userInput)
```

**Règle** : Toujours utiliser `setParameter()` pour les valeurs.

---

### Piège 5 : Modifier une entité dans une boucle sans flush

**Problème** : Tu modifies des entités dans une boucle mais tu n'appelles `flush()` qu'à la fin.

Ce n'est pas un piège en soi, mais attention à la mémoire :

```php
// Pour beaucoup d'entités, faire des flush intermédiaires
$batchSize = 100;
$i = 0;

foreach ($products as $product) {
    $product->setPrice($newPrice);
    $i++;

    if ($i % $batchSize === 0) {
        $em->flush();
        $em->clear();  // Libère la mémoire
    }
}

$em->flush();  // Pour les derniers
```

---

## Checklist de Validation

- [ ] Je sais créer une entité avec `persist()` + `flush()`
- [ ] Je sais trouver une entité par son ID avec `find()`
- [ ] Je sais trouver des entités avec `findBy()` et `findOneBy()`
- [ ] Je sais modifier une entité existante (juste `flush()`, pas de `persist()`)
- [ ] Je sais supprimer une entité avec `remove()` + `flush()`
- [ ] Je sais créer une méthode personnalisée dans le repository
- [ ] Je comprends les bases du QueryBuilder

---

## Exercice Pratique

**Énoncé** : Crée un système CRUD complet pour une entité `Task` (liste de tâches).

**Spécifications de l'entité Task** :

- `title` : string (255), obligatoire
- `description` : text, nullable
- `isCompleted` : boolean, par défaut false
- `priority` : integer (1 à 5)
- `createdAt` : datetime_immutable, automatique
- `dueDate` : datetime, nullable

**Fonctionnalités à implémenter** :

1. Liste de toutes les tâches (`/tasks`)
2. Affichage d'une tâche (`/tasks/{id}`)
3. Création d'une tâche (en dur dans le code, pas de formulaire)
4. Marquer une tâche comme complétée (`/tasks/{id}/complete`)
5. Supprimer une tâche (`/tasks/{id}/delete`)
6. Méthode repository : `findPendingOrderedByPriority()` (tâches non complétées, triées par priorité décroissante)

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Création de l'entité** :

```bash
php bin/console make:entity Task
```

Propriétés à ajouter :

- title (string, 255, not null)
- description (text, nullable)
- isCompleted (boolean, not null)
- priority (integer, not null)
- createdAt (datetime_immutable, not null)
- dueDate (datetime, nullable)

**Fichier `src/Entity/Task.php`** (complet) :

```php
<?php

namespace App\Entity;

use App\Repository\TaskRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: TaskRepository::class)]
class Task
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $title = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private ?bool $isCompleted = false;

    #[ORM\Column]
    private ?int $priority = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(type: Types::DATETIME_MUTABLE, nullable: true)]
    private ?\DateTime $dueDate = null;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->isCompleted = false;
    }

    // ... getters et setters générés
}
```

**Fichier `src/Repository/TaskRepository.php`** :

```php
<?php

namespace App\Repository;

use App\Entity\Task;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

class TaskRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Task::class);
    }

    /**
     * Trouve les tâches non complétées, triées par priorité décroissante
     *
     * @return Task[]
     */
    public function findPendingOrderedByPriority(): array
    {
        return $this->createQueryBuilder('t')
            ->where('t.isCompleted = :completed')
            ->setParameter('completed', false)
            ->orderBy('t.priority', 'DESC')
            ->getQuery()
            ->getResult();
    }
}
```

**Fichier `src/Controller/TaskController.php`** :

```php
<?php

namespace App\Controller;

use App\Entity\Task;
use App\Repository\TaskRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/tasks')]
class TaskController extends AbstractController
{
    // 1. Liste de toutes les tâches
    #[Route('/', name: 'task_list', methods: ['GET'])]
    public function list(TaskRepository $repository): Response
    {
        $tasks = $repository->findAll();

        return $this->render('task/list.html.twig', [
            'tasks' => $tasks,
        ]);
    }

    // 2. Affichage d'une tâche
    #[Route('/{id}', name: 'task_show', methods: ['GET'], requirements: ['id' => '\d+'])]
    public function show(Task $task): Response
    {
        return $this->render('task/show.html.twig', [
            'task' => $task,
        ]);
    }

    // 3. Création d'une tâche (en dur)
    #[Route('/create', name: 'task_create', methods: ['GET'])]
    public function create(EntityManagerInterface $em): Response
    {
        $task = new Task();
        $task->setTitle('Nouvelle tâche de test');
        $task->setDescription('Description de la tâche');
        $task->setPriority(3);
        $task->setDueDate(new \DateTime('+7 days'));

        $em->persist($task);
        $em->flush();

        return $this->redirectToRoute('task_show', ['id' => $task->getId()]);
    }

    // 4. Marquer comme complétée
    #[Route('/{id}/complete', name: 'task_complete', methods: ['POST'])]
    public function complete(Task $task, EntityManagerInterface $em): Response
    {
        $task->setIsCompleted(true);
        $em->flush();

        return $this->redirectToRoute('task_show', ['id' => $task->getId()]);
    }

    // 5. Supprimer une tâche
    #[Route('/{id}/delete', name: 'task_delete', methods: ['POST'])]
    public function delete(Task $task, EntityManagerInterface $em): Response
    {
        $em->remove($task);
        $em->flush();

        return $this->redirectToRoute('task_list');
    }

    // 6. Liste des tâches en attente
    #[Route('/pending', name: 'task_pending', methods: ['GET'])]
    public function pending(TaskRepository $repository): Response
    {
        $tasks = $repository->findPendingOrderedByPriority();

        return $this->render('task/list.html.twig', [
            'tasks' => $tasks,
            'title' => 'Tâches en attente',
        ]);
    }
}
```

**Migrations** :

```bash
php bin/console make:migration
php bin/console doctrine:migrations:migrate
```

---

## Navigation

← Fiche précédente : **[Relations entre entités](07-relations-entites.md)**

→ Fiche suivante : **[Les formulaires](09-formulaires.md)**
