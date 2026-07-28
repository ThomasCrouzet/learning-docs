---
tags:
  - Référence
  - React
description: "Aide-mémoire React : hooks, composants, JSX, Router et Context"
estimated_time: "20 min"
fiche_number: 9
total_fiches: 18
cursus: "Fiches de référence"
---

# Aide-mémoire React

> **En bref** : Aide-mémoire React. Lecture estimée : 20 min.

Fiche de référence rapide pour React : composants, hooks, JSX, Router et Context.

---

## Structure d'un composant

```jsx
// Composant fonctionnel
function UserCard({ name, email, role = "user" }) {
  return (
    <div className="user-card">
      <h2>{name}</h2>
      <p>{email}</p>
      <span>{role}</span>
    </div>
  );
}

// Utilisation
<UserCard name="Alex" email="alex@example.com" />
```

---

## JSX - Règles essentielles

| Règle | Exemple |
| ----- | ------- |
| Un seul élément racine | Envelopper avec `<div>` ou `<>...</>` |
| `className` au lieu de `class` | `<div className="card">` |
| `htmlFor` au lieu de `for` | `<label htmlFor="email">` |
| Expressions JS entre accolades | `<p>{user.name}</p>` |
| Attributs en camelCase | `onClick`, `onChange`, `tabIndex` |
| Fermer toutes les balises | `<img />`, `<input />` |

### Rendu conditionnel

```jsx
// Ternaire
{isLoggedIn ? <Dashboard /> : <Login />}

// ET logique (afficher ou rien)
{error && <ErrorMessage text={error} />}

// Variable
let content;
if (loading) {
  content = <Spinner />;
} else {
  content = <UserList users={users} />;
}
return <div>{content}</div>;
```

### Rendu de listes

```jsx
const users = [
  { id: 1, name: "Alex" },
  { id: 2, name: "Sam" },
];

return (
  <ul>
    {users.map((user) => (
      <li key={user.id}>{user.name}</li>
    ))}
  </ul>
);
```

---

## Hooks

### useState

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <button onClick={() => setCount(count + 1)}>
      Compteur : {count}
    </button>
  );
}

// Mise a jour basée sur l'état précédent
setCount((prev) => prev + 1);

// Etat objet
const [form, setForm] = useState({ name: "", email: "" });
setForm((prev) => ({ ...prev, name: "Alex" }));
```

### useEffect

```jsx
import { useEffect } from "react";

// Exécuter au montage
useEffect(() => {
  fetchData();
}, []);

// Exécuter quand une dépendance change
useEffect(() => {
  fetchUser(userId);
}, [userId]);

// Nettoyage (démontage)
useEffect(() => {
  const timer = setInterval(() => tick(), 1000);
  return () => clearInterval(timer);
}, []);
```

### useRef

```jsx
import { useRef } from "react";

function TextInput() {
  const inputRef = useRef(null);

  const focusInput = () => {
    inputRef.current.focus();
  };

  return <input ref={inputRef} />;
}
```

### useMemo et useCallback

```jsx
import { useMemo, useCallback } from "react";

// Mémoriser une valeur calculée
const sortedUsers = useMemo(() => {
  return users.sort((a, b) => a.name.localeCompare(b.name));
}, [users]);

// Mémoriser une fonction
const handleClick = useCallback((id) => {
  deleteUser(id);
}, [deleteUser]);
```

---

## Formulaires

```jsx
function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Connexion</button>
    </form>
  );
}
```

---

## React Router

```jsx
import { BrowserRouter, Routes, Route, Link, useParams } from "react-router-dom";

// Configuration des routes
function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/">Accueil</Link>
        <Link to="/users">Utilisateurs</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/:id" element={<UserDetail />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Paramètre d'URL
function UserDetail() {
  const { id } = useParams();
  return <p>Utilisateur {id}</p>;
}
```

---

## Context

```jsx
import { createContext, useContext, useState } from "react";

// Créer le contexte
const ThemeContext = createContext();

// Fournisseur
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState("light");

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Consommateur (dans un composant enfant)
function ThemedButton() {
  const { theme, setTheme } = useContext(ThemeContext);

  return (
    <button onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
      Theme : {theme}
    </button>
  );
}
```

---

## Navigation

← Fiche précédente : **[Aide-mémoire JavaScript ES6+](08-aide-memoire-javascript.md)**

→ Fiche suivante : **[Aide-mémoire Kubernetes](10-aide-memoire-kubernetes.md)**
