---
tags:
  - Référence
  - Testing
description: "Aide-mémoire Testing : PHPUnit, Jest, Playwright et couverture de code"
estimated_time: "20 min"
fiche_number: 18
total_fiches: 18
cursus: "Fiches de référence"
id: "references.quick-reference.aide-memoire-testing"
course_id: "references.quick-reference"
content_type: "reference"
order: 18
---

# Aide-mémoire Testing

> **En bref** : Aide-mémoire Testing. Lecture estimée : 20 min.

Fiche de référence rapide pour les tests : PHPUnit, Jest, Playwright et couverture de code.

---

## PHPUnit - Commandes

| Commande | Action |
| -------- | ------ |
| `./vendor/bin/phpunit` | Lancer tous les tests |
| `./vendor/bin/phpunit tests/FichierTest.php` | Lancer un fichier |
| `./vendor/bin/phpunit --filter testMethode` | Lancer un seul test |
| `./vendor/bin/phpunit --testdox` | Sortie lisible |
| `./vendor/bin/phpunit --stop-on-failure` | Arrêter au premier échec |
| `./vendor/bin/phpunit --coverage-text` | Couverture en texte |
| `./vendor/bin/phpunit --coverage-html coverage/` | Couverture en HTML |

---

## PHPUnit - Assertions

| Assertion | Description |
| --------- | ----------- |
| `assertEquals($expected, $actual)` | Égalité souple (`==`) |
| `assertSame($expected, $actual)` | Identité stricte (`===`) |
| `assertTrue($value)` | Vérifier `true` |
| `assertFalse($value)` | Vérifier `false` |
| `assertNull($value)` | Vérifier `null` |
| `assertCount($n, $array)` | Taille d'un tableau |
| `assertContains($elem, $array)` | Élément dans un tableau |
| `assertStringContainsString($needle, $haystack)` | Sous-chaîne |
| `assertInstanceOf($class, $object)` | Type d'objet |
| `assertEmpty($value)` | Vérifier vide |
| `assertArrayHasKey($key, $array)` | Clé dans un tableau |
| `expectException($class)` | Exception attendue |
| `expectExceptionMessage($msg)` | Message d'exception |

---

## PHPUnit - Mocks et Data Providers

```php
// Mock
$mock = $this->createMock(Service::class);
$mock->expects($this->once())
    ->method('findById')
    ->willReturn($objet);

// Data Provider
public static function donneesProvider(): array {
    return [
        'cas positif' => [2, 3, 5],
        'cas zéro'    => [0, 0, 0],
    ];
}

#[\PHPUnit\Framework\Attributes\DataProvider('donneesProvider')]
public function testAddition($a, $b, $expected): void {
    $this->assertSame($expected, $a + $b);
}
```

---

## Jest - Commandes

| Commande | Action |
| -------- | ------ |
| `npx jest` | Lancer tous les tests |
| `npx jest --watch` | Mode watch |
| `npx jest --coverage` | Rapport de couverture |
| `npx jest tests/fichier.test.js` | Lancer un fichier |
| `npx jest --verbose` | Sortie détaillée |

---

## Jest - Matchers

| Matcher | Description |
| ------- | ----------- |
| `toBe(value)` | Identité stricte (`===`) |
| `toEqual(value)` | Égalité profonde (objets/tableaux) |
| `toBeTruthy()` / `toBeFalsy()` | Valeur truthy / falsy |
| `toBeNull()` | Vérifier `null` |
| `toBeUndefined()` | Vérifier `undefined` |
| `toContain(elem)` | Élément dans un tableau |
| `toHaveLength(n)` | Longueur de tableau/chaîne |
| `toBeGreaterThan(n)` | Supérieur à |
| `toBeCloseTo(val, decimals)` | Comparaison float |
| `toMatch(regex)` | Correspondance regex |
| `toThrow()` | La fonction lève une erreur |
| `toHaveBeenCalled()` | Le mock a été appelé |
| `toHaveBeenCalledWith(args)` | Appelé avec ces arguments |
| `toHaveBeenCalledTimes(n)` | Appelé N fois |
| `.not.matcher()` | Négation de n'importe quel matcher |

---

## Jest - Mocks et async

```javascript
// Mock fonction
const mock = jest.fn();
jest.fn().mockReturnValue(42);
jest.fn().mockImplementation((x) => x * 2);

// Mock module
jest.mock("./module");
jest.mock("./module", () => ({
  maFonction: jest.fn(),
}));

// Test async
test("async", async () => {
  const data = await fetchData();
  expect(data).toBe("value");
});

// Rejet de promesse
test("rejects", () => {
  return expect(fetchData()).rejects.toThrow();
});
```

---

## Playwright - Commandes

| Commande | Action |
| -------- | ------ |
| `npx playwright test` | Lancer tous les tests |
| `npx playwright test --headed` | Afficher le navigateur |
| `npx playwright test --debug` | Mode debug pas-à-pas |
| `npx playwright test --ui` | Interface UI |
| `npx playwright show-report` | Rapport HTML |
| `npx playwright codegen url` | Enregistrer un test |
| `npx playwright test --project=chromium` | Un seul navigateur |
| `npx playwright test --update-snapshots` | Mettre à jour les snapshots |
| `npx playwright show-trace trace.zip` | Ouvrir le trace viewer |

---

## Playwright - Locators

| Locator | Description |
| ------- | ----------- |
| `page.getByRole("button", { name: "Envoyer" })` | Par rôle ARIA |
| `page.getByText("Bienvenue")` | Par contenu texte |
| `page.getByLabel("Email")` | Par label (formulaires) |
| `page.getByPlaceholder("Rechercher")` | Par placeholder |
| `page.getByTestId("submit-btn")` | Par `data-testid` |
| `page.locator(".css-class")` | Par sélecteur CSS |

---

## Playwright - Actions et assertions

```javascript
// Actions (préférer les locators ; page.fill/page.click restent des raccourcis)
await page.goto("/login");
await page.getByLabel("Email").fill("user@example.com");
await page.getByRole("button", { name: "Connexion" }).click();
await page.waitForURL("/dashboard");

// Assertions
await expect(page).toHaveTitle(/Dashboard/);
await expect(page).toHaveURL("/dashboard");
await expect(page.getByText("Bienvenue")).toBeVisible();
await expect(page.getByRole("button")).toBeEnabled();
await expect(page.locator(".items")).toHaveCount(5);
```

---

## Couverture de code

### Commandes

| Outil | Commande |
| ----- | -------- |
| PHPUnit (texte) | `./vendor/bin/phpunit --coverage-text` |
| PHPUnit (HTML) | `./vendor/bin/phpunit --coverage-html coverage/` |
| PHPUnit (XML) | `./vendor/bin/phpunit --coverage-clover coverage.xml` |
| Jest | `npx jest --coverage` |

### Métriques

| Métrique | Description |
| -------- | ----------- |
| Line Coverage | % de lignes exécutées |
| Branch Coverage | % de branches if/else couvertes |
| Function Coverage | % de fonctions appelées |
| Statement Coverage | % d'instructions exécutées |

### Couleurs du rapport HTML

| Couleur | Signification |
| ------- | ------------- |
| Vert | Ligne exécutée par les tests |
| Rouge | Ligne jamais exécutée |
| Jaune | Branche partiellement couverte |

### Drivers PHP

| Driver | Usage |
| ------ | ----- |
| Xdebug | Debug + profiling + couverture (plus lent, 4-8x) |
| PCOV | Couverture uniquement (plus rapide, 2x) |

---

## Lifecycle

### PHPUnit

| Méthode | Quand |
| ------- | ----- |
| `setUp()` | Avant chaque test |
| `tearDown()` | Après chaque test |
| `setUpBeforeClass()` | Avant tous les tests de la classe |
| `tearDownAfterClass()` | Après tous les tests de la classe |

### Jest

| Fonction | Quand |
| -------- | ----- |
| `beforeEach(() => {})` | Avant chaque test |
| `afterEach(() => {})` | Après chaque test |
| `beforeAll(() => {})` | Avant tous les tests |
| `afterAll(() => {})` | Après tous les tests |

---

## Pièges courants

| Piège | Solution |
| ----- | -------- |
| `assertEquals` au lieu de `assertSame` | `assertSame` pour la comparaison stricte (`===`) |
| `toBe` sur un objet | Utiliser `toEqual` pour comparer des objets/tableaux |
| Oublier `await` avec Playwright | Chaque action Playwright doit être `await` |
| Sélecteurs CSS fragiles | Utiliser `getByRole`, `getByText`, `getByLabel` |
| Tester l'implémentation | Tester le comportement, pas le comment |
| Mocker trop de choses | Mocker uniquement les dépendances externes |
| Viser 100% de couverture | 80% sur le code critique > 100% sur le trivial |
| `catch` reçoit `unknown` en TS | Vérifier avec `instanceof Error` |
| Tests interdépendants | Chaque test doit être indépendant |
| Couverture sans assertions | Exécution ne signifie pas vérification |

---

## Liens utiles

- [02 - Tests unitaires PHP](../09-testing/02-tests-unitaires-php.md)
- [03 - Tests unitaires JS](../09-testing/03-tests-unitaires-js.md)
- [05 - Tests fonctionnels Symfony](../09-testing/05-tests-fonctionnels-symfony.md)
- [06 - TDD](../09-testing/06-introduction-tdd.md)
- [07 - Playwright](../09-testing/07-tests-e2e-playwright.md)
- [09 - Couverture de code](../09-testing/09-couverture-code.md)

---

## Navigation

← Fiche précédente : **[Aide-mémoire Architecture](17-aide-memoire-architecture.md)**
