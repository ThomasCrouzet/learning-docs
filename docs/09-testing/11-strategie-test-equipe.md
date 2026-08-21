---
tags:
  - Testing
  - Avancé
  - Concept
description: "Définir une stratégie de test en équipe : quoi tester, quand, combien, et adapter la pyramide des tests à son projet."
estimated_time: "60 min"
fiche_number: 11
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.strategie-test-equipe"
course_id: "web.testing"
content_type: "lesson"
order: 11
---

# 11 - Stratégie de test en équipe

> **En bref** : Cette fiche explique comment définir une stratégie de test adaptée à ton projet : quoi tester en priorité, combien de tests écrire par type, quand écrire les tests et comment organiser le testing en équipe. Lecture estimée : 60 min.

## Prérequis

- [Fiche 01 - Pourquoi tester](01-pourquoi-tester.md) (pyramide des tests, types de tests)
- [Fiche 02 - Tests unitaires PHP](02-tests-unitaires-php.md) (PHPUnit)
- [Fiche 03 - Tests unitaires JS](03-tests-unitaires-js.md) (Jest)
- [Fiche 04 - Tests d'intégration Symfony](04-tests-integration-symfony.md)
- [Fiche 05 - Tests fonctionnels Symfony](05-tests-fonctionnels-symfony.md)
- [Fiche 06 - Introduction au TDD](06-introduction-tdd.md)
- [Fiche 07 - Tests E2E avec Playwright](07-tests-e2e-playwright.md)
- [Fiche 08 - Playwright avancé](08-playwright-avance.md)
- [Fiche 09 - Couverture de code](09-couverture-code.md)
- Avoir écrit et lancé des tests dans au moins 2 des types (unitaire, intégration, fonctionnel, E2E)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras choisir quoi tester en priorité, définir la proportion de tests par type, décider quand écrire les tests dans le cycle de développement et mettre en place des conventions de test en équipe.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une stratégie de test ?

**Définition** : Une stratégie de test est un plan qui définit quels types de tests écrire, en quelle quantité, pour quelles parties du code et à quel moment du cycle de développement. Elle répond à la question : "Comment investir notre temps de test pour un maximum de confiance ?"

**Le problème qu'une stratégie de test résout** :

Sans stratégie, voici les problèmes rencontrés :

1. **Tests au hasard** : Chaque développeur écrit les tests qui lui semblent utiles. Certaines parties du code sont sur-testées, d'autres pas du tout.
2. **Investissement mal réparti** : L'équipe passe 2 jours à écrire des tests E2E pour une page de mentions légales, mais la page de paiement n'a aucun test.
3. **Tests abandonnés** : Au début du projet, l'équipe écrit beaucoup de tests. Sous la pression des deadlines, les tests sont abandonnés. Le projet se retrouve sans filet de sécurité.

**Comment une stratégie résout ces problèmes** :

| Problème | Solution apportée par la stratégie |
| --- | --- |
| Tests au hasard | La stratégie définit des règles claires pour toute l'équipe |
| Investissement mal réparti | La stratégie priorise les parties critiques du code |
| Tests abandonnés | La stratégie s'intègre au processus de développement (CI/CD, code review) |

**Analogie concrète** : Imagine que tu protèges une maison contre les cambriolages. Sans stratégie, tu mets 10 serrures sur la porte d'entrée et tu oublies la fenêtre du rez-de-chaussée. Avec une stratégie, tu identifies tous les points d'entrée (portes, fenêtres, garage), tu évalues le risque de chacun et tu répartis le budget de sécurité en conséquence.

**Ce qu'une stratégie de test n'est PAS** :

- Une stratégie n'est pas un document figé. Elle évolue avec le projet, l'équipe et les retours d'expérience.
- Une stratégie n'est pas un dogme. Si une règle ne fonctionne pas dans ton contexte, adapte-la.

---

### Comment identifier le code critique ?

**Définition** : Le code critique est le code dont le dysfonctionnement aurait un impact élevé sur les utilisateurs, l'entreprise ou la sécurité. C'est ce code qui doit être testé en priorité.

**Analogie concrète** : Identifier le code critique, c'est comme un pompier qui inspecte un immeuble pour repérer les zones à risque. Il vérifie en priorité la chaufferie (impact élevé en cas de panne), les issues de secours (sécurité) et l'ascenseur (utilisé par beaucoup de monde). Il ne passe pas 2 heures à inspecter le local poubelles. De la même façon, tu concentres tes tests sur le code qui, en cas de bug, causerait le plus de dégâts.

**Critères pour identifier le code critique** :

| Critère | Impact | Exemple |
| --- | --- | --- |
| Fréquence d'utilisation | Code utilisé par beaucoup d'utilisateurs, souvent | Page d'accueil, recherche, connexion |
| Impact financier | Code qui gère de l'argent ou des transactions | Paiement, facturation, remises |
| Impact sécurité | Code qui gère l'authentification ou les autorisations | Login, rôles, permissions |
| Complexité algorithmique | Code avec beaucoup de branches et de cas limites | Calcul de prix, moteur de règles |
| Point d'intégration | Code qui communique avec des services externes | API tierces, envoi d'emails, webhooks |
| Code modifié fréquemment | Code qui change souvent (risque de régression) | Fonctionnalités en cours d'évolution |

**Le problème que la priorisation résout** :

Sans priorisation, voici les problèmes rencontrés :

1. **Temps limité gaspillé** : Tu as 2 heures pour écrire des tests. Tu les passes sur du code trivial au lieu du code critique.
2. **Faux sentiment de sécurité** : Tu as 200 tests sur les getters/setters, mais 0 test sur le calcul de facture.

**Comment prioriser** :

| Priorité | Quoi tester | Type de test recommandé |
| --- | --- | --- |
| P0 (critique) | Paiement, authentification, données sensibles | Unitaire + intégration + E2E |
| P1 (important) | CRUD principal, recherche, navigation | Unitaire + fonctionnel |
| P2 (utile) | Pages statiques, préférences utilisateur | Fonctionnel |
| P3 (optionnel) | Page "à propos", footer, mentions légales | Pas de test (ou un test de fumée) |

---

### Comment adapter la pyramide des tests à son projet ?

**Définition** : La pyramide des tests classique (beaucoup de tests unitaires, peu de tests E2E) n'est pas universelle. Elle doit être adaptée au type de projet.

**Analogie concrète** : Adapter la pyramide des tests, c'est comme choisir l'équipement de sécurité pour un chantier. Sur un chantier de démolition, tu investis surtout dans les casques et les gilets lourds (tests unitaires solides). Sur un chantier en hauteur, tu investis dans les harnais et les filets (tests E2E). La tenue de sécurité standard existe, mais elle doit être adaptée au type de chantier. Il n'y a pas d'équipement universel qui convient à tous les cas.

**Pyramide classique vs pyramide adaptée** :

| Type de projet | Tests unitaires | Tests intégration | Tests fonctionnels | Tests E2E |
| --- | --- | --- | --- | --- |
| Bibliothèque PHP (calcul, algorithme) | 80% | 15% | 0% | 5% |
| API REST Symfony | 40% | 30% | 25% | 5% |
| Application Symfony + React (SPA) | 30% | 20% | 20% | 30% |
| Site statique (peu de logique) | 10% | 10% | 30% | 50% |

**Le problème de la pyramide rigide** :

Sans adaptation, voici les problèmes rencontrés :

1. **Tests unitaires inutiles** : Tu écris 100 tests unitaires pour un CRUD simple. Chaque test vérifie un getter ou un setter. Le vrai risque est dans l'intégration avec la base de données, mais il n'y a aucun test d'intégration.
2. **Pas assez de tests E2E** : Ton application est une SPA React avec beaucoup d'interactions utilisateur. Les tests unitaires ne détectent pas les problèmes de navigation et d'affichage.

**Comment adapter** :

- **Beaucoup de logique métier** (calculs, règles) : plus de tests unitaires
- **Beaucoup d'intégration** (base de données, API) : plus de tests d'intégration
- **Beaucoup d'interface** (formulaires, navigation) : plus de tests fonctionnels et E2E
- **Application critique** (finance, santé) : plus de tests à tous les niveaux

---

### Quand écrire les tests ?

**Définition** : Il existe plusieurs approches pour décider à quel moment du développement écrire les tests.

**Le problème que le choix du moment résout** :

Sans réflexion sur le moment :

1. **Tests toujours repoussés** : "Je testerai plus tard" devient "Je ne testerai jamais". Le code s'accumule sans tests et devient difficile à tester après coup.
2. **Tests inadaptés au contexte** : tu appliques le TDD à un prototype jetable (perte de temps) ou tu écris les tests après coup pour du code critique de calcul financier (risque de bug en production).
3. **Code non testable** : quand les tests sont écrits après le code, le code n'a pas été conçu pour être testable. Il faut le refactoriser avant de pouvoir le tester, ce qui prend du temps supplémentaire.

**Comment le choix du moment résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tests toujours repoussés | L'approche "Test Along" intègre les tests au développement quotidien |
| Tests inadaptés au contexte | Le TDD est réservé au code complexe, le "Test After" aux prototypes |
| Code non testable | Le TDD force à écrire du code testable dès le départ |

**Analogie concrète** : Choisir quand écrire les tests, c'est comme choisir quand vérifier les mesures en menuiserie. Pour un meuble sur mesure (code critique), tu mesures avant de couper (TDD) : une erreur coûte cher. Pour une étagère simple (CRUD), tu mesures pendant que tu assembles (Test Along). Pour un meuble temporaire (prototype), tu vérifies à la fin que ça tient debout (Test After). Et si une planche casse (bug en production), tu mesures la pièce de remplacement avant de la poser (rétro-testing).

**Les 4 approches** :

| Approche | Quand écrire le test | Avantages | Inconvénients |
| --- | --- | --- | --- |
| TDD (Test First) | Avant le code | Code testable dès le départ, conception guidée | Courbe d'apprentissage, plus lent au début |
| Test Along | Pendant le développement | Bon compromis vitesse/qualité | Risque de tester uniquement le happy path |
| Test After | Après avoir fini la fonctionnalité | Rapide à développer | Code pas toujours testable, tests souvent bâclés |
| Rétro-testing | Après un bug en production | Empêche le bug de revenir | Réactif, pas proactif |

**Recommandation par contexte** :

| Contexte | Approche recommandée |
| --- | --- |
| Logique métier complexe (calculs, règles) | TDD |
| CRUD simple | Test Along |
| Prototype ou preuve de concept | Test After |
| Bug en production | Rétro-testing (écrire un test qui reproduit le bug, puis corriger) |
| Code legacy sans tests | Rétro-testing progressif |

---

### Qu'est-ce qu'un test de fumée (smoke test) ?

**Définition** : Un test de fumée est un test minimaliste qui vérifie que l'application démarre et que les fonctionnalités de base fonctionnent. Il ne teste pas en profondeur, mais détecte les pannes majeures.

**Le problème que les tests de fumée résolvent** :

Sans tests de fumée, voici les problèmes rencontrés :

1. **Déploiement cassé non détecté** : Tu déploies une nouvelle version. Le serveur démarre, mais la page d'accueil retourne une erreur 500. Personne ne le remarque pendant 2 heures.
2. **Base de données inaccessible** : La configuration de la base de données est incorrecte après un déploiement. Aucune page ne fonctionne, mais les tests unitaires passent (ils n'utilisent pas la base).

**Comment les tests de fumée résolvent ces problèmes** :

| Problème | Solution apportée par les tests de fumée |
| --- | --- |
| Déploiement cassé | Le test vérifie que la page d'accueil répond en 200 |
| Base de données inaccessible | Le test vérifie qu'une page qui lit en base fonctionne |

**Exemple de tests de fumée pour un projet Symfony** :

```php
<?php
// tests/SmokeTest.php
// Tests de fumée : vérifient que l'application ne crashe pas

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SmokeTest extends WebTestCase
{
    // Vérifie que les pages principales répondent sans erreur
    public static function urlProvider(): array
    {
        return [
            'page accueil' => ['/'],
            'liste produits' => ['/products'],
            'API produits' => ['/api/products'],
            'page login' => ['/login'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('urlProvider')]
    public function testPageLoads(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        // On vérifie que la page ne crashe pas (pas d'erreur 500)
        $this->assertResponseIsSuccessful();
    }
}
```

**Analogie concrète** : Avant de prendre la route, tu vérifies que le moteur démarre, que les phares fonctionnent et que les freins répondent. Tu ne fais pas un contrôle technique complet : c'est un test de fumée. Si une de ces vérifications échoue, tu ne prends pas la route.

---

### Comment organiser les tests dans un projet ?

**Définition** : L'organisation des tests suit des conventions de nommage et de structure qui facilitent la maintenance et la lisibilité.

**Le problème que l'organisation résout** :

Sans organisation :

1. **Tests introuvables** : tu cherches le test du `PriceCalculator` et tu ne sais pas s'il est dans `tests/`, `tests/unit/`, `tests/services/` ou à la racine. Tu perds du temps à chercher.
2. **Tests en double** : deux développeurs écrivent chacun un test pour la même classe sans le savoir, car il n'y a pas de convention sur l'emplacement.
3. **Suites de tests impossibles à configurer** : tu veux lancer uniquement les tests unitaires (rapides) mais ils sont mélangés avec les tests d'intégration (lents) dans le même dossier.

**Comment l'organisation résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tests introuvables | La structure en miroir de `src/` permet de trouver un test instantanément |
| Tests en double | Chaque fichier source a un seul emplacement de test possible |
| Suites impossibles à configurer | Les dossiers séparés (Unit, Integration, Functional) permettent de cibler une suite |

**Analogie concrète** : Organiser les tests dans un projet, c'est comme ranger les outils dans un atelier. Les tournevis sont dans le tiroir "tournevis", les clés dans le tiroir "clés" et les pinces dans le tiroir "pinces". Chaque tiroir correspond à un type d'outil (type de test). À l'intérieur, les outils sont rangés par taille (par module). Quand tu as besoin d'un tournevis cruciforme taille 2 (le test du `PriceCalculator`), tu sais exactement dans quel tiroir et à quel endroit le chercher.

**Structure recommandée pour un projet Symfony** :

```text
tests/
├── Unit/                      # Tests unitaires
│   ├── Service/               # Miroir de src/Service/
│   │   ├── CalculatorTest.php
│   │   └── PriceFormatterTest.php
│   └── Util/                  # Miroir de src/Util/
│       └── StringUtilsTest.php
├── Integration/               # Tests d'intégration
│   ├── Repository/            # Tests de requêtes BDD
│   │   └── ProductRepositoryTest.php
│   └── Service/               # Tests de services avec BDD
│       └── ProductServiceTest.php
├── Functional/                # Tests fonctionnels
│   ├── Controller/            # Tests de contrôleurs
│   │   └── ProductControllerTest.php
│   └── Api/                   # Tests d'API
│       └── ProductApiTest.php
├── E2E/                       # Tests End-to-End (Playwright)
│   ├── pages/                 # Page Objects
│   ├── fixtures/              # Fixtures Playwright
│   └── specs/                 # Fichiers de test
│       ├── login.spec.js
│       └── products.spec.js
└── SmokeTest.php              # Tests de fumée
```

**Conventions de nommage** :

| Élément | Convention | Exemple |
| --- | --- | --- |
| Fichier de test | `[NomClasse]Test.php` | `CalculatorTest.php` |
| Classe de test | `[NomClasse]Test` | `class CalculatorTest` |
| Méthode de test | `test[Action][Condition][Résultat]` | `testDivideByZeroThrowsException` |
| Dossier | Miroir de `src/` | `tests/Unit/Service/` = `src/Service/` |

---

### Comment intégrer les tests dans le workflow d'équipe ?

**Définition** : Les tests doivent faire partie du processus de développement, pas être une étape optionnelle. Voici les points d'intégration.

**Le problème que l'intégration dans le workflow résout** :

Sans intégration dans le workflow :

1. **Tests oubliés** : les développeurs écrivent du code sans tests parce que personne ne vérifie. Les tests existent dans la documentation, mais pas dans la pratique quotidienne.
2. **Bugs détectés trop tard** : un bug est introduit lundi. Il n'est détecté que vendredi, quand un testeur manuel le découvre. Le développeur a oublié le contexte et met plus de temps à corriger.
3. **Qualité inégale** : un développeur senior écrit des tests rigoureux, un junior n'en écrit pas. Le projet a des zones bien testées et des zones sans aucun test, sans que personne ne le sache.

**Comment l'intégration dans le workflow résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tests oubliés | La CI bloque le merge si les tests manquent ou échouent |
| Bugs détectés trop tard | Les tests s'exécutent à chaque push, le bug est détecté en minutes |
| Qualité inégale | Les règles d'équipe et la code review garantissent un niveau minimum |

**Analogie concrète** : Intégrer les tests dans le workflow, c'est comme les contrôles qualité sur une chaîne de montage automobile.
Au lieu de vérifier la voiture une seule fois à la fin (en production), des contrôles sont effectués à chaque étape :
après la soudure (pre-commit), après la peinture (push), après l'assemblage du moteur (pull request) et avant la livraison au client (déploiement).
Si un défaut est détecté, la pièce est renvoyée pour correction immédiatement, pas après l'assemblage complet.

**Points d'intégration** :

| Moment | Action | Outil |
| --- | --- | --- |
| Avant le commit | Lancer les tests unitaires rapides | Git hook pre-commit |
| À chaque push | Lancer toute la suite de tests | CI/CD (GitHub Actions, GitLab CI) |
| À chaque pull request | Vérifier la couverture minimale | CI/CD + rapport de couverture |
| Pendant la code review | Vérifier que les tests sont présents et pertinents | Convention d'équipe |
| Avant le déploiement | Lancer les tests de fumée et les tests E2E | Pipeline de déploiement |

**Règles d'équipe recommandées** :

1. **Pas de merge sans tests** : Chaque pull request doit inclure des tests pour le nouveau code
2. **Couverture non décroissante** : La couverture globale ne doit pas baisser après un merge
3. **Tests obligatoires pour les bugs** : Chaque bug corrigé doit avoir un test de régression
4. **Nommage cohérent** : Toute l'équipe suit les mêmes conventions de nommage
5. **Tests rapides en premier** : La CI lance d'abord les tests unitaires (secondes), puis les tests d'intégration (minutes), puis les tests E2E (minutes)

---

## Étapes Pratiques

### Étape 1 : Faire l'inventaire du code critique

Avant d'écrire un seul test, identifie les parties critiques de ton projet.

Crée un fichier `tests/TESTING_STRATEGY.md` (ce fichier est un outil de travail interne) :

```text
# Stratégie de test

## Code critique (P0)
- Calcul des prix et remises (src/Service/PriceCalculator.php)
- Authentification (src/Security/)
- API de paiement (src/Controller/Api/PaymentController.php)

## Code important (P1)
- CRUD produits (src/Controller/ProductController.php)
- Recherche (src/Service/SearchService.php)
- Gestion des utilisateurs (src/Controller/UserController.php)

## Code utile (P2)
- Pages de catégories (src/Controller/CategoryController.php)
- Export CSV (src/Service/ExportService.php)

## Code optionnel (P3)
- Page "À propos" (src/Controller/StaticPageController.php)
- Footer dynamique

## Objectifs de couverture
- Global : 70%
- Code P0 : 90%+
- Code P1 : 70%+
- Code P2 : 50%+
- Code P3 : test de fumée uniquement
```

---

### Étape 2 : Créer les tests de fumée du projet

Crée un test de fumée qui vérifie que toutes les pages principales fonctionnent :

```php
<?php
// tests/SmokeTest.php
// Tests de fumée : vérifient que l'application démarre et répond

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SmokeTest extends WebTestCase
{
    // Liste toutes les URLs publiques du projet
    public static function publicUrlProvider(): array
    {
        return [
            'accueil' => ['/'],
            'login' => ['/login'],
            'produits' => ['/products'],
            'API produits' => ['/api/products'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('publicUrlProvider')]
    public function testPublicPageResponds(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        // Vérifie que la page ne crashe pas (pas de 500)
        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertLessThan(
            500,
            $statusCode,
            "La page $url retourne une erreur serveur ($statusCode)"
        );
    }

    // Vérifie que la base de données est accessible
    public function testDatabaseConnection(): void
    {
        $client = static::createClient();
        $container = static::getContainer();

        // Récupère la connexion Doctrine
        $connection = $container->get('doctrine')->getConnection();

        // Exécute une requête simple
        $result = $connection->executeQuery('SELECT 1');

        $this->assertEquals('1', $result->fetchOne());
    }
}
```

Lance les tests de fumée :

```bash
# Lance uniquement les tests de fumée
./vendor/bin/phpunit tests/SmokeTest.php
```

**Résultat attendu** :

```text
PHPUnit 12.x.x by Sebastian Bergmann and contributors.

.....                                                               5 / 5 (100%)

OK (5 tests, 5 assertions)
```

---

### Étape 3 : Configurer les suites de tests par vitesse

Organise les tests en suites pour les lancer par vitesse. Modifie `phpunit.xml` :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<phpunit xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:noNamespaceSchemaLocation="vendor/phpunit/phpunit/phpunit.xsd"
         bootstrap="vendor/autoload.php"
         colors="true">

    <testsuites>
        <!-- Suite 1 : tests rapides (secondes) -->
        <testsuite name="Smoke">
            <file>tests/SmokeTest.php</file>
        </testsuite>

        <!-- Suite 2 : tests unitaires (secondes) -->
        <testsuite name="Unit">
            <directory>tests/Unit</directory>
        </testsuite>

        <!-- Suite 3 : tests d'intégration (dizaines de secondes) -->
        <testsuite name="Integration">
            <directory>tests/Integration</directory>
        </testsuite>

        <!-- Suite 4 : tests fonctionnels (dizaines de secondes) -->
        <testsuite name="Functional">
            <directory>tests/Functional</directory>
        </testsuite>
    </testsuites>

    <source>
        <include>
            <directory>src</directory>
        </include>
    </source>
</phpunit>
```

Lance une suite spécifique :

```bash
# Tests de fumée uniquement (très rapides)
./vendor/bin/phpunit --testsuite Smoke

# Tests unitaires uniquement (rapides)
./vendor/bin/phpunit --testsuite Unit

# Tous les tests
./vendor/bin/phpunit
```

**Résultat attendu** :

```text
PHPUnit 12.x.x by Sebastian Bergmann and contributors.

Testsuite: Unit
....................                                               20 / 20 (100%)

OK (20 tests, 25 assertions)
```

---

### Étape 4 : Créer un script de test rapide pour le développement

Crée un script qui lance les tests rapidement pendant le développement :

```bash
#!/bin/bash
# scripts/test-quick.sh
# Lance les tests rapides pendant le développement

echo "=== Tests de fumée ==="
./vendor/bin/phpunit --testsuite Smoke --no-coverage 2>&1 | tail -3

echo ""
echo "=== Tests unitaires ==="
./vendor/bin/phpunit --testsuite Unit --no-coverage 2>&1 | tail -3

echo ""
echo "=== Résumé ==="
TOTAL=$(./vendor/bin/phpunit --no-coverage 2>&1 | grep -E "^OK|^FAILURES")
echo "$TOTAL"
```

Rends le script exécutable :

```bash
chmod +x scripts/test-quick.sh
```

Lance le script :

```bash
./scripts/test-quick.sh
```

**Résultat attendu** :

```text
=== Tests de fumée ===
OK (5 tests, 5 assertions)

=== Tests unitaires ===
OK (20 tests, 25 assertions)

=== Résumé ===
OK (50 tests, 60 assertions)
```

---

### Étape 5 : Définir les règles de code review pour les tests

Crée une checklist que l'équipe utilise pendant la code review. Ajoute-la dans `TESTING_STRATEGY.md` :

```text
## Checklist de code review - Tests

### Présence des tests
- [ ] Les nouvelles fonctionnalités ont des tests
- [ ] Les bugs corrigés ont un test de régression
- [ ] Les cas d'erreur sont testés (pas seulement le happy path)

### Qualité des tests
- [ ] Chaque test a un nom descriptif (testXxxReturnsYyyWhenZzz)
- [ ] Chaque test suit le pattern Arrange-Act-Assert
- [ ] Les tests sont indépendants (pas de dépendance entre tests)
- [ ] Les tests ne dépendent pas de données extérieures

### Couverture
- [ ] La couverture globale n'a pas baissé
- [ ] Le code critique (P0) a une couverture >= 90%
- [ ] Le code important (P1) a une couverture >= 70%

### Performance
- [ ] Les tests unitaires ne font pas d'appel réseau
- [ ] Les tests unitaires ne font pas d'accès base de données
- [ ] La suite de tests complète s'exécute en moins de 5 minutes
```

---

### Étape 6 : Mesurer et suivre la couverture par module

Crée un script qui affiche la couverture par dossier :

```bash
#!/bin/bash
# scripts/coverage-report.sh
# Affiche la couverture par module

echo "=== Rapport de couverture par module ==="
echo ""

# Génère le rapport Clover
./vendor/bin/phpunit --coverage-clover coverage.xml 2>&1 | tail -1

echo ""
echo "Couverture par dossier :"
./vendor/bin/phpunit --coverage-text 2>&1 | grep -E "^\s+App\\"

echo ""
echo "=== Fichiers avec couverture < 50% ==="
./vendor/bin/phpunit --coverage-text 2>&1 | grep -E "Lines:\s+[0-4][0-9]\." || echo "Aucun fichier en dessous de 50%"
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `./vendor/bin/phpunit --testsuite Unit` | Lancer uniquement les tests unitaires |
| `./vendor/bin/phpunit --testsuite Smoke` | Lancer uniquement les tests de fumée |
| `./vendor/bin/phpunit --coverage-text` | Voir la couverture dans le terminal |
| `./vendor/bin/phpunit --testdox` | Affichage lisible des résultats |
| `./vendor/bin/phpunit --stop-on-failure` | Stopper au premier échec |
| `./vendor/bin/phpunit --no-coverage` | Lancer sans couverture (plus rapide) |
| `npx playwright test` | Lancer les tests E2E |
| `npx jest --coverage` | Lancer les tests JS avec couverture |

---

## Pièges Fréquents

### Piège 1 : Écrire des tests uniquement pour le happy path

⚠️ **Problème** : Tu testes que `createUser("alice@example.com")` fonctionne. Mais tu ne testes pas `createUser("")`, `createUser("pas-un-email")`, `createUser(null)`.

✅ **Solution** : Pour chaque test du cas normal, écris au moins 2 tests de cas d'erreur. Utilise cette liste de vérification :

- Entrée vide ou null
- Entrée trop longue ou trop courte
- Entrée avec des caractères spéciaux
- Entrée dupliquée (unicité)
- Limites numériques (0, négatif, très grand)

---

### Piège 2 : Tests trop couplés à l'implémentation

⚠️ **Problème** : Ton test vérifie que la méthode `save()` du repository est appelée exactement 1 fois avec exactement tel paramètre. Si tu refactorises le code (en gardant le même comportement), le test casse.

✅ **Solution** : Teste le comportement, pas l'implémentation. Au lieu de vérifier "la méthode save est appelée", vérifie "le produit existe en base de données après l'action".

```php
// ❌ Test couplé à l'implémentation
$mockRepo->expects($this->once())
    ->method('save')
    ->with($this->equalTo($product));

// ✅ Test du comportement
$this->client->request('POST', '/api/products', ...);
$this->assertResponseStatusCodeSame(201);
// Vérifie que le produit existe réellement
$this->assertNotNull($repo->findOneBy(['name' => 'Test']));
```

---

### Piège 3 : Suite de tests trop lente

⚠️ **Problème** : La suite de tests prend 15 minutes. Les développeurs ne la lancent plus en local. Les bugs sont détectés 30 minutes plus tard en CI.

✅ **Solution** : Organise les tests par vitesse et lance les tests rapides en premier :

1. Tests de fumée : < 10 secondes
2. Tests unitaires : < 30 secondes
3. Tests d'intégration : < 2 minutes
4. Tests fonctionnels : < 5 minutes
5. Tests E2E : < 10 minutes

En développement, lance uniquement les suites 1 et 2 (< 1 minute). La CI lance tout.

---

### Piège 4 : Pas de tests pour le code legacy

⚠️ **Problème** : Tu rejoins un projet de 50 000 lignes sans aucun test. Tu ne sais pas par où commencer.

✅ **Solution** : Applique la stratégie "test when touched" :

1. Ne tente pas d'écrire des tests pour tout le code existant
2. Quand tu modifies un fichier, ajoute des tests pour ce fichier
3. Quand tu corriges un bug, écris un test de régression
4. Commence par les tests de fumée (5 minutes d'effort, grande valeur)
5. Concentre-toi sur le code P0 (critique)

En 3 mois, les parties les plus modifiées du code auront des tests.

---

## Checklist de Validation

- [ ] Je sais identifier le code critique (P0) de mon projet
- [ ] Je sais adapter la pyramide des tests à mon type de projet
- [ ] Je sais organiser les tests en suites (Smoke, Unit, Integration, Functional)
- [ ] Je sais écrire des tests de fumée
- [ ] Je sais lancer une suite de tests spécifique avec PHPUnit
- [ ] Je comprends les 4 approches temporelles (TDD, Test Along, Test After, Rétro-testing)
- [ ] Je sais définir des règles de test pour une équipe
- [ ] Je comprends la stratégie "test when touched" pour le code legacy

---

## Exercice Pratique

**Énoncé** : Tu travailles sur un projet Symfony de e-commerce avec les fonctionnalités suivantes. Définis une stratégie de test complète.

Fonctionnalités du projet :

1. Page d'accueil avec les produits mis en avant
2. Catalogue de produits avec recherche et filtres
3. Page de détail d'un produit
4. Panier d'achat (ajout, suppression, modification de quantité)
5. Processus de commande (adresse, paiement, confirmation)
6. Espace utilisateur (profil, historique des commandes)
7. API REST pour l'application mobile
8. Back-office admin (gestion des produits, commandes, utilisateurs)
9. Envoi d'emails (confirmation de commande, réinitialisation de mot de passe)
10. Page "Mentions légales" et "Conditions générales"

**Indications** :

- Classe chaque fonctionnalité en P0, P1, P2 ou P3
- Pour chaque fonctionnalité, indique le type de test principal (unitaire, intégration, fonctionnel, E2E)
- Définis un objectif de couverture global et par priorité
- Écris les tests de fumée pour ce projet (au moins 6 URLs)
- Crée la configuration `phpunit.xml` avec les suites de tests
- Estime le nombre de tests par suite

**Résultat attendu** : Un document `TESTING_STRATEGY.md` complet et les tests de fumée qui passent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Classification des fonctionnalités** :

| Fonctionnalité | Priorité | Type de test principal | Justification |
| --- | --- | --- | --- |
| Processus de commande | P0 | Unitaire + intégration + E2E | Impact financier direct |
| Panier d'achat | P0 | Unitaire + fonctionnel | Calculs critiques (prix, quantités) |
| API REST | P0 | Fonctionnel (contrats) | Impact sur l'application mobile |
| Authentification | P0 | Intégration + fonctionnel | Impact sécurité |
| Catalogue et recherche | P1 | Fonctionnel + intégration | Forte utilisation |
| Espace utilisateur | P1 | Fonctionnel | Données personnelles |
| Back-office admin | P1 | Fonctionnel | Gestion des données |
| Page d'accueil | P2 | Fonctionnel | Vitrine, mais peu de logique |
| Envoi d'emails | P2 | Unitaire (templates) + intégration (envoi) | Vérifiable manuellement |
| Mentions légales | P3 | Test de fumée | Contenu statique |

**Objectifs de couverture** :

| Priorité | Objectif |
| --- | --- |
| Global | 70% |
| P0 | 90%+ |
| P1 | 70%+ |
| P2 | 50%+ |
| P3 | Test de fumée uniquement |

**Tests de fumée** :

```php
<?php
// tests/SmokeTest.php

namespace App\Tests;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;

class SmokeTest extends WebTestCase
{
    public static function publicUrlProvider(): array
    {
        return [
            'accueil' => ['/'],
            'catalogue' => ['/products'],
            'API produits' => ['/api/products'],
            'login' => ['/login'],
            'inscription' => ['/register'],
            'mentions légales' => ['/mentions-legales'],
            'panier' => ['/cart'],
        ];
    }

    #[\PHPUnit\Framework\Attributes\DataProvider('publicUrlProvider')]
    public function testPublicPageResponds(string $url): void
    {
        $client = static::createClient();
        $client->request('GET', $url);

        $statusCode = $client->getResponse()->getStatusCode();
        $this->assertLessThan(
            500,
            $statusCode,
            "La page $url retourne une erreur serveur ($statusCode)"
        );
    }
}
```

**Estimation du nombre de tests** :

| Suite | Nombre estimé | Temps estimé |
| --- | --- | --- |
| Smoke | 7-10 tests | < 5 secondes |
| Unit | 60-80 tests | < 20 secondes |
| Integration | 20-30 tests | < 1 minute |
| Functional | 40-60 tests | < 3 minutes |
| E2E (Playwright) | 15-20 tests | < 5 minutes |
| **Total** | **140-200 tests** | **< 10 minutes** |

---

## Navigation

← Fiche précédente : **[Tests d'API](10-tests-api.md)**

→ Fiche suivante : **[Test doubles avec PHPUnit](12-test-doubles-phpunit.md)**
