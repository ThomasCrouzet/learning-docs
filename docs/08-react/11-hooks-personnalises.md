---
tags:
  - React
  - Intermédiaire
  - Concept
description: "Créer des hooks personnalisés pour extraire et réutiliser la logique entre composants."
estimated_time: "75 min"
fiche_number: 11
total_fiches: 19
cursus: "React"
---

# 11 - Hooks personnalisés

> **En bref** : Extraire la logique réutilisable dans des hooks personnalisés (custom hooks), comprendre les conventions de nommage et savoir quand créer un hook. Lecture estimée : 75 min.

## Prérequis

- Fiche précédente : [10 - Context et état global](10-context-etat-global.md)
- Savoir utiliser `useState`, `useEffect` et `useContext`
- Comprendre les règles des hooks (fiche 07)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des hooks personnalisés pour factoriser la logique commune entre composants, respecter les conventions de nommage et composer plusieurs hooks ensemble.

---

## Concepts

### Qu'est-ce qu'un hook personnalisé ?

**Définition** : Un hook personnalisé (custom hook) est une fonction JavaScript dont le nom commence par `use` et qui utilise un ou plusieurs hooks React à l'intérieur. Il permet d'extraire la logique d'un composant dans une fonction réutilisable.

**Le problème que les hooks personnalisés résolvent** :

Sans hooks personnalisés :

1. **Duplication de logique** : plusieurs composants qui ont besoin de la même logique (par exemple, suivre la taille de la fenêtre) doivent chacun réécrire `useState` + `useEffect` avec le même code.
2. **Composants surchargés** : toute la logique (état, effets, calculs) se retrouve dans le composant, ce qui le rend difficile à lire.
3. **Tests difficiles** : la logique étant imbriquée dans le JSX, il est difficile de la tester indépendamment.

**Comment les hooks personnalisés résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Duplication de logique | Le hook est écrit une seule fois et appelé dans chaque composant |
| Composants surchargés | La logique est extraite dans le hook, le composant ne garde que le JSX |
| Tests difficiles | Le hook peut être testé indépendamment du composant |

**Analogie concrète** : Un hook personnalisé est comme un outil multifonction dans un atelier. Au lieu que chaque artisan fabrique son propre tournevis à chaque projet, on crée un tournevis réutilisable que tout le monde peut prendre dans la boîte à outils. Chaque artisan (composant) utilise sa propre instance du tournevis (chaque appel au hook crée son propre état), mais la conception est partagée.

**Ce qu'un hook personnalisé n'est PAS** :

- Un hook personnalisé n'est pas un composant. Il ne retourne pas de JSX, mais des valeurs (état, fonctions, données).
- Un hook personnalisé n'est pas un singleton. Chaque composant qui appelle le hook obtient sa propre copie de l'état. Deux composants utilisant `useCompteur()` ont chacun leur propre compteur.
- Un hook personnalisé n'est pas obligatoire. Si la logique n'est utilisée que dans un seul composant, il n'est pas nécessaire de l'extraire.

---

### Les conventions des hooks personnalisés

**Définition** : Les conventions des hooks personnalisés sont les règles de nommage et de structure que la communauté React suit pour créer des hooks lisibles et prévisibles.

**Le problème que les conventions résolvent** :

Sans conventions :

1. **Confusion avec les fonctions classiques** : React ne peut pas distinguer un hook d'une fonction ordinaire. Il ne sait pas quand appliquer les règles des hooks (pas d'appel conditionnel, pas d'appel dans une boucle).
2. **Code imprévisible** : chaque développeur nomme et structure ses hooks différemment. Un nouveau membre de l'équipe ne sait pas ce que retourne un hook ni comment l'utiliser.
3. **Erreurs silencieuses** : sans convention de nommage, le linter ESLint ne peut pas vérifier automatiquement que les règles des hooks sont respectées.

**Comment les conventions résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Confusion avec les fonctions classiques | Le préfixe `use` signale à React et ESLint que c'est un hook |
| Code imprévisible | Les conventions définissent une structure commune (paramètres, retour) |
| Erreurs silencieuses | ESLint détecte automatiquement les violations grâce au préfixe `use` |

**Analogie concrète** : Les conventions des hooks sont comme les normes d'étiquetage des médicaments dans une pharmacie. Chaque boîte suit le même format : nom du médicament, dosage, posologie. Grâce à ces conventions, le pharmacien (React) sait immédiatement comment traiter chaque boîte. Sans étiquetage normalisé, il serait impossible de distinguer un médicament d'un complément alimentaire, et des erreurs pourraient passer inaperçues.

**Règle 1 : Le nom commence par "use"**

C'est obligatoire. React utilise ce préfixe pour appliquer les règles des hooks (pas d'appel conditionnel, pas d'appel dans une boucle).

```tsx
// ❌ Pas un hook : React n'applique pas les règles des hooks
function recupererDonnees() {
  const [donnees, setDonnees] = useState(null);
  // ...
}

// ✅ Un hook : React applique les règles des hooks
function useRecupererDonnees() {
  const [donnees, setDonnees] = useState(null);
  // ...
}
```

**Règle 2 : Le hook retourne ce dont le composant a besoin**

Un hook retourne un objet ou un tableau avec l'état et les fonctions que le composant utilise.

```tsx
// Retourne un objet : noms explicites
function useCompteur() {
  const [valeur, setValeur] = useState(0);
  const incrementer = () => setValeur((v) => v + 1);
  const decrementer = () => setValeur((v) => v - 1);
  return { valeur, incrementer, decrementer };
}

// Retourne un tableau : destructuring positionnel (comme useState)
function useToggle(initial: boolean) {
  const [actif, setActif] = useState(initial);
  const basculer = () => setActif((a) => !a);
  return [actif, basculer] as const;
}
```

**Règle 3 : Le hook accepte des paramètres pour être configurable**

```tsx
// Le hook accepte une valeur initiale et un pas
function useCompteur(initial: number = 0, pas: number = 1) {
  const [valeur, setValeur] = useState(initial);
  const incrementer = () => setValeur((v) => v + pas);
  return { valeur, incrementer };
}
```

---

Le diagramme suivant montre comment un hook personnalisé centralise la logique partagée entre plusieurs composants.

<div class="diagram-design">
<p><a href="../../diagrams/08-react-11-hooks-personnalises-1.html">Les conventions des hooks personnalisés (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-11-hooks-personnalises-1.html" title="Les conventions des hooks personnalisés" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Quand créer un hook personnalisé ?

**Définition** : Créer un hook personnalisé est pertinent quand une logique avec état (utilisant `useState`, `useEffect` ou d'autres hooks) est dupliquée ou rend un composant trop complexe.

**Le problème que cette question résout** :

Sans critères clairs :

1. **Extraction prématurée** : tu crées un hook pour une logique qui n'est utilisée qu'une seule fois. Tu ajoutes un fichier supplémentaire et de l'indirection pour rien.
2. **Extraction tardive** : tu copies-colles la même combinaison `useState` + `useEffect` dans 5 composants avant de réaliser qu'un hook serait utile. Chaque copie peut diverger et introduire des bugs.
3. **Hooks fourre-tout** : sans règle, tu crées un hook géant qui gère tout (état, effets, validation, appels API) au lieu de plusieurs petits hooks ciblés.

**Comment des critères clairs résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Extraction prématurée | Le critère "2+ composants partagent la même logique" évite de créer des hooks inutiles |
| Extraction tardive | Le critère "composant surchargé (3-4+ hooks)" signale qu'il est temps d'extraire |
| Hooks fourre-tout | Le critère "une responsabilité par hook" garde les hooks simples et testables |

**Analogie concrète** : Imagine que tu cuisines souvent la même vinaigrette pour tes salades. La première fois, tu mélanges les ingrédients directement dans le saladier. La deuxième fois, tu refais la même chose dans un autre saladier. À la troisième fois, tu te dis : "Je vais préparer un bocal de vinaigrette prête à l'emploi." C'est le même raisonnement pour les hooks : tu extrais la logique dans un hook quand tu la répètes, pas dès la première utilisation.

**Critères pour créer un hook** :

| Situation | Créer un hook ? |
| --- | --- |
| La même logique (useState + useEffect) est dupliquée dans 2+ composants | Oui |
| Un composant a plus de 3-4 hooks et devient difficile à lire | Oui |
| La logique est complexe et mérite d'être testée isolément | Oui |
| Un calcul simple sans hooks (fonction pure) | Non, une fonction classique suffit |
| La logique n'est utilisée que dans un seul composant et reste simple | Non, pas nécessaire |

---

## Étapes Pratiques

### Étape 1 : Créer un hook useToggle

Crée `src/hooks/useToggle.ts` :

```bash
mkdir -p src/hooks
```

```tsx
// src/hooks/useToggle.ts
import { useState } from "react";

// useToggle gère un état booléen avec une fonction pour le basculer
// Paramètre : la valeur initiale (false par défaut)
// Retourne : [valeur actuelle, fonction pour basculer]
function useToggle(initial: boolean = false): [boolean, () => void] {
  const [actif, setActif] = useState(initial);

  // basculer inverse la valeur actuelle
  const basculer = () => setActif((prev) => !prev);

  return [actif, basculer];
}

export default useToggle;
```

Crée `src/components/ExempleToggle.tsx` :

```tsx
// src/components/ExempleToggle.tsx
import useToggle from "../hooks/useToggle";

function ExempleToggle() {
  // Chaque appel à useToggle crée un état indépendant
  const [menuOuvert, basculerMenu] = useToggle(false);
  const [modeEdition, basculerEdition] = useToggle(false);
  const [themesSombre, basculerTheme] = useToggle(false);

  return (
    <div>
      <h2>Exemple useToggle</h2>

      <div style={{ marginBottom: "12px" }}>
        <button onClick={basculerMenu}>
          Menu : {menuOuvert ? "Ouvert" : "Fermé"}
        </button>
        {menuOuvert && (
          <ul>
            <li>Accueil</li>
            <li>Profil</li>
            <li>Paramètres</li>
          </ul>
        )}
      </div>

      <div style={{ marginBottom: "12px" }}>
        <button onClick={basculerEdition}>
          Mode édition : {modeEdition ? "Activé" : "Désactivé"}
        </button>
      </div>

      <div style={{ marginBottom: "12px" }}>
        <button onClick={basculerTheme}>
          Thème : {themesSombre ? "Sombre" : "Clair"}
        </button>
      </div>
    </div>
  );
}

export default ExempleToggle;
```

**Résultat attendu** : trois boutons indépendants qui basculent chacun leur état.

---

### Étape 2 : Créer un hook useLocalStorage

```tsx
// src/hooks/useLocalStorage.ts
import { useState } from "react";

// useLocalStorage synchronise un état avec le localStorage
// T est le type générique de la valeur stockée
function useLocalStorage<T>(cle: string, valeurInitiale: T): [T, (valeur: T) => void] {
  // Initialisation paresseuse : lit le localStorage une seule fois
  const [valeur, setValeur] = useState<T>(() => {
    const sauvegarde = localStorage.getItem(cle);

    // Si une valeur existe dans le localStorage, on la parse
    if (sauvegarde !== null) {
      return JSON.parse(sauvegarde) as T;
    }

    // Sinon, on utilise la valeur initiale
    return valeurInitiale;
  });

  // Fonction qui met à jour l'état ET le localStorage
  const definir = (nouvelleValeur: T) => {
    setValeur(nouvelleValeur);
    localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
  };

  return [valeur, definir];
}

export default useLocalStorage;
```

Crée `src/components/ExempleLocalStorage.tsx` :

```tsx
// src/components/ExempleLocalStorage.tsx
import useLocalStorage from "../hooks/useLocalStorage";

function ExempleLocalStorage() {
  // Le nom est sauvegardé dans localStorage sous la clé "nom"
  const [nom, setNom] = useLocalStorage("nom", "");

  // Le compteur est sauvegardé sous la clé "compteur"
  const [compteur, setCompteur] = useLocalStorage("compteur", 0);

  // Les préférences sont un objet sauvegardé sous la clé "preferences"
  const [preferences, setPreferences] = useLocalStorage("preferences", {
    theme: "clair",
    langue: "fr",
  });

  return (
    <div>
      <h2>Exemple useLocalStorage</h2>
      <p>Les valeurs sont conservées après rechargement de la page.</p>

      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="nom-storage">Nom : </label>
        <input
          id="nom-storage"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          style={{ padding: "8px" }}
        />
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p>Compteur : {compteur}</p>
        <button onClick={() => setCompteur(compteur + 1)} style={{ marginRight: "8px" }}>
          +1
        </button>
        <button onClick={() => setCompteur(0)}>Réinitialiser</button>
      </div>

      <div style={{ marginBottom: "16px" }}>
        <p>Thème : {preferences.theme}</p>
        <button
          onClick={() => setPreferences({
            ...preferences,
            theme: preferences.theme === "clair" ? "sombre" : "clair",
          })}
        >
          Basculer le thème
        </button>
      </div>
    </div>
  );
}

export default ExempleLocalStorage;
```

**Résultat attendu** : toutes les valeurs sont conservées après rechargement de la page.

---

### Étape 3 : Créer un hook useWindowSize

```tsx
// src/hooks/useWindowSize.ts
import { useState, useEffect } from "react";

// Interface pour la taille de la fenêtre
interface TailleFenetre {
  largeur: number;
  hauteur: number;
}

// useWindowSize surveille la taille de la fenêtre du navigateur
function useWindowSize(): TailleFenetre {
  const [taille, setTaille] = useState<TailleFenetre>({
    largeur: window.innerWidth,
    hauteur: window.innerHeight,
  });

  useEffect(() => {
    // Handler qui met à jour la taille quand la fenêtre est redimensionnée
    const gererRedimensionnement = () => {
      setTaille({
        largeur: window.innerWidth,
        hauteur: window.innerHeight,
      });
    };

    // Écoute l'événement resize
    window.addEventListener("resize", gererRedimensionnement);

    // Nettoyage : retire l'écouteur au démontage
    return () => {
      window.removeEventListener("resize", gererRedimensionnement);
    };
  }, []); // [] = l'écouteur est ajouté une seule fois

  return taille;
}

export default useWindowSize;
```

Crée `src/components/ExempleWindowSize.tsx` :

```tsx
// src/components/ExempleWindowSize.tsx
import useWindowSize from "../hooks/useWindowSize";

function ExempleWindowSize() {
  const { largeur, hauteur } = useWindowSize();

  // Détermine le type d'écran selon la largeur
  const typeEcran = largeur < 768 ? "Mobile" : largeur < 1024 ? "Tablette" : "Desktop";

  return (
    <div>
      <h2>Taille de la fenêtre</h2>
      <p>Largeur : {largeur}px</p>
      <p>Hauteur : {hauteur}px</p>
      <p>Type d'écran : {typeEcran}</p>
      <p style={{ color: "#666" }}>Redimensionne la fenêtre pour voir les valeurs changer.</p>
    </div>
  );
}

export default ExempleWindowSize;
```

**Résultat attendu** : les dimensions s'actualisent en temps réel quand la fenêtre est redimensionnée.

---

### Étape 4 : Créer un hook useDebounce

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

// useDebounce retarde la mise à jour d'une valeur
// Utile pour éviter les appels API à chaque frappe de touche
function useDebounce<T>(valeur: T, delai: number = 500): T {
  const [valeurRetardee, setValeurRetardee] = useState(valeur);

  useEffect(() => {
    // Crée un timer qui met à jour la valeur après le délai
    const timer = setTimeout(() => {
      setValeurRetardee(valeur);
    }, delai);

    // Nettoyage : annule le timer précédent si la valeur change
    // avant la fin du délai
    return () => {
      clearTimeout(timer);
    };
  }, [valeur, delai]);

  return valeurRetardee;
}

export default useDebounce;
```

Crée `src/components/ExempleDebounce.tsx` :

```tsx
// src/components/ExempleDebounce.tsx
import { useState } from "react";
import useDebounce from "../hooks/useDebounce";

function ExempleDebounce() {
  const [recherche, setRecherche] = useState("");

  // La valeur retardée ne change que 500ms après la dernière frappe
  const rechercheRetardee = useDebounce(recherche, 500);

  // Données fictives pour la recherche
  const produits = [
    "Clavier mécanique", "Souris ergonomique", "Casque audio",
    "Webcam HD", "Écran 27 pouces", "Hub USB-C",
    "Tapis de souris", "Support écran", "Lampe de bureau",
  ];

  // Filtre les produits avec la valeur retardée (pas la valeur en temps réel)
  const resultats = rechercheRetardee.length > 0
    ? produits.filter((p) =>
      p.toLowerCase().includes(rechercheRetardee.toLowerCase())
    )
    : [];

  return (
    <div>
      <h2>Recherche avec debounce</h2>
      <input
        type="text"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        placeholder="Rechercher un produit..."
        style={{ width: "300px", padding: "8px" }}
      />

      <p style={{ color: "#666", fontSize: "14px" }}>
        Valeur saisie : "{recherche}"
      </p>
      <p style={{ color: "#666", fontSize: "14px" }}>
        Valeur retardée (500ms) : "{rechercheRetardee}"
      </p>

      {resultats.length > 0 && (
        <ul>
          {resultats.map((produit) => (
            <li key={produit}>{produit}</li>
          ))}
        </ul>
      )}

      {rechercheRetardee.length > 0 && resultats.length === 0 && (
        <p>Aucun produit trouvé pour "{rechercheRetardee}".</p>
      )}
    </div>
  );
}

export default ExempleDebounce;
```

**Résultat attendu** : la recherche ne se déclenche que 500ms après la dernière frappe, pas à chaque caractère tapé.

---

### Étape 5 : Composer plusieurs hooks

```tsx
// src/hooks/useFormulaire.ts
import { useState } from "react";

// Interface générique pour les erreurs
type Erreurs<T> = Partial<Record<keyof T, string>>;

// Interface pour le retour du hook
interface RetourFormulaire<T> {
  valeurs: T;
  erreurs: Erreurs<T>;
  modifierChamp: (champ: keyof T, valeur: T[keyof T]) => void;
  definirErreurs: (erreurs: Erreurs<T>) => void;
  reinitialiser: () => void;
  estValide: boolean;
}

// useFormulaire gère l'état et la validation d'un formulaire
function useFormulaire<T extends Record<string, unknown>>(
  valeursInitiales: T,
  validateur?: (valeurs: T) => Erreurs<T>
): RetourFormulaire<T> {
  const [valeurs, setValeurs] = useState<T>(valeursInitiales);
  const [erreurs, setErreurs] = useState<Erreurs<T>>({});

  // Modifie un champ et relance la validation
  const modifierChamp = (champ: keyof T, valeur: T[keyof T]) => {
    const nouvellesValeurs = { ...valeurs, [champ]: valeur };
    setValeurs(nouvellesValeurs);

    // Valide automatiquement si un validateur est fourni
    if (validateur) {
      setErreurs(validateur(nouvellesValeurs));
    }
  };

  const definirErreurs = (nouvellesErreurs: Erreurs<T>) => {
    setErreurs(nouvellesErreurs);
  };

  // Réinitialise le formulaire
  const reinitialiser = () => {
    setValeurs(valeursInitiales);
    setErreurs({});
  };

  // Le formulaire est valide si aucune erreur
  const estValide = Object.keys(erreurs).length === 0;

  return { valeurs, erreurs, modifierChamp, definirErreurs, reinitialiser, estValide };
}

export default useFormulaire;
```

Crée `src/components/ExempleFormulaire.tsx` :

```tsx
// src/components/ExempleFormulaire.tsx
import useFormulaire from "../hooks/useFormulaire";

// Données du formulaire
interface DonneesContact {
  nom: string;
  email: string;
  message: string;
}

// Fonction de validation
function validerContact(valeurs: DonneesContact) {
  const erreurs: Partial<Record<keyof DonneesContact, string>> = {};

  if (valeurs.nom.trim().length < 2) {
    erreurs.nom = "Le nom doit contenir au moins 2 caractères";
  }
  if (!valeurs.email.includes("@")) {
    erreurs.email = "L'email doit contenir @";
  }
  if (valeurs.message.trim().length < 10) {
    erreurs.message = "Le message doit contenir au moins 10 caractères";
  }

  return erreurs;
}

function ExempleFormulaire() {
  // useFormulaire gère tout l'état du formulaire
  const { valeurs, erreurs, modifierChamp, reinitialiser, estValide } = useFormulaire<DonneesContact>(
    { nom: "", email: "", message: "" },
    validerContact
  );

  const gererSoumission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (estValide) {
      console.log("Formulaire soumis :", valeurs);
      reinitialiser();
    }
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Formulaire avec useFormulaire</h2>
      <form onSubmit={gererSoumission}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="contact-nom">Nom :</label>
          <br />
          <input
            id="contact-nom"
            type="text"
            value={valeurs.nom}
            onChange={(e) => modifierChamp("nom", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          {erreurs.nom && <p style={{ color: "red", fontSize: "12px" }}>{erreurs.nom}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="contact-email">Email :</label>
          <br />
          <input
            id="contact-email"
            type="email"
            value={valeurs.email}
            onChange={(e) => modifierChamp("email", e.target.value)}
            style={{ width: "100%", padding: "8px" }}
          />
          {erreurs.email && <p style={{ color: "red", fontSize: "12px" }}>{erreurs.email}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="contact-message">Message :</label>
          <br />
          <textarea
            id="contact-message"
            value={valeurs.message}
            onChange={(e) => modifierChamp("message", e.target.value)}
            rows={4}
            style={{ width: "100%", padding: "8px" }}
          />
          {erreurs.message && <p style={{ color: "red", fontSize: "12px" }}>{erreurs.message}</p>}
        </div>

        <button type="submit" disabled={!estValide} style={{ padding: "8px 16px", marginRight: "8px" }}>
          Envoyer
        </button>
        <button type="button" onClick={reinitialiser} style={{ padding: "8px 16px" }}>
          Réinitialiser
        </button>
      </form>
    </div>
  );
}

export default ExempleFormulaire;
```

**Résultat attendu** : un formulaire avec validation en temps réel, géré entièrement par le hook `useFormulaire`.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types |

---

## Pièges Fréquents

### Piège 1 : Oublier le préfixe "use"

⚠️ **Problème** : Nommer un hook sans le préfixe `use`. React n'applique pas les règles des hooks et ESLint ne signale pas les erreurs.

✅ **Solution** : Nomme toujours tes hooks personnalisés avec le préfixe `use`.

```tsx
// ❌ React ne reconnaît pas cet appel comme un hook
function recupererDonnees() {
  useEffect(() => { /* ... */ }, []);
}

// ✅ React applique les règles des hooks
function useRecupererDonnees() {
  useEffect(() => { /* ... */ }, []);
}
```

---

### Piège 2 : Croire que l'état est partagé entre composants

⚠️ **Problème** : Penser que deux composants qui appellent le même hook partagent le même état. Chaque appel crée une instance indépendante.

✅ **Solution** : Si tu as besoin d'état partagé, utilise le Context (fiche 10). Les hooks personnalisés partagent la logique, pas l'état.

```tsx
// Composant A et Composant B ont chacun leur propre compteur
function ComposantA() {
  const { valeur } = useCompteur(); // valeur indépendante
}

function ComposantB() {
  const { valeur } = useCompteur(); // autre valeur, indépendante de A
}
```

---

### Piège 3 : Créer un hook pour une logique sans hooks

⚠️ **Problème** : Créer un hook personnalisé pour une logique qui n'utilise pas `useState`, `useEffect` ou d'autres hooks React. Cela ajoute de la complexité inutile.

✅ **Solution** : Si la logique est une fonction pure (pas de hooks), une fonction classique suffit.

```tsx
// ❌ Inutile : aucun hook React à l'intérieur
function useFormaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}

// ✅ Correct : une fonction classique suffit
function formaterDate(date: Date): string {
  return date.toLocaleDateString("fr-FR");
}
```

---

### Piège 4 : Hook avec trop de responsabilités

⚠️ **Problème** : Un hook qui gère l'authentification, les appels API, le cache et la navigation en même temps. Il est difficile à comprendre et à tester.

✅ **Solution** : Un hook = une responsabilité. Compose plusieurs petits hooks plutôt qu'un gros.

```tsx
// ❌ Hook qui fait trop de choses
function useApp() {
  // gère l'auth + les données + la navigation + le thème
}

// ✅ Plusieurs hooks spécialisés
function useAuth() { /* gère l'authentification */ }
function useDonnees() { /* gère les appels API */ }
function useTheme() { /* gère le thème */ }
```

---

## Checklist de Validation

- [ ] Je sais créer un hook personnalisé avec le préfixe `use`
- [ ] Je comprends que chaque appel au hook crée un état indépendant
- [ ] Je sais quand créer un hook vs une fonction classique
- [ ] Je sais retourner un objet ou un tableau depuis un hook
- [ ] Je sais passer des paramètres à un hook pour le rendre configurable
- [ ] Je sais composer plusieurs hooks ensemble
- [ ] Je sais ranger mes hooks dans un dossier `src/hooks/`

---

## Exercice Pratique

**Énoncé** : Crée un hook `useCompteARebours` qui gère un compte à rebours :

1. Le hook accepte un nombre de secondes en paramètre
2. Il retourne : le temps restant, une fonction `demarrer`, une fonction `arreter` et un booléen `termine`
3. Le compte à rebours se décrémente chaque seconde quand il est actif
4. Quand le temps atteint 0, le compte à rebours s'arrête et `termine` vaut `true`
5. Crée un composant `Minuteur` qui utilise ce hook avec un input pour choisir la durée

**Indications** :

- Utilise `useState` pour le temps restant et l'état actif
- Utilise `useEffect` avec `setInterval` pour décrémenter chaque seconde
- Le nettoyage doit arrêter l'intervalle
- Formate le temps en MM:SS avec `padStart`

**Résultat attendu** : un minuteur configurable avec démarrage, arrêt et indication de fin.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/hooks/useCompteARebours.ts` :

```tsx
// src/hooks/useCompteARebours.ts
import { useState, useEffect } from "react";

interface RetourCompteARebours {
  tempsRestant: number;
  demarrer: () => void;
  arreter: () => void;
  termine: boolean;
}

function useCompteARebours(dureeInitiale: number): RetourCompteARebours {
  const [tempsRestant, setTempsRestant] = useState(dureeInitiale);
  const [actif, setActif] = useState(false);

  // Met à jour la durée si le paramètre change et que le timer n'est pas actif
  useEffect(() => {
    if (!actif) {
      setTempsRestant(dureeInitiale);
    }
  }, [dureeInitiale, actif]);

  // Gère le décompte
  useEffect(() => {
    if (!actif || tempsRestant <= 0) return;

    const intervalId = setInterval(() => {
      setTempsRestant((prev) => {
        if (prev <= 1) {
          setActif(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [actif, tempsRestant]);

  const demarrer = () => {
    if (tempsRestant > 0) {
      setActif(true);
    }
  };

  const arreter = () => {
    setActif(false);
  };

  return {
    tempsRestant,
    demarrer,
    arreter,
    termine: tempsRestant === 0,
  };
}

export default useCompteARebours;
```

`src/components/Minuteur.tsx` :

```tsx
// src/components/Minuteur.tsx
import { useState } from "react";
import useCompteARebours from "../hooks/useCompteARebours";

function Minuteur() {
  const [duree, setDuree] = useState(60);
  const { tempsRestant, demarrer, arreter, termine } = useCompteARebours(duree);

  // Formate le temps en MM:SS
  const formater = (secondes: number): string => {
    const min = String(Math.floor(secondes / 60)).padStart(2, "0");
    const sec = String(secondes % 60).padStart(2, "0");
    return `${min}:${sec}`;
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h2>Minuteur</h2>

      <div style={{ marginBottom: "16px" }}>
        <label htmlFor="duree-minuteur">Durée (secondes) : </label>
        <input
          id="duree-minuteur"
          type="number"
          min={1}
          max={3600}
          value={duree}
          onChange={(e) => setDuree(Number(e.target.value))}
          style={{ padding: "8px", width: "100px" }}
        />
      </div>

      <p style={{ fontSize: "48px", fontFamily: "monospace", margin: "20px 0" }}>
        {formater(tempsRestant)}
      </p>

      {termine && (
        <p style={{ color: "green", fontWeight: "bold", fontSize: "18px" }}>
          Temps écoulé !
        </p>
      )}

      <div>
        <button onClick={demarrer} style={{ padding: "8px 16px", marginRight: "8px" }}>
          Démarrer
        </button>
        <button onClick={arreter} style={{ padding: "8px 16px" }}>
          Arrêter
        </button>
      </div>
    </div>
  );
}

export default Minuteur;
```

---

## Navigation

← Fiche précédente : **[10 - Context et état global](10-context-etat-global.md)**

→ Fiche suivante : **[12 - Appels API avec fetch](12-appels-api-fetch.md)**
