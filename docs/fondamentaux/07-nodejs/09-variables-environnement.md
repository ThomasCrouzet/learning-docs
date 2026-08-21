---
tags:
  - Node.js
  - Intermédiaire
  - Pratique
description: "Variables d'environnement et configuration"
estimated_time: "55 min"
fiche_number: 9
total_fiches: 10
cursus: "Node.js"
id: "fundamentals.nodejs.variables-environnement"
course_id: "fundamentals.nodejs"
content_type: "lesson"
order: 9
---

# 09 - Variables d'environnement et configuration

> **En bref** : À la fin de cette fiche, tu sauras stocker la configuration et les secrets hors du code grâce aux variables d'environnement, charger un fichier `.env` avec Node.js 22, et valider la configuration au démarrage. Lecture estimée : 55 min.

## Prérequis

- Fiche [07-nodejs/03 - Modules et imports](03-modules-imports.md)
- Fiche [07-nodejs/08 - API REST avec Express](08-api-rest.md)
- Savoir lancer un script avec `node` (fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras séparer la configuration du code source, charger des variables d'environnement depuis un fichier `.env`, protéger tes secrets avec `.gitignore`, et vérifier que la configuration est complète au démarrage de l'application.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable d'environnement ?

**Définition** : Une variable d'environnement est une valeur nommée fournie par le système d'exploitation (ou par un outil de lancement) au programme au moment de son démarrage. Le programme la lit, mais elle n'est pas écrite dans son code source.

**Le problème que les variables d'environnement résolvent** :

Sans variables d'environnement, voici les problèmes rencontrés :

1. **Secrets exposés** : Le mot de passe de la base de données est écrit en clair dans le code, donc visible par toute personne qui lit le dépôt.
2. **Configuration figée** : Pour changer une valeur (port, URL), il faut modifier le code et le recompiler ou le redéployer.
3. **Même code, environnements différents** : L'application doit pointer vers une base de test en développement et une base réelle en production, mais le code est identique.

**Comment les variables d'environnement résolvent ces problèmes** :

| Problème | Solution apportée par les variables d'environnement |
| -------- | --------------------------------------------------- |
| Secrets exposés | Le secret vit dans l'environnement, jamais dans le code versionné |
| Configuration figée | La valeur change sans toucher au code |
| Même code, environnements différents | Chaque environnement fournit ses propres valeurs |

**Analogie concrète** : Une variable d'environnement est comme une étiquette autocollante posée sur un colis. Le contenu du colis (ton code) reste identique, mais l'étiquette indique l'adresse de livraison du jour. Tu changes l'adresse en remplaçant l'étiquette, sans jamais ouvrir ni modifier le colis.

**Ce qu'une variable d'environnement n'est PAS** :

- Une variable d'environnement n'est pas une variable JavaScript normale. Elle n'est pas déclarée avec `const` dans ton fichier ; elle est fournie de l'extérieur et lue via `process.env`.
- Une variable d'environnement n'est pas chiffrée par magie. Son rôle est de sortir le secret du code source, pas de le rendre illisible. La protection vient du fait qu'on ne la versionne pas.

---

### process.env

**Définition** : `process.env` est un objet fourni par Node.js qui contient toutes les variables d'environnement disponibles au moment du lancement du programme.

**Caractéristique importante** : toutes les valeurs de `process.env` sont des **chaînes de caractères** (`string`), même si elles ressemblent à des nombres ou à des booléens.

**Exemple de lecture** :

```javascript
// Lit la variable PORT fournie par l'environnement
const port = process.env.PORT;

console.log(port);        // "3000" (une chaîne, pas le nombre 3000)
console.log(typeof port); // "string"
```

**Conséquence** : pour utiliser une valeur comme nombre ou comme booléen, tu dois la convertir explicitement.

```javascript
// Conversion en nombre avec une valeur par défaut
const port = Number(process.env.PORT) || 3000;

// Conversion en booléen : on compare à la chaîne "true"
const debugActif = process.env.DEBUG === 'true';
```

---

### Le fichier .env

**Définition** : Un fichier `.env` est un fichier texte qui liste des variables d'environnement, une par ligne, au format `CLE=valeur`. Il permet de regrouper toute la configuration locale dans un seul endroit lisible.

**Le problème que le fichier `.env` résout** :

Saisir manuellement chaque variable à chaque lancement est fastidieux et source d'erreurs. Le fichier `.env` centralise ces valeurs pour qu'un seul fichier décrive la configuration d'un environnement.

**Format d'un fichier `.env`** :

```env
# Les lignes qui commencent par # sont des commentaires
PORT=3000
DATABASE_URL=postgres://user:motdepasse@localhost:5432/madb
API_KEY=cle-secrete-abc123
NODE_ENV=development
```

**Règles de syntaxe** :

| Règle | Exemple |
| ----- | ------- |
| Une variable par ligne | `PORT=3000` |
| Pas d'espace autour du `=` | `PORT=3000` et non `PORT = 3000` |
| Noms en majuscules par convention | `DATABASE_URL` |
| Commentaire avec `#` | `# Base de données` |

**Ce qu'un fichier `.env` n'est PAS** :

- Un fichier `.env` n'est pas du JavaScript. Il n'y a ni `const`, ni guillemets obligatoires, ni point-virgule.
- Un fichier `.env` n'est pas destiné à être versionné. Il contient des secrets propres à une machine, donc il reste local.

---

### Charger un fichier .env avec Node.js 22

**Définition** : Depuis Node.js 20.6 (et stabilisé dans la lignée Node.js 22 LTS), Node.js sait charger un fichier `.env` nativement, sans bibliothèque externe, grâce à l'option de ligne de commande `--env-file`.

**Syntaxe** :

```bash
# Charge le fichier .env avant d'exécuter le script
node --env-file=.env index.js
```

Toutes les variables du fichier `.env` deviennent alors accessibles via `process.env` dans `index.js`.

**Comparaison : option native vs bibliothèque `dotenv`** :

| Option native `--env-file` | Bibliothèque `dotenv` |
| -------------------------- | --------------------- |
| Intégrée à Node.js 22, aucune installation | Nécessite `npm install dotenv` |
| Activée par une option de lancement | Activée par `import 'dotenv/config'` dans le code |
| Idéale pour les projets récents | Encore très répandue, utile si tu cibles d'anciennes versions de Node.js |

**Analogie concrète** : `--env-file` est comme une cafetière avec un bouton intégré pour préchauffer l'eau : tout est dans la machine. `dotenv` est comme une bouilloire séparée que tu branches en plus : elle fait le même travail, mais c'est un appareil supplémentaire à acheter et à brancher.

> **Note** : Cette fiche utilise l'option native `--env-file` (Node.js 22 LTS). Si ton projet doit fonctionner sur une version de Node.js plus ancienne que la 20.6, utilise `dotenv` à la place (voir l'étape 6).

---

### Pourquoi ne jamais écrire un secret dans le code

**Définition** : Un secret est une valeur qui donne accès à une ressource protégée (mot de passe, clé d'API, jeton). Écrire un secret directement dans le code, c'est le **hardcoder**.

**Le problème que hardcoder un secret crée** :

1. **Diffusion incontrôlée** : Le secret est copié dans chaque clone du dépôt, sur chaque machine, dans chaque sauvegarde.
2. **Historique permanent** : Une fois committé, le secret reste dans l'historique Git même si tu le supprimes plus tard. Il faut réécrire l'historique pour l'effacer vraiment.
3. **Fuite publique** : Si le dépôt devient public ou est partagé, le secret est exposé à tout le monde.

**La règle** : un secret se lit toujours via `process.env`, jamais en clair dans le code.

```javascript
// A ne jamais faire : secret hardcodé
const apiKey = 'cle-secrete-abc123';

// A faire : secret lu depuis l'environnement
const apiKey = process.env.API_KEY;
```

---

### Configuration par environnement

**Définition** : La configuration par environnement consiste à fournir des valeurs différentes selon le contexte d'exécution (développement, test, production), tout en gardant un code identique.

La variable conventionnelle qui indique le contexte est `NODE_ENV`. Ses valeurs usuelles sont `development`, `test` et `production`.

**Analogie concrète** : C'est comme un interrupteur à trois positions sur une perceuse. La perceuse (ton code) est la même, mais selon la position choisie elle tourne lentement, normalement ou vite. `NODE_ENV` choisit le réglage sans changer l'outil.

---

## Étapes Pratiques

### Étape 1 : Créer le projet

```bash
# Crée un dossier de projet et entre dedans
mkdir config-app
cd config-app

# Initialise un projet npm (génère package.json)
npm init -y
```

**Résultat attendu** :

```text
Wrote to /chemin/config-app/package.json
```

---

### Étape 2 : Créer le fichier .env

Crée un fichier nommé `.env` à la racine du projet :

```env
# Configuration de l'application
PORT=3000
NODE_ENV=development
API_KEY=cle-de-developpement-123
DATABASE_URL=postgres://localhost:5432/madb_dev
```

**Important** : le fichier s'appelle exactement `.env` (avec un point au début, sans extension).

---

### Étape 3 : Protéger le fichier .env avec .gitignore

Le fichier `.env` contient des secrets : il ne doit jamais être versionné. Crée un fichier `.gitignore` à la racine :

```text
# Dépendances installées
node_modules/

# Fichiers d'environnement (contiennent des secrets)
.env
.env.local
.env.*.local
```

**Résultat attendu** : si tu lances `git status` dans un dépôt Git, le fichier `.env` n'apparaît pas dans les fichiers à committer.

```bash
git status
```

```text
On branch main
nothing to commit, working tree clean
```

---

### Étape 4 : Fournir un modèle avec .env.example

Comme `.env` n'est pas versionné, les autres développeurs ne savent pas quelles variables sont attendues. La convention est de versionner un fichier `.env.example` qui liste les clés **sans les vraies valeurs**.

Crée `.env.example` :

```env
# Modèle de configuration : copie ce fichier en .env et remplis les valeurs
PORT=3000
NODE_ENV=development
API_KEY=
DATABASE_URL=
```

Ce fichier, lui, est versionné (il ne contient aucun secret). Un nouveau développeur fait :

```bash
# Copie le modèle pour créer sa propre configuration locale
cp .env.example .env
```

---

### Étape 5 : Lire les variables avec --env-file

Crée `index.js` :

```javascript
// index.js - Lecture de la configuration depuis l'environnement

// process.env contient toutes les variables fournies par --env-file
const port = Number(process.env.PORT) || 3000;
const environnement = process.env.NODE_ENV || 'development';
const apiKey = process.env.API_KEY;

// On affiche la configuration lue (sans révéler le secret en entier)
console.log('Port :', port);
console.log('Environnement :', environnement);
console.log('Clé API définie :', apiKey ? 'oui' : 'non');
```

Lance le script en chargeant le fichier `.env` :

```bash
node --env-file=.env index.js
```

**Résultat attendu** :

```text
Port : 3000
Environnement : development
Clé API définie : oui
```

---

### Étape 6 : Alternative avec dotenv (versions anciennes de Node.js)

Si tu dois cibler une version de Node.js antérieure à la 20.6, l'option `--env-file` n'existe pas. Utilise alors la bibliothèque `dotenv`.

Installe la bibliothèque :

```bash
# Installe dotenv comme dépendance du projet
npm install dotenv
```

Charge `.env` au tout début de `index.js` :

```javascript
// index.js - Chargement de .env via la bibliothèque dotenv

// Cette ligne lit le fichier .env et remplit process.env
// Elle doit être la toute première instruction du fichier
import 'dotenv/config';

const port = Number(process.env.PORT) || 3000;
console.log('Port :', port);
```

Le lancement se fait alors sans option spéciale :

```bash
node index.js
```

**Résultat attendu** :

```text
Port : 3000
```

---

### Étape 7 : Centraliser la configuration dans un module

Plutôt que de lire `process.env` partout, regroupe toute la configuration dans un seul module. Crée `config.js` :

```javascript
// config.js - Point unique de lecture de la configuration

// On lit chaque variable une seule fois, avec sa conversion et sa valeur par défaut
export const config = {
    port: Number(process.env.PORT) || 3000,
    environnement: process.env.NODE_ENV || 'development',
    apiKey: process.env.API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    // Booléen dérivé du contexte : utile pour activer des logs détaillés
    estProduction: process.env.NODE_ENV === 'production'
};
```

Le reste du code importe `config` au lieu de toucher à `process.env` :

```javascript
// index.js
import { config } from './config.js';

console.log('Port :', config.port);
console.log('Production :', config.estProduction);
```

**Avantage** : un seul fichier décrit toute la configuration. Si une variable change de nom, tu corriges un seul endroit.

---

### Étape 8 : Valider la configuration au démarrage

Si une variable obligatoire manque, mieux vaut arrêter l'application immédiatement avec un message clair, plutôt que de planter plus tard avec une erreur obscure. Complète `config.js` :

```javascript
// config.js - Configuration avec validation au démarrage

// Liste des variables strictement nécessaires au fonctionnement
const variablesRequises = ['API_KEY', 'DATABASE_URL'];

// On repère celles qui sont absentes ou vides
const manquantes = variablesRequises.filter((nom) => !process.env[nom]);

// Si au moins une manque, on arrête le programme avec un message explicite
if (manquantes.length > 0) {
    console.error('Configuration invalide. Variables manquantes :');
    for (const nom of manquantes) {
        console.error(`  - ${nom}`);
    }
    // process.exit(1) arrête le programme avec un code d'erreur
    process.exit(1);
}

export const config = {
    port: Number(process.env.PORT) || 3000,
    environnement: process.env.NODE_ENV || 'development',
    apiKey: process.env.API_KEY,
    databaseUrl: process.env.DATABASE_URL,
    estProduction: process.env.NODE_ENV === 'production'
};
```

Teste le comportement en lançant **sans** fichier `.env` :

```bash
node index.js
```

**Résultat attendu** :

```text
Configuration invalide. Variables manquantes :
  - API_KEY
  - DATABASE_URL
```

Le programme s'arrête immédiatement, ce qui est le comportement voulu.

---

### Étape 9 : Utiliser la configuration dans une API Express

Réunis tout dans une petite API Express qui lit son port et son environnement depuis la configuration. Installe Express :

```bash
npm install express@4
```

Crée `serveur.js` :

```javascript
// serveur.js - API Express configurée par l'environnement

import express from 'express';
import { config } from './config.js';

const app = express();

// Route qui renvoie l'environnement courant (jamais les secrets)
app.get('/', (req, res) => {
    res.json({
        message: 'Serveur opérationnel',
        environnement: config.environnement
    });
});

// Le port vient de la configuration, pas d'une valeur en dur
app.listen(config.port, () => {
    console.log(`Serveur démarré sur le port ${config.port} (${config.environnement})`);
});
```

Lance le serveur :

```bash
node --env-file=.env serveur.js
```

**Résultat attendu** :

```text
Serveur démarré sur le port 3000 (development)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `node --env-file=.env index.js` | Lance un script en chargeant `.env` (Node.js 22) |
| `node --env-file=.env.production index.js` | Charge un autre fichier d'environnement |
| `npm install dotenv` | Installe la bibliothèque `dotenv` (versions anciennes) |
| `cp .env.example .env` | Crée sa configuration locale à partir du modèle |
| `PORT=4000 node index.js` | Définit une variable directement à la ligne de commande |

---

## Pièges Fréquents

### Piège 1 : Committer le fichier .env

⚠️ **Problème** : Le fichier `.env` est ajouté à Git par mégarde, ce qui expose tous les secrets dans l'historique du dépôt.

✅ **Solution** : Ajoute `.env` à `.gitignore` **avant** le premier commit. Si le fichier a déjà été committé, retire-le du suivi :

```bash
# Retire .env du suivi Git sans supprimer le fichier local
git rm --cached .env
```

---

### Piège 2 : Traiter une variable comme un nombre sans la convertir

⚠️ **Problème** : `process.env.PORT` est la chaîne `"3000"`, pas le nombre `3000`. Une comparaison ou une addition donne un résultat inattendu.

```javascript
// "3000" + 1 donne "30001" (concaténation de chaînes), pas 3001
const portSuivant = process.env.PORT + 1;
```

✅ **Solution** : Convertis explicitement avec `Number()` :

```javascript
const portSuivant = Number(process.env.PORT) + 1; // 3001
```

---

### Piège 3 : Charger dotenv trop tard

⚠️ **Problème** : Avec `dotenv`, si tu lis `process.env` dans un module importé **avant** le chargement de `dotenv`, la variable est `undefined`.

✅ **Solution** : Place `import 'dotenv/config';` tout en haut du point d'entrée, avant tout autre import qui lit la configuration. L'option native `--env-file` évite ce piège, car le chargement a lieu avant l'exécution du code.

---

### Piège 4 : Mettre une vraie valeur dans .env.example

⚠️ **Problème** : Le fichier `.env.example` est versionné. Si tu y laisses une vraie clé d'API, elle se retrouve dans le dépôt, ce qui annule l'intérêt de la séparation.

✅ **Solution** : Dans `.env.example`, laisse les valeurs des secrets vides ou avec un texte indicatif (`API_KEY=`), jamais la vraie valeur.

---

## Checklist de Validation

- [ ] J'ai compris la différence entre une variable d'environnement et une variable JavaScript
- [ ] Je sais que toutes les valeurs de `process.env` sont des chaînes de caractères
- [ ] J'ai créé un fichier `.env` et je l'ai ajouté à `.gitignore`
- [ ] J'ai chargé mon `.env` avec `node --env-file=.env`
- [ ] J'ai un fichier `.env.example` versionné sans secrets
- [ ] Ma configuration est centralisée dans un module `config.js`
- [ ] Mon application s'arrête avec un message clair si une variable requise manque

---

## Exercice Pratique

**Énoncé** : Crée une petite API Express dont la configuration est entièrement pilotée par des variables d'environnement.

L'application doit :

1. Lire `PORT`, `NODE_ENV` et `WELCOME_MESSAGE` depuis l'environnement
2. Refuser de démarrer si `WELCOME_MESSAGE` est absent (message d'erreur clair, arrêt immédiat)
3. Exposer une route `GET /` qui renvoie le message d'accueil et l'environnement courant
4. Charger sa configuration via un module `config.js` dédié

**Indications** :

- Utilise `node --env-file=.env serveur.js` pour lancer.
- Convertis `PORT` en nombre avec une valeur par défaut de 3000.
- Pense à créer `.env` et à l'ajouter à `.gitignore`.

**Résultat attendu** :

Avec un `.env` complet, la requête `GET /` renvoie :

```json
{
  "message": "Bienvenue sur l'API",
  "environnement": "development"
}
```

Sans `WELCOME_MESSAGE`, le démarrage échoue avec un message indiquant la variable manquante.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**.env** :

```env
PORT=3000
NODE_ENV=development
WELCOME_MESSAGE=Bienvenue sur l'API
```

**.gitignore** :

```text
node_modules/
.env
```

**config.js** :

```javascript
// config.js - Configuration validée au démarrage

// Variable obligatoire pour cet exercice
const variablesRequises = ['WELCOME_MESSAGE'];

// Repère les variables absentes
const manquantes = variablesRequises.filter((nom) => !process.env[nom]);

// Arrête le programme si une variable requise manque
if (manquantes.length > 0) {
    console.error('Configuration invalide. Variables manquantes :');
    for (const nom of manquantes) {
        console.error(`  - ${nom}`);
    }
    process.exit(1);
}

export const config = {
    // Port converti en nombre, défaut 3000
    port: Number(process.env.PORT) || 3000,
    environnement: process.env.NODE_ENV || 'development',
    welcomeMessage: process.env.WELCOME_MESSAGE
};
```

**serveur.js** :

```javascript
// serveur.js - API Express pilotée par la configuration

import express from 'express';
import { config } from './config.js';

const app = express();

// Renvoie le message d'accueil et l'environnement courant
app.get('/', (req, res) => {
    res.json({
        message: config.welcomeMessage,
        environnement: config.environnement
    });
});

app.listen(config.port, () => {
    console.log(`Serveur démarré sur le port ${config.port}`);
});
```

**Lancement** :

```bash
node --env-file=.env serveur.js
```

**Test de la route** :

```bash
curl http://localhost:3000/
```

```json
{
  "message": "Bienvenue sur l'API",
  "environnement": "development"
}
```

**Test de l'échec** (lancer sans `.env`) :

```bash
node serveur.js
```

```text
Configuration invalide. Variables manquantes :
  - WELCOME_MESSAGE
```

---

## Navigation

← Fiche précédente : **[API REST avec Express](08-api-rest.md)**

→ Fiche suivante : **[Validation des entrées](10-validation-entrees.md)**
