---
tags:
  - Java
  - Débutant
  - Pratique
description: "Variables et types de données en Java"
estimated_time: "65 min"
fiche_number: 3
total_fiches: 12
cursus: "Java"
---

# 03 - Variables et types de données en Java

> **En bref** : À la fin de cette fiche, tu sauras déclarer des variables, utiliser les types primitifs, et manipuler les chaînes de caractères en Java. Lecture estimée : 65 min.


## Prérequis

- Fiche [01 - Hello World en Java](01-hello-world.md)
- Fiche [02 - Compilation et exécution en Java](02-compilation-execution.md)
- Savoir compiler et exécuter un programme Java

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des variables, utiliser les types primitifs, et manipuler les chaînes de caractères en Java.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une variable ?

**Définition** : Une variable est un espace mémoire nommé qui stocke une valeur. Le nom permet d'accéder à cette valeur ou de la modifier.

**Le problème que les variables résolvent** :

Sans variables, voici les problèmes rencontrés :

1. **Répétition de valeurs** : Si tu utilises la même valeur plusieurs fois, tu dois la réécrire à chaque fois.

2. **Impossibilité de modifier** : Si la valeur change, tu dois la modifier partout dans le code.

3. **Code illisible** : Des valeurs brutes comme `3.14159` ou `1000` n'ont pas de signification claire.

**Comment les variables résolvent ces problèmes** :

| Problème | Solution apportée par les variables |
| -------- | ----------------------------------- |
| Répétition de valeurs | Tu écris la valeur une fois et utilises le nom de la variable partout |
| Impossibilité de modifier | Tu modifies la valeur à un seul endroit |
| Code illisible | Le nom de la variable décrit ce que représente la valeur |

**Analogie concrète** : Une variable est comme une boîte étiquetée. L'étiquette (le nom) indique ce qu'il y a dans la boîte. Tu peux regarder le contenu, le modifier, ou le remplacer. Sans étiquette, tu ne saurais pas ce que contient chaque boîte.

**Ce qu'une variable n'est PAS** :

- Une variable n'est pas une constante. Une variable peut changer de valeur, une constante non.
- Une variable n'est pas son type. Le type définit quelle sorte de valeur la variable peut contenir.

---

### Le typage statique en Java

**Définition** : Java utilise le typage statique, ce qui signifie que tu dois déclarer le type de chaque variable avant de l'utiliser. Une fois déclaré, le type ne peut pas changer.

**Le problème que le typage statique résout** :

Sans typage statique, voici les problèmes rencontrés :

1. **Erreurs à l'exécution** : Tu découvres les erreurs de type seulement quand le programme plante.

2. **Code imprévisible** : Une variable peut contenir n'importe quoi à n'importe quel moment.

**Comment le typage statique résout ces problèmes** :

| Problème | Solution |
| -------- | -------- |
| Erreurs à l'exécution | Le compilateur détecte les erreurs de type avant l'exécution |
| Code imprévisible | Chaque variable a un type fixe et prévisible |

**Comparaison typage statique vs typage dynamique** :

| Typage statique (Java) | Typage dynamique (Python) |
| ---------------------- | ------------------------- |
| Type déclaré explicitement | Type déduit automatiquement |
| Erreurs détectées à la compilation | Erreurs détectées à l'exécution |
| Plus de code à écrire | Moins de code à écrire |
| Code plus prévisible | Code plus flexible |

---

### Les types primitifs

**Définition** : Les types primitifs sont les types de base fournis par Java. Ils stockent des valeurs simples directement en mémoire.

**Les 8 types primitifs de Java** :

| Type | Taille | Valeurs | Exemple |
| ---- | ------ | ------- | ------- |
| `byte` | 1 octet | -128 à 127 | `byte b = 10;` |
| `short` | 2 octets | -32 768 à 32 767 | `short s = 1000;` |
| `int` | 4 octets | -2 milliards à +2 milliards | `int i = 42;` |
| `long` | 8 octets | Très grands nombres | `long l = 9999999999L;` |
| `float` | 4 octets | Nombres à virgule (précision simple) | `float f = 3.14f;` |
| `double` | 8 octets | Nombres à virgule (précision double) | `double d = 3.14159;` |
| `char` | 2 octets | Un seul caractère | `char c = 'A';` |
| `boolean` | 1 bit | `true` ou `false` | `boolean b = true;` |

**Types les plus utilisés** :

| Usage | Type recommandé |
| ----- | --------------- |
| Nombres entiers | `int` |
| Nombres à virgule | `double` |
| Vrai/Faux | `boolean` |
| Un caractère | `char` |

**Ce que les types primitifs ne sont PAS** :

- Les types primitifs ne sont pas des objets. Ils ne possèdent pas de méthodes.
- `String` n'est pas un type primitif. C'est une classe (un objet).

---

### La classe String

**Définition** : `String` est une classe Java qui représente une chaîne de caractères (du texte). Contrairement aux types primitifs, `String` est un objet.

**Syntaxe** :

```java
String message = "Bonjour le monde";
```

**Différences entre String et char** :

| String | char |
| ------ | ---- |
| Plusieurs caractères | Un seul caractère |
| Guillemets doubles `"texte"` | Guillemets simples `'A'` |
| C'est un objet (classe) | C'est un type primitif |
| Possède des méthodes | Pas de méthodes |

**Méthodes utiles de String** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `length()` | Retourne la longueur | `"Bonjour".length()` → 7 |
| `toUpperCase()` | Convertit en majuscules | `"bonjour".toUpperCase()` → "BONJOUR" |
| `toLowerCase()` | Convertit en minuscules | `"BONJOUR".toLowerCase()` → "bonjour" |
| `charAt(index)` | Retourne le caractère à l'index | `"Bonjour".charAt(0)` → 'B' |
| `substring(début, fin)` | Extrait une portion | `"Bonjour".substring(0, 3)` → "Bon" |

---

### Déclaration et initialisation

**Définition** :

- **Déclarer** une variable, c'est réserver un espace mémoire avec un nom et un type.
- **Initialiser** une variable, c'est lui donner une première valeur.

**Syntaxe de déclaration** :

```java
type nomVariable;
```

**Syntaxe de déclaration avec initialisation** :

```java
type nomVariable = valeur;
```

**Exemples** :

```java
// Déclaration seule (pas de valeur encore)
int age;

// Initialisation après déclaration
age = 25;

// Déclaration et initialisation en une ligne
int annee = 2024;

// Plusieurs variables du même type
int x, y, z;

// Plusieurs variables avec valeurs
int a = 1, b = 2, c = 3;
```

**Règle importante** : Une variable doit être initialisée avant d'être utilisée. Sinon, le compilateur génère une erreur.

```java
int nombre;
System.out.println(nombre); // ERREUR : variable might not have been initialized
```

---

### Les règles de nommage

**Règles obligatoires** (sinon erreur de compilation) :

| Règle | Exemple correct | Exemple incorrect |
| ----- | --------------- | ----------------- |
| Commence par une lettre, `$` ou `_` | `age`, `_total`, `$prix` | `2age` (commence par un chiffre) |
| Pas d'espaces | `nomUtilisateur` | `nom utilisateur` |
| Pas de caractères spéciaux (sauf `$` et `_`) | `total_ht` | `total-ht`, `total@ht` |
| Pas de mots réservés | `classe` | `class` (mot réservé Java) |

**Conventions recommandées** (pour la lisibilité) :

| Convention | Description | Exemple |
| ---------- | ----------- | ------- |
| camelCase | Première lettre minuscule, majuscule pour chaque nouveau mot | `nomUtilisateur`, `dateNaissance` |
| Noms significatifs | Le nom décrit le contenu | `age` plutôt que `a` |
| Pas d'abréviations obscures | Noms complets ou abréviations connues | `nombreClients` plutôt que `nbCl` |

**Mots réservés Java** (ne pas utiliser comme noms de variables) :

```text
abstract, boolean, break, byte, case, catch, char, class, const, continue,
default, do, double, else, enum, extends, final, finally, float, for,
goto, if, implements, import, instanceof, int, interface, long, native, new,
package, private, protected, public, return, short, static, strictfp, super,
switch, synchronized, this, throw, throws, transient, try, void, volatile, while
```

---

### La concaténation

**Définition** : La concaténation est l'opération qui assemble plusieurs chaînes de caractères en une seule, en utilisant l'opérateur `+`.

**Syntaxe** :

```java
String resultat = "partie1" + "partie2";
```

**Exemples** :

```java
String prenom = "Clara";
String nom = "Martin";

// Concaténation de deux variables
String nomComplet = prenom + " " + nom;
System.out.println(nomComplet); // Affiche : Clara Martin

// Concaténation avec des nombres
int age = 20;
System.out.println("Age : " + age); // Affiche : Age : 20

// Concaténation de plusieurs éléments
System.out.println("Bonjour " + prenom + ", tu as " + age + " ans.");
```

**Règle importante** : Quand tu concatènes un nombre avec une chaîne, le nombre est automatiquement converti en texte.

---

## Étapes Pratiques

### Étape 1 : Créer le fichier de travail

Crée un fichier `Variables.java` :

```java
// Fichier : Variables.java
// Exploration des variables et types en Java

public class Variables {
    public static void main(String[] args) {
        // Le code va ici
    }
}
```

---

### Étape 2 : Déclarer des variables de types primitifs

Ajoute ce code dans la méthode `main` :

```java
public class Variables {
    public static void main(String[] args) {
        // Déclaration de variables de différents types
        int age = 25;
        double taille = 1.75;
        char initiale = 'A';
        boolean estEtudiant = true;

        // Affichage des valeurs
        System.out.println("=== Mes informations ===");
        System.out.println("Age : " + age + " ans");
        System.out.println("Taille : " + taille + " m");
        System.out.println("Initiale : " + initiale);
        System.out.println("Étudiant : " + estEtudiant);
    }
}
```

**Compile et exécute** :

```bash
javac Variables.java && java Variables
```

**Résultat attendu** :

```text
=== Mes informations ===
Age : 25 ans
Taille : 1.75 m
Initiale : A
Étudiant : true
```

---

### Étape 3 : Modifier une variable

Ajoute du code pour modifier une variable :

```java
public class Variables {
    public static void main(String[] args) {
        int compteur = 0;
        System.out.println("Compteur initial : " + compteur);

        compteur = 1;
        System.out.println("Compteur après modification : " + compteur);

        compteur = compteur + 1;
        System.out.println("Compteur +1 : " + compteur);

        compteur += 5;  // Raccourci pour compteur = compteur + 5
        System.out.println("Compteur +5 : " + compteur);
    }
}
```

**Résultat attendu** :

```text
Compteur initial : 0
Compteur après modification : 1
Compteur +1 : 2
Compteur +5 : 7
```

---

### Étape 4 : Utiliser String

Crée un nouveau fichier `Textes.java` :

```java
// Fichier : Textes.java
// Manipulation de chaînes de caractères

public class Textes {
    public static void main(String[] args) {
        // Déclaration de String
        String prenom = "Alex";
        String nom = "Martin";

        // Concaténation
        String nomComplet = prenom + " " + nom;
        System.out.println("Nom complet : " + nomComplet);

        // Méthodes de String
        System.out.println("Longueur du prénom : " + prenom.length());
        System.out.println("En majuscules : " + prenom.toUpperCase());
        System.out.println("En minuscules : " + nom.toLowerCase());
        System.out.println("Première lettre : " + prenom.charAt(0));
    }
}
```

**Résultat attendu** :

```text
Nom complet : Alex Martin
Longueur du prénom : 4
En majuscules : ALEX
En minuscules : martin
Première lettre : A
```

---

### Étape 5 : Opérations arithmétiques

Crée un fichier `Calculs.java` :

```java
// Fichier : Calculs.java
// Opérations arithmétiques avec des variables

public class Calculs {
    public static void main(String[] args) {
        int a = 10;
        int b = 3;

        // Opérations de base
        System.out.println("a = " + a);
        System.out.println("b = " + b);
        System.out.println("---");
        System.out.println("a + b = " + (a + b));   // Addition
        System.out.println("a - b = " + (a - b));   // Soustraction
        System.out.println("a * b = " + (a * b));   // Multiplication
        System.out.println("a / b = " + (a / b));   // Division entière
        System.out.println("a % b = " + (a % b));   // Modulo (reste)

        System.out.println("---");

        // Division avec des doubles
        double x = 10.0;
        double y = 3.0;
        System.out.println("x / y = " + (x / y));   // Division décimale
    }
}
```

**Résultat attendu** :

```text
a = 10
b = 3
---
a + b = 13
a - b = 7
a * b = 30
a / b = 3
a % b = 1
---
x / y = 3.3333333333333335
```

**Explication de a / b = 3** : Quand tu divises deux `int`, le résultat est un `int` (partie entière seulement). Pour avoir une division décimale, utilise des `double`.

---

### Étape 6 : Les constantes avec final

Crée un fichier `Constantes.java` :

```java
// Fichier : Constantes.java
// Utilisation de constantes

public class Constantes {
    public static void main(String[] args) {
        // Déclaration d'une constante avec final
        final double PI = 3.14159;
        final int JOURS_PAR_SEMAINE = 7;

        // Utilisation
        double rayon = 5.0;
        double perimetre = 2 * PI * rayon;

        System.out.println("Rayon : " + rayon);
        System.out.println("Périmètre : " + perimetre);
        System.out.println("Jours par semaine : " + JOURS_PAR_SEMAINE);

        // Ceci provoquerait une erreur :
        // PI = 3.14;  // ERREUR : cannot assign a value to final variable
    }
}
```

**Convention** : Les constantes sont écrites en MAJUSCULES_AVEC_UNDERSCORES.

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac Fichier.java` | Compile le fichier |
| `java NomClasse` | Exécute le programme |
| `javac *.java && java NomClasse` | Compile et exécute en une commande |

---

## Pièges Fréquents

### Piège 1 : Variable non initialisée

⚠️ **Problème** : Erreur "variable might not have been initialized"

✅ **Solution** : Toujours initialiser une variable avant de l'utiliser.

```java
// Incorrect
int age;
System.out.println(age);  // ERREUR

// Correct
int age = 0;
System.out.println(age);  // OK
```

---

### Piège 2 : Mauvais type pour la valeur

⚠️ **Problème** : Erreur "incompatible types"

✅ **Solution** : La valeur doit correspondre au type déclaré.

```java
// Incorrect
int nombre = 3.14;  // ERREUR : 3.14 est un double, pas un int

// Correct
double nombre = 3.14;  // OK
```

---

### Piège 3 : Guillemets simples vs doubles

⚠️ **Problème** : Erreur "unclosed character literal" ou "empty character literal"

✅ **Solution** :

- Guillemets simples `'A'` pour un seul caractère (`char`)
- Guillemets doubles `"texte"` pour une chaîne (`String`)

```java
// Incorrect
char lettre = "A";    // ERREUR : "A" est un String
String mot = 'mot';   // ERREUR : 'mot' n'est pas un char valide

// Correct
char lettre = 'A';
String mot = "mot";
```

---

### Piège 4 : Division entière inattendue

⚠️ **Problème** : Le résultat de la division est tronqué.

✅ **Solution** : Utiliser des `double` si tu veux une division décimale.

```java
// Résultat inattendu
int a = 5;
int b = 2;
System.out.println(a / b);  // Affiche 2, pas 2.5

// Solution
double x = 5.0;
double y = 2.0;
System.out.println(x / y);  // Affiche 2.5
```

---

### Piège 5 : Oublier le suffixe pour long et float

⚠️ **Problème** : Erreur "integer number too large" ou "possible lossy conversion"

✅ **Solution** : Ajouter `L` pour `long` et `f` pour `float`.

```java
// Incorrect
long grandNombre = 9999999999;   // ERREUR : nombre trop grand pour int
float decimal = 3.14;            // ERREUR : 3.14 est un double par défaut

// Correct
long grandNombre = 9999999999L;  // L indique que c'est un long
float decimal = 3.14f;           // f indique que c'est un float
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est une variable
- [ ] J'ai compris les types primitifs (int, double, boolean, char)
- [ ] J'ai compris la différence entre String et char
- [ ] J'ai déclaré et initialisé des variables
- [ ] J'ai modifié la valeur d'une variable
- [ ] J'ai utilisé la concaténation avec +
- [ ] J'ai effectué des opérations arithmétiques
- [ ] J'ai compris ce qu'est une constante (final)

---

## Exercice Pratique

**Énoncé** : Crée un programme qui calcule le prix TTC à partir d'un prix HT.

**Indications** :

- Crée un fichier `PrixTTC.java`
- Déclare une constante `TVA` avec la valeur `0.20` (20%)
- Déclare une variable `prixHT` avec la valeur de ton choix
- Calcule le montant de la TVA : `prixHT * TVA`
- Calcule le prix TTC : `prixHT + montantTVA`
- Affiche le prix HT, le montant de la TVA, et le prix TTC

**Résultat attendu** (pour un prix HT de 100) :

```text
Prix HT : 100.0 €
TVA (20%) : 20.0 €
Prix TTC : 120.0 €
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```java
// Fichier : PrixTTC.java
// Calcul du prix TTC à partir du prix HT

public class PrixTTC {
    public static void main(String[] args) {
        // Constante : taux de TVA
        final double TVA = 0.20;

        // Variable : prix hors taxes
        double prixHT = 100.0;

        // Calculs
        double montantTVA = prixHT * TVA;
        double prixTTC = prixHT + montantTVA;

        // Affichage
        System.out.println("Prix HT : " + prixHT + " €");
        System.out.println("TVA (20%) : " + montantTVA + " €");
        System.out.println("Prix TTC : " + prixTTC + " €");
    }
}
```

**Compilation et exécution** :

```bash
javac PrixTTC.java && java PrixTTC
```

---

## Navigation

← Fiche précédente : **[Compilation et exécution en Java](02-compilation-execution.md)**

→ Fiche suivante : **[Classes et objets en Java](04-classes-objets.md)**
