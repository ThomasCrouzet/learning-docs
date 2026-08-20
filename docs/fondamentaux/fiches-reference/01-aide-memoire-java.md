---
tags:
  - Référence
  - Débutant
description: "Aide-mémoire Java"
estimated_time: "30 min"
fiche_number: 1
total_fiches: 3
cursus: "Aide-mémoires Java, Bash, HTML/CSS"
---

# 01 - Aide-mémoire Java

> **En bref** : Aide-mémoire Java. Lecture estimée : 30 min.

Référence rapide pour la syntaxe Java.

---

## Compilation et exécution

```bash
# Compiler
javac MonFichier.java

# Exécuter
java MonFichier

# Compiler avec classpath
javac -cp lib/*.jar MonFichier.java

# Exécuter avec classpath
java -cp .:lib/*.jar MonFichier
```

---

## Structure de base

```java
public class NomClasse {
    public static void main(String[] args) {
        // Code ici
    }
}
```

---

## Types primitifs

| Type | Taille | Exemple |
| ---- | ------ | ------- |
| `byte` | 8 bits | `-128` à `127` |
| `short` | 16 bits | `-32768` à `32767` |
| `int` | 32 bits | `-2^31` à `2^31-1` |
| `long` | 64 bits | `123456789L` |
| `float` | 32 bits | `3.14f` |
| `double` | 64 bits | `3.14159` |
| `boolean` | non spécifiée (souvent 1 octet en pratique) | `true`, `false` |
| `char` | 16 bits | `'A'` |

---

## Variables

```java
// Déclaration
int nombre;
String texte;

// Déclaration + initialisation
int age = 25;
String nom = "Alice";
final double PI = 3.14159;  // Constante
```

---

## Opérateurs

**Arithmétiques** :

| Opérateur | Description |
| --------- | ----------- |
| `+` | Addition |
| `-` | Soustraction |
| `*` | Multiplication |
| `/` | Division |
| `%` | Modulo |
| `++` | Incrémentation |
| `--` | Décrémentation |

**Comparaison** :

| Opérateur | Description |
| --------- | ----------- |
| `==` | Égal |
| `!=` | Différent |
| `>` | Supérieur |
| `<` | Inférieur |
| `>=` | Supérieur ou égal |
| `<=` | Inférieur ou égal |

**Logiques** :

| Opérateur | Description |
| --------- | ----------- |
| `&&` | ET |
| `\|\|` | OU |
| `!` | NON |

---

## Conditions

```java
// if-else
if (condition) {
    // code
} else if (autreCondition) {
    // code
} else {
    // code
}

// Ternaire
String result = (age >= 18) ? "majeur" : "mineur";

// switch
switch (valeur) {
    case 1:
        // code
        break;
    case 2:
        // code
        break;
    default:
        // code
}
```

---

## Boucles

```java
// for
for (int i = 0; i < 10; i++) {
    System.out.println(i);
}

// for-each
for (String item : liste) {
    System.out.println(item);
}

// while
while (condition) {
    // code
}

// do-while
do {
    // code
} while (condition);
```

---

## Tableaux

```java
// Déclaration
int[] nombres = new int[5];
String[] noms = {"Alice", "Bob", "Charlie"};

// Accès
int premier = nombres[0];
nombres[0] = 42;

// Longueur
int taille = nombres.length;
```

---

## Strings

```java
String s = "Hello";

// Méthodes courantes
s.length()              // Longueur
s.charAt(0)             // Caractère à l'index
s.substring(0, 3)       // Sous-chaîne
s.toLowerCase()         // Minuscules
s.toUpperCase()         // Majuscules
s.trim()                // Supprime espaces
s.split(",")            // Divise en tableau
s.equals("Hello")       // Comparaison
s.contains("ell")       // Contient
s.startsWith("He")      // Commence par
s.endsWith("lo")        // Finit par
s.replace("l", "L")     // Remplace
s.isEmpty()             // Est vide

// Concaténation
String full = "Hello" + " " + "World";
String format = String.format("Age: %d", 25);
```

---

## Classes

```java
public class Personne {
    // Attributs
    private String nom;
    private int age;

    // Constructeur
    public Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    // Getters
    public String getNom() {
        return nom;
    }

    public int getAge() {
        return age;
    }

    // Setters
    public void setNom(String nom) {
        this.nom = nom;
    }

    // Méthode
    public void sePresenter() {
        System.out.println("Je suis " + nom);
    }

    // toString
    @Override
    public String toString() {
        return "Personne{nom=" + nom + ", age=" + age + "}";
    }
}
```

---

## Héritage

```java
public class Etudiant extends Personne {
    private String ecole;

    public Etudiant(String nom, int age, String ecole) {
        super(nom, age);  // Appelle le constructeur parent
        this.ecole = ecole;
    }

    @Override
    public void sePresenter() {
        super.sePresenter();  // Appelle la méthode parent
        System.out.println("J'étudie à " + ecole);
    }
}
```

---

## Interfaces

```java
public interface Vehicule {
    void demarrer();
    void arreter();
    int getVitesse();
}

public class Voiture implements Vehicule {
    private int vitesse;

    @Override
    public void demarrer() {
        System.out.println("Vroom!");
    }

    @Override
    public void arreter() {
        vitesse = 0;
    }

    @Override
    public int getVitesse() {
        return vitesse;
    }
}
```

---

## Collections

```java
import java.util.*;

// ArrayList
List<String> liste = new ArrayList<>();
liste.add("Alice");
liste.add("Bob");
liste.get(0);
liste.size();
liste.remove(0);
liste.contains("Alice");

// HashMap
Map<String, Integer> map = new HashMap<>();
map.put("Alice", 25);
map.put("Bob", 30);
map.get("Alice");
map.containsKey("Alice");
map.keySet();
map.values();

// HashSet
Set<String> set = new HashSet<>();
set.add("Alice");
set.contains("Alice");

// Parcourir
for (String item : liste) { }
for (Map.Entry<String, Integer> entry : map.entrySet()) {
    entry.getKey();
    entry.getValue();
}
```

---

## Exceptions

```java
try {
    // Code risqué
    int result = 10 / 0;
} catch (ArithmeticException e) {
    System.out.println("Erreur: " + e.getMessage());
} catch (Exception e) {
    // Autre exception
} finally {
    // Toujours exécuté
}

// Lancer une exception
throw new IllegalArgumentException("Message");
```

---

## Entrées/Sorties

```java
import java.util.Scanner;

// Lire depuis la console
Scanner scanner = new Scanner(System.in);
String ligne = scanner.nextLine();
int nombre = scanner.nextInt();
scanner.close();

// Afficher
System.out.println("Texte");
System.out.print("Sans retour à la ligne");
System.out.printf("Format: %d, %s%n", 42, "texte");
```

---

## Fichiers

```java
import java.io.*;
import java.nio.file.*;

// Lire un fichier
String content = Files.readString(Path.of("fichier.txt"));
List<String> lines = Files.readAllLines(Path.of("fichier.txt"));

// Écrire dans un fichier
Files.writeString(Path.of("fichier.txt"), "Contenu");
```

---

## Navigation

→ Fiche suivante : **[Aide-mémoire Bash](02-aide-memoire-bash.md)**
