---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Mesurer la couverture de code avec PHPUnit et Jest, interpréter les rapports et définir des seuils de qualité."
estimated_time: "60 min"
fiche_number: 9
total_fiches: 15
cursus: "Testing et Qualité"
---

# 09 - Couverture de code

> **En bref** : Cette fiche explique comment mesurer la couverture de code avec PHPUnit (Xdebug) et Jest, interpréter les rapports HTML et texte, et définir des seuils de qualité pour ton projet. Lecture estimée : 60 min.

## Prérequis

- [Fiche 02 - Tests unitaires PHP](02-tests-unitaires-php.md) (PHPUnit) : savoir écrire et lancer des tests PHPUnit
- [Fiche 03 - Tests unitaires JS](03-tests-unitaires-js.md) (Jest) : savoir écrire et lancer des tests Jest
- PHP 8.3 installé avec Xdebug ou PCOV
- Node.js 22 LTS installé

## Objectif de cette fiche

À la fin de cette fiche, tu sauras générer un rapport de couverture de code avec PHPUnit et Jest, interpréter les métriques (lignes, fonctions, branches), définir des seuils de qualité et identifier le code non testé.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la couverture de code ?

**Définition** : La couverture de code (code coverage) est une mesure qui indique quel pourcentage du code source est exécuté par les tests automatisés. Elle s'exprime en pourcentage : 75% de couverture signifie que 75% des lignes de code ont été exécutées au moins une fois pendant les tests.

**Le problème que la couverture de code résout** :

Sans couverture de code, voici les problèmes rencontrés :

1. **Zones mortes invisibles** : Tu as 50 tests qui passent, mais tu ne sais pas si certaines parties du code ne sont jamais testées. Un bug peut se cacher dans ces zones.
2. **Faux sentiment de sécurité** : Tu penses que le code est bien testé parce que tous les tests passent, mais en réalité, seule une petite partie du code est vérifiée.
3. **Priorisation impossible** : Tu veux ajouter des tests, mais tu ne sais pas où les concentrer pour le meilleur impact.

**Comment la couverture de code résout ces problèmes** :

| Problème | Solution apportée par la couverture de code |
| --- | --- |
| Zones mortes invisibles | Le rapport montre en rouge les lignes jamais exécutées |
| Faux sentiment de sécurité | Le pourcentage donne une mesure objective du niveau de test |
| Priorisation impossible | Tu vois immédiatement les fichiers les moins couverts |

**Analogie concrète** : Imagine que tu vérifies l'étanchéité d'un toit. Tu arroses le toit avec un tuyau d'eau et tu regardes où l'eau passe. La couverture de code fait la même chose : elle "arrose" le code avec des tests et te montre quelles parties ont été touchées (testées) et quelles parties sont restées sèches (non testées).

**Ce que la couverture de code n'est PAS** :

- La couverture n'est pas une mesure de qualité des tests. Un test peut exécuter une ligne sans vérifier son résultat. 100% de couverture ne signifie pas 0 bug.
- La couverture n'est pas un objectif en soi. L'objectif est de détecter les bugs, pas d'atteindre un pourcentage.

---

### Quels sont les types de couverture ?

**Définition** : Il existe plusieurs façons de mesurer la couverture. Chaque type répond à une question différente.

**Analogie concrète** : Imagine que tu vérifies la sécurité d'un immeuble.
La couverture de lignes, c'est vérifier que tu as ouvert chaque porte au moins une fois.
La couverture de fonctions, c'est vérifier que tu es entré dans chaque pièce.
La couverture de branches, c'est vérifier que tu as pris chaque couloir à chaque intersection (gauche ET droite).
La couverture de conditions, c'est vérifier que tu as inspecté chaque meuble dans chaque pièce.
Chaque niveau donne une vision plus complète de la sécurité de l'immeuble.

**Les 4 types principaux** :

| Type | Question posée | Exemple |
| --- | --- | --- |
| Couverture de lignes (Line) | Cette ligne a-t-elle été exécutée ? | `return $a + $b;` a été exécutée |
| Couverture de fonctions (Function) | Cette fonction a-t-elle été appelée ? | `add()` a été appelée au moins une fois |
| Couverture de branches (Branch) | Chaque branche du if/else a-t-elle été prise ? | Le `if` ET le `else` ont été exécutés |
| Couverture de conditions (Statement) | Chaque instruction a-t-elle été exécutée ? | Chaque `return`, `echo`, `$x = ...` a été exécuté |

**Le problème que la couverture de branches résout** :

Sans couverture de branches, voici les problèmes rencontrés :

1. **Branches oubliées** : La couverture de lignes est à 100%, mais le `else` d'un `if` n'a jamais été exécuté. Un bug peut s'y cacher.

**Exemple concret** :

```php
// Cette fonction a 2 branches : le if et le else
function getStatus(int $score): string
{
    if ($score >= 50) {
        return 'Réussi';  // Branche 1
    } else {
        return 'Échoué';  // Branche 2
    }
}
```

Si tu testes uniquement `getStatus(80)`, la couverture de lignes est de 66% (2 lignes sur 3 exécutées). Mais la couverture de branches est de 50% (1 branche sur 2). Tu n'as pas testé le cas d'échec.

---

### Qu'est-ce qu'un seuil de couverture ?

**Définition** : Un seuil de couverture (coverage threshold) est un pourcentage minimum requis. Si la couverture descend en dessous de ce seuil, le pipeline de tests échoue.

**Le problème que les seuils résolvent** :

Sans seuils, voici les problèmes rencontrés :

1. **Érosion progressive** : La couverture baisse de 80% à 75% à 60% au fil des mois. Personne ne réagit parce que chaque baisse est petite.
2. **Code non testé accepté** : Un développeur ajoute 200 lignes sans un seul test. La pull request est acceptée.

**Comment les seuils résolvent ces problèmes** :

| Problème | Solution apportée par les seuils |
| --- | --- |
| Érosion progressive | Le pipeline échoue si la couverture descend sous le seuil |
| Code non testé accepté | Le développeur doit ajouter des tests pour atteindre le seuil |

**Analogie concrète** : Un seuil de couverture est comme la note minimale pour valider un examen. Si l'examen exige 12/20, un étudiant qui obtient 11/20 doit retravailler sa copie avant qu'elle soit acceptée. De la même façon, si le seuil de couverture est à 80%, un développeur qui fait baisser la couverture à 78% doit ajouter des tests avant que son code soit accepté dans le projet.

**Seuils recommandés selon le contexte** :

| Contexte | Seuil recommandé | Justification |
| --- | --- | --- |
| Nouveau projet | 80% | Commence haut pour garder de bonnes habitudes |
| Projet existant sans tests | 50%, puis augmenter de 5% par mois | Progressif pour ne pas bloquer le travail |
| Projet critique (finance, santé) | 90%+ | Le coût d'un bug est très élevé |
| Code utilitaire (helpers) | 90%+ | Fonctions pures, faciles à tester |
| Contrôleurs Symfony | 60-70% | Les contrôleurs sont testés par les tests fonctionnels |

**Ce qu'un seuil n'est PAS** :

- Un seuil n'est pas une garantie de qualité. 80% de couverture avec des tests qui ne vérifient rien est pire que 50% de couverture avec des tests rigoureux.
- Un seuil n'est pas figé. Il doit être ajusté au fil du temps.

---

### Qu'est-ce que Xdebug et PCOV ?

**Définition** : Xdebug et PCOV sont des extensions PHP qui permettent de collecter les données de couverture de code. PHPUnit a besoin de l'une de ces extensions pour générer des rapports de couverture.

**Le problème que Xdebug et PCOV résolvent** :

Sans extension de couverture :

1. **Pas de rapport possible** : PHPUnit ne peut pas savoir quelles lignes de code sont exécutées pendant les tests. La commande `--coverage-text` échoue avec l'erreur "No code coverage driver available".
2. **Mesure manuelle impossible** : tu devrais relire chaque ligne de code et vérifier mentalement si un test l'exécute. C'est impossible sur un projet de plus de quelques centaines de lignes.
3. **Choix entre vitesse et fonctionnalités** : une seule extension qui fait tout (debugging + profiling + couverture) ralentit les tests. Il faut pouvoir choisir l'outil adapté au contexte.

**Comment Xdebug et PCOV résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de rapport possible | Les extensions instrumentent le code pour suivre chaque ligne exécutée |
| Mesure manuelle impossible | Le rapport est généré automatiquement en quelques secondes |
| Choix entre vitesse et fonctionnalités | PCOV ne fait que la couverture (rapide), Xdebug fait tout (plus lent) |

**Comparaison Xdebug vs PCOV** :

| Critère | Xdebug | PCOV |
| --- | --- | --- |
| Fonctionnalités | Debugging + profiling + couverture | Couverture uniquement |
| Vitesse | Lent (4-8x plus lent) | Rapide (2x plus rapide que Xdebug) |
| Installation | `pecl install xdebug` | `pecl install pcov` |
| Recommandation | Développement (debugging) | CI/CD (vitesse) |

**Analogie concrète** : Xdebug est un couteau suisse : il fait du debugging, du profiling et de la couverture. PCOV est un tournevis spécialisé : il ne fait que la couverture, mais il le fait plus vite.

---

## Étapes Pratiques

### Étape 1 : Vérifier l'installation de Xdebug ou PCOV

Vérifie que Xdebug ou PCOV est installé :

```bash
# Vérifier si Xdebug est installé
php -m | grep xdebug

# Vérifier si PCOV est installé
php -m | grep pcov

# Vérifier la version de Xdebug
php -r "echo phpversion('xdebug');"
```

**Résultat attendu** (avec Xdebug) :

```text
xdebug
```

Si aucune extension n'est installée, installe PCOV (recommandé pour la couverture) :

```bash
# Sur macOS avec Homebrew
pecl install pcov

# Vérifie l'installation
php -m | grep pcov
```

**Résultat attendu** :

```text
pcov
```

Pour Xdebug, active le mode couverture dans `php.ini` :

```text
xdebug.mode=coverage
```

---

### Étape 2 : Configurer PHPUnit pour la couverture

Reprends le projet créé dans la fiche 02 (ou crée un nouveau projet). Modifie `phpunit.xml` pour activer la couverture :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!-- phpunit.xml -->
<!-- Configuration avec couverture de code -->
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true"
         failOnWarning="true"
         failOnRisky="true">

    <testsuites>
        <testsuite name="Unit">
            <directory>tests</directory>
        </testsuite>
    </testsuites>

    <!-- Définir quels fichiers inclure dans le rapport de couverture -->
    <source>
        <include>
            <!-- Inclure tout le dossier src/ -->
            <directory>src</directory>
        </include>
        <exclude>
            <!-- Exclure les fichiers de configuration -->
            <directory>src/Config</directory>
        </exclude>
    </source>
</phpunit>
```

---

### Étape 3 : Générer un rapport de couverture en texte

Lance les tests avec le rapport de couverture en mode texte :

```bash
# Rapport de couverture dans le terminal
./vendor/bin/phpunit --coverage-text
```

**Résultat attendu** :

```text
PHPUnit 11.x.x by Sebastian Bergmann and contributors.

........                                                            8 / 8 (100%)

Time: 00:00.150, Memory: 12.00 MB

OK (8 tests, 9 assertions)

Code Coverage Report:
  2025-01-15 10:30:00

 Summary:
  Classes: 100.00% (2/2)
  Methods: 100.00% (7/7)
  Lines:   100.00% (20/20)

App\Calculator
  Methods: 100.00% ( 5/ 5)   Lines: 100.00% ( 14/ 14)
App\PasswordValidator
  Methods: 100.00% ( 2/ 2)   Lines: 100.00% (  6/  6)
```

Ce rapport montre :

- **Classes** : pourcentage de classes dont au moins une méthode est testée
- **Methods** : pourcentage de méthodes appelées par les tests
- **Lines** : pourcentage de lignes exécutées par les tests

---

### Étape 4 : Générer un rapport HTML

Le rapport HTML est beaucoup plus détaillé et visuel :

```bash
# Génère un rapport HTML dans le dossier coverage-report/
./vendor/bin/phpunit --coverage-html coverage-report
```

**Résultat attendu** :

```text
OK (8 tests, 9 assertions)

Generating code coverage report in HTML format ... done [00:00.250]
```

Ouvre le rapport dans le navigateur :

```bash
# Ouvre le fichier index.html du rapport
open coverage-report/index.html
```

Le rapport HTML montre :

- Un tableau récapitulatif avec le pourcentage par fichier
- En cliquant sur un fichier, tu vois le code source avec des couleurs :
  - **Vert** : ligne exécutée par les tests
  - **Rouge** : ligne jamais exécutée
  - **Jaune** : branche partiellement couverte (le `if` est exécuté mais pas le `else`)

---

### Étape 5 : Identifier le code non couvert

Crée un nouveau fichier `src/OrderCalculator.php` avec du code pas entièrement testé :

```php
<?php
// src/OrderCalculator.php
// Calcule le prix d'une commande avec remises

namespace App;

class OrderCalculator
{
    // Calcule le prix total avec remise éventuelle
    public function calculateTotal(float $price, int $quantity, string $customerType): float
    {
        // Calcul du sous-total
        $subtotal = $price * $quantity;

        // Application de la remise selon le type de client
        if ($customerType === 'premium') {
            // Les clients premium ont 20% de remise
            $subtotal *= 0.80;
        } elseif ($customerType === 'business') {
            // Les clients business ont 15% de remise
            $subtotal *= 0.85;
        } elseif ($customerType === 'student') {
            // Les étudiants ont 10% de remise
            $subtotal *= 0.90;
        }
        // Pas de remise pour les clients standard (pas de else)

        // Remise supplémentaire pour les grosses commandes
        if ($quantity >= 100) {
            // 5% de remise supplémentaire pour 100+ articles
            $subtotal *= 0.95;
        } elseif ($quantity >= 50) {
            // 3% de remise supplémentaire pour 50+ articles
            $subtotal *= 0.97;
        }

        return round($subtotal, 2);
    }

    // Calcule les frais de livraison
    public function calculateShipping(float $total, string $country): float
    {
        if ($country === 'FR') {
            // Livraison gratuite en France au-dessus de 50€
            return $total >= 50.0 ? 0.0 : 5.99;
        } elseif ($country === 'BE' || $country === 'DE') {
            // Belgique et Allemagne : frais fixes
            return 9.99;
        } else {
            // Autres pays : frais élevés
            return 19.99;
        }
    }
}
```

Crée un test partiel `tests/OrderCalculatorTest.php` :

```php
<?php
// tests/OrderCalculatorTest.php
// Tests partiels pour montrer la couverture incomplète

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\OrderCalculator;

class OrderCalculatorTest extends TestCase
{
    private OrderCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new OrderCalculator();
    }

    // On teste seulement le cas standard (pas de remise)
    public function testCalculateTotalStandard(): void
    {
        $result = $this->calculator->calculateTotal(10.0, 5, 'standard');

        // 10 × 5 = 50, pas de remise
        $this->assertEquals(50.0, $result);
    }

    // On teste seulement le cas premium
    public function testCalculateTotalPremium(): void
    {
        $result = $this->calculator->calculateTotal(10.0, 5, 'premium');

        // 10 × 5 = 50, 20% de remise = 40
        $this->assertEquals(40.0, $result);
    }

    // On ne teste PAS le cas business ni student
    // On ne teste PAS les remises de quantité
    // On ne teste PAS calculateShipping du tout
}
```

Génère le rapport :

```bash
./vendor/bin/phpunit --coverage-text
```

**Résultat attendu** :

```text
Code Coverage Report:

App\OrderCalculator
  Methods:  50.00% ( 1/ 2)   Lines:  52.00% ( 13/ 25)
```

Le rapport montre que `calculateShipping` n'est jamais testée (0% de couverture de méthode pour cette fonction) et que les branches `business`, `student` et les remises de quantité ne sont pas couvertes.

---

### Étape 6 : Couverture de code avec Jest

Dans un projet JavaScript avec Jest, la couverture est intégrée. Aucune extension supplémentaire n'est nécessaire.

Crée un fichier `orderCalculator.js` :

```javascript
// orderCalculator.js
// Calcule le prix d'une commande avec remises

function calculateTotal(price, quantity, customerType) {
  // Calcul du sous-total
  let subtotal = price * quantity;

  // Application de la remise selon le type de client
  if (customerType === 'premium') {
    subtotal *= 0.8;
  } else if (customerType === 'business') {
    subtotal *= 0.85;
  } else if (customerType === 'student') {
    subtotal *= 0.9;
  }

  // Remise supplémentaire pour les grosses commandes
  if (quantity >= 100) {
    subtotal *= 0.95;
  } else if (quantity >= 50) {
    subtotal *= 0.97;
  }

  return Math.round(subtotal * 100) / 100;
}

module.exports = { calculateTotal };
```

Crée le test `orderCalculator.test.js` :

```javascript
// orderCalculator.test.js
// Tests du calculateur de commande

const { calculateTotal } = require('./orderCalculator');

describe('calculateTotal', () => {
  test('calculates standard price without discount', () => {
    // 10 × 5 = 50, pas de remise
    expect(calculateTotal(10, 5, 'standard')).toBe(50);
  });

  test('applies premium discount', () => {
    // 10 × 5 = 50, 20% de remise = 40
    expect(calculateTotal(10, 5, 'premium')).toBe(40);
  });

  test('applies business discount', () => {
    // 10 × 10 = 100, 15% de remise = 85
    expect(calculateTotal(10, 10, 'business')).toBe(85);
  });
});
```

Lance les tests avec la couverture :

```bash
# Lance Jest avec le rapport de couverture
npx jest --coverage
```

**Résultat attendu** :

```text
PASS  ./orderCalculator.test.js
  calculateTotal
    ✓ calculates standard price without discount (2 ms)
    ✓ applies premium discount (1 ms)
    ✓ applies business discount

----------------------|---------|----------|---------|---------|-------------------
File                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
----------------------|---------|----------|---------|---------|-------------------
All files             |   83.33 |    62.50 |     100 |   83.33 |
 orderCalculator.js   |   83.33 |    62.50 |     100 |   83.33 | 13,18,20
----------------------|---------|----------|---------|---------|-------------------

Test Suites: 1 passed, 1 total
Tests:       3 passed, 3 total
```

Les colonnes du rapport :

- **% Stmts** (Statements) : pourcentage d'instructions exécutées
- **% Branch** : pourcentage de branches (if/else) prises
- **% Funcs** : pourcentage de fonctions appelées
- **% Lines** : pourcentage de lignes exécutées
- **Uncovered Line #s** : numéros des lignes non couvertes

---

### Étape 7 : Définir des seuils avec Jest

Ajoute des seuils de couverture dans la configuration Jest. Modifie `package.json` :

```json
{
  "jest": {
    "coverageThreshold": {
      "global": {
        "branches": 70,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

Lance les tests avec couverture :

```bash
npx jest --coverage
```

**Résultat attendu** (si le seuil n'est pas atteint) :

```text
Jest: "global" coverage threshold for branches (70%) not met: 62.5%
```

Jest échoue parce que la couverture de branches (62.5%) est en dessous du seuil (70%).

---

### Étape 8 : Définir des seuils avec PHPUnit

PHPUnit ne gère pas les seuils directement dans `phpunit.xml`. Utilise la ligne de commande ou un script :

```bash
# Génère un rapport Clover (format XML lisible par les outils)
./vendor/bin/phpunit --coverage-clover coverage.xml

# Vérifie la couverture avec un seuil (script personnalisé)
php -r "
\$xml = simplexml_load_file('coverage.xml');
\$metrics = \$xml->project->metrics;
\$covered = (int)\$metrics['coveredstatements'];
\$total = (int)\$metrics['statements'];
\$percent = \$total > 0 ? round(\$covered / \$total * 100, 2) : 0;
echo \"Couverture : {\$percent}%\n\";
if (\$percent < 70) {
    echo \"ECHEC : couverture en dessous du seuil de 70%\n\";
    exit(1);
}
echo \"OK : seuil de 70% atteint\n\";
"
```

**Résultat attendu** :

```text
Couverture : 75.50%
OK : seuil de 70% atteint
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit --coverage-text` | Rapport de couverture dans le terminal (PHP) |
| `./vendor/bin/phpunit --coverage-html coverage-report` | Rapport HTML détaillé (PHP) |
| `./vendor/bin/phpunit --coverage-clover coverage.xml` | Rapport XML Clover (PHP) |
| `npx jest --coverage` | Rapport de couverture dans le terminal (JS) |
| `npx jest --coverage --coverageReporters=html` | Rapport HTML détaillé (JS) |
| `open coverage-report/index.html` | Ouvrir le rapport HTML dans le navigateur |
| `php -m \| grep xdebug` | Vérifier si Xdebug est installé |
| `php -m \| grep pcov` | Vérifier si PCOV est installé |

---

## Pièges Fréquents

### Piège 1 : Viser 100% de couverture à tout prix

⚠️ **Problème** : Tu passes des heures à tester des getters/setters triviaux et du code généré pour atteindre 100%. Le temps investi n'est pas rentable.

✅ **Solution** : Concentre-toi sur le code critique (logique métier, calculs, validations). 80% de couverture sur le code important vaut mieux que 100% sur du code trivial. Exclus les fichiers qui n'ont pas besoin de tests :

```xml
<!-- phpunit.xml : exclure les fichiers triviaux -->
<source>
    <include>
        <directory>src</directory>
    </include>
    <exclude>
        <directory>src/Entity</directory>
        <directory>src/Config</directory>
    </exclude>
</source>
```

---

### Piège 2 : Confondre couverture et qualité des tests

⚠️ **Problème** : Un test exécute une ligne mais ne vérifie rien. La couverture augmente, mais le test ne détecte aucun bug.

```php
// ❌ Mauvais test : exécute le code mais ne vérifie rien
public function testCalculateTotal(): void
{
    $this->calculator->calculateTotal(10, 5, 'premium');
    // Pas d'assertion ! Le test passe toujours.
    $this->assertTrue(true);
}
```

✅ **Solution** : Chaque test doit avoir au moins une assertion significative qui vérifie le résultat.

```php
// ✅ Bon test : vérifie le résultat
public function testCalculateTotal(): void
{
    $result = $this->calculator->calculateTotal(10, 5, 'premium');
    $this->assertEquals(40.0, $result);
}
```

---

### Piège 3 : Oublier d'activer le mode couverture de Xdebug

⚠️ **Problème** : Tu lances `--coverage-text` et PHPUnit affiche une erreur : "No code coverage driver available".

✅ **Solution** : Active le mode couverture dans `php.ini` :

```text
; Pour Xdebug, ajoute cette ligne dans php.ini
xdebug.mode=coverage
```

Vérifie la configuration :

```bash
php -i | grep xdebug.mode
```

---

### Piège 4 : La couverture ralentit les tests

⚠️ **Problème** : Avec Xdebug, les tests sont 4-8 fois plus lents quand la couverture est activée. La suite de tests passe de 10 secondes à 60 secondes.

✅ **Solution** : Ne génère la couverture que quand tu en as besoin. En développement quotidien, lance les tests sans couverture. Utilise PCOV si tu n'as pas besoin du debugging Xdebug.

```bash
# Développement quotidien : rapide, sans couverture
./vendor/bin/phpunit

# Avant un commit ou en CI/CD : avec couverture
./vendor/bin/phpunit --coverage-text
```

---

## Checklist de Validation

- [ ] Je sais vérifier si Xdebug ou PCOV est installé
- [ ] Je sais générer un rapport de couverture en texte avec PHPUnit
- [ ] Je sais générer un rapport HTML avec PHPUnit
- [ ] Je sais lire un rapport de couverture (lignes vertes, rouges, jaunes)
- [ ] Je sais générer un rapport de couverture avec Jest
- [ ] Je comprends la différence entre couverture de lignes et couverture de branches
- [ ] Je sais définir des seuils de couverture avec Jest
- [ ] Je sais que 100% de couverture ne signifie pas 0 bug

---

## Exercice Pratique

**Énoncé** : Reprends la classe `OrderCalculator` de l'étape 5 et écris les tests manquants pour atteindre 100% de couverture de lignes et de branches.

**Indications** :

- Teste les cas `business`, `student` et `standard` pour `calculateTotal`
- Teste les remises de quantité (50+ et 100+ articles)
- Teste la combinaison d'une remise client et d'une remise quantité
- Teste tous les cas de `calculateShipping` (FR au-dessus de 50€, FR en dessous de 50€, BE, DE, autre pays)
- Utilise un data provider pour les cas de `calculateShipping`
- Vérifie la couverture avec `--coverage-text` : tu dois atteindre 100% sur `OrderCalculator`

**Résultat attendu** : La couverture de `OrderCalculator` est à 100% pour les lignes et les branches.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// tests/OrderCalculatorTest.php
// Tests complets pour une couverture à 100%

namespace App\Tests;

use PHPUnit\Framework\TestCase;
use App\OrderCalculator;

class OrderCalculatorTest extends TestCase
{
    private OrderCalculator $calculator;

    protected function setUp(): void
    {
        $this->calculator = new OrderCalculator();
    }

    // --- Tests de calculateTotal : type de client ---

    public function testCalculateTotalStandard(): void
    {
        // 10 × 5 = 50, pas de remise
        $result = $this->calculator->calculateTotal(10.0, 5, 'standard');

        $this->assertEquals(50.0, $result);
    }

    public function testCalculateTotalPremium(): void
    {
        // 10 × 5 = 50, 20% de remise = 40
        $result = $this->calculator->calculateTotal(10.0, 5, 'premium');

        $this->assertEquals(40.0, $result);
    }

    public function testCalculateTotalBusiness(): void
    {
        // 10 × 10 = 100, 15% de remise = 85
        $result = $this->calculator->calculateTotal(10.0, 10, 'business');

        $this->assertEquals(85.0, $result);
    }

    public function testCalculateTotalStudent(): void
    {
        // 10 × 10 = 100, 10% de remise = 90
        $result = $this->calculator->calculateTotal(10.0, 10, 'student');

        $this->assertEquals(90.0, $result);
    }

    // --- Tests de calculateTotal : remise de quantité ---

    public function testQuantityDiscount50Plus(): void
    {
        // 10 × 50 = 500, pas de remise client, 3% remise quantité
        // 500 × 0.97 = 485
        $result = $this->calculator->calculateTotal(10.0, 50, 'standard');

        $this->assertEquals(485.0, $result);
    }

    public function testQuantityDiscount100Plus(): void
    {
        // 10 × 100 = 1000, pas de remise client, 5% remise quantité
        // 1000 × 0.95 = 950
        $result = $this->calculator->calculateTotal(10.0, 100, 'standard');

        $this->assertEquals(950.0, $result);
    }

    public function testCombinedDiscountPremiumAnd100Plus(): void
    {
        // 10 × 100 = 1000, 20% premium = 800, 5% quantité = 760
        $result = $this->calculator->calculateTotal(10.0, 100, 'premium');

        $this->assertEquals(760.0, $result);
    }

    // --- Tests de calculateShipping ---

    public static function shippingProvider(): array
    {
        return [
            'France - livraison gratuite' => [100.0, 'FR', 0.0],
            'France - seuil exact 50€' => [50.0, 'FR', 0.0],
            'France - en dessous de 50€' => [30.0, 'FR', 5.99],
            'Belgique' => [100.0, 'BE', 9.99],
            'Allemagne' => [50.0, 'DE', 9.99],
            'Autre pays' => [100.0, 'US', 19.99],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('shippingProvider')]
    public function testCalculateShipping(
        float $total,
        string $country,
        float $expectedShipping
    ): void {
        $result = $this->calculator->calculateShipping($total, $country);

        $this->assertEqualsWithDelta($expectedShipping, $result, 0.001);
    }
}
```

Lance les tests avec couverture :

```bash
./vendor/bin/phpunit --coverage-text --coverage-filter src/OrderCalculator.php
```

**Résultat attendu** :

```text
OK (13 tests, 13 assertions)

Code Coverage Report:

App\OrderCalculator
  Methods: 100.00% ( 2/ 2)   Lines: 100.00% ( 25/ 25)
```

---

## Navigation

← Fiche précédente : **[Playwright avancé](08-playwright-avance.md)**

→ Fiche suivante : **[Tests d'API](10-tests-api.md)**
