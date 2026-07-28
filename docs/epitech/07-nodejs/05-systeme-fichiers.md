---
tags:
  - Node.js
  - Intermédiaire
  - Pratique
description: "Système de fichiers (fs)"
estimated_time: "60 min"
fiche_number: 5
total_fiches: 10
cursus: "Node.js"
---

# 05 - Système de fichiers (fs)

> **En bref** : À la fin de cette fiche, tu sauras lire, écrire, modifier et supprimer des fichiers avec le module fs de Node.js. Lecture estimée : 60 min.


## Prérequis

- Fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md)
- Fiche [07-nodejs/04 - Programmation asynchrone](04-programmation-asynchrone.md)
- Savoir utiliser async/await

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire, écrire, modifier et supprimer des fichiers avec le module `fs` de Node.js.

---

## Concepts

### Qu'est-ce que le module fs ?

**Définition** : `fs` (File System) est un module intégré à Node.js qui permet d'interagir avec le système de fichiers : lire, écrire, créer, supprimer des fichiers et dossiers.

**Le problème que fs résout** :

Sans accès au système de fichiers, voici les problèmes rencontrés :

1. **Pas de persistance** : Les données sont perdues quand le programme s'arrête.
2. **Pas de configuration** : Impossible de lire des fichiers de configuration.
3. **Pas de logs** : Impossible d'enregistrer les erreurs dans un fichier.
4. **Pas de traitement de fichiers** : Impossible de manipuler des CSV, JSON, etc.

**Comment fs résout ces problèmes** :

| Problème | Solution apportée par fs |
| -------- | ------------------------ |
| Pas de persistance | Sauvegarder dans des fichiers |
| Pas de configuration | Lire des fichiers .json ou .env |
| Pas de logs | Écrire dans des fichiers de log |
| Pas de traitement | Lire/écrire CSV, JSON, XML... |

**Ce que fs n'est PAS** :

- fs n'est pas une base de données. Pour des données structurées et des requêtes complexes, utilise une vraie base de données.
- fs n'est pas pour le navigateur. C'est uniquement pour Node.js (côté serveur).

---

### Chemins de fichiers

**Module path** : Le module `path` aide à construire des chemins de fichiers de manière portable (Windows, Mac, Linux).

**Analogie concrète** : Un chemin de fichier est comme une adresse postale. Un chemin absolu (`/Users/alice/projet/data.txt`) est l'adresse complète avec pays, ville et rue. Un chemin relatif (`./data.txt`) est comme dire "la porte d'à côté" : il dépend de l'endroit où tu te trouves.

**Deux types de chemins** :

| Type | Exemple | Caractéristique |
| ---- | ------- | --------------- |
| Absolu | `/Users/alice/projet/data.txt` | Commence par `/` (ou `C:\` sur Windows) |
| Relatif | `./data.txt` ou `../data.txt` | Relatif au fichier actuel |

**Variables utiles** :

| Variable | Description |
| -------- | ----------- |
| `__dirname` | Dossier du fichier JavaScript actuel |
| `__filename` | Chemin complet du fichier JavaScript actuel |

**Note** : En ES Modules, `__dirname` et `__filename` n'existent pas directement. On utilise `import.meta.url` à la place.

---

### Synchrone vs Asynchrone

**Analogie concrète** : Imagine que tu commandes un plat au restaurant. En mode synchrone, tu restes debout au comptoir sans bouger jusqu'à ce que le plat soit prêt. En mode asynchrone, tu t'assieds, tu lis le journal, et le serveur t'apporte le plat quand il est prêt.

Le module fs propose deux versions de chaque fonction :

| Type | Exemple | Bloque le programme |
| ---- | ------- | ------------------- |
| Asynchrone | `fs.readFile()` | Non |
| Synchrone | `fs.readFileSync()` | Oui |

**Recommandation** : Utilise toujours les versions asynchrones (avec `fs/promises`).

---

## Étapes Pratiques

### Étape 1 : Configurer le projet

```bash
mkdir projet-fs
cd projet-fs
npm init -y
```

Modifie `package.json` :

```json
{
  "name": "projet-fs",
  "version": "1.0.0",
  "type": "module"
}
```

---

### Étape 2 : Importer fs et path

Crée `index.js` :

```javascript
// index.js - Importer les modules nécessaires

// fs/promises pour les opérations asynchrones avec async/await
import fs from 'fs/promises';

// path pour construire des chemins
import path from 'path';

// Obtenir __dirname en ES Modules
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Fichier actuel:", __filename);
console.log("Dossier actuel:", __dirname);
```

Exécute :

```bash
node index.js
```

**Résultat attendu** :

```text
Fichier actuel: /chemin/vers/projet-fs/index.js
Dossier actuel: /chemin/vers/projet-fs
```

---

### Étape 3 : Écrire dans un fichier

Crée `ecriture.js` :

```javascript
// ecriture.js - Écrire dans des fichiers

import fs from 'fs/promises';

async function main() {
    // 1. Écrire un fichier texte (crée le fichier s'il n'existe pas)
    await fs.writeFile('message.txt', 'Bonjour depuis Node.js!');
    console.log("message.txt créé");

    // 2. Écrire avec du contenu multiligne
    const contenu = `Ligne 1
Ligne 2
Ligne 3`;
    await fs.writeFile('multilignes.txt', contenu);
    console.log("multilignes.txt créé");

    // 3. Écrire un objet JSON
    const utilisateur = {
        nom: "Alice",
        age: 25,
        ville: "Paris"
    };
    // JSON.stringify convertit l'objet en texte JSON
    // Le 2ème argument null et le 3ème argument 2 = indentation de 2 espaces
    await fs.writeFile('utilisateur.json', JSON.stringify(utilisateur, null, 2));
    console.log("utilisateur.json créé");
}

main().catch(console.error);
```

Exécute :

```bash
node ecriture.js
```

**Résultat** : Trois fichiers sont créés dans le dossier.

---

### Étape 4 : Lire un fichier

Crée `lecture.js` :

```javascript
// lecture.js - Lire des fichiers

import fs from 'fs/promises';

async function main() {
    // 1. Lire un fichier texte
    // 'utf-8' indique l'encodage (pour obtenir du texte, pas des octets)
    const texte = await fs.readFile('message.txt', 'utf-8');
    console.log("Contenu de message.txt:");
    console.log(texte);
    console.log("");

    // 2. Lire et parser un fichier JSON
    const jsonTexte = await fs.readFile('utilisateur.json', 'utf-8');
    // JSON.parse convertit le texte JSON en objet JavaScript
    const utilisateur = JSON.parse(jsonTexte);
    console.log("Contenu de utilisateur.json:");
    console.log(utilisateur);
    console.log("Nom:", utilisateur.nom);
}

main().catch(console.error);
```

Exécute :

```bash
node lecture.js
```

**Résultat attendu** :

```text
Contenu de message.txt:
Bonjour depuis Node.js!

Contenu de utilisateur.json:
{ nom: 'Alice', age: 25, ville: 'Paris' }
Nom: Alice
```

---

### Étape 5 : Ajouter du contenu à un fichier

Crée `ajout.js` :

```javascript
// ajout.js - Ajouter du contenu sans écraser

import fs from 'fs/promises';

async function main() {
    // Créer un fichier de log
    await fs.writeFile('app.log', 'Démarrage de l\'application\n');

    // Ajouter des lignes (flag 'a' = append)
    await fs.appendFile('app.log', '10:00 - Utilisateur connecté\n');
    await fs.appendFile('app.log', '10:05 - Action effectuée\n');
    await fs.appendFile('app.log', '10:10 - Utilisateur déconnecté\n');

    // Lire le fichier complet
    const contenu = await fs.readFile('app.log', 'utf-8');
    console.log("Contenu du log:");
    console.log(contenu);
}

main().catch(console.error);
```

**Résultat attendu** :

```text
Contenu du log:
Démarrage de l'application
10:00 - Utilisateur connecté
10:05 - Action effectuée
10:10 - Utilisateur déconnecté
```

---

### Étape 6 : Vérifier si un fichier existe

Crée `existe.js` :

```javascript
// existe.js - Vérifier l'existence d'un fichier

import fs from 'fs/promises';

async function fichierExiste(chemin) {
    try {
        await fs.access(chemin);
        return true;
    } catch {
        return false;
    }
}

async function main() {
    // Tester avec un fichier existant
    const existeMessage = await fichierExiste('message.txt');
    console.log("message.txt existe:", existeMessage);

    // Tester avec un fichier inexistant
    const existeAutre = await fichierExiste('inexistant.txt');
    console.log("inexistant.txt existe:", existeAutre);

    // Lire seulement si le fichier existe
    if (await fichierExiste('message.txt')) {
        const contenu = await fs.readFile('message.txt', 'utf-8');
        console.log("Contenu:", contenu);
    }
}

main().catch(console.error);
```

**Résultat attendu** :

```text
message.txt existe: true
inexistant.txt existe: false
Contenu: Bonjour depuis Node.js!
```

---

### Étape 7 : Obtenir des informations sur un fichier

Crée `infos.js` :

```javascript
// infos.js - Informations sur les fichiers

import fs from 'fs/promises';

async function main() {
    // Obtenir les statistiques d'un fichier
    const stats = await fs.stat('message.txt');

    console.log("Informations sur message.txt:");
    console.log("- Taille:", stats.size, "octets");
    console.log("- Est un fichier:", stats.isFile());
    console.log("- Est un dossier:", stats.isDirectory());
    console.log("- Date de création:", stats.birthtime);
    console.log("- Dernière modification:", stats.mtime);
}

main().catch(console.error);
```

**Résultat attendu** :

```text
Informations sur message.txt:
- Taille: 23 octets
- Est un fichier: true
- Est un dossier: false
- Date de création: 2025-01-23T10:00:00.000Z
- Dernière modification: 2025-01-23T10:00:00.000Z
```

---

### Étape 8 : Créer et lister des dossiers

Crée `dossiers.js` :

```javascript
// dossiers.js - Manipuler des dossiers

import fs from 'fs/promises';
import path from 'path';

async function main() {
    // 1. Créer un dossier
    // recursive: true évite l'erreur si le dossier existe déjà
    await fs.mkdir('data', { recursive: true });
    console.log("Dossier 'data' créé");

    // 2. Créer des sous-dossiers
    await fs.mkdir('data/users', { recursive: true });
    await fs.mkdir('data/logs', { recursive: true });
    console.log("Sous-dossiers créés");

    // 3. Créer des fichiers dans les dossiers
    await fs.writeFile('data/users/alice.json', '{"nom": "Alice"}');
    await fs.writeFile('data/users/bob.json', '{"nom": "Bob"}');
    await fs.writeFile('data/logs/app.log', 'Log de l\'application');

    // 4. Lister le contenu d'un dossier
    const fichiers = await fs.readdir('data/users');
    console.log("\nFichiers dans data/users:", fichiers);

    // 5. Lister avec plus de détails
    const fichiersDetails = await fs.readdir('data', { withFileTypes: true });
    console.log("\nContenu de data:");
    for (const item of fichiersDetails) {
        const type = item.isDirectory() ? '[Dossier]' : '[Fichier]';
        console.log(`  ${type} ${item.name}`);
    }
}

main().catch(console.error);
```

**Résultat attendu** :

```text
Dossier 'data' créé
Sous-dossiers créés

Fichiers dans data/users: [ 'alice.json', 'bob.json' ]

Contenu de data:
  [Dossier] logs
  [Dossier] users
```

---

### Étape 9 : Renommer et supprimer

Crée `operations.js` :

```javascript
// operations.js - Renommer et supprimer

import fs from 'fs/promises';

async function main() {
    // Créer un fichier de test
    await fs.writeFile('ancien.txt', 'Contenu du fichier');
    console.log("Fichier 'ancien.txt' créé");

    // Renommer le fichier
    await fs.rename('ancien.txt', 'nouveau.txt');
    console.log("Renommé en 'nouveau.txt'");

    // Copier un fichier (lire puis écrire)
    const contenu = await fs.readFile('nouveau.txt', 'utf-8');
    await fs.writeFile('copie.txt', contenu);
    console.log("Copié vers 'copie.txt'");

    // Vérifier que les fichiers existent
    const fichiers = await fs.readdir('.');
    console.log("Fichiers .txt:", fichiers.filter(f => f.endsWith('.txt')));

    // Supprimer un fichier
    await fs.unlink('copie.txt');
    console.log("'copie.txt' supprimé");

    // Supprimer un dossier vide
    await fs.mkdir('temp', { recursive: true });
    await fs.rmdir('temp');
    console.log("Dossier 'temp' supprimé");

    // Supprimer un dossier avec contenu
    await fs.mkdir('temp2', { recursive: true });
    await fs.writeFile('temp2/fichier.txt', 'test');
    await fs.rm('temp2', { recursive: true });
    console.log("Dossier 'temp2' supprimé (avec contenu)");
}

main().catch(console.error);
```

---

### Étape 10 : Exemple complet - Gestionnaire de données

Crée `gestionnaire.js` :

```javascript
// gestionnaire.js - Gestionnaire de données JSON

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(__dirname, 'database.json');

// Lire la base de données
async function lireDB() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // Si le fichier n'existe pas, retourner un tableau vide
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}

// Sauvegarder la base de données
async function sauvegarderDB(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// Ajouter un utilisateur
async function ajouterUtilisateur(nom, email) {
    const db = await lireDB();
    const id = db.length + 1;
    const utilisateur = { id, nom, email, dateCreation: new Date().toISOString() };
    db.push(utilisateur);
    await sauvegarderDB(db);
    return utilisateur;
}

// Lister tous les utilisateurs
async function listerUtilisateurs() {
    return await lireDB();
}

// Trouver un utilisateur par ID
async function trouverUtilisateur(id) {
    const db = await lireDB();
    return db.find(u => u.id === id);
}

// Supprimer un utilisateur
async function supprimerUtilisateur(id) {
    const db = await lireDB();
    const index = db.findIndex(u => u.id === id);
    if (index === -1) {
        return false;
    }
    db.splice(index, 1);
    await sauvegarderDB(db);
    return true;
}

// Test du gestionnaire
async function main() {
    console.log("=== Gestionnaire de données ===\n");

    // Ajouter des utilisateurs
    console.log("Ajout d'utilisateurs...");
    const alice = await ajouterUtilisateur("Alice", "alice@exemple.com");
    console.log("Ajouté:", alice);

    const bob = await ajouterUtilisateur("Bob", "bob@exemple.com");
    console.log("Ajouté:", bob);

    // Lister tous les utilisateurs
    console.log("\nListe des utilisateurs:");
    const tous = await listerUtilisateurs();
    console.log(tous);

    // Trouver un utilisateur
    console.log("\nRecherche utilisateur ID 1:");
    const trouve = await trouverUtilisateur(1);
    console.log(trouve);

    // Supprimer un utilisateur
    console.log("\nSuppression utilisateur ID 2:");
    const supprime = await supprimerUtilisateur(2);
    console.log("Supprimé:", supprime);

    // Liste finale
    console.log("\nListe finale:");
    console.log(await listerUtilisateurs());
}

main().catch(console.error);
```

---

## Fonctions fs/promises courantes

| Fonction | Description |
| -------- | ----------- |
| `readFile(path, 'utf-8')` | Lire un fichier |
| `writeFile(path, data)` | Écrire un fichier (écrase) |
| `appendFile(path, data)` | Ajouter à un fichier |
| `unlink(path)` | Supprimer un fichier |
| `rename(ancien, nouveau)` | Renommer/déplacer |
| `mkdir(path, { recursive: true })` | Créer un dossier |
| `rmdir(path)` | Supprimer un dossier vide |
| `rm(path, { recursive: true })` | Supprimer un dossier avec contenu |
| `readdir(path)` | Lister le contenu d'un dossier |
| `stat(path)` | Obtenir les infos d'un fichier |
| `access(path)` | Vérifier l'accès à un fichier |
| `copyFile(src, dest)` | Copier un fichier |

---

## Pièges Fréquents

### Piège 1 : Oublier 'utf-8' dans readFile

⚠️ **Problème** : Sans encodage, `readFile` retourne un Buffer (octets), pas du texte.

```javascript
// ❌ Retourne un Buffer
const data = await fs.readFile('file.txt');
console.log(data);  // <Buffer 48 65 6c 6c 6f>
```

✅ **Solution** : Toujours spécifier `'utf-8'` pour du texte.

```javascript
// ✅ Retourne une chaîne
const data = await fs.readFile('file.txt', 'utf-8');
console.log(data);  // "Hello"
```

---

### Piège 2 : Fichier inexistant sans gestion d'erreur

⚠️ **Problème** : Lire un fichier inexistant crashe le programme.

✅ **Solution** : Utiliser try/catch.

```javascript
try {
    const data = await fs.readFile('inexistant.txt', 'utf-8');
} catch (error) {
    if (error.code === 'ENOENT') {
        console.log("Fichier non trouvé");
    } else {
        throw error;
    }
}
```

---

### Piège 3 : Chemins relatifs incohérents

⚠️ **Problème** : Les chemins relatifs sont relatifs au dossier d'exécution, pas au fichier.

✅ **Solution** : Utiliser `__dirname` et `path.join`.

```javascript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fichier = path.join(__dirname, 'data', 'fichier.txt');
```

---

### Piège 4 : mkdir sans recursive

⚠️ **Problème** : Créer un dossier qui existe déjà cause une erreur.

✅ **Solution** : Utiliser `{ recursive: true }`.

```javascript
// ❌ Erreur si existe déjà
await fs.mkdir('dossier');

// ✅ Pas d'erreur si existe déjà
await fs.mkdir('dossier', { recursive: true });
```

---

## Checklist de Validation

- [ ] Je sais importer `fs/promises` et `path`
- [ ] Je sais lire un fichier avec `readFile`
- [ ] Je sais écrire un fichier avec `writeFile`
- [ ] Je sais ajouter du contenu avec `appendFile`
- [ ] Je sais lire et écrire des fichiers JSON
- [ ] Je sais créer des dossiers avec `mkdir`
- [ ] Je sais lister le contenu d'un dossier avec `readdir`
- [ ] Je gère les erreurs avec try/catch

---

## Exercice Pratique

**Énoncé** : Crée un système de notes (comme un bloc-notes) avec les fonctionnalités :

1. Ajouter une note (titre + contenu)
2. Lister toutes les notes
3. Lire une note par son titre
4. Supprimer une note

Les notes sont stockées dans un dossier `notes/`, un fichier JSON par note.

**Structure attendue** :

```text
projet/
├── notes/
│   ├── ma-premiere-note.json
│   └── liste-courses.json
└── index.js
```

**Résultat attendu** :

```text
=== Système de Notes ===

Ajout de notes...
Note 'courses' créée
Note 'idees' créée

Liste des notes:
- courses
- idees

Lecture de 'courses':
{ titre: 'courses', contenu: 'Pain, lait, œufs', date: '...' }

Suppression de 'idees'...
Note supprimée

Liste finale:
- courses
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// index.js - Système de notes

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const NOTES_DIR = path.join(__dirname, 'notes');

// Convertir un titre en nom de fichier sûr
function slugify(titre) {
    return titre.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Initialiser le dossier notes
async function init() {
    await fs.mkdir(NOTES_DIR, { recursive: true });
}

// Ajouter une note
async function ajouterNote(titre, contenu) {
    const note = {
        titre,
        contenu,
        date: new Date().toISOString()
    };
    const fichier = path.join(NOTES_DIR, `${slugify(titre)}.json`);
    await fs.writeFile(fichier, JSON.stringify(note, null, 2));
    console.log(`Note '${titre}' créée`);
}

// Lister les notes
async function listerNotes() {
    const fichiers = await fs.readdir(NOTES_DIR);
    const notes = fichiers
        .filter(f => f.endsWith('.json'))
        .map(f => f.replace('.json', ''));
    return notes;
}

// Lire une note
async function lireNote(titre) {
    const fichier = path.join(NOTES_DIR, `${slugify(titre)}.json`);
    try {
        const data = await fs.readFile(fichier, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            return null;
        }
        throw error;
    }
}

// Supprimer une note
async function supprimerNote(titre) {
    const fichier = path.join(NOTES_DIR, `${slugify(titre)}.json`);
    try {
        await fs.unlink(fichier);
        return true;
    } catch (error) {
        if (error.code === 'ENOENT') {
            return false;
        }
        throw error;
    }
}

// Tests
async function main() {
    console.log("=== Système de Notes ===\n");

    await init();

    // Ajouter des notes
    console.log("Ajout de notes...");
    await ajouterNote("courses", "Pain, lait, œufs");
    await ajouterNote("idees", "Apprendre Node.js, faire un projet");

    // Lister
    console.log("\nListe des notes:");
    const notes = await listerNotes();
    notes.forEach(n => console.log(`- ${n}`));

    // Lire
    console.log("\nLecture de 'courses':");
    const note = await lireNote("courses");
    console.log(note);

    // Supprimer
    console.log("\nSuppression de 'idees'...");
    const supprime = await supprimerNote("idees");
    console.log(supprime ? "Note supprimée" : "Note non trouvée");

    // Liste finale
    console.log("\nListe finale:");
    const notesFinales = await listerNotes();
    notesFinales.forEach(n => console.log(`- ${n}`));
}

main().catch(console.error);
```

---

## Navigation

← Fiche précédente : **[Programmation asynchrone](04-programmation-asynchrone.md)**

→ Fiche suivante : **[Introduction à Express](06-introduction-express.md)**
