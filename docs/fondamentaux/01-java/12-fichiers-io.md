---
tags:
  - Java
  - Avancé
  - Pratique
description: "Lecture et écriture de fichiers en Java"
estimated_time: "80 min"
fiche_number: 12
total_fiches: 12
cursus: "Java"
id: "fundamentals.java.fichiers-io"
course_id: "fundamentals.java"
content_type: "lesson"
order: 12
---

# 12 - Lecture et écriture de fichiers en Java

> **En bref** : À la fin de cette fiche, tu sauras lire et écrire des fichiers en Java avec les API modernes (java.nio.file), gérer les chemins de fichiers, et manipuler les répertoires. Lecture estimée : 80 min.


## Prérequis

- Fiche [11 - Les exceptions en Java](11-exceptions-java.md)
- Savoir utiliser `try/catch` et `try-with-resources`
- Comprendre la différence entre checked et unchecked exceptions

## Objectif de cette fiche

À la fin de cette fiche, tu sauras lire et écrire des fichiers en Java avec les API modernes (`java.nio.file`), gérer les chemins de fichiers, et manipuler les répertoires.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'I/O ?

**Définition** : I/O signifie Input/Output (entrée/sortie). En programmation, l'I/O désigne toutes les opérations de lecture (input) et d'écriture (output) de données : fichiers, réseau, clavier, écran.

**Le problème que l'I/O résout** :

Sans I/O fichier, voici les problèmes rencontrés :

1. **Données perdues** : Quand le programme s'arrête, toutes les données en mémoire disparaissent.
2. **Pas de partage** : Impossible d'échanger des données entre deux programmes.
3. **Pas de persistance** : Un programme de contacts ou de scores ne peut rien conserver entre deux utilisations.

**Comment l'I/O résout ces problèmes** :

| Problème | Solution apportée par l'I/O fichier |
| -------- | ----------------------------------- |
| Données perdues | Écrire les données dans un fichier avant l'arrêt du programme |
| Pas de partage | Un fichier peut être lu par n'importe quel programme |
| Pas de persistance | Les fichiers restent sur le disque entre les exécutions |

**Analogie concrète** : L'I/O fichier fonctionne comme une boîte aux lettres. Lire un fichier, c'est récupérer le courrier entrant (input). Écrire un fichier, c'est déposer une lettre pour l'envoi (output). La boîte (le disque) conserve le courrier même quand tu n'es pas là.

**Ce que l'I/O n'est PAS** :

- L'I/O fichier n'est pas la seule forme d'I/O. `System.out.println()` (sortie écran) et `Scanner(System.in)` (entrée clavier) sont aussi de l'I/O.
- L'I/O fichier n'est pas instantanée. Accéder au disque est plus lent qu'accéder à la mémoire, d'où l'utilisation de buffers.

---

### Path et Paths

**Définition** : `Path` est un objet Java qui représente un chemin vers un fichier ou un répertoire. C'est la façon moderne de manipuler les chemins (depuis Java 7). `Path.of()` est la méthode pour créer un objet `Path`.

**Créer un Path** :

```java
import java.nio.file.Path;

// Méthode recommandée depuis Java 11
Path fichier = Path.of("donnees.txt");

// Chemin absolu
Path absolu = Path.of("/home/user/documents/donnees.txt");

// Chemin avec plusieurs parties (assemblées automatiquement)
Path compose = Path.of("dossier", "sous-dossier", "fichier.txt");
// Résultat : dossier/sous-dossier/fichier.txt
```

**Méthodes utiles de Path** :

| Méthode | Description | Exemple |
| ------- | ----------- | ------- |
| `getFileName()` | Nom du fichier | `donnees.txt` |
| `getParent()` | Répertoire parent | `/home/user/documents` |
| `toAbsolutePath()` | Chemin absolu | `/home/user/project/donnees.txt` |
| `resolve("autre.txt")` | Ajouter un élément au chemin | `/home/user/documents/autre.txt` |
| `toString()` | Convertir en String | `"donnees.txt"` |

**Chemin relatif vs chemin absolu** :

| Chemin relatif | Chemin absolu |
| -------------- | ------------- |
| Part du répertoire courant | Part de la racine du système |
| `donnees.txt` | `/home/user/donnees.txt` |
| Dépend d'où tu lances le programme | Toujours le même |

---

### La classe Files

**Définition** : `Files` est une classe utilitaire de `java.nio.file` qui fournit des méthodes statiques pour lire, écrire, copier, déplacer et supprimer des fichiers. C'est l'outil principal pour les opérations fichier en Java moderne.

**Méthodes de lecture** :

| Méthode | Retour | Usage |
| ------- | ------ | ----- |
| `Files.readString(path)` | `String` | Lire tout le fichier d'un coup |
| `Files.readAllLines(path)` | `List<String>` | Lire toutes les lignes |
| `Files.readAllBytes(path)` | `byte[]` | Lire un fichier binaire |

**Méthodes d'écriture** :

| Méthode | Ce qu'elle fait |
| ------- | --------------- |
| `Files.writeString(path, contenu)` | Écrit une String (remplace le contenu) |
| `Files.write(path, lignes)` | Écrit une liste de lignes |
| `Files.writeString(path, contenu, APPEND)` | Ajoute à la fin du fichier |

**Méthodes de gestion** :

| Méthode | Ce qu'elle fait |
| ------- | --------------- |
| `Files.exists(path)` | Vérifie si le fichier/dossier existe |
| `Files.isDirectory(path)` | Vérifie si c'est un répertoire |
| `Files.delete(path)` | Supprime un fichier ou un répertoire vide |
| `Files.createDirectories(path)` | Crée un répertoire et tous les parents manquants |
| `Files.copy(source, dest)` | Copie un fichier |
| `Files.move(source, dest)` | Déplace ou renomme un fichier |
| `Files.list(path)` | Liste les fichiers d'un répertoire |

---

### BufferedReader et BufferedWriter

**Définition** : `BufferedReader` et `BufferedWriter` lisent et écrivent du texte ligne par ligne, en utilisant un buffer (tampon mémoire). Sans buffer, chaque lecture accède au disque. Avec un buffer, les données sont regroupées en mémoire, ce qui est beaucoup plus rapide pour les gros fichiers.

**Quand utiliser quel outil** :

| Situation | Outil recommandé |
| --------- | ---------------- |
| Petit fichier (< 1 Mo) | `Files.readString()` / `Files.writeString()` |
| Fichier moyen à gros (> 1 Mo) | `BufferedReader` / `BufferedWriter` |
| Fichier binaire (images, PDF) | `FileInputStream` / `FileOutputStream` |

---

### FileInputStream et FileOutputStream

**Définition** : `FileInputStream` et `FileOutputStream` lisent et écrivent des données binaires (octets, `byte`). Ils sont utilisés pour les fichiers non textuels : images, vidéos, fichiers compressés.

| Fichier texte | Fichier binaire |
| ------------- | --------------- |
| Contient des caractères lisibles | Contient des octets bruts |
| Exemples : `.txt`, `.csv`, `.json` | Exemples : `.png`, `.jpg`, `.zip` |
| Lu avec `BufferedReader` ou `Files.readString()` | Lu avec `FileInputStream` ou `Files.readAllBytes()` |

---

### Scanner pour lire depuis un fichier

La classe `Scanner` que tu connais pour lire le clavier peut aussi lire un fichier :

```java
try (Scanner scanner = new Scanner(Path.of("donnees.txt"))) {
    while (scanner.hasNextLine()) {
        System.out.println(scanner.nextLine());
    }
}
```

| Scanner | BufferedReader |
| ------- | -------------- |
| Syntaxe familière (`nextLine()`, `nextInt()`) | Plus performant pour les gros fichiers |
| Peut parser les types (`nextInt()`, `nextDouble()`) | Lit uniquement des Strings |

---

### Créer et supprimer des répertoires

```java
// Créer un répertoire (le parent doit exister)
Files.createDirectory(Path.of("mon-dossier"));

// Créer un répertoire et tous les parents manquants
Files.createDirectories(Path.of("parent/enfant/petit-enfant"));

// Supprimer un répertoire (doit être VIDE)
Files.delete(Path.of("mon-dossier"));

// Supprimer seulement si le fichier/dossier existe
Files.deleteIfExists(Path.of("mon-dossier"));
```

**Attention** : `Files.delete()` ne supprime pas un répertoire qui contient des fichiers. Tu dois d'abord supprimer tous les fichiers à l'intérieur.

---

## Étapes Pratiques

### Étape 1 : Lire un fichier texte entier (Files.readString)

Crée d'abord un fichier `message.txt` dans le même dossier que ton programme :

```text
Bonjour, ceci est un fichier de test.
Il contient plusieurs lignes.
Chaque ligne sera lue par le programme Java.
```

Crée un fichier `LireFichier.java` :

```java
// Fichier : LireFichier.java

import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class LireFichier {
    public static void main(String[] args) {
        System.out.println("=== Lire un fichier entier ===\n");

        Path chemin = Path.of("message.txt");

        try {
            // Lire tout le contenu du fichier en une seule String
            String contenu = Files.readString(chemin);

            System.out.println("Contenu du fichier :");
            System.out.println(contenu);

            // Afficher des informations sur le fichier
            System.out.println("Nombre de caractères : " + contenu.length());
            System.out.println("Chemin absolu : " + chemin.toAbsolutePath());

        } catch (IOException e) {
            System.out.println("Erreur de lecture : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac LireFichier.java && java LireFichier
```

**Résultat attendu** :

```text
=== Lire un fichier entier ===

Contenu du fichier :
Bonjour, ceci est un fichier de test.
Il contient plusieurs lignes.
Chaque ligne sera lue par le programme Java.

Nombre de caractères : 108
Chemin absolu : /home/user/project/message.txt
```

---

### Étape 2 : Écrire dans un fichier (Files.writeString)

Crée un fichier `EcrireFichier.java` :

```java
// Fichier : EcrireFichier.java

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.io.IOException;

public class EcrireFichier {
    public static void main(String[] args) {
        System.out.println("=== Écrire dans un fichier ===\n");

        Path chemin = Path.of("sortie.txt");

        try {
            // Écrire du contenu (crée le fichier ou remplace le contenu)
            Files.writeString(chemin, "Première ligne.\nDeuxième ligne.\nTroisième ligne.\n");
            System.out.println("Fichier créé. Contenu :");
            System.out.println(Files.readString(chemin));

            // Ajouter du contenu à la fin avec APPEND
            Files.writeString(chemin, "Quatrième ligne ajoutée.\n", StandardOpenOption.APPEND);
            System.out.println("Contenu après APPEND :");
            System.out.println(Files.readString(chemin));

            Files.delete(chemin);

        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac EcrireFichier.java && java EcrireFichier
```

**Résultat attendu** :

```text
=== Écrire dans un fichier ===

Fichier créé. Contenu :
Première ligne.
Deuxième ligne.
Troisième ligne.

Contenu après APPEND :
Première ligne.
Deuxième ligne.
Troisième ligne.
Quatrième ligne ajoutée.
```

---

### Étape 3 : Lire ligne par ligne (Files.readAllLines + boucle)

Crée un fichier `LireLignes.java` :

```java
// Fichier : LireLignes.java

import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;
import java.util.List;

public class LireLignes {
    public static void main(String[] args) {
        System.out.println("=== Lire ligne par ligne ===\n");

        Path chemin = Path.of("notes.txt");

        try {
            // Écrire un fichier de test
            Files.write(chemin, List.of(
                "Hugo : 15", "Marie : 18", "Pierre : 12", "Alice : 16", "Lucas : 14"
            ));

            // Lire toutes les lignes dans une List<String>
            List<String> lignes = Files.readAllLines(chemin);
            System.out.println("Nombre de lignes : " + lignes.size() + "\n");

            // Parcourir chaque ligne
            for (int i = 0; i < lignes.size(); i++) {
                String ligne = lignes.get(i);
                System.out.println("Ligne " + (i + 1) + " : " + ligne);

                // Extraire le nom et la note
                String[] parties = ligne.split(" : ");
                int note = Integer.parseInt(parties[1]);

                if (note >= 16) {
                    System.out.println("  → " + parties[0] + " a une très bonne note !");
                }
            }

            Files.delete(chemin);

        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac LireLignes.java && java LireLignes
```

**Résultat attendu** :

```text
=== Lire ligne par ligne ===

Nombre de lignes : 5

Ligne 1 : Hugo : 15
Ligne 2 : Marie : 18
  → Marie a une très bonne note !
Ligne 3 : Pierre : 12
Ligne 4 : Alice : 16
  → Alice a une très bonne note !
Ligne 5 : Lucas : 14
```

---

### Étape 4 : BufferedReader avec try-with-resources

Crée un fichier `LireBuffer.java` :

```java
// Fichier : LireBuffer.java

import java.io.BufferedReader;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class LireBuffer {
    public static void main(String[] args) {
        System.out.println("=== BufferedReader avec try-with-resources ===\n");

        Path chemin = Path.of("donnees.txt");

        try {
            Files.write(chemin, List.of(
                "Produit;Prix;Quantité",
                "Pommes;2.50;10",
                "Bananes;1.80;5",
                "Oranges;3.20;8",
                "Fraises;4.50;3"
            ));
        } catch (IOException e) {
            System.out.println("Erreur création fichier : " + e.getMessage());
            return;
        }

        // Le BufferedReader est automatiquement fermé à la fin du bloc try
        try (BufferedReader reader = Files.newBufferedReader(chemin, StandardCharsets.UTF_8)) {

            String entete = reader.readLine();  // Lire l'en-tête
            System.out.println("En-tête : " + entete + "\n");

            String ligne;
            double totalPrix = 0;
            int totalQuantite = 0;

            // readLine() retourne null quand il n'y a plus de lignes
            while ((ligne = reader.readLine()) != null) {
                String[] colonnes = ligne.split(";");
                String produit = colonnes[0];
                double prix = Double.parseDouble(colonnes[1]);
                int quantite = Integer.parseInt(colonnes[2]);

                double sousTotal = prix * quantite;
                totalPrix += sousTotal;
                totalQuantite += quantite;

                System.out.printf("  %s : %.2f € x %d = %.2f €%n",
                    produit, prix, quantite, sousTotal);
            }

            System.out.printf("%nTotal : %d articles pour %.2f €%n", totalQuantite, totalPrix);

        } catch (IOException e) {
            System.out.println("Erreur de lecture : " + e.getMessage());
        }

        try { Files.delete(chemin); } catch (IOException e) { /* nettoyage */ }
    }
}
```

**Compile et exécute** :

```bash
javac LireBuffer.java && java LireBuffer
```

**Résultat attendu** :

> **Note** : Le séparateur décimal (`.` ou `,`) dépend de la langue configurée sur ton système. L'exemple ci-dessous utilise le point (`.`) qui est le format par défaut de Java.

```text
=== BufferedReader avec try-with-resources ===

En-tête : Produit;Prix;Quantité

  Pommes : 2.50 € x 10 = 25.00 €
  Bananes : 1.80 € x 5 = 9.00 €
  Oranges : 3.20 € x 8 = 25.60 €
  Fraises : 4.50 € x 3 = 13.50 €

Total : 26 articles pour 73.10 €
```

---

### Étape 5 : BufferedWriter pour écrire ligne par ligne

Crée un fichier `EcrireBuffer.java` :

```java
// Fichier : EcrireBuffer.java

import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;

public class EcrireBuffer {
    public static void main(String[] args) {
        System.out.println("=== BufferedWriter pour écrire ligne par ligne ===\n");

        Path chemin = Path.of("rapport.txt");

        // Écrire avec BufferedWriter et try-with-resources
        try (BufferedWriter writer = Files.newBufferedWriter(chemin, StandardCharsets.UTF_8)) {

            writer.write("=== Rapport de notes ===");
            writer.newLine();  // Saut de ligne (adapté au système d'exploitation)
            writer.newLine();

            String[][] eleves = {
                {"Hugo", "15"}, {"Marie", "18"}, {"Pierre", "12"},
                {"Alice", "16"}, {"Lucas", "14"}
            };

            int totalNotes = 0;
            for (String[] eleve : eleves) {
                String nom = eleve[0];
                int note = Integer.parseInt(eleve[1]);
                totalNotes += note;

                writer.write(nom + " : " + note + "/20");
                writer.newLine();
            }

            writer.newLine();
            double moyenne = (double) totalNotes / eleves.length;
            writer.write(String.format("Moyenne de la classe : %.1f/20", moyenne));
            writer.newLine();

            System.out.println("Rapport écrit dans " + chemin);

        } catch (IOException e) {
            System.out.println("Erreur d'écriture : " + e.getMessage());
        }

        // Vérifier en lisant le fichier
        try {
            System.out.println("\nContenu du rapport :");
            System.out.println(Files.readString(chemin));
            Files.delete(chemin);
        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac EcrireBuffer.java && java EcrireBuffer
```

**Résultat attendu** :

```text
=== BufferedWriter pour écrire ligne par ligne ===

Rapport écrit dans rapport.txt

Contenu du rapport :
=== Rapport de notes ===

Hugo : 15/20
Marie : 18/20
Pierre : 12/20
Alice : 16/20
Lucas : 14/20

Moyenne de la classe : 15.0/20
```

---

### Étape 6 : Vérifier si un fichier/dossier existe

Crée un fichier `VerifierFichier.java` :

```java
// Fichier : VerifierFichier.java

import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;

public class VerifierFichier {
    public static void main(String[] args) {
        System.out.println("=== Vérifier l'existence de fichiers ===\n");

        Path fichierExistant = Path.of("VerifierFichier.java");
        Path fichierInexistant = Path.of("fantome.txt");
        Path dossierCourant = Path.of(".");

        // Vérifier si un fichier existe
        System.out.println(fichierExistant + " existe : " + Files.exists(fichierExistant));
        System.out.println(fichierInexistant + " existe : " + Files.exists(fichierInexistant));

        // Vérifier le type (fichier ou dossier)
        System.out.println(fichierExistant + " est un fichier : " + Files.isRegularFile(fichierExistant));
        System.out.println(dossierCourant + " est un dossier : " + Files.isDirectory(dossierCourant));

        // Obtenir la taille du fichier
        try {
            System.out.println(fichierExistant + " : " + Files.size(fichierExistant) + " octets");
        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Pattern courant : vérifier avant de lire
        Path cible = Path.of("config.txt");

        if (Files.exists(cible) && Files.isRegularFile(cible)) {
            System.out.println("Le fichier " + cible + " existe et peut être lu.");
        } else {
            System.out.println("Le fichier " + cible + " n'existe pas.");
        }
    }
}
```

**Compile et exécute** :

```bash
javac VerifierFichier.java && java VerifierFichier
```

**Résultat attendu** :

```text
=== Vérifier l'existence de fichiers ===

VerifierFichier.java existe : true
fantome.txt existe : false
VerifierFichier.java est un fichier : true
. est un dossier : true
VerifierFichier.java : 892 octets
Le fichier config.txt n'existe pas.
```

---

### Étape 7 : Lister les fichiers d'un répertoire (Files.list)

Crée un fichier `ListerFichiers.java` :

```java
// Fichier : ListerFichiers.java

import java.nio.file.Files;
import java.nio.file.Path;
import java.io.IOException;
import java.util.stream.Stream;

public class ListerFichiers {
    public static void main(String[] args) {
        System.out.println("=== Lister les fichiers d'un répertoire ===\n");

        Path dossierTest = Path.of("dossier-test");

        try {
            // Créer un répertoire de test avec des fichiers
            Files.createDirectory(dossierTest);
            Files.writeString(dossierTest.resolve("notes.txt"), "Contenu notes");
            Files.writeString(dossierTest.resolve("rapport.txt"), "Contenu rapport");
            Files.writeString(dossierTest.resolve("donnees.csv"), "nom;age\nHugo;20");
            Files.createDirectory(dossierTest.resolve("sous-dossier"));

        } catch (IOException e) {
            System.out.println("Erreur création : " + e.getMessage());
            return;
        }

        // Files.list() retourne un Stream → utiliser try-with-resources
        System.out.println("--- Tous les éléments ---");

        try (Stream<Path> fichiers = Files.list(dossierTest)) {
            fichiers.forEach(chemin -> {
                String type = Files.isDirectory(chemin) ? "[DOSSIER]" : "[FICHIER]";
                System.out.println("  " + type + " " + chemin.getFileName());
            });
        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Filtrer par extension avec .filter()
        System.out.println("\n--- Fichiers .txt uniquement ---");

        try (Stream<Path> fichiers = Files.list(dossierTest)) {
            fichiers
                .filter(chemin -> chemin.toString().endsWith(".txt"))
                .forEach(chemin -> System.out.println("  " + chemin.getFileName()));
        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }

        // Nettoyage
        try {
            Files.delete(dossierTest.resolve("notes.txt"));
            Files.delete(dossierTest.resolve("rapport.txt"));
            Files.delete(dossierTest.resolve("donnees.csv"));
            Files.delete(dossierTest.resolve("sous-dossier"));
            Files.delete(dossierTest);
        } catch (IOException e) {
            System.out.println("Erreur suppression : " + e.getMessage());
        }
    }
}
```

**Compile et exécute** :

```bash
javac ListerFichiers.java && java ListerFichiers
```

**Résultat attendu** :

```text
=== Lister les fichiers d'un répertoire ===

--- Tous les éléments ---
  [FICHIER] notes.txt
  [FICHIER] rapport.txt
  [FICHIER] donnees.csv
  [DOSSIER] sous-dossier

--- Fichiers .txt uniquement ---
  notes.txt
  rapport.txt
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac *.java` | Compile tous les fichiers Java |
| `java LireFichier` | Exécute le test de lecture |
| `java EcrireFichier` | Exécute le test d'écriture |
| `java LireBuffer` | Exécute le test BufferedReader |
| `java EcrireBuffer` | Exécute le test BufferedWriter |
| `java VerifierFichier` | Exécute le test de vérification |
| `java ListerFichiers` | Exécute le test de listage |

---

## Pièges Fréquents

### Piège 1 : Oublier try-with-resources (fuites de ressources)

**Problème** : Tu ouvres un fichier mais tu ne le fermes pas. Le fichier reste verrouillé et les données ne sont pas écrites sur le disque.

**Solution** : Utilise toujours `try-with-resources` pour les opérations fichier.

```java
// ❌ Problème : le reader n'est jamais fermé si une exception se produit
BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"));
String ligne = reader.readLine();
reader.close();  // Ne sera pas exécuté si readLine() lance une exception

// ✅ Solution : try-with-resources ferme automatiquement
try (BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"))) {
    String ligne = reader.readLine();
}  // Fermé automatiquement, même en cas d'exception
```

**Règle** : Dès que tu vois `new BufferedReader`, `new BufferedWriter`, `new Scanner(fichier)`, `new FileInputStream` ou `new FileOutputStream`, utilise `try-with-resources`.

---

### Piège 2 : Chemin relatif vs chemin absolu

**Problème** : Le programme ne trouve pas le fichier. Le chemin relatif est résolu par rapport au répertoire de travail, pas par rapport au fichier `.java`.

**Solution** : Affiche le chemin absolu pour comprendre où Java cherche.

```java
Path chemin = Path.of("donnees.txt");
System.out.println("Chemin absolu : " + chemin.toAbsolutePath());
System.out.println("Répertoire de travail : " + System.getProperty("user.dir"));
```

---

### Piège 3 : IOException non catchée (checked exception)

**Problème** : Le code ne compile pas avec `unreported exception IOException; must be caught or declared to be thrown`.

**Cause** : `IOException` est une checked exception. Le compilateur oblige à la gérer.

**Solution** : Entoure l'opération avec `try/catch` ou déclare `throws IOException`.

```java
// ❌ Ne compile pas : IOException non gérée
String contenu = Files.readString(Path.of("data.txt"));

// ✅ Solution 1 : try/catch
try {
    String contenu = Files.readString(Path.of("data.txt"));
} catch (IOException e) {
    System.out.println("Erreur : " + e.getMessage());
}

// ✅ Solution 2 : throws dans la signature
public static void main(String[] args) throws IOException {
    String contenu = Files.readString(Path.of("data.txt"));
}
```

---

### Piège 4 : Encodage (toujours spécifier StandardCharsets.UTF_8)

**Problème** : Les caractères accentués (é, è, à) sont corrompus. Java utilise l'encodage par défaut du système, qui peut ne pas être UTF-8.

**Solution** : Spécifie toujours `StandardCharsets.UTF_8` pour `BufferedReader` et `BufferedWriter`.

```java
// ❌ Utilise l'encodage par défaut du système
BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"));

// ✅ Spécifier UTF-8 explicitement
BufferedReader reader = Files.newBufferedReader(Path.of("data.txt"), StandardCharsets.UTF_8);
BufferedWriter writer = Files.newBufferedWriter(Path.of("data.txt"), StandardCharsets.UTF_8);
```

**Note** : `Files.readString()` et `Files.writeString()` utilisent UTF-8 par défaut depuis Java 11.

---

## Checklist de Validation

- [ ] Je sais créer un objet `Path` avec `Path.of()`
- [ ] Je sais lire un fichier texte entier avec `Files.readString()`
- [ ] Je sais écrire dans un fichier avec `Files.writeString()`
- [ ] Je sais lire toutes les lignes avec `Files.readAllLines()`
- [ ] Je sais utiliser `BufferedReader` avec `try-with-resources`
- [ ] Je sais utiliser `BufferedWriter` pour écrire ligne par ligne
- [ ] Je sais vérifier si un fichier existe avec `Files.exists()`
- [ ] Je sais lister les fichiers d'un répertoire avec `Files.list()`
- [ ] Je sais créer et supprimer des répertoires
- [ ] J'utilise toujours `try-with-resources` pour les opérations fichier
- [ ] Je spécifie `StandardCharsets.UTF_8` pour les opérations avec buffer

---

## Exercice Pratique

**Énoncé** : Crée un programme de gestion de contacts qui stocke les données dans un fichier CSV. Le programme doit permettre d'ajouter un contact, de lister tous les contacts et de rechercher un contact par nom.

**Format du fichier CSV** (`contacts.csv`) :

```text
nom;telephone;email
Hugo;0612345678;hugo@example.com
Marie;0698765432;marie@example.com
```

**Spécifications** :

1. Crée une classe `Contact` avec les attributs : `nom`, `telephone`, `email` (tous String).
2. Crée une classe `GestionContacts` avec les méthodes :
   - `charger()` : lit le fichier CSV et retourne une `List<Contact>`
   - `sauvegarder(List<Contact> contacts)` : écrit la liste des contacts dans le fichier CSV
   - `ajouter(Contact contact)` : ajoute un contact à la liste et sauvegarde
   - `rechercher(String nom)` : recherche un contact par nom (insensible à la casse)
3. Dans le `main` : ajoute 3 contacts, liste-les, recherche par nom, affiche le contenu du CSV.

**Résultat attendu** :

```text
=== Gestion de contacts ===

--- Ajout de contacts ---
Contact ajouté : Hugo
Contact ajouté : Marie
Contact ajouté : Pierre

--- Liste des contacts ---
  1. Hugo - 0612345678 - hugo@example.com
  2. Marie - 0698765432 - marie@example.com
  3. Pierre - 0645678901 - pierre@example.com

--- Recherche : "marie" ---
  Trouvé : Marie - 0698765432 - marie@example.com

--- Recherche : "alice" ---
  Aucun contact trouvé pour "alice".

--- Contenu du fichier contacts.csv ---
nom;telephone;email
Hugo;0612345678;hugo@example.com
Marie;0698765432;marie@example.com
Pierre;0645678901;pierre@example.com
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

    public String getNom() { return nom; }
    public String getTelephone() { return telephone; }
    public String getEmail() { return email; }

    public String toCsv() { return nom + ";" + telephone + ";" + email; }

    public static Contact fromCsv(String ligneCsv) {
        String[] p = ligneCsv.split(";");
        return new Contact(p[0], p[1], p[2]);
    }

    @Override
    public String toString() { return nom + " - " + telephone + " - " + email; }
}
```

**Fichier GestionContacts.java** :

```java
// Fichier : GestionContacts.java

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

class GestionContacts {
    private static final String EN_TETE = "nom;telephone;email";
    private Path fichier;

    public GestionContacts(String nomFichier) {
        this.fichier = Path.of(nomFichier);
    }

    // Charge les contacts depuis le fichier CSV
    public List<Contact> charger() {
        List<Contact> contacts = new ArrayList<>();

        if (!Files.exists(fichier)) {
            return contacts;
        }

        try (BufferedReader reader = Files.newBufferedReader(fichier, StandardCharsets.UTF_8)) {
            String ligne = reader.readLine();  // Ignorer l'en-tête

            while ((ligne = reader.readLine()) != null) {
                if (!ligne.trim().isEmpty()) {
                    contacts.add(Contact.fromCsv(ligne));
                }
            }
        } catch (IOException e) {
            System.out.println("Erreur de lecture : " + e.getMessage());
        }
        return contacts;
    }

    // Sauvegarde la liste des contacts dans le fichier CSV
    public void sauvegarder(List<Contact> contacts) {
        try (BufferedWriter writer = Files.newBufferedWriter(fichier, StandardCharsets.UTF_8)) {
            writer.write(EN_TETE);
            writer.newLine();

            for (Contact contact : contacts) {
                writer.write(contact.toCsv());
                writer.newLine();
            }
        } catch (IOException e) {
            System.out.println("Erreur de sauvegarde : " + e.getMessage());
        }
    }

    // Ajoute un contact et sauvegarde le fichier
    public void ajouter(Contact contact) {
        List<Contact> contacts = charger();
        contacts.add(contact);
        sauvegarder(contacts);
        System.out.println("Contact ajouté : " + contact.getNom());
    }

    // Recherche un contact par nom (insensible à la casse)
    public Contact rechercher(String nom) {
        for (Contact contact : charger()) {
            if (contact.getNom().equalsIgnoreCase(nom)) {
                return contact;
            }
        }
        return null;
    }
}
```

**Fichier TestContacts.java** :

```java
// Fichier : TestContacts.java

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

public class TestContacts {
    public static void main(String[] args) {
        System.out.println("=== Gestion de contacts ===\n");

        GestionContacts gestion = new GestionContacts("contacts.csv");

        // Ajouter des contacts
        System.out.println("--- Ajout de contacts ---");
        gestion.ajouter(new Contact("Hugo", "0612345678", "hugo@example.com"));
        gestion.ajouter(new Contact("Marie", "0698765432", "marie@example.com"));
        gestion.ajouter(new Contact("Pierre", "0645678901", "pierre@example.com"));

        // Lister tous les contacts
        System.out.println("\n--- Liste des contacts ---");
        List<Contact> contacts = gestion.charger();
        for (int i = 0; i < contacts.size(); i++) {
            System.out.println("  " + (i + 1) + ". " + contacts.get(i));
        }

        // Rechercher un contact existant
        System.out.println("\n--- Recherche : \"marie\" ---");
        Contact trouve = gestion.rechercher("marie");
        System.out.println(trouve != null ? "  Trouvé : " + trouve : "  Non trouvé.");

        // Rechercher un contact inexistant
        System.out.println("\n--- Recherche : \"alice\" ---");
        Contact nonTrouve = gestion.rechercher("alice");
        System.out.println(nonTrouve != null ? "  Trouvé : " + nonTrouve : "  Aucun contact trouvé pour \"alice\".");

        // Afficher le contenu du fichier CSV
        System.out.println("\n--- Contenu du fichier contacts.csv ---");
        try {
            System.out.println(Files.readString(Path.of("contacts.csv")));
            Files.deleteIfExists(Path.of("contacts.csv"));
        } catch (IOException e) {
            System.out.println("Erreur : " + e.getMessage());
        }
    }
}
```

**Compilation et exécution** :

```bash
javac Contact.java GestionContacts.java TestContacts.java && java TestContacts
```

**Explication de la solution** :

| Élément | Explication |
| ------- | ----------- |
| `toCsv()` / `fromCsv()` | Conversion contact vers/depuis ligne CSV |
| `BufferedReader/Writer` + `try-with-resources` | Lecture/écriture sécurisée avec fermeture automatique |
| `StandardCharsets.UTF_8` | Encodage explicite pour les caractères accentués |
| `equalsIgnoreCase()` | Recherche insensible à la casse |

---

## Navigation

← Fiche précédente : **[Les exceptions en Java](11-exceptions-java.md)**
