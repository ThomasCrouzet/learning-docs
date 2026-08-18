---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Découvrir le Test-Driven Development (TDD) : cycle rouge-vert-refactor, kata FizzBuzz et kata StringCalculator."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 15
cursus: "Testing et Qualité"
---

# 06 - Introduction au TDD

> **En bref** : Cette fiche présente le TDD (Test-Driven Development), une méthode où tu écris le test avant le code. Tu pratiqueras le cycle rouge-vert-refactor avec deux katas classiques. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[02 - Tests unitaires PHP](02-tests-unitaires-php.md)** (PHPUnit)
- Savoir écrire et lancer des tests avec PHPUnit
- Savoir utiliser les assertions assertEquals, assertTrue, expectException

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appliquer le cycle rouge-vert-refactor du TDD, résoudre le kata FizzBuzz en TDD et connaître les situations où le TDD est approprié et ses limites.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le TDD ?

**Définition** : Le TDD (Test-Driven Development, développement guidé par les tests) est une méthode de développement où tu écris le test AVANT d'écrire le code de production. Le test guide l'écriture du code.

**Le problème que le TDD résout** :

Sans TDD, voici les problèmes rencontrés :

1. **Code non testable** : Tu écris le code d'abord, puis tu essaies d'écrire les tests. Le code n'est pas conçu pour être testable (dépendances cachées, effets de bord).
2. **Sur-ingénierie** : Tu écris du code "au cas où", des fonctionnalités qui ne sont pas encore nécessaires.
3. **Spécification floue** : Tu commences à coder sans savoir exactement ce que le code doit faire. Tu découvres les cas limites en production.

**Comment le TDD résout ces problèmes** :

| Problème | Solution apportée par le TDD |
| --- | --- |
| Code non testable | Le code est conçu pour être testable dès le départ |
| Sur-ingénierie | Tu n'écris que le code nécessaire pour faire passer le test |
| Spécification floue | Le test définit clairement le comportement attendu avant de coder |

**Analogie concrète** : Imagine que tu construis une maison. Sans TDD, tu poses des briques et tu espères obtenir quelque chose d'habitable. Avec TDD, tu dessines d'abord le plan de chaque pièce (le test), puis tu construis la pièce (le code) pour qu'elle corresponde au plan, et enfin tu améliores la finition (le refactoring).

**Ce que le TDD n'est PAS** :

- Le TDD n'est pas du "testing". Le TDD est une méthode de conception, pas une méthode de test. Les tests sont un effet secondaire bénéfique.
- Le TDD n'est pas obligatoire. C'est un outil parmi d'autres. Certaines situations ne se prêtent pas au TDD (voir la section "Limites du TDD").

---

### Qu'est-ce que le cycle rouge-vert-refactor ?

**Définition** : Le cycle rouge-vert-refactor est la boucle fondamentale du TDD. Il se répète en permanence et contient trois étapes strictes.

**Les trois étapes** :

<div class="diagram-design">
<p><a href="../../diagrams/09-testing-06-introduction-tdd-1.html">Qu&#x27;est-ce que le cycle rouge-vert-refactor ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/09-testing-06-introduction-tdd-1.html" title="Qu&#x27;est-ce que le cycle rouge-vert-refactor ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

Le cycle se répète pour chaque nouvelle fonctionnalité :

1. **ROUGE** : écrire un test qui décrit un comportement qui n'existe pas encore. Le test échoue.
2. **VERT** : écrire le code le plus simple possible pour faire passer le test. Pas d'optimisation.
3. **REFACTOR** : nettoyer le code (renommage, extraction, simplification) sans changer le comportement. Les tests passent toujours.

**Règles strictes du TDD** :

1. Tu ne peux PAS écrire du code de production sans un test qui échoue
2. Tu ne peux PAS écrire plus de test que nécessaire pour obtenir un échec
3. Tu ne peux PAS écrire plus de code que nécessaire pour faire passer le test

**Analogie concrète** : Le cycle rouge-vert-refactor est comme peindre un mur. Rouge : tu traces une ligne au crayon (le test définit ce que tu veux). Vert : tu appliques la première couche de peinture, juste assez pour couvrir la ligne (le code minimal). Refactor : tu passes une seconde couche pour un rendu propre (tu améliores le code).

---

### Qu'est-ce qu'un kata ?

**Définition** : Un kata est un exercice de programmation court et répétitif, conçu pour pratiquer une technique spécifique. Le terme vient des arts martiaux, où un kata est un enchaînement de mouvements pratiqué jusqu'à devenir automatique.

**Le problème que les katas résolvent** :

Sans katas, voici les problèmes rencontrés :

1. **Pas de pratique isolée** : Tu apprends le TDD en théorie mais tu ne le pratiques que sur des projets réels, où la pression et la complexité rendent l'apprentissage difficile.
2. **Mauvaises habitudes** : Sans pratique dédiée, tu retombes dans tes anciennes habitudes (écrire le code d'abord).

**Katas classiques pour le TDD** :

| Kata | Difficulté | Durée | Ce qu'il enseigne |
| --- | --- | --- | --- |
| FizzBuzz | Facile | 15-20 min | Le cycle de base rouge-vert-refactor |
| StringCalculator | Moyen | 30-45 min | L'incrémentation progressive |
| Roman Numerals | Moyen | 30-45 min | La gestion de cas multiples |
| Bowling | Difficile | 45-60 min | La conception émergente |

---

### Quand le TDD est-il approprié ?

**Situations favorables au TDD** :

| Situation | Pourquoi le TDD aide |
| --- | --- |
| Logique métier complexe | Le test clarifie les règles avant de coder |
| Algorithmes | Le test définit les entrées/sorties |
| Code partagé (librairie) | Le test garantit la stabilité de l'API |
| Bug à corriger | Le test reproduit le bug avant de le corriger |

**Situations où le TDD est moins adapté** :

| Situation | Pourquoi |
| --- | --- |
| Interface utilisateur | L'UI change souvent, les tests deviennent obsolètes |
| Prototype / exploration | Tu ne sais pas encore ce que tu veux construire |
| Code jetable | Le coût des tests dépasse le bénéfice |
| Intégration avec des systèmes externes | Difficile à mocker de manière réaliste |

---

## Étapes Pratiques

### Étape 1 : Kata FizzBuzz - Préparer le projet

Les règles de FizzBuzz :

- Pour les nombres de 1 à 100 :
  - Si le nombre est divisible par 3, retourner "Fizz"
  - Si le nombre est divisible par 5, retourner "Buzz"
  - Si le nombre est divisible par 3 ET par 5, retourner "FizzBuzz"
  - Sinon, retourner le nombre sous forme de chaîne

Crée la structure du projet (réutilise le projet de la fiche 02 ou crée-en un nouveau) :

```bash
# Crée les fichiers (dans le projet PHPUnit existant)
touch src/FizzBuzz.php
touch tests/FizzBuzzTest.php
```

Crée le fichier `src/FizzBuzz.php` vide (juste la structure de la classe) :

```php
<?php
// src/FizzBuzz.php

namespace App;

class FizzBuzz
{
    // La méthode sera créée au fur et à mesure du TDD
}
```

---

### Étape 2 : ROUGE - Premier test (nombre normal)

Écris le premier test dans `tests/FizzBuzzTest.php` :

```php
<?php
// tests/FizzBuzzTest.php
// TDD : on commence par le cas le plus simple

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\FizzBuzz;

class FizzBuzzTest extends TestCase
{
    private FizzBuzz $fizzBuzz;

    protected function setUp(): void
    {
        $this->fizzBuzz = new FizzBuzz();
    }

    // Premier test : un nombre non divisible par 3 ni par 5
    // retourne le nombre en chaîne de caractères
    public function testReturnsNumberAsString(): void
    {
        $this->assertEquals('1', $this->fizzBuzz->convert(1));
    }
}
```

Lance le test :

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php
```

**Résultat attendu (ROUGE)** :

```text
Error: Call to undefined method App\FizzBuzz::convert()
```

Le test échoue (rouge). C'est normal : la méthode `convert` n'existe pas encore.

---

### Étape 3 : VERT - Écrire le minimum de code

Ajoute la méthode `convert` dans `src/FizzBuzz.php` :

```php
<?php
// src/FizzBuzz.php
// On écrit le MINIMUM de code pour faire passer le test

namespace App;

class FizzBuzz
{
    public function convert(int $number): string
    {
        // Le code le plus simple qui fait passer le test
        return (string) $number;
    }
}
```

Relance le test :

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php
```

**Résultat attendu (VERT)** :

```text
OK (1 test, 1 assertion)
```

Le test passe (vert). On peut passer au test suivant.

---

### Étape 4 : ROUGE - Test pour Fizz (divisible par 3)

Ajoute un test dans `FizzBuzzTest.php` :

```php
<?php
// Ajoute cette méthode dans FizzBuzzTest

public function testReturnsFizzForMultipleOf3(): void
{
    $this->assertEquals('Fizz', $this->fizzBuzz->convert(3));
}
```

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php
```

**Résultat attendu (ROUGE)** :

```text
Failed asserting that '3' matches expected 'Fizz'.
```

---

### Étape 5 : VERT - Implémenter Fizz

Modifie `src/FizzBuzz.php` :

```php
<?php
// src/FizzBuzz.php

namespace App;

class FizzBuzz
{
    public function convert(int $number): string
    {
        // Si le nombre est divisible par 3, retourner "Fizz"
        if ($number % 3 === 0) {
            return 'Fizz';
        }

        return (string) $number;
    }
}
```

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php
```

**Résultat attendu (VERT)** :

```text
OK (2 tests, 2 assertions)
```

---

### Étape 6 : ROUGE - Test pour Buzz (divisible par 5)

```php
<?php
// Ajoute cette méthode dans FizzBuzzTest

public function testReturnsBuzzForMultipleOf5(): void
{
    $this->assertEquals('Buzz', $this->fizzBuzz->convert(5));
}
```

**Résultat (ROUGE)** : Le test échoue car `convert(5)` retourne `"5"`.

---

### Étape 7 : VERT - Implémenter Buzz

```php
<?php
// src/FizzBuzz.php

namespace App;

class FizzBuzz
{
    public function convert(int $number): string
    {
        if ($number % 3 === 0) {
            return 'Fizz';
        }

        // Si le nombre est divisible par 5, retourner "Buzz"
        if ($number % 5 === 0) {
            return 'Buzz';
        }

        return (string) $number;
    }
}
```

**Résultat (VERT)** : 3 tests passent.

---

### Étape 8 : ROUGE - Test pour FizzBuzz (divisible par 3 ET 5)

```php
<?php
// Ajoute cette méthode dans FizzBuzzTest

public function testReturnsFizzBuzzForMultipleOf3And5(): void
{
    $this->assertEquals('FizzBuzz', $this->fizzBuzz->convert(15));
}
```

**Résultat (ROUGE)** : Le test échoue car `convert(15)` retourne `"Fizz"` (15 est divisible par 3, le premier `if` retourne avant le test du 5).

---

### Étape 9 : VERT - Implémenter FizzBuzz

```php
<?php
// src/FizzBuzz.php

namespace App;

class FizzBuzz
{
    public function convert(int $number): string
    {
        // La vérification de 3 ET 5 doit venir EN PREMIER
        // sinon le test de 3 seul intercepte les multiples de 15
        if ($number % 3 === 0 && $number % 5 === 0) {
            return 'FizzBuzz';
        }

        if ($number % 3 === 0) {
            return 'Fizz';
        }

        if ($number % 5 === 0) {
            return 'Buzz';
        }

        return (string) $number;
    }
}
```

**Résultat (VERT)** : 4 tests passent.

---

### Étape 10 : REFACTOR - Améliorer le code

Le code fonctionne mais on peut l'améliorer :

```php
<?php
// src/FizzBuzz.php
// Version refactorée : construction progressive de la chaîne

namespace App;

class FizzBuzz
{
    public function convert(int $number): string
    {
        $result = '';

        // On construit la chaîne progressivement
        if ($number % 3 === 0) {
            $result .= 'Fizz';
        }

        if ($number % 5 === 0) {
            $result .= 'Buzz';
        }

        // Si result est vide, on retourne le nombre
        // Sinon, on retourne le résultat construit
        return $result === '' ? (string) $number : $result;
    }
}
```

Relance tous les tests pour vérifier que le refactoring n'a rien cassé :

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php
```

**Résultat (VERT)** : 4 tests passent toujours.

---

### Étape 11 : Ajouter des tests supplémentaires

Complète la suite de tests avec des data providers :

```php
<?php
// Ajoute dans FizzBuzzTest

public static function fizzBuzzProvider(): array
{
    return [
        'nombre normal 1' => [1, '1'],
        'nombre normal 2' => [2, '2'],
        'fizz pour 3' => [3, 'Fizz'],
        'nombre normal 4' => [4, '4'],
        'buzz pour 5' => [5, 'Buzz'],
        'fizz pour 6' => [6, 'Fizz'],
        'fizz pour 9' => [9, 'Fizz'],
        'buzz pour 10' => [10, 'Buzz'],
        'fizzbuzz pour 15' => [15, 'FizzBuzz'],
        'buzz pour 20' => [20, 'Buzz'],
        'fizzbuzz pour 30' => [30, 'FizzBuzz'],
        'fizz pour 33' => [33, 'Fizz'],
        'fizzbuzz pour 45' => [45, 'FizzBuzz'],
    ];
}

#[\PHPUnit\Framework\Attributes\DataProvider('fizzBuzzProvider')]
public function testConvertWithDataProvider(int $input, string $expected): void
{
    $this->assertEquals($expected, $this->fizzBuzz->convert($input));
}
```

```bash
./vendor/bin/phpunit tests/FizzBuzzTest.php --testdox
```

**Résultat attendu** :

```text
FizzBuzz
 ✓ Returns number as string
 ✓ Returns fizz for multiple of 3
 ✓ Returns buzz for multiple of 5
 ✓ Returns fizz buzz for multiple of 3 and 5
 ✓ Convert with data provider with data set "nombre normal 1"
 ✓ Convert with data provider with data set "nombre normal 2"
 ...

OK (17 tests, 17 assertions)
```

---

### Étape 12 : Kata StringCalculator

Le kata StringCalculator est un exercice classique plus complexe.

**Règles** :

1. Une chaîne vide retourne 0
2. Un seul nombre retourne ce nombre
3. Deux nombres séparés par une virgule retournent leur somme
4. N nombres séparés par des virgules retournent leur somme
5. Les retours à la ligne sont aussi des séparateurs
6. Les nombres négatifs lèvent une exception

Crée `src/StringCalculator.php` et `tests/StringCalculatorTest.php` en suivant le cycle TDD :

```php
<?php
// tests/StringCalculatorTest.php
// Kata StringCalculator en TDD

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\StringCalculator;

class StringCalculatorTest extends TestCase
{
    private StringCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new StringCalculator();
    }

    // Test 1 : chaîne vide retourne 0
    public function testEmptyStringReturnsZero(): void
    {
        $this->assertEquals(0, $this->calculator->add(''));
    }

    // Test 2 : un seul nombre retourne ce nombre
    public function testSingleNumberReturnsItself(): void
    {
        $this->assertEquals(1, $this->calculator->add('1'));
        $this->assertEquals(5, $this->calculator->add('5'));
    }

    // Test 3 : deux nombres séparés par virgule
    public function testTwoNumbersSeparatedByComma(): void
    {
        $this->assertEquals(3, $this->calculator->add('1,2'));
    }

    // Test 4 : plusieurs nombres
    public function testMultipleNumbers(): void
    {
        $this->assertEquals(10, $this->calculator->add('1,2,3,4'));
    }

    // Test 5 : retour à la ligne comme séparateur
    public function testNewlineAsSeparator(): void
    {
        $this->assertEquals(6, $this->calculator->add("1\n2,3"));
    }

    // Test 6 : nombre négatif lève une exception
    public function testNegativeNumberThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Nombres négatifs non autorisés : -1');

        $this->calculator->add('-1,2');
    }

    // Test 7 : plusieurs nombres négatifs dans le message
    public function testMultipleNegativeNumbersShowAllInMessage(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->expectExceptionMessage('Nombres négatifs non autorisés : -1, -3');

        $this->calculator->add('-1,2,-3');
    }
}
```

```php
<?php
// src/StringCalculator.php
// Solution finale après le cycle TDD complet

namespace App;

class StringCalculator
{
    // Additionne les nombres contenus dans une chaîne
    // Les séparateurs sont la virgule et le retour à la ligne
    public function add(string $numbers): int
    {
        // Cas de la chaîne vide
        if ($numbers === '') {
            return 0;
        }

        // On remplace les retours à la ligne par des virgules
        // pour n'avoir qu'un seul type de séparateur
        $normalized = str_replace("\n", ',', $numbers);

        // On sépare la chaîne en tableau de nombres
        $parts = explode(',', $normalized);

        // On convertit chaque partie en entier
        $values = array_map('intval', $parts);

        // On vérifie qu'il n'y a pas de nombres négatifs
        $negatives = array_filter($values, fn(int $n) => $n < 0);

        if (!empty($negatives)) {
            $negativesStr = implode(', ', $negatives);
            throw new \InvalidArgumentException(
                "Nombres négatifs non autorisés : $negativesStr"
            );
        }

        // On retourne la somme
        return array_sum($values);
    }
}
```

```bash
./vendor/bin/phpunit tests/StringCalculatorTest.php
```

**Résultat attendu** :

```text
OK (7 tests, 9 assertions)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit tests/FichierTest.php` | Lancer les tests d'un kata |
| `./vendor/bin/phpunit --testdox` | Affichage lisible (recommandé en TDD) |
| `./vendor/bin/phpunit --stop-on-failure` | Stopper au premier échec (recommandé en TDD) |
| `./vendor/bin/phpunit --filter testNomDuTest` | Lancer un seul test |

---

## Pièges Fréquents

### Piège 1 : Écrire trop de code d'un coup

**Problème** : Tu écris toute la méthode d'un coup au lieu d'écrire le minimum pour faire passer le test. Tu perds le bénéfice du feedback rapide.

**Solution** : Discipline stricte. Un seul test en rouge à la fois. Le minimum de code pour passer au vert. Pas de code "anticipé".

---

### Piège 2 : Sauter l'étape de refactoring

**Problème** : Tu passes directement du vert au rouge suivant. Le code accumule de la dette technique.

**Solution** : Après chaque vert, demande-toi : "Puis-je améliorer ce code sans changer son comportement ?". Si oui, refactore. Si non, passe au test suivant.

---

### Piège 3 : Écrire un test trop complexe

**Problème** : Tu écris un test qui couvre 5 comportements d'un coup. Tu dois écrire beaucoup de code pour le faire passer.

**Solution** : Un test = un comportement. Commence par le cas le plus simple, puis ajoute de la complexité progressivement.

```php
// ❌ Trop complexe pour un premier test
public function testFizzBuzz(): void
{
    $this->assertEquals('1', $this->fizzBuzz->convert(1));
    $this->assertEquals('Fizz', $this->fizzBuzz->convert(3));
    $this->assertEquals('Buzz', $this->fizzBuzz->convert(5));
    $this->assertEquals('FizzBuzz', $this->fizzBuzz->convert(15));
}

// ✅ Un comportement par test
public function testReturnsNumberAsString(): void
{
    $this->assertEquals('1', $this->fizzBuzz->convert(1));
}
```

---

### Piège 4 : Appliquer le TDD à tout

**Problème** : Tu essaies d'utiliser le TDD pour du code CRUD simple, des templates ou du code exploratoire. C'est lent et frustrant.

**Solution** : Utilise le TDD pour la logique métier complexe et les algorithmes. Pour le reste, écris les tests après le code.

---

## Checklist de Validation

- [ ] Je comprends le cycle rouge-vert-refactor
- [ ] Je connais les 3 règles strictes du TDD
- [ ] J'ai complété le kata FizzBuzz en TDD
- [ ] J'ai complété le kata StringCalculator en TDD
- [ ] Je sais quand le TDD est approprié et quand il ne l'est pas
- [ ] Je résiste à la tentation d'écrire du code avant le test
- [ ] Tous mes tests passent avec `./vendor/bin/phpunit`

---

## Exercice Pratique

**Énoncé** : Réalise le kata "Roman Numerals" en TDD. Crée une classe `RomanNumerals` avec une méthode `toRoman(int $number): string` qui convertit un nombre arabe en chiffre romain.

Règles de conversion :

| Arabe | Romain |
| --- | --- |
| 1 | I |
| 4 | IV |
| 5 | V |
| 9 | IX |
| 10 | X |
| 40 | XL |
| 50 | L |
| 90 | XC |
| 100 | C |
| 400 | CD |
| 500 | D |
| 900 | CM |
| 1000 | M |

**Indications** :

- Commence par le test le plus simple : `toRoman(1)` retourne `"I"`
- Progresse un test à la fois : 1, 2, 3, 4, 5, 9, 10, 14, 40, 50, 90, 100
- Ne regarde pas la solution avant d'avoir essayé
- Respecte strictement le cycle rouge-vert-refactor
- Écris au minimum 15 tests (avec un data provider)

**Résultat attendu** : `toRoman(2024)` retourne `"MMXXIV"`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// src/RomanNumerals.php
// Convertisseur de nombres arabes en chiffres romains

namespace App;

class RomanNumerals
{
    // Tableau de correspondance, du plus grand au plus petit
    // L'ordre est important : on commence par les grandes valeurs
    private const MAPPING = [
        1000 => 'M',
        900 => 'CM',
        500 => 'D',
        400 => 'CD',
        100 => 'C',
        90 => 'XC',
        50 => 'L',
        40 => 'XL',
        10 => 'X',
        9 => 'IX',
        5 => 'V',
        4 => 'IV',
        1 => 'I',
    ];

    public function toRoman(int $number): string
    {
        if ($number <= 0 || $number > 3999) {
            throw new \InvalidArgumentException(
                'Le nombre doit être entre 1 et 3999'
            );
        }

        $result = '';

        // On parcourt le mapping du plus grand au plus petit
        foreach (self::MAPPING as $value => $symbol) {
            // Tant que le nombre est supérieur ou égal à la valeur,
            // on ajoute le symbole et on soustrait la valeur
            while ($number >= $value) {
                $result .= $symbol;
                $number -= $value;
            }
        }

        return $result;
    }
}
```

```php
<?php
// tests/RomanNumeralsTest.php

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\RomanNumerals;

class RomanNumeralsTest extends TestCase
{
    private RomanNumerals $converter;

    protected function setUp(): void
    {
        $this->converter = new RomanNumerals();
    }

    public static function romanProvider(): array
    {
        return [
            [1, 'I'],
            [2, 'II'],
            [3, 'III'],
            [4, 'IV'],
            [5, 'V'],
            [6, 'VI'],
            [9, 'IX'],
            [10, 'X'],
            [14, 'XIV'],
            [40, 'XL'],
            [50, 'L'],
            [90, 'XC'],
            [100, 'C'],
            [400, 'CD'],
            [500, 'D'],
            [900, 'CM'],
            [1000, 'M'],
            [1994, 'MCMXCIV'],
            [2024, 'MMXXIV'],
            [3999, 'MMMCMXCIX'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('romanProvider')]
    public function testToRoman(int $arabic, string $expectedRoman): void
    {
        $this->assertEquals($expectedRoman, $this->converter->toRoman($arabic));
    }

    public function testZeroThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->converter->toRoman(0);
    }

    public function testNegativeThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->converter->toRoman(-1);
    }

    public function testAbove3999ThrowsException(): void
    {
        $this->expectException(\InvalidArgumentException::class);
        $this->converter->toRoman(4000);
    }
}
```

```bash
./vendor/bin/phpunit tests/RomanNumeralsTest.php
```

**Résultat attendu** :

```text
OK (23 tests, 23 assertions)
```

---

## Navigation

← Fiche précédente : **[Tests fonctionnels Symfony](05-tests-fonctionnels-symfony.md)**

→ Fiche suivante : **[Tests E2E avec Playwright](07-tests-e2e-playwright.md)**
