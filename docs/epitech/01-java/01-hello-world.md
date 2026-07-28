---
tags:
  - Java
  - Débutant
  - Pratique
description: "Hello World en Java"
estimated_time: "60 min"
fiche_number: 1
total_fiches: 12
cursus: "Java"
---

# 01 - Hello World en Java

> **En bref** : À la fin de cette fiche, tu sauras créer un programme Java simple qui affiche "Hello World" dans le terminal. Lecture estimée : 60 min.


## Prérequis

- Avoir un JDK (Java Development Kit) installé sur ton ordinateur
- Savoir ouvrir un terminal (invite de commandes)
- Savoir créer un fichier texte avec un éditeur (VS Code, Notepad++, ou autre)
- Aucune connaissance préalable de Java n'est requise (tout est expliqué ci-dessous)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer un programme Java simple qui affiche "Hello World" dans le terminal.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que Java ?

**Définition** : Java est un langage de programmation orienté objet créé en 1995. Il permet de créer des applications qui fonctionnent sur n'importe quel ordinateur possédant une machine virtuelle Java (JVM).

**Le problème que Java résout** :

Sans Java (ou un langage similaire), voici les problèmes rencontrés :

1. **Dépendance au système** : Un programme écrit pour Windows ne fonctionne pas sur Mac ou Linux. Il faut réécrire le code pour chaque système.

2. **Gestion de la mémoire complexe** : Dans certains langages comme C, le programmeur doit gérer manuellement la mémoire (allouer et libérer). Des erreurs peuvent causer des plantages.

3. **Code difficile à organiser** : Sans structure claire, les gros programmes deviennent impossibles à maintenir.

**Comment Java résout ces problèmes** :

| Problème | Solution apportée par Java |
| -------- | -------------------------- |
| Dépendance au système | Java utilise une machine virtuelle (JVM). Le même code fonctionne partout où la JVM est installée |
| Gestion mémoire complexe | Java gère automatiquement la mémoire avec un "ramasse-miettes" (garbage collector) |
| Code difficile à organiser | Java impose la programmation orientée objet, qui structure le code en classes |

**Analogie concrète** : Imagine que tu écris une lettre. Sans Java, c'est comme écrire une lettre différente pour chaque pays (en changeant la langue, le format). Avec Java, tu écris une seule lettre universelle, et un traducteur (la JVM) l'adapte automatiquement pour chaque destinataire.

**Ce que Java n'est PAS** :

- Java n'est pas JavaScript. Malgré la similarité des noms, ce sont deux langages différents. JavaScript s'exécute dans le navigateur web, Java s'exécute sur un serveur ou en local.
- Java n'est pas un langage interprété. Java est compilé en bytecode, puis ce bytecode est exécuté par la JVM.

**Comparaison Java vs Python** :

| Java | Python |
| ---- | ------ |
| Compilé puis exécuté | Interprété ligne par ligne |
| Typage statique (types déclarés) | Typage dynamique (types déduits) |
| Plus verbeux (plus de code) | Plus concis |
| Plus rapide à l'exécution | Plus lent à l'exécution |
| Accolades { } pour les blocs | Indentation pour les blocs |

---

### Qu'est-ce qu'un programme Java ?

**Définition** : Un programme Java est un fichier texte contenant du code source Java (extension `.java`), qui est ensuite compilé en bytecode (extension `.class`), puis exécuté par la JVM.

**Le cycle de vie d'un programme Java** :

1. **Écriture** : Tu écris le code dans un fichier `MonProgramme.java`
2. **Compilation** : La commande `javac` transforme le fichier en `MonProgramme.class`
3. **Exécution** : La commande `java` lance le programme

**Analogie concrète** : C'est comme écrire une recette de cuisine (le code source), la traduire en instructions universelles (la compilation), puis cuisiner le plat (l'exécution). La traduction permet à n'importe quel cuisinier de suivre les mêmes instructions.

---

### La structure minimale d'un programme Java

**Définition** : Tout programme Java doit contenir au minimum une classe avec une méthode `main`. C'est le point d'entrée du programme.

**Structure obligatoire** :

```java
public class NomDuProgramme {
    public static void main(String[] args) {
        // Le code à exécuter va ici
    }
}
```

**Explication de chaque élément** :

| Élément | Signification |
| ------- | ------------- |
| `public` | La classe est accessible de partout |
| `class` | Mot-clé qui déclare une classe |
| `NomDuProgramme` | Le nom de la classe (doit correspondre au nom du fichier) |
| `{` et `}` | Délimitent le contenu de la classe |
| `public static void main(String[] args)` | La méthode principale, point d'entrée du programme |
| `String[] args` | Les arguments passés au programme (tu verras ça plus tard) |

**Règle importante** : Le nom du fichier doit être **exactement** le même que le nom de la classe, avec l'extension `.java`. Si ta classe s'appelle `HelloWorld`, le fichier doit s'appeler `HelloWorld.java`.

---

### L'instruction System.out.println

**Définition** : `System.out.println()` est l'instruction Java qui affiche du texte dans le terminal, suivi d'un retour à la ligne.

**Syntaxe** :

```java
System.out.println("Le texte à afficher");
```

**Explication détaillée** :

| Partie | Signification |
| ------ | ------------- |
| `System` | Classe système de Java qui donne accès aux fonctionnalités de base |
| `.out` | Flux de sortie standard (le terminal) |
| `.println()` | Méthode qui affiche le texte et passe à la ligne suivante |
| `"texte"` | Le texte à afficher, entre guillemets doubles |

**Variantes** :

| Instruction | Comportement |
| ----------- | ------------ |
| `System.out.println("Bonjour");` | Affiche "Bonjour" puis passe à la ligne |
| `System.out.print("Bonjour");` | Affiche "Bonjour" sans passer à la ligne |

**Ce que System.out.println n'est PAS** :

- Ce n'est pas `echo` (comme en PHP ou Bash)
- Ce n'est pas `print` tout court (en Java, `print` existe mais n'ajoute pas de retour à la ligne)
- Ce n'est pas `console.log` (c'est JavaScript)

---

### Les commentaires en Java

**Définition** : Un commentaire est du texte ignoré par le compilateur. Il sert à expliquer le code pour les humains.

**Les trois types de commentaires** :

| Type | Syntaxe | Utilisation |
| ---- | ------- | ----------- |
| Ligne simple | `// commentaire` | Pour une courte explication |
| Multi-lignes | `/* commentaire */` | Pour des explications longues |
| Documentation | `/** commentaire */` | Pour générer de la documentation automatique |

**Exemples** :

```java
// Ceci est un commentaire sur une ligne

/* Ceci est un commentaire
   sur plusieurs lignes */

/**
 * Ceci est un commentaire de documentation.
 * Il décrit une classe ou une méthode.
 */
```

---

## Étapes Pratiques

### Étape 1 : Vérifier que Java est installé

Avant de coder, vérifie que Java est installé sur ton ordinateur.

Ouvre un terminal et tape :

```bash
java -version
```

**Résultat attendu** :

```text
java version "21.0.1" 2023-10-17 LTS
Java(TM) SE Runtime Environment (build 21.0.1+12-LTS-29)
Java HotSpot(TM) 64-Bit Server VM (build 21.0.1+12-LTS-29, mixed mode, sharing)
```

Le numéro de version peut être différent. Ce cursus cible **Java 21 LTS** (support étendu jusqu'en 2031 chez Oracle ; mises à jour gratuites Oracle sous licence NFTC jusqu'en septembre 2026, puis OTN pour les builds Oracle).

**Java 25** est le LTS sorti en septembre 2025 : les exemples de ce cursus restent valides sur 21 et 25. Après septembre 2026, pour rester en mises à jour gratuites côté Oracle, passe à **Java 25 LTS**, ou utilise une distribution OpenJDK gratuite (Temurin, Amazon Corretto, etc.) qui continue de fournir des builds 21. L'important est qu'une version LTS récente (17, 21 ou 25) s'affiche.

Vérifie aussi le compilateur :

```bash
javac -version
```

**Résultat attendu** :

```text
javac 21.0.1
```

Si tu obtiens "command not found" ou "commande introuvable", Java n'est pas installé ou pas configuré correctement.

---

### Étape 2 : Créer le dossier de travail

Crée un dossier pour tes exercices Java.

```bash
mkdir -p ~/java-exercices/jour01
cd ~/java-exercices/jour01
```

**Explication** :

| Commande | Action |
| -------- | ------ |
| `mkdir -p` | Crée le dossier (et les dossiers parents si nécessaire) |
| `~/java-exercices/jour01` | Chemin du dossier (~ = ton dossier personnel) |
| `cd` | Change le répertoire courant |

---

### Étape 3 : Créer le fichier HelloWorld.java

Crée un fichier nommé `HelloWorld.java` avec ce contenu :

```java
// Fichier : HelloWorld.java
// Mon premier programme Java

public class HelloWorld {
    public static void main(String[] args) {
        // Affiche "Hello World!" dans le terminal
        System.out.println("Hello World!");
    }
}
```

**Explication ligne par ligne** :

| Ligne | Explication |
| ----- | ----------- |
| `// Fichier : HelloWorld.java` | Commentaire indiquant le nom du fichier |
| `// Mon premier programme Java` | Commentaire décrivant le but du programme |
| `public class HelloWorld {` | Déclare une classe publique nommée HelloWorld |
| `public static void main(String[] args) {` | Déclare la méthode principale |
| `System.out.println("Hello World!");` | Affiche le texte dans le terminal |
| `}` | Ferme la méthode main |
| `}` | Ferme la classe HelloWorld |

---

### Étape 4 : Compiler le programme

Dans le terminal, compile le fichier :

```bash
javac HelloWorld.java
```

**Résultat attendu** :

Aucune sortie si tout va bien. Si tu as des erreurs, elles s'afficheront ici.

Vérifie qu'un fichier `.class` a été créé :

```bash
ls
```

**Résultat attendu** :

```text
HelloWorld.class  HelloWorld.java
```

Le fichier `HelloWorld.class` contient le bytecode compilé.

---

### Étape 5 : Exécuter le programme

Lance le programme :

```bash
java HelloWorld
```

**Important** : Tu tapes `HelloWorld` sans l'extension `.class` ni `.java`.

**Résultat attendu** :

```text
Hello World!
```

---

### Étape 6 : Modifier et relancer

Modifie le fichier pour afficher un message différent :

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Bonjour, je suis un programme Java !");
        System.out.println("Je m'appelle HelloWorld.");
    }
}
```

Recompile et relance :

```bash
javac HelloWorld.java && java HelloWorld
```

**Résultat attendu** :

```text
Bonjour, je suis un programme Java !
Je m'appelle HelloWorld.
```

---

## Commandes Utiles

| Commande | Action |
| -------- | ------ |
| `java -version` | Affiche la version de Java installée |
| `javac -version` | Affiche la version du compilateur |
| `javac Fichier.java` | Compile un fichier Java en bytecode |
| `java NomClasse` | Exécute un programme Java compilé |
| `javac *.java` | Compile tous les fichiers Java du dossier |

---

## Pièges Fréquents

### Piège 1 : Nom du fichier différent du nom de la classe

⚠️ **Problème** : Erreur "class X is public, should be declared in a file named X.java"

✅ **Solution** : Le nom du fichier doit correspondre exactement au nom de la classe (majuscules comprises).

```java
// Fichier : Hello.java
// Incorrect : la classe s'appelle HelloWorld mais le fichier s'appelle Hello.java
public class HelloWorld {
    // ...
}

// Correct : renommer le fichier en HelloWorld.java
// OU renommer la classe en Hello
```

---

### Piège 2 : Oublier le point-virgule

⚠️ **Problème** : Erreur "';' expected"

✅ **Solution** : Chaque instruction Java doit se terminer par un point-virgule.

```java
// Incorrect
System.out.println("Hello World")

// Correct
System.out.println("Hello World");
```

---

### Piège 3 : Écrire "system" en minuscule

⚠️ **Problème** : Erreur "cannot find symbol: variable system"

✅ **Solution** : Java est sensible à la casse. C'est `System` avec un S majuscule.

```java
// Incorrect
system.out.println("Hello");

// Correct
System.out.println("Hello");
```

---

### Piège 4 : Oublier de recompiler après modification

⚠️ **Problème** : Les modifications ne sont pas prises en compte.

✅ **Solution** : Après chaque modification du fichier `.java`, tu dois recompiler avec `javac` avant de relancer avec `java`.

```bash
# Modifier le fichier, puis :
javac HelloWorld.java
java HelloWorld
```

---

### Piège 5 : Lancer java avec l'extension

⚠️ **Problème** : Erreur "Could not find or load main class HelloWorld.java"

✅ **Solution** : Ne pas mettre l'extension quand tu lances `java`.

```bash
# Incorrect
java HelloWorld.java
java HelloWorld.class

# Correct
java HelloWorld
```

---

## Checklist de Validation

- [ ] J'ai vérifié que Java est installé avec `java -version`
- [ ] J'ai vérifié que javac est installé avec `javac -version`
- [ ] J'ai créé un fichier `HelloWorld.java`
- [ ] Le nom de ma classe correspond au nom du fichier
- [ ] J'ai compilé avec `javac HelloWorld.java`
- [ ] J'ai exécuté avec `java HelloWorld`
- [ ] J'ai vu "Hello World!" dans le terminal
- [ ] J'ai compris le rôle de `System.out.println()`

---

## Exercice Pratique

**Énoncé** : Crée un programme Java qui affiche ta carte de visite dans le terminal.

**Indications** :

- Crée un fichier nommé `CarteVisite.java`
- La classe doit s'appeler `CarteVisite`
- Affiche ton prénom sur la première ligne
- Affiche ta formation sur la deuxième ligne
- Affiche une passion ou un hobby sur la troisième ligne
- Ajoute une ligne vide entre le prénom et les informations (utilise `System.out.println();` sans texte)
- Utilise au moins un commentaire pour expliquer ton code

**Résultat attendu** (exemple) :

```text
Alice

Formation : Epitech Lyon
Passion : Programmation
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```java
// Fichier : CarteVisite.java
// Ce programme affiche une carte de visite dans le terminal

public class CarteVisite {
    public static void main(String[] args) {
        // Affiche le prénom
        System.out.println("Alice");

        // Ligne vide pour séparer visuellement
        System.out.println();

        // Affiche les informations
        System.out.println("Formation : Epitech Lyon");
        System.out.println("Passion : Programmation");
    }
}
```

**Compilation et exécution** :

```bash
javac CarteVisite.java
java CarteVisite
```

**Explication de la solution** :

| Ligne | Explication |
| ----- | ----------- |
| `System.out.println("Alice");` | Affiche le prénom puis passe à la ligne |
| `System.out.println();` | Affiche une ligne vide (pas de texte entre les parenthèses) |
| `System.out.println("Formation : ...");` | Affiche les informations |

---

## Navigation

→ Fiche suivante : **[Compilation et exécution en Java](02-compilation-execution.md)**
