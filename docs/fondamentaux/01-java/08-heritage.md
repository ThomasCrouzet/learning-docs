---
tags:
  - Java
  - Avancé
  - Pratique
description: "L'héritage en Java"
estimated_time: "60 min"
fiche_number: 8
total_fiches: 12
cursus: "Java"
id: "fundamentals.java.heritage"
course_id: "fundamentals.java"
content_type: "lesson"
order: 8
---

# 08 - L'héritage en Java

> **En bref** : À la fin de cette fiche, tu sauras utiliser l'héritage pour créer des classes qui héritent des attributs et méthodes d'une classe parente. Lecture estimée : 60 min.


## Prérequis

- Fiche [04 - Classes et objets en Java](04-classes-objets.md)
- Fiche [05 - Les constructeurs en Java](05-constructeurs.md)
- Fiche [06 - Visibilité et encapsulation en Java](06-visibilite-encapsulation.md)
- Fiche [07 - Méthodes et surcharge en Java](07-methodes-surcharge.md)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser l'héritage pour créer des classes qui héritent des attributs et méthodes d'une classe parente.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'héritage ?

**Définition** : L'héritage est un mécanisme qui permet à une classe (classe enfant) d'acquérir les attributs et méthodes d'une autre classe (classe parente).

**Le problème que l'héritage résout** :

Sans héritage, voici les problèmes rencontrés :

1. **Code dupliqué** : Des classes similaires contiennent le même code répété.

2. **Maintenance difficile** : Si tu modifies une fonctionnalité commune, tu dois la modifier dans chaque classe.

3. **Pas de relation logique** : Les classes similaires ne sont pas liées, ce qui rend le code moins organisé.

**Exemple sans héritage** :

```java
class Chien {
    String nom;
    int age;
    void manger() { System.out.println("Je mange"); }
    void dormir() { System.out.println("Je dors"); }
    void aboyer() { System.out.println("Wouf !"); }
}

class Chat {
    String nom;
    int age;
    void manger() { System.out.println("Je mange"); }  // Dupliqué
    void dormir() { System.out.println("Je dors"); }   // Dupliqué
    void miauler() { System.out.println("Miaou !"); }
}
```

**Exemple avec héritage** :

```java
class Animal {
    String nom;
    int age;
    void manger() { System.out.println("Je mange"); }
    void dormir() { System.out.println("Je dors"); }
}

class Chien extends Animal {
    void aboyer() { System.out.println("Wouf !"); }
}

class Chat extends Animal {
    void miauler() { System.out.println("Miaou !"); }
}
```

**Comment l'héritage résout ces problèmes** :

| Problème | Solution apportée par l'héritage |
| -------- | -------------------------------- |
| Code dupliqué | Le code commun est dans la classe parente |
| Maintenance difficile | Une modification dans la classe parente s'applique à tous les enfants |
| Pas de relation logique | La relation parent-enfant crée une hiérarchie claire |

**Analogie concrète** : L'héritage est comme une famille. Les enfants héritent de certaines caractéristiques de leurs parents (attributs). Ils peuvent aussi avoir leurs propres caractéristiques uniques. Si un parent a les yeux bleus (attribut), les enfants peuvent les avoir aussi sans que ce soit redéfini pour chacun.

Le diagramme suivant illustre une hiérarchie d'héritage classique.

<div class="diagram-design">
<p><a href="../../../diagrams/fondamentaux-01-java-08-heritage-1.html">Qu&#x27;est-ce que l&#x27;héritage ? (HTML + SVG)</a></p>
<iframe src="../../../diagrams/fondamentaux-01-java-08-heritage-1.html" title="Qu&#x27;est-ce que l&#x27;héritage ?" style="width:100%;min-height:440px;border:0;background:transparent"></iframe>
</div>

---

### Le mot-clé extends

**Définition** : `extends` est le mot-clé qui établit la relation d'héritage entre une classe enfant et une classe parente.

**Syntaxe** :

```java
class ClasseEnfant extends ClasseParente {
    // Attributs et méthodes spécifiques à l'enfant
}
```

**Terminologie** :

| Terme | Autre nom | Définition |
| ----- | --------- | ---------- |
| Classe parente | Superclasse, classe de base | La classe dont on hérite |
| Classe enfant | Sous-classe, classe dérivée | La classe qui hérite |

**Règle importante** : En Java, une classe ne peut hériter que d'une seule classe (héritage simple). L'héritage multiple (plusieurs parents) n'existe pas en Java pour les classes.

---

### Le mot-clé super

**Définition** : `super` fait référence à la classe parente. Il permet d'accéder aux attributs, méthodes et constructeurs de la classe parente.

**Utilisations de super** :

| Utilisation | Syntaxe | Description |
| ----------- | ------- | ----------- |
| Appeler le constructeur parent | `super(paramètres);` | Doit être la première instruction du constructeur |
| Appeler une méthode parente | `super.nomMethode();` | Utile quand on redéfinit une méthode |
| Accéder à un attribut parent | `super.attribut` | Rarement utilisé |

**Exemple** :

```java
class Animal {
    String nom;

    Animal(String nom) {
        this.nom = nom;
    }

    void sePresenter() {
        System.out.println("Je suis " + nom);
    }
}

class Chien extends Animal {
    String race;

    Chien(String nom, String race) {
        super(nom);  // Appelle Animal(String nom)
        this.race = race;
    }

    void sePresenter() {
        super.sePresenter();  // Appelle Animal.sePresenter()
        System.out.println("Je suis un " + race);
    }
}
```

---

### La redéfinition de méthodes (Override)

**Définition** : La redéfinition permet à une classe enfant de fournir sa propre implémentation d'une méthode héritée de la classe parente.

**Le problème que la redéfinition résout** :

La classe parente fournit une implémentation générique, mais l'enfant a besoin d'un comportement spécifique.

**Syntaxe** :

```java
class Animal {
    void faireDuBruit() {
        System.out.println("L'animal fait du bruit");
    }
}

class Chien extends Animal {
    @Override  // Annotation optionnelle mais recommandée
    void faireDuBruit() {
        System.out.println("Wouf !");
    }
}
```

**L'annotation @Override** :

| Avec @Override | Sans @Override |
| -------------- | -------------- |
| Le compilateur vérifie qu'une méthode parente existe | Pas de vérification |
| Erreur si la méthode parente n'existe pas | Aucune erreur (crée une nouvelle méthode) |
| Recommandé | Risque d'erreur silencieuse |

**Différence surcharge vs redéfinition** :

| Surcharge (Overloading) | Redéfinition (Overriding) |
| ----------------------- | ------------------------- |
| Même classe | Classe enfant |
| Même nom, paramètres différents | Même nom, mêmes paramètres |
| Plusieurs méthodes coexistent | La méthode enfant remplace celle du parent |

---

### Le modificateur protected

**Définition** : `protected` est un modificateur d'accès qui rend un élément accessible dans la classe, ses sous-classes, et le même package.

**Comparaison des modificateurs** :

| Modificateur | Même classe | Même package | Sous-classe | Partout |
| ------------ | ----------- | ------------ | ----------- | ------- |
| `private` | ✓ | ✗ | ✗ | ✗ |
| (aucun) | ✓ | ✓ | ✗ | ✗ |
| `protected` | ✓ | ✓ | ✓ | ✗ |
| `public` | ✓ | ✓ | ✓ | ✓ |

**Utilisation typique** :

```java
class Animal {
    protected String nom;  // Accessible dans les sous-classes
    private int id;        // Non accessible dans les sous-classes
}

class Chien extends Animal {
    void afficher() {
        System.out.println(nom);  // OK : protected
        // System.out.println(id);  // ERREUR : private
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer une hiérarchie simple

Crée un fichier `Vehicule.java` :

```java
// Fichier : Vehicule.java
// Classe parente

class Vehicule {
    protected String marque;
    protected int annee;

    public Vehicule(String marque, int annee) {
        this.marque = marque;
        this.annee = annee;
    }

    public void afficherInfos() {
        System.out.println("Marque : " + marque);
        System.out.println("Année : " + annee);
    }

    public void demarrer() {
        System.out.println("Le véhicule démarre");
    }
}
```

Crée un fichier `Voiture.java` :

```java
// Fichier : Voiture.java
// Classe enfant

class Voiture extends Vehicule {
    private int nombrePortes;

    public Voiture(String marque, int annee, int nombrePortes) {
        super(marque, annee);  // Appel du constructeur parent
        this.nombrePortes = nombrePortes;
    }

    @Override
    public void afficherInfos() {
        super.afficherInfos();  // Appel de la méthode parente
        System.out.println("Nombre de portes : " + nombrePortes);
    }

    // Méthode spécifique à Voiture
    public void klaxonner() {
        System.out.println("Pouet pouet !");
    }
}
```

Crée un fichier `Moto.java` :

```java
// Fichier : Moto.java
// Autre classe enfant

class Moto extends Vehicule {
    private int cylindree;

    public Moto(String marque, int annee, int cylindree) {
        super(marque, annee);
        this.cylindree = cylindree;
    }

    @Override
    public void afficherInfos() {
        super.afficherInfos();
        System.out.println("Cylindrée : " + cylindree + " cm³");
    }

    @Override
    public void demarrer() {
        System.out.println("La moto vrombrit !");
    }
}
```

---

### Étape 2 : Tester l'héritage

Crée un fichier `TestVehicules.java` :

```java
// Fichier : TestVehicules.java

public class TestVehicules {
    public static void main(String[] args) {
        Voiture v = new Voiture("Toyota", 2020, 5);
        Moto m = new Moto("Yamaha", 2019, 600);

        System.out.println("=== Voiture ===");
        v.afficherInfos();
        v.demarrer();      // Héritée de Vehicule
        v.klaxonner();     // Spécifique à Voiture

        System.out.println();

        System.out.println("=== Moto ===");
        m.afficherInfos();
        m.demarrer();      // Redéfinie dans Moto
    }
}
```

**Compile et exécute** :

```bash
javac Vehicule.java Voiture.java Moto.java TestVehicules.java && java TestVehicules
```

**Résultat attendu** :

```text
=== Voiture ===
Marque : Toyota
Année : 2020
Nombre de portes : 5
Le véhicule démarre
Pouet pouet !

=== Moto ===
Marque : Yamaha
Année : 2019
Cylindrée : 600 cm³
La moto vrombrit !
```

---

### Étape 3 : Exemple avec des employés

Crée un fichier `Employe.java` :

```java
// Fichier : Employe.java

class Employe {
    protected String nom;
    protected double salaireBase;

    public Employe(String nom, double salaireBase) {
        this.nom = nom;
        this.salaireBase = salaireBase;
    }

    public double calculerSalaire() {
        return salaireBase;
    }

    public void afficher() {
        System.out.println("Nom : " + nom);
        System.out.println("Salaire : " + calculerSalaire() + " €");
    }
}
```

Crée un fichier `Manager.java` :

```java
// Fichier : Manager.java

class Manager extends Employe {
    private double bonus;

    public Manager(String nom, double salaireBase, double bonus) {
        super(nom, salaireBase);
        this.bonus = bonus;
    }

    @Override
    public double calculerSalaire() {
        return salaireBase + bonus;
    }

    @Override
    public void afficher() {
        System.out.println("=== Manager ===");
        System.out.println("Nom : " + nom);
        System.out.println("Salaire de base : " + salaireBase + " €");
        System.out.println("Bonus : " + bonus + " €");
        System.out.println("Salaire total : " + calculerSalaire() + " €");
    }
}
```

Crée un fichier `Developpeur.java` :

```java
// Fichier : Developpeur.java

class Developpeur extends Employe {
    private int heuresSupplementaires;
    private static final double TAUX_HEURE_SUP = 25.0;

    public Developpeur(String nom, double salaireBase, int heuresSupplementaires) {
        super(nom, salaireBase);
        this.heuresSupplementaires = heuresSupplementaires;
    }

    @Override
    public double calculerSalaire() {
        return salaireBase + (heuresSupplementaires * TAUX_HEURE_SUP);
    }

    @Override
    public void afficher() {
        System.out.println("=== Développeur ===");
        System.out.println("Nom : " + nom);
        System.out.println("Salaire de base : " + salaireBase + " €");
        System.out.println("Heures sup : " + heuresSupplementaires + " h");
        System.out.println("Salaire total : " + calculerSalaire() + " €");
    }
}
```

---

### Étape 4 : Tester les employés

Crée un fichier `TestEmployes.java` :

```java
// Fichier : TestEmployes.java

public class TestEmployes {
    public static void main(String[] args) {
        Employe e = new Employe("Jean", 2000);
        Manager m = new Manager("Marie", 3000, 500);
        Developpeur d = new Developpeur("Pierre", 2500, 10);

        e.afficher();
        System.out.println();

        m.afficher();
        System.out.println();

        d.afficher();
    }
}
```

**Résultat attendu** :

```text
Nom : Jean
Salaire : 2000.0 €

=== Manager ===
Nom : Marie
Salaire de base : 3000.0 €
Bonus : 500.0 €
Salaire total : 3500.0 €

=== Développeur ===
Nom : Pierre
Salaire de base : 2500.0 €
Heures sup : 10 h
Salaire total : 2750.0 €
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestVehicules` | Exécute le test |

---

## Pièges Fréquents

### Piège 1 : Oublier super() dans le constructeur enfant

⚠️ **Problème** : Erreur "constructor X in class Y cannot be applied"

✅ **Solution** : Appeler `super()` avec les paramètres appropriés.

```java
// Incorrect : le parent n'a pas de constructeur sans paramètre
class Enfant extends Parent {
    Enfant() {
        // super() implicite échoue si Parent n'a pas de constructeur vide
    }
}

// Correct
class Enfant extends Parent {
    Enfant() {
        super("valeur");  // Appel explicite du constructeur parent
    }
}
```

---

### Piège 2 : Accéder à un attribut private du parent

⚠️ **Problème** : Erreur "X has private access in Y"

✅ **Solution** : Utiliser `protected` au lieu de `private`, ou passer par un getter.

```java
// Dans le parent
private String nom;  // Non accessible dans l'enfant
protected String nom;  // Accessible dans l'enfant

// Ou utiliser un getter
public String getNom() { return nom; }
```

---

### Piège 3 : Oublier @Override

⚠️ **Problème** : Une faute de frappe crée une nouvelle méthode au lieu de redéfinir.

✅ **Solution** : Toujours utiliser `@Override` pour être averti d'une erreur.

```java
// Problème : faute de frappe, pas de redéfinition
void afficher() { ... }   // Dans le parent
void affficher() { ... }  // Dans l'enfant (3 f !) - nouvelle méthode

// Solution : @Override détecte l'erreur
@Override
void affficher() { ... }  // ERREUR : méthode parente inexistante
```

---

### Piège 4 : super() n'est pas en première ligne

⚠️ **Problème** : Erreur "call to super must be first statement"

✅ **Solution** : `super()` doit être la première instruction du constructeur.

```java
// Incorrect
Enfant(String nom) {
    this.nom = nom;  // ERREUR : avant super()
    super(nom);
}

// Correct
Enfant(String nom) {
    super(nom);  // Premier
    this.nom = nom;
}
```

---

## Checklist de Validation

- [ ] J'ai compris le concept d'héritage
- [ ] J'ai créé une classe parente et une classe enfant avec `extends`
- [ ] J'ai utilisé `super()` pour appeler le constructeur parent
- [ ] J'ai utilisé `super.methode()` pour appeler une méthode parente
- [ ] J'ai redéfini une méthode avec `@Override`
- [ ] J'ai compris la différence entre `private`, `protected` et `public`
- [ ] J'ai compris la différence entre surcharge et redéfinition

---

## Exercice Pratique

**Énoncé** : Crée une hiérarchie de formes géométriques.

**Indications** :

- Classe parente `Forme` avec :
  - Attribut `couleur` (String)
  - Constructeur avec couleur
  - Méthode `afficherInfos()` qui affiche la couleur
  - Méthode `calculerAire()` qui retourne 0 (sera redéfinie)

- Classe `Rectangle` qui hérite de `Forme` :
  - Attributs `largeur` et `hauteur`
  - Constructeur avec couleur, largeur, hauteur
  - Redéfinir `calculerAire()` pour retourner largeur × hauteur
  - Redéfinir `afficherInfos()` pour afficher aussi les dimensions

- Classe `Cercle` qui hérite de `Forme` :
  - Attribut `rayon`
  - Constructeur avec couleur et rayon
  - Redéfinir `calculerAire()` pour retourner π × rayon²
  - Redéfinir `afficherInfos()` pour afficher aussi le rayon

**Résultat attendu** :

```text
=== Rectangle ===
Couleur : Rouge
Largeur : 5.0
Hauteur : 3.0
Aire : 15.0

=== Cercle ===
Couleur : Bleu
Rayon : 4.0
Aire : 50.26548245743669
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier Forme.java** :

```java
// Fichier : Forme.java

class Forme {
    protected String couleur;

    public Forme(String couleur) {
        this.couleur = couleur;
    }

    public void afficherInfos() {
        System.out.println("Couleur : " + couleur);
    }

    public double calculerAire() {
        return 0;
    }
}
```

**Fichier RectangleForme.java** :

```java
// Fichier : RectangleForme.java

class RectangleForme extends Forme {
    private double largeur;
    private double hauteur;

    public RectangleForme(String couleur, double largeur, double hauteur) {
        super(couleur);
        this.largeur = largeur;
        this.hauteur = hauteur;
    }

    @Override
    public void afficherInfos() {
        super.afficherInfos();
        System.out.println("Largeur : " + largeur);
        System.out.println("Hauteur : " + hauteur);
    }

    @Override
    public double calculerAire() {
        return largeur * hauteur;
    }
}
```

**Fichier Cercle.java** :

```java
// Fichier : Cercle.java

class Cercle extends Forme {
    private double rayon;

    public Cercle(String couleur, double rayon) {
        super(couleur);
        this.rayon = rayon;
    }

    @Override
    public void afficherInfos() {
        super.afficherInfos();
        System.out.println("Rayon : " + rayon);
    }

    @Override
    public double calculerAire() {
        return Math.PI * rayon * rayon;
    }
}
```

**Fichier TestFormes.java** :

```java
// Fichier : TestFormes.java

public class TestFormes {
    public static void main(String[] args) {
        RectangleForme r = new RectangleForme("Rouge", 5.0, 3.0);
        Cercle c = new Cercle("Bleu", 4.0);

        System.out.println("=== Rectangle ===");
        r.afficherInfos();
        System.out.println("Aire : " + r.calculerAire());

        System.out.println();

        System.out.println("=== Cercle ===");
        c.afficherInfos();
        System.out.println("Aire : " + c.calculerAire());
    }
}
```

**Compilation et exécution** :

```bash
javac Forme.java RectangleForme.java Cercle.java TestFormes.java && java TestFormes
```

---

## Navigation

← Fiche précédente : **[Méthodes et surcharge en Java](07-methodes-surcharge.md)**

→ Fiche suivante : **[Interfaces et abstraction en Java](09-interfaces-abstraction.md)**
