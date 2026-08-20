---
tags:
  - Java
  - Débutant
  - Pratique
description: "Compilation et exécution en Java"
estimated_time: "75 min"
fiche_number: 2
total_fiches: 12
cursus: "Java"
---

# 02 - Compilation et exécution en Java

> **En bref** : À la fin de cette fiche, tu comprendras le processus complet de compilation et d'exécution en Java, ainsi que les options courantes de javac et java. Lecture estimée : 75 min.


## Prérequis

- Fiche [01 - Hello World en Java](01-hello-world.md)
- Savoir utiliser le terminal pour naviguer dans les dossiers

## Objectif de cette fiche

À la fin de cette fiche, tu comprendras le processus complet de compilation et d'exécution en Java, ainsi que les options courantes de `javac` et `java`.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que la compilation ?

**Définition** : La compilation est la transformation du code source (lisible par les humains) en code machine ou bytecode (lisible par l'ordinateur ou la machine virtuelle).

**Le problème que la compilation résout** :

Sans compilation, voici les problèmes rencontrés :

1. **L'ordinateur ne comprend pas le texte** : Un processeur ne comprend que des instructions binaires (0 et 1), pas du texte comme `System.out.println()`.

2. **Erreurs détectées trop tard** : Sans compilation préalable, les erreurs de syntaxe ne sont découvertes qu'au moment de l'exécution.

3. **Performance réduite** : Interpréter le code ligne par ligne est plus lent que d'exécuter du code pré-traduit.

**Comment la compilation résout ces problèmes** :

| Problème | Solution apportée par la compilation |
| -------- | ------------------------------------ |
| L'ordinateur ne comprend pas le texte | Le compilateur traduit le texte en bytecode compréhensible par la JVM |
| Erreurs détectées trop tard | Le compilateur vérifie la syntaxe et signale les erreurs avant l'exécution |
| Performance réduite | Le bytecode compilé s'exécute plus rapidement que du code interprété |

**Analogie concrète** : Imagine que tu écris une lettre en français et que tu dois l'envoyer à quelqu'un qui ne parle que japonais. La compilation, c'est comme faire traduire ta lettre par un traducteur professionnel avant de l'envoyer. Le traducteur vérifie aussi que ta lettre est correctement écrite (pas de fautes de grammaire) et te prévient s'il y a des problèmes.

**Ce que la compilation n'est PAS** :

- La compilation n'est pas l'exécution. Compiler transforme le code, exécuter le lance.
- La compilation ne génère pas un fichier directement exécutable sur tous les systèmes. Elle génère du bytecode qui nécessite la JVM.

---

### Qu'est-ce que le bytecode ?

**Définition** : Le bytecode est un code intermédiaire entre le code source Java et le code machine natif. Il est stocké dans les fichiers `.class`.

**Pourquoi le bytecode existe** :

Le bytecode permet la portabilité. Le même fichier `.class` peut s'exécuter sur Windows, Mac, ou Linux, à condition qu'une JVM soit installée.

**Comparaison code source vs bytecode vs code machine** :

| Type | Extension | Lisible par | Exemple |
| ---- | --------- | ----------- | ------- |
| Code source | `.java` | Humains | `System.out.println("Hello");` |
| Bytecode | `.class` | JVM | Instructions binaires intermédiaires |
| Code machine | `.exe`, binaire | Processeur | Instructions binaires natives |

**Ce que le bytecode n'est PAS** :

- Le bytecode n'est pas lisible par un humain. Si tu ouvres un fichier `.class` dans un éditeur, tu verras des caractères illisibles.
- Le bytecode n'est pas spécifique à un système d'exploitation. C'est son avantage principal.

---

### Qu'est-ce que la JVM ?

**Définition** : La JVM (Java Virtual Machine) est un programme qui exécute le bytecode Java. Elle fait le lien entre le bytecode et le système d'exploitation.

**Le problème que la JVM résout** :

Sans JVM, voici le problème :

1. **Incompatibilité entre systèmes** : Un programme compilé pour Windows ne fonctionne pas sur Mac ou Linux.

**Comment la JVM résout ce problème** :

| Problème | Solution apportée par la JVM |
| -------- | ---------------------------- |
| Incompatibilité entre systèmes | Chaque système a sa propre JVM qui traduit le bytecode en instructions natives |

**Analogie concrète** : La JVM est comme un interprète universel. Tu parles une seule langue (le bytecode), et l'interprète traduit en temps réel vers la langue locale (Windows, Mac, Linux). Tu n'as pas besoin d'apprendre chaque langue.

**Schéma du processus** :

```text
HelloWorld.java  --[javac]-->  HelloWorld.class  --[java/JVM]-->  Exécution
    (source)                      (bytecode)                    (résultat)
```

---

### La commande javac

**Définition** : `javac` est le compilateur Java. Il transforme les fichiers `.java` en fichiers `.class`.

**Syntaxe de base** :

```bash
javac NomFichier.java
```

**Options courantes de javac** :

| Option | Signification | Exemple |
| ------ | ------------- | ------- |
| (aucune) | Compile le fichier dans le dossier courant | `javac Hello.java` |
| `-d dossier` | Place les fichiers `.class` dans le dossier spécifié | `javac -d bin Hello.java` |
| `-cp chemin` | Spécifie le classpath (où chercher les classes) | `javac -cp lib Hello.java` |
| `-source version` | Spécifie la version du code source | `javac -source 17 Hello.java` |
| `-target version` | Spécifie la version du bytecode cible | `javac -target 17 Hello.java` |
| `--release version` | Contraint le code source ET les APIs disponibles (préféré depuis Java 9) | `javac --release 21 Hello.java` |

**Exemples** :

```bash
# Compile un seul fichier
javac HelloWorld.java

# Compile tous les fichiers Java du dossier
javac *.java

# Compile et place le .class dans le dossier bin/
javac -d bin HelloWorld.java

# Compile avec un classpath personnalisé
javac -cp lib:. MonProgramme.java
```

---

### La commande java

**Définition** : `java` est la commande qui lance la JVM pour exécuter un programme Java compilé.

**Syntaxe de base** :

```bash
java NomClasse
```

**Important** : Tu ne mets pas l'extension `.class`.

**Options courantes de java** :

| Option | Signification | Exemple |
| ------ | ------------- | ------- |
| (aucune) | Exécute la classe dans le dossier courant | `java Hello` |
| `-cp chemin` | Spécifie où chercher les classes | `java -cp bin Hello` |
| `-version` | Affiche la version de Java | `java -version` |
| `-jar fichier.jar` | Exécute un fichier JAR | `java -jar app.jar` |

**Exemples** :

```bash
# Exécute une classe du dossier courant
java HelloWorld

# Exécute une classe du dossier bin/
java -cp bin HelloWorld

# Exécute avec des arguments
java HelloWorld arg1 arg2
```

---

### Le classpath

**Définition** : Le classpath est une liste de chemins où la JVM cherche les fichiers `.class` à charger.

**Le problème que le classpath résout** :

Sans classpath explicite, voici le problème :

1. **Classes introuvables** : Si tes fichiers `.class` sont dans un autre dossier, la JVM ne les trouve pas.

**Comment le classpath résout ce problème** :

| Problème | Solution |
| -------- | -------- |
| Classes introuvables | Le classpath indique tous les dossiers où chercher |

**Syntaxe du classpath** :

| Système | Séparateur | Exemple |
| ------- | ---------- | ------- |
| Linux/Mac | `:` | `-cp lib:bin:.` |
| Windows | `;` | `-cp lib;bin;.` |

**Le point `.`** représente le dossier courant.

**Exemple** :

```bash
# Structure du projet
projet/
├── src/
│   └── HelloWorld.java
└── bin/
    └── HelloWorld.class

# Compilation vers bin/
javac -d bin src/HelloWorld.java

# Exécution depuis bin/
java -cp bin HelloWorld
```

---

## Étapes Pratiques

### Étape 1 : Créer une structure de projet

Crée une structure organisée pour tes fichiers.

```bash
mkdir -p ~/java-exercices/jour02/src
mkdir -p ~/java-exercices/jour02/bin
cd ~/java-exercices/jour02
```

**Structure créée** :

```text
jour02/
├── src/    (fichiers sources .java)
└── bin/    (fichiers compilés .class)
```

---

### Étape 2 : Créer un programme source

Crée le fichier `src/Calculatrice.java` :

```java
// Fichier : src/Calculatrice.java
// Programme qui effectue des calculs simples

public class Calculatrice {
    public static void main(String[] args) {
        // Affiche le nom du programme
        System.out.println("=== Calculatrice Java ===");
        System.out.println();

        // Effectue des calculs
        System.out.println("5 + 3 = " + (5 + 3));
        System.out.println("10 - 4 = " + (10 - 4));
        System.out.println("6 * 7 = " + (6 * 7));
        System.out.println("20 / 4 = " + (20 / 4));

        System.out.println();
        System.out.println("Fin des calculs.");
    }
}
```

---

### Étape 3 : Compiler vers le dossier bin

Compile le fichier source et place le résultat dans `bin/` :

```bash
javac -d bin src/Calculatrice.java
```

**Vérification** :

```bash
ls bin/
```

**Résultat attendu** :

```text
Calculatrice.class
```

---

### Étape 4 : Exécuter avec le classpath

Exécute le programme en spécifiant le classpath :

```bash
java -cp bin Calculatrice
```

**Résultat attendu** :

```text
=== Calculatrice Java ===

5 + 3 = 8
10 - 4 = 6
6 * 7 = 42
20 / 4 = 5

Fin des calculs.
```

---

### Étape 5 : Compiler plusieurs fichiers

Crée un deuxième fichier `src/Message.java` :

```java
// Fichier : src/Message.java
// Programme qui affiche plusieurs messages

public class Message {
    public static void main(String[] args) {
        System.out.println("Premier message");
        System.out.println("Deuxième message");
        System.out.println("Troisième message");
    }
}
```

Compile tous les fichiers Java du dossier src :

```bash
javac -d bin src/*.java
```

**Vérification** :

```bash
ls bin/
```

**Résultat attendu** :

```text
Calculatrice.class  Message.class
```

---

### Étape 6 : Exécuter l'un ou l'autre programme

```bash
# Exécute Calculatrice
java -cp bin Calculatrice

# Exécute Message
java -cp bin Message
```

---

### Étape 7 : Comprendre les erreurs de compilation

Crée un fichier avec une erreur volontaire `src/Erreur.java` :

```java
// Fichier : src/Erreur.java
// Ce fichier contient une erreur volontaire

public class Erreur {
    public static void main(String[] args) {
        System.out.println("Ligne 1")    // Point-virgule manquant
        System.out.println("Ligne 2");
    }
}
```

Compile :

```bash
javac -d bin src/Erreur.java
```

**Résultat attendu** :

```text
src/Erreur.java:6: error: ';' expected
        System.out.println("Ligne 1")
                                     ^
1 error
```

**Comment lire ce message** :

| Partie | Signification |
| ------ | ------------- |
| `src/Erreur.java:6` | Fichier et numéro de ligne |
| `error: ';' expected` | Type d'erreur : point-virgule attendu |
| `^` | Position exacte de l'erreur |
| `1 error` | Nombre total d'erreurs |

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `javac Fichier.java` | Compile un fichier |
| `javac -d bin Fichier.java` | Compile vers le dossier bin |
| `javac src/*.java` | Compile tous les fichiers Java de src |
| `java NomClasse` | Exécute une classe |
| `java -cp bin NomClasse` | Exécute avec classpath |
| `java -version` | Affiche la version de Java |

---

## Pièges Fréquents

### Piège 1 : Oublier de recompiler

⚠️ **Problème** : Les modifications du code ne sont pas prises en compte.

✅ **Solution** : Après chaque modification d'un fichier `.java`, tu dois recompiler avec `javac`.

```bash
# Modifier le fichier, puis :
javac -d bin src/MonFichier.java
java -cp bin MonFichier
```

---

### Piège 2 : Mauvais classpath

⚠️ **Problème** : Erreur "Could not find or load main class".

✅ **Solution** : Vérifie que le classpath pointe vers le bon dossier.

```bash
# Incorrect : le .class est dans bin/ mais on cherche dans le dossier courant
java Calculatrice

# Correct : on spécifie bin/ comme classpath
java -cp bin Calculatrice
```

---

### Piège 3 : Mettre l'extension .class

⚠️ **Problème** : Erreur "Could not find or load main class X.class".

✅ **Solution** : Ne pas mettre l'extension avec la commande `java`.

```bash
# Incorrect
java -cp bin Calculatrice.class

# Correct
java -cp bin Calculatrice
```

---

### Piège 4 : Confondre le dossier source et le dossier de compilation

⚠️ **Problème** : Le fichier `.class` n'est pas créé où tu l'attends.

✅ **Solution** : Utilise `-d` pour spécifier le dossier de destination.

```bash
# Sans -d : le .class est créé à côté du .java (dans src/)
javac src/Hello.java

# Avec -d : le .class est créé dans bin/
javac -d bin src/Hello.java
```

---

## Checklist de Validation

- [ ] J'ai compris la différence entre compilation et exécution
- [ ] J'ai compris ce qu'est le bytecode
- [ ] J'ai compris le rôle de la JVM
- [ ] J'ai créé une structure src/ et bin/
- [ ] J'ai compilé avec `javac -d bin`
- [ ] J'ai exécuté avec `java -cp bin`
- [ ] J'ai compris comment lire une erreur de compilation

---

## Exercice Pratique

**Énoncé** : Crée un projet avec deux programmes Java distincts.

**Indications** :

- Crée un dossier `exercice02` avec les sous-dossiers `src` et `bin`
- Crée un fichier `src/Presentation.java` qui affiche ton nom et ta date de naissance
- Crée un fichier `src/Compteur.java` qui affiche les nombres de 1 à 5 (un par ligne)
- Compile les deux fichiers vers `bin/`
- Exécute chaque programme séparément

**Résultat attendu pour Presentation** :

```text
Nom : [ton nom]
Date de naissance : [ta date]
```

**Résultat attendu pour Compteur** :

```text
1
2
3
4
5
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

**Création de la structure** :

```bash
mkdir -p ~/java-exercices/exercice02/src
mkdir -p ~/java-exercices/exercice02/bin
cd ~/java-exercices/exercice02
```

**Fichier src/Presentation.java** :

```java
// Fichier : src/Presentation.java
// Affiche des informations personnelles

public class Presentation {
    public static void main(String[] args) {
        System.out.println("Nom : Bob");
        System.out.println("Date de naissance : 15/03/2000");
    }
}
```

**Fichier src/Compteur.java** :

```java
// Fichier : src/Compteur.java
// Affiche les nombres de 1 à 5

public class Compteur {
    public static void main(String[] args) {
        System.out.println("1");
        System.out.println("2");
        System.out.println("3");
        System.out.println("4");
        System.out.println("5");
    }
}
```

**Compilation** :

```bash
javac -d bin src/*.java
```

**Exécution** :

```bash
java -cp bin Presentation
java -cp bin Compteur
```

---

## Navigation

← Fiche précédente : **[Hello World en Java](01-hello-world.md)**

→ Fiche suivante : **[Variables et types de données en Java](03-variables-types.md)**
