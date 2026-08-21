---
tags:
  - Node.js
  - Avancé
  - Pratique
description: "Validation des entrées avec zod"
estimated_time: "60 min"
fiche_number: 10
total_fiches: 10
cursus: "Node.js"
id: "fundamentals.nodejs.validation-entrees"
course_id: "fundamentals.nodejs"
content_type: "lesson"
order: 10
---

# 10 - Validation des entrées

> **En bref** : À la fin de cette fiche, tu sauras pourquoi valider les données reçues, comparer validation manuelle et bibliothèque, et utiliser `zod` pour valider les corps de requête d'une API Express. Lecture estimée : 60 min.

## Prérequis

- Fiche [07-nodejs/08 - API REST avec Express](08-api-rest.md)
- Fiche [07-nodejs/09 - Variables d'environnement et configuration](09-variables-environnement.md)
- Comprendre les corps de requête JSON (`req.body`) et les middleware Express

## Objectif de cette fiche

À la fin de cette fiche, tu sauras vérifier que les données entrant dans ton application sont conformes à ce que tu attends, à l'aide de la bibliothèque `zod`, et renvoyer des messages d'erreur clairs depuis une API Express.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la validation des entrées ?

**Définition** : La validation des entrées est la vérification que les données reçues par un programme (corps de requête, paramètres d'URL, formulaire) respectent un format et des règles attendus avant d'être utilisées.

**Le problème que la validation résout** :

Sans validation, voici les problèmes rencontrés :

1. **Failles de sécurité** : Des données malveillantes (champ trop long, type inattendu) traversent l'application et peuvent provoquer des plantages ou des injections.
2. **Données corrompues** : Un âge négatif, un email sans `@`, un champ requis vide sont enregistrés tels quels et polluent la base.
3. **Erreurs tardives et obscures** : Le problème n'apparaît que bien plus loin dans le code, avec un message incompréhensible, au lieu d'être détecté à l'entrée.

**Comment la validation résout ces problèmes** :

| Problème | Solution apportée par la validation |
| -------- | ----------------------------------- |
| Failles de sécurité | Les données non conformes sont rejetées avant tout traitement |
| Données corrompues | Seules les données valides atteignent la logique métier |
| Erreurs tardives | L'erreur est détectée et expliquée dès l'entrée |

**Analogie concrète** : La validation est comme le contrôle de sécurité d'un aéroport. Avant de monter dans l'avion (la logique de ton application), chaque passager et chaque bagage sont vérifiés. Ce qui ne respecte pas les règles est arrêté à l'entrée, pas découvert en plein vol.

**Ce que la validation n'est PAS** :

- La validation n'est pas optionnelle pour les données venant de l'extérieur. Toute donnée provenant d'un client est suspecte par principe : on dit qu'il ne faut **jamais faire confiance à l'entrée utilisateur**.
- La validation n'est pas la même chose que la sanitisation (voir plus bas).

---

### Validation manuelle ou bibliothèque ?

**Définition** : La validation manuelle consiste à écrire soi-même les `if` qui vérifient chaque champ. Une bibliothèque de validation fournit des outils prêts à l'emploi pour décrire les règles une fois et les appliquer automatiquement.

**Validation manuelle** :

```javascript
// Validation écrite à la main, champ par champ
function validerUtilisateur(data) {
    const erreurs = {};

    if (!data.nom || data.nom.trim() === '') {
        erreurs.nom = 'Le nom est requis';
    }
    if (typeof data.age !== 'number' || data.age < 0) {
        erreurs.age = "L'âge doit être un nombre positif";
    }
    // ... un bloc par champ, qui grandit vite

    return erreurs;
}
```

**Comparaison** :

| Validation manuelle | Bibliothèque (zod) |
| ------------------- | ------------------ |
| Aucune dépendance à installer | Une dépendance à installer |
| Code répétitif et long | Règles décrites de façon concise |
| Messages d'erreur à écrire un par un | Messages générés automatiquement |
| Erreurs faciles à oublier | Le schéma couvre tous les champs déclarés |

**Conclusion** : pour quelques vérifications simples, le manuel suffit. Dès que les règles se multiplient, une bibliothèque comme `zod` réduit le code et les oublis.

---

### Qu'est-ce que zod ?

**Définition** : `zod` est une bibliothèque de validation pour JavaScript et TypeScript. Tu décris la forme attendue des données dans un **schéma**, puis tu demandes à `zod` de vérifier qu'une valeur respecte ce schéma.

**Analogie concrète** : Un schéma `zod` est comme le gabarit d'un poste de tri postal : une fente ronde, une fente carrée, une fente longue. Tu présentes un objet (les données) au gabarit ; s'il rentre dans toutes les fentes prévues, il passe ; sinon, il est refusé avec la raison du refus.

**Exemple de schéma** :

```javascript
import { z } from 'zod';

// Décrit la forme attendue d'un utilisateur
const utilisateurSchema = z.object({
    nom: z.string().min(1),              // chaîne non vide
    age: z.number().int().positive(),    // entier strictement positif
    email: z.string().email()            // chaîne au format email
});
```

---

### parse et safeParse

`zod` propose deux façons de vérifier une valeur contre un schéma.

| Méthode | Comportement en cas d'erreur | Quand l'utiliser |
| ------- | ---------------------------- | ---------------- |
| `parse(data)` | Lève une exception (`ZodError`) | Quand tu veux que l'erreur remonte via `try/catch` |
| `safeParse(data)` | Retourne un objet `{ success, data, error }` | Quand tu veux gérer le résultat sans exception |

**Avec `parse`** :

```javascript
try {
    // Lève une exception si les données sont invalides
    const utilisateur = utilisateurSchema.parse(donnees);
    console.log('Valide :', utilisateur);
} catch (erreur) {
    console.log('Invalide :', erreur.issues);
}
```

**Avec `safeParse`** :

```javascript
// Ne lève jamais d'exception : on inspecte le résultat
const resultat = utilisateurSchema.safeParse(donnees);

if (resultat.success) {
    console.log('Valide :', resultat.data);
} else {
    console.log('Invalide :', resultat.error.issues);
}
```

Dans une API web, `safeParse` est souvent plus pratique : il évite le `try/catch` et permet de transformer directement les erreurs en réponse HTTP.

---

### Validation et sanitisation : deux opérations distinctes

**Définition** :

- La **validation** vérifie qu'une donnée est conforme et **rejette** ce qui ne l'est pas.
- La **sanitisation** **transforme** une donnée pour la rendre sûre ou normalisée (retirer des espaces, mettre en minuscules, supprimer des balises HTML).

**Comparaison** :

| Validation | Sanitisation |
| ---------- | ------------ |
| Répond à « est-ce conforme ? » | Répond à « comment nettoyer ? » |
| Rejette la donnée invalide | Modifie la donnée |
| Exemple : « l'email contient un `@` » | Exemple : « passer l'email en minuscules » |

**Ce que la sanitisation n'est PAS** : la sanitisation ne remplace pas la validation. Nettoyer une chaîne ne garantit pas qu'elle respecte les règles métier. On valide d'abord, puis on normalise ce qui est valide.

> **Note** : `zod` peut combiner les deux. La méthode `.trim()` retire les espaces (sanitisation) et `.transform()` permet d'appliquer une transformation après validation.

---

## Étapes Pratiques

### Étape 1 : Créer le projet et installer zod

```bash
# Crée le projet et entre dedans
mkdir validation-app
cd validation-app

# Initialise npm
npm init -y

# Installe zod et Express
npm install zod express
```

Active les modules ES en ajoutant `"type": "module"` dans `package.json` :

```json
{
  "name": "validation-app",
  "version": "1.0.0",
  "type": "module",
  "dependencies": {
    "express": "^4.21.0",
    "zod": "^3.23.8"
  }
}
```

---

### Étape 2 : Écrire un premier schéma

Crée `essai.js` :

```javascript
// essai.js - Premier schéma zod

import { z } from 'zod';

// Schéma d'un utilisateur attendu
const utilisateurSchema = z.object({
    nom: z.string().min(1),           // chaîne d'au moins 1 caractère
    age: z.number().int().positive(), // entier strictement positif
    email: z.string().email()         // format email valide
});

// Donnée valide
const valide = { nom: 'Alice', age: 30, email: 'alice@exemple.com' };

// Donnée invalide (âge négatif, email sans @)
const invalide = { nom: '', age: -5, email: 'pas-un-email' };

console.log('--- Cas valide ---');
console.log(utilisateurSchema.safeParse(valide).success);

console.log('--- Cas invalide ---');
const resultat = utilisateurSchema.safeParse(invalide);
console.log(resultat.success);
```

Lance le script :

```bash
node essai.js
```

**Résultat attendu** :

```text
--- Cas valide ---
true
--- Cas invalide ---
false
```

---

### Étape 3 : Lire les messages d'erreur

Modifie `essai.js` pour afficher le détail des erreurs :

```javascript
import { z } from 'zod';

const utilisateurSchema = z.object({
    nom: z.string().min(1),
    age: z.number().int().positive(),
    email: z.string().email()
});

const invalide = { nom: '', age: -5, email: 'pas-un-email' };

const resultat = utilisateurSchema.safeParse(invalide);

if (!resultat.success) {
    // error.issues est un tableau décrivant chaque problème
    for (const probleme of resultat.error.issues) {
        // path indique le champ concerné, message décrit l'erreur
        console.log(`${probleme.path.join('.')} : ${probleme.message}`);
    }
}
```

**Résultat attendu** :

```text
nom : String must contain at least 1 character(s)
age : Number must be greater than 0
email : Invalid email
```

---

### Étape 4 : Personnaliser les messages

Les messages par défaut sont en anglais. Tu peux fournir tes propres messages en français :

```javascript
import { z } from 'zod';

// Chaque règle accepte un message personnalisé
const utilisateurSchema = z.object({
    nom: z.string().min(1, 'Le nom est requis'),
    age: z
        .number({ invalid_type_error: "L'âge doit être un nombre" })
        .int("L'âge doit être un entier")
        .positive("L'âge doit être positif"),
    email: z.string().email("L'email n'est pas valide")
});

const resultat = utilisateurSchema.safeParse({ nom: '', age: -5, email: 'x' });

if (!resultat.success) {
    for (const probleme of resultat.error.issues) {
        console.log(`${probleme.path.join('.')} : ${probleme.message}`);
    }
}
```

**Résultat attendu** :

```text
nom : Le nom est requis
age : L'âge doit être positif
email : L'email n'est pas valide
```

---

### Étape 5 : Valider le corps d'une requête Express

Crée `serveur.js`. On valide le corps reçu sur `POST /utilisateurs` :

```javascript
// serveur.js - Validation du corps de requête avec zod

import express from 'express';
import { z } from 'zod';

const app = express();
const PORT = 3000;

// Active le parsing du corps JSON des requêtes
app.use(express.json());

// Schéma attendu pour créer un utilisateur
const creerUtilisateurSchema = z.object({
    nom: z.string().min(1, 'Le nom est requis'),
    age: z.number().int().positive("L'âge doit être un entier positif"),
    email: z.string().email("L'email n'est pas valide")
});

// Route de création
app.post('/utilisateurs', (req, res) => {
    // safeParse ne lève pas d'exception : on inspecte le résultat
    const resultat = creerUtilisateurSchema.safeParse(req.body);

    if (!resultat.success) {
        // 422 : entité non traitable (validation échouée)
        return res.status(422).json({
            erreur: {
                code: 'VALIDATION_ERROR',
                details: resultat.error.issues.map((p) => ({
                    champ: p.path.join('.'),
                    message: p.message
                }))
            }
        });
    }

    // resultat.data contient les données validées
    res.status(201).json({
        message: 'Utilisateur créé',
        utilisateur: resultat.data
    });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
```

Lance le serveur :

```bash
node serveur.js
```

**Test avec des données valides** :

```bash
curl -X POST http://localhost:3000/utilisateurs \
  -H "Content-Type: application/json" \
  -d '{"nom":"Alice","age":30,"email":"alice@exemple.com"}'
```

**Résultat attendu** :

```json
{
  "message": "Utilisateur créé",
  "utilisateur": { "nom": "Alice", "age": 30, "email": "alice@exemple.com" }
}
```

**Test avec des données invalides** :

```bash
curl -X POST http://localhost:3000/utilisateurs \
  -H "Content-Type: application/json" \
  -d '{"nom":"","age":-5,"email":"x"}'
```

**Résultat attendu** :

```json
{
  "erreur": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "champ": "nom", "message": "Le nom est requis" },
      { "champ": "age", "message": "L'âge doit être un entier positif" },
      { "champ": "email", "message": "L'email n'est pas valide" }
    ]
  }
}
```

---

### Étape 6 : Réutiliser la validation avec un middleware

Plutôt que de répéter le bloc `safeParse` dans chaque route, crée un middleware générique qui valide un schéma donné. Crée `valider.js` :

```javascript
// valider.js - Middleware de validation réutilisable

// Prend un schéma zod et renvoie un middleware Express
export function valider(schema) {
    return (req, res, next) => {
        const resultat = schema.safeParse(req.body);

        if (!resultat.success) {
            return res.status(422).json({
                erreur: {
                    code: 'VALIDATION_ERROR',
                    details: resultat.error.issues.map((p) => ({
                        champ: p.path.join('.'),
                        message: p.message
                    }))
                }
            });
        }

        // Remplace req.body par la version validée (et nettoyée)
        req.body = resultat.data;
        next();
    };
}
```

Utilise-le dans `serveur.js` :

```javascript
import express from 'express';
import { z } from 'zod';
import { valider } from './valider.js';

const app = express();
app.use(express.json());

const creerUtilisateurSchema = z.object({
    nom: z.string().trim().min(1, 'Le nom est requis'),
    age: z.number().int().positive("L'âge doit être un entier positif"),
    email: z.string().trim().toLowerCase().email("L'email n'est pas valide")
});

// Le middleware valide avant d'atteindre le gestionnaire de route
app.post('/utilisateurs', valider(creerUtilisateurSchema), (req, res) => {
    // À ce stade, req.body est garanti valide
    res.status(201).json({ message: 'Utilisateur créé', utilisateur: req.body });
});

app.listen(3000, () => console.log('Serveur sur http://localhost:3000'));
```

**Note** : `.trim()` et `.toLowerCase()` sanitisent les données après validation : le nom est débarrassé de ses espaces, l'email est mis en minuscules.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npm install zod` | Installe la bibliothèque de validation |
| `schema.parse(data)` | Valide et lève une exception si invalide |
| `schema.safeParse(data)` | Valide et retourne `{ success, data, error }` |
| `z.string().min(1)` | Chaîne d'au moins un caractère |
| `z.number().int().positive()` | Entier strictement positif |
| `z.string().email()` | Chaîne au format email |
| `z.string().trim()` | Chaîne dont les espaces de bord sont retirés |

---

## Pièges Fréquents

### Piège 1 : Faire confiance aux données du client

⚠️ **Problème** : Supposer que le client envoie toujours des données correctes. Un client modifié ou un attaquant peut envoyer n'importe quoi.

✅ **Solution** : Valide systématiquement toute donnée venant de l'extérieur (corps, paramètres, en-têtes) avant de l'utiliser.

---

### Piège 2 : Oublier express.json()

⚠️ **Problème** : Sans `app.use(express.json())`, `req.body` vaut `undefined`, et la validation échoue toujours, même avec des données correctes.

✅ **Solution** : Active le middleware de parsing JSON avant les routes :

```javascript
app.use(express.json());
```

---

### Piège 3 : Confondre validation et sanitisation

⚠️ **Problème** : Croire qu'une chaîne nettoyée (espaces retirés, minuscules) est forcément valide. Le nettoyage ne vérifie pas les règles métier.

✅ **Solution** : Valide d'abord (la donnée est-elle conforme ?), puis normalise ce qui est valide. `zod` enchaîne les deux : `z.string().email().toLowerCase()`.

---

### Piège 4 : Ignorer le résultat de safeParse

⚠️ **Problème** : Lire `resultat.data` sans vérifier `resultat.success`. En cas d'échec, `data` est `undefined`.

✅ **Solution** : Vérifie toujours `success` avant d'accéder à `data` :

```javascript
const resultat = schema.safeParse(req.body);
if (!resultat.success) {
    // gérer l'erreur et s'arrêter
    return res.status(422).json({ erreur: resultat.error.issues });
}
// ici seulement, resultat.data est sûr
```

---

## Checklist de Validation

- [ ] Je comprends pourquoi il ne faut jamais faire confiance à l'entrée utilisateur
- [ ] Je sais écrire un schéma `zod` avec `z.object`
- [ ] Je connais la différence entre `parse` et `safeParse`
- [ ] Je sais lire `error.issues` pour extraire le champ et le message
- [ ] Je valide le corps d'une requête Express avant de l'utiliser
- [ ] Je distingue validation (rejeter) et sanitisation (transformer)
- [ ] J'ai créé un middleware de validation réutilisable

---

## Exercice Pratique

**Énoncé** : Crée une API Express avec une route `POST /produits` qui valide le corps de la requête à l'aide de `zod`.

Un produit valide respecte ces règles :

1. `nom` : chaîne non vide
2. `prix` : nombre strictement positif
3. `categorie` : l'une des valeurs `livre`, `jeu`, `musique`
4. `enStock` : booléen

L'API doit :

- Renvoyer `201` avec le produit validé si tout est correct
- Renvoyer `422` avec la liste des champs en erreur sinon

**Indications** :

- Pour une valeur parmi un ensemble fixe, utilise `z.enum([...])`.
- Pour un booléen, utilise `z.boolean()`.
- Réutilise le middleware `valider` ou écris le `safeParse` directement dans la route.

**Résultat attendu** :

Avec `{"nom":"Dune","prix":12.5,"categorie":"livre","enStock":true}`, l'API renvoie un statut `201` et le produit.

Avec `{"nom":"","prix":-1,"categorie":"film","enStock":"oui"}`, l'API renvoie un statut `422` listant les quatre champs en erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**serveur.js** :

```javascript
// serveur.js - Validation d'un produit avec zod

import express from 'express';
import { z } from 'zod';

const app = express();
app.use(express.json());

// Schéma d'un produit
const produitSchema = z.object({
    nom: z.string().trim().min(1, 'Le nom est requis'),
    prix: z.number().positive('Le prix doit être strictement positif'),
    // enum : la valeur doit faire partie de la liste
    categorie: z.enum(['livre', 'jeu', 'musique'], {
        errorMap: () => ({ message: 'Catégorie invalide (livre, jeu ou musique)' })
    }),
    enStock: z.boolean({ invalid_type_error: 'enStock doit être un booléen' })
});

app.post('/produits', (req, res) => {
    const resultat = produitSchema.safeParse(req.body);

    if (!resultat.success) {
        return res.status(422).json({
            erreur: {
                code: 'VALIDATION_ERROR',
                details: resultat.error.issues.map((p) => ({
                    champ: p.path.join('.'),
                    message: p.message
                }))
            }
        });
    }

    res.status(201).json({
        message: 'Produit créé',
        produit: resultat.data
    });
});

app.listen(3000, () => console.log('Serveur sur http://localhost:3000'));
```

**Test du cas valide** :

```bash
curl -X POST http://localhost:3000/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"Dune","prix":12.5,"categorie":"livre","enStock":true}'
```

```json
{
  "message": "Produit créé",
  "produit": { "nom": "Dune", "prix": 12.5, "categorie": "livre", "enStock": true }
}
```

**Test du cas invalide** :

```bash
curl -X POST http://localhost:3000/produits \
  -H "Content-Type: application/json" \
  -d '{"nom":"","prix":-1,"categorie":"film","enStock":"oui"}'
```

```json
{
  "erreur": {
    "code": "VALIDATION_ERROR",
    "details": [
      { "champ": "nom", "message": "Le nom est requis" },
      { "champ": "prix", "message": "Le prix doit être strictement positif" },
      { "champ": "categorie", "message": "Catégorie invalide (livre, jeu ou musique)" },
      { "champ": "enStock", "message": "enStock doit être un booléen" }
    ]
  }
}
```

---

## Navigation

← Fiche précédente : **[Variables d'environnement et configuration](09-variables-environnement.md)**

Tu as terminé le cursus Node.js.
