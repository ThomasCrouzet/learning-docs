---
tags:
  - Mobile
  - Intermédiaire
  - Pratique
description: "Accéder aux fonctionnalités natives du téléphone : caméra, géolocalisation, notifications push et gestion des permissions."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 13
cursus: "Dev Mobile"
---

# 07 - Fonctionnalités natives

> **En bref** : Apprendre à utiliser la caméra, la géolocalisation et les notifications push dans une application React Native avec Expo, et comprendre le système de permissions. Lecture estimée : 75 min.

## Prérequis

- [API et réseau](06-api-reseau.md) terminée
- Savoir utiliser les hooks React (`useState`, `useEffect`)
- Avoir un appareil physique ou Expo Go pour tester (le simulateur ne supporte pas toutes les fonctionnalités natives)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras prendre une photo avec la caméra, obtenir la position GPS de l'utilisateur, envoyer des notifications push et gérer correctement les demandes de permissions.

---

## Concepts

### Qu'est-ce qu'une fonctionnalité native ?

**Définition** : Une fonctionnalité native est une capacité matérielle ou logicielle fournie par le système d'exploitation mobile (iOS ou Android). Cela inclut la caméra, le GPS, les notifications, l'accéléromètre, le Bluetooth, les contacts et bien d'autres. React Native accède à ces fonctionnalités via des modules pont (bridge) qui font le lien entre le code JavaScript et le code natif.

**Le problème que les fonctionnalités natives résolvent** :

Sans accès aux fonctionnalités natives, voici les problèmes rencontrés :

1. **Fonctionnalité limitée** : l'application ne peut pas prendre de photos, scanner de QR codes ou utiliser le GPS - elle se comporte comme un simple site web.
2. **Expérience utilisateur pauvre** : pas de notifications pour prévenir l'utilisateur, pas de vibrations pour le feedback haptique, pas d'accès au carnet d'adresses.
3. **Pas de différenciation** : sans ces fonctionnalités, il n'y a pas d'intérêt à créer une application mobile plutôt qu'un site web responsive.

**Comment les fonctionnalités natives résolvent ces problèmes** :

| Problème | Solution apportée par les fonctionnalités natives |
| --- | --- |
| Fonctionnalité limitée | Accès complet au matériel (caméra, GPS, capteurs) |
| Expérience utilisateur pauvre | Notifications, vibrations, haptique, intégration système |
| Pas de différenciation | L'application utilise pleinement les capacités du téléphone |

**Analogie concrète** : Une application sans fonctionnalités natives, c'est comme une voiture sans volant, sans klaxon et sans phares - elle a un moteur, mais tu ne peux pas interagir avec l'environnement. Les fonctionnalités natives sont les commandes qui te permettent de conduire véritablement.

**Ce que les fonctionnalités natives ne sont PAS** :

- Les fonctionnalités natives ne sont pas automatiquement disponibles. Chaque fonctionnalité nécessite une permission explicite de l'utilisateur (voir la section Permissions ci-dessous).
- Les fonctionnalités natives ne sont pas identiques sur iOS et Android. Certaines API diffèrent entre les deux systèmes. Expo fournit une couche d'abstraction qui unifie les deux.

---

### Qu'est-ce que le système de permissions ?

**Définition** : Le système de permissions est le mécanisme par lequel le système d'exploitation mobile demande à l'utilisateur s'il autorise l'application à accéder à une fonctionnalité sensible (caméra, position, contacts, microphone). L'utilisateur peut accepter, refuser ou révoquer cette permission à tout moment.

**Le problème que les permissions résolvent** :

Sans système de permissions, voici les problèmes rencontrés :

1. **Vie privée menacée** : n'importe quelle application pourrait accéder à la caméra, au microphone ou à la position sans que l'utilisateur le sache.
2. **Abus possibles** : une application de lampe torche pourrait lire les contacts ou envoyer des SMS.
3. **Pas de contrôle** : l'utilisateur n'aurait aucun moyen de limiter ce qu'une application peut faire sur son téléphone.

**Comment les permissions résolvent ces problèmes** :

| Problème | Solution apportée par les permissions |
| --- | --- |
| Vie privée menacée | L'utilisateur choisit explicitement ce qu'il partage |
| Abus possibles | Chaque fonctionnalité sensible est protégée individuellement |
| Pas de contrôle | L'utilisateur peut révoquer une permission à tout moment dans les réglages |

**Analogie concrète** : Les permissions, c'est comme les clés de ta maison. Tu ne donnes pas un passe-partout à chaque visiteur. Tu donnes la clé de la cuisine à l'un, la clé du garage à l'autre. Et tu peux changer les serrures quand tu veux.

**Les différents états d'une permission** :

| État | Signification | Que faire |
| --- | --- | --- |
| `undetermined` | L'utilisateur n'a pas encore été sollicité | Demander la permission |
| `granted` | L'utilisateur a accepté | Utiliser la fonctionnalité |
| `denied` | L'utilisateur a refusé | Afficher un message explicatif |

---

## Étapes pratiques

### Étape 1 : Utiliser la caméra avec expo-camera

Installe le module caméra et le sélecteur d'images :

```bash
# Installer les modules caméra et image
npx expo install expo-camera expo-image-picker
```

Créer un écran qui prend une photo avec le sélecteur d'images (plus simple que la caméra en plein écran) :

```tsx
// screens/CameraScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
} from "react-native";
import * as ImagePicker from "expo-image-picker";

export default function CameraScreen() {
  // Stocker l'URI de la photo prise
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  // Prendre une photo avec la caméra
  const takePhoto = async () => {
    // Étape 1 : Demander la permission d'accéder à la caméra
    const permission = await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      // L'utilisateur a refusé - expliquer pourquoi on a besoin de la caméra
      Alert.alert(
        "Permission requise",
        "L'accès à la caméra est nécessaire pour prendre une photo. " +
        "Tu peux l'activer dans les réglages de ton téléphone."
      );
      return;
    }

    // Étape 2 : Ouvrir la caméra
    const result = await ImagePicker.launchCameraAsync({
      // Autoriser l'édition (recadrage) avant validation
      allowsEditing: true,
      // Ratio carré
      aspect: [1, 1],
      // Qualité de compression (0 = minimum, 1 = maximum)
      quality: 0.8,
    });

    // Étape 3 : Vérifier que l'utilisateur n'a pas annulé
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  // Choisir une photo depuis la galerie
  const pickFromGallery = async () => {
    // Demander la permission d'accéder à la galerie
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        "Permission requise",
        "L'accès à la galerie est nécessaire pour choisir une photo."
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      // Type de média : images uniquement (pas de vidéos)
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Photo de profil</Text>

      {/* Aperçu de la photo */}
      <View style={styles.photoContainer}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photo} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={styles.placeholderText}>Aucune photo</Text>
          </View>
        )}
      </View>

      {/* Boutons d'action */}
      <Pressable style={styles.button} onPress={takePhoto}>
        <Text style={styles.buttonText}>Prendre une photo</Text>
      </Pressable>

      <Pressable
        style={[styles.button, styles.secondaryButton]}
        onPress={pickFromGallery}
      >
        <Text style={[styles.buttonText, styles.secondaryText]}>
          Choisir depuis la galerie
        </Text>
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
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  photoContainer: {
    marginBottom: 32,
  },
  photo: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  placeholder: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  placeholderText: {
    color: "#999",
    fontSize: 16,
  },
  button: {
    backgroundColor: "#007AFF",
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  secondaryButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  secondaryText: {
    color: "#007AFF",
  },
});
```

**Résultat attendu** : un écran avec un espace circulaire pour la photo, un bouton pour prendre une photo avec la caméra et un bouton pour choisir dans la galerie. La photo sélectionnée s'affiche dans le cercle.

---

### Étape 2 : Obtenir la position GPS avec expo-location

```bash
# Installer le module de géolocalisation
npx expo install expo-location
```

```tsx
// screens/LocationScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import * as Location from "expo-location";

type LocationData = {
  latitude: number;
  longitude: number;
  altitude: number | null;
  accuracy: number | null;
};

export default function LocationScreen() {
  const [location, setLocation] = useState<LocationData | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const getLocation = async () => {
    try {
      setLoading(true);

      // Étape 1 : Demander la permission de localisation
      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert(
          "Permission requise",
          "L'accès à la localisation est nécessaire pour afficher ta position."
        );
        return;
      }

      // Étape 2 : Obtenir la position actuelle
      const position = await Location.getCurrentPositionAsync({
        // Précision : Balanced = bon compromis entre précision et vitesse
        accuracy: Location.Accuracy.Balanced,
      });

      const coords: LocationData = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        altitude: position.coords.altitude,
        accuracy: position.coords.accuracy,
      };

      setLocation(coords);

      // Étape 3 : Convertir les coordonnées en adresse lisible
      const addresses = await Location.reverseGeocodeAsync({
        latitude: coords.latitude,
        longitude: coords.longitude,
      });

      if (addresses.length > 0) {
        const addr = addresses[0];
        // Construire une adresse lisible à partir des composants
        const parts = [
          addr.streetNumber,
          addr.street,
          addr.postalCode,
          addr.city,
          addr.country,
        ].filter(Boolean); // Retirer les valeurs nulles
        setAddress(parts.join(" "));
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'obtenir la position.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ma position</Text>

      <Pressable
        style={styles.button}
        onPress={getLocation}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Obtenir ma position</Text>
        )}
      </Pressable>

      {location && (
        <View style={styles.resultCard}>
          <Text style={styles.resultTitle}>Coordonnées GPS</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Latitude :</Text>
            <Text style={styles.value}>
              {location.latitude.toFixed(6)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Longitude :</Text>
            <Text style={styles.value}>
              {location.longitude.toFixed(6)}
            </Text>
          </View>

          {location.altitude !== null && (
            <View style={styles.row}>
              <Text style={styles.label}>Altitude :</Text>
              <Text style={styles.value}>
                {location.altitude.toFixed(1)} m
              </Text>
            </View>
          )}

          {location.accuracy !== null && (
            <View style={styles.row}>
              <Text style={styles.label}>Précision :</Text>
              <Text style={styles.value}>
                +/- {location.accuracy.toFixed(0)} m
              </Text>
            </View>
          )}

          {address && (
            <View style={styles.addressBox}>
              <Text style={styles.label}>Adresse :</Text>
              <Text style={styles.addressText}>{address}</Text>
            </View>
          )}
        </View>
      )}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  resultCard: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 12,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 15,
    color: "#666",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  addressBox: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  addressText: {
    fontSize: 15,
    marginTop: 4,
    lineHeight: 22,
  },
});
```

**Résultat attendu** : un bouton "Obtenir ma position". Quand tu appuies, l'application demande la permission de localisation, puis affiche les coordonnées GPS et l'adresse correspondante.

---

### Étape 3 : Notifications push avec expo-notifications

```bash
# Installer les modules de notifications et de constantes
npx expo install expo-notifications expo-device expo-constants
```

```tsx
// screens/NotificationsScreen.tsx
import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import Constants from "expo-constants";

// Configurer le comportement des notifications quand l'app est au premier plan
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    // SDK 53+ : shouldShowAlert est remplacé par bannière + liste
    shouldShowBanner: true,
    shouldShowList: true,
    // Jouer un son
    shouldPlaySound: true,
    // Afficher le badge sur l'icône
    shouldSetBadge: true,
  }),
});

export default function NotificationsScreen() {
  const [pushToken, setPushToken] = useState<string | null>(null);
  const [lastNotification, setLastNotification] =
    useState<Notifications.Notification | null>(null);
  // Ref pour stocker les abonnements et les nettoyer
  const notificationListener = useRef<Notifications.EventSubscription | null>(null);

  useEffect(() => {
    // Enregistrer le token push au montage
    registerForPushNotifications();

    // Écouter les notifications reçues quand l'app est ouverte
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setLastNotification(notification);
      });

    // Nettoyage au démontage (SDK actuel : EventSubscription.remove())
    return () => {
      notificationListener.current?.remove();
    };
  }, []);

  // Obtenir le token push pour les notifications distantes
  const registerForPushNotifications = async () => {
    // Les notifications push ne fonctionnent que sur un appareil physique
    if (!Device.isDevice) {
      Alert.alert("Info", "Les notifications push nécessitent un appareil physique.");
      return;
    }

    // Demander la permission
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== "granted") {
      Alert.alert(
        "Permission requise",
        "Les notifications sont désactivées. Active-les dans les réglages."
      );
      return;
    }

    // Obtenir le token Expo Push
    const tokenData = await Notifications.getExpoPushTokenAsync({
      projectId: Constants.expoConfig?.extra?.eas?.projectId,
    });
    setPushToken(tokenData.data);

    // Sur Android, configurer le canal de notification
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "Par défaut",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
      });
    }
  };

  // Envoyer une notification locale (pour tester)
  const sendLocalNotification = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel",
        body: "N'oublie pas de terminer ton exercice pratique !",
        // Données personnalisées accessibles quand l'utilisateur tape sur la notification
        data: { screen: "exercises", id: 42 },
      },
      trigger: {
        // Déclencher dans 3 secondes
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 3,
      },
    });

    Alert.alert("Envoyé", "Tu recevras une notification dans 3 secondes.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>

      {/* Token push */}
      {pushToken && (
        <View style={styles.tokenBox}>
          <Text style={styles.tokenLabel}>Token Expo Push :</Text>
          <Text style={styles.tokenValue} selectable>
            {pushToken}
          </Text>
        </View>
      )}

      {/* Bouton pour envoyer une notification locale */}
      <Pressable style={styles.button} onPress={sendLocalNotification}>
        <Text style={styles.buttonText}>
          Envoyer une notification dans 3s
        </Text>
      </Pressable>

      {/* Dernière notification reçue */}
      {lastNotification && (
        <View style={styles.notifBox}>
          <Text style={styles.notifLabel}>Dernière notification :</Text>
          <Text style={styles.notifTitle}>
            {lastNotification.request.content.title}
          </Text>
          <Text style={styles.notifBody}>
            {lastNotification.request.content.body}
          </Text>
        </View>
      )}
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
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 24,
  },
  tokenBox: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
  },
  tokenLabel: {
    fontWeight: "600",
    marginBottom: 4,
  },
  tokenValue: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 24,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  notifBox: {
    backgroundColor: "#E8F5E9",
    padding: 16,
    borderRadius: 8,
  },
  notifLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  notifTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  notifBody: {
    fontSize: 14,
    color: "#333",
  },
});
```

**Résultat attendu** : un écran affichant le token push (sur appareil physique) et un bouton pour envoyer une notification locale. La notification apparaît 3 secondes après avoir appuyé sur le bouton.

---

### Étape 4 : Gérer les permissions proprement

Créer un hook réutilisable pour centraliser la gestion des permissions :

```tsx
// hooks/usePermission.ts
import { useState, useEffect } from "react";
import { Alert, Linking, Platform } from "react-native";

type PermissionStatus = "undetermined" | "granted" | "denied";

type UsePermissionOptions = {
  // Fonction pour vérifier l'état actuel de la permission
  check: () => Promise<{ status: string }>;
  // Fonction pour demander la permission
  request: () => Promise<{ status: string }>;
  // Nom de la permission pour les messages d'erreur
  name: string;
};

export function usePermission(options: UsePermissionOptions) {
  const { check, request, name } = options;
  const [status, setStatus] = useState<PermissionStatus>("undetermined");

  // Vérifier l'état de la permission au montage
  useEffect(() => {
    checkPermission();
  }, []);

  const checkPermission = async () => {
    const result = await check();
    setStatus(result.status as PermissionStatus);
  };

  // Demander la permission avec gestion du refus
  const requestPermission = async (): Promise<boolean> => {
    // Si déjà accordée, retourner immédiatement
    if (status === "granted") return true;

    const result = await request();
    const newStatus = result.status as PermissionStatus;
    setStatus(newStatus);

    if (newStatus === "granted") return true;

    // Si refusée, proposer d'ouvrir les réglages
    Alert.alert(
      `${name} - Permission refusée`,
      `L'accès à ${name.toLowerCase()} est nécessaire pour cette fonctionnalité. ` +
      "Tu peux l'activer dans les réglages de ton téléphone.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Ouvrir les réglages",
          onPress: () => {
            // Ouvrir la page des réglages de l'application
            if (Platform.OS === "ios") {
              Linking.openURL("app-settings:");
            } else {
              Linking.openSettings();
            }
          },
        },
      ]
    );

    return false;
  };

  return { status, requestPermission };
}
```

Utiliser le hook dans un composant :

```tsx
// Exemple d'utilisation dans un composant
import * as Location from "expo-location";
import { usePermission } from "../hooks/usePermission";

function MyComponent() {
  const locationPermission = usePermission({
    check: Location.getForegroundPermissionsAsync,
    request: Location.requestForegroundPermissionsAsync,
    name: "Localisation",
  });

  const handleGetLocation = async () => {
    // Demander la permission si nécessaire
    const granted = await locationPermission.requestPermission();
    if (!granted) return;

    // La permission est accordée, utiliser la localisation
    const position = await Location.getCurrentPositionAsync();
    console.log(position.coords);
  };

  return (
    <Pressable onPress={handleGetLocation}>
      <Text>
        {locationPermission.status === "granted"
          ? "Position activée"
          : "Activer la localisation"}
      </Text>
    </Pressable>
  );
}
```

**Résultat attendu** : un hook réutilisable qui centralise la logique de demande de permission. Si l'utilisateur refuse, une alerte propose d'ouvrir les réglages du téléphone.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npx expo install expo-camera` | Installer le module caméra |
| `npx expo install expo-image-picker` | Installer le sélecteur d'images |
| `npx expo install expo-location` | Installer le module de géolocalisation |
| `npx expo install expo-notifications expo-device expo-constants` | Installer les modules de notifications |
| `ImagePicker.requestCameraPermissionsAsync()` | Demander la permission caméra |
| `Location.requestForegroundPermissionsAsync()` | Demander la permission de localisation |
| `Notifications.requestPermissionsAsync()` | Demander la permission de notifications |
| `Notifications.scheduleNotificationAsync()` | Planifier une notification locale |
| `Location.reverseGeocodeAsync()` | Convertir des coordonnées en adresse |

---

## Pièges fréquents

### Piège 1 : Tester les notifications push dans Expo Go

**Problème** : Les notifications push distantes ne sont plus disponibles dans Expo Go sur Android depuis le SDK 53 (un _development build_ est requis). Sur simulateur iOS / émulateur Android sans Play Services, le token push n'est pas obtenu non plus.

**Solution** : Pour les push distants, utilise un _development build_ (ou un appareil physique avec les credentials FCM/APNs). Les notifications **locales** (`scheduleNotificationAsync`) fonctionnent dans Expo Go et sur simulateur.

### Piège 2 : Oublier de gérer le refus de permission

**Problème** : L'application crashe ou affiche un écran vide quand l'utilisateur refuse une permission, car le code essaie d'utiliser la fonctionnalité sans vérifier.

**Solution** : Vérifie toujours le résultat de la demande de permission avant d'utiliser la fonctionnalité. Affiche un message explicatif en cas de refus.

```tsx
// Incorrect - crash si la permission est refusée
const position = await Location.getCurrentPositionAsync();

// Correct - vérification avant utilisation
const { status } = await Location.requestForegroundPermissionsAsync();
if (status !== "granted") {
  Alert.alert("Permission nécessaire", "...");
  return;
}
const position = await Location.getCurrentPositionAsync();
```

### Piège 3 : Demander toutes les permissions au démarrage

**Problème** : Demander la caméra, la position et les notifications dès l'ouverture de l'application effraie l'utilisateur, qui refuse tout.

**Solution** : Demande chaque permission au moment où tu en as besoin, dans le contexte d'utilisation. L'utilisateur comprend mieux pourquoi tu demandes l'accès à la caméra quand il appuie sur "Prendre une photo".

### Piège 4 : Ne pas configurer le canal Android pour les notifications

**Problème** : Sur Android 8+, les notifications ne s'affichent pas si aucun canal de notification n'est configuré.

**Solution** : Crée un canal de notification au démarrage de l'application.

```tsx
if (Platform.OS === "android") {
  Notifications.setNotificationChannelAsync("default", {
    name: "Par défaut",
    importance: Notifications.AndroidImportance.MAX,
  });
}
```

---

## Checklist de validation

- Je sais installer les modules Expo pour la caméra, la localisation et les notifications
- Je sais demander et vérifier les permissions avant d'utiliser une fonctionnalité native
- Je sais prendre une photo avec `expo-image-picker` et l'afficher
- Je sais obtenir la position GPS et la convertir en adresse lisible
- Je sais envoyer une notification locale programmée
- Je sais gérer le refus de permission avec un message explicatif
- Je sais diriger l'utilisateur vers les réglages pour activer une permission refusée

---

## Exercice pratique

**Énoncé** : Crée un écran "Mon profil" qui utilise trois fonctionnalités natives.

**Indications** :

- Une photo de profil prise avec la caméra ou choisie dans la galerie (circulaire, 150x150)
- Un bouton "Ma position" qui affiche la ville et le pays sous la photo
- Un bouton "Me rappeler" qui envoie une notification locale dans 10 secondes avec le message "Pense à mettre à jour ton profil"
- Gérer proprement les refus de permission pour chaque fonctionnalité
- Afficher l'état de chaque permission (accordée, refusée, non demandée)

**Résultat attendu** : un écran de profil fonctionnel qui combine photo, localisation et notifications, avec une gestion propre des permissions.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";

export default function ProfileScreen() {
  const [photo, setPhoto] = useState<string | null>(null);
  const [city, setCity] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Prendre ou choisir une photo
  const handlePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Active la caméra dans les réglages.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  // Obtenir la ville
  const handleLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Active la localisation dans les réglages.");
      return;
    }

    setLoadingLocation(true);
    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      const addresses = await Location.reverseGeocodeAsync(position.coords);
      if (addresses.length > 0) {
        const addr = addresses[0];
        setCity(`${addr.city}, ${addr.country}`);
      }
    } catch {
      Alert.alert("Erreur", "Impossible d'obtenir la position.");
    } finally {
      setLoadingLocation(false);
    }
  };

  // Envoyer un rappel
  const handleReminder = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission requise", "Active les notifications dans les réglages.");
      return;
    }

    await Notifications.scheduleNotificationAsync({
      content: {
        title: "Rappel profil",
        body: "Pense à mettre à jour ton profil !",
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
        seconds: 10,
      },
    });

    Alert.alert("Rappel programmé", "Tu recevras une notification dans 10 secondes.");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mon profil</Text>

      {/* Photo de profil */}
      <Pressable onPress={handlePhoto}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={styles.avatarText}>+</Text>
          </View>
        )}
      </Pressable>
      <Text style={styles.hint}>Appuie pour changer la photo</Text>

      {/* Ville */}
      <Pressable style={styles.button} onPress={handleLocation} disabled={loadingLocation}>
        {loadingLocation ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Ma position</Text>
        )}
      </Pressable>
      {city && <Text style={styles.infoText}>{city}</Text>}

      {/* Rappel */}
      <Pressable style={styles.button} onPress={handleReminder}>
        <Text style={styles.buttonText}>Me rappeler dans 10s</Text>
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
    alignItems: "center",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  avatar: { width: 150, height: 150, borderRadius: 75 },
  avatarPlaceholder: {
    backgroundColor: "#e0e0e0",
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 48, color: "#999" },
  hint: { color: "#999", fontSize: 14, marginTop: 8, marginBottom: 24 },
  button: {
    backgroundColor: "#007AFF",
    padding: 14,
    borderRadius: 8,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  infoText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 16,
    fontWeight: "500",
  },
});
```

---

## Navigation

← Fiche précédente : **[API et réseau](06-api-reseau.md)**

→ Fiche suivante : **[Formulaires et validation](08-formulaires-validation.md)**
