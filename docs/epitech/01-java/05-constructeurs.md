---
tags:
  - Java
  - Intermédiaire
  - Pratique
description: "Les constructeurs en Java"
estimated_time: "60 min"
fiche_number: 5
total_fiches: 12
cursus: "Java"
---

# 05 - Les constructeurs en Java

> **En bref** : À la fin de cette fiche, tu sauras créer et utiliser des constructeurs pour initialiser les objets lors de leur création. Lecture estimée : 60 min.


## Prérequis

- Fiche [04 - Classes et objets en Java](04-classes-objets.md)
- Savoir créer une classe avec des attributs et des méthodes
- Savoir instancier un objet avec `new`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer et utiliser des constructeurs pour initialiser les objets lors de leur création.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un constructeur ?

**Définition** : Un constructeur est une méthode spéciale appelée automatiquement lors de la création d'un objet avec `new`. Il sert à initialiser les attributs de l'objet.

**Le problème que les constructeurs résolvent** :

Sans constructeur explicite, voici les problèmes rencontrés :

1. **Initialisation oubliée** : Tu peux oublier d'initialiser certains attributs après avoir créé l'objet.

2. **Code répétitif** : Tu dois écrire les mêmes lignes d'initialisation pour chaque objet créé.

3. **Objet dans un état invalide** : Un objet peut exister avec des attributs non définis (valeurs par défaut).

**Exemple sans constructeur** :

```java
Personne p1 = new Personne();
p1.nom = "Emma";
p1.age = 20;

Personne p2 = new Personne();
p2.nom = "Pierre";
// Oubli : p2.age n'est pas initialisé !
```

**Exemple avec constructeur** :

```java
// Le constructeur oblige à fournir les valeurs
Personne p1 = new Personne("Emma", 20);
Personne p2 = new Personne("Pierre", 25);
// Impossible d'oublier d'initialiser
```

**Comment les constructeurs résolvent ces problèmes** :

| Problème | Solution apportée par les constructeurs |
| -------- | --------------------------------------- |
| Initialisation oubliée | Le constructeur force à fournir les valeurs nécessaires |
| Code répétitif | L'initialisation est centralisée dans le constructeur |
| État invalide | L'objet est toujours créé avec des valeurs cohérentes |

**Analogie concrète** : Le constructeur est comme un formulaire d'inscription. Quand tu t'inscris à une école (création de l'objet), le formulaire (constructeur) t'oblige à renseigner ton nom, prénom et date de naissance. Tu ne peux pas t'inscrire avec un formulaire vide.

**Ce qu'un constructeur n'est PAS** :

- Un constructeur n'est pas une méthode ordinaire. Il n'a pas de type de retour (même pas `void`).
- Un constructeur n'est pas appelé manuellement. Il est appelé automatiquement par `new`.

---

### Le constructeur par défaut

**Définition** : Le constructeur par défaut est un constructeur sans paramètres. Si tu n'écris aucun constructeur, Java en crée un automatiquement (vide).

**Comportement automatique** :

| Situation | Ce que Java fait |
| --------- | ---------------- |
| Aucun constructeur défini | Java crée un constructeur vide automatiquement |
| Au moins un constructeur défini | Java ne crée pas de constructeur par défaut |

**Exemple** :

```java
// Sans constructeur explicite
class Voiture {
    String marque;
}

// Java crée automatiquement :
// Voiture() { }

// Tu peux donc écrire :
Voiture v = new Voiture();  // OK
```

**Important** : Dès que tu définis un constructeur (avec ou sans paramètres), Java ne crée plus de constructeur par défaut automatiquement.

```java
class Voiture {
    String marque;

    // Constructeur avec paramètre
    Voiture(String m) {
        marque = m;
    }
}

// Maintenant ceci ne fonctionne plus :
// Voiture v = new Voiture();  // ERREUR : pas de constructeur sans paramètre
```

---

### La syntaxe d'un constructeur

**Règles de syntaxe** :

1. Le nom du constructeur est **identique** au nom de la classe
2. Le constructeur n'a **pas de type de retour** (pas même `void`)
3. Le constructeur peut avoir des **paramètres**

**Syntaxe** :

```java
class NomClasse {
    // Constructeur
    NomClasse(paramètres) {
        // Initialisation
    }
}
```

**Comparaison constructeur vs méthode** :

| Constructeur | Méthode |
| ------------ | ------- |
| `Voiture(String m) { }` | `void demarrer() { }` |
| Pas de type de retour | Type de retour obligatoire |
| Nom = nom de la classe | Nom au choix |
| Appelé par `new` | Appelé sur l'objet |

---

### Le mot-clé this

**Définition** : `this` est une référence vers l'objet courant. Il permet de distinguer les attributs de la classe des paramètres du constructeur quand ils ont le même nom.

**Le problème que this résout** :

```java
class Personne {
    String nom;

    Personne(String nom) {
        nom = nom;  // PROBLÈME : quelle variable est quoi ?
    }
}
```

Dans cet exemple, `nom = nom` assigne le paramètre à lui-même. L'attribut n'est pas modifié.

**Comment this résout ce problème** :

```java
class Personne {
    String nom;

    Personne(String nom) {
        this.nom = nom;  // this.nom = attribut, nom = paramètre
    }
}
```

**Explication** :

| Expression | Signification |
| ---------- | ------------- |
| `this.nom` | L'attribut `nom` de l'objet courant |
| `nom` | Le paramètre du constructeur |

**Analogie concrète** : Dans un formulaire, tu as un champ "Nom" (l'attribut) et tu dois y écrire ton nom (le paramètre). `this.nom = nom` signifie "dans le champ 'Nom' de ce formulaire, écris la valeur que tu as fournie".

---

### La surcharge de constructeurs

**Définition** : La surcharge permet de définir plusieurs constructeurs dans une même classe, avec des paramètres différents.

**Le problème que la surcharge résout** :

Sans surcharge, tu es limité à une seule façon de créer un objet. Dans certains cas, tu veux créer un objet avec toutes les informations. Dans d'autres cas, tu veux le créer avec seulement certaines.

**Exemple de surcharge** :

```java
class Personne {
    String nom;
    int age;

    // Constructeur avec tous les paramètres
    Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    // Constructeur avec seulement le nom
    Personne(String nom) {
        this.nom = nom;
        this.age = 0;  // Valeur par défaut
    }

    // Constructeur sans paramètre
    Personne() {
        this.nom = "Inconnu";
        this.age = 0;
    }
}
```

**Utilisation** :

```java
Personne p1 = new Personne("Emma", 20);  // Utilise le premier constructeur
Personne p2 = new Personne("Pierre");   // Utilise le deuxième constructeur
Personne p3 = new Personne();           // Utilise le troisième constructeur
```

---

### Appeler un constructeur depuis un autre constructeur

**Définition** : `this()` permet d'appeler un autre constructeur de la même classe depuis un constructeur.

**Règle** : `this()` doit être la première instruction du constructeur.

**Exemple** :

```java
class Personne {
    String nom;
    int age;

    // Constructeur principal
    Personne(String nom, int age) {
        this.nom = nom;
        this.age = age;
    }

    // Constructeur qui appelle le constructeur principal
    Personne(String nom) {
        this(nom, 0);  // Appelle Personne(String, int) avec age = 0
    }

    // Constructeur sans paramètre
    Personne() {
        this("Inconnu");  // Appelle Personne(String) avec nom = "Inconnu"
    }
}
```

**Avantage** : Le code d'initialisation n'est écrit qu'une seule fois (dans le constructeur principal).

---

## Étapes Pratiques

> **Note** : Crée un dossier séparé pour les exercices de cette fiche (par exemple `fiche05/`) afin d'éviter les conflits avec les classes des autres fiches (notamment `Produit` de la fiche 09).

### Étape 1 : Créer une classe avec un constructeur simple

Crée un fichier `Produit.java` :

```java
// Fichier : Produit.java
// Classe avec un constructeur

class Produit {
    String nom;
    double prix;
    int quantite;

    // Constructeur
    Produit(String nom, double prix, int quantite) {
        this.nom = nom;
        this.prix = prix;
        this.quantite = quantite;
    }

    void afficher() {
        System.out.println("Produit : " + nom);
        System.out.println("Prix : " + prix + " €");
        System.out.println("Quantité : " + quantite);
    }

    double calculerTotal() {
        return prix * quantite;
    }
}
```

---

### Étape 2 : Tester le constructeur

Crée un fichier `TestProduit.java` :

```java
// Fichier : TestProduit.java

public class TestProduit {
    public static void main(String[] args) {
        // Création avec le constructeur
        Produit p1 = new Produit("Clavier", 49.99, 3);
        Produit p2 = new Produit("Souris", 29.99, 5);

        System.out.println("=== Produit 1 ===");
        p1.afficher();
        System.out.println("Total : " + p1.calculerTotal() + " €");

        System.out.println();

        System.out.println("=== Produit 2 ===");
        p2.afficher();
        System.out.println("Total : " + p2.calculerTotal() + " €");
    }
}
```

**Compile et exécute** :

```bash
javac Produit.java TestProduit.java && java TestProduit
```

**Résultat attendu** :

```text
=== Produit 1 ===
Produit : Clavier
Prix : 49.99 €
Quantité : 3
Total : 149.97 €

=== Produit 2 ===
Produit : Souris
Prix : 29.99 €
Quantité : 5
Total : 149.95 €
```

---

### Étape 3 : Ajouter la surcharge de constructeurs

Modifie `Produit.java` pour ajouter d'autres constructeurs :

```java
class Produit {
    String nom;
    double prix;
    int quantite;

    // Constructeur complet
    Produit(String nom, double prix, int quantite) {
        this.nom = nom;
        this.prix = prix;
        this.quantite = quantite;
    }

    // Constructeur avec quantité par défaut (1)
    Produit(String nom, double prix) {
        this(nom, prix, 1);  // Appelle le constructeur complet
    }

    // Constructeur avec seulement le nom
    Produit(String nom) {
        this(nom, 0.0, 0);  // Prix et quantité à définir plus tard
    }

    void afficher() {
        System.out.println("Produit : " + nom);
        System.out.println("Prix : " + prix + " €");
        System.out.println("Quantité : " + quantite);
    }
}
```

---

### Étape 4 : Tester les différents constructeurs

Modifie `TestProduit.java` :

```java
public class TestProduit {
    public static void main(String[] args) {
        // Constructeur complet
        Produit p1 = new Produit("Clavier", 49.99, 3);

        // Constructeur avec quantité par défaut
        Produit p2 = new Produit("Souris", 29.99);

        // Constructeur avec seulement le nom
        Produit p3 = new Produit("Écran");

        System.out.println("=== Produit 1 (constructeur complet) ===");
        p1.afficher();

        System.out.println();

        System.out.println("=== Produit 2 (quantité par défaut) ===");
        p2.afficher();

        System.out.println();

        System.out.println("=== Produit 3 (seulement le nom) ===");
        p3.afficher();
    }
}
```

**Résultat attendu** :

```text
=== Produit 1 (constructeur complet) ===
Produit : Clavier
Prix : 49.99 €
Quantité : 3

=== Produit 2 (quantité par défaut) ===
Produit : Souris
Prix : 29.99 €
Quantité : 1

=== Produit 3 (seulement le nom) ===
Produit : Écran
Prix : 0.0 €
Quantité : 0
```

---

### Étape 5 : Exemple complet avec Livre

Crée un fichier `Livre.java` :

```java
// Fichier : Livre.java
// Classe représentant un livre

class Livre {
    String titre;
    String auteur;
    int nombrePages;
    double prix;
    boolean disponible;

    // Constructeur complet
    Livre(String titre, String auteur, int nombrePages, double prix, boolean disponible) {
        this.titre = titre;
        this.auteur = auteur;
        this.nombrePages = nombrePages;
        this.prix = prix;
        this.disponible = disponible;
    }

    // Constructeur pour livre disponible par défaut
    Livre(String titre, String auteur, int nombrePages, double prix) {
        this(titre, auteur, nombrePages, prix, true);
    }

    // Constructeur minimal (livre gratuit, disponible)
    Livre(String titre, String auteur) {
        this(titre, auteur, 0, 0.0, true);
    }

    void afficher() {
        System.out.println("Titre : " + titre);
        System.out.println("Auteur : " + auteur);
        System.out.println("Pages : " + nombrePages);
        System.out.println("Prix : " + prix + " €");
        System.out.println("Disponible : " + (disponible ? "Oui" : "Non"));
    }
}
```

Crée un fichier `TestLivre.java` :

```java
// Fichier : TestLivre.java

public class TestLivre {
    public static void main(String[] args) {
        Livre l1 = new Livre("1984", "George Orwell", 328, 8.90, true);
        Livre l2 = new Livre("Le Petit Prince", "Saint-Exupéry", 96, 7.50);
        Livre l3 = new Livre("Notes personnelles", "Moi");

        System.out.println("=== Livre 1 ===");
        l1.afficher();

        System.out.println();

        System.out.println("=== Livre 2 ===");
        l2.afficher();

        System.out.println();

        System.out.println("=== Livre 3 ===");
        l3.afficher();
    }
}
```

**Résultat attendu** :

```text
=== Livre 1 ===
Titre : 1984
Auteur : George Orwell
Pages : 328
Prix : 8.9 €
Disponible : Oui

=== Livre 2 ===
Titre : Le Petit Prince
Auteur : Saint-Exupéry
Pages : 96
Prix : 7.5 €
Disponible : Oui

=== Livre 3 ===
Titre : Notes personnelles
Auteur : Moi
Pages : 0
Prix : 0.0 €
Disponible : Oui
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac Classe.java Test.java` | Compile les fichiers |
| `javac *.java && java TestClasse` | Compile et exécute |

---

## Pièges Fréquents

### Piège 1 : Ajouter void devant le constructeur

⚠️ **Problème** : Le "constructeur" devient une méthode ordinaire et n'est pas appelé par `new`.

✅ **Solution** : Ne jamais mettre de type de retour (même pas `void`) devant un constructeur.

```java
// Incorrect : c'est une méthode, pas un constructeur
void Produit(String nom) {
    this.nom = nom;
}

// Correct : c'est un constructeur
Produit(String nom) {
    this.nom = nom;
}
```

---

### Piège 2 : Oublier this quand les noms sont identiques

⚠️ **Problème** : L'attribut n'est pas modifié.

✅ **Solution** : Utiliser `this.` pour distinguer l'attribut du paramètre.

```java
// Incorrect : n'initialise pas l'attribut
Produit(String nom) {
    nom = nom;  // Assigne le paramètre à lui-même
}

// Correct
Produit(String nom) {
    this.nom = nom;  // Assigne le paramètre à l'attribut
}
```

---

### Piège 3 : Plus de constructeur par défaut après définition

⚠️ **Problème** : Erreur "cannot find symbol" ou "no suitable constructor"

✅ **Solution** : Si tu définis un constructeur avec paramètres et que tu veux aussi un constructeur sans paramètre, tu dois le définir explicitement.

```java
class Produit {
    String nom;

    Produit(String nom) {
        this.nom = nom;
    }

    // Sans ceci, new Produit() ne fonctionnera pas
    Produit() {
        this.nom = "Sans nom";
    }
}
```

---

### Piège 4 : this() n'est pas en première ligne

⚠️ **Problème** : Erreur "call to this must be first statement in constructor"

✅ **Solution** : `this()` doit toujours être la première instruction.

```java
// Incorrect
Produit(String nom) {
    System.out.println("Création");  // ERREUR : avant this()
    this(nom, 0.0);
}

// Correct
Produit(String nom) {
    this(nom, 0.0);  // Première instruction
    System.out.println("Création");
}
```

---

## Checklist de Validation

- [ ] J'ai compris ce qu'est un constructeur et son rôle
- [ ] J'ai créé un constructeur avec paramètres
- [ ] J'ai utilisé `this.` pour distinguer attributs et paramètres
- [ ] J'ai compris la surcharge de constructeurs
- [ ] J'ai créé plusieurs constructeurs dans une même classe
- [ ] J'ai utilisé `this()` pour appeler un autre constructeur
- [ ] J'ai compris qu'un constructeur n'a pas de type de retour

---

## Exercice Pratique

**Énoncé** : Crée une classe `CompteBancaire` avec plusieurs constructeurs.

**Indications** :

- Attributs : `titulaire` (String), `numero` (String), `solde` (double)
- Constructeur complet avec les trois paramètres
- Constructeur avec titulaire et numéro (solde = 0)
- Constructeur avec seulement le titulaire (numéro généré automatiquement avec "CB-" + titulaire, solde = 0)
- Méthode `afficher()` pour afficher les informations
- Méthode `deposer(double montant)` pour ajouter au solde
- Méthode `retirer(double montant)` pour retirer du solde (si suffisant)

**Résultat attendu** :

```text
=== Compte 1 ===
Titulaire : Emma Martin
Numéro : 123456
Solde : 1000.0 €

=== Compte 2 ===
Titulaire : Pierre Dupont
Numéro : 789012
Solde : 0.0 €

=== Compte 3 ===
Titulaire : Marie
Numéro : CB-Marie
Solde : 0.0 €

=== Après opérations ===
Solde compte 1 après dépôt de 500 : 1500.0 €
Solde compte 1 après retrait de 200 : 1300.0 €
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier CompteBancaire.java** :

```java
// Fichier : CompteBancaire.java

class CompteBancaire {
    String titulaire;
    String numero;
    double solde;

    // Constructeur complet
    CompteBancaire(String titulaire, String numero, double solde) {
        this.titulaire = titulaire;
        this.numero = numero;
        this.solde = solde;
    }

    // Constructeur avec solde par défaut (0)
    CompteBancaire(String titulaire, String numero) {
        this(titulaire, numero, 0.0);
    }

    // Constructeur avec numéro généré automatiquement
    CompteBancaire(String titulaire) {
        this(titulaire, "CB-" + titulaire, 0.0);
    }

    void afficher() {
        System.out.println("Titulaire : " + titulaire);
        System.out.println("Numéro : " + numero);
        System.out.println("Solde : " + solde + " €");
    }

    void deposer(double montant) {
        solde = solde + montant;
    }

    void retirer(double montant) {
        if (montant <= solde) {
            solde = solde - montant;
        } else {
            System.out.println("Solde insuffisant");
        }
    }
}
```

**Fichier TestCompteBancaire.java** :

```java
// Fichier : TestCompteBancaire.java

public class TestCompteBancaire {
    public static void main(String[] args) {
        CompteBancaire c1 = new CompteBancaire("Emma Martin", "123456", 1000.0);
        CompteBancaire c2 = new CompteBancaire("Pierre Dupont", "789012");
        CompteBancaire c3 = new CompteBancaire("Marie");

        System.out.println("=== Compte 1 ===");
        c1.afficher();

        System.out.println();

        System.out.println("=== Compte 2 ===");
        c2.afficher();

        System.out.println();

        System.out.println("=== Compte 3 ===");
        c3.afficher();

        System.out.println();

        System.out.println("=== Après opérations ===");
        c1.deposer(500);
        System.out.println("Solde compte 1 après dépôt de 500 : " + c1.solde + " €");

        c1.retirer(200);
        System.out.println("Solde compte 1 après retrait de 200 : " + c1.solde + " €");
    }
}
```

**Compilation et exécution** :

```bash
javac CompteBancaire.java TestCompteBancaire.java && java TestCompteBancaire
```

---

## Navigation

← Fiche précédente : **[Classes et objets en Java](04-classes-objets.md)**

→ Fiche suivante : **[Visibilité et encapsulation en Java](06-visibilite-encapsulation.md)**
