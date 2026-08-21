---
tags:
  - React
  - Débutant
  - Concept
description: "Comprendre la syntaxe JSX et créer des composants fonctionnels React."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 19
cursus: "React"
id: "web.react.jsx-composants"
course_id: "web.react"
content_type: "lesson"
order: 3
---

# 03 - JSX et composants

> **En bref** : Maîtriser la syntaxe JSX, créer des composants fonctionnels et comprendre le rendu conditionnel. Lecture estimée : 75 min.

## Prérequis

- Fiche précédente : [02 - Créer un projet React](02-creer-projet-react.md)
- Connaître les bases de TypeScript (types, interfaces)
- Connaître le HTML

## Objectif de cette fiche

À la fin de cette fiche, tu sauras écrire du JSX, créer des composants fonctionnels React et afficher du contenu conditionnellement.

---

## Concepts

### Qu'est-ce que JSX ?

**Définition** : JSX (JavaScript XML) est une extension de syntaxe qui permet d'écrire du code ressemblant à du HTML directement dans du JavaScript ou TypeScript. Les fichiers contenant du JSX avec TypeScript ont l'extension `.tsx`.

**Le problème que JSX résout** :

Sans JSX, voici les problèmes rencontrés :

1. **Code illisible** : créer des éléments React sans JSX nécessite d'appeler `React.createElement()` pour chaque élément, ce qui devient rapidement illisible pour des interfaces complexes.
2. **Éloignement de la structure visuelle** : sans JSX, il est difficile de visualiser la structure de la page en lisant le code.
3. **Risque d'erreurs** : les appels imbriqués à `React.createElement()` sont difficiles à déboguer car on ne voit pas la hiérarchie.

**Comment JSX résout ces problèmes** :

| Problème | Solution apportée par JSX |
| --- | --- |
| Code illisible | JSX ressemble à du HTML, ce qui le rend lisible |
| Éloignement de la structure visuelle | La structure JSX reflète visuellement la page finale |
| Risque d'erreurs | La hiérarchie est visible, les erreurs sont plus faciles à repérer |

**Sans JSX vs avec JSX** :

```typescript
// Sans JSX : difficile à lire et à maintenir
import { createElement } from "react";

function App() {
  return createElement(
    "div",
    null,
    createElement("h1", null, "Titre"),
    createElement("p", null, "Un paragraphe")
  );
}
```

```tsx
// Avec JSX : clair et lisible
function App() {
  return (
    <div>
      <h1>Titre</h1>
      <p>Un paragraphe</p>
    </div>
  );
}
```

**Analogie concrète** : JSX est comme un plan d'architecte. Sans JSX, décrire une maison revient à dire "il y a un mur à 3 mètres du sol, puis un autre mur perpendiculaire...". Avec JSX, c'est comme dessiner le plan : la structure est immédiatement visible.

**Ce que JSX n'est PAS** :

- JSX n'est pas du HTML. JSX ressemble à du HTML mais c'est du JavaScript. Depuis React 17, le compilateur le transforme en appels `jsx()` / `jsxs()` du module `react/jsx-runtime` (tu n'as plus besoin d'`import React` pour du JSX). L'API `createElement` reste l'équivalent si tu écris les éléments à la main, sans JSX.
- JSX n'est pas un langage de template (comme Twig ou Handlebars). JSX est du JavaScript valide avec des extensions, pas un langage séparé.

---

### Qu'est-ce qu'un composant fonctionnel ?

**Définition** : Un composant fonctionnel est une fonction JavaScript/TypeScript qui retourne du JSX. C'est la manière standard de créer des composants en React depuis la version 16.8 (introduction des hooks).

**Le problème que les composants fonctionnels résolvent** :

Sans composants fonctionnels, voici les problèmes rencontrés :

1. **Verbosité** : les anciens composants de classe (class components) nécessitent beaucoup de code boilerplate (`constructor`, `this.state`, `this.setState`, `render()`).
2. **Complexité du `this`** : en JavaScript, le mot-clé `this` change de contexte selon comment la fonction est appelée, ce qui provoque des bugs fréquents.
3. **Logique dispersée** : dans les composants de classe, la logique liée à un même comportement est répartie dans différentes méthodes (`componentDidMount`, `componentDidUpdate`, `componentWillUnmount`).

**Comment les composants fonctionnels résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Verbosité | Une simple fonction qui retourne du JSX |
| Complexité du `this` | Pas de `this` dans les fonctions |
| Logique dispersée | Les hooks regroupent la logique par fonctionnalité |

**Analogie concrète** : Un composant fonctionnel est comme une fiche de recette. La recette prend des ingrédients en entrée (les props) et produit un plat en sortie (le JSX affiché). La recette est autonome et réutilisable.

**Ce qu'un composant fonctionnel n'est PAS** :

- Un composant fonctionnel n'est pas un composant de classe. Les composants de classe (avec `class App extends React.Component`) existent encore et restent supportés, mais la documentation React recommande les fonctions pour les nouveaux projets.
- Un composant fonctionnel n'est pas une fonction utilitaire classique. Un composant retourne du JSX et peut utiliser des hooks. Une fonction utilitaire retourne une valeur et ne peut pas utiliser de hooks.

---

### Qu'est-ce que le rendu conditionnel ?

**Définition** : Le rendu conditionnel est la technique qui consiste à afficher ou masquer des éléments dans le JSX en fonction d'une condition (une variable, un état, une prop).

**Le problème que le rendu conditionnel résout** :

Sans rendu conditionnel :

1. **Pages statiques** : l'interface affiche toujours le même contenu, sans s'adapter aux données ou aux actions de l'utilisateur.
2. **Logique hors du composant** : en vanilla JS, on manipule le DOM pour montrer/cacher des éléments (`display: none`), ce qui sépare la logique d'affichage du template.

**Comment le rendu conditionnel résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Pages statiques | Le JSX change dynamiquement selon les conditions |
| Logique hors du composant | La condition est directement dans le JSX |

**Les 3 techniques de rendu conditionnel** :

```tsx
// Technique 1 : opérateur ternaire (condition ? vrai : faux)
// Utilise quand tu veux afficher un élément OU un autre
function Statut({ connecte }: { connecte: boolean }) {
  return (
    <p>{connecte ? "Bienvenue !" : "Connecte-toi"}</p>
  );
}

// Technique 2 : opérateur && (condition && élément)
// Utilise quand tu veux afficher un élément OU rien
function Alerte({ message }: { message: string | null }) {
  return (
    <div>
      {message && <p className="alerte">{message}</p>}
    </div>
  );
}

// Technique 3 : if/else avec return anticipé
// Utilise quand la logique est complexe
function Page({ chargement }: { chargement: boolean }) {
  if (chargement) {
    return <p>Chargement en cours...</p>;
  }

  return <p>Contenu de la page</p>;
}
```

**Analogie concrète** : Le rendu conditionnel est comme un panneau d'affichage à l'entrée d'un magasin. Si le magasin est ouvert, le panneau affiche "Bienvenue". Si le magasin est fermé, il affiche "Fermé, revenez demain". Le panneau est le même, mais son contenu change selon la condition.

---

### Qu'est-ce qu'un Fragment ?

**Définition** : Un Fragment React (`<>...</>` ou `<React.Fragment>...</React.Fragment>`) est un conteneur invisible qui permet de regrouper plusieurs éléments JSX sans ajouter de nœud HTML supplémentaire dans le DOM.

**Le problème que les Fragments résolvent** :

Sans Fragment, un composant React doit retourner un seul élément racine :

1. **Divs inutiles** : on ajoute des `<div>` uniquement pour satisfaire la contrainte d'un seul élément racine, ce qui pollue le DOM avec des éléments sans signification.
2. **CSS cassé** : ces `<div>` supplémentaires peuvent casser les mises en page CSS (par exemple dans un Flexbox ou un Grid).

**Comment les Fragments résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Divs inutiles | Le Fragment ne crée aucun élément HTML dans le DOM |
| CSS cassé | Pas d'élément supplémentaire, pas d'impact sur le CSS |

```tsx
// ❌ Sans Fragment : div inutile dans le DOM
function InfoUtilisateur() {
  return (
    <div>
      <h2>Jean Dupont</h2>
      <p>Développeur</p>
    </div>
  );
}

// ✅ Avec Fragment : pas d'élément supplémentaire
function InfoUtilisateur() {
  return (
    <>
      <h2>Jean Dupont</h2>
      <p>Développeur</p>
    </>
  );
}
```

---

## Étapes Pratiques

### Étape 1 : Créer un composant simple

Crée un fichier `src/components/Header.tsx` :

```bash
# Crée le dossier components s'il n'existe pas
mkdir -p src/components
```

```tsx
// src/components/Header.tsx

// Composant Header qui affiche le titre de l'application
// Le nom du composant commence toujours par une majuscule
function Header() {
  return (
    <header>
      <h1>Mon application</h1>
      <p>Bienvenue sur mon site React</p>
    </header>
  );
}

// On exporte le composant pour pouvoir l'importer ailleurs
export default Header;
```

**Résultat attendu** : le fichier est créé sans erreur.

---

### Étape 2 : Utiliser le composant dans App

Modifie `src/App.tsx` pour utiliser le composant `Header` :

```tsx
// src/App.tsx

// Importe le composant Header depuis le fichier Header.tsx
import Header from "./components/Header";

// Le composant App utilise le composant Header
function App() {
  return (
    <div>
      {/* On utilise Header comme une balise HTML */}
      <Header />
      <main>
        <p>Contenu principal</p>
      </main>
    </div>
  );
}

export default App;
```

**Résultat attendu dans le navigateur** :

```text
Mon application
Bienvenue sur mon site React
Contenu principal
```

---

### Étape 3 : Utiliser des expressions JavaScript dans le JSX

Crée `src/components/Profil.tsx` :

```tsx
// src/components/Profil.tsx

// Composant qui affiche des informations calculées dynamiquement
function Profil() {
  // Les variables définies avant le return sont utilisables dans le JSX
  const nom = "John";
  const age = 25;
  const competences = ["React", "TypeScript", "Docker"];

  return (
    <div>
      {/* Les accolades {} permettent d'insérer du JavaScript dans le JSX */}
      <h2>Profil de {nom}</h2>

      {/* On peut mettre n'importe quelle expression JavaScript */}
      <p>Âge : {age} ans</p>

      {/* Les calculs sont possibles */}
      <p>Année de naissance : {new Date().getFullYear() - age}</p>

      {/* Les méthodes de tableau fonctionnent aussi */}
      <p>Compétences : {competences.join(", ")}</p>

      {/* Les expressions ternaires permettent le rendu conditionnel */}
      <p>Statut : {age >= 18 ? "Majeur" : "Mineur"}</p>
    </div>
  );
}

export default Profil;
```

Ajoute ce composant dans `App.tsx` :

```tsx
// src/App.tsx
import Header from "./components/Header";
import Profil from "./components/Profil";

function App() {
  return (
    <div>
      <Header />
      <main>
        <Profil />
      </main>
    </div>
  );
}

export default App;
```

**Résultat attendu dans le navigateur** :

```text
Mon application
Bienvenue sur mon site React

Profil de John
Âge : 25 ans
Année de naissance : 2001
Compétences : React, TypeScript, Docker
Statut : Majeur
```

---

### Étape 4 : Différences entre JSX et HTML

Crée `src/components/Formulaire.tsx` pour illustrer les différences :

```tsx
// src/components/Formulaire.tsx

// Ce composant montre les différences de syntaxe entre JSX et HTML
function Formulaire() {
  return (
    <form>
      {/* Différence 1 : "class" devient "className" */}
      {/* Car "class" est un mot réservé en JavaScript */}
      <div className="champ">

        {/* Différence 2 : "for" devient "htmlFor" */}
        {/* Car "for" est un mot réservé en JavaScript (boucle for) */}
        <label htmlFor="email">Email :</label>
        <input id="email" type="email" />
      </div>

      {/* Différence 3 : les balises auto-fermantes doivent avoir un "/" */}
      {/* En HTML, <br> est valide. En JSX, il faut <br /> */}
      <br />
      <hr />
      <img src="photo.jpg" alt="Photo" />

      {/* Différence 4 : les styles inline utilisent un objet JavaScript */}
      {/* Les propriétés CSS sont en camelCase */}
      <p style={{ color: "blue", fontSize: "14px", marginTop: "10px" }}>
        Texte avec style inline
      </p>

      {/* Différence 5 : les événements sont en camelCase */}
      {/* onclick devient onClick, onchange devient onChange */}
      <button type="submit" onClick={() => console.log("Clic !")}>
        Envoyer
      </button>
    </form>
  );
}

export default Formulaire;
```

**Tableau récapitulatif des différences** :

| HTML | JSX | Raison |
| --- | --- | --- |
| `class="nom"` | `className="nom"` | `class` est réservé en JS |
| `for="id"` | `htmlFor="id"` | `for` est réservé en JS |
| `<br>` | `<br />` | Toute balise doit être fermée |
| `<img src="...">` | `<img src="..." />` | Idem |
| `style="color: blue"` | `style={{ color: "blue" }}` | Objet JS, pas une chaîne |
| `onclick="fn()"` | `onClick={fn}` | Fonction JS, pas une chaîne |
| `tabindex="1"` | `tabIndex={1}` | camelCase + nombre |

---

### Étape 5 : Rendu conditionnel en pratique

Crée `src/components/MessageAccueil.tsx` :

```tsx
// src/components/MessageAccueil.tsx

// Composant qui affiche un message différent selon l'heure
function MessageAccueil() {
  // Récupère l'heure actuelle (0-23)
  const heure = new Date().getHours();

  // Technique 1 : if/else avec return anticipé
  // Si l'heure est avant 6h ou après 22h, message spécial
  if (heure < 6 || heure >= 22) {
    return <p>Il est tard, pense à te reposer.</p>;
  }

  // Détermine le message de salutation selon l'heure
  let salutation: string;
  if (heure < 12) {
    salutation = "Bonjour";
  } else if (heure < 18) {
    salutation = "Bon après-midi";
  } else {
    salutation = "Bonsoir";
  }

  return (
    <div>
      {/* Technique 2 : variable calculée avant le return */}
      <h2>{salutation} !</h2>

      {/* Technique 3 : opérateur ternaire dans le JSX */}
      <p>
        {heure < 12
          ? "La matinée commence bien."
          : "La journée avance."}
      </p>

      {/* Technique 4 : opérateur && pour affichage conditionnel */}
      {/* L'élément n'est affiché que si la condition est vraie */}
      {heure >= 12 && heure < 14 && (
        <p>C'est l'heure du déjeuner !</p>
      )}
    </div>
  );
}

export default MessageAccueil;
```

---

### Étape 6 : Composer des composants ensemble

Le schéma suivant illustre comment les composants React forment une arborescence, du composant racine `App` jusqu'aux composants les plus spécifiques :

<div class="diagram-design">
<p><a href="../../diagrams/08-react-03-jsx-composants-1.html">Étape 6 : Composer des composants ensemble (HTML + SVG)</a></p>
<iframe src="../../diagrams/08-react-03-jsx-composants-1.html" title="Étape 6 : Composer des composants ensemble" style="width:100%;min-height:516px;border:0;background:transparent"></iframe>
</div>

Crée `src/components/Footer.tsx` :

```tsx
// src/components/Footer.tsx

// Composant Footer réutilisable
function Footer() {
  const annee = new Date().getFullYear();

  return (
    <footer>
      <hr />
      <p>&copy; {annee} - Mon application React</p>
    </footer>
  );
}

export default Footer;
```

Mets à jour `src/App.tsx` pour assembler tous les composants :

```tsx
// src/App.tsx
import Header from "./components/Header";
import Profil from "./components/Profil";
import MessageAccueil from "./components/MessageAccueil";
import Footer from "./components/Footer";

// Le composant App assemble tous les composants de la page
// C'est la composition : des petits composants forment un grand composant
function App() {
  return (
    <>
      <Header />
      <main>
        <MessageAccueil />
        <Profil />
      </main>
      <Footer />
    </>
  );
}

export default App;
```

**Résultat attendu** : la page affiche le header, le message d'accueil (qui change selon l'heure), le profil et le footer.

---

### Étape 7 : Utiliser les Fragments

```tsx
// Exemple de Fragment avec la syntaxe courte <>...</>
function ListeInfos() {
  return (
    <>
      <h3>Informations</h3>
      <p>Première information</p>
      <p>Deuxième information</p>
    </>
  );
}

// Exemple de Fragment nommé (nécessaire quand on utilise une key)
import { Fragment } from "react";

function ListeItems() {
  const items = ["React", "TypeScript", "Vite"];

  return (
    <dl>
      {items.map((item, index) => (
        // Fragment nommé permet d'ajouter une key
        <Fragment key={index}>
          <dt>{item}</dt>
          <dd>Description de {item}</dd>
        </Fragment>
      ))}
    </dl>
  );
}
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `mkdir -p src/components` | Crée le dossier pour les composants |
| `npm run dev` | Lance le serveur de développement |
| `npx tsc --noEmit` | Vérifie les erreurs TypeScript |

---

## Pièges Fréquents

### Piège 1 : Oublier la majuscule du composant

**Problème** : Nommer un composant avec une minuscule (`function header()`) fait que React le traite comme une balise HTML standard, pas comme un composant.

**Solution** : Les noms de composants commencent toujours par une majuscule.

```tsx
// ❌ React pense que c'est une balise HTML <header>
function header() {
  return <h1>Titre</h1>;
}

// ✅ React reconnaît un composant personnalisé
function Header() {
  return <h1>Titre</h1>;
}
```

---

### Piège 2 : Retourner plusieurs éléments sans conteneur

**Problème** : Retourner deux éléments adjacents sans les envelopper dans un parent.

**Solution** : Utilise un `<div>`, un `<>` (Fragment) ou tout autre élément parent.

```tsx
// ❌ Erreur : deux éléments racines
function Erreur() {
  return (
    <h1>Titre</h1>
    <p>Paragraphe</p>
  );
}

// ✅ Correct : un seul élément racine (Fragment)
function Correct() {
  return (
    <>
      <h1>Titre</h1>
      <p>Paragraphe</p>
    </>
  );
}
```

---

### Piège 3 : Utiliser class au lieu de className

**Problème** : Écrire `class="nom"` dans le JSX, ce qui provoque un avertissement dans la console du navigateur.

**Solution** : Utilise `className` à la place.

```tsx
// ❌ Avertissement dans la console
<div class="conteneur">

// ✅ Correct
<div className="conteneur">
```

---

### Piège 4 : Oublier les accolades pour le JavaScript

**Problème** : Écrire du JavaScript sans accolades dans le JSX. Le texte est affiché tel quel au lieu d'être évalué.

**Solution** : Entoure les expressions JavaScript avec des accolades `{}`.

```tsx
const nom = "John";

// ❌ Affiche le texte "nom" au lieu de "John"
<p>Bonjour nom</p>

// ✅ Affiche "Bonjour John"
<p>Bonjour {nom}</p>
```

---

### Piège 5 : Confondre 0 et false avec l'opérateur &&

**Problème** : Utiliser `&&` avec un nombre qui peut valoir 0. React affiche le `0` au lieu de ne rien afficher.

**Solution** : Convertis la valeur en booléen explicitement.

```tsx
const compteur = 0;

// ❌ Affiche "0" dans la page
{compteur && <p>Il y a {compteur} éléments</p>}

// ✅ N'affiche rien quand compteur vaut 0
{compteur > 0 && <p>Il y a {compteur} éléments</p>}
```

---

## Checklist de Validation

- [ ] Je sais ce qu'est le JSX et pourquoi il existe
- [ ] Je connais les différences entre HTML et JSX (className, htmlFor, etc.)
- [ ] Je sais créer un composant fonctionnel
- [ ] Je sais utiliser des expressions JavaScript dans le JSX avec `{}`
- [ ] Je connais les 3 techniques de rendu conditionnel (ternaire, &&, if/return)
- [ ] Je sais ce qu'est un Fragment et quand l'utiliser
- [ ] Je sais composer des composants ensemble

---

## Exercice Pratique

**Énoncé** : Crée une page qui affiche une carte de visite avec les caractéristiques suivantes :

1. Un composant `CarteVisite` qui affiche un nom, un métier et un email
2. Un composant `Competences` qui affiche une liste de compétences
3. Un composant `Disponibilite` qui affiche "Disponible" en vert ou "Indisponible" en rouge selon une variable booléenne
4. Un composant `App` qui assemble les trois composants précédents

**Indications** :

- Crée chaque composant dans un fichier séparé dans `src/components/`
- Utilise le rendu conditionnel pour la disponibilité
- Utilise les styles inline pour la couleur (`style={{ color: "green" }}`)
- Les données peuvent être définies en dur dans les composants (pas besoin de props pour l'instant)

**Résultat attendu** :

```text
John Dupont
Développeur React

Compétences :
  - React
  - TypeScript
  - Docker
  - PostgreSQL

✅ Disponible
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

`src/components/CarteVisite.tsx` :

```tsx
// src/components/CarteVisite.tsx

// Composant qui affiche les informations de la carte de visite
function CarteVisite() {
  const nom = "John Dupont";
  const metier = "Développeur React";
  const email = "john@exemple.fr";

  return (
    <div>
      <h1>{nom}</h1>
      <p>{metier}</p>
      <p>Contact : {email}</p>
    </div>
  );
}

export default CarteVisite;
```

`src/components/Competences.tsx` :

```tsx
// src/components/Competences.tsx

// Composant qui affiche une liste de compétences
function Competences() {
  // Tableau de compétences défini en dur
  const competences = ["React", "TypeScript", "Docker", "PostgreSQL"];

  return (
    <div>
      <h2>Compétences :</h2>
      <ul>
        {/* map() crée un élément <li> pour chaque compétence */}
        {competences.map((comp) => (
          <li key={comp}>{comp}</li>
        ))}
      </ul>
    </div>
  );
}

export default Competences;
```

`src/components/Disponibilite.tsx` :

```tsx
// src/components/Disponibilite.tsx

// Composant qui affiche la disponibilité avec un code couleur
function Disponibilite() {
  // Variable qui détermine la disponibilité
  const estDisponible = true;

  return (
    <p
      style={{
        // La couleur change selon la disponibilité
        color: estDisponible ? "green" : "red",
        fontWeight: "bold",
      }}
    >
      {/* Le texte et l'icône changent selon la condition */}
      {estDisponible ? "Disponible" : "Indisponible"}
    </p>
  );
}

export default Disponibilite;
```

`src/App.tsx` :

```tsx
// src/App.tsx
import CarteVisite from "./components/CarteVisite";
import Competences from "./components/Competences";
import Disponibilite from "./components/Disponibilite";

// Composant principal qui assemble les trois composants
function App() {
  return (
    <>
      <CarteVisite />
      <Competences />
      <Disponibilite />
    </>
  );
}

export default App;
```

---

## Navigation

← Fiche précédente : **[02 - Créer un projet React](02-creer-projet-react.md)**

→ Fiche suivante : **[04 - Props et children](04-props-children.md)**
