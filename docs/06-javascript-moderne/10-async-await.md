---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Maîtriser async/await, try/catch, l'exécution parallèle avec Promise.all et les erreurs courantes."
estimated_time: "90 min"
fiche_number: 10
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 10 - Async/await

> **En bref** : Maîtriser la syntaxe `async`/`await` pour écrire du code asynchrone lisible, gérer les erreurs avec `try`/`catch`, exécuter des Promises en parallèle et éviter les erreurs courantes. Lecture estimée : 90 min.

## Prérequis

- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 09 : [Promises](09-promises.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire des fonctions `async`, utiliser `await` pour attendre des Promises, gérer les erreurs avec `try`/`catch`, combiner `async`/`await` avec `Promise.all`, et éviter les erreurs classiques comme `await` dans un `forEach`.

---

## Concepts

### Qu'est-ce que `async`/`await` ?

**Définition** : `async`/`await` est une syntaxe introduite en ES2017 qui permet d'écrire du code asynchrone de manière synchrone (linéaire). `async` déclare une fonction asynchrone, et `await` suspend l'exécution jusqu'à ce qu'une Promise soit résolue.

**Le problème que `async`/`await` résout** :

Sans `async`/`await`, voici les problèmes rencontrés :

1. **Chaînes de `.then()` longues** : même avec le chaînage, le code asynchrone avec Promises reste verbeux.
2. **Gestion d'erreurs fragmentée** : chaque `.catch()` gère un sous-ensemble d'erreurs, ce qui rend le flux difficile à suivre.
3. **Logique conditionnelle complexe** : faire un `if` basé sur le résultat d'une Promise nécessite des `.then()` imbriqués.

**Comment `async`/`await` résout ces problèmes** :

| Problème | Solution apportée par `async`/`await` |
| -------- | ------------------------------------- |
| Chaînes de `.then()` | Code linéaire avec `await`, comme du code synchrone |
| Gestion d'erreurs fragmentée | `try`/`catch` standard, comme pour du code synchrone |
| Logique conditionnelle | `if`/`else` classique après `await` |

**Analogie concrète** : Avec les Promises et `.then()`, tu donnes une liste d'instructions à quelqu'un : "Quand tu as le résultat A, fais B, puis quand B est fait, fais C." Avec `async`/`await`, tu fais les choses toi-même, étape par étape : "J'attends A. Maintenant je fais B. Maintenant j'attends C." C'est plus naturel et plus lisible.

**Ce que `async`/`await` n'est PAS** :

- `async`/`await` ne rend pas le code synchrone. Il reste asynchrone sous le capot. `await` suspend uniquement la fonction `async` courante, pas le reste du programme.
- `async`/`await` n'est pas un remplacement des Promises. C'est du sucre syntaxique au-dessus des Promises. Toute fonction `async` retourne une Promise.

---

Le diagramme suivant illustre le flux d'exécution d'une fonction async/await, incluant la suspension et la gestion d'erreur.

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-10-async-await-1.html">Qu&#x27;est-ce que `async`/`await` ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-10-async-await-1.html" title="Qu&#x27;est-ce que `async`/`await` ?" style="width:100%;min-height:596px;border:0;background:transparent"></iframe>
</div>

### La syntaxe `async`

**Définition** : Le mot-clé `async` devant une fonction la transforme en fonction asynchrone. Une fonction `async` retourne toujours une Promise.

```javascript
// Fonction async - retourne toujours une Promise
async function direBonjour() {
  return "Bonjour !";
}

// Équivalent sans async :
// function direBonjour() {
//   return Promise.resolve("Bonjour !");
// }

// Arrow function async
const direAuRevoir = async () => "Au revoir !";

// Le résultat est une Promise
direBonjour().then((message) => console.log(message)); // "Bonjour !"
```

---

### La syntaxe `await`

**Définition** : Le mot-clé `await` suspend l'exécution de la fonction `async` courante jusqu'à ce que la Promise soit résolue. Il retourne la valeur résolue de la Promise.

```javascript
// await attend que la Promise soit résolue
async function chargerDonnees() {
  console.log("Début du chargement");

  // await suspend l'exécution ici jusqu'à ce que la Promise soit résolue
  const resultat = await maPromise;

  // Cette ligne ne s'exécute qu'après la résolution de maPromise
  console.log("Données reçues :", resultat);
  return resultat;
}
```

**Règle** : `await` ne peut être utilisé que dans une fonction `async`, ou au niveau supérieur d'un module ESM (top-level await, supporté par Node.js moderne et les navigateurs récents).

---

### Gestion d'erreurs avec `try`/`catch`

**Définition** : Dans une fonction `async`, les erreurs de Promises rejetées sont capturées par `try`/`catch`, exactement comme les erreurs synchrones.

```javascript
async function chargerAvecErreur() {
  try {
    const donnees = await recupererDonnees(); // Peut rejeter
    const traitees = await traiterDonnees(donnees); // Peut rejeter
    return traitees;
  } catch (erreur) {
    // Attrape l'erreur de N'IMPORTE QUEL await ci-dessus
    console.error("Erreur :", erreur.message);
    return null; // Valeur de secours
  } finally {
    console.log("Chargement terminé");
  }
}
```

**Comparaison `.then()/.catch()` vs `async`/`await`** :

| `.then()/.catch()` | `async`/`await` |
| ------------------- | --------------- |
| `promise.then(fn).catch(fn)` | `try { await promise } catch (e) {}` |
| Chaînage fonctionnel | Code linéaire |
| Erreurs dans `.catch()` | Erreurs dans `catch` |
| `.finally()` | `finally {}` |

---

## Étapes Pratiques

### Étape 1 : Première fonction async/await

Crée le fichier `10-async-await.js` :

```javascript
// Simuler une opération asynchrone
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const recupererUtilisateur = async (id) => {
  // Simuler un délai réseau
  await attendre(100);
  return { id, nom: "Alice", email: "alice@example.com" };
};

// Fonction async qui utilise await
async function main() {
  console.log("Début du chargement...");

  // await suspend l'exécution jusqu'à la résolution
  const utilisateur = await recupererUtilisateur(42);
  console.log("Utilisateur :", utilisateur);

  console.log("Fin du chargement");
}

// Appeler la fonction async
main();
console.log("Cette ligne s'affiche AVANT 'Fin' car main() est async");
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
Début du chargement...
Cette ligne s'affiche AVANT 'Fin' car main() est async
Utilisateur : { id: 42, nom: 'Alice', email: 'alice@example.com' }
Fin du chargement
```

---

### Étape 2 : Chaîner des opérations avec await

```javascript
// Simuler des fonctions d'accès aux données
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const recupererUtilisateur = async (id) => {
  await attendre(100);
  return { id, nom: "Alice" };
};

const recupererCommandes = async (userId) => {
  await attendre(100);
  return [
    { id: 1, userId, produit: "Clavier", montant: 49.99 },
    { id: 2, userId, produit: "Souris", montant: 29.99 },
  ];
};

const calculerTotal = async (commandes) => {
  await attendre(50);
  return commandes.reduce((acc, c) => acc + c.montant, 0);
};

// Chaîne d'opérations - code linéaire et lisible
async function afficherFacture() {
  // Chaque await attend le résultat avant de continuer
  const utilisateur = await recupererUtilisateur(42);
  console.log(`Client : ${utilisateur.nom}`);

  const commandes = await recupererCommandes(utilisateur.id);
  console.log(`Commandes : ${commandes.length}`);
  commandes.forEach((c) => console.log(`  - ${c.produit} : ${c.montant} €`));

  const total = await calculerTotal(commandes);
  console.log(`Total : ${total.toFixed(2)} €`);
}

afficherFacture();
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
Client : Alice
Commandes : 2
  - Clavier : 49.99 €
  - Souris : 29.99 €
Total : 79.98 €
```

---

### Étape 3 : Gestion d'erreurs avec try/catch

```javascript
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fonction qui peut échouer
const recupererDonnees = async (url) => {
  await attendre(100);
  if (url.includes("erreur")) {
    throw new Error(`Impossible de charger ${url}`);
  }
  return { url, donnees: "contenu" };
};

// Gestion d'erreurs avec try/catch
async function charger() {
  // Première tentative : succès
  try {
    const result1 = await recupererDonnees("/api/users");
    console.log("Succès :", result1);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  }

  // Deuxième tentative : échec
  try {
    const result2 = await recupererDonnees("/api/erreur");
    console.log("Succès :", result2);
  } catch (erreur) {
    console.error("Erreur :", erreur.message);
  } finally {
    console.log("Chargement terminé (finally)");
  }
}

charger();
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
Succès : { url: '/api/users', donnees: 'contenu' }
Erreur : Impossible de charger /api/erreur
Chargement terminé (finally)
```

---

### Étape 4 : Exécution parallèle avec Promise.all + await

```javascript
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const chargerRessource = async (nom, delai) => {
  await attendre(delai);
  return `${nom} chargé (${delai}ms)`;
};

async function main() {
  // ❌ Séquentiel : chaque await attend le précédent
  console.log("=== Séquentiel ===");
  const debut1 = Date.now();
  const a = await chargerRessource("A", 200);
  const b = await chargerRessource("B", 200);
  const c = await chargerRessource("C", 200);
  console.log(`Durée : ~${Date.now() - debut1}ms (3 x 200ms)`);
  console.log(a, b, c);

  // ✅ Parallèle : toutes les Promises démarrent en même temps
  console.log("\n=== Parallèle ===");
  const debut2 = Date.now();
  const [x, y, z] = await Promise.all([
    chargerRessource("X", 200),
    chargerRessource("Y", 200),
    chargerRessource("Z", 200),
  ]);
  console.log(`Durée : ~${Date.now() - debut2}ms (max 200ms)`);
  console.log(x, y, z);
}

main();
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
=== Séquentiel ===
Durée : ~600ms (3 x 200ms)
A chargé (200ms) B chargé (200ms) C chargé (200ms)

=== Parallèle ===
Durée : ~200ms (max 200ms)
X chargé (200ms) Y chargé (200ms) Z chargé (200ms)
```

---

### Étape 5 : Boucles async correctes

```javascript
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const traiterElement = async (element) => {
  await attendre(100);
  return element.toUpperCase();
};

const elements = ["alpha", "beta", "gamma", "delta"];

async function main() {
  // ❌ forEach avec await : NE FONCTIONNE PAS
  // forEach ne comprend pas les Promises, il n'attend pas
  console.log("=== forEach (ne fonctionne PAS) ===");
  const resultats1 = [];
  elements.forEach(async (el) => {
    const resultat = await traiterElement(el);
    resultats1.push(resultat);
  });
  // Le tableau est vide car forEach n'attend pas les Promises
  console.log("Résultats forEach :", resultats1); // [] - vide !

  // Attendre un peu pour laisser les Promises se résoudre
  await attendre(500);
  console.log("Résultats forEach (après attente) :", resultats1); // Rempli maintenant

  // ✅ for...of avec await : traitement séquentiel
  console.log("\n=== for...of (séquentiel) ===");
  const resultats2 = [];
  for (const el of elements) {
    const resultat = await traiterElement(el);
    resultats2.push(resultat);
  }
  console.log("Résultats for...of :", resultats2);

  // ✅ Promise.all + map : traitement parallèle
  console.log("\n=== Promise.all + map (parallèle) ===");
  const resultats3 = await Promise.all(
    elements.map((el) => traiterElement(el))
  );
  console.log("Résultats Promise.all :", resultats3);
}

main();
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
=== forEach (ne fonctionne PAS) ===
Résultats forEach : []
Résultats forEach (après attente) : [ 'ALPHA', 'BETA', 'GAMMA', 'DELTA' ]

=== for...of (séquentiel) ===
Résultats for...of : [ 'ALPHA', 'BETA', 'GAMMA', 'DELTA' ]

=== Promise.all + map (parallèle) ===
Résultats Promise.all : [ 'ALPHA', 'BETA', 'GAMMA', 'DELTA' ]
```

---

### Étape 6 : Pattern retry avec async/await

```javascript
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fonction qui échoue aléatoirement
const operationInstable = async (nom) => {
  await attendre(50);
  if (Math.random() < 0.5) {
    throw new Error(`${nom} a échoué`);
  }
  return `${nom} : succès`;
};

// Retry automatique avec async/await
const avecRetry = async (fn, maxRetries = 3) => {
  for (let tentative = 1; tentative <= maxRetries; tentative++) {
    try {
      const resultat = await fn();
      return resultat; // Succès - on sort de la boucle
    } catch (erreur) {
      console.log(`  Tentative ${tentative}/${maxRetries} échouée : ${erreur.message}`);
      if (tentative === maxRetries) {
        throw new Error(`Échec après ${maxRetries} tentatives : ${erreur.message}`);
      }
      // Attente exponentielle avant la prochaine tentative
      await attendre(100 * tentative);
    }
  }
};

async function main() {
  console.log("Tentative de chargement :");
  try {
    const resultat = await avecRetry(() => operationInstable("API"), 5);
    console.log("Résultat final :", resultat);
  } catch (erreur) {
    console.error("Échec total :", erreur.message);
  }
}

main();
```

```bash
node ~/js-moderne/10-async-await.js
```

**Résultat attendu** :

```text
Tentative de chargement :
  Tentative 1/5 échouée : API a échoué
  Tentative 2/5 échouée : API a échoué
Résultat final : API : succès
```

(Le nombre de tentatives varie car l'échec est aléatoire.)

---

### Étape 7 : Top-level await dans un module

Crée un fichier `demo-toplevel.mjs` :

```javascript
// Top-level await - disponible dans les modules ESM (.mjs)
// Pas besoin de wrapper dans une fonction async

const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("Début du module");

// await directement au niveau supérieur du module
const config = await (async () => {
  await attendre(100);
  return { port: 3000, debug: false };
})();

console.log("Config chargée :", config);

// On peut aussi utiliser await directement
await attendre(100);
console.log("Module complètement initialisé");
```

```bash
node ~/js-moderne/demo-toplevel.mjs
```

**Résultat attendu** :

```text
Début du module
Config chargée : { port: 3000, debug: false }
Module complètement initialisé
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `async function nom() { ... }` | Déclare une fonction asynchrone |
| `const fn = async () => { ... }` | Arrow function asynchrone |
| `const result = await promise` | Attend la résolution d'une Promise |
| `try { await ... } catch (e) { ... }` | Gère les erreurs d'await |
| `await Promise.all([p1, p2])` | Attend plusieurs Promises en parallèle |
| `for (const x of arr) { await ... }` | Boucle séquentielle async |
| `await Promise.all(arr.map(fn))` | Boucle parallèle async |

---

## Pièges Fréquents

### Piège 1 : `await` dans `forEach`

**Problème** : Tu utilises `await` dans un callback `forEach`, mais les itérations ne s'attendent pas mutuellement.

**Solution** : Utilise `for...of` pour du traitement séquentiel ou `Promise.all(arr.map(...))` pour du parallèle.

```javascript
// ❌ forEach n'attend pas les Promises
arr.forEach(async (item) => {
  await traiter(item); // Les traitements partent tous en même temps
});

// ✅ for...of pour du séquentiel
for (const item of arr) {
  await traiter(item);
}

// ✅ Promise.all pour du parallèle
await Promise.all(arr.map((item) => traiter(item)));
```

---

### Piège 2 : Oublier `await`

**Problème** : Tu oublies `await` devant une fonction `async`, et tu obtiens une Promise au lieu de la valeur.

**Solution** : Vérifie toujours que tu as `await` devant les appels à des fonctions `async`.

```javascript
// ❌ Oubli de await
const user = getUser(42);
console.log(user.nom); // undefined - user est une Promise, pas l'utilisateur

// ✅ Avec await
const user2 = await getUser(42);
console.log(user2.nom); // "Alice"
```

---

### Piège 3 : await séquentiel au lieu de parallèle

**Problème** : Tu fais `await` sur chaque Promise séquentiellement alors qu'elles sont indépendantes.

**Solution** : Utilise `Promise.all()` quand les opérations sont indépendantes.

```javascript
// ❌ Séquentiel : 600ms total
const a = await charger("A", 200); // 200ms
const b = await charger("B", 200); // +200ms
const c = await charger("C", 200); // +200ms

// ✅ Parallèle : 200ms total
const [x, y, z] = await Promise.all([
  charger("A", 200),
  charger("B", 200),
  charger("C", 200),
]);
```

---

### Piège 5 : Pas de timeout sur les opérations longues

⚠️ **Problème** : Un appel `fetch()` ou une opération asynchrone longue peut ne jamais se terminer si le serveur ne répond pas. Sans timeout, ton programme reste bloqué indéfiniment.

```javascript
// ❌ Aucun timeout : peut bloquer pour toujours
const reponse = await fetch("https://api.exemple.com/donnees");
```

✅ **Solution** : Utilise `AbortController` avec `AbortSignal.timeout()` (disponible depuis Node.js 17.3 et les navigateurs modernes).

```javascript
// ✅ Timeout de 5 secondes
const reponse = await fetch("https://api.exemple.com/donnees", {
  signal: AbortSignal.timeout(5000), // annule après 5000 ms
});

// Ou avec AbortController pour plus de contrôle
const controleur = new AbortController();
const minuterie = setTimeout(() => controleur.abort(), 5000);

try {
  const reponse = await fetch("https://api.exemple.com/donnees", {
    signal: controleur.signal,
  });
  clearTimeout(minuterie);
} catch (erreur) {
  // AbortSignal.timeout() lève TimeoutError ; abort() manuel lève AbortError
  if (erreur.name === "TimeoutError" || erreur.name === "AbortError") {
    console.error("Requête annulée (timeout)");
  }
}
```

---

### Piège 4 : Ne pas capturer les erreurs d'une fonction `async`

**Problème** : Tu appelles une fonction `async` sans `await` et sans `.catch()`, et une erreur silencieuse se produit.

**Solution** : Toujours `await` ou `.catch()` les appels à des fonctions `async`.

```javascript
// ❌ L'erreur n'est pas capturée
fonctionAsync(); // Si elle rejette, UnhandledPromiseRejection

// ✅ Avec await + try/catch
try {
  await fonctionAsync();
} catch (e) {
  console.error(e);
}

// ✅ Ou avec .catch()
fonctionAsync().catch(console.error);
```

---

## Checklist de Validation

- [ ] Je sais déclarer une fonction `async` (déclaration et arrow)
- [ ] Je sais que `async` retourne toujours une Promise
- [ ] Je sais utiliser `await` pour attendre une Promise
- [ ] Je gère les erreurs avec `try`/`catch`/`finally`
- [ ] Je sais utiliser `Promise.all()` avec `await` pour le parallélisme
- [ ] Je sais que `forEach` ne fonctionne pas avec `await`
- [ ] Je sais utiliser `for...of` pour les boucles séquentielles async
- [ ] J'utilise `await Promise.all(arr.map(...))` pour les boucles parallèles async

---

## Exercice Pratique

**Énoncé** : Crée un système de pipeline de traitement de données asynchrone.

1. Crée une fonction `lireFichier(nom)` qui simule la lecture d'un fichier (retourne du texte après un délai).
2. Crée une fonction `compterMots(texte)` qui retourne le nombre de mots (async avec délai).
3. Crée une fonction `traduire(texte)` qui simule une traduction (remplace certains mots).
4. Crée un pipeline qui lit 3 fichiers en parallèle, les traduit séquentiellement, et compte les mots de chaque traduction en parallèle.
5. Affiche un rapport final.

**Indications** :

- Utilise `Promise.all()` pour les opérations parallèles.
- Utilise `for...of` pour les opérations séquentielles.
- Utilise `try`/`catch` pour la gestion d'erreurs.

**Résultat attendu** :

```text
Lecture de 3 fichiers en parallèle...
Fichiers chargés en ~100ms

Traduction séquentielle...
  article.txt traduit
  readme.txt traduit
  notes.txt traduit

Comptage des mots en parallèle...
Rapport :
  article.txt : 8 mots
  readme.txt : 6 mots
  notes.txt : 5 mots
  Total : 19 mots
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
const attendre = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Simuler la lecture d'un fichier
const lireFichier = async (nom) => {
  await attendre(100);
  const fichiers = {
    "article.txt": "The quick brown fox jumps over the lazy dog",
    "readme.txt": "Welcome to the JavaScript modern course",
    "notes.txt": "Remember to practice every day",
  };
  if (!fichiers[nom]) throw new Error(`Fichier ${nom} introuvable`);
  return { nom, contenu: fichiers[nom] };
};

// Simuler une traduction (remplacer des mots anglais par du français)
const traduire = async (texte) => {
  await attendre(50);
  const traductions = {
    The: "Le", quick: "rapide", brown: "brun", fox: "renard",
    jumps: "saute", over: "par-dessus", the: "le", lazy: "paresseux",
    dog: "chien", Welcome: "Bienvenue", to: "au", JavaScript: "JavaScript",
    modern: "moderne", course: "cours", Remember: "Rappel",
    practice: "pratiquer", every: "chaque", day: "jour",
  };
  return texte.replace(/\b\w+\b/g, (mot) => traductions[mot] || mot);
};

// Simuler le comptage de mots
const compterMots = async (texte) => {
  await attendre(30);
  return texte.split(/\s+/).length;
};

// Pipeline principal
async function pipeline() {
  const noms = ["article.txt", "readme.txt", "notes.txt"];

  try {
    // Étape 1 : Lecture parallèle
    console.log(`Lecture de ${noms.length} fichiers en parallèle...`);
    const debut = Date.now();
    const fichiers = await Promise.all(noms.map((n) => lireFichier(n)));
    console.log(`Fichiers chargés en ~${Date.now() - debut}ms`);

    // Étape 2 : Traduction séquentielle (simuler une API avec rate limit)
    console.log("\nTraduction séquentielle...");
    const traduits = [];
    for (const fichier of fichiers) {
      const contenuTraduit = await traduire(fichier.contenu);
      traduits.push({ nom: fichier.nom, contenu: contenuTraduit });
      console.log(`  ${fichier.nom} traduit`);
    }

    // Étape 3 : Comptage parallèle
    console.log("\nComptage des mots en parallèle...");
    const comptages = await Promise.all(
      traduits.map(async (f) => ({
        nom: f.nom,
        mots: await compterMots(f.contenu),
      }))
    );

    // Rapport
    const totalMots = comptages.reduce((acc, c) => acc + c.mots, 0);
    console.log("Rapport :");
    comptages.forEach(({ nom, mots }) => {
      console.log(`  ${nom} : ${mots} mots`);
    });
    console.log(`  Total : ${totalMots} mots`);
  } catch (erreur) {
    console.error("Erreur dans le pipeline :", erreur.message);
  }
}

pipeline();
```

---

## Navigation

← Fiche précédente : **[Promises](09-promises.md)**

→ Fiche suivante : **[Fetch API et HTTP](11-fetch-api-http.md)**
