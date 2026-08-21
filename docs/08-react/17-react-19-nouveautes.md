---
tags:
  - React
  - Avancé
  - Concept
description: "Découvrir les nouveautés de React 19 : Actions, useActionState, useFormStatus, useOptimistic, le hook use, ref en prop et les métadonnées de document."
estimated_time: "75 min"
fiche_number: 17
total_fiches: 19
cursus: "React"
id: "web.react.react-19-nouveautes"
course_id: "web.react"
content_type: "lesson"
order: 17
---

# 17 - React 19 : ce qui a changé

> **En bref** : Comprendre les nouveautés de React 19 (Actions, useActionState, useFormStatus, useOptimistic, le hook use, ref en prop, métadonnées de document) à partir des hooks classiques que tu connais déjà. Lecture estimée : 75 min.

## Prérequis

- [Projet intégrateur](16-projet-integrateur.md) terminé : tu maîtrises l'ensemble du cursus React de base
- Savoir utiliser `useState`, `useEffect` et `useContext` (fiches [05](05-etat-usestate.md), [07](07-useeffect-cycle-vie.md), [10](10-context-etat-global.md))
- Avoir écrit des formulaires contrôlés (fiche [06](06-evenements-formulaires.md))
- Avoir fait des appels API avec `fetch` (fiche [12](12-appels-api-fetch.md))

## Objectif de cette fiche

À la fin de cette fiche, tu sauras reconnaître et utiliser les principales nouveautés de React 19 : gérer la soumission d'un formulaire avec une Action et `useActionState`, afficher l'état d'envoi avec `useFormStatus`, mettre à jour l'interface de façon optimiste avec `useOptimistic`, lire une promesse avec le hook `use`, passer `ref` comme une prop ordinaire, et déclarer le titre de la page directement dans un composant.

---

## Concepts

Cette section explique les nouveautés une par une. Chaque nouveauté part de ce que tu sais déjà faire (avec `useState` et `useEffect`) et montre ce que React 19 simplifie. Lis cette section entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une Action dans React 19 ?

**Définition** : Une Action est une fonction (souvent asynchrone) que tu passes directement à l'attribut `action` d'un `<form>` ou à un hook dédié. React se charge automatiquement de gérer l'état de chargement, les erreurs et la réinitialisation du formulaire pendant l'exécution de cette fonction.

**Le problème que les Actions résolvent** :

Avant React 19, soumettre un formulaire avec un appel réseau demandait beaucoup de code manuel :

1. **État de chargement manuel** : il fallait un `useState` pour `chargement` et le mettre à `true` au début, `false` à la fin.
2. **Gestion d'erreur manuelle** : il fallait un autre `useState` pour `erreur`, l'envelopper dans un `try/catch`.
3. **Code répétitif** : chaque formulaire dupliquait la même mécanique de soumission.

**Comment les Actions résolvent ces problèmes** :

| Problème | Solution apportée par les Actions |
| --- | --- |
| État de chargement manuel | React expose l'état de chargement automatiquement |
| Gestion d'erreur manuelle | Les erreurs sont capturées et exposées dans l'état |
| Code répétitif | La même Action gère soumission, chargement et erreur |

**Analogie concrète** : Une Action est comme déposer un dossier complet à un guichet administratif au lieu de remplir chaque formulaire séparément. Tu donnes le dossier (la fonction), et le guichet (React) s'occupe de te dire "en cours de traitement", "accepté" ou "refusé" sans que tu aies à demander l'état à chaque étape.

**Ce qu'une Action n'est PAS** :

- Une Action n'est pas réservée aux Server Components. Elle fonctionne aussi dans une application React classique (côté client uniquement), comme celle du projet intégrateur.
- Une Action n'est pas un remplacement obligatoire de tes formulaires existants. Tu peux continuer à utiliser des formulaires contrôlés avec `useState` ; les Actions sont une option plus concise.

---

### Qu'est-ce que useActionState ?

**Définition** : `useActionState` est un hook qui prend une Action et un état initial, et retourne l'état actuel, une version "enveloppée" de l'Action à passer au formulaire, et un booléen `isPending` qui indique si l'Action est en cours d'exécution.

**Le problème que useActionState résout** :

Sans `useActionState`, pour afficher un message de résultat après soumission, il fallait :

1. **Un useState pour le résultat** : stocker le message de succès ou d'erreur retourné par le serveur.
2. **Un useState pour le chargement** : savoir si la requête est en cours pour désactiver le bouton.
3. **Relier les deux** : synchroniser ces états dans la fonction de soumission, sans oublier de cas.

**Comment useActionState résout ces problèmes** :

| Problème | Solution apportée par useActionState |
| --- | --- |
| useState pour le résultat | L'état retourné par l'Action est géré par le hook |
| useState pour le chargement | `isPending` est fourni directement |
| Relier les deux | Un seul hook centralise l'état et le statut |

**Syntaxe** :

```tsx
import { useActionState } from "react";

// La signature de l'Action : (etatPrecedent, formData) => nouvelEtat
const [etat, soumettreAction, isPending] = useActionState(
  async (etatPrecedent, formData) => {
    // Logique de soumission ici
    return nouvelEtat;
  },
  etatInitial
);
```

**Analogie concrète** : `useActionState` est comme un ticket de suivi de commande. Tu passes ta commande (l'Action), et le ticket te donne en permanence trois informations : l'état actuel de la commande (`etat`), le moyen de passer une nouvelle commande (`soumettreAction`), et un voyant "en préparation" (`isPending`).

**Comparaison : soumission classique vs useActionState** :

| Soumission classique (useState) | useActionState |
| --- | --- |
| 2 ou 3 `useState` séparés | 1 seul hook |
| `try/catch` manuel dans le handler | Le retour de l'Action devient l'état |
| Gérer `chargement` à la main | `isPending` fourni automatiquement |

---

### Qu'est-ce que useFormStatus ?

**Définition** : `useFormStatus` est un hook qui, depuis un composant enfant placé à l'intérieur d'un `<form>`, donne accès à l'état de soumission de ce formulaire (notamment `pending`, qui vaut `true` pendant l'envoi).

**Le problème que useFormStatus résout** :

Sans `useFormStatus`, pour désactiver un bouton "Envoyer" pendant la soumission, il fallait passer une prop `chargement` depuis le composant parent jusqu'au bouton :

1. **Prop drilling de l'état de chargement** : le parent doit transmettre `chargement` au bouton, même à travers des composants intermédiaires.
2. **Couplage fort** : un bouton réutilisable doit recevoir cette prop à chaque usage.
3. **Risque d'oubli** : on oublie facilement de désactiver le bouton, ce qui permet des doubles soumissions.

**Comment useFormStatus résout ces problèmes** :

| Problème | Solution apportée par useFormStatus |
| --- | --- |
| Prop drilling de l'état de chargement | Le bouton lit l'état directement depuis le formulaire parent |
| Couplage fort | Le bouton n'a plus besoin de prop `chargement` |
| Risque d'oubli | L'état est toujours à jour, sans synchronisation manuelle |

**Analogie concrète** : `useFormStatus` est comme un panneau "caisse fermée" qui s'allume automatiquement quand le caissier traite un client. Le panneau n'a pas besoin qu'on lui dise manuellement de s'allumer : il lit directement l'état de la caisse (le formulaire) au-dessus de lui.

**Ce que useFormStatus n'est PAS** :

- `useFormStatus` n'est pas utilisable dans le composant qui contient lui-même la balise `<form>`. Il doit être appelé depuis un composant **enfant** du formulaire. C'est le piège le plus fréquent (voir la section Pièges Fréquents).

---

### Qu'est-ce que useOptimistic ?

**Définition** : `useOptimistic` est un hook qui affiche immédiatement un état "optimiste" (le résultat attendu) pendant qu'une Action asynchrone est en cours, puis revient automatiquement à l'état réel quand l'Action se termine.

**Le problème que useOptimistic résout** :

Sans mise à jour optimiste, après une action comme "ajouter un commentaire" :

1. **Attente visible** : l'utilisateur clique, puis attend la réponse du serveur avant de voir son commentaire apparaître. L'interface semble lente.
2. **Code de rollback complexe** : pour afficher tout de suite puis annuler en cas d'erreur, il fallait dupliquer l'état et écrire la logique de retour en arrière à la main.

**Comment useOptimistic résout ces problèmes** :

| Problème | Solution apportée par useOptimistic |
| --- | --- |
| Attente visible | L'élément apparaît instantanément (état optimiste) |
| Code de rollback complexe | React revient automatiquement à l'état réel à la fin |

**Analogie concrète** : `useOptimistic` est comme envoyer un message dans une application de messagerie. Ton message s'affiche tout de suite à l'écran (état optimiste), souvent avec une petite horloge "en cours d'envoi". S'il part bien, l'horloge devient une coche. S'il échoue, le message est retiré ou marqué en erreur. Tu n'attends pas la confirmation du serveur pour voir ton message.

**Ce que useOptimistic n'est PAS** :

- `useOptimistic` n'est pas un cache de données. Il ne stocke rien durablement : il affiche une prévision temporaire pendant une Action, rien de plus.

---

### Qu'est-ce que le hook use ?

**Définition** : `use` est une nouvelle fonction de React qui lit la valeur d'une ressource, comme une promesse (`Promise`) ou un contexte (`Context`). Quand on lui passe une promesse, le composant se "suspend" jusqu'à ce que la promesse soit résolue, puis affiche le résultat.

**Le problème que use résout** :

Pour afficher des données chargées de façon asynchrone, le schéma classique avec `useEffect` demande :

1. **Trois états** : `donnees`, `chargement`, `erreur`, comme dans le hook `useFetch` des fiches précédentes.
2. **Un useEffect dédié** : pour lancer le chargement et gérer le nettoyage.
3. **Du code de garde** : vérifier `chargement` et `erreur` avant d'afficher les données.

**Comment use résout ces problèmes** :

| Problème | Solution apportée par use |
| --- | --- |
| Trois états manuels | La promesse contient déjà ces informations |
| useEffect dédié | `use` lit la promesse directement dans le rendu |
| Code de garde | `<Suspense>` gère l'attente, un `ErrorBoundary` gère l'erreur |

**Analogie concrète** : Le hook `use` est comme commander un plat au restaurant et attendre à table. Tu n'as pas à vérifier toutes les dix secondes si le plat est prêt (le `useEffect` qui surveille). Tu passes la commande, le serveur t'apporte le plat quand il est prêt (`<Suspense>` affiche un message d'attente entre-temps), et si la cuisine a un problème, le maître d'hôtel vient te prévenir (l'`ErrorBoundary`).

**Ce que use n'est PAS** :

- `use` n'est pas un hook ordinaire au sens strict : contrairement à `useState` ou `useEffect`, tu peux l'appeler à l'intérieur d'une condition (`if`) ou d'une boucle. C'est une exception volontaire aux règles des hooks. Cependant, `use` reste soumis à une règle fondamentale : il ne peut être appelé **que dans un composant ou un hook personnalisé**, jamais dans une fonction ordinaire.
- `use` ne remplace pas une vraie bibliothèque de cache de données. Pour gérer le cache, la revalidation et le partage des requêtes, on utilise un outil dédié (voir la fiche [18 - TanStack Query](18-tanstack-query.md)).

---

### Qu'est-ce que "ref en prop" ?

**Définition** : Dans React 19, un composant fonction peut recevoir `ref` directement comme une prop ordinaire, sans avoir besoin de l'enrober dans `forwardRef`.

**Le problème que "ref en prop" résout** :

Avant React 19, pour transmettre une `ref` à un composant enfant (par exemple pour donner le focus à un champ), il fallait utiliser `forwardRef` :

1. **Syntaxe verbeuse** : chaque composant qui transmet une ref devait être enveloppé dans `forwardRef`.
2. **Confusion fréquente** : l'ordre des arguments (`props` puis `ref`) était une source d'erreurs.

**Comment "ref en prop" résout ces problèmes** :

| Problème | Solution apportée par ref en prop |
| --- | --- |
| Syntaxe verbeuse | `ref` se déclare comme une prop normale |
| Confusion sur les arguments | Plus besoin d'un second paramètre `ref` |

**Comparaison : forwardRef vs ref en prop** :

| Avant (forwardRef) | React 19 (ref en prop) |
| --- | --- |
| `const Champ = forwardRef((props, ref) => ...)` | `function Champ({ ref, ...props }) { ... }` |
| `ref` est un argument séparé | `ref` est dans l'objet de props |
| Nécessite l'import de `forwardRef` | Aucun import supplémentaire |

**Note** : `forwardRef` continue de fonctionner dans React 19, mais il est désormais considéré comme inutile pour les nouveaux composants.

---

### Qu'est-ce que les métadonnées de document ?

**Définition** : Les métadonnées de document sont les balises `<title>`, `<meta>` et `<link>` qui décrivent la page. Dans React 19, tu peux écrire ces balises directement dans le rendu d'un composant : React les déplace automatiquement dans la section `<head>` du document.

**Le problème que les métadonnées de document résolvent** :

Avant React 19, pour changer le titre de l'onglet selon la page affichée, il fallait :

1. **Manipuler le DOM à la main** : écrire `document.title = "..."` dans un `useEffect`.
2. **Utiliser une bibliothèque externe** : ajouter une dépendance pour gérer le `<head>`.

**Comment les métadonnées de document résolvent ces problèmes** :

| Problème | Solution apportée par les métadonnées de document |
| --- | --- |
| Manipuler le DOM à la main | Tu écris `<title>` directement dans le composant |
| Bibliothèque externe | React gère le placement dans `<head>` nativement |

**Analogie concrète** : C'est comme coller une étiquette de nom sur la porte d'un bureau. Avant, il fallait demander à un agent (le `useEffect`) d'aller poser l'étiquette à l'accueil (le `<head>`). Maintenant, tu écris l'étiquette dans le bureau lui-même, et React se charge de la transporter au bon endroit.

---

### Aperçu : les Server Components (concept seulement)

**Définition** : Un Server Component est un composant React qui s'exécute uniquement côté serveur. Il génère du HTML et n'envoie jamais son code JavaScript au navigateur.

**Pourquoi en parler ici** : React 19 stabilise cette fonctionnalité. Tu n'en as **pas besoin** pour une application React classique (comme le projet intégrateur, qui est une SPA côté client). Mais le terme revient souvent, donc voici l'idée en une phrase chacun.

**Ce qu'il faut retenir** :

| Composant client (ce que tu connais) | Server Component |
| --- | --- |
| S'exécute dans le navigateur | S'exécute sur le serveur |
| Peut utiliser `useState`, `useEffect` | Ne peut pas utiliser d'état ni d'effet |
| Envoie son JavaScript au navigateur | N'envoie pas de JavaScript |
| Géré par Vite + React (ton cas) | Nécessite un framework dédié (par exemple Next.js) |

**Ce que les Server Components ne sont PAS** :

- Les Server Components ne sont pas activables dans un projet Vite standard sans framework. Tant que tu construis des SPA avec Vite, tu utilises uniquement des composants client. Retiens le concept, sans chercher à l'implémenter ici.

---

## Étapes Pratiques

Pour ces exemples, repars d'un projet React créé avec Vite (comme dans la fiche [02 - Créer un projet React](02-creer-projet-react.md)), avec React 19 installé. Vérifie ta version :

```bash
# Affiche la version de React installée
npm list react
```

**Résultat attendu** :

```text
mon-projet@0.0.0
└── react@19.x.x
```

---

### Étape 1 : Un formulaire avec Action et useActionState

Crée `src/components/FormulaireInscription.tsx` :

```tsx
// src/components/FormulaireInscription.tsx
import { useActionState } from "react";

// Décrit le résultat retourné par l'Action
interface ResultatInscription {
  succes: boolean;
  message: string;
}

// Simule un appel réseau d'inscription
async function envoyerInscription(email: string): Promise<void> {
  // Attend 800 ms pour imiter la latence réseau
  await new Promise((resolve) => setTimeout(resolve, 800));
  // Rejette si l'email ne contient pas d'arobase (validation simulée)
  if (!email.includes("@")) {
    throw new Error("L'adresse email n'est pas valide");
  }
}

function FormulaireInscription() {
  // useActionState prend l'Action et l'état initial
  // Il retourne : l'état actuel, l'Action à passer au form, et isPending
  const [etat, soumettreAction, isPending] = useActionState(
    // etatPrecedent n'est pas utilisé ici, mais fait partie de la signature
    async (_etatPrecedent: ResultatInscription | null, formData: FormData) => {
      // FormData contient les valeurs du formulaire, lues par leur attribut name
      const email = String(formData.get("email"));

      try {
        await envoyerInscription(email);
        // La valeur retournée devient le nouvel état
        return { succes: true, message: "Inscription réussie." };
      } catch (err) {
        const message = err instanceof Error ? err.message : "Erreur inconnue";
        return { succes: false, message };
      }
    },
    // État initial : aucun résultat encore
    null
  );

  return (
    <form action={soumettreAction} style={{ maxWidth: "320px" }}>
      <label htmlFor="inscription-email">Email :</label>
      <br />
      <input
        id="inscription-email"
        type="email"
        name="email"
        required
        disabled={isPending}
        style={{ width: "100%", padding: "8px", marginBottom: "8px" }}
      />

      <button type="submit" disabled={isPending} style={{ padding: "8px 16px" }}>
        {isPending ? "Envoi en cours..." : "S'inscrire"}
      </button>

      {/* Affiche le message de résultat quand l'état n'est plus null */}
      {etat && (
        <p style={{ color: etat.succes ? "green" : "red", marginTop: "8px" }}>
          {etat.message}
        </p>
      )}
    </form>
  );
}

export default FormulaireInscription;
```

**Résultat attendu** : un formulaire avec un champ email. Pendant l'envoi (800 ms), le bouton affiche "Envoi en cours..." et le champ est désactivé. Avec une adresse valide, le message "Inscription réussie." s'affiche en vert. Sans arobase, le message d'erreur s'affiche en rouge. Aucun `useState` pour le chargement ou l'erreur n'a été nécessaire.

---

### Étape 2 : Un bouton réutilisable avec useFormStatus

Crée `src/components/BoutonSoumission.tsx`. Ce composant doit être un **enfant** du `<form>` pour que `useFormStatus` fonctionne :

```tsx
// src/components/BoutonSoumission.tsx
import { useFormStatus } from "react-dom";

// Ce bouton lit l'état du formulaire parent, sans recevoir de prop "chargement"
function BoutonSoumission({ libelle }: { libelle: string }) {
  // pending vaut true pendant la soumission du formulaire parent
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} style={{ padding: "8px 16px" }}>
      {pending ? "Traitement..." : libelle}
    </button>
  );
}

export default BoutonSoumission;
```

Utilise-le dans un formulaire (par exemple une variante du formulaire d'inscription) :

```tsx
// Extrait : remplace le <button> manuel par le composant réutilisable
import BoutonSoumission from "./BoutonSoumission";

// ... à l'intérieur du <form action={soumettreAction}> ...
<BoutonSoumission libelle="S'inscrire" />
```

**Résultat attendu** : le bouton se désactive et affiche "Traitement..." pendant la soumission, sans qu'on lui passe de prop `chargement`. Il lit l'état directement depuis le `<form>` qui l'englobe.

---

### Étape 3 : Mise à jour optimiste avec useOptimistic

Crée `src/components/ListeCommentaires.tsx` :

```tsx
// src/components/ListeCommentaires.tsx
import { useOptimistic, useState, useRef } from "react";

interface Commentaire {
  id: number;
  texte: string;
  enCours?: boolean; // marque un commentaire affiché de façon optimiste
}

// Simule l'envoi d'un commentaire au serveur
async function envoyerCommentaire(texte: string): Promise<Commentaire> {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return { id: Date.now(), texte };
}

function ListeCommentaires() {
  // L'état réel : les commentaires confirmés par le serveur
  const [commentaires, setCommentaires] = useState<Commentaire[]>([
    { id: 1, texte: "Premier commentaire." },
  ]);

  // useOptimistic crée une vue "optimiste" basée sur l'état réel
  // Le second argument décrit comment ajouter un élément optimiste
  const [commentairesOptimistes, ajouterOptimiste] = useOptimistic(
    commentaires,
    (etatActuel, nouveauTexte: string) => [
      ...etatActuel,
      // L'élément optimiste est marqué enCours pour l'affichage
      { id: Date.now(), texte: nouveauTexte, enCours: true },
    ]
  );

  const refFormulaire = useRef<HTMLFormElement>(null);

  // Action de soumission du formulaire
  const soumettre = async (formData: FormData) => {
    const texte = String(formData.get("commentaire"));
    if (!texte.trim()) return;

    // Affiche immédiatement le commentaire (optimiste)
    ajouterOptimiste(texte);
    // Réinitialise le champ tout de suite
    refFormulaire.current?.reset();

    // Envoie au serveur, puis ajoute le commentaire confirmé à l'état réel
    const confirme = await envoyerCommentaire(texte);
    setCommentaires((prev) => [...prev, confirme]);
  };

  return (
    <div style={{ maxWidth: "400px" }}>
      <ul>
        {commentairesOptimistes.map((c) => (
          <li key={c.id} style={{ opacity: c.enCours ? 0.5 : 1 }}>
            {c.texte}
            {c.enCours && <span> (envoi...)</span>}
          </li>
        ))}
      </ul>

      <form action={soumettre} ref={refFormulaire}>
        <input
          type="text"
          name="commentaire"
          placeholder="Ajoute un commentaire"
          style={{ width: "70%", padding: "8px" }}
        />
        <button type="submit" style={{ padding: "8px 12px" }}>
          Envoyer
        </button>
      </form>
    </div>
  );
}

export default ListeCommentaires;
```

**Résultat attendu** : quand tu soumets un commentaire, il apparaît immédiatement dans la liste, grisé, avec la mention "(envoi...)". Une seconde plus tard (réponse simulée du serveur), le commentaire devient normal. L'interface ne semble jamais figée pendant l'attente.

---

### Étape 4 : Lire une promesse avec le hook use

Crée `src/components/ProfilUtilisateur.tsx` :

```tsx
// src/components/ProfilUtilisateur.tsx
import { use, Suspense } from "react";

interface Utilisateur {
  id: number;
  nom: string;
}

// Crée une promesse UNE SEULE FOIS, en dehors du composant
// (sinon elle serait recréée à chaque rendu, provoquant une boucle)
const promesseUtilisateur: Promise<Utilisateur> = new Promise((resolve) => {
  setTimeout(() => resolve({ id: 1, nom: "Alice Dupont" }), 1000);
});

// Ce composant lit directement la promesse avec use()
function CarteProfil() {
  // use suspend le composant jusqu'à ce que la promesse soit résolue
  const utilisateur = use(promesseUtilisateur);

  return (
    <div style={{ padding: "12px", border: "1px solid #ccc" }}>
      <p>Identifiant : {utilisateur.id}</p>
      <p>Nom : {utilisateur.nom}</p>
    </div>
  );
}

// Le parent enveloppe CarteProfil dans Suspense pour gérer l'attente
function ProfilUtilisateur() {
  return (
    <Suspense fallback={<p>Chargement du profil...</p>}>
      <CarteProfil />
    </Suspense>
  );
}

export default ProfilUtilisateur;
```

**Résultat attendu** : pendant une seconde, le texte "Chargement du profil..." s'affiche (géré par `<Suspense>`). Ensuite, la carte avec l'identifiant et le nom apparaît. Aucun `useState` ni `useEffect` n'a été nécessaire pour gérer le chargement.

---

### Étape 5 : ref en prop, sans forwardRef

Crée `src/components/ChampTexte.tsx` :

```tsx
// src/components/ChampTexte.tsx
import { Ref } from "react";

interface PropsChampTexte {
  // ref est déclaré comme une prop ordinaire (nouveauté React 19)
  ref?: Ref<HTMLInputElement>;
  placeholder?: string;
}

// Plus besoin de forwardRef : ref est juste une prop parmi les autres
function ChampTexte({ ref, placeholder }: PropsChampTexte) {
  return (
    <input
      ref={ref}
      type="text"
      placeholder={placeholder}
      style={{ padding: "8px", width: "100%" }}
    />
  );
}

export default ChampTexte;
```

Utilise-le pour donner le focus au champ depuis un parent :

```tsx
// src/components/FormulaireFocus.tsx
import { useRef } from "react";
import ChampTexte from "./ChampTexte";

function FormulaireFocus() {
  // Crée une ref vers l'élément input du composant enfant
  const refChamp = useRef<HTMLInputElement>(null);

  return (
    <div style={{ maxWidth: "320px" }}>
      {/* On passe la ref comme une prop normale */}
      <ChampTexte ref={refChamp} placeholder="Clique sur le bouton" />

      <button
        onClick={() => refChamp.current?.focus()}
        style={{ marginTop: "8px", padding: "8px 16px" }}
      >
        Donner le focus au champ
      </button>
    </div>
  );
}

export default FormulaireFocus;
```

**Résultat attendu** : un clic sur le bouton place le curseur dans le champ texte du composant enfant. Le code n'utilise pas `forwardRef`.

---

### Étape 6 : Métadonnées de document dans un composant

Crée `src/components/PageArticle.tsx` :

```tsx
// src/components/PageArticle.tsx
interface PropsPageArticle {
  titre: string;
  resume: string;
}

function PageArticle({ titre, resume }: PropsPageArticle) {
  return (
    <article>
      {/* React 19 déplace automatiquement ces balises dans le <head> */}
      <title>{titre} - Mon blog</title>
      <meta name="description" content={resume} />

      <h1>{titre}</h1>
      <p>{resume}</p>
    </article>
  );
}

export default PageArticle;
```

**Résultat attendu** : quand ce composant est affiché, l'onglet du navigateur porte le titre "Titre de l'article - Mon blog", et la balise `<meta name="description">` est présente dans le `<head>` du document. Aucun `useEffect` ni manipulation manuelle de `document.title` n'a été nécessaire.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm list react` | Affiche la version de React installée |
| `npm install react@19 react-dom@19` | Installe React 19 |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types TypeScript |

---

## Pièges Fréquents

### Piège 1 : Utiliser useFormStatus dans le mauvais composant

⚠️ **Problème** : Appeler `useFormStatus` dans le composant qui contient lui-même la balise `<form>`. Le hook retourne toujours `pending: false`, car il ne voit aucun formulaire parent.

✅ **Solution** : Place `useFormStatus` dans un composant **enfant** du `<form>`, comme le bouton de soumission de l'étape 2.

```tsx
// ❌ Incorrect : useFormStatus dans le même composant que <form>
function Formulaire() {
  const { pending } = useFormStatus(); // toujours false
  return <form>...</form>;
}

// ✅ Correct : un composant enfant lit l'état
function Bouton() {
  const { pending } = useFormStatus();
  return <button disabled={pending}>Envoyer</button>;
}
```

---

### Piège 2 : Recréer la promesse à chaque rendu avec use

⚠️ **Problème** : Créer la promesse à l'intérieur du composant qui appelle `use`. À chaque rendu, une nouvelle promesse est créée, ce qui provoque un rechargement infini.

✅ **Solution** : Crée la promesse en dehors du composant, ou stabilise-la (par exemple via un cache ou une bibliothèque dédiée). C'est la raison pour laquelle, en pratique, on utilise un outil comme TanStack Query (fiche 18) pour les vraies données.

```tsx
// ❌ Incorrect : nouvelle promesse à chaque rendu
function Profil() {
  const data = use(fetch("/api/user").then((r) => r.json()));
  // ...
}

// ✅ Correct : promesse stable, créée une seule fois
const promesse = fetch("/api/user").then((r) => r.json());
function Profil() {
  const data = use(promesse);
  // ...
}
```

---

### Piège 3 : Croire que les Actions imposent un serveur

⚠️ **Problème** : Penser qu'une Action ou `useActionState` nécessite des Server Components ou un framework comme Next.js.

✅ **Solution** : Les Actions, `useActionState`, `useFormStatus` et `useOptimistic` fonctionnent dans une application React 100 % côté client, comme une SPA Vite. Les Server Components sont une fonctionnalité distincte et optionnelle.

---

### Piège 4 : Oublier l'attribut name dans un formulaire avec Action

⚠️ **Problème** : Avec une Action, les valeurs sont lues via l'objet `FormData` à partir de l'attribut `name` de chaque champ. Si un champ n'a pas de `name`, sa valeur est introuvable (`formData.get("...")` renvoie `null`).

✅ **Solution** : Donne un attribut `name` à chaque champ qui doit être transmis.

```tsx
// ❌ Incorrect : pas de name, la valeur est perdue
<input type="email" />

// ✅ Correct : name défini, lisible via formData.get("email")
<input type="email" name="email" />
```

---

## Checklist de Validation

- [ ] Je comprends ce qu'est une Action et ce qu'elle automatise
- [ ] Je sais utiliser `useActionState` pour gérer état, soumission et `isPending`
- [ ] Je sais utiliser `useFormStatus` dans un composant enfant du formulaire
- [ ] Je sais afficher une mise à jour optimiste avec `useOptimistic`
- [ ] Je sais lire une promesse avec `use` et `<Suspense>`
- [ ] Je sais passer `ref` comme une prop, sans `forwardRef`
- [ ] Je sais déclarer un `<title>` directement dans un composant
- [ ] Je sais expliquer en une phrase ce qu'est un Server Component

---

## Exercice Pratique

**Énoncé** : Crée un formulaire d'ajout de tâche "moderne" qui combine trois nouveautés de React 19, sans aucun `useState` pour le chargement ni l'erreur.

**Indications** :

- Crée un composant `FormulaireTacheModerne` qui affiche une liste de tâches (un simple tableau de chaînes) et un champ pour en ajouter une.
- Utilise `useActionState` pour gérer l'ajout : l'Action reçoit le `FormData`, valide que le titre fait au moins 3 caractères, et retourne soit un message d'erreur, soit la liste mise à jour.
- Simule une latence réseau de 600 ms dans l'Action avec `await new Promise((r) => setTimeout(r, 600))`.
- Crée un composant enfant `BoutonAjout` qui utilise `useFormStatus` pour afficher "Ajout..." pendant la soumission et se désactiver.
- Affiche le message d'erreur (s'il existe) sous le formulaire.

**Résultat attendu** : un formulaire où, après soumission, le bouton affiche "Ajout..." pendant 600 ms, puis la tâche apparaît dans la liste (ou un message d'erreur s'affiche si le titre est trop court). Aucun `useState` n'est utilisé pour le chargement ou l'erreur.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Le bouton avec useFormStatus

Crée `src/components/BoutonAjout.tsx` :

```tsx
// src/components/BoutonAjout.tsx
import { useFormStatus } from "react-dom";

// Composant enfant du formulaire : il lit l'état de soumission
function BoutonAjout() {
  const { pending } = useFormStatus();

  return (
    <button type="submit" disabled={pending} style={{ padding: "8px 16px" }}>
      {pending ? "Ajout..." : "Ajouter"}
    </button>
  );
}

export default BoutonAjout;
```

### 2. Le formulaire avec useActionState

Crée `src/components/FormulaireTacheModerne.tsx` :

```tsx
// src/components/FormulaireTacheModerne.tsx
import { useActionState } from "react";
import BoutonAjout from "./BoutonAjout";

// L'état combine la liste des tâches et un éventuel message d'erreur
interface EtatTaches {
  taches: string[];
  erreur: string | null;
}

function FormulaireTacheModerne() {
  const [etat, ajouterAction] = useActionState(
    async (etatPrecedent: EtatTaches, formData: FormData) => {
      // Lit la valeur du champ "titre" via FormData
      const titre = String(formData.get("titre")).trim();

      // Validation : au moins 3 caractères
      if (titre.length < 3) {
        // On garde la liste actuelle et on ajoute un message d'erreur
        return {
          taches: etatPrecedent.taches,
          erreur: "Le titre doit contenir au moins 3 caractères",
        };
      }

      // Simule la latence réseau
      await new Promise((resolve) => setTimeout(resolve, 600));

      // Retourne la liste mise à jour, sans erreur
      return {
        taches: [...etatPrecedent.taches, titre],
        erreur: null,
      };
    },
    // État initial
    { taches: [], erreur: null }
  );

  return (
    <div style={{ maxWidth: "400px" }}>
      <h2>Mes tâches</h2>

      <ul>
        {etat.taches.map((tache, index) => (
          // L'index suffit ici car la liste ne fait que grandir
          <li key={index}>{tache}</li>
        ))}
      </ul>

      <form action={ajouterAction}>
        <input
          type="text"
          name="titre"
          placeholder="Nouvelle tâche"
          style={{ width: "70%", padding: "8px", marginRight: "8px" }}
        />
        <BoutonAjout />
      </form>

      {/* Affiche le message d'erreur s'il existe */}
      {etat.erreur && (
        <p style={{ color: "red", marginTop: "8px" }}>{etat.erreur}</p>
      )}
    </div>
  );
}

export default FormulaireTacheModerne;
```

### 3. Vérification

Pour tester, affiche `FormulaireTacheModerne` dans `App.tsx` :

```tsx
// src/App.tsx
import FormulaireTacheModerne from "./components/FormulaireTacheModerne";

function App() {
  return (
    <div style={{ padding: "20px" }}>
      <FormulaireTacheModerne />
    </div>
  );
}

export default App;
```

Puis lance l'application :

```bash
# Lance le serveur de développement
npm run dev
```

Comportement attendu :

1. Tape un titre de moins de 3 caractères et soumets : le message d'erreur s'affiche, aucune tâche n'est ajoutée.
2. Tape un titre valide et soumets : le bouton affiche "Ajout..." pendant 600 ms, puis la tâche apparaît dans la liste.
3. Le code n'utilise aucun `useState` pour le chargement ou l'erreur : tout est géré par `useActionState` et `useFormStatus`.

---

## Navigation

← Fiche précédente : **[16 - Projet intégrateur](16-projet-integrateur.md)**

→ Fiche suivante : **[18 - TanStack Query](18-tanstack-query.md)**
