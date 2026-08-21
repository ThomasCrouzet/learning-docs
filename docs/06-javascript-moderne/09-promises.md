---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Comprendre les Promises, le chaînage then/catch/finally, et les méthodes Promise.all, allSettled, race et any."
estimated_time: "90 min"
fiche_number: 9
total_fiches: 14
cursus: "JavaScript Moderne"
id: "web.javascript-modern.promises"
course_id: "web.javascript-modern"
content_type: "lesson"
order: 9
---

# 09 - Promises

> **En bref** : Comprendre ce qu'est une Promise, comment la créer, la consommer avec `then`/`catch`/`finally`, chaîner les Promises, et utiliser `Promise.all`, `Promise.allSettled`, `Promise.race` et `Promise.any`. Lecture estimée : 90 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Fiche 03 : [Destructuring et spread](03-destructuring-spread.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et consommer des Promises, gérer les erreurs avec `catch`, chaîner des opérations asynchrones, et utiliser les méthodes statiques de Promise pour gérer plusieurs opérations en parallèle.

---

## Concepts

### Qu'est-ce que le code asynchrone ?

**Définition** : Le code asynchrone est du code qui ne s'exécute pas immédiatement dans l'ordre où il est écrit. Il démarre une opération (lecture de fichier, appel réseau, minuteur) et continue à exécuter le reste du code sans attendre le résultat. Quand le résultat arrive, une fonction de rappel (callback) est exécutée.

**Le problème du code asynchrone sans Promises** :

Sans les Promises, voici les problèmes rencontrés :

1. **Callback hell** : imbriquer des callbacks rend le code illisible (pyramide de doom).
2. **Gestion d'erreurs incohérente** : chaque callback doit gérer ses propres erreurs séparément.
3. **Composition difficile** : combiner plusieurs opérations asynchrones est complexe.

```javascript
// Callback hell : chaque opération est imbriquée dans la précédente
// C'est difficile à lire et à maintenir
lireFichier("config.json", (erreur1, config) => {
  if (erreur1) {
    console.error(erreur1);
    return;
  }
  connecterBDD(config.bdd, (erreur2, connexion) => {
    if (erreur2) {
      console.error(erreur2);
      return;
    }
    executerRequete(connexion, "SELECT *", (erreur3, resultats) => {
      if (erreur3) {
        console.error(erreur3);
        return;
      }
      console.log(resultats); // Enfin le résultat, 3 niveaux d'imbrication plus tard
    });
  });
});
```

---

### Qu'est-ce qu'une Promise ?

**Définition** : Une Promise (promesse) est un objet qui représente le résultat futur d'une opération asynchrone. Elle peut être dans l'un de ces trois états :

- **pending** (en attente) : l'opération n'est pas encore terminée.
- **fulfilled** (résolue) : l'opération a réussi, la Promise contient une valeur.
- **rejected** (rejetée) : l'opération a échoué, la Promise contient une erreur.

**Comment les Promises résolvent les problèmes** :

| Problème | Solution apportée par les Promises |
| -------- | ---------------------------------- |
| Callback hell | Chaînage avec `.then()` - code linéaire, pas d'imbrication |
| Gestion d'erreurs incohérente | `.catch()` centralise la gestion d'erreurs |
| Composition difficile | `Promise.all()` et autres méthodes combinent les Promises |

**Analogie concrète** : Une Promise est comme un ticket de retrait au comptoir d'un restaurant rapide. Quand tu commandes, on te donne un ticket (la Promise). Le ticket est "en attente". Quand ta commande est prête, le ticket est "résolu" (tu récupères ton repas). Si le plat est en rupture de stock, le ticket est "rejeté" (tu reçois un message d'erreur).

**Ce qu'une Promise n'est PAS** :

- Une Promise n'est pas synchrone. Le résultat n'est jamais disponible immédiatement après la création.
- Une Promise n'est pas annulable (nativement). Une fois créée, elle finira par être résolue ou rejetée.
- Une Promise ne peut changer d'état qu'une seule fois. Une fois résolue ou rejetée, son état est définitif.

Le schéma suivant illustre les trois états d'une Promise et les transitions entre eux :

<div class="diagram-design">
<p><a href="../../diagrams/06-javascript-moderne-09-promises-1.html">Qu&#x27;est-ce qu&#x27;une Promise ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/06-javascript-moderne-09-promises-1.html" title="Qu&#x27;est-ce qu&#x27;une Promise ?" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

---

### Créer une Promise

**Définition** : On crée une Promise avec `new Promise((resolve, reject) => { ... })`. La fonction reçoit deux callbacks : `resolve` pour réussir et `reject` pour échouer.

```javascript
// Créer une Promise qui simule une opération asynchrone
const maPromise = new Promise((resolve, reject) => {
  // Simuler un délai (comme un appel réseau)
  setTimeout(() => {
    const succes = true;
    if (succes) {
      resolve("Opération réussie !"); // La Promise est résolue
    } else {
      reject(new Error("Opération échouée")); // La Promise est rejetée
    }
  }, 1000);
});
```

---

### Consommer une Promise avec then/catch/finally

**Définition** : `.then()` s'exécute quand la Promise est résolue. `.catch()` s'exécute quand elle est rejetée. `.finally()` s'exécute dans les deux cas.

```javascript
maPromise
  .then((resultat) => {
    // Exécuté si la Promise est résolue
    console.log("Succès :", resultat);
  })
  .catch((erreur) => {
    // Exécuté si la Promise est rejetée
    console.error("Erreur :", erreur.message);
  })
  .finally(() => {
    // Exécuté dans tous les cas (succès ou échec)
    console.log("Opération terminée");
  });
```

---

### Chaîner les Promises

**Définition** : `.then()` retourne une nouvelle Promise. Cela permet de chaîner les opérations : le résultat d'un `.then()` est passé au `.then()` suivant.

```javascript
// Chaînage : chaque .then() retourne une nouvelle Promise
recupererUtilisateur(42)
  .then((utilisateur) => {
    console.log("Utilisateur :", utilisateur.nom);
    return recupererCommandes(utilisateur.id); // Retourne une nouvelle Promise
  })
  .then((commandes) => {
    console.log("Commandes :", commandes.length);
    return calculerTotal(commandes); // Retourne une nouvelle Promise
  })
  .then((total) => {
    console.log("Total :", total);
  })
  .catch((erreur) => {
    // Attrape l'erreur de N'IMPORTE QUELLE étape
    console.error("Erreur :", erreur.message);
  });
```

---

### Promise.all, allSettled, race et any

| Méthode | Comportement | Résolu quand | Rejeté quand |
| ------- | ------------ | ------------ | ------------ |
| `Promise.all(promises)` | Attend que toutes réussissent | Toutes sont résolues | Une seule est rejetée |
| `Promise.allSettled(promises)` | Attend que toutes se terminent | Toutes sont terminées (succès ou échec) | Jamais rejeté |
| `Promise.race(promises)` | Retourne la plus rapide | La première terminée est résolue | La première terminée est rejetée |
| `Promise.any(promises)` | Retourne la première réussie | La première résolue | Toutes sont rejetées |

---

## Étapes Pratiques

### Étape 1 : Créer et consommer une Promise simple

Crée le fichier `09-promises.js` :

```javascript
// Fonction qui retourne une Promise
const attendre = (ms) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`Terminé après ${ms}ms`);
    }, ms);
  });
};

// Consommer la Promise
console.log("Début");
attendre(1000)
  .then((message) => {
    console.log(message);
    console.log("Fin");
  });
console.log("Ce message s'affiche AVANT 'Terminé' car le code est asynchrone");
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Début
Ce message s'affiche AVANT 'Terminé' car le code est asynchrone
Terminé après 1000ms
Fin
```

---

### Étape 2 : Gérer les erreurs avec catch

```javascript
// Fonction qui peut échouer
const diviser = (a, b) => {
  return new Promise((resolve, reject) => {
    if (b === 0) {
      reject(new Error("Division par zéro"));
    } else {
      resolve(a / b);
    }
  });
};

// Cas de succès
diviser(10, 3)
  .then((resultat) => console.log("10 / 3 =", resultat.toFixed(2)))
  .catch((erreur) => console.error("Erreur :", erreur.message));

// Cas d'erreur
diviser(10, 0)
  .then((resultat) => console.log("10 / 0 =", resultat))
  .catch((erreur) => console.error("Erreur :", erreur.message));

// Erreur dans un .then() est aussi attrapée par .catch()
diviser(10, 2)
  .then((resultat) => {
    console.log("Résultat :", resultat);
    // Cette erreur sera attrapée par le .catch() suivant
    throw new Error("Erreur dans le traitement du résultat");
  })
  .catch((erreur) => console.error("Attrapée :", erreur.message))
  .finally(() => console.log("Bloc finally exécuté"));
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
10 / 3 = 3.33
Erreur : Division par zéro
Résultat : 5
Attrapée : Erreur dans le traitement du résultat
Bloc finally exécuté
```

---

### Étape 3 : Chaîner les Promises

```javascript
// Simuler une chaîne d'opérations asynchrones
const recupererUtilisateur = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ id, nom: "Alice", email: "alice@example.com" });
    }, 100);
  });
};

const recupererCommandes = (userId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        { id: 1, userId, montant: 29.99 },
        { id: 2, userId, montant: 49.99 },
        { id: 3, userId, montant: 15.0 },
      ]);
    }, 100);
  });
};

const calculerTotal = (commandes) => {
  return new Promise((resolve) => {
    const total = commandes.reduce((acc, c) => acc + c.montant, 0);
    resolve(total);
  });
};

// Chaînage linéaire - pas d'imbrication
console.log("Chargement des données...");
recupererUtilisateur(42)
  .then((utilisateur) => {
    console.log(`Utilisateur : ${utilisateur.nom}`);
    return recupererCommandes(utilisateur.id);
  })
  .then((commandes) => {
    console.log(`${commandes.length} commandes trouvées`);
    return calculerTotal(commandes);
  })
  .then((total) => {
    console.log(`Total : ${total.toFixed(2)} €`);
  })
  .catch((erreur) => {
    console.error("Erreur dans la chaîne :", erreur.message);
  });
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Chargement des données...
Utilisateur : Alice
3 commandes trouvées
Total : 94.98 €
```

---

### Étape 4 : Promise.all - exécution en parallèle

```javascript
// Simuler des appels API en parallèle
const chargerDonnees = (nom, delai) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`  ${nom} chargé (${delai}ms)`);
      resolve({ nom, delai });
    }, delai);
  });
};

// Promise.all : attend que TOUTES les Promises soient résolues
console.log("Chargement en parallèle avec Promise.all :");
const debut = Date.now();

Promise.all([
  chargerDonnees("Utilisateurs", 300),
  chargerDonnees("Produits", 200),
  chargerDonnees("Commandes", 400),
])
  .then((resultats) => {
    const duree = Date.now() - debut;
    console.log(`Tous chargés en ~${duree}ms (pas 900ms !)`);
    console.log(
      "Résultats :",
      resultats.map((r) => r.nom)
    );
  })
  .catch((erreur) => {
    console.error("Au moins une requête a échoué :", erreur.message);
  });
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Chargement en parallèle avec Promise.all :
  Produits chargé (200ms)
  Utilisateurs chargé (300ms)
  Commandes chargé (400ms)
Tous chargés en ~400ms (pas 900ms !)
Résultats : [ 'Utilisateurs', 'Produits', 'Commandes' ]
```

---

### Étape 5 : Promise.all avec gestion d'erreur

```javascript
// Si une seule Promise échoue, Promise.all échoue
const succes = () => new Promise((resolve) => setTimeout(() => resolve("OK"), 100));
const echec = () =>
  new Promise((_, reject) => setTimeout(() => reject(new Error("Erreur !")), 50));

Promise.all([succes(), echec(), succes()])
  .then((resultats) => console.log("Résultats :", resultats))
  .catch((erreur) => console.log("Promise.all échoue :", erreur.message));
// "Promise.all échoue : Erreur !" - l'échec annule tout

// Promise.allSettled : attend TOUTES les Promises, succès ET échecs
Promise.allSettled([succes(), echec(), succes()]).then((resultats) => {
  console.log("\nPromise.allSettled :");
  resultats.forEach((r, i) => {
    if (r.status === "fulfilled") {
      console.log(`  #${i + 1} Succès : ${r.value}`);
    } else {
      console.log(`  #${i + 1} Échec : ${r.reason.message}`);
    }
  });
});
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Promise.all échoue : Erreur !

Promise.allSettled :
  #1 Succès : OK
  #2 Échec : Erreur !
  #3 Succès : OK
```

---

### Étape 6 : Promise.race et Promise.any

```javascript
// Simuler des requêtes avec des délais différents
const serveur = (nom, delai, echoue = false) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (echoue) {
        reject(new Error(`${nom} a échoué`));
      } else {
        resolve(`${nom} a répondu en ${delai}ms`);
      }
    }, delai);
  });
};

// Promise.race : retourne la PREMIÈRE terminée (succès ou échec)
console.log("Promise.race :");
Promise.race([
  serveur("Paris", 300),
  serveur("Londres", 200),
  serveur("Tokyo", 500),
])
  .then((resultat) => console.log("  Premier :", resultat))
  .catch((erreur) => console.log("  Premier (échec) :", erreur.message));

// Promise.any : retourne la première RÉUSSIE (ignore les échecs)
console.log("\nPromise.any :");
Promise.any([
  serveur("Paris", 300, true), // Échoue
  serveur("Londres", 200, true), // Échoue
  serveur("Tokyo", 100), // Réussit - c'est celle-ci qui est retournée
])
  .then((resultat) => console.log("  Premier succès :", resultat))
  .catch((erreur) => console.log("  Tous ont échoué"));
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Promise.race :
  Premier : Londres a répondu en 200ms

Promise.any :
  Premier succès : Tokyo a répondu en 100ms
```

---

### Étape 7 : Créer des Promises utilitaires

```javascript
// Promise.resolve et Promise.reject - créer des Promises déjà résolues/rejetées
const deja = Promise.resolve(42);
deja.then((v) => console.log("Déjà résolu :", v));

const dejaEchec = Promise.reject(new Error("Déjà rejeté"));
dejaEchec.catch((e) => console.log("Déjà rejeté :", e.message));

// Fonction utilitaire : timeout pour une Promise
const avecTimeout = (promise, ms) => {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout après ${ms}ms`)), ms);
  });
  // Race entre la promise et le timeout
  return Promise.race([promise, timeout]);
};

// Test avec un délai court (succès avant timeout)
avecTimeout(serveur("Rapide", 100), 500)
  .then((r) => console.log("\nAvec timeout :", r))
  .catch((e) => console.log("\nTimeout :", e.message));

// Test avec un délai long (timeout avant succès)
avecTimeout(serveur("Lent", 1000), 200)
  .then((r) => console.log("Résultat :", r))
  .catch((e) => console.log("Timeout :", e.message));
```

```bash
node ~/js-moderne/09-promises.js
```

**Résultat attendu** :

```text
Déjà résolu : 42
Déjà rejeté : Déjà rejeté

Avec timeout : Rapide a répondu en 100ms
Timeout : Timeout après 200ms
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `new Promise((resolve, reject) => { ... })` | Crée une Promise |
| `.then(fn)` | Exécute `fn` quand la Promise est résolue |
| `.catch(fn)` | Exécute `fn` quand la Promise est rejetée |
| `.finally(fn)` | Exécute `fn` dans tous les cas |
| `Promise.resolve(valeur)` | Crée une Promise déjà résolue |
| `Promise.reject(erreur)` | Crée une Promise déjà rejetée |
| `Promise.all(promises)` | Attend que toutes réussissent |
| `Promise.allSettled(promises)` | Attend que toutes terminent |
| `Promise.race(promises)` | Retourne la plus rapide |
| `Promise.any(promises)` | Retourne la première réussie |

---

## Pièges Fréquents

### Piège 1 : Oublier de retourner dans un `.then()`

**Problème** : Tu oublies `return` dans un `.then()`, ce qui casse la chaîne de Promises.

**Solution** : Retourne toujours une valeur ou une Promise dans `.then()` si tu veux transmettre le résultat au `.then()` suivant.

```javascript
// ❌ Oubli de return : le then suivant reçoit undefined
fetch("/api/users")
  .then((response) => {
    response.json(); // PAS de return !
  })
  .then((data) => {
    console.log(data); // undefined
  });

// ✅ Avec return
fetch("/api/users")
  .then((response) => {
    return response.json(); // return explicite
  })
  .then((data) => {
    console.log(data); // Les données
  });
```

---

### Piège 2 : Imbriquer les `.then()` au lieu de les chaîner

**Problème** : Tu imbriquerais les `.then()` comme des callbacks, recréant le callback hell.

**Solution** : Chaîne les `.then()` à plat. Retourne la Promise et le `.then()` suivant recevra le résultat.

```javascript
// ❌ Imbrication (callback hell déguisé)
getUser(1).then((user) => {
  getOrders(user.id).then((orders) => {
    getTotal(orders).then((total) => {
      console.log(total);
    });
  });
});

// ✅ Chaînage à plat
getUser(1)
  .then((user) => getOrders(user.id))
  .then((orders) => getTotal(orders))
  .then((total) => console.log(total))
  .catch((err) => console.error(err));
```

---

### Piège 3 : Promise.all échoue si UNE seule Promise échoue

**Problème** : Tu utilises `Promise.all()` et une erreur dans une Promise annule toutes les autres.

**Solution** : Utilise `Promise.allSettled()` si tu veux connaître le résultat de chaque Promise, même en cas d'échec.

---

### Piège 4 : Ne pas attraper les erreurs

**Problème** : Tu ne mets pas de `.catch()` et une erreur silencieuse provoque un avertissement "UnhandledPromiseRejection".

**Solution** : Ajoute toujours un `.catch()` à la fin de chaque chaîne de Promises. Node.js peut crasher si une Promise rejetée n'est pas gérée.

```javascript
// ❌ Pas de catch : erreur non gérée
maPromise.then((result) => console.log(result));

// ✅ Toujours un catch
maPromise
  .then((result) => console.log(result))
  .catch((err) => console.error(err));
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est une Promise et ses trois états (pending, fulfilled, rejected)
- [ ] Je sais créer une Promise avec `new Promise((resolve, reject) => { ... })`
- [ ] Je sais consommer une Promise avec `.then()`, `.catch()` et `.finally()`
- [ ] Je sais chaîner les Promises sans les imbriquer
- [ ] Je sais utiliser `Promise.all()` pour exécuter des Promises en parallèle
- [ ] Je comprends la différence entre `Promise.all`, `allSettled`, `race` et `any`
- [ ] Je gère toujours les erreurs avec `.catch()`

---

## Exercice Pratique

**Énoncé** : Crée un système de chargement de données simulé avec Promises.

1. Crée une fonction `charger(url, delai)` qui simule un appel réseau retournant une Promise.
2. La fonction doit échouer aléatoirement (environ 20 % du temps).
3. Crée une fonction `chargerAvecRetry(url, delai, maxRetries)` qui retente automatiquement en cas d'échec.
4. Utilise `Promise.all()` pour charger 3 ressources en parallèle avec retry.
5. Utilise `Promise.allSettled()` pour afficher le statut de chaque chargement.

**Indications** :

- Utilise `Math.random()` pour simuler les erreurs aléatoires.
- Pour le retry, appelle récursivement la fonction en décrémentant le compteur.
- Affiche un message à chaque tentative.

**Résultat attendu** :

```text
Chargement de /api/users (tentative 1)...
Chargement de /api/products (tentative 1)...
Chargement de /api/orders (tentative 1)...
/api/products chargé avec succès
/api/users a échoué, nouvelle tentative...
Chargement de /api/users (tentative 2)...
/api/orders chargé avec succès
/api/users chargé avec succès

=== Résultats ===
/api/users : Données de /api/users
/api/products : Données de /api/products
/api/orders : Données de /api/orders
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Simuler un chargement réseau qui peut échouer
const charger = (url, delai = 200) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      // 20% de chance d'échec
      if (Math.random() < 0.2) {
        reject(new Error(`Échec du chargement de ${url}`));
      } else {
        resolve(`Données de ${url}`);
      }
    }, delai);
  });
};

// Charger avec retry automatique
const chargerAvecRetry = (url, delai = 200, maxRetries = 3, tentative = 1) => {
  console.log(`Chargement de ${url} (tentative ${tentative})...`);

  return charger(url, delai)
    .then((resultat) => {
      console.log(`${url} chargé avec succès`);
      return resultat;
    })
    .catch((erreur) => {
      if (tentative < maxRetries) {
        console.log(`${url} a échoué, nouvelle tentative...`);
        // Retente avec le compteur incrémenté
        return chargerAvecRetry(url, delai, maxRetries, tentative + 1);
      }
      // Plus de tentatives disponibles
      throw new Error(`${url} a échoué après ${maxRetries} tentatives`);
    });
};

// Charger 3 ressources en parallèle avec retry
const urls = ["/api/users", "/api/products", "/api/orders"];

Promise.allSettled(urls.map((url) => chargerAvecRetry(url, 100, 3))).then(
  (resultats) => {
    console.log("\n=== Résultats ===");
    resultats.forEach((r, i) => {
      if (r.status === "fulfilled") {
        console.log(`${urls[i]} : ${r.value}`);
      } else {
        console.log(`${urls[i]} : ÉCHEC - ${r.reason.message}`);
      }
    });
  }
);
```

---

## Navigation

← Fiche précédente : **[Itérateurs et générateurs](08-iterateurs-generateurs.md)**

→ Fiche suivante : **[Async/await](10-async-await.md)**
