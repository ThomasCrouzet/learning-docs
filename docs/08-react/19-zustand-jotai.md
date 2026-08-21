---
tags:
  - React
  - Avancé
  - Concept
description: "Gérer l'état global léger avec Zustand (store, sélecteurs, sans provider) et découvrir Jotai (atomes), puis choisir entre Zustand, Context et TanStack Query."
estimated_time: "90 min"
fiche_number: 19
total_fiches: 19
cursus: "React"
id: "web.react.zustand-jotai"
course_id: "web.react"
content_type: "lesson"
order: 19
---

# 19 - Zustand et Jotai (état global léger)

> **En bref** : Dépasser les limites de Context + useReducer pour les gros états avec Zustand (store, sélecteurs, aucun provider), découvrir Jotai et ses atomes, et savoir choisir entre Zustand, Context et TanStack Query. Lecture estimée : 90 min.

## Prérequis

- [Context et état global](10-context-etat-global.md) terminée : tu sais créer un Context et utiliser `useReducer`
- [TanStack Query (gestion du cache serveur)](18-tanstack-query.md) lue : tu connais la distinction entre état serveur et état local
- Savoir utiliser `useState`, `useContext` et comprendre le rendu des composants React

## Objectif de cette fiche

À la fin de cette fiche, tu sauras expliquer pourquoi Context + useReducer devient coûteux sur un gros état partagé, créer un store Zustand et le lire avec des sélecteurs ciblés, comprendre le modèle par atomes de Jotai, et choisir l'outil adapté entre Zustand, Context et TanStack Query.

---

## Concepts

Cette section explique d'abord pourquoi Context atteint ses limites sur un état volumineux, puis comment Zustand et Jotai y répondent. Lis-la entièrement avant les étapes pratiques.

### Les limites de Context + useReducer sur un gros état

**Définition** : Context + useReducer (vu à la fiche 10) partage un état global en plaçant un objet d'état dans un Context, que les composants lisent avec `useContext`. C'est une solution intégrée à React, sans dépendance externe.

**Le problème que ce rappel pose sur un gros état** :

Tant que l'état est petit et change peu, Context suffit. Mais dès qu'un seul Context regroupe beaucoup de données qui changent souvent, trois problèmes apparaissent :

1. **Re-rendus non ciblés** : tout composant qui appelle `useContext` se re-rend dès que **n'importe quelle** valeur du Context change, même celle qu'il n'utilise pas. Un composant qui ne lit que le thème se re-rend quand le panier change, s'ils sont dans le même Context.
2. **Découpage en cascade de providers** : pour limiter les re-rendus, on découpe en plusieurs Contexts, ce qui empile les `<Provider>` et complexifie l'arbre de composants.
3. **Logique dispersée** : avec `useReducer`, le reducer, les actions et le provider vivent à des endroits différents, et accéder à l'état hors d'un composant React (dans une fonction utilitaire) est difficile.

**Comment Zustand résout ces problèmes** :

| Limite de Context + useReducer | Solution apportée par Zustand |
| --- | --- |
| Re-rendus non ciblés | Les sélecteurs ne re-rendent que si la valeur lue change |
| Cascade de providers | Aucun provider : le store est un module importable |
| Logique dispersée | État et actions sont réunis dans un seul store |

**Analogie concrète** : Context, c'est comme un haut-parleur dans un open space : quand une annonce passe, **tout le monde** lève la tête, même ceux que ça ne concerne pas (re-rendus non ciblés). Zustand, c'est comme s'abonner à une liste de diffusion précise : tu ne reçois que les messages du sujet auquel tu t'es inscrit (le sélecteur). Les autres annonces ne t'interrompent pas.

**Ce que ce problème n'est PAS** :

- Ce n'est pas un défaut de Context à corriger. Context fait exactement ce pour quoi il est conçu : diffuser une valeur à un sous-arbre. Le souci vient de l'utiliser pour un gros état qui change souvent, un cas pour lequel il n'est pas optimisé.

---

### Qu'est-ce que Zustand ?

**Définition** : Zustand est une petite bibliothèque de gestion d'état global pour React. Elle crée un "store" (un conteneur d'état) sous forme de hook. Les composants lisent une partie précise du store avec un **sélecteur**, et ne se re-rendent que si cette partie change. Il n'y a aucun provider à placer dans l'arbre.

**Le problème que Zustand résout** :

1. **Re-rendus inutiles** : sans sélecteur ciblé, lire l'état global re-rend trop souvent.
2. **Boilerplate** : créer un état global avec Context + useReducer demande beaucoup de code répétitif (Context, provider, reducer, dispatch).
3. **Accès hors composant** : avec Context, on ne peut lire l'état que dans un composant React. Zustand permet aussi de le lire dans une fonction ordinaire.

**Comment Zustand résout ces problèmes** :

| Problème | Solution apportée par Zustand |
| --- | --- |
| Re-rendus inutiles | Les sélecteurs limitent le re-rendu à la valeur lue |
| Boilerplate | Un seul appel `create` regroupe état et actions |
| Accès hors composant | `useStore.getState()` lit l'état partout |

**Analogie concrète** : Un store Zustand est comme un tableau blanc partagé dans un bureau, accessible depuis tous les postes sans avoir à le faire circuler de main en main (pas de provider). Chaque personne ne regarde que la zone du tableau qui la concerne (le sélecteur) et n'est dérangée que si cette zone-là est modifiée.

**Ce que Zustand n'est PAS** :

- Zustand n'est pas un cache de données serveur. Pour les données qui viennent d'une API (liste d'articles, profil), TanStack Query (fiche 18) reste l'outil adapté. Zustand gère l'état **client** : thème, panier, ouverture d'un panneau, préférences.
- Zustand n'est pas un remplaçant systématique de `useState`. Un état purement local à un composant (la valeur d'un champ) reste dans `useState`.

**Comparaison : Context + useReducer vs Zustand** :

| Context + useReducer | Zustand |
| --- | --- |
| Nécessite un `<Provider>` dans l'arbre | Aucun provider |
| Re-rend tous les consommateurs du Context | Re-rend selon le sélecteur |
| Reducer, actions et provider séparés | État et actions dans un seul store |
| Accès uniquement dans un composant | Accès aussi via `getState()` |

---

### Qu'est-ce qu'un sélecteur ?

**Définition** : Un sélecteur est une fonction qui reçoit l'état complet du store et retourne uniquement la partie dont un composant a besoin. Zustand compare la valeur retournée entre deux rendus : si elle n'a pas changé, le composant ne se re-rend pas.

**Le problème que le sélecteur résout** :

1. **Re-rendus en trop** : lire tout l'état re-rend le composant à chaque changement, même sur une donnée non utilisée.

**Comment le sélecteur résout ce problème** :

| Problème | Solution apportée par le sélecteur |
| --- | --- |
| Re-rendus en trop | Le composant ne se re-rend que si la valeur sélectionnée change |

**Exemple de lecture ciblée** :

```tsx
// ✅ Sélecteur : ce composant ne se re-rend que si "compteur" change
const compteur = useStore((state) => state.compteur);

// ❌ Lecture globale : re-rendu à chaque changement du store
// Zustand v5 déconseille cet usage : préfère toujours un sélecteur ciblé
const { compteur } = useStore();
```

**Analogie concrète** : Un sélecteur est comme un filtre de notifications sur ton téléphone. Plutôt que de recevoir une alerte pour chaque activité de l'application (lecture globale), tu n'actives que les notifications du sujet qui t'intéresse (le sélecteur). Ton attention n'est sollicitée que pour ce sujet précis.

---

### Qu'est-ce que Jotai (le modèle par atomes) ?

**Définition** : Jotai est une autre bibliothèque d'état pour React, fondée sur des **atomes**. Un atome est une petite unité d'état indépendante. Les composants lisent et écrivent un atome avec un hook (`useAtom`), un peu comme `useState`, mais l'état vit en dehors du composant et peut être partagé.

**Le problème que Jotai résout** :

Là où Zustand centralise un gros store, Jotai part de l'autre côté : on compose l'état à partir de nombreuses petites cellules indépendantes.

1. **Couplage d'un gros store** : dans un seul store, des morceaux d'état sans rapport cohabitent.
2. **État dérivé** : calculer une valeur à partir d'autres (un total à partir d'une liste) demande du code manuel.

**Comment Jotai résout ces problèmes** :

| Problème | Solution apportée par Jotai |
| --- | --- |
| Couplage d'un gros store | Chaque atome est une cellule d'état indépendante |
| État dérivé | Un atome dérivé se calcule à partir d'autres atomes |

**Analogie concrète** : Les atomes de Jotai sont comme les cellules d'un tableur. Chaque cellule contient une valeur (un atome de base), et certaines cellules contiennent une formule qui se recalcule automatiquement à partir d'autres cellules (un atome dérivé). Tu composes ton état cellule par cellule, au lieu de tout mettre dans un seul grand bloc.

**Comparaison : Zustand vs Jotai** :

| Zustand | Jotai |
| --- | --- |
| Un store centralisé | De nombreux atomes indépendants |
| Lecture par sélecteur | Lecture par atome (`useAtom`) |
| Approche descendante (un gros objet) | Approche ascendante (petites cellules) |
| Idéal pour un état applicatif structuré | Idéal pour un état fragmenté et dérivé |

> **Note** : Jotai et Zustand répondent au même besoin (état client partagé) avec deux philosophies. Tu n'as pas besoin des deux : choisis selon la forme de ton état. Cette fiche détaille Zustand en pratique et donne un aperçu de Jotai.

---

### Quand préférer Zustand, Context ou TanStack Query ?

**Définition** : Ces trois outils gèrent des types d'état différents. Les confondre conduit soit à du code lourd, soit à des bugs de fraîcheur de données.

**Le critère de choix** :

| Type d'état | Outil adapté | Exemple |
| --- | --- | --- |
| Donnée serveur (vient d'une API) | TanStack Query | Liste d'articles, profil utilisateur |
| État client global, changeant, lu partout | Zustand (ou Jotai) | Panier, thème, authentification côté client |
| État client global, simple et stable | Context | Langue, thème rarement modifié |
| État local à un composant | `useState` | Valeur d'un champ, ouverture d'un menu local |

**Analogie concrète** : C'est comme choisir un contenant de cuisine. Une donnée serveur va au réfrigérateur (TanStack Query, avec une date de péremption gérée pour toi). Un état client partagé et vivant va dans un bocal sur le plan de travail, accessible à tous (Zustand). Une valeur partagée mais quasi figée tient dans un petit pot d'épices (Context). Et un ingrédient utilisé sur-le-champ reste dans la main du cuisinier (`useState`).

**Ce que ce choix n'est PAS** :

- Ce n'est pas "Zustand remplace tout". Mettre des données serveur dans Zustand te ferait réécrire à la main le cache, la déduplication et le rafraîchissement que TanStack Query fournit déjà.
- Ce n'est pas exclusif : une application réelle combine souvent TanStack Query (données serveur) **et** Zustand (état client). Les deux cohabitent sans conflit.

---

## Étapes Pratiques

Pour ces exemples, repars d'un projet React 19 + TypeScript créé avec Vite, comme dans les fiches précédentes du cursus.

### Étape 1 : Installer Zustand et créer un premier store

```bash
# Installe Zustand dans le projet
npm install zustand
```

Crée un store de compteur dans `src/stores/compteurStore.ts` :

```typescript
// src/stores/compteurStore.ts
import { create } from "zustand";

// Le type décrit l'état (compteur) et les actions (incrementer, reinitialiser)
interface CompteurState {
  compteur: number;
  incrementer: () => void;
  reinitialiser: () => void;
}

// create retourne un hook : useCompteurStore
// set met à jour l'état ; il reçoit l'état courant et retourne les champs modifiés
export const useCompteurStore = create<CompteurState>((set) => ({
  compteur: 0,
  // Incrémente en se basant sur la valeur précédente
  incrementer: () => set((state) => ({ compteur: state.compteur + 1 })),
  // Réinitialise à zéro
  reinitialiser: () => set({ compteur: 0 }),
}));
```

**Résultat attendu** :

```text
Le paquet zustand est installé. Le fichier compteurStore.ts compile sans
erreur de types. Aucun provider n'a été ajouté à l'application : le store
est un module importable.
```

---

### Étape 2 : Lire et modifier le store avec des sélecteurs

Crée `src/components/Compteur.tsx`. Chaque composant lit uniquement ce dont il a besoin :

```tsx
// src/components/Compteur.tsx
import { useCompteurStore } from "../stores/compteurStore";

// Ce composant n'affiche que la valeur : il ne lit que "compteur"
function AffichageCompteur() {
  // Sélecteur : re-rendu uniquement quand "compteur" change
  const compteur = useCompteurStore((state) => state.compteur);
  return <p>Compteur : {compteur}</p>;
}

// Ce composant ne déclenche que des actions : il ne lit aucune valeur d'état
function BoutonsCompteur() {
  // On sélectionne les fonctions ; elles sont stables et ne provoquent pas de re-rendu
  const incrementer = useCompteurStore((state) => state.incrementer);
  const reinitialiser = useCompteurStore((state) => state.reinitialiser);

  return (
    <div style={{ marginTop: "8px" }}>
      <button onClick={incrementer} style={{ marginRight: "8px" }}>
        Incrémenter
      </button>
      <button onClick={reinitialiser}>Réinitialiser</button>
    </div>
  );
}

function Compteur() {
  return (
    <div>
      <AffichageCompteur />
      <BoutonsCompteur />
    </div>
  );
}

export default Compteur;
```

Affiche le composant dans `App.tsx` (aucun provider nécessaire) :

```tsx
// src/App.tsx
import Compteur from "./components/Compteur";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Démo Zustand</h1>
      <Compteur />
    </div>
  );
}

export default App;
```

**Résultat attendu** : le compteur s'affiche à 0. Les boutons l'incrémentent et le réinitialisent. Contrairement à Context, il n'y a **aucun** `<Provider>` autour de `<App />` : le store fonctionne par simple import. Le composant `BoutonsCompteur` ne lit pas `compteur`, donc il ne se re-rend pas quand la valeur change.

---

### Étape 3 : Un store plus réaliste (un panier)

Crée `src/stores/panierStore.ts`. Ce store montre un état structuré avec une liste et des actions :

```typescript
// src/stores/panierStore.ts
import { create } from "zustand";

// Un article du panier
export interface Article {
  id: number;
  nom: string;
  prix: number;
}

interface PanierState {
  articles: Article[];
  ajouter: (article: Article) => void;
  retirer: (id: number) => void;
  vider: () => void;
}

export const usePanierStore = create<PanierState>((set) => ({
  articles: [],
  // Ajoute un article à la fin de la liste existante
  ajouter: (article) =>
    set((state) => ({ articles: [...state.articles, article] })),
  // Retire l'article dont l'id correspond
  retirer: (id) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id),
    })),
  // Vide entièrement le panier
  vider: () => set({ articles: [] }),
}));
```

Crée `src/components/Panier.tsx` :

```tsx
// src/components/Panier.tsx
import { usePanierStore, type Article } from "../stores/panierStore";

function Panier() {
  // Sélecteurs ciblés : chaque valeur est lue séparément
  const articles = usePanierStore((state) => state.articles);
  const ajouter = usePanierStore((state) => state.ajouter);
  const retirer = usePanierStore((state) => state.retirer);
  const vider = usePanierStore((state) => state.vider);

  // Catalogue fictif pour la démonstration
  const catalogue: Article[] = [
    { id: 1, nom: "Clavier", prix: 45 },
    { id: 2, nom: "Souris", prix: 25 },
  ];

  return (
    <div>
      <h2>Catalogue</h2>
      {catalogue.map((produit) => (
        <button
          key={produit.id}
          onClick={() => ajouter(produit)}
          style={{ marginRight: "8px" }}
        >
          Ajouter {produit.nom}
        </button>
      ))}

      <h2 style={{ marginTop: "16px" }}>Panier ({articles.length})</h2>
      <ul>
        {articles.map((article, index) => (
          // L'index complète l'id car le même produit peut être ajouté deux fois
          <li key={`${article.id}-${index}`}>
            {article.nom} - {article.prix} EUR
            <button
              onClick={() => retirer(article.id)}
              style={{ marginLeft: "8px" }}
            >
              Retirer
            </button>
          </li>
        ))}
      </ul>

      {articles.length > 0 && <button onClick={vider}>Vider le panier</button>}
    </div>
  );
}

export default Panier;
```

**Résultat attendu** : cliquer sur "Ajouter Clavier" ajoute l'article au panier, dont le compteur passe à 1. "Retirer" enlève la ligne correspondante, "Vider le panier" réinitialise la liste. Le store du panier est totalement indépendant du store du compteur : ils coexistent sans provider et sans interférence.

---

### Étape 4 : Lire l'état hors d'un composant

Un avantage de Zustand est de pouvoir lire l'état dans une fonction ordinaire, sans hook. Ajoute une fonction utilitaire qui calcule le total du panier :

```typescript
// src/stores/panierTotal.ts
import { usePanierStore } from "./panierStore";

// getState() lit l'état courant du store SANS être dans un composant React
// Utile dans une fonction utilitaire, un gestionnaire d'événement global, etc.
export function calculerTotal(): number {
  const articles = usePanierStore.getState().articles;
  return articles.reduce((total, article) => total + article.prix, 0);
}
```

**Résultat attendu** :

```text
calculerTotal() retourne la somme des prix des articles présents dans le
store au moment de l'appel, sans avoir besoin d'un composant ni d'un hook.
Avec Context, ce calcul aurait dû se faire à l'intérieur d'un composant.
```

> **Note** : pour **afficher** un total dans l'interface, utilise un sélecteur dans le composant (par exemple `usePanierStore((s) => s.articles)` puis le calcul), afin que l'affichage se mette à jour automatiquement. `getState()` lit une valeur figée à l'instant de l'appel, sans s'abonner aux changements ; réserve-le au code hors composant.

---

### Étape 5 : Aperçu de Jotai (les atomes)

Pour comparer l'approche, voici le même compteur avec Jotai. Installe la bibliothèque :

```bash
# Installe Jotai (aperçu, en complément de Zustand)
npm install jotai
```

Crée un atome et un composant qui l'utilise :

```tsx
// src/jotai/compteurAtome.ts
import { atom } from "jotai";

// Un atome est une unité d'état indépendante, déclarée hors composant
export const compteurAtome = atom(0);
```

```tsx
// src/components/CompteurJotai.tsx
import { useAtom } from "jotai";
import { compteurAtome } from "../jotai/compteurAtome";

function CompteurJotai() {
  // useAtom ressemble à useState, mais l'état vit dans l'atome partagé
  // Il retourne la valeur et une fonction pour la modifier
  const [compteur, setCompteur] = useAtom(compteurAtome);

  return (
    <div>
      <p>Compteur (Jotai) : {compteur}</p>
      <button onClick={() => setCompteur((c) => c + 1)}>Incrémenter</button>
    </div>
  );
}

export default CompteurJotai;
```

**Résultat attendu** : le composant affiche un compteur qui s'incrémente, exactement comme la version Zustand. La différence est conceptuelle : avec Jotai, l'état est une petite cellule indépendante (`compteurAtome`) lue façon `useState`, alors qu'avec Zustand, il fait partie d'un store centralisé lu par sélecteur. Choisis l'approche selon la forme de ton état.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm install zustand` | Installe Zustand |
| `npm install jotai` | Installe Jotai |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types TypeScript |

---

## Pièges Fréquents

### Piège 1 : Lire tout le store au lieu d'un sélecteur

⚠️ **Problème** : Écrire `const state = useStore()` sans sélecteur. Le composant se re-rend alors à **chaque** changement du store, même sur des valeurs qu'il n'utilise pas. Sur un gros store, cela annule l'avantage de Zustand sur Context.

En Zustand v5, appeler le hook sans sélecteur reste une API valide (le README officiel montre encore `useBearStore()`), mais retourne tout l'état et re-rend le composant à chaque mutation. Le guide de migration v5 exige surtout des sorties de sélecteur stables : un objet ou un tableau recréé à chaque appel peut boucler (égalité `Object.is`). Pour plusieurs champs, utilise un sélecteur par valeur, ou `useShallow` ([migration v5](https://zustand.docs.pmnd.rs/reference/migrations/migrating-to-v5)).

✅ **Solution** : Passe toujours un sélecteur qui retourne uniquement la valeur nécessaire.

```tsx
// ❌ Incorrect : re-rendu à chaque changement du store
// API encore valide, mais re-rendu à chaque changement du store
const { compteur } = useCompteurStore();

// ✅ Correct : re-rendu uniquement si "compteur" change
const compteur = useCompteurStore((state) => state.compteur);
```

---

### Piège 2 : Sélectionner un nouvel objet à chaque rendu

⚠️ **Problème** : Retourner un objet recréé dans le sélecteur (par exemple `(s) => ({ a: s.a, b: s.b })`). Comme l'objet est nouveau à chaque rendu, Zustand le considère comme changé et re-rend en boucle.

✅ **Solution** : Sélectionne les valeurs séparément, avec un sélecteur par valeur primitive.

```tsx
// ❌ Incorrect : nouvel objet à chaque rendu -> re-rendus permanents
const { a, b } = useStore((s) => ({ a: s.a, b: s.b }));

// ✅ Correct : un sélecteur par valeur
const a = useStore((s) => s.a);
const b = useStore((s) => s.b);
```

---

### Piège 3 : Stocker des données serveur dans Zustand

⚠️ **Problème** : Mettre une liste d'articles chargée depuis une API dans un store Zustand. Tu dois alors gérer à la main le cache, le rafraîchissement et les états de chargement, ce que TanStack Query (fiche 18) fait déjà.

✅ **Solution** : Laisse les données serveur à TanStack Query et réserve Zustand à l'état client (panier, thème, préférences). Les deux cohabitent sans conflit dans une même application.

---

### Piège 4 : Muter l'état au lieu de retourner une nouvelle valeur

⚠️ **Problème** : Modifier directement le tableau d'état dans une action (par exemple `state.articles.push(article)`). React ne détecte pas toujours la mutation et l'interface peut ne pas se mettre à jour.

✅ **Solution** : Retourne toujours une nouvelle structure dans `set`, sans muter l'ancienne.

```typescript
// ❌ Incorrect : mutation directe du tableau existant
ajouter: (article) => set((state) => { state.articles.push(article); return state; }),

// ✅ Correct : nouveau tableau à partir de l'ancien
ajouter: (article) => set((state) => ({ articles: [...state.articles, article] })),
```

---

## Checklist de Validation

- [ ] Je sais expliquer pourquoi Context + useReducer devient coûteux sur un gros état changeant
- [ ] Je sais installer Zustand et créer un store avec `create`
- [ ] Je comprends qu'un store Zustand ne nécessite aucun provider
- [ ] Je sais lire une valeur avec un sélecteur ciblé pour limiter les re-rendus
- [ ] Je sais déclencher des actions définies dans le store
- [ ] Je sais lire l'état hors d'un composant avec `getState()`
- [ ] Je comprends le modèle par atomes de Jotai et sa différence avec Zustand
- [ ] Je sais choisir entre Zustand, Context et TanStack Query selon le type d'état

---

## Exercice Pratique

**Énoncé** : Crée un store Zustand de préférences d'affichage partagé entre plusieurs composants, sans aucun provider.

**Indications** :

- Crée un store `usePreferencesStore` avec un état `theme` (valeur `"clair"` ou `"sombre"`) et un état `taillePolice` (un nombre, par défaut `16`).
- Ajoute trois actions : `basculerTheme` (passe de `"clair"` à `"sombre"` et inversement), `augmenterPolice` (ajoute 2) et `reinitialiser` (remet `theme` à `"clair"` et `taillePolice` à `16`).
- Crée un composant `PanneauReglages` avec trois boutons qui déclenchent les trois actions.
- Crée un composant `Apercu` séparé qui lit `theme` et `taillePolice` avec des sélecteurs, et applique un style en conséquence (fond sombre ou clair, taille de police).
- Vérifie que le composant `PanneauReglages`, qui ne lit aucune valeur d'état (seulement les actions), ne se re-rend pas quand le thème change.

**Résultat attendu** : modifier les préférences depuis `PanneauReglages` met à jour l'`Apercu` immédiatement, sans provider, et `PanneauReglages` ne se re-rend pas inutilement.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

### 1. Le store de préférences

Crée `src/stores/preferencesStore.ts` :

```typescript
// src/stores/preferencesStore.ts
import { create } from "zustand";

// Le thème ne peut prendre que deux valeurs : on le type strictement
type Theme = "clair" | "sombre";

interface PreferencesState {
  theme: Theme;
  taillePolice: number;
  basculerTheme: () => void;
  augmenterPolice: () => void;
  reinitialiser: () => void;
}

export const usePreferencesStore = create<PreferencesState>((set) => ({
  theme: "clair",
  taillePolice: 16,
  // Bascule entre les deux thèmes selon la valeur courante
  basculerTheme: () =>
    set((state) => ({ theme: state.theme === "clair" ? "sombre" : "clair" })),
  // Ajoute 2 à la taille actuelle
  augmenterPolice: () =>
    set((state) => ({ taillePolice: state.taillePolice + 2 })),
  // Remet les valeurs par défaut
  reinitialiser: () => set({ theme: "clair", taillePolice: 16 }),
}));
```

### 2. Le panneau de réglages (n'utilise que les actions)

Crée `src/components/PanneauReglages.tsx` :

```tsx
// src/components/PanneauReglages.tsx
import { usePreferencesStore } from "../stores/preferencesStore";

function PanneauReglages() {
  // Ce composant ne lit AUCUNE valeur d'état, seulement les actions
  // Les actions sont stables : il ne se re-rend pas quand theme ou police change
  const basculerTheme = usePreferencesStore((state) => state.basculerTheme);
  const augmenterPolice = usePreferencesStore((state) => state.augmenterPolice);
  const reinitialiser = usePreferencesStore((state) => state.reinitialiser);

  return (
    <div style={{ marginBottom: "16px" }}>
      <button onClick={basculerTheme} style={{ marginRight: "8px" }}>
        Basculer le thème
      </button>
      <button onClick={augmenterPolice} style={{ marginRight: "8px" }}>
        Agrandir la police
      </button>
      <button onClick={reinitialiser}>Réinitialiser</button>
    </div>
  );
}

export default PanneauReglages;
```

### 3. L'aperçu (lit les valeurs avec des sélecteurs)

Crée `src/components/Apercu.tsx` :

```tsx
// src/components/Apercu.tsx
import { usePreferencesStore } from "../stores/preferencesStore";

function Apercu() {
  // Sélecteurs ciblés : ce composant se re-rend quand theme ou taillePolice change
  const theme = usePreferencesStore((state) => state.theme);
  const taillePolice = usePreferencesStore((state) => state.taillePolice);

  // Style calculé à partir des préférences
  const style = {
    backgroundColor: theme === "sombre" ? "#1e1e1e" : "#ffffff",
    color: theme === "sombre" ? "#ffffff" : "#1e1e1e",
    fontSize: `${taillePolice}px`,
    padding: "16px",
    border: "1px solid #ccc",
  };

  return (
    <div style={style}>
      <p>Aperçu du texte</p>
      <p>
        Thème : {theme} - Taille : {taillePolice}px
      </p>
    </div>
  );
}

export default Apercu;
```

### 4. Assembler dans App.tsx

```tsx
// src/App.tsx
import PanneauReglages from "./components/PanneauReglages";
import Apercu from "./components/Apercu";

function App() {
  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h1>Préférences d'affichage</h1>
      {/* Aucun provider : les deux composants partagent le store par import */}
      <PanneauReglages />
      <Apercu />
    </div>
  );
}

export default App;
```

### 5. Vérification

Lance l'application :

```bash
# Lance le serveur de développement
npm run dev
```

Comportement attendu :

1. L'aperçu s'affiche en thème clair, police 16px.
2. "Basculer le thème" inverse le fond et la couleur du texte de l'aperçu immédiatement.
3. "Agrandir la police" augmente la taille du texte de l'aperçu de 2px à chaque clic.
4. "Réinitialiser" remet le thème clair et la police à 16px.
5. Aucun `<Provider>` n'enveloppe l'application : le partage d'état passe par le simple import du store. Le `PanneauReglages`, qui ne lit que des actions, ne se re-rend pas quand l'aperçu change.

---

## Navigation

← Fiche précédente : **[18 - TanStack Query](18-tanstack-query.md)**

→ Cursus suivant : **[Testing et Qualité](../09-testing/index.md)**
