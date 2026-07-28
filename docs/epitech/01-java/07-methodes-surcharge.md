---
tags:
  - Java
  - Intermédiaire
  - Pratique
description: "Méthodes et surcharge en Java"
estimated_time: "60 min"
fiche_number: 7
total_fiches: 12
cursus: "Java"
---

# 07 - Méthodes et surcharge en Java

> **En bref** : À la fin de cette fiche, tu sauras créer des méthodes avec paramètres et valeur de retour, et utiliser la surcharge de méthodes. Lecture estimée : 60 min.


## Prérequis

- Fiche [04 - Classes et objets en Java](04-classes-objets.md)
- Fiche [05 - Les constructeurs en Java](05-constructeurs.md)
- Fiche [06 - Visibilité et encapsulation en Java](06-visibilite-encapsulation.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des méthodes avec paramètres et valeur de retour, et utiliser la surcharge de méthodes.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une méthode ?

**Définition** : Une méthode est un bloc de code nommé qui effectue une action. Elle appartient à une classe et peut recevoir des paramètres et retourner une valeur.

**Le problème que les méthodes résolvent** :

Sans méthodes, voici les problèmes rencontrés :

1. **Code dupliqué** : Tu dois réécrire le même code à chaque fois que tu veux effectuer la même action.

2. **Code difficile à lire** : Un long bloc de code est plus difficile à comprendre qu'une série d'appels de méthodes aux noms clairs.

3. **Maintenance difficile** : Si tu dois modifier une logique, tu dois la modifier partout où elle est dupliquée.

**Comment les méthodes résolvent ces problèmes** :

| Problème | Solution apportée par les méthodes |
| -------- | ---------------------------------- |
| Code dupliqué | Le code est écrit une fois dans la méthode, appelé plusieurs fois |
| Code difficile à lire | Le nom de la méthode décrit ce qu'elle fait |
| Maintenance difficile | Une modification dans la méthode s'applique partout |

**Analogie concrète** : Une méthode est comme une recette de cuisine. Au lieu de réécrire toutes les étapes à chaque fois que tu veux faire une omelette, tu écris la recette une fois ("faireOmelette") et tu la suis à chaque fois. Si tu améliores la recette, toutes les omelettes futures bénéficient de l'amélioration.

---

### Anatomie d'une méthode

**Structure complète** :

```java
modificateur typeRetour nomMethode(paramètres) {
    // Corps de la méthode
    return valeur;  // Si typeRetour n'est pas void
}
```

**Explication de chaque partie** :

| Partie | Description | Exemple |
| ------ | ----------- | ------- |
| `modificateur` | Visibilité (`public`, `private`, etc.) | `public` |
| `typeRetour` | Type de la valeur retournée, ou `void` | `int`, `String`, `void` |
| `nomMethode` | Nom de la méthode (en camelCase) | `calculerSomme` |
| `paramètres` | Liste des données reçues (type nom) | `int a, int b` |
| `return` | Instruction qui retourne une valeur | `return a + b;` |

**Exemples** :

```java
// Méthode sans paramètre, sans retour
public void direBonjour() {
    System.out.println("Bonjour !");
}

// Méthode avec paramètres, sans retour
public void afficherNombre(int n) {
    System.out.println("Le nombre est : " + n);
}

// Méthode avec paramètres et retour
public int additionner(int a, int b) {
    return a + b;
}

// Méthode sans paramètre, avec retour
public String obtenirMessage() {
    return "Ceci est un message";
}
```

---

### Les paramètres

**Définition** : Les paramètres sont les valeurs que tu passes à une méthode lors de son appel. Ils permettent à la méthode de travailler avec des données différentes.

**Différence paramètre vs argument** :

| Terme | Définition | Exemple |
| ----- | ---------- | ------- |
| Paramètre | Variable déclarée dans la signature de la méthode | `void afficher(int nombre)` → `nombre` est le paramètre |
| Argument | Valeur passée lors de l'appel de la méthode | `afficher(42)` → `42` est l'argument |

**Passage par valeur** :

En Java, les types primitifs sont passés par valeur. Cela signifie que la méthode reçoit une copie de la valeur.

```java
public void doubler(int x) {
    x = x * 2;  // Modifie la copie, pas l'original
}

// Dans main :
int nombre = 5;
doubler(nombre);
System.out.println(nombre);  // Affiche 5, pas 10
```

---

### La valeur de retour

**Définition** : La valeur de retour est le résultat que la méthode renvoie à l'appelant. Elle est spécifiée par l'instruction `return`.

**Règles importantes** :

1. Le type de la valeur retournée doit correspondre au type déclaré
2. Une méthode `void` ne retourne rien (pas de `return valeur`)
3. Une méthode non-void doit toujours retourner une valeur (dans tous les chemins d'exécution)

**Exemples** :

```java
// Retourne un int
public int carre(int n) {
    return n * n;
}

// Retourne un boolean
public boolean estPositif(int n) {
    return n > 0;
}

// Retourne un String
public String formater(String prenom, String nom) {
    return prenom + " " + nom;
}

// void : pas de return avec valeur
public void afficher(String message) {
    System.out.println(message);
    // Pas de return (ou return; sans valeur)
}
```

**Utilisation de la valeur de retour** :

```java
// Stocker dans une variable
int resultat = carre(5);

// Utiliser directement
System.out.println(carre(5));

// Utiliser dans une condition
if (estPositif(10)) {
    System.out.println("Positif");
}
```

---

### Qu'est-ce que la surcharge ?

**Définition** : La surcharge (overloading) permet de définir plusieurs méthodes avec le même nom mais des paramètres différents (nombre ou types).

**Le problème que la surcharge résout** :

Sans surcharge, tu devrais donner des noms différents à des méthodes qui font des choses similaires.

```java
// Sans surcharge : noms différents
public int additionnerDeuxInt(int a, int b) { ... }
public int additionnerTroisInt(int a, int b, int c) { ... }
public double additionnerDeuxDouble(double a, double b) { ... }
```

```java
// Avec surcharge : même nom
public int additionner(int a, int b) { ... }
public int additionner(int a, int b, int c) { ... }
public double additionner(double a, double b) { ... }
```

**Comment Java choisit la bonne méthode** :

Java regarde les arguments passés et choisit la méthode dont les paramètres correspondent.

```java
additionner(1, 2);        // Appelle additionner(int, int)
additionner(1, 2, 3);     // Appelle additionner(int, int, int)
additionner(1.5, 2.5);    // Appelle additionner(double, double)
```

**Règles de la surcharge** :

| Ce qui peut différer | Ce qui ne peut pas différer |
| -------------------- | --------------------------- |
| Nombre de paramètres | Seulement le type de retour |
| Type des paramètres | Seulement le nom des paramètres |
| Ordre des types des paramètres | |

**Ce qui n'est PAS de la surcharge** :

```java
// ERREUR : même signature, seul le type de retour diffère
public int calculer(int a) { return a; }
public double calculer(int a) { return a; }  // ERREUR de compilation
```

---

## Étapes Pratiques

### Étape 1 : Créer des méthodes simples

Crée un fichier `Calculatrice.java` :

```java
// Fichier : Calculatrice.java

class Calculatrice {

    // Méthode sans paramètre, sans retour
    public void afficherBienvenue() {
        System.out.println("=== Calculatrice ===");
    }

    // Méthode avec paramètres, avec retour
    public int additionner(int a, int b) {
        return a + b;
    }

    public int soustraire(int a, int b) {
        return a - b;
    }

    public int multiplier(int a, int b) {
        return a * b;
    }

    public double diviser(int a, int b) {
        if (b == 0) {
            System.out.println("Erreur : division par zéro");
            return 0;
        }
        return (double) a / b;
    }
}
```

Crée un fichier `TestCalculatrice.java` :

```java
// Fichier : TestCalculatrice.java

public class TestCalculatrice {
    public static void main(String[] args) {
        Calculatrice calc = new Calculatrice();

        calc.afficherBienvenue();

        int somme = calc.additionner(10, 5);
        System.out.println("10 + 5 = " + somme);

        int difference = calc.soustraire(10, 5);
        System.out.println("10 - 5 = " + difference);

        int produit = calc.multiplier(10, 5);
        System.out.println("10 * 5 = " + produit);

        double quotient = calc.diviser(10, 5);
        System.out.println("10 / 5 = " + quotient);

        // Division par zéro
        calc.diviser(10, 0);
    }
}
```

**Résultat attendu** :

```text
=== Calculatrice ===
10 + 5 = 15
10 - 5 = 5
10 * 5 = 50
10 / 5 = 2.0
Erreur : division par zéro
```

---

### Étape 2 : Utiliser la surcharge

Modifie `Calculatrice.java` pour ajouter la surcharge :

```java
class Calculatrice {

    public void afficherBienvenue() {
        System.out.println("=== Calculatrice ===");
    }

    // Surcharge de additionner

    // Deux entiers
    public int additionner(int a, int b) {
        return a + b;
    }

    // Trois entiers
    public int additionner(int a, int b, int c) {
        return a + b + c;
    }

    // Deux doubles
    public double additionner(double a, double b) {
        return a + b;
    }

    // Surcharge de afficher

    // Afficher un entier
    public void afficher(int n) {
        System.out.println("Entier : " + n);
    }

    // Afficher un double
    public void afficher(double n) {
        System.out.println("Double : " + n);
    }

    // Afficher un String
    public void afficher(String s) {
        System.out.println("Texte : " + s);
    }
}
```

Modifie `TestCalculatrice.java` :

```java
public class TestCalculatrice {
    public static void main(String[] args) {
        Calculatrice calc = new Calculatrice();

        calc.afficherBienvenue();

        System.out.println();
        System.out.println("=== Surcharge de additionner ===");

        // Java choisit la méthode selon les arguments
        int r1 = calc.additionner(1, 2);
        System.out.println("additionner(1, 2) = " + r1);

        int r2 = calc.additionner(1, 2, 3);
        System.out.println("additionner(1, 2, 3) = " + r2);

        double r3 = calc.additionner(1.5, 2.5);
        System.out.println("additionner(1.5, 2.5) = " + r3);

        System.out.println();
        System.out.println("=== Surcharge de afficher ===");

        calc.afficher(42);
        calc.afficher(3.14);
        calc.afficher("Bonjour");
    }
}
```

**Résultat attendu** :

```text
=== Calculatrice ===

=== Surcharge de additionner ===
additionner(1, 2) = 3
additionner(1, 2, 3) = 6
additionner(1.5, 2.5) = 4.0

=== Surcharge de afficher ===
Entier : 42
Double : 3.14
Texte : Bonjour
```

---

### Étape 3 : Méthodes avec logique conditionnelle

Crée un fichier `Utilitaire.java` :

```java
// Fichier : Utilitaire.java

class Utilitaire {

    // Retourne le maximum de deux nombres
    public int max(int a, int b) {
        if (a > b) {
            return a;
        } else {
            return b;
        }
    }

    // Surcharge : maximum de trois nombres
    public int max(int a, int b, int c) {
        return max(max(a, b), c);  // Réutilise la méthode à deux paramètres
    }

    // Vérifie si un nombre est pair
    public boolean estPair(int n) {
        return n % 2 == 0;
    }

    // Vérifie si un nombre est dans un intervalle
    public boolean estDansIntervalle(int n, int min, int max) {
        return n >= min && n <= max;
    }

    // Retourne la valeur absolue
    public int valeurAbsolue(int n) {
        if (n < 0) {
            return -n;
        }
        return n;
    }

    // Surcharge pour double
    public double valeurAbsolue(double n) {
        if (n < 0) {
            return -n;
        }
        return n;
    }
}
```

Crée un fichier `TestUtilitaire.java` :

```java
// Fichier : TestUtilitaire.java

public class TestUtilitaire {
    public static void main(String[] args) {
        Utilitaire util = new Utilitaire();

        System.out.println("=== Maximum ===");
        System.out.println("max(5, 3) = " + util.max(5, 3));
        System.out.println("max(2, 8) = " + util.max(2, 8));
        System.out.println("max(1, 5, 3) = " + util.max(1, 5, 3));

        System.out.println();
        System.out.println("=== Parité ===");
        System.out.println("estPair(4) = " + util.estPair(4));
        System.out.println("estPair(7) = " + util.estPair(7));

        System.out.println();
        System.out.println("=== Intervalle ===");
        System.out.println("estDansIntervalle(5, 1, 10) = " + util.estDansIntervalle(5, 1, 10));
        System.out.println("estDansIntervalle(15, 1, 10) = " + util.estDansIntervalle(15, 1, 10));

        System.out.println();
        System.out.println("=== Valeur absolue ===");
        System.out.println("valeurAbsolue(-5) = " + util.valeurAbsolue(-5));
        System.out.println("valeurAbsolue(5) = " + util.valeurAbsolue(5));
        System.out.println("valeurAbsolue(-3.14) = " + util.valeurAbsolue(-3.14));
    }
}
```

**Résultat attendu** :

```text
=== Maximum ===
max(5, 3) = 5
max(2, 8) = 8
max(1, 5, 3) = 5

=== Parité ===
estPair(4) = true
estPair(7) = false

=== Intervalle ===
estDansIntervalle(5, 1, 10) = true
estDansIntervalle(15, 1, 10) = false

=== Valeur absolue ===
valeurAbsolue(-5) = 5
valeurAbsolue(5) = 5
valeurAbsolue(-3.14) = 3.14
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestCalculatrice` | Exécute le test |

---

## Pièges Fréquents

### Piège 1 : Oublier return dans une méthode non-void

⚠️ **Problème** : Erreur "missing return statement"

✅ **Solution** : Toute méthode non-void doit retourner une valeur dans tous les cas.

```java
// Incorrect : pas de return si b == 0
public int diviser(int a, int b) {
    if (b != 0) {
        return a / b;
    }
    // ERREUR : pas de return ici
}

// Correct
public int diviser(int a, int b) {
    if (b != 0) {
        return a / b;
    }
    return 0;  // Valeur par défaut
}
```

---

### Piège 2 : Type de retour incorrect

⚠️ **Problème** : Erreur "incompatible types"

✅ **Solution** : La valeur retournée doit correspondre au type déclaré.

```java
// Incorrect
public int calculer() {
    return 3.14;  // ERREUR : double retourné au lieu de int
}

// Correct
public double calculer() {
    return 3.14;
}
```

---

### Piège 3 : Confondre surcharge et redéfinition

⚠️ **Problème** : Essayer de surcharger avec seulement le type de retour différent.

✅ **Solution** : La surcharge nécessite des paramètres différents.

```java
// ERREUR : pas une surcharge valide
public int calculer(int a) { return a; }
public double calculer(int a) { return a; }  // Même signature

// Correct : paramètres différents
public int calculer(int a) { return a; }
public double calculer(double a) { return a; }  // OK
```

---

### Piège 4 : Ignorer la valeur de retour

⚠️ **Problème** : Appeler une méthode qui retourne une valeur sans l'utiliser.

✅ **Solution** : Stocker ou utiliser la valeur retournée.

```java
// Pas d'erreur mais inutile
calc.additionner(5, 3);  // Le résultat est perdu

// Correct
int resultat = calc.additionner(5, 3);
System.out.println(resultat);
```

---

### Piège 5 : Concaténation de chaînes en boucle

⚠️ **Problème** : Utiliser `+` dans une boucle pour construire une chaîne crée un nouvel objet `String` à chaque itération (O(n²) en temps et mémoire).

```java
// ❌ Inefficace : crée n nouveaux objets String
String resultat = "";
for (int i = 0; i < 1000; i++) {
    resultat = resultat + "abc";  // 1000 objets String temporaires
}
```

✅ **Solution** : Utiliser `StringBuilder` qui modifie un seul buffer interne.

```java
// ✅ Efficace : un seul objet modifié en place
StringBuilder sb = new StringBuilder();
for (int i = 0; i < 1000; i++) {
    sb.append("abc");
}
String resultat = sb.toString();
```

---

## Checklist de Validation

- [ ] J'ai créé une méthode sans paramètre ni retour (void)
- [ ] J'ai créé une méthode avec paramètres
- [ ] J'ai créé une méthode avec valeur de retour
- [ ] J'ai utilisé `return` pour retourner une valeur
- [ ] J'ai compris la surcharge de méthodes
- [ ] J'ai créé plusieurs méthodes avec le même nom mais des paramètres différents
- [ ] Java choisit automatiquement la bonne méthode selon les arguments

---

## Exercice Pratique

**Énoncé** : Crée une classe `GestionTexte` avec des méthodes utilitaires pour manipuler du texte.

**Indications** :

- Méthode `compter(String texte)` : retourne le nombre de caractères
- Méthode `compter(String texte, char caractere)` : retourne le nombre d'occurrences du caractère (surcharge)
- Méthode `inverser(String texte)` : retourne le texte inversé
- Méthode `estPalindrome(String texte)` : retourne `true` si le texte est un palindrome
- Méthode `repeter(String texte, int fois)` : retourne le texte répété n fois

**Résultat attendu** :

```text
=== Compter ===
compter("Bonjour") = 7
compter("Bonjour", 'o') = 2

=== Inverser ===
inverser("Java") = avaJ

=== Palindrome ===
estPalindrome("radar") = true
estPalindrome("java") = false

=== Répéter ===
repeter("Ha", 3) = HaHaHa
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier GestionTexte.java** :

```java
// Fichier : GestionTexte.java

class GestionTexte {

    // Compte le nombre de caractères
    public int compter(String texte) {
        return texte.length();
    }

    // Surcharge : compte les occurrences d'un caractère
    public int compter(String texte, char caractere) {
        int compteur = 0;
        for (int i = 0; i < texte.length(); i++) {
            if (texte.charAt(i) == caractere) {
                compteur++;
            }
        }
        return compteur;
    }

    // Inverse le texte
    public String inverser(String texte) {
        // StringBuilder évite de créer un nouvel objet String à chaque itération
        StringBuilder sb = new StringBuilder();
        for (int i = texte.length() - 1; i >= 0; i--) {
            sb.append(texte.charAt(i));
        }
        return sb.toString();
    }

    // Vérifie si c'est un palindrome
    public boolean estPalindrome(String texte) {
        String inverse = inverser(texte);
        return texte.equals(inverse);
    }

    // Répète le texte n fois
    public String repeter(String texte, int fois) {
        // StringBuilder évite de créer un nouvel objet String à chaque itération
        StringBuilder sb = new StringBuilder();
        for (int i = 0; i < fois; i++) {
            sb.append(texte);
        }
        return sb.toString();
    }
}
```

**Fichier TestGestionTexte.java** :

```java
// Fichier : TestGestionTexte.java

public class TestGestionTexte {
    public static void main(String[] args) {
        GestionTexte gt = new GestionTexte();

        System.out.println("=== Compter ===");
        System.out.println("compter(\"Bonjour\") = " + gt.compter("Bonjour"));
        System.out.println("compter(\"Bonjour\", 'o') = " + gt.compter("Bonjour", 'o'));

        System.out.println();
        System.out.println("=== Inverser ===");
        System.out.println("inverser(\"Java\") = " + gt.inverser("Java"));

        System.out.println();
        System.out.println("=== Palindrome ===");
        System.out.println("estPalindrome(\"radar\") = " + gt.estPalindrome("radar"));
        System.out.println("estPalindrome(\"java\") = " + gt.estPalindrome("java"));

        System.out.println();
        System.out.println("=== Répéter ===");
        System.out.println("repeter(\"Ha\", 3) = " + gt.repeter("Ha", 3));
    }
}
```

**Compilation et exécution** :

```bash
javac GestionTexte.java TestGestionTexte.java && java TestGestionTexte
```

---

## Navigation

← Fiche précédente : **[Visibilité et encapsulation en Java](06-visibilite-encapsulation.md)**

→ Fiche suivante : **[L'héritage en Java](08-heritage.md)**
