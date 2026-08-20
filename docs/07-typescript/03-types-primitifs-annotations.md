---
tags:
  - TypeScript
  - Débutant
  - Concept
description: "Maîtriser les types primitifs de TypeScript : string, number, boolean, any, unknown, void, never, null, undefined."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 15
cursus: "TypeScript"
---

# 03 - Types primitifs et annotations

> **En bref** : Apprendre tous les types de base de TypeScript et comprendre la différence entre annotation de type et inférence de type. Lecture estimée : 60 min.

## Prérequis

- [01 - Introduction à TypeScript](01-introduction-typescript.md)
- [02 - Installation et configuration](02-installation-configuration.md)
- Un projet TypeScript configuré avec `tsconfig.json`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les types primitifs `string`, `number`, `boolean`, `any`, `unknown`, `void`, `never`, `null` et `undefined`, et tu comprendras quand TypeScript infère les types automatiquement.

---

## Concepts

### Qu'est-ce qu'une annotation de type ?

**Définition** : Une annotation de type est une déclaration explicite du type d'une variable, d'un paramètre ou d'une valeur de retour. Elle s'écrit après le nom de la variable, séparée par deux-points (`:`).

**Le problème que les annotations de type résolvent** :

Sans annotations de type, voici les problèmes rencontrés :

1. **Ambiguïté** : En lisant le code, on ne sait pas quel type de données une variable contient. Il faut lire tout le code pour comprendre.
2. **Erreurs silencieuses** : Une variable peut changer de type au cours du programme sans que personne ne le remarque.
3. **Communication dans l'équipe** : Sans types visibles, chaque développeur doit deviner les types attendus par les fonctions des autres.

**Comment les annotations de type résolvent ces problèmes** :

| Problème | Solution apportée par les annotations |
| -------- | ------------------------------------- |
| Ambiguïté | Le type est écrit directement dans le code, visible immédiatement |
| Erreurs silencieuses | Le compilateur refuse de changer le type d'une variable |
| Communication | Les types servent de contrat entre les parties du code |

**Analogie concrète** : Les annotations de type sont comme les étiquettes sur des bocaux de cuisine. Sans étiquette, tu dois ouvrir chaque bocal pour savoir ce qu'il contient. Avec une étiquette "Farine", "Sucre", "Sel", tu sais immédiatement quoi utiliser. Et si quelqu'un essaie de mettre du sel dans le bocal "Sucre", l'étiquette signale le problème.

**Ce qu'une annotation de type n'est PAS** :

- Une annotation de type n'est pas une conversion. Écrire `: number` ne transforme pas une chaîne en nombre. Elle déclare que la variable **doit** contenir un nombre.
- Une annotation de type n'existe pas à l'exécution. Elle est supprimée lors de la compilation. C'est une aide pour le développeur et le compilateur, pas pour Node.js.

---

### Qu'est-ce que l'inférence de type ?

**Définition** : L'inférence de type est la capacité de TypeScript à déterminer automatiquement le type d'une variable en analysant la valeur qui lui est assignée. Quand TypeScript peut inférer le type, l'annotation explicite est facultative.

**Le problème que l'inférence de type résout** :

Sans inférence, voici les problèmes rencontrés :

1. **Code verbeux** : Il faudrait annoter chaque variable, même quand le type est évident. `const age: number = 25;` est plus long que nécessaire.
2. **Redondance** : Écrire le type quand il est déjà clair depuis la valeur assignée crée de la duplication inutile.

**Comment l'inférence résout ces problèmes** :

| Problème | Solution apportée par l'inférence |
| -------- | --------------------------------- |
| Code verbeux | TypeScript déduit le type automatiquement quand c'est possible |
| Redondance | On n'écrit l'annotation que quand le type n'est pas évident |

**Analogie concrète** : L'inférence de type fonctionne comme quand tu vois quelqu'un tenir une guitare. Tu n'as pas besoin qu'on te dise "cette personne est un guitariste". Tu le déduis de ce que tu vois. De même, TypeScript déduit que `const age = 25` est un nombre sans qu'on le lui dise.

**Comparaison annotation explicite vs inférence** :

| Annotation explicite | Inférence de type |
| -------------------- | ----------------- |
| `const age: number = 25;` | `const age = 25;` |
| Type déclaré par le développeur | Type déduit par TypeScript |
| Utile pour les cas complexes | Suffisant pour les cas simples |
| Obligatoire pour les paramètres de fonction | Automatique pour les valeurs de retour simples |

---

### Les types primitifs de TypeScript

**Définition** : Les types primitifs sont les types de base fournis par TypeScript. Ils correspondent aux types de données fondamentaux de JavaScript, avec des vérifications en plus.

Voici la liste complète des types primitifs :

| Type | Description | Exemple |
| ---- | ----------- | ------- |
| `string` | Chaîne de caractères | `"Bonjour"`, `'texte'`, `` `template` `` |
| `number` | Nombre (entier ou décimal) | `42`, `3.14`, `-7`, `0xFF` |
| `boolean` | Valeur vrai/faux | `true`, `false` |
| `null` | Absence intentionnelle de valeur | `null` |
| `undefined` | Variable déclarée mais sans valeur | `undefined` |
| `void` | Absence de valeur de retour | Utilisé pour les fonctions qui ne retournent rien |
| `never` | Type qui ne peut jamais avoir de valeur | Fonctions qui lancent toujours une erreur |
| `any` | N'importe quel type (désactive les vérifications) | À éviter autant que possible |
| `unknown` | Type inconnu (sûr, nécessite une vérification) | Alternative sûre à `any` |

---

## Étapes Pratiques

### Étape 1 : Les types `string`, `number` et `boolean`

Crée un fichier `src/types-base.ts` :

```typescript
// src/types-base.ts
// Les trois types les plus courants

// ===== STRING =====
// Une chaîne de caractères : texte entre guillemets
const prenom: string = "Alice";
const message: string = `Bonjour ${prenom}`; // Template literal
const vide: string = ""; // Une chaîne vide est toujours un string

// ===== NUMBER =====
// Un nombre : entier ou décimal, positif ou négatif
const age: number = 25;
const prix: number = 19.99;
const negatif: number = -10;
const hexadecimal: number = 0xff; // 255 en hexadécimal
const binaire: number = 0b1010; // 10 en binaire

// ===== BOOLEAN =====
// Une valeur logique : true ou false, rien d'autre
const estActif: boolean = true;
const estConnecte: boolean = false;
const estMajeur: boolean = age >= 18; // Le résultat d'une comparaison est un boolean

// Affichage de vérification
console.log("Prénom :", prenom);
console.log("Message :", message);
console.log("Âge :", age);
console.log("Prix :", prix);
console.log("Est majeur :", estMajeur);
```

Compile et exécute :

```bash
npx tsc && node dist/types-base.js
```

**Résultat attendu** :

```text
Prénom : Alice
Message : Bonjour Alice
Âge : 25
Prix : 19.99
Est majeur : true
```

---

### Étape 2 : L'inférence de type en action

Crée un fichier `src/inference.ts` :

```typescript
// src/inference.ts
// TypeScript infère le type automatiquement

// Avec annotation explicite (redondant)
const nom1: string = "Bob";

// Sans annotation : TypeScript infère que c'est un string
const nom2 = "Bob";

// Les deux lignes ci-dessus sont équivalentes
// TypeScript sait que "Bob" est un string

// Inférence avec des nombres
const quantite = 10; // TypeScript infère : number
const prixUnitaire = 5.5; // TypeScript infère : number
const total = quantite * prixUnitaire; // TypeScript infère : number

// Inférence avec des booléens
const estVide = false; // TypeScript infère : boolean
const aDesElements = quantite > 0; // TypeScript infère : boolean

// Inférence avec let vs const
const couleur = "rouge"; // Type inféré : "rouge" (type littéral)
let taille = "grand"; // Type inféré : string (type large)

// Explication :
// - const ne peut pas changer → TypeScript infère le type le plus précis ("rouge")
// - let peut changer → TypeScript infère le type général (string)

console.log("Total :", total);
console.log("Type de couleur : littéral 'rouge'");
console.log("Type de taille : string (peut changer)");

// Quand l'inférence ne suffit PAS :
// Les paramètres de fonction doivent être annotés
function saluer(nom: string): string {
  // Sans annotation, nom serait de type 'any' (erreur avec strict: true)
  return `Bonjour ${nom}`;
}

console.log(saluer("Charlie"));
```

Compile et exécute :

```bash
npx tsc && node dist/inference.js
```

**Résultat attendu** :

```text
Total : 55
Type de couleur : littéral 'rouge'
Type de taille : string (peut changer)
Bonjour Charlie
```

---

### Étape 3 : Les types `null` et `undefined`

Crée un fichier `src/null-undefined.ts` :

```typescript
// src/null-undefined.ts
// null et undefined sont deux types distincts en TypeScript

// undefined : la variable existe mais n'a pas de valeur
let valeurNonDefinie: undefined = undefined;

// null : la variable a été intentionnellement vidée
let valeurNulle: null = null;

// En pratique, on les combine souvent avec d'autres types
// grâce au type union (|)
let nomUtilisateur: string | null = null;
// nomUtilisateur peut être un string OU null

// Simulation : l'utilisateur se connecte
nomUtilisateur = "Alice";
console.log("Connecté :", nomUtilisateur);

// Simulation : l'utilisateur se déconnecte
nomUtilisateur = null;
console.log("Déconnecté :", nomUtilisateur);

// Avec strictNullChecks (activé par strict: true),
// on ne peut pas assigner null à un type non-nullable
// const age: number = null; // Erreur !

// Il faut déclarer explicitement que null est possible
let age: number | null = null;
age = 25;

// Vérification avant utilisation
// TypeScript oblige à vérifier si la valeur est null
if (age !== null) {
  // Ici, TypeScript sait que age est un number (pas null)
  console.log("Âge dans 10 ans :", age + 10);
}

// Paramètre optionnel dans une fonction
function saluer(nom: string, titre?: string): string {
  // titre? signifie que le paramètre est optionnel
  // Son type est : string | undefined
  if (titre !== undefined) {
    return `Bonjour ${titre} ${nom}`;
  }
  return `Bonjour ${nom}`;
}

console.log(saluer("Dupont", "Dr"));
console.log(saluer("Martin"));
```

Compile et exécute :

```bash
npx tsc && node dist/null-undefined.js
```

**Résultat attendu** :

```text
Connecté : Alice
Déconnecté : null
Âge dans 10 ans : 35
Bonjour Dr Dupont
Bonjour Martin
```

---

### Étape 4 : Le type `void`

Crée un fichier `src/type-void.ts` :

```typescript
// src/type-void.ts
// void signifie "cette fonction ne retourne rien"

// Fonction qui affiche un message mais ne retourne rien
function afficherMessage(message: string): void {
  // Le type de retour void indique qu'on ne retourne rien
  console.log(`[INFO] ${message}`);
  // Pas de return, ou return sans valeur
}

// Appel de la fonction
afficherMessage("Le serveur a démarré");
afficherMessage("Connexion établie");

// Si on essaie d'utiliser la valeur de retour, TypeScript prévient
const resultat = afficherMessage("Test");
// resultat est de type void
// console.log(resultat.length); // Erreur : Property 'length' does not exist on type 'void'

// void est différent de undefined
// void = la fonction ne retourne intentionnellement rien
// undefined = la fonction retourne la valeur undefined

function retourneRien(): void {
  // Pas de return
}

function retourneUndefined(): undefined {
  // Doit explicitement retourner undefined
  return undefined;
}

console.log("retourneRien() :", retourneRien());
console.log("retourneUndefined() :", retourneUndefined());
```

Compile et exécute :

```bash
npx tsc && node dist/type-void.js
```

**Résultat attendu** :

```text
[INFO] Le serveur a démarré
[INFO] Connexion établie
[INFO] Test
retourneRien() : undefined
retourneUndefined() : undefined
```

---

### Étape 5 : Le type `never`

Crée un fichier `src/type-never.ts` :

```typescript
// src/type-never.ts
// never représente un type qui ne peut jamais avoir de valeur
// C'est le type des fonctions qui ne terminent jamais normalement

// Fonction qui lance toujours une erreur
// Elle ne retourne jamais : son type de retour est never
function lancerErreur(message: string): never {
  throw new Error(message);
}

// Fonction avec une boucle infinie
// Elle ne retourne jamais non plus
function boucleInfinie(): never {
  while (true) {
    // Cette boucle ne s'arrête jamais
  }
}

// Utilisation pratique de never : vérification exhaustive
type Forme = "cercle" | "carre" | "triangle";

function calculerAire(forme: Forme): number {
  switch (forme) {
    case "cercle":
      return Math.PI * 10 * 10; // Rayon de 10
    case "carre":
      return 10 * 10; // Côté de 10
    case "triangle":
      return (10 * 5) / 2; // Base 10, hauteur 5
    default:
      // Si on arrive ici, c'est qu'on a oublié un cas
      // TypeScript vérifie que ce code est inatteignable
      const _verificationExhaustive: never = forme;
      throw new Error(`Forme non gérée : ${_verificationExhaustive}`);
  }
}

console.log("Aire cercle :", calculerAire("cercle"));
console.log("Aire carré :", calculerAire("carre"));
console.log("Aire triangle :", calculerAire("triangle"));

// Test de la fonction lancerErreur
try {
  lancerErreur("Quelque chose a mal tourné");
} catch (erreur) {
  if (erreur instanceof Error) {
    console.log("Erreur attrapée :", erreur.message);
  }
}
```

Compile et exécute :

```bash
npx tsc && node dist/type-never.js
```

**Résultat attendu** :

```text
Aire cercle : 314.1592653589793
Aire carré : 100
Aire triangle : 25
Erreur attrapée : Quelque chose a mal tourné
```

---

### Étape 6 : Les types `any` et `unknown`

Crée un fichier `src/any-unknown.ts` :

```typescript
// src/any-unknown.ts
// any et unknown sont deux types spéciaux

// ===== ANY =====
// any désactive TOUTES les vérifications de type
// C'est comme revenir en JavaScript pur
// À ÉVITER autant que possible

let valeurAny: any = "texte";
valeurAny = 42; // Pas d'erreur : any accepte tout
valeurAny = true; // Pas d'erreur
valeurAny = { nom: "test" }; // Pas d'erreur

// Danger : any permet des opérations absurdes sans erreur
// valeurAny.methodeQuiNExistePas(); // Pas d'erreur à la compilation !
// valeurAny.propriete.sousPropriete; // Pas d'erreur à la compilation !
// Ces lignes causeraient une erreur à l'EXÉCUTION

console.log("valeurAny :", valeurAny);

// ===== UNKNOWN =====
// unknown est l'alternative SÛRE à any
// Une variable unknown peut contenir n'importe quelle valeur
// MAIS on doit vérifier son type avant de l'utiliser

let valeurUnknown: unknown = "texte";
valeurUnknown = 42; // OK : unknown accepte tout
valeurUnknown = true; // OK

// La différence avec any : on ne peut PAS utiliser unknown directement
// console.log(valeurUnknown.length); // Erreur : Object is of type 'unknown'

// Il faut d'abord vérifier le type
if (typeof valeurUnknown === "string") {
  // Ici TypeScript sait que c'est un string
  console.log("Longueur :", valeurUnknown.length);
}

if (typeof valeurUnknown === "number") {
  // Ici TypeScript sait que c'est un number
  console.log("Double :", valeurUnknown * 2);
}

// Exemple pratique : traitement de données JSON
function traiterDonnees(donnees: unknown): string {
  // On doit vérifier le type avant d'utiliser les données
  if (typeof donnees === "string") {
    return `Texte reçu : ${donnees}`;
  }
  if (typeof donnees === "number") {
    return `Nombre reçu : ${donnees}`;
  }
  if (typeof donnees === "boolean") {
    return `Booléen reçu : ${donnees}`;
  }
  return "Type non géré";
}

console.log(traiterDonnees("hello"));
console.log(traiterDonnees(42));
console.log(traiterDonnees(true));

// Quand utiliser any vs unknown :
// any  → migration de JavaScript vers TypeScript (temporaire)
// unknown → données dont on ne connaît pas le type à l'avance
```

Compile et exécute :

```bash
npx tsc && node dist/any-unknown.js
```

**Résultat attendu** :

```text
valeurAny : { nom: 'test' }
Texte reçu : hello
Nombre reçu : 42
Booléen reçu : true
```

---

### Étape 7 : Annotations de type dans les fonctions

Crée un fichier `src/fonctions-types.ts` :

```typescript
// src/fonctions-types.ts
// Annotations de type sur les paramètres et valeurs de retour

// Fonction avec types sur les paramètres ET la valeur de retour
function additionner(a: number, b: number): number {
  return a + b;
}

// TypeScript peut inférer le type de retour, mais l'expliciter est recommandé
// Cela sert de documentation et détecte les erreurs plus tôt
function formater(valeur: number, decimales: number): string {
  return valeur.toFixed(decimales);
}

// Fonction avec paramètre optionnel
function creerSalutation(nom: string, formel?: boolean): string {
  // formel est optionnel : son type est boolean | undefined
  if (formel) {
    return `Bonjour Monsieur/Madame ${nom}`;
  }
  return `Salut ${nom}`;
}

// Fonction avec valeur par défaut
function repeter(texte: string, fois: number = 1): string {
  // fois a une valeur par défaut de 1
  // Son type est inféré comme number grâce à la valeur par défaut
  let resultat = "";
  for (let i = 0; i < fois; i++) {
    resultat += texte + " ";
  }
  return resultat.trim();
}

// Tests
console.log("Addition :", additionner(10, 5));
console.log("Formaté :", formater(3.14159, 2));
console.log("Informel :", creerSalutation("Alice"));
console.log("Formel :", creerSalutation("Dupont", true));
console.log("Répéter 1x :", repeter("hey"));
console.log("Répéter 3x :", repeter("hey", 3));
```

Compile et exécute :

```bash
npx tsc && node dist/fonctions-types.js
```

**Résultat attendu** :

```text
Addition : 15
Formaté : 3.14
Informel : Salut Alice
Formel : Bonjour Monsieur/Madame Dupont
Répéter 1x : hey
Répéter 3x : hey hey hey
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc --noEmit` | Vérifie les types sans générer de fichier JavaScript |
| `npx tsc && node dist/fichier.js` | Compile puis exécute en une seule commande |
| `node src/fichier.ts` ou `npx tsx src/fichier.ts` | Node 22.18+ : TS effaçable ; tsx pour enums/namespaces |

---

## Pièges Fréquents

### Piège 1 : Utiliser `any` par facilité

**Problème** : Quand TypeScript signale une erreur de type, il est tentant de mettre `any` pour faire disparaître l'erreur.

```typescript
// Ne fais PAS ceci
function traiter(donnees: any) {
  // Plus aucune vérification de type
  return donnees.proprieteQuiNExistePas();
}
```

**Solution** : Utilise `unknown` et ajoute des vérifications de type. Ou déclare le type exact attendu.

```typescript
// Fais plutôt ceci
function traiter(donnees: unknown): string {
  if (typeof donnees === "string") {
    return donnees.toUpperCase();
  }
  return String(donnees);
}
```

---

### Piège 2 : Confondre `null` et `undefined`

**Problème** : Utiliser `null` et `undefined` de manière interchangeable.

```typescript
let valeur: string | null = undefined; // Erreur : undefined n'est pas null
```

**Solution** : `null` signifie "volontairement vide". `undefined` signifie "pas encore défini". Utilise le bon type selon le contexte.

```typescript
// null = explicitement vide
let utilisateurConnecte: string | null = null;

// undefined = pas encore défini (ou paramètre optionnel)
let resultatRecherche: string | undefined = undefined;
```

---

### Piège 3 : Oublier la vérification de `null`

**Problème** : Accéder à une propriété d'une valeur qui peut être `null`.

```typescript
function longueur(texte: string | null): number {
  // Erreur : texte peut être null, null n'a pas de propriété length
  return texte.length;
}
```

**Solution** : Vérifier que la valeur n'est pas `null` avant de l'utiliser.

```typescript
function longueur(texte: string | null): number {
  if (texte === null) {
    return 0;
  }
  // Ici TypeScript sait que texte est un string (pas null)
  return texte.length;
}
```

---

### Piège 4 : Croire que `void` et `undefined` sont identiques

**Problème** : Utiliser `void` et `undefined` de la même façon.

**Solution** : `void` est le type de retour des fonctions qui ne retournent rien. `undefined` est une valeur concrète. Une fonction `void` retourne implicitement `undefined`, mais les deux types ne sont pas interchangeables dans tous les contextes.

```typescript
// void : la fonction ne retourne rien intentionnellement
function logger(message: string): void {
  console.log(message);
}

// undefined : la fonction retourne explicitement undefined
function trouver(id: number): string | undefined {
  if (id === 1) return "Alice";
  return undefined; // Explicitement retourné
}
```

---

## Checklist de Validation

- [ ] Je sais utiliser les types `string`, `number` et `boolean`
- [ ] Je comprends la différence entre annotation explicite et inférence de type
- [ ] Je sais quand utiliser `null` et quand utiliser `undefined`
- [ ] Je comprends le type `void` pour les fonctions sans valeur de retour
- [ ] Je comprends le type `never` pour les fonctions qui ne retournent jamais
- [ ] Je connais la différence entre `any` et `unknown` et je sais pourquoi `unknown` est préférable
- [ ] Je sais annoter les paramètres et les valeurs de retour des fonctions

---

## Exercice Pratique

**Énoncé** : Crée un fichier `src/profil.ts` qui contient :

1. Une fonction `creerProfil` qui prend un `nom` (string), un `age` (number) et un `email` optionnel (string) et retourne un string décrivant le profil
2. Une fonction `validerAge` qui prend une valeur `unknown` et retourne un `number` si c'est un nombre valide entre 0 et 150, ou lance une erreur sinon
3. Une fonction `afficherProfil` qui prend un `nom` (string | null) et affiche le nom ou "Anonyme" si null

**Indications** :

- Utilise `typeof` pour vérifier le type dans `validerAge`
- Utilise une vérification `=== null` dans `afficherProfil`
- Pense aux cas limites (âge négatif, âge > 150)

**Résultat attendu** :

```text
Alice, 25 ans, email: alice@test.fr
Bob, 30 ans, pas d'email
Âge valide : 25
Profil : Alice
Profil : Anonyme
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/profil.ts

// Fonction 1 : créer un profil avec email optionnel
function creerProfil(nom: string, age: number, email?: string): string {
  // email est optionnel (string | undefined)
  if (email !== undefined) {
    return `${nom}, ${age} ans, email: ${email}`;
  }
  return `${nom}, ${age} ans, pas d'email`;
}

// Fonction 2 : valider un âge de type inconnu
function validerAge(valeur: unknown): number {
  // Étape 1 : vérifier que c'est un nombre
  if (typeof valeur !== "number") {
    throw new Error(`L'âge doit être un nombre, reçu : ${typeof valeur}`);
  }

  // Étape 2 : vérifier que c'est un nombre entier
  if (!Number.isInteger(valeur)) {
    throw new Error(`L'âge doit être un entier, reçu : ${valeur}`);
  }

  // Étape 3 : vérifier que c'est dans la plage valide
  if (valeur < 0 || valeur > 150) {
    throw new Error(`L'âge doit être entre 0 et 150, reçu : ${valeur}`);
  }

  // Ici TypeScript sait que valeur est un number valide
  return valeur;
}

// Fonction 3 : afficher un profil avec nom potentiellement null
function afficherProfil(nom: string | null): void {
  if (nom === null) {
    console.log("Profil : Anonyme");
  } else {
    // Ici TypeScript sait que nom est un string (pas null)
    console.log(`Profil : ${nom}`);
  }
}

// Tests
console.log(creerProfil("Alice", 25, "alice@test.fr"));
console.log(creerProfil("Bob", 30));

try {
  const age = validerAge(25);
  console.log("Âge valide :", age);
} catch (erreur) {
  if (erreur instanceof Error) {
    console.log("Erreur :", erreur.message);
  }
}

afficherProfil("Alice");
afficherProfil(null);
```

Compile et exécute :

```bash
npx tsc && node dist/profil.js
```

**Résultat attendu** :

```text
Alice, 25 ans, email: alice@test.fr
Bob, 30 ans, pas d'email
Âge valide : 25
Profil : Alice
Profil : Anonyme
```

---

## Navigation

← Fiche précédente : **[02 - Installation et configuration](02-installation-configuration.md)**

→ Fiche suivante : **[04 - Tableaux et tuples](04-tableaux-tuples.md)**
