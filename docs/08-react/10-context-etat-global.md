---
tags:
  - React
  - Intermédiaire
  - Concept
description: "Partager l'état entre composants avec Context API et useReducer."
estimated_time: "90 min"
fiche_number: 10
total_fiches: 19
cursus: "React"
id: "web.react.context-etat-global"
course_id: "web.react"
content_type: "lesson"
order: 10
---

# 10 - Context et état global

> **En bref** : Utiliser createContext et useContext pour partager des données entre composants sans prop drilling, et combiner Context avec useReducer pour gérer un état global. Lecture estimée : 90 min.

## Prérequis

- Fiche précédente : [09 - React Router](09-react-router.md)
- Savoir utiliser `useState` et `useEffect`
- Comprendre les props et la composition

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un Context pour partager des données entre composants, utiliser useReducer pour gérer un état complexe et éviter le prop drilling.

---

## Concepts

### Qu'est-ce que le prop drilling ?

**Définition** : Le prop drilling est le problème qui survient quand on doit passer des props à travers plusieurs niveaux de composants intermédiaires qui n'utilisent pas ces props, uniquement pour les transmettre à un composant descendant.

**Le problème du prop drilling** :

1. **Code verbeux** : chaque composant intermédiaire doit déclarer et transmettre des props qu'il n'utilise pas.
2. **Maintenance difficile** : ajouter ou modifier une prop nécessite de modifier tous les composants intermédiaires.
3. **Composants pollués** : les composants intermédiaires reçoivent des props dont ils n'ont pas besoin.

<div class="diagram-design">
<p><a href="../../diagrams/08-react-10-context-etat-global-1.html">Qu&#x27;est-ce que le prop drilling ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-10-context-etat-global-1.html" title="Qu&#x27;est-ce que le prop drilling ?" style="width:100%;min-height:824px;border:0;background:transparent"></iframe>
</div>

Avec le prop drilling, chaque composant intermédiaire transmet les props sans les utiliser. Avec le Context, le Bouton accède directement aux données du Provider.

**Analogie concrète** : Le prop drilling est comme passer un message dans une file d'attente. Si tu veux transmettre un message à la 10e personne, il faut que les 9 personnes intermédiaires le passent, même si le message ne les concerne pas. Le Context est comme un haut-parleur : le message est diffusé directement à ceux qui l'écoutent.

---

### Qu'est-ce que le Context API ?

**Définition** : Le Context API est un mécanisme intégré à React qui permet de partager des données entre composants sans les passer via les props. Un composant "fournisseur" (Provider) met les données à disposition, et n'importe quel composant descendant peut y accéder directement avec `useContext`.

**Le problème que le Context résout** :

Sans Context :

1. **Prop drilling** : il faut passer les données à travers tous les composants intermédiaires.
2. **État dupliqué** : chaque composant qui a besoin des données gère sa propre copie, ce qui crée des incohérences.
3. **Composants trop couplés** : changer la structure des composants nécessite de revoir toute la chaîne de props.

**Comment le Context résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Prop drilling | Les données sont accessibles directement depuis n'importe quel descendant |
| État dupliqué | Une seule source de vérité dans le Provider |
| Composants trop couplés | Les composants intermédiaires n'ont pas besoin de connaître les données |

**Le flux du Context en 3 étapes** :

<div class="diagram-design">
<p><a href="../../diagrams/08-react-10-context-etat-global-2.html">Qu&#x27;est-ce que le Context API ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-10-context-etat-global-2.html" title="Qu&#x27;est-ce que le Context API ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

**Ce que le Context n'est PAS** :

- Le Context n'est pas un gestionnaire d'état. Il transporte des données, mais ne gère pas la logique de mise à jour. Pour cela, on le combine avec `useState` ou `useReducer`.
- Le Context n'est pas adapté aux données qui changent très fréquemment. Chaque changement de valeur du Context re-rend tous les composants qui le consomment.

---

### Qu'est-ce que useReducer ?

**Définition** : `useReducer` est un hook React qui gère un état complexe via un "reducer" : une fonction qui prend l'état actuel et une action, et retourne le nouvel état. C'est une alternative à `useState` pour les états avec plusieurs valeurs interdépendantes.

**Le problème que useReducer résout** :

Sans useReducer :

1. **Multiples useState** : un composant avec 5 variables d'état liées nécessite 5 appels à `useState` et la logique de mise à jour est dispersée dans plusieurs fonctions.
2. **Transitions incohérentes** : modifier deux variables d'état en même temps peut créer un état temporaire incohérent.
3. **Logique complexe** : les `if/else` dans les handlers deviennent difficiles à suivre.

**Comment useReducer résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Multiples useState | Un seul objet d'état géré par le reducer |
| Transitions incohérentes | Le reducer retourne un état complet et cohérent |
| Logique complexe | Chaque action est un cas isolé dans un switch |

**Syntaxe** :

```tsx
import { useReducer } from "react";

// L'état est un objet avec toutes les données
interface Etat {
  compteur: number;
  historique: number[];
}

// Les actions décrivent ce qui s'est passé
type Action =
  | { type: "incrementer" }
  | { type: "decrementer" }
  | { type: "reinitialiser" };

// Le reducer calcule le nouvel état à partir de l'état actuel et de l'action
function reducer(etat: Etat, action: Action): Etat {
  switch (action.type) {
    case "incrementer":
      return {
        compteur: etat.compteur + 1,
        historique: [...etat.historique, etat.compteur + 1],
      };
    case "decrementer":
      return {
        compteur: etat.compteur - 1,
        historique: [...etat.historique, etat.compteur - 1],
      };
    case "reinitialiser":
      return { compteur: 0, historique: [] };
  }
}

// Utilisation dans un composant
function Compteur() {
  const [etat, dispatch] = useReducer(reducer, { compteur: 0, historique: [] });

  return (
    <div>
      <p>{etat.compteur}</p>
      <button onClick={() => dispatch({ type: "incrementer" })}>+</button>
      <button onClick={() => dispatch({ type: "decrementer" })}>-</button>
      <button onClick={() => dispatch({ type: "reinitialiser" })}>Reset</button>
    </div>
  );
}
```

**Analogie concrète** : `useReducer` est comme un guichet de banque. Tu ne mets pas la main dans le coffre (l'état) directement. Tu remplis un formulaire (l'action : "retrait", "dépôt", montant) et tu le donnes au guichetier (le reducer) qui effectue l'opération et te donne le nouveau solde.

**Comparaison useState vs useReducer** :

| useState | useReducer |
| --- | --- |
| 1-3 valeurs d'état simples | État complexe avec plusieurs valeurs liées |
| Mises à jour indépendantes | Mises à jour qui doivent être cohérentes |
| Logique simple | Logique avec plusieurs cas de mise à jour |
| Idéal pour les petits composants | Idéal pour les composants complexes ou les contextes |

---

## Étapes Pratiques

### Étape 1 : Créer un Context simple (thème)

Crée `src/contexts/ThemeContext.tsx` :

```bash
mkdir -p src/contexts
```

```tsx
// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Définit les types du thème
type Theme = "clair" | "sombre";

// Interface pour la valeur du contexte
interface ThemeContextType {
  theme: Theme;
  basculerTheme: () => void;
}

// Crée le contexte avec une valeur par défaut null
// La valeur par défaut est utilisée quand un composant consomme le contexte
// sans être enveloppé dans un Provider (ce qui est une erreur)
const ThemeContext = createContext<ThemeContextType | null>(null);

// Hook personnalisé pour consommer le contexte
// Il vérifie que le Provider est bien présent
function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (context === null) {
    throw new Error("useTheme doit être utilisé dans un ThemeProvider");
  }
  return context;
}

// Composant Provider qui fournit le thème à tous ses descendants
function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("clair");

  const basculerTheme = () => {
    setTheme((prev) => (prev === "clair" ? "sombre" : "clair"));
  };

  return (
    <ThemeContext.Provider value={{ theme, basculerTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export { ThemeProvider, useTheme };
```

---

### Étape 2 : Utiliser le Context dans les composants

Modifie `src/main.tsx` :

```tsx
// src/main.tsx
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import App from "./App.tsx";

// Le ThemeProvider enveloppe toute l'application
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
```

Crée `src/components/BoutonTheme.tsx` :

```tsx
// src/components/BoutonTheme.tsx
import { useTheme } from "../contexts/ThemeContext";

// Ce composant accède au thème DIRECTEMENT via useTheme()
// Pas besoin de passer le thème par les props
function BoutonTheme() {
  const { theme, basculerTheme } = useTheme();

  return (
    <button onClick={basculerTheme} style={{ padding: "8px 16px" }}>
      Thème actuel : {theme} (cliquer pour changer)
    </button>
  );
}

export default BoutonTheme;
```

Crée `src/components/Contenu.tsx` :

```tsx
// src/components/Contenu.tsx
import { useTheme } from "../contexts/ThemeContext";

function Contenu() {
  const { theme } = useTheme();

  // Les styles changent selon le thème
  const styles = {
    backgroundColor: theme === "clair" ? "#ffffff" : "#1a1a1a",
    color: theme === "clair" ? "#333333" : "#f0f0f0",
    padding: "20px",
    minHeight: "200px",
  };

  return (
    <div style={styles}>
      <h2>Contenu de la page</h2>
      <p>Ce texte change de couleur selon le thème sélectionné.</p>
      <p>Le thème est partagé entre tous les composants via le Context.</p>
    </div>
  );
}

export default Contenu;
```

Modifie `src/App.tsx` :

```tsx
// src/App.tsx
import BoutonTheme from "./components/BoutonTheme";
import Contenu from "./components/Contenu";
import { useTheme } from "./contexts/ThemeContext";

function App() {
  const { theme } = useTheme();

  return (
    <div style={{
      backgroundColor: theme === "clair" ? "#f5f5f5" : "#0d0d0d",
      minHeight: "100vh",
    }}>
      <header style={{ padding: "16px" }}>
        <BoutonTheme />
      </header>
      <main style={{ padding: "20px" }}>
        <Contenu />
      </main>
    </div>
  );
}

export default App;
```

**Résultat attendu** : un bouton qui bascule entre le thème clair et sombre. Tous les composants réagissent au changement.

---

### Étape 3 : Créer un Context avec useReducer (panier d'achat)

Crée `src/contexts/PanierContext.tsx` :

```tsx
// src/contexts/PanierContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

// Types pour les articles du panier
interface Article {
  id: number;
  nom: string;
  prix: number;
  quantite: number;
}

// L'état du panier
interface EtatPanier {
  articles: Article[];
}

// Les actions possibles sur le panier
type ActionPanier =
  | { type: "ajouter"; article: Omit<Article, "quantite"> }
  | { type: "retirer"; id: number }
  | { type: "modifier_quantite"; id: number; quantite: number }
  | { type: "vider" };

// Le reducer qui gère toutes les actions
function panierReducer(etat: EtatPanier, action: ActionPanier): EtatPanier {
  switch (action.type) {
    case "ajouter": {
      // Vérifie si l'article est déjà dans le panier
      const existant = etat.articles.find((a) => a.id === action.article.id);

      if (existant) {
        // Si oui, incrémente la quantité
        return {
          articles: etat.articles.map((a) =>
            a.id === action.article.id
              ? { ...a, quantite: a.quantite + 1 }
              : a
          ),
        };
      }

      // Si non, ajoute l'article avec une quantité de 1
      return {
        articles: [...etat.articles, { ...action.article, quantite: 1 }],
      };
    }

    case "retirer":
      return {
        articles: etat.articles.filter((a) => a.id !== action.id),
      };

    case "modifier_quantite":
      return {
        articles: etat.articles.map((a) =>
          a.id === action.id ? { ...a, quantite: action.quantite } : a
        ),
      };

    case "vider":
      return { articles: [] };
  }
}

// Interface du contexte
interface PanierContextType {
  articles: Article[];
  total: number;
  nombreArticles: number;
  ajouter: (article: Omit<Article, "quantite">) => void;
  retirer: (id: number) => void;
  modifierQuantite: (id: number, quantite: number) => void;
  vider: () => void;
}

const PanierContext = createContext<PanierContextType | null>(null);

// Hook personnalisé
function usePanier(): PanierContextType {
  const context = useContext(PanierContext);
  if (context === null) {
    throw new Error("usePanier doit être utilisé dans un PanierProvider");
  }
  return context;
}

// Provider
function PanierProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(panierReducer, { articles: [] });

  // Calcule le total
  const total = etat.articles.reduce(
    (somme, article) => somme + article.prix * article.quantite,
    0
  );

  // Calcule le nombre total d'articles
  const nombreArticles = etat.articles.reduce(
    (somme, article) => somme + article.quantite,
    0
  );

  // Fonctions simplifiées pour les composants
  const ajouter = (article: Omit<Article, "quantite">) => {
    dispatch({ type: "ajouter", article });
  };

  const retirer = (id: number) => {
    dispatch({ type: "retirer", id });
  };

  const modifierQuantite = (id: number, quantite: number) => {
    dispatch({ type: "modifier_quantite", id, quantite });
  };

  const vider = () => {
    dispatch({ type: "vider" });
  };

  return (
    <PanierContext.Provider
      value={{ articles: etat.articles, total, nombreArticles, ajouter, retirer, modifierQuantite, vider }}
    >
      {children}
    </PanierContext.Provider>
  );
}

export { PanierProvider, usePanier };
```

---

### Étape 4 : Utiliser le panier

Crée `src/components/ListeProduits.tsx` :

```tsx
// src/components/ListeProduits.tsx
import { usePanier } from "../contexts/PanierContext";

// Données fictives
const produits = [
  { id: 1, nom: "Clavier mécanique", prix: 89 },
  { id: 2, nom: "Souris ergonomique", prix: 45 },
  { id: 3, nom: "Casque audio", prix: 120 },
  { id: 4, nom: "Webcam HD", prix: 65 },
];

function ListeProduits() {
  const { ajouter } = usePanier();

  return (
    <div>
      <h2>Nos produits</h2>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {produits.map((produit) => (
          <div key={produit.id} style={{ border: "1px solid #ccc", padding: "16px" }}>
            <h3>{produit.nom}</h3>
            <p>{produit.prix} EUR</p>
            <button onClick={() => ajouter(produit)} style={{ padding: "8px 16px" }}>
              Ajouter au panier
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ListeProduits;
```

Crée `src/components/Panier.tsx` :

```tsx
// src/components/Panier.tsx
import { usePanier } from "../contexts/PanierContext";

function Panier() {
  const { articles, total, nombreArticles, retirer, modifierQuantite, vider } = usePanier();

  return (
    <div style={{ border: "2px solid #333", padding: "16px" }}>
      <h2>Panier ({nombreArticles} article{nombreArticles > 1 ? "s" : ""})</h2>

      {articles.length === 0 ? (
        <p>Le panier est vide.</p>
      ) : (
        <>
          {articles.map((article) => (
            <div
              key={article.id}
              style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #eee" }}
            >
              <span>{article.nom}</span>
              <div>
                <select
                  value={article.quantite}
                  onChange={(e) => modifierQuantite(article.id, Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5].map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
                <span style={{ margin: "0 8px" }}>
                  {article.prix * article.quantite} EUR
                </span>
                <button onClick={() => retirer(article.id)} style={{ color: "red" }}>
                  X
                </button>
              </div>
            </div>
          ))}

          <div style={{ marginTop: "16px", fontWeight: "bold" }}>
            Total : {total} EUR
          </div>

          <button onClick={vider} style={{ marginTop: "8px", padding: "8px 16px" }}>
            Vider le panier
          </button>
        </>
      )}
    </div>
  );
}

export default Panier;
```

---

### Étape 5 : Assembler avec les Providers

```tsx
// src/main.tsx
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "./contexts/ThemeContext";
import { PanierProvider } from "./contexts/PanierContext";
import App from "./App.tsx";

// Les Providers s'imbriquent : chaque Provider fournit son contexte
createRoot(document.getElementById("root")!).render(
  <ThemeProvider>
    <PanierProvider>
      <App />
    </PanierProvider>
  </ThemeProvider>
);
```

```tsx
// src/App.tsx
import ListeProduits from "./components/ListeProduits";
import Panier from "./components/Panier";
import BoutonTheme from "./components/BoutonTheme";

function App() {
  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <header>
        <h1>Ma boutique</h1>
        <BoutonTheme />
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginTop: "20px" }}>
        <ListeProduits />
        <Panier />
      </div>
    </div>
  );
}

export default App;
```

**Résultat attendu** : une boutique avec une liste de produits à gauche et un panier à droite. Les produits s'ajoutent au panier, la quantité est modifiable et le total se calcule automatiquement.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types |

---

## Pièges Fréquents

### Piège 1 : Utiliser le Context sans Provider

**Problème** : Consommer un Context avec `useContext` sans que le composant soit enveloppé dans le Provider correspondant. La valeur par défaut (souvent `null`) est retournée.

**Solution** : Crée un hook personnalisé qui vérifie la présence du Provider.

```tsx
// ✅ Le hook personnalisé lance une erreur claire
function useMonContext() {
  const context = useContext(MonContext);
  if (context === null) {
    throw new Error("useMonContext doit être utilisé dans un MonProvider");
  }
  return context;
}
```

---

### Piège 2 : Context pour tout

**Problème** : Utiliser le Context pour toutes les données, même celles qui ne sont utilisées que par un composant et son enfant direct.

**Solution** : Le Context est utile quand les données doivent traverser plusieurs niveaux. Pour un parent et son enfant direct, les props suffisent.

---

### Piège 3 : Re-renders excessifs

**Problème** : Créer un nouvel objet comme valeur du Provider à chaque rendu, ce qui re-rend tous les consommateurs.

**Solution** : Déplace la logique dans le Provider et expose des valeurs stables.

---

### Piège 4 : Mélanger état local et état global

**Problème** : Mettre toutes les données dans le Context global (y compris l'état d'un formulaire local). Le contexte se met à jour à chaque frappe de touche, ce qui re-rend des composants qui ne sont pas concernés.

**Solution** : Le Context est pour les données partagées (thème, utilisateur connecté, panier). L'état local (`useState`) est pour les données d'un seul composant (valeur d'un champ de formulaire, affichage d'un menu).

---

## Checklist de Validation

- [ ] Je comprends le problème du prop drilling
- [ ] Je sais créer un Context avec `createContext`
- [ ] Je sais fournir une valeur avec `Provider`
- [ ] Je sais consommer un Context avec `useContext`
- [ ] Je sais créer un hook personnalisé pour le Context
- [ ] Je comprends `useReducer` et la notion d'action/reducer
- [ ] Je sais combiner Context et useReducer
- [ ] Je sais quand utiliser le Context vs les props

---

## Exercice Pratique

**Énoncé** : Crée un système d'authentification simulé avec Context :

1. Un `AuthProvider` qui gère l'état de connexion (connecté/déconnecté, nom de l'utilisateur)
2. Un formulaire de connexion (email + mot de passe) qui simule une connexion
3. Une barre de navigation qui affiche le nom de l'utilisateur connecté ou "Non connecté"
4. Un bouton de déconnexion
5. Une page protégée qui affiche "Accès refusé" si non connecté

**Indications** :

- Utilise `useReducer` avec les actions : "connexion", "deconnexion"
- Le hook `useAuth` doit être accessible partout
- Simule la connexion (pas de vrai backend)

**Résultat attendu** : une application avec connexion/déconnexion et une page protégée.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/contexts/AuthContext.tsx` :

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

interface EtatAuth {
  estConnecte: boolean;
  utilisateur: string | null;
}

type ActionAuth =
  | { type: "connexion"; utilisateur: string }
  | { type: "deconnexion" };

function authReducer(etat: EtatAuth, action: ActionAuth): EtatAuth {
  switch (action.type) {
    case "connexion":
      return { estConnecte: true, utilisateur: action.utilisateur };
    case "deconnexion":
      return { estConnecte: false, utilisateur: null };
  }
}

interface AuthContextType {
  estConnecte: boolean;
  utilisateur: string | null;
  connexion: (email: string) => void;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error("useAuth doit être utilisé dans un AuthProvider");
  }
  return context;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(authReducer, {
    estConnecte: false,
    utilisateur: null,
  });

  const connexion = (email: string) => {
    dispatch({ type: "connexion", utilisateur: email });
  };

  const deconnexion = () => {
    dispatch({ type: "deconnexion" });
  };

  return (
    <AuthContext.Provider value={{ ...etat, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
```

Composant `PageProtegee` :

```tsx
// src/components/PageProtegee.tsx
import { useAuth } from "../contexts/AuthContext";

function PageProtegee() {
  const { estConnecte, utilisateur } = useAuth();

  if (!estConnecte) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#f8d7da", borderRadius: "4px" }}>
        <h2>Accès refusé</h2>
        <p>Tu dois être connecté pour accéder à cette page.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
      <h2>Page protégée</h2>
      <p>Bienvenue {utilisateur}. Tu as accès au contenu protégé.</p>
    </div>
  );
}

export default PageProtegee;
```

---

## Navigation

← Fiche précédente : **[09 - React Router](09-react-router.md)**

→ Fiche suivante : **[11 - Hooks personnalisés](11-hooks-personnalises.md)**
