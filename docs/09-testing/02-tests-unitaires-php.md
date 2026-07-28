---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Apprendre à écrire des tests unitaires PHP avec PHPUnit : assertions, data providers, setUp/tearDown."
estimated_time: "90 min"
fiche_number: 2
total_fiches: 15
cursus: "Testing et Qualité"
---

# 02 - Tests unitaires PHP (PHPUnit)

> **En bref** : Cette fiche te guide dans l'installation et l'utilisation de PHPUnit pour écrire des tests unitaires PHP avec assertions, data providers et méthodes de cycle de vie. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Pourquoi tester](01-pourquoi-tester.md)** (concepts de base des tests)
- PHP 8.3 installé
- Composer installé
- Savoir créer un projet PHP avec Composer

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer PHPUnit, écrire des tests unitaires avec des assertions variées, utiliser les data providers pour tester plusieurs cas et organiser tes tests avec setUp/tearDown.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que PHPUnit ?

**Définition** : PHPUnit est le framework de tests unitaires standard pour PHP. Il fournit des outils pour écrire, organiser et exécuter des tests automatisés. Cette fiche utilise **PHPUnit 11** (ligne encore courante avec Symfony 7.4 et de nombreux projets existants). Des versions plus récentes existent (12.x, 13.x) : la commande `composer show phpunit/phpunit` indique la version réellement installée ; adapte les sorties d'exemple si le numéro de version diffère.

**Le problème que PHPUnit résout** :

Sans PHPUnit, voici les problèmes rencontrés :

1. **Code de test artisanal** : Tu dois écrire tes propres fonctions de vérification (comme dans la fiche 01). C'est répétitif et limité.
2. **Pas de rapport structuré** : Tu affiches des messages avec `echo`, mais tu n'as pas de rapport clair avec le nombre de tests passés, échoués et les détails des erreurs.
3. **Pas d'outillage** : Tu ne peux pas facilement lancer un sous-ensemble de tests, générer un rapport de couverture ou intégrer les tests dans un pipeline CI/CD.

**Comment PHPUnit résout ces problèmes** :

| Problème | Solution apportée par PHPUnit |
| --- | --- |
| Code artisanal | Des dizaines d'assertions prêtes à l'emploi (assertEquals, assertTrue, etc.) |
| Pas de rapport structuré | Rapport détaillé avec nombre de tests, assertions, erreurs et temps d'exécution |
| Pas d'outillage | Filtrage par groupe, couverture de code, formats de sortie multiples |

**Analogie concrète** : Écrire des tests sans PHPUnit, c'est comme mesurer des distances avec tes pas. Ça fonctionne, mais c'est imprécis et fastidieux. PHPUnit est un mètre laser : précis, rapide et avec des fonctionnalités avancées (mesure d'angle, mémoire des mesures).

**Ce que PHPUnit n'est PAS** :

- PHPUnit n'est pas un outil de test d'intégration (même si on peut l'utiliser pour ça). Son rôle principal est le test unitaire.
- PHPUnit n'est pas un outil de test E2E. Il ne peut pas ouvrir un navigateur.

---

### Qu'est-ce qu'une assertion ?

**Définition** : Une assertion est une vérification qui compare un résultat obtenu avec un résultat attendu. Si la comparaison échoue, le test échoue.

**Le problème que les assertions résolvent** :

Sans assertions standardisées, voici les problèmes rencontrés :

1. **Comparaisons manuelles** : Tu écris des `if ($resultat === $attendu)` partout. C'est verbeux et les messages d'erreur ne sont pas clairs.
2. **Messages d'erreur peu utiles** : Quand un test échoue, tu vois juste "ECHEC" sans savoir quelle valeur tu as obtenue ni quelle valeur tu attendais.

**Comment les assertions résolvent ces problèmes** :

| Problème | Solution apportée par les assertions |
| --- | --- |
| Comparaisons manuelles | Une seule ligne : `$this->assertEquals(5, $resultat)` |
| Messages d'erreur peu utiles | Message détaillé : "Failed asserting that 4 matches expected 5" |

**Analogie concrète** : Une assertion, c'est comme une balance de précision dans un laboratoire. Tu poses l'échantillon (résultat obtenu) et tu compares avec le poids de référence (résultat attendu). Si ça ne correspond pas, la balance affiche exactement l'écart.

**Assertions les plus utilisées dans PHPUnit** :

| Assertion | Vérifie que... | Exemple |
| --- | --- | --- |
| `assertEquals($attendu, $obtenu)` | Les deux valeurs sont égales (==) | `assertEquals(5, $calc->add(2, 3))` |
| `assertSame($attendu, $obtenu)` | Les deux valeurs sont identiques (===) | `assertSame(5, $result)` (vérifie aussi le type) |
| `assertTrue($valeur)` | La valeur est `true` | `assertTrue($user->isActive())` |
| `assertFalse($valeur)` | La valeur est `false` | `assertFalse($user->isAdmin())` |
| `assertNull($valeur)` | La valeur est `null` | `assertNull($repo->find(999))` |
| `assertCount($nombre, $tableau)` | Le tableau contient N éléments | `assertCount(3, $users)` |
| `assertContains($element, $tableau)` | Le tableau contient l'élément | `assertContains('admin', $roles)` |
| `assertStringContainsString($needle, $haystack)` | La chaîne contient la sous-chaîne | `assertStringContainsString('erreur', $message)` |
| `assertInstanceOf($classe, $objet)` | L'objet est une instance de la classe | `assertInstanceOf(User::class, $entity)` |
| `assertEmpty($valeur)` | La valeur est vide | `assertEmpty($errors)` |

**Différence entre assertEquals et assertSame** :

| assertEquals (==) | assertSame (===) |
| --- | --- |
| Compare les valeurs | Compare les valeurs ET les types |
| `assertEquals(5, "5")` passe | `assertSame(5, "5")` échoue |
| `assertEquals(0, false)` passe | `assertSame(0, false)` échoue |
| Utiliser pour les comparaisons souples | Utiliser pour les comparaisons strictes |

---

Le diagramme suivant montre la structure AAA (Arrange-Act-Assert) que chaque test unitaire doit suivre.

```mermaid
flowchart LR
    arrange[Arrange<br>Préparer les données] --> act[Act<br>Exécuter l'action]
    act --> assert[Assert<br>Vérifier le résultat]
```

### Qu'est-ce qu'un data provider ?

**Définition** : Un data provider est une méthode qui fournit plusieurs jeux de données à un même test. Au lieu d'écrire 5 tests similaires, tu écris 1 test et 1 data provider qui contient 5 jeux de données.

**Le problème que les data providers résolvent** :

Sans data providers, voici les problèmes rencontrés :

1. **Code dupliqué** : Tu copies-colles le même test en changeant juste les valeurs. Si tu veux ajouter une assertion, tu dois la modifier dans 5 tests.
2. **Tests incomplets** : Le copier-coller est fastidieux, donc tu ne testes que 2 cas au lieu de 10.

**Comment les data providers résolvent ces problèmes** :

| Problème | Solution apportée par les data providers |
| --- | --- |
| Code dupliqué | Un seul test, les données varient automatiquement |
| Tests incomplets | Ajouter un cas = ajouter une ligne au data provider |

**Analogie concrète** : Tu testes une machine à café. Au lieu de faire un test par boisson (un pour espresso, un pour cappuccino, un pour latte), tu prépares une liste de boissons et tu fais passer chaque boisson dans la même procédure de test. Le data provider est la liste de boissons.

---

### Qu'est-ce que setUp et tearDown ?

**Définition** : `setUp()` est une méthode exécutée automatiquement avant chaque test. `tearDown()` est exécutée automatiquement après chaque test. Elles servent à préparer et nettoyer l'environnement de test.

**Le problème que setUp/tearDown résolvent** :

Sans setUp/tearDown, voici les problèmes rencontrés :

1. **Initialisation répétée** : Tu crées les mêmes objets au début de chaque test.
2. **Tests interdépendants** : Un test modifie un objet partagé et le test suivant reçoit un objet dans un état imprévu.

**Comment setUp/tearDown résolvent ces problèmes** :

| Problème | Solution apportée par setUp/tearDown |
| --- | --- |
| Initialisation répétée | setUp() crée les objets une seule fois, réutilisés par chaque test |
| Tests interdépendants | Chaque test reçoit des objets neufs grâce à setUp() |

**Analogie concrète** : Dans un restaurant, avant chaque client (test), le serveur met une nappe propre et des couverts neufs (`setUp`). Après chaque client, il débarrasse et nettoie la table (`tearDown`). Chaque client a une table dans le même état initial.

**Cycle de vie complet** :

```text
Pour chaque méthode de test :
  1. setUp()           → Prépare l'environnement
  2. testMethode()     → Exécute le test
  3. tearDown()        → Nettoie l'environnement
```

---

### Qu'est-ce que expectException ?

**Définition** : `expectException()` est une méthode PHPUnit qui indique qu'un test doit lancer une exception spécifique. Si l'exception n'est pas lancée, le test échoue.

**Le problème que expectException résout** :

Sans expectException, voici les problèmes rencontrés :

1. **Try-catch manuels** : Tu entoures le code d'un try-catch et tu vérifies manuellement le type d'exception. C'est verbeux.
2. **Oubli de vérification** : Tu oublies de faire échouer le test si l'exception n'est pas lancée.

**Comment expectException résout ces problèmes** :

| Problème | Solution apportée par expectException |
| --- | --- |
| Try-catch manuels | Une seule ligne : `$this->expectException(\InvalidArgumentException::class)` |
| Oubli de vérification | PHPUnit échoue automatiquement si l'exception n'est pas lancée |

---

## Étapes Pratiques

### Étape 1 : Créer un projet PHP avec PHPUnit

Crée un dossier de projet et initialise Composer :

```bash
# Crée le dossier du projet
mkdir testing-demo && cd testing-demo

# Initialise Composer (accepte les valeurs par défaut)
composer init --name="demo/testing" --type="project" --no-interaction

# Installe PHPUnit 11 comme dépendance de développement
composer require --dev phpunit/phpunit:^11.0
```

**Résultat attendu** :

```text
./composer.json has been created
...
Installing phpunit/phpunit (11.x.x)
```

---

### Étape 2 : Configurer PHPUnit

Crée le fichier de configuration `phpunit.xml` à la racine du projet :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- phpunit.xml -->
<!-- Configuration de PHPUnit pour le projet -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         failOnWarning="true"
         failOnRisky="true">

    <!-- Dossier contenant les tests -->
    <testsuites>
        <testsuite name="Unit">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <!-- Dossier contenant le code source (pour la couverture) -->
    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

Crée les dossiers `src` et `tests` :

```bash
mkdir src tests
```

Configure l'autoloading PSR-4 dans `composer.json` :

```json
{
    "autoload": {
        "psr-4": {
            "App\\": "src/"
        }
    },
    "autoload-dev": {
        "psr-4": {
            "App\\Tests\\": "tests/"
        }
    }
}
```

Régénère l'autoloader :

```bash
composer dump-autoload
```

**Résultat attendu** :

```text
Generating autoload files
Generated autoload files
```

---

### Étape 3 : Écrire la première classe à tester

Crée le fichier `src/Calculator.php` :

```php
<?php
// src/Calculator.php
// Classe Calculator avec des méthodes mathématiques de base

namespace App;

class Calculator
{
    // Additionne deux nombres
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    // Soustrait le second nombre du premier
    public function subtract(float $a, float $b): float
    {
        return $a - $b;
    }

    // Multiplie deux nombres
    public function multiply(float $a, float $b): float
    {
        return $a * $b;
    }

    // Divise le premier nombre par le second
    // Lève une exception si le diviseur est zéro
    public function divide(float $a, float $b): float
    {
        if ($b === 0.0) {
            throw new \InvalidArgumentException("Division par zéro impossible");
        }

        return $a / $b;
    }

    // Calcule la moyenne d'un tableau de nombres
    // Lève une exception si le tableau est vide
    public function average(array $numbers): float
    {
        if (empty($numbers)) {
            throw new \InvalidArgumentException("Le tableau ne doit pas être vide");
        }

        // array_sum additionne tous les éléments du tableau
        // count retourne le nombre d'éléments
        return array_sum($numbers) / count($numbers);
    }
}
```

---

### Étape 4 : Écrire le premier test PHPUnit

Crée le fichier `tests/CalculatorTest.php` :

```php
<?php
// tests/CalculatorTest.php
// Tests unitaires de la classe Calculator

namespace App\Tests;

// On importe la classe de base de PHPUnit
use PHPUnit\Framework\TestCase;
// On importe la classe à tester
use App\Calculator;

// La classe de test doit :
// 1. Étendre TestCase
// 2. Avoir un nom qui finit par "Test"
class CalculatorTest extends TestCase
{
    // Propriété qui contiendra l'objet Calculator
    private Calculator $calculator;

    // setUp() est exécuté avant CHAQUE test
    // On crée un nouvel objet Calculator pour chaque test
    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    // Chaque méthode de test doit commencer par "test"
    public function testAddReturnsCorrectSum(): void
    {
        // ARRANGE : les données sont prêtes (setUp a créé le calculator)
        // ACT : on exécute l'action
        $result = $this->calculator->add(2, 3);

        // ASSERT : on vérifie le résultat
        // assertEquals vérifie que $result est égal à 5
        $this->assertEquals(5, $result);
    }

    public function testAddWithNegativeNumbers(): void
    {
        $result = $this->calculator->add(-1, -3);

        $this->assertEquals(-4, $result);
    }

    public function testAddWithZero(): void
    {
        $result = $this->calculator->add(0, 5);

        $this->assertEquals(5, $result);
    }

    public function testSubtractReturnsCorrectDifference(): void
    {
        $result = $this->calculator->subtract(10, 3);

        $this->assertEquals(7, $result);
    }

    public function testMultiplyReturnsCorrectProduct(): void
    {
        $result = $this->calculator->multiply(4, 3);

        $this->assertEquals(12, $result);
    }

    public function testMultiplyByZeroReturnsZero(): void
    {
        $result = $this->calculator->multiply(5, 0);

        $this->assertEquals(0, $result);
    }

    public function testDivideReturnsCorrectQuotient(): void
    {
        $result = $this->calculator->divide(10, 2);

        $this->assertEquals(5, $result);
    }

    // Test qu'une exception est levée quand on divise par zéro
    public function testDivideByZeroThrowsException(): void
    {
        // On indique à PHPUnit qu'une exception doit être levée
        $this->expectException(\InvalidArgumentException::class);

        // On indique le message attendu de l'exception
        $this->expectExceptionMessage("Division par zéro impossible");

        // Cette ligne doit lancer l'exception
        $this->calculator->divide(10, 0);
    }
}
```

---

### Étape 5 : Lancer les tests

```bash
# Lance tous les tests du projet
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

........                                                            8 / 8 (100%)

Time: 00:00.012, Memory: 8.00 MB

OK (8 tests, 9 assertions)
```

Chaque point `.` représente un test qui passe. Le `8 / 8 (100%)` indique que 8 tests sur 8 ont été exécutés.

---

### Étape 6 : Utiliser les data providers

Ajoute un test avec data provider dans `tests/CalculatorTest.php` :

```php
<?php
// Ajoute ces méthodes dans la classe CalculatorTest

// Le data provider retourne un tableau de tableaux
// Chaque sous-tableau contient les arguments du test
// Format : [valeur_attendue, premier_nombre, second_nombre]
public static function additionProvider(): array
{
    return [
        'deux nombres positifs' => [5, 2, 3],
        'nombre négatif et positif' => [4, -1, 5],
        'deux nombres négatifs' => [-8, -3, -5],
        'addition avec zéro' => [7, 7, 0],
        'nombres décimaux' => [3.5, 1.5, 2.0],
        'grands nombres' => [1000000, 999999, 1],
    ];
}

// L'attribut #[DataProvider] lie le test au data provider
// PHPUnit exécute ce test une fois par jeu de données
#[\PHPUnit\Framework\Attributes\DataProvider('additionProvider')]
public function testAddWithDataProvider(
    float $expected,
    float $a,
    float $b
): void {
    $result = $this->calculator->add($a, $b);

    $this->assertEquals($expected, $result);
}

// Data provider pour la division
public static function divisionProvider(): array
{
    return [
        'division simple' => [5.0, 10, 2],
        'division avec reste' => [3.33, 10, 3],
        'division par un' => [7.0, 7, 1],
        'division nombre négatif' => [-5.0, -10, 2],
    ];
}

#[\PHPUnit\Framework\Attributes\DataProvider('divisionProvider')]
public function testDivideWithDataProvider(
    float $expected,
    float $a,
    float $b
): void {
    $result = $this->calculator->divide($a, $b);

    // On utilise le 3e paramètre (delta) pour les comparaisons de flottants
    // 0.01 signifie : accepte une différence de 0.01 maximum
    $this->assertEqualsWithDelta($expected, $result, 0.01);
}
```

Relance les tests :

```bash
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

..................                                                18 / 18 (100%)

Time: 00:00.015, Memory: 8.00 MB

OK (18 tests, 19 assertions)
```

---

### Étape 7 : Tester les exceptions

Crée un nouveau fichier `tests/AverageTest.php` pour tester la méthode `average` :

```php
<?php
// tests/AverageTest.php
// Tests de la méthode average de Calculator

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\Calculator;

class AverageTest extends TestCase
{
    private Calculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new Calculator();
    }

    public function testAverageOfThreeNumbers(): void
    {
        // La moyenne de [2, 4, 6] est (2+4+6)/3 = 4
        $result = $this->calculator->average([2, 4, 6]);

        $this->assertEquals(4.0, $result);
    }

    public function testAverageOfOneNumber(): void
    {
        // La moyenne d'un seul nombre est ce nombre lui-même
        $result = $this->calculator->average([42]);

        $this->assertEquals(42.0, $result);
    }

    public function testAverageWithNegativeNumbers(): void
    {
        // La moyenne de [-2, 2] est 0
        $result = $this->calculator->average([-2, 2]);

        $this->assertEquals(0.0, $result);
    }

    public function testAverageOfEmptyArrayThrowsException(): void
    {
        // On s'attend à une exception InvalidArgumentException
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("Le tableau ne doit pas être vide");

        // Un tableau vide doit lever une exception
        $this->calculator->average([]);
    }
}
```

```bash
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

......................                                            22 / 22 (100%)

Time: 00:00.018, Memory: 8.00 MB

OK (22 tests, 23 assertions)
```

---

### Étape 8 : Tester une classe plus complexe

Crée `src/PasswordValidator.php` :

```php
<?php
// src/PasswordValidator.php
// Valide la force d'un mot de passe selon des règles précises

namespace App;

class PasswordValidator
{
    // Longueur minimale requise
    private const MIN_LENGTH = 8;

    // Valide un mot de passe et retourne un tableau d'erreurs
    // Si le tableau est vide, le mot de passe est valide
    public function validate(string $password): array
    {
        $errors = [];

        // Règle 1 : longueur minimale
        if (mb_strlen($password) < self::MIN_LENGTH) {
            $errors[] = "Le mot de passe doit contenir au moins 8 caractères";
        }

        // Règle 2 : au moins une majuscule
        if (!preg_match('/[A-Z]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins une majuscule";
        }

        // Règle 3 : au moins une minuscule
        if (!preg_match('/[a-z]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins une minuscule";
        }

        // Règle 4 : au moins un chiffre
        if (!preg_match('/[0-9]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins un chiffre";
        }

        // Règle 5 : au moins un caractère spécial
        if (!preg_match('/[^a-zA-Z0-9]/', $password)) {
            $errors[] = "Le mot de passe doit contenir au moins un caractère spécial";
        }

        return $errors;
    }

    // Vérifie si un mot de passe est valide (aucune erreur)
    public function isValid(string $password): bool
    {
        return empty($this->validate($password));
    }
}
```

Crée `tests/PasswordValidatorTest.php` :

```php
<?php
// tests/PasswordValidatorTest.php
// Tests complets du validateur de mot de passe

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\PasswordValidator;

class PasswordValidatorTest extends TestCase
{
    private PasswordValidator $validator;

    protected function setUp(): void
    {
        $this->validator = new PasswordValidator();
    }

    // --- Tests de isValid() ---

    public function testValidPassword(): void
    {
        // Un mot de passe qui respecte toutes les règles
        $this->assertTrue($this->validator->isValid('Abcdef1!'));
    }

    public function testPasswordTooShort(): void
    {
        // Un mot de passe de 7 caractères (minimum requis : 8)
        $this->assertFalse($this->validator->isValid('Ab1!xyz'));
    }

    public function testPasswordWithoutUppercase(): void
    {
        // Pas de majuscule
        $this->assertFalse($this->validator->isValid('abcdef1!'));
    }

    public function testPasswordWithoutLowercase(): void
    {
        // Pas de minuscule
        $this->assertFalse($this->validator->isValid('ABCDEF1!'));
    }

    public function testPasswordWithoutDigit(): void
    {
        // Pas de chiffre
        $this->assertFalse($this->validator->isValid('Abcdefg!'));
    }

    public function testPasswordWithoutSpecialChar(): void
    {
        // Pas de caractère spécial
        $this->assertFalse($this->validator->isValid('Abcdefg1'));
    }

    // --- Tests de validate() pour vérifier les messages d'erreur ---

    public function testValidateReturnsEmptyArrayForValidPassword(): void
    {
        $errors = $this->validator->validate('Abcdef1!');

        // Aucune erreur pour un mot de passe valide
        $this->assertEmpty($errors);
    }

    public function testValidateReturnsCorrectErrorForShortPassword(): void
    {
        $errors = $this->validator->validate('Ab1!');

        // Le message d'erreur pour mot de passe trop court doit être présent
        $this->assertContains(
            "Le mot de passe doit contenir au moins 8 caractères",
            $errors
        );
    }

    public function testValidateReturnsMultipleErrors(): void
    {
        // Un mot de passe vide viole toutes les règles
        $errors = $this->validator->validate('');

        // On vérifie qu'il y a 5 erreurs (une par règle)
        $this->assertCount(5, $errors);
    }

    public function testValidateReturnsCorrectErrorForMissingUppercase(): void
    {
        $errors = $this->validator->validate('abcdef1!');

        $this->assertContains(
            "Le mot de passe doit contenir au moins une majuscule",
            $errors
        );
    }

    // --- Data provider pour tester plusieurs mots de passe valides ---

    public static function validPasswordProvider(): array
    {
        return [
            'minimum requis' => ['Abcdef1!'],
            'mot de passe long' => ['MonSuperMotDePasse123!'],
            'caractères spéciaux variés' => ['Test@2024#'],
            'avec underscore' => ['Hello_World1'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('validPasswordProvider')]
    public function testValidPasswords(string $password): void
    {
        $this->assertTrue(
            $this->validator->isValid($password),
            "Le mot de passe '$password' devrait être valide"
        );
    }

    // --- Data provider pour tester plusieurs mots de passe invalides ---

    public static function invalidPasswordProvider(): array
    {
        return [
            'trop court' => ['Ab1!', 1],          // 1 erreur minimum attendue
            'sans majuscule' => ['abcdef1!', 1],
            'sans minuscule' => ['ABCDEF1!', 1],
            'sans chiffre' => ['Abcdefg!', 1],
            'sans spécial' => ['Abcdefg1', 1],
            'vide' => ['', 5],                     // 5 erreurs attendues
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('invalidPasswordProvider')]
    public function testInvalidPasswords(
        string $password,
        int $minErrors
    ): void {
        $errors = $this->validator->validate($password);

        // On vérifie qu'il y a au moins le nombre d'erreurs attendu
        $this->assertGreaterThanOrEqual(
            $minErrors,
            count($errors),
            "Le mot de passe '$password' devrait avoir au moins $minErrors erreur(s)"
        );
    }
}
```

```bash
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

..................................                                34 / 34 (100%)

Time: 00:00.025, Memory: 8.00 MB

OK (34 tests, 35 assertions)
```

---

### Étape 9 : Options utiles de la ligne de commande

```bash
# Lancer un seul fichier de test
./vendor/bin/phpunit tests/CalculatorTest.php

# Filtrer par nom de méthode
./vendor/bin/phpunit --filter testAddReturnsCorrectSum

# Affichage verbeux (nom de chaque test)
./vendor/bin/phpunit --testdox

# Arrêter au premier échec
./vendor/bin/phpunit --stop-on-failure
```

**Résultat attendu avec --testdox** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

Calculator
 ✔ Add returns correct sum
 ✔ Add with negative numbers
 ✔ Add with zero
 ✔ Subtract returns correct difference
 ✔ Multiply returns correct product
 ✔ Multiply by zero returns zero
 ✔ Divide returns correct quotient
 ✔ Divide by zero throws exception
 ✔ Add with data provider with data set "deux nombres positifs"
 ...

OK (34 tests, 35 assertions)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `composer require --dev phpunit/phpunit:^11.0` | Installer PHPUnit 11 |
| `./vendor/bin/phpunit` | Lancer tous les tests |
| `./vendor/bin/phpunit tests/FichierTest.php` | Lancer un seul fichier de test |
| `./vendor/bin/phpunit --filter nomDuTest` | Lancer un test spécifique |
| `./vendor/bin/phpunit --testdox` | Affichage lisible des résultats |
| `./vendor/bin/phpunit --stop-on-failure` | Stopper au premier échec |
| `./vendor/bin/phpunit --colors=always` | Forcer les couleurs dans le terminal |
| `composer dump-autoload` | Régénérer l'autoloader Composer |

---

## Pièges Fréquents

### Piège 1 : Oublier le namespace dans le fichier de test

**Problème** : Tu crées un test sans namespace et PHPUnit ne trouve pas la classe à tester.

**Solution** : Vérifie que :

- Le fichier de test a le bon namespace (`App\Tests`)
- L'autoloading PSR-4 est configuré dans `composer.json`
- Tu as lancé `composer dump-autoload` après avoir modifié le `composer.json`

```php
<?php
// ❌ Incorrect : pas de namespace
use PHPUnit\Framework\TestCase;

// ✅ Correct : namespace conforme à l'autoloading
namespace App\Tests;

use PHPUnit\Framework\TestCase;
```

---

### Piège 2 : Utiliser assertEquals pour comparer des flottants

**Problème** : `assertEquals(0.3, 0.1 + 0.2)` échoue à cause de la précision des flottants en PHP. `0.1 + 0.2` donne `0.30000000000000004`.

**Solution** : Utiliser `assertEqualsWithDelta` avec une tolérance :

```php
// ❌ Peut échouer
$this->assertEquals(0.3, 0.1 + 0.2);

// ✅ Correct : tolérance de 0.0001
$this->assertEqualsWithDelta(0.3, 0.1 + 0.2, 0.0001);
```

---

### Piège 3 : Mettre expectException après le code qui lève l'exception

**Problème** : Tu places `expectException` après l'appel qui lève l'exception. PHPUnit ne sait pas que l'exception est attendue et le test échoue.

**Solution** : Toujours placer `expectException` AVANT le code qui lève l'exception.

```php
// ❌ Incorrect : expectException après l'appel
$this->calculator->divide(10, 0);
$this->expectException(\InvalidArgumentException::class);

// ✅ Correct : expectException avant l'appel
$this->expectException(\InvalidArgumentException::class);
$this->calculator->divide(10, 0);
```

---

### Piège 4 : Tests qui dépendent les uns des autres

**Problème** : Le test B s'attend à ce que le test A ait modifié un objet partagé. Si le test A est lancé seul, le test B échoue.

**Solution** : Chaque test doit être indépendant. Utilise `setUp()` pour créer des objets neufs avant chaque test.

---

## Checklist de Validation

- [ ] J'ai installé PHPUnit 11 avec Composer
- [ ] J'ai configuré `phpunit.xml` et l'autoloading PSR-4
- [ ] Je sais écrire un test avec assertEquals, assertTrue, assertFalse
- [ ] Je sais tester les exceptions avec expectException
- [ ] Je sais utiliser les data providers pour tester plusieurs cas
- [ ] Je comprends le rôle de setUp() et tearDown()
- [ ] Je sais lancer les tests et lire le rapport de résultats
- [ ] Tous mes tests passent avec `./vendor/bin/phpunit`

---

## Exercice Pratique

**Énoncé** : Crée une classe `App\ShoppingCart` avec les méthodes suivantes, puis écris une suite complète de tests PHPUnit :

1. `addItem(string $name, float $price, int $quantity): void` - ajoute un article au panier
2. `removeItem(string $name): void` - supprime un article du panier (lève une exception si l'article n'existe pas)
3. `getTotal(): float` - retourne le prix total du panier
4. `getItemCount(): int` - retourne le nombre total d'articles
5. `isEmpty(): bool` - retourne `true` si le panier est vide
6. `clear(): void` - vide le panier

**Indications** :

- Utilise un tableau associatif pour stocker les articles
- Écris au minimum 12 tests
- Utilise un data provider pour tester `addItem` avec différents articles
- Utilise `setUp()` pour créer un panier neuf avant chaque test
- Teste les cas limites : panier vide, article inexistant, prix à zéro
- Teste l'exception de `removeItem` quand l'article n'existe pas

**Résultat attendu** : Tous les tests passent avec `./vendor/bin/phpunit`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/ShoppingCart.php
// Panier d'achat simple

namespace App;

class ShoppingCart
{
    // Tableau associatif : nom => ['price' => float, 'quantity' => int]
    private array $items = [];

    // Ajoute un article au panier
    // Si l'article existe déjà, on augmente la quantité
    public function addItem(string $name, float $price, int $quantity): void
    {
        if ($quantity <= 0) {
            throw new \InvalidArgumentException("La quantité doit être supérieure à 0");
        }

        if ($price < 0) {
            throw new \InvalidArgumentException("Le prix ne peut pas être négatif");
        }

        if (isset($this->items[$name])) {
            // L'article existe déjà : on augmente la quantité
            $this->items[$name]['quantity'] += $quantity;
        } else {
            // Nouvel article
            $this->items[$name] = [
                'price' => $price,
                'quantity' => $quantity,
            ];
        }
    }

    // Supprime un article du panier
    // Lève une exception si l'article n'existe pas
    public function removeItem(string $name): void
    {
        if (!isset($this->items[$name])) {
            throw new \InvalidArgumentException("L'article '$name' n'existe pas dans le panier");
        }

        unset($this->items[$name]);
    }

    // Retourne le prix total du panier
    public function getTotal(): float
    {
        $total = 0.0;

        foreach ($this->items as $item) {
            // Prix = prix unitaire × quantité
            $total += $item['price'] * $item['quantity'];
        }

        return $total;
    }

    // Retourne le nombre total d'articles (somme des quantités)
    public function getItemCount(): int
    {
        $count = 0;

        foreach ($this->items as $item) {
            $count += $item['quantity'];
        }

        return $count;
    }

    // Retourne true si le panier est vide
    public function isEmpty(): bool
    {
        return empty($this->items);
    }

    // Vide le panier
    public function clear(): void
    {
        $this->items = [];
    }
}
```

```php
<?php
// tests/ShoppingCartTest.php
// Tests complets du panier d'achat

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\ShoppingCart;

class ShoppingCartTest extends TestCase
{
    private ShoppingCart $cart;

    // Crée un panier neuf avant chaque test
    protected function setUp(): void
    {
        $this->cart = new ShoppingCart();
    }

    // --- Tests de isEmpty() ---

    public function testNewCartIsEmpty(): void
    {
        $this->assertTrue($this->cart->isEmpty());
    }

    public function testCartIsNotEmptyAfterAddingItem(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);

        $this->assertFalse($this->cart->isEmpty());
    }

    // --- Tests de addItem() ---

    public function testAddSingleItem(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);

        $this->assertEquals(1, $this->cart->getItemCount());
    }

    public function testAddSameItemIncreasesQuantity(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);
        $this->cart->addItem('Livre', 15.99, 2);

        // 1 + 2 = 3 exemplaires du même livre
        $this->assertEquals(3, $this->cart->getItemCount());
    }

    public function testAddItemWithZeroQuantityThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->cart->addItem('Livre', 15.99, 0);
    }

    public function testAddItemWithNegativePriceThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);

        $this->cart->addItem('Livre', -5.00, 1);
    }

    // --- Tests de removeItem() ---

    public function testRemoveExistingItem(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);
        $this->cart->removeItem('Livre');

        $this->assertTrue($this->cart->isEmpty());
    }

    public function testRemoveNonExistingItemThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage("L'article 'Livre' n'existe pas");

        $this->cart->removeItem('Livre');
    }

    // --- Tests de getTotal() ---

    public function testTotalOfEmptyCart(): void
    {
        $this->assertEquals(0.0, $this->cart->getTotal());
    }

    public function testTotalWithOneItem(): void
    {
        $this->cart->addItem('Livre', 15.99, 2);

        // 15.99 × 2 = 31.98
        $this->assertEqualsWithDelta(31.98, $this->cart->getTotal(), 0.001);
    }

    public function testTotalWithMultipleItems(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);
        $this->cart->addItem('Stylo', 2.50, 3);

        // 15.99 + (2.50 × 3) = 15.99 + 7.50 = 23.49
        $this->assertEqualsWithDelta(23.49, $this->cart->getTotal(), 0.001);
    }

    // --- Tests de getItemCount() ---

    public function testItemCountOfEmptyCart(): void
    {
        $this->assertEquals(0, $this->cart->getItemCount());
    }

    // --- Tests de clear() ---

    public function testClearEmptiesTheCart(): void
    {
        $this->cart->addItem('Livre', 15.99, 1);
        $this->cart->addItem('Stylo', 2.50, 3);
        $this->cart->clear();

        $this->assertTrue($this->cart->isEmpty());
        $this->assertEquals(0, $this->cart->getItemCount());
        $this->assertEquals(0.0, $this->cart->getTotal());
    }

    // --- Data provider ---

    public static function itemProvider(): array
    {
        return [
            'livre' => ['Livre', 15.99, 1, 15.99],
            'stylo x3' => ['Stylo', 2.50, 3, 7.50],
            'gratuit' => ['Échantillon', 0.00, 1, 0.00],
            'gros achat' => ['Ordinateur', 999.99, 2, 1999.98],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('itemProvider')]
    public function testAddItemCalculatesCorrectTotal(
        string $name,
        float $price,
        int $quantity,
        float $expectedTotal
    ): void {
        $this->cart->addItem($name, $price, $quantity);

        $this->assertEqualsWithDelta(
            $expectedTotal,
            $this->cart->getTotal(),
            0.001
        );
    }
}
```

Lance les tests :

```bash
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
OK (34+ tests, assertions)
```

Tous les tests passent sans erreur.

---

## Navigation

← Fiche précédente : **[Pourquoi tester](01-pourquoi-tester.md)**

→ Fiche suivante : **[Tests unitaires JS (Jest)](03-tests-unitaires-js.md)**
