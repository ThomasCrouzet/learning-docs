---
tags:
  - C
  - Intermédiaire
  - Concept
description: "Créer des types composites avec struct, typedef, unions et enums, comprendre l'alignement mémoire et organiser les données."
estimated_time: "75 min"
fiche_number: 8
total_fiches: 10
cursus: "Langage C"
---

# 08 - Structures et unions

> **En bref** : Créer des types composites avec struct et typedef, comprendre les unions, les enums et l'alignement mémoire pour organiser les données de manière logique. Lecture estimée : 75 min.

## Prérequis

- [07 - Allocation dynamique](07-allocation-dynamique.md) : savoir allouer et libérer de la mémoire dynamiquement

## Objectif de cette fiche

À la fin de cette fiche, tu sauras créer des structures pour regrouper des données, utiliser typedef pour simplifier les déclarations, comprendre les unions et les enums, et connaître l'impact de l'alignement mémoire.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'une structure ?

**Définition** : Une structure (`struct`) est un type composite qui regroupe plusieurs variables de types différents sous un même nom. Chaque variable dans la structure est appelée un champ (ou membre).

**Le problème que les structures résolvent** :

Sans structures, voici les problèmes rencontrés :

1. **Variables dispersées** : pour représenter un étudiant, tu as besoin de variables séparées (`nom`, `age`, `note`) sans lien entre elles.
2. **Passage complexe** : passer un étudiant à une fonction nécessite de passer chaque variable séparément (3 paramètres au lieu d'un).
3. **Tableaux impossibles** : impossible de créer un tableau d'étudiants si chaque étudiant est composé de variables séparées.

**Comment les structures résolvent ces problèmes** :

| Problème | Solution apportée par les structures |
| --- | --- |
| Variables dispersées | Toutes les données d'un étudiant sont regroupées dans une seule structure |
| Passage complexe | On passe un pointeur vers la structure (un seul paramètre) |
| Tableaux impossibles | Un tableau de structures est un tableau d'étudiants |

**Analogie concrète** : Une structure, c'est comme une fiche d'identité. Plutôt que d'avoir ton nom sur un papier, ta date de naissance sur un autre et ta photo sur un troisième, la carte d'identité regroupe toutes ces informations sur un seul document.

**Ce qu'une structure n'est PAS** :

- Une structure n'est pas une classe. En C, une structure ne contient que des données, pas de méthodes (fonctions). Pour des fonctions liées à une structure, on passe un pointeur vers la structure en paramètre.
- Une structure n'est pas un objet. Il n'y a pas d'héritage, de polymorphisme ou d'encapsulation en C.

---

### Qu'est-ce qu'une union ?

**Définition** : Une union ressemble à une structure, mais tous ses champs partagent le même espace mémoire. La taille d'une union est égale à la taille de son plus grand champ. Un seul champ peut être utilisé à la fois.

**Le problème que les unions résolvent** :

Sans unions, voici le problème rencontré :

1. **Gaspillage mémoire** : stocker une valeur qui peut être soit un entier, soit un flottant, soit une chaîne nécessite de réserver de la mémoire pour les trois types, même si un seul est utilisé.

**Comment les unions résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Gaspillage mémoire | L'union n'utilise que la mémoire du plus grand champ, partagée entre tous |

**Structure vs union** :

| Structure | Union |
| --- | --- |
| Chaque champ a son propre espace mémoire | Tous les champs partagent le même espace |
| Taille = somme des champs (+ alignement) | Taille = taille du plus grand champ |
| Tous les champs sont accessibles en même temps | Un seul champ est valide à la fois |

---

### Qu'est-ce qu'un enum ?

**Définition** : Un enum (énumération) définit un ensemble de constantes entières nommées. Chaque constante reçoit une valeur entière, commençant à 0 par défaut.

**Le problème que les enums résolvent** :

Sans enums, voici le problème rencontré :

1. **Nombres magiques** : utiliser `0` pour lundi, `1` pour mardi, etc. rend le code illisible et sujet aux erreurs.

**Comment les enums résolvent ce problème** :

| Problème | Solution |
| --- | --- |
| Nombres magiques | Les constantes nommées (LUNDI, MARDI) rendent le code explicite |

---

### Qu'est-ce que l'alignement mémoire ?

**Définition** : L'alignement mémoire est une contrainte du processeur qui exige que certains types de données soient stockés à des adresses multiples de leur taille. Le compilateur ajoute des octets de remplissage (padding) dans les structures pour respecter cette contrainte.

**Le problème que l'alignement résout** :

Sans alignement, voici le problème rencontré :

1. **Performances dégradées** : sur certains processeurs, accéder à un `int` de 4 octets à une adresse non alignée nécessite deux lectures mémoire au lieu d'une.

**Comment l'alignement résout ce problème** :

| Problème | Solution |
| --- | --- |
| Performances dégradées | Le compilateur insère du padding pour aligner chaque champ sur une adresse optimale |

**Analogie concrète** : L'alignement, c'est comme ranger des livres de différentes tailles sur une étagère. Un grand livre doit être posé à plat et prendre une case entière. Si tu alternes petits et grands livres, tu perds de l'espace (padding). Si tu regroupes les livres par taille, tu optimises le rangement.

---

## Étapes Pratiques

### Étape 1 : Créer et utiliser une structure

Crée un fichier `structures.c` :

```c
#include <stdio.h>
#include <string.h>

// Déclaration d'une structure
struct Etudiant
{
    char nom[50];
    int age;
    float note;
};

// Avec typedef : plus besoin d'écrire "struct" devant le type
typedef struct
{
    double x;
    double y;
} Point;

int main(void)
{
    // Déclaration et initialisation d'une structure
    struct Etudiant alice;
    strcpy(alice.nom, "Alice");  // On ne peut pas utiliser = pour les chaînes
    alice.age = 22;
    alice.note = 15.5f;

    // Initialisation directe (dans l'ordre des champs)
    struct Etudiant bob = {"Bob", 20, 13.0f};

    // Initialisation désignée (dans n'importe quel ordre)
    struct Etudiant charlie = {
        .note = 17.5f,
        .nom = "Charlie",
        .age = 21
    };

    // Accès aux champs avec le point (.)
    printf("Nom   : %s\n", alice.nom);
    printf("Age   : %d\n", alice.age);
    printf("Note  : %.1f\n\n", alice.note);

    // Utilisation de typedef (pas besoin de "struct" devant)
    Point origine = {0.0, 0.0};
    Point p1 = {3.0, 4.0};

    printf("Origine : (%.1f, %.1f)\n", origine.x, origine.y);
    printf("Point 1 : (%.1f, %.1f)\n", p1.x, p1.y);

    // Copie de structure (copie tous les champs)
    struct Etudiant copie = bob;
    printf("\nCopie de Bob : %s, %d ans, %.1f\n",
           copie.nom, copie.age, copie.note);

    // Éviter l'avertissement
    (void)charlie;

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror structures.c -o structures
./structures
```

**Résultat attendu** :

```text
Nom   : Alice
Age   : 22
Note  : 15.5

Origine : (0.0, 0.0)
Point 1 : (3.0, 4.0)

Copie de Bob : Bob, 20 ans, 13.0
```

---

### Étape 2 : Pointeurs vers des structures

Crée un fichier `struct_pointeur.c` :

```c
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

typedef struct
{
    char nom[50];
    int age;
    float note;
} Etudiant;

// Passer une structure par pointeur (efficace, modifiable)
void afficher_etudiant(const Etudiant *e)
{
    // L'opérateur -> accède aux champs via un pointeur
    // e->nom est équivalent à (*e).nom
    printf("  %s, %d ans, note : %.1f\n", e->nom, e->age, e->note);
}

// Modifier une structure via un pointeur
void augmenter_note(Etudiant *e, float bonus)
{
    e->note += bonus;
    if (e->note > 20.0f)
    {
        e->note = 20.0f;
    }
}

int main(void)
{
    // Tableau de structures
    Etudiant classe[] = {
        {"Alice", 22, 15.5f},
        {"Bob", 20, 12.0f},
        {"Charlie", 21, 17.0f}
    };
    int nb_etudiants = sizeof(classe) / sizeof(classe[0]);

    printf("Liste de la classe :\n");
    for (int i = 0; i < nb_etudiants; i++)
    {
        afficher_etudiant(&classe[i]);
    }

    // Modifier via pointeur
    printf("\nAugmentation de 2 points pour tout le monde :\n");
    for (int i = 0; i < nb_etudiants; i++)
    {
        augmenter_note(&classe[i], 2.0f);
        afficher_etudiant(&classe[i]);
    }

    // Structure allouée dynamiquement
    Etudiant *dynamique = malloc(sizeof(Etudiant));
    if (dynamique == NULL)
    {
        return 1;
    }

    strcpy(dynamique->nom, "Diana");
    dynamique->age = 23;
    dynamique->note = 16.0f;

    printf("\nEtudiant dynamique :\n");
    afficher_etudiant(dynamique);

    free(dynamique);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror struct_pointeur.c -o struct_pointeur
./struct_pointeur
```

**Résultat attendu** :

```text
Liste de la classe :
  Alice, 22 ans, note : 15.5
  Bob, 20 ans, note : 12.0
  Charlie, 21 ans, note : 17.0

Augmentation de 2 points pour tout le monde :
  Alice, 22 ans, note : 17.5
  Bob, 20 ans, note : 14.0
  Charlie, 21 ans, note : 19.0

Etudiant dynamique :
  Diana, 23 ans, note : 16.0
```

---

### Étape 3 : Enums

Crée un fichier `enums.c` :

```c
#include <stdio.h>

// Enum basique - les valeurs commencent à 0
typedef enum
{
    LUNDI,      // 0
    MARDI,      // 1
    MERCREDI,   // 2
    JEUDI,      // 3
    VENDREDI,   // 4
    SAMEDI,     // 5
    DIMANCHE    // 6
} Jour;

// Enum avec valeurs personnalisées
typedef enum
{
    ERREUR_OK = 0,
    ERREUR_FICHIER = -1,
    ERREUR_MEMOIRE = -2,
    ERREUR_PARAMETRE = -3
} CodeErreur;

const char *nom_jour(Jour j)
{
    switch (j)
    {
        case LUNDI:    return "Lundi";
        case MARDI:    return "Mardi";
        case MERCREDI: return "Mercredi";
        case JEUDI:    return "Jeudi";
        case VENDREDI: return "Vendredi";
        case SAMEDI:   return "Samedi";
        case DIMANCHE: return "Dimanche";
        default:       return "Inconnu";
    }
}

const char *message_erreur(CodeErreur code)
{
    switch (code)
    {
        case ERREUR_OK:        return "Succes";
        case ERREUR_FICHIER:   return "Erreur de fichier";
        case ERREUR_MEMOIRE:   return "Erreur d'allocation memoire";
        case ERREUR_PARAMETRE: return "Parametre invalide";
        default:               return "Erreur inconnue";
    }
}

int main(void)
{
    // Utilisation des enums
    Jour aujourdhui = MERCREDI;
    printf("Aujourd'hui : %s (valeur = %d)\n",
           nom_jour(aujourdhui), aujourdhui);

    // Boucle sur les jours
    printf("\nSemaine :\n");
    for (Jour j = LUNDI; j <= DIMANCHE; j++)
    {
        const char *type = (j <= VENDREDI) ? "ouvrable" : "week-end";
        printf("  %s (%s)\n", nom_jour(j), type);
    }

    // Codes d'erreur
    printf("\nCodes d'erreur :\n");
    printf("  %d : %s\n", ERREUR_OK, message_erreur(ERREUR_OK));
    printf("  %d : %s\n", ERREUR_FICHIER, message_erreur(ERREUR_FICHIER));
    printf("  %d : %s\n", ERREUR_MEMOIRE, message_erreur(ERREUR_MEMOIRE));

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror enums.c -o enums
./enums
```

**Résultat attendu** :

```text
Aujourd'hui : Mercredi (valeur = 2)

Semaine :
  Lundi (ouvrable)
  Mardi (ouvrable)
  Mercredi (ouvrable)
  Jeudi (ouvrable)
  Vendredi (ouvrable)
  Samedi (week-end)
  Dimanche (week-end)

Codes d'erreur :
  0 : Succes
  -1 : Erreur de fichier
  -2 : Erreur d'allocation memoire
```

---

### Étape 4 : Unions

Crée un fichier `unions.c` :

```c
#include <stdio.h>
#include <string.h>

// Une union partage le même espace mémoire pour tous ses champs
typedef union
{
    int entier;
    float flottant;
    char caractere;
} Valeur;

// Combinaison classique : enum + union pour un type variant
typedef enum
{
    TYPE_INT,
    TYPE_FLOAT,
    TYPE_STRING
} TypeValeur;

typedef struct
{
    TypeValeur type;
    union
    {
        int entier;
        float flottant;
        char chaine[50];
    } donnee;
} Variable;

void afficher_variable(const Variable *v)
{
    switch (v->type)
    {
        case TYPE_INT:
            printf("  int    : %d\n", v->donnee.entier);
            break;
        case TYPE_FLOAT:
            printf("  float  : %.2f\n", v->donnee.flottant);
            break;
        case TYPE_STRING:
            printf("  string : \"%s\"\n", v->donnee.chaine);
            break;
    }
}

int main(void)
{
    // Démonstration de la taille partagée
    Valeur v;
    printf("Taille de l'union Valeur : %zu octets\n", sizeof(Valeur));
    printf("Taille de int    : %zu octets\n", sizeof(int));
    printf("Taille de float  : %zu octets\n", sizeof(float));
    printf("Taille de char   : %zu octets\n\n", sizeof(char));
    // La taille de l'union = taille du plus grand champ (int ou float = 4)

    // Un seul champ est valide à la fois
    v.entier = 42;
    printf("entier    = %d\n", v.entier);

    v.flottant = 3.14f;
    printf("flottant  = %.2f\n", v.flottant);
    // Attention : v.entier n'est plus valide ici
    // (les octets ont été écrasés par le float)

    // Pattern tagged union (enum + union)
    printf("\nVariables typees :\n");

    Variable vars[3];

    vars[0].type = TYPE_INT;
    vars[0].donnee.entier = 42;

    vars[1].type = TYPE_FLOAT;
    vars[1].donnee.flottant = 3.14f;

    vars[2].type = TYPE_STRING;
    strcpy(vars[2].donnee.chaine, "Bonjour");

    for (int i = 0; i < 3; i++)
    {
        afficher_variable(&vars[i]);
    }

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror unions.c -o unions
./unions
```

**Résultat attendu** :

```text
Taille de l'union Valeur : 4 octets
Taille de int    : 4 octets
Taille de float  : 4 octets
Taille de char   : 1 octets

entier    = 42
flottant  = 3.14

Variables typees :
  int    : 42
  float  : 3.14
  string : "Bonjour"
```

---

### Étape 5 : Alignement mémoire

Crée un fichier `alignement.c` :

```c
#include <stdio.h>

// L'ordre des champs impacte la taille de la structure
typedef struct
{
    char a;     // 1 octet + 3 octets de padding
    int b;      // 4 octets
    char c;     // 1 octet + 3 octets de padding
} MalOrganise;  // Total : 12 octets

typedef struct
{
    int b;      // 4 octets
    char a;     // 1 octet
    char c;     // 1 octet + 2 octets de padding
} BienOrganise; // Total : 8 octets

int main(void)
{
    printf("--- Alignement memoire ---\n\n");

    printf("MalOrganise  (char, int, char) : %zu octets\n",
           sizeof(MalOrganise));
    printf("BienOrganise (int, char, char) : %zu octets\n",
           sizeof(BienOrganise));

    printf("\nEconomie : %zu octets par structure\n",
           sizeof(MalOrganise) - sizeof(BienOrganise));

    // Avec 1000 structures, la différence est significative
    printf("Pour 1000 structures :\n");
    printf("  MalOrganise  : %zu octets\n", 1000 * sizeof(MalOrganise));
    printf("  BienOrganise : %zu octets\n", 1000 * sizeof(BienOrganise));

    // Vérifier les offsets des champs
    MalOrganise m;
    printf("\nOffsets dans MalOrganise :\n");
    printf("  a (char) a l'offset %zu\n", (size_t)((char *)&m.a - (char *)&m));
    printf("  b (int)  a l'offset %zu\n", (size_t)((char *)&m.b - (char *)&m));
    printf("  c (char) a l'offset %zu\n", (size_t)((char *)&m.c - (char *)&m));

    BienOrganise bo;
    printf("\nOffsets dans BienOrganise :\n");
    printf("  b (int)  a l'offset %zu\n", (size_t)((char *)&bo.b - (char *)&bo));
    printf("  a (char) a l'offset %zu\n", (size_t)((char *)&bo.a - (char *)&bo));
    printf("  c (char) a l'offset %zu\n", (size_t)((char *)&bo.c - (char *)&bo));

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror alignement.c -o alignement
./alignement
```

**Résultat attendu** :

```text
--- Alignement memoire ---

MalOrganise  (char, int, char) : 12 octets
BienOrganise (int, char, char) : 8 octets

Economie : 4 octets par structure
Pour 1000 structures :
  MalOrganise  : 12000 octets
  BienOrganise : 8000 octets

Offsets dans MalOrganise :
  a (char) a l'offset 0
  b (int)  a l'offset 4
  c (char) a l'offset 8

Offsets dans BienOrganise :
  b (int)  a l'offset 0
  a (char) a l'offset 4
  c (char) a l'offset 5
```

---

## Commandes Utiles

| Syntaxe | Action |
| --- | --- |
| `struct Nom { ... };` | Déclare une structure |
| `typedef struct { ... } Nom;` | Déclare une structure avec alias |
| `var.champ` | Accède à un champ (variable directe) |
| `ptr->champ` | Accède à un champ (via pointeur) |
| `union { ... }` | Déclare une union |
| `enum { A, B, C }` | Déclare une énumération |
| `sizeof(struct Nom)` | Taille de la structure en octets (avec padding) |

---

## Pièges Fréquents

### Piège 1 : Confondre . et ->

**Problème** : Utiliser `.` sur un pointeur ou `->` sur une variable directe provoque une erreur de compilation.

**Solution** : `.` pour les variables, `->` pour les pointeurs.

```c
Etudiant e = {"Alice", 22, 15.0f};
Etudiant *ptr = &e;

// Variable directe : utiliser .
printf("%s\n", e.nom);

// Pointeur : utiliser ->
printf("%s\n", ptr->nom);

// Équivalent (mais moins lisible)
printf("%s\n", (*ptr).nom);
```

---

### Piège 2 : Lire le mauvais champ d'une union

**Problème** : Écrire un `int` puis lire un `float` dans la même union donne un résultat absurde.

**Solution** : Utiliser un enum associé (tagged union) pour savoir quel champ est actuellement valide.

---

### Piège 3 : Copier une structure contenant des pointeurs

**Problème** : Copier une structure avec `=` copie les valeurs des champs, y compris les pointeurs. Les deux structures pointent alors vers la même mémoire (copie superficielle).

**Solution** : Faire une copie profonde (allouer de la mémoire et copier les données pointées).

```c
typedef struct
{
    char *nom; // Pointeur, pas tableau
    int age;
} Personne;

// Copie superficielle (les deux partagent le même nom)
Personne a = {malloc(20), 25};
strcpy(a.nom, "Alice");
Personne b = a; // b.nom pointe vers la même mémoire que a.nom
// free(a.nom) rendrait b.nom invalide
```

---

## Checklist de Validation

- [ ] Je sais déclarer une structure avec struct et typedef
- [ ] Je sais accéder aux champs avec . et ->
- [ ] Je comprends la différence entre struct et union
- [ ] Je sais utiliser les enums pour remplacer les nombres magiques
- [ ] Je comprends l'impact de l'alignement mémoire sur la taille des structures
- [ ] Je sais organiser les champs pour minimiser le padding

---

## Exercice Pratique

**Énoncé** : Crée un programme de gestion d'inventaire avec :

1. Un enum `Categorie` avec les valeurs : ELECTRONIQUE, ALIMENTATION, VETEMENT
2. Une structure `Produit` avec : nom (50 caractères), prix (double), quantité (int), catégorie (Catégorie)
3. Une fonction `afficher_produit(const Produit *p)` qui affiche un produit
4. Une fonction `valeur_stock(const Produit *produits, int nb)` qui retourne la valeur totale (prix x quantité pour chaque produit)
5. Un tableau de 3 produits initialisés, affiche chaque produit et la valeur totale du stock

**Indications** :

- Utilise typedef pour la structure et l'enum
- Crée une fonction `nom_categorie(Categorie c)` qui retourne le nom en texte

**Résultat attendu** :

```text
Inventaire :
  Laptop        - 999.99 EUR x 5  [Electronique]
  Pommes        -   2.50 EUR x 100 [Alimentation]
  T-shirt       -  19.99 EUR x 50  [Vetement]

Valeur totale du stock : 6249.45 EUR
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>

typedef enum
{
    ELECTRONIQUE,
    ALIMENTATION,
    VETEMENT
} Categorie;

typedef struct
{
    char nom[50];
    double prix;
    int quantite;
    Categorie categorie;
} Produit;

const char *nom_categorie(Categorie c)
{
    switch (c)
    {
        case ELECTRONIQUE: return "Electronique";
        case ALIMENTATION: return "Alimentation";
        case VETEMENT:     return "Vetement";
        default:           return "Inconnu";
    }
}

void afficher_produit(const Produit *p)
{
    printf("  %-14s- %7.2f EUR x %-3d [%s]\n",
           p->nom, p->prix, p->quantite,
           nom_categorie(p->categorie));
}

double valeur_stock(const Produit *produits, int nb)
{
    double total = 0.0;
    for (int i = 0; i < nb; i++)
    {
        total += produits[i].prix * produits[i].quantite;
    }
    return total;
}

int main(void)
{
    Produit inventaire[] = {
        {"Laptop", 999.99, 5, ELECTRONIQUE},
        {"Pommes", 2.50, 100, ALIMENTATION},
        {"T-shirt", 19.99, 50, VETEMENT}
    };
    int nb = sizeof(inventaire) / sizeof(inventaire[0]);

    printf("Inventaire :\n");
    for (int i = 0; i < nb; i++)
    {
        afficher_produit(&inventaire[i]);
    }

    printf("\nValeur totale du stock : %.2f EUR\n",
           valeur_stock(inventaire, nb));

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[07 - Allocation dynamique](07-allocation-dynamique.md)**

→ Fiche suivante : **[09 - Fichiers et I/O](09-fichiers-io.md)**
