---
tags:
  - Node.js
  - Intermédiaire
  - Pratique
description: "Middleware et routes"
estimated_time: "60 min"
fiche_number: 7
total_fiches: 10
cursus: "Node.js"
id: "fundamentals.nodejs.middleware-routes"
course_id: "fundamentals.nodejs"
content_type: "lesson"
order: 7
---

# 07 - Middleware et routes

> **En bref** : À la fin de cette fiche, tu sauras créer et utiliser des middleware, organiser tes routes avec Express Router, et gérer les requêtes POST, PUT et DELETE. Lecture estimée : 60 min.


## Prérequis

- Fiche [07-nodejs/06 - Introduction à Express](06-introduction-express.md)
- Savoir créer des routes GET dans Express
- Comprendre req et res

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des middleware, organiser tes routes avec Express Router, et gérer les requêtes POST, PUT et DELETE.

---

## Concepts

### Qu'est-ce qu'un middleware ?

**Définition** : Un middleware est une fonction qui a accès à la requête (`req`), la réponse (`res`) et à la fonction `next()`. Il peut modifier la requête, la réponse, terminer le cycle requête/réponse, ou passer au middleware suivant.

**Le problème que les middleware résolvent** :

Sans middleware, voici les problèmes rencontrés :

1. **Code dupliqué** : Vérifier l'authentification dans chaque route.
2. **Pas de prétraitement** : Parser le JSON manuellement à chaque fois.
3. **Pas de logs centralisés** : Ajouter des logs dans chaque handler.
4. **Gestion d'erreurs dispersée** : Try/catch dans chaque route.

**Comment les middleware résolvent ces problèmes** :

| Problème | Solution apportée par les middleware |
| -------- | ------------------------------------ |
| Code dupliqué | Un middleware pour l'authentification |
| Pas de prétraitement | `express.json()` parse automatiquement |
| Pas de logs | Middleware de logging |
| Erreurs dispersées | Middleware de gestion d'erreurs global |

**Analogie concrète** : Les middleware sont comme une chaîne de contrôle à l'aéroport. Chaque étape (vérification du billet, contrôle de sécurité, contrôle des passeports) traite le passager puis le passe à l'étape suivante. Si une étape échoue, le passager est renvoyé.

---

### Le flux des middleware

```text
Requête
   │
   ▼
┌──────────────────┐
│  Middleware 1    │  → Logging
│  (app.use)       │
└────────┬─────────┘
         │ next()
         ▼
┌──────────────────┐
│  Middleware 2    │  → Parse JSON
│  (express.json)  │
└────────┬─────────┘
         │ next()
         ▼
┌──────────────────┐
│  Middleware 3    │  → Authentification
│  (auth)          │
└────────┬─────────┘
         │ next() ou res.send()
         ▼
┌──────────────────┐
│  Route Handler   │  → Logique métier
│  (app.get)       │
└────────┬─────────┘
         │ res.json()
         ▼
     Réponse
```

---

### Signature d'un middleware

```javascript
// Middleware standard : 3 arguments
function monMiddleware(req, res, next) {
    // Faire quelque chose avec req
    // Appeler next() pour passer au suivant
    next();
}

// Middleware de gestion d'erreurs : 4 arguments
function gestionErreurs(err, req, res, next) {
    // Gérer l'erreur
    res.status(500).json({ erreur: err.message });
}
```

**Règle importante** : Si tu ne fais ni `next()` ni `res.send()`, la requête reste bloquée.

---

### Express Router

**Définition** : Express Router permet de regrouper des routes liées dans des fichiers séparés.

**Analogie concrète** : Express Router est comme les rayons d'un supermarché. Au lieu de tout mettre en vrac dans un seul couloir, tu organises les produits par catégorie : un rayon fruits, un rayon boulangerie, un rayon boissons. Chaque Router gère un "rayon" de ton API (utilisateurs, produits, commandes).

**Avantages** :

| Sans Router | Avec Router |
| ----------- | ----------- |
| Toutes les routes dans un fichier | Routes organisées par domaine |
| Fichier `index.js` énorme | Fichiers courts et maintenables |
| Difficile de trouver une route | Structure claire |

---

## Étapes Pratiques

### Étape 1 : Configurer le projet

```bash
mkdir projet-middleware
cd projet-middleware
npm init -y
npm install express@4
```

Modifie `package.json` :

```json
{
  "name": "projet-middleware",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

---

### Étape 2 : Créer un middleware de logging

Crée `index.js` :

```javascript
// index.js - Middleware de logging

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware de logging (s'applique à TOUTES les requêtes)
app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();  // IMPORTANT: passer au middleware/route suivant
});

// Routes
app.get('/', (req, res) => {
    res.json({ message: 'Accueil' });
});

app.get('/about', (req, res) => {
    res.json({ message: 'À propos' });
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

Teste en visitant plusieurs URLs. Chaque requête sera loggée dans le terminal.

---

### Étape 3 : Parser le JSON avec express.json()

Pour recevoir des données JSON dans les requêtes POST/PUT, utilise le middleware intégré.

```javascript
// index.js - Parser JSON

import express from 'express';

const app = express();
const PORT = 3000;

// Middleware pour parser le JSON des requêtes
// Sans lui, req.body serait undefined
app.use(express.json());

// Route POST pour tester
app.post('/users', (req, res) => {
    // req.body contient les données JSON envoyées
    console.log('Données reçues:', req.body);

    const { nom, email } = req.body;

    if (!nom || !email) {
        return res.status(400).json({ erreur: 'nom et email requis' });
    }

    res.status(201).json({
        message: 'Utilisateur créé',
        utilisateur: { nom, email }
    });
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

**Tester avec curl** :

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nom": "Alice", "email": "alice@exemple.com"}'
```

**Résultat attendu** :

```json
{"message":"Utilisateur créé","utilisateur":{"nom":"Alice","email":"alice@exemple.com"}}
```

---

### Étape 4 : Créer un middleware d'authentification

```javascript
// index.js - Middleware d'authentification

import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Middleware d'authentification (simple, pour l'exemple)
function authentification(req, res, next) {
    // Vérifier le header Authorization
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).json({ erreur: 'Token manquant' });
    }

    // Vérification simplifiée (en vrai, on vérifierait un JWT)
    if (token !== 'Bearer secret123') {
        return res.status(403).json({ erreur: 'Token invalide' });
    }

    // Ajouter des infos à req pour les routes suivantes
    req.utilisateur = { id: 1, nom: 'Alice' };

    next();  // Continuer vers la route
}

// Route publique (pas de middleware auth)
app.get('/', (req, res) => {
    res.json({ message: 'Route publique' });
});

// Route protégée (middleware auth en second argument)
app.get('/profil', authentification, (req, res) => {
    res.json({
        message: 'Route protégée',
        utilisateur: req.utilisateur
    });
});

// Route protégée
app.get('/dashboard', authentification, (req, res) => {
    res.json({ message: 'Dashboard de ' + req.utilisateur.nom });
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

**Tester** :

```bash
# Sans token (401)
curl http://localhost:3000/profil

# Avec mauvais token (403)
curl http://localhost:3000/profil -H "Authorization: Bearer mauvais"

# Avec bon token (200)
curl http://localhost:3000/profil -H "Authorization: Bearer secret123"
```

---

### Étape 5 : Middleware de gestion d'erreurs

```javascript
// index.js - Gestion d'erreurs centralisée

import express from 'express';

const app = express();
const PORT = 3000;

app.use(express.json());

// Route qui génère une erreur
app.get('/erreur', (req, res, next) => {
    // Simuler une erreur
    const erreur = new Error('Quelque chose a mal tourné');
    erreur.status = 500;
    next(erreur);  // Passer l'erreur au middleware d'erreurs
});

// Route avec erreur non gérée
app.get('/crash', (req, res) => {
    // Cette erreur sera capturée par le middleware d'erreurs
    throw new Error('Erreur inattendue!');
});

// Route normale
app.get('/', (req, res) => {
    res.json({ message: 'OK' });
});

// Middleware 404 (pour les routes non trouvées)
app.use((req, res, next) => {
    const erreur = new Error('Route non trouvée');
    erreur.status = 404;
    next(erreur);
});

// Middleware de gestion d'erreurs (4 arguments!)
// Doit être le DERNIER middleware
app.use((err, req, res, next) => {
    console.error('Erreur:', err.message);

    res.status(err.status || 500).json({
        erreur: err.message,
        // En dev, on peut afficher la stack trace
        // stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

---

### Étape 6 : Organiser avec Express Router

Structure du projet :

```text
projet-middleware/
├── package.json
├── index.js
└── routes/
    ├── users.js
    └── products.js
```

Crée le dossier et les fichiers :

```bash
mkdir routes
```

Crée `routes/users.js` :

```javascript
// routes/users.js

import express from 'express';

const router = express.Router();

// Données simulées
let users = [
    { id: 1, nom: 'Alice', email: 'alice@exemple.com' },
    { id: 2, nom: 'Bob', email: 'bob@exemple.com' }
];

// GET /users - Liste des utilisateurs
router.get('/', (req, res) => {
    res.json(users);
});

// GET /users/:id - Un utilisateur
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const user = users.find(u => u.id === id);

    if (!user) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }

    res.json(user);
});

// POST /users - Créer un utilisateur
router.post('/', (req, res) => {
    const { nom, email } = req.body;

    if (!nom || !email) {
        return res.status(400).json({ erreur: 'nom et email requis' });
    }

    const newUser = {
        id: users.length + 1,
        nom,
        email
    };

    users.push(newUser);
    res.status(201).json(newUser);
});

// PUT /users/:id - Modifier un utilisateur
router.put('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }

    const { nom, email } = req.body;
    users[index] = { ...users[index], nom, email };

    res.json(users[index]);
});

// DELETE /users/:id - Supprimer un utilisateur
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = users.findIndex(u => u.id === id);

    if (index === -1) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }

    users.splice(index, 1);
    res.status(204).send();
});

export default router;
```

Crée `routes/products.js` :

```javascript
// routes/products.js

import express from 'express';

const router = express.Router();

let products = [
    { id: 1, nom: 'Laptop', prix: 999 },
    { id: 2, nom: 'Souris', prix: 29 }
];

// GET /products
router.get('/', (req, res) => {
    res.json(products);
});

// GET /products/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id === id);

    if (!product) {
        return res.status(404).json({ erreur: 'Produit non trouvé' });
    }

    res.json(product);
});

// POST /products
router.post('/', (req, res) => {
    const { nom, prix } = req.body;

    if (!nom || !prix) {
        return res.status(400).json({ erreur: 'nom et prix requis' });
    }

    const newProduct = {
        id: products.length + 1,
        nom,
        prix
    };

    products.push(newProduct);
    res.status(201).json(newProduct);
});

export default router;
```

Modifie `index.js` :

```javascript
// index.js - Utiliser les routers

import express from 'express';
import usersRouter from './routes/users.js';
import productsRouter from './routes/products.js';

const app = express();
const PORT = 3000;

// Middleware globaux
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Monter les routers
app.use('/users', usersRouter);      // Toutes les routes de users.js
app.use('/products', productsRouter); // Toutes les routes de products.js

// Route racine
app.get('/', (req, res) => {
    res.json({
        message: 'API REST',
        endpoints: {
            users: '/users',
            products: '/products'
        }
    });
});

// 404
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

---

### Étape 7 : Tester les méthodes HTTP

**GET** (liste) :

```bash
curl http://localhost:3000/users
```

**GET** (un seul) :

```bash
curl http://localhost:3000/users/1
```

**POST** (créer) :

```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"nom": "Charlie", "email": "charlie@exemple.com"}'
```

**PUT** (modifier) :

```bash
curl -X PUT http://localhost:3000/users/1 \
  -H "Content-Type: application/json" \
  -d '{"nom": "Alice Modifiée", "email": "alice.new@exemple.com"}'
```

**DELETE** (supprimer) :

```bash
curl -X DELETE http://localhost:3000/users/2
```

---

### Étape 8 : Middleware spécifique à un router

Tu peux appliquer un middleware uniquement à certaines routes.

Modifie `routes/users.js` :

```javascript
// routes/users.js - Avec middleware local

import express from 'express';

const router = express.Router();

let users = [
    { id: 1, nom: 'Alice', email: 'alice@exemple.com' },
    { id: 2, nom: 'Bob', email: 'bob@exemple.com' }
];

// Middleware local : s'applique à toutes les routes de ce router
router.use((req, res, next) => {
    console.log('Accès aux routes users');
    next();
});

// Middleware pour valider l'ID
function validateId(req, res, next) {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erreur: 'ID invalide' });
    }

    req.userId = id;  // Stocker l'ID parsé
    next();
}

// Routes avec le middleware validateId
router.get('/:id', validateId, (req, res) => {
    const user = users.find(u => u.id === req.userId);
    if (!user) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }
    res.json(user);
});

router.put('/:id', validateId, (req, res) => {
    const index = users.findIndex(u => u.id === req.userId);
    if (index === -1) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }
    const { nom, email } = req.body;
    users[index] = { ...users[index], nom, email };
    res.json(users[index]);
});

router.delete('/:id', validateId, (req, res) => {
    const index = users.findIndex(u => u.id === req.userId);
    if (index === -1) {
        return res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }
    users.splice(index, 1);
    res.status(204).send();
});

// Routes sans validateId
router.get('/', (req, res) => {
    res.json(users);
});

router.post('/', (req, res) => {
    const { nom, email } = req.body;
    if (!nom || !email) {
        return res.status(400).json({ erreur: 'nom et email requis' });
    }
    const newUser = { id: users.length + 1, nom, email };
    users.push(newUser);
    res.status(201).json(newUser);
});

export default router;
```

---

## Middleware intégrés à Express

| Middleware | Usage |
| ---------- | ----- |
| `express.json()` | Parse le JSON du body |
| `express.urlencoded({ extended: true })` | Parse les formulaires HTML |
| `express.static('public')` | Sert des fichiers statiques |

---

## Ordre d'exécution des middleware

| Position | Middleware | Exemple |
| -------- | ---------- | ------- |
| 1 | Logging, CORS | Avant tout traitement |
| 2 | Body parsers | `express.json()` |
| 3 | Auth, validation | Vérifier l'accès |
| 4 | Routes | Logique métier |
| 5 | 404 handler | Routes non trouvées |
| 6 | Error handler | Erreurs globales |

---

## Pièges Fréquents

### Piège 1 : Oublier next()

⚠️ **Problème** : La requête reste en attente.

```javascript
// ❌ Oubli de next()
app.use((req, res, next) => {
    console.log('Log');
    // next() manquant!
});
```

✅ **Solution** : Toujours appeler `next()` ou envoyer une réponse.

---

### Piège 2 : Ordre des middleware

⚠️ **Problème** : Le middleware de parsing JSON est après les routes.

```javascript
// ❌ Mauvais ordre
app.post('/users', (req, res) => {
    console.log(req.body);  // undefined!
});
app.use(express.json());
```

✅ **Solution** : Middleware globaux AVANT les routes.

```javascript
// ✅ Bon ordre
app.use(express.json());
app.post('/users', (req, res) => {
    console.log(req.body);  // OK
});
```

---

### Piège 3 : next() après res.send()

⚠️ **Problème** : Appeler `next()` après avoir envoyé une réponse.

```javascript
// ❌ Problème
app.use((req, res, next) => {
    res.send('Réponse');
    next();  // Provoque des erreurs
});
```

✅ **Solution** : Soit `next()`, soit `res.send()`, pas les deux.

---

### Piège 4 : Middleware d'erreurs mal placé

⚠️ **Problème** : Le middleware d'erreurs n'est pas en dernier.

✅ **Solution** : Toujours mettre le middleware d'erreurs (4 arguments) en dernier.

---

## Checklist de Validation

- [ ] Je sais créer un middleware avec `app.use()`
- [ ] Je comprends le rôle de `next()`
- [ ] Je sais utiliser `express.json()` pour parser le JSON
- [ ] Je sais créer un middleware d'authentification
- [ ] Je sais utiliser Express Router pour organiser mes routes
- [ ] Je sais gérer les routes POST, PUT et DELETE
- [ ] Je sais créer un middleware de gestion d'erreurs

---

## Exercice Pratique

**Énoncé** : Refactorise une API de tâches (todo list) avec :

1. Un fichier `routes/tasks.js` avec toutes les routes CRUD
2. Un middleware de logging qui affiche la méthode, l'URL et la durée de la requête
3. Un middleware de validation qui vérifie que les tâches ont un titre

Routes à implémenter :

- `GET /tasks` - Liste des tâches
- `GET /tasks/:id` - Une tâche
- `POST /tasks` - Créer une tâche (titre requis)
- `PUT /tasks/:id` - Modifier une tâche
- `DELETE /tasks/:id` - Supprimer une tâche
- `PATCH /tasks/:id/toggle` - Basculer le statut complété/non complété

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**routes/tasks.js** :

```javascript
// routes/tasks.js

import express from 'express';

const router = express.Router();

let tasks = [
    { id: 1, titre: 'Apprendre Express', completed: false },
    { id: 2, titre: 'Créer une API', completed: true }
];

// Middleware de validation du titre
function validateTitle(req, res, next) {
    const { titre } = req.body;
    if (!titre || titre.trim() === '') {
        return res.status(400).json({ erreur: 'Le titre est requis' });
    }
    next();
}

// GET /tasks
router.get('/', (req, res) => {
    res.json(tasks);
});

// GET /tasks/:id
router.get('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    res.json(task);
});

// POST /tasks
router.post('/', validateTitle, (req, res) => {
    const newTask = {
        id: tasks.length + 1,
        titre: req.body.titre.trim(),
        completed: false
    };

    tasks.push(newTask);
    res.status(201).json(newTask);
});

// PUT /tasks/:id
router.put('/:id', validateTitle, (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    tasks[index] = {
        ...tasks[index],
        titre: req.body.titre.trim(),
        completed: req.body.completed ?? tasks[index].completed
    };

    res.json(tasks[index]);
});

// DELETE /tasks/:id
router.delete('/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = tasks.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    tasks.splice(index, 1);
    res.status(204).send();
});

// PATCH /tasks/:id/toggle
router.patch('/:id/toggle', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);

    if (!task) {
        return res.status(404).json({ erreur: 'Tâche non trouvée' });
    }

    task.completed = !task.completed;
    res.json(task);
});

export default router;
```

**index.js** :

```javascript
// index.js

import express from 'express';
import tasksRouter from './routes/tasks.js';

const app = express();
const PORT = 3000;

// Middleware de logging avec durée
app.use((req, res, next) => {
    const start = Date.now();

    // Intercepter la fin de la réponse
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`);
    });

    next();
});

// Parser JSON
app.use(express.json());

// Routes
app.use('/tasks', tasksRouter);

// Accueil
app.get('/', (req, res) => {
    res.json({ message: 'API Todo', endpoint: '/tasks' });
});

// 404
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route non trouvée' });
});

// Erreurs
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ erreur: 'Erreur serveur' });
});

app.listen(PORT, () => {
    console.log(`API Todo sur http://localhost:${PORT}`);
});
```

---

## Navigation

← Fiche précédente : **[Introduction à Express](06-introduction-express.md)**

→ Fiche suivante : **[API REST avec Express](08-api-rest.md)**
