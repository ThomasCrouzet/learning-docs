---
tags:
  - React
  - Avancé
  - Pratique
description: "Tester les composants React avec Testing Library, écrire des tests unitaires et d'intégration."
estimated_time: "90 min"
fiche_number: 15
total_fiches: 19
cursus: "React"
---

# 15 - Tests React

> **En bref** : Tester les composants React avec Testing Library, écrire des tests unitaires et d'intégration, simuler les interactions utilisateur et mocker les appels API. Lecture estimée : 90 min.

## Prérequis

- Fiche précédente : [14 - Formulaires avancés](14-formulaires-avances.md)
- Savoir créer des composants React avec hooks
- Connaître les bases du testing (cursus Testing et Qualité recommandé)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer Vitest et Testing Library, écrire des tests pour tes composants React, simuler les interactions utilisateur et mocker les appels API.

---

## Concepts

### Qu'est-ce que Testing Library ?

**Définition** : Testing Library est une famille de bibliothèques de test qui encourage à tester les composants de la même manière que l'utilisateur les utilise. Au lieu de tester les détails d'implémentation (état interne, nom de méthode), Testing Library teste ce que l'utilisateur voit et fait.

**Le problème que Testing Library résout** :

Sans Testing Library :

1. **Tests fragiles** : les tests qui vérifient l'état interne d'un composant cassent à chaque refactoring, même si le comportement ne change pas.
2. **Tests déconnectés de l'utilisateur** : tester qu'une variable d'état vaut `true` ne garantit pas que le bouton s'affiche.
3. **Sélecteurs fragiles** : utiliser des sélecteurs CSS (`.btn-primary`, `#header`) pour trouver les éléments rend les tests dépendants du style.

**Comment Testing Library résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Tests fragiles | Teste le comportement visible, pas l'implémentation |
| Tests déconnectés de l'utilisateur | Les requêtes utilisent le texte, le rôle ou le label |
| Sélecteurs fragiles | `getByRole`, `getByText`, `getByLabelText` au lieu de sélecteurs CSS |

**Le principe directeur de Testing Library** :

> "Plus tes tests ressemblent à la façon dont le logiciel est utilisé, plus ils te donnent confiance."

**Analogie concrète** : Tester avec Testing Library est comme tester un distributeur automatique en tant que client. Tu ne vérifies pas les circuits internes (l'état du composant). Tu mets une pièce (interaction), tu appuies sur un bouton (événement) et tu vérifies que la boisson sort (résultat visible).

**Ce que Testing Library n'est PAS** :

- Testing Library n'est pas un framework de test. Il utilise un framework comme Vitest ou Jest pour exécuter les tests.
- Testing Library ne remplace pas les tests E2E. Il teste les composants isolément, pas l'application complète dans un navigateur.

---

### Qu'est-ce que Vitest ?

**Définition** : Vitest est un framework de test JavaScript rapide, conçu pour fonctionner avec Vite. Il est compatible avec l'API de Jest mais utilise le bundler Vite pour une exécution plus rapide.

**Le problème que Vitest résout** :

Sans Vitest :

1. **Configuration complexe** : Jest nécessite une configuration spéciale pour TypeScript et les modules ESM.
2. **Lenteur** : Jest transforme chaque fichier avec Babel, ce qui est lent sur les gros projets.
3. **Incompatibilité avec Vite** : Jest ne comprend pas les imports Vite (`import.meta.env`, alias de chemins).

**Comment Vitest résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Configuration complexe | Vitest utilise la configuration Vite existante |
| Lenteur | Vitest réutilise les transformations Vite (esbuild) |
| Incompatibilité avec Vite | Vitest est conçu pour Vite |

**Comparaison Jest vs Vitest** :

| Jest | Vitest |
| --- | --- |
| Configuration séparée | Utilise `vite.config.ts` |
| Transformation Babel | Transformation esbuild (plus rapide) |
| API propriétaire | API compatible Jest |
| Projet indépendant | Intégré à l'écosystème Vite |

---

### Les types de requêtes Testing Library

**Définition** : Les requêtes Testing Library sont les fonctions qui permettent de trouver des éléments dans le DOM rendu. Elles sont classées par priorité d'utilisation.

**Le problème que les types de requêtes résolvent** :

Sans hiérarchie de requêtes :

1. **Sélecteurs arbitraires** : chaque développeur utilise le sélecteur qui lui vient en premier (`getByTestId`, `querySelector`). Les tests dépendent de détails techniques (attributs `data-testid` partout, classes CSS).
2. **Tests inaccessibles** : les tests passent, mais l'application n'est pas accessible. Un bouton sans label ni rôle ARIA fonctionne dans le test mais est invisible pour un lecteur d'écran.
3. **Résultats ambigus** : avec `getByText`, plusieurs éléments peuvent correspondre au même texte. Sans hiérarchie, le test sélectionne le mauvais élément.

**Comment la hiérarchie des requêtes résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Sélecteurs arbitraires | La hiérarchie recommande `getByRole` en premier, qui ne dépend pas du CSS |
| Tests inaccessibles | `getByRole` et `getByLabelText` vérifient implicitement l'accessibilité |
| Résultats ambigus | `getByRole` avec un nom précis (`{ name: /envoyer/i }`) cible un seul élément |

**Analogie concrète** : Les types de requêtes Testing Library sont comme les méthodes pour retrouver un livre dans une bibliothèque.
La meilleure méthode est de chercher par catégorie et titre (comme `getByRole` cherche par rôle et nom).
Si ce n'est pas possible, tu cherches par auteur (comme `getByLabelText` cherche par label).
En dernier recours, tu cherches par numéro de rangée et d'étagère (comme `getByTestId` cherche par identifiant technique).
Plus la méthode est proche de la façon dont un lecteur cherche un livre, plus elle est fiable et résistante à un réaménagement de la bibliothèque.

**Les requêtes par ordre de priorité** :

| Priorité | Requête | Quand l'utiliser |
| --- | --- | --- |
| 1 | `getByRole` | Boutons, liens, titres, formulaires (meilleur choix) |
| 2 | `getByLabelText` | Champs de formulaire avec un label |
| 3 | `getByPlaceholderText` | Champs avec un placeholder (si pas de label) |
| 4 | `getByText` | Texte visible dans la page |
| 5 | `getByDisplayValue` | Valeur actuelle d'un input |
| 6 | `getByTestId` | Dernier recours (ajouter `data-testid` au HTML) |

**Les trois variantes de chaque requête** :

| Variante | Comportement si non trouvé | Utilisation |
| --- | --- | --- |
| `getBy...` | Lance une erreur | Quand l'élément doit exister |
| `queryBy...` | Retourne `null` | Quand l'élément peut ne pas exister |
| `findBy...` | Attend (async) puis lance une erreur | Quand l'élément apparaît après un délai |

---

## Étapes Pratiques

### Étape 1 : Configurer Vitest et Testing Library

```bash
# Dans le dossier du projet React
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

**Ce que chaque paquet fait** :

| Paquet | Rôle |
| --- | --- |
| `vitest` | Framework de test |
| `@testing-library/react` | Rendu et requêtes pour React |
| `@testing-library/jest-dom` | Assertions DOM (`toBeInTheDocument`, `toHaveTextContent`) |
| `@testing-library/user-event` | Simulation d'interactions utilisateur |
| `jsdom` | Simulation du DOM dans Node.js |

Ajoute la configuration dans `vite.config.ts` :

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    // Utilise jsdom pour simuler le navigateur
    environment: "jsdom",
    // Configure les assertions DOM globalement
    setupFiles: ["./src/test/setup.ts"],
    // Active les variables globales (describe, it, expect)
    globals: true,
  },
});
```

Crée `src/test/setup.ts` :

```tsx
// src/test/setup.ts
// Ajoute les assertions DOM à chaque test
import "@testing-library/jest-dom";
```

Ajoute le script de test dans `package.json` :

```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run"
  }
}
```

**Résultat attendu** :

```text
Les paquets sont installés. Les fichiers vite.config.ts et src/test/setup.ts
sont configurés. La commande npx vitest run s'exécute sans erreur de
configuration (même si aucun test n'existe encore).
```

---

### Étape 2 : Premier test de composant

Crée `src/components/Salutation.tsx` :

```tsx
// src/components/Salutation.tsx
interface PropsSalutation {
  nom: string;
}

function Salutation({ nom }: PropsSalutation) {
  return (
    <div>
      <h1>Bonjour {nom}</h1>
      <p>Bienvenue dans l'application.</p>
    </div>
  );
}

export default Salutation;
```

Crée `src/components/Salutation.test.tsx` :

```tsx
// src/components/Salutation.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import Salutation from "./Salutation";

describe("Salutation", () => {
  it("affiche le nom de l'utilisateur", () => {
    // render affiche le composant dans un DOM simulé
    render(<Salutation nom="Alice" />);

    // screen.getByRole cherche un élément par son rôle ARIA
    // "heading" correspond à un h1, h2, h3, etc.
    const titre = screen.getByRole("heading", { name: /bonjour alice/i });

    // Vérifie que l'élément est dans le document
    expect(titre).toBeInTheDocument();
  });

  it("affiche le message de bienvenue", () => {
    render(<Salutation nom="Bob" />);

    // screen.getByText cherche un élément par son contenu textuel
    const message = screen.getByText(/bienvenue dans l'application/i);
    expect(message).toBeInTheDocument();
  });
});
```

**Résultat attendu** :

```text
$ npm test

 ✓ src/components/Salutation.test.tsx (2 tests)
   ✓ Salutation > affiche le nom de l'utilisateur
   ✓ Salutation > affiche le message de bienvenue

 Tests  2 passed
```

---

### Étape 3 : Tester les interactions utilisateur

Crée `src/components/Compteur.tsx` :

```tsx
// src/components/Compteur.tsx
import { useState } from "react";

function Compteur() {
  const [valeur, setValeur] = useState(0);

  return (
    <div>
      <p>Compteur : {valeur}</p>
      <button onClick={() => setValeur((v) => v + 1)}>Incrémenter</button>
      <button onClick={() => setValeur((v) => v - 1)}>Décrémenter</button>
      <button onClick={() => setValeur(0)}>Réinitialiser</button>
    </div>
  );
}

export default Compteur;
```

Crée `src/components/Compteur.test.tsx` :

```tsx
// src/components/Compteur.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import Compteur from "./Compteur";

describe("Compteur", () => {
  it("affiche la valeur initiale 0", () => {
    render(<Compteur />);
    expect(screen.getByText(/compteur : 0/i)).toBeInTheDocument();
  });

  it("incrémente quand on clique sur Incrémenter", async () => {
    // userEvent.setup() crée une instance pour simuler les interactions
    const user = userEvent.setup();
    render(<Compteur />);

    // Clique sur le bouton "Incrémenter"
    await user.click(screen.getByRole("button", { name: /incrémenter/i }));

    // Vérifie que la valeur a changé
    expect(screen.getByText(/compteur : 1/i)).toBeInTheDocument();
  });

  it("décrémente quand on clique sur Décrémenter", async () => {
    const user = userEvent.setup();
    render(<Compteur />);

    await user.click(screen.getByRole("button", { name: /décrémenter/i }));

    expect(screen.getByText(/compteur : -1/i)).toBeInTheDocument();
  });

  it("réinitialise la valeur à 0", async () => {
    const user = userEvent.setup();
    render(<Compteur />);

    // Incrémente deux fois
    await user.click(screen.getByRole("button", { name: /incrémenter/i }));
    await user.click(screen.getByRole("button", { name: /incrémenter/i }));
    expect(screen.getByText(/compteur : 2/i)).toBeInTheDocument();

    // Réinitialise
    await user.click(screen.getByRole("button", { name: /réinitialiser/i }));
    expect(screen.getByText(/compteur : 0/i)).toBeInTheDocument();
  });
});
```

**Résultat attendu** :

```text
 ✓ src/components/Compteur.test.tsx (4 tests)
   ✓ Compteur > affiche la valeur initiale 0
   ✓ Compteur > incrémente quand on clique sur Incrémenter
   ✓ Compteur > décrémente quand on clique sur Décrémenter
   ✓ Compteur > réinitialise la valeur à 0
```

---

### Étape 4 : Tester un formulaire

Crée `src/components/FormulaireContact.tsx` :

```tsx
// src/components/FormulaireContact.tsx
import { useState } from "react";

interface PropsContact {
  onEnvoi: (donnees: { nom: string; email: string; message: string }) => void;
}

function FormulaireContact({ onEnvoi }: PropsContact) {
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);

  const gererSoumission = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (nom.trim().length < 2) {
      setErreur("Le nom doit contenir au moins 2 caractères");
      return;
    }

    setErreur(null);
    onEnvoi({ nom, email, message });
  };

  return (
    <form onSubmit={gererSoumission}>
      <div>
        <label htmlFor="contact-nom">Nom :</label>
        <input
          id="contact-nom"
          type="text"
          value={nom}
          onChange={(e) => setNom(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-email">Email :</label>
        <input
          id="contact-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label htmlFor="contact-message">Message :</label>
        <textarea
          id="contact-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
      </div>

      {erreur && <p role="alert">{erreur}</p>}

      <button type="submit">Envoyer</button>
    </form>
  );
}

export default FormulaireContact;
```

Crée `src/components/FormulaireContact.test.tsx` :

```tsx
// src/components/FormulaireContact.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import FormulaireContact from "./FormulaireContact";

describe("FormulaireContact", () => {
  it("affiche les champs du formulaire", () => {
    render(<FormulaireContact onEnvoi={() => {}} />);

    // getByLabelText trouve les inputs par leur label
    expect(screen.getByLabelText(/nom/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /envoyer/i })).toBeInTheDocument();
  });

  it("appelle onEnvoi avec les données quand le formulaire est valide", async () => {
    const user = userEvent.setup();
    // vi.fn() crée une fonction mock (espion)
    const mockEnvoi = vi.fn();

    render(<FormulaireContact onEnvoi={mockEnvoi} />);

    // Remplit les champs
    await user.type(screen.getByLabelText(/nom/i), "Alice Dupont");
    await user.type(screen.getByLabelText(/email/i), "alice@exemple.fr");
    await user.type(screen.getByLabelText(/message/i), "Bonjour !");

    // Soumet le formulaire
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    // Vérifie que la fonction a été appelée avec les bonnes données
    expect(mockEnvoi).toHaveBeenCalledWith({
      nom: "Alice Dupont",
      email: "alice@exemple.fr",
      message: "Bonjour !",
    });
    expect(mockEnvoi).toHaveBeenCalledTimes(1);
  });

  it("affiche une erreur si le nom est trop court", async () => {
    const user = userEvent.setup();
    const mockEnvoi = vi.fn();

    render(<FormulaireContact onEnvoi={mockEnvoi} />);

    // Tape un nom trop court
    await user.type(screen.getByLabelText(/nom/i), "A");
    await user.click(screen.getByRole("button", { name: /envoyer/i }));

    // Vérifie que l'erreur s'affiche (role="alert")
    expect(screen.getByRole("alert")).toHaveTextContent(
      /le nom doit contenir au moins 2 caractères/i
    );

    // Vérifie que onEnvoi n'a PAS été appelé
    expect(mockEnvoi).not.toHaveBeenCalled();
  });
});
```

**Résultat attendu** :

```text
 ✓ src/components/FormulaireContact.test.tsx (3 tests)
   ✓ FormulaireContact > affiche les champs du formulaire
   ✓ FormulaireContact > appelle onEnvoi avec les données quand le formulaire est valide
   ✓ FormulaireContact > affiche une erreur si le nom est trop court

 Tests  3 passed
```

---

### Étape 5 : Mocker les appels API

Crée `src/components/ListeUtilisateurs.test.tsx` :

```tsx
// src/components/ListeUtilisateurs.test.tsx
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ListeUtilisateurs from "./ListeUtilisateurs";

// Mock global de fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("ListeUtilisateurs", () => {
  beforeEach(() => {
    // Réinitialise le mock avant chaque test
    mockFetch.mockReset();
  });

  it("affiche le message de chargement", () => {
    // fetch retourne une Promise qui ne se résout jamais (simule le chargement)
    mockFetch.mockReturnValue(new Promise(() => {}));

    render(<ListeUtilisateurs />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it("affiche les utilisateurs après le chargement", async () => {
    // Mock de la réponse fetch
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        { id: 1, nom: "Alice Dupont", email: "alice@exemple.fr" },
        { id: 2, nom: "Bob Martin", email: "bob@exemple.fr" },
      ],
    });

    render(<ListeUtilisateurs />);

    // findByText attend que l'élément apparaisse (async)
    expect(await screen.findByText(/alice dupont/i)).toBeInTheDocument();
    expect(screen.getByText(/bob martin/i)).toBeInTheDocument();
  });

  it("affiche une erreur si le fetch échoue", async () => {
    // Mock d'une erreur HTTP
    mockFetch.mockResolvedValue({
      ok: false,
      status: 500,
    });

    render(<ListeUtilisateurs />);

    // Attend que le message d'erreur apparaisse
    expect(await screen.findByText(/erreur/i)).toBeInTheDocument();
  });
});
```

**Résultat attendu** :

```text
 ✓ src/components/ListeUtilisateurs.test.tsx (3 tests)
   ✓ ListeUtilisateurs > affiche le message de chargement
   ✓ ListeUtilisateurs > affiche les utilisateurs après le chargement
   ✓ ListeUtilisateurs > affiche une erreur si le fetch échoue

 Tests  3 passed
```

---

### Étape 6 : Tester un hook personnalisé

Crée `src/hooks/useCompteur.test.ts` :

```tsx
// src/hooks/useCompteur.test.ts
import { renderHook, act } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { useState } from "react";

// Hook à tester
function useCompteur(initial: number = 0) {
  const [valeur, setValeur] = useState(initial);
  const incrementer = () => setValeur((v) => v + 1);
  const decrementer = () => setValeur((v) => v - 1);
  const reinitialiser = () => setValeur(initial);
  return { valeur, incrementer, decrementer, reinitialiser };
}

describe("useCompteur", () => {
  it("initialise avec la valeur par défaut", () => {
    // renderHook exécute le hook dans un composant wrapper
    const { result } = renderHook(() => useCompteur());

    expect(result.current.valeur).toBe(0);
  });

  it("initialise avec une valeur personnalisée", () => {
    const { result } = renderHook(() => useCompteur(10));

    expect(result.current.valeur).toBe(10);
  });

  it("incrémente la valeur", () => {
    const { result } = renderHook(() => useCompteur());

    // act() encapsule les mises à jour d'état
    act(() => {
      result.current.incrementer();
    });

    expect(result.current.valeur).toBe(1);
  });

  it("décrémente la valeur", () => {
    const { result } = renderHook(() => useCompteur(5));

    act(() => {
      result.current.decrementer();
    });

    expect(result.current.valeur).toBe(4);
  });

  it("réinitialise à la valeur initiale", () => {
    const { result } = renderHook(() => useCompteur(3));

    act(() => {
      result.current.incrementer();
      result.current.incrementer();
    });

    expect(result.current.valeur).toBe(5);

    act(() => {
      result.current.reinitialiser();
    });

    expect(result.current.valeur).toBe(3);
  });
});
```

**Résultat attendu** :

```text
 ✓ src/hooks/useCompteur.test.ts (5 tests)
   ✓ useCompteur > initialise avec la valeur par défaut
   ✓ useCompteur > initialise avec une valeur personnalisée
   ✓ useCompteur > incrémente la valeur
   ✓ useCompteur > décrémente la valeur
   ✓ useCompteur > réinitialise à la valeur initiale

 Tests  5 passed
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm test` | Lance Vitest en mode watch (relance les tests à chaque modification) |
| `npm run test:run` | Lance les tests une seule fois |
| `npx vitest --coverage` | Lance les tests avec le rapport de couverture |
| `npx vitest Compteur` | Lance uniquement les tests du fichier contenant "Compteur" |

---

## Pièges Fréquents

### Piège 1 : Utiliser getBy pour un élément asynchrone

⚠️ **Problème** : Utiliser `getByText` pour un élément qui apparaît après un appel API. Le test échoue car l'élément n'existe pas encore.

✅ **Solution** : Utilise `findByText` (async) pour les éléments qui apparaissent après un rendu asynchrone.

```tsx
// ❌ Échoue : l'élément n'existe pas encore
render(<ListeUtilisateurs />);
expect(screen.getByText("Alice")).toBeInTheDocument();

// ✅ Attend que l'élément apparaisse
render(<ListeUtilisateurs />);
expect(await screen.findByText("Alice")).toBeInTheDocument();
```

---

### Piège 2 : Oublier act() pour les mises à jour d'état

⚠️ **Problème** : Modifier l'état d'un composant dans un test sans encapsuler l'action dans `act()`. React affiche un avertissement.

✅ **Solution** : Utilise `userEvent` (qui encapsule automatiquement dans `act`) ou `act()` pour les hooks.

```tsx
// ❌ Avertissement React
result.current.incrementer();

// ✅ Correct avec act()
act(() => {
  result.current.incrementer();
});
```

---

### Piège 3 : Tester les détails d'implémentation

⚠️ **Problème** : Tester qu'un `useState` a telle valeur ou qu'un composant enfant a reçu telle prop. Ces tests cassent au moindre refactoring.

✅ **Solution** : Teste ce que l'utilisateur voit et fait.

```tsx
// ❌ Teste l'implémentation (fragile)
expect(composant.state.compteur).toBe(1);

// ✅ Teste le comportement visible
expect(screen.getByText(/compteur : 1/i)).toBeInTheDocument();
```

---

### Piège 4 : Ne pas nettoyer entre les tests

⚠️ **Problème** : Un test modifie le localStorage ou un état global, et cela affecte les tests suivants.

✅ **Solution** : Utilise `beforeEach` pour réinitialiser l'état. Testing Library nettoie automatiquement le DOM entre les tests.

```tsx
beforeEach(() => {
  localStorage.clear();
  vi.clearAllMocks();
});
```

---

## Checklist de Validation

- [ ] Je sais installer et configurer Vitest + Testing Library
- [ ] Je sais écrire un test de rendu simple (`render`, `screen.getByText`)
- [ ] Je sais simuler les interactions utilisateur (`userEvent.click`, `userEvent.type`)
- [ ] Je connais les requêtes par priorité (`getByRole`, `getByLabelText`, `getByText`)
- [ ] Je sais tester un formulaire (saisie, soumission, validation)
- [ ] Je sais mocker `fetch` pour tester les appels API
- [ ] Je sais utiliser `findByText` pour les éléments asynchrones
- [ ] Je sais tester un hook personnalisé avec `renderHook`

---

## Exercice Pratique

**Énoncé** : Écris une suite de tests pour le composant `GestionnaireTaches` (fiche 12) :

1. Teste que les tâches initiales s'affichent après le chargement
2. Teste l'ajout d'une nouvelle tâche
3. Teste la complétion d'une tâche (clic pour basculer)
4. Teste la suppression d'une tâche
5. Teste que le compteur de tâches restantes se met à jour

**Indications** :

- Mock `fetch` pour retourner des données de test
- Utilise `findByText` pour attendre le chargement
- Utilise `userEvent.type` pour remplir le champ de la nouvelle tâche
- Utilise `queryByText` pour vérifier qu'un élément a disparu

**Résultat attendu** : 5 tests qui passent, couvrant les principales fonctionnalités du composant.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
// src/components/GestionnaireTaches.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import GestionnaireTaches from "./GestionnaireTaches";

const mockFetch = vi.fn();
global.fetch = mockFetch;

const tachesInitiales = [
  { id: 1, titre: "Apprendre React", complete: false },
  { id: 2, titre: "Écrire des tests", complete: false },
  { id: 3, titre: "Configurer Vitest", complete: true },
];

describe("GestionnaireTaches", () => {
  beforeEach(() => {
    mockFetch.mockReset();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => tachesInitiales,
    });
  });

  it("affiche les tâches après le chargement", async () => {
    render(<GestionnaireTaches />);

    // Attend que le chargement se termine
    expect(await screen.findByText(/apprendre react/i)).toBeInTheDocument();
    expect(screen.getByText(/écrire des tests/i)).toBeInTheDocument();
    expect(screen.getByText(/configurer vitest/i)).toBeInTheDocument();
  });

  it("ajoute une nouvelle tâche", async () => {
    const user = userEvent.setup();
    render(<GestionnaireTaches />);

    // Attend le chargement
    await screen.findByText(/apprendre react/i);

    // Remplit le champ et soumet
    const champ = screen.getByPlaceholderText(/nouvelle tâche/i);
    await user.type(champ, "Déployer l'application");
    await user.click(screen.getByRole("button", { name: /ajouter/i }));

    // Vérifie que la nouvelle tâche apparaît
    expect(await screen.findByText(/déployer l'application/i)).toBeInTheDocument();
  });

  it("bascule l'état complet d'une tâche", async () => {
    const user = userEvent.setup();
    render(<GestionnaireTaches />);

    // Attend le chargement
    const tache = await screen.findByText(/apprendre react/i);

    // Clique pour compléter
    await user.click(tache);

    // Vérifie que le compteur a diminué
    expect(screen.getByText(/1 tâche\(s\) restante\(s\)/i)).toBeInTheDocument();
  });

  it("supprime une tâche", async () => {
    const user = userEvent.setup();
    render(<GestionnaireTaches />);

    await screen.findByText(/apprendre react/i);

    // Trouve les boutons de suppression
    const boutonsSupprimer = screen.getAllByRole("button", { name: /supprimer/i });

    // Clique sur le premier bouton supprimer
    await user.click(boutonsSupprimer[0]);

    // Vérifie que la tâche a disparu
    expect(screen.queryByText(/apprendre react/i)).not.toBeInTheDocument();
  });

  it("affiche le nombre correct de tâches restantes", async () => {
    render(<GestionnaireTaches />);

    await screen.findByText(/apprendre react/i);

    // 2 tâches non complétées sur 3 au départ
    expect(screen.getByText(/2 tâche\(s\) restante\(s\)/i)).toBeInTheDocument();
  });
});
```

---

## Navigation

← Fiche précédente : **[14 - Formulaires avancés](14-formulaires-avances.md)**

→ Fiche suivante : **[16 - Projet intégrateur](16-projet-integrateur.md)**
