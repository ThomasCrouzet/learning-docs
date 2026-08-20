---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les namespaces et le mot-clé use"
estimated_time: "65 min"
fiche_number: 9
total_fiches: 14
cursus: "PHP"
---

# 09 - Les namespaces et le mot-clé use

> **En bref** : À la fin de cette fiche, tu sauras lire et comprendre les lignes namespace et use en haut des fichiers PHP, et tu sauras importer une classe d'un autre fichier. Ces concepts sont utilisés dans chaque fichier Symfony. Lecture estimée : 65 min.


## Prérequis

- Fiche [02-php/07 - Introduction à la programmation orientée objet](07-introduction-poo.md) (POO)
- Fiche [02-php/08 - Les classes en détail](08-classes-en-detail.md)
- Savoir créer des classes avec des propriétés et des méthodes

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et comprendre les lignes `namespace` et `use` en haut des fichiers PHP, et tu sauras importer une classe d'un autre fichier. Ces concepts sont utilisés dans chaque fichier Symfony.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un namespace ?

**Définition** : Un namespace (espace de noms) est un moyen d'organiser les classes PHP dans des "dossiers virtuels". Il permet d'avoir plusieurs classes avec le même nom sans conflit.

**Le problème que les namespaces résolvent** :

Sans namespaces, voici les problèmes rencontrés :

1. **Conflits de noms** : Si tu as une classe `User` et qu'une bibliothèque externe a aussi une classe `User`, il y a conflit.

2. **Noms trop longs** : Pour éviter les conflits, tu dois nommer tes classes `MonProjet_Models_User` au lieu de `User`.

3. **Organisation difficile** : Difficile de savoir d'où vient une classe quand tu lis le code.

4. **Pas de structure** : Toutes les classes sont "en vrac" dans l'espace global.

**Comment les namespaces résolvent ces problèmes** :

| Problème | Solution avec namespaces |
| -------- | ------------------------ |
| Conflits de noms | Chaque namespace peut avoir sa propre classe `User` |
| Noms trop longs | Le namespace contient le "chemin", la classe garde un nom court |
| Organisation difficile | Le namespace indique clairement l'origine |
| Pas de structure | Les namespaces créent une hiérarchie logique |

**Analogie concrète** : Un namespace fonctionne comme les dossiers de ton ordinateur. Tu peux avoir un fichier `photo.jpg` dans `/Vacances/2024/` et un autre `photo.jpg` dans `/Travail/Projets/`. Les deux fichiers ont le même nom mais sont dans des dossiers différents, donc pas de conflit.

Le diagramme suivant montre comment les namespaces organisent les classes en arborescence :

<div class="diagram-design">
<p><a href="../../diagrams/02-php-09-namespaces-use-1.html">Qu&#x27;est-ce qu&#x27;un namespace ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/02-php-09-namespaces-use-1.html" title="Qu&#x27;est-ce qu&#x27;un namespace ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Syntaxe d'un namespace

**Déclarer un namespace** :

La déclaration de namespace doit être la première instruction du fichier, après `<?php` et les commentaires. Seul `declare` (par exemple `declare(strict_types=1);`) peut précéder `namespace`.

```php
<?php

namespace MonProjet\Models;

class User
{
    // ...
}
```

**Règles de nommage** :

| Règle | Exemple |
| ----- | ------- |
| Utilise le PascalCase | `MonProjet`, `Models`, `Entity` |
| Sépare les niveaux par `\` | `App\Entity\User` |
| Correspond aux dossiers | `App\Entity` → fichier dans `src/Entity/` |

**Conventions Symfony** :

| Namespace | Dossier | Contenu |
| --------- | ------- | ------- |
| `App\Entity` | `src/Entity/` | Entités Doctrine |
| `App\Controller` | `src/Controller/` | Contrôleurs |
| `App\Repository` | `src/Repository/` | Repositories |
| `App\Service` | `src/Service/` | Services métier |
| `App\Form` | `src/Form/` | Formulaires |

---

### Le nom complet d'une classe (FQCN)

**Définition** : Le FQCN (Fully Qualified Class Name) est le nom complet d'une classe, namespace inclus, par exemple `App\Entity\User`. C'est la valeur que renvoient `User::class` et `get_class($objet)`, sans backslash de tête.

Dans le code, on écrit parfois un backslash `\` devant (`\App\Entity\User`) pour forcer PHP à partir de la racine et ignorer les `use`. Ce `\` est une notation de résolution : il ne fait pas partie du nom canonique de la classe.

**Exemples** :

| Classe | Namespace | Référence absolue (dans le code) |
| ------ | --------- | -------------------------------- |
| `User` | `App\Entity` | `\App\Entity\User` |
| `DateTime` | (global) | `\DateTime` |
| `ProductController` | `App\Controller` | `\App\Controller\ProductController` |

Le FQCN canonique est le même nom sans le `\` de tête (par exemple `App\Entity\User`).

**Utiliser une classe avec son FQCN** :

```php
<?php

namespace App\Controller;

class UserController
{
    public function index()
    {
        // Utilisation avec FQCN complet
        $user = new \App\Entity\User();
        $date = new \DateTime();
    }
}
```

C'est verbeux. C'est pourquoi on utilise `use`.

---

### Le mot-clé use

**Définition** : Le mot-clé `use` permet d'importer une classe dans le fichier courant. Après l'import, tu peux utiliser le nom court de la classe.

**Syntaxe** :

```php
<?php

namespace App\Controller;

use App\Entity\User;
use DateTime;

class UserController
{
    public function index()
    {
        // Plus besoin du FQCN
        $user = new User();
        $date = new DateTime();
    }
}
```

**Placement des use** :

1. Après la déclaration `namespace`
2. Avant la déclaration de la classe
3. Un `use` par ligne (convention)

```php
<?php

namespace App\Controller;       // 1. Namespace

use App\Entity\User;            // 2. Imports
use App\Repository\UserRepository;
use Symfony\Component\HttpFoundation\Response;

class UserController            // 3. Classe
{
    // ...
}
```

---

### Importer plusieurs classes

**Une classe par ligne** (recommandé) :

```php
<?php

use App\Entity\User;
use App\Entity\Product;
use App\Entity\Order;
```

**Regrouper les imports** (PHP 7+) :

```php
<?php

use App\Entity\{User, Product, Order};
```

La première méthode est plus lisible et recommandée.

---

### Les alias avec as

**Définition** : Si deux classes ont le même nom dans des namespaces différents, tu peux créer un alias avec `as`.

**Problème** :

```php
<?php

use App\Entity\User;
use External\Library\User;  // Conflit ! Deux classes User
```

**Solution avec alias** :

```php
<?php

use App\Entity\User;
use External\Library\User as ExternalUser;

class Example
{
    public function test()
    {
        $myUser = new User();           // App\Entity\User
        $extUser = new ExternalUser();  // External\Library\User
    }
}
```

---

### L'autoloading (chargement automatique)

**Définition** : L'autoloading est un mécanisme qui charge automatiquement les fichiers de classe quand tu en as besoin. Tu n'as pas besoin d'écrire `require` ou `include`.

**Comment ça fonctionne** :

1. Quand tu écris `new User()`, PHP cherche la classe `User`
2. L'autoloader convertit le namespace en chemin de fichier
3. Le fichier est automatiquement inclus

**La convention PSR-4** :

PSR-4 est une norme qui définit comment les namespaces correspondent aux dossiers.

| Namespace | Fichier |
| --------- | ------- |
| `App\Entity\User` | `src/Entity/User.php` |
| `App\Controller\ProductController` | `src/Controller/ProductController.php` |
| `App\Service\EmailService` | `src/Service/EmailService.php` |

**Règles PSR-4** :

1. Un fichier par classe
2. Le nom du fichier = nom de la classe + `.php`
3. Le chemin du fichier correspond au namespace
4. Le namespace de base (`App`) correspond à un dossier de base (`src/`)

**Configuration dans Symfony** :

Le fichier `composer.json` configure l'autoloading :

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    }
}
```

Cela signifie : "Le namespace `App\` correspond au dossier `src/`".

---

### Classes natives de PHP

Les classes natives de PHP (comme `DateTime`, `Exception`) n'ont pas de namespace. Elles sont dans l'espace "global".

**Dans un fichier sans namespace** :

```php
<?php

$date = new DateTime();  // Fonctionne directement
```

**Dans un fichier avec namespace** :

```php
<?php

namespace App\Service;

class MonService
{
    public function test()
    {
        // Erreur ! PHP cherche App\Service\DateTime qui n'existe pas
        // $date = new DateTime();

        // Solution 1 : FQCN avec \
        $date = new \DateTime();

        // Solution 2 : Importer avec use
    }
}
```

**Solution propre avec use** :

```php
<?php

namespace App\Service;

use DateTime;  // Importe depuis l'espace global

class MonService
{
    public function test()
    {
        $date = new DateTime();  // Fonctionne maintenant
    }
}
```

---

### Structure type d'un fichier Symfony

Voici à quoi ressemble un fichier PHP dans un projet Symfony :

```php
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    #[Route('/products', name: 'product_list')]
    public function list(ProductRepository $repository): Response
    {
        $products = $repository->findAll();

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }
}
```

**Analyse ligne par ligne** :

| Ligne | Explication |
| ----- | ----------- |
| `namespace App\Controller;` | Ce fichier est dans le dossier `src/Controller/` |
| `use App\Entity\Product;` | Importe la classe Product de `src/Entity/Product.php` |
| `use Symfony\...` | Importe des classes du framework Symfony |
| `extends AbstractController` | Hérite d'une classe Symfony (possible grâce à l'import) |
| `ProductRepository $repository` | Type-hint avec la classe importée |

---

## Étapes Pratiques

### Étape 1 : Comprendre le problème sans namespace

Crée un fichier `public/sans-namespace.php` :

```php
<?php
// Démonstration du problème sans namespace

// Première classe User
class User
{
    public string $nom = "Utilisateur de mon app";
}

// Si on veut une autre classe User (par exemple d'une bibliothèque),
// on ne peut pas ! PHP dira "Cannot redeclare class User"

// Deuxième classe User (décommenter pour voir l'erreur)
// class User
// {
//     public string $nom = "Utilisateur externe";
// }

$user = new User();
echo "<h1>Sans namespace</h1>";
echo "<p>Nom : " . $user->nom . "</p>";
echo "<p>Problème : impossible d'avoir deux classes avec le même nom !</p>";
```

---

### Étape 2 : Organisation avec namespaces (simulation)

Crée un fichier `public/avec-namespace.php` :

```php
<?php
// Démonstration de la solution avec namespaces

// Définition dans un premier "namespace" (simulé dans le même fichier)
namespace MonApp\Entity {
    class User
    {
        public string $nom = "Utilisateur de mon app";

        public function getInfo(): string
        {
            return "MonApp\\Entity\\User : " . $this->nom;
        }
    }
}

// Définition dans un second "namespace" (simulé)
namespace Externe\Lib {
    class User
    {
        public string $nom = "Utilisateur externe";

        public function getInfo(): string
        {
            return "Externe\\Lib\\User : " . $this->nom;
        }
    }
}

// Code principal
namespace {
    // Les deux classes User peuvent coexister grâce aux namespaces !
    $monUser = new \MonApp\Entity\User();
    $extUser = new \Externe\Lib\User();

    echo "<h1>Avec namespaces</h1>";
    echo "<p>" . $monUser->getInfo() . "</p>";
    echo "<p>" . $extUser->getInfo() . "</p>";
    echo "<p>Les deux classes User coexistent sans conflit !</p>";
}
```

**Note** : En pratique, chaque namespace est dans un fichier séparé (un fichier = une classe = un namespace). Cette démonstration montre juste le principe.

---

### Étape 3 : Structure de fichiers réaliste

Crée la structure suivante :

```text
public/
  demo-namespace/
    index.php
    src/
      Entity/
        User.php
        Product.php
      Service/
        UserService.php
```

**Fichier `public/demo-namespace/src/Entity/User.php`** :

```php
<?php

namespace Demo\Entity;

class User
{
    private string $nom;
    private string $email;

    public function __construct(string $nom, string $email)
    {
        $this->nom = $nom;
        $this->email = $email;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function getEmail(): string
    {
        return $this->email;
    }

    public function getPresentation(): string
    {
        return $this->nom . " (" . $this->email . ")";
    }
}
```

**Fichier `public/demo-namespace/src/Entity/Product.php`** :

```php
<?php

namespace Demo\Entity;

class Product
{
    private string $nom;
    private float $prix;

    public function __construct(string $nom, float $prix)
    {
        $this->nom = $nom;
        $this->prix = $prix;
    }

    public function getNom(): string
    {
        return $this->nom;
    }

    public function getPrix(): float
    {
        return $this->prix;
    }

    public function getPrixFormate(): string
    {
        return number_format($this->prix, 2, ",", " ") . " €";
    }
}
```

**Fichier `public/demo-namespace/src/Service/UserService.php`** :

```php
<?php

namespace Demo\Service;

use Demo\Entity\User;

class UserService
{
    private array $users = [];

    public function addUser(User $user): void
    {
        $this->users[] = $user;
    }

    public function getAllUsers(): array
    {
        return $this->users;
    }

    public function findByEmail(string $email): ?User
    {
        foreach ($this->users as $user) {
            if ($user->getEmail() === $email) {
                return $user;
            }
        }
        return null;
    }

    public function count(): int
    {
        return count($this->users);
    }
}
```

**Fichier `public/demo-namespace/index.php`** :

```php
<?php

// Autoloader simple (en vrai, Composer fait ça automatiquement)
spl_autoload_register(function ($class) {
    // Convertit Demo\Entity\User en src/Entity/User.php
    $prefix = 'Demo\\';
    $baseDir = __DIR__ . '/src/';

    // Vérifie si la classe utilise le namespace Demo
    $len = strlen($prefix);
    if (strncmp($prefix, $class, $len) !== 0) {
        return;
    }

    // Récupère le nom relatif de la classe
    $relativeClass = substr($class, $len);

    // Convertit les \ en / et ajoute .php
    $file = $baseDir . str_replace('\\', '/', $relativeClass) . '.php';

    // Charge le fichier s'il existe
    if (file_exists($file)) {
        require $file;
    }
});

// Maintenant on peut utiliser les classes avec use
use Demo\Entity\User;
use Demo\Entity\Product;
use Demo\Service\UserService;

echo "<h1>Démonstration des namespaces</h1>";

// Création d'utilisateurs
$service = new UserService();

$user1 = new User("Inès", "alex@example.com");
$user2 = new User("John", "john@example.com");

$service->addUser($user1);
$service->addUser($user2);

echo "<h2>Utilisateurs (" . $service->count() . ")</h2>";
echo "<ul>";
foreach ($service->getAllUsers() as $user) {
    echo "<li>" . $user->getPresentation() . "</li>";
}
echo "</ul>";

// Recherche
echo "<h2>Recherche par email</h2>";
$found = $service->findByEmail("alex@example.com");
if ($found) {
    echo "<p>Trouvé : " . $found->getNom() . "</p>";
}

// Création de produits
echo "<h2>Produits</h2>";
$products = [
    new Product("Laptop", 999.99),
    new Product("Souris", 29.99),
];

echo "<ul>";
foreach ($products as $product) {
    echo "<li>" . $product->getNom() . " : " . $product->getPrixFormate() . "</li>";
}
echo "</ul>";

// Afficher les namespaces utilisés
echo "<h2>Classes utilisées</h2>";
echo "<pre>";
echo "User      : " . User::class . "\n";
echo "Product   : " . Product::class . "\n";
echo "Service   : " . UserService::class . "\n";
echo "</pre>";
```

---

### Étape 4 : Lire un fichier Symfony

Crée un fichier `public/lecture-symfony.php` pour analyser un fichier type Symfony :

```php
<?php
echo "<h1>Analyse d'un fichier Symfony type</h1>";

$code = <<<'CODE'
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/product')]
class ProductController extends AbstractController
{
    #[Route('/', name: 'product_index', methods: ['GET'])]
    public function index(ProductRepository $repository): Response
    {
        return $this->render('product/index.html.twig', [
            'products' => $repository->findAll(),
        ]);
    }

    #[Route('/new', name: 'product_new', methods: ['GET', 'POST'])]
    public function new(Request $request, EntityManagerInterface $em): Response
    {
        $product = new Product();
        // ...
    }
}
CODE;

echo "<pre style='background: #f5f5f5; padding: 15px;'>";
echo htmlspecialchars($code);
echo "</pre>";

echo "<h2>Analyse ligne par ligne</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Ligne</th><th>Explication</th></tr>";

$analyses = [
    "namespace App\\Controller;" => "Ce fichier est dans <code>src/Controller/</code>",
    "use App\\Entity\\Product;" => "Importe la classe Product depuis <code>src/Entity/Product.php</code>",
    "use App\\Repository\\ProductRepository;" => "Importe le repository depuis <code>src/Repository/</code>",
    "use Doctrine\\ORM\\EntityManagerInterface;" => "Importe une interface de Doctrine (bibliothèque externe)",
    "use Symfony\\...\\AbstractController;" => "Importe la classe de base des contrôleurs Symfony",
    "use Symfony\\...\\Request;" => "Importe la classe pour gérer les requêtes HTTP",
    "use Symfony\\...\\Response;" => "Importe la classe pour les réponses HTTP",
    "use Symfony\\...\\Route;" => "Importe l'attribut pour définir les routes",
    "extends AbstractController" => "Hérite de la classe importée (sans namespace devant)",
    "ProductRepository \$repository" => "Type-hint avec la classe importée",
    "new Product()" => "Crée un objet de la classe importée",
];

foreach ($analyses as $ligne => $explication) {
    echo "<tr>";
    echo "<td><code>" . htmlspecialchars($ligne) . "</code></td>";
    echo "<td>" . $explication . "</td>";
    echo "</tr>";
}

echo "</table>";

echo "<h2>Correspondance Namespace → Fichier</h2>";
echo "<table border='1' cellpadding='10'>";
echo "<tr><th>Classe (FQCN)</th><th>Fichier</th></tr>";

$correspondances = [
    "App\\Controller\\ProductController" => "src/Controller/ProductController.php",
    "App\\Entity\\Product" => "src/Entity/Product.php",
    "App\\Repository\\ProductRepository" => "src/Repository/ProductRepository.php",
];

foreach ($correspondances as $fqcn => $fichier) {
    echo "<tr>";
    echo "<td><code>" . $fqcn . "</code></td>";
    echo "<td><code>" . $fichier . "</code></td>";
    echo "</tr>";
}

echo "</table>";
```

---

### Étape 5 : Utiliser des alias

Crée un fichier `public/alias.php` :

```php
<?php

// Simulation de deux classes avec le même nom
namespace App\Entity {
    class User
    {
        public function getSource(): string
        {
            return "App\\Entity\\User (notre application)";
        }
    }
}

namespace External\Auth {
    class User
    {
        public function getSource(): string
        {
            return "External\\Auth\\User (bibliothèque externe)";
        }
    }
}

// Code principal avec alias
namespace {
    use App\Entity\User;
    use External\Auth\User as AuthUser;  // Alias pour éviter le conflit

    echo "<h1>Utilisation des alias</h1>";

    $monUser = new User();
    $authUser = new AuthUser();

    echo "<p>" . $monUser->getSource() . "</p>";
    echo "<p>" . $authUser->getSource() . "</p>";

    echo "<h2>Syntaxe utilisée</h2>";
    echo "<pre>";
    echo "use App\\Entity\\User;                    // Nom court : User\n";
    echo "use External\\Auth\\User as AuthUser;    // Alias : AuthUser\n";
    echo "</pre>";
}
```

---

## Commandes Utiles

| Action | Syntaxe | Exemple |
| ------ | ------- | ------- |
| Déclarer namespace | `namespace Chemin\Vers;` | `namespace App\Entity;` |
| Importer une classe | `use Namespace\Classe;` | `use App\Entity\User;` |
| Importer avec alias | `use Ns\Classe as Alias;` | `use App\Entity\User as AppUser;` |
| Classe globale | `use DateTime;` | `use Exception;` |
| FQCN avec \ | `\Namespace\Classe` | `new \DateTime()` |
| Obtenir le FQCN | `Classe::class` | `User::class` → `"App\Entity\User"` |

---

## Pièges Fréquents

### Piège 1 : Oublier use pour les classes natives

**Problème** : Dans un fichier avec namespace, `DateTime` n'est pas trouvée.

**Solution** : Utilise `\DateTime` ou ajoute `use DateTime;`.

```php
<?php

namespace App\Service;

// Incorrect
class MonService
{
    public function test()
    {
        // $date = new DateTime();  // Erreur !
    }
}

// Correct (option 1 : backslash)
class MonService1
{
    public function test()
    {
        $date = new \DateTime();  // OK
    }
}

// Correct (option 2 : use)
use DateTime;

class MonService2
{
    public function test()
    {
        $date = new DateTime();  // OK
    }
}
```

---

### Piège 2 : Namespace ne correspond pas au fichier

**Problème** : L'autoloader ne trouve pas la classe.

**Solution** : Le namespace doit correspondre exactement au chemin du fichier.

```php
<?php
// Fichier : src/Entity/User.php

// Incorrect (ne correspond pas au chemin)
namespace App\Models;  // Devrait être dans src/Models/

// Correct
namespace App\Entity;  // Correspond à src/Entity/
```

---

### Piège 3 : use après la classe

**Problème** : Erreur de syntaxe.

**Solution** : Les `use` doivent être avant la classe.

```php
<?php

namespace App\Controller;

// Incorrect
class MonController
{
    // ...
}
use App\Entity\User;  // Erreur ! Trop tard

// Correct
use App\Entity\User;

class MonController
{
    // ...
}
```

---

### Piège 4 : Confondre \ et /

**Problème** : Tu utilises `/` au lieu de `\` dans les namespaces.

**Solution** : Les namespaces utilisent toujours `\` (backslash).

```php
<?php

// Incorrect
// namespace App/Entity;  // Erreur de syntaxe

// Correct
namespace App\Entity;
```

---

### Piège 5 : Oublier le namespace dans un fichier de classe

**Problème** : La classe n'est pas trouvée par l'autoloader.

**Solution** : Chaque fichier de classe doit déclarer son namespace.

```php
<?php
// Fichier : src/Entity/Product.php

// Incorrect (pas de namespace)
class Product
{
    // L'autoloader ne trouvera pas cette classe
}

// Correct
namespace App\Entity;

class Product
{
    // Maintenant l'autoloader peut la trouver
}
```

---

## Checklist de Validation

- [ ] J'ai compris que les namespaces organisent les classes comme des dossiers
- [ ] J'ai compris la correspondance entre namespace et chemin de fichier
- [ ] J'ai compris le rôle de `use` pour importer des classes
- [ ] Je sais utiliser `as` pour créer un alias
- [ ] Je sais que les classes natives (`DateTime`) nécessitent `\` ou `use`
- [ ] J'ai compris la structure d'un fichier Symfony (namespace, use, class)
- [ ] Je sais lire un FQCN comme `App\Entity\User`
- [ ] Je sais que `Classe::class` retourne le FQCN

---

## Exercice Pratique

**Énoncé** : Analyse un fichier d'entité Doctrine.

**Indications** :

- Crée un fichier `public/analyse-entite.php`
- Copie le code d'une entité Doctrine type (fourni ci-dessous)
- Crée un tableau HTML qui liste :
  - Chaque ligne `use` avec l'explication de ce qu'elle importe
  - Le fichier correspondant à chaque classe importée
- Identifie quelles classes viennent de Symfony, de Doctrine, ou de l'application

**Code à analyser** :

```php
<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    // Getters et setters...
}
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/analyse-entite.php
// Analyse d'une entité Doctrine

$codeEntite = <<<'CODE'
<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $name = null;

    #[ORM\Column(type: Types::DECIMAL, precision: 10, scale: 2)]
    private ?string $price = null;

    // Getters et setters...
}
CODE;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Analyse d'une entité Doctrine</title>
    <style>
        .app { background-color: #e3f2fd; }
        .doctrine { background-color: #fff3e0; }
        .symfony { background-color: #e8f5e9; }
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        code { background: #eee; padding: 2px 5px; }
    </style>
</head>
<body>
    <h1>Analyse d'une entité Doctrine</h1>

    <h2>Code source</h2>
    <pre><?php echo htmlspecialchars($codeEntite); ?></pre>

    <h2>Analyse du namespace</h2>
    <table border="1" cellpadding="10">
        <tr>
            <th>Déclaration</th>
            <th>Signification</th>
            <th>Fichier</th>
        </tr>
        <tr class="app">
            <td><code>namespace App\Entity;</code></td>
            <td>Ce fichier fait partie de l'application, dans le dossier Entity</td>
            <td><code>src/Entity/Product.php</code></td>
        </tr>
    </table>

    <h2>Analyse des imports (use)</h2>
    <table border="1" cellpadding="10">
        <tr>
            <th>Import</th>
            <th>Source</th>
            <th>Rôle</th>
            <th>Fichier/Package</th>
        </tr>
        <tr class="app">
            <td><code>use App\Repository\ProductRepository;</code></td>
            <td>Application</td>
            <td>Classe qui gère les requêtes pour Product</td>
            <td><code>src/Repository/ProductRepository.php</code></td>
        </tr>
        <tr class="doctrine">
            <td><code>use Doctrine\DBAL\Types\Types;</code></td>
            <td>Doctrine DBAL</td>
            <td>Constantes pour les types de colonnes SQL</td>
            <td>Package <code>doctrine/dbal</code></td>
        </tr>
        <tr class="doctrine">
            <td><code>use Doctrine\ORM\Mapping as ORM;</code></td>
            <td>Doctrine ORM</td>
            <td>Attributs pour configurer le mapping objet-relationnel</td>
            <td>Package <code>doctrine/orm</code></td>
        </tr>
    </table>

    <h2>Légende des couleurs</h2>
    <ul>
        <li><span class="app" style="padding: 5px;">Bleu</span> : Classes de l'application (App\)</li>
        <li><span class="doctrine" style="padding: 5px;">Orange</span> : Classes Doctrine</li>
        <li><span class="symfony" style="padding: 5px;">Vert</span> : Classes Symfony</li>
    </ul>

    <h2>Utilisation des imports dans le code</h2>
    <table border="1" cellpadding="10">
        <tr>
            <th>Code</th>
            <th>Classe utilisée</th>
            <th>Grâce à l'import</th>
        </tr>
        <tr>
            <td><code>#[ORM\Entity(...)]</code></td>
            <td><code>Doctrine\ORM\Mapping\Entity</code></td>
            <td><code>use Doctrine\ORM\Mapping as ORM;</code></td>
        </tr>
        <tr>
            <td><code>#[ORM\Id]</code></td>
            <td><code>Doctrine\ORM\Mapping\Id</code></td>
            <td><code>use Doctrine\ORM\Mapping as ORM;</code></td>
        </tr>
        <tr>
            <td><code>#[ORM\Column]</code></td>
            <td><code>Doctrine\ORM\Mapping\Column</code></td>
            <td><code>use Doctrine\ORM\Mapping as ORM;</code></td>
        </tr>
        <tr>
            <td><code>Types::DECIMAL</code></td>
            <td><code>Doctrine\DBAL\Types\Types::DECIMAL</code></td>
            <td><code>use Doctrine\DBAL\Types\Types;</code></td>
        </tr>
        <tr>
            <td><code>ProductRepository::class</code></td>
            <td><code>App\Repository\ProductRepository</code></td>
            <td><code>use App\Repository\ProductRepository;</code></td>
        </tr>
    </table>

    <h2>Points clés à retenir</h2>
    <ul>
        <li><strong>ORM</strong> est un alias : <code>use Doctrine\ORM\Mapping as ORM;</code></li>
        <li>Cela permet d'écrire <code>#[ORM\Column]</code> au lieu de <code>#[Doctrine\ORM\Mapping\Column]</code></li>
        <li>Les attributs <code>#[...]</code> sont expliqués dans la fiche suivante</li>
        <li>Les classes Doctrine sont installées via Composer, pas dans <code>src/</code></li>
    </ul>
</body>
</html>
```

**Points importants de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `as ORM` | Alias qui permet d'écrire `ORM\Entity` au lieu du FQCN complet |
| `Types::DECIMAL` | Constante de classe, accessible grâce à l'import |
| `ProductRepository::class` | Retourne le FQCN grâce à l'import |
| Classes Doctrine | Ne sont pas dans `src/`, mais dans `vendor/` (installées par Composer) |

---

## Navigation

← Fiche précédente : **[Les classes en détail](08-classes-en-detail.md)**

→ Fiche suivante : **[Les attributs PHP (annotations modernes)](10-attributs-php.md)**
