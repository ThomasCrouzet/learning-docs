---
tags:
  - Mobile
  - Débutant
  - Pratique
description: "Installer et configurer l'environnement React Native avec Expo, créer un projet et comprendre sa structure."
estimated_time: "75 min"
fiche_number: 2
total_fiches: 13
cursus: "Dev Mobile"
---

# 02 - Environnement React Native

> **En bref** : Installer l'environnement de développement React Native avec Expo, créer un projet, comprendre sa structure et utiliser le hot reload. Lecture estimée : 75 min.

## Prérequis

- [Introduction au dev mobile](01-introduction-mobile.md) terminée
- Node.js 20 LTS ou supérieur installé (22 LTS recommandé)

- Un téléphone avec Expo Go installé (ou un émulateur configuré)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un projet React Native avec Expo, naviguer dans sa structure de fichiers, utiliser le hot reload et tester sur un appareil physique ou un émulateur.

---

## Concepts

### Qu'est-ce qu'un projet Expo ?

**Définition** : Un projet Expo est un dossier contenant le code source d'une application React Native, configuré avec les outils Expo pour simplifier le développement, le test et le déploiement.

**Le problème qu'un projet Expo résout** :

Sans Expo, voici les problèmes rencontrés pour créer un projet React Native :

1. **Configuration manuelle** : il faut installer séparément React Native CLI, configurer les variables d'environnement (`ANDROID_HOME`, `JAVA_HOME`), installer les SDK natifs et configurer les émulateurs.
2. **Dépendances natives** : chaque bibliothèque native (caméra, géolocalisation) nécessite un "linking" manuel avec le code natif iOS et Android.
3. **Build local obligatoire** : compiler l'application nécessite Xcode (iOS) ou Android Studio (Android) installés et configurés correctement.

**Comment un projet Expo résout ces problèmes** :

| Problème | Solution apportée par Expo |
| --- | --- |
| Configuration manuelle | `npx create-expo-app` génère un projet complet et fonctionnel |
| Dépendances natives | `npx expo install` gère automatiquement les versions compatibles |
| Build local obligatoire | Expo Go pour le développement, EAS Build pour la production |

**Analogie concrète** : Créer un projet React Native sans Expo, c'est comme monter un meuble sans notice : tu as toutes les pièces mais tu dois deviner l'ordre d'assemblage. Expo, c'est comme un meuble livré avec une notice claire, des pièces numérotées et un tournevis fourni.

---

### Qu'est-ce que Metro Bundler ?

**Définition** : Metro est le bundler JavaScript utilisé par React Native. Il transforme ton code source (JSX, TypeScript, imports) en un bundle JavaScript unique que l'application mobile peut exécuter.

**Le problème que Metro résout** :

Sans bundler, voici les problèmes rencontrés :

1. **Modules non supportés** : les appareils mobiles ne comprennent pas nativement les `import`/`export` JavaScript modernes.
2. **Fichiers multiples** : une application contient des centaines de fichiers. Charger chaque fichier individuellement serait très lent.
3. **Transformations nécessaires** : le code JSX et TypeScript doit être transformé en JavaScript standard.

**Comment Metro résout ces problèmes** :

| Problème | Solution apportée par Metro |
| --- | --- |
| Modules non supportés | Transforme les imports en un format compatible |
| Fichiers multiples | Regroupe tous les fichiers en un seul bundle |
| Transformations nécessaires | Compile le JSX et le TypeScript automatiquement |

**Analogie concrète** : Metro est comme un traducteur simultané dans une conférence internationale. Les développeurs parlent en JSX et TypeScript (langues modernes), et Metro traduit instantanément en JavaScript standard (langue comprise par le téléphone).

**Ce que Metro n'est PAS** :

- Metro n'est pas Webpack. Webpack est le bundler web. Metro est optimisé pour React Native et le développement mobile (démarrage rapide, hot reload incrémental).
- Metro n'est pas un compilateur natif. Metro ne produit pas du code Swift ou Kotlin. Il produit du JavaScript qui est ensuite exécuté par le moteur JavaScript de React Native (Hermes).

---

### Qu'est-ce que le hot reload ?

**Définition** : Le hot reload (rechargement à chaud) est une fonctionnalité qui met à jour l'application en temps réel quand tu modifies le code source, sans redémarrer l'application ni perdre l'état actuel.

**Le problème que le hot reload résout** :

Sans hot reload, voici les problèmes rencontrés :

1. **Recompilation lente** : chaque modification nécessite de recompiler l'application complète (plusieurs minutes en natif).
2. **Perte d'état** : après le redémarrage, tu retournes à l'écran initial et tu perds toutes les données saisies (formulaires, navigation).
3. **Cycle de développement lent** : modifier, compiler, attendre, naviguer jusqu'au bon écran, tester - à chaque changement.

**Comment le hot reload résout ces problèmes** :

| Problème | Solution apportée par le hot reload |
| --- | --- |
| Recompilation lente | Seul le fichier modifié est rechargé (quelques millisecondes) |
| Perte d'état | L'état des composants est préservé après le rechargement |
| Cycle de développement lent | Le résultat de la modification est visible instantanément |

**Analogie concrète** : Sans hot reload, modifier une application c'est comme rénover une cuisine : tu démolis tout et tu reconstruis de zéro à chaque changement. Avec hot reload, c'est comme changer un rideau : tu le remplaces sans toucher au reste de la pièce.

---

## Étapes pratiques

### Étape 1 : Créer un nouveau projet Expo

Crée un projet avec le template TypeScript recommandé :

```bash
# Créer un projet Expo avec TypeScript
npx create-expo-app mon-app --template blank-typescript

# Se déplacer dans le dossier du projet
cd mon-app
```

**Résultat attendu** :

```text
✅ Your project is ready!

To run your project, navigate to the directory and run one of the following npm commands.

- cd mon-app
- npm run android
- npm run ios
- npm run web
```

---

### Étape 2 : Explorer la structure du projet

Affiche l'arborescence du projet :

```bash
# Lister les fichiers et dossiers principaux
ls -la
```

**Résultat attendu** :

```text
.
├── App.tsx              # Composant principal de l'application
├── app.json             # Configuration Expo (nom, icône, splash screen)
├── assets/              # Images, polices et autres ressources statiques
│   ├── adaptive-icon.png
│   ├── favicon.png
│   ├── icon.png
│   └── splash-icon.png
├── babel.config.js      # Configuration de Babel (transformations JS)
├── node_modules/        # Dépendances installées
├── package.json         # Dépendances et scripts du projet
└── tsconfig.json        # Configuration TypeScript
```

Voici le rôle de chaque fichier important :

| Fichier | Rôle |
| --- | --- |
| `App.tsx` | Point d'entrée de l'application. Tout commence ici. |
| `app.json` | Configuration Expo : nom de l'application, icônes, splash screen, permissions |
| `assets/` | Ressources statiques (images, polices) |
| `babel.config.js` | Configuration du transpileur Babel |
| `package.json` | Liste des dépendances et scripts npm |
| `tsconfig.json` | Configuration TypeScript (types, chemins) |

---

### Étape 3 : Comprendre le fichier app.json

Ouvre le fichier `app.json` pour comprendre la configuration :

```json
{
  "expo": {
    "name": "mon-app",
    "slug": "mon-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "newArchEnabled": true,
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png"
    }
  }
}
```

Voici ce que chaque champ signifie :

| Champ | Signification |
| --- | --- |
| `name` | Nom affiché sur le téléphone sous l'icône |
| `slug` | Identifiant unique du projet (URL Expo) |
| `version` | Version de l'application (semver) |
| `orientation` | Orientation de l'écran : `portrait`, `landscape` ou `default` |
| `icon` | Chemin vers l'icône de l'application (1024x1024 px recommandé) |
| `splash` | Configuration de l'écran de chargement au démarrage |
| `ios` / `android` | Configuration spécifique à chaque plateforme |

---

### Étape 4 : Lancer le serveur de développement

Lance le serveur Metro et teste l'application :

```bash
# Lancer le serveur de développement
npx expo start
```

**Résultat attendu** :

```text
Starting Metro Bundler

› Metro waiting on exp://192.168.1.42:8081
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)

› Using Expo Go
› Press s │ switch to development build

› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web

› Press j │ open debugger
› Press r │ reload app
› Press m │ toggle menu
› Press o │ open project code in your editor
```

Options de test :

- **Téléphone physique** : scanne le QR code avec Expo Go (Android) ou l'application Appareil photo (iOS)
- **Émulateur iOS** : appuie sur `i` (nécessite Xcode installé sur macOS)
- **Émulateur Android** : appuie sur `a` (nécessite Android Studio installé)
- **Navigateur web** : appuie sur `w`

---

### Étape 5 : Tester le hot reload

Modifie le fichier `App.tsx` pendant que le serveur tourne :

```tsx
// App.tsx - Modifier le texte pour tester le hot reload
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

export default function App() {
  return (
    <View style={styles.container}>
      {/* Change ce texte et sauvegarde le fichier */}
      <Text style={styles.title}>Bienvenue dans mon application !</Text>
      <Text style={styles.subtitle}>Le hot reload fonctionne.</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  // Ajouter un style pour le titre
  title: {
    fontSize: 24, // Taille de la police en points
    fontWeight: "bold", // Texte en gras
    marginBottom: 8, // Marge en bas de 8 points
  },
  // Ajouter un style pour le sous-titre
  subtitle: {
    fontSize: 16, // Taille plus petite que le titre
    color: "#666", // Gris foncé
  },
});
```

**Résultat attendu** : l'application se met à jour en moins d'une seconde sur ton téléphone, sans redémarrer.

---

### Étape 6 : Utiliser le débogueur

React Native fournit plusieurs outils de débogage :

```tsx
// Ajouter des logs pour déboguer
export default function App() {
  // Les console.log apparaissent dans le terminal Metro
  console.log("L'application a été rendue");

  // console.warn affiche un bandeau jaune sur l'écran
  console.warn("Ceci est un avertissement");

  return (
    <View style={styles.container}>
      <Text>Débogage</Text>
      <StatusBar style="auto" />
    </View>
  );
}
```

Pour ouvrir le menu de développement sur le téléphone :

- **iOS** : secoue le téléphone
- **Android** : secoue le téléphone ou appuie sur le bouton Menu

Dans le terminal Metro, appuie sur `j` pour ouvrir le débogueur React Native dans le navigateur.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npx create-expo-app nom --template blank-typescript` | Créer un projet TypeScript |
| `npx expo start` | Lancer le serveur de développement |
| `npx expo start --clear` | Lancer en vidant le cache Metro |
| `npx expo start --tunnel` | Lancer en mode tunnel (réseau distant) |
| `npx expo install package` | Installer un package compatible avec la version d'Expo |
| `npx expo doctor` | Vérifier la santé du projet et les versions |
| `npm run ios` | Lancer sur le simulateur iOS |
| `npm run android` | Lancer sur l'émulateur Android |

---

## Pièges fréquents

### Piège 1 : QR code non scannable depuis le téléphone

**Problème** : Le QR code s'affiche dans le terminal mais Expo Go ne se connecte pas.

**Solution** : Vérifie que ton téléphone et ton ordinateur sont sur le même réseau Wi-Fi. Si le problème persiste, lance le serveur en mode tunnel :

```bash
# Mode tunnel : fonctionne même sur des réseaux différents
npx expo start --tunnel
```

### Piège 2 : Erreur "Unable to resolve module"

**Problème** : Metro ne trouve pas un module après une installation.

**Solution** : Vide le cache de Metro et redémarre :

```bash
# Vider le cache et redémarrer
npx expo start --clear
```

Si le problème persiste, supprime `node_modules` et réinstalle :

```bash
# Réinstaller les dépendances
rm -rf node_modules
npm install
npx expo start --clear
```

### Piège 3 : Utiliser npm install au lieu de npx expo install

**Problème** : Installer un package avec `npm install` peut installer une version incompatible avec la version d'Expo.

**Solution** : Utilise toujours `npx expo install` pour les packages liés à React Native ou Expo. Cette commande installe automatiquement la version compatible :

```bash
# Incorrect
npm install react-native-screens

# Correct
npx expo install react-native-screens
```

---

## Checklist de validation

- J'ai créé un projet Expo avec TypeScript
- Je connais le rôle de chaque fichier du projet (`App.tsx`, `app.json`, `package.json`)
- J'ai lancé le serveur de développement avec `npx expo start`
- J'ai testé l'application sur un appareil (téléphone ou émulateur)
- J'ai modifié du code et observé le hot reload en action
- Je sais vider le cache Metro avec `--clear`
- Je sais utiliser `npx expo install` plutôt que `npm install`

---

## Exercice pratique

**Énoncé** : Crée un projet Expo et personnalise l'écran d'accueil avec un titre, un sous-titre et un bouton.

**Indications** :

- Crée un projet avec le template `blank-typescript`
- Modifie `App.tsx` pour afficher un titre centré ("Mon Application"), un sous-titre ("Version 1.0") et un texte cliquable ("Commencer")
- Utilise `StyleSheet.create` pour les styles
- Le titre doit être en gras, taille 28
- Le sous-titre doit être gris, taille 16
- Le texte "Commencer" doit avoir un fond bleu et du texte blanc

**Résultat attendu** : Un écran avec trois éléments centrés verticalement : le titre en noir et gras, le sous-titre en gris, et un bouton bleu avec du texte blanc.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
// App.tsx
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Pressable, Alert } from "react-native";

export default function App() {
  // Fonction appelée quand on appuie sur le bouton
  const handlePress = () => {
    Alert.alert("Bienvenue", "Tu as appuyé sur Commencer !");
  };

  return (
    <View style={styles.container}>
      {/* Titre principal en gras */}
      <Text style={styles.title}>Mon Application</Text>

      {/* Sous-titre en gris */}
      <Text style={styles.subtitle}>Version 1.0</Text>

      {/* Bouton avec Pressable (remplaçant moderne de TouchableOpacity) */}
      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Commencer</Text>
      </Pressable>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
    backgroundColor: "#fff",
    alignItems: "center", // Centre les enfants horizontalement
    justifyContent: "center", // Centre les enfants verticalement
  },
  title: {
    fontSize: 28, // Grande taille pour le titre
    fontWeight: "bold", // Texte en gras
    marginBottom: 8, // Espace sous le titre
    color: "#000", // Noir
  },
  subtitle: {
    fontSize: 16, // Taille moyenne
    color: "#888", // Gris
    marginBottom: 32, // Espace avant le bouton
  },
  button: {
    backgroundColor: "#007AFF", // Bleu iOS
    paddingHorizontal: 32, // Marge intérieure horizontale
    paddingVertical: 12, // Marge intérieure verticale
    borderRadius: 8, // Coins arrondis
  },
  buttonText: {
    color: "#fff", // Texte blanc
    fontSize: 18, // Taille du texte du bouton
    fontWeight: "600", // Semi-gras
  },
});
```

Lance le serveur et vérifie que les trois éléments s'affichent correctement :

```bash
npx expo start
```

---

## Navigation

← Fiche précédente : **[Introduction au dev mobile](01-introduction-mobile.md)**

→ Fiche suivante : **[Composants de base](03-composants-base.md)**
