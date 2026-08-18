---
tags:
  - Testing
  - Intermédiaire
  - Pratique
description: "Apprendre à écrire des tests unitaires JavaScript avec Jest : describe, expect, mocks et tests asynchrones."
estimated_time: "90 min"
fiche_number: 3
total_fiches: 15
cursus: "Testing et Qualité"
---

# 03 - Tests unitaires JS (Jest)

> **En bref** : Cette fiche te guide dans l'installation et l'utilisation de Jest pour écrire des tests unitaires JavaScript avec describe/it, expect, mocks et tests asynchrones. Lecture estimée : 90 min.

## Prérequis

- Avoir lu la fiche **[01 - Pourquoi tester](01-pourquoi-tester.md)** (concepts de base des tests)
- Node.js 22 LTS installé
- npm installé
- Savoir écrire du JavaScript (variables, fonctions, modules ES)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Jest, écrire des tests avec describe/it/expect, utiliser les mocks pour isoler le code et tester des fonctions asynchrones.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Jest ?

**Définition** : Jest est un framework de tests JavaScript créé par Meta (Facebook). Il est conçu pour être simple à configurer et inclut tout le nécessaire : assertions, mocks, couverture de code et exécution parallèle.

**Versions** : Jest **30** est la ligne majeure courante (depuis juin 2025). Jest **29** reste largement utilisé et maintenu dans de nombreux projets. Les APIs de base de cette fiche (`describe`, `it`, `expect`, mocks, `async/await`) sont les mêmes en 29 et en 30. `npm install --save-dev jest` installe la dernière version majeure. Si tu dois rester sur 29 : `npm install --save-dev jest@^29`. Pour migrer 29 → 30, consulte le guide officiel [Upgrading to Jest 30](https://jestjs.io/docs/upgrading-to-jest30).

**Le problème que Jest résout** :

Sans Jest, voici les problèmes rencontrés :

1. **Multiple outils nécessaires** : Tu dois installer séparément un lanceur de tests (Mocha), une bibliothèque d'assertions (Chai), un outil de mocks (Sinon) et un outil de couverture (Istanbul).
2. **Configuration complexe** : Chaque outil doit être configuré et connecté aux autres.
3. **Performances lentes** : Sans exécution parallèle, les tests sont lents sur les gros projets.

**Comment Jest résout ces problèmes** :

| Problème | Solution apportée par Jest |
| --- | --- |
| Multiple outils | Tout-en-un : assertions, mocks, couverture intégrés |
| Configuration complexe | Fonctionne sans configuration pour la plupart des projets |
| Performances lentes | Exécute les tests en parallèle par défaut |

**Analogie concrète** : Sans Jest, tu achètes un couteau, une fourchette, une cuillère et une assiette séparément, et tu espères qu'ils vont bien ensemble. Avec Jest, tu achètes un set de table complet : tout est assorti et prêt à l'emploi.

**Ce que Jest n'est PAS** :

- Jest n'est pas un outil de test E2E. Il ne peut pas ouvrir un navigateur. Pour ça, utilise Playwright (fiche 07).
- Jest n'est pas limité à React. Il fonctionne avec n'importe quel code JavaScript.

---

### Qu'est-ce que describe, it et test ?

**Définition** : `describe` regroupe des tests liés entre eux. `it` (ou `test`, identique) définit un test individuel. Ensemble, ils structurent les tests de manière lisible.

**Le problème que describe/it résolvent** :

Sans describe/it, voici les problèmes rencontrés :

1. **Tests en vrac** : Tous les tests sont au même niveau, sans organisation. Difficile de trouver les tests d'une fonctionnalité précise.
2. **Rapports illisibles** : Le rapport de test affiche une liste plate de noms de tests sans hiérarchie.

**Comment describe/it résolvent ces problèmes** :

| Problème | Solution apportée par describe/it |
| --- | --- |
| Tests en vrac | describe() regroupe les tests par fonctionnalité |
| Rapports illisibles | Le rapport affiche une arborescence claire |

**Analogie concrète** : `describe` est le chapitre d'un livre, `it` est un paragraphe dans ce chapitre. "Chapitre : Calculatrice" contient "elle additionne deux nombres", "elle soustrait deux nombres", etc.

**Structure** :

```javascript
// describe regroupe les tests liés à "Calculator"
describe('Calculator', () => {
  // it (ou test) définit un test individuel
  it('should add two numbers', () => {
    // ... le test
  });

  it('should subtract two numbers', () => {
    // ... le test
  });
});
```

---

### Qu'est-ce que expect et les matchers ?

**Définition** : `expect` est la fonction d'assertion de Jest. Elle prend une valeur et la compare avec un matcher (vérificateur). Si la comparaison échoue, le test échoue.

**Les matchers les plus utilisés** :

| Matcher | Vérifie que... | Exemple |
| --- | --- | --- |
| `toBe(valeur)` | Identique (===) | `expect(2 + 2).toBe(4)` |
| `toEqual(valeur)` | Égal en profondeur (objets/tableaux) | `expect({a: 1}).toEqual({a: 1})` |
| `toContain(element)` | Le tableau contient l'élément | `expect([1, 2, 3]).toContain(2)` |
| `toHaveLength(n)` | La longueur est n | `expect([1, 2]).toHaveLength(2)` |
| `toBeTruthy()` | La valeur est "truthy" | `expect(1).toBeTruthy()` |
| `toBeFalsy()` | La valeur est "falsy" | `expect(0).toBeFalsy()` |
| `toBeNull()` | La valeur est null | `expect(null).toBeNull()` |
| `toBeUndefined()` | La valeur est undefined | `expect(undefined).toBeUndefined()` |
| `toBeGreaterThan(n)` | Supérieur à n | `expect(10).toBeGreaterThan(5)` |
| `toBeLessThan(n)` | Inférieur à n | `expect(3).toBeLessThan(5)` |
| `toMatch(regex)` | Correspond à la regex | `expect('hello').toMatch(/ell/)` |
| `toThrow()` | Lève une erreur | `expect(() => fn()).toThrow()` |
| `toHaveBeenCalled()` | La fonction mock a été appelée | `expect(mock).toHaveBeenCalled()` |

**Différence entre toBe et toEqual** :

| toBe (===) | toEqual (deep equality) |
| --- | --- |
| Compare les références | Compare les valeurs en profondeur |
| `expect({a: 1}).toBe({a: 1})` échoue | `expect({a: 1}).toEqual({a: 1})` passe |
| Utiliser pour les primitives (number, string) | Utiliser pour les objets et tableaux |

**Négation avec .not** :

```javascript
// On peut inverser n'importe quel matcher avec .not
expect(5).not.toBe(3);        // 5 n'est pas 3
expect([1, 2]).not.toContain(5); // le tableau ne contient pas 5
```

---

Le diagramme suivant montre la structure hiérarchique des tests Jest : `describe` regroupe les blocs `it`, et chaque `it` contient un `expect`.

<div class="diagram-design">
<p><a href="../../diagrams/09-testing-03-tests-unitaires-js-1.html">Qu&#x27;est-ce que expect et les matchers ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/09-testing-03-tests-unitaires-js-1.html" title="Qu&#x27;est-ce que expect et les matchers ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

### Qu'est-ce qu'un mock ?

**Définition** : Un mock (simulacre) est une fausse version d'une fonction ou d'un module. Il remplace le vrai code par un substitut contrôlable pendant les tests.

**Le problème que les mocks résolvent** :

Sans mocks, voici les problèmes rencontrés :

1. **Dépendances externes** : Ta fonction appelle une API distante. Tu ne peux pas tester sans connexion internet, et le résultat de l'API peut changer.
2. **Effets de bord** : Ta fonction envoie un email. Tu ne veux pas envoyer un vrai email à chaque test.
3. **Code non déterministe** : Ta fonction utilise `Date.now()`. Le résultat change à chaque exécution, ce qui rend le test non reproductible.

**Comment les mocks résolvent ces problèmes** :

| Problème | Solution apportée par les mocks |
| --- | --- |
| Dépendances externes | On remplace l'appel API par une réponse fictive |
| Effets de bord | On remplace l'envoi d'email par une fonction qui ne fait rien |
| Code non déterministe | On remplace Date.now() par une valeur fixe |

**Analogie concrète** : Dans un film, les acteurs ne conduisent pas de vraies voitures à 200 km/h. On utilise des voitures maquettes, des fonds verts et des doublures. Les mocks sont les doublures et maquettes de tes tests : ils ressemblent au vrai code, mais ils sont contrôlés et sans risque.

**Ce qu'un mock n'est PAS** :

- Un mock n'est pas du code de production. Il existe uniquement dans les tests.
- Un mock n'est pas un test en lui-même. Il est un outil qui permet d'isoler le code testé.

---

### Qu'est-ce que beforeEach et afterEach ?

**Définition** : `beforeEach` est une fonction exécutée avant chaque test. `afterEach` est exécutée après chaque test. Ce sont les équivalents JavaScript de `setUp` et `tearDown` en PHPUnit.

**Le problème que beforeEach/afterEach résolvent** :

Sans ces fonctions, voici les problèmes rencontrés :

1. **Initialisation répétée** : Tu crées les mêmes objets au début de chaque test.
2. **Nettoyage oublié** : Un test modifie un état global (un mock, un timer) et le test suivant hérite de cet état modifié.

**Comment beforeEach/afterEach résolvent ces problèmes** :

| Problème | Solution apportée par beforeEach/afterEach |
| --- | --- |
| Initialisation répétée | beforeEach crée les objets une seule fois par test |
| Nettoyage oublié | afterEach nettoie automatiquement après chaque test |

**Analogie concrète** : Même analogie que setUp/tearDown : le serveur qui prépare et débarrasse la table pour chaque client.

---

## Étapes Pratiques

### Étape 1 : Créer un projet et installer Jest

```bash
# Crée le dossier du projet
mkdir jest-demo && cd jest-demo

# Initialise npm (accepte les valeurs par défaut)
npm init -y

# Installe Jest comme dépendance de développement
npm install --save-dev jest
```

**Résultat attendu** :

```text
added 274 packages in 5s
```

Configure le script de test dans `package.json` :

```json
{
  "scripts": {
    "test": "jest",
    "test:verbose": "jest --verbose",
    "test:watch": "jest --watchAll"
  }
}
```

---

### Étape 2 : Écrire la première fonction à tester

Crée le fichier `calculator.js` :

```javascript
// calculator.js
// Module de calcul mathématique simple

// Additionne deux nombres
function add(a, b) {
  return a + b;
}

// Soustrait le second nombre du premier
function subtract(a, b) {
  return a - b;
}

// Multiplie deux nombres
function multiply(a, b) {
  return a * b;
}

// Divise le premier nombre par le second
// Lève une erreur si le diviseur est zéro
function divide(a, b) {
  if (b === 0) {
    throw new Error('Division par zéro impossible');
  }

  return a / b;
}

// Exporte les fonctions pour les rendre accessibles aux tests
module.exports = { add, subtract, multiply, divide };
```

---

### Étape 3 : Écrire le premier test Jest

Crée le fichier `calculator.test.js` :

```javascript
// calculator.test.js
// Tests unitaires du module calculator

// On importe les fonctions à tester
const { add, subtract, multiply, divide } = require('./calculator');

// describe regroupe les tests liés à une fonctionnalité
describe('Calculator', () => {
  // Sous-groupe pour la fonction add
  describe('add', () => {
    // it (ou test) définit un test individuel
    it('should add two positive numbers', () => {
      // expect prend le résultat obtenu
      // toBe vérifie qu'il est identique (===) à la valeur attendue
      expect(add(2, 3)).toBe(5);
    });

    it('should add negative numbers', () => {
      expect(add(-1, -3)).toBe(-4);
    });

    it('should add zero', () => {
      expect(add(5, 0)).toBe(5);
    });

    it('should add decimal numbers', () => {
      // Pour les flottants, on utilise toBeCloseTo au lieu de toBe
      // Le second argument (5) est le nombre de décimales de précision
      expect(add(0.1, 0.2)).toBeCloseTo(0.3, 5);
    });
  });

  describe('subtract', () => {
    it('should subtract two numbers', () => {
      expect(subtract(10, 3)).toBe(7);
    });

    it('should handle negative result', () => {
      expect(subtract(3, 10)).toBe(-7);
    });
  });

  describe('multiply', () => {
    it('should multiply two numbers', () => {
      expect(multiply(4, 3)).toBe(12);
    });

    it('should return zero when multiplied by zero', () => {
      expect(multiply(5, 0)).toBe(0);
    });
  });

  describe('divide', () => {
    it('should divide two numbers', () => {
      expect(divide(10, 2)).toBe(5);
    });

    it('should handle decimal results', () => {
      expect(divide(10, 3)).toBeCloseTo(3.333, 2);
    });

    // Test qu'une erreur est levée
    it('should throw an error when dividing by zero', () => {
      // expect prend une fonction (pas le résultat !)
      // toThrow vérifie que la fonction lève une erreur
      expect(() => divide(10, 0)).toThrow('Division par zéro impossible');
    });

    it('should throw an Error instance when dividing by zero', () => {
      expect(() => divide(10, 0)).toThrow(Error);
    });
  });
});
```

---

### Étape 4 : Lancer les tests

```bash
npm test
```

**Résultat attendu** :

```text
 PASS  ./calculator.test.js
  Calculator
    add
      ✓ should add two positive numbers (2 ms)
      ✓ should add negative numbers
      ✓ should add zero
      ✓ should add decimal numbers (1 ms)
    subtract
      ✓ should subtract two numbers
      ✓ should handle negative result
    multiply
      ✓ should multiply two numbers
      ✓ should return zero when multiplied by zero
    divide
      ✓ should divide two numbers
      ✓ should handle decimal results (1 ms)
      ✓ should throw an error when dividing by zero
      ✓ should throw an Error instance when dividing by zero

Tests:       12 passed, 12 total
Snapshots:   0 total
Time:        0.5 s
```

---

### Étape 5 : Utiliser beforeEach

Crée le fichier `cart.js` :

```javascript
// cart.js
// Panier d'achat simple

class ShoppingCart {
  // Le constructeur initialise un tableau vide d'articles
  constructor() {
    this.items = [];
  }

  // Ajoute un article au panier
  addItem(name, price) {
    if (price < 0) {
      throw new Error('Le prix ne peut pas être négatif');
    }

    this.items.push({ name, price });
  }

  // Retourne le nombre d'articles dans le panier
  getItemCount() {
    return this.items.length;
  }

  // Calcule le prix total du panier
  getTotal() {
    // reduce parcourt le tableau et accumule le total
    return this.items.reduce((total, item) => total + item.price, 0);
  }

  // Supprime un article par son nom
  // Retourne true si l'article a été supprimé, false sinon
  removeItem(name) {
    const index = this.items.findIndex((item) => item.name === name);

    if (index === -1) {
      return false;
    }

    // splice supprime l'élément à l'index donné
    this.items.splice(index, 1);
    return true;
  }

  // Vide le panier
  clear() {
    this.items = [];
  }
}

module.exports = ShoppingCart;
```

Crée le fichier `cart.test.js` :

```javascript
// cart.test.js
// Tests du panier d'achat

const ShoppingCart = require('./cart');

describe('ShoppingCart', () => {
  // Variable partagée par tous les tests de ce describe
  let cart;

  // beforeEach crée un panier neuf AVANT chaque test
  // Cela garantit que chaque test commence avec un panier vide
  beforeEach(() => {
    cart = new ShoppingCart();
  });

  describe('initial state', () => {
    it('should start with zero items', () => {
      expect(cart.getItemCount()).toBe(0);
    });

    it('should start with zero total', () => {
      expect(cart.getTotal()).toBe(0);
    });
  });

  describe('addItem', () => {
    it('should increase item count', () => {
      cart.addItem('Livre', 15.99);

      expect(cart.getItemCount()).toBe(1);
    });

    it('should add multiple items', () => {
      cart.addItem('Livre', 15.99);
      cart.addItem('Stylo', 2.50);

      expect(cart.getItemCount()).toBe(2);
    });

    it('should throw for negative price', () => {
      expect(() => cart.addItem('Livre', -5)).toThrow(
        'Le prix ne peut pas être négatif'
      );
    });

    it('should accept zero price', () => {
      cart.addItem('Échantillon gratuit', 0);

      expect(cart.getItemCount()).toBe(1);
    });
  });

  describe('getTotal', () => {
    it('should calculate total for one item', () => {
      cart.addItem('Livre', 15.99);

      expect(cart.getTotal()).toBeCloseTo(15.99, 2);
    });

    it('should calculate total for multiple items', () => {
      cart.addItem('Livre', 15.99);
      cart.addItem('Stylo', 2.50);
      cart.addItem('Cahier', 5.00);

      // 15.99 + 2.50 + 5.00 = 23.49
      expect(cart.getTotal()).toBeCloseTo(23.49, 2);
    });
  });

  describe('removeItem', () => {
    it('should remove an existing item', () => {
      cart.addItem('Livre', 15.99);

      const removed = cart.removeItem('Livre');

      expect(removed).toBe(true);
      expect(cart.getItemCount()).toBe(0);
    });

    it('should return false for non-existing item', () => {
      const removed = cart.removeItem('Inexistant');

      expect(removed).toBe(false);
    });

    it('should update total after removal', () => {
      cart.addItem('Livre', 15.99);
      cart.addItem('Stylo', 2.50);
      cart.removeItem('Livre');

      expect(cart.getTotal()).toBeCloseTo(2.50, 2);
    });
  });

  describe('clear', () => {
    it('should empty the cart', () => {
      cart.addItem('Livre', 15.99);
      cart.addItem('Stylo', 2.50);
      cart.clear();

      expect(cart.getItemCount()).toBe(0);
      expect(cart.getTotal()).toBe(0);
    });
  });
});
```

```bash
npm test
```

**Résultat attendu** :

```text
 PASS  ./cart.test.js
 PASS  ./calculator.test.js

Tests:       24 passed, 24 total
```

---

### Étape 6 : Utiliser les mocks

Crée le fichier `userService.js` :

```javascript
// userService.js
// Service utilisateur qui dépend d'une API externe

class UserService {
  // Le constructeur reçoit un objet apiClient qui fait les appels HTTP
  constructor(apiClient) {
    this.apiClient = apiClient;
  }

  // Récupère un utilisateur par son ID
  // Retourne l'utilisateur ou null si non trouvé
  async getUser(id) {
    try {
      const response = await this.apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      return null;
    }
  }

  // Récupère tous les utilisateurs actifs
  async getActiveUsers() {
    const response = await this.apiClient.get('/users');
    // On filtre pour ne garder que les utilisateurs actifs
    return response.data.filter((user) => user.active === true);
  }
}

module.exports = UserService;
```

Crée le fichier `userService.test.js` :

```javascript
// userService.test.js
// Tests du service utilisateur avec mocks

const UserService = require('./userService');

describe('UserService', () => {
  // On crée un faux apiClient avec des méthodes mock
  let mockApiClient;
  let userService;

  beforeEach(() => {
    // jest.fn() crée une fonction mock
    // Une fonction mock enregistre ses appels et peut retourner des valeurs
    mockApiClient = {
      get: jest.fn(),
    };

    // On injecte le faux apiClient dans le service
    userService = new UserService(mockApiClient);
  });

  describe('getUser', () => {
    it('should return user data when found', async () => {
      // ARRANGE : on configure le mock pour retourner un utilisateur
      // mockResolvedValue simule une Promise résolue (comme un appel API réussi)
      const fakeUser = { id: 1, name: 'Alice', email: 'alice@example.com' };
      mockApiClient.get.mockResolvedValue({ data: fakeUser });

      // ACT : on appelle la méthode à tester
      // await attend la résolution de la Promise
      const result = await userService.getUser(1);

      // ASSERT : on vérifie le résultat
      expect(result).toEqual(fakeUser);

      // On vérifie que le mock a été appelé avec le bon URL
      expect(mockApiClient.get).toHaveBeenCalledWith('/users/1');

      // On vérifie que le mock a été appelé exactement 1 fois
      expect(mockApiClient.get).toHaveBeenCalledTimes(1);
    });

    it('should return null when user not found', async () => {
      // On configure le mock pour simuler une erreur (utilisateur non trouvé)
      // mockRejectedValue simule une Promise rejetée (comme une erreur 404)
      mockApiClient.get.mockRejectedValue(new Error('Not Found'));

      const result = await userService.getUser(999);

      expect(result).toBeNull();
    });
  });

  describe('getActiveUsers', () => {
    it('should return only active users', async () => {
      // On configure le mock avec une liste d'utilisateurs
      const allUsers = [
        { id: 1, name: 'Alice', active: true },
        { id: 2, name: 'Bob', active: false },
        { id: 3, name: 'Charlie', active: true },
      ];
      mockApiClient.get.mockResolvedValue({ data: allUsers });

      const result = await userService.getActiveUsers();

      // On vérifie que seuls les utilisateurs actifs sont retournés
      expect(result).toHaveLength(2);
      expect(result[0].name).toBe('Alice');
      expect(result[1].name).toBe('Charlie');
    });

    it('should return empty array when no active users', async () => {
      const allUsers = [
        { id: 1, name: 'Bob', active: false },
      ];
      mockApiClient.get.mockResolvedValue({ data: allUsers });

      const result = await userService.getActiveUsers();

      expect(result).toHaveLength(0);
    });
  });
});
```

```bash
npm test
```

**Résultat attendu** :

```text
 PASS  ./userService.test.js
 PASS  ./cart.test.js
 PASS  ./calculator.test.js

Tests:       28 passed, 28 total
```

---

### Étape 7 : Mocker un module entier avec jest.mock

Crée le fichier `dateUtils.js` :

```javascript
// dateUtils.js
// Utilitaires de date

// Retourne un message de bienvenue selon l'heure
function getGreeting() {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Bonjour';
  } else if (hour < 18) {
    return 'Bon après-midi';
  } else {
    return 'Bonsoir';
  }
}

// Vérifie si une date est dans le futur
function isFutureDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();

  return date > now;
}

module.exports = { getGreeting, isFutureDate };
```

Crée le fichier `dateUtils.test.js` :

```javascript
// dateUtils.test.js
// Tests des utilitaires de date avec contrôle du temps

const { getGreeting, isFutureDate } = require('./dateUtils');

describe('dateUtils', () => {
  describe('getGreeting', () => {
    // beforeEach active les faux timers pour contrôler l'heure système
    beforeEach(() => {
      jest.useFakeTimers();
    });

    // afterEach restaure les timers réels
    afterEach(() => {
      jest.useRealTimers();
    });

    it('should return "Bonjour" in the morning', () => {
      // jest.setSystemTime fixe l'horloge système à 9h00
      // new Date() retourne une vraie instance Date à cet instant
      jest.setSystemTime(new Date('2026-01-01T09:00:00'));

      expect(getGreeting()).toBe('Bonjour');
    });

    it('should return "Bon après-midi" in the afternoon', () => {
      jest.setSystemTime(new Date('2026-01-01T14:00:00'));

      expect(getGreeting()).toBe('Bon après-midi');
    });

    it('should return "Bonsoir" in the evening', () => {
      jest.setSystemTime(new Date('2026-01-01T20:00:00'));

      expect(getGreeting()).toBe('Bonsoir');
    });
  });

  describe('isFutureDate', () => {
    it('should return true for a future date', () => {
      // On utilise une date très lointaine dans le futur
      expect(isFutureDate('2099-01-01')).toBe(true);
    });

    it('should return false for a past date', () => {
      expect(isFutureDate('2000-01-01')).toBe(false);
    });
  });
});
```

```bash
npm test
```

**Résultat attendu** :

```text
 PASS  ./dateUtils.test.js
 PASS  ./userService.test.js
 PASS  ./cart.test.js
 PASS  ./calculator.test.js

Tests:       33 passed, 33 total
```

---

### Étape 8 : Tester des fonctions asynchrones

Crée le fichier `asyncUtils.js` :

```javascript
// asyncUtils.js
// Fonctions asynchrones à tester

// Simule un appel réseau avec un délai
function fetchData(url) {
  return new Promise((resolve, reject) => {
    // setTimeout simule un délai réseau
    setTimeout(() => {
      if (url === '/valid') {
        resolve({ status: 200, data: 'Données reçues' });
      } else {
        reject(new Error('URL invalide'));
      }
    }, 100);
  });
}

// Retourne la somme après un délai (simule un calcul lourd)
async function asyncAdd(a, b) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(a + b), 50);
  });
}

module.exports = { fetchData, asyncAdd };
```

Crée le fichier `asyncUtils.test.js` :

```javascript
// asyncUtils.test.js
// Tests de fonctions asynchrones

const { fetchData, asyncAdd } = require('./asyncUtils');

describe('asyncUtils', () => {
  describe('fetchData', () => {
    // Méthode 1 : async/await (recommandée)
    it('should return data for valid URL', async () => {
      // await attend que la Promise soit résolue
      const result = await fetchData('/valid');

      expect(result.status).toBe(200);
      expect(result.data).toBe('Données reçues');
    });

    // Méthode 2 : async/await avec rejects
    it('should throw for invalid URL', async () => {
      // Pour tester les rejets avec async/await, on utilise rejects
      await expect(fetchData('/invalid')).rejects.toThrow('URL invalide');
    });

    // Méthode 3 : .resolves pour vérifier la résolution
    it('should resolve with status 200', async () => {
      await expect(fetchData('/valid')).resolves.toEqual(
        expect.objectContaining({ status: 200 })
      );
    });
  });

  describe('asyncAdd', () => {
    it('should add two numbers asynchronously', async () => {
      const result = await asyncAdd(3, 4);

      expect(result).toBe(7);
    });

    it('should handle negative numbers', async () => {
      const result = await asyncAdd(-1, -2);

      expect(result).toBe(-3);
    });

    it('should handle zero', async () => {
      const result = await asyncAdd(0, 0);

      expect(result).toBe(0);
    });
  });
});
```

```bash
npm test
```

**Résultat attendu** :

```text
 PASS  ./asyncUtils.test.js
 PASS  ./dateUtils.test.js
 PASS  ./userService.test.js
 PASS  ./cart.test.js
 PASS  ./calculator.test.js

Tests:       39 passed, 39 total
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm test` | Lancer tous les tests |
| `npx jest --verbose` | Affichage détaillé avec noms des tests |
| `npx jest fichier.test.js` | Lancer un seul fichier de test |
| `npx jest --testNamePattern "add"` | Lancer les tests dont le nom contient "add" |
| `npx jest --watchAll` | Mode watch : relance les tests à chaque modification |
| `npx jest --coverage` | Générer un rapport de couverture de code |
| `npx jest --bail` | Stopper au premier test échoué |

---

## Pièges Fréquents

### Piège 1 : Utiliser toBe pour comparer des objets

**Problème** : `expect({a: 1}).toBe({a: 1})` échoue. `toBe` compare les références, pas les valeurs. Deux objets identiques ne sont pas le même objet en mémoire.

**Solution** : Utiliser `toEqual` pour comparer les valeurs d'objets et de tableaux.

```javascript
// ❌ Échoue : compare les références
expect({ a: 1 }).toBe({ a: 1 });

// ✅ Passe : compare les valeurs en profondeur
expect({ a: 1 }).toEqual({ a: 1 });
```

---

### Piège 2 : Oublier async/await dans les tests asynchrones

**Problème** : Tu écris un test asynchrone sans `async/await`. Le test passe toujours, même si l'assertion échouerait, parce que Jest ne sait pas que le test est asynchrone.

**Solution** : Toujours utiliser `async/await` pour les tests asynchrones.

```javascript
// ❌ Ce test passe toujours, même si fetchData échoue
it('should fetch data', () => {
  fetchData('/valid').then((result) => {
    expect(result.status).toBe(999); // Ne sera jamais vérifié !
  });
});

// ✅ Correct : Jest attend la résolution de la Promise
it('should fetch data', async () => {
  const result = await fetchData('/valid');
  expect(result.status).toBe(200);
});
```

---

### Piège 3 : Ne pas nettoyer les mocks

**Problème** : Un mock créé dans un test persiste dans le test suivant. Les tests deviennent interdépendants.

**Solution** : Utiliser `afterEach(() => jest.restoreAllMocks())` ou `jest.clearAllMocks()`.

```javascript
afterEach(() => {
  // Restaure tous les mocks à leur implémentation originale
  jest.restoreAllMocks();
});
```

---

### Piège 4 : Passer le résultat à toThrow au lieu d'une fonction

**Problème** : Tu passes le résultat de l'appel de la fonction au lieu de passer la fonction elle-même.

**Solution** : Envelopper l'appel dans une fonction fléchée.

```javascript
// ❌ L'exception est levée AVANT expect, le test plante
expect(divide(10, 0)).toThrow();

// ✅ Correct : on passe une fonction qui sera appelée par Jest
expect(() => divide(10, 0)).toThrow();
```

---

## Checklist de Validation

- [ ] J'ai installé Jest avec npm
- [ ] Je sais écrire des tests avec describe/it/expect
- [ ] Je connais les matchers principaux (toBe, toEqual, toContain, toThrow)
- [ ] Je sais utiliser beforeEach/afterEach
- [ ] Je sais créer et configurer des mocks avec jest.fn()
- [ ] Je sais tester des fonctions asynchrones avec async/await
- [ ] Je sais lancer les tests et lire le rapport
- [ ] Tous mes tests passent avec `npm test`

---

## Exercice Pratique

**Énoncé** : Crée un module `todoList.js` avec les fonctionnalités suivantes, puis écris une suite complète de tests Jest :

1. `addTodo(title)` - ajoute une tâche (retourne l'objet créé avec id, title, completed: false)
2. `toggleTodo(id)` - bascule le statut completed d'une tâche (lève une erreur si l'id n'existe pas)
3. `removeTodo(id)` - supprime une tâche (lève une erreur si l'id n'existe pas)
4. `getActiveTodos()` - retourne les tâches non complétées
5. `getCompletedTodos()` - retourne les tâches complétées
6. `clearCompleted()` - supprime toutes les tâches complétées

**Indications** :

- Utilise un tableau interne et un compteur pour générer les id
- Écris au minimum 15 tests
- Utilise `beforeEach` pour créer une nouvelle todoList avant chaque test
- Teste les cas d'erreur (id inexistant)
- Teste les cas limites (liste vide, toutes les tâches complétées)

**Résultat attendu** : Tous les tests passent avec `npm test`.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// todoList.js
// Gestionnaire de tâches (Todo List)

class TodoList {
  constructor() {
    // Tableau qui contient toutes les tâches
    this.todos = [];
    // Compteur pour générer des identifiants uniques
    this.nextId = 1;
  }

  // Ajoute une nouvelle tâche et retourne l'objet créé
  addTodo(title) {
    if (!title || title.trim() === '') {
      throw new Error('Le titre ne peut pas être vide');
    }

    const todo = {
      id: this.nextId,
      title: title.trim(),
      completed: false,
    };

    this.todos.push(todo);
    this.nextId++;

    return todo;
  }

  // Bascule le statut completed d'une tâche
  toggleTodo(id) {
    const todo = this.todos.find((t) => t.id === id);

    if (!todo) {
      throw new Error(`Tâche avec l'id ${id} introuvable`);
    }

    todo.completed = !todo.completed;
    return todo;
  }

  // Supprime une tâche par son id
  removeTodo(id) {
    const index = this.todos.findIndex((t) => t.id === id);

    if (index === -1) {
      throw new Error(`Tâche avec l'id ${id} introuvable`);
    }

    this.todos.splice(index, 1);
  }

  // Retourne les tâches non complétées
  getActiveTodos() {
    return this.todos.filter((t) => !t.completed);
  }

  // Retourne les tâches complétées
  getCompletedTodos() {
    return this.todos.filter((t) => t.completed);
  }

  // Supprime toutes les tâches complétées
  clearCompleted() {
    this.todos = this.todos.filter((t) => !t.completed);
  }
}

module.exports = TodoList;
```

```javascript
// todoList.test.js
// Tests complets du gestionnaire de tâches

const TodoList = require('./todoList');

describe('TodoList', () => {
  let todoList;

  beforeEach(() => {
    todoList = new TodoList();
  });

  describe('addTodo', () => {
    it('should add a todo with correct properties', () => {
      const todo = todoList.addTodo('Acheter du pain');

      expect(todo).toEqual({
        id: 1,
        title: 'Acheter du pain',
        completed: false,
      });
    });

    it('should increment id for each new todo', () => {
      const first = todoList.addTodo('Tâche 1');
      const second = todoList.addTodo('Tâche 2');

      expect(first.id).toBe(1);
      expect(second.id).toBe(2);
    });

    it('should trim the title', () => {
      const todo = todoList.addTodo('  Acheter du pain  ');

      expect(todo.title).toBe('Acheter du pain');
    });

    it('should throw for empty title', () => {
      expect(() => todoList.addTodo('')).toThrow(
        'Le titre ne peut pas être vide'
      );
    });

    it('should throw for whitespace-only title', () => {
      expect(() => todoList.addTodo('   ')).toThrow(
        'Le titre ne peut pas être vide'
      );
    });
  });

  describe('toggleTodo', () => {
    it('should mark a todo as completed', () => {
      todoList.addTodo('Tâche 1');

      const toggled = todoList.toggleTodo(1);

      expect(toggled.completed).toBe(true);
    });

    it('should mark a completed todo as active', () => {
      todoList.addTodo('Tâche 1');
      todoList.toggleTodo(1); // completed = true
      const toggled = todoList.toggleTodo(1); // completed = false

      expect(toggled.completed).toBe(false);
    });

    it('should throw for non-existing id', () => {
      expect(() => todoList.toggleTodo(999)).toThrow(
        "Tâche avec l'id 999 introuvable"
      );
    });
  });

  describe('removeTodo', () => {
    it('should remove an existing todo', () => {
      todoList.addTodo('Tâche 1');
      todoList.removeTodo(1);

      expect(todoList.getActiveTodos()).toHaveLength(0);
    });

    it('should throw for non-existing id', () => {
      expect(() => todoList.removeTodo(999)).toThrow(
        "Tâche avec l'id 999 introuvable"
      );
    });
  });

  describe('getActiveTodos', () => {
    it('should return only active todos', () => {
      todoList.addTodo('Active 1');
      todoList.addTodo('Active 2');
      todoList.addTodo('Done');
      todoList.toggleTodo(3); // Marque "Done" comme complétée

      const active = todoList.getActiveTodos();

      expect(active).toHaveLength(2);
      expect(active[0].title).toBe('Active 1');
      expect(active[1].title).toBe('Active 2');
    });

    it('should return empty array when all completed', () => {
      todoList.addTodo('Tâche 1');
      todoList.toggleTodo(1);

      expect(todoList.getActiveTodos()).toHaveLength(0);
    });
  });

  describe('getCompletedTodos', () => {
    it('should return only completed todos', () => {
      todoList.addTodo('Active');
      todoList.addTodo('Done');
      todoList.toggleTodo(2);

      const completed = todoList.getCompletedTodos();

      expect(completed).toHaveLength(1);
      expect(completed[0].title).toBe('Done');
    });
  });

  describe('clearCompleted', () => {
    it('should remove completed todos', () => {
      todoList.addTodo('Active');
      todoList.addTodo('Done');
      todoList.toggleTodo(2);
      todoList.clearCompleted();

      expect(todoList.getActiveTodos()).toHaveLength(1);
      expect(todoList.getCompletedTodos()).toHaveLength(0);
    });

    it('should do nothing when no completed todos', () => {
      todoList.addTodo('Active 1');
      todoList.addTodo('Active 2');
      todoList.clearCompleted();

      expect(todoList.getActiveTodos()).toHaveLength(2);
    });
  });
});
```

Lance les tests :

```bash
npm test
```

**Résultat attendu** :

```text
Tests:       15+ passed, 15+ total
```

Tous les tests passent sans erreur.

---

## Navigation

← Fiche précédente : **[Tests unitaires PHP (PHPUnit)](02-tests-unitaires-php.md)**

→ Fiche suivante : **[Tests d'intégration Symfony](04-tests-integration-symfony.md)**
