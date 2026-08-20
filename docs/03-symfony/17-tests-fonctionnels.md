---
tags:
  - Symfony
  - Avancé
  - Pratique
description: "Les tests fonctionnels avec PHPUnit"
estimated_time: "90 min"
fiche_number: 17
total_fiches: 21
cursus: "Symfony"
---

# 17 - Les tests fonctionnels

> **En bref** : À la fin de cette fiche, tu sauras écrire et exécuter des tests fonctionnels dans Symfony avec PHPUnit pour vérifier que tes pages, formulaires et redirections fonctionnent correctement. Lecture estimée : 90 min.


## Prérequis

- Avoir lu la fiche **[02 - Les contrôleurs et les routes](02-controleurs-routes.md)** (créer un contrôleur, définir une route, retourner une réponse)
- Avoir un projet Symfony fonctionnel avec au moins un contrôleur et un template
- _(Optionnel)_ Fiche [Tests et qualité logicielle](../competences-metier/04-developpement-logiciel/03-tests-qualite-logicielle.md) - vue métier des tests, les concepts de base sont aussi expliqués dans cette fiche

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire et exécuter des tests fonctionnels dans Symfony avec PHPUnit pour vérifier que tes pages, formulaires et redirections fonctionnent correctement.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test fonctionnel ?

**Définition** : Un test fonctionnel vérifie qu'une fonctionnalité complète de ton application fonctionne correctement, en simulant le comportement d'un utilisateur qui navigue sur ton site (accéder à une page, remplir un formulaire, cliquer sur un bouton).

**Le problème que les tests fonctionnels résolvent** :

Sans tests fonctionnels, voici les problèmes rencontrés :

1. **Régressions invisibles** : Tu modifies un contrôleur et, sans le savoir, tu casses une page qui fonctionnait avant.

2. **Vérifications manuelles longues** : Après chaque modification, tu dois ouvrir le navigateur, naviguer sur chaque page, remplir chaque formulaire, et vérifier visuellement que tout fonctionne.

3. **Peur de modifier le code** : Sans filet de sécurité, tu hésites à refactoriser ou à ajouter des fonctionnalités.

4. **Bugs en production** : Une page qui retourne une erreur 500 passe inaperçue jusqu'à ce qu'un utilisateur la signale.

**Comment les tests fonctionnels résolvent ces problèmes** :

| Problème | Solution apportée par les tests fonctionnels |
| -------- | --------------------------------------------- |
| Régressions invisibles | Le test échoue immédiatement si une page casse |
| Vérifications manuelles longues | Une commande exécute tous les tests en quelques secondes |
| Peur de modifier le code | Les tests confirment que tout fonctionne après chaque modification |
| Bugs en production | Les tests détectent les erreurs avant le déploiement |

**Analogie concrète** : Imagine que tu prépares un plat. Un test unitaire vérifie chaque ingrédient séparément (le sel est du sel, la farine est de la farine). Un test fonctionnel, c'est goûter le plat final : tu vérifies que le résultat est bon, que tous les ingrédients fonctionnent ensemble. Si le plat a un goût bizarre, tu sais qu'il y a un problème quelque part dans la recette.

**Ce qu'un test fonctionnel n'est PAS** :

- Un test fonctionnel n'est pas un test unitaire. Un test unitaire vérifie une seule classe ou méthode en isolation. Un test fonctionnel vérifie tout le parcours : routage, contrôleur, template, base de données.
- Un test fonctionnel n'est pas un test E2E (End-to-End) avec un vrai navigateur. Symfony simule les requêtes HTTP sans ouvrir un navigateur. C'est plus rapide mais ne teste pas le JavaScript.

**Comparaison test unitaire vs test fonctionnel** :

| Test unitaire | Test fonctionnel |
| ------------- | ---------------- |
| Teste une classe isolée | Teste une fonctionnalité complète |
| Très rapide (millisecondes) | Rapide (quelques secondes) |
| Pas besoin de base de données | Peut utiliser la base de données |
| Pas de requête HTTP | Simule des requêtes HTTP |
| Vérifie la logique métier | Vérifie le comportement utilisateur |

---

### PHPUnit dans Symfony

**Définition** : PHPUnit est le framework de tests standard en PHP. Symfony l'intègre avec des outils supplémentaires pour simuler des requêtes HTTP, naviguer dans le HTML et vérifier les réponses.

**Installation** : Symfony fournit un "test-pack" qui installe PHPUnit et tous les outils nécessaires en une seule commande.

**Fichier de configuration** : Le fichier `phpunit.xml.dist` à la racine du projet configure PHPUnit. Il est créé automatiquement lors de l'installation.

**Structure du fichier `phpunit.xml.dist`** :

```xml
<?xml version="1.0" encoding="UTF-8"?>

<!-- phpunit.xml.dist -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="tests/bootstrap.php"
         colors="true">

    <!-- Dossier contenant les tests -->
    <testsuites>
        <testsuite name="Project Test Suite">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <!-- Variables d'environnement pour les tests -->
    <php>
        <ini name="display_errors" value="1"/>
        <ini name="error_reporting" value="-1"/>
        <server name="APP_ENV" value="test" force="true"/>
        <server name="SHELL_VERBOSITY" value="-1"/>
    </php>

</phpunit>
```

**Points importants** :

| Élément | Rôle |
| ------- | ---- |
| `bootstrap="tests/bootstrap.php"` | Fichier exécuté avant les tests (charge l'autoloader) |
| `APP_ENV=test` | Force l'environnement Symfony en mode "test" |
| `<directory>tests</directory>` | PHPUnit cherche les tests dans le dossier `tests/` |

---

### WebTestCase

**Définition** : `WebTestCase` est une classe fournie par Symfony qui étend PHPUnit. Elle permet de créer un client HTTP simulé pour envoyer des requêtes à ton application sans passer par un vrai navigateur.

**Les méthodes clés de WebTestCase** :

| Méthode | Description |
| ------- | ----------- |
| `static::createClient()` | Crée un client HTTP simulé |
| `$client->request('GET', '/url')` | Envoie une requête HTTP |
| `$client->getResponse()` | Récupère la réponse HTTP |
| `$client->getCrawler()` | Récupère le Crawler pour naviguer dans le HTML |
| `$client->followRedirect()` | Suit une redirection HTTP |
| `$client->submitForm()` | Soumet un formulaire |
| `$client->clickLink()` | Clique sur un lien |

**Structure d'un test fonctionnel** :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HomeControllerTest extends WebTestCase
{
    public function testHomePage(): void
    {
        // 1. Créer le client HTTP simulé
        $client = static::createClient();

        // 2. Envoyer une requête
        $client->request('GET', '/');

        // 3. Vérifier le résultat
        $this->assertResponseIsSuccessful();
    }
}
```

**Convention de nommage** :

| Élément | Convention | Exemple |
| ------- | ---------- | ------- |
| Dossier | `tests/Controller/` | `tests/Controller/` |
| Fichier | `NomControllerTest.php` | `HomeControllerTest.php` |
| Classe | `NomControllerTest` | `HomeControllerTest` |
| Méthode | `testNomDuTest` | `testHomePage` |

---

### Le Crawler

**Définition** : Le Crawler est un objet qui permet de naviguer dans le contenu HTML de la réponse, comme si tu inspectais la page dans les outils de développement du navigateur.

**Création** : Le Crawler est retourné par `$client->request()` :

```php
<?php

$crawler = $client->request('GET', '/products');
```

**Méthodes principales du Crawler** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `filter('sélecteur')` | Filtre les éléments avec un sélecteur CSS | `$crawler->filter('h1')` |
| `text()` | Récupère le texte d'un élément | `$crawler->filter('h1')->text()` |
| `attr('attribut')` | Récupère un attribut HTML | `$crawler->filter('a')->attr('href')` |
| `count()` | Compte les éléments trouvés | `$crawler->filter('li')->count()` |
| `eq(index)` | Sélectionne un élément par son index | `$crawler->filter('li')->eq(0)` |
| `each(callback)` | Itère sur chaque élément | `$crawler->filter('li')->each(fn($node) => ...)` |

**Exemples de sélecteurs CSS** :

```php
<?php

// Sélectionner par balise
$crawler->filter('h1');

// Sélectionner par classe
$crawler->filter('.product-card');

// Sélectionner par identifiant
$crawler->filter('#main-title');

// Sélectionner un lien par son texte
$crawler->selectLink('Voir le produit');

// Sélectionner un bouton par son texte
$crawler->selectButton('Enregistrer');
```

---

### Simuler des formulaires

**Définition** : Le client HTTP de Symfony peut remplir et soumettre des formulaires sans navigateur. Tu récupères le formulaire via le Crawler, tu remplis les champs, et tu le soumets.

**Les deux approches** :

**Approche 1 : `submitForm()` (recommandée)** :

```php
<?php

// Soumettre le formulaire en une seule ligne
$client->submitForm('Enregistrer', [
    'article[title]' => 'Mon article',
    'article[content]' => 'Le contenu de mon article.',
]);
```

Le premier argument est le texte du bouton de soumission. Le second est un tableau associatif avec les noms des champs et leurs valeurs.

**Approche 2 : étape par étape** :

```php
<?php

// 1. Accéder à la page du formulaire
$crawler = $client->request('GET', '/article/new');

// 2. Récupérer le formulaire via le bouton de soumission
$form = $crawler->selectButton('Enregistrer')->form();

// 3. Remplir les champs
$form['article[title]'] = 'Mon article';
$form['article[content]'] = 'Le contenu de mon article.';

// 4. Soumettre le formulaire
$client->submit($form);
```

**Trouver les noms des champs** : Les noms des champs correspondent à l'attribut `name` des balises `<input>`. Dans un formulaire Symfony, le format est `nomDuFormulaire[nomDuChamp]`.

---

### Les assertions HTTP

**Définition** : Symfony fournit des méthodes d'assertion spécialisées pour vérifier les réponses HTTP. Elles sont plus lisibles que les assertions PHPUnit classiques.

**Assertions sur la réponse** :

| Assertion | Vérifie que... |
| --------- | -------------- |
| `assertResponseIsSuccessful()` | Le code HTTP est 2xx (200, 201...) |
| `assertResponseStatusCodeSame(404)` | Le code HTTP est exactement 404 |
| `assertResponseRedirects('/url')` | La réponse est une redirection vers `/url` |
| `assertResponseRedirects()` | La réponse est une redirection (sans vérifier l'URL) |

**Assertions sur le contenu HTML** :

| Assertion | Vérifie que... |
| --------- | -------------- |
| `assertSelectorTextContains('h1', 'Accueil')` | Le `<h1>` contient le texte "Accueil" |
| `assertSelectorTextSame('h1', 'Accueil')` | Le `<h1>` a exactement le texte "Accueil" |
| `assertSelectorExists('.product-card')` | Un élément avec la classe `product-card` existe |
| `assertSelectorNotExists('.error')` | Aucun élément avec la classe `error` n'existe |
| `assertSelectorCount(3, '.product-card')` | Il y a exactement 3 éléments `.product-card` |

**Assertions sur la route** :

| Assertion | Vérifie que... |
| --------- | -------------- |
| `assertRouteSame('product_list')` | La route correspondante est `product_list` |

---

### Fixtures de test

**Définition** : Les fixtures sont des données de test que tu charges dans la base de données avant d'exécuter les tests. Elles garantissent que chaque test part d'un état connu et reproductible.

**Le problème que les fixtures résolvent** :

Sans fixtures, voici les problèmes rencontrés :

1. **Tests imprévisibles** : Les tests dépendent des données qui existent (ou non) dans la base. Un test peut réussir le matin et échouer le soir.

2. **Tests qui s'influencent** : Un test qui crée des données peut faire échouer le test suivant qui ne s'attend pas à ces données.

**Comment les fixtures résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Tests imprévisibles | Les fixtures chargent toujours les mêmes données |
| Tests qui s'influencent | La base est réinitialisée avant chaque test |

Le bundle `doctrine/doctrine-fixtures-bundle` fournit une commande pour charger des données de test et une classe de base `Fixture` pour les définir. L'installation et l'utilisation sont détaillées à l'étape 6.

---

## Étapes Pratiques

### Étape 1 : Installer PHPUnit

```bash
docker compose exec php composer require --dev symfony/test-pack
```

**Résultat attendu** :

```text
Using version ^1.0 for symfony/test-pack
./composer.json has been updated
...
 * Creating phpunit.xml.dist
 * Creating tests/bootstrap.php
```

Symfony installe PHPUnit et crée le dossier `tests/` avec le fichier de configuration.

Vérifie que le dossier `tests/` existe :

```text
projet-symfony/
├── tests/
│   └── bootstrap.php
├── phpunit.xml.dist
└── ...
```

---

### Étape 2 : Créer un test basique (page d'accueil)

Crée le fichier `tests/Controller/HomeControllerTest.php` :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HomeControllerTest extends WebTestCase
{
    public function testHomePageReturns200(): void
    {
        // Crée un client HTTP simulé
        $client = static::createClient();

        // Envoie une requête GET vers la page d'accueil
        $client->request('GET', '/');

        // Vérifie que la réponse a un code HTTP 2xx (succès)
        $this->assertResponseIsSuccessful();
    }
}
```

Exécute ce premier test :

```bash
docker compose exec php php bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

.                                                                   1 / 1 (100%)

Time: 00:00.234, Memory: 28.00 MB

OK (1 test, 1 assertion)
```

Le point `.` signifie que le test a réussi. Un `F` indiquerait un échec, un `E` une erreur.

---

### Étape 3 : Tester le contenu d'une page

Ajoute un second test qui vérifie le contenu HTML :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class HomeControllerTest extends WebTestCase
{
    public function testHomePageReturns200(): void
    {
        $client = static::createClient();
        $client->request('GET', '/');

        $this->assertResponseIsSuccessful();
    }

    public function testHomePageContainsTitle(): void
    {
        $client = static::createClient();

        // request() retourne un Crawler
        $crawler = $client->request('GET', '/');

        // Vérifie que la réponse est un succès
        $this->assertResponseIsSuccessful();

        // Vérifie que le <h1> contient le texte attendu
        $this->assertSelectorTextContains('h1', 'Bienvenue');
    }

    public function testHomePageContainsNavigation(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/');

        // Vérifie qu'il existe au moins un lien dans la navigation
        $this->assertSelectorExists('nav a');

        // Vérifie le nombre de liens dans la navigation
        $navLinks = $crawler->filter('nav a')->count();
        $this->assertGreaterThan(0, $navLinks, 'La navigation doit contenir au moins un lien.');
    }
}
```

---

### Étape 4 : Tester un formulaire

Crée le fichier `tests/Controller/ArticleControllerTest.php` :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArticleControllerTest extends WebTestCase
{
    public function testNewArticlePageIsAccessible(): void
    {
        $client = static::createClient();
        $client->request('GET', '/article/new');

        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('form');
    }

    public function testCreateArticle(): void
    {
        $client = static::createClient();

        // Accède à la page du formulaire
        $client->request('GET', '/article/new');

        // Remplit et soumet le formulaire
        // Le premier argument est le texte du bouton de soumission
        // Le second argument est un tableau clé => valeur des champs
        $client->submitForm('Enregistrer', [
            'article[title]' => 'Mon article de test',
            'article[content]' => 'Ceci est le contenu de mon article de test.',
        ]);

        // Après soumission, Symfony redirige vers la page de l'article
        $this->assertResponseRedirects();

        // Suivre la redirection
        $client->followRedirect();

        // Vérifier que la page de destination affiche l'article
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Mon article de test');
    }

    public function testCreateArticleWithEmptyTitle(): void
    {
        $client = static::createClient();
        $client->request('GET', '/article/new');

        // Soumettre un formulaire avec un titre vide
        $client->submitForm('Enregistrer', [
            'article[title]' => '',
            'article[content]' => 'Un contenu.',
        ]);

        // Le formulaire doit être réaffiché (pas de redirection)
        $this->assertResponseIsSuccessful();

        // Une erreur de validation doit être visible
        $this->assertSelectorExists('.invalid-feedback');
    }
}
```

**Comment trouver les noms des champs du formulaire ?** :

1. Ouvre la page du formulaire dans ton navigateur.
2. Fais un clic droit sur un champ, puis "Inspecter".
3. Regarde l'attribut `name` de la balise `<input>`.

Exemple : `<input name="article[title]" ...>` donne le nom `article[title]`.

---

### Étape 5 : Tester une redirection

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class RedirectControllerTest extends WebTestCase
{
    public function testOldUrlRedirectsToNew(): void
    {
        $client = static::createClient();

        // Accéder à une ancienne URL
        $client->request('GET', '/old-page');

        // Vérifier que la redirection pointe vers la bonne URL
        $this->assertResponseRedirects('/new-page');

        // Suivre la redirection et vérifier la page finale
        $client->followRedirect();
        $this->assertResponseIsSuccessful();
    }
}
```

---

### Étape 6 : Tester avec des fixtures

**Étape 6a** : Installe le bundle de fixtures :

```bash
docker compose exec php composer require --dev doctrine/doctrine-fixtures-bundle
```

**Étape 6b** : Crée une fixture `src/DataFixtures/ArticleFixtures.php` :

```php
<?php

namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ArticleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $titles = [
            'Introduction à Symfony',
            'Les bases de PHP',
            'Docker pour les débutants',
        ];

        foreach ($titles as $index => $title) {
            $article = new Article();
            $article->setTitle($title);
            $article->setContent('Contenu de l\'article : ' . $title);
            $manager->persist($article);
        }

        $manager->flush();
    }
}
```

**Étape 6c** : Configure la base de données de test.

Crée ou modifie le fichier `.env.test` à la racine du projet :

```env
# .env.test
DATABASE_URL="postgresql://app:!ChangeMe!@database:5432/app_test?serverVersion=16&charset=utf8"
```

**Point important** : La base de données de test (`app_test`) est séparée de la base de données de développement (`app`). Les tests ne modifient jamais tes données de développement.

**Étape 6d** : Crée la base de données de test et charge les fixtures :

```bash
# Créer la base de données de test
docker compose exec php php bin/console doctrine:database:create --env=test

# Créer les tables
docker compose exec php php bin/console doctrine:schema:create --env=test

# Charger les fixtures
docker compose exec php php bin/console doctrine:fixtures:load --env=test --no-interaction
```

**Résultat attendu** :

```text
  > purging database
  > loading App\DataFixtures\ArticleFixtures
```

**Étape 6e** : Écris un test qui utilise les fixtures :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArticleListControllerTest extends WebTestCase
{
    public function testArticleListShowsFixtures(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/articles');

        $this->assertResponseIsSuccessful();

        // Vérifie que les 3 articles des fixtures sont affichés
        $this->assertSelectorCount(3, '.article-card');

        // Vérifie qu'un titre spécifique est présent
        $this->assertSelectorTextContains('.article-card', 'Introduction à Symfony');
    }

    public function testArticleShowPage(): void
    {
        $client = static::createClient();

        // Accéder à la liste des articles
        $crawler = $client->request('GET', '/articles');

        // Cliquer sur le premier lien "Lire la suite"
        $link = $crawler->selectLink('Lire la suite')->link();
        $client->click($link);

        // Vérifier que la page de détail s'affiche
        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('h1');
    }
}
```

---

### Étape 7 : Exécuter les tests

**Exécuter tous les tests** :

```bash
docker compose exec php php bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 12.x by Sebastian Bergmann and contributors.

.........                                                         9 / 9 (100%)

Time: 00:01.432, Memory: 32.00 MB

OK (9 tests, 19 assertions)
```

**Exécuter un seul fichier ou un seul test** :

```bash
docker compose exec php php bin/phpunit tests/Controller/ArticleControllerTest.php
docker compose exec php php bin/phpunit --filter testCreateArticle
```

**Afficher les détails de chaque test** :

```bash
docker compose exec php php bin/phpunit --testdox
```

**Résultat attendu avec `--testdox`** :

```text
Home Controller
 ✔ Home page returns 200
 ✔ Home page contains title
 ✔ Home page contains navigation

Article Controller
 ✔ New article page is accessible
 ✔ Create article
 ✔ Create article with empty title

Redirect Controller
 ✔ Old url redirects to new

Article List Controller
 ✔ Article list shows fixtures
 ✔ Article show page
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/phpunit` | Exécuter tous les tests |
| `php bin/phpunit tests/Controller/NomTest.php` | Exécuter un fichier de test |
| `php bin/phpunit --filter nomDuTest` | Exécuter un test spécifique |
| `php bin/phpunit --testdox` | Afficher les résultats en format lisible |
| `php bin/phpunit --stop-on-failure` | Arrêter au premier échec |
| `php bin/phpunit --coverage-text` | Afficher la couverture de code (nécessite Xdebug) |
| `php bin/console doctrine:fixtures:load --env=test --no-interaction` | Recharger les fixtures de test |
| `php bin/console doctrine:schema:update --env=test --force` | Mettre à jour le schéma de la base de test |

---

## Pièges Fréquents

### Piège 1 : Base de données de test non configurée

**Problème** : Erreur "SQLSTATE Connection refused" ou "Unknown database" lors de l'exécution des tests.

**Solution** : Vérifie que le fichier `.env.test` existe et contient la variable `DATABASE_URL` pointant vers une base de données de test séparée. Crée la base et les tables :

```bash
# Créer la base de données de test
docker compose exec php php bin/console doctrine:database:create --env=test

# Créer les tables
docker compose exec php php bin/console doctrine:schema:create --env=test
```

---

### Piège 2 : Fixtures non chargées avant les tests

**Problème** : Les tests qui comptent sur des données échouent car la base est vide.

**Solution** : Charge les fixtures avant d'exécuter les tests :

```bash
docker compose exec php php bin/console doctrine:fixtures:load --env=test --no-interaction
```

Pour automatiser cette étape, tu peux ajouter un script dans `composer.json` :

```json
{
    "scripts": {
        "test": [
            "@php bin/console doctrine:schema:drop --env=test --force --quiet",
            "@php bin/console doctrine:schema:create --env=test --quiet",
            "@php bin/console doctrine:fixtures:load --env=test --no-interaction --quiet",
            "@php bin/phpunit"
        ]
    }
}
```

Ensuite, lance tous les tests avec une seule commande :

```bash
docker compose exec php composer test
```

---

### Piège 3 : Token CSRF manquant dans les formulaires

**Problème** : Erreur "The CSRF token is invalid" lors de la soumission d'un formulaire dans un test.

**Solution** : Utilise `submitForm()` ou `$crawler->selectButton()->form()`. Ces méthodes incluent automatiquement le token CSRF. Ne construis pas la requête POST manuellement.

```php
<?php

// ❌ Incorrect : pas de token CSRF
$client->request('POST', '/article/new', [
    'article[title]' => 'Test',
]);

// ✅ Correct : le token CSRF est inclus automatiquement
$client->request('GET', '/article/new');
$client->submitForm('Enregistrer', [
    'article[title]' => 'Test',
    'article[content]' => 'Contenu.',
]);
```

---

### Piège 4 : Tests qui dépendent les uns des autres

**Problème** : Le test B échoue si le test A n'est pas exécuté avant, ou le test B échoue à cause des données créées par le test A.

**Solution** : Chaque test doit être indépendant. Utilise les fixtures pour partir d'un état connu. Ne suppose jamais qu'un autre test a été exécuté avant.

```php
<?php

// ❌ Incorrect : le test dépend d'un article créé par un autre test
public function testShowArticle(): void
{
    $client = static::createClient();
    $client->request('GET', '/article/1');  // L'article 1 existe-t-il ?
    $this->assertResponseIsSuccessful();
}

// ✅ Correct : le test utilise les fixtures
public function testShowArticle(): void
{
    $client = static::createClient();

    // D'abord, aller sur la liste pour obtenir un lien valide
    $crawler = $client->request('GET', '/articles');
    $link = $crawler->selectLink('Lire la suite')->link();
    $client->click($link);

    $this->assertResponseIsSuccessful();
}
```

---

### Piège 5 : Oublier de suivre les redirections

**Problème** : Après la soumission d'un formulaire, `assertSelectorTextContains()` échoue car la réponse est une redirection (code 302), pas une page HTML.

**Solution** : Appelle `$client->followRedirect()` après la soumission.

```php
<?php

// ❌ Incorrect : on vérifie le HTML d'une réponse 302 (redirection)
$client->submitForm('Enregistrer', [...]);
$this->assertSelectorTextContains('h1', 'Article créé');  // Échoue !

// ✅ Correct : on suit la redirection d'abord
$client->submitForm('Enregistrer', [...]);
$this->assertResponseRedirects();
$client->followRedirect();
$this->assertSelectorTextContains('h1', 'Article créé');  // OK
```

---

## Checklist de Validation

- [ ] Je sais installer PHPUnit avec `composer require --dev symfony/test-pack`
- [ ] Je sais créer un test fonctionnel dans `tests/Controller/`
- [ ] Je sais utiliser `static::createClient()` et `$client->request()`
- [ ] Je sais utiliser les assertions HTTP (`assertResponseIsSuccessful`, `assertResponseRedirects`...)
- [ ] Je sais utiliser le Crawler pour vérifier le contenu HTML
- [ ] Je sais soumettre un formulaire avec `submitForm()` ou `selectButton()->form()`
- [ ] Je sais configurer la base de données de test dans `.env.test`
- [ ] Je sais créer et charger des fixtures de test
- [ ] Je sais exécuter les tests avec `php bin/phpunit` et ses options

---

## Exercice Pratique

**Énoncé** : Écris les tests fonctionnels pour un CRUD complet d'articles. Ton application a un contrôleur `ArticleController` avec les routes suivantes :

| Route | Méthode | URL | Action |
| ----- | ------- | --- | ------ |
| `article_list` | GET | `/articles` | Liste des articles |
| `article_show` | GET | `/articles/{id}` | Détail d'un article |
| `article_new` | GET/POST | `/articles/new` | Formulaire de création |
| `article_edit` | GET/POST | `/articles/{id}/edit` | Formulaire de modification |
| `article_delete` | POST | `/articles/{id}/delete` | Suppression |

**Indications** :

- Crée le fichier `tests/Controller/ArticleCrudTest.php`
- Crée une fixture `ArticleFixtures` qui charge 3 articles
- Écris les tests suivants :
  1. `testListPage` : GET `/articles` retourne 200 et affiche 3 articles
  2. `testShowPage` : clique sur un article depuis la liste, vérifie le titre
  3. `testCreateArticle` : remplit le formulaire, vérifie la redirection, vérifie que l'article apparaît
  4. `testEditArticle` : modifie un article, vérifie la modification
  5. `testDeleteArticle` : supprime un article, vérifie qu'il n'apparaît plus

**Résultat attendu** :

```text
Article Crud
 ✔ List page
 ✔ Show page
 ✔ Create article
 ✔ Edit article
 ✔ Delete article
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**La fixture** `src/DataFixtures/ArticleFixtures.php` :

```php
<?php

namespace App\DataFixtures;

use App\Entity\Article;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;

class ArticleFixtures extends Fixture
{
    public function load(ObjectManager $manager): void
    {
        $articles = [
            ['title' => 'Introduction à Symfony', 'content' => 'Symfony est un framework PHP.'],
            ['title' => 'Les bases de PHP', 'content' => 'PHP est un langage serveur.'],
            ['title' => 'Docker pour les débutants', 'content' => 'Docker utilise des conteneurs.'],
        ];

        foreach ($articles as $data) {
            $article = new Article();
            $article->setTitle($data['title']);
            $article->setContent($data['content']);
            $manager->persist($article);
        }

        $manager->flush();
    }
}
```

**Le fichier de test** `tests/Controller/ArticleCrudTest.php` :

```php
<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArticleCrudTest extends WebTestCase
{
    public function testListPage(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/articles');

        // La page s'affiche correctement
        $this->assertResponseIsSuccessful();

        // Les 3 articles des fixtures sont affichés
        $this->assertSelectorCount(3, '.article-card');

        // Le titre de la page est correct
        $this->assertSelectorTextContains('h1', 'Articles');
    }

    public function testShowPage(): void
    {
        $client = static::createClient();

        // Accéder à la liste
        $crawler = $client->request('GET', '/articles');

        // Cliquer sur le premier lien vers un article
        $link = $crawler->filter('.article-card a')->first()->link();
        $client->click($link);

        // La page de détail s'affiche
        $this->assertResponseIsSuccessful();
        $this->assertSelectorExists('h1');
        $this->assertSelectorExists('.article-content');
    }

    public function testCreateArticle(): void
    {
        $client = static::createClient();

        // Accéder au formulaire de création
        $client->request('GET', '/articles/new');
        $this->assertResponseIsSuccessful();

        // Remplir et soumettre le formulaire
        $client->submitForm('Enregistrer', [
            'article[title]' => 'Nouvel article de test',
            'article[content]' => 'Contenu du nouvel article.',
        ]);

        // Vérifier la redirection
        $this->assertResponseRedirects();
        $client->followRedirect();

        // L'article est bien affiché
        $this->assertResponseIsSuccessful();
        $this->assertSelectorTextContains('h1', 'Nouvel article de test');
    }

    public function testEditArticle(): void
    {
        $client = static::createClient();

        // Accéder à la liste, puis au premier article
        $crawler = $client->request('GET', '/articles');
        $link = $crawler->filter('.article-card a')->first()->link();
        $crawler = $client->click($link);

        // Cliquer sur le bouton "Modifier"
        $link = $crawler->selectLink('Modifier')->link();
        $client->click($link);
        $this->assertResponseIsSuccessful();

        // Modifier le titre
        $client->submitForm('Enregistrer', [
            'article[title]' => 'Titre modifié par le test',
        ]);

        // Vérifier la redirection et le nouveau titre
        $this->assertResponseRedirects();
        $client->followRedirect();
        $this->assertSelectorTextContains('h1', 'Titre modifié par le test');
    }

    public function testDeleteArticle(): void
    {
        $client = static::createClient();

        // Compter les articles avant suppression
        $crawler = $client->request('GET', '/articles');
        $countBefore = $crawler->filter('.article-card')->count();

        // Accéder au premier article
        $link = $crawler->filter('.article-card a')->first()->link();
        $crawler = $client->click($link);

        // Soumettre le formulaire de suppression
        $client->submitForm('Supprimer');

        // Vérifier la redirection vers la liste
        $this->assertResponseRedirects('/articles');
        $crawler = $client->followRedirect();

        // Il y a un article de moins
        $countAfter = $crawler->filter('.article-card')->count();
        $this->assertSame($countBefore - 1, $countAfter);
    }
}
```

**Exécution** :

```bash
# Recharger les fixtures et exécuter les tests
docker compose exec php php bin/console doctrine:fixtures:load --env=test --no-interaction
docker compose exec php php bin/phpunit tests/Controller/ArticleCrudTest.php --testdox
```

**Résultat attendu** :

```text
Article Crud
 ✔ List page
 ✔ Show page
 ✔ Create article
 ✔ Edit article
 ✔ Delete article

OK (5 tests, 14 assertions)
```

---

## Navigation

← Fiche précédente : **[API JSON](16-api-json.md)**

→ Fiche suivante : **[Workflow et state machine](18-workflow-state-machine.md)**
