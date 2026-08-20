---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Maîtriser fetch() pour effectuer des requêtes HTTP, gérer les headers, les méthodes HTTP, le JSON et les erreurs réseau."
estimated_time: "75 min"
fiche_number: 11
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 11 - Fetch API et HTTP

> **En bref** : Maîtriser l'API `fetch()` pour effectuer des requêtes HTTP (GET, POST, PUT, DELETE), configurer les headers, envoyer et recevoir du JSON, et gérer les erreurs réseau. Lecture estimée : 75 min.

## Prérequis

- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)
- Fiche 09 : [Promises](09-promises.md)
- Fiche 10 : [Async/await](10-async-await.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser `fetch()` pour envoyer des requêtes HTTP, configurer les headers et le corps de la requête, traiter les réponses JSON, gérer les erreurs HTTP et réseau, et créer un client HTTP réutilisable.

---

## Concepts

### Qu'est-ce que le protocole HTTP ?

**Définition** : HTTP (HyperText Transfer Protocol) est le protocole de communication entre un client (navigateur, script Node.js) et un serveur. Chaque échange se compose d'une requête (envoyée par le client) et d'une réponse (renvoyée par le serveur).

**Le problème que HTTP résout** :

Sans protocole standardisé, voici les problèmes rencontrés :

1. **Pas de langage commun** : Le client et le serveur ne parlent pas la même langue. Chaque serveur pourrait attendre un format différent, rendant la communication impossible.
2. **Pas de structure prévisible** : Sans règles, on ne saurait pas comment formuler une demande (quelle action, quelles données) ni comment interpréter une réponse (succès, erreur, données retournées).
3. **Pas de codes d'état** : Sans convention sur les codes de réponse, le client ne saurait pas si sa demande a réussi, échoué, ou si la ressource n'existe pas.

**Comment HTTP résout ces problèmes** :

| Problème | Solution apportée par HTTP |
| -------- | ------------------------- |
| Pas de langage commun | Un format standardisé que tous les clients et serveurs comprennent |
| Pas de structure prévisible | Des méthodes (GET, POST, PUT, DELETE) et des headers normalisés |
| Pas de codes d'état | Des codes numériques (200, 404, 500) avec une signification universelle |

**Analogie concrète** : HTTP est comme le protocole postal. Pour envoyer un courrier, tu respectes des règles précises : tu écris l'adresse du destinataire (URL), tu choisis le type d'envoi (lettre simple = GET, colis = POST), tu ajoutes des informations sur l'enveloppe (headers), et tu glisses le contenu dans l'enveloppe (body).
Le destinataire te renvoie un accusé de réception avec un code : "Bien reçu" (200), "Adresse inconnue" (404), ou "Bureau de poste en panne" (500).

**Les éléments d'une requête HTTP** :

| Élément | Rôle | Exemple |
| ------- | ---- | ------- |
| **Méthode** | Type d'action à effectuer | `GET`, `POST`, `PUT`, `DELETE` |
| **URL** | Adresse de la ressource | `http://localhost:3000/api/users` |
| **Headers** | Métadonnées de la requête | `Content-Type: application/json` |
| **Body** | Données envoyées (optionnel) | `{ "nom": "Alice" }` |

**Les méthodes HTTP principales** :

| Méthode | Action | Body | Exemple d'utilisation |
| ------- | ------ | ---- | --------------------- |
| `GET` | Lire des données | Non | Récupérer la liste des utilisateurs |
| `POST` | Créer une ressource | Oui | Ajouter un nouvel utilisateur |
| `PUT` | Remplacer une ressource | Oui | Mettre à jour un utilisateur entier |
| `PATCH` | Modifier partiellement | Oui | Changer uniquement l'email |
| `DELETE` | Supprimer une ressource | Non | Supprimer un utilisateur |

**Les codes de statut HTTP** :

| Code | Signification | Quand |
| ---- | ------------- | ----- |
| `200` | OK | La requête a réussi |
| `201` | Created | Une ressource a été créée (après un POST) |
| `204` | No Content | Succès, mais pas de contenu à retourner (après un DELETE) |
| `400` | Bad Request | La requête est mal formée |
| `401` | Unauthorized | Authentification requise |
| `403` | Forbidden | Accès interdit même avec authentification |
| `404` | Not Found | La ressource n'existe pas |
| `500` | Internal Server Error | Erreur côté serveur |

---

### Qu'est-ce que `fetch()` ?

**Définition** : `fetch()` est une fonction native du navigateur et de Node.js qui permet d'effectuer des requêtes HTTP. Elle retourne une Promise qui se résout en un objet `Response`.

> **Note Node.js** : `fetch()` a été introduit en Node.js 18 comme fonctionnalité expérimentale, **disponible par défaut dès 18.0** (désactivable avec `--no-experimental-fetch`). Il est resté expérimental sur les lignes 18 et 20, et a été marqué officiellement stable depuis Node.js 21. Dans le cadre de ce cursus (Node.js 22 LTS), `fetch()` est disponible sans configuration supplémentaire.

**Le problème que `fetch()` résout** :

Sans `fetch()`, voici les problèmes rencontrés :

1. **`XMLHttpRequest` complexe** : l'ancienne API pour les requêtes HTTP nécessite beaucoup de code et utilise des callbacks.
2. **Bibliothèques externes obligatoires** : sans `fetch()`, il fallait installer des bibliothèques comme `axios` ou `request` même pour des requêtes simples.
3. **Pas de standard unifié** : chaque bibliothèque avait sa propre API, rendant le code non portable.

**Comment `fetch()` résout ces problèmes** :

| Problème | Solution apportée par `fetch()` |
| -------- | ------------------------------- |
| `XMLHttpRequest` complexe | API simple basée sur les Promises |
| Bibliothèques externes | Fonction native, aucune installation |
| Pas de standard | API standardisée W3C, identique partout |

**Analogie concrète** : `fetch()` est comme envoyer une lettre avec accusé de réception. Tu écris ta demande (la requête), tu précises l'adresse (l'URL), tu ajoutes des informations sur l'enveloppe (les headers). Le facteur te rapporte la réponse (l'objet `Response`). Tu dois ensuite ouvrir l'enveloppe pour lire le contenu (`.json()` ou `.text()`).

**Ce que `fetch()` n'est PAS** :

- `fetch()` ne rejette pas la Promise en cas d'erreur HTTP (404, 500). Elle ne rejette que si la requête ne peut pas être envoyée (problème réseau). Il faut vérifier `response.ok` manuellement.
- `fetch()` n'envoie pas de cookies par défaut en cross-origin. Il faut configurer `credentials: "include"` explicitement.

Le schéma suivant illustre le cycle complet d'une requête HTTP avec `fetch()` :

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-11-fetch-api-http-1.html">Qu&#x27;est-ce que `fetch()` ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-11-fetch-api-http-1.html" title="Qu&#x27;est-ce que `fetch()` ?" style="width:100%;min-height:480px;border:0;background:transparent"></iframe>
</div>

---

### L'objet `Response`

**Définition** : L'objet `Response` est retourné par `fetch()`. Il contient les informations de la réponse HTTP : le statut, les headers et le corps de la réponse.

**Le problème que l'objet Response résout** :

Sans objet Response structuré, voici les problèmes rencontrés :

1. **Informations dispersées** : Le statut, les headers et le corps de la réponse seraient dans des variables séparées, sans lien entre eux.
2. **Pas de vérification simple** : Il faudrait comparer manuellement le code de statut pour savoir si la requête a réussi. Pas de propriété `ok` prête à l'emploi.
3. **Lecture du corps non standardisée** : Sans méthodes comme `.json()` ou `.text()`, il faudrait parser le corps manuellement selon le format.

**Comment l'objet Response résout ces problèmes** :

| Problème | Solution apportée par Response |
| -------- | ------------------------------ |
| Informations dispersées | Un seul objet regroupe statut, headers et corps |
| Pas de vérification simple | `response.ok` retourne `true` si le statut est 200-299 |
| Lecture du corps non standardisée | `.json()`, `.text()` et `.blob()` parsent automatiquement |

**Analogie concrète** : L'objet Response est comme un colis reçu par la poste. L'étiquette extérieure indique le statut de livraison (`response.status` : livré avec succès, retourné, endommagé). Les informations imprimées sur l'étiquette sont les headers (`response.headers` : expéditeur, date, type de contenu). Le contenu du colis est le body, que tu ouvres avec la bonne méthode : `.json()` si c'est un document structuré, `.text()` si c'est une lettre, `.blob()` si c'est un objet physique.

**Propriétés et méthodes principales** :

| Propriété / Méthode | Type | Description |
| -------------------- | ---- | ----------- |
| `response.ok` | `boolean` | `true` si le statut est entre 200 et 299 |
| `response.status` | `number` | Code de statut HTTP (200, 404, 500...) |
| `response.statusText` | `string` | Message du statut ("OK", "Not Found"...) |
| `response.headers` | `Headers` | Les headers de la réponse |
| `response.json()` | `Promise` | Parse le corps comme JSON |
| `response.text()` | `Promise` | Retourne le corps comme texte brut |
| `response.blob()` | `Promise` | Retourne le corps comme Blob (fichier binaire) |

**Règle importante** : Les méthodes `.json()`, `.text()` et `.blob()` ne peuvent être appelées qu'une seule fois. Le corps de la réponse est un flux (stream) qui ne peut être lu qu'une fois.

---

### L'objet `Headers`

**Définition** : L'objet `Headers` permet de créer et manipuler les en-têtes HTTP. Les headers transmettent des métadonnées entre le client et le serveur.

**Le problème que les headers résolvent** :

Sans headers, voici les problèmes rencontrés :

1. **Format inconnu** : Le serveur reçoit des données mais ne sait pas si c'est du JSON, du texte brut ou un formulaire. Il ne peut pas les interpréter correctement.
2. **Pas d'authentification** : Sans moyen de transmettre un jeton d'identification, le serveur ne peut pas vérifier qui envoie la requête.
3. **Pas de contrôle du cache** : Le navigateur ne sait pas s'il peut réutiliser une réponse précédente ou s'il doit redemander les données au serveur.

**Comment les headers résolvent ces problèmes** :

| Problème | Solution apportée par les headers |
| -------- | --------------------------------- |
| Format inconnu | `Content-Type` indique le format des données (`application/json`, `text/html`) |
| Pas d'authentification | `Authorization` transmet le jeton d'identification |
| Pas de contrôle du cache | `Cache-Control` définit la politique de mise en cache |

**Analogie concrète** : Les headers HTTP sont comme les étiquettes sur un colis. Le contenu du colis est le body (les données). Les étiquettes donnent des informations essentielles sans ouvrir le colis : "Fragile" (`Content-Type` : indique comment traiter le contenu), "Destinataire autorisé" (`Authorization` : prouve que tu as le droit de recevoir le colis), "À consommer avant le..." (`Cache-Control` : indique combien de temps le contenu reste valide).

**Headers courants** :

| Header | Rôle | Valeur courante |
| ------ | ---- | --------------- |
| `Content-Type` | Format des données envoyées | `application/json` |
| `Accept` | Format de réponse souhaité | `application/json` |
| `Authorization` | Jeton d'authentification | `Bearer eyJhbG...` |
| `Cache-Control` | Politique de cache | `no-cache` |

---

## Étapes Pratiques

### Étape 1 : Serveur JSON local avec Node.js

Pour tester `fetch()` en environnement offline, tu vas créer un petit serveur HTTP local qui sert des données JSON.

Crée le fichier `serveur-json.mjs` :

```javascript
// Serveur HTTP minimal qui sert des données JSON
import { createServer } from "node:http";

// Base de données en mémoire
const utilisateurs = [
  { id: 1, nom: "Alice", email: "alice@example.com", age: 28 },
  { id: 2, nom: "Bob", email: "bob@example.com", age: 34 },
  { id: 3, nom: "Charlie", email: "charlie@example.com", age: 22 },
];

let prochainId = 4;

// Fonction utilitaire pour lire le corps d'une requête
const lireCorps = (req) => {
  return new Promise((resolve) => {
    let corps = "";
    req.on("data", (chunk) => (corps += chunk));
    req.on("end", () => resolve(corps ? JSON.parse(corps) : null));
  });
};

// Fonction utilitaire pour envoyer une réponse JSON
const envoyerJSON = (res, code, donnees) => {
  // 204 No Content : pas de corps ni de Content-Type
  if (code === 204) {
    res.writeHead(204);
    res.end();
    return;
  }

  res.writeHead(code, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  });
  res.end(JSON.stringify(donnees, null, 2));
};

// Créer le serveur
const serveur = createServer(async (req, res) => {
  const { method, url } = req;
  console.log(`${method} ${url}`);

  // Gérer les requêtes CORS preflight
  if (method === "OPTIONS") {
    envoyerJSON(res, 204, null);
    return;
  }

  // GET /api/users -- Liste tous les utilisateurs
  if (method === "GET" && url === "/api/users") {
    envoyerJSON(res, 200, utilisateurs);
    return;
  }

  // GET /api/users/:id -- Un seul utilisateur
  const matchGet = url.match(/^\/api\/users\/(\d+)$/);
  if (method === "GET" && matchGet) {
    const id = parseInt(matchGet[1], 10);
    const user = utilisateurs.find((u) => u.id === id);
    if (user) {
      envoyerJSON(res, 200, user);
    } else {
      envoyerJSON(res, 404, { erreur: `Utilisateur ${id} introuvable` });
    }
    return;
  }

  // POST /api/users -- Créer un utilisateur
  if (method === "POST" && url === "/api/users") {
    const donnees = await lireCorps(req);
    if (!donnees || !donnees.nom || !donnees.email) {
      envoyerJSON(res, 400, { erreur: "Les champs nom et email sont requis" });
      return;
    }
    const nouveau = { id: prochainId++, ...donnees };
    utilisateurs.push(nouveau);
    envoyerJSON(res, 201, nouveau);
    return;
  }

  // PUT /api/users/:id -- Remplacer un utilisateur
  const matchPut = url.match(/^\/api\/users\/(\d+)$/);
  if (method === "PUT" && matchPut) {
    const id = parseInt(matchPut[1], 10);
    const index = utilisateurs.findIndex((u) => u.id === id);
    if (index === -1) {
      envoyerJSON(res, 404, { erreur: `Utilisateur ${id} introuvable` });
      return;
    }
    const donnees = await lireCorps(req);
    utilisateurs[index] = { id, ...donnees };
    envoyerJSON(res, 200, utilisateurs[index]);
    return;
  }

  // DELETE /api/users/:id -- Supprimer un utilisateur
  const matchDelete = url.match(/^\/api\/users\/(\d+)$/);
  if (method === "DELETE" && matchDelete) {
    const id = parseInt(matchDelete[1], 10);
    const index = utilisateurs.findIndex((u) => u.id === id);
    if (index === -1) {
      envoyerJSON(res, 404, { erreur: `Utilisateur ${id} introuvable` });
      return;
    }
    utilisateurs.splice(index, 1);
    envoyerJSON(res, 204, null);
    return;
  }

  // Route non trouvée
  envoyerJSON(res, 404, { erreur: `Route ${method} ${url} non trouvée` });
});

// Démarrer le serveur sur le port 3000
serveur.listen(3000, () => {
  console.log("Serveur démarré sur http://localhost:3000");
  console.log("Routes disponibles :");
  console.log("  GET    /api/users      -- Liste des utilisateurs");
  console.log("  GET    /api/users/:id  -- Un utilisateur");
  console.log("  POST   /api/users      -- Créer un utilisateur");
  console.log("  PUT    /api/users/:id  -- Modifier un utilisateur");
  console.log("  DELETE /api/users/:id  -- Supprimer un utilisateur");
});
```

Démarre le serveur :

```bash
node ~/js-moderne/serveur-json.mjs
```

**Résultat attendu** :

```text
Serveur démarré sur http://localhost:3000
Routes disponibles :
  GET    /api/users      -- Liste des utilisateurs
  GET    /api/users/:id  -- Un utilisateur
  POST   /api/users      -- Créer un utilisateur
  PUT    /api/users/:id  -- Modifier un utilisateur
  DELETE /api/users/:id  -- Supprimer un utilisateur
```

Laisse ce terminal ouvert et ouvre un second terminal pour les étapes suivantes.

---

### Étape 2 : Requête GET simple avec fetch

Crée le fichier `11-fetch-api.mjs` :

```javascript
// Requête GET simple -- récupérer la liste des utilisateurs
async function listerUtilisateurs() {
  // fetch() retourne une Promise qui se résout en un objet Response
  const response = await fetch("http://localhost:3000/api/users");

  // Vérifier que la requête a réussi (statut 200-299)
  console.log("Statut :", response.status); // 200
  console.log("OK :", response.ok); // true
  console.log("Status Text :", response.statusText); // "OK"

  // Lire le corps de la réponse comme JSON
  // .json() retourne une Promise -- il faut await
  const utilisateurs = await response.json();

  console.log("\nUtilisateurs :");
  utilisateurs.forEach((u) => {
    console.log(`  #${u.id} ${u.nom} (${u.email})`);
  });
}

listerUtilisateurs();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Statut : 200
OK : true
Status Text : OK

Utilisateurs :
  #1 Alice (alice@example.com)
  #2 Bob (bob@example.com)
  #3 Charlie (charlie@example.com)
```

---

### Étape 3 : Requête GET avec un paramètre

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Récupérer un utilisateur par son ID
async function recupererUtilisateur(id) {
  const response = await fetch(`http://localhost:3000/api/users/${id}`);

  if (!response.ok) {
    // Le serveur a répondu avec un code d'erreur (404, 500...)
    const erreur = await response.json();
    throw new Error(`HTTP ${response.status} : ${erreur.erreur}`);
  }

  const utilisateur = await response.json();
  return utilisateur;
}

// Test : utilisateur existant
async function main() {
  try {
    const alice = await recupererUtilisateur(1);
    console.log("Trouvé :", alice);
  } catch (erreur) {
    console.error(erreur.message);
  }

  // Test : utilisateur inexistant
  try {
    const inconnu = await recupererUtilisateur(999);
    console.log("Trouvé :", inconnu);
  } catch (erreur) {
    console.error(erreur.message);
  }
}

main();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Trouvé : { id: 1, nom: 'Alice', email: 'alice@example.com', age: 28 }
HTTP 404 : Utilisateur 999 introuvable
```

---

### Étape 4 : Requête POST -- créer une ressource

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Créer un nouvel utilisateur avec POST
async function creerUtilisateur(nom, email, age) {
  const response = await fetch("http://localhost:3000/api/users", {
    method: "POST", // Méthode HTTP
    headers: {
      "Content-Type": "application/json", // On envoie du JSON
    },
    body: JSON.stringify({ nom, email, age }), // Corps en JSON stringifié
  });

  if (!response.ok) {
    const erreur = await response.json();
    throw new Error(`HTTP ${response.status} : ${erreur.erreur}`);
  }

  const nouveau = await response.json();
  return nouveau;
}

async function main() {
  // Créer un utilisateur
  try {
    const diana = await creerUtilisateur("Diana", "diana@example.com", 31);
    console.log("Créé :", diana);
    // Le serveur attribue un ID automatiquement
  } catch (erreur) {
    console.error(erreur.message);
  }

  // Tenter de créer sans email (erreur 400)
  try {
    const incomplet = await creerUtilisateur("Eve", null, 25);
    console.log("Créé :", incomplet);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }
}

main();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Créé : { id: 4, nom: 'Diana', email: 'diana@example.com', age: 31 }
Erreur : HTTP 400 : Les champs nom et email sont requis
```

---

### Étape 5 : Requêtes PUT et DELETE

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Modifier un utilisateur avec PUT
async function modifierUtilisateur(id, donnees) {
  const response = await fetch(`http://localhost:3000/api/users/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(donnees),
  });

  if (!response.ok) {
    const erreur = await response.json();
    throw new Error(`HTTP ${response.status} : ${erreur.erreur}`);
  }

  return await response.json();
}

// Supprimer un utilisateur avec DELETE
async function supprimerUtilisateur(id) {
  const response = await fetch(`http://localhost:3000/api/users/${id}`, {
    method: "DELETE",
    // Pas de body ni de Content-Type pour DELETE
  });

  if (!response.ok) {
    const erreur = await response.json();
    throw new Error(`HTTP ${response.status} : ${erreur.erreur}`);
  }

  // 204 No Content : pas de corps à lire
  console.log(`Utilisateur #${id} supprimé (statut ${response.status})`);
}

async function main() {
  // Modifier Bob
  try {
    const bobModifie = await modifierUtilisateur(2, {
      nom: "Bob Martin",
      email: "bob.martin@example.com",
      age: 35,
    });
    console.log("Modifié :", bobModifie);
  } catch (erreur) {
    console.error(erreur.message);
  }

  // Supprimer Charlie
  try {
    await supprimerUtilisateur(3);
  } catch (erreur) {
    console.error(erreur.message);
  }

  // Tenter de supprimer un utilisateur inexistant
  try {
    await supprimerUtilisateur(999);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }
}

main();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Modifié : { id: 2, nom: 'Bob Martin', email: 'bob.martin@example.com', age: 35 }
Utilisateur #3 supprimé (statut 204)
Erreur : HTTP 404 : Utilisateur 999 introuvable
```

---

### Étape 6 : Lire les headers de la réponse

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Explorer les headers de la réponse
async function afficherHeaders() {
  const response = await fetch("http://localhost:3000/api/users");

  // Accéder à un header spécifique
  console.log("Content-Type :", response.headers.get("Content-Type"));

  // Lister tous les headers
  console.log("\nTous les headers :");
  response.headers.forEach((valeur, nom) => {
    console.log(`  ${nom}: ${valeur}`);
  });

  // Vérifier si un header existe
  console.log(
    "\nA un Content-Type :",
    response.headers.has("Content-Type")
  );
  console.log(
    "A un Authorization :",
    response.headers.has("Authorization")
  );
}

afficherHeaders();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Content-Type : application/json

Tous les headers :
  access-control-allow-headers: Content-Type, Authorization
  access-control-allow-methods: GET, POST, PUT, DELETE, OPTIONS
  access-control-allow-origin: *
  content-type: application/json

A un Content-Type : true
A un Authorization : false
```

---

### Étape 7 : Gestion des erreurs réseau

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Différencier erreur réseau et erreur HTTP
async function requeteSecurisee(url, options = {}) {
  try {
    const response = await fetch(url, options);

    // Erreur HTTP : le serveur a répondu, mais avec un code d'erreur
    if (!response.ok) {
      let message = `HTTP ${response.status}`;
      try {
        const corps = await response.json();
        message += ` : ${corps.erreur || response.statusText}`;
      } catch {
        message += ` : ${response.statusText}`;
      }
      throw new Error(message);
    }

    // Réponse sans contenu (204 No Content)
    if (response.status === 204) {
      return null;
    }

    return await response.json();
  } catch (erreur) {
    // Erreur réseau : le serveur n'a pas répondu du tout
    if (erreur.cause?.code === "ECONNREFUSED") {
      throw new Error(`Connexion refusée : le serveur ${url} ne répond pas`);
    }
    // Relancer l'erreur si ce n'est pas une erreur réseau connue
    throw erreur;
  }
}

async function main() {
  // Test 1 : Requête réussie
  try {
    const users = await requeteSecurisee("http://localhost:3000/api/users");
    console.log("Succès :", users.length, "utilisateurs");
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }

  // Test 2 : Erreur HTTP 404
  try {
    const user = await requeteSecurisee("http://localhost:3000/api/users/999");
    console.log("Succès :", user);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }

  // Test 3 : Erreur réseau (serveur éteint sur un autre port)
  try {
    const data = await requeteSecurisee("http://localhost:9999/api/test");
    console.log("Succès :", data);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }
}

main();
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Succès : 3 utilisateurs
Erreur : HTTP 404 : Utilisateur 999 introuvable
Erreur : Connexion refusée : le serveur http://localhost:9999/api/test ne répond pas
```

---

### Étape 8 : Client HTTP réutilisable

Les étapes 4 et 5 ont modifié la base en mémoire du serveur (création d'un utilisateur, suppression d'un autre). Redémarre le serveur (`Ctrl+C` puis `node ~/js-moderne/serveur-json.mjs`) avant cette étape pour que les identifiants ci-dessous correspondent à un serveur fraîchement lancé.

Remplace le contenu de `11-fetch-api.mjs` par le code suivant :

```javascript
// Créer un client HTTP réutilisable avec fetch
class ClientHTTP {
  // Le constructeur reçoit l'URL de base du serveur
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  // Méthode privée pour exécuter une requête
  async #requete(chemin, options = {}) {
    const url = `${this.baseURL}${chemin}`;

    // Headers par défaut
    const headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers, // Permet de surcharger les headers
    };

    try {
      const response = await fetch(url, { ...options, headers });

      if (!response.ok) {
        let message = `HTTP ${response.status}`;
        try {
          const corps = await response.json();
          message += ` : ${corps.erreur || response.statusText}`;
        } catch {
          message += ` : ${response.statusText}`;
        }
        throw new Error(message);
      }

      if (response.status === 204) return null;
      return await response.json();
    } catch (erreur) {
      if (erreur.cause?.code === "ECONNREFUSED") {
        throw new Error(`Serveur inaccessible : ${url}`);
      }
      throw erreur;
    }
  }

  // GET -- lire des données
  async get(chemin) {
    return this.#requete(chemin, { method: "GET" });
  }

  // POST -- créer une ressource
  async post(chemin, donnees) {
    return this.#requete(chemin, {
      method: "POST",
      body: JSON.stringify(donnees),
    });
  }

  // PUT -- remplacer une ressource
  async put(chemin, donnees) {
    return this.#requete(chemin, {
      method: "PUT",
      body: JSON.stringify(donnees),
    });
  }

  // DELETE -- supprimer une ressource
  async delete(chemin) {
    return this.#requete(chemin, { method: "DELETE" });
  }
}

// Utilisation du client
async function main() {
  const api = new ClientHTTP("http://localhost:3000");

  // Lister les utilisateurs
  const users = await api.get("/api/users");
  console.log("Utilisateurs :", users.length);

  // Créer un utilisateur
  const nouveau = await api.post("/api/users", {
    nom: "Eve",
    email: "eve@example.com",
    age: 27,
  });
  console.log("Créé :", nouveau);

  // Modifier un utilisateur
  const modifie = await api.put("/api/users/1", {
    nom: "Alice Dupont",
    email: "alice.dupont@example.com",
    age: 29,
  });
  console.log("Modifié :", modifie);

  // Supprimer un utilisateur
  await api.delete("/api/users/2");
  console.log("Utilisateur #2 supprimé");

  // Vérifier le résultat final
  const final = await api.get("/api/users");
  console.log("\nListe finale :");
  final.forEach((u) => console.log(`  #${u.id} ${u.nom}`));
}

main().catch(console.error);
```

```bash
node ~/js-moderne/11-fetch-api.mjs
```

**Résultat attendu** :

```text
Utilisateurs : 3
Créé : { id: 4, nom: 'Eve', email: 'eve@example.com', age: 27 }
Modifié : { id: 1, nom: 'Alice Dupont', email: 'alice.dupont@example.com', age: 29 }
Utilisateur #2 supprimé

Liste finale :
  #1 Alice Dupont
  #3 Charlie
  #4 Eve
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `fetch(url)` | Requête GET simple |
| `fetch(url, { method: "POST" })` | Requête avec méthode HTTP |
| `fetch(url, { headers: { ... } })` | Requête avec headers personnalisés |
| `fetch(url, { body: JSON.stringify(data) })` | Envoyer des données JSON |
| `response.ok` | Vérifie si le statut est 200-299 |
| `response.status` | Code de statut HTTP |
| `response.json()` | Parse la réponse en JSON |
| `response.text()` | Lit la réponse comme texte |
| `response.headers.get("nom")` | Lit un header de la réponse |
| `JSON.stringify(objet)` | Convertit un objet en chaîne JSON |
| `JSON.parse(chaine)` | Convertit une chaîne JSON en objet |

---

## Pièges Fréquents

### Piège 1 : `fetch()` ne rejette pas sur les erreurs HTTP

⚠️ **Problème** : Tu penses que `fetch()` rejette la Promise quand le serveur répond 404 ou 500. En réalité, `fetch()` ne rejette que sur les erreurs réseau (serveur injoignable). Une réponse 404 est quand même une réponse valide.

✅ **Solution** : Vérifie toujours `response.ok` ou `response.status` avant de lire le corps.

```javascript
// ❌ Pas de vérification du statut
const response = await fetch("/api/users/999");
const data = await response.json(); // Peut contenir un message d'erreur, pas les données attendues

// ✅ Vérification du statut
const response2 = await fetch("/api/users/999");
if (!response2.ok) {
  throw new Error(`Erreur HTTP ${response2.status}`);
}
const data2 = await response2.json();
```

---

### Piège 2 : Oublier `JSON.stringify()` pour le body

⚠️ **Problème** : Tu passes un objet JavaScript directement dans `body` au lieu d'une chaîne JSON.

✅ **Solution** : Utilise toujours `JSON.stringify()` pour convertir l'objet en chaîne JSON, et ajoute le header `Content-Type: application/json`.

```javascript
// ❌ Objet JavaScript brut dans body
const response = await fetch("/api/users", {
  method: "POST",
  body: { nom: "Alice" }, // Sera converti en "[object Object]"
});

// ✅ JSON.stringify + Content-Type
const response2 = await fetch("/api/users", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ nom: "Alice" }),
});
```

---

### Piège 3 : Lire le corps de la réponse deux fois

⚠️ **Problème** : Tu appelles `.json()` ou `.text()` deux fois sur la même réponse. La deuxième fois, une erreur se produit.

✅ **Solution** : Stocke le résultat dans une variable et réutilise-la.

```javascript
// ❌ Lire le corps deux fois
const response = await fetch("/api/users");
const texte = await response.text(); // Première lecture -- OK
const json = await response.json(); // ERREUR : corps déjà consommé

// ✅ Lire une seule fois et réutiliser
const response2 = await fetch("/api/users");
const data = await response2.json();
console.log(data); // Utiliser data autant de fois que nécessaire
```

---

### Piège 4 : Oublier `await` devant `.json()`

⚠️ **Problème** : Tu oublies que `.json()` retourne une Promise, et tu obtiens un objet Promise au lieu des données.

✅ **Solution** : Ajoute toujours `await` devant `.json()`, `.text()` ou `.blob()`.

```javascript
// ❌ Oubli de await
const response = await fetch("/api/users");
const data = response.json(); // data est une Promise, pas un tableau
console.log(data); // Promise { <pending> }

// ✅ Avec await
const response2 = await fetch("/api/users");
const data2 = await response2.json(); // data2 est le tableau d'utilisateurs
console.log(data2);
```

---

## Checklist de Validation

- [ ] Je sais effectuer une requête GET avec `fetch()`
- [ ] Je sais envoyer une requête POST avec un corps JSON
- [ ] Je sais utiliser PUT et DELETE pour modifier et supprimer des ressources
- [ ] Je vérifie toujours `response.ok` avant de lire le corps
- [ ] Je sais différencier une erreur réseau d'une erreur HTTP
- [ ] Je n'oublie pas `JSON.stringify()` pour le body et `await` devant `.json()`
- [ ] Je sais lire les headers de la réponse
- [ ] Je sais créer un client HTTP réutilisable avec une classe

---

## Exercice Pratique

**Énoncé** : Crée un programme en ligne de commande qui gère des utilisateurs via le serveur JSON local.

1. Démarre le serveur `serveur-json.mjs` (étape 1).
2. Crée un fichier `exercice-fetch.mjs` qui effectue les opérations suivantes dans l'ordre :
   - Affiche la liste des utilisateurs (GET).
   - Crée un nouvel utilisateur "Franck" (POST).
   - Modifie l'email de l'utilisateur #1 (PUT).
   - Supprime l'utilisateur #2 (DELETE).
   - Affiche la liste finale des utilisateurs (GET).
3. Gère toutes les erreurs avec `try`/`catch`.
4. Affiche un résumé des opérations effectuées.

**Indications** :

- Utilise `async`/`await` pour toutes les requêtes.
- Utilise `JSON.stringify()` pour les corps POST et PUT.
- Vérifie toujours `response.ok` après chaque `fetch()`.
- N'oublie pas le header `Content-Type: application/json` pour POST et PUT.

**Résultat attendu** :

```text
=== Gestion des utilisateurs ===

1. Liste initiale :
  #1 Alice (alice@example.com)
  #2 Bob (bob@example.com)
  #3 Charlie (charlie@example.com)

2. Création de Franck...
  Créé : #4 Franck (franck@example.com)

3. Modification de l'utilisateur #1...
  Modifié : #1 Alice (alice.new@example.com)

4. Suppression de l'utilisateur #2...
  Supprimé avec succès

5. Liste finale :
  #1 Alice (alice.new@example.com)
  #3 Charlie (charlie@example.com)
  #4 Franck (franck@example.com)

=== Résumé ===
  Créations : 1
  Modifications : 1
  Suppressions : 1
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
const BASE_URL = "http://localhost:3000";

// Fonction utilitaire pour les requêtes
async function requete(chemin, options = {}) {
  const response = await fetch(`${BASE_URL}${chemin}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok && response.status !== 204) {
    const erreur = await response.json();
    throw new Error(`HTTP ${response.status} : ${erreur.erreur}`);
  }

  if (response.status === 204) return null;
  return response.json();
}

// Afficher une liste d'utilisateurs
function afficherListe(titre, utilisateurs) {
  console.log(`${titre} :`);
  utilisateurs.forEach((u) => {
    console.log(`  #${u.id} ${u.nom} (${u.email})`);
  });
}

async function main() {
  console.log("=== Gestion des utilisateurs ===\n");

  const resume = { creations: 0, modifications: 0, suppressions: 0 };

  // 1. Liste initiale
  const listeInitiale = await requete("/api/users");
  afficherListe("1. Liste initiale", listeInitiale);

  // 2. Créer Franck
  console.log("\n2. Création de Franck...");
  const franck = await requete("/api/users", {
    method: "POST",
    body: JSON.stringify({
      nom: "Franck",
      email: "franck@example.com",
      age: 29,
    }),
  });
  console.log(`  Créé : #${franck.id} ${franck.nom} (${franck.email})`);
  resume.creations++;

  // 3. Modifier l'email de l'utilisateur #1
  console.log("\n3. Modification de l'utilisateur #1...");
  const aliceModifiee = await requete("/api/users/1", {
    method: "PUT",
    body: JSON.stringify({
      nom: "Alice",
      email: "alice.new@example.com",
      age: 28,
    }),
  });
  console.log(
    `  Modifié : #${aliceModifiee.id} ${aliceModifiee.nom} (${aliceModifiee.email})`
  );
  resume.modifications++;

  // 4. Supprimer l'utilisateur #2
  console.log("\n4. Suppression de l'utilisateur #2...");
  await requete("/api/users/2", { method: "DELETE" });
  console.log("  Supprimé avec succès");
  resume.suppressions++;

  // 5. Liste finale
  console.log("");
  const listeFinale = await requete("/api/users");
  afficherListe("5. Liste finale", listeFinale);

  // Résumé
  console.log("\n=== Résumé ===");
  console.log(`  Créations : ${resume.creations}`);
  console.log(`  Modifications : ${resume.modifications}`);
  console.log(`  Suppressions : ${resume.suppressions}`);
}

main().catch((erreur) => {
  console.error("Erreur fatale :", erreur.message);
  console.error("Vérifie que le serveur est démarré (node serveur-json.mjs)");
});
```

---

## Navigation

← Fiche précédente : **[Async/await](10-async-await.md)**

→ Fiche suivante : **[Projet intégrateur](12-projet-integrateur.md)**
