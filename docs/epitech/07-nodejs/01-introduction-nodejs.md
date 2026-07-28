---
tags:
  - Node.js
  - Débutant
  - Concept
description: "Introduction à Node.js"
estimated_time: "55 min"
fiche_number: 1
total_fiches: 10
cursus: "Node.js"
---

# 01 - Introduction à Node.js

> **En bref** : À la fin de cette fiche, tu sauras installer Node.js, comprendre la différence avec JavaScript dans le navigateur, et exécuter ton premier script. Lecture estimée : 55 min.


## Prérequis

- Fiche [05-javascript/01 - Introduction à JavaScript](../05-javascript/01-introduction-js.md)
- Fiche [05-javascript/02 - Variables et fonctions](../05-javascript/02-variables-fonctions.md)
- Savoir utiliser le terminal (ligne de commande)

## Version de Node.js

Cette documentation utilise **Node.js 22 LTS** (Long Term Support), supporté jusqu'en avril 2027.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer Node.js, comprendre la différence avec JavaScript dans le navigateur, et exécuter ton premier script.

---

## Concepts

### Qu'est-ce que Node.js ?

**Définition** : Node.js est un environnement d'exécution qui permet d'exécuter du JavaScript en dehors du navigateur, directement sur ton ordinateur ou un serveur.

**Le problème que Node.js résout** :

Sans Node.js, voici les problèmes rencontrés :

1. **JavaScript limité au navigateur** : JavaScript ne pouvait s'exécuter que dans un navigateur web.
2. **Impossible de créer des serveurs** : Pour créer un backend, il fallait utiliser PHP, Python ou Java.
3. **Pas d'accès au système** : JavaScript ne pouvait pas lire des fichiers ou accéder à la base de données.

**Comment Node.js résout ces problèmes** :

| Problème | Solution apportée par Node.js |
| -------- | ----------------------------- |
| JS limité au navigateur | Exécute JS sur n'importe quel ordinateur |
| Impossible de créer des serveurs | Permet de créer des applications backend |
| Pas d'accès au système | Donne accès aux fichiers, réseau, base de données |

**Analogie concrète** : JavaScript dans le navigateur, c'est comme un cuisinier qui ne peut travailler que dans une cuisine de restaurant spécifique. Node.js, c'est donner à ce cuisinier une cuisine portable qu'il peut installer n'importe où : chez lui, dans un food truck, ou dans un autre restaurant.

**Ce que Node.js n'est PAS** :

- Node.js n'est pas un langage de programmation. C'est un environnement qui exécute JavaScript.
- Node.js n'est pas un framework. C'est une plateforme sur laquelle on peut utiliser des frameworks comme Express.

**Comparaison : JavaScript navigateur vs Node.js** :

| JavaScript navigateur | Node.js |
| --------------------- | ------- |
| S'exécute dans Chrome, Firefox... | S'exécute sur ton ordinateur/serveur |
| Accès au DOM (document) | Pas de DOM |
| Accès à window, alert() | Pas de window, pas d'alert() |
| Ne peut pas lire de fichiers | Peut lire/écrire des fichiers |
| Sert à rendre les pages interactives | Sert à créer des serveurs, des scripts |

---

### Le moteur V8

**Définition** : V8 est le moteur JavaScript créé par Google pour Chrome. Node.js utilise ce même moteur pour exécuter JavaScript.

**Pourquoi c'est important** :

- V8 est très rapide
- Le même code JavaScript fonctionne dans Chrome et dans Node.js
- Les mises à jour de V8 améliorent les performances de Node.js

---

### REPL : tester du code rapidement

**Définition** : REPL signifie Read-Eval-Print-Loop. C'est un mode interactif qui permet de taper du code et voir immédiatement le résultat.

**Comment y accéder** : Tape `node` dans le terminal sans argument.

```bash
node
```

**Résultat** :

```text
Welcome to Node.js v22.x.x
Type ".help" for more information.
>
```

Le symbole `>` indique que Node.js attend une commande.

**Commandes REPL utiles** :

| Commande | Action |
| -------- | ------ |
| `.exit` | Quitter le REPL |
| `.help` | Afficher l'aide |
| Ctrl+C (deux fois) | Quitter le REPL |
| Flèche haut | Rappeler la commande précédente |

---

## Étapes Pratiques

### Étape 1 : Vérifier si Node.js est installé

Ouvre un terminal et tape :

```bash
node --version
```

**Si Node.js est installé**, tu verras :

```text
v22.x.x
```

**Si Node.js n'est pas installé**, tu verras une erreur comme :

```text
command not found: node
```

Dans ce cas, passe à l'étape 2.

---

### Étape 2 : Installer Node.js

**Sur macOS** (avec Homebrew) :

```bash
brew install node@20
```

**Sur Linux (Ubuntu/Debian)** :

```bash
# Ajouter le dépôt NodeSource
curl -fsSL https://deb.nodesource.com/setup_22.x | sudo -E bash -

# Installer Node.js
sudo apt-get install -y nodejs
```

**Sur Windows** :

1. Va sur le site officiel : <https://nodejs.org>
2. Télécharge la version LTS (20.x)
3. Exécute l'installateur
4. Coche "Add to PATH" pendant l'installation

**Vérifier l'installation** :

```bash
node --version
npm --version
```

**Résultat attendu** :

```text
v22.x.x
10.x.x
```

`npm` est le gestionnaire de packages, installé automatiquement avec Node.js.

---

### Étape 3 : Utiliser le REPL

Lance le REPL :

```bash
node
```

Tape ces commandes une par une :

```javascript
> 2 + 2
4
> let nom = "Alice"
undefined
> console.log("Bonjour " + nom)
Bonjour Alice
undefined
> .exit
```

Le mot `undefined` apparaît quand une instruction ne retourne pas de valeur (comme `let` ou `console.log`).

---

### Étape 4 : Créer ton premier script

Crée un dossier pour tes projets Node.js :

```bash
mkdir mon-projet-node
cd mon-projet-node
```

Crée un fichier `index.js` :

```javascript
// index.js - Mon premier script Node.js

// Afficher un message
console.log("Hello depuis Node.js!");

// Les variables fonctionnent comme dans le navigateur
let langage = "JavaScript";
let environnement = "Node.js";

console.log("Je code en " + langage + " avec " + environnement);

// Les calculs aussi
let resultat = 10 * 5;
console.log("10 x 5 =", resultat);

// Afficher des informations sur Node.js
console.log("Version de Node.js:", process.version);
console.log("Système d'exploitation:", process.platform);
```

---

### Étape 5 : Exécuter le script

Dans le terminal, depuis le dossier du projet :

```bash
node index.js
```

**Résultat attendu** :

```text
Hello depuis Node.js!
Je code en JavaScript avec Node.js
10 x 5 = 50
Version de Node.js: v22.x.x
Système d'exploitation: darwin
```

(Le système d'exploitation affichera `darwin` sur Mac, `linux` sur Linux, `win32` sur Windows)

---

### Étape 6 : Découvrir l'objet process

L'objet `process` est disponible uniquement dans Node.js (pas dans le navigateur). Il donne des informations sur le processus en cours.

Crée un fichier `process-demo.js` :

```javascript
// process-demo.js - Explorer l'objet process

// Version de Node.js
console.log("Version:", process.version);

// Répertoire de travail actuel
console.log("Répertoire actuel:", process.cwd());

// Identifiant du processus
console.log("PID:", process.pid);

// Arguments de la ligne de commande
console.log("Arguments:", process.argv);

// Variables d'environnement (quelques exemples)
console.log("HOME:", process.env.HOME);
console.log("PATH existe:", process.env.PATH ? "oui" : "non");
```

Exécute-le :

```bash
node process-demo.js
```

**Résultat attendu** (les valeurs varient selon ton système) :

```text
Version: v22.x.x
Répertoire actuel: /chemin/vers/mon-projet-node
PID: 12345
Arguments: [ '/usr/local/bin/node', '/chemin/vers/process-demo.js' ]
HOME: /Users/ton-utilisateur
PATH existe: oui
```

---

## Commandes Utiles

| Commande | Description |
| -------- | ----------- |
| `node --version` | Affiche la version de Node.js |
| `node` | Lance le REPL interactif |
| `node fichier.js` | Exécute un fichier JavaScript |
| `node -e "code"` | Exécute du code directement |

---

## Objets globaux Node.js

Ces objets sont disponibles partout dans Node.js :

| Objet | Description |
| ----- | ----------- |
| `process` | Informations sur le processus en cours |
| `console` | Méthodes pour afficher dans le terminal |
| `__dirname` | Chemin absolu du dossier du script |
| `__filename` | Chemin absolu du fichier en cours |
| `global` | Équivalent de `window` dans le navigateur |

**Exemple** :

```javascript
console.log("Fichier:", __filename);
console.log("Dossier:", __dirname);
```

---

## Pièges Fréquents

### Piège 1 : Chercher window ou document

⚠️ **Problème** : `window.alert("Hello")` ou `document.getElementById()` provoquent une erreur dans Node.js.

✅ **Solution** : Ces objets n'existent que dans le navigateur. Dans Node.js, utilise `console.log()` pour afficher.

```javascript
// ❌ Ne fonctionne PAS dans Node.js
alert("Hello");
document.write("Hello");

// ✅ Fonctionne dans Node.js
console.log("Hello");
```

---

### Piège 2 : Confondre node et nodejs

⚠️ **Problème** : Sur certains systèmes Linux anciens, la commande s'appelle `nodejs` au lieu de `node`.

✅ **Solution** : Vérifie avec `which node` et `which nodejs`. Utilise celui qui existe.

---

### Piège 3 : Oublier l'extension .js

⚠️ **Problème** : `node index` ne trouve pas le fichier.

✅ **Solution** : Spécifie l'extension complète : `node index.js`.

---

### Piège 4 : Mauvais répertoire

⚠️ **Problème** : `Error: Cannot find module` quand tu exécutes ton script.

✅ **Solution** : Vérifie que tu es dans le bon dossier avec `pwd` et `ls`.

```bash
pwd                  # Affiche le répertoire actuel
ls                   # Liste les fichiers
node index.js        # Exécute le script
```

---

## Checklist de Validation

- [ ] J'ai vérifié ma version de Node.js avec `node --version`
- [ ] Je sais utiliser le REPL (mode interactif)
- [ ] J'ai créé et exécuté un fichier `.js` avec Node.js
- [ ] Je comprends que `window` et `document` n'existent pas dans Node.js
- [ ] Je sais utiliser `process.version` et `process.cwd()`

---

## Exercice Pratique

**Énoncé** : Crée un script `info-systeme.js` qui affiche :

1. Un message de bienvenue avec ton prénom
2. La version de Node.js
3. Le système d'exploitation
4. Le répertoire de travail actuel
5. La date et l'heure actuelles

**Indications** :

- Utilise `process.version`, `process.platform`, `process.cwd()`
- Pour la date, utilise `new Date().toLocaleString()`

**Résultat attendu** (exemple) :

```text
=== Informations Système ===
Bienvenue Alice!
Version Node.js: v22.x.x
OS: darwin
Répertoire: /Users/alice/mon-projet-node
Date: 23/01/2025, 14:30:00
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// info-systeme.js

// Afficher un titre
console.log("=== Informations Système ===");

// Message de bienvenue (remplace par ton prénom)
let prenom = "Alice";
console.log("Bienvenue " + prenom + "!");

// Version de Node.js
console.log("Version Node.js:", process.version);

// Système d'exploitation
console.log("OS:", process.platform);

// Répertoire de travail
console.log("Répertoire:", process.cwd());

// Date et heure actuelles
let maintenant = new Date();
console.log("Date:", maintenant.toLocaleString());
```

Exécution :

```bash
node info-systeme.js
```

---

## Navigation

→ Fiche suivante : **[npm et gestion des packages](02-npm-packages.md)**
