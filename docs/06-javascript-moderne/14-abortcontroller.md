---
tags:
  - JavaScript
  - Intermédiaire
  - Concept
description: "Annuler des opérations asynchrones avec AbortController et AbortSignal, gérer les timeouts, combiner des signaux et nettoyer dans React."
estimated_time: "75 min"
fiche_number: 14
total_fiches: 14
cursus: "JavaScript Moderne"
---

# 14 - AbortController et annulation

> **En bref** : Fiche de perfectionnement (après le projet intégrateur). Maîtriser `AbortController` et `AbortSignal` pour annuler une opération asynchrone, interrompre un `fetch()`, poser un timeout avec `AbortSignal.timeout()`, combiner plusieurs signaux avec `AbortSignal.any()` et nettoyer proprement les effets dans React. Lecture estimée : 75 min.

## Prérequis

- Fiche 09 : [Promises](09-promises.md)
- Fiche 10 : [Async/await](10-async-await.md)
- Fiche 11 : [Fetch API et HTTP](11-fetch-api-http.md)
- Fiche 12 : [Projet intégrateur](12-projet-integrateur.md)
- Pour l'étape 6 et le piège 3 (exemple React) : [cursus React](../08-react/index.md). Si tu n'as pas encore suivi React, saute cette étape.

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un `AbortController`, transmettre son `signal` à un `fetch()`, déclencher une annulation avec `abort()`, distinguer une annulation d'une vraie erreur, poser un timeout avec `AbortSignal.timeout()`, combiner plusieurs signaux avec `AbortSignal.any()`, et nettoyer un effet React avec un signal d'annulation.

---

## Concepts

### Qu'est-ce qu'AbortController ?

**Définition** : `AbortController` est un objet natif de JavaScript qui sert à annuler une opération asynchrone en cours (comme un `fetch()`). Il fournit un objet `signal` que tu passes à l'opération, et une méthode `abort()` qui déclenche l'annulation.

**Le problème qu'AbortController résout** :

Sans mécanisme d'annulation, voici les problèmes rencontrés :

1. **Requêtes inutiles** : l'utilisateur tape dans une barre de recherche, déclenche une requête par lettre, puis change d'avis. Sans annulation, toutes les requêtes continuent et consomment de la bande passante.
2. **Réponses obsolètes** : une vieille requête lente arrive après une requête plus récente et écrase le résultat affiché par des données périmées (problème de "course", ou race condition).
3. **Fuites mémoire** : un composant disparaît de l'écran, mais sa requête continue et tente de mettre à jour un élément qui n'existe plus.
4. **Blocage infini** : un serveur ne répond jamais et la requête reste en attente pour toujours, sans moyen de l'arrêter.

**Comment AbortController résout ces problèmes** :

| Problème | Solution apportée par AbortController |
| -------- | ------------------------------------- |
| Requêtes inutiles | `abort()` interrompt immédiatement une requête devenue inutile |
| Réponses obsolètes | On annule l'ancienne requête avant d'en lancer une nouvelle |
| Fuites mémoire | On annule la requête quand le composant disparaît |
| Blocage infini | `AbortSignal.timeout()` annule automatiquement après un délai |

**Analogie concrète** : `AbortController` est comme la commande d'un plat au restaurant avec un ticket d'annulation. Tu passes commande (tu lances le `fetch`), et tu gardes un ticket (le `controller`). Le `signal` est la copie du ticket que tu donnes en cuisine. Si tu changes d'avis, tu présentes ton ticket et tu dis "annulez" (`abort()`). La cuisine voit que la commande est annulée (`signal.aborted`) et arrête de la préparer. Sans ce ticket, impossible d'annuler une commande déjà lancée.

**Ce qu'AbortController n'est PAS** :

- `AbortController` n'est pas spécifique à `fetch()`. C'est un mécanisme général d'annulation que tu peux brancher sur n'importe quelle opération qui accepte un `signal` (lecture de fichier, écouteur d'événement, ton propre code asynchrone).
- `AbortController` n'est pas réutilisable. Une fois `abort()` appelé, le contrôleur est "consommé". Pour une nouvelle opération annulable, tu crées un nouveau `AbortController`.
- `AbortController` n'annule pas le travail déjà fait côté serveur. Il interrompt l'attente côté client ; le serveur peut avoir déjà traité la demande.

---

### AbortSignal, le messager de l'annulation

**Définition** : `AbortSignal` est l'objet `signal` exposé par un `AbortController` (via `controller.signal`). C'est lui que tu transmets à l'opération asynchrone. Il porte l'information "annulé ou non" et émet un événement `abort` au moment de l'annulation.

**Propriétés et méthodes principales** :

| Propriété / Méthode | Type | Description |
| -------------------- | ---- | ----------- |
| `signal.aborted` | `boolean` | `true` si l'annulation a déjà été déclenchée |
| `signal.reason` | `any` | La raison de l'annulation (par défaut une `AbortError`) |
| `signal.addEventListener("abort", fn)` | méthode | Réagit au moment de l'annulation |
| `signal.throwIfAborted()` | méthode | Lance une exception si déjà annulé |

**Analogie concrète** : si le `controller` est la télécommande, le `signal` est le voyant lumineux relié à cette télécommande. L'opération asynchrone surveille ce voyant. Tant qu'il est éteint (`aborted: false`), elle continue. Dès qu'il s'allume (`aborted: true`), elle s'arrête. Plusieurs opérations peuvent surveiller le même voyant en même temps.

**Comparaison `controller` vs `signal`** :

| `AbortController` (le contrôleur) | `AbortSignal` (le signal) |
| --------------------------------- | ------------------------- |
| Tu le gardes pour toi | Tu le passes à l'opération |
| Sert à déclencher : `abort()` | Sert à observer : `aborted`, événement `abort` |
| Un seul par opération annulable | Peut être lu par plusieurs opérations |

---

### L'erreur d'annulation : `AbortError`

**Définition** : Quand un `fetch()` est annulé, sa Promise est rejetée avec une erreur dont la propriété `name` vaut `"AbortError"`. Une annulation volontaire n'est pas une vraie erreur : il faut la distinguer d'une panne réseau pour ne pas afficher de message d'erreur à l'utilisateur.

**Règle** : dans un bloc `catch`, teste toujours `erreur.name === "AbortError"` pour reconnaître une annulation et la traiter différemment d'une erreur réelle.

```javascript
try {
  const reponse = await fetch(url, { signal });
  // ... traitement normal
} catch (erreur) {
  if (erreur.name === "AbortError") {
    // Annulation volontaire : ce n'est pas un bug, on ignore en silence
    console.log("Requête annulée");
  } else {
    // Vraie erreur (réseau, etc.) : à signaler
    console.error("Échec :", erreur.message);
  }
}
```

**Ce qu'une `AbortError` n'est PAS** :

- Une `AbortError` n'est pas une erreur réseau. Le serveur n'a rien renvoyé d'anormal : c'est toi qui as décidé d'arrêter.
- Une `AbortError` ne doit pas forcément être affichée à l'utilisateur. Dans la plupart des cas, une annulation est un comportement attendu (l'utilisateur a changé de page).

---

## Étapes Pratiques

Pour ces exercices, tu vas réutiliser le serveur JSON local de la fiche 11. Si besoin, relance-le dans un terminal séparé :

```bash
# Dans un terminal dédié (laisser ouvert)
node ~/js-moderne/serveur-json.mjs
```

Crée ton dossier de travail :

```bash
mkdir -p ~/js-moderne/abort
cd ~/js-moderne/abort
```

Crée un `package.json` minimal :

```json
{
  "name": "demo-abort",
  "version": "1.0.0",
  "type": "module"
}
```

---

### Étape 1 : Créer un AbortController et lire son état

Crée le fichier `14-abort.mjs` :

```javascript
// Créer un contrôleur d'annulation
const controleur = new AbortController();

// Le signal est l'objet à passer aux opérations annulables
const signal = controleur.signal;

// Au départ, rien n'est annulé
console.log("Annulé au départ ?", signal.aborted); // false

// Réagir au moment de l'annulation
signal.addEventListener("abort", () => {
  console.log("Événement abort reçu !");
  console.log("Raison :", signal.reason); // l'argument passé à abort()
});

// Déclencher l'annulation avec un message personnalisé
controleur.abort("Annulation demandée par l'utilisateur");

// Après abort(), l'état change
console.log("Annulé après abort ?", signal.aborted); // true
```

```bash
node ~/js-moderne/abort/14-abort.mjs
```

**Résultat attendu** :

```text
Annulé au départ ? false
Événement abort reçu !
Raison : Annulation demandée par l'utilisateur
Annulé après abort ? true
```

---

### Étape 2 : Annuler un fetch en cours

Remplace le contenu de `14-abort.mjs` par le code suivant :

```javascript
// Annuler une requête fetch déclenchée vers le serveur local
async function requeteAnnulable() {
  const controleur = new AbortController();

  // Programmer l'annulation après 50 millisecondes
  setTimeout(() => {
    console.log("On annule la requête...");
    controleur.abort();
  }, 50);

  try {
    // On passe le signal à fetch via les options
    const reponse = await fetch("http://localhost:3000/api/users", {
      signal: controleur.signal,
    });
    const donnees = await reponse.json();
    console.log("Données reçues :", donnees.length, "utilisateurs");
  } catch (erreur) {
    // Distinguer une annulation d'une vraie erreur
    if (erreur.name === "AbortError") {
      console.log("La requête a été annulée avant la réponse");
    } else {
      console.error("Erreur réseau :", erreur.message);
    }
  }
}

requeteAnnulable();
```

```bash
node ~/js-moderne/abort/14-abort.mjs
```

**Résultat attendu** (le serveur local répond presque instantanément ; selon la latence, tu verras le plus souvent l'annulation) :

```text
On annule la requête...
La requête a été annulée avant la réponse
```

---

### Étape 3 : Poser un timeout avec AbortSignal.timeout()

`AbortSignal.timeout(ms)` crée directement un signal qui s'annule tout seul après le délai indiqué. C'est la façon la plus simple de poser un timeout sur un `fetch()`.

Remplace le contenu de `14-abort.mjs` par le code suivant :

```javascript
// Timeout automatique avec AbortSignal.timeout()
async function avecTimeout(url, delaiMs) {
  try {
    // Le signal s'annule tout seul après delaiMs millisecondes
    const reponse = await fetch(url, {
      signal: AbortSignal.timeout(delaiMs),
    });
    const donnees = await reponse.json();
    return donnees;
  } catch (erreur) {
    // Un timeout déclenche une TimeoutError (un type d'annulation)
    if (erreur.name === "TimeoutError") {
      throw new Error(`Délai dépassé (${delaiMs} ms) pour ${url}`);
    }
    if (erreur.name === "AbortError") {
      throw new Error(`Requête annulée pour ${url}`);
    }
    throw erreur;
  }
}

async function main() {
  // Cas 1 : délai large -- la requête a le temps d'aboutir
  try {
    const users = await avecTimeout("http://localhost:3000/api/users", 5000);
    console.log("Succès :", users.length, "utilisateurs");
  } catch (erreur) {
    console.error("Échec :", erreur.message);
  }

  // Cas 2 : timeout volontaire très court sur le serveur local
  // Un délai de 1 ms est trop bas pour recevoir la réponse, même en local
  // (un port fermé comme :9999 échoue souvent en erreur réseau immédiate,
  //  pas en TimeoutError : le timeout sert surtout quand le serveur est lent)
  try {
    await avecTimeout("http://localhost:3000/api/users", 1);
    console.log("Succès (inattendu si le délai est trop court)");
  } catch (erreur) {
    console.error("Échec :", erreur.message);
  }
}

main();
```

```bash
# Depuis le dossier du projet (serveur de la fiche 11 encore lancé sur le port 3000)
node ~/js-moderne/abort/14-abort.mjs
```

**Résultat attendu** :

```text
Succès : 3 utilisateurs
Échec : Délai dépassé (1 ms) pour http://localhost:3000/api/users
```

Si le cas 2 affiche parfois un succès sur une machine très rapide, relance : un délai de 1 ms reste le moyen fiable de forcer un `TimeoutError` en environnement offline.

---

### Étape 4 : Combiner plusieurs signaux avec AbortSignal.any()

`AbortSignal.any([s1, s2])` crée un signal qui s'annule dès que **l'un** des signaux fournis s'annule. C'est utile pour combiner une annulation manuelle (l'utilisateur clique sur "Annuler") avec un timeout automatique.

Remplace le contenu de `14-abort.mjs` par le code suivant :

```javascript
// Combiner une annulation manuelle ET un timeout
async function requeteCombinee(url) {
  // Signal 1 : annulation manuelle déclenchée par l'utilisateur
  const controleurManuel = new AbortController();

  // Signal 2 : timeout automatique de 2 secondes
  const signalTimeout = AbortSignal.timeout(2000);

  // any() : le fetch s'annule dès QUE L'UN des deux signaux s'annule
  const signalCombine = AbortSignal.any([
    controleurManuel.signal,
    signalTimeout,
  ]);

  // Simuler un clic sur "Annuler" après 40 ms
  setTimeout(() => {
    console.log("Clic sur Annuler -> abort manuel");
    controleurManuel.abort();
  }, 40);

  try {
    const reponse = await fetch(url, { signal: signalCombine });
    const donnees = await reponse.json();
    console.log("Données reçues :", donnees.length);
  } catch (erreur) {
    if (erreur.name === "TimeoutError") {
      console.log("Annulé par le timeout (2 s dépassées)");
    } else if (erreur.name === "AbortError") {
      console.log("Annulé manuellement par l'utilisateur");
    } else {
      console.error("Erreur :", erreur.message);
    }
  }
}

requeteCombinee("http://localhost:3000/api/users");
```

```bash
node ~/js-moderne/abort/14-abort.mjs
```

**Résultat attendu** (l'annulation manuelle à 40 ms se déclenche avant le timeout de 2 s) :

```text
Clic sur Annuler -> abort manuel
Annulé manuellement par l'utilisateur
```

---

### Étape 5 : Propager un signal dans ton propre code asynchrone

Le signal ne sert pas qu'à `fetch()`. Tu peux le transmettre à tes propres fonctions pour les rendre annulables. Le motif consiste à vérifier `signal.aborted` (ou appeler `signal.throwIfAborted()`) aux étapes clés.

Remplace le contenu de `14-abort.mjs` par le code suivant :

```javascript
// Une attente annulable : un setTimeout qui respecte le signal
function attendreAnnulable(ms, signal) {
  return new Promise((resolve, reject) => {
    // Si déjà annulé avant même de commencer, on rejette tout de suite
    if (signal.aborted) {
      reject(new DOMException("Annulé", "AbortError"));
      return;
    }

    const minuterie = setTimeout(resolve, ms);

    // Quand le signal s'annule, on arrête la minuterie et on rejette
    signal.addEventListener("abort", () => {
      clearTimeout(minuterie);
      reject(new DOMException("Annulé", "AbortError"));
    });
  });
}

// Un traitement en plusieurs étapes qui propage le signal
async function traitementLong(signal) {
  console.log("Étape 1...");
  await attendreAnnulable(100, signal);

  // Vérification explicite entre deux étapes
  signal.throwIfAborted();

  console.log("Étape 2...");
  await attendreAnnulable(100, signal);

  console.log("Étape 3...");
  await attendreAnnulable(100, signal);

  return "Traitement terminé";
}

async function main() {
  const controleur = new AbortController();

  // Annuler après 150 ms : le traitement n'ira pas au bout
  setTimeout(() => controleur.abort(), 150);

  try {
    const resultat = await traitementLong(controleur.signal);
    console.log(resultat);
  } catch (erreur) {
    if (erreur.name === "AbortError") {
      console.log("Traitement interrompu en cours de route");
    } else {
      console.error("Erreur :", erreur.message);
    }
  }
}

main();
```

```bash
node ~/js-moderne/abort/14-abort.mjs
```

**Résultat attendu** :

```text
Étape 1...
Étape 2...
Traitement interrompu en cours de route
```

---

### Étape 6 : Nettoyer un effet React avec un signal

Dans React, un composant peut disparaître pendant qu'une requête est en cours. Si la requête met ensuite à jour l'état, React avertit d'une fuite. La solution est d'annuler la requête dans la fonction de nettoyage de `useEffect`.

Ce code est un exemple de référence. Le motif important est la fonction de nettoyage retournée par `useEffect`.

```javascript
// Exemple React : annuler le fetch quand le composant disparaît
import { useEffect, useState } from "react";

function ListeUtilisateurs() {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [erreur, setErreur] = useState(null);

  useEffect(() => {
    // Un contrôleur par exécution de l'effet
    const controleur = new AbortController();

    async function charger() {
      try {
        const reponse = await fetch("http://localhost:3000/api/users", {
          signal: controleur.signal, // on transmet le signal
        });
        const donnees = await reponse.json();
        setUtilisateurs(donnees);
      } catch (e) {
        // On ignore l'annulation : ce n'est pas une vraie erreur
        if (e.name !== "AbortError") {
          setErreur(e.message);
        }
      }
    }

    charger();

    // Fonction de nettoyage : appelée quand le composant disparaît
    // ou avant la prochaine exécution de l'effet
    return () => {
      controleur.abort(); // on annule la requête en cours
    };
  }, []); // tableau vide : l'effet ne s'exécute qu'au montage

  if (erreur) {
    return <p>Erreur : {erreur}</p>;
  }

  return (
    <ul>
      {utilisateurs.map((u) => (
        <li key={u.id}>{u.nom}</li>
      ))}
    </ul>
  );
}

export default ListeUtilisateurs;
```

Points clés de ce motif :

- Un nouveau `AbortController` est créé à chaque exécution de l'effet.
- La fonction de nettoyage (le `return` de `useEffect`) appelle `controleur.abort()`.
- Dans le `catch`, l'`AbortError` est ignorée, car l'annulation est volontaire.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `new AbortController()` | Crée un contrôleur d'annulation |
| `controleur.signal` | Récupère le signal à passer à l'opération |
| `controleur.abort()` | Déclenche l'annulation |
| `controleur.abort(raison)` | Annule avec une raison personnalisée |
| `signal.aborted` | `true` si déjà annulé |
| `signal.reason` | Raison de l'annulation |
| `signal.throwIfAborted()` | Lance une exception si déjà annulé |
| `signal.addEventListener("abort", fn)` | Réagit à l'annulation |
| `fetch(url, { signal })` | Rend un fetch annulable |
| `AbortSignal.timeout(ms)` | Signal qui s'annule seul après un délai |
| `AbortSignal.any([s1, s2])` | Signal annulé dès que l'un des signaux s'annule |

---

## Pièges Fréquents

### Piège 1 : Réutiliser un AbortController après abort()

⚠️ **Problème** : Tu gardes le même `AbortController` pour plusieurs requêtes. Après le premier `abort()`, son signal reste annulé pour toujours : la requête suivante est annulée immédiatement.

✅ **Solution** : Crée un nouveau `AbortController` pour chaque opération annulable.

```javascript
// ❌ Contrôleur réutilisé : la 2e requête démarre déjà annulée
const c = new AbortController();
c.abort();
await fetch(url, { signal: c.signal }); // annulée tout de suite

// ✅ Un nouveau contrôleur par requête
const c2 = new AbortController();
await fetch(url, { signal: c2.signal });
```

---

### Piège 2 : Traiter une AbortError comme une vraie erreur

⚠️ **Problème** : Dans ton `catch`, tu affiches systématiquement "Erreur réseau". L'utilisateur qui change de page voit un faux message d'erreur, alors que l'annulation était volontaire.

✅ **Solution** : Teste `erreur.name === "AbortError"` (ou `"TimeoutError"`) et traite l'annulation à part, en silence le plus souvent.

```javascript
// ❌ Toute erreur est affichée, même une annulation voulue
catch (e) {
  afficherErreur(e.message);
}

// ✅ L'annulation est ignorée
catch (e) {
  if (e.name === "AbortError") return; // annulation volontaire
  afficherErreur(e.message);
}
```

---

### Piège 3 : Oublier de nettoyer dans useEffect (React)

⚠️ **Problème** : Ton `useEffect` lance un `fetch()` mais ne retourne pas de fonction de nettoyage. Quand le composant disparaît, la requête continue et tente de mettre à jour un état inexistant : React avertit d'une fuite mémoire.

✅ **Solution** : Retourne une fonction de nettoyage qui appelle `abort()`.

```javascript
// ❌ Pas de nettoyage : la requête survit au composant
useEffect(() => {
  fetch(url).then(/* ... */);
}, []);

// ✅ Nettoyage qui annule la requête
useEffect(() => {
  const controleur = new AbortController();
  fetch(url, { signal: controleur.signal }).then(/* ... */);
  return () => controleur.abort();
}, []);
```

---

### Piège 4 : Confondre AbortSignal.timeout() et setTimeout()

⚠️ **Problème** : Tu utilises un `setTimeout()` qui appelle `abort()`, mais tu oublies de l'annuler avec `clearTimeout()` quand la requête réussit. La minuterie reste active inutilement.

✅ **Solution** : Pour un simple timeout, préfère `AbortSignal.timeout(ms)`, qui se gère tout seul. Si tu utilises `setTimeout()` manuel, pense à `clearTimeout()` au succès.

```javascript
// ❌ setTimeout manuel non nettoyé
const c = new AbortController();
setTimeout(() => c.abort(), 5000); // jamais clearTimeout en cas de succès
await fetch(url, { signal: c.signal });

// ✅ Timeout autogéré, rien à nettoyer
await fetch(url, { signal: AbortSignal.timeout(5000) });
```

---

## Checklist de Validation

- [ ] Je sais créer un `AbortController` et récupérer son `signal`
- [ ] Je sais passer le `signal` à un `fetch()` et déclencher `abort()`
- [ ] Je sais distinguer une `AbortError` d'une vraie erreur réseau
- [ ] Je sais poser un timeout avec `AbortSignal.timeout()`
- [ ] Je sais combiner plusieurs signaux avec `AbortSignal.any()`
- [ ] Je sais rendre mon propre code asynchrone annulable via le signal
- [ ] Je sais nettoyer un effet React en appelant `abort()` au démontage
- [ ] Je sais qu'un `AbortController` n'est pas réutilisable après `abort()`

---

## Exercice Pratique

**Énoncé** : Crée un client de recherche avec annulation automatique des requêtes obsolètes.

1. Démarre le serveur `serveur-json.mjs` (fiche 11).
2. Crée un fichier `exercice-abort.mjs`.
3. Crée une classe `ClientRecherche` qui mémorise le contrôleur de la requête en cours.
4. Ajoute une méthode `rechercher(id)` qui :
   - annule la requête précédente si elle existe encore ;
   - crée un nouveau `AbortController` ;
   - lance un `fetch()` vers `/api/users/:id` avec le signal et un timeout combiné de 3 secondes (via `AbortSignal.any()`) ;
   - retourne les données, ou `null` si la requête a été annulée.
5. Simule trois recherches lancées coup sur coup : seules les requêtes non annulées doivent aboutir.

**Indications** :

- Stocke le contrôleur courant dans une propriété de la classe.
- Au début de `rechercher`, appelle `abort()` sur le contrôleur précédent s'il existe.
- Combine `controleur.signal` et `AbortSignal.timeout(3000)` avec `AbortSignal.any()`.
- Dans le `catch`, retourne `null` pour une `AbortError` ou une `TimeoutError`.

**Résultat attendu** (les deux premières recherches sont annulées par la troisième) :

```text
Recherche #1 lancée
Recherche #2 lancée (annule #1)
Recherche #3 lancée (annule #2)
  #1 -> annulée
  #2 -> annulée
  #3 -> Charlie (charlie@example.com)
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
const BASE_URL = "http://localhost:3000";

// Client de recherche qui annule la requête précédente à chaque appel
class ClientRecherche {
  // Contrôleur de la requête actuellement en cours (null au départ)
  #controleurCourant = null;

  async rechercher(id) {
    // 1. Annuler la requête précédente si elle est encore en cours
    if (this.#controleurCourant) {
      this.#controleurCourant.abort();
    }

    // 2. Créer un nouveau contrôleur pour cette requête
    const controleur = new AbortController();
    this.#controleurCourant = controleur;

    // 3. Combiner l'annulation manuelle et un timeout de 3 secondes
    const signal = AbortSignal.any([
      controleur.signal,
      AbortSignal.timeout(3000),
    ]);

    try {
      const reponse = await fetch(`${BASE_URL}/api/users/${id}`, { signal });
      if (!reponse.ok) {
        throw new Error(`HTTP ${reponse.status}`);
      }
      return await reponse.json();
    } catch (erreur) {
      // Annulation (manuelle ou timeout) : on retourne null
      if (erreur.name === "AbortError" || erreur.name === "TimeoutError") {
        return null;
      }
      throw erreur;
    }
  }
}

async function main() {
  const client = new ClientRecherche();

  // Lancer trois recherches coup sur coup
  console.log("Recherche #1 lancée");
  const p1 = client.rechercher(1);

  console.log("Recherche #2 lancée (annule #1)");
  const p2 = client.rechercher(2);

  console.log("Recherche #3 lancée (annule #2)");
  const p3 = client.rechercher(3);

  // Attendre les trois résultats
  const [r1, r2, r3] = await Promise.all([p1, p2, p3]);

  // Afficher chaque résultat (null = annulée)
  const formater = (r) => (r ? `${r.nom} (${r.email})` : "annulée");
  console.log(`  #1 -> ${formater(r1)}`);
  console.log(`  #2 -> ${formater(r2)}`);
  console.log(`  #3 -> ${formater(r3)}`);
}

main().catch((erreur) => {
  console.error("Erreur fatale :", erreur.message);
  console.error("Vérifie que le serveur est démarré (node serveur-json.mjs)");
});
```

---

## Navigation

← Fiche précédente : **[Temporal API (la nouvelle gestion des dates)](13-temporal-api.md)**

→ Cursus suivant : **[TypeScript](../07-typescript/index.md)**
