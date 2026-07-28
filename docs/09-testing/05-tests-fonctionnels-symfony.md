---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Apprendre à écrire des tests fonctionnels Symfony avec WebTestCase : client HTTP, crawler, formulaires et assertions de réponse."
estimated_time: "90 min"
fiche_number: 5
total_fiches: 15
cursus: "Testing et Qualité"
---

# 05 - Tests fonctionnels Symfony

> **En bref** : Cette fiche te guide dans l'écriture de tests fonctionnels Symfony avec WebTestCase pour simuler des requêtes HTTP, soumettre des formulaires et vérifier les réponses. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Pourquoi tester](01-pourquoi-tester.md)** (types de tests)
- Avoir lu la fiche **[02 - Tests unitaires PHP](02-tests-unitaires-php.md)** (PHPUnit)
- Avoir lu la fiche **[04 - Tests d'intégration Symfony](04-tests-integration-symfony.md)** (KernelTestCase, base de test)
- Cursus Symfony : contrôleurs, routes, formulaires, Twig

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des tests fonctionnels qui simulent des requêtes HTTP, naviguent dans les pages, soumettent des formulaires et vérifient les codes de réponse et le contenu des pages.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test fonctionnel Symfony ?

**Définition** : Un test fonctionnel Symfony simule le comportement d'un navigateur en envoyant des requêtes HTTP au framework et en analysant les réponses. Il ne nécessite pas de vrai navigateur : Symfony traite la requête en interne.

**Le problème que les tests fonctionnels résolvent** :

Sans tests fonctionnels, voici les problèmes rencontrés :

1. **Routes cassées** : Tu renommes une route ou tu modifies un contrôleur, et une page retourne une erreur 500 sans que personne ne le sache.
2. **Formulaires défaillants** : Un formulaire accepte des données invalides ou rejette des données valides.
3. **Redirections incorrectes** : Après une soumission de formulaire, la redirection pointe vers une mauvaise URL.

**Comment les tests fonctionnels résolvent ces problèmes** :

| Problème | Solution apportée par les tests fonctionnels |
| --- | --- |
| Routes cassées | Le test vérifie que chaque route retourne le bon code HTTP |
| Formulaires défaillants | Le test soumet des formulaires et vérifie les résultats |
| Redirections incorrectes | Le test suit les redirections et vérifie l'URL finale |

**Analogie concrète** : Les tests d'intégration vérifient que le moteur de la voiture fonctionne. Les tests fonctionnels vérifient que quand tu tournes le volant à droite, la voiture va à droite. Tu testes les commandes (requêtes HTTP) et les résultats (réponses), sans ouvrir le capot.

**Ce qu'un test fonctionnel Symfony n'est PAS** :

- Ce n'est pas un test E2E. Le test fonctionnel ne lance pas de vrai navigateur. Il ne peut pas exécuter de JavaScript.
- Ce n'est pas un test d'intégration. Le test fonctionnel teste une fonctionnalité complète via HTTP, pas un service isolé.

**Comparaison** :

| Test d'intégration | Test fonctionnel |
| --- | --- |
| Étend `KernelTestCase` | Étend `WebTestCase` |
| Teste des services directement | Teste via des requêtes HTTP |
| Pas de client HTTP | Utilise un client HTTP interne |
| Pas de requêtes/réponses | Vérifie codes HTTP, contenu HTML, redirections |

---

### Qu'est-ce que WebTestCase ?

**Définition** : `WebTestCase` est une classe de base PHPUnit fournie par Symfony. Elle étend `KernelTestCase` et ajoute un client HTTP interne qui peut envoyer des requêtes et recevoir des réponses sans serveur web.

**Méthodes importantes** :

| Méthode | Rôle |
| --- | --- |
| `static::createClient()` | Crée un client HTTP de test |
| `$client->request('GET', '/url')` | Envoie une requête HTTP |
| `$client->getResponse()` | Récupère la réponse HTTP |
| `$client->getCrawler()` | Récupère le crawler (analyseur HTML) |
| `$client->followRedirect()` | Suit une redirection |
| `$client->submitForm()` | Soumet un formulaire |
| `$client->clickLink()` | Clique sur un lien |

---

### Qu'est-ce que le Crawler ?

**Définition** : Le Crawler est un objet Symfony qui analyse le contenu HTML d'une réponse. Il permet de rechercher des éléments par sélecteur CSS, de lire le texte des éléments et de naviguer dans le DOM.

**Le problème que le Crawler résout** :

Sans Crawler, voici les problèmes rencontrés :

1. **Analyse manuelle du HTML** : Tu dois utiliser des expressions régulières pour chercher du contenu dans le HTML. C'est fragile et peu lisible.
2. **Navigation impossible** : Tu ne peux pas cliquer sur des liens ou soumettre des formulaires programmatiquement.

**Comment le Crawler résout ces problèmes** :

| Problème | Solution apportée par le Crawler |
| --- | --- |
| Analyse manuelle | Sélecteurs CSS intuitifs : `$crawler->filter('h1')` |
| Navigation impossible | Méthodes `selectLink()`, `selectButton()` pour interagir |

**Analogie concrète** : Le Crawler est comme un lecteur de page web pour malvoyant. Il lit la page et peut te dire : "Il y a un titre H1 qui dit 'Bienvenue'", "Il y a un formulaire avec 3 champs", "Il y a un lien qui pointe vers /contact".

---

## Étapes Pratiques

### Étape 1 : Créer un contrôleur à tester

Crée `src/Controller/ProductController.php` :

```php
<?php
// src/Controller/ProductController.php
// Contrôleur qui affiche et gère les produits

namespace App\Controller;

use App\Entity\Product;
use App\Repository\ProductRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{
    // Page d'accueil : liste tous les produits
    #[Route('/products', name: 'product_index', methods: ['GET'])]
    public function index(ProductRepository $repository): Response
    {
        $products = $repository->findInStock();

        return $this->render('product/index.html.twig', [
            'products' => $products,
        ]);
    }

    // Page de détail d'un produit
    #[Route('/products/{id}', name: 'product_show', methods: ['GET'])]
    public function show(Product $product): Response
    {
        return $this->render('product/show.html.twig', [
            'product' => $product,
        ]);
    }

    // Formulaire de création de produit
    #[Route('/products/new', name: 'product_new', methods: ['GET', 'POST'], priority: 1)]
    public function new(
        Request $request,
        EntityManagerInterface $em
    ): Response {
        if ($request->isMethod('POST')) {
            $name = $request->request->get('name', '');
            $price = (int) $request->request->get('price', 0);
            $category = $request->request->get('category', '');

            // Validation simple
            if (trim($name) === '') {
                return $this->render('product/new.html.twig', [
                    'error' => 'Le nom est obligatoire',
                ]);
            }

            $product = new Product();
            $product->setName($name);
            $product->setPriceInCents($price);
            $product->setCategory($category ?: null);

            $em->persist($product);
            $em->flush();

            return $this->redirectToRoute('product_show', [
                'id' => $product->getId(),
            ]);
        }

        return $this->render('product/new.html.twig');
    }
}
```

---

### Étape 2 : Créer les templates Twig

Crée `templates/product/index.html.twig` :

```twig
{# templates/product/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Produits{% endblock %}

{% block body %}
    <h1>Liste des produits</h1>

    {% if products is empty %}
        <p class="no-products">Aucun produit disponible.</p>
    {% else %}
        <table>
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Prix</th>
                    <th>Catégorie</th>
                </tr>
            </thead>
            <tbody>
                {% for product in products %}
                    <tr>
                        <td>
                            <a href="{{ path('product_show', {id: product.id}) }}">
                                {{ product.name }}
                            </a>
                        </td>
                        <td>{{ product.priceInEuros }} &euro;</td>
                        <td>{{ product.category ?? 'Aucune' }}</td>
                    </tr>
                {% endfor %}
            </tbody>
        </table>
    {% endif %}

    <a href="{{ path('product_new') }}">Ajouter un produit</a>
{% endblock %}
```

Crée `templates/product/show.html.twig` :

```twig
{# templates/product/show.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}{{ product.name }}{% endblock %}

{% block body %}
    <h1>{{ product.name }}</h1>

    <div class="product-details">
        <p><strong>Prix :</strong> {{ product.priceInEuros }} &euro;</p>
        <p><strong>Catégorie :</strong> {{ product.category ?? 'Aucune' }}</p>
        <p><strong>En stock :</strong> {{ product.inStock ? 'Oui' : 'Non' }}</p>
    </div>

    <a href="{{ path('product_index') }}">Retour à la liste</a>
{% endblock %}
```

Crée `templates/product/new.html.twig` :

```twig
{# templates/product/new.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Nouveau produit{% endblock %}

{% block body %}
    <h1>Ajouter un produit</h1>

    {% if error is defined %}
        <div class="error">{{ error }}</div>
    {% endif %}

    <form method="post" action="{{ path('product_new') }}">
        <div>
            <label for="name">Nom :</label>
            <input type="text" id="name" name="name" required>
        </div>

        <div>
            <label for="price">Prix (en centimes) :</label>
            <input type="number" id="price" name="price" min="0" required>
        </div>

        <div>
            <label for="category">Catégorie :</label>
            <input type="text" id="category" name="category">
        </div>

        <button type="submit">Créer</button>
    </form>
{% endblock %}
```

---

### Étape 3 : Écrire le premier test fonctionnel

Crée `tests/Controller/ProductControllerTest.php` :

```php
<?php
// tests/Controller/ProductControllerTest.php
// Tests fonctionnels du contrôleur Product

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ProductControllerTest extends WebTestCase
{
    // --- Tests de la page de liste ---

    public function testProductIndexReturns200(): void
    {
        // Crée un client HTTP de test
        $client = static::createClient();

        // Envoie une requête GET vers /products
        $client->request('GET', '/products');

        // Vérifie que le code HTTP est 200 (succès)
        $this->assertResponseIsSuccessful();
    }

    public function testProductIndexDisplaysTitle(): void
    {
        $client = static::createClient();

        // request() retourne un Crawler qui permet d'analyser le HTML
        $crawler = $client->request('GET', '/products');

        // filter() cherche un élément par sélecteur CSS
        // text() retourne le contenu texte de l'élément
        $this->assertEquals(
            'Liste des produits',
            $crawler->filter('h1')->text()
        );
    }

    public function testProductIndexDisplaysProducts(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/products');

        // On vérifie qu'il y a au moins un produit affiché
        // filter('table tbody tr') sélectionne les lignes du tableau
        $this->assertGreaterThan(
            0,
            $crawler->filter('table tbody tr')->count(),
            'La liste des produits ne devrait pas être vide'
        );
    }

    public function testProductIndexDisplaysAddLink(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/products');

        // Vérifie qu'un lien "Ajouter un produit" existe
        $this->assertSelectorExists('a[href="/products/new"]');
    }
}
```

Lance les tests :

```bash
./vendor/bin/phpunit tests/Controller/ProductControllerTest.php
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

....                                                                4 / 4 (100%)

Time: 00:00.500, Memory: 36.00 MB

OK (4 tests, 4 assertions)
```

---

### Étape 4 : Tester les pages de détail

Ajoute ces tests dans `ProductControllerTest.php` :

```php
<?php
// Ajoute ces méthodes dans la classe ProductControllerTest

// --- Tests de la page de détail ---

public function testProductShowReturns200ForExistingProduct(): void
{
    $client = static::createClient();

    // On navigue d'abord vers la liste pour trouver un lien valide
    $crawler = $client->request('GET', '/products');

    // On clique sur le premier lien de produit dans le tableau
    $link = $crawler->filter('table tbody tr td a')->first()->link();
    $client->click($link);

    $this->assertResponseIsSuccessful();
}

public function testProductShowDisplaysProductName(): void
{
    $client = static::createClient();
    $crawler = $client->request('GET', '/products');

    // On récupère le nom du premier produit dans la liste
    $productName = $crawler->filter('table tbody tr td a')->first()->text();

    // On clique sur le lien
    $link = $crawler->filter('table tbody tr td a')->first()->link();
    $crawler = $client->click($link);

    // Le H1 de la page de détail doit contenir le nom du produit
    $this->assertEquals($productName, $crawler->filter('h1')->text());
}

public function testProductShowDisplaysBackLink(): void
{
    $client = static::createClient();
    $crawler = $client->request('GET', '/products');

    $link = $crawler->filter('table tbody tr td a')->first()->link();
    $crawler = $client->click($link);

    // Vérifie qu'un lien "Retour à la liste" existe
    $this->assertSelectorTextContains('a', 'Retour à la liste');
}

public function testProductShow404ForNonExistingProduct(): void
{
    $client = static::createClient();

    // On demande un produit avec un ID qui n'existe pas
    $client->request('GET', '/products/99999');

    // Symfony retourne une erreur 404
    $this->assertResponseStatusCodeSame(404);
}
```

---

### Étape 5 : Tester la soumission de formulaire

Ajoute ces tests dans `ProductControllerTest.php` :

```php
<?php
// Ajoute ces méthodes dans la classe ProductControllerTest

// --- Tests du formulaire de création ---

public function testProductNewPageReturns200(): void
{
    $client = static::createClient();
    $client->request('GET', '/products/new');

    $this->assertResponseIsSuccessful();
}

public function testProductNewPageDisplaysForm(): void
{
    $client = static::createClient();
    $crawler = $client->request('GET', '/products/new');

    // Vérifie que le formulaire existe
    $this->assertSelectorExists('form');

    // Vérifie que les champs existent
    $this->assertSelectorExists('input[name="name"]');
    $this->assertSelectorExists('input[name="price"]');
    $this->assertSelectorExists('input[name="category"]');
    $this->assertSelectorExists('button[type="submit"]');
}

public function testProductNewCreatesProductAndRedirects(): void
{
    $client = static::createClient();
    $crawler = $client->request('GET', '/products/new');

    // submitForm() remplit et soumet le formulaire en une seule étape
    // Le premier argument est le texte du bouton de soumission
    // Le second argument est un tableau de champs à remplir
    $client->submitForm('Créer', [
        'name' => 'Produit de test',
        'price' => '2999',
        'category' => 'Test',
    ]);

    // Vérifie que la réponse est une redirection (code 302)
    $this->assertResponseRedirects();

    // Suit la redirection
    $client->followRedirect();

    // Après la redirection, on doit être sur la page de détail
    $this->assertResponseIsSuccessful();

    // Le titre de la page doit contenir le nom du produit
    $this->assertSelectorTextContains('h1', 'Produit de test');
}

public function testProductNewWithEmptyNameShowsError(): void
{
    $client = static::createClient();
    $crawler = $client->request('GET', '/products/new');

    // On soumet le formulaire avec un nom vide
    $client->submitForm('Créer', [
        'name' => '',
        'price' => '1000',
    ]);

    // La page doit afficher un message d'erreur
    $this->assertSelectorTextContains('.error', 'Le nom est obligatoire');
}
```

---

### Étape 6 : Utiliser les assertions Symfony

Symfony fournit des assertions spécialisées pour les tests fonctionnels. Voici les plus utiles :

```php
<?php
// Assertions sur la réponse HTTP

// Vérifie le code HTTP
$this->assertResponseIsSuccessful();        // 2xx
$this->assertResponseStatusCodeSame(200);   // Code exact
$this->assertResponseStatusCodeSame(404);   // Not Found
$this->assertResponseRedirects();           // 3xx
$this->assertResponseRedirects('/products'); // Redirection vers une URL

// Assertions sur le contenu HTML
$this->assertSelectorExists('h1');                          // L'élément existe
$this->assertSelectorNotExists('.error');                   // L'élément n'existe pas
$this->assertSelectorTextContains('h1', 'Bienvenue');       // Le texte contient
$this->assertSelectorTextSame('h1', 'Bienvenue exacte');    // Le texte est exactement
$this->assertSelectorCount(5, 'table tbody tr');            // Nombre d'éléments

// Assertions sur les en-têtes
$this->assertResponseHeaderSame('Content-Type', 'text/html; charset=UTF-8');

// Assertions sur les cookies
$this->assertBrowserHasCookie('PHPSESSID');
```

---

### Étape 7 : Tester la navigation complète

Ce test simule un parcours utilisateur complet :

```php
<?php
// Ajoute cette méthode dans ProductControllerTest

public function testCompleteUserJourney(): void
{
    $client = static::createClient();

    // Étape 1 : L'utilisateur arrive sur la liste des produits
    $crawler = $client->request('GET', '/products');
    $this->assertResponseIsSuccessful();
    $this->assertSelectorTextContains('h1', 'Liste des produits');

    // Étape 2 : L'utilisateur clique sur "Ajouter un produit"
    $crawler = $client->clickLink('Ajouter un produit');
    $this->assertResponseIsSuccessful();
    $this->assertSelectorTextContains('h1', 'Ajouter un produit');

    // Étape 3 : L'utilisateur remplit et soumet le formulaire
    $client->submitForm('Créer', [
        'name' => 'Clé USB 64Go',
        'price' => '1499',
        'category' => 'Électronique',
    ]);

    // Étape 4 : L'utilisateur est redirigé vers la page de détail
    $this->assertResponseRedirects();
    $crawler = $client->followRedirect();
    $this->assertSelectorTextContains('h1', 'Clé USB 64Go');

    // Étape 5 : L'utilisateur clique sur "Retour à la liste"
    $crawler = $client->clickLink('Retour à la liste');
    $this->assertResponseIsSuccessful();
    $this->assertSelectorTextContains('h1', 'Liste des produits');
}
```

---

### Étape 8 : Tester les réponses JSON (API)

Si tu as un contrôleur qui retourne du JSON :

```php
<?php
// src/Controller/ApiProductController.php

namespace App\Controller;

use App\Repository\ProductRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

#[Route('/api')]
class ApiProductController extends AbstractController
{
    #[Route('/products', name: 'api_product_list', methods: ['GET'])]
    public function list(ProductRepository $repository): JsonResponse
    {
        $products = $repository->findInStock();

        $data = array_map(fn($p) => [
            'id' => $p->getId(),
            'name' => $p->getName(),
            'price' => $p->getPriceInEuros(),
            'category' => $p->getCategory(),
        ], $products);

        return $this->json($data);
    }
}
```

Test de l'API :

```php
<?php
// tests/Controller/ApiProductControllerTest.php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ApiProductControllerTest extends WebTestCase
{
    public function testApiProductListReturnsJson(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/products');

        $this->assertResponseIsSuccessful();
        $this->assertResponseHeaderSame(
            'Content-Type',
            'application/json'
        );

        // Décode la réponse JSON
        $data = json_decode(
            $client->getResponse()->getContent(),
            true
        );

        // Vérifie que la réponse est un tableau non vide
        $this->assertIsArray($data);
        $this->assertNotEmpty($data);

        // Vérifie la structure du premier élément
        $firstProduct = $data[0];
        $this->assertArrayHasKey('id', $firstProduct);
        $this->assertArrayHasKey('name', $firstProduct);
        $this->assertArrayHasKey('price', $firstProduct);
        $this->assertArrayHasKey('category', $firstProduct);
    }

    public function testApiProductListContainsCorrectData(): void
    {
        $client = static::createClient();
        $client->request('GET', '/api/products');

        $data = json_decode(
            $client->getResponse()->getContent(),
            true
        );

        // Vérifie que tous les produits ont un prix positif ou nul
        foreach ($data as $product) {
            $this->assertGreaterThanOrEqual(0, $product['price']);
        }
    }
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit tests/Controller/` | Lancer tous les tests de contrôleurs |
| `./vendor/bin/phpunit --filter testProductIndex` | Lancer un test spécifique |
| `./vendor/bin/phpunit --testdox tests/Controller/` | Affichage lisible des tests |
| `php bin/console debug:router --env=test` | Lister les routes en environnement de test |
| `php bin/console router:match /products --env=test` | Vérifier quelle route correspond à une URL |

---

## Pièges Fréquents

### Piège 1 : Créer plusieurs clients dans un même test

**Problème** : Tu appelles `static::createClient()` deux fois dans le même test. Le second appel écrase le kernel du premier.

**Solution** : N'appelle `static::createClient()` qu'une seule fois par test. Si tu veux envoyer plusieurs requêtes, réutilise le même client.

```php
// ❌ Incorrect : deux clients dans le même test
$client1 = static::createClient();
$client2 = static::createClient(); // Écrase le kernel du premier

// ✅ Correct : un seul client, plusieurs requêtes
$client = static::createClient();
$client->request('GET', '/products');
$client->request('GET', '/products/1');
```

---

### Piège 2 : Oublier de suivre les redirections

**Problème** : Après une soumission de formulaire, le test vérifie le contenu de la page mais obtient une réponse 302 (redirection) au lieu du contenu attendu.

**Solution** : Appelle `$client->followRedirect()` après une redirection, ou utilise `$client->followRedirects(true)` pour suivre automatiquement.

```php
// ❌ Le contenu n'est pas celui attendu (c'est la réponse 302)
$client->submitForm('Créer', ['name' => 'Test']);
$this->assertSelectorTextContains('h1', 'Test'); // Échoue

// ✅ On suit la redirection d'abord
$client->submitForm('Créer', ['name' => 'Test']);
$client->followRedirect();
$this->assertSelectorTextContains('h1', 'Test'); // Passe
```

---

### Piège 3 : Tester le JavaScript avec WebTestCase

**Problème** : Tu essaies de tester un comportement JavaScript (menu déroulant, AJAX) avec WebTestCase. Le test ne fonctionne pas.

**Solution** : WebTestCase ne peut pas exécuter de JavaScript. Pour tester du JavaScript, utilise Playwright (fiche 07).

---

### Piège 4 : Confondre assertSelectorTextContains et assertSelectorTextSame

**Problème** : Tu utilises `assertSelectorTextSame` mais le test échoue à cause d'espaces ou retours à la ligne dans le HTML.

**Solution** : Utilise `assertSelectorTextContains` pour les vérifications souples, `assertSelectorTextSame` uniquement quand tu contrôles exactement le contenu.

```php
// ❌ Peut échouer à cause d'espaces dans le HTML
$this->assertSelectorTextSame('h1', 'Liste des produits');

// ✅ Plus souple, vérifie que le texte contient la chaîne
$this->assertSelectorTextContains('h1', 'Liste des produits');
```

---

## Checklist de Validation

- [ ] Je sais créer un client HTTP avec `static::createClient()`
- [ ] Je sais envoyer des requêtes GET et POST
- [ ] Je sais utiliser le Crawler pour analyser le HTML
- [ ] Je sais soumettre des formulaires avec `submitForm()`
- [ ] Je sais suivre les redirections avec `followRedirect()`
- [ ] Je connais les assertions Symfony (assertResponseIsSuccessful, assertSelectorTextContains, etc.)
- [ ] Je sais tester un parcours utilisateur complet
- [ ] Je sais tester une réponse JSON
- [ ] Tous mes tests passent avec `./vendor/bin/phpunit`

---

## Exercice Pratique

**Énoncé** : Crée un contrôleur `ContactController` avec deux routes :

1. `GET /contact` : affiche un formulaire de contact (nom, email, message)
2. `POST /contact` : traite le formulaire, valide les champs et affiche un message de confirmation

Écris des tests fonctionnels qui vérifient :

- La page de contact retourne un code 200
- Le formulaire contient les 3 champs attendus
- La soumission avec des données valides affiche le message de confirmation
- La soumission avec un email invalide affiche un message d'erreur
- La soumission avec un message vide affiche un message d'erreur

**Indications** :

- Utilise un template Twig simple pour le formulaire
- La validation peut être faite dans le contrôleur (pas besoin de formulaire Symfony avancé)
- Écris au minimum 6 tests fonctionnels
- Teste les cas normaux et les cas d'erreur

**Résultat attendu** : Tous les tests passent avec `./vendor/bin/phpunit`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/Controller/ContactController.php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ContactController extends AbstractController
{
    #[Route('/contact', name: 'contact', methods: ['GET', 'POST'])]
    public function index(Request $request): Response
    {
        $error = null;
        $success = false;

        if ($request->isMethod('POST')) {
            $name = trim($request->request->get('name', ''));
            $email = trim($request->request->get('email', ''));
            $message = trim($request->request->get('message', ''));

            if ($name === '') {
                $error = 'Le nom est obligatoire';
            } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
                $error = 'L\'email est invalide';
            } elseif ($message === '') {
                $error = 'Le message est obligatoire';
            } else {
                $success = true;
            }
        }

        return $this->render('contact/index.html.twig', [
            'error' => $error,
            'success' => $success,
        ]);
    }
}
```

```twig
{# templates/contact/index.html.twig #}
{% extends 'base.html.twig' %}

{% block title %}Contact{% endblock %}

{% block body %}
    <h1>Nous contacter</h1>

    {% if success %}
        <div class="success">Votre message a été envoyé avec succès.</div>
    {% else %}
        {% if error %}
            <div class="error">{{ error }}</div>
        {% endif %}

        <form method="post" action="{{ path('contact') }}">
            <div>
                <label for="name">Nom :</label>
                <input type="text" id="name" name="name">
            </div>
            <div>
                <label for="email">Email :</label>
                <input type="email" id="email" name="email">
            </div>
            <div>
                <label for="message">Message :</label>
                <textarea id="message" name="message"></textarea>
            </div>
            <button type="submit">Envoyer</button>
        </form>
    {% endif %}
{% endblock %}
```

```php
<?php
// tests/Controller/ContactControllerTest.php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ContactControllerTest extends WebTestCase
{
    public function testContactPageReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/contact');
        $this->assertResponseIsSuccessful();
    }

    public function testContactPageDisplaysForm(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/contact');

        $this->assertSelectorExists('form');
        $this->assertSelectorExists('input[name="name"]');
        $this->assertSelectorExists('input[name="email"]');
        $this->assertSelectorExists('textarea[name="message"]');
        $this->assertSelectorExists('button[type="submit"]');
    }

    public function testContactFormWithValidDataShowsSuccess(): void
    {
        $client = static::createClient();
        $client->request('GET', '/contact');

        $client->submitForm('Envoyer', [
            'name' => 'Alice Dupont',
            'email' => 'alice@example.com',
            'message' => 'Bonjour, ceci est un message de test.',
        ]);

        $this->assertSelectorTextContains('.success', 'envoyé avec succès');
    }

    public function testContactFormWithInvalidEmailShowsError(): void
    {
        $client = static::createClient();
        $client->request('GET', '/contact');

        $client->submitForm('Envoyer', [
            'name' => 'Alice',
            'email' => 'invalid-email',
            'message' => 'Un message.',
        ]);

        $this->assertSelectorTextContains('.error', 'email est invalide');
    }

    public function testContactFormWithEmptyMessageShowsError(): void
    {
        $client = static::createClient();
        $client->request('GET', '/contact');

        $client->submitForm('Envoyer', [
            'name' => 'Alice',
            'email' => 'alice@example.com',
            'message' => '',
        ]);

        $this->assertSelectorTextContains('.error', 'message est obligatoire');
    }

    public function testContactFormWithEmptyNameShowsError(): void
    {
        $client = static::createClient();
        $client->request('GET', '/contact');

        $client->submitForm('Envoyer', [
            'name' => '',
            'email' => 'alice@example.com',
            'message' => 'Un message.',
        ]);

        $this->assertSelectorTextContains('.error', 'nom est obligatoire');
    }
}
```

---

## Navigation

← Fiche précédente : **[Tests d'intégration Symfony](04-tests-integration-symfony.md)**

→ Fiche suivante : **[Introduction au TDD](06-introduction-tdd.md)**
