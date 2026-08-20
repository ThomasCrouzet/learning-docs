---
tags:
  - Architecture
  - Intermédiaire
  - Pratique
description: "Patterns JavaScript : module pattern, observer en JS, pub/sub, middleware pattern."
estimated_time: "75 min"
fiche_number: 10
total_fiches: 17
cursus: "Architecture et Design Patterns"
---

# 10 - Patterns JavaScript

> **En bref** : Comprendre et implémenter les design patterns les plus courants en JavaScript : module pattern, observer, pub/sub et middleware pattern. Lecture estimée : 75 min.

## Prérequis

- Fiche 6 : [Patterns de comportement](06-patterns-comportement.md)
- [Cursus JavaScript Moderne](../06-javascript-moderne/index.md), fiches 1 à 6 (let/const, arrow functions, destructuring, modules ES)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter le module pattern pour encapsuler du code, utiliser le pattern observer en JavaScript natif, créer un système pub/sub pour découpler les composants et implémenter un middleware pattern pour les traitements en chaîne.

---

## Concepts

### Pourquoi des patterns spécifiques à JavaScript ?

**Définition** : JavaScript a des particularités qui rendent certains patterns différents de leur version PHP : les closures, le prototypage, les fonctions de première classe et la nature asynchrone du langage.

**Le problème que les patterns JS résolvent** :

Sans patterns adaptés à JavaScript, voici les problèmes rencontrés :

1. **Pollution du scope global** : toutes les variables et fonctions sont dans le scope global, créant des conflits de noms.
2. **Couplage entre composants** : les modules s'appellent directement les uns les autres, rendant les modifications risquées.
3. **Traitements séquentiels rigides** : chaque étape de traitement est codée en dur, impossible d'ajouter ou retirer une étape sans modifier le code existant.

**Comment les patterns JS résolvent ces problèmes** :

| Problème | Pattern | Solution |
| --- | --- | --- |
| Pollution du scope global | Module Pattern | Encapsulation via closures ou modules ES |
| Couplage entre composants | Observer / Pub/Sub | Communication indirecte entre composants |
| Traitements séquentiels rigides | Middleware | Pipeline de fonctions composable |

**Analogie concrète** : En PHP, le langage fournit des classes, des namespaces et des modificateurs de visibilité (private, protected, public). En JavaScript, ces mécanismes n'existent pas naturellement (avant les modules ES et les classes). Les patterns JS compensent ces manques en utilisant les forces du langage : closures, fonctions de première classe et chaînes de callbacks.

---

### Module Pattern

**Définition** : Le module pattern utilise les closures de JavaScript pour créer un espace de noms privé. Les variables et fonctions internes ne sont pas accessibles de l'extérieur, seule l'API publique est exposée.

**Le problème que le module pattern résout** :

Sans module pattern, voici les problèmes rencontrés :

1. **Variables globales** : toute variable déclarée sans `let` ou `const` dans un module est globale et peut être écrasée par un autre script.
2. **Pas d'encapsulation** : en JavaScript classique (avant les modules ES), il n'y a pas de `private` ou `protected`.
3. **Conflits de noms** : deux scripts qui utilisent le même nom de variable se marchent dessus.

**Analogie concrète** : Pense à un distributeur automatique. Tu vois les boutons (API publique) et tu peux appuyer dessus. Mais tu ne peux pas accéder au mécanisme interne, au stock de boissons ou au système de paiement. Le module pattern fonctionne pareil : il expose des boutons (méthodes publiques) et cache la mécanique interne (variables et fonctions privées).

**Ce que le module pattern n'est PAS** :

- Le module pattern n'est pas la syntaxe `import/export` d'ES6. Les modules ES sont le remplacement moderne du module pattern classique. Cependant, le principe d'encapsulation reste le même.
- Le module pattern n'est pas un Singleton. Même s'il y a des similitudes (une seule instance), le module pattern vise l'encapsulation, pas la restriction d'instances.

**Implementation classique (IIFE)** :

```javascript
// Module Pattern avec une IIFE (Immediately Invoked Function Expression)
// La fonction est exécutée immédiatement et retourne un objet
const CartModule = (function () {
  // Variables PRIVÉES : inaccessibles de l'extérieur
  let items = [];
  let discount = 0;

  // Fonction PRIVÉE : pas accessible de l'extérieur
  function calculateSubtotal() {
    return items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // API PUBLIQUE : seul cet objet est retourné
  return {
    // Méthode publique : ajouter un article
    addItem(name, price, quantity = 1) {
      // Validation dans le module
      if (price <= 0) {
        throw new Error("Le prix doit être positif");
      }

      if (quantity <= 0) {
        throw new Error("La quantité doit être positive");
      }

      items.push({ name, price, quantity });
    },

    // Méthode publique : retirer un article
    removeItem(name) {
      items = items.filter((item) => item.name !== name);
    },

    // Méthode publique : appliquer une remise
    applyDiscount(percent) {
      if (percent < 0 || percent > 100) {
        throw new Error("La remise doit être entre 0 et 100");
      }

      discount = percent;
    },

    // Méthode publique : obtenir le total
    getTotal() {
      const subtotal = calculateSubtotal(); // Appel à la fonction privée
      return subtotal * (1 - discount / 100);
    },

    // Méthode publique : obtenir le nombre d'articles
    getItemCount() {
      return items.length;
    },
  };
})();

// Utilisation
CartModule.addItem("Clavier", 49.99, 1);
CartModule.addItem("Souris", 29.99, 2);
console.log(CartModule.getTotal()); // 109.97

CartModule.applyDiscount(10);
console.log(CartModule.getTotal()); // 98.973

// Les variables privées sont inaccessibles
console.log(CartModule.items); // undefined
console.log(CartModule.calculateSubtotal); // undefined
```

**Implementation moderne (modules ES)** :

```javascript
// cart.js -- Module ES (chaque fichier est un module)
// Les variables non exportees sont privees au fichier

// Variable PRIVÉE : pas exportée
let items = [];
let discount = 0;

// Fonction PRIVÉE : pas exportée
function calculateSubtotal() {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

// Fonctions PUBLIQUES : exportées
export function addItem(name, price, quantity = 1) {
  if (price <= 0) {
    throw new Error("Le prix doit etre positif");
  }

  items.push({ name, price, quantity });
}

export function removeItem(name) {
  items = items.filter((item) => item.name !== name);
}

export function applyDiscount(percent) {
  if (percent < 0 || percent > 100) {
    throw new Error("La remise doit etre entre 0 et 100");
  }

  discount = percent;
}

export function getTotal() {
  const subtotal = calculateSubtotal();
  return subtotal * (1 - discount / 100);
}

export function getItemCount() {
  return items.length;
}
```

```javascript
// main.js -- Utilisation du module ES
import { addItem, getTotal, applyDiscount } from "./cart.js";

addItem("Clavier", 49.99);
addItem("Souris", 29.99, 2);
console.log(getTotal()); // 109.97

applyDiscount(10);
console.log(getTotal()); // 98.973
```

**Comparaison IIFE vs modules ES** :

| Module Pattern (IIFE) | Modules ES (import/export) |
| --- | --- |
| Fonctionne dans tous les navigateurs | Nécessite un bundler ou `type="module"` |
| Une seule instance par défaut | Une seule instance par défaut |
| Encapsulation via closure | Encapsulation via le fichier |
| Pas de dépendances déclarées | Dépendances explicites (`import`) |
| Ancien, mais encore utilisé dans les librairies | Standard moderne recommandé |

---

### Observer Pattern en JavaScript

**Définition** : Le pattern observer en JavaScript utilise les fonctions de première classe pour enregistrer des callbacks qui seront appelés quand un événement se produit. C'est le même principe qu'en PHP (fiche 6), mais la syntaxe est différente grâce aux particularités de JS.

**Le problème que Observer résout en JS** :

Sans observer en JS, voici les problèmes rencontrés :

1. **Polling du DOM** : vérifier régulièrement si un élément a changé au lieu d'être notifié.
2. **Couplage entre composants UI** : un composant de formulaire doit connaître et appeler directement le composant de tableau pour le mettre à jour.
3. **Code spaghetti** : les callbacks sont imbriqués et les dépendances sont implicites.

**Analogie concrète** : Pense à une sonnette de porte. Tu n'ouvres pas la porte toutes les 5 secondes pour vérifier si quelqu'un est là (polling). Tu installes une sonnette (observer) qui te notifie quand quelqu'un appuie dessus. En JavaScript, `addEventListener` est exactement ce mécanisme.

**Observer natif dans le navigateur** :

```javascript
// JavaScript fournit le pattern Observer nativement via addEventListener

// L'élément HTML est le "Subject" (l'objet observé)
const button = document.querySelector("#submit-btn");

// Chaque addEventListener enregistre un "Observer"
button.addEventListener("click", function (event) {
  console.log("Observer 1 : le bouton a été cliqué");
});

button.addEventListener("click", function (event) {
  console.log("Observer 2 : envoi des statistiques");
});

// Quand le bouton est cliqué, les deux observers sont notifiés
// L'ordre de notification est l'ordre d'enregistrement
```

**Implementation personnalisee** :

```javascript
// Classe EventEmitter : implementation du pattern Observer
class EventEmitter {
  constructor() {
    // Map des événements : chaque événement a un tableau de listeners
    this.listeners = new Map();
  }

  // S'abonner à un événement
  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

    // Retourne une fonction de désabonnement
    return () => this.off(event, callback);
  }

  // Se désabonner d'un événement
  off(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  // S'abonner une seule fois (le listener est retiré après le premier appel)
  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }

  // Émettre un événement : notifier tous les listeners
  emit(event, ...args) {
    if (!this.listeners.has(event)) {
      return;
    }

    // On copie le tableau pour éviter les problèmes si un listener
    // se désabonne pendant la notification
    const callbacks = [...this.listeners.get(event)];

    for (const callback of callbacks) {
      callback(...args);
    }
  }
}

// Utilisation
const emitter = new EventEmitter();

// Abonnement
emitter.on("product:added", (product) => {
  console.log(`Produit ajouté : ${product.name}`);
});

emitter.on("product:added", (product) => {
  console.log(`Mise à jour du compteur : +1`);
});

// S'abonner une seule fois
emitter.once("product:added", (product) => {
  console.log("Premier ajout ! (ce message n'apparaît qu'une fois)");
});

// Emission
emitter.emit("product:added", { name: "Clavier", price: 49.99 });
// Affiche :
// Produit ajouté : Clavier
// Mise à jour du compteur : +1
// Premier ajout ! (ce message n'apparaît qu'une fois)

emitter.emit("product:added", { name: "Souris", price: 29.99 });
// Affiche :
// Produit ajoute : Souris
// Mise a jour du compteur : +1
// (le "once" n'apparaît plus)
```

---

### Pub/Sub (Publish/Subscribe)

**Définition** : Le pattern pub/sub est une variante du pattern observer où les émetteurs (publishers) et les récepteurs (subscribers) ne se connaissent pas. Ils communiquent via un intermédiaire appelé "message broker" ou "event bus".

**Le problème que Pub/Sub résout** :

Sans pub/sub, voici les problèmes rencontrés :

1. **Couplage émetteur-récepteur** : dans le pattern observer classique, le subject connaît ses observers (il les stocke dans un tableau).
2. **Communication inter-composants difficile** : deux composants éloignés dans l'architecture doivent passer par de nombreux intermédiaires pour communiquer.
3. **Scalabilité limitée** : ajouter un nouveau récepteur oblige à modifier l'émetteur.

**Comparaison Observer vs Pub/Sub** :

| Observer | Pub/Sub |
| --- | --- |
| Le subject connaît ses observers | Le publisher ne connaît pas les subscribers |
| Communication directe | Communication via un intermédiaire (broker) |
| Couplage faible | Couplage très faible (quasi nul) |
| Simple à implémenter | Nécessite un broker central |

**Analogie concrète** : Observer, c'est un professeur qui connaît ses élèves et les appelle par leur nom quand il a une annonce. Pub/Sub, c'est un tableau d'affichage : le professeur affiche un message, et tous les élèves qui regardent le tableau le voient, sans que le professeur sache qui a lu le message.

**Implementation** :

```javascript
// Event Bus : l'intermédiaire central du pattern Pub/Sub
class EventBus {
  constructor() {
    this.subscriptions = new Map();
  }

  // S'abonner a un canal
  subscribe(channel, callback) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }

    this.subscriptions.get(channel).push(callback);

    // Retourne une fonction pour se désabonner
    return () => {
      const callbacks = this.subscriptions.get(channel);
      const index = callbacks.indexOf(callback);

      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  // Publier un message sur un canal
  publish(channel, data) {
    if (!this.subscriptions.has(channel)) {
      return;
    }

    const callbacks = [...this.subscriptions.get(channel)];

    for (const callback of callbacks) {
      callback(data);
    }
  }

  // S'abonner avec un filtre (pattern matching)
  subscribePattern(pattern, callback) {
    // Convertir le pattern glob en regex
    // "user.*" matche "user.created", "user.updated", etc.
    const regex = new RegExp("^" + pattern.replace(/\*/g, "[^.]+") + "$");

    // On s'abonne à un listener spécial qui vérifie le pattern
    this._patternListeners = this._patternListeners || [];
    this._patternListeners.push({ regex, callback });
  }

  // Version étendue de publish qui gère les patterns
  publishWithPatterns(channel, data) {
    // Notifier les abonnés exacts
    this.publish(channel, data);

    // Notifier les abonnés par pattern
    if (this._patternListeners) {
      for (const { regex, callback } of this._patternListeners) {
        if (regex.test(channel)) {
          callback({ channel, data });
        }
      }
    }
  }
}

// Instance globale du bus (singleton)
const bus = new EventBus();

// Composant A : le formulaire (publisher)
// Il ne connait PAS le composant B
function handleFormSubmit(formData) {
  // Le formulaire publie un événement sur le bus
  bus.publish("form:submitted", {
    name: formData.name,
    email: formData.email,
  });
}

// Composant B : le tableau (subscriber)
// Il ne connait PAS le composant A
bus.subscribe("form:submitted", (data) => {
  console.log(`Nouvelle entrée dans le tableau : ${data.name}`);
  // Mettre a jour le tableau ici
});

// Composant C : les notifications (subscriber)
// Il ne connait ni A ni B
bus.subscribe("form:submitted", (data) => {
  console.log(`Notification : un formulaire a été soumis par ${data.email}`);
});

// Quand le formulaire est soumis :
handleFormSubmit({ name: "Alice", email: "alice@example.com" });
// Affiche :
// Nouvelle entree dans le tableau : Alice
// Notification : un formulaire a ete soumis par alice@example.com
```

---

### Middleware Pattern

**Définition** : Le middleware pattern organise le traitement d'une requête (ou d'une donnée) en une chaîne de fonctions. Chaque middleware peut traiter la donnée, la modifier et décider de passer au middleware suivant ou d'arrêter la chaîne.

**Le problème que le middleware pattern résout** :

Sans middleware, voici les problèmes rencontrés :

1. **Fonction monolithique** : tout le traitement est dans une seule fonction géante (validation, authentification, logging, transformation).
2. **Traitements non configurables** : impossible d'ajouter ou retirer une étape de traitement sans modifier la fonction principale.
3. **Réutilisation impossible** : la logique de logging est copiée-collée dans chaque route.

**Comment le middleware pattern résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Fonction monolithique | Chaque étape est un middleware indépendant |
| Traitements non configurables | On ajoute/retire des middlewares sans modifier les autres |
| Réutilisation impossible | Un middleware est réutilisable dans plusieurs chaînes |

**Analogie concrète** : Pense à une chaîne de montage dans une usine. Chaque poste (middleware) effectue une opération sur le produit : assemblage, peinture, contrôle qualité, emballage. On peut ajouter un nouveau poste (par exemple, gravure du numéro de série) ou retirer un poste (par exemple, skip la peinture pour un modèle brut) sans réorganiser toute la chaîne.

**Implementation** :

```javascript
// Classe Middleware Pipeline
class MiddlewarePipeline {
  constructor() {
    this.middlewares = [];
  }

  // Ajouter un middleware à la chaîne
  use(middleware) {
    this.middlewares.push(middleware);
    return this; // Permet le chainage : pipeline.use(a).use(b)
  }

  // Exécuter la chaîne de middlewares
  execute(context) {
    // On crée une chaîne où chaque middleware appelle le suivant
    let index = 0;

    const next = () => {
      // S'il reste des middlewares, on execute le suivant
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        middleware(context, next);
      }
    };

    // Lancer la chaîne
    next();

    return context;
  }
}

// Middleware 1 : logging
function loggingMiddleware(context, next) {
  console.log(`[LOG] Requête reçue : ${context.method} ${context.path}`);
  const start = Date.now();

  // Passer au middleware suivant
  next();

  // Après le traitement (le middleware peut agir avant ET après)
  const duration = Date.now() - start;
  console.log(`[LOG] Requête traitée en ${duration}ms`);
}

// Middleware 2 : authentification
function authMiddleware(context, next) {
  if (!context.headers.authorization) {
    context.status = 401;
    context.body = { error: "Non authentifié" };
    // On N'APPELLE PAS next() : la chaîne s'arrête ici
    return;
  }

  // Simuler la vérification du token
  context.user = { id: "user_1", name: "Alice" };
  console.log(`[AUTH] Utilisateur authentifié : ${context.user.name}`);

  // Passer au middleware suivant
  next();
}

// Middleware 3 : validation
function validationMiddleware(context, next) {
  if (context.method === "POST" && !context.body) {
    context.status = 400;
    context.body = { error: "Corps de requête manquant" };
    return; // Arrêt de la chaîne
  }

  console.log("[VALIDATION] Requête valide");
  next();
}

// Middleware 4 : handler final (le traitement reel)
function handler(context, next) {
  context.status = 200;
  context.body = {
    message: `Bonjour ${context.user.name}`,
    path: context.path,
  };
  console.log("[HANDLER] Réponse générée");
  // Pas besoin d'appeler next() : c'est le dernier middleware
}

// Assemblage de la chaine
const pipeline = new MiddlewarePipeline();

pipeline
  .use(loggingMiddleware)
  .use(authMiddleware)
  .use(validationMiddleware)
  .use(handler);

// Exécution avec une requête authentifiée
const context = {
  method: "GET",
  path: "/api/profile",
  headers: { authorization: "Bearer token123" },
  status: null,
  body: null,
};

pipeline.execute(context);
// Affiche :
// [LOG] Requete recue : GET /api/profile
// [AUTH] Utilisateur authentifie : Alice
// [VALIDATION] Requête valide
// [HANDLER] Reponse generee
// [LOG] Requete traitee en 0ms

console.log(context.status); // 200
console.log(context.body);   // { message: "Bonjour Alice", path: "/api/profile" }
```

**Middleware asynchrone** :

```javascript
// Version asynchrone du middleware pipeline
class AsyncMiddlewarePipeline {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  // Version asynchrone : chaque middleware peut être async
  async execute(context) {
    let index = 0;

    const next = async () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        await middleware(context, next);
      }
    };

    await next();
    return context;
  }
}

// Middleware asynchrone : log dans un fichier (simulé)
async function asyncLoggingMiddleware(context, next) {
  console.log(`[LOG] Debut : ${context.path}`);

  await next(); // Attendre que les middlewares suivants finissent

  console.log(`[LOG] Fin : statut ${context.status}`);
}

// Middleware asynchrone : vérification en base de données (simulé)
async function asyncAuthMiddleware(context, next) {
  // Simuler une requête async (base de données, API, etc.)
  const user = await new Promise((resolve) => {
    setTimeout(() => resolve({ id: "user_1", name: "Alice" }), 100);
  });

  context.user = user;
  console.log(`[AUTH] Utilisateur chargé : ${user.name}`);

  await next();
}

// Utilisation
const asyncPipeline = new AsyncMiddlewarePipeline();

asyncPipeline.use(asyncLoggingMiddleware).use(asyncAuthMiddleware);
```

---

## Étapes Pratiques

### Étape 1 : Créer un module de gestion de tâches

Crée un fichier `taskManager.js` avec le module pattern :

```javascript
// taskManager.js -- Module de gestion de tâches
const TaskManager = (function () {
  // Données privées
  let tasks = [];
  let nextId = 1;

  // Fonction privée : trouver une tâche par ID
  function findTaskById(id) {
    return tasks.find((task) => task.id === id);
  }

  // API publique
  return {
    // Ajouter une tâche
    add(title, priority = "normal") {
      if (!title || title.trim() === "") {
        throw new Error("Le titre est obligatoire");
      }

      const validPriorities = ["low", "normal", "high"];

      if (!validPriorities.includes(priority)) {
        throw new Error(
          `Priorité invalide : ${priority}. ` +
            `Valeurs possibles : ${validPriorities.join(", ")}`
        );
      }

      const task = {
        id: nextId++,
        title: title.trim(),
        priority,
        done: false,
        createdAt: new Date().toISOString(),
      };

      tasks.push(task);
      return task;
    },

    // Marquer une tâche comme terminée
    complete(id) {
      const task = findTaskById(id);

      if (!task) {
        throw new Error(`Tâche #${id} non trouvée`);
      }

      task.done = true;
      return task;
    },

    // Supprimer une tâche
    remove(id) {
      const index = tasks.findIndex((task) => task.id === id);

      if (index === -1) {
        throw new Error(`Tâche #${id} non trouvée`);
      }

      return tasks.splice(index, 1)[0];
    },

    // Lister les tâches (avec filtre optionnel)
    list(filter = "all") {
      switch (filter) {
        case "done":
          return tasks.filter((task) => task.done);
        case "pending":
          return tasks.filter((task) => !task.done);
        case "all":
          return [...tasks]; // Copie du tableau
        default:
          throw new Error(`Filtre invalide : ${filter}`);
      }
    },

    // Statistiques
    stats() {
      return {
        total: tasks.length,
        done: tasks.filter((t) => t.done).length,
        pending: tasks.filter((t) => !t.done).length,
      };
    },
  };
})();
```

**Résultat attendu** :

```text
TaskManager.add("Apprendre les design patterns", "high");
TaskManager.add("Faire les courses");
TaskManager.add("Répondre aux emails", "low");

console.log(TaskManager.stats());
// { total: 3, done: 0, pending: 3 }

TaskManager.complete(1);
console.log(TaskManager.list("done"));
// [{ id: 1, title: "Apprendre les design patterns", done: true, ... }]

// Les données privées sont inaccessibles
console.log(TaskManager.tasks);    // undefined
console.log(TaskManager.findTask); // undefined
```

---

### Étape 2 : Créer un EventEmitter réutilisable

```javascript
// eventEmitter.js -- Observer réutilisable
class EventEmitter {
  constructor() {
    this.listeners = new Map();
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }

    this.listeners.get(event).push(callback);

    // Retourne une fonction de désabonnement
    return () => this.off(event, callback);
  }

  off(event, callback) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = this.listeners.get(event);
    const index = callbacks.indexOf(callback);

    if (index !== -1) {
      callbacks.splice(index, 1);
    }
  }

  once(event, callback) {
    const wrapper = (...args) => {
      callback(...args);
      this.off(event, wrapper);
    };

    this.on(event, wrapper);
  }

  emit(event, ...args) {
    if (!this.listeners.has(event)) {
      return;
    }

    const callbacks = [...this.listeners.get(event)];

    for (const callback of callbacks) {
      callback(...args);
    }
  }
}

// Utilisation : un store réactif
class Store extends EventEmitter {
  constructor(initialState = {}) {
    super();
    this.state = { ...initialState };
  }

  // Mettre à jour l'état et notifier les observers
  setState(updates) {
    const previousState = { ...this.state };
    this.state = { ...this.state, ...updates };

    // Émettre un événement pour chaque propriété modifiée
    for (const key of Object.keys(updates)) {
      if (previousState[key] !== updates[key]) {
        this.emit(`change:${key}`, {
          previous: previousState[key],
          current: updates[key],
        });
      }
    }

    // Émettre un événement global
    this.emit("change", {
      previous: previousState,
      current: this.state,
    });
  }

  getState() {
    return { ...this.state };
  }
}

// Utilisation du store
const store = new Store({ count: 0, name: "Alice" });

// Observer le compteur
store.on("change:count", ({ previous, current }) => {
  console.log(`Compteur : ${previous} -> ${current}`);
});

// Observer tous les changements
store.on("change", ({ current }) => {
  console.log("État complet :", current);
});

store.setState({ count: 1 });
// Affiche :
// Compteur : 0 -> 1
// État complet : { count: 1, name: "Alice" }
```

**Résultat attendu** :

```text
store.setState({ count: 1 });
// Compteur : 0 -> 1
// État complet : { count: 1, name: "Alice" }

store.setState({ name: "Bob" });
// État complet : { count: 1, name: "Bob" }
// (pas de notification "change:count" car le compteur n'a pas changé)
```

---

### Étape 3 : Créer un middleware de traitement de formulaire

```javascript
// formPipeline.js -- Middleware pour le traitement de formulaires
class FormPipeline {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  process(formData) {
    const context = {
      data: { ...formData },
      errors: [],
      isValid: true,
    };

    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        middleware(context, next);
      }
    };

    next();
    return context;
  }
}

// Middleware : nettoyer les espaces
function trimMiddleware(context, next) {
  for (const key of Object.keys(context.data)) {
    if (typeof context.data[key] === "string") {
      context.data[key] = context.data[key].trim();
    }
  }

  next();
}

// Middleware : champs obligatoires
function requiredFieldsMiddleware(fields) {
  // Retourne un middleware configuré avec les champs obligatoires
  return function (context, next) {
    for (const field of fields) {
      if (!context.data[field] || context.data[field] === "") {
        context.errors.push(`Le champ '${field}' est obligatoire`);
        context.isValid = false;
      }
    }

    next(); // On continue même avec des erreurs (pour les collecter toutes)
  };
}

// Middleware : validation email
function emailValidationMiddleware(field) {
  return function (context, next) {
    const email = context.data[field];

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      context.errors.push(`Le champ '${field}' n'est pas un email valide`);
      context.isValid = false;
    }

    next();
  };
}

// Middleware : normalisation
function normalizeMiddleware(context, next) {
  if (context.data.email) {
    context.data.email = context.data.email.toLowerCase();
  }

  if (context.data.name) {
    // Première lettre en majuscule
    context.data.name =
      context.data.name.charAt(0).toUpperCase() +
      context.data.name.slice(1).toLowerCase();
  }

  next();
}

// Assemblage
const formPipeline = new FormPipeline();

formPipeline
  .use(trimMiddleware)
  .use(requiredFieldsMiddleware(["name", "email"]))
  .use(emailValidationMiddleware("email"))
  .use(normalizeMiddleware);
```

**Résultat attendu** :

```text
// Formulaire valide
const result1 = formPipeline.process({
  name: "  alice  ",
  email: "  Alice@Example.COM  ",
});
console.log(result1.isValid);    // true
console.log(result1.data.name);  // "Alice"
console.log(result1.data.email); // "alice@example.com"
console.log(result1.errors);     // []

// Formulaire invalide
const result2 = formPipeline.process({
  name: "",
  email: "pas-un-email",
});
console.log(result2.isValid); // false
console.log(result2.errors);
// [
//   "Le champ 'name' est obligatoire",
//   "Le champ 'email' n'est pas un email valide"
// ]
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `node script.js` | Exécuter un fichier JavaScript avec Node.js |
| `node fichier.mjs` | Exécuter un module ES (extension `.mjs` ou `"type": "module"` dans `package.json`) |
| `node --experimental-vm-modules script.js` | Active le support expérimental des modules ES dans `node:vm` uniquement (inutile pour un `import`/`export` standard sous Node.js 22) |
| `console.dir(obj, { depth: null })` | Afficher un objet en profondeur dans Node.js |
| `typeof variable` | Vérifier le type d'une variable |

---

## Pièges Fréquents

### Piège 1 : Oublier le `this` dans les callbacks

⚠️ **Problème** : Dans un callback classique (`function`), `this` ne pointe pas vers l'objet attendu. Les méthodes de classe passées en callback perdent leur contexte.

✅ **Solution** : Utilise des arrow functions (qui capturent le `this` de leur environnement) ou `.bind(this)`.

```javascript
// ❌ this est perdu dans le callback
class Counter {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(function () {
      this.count++; // Erreur : this n'est pas le Counter
    }, 1000);
  }
}

// ✅ Arrow function capture le bon this
class Counter {
  constructor() {
    this.count = 0;
  }

  start() {
    setInterval(() => {
      this.count++; // OK : this est le Counter
    }, 1000);
  }
}
```

### Piège 2 : Fuites de mémoire avec les listeners

⚠️ **Problème** : Tu enregistres des listeners sans jamais les retirer. Si l'objet observé est détruit mais les listeners restent, la mémoire n'est pas libérée.

✅ **Solution** : Conserve la fonction de désabonnement retournée par `on()` et appelle-la quand tu n'as plus besoin du listener.

```javascript
// ❌ Listener jamais retiré
emitter.on("update", handleUpdate);
// Si handleUpdate référence un gros objet, il ne sera jamais libéré

// ✅ On conserve la référence pour se désabonner
const unsubscribe = emitter.on("update", handleUpdate);
// Plus tard, quand le composant est détruit :
unsubscribe();
```

### Piège 3 : Middleware qui ne s'arrête pas

⚠️ **Problème** : Un middleware de validation détecte une erreur mais appelle quand même `next()`, ce qui exécute les middlewares suivants avec des données invalides.

✅ **Solution** : Quand un middleware détecte une erreur bloquante, il ne doit PAS appeler `next()`.

```javascript
// ❌ Le middleware continue malgre l'erreur
function authMiddleware(context, next) {
  if (!context.token) {
    context.error = "Non authentifié";
  }

  next(); // Continue même sans authentification
}

// ✅ Le middleware arrete la chaine si erreur bloquante
function authMiddleware(context, next) {
  if (!context.token) {
    context.error = "Non authentifie";
    return; // Arrêt de la chaîne
  }

  next();
}
```

---

## Checklist de Validation

- [ ] Je sais créer un module avec le module pattern (IIFE) et avec les modules ES
- [ ] Je sais implémenter le pattern observer avec un EventEmitter
- [ ] Je comprends la différence entre observer et pub/sub
- [ ] Je sais créer un event bus pour le pattern pub/sub
- [ ] Je sais implémenter un middleware pipeline (synchrone et asynchrone)
- [ ] Je sais quand utiliser chaque pattern dans une application JavaScript

---

## Exercice Pratique

**Énoncé** : Crée un système de chat simplifié en utilisant les patterns observer et middleware.

**Instructions** :

1. Crée un `EventBus` (pub/sub) pour la communication entre composants
2. Crée un `MessagePipeline` (middleware) qui enchaîne : trim, censure de mots interdits, ajout d'un timestamp
3. Crée un composant `ChatRoom` qui utilise le bus pour publier les messages traités
4. Crée deux composants `ChatDisplay` qui s'abonnent aux messages et les affichent

**Résultat attendu** : Les messages passent par le pipeline de middlewares avant d'être publiés sur le bus, et les deux displays les reçoivent.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**1. Event Bus** :

```javascript
class EventBus {
  constructor() {
    this.subscriptions = new Map();
  }

  subscribe(channel, callback) {
    if (!this.subscriptions.has(channel)) {
      this.subscriptions.set(channel, []);
    }

    this.subscriptions.get(channel).push(callback);

    return () => {
      const callbacks = this.subscriptions.get(channel);
      const index = callbacks.indexOf(callback);

      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    };
  }

  publish(channel, data) {
    if (!this.subscriptions.has(channel)) {
      return;
    }

    for (const callback of [...this.subscriptions.get(channel)]) {
      callback(data);
    }
  }
}

const bus = new EventBus();
```

**2. Message Pipeline** :

```javascript
class MessagePipeline {
  constructor() {
    this.middlewares = [];
  }

  use(middleware) {
    this.middlewares.push(middleware);
    return this;
  }

  process(message) {
    let index = 0;

    const next = () => {
      if (index < this.middlewares.length) {
        const middleware = this.middlewares[index];
        index++;
        middleware(message, next);
      }
    };

    next();
    return message;
  }
}

// Middleware : trim
function trimMiddleware(message, next) {
  message.text = message.text.trim();
  next();
}

// Middleware : censure
function censorMiddleware(message, next) {
  const bannedWords = ["spam", "pub", "arnaque"];

  for (const word of bannedWords) {
    const regex = new RegExp(word, "gi");
    message.text = message.text.replace(regex, "***");
  }

  next();
}

// Middleware : timestamp
function timestampMiddleware(message, next) {
  message.timestamp = new Date().toISOString();
  next();
}

// Middleware : validation (bloque les messages vides)
function validationMiddleware(message, next) {
  if (!message.text || message.text.length === 0) {
    message.blocked = true;
    return; // Arrêt de la chaîne
  }

  if (message.text.length > 500) {
    message.blocked = true;
    message.error = "Message trop long (500 caractères max)";
    return;
  }

  next();
}

const pipeline = new MessagePipeline();

pipeline
  .use(trimMiddleware)
  .use(validationMiddleware)
  .use(censorMiddleware)
  .use(timestampMiddleware);
```

**3. ChatRoom (publisher)** :

```javascript
class ChatRoom {
  constructor(name, bus, pipeline) {
    this.name = name;
    this.bus = bus;
    this.pipeline = pipeline;
  }

  send(author, text) {
    const message = { author, text, room: this.name };

    // Le message passe par le pipeline de middlewares
    this.pipeline.process(message);

    // Si le message est bloqué, on ne le publie pas
    if (message.blocked) {
      console.log(`[${this.name}] Message bloqué : ${message.error || "vide"}`);
      return;
    }

    // Publier le message traité sur le bus
    this.bus.publish(`chat:${this.name}`, message);
  }
}
```

**4. ChatDisplay (subscriber)** :

```javascript
class ChatDisplay {
  constructor(name, bus, room) {
    this.name = name;

    // S'abonner aux messages de la room
    this.unsubscribe = bus.subscribe(`chat:${room}`, (message) => {
      this.showMessage(message);
    });
  }

  showMessage(message) {
    const time = message.timestamp
      ? new Date(message.timestamp).toLocaleTimeString()
      : "??:??";

    console.log(`[${this.name}] ${time} - ${message.author}: ${message.text}`);
  }

  destroy() {
    // Se désabonner pour éviter les fuites mémoire
    this.unsubscribe();
  }
}

// Assemblage
const room = new ChatRoom("general", bus, pipeline);
const display1 = new ChatDisplay("Écran principal", bus, "general");
const display2 = new ChatDisplay("Écran secondaire", bus, "general");

// Test
room.send("Alice", "Bonjour tout le monde !");
// [Écran principal] 14:30:00 - Alice: Bonjour tout le monde !
// [Écran secondaire] 14:30:00 - Alice: Bonjour tout le monde !

room.send("Bob", "  Ceci est du spam  ");
// [Écran principal] 14:30:01 - Bob: Ceci est du ***
// [Écran secondaire] 14:30:01 - Bob: Ceci est du ***

room.send("Charlie", "   "); // Message vide après trim
// [general] Message bloqué : vide
```

---

## Navigation

← Fiche précédente : **[Introduction au DDD](09-introduction-ddd.md)**

→ Fiche suivante : **[Anti-patterns](11-anti-patterns.md)**
