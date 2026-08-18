---
tags:
  - Java
  - Intermédiaire
  - Pratique
description: "Classes et objets en Java"
estimated_time: "75 min"
fiche_number: 4
total_fiches: 12
cursus: "Java"
---

# 04 - Classes et objets en Java

> **En bref** : À la fin de cette fiche, tu sauras créer une classe Java, instancier des objets, et comprendre la différence entre une classe et un objet. Lecture estimée : 75 min.


## Prérequis

- Fiche [01 - Hello World en Java](01-hello-world.md)
- Fiche [02 - Compilation et exécution en Java](02-compilation-execution.md)
- Fiche [03 - Variables et types de données en Java](03-variables-types.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer une classe Java, instancier des objets, et comprendre la différence entre une classe et un objet.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la Programmation Orientée Objet (POO) ?

**Définition** : La Programmation Orientée Objet est une façon d'organiser le code en regroupant les données et les comportements dans des entités appelées "objets".

**Le problème que la POO résout** :

Sans POO, voici les problèmes rencontrés :

1. **Code éparpillé** : Les variables et les fonctions liées à un même concept sont dispersées partout dans le code.

2. **Difficile à maintenir** : Plus le programme grandit, plus il devient difficile de comprendre quelles parties du code sont liées.

3. **Réutilisation limitée** : Pour réutiliser une fonctionnalité, tu dois copier-coller du code.

**Comment la POO résout ces problèmes** :

| Problème | Solution apportée par la POO |
| -------- | ---------------------------- |
| Code éparpillé | La classe regroupe données et comportements liés |
| Difficile à maintenir | Chaque classe a une responsabilité claire |
| Réutilisation limitée | Une classe peut être réutilisée pour créer plusieurs objets |

**Analogie concrète** : Imagine un plan d'architecte pour une maison. Le plan (la classe) définit les caractéristiques de la maison : nombre de pièces, dimensions, matériaux. À partir de ce plan, tu peux construire plusieurs maisons identiques (les objets). Chaque maison est indépendante : si tu peins une maison en bleu, les autres restent de leur couleur d'origine.

---

### Qu'est-ce qu'une classe ?

**Définition** : Une classe est un modèle (ou plan) qui définit la structure et le comportement d'un type d'objet. Elle contient des attributs (données) et des méthodes (comportements).

**Le problème que les classes résolvent** :

Sans classes, voici le problème :

1. **Pas de structure** : Tu dois gérer des variables séparées pour chaque entité similaire.

**Exemple sans classe** :

```java
// Sans classe : variables séparées pour chaque voiture
String voiture1Marque = "Toyota";
String voiture1Couleur = "Rouge";
int voiture1Annee = 2020;

String voiture2Marque = "Honda";
String voiture2Couleur = "Bleu";
int voiture2Annee = 2019;
// Et ainsi de suite... très répétitif
```

**Exemple avec classe** :

```java
// Avec classe : une structure réutilisable
class Voiture {
    String marque;
    String couleur;
    int annee;
}
// Tu peux créer autant de voitures que tu veux avec cette même structure
```

**Ce qu'une classe n'est PAS** :

- Une classe n'est pas un objet. La classe est le plan, l'objet est la construction réalisée à partir du plan.
- Une classe n'est pas un fichier. Le fichier `.java` contient le code de la classe, mais la classe elle-même est un concept.

---

Le diagramme suivant montre la relation entre une classe et ses objets.

<div class="diagram-design">
<p><a href="../../../diagrams/epitech-01-java-04-classes-objets-1.html">Qu&#x27;est-ce qu&#x27;une classe ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/epitech-01-java-04-classes-objets-1.html" title="Qu&#x27;est-ce qu&#x27;une classe ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

### Qu'est-ce qu'un objet ?

**Définition** : Un objet est une instance concrète d'une classe. Il possède ses propres valeurs pour les attributs définis par la classe.

**Le problème que les objets résolvent** :

Sans objets, voici le problème :

1. **Données non isolées** : Chaque entité n'a pas son propre espace mémoire.

**Comment les objets résolvent ce problème** :

| Problème | Solution |
| -------- | -------- |
| Données non isolées | Chaque objet a ses propres valeurs, indépendantes des autres objets |

**Analogie concrète** : La classe `Voiture` est comme le catalogue du constructeur automobile. Un objet `maVoiture` est ta voiture personnelle, avec sa couleur, son kilométrage, ses rayures. Ta voiture est indépendante de celle de ton voisin, même si elles ont été fabriquées selon le même modèle.

**Comparaison classe vs objet** :

| Classe | Objet |
| ------ | ----- |
| Plan, modèle | Instance, réalisation |
| Définit la structure | Contient les valeurs |
| Une seule définition | Plusieurs instances possibles |
| Écrite une fois | Créé à l'exécution |

---

### Les attributs

**Définition** : Les attributs (aussi appelés "champs" ou "propriétés") sont les variables qui appartiennent à une classe. Ils stockent les données de chaque objet.

**Syntaxe** :

```java
class NomClasse {
    type nomAttribut;
    type autreAttribut;
}
```

**Exemple** :

```java
class Personne {
    String nom;
    int age;
    double taille;
}
```

Dans cet exemple, chaque objet `Personne` aura son propre `nom`, son propre `age`, et sa propre `taille`.

---

### Les méthodes

**Définition** : Les méthodes sont les fonctions qui appartiennent à une classe. Elles définissent les comportements (actions) que les objets peuvent effectuer.

**Syntaxe** :

```java
class NomClasse {
    typeRetour nomMethode() {
        // code
    }
}
```

**Exemple** :

```java
class Personne {
    String nom;
    int age;

    void sePresenter() {
        System.out.println("Je m'appelle " + nom);
        System.out.println("J'ai " + age + " ans");
    }
}
```

La méthode `sePresenter()` peut utiliser les attributs `nom` et `age` de l'objet.

---

### L'instanciation

**Définition** : L'instanciation est l'action de créer un objet à partir d'une classe, en utilisant le mot-clé `new`.

**Syntaxe** :

```java
NomClasse nomObjet = new NomClasse();
```

**Exemple** :

```java
// Création d'un objet Personne
Personne p1 = new Personne();

// Accès aux attributs
p1.nom = "David";
p1.age = 20;

// Appel d'une méthode
p1.sePresenter();
```

**Explication du processus** :

| Partie | Signification |
| ------ | ------------- |
| `Personne` | Le type de l'objet (la classe) |
| `p1` | Le nom de la variable qui référence l'objet |
| `new` | Mot-clé qui crée une nouvelle instance |
| `Personne()` | Appel du constructeur (expliqué dans la fiche suivante) |

---

### L'opérateur point (.)

**Définition** : L'opérateur point `.` permet d'accéder aux attributs et méthodes d'un objet.

**Syntaxe** :

```java
objet.attribut       // Accès à un attribut
objet.methode()      // Appel d'une méthode
```

**Exemples** :

```java
Personne p = new Personne();

// Modifier un attribut
p.nom = "Marie";

// Lire un attribut
System.out.println(p.nom);

// Appeler une méthode
p.sePresenter();
```

---

## Étapes Pratiques

> **Note** : Crée un dossier séparé (par exemple `fiche04/`) pour éviter les conflits de noms avec d'autres fiches : la classe `Compteur` est définie ici et dans la fiche 07 (surcharge), la classe `Etudiant` dans la fiche 10 (collections).

### Étape 1 : Créer une première classe

Crée un fichier `Voiture.java` :

```java
// Fichier : Voiture.java
// Définition de la classe Voiture

class Voiture {
    // Attributs
    String marque;
    String couleur;
    int annee;
    int kilometrage;

    // Méthode pour afficher les informations
    void afficherInfos() {
        System.out.println("Marque : " + marque);
        System.out.println("Couleur : " + couleur);
        System.out.println("Année : " + annee);
        System.out.println("Kilométrage : " + kilometrage + " km");
    }
}
```

---

### Étape 2 : Créer une classe avec main pour tester

Crée un fichier `TestVoiture.java` :

```java
// Fichier : TestVoiture.java
// Programme principal pour tester la classe Voiture

public class TestVoiture {
    public static void main(String[] args) {
        // Création d'un premier objet Voiture
        Voiture v1 = new Voiture();
        v1.marque = "Toyota";
        v1.couleur = "Rouge";
        v1.annee = 2020;
        v1.kilometrage = 45000;

        // Création d'un deuxième objet Voiture
        Voiture v2 = new Voiture();
        v2.marque = "Honda";
        v2.couleur = "Bleu";
        v2.annee = 2019;
        v2.kilometrage = 62000;

        // Affichage des informations
        System.out.println("=== Voiture 1 ===");
        v1.afficherInfos();

        System.out.println();

        System.out.println("=== Voiture 2 ===");
        v2.afficherInfos();
    }
}
```

**Compile et exécute** :

```bash
javac Voiture.java TestVoiture.java && java TestVoiture
```

**Résultat attendu** :

```text
=== Voiture 1 ===
Marque : Toyota
Couleur : Rouge
Année : 2020
Kilométrage : 45000 km

=== Voiture 2 ===
Marque : Honda
Couleur : Bleu
Année : 2019
Kilométrage : 62000 km
```

---

### Étape 3 : Modifier un objet après création

Modifie `TestVoiture.java` pour ajouter des modifications :

```java
public class TestVoiture {
    public static void main(String[] args) {
        Voiture v1 = new Voiture();
        v1.marque = "Toyota";
        v1.couleur = "Rouge";
        v1.annee = 2020;
        v1.kilometrage = 45000;

        System.out.println("=== Avant modification ===");
        v1.afficherInfos();

        // Modification de l'objet
        v1.couleur = "Noir";
        v1.kilometrage = 48000;

        System.out.println();
        System.out.println("=== Après modification ===");
        v1.afficherInfos();
    }
}
```

**Résultat attendu** :

```text
=== Avant modification ===
Marque : Toyota
Couleur : Rouge
Année : 2020
Kilométrage : 45000 km

=== Après modification ===
Marque : Toyota
Couleur : Noir
Année : 2020
Kilométrage : 48000 km
```

---

### Étape 4 : Créer une classe avec plusieurs méthodes

Crée un fichier `Compteur.java` :

```java
// Fichier : Compteur.java
// Classe avec plusieurs méthodes

class Compteur {
    int valeur;

    void incrementer() {
        valeur = valeur + 1;
    }

    void decrementer() {
        valeur = valeur - 1;
    }

    void reinitialiser() {
        valeur = 0;
    }

    void afficher() {
        System.out.println("Valeur : " + valeur);
    }
}
```

Crée un fichier `TestCompteur.java` :

```java
// Fichier : TestCompteur.java
// Test de la classe Compteur

public class TestCompteur {
    public static void main(String[] args) {
        Compteur c = new Compteur();

        c.valeur = 10;
        c.afficher();

        c.incrementer();
        c.incrementer();
        c.incrementer();
        c.afficher();

        c.decrementer();
        c.afficher();

        c.reinitialiser();
        c.afficher();
    }
}
```

**Résultat attendu** :

```text
Valeur : 10
Valeur : 13
Valeur : 12
Valeur : 0
```

---

### Étape 5 : Méthodes avec paramètres

Modifie `Compteur.java` pour ajouter une méthode avec paramètre :

```java
class Compteur {
    int valeur;

    void incrementer() {
        valeur = valeur + 1;
    }

    // Nouvelle méthode avec paramètre
    void ajouterValeur(int n) {
        valeur = valeur + n;
    }

    void definirValeur(int nouvelleValeur) {
        valeur = nouvelleValeur;
    }

    void afficher() {
        System.out.println("Valeur : " + valeur);
    }
}
```

Modifie `TestCompteur.java` :

```java
public class TestCompteur {
    public static void main(String[] args) {
        Compteur c = new Compteur();

        c.definirValeur(5);
        c.afficher();

        c.ajouterValeur(10);
        c.afficher();

        c.ajouterValeur(3);
        c.afficher();
    }
}
```

**Résultat attendu** :

```text
Valeur : 5
Valeur : 15
Valeur : 18
```

---

### Étape 6 : Méthodes avec valeur de retour

Crée un fichier `Rectangle.java` :

```java
// Fichier : Rectangle.java
// Classe avec méthodes qui retournent des valeurs

class Rectangle {
    double largeur;
    double hauteur;

    // Méthode qui calcule et retourne l'aire
    double calculerAire() {
        return largeur * hauteur;
    }

    // Méthode qui calcule et retourne le périmètre
    double calculerPerimetre() {
        return 2 * (largeur + hauteur);
    }

    void afficher() {
        System.out.println("Largeur : " + largeur);
        System.out.println("Hauteur : " + hauteur);
        System.out.println("Aire : " + calculerAire());
        System.out.println("Périmètre : " + calculerPerimetre());
    }
}
```

Crée un fichier `TestRectangle.java` :

```java
// Fichier : TestRectangle.java

public class TestRectangle {
    public static void main(String[] args) {
        Rectangle r = new Rectangle();
        r.largeur = 5.0;
        r.hauteur = 3.0;

        r.afficher();

        System.out.println();

        // Utilisation directe des méthodes avec retour
        double aire = r.calculerAire();
        System.out.println("L'aire stockée dans une variable : " + aire);
    }
}
```

**Résultat attendu** :

```text
Largeur : 5.0
Hauteur : 3.0
Aire : 15.0
Périmètre : 16.0

L'aire stockée dans une variable : 15.0
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac Classe.java Test.java` | Compile la classe et le programme de test |
| `javac *.java` | Compile tous les fichiers Java du dossier |
| `java TestClasse` | Exécute le programme de test |

---

## Pièges Fréquents

### Piège 1 : Oublier new pour créer l'objet

⚠️ **Problème** : NullPointerException ou erreur de compilation

✅ **Solution** : Toujours utiliser `new` pour créer un objet.

```java
// Incorrect
Voiture v;
v.marque = "Toyota";  // ERREUR : v n'est pas initialisé

// Correct
Voiture v = new Voiture();
v.marque = "Toyota";
```

---

### Piège 2 : Confondre la classe et l'objet

⚠️ **Problème** : Essayer d'accéder à un attribut sur la classe au lieu de l'objet

✅ **Solution** : Les attributs appartiennent aux objets, pas à la classe.

```java
// Incorrect
Voiture.marque = "Toyota";  // ERREUR : Voiture est la classe

// Correct
Voiture v = new Voiture();
v.marque = "Toyota";  // v est l'objet
```

---

### Piège 3 : Oublier de compiler toutes les classes

⚠️ **Problème** : Erreur "cannot find symbol" pour une classe

✅ **Solution** : Compiler tous les fichiers nécessaires.

```bash
# Incorrect : seulement le test
javac TestVoiture.java  # ERREUR si Voiture.java n'est pas compilé

# Correct : toutes les classes
javac Voiture.java TestVoiture.java
# ou
javac *.java
```

---

### Piège 4 : Oublier void pour une méthode sans retour

⚠️ **Problème** : Erreur `invalid method declaration; return type required`

✅ **Solution** : Utiliser `void` si la méthode ne retourne rien.

```java
// Incorrect
afficher() {  // ERREUR : type de retour manquant
    System.out.println("test");
}

// Correct
void afficher() {
    System.out.println("test");
}
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre une classe et un objet
- [ ] J'ai créé une classe avec des attributs
- [ ] J'ai créé une classe avec des méthodes
- [ ] J'ai instancié un objet avec `new`
- [ ] J'ai accédé aux attributs avec l'opérateur point `.`
- [ ] J'ai appelé des méthodes sur un objet
- [ ] J'ai créé une méthode avec paramètre
- [ ] J'ai créé une méthode avec valeur de retour

---

## Exercice Pratique

**Énoncé** : Crée une classe `Etudiant` et un programme de test.

**Indications** :

- Crée un fichier `Etudiant.java` avec :
  - Attributs : `nom` (String), `prenom` (String), `age` (int), `moyenne` (double)
  - Méthode `afficherInfos()` : affiche toutes les informations de l'étudiant
  - Méthode `estAdmis()` : retourne `true` si la moyenne est >= 10, `false` sinon
  - Méthode `anniversaire()` : augmente l'âge de 1

- Crée un fichier `TestEtudiant.java` qui :
  - Crée deux étudiants avec des valeurs différentes
  - Affiche leurs informations
  - Vérifie s'ils sont admis
  - Fait vieillir le premier étudiant d'un an et réaffiche son âge

**Résultat attendu** (exemple) :

```text
=== Étudiant 1 ===
Nom : Martin
Prénom : David
Age : 20 ans
Moyenne : 14.5
Admis : true

=== Étudiant 2 ===
Nom : Dupont
Prénom : Pierre
Age : 19 ans
Moyenne : 8.0
Admis : false

=== Après anniversaire ===
David a maintenant 21 ans
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier Etudiant.java** :

```java
// Fichier : Etudiant.java
// Classe représentant un étudiant

class Etudiant {
    String nom;
    String prenom;
    int age;
    double moyenne;

    void afficherInfos() {
        System.out.println("Nom : " + nom);
        System.out.println("Prénom : " + prenom);
        System.out.println("Age : " + age + " ans");
        System.out.println("Moyenne : " + moyenne);
    }

    boolean estAdmis() {
        return moyenne >= 10;
    }

    void anniversaire() {
        age = age + 1;
    }
}
```

**Fichier TestEtudiant.java** :

```java
// Fichier : TestEtudiant.java
// Test de la classe Etudiant

public class TestEtudiant {
    public static void main(String[] args) {
        // Création du premier étudiant
        Etudiant e1 = new Etudiant();
        e1.nom = "Martin";
        e1.prenom = "David";
        e1.age = 20;
        e1.moyenne = 14.5;

        // Création du deuxième étudiant
        Etudiant e2 = new Etudiant();
        e2.nom = "Dupont";
        e2.prenom = "Pierre";
        e2.age = 19;
        e2.moyenne = 8.0;

        // Affichage étudiant 1
        System.out.println("=== Étudiant 1 ===");
        e1.afficherInfos();
        System.out.println("Admis : " + e1.estAdmis());

        System.out.println();

        // Affichage étudiant 2
        System.out.println("=== Étudiant 2 ===");
        e2.afficherInfos();
        System.out.println("Admis : " + e2.estAdmis());

        System.out.println();

        // Anniversaire
        System.out.println("=== Après anniversaire ===");
        e1.anniversaire();
        System.out.println(e1.prenom + " a maintenant " + e1.age + " ans");
    }
}
```

**Compilation et exécution** :

```bash
javac Etudiant.java TestEtudiant.java && java TestEtudiant
```

---

## Navigation

← Fiche précédente : **[Variables et types de données en Java](03-variables-types.md)**

→ Fiche suivante : **[Les constructeurs en Java](05-constructeurs.md)**
