---
tags:
  - Méthodologie
  - Débutant
  - Pratique
description: "03 - Les Tests et la Qualité Logicielle"
estimated_time: "30 min"
fiche_number: 3
total_fiches: 4
cursus: "Développement logiciel"
---

# 03 - Les Tests et la Qualité Logicielle

> **En bref** : À la fin de cette fiche, tu sauras écrire des tests automatisés (unitaires, fonctionnels, d'intégration), mesurer la qualité de ton code, et mettre en place des indicateurs (KPI) pour suivre la qualité logicielle. Lecture estimée : 30 min.


## Prérequis

- Fiche **[02-php/01-introduction-php.md](../../02-php/01-introduction-php.md)** (PHP)
- Fiche **[03-symfony/01-architecture-symfony.md](../../03-symfony/01-architecture-symfony.md)** (Symfony)
- Fiche **[01 - L'Architecture Serveur Web](01-architecture-serveur-web.md)**

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des tests automatisés (unitaires, fonctionnels, d'intégration), mesurer la qualité de ton code, et mettre en place des indicateurs (KPI) pour suivre la qualité logicielle.

---

## Concepts

### Pourquoi tester son code ?

**Le problème que les tests résolvent** :

Sans tests automatisés, voici les problèmes rencontrés :

1. **Régressions** : Une modification casse une fonctionnalité existante sans qu'on le sache.
2. **Peur de modifier** : On n'ose plus toucher au code de peur de tout casser.
3. **Bugs en production** : Les erreurs sont découvertes par les utilisateurs.
4. **Documentation absente** : On ne sait pas comment le code est censé fonctionner.

**Comment les tests résolvent ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Régressions | Les tests échouent si une fonctionnalité casse |
| Peur de modifier | On peut refactorer en confiance |
| Bugs en production | Les bugs sont détectés avant le déploiement |
| Documentation absente | Les tests documentent le comportement attendu |

**Analogie concrète** : Les tests sont comme le contrôle qualité dans une usine. Avant d'expédier un produit, on vérifie qu'il fonctionne. Sans contrôle, des produits défectueux arrivent chez les clients.

---

### Quels sont les types de tests ?

| Type | Ce qu'il teste | Exemple |
| ---- | -------------- | ------- |
| **Unitaire** | Une fonction/classe isolée | `Calculator::add(2, 3)` retourne 5 |
| **Intégration** | Plusieurs composants ensemble | Le repository récupère bien les données en BDD |
| **Fonctionnel** | Une fonctionnalité complète | L'utilisateur peut créer un compte |
| **E2E (End-to-End)** | L'application entière via navigateur | Parcours d'achat complet |

**Pyramide des tests** :

```text
        /\
       /  \        E2E (peu nombreux, lents, fragiles)
      /────\
     /      \      Fonctionnels
    /────────\
   /          \    Intégration
  /────────────\
 /              \  Unitaires (nombreux, rapides, stables)
/________________\
```

**Règle** : Beaucoup de tests unitaires (base solide), moins de tests E2E (coûteux).

---

### Qu'est-ce que la couverture de code ?

**Définition** : La couverture de code (code coverage) mesure le pourcentage de code exécuté par les tests.

| Métrique | Signification |
| -------- | ------------- |
| Line coverage | % de lignes exécutées |
| Branch coverage | % de branches if/else testées |
| Function coverage | % de fonctions appelées |

**Attention** : 100% de couverture ≠ 0 bugs. Un test peut exécuter du code sans vérifier qu'il fonctionne correctement.

**Objectifs réalistes** :

| Contexte | Couverture cible |
| -------- | ---------------- |
| Code critique (paiement, sécurité) | > 90% |
| Code métier principal | > 70% |
| Code utilitaire | > 50% |
| Moyenne projet | > 60% |

---

### Qu'est-ce qu'un KPI de qualité ?

**Définition** : Un KPI (Key Performance Indicator) est un indicateur mesurable qui permet de suivre la qualité du logiciel dans le temps.

**KPIs de qualité courants** :

| KPI | Mesure | Objectif typique |
| --- | ------ | ---------------- |
| Couverture de code | % code testé | > 70% |
| Bugs ouverts | Nombre | < 10 |
| Temps de résolution bug | Jours | < 5 jours |
| Dette technique | Issues SonarQube | < 5 jours |
| Taux d'échec des tests | % tests KO | 0% |
| Temps de build | Minutes | < 10 min |
| Complexité cyclomatique | Score | < 10 par méthode |

---

## Étapes Pratiques

### Étape 1 : Installer PHPUnit pour Symfony

```bash
# Installer PHPUnit
composer require --dev phpunit/phpunit symfony/test-pack

# Vérifier l'installation
php bin/phpunit --version
```

**Structure des tests** :

```text
tests/
├── Unit/              # Tests unitaires
│   └── Service/
│       └── CalculatorTest.php
├── Integration/       # Tests d'intégration
│   └── Repository/
│       └── UserRepositoryTest.php
└── Functional/        # Tests fonctionnels
    └── Controller/
        └── HomeControllerTest.php
```

---

### Étape 2 : Écrire un test unitaire

```php
// tests/Unit/Service/CalculatorTest.php
namespace App\Tests\Unit\Service;

use App\Service\Calculator;
use PHPUnit\Framework\TestCase;

class CalculatorTest extends TestCase
{
    private Calculator $calculator;

    protected function setUp(): void
    {
        // Exécuté avant chaque test
        $this->calculator = new Calculator();
    }

    public function testAdditionDeDeuxNombresPositifs(): void
    {
        // Arrange (préparer)
        $a = 2;
        $b = 3;

        // Act (agir)
        $result = $this->calculator->add($a, $b);

        // Assert (vérifier)
        $this->assertEquals(5, $result);
    }

    public function testAdditionAvecZero(): void
    {
        $result = $this->calculator->add(5, 0);
        $this->assertEquals(5, $result);
    }

    public function testDivisionParZeroLeveUneException(): void
    {
        $this->expectException(\DivisionByZeroError::class);
        $this->calculator->divide(10, 0);
    }

    /**
     * @dataProvider additionProvider
     */
    public function testAdditionAvecDataProvider(int $a, int $b, int $expected): void
    {
        $result = $this->calculator->add($a, $b);
        $this->assertEquals($expected, $result);
    }

    public static function additionProvider(): array
    {
        return [
            'positifs' => [2, 3, 5],
            'négatifs' => [-2, -3, -5],
            'mixte' => [-2, 5, 3],
            'zéros' => [0, 0, 0],
        ];
    }
}
```

```bash
# Lancer les tests
php bin/phpunit

# Lancer un test spécifique
php bin/phpunit tests/Unit/Service/CalculatorTest.php

# Avec couverture de code
php bin/phpunit --coverage-html var/coverage
```

---

### Étape 3 : Écrire un test fonctionnel (Controller)

```php
// tests/Functional/Controller/ArticleControllerTest.php
namespace App\Tests\Functional\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class ArticleControllerTest extends WebTestCase
{
    public function testPageListeArticlesEstAccessible(): void
    {
        // Créer un client HTTP
        $client = static::createClient();

        // Faire une requête GET
        $client->request('GET', '/articles');

        // Vérifier le code de statut
        $this->assertResponseIsSuccessful();
        $this->assertResponseStatusCodeSame(200);
    }

    public function testPageListeContientLeTitre(): void
    {
        $client = static::createClient();
        $crawler = $client->request('GET', '/articles');

        // Vérifier le contenu HTML
        $this->assertSelectorTextContains('h1', 'Liste des articles');
    }

    public function testCreationArticleNecessiteAuthentification(): void
    {
        $client = static::createClient();
        $client->request('GET', '/articles/new');

        // Doit rediriger vers login
        $this->assertResponseRedirects('/login');
    }

    public function testCreationArticleAvecUtilisateurConnecte(): void
    {
        $client = static::createClient();

        // Simuler un utilisateur connecté
        $userRepository = static::getContainer()->get(UserRepository::class);
        $user = $userRepository->findOneBy(['email' => 'admin@test.com']);
        $client->loginUser($user);

        // Accéder au formulaire
        $crawler = $client->request('GET', '/articles/new');
        $this->assertResponseIsSuccessful();

        // Remplir et soumettre le formulaire
        $form = $crawler->selectButton('Créer')->form([
            'article[title]' => 'Mon article de test',
            'article[content]' => 'Contenu de test',
        ]);
        $client->submit($form);

        // Vérifier la redirection après création
        $this->assertResponseRedirects('/articles');
    }
}
```

---

### Étape 4 : Écrire un test d'intégration (Repository)

```php
// tests/Integration/Repository/ArticleRepositoryTest.php
namespace App\Tests\Integration\Repository;

use App\Entity\Article;
use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Test\KernelTestCase;

class ArticleRepositoryTest extends KernelTestCase
{
    private ArticleRepository $repository;

    protected function setUp(): void
    {
        // Démarrer le kernel Symfony
        self::bootKernel();

        // Récupérer le repository depuis le container
        $this->repository = static::getContainer()->get(ArticleRepository::class);
    }

    public function testTrouverArticlesPublies(): void
    {
        $articles = $this->repository->findPublished();

        $this->assertIsArray($articles);
        foreach ($articles as $article) {
            $this->assertTrue($article->isPublished());
        }
    }

    public function testRechercheParTitre(): void
    {
        $articles = $this->repository->searchByTitle('Symfony');

        $this->assertNotEmpty($articles);
        foreach ($articles as $article) {
            $this->assertStringContainsString('Symfony', $article->getTitle());
        }
    }
}
```

---

### Étape 5 : Configurer la couverture de code

```xml
<!-- phpunit.xml.dist -->
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         colors="true"
         bootstrap="tests/bootstrap.php">

    <testsuites>
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>
        <testsuite name="Functional">
            <directory>tests/Functional</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory suffix=".php">src</directory>
        </include>
        <exclude>
            <directory>src/DataFixtures</directory>
            <file>src/Kernel.php</file>
        </exclude>
    </source>
</phpunit>
```

```bash
# Générer le rapport de couverture
php bin/phpunit --coverage-html var/coverage

# Voir le rapport
open var/coverage/index.html
```

---

### Étape 6 : Mettre en place des KPIs

```markdown
## Tableau de bord qualité

### Métriques automatiques (CI/CD)

| KPI | Mesure | Seuil | Actuel |
| --- | ------ | ----- | ------ |
| Couverture de code | PHPUnit | > 70% | 75% ✅ |
| Tests passants | PHPUnit | 100% | 100% ✅ |
| Bugs SonarQube | SonarQube | 0 | 2 ⚠️ |
| Code smells | SonarQube | < 10 | 5 ✅ |
| Duplication | SonarQube | < 3% | 1.2% ✅ |

### Métriques manuelles (hebdomadaire)

| KPI | Mesure | Seuil | Actuel |
| --- | ------ | ----- | ------ |
| Bugs ouverts | Jira | < 10 | 7 ✅ |
| Temps résolution bug critique | Jira | < 24h | 18h ✅ |
| Code review en attente | GitLab | < 3 | 1 ✅ |
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `php bin/phpunit` | Lancer tous les tests |
| `php bin/phpunit --filter=testAdd` | Lancer les tests contenant "testAdd" |
| `php bin/phpunit --testsuite=Unit` | Lancer uniquement les tests unitaires |
| `php bin/phpunit --coverage-html var/coverage` | Générer rapport de couverture |
| `php bin/phpunit --stop-on-failure` | S'arrêter au premier échec |

---

## Pièges Fréquents

### Piège 1 : Tester l'implémentation, pas le comportement

⚠️ **Problème** : Le test casse à chaque refactoring même si le comportement est correct.

✅ **Solution** : Tester les entrées/sorties, pas les détails internes.

```php
// ❌ Teste l'implémentation
$this->assertEquals(['a', 'b'], $object->getPrivateArray());

// ✅ Teste le comportement
$this->assertTrue($object->contains('a'));
```

---

### Piège 2 : Tests trop longs et complexes

⚠️ **Problème** : Un test de 100 lignes est difficile à comprendre et maintenir.

✅ **Solution** : Un test = un comportement. Découper en plusieurs tests.

---

### Piège 3 : Ne pas utiliser de fixtures cohérentes

⚠️ **Problème** : Les tests fonctionnels échouent car la base de données est vide ou incohérente.

✅ **Solution** : Charger des fixtures avant les tests d'intégration.

---

### Piège 4 : Viser 100% de couverture à tout prix

⚠️ **Problème** : Des tests inutiles pour atteindre un chiffre.

✅ **Solution** : Tester ce qui a de la valeur. Getters/setters simples = pas besoin de tests.

---

## Checklist de Validation

- [ ] Je comprends la différence entre tests unitaires, d'intégration et fonctionnels
- [ ] Je sais écrire un test PHPUnit avec Arrange/Act/Assert
- [ ] Je sais utiliser les data providers
- [ ] Je sais tester un controller Symfony
- [ ] Je sais générer un rapport de couverture
- [ ] Je connais les KPIs de qualité logicielle

---

## Exercice Pratique

**Énoncé** : Écris les tests pour une classe `PasswordValidator` qui doit :

- Accepter les mots de passe de 12+ caractères
- Refuser si pas de majuscule
- Refuser si pas de chiffre

**Résultat attendu** : 5 tests minimum couvrant les cas valides et invalides.

---

## Solution de l'Exercice

```php
// tests/Unit/Service/PasswordValidatorTest.php
class PasswordValidatorTest extends TestCase
{
    private PasswordValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new PasswordValidator();
    }

    public function testMotDePasseValide(): void
    {
        $result = $this->validator->isValid('MonMotDePasse1');
        $this->assertTrue($result);
    }

    public function testRefuseSiTropCourt(): void
    {
        $result = $this->validator->isValid('Court1A');
        $this->assertFalse($result);
    }

    public function testRefuseSiPasDeMajuscule(): void
    {
        $result = $this->validator->isValid('motdepasse123');
        $this->assertFalse($result);
    }

    public function testRefuseSiPasDeChiffre(): void
    {
        $result = $this->validator->isValid('MotDePasseSansChiffre');
        $this->assertFalse($result);
    }

    /**
     * @dataProvider invalidPasswordProvider
     */
    public function testMotsDePasseInvalides(string $password, string $reason): void
    {
        $result = $this->validator->isValid($password);
        $this->assertFalse($result, "Devrait refuser : $reason");
    }

    public static function invalidPasswordProvider(): array
    {
        return [
            ['court1A', 'trop court'],
            ['motdepasselongmaispasdemajuscule1', 'pas de majuscule'],
            ['MotDePasseSansChiffre', 'pas de chiffre'],
            ['', 'vide'],
            ['           ', 'espaces uniquement'],
        ];
    }
}
```

---

## Navigation

← Fiche précédente : **[02 - La Sécurité et l'Authentification Web](02-securite-authentification.md)**

→ Fiche suivante : **[04 - Les Applications Mobiles et Desktop](04-applications-mobiles.md)**
