---
tags:
  - React
  - Avancé
  - Pratique
description: "Connecter un frontend React à une API JSON Symfony avec CORS et authentification."
estimated_time: "90 min"
fiche_number: 13
total_fiches: 19
cursus: "React"
---

# 13 - React et Symfony

> **En bref** : Connecter un frontend React à l'API JSON d'un backend Symfony, configurer CORS, gérer l'authentification par token JWT et structurer les appels API. Lecture estimée : 90 min.

## Prérequis

- Fiche précédente : [12 - Appels API avec fetch](12-appels-api-fetch.md)
- Savoir utiliser `fetch` et le hook `useFetch`
- Avoir suivi le cursus Symfony (notamment les fiches sur les contrôleurs et l'API JSON)
- Connaître le format JSON

## Objectif de cette fiche

À la fin de cette fiche, tu sauras connecter un frontend React à un backend Symfony, configurer les en-têtes CORS pour autoriser les requêtes cross-origin, gérer l'authentification JWT et structurer proprement les appels API dans ton projet React.

---

## Concepts

### Qu'est-ce qu'une architecture frontend/backend séparés ?

**Définition** : Une architecture frontend/backend séparés est un modèle où le frontend (React) et le backend (Symfony) sont deux applications distinctes. Le frontend s'exécute dans le navigateur et communique avec le backend via des requêtes HTTP (API REST).

**Le problème que cette architecture résout** :

Sans séparation frontend/backend :

1. **Couplage fort** : le HTML est généré par le serveur (Twig), ce qui mélange la logique d'affichage et la logique métier.
2. **Pas de réactivité** : chaque action recharge la page complète.
3. **Difficulté à réutiliser l'API** : si le backend génère du HTML, une application mobile ne peut pas utiliser la même API.

**Comment cette architecture résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Couplage fort | Le frontend et le backend sont indépendants |
| Pas de réactivité | React gère l'interface sans rechargement de page |
| Difficulté à réutiliser l'API | L'API JSON peut être consommée par React, une app mobile ou un autre service |

**Analogie concrète** : L'architecture frontend/backend séparés est comme un restaurant avec une cuisine et une salle séparées. La cuisine (Symfony) prépare les plats (données JSON). Le serveur (fetch) transporte les plats. La salle (React) présente les plats aux clients (l'utilisateur). La cuisine n'a pas besoin de savoir comment la salle est décorée, et la salle n'a pas besoin de savoir comment les plats sont préparés.

**Ce que cette architecture n'est PAS** :

- Ce n'est pas obligatoire. Pour un site simple avec peu d'interactivité, Symfony + Twig suffit.
- Ce n'est pas plus simple qu'un monolithe. Deux applications à gérer = plus de complexité opérationnelle.

---

### Qu'est-ce que CORS ?

**Définition** : CORS (Cross-Origin Resource Sharing) est un mécanisme de sécurité du navigateur qui bloque les requêtes HTTP envoyées depuis un domaine différent de celui du serveur. Quand React tourne sur `localhost:5173` et Symfony sur `localhost:8000`, le navigateur considère que ce sont deux origines différentes et bloque les requêtes.

**Le problème que CORS résout** :

Sans CORS :

1. **Faille de sécurité** : n'importe quel site web pourrait envoyer des requêtes à ton API et récupérer des données sensibles.
2. **Vol de session** : un site malveillant pourrait envoyer des requêtes authentifiées à ton API en utilisant les cookies du navigateur.

**Comment CORS résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Faille de sécurité | Seules les origines autorisées peuvent accéder à l'API |
| Vol de session | Le navigateur vérifie les en-têtes CORS avant d'envoyer la requête |

**Le fonctionnement de CORS en 3 étapes** :

```text
1. Le navigateur envoie une requête "preflight" (OPTIONS)
   → "Est-ce que localhost:5173 a le droit d'accéder à localhost:8000 ?"

2. Le serveur Symfony répond avec les en-têtes CORS
   → "Oui, localhost:5173 est autorisé" (Access-Control-Allow-Origin)

3. Le navigateur envoie la vraie requête (GET, POST, etc.)
   → La requête passe car le serveur l'a autorisée
```

**Ce que CORS n'est PAS** :

- CORS n'est pas une protection côté serveur. CORS protège le navigateur. Un outil comme `curl` ou Postman ignore CORS.
- CORS n'est pas un firewall. Il ne bloque pas les requêtes serveur-à-serveur.

---

### Qu'est-ce que l'authentification JWT ?

**Définition** : JWT (JSON Web Token) est un standard pour l'authentification sans session. Le serveur génère un token signé qui contient les informations de l'utilisateur. Le frontend stocke ce token et l'envoie dans chaque requête pour prouver son identité.

**Le problème que JWT résout** :

Sans JWT :

1. **Sessions serveur** : le serveur doit stocker l'état de chaque utilisateur connecté, ce qui consomme de la mémoire.
2. **Cookies cross-origin** : les cookies ne fonctionnent pas facilement entre deux domaines différents (React et Symfony).
3. **Pas de portabilité** : un token de session n'est pas utilisable par un autre service.

**Comment JWT résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Sessions serveur | Le token est stocké côté client, pas de session serveur |
| Cookies cross-origin | Le token est envoyé dans l'en-tête Authorization |
| Pas de portabilité | Le token JWT est un standard utilisable partout |

**Le flux d'authentification JWT** :

```text
1. L'utilisateur envoie ses identifiants (email + mot de passe)
2. Symfony vérifie les identifiants et génère un token JWT
3. React stocke le token (localStorage ou mémoire)
4. React envoie le token dans chaque requête (en-tête Authorization: Bearer <token>)
5. Symfony vérifie le token et autorise la requête
```

**Analogie concrète** : Un token JWT est comme un badge d'accès dans un immeuble de bureaux. À l'accueil (connexion), on te donne un badge (token). Ensuite, tu passes ton badge devant chaque porte (chaque requête API). Le badge contient ton nom et tes droits d'accès. Il n'est pas nécessaire de retourner à l'accueil à chaque porte.

**Comparaison session vs JWT** :

| Session (cookies) | JWT (token) |
| --- | --- |
| État stocké sur le serveur | État stocké dans le token |
| Fonctionne bien en same-origin | Fonctionne en cross-origin |
| Difficile à partager entre services | Portable entre services |
| Expiration gérée par le serveur | Expiration intégrée dans le token |

---

Le diagramme suivant montre l'architecture d'une application React + Symfony avec deux serveurs distincts qui communiquent en JSON.

<div class="diagram-design">
<p><a href="../../diagrams/08-react-13-react-symfony-1.html">Qu&#x27;est-ce que l&#x27;authentification JWT ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-13-react-symfony-1.html" title="Qu&#x27;est-ce que l&#x27;authentification JWT ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

## Étapes Pratiques

### Étape 1 : Configurer CORS dans Symfony

Installe le bundle NelmioCorsBundle dans ton projet Symfony :

```bash
# Dans le dossier du projet Symfony
composer require nelmio/cors-bundle
```

Configure CORS dans `config/packages/nelmio_cors.yaml` :

```yaml
# config/packages/nelmio_cors.yaml
nelmio_cors:
  defaults:
    # Autorise les requêtes depuis le serveur de développement React
    origin_regex: true
    allow_origin: ['http://localhost:5173']
    allow_methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
    allow_headers: ['Content-Type', 'Authorization']
    max_age: 3600
  paths:
    '^/api/':
      allow_origin: ['http://localhost:5173']
      allow_headers: ['Content-Type', 'Authorization']
      allow_methods: ['GET', 'POST', 'PUT', 'DELETE']
```

**Explication de la configuration** :

| Paramètre | Rôle |
| --- | --- |
| `allow_origin` | Liste des domaines autorisés à accéder à l'API |
| `allow_methods` | Méthodes HTTP autorisées |
| `allow_headers` | En-têtes autorisés dans les requêtes |
| `max_age` | Durée en secondes pendant laquelle le navigateur met en cache la réponse preflight |

**Résultat attendu** :

```text
Le fichier config/packages/nelmio_cors.yaml est créé. La commande
composer require nelmio/cors-bundle se termine sans erreur.
```

---

### Étape 2 : Créer un service API côté React

Crée `src/services/api.ts` :

```tsx
// src/services/api.ts

// URL de base de l'API Symfony
const API_BASE_URL = "http://localhost:8000/api";

// Fonction utilitaire qui ajoute les en-têtes communs
function creerEnTetes(token?: string): HeadersInit {
  const enTetes: HeadersInit = {
    "Content-Type": "application/json",
  };

  // Ajoute le token d'authentification s'il existe
  if (token) {
    enTetes["Authorization"] = `Bearer ${token}`;
  }

  return enTetes;
}

// Fonction générique pour les requêtes GET
async function recuperer<T>(chemin: string, token?: string): Promise<T> {
  const reponse = await fetch(`${API_BASE_URL}${chemin}`, {
    method: "GET",
    headers: creerEnTetes(token),
  });

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP ${reponse.status} : ${reponse.statusText}`);
  }

  return reponse.json() as Promise<T>;
}

// Fonction générique pour les requêtes POST
async function envoyer<T, D>(chemin: string, donnees: D, token?: string): Promise<T> {
  const reponse = await fetch(`${API_BASE_URL}${chemin}`, {
    method: "POST",
    headers: creerEnTetes(token),
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP ${reponse.status} : ${reponse.statusText}`);
  }

  return reponse.json() as Promise<T>;
}

// Fonction générique pour les requêtes PUT
async function modifier<T, D>(chemin: string, donnees: D, token?: string): Promise<T> {
  const reponse = await fetch(`${API_BASE_URL}${chemin}`, {
    method: "PUT",
    headers: creerEnTetes(token),
    body: JSON.stringify(donnees),
  });

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP ${reponse.status} : ${reponse.statusText}`);
  }

  return reponse.json() as Promise<T>;
}

// Fonction pour les requêtes DELETE
async function supprimer(chemin: string, token?: string): Promise<void> {
  const reponse = await fetch(`${API_BASE_URL}${chemin}`, {
    method: "DELETE",
    headers: creerEnTetes(token),
  });

  if (!reponse.ok) {
    throw new Error(`Erreur HTTP ${reponse.status} : ${reponse.statusText}`);
  }
}

export { recuperer, envoyer, modifier, supprimer, API_BASE_URL };
```

**Résultat attendu** :

```text
Le fichier src/services/api.ts est créé. La vérification TypeScript
(npx tsc --noEmit) passe sans erreur.
```

---

### Étape 3 : Créer un contexte d'authentification

Crée `src/contexts/AuthContext.tsx` :

```tsx
// src/contexts/AuthContext.tsx
import { createContext, useContext, useReducer, ReactNode } from "react";

// Types pour l'état d'authentification
interface Utilisateur {
  id: number;
  email: string;
  roles: string[];
}

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
      // Sauvegarde le token dans le localStorage
      localStorage.setItem("auth-token", action.token);
      return {
        utilisateur: action.utilisateur,
        token: action.token,
        estConnecte: true,
      };
    case "deconnexion":
      // Supprime le token du localStorage
      localStorage.removeItem("auth-token");
      return {
        utilisateur: null,
        token: null,
        estConnecte: false,
      };
  }
}

// Valeur initiale : vérifie si un token existe dans le localStorage
function creerEtatInitial(): EtatAuth {
  const token = localStorage.getItem("auth-token");
  return {
    utilisateur: null,
    token,
    estConnecte: token !== null,
  };
}

// Interface du contexte
interface AuthContextType {
  utilisateur: Utilisateur | null;
  token: string | null;
  estConnecte: boolean;
  connexion: (email: string, motDePasse: string) => Promise<void>;
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
  const [etat, dispatch] = useReducer(authReducer, undefined, creerEtatInitial);

  // Fonction de connexion qui appelle l'API Symfony
  const connexion = async (email: string, motDePasse: string) => {
    const reponse = await fetch("http://localhost:8000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password: motDePasse }),
    });

    if (!reponse.ok) {
      throw new Error("Identifiants invalides");
    }

    // Symfony retourne le token JWT et les informations utilisateur
    const donnees = await reponse.json();

    dispatch({
      type: "connexion",
      utilisateur: {
        id: donnees.user.id,
        email: donnees.user.email,
        roles: donnees.user.roles,
      },
      token: donnees.token,
    });
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

**Résultat attendu** :

```text
Le fichier src/contexts/AuthContext.tsx est créé. La vérification TypeScript
(npx tsc --noEmit) passe sans erreur. Le contexte exporte AuthProvider et
useAuth.
```

---

### Étape 4 : Créer un formulaire de connexion

Crée `src/components/FormulaireConnexion.tsx` :

```tsx
// src/components/FormulaireConnexion.tsx
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

function FormulaireConnexion() {
  const { connexion, estConnecte, utilisateur, deconnexion } = useAuth();
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
      // Réinitialise le formulaire après connexion réussie
      setEmail("");
      setMotDePasse("");
    } catch (err) {
      if (err instanceof Error) {
        setErreur(err.message);
      } else {
        setErreur("Une erreur est survenue");
      }
    } finally {
      setChargement(false);
    }
  };

  // Affiche le profil si connecté
  if (estConnecte && utilisateur) {
    return (
      <div style={{ padding: "20px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
        <h2>Connecté</h2>
        <p>Email : {utilisateur.email}</p>
        <p>Rôles : {utilisateur.roles.join(", ")}</p>
        <button onClick={deconnexion} style={{ padding: "8px 16px" }}>
          Se déconnecter
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Connexion</h2>

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

        <button type="submit" disabled={chargement} style={{ padding: "8px 16px" }}>
          {chargement ? "Connexion..." : "Se connecter"}
        </button>
      </form>
    </div>
  );
}

export default FormulaireConnexion;
```

**Résultat attendu** : Le formulaire de connexion s'affiche avec deux champs (email et mot de passe) et un bouton "Se connecter". Après une connexion réussie, le formulaire est remplacé par un bloc vert affichant l'email et les rôles de l'utilisateur, ainsi qu'un bouton "Se déconnecter".

---

### Étape 5 : Appeler l'API Symfony avec authentification

Crée `src/hooks/useApiAuth.ts` :

```tsx
// src/hooks/useApiAuth.ts
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { recuperer, envoyer, modifier, supprimer } from "../services/api";

// Hook qui fournit les fonctions API avec le token d'authentification
function useApiAuth() {
  const { token, deconnexion } = useAuth();
  const [chargement, setChargement] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);

  // Wrapper qui gère le chargement, les erreurs et la déconnexion si le token est invalide
  async function executer<T>(appel: () => Promise<T>): Promise<T | null> {
    setChargement(true);
    setErreur(null);

    try {
      const resultat = await appel();
      return resultat;
    } catch (err) {
      if (err instanceof Error) {
        // Si le serveur retourne 401, le token est invalide ou expiré
        if (err.message.includes("401")) {
          deconnexion();
          setErreur("Session expirée. Veuillez vous reconnecter.");
        } else {
          setErreur(err.message);
        }
      }
      return null;
    } finally {
      setChargement(false);
    }
  }

  return {
    chargement,
    erreur,
    // Fonctions API prêtes à l'emploi avec le token
    get: <T,>(chemin: string) => executer(() => recuperer<T>(chemin, token ?? undefined)),
    post: <T, D>(chemin: string, donnees: D) =>
      executer(() => envoyer<T, D>(chemin, donnees, token ?? undefined)),
    put: <T, D>(chemin: string, donnees: D) =>
      executer(() => modifier<T, D>(chemin, donnees, token ?? undefined)),
    del: (chemin: string) => executer(() => supprimer(chemin, token ?? undefined)),
  };
}

export default useApiAuth;
```

Crée `src/components/ListeArticles.tsx` :

```tsx
// src/components/ListeArticles.tsx
import { useState, useEffect } from "react";
import useApiAuth from "../hooks/useApiAuth";
import { useAuth } from "../contexts/AuthContext";

interface Article {
  id: number;
  titre: string;
  contenu: string;
}

function ListeArticles() {
  const { estConnecte } = useAuth();
  const api = useApiAuth();
  const [articles, setArticles] = useState<Article[]>([]);
  const [nouveauTitre, setNouveauTitre] = useState("");
  const [nouveauContenu, setNouveauContenu] = useState("");

  // Charge les articles au montage si connecté
  useEffect(() => {
    if (!estConnecte) return;

    const charger = async () => {
      const donnees = await api.get<Article[]>("/articles");
      if (donnees) {
        setArticles(donnees);
      }
    };

    charger();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    // Pourquoi cette désactivation ?
    // La règle react-hooks/exhaustive-deps demande d'inclure `api` dans le tableau de dépendances.
    // Or `api` est un objet recréé à chaque rendu (useApiAuth retourne un nouvel objet à chaque appel).
    // L'inclure provoquerait une boucle infinie : rendu → nouvel `api` → useEffect → rendu → ...
    // Solution correcte à terme : mémoriser `api` avec useCallback dans useApiAuth,
    // ou restructurer pour ne passer en dépendance que des primitives (ex. l'URL de base).
    // Pour simplifier cet exemple, on désactive la règle en documentant pourquoi.
  }, [estConnecte]);

  // Ajoute un article
  const ajouterArticle = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nouvelArticle = await api.post<Article, { titre: string; contenu: string }>(
      "/articles",
      { titre: nouveauTitre, contenu: nouveauContenu }
    );

    if (nouvelArticle) {
      setArticles((prev) => [...prev, nouvelArticle]);
      setNouveauTitre("");
      setNouveauContenu("");
    }
  };

  // Supprime un article
  const supprimerArticle = async (id: number) => {
    await api.del(`/articles/${id}`);
    setArticles((prev) => prev.filter((a) => a.id !== id));
  };

  if (!estConnecte) {
    return <p>Tu dois être connecté pour voir les articles.</p>;
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2>Articles</h2>

      {api.erreur && (
        <p style={{ color: "red" }}>Erreur : {api.erreur}</p>
      )}

      <form onSubmit={ajouterArticle} style={{ marginBottom: "20px" }}>
        <div style={{ marginBottom: "8px" }}>
          <input
            type="text"
            value={nouveauTitre}
            onChange={(e) => setNouveauTitre(e.target.value)}
            placeholder="Titre de l'article"
            required
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <div style={{ marginBottom: "8px" }}>
          <textarea
            value={nouveauContenu}
            onChange={(e) => setNouveauContenu(e.target.value)}
            placeholder="Contenu de l'article"
            required
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
        </div>
        <button type="submit" disabled={api.chargement} style={{ padding: "8px 16px" }}>
          {api.chargement ? "Envoi..." : "Ajouter"}
        </button>
      </form>

      {articles.length === 0 ? (
        <p>Aucun article.</p>
      ) : (
        articles.map((article) => (
          <div key={article.id} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "8px" }}>
            <h3>{article.titre}</h3>
            <p>{article.contenu}</p>
            <button
              onClick={() => supprimerArticle(article.id)}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
            >
              Supprimer
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default ListeArticles;
```

**Résultat attendu** : une application qui nécessite une connexion pour accéder aux articles, avec ajout et suppression authentifiés.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur React (port 5173) |
| `symfony serve` | Lance le serveur Symfony (port 8000) |
| `npx tsc --noEmit` | Vérifie les types |

---

## Pièges Fréquents

### Piège 1 : Erreur CORS au lieu de l'erreur réelle

⚠️ **Problème** : Le navigateur affiche "CORS error" alors que le vrai problème est une erreur 500 côté Symfony. Le navigateur masque l'erreur réelle derrière l'erreur CORS.

✅ **Solution** : Vérifie les logs Symfony (`var/log/dev.log`) pour trouver la vraie erreur. Configure CORS correctement pour que les erreurs Symfony soient transmises.

---

### Piège 2 : Token stocké en clair dans le localStorage

⚠️ **Problème** : Le localStorage est accessible par tout le JavaScript de la page. Une faille XSS permettrait de voler le token.

✅ **Solution** : Pour une application de production, stocke le token dans un cookie `HttpOnly` (inaccessible depuis JavaScript). Pour l'apprentissage, le localStorage est acceptable.

---

### Piège 3 : Oublier le Content-Type pour POST/PUT

⚠️ **Problème** : Envoyer une requête POST sans l'en-tête `Content-Type: application/json`. Symfony ne parse pas le corps de la requête.

✅ **Solution** : Ajoute toujours `"Content-Type": "application/json"` dans les en-têtes des requêtes POST et PUT.

```tsx
// ❌ Symfony ne reçoit pas les données
await fetch("/api/articles", {
  method: "POST",
  body: JSON.stringify(donnees),
});

// ✅ Symfony parse correctement le JSON
await fetch("/api/articles", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(donnees),
});
```

---

### Piège 4 : URL en dur dans les composants

⚠️ **Problème** : Écrire `http://localhost:8000` directement dans les composants. Quand l'URL change (production, staging), il faut modifier chaque composant.

✅ **Solution** : Centralise l'URL dans un service API (comme dans l'étape 2) ou utilise une variable d'environnement.

```tsx
// ❌ URL en dur dans le composant
await fetch("http://localhost:8000/api/articles");

// ✅ URL centralisée dans le service
import { recuperer } from "../services/api";
await recuperer<Article[]>("/articles");
```

---

## Checklist de Validation

- [ ] Je comprends l'architecture frontend/backend séparés
- [ ] Je sais configurer CORS dans Symfony (NelmioCorsBundle)
- [ ] Je sais créer un service API centralisé côté React
- [ ] Je comprends le flux d'authentification JWT
- [ ] Je sais stocker et envoyer un token JWT
- [ ] Je sais créer un contexte d'authentification avec useReducer
- [ ] Je sais gérer la déconnexion automatique quand le token expire
- [ ] Je sais lancer React et Symfony en parallèle

---

## Exercice Pratique

**Énoncé** : Crée une application de gestion de notes connectée à Symfony :

1. Un formulaire de connexion (email + mot de passe)
2. Une fois connecté, affiche la liste des notes de l'utilisateur
3. Permet d'ajouter une nouvelle note (titre + contenu)
4. Permet de supprimer une note
5. La déconnexion redirige vers le formulaire de connexion

**Indications** :

- Utilise le `AuthProvider` créé dans cette fiche
- Crée un hook `useApiAuth` pour les appels authentifiés
- Simule les appels API si tu n'as pas de backend Symfony actif (utilise un état local avec un délai `setTimeout` pour imiter la latence)
- Gère les états de chargement et d'erreur

**Résultat attendu** : une application fonctionnelle avec connexion, liste de notes, ajout et suppression.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/components/AppNotes.tsx` :

```tsx
// src/components/AppNotes.tsx
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";

interface Note {
  id: number;
  titre: string;
  contenu: string;
  dateCreation: string;
}

function AppNotes() {
  const { estConnecte, utilisateur } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [titre, setTitre] = useState("");
  const [contenu, setContenu] = useState("");
  const [chargement, setChargement] = useState(false);

  // Simule le chargement des notes (remplacer par un vrai appel API)
  useEffect(() => {
    if (!estConnecte) return;

    setChargement(true);
    // Simule un délai réseau
    const timer = setTimeout(() => {
      setNotes([
        {
          id: 1,
          titre: "Première note",
          contenu: "Contenu de ma première note",
          dateCreation: new Date().toLocaleDateString("fr-FR"),
        },
      ]);
      setChargement(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [estConnecte]);

  const ajouterNote = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (titre.trim().length === 0) return;

    const nouvelleNote: Note = {
      id: Date.now(),
      titre: titre.trim(),
      contenu: contenu.trim(),
      dateCreation: new Date().toLocaleDateString("fr-FR"),
    };

    setNotes((prev) => [nouvelleNote, ...prev]);
    setTitre("");
    setContenu("");
  };

  const supprimerNote = (id: number) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  if (!estConnecte) {
    return <p>Connecte-toi pour accéder à tes notes.</p>;
  }

  if (chargement) {
    return <p>Chargement des notes...</p>;
  }

  return (
    <div style={{ maxWidth: "600px" }}>
      <h2>Mes notes ({utilisateur?.email})</h2>

      <form onSubmit={ajouterNote} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          placeholder="Titre de la note"
          required
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <textarea
          value={contenu}
          onChange={(e) => setContenu(e.target.value)}
          placeholder="Contenu..."
          rows={3}
          style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Ajouter la note
        </button>
      </form>

      {notes.length === 0 ? (
        <p>Aucune note. Crée ta première note ci-dessus.</p>
      ) : (
        notes.map((note) => (
          <div key={note.id} style={{ border: "1px solid #ddd", padding: "12px", marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ margin: 0 }}>{note.titre}</h3>
              <span style={{ color: "#666", fontSize: "12px" }}>{note.dateCreation}</span>
            </div>
            <p>{note.contenu}</p>
            <button
              onClick={() => supprimerNote(note.id)}
              style={{ color: "red", border: "none", background: "none", cursor: "pointer" }}
            >
              Supprimer
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default AppNotes;
```

---

## Navigation

← Fiche précédente : **[12 - Appels API avec fetch](12-appels-api-fetch.md)**

→ Fiche suivante : **[14 - Formulaires avancés](14-formulaires-avances.md)**
