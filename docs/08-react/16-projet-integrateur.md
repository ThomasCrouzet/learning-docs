---
tags:
  - React
  - Avancé
  - Projet
description: "Créer une SPA complète connectée à Symfony avec CRUD, authentification et routing."
estimated_time: "150 min"
fiche_number: 16
total_fiches: 19
cursus: "React"
---

# 16 - Projet intégrateur

> **En bref** : Construire une application React complète (SPA) avec routing, état global, appels API vers Symfony, formulaires avec validation et tests. Lecture estimée : 150 min.

## Prérequis

- Toutes les fiches précédentes du cursus React (01 à 15)
- Un projet Symfony avec une API JSON fonctionnelle (ou simulée avec des fichiers JSON locaux)
- Node.js 22 LTS installé

## Objectif de cette fiche

À la fin de cette fiche, tu auras construit une application React complète : un gestionnaire de tâches avec authentification, CRUD complet, routing, état global et tests. Ce projet met en pratique toutes les notions vues depuis la fiche 01.

---

## Concepts

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice qui combine toutes les compétences acquises dans un cursus pour construire une application complète et fonctionnelle. Chaque fonctionnalité utilise un concept vu dans les fiches précédentes.

**Le problème que le projet intégrateur résout** :

Sans projet intégrateur :

1. **Connaissances fragmentées** : chaque fiche enseigne un concept isolé, mais assembler ces concepts dans un vrai projet est une compétence distincte.
2. **Pas de vision d'ensemble** : savoir créer un composant ne signifie pas savoir structurer une application entière.
3. **Manque de confiance** : sans avoir construit un projet complet, on doute de sa capacité à le faire en situation réelle.

**Comment le projet intégrateur résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Connaissances fragmentées | Le projet combine tous les concepts en un seul endroit |
| Pas de vision d'ensemble | La structure du projet montre comment organiser une vraie application |
| Manque de confiance | Terminer le projet prouve qu'on maîtrise React |

**Analogie concrète** : Un projet intégrateur est comme un concert de fin d'année au conservatoire. Chaque morceau (chaque fiche) a été appris séparément pendant l'année. Le concert combine tous les morceaux en une performance continue. C'est la première fois que tu enchaînes tout du début à la fin, et c'est là que tu découvres si tu maîtrises vraiment chaque partie.

**Ce que ce projet utilise** :

| Concept | Fiche(s) |
| --- | --- |
| Composants et JSX | 03, 04 |
| État avec useState | 05 |
| Formulaires contrôlés | 06 |
| useEffect et cycle de vie | 07 |
| Listes et clés | 08 |
| React Router | 09 |
| Context et useReducer | 10 |
| Hooks personnalisés | 11 |
| Appels API avec fetch | 12 |
| Intégration Symfony | 13 |
| Formulaires avancés (React Hook Form + Zod) | 14 |
| Tests (Vitest + Testing Library) | 15 |

---

## Description du projet

### Application : TaskFlow

TaskFlow est un gestionnaire de tâches personnel avec les fonctionnalités suivantes :

1. **Authentification** : connexion/déconnexion avec token JWT
2. **Liste des tâches** : affichage, filtrage par statut, recherche par titre
3. **CRUD complet** : créer, lire, modifier, supprimer des tâches
4. **Catégories** : organiser les tâches par catégorie
5. **Routing** : navigation entre les pages (connexion, tableau de bord, détail d'une tâche)
6. **Tests** : tests unitaires des composants principaux

### Structure du projet

```text
taskflow/
├── public/
│   └── api/                    # Données JSON simulées
│       ├── taches.json
│       └── categories.json
├── src/
│   ├── components/             # Composants réutilisables
│   │   ├── BarreNavigation.tsx
│   │   ├── CarteTache.tsx
│   │   ├── ChampFormulaire.tsx
│   │   ├── FiltresTaches.tsx
│   │   └── RouteProtegee.tsx
│   ├── contexts/               # Contextes React
│   │   └── AuthContext.tsx
│   ├── hooks/                  # Hooks personnalisés
│   │   ├── useFetch.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── pages/                  # Pages (une par route)
│   │   ├── PageConnexion.tsx
│   │   ├── PageTableauDeBord.tsx
│   │   ├── PageDetailTache.tsx
│   │   ├── PageNouvelleTache.tsx
│   │   └── PageNonTrouvee.tsx
│   ├── schemas/                # Schémas Zod
│   │   └── tache.ts
│   ├── services/               # Services API
│   │   └── api.ts
│   ├── test/                   # Configuration des tests
│   │   └── setup.ts
│   ├── types/                  # Types TypeScript partagés
│   │   └── index.ts
│   ├── App.tsx
│   └── main.tsx
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Étapes Pratiques

### Étape 1 : Initialiser le projet

```bash
# Crée le projet avec Vite
npm create vite@latest taskflow -- --template react-ts

# Entre dans le dossier
cd taskflow

# Installe les dépendances
npm install

# Installe les dépendances supplémentaires
npm install react-router react-hook-form zod @hookform/resolvers

# Installe les dépendances de test
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event jsdom
```

Configure `vite.config.ts` :

```tsx
// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "jsdom",
    setupFiles: ["./src/test/setup.ts"],
    globals: true,
  },
});
```

Crée `src/test/setup.ts` :

```tsx
// src/test/setup.ts
import "@testing-library/jest-dom";
```

**Résultat attendu** :

```text
Le projet est créé. npm run dev affiche le serveur Vite sans erreur :

  VITE v7.x.x / v8.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
```

---

### Étape 2 : Définir les types et les données

Crée `src/types/index.ts` :

```tsx
// src/types/index.ts

// Représente une tâche
export interface Tache {
  id: number;
  titre: string;
  description: string;
  categorieId: number;
  statut: "a_faire" | "en_cours" | "terminee";
  priorite: "basse" | "moyenne" | "haute";
  dateCreation: string;
  dateEcheance: string;
}

// Représente une catégorie de tâches
export interface Categorie {
  id: number;
  nom: string;
  couleur: string;
}

// Données pour créer ou modifier une tâche
export interface DonneesTache {
  titre: string;
  description: string;
  categorieId: number;
  statut: "a_faire" | "en_cours" | "terminee";
  priorite: "basse" | "moyenne" | "haute";
  dateEcheance: string;
}

// Utilisateur connecté
export interface Utilisateur {
  id: number;
  email: string;
  nom: string;
}
```

Crée `public/api/categories.json` :

```json
[
  { "id": 1, "nom": "Travail", "couleur": "#3498db" },
  { "id": 2, "nom": "Personnel", "couleur": "#2ecc71" },
  { "id": 3, "nom": "Urgent", "couleur": "#e74c3c" }
]
```

Crée `public/api/taches.json` :

```json
[
  {
    "id": 1,
    "titre": "Terminer le cursus React",
    "description": "Compléter toutes les fiches du cursus React, y compris le projet intégrateur.",
    "categorieId": 1,
    "statut": "en_cours",
    "priorite": "haute",
    "dateCreation": "2025-01-15",
    "dateEcheance": "2025-02-28"
  },
  {
    "id": 2,
    "titre": "Configurer l'environnement Symfony",
    "description": "Installer PHP, Composer et créer un projet Symfony avec une API JSON.",
    "categorieId": 1,
    "statut": "terminee",
    "priorite": "haute",
    "dateCreation": "2025-01-10",
    "dateEcheance": "2025-01-20"
  },
  {
    "id": 3,
    "titre": "Ranger le bureau",
    "description": "Trier les documents, ranger les câbles et nettoyer l'écran.",
    "categorieId": 2,
    "statut": "a_faire",
    "priorite": "basse",
    "dateCreation": "2025-01-18",
    "dateEcheance": "2025-01-25"
  },
  {
    "id": 4,
    "titre": "Corriger le bug de connexion",
    "description": "Le formulaire de connexion ne valide pas l'email correctement.",
    "categorieId": 3,
    "statut": "a_faire",
    "priorite": "haute",
    "dateCreation": "2025-01-20",
    "dateEcheance": "2025-01-22"
  },
  {
    "id": 5,
    "titre": "Écrire les tests du composant Panier",
    "description": "Tester l'ajout, la suppression et le calcul du total du panier.",
    "categorieId": 1,
    "statut": "a_faire",
    "priorite": "moyenne",
    "dateCreation": "2025-01-19",
    "dateEcheance": "2025-02-01"
  }
]
```

**Résultat attendu** :

```text
Les fichiers suivants sont créés :
  src/types/index.ts
  public/api/categories.json
  public/api/taches.json

La vérification TypeScript (npx tsc --noEmit) passe sans erreur.
```

---

### Étape 3 : Créer les hooks réutilisables

Reprends les hooks créés dans les fiches précédentes :

```tsx
// src/hooks/useFetch.ts
import { useState, useEffect } from "react";

interface RetourFetch<T> {
  donnees: T | null;
  chargement: boolean;
  erreur: string | null;
  recharger: () => void;
}

function useFetch<T>(url: string): RetourFetch<T> {
  const [donnees, setDonnees] = useState<T | null>(null);
  const [chargement, setChargement] = useState(true);
  const [erreur, setErreur] = useState<string | null>(null);
  const [compteurRechargement, setCompteurRechargement] = useState(0);

  useEffect(() => {
    const controleur = new AbortController();

    const charger = async () => {
      setChargement(true);
      setErreur(null);

      try {
        const reponse = await fetch(url, { signal: controleur.signal });

        if (!reponse.ok) {
          throw new Error(`Erreur HTTP : ${reponse.status}`);
        }

        const resultat: T = await reponse.json();
        setDonnees(resultat);
      } catch (err) {
        if (err instanceof DOMException && err.name === "AbortError") return;
        if (err instanceof Error) {
          setErreur(err.message);
        }
      } finally {
        setChargement(false);
      }
    };

    charger();
    return () => controleur.abort();
  }, [url, compteurRechargement]);

  // Fonction pour relancer le chargement
  const recharger = () => setCompteurRechargement((c) => c + 1);

  return { donnees, chargement, erreur, recharger };
}

export default useFetch;
```

```tsx
// src/hooks/useDebounce.ts
import { useState, useEffect } from "react";

function useDebounce<T>(valeur: T, delai: number = 500): T {
  const [valeurRetardee, setValeurRetardee] = useState(valeur);

  useEffect(() => {
    const timer = setTimeout(() => setValeurRetardee(valeur), delai);
    return () => clearTimeout(timer);
  }, [valeur, delai]);

  return valeurRetardee;
}

export default useDebounce;
```

```tsx
// src/hooks/useLocalStorage.ts
import { useState } from "react";

function useLocalStorage<T>(cle: string, valeurInitiale: T): [T, (valeur: T) => void] {
  const [valeur, setValeur] = useState<T>(() => {
    const sauvegarde = localStorage.getItem(cle);
    if (sauvegarde !== null) {
      return JSON.parse(sauvegarde) as T;
    }
    return valeurInitiale;
  });

  const definir = (nouvelleValeur: T) => {
    setValeur(nouvelleValeur);
    localStorage.setItem(cle, JSON.stringify(nouvelleValeur));
  };

  return [valeur, definir];
}

export default useLocalStorage;
```

**Résultat attendu** :

```text
Les fichiers suivants sont créés :
  src/hooks/useFetch.ts
  src/hooks/useDebounce.ts
  src/hooks/useLocalStorage.ts

La vérification TypeScript (npx tsc --noEmit) passe sans erreur.
```

---

### Étape 4 : Créer le contexte d'authentification

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";
import type { Utilisateur } from "../types";

interface EtatAuth {
  utilisateur: Utilisateur | null;
  token: string | null;
  estConnecte: boolean;
}

type ActionAuth =
  | { type: "connexion"; utilisateur: Utilisateur; token: string }
  | { type: "deconnexion" };

function authReducer(etat: EtatAuth, action: ActionAuth): EtatAuth {
  switch (action.type) {
    case "connexion":
      localStorage.setItem("taskflow-token", action.token);
      return { utilisateur: action.utilisateur, token: action.token, estConnecte: true };
    case "deconnexion":
      localStorage.removeItem("taskflow-token");
      return { utilisateur: null, token: null, estConnecte: false };
  }
}

function creerEtatInitial(): EtatAuth {
  const token = localStorage.getItem("taskflow-token");
  return { utilisateur: null, token, estConnecte: token !== null };
}

interface AuthContextType extends EtatAuth {
  connexion: (email: string, motDePasse: string) => Promise<void>;
  deconnexion: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé dans un AuthProvider");
  return ctx;
}

function AuthProvider({ children }: { children: ReactNode }) {
  const [etat, dispatch] = useReducer(authReducer, undefined, creerEtatInitial);

  const connexion = async (email: string, motDePasse: string) => {
    // Simule un appel API de connexion
    // En production, remplace par un vrai fetch vers Symfony
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Vérifie les identifiants (simulé)
    if (email === "admin@taskflow.fr" && motDePasse === "password123") {
      dispatch({
        type: "connexion",
        utilisateur: { id: 1, email, nom: "Admin" },
        token: "token-simule-12345",
      });
    } else {
      throw new Error("Email ou mot de passe incorrect");
    }
  };

  const deconnexion = () => dispatch({ type: "deconnexion" });

  return (
    <AuthContext.Provider value={{ ...etat, connexion, deconnexion }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthProvider, useAuth };
```

**Résultat attendu** :

```text
Le fichier src/contexts/AuthContext.tsx est créé. La connexion avec
admin@taskflow.fr / password123 fonctionne (simulée). La vérification
TypeScript (npx tsc --noEmit) passe sans erreur.
```

---

### Étape 5 : Créer les composants

`src/components/BarreNavigation.tsx` :

```tsx
// src/components/BarreNavigation.tsx
import { Link } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function BarreNavigation() {
  const { estConnecte, utilisateur, deconnexion } = useAuth();

  return (
    <nav style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "12px 20px",
      backgroundColor: "#2c3e50",
      color: "white",
    }}>
      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
        <Link to="/" style={{ color: "white", textDecoration: "none", fontWeight: "bold", fontSize: "18px" }}>
          TaskFlow
        </Link>
        {estConnecte && (
          <>
            <Link to="/" style={{ color: "#bdc3c7", textDecoration: "none" }}>Tableau de bord</Link>
            <Link to="/nouvelle-tache" style={{ color: "#bdc3c7", textDecoration: "none" }}>Nouvelle tâche</Link>
          </>
        )}
      </div>

      <div>
        {estConnecte ? (
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <span>{utilisateur?.nom}</span>
            <button onClick={deconnexion} style={{ padding: "6px 12px", cursor: "pointer" }}>
              Déconnexion
            </button>
          </div>
        ) : (
          <Link to="/connexion" style={{ color: "white", textDecoration: "none" }}>Connexion</Link>
        )}
      </div>
    </nav>
  );
}

export default BarreNavigation;
```

`src/components/RouteProtegee.tsx` :

```tsx
// src/components/RouteProtegee.tsx
import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { ReactNode } from "react";

// Composant qui redirige vers la page de connexion si l'utilisateur n'est pas connecté
function RouteProtegee({ children }: { children: ReactNode }) {
  const { estConnecte } = useAuth();

  if (!estConnecte) {
    return <Navigate to="/connexion" replace />;
  }

  return <>{children}</>;
}

export default RouteProtegee;
```

`src/components/CarteTache.tsx` :

```tsx
// src/components/CarteTache.tsx
import { Link } from "react-router";
import type { Tache, Categorie } from "../types";

interface PropsCarteTache {
  tache: Tache;
  categorie?: Categorie;
  onSupprimer: (id: number) => void;
}

// Couleurs selon la priorité
const couleursPriorite: Record<string, string> = {
  basse: "#27ae60",
  moyenne: "#f39c12",
  haute: "#e74c3c",
};

// Labels selon le statut
const labelsStatut: Record<string, string> = {
  a_faire: "À faire",
  en_cours: "En cours",
  terminee: "Terminée",
};

function CarteTache({ tache, categorie, onSupprimer }: PropsCarteTache) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderLeft: `4px solid ${couleursPriorite[tache.priorite]}`,
      borderRadius: "4px",
      padding: "16px",
      marginBottom: "12px",
      backgroundColor: tache.statut === "terminee" ? "#f9f9f9" : "white",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link
          to={`/tache/${tache.id}`}
          style={{
            fontSize: "16px",
            fontWeight: "bold",
            color: "#333",
            textDecoration: tache.statut === "terminee" ? "line-through" : "none",
          }}
        >
          {tache.titre}
        </Link>
        <button
          onClick={() => onSupprimer(tache.id)}
          style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
        >
          Supprimer
        </button>
      </div>

      <p style={{ color: "#666", fontSize: "14px", margin: "8px 0" }}>
        {tache.description.length > 100
          ? tache.description.slice(0, 100) + "..."
          : tache.description}
      </p>

      <div style={{ display: "flex", gap: "12px", fontSize: "12px" }}>
        <span style={{
          padding: "2px 8px",
          borderRadius: "12px",
          backgroundColor: couleursPriorite[tache.priorite],
          color: "white",
        }}>
          {tache.priorite}
        </span>

        <span style={{ padding: "2px 8px", borderRadius: "12px", backgroundColor: "#ecf0f1" }}>
          {labelsStatut[tache.statut]}
        </span>

        {categorie && (
          <span style={{
            padding: "2px 8px",
            borderRadius: "12px",
            backgroundColor: categorie.couleur,
            color: "white",
          }}>
            {categorie.nom}
          </span>
        )}

        <span style={{ color: "#999" }}>
          Échéance : {tache.dateEcheance}
        </span>
      </div>
    </div>
  );
}

export default CarteTache;
```

`src/components/FiltresTaches.tsx` :

```tsx
// src/components/FiltresTaches.tsx
import type { Categorie } from "../types";

interface PropsFiltres {
  recherche: string;
  onRechercheChange: (valeur: string) => void;
  statut: string;
  onStatutChange: (valeur: string) => void;
  categorieId: string;
  onCategorieChange: (valeur: string) => void;
  categories: Categorie[];
}

function FiltresTaches({
  recherche, onRechercheChange,
  statut, onStatutChange,
  categorieId, onCategorieChange,
  categories,
}: PropsFiltres) {
  return (
    <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
      <input
        type="text"
        value={recherche}
        onChange={(e) => onRechercheChange(e.target.value)}
        placeholder="Rechercher une tâche..."
        style={{ padding: "8px", flex: 1, minWidth: "200px" }}
      />

      <select value={statut} onChange={(e) => onStatutChange(e.target.value)} style={{ padding: "8px" }}>
        <option value="tous">Tous les statuts</option>
        <option value="a_faire">À faire</option>
        <option value="en_cours">En cours</option>
        <option value="terminee">Terminée</option>
      </select>

      <select value={categorieId} onChange={(e) => onCategorieChange(e.target.value)} style={{ padding: "8px" }}>
        <option value="toutes">Toutes les catégories</option>
        {categories.map((cat) => (
          <option key={cat.id} value={String(cat.id)}>{cat.nom}</option>
        ))}
      </select>
    </div>
  );
}

export default FiltresTaches;
```

**Résultat attendu** :

```text
Les fichiers suivants sont créés :
  src/components/BarreNavigation.tsx
  src/components/RouteProtegee.tsx
  src/components/CarteTache.tsx
  src/components/FiltresTaches.tsx

La vérification TypeScript (npx tsc --noEmit) passe sans erreur.
```

---

### Étape 6 : Créer les pages

`src/pages/PageConnexion.tsx` :

```tsx
// src/pages/PageConnexion.tsx
import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function PageConnexion() {
  const { connexion } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [erreur, setErreur] = useState<string | null>(null);
  const [chargement, setChargement] = useState(false);

  const gererSoumission = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErreur(null);
    setChargement(true);

    try {
      await connexion(email, motDePasse);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) setErreur(err.message);
    } finally {
      setChargement(false);
    }
  };

  return (
    <div style={{ maxWidth: "400px", margin: "60px auto", padding: "20px" }}>
      <h1>Connexion</h1>
      <p style={{ color: "#666", marginBottom: "20px" }}>
        Identifiants de test : admin@taskflow.fr / password123
      </p>

      {erreur && (
        <div style={{ padding: "10px", backgroundColor: "#f8d7da", borderRadius: "4px", marginBottom: "12px" }}>
          {erreur}
        </div>
      )}

      <form onSubmit={gererSoumission}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="login-email">Email :</label>
          <br />
          <input
            id="login-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={chargement}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="login-mdp">Mot de passe :</label>
          <br />
          <input
            id="login-mdp"
            type="password"
            value={motDePasse}
            onChange={(e) => setMotDePasse(e.target.value)}
            required
            disabled={chargement}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>

        <button type="submit" disabled={chargement} style={{ width: "100%", padding: "10px", fontSize: "16px" }}>
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default PageConnexion;
```

`src/pages/PageTableauDeBord.tsx` :

```tsx
// src/pages/PageTableauDeBord.tsx
import { useState } from "react";
import useFetch from "../hooks/useFetch";
import useDebounce from "../hooks/useDebounce";
import CarteTache from "../components/CarteTache";
import FiltresTaches from "../components/FiltresTaches";
import type { Tache, Categorie } from "../types";

function PageTableauDeBord() {
  const { donnees: taches, chargement: chargementTaches, erreur: erreurTaches } =
    useFetch<Tache[]>("/api/taches.json");
  const { donnees: categories, chargement: chargementCategories } =
    useFetch<Categorie[]>("/api/categories.json");

  const [recherche, setRecherche] = useState("");
  const [statut, setStatut] = useState("tous");
  const [categorieId, setCategorieId] = useState("toutes");
  const [tachesSupprimees, setTachesSupprimees] = useState<number[]>([]);

  const rechercheRetardee = useDebounce(recherche, 300);

  if (chargementTaches || chargementCategories) {
    return <p style={{ padding: "20px" }}>Chargement...</p>;
  }

  if (erreurTaches) {
    return <p style={{ padding: "20px", color: "red" }}>Erreur : {erreurTaches}</p>;
  }

  if (!taches || !categories) {
    return <p style={{ padding: "20px" }}>Aucune donnée.</p>;
  }

  // Filtre les tâches selon les critères
  const tachesFiltrees = taches
    .filter((t) => !tachesSupprimees.includes(t.id))
    .filter((t) => {
      const correspondRecherche = t.titre.toLowerCase().includes(rechercheRetardee.toLowerCase());
      const correspondStatut = statut === "tous" || t.statut === statut;
      const correspondCategorie = categorieId === "toutes" || t.categorieId === Number(categorieId);
      return correspondRecherche && correspondStatut && correspondCategorie;
    });

  // Statistiques
  const totalActives = taches.filter((t) => !tachesSupprimees.includes(t.id)).length;
  const aFaire = taches.filter((t) => !tachesSupprimees.includes(t.id) && t.statut === "a_faire").length;
  const enCours = taches.filter((t) => !tachesSupprimees.includes(t.id) && t.statut === "en_cours").length;
  const terminees = taches.filter((t) => !tachesSupprimees.includes(t.id) && t.statut === "terminee").length;

  const supprimerTache = (id: number) => {
    setTachesSupprimees((prev) => [...prev, id]);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1>Tableau de bord</h1>

      {/* Statistiques */}
      <div style={{ display: "flex", gap: "16px", marginBottom: "20px" }}>
        <div style={{ flex: 1, padding: "12px", backgroundColor: "#ecf0f1", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{totalActives}</p>
          <p style={{ color: "#666", margin: 0 }}>Total</p>
        </div>
        <div style={{ flex: 1, padding: "12px", backgroundColor: "#fadbd8", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{aFaire}</p>
          <p style={{ color: "#666", margin: 0 }}>À faire</p>
        </div>
        <div style={{ flex: 1, padding: "12px", backgroundColor: "#fdebd0", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{enCours}</p>
          <p style={{ color: "#666", margin: 0 }}>En cours</p>
        </div>
        <div style={{ flex: 1, padding: "12px", backgroundColor: "#d5f5e3", borderRadius: "4px", textAlign: "center" }}>
          <p style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>{terminees}</p>
          <p style={{ color: "#666", margin: 0 }}>Terminées</p>
        </div>
      </div>

      {/* Filtres */}
      <FiltresTaches
        recherche={recherche}
        onRechercheChange={setRecherche}
        statut={statut}
        onStatutChange={setStatut}
        categorieId={categorieId}
        onCategorieChange={setCategorieId}
        categories={categories}
      />

      {/* Résultats */}
      <p style={{ color: "#666", marginBottom: "12px" }}>
        {tachesFiltrees.length} tâche(s) affichée(s)
      </p>

      {tachesFiltrees.length === 0 ? (
        <p style={{ textAlign: "center", color: "#999", padding: "40px" }}>
          Aucune tâche ne correspond à tes critères.
        </p>
      ) : (
        tachesFiltrees.map((tache) => (
          <CarteTache
            key={tache.id}
            tache={tache}
            categorie={categories.find((c) => c.id === tache.categorieId)}
            onSupprimer={supprimerTache}
          />
        ))
      )}
    </div>
  );
}

export default PageTableauDeBord;
```

`src/pages/PageDetailTache.tsx` :

```tsx
// src/pages/PageDetailTache.tsx
import { useParams, Link } from "react-router";
import useFetch from "../hooks/useFetch";
import type { Tache, Categorie } from "../types";

function PageDetailTache() {
  const { id } = useParams<{ id: string }>();
  const { donnees: taches, chargement } = useFetch<Tache[]>("/api/taches.json");
  const { donnees: categories } = useFetch<Categorie[]>("/api/categories.json");

  if (chargement) return <p style={{ padding: "20px" }}>Chargement...</p>;

  const tache = taches?.find((t) => t.id === Number(id));

  if (!tache) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Tâche non trouvée</h1>
        <Link to="/">Retour au tableau de bord</Link>
      </div>
    );
  }

  const categorie = categories?.find((c) => c.id === tache.categorieId);

  const labelsStatut: Record<string, string> = {
    a_faire: "À faire",
    en_cours: "En cours",
    terminee: "Terminée",
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <Link to="/" style={{ color: "#666", textDecoration: "none" }}>
        &larr; Retour au tableau de bord
      </Link>

      <h1 style={{ marginTop: "16px" }}>{tache.titre}</h1>

      <div style={{ display: "flex", gap: "12px", marginBottom: "20px" }}>
        <span style={{ padding: "4px 12px", borderRadius: "12px", backgroundColor: "#ecf0f1" }}>
          {labelsStatut[tache.statut]}
        </span>
        <span style={{ padding: "4px 12px", borderRadius: "12px", backgroundColor: "#ecf0f1" }}>
          Priorité : {tache.priorite}
        </span>
        {categorie && (
          <span style={{ padding: "4px 12px", borderRadius: "12px", backgroundColor: categorie.couleur, color: "white" }}>
            {categorie.nom}
          </span>
        )}
      </div>

      <div style={{ backgroundColor: "#f9f9f9", padding: "16px", borderRadius: "4px", marginBottom: "20px" }}>
        <h3>Description</h3>
        <p>{tache.description}</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <div>
          <p style={{ color: "#666", margin: "0 0 4px" }}>Date de création</p>
          <p style={{ fontWeight: "bold", margin: 0 }}>{tache.dateCreation}</p>
        </div>
        <div>
          <p style={{ color: "#666", margin: "0 0 4px" }}>Date d'échéance</p>
          <p style={{ fontWeight: "bold", margin: 0 }}>{tache.dateEcheance}</p>
        </div>
      </div>
    </div>
  );
}

export default PageDetailTache;
```

`src/pages/PageNouvelleTache.tsx` :

```tsx
// src/pages/PageNouvelleTache.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router";
import useFetch from "../hooks/useFetch";
import type { Categorie } from "../types";

const schemaTache = z.object({
  titre: z.string().min(3, "Le titre doit contenir au moins 3 caractères").max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  categorieId: z.number({ invalid_type_error: "Sélectionne une catégorie" }).positive("Sélectionne une catégorie"),
  priorite: z.enum(["basse", "moyenne", "haute"]),
  dateEcheance: z.string().min(1, "La date d'échéance est obligatoire"),
});

type DonneesTache = z.infer<typeof schemaTache>;

function PageNouvelleTache() {
  const navigate = useNavigate();
  const { donnees: categories } = useFetch<Categorie[]>("/api/categories.json");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DonneesTache>({
    resolver: zodResolver(schemaTache),
    mode: "onBlur",
    defaultValues: { priorite: "moyenne" },
  });

  const soumettre = async (donnees: DonneesTache) => {
    // Simule l'envoi au serveur
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Nouvelle tâche :", donnees);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <h1>Nouvelle tâche</h1>

      <form onSubmit={handleSubmit(soumettre)}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="tache-titre">Titre :</label>
          <br />
          <input
            id="tache-titre"
            type="text"
            {...register("titre")}
            style={{ width: "100%", padding: "8px", borderColor: errors.titre ? "red" : "#ccc" }}
          />
          {errors.titre && <p style={{ color: "red", fontSize: "12px" }}>{errors.titre.message}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="tache-desc">Description :</label>
          <br />
          <textarea
            id="tache-desc"
            {...register("description")}
            rows={4}
            style={{ width: "100%", padding: "8px", borderColor: errors.description ? "red" : "#ccc" }}
          />
          {errors.description && <p style={{ color: "red", fontSize: "12px" }}>{errors.description.message}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="tache-cat">Catégorie :</label>
          <br />
          <select
            id="tache-cat"
            {...register("categorieId", { valueAsNumber: true })}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value={0}>-- Choisir --</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nom}</option>
            ))}
          </select>
          {errors.categorieId && <p style={{ color: "red", fontSize: "12px" }}>{errors.categorieId.message}</p>}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="tache-priorite">Priorité :</label>
          <br />
          <select id="tache-priorite" {...register("priorite")} style={{ width: "100%", padding: "8px" }}>
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="tache-echeance">Date d'échéance :</label>
          <br />
          <input
            id="tache-echeance"
            type="date"
            {...register("dateEcheance")}
            style={{ width: "100%", padding: "8px", borderColor: errors.dateEcheance ? "red" : "#ccc" }}
          />
          {errors.dateEcheance && <p style={{ color: "red", fontSize: "12px" }}>{errors.dateEcheance.message}</p>}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ width: "100%", padding: "10px", fontSize: "16px" }}>
          {isSubmitting ? "Création..." : "Créer la tâche"}
        </button>
      </form>
    </div>
  );
}

export default PageNouvelleTache;
```

`src/pages/PageNonTrouvee.tsx` :

```tsx
// src/pages/PageNonTrouvee.tsx
import { Link } from "react-router";

function PageNonTrouvee() {
  return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <h1 style={{ fontSize: "48px", color: "#e74c3c" }}>404</h1>
      <p style={{ fontSize: "18px", color: "#666" }}>Cette page n'existe pas.</p>
      <Link to="/" style={{ color: "#3498db" }}>Retour au tableau de bord</Link>
    </div>
  );
}

export default PageNonTrouvee;
```

**Résultat attendu** :

```text
Les fichiers suivants sont créés :
  src/pages/PageConnexion.tsx
  src/pages/PageTableauDeBord.tsx
  src/pages/PageDetailTache.tsx
  src/pages/PageNouvelleTache.tsx
  src/pages/PageNonTrouvee.tsx

La vérification TypeScript (npx tsc --noEmit) passe sans erreur.
```

---

### Étape 7 : Assembler l'application

`src/App.tsx` :

```tsx
// src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router";
import { AuthProvider } from "./contexts/AuthContext";
import BarreNavigation from "./components/BarreNavigation";
import RouteProtegee from "./components/RouteProtegee";
import PageConnexion from "./pages/PageConnexion";
import PageTableauDeBord from "./pages/PageTableauDeBord";
import PageDetailTache from "./pages/PageDetailTache";
import PageNouvelleTache from "./pages/PageNouvelleTache";
import PageNonTrouvee from "./pages/PageNonTrouvee";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <BarreNavigation />
        <Routes>
          <Route path="/connexion" element={<PageConnexion />} />
          <Route
            path="/"
            element={
              <RouteProtegee>
                <PageTableauDeBord />
              </RouteProtegee>
            }
          />
          <Route
            path="/tache/:id"
            element={
              <RouteProtegee>
                <PageDetailTache />
              </RouteProtegee>
            }
          />
          <Route
            path="/nouvelle-tache"
            element={
              <RouteProtegee>
                <PageNouvelleTache />
              </RouteProtegee>
            }
          />
          <Route path="*" element={<PageNonTrouvee />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
```

`src/main.tsx` :

```tsx
// src/main.tsx
import { createRoot } from "react-dom/client";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(<App />);
```

**Résultat attendu** : L'application se lance avec `npm run dev`. En ouvrant `http://localhost:5173`, la page de connexion s'affiche car les routes sont protégées. Après connexion avec `admin@taskflow.fr` / `password123`, le tableau de bord affiche les tâches. La navigation entre les pages fonctionne (tableau de bord, détail, nouvelle tâche, page 404).

---

### Étape 8 : Écrire les tests

Crée `src/components/CarteTache.test.tsx` :

```tsx
// src/components/CarteTache.test.tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router";
import { describe, it, expect, vi } from "vitest";
import CarteTache from "./CarteTache";
import type { Tache, Categorie } from "../types";

const tacheTest: Tache = {
  id: 1,
  titre: "Tâche de test",
  description: "Description de la tâche de test",
  categorieId: 1,
  statut: "a_faire",
  priorite: "haute",
  dateCreation: "2025-01-15",
  dateEcheance: "2025-02-28",
};

const categorieTest: Categorie = {
  id: 1,
  nom: "Travail",
  couleur: "#3498db",
};

// Wrapper avec BrowserRouter car CarteTache utilise Link
function renderAvecRouter(composant: React.ReactElement) {
  return render(<BrowserRouter>{composant}</BrowserRouter>);
}

describe("CarteTache", () => {
  it("affiche le titre de la tâche", () => {
    renderAvecRouter(
      <CarteTache tache={tacheTest} categorie={categorieTest} onSupprimer={() => {}} />
    );
    expect(screen.getByText("Tâche de test")).toBeInTheDocument();
  });

  it("affiche la priorité et le statut", () => {
    renderAvecRouter(
      <CarteTache tache={tacheTest} categorie={categorieTest} onSupprimer={() => {}} />
    );
    expect(screen.getByText("haute")).toBeInTheDocument();
    expect(screen.getByText("À faire")).toBeInTheDocument();
  });

  it("affiche la catégorie", () => {
    renderAvecRouter(
      <CarteTache tache={tacheTest} categorie={categorieTest} onSupprimer={() => {}} />
    );
    expect(screen.getByText("Travail")).toBeInTheDocument();
  });

  it("appelle onSupprimer avec l'id de la tâche", async () => {
    const user = userEvent.setup();
    const mockSupprimer = vi.fn();

    renderAvecRouter(
      <CarteTache tache={tacheTest} categorie={categorieTest} onSupprimer={mockSupprimer} />
    );

    await user.click(screen.getByRole("button", { name: /supprimer/i }));

    expect(mockSupprimer).toHaveBeenCalledWith(1);
  });
});
```

**Résultat attendu** :

```text
 ✓ src/components/CarteTache.test.tsx (4 tests)
   ✓ CarteTache > affiche le titre de la tâche
   ✓ CarteTache > affiche la priorité et le statut
   ✓ CarteTache > affiche la catégorie
   ✓ CarteTache > appelle onSupprimer avec l'id de la tâche

 Tests  4 passed
```

---

### Étape 9 : Lancer l'application

```bash
# Lance le serveur de développement
npm run dev
```

**Résultat attendu** :

1. Ouvre `http://localhost:5173`
2. La page de connexion s'affiche
3. Connecte-toi avec `admin@taskflow.fr` / `password123`
4. Le tableau de bord affiche les tâches avec filtrage et recherche
5. Clique sur une tâche pour voir le détail
6. Clique sur "Nouvelle tâche" pour créer une tâche
7. Le bouton "Déconnexion" fonctionne

```bash
# Lance les tests
npm test
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npm test` | Lance les tests en mode watch |
| `npm run test:run` | Lance les tests une seule fois |
| `npx tsc --noEmit` | Vérifie les types |
| `npm run build` | Compile l'application pour la production |

---

## Pièges Fréquents

### Piège 1 : Oublier le BrowserRouter dans les tests

⚠️ **Problème** : Les composants qui utilisent `Link` ou `useNavigate` plantent dans les tests car il n'y a pas de router.

✅ **Solution** : Enveloppe le composant dans un `BrowserRouter` dans les tests.

---

### Piège 2 : Données statiques au lieu de données dynamiques

⚠️ **Problème** : L'application fonctionne avec les fichiers JSON locaux mais il faut adapter quand on connecte le vrai backend Symfony.

✅ **Solution** : Le service API (`src/services/api.ts` de la fiche 13) centralise l'URL de base. Pour passer en production, change uniquement `API_BASE_URL`.

---

### Piège 3 : Ne pas gérer le cas "pas de données"

⚠️ **Problème** : Le composant plante si `useFetch` retourne `null` avant que les données arrivent.

✅ **Solution** : Vérifie toujours `chargement`, `erreur` et `donnees` avant d'utiliser les données.

---

## Checklist de Validation

- [ ] Le projet se lance avec `npm run dev`
- [ ] La page de connexion fonctionne
- [ ] Les routes protégées redirigent vers la connexion si non connecté
- [ ] Le tableau de bord affiche les tâches
- [ ] Le filtrage par statut et catégorie fonctionne
- [ ] La recherche avec debounce fonctionne
- [ ] Le détail d'une tâche s'affiche
- [ ] Le formulaire de création valide les données avec Zod
- [ ] La déconnexion fonctionne
- [ ] Les tests passent avec `npm test`
- [ ] Le build réussit avec `npm run build`

---

## Exercice Pratique

**Énoncé** : Ajouter une fonctionnalité de modification de tâche à l'application TaskFlow. L'utilisateur doit pouvoir cliquer sur un bouton "Modifier" depuis la page de détail d'une tâche, accéder à un formulaire pré-rempli avec les données existantes, modifier les champs souhaités, puis valider pour revenir au tableau de bord.

**Indications** :

- Crée une nouvelle page `PageModifierTache.tsx` dans `src/pages/`
- Réutilise le schéma Zod `schemaTache` déjà défini dans `PageNouvelleTache.tsx` (ou extrais-le dans `src/schemas/tache.ts`)
- Utilise `useParams` pour récupérer l'id de la tâche dans l'URL
- Utilise `useFetch` pour charger les données actuelles de la tâche
- Utilise la méthode `reset` de React Hook Form pour pré-remplir le formulaire une fois les données chargées
- Ajoute la route `/tache/:id/modifier` dans `App.tsx` (protégée par `RouteProtegee`)
- Ajoute un bouton "Modifier" sur la page `PageDetailTache.tsx` qui redirige vers cette route
- Écris un test unitaire qui vérifie que le formulaire affiche les données pré-remplies

**Résultat attendu** : Depuis la page de détail d'une tâche, un bouton "Modifier" redirige vers `/tache/1/modifier`. Le formulaire s'affiche avec les champs pré-remplis (titre, description, catégorie, priorité, date d'échéance). Après validation, l'utilisateur est redirigé vers le tableau de bord.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Extraire le schéma Zod dans un fichier partagé

Crée `src/schemas/tache.ts` pour réutiliser le schéma dans les pages de création et de modification :

```tsx
// src/schemas/tache.ts
import { z } from "zod";

// Schéma de validation partagé entre la création et la modification
export const schemaTache = z.object({
  titre: z
    .string()
    .min(3, "Le titre doit contenir au moins 3 caractères")
    .max(100, "Le titre ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .min(10, "La description doit contenir au moins 10 caractères"),
  categorieId: z
    .number({ invalid_type_error: "Sélectionne une catégorie" })
    .positive("Sélectionne une catégorie"),
  priorite: z.enum(["basse", "moyenne", "haute"]),
  dateEcheance: z.string().min(1, "La date d'échéance est obligatoire"),
});

// Type inféré depuis le schéma
export type DonneesTache = z.infer<typeof schemaTache>;
```

### 2. Créer la page PageModifierTache

Crée `src/pages/PageModifierTache.tsx` :

```tsx
// src/pages/PageModifierTache.tsx
import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useFetch from "../hooks/useFetch";
import { schemaTache, type DonneesTache } from "../schemas/tache";
import type { Tache, Categorie } from "../types";

function PageModifierTache() {
  // Récupère l'id de la tâche depuis l'URL
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  // Charge les tâches et les catégories
  const { donnees: taches, chargement: chargementTaches } =
    useFetch<Tache[]>("/api/taches.json");
  const { donnees: categories, chargement: chargementCategories } =
    useFetch<Categorie[]>("/api/categories.json");

  // Trouve la tâche correspondant à l'id
  const tache = taches?.find((t) => t.id === Number(id));

  // Initialise le formulaire avec la validation Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DonneesTache>({
    resolver: zodResolver(schemaTache),
    mode: "onBlur",
  });

  // Pré-remplit le formulaire quand les données sont chargées
  useEffect(() => {
    if (tache) {
      reset({
        titre: tache.titre,
        description: tache.description,
        categorieId: tache.categorieId,
        priorite: tache.priorite,
        dateEcheance: tache.dateEcheance,
      });
    }
  }, [tache, reset]);

  // Affiche un indicateur de chargement
  if (chargementTaches || chargementCategories) {
    return <p style={{ padding: "20px" }}>Chargement...</p>;
  }

  // Affiche un message si la tâche n'existe pas
  if (!tache) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        <h1>Tâche non trouvée</h1>
        <Link to="/">Retour au tableau de bord</Link>
      </div>
    );
  }

  // Gère la soumission du formulaire
  const soumettre = async (donnees: DonneesTache) => {
    // Simule l'envoi au serveur
    // En production, remplace par un PUT/PATCH vers l'API Symfony
    await new Promise((resolve) => setTimeout(resolve, 500));
    console.log("Tâche modifiée :", { id: tache.id, ...donnees });

    // Redirige vers le tableau de bord après modification
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "500px", margin: "0 auto", padding: "20px" }}>
      <Link
        to={`/tache/${tache.id}`}
        style={{ color: "#666", textDecoration: "none" }}
      >
        &larr; Retour au détail
      </Link>

      <h1 style={{ marginTop: "16px" }}>Modifier la tâche</h1>

      <form onSubmit={handleSubmit(soumettre)}>
        {/* Champ titre */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="modifier-titre">Titre :</label>
          <br />
          <input
            id="modifier-titre"
            type="text"
            {...register("titre")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.titre ? "red" : "#ccc",
            }}
          />
          {errors.titre && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.titre.message}
            </p>
          )}
        </div>

        {/* Champ description */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="modifier-desc">Description :</label>
          <br />
          <textarea
            id="modifier-desc"
            {...register("description")}
            rows={4}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.description ? "red" : "#ccc",
            }}
          />
          {errors.description && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.description.message}
            </p>
          )}
        </div>

        {/* Champ catégorie */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="modifier-cat">Catégorie :</label>
          <br />
          <select
            id="modifier-cat"
            {...register("categorieId", { valueAsNumber: true })}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value={0}>-- Choisir --</option>
            {categories?.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.nom}
              </option>
            ))}
          </select>
          {errors.categorieId && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.categorieId.message}
            </p>
          )}
        </div>

        {/* Champ priorité */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="modifier-priorite">Priorité :</label>
          <br />
          <select
            id="modifier-priorite"
            {...register("priorite")}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="basse">Basse</option>
            <option value="moyenne">Moyenne</option>
            <option value="haute">Haute</option>
          </select>
        </div>

        {/* Champ date d'échéance */}
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="modifier-echeance">Date d'échéance :</label>
          <br />
          <input
            id="modifier-echeance"
            type="date"
            {...register("dateEcheance")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.dateEcheance ? "red" : "#ccc",
            }}
          />
          {errors.dateEcheance && (
            <p style={{ color: "red", fontSize: "12px" }}>
              {errors.dateEcheance.message}
            </p>
          )}
        </div>

        {/* Bouton de soumission */}
        <button
          type="submit"
          disabled={isSubmitting}
          style={{ width: "100%", padding: "10px", fontSize: "16px" }}
        >
          {isSubmitting ? "Modification..." : "Enregistrer les modifications"}
        </button>
      </form>
    </div>
  );
}

export default PageModifierTache;
```

### 3. Ajouter le bouton "Modifier" sur la page de détail

Dans `src/pages/PageDetailTache.tsx`, ajoute un bouton "Modifier" sous les informations de la tâche. Ajoute cet import en haut du fichier :

```tsx
import { useParams, Link } from "react-router";
```

Puis ajoute ce bouton immédiatement après le bloc de grille (dates de création et d'échéance), avant la balise fermante `</div>` du conteneur principal :

```tsx
      {/* Bouton modifier */}
      <div style={{ marginTop: "20px" }}>
        <Link
          to={`/tache/${tache.id}/modifier`}
          style={{
            display: "inline-block",
            padding: "10px 20px",
            backgroundColor: "#3498db",
            color: "white",
            textDecoration: "none",
            borderRadius: "4px",
            fontSize: "16px",
          }}
        >
          Modifier cette tâche
        </Link>
      </div>
```

### 4. Ajouter la route dans App.tsx

Dans `src/App.tsx`, ajoute l'import de la nouvelle page :

```tsx
import PageModifierTache from "./pages/PageModifierTache";
```

Puis ajoute la route dans le composant `Routes`, immédiatement après la route `/tache/:id` :

```tsx
          <Route
            path="/tache/:id/modifier"
            element={
              <RouteProtegee>
                <PageModifierTache />
              </RouteProtegee>
            }
          />
```

### 5. Écrire le test unitaire

Crée `src/pages/PageModifierTache.test.tsx` :

```tsx
// src/pages/PageModifierTache.test.tsx
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { describe, it, expect, vi, beforeEach } from "vitest";
import PageModifierTache from "./PageModifierTache";
import { AuthProvider } from "../contexts/AuthContext";

// Données simulées pour les tests
const tachesSimulees = [
  {
    id: 1,
    titre: "Tâche existante",
    description: "Description de la tâche existante pour le test",
    categorieId: 1,
    statut: "a_faire",
    priorite: "haute",
    dateCreation: "2025-01-15",
    dateEcheance: "2025-02-28",
  },
];

const categoriesSimulees = [
  { id: 1, nom: "Travail", couleur: "#3498db" },
  { id: 2, nom: "Personnel", couleur: "#2ecc71" },
];

// Simule la fonction fetch pour retourner les données de test
beforeEach(() => {
  vi.spyOn(global, "fetch").mockImplementation((url) => {
    if (typeof url === "string" && url.includes("taches")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(tachesSimulees),
      } as Response);
    }
    if (typeof url === "string" && url.includes("categories")) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(categoriesSimulees),
      } as Response);
    }
    return Promise.reject(new Error("URL inconnue"));
  });
});

// Fonction utilitaire pour rendre la page avec le router et le contexte auth
function renderPage() {
  // Simule un token dans le localStorage pour que l'utilisateur soit "connecté"
  localStorage.setItem("taskflow-token", "token-test");

  return render(
    <AuthProvider>
      <MemoryRouter initialEntries={["/tache/1/modifier"]}>
        <Routes>
          <Route path="/tache/:id/modifier" element={<PageModifierTache />} />
        </Routes>
      </MemoryRouter>
    </AuthProvider>
  );
}

describe("PageModifierTache", () => {
  it("affiche le formulaire pré-rempli avec les données de la tâche", async () => {
    renderPage();

    // Attend que le formulaire soit chargé avec les données
    await waitFor(() => {
      // Vérifie que le champ titre contient la valeur existante
      const champTitre = screen.getByLabelText("Titre :") as HTMLInputElement;
      expect(champTitre.value).toBe("Tâche existante");
    });

    // Vérifie que le champ description contient la valeur existante
    const champDescription = screen.getByLabelText(
      "Description :"
    ) as HTMLTextAreaElement;
    expect(champDescription.value).toBe(
      "Description de la tâche existante pour le test"
    );

    // Vérifie que la priorité est pré-sélectionnée
    const champPriorite = screen.getByLabelText(
      "Priorité :"
    ) as HTMLSelectElement;
    expect(champPriorite.value).toBe("haute");

    // Vérifie que la date d'échéance est pré-remplie
    const champDate = screen.getByLabelText(
      "Date d'échéance :"
    ) as HTMLInputElement;
    expect(champDate.value).toBe("2025-02-28");
  });

  it("affiche le titre de la page", async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Modifier la tâche")).toBeInTheDocument();
    });
  });
});
```

### Vérification

Lance les tests pour vérifier que tout fonctionne :

```bash
# Lance les tests
npm test
```

**Résultat attendu** :

```text
 ✓ src/components/CarteTache.test.tsx (4 tests)
 ✓ src/pages/PageModifierTache.test.tsx (2 tests)

 Test Files  2 passed (2)
      Tests  6 passed (6)
```

Vérifie aussi l'application dans le navigateur :

1. Connecte-toi sur `http://localhost:5173`
2. Clique sur une tâche pour voir son détail
3. Clique sur "Modifier cette tâche"
4. Le formulaire s'affiche avec les champs pré-remplis
5. Modifie un champ et clique sur "Enregistrer les modifications"
6. Tu es redirigé vers le tableau de bord

---

## Navigation

← Fiche précédente : **[15 - Tests React](15-tests-react.md)**

→ Fiche suivante : **[17 - React 19 : ce qui a changé](17-react-19-nouveautes.md)**
