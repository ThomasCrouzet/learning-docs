---
tags:
  - Node.js
  - Intermédiaire
  - Pratique
description: "Programmation asynchrone"
estimated_time: "75 min"
fiche_number: 4
total_fiches: 10
cursus: "Node.js"
---

# 04 - Programmation asynchrone

> **En bref** : À la fin de cette fiche, tu sauras utiliser les callbacks, les Promises et async/await pour gérer les opérations asynchrones dans Node.js. Lecture estimée : 75 min.


## Prérequis

- Fiche [07-nodejs/01 - Introduction à Node.js](01-introduction-nodejs.md)
- Fiche [07-nodejs/03 - Modules et imports](03-modules-imports.md)
- Savoir écrire des fonctions en JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les callbacks, les Promises et async/await pour gérer les opérations asynchrones dans Node.js.

---

## Concepts

### Qu'est-ce que l'asynchrone ?

**Définition** : Une opération asynchrone est une opération qui ne bloque pas l'exécution du programme pendant qu'elle s'exécute. Le programme continue et sera notifié quand l'opération est terminée.

**Le problème que l'asynchrone résout** :

Sans asynchrone, voici les problèmes rencontrés :

1. **Blocage total** : Pendant une lecture de fichier (1 seconde), le serveur ne peut rien faire d'autre.
2. **Mauvaise performance** : 100 utilisateurs simultanés = chacun attend que les autres finissent.
3. **Interface gelée** : L'application ne répond plus pendant les opérations longues.

**Comment l'asynchrone résout ces problèmes** :

| Problème | Solution apportée par l'asynchrone |
| -------- | ---------------------------------- |
| Blocage total | L'opération se fait en arrière-plan |
| Mauvaise performance | Plusieurs opérations en parallèle |
| Interface gelée | Le programme reste réactif |

**Analogie concrète** : Au restaurant, le serveur prend ta commande puis va prendre la commande d'autres tables pendant que le cuisinier prépare ton plat. Il ne reste pas planté à attendre que ton plat soit prêt. Quand c'est prêt, le cuisinier le signale et le serveur te l'apporte.

**Comparaison synchrone vs asynchrone** :

| Synchrone | Asynchrone |
| --------- | ---------- |
| Attend que chaque opération finisse | Continue immédiatement |
| Simple à comprendre | Plus complexe |
| Bloque le programme | Ne bloque pas |
| Une chose à la fois | Plusieurs choses en parallèle |

---

Le diagramme suivant montre le fonctionnement de l'Event Loop dans Node.js.

<div class="diagram-design">
<p><a href="../../../diagrams/fondamentaux-07-nodejs-04-programmation-asynchrone-1.html">Qu&#x27;est-ce que l&#x27;asynchrone ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/fondamentaux-07-nodejs-04-programmation-asynchrone-1.html" title="Qu&#x27;est-ce que l&#x27;asynchrone ?" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

### Les trois façons de gérer l'asynchrone

Node.js propose trois mécanismes :

| Mécanisme | Époque | Complexité | Recommandé |
| --------- | ------ | ---------- | ---------- |
| Callbacks | Ancien | Simple pour 1 niveau, complexe ensuite | Non |
| Promises | ES6 (2015) | Moyenne | Oui |
| async/await | ES8 (2017) | Simple | **Oui (préféré)** |

**Règle** : Utilise `async/await` autant que possible. C'est le plus lisible.

---

### Les callbacks

**Définition** : Un callback est une fonction passée en argument à une autre fonction, qui sera appelée quand l'opération est terminée.

**Structure d'un callback Node.js** :

```javascript
fonctionAsynchrone(arguments, (erreur, resultat) => {
    if (erreur) {
        // Gérer l'erreur
    } else {
        // Utiliser le résultat
    }
});
```

**Convention importante** : En Node.js, le callback reçoit toujours l'erreur en premier argument (`error-first callback`).

**Problème du callback hell** :

```javascript
// Exemple de code illisible avec des callbacks imbriqués
lireFichier('a.txt', (err, dataA) => {
    lireFichier('b.txt', (err, dataB) => {
        lireFichier('c.txt', (err, dataC) => {
            // Code imbriqué difficile à lire
        });
    });
});
```

---

### Les Promises

**Définition** : Une Promise est un objet qui représente une valeur qui sera disponible dans le futur (ou une erreur).

**Trois états possibles** :

| État | Signification |
| ---- | ------------- |
| `pending` | En attente, l'opération n'est pas terminée |
| `fulfilled` | Réussie, la valeur est disponible |
| `rejected` | Échouée, une erreur s'est produite |

**Structure d'une Promise** :

```javascript
maPromise
    .then(resultat => {
        // L'opération a réussi
    })
    .catch(erreur => {
        // L'opération a échoué
    });
```

---

### async/await

**Définition** : `async/await` est une syntaxe qui permet d'écrire du code asynchrone comme s'il était synchrone.

**Règles** :

1. `async` se place devant une fonction pour la rendre asynchrone
2. `await` s'utilise uniquement à l'intérieur d'une fonction `async`
3. `await` attend qu'une Promise soit résolue avant de continuer

**Structure** :

```javascript
async function maFonction() {
    try {
        const resultat = await operationAsynchrone();
        // Utiliser le résultat
    } catch (erreur) {
        // Gérer l'erreur
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Configurer le projet

```bash
mkdir projet-async
cd projet-async
npm init -y
```

Modifie `package.json` :

```json
{
  "name": "projet-async",
  "version": "1.0.0",
  "type": "module"
}
```

---

### Étape 2 : Comprendre setTimeout (callback simple)

`setTimeout` est une fonction asynchrone basique. Elle exécute du code après un délai.

Crée `callback-demo.js` :

```javascript
// callback-demo.js - Démonstration de setTimeout

console.log("1. Début du programme");

// setTimeout prend un callback et un délai en millisecondes
setTimeout(() => {
    console.log("3. Ceci s'affiche après 2 secondes");
}, 2000);

console.log("2. Suite du programme (s'affiche immédiatement)");

// Le programme n'attend pas les 2 secondes
// Il continue son exécution
```

Exécute :

```bash
node callback-demo.js
```

**Résultat attendu** :

```text
1. Début du programme
2. Suite du programme (s'affiche immédiatement)
3. Ceci s'affiche après 2 secondes
```

L'ordre est 1, 2, 3 car le programme n'attend pas le `setTimeout`.

---

### Étape 3 : Simuler une opération asynchrone avec callback

Crée `callback-exemple.js` :

```javascript
// callback-exemple.js - Simuler une requête à une API

// Fonction qui simule une requête (prend 1 seconde)
function obtenirUtilisateur(id, callback) {
    console.log(`Recherche de l'utilisateur ${id}...`);

    setTimeout(() => {
        // Simuler une réponse après 1 seconde
        if (id <= 0) {
            // Erreur : id invalide
            callback(new Error("ID invalide"), null);
        } else {
            // Succès : retourner l'utilisateur
            const utilisateur = {
                id: id,
                nom: "Alice",
                email: "alice@exemple.com"
            };
            callback(null, utilisateur);
        }
    }, 1000);
}

// Utilisation avec callback
console.log("Début");

obtenirUtilisateur(1, (erreur, utilisateur) => {
    if (erreur) {
        console.log("Erreur:", erreur.message);
    } else {
        console.log("Utilisateur trouvé:", utilisateur);
    }
});

console.log("Fin (s'affiche avant le résultat)");
```

**Résultat attendu** :

```text
Début
Recherche de l'utilisateur 1...
Fin (s'affiche avant le résultat)
Utilisateur trouvé: { id: 1, nom: 'Alice', email: 'alice@exemple.com' }
```

---

### Étape 4 : Créer une Promise

Crée `promise-demo.js` :

```javascript
// promise-demo.js - Créer et utiliser des Promises

// Fonction qui retourne une Promise
function obtenirUtilisateur(id) {
    return new Promise((resolve, reject) => {
        console.log(`Recherche de l'utilisateur ${id}...`);

        setTimeout(() => {
            if (id <= 0) {
                // reject = échec
                reject(new Error("ID invalide"));
            } else {
                // resolve = succès
                const utilisateur = {
                    id: id,
                    nom: "Bob",
                    email: "bob@exemple.com"
                };
                resolve(utilisateur);
            }
        }, 1000);
    });
}

// Utilisation avec .then() et .catch()
console.log("Début");

obtenirUtilisateur(1)
    .then(utilisateur => {
        console.log("Utilisateur trouvé:", utilisateur);
    })
    .catch(erreur => {
        console.log("Erreur:", erreur.message);
    });

console.log("Fin (s'affiche avant le résultat)");
```

**Résultat attendu** :

```text
Début
Recherche de l'utilisateur 1...
Fin (s'affiche avant le résultat)
Utilisateur trouvé: { id: 1, nom: 'Bob', email: 'bob@exemple.com' }
```

---

### Étape 5 : Chaîner les Promises

Crée `promise-chaine.js` :

```javascript
// promise-chaine.js - Chaîner plusieurs opérations

function obtenirUtilisateur(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, nom: "Charlie" });
        }, 500);
    });
}

function obtenirCommandes(utilisateur) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                utilisateur: utilisateur.nom,
                commandes: ["Commande 1", "Commande 2", "Commande 3"]
            });
        }, 500);
    });
}

function calculerTotal(donnees) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                ...donnees,
                total: donnees.commandes.length * 25
            });
        }, 500);
    });
}

// Chaînage : chaque .then() reçoit le résultat du précédent
console.log("Début du traitement...");

obtenirUtilisateur(1)
    .then(utilisateur => {
        console.log("1. Utilisateur récupéré");
        return obtenirCommandes(utilisateur);
    })
    .then(commandes => {
        console.log("2. Commandes récupérées");
        return calculerTotal(commandes);
    })
    .then(resultat => {
        console.log("3. Total calculé");
        console.log("Résultat final:", resultat);
    })
    .catch(erreur => {
        console.log("Erreur:", erreur.message);
    });
```

**Résultat attendu** (après ~1.5 secondes) :

```text
Début du traitement...
1. Utilisateur récupéré
2. Commandes récupérées
3. Total calculé
Résultat final: { utilisateur: 'Charlie', commandes: ['Commande 1', 'Commande 2', 'Commande 3'], total: 75 }
```

---

### Étape 6 : Utiliser async/await

Crée `async-await-demo.js` :

```javascript
// async-await-demo.js - La syntaxe moderne

function obtenirUtilisateur(id) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({ id, nom: "Diana" });
        }, 500);
    });
}

function obtenirCommandes(utilisateur) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                utilisateur: utilisateur.nom,
                commandes: ["Commande A", "Commande B"]
            });
        }, 500);
    });
}

// Fonction async
async function traiterCommande() {
    console.log("Début du traitement...");

    // await attend que la Promise soit résolue
    const utilisateur = await obtenirUtilisateur(1);
    console.log("1. Utilisateur:", utilisateur);

    const commandes = await obtenirCommandes(utilisateur);
    console.log("2. Commandes:", commandes);

    console.log("Traitement terminé!");
    return commandes;
}

// Appeler la fonction async
traiterCommande();
```

**Résultat attendu** :

```text
Début du traitement...
1. Utilisateur: { id: 1, nom: 'Diana' }
2. Commandes: { utilisateur: 'Diana', commandes: ['Commande A', 'Commande B'] }
Traitement terminé!
```

---

### Étape 7 : Gérer les erreurs avec try/catch

Crée `async-erreur.js` :

```javascript
// async-erreur.js - Gestion des erreurs

function obtenirUtilisateur(id) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (id <= 0) {
                reject(new Error("ID doit être positif"));
            } else if (id > 100) {
                reject(new Error("Utilisateur non trouvé"));
            } else {
                resolve({ id, nom: "Emma" });
            }
        }, 500);
    });
}

async function afficherUtilisateur(id) {
    try {
        console.log(`Recherche utilisateur ${id}...`);
        const utilisateur = await obtenirUtilisateur(id);
        console.log("Trouvé:", utilisateur);
    } catch (erreur) {
        console.log("Erreur:", erreur.message);
    }
}

// Test avec différents IDs
async function tests() {
    await afficherUtilisateur(1);    // Succès
    await afficherUtilisateur(-5);   // Erreur: ID doit être positif
    await afficherUtilisateur(150);  // Erreur: Utilisateur non trouvé
}

tests();
```

**Résultat attendu** :

```text
Recherche utilisateur 1...
Trouvé: { id: 1, nom: 'Emma' }
Recherche utilisateur -5...
Erreur: ID doit être positif
Recherche utilisateur 150...
Erreur: Utilisateur non trouvé
```

---

### Étape 8 : Exécuter des Promises en parallèle

Crée `parallel-demo.js` :

```javascript
// parallel-demo.js - Promise.all pour le parallélisme

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function obtenirDonnee(nom, delai) {
    console.log(`Début: ${nom}`);
    await pause(delai);
    console.log(`Fin: ${nom}`);
    return `Résultat de ${nom}`;
}

// Exécution séquentielle (une après l'autre)
async function sequentiel() {
    console.log("=== SÉQUENTIEL ===");
    const debut = Date.now();

    const a = await obtenirDonnee("A", 1000);
    const b = await obtenirDonnee("B", 1000);
    const c = await obtenirDonnee("C", 1000);

    const duree = Date.now() - debut;
    console.log(`Durée: ${duree}ms`);  // ~3000ms
    console.log("Résultats:", [a, b, c]);
}

// Exécution parallèle (toutes en même temps)
async function parallele() {
    console.log("\n=== PARALLÈLE ===");
    const debut = Date.now();

    // Promise.all attend que toutes les Promises soient résolues
    const [a, b, c] = await Promise.all([
        obtenirDonnee("A", 1000),
        obtenirDonnee("B", 1000),
        obtenirDonnee("C", 1000)
    ]);

    const duree = Date.now() - debut;
    console.log(`Durée: ${duree}ms`);  // ~1000ms
    console.log("Résultats:", [a, b, c]);
}

async function main() {
    await sequentiel();
    await parallele();
}

main();
```

**Résultat attendu** :

```text
=== SÉQUENTIEL ===
Début: A
Fin: A
Début: B
Fin: B
Début: C
Fin: C
Durée: 3005ms
Résultats: [ 'Résultat de A', 'Résultat de B', 'Résultat de C' ]

=== PARALLÈLE ===
Début: A
Début: B
Début: C
Fin: A
Fin: B
Fin: C
Durée: 1003ms
Résultats: [ 'Résultat de A', 'Résultat de B', 'Résultat de C' ]
```

**Observation** : En parallèle, les trois opérations démarrent en même temps. Durée totale = durée de la plus longue, pas la somme.

---

### Étape 9 : Promise.allSettled et Promise.race

Crée `promise-autres.js` :

```javascript
// promise-autres.js - Autres méthodes utiles

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function succes(valeur, delai) {
    await pause(delai);
    return valeur;
}

async function echec(message, delai) {
    await pause(delai);
    throw new Error(message);
}

// Promise.allSettled : attend toutes, même si certaines échouent
async function demoAllSettled() {
    console.log("=== Promise.allSettled ===");

    const resultats = await Promise.allSettled([
        succes("OK 1", 100),
        echec("Erreur 2", 200),
        succes("OK 3", 150)
    ]);

    resultats.forEach((r, i) => {
        if (r.status === 'fulfilled') {
            console.log(`${i}: Succès -`, r.value);
        } else {
            console.log(`${i}: Échec -`, r.reason.message);
        }
    });
}

// Promise.race : retourne dès que la première Promise se termine
async function demoRace() {
    console.log("\n=== Promise.race ===");

    const premier = await Promise.race([
        succes("Tortue", 2000),
        succes("Lièvre", 500),
        succes("Escargot", 3000)
    ]);

    console.log("Premier arrivé:", premier);  // Lièvre
}

// Promise.any : retourne dès que la première Promise réussit
async function demoAny() {
    console.log("\n=== Promise.any ===");

    const premier = await Promise.any([
        echec("Serveur 1 en panne"),
        succes("Serveur 2", 500),
        succes("Serveur 3", 1000)
    ]);

    // Utile pour sélectionner le serveur le plus rapide qui répond
    console.log("Premier succès:", premier);  // Serveur 2
}

async function main() {
    await demoAllSettled();
    await demoRace();
    await demoAny();
}

main();
```

**Résultat attendu** :

```text
=== Promise.allSettled ===
0: Succès - OK 1
1: Échec - Erreur 2
2: Succès - OK 3

=== Promise.race ===
Premier arrivé: Lièvre

=== Promise.any ===
Premier succès: Serveur 2
```

---

## Méthodes Promise utiles

| Méthode | Description |
| ------- | ----------- |
| `Promise.all([p1, p2])` | Attend toutes, échoue si une échoue |
| `Promise.allSettled([p1, p2])` | Attend toutes, retourne le statut de chacune |
| `Promise.race([p1, p2])` | Retourne dès la première terminée |
| `Promise.any([p1, p2])` | Retourne dès le premier succès |

---

## Pièges Fréquents

### Piège 1 : await hors d'une fonction async (CommonJS)

⚠️ **Problème** : Dans un fichier CommonJS (sans `"type": "module"`), `await` au niveau supérieur lève une erreur de syntaxe.

```javascript
// ❌ Erreur en CommonJS (scripts .cjs ou package.json sans "type": "module")
const data = await fetchData();
```

✅ **Solution** : Encapsuler dans une fonction async, ou passer en module ES.

```javascript
// ✅ Fonction async (fonctionne partout)
async function main() {
    const data = await fetchData();
}
main();

// ✅ Top-level await : autorisé dans les modules ES (cette fiche utilise "type": "module")
const data = await fetchData();
```

---

### Piège 2 : Oublier await

⚠️ **Problème** : Oublier `await` devant une fonction async retourne une Promise, pas la valeur.

```javascript
async function getData() {
    return "valeur";
}

// ❌ result est une Promise, pas "valeur"
const result = getData();
console.log(result);  // Promise { 'valeur' }
```

✅ **Solution** : Toujours utiliser `await` avec les fonctions async.

```javascript
// ✅ Correct
const result = await getData();
console.log(result);  // "valeur"
```

---

### Piège 3 : await en boucle for (inefficace)

⚠️ **Problème** : Exécution séquentielle au lieu de parallèle.

```javascript
// ❌ Lent : attend chaque requête une par une
for (const id of ids) {
    const data = await fetchData(id);
}
```

✅ **Solution** : Utiliser `Promise.all` pour le parallélisme.

```javascript
// ✅ Rapide : toutes les requêtes en parallèle
const promises = ids.map(id => fetchData(id));
const results = await Promise.all(promises);
```

---

### Piège 4 : Ne pas gérer les erreurs

⚠️ **Problème** : Une erreur non gérée crashe le programme.

```javascript
// ❌ Si fetchData échoue, erreur non gérée
async function main() {
    const data = await fetchData();
}
```

✅ **Solution** : Toujours utiliser try/catch.

```javascript
// ✅ Erreur gérée
async function main() {
    try {
        const data = await fetchData();
    } catch (error) {
        console.log("Erreur:", error.message);
    }
}
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre synchrone et asynchrone
- [ ] Je sais utiliser `setTimeout` avec un callback
- [ ] Je sais créer une Promise avec `new Promise`
- [ ] Je sais chaîner les Promises avec `.then()` et `.catch()`
- [ ] Je sais utiliser `async/await`
- [ ] Je sais gérer les erreurs avec `try/catch`
- [ ] Je sais exécuter des Promises en parallèle avec `Promise.all`

---

## Exercice Pratique

**Énoncé** : Crée un système de traitement de commandes simulé avec ces fonctions :

1. `verifierStock(produit)` : retourne true/false après 300ms
2. `calculerPrix(produit)` : retourne le prix après 200ms
3. `effectuerPaiement(prix)` : réussit si prix < 1000, échoue sinon, après 500ms
4. `traiterCommande(produit)` : orchestre tout avec async/await

Utilise `Promise.all` pour vérifier le stock et calculer le prix en parallèle.

**Résultat attendu** :

```text
Traitement de: Laptop
Vérification du stock et calcul du prix...
Stock disponible: true
Prix: 599€
Paiement effectué avec succès
Commande terminée!
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// commande.js

function pause(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function verifierStock(produit) {
    await pause(300);
    // Simuler : tous les produits sauf "Rupture" sont en stock
    return produit !== "Rupture";
}

async function calculerPrix(produit) {
    await pause(200);
    // Simuler des prix selon le produit
    const prix = {
        "Laptop": 599,
        "Phone": 299,
        "TV": 1299
    };
    return prix[produit] || 99;
}

async function effectuerPaiement(prix) {
    await pause(500);
    if (prix >= 1000) {
        throw new Error("Paiement refusé: montant trop élevé");
    }
    return true;
}

async function traiterCommande(produit) {
    console.log("Traitement de:", produit);

    try {
        // Vérifier stock ET calculer prix EN PARALLÈLE
        console.log("Vérification du stock et calcul du prix...");
        const [enStock, prix] = await Promise.all([
            verifierStock(produit),
            calculerPrix(produit)
        ]);

        console.log("Stock disponible:", enStock);
        console.log(`Prix: ${prix}€`);

        if (!enStock) {
            throw new Error("Produit en rupture de stock");
        }

        // Effectuer le paiement
        await effectuerPaiement(prix);
        console.log("Paiement effectué avec succès");
        console.log("Commande terminée!");

    } catch (erreur) {
        console.log("Erreur:", erreur.message);
    }
}

// Tests
async function tests() {
    await traiterCommande("Laptop");   // Succès
    console.log("\n---\n");
    await traiterCommande("TV");       // Échec: prix trop élevé
    console.log("\n---\n");
    await traiterCommande("Rupture");  // Échec: pas en stock
}

tests();
```

**Exécution** :

```bash
node commande.js
```

---

## Navigation

← Fiche précédente : **[Modules et imports](03-modules-imports.md)**

→ Fiche suivante : **[Système de fichiers (fs)](05-systeme-fichiers.md)**
