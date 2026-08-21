---
tags:
  - C
  - Intermédiaire
  - Concept
description: "Comprendre les pointeurs : adresses mémoire, opérateurs * et &, arithmétique des pointeurs, pointeur NULL et passage par adresse."
estimated_time: "90 min"
fiche_number: 5
total_fiches: 10
cursus: "Langage C"
id: "infrastructure.c.pointeurs"
course_id: "infrastructure.c"
content_type: "lesson"
order: 5
---

# 05 - Pointeurs

> **En bref** : Comprendre les adresses mémoire, déclarer et utiliser des pointeurs avec les opérateurs * et &, manipuler l'arithmétique des pointeurs et passer des variables par adresse aux fonctions. Lecture estimée : 90 min.

## Prérequis

- [04 - Fonctions](04-fonctions.md) : savoir créer des fonctions et comprendre le passage par valeur

## Objectif de cette fiche

À la fin de cette fiche, tu sauras déclarer des pointeurs, accéder à la valeur pointée, utiliser l'arithmétique des pointeurs et passer des variables par adresse pour les modifier dans une fonction.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un pointeur ?

**Définition** : Un pointeur est une variable qui stocke l'adresse mémoire d'une autre variable. Au lieu de contenir directement une valeur (comme `42`), un pointeur contient un numéro qui désigne l'emplacement en mémoire où se trouve cette valeur.

**Le problème que les pointeurs résolvent** :

Sans pointeurs, voici les problèmes rencontrés :

1. **Modification impossible** : comme le C utilise le passage par valeur, une fonction ne peut pas modifier les variables de l'appelant.
2. **Copies coûteuses** : passer une grosse structure à une fonction copie toutes les données, ce qui consomme de la mémoire et du temps.
3. **Pas d'allocation dynamique** : sans pointeurs, impossible d'allouer de la mémoire pendant l'exécution du programme (abordé dans la fiche 07).

**Comment les pointeurs résolvent ces problèmes** :

| Problème | Solution apportée par les pointeurs |
| --- | --- |
| Modification impossible | Passer l'adresse permet à la fonction de modifier la variable originale |
| Copies coûteuses | Passer un pointeur (8 octets) au lieu de copier toute la structure |
| Pas d'allocation dynamique | Les pointeurs permettent de manipuler la mémoire allouée dynamiquement |

**Analogie concrète** : Un pointeur, c'est comme l'adresse postale d'une maison. L'adresse (le pointeur) n'est pas la maison elle-même - c'est un numéro qui te permet de la trouver. Si tu donnes l'adresse à un livreur (une fonction), il peut aller à la maison et y déposer un colis (modifier la valeur). Si tu donnes une photocopie de la maison (passage par valeur), le livreur ne peut rien livrer à la vraie maison.

**Ce qu'un pointeur n'est PAS** :

- Un pointeur n'est pas la valeur elle-même. Il contient une adresse, pas la donnée.
- Un pointeur n'est pas automatiquement valide. Un pointeur non initialisé contient une adresse aléatoire, et y accéder provoque un crash.
- Un pointeur n'est pas une référence (au sens C++). En C, il n'y a pas de références - seulement des pointeurs, qu'il faut déréférencer explicitement avec `*`.

---

### Qu'est-ce que l'arithmétique des pointeurs ?

**Définition** : L'arithmétique des pointeurs permet d'ajouter ou de soustraire un nombre entier à un pointeur. Le déplacement se fait par pas de la taille du type pointé (pas en octets).

**Le problème que l'arithmétique des pointeurs résout** :

Sans arithmétique des pointeurs, voici le problème rencontré :

1. **Parcours de données contiguës** : pour accéder aux éléments successifs d'un tableau en mémoire, il faudrait calculer manuellement les décalages en octets.

**Comment l'arithmétique des pointeurs résout ce problème** :

| Problème | Solution |
| --- | --- |
| Parcours de données contiguës | `ptr + 1` avance automatiquement de la taille du type pointé |

**Analogie concrète** : Imagine une rangée de casiers numérotés. Si chaque casier fait 4 cm de large (un `int`), aller au "casier suivant" signifie avancer de 4 cm, pas de 1 cm. L'arithmétique des pointeurs fait ce calcul automatiquement : `ptr + 1` avance au casier suivant, quelle que soit sa taille.

---

### Qu'est-ce que NULL ?

**Définition** : `NULL` est une constante spéciale qui représente un pointeur qui ne pointe vers aucune adresse valide. Sa valeur est 0.

**Le problème que NULL résout** :

Sans `NULL`, voici le problème rencontré :

1. **Pointeur invalide indétectable** : impossible de savoir si un pointeur contient une adresse valide ou non.

**Comment NULL résout ce problème** :

| Problème | Solution |
| --- | --- |
| Pointeur invalide indétectable | Initialiser un pointeur à NULL et vérifier `if (ptr != NULL)` avant de l'utiliser |

---

## Étapes Pratiques

### Étape 1 : Déclarer un pointeur et utiliser & et *

Crée un fichier `pointeurs.c` :

```c
#include <stdio.h>

int main(void)
{
    int nombre = 42;

    // & (adresse de) : récupère l'adresse mémoire de la variable
    printf("Valeur de nombre   : %d\n", nombre);
    printf("Adresse de nombre  : %p\n", (void *)&nombre);

    // Déclaration d'un pointeur vers un int
    // int *ptr signifie "ptr est un pointeur vers un int"
    int *ptr = &nombre;

    // Le pointeur contient l'adresse de nombre
    printf("\nValeur du pointeur (adresse) : %p\n", (void *)ptr);

    // * (déréférencement) : accède à la valeur stockée à l'adresse
    printf("Valeur pointee (*ptr)        : %d\n", *ptr);

    // Modifier la valeur via le pointeur
    *ptr = 100;
    printf("\nApres *ptr = 100 :\n");
    printf("nombre = %d\n", nombre);   // nombre a changé
    printf("*ptr   = %d\n", *ptr);     // même valeur

    // nombre et *ptr sont la même zone mémoire
    nombre = 77;
    printf("\nApres nombre = 77 :\n");
    printf("nombre = %d\n", nombre);
    printf("*ptr   = %d\n", *ptr);     // change aussi

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror pointeurs.c -o pointeurs
./pointeurs
```

**Résultat attendu** :

```text
Valeur de nombre   : 42
Adresse de nombre  : 0x7ffc1234abcd

Valeur du pointeur (adresse) : 0x7ffc1234abcd
Valeur pointee (*ptr)        : 42

Apres *ptr = 100 :
nombre = 100
*ptr   = 100

Apres nombre = 77 :
nombre = 77
*ptr   = 77
```

Les adresses mémoire (`0x7ffc...`) varient à chaque exécution. L'important est que `ptr` et `&nombre` affichent la même adresse.

---

### Étape 2 : Passage par adresse (modifier une variable dans une fonction)

Crée un fichier `passage_adresse.c` :

```c
#include <stdio.h>

// La fonction reçoit un pointeur vers un int (l'adresse de la variable)
void doubler(int *ptr)
{
    // *ptr accède à la valeur à l'adresse pointée
    *ptr = *ptr * 2;
    printf("  Dans doubler : *ptr = %d\n", *ptr);
}

// Échange réel de deux variables grâce aux pointeurs
void echanger(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

int main(void)
{
    // Passage par adresse avec &
    int nombre = 10;
    printf("Avant doubler : nombre = %d\n", nombre);
    doubler(&nombre);  // On passe l'adresse de nombre
    printf("Apres doubler : nombre = %d\n\n", nombre);
    // Cette fois, nombre a bien changé

    // Échange réel
    int x = 5;
    int y = 8;
    printf("Avant echanger : x = %d, y = %d\n", x, y);
    echanger(&x, &y);
    printf("Apres echanger : x = %d, y = %d\n", x, y);
    // x et y sont bien échangés

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror passage_adresse.c -o passage_adresse
./passage_adresse
```

**Résultat attendu** :

```text
Avant doubler : nombre = 10
  Dans doubler : *ptr = 20
Apres doubler : nombre = 20

Avant echanger : x = 5, y = 8
Apres echanger : x = 8, y = 5
```

Compare avec la fiche 04 où `echanger` ne fonctionnait pas avec le passage par valeur. Avec les pointeurs, les variables originales sont modifiées.

---

### Étape 3 : Arithmétique des pointeurs

Crée un fichier `arithmetique_ptr.c` :

```c
#include <stdio.h>

int main(void)
{
    int tableau[] = {10, 20, 30, 40, 50};
    int *ptr = tableau;  // Un tableau est déjà une adresse (pas besoin de &)

    printf("Taille d'un int : %zu octets\n\n", sizeof(int));

    // Accès aux éléments via le pointeur
    printf("ptr       pointe vers l'adresse %p, valeur = %d\n",
           (void *)ptr, *ptr);
    printf("ptr + 1   pointe vers l'adresse %p, valeur = %d\n",
           (void *)(ptr + 1), *(ptr + 1));
    printf("ptr + 2   pointe vers l'adresse %p, valeur = %d\n",
           (void *)(ptr + 2), *(ptr + 2));

    // ptr + 1 avance de sizeof(int) octets (4 octets), pas de 1 octet

    // Parcourir un tableau avec un pointeur
    printf("\nParcours du tableau :\n");
    for (int i = 0; i < 5; i++)
    {
        // Trois syntaxes équivalentes pour accéder à l'élément i :
        // tableau[i]   - notation tableau
        // *(ptr + i)   - arithmétique de pointeur
        // ptr[i]       - notation tableau sur pointeur
        printf("  tableau[%d] = %d, *(ptr + %d) = %d, ptr[%d] = %d\n",
               i, tableau[i], i, *(ptr + i), i, ptr[i]);
    }

    // Différence entre deux pointeurs
    int *debut = &tableau[0];
    int *fin = &tableau[4];
    printf("\nDistance entre debut et fin : %ld elements\n", fin - debut);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror arithmetique_ptr.c -o arithmetique_ptr
./arithmetique_ptr
```

**Résultat attendu** :

```text
Taille d'un int : 4 octets

ptr       pointe vers l'adresse 0x7ffc..., valeur = 10
ptr + 1   pointe vers l'adresse 0x7ffc..., valeur = 20
ptr + 2   pointe vers l'adresse 0x7ffc..., valeur = 30

Parcours du tableau :
  tableau[0] = 10, *(ptr + 0) = 10, ptr[0] = 10
  tableau[1] = 20, *(ptr + 1) = 20, ptr[1] = 20
  tableau[2] = 30, *(ptr + 2) = 30, ptr[2] = 30
  tableau[3] = 40, *(ptr + 3) = 40, ptr[3] = 40
  tableau[4] = 50, *(ptr + 4) = 50, ptr[4] = 50

Distance entre debut et fin : 4 elements
```

---

### Étape 4 : Pointeur NULL et vérification

Crée un fichier `pointeur_null.c` :

```c
#include <stdio.h>
#include <stdlib.h>

// Fonction qui divise, retourne le résultat via un pointeur
// Retourne 0 en cas de succès, -1 en cas d'erreur
int diviser(int a, int b, double *resultat)
{
    // Vérifier que le pointeur n'est pas NULL
    if (resultat == NULL)
    {
        printf("Erreur : pointeur NULL\n");
        return -1;
    }

    // Vérifier la division par zéro
    if (b == 0)
    {
        printf("Erreur : division par zero\n");
        return -1;
    }

    *resultat = (double)a / (double)b;
    return 0;
}

int main(void)
{
    // Initialiser un pointeur à NULL quand il ne pointe vers rien
    int *ptr = NULL;

    // Toujours vérifier avant d'utiliser
    if (ptr == NULL)
    {
        printf("ptr est NULL, on ne peut pas le dereferencer\n");
    }

    // Utilisation correcte de la fonction diviser
    double resultat;
    int code = diviser(10, 3, &resultat);
    if (code == 0)
    {
        printf("10 / 3 = %.4f\n", resultat);
    }

    // Test avec division par zéro
    code = diviser(10, 0, &resultat);
    if (code != 0)
    {
        printf("La division a echoue\n");
    }

    // Test avec pointeur NULL
    code = diviser(10, 3, NULL);
    if (code != 0)
    {
        printf("Appel avec NULL a echoue\n");
    }

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror pointeur_null.c -o pointeur_null
./pointeur_null
```

**Résultat attendu** :

```text
ptr est NULL, on ne peut pas le dereferencer
10 / 3 = 3.3333
Erreur : division par zero
La division a echoue
Erreur : pointeur NULL
Appel avec NULL a echoue
```

---

### Étape 5 : Pointeurs et fonctions multiples retours

Crée un fichier `multi_retour.c` :

```c
#include <stdio.h>

// En C, une fonction ne peut retourner qu'une seule valeur
// Les pointeurs permettent de "retourner" plusieurs valeurs
void min_max(int *tableau, int taille, int *min, int *max)
{
    *min = tableau[0];
    *max = tableau[0];

    for (int i = 1; i < taille; i++)
    {
        if (tableau[i] < *min)
        {
            *min = tableau[i];
        }
        if (tableau[i] > *max)
        {
            *max = tableau[i];
        }
    }
}

// Fonction qui retourne la somme et modifie la moyenne via pointeur
int somme_et_moyenne(int *tableau, int taille, double *moyenne)
{
    int somme = 0;
    for (int i = 0; i < taille; i++)
    {
        somme += tableau[i];
    }
    *moyenne = (double)somme / taille;
    return somme;
}

int main(void)
{
    int notes[] = {12, 18, 7, 15, 9, 20, 11, 14};
    int taille = sizeof(notes) / sizeof(notes[0]);

    // Récupérer min et max
    int min;
    int max;
    min_max(notes, taille, &min, &max);
    printf("Note minimum : %d\n", min);
    printf("Note maximum : %d\n", max);

    // Récupérer somme et moyenne
    double moyenne;
    int somme = somme_et_moyenne(notes, taille, &moyenne);
    printf("Somme : %d\n", somme);
    printf("Moyenne : %.2f\n", moyenne);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror multi_retour.c -o multi_retour
./multi_retour
```

**Résultat attendu** :

```text
Note minimum : 7
Note maximum : 20
Somme : 106
Moyenne : 13.25
```

---

## Commandes Utiles

| Commande | Action |
| --- | --- |
| `&variable` | Obtient l'adresse mémoire de la variable |
| `*pointeur` | Accède à la valeur stockée à l'adresse pointée |
| `int *ptr = &var` | Déclare un pointeur vers un int et l'initialise |
| `int *ptr = NULL` | Déclare un pointeur initialisé à NULL |
| `ptr + n` | Avance de n éléments (pas n octets) |
| `ptr - autre_ptr` | Nombre d'éléments entre deux pointeurs |
| `%p` | Spécificateur printf pour afficher une adresse |

---

## Pièges Fréquents

### Piège 1 : Déréférencer un pointeur NULL

**Problème** : Accéder à `*ptr` quand `ptr` est NULL provoque un crash immédiat du programme (Segmentation fault).

**Solution** : Toujours vérifier `if (ptr != NULL)` avant de déréférencer.

```c
int *ptr = NULL;

// Crash - Segmentation fault
// printf("%d\n", *ptr);

// Correct
if (ptr != NULL)
{
    printf("%d\n", *ptr);
}
```

---

### Piège 2 : Pointeur non initialisé

**Problème** : Un pointeur non initialisé contient une adresse aléatoire. Y accéder provoque un comportement indéfini.

**Solution** : Toujours initialiser un pointeur (soit avec l'adresse d'une variable, soit avec NULL).

```c
// Dangereux - ptr contient une adresse aléatoire
int *ptr;
*ptr = 42; // Crash probable

// Correct
int *ptr = NULL;
int nombre = 42;
ptr = &nombre;
```

---

### Piège 3 : Confondre la déclaration et le déréférencement

**Problème** : `*` a deux significations différentes selon le contexte.

**Solution** : Distinguer la déclaration (type) du déréférencement (opérateur).

```c
// Déclaration : * fait partie du type (int *)
int *ptr = &nombre;

// Déréférencement : * accède à la valeur
int valeur = *ptr;

// Ce sont deux usages différents du symbole *
```

---

### Piège 4 : Retourner l'adresse d'une variable locale

**Problème** : Une variable locale est détruite quand la fonction se termine. Le pointeur pointe alors vers une zone mémoire invalide.

**Solution** : Ne jamais retourner l'adresse d'une variable locale. Utiliser l'allocation dynamique (fiche 07) ou passer un pointeur en paramètre.

```c
// DANGEREUX - la variable locale est détruite après le return
int *mauvaise_fonction(void)
{
    int local = 42;
    return &local; // ptr vers une zone mémoire libérée
}

// CORRECT - utiliser un pointeur en paramètre
void bonne_fonction(int *resultat)
{
    *resultat = 42;
}
```

---

## Checklist de Validation

- [ ] Je sais déclarer un pointeur avec `int *ptr`
- [ ] Je comprends la différence entre `&` (adresse de) et `*` (valeur pointée)
- [ ] Je sais passer une variable par adresse à une fonction pour la modifier
- [ ] Je comprends l'arithmétique des pointeurs (ptr + 1 avance de sizeof(type))
- [ ] Je sais initialiser un pointeur à NULL et vérifier avant utilisation
- [ ] Je sais utiliser les pointeurs pour retourner plusieurs valeurs depuis une fonction

---

## Exercice Pratique

**Énoncé** : Crée un programme qui gère un tableau de 5 entiers saisis par l'utilisateur et fournit des statistiques.

1. Crée une fonction `saisir_tableau(int *tab, int taille)` qui remplit le tableau via scanf
2. Crée une fonction `afficher_tableau(int *tab, int taille)` qui affiche les éléments
3. Crée une fonction `statistiques(int *tab, int taille, int *min, int *max, double *moyenne)` qui calcule les trois valeurs
4. Crée une fonction `inverser_tableau(int *tab, int taille)` qui inverse le tableau en place (utilise des pointeurs pour échanger les éléments)

**Indications** :

- Pour inverser un tableau, échange le premier avec le dernier, le deuxième avec l'avant-dernier, etc.
- Utilise une fonction auxiliaire `echanger(int *a, int *b)`

**Résultat attendu** (avec les valeurs 8, 3, 15, 1, 10) :

```text
Saisie de 5 nombres :
Nombre 1 : 8
Nombre 2 : 3
Nombre 3 : 15
Nombre 4 : 1
Nombre 5 : 10

Tableau : 8 3 15 1 10
Min : 1, Max : 15, Moyenne : 7.40
Tableau inverse : 10 1 15 3 8
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>

void echanger(int *a, int *b)
{
    int temp = *a;
    *a = *b;
    *b = temp;
}

void saisir_tableau(int *tab, int taille)
{
    printf("Saisie de %d nombres :\n", taille);
    for (int i = 0; i < taille; i++)
    {
        printf("Nombre %d : ", i + 1);
        scanf("%d", &tab[i]);
    }
}

void afficher_tableau(int *tab, int taille)
{
    for (int i = 0; i < taille; i++)
    {
        printf("%d", tab[i]);
        if (i < taille - 1)
        {
            printf(" ");
        }
    }
    printf("\n");
}

void statistiques(int *tab, int taille, int *min, int *max, double *moyenne)
{
    *min = tab[0];
    *max = tab[0];
    int somme = 0;

    for (int i = 0; i < taille; i++)
    {
        if (tab[i] < *min)
        {
            *min = tab[i];
        }
        if (tab[i] > *max)
        {
            *max = tab[i];
        }
        somme += tab[i];
    }
    *moyenne = (double)somme / taille;
}

void inverser_tableau(int *tab, int taille)
{
    for (int i = 0; i < taille / 2; i++)
    {
        echanger(&tab[i], &tab[taille - 1 - i]);
    }
}

int main(void)
{
    int tab[5];

    saisir_tableau(tab, 5);

    printf("\nTableau : ");
    afficher_tableau(tab, 5);

    int min;
    int max;
    double moyenne;
    statistiques(tab, 5, &min, &max, &moyenne);
    printf("Min : %d, Max : %d, Moyenne : %.2f\n", min, max, moyenne);

    inverser_tableau(tab, 5);
    printf("Tableau inverse : ");
    afficher_tableau(tab, 5);

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[04 - Fonctions](04-fonctions.md)**

→ Fiche suivante : **[06 - Tableaux et chaînes de caractères](06-tableaux-chaines.md)**
