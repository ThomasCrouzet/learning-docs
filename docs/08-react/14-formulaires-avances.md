---
tags:
  - React
  - Avancé
  - Pratique
description: "Gérer les formulaires complexes avec React Hook Form et la validation avec Zod."
estimated_time: "75 min"
fiche_number: 14
total_fiches: 19
cursus: "React"
id: "web.react.formulaires-avances"
course_id: "web.react"
content_type: "lesson"
order: 14
---

# 14 - Formulaires avancés

> **En bref** : Utiliser React Hook Form pour gérer les formulaires complexes, valider les données avec Zod et améliorer l'expérience utilisateur des formulaires. Lecture estimée : 75 min.

## Prérequis

- Fiche précédente : [13 - React et Symfony](13-react-symfony.md)
- Savoir créer des formulaires contrôlés ([06 - Événements et formulaires](06-evenements-formulaires.md))
- Connaître les types TypeScript (interfaces, types génériques)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser React Hook Form pour gérer des formulaires complexes, valider les données avec Zod, afficher des messages d'erreur précis et créer des composants de formulaire réutilisables.

---

## Concepts

### Qu'est-ce que React Hook Form ?

**Définition** : React Hook Form est une bibliothèque qui gère les formulaires React en utilisant des refs (références au DOM) au lieu de l'état React. Cela évite les re-renders à chaque frappe de touche et réduit la complexité de la gestion des formulaires complexes.

**Le problème que React Hook Form résout** :

Sans React Hook Form :

1. **Re-renders excessifs** : avec les formulaires contrôlés, chaque frappe de touche met à jour l'état et re-rend tout le composant.
2. **Beaucoup de code** : un formulaire avec 10 champs nécessite 10 `useState`, 10 handlers `onChange` et une logique de validation manuelle.
3. **Validation manuelle** : écrire les règles de validation à la main est répétitif et source d'erreurs.

**Comment React Hook Form résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Re-renders excessifs | Les valeurs sont stockées dans des refs, pas dans l'état |
| Beaucoup de code | `register` enregistre un champ en une seule ligne |
| Validation manuelle | Validation intégrée avec des règles déclaratives |

**Analogie concrète** : React Hook Form est comme un formulaire papier pré-imprimé. Au lieu de réécrire le formulaire à chaque modification (re-render), tu remplis directement les cases (refs). La vérification (validation) se fait quand tu soumets le formulaire, pas pendant que tu écris.

**Ce que React Hook Form n'est PAS** :

- React Hook Form n'est pas obligatoire. Pour un formulaire simple (2-3 champs), `useState` suffit.
- React Hook Form ne remplace pas la validation côté serveur. La validation côté client améliore l'UX, mais le serveur doit toujours vérifier les données.

---

### Qu'est-ce que Zod ?

**Définition** : Zod est une bibliothèque TypeScript de validation de schémas. Elle permet de définir la structure et les règles de validation des données dans un objet déclaratif. Le type TypeScript est inféré automatiquement depuis le schéma Zod.

**Le problème que Zod résout** :

Sans Zod :

1. **Types et validation séparés** : tu définis un type TypeScript ET tu écris une fonction de validation. Les deux peuvent se désynchroniser.
2. **Messages d'erreur manuels** : chaque règle de validation nécessite un message d'erreur écrit à la main.
3. **Validation incomplète** : il est facile d'oublier de vérifier un champ ou un cas limite.

**Comment Zod résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Types et validation séparés | Le type TypeScript est inféré depuis le schéma Zod |
| Messages d'erreur manuels | Les messages sont déclarés dans le schéma |
| Validation incomplète | Zod valide tout le schéma d'un coup |

**Analogie concrète** : Zod est comme un plan de construction. Le plan décrit exactement à quoi le bâtiment doit ressembler (le schéma). Quand tu construis (les données arrivent), le plan permet de vérifier que chaque élément est conforme. Si un mur est trop court (une chaîne trop courte), le contrôle qualité (Zod) le signale immédiatement avec une description précise du problème.

**Comparaison validation manuelle vs Zod** :

| Validation manuelle | Zod |
| --- | --- |
| Type et validation séparés | Type inféré du schéma |
| `if/else` pour chaque règle | Règles chaînées : `.min().max().email()` |
| Messages écrits à la main | Messages intégrés au schéma |
| Pas de composition | Schémas composables (merge, extend, pick) |

---

### Qu'est-ce que l'UX de formulaire ?

**Définition** : L'UX (User Experience) de formulaire regroupe les bonnes pratiques qui rendent un formulaire agréable à utiliser : quand afficher les erreurs, comment guider l'utilisateur et comment indiquer la progression.

**Le problème que l'UX de formulaire résout** :

Sans bonnes pratiques UX :

1. **Erreurs découvertes trop tard** : l'utilisateur remplit 10 champs, clique sur "Envoyer" et découvre 5 erreurs d'un coup. Il doit tout relire et corriger.
2. **Messages d'erreur incompréhensibles** : le formulaire affiche "Erreur de validation" sans préciser quel champ est concerné ni ce qu'il faut corriger.
3. **Aucun retour visuel** : l'utilisateur clique sur "Envoyer" et rien ne se passe. Il ne sait pas si le formulaire est en cours d'envoi, s'il a été accepté ou s'il y a un problème.

**Comment l'UX de formulaire résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Erreurs découvertes trop tard | La validation au blur signale l'erreur dès que l'utilisateur quitte un champ |
| Messages incompréhensibles | Chaque champ affiche un message précis ("Le nom doit contenir au moins 2 caractères") |
| Aucun retour visuel | Un indicateur de chargement et un bouton désactivé montrent l'état de l'envoi |

**Analogie concrète** : L'UX de formulaire est comme l'accompagnement d'un employé de banque quand tu remplis un dossier de prêt. Au lieu de te laisser remplir 10 pages puis de te dire "page 3, ligne 7 : erreur", l'employé vérifie chaque section au fur et à mesure. Il t'explique immédiatement ce qui ne va pas ("il manque ta signature ici") et te confirme quand une section est complète. Le résultat : tu finis le dossier sans surprise et sans devoir tout recommencer.

**Les trois moments de validation** :

| Moment | Quand ? | Avantage | Inconvénient |
| --- | --- | --- | --- |
| À la soumission | Quand l'utilisateur clique sur "Envoyer" | Simple à implémenter | L'utilisateur découvre les erreurs tard |
| Au blur (perte de focus) | Quand l'utilisateur quitte un champ | Erreur affichée au bon moment | Plus complexe à implémenter |
| À la saisie (onChange) | Pendant que l'utilisateur tape | Retour immédiat | Peut être stressant si trop agressif |

**Bonne pratique** : Valider au blur pour la première erreur, puis à la saisie pour la correction. C'est le comportement par défaut de React Hook Form avec le mode `onBlur`.

---

## Étapes Pratiques

### Étape 1 : Installer React Hook Form et Zod

```bash
# Dans le dossier du projet React
npm install react-hook-form zod @hookform/resolvers
```

**Ce que chaque paquet fait** :

| Paquet | Rôle |
| --- | --- |
| `react-hook-form` | Gestion des formulaires avec hooks |
| `zod` | Définition de schémas de validation |
| `@hookform/resolvers` | Connecte Zod à React Hook Form |

> **Note Zod 4** : avec Zod 4, `z.string().email()` reste fonctionnel mais est marqué déprécié au profit de `z.email()`. Les exemples de cette fiche utilisent la forme chaînée (`z.string().min()...`) car elle reste claire pour l'apprentissage et compatible. Les deux formes coexistent.

---

### Étape 2 : Premier formulaire avec React Hook Form

Crée `src/components/FormulaireSimple.tsx` :

```tsx
// src/components/FormulaireSimple.tsx
import { useForm } from "react-hook-form";

// Interface pour les données du formulaire
interface DonneesInscription {
  nom: string;
  email: string;
  age: number;
}

function FormulaireSimple() {
  // useForm retourne les outils pour gérer le formulaire
  const {
    register,    // Enregistre un champ (nom, règles de validation)
    handleSubmit, // Gère la soumission (valide avant d'appeler ta fonction)
    formState: { errors }, // Contient les erreurs de validation
  } = useForm<DonneesInscription>();

  // Cette fonction n'est appelée que si le formulaire est valide
  const soumettre = (donnees: DonneesInscription) => {
    console.log("Données valides :", donnees);
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Inscription (React Hook Form)</h2>

      {/* handleSubmit valide les champs avant d'appeler soumettre */}
      <form onSubmit={handleSubmit(soumettre)}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="rhf-nom">Nom :</label>
          <br />
          {/* register("nom", { règles }) enregistre le champ */}
          <input
            id="rhf-nom"
            type="text"
            {...register("nom", {
              required: "Le nom est obligatoire",
              minLength: { value: 2, message: "Le nom doit contenir au moins 2 caractères" },
            })}
            style={{ width: "100%", padding: "8px" }}
          />
          {/* Affiche l'erreur si elle existe */}
          {errors.nom && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.nom.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="rhf-email">Email :</label>
          <br />
          <input
            id="rhf-email"
            type="email"
            {...register("email", {
              required: "L'email est obligatoire",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "L'email n'est pas valide",
              },
            })}
            style={{ width: "100%", padding: "8px" }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="rhf-age">Âge :</label>
          <br />
          <input
            id="rhf-age"
            type="number"
            {...register("age", {
              required: "L'âge est obligatoire",
              min: { value: 16, message: "Tu dois avoir au moins 16 ans" },
              max: { value: 120, message: "L'âge doit être inférieur à 120" },
              valueAsNumber: true, // Convertit la valeur en nombre
            })}
            style={{ width: "100%", padding: "8px" }}
          />
          {errors.age && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.age.message}
            </p>
          )}
        </div>

        <button type="submit" style={{ padding: "8px 16px" }}>
          S'inscrire
        </button>
      </form>
    </div>
  );
}

export default FormulaireSimple;
```

**Résultat attendu** : un formulaire qui valide les champs et affiche les erreurs sans re-render à chaque frappe.

---

### Étape 3 : Validation avec Zod

Crée `src/schemas/inscription.ts` :

```tsx
// src/schemas/inscription.ts
import { z } from "zod";

// Définit le schéma de validation avec Zod
const schemaInscription = z.object({
  nom: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne doit pas dépasser 50 caractères"),

  email: z
    .string()
    .email("L'adresse email n'est pas valide"),

  motDePasse: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .regex(/[A-Z]/, "Le mot de passe doit contenir au moins une majuscule")
    .regex(/[0-9]/, "Le mot de passe doit contenir au moins un chiffre"),

  confirmationMotDePasse: z
    .string(),

  age: z
    .number({ invalid_type_error: "L'âge doit être un nombre" })
    .min(16, "Tu dois avoir au moins 16 ans")
    .max(120, "L'âge doit être inférieur à 120"),

  role: z
    .enum(["developpeur", "designer", "chef-projet"], {
      errorMap: () => ({ message: "Sélectionne un rôle valide" }),
    }),

  accepteConditions: z
    .literal(true, {
      errorMap: () => ({ message: "Tu dois accepter les conditions" }),
    }),
}).refine(
  // Vérifie que les deux mots de passe correspondent
  (donnees) => donnees.motDePasse === donnees.confirmationMotDePasse,
  {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmationMotDePasse"], // Indique quel champ affiche l'erreur
  }
);

// Infère le type TypeScript depuis le schéma Zod
// Pas besoin de définir manuellement une interface !
type DonneesInscription = z.infer<typeof schemaInscription>;

export { schemaInscription };
export type { DonneesInscription };
```

Crée `src/components/FormulaireZod.tsx` :

```tsx
// src/components/FormulaireZod.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaInscription, DonneesInscription } from "../schemas/inscription";

function FormulaireZod() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DonneesInscription>({
    // Connecte Zod à React Hook Form
    resolver: zodResolver(schemaInscription),
    // Valide au blur (perte de focus) puis à chaque changement
    mode: "onBlur",
  });

  const soumettre = async (donnees: DonneesInscription) => {
    // Simule un envoi au serveur
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log("Inscription réussie :", donnees);
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Inscription (Zod)</h2>

      <form onSubmit={handleSubmit(soumettre)}>
        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-nom">Nom :</label>
          <br />
          <input
            id="zod-nom"
            type="text"
            {...register("nom")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.nom ? "red" : "#ccc",
            }}
          />
          {errors.nom && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.nom.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-email">Email :</label>
          <br />
          <input
            id="zod-email"
            type="email"
            {...register("email")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.email ? "red" : "#ccc",
            }}
          />
          {errors.email && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-mdp">Mot de passe :</label>
          <br />
          <input
            id="zod-mdp"
            type="password"
            {...register("motDePasse")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.motDePasse ? "red" : "#ccc",
            }}
          />
          {errors.motDePasse && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.motDePasse.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-confirm">Confirmer le mot de passe :</label>
          <br />
          <input
            id="zod-confirm"
            type="password"
            {...register("confirmationMotDePasse")}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.confirmationMotDePasse ? "red" : "#ccc",
            }}
          />
          {errors.confirmationMotDePasse && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.confirmationMotDePasse.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-age">Âge :</label>
          <br />
          <input
            id="zod-age"
            type="number"
            {...register("age", { valueAsNumber: true })}
            style={{
              width: "100%",
              padding: "8px",
              borderColor: errors.age ? "red" : "#ccc",
            }}
          />
          {errors.age && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.age.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="zod-role">Rôle :</label>
          <br />
          <select
            id="zod-role"
            {...register("role")}
            style={{ width: "100%", padding: "8px" }}
          >
            <option value="">-- Choisir un rôle --</option>
            <option value="developpeur">Développeur</option>
            <option value="designer">Designer</option>
            <option value="chef-projet">Chef de projet</option>
          </select>
          {errors.role && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.role.message}
            </p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input type="checkbox" {...register("accepteConditions")} />
            {" "}J'accepte les conditions d'utilisation
          </label>
          {errors.accepteConditions && (
            <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
              {errors.accepteConditions.message}
            </p>
          )}
        </div>

        <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
          {isSubmitting ? "Inscription..." : "S'inscrire"}
        </button>
      </form>
    </div>
  );
}

export default FormulaireZod;
```

**Résultat attendu** : un formulaire complet avec validation Zod, messages d'erreur précis et bouton désactivé pendant l'envoi.

---

### Étape 4 : Créer un composant de champ réutilisable

```tsx
// src/components/ChampFormulaire.tsx
import { FieldError, UseFormRegisterReturn } from "react-hook-form";

interface PropsChamp {
  label: string;
  id: string;
  type?: string;
  registration: UseFormRegisterReturn;
  erreur?: FieldError;
  placeholder?: string;
}

// Composant réutilisable pour un champ de formulaire
function ChampFormulaire({ label, id, type = "text", registration, erreur, placeholder }: PropsChamp) {
  return (
    <div style={{ marginBottom: "12px" }}>
      <label htmlFor={id}>{label} :</label>
      <br />
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        {...registration}
        style={{
          width: "100%",
          padding: "8px",
          borderColor: erreur ? "red" : "#ccc",
          borderWidth: "1px",
          borderStyle: "solid",
          borderRadius: "4px",
        }}
      />
      {erreur && (
        <p style={{ color: "red", fontSize: "12px", margin: "4px 0 0" }}>
          {erreur.message}
        </p>
      )}
    </div>
  );
}

export default ChampFormulaire;
```

Utilise le composant dans un formulaire :

```tsx
// src/components/FormulaireAvecChamp.tsx
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import ChampFormulaire from "./ChampFormulaire";

const schemaContact = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("L'email n'est pas valide"),
  sujet: z.string().min(5, "Le sujet doit contenir au moins 5 caractères"),
});

type DonneesContact = z.infer<typeof schemaContact>;

function FormulaireAvecChamp() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DonneesContact>({
    resolver: zodResolver(schemaContact),
    mode: "onBlur",
  });

  const soumettre = (donnees: DonneesContact) => {
    console.log("Contact envoyé :", donnees);
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Contact (composant réutilisable)</h2>
      <form onSubmit={handleSubmit(soumettre)}>
        {/* Chaque champ utilise le composant réutilisable */}
        <ChampFormulaire
          label="Nom"
          id="contact-nom"
          registration={register("nom")}
          erreur={errors.nom}
        />
        <ChampFormulaire
          label="Email"
          id="contact-email"
          type="email"
          registration={register("email")}
          erreur={errors.email}
        />
        <ChampFormulaire
          label="Sujet"
          id="contact-sujet"
          registration={register("sujet")}
          erreur={errors.sujet}
          placeholder="De quoi souhaites-tu parler ?"
        />
        <button type="submit" style={{ padding: "8px 16px" }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default FormulaireAvecChamp;
```

**Résultat attendu** : un formulaire avec des champs uniformes grâce au composant réutilisable.

---

### Étape 5 : Formulaire multi-étapes

```tsx
// src/components/FormulaireMultiEtapes.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

// Schéma pour chaque étape
const schemaEtape1 = z.object({
  nom: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("L'email n'est pas valide"),
});

const schemaEtape2 = z.object({
  adresse: z.string().min(5, "L'adresse doit contenir au moins 5 caractères"),
  ville: z.string().min(2, "La ville est obligatoire"),
  codePostal: z.string().regex(/^\d{5}$/, "Le code postal doit contenir 5 chiffres"),
});

const schemaEtape3 = z.object({
  motDePasse: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  confirmationMotDePasse: z.string(),
}).refine(
  (d) => d.motDePasse === d.confirmationMotDePasse,
  { message: "Les mots de passe ne correspondent pas", path: ["confirmationMotDePasse"] }
);

type Etape1 = z.infer<typeof schemaEtape1>;
type Etape2 = z.infer<typeof schemaEtape2>;
type Etape3 = z.infer<typeof schemaEtape3>;

function FormulaireMultiEtapes() {
  const [etape, setEtape] = useState(1);
  const [donneesFinales, setDonneesFinales] = useState<Partial<Etape1 & Etape2 & Etape3>>({});

  // Formulaire étape 1
  const form1 = useForm<Etape1>({
    resolver: zodResolver(schemaEtape1),
    mode: "onBlur",
  });

  // Formulaire étape 2
  const form2 = useForm<Etape2>({
    resolver: zodResolver(schemaEtape2),
    mode: "onBlur",
  });

  // Formulaire étape 3
  const form3 = useForm<Etape3>({
    resolver: zodResolver(schemaEtape3),
    mode: "onBlur",
  });

  const suivant1 = (donnees: Etape1) => {
    setDonneesFinales((prev) => ({ ...prev, ...donnees }));
    setEtape(2);
  };

  const suivant2 = (donnees: Etape2) => {
    setDonneesFinales((prev) => ({ ...prev, ...donnees }));
    setEtape(3);
  };

  const terminer = (donnees: Etape3) => {
    const toutesLesDonnees = { ...donneesFinales, ...donnees };
    console.log("Inscription complète :", toutesLesDonnees);
    setEtape(4); // Étape de confirmation
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Inscription multi-étapes</h2>

      {/* Barre de progression */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px" }}>
        {[1, 2, 3].map((num) => (
          <div
            key={num}
            style={{
              flex: 1,
              height: "4px",
              backgroundColor: num <= etape ? "#0066cc" : "#ddd",
              borderRadius: "2px",
            }}
          />
        ))}
      </div>

      {/* Étape 1 : Identité */}
      {etape === 1 && (
        <form onSubmit={form1.handleSubmit(suivant1)}>
          <h3>Étape 1 : Identité</h3>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-nom">Nom :</label>
            <br />
            <input id="multi-nom" type="text" {...form1.register("nom")} style={{ width: "100%", padding: "8px" }} />
            {form1.formState.errors.nom && (
              <p style={{ color: "red", fontSize: "12px" }}>{form1.formState.errors.nom.message}</p>
            )}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-email">Email :</label>
            <br />
            <input id="multi-email" type="email" {...form1.register("email")} style={{ width: "100%", padding: "8px" }} />
            {form1.formState.errors.email && (
              <p style={{ color: "red", fontSize: "12px" }}>{form1.formState.errors.email.message}</p>
            )}
          </div>
          <button type="submit" style={{ padding: "8px 16px" }}>Suivant</button>
        </form>
      )}

      {/* Étape 2 : Adresse */}
      {etape === 2 && (
        <form onSubmit={form2.handleSubmit(suivant2)}>
          <h3>Étape 2 : Adresse</h3>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-adresse">Adresse :</label>
            <br />
            <input id="multi-adresse" type="text" {...form2.register("adresse")} style={{ width: "100%", padding: "8px" }} />
            {form2.formState.errors.adresse && (
              <p style={{ color: "red", fontSize: "12px" }}>{form2.formState.errors.adresse.message}</p>
            )}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-ville">Ville :</label>
            <br />
            <input id="multi-ville" type="text" {...form2.register("ville")} style={{ width: "100%", padding: "8px" }} />
            {form2.formState.errors.ville && (
              <p style={{ color: "red", fontSize: "12px" }}>{form2.formState.errors.ville.message}</p>
            )}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-cp">Code postal :</label>
            <br />
            <input id="multi-cp" type="text" {...form2.register("codePostal")} style={{ width: "100%", padding: "8px" }} />
            {form2.formState.errors.codePostal && (
              <p style={{ color: "red", fontSize: "12px" }}>{form2.formState.errors.codePostal.message}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={() => setEtape(1)} style={{ padding: "8px 16px" }}>Précédent</button>
            <button type="submit" style={{ padding: "8px 16px" }}>Suivant</button>
          </div>
        </form>
      )}

      {/* Étape 3 : Mot de passe */}
      {etape === 3 && (
        <form onSubmit={form3.handleSubmit(terminer)}>
          <h3>Étape 3 : Sécurité</h3>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-mdp">Mot de passe :</label>
            <br />
            <input id="multi-mdp" type="password" {...form3.register("motDePasse")} style={{ width: "100%", padding: "8px" }} />
            {form3.formState.errors.motDePasse && (
              <p style={{ color: "red", fontSize: "12px" }}>{form3.formState.errors.motDePasse.message}</p>
            )}
          </div>
          <div style={{ marginBottom: "12px" }}>
            <label htmlFor="multi-confirm">Confirmer :</label>
            <br />
            <input id="multi-confirm" type="password" {...form3.register("confirmationMotDePasse")} style={{ width: "100%", padding: "8px" }} />
            {form3.formState.errors.confirmationMotDePasse && (
              <p style={{ color: "red", fontSize: "12px" }}>{form3.formState.errors.confirmationMotDePasse.message}</p>
            )}
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <button type="button" onClick={() => setEtape(2)} style={{ padding: "8px 16px" }}>Précédent</button>
            <button type="submit" style={{ padding: "8px 16px" }}>Terminer</button>
          </div>
        </form>
      )}

      {/* Confirmation */}
      {etape === 4 && (
        <div style={{ padding: "20px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
          <h3>Inscription réussie !</h3>
          <p>Bienvenue {donneesFinales.nom}.</p>
          <p>Un email de confirmation a été envoyé à {donneesFinales.email}.</p>
        </div>
      )}
    </div>
  );
}

export default FormulaireMultiEtapes;
```

**Résultat attendu** : un formulaire en 3 étapes avec barre de progression, validation à chaque étape et navigation avant/arrière.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npm install react-hook-form zod @hookform/resolvers` | Installe les dépendances |
| `npx tsc --noEmit` | Vérifie les types |

---

## Pièges Fréquents

### Piège 1 : Oublier valueAsNumber pour les champs number

⚠️ **Problème** : Les champs `<input type="number">` retournent des chaînes de caractères par défaut. Zod attend un nombre et la validation échoue.

✅ **Solution** : Ajoute `valueAsNumber: true` dans le `register`.

```tsx
// ❌ register retourne une string, Zod attend un number
<input type="number" {...register("age")} />

// ✅ valueAsNumber convertit en nombre
<input type="number" {...register("age", { valueAsNumber: true })} />
```

---

### Piège 2 : Schéma Zod et formulaire désynchronisés

⚠️ **Problème** : Le schéma Zod définit un champ obligatoire mais le formulaire ne l'inclut pas (ou inversement). L'erreur TypeScript n'est pas toujours explicite.

✅ **Solution** : Utilise `z.infer<typeof schema>` pour générer le type TypeScript. Le compilateur signalera les incohérences.

---

### Piège 3 : Validation async qui bloque le formulaire

⚠️ **Problème** : Une validation asynchrone (vérification d'email unique côté serveur) bloque le formulaire sans retour visuel.

✅ **Solution** : Affiche un indicateur de chargement pendant la validation et désactive le bouton de soumission.

---

## Checklist de Validation

- [ ] Je sais installer React Hook Form et Zod
- [ ] Je sais utiliser `register` pour enregistrer un champ
- [ ] Je sais utiliser `handleSubmit` pour gérer la soumission
- [ ] Je sais définir un schéma Zod avec des règles de validation
- [ ] Je sais connecter Zod à React Hook Form avec `zodResolver`
- [ ] Je sais afficher les erreurs de validation
- [ ] Je sais créer un composant de champ réutilisable
- [ ] Je sais créer un formulaire multi-étapes

---

## Exercice Pratique

**Énoncé** : Crée un formulaire d'ajout de produit avec les fonctionnalités suivantes :

1. Champs : nom (obligatoire, 3-100 caractères), description (optionnelle, max 500), prix (obligatoire, > 0), catégorie (select parmi 3 options), en stock (checkbox)
2. Validation avec Zod
3. Composant de champ réutilisable
4. Mode de validation `onBlur`
5. Affiche un résumé du produit après soumission réussie

**Indications** :

- Crée le schéma Zod dans un fichier séparé
- Utilise `z.infer` pour le type TypeScript
- Utilise `isSubmitting` pour désactiver le bouton pendant l'envoi

**Résultat attendu** : un formulaire de produit avec validation complète et résumé.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/schemas/produit.ts` :

```tsx
// src/schemas/produit.ts
import { z } from "zod";

const schemaProduit = z.object({
  nom: z
    .string()
    .min(3, "Le nom doit contenir au moins 3 caractères")
    .max(100, "Le nom ne doit pas dépasser 100 caractères"),
  description: z
    .string()
    .max(500, "La description ne doit pas dépasser 500 caractères")
    .optional()
    .or(z.literal("")),
  prix: z
    .number({ invalid_type_error: "Le prix doit être un nombre" })
    .positive("Le prix doit être supérieur à 0"),
  categorie: z.enum(["electronique", "vetements", "alimentation"], {
    errorMap: () => ({ message: "Sélectionne une catégorie valide" }),
  }),
  enStock: z.boolean(),
});

type DonneesProduit = z.infer<typeof schemaProduit>;

export { schemaProduit };
export type { DonneesProduit };
```

`src/components/FormulaireProduit.tsx` :

```tsx
// src/components/FormulaireProduit.tsx
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { schemaProduit, DonneesProduit } from "../schemas/produit";
import ChampFormulaire from "./ChampFormulaire";

function FormulaireProduit() {
  const [produitCree, setProduitCree] = useState<DonneesProduit | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DonneesProduit>({
    resolver: zodResolver(schemaProduit),
    mode: "onBlur",
    defaultValues: { enStock: true },
  });

  const soumettre = async (donnees: DonneesProduit) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    setProduitCree(donnees);
    reset();
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Ajouter un produit</h2>

      <form onSubmit={handleSubmit(soumettre)}>
        <ChampFormulaire
          label="Nom du produit"
          id="prod-nom"
          registration={register("nom")}
          erreur={errors.nom}
        />

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="prod-desc">Description :</label>
          <br />
          <textarea
            id="prod-desc"
            {...register("description")}
            rows={3}
            style={{ width: "100%", padding: "8px" }}
          />
          {errors.description && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.description.message}</p>
          )}
        </div>

        <ChampFormulaire
          label="Prix (EUR)"
          id="prod-prix"
          type="number"
          registration={register("prix", { valueAsNumber: true })}
          erreur={errors.prix}
        />

        <div style={{ marginBottom: "12px" }}>
          <label htmlFor="prod-cat">Catégorie :</label>
          <br />
          <select id="prod-cat" {...register("categorie")} style={{ width: "100%", padding: "8px" }}>
            <option value="">-- Choisir --</option>
            <option value="electronique">Électronique</option>
            <option value="vetements">Vêtements</option>
            <option value="alimentation">Alimentation</option>
          </select>
          {errors.categorie && (
            <p style={{ color: "red", fontSize: "12px" }}>{errors.categorie.message}</p>
          )}
        </div>

        <div style={{ marginBottom: "12px" }}>
          <label>
            <input type="checkbox" {...register("enStock")} /> En stock
          </label>
        </div>

        <button type="submit" disabled={isSubmitting} style={{ padding: "8px 16px" }}>
          {isSubmitting ? "Ajout..." : "Ajouter le produit"}
        </button>
      </form>

      {produitCree && (
        <div style={{ marginTop: "20px", padding: "12px", backgroundColor: "#d4edda", borderRadius: "4px" }}>
          <h3>Produit ajouté</h3>
          <p><strong>Nom :</strong> {produitCree.nom}</p>
          <p><strong>Prix :</strong> {produitCree.prix} EUR</p>
          <p><strong>Catégorie :</strong> {produitCree.categorie}</p>
          <p><strong>En stock :</strong> {produitCree.enStock ? "Oui" : "Non"}</p>
          {produitCree.description && <p><strong>Description :</strong> {produitCree.description}</p>}
        </div>
      )}
    </div>
  );
}

export default FormulaireProduit;
```

---

## Navigation

← Fiche précédente : **[13 - React et Symfony](13-react-symfony.md)**

→ Fiche suivante : **[15 - Tests React](15-tests-react.md)**
