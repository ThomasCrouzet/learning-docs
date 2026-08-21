---
tags:
  - Mobile
  - Avancé
  - Pratique
description: "Projet intégrateur : créer une application mobile complète avec API backend, authentification, navigation et déploiement."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 13
cursus: "Dev Mobile"
id: "web.mobile.projet-integrateur"
course_id: "web.mobile"
content_type: "project"
order: 10
---

# 10 - Projet intégrateur

> **En bref** : Mettre en pratique toutes les compétences du cursus en créant une application mobile complète avec authentification, navigation multi-écrans, appels API, stockage local et fonctionnalités natives. Lecture estimée : 120 min.

**Projet facultatif** : Ce projet est autonome. Tu peux le réaliser, l’adapter ou le passer sans bloquer l’accès aux autres fiches.

## Prérequis

- [Build et déploiement](09-build-deploiement.md) terminée
- Toutes les fiches précédentes du cursus (01 à 09) maîtrisées
- Un environnement Expo fonctionnel avec Expo Go sur un appareil ou un simulateur

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé une application mobile complète de gestion de tâches avec : authentification JWT, navigation à onglets et pile, appels API REST, cache offline, formulaire avec validation, utilisation de la caméra et notifications de rappel.

---

## Concepts

### Qu'est-ce qu'un projet intégrateur ?

**Définition** : Un projet intégrateur est un exercice qui combine toutes les compétences acquises au cours d'un cursus dans une seule application cohérente. L'objectif est de consolider les apprentissages en résolvant des problèmes concrets qui nécessitent de combiner plusieurs techniques.

**Le problème que le projet intégrateur résout** :

Sans projet intégrateur, voici les problèmes rencontrés :

1. **Connaissances fragmentées** : chaque fiche enseigne une compétence isolée (navigation, formulaires, API), mais tu ne sais pas comment les combiner dans une application réelle.
2. **Pas de vision d'ensemble** : tu sais créer un formulaire et appeler une API séparément, mais pas comment un formulaire envoie ses données à une API qui retourne un résultat affiché dans un autre écran.
3. **Pas de pratique réaliste** : les exercices isolés ne reproduisent pas les contraintes d'une application réelle (gestion d'erreurs, navigation entre écrans, persistance des données).

**Comment le projet intégrateur résout ces problèmes** :

| Problème | Solution apportée par le projet intégrateur |
| --- | --- |
| Connaissances fragmentées | Tu relies toutes les compétences dans un projet unique |
| Pas de vision d'ensemble | Tu vois comment les différentes couches interagissent |
| Pas de pratique réaliste | Tu résous les mêmes problèmes qu'un développeur professionnel |

**Analogie concrète** : Les fiches précédentes t'ont appris à couper des légumes, cuire de la viande et préparer une sauce. Le projet intégrateur, c'est le moment de préparer un repas complet : entrée, plat et dessert, en coordonnant la cuisson de chaque élément pour que tout soit prêt en même temps.

---

### Architecture de l'application

**Définition** : L'architecture d'une application mobile définit comment le code est organisé en dossiers et fichiers, et comment les différentes parties communiquent entre elles.

L'application que tu vas créer suit cette structure :

```text
mon-app/
├── App.tsx                  # Point d'entrée, providers globaux
├── api/
│   └── client.ts           # Instance Axios configurée
├── context/
│   ├── AuthContext.tsx      # Gestion de l'authentification
│   └── TaskContext.tsx      # Gestion des tâches (état global)
├── hooks/
│   ├── useCachedFetch.ts   # Hook de cache offline
│   └── usePermission.ts    # Hook de gestion des permissions
├── navigation/
│   └── AppNavigator.tsx    # Configuration de la navigation
├── screens/
│   ├── LoginScreen.tsx     # Écran de connexion
│   ├── TaskListScreen.tsx  # Liste des tâches
│   ├── TaskDetailScreen.tsx # Détail d'une tâche
│   ├── AddTaskScreen.tsx   # Formulaire d'ajout
│   └── ProfileScreen.tsx   # Profil utilisateur
├── components/
│   ├── TaskCard.tsx        # Carte d'une tâche
│   └── EmptyState.tsx      # État vide
├── app.json                # Configuration Expo
└── eas.json                # Configuration EAS Build
```

**Correspondance avec les fiches** :

| Dossier/Fichier | Fiche correspondante |
| --- | --- |
| `screens/` | Fiche 03 - Composants de base |
| `navigation/` | Fiche 04 - Navigation |
| `context/` | Fiche 05 - Gestion de l'état |
| `api/` et `hooks/useCachedFetch.ts` | Fiche 06 - API et réseau |
| `hooks/usePermission.ts` | Fiche 07 - Fonctionnalités natives |
| `screens/AddTaskScreen.tsx` | Fiche 08 - Formulaires et validation |
| `eas.json` | Fiche 09 - Build et déploiement |

---

## Étapes pratiques

### Étape 1 : Initialiser le projet

```bash
# Créer un nouveau projet Expo
npx create-expo-app@latest task-manager --template blank-typescript

# Se déplacer dans le dossier
cd task-manager

# Installer les dépendances nécessaires
npx expo install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs react-native-screens react-native-safe-area-context

# Installer les modules complémentaires
npx expo install @react-native-async-storage/async-storage expo-secure-store axios expo-image-picker expo-notifications expo-device expo-constants
```

Créer la structure de dossiers :

```bash
mkdir -p api context hooks navigation screens components
```

---

### Étape 2 : Configurer le client API

```tsx
// api/client.ts
import axios from "axios";
// SecureStore pour lire le token JWT chiffré (pas AsyncStorage pour les données sensibles)
import * as SecureStore from "expo-secure-store";

// URL de base de l'API (utilise JSONPlaceholder pour le prototype)
const API_BASE_URL = "https://jsonplaceholder.typicode.com";

// Créer une instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Intercepteur : ajouter le token JWT à chaque requête
// Le token est lu depuis SecureStore (Keychain iOS / Keystore Android)
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur : gérer les erreurs d'authentification
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync("auth_token");
    }
    return Promise.reject(error);
  }
);

export default api;
```

---

### Étape 3 : Créer le contexte d'authentification

```tsx
// context/AuthContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
// AsyncStorage pour les données non sensibles (profil utilisateur)
import AsyncStorage from "@react-native-async-storage/async-storage";
// SecureStore pour les tokens JWT - chiffrement Keychain iOS / Keystore Android
import * as SecureStore from "expo-secure-store";

type User = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  updateAvatar: (uri: string) => void;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  updateAvatar: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Vérifier le token existant au démarrage
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // Le token JWT est dans SecureStore (chiffré)
      const savedToken = await SecureStore.getItemAsync("auth_token");
      // Les données de profil non sensibles restent dans AsyncStorage
      const savedUser = await AsyncStorage.getItem("auth_user");
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    // Simulation de connexion (remplacer par un vrai appel API)
    // En production : const response = await api.post("/auth/login", { email, password });
    if (email === "test@test.com" && password === "password") {
      const fakeToken = "jwt-token-simule-123";
      const fakeUser: User = {
        id: 1,
        name: "Jean Dupont",
        email: email,
        avatar: null,
      };

      // Token JWT dans SecureStore (chiffré) - jamais dans AsyncStorage
      await SecureStore.setItemAsync("auth_token", fakeToken);
      // Profil utilisateur (non sensible) dans AsyncStorage
      await AsyncStorage.setItem("auth_user", JSON.stringify(fakeUser));
      setToken(fakeToken);
      setUser(fakeUser);
    } else {
      throw new Error("Email ou mot de passe incorrect");
    }
  };

  const logout = async () => {
    // Supprimer le token du stockage chiffré
    await SecureStore.deleteItemAsync("auth_token");
    // Supprimer le profil du stockage standard
    await AsyncStorage.removeItem("auth_user");
    setToken(null);
    setUser(null);
  };

  const updateAvatar = (uri: string) => {
    if (user) {
      const updated = { ...user, avatar: uri };
      setUser(updated);
      AsyncStorage.setItem("auth_user", JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, updateAvatar }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
```

---

### Étape 4 : Créer le contexte des tâches avec cache

```tsx
// context/TaskContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/client";

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  description?: string;
  dueDate?: string;
  photo?: string;
};

type TaskContextType = {
  tasks: Task[];
  loading: boolean;
  isOffline: boolean;
  addTask: (task: Omit<Task, "id">) => Promise<void>;
  toggleTask: (id: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  refreshTasks: () => Promise<void>;
};

const TaskContext = createContext<TaskContextType>({
  tasks: [],
  loading: true,
  isOffline: false,
  addTask: async () => {},
  toggleTask: async () => {},
  deleteTask: async () => {},
  refreshTasks: async () => {},
});

const CACHE_KEY = "cached_tasks";

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  // Charger les tâches depuis le cache puis depuis l'API
  const loadTasks = async () => {
    try {
      // Étape 1 : Charger depuis le cache
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        setTasks(JSON.parse(cached));
        setIsOffline(false);
      }

      // Étape 2 : Charger depuis l'API
      const response = await api.get<Task[]>("/todos", {
        params: { _limit: 20, userId: 1 },
      });

      const apiTasks = response.data.map((t) => ({
        ...t,
        description: "",
        dueDate: undefined,
        photo: undefined,
      }));

      setTasks(apiTasks);
      setIsOffline(false);
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(apiTasks));
    } catch {
      // En cas d'erreur réseau, on garde les données du cache
      setIsOffline(true);
    } finally {
      setLoading(false);
    }
  };

  // Ajouter une tâche
  const addTask = async (taskData: Omit<Task, "id">) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now(), // ID temporaire côté client
    };

    const updated = [newTask, ...tasks];
    setTasks(updated);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));

    // Tenter l'envoi à l'API (en arrière-plan)
    try {
      await api.post("/todos", {
        title: taskData.title,
        completed: taskData.completed,
        userId: 1,
      });
    } catch {
      // Si hors ligne, la tâche reste dans le cache local
      console.log("Sauvegarde locale uniquement (hors ligne)");
    }
  };

  // Basculer l'état d'une tâche
  const toggleTask = async (id: number) => {
    const updated = tasks.map((t) =>
      t.id === id ? { ...t, completed: !t.completed } : t
    );
    setTasks(updated);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  };

  // Supprimer une tâche
  const deleteTask = async (id: number) => {
    const updated = tasks.filter((t) => t.id !== id);
    setTasks(updated);
    await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updated));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        loading,
        isOffline,
        addTask,
        toggleTask,
        deleteTask,
        refreshTasks: loadTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  return useContext(TaskContext);
}
```

---

### Étape 5 : Créer l'écran de connexion

```tsx
// screens/LoginScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function LoginScreen() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Erreur", "Remplis tous les champs.");
      return;
    }

    try {
      setLoading(true);
      await login(email.trim(), password);
      // Si la connexion réussit, le navigateur bascule automatiquement
    } catch (err) {
      Alert.alert(
        "Connexion échouée",
        err instanceof Error ? err.message : "Vérifie tes identifiants."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.inner}>
        <Text style={styles.title}>Task Manager</Text>
        <Text style={styles.subtitle}>Connecte-toi pour continuer</Text>

        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />

        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Mot de passe"
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="go"
          onSubmitEditing={handleLogin}
        />

        <Pressable
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleLogin}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Se connecter</Text>
          )}
        </Pressable>

        <Text style={styles.hint}>
          Pour tester : `test@test.com` / password
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  inner: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
    color: "#007AFF",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  hint: {
    textAlign: "center",
    color: "#999",
    fontSize: 13,
    marginTop: 16,
  },
});
```

---

### Étape 6 : Créer la liste des tâches

```tsx
// screens/TaskListScreen.tsx
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useTasks, Task } from "../context/TaskContext";

// Composant carte de tâche
function TaskCard({ task, onToggle }: { task: Task; onToggle: () => void }) {
  const navigation = useNavigation<any>();

  return (
    <Pressable
      style={styles.card}
      onPress={() => navigation.navigate("TaskDetail", { taskId: task.id })}
    >
      {/* Checkbox */}
      <Pressable style={styles.checkbox} onPress={onToggle}>
        <Text style={styles.checkboxIcon}>
          {task.completed ? "✅" : "⬜"}
        </Text>
      </Pressable>

      {/* Contenu */}
      <View style={styles.cardContent}>
        <Text
          style={[styles.cardTitle, task.completed && styles.cardTitleDone]}
          numberOfLines={1}
        >
          {task.title}
        </Text>
        {task.dueDate && (
          <Text style={styles.cardDate}>{task.dueDate}</Text>
        )}
      </View>

      {/* Indicateur photo */}
      {task.photo && <Text style={styles.photoIcon}>📷</Text>}

      {/* Chevron */}
      <Text style={styles.chevron}>›</Text>
    </Pressable>
  );
}

export default function TaskListScreen() {
  const { tasks, loading, isOffline, toggleTask, refreshTasks } = useTasks();
  const navigation = useNavigation<any>();

  // Séparer les tâches en cours et terminées
  const pendingTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Bandeau offline */}
      {isOffline && (
        <View style={styles.offlineBanner}>
          <Text style={styles.offlineText}>
            Mode hors ligne - tire vers le bas pour synchroniser
          </Text>
        </View>
      )}

      <FlatList
        data={[...pendingTasks, ...completedTasks]}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <TaskCard
            task={item}
            onToggle={() => toggleTask(item.id)}
          />
        )}
        onRefresh={refreshTasks}
        refreshing={loading}
        ListHeaderComponent={
          <Text style={styles.counter}>
            {pendingTasks.length} tâche{pendingTasks.length !== 1 ? "s" : ""} en cours
          </Text>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📋</Text>
            <Text style={styles.emptyText}>Aucune tâche</Text>
            <Text style={styles.emptyHint}>
              Appuie sur + pour ajouter ta première tâche
            </Text>
          </View>
        }
        contentContainerStyle={styles.list}
      />

      {/* Bouton flottant d'ajout */}
      <Pressable
        style={styles.fab}
        onPress={() => navigation.navigate("AddTask")}
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f5f5f5" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  offlineBanner: {
    backgroundColor: "#FFF3CD",
    padding: 8,
    alignItems: "center",
  },
  offlineText: { color: "#856404", fontSize: 13 },
  counter: {
    fontSize: 14,
    color: "#666",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  list: { paddingBottom: 80 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    marginHorizontal: 16,
    marginTop: 6,
    borderRadius: 10,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  checkbox: { marginRight: 12 },
  checkboxIcon: { fontSize: 22 },
  cardContent: { flex: 1 },
  cardTitle: { fontSize: 16, color: "#333" },
  cardTitleDone: {
    textDecorationLine: "line-through",
    color: "#999",
  },
  cardDate: { fontSize: 13, color: "#999", marginTop: 2 },
  photoIcon: { fontSize: 16, marginRight: 8 },
  chevron: { fontSize: 24, color: "#ccc" },
  empty: { alignItems: "center", marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 18, fontWeight: "600", color: "#999" },
  emptyHint: { fontSize: 14, color: "#bbb", marginTop: 4 },
  fab: {
    position: "absolute",
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  fabText: { color: "#fff", fontSize: 28, fontWeight: "bold" },
});
```

---

### Étape 7 : Créer le formulaire d'ajout avec photo et rappel

```tsx
// screens/AddTaskScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker";
import * as Notifications from "expo-notifications";
import { useTasks } from "../context/TaskContext";

export default function AddTaskScreen() {
  const navigation = useNavigation();
  const { addTask } = useTasks();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [photo, setPhoto] = useState<string | null>(null);
  const [reminder, setReminder] = useState(false);

  // Validation
  const titleError = title.trim().length > 0 && title.trim().length < 3
    ? "Minimum 3 caractères"
    : null;
  const isValid = title.trim().length >= 3;

  // Prendre une photo pour la tâche
  const handlePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Active la caméra dans les réglages.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Programmer un rappel
  const scheduleReminder = async (taskTitle: string) => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel de tâche",
        body: `N'oublie pas : ${taskTitle}`,
        data: { type: "task_reminder" },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3600, // Rappel dans 1 heure
      },
    });
  };

  // Soumettre le formulaire
  const handleSubmit = async () => {
    if (!isValid) return;

    await addTask({
      title: title.trim(),
      completed: false,
      description: description.trim(),
      photo: photo || undefined,
    });

    // Programmer un rappel si demandé
    if (reminder) {
      await scheduleReminder(title.trim());
      Alert.alert("Tâche créée", "Un rappel a été programmé dans 1 heure.");
    }

    navigation.goBack();
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        {/* Titre */}
        <Text style={styles.label}>Titre de la tâche *</Text>
        <TextInput
          style={[styles.input, titleError ? styles.inputError : null]}
          value={title}
          onChangeText={setTitle}
          placeholder="Que dois-tu faire ?"
          autoFocus
        />
        {titleError && <Text style={styles.errorText}>{titleError}</Text>}

        {/* Description */}
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Détails supplémentaires..."
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />

        {/* Photo */}
        <Text style={styles.label}>Photo (optionnel)</Text>
        {photo ? (
          <Pressable onPress={handlePhoto}>
            <Image source={{ uri: photo }} style={styles.photoPreview} />
            <Text style={styles.photoHint}>Appuie pour changer</Text>
          </Pressable>
        ) : (
          <Pressable style={styles.photoButton} onPress={handlePhoto}>
            <Text style={styles.photoButtonText}>Prendre une photo</Text>
          </Pressable>
        )}

        {/* Rappel */}
        <Pressable
          style={styles.reminderRow}
          onPress={() => setReminder(!reminder)}
        >
          <Text style={styles.reminderIcon}>{reminder ? "🔔" : "🔕"}</Text>
          <Text style={styles.reminderText}>
            {reminder ? "Rappel dans 1h activé" : "Activer un rappel dans 1h"}
          </Text>
        </Pressable>

        {/* Bouton de soumission */}
        <Pressable
          style={[styles.submitButton, !isValid && styles.submitDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.submitText}>Ajouter la tâche</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, backgroundColor: "#fff" },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 4,
    backgroundColor: "#fafafa",
  },
  inputError: { borderColor: "#FF3B30" },
  textarea: { height: 100 },
  errorText: { color: "#FF3B30", fontSize: 13, marginBottom: 12 },
  photoButton: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderStyle: "dashed",
    borderRadius: 8,
    padding: 20,
    alignItems: "center",
    marginBottom: 16,
  },
  photoButtonText: { color: "#007AFF", fontSize: 16 },
  photoPreview: {
    width: "100%",
    height: 200,
    borderRadius: 8,
    marginBottom: 4,
  },
  photoHint: { color: "#999", fontSize: 13, marginBottom: 16 },
  reminderRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    marginBottom: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  reminderIcon: { fontSize: 24, marginRight: 12 },
  reminderText: { fontSize: 16, color: "#333" },
  submitButton: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
  },
  submitDisabled: { opacity: 0.5 },
  submitText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

---

### Étape 8 : Créer l'écran de profil avec photo

```tsx
// screens/ProfileScreen.tsx
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";

export default function ProfileScreen() {
  const { user, logout, updateAvatar } = useAuth();
  const { tasks } = useTasks();

  // Statistiques
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const completionRate = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  // Changer la photo de profil
  const handleChangeAvatar = async () => {
    const { status } =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Active l'accès aux photos.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      updateAvatar(result.assets[0].uri);
    }
  };

  // Confirmer la déconnexion
  const handleLogout = () => {
    Alert.alert(
      "Déconnexion",
      "Es-tu sûr de vouloir te déconnecter ?",
      [
        { text: "Annuler", style: "cancel" },
        { text: "Déconnexion", style: "destructive", onPress: logout },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Avatar */}
      <Pressable onPress={handleChangeAvatar}>
        {user?.avatar ? (
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarInitial}>
              {user?.name?.charAt(0) || "?"}
            </Text>
          </View>
        )}
      </Pressable>
      <Text style={styles.changePhotoText}>Changer la photo</Text>

      {/* Informations */}
      <Text style={styles.name}>{user?.name}</Text>
      <Text style={styles.email}>{user?.email}</Text>

      {/* Statistiques */}
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{totalTasks}</Text>
          <Text style={styles.statLabel}>Total</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completedTasks}</Text>
          <Text style={styles.statLabel}>Terminées</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statNumber}>{completionRate}%</Text>
          <Text style={styles.statLabel}>Taux</Text>
        </View>
      </View>

      {/* Déconnexion */}
      <Pressable style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Se déconnecter</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 24,
    paddingTop: 40,
    backgroundColor: "#fff",
  },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarInitial: { color: "#fff", fontSize: 40, fontWeight: "bold" },
  changePhotoText: { color: "#007AFF", fontSize: 14, marginTop: 8 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 16 },
  email: { fontSize: 16, color: "#666", marginTop: 4 },
  statsRow: {
    flexDirection: "row",
    marginTop: 32,
    gap: 24,
  },
  statBox: { alignItems: "center" },
  statNumber: { fontSize: 28, fontWeight: "bold", color: "#007AFF" },
  statLabel: { fontSize: 14, color: "#999", marginTop: 4 },
  logoutButton: {
    marginTop: 48,
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
    width: "100%",
    alignItems: "center",
  },
  logoutText: { color: "#FF3B30", fontSize: 16, fontWeight: "600" },
});
```

---

### Étape 9 : Assembler la navigation

```tsx
// navigation/AppNavigator.tsx
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Text } from "react-native";

import TaskListScreen from "../screens/TaskListScreen";
import AddTaskScreen from "../screens/AddTaskScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Pile de navigation pour les tâches
function TaskStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TaskList"
        component={TaskListScreen}
        options={{ title: "Mes tâches" }}
      />
      <Stack.Screen
        name="AddTask"
        component={AddTaskScreen}
        options={{ title: "Nouvelle tâche", presentation: "modal" }}
      />
    </Stack.Navigator>
  );
}

// Navigation à onglets
export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: "#007AFF",
        headerShown: false,
      }}
    >
      <Tab.Screen
        name="TasksTab"
        component={TaskStack}
        options={{
          tabBarLabel: "Tâches",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>📋</Text>
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          headerShown: true,
          title: "Profil",
          tabBarIcon: ({ color }) => (
            <Text style={{ color, fontSize: 20 }}>👤</Text>
          ),
        }}
      />
    </Tab.Navigator>
  );
}
```

---

### Étape 10 : Assembler l'application

```tsx
// App.tsx
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as Notifications from "expo-notifications";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { TaskProvider } from "./context/TaskContext";
import AppNavigator from "./navigation/AppNavigator";
import LoginScreen from "./screens/LoginScreen";

// Configurer les notifications au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // SDK 53+ : shouldShowAlert est remplacé par shouldShowBanner + shouldShowList
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

function AppContent() {
  const { token, isLoading } = useAuth();

  // Écran de chargement pendant la vérification du token
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  // Si non connecté, afficher la page de connexion
  if (!token) {
    return <LoginScreen />;
  }

  // Si connecté, afficher l'application avec la navigation
  return (
    <TaskProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </TaskProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
```

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npx create-expo-app@latest nom --template blank-typescript` | Créer un nouveau projet Expo TypeScript |
| `npx expo start` | Démarrer le serveur de développement |
| `npx expo start --clear` | Démarrer en vidant le cache |
| `eas build --platform android --profile preview` | Build Android de test |
| `eas build --platform all --profile production` | Build production |
| `eas update --channel production --message "description"` | Mise à jour OTA |

---

## Pièges fréquents

### Piège 1 : Ordre des Providers dans App.tsx

**Problème** : Les Context Providers doivent être dans le bon ordre. Si `TaskProvider` est en dehors de `AuthProvider`, il ne peut pas accéder au token d'authentification.

**Solution** : Place les Providers du plus global au plus spécifique. `AuthProvider` englobe tout car l'authentification est nécessaire partout.

```tsx
// Correct
<AuthProvider>
  <TaskProvider>
    <NavigationContainer>
      {/* ... */}
    </NavigationContainer>
  </TaskProvider>
</AuthProvider>
```

### Piège 2 : Ne pas gérer l'état de chargement initial

**Problème** : L'application flashe brièvement sur l'écran de connexion avant de vérifier si un token existe, même si l'utilisateur est déjà connecté.

**Solution** : Affiche un écran de chargement pendant la vérification du token dans `AuthContext`.

### Piège 3 : Navigation imbriquée mal configurée

**Problème** : Les écrans modaux (comme AddTask) ne s'ouvrent pas correctement ou n'ont pas de bouton de fermeture.

**Solution** : Utilise `presentation: "modal"` dans les options du Stack.Screen et vérifie que le Stack est bien imbriqué dans le Tab.Navigator.

### Piège 4 : Oublier de sauvegarder le cache après modification

**Problème** : Les tâches ajoutées ou modifiées disparaissent quand l'application est relancée car elles ne sont pas persistées.

**Solution** : Après chaque modification du tableau de tâches (`addTask`, `toggleTask`, `deleteTask`), sauvegarde dans AsyncStorage.

---

## Checklist de validation

- L'application démarre sur un écran de connexion
- La connexion avec `test@test.com` / password fonctionne
- Après connexion, les tâches sont chargées depuis l'API
- La navigation à onglets fonctionne (Tâches et Profil)
- Le bouton + ouvre le formulaire d'ajout en modal
- Le formulaire valide le titre (minimum 3 caractères)
- La photo optionnelle fonctionne avec la caméra
- Le rappel programme une notification
- Les tâches persistent après fermeture de l'application
- Le profil affiche les statistiques et permet de changer la photo
- La déconnexion ramène à l'écran de connexion
- Le mode offline affiche les données en cache

---

## Exercice pratique

**Énoncé** : Ajoute les fonctionnalités suivantes à l'application Task Manager.

**Indications** :

- Un écran de détail de tâche (`TaskDetailScreen`) accessible en tapant sur une tâche dans la liste. Cet écran affiche le titre, la description, la photo (si elle existe) et permet de supprimer la tâche
- Un système de filtrage sur l'écran de liste : afficher toutes les tâches, uniquement les tâches en cours ou uniquement les tâches terminées (utilise des boutons de filtre en haut de la liste)
- La possibilité de modifier une tâche existante en tapant sur un bouton "Modifier" dans l'écran de détail

**Résultat attendu** : une application de gestion de tâches complète avec navigation, CRUD complet, filtrage et fonctionnalités natives.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Écran de détail** :

```tsx
// screens/TaskDetailScreen.tsx
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useTasks } from "../context/TaskContext";

export default function TaskDetailScreen() {
  const route = useRoute<any>();
  const navigation = useNavigation();
  const { tasks, toggleTask, deleteTask } = useTasks();

  const task = tasks.find((t) => t.id === route.params.taskId);

  if (!task) {
    return (
      <View style={styles.center}>
        <Text>Tâche introuvable</Text>
      </View>
    );
  }

  const handleDelete = () => {
    Alert.alert(
      "Supprimer",
      `Supprimer "${task.title}" ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: async () => {
            await deleteTask(task.id);
            navigation.goBack();
          },
        },
      ]
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Statut */}
      <Pressable
        style={styles.statusRow}
        onPress={() => toggleTask(task.id)}
      >
        <Text style={styles.statusIcon}>
          {task.completed ? "✅" : "⬜"}
        </Text>
        <Text style={styles.statusText}>
          {task.completed ? "Terminée" : "En cours"}
        </Text>
      </Pressable>

      {/* Titre */}
      <Text style={styles.title}>{task.title}</Text>

      {/* Description */}
      {task.description ? (
        <Text style={styles.description}>{task.description}</Text>
      ) : (
        <Text style={styles.noDescription}>Pas de description</Text>
      )}

      {/* Photo */}
      {task.photo && (
        <Image source={{ uri: task.photo }} style={styles.photo} />
      )}

      {/* Bouton supprimer */}
      <Pressable style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Supprimer cette tâche</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  container: { padding: 20, backgroundColor: "#fff" },
  statusRow: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  statusIcon: { fontSize: 24, marginRight: 8 },
  statusText: { fontSize: 16, color: "#666" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 12 },
  description: { fontSize: 16, color: "#333", lineHeight: 24, marginBottom: 16 },
  noDescription: { fontSize: 16, color: "#999", fontStyle: "italic", marginBottom: 16 },
  photo: { width: "100%", height: 250, borderRadius: 12, marginBottom: 24 },
  deleteButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#FF3B30",
    alignItems: "center",
    marginTop: 16,
  },
  deleteText: { color: "#FF3B30", fontSize: 16, fontWeight: "600" },
});
```

Ajouter l'écran dans la navigation (`navigation/AppNavigator.tsx`) :

```tsx
// Ajouter dans le TaskStack
<Stack.Screen
  name="TaskDetail"
  component={TaskDetailScreen}
  options={{ title: "Détail" }}
/>
```

**Filtre sur la liste** : ajouter en haut de `TaskListScreen`, avant la `FlatList` :

```tsx
const [filter, setFilter] = useState<"all" | "pending" | "done">("all");

const filteredTasks = tasks.filter((t) => {
  if (filter === "pending") return !t.completed;
  if (filter === "done") return t.completed;
  return true;
});

// Ajouter avant la FlatList
<View style={styles.filterRow}>
  {(["all", "pending", "done"] as const).map((f) => (
    <Pressable
      key={f}
      style={[styles.filterButton, filter === f && styles.filterActive]}
      onPress={() => setFilter(f)}
    >
      <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
        {f === "all" ? "Toutes" : f === "pending" ? "En cours" : "Terminées"}
      </Text>
    </Pressable>
  ))}
</View>
```

---

## Navigation

← Fiche précédente : **[Build et déploiement](09-build-deploiement.md)**

→ Fiche suivante : **[11 - Tests en React Native](11-tests-react-native.md)**
