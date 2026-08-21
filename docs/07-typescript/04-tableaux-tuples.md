---
tags:
  - TypeScript
  - Débutant
  - Concept
description: "Typer les tableaux, tuples, tableaux readonly et tableaux multidimensionnels en TypeScript."
estimated_time: "45 min"
fiche_number: 4
total_fiches: 15
cursus: "TypeScript"
id: "web.typescript.tableaux-tuples"
course_id: "web.typescript"
content_type: "lesson"
order: 4
---

# 04 - Tableaux et tuples

> **En bref** : Apprendre à typer les tableaux et les tuples en TypeScript, et comprendre les tableaux en lecture seule. Lecture estimée : 45 min.

## Prérequis

- [03 - Types primitifs et annotations](03-types-primitifs-annotations.md)
- Connaître les tableaux JavaScript (`push`, `map`, `filter`, `forEach`)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras typer des tableaux avec `Type[]` et `Array<Type>`, utiliser les tuples pour des tableaux de taille fixe, et protéger des tableaux avec `readonly`.

---

## Concepts

### Qu'est-ce qu'un tableau typé ?

**Définition** : Un tableau typé est un tableau dont le type des éléments est déclaré. TypeScript s'assure que seuls des éléments du bon type peuvent être ajoutés au tableau.

**Le problème que les tableaux typés résolvent** :

Sans typage des tableaux, voici les problèmes rencontrés :

1. **Mélange de types** : En JavaScript, un tableau peut contenir n'importe quoi (`[1, "deux", true, null]`). Quand on parcourt le tableau, on ne sait pas quel type d'élément on va trouver.
2. **Erreurs sur les éléments** : Appeler `.toUpperCase()` sur un élément qui est un nombre provoque une erreur à l'exécution.
3. **Autocomplétion absente** : L'éditeur ne peut pas suggérer les méthodes disponibles s'il ne connaît pas le type des éléments.

**Comment les tableaux typés résolvent ces problèmes** :

| Problème | Solution apportée par les tableaux typés |
| -------- | ---------------------------------------- |
| Mélange de types | Le compilateur refuse d'ajouter un élément du mauvais type |
| Erreurs sur les éléments | Chaque élément est garanti du bon type |
| Autocomplétion absente | L'éditeur connaît le type et propose les bonnes méthodes |

**Analogie concrète** : Un tableau typé est comme un tiroir avec des compartiments étiquetés. Un tiroir "couverts" ne contient que des couverts. Si tu essaies d'y ranger un livre, ça ne rentre pas. Un tableau `number[]` ne contient que des nombres. Si tu essaies d'y ajouter une chaîne, TypeScript refuse.

**Ce qu'un tableau typé n'est PAS** :

- Un tableau typé n'a pas de taille fixe (sauf les tuples). Tu peux ajouter ou retirer des éléments librement, tant qu'ils sont du bon type.
- Un tableau typé n'est pas différent d'un tableau JavaScript à l'exécution. Les types disparaissent après compilation.

---

### Qu'est-ce qu'un tuple ?

**Définition** : Un tuple est un tableau de taille fixe où le type de chaque élément est défini individuellement par sa position. Contrairement à un tableau classique, un tuple sait exactement combien d'éléments il contient et quel est le type de chacun.

**Le problème que les tuples résolvent** :

Sans tuples, voici les problèmes rencontrés :

1. **Structure implicite** : Quand une fonction retourne `[string, number]`, sans tuple, TypeScript traite le résultat comme `(string | number)[]`. On perd l'information que le premier élément est un string et le deuxième un number.
2. **Taille non vérifiée** : Un tableau classique peut avoir 0, 1 ou 100 éléments. On ne peut pas exiger une taille précise.

**Comment les tuples résolvent ces problèmes** :

| Problème | Solution apportée par les tuples |
| -------- | -------------------------------- |
| Structure implicite | Chaque position a son propre type défini |
| Taille non vérifiée | Le tuple a une taille fixe vérifiée par TypeScript |

**Analogie concrète** : Un tuple est comme un formulaire avec des cases numérotées. La case 1 attend un nom (string), la case 2 attend un âge (number), la case 3 attend une adresse email (string). Chaque case a un type précis, et tu ne peux pas ajouter une case 4 ni laisser une case vide.

**Comparaison tableau vs tuple** :

| Tableau (`string[]`) | Tuple (`[string, number]`) |
| -------------------- | -------------------------- |
| Taille variable | Taille fixe |
| Tous les éléments du même type | Chaque position peut avoir un type différent |
| `["a", "b", "c"]` | `["Alice", 25]` |
| Accès par index : toujours `string` | Accès par index : type selon la position |

---

### Qu'est-ce qu'un tableau readonly ?

**Définition** : Un tableau `readonly` est un tableau qui ne peut pas être modifié après sa création. On ne peut ni ajouter, ni retirer, ni modifier ses éléments. La syntaxe est `readonly Type[]` ou `ReadonlyArray<Type>`.

**Le problème que les tableaux readonly résolvent** :

Sans tableaux readonly, voici les problèmes rencontrés :

1. **Modifications accidentelles** : Une fonction peut modifier un tableau passé en paramètre, changeant les données originales sans que l'appelant le sache.
2. **Données de configuration** : Des tableaux contenant des constantes (jours de la semaine, codes pays) ne devraient jamais être modifiés.

**Comment les tableaux readonly résolvent ces problèmes** :

| Problème | Solution apportée par readonly |
| -------- | ------------------------------ |
| Modifications accidentelles | Le compilateur interdit toute modification |
| Données de configuration | Le tableau est garanti immuable |

**Analogie concrète** : Un tableau readonly est comme un document plastifié. Tu peux le lire, mais tu ne peux ni écrire dessus ni arracher une page. Si tu veux le modifier, tu dois en faire une copie non plastifiée.

---

## Étapes Pratiques

### Étape 1 : Déclarer des tableaux typés

Crée un fichier `src/tableaux.ts` :

```typescript
// src/tableaux.ts
// Deux syntaxes pour typer un tableau

// Syntaxe 1 : Type[] (la plus courante)
const nombres: number[] = [1, 2, 3, 4, 5];
const prenoms: string[] = ["Alice", "Bob", "Charlie"];
const actifs: boolean[] = [true, false, true];

// Syntaxe 2 : Array<Type> (syntaxe générique)
const prix: Array<number> = [9.99, 19.99, 29.99];
const villes: Array<string> = ["Lyon", "Paris", "Marseille"];

// Les deux syntaxes sont strictement équivalentes
// La convention est d'utiliser Type[] pour les cas simples
// et Array<Type> pour les cas complexes (types union, etc.)

// TypeScript vérifie les types à l'ajout
nombres.push(6); // OK : 6 est un number
// nombres.push("sept"); // Erreur : string n'est pas assignable à number

// Tableau vide typé
const resultats: number[] = [];
resultats.push(100);
resultats.push(85);
resultats.push(92);

// Inférence de type pour les tableaux
const couleurs = ["rouge", "vert", "bleu"]; // TypeScript infère string[]
const scores = [10, 20, 30]; // TypeScript infère number[]

console.log("Nombres :", nombres);
console.log("Prénoms :", prenoms);
console.log("Résultats :", resultats);
console.log("Couleurs (inféré) :", couleurs);
```

Compile et exécute :

```bash
npx tsc && node dist/tableaux.js
```

**Résultat attendu** :

```text
Nombres : [ 1, 2, 3, 4, 5, 6 ]
Prénoms : [ 'Alice', 'Bob', 'Charlie' ]
Résultats : [ 100, 85, 92 ]
Couleurs (inféré) : [ 'rouge', 'vert', 'bleu' ]
```

---

### Étape 2 : Manipuler des tableaux typés

Crée un fichier `src/tableaux-operations.ts` :

```typescript
// src/tableaux-operations.ts
// Opérations courantes sur les tableaux typés

const notes: number[] = [15, 12, 18, 9, 14];

// map : transforme chaque élément
// TypeScript infère que le résultat est string[]
const notesTexte: string[] = notes.map(
  (note: number): string => `${note}/20`
);
console.log("Notes formatées :", notesTexte);

// filter : garde uniquement les éléments qui passent le test
// TypeScript infère que le résultat est number[]
const bonnesNotes: number[] = notes.filter(
  (note: number): boolean => note >= 14
);
console.log("Bonnes notes :", bonnesNotes);

// reduce : calcule une valeur unique à partir du tableau
const moyenne: number =
  notes.reduce((total: number, note: number): number => total + note, 0) /
  notes.length;
console.log("Moyenne :", moyenne);

// find : trouve le premier élément qui correspond
// TypeScript infère que le résultat est number | undefined
// (car find peut ne rien trouver)
const premiereNoteParfaite: number | undefined = notes.find(
  (note: number): boolean => note === 20
);
console.log("Note parfaite :", premiereNoteParfaite); // undefined

// includes : vérifie si un élément existe
const contient18: boolean = notes.includes(18);
console.log("Contient 18 :", contient18);

// forEach : parcourt le tableau sans retourner de valeur
console.log("Détail des notes :");
notes.forEach((note: number, index: number): void => {
  const mention: string = note >= 14 ? "Bien" : "À améliorer";
  console.log(`  Note ${index + 1} : ${note}/20 - ${mention}`);
});
```

Compile et exécute :

```bash
npx tsc && node dist/tableaux-operations.js
```

**Résultat attendu** :

```text
Notes formatées : [ '15/20', '12/20', '18/20', '9/20', '14/20' ]
Bonnes notes : [ 15, 18, 14 ]
Moyenne : 13.6
Note parfaite : undefined
Contient 18 : true
Détail des notes :
  Note 1 : 15/20 - Bien
  Note 2 : 12/20 - À améliorer
  Note 3 : 18/20 - Bien
  Note 4 : 9/20 - À améliorer
  Note 5 : 14/20 - Bien
```

---

### Étape 3 : Utiliser les tuples

Crée un fichier `src/tuples.ts` :

```typescript
// src/tuples.ts
// Les tuples : tableaux à taille fixe avec types par position

// Déclaration d'un tuple : [type1, type2, ...]
const coordonnees: [number, number] = [48.8566, 2.3522]; // [latitude, longitude]

// Chaque position a son type
const personne: [string, number] = ["Alice", 25]; // [nom, âge]

// Accès aux éléments : TypeScript connaît le type de chaque position
const nom: string = personne[0]; // TypeScript sait que c'est un string
const age: number = personne[1]; // TypeScript sait que c'est un number
console.log(`${nom} a ${age} ans`);

// Déstructuration d'un tuple
const [latitude, longitude] = coordonnees;
console.log(`Latitude : ${latitude}, Longitude : ${longitude}`);

// Tuple avec plus de deux éléments
const enregistrement: [number, string, boolean] = [1, "Alice", true];
// Position 0 : identifiant (number)
// Position 1 : nom (string)
// Position 2 : actif (boolean)

const [id, nomEnr, actif] = enregistrement;
console.log(`ID: ${id}, Nom: ${nomEnr}, Actif: ${actif}`);

// Tuple comme type de retour d'une fonction
function diviser(a: number, b: number): [number, number] {
  // Retourne le quotient et le reste
  const quotient: number = Math.floor(a / b);
  const reste: number = a % b;
  return [quotient, reste];
}

const [quotient, reste] = diviser(17, 5);
console.log(`17 / 5 = ${quotient} reste ${reste}`);

// Tuple avec élément optionnel
const couleurRGB: [number, number, number, number?] = [255, 128, 0];
// Le 4e élément (alpha) est optionnel
const couleurRGBA: [number, number, number, number?] = [255, 128, 0, 0.5];

console.log("RGB :", couleurRGB);
console.log("RGBA :", couleurRGBA);

// Tuple nommé (pour la lisibilité, depuis TypeScript 4.0)
type Coordonnee = [latitude: number, longitude: number];
const paris: Coordonnee = [48.8566, 2.3522];
const lyon: Coordonnee = [45.7640, 4.8357];
console.log("Paris :", paris);
console.log("Lyon :", lyon);
```

Compile et exécute :

```bash
npx tsc && node dist/tuples.js
```

**Résultat attendu** :

```text
Alice a 25 ans
Latitude : 48.8566, Longitude : 2.3522
ID: 1, Nom: Alice, Actif: true
17 / 5 = 3 reste 2
RGB : [ 255, 128, 0 ]
RGBA : [ 255, 128, 0, 0.5 ]
Paris : [ 48.8566, 2.3522 ]
Lyon : [ 45.764, 4.8357 ]
```

---

### Étape 4 : Les tableaux readonly

Crée un fichier `src/readonly-arrays.ts` :

```typescript
// src/readonly-arrays.ts
// Tableaux en lecture seule : impossible de modifier après création

// Syntaxe 1 : readonly Type[]
const joursOuvres: readonly string[] = [
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
];

// Syntaxe 2 : ReadonlyArray<Type>
const moisAnnee: ReadonlyArray<string> = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

// Lecture : OK
console.log("Premier jour ouvré :", joursOuvres[0]);
console.log("Nombre de mois :", moisAnnee.length);

// Modification : IMPOSSIBLE
// joursOuvres.push("Samedi"); // Erreur : Property 'push' does not exist on type 'readonly string[]'
// joursOuvres[0] = "Dimanche"; // Erreur : Index signature in type 'readonly string[]' only permits reading
// joursOuvres.pop(); // Erreur : Property 'pop' does not exist

// Les méthodes qui ne modifient pas le tableau fonctionnent
const joursAvecM: readonly string[] = joursOuvres.filter(
  (jour: string): boolean => jour.startsWith("M")
);
console.log("Jours commençant par M :", joursAvecM);

// map retourne un nouveau tableau (ne modifie pas l'original)
const joursMajuscules: string[] = joursOuvres.map(
  (jour: string): string => jour.toUpperCase()
);
console.log("Jours en majuscules :", joursMajuscules);

// Tuple readonly
const point: readonly [number, number] = [10, 20];
// point[0] = 30; // Erreur : Cannot assign to '0' because it is a read-only property
console.log("Point :", point);

// as const : rend un tableau complètement readonly et littéral
const directions = ["nord", "sud", "est", "ouest"] as const;
// Type inféré : readonly ["nord", "sud", "est", "ouest"]
// Chaque élément est un type littéral, pas juste string

// Utilisation pratique : une fonction qui ne modifie pas le tableau
function afficherListe(elements: readonly string[]): void {
  // Le paramètre est readonly : cette fonction garantit
  // qu'elle ne modifie pas le tableau passé en argument
  elements.forEach((element: string, index: number): void => {
    console.log(`  ${index + 1}. ${element}`);
  });
}

console.log("Jours ouvrés :");
afficherListe(joursOuvres);
```

Compile et exécute :

```bash
npx tsc && node dist/readonly-arrays.js
```

**Résultat attendu** :

```text
Premier jour ouvré : Lundi
Nombre de mois : 12
Jours commençant par M : [ 'Mardi', 'Mercredi' ]
Jours en majuscules : [ 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI' ]
Point : [ 10, 20 ]
Jours ouvrés :
  1. Lundi
  2. Mardi
  3. Mercredi
  4. Jeudi
  5. Vendredi
```

---

### Étape 5 : Tableaux multidimensionnels

Crée un fichier `src/tableaux-multi.ts` :

```typescript
// src/tableaux-multi.ts
// Tableaux de tableaux (multidimensionnels)

// Tableau 2D : un tableau de tableaux de nombres
const grille: number[][] = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Accès à un élément : grille[ligne][colonne]
console.log("Centre de la grille :", grille[1][1]); // 5

// Parcourir une grille 2D
console.log("Grille complète :");
grille.forEach((ligne: number[], indexLigne: number): void => {
  const ligneTexte: string = ligne
    .map((valeur: number): string => String(valeur).padStart(2))
    .join(" ");
  console.log(`  Ligne ${indexLigne} : ${ligneTexte}`);
});

// Tableau de tuples
type Etudiant = [string, number]; // [nom, note]
const classement: Etudiant[] = [
  ["Alice", 18],
  ["Bob", 15],
  ["Charlie", 12],
];

console.log("\nClassement :");
classement.forEach(([nom, note]: Etudiant, position: number): void => {
  console.log(`  ${position + 1}. ${nom} - ${note}/20`);
});

// Matrice typée
type Matrice = number[][];

function afficherMatrice(matrice: Matrice): void {
  matrice.forEach((ligne: number[]): void => {
    console.log(
      "  [" + ligne.map((v: number): string => String(v).padStart(3)).join(",") + " ]"
    );
  });
}

const matrice3x3: Matrice = [
  [1, 0, 0],
  [0, 1, 0],
  [0, 0, 1],
];

console.log("\nMatrice identité :");
afficherMatrice(matrice3x3);
```

Compile et exécute :

```bash
npx tsc && node dist/tableaux-multi.js
```

**Résultat attendu** :

```text
Centre de la grille : 5
Grille complète :
  Ligne 0 :  1  2  3
  Ligne 1 :  4  5  6
  Ligne 2 :  7  8  9

Classement :
  1. Alice - 18/20
  2. Bob - 15/20
  3. Charlie - 12/20

Matrice identité :
  [  1,  0,  0 ]
  [  0,  1,  0 ]
  [  0,  0,  1 ]
```

---

### Étape 6 : Tableaux avec types union

Crée un fichier `src/tableaux-union.ts` :

```typescript
// src/tableaux-union.ts
// Tableaux contenant plusieurs types

// Tableau avec type union : chaque élément peut être string OU number
const identifiants: (string | number)[] = [1, "abc", 2, "def", 3];

console.log("Identifiants :", identifiants);

// Pour utiliser les éléments, il faut vérifier leur type
identifiants.forEach((id: string | number): void => {
  if (typeof id === "string") {
    // Ici TypeScript sait que id est un string
    console.log(`  Texte : ${id.toUpperCase()}`);
  } else {
    // Ici TypeScript sait que id est un number
    console.log(`  Nombre : ${id * 10}`);
  }
});

// Tableau d'objets ou null
const resultats: (string | null)[] = ["succès", null, "succès", null, "erreur"];

// Filtrer les valeurs null
const resultatsValides: string[] = resultats.filter(
  (r: string | null): r is string => r !== null
);
// r is string est un "type predicate" : il dit à TypeScript que
// si la fonction retourne true, alors r est un string

console.log("\nRésultats valides :", resultatsValides);
```

Compile et exécute :

```bash
npx tsc && node dist/tableaux-union.js
```

**Résultat attendu** :

```text
Identifiants : [ 1, 'abc', 2, 'def', 3 ]
  Nombre : 10
  Texte : ABC
  Nombre : 20
  Texte : DEF
  Nombre : 30

Résultats valides : [ 'succès', 'succès', 'erreur' ]
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute un fichier |
| `node src/fichier.ts` ou `npx tsx src/fichier.ts` | Node 22.18+ : TS effaçable ; tsx pour enums/namespaces |
| `npx tsc --noEmit` | Vérifie les types sans générer de JavaScript |

---

## Pièges Fréquents

### Piège 1 : Confondre `Type[]` et `[Type]`

**Problème** : `number[]` et `[number]` ne sont pas la même chose.

```typescript
const nombres: number[] = [1, 2, 3]; // Tableau de nombres (taille variable)
const unSeul: [number] = [1]; // Tuple avec un seul élément number
```

**Solution** : `Type[]` est un tableau de taille variable. `[Type]` est un tuple avec exactement un élément.

---

### Piège 2 : Modifier un tuple avec `push`

**Problème** : TypeScript ne bloque pas `push` sur un tuple, même si cela devrait être interdit.

```typescript
const paire: [string, number] = ["Alice", 25];
paire.push("extra"); // TypeScript ne signale PAS d'erreur ici
// C'est une limitation connue de TypeScript
```

**Solution** : Utilise `readonly` pour un tuple qui ne doit pas être modifié.

```typescript
const paire: readonly [string, number] = ["Alice", 25];
// paire.push("extra"); // Erreur : Property 'push' does not exist
```

---

### Piège 3 : Oublier le type du tableau vide

**Problème** : Un tableau vide sans annotation de type est inféré comme `any[]`.

```typescript
// Avec strict: true, ceci peut causer des problèmes
const elements = []; // Type inféré : any[]
```

**Solution** : Annote toujours le type d'un tableau vide.

```typescript
const elements: string[] = []; // Type explicite
elements.push("premier");
```

---

## Checklist de Validation

- [ ] Je sais déclarer un tableau typé avec `Type[]` et `Array<Type>`
- [ ] Je comprends l'inférence de type pour les tableaux
- [ ] Je sais utiliser les tuples pour des tableaux de taille fixe
- [ ] Je sais déstructurer un tuple
- [ ] Je comprends `readonly` pour les tableaux immuables
- [ ] Je sais créer des tableaux multidimensionnels typés
- [ ] Je sais utiliser `as const` pour créer des tableaux readonly littéraux
- [ ] Je connais la différence entre `number[]` et `[number]`

---

## Exercice Pratique

**Énoncé** : Crée un fichier `src/carnet-notes.ts` qui gère un carnet de notes d'élèves :

1. Définis un type tuple `NoteEleve` : `[nom: string, matiere: string, note: number]`
2. Crée un tableau readonly de `NoteEleve` avec au moins 6 entrées
3. Écris une fonction `moyenneParEleve` qui prend le tableau et un nom, et retourne la moyenne de cet élève
4. Écris une fonction `meilleureNote` qui retourne un tuple `[nom, matiere, note]` de la meilleure note
5. Affiche les résultats

**Indications** :

- Utilise `filter` pour sélectionner les notes d'un élève
- Utilise `reduce` pour calculer la somme
- Pense à gérer le cas où l'élève n'a aucune note

**Résultat attendu** :

```text
Moyenne de Alice : 15.67
Moyenne de Bob : 13
Meilleure note : Alice en Maths avec 18/20
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/carnet-notes.ts

// Type tuple pour une note d'élève
type NoteEleve = [nom: string, matiere: string, note: number];

// Tableau readonly de notes
const notes: readonly NoteEleve[] = [
  ["Alice", "Maths", 18],
  ["Alice", "Français", 14],
  ["Alice", "Anglais", 15],
  ["Bob", "Maths", 12],
  ["Bob", "Français", 11],
  ["Bob", "Anglais", 16],
];

// Fonction qui calcule la moyenne d'un élève
function moyenneParEleve(
  carnet: readonly NoteEleve[],
  nomEleve: string
): number {
  // Filtre les notes de l'élève demandé
  const notesEleve: NoteEleve[] = carnet.filter(
    ([nom]: NoteEleve): boolean => nom === nomEleve
  );

  // Si l'élève n'a aucune note, retourne 0
  if (notesEleve.length === 0) {
    return 0;
  }

  // Calcule la somme des notes
  const somme: number = notesEleve.reduce(
    (total: number, [, , note]: NoteEleve): number => total + note,
    0
  );

  // Retourne la moyenne arrondie à 2 décimales
  return Math.round((somme / notesEleve.length) * 100) / 100;
}

// Fonction qui trouve la meilleure note
function meilleureNote(carnet: readonly NoteEleve[]): NoteEleve {
  // On commence avec la première note
  let meilleure: NoteEleve = carnet[0];

  // On parcourt toutes les notes pour trouver la plus haute
  carnet.forEach((entry: NoteEleve): void => {
    if (entry[2] > meilleure[2]) {
      meilleure = entry;
    }
  });

  return meilleure;
}

// Affichage des résultats
console.log("Moyenne de Alice :", moyenneParEleve(notes, "Alice"));
console.log("Moyenne de Bob :", moyenneParEleve(notes, "Bob"));

const [nom, matiere, note] = meilleureNote(notes);
console.log(`Meilleure note : ${nom} en ${matiere} avec ${note}/20`);
```

Compile et exécute :

```bash
npx tsc && node dist/carnet-notes.js
```

**Résultat attendu** :

```text
Moyenne de Alice : 15.67
Moyenne de Bob : 13
Meilleure note : Alice en Maths avec 18/20
```

---

## Navigation

← Fiche précédente : **[03 - Types primitifs et annotations](03-types-primitifs-annotations.md)**

→ Fiche suivante : **[05 - Objets et interfaces](05-objets-interfaces.md)**
