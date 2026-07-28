---
tags:
  - C
  - Intermédiaire
  - Projet
description: "Projet intégrateur : créer un gestionnaire de tâches en C avec allocation dynamique, structures, fichiers et arguments de ligne de commande."
estimated_time: "120 min"
fiche_number: 10
total_fiches: 10
cursus: "Langage C"
---

# 10 - Projet intégrateur

> **En bref** : Concevoir et réaliser un gestionnaire de tâches complet en C, mobilisant tous les concepts du cursus : structures, allocation dynamique, fichiers, chaînes de caractères et arguments de ligne de commande. Lecture estimée : 120 min.

## Prérequis

- [09 - Fichiers et I/O](09-fichiers-io.md) : savoir lire et écrire des fichiers, utiliser argc/argv
- Toutes les fiches précédentes du cursus

## Objectif de cette fiche

À la fin de cette fiche, tu auras créé un programme C complet et fonctionnel qui combine structures, allocation dynamique, gestion de fichiers, chaînes de caractères et arguments de ligne de commande.

---

## Présentation du Projet

### Le programme : todo

Tu vas créer un gestionnaire de tâches en ligne de commande. Le programme s'appelle `todo` et permet de :

- Ajouter une tâche
- Lister toutes les tâches
- Marquer une tâche comme terminée
- Supprimer une tâche
- Sauvegarder et charger les tâches depuis un fichier

### Utilisation prévue

```bash
# Ajouter des tâches
./todo add "Apprendre les pointeurs"
./todo add "Finir l'exercice malloc"

# Lister les tâches
./todo list

# Marquer une tâche comme terminée (par son numéro)
./todo done 1

# Supprimer une tâche
./todo remove 2

# Afficher l'aide
./todo help
```

### Concepts mobilisés

| Concept | Utilisation dans le projet |
| --- | --- |
| Structures | Structure `Tache` avec description, statut, date |
| Allocation dynamique | Tableau dynamique de tâches (realloc) |
| Fichiers | Sauvegarde/chargement des tâches (binaire) |
| Chaînes de caractères | Description des tâches, comparaison des commandes |
| argc/argv | Commandes et arguments en ligne de commande |
| Enums | Statut des tâches (A_FAIRE, TERMINEE) |
| Pointeurs | Passage par adresse, tableaux dynamiques |
| Makefile | Compilation multi-fichiers |

---

## Architecture du Projet

```text
todo/
├── Makefile
├── main.c          # Point d'entrée et gestion des commandes
├── tache.h         # Déclarations (structures, prototypes)
├── tache.c         # Implémentation (fonctions de gestion)
└── stockage.c      # Fonctions de sauvegarde/chargement
```

---

## Étapes Pratiques

### Étape 1 : Créer la structure et les en-têtes

Crée le dossier du projet :

```bash
mkdir -p ~/projets-c/todo
cd ~/projets-c/todo
```

Crée le fichier `tache.h` :

```c
#ifndef TACHE_H
#define TACHE_H

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>

// Longueur maximale de la description d'une tâche
#define MAX_DESC 256

// Nom du fichier de sauvegarde
#define FICHIER_SAUVEGARDE "todo.dat"

// Statut d'une tâche
typedef enum
{
    A_FAIRE,
    TERMINEE
} Statut;

// Structure représentant une tâche
typedef struct
{
    char description[MAX_DESC];
    Statut statut;
    time_t date_creation;
} Tache;

// Structure représentant la liste de tâches
typedef struct
{
    Tache *taches;    // Tableau dynamique de tâches
    int taille;       // Nombre de tâches actuelles
    int capacite;     // Capacité du tableau
} ListeTaches;

// --- Gestion de la liste ---
// Initialise une liste vide
int liste_init(ListeTaches *liste);

// Libère toute la mémoire de la liste
void liste_liberer(ListeTaches *liste);

// Ajoute une tâche à la liste
int liste_ajouter(ListeTaches *liste, const char *description);

// Marque une tâche comme terminée (index basé sur 1)
int liste_terminer(ListeTaches *liste, int numero);

// Supprime une tâche de la liste (index basé sur 1)
int liste_supprimer(ListeTaches *liste, int numero);

// Affiche toutes les tâches
void liste_afficher(const ListeTaches *liste);

// --- Stockage ---
// Sauvegarde la liste dans un fichier binaire
int sauvegarder(const ListeTaches *liste, const char *chemin);

// Charge la liste depuis un fichier binaire
int charger(ListeTaches *liste, const char *chemin);

#endif
```

---

### Étape 2 : Implémenter les fonctions de gestion

Crée le fichier `tache.c` :

```c
#include "tache.h"

// Capacité initiale du tableau dynamique
#define CAPACITE_INITIALE 4

int liste_init(ListeTaches *liste)
{
    // Allouer le tableau avec une capacité initiale
    liste->taches = malloc(CAPACITE_INITIALE * sizeof(Tache));
    if (liste->taches == NULL)
    {
        fprintf(stderr, "Erreur : allocation memoire echouee\n");
        return -1;
    }
    liste->taille = 0;
    liste->capacite = CAPACITE_INITIALE;
    return 0;
}

void liste_liberer(ListeTaches *liste)
{
    // Libérer le tableau dynamique
    free(liste->taches);
    liste->taches = NULL;
    liste->taille = 0;
    liste->capacite = 0;
}

int liste_ajouter(ListeTaches *liste, const char *description)
{
    // Redimensionner si nécessaire (doubler la capacité)
    if (liste->taille >= liste->capacite)
    {
        int nouvelle_capacite = liste->capacite * 2;
        Tache *nouveau = realloc(liste->taches,
                                 nouvelle_capacite * sizeof(Tache));
        if (nouveau == NULL)
        {
            fprintf(stderr, "Erreur : reallocation echouee\n");
            return -1;
        }
        liste->taches = nouveau;
        liste->capacite = nouvelle_capacite;
    }

    // Remplir la nouvelle tâche
    Tache *t = &liste->taches[liste->taille];
    strncpy(t->description, description, MAX_DESC - 1);
    t->description[MAX_DESC - 1] = '\0';
    t->statut = A_FAIRE;
    t->date_creation = time(NULL);

    liste->taille++;
    return 0;
}

int liste_terminer(ListeTaches *liste, int numero)
{
    // L'utilisateur donne un numéro basé sur 1
    int index = numero - 1;

    if (index < 0 || index >= liste->taille)
    {
        fprintf(stderr, "Erreur : tache #%d inexistante\n", numero);
        return -1;
    }

    if (liste->taches[index].statut == TERMINEE)
    {
        fprintf(stderr, "Info : tache #%d deja terminee\n", numero);
        return 0;
    }

    liste->taches[index].statut = TERMINEE;
    return 0;
}

int liste_supprimer(ListeTaches *liste, int numero)
{
    int index = numero - 1;

    if (index < 0 || index >= liste->taille)
    {
        fprintf(stderr, "Erreur : tache #%d inexistante\n", numero);
        return -1;
    }

    // Décaler toutes les tâches suivantes d'un cran vers la gauche
    for (int i = index; i < liste->taille - 1; i++)
    {
        liste->taches[i] = liste->taches[i + 1];
    }

    liste->taille--;
    return 0;
}

void liste_afficher(const ListeTaches *liste)
{
    if (liste->taille == 0)
    {
        printf("Aucune tache.\n");
        return;
    }

    printf("\n");
    printf("  #  | Statut | Description\n");
    printf("-----+--------+----------------------------------\n");

    int nb_faites = 0;
    int nb_total = liste->taille;

    for (int i = 0; i < liste->taille; i++)
    {
        const Tache *t = &liste->taches[i];
        const char *icone = (t->statut == TERMINEE) ? "[x]" : "[ ]";

        if (t->statut == TERMINEE)
        {
            nb_faites++;
        }

        printf("  %2d | %s    | %s\n", i + 1, icone, t->description);
    }

    printf("\n  %d/%d tache(s) terminee(s)\n", nb_faites, nb_total);
}
```

---

### Étape 3 : Implémenter la sauvegarde et le chargement

Crée le fichier `stockage.c` :

```c
#include "tache.h"

int sauvegarder(const ListeTaches *liste, const char *chemin)
{
    FILE *fichier = fopen(chemin, "wb");
    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur : impossible de creer '%s'\n", chemin);
        return -1;
    }

    // Écrire le nombre de tâches
    fwrite(&liste->taille, sizeof(int), 1, fichier);

    // Écrire chaque tâche
    if (liste->taille > 0)
    {
        size_t ecrits = fwrite(liste->taches, sizeof(Tache),
                               liste->taille, fichier);
        if ((int)ecrits != liste->taille)
        {
            fprintf(stderr, "Erreur : ecriture incomplete\n");
            fclose(fichier);
            return -1;
        }
    }

    fclose(fichier);
    return 0;
}

int charger(ListeTaches *liste, const char *chemin)
{
    FILE *fichier = fopen(chemin, "rb");
    if (fichier == NULL)
    {
        // Le fichier n'existe pas encore, ce n'est pas une erreur
        return 0;
    }

    // Lire le nombre de tâches
    int nb;
    if (fread(&nb, sizeof(int), 1, fichier) != 1)
    {
        fclose(fichier);
        return 0;
    }

    if (nb <= 0)
    {
        fclose(fichier);
        return 0;
    }

    // Allouer la mémoire nécessaire
    if (nb > liste->capacite)
    {
        Tache *nouveau = realloc(liste->taches, nb * sizeof(Tache));
        if (nouveau == NULL)
        {
            fprintf(stderr, "Erreur : allocation echouee au chargement\n");
            fclose(fichier);
            return -1;
        }
        liste->taches = nouveau;
        liste->capacite = nb;
    }

    // Lire les tâches
    size_t lus = fread(liste->taches, sizeof(Tache), nb, fichier);
    liste->taille = (int)lus;

    fclose(fichier);
    return 0;
}
```

---

### Étape 4 : Créer le point d'entrée

Crée le fichier `main.c` :

```c
#include "tache.h"

// Affiche l'aide
void afficher_aide(const char *nom_programme)
{
    printf("Gestionnaire de taches - todo\n\n");
    printf("Usage :\n");
    printf("  %s add <description>    Ajouter une tache\n", nom_programme);
    printf("  %s list                 Lister les taches\n", nom_programme);
    printf("  %s done <numero>        Marquer comme terminee\n", nom_programme);
    printf("  %s remove <numero>      Supprimer une tache\n", nom_programme);
    printf("  %s help                 Afficher cette aide\n", nom_programme);
}

int main(int argc, char *argv[])
{
    // Vérifier qu'une commande a été passée
    if (argc < 2)
    {
        afficher_aide(argv[0]);
        return 1;
    }

    // Initialiser la liste
    ListeTaches liste;
    if (liste_init(&liste) != 0)
    {
        return 1;
    }

    // Charger les tâches existantes depuis le fichier
    if (charger(&liste, FICHIER_SAUVEGARDE) != 0)
    {
        liste_liberer(&liste);
        return 1;
    }

    const char *commande = argv[1];
    int code_retour = 0;

    // Traiter la commande
    if (strcmp(commande, "add") == 0)
    {
        // Vérifier qu'une description a été fournie
        if (argc < 3)
        {
            fprintf(stderr, "Usage : %s add <description>\n", argv[0]);
            code_retour = 1;
        }
        else
        {
            if (liste_ajouter(&liste, argv[2]) == 0)
            {
                printf("Tache ajoutee : \"%s\"\n", argv[2]);
                sauvegarder(&liste, FICHIER_SAUVEGARDE);
            }
            else
            {
                code_retour = 1;
            }
        }
    }
    else if (strcmp(commande, "list") == 0)
    {
        liste_afficher(&liste);
    }
    else if (strcmp(commande, "done") == 0)
    {
        if (argc < 3)
        {
            fprintf(stderr, "Usage : %s done <numero>\n", argv[0]);
            code_retour = 1;
        }
        else
        {
            int numero = atoi(argv[2]);
            if (numero <= 0)
            {
                fprintf(stderr, "Erreur : numero invalide '%s'\n", argv[2]);
                code_retour = 1;
            }
            else if (liste_terminer(&liste, numero) == 0)
            {
                printf("Tache #%d marquee comme terminee\n", numero);
                sauvegarder(&liste, FICHIER_SAUVEGARDE);
            }
            else
            {
                code_retour = 1;
            }
        }
    }
    else if (strcmp(commande, "remove") == 0)
    {
        if (argc < 3)
        {
            fprintf(stderr, "Usage : %s remove <numero>\n", argv[0]);
            code_retour = 1;
        }
        else
        {
            int numero = atoi(argv[2]);
            if (numero <= 0)
            {
                fprintf(stderr, "Erreur : numero invalide '%s'\n", argv[2]);
                code_retour = 1;
            }
            else if (liste_supprimer(&liste, numero) == 0)
            {
                printf("Tache #%d supprimee\n", numero);
                sauvegarder(&liste, FICHIER_SAUVEGARDE);
            }
            else
            {
                code_retour = 1;
            }
        }
    }
    else if (strcmp(commande, "help") == 0)
    {
        afficher_aide(argv[0]);
    }
    else
    {
        fprintf(stderr, "Commande inconnue : '%s'\n", commande);
        fprintf(stderr, "Utilise '%s help' pour voir les commandes\n", argv[0]);
        code_retour = 1;
    }

    // Libérer la mémoire
    liste_liberer(&liste);

    return code_retour;
}
```

---

### Étape 5 : Créer le Makefile

Crée le fichier `Makefile` :

```makefile
CC = gcc
CFLAGS = -std=c17 -Wall -Wextra -Werror
TARGET = todo

# Fichiers objets
OBJ = main.o tache.o stockage.o

# Règle par défaut
all: $(TARGET)

# Liaison des fichiers objets
$(TARGET): $(OBJ)
    $(CC) $(OBJ) -o $(TARGET)

# Compilation de chaque fichier source
main.o: main.c tache.h
    $(CC) $(CFLAGS) -c main.c -o main.o

tache.o: tache.c tache.h
    $(CC) $(CFLAGS) -c tache.c -o tache.o

stockage.o: stockage.c tache.h
    $(CC) $(CFLAGS) -c stockage.c -o stockage.o

# Nettoyage
clean:
    rm -f $(OBJ) $(TARGET) $(TARGET).dat

.PHONY: all clean
```

---

### Étape 6 : Compiler et tester

```bash
# Compiler le projet
make
```

**Résultat attendu** :

```text
gcc -std=c17 -Wall -Wextra -Werror -c main.c -o main.o
gcc -std=c17 -Wall -Wextra -Werror -c tache.c -o tache.o
gcc -std=c17 -Wall -Wextra -Werror -c stockage.c -o stockage.o
gcc main.o tache.o stockage.o -o todo
```

Tester le programme :

```bash
# Afficher l'aide
./todo help

# Ajouter des tâches
./todo add "Apprendre les pointeurs"
./todo add "Finir l'exercice malloc"
./todo add "Reviser les structures"

# Lister les tâches
./todo list

# Marquer la tâche 1 comme terminée
./todo done 1

# Lister à nouveau
./todo list

# Supprimer la tâche 2
./todo remove 2

# Vérifier le résultat
./todo list
```

**Résultat attendu** :

```text
Gestionnaire de taches - todo

Usage :
  ./todo add <description>    Ajouter une tache
  ./todo list                 Lister les taches
  ./todo done <numero>        Marquer comme terminee
  ./todo remove <numero>      Supprimer une tache
  ./todo help                 Afficher cette aide

Tache ajoutee : "Apprendre les pointeurs"
Tache ajoutee : "Finir l'exercice malloc"
Tache ajoutee : "Reviser les structures"

  #  | Statut | Description
-----+--------+----------------------------------
   1 | [ ]    | Apprendre les pointeurs
   2 | [ ]    | Finir l'exercice malloc
   3 | [ ]    | Reviser les structures

  0/3 tache(s) terminee(s)

Tache #1 marquee comme terminee

  #  | Statut | Description
-----+--------+----------------------------------
   1 | [x]    | Apprendre les pointeurs
   2 | [ ]    | Finir l'exercice malloc
   3 | [ ]    | Reviser les structures

  1/3 tache(s) terminee(s)

Tache #2 supprimee

  #  | Statut | Description
-----+--------+----------------------------------
   1 | [x]    | Apprendre les pointeurs
   2 | [ ]    | Reviser les structures

  1/2 tache(s) terminee(s)
```

---

### Étape 7 : Vérifier l'absence de fuites mémoire

```bash
# Sur Linux avec valgrind
valgrind --leak-check=full ./todo add "Test valgrind"
valgrind --leak-check=full ./todo list

# Sur macOS avec Address Sanitizer
# Recompiler avec l'option
gcc -std=c17 -Wall -Wextra -Werror -fsanitize=address -g main.c tache.c stockage.c -o todo
./todo add "Test sanitizer"
./todo list
```

**Résultat attendu** (valgrind) :

```text
==12345== HEAP SUMMARY:
==12345==     in use at exit: 0 bytes in 0 blocks
==12345==   total heap usage: X allocs, X frees, Y bytes allocated
==12345==
==12345== All heap blocks were freed -- no leaks are possible
```

---

## Récapitulatif des Concepts Utilisés

| Concept | Où dans le projet |
| --- | --- |
| `struct` et `typedef` | Structure `Tache` et `ListeTaches` |
| `enum` | Statut `A_FAIRE` / `TERMINEE` |
| `malloc` / `realloc` / `free` | Tableau dynamique de tâches |
| `strncpy` / `strcmp` | Manipulation des descriptions et commandes |
| `fopen` / `fwrite` / `fread` / `fclose` | Sauvegarde binaire |
| `argc` / `argv` | Commandes en ligne de commande |
| Pointeurs et passage par adresse | Toutes les fonctions de gestion |
| Fichiers `.h` et `.c` séparés | Organisation multi-fichiers |
| Makefile | Compilation automatisée |
| `fprintf(stderr, ...)` | Messages d'erreur |

---

## Pistes d'Amélioration

Si tu veux aller plus loin avec ce projet, voici des idées :

1. **Priorité** : ajouter un champ priorité (haute, moyenne, basse) avec un enum
2. **Date d'échéance** : ajouter une date limite et afficher les tâches en retard
3. **Recherche** : ajouter une commande `./todo search "mot"` qui filtre les tâches
4. **Tri** : afficher les tâches triées par statut, date ou priorité
5. **Sauvegarde texte** : ajouter un export au format CSV ou texte lisible
6. **Couleurs** : utiliser les codes ANSI pour coloriser les tâches terminées en vert et les urgentes en rouge

---

## Pièges Fréquents

### Piège 1 : Oublier de sauvegarder après modification

**Problème** : Les modifications sont perdues si le programme ne sauvegarde pas après chaque commande qui modifie la liste.

**Solution** : Appeler `sauvegarder` après chaque `add`, `done` et `remove`.

---

### Piège 2 : Ne pas gérer les arguments invalides

**Problème** : `atoi("abc")` retourne 0 sans signaler d'erreur. L'utilisateur ne sait pas que son entrée est invalide.

**Solution** : Vérifier que `atoi` retourne une valeur positive et dans les bornes.

---

### Piège 3 : Oublier de libérer la mémoire en cas d'erreur

**Problème** : Si une erreur se produit au milieu du programme, la mémoire allouée n'est jamais libérée.

**Solution** : Avoir un seul point de sortie qui libère toute la mémoire, ou libérer avant chaque `return`.

---

## Checklist de Validation

- [ ] Le programme compile sans avertissement avec `-Wall -Wextra -Werror`
- [ ] La commande `add` ajoute une tâche et la sauvegarde
- [ ] La commande `list` affiche toutes les tâches avec leur statut
- [ ] La commande `done` marque une tâche comme terminée
- [ ] La commande `remove` supprime une tâche
- [ ] Les tâches persistent entre les exécutions (fichier binaire)
- [ ] Le programme gère les erreurs (fichier introuvable, numéro invalide, mémoire insuffisante)
- [ ] Aucune fuite mémoire (vérifiable avec valgrind)
- [ ] Le code est organisé en fichiers séparés (`.h` et `.c`)

---

## Pour Aller Plus Loin

### Conversion robuste des arguments : `strtol()` vs `atoi()`

Dans ce projet, `atoi()` est utilisé pour convertir les arguments numériques (`argv[2]`). Cette fonction a une limite importante : elle ne distingue pas les erreurs de conversion. `atoi("abc")` et `atoi("0")` retournent toutes deux `0` - impossible de savoir si l'entrée était invalide.

Pour du code robuste, `strtol()` est préférable :

```c
#include <stdlib.h>
#include <errno.h>

/* Conversion robuste : retourne -1 en cas d'erreur */
int convertir_entier(const char *chaine, int *resultat) {
    char *fin;
    errno = 0;
    long valeur = strtol(chaine, &fin, 10);

    /* fin pointe toujours sur le premier caractere non converti */
    if (errno != 0 || fin == chaine || *fin != '\0') {
        return -1; /* conversion echouee */
    }
    *resultat = (int)valeur;
    return 0;
}

/* Utilisation */
int numero;
if (convertir_entier(argv[2], &numero) != 0 || numero <= 0) {
    fprintf(stderr, "Erreur : numero invalide '%s'\n", argv[2]);
    return EXIT_FAILURE;
}
```

Tu as terminé le cursus Langage C. Tu maîtrises maintenant les fondamentaux : la compilation, les types, les structures de contrôle, les fonctions, les pointeurs, l'allocation dynamique, les structures et la gestion de fichiers.

Pour approfondir la gestion de la mémoire et découvrir une approche moderne de la programmation système, le [cursus Rust](../epitech/08-rust/index.md) est un complément naturel. Rust reprend les concepts de bas niveau du C (pointeurs, allocation) tout en ajoutant un système de propriété (ownership) qui élimine les fuites mémoire et les accès invalides à la compilation.

---

## Navigation

← Fiche précédente : **[09 - Fichiers et I/O](09-fichiers-io.md)**

Fin du cursus Langage C.
