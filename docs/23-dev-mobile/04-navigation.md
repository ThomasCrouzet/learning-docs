---
tags:
  - Mobile
  - Intermédiaire
  - Pratique
description: "Implémenter la navigation dans une application React Native avec React Navigation : Stack, Tab et Drawer."
estimated_time: "75 min"
fiche_number: 4
total_fiches: 13
cursus: "Dev Mobile"
---

# 04 - Navigation

> **En bref** : Apprendre à naviguer entre les écrans d'une application mobile avec React Navigation, en utilisant Stack, Tab et Drawer. Lecture estimée : 75 min.

## Prérequis

- [Composants de base](03-composants-base.md) terminée
- Savoir utiliser les composants View, Text, Pressable et StyleSheet

## Objectif de cette fiche

À la fin de cette fiche, tu sauras implémenter la navigation entre écrans avec React Navigation, créer une barre d'onglets, un menu latéral et passer des paramètres entre les écrans.

---

## Concepts

### Qu'est-ce que la navigation mobile ?

**Définition** : La navigation mobile est le système qui permet à l'utilisateur de se déplacer entre les différents écrans d'une application. Contrairement au web (URLs et pages), les applications mobiles utilisent une pile d'écrans (stack) qui s'empilent les uns sur les autres.

**Le problème que la navigation résout** :

Sans système de navigation, voici les problèmes rencontrés :

1. **Un seul écran** : l'application ne peut afficher qu'un seul composant à la fois, sans moyen de passer à un autre.
2. **Pas de retour arrière** : l'utilisateur ne peut pas revenir à l'écran précédent avec le geste natif (swipe sur iOS, bouton retour sur Android).
3. **Pas de structure d'application** : les patterns classiques du mobile (onglets en bas, menu latéral, pile de navigation) sont impossibles à implémenter.

**Comment la navigation résout ces problèmes** :

| Problème | Solution apportée par la navigation |
| --- | --- |
| Un seul écran | Chaque écran est un composant séparé, le navigateur gère l'affichage |
| Pas de retour arrière | La pile de navigation gère automatiquement le bouton retour et les gestes |
| Pas de structure | Stack, Tab et Drawer reproduisent les patterns natifs iOS et Android |

**Analogie concrète** : La navigation mobile fonctionne comme une pile de cartes. Quand tu ouvres un nouvel écran, une nouvelle carte est posée sur la pile. Quand tu appuies sur "retour", la carte du dessus est retirée et tu retrouves la carte précédente. Les onglets en bas, c'est comme avoir plusieurs piles de cartes côte à côte, et tu peux passer d'une pile à l'autre.

**Ce que la navigation mobile n'est PAS** :

- La navigation mobile n'est pas du routing web. Il n'y a pas d'URL dans la barre d'adresse. La navigation est gérée par des transitions animées entre des composants React.
- La navigation mobile n'est pas un simple affichage conditionnel. Un `if/else` qui affiche un composant ou un autre ne gère pas les animations, le bouton retour natif ni l'historique de navigation.

---

### Les trois types de navigation

**Définition** : React Navigation propose trois navigateurs principaux qui correspondent aux patterns de navigation standard des applications mobiles.

#### Stack Navigator (pile)

Le Stack Navigator empile les écrans les uns sur les autres. Chaque nouvel écran glisse par-dessus le précédent. L'utilisateur peut revenir en arrière avec un geste ou le bouton retour.

**Cas d'usage** : écran de liste vers écran de détail, processus en plusieurs étapes (inscription, paiement).

```text
Pile de navigation :
┌─────────────────┐
│   Écran Détail  │  ← Écran actif (au-dessus)
├─────────────────┤
│   Écran Liste   │  ← Écran précédent (en dessous)
└─────────────────┘
```

#### Tab Navigator (onglets)

Le Tab Navigator affiche une barre d'onglets en bas (ou en haut) de l'écran. Chaque onglet correspond à un écran différent. L'utilisateur peut passer d'un onglet à l'autre en appuyant dessus.

**Cas d'usage** : sections principales de l'application (Accueil, Recherche, Profil).

```text
┌─────────────────┐
│                  │
│   Contenu de     │
│   l'onglet actif │
│                  │
├─────────────────┤
│ 🏠  🔍  👤  ⚙️  │  ← Barre d'onglets
└─────────────────┘
```

#### Drawer Navigator (menu latéral)

Le Drawer Navigator affiche un menu qui coulisse depuis le bord de l'écran. L'utilisateur l'ouvre avec un geste de balayage ou un bouton hamburger.

**Cas d'usage** : menu de paramètres, navigation secondaire, applications avec beaucoup de sections.

```text
┌────────┬────────────┐
│        │            │
│ Menu   │  Contenu   │
│ latéral│  principal │
│        │            │
│ - Home │            │
│ - Profil│           │
│ - Param│            │
└────────┴────────────┘
```

**Comparaison des trois navigateurs** :

| Critère | Stack | Tab | Drawer |
| --- | --- | --- | --- |
| Position visuelle | Pas de barre visible | Barre en bas/haut | Menu latéral coulissant |
| Cas d'usage | Flux linéaire | Sections principales | Menu secondaire |
| Retour arrière | Oui (geste/bouton) | Non (bascule) | Non (bascule) |
| Combinable | Oui | Oui | Oui |

---

### Qu'est-ce que React Navigation ?

**Définition** : React Navigation est la bibliothèque de navigation la plus utilisée avec React Native. Elle fournit les navigateurs Stack, Tab et Drawer avec des animations natives et la gestion automatique du bouton retour.

**Le problème que React Navigation résout** :

Sans React Navigation, voici les problèmes rencontrés :

1. **Pas de navigation intégrée** : React Native ne fournit pas de système de navigation par défaut.
2. **Animations manuelles** : créer des transitions fluides entre les écrans nécessite du code complexe avec l'API Animated.
3. **Bouton retour Android** : le bouton retour matériel d'Android doit être géré manuellement pour chaque écran.

**Comment React Navigation résout ces problèmes** :

| Problème | Solution apportée par React Navigation |
| --- | --- |
| Pas de navigation intégrée | API déclarative pour définir les écrans et les navigateurs |
| Animations manuelles | Transitions natives iOS et Android automatiques |
| Bouton retour Android | Gestion automatique de la pile de navigation |

**Analogie concrète** : React Navigation, c'est comme le GPS d'une voiture. Sans GPS, tu dois connaître chaque route et intersection par coeur. Avec GPS (React Navigation), tu indiques ta destination (l'écran cible) et le système s'occupe de calculer le chemin, afficher les transitions et gérer le retour.

---

## Étapes pratiques

### Étape 1 : Installer React Navigation

Installe les dépendances nécessaires :

```bash
# Installer le coeur de React Navigation
npx expo install @react-navigation/native

# Installer les dépendances Expo requises
npx expo install react-native-screens react-native-safe-area-context

# Installer le Stack Navigator
npx expo install @react-navigation/native-stack

# Installer le Tab Navigator
npx expo install @react-navigation/bottom-tabs
```

**Résultat attendu** :

```text
Installing @react-navigation/native, react-native-screens, react-native-safe-area-context...
added 15 packages in 8s
```

---

### Étape 2 : Créer une navigation Stack simple

Crée deux écrans et navigue entre eux :

```tsx
// App.tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
// NativeStackScreenProps fournit les types exacts de navigation et route pour chaque écran
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View, Pressable, FlatList } from "react-native";

// Définir les types des paramètres pour chaque écran
type RootStackParamList = {
  Home: undefined; // Pas de paramètres
  Detail: { id: string; title: string }; // Paramètres attendus
};

// Typer les props de chaque écran avec NativeStackScreenProps
// Le second paramètre est le nom de l'écran dans RootStackParamList
type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;
type DetailScreenProps = NativeStackScreenProps<RootStackParamList, "Detail">;

// Créer le navigateur Stack typé
const Stack = createNativeStackNavigator<RootStackParamList>();

// Données de la liste
const ITEMS = [
  { id: "1", title: "Premier article" },
  { id: "2", title: "Deuxième article" },
  { id: "3", title: "Troisième article" },
];

// Écran d'accueil avec la liste - props correctement typées
function HomeScreen({ navigation }: HomeScreenProps) {
  return (
    <View style={styles.container}>
      <FlatList
        data={ITEMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.item}
            // TypeScript vérifie que "Detail" existe et que { id, title } correspond à RootStackParamList
            onPress={() =>
              navigation.navigate("Detail", {
                id: item.id,
                title: item.title,
              })
            }
          >
            <Text style={styles.itemTitle}>{item.title}</Text>
            <Text style={styles.arrow}>→</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

// Écran de détail - props correctement typées
// route.params est automatiquement typé comme { id: string; title: string }
function DetailScreen({ route, navigation }: DetailScreenProps) {
  // Extraire les paramètres passés par l'écran précédent
  const { id, title } = route.params;

  return (
    <View style={styles.detailContainer}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailId}>Identifiant : {id}</Text>

      {/* Bouton pour revenir en arrière */}
      <Pressable
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>Retour à la liste</Text>
      </Pressable>
    </View>
  );
}

// Composant principal avec le NavigationContainer
export default function App() {
  return (
    // NavigationContainer englobe toute la navigation
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: { backgroundColor: "#007AFF" },
          headerTintColor: "#fff", // Couleur du texte et du bouton retour
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        {/* Définition des écrans */}
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Accueil" }}
        />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          // Titre dynamique basé sur les paramètres
          options={({ route }: any) => ({ title: route.params.title })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  itemTitle: {
    fontSize: 16,
  },
  arrow: {
    fontSize: 18,
    color: "#007AFF",
  },
  detailContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  detailId: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
```

**Résultat attendu** : une liste de 3 articles. En appuyant sur un article, l'écran de détail glisse par-dessus avec une animation native. Le bouton retour dans la barre de navigation permet de revenir à la liste.

---

### Étape 3 : Ajouter des onglets (Tab Navigator)

Combine le Stack Navigator avec un Tab Navigator :

```tsx
// App.tsx - Navigation complète avec onglets
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StyleSheet, Text, View, Pressable } from "react-native";

// Créer les navigateurs
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// --- Écrans ---

// Pour un Tab imbriqué dans un Stack, les props de navigation se typent
// avec le ParamList du navigateur parent. Ici on utilise le type du Stack pour HomeScreen.
type HomeStackParamList = {
  HomeMain: undefined;
  Notifications: undefined;
};
type HomeScreenNavProps = NativeStackScreenProps<HomeStackParamList, "HomeMain">;

function HomeScreen({ navigation }: HomeScreenNavProps) {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Accueil</Text>
      <Pressable
        style={styles.button}
        onPress={() => navigation.navigate("Notifications")}
      >
        <Text style={styles.buttonText}>Voir les notifications</Text>
      </Pressable>
    </View>
  );
}

function NotificationsScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Notifications</Text>
      <Text style={styles.subtitle}>Aucune notification pour le moment.</Text>
    </View>
  );
}

function SearchScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Recherche</Text>
    </View>
  );
}

function ProfileScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Profil</Text>
    </View>
  );
}

// --- Stack pour l'onglet Accueil ---
// L'onglet Accueil contient sa propre pile de navigation
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ title: "Accueil" }} />
      <Stack.Screen name="Notifications" component={NotificationsScreen} />
    </Stack.Navigator>
  );
}

// --- Application principale ---
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#007AFF", // Couleur de l'onglet actif
          tabBarInactiveTintColor: "#999", // Couleur des onglets inactifs
          headerShown: false, // Cacher le header des tabs (le Stack a le sien)
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeStack}
          options={{
            tabBarLabel: "Accueil",
            // En production, utilise @expo/vector-icons pour les icônes
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🏠</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarLabel: "Recherche",
            headerShown: true,
            title: "Recherche",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>🔍</Text>
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Profil",
            headerShown: true,
            title: "Mon profil",
            tabBarIcon: ({ color }) => (
              <Text style={{ color, fontSize: 20 }}>👤</Text>
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
```

**Résultat attendu** : une application avec 3 onglets en bas (Accueil, Recherche, Profil). L'onglet Accueil contient sa propre pile de navigation avec un bouton vers les notifications.

---

### Étape 4 : Passer et recevoir des paramètres

Voici comment passer des données entre les écrans :

```tsx
// Naviguer vers un écran avec des paramètres
navigation.navigate("Detail", {
  id: 42,
  title: "Mon article",
  date: "2025-01-15",
});

// Récupérer les paramètres dans l'écran cible
function DetailScreen({ route }: any) {
  const { id, title, date } = route.params;

  return (
    <View>
      <Text>Article #{id} : {title}</Text>
      <Text>Publié le {date}</Text>
    </View>
  );
}

// Renvoyer des données à l'écran précédent
function EditScreen({ navigation, route }: any) {
  const save = () => {
    // Revenir en arrière en passant des données
    navigation.navigate("Detail", {
      ...route.params,
      updated: true,
    });
  };

  return (
    <Pressable onPress={save}>
      <Text>Sauvegarder</Text>
    </Pressable>
  );
}
```

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `navigation.navigate("Screen")` | Naviguer vers un écran |
| `navigation.navigate("Screen", { id: 1 })` | Naviguer avec des paramètres |
| `navigation.goBack()` | Revenir à l'écran précédent |
| `navigation.reset({ routes: [...] })` | Réinitialiser la pile de navigation |
| `route.params` | Accéder aux paramètres de l'écran actuel |
| `navigation.setOptions({ title: "..." })` | Modifier le titre dynamiquement |

---

## Pièges fréquents

### Piège 1 : NavigationContainer manquant

**Problème** : L'application crash avec l'erreur "Couldn't find a navigation object".

**Solution** : Tout navigateur doit être englobé dans un `<NavigationContainer>` unique, placé au plus haut niveau de l'application.

```tsx
// Incorrect - NavigationContainer manquant
export default function App() {
  return <Stack.Navigator>...</Stack.Navigator>;
}

// Correct
export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>...</Stack.Navigator>
    </NavigationContainer>
  );
}
```

### Piège 2 : navigate vs push

**Problème** : Appeler `navigation.navigate("Detail")` une deuxième fois ne crée pas un nouvel écran si l'écran "Détail" existe déjà dans la pile.

**Solution** : Utilise `navigation.push("Detail")` pour forcer l'ajout d'un nouvel écran dans la pile, même si un écran du même nom existe déjà.

```tsx
// navigate : réutilise l'écran existant
navigation.navigate("Detail", { id: 2 });

// push : crée toujours un nouvel écran dans la pile
navigation.push("Detail", { id: 2 });
```

### Piège 3 : Typer les props de navigation avec `any`

⚠️ **Problème** : Typer les props de navigation avec `any` désactive la vérification TypeScript. Les erreurs de typage (mauvais nom d'écran, paramètre manquant) ne sont pas détectées avant l'exécution.

```tsx
// ❌ TypeScript ne vérifie rien : une faute de frappe dans "Detaill" n'est pas détectée
function HomeScreen({ navigation }: any) {
  navigation.navigate("Detaill"); // Pas d'erreur TypeScript, crash à l'exécution
}
```

✅ **Solution** : Utilise `NativeStackScreenProps` avec ton `ParamList` :

```tsx
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
  Detail: { id: string };
};

type HomeScreenProps = NativeStackScreenProps<RootStackParamList, "Home">;

function HomeScreen({ navigation }: HomeScreenProps) {
  // TypeScript vérifie que "Detail" existe dans RootStackParamList
  navigation.navigate("Detail", { id: "42" }); // OK
  // navigation.navigate("Detaill");          // Erreur TypeScript immédiate
}
```

---

### Piège 4 : Imbriquer les navigateurs sans headerShown

**Problème** : Quand un Stack est imbriqué dans un Tab, deux barres de navigation apparaissent (celle du Tab et celle du Stack).

**Solution** : Désactive le header du Tab avec `headerShown: false` :

```tsx
<Tab.Navigator screenOptions={{ headerShown: false }}>
  <Tab.Screen name="Home" component={HomeStack} />
</Tab.Navigator>
```

---

## Checklist de validation

- J'ai installé React Navigation et ses dépendances avec `npx expo install`
- Je sais créer un Stack Navigator avec plusieurs écrans
- Je sais naviguer entre les écrans avec `navigation.navigate()`
- Je sais passer des paramètres entre les écrans
- Je sais créer une barre d'onglets avec Tab Navigator
- Je sais imbriquer un Stack dans un Tab
- Je comprends la différence entre `navigate` et `push`

---

## Exercice pratique

**Énoncé** : Crée une application avec 3 onglets (Accueil, Favoris, Paramètres) et un écran de détail accessible depuis l'Accueil.

**Indications** :

- Crée un Tab Navigator avec 3 onglets
- L'onglet Accueil contient un Stack avec une liste de 5 éléments
- Chaque élément de la liste navigue vers un écran de détail avec le titre en paramètre
- L'écran de détail affiche le titre reçu en paramètre
- Les onglets Favoris et Paramètres affichent un simple texte

**Résultat attendu** : une application avec 3 onglets en bas. L'onglet Accueil affiche une liste. Un tap sur un élément ouvre l'écran de détail avec le titre correspondant.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { StyleSheet, Text, View, Pressable, FlatList } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Données de la liste
const ELEMENTS = [
  { id: "1", title: "Apprendre React Native" },
  { id: "2", title: "Créer une application" },
  { id: "3", title: "Publier sur les stores" },
  { id: "4", title: "Gérer les notifications" },
  { id: "5", title: "Optimiser les performances" },
];

// Écran liste dans l'onglet Accueil
function ListScreen({ navigation }: any) {
  return (
    <FlatList
      style={styles.list}
      data={ELEMENTS}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <Pressable
          style={styles.listItem}
          onPress={() => navigation.navigate("Detail", { title: item.title })}
        >
          <Text style={styles.listItemText}>{item.title}</Text>
          <Text style={styles.chevron}>›</Text>
        </Pressable>
      )}
    />
  );
}

// Écran de détail
function DetailScreen({ route }: any) {
  const { title } = route.params;
  return (
    <View style={styles.center}>
      <Text style={styles.detailTitle}>{title}</Text>
      <Text style={styles.detailSub}>Contenu de la page détail</Text>
    </View>
  );
}

// Stack pour l'onglet Accueil
function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="List" component={ListScreen} options={{ title: "Accueil" }} />
      <Stack.Screen
        name="Detail"
        component={DetailScreen}
        options={({ route }: any) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
}

// Écrans simples pour les autres onglets
function FavoritesScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.tabTitle}>Favoris</Text>
      <Text style={styles.tabSub}>Aucun favori pour le moment.</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View style={styles.center}>
      <Text style={styles.tabTitle}>Paramètres</Text>
      <Text style={styles.tabSub}>Version 1.0.0</Text>
    </View>
  );
}

// Application
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#007AFF" }}>
        <Tab.Screen
          name="HomeTab"
          component={HomeStack}
          options={{
            tabBarLabel: "Accueil",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏠</Text>,
          }}
        />
        <Tab.Screen
          name="Favorites"
          component={FavoritesScreen}
          options={{
            headerShown: true,
            title: "Favoris",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⭐</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            headerShown: true,
            title: "Paramètres",
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  list: { flex: 1, backgroundColor: "#f5f5f5" },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 8,
  },
  listItemText: { fontSize: 16 },
  chevron: { fontSize: 24, color: "#ccc" },
  detailTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  detailSub: { fontSize: 16, color: "#666" },
  tabTitle: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  tabSub: { fontSize: 16, color: "#888" },
});
```

---

## Navigation

← Fiche précédente : **[Composants de base](03-composants-base.md)**

→ Fiche suivante : **[Gestion de l'état et données](05-etat-donnees.md)**
