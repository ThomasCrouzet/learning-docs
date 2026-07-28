---
tags:
  - Java
  - Intermédiaire
  - Pratique
description: "Visibilité et encapsulation en Java"
estimated_time: "60 min"
fiche_number: 6
total_fiches: 12
cursus: "Java"
---

# 06 - Visibilité et encapsulation en Java

> **En bref** : À la fin de cette fiche, tu sauras protéger les données d'une classe avec les modificateurs d'accès (public, private) et créer des getters et setters. Lecture estimée : 60 min.


## Prérequis

- Fiche [04 - Classes et objets en Java](04-classes-objets.md)
- Fiche [05 - Les constructeurs en Java](05-constructeurs.md)
- Savoir créer une classe avec attributs, méthodes et constructeurs

## Objectif de cette fiche

À la fin de cette fiche, tu sauras protéger les données d'une classe avec les modificateurs d'accès (public, private) et créer des getters et setters.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'encapsulation ?

**Définition** : L'encapsulation est le principe de cacher les détails internes d'une classe et de contrôler l'accès aux données via des méthodes dédiées.

**Le problème que l'encapsulation résout** :

Sans encapsulation, voici les problèmes rencontrés :

1. **Données corrompues** : N'importe qui peut modifier directement un attribut avec une valeur invalide.

2. **Couplage fort** : Si tu changes la structure interne de la classe, tout le code qui l'utilise doit être modifié.

3. **Pas de validation** : Impossible de vérifier les valeurs avant qu'elles soient assignées.

**Exemple de problème sans encapsulation** :

```java
class CompteBancaire {
    double solde;  // Accessible de partout
}

// N'importe qui peut faire ceci :
CompteBancaire compte = new CompteBancaire();
compte.solde = -5000;  // Solde négatif ! Incohérent.
```

**Comment l'encapsulation résout ces problèmes** :

| Problème | Solution apportée par l'encapsulation |
| -------- | ------------------------------------- |
| Données corrompues | Les attributs sont privés, seules les méthodes de la classe peuvent les modifier |
| Couplage fort | Les autres classes passent par des méthodes, pas par les attributs directs |
| Pas de validation | Les méthodes peuvent vérifier les valeurs avant modification |

**Analogie concrète** : L'encapsulation est comme un distributeur automatique de billets (DAB). Tu ne peux pas accéder directement à l'argent dans la machine (attribut privé). Tu dois passer par l'interface (méthodes) : insérer ta carte, taper ton code, demander un montant. La machine vérifie que tu as assez d'argent avant de te le donner.

**Ce que l'encapsulation n'est PAS** :

- L'encapsulation n'est pas de la sécurité informatique. Elle empêche les erreurs de programmation, pas les attaques malveillantes.
- L'encapsulation n'est pas obligatoire en Java. Mais c'est une bonne pratique fortement recommandée.

---

### Les modificateurs d'accès

**Définition** : Les modificateurs d'accès sont des mots-clés qui définissent qui peut accéder à un attribut, une méthode, ou une classe.

**Les quatre modificateurs d'accès en Java** :

| Modificateur | Accessible depuis |
| ------------ | ----------------- |
| `public` | Partout (toutes les classes) |
| `private` | Uniquement dans la classe elle-même |
| `protected` | Dans la classe et ses sous-classes (voir héritage) |
| (aucun) | Dans le même package (dossier) |

**Les deux plus importants à retenir** :

| Modificateur | Utilisation typique |
| ------------ | ------------------- |
| `private` | Pour les attributs (données) |
| `public` | Pour les méthodes d'accès (getters/setters) |

**Syntaxe** :

```java
class MaClasse {
    private int attributPrive;      // Accessible seulement dans MaClasse
    public int attributPublic;      // Accessible de partout

    private void methodePrivee() { }  // Utilisable seulement dans MaClasse
    public void methodePublique() { } // Utilisable de partout
}
```

---

### Les getters

**Définition** : Un getter est une méthode publique qui retourne la valeur d'un attribut privé. La convention de nommage est `getNomAttribut()`.

**Syntaxe** :

```java
class Personne {
    private String nom;

    // Getter pour l'attribut nom
    public String getNom() {
        return nom;
    }
}
```

**Utilisation** :

```java
Personne p = new Personne();
String n = p.getNom();  // Lecture via le getter
// p.nom serait une erreur car nom est private
```

**Convention pour les booléens** :

Pour un attribut booléen, on utilise `is` au lieu de `get` :

```java
private boolean actif;

public boolean isActif() {
    return actif;
}
```

---

### Les setters

**Définition** : Un setter est une méthode publique qui modifie la valeur d'un attribut privé. La convention de nommage est `setNomAttribut()`.

**Syntaxe** :

```java
class Personne {
    private String nom;

    // Setter pour l'attribut nom
    public void setNom(String nom) {
        this.nom = nom;
    }
}
```

**Setter avec validation** :

```java
class CompteBancaire {
    private double solde;

    public void setSolde(double solde) {
        // Validation : le solde ne peut pas être négatif
        if (solde >= 0) {
            this.solde = solde;
        } else {
            System.out.println("Erreur : le solde ne peut pas être négatif");
        }
    }
}
```

**Avantage de la validation** : Les données restent cohérentes, car les valeurs invalides sont rejetées.

---

### Pourquoi private + getters/setters ?

**Comparaison des approches** :

| Sans encapsulation | Avec encapsulation |
| ------------------ | ------------------ |
| `public int age;` | `private int age;` + `getAge()` + `setAge()` |
| Accès direct : `p.age = -5;` | Accès contrôlé : `p.setAge(-5);` peut refuser |
| Pas de validation possible | Validation dans le setter |
| Si tu changes le nom de l'attribut, tout le code externe casse | Tu peux changer l'implémentation interne sans casser le code externe |

**Exemple de flexibilité** :

```java
// Version 1 : attribut simple
class Personne {
    private String prenom;
    private String nom;

    public String getNomComplet() {
        return prenom + " " + nom;
    }
}

// Version 2 : attribut changé, mais même interface
class Personne {
    private String nomComplet;  // Structure interne changée

    public String getNomComplet() {
        return nomComplet;  // Le code externe n'a pas besoin de changer
    }
}
```

---

## Étapes Pratiques

### Étape 1 : Créer une classe sans encapsulation (mauvaise pratique)

Crée un fichier `PersonneSansEncapsulation.java` :

```java
// Fichier : PersonneSansEncapsulation.java
// Exemple de classe SANS encapsulation (à éviter)

class PersonneSansEncapsulation {
    String nom;
    int age;

    void afficher() {
        System.out.println("Nom : " + nom);
        System.out.println("Age : " + age);
    }
}
```

Crée un fichier `TestSansEncapsulation.java` :

```java
// Fichier : TestSansEncapsulation.java

public class TestSansEncapsulation {
    public static void main(String[] args) {
        PersonneSansEncapsulation p = new PersonneSansEncapsulation();

        // Accès direct aux attributs
        p.nom = "Hugo";
        p.age = 25;
        p.afficher();

        System.out.println();

        // Problème : rien n'empêche de mettre une valeur invalide
        p.age = -100;  // Age négatif ! Incohérent.
        p.afficher();
    }
}
```

**Résultat** :

```text
Nom : Hugo
Age : 25

Nom : Hugo
Age : -100
```

L'âge -100 est accepté alors qu'il n'a pas de sens.

---

### Étape 2 : Créer une classe avec encapsulation (bonne pratique)

Crée un fichier `PersonneEncapsulee.java` :

```java
// Fichier : PersonneEncapsulee.java
// Exemple de classe AVEC encapsulation (bonne pratique)

class PersonneEncapsulee {
    // Attributs privés
    private String nom;
    private int age;

    // Constructeur
    public PersonneEncapsulee(String nom, int age) {
        this.nom = nom;
        setAge(age);  // Utilise le setter pour valider
    }

    // Getter pour nom
    public String getNom() {
        return nom;
    }

    // Setter pour nom
    public void setNom(String nom) {
        if (nom != null && !nom.isEmpty()) {
            this.nom = nom;
        } else {
            System.out.println("Erreur : le nom ne peut pas être vide");
        }
    }

    // Getter pour age
    public int getAge() {
        return age;
    }

    // Setter pour age avec validation
    public void setAge(int age) {
        if (age >= 0 && age <= 150) {
            this.age = age;
        } else {
            System.out.println("Erreur : l'âge doit être entre 0 et 150");
        }
    }

    // Méthode publique
    public void afficher() {
        System.out.println("Nom : " + nom);
        System.out.println("Age : " + age);
    }
}
```

---

### Étape 3 : Tester l'encapsulation

Crée un fichier `TestEncapsulation.java` :

```java
// Fichier : TestEncapsulation.java

public class TestEncapsulation {
    public static void main(String[] args) {
        PersonneEncapsulee p = new PersonneEncapsulee("Hugo", 25);

        System.out.println("=== Valeurs initiales ===");
        p.afficher();

        System.out.println();

        // Modification via setter (valeur valide)
        System.out.println("=== Modification valide ===");
        p.setAge(26);
        p.afficher();

        System.out.println();

        // Tentative de modification invalide
        System.out.println("=== Tentative invalide ===");
        p.setAge(-100);  // Le setter refuse
        p.afficher();    // L'âge n'a pas changé

        System.out.println();

        // Lecture via getter
        System.out.println("=== Lecture via getter ===");
        System.out.println("Le nom est : " + p.getNom());
        System.out.println("L'âge est : " + p.getAge());

        // Ceci ne compile pas car nom et age sont private :
        // System.out.println(p.nom);   // ERREUR
        // p.age = 30;                  // ERREUR
    }
}
```

**Compile et exécute** :

```bash
javac PersonneEncapsulee.java TestEncapsulation.java && java TestEncapsulation
```

**Résultat attendu** :

```text
=== Valeurs initiales ===
Nom : Hugo
Age : 25

=== Modification valide ===
Nom : Hugo
Age : 26

=== Tentative invalide ===
Erreur : l'âge doit être entre 0 et 150
Nom : Hugo
Age : 26

=== Lecture via getter ===
Le nom est : Hugo
L'âge est : 26
```

---

### Étape 4 : Exemple complet avec CompteBancaire

Crée un fichier `CompteBancaireSecurise.java` :

```java
// Fichier : CompteBancaireSecurise.java
// Compte bancaire avec encapsulation

class CompteBancaireSecurise {
    private String titulaire;
    private String numero;
    private double solde;

    // Constructeur
    public CompteBancaireSecurise(String titulaire, String numero, double soldeInitial) {
        this.titulaire = titulaire;
        this.numero = numero;
        if (soldeInitial >= 0) {
            this.solde = soldeInitial;
        } else {
            this.solde = 0;
            System.out.println("Attention : solde initial négatif ignoré, mis à 0");
        }
    }

    // Getters
    public String getTitulaire() {
        return titulaire;
    }

    public String getNumero() {
        return numero;
    }

    public double getSolde() {
        return solde;
    }

    // Pas de setSolde() direct !
    // On passe par deposer() et retirer()

    // Méthode pour déposer de l'argent
    public void deposer(double montant) {
        if (montant > 0) {
            solde = solde + montant;
            System.out.println("Dépôt de " + montant + " € effectué");
        } else {
            System.out.println("Erreur : le montant doit être positif");
        }
    }

    // Méthode pour retirer de l'argent
    public boolean retirer(double montant) {
        if (montant <= 0) {
            System.out.println("Erreur : le montant doit être positif");
            return false;
        }
        if (montant > solde) {
            System.out.println("Erreur : solde insuffisant");
            return false;
        }
        solde = solde - montant;
        System.out.println("Retrait de " + montant + " € effectué");
        return true;
    }

    // Affichage
    public void afficher() {
        System.out.println("Titulaire : " + titulaire);
        System.out.println("Numéro : " + numero);
        System.out.println("Solde : " + solde + " €");
    }
}
```

---

### Étape 5 : Tester le compte bancaire sécurisé

Crée un fichier `TestCompteBancaireSecurise.java` :

```java
// Fichier : TestCompteBancaireSecurise.java

public class TestCompteBancaireSecurise {
    public static void main(String[] args) {
        CompteBancaireSecurise compte = new CompteBancaireSecurise("Hugo Martin", "123456", 1000);

        System.out.println("=== État initial ===");
        compte.afficher();

        System.out.println();

        System.out.println("=== Opérations ===");
        compte.deposer(500);
        System.out.println("Nouveau solde : " + compte.getSolde() + " €");

        System.out.println();

        compte.retirer(200);
        System.out.println("Nouveau solde : " + compte.getSolde() + " €");

        System.out.println();

        System.out.println("=== Tentatives invalides ===");
        compte.deposer(-100);     // Montant négatif
        compte.retirer(10000);    // Solde insuffisant

        System.out.println();

        System.out.println("=== État final ===");
        compte.afficher();

        // Ceci ne compile pas :
        // compte.solde = 1000000;  // ERREUR : solde est private
    }
}
```

**Résultat attendu** :

```text
=== État initial ===
Titulaire : Hugo Martin
Numéro : 123456
Solde : 1000.0 €

=== Opérations ===
Dépôt de 500.0 € effectué
Nouveau solde : 1500.0 €

Retrait de 200.0 € effectué
Nouveau solde : 1300.0 €

=== Tentatives invalides ===
Erreur : le montant doit être positif
Erreur : solde insuffisant

=== État final ===
Titulaire : Hugo Martin
Numéro : 123456
Solde : 1300.0 €
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestEncapsulation` | Exécute le test |

---

## Pièges Fréquents

### Piège 1 : Oublier de mettre les attributs en private

⚠️ **Problème** : L'encapsulation n'est pas effective, les attributs restent modifiables directement.

✅ **Solution** : Toujours déclarer les attributs comme `private`.

```java
// Incorrect
class Personne {
    String nom;  // Pas de modificateur = accessible dans le package
}

// Correct
class Personne {
    private String nom;
}
```

---

### Piège 2 : Getter qui modifie l'objet

⚠️ **Problème** : Un getter ne devrait jamais modifier l'état de l'objet.

✅ **Solution** : Un getter ne fait que retourner une valeur.

```java
// Incorrect
public int getAge() {
    age = age + 1;  // Modifie l'objet !
    return age;
}

// Correct
public int getAge() {
    return age;  // Seulement retourner
}
```

---

### Piège 3 : Oublier public devant les getters/setters

⚠️ **Problème** : Les getters/setters ne sont pas accessibles depuis l'extérieur.

✅ **Solution** : Toujours mettre `public` devant les getters et setters.

```java
// Incorrect
String getNom() {  // Pas de public = accès limité au package
    return nom;
}

// Correct
public String getNom() {
    return nom;
}
```

---

### Piège 4 : Setter sans validation

⚠️ **Problème** : Le setter accepte n'importe quelle valeur, comme si l'attribut était public.

✅ **Solution** : Ajouter une validation si nécessaire.

```java
// Peu utile : aucune validation
public void setAge(int age) {
    this.age = age;
}

// Mieux : avec validation
public void setAge(int age) {
    if (age >= 0 && age <= 150) {
        this.age = age;
    }
}
```

---

## Checklist de Validation

- [ ] J'ai compris le principe de l'encapsulation
- [ ] J'ai compris la différence entre `public` et `private`
- [ ] J'ai créé des attributs privés
- [ ] J'ai créé des getters pour accéder aux attributs
- [ ] J'ai créé des setters pour modifier les attributs
- [ ] J'ai ajouté de la validation dans un setter
- [ ] J'ai compris pourquoi l'encapsulation est une bonne pratique

---

## Exercice Pratique

**Énoncé** : Crée une classe `Produit` encapsulée pour un magasin.

**Indications** :

- Attributs privés : `nom` (String), `prix` (double), `quantiteStock` (int)
- Constructeur avec les trois paramètres (avec validation)
- Getters pour tous les attributs
- Setter pour `prix` : le prix doit être >= 0
- Setter pour `quantiteStock` : la quantité doit être >= 0
- Méthode `ajouterStock(int quantite)` : ajoute au stock
- Méthode `vendreProduit(int quantite)` : retire du stock si disponible, retourne `true` si succès
- Méthode `afficher()`

**Résultat attendu** :

```text
=== Produit créé ===
Nom : Clavier
Prix : 49.99 €
Stock : 10

=== Ajout de stock ===
Nouveau stock : 15

=== Vente ===
Vente de 3 unités : true
Stock après vente : 12

=== Tentative vente excessive ===
Vente de 100 unités : false
Stock inchangé : 12

=== Modification prix invalide ===
Erreur : le prix doit être positif
Prix inchangé : 49.99 €
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier ProduitEncapsule.java** :

```java
// Fichier : ProduitEncapsule.java

class ProduitEncapsule {
    private String nom;
    private double prix;
    private int quantiteStock;

    // Constructeur
    public ProduitEncapsule(String nom, double prix, int quantiteStock) {
        this.nom = nom;
        setPrix(prix);
        setQuantiteStock(quantiteStock);
    }

    // Getters
    public String getNom() {
        return nom;
    }

    public double getPrix() {
        return prix;
    }

    public int getQuantiteStock() {
        return quantiteStock;
    }

    // Setters avec validation
    public void setPrix(double prix) {
        if (prix >= 0) {
            this.prix = prix;
        } else {
            System.out.println("Erreur : le prix doit être positif");
        }
    }

    public void setQuantiteStock(int quantiteStock) {
        if (quantiteStock >= 0) {
            this.quantiteStock = quantiteStock;
        } else {
            System.out.println("Erreur : la quantité doit être positive");
        }
    }

    // Méthodes métier
    public void ajouterStock(int quantite) {
        if (quantite > 0) {
            quantiteStock = quantiteStock + quantite;
        }
    }

    public boolean vendreProduit(int quantite) {
        if (quantite <= 0) {
            return false;
        }
        if (quantite > quantiteStock) {
            return false;
        }
        quantiteStock = quantiteStock - quantite;
        return true;
    }

    public void afficher() {
        System.out.println("Nom : " + nom);
        System.out.println("Prix : " + prix + " €");
        System.out.println("Stock : " + quantiteStock);
    }
}
```

**Fichier TestProduitEncapsule.java** :

```java
// Fichier : TestProduitEncapsule.java

public class TestProduitEncapsule {
    public static void main(String[] args) {
        ProduitEncapsule p = new ProduitEncapsule("Clavier", 49.99, 10);

        System.out.println("=== Produit créé ===");
        p.afficher();

        System.out.println();

        System.out.println("=== Ajout de stock ===");
        p.ajouterStock(5);
        System.out.println("Nouveau stock : " + p.getQuantiteStock());

        System.out.println();

        System.out.println("=== Vente ===");
        boolean vendu = p.vendreProduit(3);
        System.out.println("Vente de 3 unités : " + vendu);
        System.out.println("Stock après vente : " + p.getQuantiteStock());

        System.out.println();

        System.out.println("=== Tentative vente excessive ===");
        vendu = p.vendreProduit(100);
        System.out.println("Vente de 100 unités : " + vendu);
        System.out.println("Stock inchangé : " + p.getQuantiteStock());

        System.out.println();

        System.out.println("=== Modification prix invalide ===");
        p.setPrix(-10);
        System.out.println("Prix inchangé : " + p.getPrix() + " €");
    }
}
```

**Compilation et exécution** :

```bash
javac ProduitEncapsule.java TestProduitEncapsule.java && java TestProduitEncapsule
```

---

## Navigation

← Fiche précédente : **[Les constructeurs en Java](05-constructeurs.md)**

→ Fiche suivante : **[Méthodes et surcharge en Java](07-methodes-surcharge.md)**
