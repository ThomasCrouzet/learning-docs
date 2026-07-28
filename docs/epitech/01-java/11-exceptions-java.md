---
tags:
  - Java
  - Avancé
  - Pratique
description: "Les exceptions en Java"
estimated_time: "70 min"
fiche_number: 11
total_fiches: 12
cursus: "Java"
---

# 11 - Les exceptions en Java

> **En bref** : À la fin de cette fiche, tu sauras gérer les erreurs en Java avec les exceptions : attraper une exception, en lancer une, créer des exceptions personnalisées, et utiliser le try-with-resources pour gérer automatiquement les ressources. Lecture estimée : 70 min.


## Prérequis

- Fiche [08 - L'héritage en Java](08-heritage.md)
- Fiche [09 - Interfaces et abstraction en Java](09-interfaces-abstraction.md)
- Savoir créer des classes avec héritage et utiliser `extends`

## Objectif de cette fiche

À la fin de cette fiche, tu sauras gérer les erreurs en Java avec les exceptions : attraper une exception, en lancer une, créer des exceptions personnalisées, et utiliser le try-with-resources pour gérer automatiquement les ressources.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une exception ?

**Définition** : Une exception est un objet qui représente une erreur survenue pendant l'exécution d'un programme. Quand une erreur se produit, Java "lance" (throw) une exception. Tu peux ensuite "attraper" (catch) cette exception pour la traiter au lieu de laisser le programme s'arrêter.

**Le problème que les exceptions résolvent** :

Sans exceptions, voici les problèmes rencontrés :

1. **Arrêt brutal** : Une erreur non gérée arrête le programme avec un message technique difficile à comprendre.

2. **Codes de retour** : Tu dois vérifier chaque valeur de retour (-1, null, false) pour détecter les erreurs, ce qui alourdit le code.

3. **Propagation manuelle** : Si une erreur se produit dans une méthode appelée par une autre méthode, tu dois manuellement transmettre l'erreur à chaque niveau.

**Comment les exceptions résolvent ces problèmes** :

| Problème | Solution apportée par les exceptions |
| -------- | ------------------------------------ |
| Arrêt brutal | Le bloc `catch` intercepte l'erreur et exécute un traitement alternatif |
| Codes de retour | L'exception est un objet riche avec un message, un type et une trace |
| Propagation manuelle | L'exception remonte automatiquement la pile d'appels jusqu'au premier `catch` |

**Analogie concrète** : Imagine une chaîne de production dans une usine. Chaque poste de travail effectue une opération. Si un poste détecte un défaut, il active une alarme (throw). Le superviseur le plus proche (catch) peut alors décider : corriger le défaut, mettre la pièce de côté, ou arrêter la chaîne. Sans alarme, la pièce défectueuse passerait inaperçue.

**Ce qu'une exception n'est PAS** :

- Une exception n'est pas un `System.exit()`. Elle est un objet structuré qui peut être attrapé et traité.
- Une exception n'est pas toujours fatale. Tu peux l'attraper, la traiter et continuer l'exécution du programme.

---

### La pile d'appels et la propagation

Quand une exception est lancée, Java remonte la pile d'appels jusqu'à trouver un bloc `catch` correspondant :

```text
main()
  └── methodeA()
        └── methodeB()
              └── methodeC()  ← Exception lancée ici

Si methodeC() lance une exception :
1. Java cherche un catch dans methodeC() → pas trouvé
2. Java cherche un catch dans methodeB() → pas trouvé
3. Java cherche un catch dans methodeA() → TROUVÉ → exécution du catch
```

Si aucun `catch` n'est trouvé, le programme s'arrête avec un message d'erreur et la trace complète de la pile d'appels (stack trace).

---

### La hiérarchie des exceptions

```text
Throwable
├── Error (erreurs graves de la JVM)
│   ├── OutOfMemoryError
│   ├── StackOverflowError
│   └── ...
└── Exception (erreurs récupérables)
    ├── RuntimeException (unchecked)
    │   ├── NullPointerException
    │   ├── ArithmeticException
    │   ├── ArrayIndexOutOfBoundsException
    │   ├── NumberFormatException
    │   ├── IllegalArgumentException
    │   └── ...
    ├── IOException (checked)
    │   ├── FileNotFoundException
    │   └── ...
    ├── SQLException (checked)
    └── ...
```

**Trois catégories** :

| Catégorie | Description | Exemples |
| --------- | ----------- | -------- |
| `Error` | Erreur grave de la JVM. Ne pas attraper. | `OutOfMemoryError`, `StackOverflowError` |
| `Exception` (checked) | Erreur prévisible. Le compilateur oblige à la gérer. | `IOException`, `SQLException` |
| `RuntimeException` (unchecked) | Bug dans le code. Le compilateur ne vérifie pas. | `NullPointerException`, `ArithmeticException` |

---

### Checked vs Unchecked exceptions

C'est le concept le plus important à comprendre en Java.

**Checked exceptions** : Le compilateur vérifie que tu gères ces exceptions. Tu dois soit les attraper (`catch`), soit les déclarer dans la signature de ta méthode (`throws`).

```java
// Le compilateur OBLIGE à gérer IOException
import java.io.FileReader;
import java.io.IOException;

void lireFichier() throws IOException {
    FileReader f = new FileReader("fichier.txt");  // Peut lancer IOException
}
```

**Unchecked exceptions** (RuntimeException) : Le compilateur ne vérifie pas. Tu peux les attraper si tu veux, mais ce n'est pas obligatoire.

```java
// Le compilateur ne dit rien pour ArithmeticException
int resultat = 10 / 0;  // Lance ArithmeticException à l'exécution
```

**Comparaison checked vs unchecked** :

| Checked | Unchecked |
| ------- | --------- |
| Hérite de `Exception` (pas de `RuntimeException`) | Hérite de `RuntimeException` |
| Le compilateur oblige à les gérer | Le compilateur ne vérifie pas |
| Représente une situation prévisible | Représente un bug dans le code |
| `IOException`, `SQLException` | `NullPointerException`, `ArithmeticException` |
| Gestion par `try/catch` ou `throws` | Gestion optionnelle |

---

### Le bloc try/catch/finally

**Syntaxe** :

```java
try {
    // Code qui peut lancer une exception
    int resultat = 10 / 0;
} catch (ArithmeticException e) {
    // Code exécuté si ArithmeticException est lancée
    System.out.println("Erreur : " + e.getMessage());
} finally {
    // Code exécuté dans TOUS les cas (optionnel)
    System.out.println("Nettoyage effectué.");
}
```

**Les méthodes de l'objet Exception** :

| Méthode | Description |
| ------- | ----------- |
| `getMessage()` | Le message d'erreur |
| `toString()` | Le type + le message |
| `printStackTrace()` | Affiche la trace complète dans la console |
| `getClass().getName()` | Le nom de la classe d'exception |
| `getCause()` | L'exception d'origine (chaînage) |

---

### Lancer une exception (throw et throws)

**throw** : Lance une exception depuis une méthode.

**throws** : Déclare dans la signature qu'une méthode peut lancer une exception (obligatoire pour les checked exceptions).

```java
// throws : déclare que la méthode peut lancer une exception
public void retirer(double montant) throws SoldeInsuffisantException {
    if (montant > solde) {
        // throw : lance l'exception
        throw new SoldeInsuffisantException("Solde insuffisant : " + solde);
    }
    solde -= montant;
}
```

**Différence throw vs throws** :

| `throw` | `throws` |
| ------- | -------- |
| Dans le corps de la méthode | Dans la signature de la méthode |
| Lance une exception | Déclare qu'une exception peut être lancée |
| Suivi d'un objet exception | Suivi d'un type d'exception |
| `throw new Exception("msg");` | `void methode() throws Exception` |

---

### Les exceptions personnalisées

**Définition** : Une exception personnalisée est une classe qui hérite de `Exception` (checked) ou de `RuntimeException` (unchecked).

**Quand créer checked vs unchecked** :

| Checked (hérite de Exception) | Unchecked (hérite de RuntimeException) |
| ----------------------------- | -------------------------------------- |
| L'appelant DOIT gérer l'erreur | L'appelant PEUT gérer l'erreur |
| Erreur prévisible et récupérable | Bug ou erreur de programmation |
| Exemple : solde insuffisant | Exemple : argument null |

---

### Le try-with-resources

**Définition** : `try-with-resources` est une syntaxe spéciale qui ferme automatiquement les ressources (fichiers, connexions, etc.) à la fin du bloc `try`. La ressource doit implémenter l'interface `AutoCloseable`.

```java
// Sans try-with-resources (risque d'oublier de fermer)
Scanner scanner = null;
try {
    scanner = new Scanner(new File("fichier.txt"));
    // Utilisation du scanner
} catch (FileNotFoundException e) {
    System.out.println("Fichier non trouvé");
} finally {
    if (scanner != null) {
        scanner.close();  // Fermeture manuelle
    }
}

// Avec try-with-resources (fermeture automatique)
try (Scanner scanner = new Scanner(new File("fichier.txt"))) {
    // Utilisation du scanner
    // scanner est automatiquement fermé à la fin du bloc try
} catch (FileNotFoundException e) {
    System.out.println("Fichier non trouvé");
}
```

**Avantages du try-with-resources** :

| Sans try-with-resources | Avec try-with-resources |
| ----------------------- | ----------------------- |
| Fermeture manuelle dans `finally` | Fermeture automatique |
| Risque d'oublier de fermer | Impossible d'oublier |
| Code plus long | Code concis |
| Gestion complexe de `null` | Pas de vérification `null` |

---

## Étapes Pratiques

### Étape 1 : Attraper une exception simple

Crée un fichier `TestException.java` :

```java
// Fichier : TestException.java

public class TestException {
    public static void main(String[] args) {
        System.out.println("=== Catch simple ===");

        // Exemple 1 : ArithmeticException (division par zéro)
        System.out.println("\n--- Division par zéro ---");

        try {
            int a = 10;
            int b = 0;
            int resultat = a / b;  // Lance ArithmeticException
            System.out.println("Résultat : " + resultat);  // Jamais exécuté
        } catch (ArithmeticException e) {
            System.out.println("Erreur attrapée : " + e.getMessage());
        }

        System.out.println("Le programme continue après le catch.");

        // Exemple 2 : ArrayIndexOutOfBoundsException
        System.out.println("\n--- Index hors limites ---");

        int[] nombres = {1, 2, 3};

        try {
            System.out.println("Élément 0 : " + nombres[0]);
            System.out.println("Élément 5 : " + nombres[5]);  // Index n'existe pas
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Erreur : index " + e.getMessage() + " hors limites");
        }

        // Exemple 3 : NumberFormatException
        System.out.println("\n--- Conversion invalide ---");

        try {
            int nombre = Integer.parseInt("abc");  // "abc" n'est pas un nombre
            System.out.println("Nombre : " + nombre);
        } catch (NumberFormatException e) {
            System.out.println("Erreur : '" + e.getMessage() + "' n'est pas un nombre");
        }
    }
}
```

**Compile et exécute** :

```bash
javac TestException.java && java TestException
```

---

### Étape 2 : Catch multiple

Crée un fichier `TestCatchMultiple.java` :

```java
// Fichier : TestCatchMultiple.java

public class TestCatchMultiple {

    public static int convertirEtDiviser(String texte, int diviseur) {
        // Peut lancer NumberFormatException ou ArithmeticException
        int nombre = Integer.parseInt(texte);
        return nombre / diviseur;
    }

    public static void main(String[] args) {
        System.out.println("=== Catch multiple ===");

        // Tableau de tests : [texte, diviseur]
        String[][] tests = {
            {"100", "5"},     // OK
            {"abc", "5"},     // NumberFormatException
            {"100", "0"},     // ArithmeticException
            {"50", "3"},      // OK
        };

        for (String[] test : tests) {
            String texte = test[0];
            // Le parseInt du diviseur est dans le try pour attraper une éventuelle erreur
            int diviseur;

            try {
                diviseur = Integer.parseInt(test[1]);
            } catch (NumberFormatException e) {
                System.out.println("\nTest : \"" + texte + "\" / " + test[1]);
                System.out.println("  Erreur de format : \"" + test[1] + "\" n'est pas un nombre");
                continue;
            }

            System.out.println("\nTest : \"" + texte + "\" / " + diviseur);

            try {
                int resultat = convertirEtDiviser(texte, diviseur);
                System.out.println("  Résultat : " + resultat);
            } catch (NumberFormatException e) {
                System.out.println("  Erreur de format : \"" + texte + "\" n'est pas un nombre");
            } catch (ArithmeticException e) {
                System.out.println("  Erreur arithmétique : " + e.getMessage());
            } catch (Exception e) {
                // Dernier recours pour les erreurs inattendues
                System.out.println("  Erreur inattendue : " + e.getMessage());
            }
        }
    }
}
```

---

### Étape 3 : Le bloc finally

Crée un fichier `TestFinally.java` :

```java
// Fichier : TestFinally.java

public class TestFinally {

    public static void testerConnexion(boolean simulerErreur) {
        System.out.println("Ouverture de la connexion...");

        try {
            System.out.println("Exécution de la requête...");

            if (simulerErreur) {
                throw new RuntimeException("Erreur de connexion simulée");
            }

            System.out.println("Requête réussie !");
        } catch (RuntimeException e) {
            System.out.println("Erreur attrapée : " + e.getMessage());
        } finally {
            // Ce bloc s'exécute TOUJOURS, erreur ou pas
            System.out.println("Fermeture de la connexion (finally).");
        }
    }

    public static void main(String[] args) {
        System.out.println("=== Le bloc finally ===");

        System.out.println("\n--- Test 1 : Sans erreur ---");
        testerConnexion(false);

        System.out.println("\n--- Test 2 : Avec erreur ---");
        testerConnexion(true);

        System.out.println("\nLe finally s'est exécuté dans les deux cas.");
    }
}
```

---

### Étape 4 : Lancer une exception (throw et throws)

Crée un fichier `CompteBancaire.java` :

```java
// Fichier : CompteBancaire.java

class CompteBancaire {
    private String titulaire;
    private double solde;

    public CompteBancaire(String titulaire, double soldeInitial) {
        if (soldeInitial < 0) {
            throw new IllegalArgumentException(
                "Le solde initial ne peut pas être négatif : " + soldeInitial
            );
        }
        this.titulaire = titulaire;
        this.solde = soldeInitial;
    }

    public void deposer(double montant) {
        if (montant <= 0) {
            throw new IllegalArgumentException(
                "Le montant du dépôt doit être positif : " + montant
            );
        }
        solde += montant;
        System.out.println("Dépôt de " + montant + " € effectué.");
    }

    public void retirer(double montant) {
        if (montant <= 0) {
            throw new IllegalArgumentException(
                "Le montant du retrait doit être positif : " + montant
            );
        }
        if (montant > solde) {
            throw new RuntimeException(
                "Solde insuffisant. Solde : " + solde + " €, demandé : " + montant + " €"
            );
        }
        solde -= montant;
        System.out.println("Retrait de " + montant + " € effectué.");
    }

    public double getSolde() {
        return solde;
    }

    public String getTitulaire() {
        return titulaire;
    }
}
```

Crée un fichier `TestCompte.java` :

```java
// Fichier : TestCompte.java

public class TestCompte {
    public static void main(String[] args) {
        System.out.println("=== Lancer des exceptions ===");

        // Test 1 : Opérations normales
        System.out.println("\n--- Opérations normales ---");

        try {
            CompteBancaire compte = new CompteBancaire("Hugo", 500.0);
            System.out.println("Compte de " + compte.getTitulaire() + " : " + compte.getSolde() + " €");

            compte.deposer(200);
            System.out.println("Solde : " + compte.getSolde() + " €");

            compte.retirer(100);
            System.out.println("Solde : " + compte.getSolde() + " €");
        } catch (Exception e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Test 2 : Solde insuffisant
        System.out.println("\n--- Solde insuffisant ---");

        try {
            CompteBancaire compte = new CompteBancaire("Marie", 100.0);
            compte.retirer(500);
        } catch (RuntimeException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Test 3 : Montant négatif
        System.out.println("\n--- Montant négatif ---");

        try {
            CompteBancaire compte = new CompteBancaire("Pierre", 100.0);
            compte.deposer(-50);
        } catch (IllegalArgumentException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Test 4 : Solde initial négatif
        System.out.println("\n--- Solde initial négatif ---");

        try {
            CompteBancaire compte = new CompteBancaire("Alice", -100.0);
        } catch (IllegalArgumentException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac CompteBancaire.java TestCompte.java && java TestCompte
```

---

### Étape 5 : Créer une exception personnalisée (checked)

Crée un fichier `CompteException.java` :

```java
// Fichier : CompteException.java
// Exception checked : l'appelant DOIT la gérer

class CompteException extends Exception {
    private double soldeActuel;
    private double montantDemande;

    public CompteException(String message, double soldeActuel, double montantDemande) {
        super(message);
        this.soldeActuel = soldeActuel;
        this.montantDemande = montantDemande;
    }

    public double getSoldeActuel() {
        return soldeActuel;
    }

    public double getMontantDemande() {
        return montantDemande;
    }

    public double getMontantManquant() {
        return montantDemande - soldeActuel;
    }
}
```

Crée un fichier `CompteSecurise.java` :

```java
// Fichier : CompteSecurise.java

class CompteSecurise {
    private String titulaire;
    private double solde;

    public CompteSecurise(String titulaire, double soldeInitial) {
        this.titulaire = titulaire;
        this.solde = soldeInitial;
    }

    // throws CompteException : l'appelant DOIT gérer cette exception
    public void retirer(double montant) throws CompteException {
        if (montant > solde) {
            throw new CompteException(
                "Solde insuffisant pour " + titulaire,
                solde,
                montant
            );
        }
        solde -= montant;
    }

    public void deposer(double montant) {
        solde += montant;
    }

    public double getSolde() {
        return solde;
    }

    public String getTitulaire() {
        return titulaire;
    }
}
```

Crée un fichier `TestCompteSecurise.java` :

```java
// Fichier : TestCompteSecurise.java

public class TestCompteSecurise {
    public static void main(String[] args) {
        System.out.println("=== Exception personnalisée (checked) ===");

        CompteSecurise compte = new CompteSecurise("Hugo", 500.0);

        // Le compilateur OBLIGE à gérer CompteException
        // Si tu retires le try/catch, le programme ne compile pas

        System.out.println("\n--- Retrait normal ---");

        try {
            compte.retirer(200);
            System.out.println("Retrait de 200 € réussi. Solde : " + compte.getSolde() + " €");
        } catch (CompteException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        System.out.println("\n--- Retrait trop élevé ---");

        try {
            compte.retirer(1000);
            System.out.println("Retrait réussi.");
        } catch (CompteException e) {
            System.out.println("Erreur : " + e.getMessage());
            System.out.println("  Solde actuel : " + e.getSoldeActuel() + " €");
            System.out.println("  Montant demandé : " + e.getMontantDemande() + " €");
            System.out.println("  Montant manquant : " + e.getMontantManquant() + " €");
        }
    }
}
```

**Compile et exécute** :

```bash
javac CompteException.java CompteSecurise.java TestCompteSecurise.java && java TestCompteSecurise
```

**Résultat attendu** :

```text
=== Exception personnalisée (checked) ===

--- Retrait normal ---
Retrait de 200 € réussi. Solde : 300.0 €

--- Retrait trop élevé ---
Erreur : Solde insuffisant pour Hugo
  Solde actuel : 300.0 €
  Montant demandé : 1000.0 €
  Montant manquant : 700.0 €
```

---

### Étape 6 : Try-with-resources

Crée un fichier `TestResources.java` :

```java
// Fichier : TestResources.java

import java.util.Scanner;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;

public class TestResources {
    public static void main(String[] args) {
        System.out.println("=== Try-with-resources ===");

        // Étape 1 : Écrire dans un fichier
        System.out.println("\n--- Écriture dans un fichier ---");

        try (PrintWriter writer = new PrintWriter("test-output.txt")) {
            writer.println("Ligne 1 : Bonjour");
            writer.println("Ligne 2 : Les exceptions en Java");
            writer.println("Ligne 3 : Try-with-resources");
            System.out.println("Fichier écrit avec succès.");
            // Le writer est automatiquement fermé ici
        } catch (FileNotFoundException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Étape 2 : Lire le fichier
        System.out.println("\n--- Lecture du fichier ---");

        try (Scanner scanner = new Scanner(new File("test-output.txt"))) {
            int numeroLigne = 1;
            while (scanner.hasNextLine()) {
                String ligne = scanner.nextLine();
                System.out.println("  Ligne " + numeroLigne + " : " + ligne);
                numeroLigne++;
            }
            // Le scanner est automatiquement fermé ici
        } catch (FileNotFoundException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Étape 3 : Fichier inexistant
        System.out.println("\n--- Fichier inexistant ---");

        try (Scanner scanner = new Scanner(new File("inexistant.txt"))) {
            System.out.println(scanner.nextLine());
        } catch (FileNotFoundException e) {
            System.out.println("Fichier non trouvé : " + e.getMessage());
        }

        // Nettoyage du fichier de test
        new File("test-output.txt").delete();
        System.out.println("\nFichier de test supprimé.");
    }
}
```

**Compile et exécute** :

```bash
javac TestResources.java && java TestResources
```

**Résultat attendu** :

```text
=== Try-with-resources ===

--- Écriture dans un fichier ---
Fichier écrit avec succès.

--- Lecture du fichier ---
  Ligne 1 : Ligne 1 : Bonjour
  Ligne 2 : Ligne 2 : Les exceptions en Java
  Ligne 3 : Ligne 3 : Try-with-resources

--- Fichier inexistant ---
Fichier non trouvé : inexistant.txt (No such file or directory)

Fichier de test supprimé.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers |
| `java TestException` | Exécute le test de base |
| `java TestCompte` | Exécute le test du compte |
| `java TestResources` | Exécute le test try-with-resources |

---

## Pièges Fréquents

### Piège 1 : Catch trop large

**Problème** : Tu attrapes `Exception` partout, ce qui masque les vrais problèmes.

**Solution** : Attrape les exceptions les plus spécifiques possible.

```java
// Incorrect : attrape TOUT
try {
    int[] tab = {1, 2, 3};
    int val = tab[5];
    int result = Integer.parseInt("abc");
} catch (Exception e) {
    System.out.println("Erreur");  // Impossible de savoir quelle erreur
}

// Correct : attrape chaque type
try {
    int[] tab = {1, 2, 3};
    int val = tab[5];
    int result = Integer.parseInt("abc");
} catch (ArrayIndexOutOfBoundsException e) {
    System.out.println("Index hors limites : " + e.getMessage());
} catch (NumberFormatException e) {
    System.out.println("Format invalide : " + e.getMessage());
}
```

---

### Piège 2 : Confondre checked et unchecked

**Problème** : Tu déclares `throws RuntimeException` (inutile) ou tu oublies `throws IOException` (erreur de compilation).

**Solution** : Seules les checked exceptions (hors RuntimeException) nécessitent `throws`.

```java
// Inutile : ArithmeticException est unchecked
void calculer() throws ArithmeticException {  // Pas nécessaire
    int r = 10 / 0;
}

// Obligatoire : IOException est checked
void lire() throws IOException {  // Obligatoire sinon erreur de compilation
    FileReader f = new FileReader("fichier.txt");
}
```

---

### Piège 3 : Oublier finally pour fermer les ressources

**Problème** : Si une exception est lancée entre l'ouverture et la fermeture d'une ressource, la ressource n'est jamais fermée.

**Solution** : Utilise `try-with-resources` (préféré) ou `finally`.

```java
// Problème : si une exception se produit, le scanner n'est jamais fermé
Scanner scanner = new Scanner(new File("data.txt"));
String ligne = scanner.nextLine();  // Peut lancer une exception
scanner.close();  // Ne sera pas exécuté si exception ci-dessus

// Solution : try-with-resources
try (Scanner scanner = new Scanner(new File("data.txt"))) {
    String ligne = scanner.nextLine();
}  // Fermeture automatique, même en cas d'exception
```

---

## Checklist de Validation

- [ ] Je comprends la différence entre `Error` et `Exception`
- [ ] Je sais écrire un bloc `try/catch`
- [ ] Je sais attraper plusieurs types d'exceptions avec des `catch` multiples
- [ ] Je sais utiliser le bloc `finally`
- [ ] Je comprends la différence entre checked et unchecked exceptions
- [ ] Je sais déclarer `throws` dans la signature d'une méthode
- [ ] Je sais lancer une exception avec `throw new`
- [ ] Je sais créer une exception personnalisée (checked et unchecked)
- [ ] Je sais utiliser `try-with-resources` pour fermer automatiquement les ressources
- [ ] Je sais quand utiliser `try-with-resources` vs `try/catch/finally`

---

## Exercice Pratique

**Énoncé** : Crée un système bancaire avec une exception personnalisée `CompteException` (checked) et un try-with-resources pour logger les opérations dans un fichier.

**Indications** :

- Crée une exception `CompteException` (checked) avec :
  - Un message
  - Le solde actuel (`double`)
  - Le montant demandé (`double`)
  - Une méthode `getMontantManquant()` qui retourne la différence

- Crée une classe `Compte` avec :
  - Attributs : `titulaire` (String), `solde` (double)
  - Méthode `deposer(double montant)` : lance `IllegalArgumentException` si montant <= 0
  - Méthode `retirer(double montant) throws CompteException` : lance `CompteException` si solde insuffisant
  - Méthode `transferer(Compte destinataire, double montant) throws CompteException` : retire de ce compte et dépose sur l'autre

- Dans le `main` :
  - Crée deux comptes
  - Effectue des opérations (dépôt, retrait, transfert)
  - Utilise `try-with-resources` avec un `PrintWriter` pour écrire un journal des opérations dans `journal.txt`
  - Attrape les exceptions et les affiche

**Résultat attendu** :

```text
=== Système bancaire ===

Dépôt de 1000.0 € sur le compte de Hugo
Dépôt de 500.0 € sur le compte de Marie
Transfert de 300.0 € de Hugo vers Marie
Retrait de 200.0 € du compte de Marie

Soldes finaux :
  Hugo : 700.0 €
  Marie : 600.0 €

Tentative de retrait excessif...
Erreur : Solde insuffisant pour Hugo
  Solde actuel : 700.0 €
  Montant demandé : 5000.0 €
  Montant manquant : 4300.0 €

Journal écrit dans journal.txt
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Fichier CompteException.java** (exception) :

```java
// Fichier : CompteException.java

class CompteException extends Exception {
    private double soldeActuel;
    private double montantDemande;

    public CompteException(String message, double soldeActuel, double montantDemande) {
        super(message);
        this.soldeActuel = soldeActuel;
        this.montantDemande = montantDemande;
    }

    public double getSoldeActuel() {
        return soldeActuel;
    }

    public double getMontantDemande() {
        return montantDemande;
    }

    public double getMontantManquant() {
        return montantDemande - soldeActuel;
    }
}
```

**Fichier Compte.java** :

```java
// Fichier : Compte.java

class Compte {
    private String titulaire;
    private double solde;

    public Compte(String titulaire) {
        this.titulaire = titulaire;
        this.solde = 0;
    }

    public void deposer(double montant) {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif : " + montant);
        }
        solde += montant;
    }

    public void retirer(double montant) throws CompteException {
        if (montant <= 0) {
            throw new IllegalArgumentException("Le montant doit être positif : " + montant);
        }
        if (montant > solde) {
            throw new CompteException(
                "Solde insuffisant pour " + titulaire,
                solde,
                montant
            );
        }
        solde -= montant;
    }

    public void transferer(Compte destinataire, double montant) throws CompteException {
        this.retirer(montant);       // Peut lancer CompteException
        destinataire.deposer(montant);
    }

    public double getSolde() {
        return solde;
    }

    public String getTitulaire() {
        return titulaire;
    }
}
```

**Fichier TestBanque.java** :

```java
// Fichier : TestBanque.java

import java.io.PrintWriter;
import java.io.FileNotFoundException;
import java.io.File;

public class TestBanque {
    public static void main(String[] args) {
        System.out.println("=== Système bancaire ===\n");

        Compte hugo = new Compte("Hugo");
        Compte marie = new Compte("Marie");

        // Utilisation de try-with-resources pour le journal
        try (PrintWriter journal = new PrintWriter("journal.txt")) {

            // Dépôts
            hugo.deposer(1000);
            journal.println("Dépôt de 1000.0 € sur le compte de Hugo");
            System.out.println("Dépôt de 1000.0 € sur le compte de Hugo");

            marie.deposer(500);
            journal.println("Dépôt de 500.0 € sur le compte de Marie");
            System.out.println("Dépôt de 500.0 € sur le compte de Marie");

            // Transfert
            try {
                hugo.transferer(marie, 300);
                journal.println("Transfert de 300.0 € de Hugo vers Marie");
                System.out.println("Transfert de 300.0 € de Hugo vers Marie");
            } catch (CompteException e) {
                journal.println("ERREUR transfert : " + e.getMessage());
                System.out.println("Erreur : " + e.getMessage());
            }

            // Retrait
            try {
                marie.retirer(200);
                journal.println("Retrait de 200.0 € du compte de Marie");
                System.out.println("Retrait de 200.0 € du compte de Marie");
            } catch (CompteException e) {
                journal.println("ERREUR retrait : " + e.getMessage());
                System.out.println("Erreur : " + e.getMessage());
            }

            // Soldes finaux
            System.out.println("\nSoldes finaux :");
            System.out.println("  Hugo : " + hugo.getSolde() + " €");
            System.out.println("  Marie : " + marie.getSolde() + " €");
            journal.println("Solde Hugo : " + hugo.getSolde() + " €");
            journal.println("Solde Marie : " + marie.getSolde() + " €");

            // Tentative de retrait excessif
            System.out.println("\nTentative de retrait excessif...");

            try {
                hugo.retirer(5000);
            } catch (CompteException e) {
                System.out.println("Erreur : " + e.getMessage());
                System.out.println("  Solde actuel : " + e.getSoldeActuel() + " €");
                System.out.println("  Montant demandé : " + e.getMontantDemande() + " €");
                System.out.println("  Montant manquant : " + e.getMontantManquant() + " €");
                journal.println("ERREUR : " + e.getMessage());
            }

            journal.println("--- Fin du journal ---");

        } catch (FileNotFoundException e) {
            System.out.println("Impossible de créer le journal : " + e.getMessage());
        }
        // Le PrintWriter est automatiquement fermé ici (try-with-resources)

        System.out.println("\nJournal écrit dans journal.txt");

        // Nettoyage
        new File("journal.txt").delete();
    }
}
```

**Compilation et exécution** :

```bash
javac CompteException.java Compte.java TestBanque.java && java TestBanque
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `CompteException extends Exception` | Checked exception : le compilateur oblige à la gérer |
| `throws CompteException` | Déclaration obligatoire car checked exception |
| `try-with-resources` | Le `PrintWriter` est fermé automatiquement |
| `transferer()` | Appelle `retirer()` qui propage `CompteException` |
| `getMontantManquant()` | Donnée calculée dans l'exception (montant - solde) |
| Nested try/catch | Le catch interne gère `CompteException`, le catch externe gère `FileNotFoundException` |

---

## Navigation

← Fiche précédente : **[Les collections en Java](10-collections.md)**

→ Fiche suivante : **[Lecture et écriture de fichiers en Java](12-fichiers-io.md)**
