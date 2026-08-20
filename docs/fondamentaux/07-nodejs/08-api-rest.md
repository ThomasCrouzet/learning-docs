---
tags:
  - Node.js
  - Avancé
  - Pratique
description: "API REST avec Express"
estimated_time: "70 min"
fiche_number: 8
total_fiches: 10
cursus: "Node.js"
---

# 08 - API REST avec Express

> **En bref** : À la fin de cette fiche, tu sauras concevoir et implémenter une API REST complète avec Express, en respectant les bonnes pratiques. Lecture estimée : 70 min.


## Prérequis

- Fiche [07-nodejs/06 - Introduction à Express](06-introduction-express.md)
- Fiche [07-nodejs/07 - Middleware et routes](07-middleware-routes.md)
- Comprendre les méthodes HTTP (GET, POST, PUT, DELETE)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras concevoir et implémenter une API REST complète avec Express, en respectant les bonnes pratiques.

---

## Concepts

### Qu'est-ce qu'une API REST ?

**Définition** : REST (Representational State Transfer) est un style d'architecture pour concevoir des APIs web. Une API REST utilise les méthodes HTTP standard pour effectuer des opérations sur des ressources identifiées par des URLs.

**Le problème que REST résout** :

Sans standard comme REST, voici les problèmes rencontrés :

1. **Incohérence** : Chaque API utilise ses propres conventions.
2. **Documentation complexe** : Difficile de deviner comment utiliser l'API.
3. **Couplage fort** : Le client doit connaître les détails internes du serveur.
4. **Pas de standard** : Impossible de créer des outils génériques.

**Comment REST résout ces problèmes** :

| Problème | Solution apportée par REST |
| -------- | -------------------------- |
| Incohérence | Conventions universelles |
| Documentation complexe | URLs et méthodes prédictibles |
| Couplage fort | Interface uniforme |
| Pas de standard | Protocole HTTP standard |

**Analogie concrète** : REST est comme le code de la route. Tout le monde connaît les règles (feu rouge = stop, feu vert = avancer). Même dans un pays étranger, tu sais comment conduire car les conventions sont universelles.

---

### Les principes REST

| Principe | Description |
| -------- | ----------- |
| **Ressources** | Tout est une ressource identifiée par une URL |
| **Méthodes HTTP** | GET lit, POST crée, PUT modifie, DELETE supprime |
| **Sans état** | Chaque requête contient tout le nécessaire |
| **Représentations** | Les ressources peuvent avoir plusieurs formats (JSON, XML) |

---

### Design des URLs

**Règles de nommage** :

| ✅ Bon | ❌ Mauvais | Pourquoi |
| ------ | --------- | -------- |
| `/users` | `/getUsers` | Le verbe est dans la méthode HTTP |
| `/users/123` | `/user?id=123` | L'ID fait partie du chemin |
| `/users/123/posts` | `/getUserPosts` | Relations dans l'URL |
| `/products` | `/Products` | Tout en minuscules |
| `/order-items` | `/order_items` | Tirets, pas underscores |

**Structure recommandée** :

```text
GET    /resources         → Liste des ressources
GET    /resources/:id     → Une ressource
POST   /resources         → Créer une ressource
PUT    /resources/:id     → Remplacer une ressource
PATCH  /resources/:id     → Modifier partiellement
DELETE /resources/:id     → Supprimer une ressource
```

---

### Codes HTTP appropriés

**Succès** :

| Code | Signification | Quand l'utiliser |
| ---- | ------------- | ---------------- |
| 200 | OK | GET réussi, PUT/PATCH réussi |
| 201 | Created | POST réussi (ressource créée) |
| 204 | No Content | DELETE réussi |

**Erreurs client** :

| Code | Signification | Quand l'utiliser |
| ---- | ------------- | ---------------- |
| 400 | Bad Request | Données invalides |
| 401 | Unauthorized | Non authentifié |
| 403 | Forbidden | Pas les droits |
| 404 | Not Found | Ressource inexistante |
| 409 | Conflict | Conflit (doublon) |
| 422 | Unprocessable Entity | Validation échouée |

**Erreurs serveur** :

| Code | Signification | Quand l'utiliser |
| ---- | ------------- | ---------------- |
| 500 | Internal Server Error | Erreur inattendue |

---

### Structure d'une réponse JSON

**Réponse simple (une ressource)** :

```json
{
  "id": 1,
  "nom": "Alice",
  "email": "alice@exemple.com"
}
```

**Réponse liste (plusieurs ressources)** :

```json
{
  "total": 42,
  "page": 1,
  "limit": 10,
  "data": [
    { "id": 1, "nom": "Alice" },
    { "id": 2, "nom": "Bob" }
  ]
}
```

**Réponse erreur** :

```json
{
  "erreur": {
    "code": "VALIDATION_ERROR",
    "message": "Le champ email est invalide",
    "details": {
      "email": "Format d'email incorrect"
    }
  }
}
```

---

## Étapes Pratiques

### Étape 1 : Structure du projet

```bash
mkdir api-rest
cd api-rest
npm init -y
npm install express@4
```

Structure finale :

```text
api-rest/
├── package.json
├── index.js
├── routes/
│   └── books.js
├── middleware/
│   ├── errorHandler.js
│   └── validate.js
└── data/
    └── books.js
```

Crée les dossiers :

```bash
mkdir routes middleware data
```

---

### Étape 2 : Créer les données

Crée `data/books.js` :

```javascript
// data/books.js - Données simulées

let books = [
    {
        id: 1,
        titre: 'Le Petit Prince',
        auteur: 'Antoine de Saint-Exupéry',
        annee: 1943,
        genre: 'conte',
        isbn: '978-2-07-040850-4'
    },
    {
        id: 2,
        titre: '1984',
        auteur: 'George Orwell',
        annee: 1949,
        genre: 'dystopie',
        isbn: '978-2-07-036822-8'
    },
    {
        id: 3,
        titre: 'Fondation',
        auteur: 'Isaac Asimov',
        annee: 1951,
        genre: 'science-fiction',
        isbn: '978-2-07-041239-6'
    }
];

// Compteur pour les nouveaux IDs
let nextId = 4;

// Fonctions CRUD
export function getAllBooks() {
    return books;
}

export function getBookById(id) {
    return books.find(b => b.id === id);
}

export function getBookByIsbn(isbn) {
    return books.find(b => b.isbn === isbn);
}

export function createBook(data) {
    const book = {
        id: nextId++,
        ...data
    };
    books.push(book);
    return book;
}

export function updateBook(id, data) {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;

    books[index] = { ...books[index], ...data };
    return books[index];
}

export function deleteBook(id) {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;

    books.splice(index, 1);
    return true;
}

export function filterBooks(filters) {
    let result = [...books];

    if (filters.genre) {
        result = result.filter(b => b.genre === filters.genre);
    }

    if (filters.auteur) {
        result = result.filter(b =>
            b.auteur.toLowerCase().includes(filters.auteur.toLowerCase())
        );
    }

    if (filters.anneeMin) {
        result = result.filter(b => b.annee >= parseInt(filters.anneeMin));
    }

    if (filters.anneeMax) {
        result = result.filter(b => b.annee <= parseInt(filters.anneeMax));
    }

    return result;
}
```

---

### Étape 3 : Créer le middleware de validation

Crée `middleware/validate.js` :

```javascript
// middleware/validate.js

// Valider les données d'un livre
export function validateBook(req, res, next) {
    const { titre, auteur, annee, genre, isbn } = req.body;
    const errors = {};

    // Titre requis
    if (!titre || titre.trim() === '') {
        errors.titre = 'Le titre est requis';
    }

    // Auteur requis
    if (!auteur || auteur.trim() === '') {
        errors.auteur = "L'auteur est requis";
    }

    // Année doit être un nombre valide
    if (annee !== undefined) {
        const anneeNum = parseInt(annee);
        if (isNaN(anneeNum) || anneeNum < 0 || anneeNum > new Date().getFullYear()) {
            errors.annee = "L'année doit être un nombre valide";
        }
    }

    // Si des erreurs, renvoyer 422
    if (Object.keys(errors).length > 0) {
        return res.status(422).json({
            erreur: {
                code: 'VALIDATION_ERROR',
                message: 'Données invalides',
                details: errors
            }
        });
    }

    // Nettoyer les données
    req.body.titre = titre?.trim();
    req.body.auteur = auteur?.trim();
    req.body.genre = genre?.trim().toLowerCase();
    req.body.isbn = isbn?.trim();
    if (annee) req.body.annee = parseInt(annee);

    next();
}

// Valider que l'ID est un nombre
export function validateId(req, res, next) {
    const id = parseInt(req.params.id);

    if (isNaN(id) || id <= 0) {
        return res.status(400).json({
            erreur: {
                code: 'INVALID_ID',
                message: "L'ID doit être un nombre positif"
            }
        });
    }

    req.bookId = id;
    next();
}
```

---

### Étape 4 : Créer le middleware de gestion d'erreurs

Crée `middleware/errorHandler.js` :

```javascript
// middleware/errorHandler.js

// Middleware 404
export function notFound(req, res, next) {
    res.status(404).json({
        erreur: {
            code: 'NOT_FOUND',
            message: `La route ${req.method} ${req.url} n'existe pas`
        }
    });
}

// Middleware de gestion d'erreurs globales
export function errorHandler(err, req, res, next) {
    console.error('Erreur:', err);

    // Erreur de parsing JSON
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            erreur: {
                code: 'INVALID_JSON',
                message: 'Le JSON envoyé est invalide'
            }
        });
    }

    // Erreur générique
    res.status(err.status || 500).json({
        erreur: {
            code: err.code || 'INTERNAL_ERROR',
            message: err.message || 'Une erreur interne est survenue'
        }
    });
}
```

---

### Étape 5 : Créer les routes

Crée `routes/books.js` :

```javascript
// routes/books.js

import express from 'express';
import {
    getAllBooks,
    getBookById,
    getBookByIsbn,
    createBook,
    updateBook,
    deleteBook,
    filterBooks
} from '../data/books.js';
import { validateBook, validateId } from '../middleware/validate.js';

const router = express.Router();

// GET /books - Liste des livres avec filtrage et pagination
router.get('/', (req, res) => {
    const { page = 1, limit = 10, ...filters } = req.query;

    // Filtrer les livres
    let books = filterBooks(filters);

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(100, Math.max(1, parseInt(limit)));
    const startIndex = (pageNum - 1) * limitNum;
    const endIndex = startIndex + limitNum;

    const paginatedBooks = books.slice(startIndex, endIndex);

    res.json({
        total: books.length,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(books.length / limitNum),
        data: paginatedBooks
    });
});

// GET /books/:id - Un livre par ID
router.get('/:id', validateId, (req, res) => {
    const book = getBookById(req.bookId);

    if (!book) {
        return res.status(404).json({
            erreur: {
                code: 'BOOK_NOT_FOUND',
                message: `Le livre avec l'ID ${req.bookId} n'existe pas`
            }
        });
    }

    res.json(book);
});

// POST /books - Créer un livre
router.post('/', validateBook, (req, res) => {
    const { titre, auteur, annee, genre, isbn } = req.body;

    // Vérifier si l'ISBN existe déjà
    if (isbn && getBookByIsbn(isbn)) {
        return res.status(409).json({
            erreur: {
                code: 'ISBN_EXISTS',
                message: 'Un livre avec cet ISBN existe déjà'
            }
        });
    }

    const book = createBook({ titre, auteur, annee, genre, isbn });

    // 201 Created avec l'URL de la ressource créée
    res.status(201)
        .location(`/books/${book.id}`)
        .json(book);
});

// PUT /books/:id - Remplacer un livre
router.put('/:id', validateId, validateBook, (req, res) => {
    const { titre, auteur, annee, genre, isbn } = req.body;

    // Vérifier si l'ISBN existe déjà (pour un autre livre)
    if (isbn) {
        const existingBook = getBookByIsbn(isbn);
        if (existingBook && existingBook.id !== req.bookId) {
            return res.status(409).json({
                erreur: {
                    code: 'ISBN_EXISTS',
                    message: 'Un autre livre avec cet ISBN existe déjà'
                }
            });
        }
    }

    const book = updateBook(req.bookId, { titre, auteur, annee, genre, isbn });

    if (!book) {
        return res.status(404).json({
            erreur: {
                code: 'BOOK_NOT_FOUND',
                message: `Le livre avec l'ID ${req.bookId} n'existe pas`
            }
        });
    }

    res.json(book);
});

// PATCH /books/:id - Modifier partiellement un livre
router.patch('/:id', validateId, (req, res) => {
    const currentBook = getBookById(req.bookId);

    if (!currentBook) {
        return res.status(404).json({
            erreur: {
                code: 'BOOK_NOT_FOUND',
                message: `Le livre avec l'ID ${req.bookId} n'existe pas`
            }
        });
    }

    // Vérifier si l'ISBN existe déjà (pour un autre livre)
    if (req.body.isbn) {
        const existingBook = getBookByIsbn(req.body.isbn);
        if (existingBook && existingBook.id !== req.bookId) {
            return res.status(409).json({
                erreur: {
                    code: 'ISBN_EXISTS',
                    message: 'Un autre livre avec cet ISBN existe déjà'
                }
            });
        }
    }

    // Mettre à jour uniquement les champs fournis
    const updates = {};
    if (req.body.titre) updates.titre = req.body.titre.trim();
    if (req.body.auteur) updates.auteur = req.body.auteur.trim();
    if (req.body.annee) updates.annee = parseInt(req.body.annee);
    if (req.body.genre) updates.genre = req.body.genre.trim().toLowerCase();
    if (req.body.isbn) updates.isbn = req.body.isbn.trim();

    const book = updateBook(req.bookId, updates);
    res.json(book);
});

// DELETE /books/:id - Supprimer un livre
router.delete('/:id', validateId, (req, res) => {
    const deleted = deleteBook(req.bookId);

    if (!deleted) {
        return res.status(404).json({
            erreur: {
                code: 'BOOK_NOT_FOUND',
                message: `Le livre avec l'ID ${req.bookId} n'existe pas`
            }
        });
    }

    // 204 No Content (pas de body)
    res.status(204).send();
});

export default router;
```

---

### Étape 6 : Assembler l'application

Crée `index.js` :

```javascript
// index.js - Point d'entrée de l'API

import express from 'express';
import booksRouter from './routes/books.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de logging
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`);
    });
    next();
});

// Parser JSON
app.use(express.json());

// Route racine - Documentation de l'API
app.get('/', (req, res) => {
    res.json({
        nom: 'API Bibliothèque',
        version: '1.0.0',
        description: 'API REST pour gérer une collection de livres',
        endpoints: {
            'GET /books': 'Liste des livres (avec pagination et filtres)',
            'GET /books/:id': 'Détails d\'un livre',
            'POST /books': 'Créer un livre',
            'PUT /books/:id': 'Remplacer un livre',
            'PATCH /books/:id': 'Modifier partiellement un livre',
            'DELETE /books/:id': 'Supprimer un livre'
        },
        filtres: {
            genre: 'Filtrer par genre',
            auteur: 'Filtrer par auteur (recherche partielle)',
            anneeMin: 'Année minimum',
            anneeMax: 'Année maximum'
        },
        pagination: {
            page: 'Numéro de page (défaut: 1)',
            limit: 'Nombre par page (défaut: 10, max: 100)'
        }
    });
});

// Routes de l'API
app.use('/books', booksRouter);

// Middleware 404 (après toutes les routes)
app.use(notFound);

// Middleware de gestion d'erreurs (en dernier)
app.use(errorHandler);

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`API Bibliothèque démarrée sur http://localhost:${PORT}`);
});
```

Modifie `package.json` :

```json
{
  "name": "api-rest",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "dependencies": {
    "express": "^4.21.0"
  }
}
```

---

### Étape 7 : Tester l'API

Lance le serveur :

```bash
npm run dev
```

**Documentation** :

```bash
curl http://localhost:3000/
```

**Liste des livres** :

```bash
curl http://localhost:3000/books
```

**Filtrer par genre** :

```bash
curl "http://localhost:3000/books?genre=science-fiction"
```

**Pagination** :

```bash
curl "http://localhost:3000/books?page=1&limit=2"
```

**Un livre** :

```bash
curl http://localhost:3000/books/1
```

**Créer un livre** :

```bash
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"titre":"Dune","auteur":"Frank Herbert","annee":1965,"genre":"science-fiction","isbn":"978-2-266-23339-9"}'
```

**Modifier partiellement** :

```bash
curl -X PATCH http://localhost:3000/books/1 \
  -H "Content-Type: application/json" \
  -d '{"annee":1944}'
```

**Remplacer complètement** :

```bash
curl -X PUT http://localhost:3000/books/2 \
  -H "Content-Type: application/json" \
  -d '{"titre":"1984 - Édition révisée","auteur":"George Orwell","annee":1949,"genre":"dystopie","isbn":"978-2-07-036822-8"}'
```

**Supprimer** :

```bash
curl -X DELETE http://localhost:3000/books/3
```

**Tester les erreurs** :

```bash
# ID invalide
curl http://localhost:3000/books/abc

# Livre inexistant
curl http://localhost:3000/books/999

# Données invalides
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"titre":""}'

# JSON invalide
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d 'pas du json'
```

---

## Bonnes pratiques REST

| Catégorie | Bonne pratique |
| --------- | -------------- |
| **URLs** | Noms au pluriel (`/books`, pas `/book`) |
| **URLs** | Minuscules et tirets (`/order-items`) |
| **URLs** | Pas de verbes (`GET /books`, pas `GET /getBooks`) |
| **Codes HTTP** | 200 pour GET/PUT/PATCH réussis |
| **Codes HTTP** | 201 pour POST réussi |
| **Codes HTTP** | 204 pour DELETE réussi |
| **Codes HTTP** | 4xx pour erreurs client |
| **Codes HTTP** | 5xx pour erreurs serveur |
| **JSON** | Toujours renvoyer du JSON |
| **JSON** | Format cohérent pour les erreurs |
| **Pagination** | Toujours paginer les listes |
| **Validation** | Valider les entrées utilisateur |

---

## Pièges Fréquents

### Piège 1 : Utiliser des verbes dans les URLs

⚠️ **Problème** :

```text
GET /getBooks
POST /createBook
```

✅ **Solution** :

```text
GET /books
POST /books
```

---

### Piège 2 : Toujours renvoyer 200

⚠️ **Problème** : Renvoyer 200 même pour les erreurs.

```javascript
// ❌ Mauvais
res.status(200).json({ error: "Livre non trouvé" });
```

✅ **Solution** : Utiliser les codes appropriés.

```javascript
// ✅ Bon
res.status(404).json({ erreur: { message: "Livre non trouvé" } });
```

---

### Piège 3 : Ne pas valider les entrées

⚠️ **Problème** : Accepter n'importe quelles données.

✅ **Solution** : Toujours valider avec un middleware dédié.

---

### Piège 4 : PUT vs PATCH mal utilisés

| Méthode | Usage correct |
| ------- | ------------- |
| PUT | Remplacer la ressource entière |
| PATCH | Modifier partiellement |

```javascript
// PUT : tous les champs requis
PUT /books/1
{ "titre": "...", "auteur": "...", "annee": "...", "genre": "...", "isbn": "..." }

// PATCH : seulement ce qui change
PATCH /books/1
{ "annee": 1944 }
```

---

## Checklist de Validation

- [ ] Mes URLs utilisent des noms (pas de verbes)
- [ ] Mes ressources sont au pluriel
- [ ] J'utilise les bons codes HTTP
- [ ] Je valide toutes les entrées utilisateur
- [ ] Mes erreurs sont formatées de manière cohérente
- [ ] Je pagine mes listes
- [ ] J'ai un middleware de gestion d'erreurs global
- [ ] Mes routes sont organisées avec Express Router

---

## Exercice Pratique

**Énoncé** : Crée une API REST complète pour gérer des utilisateurs avec les fonctionnalités :

1. CRUD complet (Create, Read, Update, Delete)
2. Validation : email unique, nom et email requis
3. Filtrage par rôle (`admin`, `user`)
4. Recherche par nom (partielle)
5. Route spéciale `POST /users/:id/activate` pour activer un compte

**Structure des données** :

```javascript
{
  id: 1,
  nom: "Alice",
  email: "alice@exemple.com",
  role: "admin",
  actif: true,
  dateCreation: "2025-01-23T10:00:00.000Z"
}
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**data/users.js** :

```javascript
// data/users.js

let users = [
    { id: 1, nom: 'Alice', email: 'alice@exemple.com', role: 'admin', actif: true, dateCreation: '2025-01-01T10:00:00.000Z' },
    { id: 2, nom: 'Bob', email: 'bob@exemple.com', role: 'user', actif: false, dateCreation: '2025-01-15T14:30:00.000Z' }
];

let nextId = 3;

export function getAllUsers() { return users; }

export function getUserById(id) {
    return users.find(u => u.id === id);
}

export function getUserByEmail(email) {
    return users.find(u => u.email.toLowerCase() === email.toLowerCase());
}

export function createUser(data) {
    const user = {
        id: nextId++,
        ...data,
        actif: false,
        dateCreation: new Date().toISOString()
    };
    users.push(user);
    return user;
}

export function updateUser(id, data) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return null;
    users[index] = { ...users[index], ...data };
    return users[index];
}

export function deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;
    users.splice(index, 1);
    return true;
}

export function filterUsers(filters) {
    let result = [...users];
    if (filters.role) {
        result = result.filter(u => u.role === filters.role);
    }
    if (filters.nom) {
        result = result.filter(u => u.nom.toLowerCase().includes(filters.nom.toLowerCase()));
    }
    if (filters.actif !== undefined) {
        result = result.filter(u => u.actif === (filters.actif === 'true'));
    }
    return result;
}
```

**routes/users.js** :

```javascript
// routes/users.js

import express from 'express';
import { getAllUsers, getUserById, getUserByEmail, createUser, updateUser, deleteUser, filterUsers } from '../data/users.js';

const router = express.Router();

// Validation
function validateUser(req, res, next) {
    const { nom, email } = req.body;
    const errors = {};
    if (!nom?.trim()) errors.nom = 'Le nom est requis';
    if (!email?.trim()) errors.email = "L'email est requis";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errors.email = "Format d'email invalide";
    }
    if (Object.keys(errors).length > 0) {
        return res.status(422).json({ erreur: { code: 'VALIDATION_ERROR', details: errors } });
    }
    next();
}

function validateId(req, res, next) {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
        return res.status(400).json({ erreur: { code: 'INVALID_ID' } });
    }
    req.userId = id;
    next();
}

// GET /users
router.get('/', (req, res) => {
    const users = filterUsers(req.query);
    res.json({ total: users.length, data: users });
});

// GET /users/:id
router.get('/:id', validateId, (req, res) => {
    const user = getUserById(req.userId);
    if (!user) return res.status(404).json({ erreur: { code: 'USER_NOT_FOUND' } });
    res.json(user);
});

// POST /users
router.post('/', validateUser, (req, res) => {
    const { nom, email, role = 'user' } = req.body;
    if (getUserByEmail(email)) {
        return res.status(409).json({ erreur: { code: 'EMAIL_EXISTS' } });
    }
    const user = createUser({ nom: nom.trim(), email: email.trim().toLowerCase(), role });
    res.status(201).json(user);
});

// PUT /users/:id
router.put('/:id', validateId, validateUser, (req, res) => {
    const { nom, email, role } = req.body;
    const existing = getUserByEmail(email);
    if (existing && existing.id !== req.userId) {
        return res.status(409).json({ erreur: { code: 'EMAIL_EXISTS' } });
    }
    const user = updateUser(req.userId, { nom: nom.trim(), email: email.trim().toLowerCase(), role });
    if (!user) return res.status(404).json({ erreur: { code: 'USER_NOT_FOUND' } });
    res.json(user);
});

// DELETE /users/:id
router.delete('/:id', validateId, (req, res) => {
    if (!deleteUser(req.userId)) {
        return res.status(404).json({ erreur: { code: 'USER_NOT_FOUND' } });
    }
    res.status(204).send();
});

// POST /users/:id/activate
router.post('/:id/activate', validateId, (req, res) => {
    const user = updateUser(req.userId, { actif: true });
    if (!user) return res.status(404).json({ erreur: { code: 'USER_NOT_FOUND' } });
    res.json({ message: 'Utilisateur activé', user });
});

export default router;
```

**index.js** :

```javascript
// index.js

import express from 'express';
import usersRouter from './routes/users.js';

const app = express();
const PORT = 3000;

app.use(express.json());
app.use('/users', usersRouter);

app.get('/', (req, res) => {
    res.json({ message: 'API Users', endpoints: ['/users'] });
});

app.use((req, res) => {
    res.status(404).json({ erreur: { code: 'NOT_FOUND' } });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

---

## Navigation

← Fiche précédente : **[Middleware et routes](07-middleware-routes.md)**

→ Fiche suivante : **[Variables d'environnement et configuration](09-variables-environnement.md)**
