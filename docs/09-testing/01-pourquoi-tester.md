---
tags:
  - Testing
  - Débutant
  - Concept
description: "Comprendre pourquoi les tests logiciels sont indispensables et découvrir les différents types de tests."
estimated_time: "45 min"
fiche_number: 1
total_fiches: 15
cursus: "Testing et Qualité"
---

# 01 - Pourquoi tester

> **En bref** : Cette fiche explique pourquoi les tests logiciels sont indispensables, présente la pyramide des tests et compare les différents types de tests. Lecture estimée : 45 min.

## Prérequis

- Savoir écrire du code PHP ou JavaScript (variables, fonctions, conditions)
- Aucune connaissance préalable des tests n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi les tests sont nécessaires, identifier les différents types de tests et comprendre la pyramide des tests.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un test logiciel ?

**Définition** : Un test logiciel est un programme qui vérifie automatiquement qu'un autre programme fonctionne comme prévu. Le test exécute du code et compare le résultat obtenu avec le résultat attendu.

**Le problème que les tests résolvent** :

Sans tests, voici les problèmes rencontrés :

1. **Bugs non détectés** : Tu modifies une fonction et tu casses une autre fonctionnalité sans le savoir. Le bug arrive en production et les utilisateurs le découvrent.
2. **Peur de modifier le code** : Tu n'oses pas refactoriser ou améliorer le code existant, parce que tu ne sais pas si tes modifications vont tout casser.
3. **Vérification manuelle longue** : Après chaque modification, tu dois manuellement tester toutes les fonctionnalités. C'est lent, ennuyeux et tu oublies forcément des cas.
4. **Régressions fréquentes** : Un bug corrigé il y a deux semaines réapparaît parce que personne n'a vérifié.

**Comment les tests résolvent ces problèmes** :

| Problème | Solution apportée par les tests |
| --- | --- |
| Bugs non détectés | Les tests détectent automatiquement les bugs avant la mise en production |
| Peur de modifier le code | Les tests te donnent confiance : si tous les tests passent, le code fonctionne |
| Vérification manuelle longue | Les tests s'exécutent en quelques secondes et vérifient tout automatiquement |
| Régressions fréquentes | Un test écrit pour un bug empêche ce bug de revenir |

**Analogie concrète** : Imagine que tu construis un meuble en kit. Avant de livrer le meuble, le fabricant vérifie chaque pièce : la vis fait bien 3 cm, la planche mesure bien 60 cm, les trous sont bien alignés. Les tests logiciels font la même chose avec ton code : ils vérifient chaque pièce séparément, puis vérifient que les pièces s'assemblent correctement.

**Ce qu'un test logiciel n'est PAS** :

- Un test n'est pas une preuve que le code est parfait. Les tests vérifient les cas que tu as prévus. Un bug peut exister dans un cas que tu n'as pas testé.
- Un test n'est pas du code de production. Le code de test ne fait pas partie de l'application livrée aux utilisateurs. Il sert uniquement à vérifier le code de production.

---

### Qu'est-ce que la pyramide des tests ?

**Définition** : La pyramide des tests est un modèle qui classe les tests en couches, du plus rapide et nombreux (en bas) au plus lent et rare (en haut). Elle guide le nombre de tests à écrire pour chaque type.

**Le problème que la pyramide des tests résout** :

Sans pyramide des tests, voici les problèmes rencontrés :

1. **Trop de tests lents** : L'équipe écrit uniquement des tests E2E (End-to-End). La suite de tests prend 45 minutes. Personne ne la lance.
2. **Mauvaise couverture** : L'équipe écrit des tests au hasard, sans stratégie. Certaines parties du code sont sur-testées, d'autres pas du tout.
3. **Tests fragiles** : Les tests de haut niveau cassent souvent pour des raisons qui n'ont rien à voir avec un vrai bug (changement de mise en page, lenteur réseau).

**Comment la pyramide résout ces problèmes** :

| Problème | Solution apportée par la pyramide |
| --- | --- |
| Trop de tests lents | La base large de tests unitaires rapides couvre la majorité du code |
| Mauvaise couverture | Chaque couche a un rôle précis et complémentaire |
| Tests fragiles | Les tests de haut niveau sont peu nombreux et ciblent les parcours critiques |

**Analogie concrète** : Imagine le contrôle qualité d'une usine automobile. En bas de la pyramide, on vérifie chaque boulon individuellement (rapide, des milliers de vérifications). Au milieu, on vérifie que le moteur assemblé démarre (quelques dizaines de vérifications). En haut, on fait un essai routier complet (quelques vérifications, mais longues). On ne fait pas 1000 essais routiers : ce serait trop long et coûteux.

**Ce que la pyramide des tests n'est PAS** :

- La pyramide n'est pas une règle absolue. C'est un guide. Certains projets (une API REST par exemple) peuvent avoir plus de tests d'intégration que de tests unitaires.
- La pyramide n'est pas un objectif en soi. L'objectif est d'avoir confiance dans le code, pas de remplir chaque couche de la pyramide.

**Structure de la pyramide** :

```text
        /\
       /  \        Tests E2E (End-to-End)
      /    \       - Peu nombreux (5-10%)
     /------\      - Lents (secondes a minutes)
    /        \     Tests d'integration
   /          \    - Nombre moyen (15-25%)
  /            \   - Vitesse moyenne
 /--------------\
/                \ Tests unitaires
/                  \ - Tres nombreux (65-80%)
/____________________\ - Tres rapides (millisecondes)
```

<div class="diagram-design">
<p><a href="../../diagrams/09-testing-01-pourquoi-tester-1.html">Qu&#x27;est-ce que la pyramide des tests ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/09-testing-01-pourquoi-tester-1.html" title="Qu&#x27;est-ce que la pyramide des tests ?" style="width:100%;min-height:496px;border:0;background:transparent"></iframe>
</div>

Plus on descend dans la pyramide, plus les tests sont nombreux et rapides. Plus on monte, plus les tests sont réalistes mais lents et coûteux.

---

### Qu'est-ce qu'un test unitaire ?

**Définition** : Un test unitaire vérifie le comportement d'une seule unité de code (une fonction ou une méthode) de manière isolée, sans dépendance externe (base de données, fichier, réseau).

**Le problème que les tests unitaires résolvent** :

Sans tests unitaires, voici les problèmes rencontrés :

1. **Localisation difficile des bugs** : Quand un test de haut niveau échoue, tu ne sais pas quelle fonction est en cause.
2. **Feedback lent** : Tu dois lancer toute l'application pour vérifier qu'une simple fonction de calcul fonctionne.

**Comment les tests unitaires résolvent ces problèmes** :

| Problème | Solution apportée par les tests unitaires |
| --- | --- |
| Localisation difficile | Un test unitaire pointe directement la fonction qui ne marche pas |
| Feedback lent | Un test unitaire s'exécute en quelques millisecondes |

**Analogie concrète** : Avant de monter un meuble, tu vérifies chaque pièce séparément : cette vis fait-elle bien 3 cm ? Cette planche est-elle bien droite ? Tu ne montes pas le meuble entier pour découvrir qu'une vis est trop courte.

**Exemple concret** :

```php
// Fonction à tester
function addition(int $a, int $b): int
{
    return $a + $b;
}

// Test unitaire
// On vérifie que addition(2, 3) retourne bien 5
$resultat = addition(2, 3);
assert($resultat === 5); // Passe : 2 + 3 = 5
```

---

### Qu'est-ce qu'un test d'intégration ?

**Définition** : Un test d'intégration vérifie que plusieurs unités de code fonctionnent correctement ensemble. Il teste les interactions entre composants (par exemple, un service qui utilise un repository pour accéder à la base de données).

**Le problème que les tests d'intégration résolvent** :

Sans tests d'intégration, voici les problèmes rencontrés :

1. **Faux sentiment de sécurité** : Tous les tests unitaires passent, mais les composants ne fonctionnent pas ensemble.
2. **Problèmes de configuration** : La connexion à la base de données échoue, mais aucun test unitaire ne le détecte.

**Comment les tests d'intégration résolvent ces problèmes** :

| Problème | Solution apportée par les tests d'intégration |
| --- | --- |
| Faux sentiment de sécurité | On vérifie que les composants communiquent correctement |
| Problèmes de configuration | On teste avec les vraies dépendances (base de données de test) |

**Analogie concrète** : Tu as vérifié chaque pièce du meuble séparément (tests unitaires). Maintenant, tu vérifies que les pièces s'assemblent : la vis rentre bien dans le trou, la planche s'emboîte dans l'étagère. C'est le test d'intégration.

**Ce qu'un test d'intégration n'est PAS** :

- Un test d'intégration n'est pas un test unitaire. Le test unitaire isole une seule fonction. Le test d'intégration connecte plusieurs composants.
- Un test d'intégration n'est pas un test E2E. Le test d'intégration teste quelques composants ensemble. Le test E2E teste tout le système de bout en bout.

---

### Qu'est-ce qu'un test fonctionnel ?

**Définition** : Un test fonctionnel vérifie qu'une fonctionnalité complète de l'application fonctionne du point de vue de l'utilisateur, mais sans navigateur réel. Dans Symfony, il simule des requêtes HTTP et vérifie les réponses.

**Le problème que les tests fonctionnels résolvent** :

Sans tests fonctionnels, voici les problèmes rencontrés :

1. **Parcours utilisateur non vérifiés** : Tu sais que chaque composant fonctionne individuellement, mais tu ne sais pas si le parcours complet (remplir un formulaire, soumettre, voir la confirmation) fonctionne.
2. **Régressions sur les routes** : Une URL qui fonctionnait retourne maintenant une erreur 500, et personne ne le sait.

**Comment les tests fonctionnels résolvent ces problèmes** :

| Problème | Solution apportée par les tests fonctionnels |
| --- | --- |
| Parcours non vérifiés | On simule le parcours utilisateur complet |
| Régressions sur les routes | On vérifie que chaque route retourne le bon code HTTP |

**Analogie concrète** : Tu as vérifié les pièces (unitaire) et leur assemblage (intégration). Maintenant, tu ouvres et fermes les tiroirs du meuble pour vérifier qu'ils coulissent bien. Tu testes la fonctionnalité du meuble, pas ses pièces.

---

### Qu'est-ce qu'un test E2E (End-to-End) ?

**Définition** : Un test E2E (End-to-End, de bout en bout) vérifie l'application complète dans un vrai navigateur, exactement comme un utilisateur réel le ferait. Il clique sur des boutons, remplit des formulaires et vérifie ce qui s'affiche à l'écran.

**Le problème que les tests E2E résolvent** :

Sans tests E2E, voici les problèmes rencontrés :

1. **Problèmes visuels non détectés** : Le bouton existe dans le HTML, mais il est caché derrière un autre élément. Les tests fonctionnels ne le voient pas.
2. **JavaScript non testé** : Les tests fonctionnels Symfony ne peuvent pas exécuter le JavaScript du navigateur.

**Comment les tests E2E résolvent ces problèmes** :

| Problème | Solution apportée par les tests E2E |
| --- | --- |
| Problèmes visuels | Le test utilise un vrai navigateur et voit ce que l'utilisateur voit |
| JavaScript non testé | Le navigateur exécute tout le JavaScript de l'application |

**Analogie concrète** : Le meuble est monté et installé dans la pièce. Tu demandes à quelqu'un d'utiliser le meuble normalement : ranger des livres, ouvrir les portes, poser des objets. Cette personne teste le meuble dans son contexte réel.

**Comparaison entre les types de tests** :

| Critère | Unitaire | Intégration | Fonctionnel | E2E |
| --- | --- | --- | --- | --- |
| Vitesse | Très rapide | Rapide | Moyen | Lent |
| Nombre recommandé | Beaucoup | Moyen | Moyen | Peu |
| Navigateur requis | Non | Non | Non | Oui |
| Base de données | Non | Oui | Oui | Oui |
| Confiance | Faible (isolé) | Moyenne | Bonne | Très bonne |
| Coût de maintenance | Faible | Moyen | Moyen | Élevé |

---

### Quel est le coût de correction d'un bug ?

**Définition** : Le coût de correction d'un bug augmente de manière exponentielle à mesure qu'il est détecté tard dans le cycle de développement.

**Tableau des coûts relatifs** :

| Phase de détection | Coût relatif | Exemple |
| --- | --- | --- |
| Pendant l'écriture du code | x1 | Tu corriges immédiatement la faute de frappe |
| Pendant les tests unitaires | x5 | Tu modifies la fonction et relances le test |
| Pendant les tests d'intégration | x15 | Tu dois comprendre l'interaction entre composants |
| Pendant les tests E2E | x30 | Tu dois investiguer dans toute l'application |
| En production | x100 | Support client, hotfix urgent, perte de données possible |

**Analogie concrète** : Imagine une erreur dans le plan d'un immeuble. Si tu la trouves sur le plan papier, tu gommes et tu corriges (coût faible). Si tu la trouves pendant la construction du 3e étage, tu dois casser et reconstruire (coût élevé). Si tu la trouves quand les habitants sont installés, tu dois les reloger, casser, reconstruire, et les réinstaller (coût très élevé).

---

### Tests manuels vs tests automatisés

**Définition** : Un test manuel est effectué par une personne qui utilise l'application. Un test automatisé est un programme qui exécute les vérifications à la place de la personne.

**Comparaison** :

| Critère | Test manuel | Test automatisé |
| --- | --- | --- |
| Vitesse | Lent (minutes à heures) | Rapide (secondes à minutes) |
| Fiabilité | Variable (fatigue, oubli) | Constante (même résultat à chaque fois) |
| Coût initial | Faible | Élevé (temps d'écriture) |
| Coût récurrent | Élevé (à chaque test) | Faible (on lance la commande) |
| Détection de régressions | Mauvaise | Excellente |
| Tests exploratoires | Excellent | Mauvais |

**Ce que les tests automatisés ne remplacent PAS** :

- Les tests exploratoires : un humain qui essaie des choses inhabituelles pour trouver des bugs
- Les tests d'accessibilité visuels : vérifier que l'interface est utilisable
- Les tests de performance perçue : vérifier que l'application "semble" rapide

---

## Étapes Pratiques

### Étape 1 : Observer un bug en production

Pour comprendre l'importance des tests, voici un scénario concret sans test.

Crée un fichier `Calculator.php` :

```php
<?php
// Calculator.php
// Cette classe effectue des calculs mathématiques simples

class Calculator
{
    // Additionne deux nombres
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    // Divise le premier nombre par le second
    public function divide(float $a, float $b): float
    {
        return $a / $b; // Bug : pas de vérification de la division par zéro
    }
}
```

Utilise cette classe :

```php
<?php
// main.php
require_once 'Calculator.php';

$calc = new Calculator();

// Ça fonctionne
echo $calc->add(2, 3); // Affiche : 5

// Ça plante en production !
echo $calc->divide(10, 0); // PHP Warning: Division by zero
```

**Résultat attendu** :

```text
5
PHP Warning:  Division by zero in Calculator.php on line 14
```

---

### Étape 2 : Écrire un premier test simple (sans framework)

Avant d'utiliser PHPUnit, écrivons un test à la main pour comprendre le principe.

Crée un fichier `test_calculator.php` :

```php
<?php
// test_calculator.php
// Ce fichier teste la classe Calculator sans framework de test

require_once 'Calculator.php';

// Compteurs de résultats
$tests_passes = 0;
$tests_echoues = 0;

// Fonction utilitaire qui vérifie une condition
function verifier(string $description, bool $condition): void
{
    global $tests_passes, $tests_echoues;

    if ($condition) {
        echo "[OK] $description\n";
        $tests_passes++;
    } else {
        echo "[ECHEC] $description\n";
        $tests_echoues++;
    }
}

$calc = new Calculator();

// Test 1 : addition de deux nombres positifs
$resultat = $calc->add(2, 3);
verifier("2 + 3 = 5", $resultat === 5.0);

// Test 2 : addition avec un nombre négatif
$resultat = $calc->add(-1, 5);
verifier("-1 + 5 = 4", $resultat === 4.0);

// Test 3 : addition de zéros
$resultat = $calc->add(0, 0);
verifier("0 + 0 = 0", $resultat === 0.0);

// Test 4 : division normale
$resultat = $calc->divide(10, 2);
verifier("10 / 2 = 5", $resultat === 5.0);

// Test 5 : division par zéro (doit lever une exception)
try {
    $calc->divide(10, 0);
    verifier("Division par zéro lève une exception", false); // Si on arrive ici, pas d'exception
} catch (\DivisionByZeroError $e) {
    verifier("Division par zéro lève une exception", true);
}

// Résumé
echo "\n--- Résumé ---\n";
echo "Tests passés : $tests_passes\n";
echo "Tests échoués : $tests_echoues\n";
```

Lance le test :

```bash
php test_calculator.php
```

**Résultat attendu** :

```text
[OK] 2 + 3 = 5
[OK] -1 + 5 = 4
[OK] 0 + 0 = 0
[OK] 10 / 2 = 5
[ECHEC] Division par zéro lève une exception

--- Résumé ---
Tests passés : 4
Tests échoués : 1
```

Le test 5 échoue : la division par zéro ne lève pas d'exception. Le test a détecté le bug.

---

### Étape 3 : Corriger le bug et relancer les tests

Corrige le fichier `Calculator.php` :

```php
<?php
// Calculator.php
// Cette classe effectue des calculs mathématiques simples

class Calculator
{
    // Additionne deux nombres
    public function add(float $a, float $b): float
    {
        return $a + $b;
    }

    // Divise le premier nombre par le second
    // Lève une exception si le diviseur est zéro
    public function divide(float $a, float $b): float
    {
        // On vérifie que le diviseur n'est pas zéro avant de diviser
        if ($b === 0.0) {
            throw new \DivisionByZeroError("Division par zéro impossible");
        }

        return $a / $b;
    }
}
```

Relance le test :

```bash
php test_calculator.php
```

**Résultat attendu** :

```text
[OK] 2 + 3 = 5
[OK] -1 + 5 = 4
[OK] 0 + 0 = 0
[OK] 10 / 2 = 5
[OK] Division par zéro lève une exception

--- Résumé ---
Tests passés : 5
Tests échoués : 0
```

Tous les tests passent. Le bug est corrigé et le test empêchera ce bug de revenir.

---

### Étape 4 : Comprendre le cycle de vie d'un test

Voici le cycle de vie standard d'un test automatisé :

```text
1. ARRANGE (Préparer)
   → Créer les objets nécessaires
   → Définir les données d'entrée

2. ACT (Agir)
   → Exécuter l'action à tester

3. ASSERT (Vérifier)
   → Comparer le résultat obtenu avec le résultat attendu
```

Exemple appliqué :

```php
<?php
// Cycle de vie d'un test : Arrange, Act, Assert

// 1. ARRANGE : on prépare les objets et les données
$calc = new Calculator();
$a = 10;
$b = 3;

// 2. ACT : on exécute l'action à tester
$resultat = $calc->add($a, $b);

// 3. ASSERT : on vérifie le résultat
assert($resultat === 13.0); // Le résultat doit être 13
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `php fichier_test.php` | Exécuter un fichier de test PHP simple |
| `node fichier_test.js` | Exécuter un fichier de test JavaScript simple |
| `echo $?` | Vérifier le code de retour (0 = succès, autre = échec) |

---

## Pièges Fréquents

### Piège 1 : Confondre test unitaire et test d'intégration

**Problème** : Tu écris un test qui accède à la base de données et tu l'appelles "test unitaire". Ce n'est pas un test unitaire car il dépend d'un composant externe.

**Solution** : Un test unitaire ne dépend d'aucune ressource externe (base de données, fichier, réseau). Si ton test a besoin d'une base de données, c'est un test d'intégration.

---

### Piège 2 : Ne tester que le cas "normal"

**Problème** : Tu écris un test pour `divide(10, 2)` et tu considères la fonction comme testée. Mais tu n'as pas testé `divide(10, 0)`.

**Solution** : Toujours tester au minimum :

- Le cas normal (happy path)
- Les cas limites (0, valeurs négatives, chaînes vides)
- Les cas d'erreur (entrée invalide, exception attendue)

---

### Piège 3 : Écrire des tests après avoir fini tout le projet

**Problème** : Tu codes toute l'application, puis tu essaies d'écrire les tests. Le code n'est pas conçu pour être testable, c'est très difficile.

**Solution** : Écrire les tests au fur et à mesure du développement. Idéalement, écrire le test avant le code (TDD, fiche 06).

---

### Piège 4 : Croire que 100% de couverture = zéro bug

**Problème** : Tu atteins 100% de couverture de code et tu penses que l'application est sans bug.

**Solution** : La couverture de code mesure les lignes exécutées par les tests, pas les cas testés. Une ligne peut être exécutée sans que tous ses comportements soient vérifiés. La couverture est un indicateur, pas une garantie.

---

## Checklist de Validation

- [ ] Je sais expliquer pourquoi les tests logiciels sont nécessaires
- [ ] Je connais les 4 types de tests (unitaire, intégration, fonctionnel, E2E)
- [ ] Je comprends la pyramide des tests et la proportion recommandée
- [ ] Je sais que le coût de correction d'un bug augmente avec le temps
- [ ] Je comprends la différence entre tests manuels et automatisés
- [ ] Je connais le cycle Arrange-Act-Assert
- [ ] J'ai écrit et exécuté un test simple en PHP

---

## Exercice Pratique

**Énoncé** : Crée une classe `StringUtils` avec les méthodes suivantes, puis écris des tests manuels (sans framework) pour chaque méthode :

1. `reverse(string $text): string` - inverse une chaîne de caractères
2. `countWords(string $text): int` - compte le nombre de mots dans une chaîne
3. `isPalindrome(string $text): bool` - vérifie si une chaîne est un palindrome (se lit de la même façon dans les deux sens)

**Indications** :

- Pour chaque méthode, teste au minimum 3 cas : un cas normal, un cas limite (chaîne vide) et un cas spécial
- Utilise le pattern Arrange-Act-Assert
- Affiche un résumé des tests passés et échoués
- Pour `isPalindrome`, ignore la casse (majuscules/minuscules)

**Résultat attendu** : Tous les tests passent et le résumé affiche 0 test échoué.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```php
<?php
// StringUtils.php
// Classe utilitaire pour manipuler les chaînes de caractères

class StringUtils
{
    // Inverse une chaîne de caractères
    // Exemple : "Bonjour" → "ruojnoB"
    public function reverse(string $text): string
    {
        return strrev($text);
    }

    // Compte le nombre de mots dans une chaîne
    // Un mot est séparé par un ou plusieurs espaces
    public function countWords(string $text): int
    {
        // On supprime les espaces en début et fin de chaîne
        $trimmed = trim($text);

        // Si la chaîne est vide, il y a 0 mot
        if ($trimmed === '') {
            return 0;
        }

        // str_word_count compte les mots
        return str_word_count($trimmed);
    }

    // Vérifie si une chaîne est un palindrome (ignore la casse)
    // Un palindrome se lit de la même façon dans les deux sens
    // Exemple : "Kayak" → true
    public function isPalindrome(string $text): bool
    {
        // On met en minuscules pour ignorer la casse
        $lower = mb_strtolower($text);

        // On compare la chaîne avec son inverse
        return $lower === strrev($lower);
    }
}
```

```php
<?php
// test_string_utils.php
// Tests de la classe StringUtils

require_once 'StringUtils.php';

$tests_passes = 0;
$tests_echoues = 0;

function verifier(string $description, bool $condition): void
{
    global $tests_passes, $tests_echoues;

    if ($condition) {
        echo "[OK] $description\n";
        $tests_passes++;
    } else {
        echo "[ECHEC] $description\n";
        $tests_echoues++;
    }
}

$utils = new StringUtils();

// --- Tests de reverse() ---
echo "=== Tests de reverse() ===\n";

// Cas normal
$resultat = $utils->reverse("Bonjour");
verifier("reverse('Bonjour') = 'ruojnoB'", $resultat === "ruojnoB");

// Cas limite : chaîne vide
$resultat = $utils->reverse("");
verifier("reverse('') = ''", $resultat === "");

// Cas spécial : un seul caractère
$resultat = $utils->reverse("A");
verifier("reverse('A') = 'A'", $resultat === "A");

// --- Tests de countWords() ---
echo "\n=== Tests de countWords() ===\n";

// Cas normal
$resultat = $utils->countWords("Bonjour le monde");
verifier("countWords('Bonjour le monde') = 3", $resultat === 3);

// Cas limite : chaîne vide
$resultat = $utils->countWords("");
verifier("countWords('') = 0", $resultat === 0);

// Cas spécial : espaces multiples
$resultat = $utils->countWords("  Bonjour   le   monde  ");
verifier("countWords avec espaces multiples = 3", $resultat === 3);

// Cas spécial : un seul mot
$resultat = $utils->countWords("Bonjour");
verifier("countWords('Bonjour') = 1", $resultat === 1);

// --- Tests de isPalindrome() ---
echo "\n=== Tests de isPalindrome() ===\n";

// Cas normal : palindrome
$resultat = $utils->isPalindrome("kayak");
verifier("isPalindrome('kayak') = true", $resultat === true);

// Cas normal : pas un palindrome
$resultat = $utils->isPalindrome("bonjour");
verifier("isPalindrome('bonjour') = false", $resultat === false);

// Cas limite : chaîne vide (un palindrome par convention)
$resultat = $utils->isPalindrome("");
verifier("isPalindrome('') = true", $resultat === true);

// Cas spécial : casse mixte
$resultat = $utils->isPalindrome("Kayak");
verifier("isPalindrome('Kayak') = true (ignore la casse)", $resultat === true);

// Résumé
echo "\n--- Résumé ---\n";
echo "Tests passés : $tests_passes\n";
echo "Tests échoués : $tests_echoues\n";
```

Lance le test :

```bash
php test_string_utils.php
```

**Résultat attendu** :

```text
=== Tests de reverse() ===
[OK] reverse('Bonjour') = 'ruojnoB'
[OK] reverse('') = ''
[OK] reverse('A') = 'A'

=== Tests de countWords() ===
[OK] countWords('Bonjour le monde') = 3
[OK] countWords('') = 0
[OK] countWords avec espaces multiples = 3
[OK] countWords('Bonjour') = 1

=== Tests de isPalindrome() ===
[OK] isPalindrome('kayak') = true
[OK] isPalindrome('bonjour') = false
[OK] isPalindrome('') = true
[OK] isPalindrome('Kayak') = true (ignore la casse)

--- Résumé ---
Tests passés : 10
Tests échoués : 0
```

---

## Navigation

→ Fiche suivante : **[Tests unitaires PHP (PHPUnit)](02-tests-unitaires-php.md)**
