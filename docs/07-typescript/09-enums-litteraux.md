---
tags:
  - TypeScript
  - Intermédiaire
  - Concept
description: "Maîtriser les enums numériques, string, const enums, les types littéraux et template literal types."
estimated_time: "60 min"
fiche_number: 9
total_fiches: 15
cursus: "TypeScript"
---

# 09 - Enums et littéraux

> **En bref** : Apprendre à utiliser les enums numériques et string, les const enums, les types littéraux et les template literal types. Lecture estimée : 60 min.

## Prérequis

- [06 - Types union et intersection](06-types-union-intersection.md)
- [08 - Classes et héritage](08-classes-heritage.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les enums numériques et string, les const enums pour l'optimisation, les literal types pour restreindre les valeurs, et `as const` pour créer des objets immuables.

---

## Concepts

### Qu'est-ce qu'un enum ?

**Définition** : Un enum (énumération) est un ensemble nommé de constantes. Il permet de donner des noms lisibles à un ensemble de valeurs liées. TypeScript prend en charge les enums numériques (valeurs = nombres) et les enums string (valeurs = chaînes).

**Le problème que les enums résolvent** :

Sans enums, voici les problèmes rencontrés :

1. **Constantes magiques** : Le code est rempli de nombres ou chaînes dont la signification n'est pas claire. `if (statut === 3)` ne dit pas ce que représente `3`.
2. **Erreurs de saisie** : Utiliser des chaînes comme `"pending"`, `"pendng"` (faute de frappe) n'est pas détecté.
3. **Pas de regroupement** : Les constantes liées (statuts d'une commande, jours de la semaine) ne sont pas regroupées logiquement.

**Comment les enums résolvent ces problèmes** :

| Problème | Solution apportée par les enums |
| -------- | ------------------------------- |
| Constantes magiques | Les valeurs ont des noms explicites (`Statut.EnCours`) |
| Erreurs de saisie | TypeScript vérifie que la valeur appartient à l'enum |
| Pas de regroupement | Toutes les valeurs liées sont dans un même enum |

**Analogie concrète** : Un enum est comme un sélecteur de taille sur un site de vêtements. Au lieu de taper la taille manuellement (risque de faute), tu choisis parmi les options proposées : XS, S, M, L, XL. Le système n'accepte que ces valeurs, et chacune a une signification claire.

**Ce qu'un enum n'est PAS** :

- Un enum n'est pas un objet JavaScript classique. Il est compilé en un objet spécial avec des correspondances bidirectionnelles (pour les enums numériques).
- Un enum n'est pas un type union de littéraux, même si les deux se ressemblent. Les enums existent à l'exécution, les types union disparaissent.

---

### Qu'est-ce qu'un type littéral ?

**Définition** : Un type littéral est un type qui accepte une seule valeur spécifique. Au lieu de `string` (n'importe quelle chaîne), `"rouge"` accepte uniquement la chaîne `"rouge"`. Les types littéraux sont souvent combinés en unions pour créer des ensembles de valeurs autorisées.

**Le problème que les types littéraux résolvent** :

Sans types littéraux, voici les problèmes rencontrés :

1. **Types trop larges** : `string` accepte n'importe quelle chaîne, même celles qui n'ont pas de sens dans le contexte.
2. **Validation manuelle** : Il faut écrire du code pour vérifier que la valeur est parmi les valeurs autorisées.

**Comment les types littéraux résolvent ces problèmes** :

| Problème | Solution apportée par les types littéraux |
| -------- | ----------------------------------------- |
| Types trop larges | Seules les valeurs spécifiées sont acceptées |
| Validation manuelle | TypeScript vérifie automatiquement à la compilation |

**Comparaison enums vs types littéraux** :

| Enums | Types littéraux |
| ----- | --------------- |
| Existent à l'exécution | Disparaissent à la compilation |
| `enum Direction { Nord, Sud }` | `type Direction = "nord" \| "sud"` |
| Ajoutent du code JavaScript | Aucun code JavaScript ajouté |
| Support de la correspondance bidirectionnelle | Pas de correspondance bidirectionnelle |
| Regroupement formel | Union de valeurs |

---

## Étapes Pratiques

### Étape 1 : Enums numériques

Crée un fichier `src/enums-numeriques.ts` :

```typescript
// src/enums-numeriques.ts
// Les enums numériques assignent automatiquement des valeurs 0, 1, 2...

// Enum numérique simple
enum Direction {
  Nord, // 0
  Est, // 1
  Sud, // 2
  Ouest, // 3
}

// Utilisation
const maDirection: Direction = Direction.Nord;
console.log("Direction :", maDirection); // Affiche 0
console.log("Nom :", Direction[maDirection]); // Affiche "Nord" (correspondance inverse)

// Enum avec valeurs personnalisées
enum CodeHTTP {
  OK = 200,
  Created = 201,
  BadRequest = 400,
  Unauthorized = 401,
  NotFound = 404,
  InternalError = 500,
}

function traiterReponse(code: CodeHTTP): string {
  switch (code) {
    case CodeHTTP.OK:
      return "Succès";
    case CodeHTTP.Created:
      return "Ressource créée";
    case CodeHTTP.BadRequest:
      return "Requête invalide";
    case CodeHTTP.Unauthorized:
      return "Non autorisé";
    case CodeHTTP.NotFound:
      return "Non trouvé";
    case CodeHTTP.InternalError:
      return "Erreur serveur";
    default:
      return "Code inconnu";
  }
}

console.log("\n--- Codes HTTP ---");
console.log(`200 : ${traiterReponse(CodeHTTP.OK)}`);
console.log(`404 : ${traiterReponse(CodeHTTP.NotFound)}`);
console.log(`500 : ${traiterReponse(CodeHTTP.InternalError)}`);

// Enum avec auto-incrémentation partielle
enum Priorite {
  Basse = 1,
  Normale, // 2 (auto-incrémenté)
  Haute, // 3
  Critique = 10,
  Urgente, // 11 (auto-incrémenté depuis 10)
}

console.log("\n--- Priorités ---");
console.log("Basse :", Priorite.Basse);
console.log("Normale :", Priorite.Normale);
console.log("Haute :", Priorite.Haute);
console.log("Critique :", Priorite.Critique);
console.log("Urgente :", Priorite.Urgente);
```

Compile et exécute :

```bash
npx tsc && node dist/enums-numeriques.js
```

**Résultat attendu** :

```text
Direction : 0
Nom : Nord

--- Codes HTTP ---
200 : Succès
404 : Non trouvé
500 : Erreur serveur

--- Priorités ---
Basse : 1
Normale : 2
Haute : 3
Critique : 10
Urgente : 11
```

---

### Étape 2 : Enums string

Crée un fichier `src/enums-string.ts` :

```typescript
// src/enums-string.ts
// Les enums string : chaque valeur est une chaîne explicite

enum Couleur {
  Rouge = "rouge",
  Vert = "vert",
  Bleu = "bleu",
  Jaune = "jaune",
  Blanc = "blanc",
  Noir = "noir",
}

// Les enums string n'ont PAS de correspondance inverse
// Couleur["rouge"] ne fonctionne pas
console.log("Couleur :", Couleur.Rouge); // "rouge"

// Enum string pour les statuts d'une tâche
enum StatutTache {
  AFaire = "a_faire",
  EnCours = "en_cours",
  EnRevue = "en_revue",
  Terminee = "terminee",
  Annulee = "annulee",
}

interface Tache {
  id: number;
  titre: string;
  statut: StatutTache;
  couleur: Couleur;
}

function afficherTache(tache: Tache): void {
  const icones: Record<StatutTache, string> = {
    [StatutTache.AFaire]: "[ ]",
    [StatutTache.EnCours]: "[~]",
    [StatutTache.EnRevue]: "[?]",
    [StatutTache.Terminee]: "[x]",
    [StatutTache.Annulee]: "[-]",
  };

  const icone: string = icones[tache.statut];
  console.log(`  ${icone} #${tache.id} ${tache.titre} (${tache.couleur})`);
}

const taches: Tache[] = [
  { id: 1, titre: "Installer TypeScript", statut: StatutTache.Terminee, couleur: Couleur.Vert },
  { id: 2, titre: "Apprendre les enums", statut: StatutTache.EnCours, couleur: Couleur.Bleu },
  { id: 3, titre: "Créer le projet", statut: StatutTache.AFaire, couleur: Couleur.Rouge },
  { id: 4, titre: "Ancienne tâche", statut: StatutTache.Annulee, couleur: Couleur.Noir },
];

console.log("Tâches :");
taches.forEach(afficherTache);

// Filtrer par statut
const enCours: Tache[] = taches.filter(
  (t: Tache): boolean => t.statut === StatutTache.EnCours
);
console.log(`\nTâches en cours : ${enCours.length}`);
```

Compile et exécute :

```bash
npx tsc && node dist/enums-string.js
```

**Résultat attendu** :

```text
Couleur : rouge
Tâches :
  [x] #1 Installer TypeScript (vert)
  [~] #2 Apprendre les enums (bleu)
  [ ] #3 Créer le projet (rouge)
  [-] #4 Ancienne tâche (noir)

Tâches en cours : 1
```

---

### Étape 3 : Const enums

Crée un fichier `src/const-enums.ts` :

```typescript
// src/const-enums.ts
// const enum : optimisation, remplacé par les valeurs lors de la compilation

// Enum classique : crée un objet JavaScript à l'exécution
enum DirectionClassique {
  Nord = "N",
  Sud = "S",
  Est = "E",
  Ouest = "O",
}

// const enum : les valeurs sont injectées directement (inline)
// Aucun objet n'est créé à l'exécution
const enum DirectionConst {
  Nord = "N",
  Sud = "S",
  Est = "E",
  Ouest = "O",
}

// À la compilation :
// DirectionClassique.Nord → DirectionClassique.Nord (référence à l'objet)
// DirectionConst.Nord → "N" (valeur directe, inline)

const dir1: string = DirectionClassique.Nord;
const dir2: string = DirectionConst.Nord;

console.log("Classique :", dir1);
console.log("Const :", dir2);

// const enum pour les rôles utilisateur
const enum Role {
  Admin = "ADMIN",
  Editeur = "EDITEUR",
  Lecteur = "LECTEUR",
  Invite = "INVITE",
}

interface Utilisateur {
  nom: string;
  role: Role;
}

function aAcces(utilisateur: Utilisateur, roleMinimum: Role): boolean {
  const hierarchie: Record<Role, number> = {
    [Role.Admin]: 4,
    [Role.Editeur]: 3,
    [Role.Lecteur]: 2,
    [Role.Invite]: 1,
  };

  return hierarchie[utilisateur.role] >= hierarchie[roleMinimum];
}

const alice: Utilisateur = { nom: "Alice", role: Role.Admin };
const bob: Utilisateur = { nom: "Bob", role: Role.Lecteur };

console.log("\n--- Accès ---");
console.log(`Alice (Admin) peut éditer : ${aAcces(alice, Role.Editeur)}`);
console.log(`Bob (Lecteur) peut éditer : ${aAcces(bob, Role.Editeur)}`);
console.log(`Bob (Lecteur) peut lire : ${aAcces(bob, Role.Lecteur)}`);
```

Compile et exécute :

```bash
npx tsc && node dist/const-enums.js
```

**Résultat attendu** :

```text
Classique : N
Const : N

--- Accès ---
Alice (Admin) peut éditer : true
Bob (Lecteur) peut éditer : false
Bob (Lecteur) peut lire : true
```

---

### Étape 4 : Types littéraux

Crée un fichier `src/literal-types.ts` :

```typescript
// src/literal-types.ts
// Types littéraux : restreindre les valeurs possibles

// Type littéral string
type Taille = "xs" | "s" | "m" | "l" | "xl";

function decrireTaille(taille: Taille): string {
  const descriptions: Record<Taille, string> = {
    xs: "Très petit",
    s: "Petit",
    m: "Moyen",
    l: "Grand",
    xl: "Très grand",
  };
  return descriptions[taille];
}

console.log("Taille m :", decrireTaille("m"));
// decrireTaille("xxl"); // Erreur : "xxl" n'est pas dans Taille

// Type littéral number
type De = 1 | 2 | 3 | 4 | 5 | 6;

function lancerDe(): De {
  return (Math.floor(Math.random() * 6) + 1) as De;
}

const resultat: De = lancerDe();
console.log("Dé :", resultat);

// Type littéral boolean (moins utile, mais existe)
type Vrai = true;
const confirmation: Vrai = true;
// const refus: Vrai = false; // Erreur : false n'est pas assignable à true

// Combinaison de types littéraux avec des objets
type Evenement =
  | { type: "click"; x: number; y: number }
  | { type: "keypress"; touche: string }
  | { type: "scroll"; direction: "haut" | "bas" };

function traiterEvenement(event: Evenement): string {
  switch (event.type) {
    case "click":
      return `Click à (${event.x}, ${event.y})`;
    case "keypress":
      return `Touche pressée : ${event.touche}`;
    case "scroll":
      return `Défilement vers le ${event.direction}`;
  }
}

console.log("\n--- Événements ---");
console.log(traiterEvenement({ type: "click", x: 100, y: 200 }));
console.log(traiterEvenement({ type: "keypress", touche: "Enter" }));
console.log(traiterEvenement({ type: "scroll", direction: "haut" }));
```

Compile et exécute :

```bash
npx tsc && node dist/literal-types.js
```

**Résultat attendu** :

```text
Taille m : Moyen
Dé : 4
--- Événements ---
Click à (100, 200)
Touche pressée : Enter
Défilement vers le haut
```

---

### Étape 5 : `as const` et objets immuables

Crée un fichier `src/as-const.ts` :

```typescript
// src/as-const.ts
// as const rend un objet ou un tableau complètement readonly et littéral

// Sans as const : types larges
const config1 = {
  theme: "sombre",
  port: 3000,
  debug: false,
};
// Type inféré : { theme: string; port: number; debug: boolean }
// theme peut être n'importe quel string

// Avec as const : types littéraux et readonly
const config2 = {
  theme: "sombre",
  port: 3000,
  debug: false,
} as const;
// Type inféré : { readonly theme: "sombre"; readonly port: 3000; readonly debug: false }
// theme est exactement "sombre", pas n'importe quel string

console.log("Config :", config2.theme);
// config2.theme = "clair"; // Erreur : Cannot assign to 'theme' (readonly)

// as const avec un tableau
const DIRECTIONS = ["nord", "sud", "est", "ouest"] as const;
// Type : readonly ["nord", "sud", "est", "ouest"]

// Créer un type à partir d'un tableau as const
type Direction = (typeof DIRECTIONS)[number];
// Type : "nord" | "sud" | "est" | "ouest"

function seDeplacer(direction: Direction): void {
  console.log(`Se déplacer vers le ${direction}`);
}

seDeplacer("nord"); // OK
// seDeplacer("haut"); // Erreur : "haut" n'est pas dans Direction

// as const avec un objet de configuration
const CODES_ERREUR = {
  NON_TROUVE: 404,
  NON_AUTORISE: 401,
  ERREUR_SERVEUR: 500,
  SUCCES: 200,
} as const;

type CodeErreur = (typeof CODES_ERREUR)[keyof typeof CODES_ERREUR];
// Type : 404 | 401 | 500 | 200

function messageErreur(code: CodeErreur): string {
  switch (code) {
    case CODES_ERREUR.SUCCES:
      return "Opération réussie";
    case CODES_ERREUR.NON_TROUVE:
      return "Ressource non trouvée";
    case CODES_ERREUR.NON_AUTORISE:
      return "Accès refusé";
    case CODES_ERREUR.ERREUR_SERVEUR:
      return "Erreur interne du serveur";
  }
}

console.log("\n--- Codes d'erreur ---");
console.log(`404 : ${messageErreur(CODES_ERREUR.NON_TROUVE)}`);
console.log(`200 : ${messageErreur(CODES_ERREUR.SUCCES)}`);

// Enum-like pattern avec as const
const Statut = {
  Actif: "actif",
  Inactif: "inactif",
  Suspendu: "suspendu",
} as const;

type StatutType = (typeof Statut)[keyof typeof Statut];
// Type : "actif" | "inactif" | "suspendu"

// Cette approche est souvent préférée aux enums car :
// 1. Aucun code JavaScript supplémentaire
// 2. Fonctionne avec les unions de types
// 3. Compatible avec les outils de build (tree-shaking)

function afficherStatut(statut: StatutType): void {
  console.log(`Statut : ${statut}`);
}

afficherStatut(Statut.Actif);
afficherStatut(Statut.Suspendu);
```

Compile et exécute :

```bash
npx tsc && node dist/as-const.js
```

**Résultat attendu** :

```text
Config : sombre
Se déplacer vers le nord

--- Codes d'erreur ---
404 : Ressource non trouvée
200 : Opération réussie
Statut : actif
Statut : suspendu
```

---

### Étape 6 : Template literal types

Crée un fichier `src/template-literal.ts` :

```typescript
// src/template-literal.ts
// Template literal types : créer des types string à partir de patterns

// Template literal type simple
type Salutation = `Bonjour ${string}`;

const salut1: Salutation = "Bonjour Alice"; // OK
const salut2: Salutation = "Bonjour Bob"; // OK
// const salut3: Salutation = "Au revoir Alice"; // Erreur

// Combinaison de types littéraux dans un template
type Couleur = "rouge" | "vert" | "bleu";
type Taille = "petit" | "moyen" | "grand";
type ClasseCSS = `${Taille}-${Couleur}`;
// Résultat : "petit-rouge" | "petit-vert" | "petit-bleu"
//          | "moyen-rouge" | "moyen-vert" | "moyen-bleu"
//          | "grand-rouge" | "grand-vert" | "grand-bleu"

const classe: ClasseCSS = "petit-rouge"; // OK
// const classeErreur: ClasseCSS = "enorme-jaune"; // Erreur

console.log("Classe CSS :", classe);

// Événements typés avec template literals
type Element = "bouton" | "lien" | "formulaire";
type Action = "click" | "hover" | "submit";
type NomEvenement = `${Element}:${Action}`;

function ecouterEvenement(nom: NomEvenement, callback: () => void): void {
  console.log(`  Écoute de "${nom}" enregistrée`);
  callback();
}

console.log("\n--- Événements ---");
ecouterEvenement("bouton:click", () => {
  console.log("  → Bouton cliqué");
});
ecouterEvenement("formulaire:submit", () => {
  console.log("  → Formulaire soumis");
});

// Utility types pour manipuler les chaînes
type MajusculesType = Uppercase<Couleur>;
// "ROUGE" | "VERT" | "BLEU"

type MinusculesType = Lowercase<"HELLO" | "WORLD">;
// "hello" | "world"

type CapitalizeType = Capitalize<Couleur>;
// "Rouge" | "Vert" | "Bleu"

const maj: MajusculesType = "ROUGE";
const cap: CapitalizeType = "Vert";

console.log("\n--- String utilities ---");
console.log("Majuscules :", maj);
console.log("Capitalize :", cap);
```

Compile et exécute :

```bash
npx tsc && node dist/template-literal.js
```

**Résultat attendu** :

```text
Classe CSS : petit-rouge

--- Événements ---
  Écoute de "bouton:click" enregistrée
  → Bouton cliqué
  Écoute de "formulaire:submit" enregistrée
  → Formulaire soumis

--- String utilities ---
Majuscules : ROUGE
Capitalize : Vert
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `npx tsc && node dist/fichier.js` | Compile puis exécute |
| `npx tsc --noEmit` | Vérifie les types sans compiler |
| `node src/fichier.ts` ou `npx tsx src/fichier.ts` | Node 22.18+ : TS effaçable ; tsx pour enums/namespaces |

---

## Pièges Fréquents

### Piège 1 : Les enums numériques acceptent n'importe quel nombre

**Problème** : TypeScript ne vérifie pas que la valeur numérique appartient réellement à l'enum.

```typescript
enum Direction {
  Nord,
  Sud,
}
const d: Direction = 42; // Pas d'erreur ! 42 n'est pas dans l'enum
```

**Solution** : Utilise des enums string ou des types littéraux, qui sont plus stricts.

```typescript
enum Direction {
  Nord = "nord",
  Sud = "sud",
}
// const d: Direction = "est"; // Erreur : "est" n'est pas dans Direction
```

---

### Piège 2 : Les const enums ne sont pas accessibles dynamiquement

**Problème** : On ne peut pas accéder à un const enum par une variable.

```typescript
const enum Couleur {
  Rouge = "rouge",
}
// const cle = "Rouge";
// Couleur[cle]; // Erreur avec const enum
```

**Solution** : Utilise un enum classique si tu as besoin d'un accès dynamique, ou utilise un objet `as const`.

---

### Piège 3 : Confondre enum et type union

**Problème** : Utiliser un enum quand un type union suffit, ajoutant du code JavaScript inutile.

**Solution** : Si tu n'as pas besoin de l'enum à l'exécution (pas de correspondance inverse, pas d'itération), utilise un type union ou un objet `as const`.

```typescript
// Préfère ceci (aucun code JS généré)
type Direction = "nord" | "sud" | "est" | "ouest";

// À ceci (crée un objet JS)
enum DirectionEnum {
  Nord = "nord",
  Sud = "sud",
  Est = "est",
  Ouest = "ouest",
}
```

---

## Checklist de Validation

- [ ] Je sais créer un enum numérique et un enum string
- [ ] Je comprends la correspondance inverse des enums numériques
- [ ] Je sais utiliser `const enum` pour l'optimisation
- [ ] Je sais créer des types littéraux (string, number, boolean)
- [ ] Je sais combiner des types littéraux en union
- [ ] Je sais utiliser `as const` pour créer des objets immuables typés
- [ ] Je comprends les template literal types
- [ ] Je sais choisir entre enum, type union et `as const`

---

## Exercice Pratique

**Énoncé** : Crée un système de thème d'application avec enums et types littéraux :

1. Crée un objet `as const` pour les thèmes (`clair`, `sombre`, `auto`)
2. Crée un type `Theme` à partir de cet objet
3. Crée un objet `as const` pour les tailles de police (`petit` = 12, `normal` = 16, `grand` = 20)
4. Crée un type `TaillePolice` à partir de cet objet
5. Crée un template literal type `ClasseTheme` qui combine thème et taille : `"theme-{theme}-{taille}"`
6. Crée une fonction `appliquerTheme` qui prend un thème et une taille et retourne la classe CSS

**Indications** :

- Utilise `typeof` et `keyof` pour extraire les types
- Le template literal type combine les valeurs des deux objets

**Résultat attendu** :

```text
Classe : theme-sombre-grand
Classe : theme-clair-normal
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```typescript
// src/theme.ts

const THEMES = {
  clair: "clair",
  sombre: "sombre",
  auto: "auto",
} as const;

type Theme = (typeof THEMES)[keyof typeof THEMES];

const TAILLES_POLICE = {
  petit: 12,
  normal: 16,
  grand: 20,
} as const;

type TailleNom = keyof typeof TAILLES_POLICE;

type ClasseTheme = `theme-${Theme}-${TailleNom}`;

function appliquerTheme(theme: Theme, taille: TailleNom): ClasseTheme {
  const classe: ClasseTheme = `theme-${theme}-${taille}`;
  const pixelsTaille: number = TAILLES_POLICE[taille];
  console.log(`Classe : ${classe} (police: ${pixelsTaille}px)`);
  return classe;
}

appliquerTheme(THEMES.sombre, "grand");
appliquerTheme(THEMES.clair, "normal");
```

Compile et exécute :

```bash
npx tsc && node dist/theme.js
```

**Résultat attendu** :

```text
Classe : theme-sombre-grand (police: 20px)
Classe : theme-clair-normal (police: 16px)
```

---

## Navigation

← Fiche précédente : **[08 - Classes et héritage](08-classes-heritage.md)**

→ Fiche suivante : **[10 - Generics](10-generics.md)**
