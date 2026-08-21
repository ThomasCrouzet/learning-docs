---
tags:
  - Java
  - Avancé
  - Pratique
description: "Les collections en Java"
estimated_time: "65 min"
fiche_number: 10
total_fiches: 12
cursus: "Java"
id: "fundamentals.java.collections"
course_id: "fundamentals.java"
content_type: "lesson"
order: 10
---

# 10 - Les collections en Java

> **En bref** : À la fin de cette fiche, tu sauras utiliser les principales collections Java (ArrayList, HashMap) pour stocker et manipuler des ensembles de données. Lecture estimée : 65 min.


## Prérequis

- Fiche [03 - Variables et types de données en Java](03-variables-types.md)
- Fiche [04 - Classes et objets en Java](04-classes-objets.md)
- Fiche [09 - Interfaces et abstraction en Java](09-interfaces-abstraction.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser les principales collections Java (ArrayList, HashMap) pour stocker et manipuler des ensembles de données.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une collection ?

**Définition** : Une collection est un objet qui regroupe plusieurs éléments en une seule unité. Elle permet de stocker, récupérer et manipuler des données de manière organisée.

**Le problème que les collections résolvent** :

Sans collections, voici les problèmes rencontrés avec les tableaux classiques :

1. **Taille fixe** : Un tableau a une taille définie à la création, impossible à modifier.

2. **Pas de méthodes pratiques** : Ajouter, supprimer, rechercher un élément nécessite d'écrire du code manuellement.

3. **Index obligatoire** : Tu dois connaître la position d'un élément pour y accéder.

**Comment les collections résolvent ces problèmes** :

| Problème | Solution apportée par les collections |
| -------- | ------------------------------------- |
| Taille fixe | La collection grandit automatiquement |
| Pas de méthodes pratiques | Méthodes intégrées : add(), remove(), contains(), etc. |
| Index obligatoire | Certaines collections permettent l'accès par clé (HashMap) |

**Analogie concrète** : Un tableau est comme un casier avec un nombre fixe de cases numérotées. Une ArrayList est comme un sac extensible : tu peux y ajouter autant d'objets que tu veux. Une HashMap est comme un dictionnaire : tu cherches par mot (clé), pas par numéro de page.

---

### La hiérarchie des collections

**Les principales interfaces** :

```text
Iterable
└── Collection (interface)  - listes, ensembles, files
    ├── List → ArrayList, LinkedList
    ├── Set  → HashSet, TreeSet
    └── Queue / Deque

Map (interface)  - PAS une Collection : hiérarchie parallèle
└── HashMap, TreeMap, LinkedHashMap
```

**Choix de la collection selon le besoin** :

| Besoin | Collection |
| ------ | ---------- |
| Liste ordonnée avec accès par index | ArrayList |
| Éléments uniques sans ordre | HashSet |
| Associations clé → valeur | HashMap |
| Liste avec insertions/suppressions fréquentes au milieu | LinkedList |

---

### Les génériques (Generics)

**Définition** : Les génériques permettent de spécifier le type d'éléments qu'une collection peut contenir, assurant la sécurité du typage.

**Syntaxe** :

```java
ArrayList<String> listeNoms = new ArrayList<String>();
ArrayList<Integer> listeNombres = new ArrayList<Integer>();
```

**Le problème que les génériques résolvent** :

Sans génériques, une collection peut contenir n'importe quoi :

```java
// Sans générique (dangereux)
ArrayList liste = new ArrayList();
liste.add("texte");
liste.add(42);
String s = (String) liste.get(1);  // ERREUR à l'exécution : 42 n'est pas un String
```

Avec génériques :

```java
// Avec générique (sûr)
ArrayList<String> liste = new ArrayList<String>();
liste.add("texte");
// liste.add(42);  // ERREUR de compilation : 42 n'est pas un String
String s = liste.get(0);  // Pas de cast nécessaire
```

**Types primitifs et wrappers** :

Les génériques ne fonctionnent pas avec les types primitifs. Il faut utiliser les classes wrappers :

| Type primitif | Classe wrapper |
| ------------- | -------------- |
| `int` | `Integer` |
| `double` | `Double` |
| `boolean` | `Boolean` |
| `char` | `Character` |

```java
// Incorrect
ArrayList<int> nombres;  // ERREUR

// Correct
ArrayList<Integer> nombres;
```

---

### ArrayList

**Définition** : ArrayList est une liste redimensionnable qui stocke des éléments dans l'ordre d'insertion, accessibles par index.

**Import nécessaire** :

```java
import java.util.ArrayList;
```

**Création** :

```java
ArrayList<String> liste = new ArrayList<String>();
// Ou version simplifiée (Java 7+)
ArrayList<String> liste = new ArrayList<>();
```

**Méthodes principales** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `add(element)` | Ajoute à la fin | `liste.add("Alice")` |
| `add(index, element)` | Ajoute à la position | `liste.add(0, "Bob")` |
| `get(index)` | Retourne l'élément | `liste.get(0)` |
| `set(index, element)` | Remplace l'élément | `liste.set(0, "Charlie")` |
| `remove(index)` | Supprime par index | `liste.remove(0)` |
| `remove(object)` | Supprime par valeur | `liste.remove("Alice")` |
| `size()` | Retourne la taille | `liste.size()` |
| `isEmpty()` | Vérifie si vide | `liste.isEmpty()` |
| `contains(element)` | Vérifie la présence | `liste.contains("Alice")` |
| `clear()` | Vide la liste | `liste.clear()` |
| `indexOf(element)` | Retourne l'index | `liste.indexOf("Alice")` |

---

### HashMap

**Définition** : HashMap stocke des paires clé-valeur. Chaque clé est unique et permet d'accéder directement à sa valeur associée.

**Import nécessaire** :

```java
import java.util.HashMap;
```

**Création** :

```java
HashMap<String, Integer> ages = new HashMap<>();
// La clé est String, la valeur est Integer
```

**Méthodes principales** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `put(clé, valeur)` | Ajoute ou remplace | `ages.put("Alice", 25)` |
| `get(clé)` | Retourne la valeur | `ages.get("Alice")` → 25 |
| `remove(clé)` | Supprime l'entrée | `ages.remove("Alice")` |
| `containsKey(clé)` | Vérifie si la clé existe | `ages.containsKey("Alice")` |
| `containsValue(valeur)` | Vérifie si la valeur existe | `ages.containsValue(25)` |
| `size()` | Nombre d'entrées | `ages.size()` |
| `isEmpty()` | Vérifie si vide | `ages.isEmpty()` |
| `clear()` | Vide la map | `ages.clear()` |
| `keySet()` | Retourne les clés | `ages.keySet()` |
| `values()` | Retourne les valeurs | `ages.values()` |

---

### Parcourir une collection

**Parcours d'une ArrayList** :

```java
ArrayList<String> noms = new ArrayList<>();
noms.add("Alice");
noms.add("Bob");
noms.add("Charlie");

// Méthode 1 : boucle for classique
for (int i = 0; i < noms.size(); i++) {
    System.out.println(noms.get(i));
}

// Méthode 2 : boucle for-each (recommandée)
for (String nom : noms) {
    System.out.println(nom);
}
```

**Parcours d'une HashMap** :

```java
HashMap<String, Integer> ages = new HashMap<>();
ages.put("Alice", 25);
ages.put("Bob", 30);

// Parcourir les clés
for (String cle : ages.keySet()) {
    System.out.println(cle + " : " + ages.get(cle));
}

// Parcourir les entrées (clé + valeur)
for (Map.Entry<String, Integer> entree : ages.entrySet()) {
    System.out.println(entree.getKey() + " : " + entree.getValue());
}
```

Pour utiliser `Map.Entry`, ajouter l'import :

```java
import java.util.Map;
```

---

## Étapes Pratiques

> **Note** : Crée un dossier séparé pour les exercices de cette fiche (par exemple `fiche10/`) afin d'éviter les conflits avec les classes des fiches précédentes (notamment `Etudiant` de la fiche 04 et `Contact` de la fiche 12).

### Étape 1 : Utiliser ArrayList

Crée un fichier `TestArrayList.java` :

```java
// Fichier : TestArrayList.java

import java.util.ArrayList;

public class TestArrayList {
    public static void main(String[] args) {
        // Création d'une ArrayList de String
        ArrayList<String> fruits = new ArrayList<>();

        // Ajout d'éléments
        fruits.add("Pomme");
        fruits.add("Banane");
        fruits.add("Orange");

        System.out.println("=== Liste initiale ===");
        System.out.println(fruits);
        System.out.println("Taille : " + fruits.size());

        // Accès par index
        System.out.println();
        System.out.println("=== Accès par index ===");
        System.out.println("Premier fruit : " + fruits.get(0));
        System.out.println("Dernier fruit : " + fruits.get(fruits.size() - 1));

        // Modification
        System.out.println();
        System.out.println("=== Modification ===");
        fruits.set(1, "Fraise");  // Remplace "Banane" par "Fraise"
        System.out.println(fruits);

        // Insertion à une position
        System.out.println();
        System.out.println("=== Insertion ===");
        fruits.add(1, "Kiwi");  // Insère à l'index 1
        System.out.println(fruits);

        // Suppression
        System.out.println();
        System.out.println("=== Suppression ===");
        fruits.remove("Orange");  // Par valeur
        System.out.println("Après suppression de Orange : " + fruits);
        fruits.remove(0);  // Par index
        System.out.println("Après suppression index 0 : " + fruits);

        // Vérification
        System.out.println();
        System.out.println("=== Vérification ===");
        System.out.println("Contient Fraise ? " + fruits.contains("Fraise"));
        System.out.println("Contient Pomme ? " + fruits.contains("Pomme"));
    }
}
```

**Compile et exécute** :

```bash
javac TestArrayList.java && java TestArrayList
```

**Résultat attendu** :

```text
=== Liste initiale ===
[Pomme, Banane, Orange]
Taille : 3

=== Accès par index ===
Premier fruit : Pomme
Dernier fruit : Orange

=== Modification ===
[Pomme, Fraise, Orange]

=== Insertion ===
[Pomme, Kiwi, Fraise, Orange]

=== Suppression ===
Après suppression de Orange : [Pomme, Kiwi, Fraise]
Après suppression index 0 : [Kiwi, Fraise]

=== Vérification ===
Contient Fraise ? true
Contient Pomme ? false
```

---

### Étape 2 : Utiliser HashMap

Crée un fichier `TestHashMap.java` :

```java
// Fichier : TestHashMap.java

import java.util.HashMap;
import java.util.Map;

public class TestHashMap {
    public static void main(String[] args) {
        // Création d'une HashMap
        HashMap<String, Integer> ages = new HashMap<>();

        // Ajout d'entrées
        ages.put("Alice", 25);
        ages.put("Bob", 30);
        ages.put("Charlie", 35);

        System.out.println("=== HashMap initiale ===");
        System.out.println(ages);
        System.out.println("Taille : " + ages.size());

        // Accès par clé
        System.out.println();
        System.out.println("=== Accès par clé ===");
        System.out.println("Âge de Alice : " + ages.get("Alice"));
        System.out.println("Âge de David : " + ages.get("David"));  // null si inexistant

        // Modification
        System.out.println();
        System.out.println("=== Modification ===");
        ages.put("Alice", 26);  // Remplace la valeur existante
        System.out.println("Nouvel âge de Alice : " + ages.get("Alice"));

        // Vérification
        System.out.println();
        System.out.println("=== Vérification ===");
        System.out.println("Contient clé 'Bob' ? " + ages.containsKey("Bob"));
        System.out.println("Contient clé 'David' ? " + ages.containsKey("David"));
        System.out.println("Contient valeur 30 ? " + ages.containsValue(30));

        // Parcours
        System.out.println();
        System.out.println("=== Parcours des clés ===");
        for (String nom : ages.keySet()) {
            System.out.println(nom);
        }

        System.out.println();
        System.out.println("=== Parcours clés + valeurs ===");
        for (Map.Entry<String, Integer> entree : ages.entrySet()) {
            System.out.println(entree.getKey() + " a " + entree.getValue() + " ans");
        }

        // Suppression
        System.out.println();
        System.out.println("=== Suppression ===");
        ages.remove("Charlie");
        System.out.println("Après suppression de Charlie : " + ages);
    }
}
```

**Résultat attendu** :

```text
=== HashMap initiale ===
{Bob=30, Alice=25, Charlie=35}  ← ordre non garanti, peut varier
Taille : 3

=== Accès par clé ===
Âge de Alice : 25
Âge de David : null

=== Modification ===
Nouvel âge de Alice : 26

=== Vérification ===
Contient clé 'Bob' ? true
Contient clé 'David' ? false
Contient valeur 30 ? true

=== Parcours des clés ===
Bob
Alice
Charlie
(ordre non garanti)

=== Parcours clés + valeurs ===
Bob a 30 ans
Alice a 26 ans
Charlie a 35 ans
(ordre non garanti)

=== Suppression ===
Après suppression de Charlie : {Bob=30, Alice=26}  ← ordre non garanti
```

---

### Étape 3 : ArrayList d'objets personnalisés

Crée un fichier `Etudiant.java` :

```java
// Fichier : Etudiant.java

class Etudiant {
    private String nom;
    private double moyenne;

    public Etudiant(String nom, double moyenne) {
        this.nom = nom;
        this.moyenne = moyenne;
    }

    public String getNom() {
        return nom;
    }

    public double getMoyenne() {
        return moyenne;
    }

    @Override
    public String toString() {
        return nom + " (moyenne: " + moyenne + ")";
    }
}
```

Crée un fichier `GestionEtudiants.java` :

```java
// Fichier : GestionEtudiants.java

import java.util.ArrayList;

public class GestionEtudiants {
    public static void main(String[] args) {
        ArrayList<Etudiant> etudiants = new ArrayList<>();

        // Ajout d'étudiants
        etudiants.add(new Etudiant("Alice", 14.5));
        etudiants.add(new Etudiant("Bob", 12.0));
        etudiants.add(new Etudiant("Charlie", 16.5));
        etudiants.add(new Etudiant("Diana", 9.5));

        System.out.println("=== Liste des étudiants ===");
        for (Etudiant e : etudiants) {
            System.out.println(e);
        }

        // Calculer la moyenne de la classe
        double somme = 0;
        for (Etudiant e : etudiants) {
            somme += e.getMoyenne();
        }
        double moyenneClasse = somme / etudiants.size();
        System.out.println();
        System.out.println("Moyenne de la classe : " + moyenneClasse);

        // Trouver les étudiants admis (moyenne >= 10)
        System.out.println();
        System.out.println("=== Étudiants admis ===");
        for (Etudiant e : etudiants) {
            if (e.getMoyenne() >= 10) {
                System.out.println(e.getNom() + " - Admis");
            } else {
                System.out.println(e.getNom() + " - Non admis");
            }
        }

        // Trouver le meilleur étudiant
        Etudiant meilleur = etudiants.get(0);
        for (Etudiant e : etudiants) {
            if (e.getMoyenne() > meilleur.getMoyenne()) {
                meilleur = e;
            }
        }
        System.out.println();
        System.out.println("Meilleur étudiant : " + meilleur);
    }
}
```

**Résultat attendu** :

```text
=== Liste des étudiants ===
Alice (moyenne: 14.5)
Bob (moyenne: 12.0)
Charlie (moyenne: 16.5)
Diana (moyenne: 9.5)

Moyenne de la classe : 13.125

=== Étudiants admis ===
Alice - Admis
Bob - Admis
Charlie - Admis
Diana - Non admis

Meilleur étudiant : Charlie (moyenne: 16.5)
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestArrayList` | Teste ArrayList |
| `java TestHashMap` | Teste HashMap |

---

## Pièges Fréquents

### Piège 1 : Oublier l'import

⚠️ **Problème** : Erreur "cannot find symbol: class ArrayList"

✅ **Solution** : Ajouter l'import en haut du fichier.

```java
import java.util.ArrayList;
import java.util.HashMap;
```

---

### Piège 2 : Utiliser un type primitif avec les génériques

⚠️ **Problème** : Erreur "unexpected type"

✅ **Solution** : Utiliser la classe wrapper.

```java
// Incorrect
ArrayList<int> nombres;

// Correct
ArrayList<Integer> nombres;
```

---

### Piège 3 : IndexOutOfBoundsException

⚠️ **Problème** : Accéder à un index qui n'existe pas.

✅ **Solution** : Vérifier la taille avant d'accéder.

```java
ArrayList<String> liste = new ArrayList<>();
liste.add("A");
// liste.get(5);  // ERREUR : index 5 n'existe pas

// Solution
if (liste.size() > 5) {
    System.out.println(liste.get(5));
}
```

---

### Piège 4 : get() retourne null pour HashMap

⚠️ **Problème** : Appeler une méthode sur null.

✅ **Solution** : Vérifier avec containsKey() ou gérer le null.

```java
HashMap<String, String> map = new HashMap<>();
String valeur = map.get("cle");  // null si inexistant
// valeur.length();  // ERREUR : NullPointerException

// Solution 1
if (map.containsKey("cle")) {
    String v = map.get("cle");
    System.out.println(v.length());
}

// Solution 2
String v = map.getOrDefault("cle", "defaut");
```

---

### Piège 5 : HashMap ne préserve pas l'ordre

⚠️ **Problème** : L'ordre d'itération d'une `HashMap` n'est pas garanti et peut varier d'une exécution à l'autre.

✅ **Solution** : Utiliser une autre implémentation selon le besoin.

```java
// Si tu as besoin de l'ordre d'insertion
import java.util.LinkedHashMap;
LinkedHashMap<String, Integer> ages = new LinkedHashMap<>();

// Si tu as besoin d'un ordre alphabétique (par clé)
import java.util.TreeMap;
TreeMap<String, Integer> ages = new TreeMap<>();

// HashMap : performances optimales, ordre non garanti
HashMap<String, Integer> ages = new HashMap<>();
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre tableau et collection
- [ ] J'ai créé une ArrayList et utilisé add(), get(), remove()
- [ ] J'ai créé une HashMap et utilisé put(), get(), containsKey()
- [ ] J'ai parcouru une ArrayList avec for-each
- [ ] J'ai parcouru une HashMap avec keySet() ou entrySet()
- [ ] J'ai compris les génériques (`ArrayList<String>`)
- [ ] J'ai créé une ArrayList d'objets personnalisés

---

## Exercice Pratique

**Énoncé** : Crée un système de gestion de contacts avec HashMap.

**Indications** :

- Créer une classe `Contact` avec nom, téléphone, email
- Créer une classe `Repertoire` avec une `HashMap<String, Contact>` (clé = nom)
- Méthodes du répertoire :
  - `ajouterContact(Contact c)`
  - `rechercherContact(String nom)` → retourne le Contact ou null
  - `supprimerContact(String nom)`
  - `afficherTous()`
  - `nombreContacts()` → retourne le nombre de contacts

**Résultat attendu** :

```text
=== Ajout de contacts ===
Contact ajouté : Alice

=== Recherche ===
Trouvé : Alice - 0601020304 - alice@email.com

=== Tous les contacts ===
Alice - 0601020304 - alice@email.com
Bob - 0605060708 - bob@email.com

Nombre de contacts : 2

=== Suppression ===
Bob supprimé
Nombre de contacts : 1
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier Contact.java** :

```java
// Fichier : Contact.java

class Contact {
    private String nom;
    private String telephone;
    private String email;

    public Contact(String nom, String telephone, String email) {
        this.nom = nom;
        this.telephone = telephone;
        this.email = email;
    }

    public String getNom() {
        return nom;
    }

    @Override
    public String toString() {
        return nom + " - " + telephone + " - " + email;
    }
}
```

**Fichier Répertoire.java** :

```java
// Fichier : Repertoire.java

import java.util.HashMap;

class Repertoire {
    private HashMap<String, Contact> contacts;

    public Repertoire() {
        contacts = new HashMap<>();
    }

    public void ajouterContact(Contact c) {
        contacts.put(c.getNom(), c);
        System.out.println("Contact ajouté : " + c.getNom());
    }

    public Contact rechercherContact(String nom) {
        return contacts.get(nom);
    }

    public void supprimerContact(String nom) {
        if (contacts.containsKey(nom)) {
            contacts.remove(nom);
            System.out.println(nom + " supprimé");
        } else {
            System.out.println("Contact non trouvé");
        }
    }

    public void afficherTous() {
        for (Contact c : contacts.values()) {
            System.out.println(c);
        }
    }

    public int nombreContacts() {
        return contacts.size();
    }
}
```

**Fichier TestRepertoire.java** :

```java
// Fichier : TestRepertoire.java

public class TestRepertoire {
    public static void main(String[] args) {
        Repertoire rep = new Repertoire();

        System.out.println("=== Ajout de contacts ===");
        rep.ajouterContact(new Contact("Alice", "0601020304", "alice@email.com"));
        rep.ajouterContact(new Contact("Bob", "0605060708", "bob@email.com"));

        System.out.println();
        System.out.println("=== Recherche ===");
        Contact trouve = rep.rechercherContact("Alice");
        if (trouve != null) {
            System.out.println("Trouvé : " + trouve);
        } else {
            System.out.println("Non trouvé");
        }

        System.out.println();
        System.out.println("=== Tous les contacts ===");
        rep.afficherTous();
        System.out.println();
        System.out.println("Nombre de contacts : " + rep.nombreContacts());

        System.out.println();
        System.out.println("=== Suppression ===");
        rep.supprimerContact("Bob");
        System.out.println("Nombre de contacts : " + rep.nombreContacts());
    }
}
```

**Compilation et exécution** :

```bash
javac Contact.java Repertoire.java TestRepertoire.java && java TestRepertoire
```

---

## Navigation

← Fiche précédente : **[Interfaces et abstraction en Java](09-interfaces-abstraction.md)**

→ Fiche suivante : **[Les exceptions en Java](11-exceptions-java.md)**
