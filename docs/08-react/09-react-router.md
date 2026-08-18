---
tags:
  - React
  - Intermédiaire
  - Pratique
description: "Naviguer entre les pages avec React Router, paramètres d'URL et routes imbriquées."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 19
cursus: "React"
---

# 09 - React Router

> **En bref** : Installer et configurer React Router pour créer une navigation multi-pages dans une application React, avec paramètres d'URL, routes imbriquées et page 404. Lecture estimée : 75 min.

## Prérequis

- Fiche précédente : [08 - Listes et clés](08-listes-cles.md)
- Savoir créer des composants React
- Connaître les props et useState

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une application multi-pages avec React Router, utiliser les paramètres d'URL, créer des routes imbriquées et gérer les pages 404.

---

## Concepts

### Qu'est-ce que React Router ?

**Définition** : React Router est une bibliothèque de routing pour React qui permet de naviguer entre différentes "pages" dans une Single Page Application (SPA) sans recharger la page du navigateur.

**Le problème que React Router résout** :

Sans routing :

1. **Une seule vue** : l'application React affiche un seul composant. Pour montrer une autre page, il faut coder manuellement un système de conditionnels (`if page === "accueil"`, `if page === "contact"`, etc.).
2. **Pas de navigation par URL** : l'utilisateur ne peut pas partager un lien vers une page spécifique. L'URL reste toujours `http://localhost:5173/`.
3. **Pas de bouton retour** : le bouton retour du navigateur ne fonctionne pas car il n'y a qu'une seule URL.

**Comment React Router résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Une seule vue | Chaque route affiche un composant différent |
| Pas de navigation par URL | Chaque page a sa propre URL (`/accueil`, `/contact`) |
| Pas de bouton retour | React Router gère l'historique du navigateur |

**Analogie concrète** : React Router est comme un standard téléphonique dans une entreprise. Quand un appel arrive (l'utilisateur tape une URL), le standard (le routeur) redirige vers le bon poste (le bon composant). Si le numéro n'existe pas, le standard renvoie vers un message d'erreur (page 404).

**Ce que React Router n'est PAS** :

- React Router n'est pas un système de routing backend. Il ne gère que la navigation côté client (dans le navigateur). Le serveur ne reçoit qu'une seule requête pour `index.html`.
- React Router n'est pas inclus dans React. C'est une bibliothèque séparée qu'il faut installer.

---

### Qu'est-ce qu'une SPA (Single Page Application) ?

**Définition** : Une SPA est une application web qui charge une seule page HTML et met à jour dynamiquement le contenu sans recharger la page entière. React Router change uniquement le composant affiché, pas la page HTML.

**Comparaison SPA vs site classique** :

| Site classique (MPA) | Single Page Application (SPA) |
| --- | --- |
| Chaque page = une requête au serveur | Une seule requête initiale |
| Le navigateur recharge toute la page | Seul le contenu change |
| Temps de chargement à chaque navigation | Navigation instantanée |
| Le serveur génère le HTML | Le JavaScript génère le HTML |

---

### Qu'est-ce qu'un paramètre d'URL ?

**Définition** : Un paramètre d'URL est une partie variable de l'URL qui permet de passer une information à la page. Par exemple, dans `/utilisateur/42`, `42` est un paramètre qui identifie l'utilisateur.

**Le problème que les paramètres d'URL résolvent** :

Sans paramètres d'URL :

1. **Une route par élément** : il faudrait créer une route pour chaque utilisateur (`/utilisateur-1`, `/utilisateur-2`, etc.).
2. **Pas de lien partageable** : impossible de créer un lien direct vers un élément spécifique.

**Comment les paramètres d'URL résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Une route par élément | Une seule route dynamique (`/utilisateur/:id`) |
| Pas de lien partageable | L'URL contient l'identifiant de l'élément |

---

Le diagramme suivant montre comment React Router analyse l'URL et affiche le composant correspondant.

<div class="diagram-design">
<p><a href="../../diagrams/08-react-09-react-router-1.html">Qu&#x27;est-ce qu&#x27;un paramètre d&#x27;URL ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-09-react-router-1.html" title="Qu&#x27;est-ce qu&#x27;un paramètre d&#x27;URL ?" style="width:100%;min-height:448px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Installer React Router

```bash
# Dans le dossier de ton projet React
# Depuis React Router v8 (juin 2026), le paquet s'appelle react-router
# (le paquet react-router-dom a été retiré)
npm install react-router
```

**Résultat attendu** :

```text
added X packages in Xs
```

React Router est maintenant installé. Les types TypeScript sont inclus dans le package.

> **Note sur la version** : `npm install react-router` installe la version 8.x.
> Cette fiche utilise le mode "declarative" (`BrowserRouter`, `Routes`, `Route`, `useParams`, `useNavigate`).
> Les imports se font depuis `react-router` (pas `react-router-dom`, retiré en v8).
> La doc officielle présente aussi le mode "framework" (plugin Vite) et le mode "data" (`createBrowserRouter`).
> Pour ce cursus, reste sur l'API de cette fiche. Prérequis v8 : Node.js 22.22+, React 19.2.7+.

---

### Étape 2 : Configurer le routeur

Modifie `src/main.tsx` pour ajouter le routeur :

```tsx
// src/main.tsx
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import App from "./App.tsx";

// BrowserRouter enveloppe toute l'application pour activer le routing
// Il doit être placé le plus haut possible dans l'arbre de composants
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);
```

---

### Étape 3 : Créer les pages

Crée le dossier `src/pages/` et les composants de chaque page :

```bash
mkdir -p src/pages
```

`src/pages/Accueil.tsx` :

```tsx
// src/pages/Accueil.tsx

// Composant de la page d'accueil
function Accueil() {
  return (
    <div>
      <h1>Accueil</h1>
      <p>Bienvenue sur mon application React avec routing.</p>
    </div>
  );
}

export default Accueil;
```

`src/pages/APropos.tsx` :

```tsx
// src/pages/APropos.tsx

function APropos() {
  return (
    <div>
      <h1>À propos</h1>
      <p>Cette application est construite avec React et TypeScript.</p>
      <p>Elle utilise React Router pour la navigation.</p>
    </div>
  );
}

export default APropos;
```

`src/pages/Contact.tsx` :

```tsx
// src/pages/Contact.tsx
import { useState } from "react";

function Contact() {
  const [nom, setNom] = useState("");
  const [message, setMessage] = useState("");
  const [envoye, setEnvoye] = useState(false);

  const gererSoumission = (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoye(true);
  };

  return (
    <div>
      <h1>Contact</h1>

      {envoye ? (
        <p style={{ color: "green" }}>
          Merci {nom}, ton message a été envoyé !
        </p>
      ) : (
        <form onSubmit={gererSoumission}>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="contact-nom">Nom :</label>
            <br />
            <input
              id="contact-nom"
              type="text"
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              style={{ padding: "8px", width: "300px" }}
            />
          </div>

          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="contact-msg">Message :</label>
            <br />
            <textarea
              id="contact-msg"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ padding: "8px", width: "300px", minHeight: "100px" }}
            />
          </div>

          <button type="submit" style={{ padding: "8px 16px" }}>
            Envoyer
          </button>
        </form>
      )}
    </div>
  );
}

export default Contact;
```

`src/pages/NotFound.tsx` :

```tsx
// src/pages/NotFound.tsx
import { Link } from "react-router";

// Page affichée quand l'URL ne correspond à aucune route
function NotFound() {
  return (
    <div>
      <h1>404 - Page non trouvée</h1>
      <p>La page que tu cherches n'existe pas.</p>
      {/* Link crée un lien de navigation sans recharger la page */}
      <Link to="/">Retour à l'accueil</Link>
    </div>
  );
}

export default NotFound;
```

---

### Étape 4 : Définir les routes

Modifie `src/App.tsx` pour définir les routes :

```tsx
// src/App.tsx
import { Routes, Route, Link } from "react-router";
import Accueil from "./pages/Accueil";
import APropos from "./pages/APropos";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div>
      {/* Navigation : visible sur toutes les pages */}
      <nav style={{ padding: "16px", backgroundColor: "#f0f0f0" }}>
        {/* Link remplace <a href="..."> pour la navigation sans rechargement */}
        <Link to="/" style={{ marginRight: "16px" }}>Accueil</Link>
        <Link to="/a-propos" style={{ marginRight: "16px" }}>À propos</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      {/* Zone de contenu : le composant affiché dépend de l'URL */}
      <main style={{ padding: "20px" }}>
        <Routes>
          {/* Chaque Route associe un chemin (path) à un composant (element) */}
          <Route path="/" element={<Accueil />} />
          <Route path="/a-propos" element={<APropos />} />
          <Route path="/contact" element={<Contact />} />

          {/* Route catch-all : affichée si aucune autre route ne correspond */}
          {/* Le "*" signifie "n'importe quel chemin" */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
```

**Résultat attendu** : une barre de navigation en haut, le contenu change selon le lien cliqué.

---

### Étape 5 : Ajouter des routes avec paramètres

Crée `src/pages/Utilisateur.tsx` :

```tsx
// src/pages/Utilisateur.tsx
import { useParams, Link } from "react-router";

// Données fictives
const utilisateurs: Record<string, { nom: string; email: string; role: string }> = {
  "1": { nom: "Alice Martin", email: "alice@mail.fr", role: "Développeur" },
  "2": { nom: "Bob Dupont", email: "bob@mail.fr", role: "Designer" },
  "3": { nom: "Claire Bernard", email: "claire@mail.fr", role: "Chef de projet" },
};

function Utilisateur() {
  // useParams() récupère les paramètres de l'URL
  // Pour la route "/utilisateur/:id", params.id contient la valeur
  const { id } = useParams<{ id: string }>();

  // Vérifie si l'utilisateur existe
  const utilisateur = id ? utilisateurs[id] : null;

  if (!utilisateur) {
    return (
      <div>
        <h1>Utilisateur non trouvé</h1>
        <p>Aucun utilisateur avec l'identifiant {id}.</p>
        <Link to="/utilisateurs">Retour à la liste</Link>
      </div>
    );
  }

  return (
    <div>
      <h1>{utilisateur.nom}</h1>
      <p>Email : {utilisateur.email}</p>
      <p>Rôle : {utilisateur.role}</p>
      <Link to="/utilisateurs">Retour à la liste</Link>
    </div>
  );
}

export default Utilisateur;
```

Crée `src/pages/ListeUtilisateurs.tsx` :

```tsx
// src/pages/ListeUtilisateurs.tsx
import { Link } from "react-router";

function ListeUtilisateurs() {
  const utilisateurs = [
    { id: 1, nom: "Alice Martin" },
    { id: 2, nom: "Bob Dupont" },
    { id: 3, nom: "Claire Bernard" },
  ];

  return (
    <div>
      <h1>Utilisateurs</h1>
      <ul>
        {utilisateurs.map((user) => (
          <li key={user.id}>
            {/* Link vers la page de détail avec l'id comme paramètre */}
            <Link to={`/utilisateur/${user.id}`}>{user.nom}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ListeUtilisateurs;
```

Ajoute les routes dans `App.tsx` :

```tsx
// Ajoute ces imports
import ListeUtilisateurs from "./pages/ListeUtilisateurs";
import Utilisateur from "./pages/Utilisateur";

// Ajoute dans le <nav>
<Link to="/utilisateurs" style={{ marginLeft: "16px" }}>Utilisateurs</Link>

// Ajoute dans le <Routes>
<Route path="/utilisateurs" element={<ListeUtilisateurs />} />
<Route path="/utilisateur/:id" element={<Utilisateur />} />
```

**Résultat attendu** : une liste d'utilisateurs cliquable. Cliquer sur un nom ouvre la page de détail.

---

### Étape 6 : Navigation programmatique avec useNavigate

Crée `src/pages/Recherche.tsx` :

```tsx
// src/pages/Recherche.tsx
import { useState } from "react";
import { useNavigate } from "react-router";

function Recherche() {
  const [terme, setTerme] = useState("");

  // useNavigate() retourne une fonction pour naviguer programmatiquement
  const navigate = useNavigate();

  const gererRecherche = (e: React.FormEvent) => {
    e.preventDefault();

    if (terme.trim()) {
      // Navigue vers la page de résultats avec le terme en paramètre
      navigate(`/recherche/${encodeURIComponent(terme)}`);
    }
  };

  return (
    <div>
      <h1>Recherche</h1>
      <form onSubmit={gererRecherche}>
        <input
          type="text"
          value={terme}
          onChange={(e) => setTerme(e.target.value)}
          placeholder="Rechercher..."
          style={{ padding: "8px", marginRight: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Rechercher
        </button>
      </form>
    </div>
  );
}

export default Recherche;
```

---

### Étape 7 : Routes imbriquées (nested routes)

Crée `src/pages/Tableau.tsx` :

```tsx
// src/pages/Tableau.tsx
import { Link, Outlet } from "react-router";

// Composant parent qui contient la navigation et un espace pour les sous-pages
function Tableau() {
  return (
    <div>
      <h1>Tableau de bord</h1>

      {/* Navigation des sous-pages */}
      <nav style={{ marginBottom: "20px" }}>
        <Link to="/tableau" style={{ marginRight: "16px" }}>Vue générale</Link>
        <Link to="/tableau/statistiques" style={{ marginRight: "16px" }}>Statistiques</Link>
        <Link to="/tableau/parametres">Paramètres</Link>
      </nav>

      {/* Outlet est l'endroit où les sous-routes s'affichent */}
      {/* C'est comme un "slot" pour les composants enfants */}
      <div style={{ border: "1px solid #ccc", padding: "16px" }}>
        <Outlet />
      </div>
    </div>
  );
}

// Sous-composants pour les routes imbriquées
function VueGenerale() {
  return <p>Vue générale du tableau de bord.</p>;
}

function Statistiques() {
  return <p>Statistiques détaillées ici.</p>;
}

function Parametres() {
  return <p>Paramètres du tableau de bord.</p>;
}

export { Tableau, VueGenerale, Statistiques, Parametres };
```

Configure les routes imbriquées dans `App.tsx` :

```tsx
import { Tableau, VueGenerale, Statistiques, Parametres } from "./pages/Tableau";

// Dans le <Routes>
<Route path="/tableau" element={<Tableau />}>
  {/* index signifie "route par défaut" quand on est sur /tableau */}
  <Route index element={<VueGenerale />} />
  <Route path="statistiques" element={<Statistiques />} />
  <Route path="parametres" element={<Parametres />} />
</Route>
```

**Résultat attendu** : une page avec un menu secondaire. Le contenu de la zone encadrée change selon le lien cliqué, sans recharger le layout parent.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm install react-router` | Installe React Router (v8+, mode declarative) |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types TypeScript |

---

## Pièges Fréquents

### Piège 1 : Utiliser `<a href>` au lieu de `<Link to>`

**Problème** : Utiliser une balise `<a>` classique pour la navigation. Le navigateur recharge toute la page, ce qui perd l'état de l'application.

**Solution** : Utilise toujours `<Link>` de React Router pour la navigation interne.

```tsx
// ❌ Recharge la page entière
<a href="/contact">Contact</a>

// ✅ Navigation sans rechargement
<Link to="/contact">Contact</Link>
```

---

### Piège 2 : Oublier BrowserRouter

**Problème** : Utiliser `<Routes>` ou `<Link>` sans avoir enveloppé l'application dans `<BrowserRouter>`. Erreur : "useRoutes() may be used only in the context of a Router component".

**Solution** : Ajoute `<BrowserRouter>` dans `main.tsx`.

---

### Piège 3 : Route catch-all mal placée

**Problème** : Placer la route `path="*"` avant les autres routes. Elle capture toutes les URL et les routes suivantes ne sont jamais atteintes.

**Solution** : Place la route `path="*"` en dernier.

```tsx
// ❌ La route * capture tout
<Routes>
  <Route path="*" element={<NotFound />} />
  <Route path="/contact" element={<Contact />} />
</Routes>

// ✅ La route * est en dernier
<Routes>
  <Route path="/contact" element={<Contact />} />
  <Route path="*" element={<NotFound />} />
</Routes>
```

---

### Piège 4 : Oublier Outlet dans les routes imbriquées

**Problème** : Définir des routes imbriquées sans `<Outlet />` dans le composant parent. Les sous-routes ne s'affichent nulle part.

**Solution** : Ajoute `<Outlet />` dans le composant parent pour indiquer où afficher les sous-routes.

---

## Checklist de Validation

- [ ] Je sais installer et configurer React Router
- [ ] Je sais créer des routes avec `<Routes>` et `<Route>`
- [ ] Je sais naviguer avec `<Link>` sans recharger la page
- [ ] Je sais utiliser les paramètres d'URL avec `useParams`
- [ ] Je sais naviguer programmatiquement avec `useNavigate`
- [ ] Je sais créer des routes imbriquées avec `<Outlet />`
- [ ] Je sais gérer les pages 404 avec `path="*"`

---

## Exercice Pratique

**Énoncé** : Crée un mini blog avec les pages suivantes :

1. **Accueil** (`/`) : liste des articles (titre + extrait) avec liens vers la page de détail
2. **Détail article** (`/article/:id`) : affiche le titre et le contenu complet d'un article
3. **À propos** (`/a-propos`) : page statique
4. **404** : page affichée pour les routes inconnues
5. Navigation commune sur toutes les pages

**Indications** :

- Crée un tableau d'articles avec id, titre, extrait et contenu
- Utilise `useParams` pour récupérer l'id de l'article
- Utilise `Link` pour la navigation
- Crée un composant `Navigation` séparé

**Résultat attendu** : un mini blog navigable avec la liste des articles et les pages de détail.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/data/articles.ts` :

```typescript
// src/data/articles.ts

// Données fictives des articles
export interface Article {
  id: number;
  titre: string;
  extrait: string;
  contenu: string;
  date: string;
}

export const articles: Article[] = [
  {
    id: 1,
    titre: "Premiers pas avec React",
    extrait: "Découvrez React et créez votre premier composant.",
    contenu: "React est une bibliothèque JavaScript pour construire des interfaces utilisateur. Dans cet article, nous allons créer un premier composant et comprendre le JSX.",
    date: "2026-01-15",
  },
  {
    id: 2,
    titre: "TypeScript et React",
    extrait: "Comment typer vos composants React avec TypeScript.",
    contenu: "TypeScript apporte la sécurité des types à vos composants React. Apprenez à typer les props, l'état et les événements pour un code plus fiable.",
    date: "2026-02-10",
  },
  {
    id: 3,
    titre: "React Router en pratique",
    extrait: "Naviguer entre les pages dans une application React.",
    contenu: "React Router permet de créer une navigation multi-pages dans une SPA. Cet article couvre les routes, les paramètres et les routes imbriquées.",
    date: "2026-03-05",
  },
];
```

`src/pages/AccueilBlog.tsx` :

```tsx
// src/pages/AccueilBlog.tsx
import { Link } from "react-router";
import { articles } from "../data/articles";

function AccueilBlog() {
  return (
    <div>
      <h1>Mon Blog</h1>
      {articles.map((article) => (
        <div key={article.id} style={{ marginBottom: "20px", borderBottom: "1px solid #eee", paddingBottom: "16px" }}>
          <h2>
            <Link to={`/article/${article.id}`}>{article.titre}</Link>
          </h2>
          <p style={{ color: "#666" }}>{article.date}</p>
          <p>{article.extrait}</p>
        </div>
      ))}
    </div>
  );
}

export default AccueilBlog;
```

`src/pages/DetailArticle.tsx` :

```tsx
// src/pages/DetailArticle.tsx
import { useParams, Link } from "react-router";
import { articles } from "../data/articles";

function DetailArticle() {
  const { id } = useParams<{ id: string }>();
  const article = articles.find((a) => a.id === Number(id));

  if (!article) {
    return (
      <div>
        <h1>Article non trouvé</h1>
        <Link to="/">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/">Retour à la liste</Link>
      <h1>{article.titre}</h1>
      <p style={{ color: "#666" }}>Publié le {article.date}</p>
      <p>{article.contenu}</p>
    </div>
  );
}

export default DetailArticle;
```

---

## Navigation

← Fiche précédente : **[08 - Listes et clés](08-listes-cles.md)**

→ Fiche suivante : **[10 - Context et état global](10-context-etat-global.md)**
