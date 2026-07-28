---
tags:
  - C
  - Intermédiaire
  - Pratique
description: "Allouer et libérer la mémoire dynamiquement avec malloc, calloc, realloc et free, détecter les fuites mémoire avec valgrind."
estimated_time: "90 min"
fiche_number: 7
total_fiches: 10
cursus: "Langage C"
---

# 07 - Allocation dynamique

> **En bref** : Allouer de la mémoire à l'exécution avec malloc, calloc et realloc, la libérer avec free, et détecter les fuites mémoire avec valgrind. Lecture estimée : 90 min.

## Prérequis

- [06 - Tableaux et chaînes de caractères](06-tableaux-chaines.md) : maîtriser les tableaux et les chaînes C
- [05 - Pointeurs](05-pointeurs.md) : comprendre les pointeurs et le déréférencement

## Objectif de cette fiche

À la fin de cette fiche, tu sauras allouer de la mémoire dynamiquement, redimensionner un bloc alloué, libérer la mémoire correctement et utiliser valgrind pour détecter les fuites mémoire.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce que l'allocation dynamique ?

**Définition** : L'allocation dynamique permet de réserver de la mémoire pendant l'exécution du programme (au lieu de la compilation). La mémoire est allouée sur le tas (heap), une zone mémoire séparée de la pile (stack) où vivent les variables locales.

**Le problème que l'allocation dynamique résout** :

Sans allocation dynamique, voici les problèmes rencontrés :

1. **Taille fixe** : la taille d'un tableau doit être connue à la compilation. Si l'utilisateur veut saisir 1000 éléments mais que tu as déclaré un tableau de 100, le programme est limité.
2. **Gaspillage mémoire** : déclarer un tableau de 10 000 éléments "au cas où" gaspille de la mémoire quand on n'en utilise que 10.
3. **Durée de vie limitée** : les variables locales (pile) sont détruites quand la fonction se termine. Impossible de créer des données qui survivent au-delà.

**Comment l'allocation dynamique résout ces problèmes** :

| Problème | Solution apportée par l'allocation dynamique |
| --- | --- |
| Taille fixe | La taille est déterminée à l'exécution (saisie utilisateur, lecture de fichier) |
| Gaspillage mémoire | On alloue exactement la taille nécessaire, et on peut l'ajuster avec realloc |
| Durée de vie limitée | La mémoire allouée sur le tas persiste jusqu'à un appel explicite à free |

**Analogie concrète** : L'allocation dynamique, c'est comme louer des espaces de stockage. Avec un tableau statique (pile), tu as un placard fixe dans ton appartement - il fait 2 mètres, que tu aies 3 cartons ou 30. Avec malloc (tas), tu vas chez un loueur de box et tu choisis la taille exacte dont tu as besoin. Quand tu n'en as plus besoin, tu rends le box (free).

**Ce que l'allocation dynamique n'est PAS** :

- L'allocation dynamique n'est pas automatique. Tu dois libérer la mémoire toi-même avec `free`. Pas de ramasse-miettes en C.
- L'allocation dynamique ne garantit pas la réussite. Si le système n'a plus de mémoire, `malloc` retourne `NULL`.

**Pile (stack) vs tas (heap)** :

| Pile (stack) | Tas (heap) |
| --- | --- |
| Variables locales et paramètres | Mémoire allouée dynamiquement |
| Libérée automatiquement en fin de fonction | Libérée manuellement avec free |
| Taille limitée (quelques Mo) | Taille limitée par la RAM disponible |
| Allocation très rapide | Allocation plus lente |
| Taille connue à la compilation | Taille déterminée à l'exécution |

---

### Qu'est-ce qu'une fuite mémoire ?

**Définition** : Une fuite mémoire (memory leak) se produit quand on alloue de la mémoire avec `malloc` sans jamais appeler `free`. La mémoire reste réservée mais inaccessible, et le programme consomme de plus en plus de RAM.

**Le problème que la détection des fuites résout** :

Sans détection, voici les problèmes rencontrés :

1. **Consommation croissante** : un programme qui tourne longtemps (serveur, jeu) finit par consommer toute la RAM disponible.
2. **Crash système** : quand la RAM est épuisée, le système peut tuer le programme ou devenir instable.

**Comment la détection des fuites résout ces problèmes** :

| Problème | Solution |
| --- | --- |
| Consommation croissante | Valgrind détecte chaque allocation non libérée |
| Crash système | Corriger les fuites avant la mise en production |

---

## Étapes Pratiques

### Étape 1 : malloc et free

Crée un fichier `malloc_base.c` :

```c
#include <stdio.h>
#include <stdlib.h>  // Nécessaire pour malloc, calloc, realloc, free

int main(void)
{
    // malloc alloue un bloc de mémoire de la taille demandée (en octets)
    // Retourne un pointeur vers le bloc alloué, ou NULL si l'allocation échoue
    int *nombre = malloc(sizeof(int));

    // TOUJOURS vérifier que malloc n'a pas retourné NULL
    if (nombre == NULL)
    {
        printf("Erreur : allocation memoire echouee\n");
        return 1;
    }

    // Utiliser la mémoire allouée
    *nombre = 42;
    printf("Valeur allouee : %d\n", *nombre);

    // Libérer la mémoire quand on n'en a plus besoin
    free(nombre);
    // Bonne pratique : mettre le pointeur à NULL après free
    nombre = NULL;

    // Allouer un tableau dynamique de 5 entiers
    int taille = 5;
    int *tableau = malloc(taille * sizeof(int));

    if (tableau == NULL)
    {
        printf("Erreur : allocation memoire echouee\n");
        return 1;
    }

    // Remplir le tableau
    for (int i = 0; i < taille; i++)
    {
        tableau[i] = (i + 1) * 10;
    }

    // Afficher le tableau
    printf("\nTableau dynamique :\n");
    for (int i = 0; i < taille; i++)
    {
        printf("  tableau[%d] = %d\n", i, tableau[i]);
    }

    // Libérer le tableau
    free(tableau);
    tableau = NULL;

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror malloc_base.c -o malloc_base
./malloc_base
```

**Résultat attendu** :

```text
Valeur allouee : 42

Tableau dynamique :
  tableau[0] = 10
  tableau[1] = 20
  tableau[2] = 30
  tableau[3] = 40
  tableau[4] = 50
```

---

### Étape 2 : calloc (allocation initialisée à zéro)

Crée un fichier `calloc_exemple.c` :

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int taille = 5;

    // malloc : la mémoire contient des valeurs aléatoires
    int *tab_malloc = malloc(taille * sizeof(int));
    if (tab_malloc == NULL)
    {
        return 1;
    }

    printf("malloc (non initialise) :\n");
    for (int i = 0; i < taille; i++)
    {
        printf("  tab_malloc[%d] = %d\n", i, tab_malloc[i]);
        // Valeurs imprévisibles (déchets mémoire)
    }

    // calloc : alloue ET initialise à zéro
    // Syntaxe : calloc(nombre_elements, taille_element)
    int *tab_calloc = calloc(taille, sizeof(int));
    if (tab_calloc == NULL)
    {
        free(tab_malloc);
        return 1;
    }

    printf("\ncalloc (initialise a zero) :\n");
    for (int i = 0; i < taille; i++)
    {
        printf("  tab_calloc[%d] = %d\n", i, tab_calloc[i]);
        // Toujours 0
    }

    free(tab_malloc);
    free(tab_calloc);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror calloc_exemple.c -o calloc_exemple
./calloc_exemple
```

**Résultat attendu** :

```text
malloc (non initialise) :
  tab_malloc[0] = 0
  tab_malloc[1] = 0
  tab_malloc[2] = 0
  tab_malloc[3] = 0
  tab_malloc[4] = 0

calloc (initialise a zero) :
  tab_calloc[0] = 0
  tab_calloc[1] = 0
  tab_calloc[2] = 0
  tab_calloc[3] = 0
  tab_calloc[4] = 0
```

Les valeurs de `tab_malloc` sont imprévisibles (elles peuvent être 0 par chance, mais ce n'est pas garanti).

---

### Étape 3 : realloc (redimensionner)

Crée un fichier `realloc_exemple.c` :

```c
#include <stdio.h>
#include <stdlib.h>

void afficher_tableau(int *tab, int taille)
{
    printf("  [");
    for (int i = 0; i < taille; i++)
    {
        printf("%d", tab[i]);
        if (i < taille - 1)
        {
            printf(", ");
        }
    }
    printf("]\n");
}

int main(void)
{
    // Commencer avec un tableau de 3 éléments
    int capacite = 3;
    int taille = 0;
    int *tableau = malloc(capacite * sizeof(int));

    if (tableau == NULL)
    {
        return 1;
    }

    // Ajouter des éléments un par un
    // Si le tableau est plein, doubler sa capacité avec realloc
    for (int i = 1; i <= 8; i++)
    {
        // Vérifier si le tableau est plein
        if (taille >= capacite)
        {
            int nouvelle_capacite = capacite * 2;
            printf("Redimensionnement : %d -> %d\n", capacite, nouvelle_capacite);

            // realloc redimensionne le bloc
            // Si réussi, les données existantes sont préservées
            // IMPORTANT : utiliser un pointeur temporaire
            // Si realloc échoue, il retourne NULL mais l'ancien bloc reste valide
            int *nouveau = realloc(tableau, nouvelle_capacite * sizeof(int));

            if (nouveau == NULL)
            {
                printf("Erreur de reallocation\n");
                free(tableau);
                return 1;
            }

            tableau = nouveau;
            capacite = nouvelle_capacite;
        }

        tableau[taille] = i * 10;
        taille++;

        printf("Apres ajout de %d (taille=%d, capacite=%d) :",
               i * 10, taille, capacite);
        afficher_tableau(tableau, taille);
    }

    free(tableau);
    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror realloc_exemple.c -o realloc_exemple
./realloc_exemple
```

**Résultat attendu** :

```text
Apres ajout de 10 (taille=1, capacite=3) :  [10]
Apres ajout de 20 (taille=2, capacite=3) :  [10, 20]
Apres ajout de 30 (taille=3, capacite=3) :  [10, 20, 30]
Redimensionnement : 3 -> 6
Apres ajout de 40 (taille=4, capacite=6) :  [10, 20, 30, 40]
Apres ajout de 50 (taille=5, capacite=6) :  [10, 20, 30, 40, 50]
Apres ajout de 60 (taille=6, capacite=6) :  [10, 20, 30, 40, 50, 60]
Redimensionnement : 6 -> 12
Apres ajout de 70 (taille=7, capacite=12) :  [10, 20, 30, 40, 50, 60, 70]
Apres ajout de 80 (taille=8, capacite=12) :  [10, 20, 30, 40, 50, 60, 70, 80]
```

---

### Étape 4 : Chaîne dynamique

Crée un fichier `chaine_dynamique.c` :

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Duplique une chaîne en allouant la mémoire nécessaire
// L'appelant est responsable de libérer la mémoire retournée
char *dupliquer_chaine(const char *source)
{
    // strlen ne compte pas le '\0', on ajoute 1
    size_t taille = strlen(source) + 1;
    char *copie = malloc(taille);

    if (copie == NULL)
    {
        return NULL;
    }

    // Copier le contenu
    strcpy(copie, source);
    return copie;
}

// Concatène deux chaînes dans un nouveau bloc alloué
char *concatener(const char *a, const char *b)
{
    size_t taille = strlen(a) + strlen(b) + 1;
    char *resultat = malloc(taille);

    if (resultat == NULL)
    {
        return NULL;
    }

    strcpy(resultat, a);
    strcat(resultat, b);
    return resultat;
}

int main(void)
{
    // Dupliquer une chaîne
    char *copie = dupliquer_chaine("Bonjour le monde");
    if (copie != NULL)
    {
        printf("Copie : %s\n", copie);
        printf("Longueur : %zu\n", strlen(copie));
        free(copie);
    }

    // Concaténer deux chaînes
    char *phrase = concatener("Le langage ", "C est puissant");
    if (phrase != NULL)
    {
        printf("Concatenation : %s\n", phrase);
        free(phrase);
    }

    // Saisir une chaîne de longueur inconnue
    printf("\nEntre un texte : ");
    char buffer[256];
    if (fgets(buffer, sizeof(buffer), stdin) != NULL)
    {
        // Retirer le '\n'
        size_t len = strlen(buffer);
        if (len > 0 && buffer[len - 1] == '\n')
        {
            buffer[len - 1] = '\0';
        }

        // Allouer exactement la taille nécessaire
        char *texte = dupliquer_chaine(buffer);
        if (texte != NULL)
        {
            printf("Texte sauvegarde : \"%s\" (%zu octets alloues)\n",
                   texte, strlen(texte) + 1);
            free(texte);
        }
    }

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror chaine_dynamique.c -o chaine_dynamique
echo "Hello C" | ./chaine_dynamique
```

**Résultat attendu** :

```text
Copie : Bonjour le monde
Longueur : 16
Concatenation : Le langage C est puissant

Entre un texte : Texte sauvegarde : "Hello C" (8 octets alloues)
```

---

### Étape 5 : Détecter les fuites mémoire avec valgrind

Valgrind est un outil qui détecte les fuites mémoire et les accès invalides.

Installation :

```bash
# Sur Linux (Debian/Ubuntu)
sudo apt install -y valgrind

# Sur macOS : valgrind n'est pas disponible nativement
# Alternative : utiliser les Address Sanitizers de gcc/clang
# gcc -fsanitize=address -g programme.c -o programme
```

Crée un fichier `fuite.c` avec une fuite mémoire volontaire :

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    // Allocation 1 : correctement libérée
    int *ok = malloc(sizeof(int));
    if (ok == NULL)
    {
        return 1;
    }
    *ok = 42;
    printf("ok = %d\n", *ok);
    free(ok);

    // Allocation 2 : FUITE MEMOIRE (pas de free)
    int *fuite = malloc(100 * sizeof(int));
    if (fuite == NULL)
    {
        return 1;
    }
    fuite[0] = 99;
    printf("fuite[0] = %d\n", fuite[0]);
    // Oubli volontaire de free(fuite) pour démontrer valgrind

    return 0;
}
```

```bash
gcc -g -Wall -Wextra fuite.c -o fuite

# Exécution avec valgrind (Linux)
valgrind --leak-check=full ./fuite
```

**Résultat attendu** (extrait de valgrind) :

```text
ok = 42
fuite[0] = 99
==12345== HEAP SUMMARY:
==12345==     in use at exit: 400 bytes in 1 blocks
==12345==   total heap usage: 2 allocs, 1 frees, 404 bytes allocated
==12345==
==12345== 400 bytes in 1 blocks are definitely lost in loss record 1 of 1
==12345==    at 0x4C2AB80: malloc (in /usr/lib/valgrind/...)
==12345==    by 0x4005F3: main (fuite.c:18)
==12345==
==12345== LEAK SUMMARY:
==12345==    definitely lost: 400 bytes in 1 blocks
```

Valgrind indique que 400 octets (100 int x 4 octets) n'ont pas été libérés, et la ligne exacte de l'allocation fautive (ligne 18).

**Alternative sur macOS (Address Sanitizer)** :

```bash
gcc -fsanitize=address -g fuite.c -o fuite
./fuite
```

---

## Commandes Utiles

| Fonction | Action |
| --- | --- |
| `malloc(taille)` | Alloue un bloc de `taille` octets (non initialisé) |
| `calloc(n, taille)` | Alloue `n` x `taille` octets (initialisé à zéro) |
| `realloc(ptr, taille)` | Redimensionne le bloc pointé par `ptr` |
| `free(ptr)` | Libère le bloc pointé par `ptr` |
| `valgrind --leak-check=full ./prog` | Détecte les fuites mémoire (Linux) |
| `gcc -fsanitize=address -g` | Active l'Address Sanitizer (macOS/Linux) |

---

## Pièges Fréquents

### Piège 1 : Oublier de vérifier le retour de malloc

**Problème** : Si malloc retourne NULL (plus de mémoire), déréférencer le pointeur provoque un crash.

**Solution** : Toujours vérifier que le pointeur n'est pas NULL après malloc.

```c
int *ptr = malloc(sizeof(int));
// Dangereux sans vérification
// *ptr = 42; // Crash si ptr est NULL

// Correct
if (ptr == NULL)
{
    printf("Erreur d'allocation\n");
    return 1;
}
*ptr = 42;
```

---

### Piège 2 : Double free

**Problème** : Appeler free deux fois sur le même pointeur provoque un crash ou une corruption mémoire.

**Solution** : Mettre le pointeur à NULL après free. `free(NULL)` est sûr et ne fait rien.

```c
int *ptr = malloc(sizeof(int));
free(ptr);
// free(ptr); // CRASH - double free

// Correct : mettre à NULL après free
free(ptr);
ptr = NULL;
free(ptr); // OK, free(NULL) ne fait rien
```

---

### Piège 3 : Utiliser la mémoire après free (use-after-free)

**Problème** : Accéder à la mémoire après l'avoir libérée provoque un comportement indéfini.

**Solution** : Ne jamais utiliser un pointeur après free. Le mettre à NULL.

```c
int *ptr = malloc(sizeof(int));
*ptr = 42;
free(ptr);
// printf("%d\n", *ptr); // DANGEREUX - use-after-free

ptr = NULL; // Sécurité : le pointeur ne pointe plus vers rien
```

---

### Piège 4 : realloc directement sur le même pointeur

**Problème** : Si `realloc` échoue et qu'on a écrasé le pointeur original, on perd la référence au bloc initial (fuite mémoire).

**Solution** : Utiliser un pointeur temporaire.

```c
// DANGEREUX
// tab = realloc(tab, nouvelle_taille);
// Si realloc échoue, tab = NULL et l'ancien bloc est perdu

// CORRECT
int *nouveau = realloc(tab, nouvelle_taille);
if (nouveau == NULL)
{
    // tab est toujours valide, on peut le libérer proprement
    free(tab);
    return 1;
}
tab = nouveau;
```

---

## Checklist de Validation

- [ ] Je sais allouer de la mémoire avec malloc et calloc
- [ ] Je comprends la différence entre malloc (non initialisé) et calloc (initialisé à zéro)
- [ ] Je sais redimensionner un bloc avec realloc (avec pointeur temporaire)
- [ ] Je libère toujours la mémoire avec free et je mets le pointeur à NULL
- [ ] Je vérifie toujours le retour de malloc/calloc/realloc
- [ ] Je sais détecter les fuites mémoire avec valgrind ou Address Sanitizer

---

## Exercice Pratique

**Énoncé** : Crée un programme de liste dynamique d'entiers qui :

1. Commence avec une capacité de 2 éléments
2. Demande des nombres à l'utilisateur en boucle (0 pour arrêter)
3. Double la capacité automatiquement quand le tableau est plein (avec realloc)
4. Affiche le tableau final, la somme et la moyenne
5. Libère correctement toute la mémoire

**Indications** :

- Suis le pattern de l'étape 3 (realloc avec pointeur temporaire)
- Affiche un message à chaque redimensionnement

**Résultat attendu** (avec les entrées 5, 12, 3, 8, 7, 0) :

```text
Entre des nombres (0 pour arreter) :
> 5
> 12
> 3
Redimensionnement : 2 -> 4
> 8
> 7
Redimensionnement : 4 -> 8
> 0

Tableau final : [5, 12, 3, 8, 7]
Nombre d'elements : 5
Somme : 35
Moyenne : 7.00
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>
#include <stdlib.h>

int main(void)
{
    int capacite = 2;
    int taille = 0;
    int *tableau = malloc(capacite * sizeof(int));

    if (tableau == NULL)
    {
        printf("Erreur d'allocation\n");
        return 1;
    }

    printf("Entre des nombres (0 pour arreter) :\n");

    int saisie;
    while (1)
    {
        printf("> ");
        scanf("%d", &saisie);

        if (saisie == 0)
        {
            break;
        }

        // Redimensionner si nécessaire
        if (taille >= capacite)
        {
            int nouvelle_capacite = capacite * 2;
            printf("Redimensionnement : %d -> %d\n", capacite, nouvelle_capacite);

            int *nouveau = realloc(tableau, nouvelle_capacite * sizeof(int));
            if (nouveau == NULL)
            {
                printf("Erreur de reallocation\n");
                free(tableau);
                return 1;
            }

            tableau = nouveau;
            capacite = nouvelle_capacite;
        }

        tableau[taille] = saisie;
        taille++;
    }

    // Affichage
    if (taille > 0)
    {
        printf("\nTableau final : [");
        int somme = 0;
        for (int i = 0; i < taille; i++)
        {
            printf("%d", tableau[i]);
            if (i < taille - 1)
            {
                printf(", ");
            }
            somme += tableau[i];
        }
        printf("]\n");

        printf("Nombre d'elements : %d\n", taille);
        printf("Somme : %d\n", somme);
        printf("Moyenne : %.2f\n", (double)somme / taille);
    }
    else
    {
        printf("\nAucun element saisi\n");
    }

    free(tableau);
    tableau = NULL;

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[06 - Tableaux et chaînes de caractères](06-tableaux-chaines.md)**

→ Fiche suivante : **[08 - Structures et unions](08-structures-unions.md)**
