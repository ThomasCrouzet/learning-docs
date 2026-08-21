---
tags:
  - React
  - Intermédiaire
  - Pratique
description: "Afficher des listes avec map(), comprendre l'importance des clés et filtrer des données."
estimated_time: "60 min"
fiche_number: 8
total_fiches: 19
cursus: "React"
id: "web.react.listes-cles"
course_id: "web.react"
content_type: "lesson"
order: 8
---

# 08 - Listes et clés

> **En bref** : Afficher des listes dynamiques avec map(), comprendre pourquoi les clés (keys) sont essentielles et créer des composants de liste réutilisables. Lecture estimée : 60 min.

## Prérequis

- Fiche précédente : [07 - useEffect et cycle de vie](07-useeffect-cycle-vie.md)
- Savoir utiliser `useState`
- Connaître la méthode `Array.map()` de JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras afficher des listes dynamiques, utiliser correctement les clés, filtrer et trier des données et créer des composants de liste réutilisables.

---

## Concepts

### Qu'est-ce que le rendu de listes en React ?

**Définition** : Le rendu de listes consiste à transformer un tableau de données en une liste d'éléments JSX, en utilisant la méthode `Array.map()` pour créer un élément JSX pour chaque donnée du tableau.

**Le problème que le rendu de listes résout** :

Sans rendu dynamique :

1. **Code répétitif** : pour afficher 10 éléments, il faut écrire 10 fois le même JSX avec des données différentes.
2. **Pas d'adaptation aux données** : si les données changent (ajout, suppression), il faut modifier manuellement le JSX.
3. **Impossible d'afficher des données d'API** : les données provenant d'un serveur sont dans un tableau, il faut un moyen de les transformer en JSX.

**Comment le rendu de listes résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Code répétitif | `map()` génère automatiquement un élément par donnée |
| Pas d'adaptation | Le JSX se met à jour automatiquement quand le tableau change |
| Données d'API | `map()` fonctionne avec n'importe quel tableau |

**Analogie concrète** : Le rendu de listes est comme une imprimante d'étiquettes. Tu lui donnes un rouleau de données (le tableau) et un modèle d'étiquette (le composant). L'imprimante produit autant d'étiquettes qu'il y a de données, chacune personnalisée avec ses propres informations.

---

### Qu'est-ce qu'une clé (key) ?

**Définition** : Une clé (`key`) est un attribut spécial que React utilise pour identifier de manière unique chaque élément d'une liste. Elle permet à React de savoir quel élément a été ajouté, modifié ou supprimé.

**Le problème que les clés résolvent** :

Sans clés (ou avec de mauvaises clés) :

1. **Performances dégradées** : sans clés, React ne peut pas savoir quel élément a changé. Il est obligé de recréer tous les éléments de la liste à chaque modification.
2. **Bugs d'état** : si les éléments de la liste ont un état interne (par exemple un champ de texte), React peut associer le mauvais état au mauvais élément après un ajout ou une suppression.
3. **Avertissement dans la console** : React affiche un avertissement "Each child in a list should have a unique key prop".

**Comment les clés résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Performances dégradées | React identifie les changements et ne met à jour que les éléments modifiés |
| Bugs d'état | Chaque élément est associé de manière fiable à son état |
| Avertissement console | L'avertissement disparaît |

**Règles pour les clés** :

| Règle | Explication |
| --- | --- |
| Unique parmi les frères | Chaque clé doit être unique dans la même liste (pas globalement) |
| Stable dans le temps | La clé d'un élément ne doit pas changer entre les rendus |
| Jamais l'index du tableau | L'index change quand on ajoute/supprime un élément (sauf si la liste ne change jamais) |
| Identifiant métier | Utilise l'id de la donnée (id de base de données, slug, etc.) |

**Analogie concrète** : Les clés sont comme les numéros de dossard dans une course. Chaque coureur (élément) a un numéro unique (clé). Si un coureur abandonne, les organisateurs savent exactement lequel grâce au dossard. Sans dossard, ils devraient compter les positions (index), ce qui devient faux dès qu'un coureur quitte la course.

Le schéma suivant illustre la différence de comportement de React lors de la réconciliation, selon que les éléments ont des clés uniques ou utilisent l'index du tableau :

<div class="diagram-design">
<p><a href="../../diagrams/08-react-08-listes-cles-1.html">Qu&#x27;est-ce qu&#x27;une clé (key) ? (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-08-listes-cles-1.html" title="Qu&#x27;est-ce qu&#x27;une clé (key) ?" style="width:100%;min-height:640px;border:0;background:transparent"></iframe>
</div>

**Ce que les clés ne sont PAS** :

- Les clés ne sont pas des props. Tu ne peux pas accéder à `key` dans le composant enfant. Si tu as besoin de la valeur de la clé, passe-la aussi comme une prop séparée.
- Les clés ne sont pas affichées dans le DOM. Elles sont utilisées uniquement par React en interne.

---

### Qu'est-ce que le filtrage et le tri de listes ?

**Définition** : Le filtrage consiste à afficher un sous-ensemble d'une liste selon un critère. Le tri consiste à réordonner les éléments selon un critère. En React, on utilise `Array.filter()` et `Array.sort()` avant le `map()`.

**Le problème que le filtrage et le tri résolvent** :

Sans filtrage/tri :

1. **Surcharge d'informations** : l'utilisateur voit toutes les données, même celles qui ne l'intéressent pas.
2. **Pas de recherche** : impossible de trouver un élément spécifique dans une longue liste.

**Comment le filtrage et le tri résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Surcharge d'informations | `filter()` n'affiche que les éléments pertinents |
| Pas de recherche | On filtre sur un critère de recherche saisi par l'utilisateur |

```tsx
// Le chaînage : filter() puis sort() puis map()
const elementsFiltres = donnees
  .filter((item) => item.actif)          // Garde les actifs
  .sort((a, b) => a.nom.localeCompare(b.nom))  // Trie par nom
  .map((item) => <li key={item.id}>{item.nom}</li>);  // Transforme en JSX
```

---

## Étapes Pratiques

### Étape 1 : Afficher une liste simple

Crée `src/components/ListeSimple.tsx` :

```tsx
// src/components/ListeSimple.tsx

function ListeSimple() {
  // Tableau de données
  const langages = ["TypeScript", "JavaScript", "Python", "Rust", "PHP"];

  return (
    <div>
      <h2>Langages de programmation</h2>
      <ul>
        {/* map() transforme chaque chaîne en un élément <li> */}
        {/* La key doit être unique : ici, le nom du langage est unique */}
        {langages.map((langage) => (
          <li key={langage}>{langage}</li>
        ))}
      </ul>
    </div>
  );
}

export default ListeSimple;
```

**Résultat attendu** :

```text
Langages de programmation
  - TypeScript
  - JavaScript
  - Python
  - Rust
  - PHP
```

---

### Étape 2 : Afficher une liste d'objets

Crée `src/components/ListeUtilisateurs.tsx` :

```tsx
// src/components/ListeUtilisateurs.tsx

// Interface pour un utilisateur
interface Utilisateur {
  id: number;
  nom: string;
  email: string;
  actif: boolean;
}

function ListeUtilisateurs() {
  // Données fictives (en production, elles viendraient d'une API)
  const utilisateurs: Utilisateur[] = [
    { id: 1, nom: "Alice Martin", email: "alice@exemple.fr", actif: true },
    { id: 2, nom: "Bob Dupont", email: "bob@exemple.fr", actif: false },
    { id: 3, nom: "Claire Bernard", email: "claire@exemple.fr", actif: true },
    { id: 4, nom: "David Leroy", email: "david@exemple.fr", actif: true },
    { id: 5, nom: "Emma Moreau", email: "emma@exemple.fr", actif: false },
  ];

  return (
    <div>
      <h2>Utilisateurs ({utilisateurs.length})</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Nom</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Email</th>
            <th style={{ border: "1px solid #ccc", padding: "8px" }}>Statut</th>
          </tr>
        </thead>
        <tbody>
          {/* La clé est l'id unique de chaque utilisateur */}
          {utilisateurs.map((user) => (
            <tr key={user.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.nom}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.email}
              </td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>
                {user.actif ? "Actif" : "Inactif"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListeUtilisateurs;
```

**Résultat attendu** : un tableau HTML avec les 5 utilisateurs.

---

### Étape 3 : Filtrer une liste

Crée `src/components/ListeFiltrable.tsx` :

```tsx
// src/components/ListeFiltrable.tsx
import { useState } from "react";

interface Produit {
  id: number;
  nom: string;
  categorie: string;
  prix: number;
  enStock: boolean;
}

function ListeFiltrable() {
  // Données des produits
  const produits: Produit[] = [
    { id: 1, nom: "Clavier mécanique", categorie: "Périphérique", prix: 89, enStock: true },
    { id: 2, nom: "Souris sans fil", categorie: "Périphérique", prix: 45, enStock: true },
    { id: 3, nom: "Écran 27 pouces", categorie: "Écran", prix: 350, enStock: false },
    { id: 4, nom: "Casque audio", categorie: "Audio", prix: 120, enStock: true },
    { id: 5, nom: "Webcam HD", categorie: "Périphérique", prix: 65, enStock: false },
    { id: 6, nom: "Enceintes USB", categorie: "Audio", prix: 40, enStock: true },
  ];

  // État pour la recherche textuelle
  const [recherche, setRecherche] = useState("");

  // État pour le filtre de catégorie
  const [categorie, setCategorie] = useState("Toutes");

  // État pour le filtre de stock
  const [stockUniquement, setStockUniquement] = useState(false);

  // Extrait les catégories uniques pour le menu déroulant
  const categories = ["Toutes", ...new Set(produits.map((p) => p.categorie))];

  // Applique les filtres (chaînage de filter)
  const produitsFiltres = produits
    .filter((p) => {
      // Filtre par recherche textuelle (insensible à la casse)
      return p.nom.toLowerCase().includes(recherche.toLowerCase());
    })
    .filter((p) => {
      // Filtre par catégorie
      return categorie === "Toutes" || p.categorie === categorie;
    })
    .filter((p) => {
      // Filtre par stock
      return !stockUniquement || p.enStock;
    });

  return (
    <div>
      <h2>Catalogue de produits</h2>

      {/* Barre de filtres */}
      <div style={{ marginBottom: "16px" }}>
        <input
          type="text"
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          placeholder="Rechercher un produit..."
          style={{ padding: "8px", marginRight: "8px" }}
        />

        <select
          value={categorie}
          onChange={(e) => setCategorie(e.target.value)}
          style={{ padding: "8px", marginRight: "8px" }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={stockUniquement}
            onChange={(e) => setStockUniquement(e.target.checked)}
          />
          {" "}En stock uniquement
        </label>
      </div>

      {/* Résultats */}
      <p>{produitsFiltres.length} produit(s) trouvé(s)</p>

      {produitsFiltres.length === 0 ? (
        <p>Aucun produit ne correspond aux filtres.</p>
      ) : (
        <ul>
          {produitsFiltres.map((produit) => (
            <li key={produit.id} style={{ marginBottom: "8px" }}>
              <strong>{produit.nom}</strong> - {produit.prix} EUR
              {" "}({produit.categorie})
              {!produit.enStock && (
                <span style={{ color: "red" }}> - Rupture de stock</span>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ListeFiltrable;
```

**Résultat attendu** : une liste de produits avec recherche, filtre par catégorie et filtre par stock.

---

### Étape 4 : Trier une liste

Crée `src/components/ListeTriable.tsx` :

```tsx
// src/components/ListeTriable.tsx
import { useState } from "react";

interface Etudiant {
  id: number;
  nom: string;
  note: number;
  classe: string;
}

// Les critères de tri possibles
type CriteriTri = "nom" | "note" | "classe";
type OrdreTri = "asc" | "desc";

function ListeTriable() {
  const etudiants: Etudiant[] = [
    { id: 1, nom: "Alice", note: 16, classe: "A" },
    { id: 2, nom: "Bob", note: 12, classe: "B" },
    { id: 3, nom: "Claire", note: 18, classe: "A" },
    { id: 4, nom: "David", note: 14, classe: "B" },
    { id: 5, nom: "Emma", note: 15, classe: "A" },
  ];

  const [critere, setCritere] = useState<CriteriTri>("nom");
  const [ordre, setOrdre] = useState<OrdreTri>("asc");

  // Fonction de tri qui crée un NOUVEAU tableau trié
  // (sort() modifie le tableau original, donc on fait une copie avec [...])
  const etudiantsTries = [...etudiants].sort((a, b) => {
    let comparaison = 0;

    if (critere === "nom" || critere === "classe") {
      // Tri alphabétique pour les chaînes
      comparaison = a[critere].localeCompare(b[critere]);
    } else {
      // Tri numérique pour les notes
      comparaison = a[critere] - b[critere];
    }

    // Inverse l'ordre si descendant
    return ordre === "asc" ? comparaison : -comparaison;
  });

  // Bascule l'ordre de tri quand on clique sur le même critère
  const changerTri = (nouveauCritere: CriteriTri) => {
    if (critere === nouveauCritere) {
      setOrdre(ordre === "asc" ? "desc" : "asc");
    } else {
      setCritere(nouveauCritere);
      setOrdre("asc");
    }
  };

  return (
    <div>
      <h2>Étudiants</h2>
      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th
              onClick={() => changerTri("nom")}
              style={{ border: "1px solid #ccc", padding: "8px", cursor: "pointer" }}
            >
              Nom {critere === "nom" && (ordre === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              onClick={() => changerTri("note")}
              style={{ border: "1px solid #ccc", padding: "8px", cursor: "pointer" }}
            >
              Note {critere === "note" && (ordre === "asc" ? " ▲" : " ▼")}
            </th>
            <th
              onClick={() => changerTri("classe")}
              style={{ border: "1px solid #ccc", padding: "8px", cursor: "pointer" }}
            >
              Classe {critere === "classe" && (ordre === "asc" ? " ▲" : " ▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {etudiantsTries.map((etudiant) => (
            <tr key={etudiant.id}>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{etudiant.nom}</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{etudiant.note}/20</td>
              <td style={{ border: "1px solid #ccc", padding: "8px" }}>{etudiant.classe}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ListeTriable;
```

**Résultat attendu** : un tableau triable en cliquant sur les en-têtes.

---

### Étape 5 : Composant de liste réutilisable

Crée `src/components/Liste.tsx` :

```tsx
// src/components/Liste.tsx
import { ReactNode } from "react";

// Interface générique : T est le type des éléments de la liste
interface ListeProps<T> {
  items: T[];                              // Le tableau de données
  renderItem: (item: T) => ReactNode;      // Comment afficher chaque élément
  keyExtractor: (item: T) => string | number;  // Comment obtenir la clé
  messageVide?: string;                    // Message si la liste est vide
}

// Composant générique avec le type T
function Liste<T>({
  items,
  renderItem,
  keyExtractor,
  messageVide = "Aucun élément",
}: ListeProps<T>) {
  if (items.length === 0) {
    return <p>{messageVide}</p>;
  }

  return (
    <ul style={{ listStyle: "none", padding: 0 }}>
      {items.map((item) => (
        <li key={keyExtractor(item)} style={{ marginBottom: "8px" }}>
          {renderItem(item)}
        </li>
      ))}
    </ul>
  );
}

export default Liste;
```

Utilise ce composant :

```tsx
// src/App.tsx
import Liste from "./components/Liste";

interface Tache {
  id: number;
  titre: string;
  priorite: "haute" | "moyenne" | "basse";
}

function App() {
  const taches: Tache[] = [
    { id: 1, titre: "Apprendre React", priorite: "haute" },
    { id: 2, titre: "Faire les courses", priorite: "basse" },
    { id: 3, titre: "Lire la documentation", priorite: "moyenne" },
  ];

  return (
    <div>
      <h1>Mes tâches</h1>
      <Liste
        items={taches}
        keyExtractor={(tache) => tache.id}
        renderItem={(tache) => (
          <span>
            <strong>{tache.titre}</strong> ({tache.priorite})
          </span>
        )}
        messageVide="Aucune tâche en cours"
      />
    </div>
  );
}

export default App;
```

**Résultat attendu** : une liste de tâches affichée via le composant réutilisable.

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les types TypeScript |

---

## Pièges Fréquents

### Piège 1 : Utiliser l'index comme clé

**Problème** : Utiliser l'index du tableau comme clé. Si un élément est ajouté ou supprimé au milieu de la liste, les index changent et React associe le mauvais état aux mauvais éléments.

**Solution** : Utilise un identifiant unique et stable (id de base de données, uuid, etc.).

```tsx
// ❌ L'index change si un élément est supprimé
{items.map((item, index) => (
  <li key={index}>{item.nom}</li>
))}

// ✅ L'id est stable et unique
{items.map((item) => (
  <li key={item.id}>{item.nom}</li>
))}
```

---

### Piège 2 : Clés dupliquées

**Problème** : Deux éléments de la même liste ont la même clé. React affiche un avertissement et le comportement est imprévisible.

**Solution** : Vérifie que les données n'ont pas de doublons d'identifiants.

```tsx
// ❌ Si deux produits ont le même nom, erreur
{produits.map((p) => (
  <li key={p.nom}>{p.nom}</li>  // "Écran" apparaît 2 fois
))}

// ✅ Utilise un identifiant garanti unique
{produits.map((p) => (
  <li key={p.id}>{p.nom}</li>
))}
```

---

### Piège 3 : Muter le tableau au lieu de créer un nouveau

**Problème** : Utiliser `sort()` directement sur le tableau d'état. `sort()` modifie le tableau original (mutation), ce qui ne déclenche pas de re-render.

**Solution** : Crée toujours une copie avant de trier.

```tsx
// ❌ sort() modifie le tableau original
const trie = items.sort((a, b) => a.nom.localeCompare(b.nom));
setItems(trie); // Même référence, pas de re-render

// ✅ Copie puis tri
const trie = [...items].sort((a, b) => a.nom.localeCompare(b.nom));
setItems(trie); // Nouvelle référence, re-render
```

---

### Piège 4 : Oublier la key sur l'élément racine du map

**Problème** : Mettre la `key` sur un élément enfant au lieu de l'élément racine retourné par `map()`.

**Solution** : La `key` doit toujours être sur le premier élément retourné par le callback de `map()`.

```tsx
// ❌ key sur un enfant, pas sur le <div> racine
{items.map((item) => (
  <div>
    <span key={item.id}>{item.nom}</span>
  </div>
))}

// ✅ key sur l'élément racine retourné par map()
{items.map((item) => (
  <div key={item.id}>
    <span>{item.nom}</span>
  </div>
))}
```

---

## Checklist de Validation

- [ ] Je sais afficher une liste avec `map()`
- [ ] Je comprends le rôle des clés (`key`) et pourquoi elles sont nécessaires
- [ ] Je sais pourquoi il ne faut pas utiliser l'index comme clé
- [ ] Je sais filtrer une liste avec `filter()`
- [ ] Je sais trier une liste avec `sort()` (en copiant d'abord le tableau)
- [ ] Je sais chaîner `filter()`, `sort()` et `map()`
- [ ] Je sais créer un composant de liste réutilisable

---

## Exercice Pratique

**Énoncé** : Crée un répertoire de contacts avec les fonctionnalités suivantes :

1. Un tableau de contacts avec : id, nom, email, telephone, ville
2. Un champ de recherche qui filtre en temps réel sur le nom ou l'email
3. Un tri par nom ou par ville (clic sur les en-têtes du tableau)
4. Affiche le nombre de résultats trouvés

**Indications** :

- Crée au moins 8 contacts fictifs
- Utilise `filter()` pour la recherche, `sort()` pour le tri
- N'oublie pas de copier le tableau avant de trier (`[...contacts]`)
- Utilise l'`id` comme clé

**Résultat attendu** : un tableau de contacts avec recherche et tri fonctionnels.

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```tsx
// src/components/Repertoire.tsx
import { useState } from "react";

interface Contact {
  id: number;
  nom: string;
  email: string;
  telephone: string;
  ville: string;
}

type ColonneTri = "nom" | "ville";

function Repertoire() {
  const contacts: Contact[] = [
    { id: 1, nom: "Alice Martin", email: "alice@mail.fr", telephone: "06 12 34 56 78", ville: "Paris" },
    { id: 2, nom: "Bob Dupont", email: "bob@mail.fr", telephone: "06 23 45 67 89", ville: "Lyon" },
    { id: 3, nom: "Claire Bernard", email: "claire@mail.fr", telephone: "06 34 56 78 90", ville: "Paris" },
    { id: 4, nom: "David Leroy", email: "david@mail.fr", telephone: "06 45 67 89 01", ville: "Marseille" },
    { id: 5, nom: "Emma Moreau", email: "emma@mail.fr", telephone: "06 56 78 90 12", ville: "Lyon" },
    { id: 6, nom: "Fabien Petit", email: "fabien@mail.fr", telephone: "06 67 89 01 23", ville: "Toulouse" },
    { id: 7, nom: "Gabrielle Roux", email: "gabrielle@mail.fr", telephone: "06 78 90 12 34", ville: "Paris" },
    { id: 8, nom: "Hugo Simon", email: "hugo@mail.fr", telephone: "06 89 01 23 45", ville: "Marseille" },
  ];

  const [recherche, setRecherche] = useState("");
  const [colonneTri, setColonneTri] = useState<ColonneTri>("nom");
  const [ordreAsc, setOrdreAsc] = useState(true);

  const changerTri = (colonne: ColonneTri) => {
    if (colonneTri === colonne) {
      setOrdreAsc(!ordreAsc);
    } else {
      setColonneTri(colonne);
      setOrdreAsc(true);
    }
  };

  const contactsFiltres = [...contacts]
    .filter((c) => {
      const terme = recherche.toLowerCase();
      return c.nom.toLowerCase().includes(terme) || c.email.toLowerCase().includes(terme);
    })
    .sort((a, b) => {
      const comparaison = a[colonneTri].localeCompare(b[colonneTri]);
      return ordreAsc ? comparaison : -comparaison;
    });

  const styleTh = { border: "1px solid #ccc", padding: "8px", cursor: "pointer" };
  const styleTd = { border: "1px solid #ccc", padding: "8px" };

  return (
    <div>
      <h2>Répertoire de contacts</h2>

      <input
        type="text"
        value={recherche}
        onChange={(e) => setRecherche(e.target.value)}
        placeholder="Rechercher par nom ou email..."
        style={{ padding: "8px", width: "300px", marginBottom: "16px" }}
      />

      <p>{contactsFiltres.length} contact(s) trouvé(s)</p>

      <table style={{ borderCollapse: "collapse", width: "100%" }}>
        <thead>
          <tr>
            <th style={styleTh} onClick={() => changerTri("nom")}>
              Nom {colonneTri === "nom" && (ordreAsc ? "▲" : "▼")}
            </th>
            <th style={{ ...styleTh, cursor: "default" }}>Email</th>
            <th style={{ ...styleTh, cursor: "default" }}>Téléphone</th>
            <th style={styleTh} onClick={() => changerTri("ville")}>
              Ville {colonneTri === "ville" && (ordreAsc ? "▲" : "▼")}
            </th>
          </tr>
        </thead>
        <tbody>
          {contactsFiltres.map((contact) => (
            <tr key={contact.id}>
              <td style={styleTd}>{contact.nom}</td>
              <td style={styleTd}>{contact.email}</td>
              <td style={styleTd}>{contact.telephone}</td>
              <td style={styleTd}>{contact.ville}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Repertoire;
```

---

## Navigation

← Fiche précédente : **[07 - useEffect et cycle de vie](07-useeffect-cycle-vie.md)**

→ Fiche suivante : **[09 - React Router](09-react-router.md)**
