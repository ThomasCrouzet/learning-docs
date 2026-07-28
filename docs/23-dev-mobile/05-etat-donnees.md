---
tags:
  - Mobile
  - Intermédiaire
  - Pratique
description: "Gérer l'état et les données dans une application React Native avec useState, useContext et AsyncStorage."
estimated_time: "60 min"
fiche_number: 5
total_fiches: 13
cursus: "Dev Mobile"
---

# 05 - Gestion de l'état et données

> **En bref** : Apprendre à gérer l'état local avec useState, l'état global avec useContext et le stockage persistant avec AsyncStorage. Lecture estimée : 60 min.

## Prérequis

- [Navigation](04-navigation.md) terminée
- Connaître les hooks React `useState` et `useContext`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras gérer l'état local d'un composant, partager un état global entre plusieurs écrans et stocker des données de façon persistante sur l'appareil mobile.

---

## Concepts

### Qu'est-ce que l'état dans une application mobile ?

**Définition** : L'état (state) est l'ensemble des données qui peuvent changer au cours de l'utilisation de l'application et qui influencent l'affichage. Quand l'état change, React Native re-rend automatiquement les composants concernés.

**Le problème que la gestion d'état résout** :

Sans gestion d'état structurée, voici les problèmes rencontrés :

1. **Données désynchronisées** : quand l'utilisateur ajoute un favori sur un écran, les autres écrans ne le savent pas.
2. **Perte de données** : quand l'utilisateur ferme l'application, toutes les données saisies (préférences, panier, brouillons) disparaissent.
3. **Prop drilling** : passer des données à travers 5 niveaux de composants pour atteindre un composant enfant profond.

**Comment la gestion d'état résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Données désynchronisées | `useContext` partage un état global accessible par tous les écrans |
| Perte de données | `AsyncStorage` persiste les données sur le téléphone |
| Prop drilling | Le Context fournit les données sans les passer manuellement |

**Analogie concrète** : L'état d'une application mobile, c'est comme le tableau de bord d'une voiture. L'état local (`useState`), c'est le compteur de vitesse - il ne concerne que le conducteur. L'état global (`useContext`), c'est la radio - tous les passagers entendent la même musique. Le stockage persistant (`AsyncStorage`), c'est la mémoire des stations préférées - elles sont conservées même quand tu éteins la voiture.

---

### Qu'est-ce qu'AsyncStorage ?

**Définition** : AsyncStorage est un système de stockage clé-valeur asynchrone, non chiffré, persistant et global à l'application. C'est l'équivalent mobile de `localStorage` dans un navigateur web.

**Le problème qu'AsyncStorage résout** :

Sans stockage persistant, voici les problèmes rencontrés :

1. **Perte au redémarrage** : les données de `useState` et `useContext` disparaissent quand l'application est fermée ou redémarrée.
2. **Préférences perdues** : les choix de l'utilisateur (thème sombre, langue, notifications) doivent être resaisis à chaque ouverture.
3. **Sessions perdues** : le token d'authentification disparaît, forçant l'utilisateur à se reconnecter.

**Comment AsyncStorage résout ces problèmes** :

| Problème | Solution apportée par AsyncStorage |
| --- | --- |
| Perte au redémarrage | Les données sont écrites sur le disque du téléphone |
| Préférences perdues | Les préférences sont lues au démarrage de l'application |
| Sessions perdues | Un jeton de session **non sensible** ou des préférences peuvent être rechargés ; pour un **JWT**, utilise SecureStore (voir fiche 06) |

**Analogie concrète** : `useState` est comme un post-it sur ton bureau - utile maintenant mais perdu si tu ranges. `AsyncStorage` est comme un carnet que tu ranges dans un tiroir - tu le retrouves quand tu reviens, même le lendemain.

**Ce qu'AsyncStorage n'est PAS** :

- AsyncStorage n'est pas une base de données. Il stocke uniquement des paires clé-valeur sous forme de chaînes de caractères. Pour des données complexes et relationnelles, utilise SQLite ou une API distante.
- AsyncStorage n'est pas chiffré. Ne stocke jamais de mots de passe en clair dans AsyncStorage. Pour les données sensibles, utilise `expo-secure-store`.
- AsyncStorage n'est pas synchrone. Toutes les opérations sont asynchrones (renvoient des Promises) et doivent utiliser `await`.

---

### Les trois niveaux de gestion d'état

**Définition** : Dans une application React Native, les données sont gérées à trois niveaux selon leur portée et leur durée de vie.

| Niveau | Outil | Portée | Durée de vie | Exemple |
| --- | --- | --- | --- | --- |
| Local | `useState` | Un seul composant | Tant que le composant est monté | Valeur d'un champ de saisie |
| Global | `useContext` | Tous les composants | Tant que l'application tourne | Utilisateur connecté, thème |
| Persistant | `AsyncStorage` | Toute l'application | Même après fermeture | Préférences, cache non sensible (pas de JWT) |

---

## Étapes pratiques

### Étape 1 : État local avec useState

Rappel rapide de `useState` appliqué au mobile :

```tsx
// CounterScreen.tsx
import { useState } from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";

export default function CounterScreen() {
  // Déclarer un état local avec une valeur initiale de 0
  const [count, setCount] = useState(0);
  // État pour le nom saisi
  const [name, setName] = useState("");

  return (
    <View style={styles.container}>
      {/* Le texte se met à jour automatiquement quand count change */}
      <Text style={styles.counter}>{count}</Text>

      <View style={styles.buttons}>
        <Pressable
          style={styles.button}
          onPress={() => setCount(count - 1)}
        >
          <Text style={styles.buttonText}>-</Text>
        </Pressable>

        <Pressable
          style={styles.button}
          onPress={() => setCount(count + 1)}
        >
          <Text style={styles.buttonText}>+</Text>
        </Pressable>
      </View>

      {/* Réinitialiser */}
      <Pressable
        style={styles.resetButton}
        onPress={() => setCount(0)}
      >
        <Text style={styles.resetText}>Réinitialiser</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  counter: {
    fontSize: 72,
    fontWeight: "bold",
    marginBottom: 24,
  },
  buttons: {
    flexDirection: "row",
    gap: 16,
  },
  button: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
  },
  resetButton: {
    marginTop: 24,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  resetText: {
    color: "#007AFF",
    fontSize: 16,
  },
});
```

**Résultat attendu** : un compteur avec des boutons + et - et un bouton de réinitialisation.

---

### Étape 2 : État global avec useContext

Crée un thème global accessible par tous les écrans :

```tsx
// context/ThemeContext.tsx
import { createContext, useContext, useState, ReactNode } from "react";

// Définir les types du thème
type Theme = {
  dark: boolean;
  colors: {
    background: string;
    text: string;
    card: string;
    primary: string;
  };
};

// Thème clair
const lightTheme: Theme = {
  dark: false,
  colors: {
    background: "#ffffff",
    text: "#000000",
    card: "#f5f5f5",
    primary: "#007AFF",
  },
};

// Thème sombre
const darkTheme: Theme = {
  dark: true,
  colors: {
    background: "#1a1a1a",
    text: "#ffffff",
    card: "#2d2d2d",
    primary: "#0A84FF",
  },
};

// Type du contexte
type ThemeContextType = {
  theme: Theme;
  toggleTheme: () => void;
};

// Créer le contexte avec une valeur par défaut
const ThemeContext = createContext<ThemeContextType>({
  theme: lightTheme,
  toggleTheme: () => {},
});

// Provider qui englobe l'application
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((prev) => !prev);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Hook personnalisé pour utiliser le thème facilement
export function useTheme() {
  return useContext(ThemeContext);
}
```

Utiliser le contexte dans les écrans :

```tsx
// App.tsx
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import { StyleSheet, Text, View, Pressable, Switch } from "react-native";

// Écran qui utilise le thème global
function HomeScreen() {
  // Récupérer le thème et la fonction de bascule depuis le contexte
  const { theme, toggleTheme } = useTheme();

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Accueil
      </Text>

      {/* Interrupteur pour changer de thème */}
      <View style={styles.row}>
        <Text style={[styles.label, { color: theme.colors.text }]}>
          Mode sombre
        </Text>
        <Switch
          value={theme.dark}
          onValueChange={toggleTheme}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      {/* Carte qui utilise les couleurs du thème */}
      <View style={[styles.card, { backgroundColor: theme.colors.card }]}>
        <Text style={{ color: theme.colors.text }}>
          Cette carte s'adapte au thème actuel.
        </Text>
      </View>
    </View>
  );
}

// Application englobée dans le ThemeProvider
export default function App() {
  return (
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
  },
  card: {
    padding: 16,
    borderRadius: 12,
  },
});
```

**Résultat attendu** : un écran avec un interrupteur. Quand tu actives le mode sombre, le fond, le texte et la carte changent de couleurs instantanément.

---

### Étape 3 : Stockage persistant avec AsyncStorage

Installe AsyncStorage et persiste les données :

```bash
# Installer AsyncStorage
npx expo install @react-native-async-storage/async-storage
```

```tsx
// screens/SettingsScreen.tsx
import { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  TextInput,
  Pressable,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function SettingsScreen() {
  // États locaux initialisés depuis AsyncStorage au démarrage
  const [username, setUsername] = useState("");
  const [notifications, setNotifications] = useState(true);
  const [loading, setLoading] = useState(true);

  // Charger les données sauvegardées au montage du composant
  useEffect(() => {
    loadSettings();
  }, []);

  // Lire les données depuis AsyncStorage
  const loadSettings = async () => {
    try {
      // Lire plusieurs clés en une seule opération
      const values = await AsyncStorage.multiGet([
        "username",
        "notifications",
      ]);

      // values est un tableau de paires [clé, valeur]
      const savedUsername = values[0][1]; // Première paire, valeur
      const savedNotifications = values[1][1];

      if (savedUsername !== null) {
        setUsername(savedUsername);
      }
      if (savedNotifications !== null) {
        setNotifications(savedNotifications === "true");
      }
    } catch (error) {
      console.error("Erreur de lecture AsyncStorage:", error);
    } finally {
      setLoading(false); // Fin du chargement
    }
  };

  // Sauvegarder une valeur dans AsyncStorage
  const saveUsername = async (value: string) => {
    try {
      setUsername(value);
      // AsyncStorage ne stocke que des chaînes de caractères
      await AsyncStorage.setItem("username", value);
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
    }
  };

  // Basculer les notifications
  const toggleNotifications = async (value: boolean) => {
    try {
      setNotifications(value);
      // Convertir le booléen en chaîne pour le stockage
      await AsyncStorage.setItem("notifications", String(value));
    } catch (error) {
      console.error("Erreur de sauvegarde:", error);
    }
  };

  // Supprimer toutes les données sauvegardées
  const clearAll = async () => {
    try {
      await AsyncStorage.clear();
      setUsername("");
      setNotifications(true);
      Alert.alert("Terminé", "Toutes les données ont été effacées.");
    } catch (error) {
      console.error("Erreur de suppression:", error);
    }
  };

  // Afficher un indicateur de chargement pendant la lecture
  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Chargement des paramètres...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Paramètres</Text>

      {/* Champ de saisie pour le nom */}
      <Text style={styles.label}>Nom d'utilisateur</Text>
      <TextInput
        style={styles.input}
        value={username}
        onChangeText={saveUsername}
        placeholder="Entrez votre nom"
      />

      {/* Interrupteur pour les notifications */}
      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notifications}
          onValueChange={toggleNotifications}
        />
      </View>

      {/* Bouton de réinitialisation */}
      <Pressable style={styles.clearButton} onPress={clearAll}>
        <Text style={styles.clearText}>Effacer toutes les données</Text>
      </Pressable>

      {/* Affichage des valeurs actuelles */}
      <View style={styles.debugBox}>
        <Text style={styles.debugTitle}>Valeurs stockées :</Text>
        <Text style={styles.debugText}>username: "{username}"</Text>
        <Text style={styles.debugText}>
          notifications: {String(notifications)}
        </Text>
      </View>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
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
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  clearButton: {
    padding: 12,
    alignItems: "center",
  },
  clearText: {
    color: "#FF3B30",
    fontSize: 16,
  },
  debugBox: {
    marginTop: 24,
    padding: 16,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },
  debugTitle: {
    fontWeight: "bold",
    marginBottom: 8,
  },
  debugText: {
    fontFamily: "monospace",
    fontSize: 14,
    color: "#666",
  },
});
```

**Résultat attendu** : un écran de paramètres. Le nom saisi et l'état des notifications sont sauvegardés. Ferme et rouvre l'application : les données sont toujours là.

---

### Étape 4 : Stocker des objets complexes

AsyncStorage ne stocke que des chaînes. Pour les objets, utilise `JSON.stringify` et `JSON.parse` :

```tsx
// Sauvegarder un objet
const saveUser = async (user: { name: string; email: string; age: number }) => {
  try {
    // Convertir l'objet en chaîne JSON
    const jsonValue = JSON.stringify(user);
    await AsyncStorage.setItem("user", jsonValue);
  } catch (error) {
    console.error("Erreur:", error);
  }
};

// Lire un objet
const loadUser = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem("user");
    // Convertir la chaîne JSON en objet (null si pas de données)
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (error) {
    console.error("Erreur:", error);
    return null;
  }
};

// Sauvegarder un tableau
const saveFavorites = async (favorites: string[]) => {
  try {
    await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
  } catch (error) {
    console.error("Erreur:", error);
  }
};
```

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `AsyncStorage.setItem("clé", "valeur")` | Sauvegarder une valeur |
| `AsyncStorage.getItem("clé")` | Lire une valeur |
| `AsyncStorage.removeItem("clé")` | Supprimer une valeur |
| `AsyncStorage.multiGet(["a", "b"])` | Lire plusieurs valeurs |
| `AsyncStorage.clear()` | Supprimer toutes les données |
| `JSON.stringify(objet)` | Convertir un objet en chaîne |
| `JSON.parse(chaîne)` | Convertir une chaîne en objet |

---

## Pièges fréquents

### Piège 1 : Oublier le await avec AsyncStorage

**Problème** : Les opérations AsyncStorage sont asynchrones. Sans `await`, la valeur lue est une Promise, pas la donnée.

**Solution** : Utilise toujours `await` avec les méthodes AsyncStorage.

```tsx
// Incorrect - retourne une Promise
const value = AsyncStorage.getItem("key");
console.log(value); // Promise { <pending> }

// Correct
const value = await AsyncStorage.getItem("key");
console.log(value); // "la valeur"
```

### Piège 2 : Stocker un objet sans JSON.stringify

**Problème** : AsyncStorage ne stocke que des chaînes. Passer un objet directement le convertit en `"[object Object]"`.

**Solution** : Utilise `JSON.stringify` pour sauvegarder et `JSON.parse` pour lire.

```tsx
// Incorrect - stocke "[object Object]"
await AsyncStorage.setItem("user", { name: "Marie" });

// Correct
await AsyncStorage.setItem("user", JSON.stringify({ name: "Marie" }));
```

### Piège 3 : Pas de gestion du chargement initial

**Problème** : L'écran s'affiche avec des valeurs vides avant que AsyncStorage ait fini de charger les données.

**Solution** : Utilise un état `loading` pour afficher un indicateur pendant le chargement.

```tsx
const [loading, setLoading] = useState(true);

useEffect(() => {
  loadData().finally(() => setLoading(false));
}, []);

if (loading) return <ActivityIndicator />;
```

---

## Checklist de validation

- Je sais utiliser `useState` pour gérer l'état local d'un composant
- Je sais créer un Context avec `createContext` et `useContext`
- Je sais créer un Provider qui englobe l'application
- J'ai installé AsyncStorage et je sais lire/écrire des données
- Je sais stocker des objets complexes avec `JSON.stringify`/`JSON.parse`
- Je gère l'état de chargement pendant la lecture d'AsyncStorage
- Je comprends la différence entre état local, global et persistant

---

## Exercice pratique

**Énoncé** : Crée une application de liste de tâches persistante.

**Indications** :

- Un champ de saisie pour ajouter une tâche
- Un bouton "Ajouter" pour ajouter la tâche à la liste
- Chaque tâche peut être marquée comme terminée (texte barré)
- Un bouton pour supprimer une tâche
- La liste est sauvegardée dans AsyncStorage et rechargée au démarrage

**Résultat attendu** : une liste de tâches qui persiste même après fermeture et réouverture de l'application.

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
  TextInput,
  Pressable,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Type d'une tâche
type Task = {
  id: string;
  text: string;
  done: boolean;
};

export default function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState("");

  // Charger les tâches au démarrage
  useEffect(() => {
    loadTasks();
  }, []);

  // Sauvegarder les tâches à chaque modification
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const loadTasks = async () => {
    const json = await AsyncStorage.getItem("tasks");
    if (json) setTasks(JSON.parse(json));
  };

  const saveTasks = async (data: Task[]) => {
    await AsyncStorage.setItem("tasks", JSON.stringify(data));
  };

  // Ajouter une tâche
  const addTask = () => {
    if (input.trim() === "") return;
    const newTask: Task = {
      id: Date.now().toString(),
      text: input.trim(),
      done: false,
    };
    setTasks([newTask, ...tasks]);
    setInput("");
  };

  // Basculer l'état terminé/non terminé
  const toggleTask = (id: string) => {
    setTasks(
      tasks.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Supprimer une tâche
  const deleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mes tâches</Text>

      {/* Barre de saisie */}
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Nouvelle tâche..."
          onSubmitEditing={addTask}
        />
        <Pressable style={styles.addButton} onPress={addTask}>
          <Text style={styles.addButtonText}>+</Text>
        </Pressable>
      </View>

      {/* Liste des tâches */}
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.task}>
            <Pressable
              style={styles.taskContent}
              onPress={() => toggleTask(item.id)}
            >
              <Text style={styles.checkbox}>
                {item.done ? "✅" : "⬜"}
              </Text>
              <Text
                style={[
                  styles.taskText,
                  item.done && styles.taskDone,
                ]}
              >
                {item.text}
              </Text>
            </Pressable>
            <Pressable onPress={() => deleteTask(item.id)}>
              <Text style={styles.delete}>✕</Text>
            </Pressable>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune tâche pour le moment.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingTop: 60, paddingHorizontal: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  inputRow: { flexDirection: "row", marginBottom: 16, gap: 8 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    backgroundColor: "#007AFF",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  addButtonText: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  task: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  taskContent: { flex: 1, flexDirection: "row", alignItems: "center" },
  checkbox: { fontSize: 20, marginRight: 12 },
  taskText: { fontSize: 16, flex: 1 },
  taskDone: { textDecorationLine: "line-through", color: "#999" },
  delete: { fontSize: 18, color: "#FF3B30", padding: 8 },
  empty: { textAlign: "center", color: "#999", marginTop: 40 },
});
```

---

## Navigation

← Fiche précédente : **[Navigation](04-navigation.md)**

→ Fiche suivante : **[API et réseau](06-api-reseau.md)**
