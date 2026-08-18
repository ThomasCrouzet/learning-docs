---
tags:
  - React
  - Intermédiaire
  - Concept
description: "Comprendre useEffect, le tableau de dépendances et le cycle de vie des composants."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 19
cursus: "React"
---

# 07 - useEffect et cycle de vie

> **En bref** : Maîtriser useEffect pour exécuter du code en réponse aux changements d'état, comprendre le tableau de dépendances et le nettoyage des effets. Lecture estimée : 90 min.

## Prérequis

- Fiche précédente : [06 - Événements et formulaires](06-evenements-formulaires.md)
- Savoir utiliser `useState`
- Comprendre le rendu des composants React

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser `useEffect` pour exécuter des effets de bord (side effects), contrôler quand ils s'exécutent grâce au tableau de dépendances et nettoyer les effets quand le composant est détruit.

---

## Concepts

### Qu'est-ce qu'un effet de bord (side effect) ?

**Définition** : Un effet de bord est toute opération qui interagit avec l'extérieur du composant : appels API, manipulation du DOM, timers, abonnements à des événements ou stockage local (localStorage).

**Le problème que la gestion des effets résout** :

Sans gestion des effets :

1. **Code dans le rendu** : placer un appel API ou un `setTimeout` directement dans le corps du composant provoque des appels à chaque rendu, ce qui peut créer des boucles infinies ou des requêtes réseau excessives.
2. **Fuites mémoire** : un timer ou un abonnement qui n'est jamais arrêté continue à fonctionner même après la destruction du composant.
3. **Exécution incontrôlée** : impossible de choisir quand l'effet doit se déclencher.

**Comment la gestion des effets résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Code dans le rendu | `useEffect` sépare les effets du rendu |
| Fuites mémoire | La fonction de nettoyage (cleanup) arrête les effets |
| Exécution incontrôlée | Le tableau de dépendances contrôle quand l'effet s'exécute |

**Analogie concrète** : Un effet de bord est comme une tâche ménagère déclenchée par un changement. Quand tu emménages (montage du composant), tu configures l'électricité. Quand la température change (changement de dépendance), tu ajustes le thermostat. Quand tu déménages (démontage du composant), tu résilies le contrat d'électricité (nettoyage).

**Cycle de vie d'un composant avec useEffect** :

<div class="diagram-design">
<p><a href="../../diagrams/08-react-07-useeffect-cycle-vie-1.html">Qu&#x27;est-ce qu&#x27;un effet de bord (side effect) ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-07-useeffect-cycle-vie-1.html" title="Qu&#x27;est-ce qu&#x27;un effet de bord (side effect) ?" style="width:100%;min-height:836px;border:0;background:transparent"></iframe>
</div>

Un changement d'état ou de props déclenche un nouveau rendu (ReRendu). Le Cleanup de l'ancien effet s'exécute avant le nouvel Effet. Au démontage, le Cleanup final s'exécute.

---

### Qu'est-ce que useEffect ?

**Définition** : `useEffect` est un hook React qui permet d'exécuter du code après le rendu du composant. Il prend deux paramètres : une fonction à exécuter (l'effet) et un tableau de dépendances (optionnel) qui contrôle quand l'effet est relancé.

**Le problème que useEffect résout** :

Sans useEffect :

1. **Pas de mécanisme déclaratif** : avant les hooks, il fallait utiliser les méthodes de cycle de vie des composants de classe (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`), ce qui dispersait la logique.
2. **Logique fragmentée** : la configuration d'un timer dans `componentDidMount` et son nettoyage dans `componentWillUnmount` étaient dans deux méthodes séparées.

**Comment useEffect résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pas de mécanisme déclaratif | `useEffect` est simple et direct |
| Logique fragmentée | L'effet et son nettoyage sont dans la même fonction |

**Syntaxe de base** :

```tsx
import { useEffect } from "react";

useEffect(() => {
  // Code exécuté après le rendu
  // (l'effet de bord)

  return () => {
    // Code exécuté au nettoyage (optionnel)
    // (quand le composant est détruit ou avant la réexécution de l'effet)
  };
}, [/* tableau de dépendances */]);
```

**Ce que useEffect n'est PAS** :

- useEffect n'est pas un écouteur d'événements. Il s'exécute après le rendu, pas en réponse à une action utilisateur.
- useEffect n'est pas synchrone. L'effet s'exécute après que le navigateur a peint l'écran, pas pendant le rendu.

---

### Qu'est-ce que le tableau de dépendances ?

**Définition** : Le tableau de dépendances est le deuxième argument de `useEffect`. Il contient la liste des valeurs (état, props) que l'effet surveille. L'effet est réexécuté uniquement quand une de ces valeurs change.

**Les 3 cas du tableau de dépendances** :

```tsx
// Cas 1 : PAS de tableau de dépendances
// L'effet s'exécute APRÈS CHAQUE rendu (à utiliser rarement)
useEffect(() => {
  console.log("Exécuté après chaque rendu");
});

// Cas 2 : Tableau VIDE []
// L'effet s'exécute UNE SEULE FOIS, après le premier rendu (montage)
// Équivalent de componentDidMount
useEffect(() => {
  console.log("Exécuté une seule fois au montage");
}, []);

// Cas 3 : Tableau AVEC des dépendances
// L'effet s'exécute au montage ET quand une dépendance change
useEffect(() => {
  console.log(`Le compteur a changé : ${compteur}`);
}, [compteur]); // Se réexécute quand "compteur" change
```

**Analogie concrète** : Le tableau de dépendances est comme une liste de surveillance. Imagine un vigile (useEffect) qui surveille des écrans de caméra (les dépendances). Si tu lui donnes zéro écran (`[]`), il fait son travail une seule fois et part. Si tu lui donnes des écrans spécifiques (`[compteur, nom]`), il réagit uniquement quand quelque chose bouge sur ces écrans. Si tu ne lui donnes pas de liste, il réagit à tout mouvement.

---

### Qu'est-ce que le nettoyage (cleanup) ?

**Définition** : Le nettoyage est la fonction retournée par l'effet dans `useEffect`. Elle est exécutée avant que l'effet soit relancé ou quand le composant est détruit (démonté).

**Le problème que le nettoyage résout** :

Sans nettoyage :

1. **Fuites mémoire** : un `setInterval` continue à fonctionner même après la destruction du composant.
2. **Comportements inattendus** : un abonnement à un événement crée des doublons à chaque rendu.
3. **Requêtes obsolètes** : une requête API lancée pour un composant détruit tente de mettre à jour un état qui n'existe plus.

**Comment le nettoyage résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Fuites mémoire | Le cleanup arrête les timers et abonnements |
| Comportements inattendus | Le cleanup retire les anciens abonnements avant d'en créer de nouveaux |
| Requêtes obsolètes | Le cleanup annule les requêtes en cours |

```tsx
useEffect(() => {
  // L'effet : crée un timer
  const intervalId = setInterval(() => {
    console.log("Tic");
  }, 1000);

  // Le nettoyage : arrête le timer
  return () => {
    clearInterval(intervalId);
  };
}, []);
```

---

### Les règles des hooks

**Définition** : Les règles des hooks sont deux règles que React impose pour que les hooks fonctionnent correctement.

**Règle 1 : Appeler les hooks au niveau supérieur**

Les hooks doivent être appelés au même endroit à chaque rendu. Jamais dans une condition, une boucle ou une fonction imbriquée.

```tsx
// ❌ Interdit : hook dans une condition
function Composant({ actif }: { actif: boolean }) {
  if (actif) {
    useEffect(() => { /* ... */ }, []);
  }
}

// ✅ Correct : condition dans le hook
function Composant({ actif }: { actif: boolean }) {
  useEffect(() => {
    if (actif) {
      // Le code conditionnel est ICI, pas autour du hook
    }
  }, [actif]);
}
```

**Règle 2 : Appeler les hooks uniquement dans des composants ou des hooks personnalisés**

Les hooks ne fonctionnent que dans des composants React ou dans des hooks personnalisés (fiche 11).

```tsx
// ❌ Interdit : hook dans une fonction classique
function calculer() {
  const [valeur, setValeur] = useState(0); // Erreur !
}

// ✅ Correct : hook dans un composant
function MonComposant() {
  const [valeur, setValeur] = useState(0); // OK
}
```

---

## Étapes Pratiques

### Étape 1 : Effet au montage (tableau vide)

Crée `src/components/Horloge.tsx` :

```tsx
// src/components/Horloge.tsx
import { useState, useEffect } from "react";

function Horloge() {
  const [heure, setHeure] = useState(new Date().toLocaleTimeString("fr-FR"));

  // useEffect avec [] : exécuté UNE SEULE FOIS au montage
  useEffect(() => {
    // Crée un timer qui met à jour l'heure chaque seconde
    const intervalId = setInterval(() => {
      setHeure(new Date().toLocaleTimeString("fr-FR"));
    }, 1000);

    // Nettoyage : arrête le timer quand le composant est détruit
    // Sans ce return, le timer continuerait à fonctionner en arrière-plan
    return () => {
      clearInterval(intervalId);
      console.log("Timer arrêté (composant démonté)");
    };
  }, []); // [] = exécuté une seule fois

  return (
    <div>
      <h2>Horloge</h2>
      <p style={{ fontSize: "32px", fontFamily: "monospace" }}>{heure}</p>
    </div>
  );
}

export default Horloge;
```

**Résultat attendu** : une horloge qui se met à jour automatiquement chaque seconde.

---

### Étape 2 : Effet avec dépendance

Crée `src/components/TitreDocument.tsx` :

```tsx
// src/components/TitreDocument.tsx
import { useState, useEffect } from "react";

function TitreDocument() {
  const [compteur, setCompteur] = useState(0);

  // L'effet se déclenche quand "compteur" change
  useEffect(() => {
    // Modifie le titre de l'onglet du navigateur
    document.title = `Compteur : ${compteur}`;

    // Pas de nettoyage nécessaire ici
    // (le titre sera remplacé au prochain rendu)
  }, [compteur]); // Se réexécute quand compteur change

  return (
    <div>
      <h2>Titre du document</h2>
      <p>Compteur : {compteur}</p>
      <button onClick={() => setCompteur((prev) => prev + 1)}>
        Incrémenter
      </button>
      <p style={{ color: "#666" }}>
        Regarde le titre de l'onglet du navigateur.
      </p>
    </div>
  );
}

export default TitreDocument;
```

**Résultat attendu** : le titre de l'onglet du navigateur change à chaque clic.

---

### Étape 3 : Effet avec nettoyage (écouteur d'événement)

Crée `src/components/PositionSouris.tsx` :

```tsx
// src/components/PositionSouris.tsx
import { useState, useEffect } from "react";

// Interface pour la position de la souris
interface Position {
  x: number;
  y: number;
}

function PositionSouris() {
  const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

  useEffect(() => {
    // Handler qui met à jour la position à chaque mouvement de souris
    const gererMouvement = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Ajoute l'écouteur sur le document entier
    document.addEventListener("mousemove", gererMouvement);

    // Nettoyage : retire l'écouteur quand le composant est détruit
    // Sans ce nettoyage, l'écouteur resterait actif même après
    // la destruction du composant (fuite mémoire)
    return () => {
      document.removeEventListener("mousemove", gererMouvement);
    };
  }, []); // [] = l'écouteur est ajouté une seule fois

  return (
    <div>
      <h2>Position de la souris</h2>
      <p>
        X : {position.x} | Y : {position.y}
      </p>
    </div>
  );
}

export default PositionSouris;
```

**Résultat attendu** : les coordonnées de la souris se mettent à jour en temps réel.

---

### Étape 4 : Effet avec localStorage

Crée `src/components/NomPersistant.tsx` :

```tsx
// src/components/NomPersistant.tsx
import { useState, useEffect } from "react";

function NomPersistant() {
  // Initialise l'état avec la valeur du localStorage (si elle existe)
  // La fonction passée à useState est appelée une seule fois (initialisation paresseuse)
  const [nom, setNom] = useState<string>(() => {
    const sauvegarde = localStorage.getItem("nom-utilisateur");
    return sauvegarde ?? "";
  });

  // Sauvegarde dans le localStorage à chaque changement du nom
  useEffect(() => {
    localStorage.setItem("nom-utilisateur", nom);
  }, [nom]); // Se réexécute quand "nom" change

  return (
    <div>
      <h2>Nom persistant</h2>
      <p>Ce champ sauvegarde automatiquement dans le localStorage.</p>
      <input
        type="text"
        value={nom}
        onChange={(e) => setNom(e.target.value)}
        placeholder="Entre ton nom..."
        style={{ padding: "8px", width: "300px" }}
      />
      {nom && <p>Bonjour {nom} ! (rechargez la page, le nom sera conservé)</p>}
    </div>
  );
}

export default NomPersistant;
```

**Résultat attendu** : le nom est conservé même après rechargement de la page.

---

### Étape 5 : Effet conditionnel dans le corps de l'effet

Crée `src/components/Notifications.tsx` :

```tsx
// src/components/Notifications.tsx
import { useState, useEffect } from "react";

function Notifications() {
  const [actif, setActif] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    // La condition est DANS l'effet, pas autour
    if (!actif) return;

    // Simule la réception de notifications toutes les 3 secondes
    const intervalId = setInterval(() => {
      const nouveauMessage = `Notification reçue à ${new Date().toLocaleTimeString("fr-FR")}`;
      setMessages((prev) => [...prev, nouveauMessage]);
    }, 3000);

    // Nettoyage : arrête le timer
    return () => {
      clearInterval(intervalId);
    };
  }, [actif]); // Se réexécute quand "actif" change

  return (
    <div>
      <h2>Notifications</h2>
      <button onClick={() => setActif(!actif)}>
        {actif ? "Désactiver" : "Activer"} les notifications
      </button>

      <p>Statut : {actif ? "Actif" : "Inactif"}</p>

      {messages.length > 0 && (
        <div>
          <h3>Messages reçus ({messages.length}) :</h3>
          <ul>
            {messages.map((msg, index) => (
              <li key={index}>{msg}</li>
            ))}
          </ul>
          <button onClick={() => setMessages([])}>
            Effacer les messages
          </button>
        </div>
      )}
    </div>
  );
}

export default Notifications;
```

**Résultat attendu** : un bouton active/désactive les notifications simulées.

---

### Étape 6 : Comprendre l'ordre d'exécution

Crée `src/components/OrdreExecution.tsx` :

```tsx
// src/components/OrdreExecution.tsx
import { useState, useEffect } from "react";

function OrdreExecution() {
  const [compteur, setCompteur] = useState(0);

  console.log("1. Rendu du composant (compteur =", compteur, ")");

  useEffect(() => {
    console.log("2. Effet exécuté (après le rendu)");

    return () => {
      console.log("3. Nettoyage de l'effet précédent");
    };
  }, [compteur]);

  return (
    <div>
      <h2>Ordre d'exécution</h2>
      <p>Ouvre la console du navigateur et clique sur le bouton.</p>
      <p>Compteur : {compteur}</p>
      <button onClick={() => setCompteur((prev) => prev + 1)}>
        Incrémenter
      </button>
    </div>
  );
}

export default OrdreExecution;
```

**Résultat attendu dans la console** :

```text
Premier rendu :
1. Rendu du composant (compteur = 0)
2. Effet exécuté (après le rendu)

Après un clic :
1. Rendu du composant (compteur = 1)
3. Nettoyage de l'effet précédent
2. Effet exécuté (après le rendu)
```

**Explication de l'ordre** :

1. React rend le composant (exécute la fonction)
2. React peint le résultat à l'écran
3. React exécute le nettoyage de l'effet précédent (s'il existe)
4. React exécute le nouvel effet

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `Ctrl+Shift+J` | Ouvre la console du navigateur |
| `npx tsc --noEmit` | Vérifie les types TypeScript |

---

## Pièges Fréquents

### Piège 1 : Boucle infinie sans tableau de dépendances

**Problème** : Oublier le tableau de dépendances avec un `setState` dans l'effet crée une boucle infinie (l'effet met à jour l'état, ce qui déclenche un re-render, ce qui relance l'effet).

**Solution** : Ajoute toujours un tableau de dépendances.

```tsx
// ❌ Boucle infinie : l'effet s'exécute après chaque rendu
useEffect(() => {
  setCompteur(compteur + 1); // Déclenche un re-render = boucle infinie
});

// ✅ Correct : l'effet s'exécute une seule fois
useEffect(() => {
  setCompteur(1);
}, []);
```

---

### Piège 2 : Dépendance manquante

**Problème** : Ne pas inclure une variable utilisée dans l'effet dans le tableau de dépendances. L'effet utilise une valeur obsolète.

**Solution** : Inclus toutes les variables utilisées dans l'effet dans le tableau de dépendances. ESLint avec le plugin `react-hooks` signale les dépendances manquantes.

```tsx
// ❌ "nom" est utilisé mais pas dans les dépendances
useEffect(() => {
  document.title = `Bonjour ${nom}`; // nom a toujours la valeur initiale
}, []);

// ✅ "nom" est dans les dépendances
useEffect(() => {
  document.title = `Bonjour ${nom}`;
}, [nom]);
```

---

### Piège 3 : Effet asynchrone direct

**Problème** : Passer une fonction async directement à `useEffect`. React attend une fonction qui retourne `void` ou une fonction de nettoyage, pas une `Promise`.

**Solution** : Crée une fonction async à l'intérieur de l'effet et appelle-la.

```tsx
// ❌ Erreur : useEffect ne peut pas être async
useEffect(async () => {
  const data = await fetch("/api/data");
}, []);

// ✅ Correct : fonction async définie et appelée dans l'effet
useEffect(() => {
  const chargerDonnees = async () => {
    const response = await fetch("/api/data");
    const data = await response.json();
    setDonnees(data);
  };

  chargerDonnees();
}, []);
```

---

### Piège 4 : Oublier le nettoyage d'un timer

**Problème** : Créer un `setInterval` sans le nettoyer. Le timer continue même après la destruction du composant.

**Solution** : Retourne toujours une fonction de nettoyage qui appelle `clearInterval` ou `clearTimeout`.

```tsx
// ❌ Fuite mémoire : le timer n'est jamais arrêté
useEffect(() => {
  setInterval(() => console.log("Tic"), 1000);
}, []);

// ✅ Le timer est arrêté au démontage
useEffect(() => {
  const id = setInterval(() => console.log("Tic"), 1000);
  return () => clearInterval(id);
}, []);
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est un effet de bord
- [ ] Je sais utiliser `useEffect` avec les 3 variantes du tableau de dépendances
- [ ] Je comprends l'ordre d'exécution : rendu, peinture, nettoyage, effet
- [ ] Je sais nettoyer un effet (return d'une fonction)
- [ ] Je sais utiliser `useEffect` avec localStorage
- [ ] Je sais ajouter et retirer un écouteur d'événement
- [ ] Je connais les règles des hooks
- [ ] Je sais éviter les boucles infinies

---

## Exercice Pratique

**Énoncé** : Crée un composant chronomètre avec les fonctionnalités suivantes :

1. Affiche le temps écoulé en secondes (format : "00:00")
2. Trois boutons : Démarrer, Pause, Réinitialiser
3. Le titre de l'onglet affiche le temps écoulé
4. Le chronomètre se met en pause proprement (nettoyage de l'intervalle)

**Indications** :

- Utilise `useState` pour le temps et l'état actif
- Utilise `useEffect` avec `setInterval` pour incrémenter le temps
- Le nettoyage doit arrêter l'intervalle
- Formate le temps : `Math.floor(temps / 60)` pour les minutes, `temps % 60` pour les secondes
- Utilise `String(nombre).padStart(2, "0")` pour ajouter un zéro devant les nombres < 10

**Résultat attendu** : un chronomètre fonctionnel avec démarrage, pause et réinitialisation.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
// src/components/Chronometre.tsx
import { useState, useEffect } from "react";

function Chronometre() {
  // Temps écoulé en secondes
  const [temps, setTemps] = useState(0);
  // Le chronomètre est-il en cours ?
  const [actif, setActif] = useState(false);

  // Effet qui gère le timer
  useEffect(() => {
    // Si le chronomètre n'est pas actif, on ne fait rien
    if (!actif) return;

    // Crée un intervalle qui incrémente le temps chaque seconde
    const intervalId = setInterval(() => {
      setTemps((prev) => prev + 1);
    }, 1000);

    // Nettoyage : arrête l'intervalle quand actif change ou au démontage
    return () => clearInterval(intervalId);
  }, [actif]);

  // Effet qui met à jour le titre de l'onglet
  useEffect(() => {
    const minutes = String(Math.floor(temps / 60)).padStart(2, "0");
    const secondes = String(temps % 60).padStart(2, "0");
    document.title = `${minutes}:${secondes} - Chronomètre`;
  }, [temps]);

  // Formate le temps pour l'affichage
  const formater = (totalSecondes: number): string => {
    const minutes = String(Math.floor(totalSecondes / 60)).padStart(2, "0");
    const secondes = String(totalSecondes % 60).padStart(2, "0");
    return `${minutes}:${secondes}`;
  };

  // Réinitialise le chronomètre
  const reinitialiser = () => {
    setActif(false);
    setTemps(0);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Chronomètre</h2>
      <p style={{ fontSize: "48px", fontFamily: "monospace", margin: "20px 0" }}>
        {formater(temps)}
      </p>
      <div>
        {!actif ? (
          <button onClick={() => setActif(true)} style={{ padding: "8px 16px", marginRight: "8px" }}>
            Démarrer
          </button>
        ) : (
          <button onClick={() => setActif(false)} style={{ padding: "8px 16px", marginRight: "8px" }}>
            Pause
          </button>
        )}
        <button onClick={reinitialiser} style={{ padding: "8px 16px" }}>
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

export default Chronometre;
```

---

## Navigation

← Fiche précédente : **[06 - Événements et formulaires](06-evenements-formulaires.md)**

→ Fiche suivante : **[08 - Listes et clés](08-listes-cles.md)**
