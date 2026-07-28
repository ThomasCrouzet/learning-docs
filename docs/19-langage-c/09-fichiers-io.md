---
tags:
  - C
  - Intermédiaire
  - Pratique
description: "Lire et écrire des fichiers avec fopen, fread, fwrite et fclose, gérer stdin/stdout/stderr et les arguments de ligne de commande argc/argv."
estimated_time: "75 min"
fiche_number: 9
total_fiches: 10
cursus: "Langage C"
---

# 09 - Fichiers et I/O

> **En bref** : Ouvrir, lire et écrire des fichiers avec les fonctions standard du C, comprendre les flux stdin/stdout/stderr et exploiter les arguments de ligne de commande argc/argv. Lecture estimée : 75 min.

## Prérequis

- [08 - Structures et unions](08-structures-unions.md) : savoir créer et manipuler des structures

## Objectif de cette fiche

À la fin de cette fiche, tu sauras ouvrir et fermer des fichiers, lire et écrire du texte et des données binaires, utiliser les flux standard et récupérer les arguments passés en ligne de commande.

---

## Concepts

Cette section explique tous les concepts nécessaires. Lis-la entièrement avant de passer aux étapes pratiques.

### Qu'est-ce qu'un flux (stream) ?

**Définition** : Un flux est un canal de communication entre le programme et une source ou destination de données (fichier, clavier, écran). En C, tous les échanges de données passent par des flux, représentés par le type `FILE *`.

**Le problème que les flux résolvent** :

Sans flux, voici les problèmes rencontrés :

1. **Pas de persistance** : les variables du programme disparaissent à la fin de l'exécution. Impossible de sauvegarder les résultats.
2. **Accès matériel direct** : lire un fichier sur disque nécessiterait de programmer les instructions du contrôleur de disque, différentes sur chaque machine.

**Comment les flux résolvent ces problèmes** :

| Problème | Solution apportée par les flux |
| --- | --- |
| Pas de persistance | Les fichiers conservent les données entre les exécutions |
| Accès matériel direct | Le système d'exploitation gère le matériel, le programme utilise une interface unifiée (FILE *) |

**Analogie concrète** : Un flux, c'est comme un tuyau d'eau. Tu ouvres le robinet (fopen), l'eau coule dans un sens (lecture) ou dans l'autre (écriture), et tu fermes le robinet quand tu as fini (fclose). Tu n'as pas besoin de savoir comment fonctionne la plomberie derrière le mur.

**Les trois flux standard** :

| Flux | Nom | Description |
| --- | --- | --- |
| `stdin` | Entrée standard | Clavier (ou redirection depuis un fichier) |
| `stdout` | Sortie standard | Écran (ou redirection vers un fichier) |
| `stderr` | Sortie d'erreur | Écran (séparé de stdout pour les messages d'erreur) |

Ces trois flux sont ouverts automatiquement au démarrage du programme.

---

### Qu'est-ce que argc/argv ?

**Définition** : `argc` (argument count) est le nombre d'arguments passés au programme en ligne de commande. `argv` (argument vector) est un tableau de chaînes contenant les arguments. `argv[0]` est toujours le nom du programme.

**Le problème que argc/argv résout** :

Sans arguments de ligne de commande, voici le problème rencontré :

1. **Configuration figée** : le programme fait toujours la même chose. Pour changer le fichier d'entrée ou une option, il faut modifier le code source et recompiler.

**Comment argc/argv résout ce problème** :

| Problème | Solution |
| --- | --- |
| Configuration figée | Les arguments permettent de paramétrer le programme à chaque exécution |

**Analogie concrète** : Les arguments de ligne de commande, c'est comme les ingrédients que tu donnes à un cuisinier. Le cuisinier (le programme) a une recette (le code), mais tu choisis les ingrédients (les arguments) à chaque repas.

---

## Étapes Pratiques

### Étape 1 : Écrire dans un fichier texte

Crée un fichier `ecrire_fichier.c` :

```c
#include <stdio.h>

int main(void)
{
    // fopen ouvre un fichier
    // "w" = écriture (write) - crée le fichier ou écrase le contenu existant
    // "a" = ajout (append) - ajoute à la fin sans écraser
    // "r" = lecture (read) - lit le fichier existant
    FILE *fichier = fopen("notes.txt", "w");

    // Toujours vérifier que fopen a réussi
    if (fichier == NULL)
    {
        // fprintf sur stderr pour les messages d'erreur
        fprintf(stderr, "Erreur : impossible de creer le fichier\n");
        return 1;
    }

    // fprintf fonctionne comme printf, mais écrit dans un fichier
    fprintf(fichier, "=== Notes des etudiants ===\n\n");
    fprintf(fichier, "Alice   : 15.5\n");
    fprintf(fichier, "Bob     : 12.0\n");
    fprintf(fichier, "Charlie : 17.5\n");

    // fputs écrit une chaîne sans formatage
    fputs("\n--- Fin du rapport ---\n", fichier);

    // fclose ferme le fichier et écrit les données en attente sur le disque
    fclose(fichier);

    printf("Fichier 'notes.txt' cree avec succes\n");

    // Vérification : lire le fichier créé
    FILE *lecture = fopen("notes.txt", "r");
    if (lecture == NULL)
    {
        fprintf(stderr, "Erreur : impossible de lire le fichier\n");
        return 1;
    }

    printf("\nContenu du fichier :\n");
    char ligne[256];
    // fgets lit une ligne (max 255 caractères + '\0')
    while (fgets(ligne, sizeof(ligne), lecture) != NULL)
    {
        // printf affiche la ligne (fgets conserve le '\n')
        printf("  %s", ligne);
    }

    fclose(lecture);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror ecrire_fichier.c -o ecrire_fichier
./ecrire_fichier
```

**Résultat attendu** :

```text
Fichier 'notes.txt' cree avec succes

Contenu du fichier :
  === Notes des etudiants ===

  Alice   : 15.5
  Bob     : 12.0
  Charlie : 17.5

  --- Fin du rapport ---
```

---

### Étape 2 : Lire un fichier texte ligne par ligne

Crée un fichier `lire_fichier.c` :

```c
#include <stdio.h>
#include <string.h>

int main(void)
{
    FILE *fichier = fopen("notes.txt", "r");

    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur : fichier 'notes.txt' introuvable\n");
        fprintf(stderr, "Execute d'abord le programme ecrire_fichier\n");
        return 1;
    }

    char ligne[256];
    int numero_ligne = 0;

    printf("Lecture ligne par ligne :\n\n");

    while (fgets(ligne, sizeof(ligne), fichier) != NULL)
    {
        numero_ligne++;

        // Retirer le '\n' en fin de ligne
        size_t len = strlen(ligne);
        if (len > 0 && ligne[len - 1] == '\n')
        {
            ligne[len - 1] = '\0';
        }

        printf("Ligne %2d : \"%s\"\n", numero_ligne, ligne);
    }

    printf("\nTotal : %d lignes lues\n", numero_ligne);

    // feof retourne vrai si la fin du fichier a été atteinte
    if (feof(fichier))
    {
        printf("Fin du fichier atteinte normalement\n");
    }

    fclose(fichier);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror lire_fichier.c -o lire_fichier
./lire_fichier
```

**Résultat attendu** :

```text
Lecture ligne par ligne :

Ligne  1 : "=== Notes des etudiants ==="
Ligne  2 : ""
Ligne  3 : "Alice   : 15.5"
Ligne  4 : "Bob     : 12.0"
Ligne  5 : "Charlie : 17.5"
Ligne  6 : ""
Ligne  7 : "--- Fin du rapport ---"

Total : 7 lignes lues
Fin du fichier atteinte normalement
```

---

### Étape 3 : Fichiers binaires (fread/fwrite)

Crée un fichier `binaire.c` :

```c
#include <stdio.h>
#include <string.h>

typedef struct
{
    char nom[30];
    int age;
    float note;
} Etudiant;

int main(void)
{
    // Écriture binaire
    Etudiant classe[] = {
        {"Alice", 22, 15.5f},
        {"Bob", 20, 12.0f},
        {"Charlie", 21, 17.5f}
    };
    int nb = sizeof(classe) / sizeof(classe[0]);

    // "wb" = écriture binaire (write binary)
    FILE *fichier = fopen("etudiants.dat", "wb");
    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur d'ouverture en ecriture\n");
        return 1;
    }

    // Écrire le nombre d'étudiants d'abord
    fwrite(&nb, sizeof(int), 1, fichier);

    // Écrire toutes les structures d'un coup
    // fwrite(source, taille_element, nb_elements, fichier)
    size_t ecrits = fwrite(classe, sizeof(Etudiant), nb, fichier);
    printf("Ecriture : %zu etudiants ecrits dans 'etudiants.dat'\n", ecrits);

    fclose(fichier);

    // Lecture binaire
    // "rb" = lecture binaire (read binary)
    fichier = fopen("etudiants.dat", "rb");
    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur d'ouverture en lecture\n");
        return 1;
    }

    // Lire le nombre d'étudiants
    int nb_lus;
    fread(&nb_lus, sizeof(int), 1, fichier);
    printf("\nLecture : %d etudiants dans le fichier\n\n", nb_lus);

    // Lire les structures une par une
    Etudiant e;
    for (int i = 0; i < nb_lus; i++)
    {
        // fread(destination, taille_element, nb_elements, fichier)
        fread(&e, sizeof(Etudiant), 1, fichier);
        printf("  %s, %d ans, note : %.1f\n", e.nom, e.age, e.note);
    }

    fclose(fichier);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror binaire.c -o binaire
./binaire
```

**Résultat attendu** :

```text
Ecriture : 3 etudiants ecrits dans 'etudiants.dat'

Lecture : 3 etudiants dans le fichier

  Alice, 22 ans, note : 15.5
  Bob, 20 ans, note : 12.0
  Charlie, 21 ans, note : 17.5
```

---

### Étape 4 : Arguments de ligne de commande (argc/argv)

Crée un fichier `arguments.c` :

```c
#include <stdio.h>
#include <stdlib.h>

int main(int argc, char *argv[])
{
    // argc = nombre d'arguments (inclut le nom du programme)
    // argv = tableau de chaînes
    // argv[0] = nom du programme
    // argv[1] = premier argument, etc.

    printf("Nombre d'arguments : %d\n\n", argc);

    printf("Arguments :\n");
    for (int i = 0; i < argc; i++)
    {
        printf("  argv[%d] = \"%s\"\n", i, argv[i]);
    }

    // Exemple pratique : un programme qui attend un nom de fichier
    if (argc < 2)
    {
        fprintf(stderr, "\nUsage : %s <fichier> [options]\n", argv[0]);
        fprintf(stderr, "Options :\n");
        fprintf(stderr, "  -n    Afficher les numeros de ligne\n");
        fprintf(stderr, "  -c    Compter les lignes\n");
        return 1;
    }

    // Vérifier les options
    int afficher_numeros = 0;
    int compter_seulement = 0;

    for (int i = 2; i < argc; i++)
    {
        if (argv[i][0] == '-' && argv[i][1] == 'n')
        {
            afficher_numeros = 1;
        }
        else if (argv[i][0] == '-' && argv[i][1] == 'c')
        {
            compter_seulement = 1;
        }
    }

    // Ouvrir le fichier passé en argument
    FILE *fichier = fopen(argv[1], "r");
    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur : impossible d'ouvrir '%s'\n", argv[1]);
        return 1;
    }

    char ligne[1024];
    int nb_lignes = 0;

    printf("\n--- Contenu de %s ---\n", argv[1]);
    while (fgets(ligne, sizeof(ligne), fichier) != NULL)
    {
        nb_lignes++;
        if (!compter_seulement)
        {
            if (afficher_numeros)
            {
                printf("%3d | %s", nb_lignes, ligne);
            }
            else
            {
                printf("%s", ligne);
            }
        }
    }

    if (compter_seulement)
    {
        printf("%d lignes\n", nb_lignes);
    }

    fclose(fichier);

    return 0;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror arguments.c -o arguments

# Sans arguments
./arguments

# Avec un fichier
./arguments notes.txt

# Avec numéros de ligne
./arguments notes.txt -n

# Compter les lignes seulement
./arguments notes.txt -c
```

**Résultat attendu** (avec `./arguments notes.txt -n`) :

```text
Nombre d'arguments : 3

Arguments :
  argv[0] = "./arguments"
  argv[1] = "notes.txt"
  argv[2] = "-n"

--- Contenu de notes.txt ---
  1 | === Notes des etudiants ===
  2 |
  3 | Alice   : 15.5
  4 | Bob     : 12.0
  5 | Charlie : 17.5
  6 |
  7 | --- Fin du rapport ---
```

---

### Étape 5 : stderr et codes de retour

Crée un fichier `erreurs.c` :

```c
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

// Codes de retour par convention
#define EXIT_OK 0
#define EXIT_USAGE 1
#define EXIT_FICHIER 2

int main(int argc, char *argv[])
{
    // Messages d'erreur sur stderr (pas stdout)
    // Cela permet de rediriger stdout vers un fichier
    // sans que les erreurs y soient mélangées

    if (argc != 2)
    {
        fprintf(stderr, "Usage : %s <fichier>\n", argv[0]);
        return EXIT_USAGE;
    }

    FILE *fichier = fopen(argv[1], "r");
    if (fichier == NULL)
    {
        // perror affiche le message d'erreur système
        // (par exemple : "No such file or directory")
        fprintf(stderr, "Erreur pour '%s' : ", argv[1]);
        perror("");
        return EXIT_FICHIER;
    }

    // Traitement normal sur stdout
    char ligne[256];
    int nb_mots = 0;
    int nb_lignes = 0;
    int nb_octets = 0;

    while (fgets(ligne, sizeof(ligne), fichier) != NULL)
    {
        nb_lignes++;
        nb_octets += strlen(ligne);

        // Compter les mots (séparés par des espaces)
        char *mot = strtok(ligne, " \t\n");
        while (mot != NULL)
        {
            nb_mots++;
            mot = strtok(NULL, " \t\n");
        }
    }

    // Résultat sur stdout
    printf("%d lignes, %d mots, %d octets : %s\n",
           nb_lignes, nb_mots, nb_octets, argv[1]);

    fclose(fichier);

    return EXIT_OK;
}
```

```bash
gcc -std=c17 -Wall -Wextra -Werror erreurs.c -o erreurs

# Fichier existant
./erreurs notes.txt

# Fichier inexistant (l'erreur va sur stderr)
./erreurs inexistant.txt

# Redirection : stdout dans un fichier, erreurs à l'écran
./erreurs notes.txt > resultat.txt
cat resultat.txt
```

**Résultat attendu** :

```text
7 lignes, 13 mots, 102 octets : notes.txt
```

---

## Commandes Utiles

| Fonction | Action |
| --- | --- |
| `fopen(nom, mode)` | Ouvre un fichier ("r", "w", "a", "rb", "wb") |
| `fclose(fichier)` | Ferme un fichier |
| `fprintf(fichier, fmt, ...)` | Écrit du texte formaté dans un fichier |
| `fscanf(fichier, fmt, ...)` | Lit des données formatées depuis un fichier |
| `fgets(buf, size, fichier)` | Lit une ligne (sécurisé) |
| `fputs(str, fichier)` | Écrit une chaîne dans un fichier |
| `fread(buf, taille, nb, fichier)` | Lit des données binaires |
| `fwrite(buf, taille, nb, fichier)` | Écrit des données binaires |
| `feof(fichier)` | Vérifie si la fin du fichier est atteinte |
| `perror(msg)` | Affiche le message d'erreur système |

---

## Pièges Fréquents

### Piège 1 : Oublier de fermer un fichier

**Problème** : Les données ne sont pas écrites sur le disque tant que le fichier n'est pas fermé (elles restent en mémoire tampon). Le système a aussi un nombre limité de fichiers ouverts simultanément.

**Solution** : Toujours appeler `fclose` après utilisation.

```c
FILE *f = fopen("data.txt", "w");
fprintf(f, "Hello");
// Données peut-être pas encore sur le disque
fclose(f);  // Maintenant elles le sont
```

---

### Piège 2 : Ne pas vérifier le retour de fopen

**Problème** : Si le fichier n'existe pas ou si les permissions sont insuffisantes, fopen retourne NULL. Utiliser un FILE * NULL provoque un crash.

**Solution** : Toujours vérifier `if (fichier == NULL)`.

---

### Piège 3 : Confondre "w" et "a"

**Problème** : Le mode "w" écrase le contenu existant du fichier. Si tu voulais ajouter des données, tout le contenu précédent est perdu.

**Solution** : Utiliser "a" (append) pour ajouter à la fin sans écraser.

```c
// Écrase le fichier à chaque ouverture
FILE *f = fopen("log.txt", "w");

// Ajoute à la fin du fichier existant
FILE *f = fopen("log.txt", "a");
```

---

### Piège 4 : Utiliser feof comme condition de boucle

**Problème** : `feof` retourne vrai uniquement après une tentative de lecture qui a échoué. Utiliser `while (!feof(f))` lit une fois de trop.

**Solution** : Utiliser le retour de fgets ou fread comme condition de boucle.

```c
// INCORRECT - lit une ligne vide en trop
while (!feof(fichier))
{
    fgets(ligne, sizeof(ligne), fichier);
    printf("%s", ligne);
}

// CORRECT - s'arrête quand fgets retourne NULL
while (fgets(ligne, sizeof(ligne), fichier) != NULL)
{
    printf("%s", ligne);
}
```

---

### Piège 5 : Mélanger texte et binaire

**Problème** : Ouvrir un fichier binaire en mode texte ("r" au lieu de "rb") peut transformer certains caractères sur Windows (le `\n` est converti).

**Solution** : Utiliser "rb"/"wb" pour les fichiers binaires.

---

## Checklist de Validation

- [ ] Je sais ouvrir et fermer un fichier avec fopen et fclose
- [ ] Je comprends les modes d'ouverture ("r", "w", "a", "rb", "wb")
- [ ] Je sais lire un fichier texte ligne par ligne avec fgets
- [ ] Je sais écrire dans un fichier avec fprintf et fputs
- [ ] Je sais lire et écrire des données binaires avec fread et fwrite
- [ ] Je sais utiliser argc et argv pour récupérer les arguments de ligne de commande
- [ ] Je comprends la différence entre stdout et stderr

---

## Exercice Pratique

**Énoncé** : Crée un programme `compteur.c` qui compte les lignes, les mots et les caractères d'un fichier (similaire à la commande `wc` de Linux).

1. Le programme reçoit le nom du fichier en argument (`./compteur fichier.txt`)
2. Il lit le fichier ligne par ligne
3. Il affiche : le nombre de lignes, le nombre de mots, le nombre de caractères
4. S'il reçoit l'option `-l`, il affiche uniquement le nombre de lignes
5. Sans argument, il affiche l'usage

**Indications** :

- Utilise `strtok` pour compter les mots (séparateurs : espace, tabulation, retour à la ligne)
- `strlen` pour compter les caractères de chaque ligne
- Gère les erreurs sur stderr

**Résultat attendu** (avec `notes.txt`) :

```text
  7  13  102 notes.txt
```

---

## Solution de l'Exercice

> **Note** : Cette section contient la solution complète. Essaie d'abord de résoudre l'exercice par toi-même avant de consulter cette solution.

---

```c
#include <stdio.h>
#include <string.h>

int main(int argc, char *argv[])
{
    if (argc < 2)
    {
        fprintf(stderr, "Usage : %s [-l] <fichier>\n", argv[0]);
        return 1;
    }

    // Déterminer les options et le fichier
    int lignes_seules = 0;
    const char *nom_fichier = NULL;

    for (int i = 1; i < argc; i++)
    {
        if (strcmp(argv[i], "-l") == 0)
        {
            lignes_seules = 1;
        }
        else
        {
            nom_fichier = argv[i];
        }
    }

    if (nom_fichier == NULL)
    {
        fprintf(stderr, "Erreur : aucun fichier specifie\n");
        return 1;
    }

    FILE *fichier = fopen(nom_fichier, "r");
    if (fichier == NULL)
    {
        fprintf(stderr, "Erreur : impossible d'ouvrir '%s'\n", nom_fichier);
        return 1;
    }

    int nb_lignes = 0;
    int nb_mots = 0;
    int nb_chars = 0;
    char ligne[4096];

    while (fgets(ligne, sizeof(ligne), fichier) != NULL)
    {
        nb_lignes++;
        nb_chars += strlen(ligne);

        // Copie pour strtok (qui modifie la chaîne)
        char copie[4096];
        strcpy(copie, ligne);

        char *mot = strtok(copie, " \t\n");
        while (mot != NULL)
        {
            nb_mots++;
            mot = strtok(NULL, " \t\n");
        }
    }

    fclose(fichier);

    if (lignes_seules)
    {
        printf("%d %s\n", nb_lignes, nom_fichier);
    }
    else
    {
        printf("  %d  %d  %d %s\n", nb_lignes, nb_mots, nb_chars, nom_fichier);
    }

    return 0;
}
```

---

## Navigation

← Fiche précédente : **[08 - Structures et unions](08-structures-unions.md)**

→ Fiche suivante : **[10 - Projet intégrateur](10-projet-integrateur.md)**
