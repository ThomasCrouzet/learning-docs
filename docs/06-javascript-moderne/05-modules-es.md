---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Comprendre les modules ES (import/export), les différences avec CommonJS et configurer Node.js pour ESM."
estimated_time: "75 min"
fiche_number: 5
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 05 - Modules ES (import/export)

> **En bref** : Comprendre le système de modules ES6 (import/export), les exports nommés et par défaut, l'import dynamique, et la configuration de Node.js pour utiliser ESM. Lecture estimée : 75 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)
- Fiche 04 : [Template literals et nouvelles méthodes](04-template-literals-methodes.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras organiser ton code en modules avec `import`/`export`, choisir entre export nommé et export par défaut, utiliser l'import dynamique, et configurer Node.js pour les modules ES.

---

## Concepts

### Qu'est-ce qu'un module ?

**Définition** : Un module est un fichier JavaScript qui exporte des valeurs (fonctions, classes, variables) et qui peut importer des valeurs d'autres modules. Chaque module a sa propre portée : les variables déclarées dans un module ne sont pas accessibles depuis un autre module, sauf si elles sont explicitement exportées.

**Le problème que les modules résolvent** :

Sans les modules, voici les problèmes rencontrés :

1. **Pollution globale** : toutes les variables sont dans le scope global, ce qui provoque des conflits de noms entre fichiers.
2. **Ordre de chargement** : il faut charger les fichiers `<script>` dans le bon ordre, sinon des erreurs surviennent.
3. **Pas d'encapsulation** : impossible de cacher des détails d'implémentation. Tout est public.
4. **Dépendances implicites** : on ne sait pas de quoi un fichier dépend sans lire tout le code.

**Comment les modules résolvent ces problèmes** :

| Problème | Solution apportée par les modules |
| -------- | --------------------------------- |
| Pollution globale | Chaque module a sa propre portée isolée |
| Ordre de chargement | Les imports déclarent explicitement les dépendances |
| Pas d'encapsulation | Seules les valeurs exportées sont accessibles |
| Dépendances implicites | L'instruction `import` liste les dépendances en haut du fichier |

**Analogie concrète** : Les modules sont comme des ateliers dans une usine. Chaque atelier (module) a ses propres outils et machines (variables et fonctions privées). Quand un atelier a besoin d'une pièce fabriquée par un autre, il la commande via un bon de commande (import). L'atelier fournisseur met la pièce sur un convoyeur (export). Personne n'entre dans l'atelier pour prendre les outils directement.

**Ce qu'un module n'est PAS** :

- Un module n'est pas un package npm. Un package est un ensemble de modules distribué via npm. Un module est un seul fichier.
- Un module n'est pas un namespace. Un namespace regroupe des noms dans un conteneur. Un module est un fichier avec sa propre portée.

---

Le diagramme suivant montre comment les fichiers modules s'importent entre eux pour construire l'application.

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-05-modules-es-1.html">Qu&#x27;est-ce qu&#x27;un module ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-05-modules-es-1.html" title="Qu&#x27;est-ce qu&#x27;un module ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Export nommé vs export par défaut

**Définition** : Il existe deux types d'exports en modules ES :

- **Export nommé** : on exporte une ou plusieurs valeurs avec leur nom. L'importeur doit utiliser le même nom (ou renommer avec `as`).
- **Export par défaut** : on exporte une seule valeur comme "valeur principale" du module. L'importeur peut lui donner n'importe quel nom.

**Comparaison export nommé vs export par défaut** :

| Export nommé | Export par défaut |
| ------------ | ----------------- |
| Plusieurs exports par module | Un seul export par défaut par module |
| `export const nom = ...` | `export default ...` |
| `import { nom } from "..."` | `import nom from "..."` |
| Accolades obligatoires à l'import | Pas d'accolades à l'import |
| Le nom doit correspondre (ou `as`) | Le nom est libre à l'import |
| Meilleur pour l'auto-complétion | Moins bon pour l'auto-complétion |

**Quand utiliser quoi** :

| Situation | Recommandation |
| --------- | -------------- |
| Fichier avec plusieurs fonctions utilitaires | Exports nommés |
| Fichier avec une seule classe ou fonction principale | Export par défaut |
| Bibliothèque avec API publique | Exports nommés (un fichier index regroupe tout) |
| Composant React/Vue (un par fichier) | Export par défaut |

---

### CommonJS vs ES Modules

**Définition** : CommonJS (CJS) est le système de modules historique de Node.js avec `require()` et `module.exports`. ES Modules (ESM) est le standard JavaScript avec `import`/`export`.

**Comparaison CommonJS vs ES Modules** :

| CommonJS (CJS) | ES Modules (ESM) |
| -------------- | ----------------- |
| `require("...")` | `import ... from "..."` |
| `module.exports = ...` | `export default ...` |
| `exports.nom = ...` | `export const nom = ...` |
| Chargement synchrone | Chargement asynchrone |
| Évaluation dynamique (à l'exécution) | Analyse statique (avant l'exécution) |
| Pas de tree-shaking | Supporte le tree-shaking |
| Extension `.js` ou `.cjs` | Extension `.mjs` ou `.js` avec `"type": "module"` |

**Tree-shaking** : c'est une optimisation qui supprime le code non utilisé lors du bundling. Les imports statiques d'ESM permettent aux outils de déterminer quels exports sont utilisés et de supprimer les autres.

---

## Étapes Pratiques

### Étape 1 : Configurer un projet Node.js pour ESM

Crée un dossier pour les modules :

```bash
# Crée le dossier du projet
mkdir -p ~/js-moderne/05-modules

# Crée un package.json minimal avec "type": "module"
# Cela indique à Node.js d'utiliser les ES Modules par défaut
cat > ~/js-moderne/05-modules/package.json << 'EOF'
{
  "name": "modules-es",
  "type": "module",
  "version": "1.0.0"
}
EOF
```

**Résultat attendu** :

```text
Le fichier package.json est créé avec "type": "module".
```

---

### Étape 2 : Créer un module avec des exports nommés

Crée le fichier `math.js` :

```javascript
// math.js - Module utilitaire de mathématiques
// Chaque fonction est exportée individuellement (export nommé)

// Export nommé : la fonction est disponible sous le nom "additionner"
export const additionner = (a, b) => a + b;

// Export nommé : la fonction est disponible sous le nom "soustraire"
export const soustraire = (a, b) => a - b;

// Export nommé : la fonction est disponible sous le nom "multiplier"
export const multiplier = (a, b) => a * b;

// Export nommé : la fonction est disponible sous le nom "diviser"
export const diviser = (a, b) => {
  if (b === 0) {
    throw new Error("Division par zéro impossible");
  }
  return a / b;
};

// Cette constante n'est PAS exportée - elle est privée au module
const VERSION = "1.0.0";

// On peut aussi exporter une variable privée explicitement
export const getVersion = () => VERSION;
```

Crée le fichier `main.js` :

```javascript
// main.js - Fichier principal qui importe depuis math.js

// Import nommé : on utilise des accolades et les noms exacts
import { additionner, multiplier, getVersion } from "./math.js";

console.log("Addition :", additionner(3, 5)); // 8
console.log("Multiplication :", multiplier(4, 6)); // 24
console.log("Version :", getVersion()); // "1.0.0"

// On peut renommer un import avec "as"
import { soustraire as minus } from "./math.js";
console.log("Soustraction :", minus(10, 3)); // 7

// On peut importer TOUT le module comme un objet
import * as math from "./math.js";
console.log("Division :", math.diviser(15, 3)); // 5
```

```bash
node ~/js-moderne/05-modules/main.js
```

**Résultat attendu** :

```text
Addition : 8
Multiplication : 24
Version : 1.0.0
Soustraction : 7
Division : 5
```

---

### Étape 3 : Créer un module avec un export par défaut

Crée le fichier `logger.js` :

```javascript
// logger.js - Module avec un export par défaut

// La classe Logger est l'export principal de ce module
class Logger {
  // Le constructeur reçoit un préfixe pour identifier la source des logs
  constructor(prefix = "APP") {
    this.prefix = prefix;
  }

  // Méthode pour afficher un message informatif
  info(message) {
    console.log(`[${this.prefix}] INFO: ${message}`);
  }

  // Méthode pour afficher un avertissement
  warn(message) {
    console.warn(`[${this.prefix}] WARN: ${message}`);
  }

  // Méthode pour afficher une erreur
  error(message) {
    console.error(`[${this.prefix}] ERROR: ${message}`);
  }
}

// Export par défaut : une seule valeur principale par module
export default Logger;

// On peut aussi avoir des exports nommés en plus de l'export par défaut
export const LOG_LEVELS = ["INFO", "WARN", "ERROR"];
```

Crée le fichier `app.js` :

```javascript
// app.js - Utilisation de l'export par défaut et des exports nommés

// Import par défaut : pas d'accolades, nom libre
// On aurait pu écrire : import MonLogger from "./logger.js"
import Logger from "./logger.js";

// Import nommé en plus de l'export par défaut
import { LOG_LEVELS } from "./logger.js";

// Ou les deux sur une seule ligne :
// import Logger, { LOG_LEVELS } from "./logger.js";

// Créer une instance du Logger
const log = new Logger("MonApp");

log.info("Application démarrée");
log.warn("Attention : mode développement");
log.error("Erreur simulée pour démonstration");

console.log("Niveaux disponibles :", LOG_LEVELS);
```

```bash
node ~/js-moderne/05-modules/app.js
```

**Résultat attendu** :

```text
[MonApp] INFO: Application démarrée
[MonApp] WARN: Attention : mode développement
[MonApp] ERROR: Erreur simulée pour démonstration
Niveaux disponibles : [ 'INFO', 'WARN', 'ERROR' ]
```

---

### Étape 4 : Exporter en fin de fichier

Crée le fichier `utils.js` :

```javascript
// utils.js - Exports groupés en fin de fichier
// Cette approche est une alternative aux exports inline

// Les fonctions sont déclarées normalement, sans "export"
const formaterPrix = (prix) => `${prix.toFixed(2)} €`;

const formaterDate = (date) => {
  const jour = String(date.getDate()).padStart(2, "0");
  const mois = String(date.getMonth() + 1).padStart(2, "0");
  const annee = date.getFullYear();
  return `${jour}/${mois}/${annee}`;
};

const tronquer = (texte, longueur = 50) => {
  if (texte.length <= longueur) return texte;
  return texte.slice(0, longueur) + "...";
};

// Exporter toutes les fonctions en une seule instruction
// C'est équivalent à mettre "export" devant chaque déclaration
export { formaterPrix, formaterDate, tronquer };
```

Crée le fichier `demo-utils.js` :

```javascript
// demo-utils.js - Utilisation des exports groupés
import { formaterPrix, formaterDate, tronquer } from "./utils.js";

console.log(formaterPrix(42.5)); // "42.50 €"
console.log(formaterDate(new Date(2025, 0, 15))); // "15/01/2025"
console.log(tronquer("Ceci est un texte très long qui dépasse la limite", 30));
// "Ceci est un texte très long qu..."
```

```bash
node ~/js-moderne/05-modules/demo-utils.js
```

**Résultat attendu** :

```text
42.50 €
15/01/2025
Ceci est un texte très long qu...
```

---

### Étape 5 : Ré-exporter depuis un fichier index

Crée un fichier `index.js` qui regroupe les exports :

```javascript
// index.js - Point d'entrée qui ré-exporte depuis les sous-modules
// Ce pattern est courant pour créer une "API publique" d'un dossier

// Ré-exporter les exports nommés de math.js
export { additionner, soustraire, multiplier, diviser } from "./math.js";

// Ré-exporter l'export par défaut de logger.js comme export nommé
export { default as Logger } from "./logger.js";

// Ré-exporter tout de utils.js
export * from "./utils.js";
```

Crée le fichier `demo-index.js` :

```javascript
// demo-index.js - Import depuis le fichier index
// Au lieu d'importer depuis chaque fichier séparément,
// on importe tout depuis index.js

import {
  additionner,
  Logger,
  formaterPrix,
  formaterDate,
} from "./index.js";

console.log("2 + 3 =", additionner(2, 3));
console.log("Prix :", formaterPrix(99.9));
console.log("Date :", formaterDate(new Date()));

const log = new Logger("DEMO");
log.info("Import centralisé fonctionnel");
```

```bash
node ~/js-moderne/05-modules/demo-index.js
```

**Résultat attendu** :

```text
2 + 3 = 5
Prix : 99.90 €
Date : [date du jour au format JJ/MM/AAAA]
[DEMO] INFO: Import centralisé fonctionnel
```

---

### Étape 6 : Import dynamique

```javascript
// demo-dynamique.js - Import dynamique avec import()
// L'import dynamique charge un module à la demande (lazy loading)
// Il retourne une Promise

const moduleName = "./math.js";

// import() retourne une Promise qui résout le module
const chargerModule = async () => {
  console.log("Chargement du module math...");

  // import() est une fonction (pas un mot-clé comme l'import statique)
  const math = await import(moduleName);

  console.log("Module chargé !");
  console.log("3 + 7 =", math.additionner(3, 7));
  console.log("10 / 2 =", math.diviser(10, 2));
};

// Import conditionnel (utile pour charger un module selon une condition)
const mode = "production";
const chargerConfig = async () => {
  let config;
  if (mode === "production") {
    // Ce module n'est chargé QUE si on est en production
    config = { debug: false, logLevel: "error" };
    console.log("Config production chargée");
  } else {
    config = { debug: true, logLevel: "debug" };
    console.log("Config développement chargée");
  }
  return config;
};

// Exécution
chargerModule();
chargerConfig().then((config) => console.log("Config :", config));
```

```bash
node ~/js-moderne/05-modules/demo-dynamique.js
```

**Résultat attendu** :

```text
Chargement du module math...
Module chargé !
3 + 7 = 10
10 / 2 = 5
Config production chargée
Config : { debug: false, logLevel: 'error' }
```

---

### Étape 7 : Configurer Node.js pour ESM sans package.json

```javascript
// Si tu ne veux pas modifier package.json, tu peux :
// 1. Utiliser l'extension .mjs au lieu de .js
// 2. Ou ajouter "type": "module" dans package.json (méthode recommandée)

// Fichier: demo.mjs (l'extension .mjs force le mode ESM)
// node demo.mjs
```

Crée un fichier `demo.mjs` pour tester :

```javascript
// demo.mjs - Le .mjs force le mode ESM même sans package.json
import { additionner } from "./math.js";

console.log("Depuis un .mjs :", additionner(100, 200));
```

```bash
node ~/js-moderne/05-modules/demo.mjs
```

**Résultat attendu** :

```text
Depuis un .mjs : 300
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `export const nom = ...` | Export nommé inline |
| `export default ...` | Export par défaut |
| `export { a, b, c }` | Exports groupés en fin de fichier |
| `import { nom } from "./fichier.js"` | Import nommé |
| `import Nom from "./fichier.js"` | Import par défaut |
| `import * as mod from "./fichier.js"` | Import de tout le module |
| `import { a as b } from "./fichier.js"` | Import avec renommage |
| `const mod = await import("./fichier.js")` | Import dynamique |
| `export { default as Nom } from "./fichier.js"` | Ré-export |

---

## Pièges Fréquents

### Piège 1 : Oublier l'extension `.js` dans les imports

**Problème** : Tu écris `import { fn } from "./math"` sans l'extension, et Node.js renvoie une erreur.

**Solution** : En mode ESM, Node.js exige l'extension de fichier dans les imports. Écris toujours `"./math.js"`.

```javascript
// ❌ Erreur en ESM Node.js
// import { fn } from "./math";

// ✅ Extension obligatoire
import { fn } from "./math.js";
```

---

### Piège 2 : Mélanger `require` et `import`

**Problème** : Tu utilises `require()` dans un fichier ESM ou `import` dans un fichier CommonJS.

**Solution** : Ne mélange pas les deux systèmes dans un même fichier. Si tu as `"type": "module"` dans `package.json`, utilise `import`/`export` partout. Pour utiliser un module CommonJS depuis ESM, utilise `import` (Node.js le gère automatiquement pour les modules par défaut).

---

### Piège 3 : Oublier les accolades pour les imports nommés

**Problème** : Tu écris `import additionner from "./math.js"` au lieu de `import { additionner } from "./math.js"`.

**Solution** : Sans accolades, c'est un import par défaut. Avec accolades, c'est un import nommé. Vérifie le type d'export du module source.

```javascript
// Module qui exporte nommé
export const additionner = (a, b) => a + b;

// ❌ Import par défaut (cherche un export default qui n'existe pas)
// import additionner from "./math.js"; // undefined

// ✅ Import nommé (avec accolades)
import { additionner } from "./math.js";
```

---

### Piège 4 : Les imports circulaires

**Problème** : Le module A importe B, et le module B importe A. Cela peut causer des valeurs `undefined` au moment de l'exécution.

**Solution** : Évite les imports circulaires en restructurant ton code. Déplace les dépendances partagées dans un troisième module.

---

## Checklist de Validation

- [ ] Je sais configurer Node.js pour utiliser ESM (`"type": "module"` ou `.mjs`)
- [ ] Je sais créer des exports nommés et des exports par défaut
- [ ] Je sais importer des exports nommés (avec accolades) et par défaut (sans accolades)
- [ ] Je sais renommer un import avec `as`
- [ ] Je sais importer tout un module avec `* as`
- [ ] Je sais utiliser l'import dynamique `import()` pour le chargement à la demande
- [ ] Je sais ré-exporter depuis un fichier index
- [ ] Je comprends la différence entre CommonJS et ES Modules

---

## Exercice Pratique

**Énoncé** : Crée un mini-système de gestion de tâches organisé en modules.

1. Crée un module `tache.js` qui exporte une fonction `creerTache(titre, priorite)` retournant un objet `{ id, titre, priorite, fait, creeLe }`.
2. Crée un module `stockage.js` qui exporte des fonctions pour gérer un tableau de tâches en mémoire : `ajouterTache(tache)`, `supprimerTache(id)`, `listerTaches()`, `marquerFaite(id)`.
3. Crée un module `affichage.js` qui exporte par défaut une fonction pour afficher les tâches formatées.
4. Crée un fichier `index.js` qui ré-exporte tout.
5. Crée un fichier `demo-taches.js` qui importe depuis `index.js` et exécute un scénario de test.

**Indications** :

- Utilise un compteur d'ID auto-incrémenté dans `tache.js`.
- Utilise un tableau privé (non exporté) dans `stockage.js`.
- Utilise des template literals pour l'affichage.

**Résultat attendu** :

```text
=== Liste des tâches ===
[1] ☐ Apprendre les modules ES (priorité: haute)
[2] ☐ Faire l'exercice pratique (priorité: moyenne)
[3] ☐ Relire la fiche (priorité: basse)

Tâche 1 marquée comme faite.
Tâche 3 supprimée.

=== Liste mise à jour ===
[1] ✓ Apprendre les modules ES (priorité: haute)
[2] ☐ Faire l'exercice pratique (priorité: moyenne)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier `tache.js`** :

```javascript
// tache.js - Module de création de tâches
let compteurId = 0;

export const creerTache = (titre, priorite = "moyenne") => {
  compteurId++;
  return {
    id: compteurId,
    titre,
    priorite,
    fait: false,
    creeLe: new Date(),
  };
};
```

**Fichier `stockage.js`** :

```javascript
// stockage.js - Module de stockage des tâches en mémoire
const taches = []; // Tableau privé, non exporté

export const ajouterTache = (tache) => {
  taches.push(tache);
};

export const supprimerTache = (id) => {
  const index = taches.findIndex((t) => t.id === id);
  if (index !== -1) {
    taches.splice(index, 1);
    return true;
  }
  return false;
};

export const marquerFaite = (id) => {
  const tache = taches.find((t) => t.id === id);
  if (tache) {
    tache.fait = true;
    return true;
  }
  return false;
};

export const listerTaches = () => [...taches]; // Retourne une copie
```

**Fichier `affichage.js`** :

```javascript
// affichage.js - Module d'affichage
const afficherTaches = (taches, titre = "Liste des tâches") => {
  console.log(`=== ${titre} ===`);
  if (taches.length === 0) {
    console.log("Aucune tâche.");
    return;
  }
  taches.forEach(({ id, titre, priorite, fait }) => {
    const statut = fait ? "✓" : "☐";
    console.log(`[${id}] ${statut} ${titre} (priorité: ${priorite})`);
  });
};

export default afficherTaches;
```

**Fichier `index.js`** :

```javascript
// index.js - Ré-exporte l'API publique des modules
export { creerTache } from "./tache.js";
export {
  ajouterTache,
  supprimerTache,
  marquerFaite,
  listerTaches,
} from "./stockage.js";
export { default as afficherTaches } from "./affichage.js";
```

**Fichier `demo-taches.js`** :

```javascript
// demo-taches.js - Scénario de test
import {
  creerTache,
  ajouterTache,
  supprimerTache,
  marquerFaite,
  listerTaches,
  afficherTaches,
} from "./index.js";

// Ajouter des tâches
ajouterTache(creerTache("Apprendre les modules ES", "haute"));
ajouterTache(creerTache("Faire l'exercice pratique", "moyenne"));
ajouterTache(creerTache("Relire la fiche", "basse"));

// Afficher
afficherTaches(listerTaches());

// Modifier
console.log("\nTâche 1 marquée comme faite.");
marquerFaite(1);
console.log("Tâche 3 supprimée.");
supprimerTache(3);

// Afficher la liste mise à jour
console.log();
afficherTaches(listerTaches(), "Liste mise à jour");
```

---

## Pour aller plus loin

### Import attributes (ES2025)

ES2025 introduit les **import attributes** (syntaxe `with { type: "..." }`), qui permettent d'importer des ressources non-JavaScript de manière explicite. Ils remplacent l'ancienne syntaxe `assert` (ES2023).

```javascript
// Importer du JSON explicitement (ES2025, Node.js 22+)
import config from "./config.json" with { type: "json" };

// Importer un module CSS (navigateur moderne)
import styles from "./styles.css" with { type: "css" };
```

> **Disponibilité** : Node.js 22.12+ a rendu les import attributes stables, et **seul** `type: "json"` est supporté côté Node (voir `esm.html` Import attributes). `type: "css"` est une API navigateur, pas Node. Node 22.0.0 a retiré les import assertions (`assert`), remplacées par `with`.

---

## Navigation

← Fiche précédente : **[Template literals et nouvelles méthodes](04-template-literals-methodes.md)**

→ Fiche suivante : **[Classes ES6](06-classes-es6.md)**
