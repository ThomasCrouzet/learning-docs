---
tags:
  - Mobile
  - Débutant
  - Pratique
description: "Maîtriser les composants de base de React Native : View, Text, Image, ScrollView, FlatList, StyleSheet et Pressable."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 13
cursus: "Dev Mobile"
id: "web.mobile.composants-base"
course_id: "web.mobile"
content_type: "lesson"
order: 3
---

# 03 - Composants de base

> **En bref** : Apprendre à utiliser les composants fondamentaux de React Native pour construire des interfaces mobiles. Lecture estimée : 75 min.

## Prérequis

- [Environnement React Native](02-environnement-react-native.md) terminée
- Un projet Expo fonctionnel avec le hot reload actif

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les composants View, Text, Image, ScrollView, FlatList, StyleSheet et Pressable pour construire des écrans mobiles complets.

---

## Concepts

### Qu'est-ce qu'un composant React Native ?

**Définition** : Un composant React Native est un bloc de construction d'interface qui correspond à un élément natif de la plateforme. Chaque composant React Native est traduit en un composant natif réel (UIView sur iOS, android.view.View sur Android).

**Le problème que les composants React Native résolvent** :

Sans composants React Native, voici les problèmes rencontrés :

1. **Pas de HTML en mobile** : les balises HTML (`<div>`, `<p>`, `<img>`) n'existent pas sur iOS et Android. Le navigateur qui les interprète n'est pas présent.
2. **API natives différentes** : iOS utilise UIKit (Swift) et Android utilise Android Views (Kotlin). Les API sont complètement différentes.
3. **Composants de base manquants** : sans abstraction, il faudrait écrire du code natif séparé pour chaque plateforme.

**Comment les composants React Native résolvent ces problèmes** :

| Problème | Solution apportée par les composants |
| --- | --- |
| Pas de HTML | Des composants JSX (`View`, `Text`) remplacent les balises HTML |
| API natives différentes | Un seul composant est traduit automatiquement en natif iOS et Android |
| Composants de base manquants | React Native fournit tous les composants essentiels (conteneur, texte, image, liste, bouton) |

**Analogie concrète** : Les composants React Native sont comme des briques LEGO universelles. Tu assembles les mêmes briques, mais le résultat s'adapte automatiquement à la plateforme. Une brique "Texte" devient un UILabel sur iOS et un TextView sur Android, sans que tu changes quoi que ce soit.

**Correspondance HTML / React Native** :

| HTML (web) | React Native (mobile) | Rôle |
| --- | --- | --- |
| `<div>` | `<View>` | Conteneur |
| `<p>`, `<span>` | `<Text>` | Texte |
| `<img>` | `<Image>` | Image |
| `<input>` | `<TextInput>` | Champ de saisie |
| `<button>` | `<Pressable>` | Zone cliquable |
| `<ul>` / `<li>` | `<FlatList>` | Liste |
| `<div style="overflow: scroll">` | `<ScrollView>` | Zone défilable |

---

### Qu'est-ce que StyleSheet ?

**Définition** : `StyleSheet` est l'API de React Native pour définir les styles des composants. Elle utilise une syntaxe similaire au CSS mais en JavaScript, avec des noms de propriétés en camelCase.

**Le problème que StyleSheet résout** :

Sans StyleSheet, voici les problèmes rencontrés :

1. **Pas de CSS natif** : les fichiers `.css` n'existent pas en React Native. Le moteur de rendu natif ne comprend pas le CSS.
2. **Styles inline peu performants** : écrire les styles directement dans le JSX (`style={{ color: 'red' }}`) crée un nouvel objet à chaque rendu, ce qui impacte les performances.
3. **Pas de validation** : sans système de styles typé, les erreurs de propriétés (fautes de frappe, valeurs invalides) ne sont détectées qu'à l'exécution.

**Comment StyleSheet résout ces problèmes** :

| Problème | Solution apportée par StyleSheet |
| --- | --- |
| Pas de CSS natif | Syntaxe JavaScript proche du CSS, compilée en styles natifs |
| Styles inline peu performants | `StyleSheet.create` optimise les objets de style en les créant une seule fois |
| Pas de validation | TypeScript détecte les propriétés invalides à la compilation |

**Analogie concrète** : CSS pour le web, c'est comme parler français en France. StyleSheet, c'est comme parler un "français technique" qui est traduit en langue locale (Swift/Kotlin) par un interprète. La grammaire est très proche, mais certains mots changent : `background-color` devient `backgroundColor`, `font-size` devient `fontSize`.

**Différences CSS vs StyleSheet** :

| CSS (web) | StyleSheet (React Native) |
| --- | --- |
| `background-color` | `backgroundColor` |
| `font-size: 16px` | `fontSize: 16` (pas de "px", unité en points) |
| `margin: 10px 20px` | `marginVertical: 10, marginHorizontal: 20` |
| `display: block` | `display: 'flex'` (Flexbox par défaut) |
| Cascade et héritage | Pas de cascade, styles isolés par composant |
| Fichier `.css` séparé | Objet JavaScript dans le même fichier |

---

### Qu'est-ce que Flexbox en React Native ?

**Définition** : Flexbox est le système de mise en page par défaut de React Native. Tous les composants `View` utilisent Flexbox automatiquement, avec `flexDirection: 'column'` par défaut (contrairement au web qui utilise `row`).

**Le problème que Flexbox résout** :

Sans Flexbox, voici les problèmes rencontrés :

1. **Positionnement absolu fragile** : positionner des éléments avec des coordonnées fixes ne s'adapte pas aux différentes tailles d'écran mobile.
2. **Centrage complexe** : centrer un élément verticalement et horizontalement nécessite des calculs manuels.
3. **Adaptation impossible** : un même layout doit fonctionner sur un iPhone SE (petit écran) et un iPad (grand écran).

**Comment Flexbox résout ces problèmes** :

| Problème | Solution apportée par Flexbox |
| --- | --- |
| Positionnement fragile | Les éléments se placent automatiquement selon des règles flexibles |
| Centrage complexe | `justifyContent: 'center'` et `alignItems: 'center'` suffisent |
| Adaptation impossible | Les proportions s'adaptent automatiquement à la taille de l'écran |

**Analogie concrète** : Flexbox, c'est comme une étagère réglable. Sans Flexbox, tu dois mesurer et percer des trous à des endroits précis pour chaque étagère. Avec Flexbox, les étagères s'ajustent automatiquement selon l'espace disponible.

**Ce que Flexbox en React Native n'est PAS** :

- Flexbox en React Native n'est pas identique au Flexbox CSS. La direction principale est `column` (vertical) par défaut au lieu de `row` (horizontal).
- Flexbox en React Native ne supporte pas toutes les propriétés CSS. Par exemple, `gap` est supporté, mais `grid` ne l'est pas.

---

## Étapes pratiques

### Étape 1 : Utiliser View et Text

`View` est le conteneur de base, `Text` affiche du texte :

Installe d'abord `react-native-safe-area-context` si ce n'est pas déjà fait :

```bash
# npx expo install choisit automatiquement la version compatible avec ton SDK
npx expo install react-native-safe-area-context
```

```tsx
// App.tsx
import { StyleSheet, Text, View } from "react-native";
// SafeAreaView gère automatiquement l'encoche, le Dynamic Island et la barre de statut
// sur tous les appareils (iPhone avec/sans encoche, Android)
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  return (
    // SafeAreaView remplace View au niveau racine pour éviter que le contenu
    // passe sous l'encoche ou la barre de statut - valable sur tous les appareils
    <SafeAreaView style={styles.container}>
      {/* View imbriquée avec un fond coloré */}
      <View style={styles.card}>
        {/* Text est le seul composant qui peut afficher du texte */}
        <Text style={styles.title}>Titre de la carte</Text>
        <Text style={styles.description}>
          Ceci est une description. Tout texte doit être dans un composant Text.
        </Text>
      </View>

      {/* Deuxième carte */}
      <View style={styles.card}>
        <Text style={styles.title}>Deuxième carte</Text>
        {/* Text imbriqué pour du style inline */}
        <Text style={styles.description}>
          Texte normal avec du <Text style={styles.bold}>texte en gras</Text> au
          milieu.
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace vertical
    backgroundColor: "#f5f5f5",
    padding: 20, // Marge intérieure de 20 points
    // Pas de paddingTop codé en dur : SafeAreaView gère les encoches et barres de statut
  },
  card: {
    backgroundColor: "#fff", // Fond blanc pour la carte
    borderRadius: 12, // Coins arrondis
    padding: 16, // Marge intérieure
    marginBottom: 12, // Espace entre les cartes
    // Ombre sur iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Ombre sur Android
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20, // Hauteur de ligne pour la lisibilité
  },
  bold: {
    fontWeight: "bold",
    color: "#000",
  },
});
```

**Résultat attendu** : deux cartes blanches avec ombre sur un fond gris clair.

---

### Étape 2 : Afficher des images avec Image

Le composant `Image` affiche des images locales ou distantes :

```tsx
import { StyleSheet, Text, View, Image } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Image locale depuis le dossier assets */}
      <Image
        source={require("./assets/icon.png")}
        style={styles.localImage}
      />

      {/* Image distante depuis une URL */}
      <Image
        source={{ uri: "https://picsum.photos/200/200" }}
        style={styles.remoteImage}
      />

      {/* Image avec redimensionnement */}
      <Image
        source={{ uri: "https://picsum.photos/400/200" }}
        style={styles.coverImage}
        resizeMode="cover" // Remplit le conteneur en recadrant si nécessaire
      />

      <Text style={styles.caption}>Trois modes d'affichage d'images</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    gap: 16, // Espace entre les éléments
  },
  localImage: {
    width: 80, // Largeur en points
    height: 80, // Hauteur en points (obligatoire pour les images)
    borderRadius: 40, // Cercle (moitié de la largeur)
  },
  remoteImage: {
    width: 200, // Les images distantes DOIVENT avoir une taille explicite
    height: 200,
    borderRadius: 12,
  },
  coverImage: {
    width: "90%", // Pourcentage de la largeur du parent
    height: 150,
    borderRadius: 12,
  },
  caption: {
    fontSize: 14,
    color: "#888",
  },
});
```

**Résultat attendu** : trois images affichées verticalement - une icône ronde, une image carrée et une image rectangulaire qui couvre toute la largeur.

---

### Étape 3 : Créer des listes défilables avec ScrollView

`ScrollView` rend son contenu défilable quand il dépasse l'écran :

```tsx
import { StyleSheet, Text, View, ScrollView } from "react-native";

export default function App() {
  return (
    // ScrollView remplace View quand le contenu dépasse l'écran
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Ma liste d'éléments</Text>

      {/* Générer 20 éléments pour forcer le défilement */}
      {Array.from({ length: 20 }, (_, index) => (
        <View key={index} style={styles.item}>
          <Text style={styles.itemNumber}>{index + 1}</Text>
          <Text style={styles.itemText}>Élément numéro {index + 1}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
  },
  item: {
    flexDirection: "row", // Éléments côte à côte (horizontal)
    alignItems: "center", // Centrer verticalement
    backgroundColor: "#fff",
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
    borderRadius: 8,
  },
  itemNumber: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#007AFF",
    width: 40, // Largeur fixe pour aligner les textes
  },
  itemText: {
    fontSize: 16,
    color: "#333",
  },
});
```

**Résultat attendu** : une liste de 20 éléments numérotés, défilable verticalement.

---

### Étape 4 : Utiliser FlatList pour les grandes listes

`FlatList` est optimisée pour les longues listes car elle ne rend que les éléments visibles à l'écran :

```tsx
import { StyleSheet, Text, View, FlatList } from "react-native";

// Données de la liste (simulant une liste de contacts)
const CONTACTS = Array.from({ length: 100 }, (_, i) => ({
  id: String(i + 1),
  name: `Contact ${i + 1}`,
  phone: `06 ${String(i).padStart(2, "0")} 00 00 00`,
}));

export default function App() {
  // Fonction qui rend un élément de la liste
  // item contient les données, index la position dans la liste
  const renderItem = ({
    item,
  }: {
    item: { id: string; name: string; phone: string };
  }) => (
    <View style={styles.contact}>
      {/* Avatar avec l'initiale */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      {/* Informations du contact */}
      <View style={styles.info}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.phone}>{item.phone}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Contacts ({CONTACTS.length})</Text>
      <FlatList
        data={CONTACTS} // Les données à afficher
        renderItem={renderItem} // Fonction de rendu pour chaque élément
        keyExtractor={(item) => item.id} // Clé unique pour chaque élément
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 60,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 20,
  },
  contact: {
    flexDirection: "row", // Avatar et info côte à côte
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22, // Cercle
    backgroundColor: "#007AFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    flex: 1, // Prend le reste de l'espace
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  phone: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  separator: {
    height: 1, // Ligne de séparation fine
    backgroundColor: "#eee",
    marginLeft: 76, // Aligné avec le début du texte (après l'avatar)
  },
});
```

**Résultat attendu** : une liste de 100 contacts avec avatar, nom et téléphone, qui défile de manière fluide.

---

### Étape 5 : Créer des boutons avec Pressable

`Pressable` est le composant recommandé pour les zones interactives :

```tsx
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";
import { useState } from "react";

export default function App() {
  // État pour compter le nombre de clics
  const [count, setCount] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.counter}>{count}</Text>

      {/* Bouton principal avec retour visuel au toucher */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.primaryButton,
          // Opacité réduite quand le bouton est pressé
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setCount(count + 1)}
      >
        <Text style={styles.buttonText}>Incrémenter</Text>
      </Pressable>

      {/* Bouton secondaire */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.secondaryButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() => setCount(0)}
      >
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Réinitialiser
        </Text>
      </Pressable>

      {/* Bouton avec confirmation */}
      <Pressable
        style={({ pressed }) => [
          styles.button,
          styles.dangerButton,
          pressed && styles.buttonPressed,
        ]}
        onPress={() =>
          Alert.alert(
            "Confirmation",
            "Es-tu sûr de vouloir tout supprimer ?",
            [
              { text: "Annuler", style: "cancel" },
              { text: "Supprimer", style: "destructive", onPress: () => setCount(0) },
            ]
          )
        }
      >
        <Text style={styles.buttonText}>Supprimer</Text>
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
    gap: 12,
  },
  counter: {
    fontSize: 64,
    fontWeight: "bold",
    marginBottom: 20,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  buttonPressed: {
    opacity: 0.7, // Retour visuel quand on appuie
  },
  primaryButton: {
    backgroundColor: "#007AFF", // Bleu
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#007AFF",
  },
  dangerButton: {
    backgroundColor: "#FF3B30", // Rouge
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButtonText: {
    color: "#007AFF", // Texte bleu sur fond blanc
  },
});
```

**Résultat attendu** : un compteur avec trois boutons - un bleu pour incrémenter, un blanc bordé de bleu pour réinitialiser et un rouge qui affiche une alerte de confirmation.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `<View>` | Conteneur de base (équivalent de `<div>`) |
| `<Text>` | Affichage de texte (obligatoire pour tout texte) |
| `<Image source={...}>` | Affichage d'images locales ou distantes |
| `<ScrollView>` | Zone défilable pour les contenus courts |
| `<FlatList data={...}>` | Liste optimisée pour les grands jeux de données |
| `<Pressable onPress={...}>` | Zone interactive avec retour visuel au toucher |
| `StyleSheet.create({})` | Créer une feuille de styles optimisée |

---

## Pièges fréquents

### Piège 1 : Texte en dehors d'un composant Text

**Problème** : Écrire du texte directement dans un `View` provoque une erreur.

**Solution** : Tout texte doit être dans un composant `<Text>`. Même un espace ou un nombre.

```tsx
// Incorrect - erreur "Text strings must be rendered within a <Text> component"
<View>
  Bonjour
</View>

// Correct
<View>
  <Text>Bonjour</Text>
</View>
```

### Piège 2 : Image distante sans dimensions

**Problème** : Une image distante (URL) ne s'affiche pas si aucune dimension n'est spécifiée.

**Solution** : Les images locales (`require`) ont des dimensions connues. Les images distantes (`uri`) nécessitent `width` et `height` explicites.

```tsx
// Incorrect - l'image ne s'affiche pas
<Image source={{ uri: "https://example.com/photo.jpg" }} />

// Correct - dimensions obligatoires pour les images distantes
<Image
  source={{ uri: "https://example.com/photo.jpg" }}
  style={{ width: 200, height: 200 }}
/>
```

### Piège 3 : ScrollView vs FlatList

**Problème** : Utiliser `ScrollView` pour une liste de 1000 éléments provoque des problèmes de performance.

**Solution** : `ScrollView` rend tous ses enfants en mémoire. Pour les listes de plus de 20 éléments, utilise `FlatList` qui ne rend que les éléments visibles à l'écran.

```tsx
// Incorrect - tous les 1000 éléments sont en mémoire
<ScrollView>
  {data.map((item) => <ItemComponent key={item.id} />)}
</ScrollView>

// Correct - seuls les éléments visibles sont rendus
<FlatList
  data={data}
  renderItem={({ item }) => <ItemComponent />}
  keyExtractor={(item) => item.id}
/>
```

---

## Checklist de validation

- Je sais créer un conteneur avec `View` et des styles avec `StyleSheet`
- Je sais afficher du texte avec `Text` et du texte imbriqué pour le style inline
- Je sais afficher des images locales et distantes avec `Image`
- Je sais quand utiliser `ScrollView` (contenu court) vs `FlatList` (longues listes)
- Je sais créer des boutons interactifs avec `Pressable`
- Je comprends le système Flexbox de React Native (direction column par défaut)
- Je sais afficher des ombres sur iOS (`shadow*`) et Android (`elevation`)

---

## Exercice pratique

**Énoncé** : Crée un écran de profil utilisateur avec les éléments suivants.

**Indications** :

- Un avatar rond (image distante) centré en haut
- Le nom de l'utilisateur en gras sous l'avatar
- Un texte de biographie en gris
- Une liste de 3 statistiques côte à côte (Publications, Abonnés, Abonnements) avec des nombres en gras
- Un bouton "Modifier le profil" bleu

**Résultat attendu** : Un écran de profil similaire à celui d'un réseau social, avec tous les éléments centrés et bien espacés.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
import { StyleSheet, Text, View, Image, Pressable } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Avatar rond */}
      <Image
        source={{ uri: "https://picsum.photos/200" }}
        style={styles.avatar}
      />

      {/* Nom de l'utilisateur */}
      <Text style={styles.name}>Marie Dupont</Text>

      {/* Biographie */}
      <Text style={styles.bio}>
        Développeuse mobile passionnée. Fan de React Native et de TypeScript.
      </Text>

      {/* Statistiques en ligne */}
      <View style={styles.statsContainer}>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>42</Text>
          <Text style={styles.statLabel}>Publications</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>1.2k</Text>
          <Text style={styles.statLabel}>Abonnés</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statNumber}>318</Text>
          <Text style={styles.statLabel}>Abonnements</Text>
        </View>
      </View>

      {/* Bouton modifier */}
      <Pressable
        style={({ pressed }) => [
          styles.editButton,
          pressed && { opacity: 0.7 },
        ]}
        onPress={() => console.log("Modifier le profil")}
      >
        <Text style={styles.editButtonText}>Modifier le profil</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    paddingTop: 80,
    paddingHorizontal: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60, // Moitié de la largeur pour un cercle
    marginBottom: 16,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
  },
  bio: {
    fontSize: 14,
    color: "#666",
    textAlign: "center", // Centrer le texte
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  statsContainer: {
    flexDirection: "row", // Les 3 stats côte à côte
    justifyContent: "space-around", // Espacement uniforme
    width: "100%",
    marginBottom: 24,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  stat: {
    alignItems: "center", // Centrer le nombre et le label
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
  },
  statLabel: {
    fontSize: 12,
    color: "#888",
    marginTop: 4,
  },
  editButton: {
    backgroundColor: "#007AFF",
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    width: "90%",
    alignItems: "center",
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
```

---

## Navigation

← Fiche précédente : **[Environnement React Native](02-environnement-react-native.md)**

→ Fiche suivante : **[Navigation](04-navigation.md)**
