---
tags:
  - C
  - Débutant
  - Concept
description: "Découvrir le langage C, installer le compilateur, comprendre le cycle de compilation et écrire un premier programme."
estimated_time: "60 min"
fiche_number: 1
total_fiches: 10
cursus: "Langage C"
---

# 01 - Introduction au langage C

> **En bref** : Comprendre l'histoire du langage C, installer un compilateur, écrire et compiler un premier programme Hello World, et créer un Makefile basique. Lecture estimée : 60 min.

## Prérequis

- Aucune connaissance préalable du langage C n'est requise (tout est expliqué ci-dessous)
- Savoir ouvrir un terminal (invite de commandes)

## Objectif de cette fiche

À la fin de cette fiche, tu sauras installer un compilateur C, comprendre le cycle de compilation, écrire un programme Hello World et automatiser la compilation avec un Makefile.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que le langage C ?

**Définition** : Le langage C est un langage de programmation compilé, créé en 1972 par Dennis Ritchie aux laboratoires Bell. Il permet de programmer au plus près du matériel tout en restant lisible par un humain.

**Le problème que le C résout** :

Sans le C (ou un langage similaire de bas niveau), voici les problèmes rencontrés :

1. **Programmation en assembleur** : avant le C, les programmes systèmes étaient écrits en assembleur, un langage spécifique à chaque processeur. Un programme écrit pour un processeur Intel ne fonctionnait pas sur un processeur Motorola.
2. **Aucune portabilité** : réécrire un programme pour chaque architecture matérielle prenait des mois.
3. **Productivité faible** : l'assembleur est verbeux. Une opération simple comme additionner deux nombres nécessite plusieurs instructions.

**Comment le C résout ces problèmes** :

| Problème | Solution apportée par le C |
| --- | --- |
| Programmation en assembleur | Syntaxe de haut niveau compilée en code machine par le compilateur |
| Aucune portabilité | Un même code source C peut être compilé sur différentes architectures |
| Productivité faible | Des instructions concises (une ligne de C remplace souvent 5 à 10 lignes d'assembleur) |

**Analogie concrète** : Imagine que tu veuilles construire une maison. L'assembleur, c'est fabriquer chaque brique toi-même à partir d'argile. Le C, c'est acheter des briques standard en magasin et les assembler selon un plan. Tu gardes le contrôle sur la construction (où placer chaque brique), mais tu n'as plus besoin de fabriquer les briques.

**Ce que le C n'est PAS** :

- Le C n'est pas un langage orienté objet. Il n'y a pas de classes, d'héritage ou de polymorphisme. Pour cela, il faut utiliser le C++ ou un autre langage.
- Le C n'est pas un langage avec gestion automatique de la mémoire. Tu dois allouer et libérer la mémoire toi-même (contrairement à Python ou Java qui ont un ramasse-miettes).
- Le C n'est pas obsolète. Le noyau Linux, les bases de données (PostgreSQL, SQLite), les interpréteurs (Python, Ruby) et les systèmes embarqués sont encore écrits en C aujourd'hui.

**Langage compilé vs interprété** :

| Langage compilé (C) | Langage interprété (Python) |
| --- | --- |
| Code transformé en binaire avant exécution | Code lu et exécuté ligne par ligne |
| Exécution très rapide | Exécution plus lente |
| Erreurs détectées à la compilation | Erreurs détectées à l'exécution |
| Fichier exécutable généré | Fichier source exécuté directement |

---

### Qu'est-ce que le cycle de compilation ?

**Définition** : Le cycle de compilation est la série d'étapes qui transforment ton code source C (un fichier texte lisible par un humain) en un fichier exécutable compréhensible par le processeur.

**Le problème que le cycle de compilation résout** :

Sans compilation, voici les problèmes rencontrés :

1. **Le processeur ne comprend pas le texte** : un fichier `.c` est du texte. Le processeur ne sait exécuter que des instructions binaires (des suites de 0 et de 1).
2. **Les bibliothèques sont séparées** : ton programme utilise des fonctions qui existent dans d'autres fichiers. Il faut relier tout ensemble.

**Comment le cycle de compilation résout ces problèmes** :

| Problème | Solution apportée par la compilation |
| --- | --- |
| Le processeur ne comprend pas le texte | Le compilateur traduit le code source en code machine |
| Les bibliothèques sont séparées | L'éditeur de liens relie ton code aux bibliothèques nécessaires |

**Les quatre étapes du cycle** :

```text
Fichier source (.c)
    │
    ▼ Étape 1 : Préprocesseur (directives #include, #define)
Fichier prétraité (.i)
    │
    ▼ Étape 2 : Compilation (traduction en assembleur)
Fichier assembleur (.s)
    │
    ▼ Étape 3 : Assemblage (traduction en code objet)
Fichier objet (.o)
    │
    ▼ Étape 4 : Édition de liens (liaison avec les bibliothèques)
Fichier exécutable (a.out ou nom choisi)
```

**Analogie concrète** : Pense à la fabrication d'un meuble en kit. L'étape 1 (préprocesseur) correspond à rassembler toutes les pièces et la notice. L'étape 2 (compilation) correspond à découper les planches aux bonnes dimensions. L'étape 3 (assemblage) correspond à visser les pièces entre elles. L'étape 4 (édition de liens) correspond à fixer le meuble au mur et le connecter à l'électricité si nécessaire.

---

### Qu'est-ce qu'un Makefile ?

**Définition** : Un Makefile est un fichier qui contient des règles pour automatiser la compilation. L'outil `make` lit ce fichier et exécute les commandes nécessaires.

**Le problème que le Makefile résout** :

Sans Makefile, voici les problèmes rencontrés :

1. **Commandes longues à retaper** : à chaque modification, tu dois retaper la commande de compilation complète avec tous les fichiers et les options.
2. **Recompilation inutile** : sans Makefile, tu recompiles tout le projet même si un seul fichier a changé.

**Comment le Makefile résout ces problèmes** :

| Problème | Solution apportée par le Makefile |
| --- | --- |
| Commandes longues à retaper | Une seule commande `make` suffit |
| Recompilation inutile | `make` ne recompile que les fichiers modifiés |

**Analogie concrète** : Un Makefile, c'est comme une recette de cuisine. Tu n'as pas besoin de te souvenir de toutes les étapes à chaque fois : tu ouvres la recette et tu suis les instructions. De plus, si tu as déjà coupé les légumes hier et qu'ils sont encore au frigo, tu ne les recoupes pas (recompilation partielle).

---

## Étapes Pratiques

### Étape 1 : Installer le compilateur

Le compilateur transforme ton code C en programme exécutable. Deux compilateurs principaux existent : **GCC** (GNU Compiler Collection) et **Clang**.

**Sur macOS** :

```bash
# Installe les outils en ligne de commande Apple (inclut Clang)
xcode-select --install
```

**Sur Linux (Debian/Ubuntu)** :

```bash
# Installe GCC et les outils de compilation
sudo apt update && sudo apt install -y build-essential
```

Vérifie que le compilateur est installé :

```bash
# Affiche la version du compilateur
gcc --version
```

**Résultat attendu** (exemples ; la tienne peut différer) :

```text
# Sous Linux avec GCC, par exemple :
gcc (Ubuntu 13.2.0-23ubuntu4) 13.2.0
Copyright (C) 2023 Free Software Foundation, Inc.

# Sous macOS, `gcc` est souvent un alias vers Clang, par exemple :
# Apple clang version 15.0.0 (clang-1500.1.0.2.5)
# Target: arm64-apple-darwin23.0.0
```

Le numéro de version et le nom du compilateur peuvent varier (GCC ou Clang). L'important est qu'aucune erreur du type `command not found` n'apparaisse.

---

### Étape 2 : Créer le premier programme

Crée un dossier pour tes exercices et un fichier source :

```bash
# Crée un dossier de travail
mkdir -p ~/projets-c/01-hello

# Ouvre le fichier dans ton éditeur
cd ~/projets-c/01-hello
```

Crée le fichier `main.c` avec ce contenu :

```c
// Inclut la bibliothèque standard d'entrées/sorties
// Cette ligne donne accès à la fonction printf
#include <stdio.h>

// Fonction principale - point d'entrée du programme
// Le programme commence toujours par exécuter main
int main(void)
{
    // Affiche du texte dans le terminal
    // \n crée un retour à la ligne
    printf("Hello, World!\n");

    // Retourne 0 pour indiquer que le programme s'est terminé sans erreur
    // Par convention, 0 = succès, autre valeur = erreur
    return 0;
}
```

---

### Étape 3 : Compiler et exécuter

```bash
# Compile le fichier main.c en un exécutable nommé hello
gcc main.c -o hello
```

Détail de la commande :

- `gcc` : appelle le compilateur
- `main.c` : fichier source à compiler
- `-o hello` : nomme le fichier de sortie `hello` (sans cette option, le nom par défaut est `a.out`)

```bash
# Exécute le programme
./hello
```

**Résultat attendu** :

```text
Hello, World!
```

---

### Étape 4 : Compiler avec les options de sécurité

En pratique, on compile toujours avec des options qui activent les avertissements du compilateur :

```bash
# Compile avec les avertissements activés, en ciblant la norme C17
gcc -std=c17 -Wall -Wextra -Werror main.c -o hello
```

Détail des options :

- `-std=c17` : cible la norme C17 (ISO/IEC 9899:2018), norme de référence de ce cursus - compatible avec GCC 8+ et Clang 6+. Note : GCC 15 (2026) utilise C23 par défaut ; spécifier `-std=c17` garantit le comportement attendu quelle que soit la version du compilateur.
- `-Wall` : active tous les avertissements courants
- `-Wextra` : active les avertissements supplémentaires
- `-Werror` : traite les avertissements comme des erreurs (le programme ne compile pas tant qu'il y a des avertissements)

**Résultat attendu** :

```text
(aucune sortie = aucun avertissement, compilation réussie)
```

---

### Étape 5 : Créer un Makefile

Crée un fichier nommé `Makefile` (sans extension) dans le même dossier :

```makefile
# Nom du compilateur
CC = gcc

# Options de compilation (norme C17 + avertissements actives)
CFLAGS = -std=c17 -Wall -Wextra -Werror

# Nom du programme final
TARGET = hello

# Fichiers sources
SRC = main.c

# Règle par défaut : compile le programme
all: $(TARGET)

# Règle de compilation : crée l'exécutable à partir des sources
$(TARGET): $(SRC)
    $(CC) $(CFLAGS) $(SRC) -o $(TARGET)

# Règle de nettoyage : supprime les fichiers générés
clean:
    rm -f $(TARGET)

# Indique que ces noms ne sont pas des fichiers
.PHONY: all clean
```

**Important** : les lignes de commande dans un Makefile **doivent** utiliser une tabulation (touche Tab), pas des espaces. C'est une contrainte historique de `make`. L'exemple ci-dessus utilise des espaces pour l'affichage, mais tu dois utiliser des tabulations dans ton fichier réel.

Utilise le Makefile :

```bash
# Compile le programme
make

# Exécute le programme
./hello

# Supprime les fichiers générés
make clean
```

**Résultat attendu** :

```text
gcc -std=c17 -Wall -Wextra -Werror main.c -o hello
```

`make` affiche la commande qu'il exécute, puis le programme est prêt.

---

### Étape 6 : Observer les étapes de compilation

Pour mieux comprendre le cycle de compilation, tu peux demander au compilateur de s'arrêter à chaque étape :

```bash
# Étape 1 : Préprocesseur seulement (génère main.i)
gcc -E main.c -o main.i

# Étape 2 : Compilation en assembleur (génère main.s)
gcc -S main.c -o main.s

# Étape 3 : Assemblage en fichier objet (génère main.o)
gcc -c main.c -o main.o

# Étape 4 : Édition de liens (génère l'exécutable)
gcc main.o -o hello
```

```bash
# Observe la taille de chaque fichier intermédiaire
ls -la main.i main.s main.o hello
```

**Résultat attendu** :

```text
-rw-r--r--  1 user user  17893 main.i
-rw-r--r--  1 user user    461 main.s
-rw-r--r--  1 user user   1496 main.o
-rwxr-xr-x  1 user user  16696 hello
```

Les tailles varient selon le système, mais tu remarques que `main.i` est beaucoup plus gros que `main.c` (le préprocesseur a injecté tout le contenu de `stdio.h`).

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `gcc fichier.c -o programme` | Compile un fichier C en un exécutable |
| `gcc -std=c17 -Wall -Wextra -Werror fichier.c -o programme` | Compile en norme C17 avec tous les avertissements |
| `gcc -E fichier.c -o fichier.i` | Arrête après le préprocesseur |
| `gcc -S fichier.c -o fichier.s` | Arrête après la compilation (assembleur) |
| `gcc -c fichier.c -o fichier.o` | Arrête après l'assemblage (fichier objet) |
| `make` | Exécute la règle par défaut du Makefile |
| `make clean` | Exécute la règle `clean` du Makefile |

---

## Pièges Fréquents

### Piège 1 : Oublier le point-virgule

**Problème** : Le compilateur affiche une erreur incompréhensible.

**Solution** : Chaque instruction en C doit se terminer par un point-virgule (`;`).

```c
// Incorrect - erreur de compilation
printf("Hello")

// Correct
printf("Hello");
```

---

### Piège 2 : Utiliser des espaces au lieu de tabulations dans le Makefile

**Problème** : `make` affiche `*** missing separator. Stop.`

**Solution** : Les lignes de commandes dans un Makefile doivent commencer par une tabulation (touche Tab), pas par des espaces. Configure ton éditeur pour insérer de vraies tabulations dans les Makefile.

---

### Piège 3 : Oublier le `\n` dans printf

**Problème** : Le texte s'affiche collé à l'invite de commandes du terminal.

**Solution** : Ajoute `\n` à la fin de la chaîne pour créer un retour à la ligne.

```c
// Sans \n - le prompt se colle au texte
printf("Hello");

// Avec \n - retour à la ligne propre
printf("Hello\n");
```

---

### Piège 4 : Nommer le fichier avec une majuscule

**Problème** : Par convention, les fichiers C utilisent des minuscules. `Main.c` fonctionne mais rend le projet incohérent.

**Solution** : Nomme toujours tes fichiers en minuscules : `main.c`, `utils.c`, `calcul.c`.

---

## Checklist de Validation

- [ ] Je sais expliquer pourquoi le C est un langage compilé
- [ ] J'ai installé un compilateur (GCC ou Clang) sur ma machine
- [ ] J'ai écrit, compilé et exécuté un programme Hello World
- [ ] Je comprends les quatre étapes du cycle de compilation
- [ ] J'ai créé un Makefile basique et je sais l'utiliser
- [ ] Je compile avec les options `-Wall -Wextra -Werror`

---

## Exercice Pratique

**Énoncé** : Crée un programme qui affiche trois lignes dans le terminal :

1. Ton prénom
2. La date du jour
3. Le message "Mon premier programme C"

Crée un Makefile qui compile ce programme avec les options d'avertissement.

**Indications** :

- Utilise trois appels à `printf`, chacun avec `\n` à la fin
- Le Makefile doit avoir les règles `all` et `clean`

**Résultat attendu** :

```text
Thomas
07 avril 2025
Mon premier programme C
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `main.c` :

```c
#include <stdio.h>

int main(void)
{
    // Affiche le prénom
    printf("Thomas\n");

    // Affiche la date
    printf("07 avril 2025\n");

    // Affiche le message
    printf("Mon premier programme C\n");

    return 0;
}
```

Fichier `Makefile` :

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -Werror
TARGET = presentation

all: $(TARGET)

$(TARGET): main.c
    $(CC) $(CFLAGS) main.c -o $(TARGET)

clean:
    rm -f $(TARGET)

.PHONY: all clean
```

Compilation et exécution :

```bash
make
./presentation
```

---

## Navigation

→ Fiche suivante : **[02 - Variables et types](02-variables-types.md)**
