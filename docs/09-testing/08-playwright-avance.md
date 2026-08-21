---
tags:
  - Testing
  - Avancé
  - Pratique
description: "Maîtriser Playwright avancé : Page Object Model, fixtures, tests parallèles, visual regression et trace viewer."
estimated_time: "75 min"
fiche_number: 8
total_fiches: 15
cursus: "Testing et Qualité"
id: "web.testing.playwright-avance"
course_id: "web.testing"
content_type: "lesson"
order: 8
---

# 08 - Playwright avancé

> **En bref** : Cette fiche approfondit Playwright avec le pattern Page Object Model, les fixtures, les tests parallèles, la régression visuelle et le trace viewer pour le debugging. Lecture estimée : 75 min.

## Prérequis

- Avoir lu la fiche **[07 - Tests E2E avec Playwright](07-tests-e2e-playwright.md)** (installation, locators, assertions)
- Savoir écrire et lancer des tests Playwright
- Node.js 22 LTS installé

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser tes tests avec le Page Object Model, créer des fixtures réutilisables, configurer les tests parallèles multi-navigateurs et utiliser le trace viewer pour debugger les échecs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le Page Object Model (POM) ?

**Définition** : Le Page Object Model est un pattern de conception qui encapsule les interactions avec une page web dans une classe dédiée. Chaque page de l'application a sa propre classe (Page Object) qui expose des méthodes pour interagir avec elle.

**Le problème que le POM résout** :

Sans POM, voici les problèmes rencontrés :

1. **Duplication de locators** : Le sélecteur `page.getByLabel('Email')` est écrit dans 10 tests différents. Si le label change, tu dois modifier 10 fichiers.
2. **Tests illisibles** : Les tests contiennent un mélange de locators CSS, d'actions et d'assertions. Difficile de comprendre l'intention du test.
3. **Maintenance lourde** : Un changement d'interface (renommage d'un bouton, déplacement d'un champ) casse de nombreux tests.

**Comment le POM résout ces problèmes** :

| Problème | Solution apportée par le POM |
| --- | --- |
| Duplication de locators | Les locators sont définis une seule fois dans le Page Object |
| Tests illisibles | Les tests appellent des méthodes claires : `loginPage.login(email, password)` |
| Maintenance lourde | Un changement d'interface = modification du Page Object uniquement |

**Analogie concrète** : Sans POM, chaque test écrit l'adresse complète "15 rue de la Paix, 75002 Paris" à chaque fois. Avec POM, tu crées un carnet d'adresses et chaque test dit "aller chez Alice". Si Alice déménage, tu modifies une seule entrée dans le carnet.

**Ce que le POM n'est PAS** :

- Le POM n'est pas obligatoire pour les petits projets. Si tu as 5 tests, la duplication n'est pas un problème.
- Le POM n'est pas un framework. C'est un pattern d'organisation du code.

---

### Qu'est-ce qu'une fixture Playwright ?

**Définition** : Une fixture Playwright est un mécanisme pour préparer et partager des données ou des objets entre les tests. Les fixtures remplacent les `beforeEach` et `afterEach` en offrant plus de flexibilité.

**Le problème que les fixtures résolvent** :

Sans fixtures, voici les problèmes rencontrés :

1. **BeforeEach complexes** : Tu as un `beforeEach` qui fait 30 lignes (connexion, navigation, préparation de données). C'est illisible.
2. **Partage difficile** : Plusieurs fichiers de test ont besoin du même setup (par exemple, un utilisateur connecté). Tu dupliques le code.

**Comment les fixtures résolvent ces problèmes** :

| Problème | Solution apportée par les fixtures |
| --- | --- |
| BeforeEach complexes | La fixture encapsule le setup dans une fonction dédiée |
| Partage difficile | La fixture est définie une fois et importée partout |

**Analogie concrète** : Sans fixtures, chaque cuisinier (test) prépare ses ingrédients lui-même. Avec fixtures, un commis (la fixture) prépare les ingrédients à l'avance et les met à disposition de chaque cuisinier.

---

### Qu'est-ce que la régression visuelle ?

**Définition** : La régression visuelle est un type de test qui compare des captures d'écran de l'application avec des images de référence. Si l'image actuelle diffère de la référence, le test échoue.

**Le problème que la régression visuelle résout** :

Sans régression visuelle, voici les problèmes rencontrés :

1. **Changements CSS non détectés** : Un changement de style déplace un bouton ou modifie une couleur. Les tests fonctionnels ne le détectent pas.
2. **Revue visuelle manuelle** : Tu dois manuellement vérifier chaque page après un changement de CSS.

**Comment la régression visuelle résout ces problèmes** :

| Problème | Solution apportée par la régression visuelle |
| --- | --- |
| Changements CSS non détectés | La comparaison d'images détecte tout changement visuel |
| Revue manuelle | La comparaison est automatique |

---

### Qu'est-ce que le Trace Viewer ?

**Définition** : Le Trace Viewer est un outil de debugging de Playwright qui enregistre chaque action d'un test (navigations, clics, requêtes réseau) et permet de les rejouer pas à pas avec des captures d'écran.

**Le problème que le Trace Viewer résout** :

Sans Trace Viewer, voici les problèmes rencontrés :

1. **Debugging à l'aveugle** : Un test échoue en CI/CD. Tu n'as aucune idée de ce qui s'est passé.
2. **Impossible à reproduire** : Le test passe sur ta machine mais échoue en CI. Tu ne peux pas voir ce qui se passe.

**Comment le Trace Viewer résout ces problèmes** :

| Problème | Solution apportée par le Trace Viewer |
| --- | --- |
| Debugging à l'aveugle | La trace montre chaque action avec des captures d'écran |
| Impossible à reproduire | La trace capture l'état exact du navigateur à chaque étape |

---

Le diagramme suivant montre comment un test interagit avec un Page Object qui centralise les locators et les actions.

<div class="diagram-design">
<p><a href="../../diagrams/09-testing-08-playwright-avance-1.html">Qu&#x27;est-ce que le Trace Viewer ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/09-testing-08-playwright-avance-1.html" title="Qu&#x27;est-ce que le Trace Viewer ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Créer un Page Object

Crée le dossier `pages/` pour les Page Objects :

```bash
mkdir pages
```

Crée `pages/LoginPage.js` :

```javascript
// pages/LoginPage.js
// Page Object pour la page de connexion

class LoginPage {
  // Le constructeur reçoit l'objet page de Playwright
  constructor(page) {
    this.page = page;

    // On définit les locators une seule fois
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Mot de passe');
    this.submitButton = page.getByRole('button', { name: 'Se connecter' });
    this.errorMessage = page.locator('.error');
    this.forgotPasswordLink = page.getByRole('link', {
      name: 'Mot de passe oublié',
    });
  }

  // Navigue vers la page de connexion
  async goto() {
    await this.page.goto('/login');
  }

  // Remplit le formulaire et le soumet
  async login(email, password) {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }

  // Retourne le texte du message d'erreur
  async getErrorMessage() {
    return await this.errorMessage.textContent();
  }

  // Vérifie si le message d'erreur est visible
  async isErrorVisible() {
    return await this.errorMessage.isVisible();
  }
}

module.exports = LoginPage;
```

Crée `pages/ProductListPage.js` :

```javascript
// pages/ProductListPage.js
// Page Object pour la liste des produits

class ProductListPage {
  constructor(page) {
    this.page = page;

    this.heading = page.getByRole('heading', { level: 1 });
    this.productRows = page.locator('table tbody tr');
    this.addProductLink = page.getByRole('link', {
      name: 'Ajouter un produit',
    });
  }

  // Navigue vers la liste des produits
  async goto() {
    await this.page.goto('/products');
  }

  // Retourne le nombre de produits affichés
  async getProductCount() {
    return await this.productRows.count();
  }

  // Clique sur un produit par son nom
  async clickProduct(name) {
    await this.page.getByRole('link', { name }).click();
  }

  // Clique sur "Ajouter un produit"
  async clickAddProduct() {
    await this.addProductLink.click();
  }

  // Retourne le texte du titre
  async getTitle() {
    return await this.heading.textContent();
  }
}

module.exports = ProductListPage;
```

Crée `pages/ProductFormPage.js` :

```javascript
// pages/ProductFormPage.js
// Page Object pour le formulaire de création de produit

class ProductFormPage {
  constructor(page) {
    this.page = page;

    this.nameInput = page.getByLabel('Nom');
    this.priceInput = page.getByLabel('Prix');
    this.categoryInput = page.getByLabel('Catégorie');
    this.submitButton = page.getByRole('button', { name: 'Créer' });
    this.errorMessage = page.locator('.error');
  }

  // Navigue vers le formulaire de création
  async goto() {
    await this.page.goto('/products/new');
  }

  // Remplit et soumet le formulaire
  async createProduct(name, price, category = '') {
    await this.nameInput.fill(name);
    await this.priceInput.fill(String(price));

    if (category) {
      await this.categoryInput.fill(category);
    }

    await this.submitButton.click();
  }
}

module.exports = ProductFormPage;
```

---

### Étape 2 : Utiliser les Page Objects dans les tests

Crée `tests/products-pom.spec.js` :

```javascript
// tests/products-pom.spec.js
// Tests utilisant le pattern Page Object Model

const { test, expect } = require('@playwright/test');
const ProductListPage = require('../pages/ProductListPage');
const ProductFormPage = require('../pages/ProductFormPage');

test.describe('Products with POM', () => {
  test('should display product list', async ({ page }) => {
    // On crée une instance du Page Object
    const productList = new ProductListPage(page);

    // Le test est lisible : on sait ce qu'on fait
    await productList.goto();
    const title = await productList.getTitle();

    expect(title).toBe('Liste des produits');
  });

  test('should create a new product', async ({ page }) => {
    const productForm = new ProductFormPage(page);

    // Le test est concis et clair
    await productForm.goto();
    await productForm.createProduct('Écouteurs', 1999, 'Audio');

    // Après la soumission, on vérifie la page de détail
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Écouteurs'
    );
  });

  test('complete journey with POM', async ({ page }) => {
    const productList = new ProductListPage(page);
    const productForm = new ProductFormPage(page);

    // Étape 1 : noter le nombre de produits
    await productList.goto();
    const countBefore = await productList.getProductCount();

    // Étape 2 : ajouter un produit
    await productList.clickAddProduct();
    await productForm.createProduct('Microphone', 7999, 'Audio');

    // Étape 3 : vérifier le nouveau nombre
    await productList.goto();
    const countAfter = await productList.getProductCount();

    expect(countAfter).toBe(countBefore + 1);
  });
});
```

---

### Étape 3 : Créer des fixtures personnalisées

Crée `fixtures/auth.js` :

```javascript
// fixtures/auth.js
// Fixture qui fournit un utilisateur connecté

const { test: base } = require('@playwright/test');
const LoginPage = require('../pages/LoginPage');

// On étend le test de base avec une nouvelle fixture
const test = base.extend({
  // La fixture "authenticatedPage" connecte l'utilisateur avant le test
  authenticatedPage: async ({ page }, use) => {
    // SETUP : on se connecte
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('alice@example.com', 'Password123!');

    // On attend d'être sur le dashboard
    await page.waitForURL(/\/dashboard/);

    // use() passe la page connectée au test
    // Le test s'exécute entre use() et la fin de la fixture
    await use(page);

    // TEARDOWN : nettoyage après le test (optionnel)
    // Par exemple, déconnexion
  },

  // Fixture qui fournit les Page Objects pré-configurés
  productPages: async ({ page }, use) => {
    const ProductListPage = require('../pages/ProductListPage');
    const ProductFormPage = require('../pages/ProductFormPage');

    await use({
      list: new ProductListPage(page),
      form: new ProductFormPage(page),
    });
  },
});

module.exports = { test };
```

Utilise les fixtures dans les tests :

```javascript
// tests/authenticated.spec.js
// Tests avec utilisateur connecté (fixture)

// On importe test depuis la fixture, pas depuis @playwright/test
const { test } = require('../fixtures/auth');
const { expect } = require('@playwright/test');

test.describe('Authenticated user', () => {
  // Le paramètre authenticatedPage est fourni par la fixture
  // L'utilisateur est déjà connecté quand le test commence
  test('should see dashboard', async ({ authenticatedPage }) => {
    await expect(
      authenticatedPage.getByRole('heading', { level: 1 })
    ).toContainText('Tableau de bord');
  });

  test('should access products', async ({ authenticatedPage }) => {
    await authenticatedPage.goto('/products');

    await expect(authenticatedPage).toHaveURL(/\/products/);
  });
});

test.describe('Products with fixtures', () => {
  test('should list products', async ({ productPages }) => {
    await productPages.list.goto();

    const count = await productPages.list.getProductCount();
    expect(count).toBeGreaterThan(0);
  });
});
```

---

### Étape 4 : Configurer les tests multi-navigateurs

Modifie `playwright.config.js` pour tester sur plusieurs navigateurs :

```javascript
// playwright.config.js
const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  retries: 0,
  fullyParallel: true,
  reporter: 'html',

  use: {
    baseURL: 'http://localhost:8000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },

  // Chaque projet teste un navigateur différent
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
    {
      name: 'firefox',
      use: {
        ...devices['Desktop Firefox'],
      },
    },
    {
      name: 'webkit',
      use: {
        ...devices['Desktop Safari'],
      },
    },
    // Test sur mobile
    {
      name: 'mobile-chrome',
      use: {
        ...devices['Pixel 5'],
      },
    },
    {
      name: 'mobile-safari',
      use: {
        ...devices['iPhone 13'],
      },
    },
  ],
});
```

Lance les tests sur tous les navigateurs :

```bash
# Tous les navigateurs
npx playwright test

# Un navigateur spécifique
npx playwright test --project=chromium
npx playwright test --project=firefox
```

**Résultat attendu** :

```text
Running 15 tests using 5 workers

  5 chromium  ✓
  5 firefox   ✓
  5 webkit    ✓

  15 passed (8.5s)
```

---

### Étape 5 : Régression visuelle

Crée `tests/visual.spec.js` :

```javascript
// tests/visual.spec.js
// Tests de régression visuelle

const { test, expect } = require('@playwright/test');

test('product list should match visual snapshot', async ({ page }) => {
  await page.goto('/products');

  // Attend que le contenu soit chargé
  await page.waitForLoadState('networkidle');

  // toHaveScreenshot compare avec une image de référence
  // La première exécution crée l'image de référence
  // Les exécutions suivantes comparent avec cette référence
  await expect(page).toHaveScreenshot('product-list.png', {
    // Tolérance : 1% de pixels différents autorisés
    maxDiffPixelRatio: 0.01,
    // Masquer les éléments dynamiques (dates, compteurs)
    mask: [page.locator('.dynamic-content')],
  });
});

test('product form should match visual snapshot', async ({ page }) => {
  await page.goto('/products/new');
  await page.waitForLoadState('networkidle');

  await expect(page).toHaveScreenshot('product-form.png', {
    maxDiffPixelRatio: 0.01,
  });
});

test('login page should match visual snapshot', async ({ page }) => {
  await page.goto('/login');
  await page.waitForLoadState('networkidle');

  // On peut aussi capturer un élément spécifique
  const form = page.locator('form');
  await expect(form).toHaveScreenshot('login-form.png');
});
```

```bash
# Première exécution : crée les images de référence
npx playwright test tests/visual.spec.js

# Met à jour les images de référence si un changement est intentionnel
npx playwright test tests/visual.spec.js --update-snapshots
```

---

### Étape 6 : Utiliser le Trace Viewer

Active les traces dans la configuration :

```javascript
// playwright.config.js
module.exports = defineConfig({
  use: {
    // Enregistre une trace pour chaque test
    // 'on' = toujours, 'on-first-retry' = seulement en cas de retry
    trace: 'on',
  },
});
```

Lance les tests et visualise les traces :

```bash
# Lance les tests
npx playwright test

# Ouvre le rapport HTML (contient les traces)
npx playwright show-report

# Ouvre une trace spécifique directement
npx playwright show-trace test-results/tests-homepage-spec-js/trace.zip
```

Le Trace Viewer montre :

- Chaque action avec une capture d'écran avant/après
- Le temps de chaque action
- Les requêtes réseau
- Les logs de la console
- Le DOM à chaque étape

---

### Étape 7 : Tests parallèles et isolation

Par défaut, Playwright exécute les tests en parallèle. Voici comment contrôler le parallélisme :

```javascript
// playwright.config.js
module.exports = defineConfig({
  // Exécution parallèle de tous les fichiers de test
  fullyParallel: true,

  // Nombre de workers (processus parallèles)
  // Par défaut : nombre de cœurs CPU / 2
  workers: 4,
});
```

Pour exécuter des tests séquentiellement dans un fichier :

```javascript
// tests/sequential.spec.js
const { test, expect } = require('@playwright/test');

// test.describe.serial force l'exécution séquentielle
test.describe.serial('Sequential tests', () => {
  test('step 1: create product', async ({ page }) => {
    // Ce test s'exécute en premier
    await page.goto('/products/new');
    // ...
  });

  test('step 2: verify product', async ({ page }) => {
    // Ce test s'exécute après step 1
    await page.goto('/products');
    // ...
  });
});
```

---

### Étape 8 : Configuration avancée

Exemples de configurations utiles :

```javascript
// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,

  // Timeout spécifique pour expect
  expect: {
    timeout: 5000,
    // Comparaison de screenshots
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
    },
  },

  // Nombre de retries en cas d'échec
  retries: process.env.CI ? 2 : 0,

  // Configuration globale
  use: {
    baseURL: 'http://localhost:8000',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
    video: 'on-first-retry',

    // Taille de la fenêtre
    viewport: { width: 1280, height: 720 },

    // Ignorer les erreurs HTTPS en développement
    ignoreHTTPSErrors: true,
  },

  // Démarrer l'application avant les tests
  webServer: {
    command: 'php -S localhost:8000 -t public/',
    url: 'http://localhost:8000',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npx playwright test` | Lancer tous les tests |
| `npx playwright test --project=chromium` | Tester sur Chromium uniquement |
| `npx playwright test --headed` | Voir le navigateur pendant les tests |
| `npx playwright test --debug` | Mode debug pas à pas |
| `npx playwright test --ui` | Interface graphique de test |
| `npx playwright show-report` | Ouvrir le rapport HTML |
| `npx playwright show-trace trace.zip` | Ouvrir le Trace Viewer |
| `npx playwright test --update-snapshots` | Mettre à jour les images de référence |
| `npx playwright codegen` | Générateur de code interactif |
| `npx playwright test --workers=1` | Forcer l'exécution séquentielle |

---

## Pièges Fréquents

### Piège 1 : Page Objects avec trop de responsabilités

**Problème** : Tu crées un Page Object de 500 lignes qui gère toute l'application. C'est aussi dur à maintenir que les tests sans POM.

**Solution** : Un Page Object = une page (ou une section de page). Si une page a des sections complexes (header, sidebar, formulaire), crée des composants séparés.

---

### Piège 2 : Tests visuels qui échouent à cause de données dynamiques

**Problème** : Les captures d'écran contiennent des dates, des heures ou des compteurs qui changent. Le test échoue à chaque exécution.

**Solution** : Utilise le paramètre `mask` pour masquer les éléments dynamiques, ou fixe les données avec des fixtures.

```javascript
await expect(page).toHaveScreenshot('page.png', {
  mask: [
    page.locator('.date'),     // Masque les dates
    page.locator('.counter'),  // Masque les compteurs
  ],
});
```

---

### Piège 3 : Tests parallèles qui partagent des données

**Problème** : Deux tests s'exécutent en parallèle. Le test A crée un produit, le test B le supprime. Les résultats sont imprévisibles.

**Solution** : Chaque test doit être indépendant. Utilise des données uniques par test (timestamps, UUIDs) ou exécute les tests dépendants en série.

---

### Piège 4 : Fixtures trop complexes

**Problème** : Tu crées une fixture qui fait 50 lignes de setup. Les tests deviennent difficiles à comprendre car le setup est caché.

**Solution** : Garde les fixtures simples. Si le setup est complexe, décompose-le en plusieurs fixtures composables.

---

## Checklist de Validation

- [ ] Je sais créer un Page Object avec locators et méthodes
- [ ] Je sais utiliser les Page Objects dans mes tests
- [ ] Je sais créer des fixtures Playwright personnalisées
- [ ] Je sais configurer les tests multi-navigateurs
- [ ] Je sais utiliser la régression visuelle avec `toHaveScreenshot()`
- [ ] Je sais utiliser le Trace Viewer pour debugger
- [ ] Je sais contrôler le parallélisme des tests
- [ ] Tous mes tests passent avec `npx playwright test`

---

## Exercice Pratique

**Énoncé** : Refactore les tests de la fiche 07 en utilisant le pattern Page Object Model. Crée les Page Objects suivants :

1. `HomePage` - page d'accueil
2. `ProductListPage` - liste des produits (si pas déjà créé)
3. `ProductDetailPage` - détail d'un produit
4. `ProductFormPage` - formulaire de création

Puis crée une fixture `productPages` qui instancie tous les Page Objects et passe-les aux tests.

**Indications** :

- Chaque Page Object doit encapsuler tous les locators de la page
- Chaque Page Object doit avoir une méthode `goto()` pour naviguer
- Les méthodes doivent avoir des noms clairs (ex: `getProductCount()`, `createProduct()`)
- La fixture doit fournir un objet avec tous les Page Objects
- Ajoute un test de régression visuelle pour la page d'accueil

**Résultat attendu** : Tous les tests passent avec `npx playwright test`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// pages/HomePage.js
class HomePage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.productsLink = page.getByRole('link', { name: 'Produits' });
    this.nav = page.getByRole('navigation');
  }

  async goto() {
    await this.page.goto('/');
  }

  async clickProducts() {
    await this.productsLink.click();
  }

  async getTitle() {
    return await this.heading.textContent();
  }
}

module.exports = HomePage;
```

```javascript
// pages/ProductDetailPage.js
class ProductDetailPage {
  constructor(page) {
    this.page = page;
    this.heading = page.getByRole('heading', { level: 1 });
    this.backLink = page.getByRole('link', { name: 'Retour à la liste' });
    this.details = page.locator('.product-details');
  }

  async getProductName() {
    return await this.heading.textContent();
  }

  async clickBackToList() {
    await this.backLink.click();
  }
}

module.exports = ProductDetailPage;
```

```javascript
// fixtures/products.js
const { test: base } = require('@playwright/test');
const HomePage = require('../pages/HomePage');
const ProductListPage = require('../pages/ProductListPage');
const ProductDetailPage = require('../pages/ProductDetailPage');
const ProductFormPage = require('../pages/ProductFormPage');

const test = base.extend({
  pages: async ({ page }, use) => {
    await use({
      home: new HomePage(page),
      list: new ProductListPage(page),
      detail: new ProductDetailPage(page),
      form: new ProductFormPage(page),
    });
  },
});

module.exports = { test };
```

```javascript
// tests/products-refactored.spec.js
const { test } = require('../fixtures/products');
const { expect } = require('@playwright/test');

test.describe('Products (POM + Fixtures)', () => {
  test('homepage displays title', async ({ pages }) => {
    await pages.home.goto();
    const title = await pages.home.getTitle();
    expect(title).toContain('Bienvenue');
  });

  test('navigate to product list', async ({ pages }) => {
    await pages.home.goto();
    await pages.home.clickProducts();
    await expect(pages.list.heading).toHaveText('Liste des produits');
  });

  test('product list has items', async ({ pages }) => {
    await pages.list.goto();
    const count = await pages.list.getProductCount();
    expect(count).toBeGreaterThan(0);
  });

  test('create product and verify', async ({ pages, page }) => {
    await pages.form.goto();
    await pages.form.createProduct('Tablette', 29999, 'Électronique');

    const name = await pages.detail.getProductName();
    expect(name).toBe('Tablette');

    await pages.detail.clickBackToList();
    await expect(page).toHaveURL(/\/products/);
  });

  test('homepage visual regression', async ({ pages, page }) => {
    await pages.home.goto();
    await page.waitForLoadState('networkidle');
    await expect(page).toHaveScreenshot('homepage.png', {
      maxDiffPixelRatio: 0.01,
    });
  });
});
```

---

## Navigation

← Fiche précédente : **[Tests E2E avec Playwright](07-tests-e2e-playwright.md)**

→ Fiche suivante : **[Couverture de code](09-couverture-code.md)**
