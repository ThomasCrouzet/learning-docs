---
tags:
  - C
  - Débutant
  - Pratique
description: "Maîtriser les opérateurs arithmétiques, logiques et relationnels, et les structures de contrôle if/else, switch, for, while et do-while."
estimated_time: "60 min"
fiche_number: 3
total_fiches: 10
cursus: "Langage C"
---

# 03 - Opérateurs et structures de contrôle

> **En bref** : Utiliser les opérateurs arithmétiques, relationnels et logiques du C, puis contrôler le flux d'exécution avec if/else, switch, for, while et do-while. Lecture estimée : 60 min.

## Prérequis

- [02 - Variables et types](02-variables-types.md) : savoir déclarer des variables et utiliser les types primitifs

## Objectif de cette fiche

À la fin de cette fiche, tu sauras utiliser tous les opérateurs du C et écrire des programmes avec des conditions et des boucles.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un opérateur ?

**Définition** : Un opérateur est un symbole qui effectue une opération sur une ou plusieurs valeurs (appelées opérandes). Par exemple, `+` additionne deux valeurs.

**Le problème que les opérateurs résolvent** :

Sans opérateurs, voici les problèmes rencontrés :

1. **Aucun calcul possible** : impossible d'additionner, soustraire ou comparer des valeurs.
2. **Pas de logique** : impossible de combiner des conditions ("si A ET B").

**Comment les opérateurs résolvent ces problèmes** :

| Problème | Solution apportée par les opérateurs |
| --- | --- |
| Aucun calcul possible | Les opérateurs arithmétiques (+, -, *, /) permettent les calculs |
| Pas de logique | Les opérateurs logiques (&&, \|\|, !) combinent les conditions |

**Les catégories d'opérateurs en C** :

| Catégorie | Opérateurs | Exemple |
| --- | --- | --- |
| Arithmétiques | `+` `-` `*` `/` `%` | `a + b` |
| Relationnels | `==` `!=` `<` `>` `<=` `>=` | `a == b` |
| Logiques | `&&` `\|\|` `!` | `a && b` |
| Affectation | `=` `+=` `-=` `*=` `/=` | `a += 5` |
| Incrémentation | `++` `--` | `a++` |
| Bit à bit | `&` `\|` `^` `~` `<<` `>>` | `a & b` |

**Analogie concrète** : Les opérateurs sont comme les outils d'une calculatrice. La touche `+` additionne, la touche `=` compare deux résultats, et la touche `AND` vérifie que deux conditions sont vraies en même temps. Chaque touche a une fonction précise et ne peut pas être utilisée pour autre chose.

---

### Qu'est-ce qu'une structure de contrôle ?

**Définition** : Une structure de contrôle est une instruction qui modifie l'ordre d'exécution du programme. Sans structure de contrôle, le programme exécute les instructions de haut en bas, une par une.

**Le problème que les structures de contrôle résolvent** :

Sans structures de contrôle, voici les problèmes rencontrés :

1. **Exécution linéaire** : le programme fait toujours la même chose, sans possibilité de choix.
2. **Pas de répétition** : pour afficher 100 lignes, il faut écrire 100 instructions `printf`.

**Comment les structures de contrôle résolvent ces problèmes** :

| Problème | Solution |
| --- | --- |
| Exécution linéaire | `if/else` et `switch` permettent de choisir quel code exécuter |
| Pas de répétition | `for`, `while` et `do-while` répètent un bloc de code |

**Analogie concrète** : Imagine un GPS. Sans structure de contrôle, il te donnerait toujours le même itinéraire, même si une route est bloquée. Avec un `if` ("si la route est bloquée, prends le détour"), il s'adapte. Avec un `while` ("tant que tu n'es pas arrivé, continue de rouler"), il répète les instructions jusqu'à destination.

**Ce qu'une structure de contrôle n'est PAS** :

- Une structure de contrôle n'est pas une fonction. Elle ne retourne pas de valeur et ne peut pas être appelée par son nom.
- Une structure de contrôle n'est pas une déclaration de variable. Elle contrôle le flux, pas les données.

---

## Étapes Pratiques

### Étape 1 : Opérateurs arithmétiques

Crée un fichier `operateurs.c` :

```c
#include <stdio.h>

int main(void)
{
    int a = 17;
    int b = 5;

    // Opérations arithmétiques de base
    printf("a = %d, b = %d\n\n", a, b);

    printf("Addition       : a + b = %d\n", a + b);
    printf("Soustraction   : a - b = %d\n", a - b);
    printf("Multiplication : a * b = %d\n", a * b);

    // Division entière : le résultat est tronqué (pas arrondi)
    printf("Division       : a / b = %d\n", a / b);

    // Modulo : reste de la division entière
    printf("Modulo         : a %% b = %d\n", a % b);

    // Attention : division entre entiers = résultat entier
    printf("\nDivision entiere  : 7 / 2 = %d\n", 7 / 2);

    // Pour obtenir un résultat décimal, au moins un opérande doit être flottant
    printf("Division flottante : 7.0 / 2 = %.1f\n", 7.0 / 2);

    // Opérateurs d'affectation composée
    int x = 10;
    printf("\nx initial : %d\n", x);

    x += 3;  // Équivalent à x = x + 3
    printf("x += 3 : %d\n", x);

    x -= 2;  // Équivalent à x = x - 2
    printf("x -= 2 : %d\n", x);

    x *= 4;  // Équivalent à x = x * 4
    printf("x *= 4 : %d\n", x);

    x /= 2;  // Équivalent à x = x / 2
    printf("x /= 2 : %d\n", x);

    x %= 3;  // Équivalent à x = x % 3
    printf("x %%= 3 : %d\n", x);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror operateurs.c -o operateurs
./operateurs
```

**Résultat attendu** :

```text
a = 17, b = 5

Addition       : a + b = 22
Soustraction   : a - b = 12
Multiplication : a * b = 85
Division       : a / b = 3
Modulo         : a % b = 2

Division entiere  : 7 / 2 = 3
Division flottante : 7.0 / 2 = 3.5

x initial : 10
x += 3 : 13
x -= 2 : 11
x *= 4 : 44
x /= 2 : 22
x %= 3 : 1
```

---

### Étape 2 : Opérateurs relationnels et logiques

Crée un fichier `logique.c` :

```c
#include <stdio.h>

int main(void)
{
    int a = 10;
    int b = 20;
    int c = 10;

    // Opérateurs relationnels (retournent 1 pour vrai, 0 pour faux)
    printf("a = %d, b = %d, c = %d\n\n", a, b, c);

    printf("a == b : %d\n", a == b);  // 0 (faux)
    printf("a == c : %d\n", a == c);  // 1 (vrai)
    printf("a != b : %d\n", a != b);  // 1 (vrai)
    printf("a < b  : %d\n", a < b);   // 1 (vrai)
    printf("a > b  : %d\n", a > b);   // 0 (faux)
    printf("a <= c : %d\n", a <= c);  // 1 (vrai)
    printf("a >= b : %d\n", a >= b);  // 0 (faux)

    // Opérateurs logiques
    printf("\n--- Operateurs logiques ---\n");

    // && (ET) : vrai si les deux conditions sont vraies
    printf("(a == c) && (a < b) : %d\n", (a == c) && (a < b));  // 1

    // || (OU) : vrai si au moins une condition est vraie
    printf("(a > b) || (a == c) : %d\n", (a > b) || (a == c));  // 1

    // ! (NON) : inverse la valeur
    printf("!(a == b) : %d\n", !(a == b));  // 1

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror logique.c -o logique
./logique
```

**Résultat attendu** :

```text
a = 10, b = 20, c = 10

a == b : 0
a == c : 1
a != b : 1
a < b  : 1
a > b  : 0
a <= c : 1
a >= b : 0

--- Operateurs logiques ---
(a == c) && (a < b) : 1
(a > b) || (a == c) : 1
!(a == b) : 1
```

---

### Étape 3 : Conditions if, else if, else

Crée un fichier `conditions.c` :

```c
#include <stdio.h>

int main(void)
{
    int note;

    printf("Entre ta note (0-20) : ");
    scanf("%d", &note);

    // Structure if / else if / else
    // Une seule branche est exécutée (la première qui est vraie)
    if (note >= 16)
    {
        printf("Mention : Tres bien\n");
    }
    else if (note >= 14)
    {
        printf("Mention : Bien\n");
    }
    else if (note >= 12)
    {
        printf("Mention : Assez bien\n");
    }
    else if (note >= 10)
    {
        printf("Mention : Passable\n");
    }
    else
    {
        printf("Resultat : Non admis\n");
    }

    // Opérateur ternaire : version courte d'un if/else simple
    // condition ? valeur_si_vrai : valeur_si_faux
    const char *resultat = (note >= 10) ? "Admis" : "Non admis";
    printf("Verdict : %s\n", resultat);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror conditions.c -o conditions
./conditions
```

**Résultat attendu** (avec la note 15) :

```text
Entre ta note (0-20) : 15
Mention : Bien
Verdict : Admis
```

---

### Étape 4 : Switch

Crée un fichier `switch_exemple.c` :

```c
#include <stdio.h>

int main(void)
{
    int jour;

    printf("Numero du jour (1-7) : ");
    scanf("%d", &jour);

    // switch compare la valeur de jour avec chaque case
    // break sort du switch (sans break, l'exécution continue dans le case suivant)
    switch (jour)
    {
        case 1:
            printf("Lundi\n");
            break;
        case 2:
            printf("Mardi\n");
            break;
        case 3:
            printf("Mercredi\n");
            break;
        case 4:
            printf("Jeudi\n");
            break;
        case 5:
            printf("Vendredi\n");
            break;
        case 6:
            printf("Samedi\n");
            break;
        case 7:
            printf("Dimanche\n");
            break;
        default:
            // Exécuté si aucun case ne correspond
            printf("Numero invalide\n");
            break;
    }

    // Exemple avec des cases groupés (pas de break entre eux)
    printf("\nType de jour : ");
    switch (jour)
    {
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
            printf("Jour ouvrable\n");
            break;
        case 6:
        case 7:
            printf("Week-end\n");
            break;
        default:
            printf("Invalide\n");
            break;
    }

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror switch_exemple.c -o switch_exemple
./switch_exemple
```

**Résultat attendu** (avec 3) :

```text
Numero du jour (1-7) : 3
Mercredi

Type de jour : Jour ouvrable
```

---

### Étape 5 : Boucle for

Crée un fichier `boucles.c` :

```c
#include <stdio.h>

int main(void)
{
    // Boucle for : for (initialisation; condition; incrémentation)
    // Exécute le bloc tant que la condition est vraie
    printf("--- Boucle for ---\n");
    for (int i = 1; i <= 5; i++)
    {
        printf("Iteration %d\n", i);
    }

    // Table de multiplication
    printf("\n--- Table de 7 ---\n");
    for (int i = 1; i <= 10; i++)
    {
        printf("7 x %2d = %2d\n", i, 7 * i);
    }

    // Boucle for avec décrément
    printf("\n--- Compte a rebours ---\n");
    for (int i = 5; i >= 1; i--)
    {
        printf("%d... ", i);
    }
    printf("Decollage !\n");

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror boucles.c -o boucles
./boucles
```

**Résultat attendu** :

```text
--- Boucle for ---
Iteration 1
Iteration 2
Iteration 3
Iteration 4
Iteration 5

--- Table de 7 ---
7 x  1 =  7
7 x  2 = 14
7 x  3 = 21
7 x  4 = 28
7 x  5 = 35
7 x  6 = 42
7 x  7 = 49
7 x  8 = 56
7 x  9 = 63
7 x 10 = 70

--- Compte a rebours ---
5... 4... 3... 2... 1... Decollage !
```

---

### Étape 6 : Boucles while et do-while

Crée un fichier `while_exemple.c` :

```c
#include <stdio.h>

int main(void)
{
    // while : vérifie la condition AVANT d'exécuter le bloc
    printf("--- Boucle while ---\n");
    int compteur = 1;
    while (compteur <= 5)
    {
        printf("Compteur : %d\n", compteur);
        compteur++;
    }

    // do-while : exécute le bloc AU MOINS UNE FOIS, puis vérifie la condition
    printf("\n--- Boucle do-while ---\n");
    int nombre;
    do
    {
        printf("Entre un nombre positif (0 pour quitter) : ");
        scanf("%d", &nombre);
        if (nombre > 0)
        {
            printf("Tu as entre : %d\n", nombre);
        }
    } while (nombre != 0);

    printf("Fin du programme\n");

    // Différence clé : si la condition est fausse dès le départ
    printf("\n--- Difference while vs do-while ---\n");

    // Ce bloc ne s'exécute jamais (condition fausse dès le départ)
    int x = 10;
    while (x < 5)
    {
        printf("While : cette ligne ne s'affiche pas\n");
        x++;
    }

    // Ce bloc s'exécute une fois (puis la condition est vérifiée)
    int y = 10;
    do
    {
        printf("Do-while : cette ligne s'affiche une fois (y = %d)\n", y);
        y++;
    } while (y < 5);

    return 0;
}
```

```bash
gcc -Wall -Wextra -Werror while_exemple.c -o while_exemple
echo "5
3
0" | ./while_exemple
```

**Résultat attendu** :

```text
--- Boucle while ---
Compteur : 1
Compteur : 2
Compteur : 3
Compteur : 4
Compteur : 5

--- Boucle do-while ---
Entre un nombre positif (0 pour quitter) : Tu as entre : 5
Entre un nombre positif (0 pour quitter) : Tu as entre : 3
Entre un nombre positif (0 pour quitter) : Fin du programme

--- Difference while vs do-while ---
Do-while : cette ligne s'affiche une fois (y = 10)
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `a % b` | Reste de la division entière de a par b |
| `a++` | Incrémente a de 1 (après utilisation) |
| `++a` | Incrémente a de 1 (avant utilisation) |
| `a && b` | Vrai si a ET b sont vrais |
| `a \|\| b` | Vrai si a OU b est vrai |
| `!a` | Inverse la valeur de a (vrai devient faux) |
| `break` | Sort de la boucle ou du switch en cours |
| `continue` | Passe directement à l'itération suivante de la boucle |

---

## Pièges Fréquents

### Piège 1 : Confondre = et ==

**Problème** : `=` est l'affectation, `==` est la comparaison. Écrire `if (a = 5)` affecte 5 à `a` au lieu de comparer.

**Solution** : Toujours utiliser `==` dans les conditions.

```c
int a = 3;

// Incorrect - affecte 5 à a, la condition est toujours vraie
if (a = 5)

// Correct - compare a avec 5
if (a == 5)
```

---

### Piège 2 : Oublier break dans un switch

**Problème** : Sans `break`, l'exécution "tombe" dans les cases suivants (fall-through).

**Solution** : Ajouter `break` à la fin de chaque `case`, sauf si le fall-through est intentionnel.

```c
// Sans break - affiche "Un" ET "Deux" ET "Trois"
switch (1)
{
    case 1: printf("Un\n");
    case 2: printf("Deux\n");
    case 3: printf("Trois\n");
}

// Avec break - affiche seulement "Un"
switch (1)
{
    case 1: printf("Un\n"); break;
    case 2: printf("Deux\n"); break;
    case 3: printf("Trois\n"); break;
}
```

---

### Piège 3 : Boucle infinie accidentelle

**Problème** : Oublier d'incrémenter le compteur dans un `while` crée une boucle qui ne s'arrête jamais.

**Solution** : Vérifier que la condition de sortie finira par être atteinte.

```c
// Boucle infinie - compteur ne change jamais
int compteur = 0;
while (compteur < 5)
{
    printf("%d\n", compteur);
    // Il manque compteur++
}

// Correct
int compteur = 0;
while (compteur < 5)
{
    printf("%d\n", compteur);
    compteur++;
}
```

---

### Piège 4 : Division par zéro

**Problème** : Diviser par zéro provoque un crash du programme (erreur "Floating point exception").

**Solution** : Toujours vérifier que le diviseur n'est pas zéro avant de diviser.

```c
int a = 10;
int b = 0;

// Crash - division par zéro
// int resultat = a / b;

// Correct - vérification avant la division
if (b != 0)
{
    int resultat = a / b;
    printf("Resultat : %d\n", resultat);
}
else
{
    printf("Erreur : division par zero\n");
}
```

---

## Checklist de Validation

- [ ] Je sais utiliser les opérateurs arithmétiques (+, -, *, /, %)
- [ ] Je comprends la différence entre = (affectation) et == (comparaison)
- [ ] Je sais écrire des conditions avec if, else if et else
- [ ] Je sais utiliser switch avec break
- [ ] Je sais écrire des boucles for, while et do-while
- [ ] Je comprends la différence entre while et do-while

---

## Exercice Pratique

**Énoncé** : Crée un programme de calculatrice simple qui :

1. Demande deux nombres à l'utilisateur
2. Demande l'opération souhaitée (+, -, *, /)
3. Affiche le résultat avec 2 décimales
4. Gère le cas de la division par zéro
5. Utilise un switch pour sélectionner l'opération

**Indications** :

- Utilise des variables `double` pour les nombres
- Lis l'opérateur avec `scanf(" %c", &op)` (espace avant %c pour ignorer les espaces)
- Utilise le case `default` du switch pour les opérateurs invalides

**Résultat attendu** (avec 15, 4 et +) :

```text
Premier nombre : 15
Deuxieme nombre : 4
Operation (+, -, *, /) : +
Resultat : 15.00 + 4.00 = 19.00
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>

int main(void)
{
    double a;
    double b;
    char op;

    // Lecture des entrées
    printf("Premier nombre : ");
    scanf("%lf", &a);

    printf("Deuxieme nombre : ");
    scanf("%lf", &b);

    printf("Operation (+, -, *, /) : ");
    scanf(" %c", &op);

    // Sélection de l'opération avec switch
    switch (op)
    {
        case '+':
            printf("Resultat : %.2f + %.2f = %.2f\n", a, b, a + b);
            break;
        case '-':
            printf("Resultat : %.2f - %.2f = %.2f\n", a, b, a - b);
            break;
        case '*':
            printf("Resultat : %.2f * %.2f = %.2f\n", a, b, a * b);
            break;
        case '/':
            // Vérification de la division par zéro
            if (b == 0)
            {
                printf("Erreur : division par zero\n");
            }
            else
            {
                printf("Resultat : %.2f / %.2f = %.2f\n", a, b, a / b);
            }
            break;
        default:
            printf("Erreur : operateur '%c' invalide\n", op);
            break;
    }

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[02 - Variables et types](02-variables-types.md)**

→ Fiche suivante : **[04 - Fonctions](04-fonctions.md)**
