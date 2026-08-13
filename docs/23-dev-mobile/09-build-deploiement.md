---
tags:
  - Mobile
  - Avancé
  - Pratique
description: "Compiler et déployer une application React Native avec EAS Build, générer les APK/IPA et publier sur les stores."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 13
cursus: "Dev Mobile"
---

# 09 - Build et déploiement

> **En bref** : Apprendre à compiler une application React Native avec EAS Build, générer les fichiers APK (Android) et IPA (iOS), publier sur les stores et gérer les mises à jour OTA. Lecture estimée : 75 min.

## Prérequis

- [Formulaires et validation](08-formulaires-validation.md) terminée
- Une application React Native fonctionnelle avec Expo
- Un compte Expo gratuit (créé sur le site expo.dev)
- Pour publier sur les stores : un compte Google Play (25 dollars unique) et/ou Apple Developer (99 dollars/an)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras configurer le build d'une application Expo avec EAS, générer un fichier APK pour Android et un fichier IPA pour iOS, publier ton application sur les stores et envoyer des mises à jour sans repasser par les stores grâce aux mises à jour OTA.

---

## Concepts

### Qu'est-ce que le build d'une application mobile ?

**Définition** : Le build est le processus de compilation qui transforme ton code JavaScript et tes ressources (images, polices) en un fichier binaire installable sur un téléphone. Pour Android, ce fichier est un APK (Android Package) ou un AAB (Android App Bundle). Pour iOS, c'est un IPA (iOS App Store Package).

**Le problème que le build résout** :

Sans processus de build, voici les problèmes rencontrés :

1. **Code non exécutable** : le code JavaScript de ton projet ne peut pas être directement installé sur un téléphone. Le système d'exploitation ne comprend que les formats binaires natifs.
2. **Dépendance à Expo Go** : pendant le développement, Expo Go exécute ton code, mais c'est une application de test. Les utilisateurs finaux ne peuvent pas l'utiliser.
3. **Pas de distribution** : sans fichier binaire, impossible de publier sur les stores ou de partager l'application avec des testeurs.

**Comment le build résout ces problèmes** :

| Problème | Solution apportée par le build |
| --- | --- |
| Code non exécutable | Le code est compilé en binaire natif (APK/IPA) |
| Dépendance à Expo Go | L'application devient autonome avec son propre icône et nom |
| Pas de distribution | Le fichier binaire peut être publié sur les stores |

**Analogie concrète** : Le build, c'est comme la cuisson d'un gâteau. Tu as rassemblé tous les ingrédients (code, images, configurations) dans un moule (le projet). Le build est le passage au four qui transforme ces ingrédients en un produit fini (le fichier APK/IPA) que tu peux servir (distribuer).

**Comparaison APK vs AAB** :

| APK (Android Package) | AAB (Android App Bundle) |
| --- | --- |
| Fichier unique installable directement | Format optimisé pour le Google Play Store |
| Contient toutes les ressources pour tous les appareils | Google Play génère des APK optimisés par appareil |
| Plus gros en taille | Plus léger pour l'utilisateur final |
| Pour les tests et la distribution directe | Obligatoire pour publier sur Google Play |

---

### Qu'est-ce qu'EAS Build ?

**Définition** : EAS (Expo Application Services) Build est un service cloud d'Expo qui compile ton application sur des serveurs distants. Tu n'as pas besoin d'installer Android Studio ou Xcode sur ta machine pour générer les fichiers binaires.

**Le problème qu'EAS Build résout** :

Sans EAS Build, voici les problèmes rencontrés :

1. **Environnement complexe** : compiler pour iOS nécessite un Mac avec Xcode (15 Go). Compiler pour Android nécessite Android Studio, le SDK Android et le JDK Java.
2. **Pas de Mac** : sans Mac, impossible de compiler pour iOS. Or la majorité des développeurs utilisent Windows ou Linux.
3. **Configuration fastidieuse** : configurer les certificats de signature, les profils de provisioning et les keystores est un processus long et sujet aux erreurs.

**Comment EAS Build résout ces problèmes** :

| Problème | Solution apportée par EAS Build |
| --- | --- |
| Environnement complexe | La compilation se fait sur les serveurs d'Expo |
| Pas de Mac | Les serveurs Expo ont macOS pour compiler iOS |
| Configuration fastidieuse | EAS gère automatiquement les certificats et keystores |

**Analogie concrète** : EAS Build, c'est comme un service d'impression en ligne. Tu envoies ton document (le code), le service l'imprime (le compile) sur des machines professionnelles et te livre le résultat (le fichier APK/IPA). Tu n'as pas besoin d'avoir une imprimante chez toi.

**Ce qu'EAS Build n'est PAS** :

- EAS Build n'est pas gratuit de façon illimitée. Le plan gratuit offre 15 builds Android et 15 builds iOS par mois (file d'attente basse priorité). Le plan payant offre des builds prioritaires et plus de builds.
- EAS Build n'est pas obligatoire. Tu peux compiler localement avec `npx expo run:android` et `npx expo run:ios` si tu as les outils installés.

---

### Qu'est-ce qu'une mise à jour OTA ?

**Définition** : OTA (Over The Air) est un mécanisme qui permet de mettre à jour le code JavaScript et les ressources d'une application mobile sans la republier sur les stores. L'application télécharge la mise à jour au démarrage et l'applique automatiquement.

**Le problème que les mises à jour OTA résolvent** :

Sans mises à jour OTA, voici les problèmes rencontrés :

1. **Délai de publication** : chaque mise à jour doit passer par la review des stores (1 à 3 jours pour Apple, quelques heures pour Google).
2. **Adoption lente** : même après publication, les utilisateurs doivent manuellement mettre à jour l'application.
3. **Corrections urgentes** : un bug critique découvert en production nécessite de refaire le cycle complet de build et publication.

**Comment les mises à jour OTA résolvent ces problèmes** :

| Problème | Solution apportée par les mises à jour OTA |
| --- | --- |
| Délai de publication | La mise à jour est disponible immédiatement |
| Adoption lente | L'application se met à jour automatiquement au démarrage |
| Corrections urgentes | Le correctif est déployé en quelques minutes |

**Analogie concrète** : Les mises à jour OTA, c'est comme un site web. Quand tu modifies une page web, les visiteurs voient la nouvelle version au prochain chargement, sans rien installer. Les mises à jour OTA fonctionnent de la même façon pour le code JavaScript de ton application.

**Ce que les mises à jour OTA ne peuvent PAS faire** :

- Modifier le code natif (nouvelles librairies natives, nouvelles permissions)
- Changer la version du SDK Expo
- Ajouter un nouveau module natif (caméra, Bluetooth)

Pour ces changements, un nouveau build est nécessaire.

---

## Étapes pratiques

### Étape 1 : Installer et configurer EAS CLI

```bash
# Installer EAS CLI globalement
npm install -g eas-cli

# Se connecter à son compte Expo
eas login
```

**Résultat attendu** :

```text
Log in to EAS
Email or username: ton-email@exemple.com
Password: ********
Logged in
```

Configurer le projet pour EAS Build :

```bash
# Initialiser la configuration EAS dans le projet
eas build:configure
```

Cette commande crée un fichier `eas.json` à la racine du projet :

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

Explication des profils :

| Profil | Usage | Distribution |
| --- | --- | --- |
| `development` | Build de développement avec outils de debug | Interne (testeurs) |
| `preview` | Build de test sans outils de debug | Interne (testeurs) |
| `production` | Build final pour les stores | Stores (public) |

---

### Étape 2 : Configurer app.json

Le fichier `app.json` (ou `app.config.js`) contient les métadonnées de l'application :

```json
{
  "expo": {
    "name": "Mon Application",
    "slug": "mon-application",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.tonnom.monapplication",
      "buildNumber": "1",
      "infoPlist": {
        "NSCameraUsageDescription": "L'application utilise la caméra pour prendre des photos de profil.",
        "NSLocationWhenInUseUsageDescription": "L'application utilise la localisation pour afficher les services à proximité."
      }
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.tonnom.monapplication",
      "versionCode": 1,
      "permissions": [
        "CAMERA",
        "ACCESS_FINE_LOCATION"
      ]
    },
    "plugins": [
      "expo-camera",
      "expo-location"
    ]
  }
}
```

Points importants de la configuration :

| Champ | Description | Exemple |
| --- | --- | --- |
| `name` | Nom affiché sous l'icône | "Mon Application" |
| `slug` | Identifiant URL unique sur Expo | "mon-application" |
| `version` | Version affichée à l'utilisateur | "1.0.0" |
| `ios.bundleIdentifier` | Identifiant unique iOS (format DNS inversé) | "com.tonnom.monapplication" |
| `android.package` | Identifiant unique Android | "com.tonnom.monapplication" |
| `ios.buildNumber` | Numéro de build incrémental pour l'App Store | "1", "2", "3" |
| `android.versionCode` | Numéro de build incrémental pour Google Play | 1, 2, 3 |

---

### Étape 3 : Lancer un build

```bash
# Build Android (APK pour tests)
eas build --platform android --profile preview

# Build iOS (simulateur)
eas build --platform ios --profile development

# Build production pour les deux plateformes
eas build --platform all --profile production
```

Le processus de build :

```text
Compressing project files and uploading to EAS Build...
Build details: https://expo.dev/accounts/tonnom/builds/abc123

Waiting for build to complete. You can press Ctrl+C to exit.

Build is in queue...
Build is running...

Android build completed.
Download: https://expo.dev/artifacts/eas/abc123.apk
```

**Résultat attendu** : après quelques minutes (5 à 15 min selon la file d'attente), un lien de téléchargement pour le fichier APK ou IPA.

---

### Étape 4 : Tester le build

Pour Android, télécharge l'APK et installe-le directement :

```bash
# Télécharger le dernier build Android
eas build:list --platform android --limit 1

# Installer sur un appareil connecté via ADB
adb install chemin-vers-le.apk
```

Pour iOS, utilise le profil `development` avec un simulateur :

```bash
# Build pour le simulateur iOS
eas build --platform ios --profile development

# Le fichier .tar.gz sera téléchargeable depuis le dashboard Expo
```

Partager le build avec des testeurs (distribution interne) :

```bash
# Créer un lien de téléchargement pour les testeurs
# Le profil "preview" génère un build installable via un lien
eas build --platform android --profile preview
```

---

### Étape 5 : Publier sur les stores

Configurer la soumission automatique :

```bash
# Soumettre sur Google Play Store
eas submit --platform android --profile production

# Soumettre sur l'App Store
eas submit --platform ios --profile production
```

Pour Google Play, tu dois d'abord :

1. Créer un compte Google Play Console (25 dollars unique)
2. Créer l'application dans la console
3. Configurer une clé de service pour l'upload automatique

```bash
# Configurer les identifiants Google Play
eas credentials --platform android
```

Pour l'App Store, tu dois d'abord :

1. Créer un compte Apple Developer (99 dollars/an)
2. Créer l'application dans App Store Connect
3. EAS gère automatiquement les certificats de signature

```bash
# Configurer les identifiants Apple
eas credentials --platform ios
```

Automatiser le build et la soumission en une commande :

```bash
# Build production + soumission automatique
eas build --platform all --profile production --auto-submit
```

---

### Étape 6 : Mises à jour OTA avec EAS Update

```bash
# Installer le module de mise à jour
npx expo install expo-updates
```

Configurer `eas.json` pour les mises à jour :

```json
{
  "build": {
    "production": {
      "channel": "production"
    },
    "preview": {
      "channel": "preview",
      "distribution": "internal"
    }
  }
}
```

Envoyer une mise à jour OTA :

```bash
# Publier une mise à jour sur le canal production
eas update --channel production --message "Correction du bug d'affichage"

# Publier une mise à jour sur le canal preview (testeurs)
eas update --channel preview --message "Nouvelle fonctionnalité de recherche"
```

**Résultat attendu** :

```text
Publishing update...

Update published!
Branch: production
Message: Correction du bug d'affichage
Runtime version: 1.0.0
Platform: android, ios
```

Les utilisateurs recevront la mise à jour au prochain démarrage de l'application, sans passer par les stores.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npm install -g eas-cli` | Installer EAS CLI |
| `eas login` | Se connecter au compte Expo |
| `eas build:configure` | Initialiser la configuration EAS |
| `eas build --platform android` | Lancer un build Android |
| `eas build --platform ios` | Lancer un build iOS |
| `eas build --platform all` | Lancer un build pour les deux plateformes |
| `eas build:list` | Lister les builds récents |
| `eas submit --platform android` | Soumettre sur Google Play |
| `eas submit --platform ios` | Soumettre sur l'App Store |
| `eas update --channel production` | Publier une mise à jour OTA |
| `eas credentials` | Gérer les certificats et clés de signature |
| `eas build --auto-submit` | Build + soumission automatique |

---

## Pièges fréquents

### Piège 1 : Oublier d'incrémenter le versionCode/buildNumber

**Problème** : Les stores refusent un build si le numéro de version est identique ou inférieur au précédent. Le message d'erreur est "Version code already used".

**Solution** : Incrémente `android.versionCode` et `ios.buildNumber` dans `app.json` avant chaque nouveau build de production.

```json
{
  "android": {
    "versionCode": 2
  },
  "ios": {
    "buildNumber": "2"
  }
}
```

Tu peux aussi utiliser l'auto-incrémentation :

```bash
# EAS incrémente automatiquement le numéro de build
eas build --platform all --auto-submit --auto-increment
```

### Piège 2 : Ne pas configurer les messages de permissions iOS

**Problème** : Apple rejette l'application si les messages de permissions ne sont pas renseignés dans `infoPlist`. Le message doit expliquer pourquoi l'application a besoin de cette permission.

**Solution** : Ajoute un message clair pour chaque permission dans `app.json` :

```json
{
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "Pour prendre des photos de profil",
      "NSLocationWhenInUseUsageDescription": "Pour trouver les restaurants proches"
    }
  }
}
```

### Piège 3 : Confondre mise à jour OTA et nouveau build

**Problème** : Tu ajoutes un nouveau module natif (comme `expo-camera`) et tu essaies de le déployer via une mise à jour OTA. L'application crashe car le module natif n'est pas inclus dans le build existant.

**Solution** : Les mises à jour OTA ne peuvent modifier que le code JavaScript et les ressources (images, polices). Pour ajouter un module natif, tu dois faire un nouveau build complet.

| Type de changement | Mise à jour OTA | Nouveau build |
| --- | --- | --- |
| Correction de bug JavaScript | Oui | Non nécessaire |
| Modification de texte ou de style | Oui | Non nécessaire |
| Ajout d'un module natif | Non | Obligatoire |
| Changement de permissions | Non | Obligatoire |
| Mise à jour du SDK Expo | Non | Obligatoire |

### Piège 4 : Utiliser un APK pour publier sur Google Play

**Problème** : Google Play exige le format AAB (Android App Bundle) depuis 2021, pas un APK. Le profil `preview` génère un APK, le profil `production` génère un AAB.

**Solution** : Utilise le profil `production` pour les soumissions sur Google Play. Le profil `preview` (APK) est réservé aux tests internes.

---

## Checklist de validation

- J'ai installé EAS CLI et je suis connecté à mon compte Expo
- J'ai configuré le fichier `eas.json` avec les profils development, preview et production
- J'ai renseigné `bundleIdentifier` (iOS) et `package` (Android) dans `app.json`
- Je sais lancer un build Android et télécharger l'APK
- Je sais lancer un build iOS
- Je comprends la différence entre APK (tests) et AAB (Google Play)
- Je sais soumettre un build sur les stores avec `eas submit`
- Je sais envoyer une mise à jour OTA avec `eas update`
- Je sais quand utiliser une mise à jour OTA et quand faire un nouveau build

---

## Exercice pratique

**Énoncé** : Configure le déploiement complet d'une application Expo.

**Indications** :

- Initialise EAS dans ton projet avec `eas build:configure`
- Configure `app.json` avec un nom, un slug, un identifiant de package, une icône et un écran de démarrage (splash screen)
- Configure les profils dans `eas.json` : development (simulateur), preview (APK interne), production (stores)
- Lance un build preview pour Android et vérifie qu'il se termine avec succès
- Après le build, envoie une mise à jour OTA fictive avec `eas update`

**Résultat attendu** : un fichier APK téléchargeable depuis le dashboard Expo, et une mise à jour OTA publiée sur le canal preview.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Étape 1** : Installer et configurer EAS.

```bash
# Installer EAS CLI si ce n'est pas déjà fait
npm install -g eas-cli

# Se connecter
eas login

# Initialiser la configuration
eas build:configure
```

**Étape 2** : Configurer `app.json`.

```json
{
  "expo": {
    "name": "Mon App de Test",
    "slug": "mon-app-test",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#007AFF"
    },
    "ios": {
      "supportsTablet": false,
      "bundleIdentifier": "com.monnom.monapptest",
      "buildNumber": "1"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#007AFF"
      },
      "package": "com.monnom.monapptest",
      "versionCode": 1
    }
  }
}
```

**Étape 3** : Configurer `eas.json`.

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "channel": "preview",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "channel": "production",
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

**Étape 4** : Lancer le build preview.

```bash
# Build Android en mode preview (APK)
eas build --platform android --profile preview
```

Attendre que le build se termine (5 a 15 minutes). Le lien de téléchargement sera affiché dans le terminal et disponible sur le dashboard Expo.

**Étape 5** : Envoyer une mise à jour OTA.

```bash
# Installer expo-updates si pas déjà fait
npx expo install expo-updates

# Publier une mise à jour OTA sur le canal preview
eas update --channel preview --message "Premier déploiement OTA de test"
```

Vérifier sur le dashboard Expo que la mise à jour est bien publiée.

---

## Navigation

← Fiche précédente : **[Formulaires et validation](08-formulaires-validation.md)**

→ Fiche suivante : **[Projet intégrateur](10-projet-integrateur.md)**
