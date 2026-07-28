---
tags:
  - PHP
  - Avancé
  - Pratique
description: "Les attributs PHP (annotations modernes)"
estimated_time: "55 min"
fiche_number: 10
total_fiches: 14
cursus: "PHP"
---

# 10 - Les attributs PHP (annotations modernes)

> **En bref** : À la fin de cette fiche, tu sauras lire et comprendre les attributs PHP utilisés dans Symfony et Doctrine. Tu comprendras la syntaxe #[Attribut] et pourquoi elle est utilisée pour configurer les entités et les routes. Lecture estimée : 55 min.


## Prérequis

- Fiche [02-php/08 - Les classes en détail](08-classes-en-detail.md)
- Fiche [02-php/09 - Les namespaces et le mot-clé use](09-namespaces-use.md)
- Savoir créer des classes et importer avec `use`

## Version requise

| Technologie | Version minimum |
| ----------- | --------------- |
| PHP | 8.0 (les attributs n'existent pas avant PHP 8) |

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et comprendre les attributs PHP utilisés dans Symfony et Doctrine. Tu comprendras la syntaxe `#[Attribut]` et pourquoi elle est utilisée pour configurer les entités et les routes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un attribut ?

**Définition** : Un attribut est une métadonnée attachée à un élément du code (classe, méthode, propriété). Il fournit des informations supplémentaires que les frameworks peuvent lire et utiliser.

**Le problème que les attributs résolvent** :

Sans attributs, voici les problèmes rencontrés :

1. **Configuration séparée** : La configuration est dans des fichiers YAML/XML séparés du code. Tu dois chercher dans deux endroits.

2. **Synchronisation difficile** : Si tu renommes une propriété, tu dois aussi modifier le fichier de configuration.

3. **Pas de vérification** : Les erreurs dans les fichiers de configuration ne sont détectées qu'à l'exécution.

4. **Code verbeux** : Beaucoup de code répétitif pour associer configuration et classes.

**Comment les attributs résolvent ces problèmes** :

| Problème | Solution avec les attributs |
| -------- | --------------------------- |
| Configuration séparée | Configuration directement sur le code concerné |
| Synchronisation | Tout est au même endroit, facile à maintenir |
| Pas de vérification | L'IDE peut vérifier la syntaxe des attributs |
| Code verbeux | Syntaxe concise et lisible |

**Analogie concrète** : Les attributs sont comme des étiquettes collées sur des boîtes. Au lieu d'avoir une liste séparée qui dit "la boîte rouge contient des livres", tu colles directement une étiquette "Livres" sur la boîte rouge. L'information est attachée à ce qu'elle décrit.

---

### Syntaxe des attributs

**Syntaxe de base** :

```php
<?php

#[MonAttribut]
class MaClasse
{
}
```

**Attribut avec paramètres** :

```php
<?php

#[Route('/users', name: 'user_list')]
public function list()
{
}
```

**Les parties de la syntaxe** :

| Partie | Description | Exemple |
| ------ | ----------- | ------- |
| `#[` | Ouverture de l'attribut | `#[` |
| Nom | Nom de la classe d'attribut | `Route` |
| `(` | Ouverture des paramètres | `(` |
| Paramètres | Valeurs de configuration | `'/users', name: 'user_list'` |
| `)` | Fermeture des paramètres | `)` |
| `]` | Fermeture de l'attribut | `]` |

---

### Où placer les attributs ?

Les attributs peuvent être placés sur :

| Élément | Exemple | Utilisation courante |
| ------- | ------- | -------------------- |
| Classe | `#[Entity]` | Entités Doctrine |
| Méthode | `#[Route('/')]` | Routes Symfony |
| Propriété | `#[Column]` | Colonnes de base de données |
| Paramètre | `#[MapEntity]` | Injection de dépendances |

**Exemples** :

```php
<?php

#[ORM\Entity]                    // Attribut sur la classe
class Product
{
    #[ORM\Id]                    // Attribut sur la propriété
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]   // Attribut avec paramètre
    private string $name;
}

class ProductController
{
    #[Route('/products')]        // Attribut sur la méthode
    public function index(): Response
    {
    }
}
```

---

### Paramètres nommés vs positionnels

**Paramètres positionnels** : L'ordre compte, et il suit la signature de l'attribut (pas l'ordre "logique" que tu imagines).

```php
<?php

// Signature réelle de #[Route] (Symfony) :
// path, name, requirements, options, defaults, host, methods, ...
// Donc le 3e argument positionnel est $requirements, PAS $methods.

#[Route('/products', 'product_list')]
// Équivalent à : path='/products', name='product_list'
// (sans méthodes HTTP restrictives)
```

**Paramètres nommés** : L'ordre ne compte pas (recommandé, surtout pour `methods`).

```php
<?php

#[Route(path: '/products', name: 'product_list', methods: ['GET'])]
// ou
#[Route(name: 'product_list', path: '/products', methods: ['GET'])]
```

**Recommandation** : Utilise les paramètres nommés pour plus de clarté. Pour `methods`, les paramètres nommés sont obligatoires en pratique : passer `['GET']` en 3e argument positionnel le mettrait dans `requirements`, pas dans `methods`.

---

### Plusieurs attributs

Tu peux mettre plusieurs attributs sur le même élément :

**Sur des lignes séparées** (recommandé) :

```php
<?php

#[ORM\Id]
#[ORM\GeneratedValue]
#[ORM\Column]
private ?int $id = null;
```

**Sur une seule ligne** :

```php
<?php

#[ORM\Id, ORM\GeneratedValue, ORM\Column]
private ?int $id = null;
```

La première méthode est plus lisible.

---

### Les attributs Doctrine (ORM)

Doctrine utilise les attributs pour définir comment les classes PHP correspondent aux tables de base de données.

**Import nécessaire** :

```php
<?php

use Doctrine\ORM\Mapping as ORM;
```

**Attributs courants** :

| Attribut | Placement | Description |
| -------- | --------- | ----------- |
| `#[ORM\Entity]` | Classe | Déclare que la classe est une entité |
| `#[ORM\Table]` | Classe | Configure le nom de la table |
| `#[ORM\Id]` | Propriété | Marque la clé primaire |
| `#[ORM\GeneratedValue]` | Propriété | L'ID est auto-généré |
| `#[ORM\Column]` | Propriété | Configure une colonne |
| `#[ORM\ManyToOne]` | Propriété | Relation plusieurs-à-un |
| `#[ORM\OneToMany]` | Propriété | Relation un-à-plusieurs |

**Exemple d'entité complète** :

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $price;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private bool $active = true;
}
```

---

### Les paramètres de #[ORM\Column]

| Paramètre | Description | Exemple |
| --------- | ----------- | ------- |
| `type` | Type de colonne SQL | `'string'`, `'integer'`, `'text'`, `'decimal'`, `'datetime'` |
| `length` | Longueur max (pour string) | `255`, `100` |
| `nullable` | Peut être NULL | `true`, `false` |
| `precision` | Chiffres totaux (decimal) | `10` |
| `scale` | Chiffres après virgule (decimal) | `2` |
| `unique` | Valeur unique | `true` |
| `name` | Nom de la colonne SQL | `'product_name'` |

**Exemples** :

```php
<?php

#[ORM\Column]                                    // Type déduit, non nullable
private string $name;

#[ORM\Column(length: 100)]                       // String de max 100 caractères
private string $code;

#[ORM\Column(nullable: true)]                    // Peut être NULL
private ?string $description = null;

#[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
private string $price;                            // 10 chiffres, 2 après virgule

#[ORM\Column(unique: true)]                      // Valeur unique
private string $email;

#[ORM\Column(name: 'created_at')]               // Nom personnalisé en BDD
private \DateTimeImmutable $createdAt;
```

---

### Les attributs Symfony (Route)

Symfony utilise les attributs pour définir les routes (URLs).

**Import nécessaire** :

```php
<?php

use Symfony\Component\Routing\Attribute\Route;
```

**Paramètres courants** :

| Paramètre | Description | Exemple |
| --------- | ----------- | ------- |
| Premier paramètre | Chemin de l'URL | `'/products'` |
| `name` | Nom unique de la route | `'product_list'` |
| `methods` | Méthodes HTTP autorisées | `['GET']`, `['GET', 'POST']` |
| `requirements` | Contraintes sur les paramètres | `['id' => '\d+']` |

**Exemples** :

```php
<?php

#[Route('/')]                                    // Page d'accueil
public function home(): Response

#[Route('/products', name: 'product_list')]      // Liste des produits
public function list(): Response

#[Route('/products/{id}', name: 'product_show')] // Produit par ID
public function show(int $id): Response

#[Route('/products/new', name: 'product_new', methods: ['GET', 'POST'])]
public function new(Request $request): Response   // Création (formulaire)

#[Route('/products/{id}/edit', methods: ['GET', 'POST'])]
public function edit(int $id, Request $request): Response
```

**Route sur la classe** (préfixe) :

```php
<?php

#[Route('/products')]                // Préfixe pour toutes les méthodes
class ProductController
{
    #[Route('/')]                    // URL finale : /products/
    public function list(): Response

    #[Route('/{id}')]                // URL finale : /products/{id}
    public function show(int $id): Response
}
```

---

### Différence avec les anciennes annotations

Avant PHP 8, on utilisait des annotations dans les commentaires :

**Ancien style (annotations docblock)** :

```php
<?php

/**
 * @ORM\Entity
 * @ORM\Table(name="products")
 */
class Product
{
    /**
     * @ORM\Id
     * @ORM\Column(type="integer")
     */
    private $id;
}
```

**Nouveau style (attributs PHP 8+)** :

```php
<?php

#[ORM\Entity]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id]
    #[ORM\Column]
    private ?int $id = null;
}
```

**Avantages des attributs** :

| Aspect | Annotations | Attributs |
| ------ | ----------- | --------- |
| Syntaxe | Dans les commentaires | Code PHP natif |
| Vérification | Aucune (c'est du texte) | Vérification par PHP et l'IDE |
| Performance | Parsing des commentaires | Lecture native |
| Support IDE | Variable | Excellent |

---

## Étapes Pratiques

### Étape 1 : Lire une entité Doctrine

Crée un fichier `public/lire-entite.php` pour analyser une entité :

```php
<?php
$entite = <<<'CODE'
<?php

namespace App\Entity;

use App\Repository\ProductRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: ProductRepository::class)]
#[ORM\Table(name: 'products')]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
    private string $price;

    #[ORM\Column(type: 'text', nullable: true)]
    private ?string $description = null;

    #[ORM\Column]
    private int $stock = 0;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
    }

    // Getters et setters...
}
CODE;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Lecture d'une entité Doctrine</title>
    <style>
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        .entity { background: #e3f2fd; }
        .id { background: #fff3e0; }
        .column { background: #e8f5e9; }
        table { border-collapse: collapse; margin: 20px 0; }
        td, th { padding: 10px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Lecture d'une entité Doctrine</h1>

    <h2>Code source</h2>
    <pre><?php echo htmlspecialchars($entite); ?></pre>

    <h2>Attributs sur la classe</h2>
    <table>
        <tr>
            <th>Attribut</th>
            <th>Paramètres</th>
            <th>Signification</th>
        </tr>
        <tr class="entity">
            <td><code>#[ORM\Entity]</code></td>
            <td><code>repositoryClass: ProductRepository::class</code></td>
            <td>Déclare que cette classe est une entité Doctrine, liée au repository ProductRepository</td>
        </tr>
        <tr class="entity">
            <td><code>#[ORM\Table]</code></td>
            <td><code>name: 'products'</code></td>
            <td>La table SQL s'appellera "products" (sinon ce serait "product" par défaut)</td>
        </tr>
    </table>

    <h2>Attributs sur les propriétés</h2>
    <table>
        <tr>
            <th>Propriété</th>
            <th>Attributs</th>
            <th>Résultat en base</th>
        </tr>
        <tr class="id">
            <td><code>$id</code></td>
            <td>
                <code>#[ORM\Id]</code><br>
                <code>#[ORM\GeneratedValue]</code><br>
                <code>#[ORM\Column]</code>
            </td>
            <td>Colonne <code>id SERIAL PRIMARY KEY</code></td>
        </tr>
        <tr class="column">
            <td><code>$name</code></td>
            <td><code>#[ORM\Column(length: 255)]</code></td>
            <td>Colonne <code>name VARCHAR(255) NOT NULL</code></td>
        </tr>
        <tr class="column">
            <td><code>$price</code></td>
            <td><code>#[ORM\Column(type: 'decimal', precision: 10, scale: 2)]</code></td>
            <td>Colonne <code>price DECIMAL(10,2) NOT NULL</code></td>
        </tr>
        <tr class="column">
            <td><code>$description</code></td>
            <td><code>#[ORM\Column(type: 'text', nullable: true)]</code></td>
            <td>Colonne <code>description TEXT NULL</code></td>
        </tr>
        <tr class="column">
            <td><code>$stock</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td>Colonne <code>stock INT NOT NULL</code> (type déduit de <code>int</code>)</td>
        </tr>
        <tr class="column">
            <td><code>$active</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td>Colonne <code>active BOOLEAN NOT NULL</code> (type déduit de <code>bool</code>)</td>
        </tr>
        <tr class="column">
            <td><code>$createdAt</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td>Colonne <code>created_at TIMESTAMP NOT NULL</code></td>
        </tr>
    </table>

    <h2>Table SQL générée</h2>
    <pre>
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT NULL,
    stock INT NOT NULL,
    active BOOLEAN NOT NULL,
    created_at TIMESTAMP NOT NULL
);
    </pre>
</body>
</html>
```

---

### Étape 2 : Lire un contrôleur Symfony

Crée un fichier `public/lire-controleur.php` :

```php
<?php
$controleur = <<<'CODE'
<?php

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/products')]
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
        // Création d'un nouveau produit...
    }

    #[Route('/{id}', name: 'product_show', methods: ['GET'])]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    #[Route('/{id}/edit', name: 'product_edit', methods: ['GET', 'POST'])]
    public function edit(Product $product, Request $request): Response
    {
        // Modification du produit...
    }

    #[Route('/{id}', name: 'product_delete', methods: ['DELETE'])]
    public function delete(Product $product, EntityManagerInterface $em): Response
    {
        // Suppression du produit...
    }
}
CODE;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Lecture d'un contrôleur Symfony</title>
    <style>
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        .get { background: #e8f5e9; }
        .post { background: #fff3e0; }
        .delete { background: #ffebee; }
        table { border-collapse: collapse; margin: 20px 0; }
        td, th { padding: 10px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Lecture d'un contrôleur Symfony</h1>

    <h2>Code source</h2>
    <pre><?php echo htmlspecialchars($controleur); ?></pre>

    <h2>Attribut sur la classe (préfixe)</h2>
    <table>
        <tr>
            <th>Attribut</th>
            <th>Effet</th>
        </tr>
        <tr>
            <td><code>#[Route('/products')]</code></td>
            <td>Toutes les routes de ce contrôleur commenceront par <code>/products</code></td>
        </tr>
    </table>

    <h2>Routes définies</h2>
    <table>
        <tr>
            <th>Méthode</th>
            <th>Attribut</th>
            <th>URL finale</th>
            <th>Nom</th>
            <th>Méthodes HTTP</th>
        </tr>
        <tr class="get">
            <td><code>index()</code></td>
            <td><code>#[Route('/', name: 'product_index', methods: ['GET'])]</code></td>
            <td><code>/products/</code></td>
            <td>product_index</td>
            <td>GET</td>
        </tr>
        <tr class="post">
            <td><code>new()</code></td>
            <td><code>#[Route('/new', name: 'product_new', methods: ['GET', 'POST'])]</code></td>
            <td><code>/products/new</code></td>
            <td>product_new</td>
            <td>GET, POST</td>
        </tr>
        <tr class="get">
            <td><code>show()</code></td>
            <td><code>#[Route('/{id}', name: 'product_show', methods: ['GET'])]</code></td>
            <td><code>/products/42</code></td>
            <td>product_show</td>
            <td>GET</td>
        </tr>
        <tr class="post">
            <td><code>edit()</code></td>
            <td><code>#[Route('/{id}/edit', name: 'product_edit', methods: ['GET', 'POST'])]</code></td>
            <td><code>/products/42/edit</code></td>
            <td>product_edit</td>
            <td>GET, POST</td>
        </tr>
        <tr class="delete">
            <td><code>delete()</code></td>
            <td><code>#[Route('/{id}', name: 'product_delete', methods: ['DELETE'])]</code></td>
            <td><code>/products/42</code></td>
            <td>product_delete</td>
            <td>DELETE</td>
        </tr>
    </table>

    <h2>Explication du paramètre {id}</h2>
    <p><code>{id}</code> dans le chemin est un paramètre dynamique :</p>
    <ul>
        <li><code>/products/1</code> → <code>$id = 1</code></li>
        <li><code>/products/42</code> → <code>$id = 42</code></li>
        <li><code>/products/999</code> → <code>$id = 999</code></li>
    </ul>

    <h2>Légende des couleurs</h2>
    <ul>
        <li><span class="get" style="padding: 5px;">Vert</span> : Lecture seule (GET)</li>
        <li><span class="post" style="padding: 5px;">Orange</span> : Création/Modification (GET + POST)</li>
        <li><span class="delete" style="padding: 5px;">Rouge</span> : Suppression (DELETE)</li>
    </ul>
</body>
</html>
```

---

### Étape 3 : Entité avec relations

Crée un fichier `public/entite-relation.php` :

```php
<?php
$code = <<<'CODE'
<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Category
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 100)]
    private string $name;

    #[ORM\OneToMany(targetEntity: Product::class, mappedBy: 'category')]
    private Collection $products;

    public function __construct()
    {
        $this->products = new ArrayCollection();
    }
}

#[ORM\Entity]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\ManyToOne(targetEntity: Category::class, inversedBy: 'products')]
    #[ORM\JoinColumn(nullable: false)]
    private Category $category;
}
CODE;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Entités avec relations</title>
    <style>
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        .relation { background: #e1bee7; }
        table { border-collapse: collapse; margin: 20px 0; }
        td, th { padding: 10px; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>Entités avec relations Doctrine</h1>

    <h2>Code source</h2>
    <pre><?php echo htmlspecialchars($code); ?></pre>

    <h2>Schéma de la relation</h2>
    <pre>
┌─────────────┐         ┌─────────────┐
│  Category   │         │   Product   │
├─────────────┤         ├─────────────┤
│ id          │    1    │ id          │
│ name        │────────<│ name        │
│ products[]  │    *    │ category    │
└─────────────┘         └─────────────┘

Une catégorie a plusieurs produits (1 → *)
Un produit appartient à une catégorie (* → 1)
    </pre>

    <h2>Attributs de relation</h2>
    <table>
        <tr>
            <th>Attribut</th>
            <th>Paramètres</th>
            <th>Signification</th>
        </tr>
        <tr class="relation">
            <td><code>#[ORM\OneToMany]</code></td>
            <td>
                <code>targetEntity: Product::class</code><br>
                <code>mappedBy: 'category'</code>
            </td>
            <td>
                Une Category a plusieurs Products.<br>
                La relation est définie dans Product par la propriété "category".
            </td>
        </tr>
        <tr class="relation">
            <td><code>#[ORM\ManyToOne]</code></td>
            <td>
                <code>targetEntity: Category::class</code><br>
                <code>inversedBy: 'products'</code>
            </td>
            <td>
                Un Product appartient à une Category.<br>
                L'inverse est la propriété "products" de Category.
            </td>
        </tr>
        <tr class="relation">
            <td><code>#[ORM\JoinColumn]</code></td>
            <td><code>nullable: false</code></td>
            <td>
                La colonne de clé étrangère ne peut pas être NULL.<br>
                Un produit DOIT avoir une catégorie.
            </td>
        </tr>
    </table>

    <h2>Tables SQL générées</h2>
    <pre>
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

CREATE TABLE product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category_id INT NOT NULL,
    FOREIGN KEY (category_id) REFERENCES category(id)
);
    </pre>

    <h2>Types de relations Doctrine</h2>
    <table>
        <tr>
            <th>Relation</th>
            <th>Description</th>
            <th>Exemple</th>
        </tr>
        <tr>
            <td><code>ManyToOne</code></td>
            <td>Plusieurs éléments liés à un</td>
            <td>Plusieurs produits → une catégorie</td>
        </tr>
        <tr>
            <td><code>OneToMany</code></td>
            <td>Un élément lié à plusieurs</td>
            <td>Une catégorie → plusieurs produits</td>
        </tr>
        <tr>
            <td><code>OneToOne</code></td>
            <td>Un élément lié à un seul</td>
            <td>Un user → un profil</td>
        </tr>
        <tr>
            <td><code>ManyToMany</code></td>
            <td>Plusieurs éléments liés à plusieurs</td>
            <td>Plusieurs produits → plusieurs tags</td>
        </tr>
    </table>
</body>
</html>
```

---

## Commandes Utiles

| Syntaxe | Description | Exemple |
| ------- | ----------- | ------- |
| `#[Attribut]` | Attribut simple | `#[ORM\Id]` |
| `#[Attribut(param)]` | Avec paramètre positionnel | `#[Route('/')]` |
| `#[Attribut(nom: valeur)]` | Avec paramètre nommé | `#[Column(length: 255)]` |
| `#[A, B, C]` | Plusieurs attributs | `#[ORM\Id, ORM\Column]` |

---

## Pièges Fréquents

### Piège 1 : Oublier l'import de l'attribut

**Problème** : Erreur "Class not found" ou attribut non reconnu.

**Solution** : Importe la classe d'attribut avec `use`.

```php
<?php

namespace App\Entity;

// Incorrect : ORM n'est pas défini
// #[ORM\Entity]
// class Product {}

// Correct : import nécessaire
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
class Product {}
```

---

### Piège 2 : Confondre [] et ()

**Problème** : Erreur de syntaxe.

**Solution** : Les attributs utilisent `#[...]` avec des crochets, les paramètres utilisent `(...)`.

```php
<?php

// Incorrect
// #(Route('/'))  // Pas de crochets
// #[Route['/']]  // Crochets dans le chemin

// Correct
#[Route('/')]
```

---

### Piège 3 : Type PHP ne correspond pas au type Doctrine

**Problème** : Erreur lors de la migration ou de l'exécution.

**Solution** : Le type PHP et le type Doctrine doivent correspondre.

```php
<?php

// Incorrect : decimal en PHP devrait être string
// #[ORM\Column(type: 'decimal')]
// private float $price;  // Perte de précision

// Correct
#[ORM\Column(type: 'decimal', precision: 10, scale: 2)]
private string $price;  // String pour préserver la précision
```

---

### Piège 4 : Nullable incohérent

**Problème** : Erreur "cannot be null" alors que tu attends null.

**Solution** : Synchronise `nullable: true` et `?Type`.

```php
<?php

// Incorrect : PHP permet null mais pas Doctrine
#[ORM\Column]  // nullable: false par défaut
private ?string $description = null;  // Peut être null en PHP !

// Correct
#[ORM\Column(nullable: true)]
private ?string $description = null;
```

---

## Checklist de Validation

- [ ] J'ai compris que les attributs sont des métadonnées sur le code
- [ ] J'ai compris la syntaxe `#[Attribut(paramètres)]`
- [ ] Je sais que les attributs remplacent les anciennes annotations `@`
- [ ] Je sais lire un attribut `#[ORM\Column]` et ses paramètres
- [ ] Je sais lire un attribut `#[Route]` et ses paramètres
- [ ] Je comprends les attributs de relation (`ManyToOne`, `OneToMany`)
- [ ] Je sais qu'il faut importer les classes d'attributs avec `use`

---

## Exercice Pratique

**Énoncé** : Analyse et explique une entité User complète.

**Indications** :

- Crée un fichier `public/analyse-user.php`
- Copie l'entité User fournie ci-dessous
- Crée un tableau HTML qui explique chaque attribut
- Indique le type SQL généré pour chaque propriété
- Explique la relation avec l'entité Role

**Code à analyser** :

```php
<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity]
#[ORM\Table(name: 'users')]
#[ORM\UniqueConstraint(name: 'unique_email', columns: ['email'])]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private string $email;

    #[ORM\Column(length: 100)]
    private string $firstName;

    #[ORM\Column(length: 100)]
    private string $lastName;

    #[ORM\Column]
    private string $password;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastLogin = null;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToMany(targetEntity: Role::class)]
    private Collection $roles;

    public function __construct()
    {
        $this->createdAt = new \DateTimeImmutable();
        $this->roles = new ArrayCollection();
    }
}
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// Fichier : public/analyse-user.php

$entiteUser = <<<'CODE'
#[ORM\Entity]
#[ORM\Table(name: 'users')]
#[ORM\UniqueConstraint(name: 'unique_email', columns: ['email'])]
class User
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 180, unique: true)]
    private string $email;

    #[ORM\Column(length: 100)]
    private string $firstName;

    #[ORM\Column(length: 100)]
    private string $lastName;

    #[ORM\Column]
    private string $password;

    #[ORM\Column]
    private bool $active = true;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $lastLogin = null;

    #[ORM\Column]
    private \DateTimeImmutable $createdAt;

    #[ORM\ManyToMany(targetEntity: Role::class)]
    private Collection $roles;
}
CODE;
?>
<!DOCTYPE html>
<html>
<head>
    <title>Analyse de l'entité User</title>
    <style>
        pre { background: #f5f5f5; padding: 15px; overflow-x: auto; }
        .classe { background: #e3f2fd; }
        .id { background: #fff3e0; }
        .column { background: #e8f5e9; }
        .relation { background: #f3e5f5; }
        table { border-collapse: collapse; margin: 20px 0; width: 100%; }
        td, th { padding: 10px; border: 1px solid #ddd; text-align: left; }
    </style>
</head>
<body>
    <h1>Analyse de l'entité User</h1>

    <h2>Code source</h2>
    <pre><?php echo htmlspecialchars($entiteUser); ?></pre>

    <h2>Attributs sur la classe</h2>
    <table>
        <tr>
            <th>Attribut</th>
            <th>Explication</th>
        </tr>
        <tr class="classe">
            <td><code>#[ORM\Entity]</code></td>
            <td>Déclare que User est une entité Doctrine (sera stockée en BDD)</td>
        </tr>
        <tr class="classe">
            <td><code>#[ORM\Table(name: 'users')]</code></td>
            <td>La table s'appellera <code>users</code> (au pluriel, convention SQL)</td>
        </tr>
        <tr class="classe">
            <td><code>#[ORM\UniqueConstraint(name: 'unique_email', columns: ['email'])]</code></td>
            <td>Crée une contrainte d'unicité sur la colonne email au niveau de la table</td>
        </tr>
    </table>

    <h2>Attributs sur les propriétés</h2>
    <table>
        <tr>
            <th>Propriété</th>
            <th>Attributs</th>
            <th>Type SQL</th>
            <th>Contraintes</th>
        </tr>
        <tr class="id">
            <td><code>$id</code></td>
            <td>
                <code>#[ORM\Id]</code><br>
                <code>#[ORM\GeneratedValue]</code><br>
                <code>#[ORM\Column]</code>
            </td>
            <td><code>SERIAL</code></td>
            <td>PRIMARY KEY</td>
        </tr>
        <tr class="column">
            <td><code>$email</code></td>
            <td><code>#[ORM\Column(length: 180, unique: true)]</code></td>
            <td><code>VARCHAR(180)</code></td>
            <td>NOT NULL, UNIQUE</td>
        </tr>
        <tr class="column">
            <td><code>$firstName</code></td>
            <td><code>#[ORM\Column(length: 100)]</code></td>
            <td><code>VARCHAR(100)</code></td>
            <td>NOT NULL</td>
        </tr>
        <tr class="column">
            <td><code>$lastName</code></td>
            <td><code>#[ORM\Column(length: 100)]</code></td>
            <td><code>VARCHAR(100)</code></td>
            <td>NOT NULL</td>
        </tr>
        <tr class="column">
            <td><code>$password</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td><code>VARCHAR(255)</code></td>
            <td>NOT NULL (hashé)</td>
        </tr>
        <tr class="column">
            <td><code>$active</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td><code>BOOLEAN</code></td>
            <td>NOT NULL (valeur par défaut true côté PHP)</td>
        </tr>
        <tr class="column">
            <td><code>$lastLogin</code></td>
            <td><code>#[ORM\Column(nullable: true)]</code></td>
            <td><code>TIMESTAMP</code></td>
            <td>NULL (jamais connecté = null)</td>
        </tr>
        <tr class="column">
            <td><code>$createdAt</code></td>
            <td><code>#[ORM\Column]</code></td>
            <td><code>TIMESTAMP</code></td>
            <td>NOT NULL</td>
        </tr>
        <tr class="relation">
            <td><code>$roles</code></td>
            <td><code>#[ORM\ManyToMany(targetEntity: Role::class)]</code></td>
            <td>Table de jointure <code>user_role</code></td>
            <td>Relation N-N avec Role</td>
        </tr>
    </table>

    <h2>Schéma SQL généré</h2>
    <pre>
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(180) NOT NULL UNIQUE,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    active BOOLEAN NOT NULL,
    last_login TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL
);

-- Table de jointure pour la relation ManyToMany
CREATE TABLE user_role (
    user_id INT NOT NULL,
    role_id INT NOT NULL,
    PRIMARY KEY (user_id, role_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (role_id) REFERENCES role(id)
);
    </pre>

    <h2>Points importants</h2>
    <ul>
        <li><code>unique: true</code> sur <code>$email</code> : impossible d'avoir deux users avec le même email</li>
        <li><code>nullable: true</code> sur <code>$lastLogin</code> : un user qui ne s'est jamais connecté a <code>null</code></li>
        <li><code>ManyToMany</code> : crée automatiquement une table de jointure</li>
        <li>Les noms de colonnes sont convertis en snake_case (<code>firstName</code> → <code>first_name</code>)</li>
    </ul>
</body>
</html>
```

---

## Navigation

← Fiche précédente : **[Les namespaces et le mot-clé use](09-namespaces-use.md)**

→ Fiche suivante : **[Les interfaces et les classes abstraites](11-interfaces-classes-abstraites.md)**
