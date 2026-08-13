---
tags:
  - Mobile
  - Débutant
  - Concept
description: "Comprendre les approches du développement mobile : natif, hybride et cross-platform avec React Native."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 13
cursus: "Dev Mobile"
---

# 01 - Introduction au dev mobile

> **En bref** : Comprendre les différentes approches du développement mobile et pourquoi React Native est un choix pertinent pour créer des applications iOS et Android. Lecture estimée : 60 min.

## Prérequis

- [Cursus React](../08-react/index.md) terminé
- [Cursus JavaScript Moderne](../06-javascript-moderne/index.md) terminé
- Connaître les bases de HTML, CSS et JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer les différences entre développement natif, hybride et cross-platform, et tu comprendras pourquoi React Native est une solution adaptée pour créer des applications mobiles.

---

## Concepts

### Qu'est-ce que le développement mobile ?

**Définition** : Le développement mobile consiste à créer des applications logicielles qui fonctionnent sur des appareils mobiles (smartphones, tablettes). Ces applications sont distribuées via des stores (App Store pour iOS, Google Play Store pour Android).

**Le problème que le développement mobile résout** :

Sans applications mobiles, voici les problèmes rencontrés :

1. **Sites web inadaptés** : les sites web classiques ne sont pas conçus pour les petits écrans, les gestes tactiles (swipe, pinch) ou les fonctionnalités matérielles (caméra, GPS, accéléromètre).
2. **Pas d'accès offline** : un site web nécessite une connexion internet permanente, alors qu'une application mobile peut fonctionner hors ligne.
3. **Pas de notifications push** : impossible de prévenir l'utilisateur d'un événement important sans qu'il visite le site.
4. **Performances limitées** : les animations fluides et les interactions rapides sont difficiles à obtenir dans un navigateur mobile.

**Comment les applications mobiles résolvent ces problèmes** :

| Problème | Solution apportée par les applications mobiles |
| --- | --- |
| Sites web inadaptés | Interface conçue spécifiquement pour le tactile et les petits écrans |
| Pas d'accès offline | Stockage local des données et fonctionnement hors connexion |
| Pas de notifications push | Notifications natives intégrées au système d'exploitation |
| Performances limitées | Accès direct aux ressources matérielles du téléphone |

**Analogie concrète** : Imagine que tu veux écouter de la musique. Un site web de streaming, c'est comme aller au magasin chaque fois que tu veux écouter une chanson. Une application mobile, c'est comme avoir ta propre platine chez toi, avec tes disques déjà rangés, et une télécommande adaptée à tes mains.

**Ce que le développement mobile n'est PAS** :

- Le développement mobile n'est pas du développement web responsive. Un site responsive s'adapte aux écrans, mais reste un site web dans un navigateur. Une application mobile est installée sur l'appareil.
- Le développement mobile n'est pas réservé aux grandes entreprises. Des outils comme Expo permettent à un développeur seul de créer et publier une application.

---

### Les trois approches du développement mobile

**Définition** : Il existe trois grandes approches pour créer une application mobile : le développement natif, le développement hybride et le développement cross-platform.

#### Développement natif

Le développement natif consiste à écrire une application en utilisant le langage et les outils officiels de chaque plateforme :

- **iOS** : langage Swift (ou Objective-C), IDE Xcode, uniquement sur macOS
- **Android** : langage Kotlin (ou Java), IDE Android Studio, sur Windows/macOS/Linux

**Avantages** :

- Performances maximales (accès direct au matériel)
- Accès complet à toutes les API du système
- Meilleure intégration visuelle avec le système d'exploitation

**Inconvénients** :

- Deux bases de code à maintenir (une pour iOS, une pour Android)
- Deux équipes de développeurs avec des compétences différentes
- Coût de développement doublé

#### Développement hybride

Le développement hybride consiste à créer une application web (HTML/CSS/JavaScript) encapsulée dans un conteneur natif qui s'affiche dans un composant WebView :

- **Outils** : Ionic, Apache Cordova, Capacitor

**Avantages** :

- Une seule base de code en technologies web
- Compétences web transférables directement

**Inconvénients** :

- Performances inférieures (tout passe par un navigateur intégré)
- L'interface ne ressemble pas toujours à une application native
- Accès limité aux fonctionnalités matérielles

#### Développement cross-platform

Le développement cross-platform utilise un langage unique pour générer de véritables composants natifs sur chaque plateforme :

- **Outils** : React Native (JavaScript/TypeScript), Flutter (Dart), .NET MAUI (C#)

**Avantages** :

- Une seule base de code pour iOS et Android
- Composants natifs réels (pas de WebView)
- Performances proches du natif

**Inconvénients** :

- Certaines fonctionnalités très spécifiques nécessitent du code natif
- Dépendance à un framework tiers

**Comparaison des trois approches** :

| Critère | Natif | Hybride | Cross-platform |
| --- | --- | --- | --- |
| Langage | Swift / Kotlin | HTML/CSS/JS | JS (React Native) / Dart (Flutter) |
| Performances | Excellentes | Moyennes | Bonnes |
| Interface | 100% native | WebView stylisée | Composants natifs |
| Bases de code | 2 (iOS + Android) | 1 | 1 |
| Courbe d'apprentissage | Raide (2 langages) | Faible (web) | Modérée |
| Accès matériel | Complet | Limité | Quasi complet |

---

### Qu'est-ce que React Native ?

**Définition** : React Native est un framework open source créé par Meta (Facebook) en 2015 qui permet de développer des applications mobiles iOS et Android en JavaScript (ou TypeScript) en utilisant les mêmes principes que React.

**Le problème que React Native résout** :

Sans React Native, voici les problèmes rencontrés :

1. **Double développement** : il faut écrire deux applications séparées en Swift et Kotlin pour couvrir iOS et Android.
2. **Compétences fragmentées** : l'équipe doit maîtriser deux écosystèmes complètement différents.
3. **Synchronisation des fonctionnalités** : chaque nouvelle fonctionnalité doit être implémentée deux fois, avec le risque de divergences.

**Comment React Native résout ces problèmes** :

| Problème | Solution apportée par React Native |
| --- | --- |
| Double développement | Une seule base de code JavaScript/TypeScript pour les deux plateformes |
| Compétences fragmentées | Les développeurs React web peuvent créer des applications mobiles |
| Synchronisation des fonctionnalités | Le même code produit le même résultat sur iOS et Android |

**Analogie concrète** : Imagine que tu écris un livre. Le développement natif, c'est comme écrire le même livre deux fois : une fois en français, une fois en anglais, avec deux auteurs différents. React Native, c'est comme écrire le livre dans une langue universelle qui est automatiquement traduite dans les deux langues, tout en conservant les expressions idiomatiques de chacune.

**Ce que React Native n'est PAS** :

- React Native n'est pas une WebView. Contrairement aux solutions hybrides, React Native génère de vrais composants natifs (UIView sur iOS, android.view.View sur Android).
- React Native n'est pas React. React est la bibliothèque pour le web (DOM HTML). React Native utilise les mêmes principes (composants, hooks, JSX) mais les composants sont différents (View au lieu de div, Text au lieu de p).
- React Native n'est pas limité au mobile. React Native peut aussi cibler le web, Windows et macOS.

**Comparaison React Native vs Flutter** :

| React Native | Flutter |
| --- | --- |
| JavaScript / TypeScript | Dart |
| Composants natifs du système | Widgets dessinés par Flutter (Skia) |
| Écosystème npm (3 millions de packages) | Packages pub.dev |
| Communauté web existante | Communauté en croissance |
| Créé par Meta | Créé par Google |
| Hot Reload | Hot Reload |

---

### Qu'est-ce qu'Expo ?

**Définition** : Expo est une plateforme et un ensemble d'outils construits autour de React Native qui simplifient le développement, le test et le déploiement d'applications mobiles.

**Le problème qu'Expo résout** :

Sans Expo, voici les problèmes rencontrés avec React Native pur :

1. **Configuration complexe** : installer et configurer Xcode, Android Studio, les SDK, les émulateurs et les variables d'environnement prend du temps.
2. **Build natif local** : compiler une application iOS nécessite un Mac avec Xcode. Compiler pour Android nécessite le SDK Android complet.
3. **Accès aux fonctionnalités natives** : utiliser la caméra, la géolocalisation ou les notifications nécessite de configurer manuellement des modules natifs.

**Comment Expo résout ces problèmes** :

| Problème | Solution apportée par Expo |
| --- | --- |
| Configuration complexe | Une seule commande `npx create-expo-app` crée un projet prêt à l'emploi |
| Build natif local | EAS Build compile dans le cloud (pas besoin de Xcode ni d'Android Studio) |
| Accès aux fonctionnalités natives | Le SDK Expo fournit des modules pré-configurés (caméra, géolocalisation, etc.) |

**Analogie concrète** : React Native sans Expo, c'est comme construire une maison en partant de zéro : tu achètes les matériaux, tu coules les fondations, tu montes les murs. Expo, c'est comme un kit de construction préfabriqué : les murs sont déjà découpés aux bonnes dimensions, les tuyaux sont pré-assemblés, et un service externe s'occupe de la toiture.

**Ce qu'Expo n'est PAS** :

- Expo n'est pas un remplacement de React Native. Expo est une couche au-dessus de React Native qui ajoute des outils et des services.
- Expo n'est pas limité aux projets simples. Depuis Expo SDK 49 et les "development builds", Expo gère aussi les modules natifs personnalisés.

---

## Étapes pratiques

### Étape 1 : Vérifier les prérequis

Avant de commencer, vérifie que Node.js est installé sur ta machine :

```bash
# Vérifier la version de Node.js (minimum 20 LTS, 22 LTS recommandé)
node --version
```

**Résultat attendu** :

```text
v22.x.x
```

Si Node.js n'est pas installé, installe-le depuis le site officiel ou avec nvm :

```bash
# Installer nvm (Node Version Manager) si ce n'est pas fait
# Puis installer Node.js 22 LTS (recommandé en 2026 ; Node.js 18 est en fin de vie)
nvm install 22
nvm use 22
```

---

### Étape 2 : Vérifier l'accès à Expo

Depuis Expo SDK 46, `expo-cli` global est déprécié et n'est plus maintenu. Le CLI est désormais intégré directement dans le package `expo` de chaque projet. Tu n'as rien à installer globalement : `npx` télécharge automatiquement la dernière version.

Vérifie que `npx` fonctionne sur ta machine :

```bash
# Vérifier que npx est disponible (inclus avec Node.js)
npx --version
```

**Résultat attendu** :

```text
10.x.x
```

---

### Étape 3 : Installer l'application Expo Go

Pour tester les applications sur un vrai téléphone, installe l'application **Expo Go** depuis le store de ton téléphone :

- **iOS** : cherche "Expo Go" sur l'App Store
- **Android** : cherche "Expo Go" sur le Google Play Store

Cette application permet de scanner un QR code pour charger instantanément ton application en cours de développement.

---

### Étape 4 : Créer un premier projet de test

Crée un projet minimal pour vérifier que tout fonctionne :

```bash
# Créer un nouveau projet Expo avec le template TypeScript
npx create-expo-app@latest mon-premier-projet --template blank-typescript

# Se déplacer dans le dossier du projet
cd mon-premier-projet

# Lancer le serveur de développement
npx expo start
```

**Résultat attendu** :

```text
Starting Metro Bundler
▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄▄
█ ▄▄▄▄▄ █ ▀▄▀▄ █ ▄▄▄▄▄ █
█ █   █ █▄▀ ▀▄██ █   █ █
...
› Scan the QR code above with Expo Go (Android) or the Camera app (iOS)
› Press a │ open Android
› Press i │ open iOS simulator
› Press w │ open web
```

Tu peux scanner le QR code avec Expo Go sur ton téléphone pour voir l'application.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npx create-expo-app@latest nom --template blank-typescript` | Créer un nouveau projet Expo en TypeScript |
| `npx expo start` | Lancer le serveur de développement |
| `npx expo start --clear` | Lancer en vidant le cache Metro |
| `npx expo install package` | Installer un package compatible Expo |
| `node --version` | Vérifier la version de Node.js |
| `npx --version` | Vérifier que npx est disponible |

---

## Pièges fréquents

### Piège 1 : Confondre React et React Native

**Problème** : Utiliser des balises HTML (`<div>`, `<p>`, `<span>`) dans du code React Native.

**Solution** : React Native utilise ses propres composants. `<div>` devient `<View>`, `<p>` devient `<Text>`, `<img>` devient `<Image>`. Le CSS classique est remplacé par `StyleSheet`.

```jsx
// Incorrect - composants web
<div>
  <p>Bonjour</p>
</div>

// Correct - composants React Native
<View>
  <Text>Bonjour</Text>
</View>
```

### Piège 2 : Confondre hybride et cross-platform

**Problème** : Penser que React Native fonctionne comme Ionic ou Cordova, via une WebView.

**Solution** : React Native ne crée pas de page web dans un navigateur intégré. Il génère de vrais composants natifs de la plateforme. Un `<Text>` React Native devient un `UILabel` sur iOS et un `TextView` sur Android.

### Piège 3 : Oublier Expo Go pour le test

**Problème** : Essayer de lancer l'application sur un émulateur sans avoir installé les SDK natifs.

**Solution** : Utilise Expo Go sur un vrai téléphone pour commencer. Scanne le QR code affiché dans le terminal avec l'application Expo Go. Les émulateurs nécessitent Xcode (iOS) ou Android Studio (Android) installés localement.

---

## Checklist de validation

- Je sais expliquer la différence entre natif, hybride et cross-platform
- Je comprends pourquoi React Native utilise des composants natifs et pas une WebView
- Je sais ce qu'Expo apporte par rapport à React Native seul
- Node.js est installé sur ma machine (version 20 LTS minimum, 22 LTS recommandé)

- J'ai installé Expo Go sur mon téléphone
- J'ai créé un projet de test avec `npx create-expo-app@latest … --template blank-typescript`
- J'ai lancé le serveur de développement avec `npx expo start`

---

## Exercice pratique

**Énoncé** : Crée un nouveau projet Expo et modifie le texte affiché à l'écran.

**Indications** :

- Crée un projet avec `npx create-expo-app@latest exercice-01 --template blank-typescript`
- Ouvre le fichier `App.tsx` dans ton éditeur
- Remplace le texte par "Ma première application mobile"
- Lance le serveur de développement et vérifie le résultat sur Expo Go

**Résultat attendu** : L'écran du téléphone affiche "Ma première application mobile" au centre.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```bash
# Créer le projet en TypeScript
npx create-expo-app@latest exercice-01 --template blank-typescript
cd exercice-01
```

Modifier le fichier `App.tsx` :

```tsx
// Importer les composants nécessaires depuis React Native
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";

// Composant principal de l'application
export default function App() {
  return (
    // View est le conteneur principal (équivalent de div en web)
    <View style={styles.container}>
      {/* Text affiche du texte (équivalent de p en web) */}
      <Text>Ma première application mobile</Text>
      {/* StatusBar gère la barre de statut du téléphone */}
      <StatusBar style="auto" />
    </View>
  );
}

// Feuille de styles (équivalent du CSS, mais en JavaScript)
const styles = StyleSheet.create({
  container: {
    flex: 1, // Prend tout l'espace disponible
    backgroundColor: "#fff", // Fond blanc
    alignItems: "center", // Centre horizontalement
    justifyContent: "center", // Centre verticalement
  },
});
```

```bash
# Lancer le serveur de développement
npx expo start
```

Scanne le QR code avec Expo Go pour voir le résultat.

---

## Navigation

→ Fiche suivante : **[Environnement React Native](02-environnement-react-native.md)**
