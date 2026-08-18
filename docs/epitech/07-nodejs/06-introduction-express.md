---
tags:
  - Node.js
  - Intermédiaire
  - Concept
description: "Introduction à Express"
estimated_time: "60 min"
fiche_number: 6
total_fiches: 10
cursus: "Node.js"
---

# 06 - Introduction à Express

> **En bref** : À la fin de cette fiche, tu sauras créer un serveur web avec Express, définir des routes et envoyer des réponses HTTP. Lecture estimée : 60 min.


## Prérequis

- Fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md)
- Fiche [07-nodejs/02 - npm et gestion des packages](02-npm-packages.md)
- Fiche [07-nodejs/04 - Programmation asynchrone](04-programmation-asynchrone.md)
- Comprendre les bases de HTTP (requêtes, réponses)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un serveur web avec Express, définir des routes et envoyer des réponses HTTP.

---

## Concepts

### Qu'est-ce qu'Express ?

**Définition** : Express est un framework web minimaliste pour Node.js. Il simplifie la création de serveurs HTTP et d'APIs.

**Le problème qu'Express résout** :

Sans Express, voici les problèmes rencontrés :

1. **Code verbeux** : Le module `http` natif de Node.js nécessite beaucoup de code.
2. **Pas de routing** : Il faut parser manuellement l'URL pour diriger les requêtes.
3. **Pas de middleware** : Chaque fonctionnalité (parsing JSON, logs, auth) doit être codée manuellement.
4. **Gestion manuelle des réponses** : Headers, codes HTTP, tout doit être géré à la main.

**Comment Express résout ces problèmes** :

| Problème | Solution apportée par Express |
| -------- | ----------------------------- |
| Code verbeux | API simple et expressive |
| Pas de routing | Système de routes intégré |
| Pas de middleware | Architecture middleware |
| Gestion manuelle | Méthodes `.json()`, `.send()`, `.status()` |

**Analogie concrète** : Node.js natif, c'est comme construire une maison brique par brique. Express, c'est utiliser des murs préfabriqués : tu assembles des composants prêts à l'emploi pour construire plus vite.

**Ce qu'Express n'est PAS** :

- Express n'est pas un framework full-stack comme Ruby on Rails ou Django. Il ne gère pas la base de données ni les vues par défaut.
- Express n'est pas opiniated (n'impose pas de structure). Tu organises ton code comme tu veux.

---

### HTTP en bref

**HTTP** (HyperText Transfer Protocol) est le protocole de communication du web.

**Analogie concrète** : HTTP fonctionne comme un échange de courrier au bureau de poste. Le client envoie une lettre (requête) avec un type de demande (GET = "donnez-moi", POST = "voici quelque chose de nouveau", DELETE = "supprimez ceci"). Le serveur traite la demande et renvoie une réponse avec un code de statut (200 = "c'est fait", 404 = "je n'ai pas trouvé").

**Méthodes HTTP courantes** :

| Méthode | Usage | Exemple |
| ------- | ----- | ------- |
| GET | Récupérer des données | Afficher une page, lire des infos |
| POST | Créer une ressource | Soumettre un formulaire, créer un utilisateur |
| PUT | Remplacer une ressource | Mettre à jour un profil complet |
| PATCH | Modifier partiellement | Changer juste le nom |
| DELETE | Supprimer une ressource | Supprimer un utilisateur |

**Codes HTTP courants** :

| Code | Signification |
| ---- | ------------- |
| 200 | OK - Succès |
| 201 | Created - Ressource créée |
| 400 | Bad Request - Requête invalide |
| 401 | Unauthorized - Non authentifié |
| 403 | Forbidden - Non autorisé |
| 404 | Not Found - Ressource non trouvée |
| 500 | Internal Server Error - Erreur serveur |

---

### Le cycle requête/réponse

Le diagramme suivant montre le parcours d'une requête HTTP dans Express, du client jusqu'à la réponse.

<div class="diagram-design">
<p><a href="../../../diagrams/epitech-07-nodejs-06-introduction-express-1.html">Le cycle requête/réponse (HTML + SVG)</a></p>
<iframe src="../../../diagrams/epitech-07-nodejs-06-introduction-express-1.html" title="Le cycle requête/réponse" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

```text
Client (navigateur)          Serveur Express
       |                            |
       |   --- Requête HTTP --->    |
       |   GET /users               |
       |                            |
       |                     Route trouvée
       |                     Traitement
       |                            |
       |   <--- Réponse HTTP ---    |
       |   200 OK                   |
       |   [{"nom": "Alice"}]       |
```

---

## Étapes Pratiques

### Étape 1 : Créer le projet

```bash
mkdir projet-express
cd projet-express
npm init -y
```

Modifie `package.json` :

```json
{
  "name": "projet-express",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "start": "node index.js",
    "dev": "node --watch index.js"
  }
}
```

**Note** : `--watch` (Node.js 18+) redémarre automatiquement quand tu modifies le code.

---

### Étape 2 : Installer Express

```bash
# Pin sur Express 4.x (API stable utilisée dans ce cursus)
# Express 5 est sorti en stable ; les exemples de base restent compatibles,
# mais ce cursus cible volontairement la branche 4 pour des versions reproductibles
npm install express@4
```

Vérifie que `express` est dans les dependencies de `package.json` (version `4.x`).

---

### Étape 3 : Créer un serveur minimal

Crée `index.js` :

```javascript
// index.js - Premier serveur Express

// Importer Express
import express from 'express';

// Créer une application Express
const app = express();

// Définir le port
const PORT = 3000;

// Définir une route pour la racine
app.get('/', (req, res) => {
    res.send('Bienvenue sur mon serveur Express!');
});

// Démarrer le serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

Exécute :

```bash
npm start
```

**Résultat attendu dans le terminal** :

```text
Serveur démarré sur http://localhost:3000
```

Ouvre ton navigateur à l'adresse `http://localhost:3000`. Tu devrais voir "Bienvenue sur mon serveur Express!".

Pour arrêter le serveur : `Ctrl + C`

---

### Étape 4 : Comprendre req et res

Chaque route reçoit deux objets :

- **req** (request) : Contient les informations de la requête entrante
- **res** (response) : Permet d'envoyer une réponse au client

Modifie `index.js` :

```javascript
// index.js - Explorer req et res

import express from 'express';

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
    // Afficher des infos sur la requête
    console.log('Méthode:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers['user-agent']);

    // Envoyer une réponse
    res.send('Page d\'accueil');
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

Recharge la page et regarde le terminal.

---

### Étape 5 : Définir plusieurs routes

```javascript
// index.js - Plusieurs routes

import express from 'express';

const app = express();
const PORT = 3000;

// Route racine
app.get('/', (req, res) => {
    res.send('Page d\'accueil');
});

// Route /about
app.get('/about', (req, res) => {
    res.send('À propos de nous');
});

// Route /contact
app.get('/contact', (req, res) => {
    res.send('Contactez-nous à: contact@exemple.com');
});

// Route pour les erreurs 404 (doit être en dernier)
app.use((req, res) => {
    res.status(404).send('Page non trouvée');
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

Teste les URLs :

- `http://localhost:3000/` → Page d'accueil
- `http://localhost:3000/about` → À propos
- `http://localhost:3000/xyz` → Page non trouvée (404)

---

### Étape 6 : Envoyer du JSON

Pour créer des APIs, on renvoie du JSON.

```javascript
// index.js - Réponses JSON

import express from 'express';

const app = express();
const PORT = 3000;

// Données simulées
const utilisateurs = [
    { id: 1, nom: 'Alice', email: 'alice@exemple.com' },
    { id: 2, nom: 'Bob', email: 'bob@exemple.com' },
    { id: 3, nom: 'Charlie', email: 'charlie@exemple.com' }
];

// Route racine
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur l\'API', version: '1.0.0' });
});

// Route pour lister les utilisateurs
app.get('/users', (req, res) => {
    res.json(utilisateurs);
});

// 404
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

**Différence entre `res.send()` et `res.json()`** :

| Méthode | Usage |
| ------- | ----- |
| `res.send()` | Envoie du texte ou du HTML |
| `res.json()` | Envoie du JSON (ajoute le header Content-Type automatiquement) |

---

### Étape 7 : Paramètres de route

Les paramètres permettent de créer des routes dynamiques.

```javascript
// index.js - Paramètres de route

import express from 'express';

const app = express();
const PORT = 3000;

const utilisateurs = [
    { id: 1, nom: 'Alice', email: 'alice@exemple.com' },
    { id: 2, nom: 'Bob', email: 'bob@exemple.com' },
    { id: 3, nom: 'Charlie', email: 'charlie@exemple.com' }
];

// Liste des utilisateurs
app.get('/users', (req, res) => {
    res.json(utilisateurs);
});

// Un utilisateur par ID
// :id est un paramètre de route
app.get('/users/:id', (req, res) => {
    // req.params contient les paramètres
    const id = parseInt(req.params.id);

    // Trouver l'utilisateur
    const utilisateur = utilisateurs.find(u => u.id === id);

    if (utilisateur) {
        res.json(utilisateur);
    } else {
        res.status(404).json({ erreur: 'Utilisateur non trouvé' });
    }
});

// Plusieurs paramètres
app.get('/users/:userId/posts/:postId', (req, res) => {
    res.json({
        userId: req.params.userId,
        postId: req.params.postId
    });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

Teste :

- `http://localhost:3000/users` → Tous les utilisateurs
- `http://localhost:3000/users/1` → Alice
- `http://localhost:3000/users/99` → Erreur 404
- `http://localhost:3000/users/5/posts/10` → { userId: "5", postId: "10" }

---

### Étape 8 : Query parameters (paramètres de requête)

Les query parameters sont dans l'URL après le `?`.

```javascript
// index.js - Query parameters

import express from 'express';

const app = express();
const PORT = 3000;

const produits = [
    { id: 1, nom: 'Laptop', prix: 999, categorie: 'tech' },
    { id: 2, nom: 'Casque', prix: 199, categorie: 'tech' },
    { id: 3, nom: 'T-shirt', prix: 29, categorie: 'vetement' },
    { id: 4, nom: 'Livre', prix: 15, categorie: 'culture' }
];

app.get('/produits', (req, res) => {
    // req.query contient les query parameters
    let resultats = [...produits];

    // Filtrer par catégorie si spécifié
    if (req.query.categorie) {
        resultats = resultats.filter(p => p.categorie === req.query.categorie);
    }

    // Filtrer par prix maximum si spécifié
    if (req.query.prixMax) {
        const prixMax = parseInt(req.query.prixMax);
        resultats = resultats.filter(p => p.prix <= prixMax);
    }

    // Trier par prix si spécifié
    if (req.query.tri === 'prix') {
        resultats.sort((a, b) => a.prix - b.prix);
    }

    res.json({
        total: resultats.length,
        produits: resultats
    });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

Teste :

- `http://localhost:3000/produits` → Tous les produits
- `http://localhost:3000/produits?categorie=tech` → Produits tech
- `http://localhost:3000/produits?prixMax=100` → Produits à moins de 100€
- `http://localhost:3000/produits?categorie=tech&prixMax=500&tri=prix` → Combinaison

---

### Étape 9 : Codes HTTP appropriés

```javascript
// index.js - Codes HTTP

import express from 'express';

const app = express();
const PORT = 3000;

// 200 OK - Succès par défaut
app.get('/ok', (req, res) => {
    res.json({ status: 'ok' });  // 200 implicite
});

// 201 Created - Après création
app.post('/created', (req, res) => {
    res.status(201).json({ message: 'Ressource créée' });
});

// 204 No Content - Succès sans contenu
app.delete('/deleted', (req, res) => {
    res.status(204).send();
});

// 400 Bad Request - Requête invalide
app.get('/bad', (req, res) => {
    res.status(400).json({ erreur: 'Paramètres invalides' });
});

// 401 Unauthorized - Non authentifié
app.get('/unauthorized', (req, res) => {
    res.status(401).json({ erreur: 'Authentification requise' });
});

// 403 Forbidden - Non autorisé
app.get('/forbidden', (req, res) => {
    res.status(403).json({ erreur: 'Accès refusé' });
});

// 404 Not Found - Ressource non trouvée
app.get('/notfound', (req, res) => {
    res.status(404).json({ erreur: 'Ressource non trouvée' });
});

// 500 Internal Server Error - Erreur serveur
app.get('/error', (req, res) => {
    res.status(500).json({ erreur: 'Erreur interne du serveur' });
});

app.listen(PORT, () => {
    console.log(`API sur http://localhost:${PORT}`);
});
```

---

### Étape 10 : Servir des fichiers statiques

Express peut servir des fichiers HTML, CSS, images directement.

Crée un dossier `public` :

```bash
mkdir public
```

Crée `public/index.html` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Mon Site</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <h1>Bienvenue!</h1>
    <p>Ceci est servi par Express.</p>
</body>
</html>
```

Crée `public/style.css` :

```css
body {
    font-family: Arial, sans-serif;
    max-width: 800px;
    margin: 50px auto;
    padding: 20px;
}

h1 {
    color: #333;
}
```

Modifie `index.js` :

```javascript
// index.js - Fichiers statiques

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
const PORT = 3000;

// Servir les fichiers du dossier 'public'
app.use(express.static(path.join(__dirname, 'public')));

// API
app.get('/api/info', (req, res) => {
    res.json({ message: 'API fonctionnelle' });
});

app.listen(PORT, () => {
    console.log(`Serveur sur http://localhost:${PORT}`);
});
```

Maintenant :

- `http://localhost:3000/` → Affiche index.html
- `http://localhost:3000/style.css` → Le CSS
- `http://localhost:3000/api/info` → L'API JSON

---

## Méthodes Express utiles

| Méthode | Description |
| ------- | ----------- |
| `app.get(path, handler)` | Route GET |
| `app.post(path, handler)` | Route POST |
| `app.put(path, handler)` | Route PUT |
| `app.delete(path, handler)` | Route DELETE |
| `app.use(middleware)` | Utiliser un middleware |
| `app.use(path, router)` | Monter un router |
| `res.send(data)` | Envoyer une réponse |
| `res.json(data)` | Envoyer du JSON |
| `res.status(code)` | Définir le code HTTP |
| `res.redirect(url)` | Rediriger |

---

## Pièges Fréquents

### Piège 1 : Oublier de renvoyer une réponse

⚠️ **Problème** : La requête reste en attente indéfiniment.

```javascript
// ❌ Pas de réponse envoyée
app.get('/bug', (req, res) => {
    console.log('Route appelée');
    // Oublié: res.send()
});
```

✅ **Solution** : Toujours envoyer une réponse.

```javascript
// ✅ Réponse envoyée
app.get('/ok', (req, res) => {
    console.log('Route appelée');
    res.send('OK');
});
```

---

### Piège 2 : Envoyer plusieurs réponses

⚠️ **Problème** : `Error: Cannot set headers after they are sent`.

```javascript
// ❌ Deux réponses
app.get('/bug', (req, res) => {
    res.send('Première réponse');
    res.send('Deuxième réponse');  // Erreur!
});
```

✅ **Solution** : Utiliser `return` après `res.send()`.

```javascript
// ✅ Une seule réponse
app.get('/ok', (req, res) => {
    if (condition) {
        return res.status(400).json({ erreur: 'Erreur' });
    }
    res.json({ succes: true });
});
```

---

### Piège 3 : Ordre des routes

⚠️ **Problème** : Une route générique capture toutes les requêtes.

```javascript
// ❌ '/users/:id' capture '/users/new'
app.get('/users/:id', ...);   // Capture 'new' comme ID!
app.get('/users/new', ...);   // Jamais atteinte
```

✅ **Solution** : Routes spécifiques avant routes génériques.

```javascript
// ✅ Bon ordre
app.get('/users/new', ...);   // Spécifique d'abord
app.get('/users/:id', ...);   // Générique après
```

---

### Piège 4 : params.id est une chaîne

⚠️ **Problème** : `req.params.id` est toujours une string.

```javascript
// ❌ Comparaison incorrecte
const user = users.find(u => u.id === req.params.id);  // Ne trouve rien!
```

✅ **Solution** : Convertir en nombre.

```javascript
// ✅ Conversion explicite
const id = parseInt(req.params.id);
const user = users.find(u => u.id === id);
```

---

## Checklist de Validation

- [ ] J'ai installé Express avec npm
- [ ] Je sais créer un serveur avec `express()`
- [ ] Je sais définir des routes GET
- [ ] Je sais envoyer du JSON avec `res.json()`
- [ ] Je sais utiliser les paramètres de route (`:id`)
- [ ] Je sais utiliser les query parameters (`?key=value`)
- [ ] Je sais renvoyer le bon code HTTP
- [ ] Je sais servir des fichiers statiques

---

## Exercice Pratique

**Énoncé** : Crée une API de gestion de livres avec les routes suivantes :

- `GET /` → Message de bienvenue avec la version de l'API
- `GET /livres` → Liste de tous les livres (avec filtrage par `genre` optionnel)
- `GET /livres/:id` → Un livre par son ID (404 si non trouvé)
- `GET /stats` → Statistiques (nombre total, prix moyen)

Données de départ :

```javascript
const livres = [
    { id: 1, titre: 'Le Petit Prince', auteur: 'Saint-Exupéry', genre: 'conte', prix: 8 },
    { id: 2, titre: '1984', auteur: 'Orwell', genre: 'dystopie', prix: 12 },
    { id: 3, titre: 'Fondation', auteur: 'Asimov', genre: 'sf', prix: 15 },
    { id: 4, titre: 'Dune', auteur: 'Herbert', genre: 'sf', prix: 14 }
];
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// index.js - API Livres

import express from 'express';

const app = express();
const PORT = 3000;

const livres = [
    { id: 1, titre: 'Le Petit Prince', auteur: 'Saint-Exupéry', genre: 'conte', prix: 8 },
    { id: 2, titre: '1984', auteur: 'Orwell', genre: 'dystopie', prix: 12 },
    { id: 3, titre: 'Fondation', auteur: 'Asimov', genre: 'sf', prix: 15 },
    { id: 4, titre: 'Dune', auteur: 'Herbert', genre: 'sf', prix: 14 }
];

// Accueil
app.get('/', (req, res) => {
    res.json({
        message: 'Bienvenue sur l\'API Livres',
        version: '1.0.0',
        endpoints: ['/livres', '/livres/:id', '/stats']
    });
});

// Liste des livres (avec filtre optionnel)
app.get('/livres', (req, res) => {
    let resultats = [...livres];

    // Filtrer par genre si spécifié
    if (req.query.genre) {
        resultats = resultats.filter(l => l.genre === req.query.genre);
    }

    res.json({
        total: resultats.length,
        livres: resultats
    });
});

// Un livre par ID
app.get('/livres/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const livre = livres.find(l => l.id === id);

    if (livre) {
        res.json(livre);
    } else {
        res.status(404).json({ erreur: 'Livre non trouvé' });
    }
});

// Statistiques
app.get('/stats', (req, res) => {
    const total = livres.length;
    const prixTotal = livres.reduce((sum, l) => sum + l.prix, 0);
    const prixMoyen = (prixTotal / total).toFixed(2);

    // Compter par genre
    const genres = {};
    livres.forEach(l => {
        genres[l.genre] = (genres[l.genre] || 0) + 1;
    });

    res.json({
        totalLivres: total,
        prixMoyen: parseFloat(prixMoyen),
        parGenre: genres
    });
});

// 404 pour routes non trouvées
app.use((req, res) => {
    res.status(404).json({ erreur: 'Route non trouvée' });
});

app.listen(PORT, () => {
    console.log(`API Livres sur http://localhost:${PORT}`);
});
```

**Tests** :

```text
http://localhost:3000/
http://localhost:3000/livres
http://localhost:3000/livres?genre=sf
http://localhost:3000/livres/1
http://localhost:3000/livres/99
http://localhost:3000/stats
```

---

## Navigation

← Fiche précédente : **[Système de fichiers (fs)](05-systeme-fichiers.md)**

→ Fiche suivante : **[Middleware et routes](07-middleware-routes.md)**
