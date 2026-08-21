---
tags:
  - JavaScript
  - Débutant
  - Concept
description: "Maîtriser le destructuring d'objets et de tableaux, le rest operator et le spread operator en ES6+."
estimated_time: "75 min"
fiche_number: 3
total_fiches: 14
cursus: "JavaScript Moderne"
id: "web.javascript-modern.destructuring-spread"
course_id: "web.javascript-modern"
content_type: "lesson"
order: 3
---

# 03 - Destructuring et spread

> **En bref** : Apprendre à extraire des valeurs d'objets et de tableaux avec le destructuring, et à copier/fusionner des données avec le spread operator. Lecture estimée : 75 min.

## Prérequis

- Fiche 01 : [let, const et portée](01-let-const-portee.md)
- Fiche 02 : [Arrow functions et this](02-arrow-functions-this.md)
- Connaître les objets et les tableaux JavaScript

## Objectif de cette fiche

À la fin de cette fiche, tu sauras extraire des valeurs d'objets et de tableaux en une seule ligne, utiliser des valeurs par défaut, renommer des variables, et copier/fusionner des données avec le spread operator.

---

## Concepts

### Qu'est-ce que le destructuring ?

**Définition** : Le destructuring (ou décomposition) est une syntaxe ES6 qui permet d'extraire des valeurs d'un objet ou d'un tableau et de les assigner à des variables en une seule instruction.

**Le problème que le destructuring résout** :

Sans le destructuring, voici les problèmes rencontrés :

1. **Code répétitif** : pour extraire plusieurs propriétés d'un objet, il faut écrire une ligne par propriété (`const nom = objet.nom; const age = objet.age;`).
2. **Accès verbeux** : dans une fonction qui reçoit un objet, on répète `objet.propriete` à chaque utilisation.
3. **Paramètres de fonction positionnels** : on doit respecter l'ordre des paramètres, ce qui rend le code fragile.

**Comment le destructuring résout ces problèmes** :

| Problème | Solution apportée par le destructuring |
| -------- | -------------------------------------- |
| Code répétitif | Une seule ligne pour extraire plusieurs valeurs |
| Accès verbeux | Les propriétés deviennent des variables locales |
| Paramètres positionnels | On peut déstructurer un objet en paramètre de fonction |

**Analogie concrète** : Le destructuring est comme ouvrir une boîte à outils et poser chaque outil directement sur le plan de travail. Au lieu de chercher dans la boîte à chaque fois que tu as besoin d'un tournevis, tu le sors une fois pour toutes et tu l'as sous la main.

**Ce que le destructuring n'est PAS** :

- Le destructuring ne modifie pas l'objet ou le tableau d'origine. Il crée de nouvelles variables avec les valeurs extraites.
- Le destructuring n'est pas une copie profonde. Si une propriété est un objet, la variable pointe vers le même objet en mémoire.

---

### Destructuring d'objets

**Définition** : Le destructuring d'objets utilise des accolades `{}` pour extraire des propriétés par leur nom.

**Syntaxe de base** :

```javascript
// Sans destructuring - répétitif
const utilisateur = { nom: "Alice", age: 25, ville: "Paris" };
const nom = utilisateur.nom;
const age = utilisateur.age;
const ville = utilisateur.ville;

// Avec destructuring - une seule ligne
const { nom, age, ville } = utilisateur;
// Crée trois variables : nom = "Alice", age = 25, ville = "Paris"
```

**Valeurs par défaut** :

```javascript
// Si une propriété n'existe pas, la variable vaut undefined
const { nom, pays } = { nom: "Alice" };
console.log(pays); // undefined

// On peut définir une valeur par défaut
const { nom2, pays2 = "France" } = { nom2: "Alice" };
console.log(pays2); // "France" - la valeur par défaut est utilisée

// Si la propriété existe, la valeur par défaut est ignorée
const { nom3, pays3 = "France" } = { nom3: "Alice", pays3: "Belgique" };
console.log(pays3); // "Belgique" - la valeur de l'objet est utilisée
```

**Renommage de variables** :

```javascript
// Si le nom de la propriété ne convient pas, on peut le renommer
const reponseAPI = { user_name: "alice42", user_age: 25 };

// Syntaxe : { propriétéOrigine: nouveauNom }
const { user_name: nomUtilisateur, user_age: ageUtilisateur } = reponseAPI;
console.log(nomUtilisateur); // "alice42"
console.log(ageUtilisateur); // 25
```

**Destructuring imbriqué** :

```javascript
// On peut extraire des propriétés dans des objets imbriqués
const entreprise = {
  nom: "TechCorp",
  adresse: {
    rue: "10 rue de la Paix",
    ville: "Paris",
    codePostal: "75001",
  },
};

// Extraire la ville depuis l'objet imbriqué "adresse"
const {
  nom: nomEntreprise,
  adresse: { ville, codePostal },
} = entreprise;
console.log(nomEntreprise); // "TechCorp"
console.log(ville); // "Paris"
console.log(codePostal); // "75001"
```

---

### Destructuring de tableaux

**Définition** : Le destructuring de tableaux utilise des crochets `[]` pour extraire des éléments par leur position.

**Syntaxe de base** :

```javascript
// Sans destructuring
const couleurs = ["rouge", "vert", "bleu"];
const premiere = couleurs[0];
const deuxieme = couleurs[1];

// Avec destructuring - une seule ligne
const [premiere2, deuxieme2, troisieme] = couleurs;
console.log(premiere2); // "rouge"
console.log(deuxieme2); // "vert"
console.log(troisieme); // "bleu"
```

**Ignorer des éléments** :

```javascript
// On peut sauter des éléments avec des virgules
const jours = ["lundi", "mardi", "mercredi", "jeudi", "vendredi"];
const [, , mercredi] = jours; // Ignore lundi et mardi
console.log(mercredi); // "mercredi"

const [premier, , , quatrieme] = jours; // Ignore mardi et mercredi
console.log(premier); // "lundi"
console.log(quatrieme); // "jeudi"
```

**Valeurs par défaut** :

```javascript
// Si le tableau a moins d'éléments, la variable vaut undefined
const [a, b, c] = [1, 2];
console.log(c); // undefined

// On peut définir une valeur par défaut
const [x, y, z = 0] = [1, 2];
console.log(z); // 0
```

**Échange de variables** :

```javascript
// Échanger deux variables sans variable temporaire
let gauche = "A";
let droite = "B";
[gauche, droite] = [droite, gauche];
console.log(gauche); // "B"
console.log(droite); // "A"
```

**Comparaison destructuring d'objets vs de tableaux** :

| Destructuring d'objets `{}` | Destructuring de tableaux `[]` |
| --------------------------- | ------------------------------ |
| Extrait par nom de propriété | Extrait par position |
| L'ordre n'a pas d'importance | L'ordre est important |
| On doit connaître le nom exact | On doit connaître la position |
| `const { nom } = obj;` | `const [premier] = arr;` |

---

### Qu'est-ce que le rest operator (`...`) ?

**Définition** : Le rest operator (`...`) collecte les éléments restants d'un destructuring dans un tableau ou un objet. Il s'utilise en dernier dans le pattern de destructuring.

**Le problème que le rest operator résout** :

Sans le rest operator, voici les problèmes rencontrés :

1. **Extraction partielle** : on ne peut pas facilement séparer les premiers éléments du reste.
2. **Suppression de propriétés** : pour créer un objet sans certaines propriétés, il faut copier manuellement chaque propriété restante.

**Comment le rest operator résout ces problèmes** :

| Problème | Solution apportée par le rest operator |
| -------- | -------------------------------------- |
| Extraction partielle | `const [premier, ...reste] = tableau;` |
| Suppression de propriétés | `const { motDePasse, ...sansMdp } = utilisateur;` |

```javascript
// Rest dans un tableau : collecte les éléments restants
const [premier, deuxieme, ...reste] = [1, 2, 3, 4, 5];
console.log(premier); // 1
console.log(deuxieme); // 2
console.log(reste); // [3, 4, 5]

// Rest dans un objet : collecte les propriétés restantes
const { motDePasse, ...sansMotDePasse } = {
  nom: "Alice",
  email: "alice@example.com",
  motDePasse: "secret123",
};
console.log(sansMotDePasse); // { nom: "Alice", email: "alice@example.com" }
// "motDePasse" a été extrait séparément et n'est pas dans "sansMotDePasse"
```

**Analogie concrète** : Le rest operator est comme trier ton courrier. Tu prends les deux premières lettres (les plus urgentes) et tu mets le reste dans un bac "À traiter plus tard". Le bac contient tout ce que tu n'as pas pris individuellement.

---

### Qu'est-ce que le spread operator (`...`) ?

**Définition** : Le spread operator (`...`) étale les éléments d'un tableau ou les propriétés d'un objet dans un nouveau tableau ou objet. C'est le même symbole `...` que le rest, mais utilisé dans un contexte différent.

**Le problème que le spread operator résout** :

Sans le spread operator, voici les problèmes rencontrés :

1. **Copie de tableau** : `Array.prototype.slice()` ou une boucle manuelle.
2. **Fusion de tableaux** : `Array.prototype.concat()` avec une syntaxe verbeuse.
3. **Copie d'objet** : `Object.assign({}, objet)` avec une syntaxe peu lisible.
4. **Modification d'un objet** : pas de moyen simple de créer un objet modifié sans muter l'original.

**Comment le spread operator résout ces problèmes** :

| Problème | Solution apportée par le spread operator |
| -------- | ---------------------------------------- |
| Copie de tableau | `const copie = [...original];` |
| Fusion de tableaux | `const fusion = [...arr1, ...arr2];` |
| Copie d'objet | `const copie = { ...original };` |
| Modification d'objet | `const modifie = { ...original, prop: nouvelleValeur };` |

```javascript
// Spread sur un tableau
const fruits = ["pomme", "banane"];
const copie = [...fruits]; // Copie superficielle
const plusDeFruits = [...fruits, "cerise", "datte"]; // Ajout d'éléments
const fusion = [...fruits, ...["kiwi", "mangue"]]; // Fusion de deux tableaux

console.log(copie); // ["pomme", "banane"]
console.log(plusDeFruits); // ["pomme", "banane", "cerise", "datte"]
console.log(fusion); // ["pomme", "banane", "kiwi", "mangue"]

// Spread sur un objet
const base = { nom: "Alice", age: 25 };
const copieObj = { ...base }; // Copie superficielle
const modifie = { ...base, age: 26 }; // Copie avec modification
const enrichi = { ...base, ville: "Paris" }; // Copie avec ajout

console.log(copieObj); // { nom: "Alice", age: 25 }
console.log(modifie); // { nom: "Alice", age: 26 }
console.log(enrichi); // { nom: "Alice", age: 25, ville: "Paris" }
```

**Analogie concrète** : Le spread est comme photocopier un document. Tu obtiens une copie indépendante (`...original`). Tu peux ensuite annoter la copie (`{ ...original, note: "important" }`) sans toucher à l'original. Si le document contient une enveloppe avec d'autres documents (objet imbriqué), la photocopie ne copie que l'enveloppe, pas son contenu.

**Ce que le spread n'est PAS** :

- Le spread ne fait pas de copie profonde. Les objets imbriqués sont partagés par référence.
- Le spread n'est pas la même chose que `JSON.parse(JSON.stringify(obj))` qui fait une copie profonde (mais qui ne gère pas les fonctions ni les dates).

**Comparaison rest vs spread** :

| Rest (`...`) | Spread (`...`) |
| ------------ | -------------- |
| Collecte des éléments dans un tableau/objet | Étale les éléments d'un tableau/objet |
| Utilisé dans le destructuring (côté gauche) | Utilisé dans les expressions (côté droit) |
| `const [a, ...reste] = [1, 2, 3]` | `const copie = [...tableau]` |
| `const { x, ...autreProp } = obj` | `const copie = { ...obj }` |

---

### Copie superficielle vs copie profonde

**Définition** : Une copie superficielle (shallow copy) duplique les propriétés de premier niveau. Les objets imbriqués restent partagés par référence. Une copie profonde (deep copy) duplique tout, y compris les objets imbriqués.

```javascript
// Copie superficielle avec spread
const original = {
  nom: "Alice",
  adresse: { ville: "Paris", cp: "75001" },
};

const copie = { ...original };

// Modifier une propriété de premier niveau : pas d'impact sur l'original
copie.nom = "Bob";
console.log(original.nom); // "Alice" - pas modifié

// Modifier un objet imbriqué : impact sur l'original !
copie.adresse.ville = "Lyon";
console.log(original.adresse.ville); // "Lyon" - modifié car même référence

// Pour une copie profonde, utilise structuredClone (Node.js 17+)
const copieProfonde = structuredClone(original);
copieProfonde.adresse.ville = "Marseille";
console.log(original.adresse.ville); // "Lyon" - pas modifié
```

---

## Étapes Pratiques

### Étape 1 : Destructuring d'objets simple

Crée le fichier `03-destructuring.js` :

```javascript
// Destructuring d'objets - extraction de propriétés
const livre = {
  titre: "Le Petit Prince",
  auteur: "Antoine de Saint-Exupéry",
  annee: 1943,
  pages: 96,
};

// Extraire titre et auteur en une seule ligne
const { titre, auteur } = livre;
console.log(`"${titre}" par ${auteur}`);

// Extraire avec renommage
const { annee: anneePublication, pages: nombrePages } = livre;
console.log(`Publié en ${anneePublication}, ${nombrePages} pages`);

// Extraire avec valeur par défaut
const { editeur = "Inconnu" } = livre;
console.log(`Éditeur : ${editeur}`);
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
"Le Petit Prince" par Antoine de Saint-Exupéry
Publié en 1943, 96 pages
Éditeur : Inconnu
```

---

### Étape 2 : Destructuring dans les paramètres de fonction

```javascript
// Sans destructuring : on accède aux propriétés dans le corps
function afficherLivre1(livre) {
  console.log(`${livre.titre} (${livre.annee})`);
}

// Avec destructuring dans les paramètres : plus lisible
function afficherLivre2({ titre, annee, pages = "?" }) {
  console.log(`${titre} (${annee}) - ${pages} pages`);
}

const monLivre = { titre: "1984", annee: 1949, pages: 328 };
afficherLivre1(monLivre);
afficherLivre2(monLivre);

// Avec un livre sans le nombre de pages
afficherLivre2({ titre: "Le Procès", annee: 1925 });
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
1984 (1949)
1984 (1949) - 328 pages
Le Procès (1925) - ? pages
```

---

### Étape 3 : Destructuring de tableaux

```javascript
// Destructuring de tableaux - extraction par position
const coordonnees = [48.8566, 2.3522, "Paris"];

// Extraire les éléments par position
const [latitude, longitude, ville] = coordonnees;
console.log(`${ville} : ${latitude}°N, ${longitude}°E`);

// Ignorer des éléments
const rgb = [255, 128, 0];
const [rouge, , bleu] = rgb; // Ignore le vert (deuxième élément)
console.log(`Rouge : ${rouge}, Bleu : ${bleu}`);

// Échanger deux variables
let x = "premier";
let y = "second";
console.log(`Avant échange : x=${x}, y=${y}`);
[x, y] = [y, x];
console.log(`Après échange : x=${x}, y=${y}`);
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
Paris : 48.8566°N, 2.3522°E
Rouge : 255, Bleu : 0
Avant échange : x=premier, y=second
Après échange : x=second, y=premier
```

---

### Étape 4 : Rest operator

```javascript
// Rest avec tableaux
const notes = [18, 15, 12, 9, 7, 14];
const [meilleure, deuxieme, ...autresNotes] = notes;
console.log("Meilleure note :", meilleure);
console.log("Deuxième note :", deuxieme);
console.log("Autres notes :", autresNotes);

// Rest avec objets - utile pour exclure des propriétés
const utilisateur = {
  id: 42,
  nom: "Alice",
  email: "alice@example.com",
  motDePasse: "hash_secret",
  role: "admin",
};

// Extraire motDePasse séparément, garder le reste
const { motDePasse, id, ...profilPublic } = utilisateur;
console.log("Profil public :", profilPublic);
// { nom: "Alice", email: "alice@example.com", role: "admin" }

// Rest dans les paramètres de fonction
const calculerMoyenne = (premier, ...reste) => {
  const total = [premier, ...reste].reduce((acc, n) => acc + n, 0);
  return total / (reste.length + 1);
};
console.log("Moyenne :", calculerMoyenne(10, 15, 20));
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
Meilleure note : 18
Deuxième note : 15
Autres notes : [ 12, 9, 7, 14 ]
Profil public : { nom: 'Alice', email: 'alice@example.com', role: 'admin' }
Moyenne : 15
```

---

### Étape 5 : Spread operator sur les tableaux

```javascript
// Copie de tableau
const original = [1, 2, 3];
const copie = [...original];
copie.push(4);
console.log("Original :", original); // [1, 2, 3] - pas modifié
console.log("Copie :", copie); // [1, 2, 3, 4]

// Fusion de tableaux
const fruits = ["pomme", "banane"];
const legumes = ["carotte", "poireau"];
const aliments = [...fruits, ...legumes];
console.log("Aliments :", aliments);

// Insertion au milieu
const debut = [1, 2];
const fin = [8, 9];
const milieu = [4, 5, 6];
const complet = [...debut, 3, ...milieu, 7, ...fin];
console.log("Complet :", complet);

// Convertir un string en tableau de caractères
const lettres = [..."Bonjour"];
console.log("Lettres :", lettres);
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
Original : [ 1, 2, 3 ]
Copie : [ 1, 2, 3, 4 ]
Aliments : [ 'pomme', 'banane', 'carotte', 'poireau' ]
Complet : [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
Lettres : [ 'B', 'o', 'n', 'j', 'o', 'u', 'r' ]
```

---

### Étape 6 : Spread operator sur les objets

```javascript
// Copie d'objet
const configBase = {
  theme: "sombre",
  langue: "fr",
  notifications: true,
};

const maConfig = { ...configBase };
maConfig.theme = "clair";
console.log("Config base :", configBase); // theme reste "sombre"
console.log("Ma config :", maConfig); // theme est "clair"

// Fusion d'objets (les propriétés à droite écrasent celles à gauche)
const defauts = { couleur: "bleu", taille: "M", quantite: 1 };
const choixUtilisateur = { taille: "L", quantite: 3 };
const commande = { ...defauts, ...choixUtilisateur };
console.log("Commande :", commande);
// { couleur: "bleu", taille: "L", quantite: 3 }

// Mise à jour immutable (pattern très fréquent)
const etat = { compteur: 5, nom: "test", actif: true };
const nouvelEtat = { ...etat, compteur: etat.compteur + 1 };
console.log("Ancien état :", etat);
console.log("Nouvel état :", nouvelEtat);
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
Config base : { theme: 'sombre', langue: 'fr', notifications: true }
Ma config : { theme: 'clair', langue: 'fr', notifications: true }
Commande : { couleur: 'bleu', taille: 'L', quantite: 3 }
Ancien état : { compteur: 5, nom: 'test', actif: true }
Nouvel état : { compteur: 6, nom: 'test', actif: true }
```

---

### Étape 7 : Attention à la copie superficielle

```javascript
// Démonstration du piège de la copie superficielle
const profil = {
  nom: "Alice",
  preferences: {
    theme: "sombre",
    langue: "fr",
  },
};

// Copie superficielle : les objets imbriqués sont partagés
const copieProfil = { ...profil };
copieProfil.preferences.theme = "clair";
console.log("Original :", profil.preferences.theme); // "clair" - modifié !

// Solution : copier aussi les objets imbriqués
const profilOriginal = {
  nom: "Bob",
  preferences: {
    theme: "sombre",
    langue: "en",
  },
};
const copieSure = {
  ...profilOriginal,
  preferences: { ...profilOriginal.preferences }, // Copie de l'objet imbriqué
};
copieSure.preferences.theme = "clair";
console.log("Original (sûr) :", profilOriginal.preferences.theme); // "sombre"
console.log("Copie (sûre) :", copieSure.preferences.theme); // "clair"

// Solution alternative : structuredClone (Node.js 17+)
const copieComplete = structuredClone(profilOriginal);
copieComplete.preferences.langue = "de";
console.log("structuredClone :", profilOriginal.preferences.langue); // "en"
```

```bash
node ~/js-moderne/03-destructuring.js
```

**Résultat attendu** :

```text
Original : clair
Original (sûr) : sombre
Copie (sûre) : clair
structuredClone : en
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `const { a, b } = obj` | Destructuring d'objet |
| `const [x, y] = arr` | Destructuring de tableau |
| `const { a: renomme } = obj` | Destructuring avec renommage |
| `const { a = 0 } = obj` | Destructuring avec valeur par défaut |
| `const [a, ...reste] = arr` | Rest operator (tableau) |
| `const { x, ...reste } = obj` | Rest operator (objet) |
| `const copie = [...arr]` | Spread (copie de tableau) |
| `const copie = { ...obj }` | Spread (copie d'objet) |

---

## Pièges Fréquents

### Piège 1 : Confondre rest et spread

**Problème** : Le même symbole `...` a deux significations différentes selon le contexte.

**Solution** : Retiens cette règle simple : si `...` est à gauche du `=` (dans un pattern de destructuring ou en paramètre de fonction), c'est le rest. Si `...` est à droite du `=` (dans une expression), c'est le spread.

```javascript
// Rest : côté gauche - collecte dans un tableau/objet
const [premier, ...reste] = [1, 2, 3]; // rest

// Spread : côté droit - étale dans un tableau/objet
const copie = [...reste]; // spread
```

---

### Piège 2 : Oublier que le spread fait une copie superficielle

**Problème** : Tu copies un objet avec `{ ...obj }` et tu modifies un objet imbriqué, ce qui modifie aussi l'original.

**Solution** : Pour les objets imbriqués, copie chaque niveau manuellement ou utilise `structuredClone()`.

---

### Piège 3 : Destructuring d'une valeur `undefined` ou `null`

**Problème** : Tu essaies de déstructurer `undefined` ou `null`, ce qui provoque une erreur.

**Solution** : Ajoute une valeur par défaut au paramètre de fonction.

```javascript
// ❌ Erreur si l'argument est undefined
function afficher({ nom }) {
  console.log(nom);
}
// afficher(); // TypeError: Cannot destructure property 'nom' of undefined

// ✅ Valeur par défaut pour le paramètre entier
function afficherSur({ nom } = {}) {
  console.log(nom); // undefined mais pas d'erreur
}
afficherSur(); // undefined
```

---

### Piège 4 : L'ordre des propriétés dans le spread

**Problème** : Les propriétés à droite écrasent celles à gauche dans un spread d'objet, et tu ne t'y attends pas.

**Solution** : Place les valeurs par défaut en premier et les valeurs prioritaires en dernier.

```javascript
// Les propriétés les plus à droite gagnent
const defauts = { couleur: "bleu", taille: "M" };
const choix = { taille: "L" };

// ✅ Les défauts en premier, les choix en dernier
const resultat = { ...defauts, ...choix };
console.log(resultat.taille); // "L" - le choix l'emporte
```

---

## Checklist de Validation

- [ ] Je sais extraire des propriétés d'un objet avec `const { a, b } = obj`
- [ ] Je sais renommer une variable lors du destructuring (`{ a: nouveauNom }`)
- [ ] Je sais utiliser des valeurs par défaut dans le destructuring
- [ ] Je sais extraire des éléments d'un tableau avec `const [a, b] = arr`
- [ ] Je sais utiliser le rest operator pour collecter les éléments restants
- [ ] Je sais copier un tableau et un objet avec le spread operator
- [ ] Je comprends la différence entre copie superficielle et copie profonde

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de commandes de restaurant.

1. Crée un objet `commandeParDefaut` avec les propriétés : `plat: "Menu du jour"`, `boisson: "Eau"`, `dessert: "Aucun"`, `supplement: 0`.
2. Crée une fonction `creerCommande(options)` qui fusionne les options avec les défauts (spread).
3. Crée une fonction `afficherCommande({ plat, boisson, dessert, supplement })` qui déstructure le paramètre.
4. Crée 3 commandes différentes avec des options partielles.
5. Utilise le rest operator pour séparer le plat du reste de la commande dans l'affichage.

**Indications** :

- Utilise le spread pour fusionner `commandeParDefaut` avec les options reçues.
- Utilise le destructuring dans les paramètres de `afficherCommande`.
- Utilise le rest pour extraire le plat et garder le reste séparément.

**Résultat attendu** :

```text
=== Commande 1 ===
Plat : Pizza Margherita
Détails : { boisson: 'Coca', dessert: 'Aucun', supplement: 0 }

=== Commande 2 ===
Plat : Menu du jour
Détails : { boisson: 'Eau', dessert: 'Tiramisu', supplement: 3.5 }

=== Commande 3 ===
Plat : Salade César
Détails : { boisson: 'Jus de pomme', dessert: 'Crème brûlée', supplement: 5 }
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```javascript
// Commande par défaut - toutes les propriétés ont une valeur initiale
const commandeParDefaut = {
  plat: "Menu du jour",
  boisson: "Eau",
  dessert: "Aucun",
  supplement: 0,
};

// Fonction qui fusionne les options avec les défauts
// Le spread permet de remplacer uniquement les propriétés fournies
const creerCommande = (options = {}) => ({
  ...commandeParDefaut, // D'abord les défauts
  ...options, // Puis les options (écrasent les défauts si présentes)
});

// Fonction qui affiche une commande en utilisant le destructuring et le rest
const afficherCommande = (numero, commande) => {
  // Rest operator : extraire le plat et garder le reste séparément
  const { plat, ...details } = commande;

  console.log(`=== Commande ${numero} ===`);
  console.log(`Plat : ${plat}`);
  console.log("Détails :", details);
  console.log(); // Ligne vide pour la lisibilité
};

// Commande 1 : seulement le plat et la boisson
const commande1 = creerCommande({ plat: "Pizza Margherita", boisson: "Coca" });

// Commande 2 : seulement le dessert et le supplément (plat et boisson par défaut)
const commande2 = creerCommande({ dessert: "Tiramisu", supplement: 3.5 });

// Commande 3 : tout personnalisé
const commande3 = creerCommande({
  plat: "Salade César",
  boisson: "Jus de pomme",
  dessert: "Crème brûlée",
  supplement: 5,
});

// Affichage des commandes
afficherCommande(1, commande1);
afficherCommande(2, commande2);
afficherCommande(3, commande3);
```

---

## Navigation

← Fiche précédente : **[Arrow functions et this](02-arrow-functions-this.md)**

→ Fiche suivante : **[Template literals et nouvelles méthodes](04-template-literals-methodes.md)**
