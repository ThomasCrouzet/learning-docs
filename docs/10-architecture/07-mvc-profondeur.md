---
tags:
  - Architecture
  - Intermédiaire
  - Concept
description: "MVC en profondeur : MVC classique, MVC dans Symfony, variantes (MVVM, MVP, ADR) et limites."
estimated_time: "60 min"
fiche_number: 7
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 07 - MVC en profondeur

> **En bref** : Comprendre le pattern MVC classique, son implémentation dans Symfony, ses variantes (MVVM, MVP, ADR) et ses limites. Lecture estimée : 60 min.

## Prérequis

- Fiche 1 : [Introduction aux design patterns](01-introduction-design-patterns.md)
- [Cursus Symfony](../03-symfony/index.md), au moins les contrôleurs et les templates Twig

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer MVC en détail, décrire son implémentation dans Symfony, comparer MVC avec ses variantes et identifier quand MVC ne suffit plus.

---

## Concepts

### Qu'est-ce que MVC ?

**Définition** : MVC (Model-View-Controller) est un pattern architectural qui sépare une application en trois composants : le Modèle (données et logique métier), la Vue (affichage) et le Contrôleur (intermédiaire entre les deux).

**Le problème que MVC résout** :

Sans MVC, voici les problèmes rencontrés :

1. **Code spaghetti** : le code d'affichage, la logique métier et l'accès aux données sont mélangés dans les mêmes fichiers.
2. **Réutilisation impossible** : on ne peut pas afficher les mêmes données dans un format différent sans dupliquer le code.
3. **Équipe bloquée** : le désigner ne peut pas travailler sur les templates pendant que le développeur travaille sur la logique.

**Comment MVC résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Code spaghetti | Chaque composant a un rôle précis et un fichier dédié |
| Réutilisation impossible | Le modèle est indépendant de la vue : on peut créer plusieurs vues |
| Équipe bloquée | Les développeurs et les designers travaillent sur des fichiers différents |

**Analogie concrète** : Pense à un restaurant. Le Modèle est la cuisine (les ingrédients et les recettes). La Vue est la salle à manger (la présentation de l'assiette). Le Contrôleur est le serveur (il prend la commande du client, la transmet à la cuisine, et apporte le plat au client). Le client ne va jamais en cuisine, et le cuisinier ne sert jamais en salle.

**Ce que MVC n'est PAS** :

- MVC n'est pas un framework. MVC est un concept. Symfony, Laravel et Rails sont des frameworks qui IMPLÉMENTENT le concept MVC, chacun à sa manière.
- MVC ne signifie pas que tu as exactement 3 fichiers. Un modèle peut être composé de dizaines de classes (entités, repositories, services). La vue peut contenir des dizaines de templates.

---

### Les trois composants en détail

**Le Modèle (Model)**

| Aspect | Description |
| --- | --- |
| Rôle | Gérer les données et la logique métier |
| Contenu | Entités, repositories, services, validateurs |
| Connaît | Lui-même uniquement (pas la vue, pas le contrôleur) |
| Exemple Symfony | `Entity/Product.php`, `Repository/ProductRepository.php` |

```php
<?php

namespace App\Entity;

use Doctrine\ORM\Mapping as ORM;

// Le Modele : represente un produit avec ses donnees et ses regles
#[ORM\Entity]
class Product
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private string $name;

    #[ORM\Column]
    private float $price;

    // Le modele contient la logique metier
    public function getPriceWithTax(float $taxRate = 0.20): float
    {
        // Calcul du prix TTC : c'est de la logique metier, pas de la vue
        return $this->price * (1 + $taxRate);
    }

    // Getters et setters...
    public function getId(): ?int { return $this->id; }
    public function getName(): string { return $this->name; }
    public function setName(string $name): void { $this->name = $name; }
    public function getPrice(): float { return $this->price; }
    public function setPrice(float $price): void { $this->price = $price; }
}
```

**La Vue (View)**

| Aspect | Description |
| --- | --- |
| Rôle | Afficher les données à l'utilisateur |
| Contenu | Templates HTML, JSON, XML |
| Connaît | Les données fournies par le contrôleur (pas le modèle directement) |
| Exemple Symfony | `templates/product/show.html.twig` |

```twig
{# La Vue : affiche les donnees du produit #}
{# La vue ne fait PAS de logique metier, elle affiche uniquement #}

{% extends 'base.html.twig' %}

{% block title %}{{ product.name }}{% endblock %}

{% block body %}
    <h1>{{ product.name }}</h1>

    <div class="product-details">
        {# La vue affiche les donnees telles que fournies #}
        <p>Prix HT : {{ product.price }} EUR</p>
        <p>Prix TTC : {{ product.priceWithTax }} EUR</p>
    </div>
{% endblock %}
```

**Le Contrôleur (Controller)**

| Aspect | Description |
| --- | --- |
| Rôle | Recevoir la requête, appeler le modèle, retourner la vue |
| Contenu | Actions HTTP (routes) |
| Connaît | Le modèle (services, repositories) et la vue (templates) |
| Exemple Symfony | `Controller/ProductController.php` |

```php
<?php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// Le Controleur : fait le lien entre le Modele et la Vue
class ProductController extends AbstractController
{
    #[Route('/product/{id}', methods: ['GET'])]
    public function show(int $id, ProductRepository $repository): Response
    {
        // Etape 1 : demander au Modele les donnees
        $product = $repository->find($id);

        if (!$product) {
            throw $this->createNotFoundException('Produit non trouve');
        }

        // Etape 2 : passer les donnees a la Vue
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}
```

---

### Le flux MVC dans Symfony

**Définition** : Dans Symfony, le flux MVC suit un chemin précis du navigateur au navigateur, en passant par le contrôleur, le modèle et la vue.

```text
Navigateur → Requete HTTP → Router → Controleur → Modele → Controleur → Vue → Reponse HTTP → Navigateur

Etape par etape :
1. Le navigateur envoie une requete GET /product/42
2. Le Router de Symfony identifie le controleur : ProductController::show
3. Le Controleur demande le produit au Repository (Modele)
4. Le Repository interroge la base de donnees
5. Le Controleur passe le produit au template Twig (Vue)
6. Twig genere le HTML
7. Le Controleur retourne une Response HTTP avec le HTML
8. Le navigateur affiche la page
```

**Schéma du flux** :

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-07-mvc-profondeur-1.html">Le flux MVC dans Symfony (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-07-mvc-profondeur-1.html" title="Le flux MVC dans Symfony" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### MVC classique vs MVC dans Symfony

**Définition** : Le MVC de Symfony n'est pas exactement le MVC classique (Smalltalk, 1979). Voici les différences.

| Aspect | MVC classique | MVC Symfony |
| --- | --- | --- |
| Communication | Le modèle notifie la vue directement (Observer) | Le contrôleur passe les données à la vue |
| Vue | Active : s'abonne aux changements du modèle | Passive : reçoit les données du contrôleur |
| Contrôleur | Gère uniquement les entrées utilisateur | Orchestre le flux complet requête/réponse |
| Modèle | Notifie ses observateurs | N'a aucune connaissance de la vue |

**Pourquoi Symfony ne suit pas le MVC classique** :

Le MVC classique a été conçu pour des applications de bureau (GUI). Dans une application web :

1. Le HTTP est sans état (stateless) : il n'y a pas de connexion permanente pour "observer" le modèle.
2. La requête/réponse est un aller-retour unique : le modèle ne peut pas notifier la vue après coup.
3. Le contrôleur doit orchestrer plus de choses (routing, sécurité, validation, sérialisation).

---

### Les variantes de MVC

**MVP (Model-View-Presenter)**

| Aspect | MVC | MVP |
| --- | --- | --- |
| Intermédiaire | Controller | Presenter |
| Vue | Reçoit les données | Ne fait que afficher et transmettre les events |
| Logique | Partagée controller/vue | Toute dans le presenter |

**Définition** : Dans MVP, le Presenter contient toute la logique de présentation. La Vue est passive : elle ne fait que afficher ce que le Presenter lui dit et transmettre les interactions de l'utilisateur.

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-07-mvc-profondeur-2.html">Les variantes de MVC (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-07-mvc-profondeur-2.html" title="Les variantes de MVC" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

La Vue ne connaît pas le Modèle. Le Presenter orchestre tout.

**MVVM (Model-View-ViewModel)**

| Aspect | MVC | MVVM |
| --- | --- | --- |
| Intermédiaire | Controller | ViewModel |
| Liaison | Manuelle (contrôleur passe les données) | Data binding automatique |
| Usage typique | Applications web serveur | Applications front-end (Vue.js, Angular) |

**Définition** : Dans MVVM, le ViewModel expose des propriétés observables. La Vue se lie automatiquement à ces propriétés (data binding). Quand le ViewModel change, la Vue se met à jour automatiquement.

<div class="diagram-design">
<p><a href="../../diagrams/10-architecture-07-mvc-profondeur-3.html">Les variantes de MVC (HTML + SVG)</a></p>
<iframe src="../../diagrams/10-architecture-07-mvc-profondeur-3.html" title="Les variantes de MVC" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

La Vue se lie automatiquement aux propriétés du ViewModel. Pas besoin de code pour mettre a jour l'affichage.

**ADR (Action-Domain-Responder)**

| Aspect | MVC | ADR |
| --- | --- | --- |
| Contrôleur | Classe avec plusieurs méthodes (actions) | UNE classe = UNE action |
| Modèle | Pas clairement défini | Domain : logique métier explicite |
| Vue | Template | Responder : construit la réponse HTTP |

**Définition** : ADR est une alternative à MVC spécifiquement conçue pour les applications web. Chaque route a sa propre classe (Action), qui appelle le Domain (logique métier) et passe le résultat au Responder (construction de la réponse).

```php
<?php

// ADR dans Symfony : une classe = une action
// Symfony appelle ca les "invokable controllers"

namespace App\Action;

use App\Repository\ProductRepository;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Twig\Environment;

// UNE seule action par classe
#[Route('/product/{id}', methods: ['GET'])]
class ShowProductAction
{
    public function __construct(
        private ProductRepository $repository,
        private Environment $twig,
    ) {
    }

    // __invoke : Symfony appelle directement cette methode
    public function __invoke(int $id): Response
    {
        // Domain : recuperer le produit
        $product = $this->repository->find($id);

        if (!$product) {
            throw new NotFoundHttpException('Produit non trouve');
        }

        // Responder : construire la reponse
        $html = $this->twig->render('product/show.html.twig', [
            'product' => $product,
        ]);

        return new Response($html);
    }
}
```

---

### Quand MVC ne suffit plus

**Définition** : MVC est adapté à la plupart des applications web, mais il montre ses limites quand la logique métier devient complexe.

**Signes que MVC ne suffit plus** :

| Signe | Problème | Alternative |
| --- | --- | --- |
| Contrôleurs de 500+ lignes | Trop de logique dans les contrôleurs | Extraire des services (SRP) |
| Logique métier dans les vues | Templates Twig avec des calculs complexes | Déplacer dans le modèle |
| Modèle = seulement les entités | Pas de couche de services | Ajouter des services métier |
| Entités avec 50+ méthodes | Entités devenues des "God Objects" | Clean Architecture, DDD |
| Tests qui nécessitent une BDD | Pas de séparation couche métier/infra | Hexagonal Architecture |

**La solution : enrichir le Modèle**

MVC ne dit pas que le Modèle se limite aux entités Doctrine. Le Modèle comprend :

```text
Modele complet :
├── Entity/           ← Representation des donnees
├── Repository/       ← Acces aux donnees
├── Service/          ← Logique metier
├── DTO/              ← Transfert de donnees
├── Event/            ← Evenements metier
├── Validator/        ← Regles de validation
└── Exception/        ← Erreurs metier
```

```php
<?php

// Enrichir le modele : extraire la logique metier dans un service

// ❌ Controleur trop charge
class OrderController extends AbstractController
{
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        // 200 lignes de logique metier...
        // Validation, calcul, persistance, notification...
    }
}

// ✅ Service metier + controleur mince
class OrderController extends AbstractController
{
    public function create(
        #[MapRequestPayload] CreateOrderRequest $request,
        OrderService $orderService,
    ): Response {
        // Le controleur ne fait que orchestrer
        $order = $orderService->create($request);
        return $this->json(['id' => $order->getId()], 201);
    }
}

class OrderService
{
    // Toute la logique metier est ici
    // Cette classe est testable sans HTTP, sans base de donnees
    public function create(CreateOrderRequest $request): Order
    {
        // Validation, calcul, persistance, notification...
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Identifier les composants MVC dans un projet Symfony

```bash
# Lister les controleurs (la partie C de MVC)
ls src/Controller/
```

**Résultat attendu** :

```text
ProductController.php
OrderController.php
UserController.php
```

```bash
# Lister les entites (une partie du M de MVC)
ls src/Entity/
```

**Résultat attendu** :

```text
Product.php
Order.php
User.php
```

```bash
# Lister les templates (la partie V de MVC)
ls templates/
```

**Résultat attendu** :

```text
base.html.twig
product/
order/
user/
```

---

### Étape 2 : Créer un contrôleur ADR (invokable)

```php
<?php

namespace App\Controller\Product;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

// ADR : UNE classe = UNE action
#[Route('/products', name: 'product_list', methods: ['GET'])]
class ListProductsAction extends AbstractController
{
    public function __invoke(ProductRepository $repository): Response
    {
        $products = $repository->findAll();

        return $this->render('product/list.html.twig', [
            'products' => $products,
        ]);
    }
}
```

```php
<?php

namespace App\Controller\Product;

use App\Entity\Product;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/product/{id}', name: 'product_show', methods: ['GET'])]
class ShowProductAction extends AbstractController
{
    public function __invoke(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }
}
```

**Résultat attendu** :

```text
src/Controller/Product/
├── ListProductsAction.php     ← Action pour lister
├── ShowProductAction.php      ← Action pour afficher
├── CreateProductAction.php    ← Action pour créer
└── DeleteProductAction.php    ← Action pour supprimer

Avantage : chaque fichier est court et a une seule responsabilité.
```

---

### Étape 3 : Comparer les approches

```php
<?php

// Approche MVC classique : 1 controleur avec plusieurs actions
class ProductController extends AbstractController
{
    #[Route('/products')]
    public function list(): Response { /* ... */ }

    #[Route('/product/{id}')]
    public function show(int $id): Response { /* ... */ }

    #[Route('/product/create')]
    public function create(): Response { /* ... */ }

    #[Route('/product/{id}/delete')]
    public function delete(int $id): Response { /* ... */ }

    // Probleme : le controleur grandit avec chaque nouvelle action
    // Probleme : les dependances de toutes les actions sont injectees
}
```

```php
<?php

// Approche ADR : 1 classe par action
// Avantage : chaque action n'injecte QUE les dependances dont elle a besoin
// Avantage : les fichiers sont courts et lisibles
// Inconvenient : plus de fichiers a gerer

#[Route('/products')]
class ListProductsAction extends AbstractController
{
    public function __invoke(ProductRepository $repo): Response
    {
        // Uniquement la dependance necessaire
        return $this->render('product/list.html.twig', [
            'products' => $repo->findAll(),
        ]);
    }
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php bin/console debug:router` | Lister toutes les routes (actions du contrôleur) |
| `php bin/console make:controller` | Créer un nouveau contrôleur |
| `php bin/console debug:twig` | Lister les templates disponibles |
| `php bin/console lint:twig templates/` | Vérifier la syntaxe des templates |

---

## Pièges Fréquents

### Piège 1 : Logique métier dans le contrôleur

**Problème** : Tu mets des calculs, des validations et des requêtes SQL directement dans le contrôleur.

**Solution** : Le contrôleur ne doit faire que recevoir la requête, appeler un service et retourner la réponse. Toute logique métier doit être dans un service.

### Piège 2 : Logique métier dans la vue

**Problème** : Tes templates Twig contiennent des calculs complexes, des conditions métier ou des requêtes.

**Solution** : Effectue les calculs dans le modèle (entité ou service) et passe le résultat à la vue.

```twig
{# ❌ Calcul dans la vue #}
{% set total = 0 %}
{% for item in order.items %}
    {% set total = total + (item.price * item.quantity * 1.20) %}
{% endfor %}

{# ✅ Calcul dans le modele, la vue affiche le resultat #}
<p>Total : {{ order.totalWithTax }} EUR</p>
```

### Piège 3 : Confondre MVC et architecture en couches

**Problème** : Tu penses que MVC est suffisant pour structurer toute ton application.

**Solution** : MVC structure la couche de présentation (HTTP). Pour la logique métier complexe, tu as besoin d'une architecture supplémentaire (services, Clean Architecture, DDD).

---

## Checklist de Validation

- [ ] Je sais expliquer le rôle de chaque composant MVC (Modèle, Vue, Contrôleur)
- [ ] Je sais décrire le flux MVC dans Symfony (requête → contrôleur → modèle → vue → réponse)
- [ ] Je connais la différence entre MVC classique et MVC web
- [ ] Je sais ce qu'est ADR et comment le mettre en oeuvre avec des contrôleurs invocables
- [ ] Je sais identifier quand MVC ne suffit plus (contrôleurs obèses, logique dans les vues)
- [ ] Je comprends que le Modèle ne se limite pas aux entités Doctrine

---

## Exercice Pratique

**Énoncé** : Refactore un contrôleur obèse en suivant MVC strict avec des services.

**Instructions** :

1. Prends un contrôleur avec plus de 50 lignes de logique métier
2. Extrais la logique dans un service dédié
3. Extrais les calculs d'affichage dans l'entité ou un DTO
4. Assure-toi que le contrôleur fait maximum 15 lignes
5. Bonus : convertis en style ADR (contrôleur invokable)

**Résultat attendu** : Un contrôleur de 10-15 lignes, un service qui contient la logique, des templates sans logique métier.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Contrôleur obèse original** :

```php
<?php

class InvoiceController extends AbstractController
{
    #[Route('/invoice/create')]
    public function create(Request $request, EntityManagerInterface $em): Response
    {
        $clientId = $request->request->get('client_id');
        $items = $request->request->all('items');

        // Validation (devrait etre dans un validateur)
        if (!$clientId || empty($items)) {
            return $this->json(['error' => 'Donnees manquantes'], 400);
        }

        // Calculs (devrait etre dans un service)
        $subtotal = 0;
        foreach ($items as $item) {
            $subtotal += $item['price'] * $item['quantity'];
        }
        $tax = $subtotal * 0.20;
        $total = $subtotal + $tax;

        // Persistance (devrait etre dans un repository)
        $invoice = new Invoice();
        $invoice->setClientId($clientId);
        $invoice->setSubtotal($subtotal);
        $invoice->setTax($tax);
        $invoice->setTotal($total);
        $em->persist($invoice);
        $em->flush();

        // Notification (devrait etre un event listener)
        mail("client@example.com", "Facture", "Total: $total");

        return $this->json(['id' => $invoice->getId()]);
    }
}
```

**Après refactoring** :

```php
<?php

// DTO : porte les donnees de la requete
class CreateInvoiceRequest
{
    public function __construct(
        #[Assert\NotBlank]
        public readonly int $clientId,
        #[Assert\Count(min: 1)]
        public readonly array $items,
    ) {
    }
}

// Service : contient la logique metier
class InvoiceService
{
    public function __construct(
        private InvoiceRepository $repository,
        private EventDispatcherInterface $dispatcher,
    ) {
    }

    public function create(CreateInvoiceRequest $request): Invoice
    {
        $subtotal = $this->calculateSubtotal($request->items);
        $tax = $subtotal * 0.20;

        $invoice = new Invoice();
        $invoice->setClientId($request->clientId);
        $invoice->setSubtotal($subtotal);
        $invoice->setTax($tax);
        $invoice->setTotal($subtotal + $tax);

        $this->repository->save($invoice);
        $this->dispatcher->dispatch(new InvoiceCreatedEvent($invoice));

        return $invoice;
    }

    private function calculateSubtotal(array $items): float
    {
        return array_reduce(
            $items,
            fn (float $sum, array $item) => $sum + ($item['price'] * $item['quantity']),
            0.0,
        );
    }
}

// Controleur mince (10 lignes)
class CreateInvoiceAction extends AbstractController
{
    #[Route('/invoice/create', methods: ['POST'])]
    public function __invoke(
        #[MapRequestPayload] CreateInvoiceRequest $request,
        InvoiceService $service,
    ): Response {
        $invoice = $service->create($request);
        return $this->json(['id' => $invoice->getId()], 201);
    }
}
```

---

## Navigation

← Fiche précédente : **[Patterns de comportement](06-patterns-comportement.md)**

→ Fiche suivante : **[Clean Architecture](08-clean-architecture.md)**
