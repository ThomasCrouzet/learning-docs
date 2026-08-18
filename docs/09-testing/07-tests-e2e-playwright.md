---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Découvrir Playwright pour écrire des tests End-to-End : installation, locators, assertions, navigation et captures d'écran."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 15
cursus: "Testing et Qualité"
---

# 07 - Tests E2E avec Playwright

> **En bref** : Cette fiche te guide dans l'installation de Playwright et l'écriture de tes premiers tests E2E (End-to-End) qui interagissent avec un vrai navigateur. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Pourquoi tester](01-pourquoi-tester.md)** (types de tests, pyramide)
- Avoir lu la fiche **[03 - Tests unitaires JS](03-tests-unitaires-js.md)** (bases de JavaScript testing)
- Node.js 22 LTS installé
- Une application web fonctionnelle à tester (un projet Symfony avec un front, ou tout autre site)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Playwright, écrire des tests E2E qui naviguent dans un vrai navigateur, utiliser les locators pour trouver des éléments et prendre des captures d'écran automatiques.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Playwright ?

**Définition** : Playwright est un framework de tests E2E développé par Microsoft. Il permet d'automatiser un vrai navigateur (Chromium, Firefox, WebKit) pour tester une application web comme le ferait un utilisateur réel.

**Le problème que Playwright résout** :

Sans outil E2E, voici les problèmes rencontrés :

1. **JavaScript non testé** : Les tests fonctionnels Symfony (WebTestCase) ne peuvent pas exécuter de JavaScript. Les interactions dynamiques (menus, modales, AJAX) ne sont pas testées.
2. **Problèmes visuels non détectés** : Un bouton existe dans le HTML mais est invisible (caché par CSS) ou non cliquable (recouvert par un autre élément).
3. **Tests manuels longs** : Tu dois ouvrir le navigateur, cliquer sur chaque bouton, remplir chaque formulaire, vérifier chaque page manuellement.

**Comment Playwright résout ces problèmes** :

| Problème | Solution apportée par Playwright |
| --- | --- |
| JavaScript non testé | Playwright exécute un vrai navigateur avec JavaScript |
| Problèmes visuels | Playwright voit ce que l'utilisateur voit |
| Tests manuels longs | Playwright automatise toutes les interactions |

**Analogie concrète** : Playwright est un robot qui s'assoit devant l'écran, ouvre le navigateur, clique sur les boutons, tape dans les champs de texte et vérifie ce qui s'affiche. Il fait exactement ce que tu ferais manuellement, mais 100 fois plus vite et sans jamais oublier une étape.

Le schéma suivant illustre la pyramide des tests. Les tests E2E (comme ceux écrits avec Playwright) se situent au sommet : ils sont peu nombreux et lents, mais couvrent des parcours complets :

<div class="diagram-design">
<p><a href="../../diagrams/09-testing-07-tests-e2e-playwright-1.html">Qu&#x27;est-ce que Playwright ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/09-testing-07-tests-e2e-playwright-1.html" title="Qu&#x27;est-ce que Playwright ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que Playwright n'est PAS** :

- Playwright n'est pas un remplacement des tests unitaires. Les tests E2E sont lents et coûteux. Les tests unitaires restent la base.
- Playwright n'est pas Selenium. Playwright est plus moderne, plus rapide et plus fiable que Selenium. Il gère automatiquement les attentes (auto-wait).

**Comparaison Playwright vs Selenium** :

| Critère | Playwright | Selenium |
| --- | --- | --- |
| Attente automatique | Oui (auto-wait intégré) | Non (il faut des waits explicites) |
| Multi-navigateurs | Chromium, Firefox, WebKit | Chrome, Firefox, Edge, Safari |
| Vitesse | Rapide | Plus lent |
| Parallélisme | Natif | Configuration nécessaire |
| Captures d'écran | Intégré | Plugin nécessaire |
| API | Moderne (async/await) | Plus ancienne |

---

### Qu'est-ce qu'un locator ?

**Définition** : Un locator est une méthode pour trouver un élément sur la page web. Playwright fournit des locators qui imitent la façon dont un utilisateur trouve les éléments : par leur rôle, leur texte ou leur label.

**Le problème que les locators résolvent** :

Sans bons locators, voici les problèmes rencontrés :

1. **Tests fragiles** : Tu utilises des sélecteurs CSS ou XPath comme `#app > div:nth-child(3) > button`. Si la structure HTML change, le test casse.
2. **Tests illisibles** : Le sélecteur `div.form-group:nth-child(2) input` ne dit pas quel champ il cible.

**Comment les locators Playwright résolvent ces problèmes** :

| Problème | Solution apportée par les locators |
| --- | --- |
| Tests fragiles | Locators basés sur le rôle/texte, résistants aux changements de structure |
| Tests illisibles | `page.getByRole('button', { name: 'Envoyer' })` est clair |

**Locators recommandés (par ordre de préférence)** :

| Locator | Quand l'utiliser | Exemple |
| --- | --- | --- |
| `getByRole()` | Toujours en premier choix | `page.getByRole('button', { name: 'Envoyer' })` |
| `getByText()` | Quand le rôle n'est pas suffisant | `page.getByText('Bienvenue')` |
| `getByLabel()` | Pour les champs de formulaire | `page.getByLabel('Email')` |
| `getByPlaceholder()` | Quand le label manque | `page.getByPlaceholder('Entrez votre email')` |
| `getByTestId()` | En dernier recours | `page.getByTestId('submit-button')` |
| `locator()` (CSS) | Seulement si rien d'autre ne fonctionne | `page.locator('.my-class')` |

**Analogie concrète** : Quand tu demandes à quelqu'un de cliquer sur un bouton, tu dis "clique sur le bouton Envoyer" (getByRole), pas "clique sur le 3e élément dans le 2e div" (sélecteur CSS). Les locators Playwright imitent ce langage naturel.

---

### Qu'est-ce que l'auto-wait ?

**Définition** : L'auto-wait est un mécanisme de Playwright qui attend automatiquement qu'un élément soit prêt avant d'interagir avec lui. Il attend que l'élément soit visible, actif et stable.

**Le problème que l'auto-wait résout** :

Sans auto-wait, voici les problèmes rencontrés :

1. **Tests instables (flaky)** : Le test clique sur un bouton avant qu'il soit visible. Le résultat dépend de la vitesse de chargement de la page : le test passe si la page est rapide, échoue si elle est lente.
2. **Sleeps partout** : Tu ajoutes des `await page.waitForTimeout(2000)` partout. Les tests sont lents et toujours instables.

**Comment l'auto-wait résout ces problèmes** :

| Problème | Solution apportée par l'auto-wait |
| --- | --- |
| Tests instables | Playwright attend automatiquement que l'élément soit prêt |
| Sleeps partout | Plus besoin de waits manuels dans la plupart des cas |

**Ce que Playwright vérifie automatiquement avant d'interagir** :

1. L'élément est attaché au DOM
2. L'élément est visible
3. L'élément est stable (pas en cours d'animation)
4. L'élément peut recevoir des événements (pas recouvert)
5. L'élément est activé (pas disabled)

---

## Étapes Pratiques

### Étape 1 : Installer Playwright

```bash
# Crée un nouveau projet
mkdir playwright-demo && cd playwright-demo

# Initialise npm
npm init -y

# Installe Playwright
npm init playwright@latest
```

Pendant l'installation, Playwright te pose des questions :

```text
? Do you want to use TypeScript or JavaScript? JavaScript
? Where to put your end-to-end tests? tests
? Add a GitHub Actions workflow? No
? Install Playwright browsers? Yes
```

**Résultat attendu** :

```text
Installing Playwright browsers...
Chromium, Firefox, WebKit installed.
```

---

### Étape 2 : Comprendre la structure du projet

```text
playwright-demo/
├── tests/
│   └── example.spec.js    # Exemple de test (à supprimer)
├── playwright.config.js   # Configuration Playwright
├── package.json
└── node_modules/
```

Examine la configuration `playwright.config.js` :

```javascript
// playwright.config.js
// Configuration de Playwright

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  // Dossier contenant les tests
  testDir: './tests',

  // Timeout par test (30 secondes par défaut)
  timeout: 30000,

  // Nombre de tentatives en cas d'échec
  retries: 0,

  // Exécution parallèle
  fullyParallel: true,

  // Reporters (affichage des résultats)
  reporter: 'html',

  use: {
    // URL de base de l'application à tester
    baseURL: 'http://localhost:8000',

    // Prendre une capture d'écran en cas d'échec
    screenshot: 'only-on-failure',

    // Enregistrer une trace en cas d'échec (pour le debugging)
    trace: 'on-first-retry',
  },

  // Navigateurs à tester
  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' },
    },
  ],
});
```

---

### Étape 3 : Écrire le premier test E2E

Supprime `tests/example.spec.js` et crée `tests/homepage.spec.js` :

```javascript
// tests/homepage.spec.js
// Test E2E de la page d'accueil

// On importe test et expect depuis Playwright
const { test, expect } = require('@playwright/test');

// test() définit un test E2E
// Le premier argument est le nom du test
// Le second est une fonction async qui reçoit { page }
test('homepage should display the title', async ({ page }) => {
  // goto() navigue vers l'URL
  // Comme baseURL est défini dans la config, on utilise un chemin relatif
  await page.goto('/');

  // On vérifie que le titre de la page contient le texte attendu
  await expect(page).toHaveTitle(/Bienvenue/);
});

test('homepage should have a navigation menu', async ({ page }) => {
  await page.goto('/');

  // getByRole cherche un élément par son rôle ARIA
  // 'navigation' est le rôle d'un <nav>
  const nav = page.getByRole('navigation');

  // toBeVisible vérifie que l'élément est visible à l'écran
  await expect(nav).toBeVisible();
});

test('homepage should display product list link', async ({ page }) => {
  await page.goto('/');

  // getByRole('link') cherche un lien <a>
  // { name: 'Produits' } filtre par le texte du lien
  const productsLink = page.getByRole('link', { name: 'Produits' });

  await expect(productsLink).toBeVisible();
});
```

---

### Étape 4 : Lancer les tests

Avant de lancer les tests, assure-toi que ton application web est démarrée :

```bash
# Dans un autre terminal, démarre ton application
# Par exemple pour Symfony :
php -S localhost:8000 -t public/

# Ou avec Docker :
docker compose up -d
```

Puis lance les tests Playwright :

```bash
# Lance tous les tests
npx playwright test

# Lance un fichier spécifique
npx playwright test tests/homepage.spec.js

# Lance avec l'interface visuelle (le navigateur est visible)
npx playwright test --headed

# Lance en mode debug (pas à pas)
npx playwright test --debug
```

**Résultat attendu** :

```text
Running 3 tests using 1 worker

  ✓ homepage should display the title (1.2s)
  ✓ homepage should have a navigation menu (0.8s)
  ✓ homepage should display product list link (0.7s)

  3 passed (3.5s)
```

---

### Étape 5 : Tester la navigation

Crée `tests/navigation.spec.js` :

```javascript
// tests/navigation.spec.js
// Tests de navigation entre les pages

const { test, expect } = require('@playwright/test');

test('clicking Products link navigates to product list', async ({ page }) => {
  // Étape 1 : aller sur la page d'accueil
  await page.goto('/');

  // Étape 2 : cliquer sur le lien "Produits"
  await page.getByRole('link', { name: 'Produits' }).click();

  // Étape 3 : vérifier l'URL
  await expect(page).toHaveURL(/\/products/);

  // Étape 4 : vérifier le contenu de la page
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Liste des produits'
  );
});

test('product list should display at least one product', async ({ page }) => {
  await page.goto('/products');

  // On attend que le tableau soit visible
  const table = page.locator('table');
  await expect(table).toBeVisible();

  // On vérifie qu'il y a au moins une ligne dans le tableau
  const rows = page.locator('table tbody tr');
  await expect(rows).not.toHaveCount(0);
});

test('clicking a product navigates to detail page', async ({ page }) => {
  await page.goto('/products');

  // On récupère le texte du premier lien de produit
  const firstProductLink = page.locator('table tbody tr a').first();
  const productName = await firstProductLink.textContent();

  // On clique sur le lien
  await firstProductLink.click();

  // On vérifie que le H1 de la page de détail contient le nom
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    productName.trim()
  );
});

test('detail page has a back link to product list', async ({ page }) => {
  await page.goto('/products');

  // On clique sur le premier produit
  await page.locator('table tbody tr a').first().click();

  // On clique sur "Retour à la liste"
  await page.getByRole('link', { name: 'Retour à la liste' }).click();

  // On vérifie qu'on est revenu sur la liste
  await expect(page).toHaveURL(/\/products/);
});
```

---

### Étape 6 : Tester un formulaire

Crée `tests/product-form.spec.js` :

```javascript
// tests/product-form.spec.js
// Tests du formulaire de création de produit

const { test, expect } = require('@playwright/test');

test('new product form should be accessible', async ({ page }) => {
  await page.goto('/products/new');

  // Vérifie que le formulaire est visible
  await expect(page.locator('form')).toBeVisible();

  // Vérifie que les champs sont présents (par leur label)
  await expect(page.getByLabel('Nom')).toBeVisible();
  await expect(page.getByLabel('Prix')).toBeVisible();
  await expect(page.getByLabel('Catégorie')).toBeVisible();
});

test('submitting form with valid data creates product', async ({ page }) => {
  await page.goto('/products/new');

  // Remplit le formulaire
  // fill() efface le contenu existant et tape le nouveau texte
  await page.getByLabel('Nom').fill('Casque audio');
  await page.getByLabel('Prix').fill('5999');
  await page.getByLabel('Catégorie').fill('Électronique');

  // Clique sur le bouton de soumission
  await page.getByRole('button', { name: 'Créer' }).click();

  // Vérifie que la page de détail s'affiche
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Casque audio'
  );
});

test('submitting form with empty name shows error', async ({ page }) => {
  await page.goto('/products/new');

  // On laisse le nom vide et on remplit le prix
  await page.getByLabel('Prix').fill('1000');

  // On clique sur Créer
  await page.getByRole('button', { name: 'Créer' }).click();

  // On vérifie qu'un message d'erreur apparaît
  await expect(page.locator('.error')).toBeVisible();
  await expect(page.locator('.error')).toContainText('nom');
});

test('form preserves data on validation error', async ({ page }) => {
  await page.goto('/products/new');

  // On remplit le prix mais pas le nom
  await page.getByLabel('Prix').fill('2500');

  // On soumet
  await page.getByRole('button', { name: 'Créer' }).click();

  // On vérifie qu'on est toujours sur le formulaire
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Ajouter un produit'
  );
});
```

---

### Étape 7 : Prendre des captures d'écran

Playwright peut prendre des captures d'écran pour le debugging ou les tests visuels :

```javascript
// tests/screenshots.spec.js
// Tests avec captures d'écran

const { test, expect } = require('@playwright/test');

test('take screenshot of product list', async ({ page }) => {
  await page.goto('/products');

  // Prend une capture d'écran de la page entière
  // Le fichier est enregistré dans le dossier spécifié
  await page.screenshot({
    path: 'screenshots/product-list.png',
    fullPage: true, // Capture la page entière (pas seulement la partie visible)
  });
});

test('take screenshot of a specific element', async ({ page }) => {
  await page.goto('/products');

  // Prend une capture d'écran d'un élément spécifique
  const table = page.locator('table');
  await table.screenshot({
    path: 'screenshots/product-table.png',
  });
});

test('compare screenshot with baseline', async ({ page }) => {
  await page.goto('/products');

  // toHaveScreenshot compare avec une image de référence
  // La première fois, il crée l'image de référence
  // Les fois suivantes, il compare avec l'image de référence
  await expect(page).toHaveScreenshot('product-list.png', {
    // Tolérance de 1% de pixels différents
    maxDiffPixelRatio: 0.01,
  });
});
```

---

### Étape 8 : Assertions Playwright principales

```javascript
// Assertions sur la page
await expect(page).toHaveTitle('Mon titre');           // Titre de la page
await expect(page).toHaveURL(/\/products/);            // URL (regex)
await expect(page).toHaveURL('http://localhost/products'); // URL exacte

// Assertions sur les éléments
const element = page.getByRole('heading', { level: 1 });
await expect(element).toBeVisible();                   // Visible
await expect(element).toBeHidden();                    // Caché
await expect(element).toBeEnabled();                   // Activé
await expect(element).toBeDisabled();                  // Désactivé
await expect(element).toHaveText('Mon titre');         // Texte exact
await expect(element).toContainText('titre');          // Contient le texte
await expect(element).toHaveAttribute('href', '/url'); // Attribut
await expect(element).toHaveClass(/active/);           // Classe CSS
await expect(element).toHaveValue('valeur');           // Valeur d'un input
await expect(element).toHaveCount(5);                  // Nombre d'éléments

// Assertions visuelles
await expect(page).toHaveScreenshot('reference.png');
await expect(element).toHaveScreenshot('element.png');
```

---

### Étape 9 : Parcours utilisateur complet

Crée `tests/user-journey.spec.js` :

```javascript
// tests/user-journey.spec.js
// Test d'un parcours utilisateur complet

const { test, expect } = require('@playwright/test');

test('complete product creation journey', async ({ page }) => {
  // Étape 1 : L'utilisateur arrive sur la page d'accueil
  await page.goto('/');
  await expect(page).toHaveTitle(/Bienvenue/);

  // Étape 2 : L'utilisateur clique sur "Produits"
  await page.getByRole('link', { name: 'Produits' }).click();
  await expect(page).toHaveURL(/\/products/);

  // On note le nombre de produits avant l'ajout
  const rowsBefore = await page.locator('table tbody tr').count();

  // Étape 3 : L'utilisateur clique sur "Ajouter un produit"
  await page.getByRole('link', { name: 'Ajouter un produit' }).click();
  await expect(page).toHaveURL(/\/products\/new/);

  // Étape 4 : L'utilisateur remplit le formulaire
  await page.getByLabel('Nom').fill('Webcam HD');
  await page.getByLabel('Prix').fill('4999');
  await page.getByLabel('Catégorie').fill('Électronique');

  // Étape 5 : L'utilisateur soumet le formulaire
  await page.getByRole('button', { name: 'Créer' }).click();

  // Étape 6 : L'utilisateur voit la page de détail du nouveau produit
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(
    'Webcam HD'
  );

  // Étape 7 : L'utilisateur retourne à la liste
  await page.getByRole('link', { name: 'Retour à la liste' }).click();
  await expect(page).toHaveURL(/\/products/);

  // Étape 8 : La liste contient un produit de plus
  const rowsAfter = await page.locator('table tbody tr').count();
  expect(rowsAfter).toBe(rowsBefore + 1);
});
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npx playwright test` | Lancer tous les tests |
| `npx playwright test tests/fichier.spec.js` | Lancer un fichier spécifique |
| `npx playwright test --headed` | Lancer avec le navigateur visible |
| `npx playwright test --debug` | Lancer en mode debug (pas à pas) |
| `npx playwright test --ui` | Ouvrir l'interface graphique de test |
| `npx playwright show-report` | Ouvrir le rapport HTML |
| `npx playwright codegen http://localhost:8000` | Générateur de code (enregistre tes actions) |
| `npx playwright test --project=chromium` | Lancer pour un navigateur spécifique |
| `npx playwright test --grep "product"` | Filtrer les tests par nom |
| `npx playwright install` | Installer/mettre à jour les navigateurs |

---

## Pièges Fréquents

### Piège 1 : Oublier await devant les actions Playwright

**Problème** : Tu écris `page.goto('/')` sans `await`. Le test continue sans attendre la navigation et les assertions échouent.

**Solution** : Toujours utiliser `await` devant les actions Playwright.

```javascript
// ❌ Incorrect : pas de await
page.goto('/');
page.getByRole('button').click();

// ✅ Correct : await à chaque action
await page.goto('/');
await page.getByRole('button').click();
```

---

### Piège 2 : Utiliser des sélecteurs CSS fragiles

**Problème** : Tu utilises `page.locator('#root > div > div:nth-child(3) > button')`. Le test casse dès que la structure HTML change.

**Solution** : Utilise les locators sémantiques de Playwright.

```javascript
// ❌ Fragile : dépend de la structure HTML
page.locator('#root > div > div:nth-child(3) > button');

// ✅ Robuste : basé sur le rôle et le texte
page.getByRole('button', { name: 'Envoyer' });
```

---

### Piège 3 : L'application n'est pas démarrée

**Problème** : Les tests échouent avec `net::ERR_CONNECTION_REFUSED`. L'application web n'est pas démarrée.

**Solution** : Démarre ton application avant de lancer les tests. Tu peux automatiser cela dans `playwright.config.js` :

```javascript
// playwright.config.js
module.exports = defineConfig({
  // Démarre l'application automatiquement avant les tests
  webServer: {
    command: 'php -S localhost:8000 -t public/',
    url: 'http://localhost:8000',
    reuseExistingServer: true,
  },
});
```

---

### Piège 4 : Tests qui interfèrent entre eux

**Problème** : Un test crée un produit, le test suivant s'attend à un nombre précis de produits et échoue.

**Solution** : Chaque test doit être indépendant. Réinitialise la base de données avant les tests ou écris des assertions relatives ("+1 produit" au lieu de "6 produits").

---

## Checklist de Validation

- [ ] J'ai installé Playwright et les navigateurs
- [ ] Je sais écrire un test E2E avec `test()` et `expect()`
- [ ] Je sais naviguer avec `page.goto()` et `click()`
- [ ] Je connais les locators principaux (getByRole, getByText, getByLabel)
- [ ] Je sais remplir et soumettre un formulaire
- [ ] Je sais prendre des captures d'écran
- [ ] Je connais les assertions principales (toHaveTitle, toBeVisible, toHaveText)
- [ ] Je sais utiliser le mode debug et le mode headed
- [ ] Tous mes tests passent avec `npx playwright test`

---

## Exercice Pratique

**Énoncé** : Écris une suite de tests E2E Playwright pour un formulaire de connexion. Le formulaire se trouve à l'URL `/login` et contient :

- Un champ "Email" (input email)
- Un champ "Mot de passe" (input password)
- Un bouton "Se connecter"
- Un lien "Mot de passe oublié ?" qui mène à `/forgot-password`

Écris des tests pour :

1. La page de connexion s'affiche correctement
2. Les champs email et mot de passe sont visibles
3. La connexion avec des identifiants valides redirige vers `/dashboard`
4. La connexion avec un email invalide affiche un message d'erreur
5. Le lien "Mot de passe oublié ?" mène à la bonne page
6. Un parcours complet : connexion, vérification du dashboard, déconnexion

**Indications** :

- Utilise `getByLabel` pour trouver les champs de formulaire
- Utilise `getByRole('button')` pour le bouton de soumission
- Utilise `getByRole('link')` pour les liens
- Écris au minimum 6 tests
- Utilise les assertions `toHaveURL`, `toBeVisible`, `toContainText`

**Résultat attendu** : Tous les tests passent avec `npx playwright test`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// tests/login.spec.js
// Tests E2E du formulaire de connexion

const { test, expect } = require('@playwright/test');

test.describe('Login Page', () => {
  // Avant chaque test, on navigue vers la page de connexion
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
  });

  test('should display login form', async ({ page }) => {
    // Vérifie le titre de la page
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(
      'Connexion'
    );

    // Vérifie que le formulaire est visible
    await expect(page.locator('form')).toBeVisible();
  });

  test('should display email and password fields', async ({ page }) => {
    // Vérifie que les champs sont visibles par leur label
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Mot de passe')).toBeVisible();

    // Vérifie que le bouton de connexion est visible
    await expect(
      page.getByRole('button', { name: 'Se connecter' })
    ).toBeVisible();
  });

  test('should login with valid credentials', async ({ page }) => {
    // Remplit le formulaire
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Mot de passe').fill('Password123!');

    // Soumet le formulaire
    await page.getByRole('button', { name: 'Se connecter' }).click();

    // Vérifie la redirection vers le dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Tableau de bord'
    );
  });

  test('should show error for invalid credentials', async ({ page }) => {
    await page.getByLabel('Email').fill('wrong@example.com');
    await page.getByLabel('Mot de passe').fill('wrongpassword');

    await page.getByRole('button', { name: 'Se connecter' }).click();

    // Vérifie que le message d'erreur apparaît
    await expect(page.locator('.error')).toBeVisible();
    await expect(page.locator('.error')).toContainText(
      'Identifiants invalides'
    );

    // Vérifie qu'on est toujours sur la page de connexion
    await expect(page).toHaveURL(/\/login/);
  });

  test('should navigate to forgot password page', async ({ page }) => {
    // Clique sur le lien "Mot de passe oublié ?"
    await page
      .getByRole('link', { name: 'Mot de passe oublié' })
      .click();

    // Vérifie la navigation
    await expect(page).toHaveURL(/\/forgot-password/);
  });

  test('complete login and logout journey', async ({ page }) => {
    // Connexion
    await page.getByLabel('Email').fill('alice@example.com');
    await page.getByLabel('Mot de passe').fill('Password123!');
    await page.getByRole('button', { name: 'Se connecter' }).click();

    // Vérification du dashboard
    await expect(page).toHaveURL(/\/dashboard/);

    // Déconnexion
    await page.getByRole('link', { name: 'Déconnexion' }).click();

    // Vérification du retour à la page de connexion
    await expect(page).toHaveURL(/\/login/);
  });
});
```

---

## Navigation

← Fiche précédente : **[Introduction au TDD](06-introduction-tdd.md)**

→ Fiche suivante : **[Playwright avancé](08-playwright-avance.md)**
