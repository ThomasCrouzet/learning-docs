---
tags:
  - Java
  - Avancé
  - Pratique
description: "Interfaces et abstraction en Java"
estimated_time: "65 min"
fiche_number: 9
total_fiches: 12
cursus: "Java"
---

# 09 - Interfaces et abstraction en Java

> **En bref** : À la fin de cette fiche, tu sauras créer et utiliser des interfaces et des classes abstraites pour définir des contrats et des comportements communs. Lecture estimée : 65 min.


## Prérequis

- Fiche [08 - L'héritage en Java](08-heritage.md)
- Comprendre la redéfinition de méthodes
- Comprendre le mot-clé `extends`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des interfaces et des classes abstraites pour définir des contrats et des comportements communs.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une interface ?

**Définition** : Une interface est un contrat qui définit un ensemble de méthodes qu'une classe doit implémenter. Dans sa forme de base, elle ne contient que des signatures de méthodes (pas d'implémentation). Depuis Java 8, une interface peut aussi contenir des méthodes `default` ou `static` avec une implémentation, mais le rôle principal reste le contrat.

**Le problème que les interfaces résolvent** :

Sans interfaces, voici les problèmes rencontrés :

1. **Pas de contrat formel** : Rien ne garantit qu'une classe possède certaines méthodes.

2. **Héritage limité** : Une classe ne peut hériter que d'une seule classe. Impossible de partager des comportements entre classes non liées.

3. **Couplage fort** : Le code dépend de classes concrètes au lieu de comportements abstraits.

**Comment les interfaces résolvent ces problèmes** :

| Problème | Solution apportée par les interfaces |
| -------- | ------------------------------------ |
| Pas de contrat formel | L'interface définit les méthodes obligatoires |
| Héritage limité | Une classe peut implémenter plusieurs interfaces |
| Couplage fort | Le code dépend de l'interface, pas de la classe concrète |

**Analogie concrète** : Une interface est comme une prise électrique standard. Peu importe l'appareil (télévision, lampe, ordinateur), s'il a une prise standard, il peut se brancher. L'interface "Branchable" garantit que tous les appareils ont la méthode "seBrancher()".

**Ce qu'une interface n'est PAS** :

- Une interface n'est pas une classe. Elle ne peut pas être instanciée.
- Une interface n'est pas de l'héritage. On dit qu'une classe "implémente" une interface, pas qu'elle en "hérite".

---

### Syntaxe d'une interface

**Déclaration** :

```java
interface NomInterface {
    // Méthodes (implicitement public abstract)
    void methode1();
    int methode2(String param);
}
```

**Implémentation** :

```java
class MaClasse implements NomInterface {
    @Override
    public void methode1() {
        // Implémentation obligatoire
    }

    @Override
    public int methode2(String param) {
        // Implémentation obligatoire
        return 0;
    }
}
```

**Règles importantes** :

| Règle | Explication |
| ----- | ----------- |
| Toutes les méthodes sont public abstract | Pas besoin de l'écrire explicitement |
| La classe doit implémenter TOUTES les méthodes | Sinon erreur de compilation |
| Une classe peut implémenter plusieurs interfaces | `class A implements B, C, D` |
| Une interface peut étendre une autre interface | `interface A extends B` |

---

### Implémenter plusieurs interfaces

**Syntaxe** :

```java
interface Marchable {
    void marcher();
}

interface Nageable {
    void nager();
}

interface Volable {
    void voler();
}

class Canard implements Marchable, Nageable, Volable {
    @Override
    public void marcher() {
        System.out.println("Le canard marche");
    }

    @Override
    public void nager() {
        System.out.println("Le canard nage");
    }

    @Override
    public void voler() {
        System.out.println("Le canard vole");
    }
}
```

**Avantage** : Le canard peut être traité comme un objet Marchable, Nageable ou Volable selon le contexte.

---

### Qu'est-ce qu'une classe abstraite ?

**Définition** : Une classe abstraite est une classe qui ne peut pas être instanciée et qui peut contenir des méthodes abstraites (sans implémentation) et des méthodes concrètes (avec implémentation).

**Le problème que les classes abstraites résolvent** :

Sans classes abstraites, voici le problème :

1. **Impossible de forcer l'implémentation** : Une classe parente peut avoir des méthodes que les enfants ne devraient pas utiliser telles quelles.

**Comment les classes abstraites résolvent ce problème** :

| Problème | Solution |
| -------- | -------- |
| Forcer l'implémentation | Les méthodes abstraites doivent être redéfinies par les enfants |
| Partager du code commun | Les méthodes concrètes sont héritées |
| Empêcher l'instanciation | La classe abstraite ne peut pas être instanciée directement |

**Analogie concrète** : Une classe abstraite est comme un modèle de document incomplet. Tu as un template avec certaines parties déjà remplies (méthodes concrètes) et des zones à compléter obligatoirement (méthodes abstraites). Tu ne peux pas utiliser le template tel quel, tu dois d'abord compléter les zones vides.

---

### Syntaxe d'une classe abstraite

**Déclaration** :

```java
abstract class Animal {
    // Attribut (comme une classe normale)
    protected String nom;

    // Constructeur (comme une classe normale)
    public Animal(String nom) {
        this.nom = nom;
    }

    // Méthode concrète (avec implémentation)
    public void dormir() {
        System.out.println(nom + " dort");
    }

    // Méthode abstraite (sans implémentation)
    public abstract void faireDuBruit();
}
```

**Utilisation** :

```java
class Chien extends Animal {
    public Chien(String nom) {
        super(nom);
    }

    @Override
    public void faireDuBruit() {
        System.out.println(nom + " aboie : Wouf !");
    }
}

// Dans main :
// Animal a = new Animal("Test");  // ERREUR : ne peut pas instancier une classe abstraite
Chien c = new Chien("Rex");       // OK
c.dormir();                        // Héritée
c.faireDuBruit();                  // Redéfinie
```

---

### Interface vs Classe abstraite

**Comparaison** :

| Caractéristique | Interface | Classe abstraite |
| --------------- | --------- | ---------------- |
| Instanciation | Non | Non |
| Méthodes abstraites | Oui (toutes par défaut) | Oui (avec `abstract`) |
| Méthodes concrètes | Oui (avec `default`) | Oui |
| Attributs | Constantes uniquement (`static final`) | Tous types |
| Constructeur | Non | Oui |
| Héritage multiple | Oui (une classe peut implémenter plusieurs interfaces) | Non (une classe ne peut hériter que d'une classe) |
| Mot-clé | `implements` | `extends` |

**Quand utiliser quoi** :

| Situation | Choix |
| --------- | ----- |
| Définir un contrat sans implémentation | Interface |
| Partager du code entre classes liées | Classe abstraite |
| Permettre l'héritage multiple de comportements | Interface |
| Avoir un constructeur ou des attributs d'instance | Classe abstraite |

---

## Étapes Pratiques

> **Note** : Crée un dossier séparé pour les exercices de cette fiche (par exemple `fiche09/`) afin d'éviter les conflits avec les classes des fiches précédentes (notamment `Produit` de la fiche 05).

### Étape 1 : Créer une interface simple

Crée un fichier `Affichable.java` :

```java
// Fichier : Affichable.java

interface Affichable {
    void afficher();
    String getDescription();
}
```

Crée un fichier `Produit.java` :

```java
// Fichier : Produit.java

class Produit implements Affichable {
    private String nom;
    private double prix;

    public Produit(String nom, double prix) {
        this.nom = nom;
        this.prix = prix;
    }

    @Override
    public void afficher() {
        System.out.println("Produit : " + nom + " - " + prix + " €");
    }

    @Override
    public String getDescription() {
        return nom + " (" + prix + " €)";
    }
}
```

Crée un fichier `Utilisateur.java` :

```java
// Fichier : Utilisateur.java

class Utilisateur implements Affichable {
    private String nom;
    private String email;

    public Utilisateur(String nom, String email) {
        this.nom = nom;
        this.email = email;
    }

    @Override
    public void afficher() {
        System.out.println("Utilisateur : " + nom + " - " + email);
    }

    @Override
    public String getDescription() {
        return nom + " <" + email + ">";
    }
}
```

---

### Étape 2 : Tester l'interface

Crée un fichier `TestInterface.java` :

```java
// Fichier : TestInterface.java

public class TestInterface {
    public static void main(String[] args) {
        Produit p = new Produit("Clavier", 49.99);
        Utilisateur u = new Utilisateur("Inès", "alex@email.com");

        System.out.println("=== Affichage via la méthode afficher() ===");
        p.afficher();
        u.afficher();

        System.out.println();
        System.out.println("=== Affichage via getDescription() ===");
        System.out.println(p.getDescription());
        System.out.println(u.getDescription());

        System.out.println();
        System.out.println("=== Utilisation polymorphe ===");
        // Les deux sont des Affichable
        Affichable[] elements = {p, u};
        for (Affichable a : elements) {
            a.afficher();
        }
    }
}
```

**Compile et exécute** :

```bash
javac Affichable.java Produit.java Utilisateur.java TestInterface.java && java TestInterface
```

**Résultat attendu** :

```text
=== Affichage via la méthode afficher() ===
Produit : Clavier - 49.99 €
Utilisateur : Inès - alex@email.com

=== Affichage via getDescription() ===
Clavier (49.99 €)
Inès <alex@email.com>

=== Utilisation polymorphe ===
Produit : Clavier - 49.99 €
Utilisateur : Inès - alex@email.com
```

---

### Étape 3 : Implémenter plusieurs interfaces

Crée un fichier `Comparaison.java` :

```java
// Fichier : Comparaison.java

// On ne nomme PAS cette interface "Comparable" car java.lang.Comparable existe déjà.
// Utiliser le même nom provoquerait un conflit de compilation.
interface Comparaison {
    int comparer(Object autre);
}
```

Crée un fichier `Serialisable.java` :

```java
// Fichier : Serialisable.java

interface Serialisable {
    String versTexte();
}
```

Crée un fichier `Article.java` :

```java
// Fichier : Article.java

class Article implements Affichable, Comparaison, Serialisable {
    private String nom;
    private double prix;

    public Article(String nom, double prix) {
        this.nom = nom;
        this.prix = prix;
    }

    // Implémentation de Affichable
    @Override
    public void afficher() {
        System.out.println("Article : " + nom + " - " + prix + " €");
    }

    @Override
    public String getDescription() {
        return nom;
    }

    // Implémentation de Comparaison
    @Override
    public int comparer(Object autre) {
        if (autre instanceof Article) {
            Article a = (Article) autre;
            if (this.prix < a.prix) return -1;
            if (this.prix > a.prix) return 1;
            return 0;
        }
        return 0;
    }

    // Implémentation de Serialisable
    @Override
    public String versTexte() {
        return "Article{nom='" + nom + "', prix=" + prix + "}";
    }

    public double getPrix() {
        return prix;
    }
}
```

---

### Étape 4 : Créer une classe abstraite

Crée un fichier `FormeAbstraite.java` :

```java
// Fichier : FormeAbstraite.java
// On nomme cette classe "FormeAbstraite" pour éviter un conflit avec la classe
// concrète "Forme" de la fiche 08 si les fichiers sont dans le même dossier.

abstract class FormeAbstraite {
    protected String couleur;

    public FormeAbstraite(String couleur) {
        this.couleur = couleur;
    }

    // Méthode concrète (héritée telle quelle)
    public void afficherCouleur() {
        System.out.println("Couleur : " + couleur);
    }

    // Méthodes abstraites (à implémenter par les enfants)
    public abstract double calculerAire();
    public abstract double calculerPerimetre();

    // Méthode concrète qui utilise les méthodes abstraites
    public void afficherInfos() {
        afficherCouleur();
        System.out.println("Aire : " + calculerAire());
        System.out.println("Périmètre : " + calculerPerimetre());
    }
}
```

Crée un fichier `Carre.java` :

```java
// Fichier : Carre.java

class Carre extends FormeAbstraite {
    private double cote;

    public Carre(String couleur, double cote) {
        super(couleur);
        this.cote = cote;
    }

    @Override
    public double calculerAire() {
        return cote * cote;
    }

    @Override
    public double calculerPerimetre() {
        return 4 * cote;
    }
}
```

Crée un fichier `CercleAbstrait.java` :

```java
// Fichier : CercleAbstrait.java

class CercleAbstrait extends FormeAbstraite {
    private double rayon;

    public CercleAbstrait(String couleur, double rayon) {
        super(couleur);
        this.rayon = rayon;
    }

    @Override
    public double calculerAire() {
        return Math.PI * rayon * rayon;
    }

    @Override
    public double calculerPerimetre() {
        return 2 * Math.PI * rayon;
    }
}
```

---

### Étape 5 : Tester la classe abstraite

Crée un fichier `TestAbstrait.java` :

```java
// Fichier : TestAbstrait.java

public class TestAbstrait {
    public static void main(String[] args) {
        // FormeAbstraite f = new FormeAbstraite("Rouge");  // ERREUR : classe abstraite

        Carre c = new Carre("Rouge", 5);
        CercleAbstrait ce = new CercleAbstrait("Bleu", 3);

        System.out.println("=== Carré ===");
        c.afficherInfos();

        System.out.println();

        System.out.println("=== Cercle ===");
        ce.afficherInfos();

        System.out.println();

        // Polymorphisme avec classe abstraite
        System.out.println("=== Polymorphisme ===");
        FormeAbstraite[] formes = {c, ce};
        for (FormeAbstraite f : formes) {
            System.out.println("Aire : " + f.calculerAire());
        }
    }
}
```

**Résultat attendu** :

```text
=== Carré ===
Couleur : Rouge
Aire : 25.0
Périmètre : 20.0

=== Cercle ===
Couleur : Bleu
Aire : 28.274333882308138
Périmètre : 18.84955592153876

=== Polymorphisme ===
Aire : 25.0
Aire : 28.274333882308138
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestInterface` | Exécute le test des interfaces |
| `java TestAbstrait` | Exécute le test des classes abstraites |

---

## Pièges Fréquents

### Piège 1 : Oublier d'implémenter toutes les méthodes de l'interface

⚠️ **Problème** : Erreur "X is not abstract and does not override abstract method"

✅ **Solution** : Implémenter toutes les méthodes de l'interface.

```java
interface Affichable {
    void afficher();
    String getDescription();
}

// Incorrect : manque getDescription()
class MaClasse implements Affichable {
    public void afficher() { }
    // ERREUR : getDescription() manquant
}

// Correct
class MaClasse implements Affichable {
    public void afficher() { }
    public String getDescription() { return ""; }
}
```

---

### Piège 2 : Oublier public dans l'implémentation

⚠️ **Problème** : Erreur "attempting to assign weaker access privileges"

✅ **Solution** : Les méthodes d'interface sont implicitement public.

```java
// Dans l'interface
void afficher();  // Implicitement public

// Incorrect dans la classe
void afficher() { }  // Package-private, moins accessible que public

// Correct
public void afficher() { }
```

---

### Piège 3 : Instancier une classe abstraite

⚠️ **Problème** : Erreur "X is abstract; cannot be instantiated"

✅ **Solution** : Instancier une sous-classe concrète.

```java
// Incorrect
FormeAbstraite f = new FormeAbstraite("Rouge");  // ERREUR

// Correct
FormeAbstraite f = new Carre("Rouge", 5);  // Polymorphisme
```

---

### Piège 4 : Confondre extends et implements

⚠️ **Problème** : Erreur de syntaxe.

✅ **Solution** :

- `extends` pour les classes (héritage)
- `implements` pour les interfaces

```java
// Incorrect
class MaClasse extends MonInterface { }  // ERREUR

// Correct
class MaClasse implements MonInterface { }
class MaClasse extends MaClasseParente { }
class MaClasse extends MaClasseParente implements MonInterface { }
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est une interface
- [ ] J'ai créé une interface avec des méthodes
- [ ] J'ai implémenté une interface dans une classe
- [ ] J'ai implémenté plusieurs interfaces dans une classe
- [ ] J'ai compris ce qu'est une classe abstraite
- [ ] J'ai créé une classe abstraite avec méthodes abstraites et concrètes
- [ ] J'ai compris la différence entre interface et classe abstraite

---

## Exercice Pratique

**Énoncé** : Crée un système de notification avec interfaces et classe abstraite.

**Indications** :

- Interface `Envoyable` avec méthode `envoyer(String destinataire, String message)`
- Classe abstraite `Notification` avec :
  - Attribut `dateCreation` (String)
  - Méthode abstraite `formater(String message)`
  - Méthode concrète `getDateCreation()`

- Classe `EmailNotification` qui :
  - Étend `Notification`
  - Implémente `Envoyable`
  - Formate le message avec "[EMAIL]" devant

- Classe `SMSNotification` qui :
  - Étend `Notification`
  - Implémente `Envoyable`
  - Formate le message avec "[SMS]" devant et tronque à 160 caractères

**Résultat attendu** :

```text
=== Email ===
Date : 2024-01-15
Envoi à alex@email.com : [EMAIL] Bonjour, ceci est un test !

=== SMS ===
Date : 2024-01-15
Envoi à 0612345678 : [SMS] Message court
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier Envoyable.java** :

```java
// Fichier : Envoyable.java

interface Envoyable {
    void envoyer(String destinataire, String message);
}
```

**Fichier Notification.java** :

```java
// Fichier : Notification.java

abstract class Notification {
    protected String dateCreation;

    public Notification(String dateCreation) {
        this.dateCreation = dateCreation;
    }

    public abstract String formater(String message);

    public String getDateCreation() {
        return dateCreation;
    }
}
```

**Fichier EmailNotification.java** :

```java
// Fichier : EmailNotification.java

class EmailNotification extends Notification implements Envoyable {

    public EmailNotification(String dateCreation) {
        super(dateCreation);
    }

    @Override
    public String formater(String message) {
        return "[EMAIL] " + message;
    }

    @Override
    public void envoyer(String destinataire, String message) {
        System.out.println("Envoi à " + destinataire + " : " + formater(message));
    }
}
```

**Fichier SMSNotification.java** :

```java
// Fichier : SMSNotification.java

class SMSNotification extends Notification implements Envoyable {

    public SMSNotification(String dateCreation) {
        super(dateCreation);
    }

    @Override
    public String formater(String message) {
        String formate = "[SMS] " + message;
        if (formate.length() > 160) {
            return formate.substring(0, 160);
        }
        return formate;
    }

    @Override
    public void envoyer(String destinataire, String message) {
        System.out.println("Envoi à " + destinataire + " : " + formater(message));
    }
}
```

**Fichier TestNotifications.java** :

```java
// Fichier : TestNotifications.java

public class TestNotifications {
    public static void main(String[] args) {
        EmailNotification email = new EmailNotification("2024-01-15");
        SMSNotification sms = new SMSNotification("2024-01-15");

        System.out.println("=== Email ===");
        System.out.println("Date : " + email.getDateCreation());
        email.envoyer("alex@email.com", "Bonjour, ceci est un test !");

        System.out.println();

        System.out.println("=== SMS ===");
        System.out.println("Date : " + sms.getDateCreation());
        sms.envoyer("0612345678", "Message court");
    }
}
```

**Compilation et exécution** :

```bash
javac Envoyable.java Notification.java EmailNotification.java SMSNotification.java TestNotifications.java && java TestNotifications
```

---

## Navigation

← Fiche précédente : **[L'héritage en Java](08-heritage.md)**

→ Fiche suivante : **[Les collections en Java](10-collections.md)**
