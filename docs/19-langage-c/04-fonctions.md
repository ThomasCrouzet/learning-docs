---
tags:
  - C
  - Débutant
  - Pratique
description: "Déclarer et utiliser des fonctions, comprendre les prototypes, le passage par valeur et organiser le code avec des fichiers d'en-tête."
estimated_time: "60 min"
fiche_number: 4
total_fiches: 10
cursus: "Langage C"
---

# 04 - Fonctions

> **En bref** : Créer des fonctions réutilisables, comprendre les prototypes, le passage de paramètres par valeur, les valeurs de retour et l'organisation du code avec des fichiers .h. Lecture estimée : 60 min.

## Prérequis

- [03 - Opérateurs et structures de contrôle](03-operateurs-controle.md) : maîtriser les conditions et les boucles

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer et appeler des fonctions, utiliser les prototypes, comprendre le passage par valeur et organiser ton code avec des fichiers d'en-tête (.h).

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une fonction ?

**Définition** : Une fonction est un bloc de code nommé qui effectue une tâche précise. Elle peut recevoir des paramètres en entrée et retourner un résultat. La fonction `main` est la fonction principale de tout programme C.

**Le problème que les fonctions résolvent** :

Sans fonctions, voici les problèmes rencontrés :

1. **Code dupliqué** : si tu as besoin du même calcul à trois endroits, tu recopies le code trois fois.
2. **Fichier illisible** : tout le code dans `main` rend le programme difficile à comprendre dès qu'il dépasse 50 lignes.
3. **Maintenance pénible** : corriger un bug oblige à modifier chaque copie du code dupliqué.

**Comment les fonctions résolvent ces problèmes** :

| Problème | Solution apportée par les fonctions |
| --- | --- |
| Code dupliqué | On écrit le code une fois dans la fonction, puis on l'appelle autant de fois que nécessaire |
| Fichier illisible | Chaque fonction a un nom explicite qui décrit ce qu'elle fait |
| Maintenance pénible | On corrige le bug à un seul endroit (dans la fonction) |

**Analogie concrète** : Une fonction, c'est comme une machine à café. Tu mets de l'eau et du café (les paramètres), tu appuies sur le bouton (l'appel de fonction), et tu obtiens une tasse de café (la valeur de retour). Tu n'as pas besoin de savoir comment la machine fonctionne à l'intérieur pour l'utiliser, et tu peux t'en servir autant de fois que tu veux.

**Ce qu'une fonction n'est PAS** :

- Une fonction en C n'est pas une méthode. Les méthodes existent dans les langages orientés objet (Java, C++) et sont liées à un objet. En C, les fonctions sont indépendantes.
- Une fonction n'est pas une macro. Une macro (`#define`) est remplacée par le préprocesseur avant la compilation. Une fonction est compilée et appelée à l'exécution.

---

### Qu'est-ce qu'un prototype ?

**Définition** : Un prototype (ou déclaration anticipée) est une ligne qui indique au compilateur le nom d'une fonction, ses paramètres et son type de retour, sans fournir le code de la fonction.

**Le problème que les prototypes résolvent** :

Sans prototype, voici le problème rencontré :

1. **Ordre de déclaration** : le compilateur C lit le fichier de haut en bas. Si tu appelles une fonction avant de la définir, le compilateur ne la connaît pas encore et signale une erreur.

**Comment les prototypes résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Ordre de déclaration | Le prototype informe le compilateur de l'existence de la fonction dès le début du fichier |

**Analogie concrète** : Le prototype, c'est comme la table des matières d'un livre. La table des matières te dit que le chapitre 5 parle de "La Révolution" (le nom et le sujet), mais le contenu détaillé est plus loin dans le livre. Le compilateur a besoin de cette "table des matières" pour savoir que la fonction existe avant de lire son code.

---

### Qu'est-ce que le passage par valeur ?

**Définition** : En C, quand tu passes une variable à une fonction, la fonction reçoit une copie de la valeur. Modifier cette copie dans la fonction ne change pas la variable originale.

**Le problème que le passage par valeur résout** :

Sans passage par valeur, voici le problème rencontré :

1. **Effets de bord** : n'importe quelle fonction pourrait modifier n'importe quelle variable du programme, rendant le comportement imprévisible.

**Comment le passage par valeur résout ce problème** :

| Problème | Solution |
| --- | --- |
| Effets de bord | La fonction travaille sur une copie, l'original reste intact |

**Analogie concrète** : C'est comme photocopier un document avant de le donner à quelqu'un. La personne peut écrire sur la photocopie, la surligner ou la déchirer - ton document original reste intact.

**Ce que le passage par valeur n'est PAS** :

- Le passage par valeur n'est pas le passage par référence. En C, pour modifier la variable originale, il faut passer un pointeur (abordé dans la fiche suivante).

---

## Étapes Pratiques

### Étape 1 : Créer et appeler une fonction

Crée un fichier `fonctions.c` :

```c
#include <stdio.h>

// Définition d'une fonction sans paramètre et sans retour
// void signifie "aucune valeur de retour"
void afficher_bienvenue(void)
{
    printf("=========================\n");
    printf("  Bienvenue dans le menu\n");
    printf("=========================\n");
}

// Fonction avec un paramètre et un retour
// int carre(int n) : prend un entier, retourne un entier
int carre(int n)
{
    return n * n;
}

// Fonction avec deux paramètres
int somme(int a, int b)
{
    return a + b;
}

// Fonction qui retourne un double
double moyenne(int a, int b)
{
    // Cast en double pour avoir une division flottante
    return (double)(a + b) / 2.0;
}

int main(void)
{
    // Appel d'une fonction sans paramètre
    afficher_bienvenue();

    // Appel avec un paramètre
    int resultat = carre(7);
    printf("Carre de 7 : %d\n", resultat);

    // Appel avec deux paramètres
    printf("Somme de 3 et 5 : %d\n", somme(3, 5));

    // Appel avec retour double
    printf("Moyenne de 7 et 4 : %.1f\n", moyenne(7, 4));

    // On peut imbriquer les appels
    printf("Carre de la somme de 2 et 3 : %d\n", carre(somme(2, 3)));

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror fonctions.c -o fonctions
./fonctions
```

**Résultat attendu** :

```text
=========================
  Bienvenue dans le menu
=========================
Carre de 7 : 49
Somme de 3 et 5 : 8
Moyenne de 7 et 4 : 5.5
Carre de la somme de 2 et 3 : 25
```

---

### Étape 2 : Utiliser les prototypes

Crée un fichier `prototypes.c` :

```c
#include <stdio.h>

// Prototypes (déclarations anticipées)
// Le compilateur sait maintenant que ces fonctions existent
int factorielle(int n);
int est_pair(int n);
void afficher_resultat(int n, int fact);

// main peut appeler les fonctions même si elles sont définies plus bas
int main(void)
{
    for (int i = 1; i <= 7; i++)
    {
        int fact = factorielle(i);
        afficher_resultat(i, fact);
    }

    printf("\n5 est pair ? %s\n", est_pair(5) ? "Oui" : "Non");
    printf("8 est pair ? %s\n", est_pair(8) ? "Oui" : "Non");

    return 0;
}

// Définitions des fonctions (le code réel)
int factorielle(int n)
{
    int resultat = 1;
    for (int i = 2; i <= n; i++)
    {
        resultat *= i;
    }
    return resultat;
}

int est_pair(int n)
{
    // Retourne 1 (vrai) si n est pair, 0 (faux) sinon
    return n % 2 == 0;
}

void afficher_resultat(int n, int fact)
{
    printf("%d! = %d\n", n, fact);
}
```

```bash
gcc -Wall -Wextra -Werror prototypes.c -o prototypes
./prototypes
```

**Résultat attendu** :

```text
1! = 1
2! = 2
3! = 6
4! = 24
5! = 120
6! = 720
7! = 5040

5 est pair ? Non
8 est pair ? Oui
```

---

### Étape 3 : Démontrer le passage par valeur

Crée un fichier `passage_valeur.c` :

```c
#include <stdio.h>

// Cette fonction reçoit une COPIE de la valeur
// Modifier la copie ne change pas l'original
void doubler(int n)
{
    n = n * 2;
    printf("  Dans la fonction : n = %d\n", n);
}

// Cette fonction échange les copies, pas les originaux
void echanger(int a, int b)
{
    int temp = a;
    a = b;
    b = temp;
    printf("  Dans la fonction : a = %d, b = %d\n", a, b);
}

int main(void)
{
    int nombre = 10;
    printf("Avant doubler : nombre = %d\n", nombre);
    doubler(nombre);
    printf("Apres doubler : nombre = %d\n\n", nombre);
    // nombre vaut toujours 10 car la fonction a modifié une copie

    int x = 5;
    int y = 8;
    printf("Avant echanger : x = %d, y = %d\n", x, y);
    echanger(x, y);
    printf("Apres echanger : x = %d, y = %d\n", x, y);
    // x et y n'ont pas changé car la fonction a travaillé sur des copies

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror passage_valeur.c -o passage_valeur
./passage_valeur
```

**Résultat attendu** :

```text
Avant doubler : nombre = 10
  Dans la fonction : n = 20
Apres doubler : nombre = 10

Avant echanger : x = 5, y = 8
  Dans la fonction : a = 8, b = 5
Apres echanger : x = 5, y = 8
```

La variable `nombre` reste à 10 et `x`/`y` ne sont pas échangés, car les fonctions ont travaillé sur des copies.

---

### Étape 4 : Organiser le code avec des fichiers .h

En pratique, on sépare le code en plusieurs fichiers. Les fichiers `.h` (headers) contiennent les prototypes, les fichiers `.c` contiennent le code.

Crée trois fichiers :

Fichier `calcul.h` (déclarations) :

```c
// Garde d'inclusion : empêche d'inclure ce fichier plusieurs fois
// Le nom suit la convention NOM_DU_FICHIER_H
#ifndef CALCUL_H
#define CALCUL_H

// Prototypes des fonctions
int addition(int a, int b);
int soustraction(int a, int b);
int multiplication(int a, int b);
double division_safe(int a, int b);

#endif
```

Fichier `calcul.c` (implémentation) :

```c
#include <stdio.h>
#include "calcul.h"

// Guillemets " " pour les fichiers locaux du projet
// Chevrons < > pour les bibliothèques système

int addition(int a, int b)
{
    return a + b;
}

int soustraction(int a, int b)
{
    return a - b;
}

int multiplication(int a, int b)
{
    return a * b;
}

double division_safe(int a, int b)
{
    if (b == 0)
    {
        printf("Erreur : division par zero\n");
        return 0.0;
    }
    return (double)a / (double)b;
}
```

Fichier `main.c` :

```c
#include <stdio.h>
#include "calcul.h"

int main(void)
{
    int a = 15;
    int b = 4;

    printf("a = %d, b = %d\n\n", a, b);
    printf("Addition       : %d\n", addition(a, b));
    printf("Soustraction   : %d\n", soustraction(a, b));
    printf("Multiplication : %d\n", multiplication(a, b));
    printf("Division       : %.2f\n", division_safe(a, b));
    printf("Division par 0 : %.2f\n", division_safe(a, 0));

    return 0;
}
```

Crée un `Makefile` pour compiler :

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -Werror
TARGET = calculatrice

# Liste des fichiers objets
OBJ = main.o calcul.o

all: $(TARGET)

# L'exécutable dépend des fichiers objets
$(TARGET): $(OBJ)
    $(CC) $(OBJ) -o $(TARGET)

# Chaque fichier .o dépend de son .c et des .h inclus
main.o: main.c calcul.h
    $(CC) $(CFLAGS) -c main.c -o main.o

calcul.o: calcul.c calcul.h
    $(CC) $(CFLAGS) -c calcul.c -o calcul.o

clean:
    rm -f $(OBJ) $(TARGET)

.PHONY: all clean
```

**Note** : l'exemple ci-dessus utilise des espaces pour l'affichage. Dans ton fichier Makefile réel, utilise des tabulations (touche Tab) en début de ligne de commande.

```bash
make
./calculatrice
```

**Résultat attendu** :

```text
a = 15, b = 4

Addition       : 19
Soustraction   : 11
Multiplication : 60
Division       : 3.75
Erreur : division par zero
Division par 0 : 0.00
```

---

### Étape 5 : Variables locales et portée

Crée un fichier `portee.c` :

```c
#include <stdio.h>

// Variable globale (visible partout - à éviter quand possible)
int compteur_global = 0;

void incrementer(void)
{
    // Variable locale à cette fonction
    int local = 0;

    compteur_global++;
    local++;

    printf("Global : %d, Local : %d\n", compteur_global, local);
}

int main(void)
{
    // Chaque appel recrée la variable locale à 0
    // Mais la variable globale persiste
    incrementer();  // Global : 1, Local : 1
    incrementer();  // Global : 2, Local : 1
    incrementer();  // Global : 3, Local : 1

    // La variable locale de incrementer n'existe pas ici
    // printf("%d", local); // Erreur : 'local' undeclared

    // Portée d'un bloc
    {
        int x = 42;
        printf("\nx dans le bloc : %d\n", x);
    }
    // printf("%d", x); // Erreur : x n'existe plus ici

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror portee.c -o portee
./portee
```

**Résultat attendu** :

```text
Global : 1, Local : 1
Global : 2, Local : 1
Global : 3, Local : 1

x dans le bloc : 42
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `gcc -c fichier.c` | Compile sans lier (produit un fichier .o) |
| `gcc fichier1.o fichier2.o -o prog` | Lie les fichiers objets en un exécutable |
| `#include "fichier.h"` | Inclut un fichier d'en-tête local |
| `#include <stdio.h>` | Inclut un fichier d'en-tête système |
| `#ifndef` / `#define` / `#endif` | Garde d'inclusion pour les fichiers .h |

---

## Pièges Fréquents

### Piège 1 : Oublier le prototype

**Problème** : Appeler une fonction définie plus bas dans le fichier sans prototype provoque un avertissement ou une erreur.

**Solution** : Déclarer le prototype de chaque fonction avant `main`, ou la définir avant `main`.

---

### Piège 2 : Ne pas retourner de valeur

**Problème** : Une fonction déclarée `int` qui ne retourne rien provoque un comportement indéfini.

**Solution** : Toujours inclure un `return` dans les fonctions non-void.

```c
// Incorrect - pas de return
int carre(int n)
{
    int r = n * n;
    // Oubli du return
}

// Correct
int carre(int n)
{
    return n * n;
}
```

---

### Piège 3 : Confondre #include "" et #include <>

**Problème** : Utiliser `<>` pour un fichier local ne le trouve pas.

**Solution** :

- `<stdio.h>` : fichiers système (bibliothèque standard)
- `"calcul.h"` : fichiers de ton projet (même dossier)

---

### Piège 4 : Oublier la garde d'inclusion

**Problème** : Si un fichier `.h` est inclus deux fois (par exemple par deux fichiers `.c` différents qui s'incluent mutuellement), le compilateur voit les mêmes déclarations deux fois et signale une erreur.

**Solution** : Toujours entourer le contenu d'un `.h` avec `#ifndef` / `#define` / `#endif`.

---

## Checklist de Validation

- [ ] Je sais créer une fonction avec paramètres et valeur de retour
- [ ] Je comprends la différence entre prototype et définition
- [ ] Je sais que le C utilise le passage par valeur
- [ ] Je sais organiser mon code en fichiers .h et .c séparés
- [ ] Je sais écrire un Makefile qui compile plusieurs fichiers
- [ ] Je comprends la portée des variables (locale, globale, bloc)

---

## Exercice Pratique

**Énoncé** : Crée un mini-programme de conversion de température avec :

1. Un fichier `conversion.h` avec les prototypes
2. Un fichier `conversion.c` avec les fonctions :
   - `celsius_vers_fahrenheit(double c)` : retourne la température en Fahrenheit (F = C x 9/5 + 32)
   - `fahrenheit_vers_celsius(double f)` : retourne la température en Celsius (C = (F - 32) x 5/9)
   - `celsius_vers_kelvin(double c)` : retourne la température en Kelvin (K = C + 273.15)
3. Un fichier `main.c` qui demande une température en Celsius et affiche les trois conversions
4. Un Makefile

**Indications** :

- Toutes les fonctions retournent un `double`
- Utilise les gardes d'inclusion dans le `.h`

**Résultat attendu** (avec 100) :

```text
Temperature en Celsius : 100
100.00 C = 212.00 F
100.00 C = 373.15 K
212.00 F = 100.00 C
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

Fichier `conversion.h` :

```c
#ifndef CONVERSION_H
#define CONVERSION_H

double celsius_vers_fahrenheit(double c);
double fahrenheit_vers_celsius(double f);
double celsius_vers_kelvin(double c);

#endif
```

Fichier `conversion.c` :

```c
#include "conversion.h"

double celsius_vers_fahrenheit(double c)
{
    return c * 9.0 / 5.0 + 32.0;
}

double fahrenheit_vers_celsius(double f)
{
    return (f - 32.0) * 5.0 / 9.0;
}

double celsius_vers_kelvin(double c)
{
    return c + 273.15;
}
```

Fichier `main.c` :

```c
#include <stdio.h>
#include "conversion.h"

int main(void)
{
    double celsius;

    printf("Temperature en Celsius : ");
    scanf("%lf", &celsius);

    double fahr = celsius_vers_fahrenheit(celsius);
    double kelvin = celsius_vers_kelvin(celsius);

    printf("%.2f C = %.2f F\n", celsius, fahr);
    printf("%.2f C = %.2f K\n", celsius, kelvin);
    printf("%.2f F = %.2f C\n", fahr, fahrenheit_vers_celsius(fahr));

    return 0;
}
```

Fichier `Makefile` :

```makefile
CC = gcc
CFLAGS = -Wall -Wextra -Werror
TARGET = temperature
OBJ = main.o conversion.o

all: $(TARGET)

$(TARGET): $(OBJ)
    $(CC) $(OBJ) -o $(TARGET)

main.o: main.c conversion.h
    $(CC) $(CFLAGS) -c main.c -o main.o

conversion.o: conversion.c conversion.h
    $(CC) $(CFLAGS) -c conversion.c -o conversion.o

clean:
    rm -f $(OBJ) $(TARGET)

.PHONY: all clean
```

---

## Navigation

← Fiche précédente : **[03 - Opérateurs et structures de contrôle](03-operateurs-controle.md)**

→ Fiche suivante : **[05 - Pointeurs](05-pointeurs.md)**
