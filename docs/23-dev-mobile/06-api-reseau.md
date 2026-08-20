---
tags:
  - Mobile
  - Intermédiaire
  - Pratique
description: "Communiquer avec une API REST depuis React Native avec fetch et Axios, gérer le mode offline et l'authentification JWT."
estimated_time: "75 min"
fiche_number: 6
total_fiches: 13
cursus: "Dev Mobile"
---

# 06 - API et réseau

> **En bref** : Apprendre à consommer une API REST depuis une application React Native, gérer les erreurs réseau, le mode offline et l'authentification par token JWT. Lecture estimée : 75 min.

## Prérequis

- [Gestion de l'état et données](05-etat-donnees.md) terminée
- Connaître les Promises et async/await en JavaScript
- Comprendre le principe d'une API REST (requêtes GET, POST, PUT, DELETE)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras appeler une API REST depuis React Native, afficher les données reçues, gérer les erreurs réseau, mettre en place un cache offline avec AsyncStorage et authentifier les requêtes avec un token JWT.

---

## Concepts

### Qu'est-ce que la communication réseau dans une application mobile ?

**Définition** : La communication réseau est le mécanisme par lequel une application mobile envoie des requêtes HTTP à un serveur distant (API) pour lire ou écrire des données. React Native utilise l'API `fetch` intégrée ou des bibliothèques comme Axios pour effectuer ces requêtes.

**Le problème que la communication réseau résout** :

Sans communication réseau, voici les problèmes rencontrés :

1. **Données statiques** : l'application ne peut afficher que des données codées en dur, impossibles à mettre à jour sans republier l'application.
2. **Pas de synchronisation** : les données de l'utilisateur restent sur son téléphone et ne sont pas accessibles depuis un autre appareil.
3. **Pas d'interaction multi-utilisateurs** : impossible de partager des données entre plusieurs utilisateurs (messagerie, réseaux sociaux, collaboration).

**Comment la communication réseau résout ces problèmes** :

| Problème | Solution apportée par la communication réseau |
| --- | --- |
| Données statiques | Les données sont chargées depuis un serveur et toujours à jour |
| Pas de synchronisation | Les données sont stockées sur un serveur central accessible partout |
| Pas d'interaction multi-utilisateurs | Le serveur gère les échanges entre utilisateurs |

**Analogie concrète** : Une application sans réseau, c'est comme un cahier personnel - tu y écris des choses, mais personne d'autre ne peut les lire. Une application connectée à une API, c'est comme un tableau partagé au bureau - tout le monde voit les mêmes informations, mises à jour en temps réel.

**Ce que la communication réseau n'est PAS** :

- La communication réseau n'est pas du stockage local. `fetch` envoie des données à un serveur distant. Pour stocker localement, utilise AsyncStorage (fiche 05).
- La communication réseau n'est pas instantanée. Chaque requête prend du temps (latence réseau). Il faut toujours gérer l'état de chargement et les erreurs.

---

### Qu'est-ce que le mode offline ?

**Définition** : Le mode offline est la capacité d'une application mobile à continuer de fonctionner quand le téléphone n'a pas de connexion internet. Les données précédemment chargées sont stockées localement et affichées en attendant le retour de la connexion.

**Le problème que le mode offline résout** :

Sans gestion offline, voici les problèmes rencontrés :

1. **Écran vide** : quand le téléphone perd la connexion (métro, avion, zone blanche), l'application affiche une page blanche ou une erreur.
2. **Perte de données saisies** : l'utilisateur remplit un formulaire, la connexion tombe, et tout est perdu.
3. **Expérience dégradée** : l'utilisateur doit attendre le retour de la connexion pour utiliser l'application.

**Comment le mode offline résout ces problèmes** :

| Problème | Solution apportée par le mode offline |
| --- | --- |
| Écran vide | Les données en cache sont affichées immédiatement |
| Perte de données saisies | Les actions sont mises en file d'attente et envoyées au retour de la connexion |
| Expérience dégradée | L'application reste utilisable avec les données en cache |

**Analogie concrète** : Le mode offline, c'est comme un carnet de notes que tu emportes en voyage. Tu notes tes idées même sans accès à internet. Quand tu retrouves une connexion, tu synchronises tes notes avec ton ordinateur.

---

### Qu'est-ce que l'authentification JWT ?

**Définition** : JWT (JSON Web Token) est un standard ouvert qui permet d'authentifier un utilisateur auprès d'une API. Après connexion, le serveur envoie un token (une longue chaîne de caractères) que l'application stocke et envoie avec chaque requête pour prouver l'identité de l'utilisateur.

**Le problème que JWT résout** :

Sans authentification par token, voici les problèmes rencontrés :

1. **Sessions serveur** : le serveur doit stocker l'état de connexion de chaque utilisateur en mémoire, ce qui ne passe pas à l'échelle.
2. **Identifiants envoyés à chaque requête** : sans token, il faudrait envoyer le login et le mot de passe à chaque appel API, ce qui est dangereux.
3. **Pas de vérification côté client** : impossible de savoir si l'utilisateur est connecté sans appeler le serveur.

**Comment JWT résout ces problèmes** :

| Problème | Solution apportée par JWT |
| --- | --- |
| Sessions serveur | Le token contient toutes les informations nécessaires, pas besoin de session côté serveur |
| Identifiants envoyés à chaque requête | Seul le token est envoyé, jamais le mot de passe |
| Pas de vérification côté client | Le token peut être décodé localement pour vérifier l'expiration |

**Analogie concrète** : Un token JWT, c'est comme un badge d'accès à un immeuble. Tu montres ton badge (le token) au vigile (l'API) à chaque entrée. Le vigile vérifie que le badge est valide sans avoir besoin de te redemander ta pièce d'identité (le mot de passe) à chaque fois.

**Ce que JWT n'est PAS** :

- JWT n'est pas du chiffrement. Le contenu du token est encodé en base64 (lisible par tous), pas chiffré. Ne stocke jamais d'informations sensibles dans le payload du token.
- JWT n'est pas éternel. Chaque token a une date d'expiration. Quand il expire, l'utilisateur doit se reconnecter ou utiliser un refresh token.

---

## Étapes pratiques

### Étape 1 : Requête GET avec fetch

L'API `fetch` est intégrée à React Native. Voici comment charger une liste d'éléments depuis une API :

```tsx
// screens/UsersScreen.tsx
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";

// Type des données attendues de l'API
type User = {
  id: number;
  name: string;
  email: string;
};

export default function UsersScreen() {
  // État pour stocker les utilisateurs
  const [users, setUsers] = useState<User[]>([]);
  // État pour le chargement
  const [loading, setLoading] = useState(true);
  // État pour les erreurs
  const [error, setError] = useState<string | null>(null);

  // Charger les données au montage du composant
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      // Envoyer une requête GET à l'API
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );

      // Vérifier que la réponse est OK (status 200-299)
      if (!response.ok) {
        throw new Error(`Erreur HTTP : ${response.status}`);
      }

      // Convertir la réponse en JSON
      const data: User[] = await response.json();

      // Mettre à jour l'état avec les données reçues
      setUsers(data);
    } catch (err) {
      // Gérer les erreurs réseau et HTTP
      setError(
        err instanceof Error ? err.message : "Une erreur est survenue"
      );
    } finally {
      // Arrêter le chargement dans tous les cas
      setLoading(false);
    }
  };

  // Affichage pendant le chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Chargement...</Text>
      </View>
    );
  }

  // Affichage en cas d'erreur
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={users}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.email}>{item.email}</Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#FF3B30",
    textAlign: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    fontSize: 14,
    color: "#666",
  },
});
```

**Résultat attendu** : une liste de 10 utilisateurs avec leur nom et email, chargée depuis l'API JSONPlaceholder.

---

### Étape 2 : Requête POST avec fetch

Envoyer des données au serveur pour créer une ressource :

```tsx
// hooks/useApi.ts
// Hook personnalisé pour les appels API

type RequestOptions = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: Record<string, unknown>;
  headers?: Record<string, string>;
};

export async function apiRequest<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, headers = {} } = options;

  // Construire les options de la requête
  const fetchOptions: RequestInit = {
    method,
    headers: {
      // Indiquer au serveur qu'on envoie du JSON
      "Content-Type": "application/json",
      // Indiquer au serveur qu'on attend du JSON en retour
      Accept: "application/json",
      ...headers,
    },
  };

  // Ajouter le body uniquement pour POST et PUT
  if (body && (method === "POST" || method === "PUT")) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url, fetchOptions);

  // Gérer les erreurs HTTP
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Erreur ${response.status} : ${errorBody || response.statusText}`
    );
  }

  // Retourner les données parsées
  return response.json();
}
```

Utiliser le hook pour créer un article :

```tsx
// screens/CreatePostScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import { apiRequest } from "../hooks/useApi";

type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

export default function CreatePostScreen() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation basique
    if (!title.trim() || !body.trim()) {
      Alert.alert("Erreur", "Le titre et le contenu sont obligatoires.");
      return;
    }

    try {
      setSubmitting(true);

      // Envoyer une requête POST pour créer un article
      const newPost = await apiRequest<Post>(
        "https://jsonplaceholder.typicode.com/posts",
        {
          method: "POST",
          body: {
            title: title.trim(),
            body: body.trim(),
            userId: 1,
          },
        }
      );

      Alert.alert(
        "Article créé",
        `L'article "${newPost.title}" a été créé avec l'ID ${newPost.id}.`
      );

      // Réinitialiser le formulaire
      setTitle("");
      setBody("");
    } catch (err) {
      Alert.alert(
        "Erreur",
        err instanceof Error ? err.message : "Échec de la création."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Titre</Text>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={setTitle}
        placeholder="Titre de l'article"
      />

      <Text style={styles.label}>Contenu</Text>
      <TextInput
        style={[styles.input, styles.textarea]}
        value={body}
        onChangeText={setBody}
        placeholder="Écris ton article..."
        multiline
        numberOfLines={6}
        textAlignVertical="top"
      />

      <Pressable
        style={[styles.button, submitting && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={submitting}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Publier</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  textarea: {
    height: 120,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
```

**Résultat attendu** : un formulaire avec un titre et un contenu. Quand tu appuies sur "Publier", l'article est envoyé à l'API et une alerte confirme la création.

---

### Étape 3 : Installer et utiliser Axios

Axios est une alternative à fetch avec des fonctionnalités supplémentaires (intercepteurs, timeout, transformation automatique) :

```bash
# Installer Axios
npx expo install axios
```

```tsx
// api/client.ts
import axios from "axios";
// SecureStore pour lire le token JWT chiffré (jamais AsyncStorage pour les tokens)
import * as SecureStore from "expo-secure-store";

// Créer une instance Axios avec une configuration de base
const api = axios.create({
  // URL de base - toutes les requêtes seront préfixées par cette URL
  baseURL: "https://jsonplaceholder.typicode.com",
  // Timeout de 10 secondes - la requête échoue si le serveur ne répond pas
  timeout: 10000,
  // Headers par défaut pour toutes les requêtes
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur de requêtes - exécuté avant chaque requête
api.interceptors.request.use(
  async (config) => {
    // Lire le token JWT depuis le stockage chiffré (SecureStore, pas AsyncStorage)
    const token = await SecureStore.getItemAsync("auth_token");
    if (token) {
      // Ajouter le token dans le header Authorization
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponses - exécuté après chaque réponse
api.interceptors.response.use(
  // En cas de succès, retourner la réponse telle quelle
  (response) => response,
  async (error) => {
    // En cas d'erreur 401 (non autorisé), le token a expiré
    if (error.response?.status === 401) {
      // Supprimer le token expiré du stockage chiffré
      await SecureStore.deleteItemAsync("auth_token");
      // Ici, tu pourrais rediriger vers l'écran de connexion
    }
    return Promise.reject(error);
  }
);

export default api;
```

Utiliser l'instance Axios :

```tsx
// screens/PostsScreen.tsx
import { useEffect, useState } from "react";
import { StyleSheet, Text, View, FlatList, ActivityIndicator } from "react-native";
import axios from "axios";
import api from "../api/client";

type Post = {
  id: number;
  title: string;
  body: string;
};

export default function PostsScreen() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      // Axios retourne un objet avec une propriété "data"
      const response = await api.get<Post[]>("/posts", {
        params: { _limit: 20 }, // Paramètres de requête (query string)
      });

      // Les données sont dans response.data (pas besoin de .json())
      setPosts(response.data);
    } catch (error) {
      // Axios fournit des informations détaillées sur l'erreur
      if (axios.isAxiosError(error)) {
        console.error("Status:", error.response?.status);
        console.error("Data:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      keyExtractor={(item) => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 4 },
  body: { fontSize: 14, color: "#666" },
});
```

**Résultat attendu** : une liste de 20 articles chargés depuis l'API, avec le token JWT automatiquement ajouté aux requêtes si l'utilisateur est connecté.

---

### Étape 4 : Cache offline avec AsyncStorage

Stocker les données de l'API localement pour les afficher même sans connexion :

```tsx
// hooks/useCachedFetch.ts
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type CachedFetchResult<T> = {
  data: T | null;
  loading: boolean;
  error: string | null;
  isFromCache: boolean;
  refresh: () => Promise<void>;
};

export function useCachedFetch<T>(
  url: string,
  cacheKey: string
): CachedFetchResult<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFromCache, setIsFromCache] = useState(false);

  const fetchData = async () => {
    let hasCache = false;
    try {
      setLoading(true);
      setError(null);

      // Étape 1 : Charger les données depuis le cache
      const cached = await AsyncStorage.getItem(cacheKey);
      if (cached) {
        // Afficher les données en cache immédiatement
        setData(JSON.parse(cached) as T);
        setIsFromCache(true);
        hasCache = true;
      }

      // Étape 2 : Tenter de charger les données depuis l'API
      const response = await fetch(url);
      if (!response.ok) throw new Error(`Erreur HTTP : ${response.status}`);
      const freshData: T = await response.json();

      // Étape 3 : Mettre à jour l'affichage et le cache
      setData(freshData);
      setIsFromCache(false);
      await AsyncStorage.setItem(cacheKey, JSON.stringify(freshData));
    } catch (err) {
      // Ne pas lire `data` du state (fermeture périmée) : utiliser hasCache local
      if (hasCache) {
        setError("Données hors ligne (dernière synchronisation)");
      } else {
        setError(
          err instanceof Error ? err.message : "Erreur de chargement"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [url]);

  return { data, loading, error, isFromCache, refresh: fetchData };
}
```

Utiliser le hook de cache :

```tsx
// screens/CachedUsersScreen.tsx
import { StyleSheet, Text, View, FlatList, Pressable, ActivityIndicator } from "react-native";
import { useCachedFetch } from "../hooks/useCachedFetch";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function CachedUsersScreen() {
  const { data, loading, error, isFromCache, refresh } = useCachedFetch<User[]>(
    "https://jsonplaceholder.typicode.com/users",
    "cache_users"
  );

  return (
    <View style={styles.container}>
      {/* Indicateur de source des données */}
      {isFromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheText}>Données hors ligne</Text>
        </View>
      )}

      {/* Message d'erreur */}
      {error && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {loading && !data ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.email}>{item.email}</Text>
            </View>
          )}
          // Tirer vers le bas pour rafraîchir
          onRefresh={refresh}
          refreshing={loading}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  cacheBanner: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    alignItems: "center",
  },
  cacheText: { color: "#856404", fontSize: 14 },
  errorBanner: {
    backgroundColor: "#F8D7DA",
    padding: 8,
    alignItems: "center",
  },
  errorText: { color: "#721C24", fontSize: 14 },
  loader: { marginTop: 40 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  name: { fontSize: 16, fontWeight: "bold" },
  email: { fontSize: 14, color: "#666" },
});
```

**Résultat attendu** : la liste des utilisateurs s'affiche immédiatement depuis le cache, puis se met à jour avec les données fraîches. Si le réseau est coupé, les données en cache restent visibles avec un bandeau "Données hors ligne".

---

### Étape 5 : Authentification JWT

> **Pourquoi `expo-secure-store` et pas `AsyncStorage` pour les tokens ?**
> `AsyncStorage` n'est pas chiffré sur Android et est accessible via les backups ADB. Un JWT stocké dans `AsyncStorage` peut être volé sur un appareil rooté ou via un backup malveillant. `expo-secure-store` utilise le Keychain iOS et le Keystore Android, qui chiffrent les données au niveau du système. Utilise toujours `expo-secure-store` pour les tokens et les données sensibles. Voir aussi la [fiche 05](05-etat-donnees.md) sur les bonnes pratiques de stockage.

Installe `expo-secure-store` si ce n'est pas déjà fait :

```bash
npx expo install expo-secure-store
```

Créer un écran de connexion qui récupère et stocke un token JWT :

```tsx
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
// SecureStore chiffre les données sensibles (Keychain iOS, Keystore Android)
import * as SecureStore from "expo-secure-store";

type AuthContextType = {
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage, vérifier si un token existe déjà
  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    try {
      // SecureStore.getItemAsync lit depuis le stockage chiffré
      const savedToken = await SecureStore.getItemAsync("auth_token");
      if (savedToken) {
        setToken(savedToken);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Connexion : envoyer les identifiants et stocker le token
  const login = async (email: string, password: string) => {
    // Envoyer les identifiants au serveur
    const response = await fetch("https://ton-api.example.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error("Identifiants incorrects");
    }

    const data = await response.json();
    // Le serveur retourne un objet avec le token
    const receivedToken = data.token;

    // Stocker le token dans SecureStore (chiffré) et pas dans AsyncStorage
    await SecureStore.setItemAsync("auth_token", receivedToken);
    // Mettre à jour l'état pour déclencher le re-rendu
    setToken(receivedToken);
  };

  // Déconnexion : supprimer le token du stockage chiffré
  const logout = async () => {
    await SecureStore.deleteItemAsync("auth_token");
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personnalisé pour utiliser l'authentification
export function useAuth() {
  return useContext(AuthContext);
}
```

Afficher un écran différent selon l'état de connexion :

```tsx
// App.tsx
import { ActivityIndicator, View } from "react-native";
import { AuthProvider, useAuth } from "./context/AuthContext";
import LoginScreen from "./screens/LoginScreen";
import HomeScreen from "./screens/HomeScreen";

function AppContent() {
  const { token, isLoading } = useAuth();

  // Afficher un loader pendant la vérification du token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Si pas de token, afficher l'écran de connexion
  // Sinon, afficher l'écran d'accueil
  return token ? <HomeScreen /> : <LoginScreen />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

**Résultat attendu** : au démarrage, l'application vérifie si un token existe. Si oui, elle affiche l'écran d'accueil directement. Si non, elle affiche l'écran de connexion. Après connexion réussie, le token est stocké et l'application bascule automatiquement vers l'accueil.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `fetch(url)` | Envoyer une requête GET |
| `fetch(url, { method: "POST", body: JSON.stringify(data) })` | Envoyer une requête POST |
| `response.ok` | Vérifier si le statut est 200-299 |
| `response.json()` | Convertir la réponse en objet JavaScript |
| `axios.get(url)` | Requête GET avec Axios |
| `axios.post(url, data)` | Requête POST avec Axios |
| `axios.create({ baseURL })` | Créer une instance Axios configurée |
| `npx expo install axios` | Installer Axios dans un projet Expo |

---

## Pièges fréquents

### Piège 1 : Oublier de vérifier response.ok avec fetch

**Problème** : Contrairement à Axios, `fetch` ne rejette pas la Promise pour les erreurs HTTP (404, 500). La Promise est résolue tant que le serveur répond, même avec une erreur.

**Solution** : Vérifie toujours `response.ok` avant d'utiliser les données.

```tsx
// Incorrect - pas de vérification du statut
const response = await fetch(url);
const data = await response.json(); // Peut parser une erreur 404

// Correct
const response = await fetch(url);
if (!response.ok) {
  throw new Error(`Erreur HTTP : ${response.status}`);
}
const data = await response.json();
```

### Piège 2 : Appeler l'API à chaque re-rendu

**Problème** : Sans tableau de dépendances dans `useEffect`, la requête est envoyée à chaque re-rendu du composant, créant une boucle infinie.

**Solution** : Passe un tableau de dépendances vide `[]` pour n'exécuter la requête qu'une seule fois au montage.

```tsx
// Incorrect - boucle infinie
useEffect(() => {
  fetchData();
});

// Correct - exécuté une seule fois
useEffect(() => {
  fetchData();
}, []);
```

### Piège 3 : Ne pas gérer le chargement et les erreurs

**Problème** : L'écran affiche des données vides ou crashe pendant le chargement de l'API.

**Solution** : Utilise toujours trois états : `loading`, `error` et `data`.

```tsx
const [data, setData] = useState(null);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

// Affichage conditionnel
if (loading) return <ActivityIndicator />;
if (error) return <Text>{error}</Text>;
return <FlatList data={data} />;
```

### Piège 4 : Stocker le token JWT dans useState uniquement

**Problème** : Le token est perdu quand l'application est fermée. L'utilisateur doit se reconnecter à chaque ouverture.

**Solution** : Stocke le **token JWT** dans **SecureStore** (chiffré) et dans l'état React. Au démarrage, lis le token depuis SecureStore. Réserve **AsyncStorage** au cache de données non sensibles (listes d'articles, préférences non secrètes).

---

## Checklist de validation

- Je sais envoyer une requête GET avec fetch et afficher les données
- Je sais envoyer une requête POST avec un body JSON
- Je sais gérer les trois états : chargement, erreur, données
- Je sais installer et configurer Axios avec une instance personnalisée
- Je sais utiliser les intercepteurs Axios pour ajouter un token JWT
- Je sais mettre en cache les données non sensibles de l'API avec AsyncStorage
- Je sais créer un système d'authentification JWT avec Context et SecureStore
- Je sais afficher un bandeau quand les données viennent du cache

---

## Exercice pratique

**Énoncé** : Crée une application qui affiche une liste d'articles depuis l'API JSONPlaceholder avec un cache offline.

**Indications** :

- Charge les 20 premiers articles depuis `https://jsonplaceholder.typicode.com/posts?_limit=20`
- Affiche chaque article avec son titre et les 2 premières lignes du contenu
- Au premier chargement, sauvegarde les articles dans AsyncStorage
- Aux chargements suivants, affiche d'abord le cache puis met à jour avec les données fraîches
- Ajoute un "pull-to-refresh" (tirer vers le bas pour rafraîchir)
- Affiche un bandeau jaune quand les données viennent du cache

**Résultat attendu** : une liste d'articles qui s'affiche instantanément grâce au cache, se met à jour en arrière-plan, et reste visible même en mode avion.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Post = {
  id: number;
  title: string;
  body: string;
};

const API_URL = "https://jsonplaceholder.typicode.com/posts?_limit=20";
const CACHE_KEY = "cached_posts";

export default function App() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [isFromCache, setIsFromCache] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setError(null);

      // Étape 1 : Charger depuis le cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setPosts(JSON.parse(cached));
        setIsFromCache(true);
        setLoading(false); // Afficher les données en cache immédiatement
      }

      // Étape 2 : Charger depuis l'API
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Erreur ${response.status}`);
      const data: Post[] = await response.json();

      // Étape 3 : Mettre à jour l'affichage et le cache
      setPosts(data);
      setIsFromCache(false);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(data));
    } catch (err) {
      if (posts.length === 0) {
        setError("Impossible de charger les articles. Vérifie ta connexion.");
      }
      // Si on a des données en cache, on les garde
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadPosts();
  };

  if (loading && posts.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  if (error && posts.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bandeau jaune quand les données viennent du cache */}
      {isFromCache && (
        <View style={styles.cacheBanner}>
          <Text style={styles.cacheText}>
            Mode hors ligne - tire vers le bas pour actualiser
          </Text>
        </View>
      )}

      <FlatList
        data={posts}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.body} numberOfLines={2}>
              {item.body}
            </Text>
          </View>
        )}
        onRefresh={handleRefresh}
        refreshing={refreshing}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5", paddingTop: 50 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  cacheBanner: {
    backgroundColor: "#FFF3CD",
    padding: 10,
    alignItems: "center",
  },
  cacheText: { color: "#856404", fontSize: 13 },
  errorText: { color: "#FF3B30", fontSize: 16, padding: 20, textAlign: "center" },
  list: { paddingBottom: 20 },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  title: { fontSize: 16, fontWeight: "bold", marginBottom: 6 },
  body: { fontSize: 14, color: "#666", lineHeight: 20 },
});
```

---

## Navigation

← Fiche précédente : **[Gestion de l'état et données](05-etat-donnees.md)**

→ Fiche suivante : **[Fonctionnalités natives](07-fonctionnalites-natives.md)**
