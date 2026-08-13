---
tags:
  - TypeScript
  - Intermédiaire
  - Concept
description: "Maîtriser les fonctions typées : paramètres, retours, surcharges, callbacks et rest parameters."
estimated_time: "75 min"
fiche_number: 7
total_fiches: 15
cursus: "TypeScript"
---

# 07 - Fonctions typées

> **En bref** : Apprendre à typer les fonctions en profondeur : paramètres, valeurs de retour, surcharges, callbacks et rest parameters. Lecture estimée : 75 min.

## Prérequis

- [06 - Types union et intersection](06-types-union-intersection.md)
- Connaître les fonctions JavaScript (déclaration, expressions, arrow functions)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras typer les paramètres et retours de fonctions, utiliser les surcharges de fonctions, typer les callbacks et les rest parameters.

---

## Concepts

### Qu'est-ce qu'une fonction typée ?

**Définition** : Une fonction typée est une fonction dont les paramètres et la valeur de retour ont des types déclarés. TypeScript vérifie que les arguments passés correspondent aux types attendus et que la valeur retournée correspond au type déclaré.

**Le problème que les fonctions typées résolvent** :

Sans fonctions typées, voici les problèmes rencontrés :

1. **Arguments incorrects** : En JavaScript, on peut appeler une fonction avec des arguments du mauvais type sans erreur. Le bug n'apparaît qu'à l'exécution.
2. **Retour imprévisible** : Une fonction JavaScript peut retourner n'importe quel type selon les conditions. L'appelant ne sait pas à quoi s'attendre.
3. **Documentation absente** : Sans types, il faut lire le corps de la fonction pour comprendre ce qu'elle attend et ce qu'elle retourne.

**Comment les fonctions typées résolvent ces problèmes** :

| Problème | Solution apportée par les fonctions typées |
| -------- | ------------------------------------------ |
| Arguments incorrects | TypeScript refuse les arguments du mauvais type |
| Retour imprévisible | Le type de retour est garanti par le compilateur |
| Documentation absente | Les types servent de documentation intégrée |

**Analogie concrète** : Une fonction typée est comme une machine à café automatique. L'entrée est définie : tu dois insérer une dosette (type précis), pas un sachet de thé. La sortie est définie : la machine produit un café (type précis), pas une soupe. Si tu insères le mauvais type d'entrée, la machine refuse.

---

### Qu'est-ce qu'une surcharge de fonction ?

**Définition** : Une surcharge de fonction (function overload) permet de déclarer plusieurs signatures pour une même fonction. Chaque signature définit une combinaison différente de types de paramètres et de retour. TypeScript choisit la bonne signature selon les arguments passés.

**Le problème que les surcharges résolvent** :

Sans surcharges, voici les problèmes rencontrés :

1. **Perte de précision** : Une fonction qui accepte `string | number` et retourne `string | number` ne permet pas à TypeScript de savoir que passer un string retourne un string et passer un number retourne un number.
2. **Complexité des types** : Les types de retour deviennent des unions larges que l'appelant doit vérifier manuellement.

**Comment les surcharges résolvent ces problèmes** :

| Problème | Solution apportée par les surcharges |
| -------- | ------------------------------------ |
| Perte de précision | Chaque combinaison d'entrée a un type de retour précis |
| Complexité des types | L'appelant obtient directement le bon type de retour |

**Analogie concrète** : Les surcharges sont comme un distributeur automatique avec plusieurs boutons. Le bouton "café" (entrée : dosette café) donne un café (retour : café). Le bouton "thé" (entrée : sachet thé) donne un thé (retour : thé). C'est la même machine, mais le résultat dépend de l'entrée choisie.

---

### Qu'est-ce qu'un callback typé ?

**Définition** : Un callback typé est une fonction passée en argument à une autre fonction, dont les types de paramètres et de retour sont définis. Le type du callback est déclaré soit directement dans la signature de la fonction, soit via un type alias.

**Le problème que les callbacks typés résolvent** :

Sans callbacks typés, voici les problèmes rencontrés :

1. **Erreurs dans le callback** : Si le callback n'est pas typé, il peut recevoir ou retourner des données du mauvais type.
2. **Interface floue** : L'utilisateur de la fonction ne sait pas quelle signature le callback doit avoir.

**Comment les callbacks typés résolvent ces problèmes** :

| Problème | Solution apportée par les callbacks typés |
| -------- | ----------------------------------------- |
| Erreurs dans le callback | TypeScript vérifie que le callback a la bonne signature |
| Interface floue | Le type du callback documente exactement ce qui est attendu |

---

## Étapes Pratiques

### Étape 1 : Syntaxes de fonctions typées

Crée un fichier `src/fonctions-syntaxes.ts` :

```typescript
// src/fonctions-syntaxes.ts
// Les différentes syntaxes pour typer les fonctions

// 1. Déclaration de fonction
function additionner(a: number, b: number): number {
  return a + b;
}

// 2. Expression de fonction
const soustraire = function (a: number, b: number): number {
  return a - b;
};

// 3. Arrow function
const multiplier = (a: number, b: number): number => {
  return a * b;
};

// 4. Arrow function courte (retour implicite)
const diviser = (a: number, b: number): number => a / b;

// 5. Type alias pour une fonction
type OperationMath = (a: number, b: number) => number;

// On peut utiliser le type alias pour typer une variable
const modulo: OperationMath = (a, b) => a % b;
// Les types des paramètres sont inférés depuis OperationMath

// 6. Interface pour une fonction (moins courant)
interface Formateur {
  (valeur: number): string;
}

const formaterEuros: Formateur = (valeur) => `${valeur.toFixed(2)} €`;

// Tests
console.log("Addition :", additionner(10, 5));
console.log("Soustraction :", soustraire(10, 5));
console.log("Multiplication :", multiplier(10, 5));
console.log("Division :", diviser(10, 5));
console.log("Modulo :", modulo(10, 3));
console.log("Format euros :", formaterEuros(42.5));

// Tableau de fonctions du même type
const operations: OperationMath[] = [
  additionner,
  soustraire,
  multiplier,
  diviser,
];
const noms: string[] = ["+", "-", "*", "/"];

console.log("\nToutes les opérations avec 10 et 3 :");
operations.forEach((op: OperationMath, i: number): void => {
  console.log(`  10 ${noms[i]} 3 = ${op(10, 3)}`);
});
```

Compile et exécute :

```bash
npx tsc && node dist/fonctions-syntaxes.js
```

**Résultat attendu** :

```text
Addition : 15
Soustraction : 5
Multiplication : 50
Division : 2
Modulo : 1
Format euros : 42.50 €

Toutes les opérations avec 10 et 3 :
  10 + 3 = 13
  10 - 3 = 7
  10 * 3 = 30
  10 / 3 = 3.3333333333333335
```

---

### Étape 2 : Paramètres optionnels et valeurs par défaut

Crée un fichier `src/fonctions-params.ts` :

```typescript
// src/fonctions-params.ts
// Paramètres optionnels, valeurs par défaut et rest parameters

// Paramètre optionnel : ajout de ? après le nom
function creerMessage(
  destinataire: string,
  sujet: string,
  corps?: string
): string {
  // corps est de type string | undefined
  if (corps !== undefined) {
    return `À: ${destinataire}\nSujet: ${sujet}\n\n${corps}`;
  }
  return `À: ${destinataire}\nSujet: ${sujet}\n\n(pas de contenu)`;
}

console.log(creerMessage("alice@test.fr", "Bonjour", "Comment vas-tu ?"));
console.log("---");
console.log(creerMessage("bob@test.fr", "Info"));

// Valeur par défaut : le paramètre a une valeur si non fourni
function paginer(
  items: string[],
  page: number = 1,
  parPage: number = 10
): string[] {
  // page et parPage ont des valeurs par défaut
  // Leur type est inféré comme number
  const debut: number = (page - 1) * parPage;
  const fin: number = debut + parPage;
  return items.slice(debut, fin);
}

const fruits: string[] = [
  "pomme",
  "banane",
  "cerise",
  "datte",
  "figue",
];

console.log("\n--- Pagination ---");
console.log("Page 1, 2 par page :", paginer(fruits, 1, 2));
console.log("Page 2, 2 par page :", paginer(fruits, 2, 2));
console.log("Page 1, défaut :", paginer(fruits));

// Rest parameters : nombre variable de paramètres
function somme(...nombres: number[]): number {
  // nombres est un tableau de number
  return nombres.reduce(
    (total: number, n: number): number => total + n,
    0
  );
}

console.log("\n--- Rest parameters ---");
console.log("Somme(1, 2, 3) :", somme(1, 2, 3));
console.log("Somme(10, 20) :", somme(10, 20));
console.log("Somme() :", somme());

// Rest parameters avec des paramètres fixes
function log(niveau: string, ...messages: string[]): void {
  const texte: string = messages.join(" ");
  console.log(`[${niveau.toUpperCase()}] ${texte}`);
}

console.log("\n--- Logs ---");
log("info", "Serveur", "démarré", "sur le port", "3000");
log("error", "Connexion", "refusée");

// Rest parameters typés avec un tuple
function creerPoint(...coords: [number, number, number?]): string {
  const [x, y, z] = coords;
  if (z !== undefined) {
    return `Point 3D (${x}, ${y}, ${z})`;
  }
  return `Point 2D (${x}, ${y})`;
}

console.log("\n--- Points ---");
console.log(creerPoint(1, 2));
console.log(creerPoint(1, 2, 3));
```

Compile et exécute :

```bash
npx tsc && node dist/fonctions-params.js
```

**Résultat attendu** :

```text
À: alice@test.fr
Sujet: Bonjour

Comment vas-tu ?
---
À: bob@test.fr
Sujet: Info

(pas de contenu)

--- Pagination ---
Page 1, 2 par page : [ 'pomme', 'banane' ]
Page 2, 2 par page : [ 'cerise', 'datte' ]
Page 1, défaut : [ 'pomme', 'banane', 'cerise', 'datte', 'figue' ]

--- Rest parameters ---
Somme(1, 2, 3) : 6
Somme(10, 20) : 30
Somme() : 0

--- Logs ---
[INFO] Serveur démarré sur le port 3000
[ERROR] Connexion refusée

--- Points ---
Point 2D (1, 2)
Point 3D (1, 2, 3)
```

---

### Étape 3 : Surcharges de fonctions

Crée un fichier `src/surcharges.ts` :

```typescript
// src/surcharges.ts
// Les surcharges permettent de définir plusieurs signatures

// Surcharge 1 : si on passe un string, on retourne un string
function convertir(valeur: string): string;
// Surcharge 2 : si on passe un number, on retourne un number
function convertir(valeur: number): number;
// Implémentation : gère tous les cas
function convertir(valeur: string | number): string | number {
  if (typeof valeur === "string") {
    return valeur.toUpperCase();
  }
  return valeur * 2;
}

// TypeScript sait que le retour est string quand l'entrée est string
const texte: string = convertir("hello");
// TypeScript sait que le retour est number quand l'entrée est number
const nombre: number = convertir(21);

console.log("Convertir 'hello' :", texte);
console.log("Convertir 21 :", nombre);

// Surcharge plus complexe : chercher dans un tableau
function chercher(items: string[], parNom: string): string | undefined;
function chercher(items: string[], parIndex: number): string | undefined;
function chercher(
  items: string[],
  critere: string | number
): string | undefined {
  if (typeof critere === "number") {
    // Recherche par index
    return items[critere];
  }
  // Recherche par contenu
  return items.find((item: string): boolean =>
    item.toLowerCase().includes(critere.toLowerCase())
  );
}

const fruits: string[] = ["Pomme", "Banane", "Cerise", "Datte"];

console.log("\nChercher par index 2 :", chercher(fruits, 2));
console.log("Chercher 'ban' :", chercher(fruits, "ban"));
console.log("Chercher 'xyz' :", chercher(fruits, "xyz"));

// Surcharge avec différents nombres de paramètres
function creerDate(timestamp: number): Date;
function creerDate(annee: number, mois: number, jour: number): Date;
function creerDate(
  anneeOuTimestamp: number,
  mois?: number,
  jour?: number
): Date {
  if (mois !== undefined && jour !== undefined) {
    // Appelé avec 3 arguments : annee, mois, jour
    return new Date(anneeOuTimestamp, mois - 1, jour);
  }
  // Appelé avec 1 argument : timestamp
  return new Date(anneeOuTimestamp);
}

const date1: Date = creerDate(1704067200000);
const date2: Date = creerDate(2025, 6, 15);

console.log("\nDate depuis timestamp :", date1.toLocaleDateString("fr-FR"));
console.log("Date depuis composants :", date2.toLocaleDateString("fr-FR"));
```

Compile et exécute :

```bash
npx tsc && node dist/surcharges.js
```

**Résultat attendu** :

```text
Convertir 'hello' : HELLO
Convertir 21 : 42

Chercher par index 2 : Cerise
Chercher 'ban' : Banane
Chercher 'xyz' : undefined

Date depuis timestamp : 01/01/2024
Date depuis composants : 15/06/2025
```

---

### Étape 4 : Callbacks typés

Crée un fichier `src/callbacks.ts` :

```typescript
// src/callbacks.ts
// Typer les fonctions passées en argument (callbacks)

// Type alias pour un callback
type Comparateur = (a: number, b: number) => number;

// Fonction qui accepte un callback
function trier(nombres: number[], comparateur: Comparateur): number[] {
  // On crée une copie pour ne pas modifier l'original
  return [...nombres].sort(comparateur);
}

const nombres: number[] = [5, 2, 8, 1, 9, 3];

// Tri croissant
const croissant: number[] = trier(nombres, (a, b) => a - b);
console.log("Croissant :", croissant);

// Tri décroissant
const decroissant: number[] = trier(nombres, (a, b) => b - a);
console.log("Décroissant :", decroissant);

// Callback avec type inline (sans type alias)
function filtrerEtTransformer(
  items: string[],
  filtre: (item: string) => boolean,
  transformateur: (item: string) => string
): string[] {
  return items.filter(filtre).map(transformateur);
}

const mots: string[] = ["bonjour", "au revoir", "merci", "oui", "non"];

const resultat: string[] = filtrerEtTransformer(
  mots,
  (mot: string): boolean => mot.length > 3,
  (mot: string): string => mot.toUpperCase()
);

console.log("\nMots longs en majuscules :", resultat);

// Callback qui ne retourne rien (void)
type GestionnaireEvenement = (evenement: string, timestamp: Date) => void;

function enregistrerGestionnaire(
  nom: string,
  gestionnaire: GestionnaireEvenement
): void {
  console.log(`Gestionnaire "${nom}" enregistré`);
  // Simulation d'un événement
  gestionnaire("click", new Date());
}

enregistrerGestionnaire("logger", (evenement, timestamp) => {
  console.log(`  [${timestamp.toISOString()}] ${evenement}`);
});

// Callback optionnel
function executerAvecLog(
  tache: string,
  action: () => void,
  surErreur?: (erreur: Error) => void
): void {
  console.log(`\nDébut : ${tache}`);
  try {
    action();
    console.log(`Fin : ${tache}`);
  } catch (erreur) {
    if (surErreur !== undefined && erreur instanceof Error) {
      surErreur(erreur);
    } else {
      console.log("Erreur non gérée");
    }
  }
}

executerAvecLog(
  "Traitement des données",
  () => {
    console.log("  Traitement en cours...");
  }
);

executerAvecLog(
  "Opération risquée",
  () => {
    throw new Error("Quelque chose a échoué");
  },
  (erreur: Error) => {
    console.log(`  Erreur attrapée : ${erreur.message}`);
  }
);
```

Compile et exécute :

```bash
npx tsc && node dist/callbacks.js
```

**Résultat attendu** :

```text
Croissant : [ 1, 2, 3, 5, 8, 9 ]
Décroissant : [ 9, 8, 5, 3, 2, 1 ]

Mots longs en majuscules : [ 'BONJOUR', 'AU REVOIR', 'MERCI' ]
Gestionnaire "logger" enregistré
  [2025-...] click

Début : Traitement des données
  Traitement en cours...
Fin : Traitement des données

Début : Opération risquée
  Erreur attrapée : Quelque chose a échoué
```

---

### Étape 5 : Types de fonctions avancés

Crée un fichier `src/fonctions-avancees.ts` :

```typescript
// src/fonctions-avancees.ts
// Patterns avancés pour les fonctions typées

// Fonction qui retourne une fonction (closure typée)
function creerMultiplicateur(facteur: number): (n: number) => number {
  // Retourne une arrow function qui multiplie par le facteur
  return (n: number): number => n * facteur;
}

const doubler = creerMultiplicateur(2);
const tripler = creerMultiplicateur(3);

console.log("Doubler 5 :", doubler(5));
console.log("Tripler 5 :", tripler(5));

// Fonction avec type de retour conditionnel (surcharge)
function traiterValeur(valeur: string): string[];
function traiterValeur(valeur: number): number;
function traiterValeur(valeur: string | number): string[] | number {
  if (typeof valeur === "string") {
    return valeur.split("");
  }
  return valeur * valeur;
}

console.log("\nTraiter 'abc' :", traiterValeur("abc"));
console.log("Traiter 5 :", traiterValeur(5));

// Fonction comme propriété d'un objet
interface Validateur {
  nom: string;
  valider: (valeur: string) => boolean;
  message: string;
}

const validateurs: Validateur[] = [
  {
    nom: "longueur",
    valider: (v: string): boolean => v.length >= 3,
    message: "Doit avoir au moins 3 caractères",
  },
  {
    nom: "majuscule",
    valider: (v: string): boolean => v !== v.toLowerCase(),
    message: "Doit contenir au moins une majuscule",
  },
  {
    nom: "chiffre",
    valider: (v: string): boolean => /\d/.test(v),
    message: "Doit contenir au moins un chiffre",
  },
];

function validerChaine(valeur: string, regles: Validateur[]): string[] {
  const erreurs: string[] = [];

  regles.forEach((regle: Validateur): void => {
    if (!regle.valider(valeur)) {
      erreurs.push(`[${regle.nom}] ${regle.message}`);
    }
  });

  return erreurs;
}

console.log("\nValidation de 'ab' :");
const erreurs1: string[] = validerChaine("ab", validateurs);
erreurs1.forEach((e: string): void => console.log(`  ${e}`));

console.log("\nValidation de 'Abc1' :");
const erreurs2: string[] = validerChaine("Abc1", validateurs);
if (erreurs2.length === 0) {
  console.log("  Aucune erreur");
} else {
  erreurs2.forEach((e: string): void => console.log(`  ${e}`));
}

// this dans les fonctions
interface Compteur {
  valeur: number;
  incrementer(this: Compteur): void;
  afficher(this: Compteur): void;
}

const compteur: Compteur = {
  valeur: 0,
  incrementer(this: Compteur): void {
    this.valeur++;
  },
  afficher(this: Compteur): void {
    console.log(`Compteur : ${this.valeur}`);
  },
};

compteur.incrementer();
compteur.incrementer();
compteur.incrementer();
compteur.afficher();
```

Compile et exécute :

```bash
npx tsc && node dist/fonctions-avancees.js
```

**Résultat attendu** :

```text
Doubler 5 : 10
Tripler 5 : 15

Traiter 'abc' : [ 'a', 'b', 'c' ]
Traiter 5 : 25

Validation de 'ab' :
  [longueur] Doit avoir au moins 3 caractères
  [majuscule] Doit contenir au moins une majuscule
  [chiffre] Doit contenir au moins un chiffre

Validation de 'Abc1' :
  Aucune erreur
Compteur : 3
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute |
| `npx tsc --noEmit` | Vérifie les types sans compiler |
| `npx ts-node src/fichier.ts` | Compile et exécute directement |

---

## Pièges Fréquents

### Piège 1 : Les paramètres optionnels doivent être en dernier

**Problème** : Placer un paramètre optionnel avant un paramètre obligatoire.

```typescript
// Erreur : un paramètre obligatoire ne peut pas suivre un paramètre optionnel
function exemple(a?: string, b: number): void {}
```

**Solution** : Les paramètres optionnels doivent toujours être après les paramètres obligatoires.

```typescript
function exemple(b: number, a?: string): void {}
```

---

### Piège 2 : L'implémentation d'une surcharge n'est pas appelable directement

**Problème** : La signature d'implémentation d'une surcharge n'est pas visible pour l'appelant.

```typescript
function traiter(valeur: string): string;
function traiter(valeur: number): number;
function traiter(valeur: string | number): string | number {
  // ...
}

// Erreur : l'appelant ne peut pas passer string | number
// Il doit passer string OU number
// const r = traiter(Math.random() > 0.5 ? "abc" : 42);
```

**Solution** : Ajoute une surcharge pour chaque combinaison que tu veux autoriser.

---

### Piège 3 : Oublier le type de retour d'un callback void

**Problème** : Penser qu'un callback `void` ne peut rien retourner.

```typescript
type Callback = (x: number) => void;

// Ceci compile sans erreur, même si le callback retourne un nombre
const cb: Callback = (x) => x * 2;
```

**Solution** : `void` dans un type de callback signifie "la valeur de retour sera ignorée", pas "ne doit rien retourner". C'est voulu par TypeScript pour permettre la compatibilité avec `forEach`, `map`, etc. Si tu veux interdire le retour, utilise une vérification manuelle.

---

## Checklist de Validation

- [ ] Je sais typer les paramètres et la valeur de retour d'une fonction
- [ ] Je sais utiliser les paramètres optionnels et les valeurs par défaut
- [ ] Je sais utiliser les rest parameters typés
- [ ] Je sais créer un type alias pour une fonction
- [ ] Je comprends les surcharges de fonctions et quand les utiliser
- [ ] Je sais typer un callback passé en paramètre
- [ ] Je sais créer une fonction qui retourne une fonction typée

---

## Exercice Pratique

**Énoncé** : Crée un système de pipeline de transformation de données :

1. Définis un type `Transformateur<T>` qui est une fonction prenant un `T` et retournant un `T`
2. Crée une fonction `pipeline` qui accepte une valeur initiale et un tableau de `Transformateur<string>` et applique chaque transformateur successivement
3. Crée 4 transformateurs de string : `majuscules`, `ajouterPoint`, `supprEspaces`, `inverser`
4. Applique le pipeline et affiche le résultat

**Indications** :

- Utilise `reduce` pour appliquer les transformateurs successivement
- Chaque transformateur prend un string et retourne un string
- `inverser` inverse les caractères de la chaîne

**Résultat attendu** :

```text
Entrée : "  bonjour le monde  "
Après pipeline : "EDNOM EL RUOJNOB."
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/pipeline.ts

// Type générique pour un transformateur
type Transformateur<T> = (valeur: T) => T;

// Fonction pipeline qui applique une série de transformations
function pipeline(
  valeurInitiale: string,
  transformateurs: Transformateur<string>[]
): string {
  return transformateurs.reduce(
    (valeur: string, transformer: Transformateur<string>): string =>
      transformer(valeur),
    valeurInitiale
  );
}

// 4 transformateurs de string
const majuscules: Transformateur<string> = (texte: string): string =>
  texte.toUpperCase();

const ajouterPoint: Transformateur<string> = (texte: string): string =>
  texte + ".";

const supprEspaces: Transformateur<string> = (texte: string): string =>
  texte.trim();

const inverser: Transformateur<string> = (texte: string): string =>
  texte.split("").reverse().join("");

// Application du pipeline
const entree: string = "  bonjour le monde  ";
const sortie: string = pipeline(entree, [
  supprEspaces,
  majuscules,
  inverser,
  ajouterPoint,
]);

console.log(`Entrée : "${entree}"`);
console.log(`Après pipeline : "${sortie}"`);

// Test avec un autre pipeline
const sortie2: string = pipeline("TypeScript", [
  majuscules,
  ajouterPoint,
]);

console.log(`\nEntrée : "TypeScript"`);
console.log(`Après pipeline : "${sortie2}"`);
```

Compile et exécute :

```bash
npx tsc && node dist/pipeline.js
```

**Résultat attendu** :

```text
Entrée : "  bonjour le monde  "
Après pipeline : "EDNOM EL RUOJNOB."

Entrée : "TypeScript"
Après pipeline : "TYPESCRIPT."
```

---

## Navigation

← Fiche précédente : **[06 - Types union et intersection](06-types-union-intersection.md)**

→ Fiche suivante : **[08 - Classes et héritage](08-classes-heritage.md)**
