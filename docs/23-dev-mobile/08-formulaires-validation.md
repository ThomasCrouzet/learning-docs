---
tags:
  - Mobile
  - Intermédiaire
  - Pratique
description: "Créer des formulaires complets dans React Native avec TextInput, Picker, validation en temps réel et gestion du clavier."
estimated_time: "60 min"
fiche_number: 8
total_fiches: 13
cursus: "Dev Mobile"
id: "web.mobile.formulaires-validation"
course_id: "web.mobile"
content_type: "lesson"
order: 8
---

# 08 - Formulaires et validation

> **En bref** : Apprendre à créer des formulaires complets dans React Native avec TextInput, Picker et Switch, valider les saisies en temps réel et gérer le clavier sur mobile. Lecture estimée : 60 min.

## Prérequis

- [Fonctionnalités natives](07-fonctionnalites-natives.md) terminée
- Connaître `useState` et les événements en React
- Savoir styliser des composants avec `StyleSheet`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un formulaire complet avec différents types de champs, valider les saisies utilisateur en temps réel, afficher des messages d'erreur clairs et gérer le comportement du clavier sur mobile.

---

## Concepts

### Qu'est-ce qu'un formulaire dans une application mobile ?

**Définition** : Un formulaire mobile est un ensemble de champs de saisie (texte, sélecteurs, interrupteurs) qui permet à l'utilisateur d'entrer des données. Contrairement au web, un formulaire mobile doit composer avec un clavier virtuel qui masque une partie de l'écran et des interactions tactiles spécifiques.

**Le problème que les formulaires structurés résolvent** :

Sans formulaire bien conçu, voici les problèmes rencontrés :

1. **Données invalides** : l'utilisateur envoie un email sans "@" ou un mot de passe trop court, et l'API retourne une erreur incompréhensible.
2. **Clavier qui masque les champs** : quand l'utilisateur tape dans un champ en bas de l'écran, le clavier le recouvre et il ne voit plus ce qu'il saisit.
3. **Pas de feedback** : l'utilisateur ne sait pas si sa saisie est correcte avant de soumettre le formulaire complet.

**Comment les formulaires structurés résolvent ces problèmes** :

| Problème | Solution apportée par les formulaires structurés |
| --- | --- |
| Données invalides | Validation en temps réel avant l'envoi au serveur |
| Clavier qui masque les champs | `KeyboardAvoidingView` qui remonte le contenu |
| Pas de feedback | Messages d'erreur affichés sous chaque champ |

**Analogie concrète** : Un formulaire mobile bien conçu, c'est comme un formulaire papier avec des cases pré-formatées. Chaque case indique ce qu'il faut écrire (placeholder), la taille attendue (limite de caractères), et un exemple du format correct. Si tu te trompes, une annotation rouge te dit quoi corriger avant de soumettre le document.

**Ce qu'un formulaire mobile n'est PAS** :

- Un formulaire mobile n'est pas un formulaire HTML. Il n'y a pas de balise `<form>`, pas de `<input type="email">`, pas de validation native du navigateur. Tout doit être géré manuellement avec les composants React Native.
- Un formulaire mobile n'est pas soumis par la touche Entrée. La soumission se fait par un bouton explicite ou par la touche "Envoyer" du clavier (configurable).

---

### Qu'est-ce que la validation de formulaire ?

**Définition** : La validation de formulaire est le processus de vérification des données saisies par l'utilisateur avant de les envoyer au serveur. Elle peut être synchrone (vérification du format) ou asynchrone (vérification d'unicité via l'API).

**Le problème que la validation résout** :

Sans validation côté client, voici les problèmes rencontrés :

1. **Aller-retour réseau inutiles** : chaque erreur de saisie nécessite un appel au serveur qui retourne une erreur, ce qui est lent et consomme des données mobiles.
2. **Messages d'erreur techniques** : le serveur retourne des erreurs comme "422 Unprocessable Entity" au lieu de "L'adresse email est invalide".
3. **Frustration utilisateur** : l'utilisateur soumet le formulaire, attend le chargement, et découvre plusieurs erreurs d'un coup qu'il aurait pu corriger en amont.

**Comment la validation résout ces problèmes** :

| Problème | Solution apportée par la validation |
| --- | --- |
| Aller-retour réseau | Les erreurs de format sont détectées localement, sans appel réseau |
| Messages techniques | Les messages d'erreur sont rédigés en langage clair pour l'utilisateur |
| Frustration utilisateur | Les erreurs sont affichées en temps réel, champ par champ |

**Analogie concrète** : La validation, c'est comme un correcteur orthographique dans un traitement de texte. Il souligne les erreurs en rouge pendant que tu écris, sans attendre que tu aies fini tout le document. Tu corriges au fur et à mesure.

**Comparaison validation côté client vs côté serveur** :

| Validation côté client | Validation côté serveur |
| --- | --- |
| Instantanée (pas de réseau) | Nécessite un appel réseau |
| Améliore l'expérience utilisateur | Protège les données côté serveur |
| Contournable (l'utilisateur peut modifier le code) | Non contournable (sécurisée) |
| Vérifie le format | Vérifie la logique métier (unicité, droits) |

Les deux sont nécessaires. La validation côté client améliore l'expérience, la validation côté serveur assure la sécurité.

---

## Étapes pratiques

### Étape 1 : Formulaire basique avec TextInput

Créer un formulaire d'inscription avec des champs texte :

```tsx
// screens/RegisterScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

export default function RegisterScreen() {
  // Un état par champ du formulaire
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = () => {
    // Validation basique avant envoi
    if (!name.trim()) {
      Alert.alert("Erreur", "Le nom est obligatoire.");
      return;
    }
    if (!email.includes("@")) {
      Alert.alert("Erreur", "L'adresse email est invalide.");
      return;
    }
    if (password.length < 8) {
      Alert.alert("Erreur", "Le mot de passe doit contenir au moins 8 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Erreur", "Les mots de passe ne correspondent pas.");
      return;
    }

    Alert.alert("Inscription réussie", `Bienvenue ${name} !`);
  };

  return (
    // KeyboardAvoidingView remonte le contenu quand le clavier apparaît
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        {/* Champ nom */}
        <Text style={styles.label}>Nom complet</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Jean Dupont"
          // Majuscule automatique sur chaque mot
          autoCapitalize="words"
          // Type de clavier standard
          keyboardType="default"
          // Texte du bouton "Retour" du clavier
          returnKeyType="next"
        />

        {/* Champ email */}
        <Text style={styles.label}>Adresse email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="jean@exemple.com"
          // Pas de majuscule automatique pour les emails
          autoCapitalize="none"
          // Clavier avec @ et .com
          keyboardType="email-address"
          // Désactiver la correction automatique pour les emails
          autoCorrect={false}
          returnKeyType="next"
        />

        {/* Champ mot de passe */}
        <Text style={styles.label}>Mot de passe</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          placeholder="Minimum 8 caractères"
          // Masquer le texte saisi
          secureTextEntry
          autoCapitalize="none"
          returnKeyType="next"
        />

        {/* Confirmation du mot de passe */}
        <Text style={styles.label}>Confirmer le mot de passe</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Retape ton mot de passe"
          secureTextEntry
          autoCapitalize="none"
          // Soumettre le formulaire depuis le clavier
          returnKeyType="done"
          onSubmitEditing={handleSubmit}
        />

        {/* Bouton de soumission */}
        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
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
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});
```

**Résultat attendu** : un formulaire d'inscription avec 4 champs. Le clavier affiche "@" pour le champ email. Les mots de passe sont masqués. Le contenu remonte quand le clavier apparaît.

---

### Étape 2 : Validation en temps réel avec messages d'erreur

Ajouter une validation qui s'affiche pendant la saisie :

```tsx
// hooks/useFormValidation.ts
import { useState, useCallback } from "react";

// Type pour les règles de validation
type ValidationRule = {
  // Fonction qui retourne true si la valeur est valide
  test: (value: string) => boolean;
  // Message affiché si la valeur est invalide
  message: string;
};

// Type pour la configuration des champs
type FieldConfig = {
  rules: ValidationRule[];
};

// Type pour les erreurs
type Errors = Record<string, string | null>;

export function useFormValidation(
  config: Record<string, FieldConfig>
) {
  const [errors, setErrors] = useState<Errors>({});
  // Suivre quels champs ont été "touchés" (l'utilisateur a interagi)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Valider un champ spécifique
  const validateField = useCallback(
    (fieldName: string, value: string): string | null => {
      const fieldConfig = config[fieldName];
      if (!fieldConfig) return null;

      // Tester chaque règle dans l'ordre
      for (const rule of fieldConfig.rules) {
        if (!rule.test(value)) {
          return rule.message;
        }
      }
      return null; // Toutes les règles sont satisfaites
    },
    [config]
  );

  // Appelé quand l'utilisateur modifie un champ
  const handleChange = useCallback(
    (fieldName: string, value: string) => {
      // Ne valider que si le champ a été touché
      if (touched[fieldName]) {
        const error = validateField(fieldName, value);
        setErrors((prev) => ({ ...prev, [fieldName]: error }));
      }
    },
    [touched, validateField]
  );

  // Appelé quand l'utilisateur quitte un champ (onBlur)
  const handleBlur = useCallback(
    (fieldName: string, value: string) => {
      setTouched((prev) => ({ ...prev, [fieldName]: true }));
      const error = validateField(fieldName, value);
      setErrors((prev) => ({ ...prev, [fieldName]: error }));
    },
    [validateField]
  );

  // Valider tous les champs d'un coup (avant soumission)
  const validateAll = useCallback(
    (values: Record<string, string>): boolean => {
      const newErrors: Errors = {};
      let isValid = true;

      for (const [fieldName, fieldConfig] of Object.entries(config)) {
        const value = values[fieldName] || "";
        const error = validateField(fieldName, value);
        newErrors[fieldName] = error;
        if (error) isValid = false;
      }

      // Marquer tous les champs comme touchés
      const allTouched: Record<string, boolean> = {};
      for (const key of Object.keys(config)) {
        allTouched[key] = true;
      }
      setTouched(allTouched);
      setErrors(newErrors);

      return isValid;
    },
    [config, validateField]
  );

  return { errors, touched, handleChange, handleBlur, validateAll };
}
```

Utiliser le hook de validation :

```tsx
// screens/ValidatedFormScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useFormValidation } from "../hooks/useFormValidation";

// Règles de validation pour chaque champ
const validationConfig = {
  name: {
    rules: [
      { test: (v: string) => v.trim().length > 0, message: "Le nom est obligatoire" },
      {
        test: (v: string) => v.trim().length >= 2,
        message: "Le nom doit contenir au moins 2 caractères",
      },
    ],
  },
  email: {
    rules: [
      { test: (v: string) => v.trim().length > 0, message: "L'email est obligatoire" },
      {
        test: (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
        message: "L'adresse email est invalide",
      },
    ],
  },
  phone: {
    rules: [
      {
        test: (v: string) => v.length === 0 || /^[0-9]{10}$/.test(v),
        message: "Le numéro doit contenir 10 chiffres",
      },
    ],
  },
  password: {
    rules: [
      { test: (v: string) => v.length >= 8, message: "Minimum 8 caractères" },
      {
        test: (v: string) => /[A-Z]/.test(v),
        message: "Doit contenir au moins une majuscule",
      },
      {
        test: (v: string) => /[0-9]/.test(v),
        message: "Doit contenir au moins un chiffre",
      },
    ],
  },
};

export default function ValidatedFormScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { errors, touched, handleChange, handleBlur, validateAll } =
    useFormValidation(validationConfig);

  // Mise à jour d'un champ avec validation
  const updateField = (
    fieldName: string,
    value: string,
    setter: (v: string) => void
  ) => {
    setter(value);
    handleChange(fieldName, value);
  };

  const handleSubmit = () => {
    const isValid = validateAll({ name, email, phone, password });
    if (isValid) {
      Alert.alert("Formulaire valide", "Toutes les données sont correctes.");
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        {/* Champ nom avec erreur */}
        <Text style={styles.label}>Nom complet *</Text>
        <TextInput
          style={[
            styles.input,
            // Bordure rouge si erreur et champ touché
            touched.name && errors.name ? styles.inputError : null,
          ]}
          value={name}
          onChangeText={(v) => updateField("name", v, setName)}
          onBlur={() => handleBlur("name", name)}
          placeholder="Jean Dupont"
          autoCapitalize="words"
        />
        {/* Message d'erreur */}
        {touched.name && errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}

        {/* Champ email avec erreur */}
        <Text style={styles.label}>Adresse email *</Text>
        <TextInput
          style={[
            styles.input,
            touched.email && errors.email ? styles.inputError : null,
          ]}
          value={email}
          onChangeText={(v) => updateField("email", v, setEmail)}
          onBlur={() => handleBlur("email", email)}
          placeholder="jean@exemple.com"
          autoCapitalize="none"
          keyboardType="email-address"
          autoCorrect={false}
        />
        {touched.email && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        {/* Champ téléphone (optionnel) */}
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={[
            styles.input,
            touched.phone && errors.phone ? styles.inputError : null,
          ]}
          value={phone}
          onChangeText={(v) => updateField("phone", v, setPhone)}
          onBlur={() => handleBlur("phone", phone)}
          placeholder="0612345678"
          keyboardType="phone-pad"
          maxLength={10}
        />
        {touched.phone && errors.phone && (
          <Text style={styles.errorText}>{errors.phone}</Text>
        )}

        {/* Champ mot de passe avec indicateur de force */}
        <Text style={styles.label}>Mot de passe *</Text>
        <TextInput
          style={[
            styles.input,
            touched.password && errors.password ? styles.inputError : null,
          ]}
          value={password}
          onChangeText={(v) => updateField("password", v, setPassword)}
          onBlur={() => handleBlur("password", password)}
          placeholder="Minimum 8 caractères"
          secureTextEntry
          autoCapitalize="none"
        />
        {touched.password && errors.password && (
          <Text style={styles.errorText}>{errors.password}</Text>
        )}

        {/* Indicateur de force du mot de passe */}
        {password.length > 0 && (
          <PasswordStrength password={password} />
        )}

        <Pressable style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>S'inscrire</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// Composant indicateur de force du mot de passe
function PasswordStrength({ password }: { password: string }) {
  // Calculer la force (0 à 4)
  let strength = 0;
  if (password.length >= 8) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  const labels = ["Faible", "Faible", "Moyen", "Fort", "Excellent"];
  const colors = ["#FF3B30", "#FF9500", "#FFCC00", "#34C759", "#007AFF"];

  return (
    <View style={styles.strengthContainer}>
      <View style={styles.strengthBar}>
        {[0, 1, 2, 3].map((i) => (
          <View
            key={i}
            style={[
              styles.strengthSegment,
              {
                backgroundColor: i < strength ? colors[strength] : "#e0e0e0",
              },
            ]}
          />
        ))}
      </View>
      <Text style={[styles.strengthText, { color: colors[strength] }]}>
        {labels[strength]}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
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
  inputError: {
    borderColor: "#FF3B30",
    backgroundColor: "#FFF5F5",
  },
  errorText: {
    color: "#FF3B30",
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  strengthContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 4,
  },
  strengthBar: {
    flexDirection: "row",
    flex: 1,
    gap: 4,
  },
  strengthSegment: {
    flex: 1,
    height: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 8,
    width: 70,
  },
});
```

**Résultat attendu** : un formulaire qui affiche des messages d'erreur en rouge sous chaque champ quand la saisie est invalide. La bordure du champ devient rouge. L'indicateur de force du mot de passe progresse en temps réel.

---

### Étape 3 : Sélecteurs et interrupteurs

Ajouter des champs de sélection et des interrupteurs :

```bash
# Installer le composant Picker
npx expo install @react-native-picker/picker
```

```tsx
// screens/ProfileFormScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Switch,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

export default function ProfileFormScreen() {
  const [country, setCountry] = useState("");
  const [experience, setExperience] = useState("");
  const [newsletter, setNewsletter] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const handleSubmit = () => {
    if (!country) {
      Alert.alert("Erreur", "Sélectionne un pays.");
      return;
    }
    if (!experience) {
      Alert.alert("Erreur", "Sélectionne ton niveau d'expérience.");
      return;
    }

    Alert.alert(
      "Profil sauvegardé",
      `Pays : ${country}\nExpérience : ${experience}\n` +
      `Newsletter : ${newsletter ? "Oui" : "Non"}\n` +
      `Mode sombre : ${darkMode ? "Activé" : "Désactivé"}`
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil</Text>

      {/* Sélecteur de pays */}
      <Text style={styles.label}>Pays</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={country}
          onValueChange={setCountry}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner un pays..." value="" />
          <Picker.Item label="France" value="FR" />
          <Picker.Item label="Belgique" value="BE" />
          <Picker.Item label="Suisse" value="CH" />
          <Picker.Item label="Canada" value="CA" />
          <Picker.Item label="Luxembourg" value="LU" />
        </Picker>
      </View>

      {/* Sélecteur d'expérience */}
      <Text style={styles.label}>Niveau d'expérience</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={experience}
          onValueChange={setExperience}
          style={styles.picker}
        >
          <Picker.Item label="Sélectionner un niveau..." value="" />
          <Picker.Item label="Débutant (0-1 an)" value="junior" />
          <Picker.Item label="Intermédiaire (1-3 ans)" value="mid" />
          <Picker.Item label="Confirmé (3-5 ans)" value="senior" />
          <Picker.Item label="Expert (5+ ans)" value="expert" />
        </Picker>
      </View>

      {/* Interrupteurs */}
      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Newsletter</Text>
          <Text style={styles.switchHint}>
            Recevoir les actualités par email
          </Text>
        </View>
        <Switch
          value={newsletter}
          onValueChange={setNewsletter}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      <View style={styles.switchRow}>
        <View>
          <Text style={styles.switchLabel}>Mode sombre</Text>
          <Text style={styles.switchHint}>
            Thème sombre pour l'application
          </Text>
        </View>
        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
          trackColor={{ false: "#ccc", true: "#007AFF" }}
        />
      </View>

      <Pressable style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Enregistrer</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: "#fff",
  },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#333" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 16,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  picker: {
    height: 50,
  },
  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  switchLabel: { fontSize: 16, fontWeight: "600" },
  switchHint: { fontSize: 13, color: "#999", marginTop: 2 },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

**Résultat attendu** : un formulaire avec deux sélecteurs déroulants (pays et expérience) et deux interrupteurs (newsletter et mode sombre). Les sélecteurs s'ouvrent avec une roue de sélection sur iOS et un menu déroulant sur Android.

---

### Étape 4 : Formulaire multi-étapes

Pour les formulaires longs, diviser en plusieurs étapes :

```tsx
// screens/MultiStepFormScreen.tsx
import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";

// Données du formulaire multi-étapes
type FormData = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
};

const TOTAL_STEPS = 3;

export default function MultiStepFormScreen() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
  });

  // Mettre à jour un champ du formulaire
  const updateField = (field: keyof FormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  // Passer à l'étape suivante avec validation
  const nextStep = () => {
    if (step === 1) {
      if (!form.firstName.trim() || !form.lastName.trim()) {
        Alert.alert("Erreur", "Le prénom et le nom sont obligatoires.");
        return;
      }
    }
    if (step === 2) {
      if (!form.email.includes("@")) {
        Alert.alert("Erreur", "L'adresse email est invalide.");
        return;
      }
    }
    setStep(step + 1);
  };

  // Revenir à l'étape précédente
  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  // Soumettre le formulaire complet
  const handleSubmit = () => {
    Alert.alert(
      "Inscription terminée",
      `${form.firstName} ${form.lastName}\n${form.email}\n${form.city}`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Inscription</Text>

        {/* Indicateur de progression */}
        <View style={styles.progressBar}>
          {[1, 2, 3].map((s) => (
            <View
              key={s}
              style={[
                styles.progressDot,
                s <= step ? styles.progressActive : styles.progressInactive,
              ]}
            >
              <Text
                style={[
                  styles.progressText,
                  s <= step ? styles.progressTextActive : null,
                ]}
              >
                {s}
              </Text>
            </View>
          ))}
        </View>

        <Text style={styles.stepLabel}>
          Étape {step} sur {TOTAL_STEPS}
        </Text>

        {/* Étape 1 : Identité */}
        {step === 1 && (
          <View>
            <Text style={styles.label}>Prénom</Text>
            <TextInput
              style={styles.input}
              value={form.firstName}
              onChangeText={(v) => updateField("firstName", v)}
              placeholder="Jean"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Nom</Text>
            <TextInput
              style={styles.input}
              value={form.lastName}
              onChangeText={(v) => updateField("lastName", v)}
              placeholder="Dupont"
              autoCapitalize="words"
            />
          </View>
        )}

        {/* Étape 2 : Contact */}
        {step === 2 && (
          <View>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={form.email}
              onChangeText={(v) => updateField("email", v)}
              placeholder="jean@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Text style={styles.label}>Téléphone</Text>
            <TextInput
              style={styles.input}
              value={form.phone}
              onChangeText={(v) => updateField("phone", v)}
              placeholder="0612345678"
              keyboardType="phone-pad"
            />
          </View>
        )}

        {/* Étape 3 : Adresse */}
        {step === 3 && (
          <View>
            <Text style={styles.label}>Adresse</Text>
            <TextInput
              style={styles.input}
              value={form.address}
              onChangeText={(v) => updateField("address", v)}
              placeholder="12 rue de la Paix"
            />

            <Text style={styles.label}>Ville</Text>
            <TextInput
              style={styles.input}
              value={form.city}
              onChangeText={(v) => updateField("city", v)}
              placeholder="Paris"
              autoCapitalize="words"
            />

            <Text style={styles.label}>Code postal</Text>
            <TextInput
              style={styles.input}
              value={form.postalCode}
              onChangeText={(v) => updateField("postalCode", v)}
              placeholder="75001"
              keyboardType="number-pad"
              maxLength={5}
            />
          </View>
        )}

        {/* Boutons de navigation */}
        <View style={styles.buttonRow}>
          {step > 1 && (
            <Pressable style={styles.backButton} onPress={prevStep}>
              <Text style={styles.backButtonText}>Retour</Text>
            </Pressable>
          )}

          {step < TOTAL_STEPS ? (
            <Pressable style={styles.nextButton} onPress={nextStep}>
              <Text style={styles.nextButtonText}>Suivant</Text>
            </Pressable>
          ) : (
            <Pressable style={styles.nextButton} onPress={handleSubmit}>
              <Text style={styles.nextButtonText}>Terminer</Text>
            </Pressable>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 16 },
  progressBar: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginBottom: 8,
  },
  progressDot: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  progressActive: { backgroundColor: "#007AFF" },
  progressInactive: { backgroundColor: "#e0e0e0" },
  progressText: { fontWeight: "bold", fontSize: 16, color: "#999" },
  progressTextActive: { color: "#fff" },
  stepLabel: {
    textAlign: "center",
    color: "#666",
    marginBottom: 24,
    fontSize: 14,
  },
  label: { fontSize: 15, fontWeight: "600", marginBottom: 6, color: "#333" },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: "#fafafa",
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    gap: 12,
  },
  backButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  backButtonText: { color: "#007AFF", fontSize: 16, fontWeight: "600" },
  nextButton: {
    flex: 1,
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#007AFF",
  },
  nextButtonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});
```

**Résultat attendu** : un formulaire en 3 étapes avec un indicateur de progression. Chaque étape est validée avant de passer à la suivante. L'utilisateur peut revenir en arrière sans perdre ses données.

---

## Commandes utiles

| Commande | Action |
| --- | --- |
| `npx expo install @react-native-picker/picker` | Installer le composant Picker |
| `<TextInput keyboardType="email-address" />` | Clavier optimisé pour les emails |
| `<TextInput keyboardType="phone-pad" />` | Clavier numérique pour les téléphones |
| `<TextInput keyboardType="number-pad" />` | Clavier numérique |
| `<TextInput secureTextEntry />` | Masquer le texte (mot de passe) |
| `<TextInput returnKeyType="next" />` | Bouton "Suivant" sur le clavier |
| `<TextInput maxLength={10} />` | Limiter le nombre de caractères |
| `<KeyboardAvoidingView behavior="padding" />` | Remonter le contenu quand le clavier apparaît |

---

## Pièges fréquents

### Piège 1 : Ne pas utiliser KeyboardAvoidingView

**Problème** : Quand l'utilisateur tape dans un champ en bas de l'écran, le clavier le masque complètement. L'utilisateur ne voit plus ce qu'il saisit.

**Solution** : Enveloppe ton formulaire dans un `KeyboardAvoidingView` avec `behavior="padding"` sur iOS et `behavior="height"` sur Android.

```tsx
<KeyboardAvoidingView
  style={{ flex: 1 }}
  behavior={Platform.OS === "ios" ? "padding" : "height"}
>
  <ScrollView>
    {/* Contenu du formulaire */}
  </ScrollView>
</KeyboardAvoidingView>
```

### Piège 2 : Valider uniquement à la soumission

**Problème** : L'utilisateur remplit tout le formulaire, appuie sur "Envoyer", et découvre 5 erreurs d'un coup. Il est frustré.

**Solution** : Valide chaque champ quand l'utilisateur le quitte (événement `onBlur`). Affiche l'erreur sous le champ concerné immédiatement.

### Piège 3 : Oublier autoCapitalize="none" pour les emails

**Problème** : Le clavier met automatiquement une majuscule au premier caractère. L'utilisateur saisit `Jean@exemple.com` avec une majuscule.

**Solution** : Ajoute `autoCapitalize="none"` et `autoCorrect={false}` sur les champs email et mot de passe.

### Piège 4 : Ne pas utiliser le bon keyboardType

**Problème** : L'utilisateur doit saisir un numéro de téléphone mais le clavier affiche les lettres. Il doit basculer manuellement vers le clavier numérique.

**Solution** : Utilise le `keyboardType` adapté au type de données attendues.

| Données | keyboardType |
| --- | --- |
| Texte | `"default"` |
| Email | `"email-address"` |
| Téléphone | `"phone-pad"` |
| Nombre entier | `"number-pad"` |
| Nombre décimal | `"decimal-pad"` |
| URL | `"url"` |

---

## Checklist de validation

- Je sais créer un formulaire avec TextInput et gérer l'état de chaque champ
- Je sais configurer le clavier adapté à chaque type de champ (email, téléphone, mot de passe)
- Je sais utiliser KeyboardAvoidingView pour éviter que le clavier masque les champs
- Je sais valider les saisies en temps réel et afficher des messages d'erreur
- Je sais utiliser le composant Picker pour les sélecteurs
- Je sais utiliser Switch pour les interrupteurs
- Je sais créer un formulaire multi-étapes avec indicateur de progression

---

## Exercice pratique

**Énoncé** : Crée un formulaire de contact avec validation complète.

**Indications** :

- Champs : nom (obligatoire, minimum 2 caractères), email (obligatoire, format valide), sujet (sélecteur avec 4 options : "Question", "Bug", "Suggestion", "Autre"), message (obligatoire, minimum 20 caractères, TextInput multiligne)
- Validation en temps réel avec messages d'erreur sous chaque champ
- Compteur de caractères pour le champ message (ex: "12/20 caractères minimum")
- Bouton "Envoyer" désactivé tant que le formulaire n'est pas valide
- Alerte de confirmation après soumission avec récapitulatif

**Résultat attendu** : un formulaire de contact complet avec une validation fluide qui guide l'utilisateur.

---

## Solution de l'exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
import { useState, useMemo } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";

const MIN_MESSAGE_LENGTH = 20;

export default function App() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Marquer un champ comme touché
  const touch = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  // Calcul des erreurs
  const errors = useMemo(() => {
    const e: Record<string, string | null> = {};
    e.name =
      name.trim().length === 0
        ? "Le nom est obligatoire"
        : name.trim().length < 2
          ? "Minimum 2 caractères"
          : null;
    e.email =
      email.trim().length === 0
        ? "L'email est obligatoire"
        : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
          ? "Format email invalide"
          : null;
    e.subject = !subject ? "Sélectionne un sujet" : null;
    e.message =
      message.trim().length === 0
        ? "Le message est obligatoire"
        : message.trim().length < MIN_MESSAGE_LENGTH
          ? `Minimum ${MIN_MESSAGE_LENGTH} caractères`
          : null;
    return e;
  }, [name, email, subject, message]);

  // Le formulaire est valide si aucune erreur
  const isValid = Object.values(errors).every((e) => e === null);

  const handleSubmit = () => {
    // Marquer tous les champs comme touchés
    setTouched({ name: true, email: true, subject: true, message: true });
    if (!isValid) return;

    Alert.alert(
      "Message envoyé",
      `Nom : ${name}\nEmail : ${email}\nSujet : ${subject}\nMessage : ${message.substring(0, 50)}...`
    );
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Contact</Text>

        {/* Nom */}
        <Text style={styles.label}>Nom *</Text>
        <TextInput
          style={[styles.input, touched.name && errors.name ? styles.inputError : null]}
          value={name}
          onChangeText={setName}
          onBlur={() => touch("name")}
          placeholder="Ton nom"
          autoCapitalize="words"
        />
        {touched.name && errors.name && (
          <Text style={styles.errorText}>{errors.name}</Text>
        )}

        {/* Email */}
        <Text style={styles.label}>Email *</Text>
        <TextInput
          style={[styles.input, touched.email && errors.email ? styles.inputError : null]}
          value={email}
          onChangeText={setEmail}
          onBlur={() => touch("email")}
          placeholder="ton@email.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {touched.email && errors.email && (
          <Text style={styles.errorText}>{errors.email}</Text>
        )}

        {/* Sujet */}
        <Text style={styles.label}>Sujet *</Text>
        <View style={[styles.pickerWrap, touched.subject && errors.subject ? styles.inputError : null]}>
          <Picker selectedValue={subject} onValueChange={(v) => { setSubject(v); touch("subject"); }}>
            <Picker.Item label="Choisir un sujet..." value="" />
            <Picker.Item label="Question" value="Question" />
            <Picker.Item label="Bug" value="Bug" />
            <Picker.Item label="Suggestion" value="Suggestion" />
            <Picker.Item label="Autre" value="Autre" />
          </Picker>
        </View>
        {touched.subject && errors.subject && (
          <Text style={styles.errorText}>{errors.subject}</Text>
        )}

        {/* Message */}
        <Text style={styles.label}>Message *</Text>
        <TextInput
          style={[
            styles.input,
            styles.textarea,
            touched.message && errors.message ? styles.inputError : null,
          ]}
          value={message}
          onChangeText={setMessage}
          onBlur={() => touch("message")}
          placeholder="Décris ta demande..."
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
        <Text
          style={[
            styles.charCount,
            message.trim().length >= MIN_MESSAGE_LENGTH
              ? styles.charCountOk
              : styles.charCountWarn,
          ]}
        >
          {message.trim().length}/{MIN_MESSAGE_LENGTH} caractères minimum
        </Text>
        {touched.message && errors.message && (
          <Text style={styles.errorText}>{errors.message}</Text>
        )}

        {/* Bouton */}
        <Pressable
          style={[styles.button, !isValid && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={!isValid}
        >
          <Text style={styles.buttonText}>Envoyer</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20, paddingTop: 60, backgroundColor: "#fff" },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 24 },
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
  inputError: { borderColor: "#FF3B30", backgroundColor: "#FFF5F5" },
  textarea: { height: 120 },
  errorText: { color: "#FF3B30", fontSize: 13, marginBottom: 12, marginLeft: 4 },
  charCount: { fontSize: 12, marginBottom: 12, marginLeft: 4 },
  charCountOk: { color: "#34C759" },
  charCountWarn: { color: "#999" },
  pickerWrap: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: "#fafafa",
    overflow: "hidden",
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonDisabled: { opacity: 0.5 },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});
```

---

## Navigation

← Fiche précédente : **[Fonctionnalités natives](07-fonctionnalites-natives.md)**

→ Fiche suivante : **[Build et déploiement](09-build-deploiement.md)**
